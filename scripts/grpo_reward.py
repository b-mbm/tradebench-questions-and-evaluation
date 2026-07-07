#!/usr/bin/env python3
"""
grpo_reward.py — Reward function for GRPO: TS grader via tsx subprocess.

Design:
  - A long-lived tsx subprocess reads JSON batches from stdin, writes JSON scores
    to stdout. Avoids ~400ms Node startup per rollout.
  - Two modes:
      mode="real"      → score = grader pass/fail (1.0 / 0.0)
      mode="shuffled"  → score = real score but PERMUTED within each group
                         (np.random.permutation per group per step, seeded)
                         This is the null-reward control: rewards are uncorrelated
                         with rollout quality, so any score movement is contamination.

The grader is the frozen src/grading/schema-grader-300q.ts (path b decision).
Questions + rubrics are loaded inside the tsx worker from the repo's TS modules.

Protocol (one batch per stdin line, one result array per stdout line):
  stdin:  [{"id","prompt","response","expected","rubric_id"}, ...]
  stdout: [{"id","score","pass","detail"}, ...]
"""
import os
import sys
import json
import subprocess
import threading
import random
import numpy as np
from pathlib import Path

# ─── The tsx worker script (embedded) ──────────────────────────────────────
# Loaded once per subprocess. Reads JSON batch from stdin, grades each row,
# writes JSON score array to stdout.

TSX_WORKER_SRC = r"""
import { createInterface } from 'readline';
import { SCHEMA_QUESTIONS_300Q } from '../src/questions/schema-questions-300q';
import { loadRubric300q } from '../src/rubrics/loader-300q';
import { gradeSchemaResponse } from '../src/grading/schema-grader-300q';

// Build a lookup: id -> { question, rubric }
const QUESTIONS: Record<string, any> = {};
for (const q of SCHEMA_QUESTIONS_300Q as any[]) {
  try {
    QUESTIONS[q.id] = { q, rubric: loadRubric300q(q.rubric_id) };
  } catch (e) {
    // rubric may not load for some; mark as missing
    QUESTIONS[q.id] = { q, rubric: null };
  }
}

const rl = createInterface({ input: process.stdin, crlfDelay: Infinity });

rl.on('line', (line) => {
  if (!line.trim()) return;
  let batch: any[];
  try { batch = JSON.parse(line); } catch (e) { process.stdout.write(JSON.stringify({error: 'parse: '+e.message}) + '\n'); return; }
  const out = batch.map((row) => {
    try {
      const lookup = QUESTIONS[row.id];
      if (!lookup) return { id: row.id, score: 0.0, pass: false, detail: 'no question' };
      const { q, rubric } = lookup;
      if (!rubric) return { id: row.id, score: 0.0, pass: false, detail: 'no rubric' };
      // The response is the model's raw text. Grade it.
      const raw = typeof row.response === 'string' ? row.response : JSON.stringify(row.response);
      const result = gradeSchemaResponse(raw, q, rubric);
      return {
        id: row.id,
        score: result.pass ? 1.0 : 0.0,
        pass: result.pass,
        detail: result.pass ? 'pass' : (result.reason || 'fail'),
        raw_score: result.score,
      };
    } catch (e) {
      return { id: row.id || '?', score: 0.0, pass: false, detail: 'error: '+e.message };
    }
  });
  process.stdout.write(JSON.stringify(out) + '\n');
});

rl.on('close', () => process.exit(0));
"""


class GraderSubprocess:
    """Long-lived tsx subprocess for batch grading.

    Thread-safe via a lock. One process per trainer worker.
    """

    def __init__(self, repo_root: str):
        self.repo_root = Path(repo_root).resolve()
        # Write the worker script to a temp file in the repo
        self.worker_path = self.repo_root / "scripts" / "_grader_worker.ts"
        self.worker_path.write_text(TSX_WORKER_SRC)

        self._proc = None
        self._lock = threading.Lock()
        self._start()

    def _start(self):
        """Start the tsx subprocess."""
        env = os.environ.copy()
        # Ensure tsx is on PATH
        env["PATH"] = f"{self.repo_root}/node_modules/.bin:/usr/local/bin:/usr/bin:" + env.get("PATH", "")
        self._proc = subprocess.Popen(
            ["npx", "tsx", str(self.worker_path)],
            cwd=str(self.repo_root),
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1,  # line-buffered
            env=env,
        )

    def grade_batch(self, batch):
        """Grade a batch of rollouts.

        Args:
            batch: list of dicts with keys {id, response}
        Returns:
            list of dicts with keys {id, score, pass, detail}
        """
        with self._lock:
            if self._proc is None or self._proc.poll() is not None:
                self._start()
            line = json.dumps(batch) + "\n"
            try:
                self._proc.stdin.write(line)
                self._proc.stdin.flush()
                result_line = self._proc.stdout.readline()
                if not result_line:
                    err = self._proc.stderr.read()[-2000:] if self._proc.stderr else ""
                    return [{"id": r.get("id", "?"), "score": 0.0, "pass": False, "detail": f"subprocess died: {err}"} for r in batch]
                result = json.loads(result_line)
                if isinstance(result, dict) and "error" in result:
                    return [{"id": r.get("id", "?"), "score": 0.0, "pass": False, "detail": f"grader error: {result['error']}"} for r in batch]
                return result
            except (BrokenPipeError, json.JSONDecodeError) as e:
                return [{"id": r.get("id", "?"), "score": 0.0, "pass": False, "detail": f"io error: {e}"} for r in batch]

    def close(self):
        with self._lock:
            if self._proc and self._proc.poll() is None:
                try:
                    self._proc.stdin.close()
                    self._proc.wait(timeout=5)
                except Exception:
                    self._proc.kill()
            self._proc = None


class GRPOReward:
    """GRPO reward function with real and shuffled-reward modes.

    For the null-reward control, use mode="shuffled": within each group of G
    rollouts for a question, scores are permuted (np.random.permutation).
    Rewards become uncorrelated with quality → any policy drift is contamination.

    Usage:
        reward = GRPOReward(mode="shuffled", repo_root="/workspace/repo", seed=42)
        # Per step, per question group:
        scores = reward.score_group(question_id, responses)
    """

    def __init__(
        self,
        mode: str = "real",
        repo_root: str = ".",
        seed: int = 42,
        shuffle_seed: int = None,
    ):
        assert mode in ("real", "shuffled"), f"unknown mode {mode}"
        self.mode = mode
        self.repo_root = repo_root
        self.seed = seed
        # Separate RNG for shuffle so it's independent of any other RNG use
        self._shuffle_rng = np.random.default_rng(shuffle_seed if shuffle_seed is not None else seed)
        self._step = 0
        self._grader = None  # lazy init (heavy)
        self._score_log = []

    def _ensure_grader(self):
        if self._grader is None:
            self._grader = GraderSubprocess(self.repo_root)

    def score_group(self, question_id: str, responses: list) -> list:
        """Score a group of G rollouts for one question.

        Returns a list of float scores (one per response).
        In 'real' mode: the true grader score.
        In 'shuffled' mode: the true scores permuted within this group.
        """
        self._ensure_grader()
        batch = [{"id": question_id, "response": r} for r in responses]
        results = self._grader.grade_batch(batch)
        real_scores = [float(r.get("score", 0.0)) for r in results]

        if self.mode == "real":
            self._log(question_id, real_scores, real_scores, "real")
            return real_scores

        # shuffled mode: permute within group
        if len(real_scores) > 1:
            perm = self._shuffle_rng.permutation(len(real_scores))
            shuffled = [real_scores[i] for i in perm]
        else:
            shuffled = real_scores[:]

        self._log(question_id, real_scores, shuffled, "shuffled")
        return shuffled

    def step_done(self):
        """Call after all groups in a step are scored."""
        self._step += 1
        # Reseed the shuffle RNG per step for a different permutation each step
        # but deterministically (seed + step) so reruns are reproducible
        self._shuffle_rng = np.random.default_rng(self.seed + self._step)

    def _log(self, qid, real, used, mode):
        entry = {
            "step": self._step,
            "question_id": qid,
            "mode": mode,
            "real_scores": real,
            "used_scores": used,
            "group_size": len(real),
            "real_mean": float(np.mean(real)) if real else 0.0,
            "used_mean": float(np.mean(used)) if used else 0.0,
        }
        self._score_log.append(entry)

    def flush_log(self, path: str):
        """Write the score log to disk for offline audit."""
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w") as f:
            for entry in self._score_log:
                f.write(json.dumps(entry) + "\n")
        print(f"  [reward] wrote {len(self._score_log)} score entries to {path}")

    def close(self):
        if self._grader:
            self._grader.close()
            self._grader = None


# ─── TRL reward_func interface ────────────────────────────────────────────
def make_trl_reward_func(reward: GRPOReward):
    """Wrap a GRPOReward into the function signature TRL expects.

    TRL calls reward_func(prompts, completions, **kwargs) where
      prompts: list[str]
      completions: list[str]
      kwargs may include 'question_id' if passed through the dataset.

    Returns a list[float] of rewards.
    """
    def reward_func(prompts, completions, **kwargs):
        # TRL groups completions by prompt (G per prompt). We need the question_id
        # to look up rubrics. The dataset must carry question_id as an extra column.
        qids = kwargs.get("question_id", [])
        # Group completions by question_id (TRL preserves group order)
        rewards = []
        if qids:
            # Assume completions are ordered: group 0 (G items), group 1 (G items)...
            seen = {}
            groups = {}
            for i, qid in enumerate(qids):
                groups.setdefault(qid, []).append(i)
            # Score each group, scatter back to per-completion order
            score_map = {}
            for qid, idxs in groups.items():
                group_responses = [completions[i] for i in idxs]
                group_scores = reward.score_group(qid, group_responses)
                for j, idx in enumerate(idxs):
                    score_map[idx] = group_scores[j]
            rewards = [score_map[i] for i in range(len(completions))]
        else:
            # No question_id → score all as one group (degraded, for smoke test)
            group_scores = reward.score_group("smoke", completions)
            rewards = group_scores
        return rewards

    reward_func.__name__ = "grader_reward"
    return reward_func


if __name__ == "__main__":
    # Self-test: grade a fake batch
    print("=== grpo_reward self-test ===")
    repo = os.environ.get("REPO_ROOT", ".")
    r = GRPOReward(mode="shuffled", repo_root=repo, seed=42)

    # Fake responses — one good, one bad
    fake_good = json.dumps({"decision": "trade", "reasoning": "test"})
    fake_bad = "garbage not json"
    scores = r.score_group("L1-001", [fake_good, fake_bad, fake_good, fake_bad])
    print(f"shuffled scores (group of 4): {scores}")
    print(f"sum: {sum(scores)} (should match 2 real passes, just reordered)")

    r.mode = "real"
    real = r.score_group("L1-001", [fake_good, fake_bad])
    print(f"real scores (group of 2): {real}")

    r.close()
    print("self-test OK")
