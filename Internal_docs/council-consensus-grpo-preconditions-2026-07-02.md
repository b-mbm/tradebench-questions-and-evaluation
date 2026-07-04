# Post-Training Council — GRPO Precondition Review
**Date:** 2026-07-02  ·  **Lead:** Schulman (Seat 1)  ·  **Quorum:** Schulman, Lambert, Finn, Liang
**Trigger:** Operator asked council to verify ALL preconditions are set before any GRPO GPU spend.
**Result:** **UNANIMOUS — NOT READY.** Three seats independently reached NOT READY from different lanes. One seat (Liang) had a factual error caught and corrected by the blind-spot hunt (see §5).

---

## 0. THE HEADLINE: NOT READY. Four cheap fixes stand between us and GRPO.

The council agrees on the method (GRPO on the latent 39, TRL+SGLang, exclude the 14 deficit) and the platform. **The problem is not the plan — it's the substrate.** The grader is a hidden oracle for 33% of the benchmark, no held-out split exists, the null-reward control has never run, and the mutation-test has never been executed. Three of four seats independently said "do not light the GPU" — from reward-design (Schulman), eval-trust (Lambert), and data-bias (Finn) lanes respectively.

**The good news: every blocker is cheap.** Four are hours-of-work, no GPU. One (null-reward control) is ~1–2 days of compute. None require new data collection or new infrastructure.

---

## 1. The precondition checklist — VERIFIED GROUND TRUTH

| # | Precondition | Status | Cost to clear | Owner |
|---|---|---|---|---|
| **G1** | **Grader is verifiable (not hidden oracle)** | ❌ **BLOCKED — 99/110 AGI questions exact-match undisclosed free-form label strings** | Hours, no GPU | Liang/Schulman |
| **G2** | **Mutation-test executed** | ❌ **NEVER RUN** (harness exists: `scripts/mutation-test-stockbench.ts`) | Hours, no GPU (no model calls) | Liang |
| **G3** | **Held-out / unseen split** | ❌ **NOT BUILT** | Hours, no GPU | Finn |
| **G4** | **Null-reward control (Lambert's Qwen-contamination gate)** | ❌ **NEVER RUN** (no script, no result, deferred at every session) | ~1–2 days GPU (~$10–20) | Lambert |
| **G5** | **Full 300Q rerun variance (≥3 seeds)** | ⚠️ PARTIAL (±3 on 29Q only; no ≥3× on full 300Q) | ~$5 GPU | Lambert |
| **G6** | Format pass-rate >95% | ✅ PASS (100/300×2 valid JSON, under `json_object` constraint) | — | Schulman |
| **G7** | Train↔eval lexical contamination gate | ✅ PASS (max cosine 0.597, 0 reskins; sibling repo) | — | Lambert |
| **G8** | KL-from-reference + reward-hack logging wired | ❌ NOT YET (must be wired before step 1) | Hours, code | Schulman |
| **G9** | Capability probe (GRPO viability) | ✅ PASS (39/53 latent) | — | Finn |

**Bottom line: 3 PASS, 6 NOT DONE. Of the 6, four are hours-of-work (G1, G2, G3, G8), one is ~$5 (G5), one is ~$10–20 and 1–2 days (G4).**

---

## 2. THE GRAVER ISSUE: the grader is a hidden oracle (confirmed by direct audit)

This is the single most important finding and it was verified directly against the rubric data files (`src/rubrics/agi-*.json`), not by trusting any agent's summary.

### What the grader actually does
- **110/110 AGI rubrics validate `chosen_strategy`** via exact normalized string match (46 distinct values: `private_delever_to_mandate_floor`, `capacity_capped_delta_neutral_ladder`, `liquid_barbell_capped_tail`...).
- **109/110 validate `intent`** via exact normalized string match (31 distinct values: `liquidation_cascade_defense`, `adversarial_bridge_risk`, `adversarial_event_execution`...).
- `normalizeCategorical()` strips case/punctuation/whitespace ONLY — **no synonym matching, no Levenshtein, no semantic tolerance**.
- `scoreAgiValidation` (grader line 535): `normalizeCategorical(value) === normalizeCategorical(expected) ? 1 : 0` — pure binary exact-match.
- **99/110 AGI questions have UNDISCLOSED labels.** The prompt says "output a `chosen_strategy` string" but never tells the model what string to produce. Only 11/110 disclose a candidate list ("Choose the strategy from: [...]") and the expected value is confirmed present in all 11.

### Why this matters for GRPO (Schulman + Lambert + Finn agree)
1. **The reward is not RLVR-verifiable for ~33% of the benchmark.** GRPO finds the cheapest reward-maximizing behavior. On hidden-label questions, the cheapest path is *emitting the canonical label string*, not reasoning to the trading decision. (Schulman: "reward hacking baked into the reward definition before training starts.")
2. **The advantage normalization is polluted.** Group-relative advantage computed partly over label-string hits injects noise into the gradient for the questions where the reward IS meaningful. (Schulman.)
3. **The model that reasons correctly but names the strategy differently scores 0.** A semantically-correct `intent` under a synonym scores 0 on that field. This starves the gradient on exactly the latent-capability questions GRPO is meant to sharpen. (Lambert: "the cruelest version of the problem.")
4. **It is the exact R-DPO reward-hacking archetype.** Length was the proven instance; here the spurious correlate is label-string identity. (Finn.)

### The non-AGI 190 questions ARE genuinely verifiable
They use `fuzzyScore` with Levenshtein partial credit + synonyms (numeric ranges, boolean decision fields). This is real RLVR-grade reward. **The problem is concentrated in the AGI tier.**

### The 4 AGI latent questions (AGI-024, AGI-026, AGI-085, AGI-108)
**Exclude all 4 from GRPO training.** They are latent (the model CAN reason to the right decision) but the reward fires on the canonical label string, not the decision. Reinforcing them trains the model to trade reasoning for label-farming — strictly worse than excluding. (Finn: "the reward you'd be reinforcing is not the capability, it's the surface correlate.")

---

## 3. Seat-by-seat verdicts

### Seat 1 — Schulman (reward design, lead): NOT READY
- **Gate 1 is the truest blocker.** "I cannot in good conscience as lead sign off GPU on a reward that is one-third a guessing game." Veto on running GRPO on the current reward as-is.
- **Two paths to clear G1:** (a) Fix the grader — disclose labels or add fuzzy/synonym matching for AGI label fields (preserves full 300Q signal, ~30-line change); (b) Restrict reward to the verifiable subset (190 non-AGI + 11 disclosed AGI = 201, drop 99 hidden-AGI). Fallback floor if (a) can't be reconciled.
- **Mutation-test is real, not bureaucratic.** "It is the most direct possible test of where the reward diverges from true quality."
- **Held-out split: soft blocker to START, hard blocker to TRUST.**
- **Realistic expectation shrinks** if we cut the 99 hidden-AGI from reward: +12–20 band should be recomputed against the verifiable subset. "Better an honest smaller number than a contaminated one."

### Seat 2 — Lambert (eval trust, contamination): NOT READY — "I will not sign off on reading ANY number"
- **Null-reward control revoked from "parallel" to STEP ZERO.** "Calling a gate 'parallel' is how this team keeps not running it. It runs as step zero, it completes, and its first checkpoint is read before the expensive phase." Revoked the parallel designation after it was deferred at every session.
- **The grader is a hidden oracle — "GRPO will not learn strategy; it will learn to emit canonical label-shaped tokens, because that is what GRPO does."**
- **No held-out split + hidden-label grader = no readable number.** Either failure alone is disqualifying; both are present.
- **Minimum floor (5 items):** null-reward control run+cleared → held-out split decontaminated → full-bench ≥3-seed variance → grader made verifiable → mutation-test executed. Note what's NOT on his floor: GRPO-vs-PPO, KL schedule. Method is substitutable; eval trust is not.
- **Sequencing:** null control on grader-as-is first (tripwire), then grader fix, then null control on fixed grader (clean contamination read).

### Seat 3 — Finn (data bias, reward hacking): NOT READY — "conditionally green after three cheap fixes"
- **Hidden-label grader is exactly the R-DPO surface.** "Reward the phrasing, not the decision. That is length-hacking with the spurious dimension relabeled."
- **Proceed on 35 non-AGI latent only; exclude the 4 AGI latent.** Conditional on confirming the 35 are decision-graded (they are — non-AGI uses fuzzyScore).
- **Item-disjoint held-out split is the closest thing to a hard stop — but cheapest.** "Carve a split, a few hours." MAML principle: the test is whether it holds on tasks held out from the same family.
- **Four monitors the hidden-label surface demands:** decision-vs-label decoupling (score decision and label independently, watch divergence), label-string entropy (watch distribution collapse), spurious-dimension audit (length/hedging/verbosity), null-reward control.

### Seat 4 — Liang (eval validity): NOT READY (reached independently, but his reasoning had a factual error — see §5)
- **His conclusion (NOT READY) is correct even though his premises were wrong.** He reached NOT READY via the mutation-test-never-run + no-held-out + no-null-control gates — all of which are independently true regardless of the oracle count.
- **His valid contribution:** changing the grader mid-project invalidates the 161/300 baseline (HELM comparability). Must fix-then-rebaseline BEFORE GRPO, or freeze-and-disclose THROUGH GRPO. Pick one. Do not drift.

---

## 4. Where all seats AGREE (consensus)

1. **NOT READY. Do not spend GPU on GRPO as currently preconditioned.** Unanimous across the three seats whose premises survived audit; Liang's conclusion matches.
2. **Fix the grader before any GPU-hour.** Either disclose labels / add fuzzy matching (Schulman path a), or restrict reward to the verifiable 201 (Schulman path b), or quarantine the 8–99 oracle questions (Liang, depending on recount).
3. **Run the mutation-test.** It's free (no model calls), the harness exists, and it's never been run. Highest-information, zero-cost action.
4. **Build the held-out split.** Cheap (hours). The only thing that separates learning from memorization.
5. **Null-reward control is no longer "parallel" — it is step zero.** (Lambert's revocation, endorsed by Schulman and Finn.)
6. **Exclude the 4 AGI latent from GRPO training** (Finn) — the reward fires on the label string, not the decision.

---

## 5. BLIND-SPOT HUNT (Step 4 of the protocol) — AND A CAUGHT ERROR

### The council's own input was wrong — and the protocol caught it.
The ground-truth audit I fed the council was correct (99/110 hidden labels). But **Seat 4 (Liang) disputed it**, claiming only 8/110 AGI rubrics gate on `chosen_strategy` and that ~100 gate on a `selected_route` multiple-choice field that is disclosed in prompts.

**I verified directly against the rubric data files:**
- `selected_route` appears in **0** AGI rubrics. It does not exist.
- `chosen_strategy` is validated in **110/110** AGI rubrics via exact string match.
- `intent` is validated in **109/110**.
- Disclosure: **11/110** disclose the expected value in a candidate list; **99/110** are hidden.

**Liang's agent was wrong** — it conflated fields and miscounted. The original audit stands. **This is the blind-spot hunt working as designed:** the protocol requires verifying disputed facts directly rather than synthesizing on a disputed premise. Without Step 4, the council would have shipped a recommendation based on a false "only 8 hidden" finding.

**Lesson for future sessions:** any seat that disputes a ground-truth fact must have that fact re-verified against the primary source before synthesis. The seats are reasoning over a brief; the brief can be wrong, and so can a seat's independent reading of the code.

### What all four seats share (the Berkeley deep-RL lineage gap)
All four are method/eval scientists. None raised:
- **Cost-benefit of the full GRPO effort vs shipping the SFT model as-is.** The SFT model is already built and serves. Is +12–20 points on a partly-oracle benchmark worth $50–100 + weeks of work? No seat asked "is this worth doing at all?" — they all assumed GRPO proceeds.
- **The Light Year residency / Don Ho demo deadline.** Is there a time pressure that changes the cost-benefit? No seat considered shipping constraints.
- **Whether the benchmark itself should be fixed before post-training on it.** If 99/110 AGI labels are hidden oracles, the benchmark may be the problem, not the model. No seat proposed fixing the benchmark as the primary deliverable rather than fitting the model to a broken benchmark.
- **A quant/markets practitioner seat.** Whether `private_delever_to_mandate_floor` is actually the "right" trading answer, or just one author's naming. A fifth seat (markets practitioner) would pressure-test whether the canonical labels are even correct.

---

## 6. THE SEQUENCING (council-approved order to clear preconditions)

This is the merged, de-conflicted sequence across all four seats:

### Phase 0 — No GPU, hours of work (do this week)
1. **Run the mutation-test** (`scripts/mutation-test-stockbench.ts`). Free, no model calls. Confirms the grader rejects wrong answers. **[Liang — hours]**
2. **Decide grader-freeze strategy:** (a) disclose labels for all 110 AGI questions in prompts + add synonym/fuzzy matching, then RE-BASELINE everything from the fixed grader (161/300 moves and is re-set); OR (b) restrict the GRPO reward to the verifiable 201 (190 non-AGI + 11 disclosed AGI) and quarantine the 99. **Pick one before proceeding. Do not drift.** **[Schulman/Liang — decision + hours]**
3. **Build the held-out split.** Carve 8 of the 35 non-AGI latent out of training (NOT the AGI latent — those are excluded entirely per Finn). Item-disjoint, decontaminated. **[Finn — hours]**
4. **Wire KL-from-reference + reward-hacking argmax-dump logging.** Must be on before GRPO step 1. **[Schulman — hours]**

### Phase 1 — Cheap GPU, ~$5 (verifies the benchmark is a clean instrument)
5. **Run full 300Q ≥3 seeds on the base model** at temp 0.1. Quantify the real noise floor on the full benchmark (not just 29Q). **[Lambert — ~$5]**

### Phase 2 — ~$10–20 GPU, 1–2 days (Lambert's revoked-to-step-zero gate)
6. **Null-reward control.** Run GRPO with shuffled/random reward on the same prompts. If the 300Q moves, part of any future "gain" is Qwen-base contamination. Run on the grader-as-is first (tripwire), then on the fixed grader (clean read). **[Lambert — ~$10–20]**

### Phase 3 — Cheap pre-flight, ~$3 (decides platform finally)
7. **SGLang serve+reload + TRL server-mode rollout round-trip** on a 2× H100 pod. Verifies the platform before committing the full run budget. **[Schulman — ~$3]**

### Phase 4 — GRPO (only after all above pass)
8. **GRPO run #1** on 35 non-AGI latent minus 8 held-out = 27 train prompts, G=8, ~150–300 steps. KL + hack monitoring on.

---

## 7. What changes from the prior plan

| Prior plan (committed 7ebfe70) | Corrected after precondition review |
|---|---|
| Train on 39 latent | **Train on 35 non-AGI latent only** (exclude 4 AGI latent — reward fires on label, not decision) |
| Expect +12–20 on 300Q | **Recompute against verifiable subset.** Honest band is smaller. |
| Null-reward as "parallel arm to run #1" | **Null-reward is STEP ZERO** (Lambert revoked parallel). Must complete before GRPO accumulates spend. |
| Gate 1 (grader labels) = "a known issue" | **Gate 1 is THE blocker.** 99/110 hidden oracle, verified directly. Fix or restrict before any GPU. |
| Held-out split "before or concurrent with step 1" | **Held-out split is hard-stop cheap.** Build in Phase 0, no exceptions. |
| Mutation-test assumed done | **Never run.** Phase 0 step 1. |

---

## 8. Confidence

**Confidence in the method (GRPO): HIGH.** The probe evidence is the strongest fact in the file. The plan is sound.
**Confidence in the substrate: LOW.** The grader is partly a hidden oracle, no held-out split, no null control, mutation-test never run, no real variance bounds. As Lambert put it: "the honest number does not exist here yet."
**Confidence that the fixes are achievable: HIGH.** Four hours-of-work items + ~$15–25 GPU. None require new data or new infra.

**Net: the path to GRPO is clear and cheap, but we are not on it yet. Start with Phase 0 — four items, no GPU, this week.**
