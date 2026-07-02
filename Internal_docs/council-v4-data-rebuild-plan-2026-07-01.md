# Council Decision: v4 SFT Data Rebuild Plan (Exhaustive Session)

**Date:** 2026-07-01 · **Seats:** Schulman, Lambert, Finn · **Confidence:** HIGH (unprecedented convergence)

---

## What is SFT FOR? (One sentence, all three seats agree)

> **SFT teaches the model the *shape* of a good answer — the format, the confidence level, the reasoning structure — on questions where the underlying knowledge is already in the base model. It is NOT for injecting knowledge or capability the model lacks.**

- **Schulman:** "SFT teaches format and procedure. It cannot teach facts or reasoning the model doesn't have, and it cannot stop it from answering confidently when it's wrong — only RL with the right reward can do that."
- **Lambert:** "SFT shows the model worked examples so it reliably produces the right format and reasoning instead of whatever the base defaults to. It learns to consistently do what it can already do, in the shape you want."
- **Finn:** "SFT teaches the shape of a good answer on questions where the underlying knowledge is already in the base model. If you use it for things the model lacks, you get confident-sounding memorization instead of competence."

---

## What went wrong with v2/v3 (the diagnosis)

All three seats independently identify the same three diseases:

| Disease | Evidence | Impact |
|---|---|---|
| **47% AGI failure-only construction** | 866/1855 are AGI corrections; 87/110 AGI eval questions are universal failures | Force-feeding answers to questions the model CANNOT derive = hallucination fuel |
| **92% synthetic, single-generator** | No provenance diversity | Style fingerprints absorbed as spurious signal (Finn's R-DPO lesson) |
| **Zero reinforcement examples** | 100% failure-derived, 0% "what right looks like" | Nothing anchors the 145 questions the model already gets right → 16 regressions |

---

## What can be salvaged from the 1,855?

**Salvage ~600-950. Discard the rest.**

| Slice | Disposition | Estimated yield |
|---|---|---|
| L9 corrections (competent tier, near-misses) | **KEEP** — strongest salvage | ~200 |
| L10 corrections (competent tier, near-misses) | **KEEP** — second strongest | ~200 |
| L1-8 corrections | **AUDIT FIRST** — 32% universal failure rate in "easy" tier suggests label rot | ~150-250 (post-audit) |
| AGI corrections (~866) | **REMOVE ~90%** — universal failures can't be taught via SFT | ~50-100 reinforcement only |
| Length outliers (>2,000 chars) | **CUT** — generator verbosity, not signal | (overlapping) |
| **TOTAL SALVAGE** | | **~600-950** |

**What to do with the discarded AGI:** Park the universal failures (~87) as labeled RL training signal for GRPO.

---

## Difficulty ceiling

| Tier | Both-right | Both-wrong | SFT action |
|---|---|---|---|
| L1-8 | 21/40 (52%) | 13/40 (32%) | **Corrections OK** — but audit gold answers first |
| L9 | 58/81 (72%) | 14/81 (17%) | **Corrections OK** — this is the wheelhouse |
| L10 | 48/69 (70%) | 12/69 (17%) | **Corrections OK** — second wheelhouse |
| AGI | 18/110 (16%) | 87/110 (79%) | **Reinforcement ONLY** — zero corrections |

**Consensus:** Corrections through L10. AGI reinforcement only (the 18 the model gets right). Zero AGI corrections. The 79% universal failure rate is an independent veto — you cannot imitation-learn reasoning you don't have.

---

## Success criteria — what does a WIN look like?

**Expect modest-and-clear, not dramatic.** Three seats independently landed on similar numbers:

| Criterion | Bar | Source |
|---|---|---|
| **Net delta over base** | ≥ +7 (161 → 168+) — clears 2× the ±3 noise floor | Finn, Lambert |
| **Regressions** | ≤ 10 (down from 16), with gains ≥ 25 | Finn |
| **Gain:regression ratio** | ≥ 2:1 | Finn |
| **Held-out split** | Delta holds on an unseen ~150Q set | Finn, Lambert |
| **Length-stable** | Gains survive controlling for answer length | Finn |
| **No tier collapse** | No tier loses more than ~2 points | Finn |
| **Realistic ceiling** | ~165-171 | Schulman, Lambert |

**Anything in 158-165 is still sideways.** Don't ship 164 and call it progress.

---

## The v4 concrete composition plan (~3,500)

### By outcome (the bias correction)

| Type | Count | % | Source |
|---|---|---|---|
| **Reinforcement** (both-right demonstrations) | ~1,650-2,850 | 47-80% | Expand the 145 both-right patterns into variations (same skill, different specifics) |
| **Corrections** (both-wrong targets, L1-8/L9/L10 only, written as standalone correct reasoning) | ~650-1,150 | 18-33% | Expand the 39 non-AGI universal failures — NEVER as "here's the fix," always as "here's the right answer" |
| **Format/schema general** | ~500-700 | 14-20% | Stabilize output shape across 148 schemas |

### By tier

| Tier | Target | AGI policy |
|---|---|---|
| L1-8 | ~500-850 | Post gold-audit |
| L9 | ~900-1,300 | Primary wheelhouse — heaviest investment |
| L10 | ~900-1,200 | Second wheelhouse |
| AGI | ~350 (reinforcement ONLY) | 0 corrections |

### By provenance (break the synthetic monoculture)

| Source | Current | Target |
|---|---|---|
| Synthetic (single generator) | 92% | ~50% |
| Human-written / expert-curated | 0% | ~30% |
| Model-generated + human-verified | 0% | ~20% |

### By length (spurious-dimension control)

- Cap: median ~600, 90th percentile ~1,200, **max ~2,000**
- Balance length across tiers so model can't learn "longer = more correct"

---

## The plan (step by step, with council check-ins)

### Step 1: Audit the existing 1,855 (NO GPU, data work)
- [ ] Tier-by-tier breakdown of each example
- [ ] For each AGI example: is it a universal failure or a near-miss?
- [ ] Length audit: cut everything >2,000 chars
- [ ] Gold-answer audit on L1-8 (the 32% failure rate is suspicious)
- [ ] Spurious-dimension audit: length × tier × generator-style
- **Council check-in:** Review the salvage list before proceeding

### Step 2: Run standing gates (parallel, ~$10-15 GPU)
- [ ] Decontamination check (8-gram overlap, 1,855 vs 300Q)
- [ ] Null-reward control (train on random targets, does 300Q move?)
- **Council check-in:** Review gate results before trusting any future number

### Step 3: Generate reinforcement examples (NO GPU, data work)
- [ ] From base model's correct answers on sibling questions (same skills, different scenarios)
- [ ] Format-matched to eval (Execute@1 system prompt, eval user format)
- [ ] Include second independent generator for ~20% to break style monoculture
- [ ] Decontaminate every new row against 300Q
- **Council check-in:** Review reinforcement set composition

### Step 4: Generate correction examples (NO GPU, data work)
- [ ] From the 39 non-AGI universal failures (13 L1-8 + 14 L9 + 12 L10)
- [ ] Written as standalone correct reasoning, NOT as "here's the fix to the wrong answer"
- [ ] Length-balanced across tiers
- **Council check-in:** Review correction set quality

### Step 5: Assemble v4 (~3,500 total)
- [ ] ~600-950 salvaged + ~1,650-2,850 reinforcement + ~650-1,150 correction
- [ ] AGI: reinforcement only (~350), zero corrections
- [ ] Length caps enforced
- [ ] Full decontamination pass
- **Council check-in:** Final composition review before training

### Step 6: Train from base, 2 epochs (GPU, ~$10-15)
- [ ] Same QLoRA config (r=32, alpha=64, 2 epochs, from base)
- [ ] v3 format (Execute@1 system prompt, eval user format)
- **Council check-in:** Review training loss + KL from base

### Step 7: Eval on 29Q + held-out split (GPU, ~$5)
- [ ] 29Q THINK ON (compare to v2's 19/29)
- [ ] Fresh ~150Q held-out (if available)
- [ ] Per-tier breakdown, length-controlled
- **Council check-in:** Success gate — did we clear +7? Are regressions ≤10?

### Step 8: Decision point
- **v4 net-positive (+7+)** → scale to 300Q → consider GRPO
- **v4 flat (0-6)** → council reconvenes on whether SFT has plateaued
- **v4 negative** → fundamental problem beyond data; council reconvenes

---

## The SFT → GRPO boundary (when to switch)

**Schulman's three-signal plateau test:**
1. Two-to-three data-blend variations all land within ±2 of each other and of base
2. The universal-failure bucket (126 questions) doesn't move across blends
3. The remaining errors are calibration-type (confident wrongness, failure to hedge), not format errors

**When all three hold, SFT is done.** The rest is RL.

**Realistic SFT ceiling:** ~165-171 (base 161 + clean data blend gains). The leap from 165 to 189+ is GRPO's job — using the 126 universal failures as RL training signal with a verifiable reward (the benchmark grader, cleaned of hidden-label exact-match).

---

## Gates to run BEFORE trusting any result

| Gate | Status | Priority |
|---|---|---|
| Decontamination (8-gram, training vs 300Q) | NOT RUN | **Non-negotiable** — run before trusting any gain |
| Null-reward control (random targets) | NOT RUN | **Lambert's standing gate** — run before trusting the baseline |
| Held-out split (~150Q unseen) | DOES NOT EXIST | Create before claiming generalization |
| Rerun variance (n≥5, fixed seed) | PARTIALLY DONE (±3 on n=2) | Need n≥5 before reading any delta |
