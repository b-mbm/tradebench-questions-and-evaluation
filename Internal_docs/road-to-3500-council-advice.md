# Road to 3,500: Advice by the Council

**Status:** COUNCIL-APPROVED · **Date:** 2026-07-01 · **Council:** Schulman (Seat 1), Lambert (Seat 2), Finn (Seat 3), Liang (Seat 4) · **Confidence:** HIGH

---

## COUNCIL OPENING STATEMENT

> *This document is the living roadmap for building a 3,500-example SFT training set that produces a net-positive checkpoint. The council advises at the beginning and end of every step. The gate at each step is non-negotiable: if the data isn't right, the GPU hours are wasted. The council's unanimous position across three sessions is that the current SFT failure (-3, within ±3 noise) is a DATA problem, not a METHOD problem. Fix the data, train from base, measure honestly. The path is clear.*

---

## THE SITUATION (as the council sees it)

### What we have
- **Base model:** Qwen3.6-27B, served with thinking ON via SGLang → **161/300**
- **Current SFT (v2/v3):** 158/300 — net -3, within ±3 noise floor (statistically indistinguishable from base)
- **Training set:** 1,855 examples, 100% failure-mode-derived, 47% AGI tier, 92% single-generator synthetic
- **Two 300Q runs completed:** We know exactly which questions base gets right, wrong, and where SFT churns

### What went wrong (council diagnosis, unanimous)
1. **Failure-only construction** — zero reinforcement examples → the model forgets what it already knows
2. **47% AGI concentration** — 87/110 AGI questions are universal failures (nobody solves them) → training on unsolvable questions teaches confident wrongness
3. **Format mismatch (now fixed in v3)** — trained as "AIX," tested as "Execute@1" → distribution shift at the input layer
4. **92% single-generator synthetic** — style monoculture → spurious correlates absorbed as signal

### What SFT is FOR (council definition, unanimous)

> **SFT teaches the model the *shape* of a good answer — the format, the confidence level, the reasoning structure — on questions where the underlying knowledge is already in the base model. It is NOT for injecting knowledge or capability the model lacks.**
>
> - **Schulman:** "SFT teaches format and procedure. It cannot teach facts or reasoning the model doesn't have."
> - **Lambert:** "SFT is ~90% of the lift — but only when the data is right. It's where the model learns to consistently do what it can already do, in the shape you want."
> - **Finn:** "SFT reinforces the model's existing competent distribution. If you use it for things the model lacks, you get confident-sounding memorization."

---

## THE TARGET

### Difficulty ceiling (council consensus)

| Tier | Base competence | SFT action | Rationale |
|---|---|---|---|
| L1-8 | 21/40 both-right (52%) | **Corrections OK** — audit gold answers first | 32% universal failure rate is suspicious (possible label rot) |
| L9 | 58/81 both-right (72%) | **Corrections OK** — primary wheelhouse | Model is competent; corrections are real teaching |
| L10 | 48/69 both-right (70%) | **Corrections OK** — second wheelhouse | Same as L9 |
| AGI | 18/110 both-right (16%) | **Reinforcement ONLY** — zero corrections | 87/110 (79%) universal failures = capability ceiling, not a data problem |

### Success criteria (what a WIN looks like)

| Criterion | Bar | Source |
|---|---|---|
| Net delta over base | **≥ +7** (161 → 168+) — clears 2× the ±3 noise floor | Finn, Lambert |
| Regressions | **≤ 10** (down from 16) | Finn |
| Gains | **≥ 25** (up from 13) | Finn |
| Gain:regression ratio | **≥ 2:1** | Finn |
| Held-out split | Delta holds on an unseen ~150Q set | Finn, Lambert |
| Length-stable | Gains survive controlling for answer length | Finn |
| No tier collapse | No tier loses more than ~2 points | Finn |
| Realistic ceiling | **~165-171** | Schulman, Lambert |

**Anything in 158-165 is still sideways. Do not ship 164 and call it progress.**

### The final composition target (~3,500)

**By outcome (the bias correction — flip from 100% corrections to reinforcement-heavy):**

| Type | Count | % | Source |
|---|---|---|---|
| **Reinforcement** (base gets right — "keep doing this") | ~2,100 | 60% | Expand the 145 both-right benchmark patterns into sibling variations (same skill, different scenarios/assets/numbers) |
| **Corrections** (base gets wrong but CAN learn — L1-8/L9/L10 only) | ~800 | 23% | Expand the 39 non-AGI universal failures — written as standalone correct reasoning, never as "here's the fix" |
| **Format/schema general** | ~600 | 17% | Stabilize output shape across 148 schemas, Execute@1 format alignment, length-normalized edge cases |

**By tier:**

| Tier | Target | Reinforcement : Correction | Notes |
|---|---|---|---|
| L1-8 | ~700 | ~500 : ~200 | Post gold-answer audit. Mirror audited both-right:both-wrong ratio. |
| L9 | ~1,000 | ~700 : ~300 | Highest competence (72%). Heaviest investment. |
| L10 | ~900 | ~650 : ~250 | Second wheelhouse (70%). |
| AGI | ~350 | ~350 : **0** | Reinforcement ONLY. Zero corrections. The 18 both-right expanded. |
| Cross-tier format/schema | ~550 | 550 : 0 | Format stabilization, length-normalized. |
| **TOTAL** | **~3,500** | **~2,750 : ~750 (3.7:1)** | Reinforcement-heavy by design. |

**By provenance (break the 92% synthetic monoculture):**

| Source | Current | Target |
|---|---|---|
| Synthetic (single generator) | 92% | **~50%** |
| Human-written / expert-curated | 0% | **~30%** |
| Model-generated + human-verified | 0% | **~20%** |

**By length (spurious-dimension control):**

| Metric | Target |
|---|---|
| Median | ~600 chars |
| 90th percentile | ~1,200 chars |
| **Max** | **~2,000 chars** (cut the 5,183 outliers) |

---

## THE ROADMAP (8 steps, with council check-ins)

### STEP 1: Audit the existing 1,855 — KEEP, REMOVE, or PARK

**Goal:** Determine exactly which examples survive into v4.

**Council advice at step start:**
> **Finn:** "The salvage is concentrated in L9/L10 (the model's zone of competence). Audit L1-8 hardest — the 32% universal-failure rate in 'easy' tier is a labeling red flag. Salvage almost nothing from AGI corrections. Cut length outliers >2,000 chars — that's generator verbosity, not signal."
>
> **Lambert:** "Run the decontamination pass (8-gram overlap vs 300Q) BEFORE deciding what to keep. Any overlap = memorization risk. Tülu 3 found UltraFeedback contaminated with TruthfulQA via exactly this method."
>
> **Schulman:** "The 16 regressions are the smoking gun. Diagnose them before re-running anything. They're almost certainly format mismatch or flatly-wrong targets."

**Actions:**
- [ ] Tier-by-tier breakdown of each of the 1,855 examples
- [ ] For each AGI example: classify as universal-failure (remove) vs near-miss (keep only if verified correct)
- [ ] Length audit: flag everything >2,000 chars for review
- [ ] Gold-answer spot-check on L1-8 (at least 20 examples — are the "correct" answers actually correct?)
- [ ] Spurious-dimension audit: length × tier × generator-style distribution vs eval distribution

**Expected output:** A triaged list — ~600-950 KEEP, ~900-1,250 REMOVE, ~87 PARK (for GRPO)

**Council check-in at step end:** Review the salvage list. Does it pass Finn's spurious-dimension audit? Does Lambert approve the decontamination?

---

### STEP 2: Run standing gates (parallel with Step 3)

**Goal:** Verify the eval is trustworthy before trusting any future number.

**Council advice at step start:**
> **Lambert:** "Both gates run in parallel with the rebuild. Neither blocks you from starting today. But you do NOT get to claim SFT success — or failure — until both clear. The -3 you're reacting to is, statistically, a coin flip measured against a possibly-cheating baseline."
>
> **Finn:** "The null-reward control is the single experiment that could change everything. If the benchmark moves on random training data, your 'regression' is noise + contamination."

**Actions:**
- [ ] **Decontamination check:** 8-gram overlap between all 1,855 training examples and the 300 eval questions
- [ ] **Null-reward control:** Train identical recipe (QLoRA r=32, 2 epochs) on the 1,855 prompts with shuffled/randomized targets. Score on 300Q. If it moves ±3, the baseline is contaminated.

**Expected output:** Two pass/fail verdicts. If either fails, the entire eval interpretation changes.

**Council check-in at step end:** Do we trust the 161 baseline? Is the -3 real?

---

### STEP 3: Generate reinforcement examples (~2,100)

**Goal:** Build the "keep doing what you're doing" bucket — the largest component.

**Council advice at step start:**
> **Finn:** "Source from the base model's OWN correct answers on sibling questions. This anchors the model's competent home distribution so corrections become differential updates, not a wholesale style transplant. Ideally add a second independent generator for ~20% to break the style binary."
>
> **Lambert:** "Expand the 145 both-right patterns into variations — same skill, different assets, different numbers. Decontaminate every new row against the 300Q. Generate-then-filter, every time."
>
> **Schulman:** "These are the safe zone. SFT isn't helping them, but it isn't breaking them either. Their job is format/procedure anchoring."

**Actions:**
- [ ] Identify the 145 "both-right" patterns from the 300Q runs (by skill/archetype, not by question ID)
- [ ] Generate ~2,100 sibling variations (same skill, different scenarios/assets/constraints)
  - ~1,250 from base model's own correct output patterns
  - ~500 from a second independent generator (break style monoculture)
  - ~350 AGI reinforcement (from the 18 both-right AGI patterns)
- [ ] Format-match to eval (Execute@1 system prompt, eval user format)
- [ ] Length-cap at 2,000 chars, balance across tiers
- [ ] Decontaminate every row against 300Q (8-gram overlap)
- [ ] Verify each answer is correct (independent gold-check)

**Council check-in at step end:** Review reinforcement set. Does it pass Finn's spurious-dimension audit? Are the AGI reinforcements safe (reinforcement only, no corrections)?

---

### STEP 4: Generate correction examples (~800)

**Goal:** Build the "here's how to do it right" bucket — teachable failures only.

**Council advice at step start:**
> **Finn:** "Write these as STANDALONE correct reasoning — never as 'here's the fix to the wrong answer.' The failure-mode framing itself is a spurious correlate. If the model can learn 'this is a correction' as a style feature, it will."
>
> **Lambert:** "Only include corrections where the target is independently verified as correct ground truth. If your correction was generated by another model that also can't solve it, you're teaching a confident wrong answer."
>
> **Schulman:** "The 39 non-AGI universal failures (13 L1-8 + 14 L9 + 12 L10) are the correction candidates. The 87 AGI universal failures are OFF THE TABLE — they go to GRPO."

**Actions:**
- [ ] From the 39 non-AGI universal failures, generate sibling variations (~20× per pattern = ~800)
- [ ] Each written as standalone correct reasoning in the Execute@1 format
- [ ] Verify each target answer independently (gold-check)
- [ ] Length-balance across tiers so "correction" doesn't correlate with any spurious dimension
- [ ] Decontaminate every row against 300Q

**Council check-in at step end:** Review correction set. Are targets verified? Is the length balanced? Did we avoid the "correction style" spurious correlate?

---

### STEP 5: Assemble v4 dataset (~3,500)

**Goal:** Merge all buckets into the final training set.

**Council advice at step start:**
> **Finn:** "The final ratio is an OUTPUT, not an input. It falls out of the balance constraints: generator-style balance (single-source under 50%), difficulty balance (mirror deployment ~65-75% competent), topic balance (no sub-category overweight). If the filled-in table sums to 3.2K, ship 3.2K. If it's 3.7K, ship 3.7K."
>
> **Lambert:** "Decontaminate the ENTIRE final set against the 300Q in one pass. Then decontaminate against any held-out split you plan to create. This is non-negotiable."
>
> **Schulman:** "Start small. The smallest set that moves the held-out number is the right one. Don't gold-plate the count."

**Actions:**
- [ ] Merge: ~800 salvaged + ~2,100 reinforcement + ~800 corrections + ~550 format/schema
- [ ] Verify tier distribution matches target (AGI ≤ 10%, L9/L10 heaviest)
- [ ] Verify outcome distribution (~60% reinforcement, ~23% corrections, ~17% format)
- [ ] Verify provenance diversity (~50% synthetic, ~30% human, ~20% model+human-verified)
- [ ] Verify length distribution (median ~600, max ~2,000)
- [ ] Full decontamination pass against 300Q
- [ ] Create a held-out ~150Q unseen split (if not already done in Step 2)

**Council check-in at step end (FINAL APPROVAL):** Full composition review. Does this set pass all four seats' criteria? The council MUST approve before training begins.

---

### STEP 6: Train from base, 2 epochs

**Goal:** Produce the v4 adapter.

**Council advice at step start:**
> **Schulman:** "Same recipe: QLoRA r=32, alpha=64, 2 epochs, from base. The simplest well-executed version. Monitor training loss AND KL from base — if the policy drifts too far, reduce rank or epochs."
>
> **Lambert:** "Don't add a third epoch regardless of loss. Loss on a narrow set past 2 epochs is memorization, which is the cause of regressions, not the cure."
>
> **Finn:** "Watch for length drift during training — if the model's outputs are getting systematically longer, that's the spurious correlate being absorbed."

**Actions:**
- [ ] Deploy training pod with corrected format (v3 format + v4 data)
- [ ] Train QLoRA r=32, alpha=64, 2 epochs, from base
- [ ] Monitor training loss, KL from base, output length distribution
- [ ] Save adapter + merged model

**Council check-in at step end:** Review training metrics. Did loss converge? Is KL reasonable? Any length drift?

---

### STEP 7: Eval on 29Q + held-out split

**Goal:** Measure the honest delta.

**Council advice at step start:**
> **Lambert:** "Run n≥5 fixed-seed draws of BOTH base and v4, same conditions (SGLang + thinking ON, temp 0.1). Report the per-draw spread, not one number. The per-question flip rate is the real signal."
>
> **Finn:** "Report per-tier deltas AND length-controlled win rates. If the gains disappear under length control, the dataset carried a spurious signal."
>
> **Schulman:** "The success bar is: v4 ≥ 168 on 300Q dev, gains ≥ 25, regressions ≤ 10, and the delta holds on the held-out 150Q. Anything less is sideways."
>
> **Liang:** "Freeze the eval. Same conditions, same seed, same day, for base and tuned. Report per-tier, not one number."

**Actions:**
- [ ] Serve v4 on SGLang with json_object + thinking ON
- [ ] Run 29Q THINK ON (compare to v2's 19/29)
- [ ] Run held-out ~150Q (if created)
- [ ] Run n≥5 draws for variance measurement
- [ ] Per-tier breakdown: L1-8 / L9 / L10 / AGI
- [ ] Length-controlled win rate
- [ ] Per-question flip rate vs base

**Council check-in at step end (THE GATE):** Did we clear +7? Are regressions ≤10? Does it hold on held-out? This is the decision point.

---

### STEP 8: Decision point

**Outcome paths:**

| Result | Action | Council role |
|---|---|---|
| **v4 net-positive (+7+)** | Scale to full 300Q → consider GRPO | Council reviews full 300Q result |
| **v4 flat (0 to +6)** | Council reconvenes: has SFT plateaued? Run Schulman's 3-signal test | Council determines if GRPO is next |
| **v4 negative** | Fundamental problem beyond data. Council reconvenes on whether the eval is trustworthy | Full diagnostic session |

**Schulman's SFT plateau test (3 signals):**
1. Two-to-three data-blend variations all land within ±2 of each other and of base
2. The universal-failure bucket (126 questions) doesn't move across blends
3. The remaining errors are calibration-type (confident wrongness), not format errors

**When all three hold, SFT is done. The rest is GRPO.**

---

## COUNCIL CLOSING STATEMENT

> *The council has reviewed this document across three sessions and approves it as the roadmap to a net-positive SFT checkpoint. The path is clear: salvage the teachable corrections, build reinforcement-heavy data that anchors what works, exclude universal failures from SFT (park them for GRPO), train from base, and measure honestly. The success bar is +7 over base on a decontaminated, held-out eval with rerun variance. If that bar clears, the model is ready for GRPO. If it doesn't clear after a clean data blend, SFT has plateaued and the council reconvenes.*
>
> *The council will check in at the beginning and end of every step. The operator does not proceed to the next step without council review. This is the discipline that prevents another net-negative.*
>
> **APPROVED:** Schulman ✅ · Lambert ✅ · Finn ✅ · Liang ✅

---

## QUICK REFERENCE: Key numbers

| Metric | Value |
|---|---|
| Current base score | 161/300 (SGLang, thinking ON) |
| Current SFT score | 158/300 (within ±3 noise) |
| Target SFT score | ≥168/300 (+7 over base) |
| Realistic SFT ceiling | 165-171 |
| Current training set | 1,855 (100% failure-mode, 47% AGI) |
| Target training set | ~3,500 (60% reinforcement, 23% corrections, 17% format) |
| Salvage from existing | ~600-950 examples |
| Universal failures (park for GRPO) | 126/300 (87 AGI + 39 non-AGI) |
| AGI corrections in v4 | **ZERO** |
| AGI reinforcement in v4 | ~350 (from 18 both-right patterns) |
| Rerun variance | ±3 (need n≥5 draws to resolve) |

---

## FILE REFERENCES

- **Council reference (Part I + Part II dossiers):** `docs/post-training-council-reference.md`
- **Previous council decisions:** `Internal_docs/council-decision-sft-net-negative-2026-07-01.md`, `Internal_docs/council-v4-data-rebuild-plan-2026-07-01.md`
- **Net-regression principle doc:** `docs/fine-tuning-net-regression-principle.md`
- **Serving recipe (Bayesian skill):** `~/.agents/skills/bayesian-post-training/SKILL.md`
- **Council skill:** `~/.agents/skills/post-training-council/SKILL.md`
- **Training data (v2):** `~/Documents/tradebench-lite-tests/training/sft-1500q-v2/`
- **Training data (v3, format-corrected):** `~/Documents/tradebench-lite-tests/training/sft-1500q-v3/`
- **300Q results:** `results/community/300/run300-{openrouter,base-thinkon,sft-thinkon}-2026-06-29/`
