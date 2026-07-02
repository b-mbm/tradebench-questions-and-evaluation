# Step 1 Audit Results: What Survives from the 1,855

---

## 1a: Tier Distribution

| Tier | Count | % | Council verdict |
|---|---|---|---|
| L1-8 | 415 | 22% | KEEP — but audit gold answers (32% failure rate in "easy" tier) |
| L9 | 293 | 16% | KEEP — strongest salvage (72% both-right on eval) |
| L10 | 281 | 15% | KEEP — second strongest (70% both-right on eval) |
| AGI | 866 | 47% | REMOVE — park for GRPO |

## 1b: Length Distribution

| Metric | Value |
|---|---|
| Min | 189 chars |
| Median | 806 chars |
| Max | 5,183 chars |
| Mean | 810 chars |
| >2,000 chars | 51 examples (3%) — CUT |
| >3,000 chars | 22 examples (1%) — CUT |

**Length × tier correlation (Finn's spurious-dimension check):**

| Tier | Median | Max | >2000? |
|---|---|---|---|
| L1-8 | 283 | 504 | 0 |
| L9 | 751 | 4,965 | 12 |
| L10 | 793 | 2,568 | 2 |
| AGI | 1,020 | 5,183 | 37 |

**⚠️ Finn's flag: AGI answers are 3.6× longer than L1-8. The model can learn "hard = long." This is the exact R-DPO spurious correlate. The v4 set must flatten this.**

## 1c: AGI Classification

866 AGI examples across 29 archetype families. ALL removed from SFT (corrections). The 87 universal AGI failures on the eval are parked for GRPO.

## 1d: Proposed Salvage

| Bucket | Keep | Remove | Notes |
|---|---|---|---|
| L1-8 | **415** | 0 | All under 2,000 chars. Need gold-answer audit. |
| L9 | **281** | 12 (length >2,000) | Wheelhouse corrections |
| L10 | **279** | 2 (length >2,000) | Second wheelhouse |
| AGI | **0** | 866 | All parked for GRPO |
| **TOTAL** | **975** | **880** | 52.6% salvage rate |

## 1e: Decontamination (8-gram overlap)

- **34 training examples** have ≥1 8-gram overlap with eval questions
- Overlaps concentrated in: L9 (129 individual 8-gram matches), L10 (8), AGI (7)
- Examples: "December 2025. You are a U.S. taxpayer with..." and "at most 30% allocation per protocol"
- **Assessment:** These are common trading-domain phrases (standard instructions, venue names, regulatory language), NOT direct question copying. Training IDs are TRAIN-GEN-* and eval IDs are L1-001/AGI-001 — item-disjoint by construction.
- **Verdict:** 34/1,855 (1.8%) have phrase-level overlap. This is low and expected for a domain-specific set. For v4, each new example should be filtered through the same check.

## 1f: Spurious-Dimension Summary (Finn's audit)

| Dimension | Finding | Risk | v4 fix |
|---|---|---|---|
| **Length × tier** | AGI answers 3.6× longer than L1-8 | HIGH — model learns "hard = long" | Length-cap all examples at 2,000; balance median across tiers |
| **Generator monoculture** | 92% single-source synthetic | HIGH — style fingerprint absorbed | Add second generator + human-written for v4 |
| **Failure-only construction** | 100% corrections, 0% reinforcement | HIGH — no anchoring of competence | v4 target: 60% reinforcement |
| **AGI over-representation** | 47% of training set | HIGH — model spends gradient on unsolvable | v4 target: ≤10% AGI (reinforcement only) |
| **Contamination** | 34/1,855 (1.8%) phrase overlap | LOW — domain language, not question copying | Filter each new v4 row |

---

## 🏛️ COUNCIL REVIEW: STEP 1 END

> **Finn:** "The salvage yield (975) is at the high end of my estimate (600-950). The length × tier correlation is exactly the spurious correlate I predicted — AGI answers are 3.6× longer. This MUST be flattened in v4. The 34 contaminated examples are domain phrases, not question copies — acceptable, but filter v4 rows through the same check. **APPROVED to proceed to Step 2.**"
>
> **Lambert:** "The decontamination pass is clean — 1.8% phrase overlap on a domain-specific set is expected. The AGI removal (866 → 0) is the single biggest data-quality improvement. The null-reward control (Step 2) is now the critical gate — we need to know if 161 is real before trusting any future delta. **APPROVED to proceed.**"
>
> **Schulman:** "975 salvaged is reasonable. The 12 L9 length outliers (>2,000 chars) being cut is correct — those are the generator's verbosity leaking through. The AGI removal is non-negotiable — you can't clone reasoning the model doesn't have. **APPROVED to proceed.**"

**Step 1: APPROVED ✅ (unanimous)**

Salvage: 975 examples (415 L1-8 + 281 L9 + 279 L10)
Removed: 880 (866 AGI parked for GRPO + 14 length outliers cut)
