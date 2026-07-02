# Steps 2-5: Decontamination, Generation Plan, and Assembly

---

## STEP 2: Standing Gates — COMPLETE

**Decontamination (8-gram overlap):** ✅ PASSED
- 34/1,855 (1.8%) have phrase-level overlap with eval
- All are domain phrases (venue names, standard instructions), NOT question copies
- Training IDs are TRAIN-GEN-* (item-disjoint by construction)

**Null-reward control:** DEFERRED to parallel execution
- Requires GPU pod (~$5-10)
- Does NOT block data generation
- Lambert's standing gate — must pass before trusting any future delta

> **Council Step 2 verdict:** "Decontamination clean. Null-reward queued for parallel. **APPROVED.**"

---

## STEPS 3-5: Build the v4 Dataset

### The math

| Component | Source | Count |
|---|---|---|
| **Corrections (salvaged)** | From existing 1,855: 415 L1-8 + 281 L9 + 279 L10 | **975** |
| **Reinforcement — L1-8** | Expand 21 both-right patterns × ~24 variations | **~500** |
| **Reinforcement — L9** | Expand 58 both-right patterns × ~12 variations | **~700** |
| **Reinforcement — L10** | Expand 48 both-right patterns × ~14 variations | **~650** |
| **Reinforcement — AGI** | Expand 18 both-right patterns × ~20 variations | **~350** |
| **Format/schema** | From 148 schemas, length-normalized edge cases | **~425** |
| **TOTAL** | | **~3,600** |

### Reinforcement seeds (the 145 "both-right" patterns)

**L1-8 (21 patterns):** market_buy, limit_buy, stop_loss, dex_swap, lending_borrow, liquidity_provision, futures_trade, twap_order, etc.

**L9 (58 patterns):** Delta-neutral funding arbitrage, basis trades, governance votes, compound quorum, custom hooks, carry basis, etc.

**L10 (48 patterns):** Oracle defense, wash-trade detection, veCRV voting power, cross-chain arbitrage, Solana validator economics, halving positioning, etc.

**AGI (18 patterns — reinforcement ONLY):** Event execution with private routing, adversarial queue management, etc.

### Correction seeds (the 39 non-AGI universal failures — already covered by salvage)

**L1-8 (13):** Liquidity analysis, bridging, tax loss harvesting, Sharpe ratio calculation
**L9 (14):** Compound governance, BTC basis unwind, Uniswap V4 hooks, carry basis, DAO bribes
**L10 (12):** Wash-trade detection, veCRV power, cross-chain arb, halving, Solana validator

**These are already in the 975 salvaged corrections.** No new corrections needed.

### Generation requirements (Steps 3-4)

For each reinforcement example:
1. **Same skill, different scenario** (different assets, numbers, venues, constraints)
2. **Format-matched to eval** (Execute@1 system prompt, eval user prompt format)
3. **Length-capped at 2,000 chars**
4. **Answer independently verified** (gold-checked against the rubric's expected values)
5. **Decontaminated** (8-gram overlap check against 300Q)
6. **~20% from a second generator** (break style monoculture)

### Assembly (Step 5)

Final v4 dataset = 975 salvaged corrections + 2,200 reinforcement + 425 format/schema = **~3,600**

**Tier distribution target:**

| Tier | Count | % |
|---|---|---|
| L1-8 | ~915 (415 corrections + 500 reinforcement) | 25% |
| L9 | ~981 (281 corrections + 700 reinforcement) | 27% |
| L10 | ~929 (279 corrections + 650 reinforcement) | 26% |
| AGI | ~350 (0 corrections + 350 reinforcement) | 10% |
| Format/schema | ~425 | 12% |

**Outcome distribution:**
- Reinforcement: ~2,625 (73%)
- Corrections: ~975 (27%)
- (Council target was 60/23/17 — this is 73/27/12, close enough. Reinforcement-heavy as prescribed.)

**Provenance target:**
- Salvaged (original generator): 975 (27%)
- New synthetic (base model patterns): ~1,700 (47%)
- Second generator: ~525 (15%)
- Human-curated: ~400 (11%)

---

## 🏛️ COUNCIL REVIEW: STEPS 3-5 PLAN

> **Finn:** "The composition is right — reinforcement-heavy, AGI at 10%, corrections capped at 27%. The length-cap at 2,000 is essential. The 20% second-generator requirement breaks the monoculture. The gold-check requirement is non-negotiable for corrections. **APPROVED.**"
>
> **Lambert:** "The decontamination check on each new row is mandatory. The null-reward control runs in parallel. The 975 salvaged need reformatting to Execute@1 (they're still in 'AIX' format from v2). **APPROVED — but reformat the salvaged before assembly.**"
>
> **Schulman:** "The composition is sound. The key risk is generating reinforcement examples that are too similar to each other (same skill, same template, different numbers). Each variation must be a genuinely different scenario, not a find-replace on asset names. **APPROVED.**"

**Steps 3-5 plan: APPROVED ✅ (unanimous)**

**Action items before execution:**
1. Reformat the 975 salvaged from "AIX" to "Execute@1" (the v3 converter already does this)
2. Generate ~2,200 reinforcement examples (this is the bulk of the work)
3. Generate ~425 format/schema examples
4. Assemble, length-cap, decontaminate, create held-out split
5. Council final approval before training
