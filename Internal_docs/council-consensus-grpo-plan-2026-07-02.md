# Post-Training Council — GRPO Plan Consensus
**Date:** 2026-07-02  ·  **Lead:** Seat 1 (Schulman)  ·  **Quorum:** Schulman, Lambert, Finn (Seat 4 Liang's lane — grader/eval design — surfaced by Seats 2 & 3; Liang not separately spawned)
**Trigger:** Capability probe completed → 39/53 failed questions show latent capability (correct answer appears at temp 0.7). Probe committed `4397f17`.

---

## 1. The verdict: GRPO is GO, conditionally

**Unanimous across all three seats on the core question:**

- **GRPO is viable** on the 39 latent-capability questions. The probe is the decisive evidence — the correct completion is *in the support of the policy's distribution*, which is the one regime where on-policy RL does what SFT/DPO structurally cannot. (Schulman: "the right tool"; Finn: "the probe vindicates GRPO on the 39"; Lambert: "the strongest single piece of evidence in this whole file.")
- **Exclude all 14 knowledge-deficit questions** (0/16). RL cannot install knowledge the policy cannot sample. Training on them yields zero gradient *and* injects noise into the advantage normalization that destabilizes the 39. (Finn's R-DPO mechanism; Schulman's "pure compute waste.")
- **Expectation is bounded and honest:** ~16–24 of the 39 flip from inconsistent to reliable = **+12 to +20 on the full 300Q** (161 → ~173–181), *if* the gates pass. Zero gain on the 14 deficit, by construction. Treat any gain >~10% as suspicious until the held-out delta reproduces (Finn).

The conditions below are **non-negotiable gates**, not suggestions. Every seat independently arrived at the same set.

---

## 2. The gates (all required, in sequence)

| # | Gate | Owner | Status |
|---|---|---|---|
| 0 | **Null-reward control** — train GRPO with shuffled/random reward; if 300Q moves, gain is Qwen-base contamination, not skill | Lambert | **NOT RUN — run as parallel arm to run #1** |
| 1 | **Grader-label reconciliation** — the grader exact-match-scores hidden labels (`intent`/`chosen_strategy`) the prompt never discloses. This is not "verifiable" in the RLVR sense; it's a hidden oracle. **Disclose the label space in the prompt OR soft-match** before trusting any reward. | Lambert/Liang | **NOT DONE — do before any GPU-hour on GRPO** |
| 2 | **Held-out unseen split** — carve ~8 of the 39 latent out of training; measure transfer there | Schulman/Finn | **NOT BUILT** |
| 3 | **Rerun variance** — ≥3× reruns of the 300Q config, report mean ± spread | Lambert | Existing ±3 at temp 0.1 |
| 4 | **KL-from-reference** — log every step; healthy = single-digit nats slow growth; >~10–15 nats or discontinuous jump → raise β, lower LR | Schulman | Monitoring |
| 5 | **Reward-hacking audit** — every ~30 steps dump the argmax rollout per group; watch for score climbing while reasoning degrades (label-guessing, format-gaming, length-hacking) | Schulman/Finn | Monitoring |
| 6 | **The honest number** — delta over base on full 300Q at temp 0.1 with variance bars, not training-set score | Lambert | Final |

**Schulman's standing gate, restated:** format pass-rate must be >95% before RL starts. If the model can't reliably emit valid JSON, RL on top is noise.

**The two most important things that are NOT done** and must happen before any GRPO GPU-hour:
1. **Gate 1 (grader-label reconciliation)** — Lambert calls this "the gating decision, not the algorithm." Hours of work, decides everything.
2. **Gate 0 (null-reward control)** — the only thing that distinguishes "RL taught the model" from "the model was already contaminated and we rattled it loose."

---

## 3. Reward design (consensus)

- **Use the continuous `normalizedScore` (0–1), NOT binary pass.** Binary pass is too sparse: on low-latent questions most groups yield 0/8 → zero advantage → zero gradient. The grader already emits per-field weighted scores; reward = `sum(fieldScores) / sum(weights)`. Decomposition comes free.
- **The reward function == the eval function.** No hand-rolled proxy that can drift from the grader. Call the real TypeScript `gradeSchemaResponse` from Python via a **long-lived `tsx` subprocess** (read JSON batches on stdin, write scores on stdout) — ~20-line wrapper, zero reimplementation, zero divergence from eval.
- **No length penalty initially** (Schulman). *Monitor* median completion length of winning vs losing rollouts per group; add a mild penalty only if winners are systematically longer. This is Finn's R-DPO canary.

---

## 4. Training data (consensus)

- **Train on item-disjoint siblings of the latent-capability skills only**, held out from the 300Q eval. (Finn: "train on the actual 300Q = the most literal possible overfit.") The existing SFT contamination-gate machinery (skeleton/Jaccard/5-gram-cosine) applies.
- **Hold out ~8 of the 39 latent** as the unseen generalization probe.
- **Rollout temperature must stay exploratory (0.7–1.0).** Sampling at eval temp 0.1 kills the signal GRPO needs. This is the one place training-time and eval-time sampling legitimately differ.

---

## 5. Config (Schulman, uncontested by others)

| Param | Value |
|---|---|
| Algorithm | GRPO (no critic) |
| Adapter | LoRA r=32 (match SFT recipe; SGLang already hot-loads it) |
| `num_generations` G | 8 (→16 only if 8 looks noise-starved) |
| Prompts/step | ~8–16 unique |
| LR | 1e-5 LoRA (→3e-5 if flat) |
| KL coef β | 0.04 (DeepSeek default; →0.1 if KL runs away) |
| Clip ε | 0.2 |
| Length penalty | None initially (monitor) |
| `max_completion` | 12,000 tokens |
| Rollout temp | 0.7–1.0 (exploratory) |
| Steps | ~150–300, budget-bounded |

---

## 6. THE DISAGREEMENT — platform

This is the one place the seats split, and it's what you asked me to resolve.

**Schulman (lead):** Hand-rolled GRPO loop, SGLang as generation server, PEFT trainer, **one 2× H100 pod**. Reasoning: our own skill documents vLLM as a dead end for Qwen3.6-27B + json_object + thinking (bug #43388 empty content; #18819 reasoning-parser/grammar collapse). TRL's `GRPOTrainer` colocate mode *depends on vLLM as the in-process generation server* — if vLLM can't generate valid thinking-JSON for this architecture, TRL colocate can't generate rollouts. "TRL+vLLM is the TRPO here — elegant, but it doesn't run on our model."

**Lambert:** Use TRL's GRPOTrainer or OpenRLHF; **do not hand-roll.** "Lambert-of-2026 has seen too many 'implemented wrong' reward models." Algorithm is substitutable; the implementation you can debug is not. Recommends TRL (already on HF stack) or OpenRLHF (better multi-GPU rollout throughput).

**Finn (analogy only — robotics scale):** Lean batch-to-online, large groups, update less often. Rollout throughput is the bottleneck, not the optimizer. Treat as analogy not prescription.

### Resolution: TRL's GRPOTrainer algorithm + SGLang as a *remote* generation server (not vLLM colocate)

The disagreement dissolves once you separate **the algorithm** (Lambert's lane — don't rewrite it) from **the generation server** (Schulman's lane — don't use vLLM on this architecture). TRL's `GRPOTrainer` supports `vllm_mode="server"`, which talks to **any OpenAI-compatible endpoint** — and SGLang exposes exactly that. So:

- **Algorithm:** TRL `GRPOTrainer` (proven, not hand-rolled — Lambert's demand ✓)
- **Generation server:** SGLang, our proven serve config with `--lora-paths` + ninja symlink + `--reasoning-parser qwen3` (Schulman's demand — no vLLM ✓)
- **Reward:** our TS grader via stdin-stdin subprocess (reward == eval ✓)

**The open risk (flagged honestly):** TRL↔SGLang weight-sync on the *server* path is less battle-tested than TRL↔vLLM colocate. After each gradient step TRL must push updated LoRA weights to the SGLang server so rollouts come from the *current* policy. If SGLang can't hot-reload the LoRA path mid-run cleanly, this falls back to one of:
  - (a) **Periodic-restart hybrid:** hand-roll the outer loop only (sample → score → one TRL `compute_loss`/`step` → save adapter → SGLang reloads adapter path). This is Schulman's hand-roll, but only ~150 lines of glue around TRL's loss, not a from-scratch optimizer. **Likely fallback if pure server-mode breaks.**
  - (b) **OpenRLHF** with SGLang as the rollout backend (OpenRLHF is explicitly designed for pluggable rollout engines).

**Practical pre-flight (cheap, decides this):** before committing the $50–100, spend ~$3 on a single 2× H100 pod and verify (1) SGLang serves base + LoRA and reloads an adapter on file-swap, (2) TRL server-mode can hit the SGLang `/v1/completions` endpoint and get thinking+JSON rollouts back. If both green → full TRL+SGLang run. If weight-sync breaks → fall back to (a).

### Hardware & cost

- **One 2× H100 80GB pod** (not two single-GPU pods): GPU 0 = SGLang generation, GPU 1 = trainer. Shared `/workspace` volume → LoRA reload is a local path swap, no network copy. RunPod Secure, region US-MO-1, volume `tradebench`.
- **~$6.6/hr** (2× H100 Secure). Budget $50–100 → **~7–14 hours wall-clock**, enough for ~150–300 steps on 31 prompts × G=8.
- **Stop pod when idle** ($3.29/hr×2 only while running). Volume persists.

---

## 7. Sequencing (the order operations must happen)

1. **Gate 1 — grader-label reconciliation** (no GPU needed; hours of work). Disclose label space in prompt OR soft-match `intent`/`chosen_strategy`. Reconcile probe-"right" with grader-"right" on the 39.
2. **Build held-out split** (carve 8 of 39 latent).
3. **Pre-flight on 2× H100** (~$3): verify SGLang serve+reload + TRL server-mode rollout round-trip. Decides platform finally.
4. **Gate 0 — null-reward control** (run as parallel arm to GRPO run #1, same data/steps, shuffled reward).
5. **GRPO run #1** — 31 train prompts, G=8, ~150–300 steps, KL/hack monitoring on.
6. **Eval** — full 300Q at temp 0.1, ≥3× reruns, held-out 8 transfer. Report delta over base with variance bars.
7. Decision: transfer held-out → ship / iterate. No transfer → stop (memorization).

---

## 8. The 14 knowledge-deficit questions (flagged for later, NOT this run)

`L10-004, L10-011, L10-014, L10-025, L2-004, L4-003, L4-005, L5-001, L5-002, L7-001, L7-002, L9-019, L9-035, L9-045`

These are an **SFT/knowledge-injection problem, not an RL problem.** GRPO cannot help. Note for a later tranche: curate or collect more data for these skills, or accept the model doesn't know them. This is the true ceiling for RL on this benchmark.

---

## TL;DR for the operator

- **GRPO is GO** on the 39 latent, exclude the 14 deficit. Expect **+12 to +20** on 300Q, gated.
- **Platform: TRL `GRPOTrainer` (algorithm) + SGLang (generation server), one 2× H100 pod, LoRA r=32.** Hand-roll only the ~150-line glue if TRL↔SGLang weight-sync breaks in pre-flight.
- **Before any GPU-hour:** reconcile the grader's hidden labels (Gate 1), build held-out split (Gate 2).
- **Cheap pre-flight (~$3)** decides the platform finally — don't commit $50 until SGLang-serve+reload and TRL-server-rollout both round-trip cleanly.
- **Null-reward control runs as a parallel arm** to GRPO run #1.
- **Reward = continuous `normalizedScore` from the real TS grader** via stdin subprocess. Reward == eval. No proxy.
