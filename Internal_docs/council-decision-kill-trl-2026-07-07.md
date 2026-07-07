# Council Decision: Kill TRL Server-Mode Integration → Hand-Rolled GRPO Loop

**Date:** 2026-07-07
**Branch:** phase0-grpo-preconditions
**Council seats:** Schulman, Lambert, Finn, Liang (all convened, isolated contexts)
**Decision type:** Architecture pivot (consequential, hard-to-reverse GPU spend avoided)

## The trigger

While building Phase A (weight-sync glue), we verified from TRL's actual source code that `vllm_mode="server"` CANNOT connect to SGLang:

1. **Constructor crash**: TRL calls `/get_world_size/`, `/init_communicator/` (NCCL process group) at construction. SGLang implements none of these. Trainer dies before step 0.
2. **Rollout endpoint mismatch**: TRL POSTs to `/generate/` and `/chat/` (vLLM custom endpoints returning token IDs + logprobs). Never calls `/v1/chat/completions`. SGLang never receives rollouts.
3. **Weight sync crash**: TRL calls `vllm_client.update_named_param()` → vLLM's `/start_weight_update/` + `/update_weights/`. Hard crash, no try/except. SGLang doesn't implement these.
4. **No disable flag**: No `sync_model=False`. Sync fires whenever `use_vllm=True`.
5. **Colocate mode requires vLLM**: dead end for Qwen3.6-27B + json_object + thinking (bugs #43388, #18819).

The weight-sync glue I wrote (`grpo_sglang_glue.py`) solved a problem that can't exist — TRL never connects to SGLang.

## Council consensus (4/4 agree)

**Option A (hand-rolled GRPO loop) is the only viable path.** TRL server-mode is dead for SGLang. verl is an unknown risk on Qwen3.6-27B hybrid architecture. TRL `use_vllm=False` is too slow ($60-100).

## Key directives from individual seats

### Schulman (Seat 1) — strip the spec
- The entire TRL-based spec is over-built. At ratio=1 (single update, on-policy), the PPO clip is a **literal no-op**. REINFORCE + group-relative advantage IS GRPO with the dead code removed.
- **For the null control: skip per-step weight sync entirely.** The reward is noise → it doesn't matter which policy generated the rollouts. Run all rollouts from base SGLang, merge LoRA once at the end for eval. Deletes ~45min of 54GB save/reload overhead. Budget: ~$5-6.
- Drop the KL penalty (random zero-mean advantages don't create runaway drift). But **log KL-from-reference** as a monitor.
- Option D fails the stated constraint (needs real backprop) — D tests sampling-retrieval, not training-activation. But run it as a $2 pre-screen.

### Lambert (Seat 2) — the gate's own design
- Keep the KL term (makes a positive result more damning).
- Pre-register the pass/fail bar: `delta_null > 2·√(SEM_base² + SEM_null²)`.
- 30 steps is defensible IF contamination is large. Budget a mid-run eval at step 15.
- **Asymmetric power**: this control is biased toward false negatives. A null at 30 steps is "no signal at this power," NOT "proven clean."
- Critical: the QLoRA forward-pass logprobs MUST match SGLang's tokenization exactly, or the advantage-weighted gradient is silently garbage.

### Finn (Seat 3) — the silent confounds
- **QLoRA precision mismatch**: SGLang generates at full precision; QLoRA forward pass computes logprobs at 4-bit. Importance ratio ≠ 1.0 for identical tokens. Quantization noise injects systematic bias independent of reward. **The null baseline must use the same code path as the real run.**
- **Length-coupled random walk**: shuffled reward + per-token logprobs means longer completions contribute more gradient mass per "positive" assignment. Plot completion-length over training steps.
- **Scoping question**: is the hypothesis GRPO-specific or training-data-specific? If training-data-specific, SFT-null is cheaper and cleaner.

### Liang (Seat 4) — the eval is not yet a valid test
- **SEM built on sand**: base variance (12/10/11) was on a 35-subset. Gate eval is ~175 questions. Different distributions. Must measure between-run σ on the ACTUAL gate set at the ACTUAL temperature.
- **Fix α and minimum detectable effect before spending**: gate without stated false-positive rate is unfalsifiable.
- **Don't collapse to one number**: run the gate as a 2×3 panel {base, null-trained} × {27 training, 8 held-out, 202-rest} + per-tier + label-string entropy.
- **Separate eval-contamination from training-contamination**: base at temp 0 (greedy) on held-out = eval contamination floor. `score(null-trained) − score(base)` net of that floor = training-induced contamination.

## Synthesized decision

### Architecture
1. **Kill TRL integration.** Delete `null_reward_control.py` (TRL-dependent). Replace with hand-rolled `grpo_null_loop.py`.
2. **Strip the loss**: REINFORCE + group-relative advantage. No PPO clip (no-op at ratio=1). Log KL-from-reference as monitor, don't penalize.
3. **Off-policy for null control**: SGLang serves all rollouts from base. Merge LoRA only at checkpoint evals (steps 10/20/30 = 3 syncs, not 30).
4. **Handle QLoRA precision**: compute logprobs from training forward pass. Document the quantization bias. Use same code path for real run.
5. **Track completion length** per step (Finn's length-hack tell).

### Sequencing (pre-screen before training)
1. **Phase B FIRST** (cheapest, most informative): base eval K=5 on gate set + Option D probe. ~$5. This gives the SEM AND the contamination pre-screen.
2. **Phase B analysis**: if Option D shows severe contamination → the question may be answered. If clean → proceed to training.
3. **Phase C/D**: hand-rolled null-reward loop, sized by Phase B's results.

### Eval design (Liang's 2×3 panel)
- Strata: {27 training, 8 held-out, ~167 rest}
- Conditions: {base, null-reward-trained}
- Metrics: pass-count, per-tier, label-string entropy, completion-length
- Statistical test: `delta_null > 2·√(SEM_base² + SEM_null²)`, one-sided upward, two-sided reported

## Files affected

- **DELETE/REPLACE**: `scripts/null_reward_control.py` → `scripts/grpo_null_loop.py`
- **KEEP**: `scripts/grpo_sglang_glue.py` (the SGLang weight-sync APIs are still needed for checkpoint evals)
- **KEEP**: `scripts/grpo_reward.py` (reward function + shuffled mode, still needed)
- **NEW**: `scripts/build-gate-eval-set.ts` (202 verifiable minus 27 training = ~175 gate set)
- **KEEP**: `scripts/sglang_grpo_startup.sh` (needs adaptation for hand-rolled loop)

## Confidence: HIGH

4/4 seats agree on the path. The blind-spot hunt found no missing perspective that changes the decision — the systems/infra concerns (OOM risk, wall-clock) are engineering execution risks, not architecture risks.
