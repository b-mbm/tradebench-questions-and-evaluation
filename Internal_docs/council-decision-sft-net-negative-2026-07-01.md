# Post-Training Council Decision: SFT Net-Negative — Next Steps

**Date:** 2026-07-01 · **Council convened:** Schulman (Seat 1), Lambert (Seat 2), Finn (Seat 3), Liang (Seat 4) · **Confidence:** HIGH (four independent lenses converged)

---

## The decision that was posed

SFT went net-negative (-3) on the 300Q benchmark. Should I add a third epoch, go to GRPO, or rebuild the training data with reinforcement examples?

## The council's verdict (unanimous direction, different reasoning)

**Do NOT add a third epoch. Do NOT start GRPO yet. Fix the data and eval foundation first.**

All four seats independently arrived at the same sequence from four different analytical lenses:

| Seat | Key objection to epoch | Key objection to GRPO | What they demand first |
|---|---|---|---|
| **Schulman** | Behavior cloning on dirty data deepens the shift | GRPO is earned only after clean SFT is tested. Add KL-to-reference or policy collapses. | Run format-corrected SFT v3, measure honest delta |
| **Lambert** | -3 is within ±3 noise — betting compute on noise | Reward has hidden-label exact-match = hackable. No null-reward control = can't trust any number. | Run null-reward control (Qwen contamination gate) |
| **Finn** | Failure-only data causes forgetting by composition | No evidence offline methods fail on correctly-composed data — GRPO is premature | Rebuild data blend with reinforcement examples (1:2-3 ratio) |
| **Liang** | Can't optimize on an instrument that can't resolve ±3 | GRPO against a grader with construct-validity failure = reward hacking guaranteed | Freeze the eval: n≥5 fixed-seed draws, per-tier reporting, held-out split |

## The action plan (in priority order)

### 1. Wait for SFT v3 (CURRENTLY TRAINING — ~35 min left as of this writing)
- Pod: `ish2t419r1b28w`, step 90/116
- v3 corrects the three format mismatches (system prompt, user format, thinking traces)
- When done: serve on SGLang, run 29Q THINK ON test
- **Gate:** Compare to v2's 19/29. If v3 ≥ 21, the format fix worked. If v3 ≤ 17, the problem is deeper than format.

### 2. If v3 is still net-negative: rebuild the data blend
- **Keep the 1,855 failure-mode corrections** — they demonstrably move the model (13 unique wins)
- **Add ~3,700-5,500 reinforcement examples** — questions the base already gets right, in the eval format. These prevent the catastrophic forgetting that caused the 16 regressions.
- **Target ratio:** ~1:2-3 corrections:reinforcement (per Finn's recommendation)
- **All in the corrected v3 format** (Execute@1 system prompt, eval user format)
- Convene the council on the rebuild design before running it

### 3. Fix the eval instrument (do this in parallel with data rebuild)
- **Run n≥5 fixed-seed draws** of base AND tuned, both on SGLang + thinking ON, same conditions, same day
- **Report per-tier deltas**, not one number (Liang's demand)
- **Carve a real held-out split** out of the 300Q (Lambert and Liang both demand this)
- **Remove or disclose the hidden-label exact-match** fields in the grader (Lambert flags this as hackable)

### 4. Run the null-reward control (Lambert's standing Qwen contamination gate)
- Train identical recipe (QLoRA r=32, 2 epochs) on the same 1,855 prompts with **shuffled/randomized targets**
- Score on the same 300Q
- **If the benchmark moves ±3 on random targets, the "delta" is contamination + noise, not skill**
- This is the single experiment that confirms or kills the entire training program's validity

### 5. GRPO only after steps 1-4 are green
- Requires: held-out split, KL-to-reference term, cleaned reward (no hidden labels), decontaminated eval
- The grader IS a verifiable reward (good!) — but it needs to be fixed first
- The reward surface is only 300 questions — risk of format-hacking without a held-out split

## The measurable gate

**Net delta on a controlled re-measurement:** base vs tuned, both on SGLang + thinking ON, temp 0.1, fixed seed, n≥5 draws, per-tier reported. If the per-question flip rate exceeds |delta|, the instrument can't resolve the signal and no training decision is valid.

## What NOT to do (unanimous)

- ❌ Do NOT add a third SFT epoch (deepens the bias, optimizes on noise)
- ❌ Do NOT start GRPO now (reward is hackable, SFT baseline is flat, no held-out split)
- ❌ Do NOT build a second benchmark while the first is unresolved
- ❌ Do NOT train on more failure cases (deepens the exact problem)
- ❌ Do NOT trust a single-draw delta of ±3 as signal

## Key citations from each seat

- **Schulman:** "To use your RL algorithm, you need a reward function. But where does the reward function come from?" — the grader gives you a verifiable reward, but a 300-question surface with no held-out split and no KL term is reward-hacking waiting to happen.
- **Lambert:** "benchmarks improving when models are trained with RL on random rewards" — the Qwen contamination tell. You have not run this control. Until you do, neither the -3 nor any future number means what you think.
- **Finn:** "the only recipe that's convincingly enabled generalization in neural networks is training on larger data sets" — but larger in the wrong direction (more failure cases) deepens forgetting. The lever is composition, not volume.
- **Liang:** "A benchmark that cannot be reproduced is not a benchmark." — your ±3 variance on a self-designed 300Q set with no held-out split means the instrument cannot resolve the signal you're trying to read.
