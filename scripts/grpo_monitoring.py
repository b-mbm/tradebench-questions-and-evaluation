#!/usr/bin/env python3
"""
grpo_monitoring.py — GRPO monitoring instruments (Phase 0, Step 4).

Standalone importable module the future GRPO training loop calls. Implements the
instruments Schulman and Finn mandated (council 2026-07-03):

  (a) KLFromReferenceLogger  — Schulman's Gate 4: log KL(π_current || π_reference)
      every step; warn if >10 nats or jumps >3 nats/step.
  (b) RewardHackArgmaxDumper — Schulman's Gate 5: save the highest-reward rollout
      per prompt group every N steps for human review (reasoning vs label-farming).
  (c) label_string_entropy   — Finn: track diversity of emitted chosen_strategy/
      intent strings across rollouts; collapse toward a small set = hacking tell.
  (d) length_tracker         — Finn/R-DPO: track length of rewarded vs non-rewarded
      rollouts; winners systematically longer = length-hacking tell.

Self-test (prove-it-can-fail): synthetic inputs that trigger each warning.

Integration note: the GRPO loop calls these at the following cadence:
  - KLFromReferenceLogger: every gradient step (after compute_loss, before step).
  - RewardHackArgmaxDumper: every 30 steps (dump_argmax).
  - label_string_entropy + length_tracker: every step, cheap (computed over rollouts).
All outputs go to results/grpo-runs/<run>/ for a single self-contained audit trail.
"""
from __future__ import annotations
import json
import math
import os
from dataclasses import dataclass, field, asdict
from typing import Any

import numpy as np


# ─────────────────────────────────────────────────────────────────────────────
# (a) KL-from-reference logger  — Schulman Gate 4
# ─────────────────────────────────────────────────────────────────────────────
@dataclass
class KLLogEntry:
    step: int
    kl: float
    delta_from_prev: float
    warning: str | None = None


class KLFromReferenceLogger:
    """Logs KL(π_current || π_reference) each step. Per-token estimate: mean(logp_cur - logp_ref).

    This is the TRL/DeepSeek GRPO KL estimator — the forward-KL contribution evaluated at the
    sampled tokens (unbiased when tokens are drawn from the current policy).
    Healthy: single-digit nats, slow growth. Warns on:
      - KL > 10 nats (drift heading for collapse/reward-hacking)
      - single-step jump > 3 nats (discontinuous drift)
    """

    def __init__(self, run_dir: str, kl_warn_threshold: float = 10.0, jump_warn_threshold: float = 3.0):
        self.path = os.path.join(run_dir, "kl_log.jsonl")
        self.kl_warn = kl_warn_threshold
        self.jump_warn = jump_warn_threshold
        self._prev_kl: float | None = None
        os.makedirs(run_dir, exist_ok=True)
        # truncate
        open(self.path, "w").close()

    @staticmethod
    def compute_kl(current_logprobs: np.ndarray, reference_logprobs: np.ndarray) -> float:
        """Approximation of KL(π_current || π_reference) over the sampled tokens in a rollout.

        In GRPO, KL is estimated over the tokens the model actually generated (not the full
        vocabulary). The standard per-token estimator is:
            KL ≈ mean_t [ logp_current(t) - logp_reference(t) ]
        This is the forward-KL contribution evaluated at the sampled tokens (an unbiased
        estimator of the true KL when tokens are drawn from the current policy). It is the
        form used by TRL/DeepSeek for the KL penalty in GRPO.

        Args:
          current_logprobs: log-probs of the SAMPLED tokens under the CURRENT policy. Shape (T,).
          reference_logprobs: log-probs of the SAME sampled tokens under the REFERENCE policy. Shape (T,).
        Returns:
          mean per-token KL estimate in nats (sum over the T sampled tokens / T).
        """
        logp_cur = np.asarray(current_logprobs, dtype=np.float64)
        logp_ref = np.asarray(reference_logprobs, dtype=np.float64)
        # Per-token KL estimate at the sampled positions
        kl_per_token = logp_cur - logp_ref
        return float(np.sum(kl_per_token) / max(len(kl_per_token), 1))

    def log(self, step: int, current_logprobs: np.ndarray, reference_logprobs: np.ndarray,
            per_prompt: dict[str, tuple[np.ndarray, np.ndarray]] | None = None) -> KLLogEntry:
        """Compute + record KL for this step. per_prompt maps prompt_id -> (cur_lp, ref_lp)."""
        kl = self.compute_kl(current_logprobs, reference_logprobs)
        delta = (kl - self._prev_kl) if self._prev_kl is not None else 0.0
        warning = None
        if kl > self.kl_warn:
            warning = f"KL_HIGH: {kl:.2f} > {self.kl_warn} nats — drift heading for collapse; raise β, lower LR"
        elif self._prev_kl is not None and delta > self.jump_warn:
            warning = f"KL_JUMP: +{delta:.2f} nats in one step — discontinuous drift"

        entry = KLLogEntry(step=step, kl=round(kl, 4), delta_from_prev=round(delta, 4), warning=warning)
        record = asdict(entry)
        if per_prompt:
            record["per_prompt_kl"] = {
                pid: round(self.compute_kl(cur, ref), 4)
                for pid, (cur, ref) in per_prompt.items()
            }
        with open(self.path, "a") as f:
            f.write(json.dumps(record) + "\n")
        self._prev_kl = kl
        return entry


# ─────────────────────────────────────────────────────────────────────────────
# (b) Reward-hack argmax dump — Schulman Gate 5
# ─────────────────────────────────────────────────────────────────────────────
class RewardHackArgmaxDumper:
    """Every N steps, save the highest-reward rollout per prompt group.

    A human reads these to check: is the model REASONING to the answer, or has it
    found a shortcut (regurgitating the hidden chosen_strategy string, gaming format,
    padding length)? The tell is score climbing while reasoning quality degrades.
    """

    def __init__(self, run_dir: str, dump_every: int = 30):
        self.dump_dir = os.path.join(run_dir, "argmax_dump")
        self.dump_every = dump_every
        os.makedirs(self.dump_dir, exist_ok=True)

    def maybe_dump(self, step: int, groups: list[dict]) -> bool:
        """Dump argmax rollout per group if step is on cadence.

        Args:
          step: current gradient step.
          groups: list of {prompt_id, rollouts: [{reward, text, field_scores, finish_reason}]}.
        Returns True if a dump was written.
        """
        if step % self.dump_every != 0 and step != 0:
            return False
        out_path = os.path.join(self.dump_dir, f"step_{step}.jsonl")
        with open(out_path, "w") as f:
            for g in groups:
                if not g.get("rollouts"):
                    continue
                best = max(g["rollouts"], key=lambda r: r.get("reward", 0))
                record = {
                    "prompt_id": g["prompt_id"],
                    "reward": best.get("reward"),
                    "rollout_text": best.get("text", "")[:4000],  # cap for readability
                    "field_scores": best.get("field_scores", {}),
                    "finish_reason": best.get("finish_reason"),
                }
                f.write(json.dumps(record) + "\n")
        return True


# ─────────────────────────────────────────────────────────────────────────────
# (c) Label-string entropy — Finn's collapse detector
# ─────────────────────────────────────────────────────────────────────────────
def shannon_entropy(values: list[str]) -> float:
    """Shannon entropy (base-2) over a list of string values. High = diverse, low = collapsed."""
    if not values:
        return 0.0
    counts: dict[str, int] = {}
    for v in values:
        counts[v] = counts.get(v, 0) + 1
    n = len(values)
    h = 0.0
    for c in counts.values():
        p = c / n
        h -= p * math.log2(p)
    return h


def label_string_entropy(rollouts: list[dict], field: str = "chosen_strategy",
                         extracted: dict | None = None) -> dict:
    """Track entropy of a label field across a prompt group's rollouts.

    Reward-hacking presents as entropy collapsing toward a small set of canonical
    phrasings the model has learned are rewarded. Compare step-0 entropy to step-N.

    Args:
      rollouts: list of rollout dicts (each may have parsed JSON under 'parsed' or 'extracted').
      field: which label field to track ('chosen_strategy' or 'intent').
      extracted: optional pre-parsed {rollout_idx: {field: value}}.
    Returns:
      {entropy, n_unique, n_total, values (first 10), warning}
    """
    values: list[str] = []
    for i, r in enumerate(rollouts):
        if extracted and i in extracted:
            v = extracted[i].get(field)
        else:
            parsed = r.get("parsed") or r.get("extracted") or {}
            v = parsed.get(field) if isinstance(parsed, dict) else None
        if v is not None:
            values.append(str(v))
    h = shannon_entropy(values)
    unique = len(set(values))
    warning = None
    if len(values) >= 4 and unique <= 2 and h < 0.5:
        warning = (f"LABEL_COLLAPSE: {field} entropy {h:.2f} over {len(values)} rollouts with only "
                   f"{unique} unique values — possible label-string farming")
    return {
        "field": field, "entropy": round(h, 3), "n_unique": unique,
        "n_total": len(values), "values": list(set(values))[:10], "warning": warning,
    }


# ─────────────────────────────────────────────────────────────────────────────
# (d) Length tracker — Finn/R-DPO length-hacking tell
# ─────────────────────────────────────────────────────────────────────────────
def length_tracker(rollouts: list[dict]) -> dict:
    """Compare length (chars or tokens) of rewarded vs non-rewarded rollouts.

    R-DPO (arxiv:2403.19159) proved length-hacking: the spurious correlate was response
    length. If winners are systematically longer than losers, length is being absorbed
    as apparent capability. Monitor this as a PRIMARY metric, not a footnote.

    Args:
      rollouts: list of {reward, text or token_count}.
    Returns:
      {mean_winner_len, mean_loser_len, ratio, warning}
    """
    def length_of(r: dict) -> int:
        if "token_count" in r:
            return int(r["token_count"])
        return len(r.get("text", ""))

    if not rollouts:
        return {"mean_winner_len": 0, "mean_loser_len": 0, "ratio": 1.0, "warning": None}

    median_reward = float(np.median([r.get("reward", 0) for r in rollouts]))
    winners = [r for r in rollouts if r.get("reward", 0) > median_reward]
    losers = [r for r in rollouts if r.get("reward", 0) <= median_reward]
    mw = float(np.mean([length_of(r) for r in winners])) if winners else 0.0
    ml = float(np.mean([length_of(r) for r in losers])) if losers else 0.0
    ratio = mw / ml if ml > 0 else 1.0
    warning = None
    if ratio > 1.25 and len(winners) >= 2 and len(losers) >= 2:
        warning = (f"LENGTH_HACK: winners {mw:.0f} chars vs losers {ml:.0f} (ratio {ratio:.2f}) — "
                   "rewarded rollouts systematically longer (R-DPO tell)")
    return {
        "mean_winner_len": round(mw, 1), "mean_loser_len": round(ml, 1),
        "ratio": round(ratio, 3), "warning": warning,
    }


# ─────────────────────────────────────────────────────────────────────────────
# SELF-TEST (prove-it-can-fail) — feed synthetic inputs that SHOULD trigger each warning
# ─────────────────────────────────────────────────────────────────────────────
def _self_test() -> bool:
    """Returns True if all instruments correctly fire on their trigger inputs AND stay silent on clean inputs."""
    import tempfile
    tmp = tempfile.mkdtemp(prefix="grpo_monitor_test_")
    ok = True

    # --- KL: high KL should warn ---
    kl_logger = KLFromReferenceLogger(tmp, kl_warn_threshold=10.0, jump_warn_threshold=3.0)
    # The per-token KL estimator is mean(logp_cur - logp_ref) over sampled tokens.
    # To exceed 10 nats, each sampled token must have logp_cur >> logp_ref (current
    # much more confident than reference). Construct: current assigns high prob,
    # reference assigns vanishingly low prob, to a sequence of sampled tokens.
    cur_lp = np.log(np.full(50, 0.5))           # current confident: each token prob 0.5
    ref_lp = np.log(np.full(50, 1e-7))          # reference near-zero: each token prob 1e-7
    entry = kl_logger.log(step=1, current_logprobs=cur_lp, reference_logprobs=ref_lp)
    assert entry.warning and "KL_HIGH" in entry.warning, f"FAIL: high KL did not warn (kl={entry.kl})"
    # clean KL should not warn (current == reference → KL ≈ 0)
    kl_logger2 = KLFromReferenceLogger(tmp, kl_warn_threshold=10.0, jump_warn_threshold=3.0)
    clean_lp = np.log(np.full(10, 0.1))  # identical log-probs
    e0 = kl_logger2.log(step=0, current_logprobs=clean_lp, reference_logprobs=clean_lp)
    assert e0.warning is None, "FAIL: identical distributions warned (false positive)"
    e1 = kl_logger2.log(step=1, current_logprobs=clean_lp, reference_logprobs=clean_lp)
    assert e1.warning is None, "FAIL: identical distributions warned on step 2"
    print("  ✓ KL logger: fires on high KL, silent on identical distributions")

    # --- Argmax dump: should write file on cadence ---
    dumper = RewardHackArgmaxDumper(tmp, dump_every=30)
    groups = [{"prompt_id": "TEST-1", "rollouts": [
        {"reward": 0.9, "text": "best answer", "field_scores": {"x": 1}, "finish_reason": "stop"},
        {"reward": 0.3, "text": "worse answer", "field_scores": {"x": 0}, "finish_reason": "stop"},
    ]}]
    wrote = dumper.maybe_dump(step=0, groups=groups)
    assert wrote, "FAIL: argmax dump did not write on step 0"
    with open(os.path.join(tmp, "argmax_dump", "step_0.jsonl")) as f:
        line = json.loads(f.readline())
        assert line["reward"] == 0.9 and "best answer" in line["rollout_text"], "FAIL: dumped wrong rollout"
    nope = dumper.maybe_dump(step=5, groups=groups)
    assert not nope, "FAIL: argmax dump wrote off-cadence"
    print("  ✓ Argmax dumper: writes best rollout on cadence, skips off-cadence")

    # --- Label entropy: collapse should warn ---
    collapsed = [{"parsed": {"chosen_strategy": "same_label"}}] * 8
    ent = label_string_entropy(collapsed, "chosen_strategy")
    assert ent["warning"] and "LABEL_COLLAPSE" in ent["warning"], f"FAIL: collapse did not warn (h={ent['entropy']})"
    diverse = [{"parsed": {"chosen_strategy": f"label_{i}"}} for i in range(8)]
    ent2 = label_string_entropy(diverse, "chosen_strategy")
    assert ent2["warning"] is None, "FAIL: diverse labels warned (false positive)"
    print("  ✓ Label entropy: warns on collapse, silent on diversity")

    # --- Length tracker: winners much longer should warn ---
    hack_rollouts = [{"reward": 1.0, "text": "x" * 500} for _ in range(4)] + \
                    [{"reward": 0.0, "text": "x" * 100} for _ in range(4)]
    lt = length_tracker(hack_rollouts)
    assert lt["warning"] and "LENGTH_HACK" in lt["warning"], f"FAIL: length hack did not warn (ratio={lt['ratio']})"
    balanced = [{"reward": 1.0, "text": "x" * 200} for _ in range(4)] + \
               [{"reward": 0.0, "text": "x" * 190} for _ in range(4)]
    lt2 = length_tracker(balanced)
    assert lt2["warning"] is None, "FAIL: balanced lengths warned (false positive)"
    print("  ✓ Length tracker: warns on length-hack, silent on balanced")

    return ok


if __name__ == "__main__":
    import sys
    print("=== grpo_monitoring self-test (prove-it-can-fail) ===")
    try:
        passed = _self_test()
        print(f"\nSELF-TEST: {'PASS' if passed else 'FAIL'} — each instrument fires on its trigger and stays silent on clean input.")
        sys.exit(0 if passed else 1)
    except AssertionError as e:
        print(f"\nSELF-TEST: FAIL — {e}")
        sys.exit(1)
