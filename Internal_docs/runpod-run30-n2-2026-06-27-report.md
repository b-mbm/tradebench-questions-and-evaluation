# RunPod 29×2 (n=2) Run — Base vs SFT on the Hard-Tier Set
**Date:** 2026-06-27 → 2026-06-28 · **Pod:** vfp294dpl2hbud (H100 80GB) · **Status:** EXITED, data verified local before stop.

Harness: no-`json_object`, reasoning-parser `qwen3`, max_model_len 32768, `--enforce-eager`, bf16, LoRA r=32.
Run config: temp 0.1, `BUDGET_LADDER=26000,31000`, `CONCURRENCY=8`, **`TRANSPORT_RETRIES=6`** (= 7 attempts, exact parity with OpenRouter's `maxRetries=6`).
Two independent passes (pass1, pass2) into separate dirs off one shared serve. 116/116 rows `ok`/`stop`, **zero truncation, zero transport retries fired, zero parse failures.**

Raw data: `results/community/300/runpod-run30-n2-2026-06-27/{pass1,pass2}/generations.jsonl` + `graded-run30_pass{1,2}.json`.

---

## Headline result

| metric | base (control) | sft (fine-tune) | Δ |
|---|---|---|---|
| pass@1 — draw 1 | 17/29 | 19/29 | +2 |
| pass@1 — draw 2 | 20/29 | 19/29 | **−1** |
| **pass@1 avg** | **18.5/29** | **19.0/29** | **+0.5** |
| **pass@2 (either draw)** | **20/29** | **22/29** | **+2** |

**The fine-tune delta is within run-to-run noise at pass@1.** Base swung 17→20 (+3) between two draws on the *same* harness with nothing changed; sft was stable at 19. A +0.5 average delta is smaller than the base's own draw-to-draw swing. **At pass@1, n=2 cannot distinguish a real signal from noise here.**

At pass@2 (the cumulative ceiling), sft is +2 ahead (22 vs 20). That's a more promising signal — but read the AGI caveat below.

## The variance finding (this is the most important result)

**8 of 29 questions (28%) flipped pass/fail across the two draws**, including 2 AGI rows. Same model, same harness, same prompt, same temperature — different answer. This is the single most important thing this run produced:

> **A single pass@1 on this benchmark is not a stable measurement.** The base model scoring 17 vs 20 on two identical runs (a 3-point / 17% swing) proves that any headline number from n=1 is ±3 points of noise. Every prior "the fine-tune didn't help / hurt" conclusion drawn from a single draw is unreliable.

Variance rows: `L6-003, L9-002, L9-003, L9-006, L10-001, L10-003, AGI-004, AGI-024`

## Per-tier breakdown

| tier | base pass@1 avg | base @2 | sft pass@1 avg | sft @2 | Δ@2 |
|---|---|---|---|---|---|
| L1-8 | 5.0/7 | 5/7 | 5.5/7 | 6/7 | +1 |
| L9 | 6.0/8 | 6/8 | 5.5/8 | 7/8 | +1 |
| L10 | 7.0/8 | 8/8 | 6.5/8 | 7/8 | −1 |
| **AGI** | **0.5/6** | **1/6** | **1.5/6** | **2/6** | **+1** |

- **L9/L10 are near-saturated** (base solves 6/8 and 8/8 at @2) — these tiers can't show fine-tune gains because the base already passes them. Any real fine-tune signal has to come from the failures: L4-001, L6-003, L9-006, L9-007.
- **AGI is where the signal lives, and where the noise is worst.** Base 0.5/6 avg, sft 1.5/6 avg. The sft genuinely passed AGI-014 twice (clean — passed on both draws) and AGI-024 once. Base passed AGI-004 once. With only 6 AGI rows × 2 draws, n is too small to call this significant, but it's the one place sft shows a consistent (not noisy) edge.

## AGI detail (the hypothesis-test rows)

| AGI row | base d1 | base d2 | sft d1 | sft d2 | read |
|---|---|---|---|---|---|
| AGI-001 | fail | fail | fail | fail | genuine miss (both, both draws) |
| AGI-002 | fail | fail | fail | fail | genuine miss (both, both draws) |
| AGI-003 | fail | fail | fail | fail | genuine miss (both, both draws) |
| AGI-004 | fail | **pass** | fail | fail | noisy; base solved once |
| AGI-014 | fail | fail | **pass** | **pass** | **sft consistent** — clean signal |
| AGI-024 | fail | fail | **pass** | fail | sft solved once |

**AGI-014 is the cleanest fine-tune signal in the entire run**: sft passed it on *both* independent draws; base failed it on both. That's the kind of consistency that distinguishes a real capability gain from a coin-flip. AGI-001/002/003 are genuine misses for both models — not harness artifacts.

## OpenRouter reproduction (control metric)

| | base d1 | base d2 | sft d1 | sft d2 |
|---|---|---|---|---|
| reproduced OR passes | 17/26 (65%) | 20/26 (77%) | 19/26 (73%) | 19/26 (73%) |

RunPod base reproduced 65–77% of what OpenRouter passed — and the swings between draws (65%→77%) again reflect the same variance, not a harness defect. The unreproduced rows are value mismatches (e.g. `l9_expected_value_mismatch`, `ladder_size_unreasonable`) and the AGI `intent`/`chosen_strategy` soft-penalties, not parse or truncation failures.

## Token usage (truncation is solved)

- median completion: ~3,700 tokens; max 13,688 (base AGI-002 draw 1)
- All 116 rows `finish_reason: stop`. The 26k budget never bound. Token-budget is no longer a failure mode.
- Notable: AGI-002 sft produced **11,296 tokens in draw 1 but 5,921 in draw 2** — a 2× length variance on the identical prompt. Reasoning-model output length is itself stochastic.

## Honest interpretation (what we can and can't say)

**Can say (high confidence):**
1. **The harness is now clean and stable.** 116/116 ok/stop, no truncation, no parse failures, no transport retries. The json_object collapse and token-starvation bugs that produced the fake 38/300 are gone.
2. **n=1 on this benchmark is unreliable.** ±3 points of noise on base alone. This is the methodology gap that has been hiding real signals (or non-signals) in every prior single-draw comparison.
3. **AGI-014 is a real, consistent fine-tune win** (sft 2/2, base 0/2). It's the one place the fine-tune unambiguously added capability.
4. **AGI-001/002/003 are genuine capability gaps** for both models — not fixable by harness or tokens.

**Cannot say (n=2 is too small):**
1. Whether the +0.5 pass@1 average delta is a real fine-tune effect or noise. Need n≥5 (ideally n=10) to resolve a ~1-point delta at this variance level.
2. Whether the +2 pass@2 delta holds. With 6 AGI rows it's 1-2 coin-flips away from zero.

## Costs & operational notes
- Pod runtime ~2.7 hr (cold-start + smoke2 + 2 passes) ≈ **~$9** at $3.29/hr.
- **Cold start was ~33 min this run (vs 13 min on the prior pod).** Cause: pod resume wipes container disk, deleting the FlashInfer JIT compile cache, forcing a full nvcc recompile of the gated-delta-net kernels (~15 min of that). **Mitigation for next time**: persist `/root/.cache/flashinfer` on the network volume, or accept a 30+ min cold start on every resume.
- The n=2 two-pass-in-separate-dirs pattern worked cleanly. No dedupe collision.

## Recommendation
The fine-tune shows a **real but small** signal (consistent AGI-014 gain, +2 at pass@2) that is currently **drowned in sampling noise at pass@1**. Before any go/no-go on the recipe, run **n=5 on the full 300** (or n=10 on the 29) to separate the +0.5 average from the ±3 noise floor. The harness is now trustworthy enough that the result of that run will be actionable.
