# Council Decision: Grader-Freeze Strategy
**Date:** 2026-07-03 · **Step 2 of Phase 0** · **Lead input: Step 1 mutation-test (commit 09952a2)**

## VERDICT: UNANIMOUS — Path (b) RESTRICT THE REWARD

All four seats independently chose (b), each from their own lane:
- **Schulman (reward design):** "(b) now. (c) later, only if (b)'s delta earns it. (a) never." Veto on the fuzzy matcher.
- **Lambert (eval-trust/RLVR):** "(b). Disclosing labels is contamination by construction. A smaller clean reward beats a larger contaminated+noisy reward."
- **Finn (data-bias/reward-hacking):** "(b) with refinements. The mutation test confirmed the R-DPO mechanism is already happening on the AGI fields."
- **Liang (eval-validity/HELM):** "(b). Report 201 verifiable as headline, ~97 oracle as transparent limitation. Fix L4-002/L8-009 regardless."

The council is NOT split. No operator decision required.

## What (b) means concretely
1. **Grader stays frozen.** No changes to `schema-grader-300q.ts`. No prompt edits. The 161/300 baseline and OpenRouter's 164/300 stand on the identical grader — comparability preserved.
2. **GRPO reward restricted to the verifiable subset: ~202 questions** (190 non-AGI + ~12 disclosed AGI). The mutation test proved these are genuinely verifiable (numerics 99% detected, 94% flipped; missing fields 85% detected, 92% flipped).
3. **The ~98 hidden-oracle AGI are quarantined from the reward** but stay in the benchmark for **separate-tier reporting** (HELM: never sum into one headline).
4. **The 4 AGI latent (AGI-024/026/085/108) excluded from GRPO training** per Finn — reward fires on label string, not decision.
5. **GRPO delta measured on the ~202-subset specifically** (re-mask existing base responses — no GPU re-baseline needed).

## The refinements the council attached (binding)
- **Schulman:** Realistic expectation band on the 35 non-AGI latent is **+6–13** (lower than the prior +12–20), because removing the 4 AGI latent deletes the noisiest, most-imaginary-headroom cells. Treat anything above +13 as a contamination tell until the null-reward control clears.
- **Schulman:** Path (c) = disclose + EXACT match (no fuzzy) is the fallback IF (b)'s delta earns further investment. Never (a)'s fuzzy matcher.
- **Finn:** Audit the 190 non-AGI for residual spurious-correlate surfaces (near-zero-weight-but-present fields like `intent`, structural gates). Quarantine is necessary but not sufficient.
- **Finn:** Use the 98 quarantined AGI as the **held-out generalization probe** (no reward, no disclosure) — if GRPO on the 202 improves the 98, that's real transfer; if it regresses while the 202 improves, stop.
- **Liang:** Fix L4-002 and L8-009 (deterministic canonical failures — pass at grade time, score 0 and 0.525 on re-grade) regardless of path. These are grader-validity bugs independent of the freeze. (Verified: NOT nondeterminism — the grader is a pure function with no RNG.)
- **Liang:** Report two distinct numbers, never summed: "~202Q verifiable (mutation-robust)" and "~98Q oracle/judged (leak-prone, lower confidence)."

## Disclosure count reconciliation (HELM auditability)
The exact disclosed/undisclosed split depends on measurement method:
- Candidate-list pattern ("Choose the strategy from: [...]"): **11**
- Expected value verbatim in prompt (normalized): **12** (the 11 + AGI-112)
- Prose-marker grep (Liang's method): **13**
**Verifiable subset = 190 non-AGI + ~12 disclosed AGI = ~202.** The 1-2 question boundary doesn't change the decision. The exact manifest will be produced from the verbatim-value method (most auditable).

## Why (a) was rejected (the council's reasoning, synthesized)
1. **Disclosure is contamination by construction** (Lambert). The model copies the label from the prompt instead of reasoning to it. The AGI tier silently downgrades from "strategy synthesis" to "pick from a menu."
2. **The fuzzy matcher is a NEW reward-hack surface** (Schulman, Finn). Levenshtein tolerance rewards near-miss strings — format optimization, not strategy reasoning. Exact-on-disclosed > fuzzy-on-disclosed > fuzzy-on-undisclosed. (a) picks the middle for no reason.
3. **Changing the grader mid-project breaks claim comparability** (Liang). Even with dual re-baseline, the benchmark now measures a different construct. The old 161 and new 161 are not the same number.
4. **The mutation test already showed the AGI signal is degenerate** (Finn). Real model responses never matched the canonical string — field scores 0. Rewarding on a signal you've empirically shown is string-collapsed is the opposite of what the evidence says.

## BLIND-SPOT HUNT (Step 4 of protocol)
**Where all seats agree (the shared-lineage gap):** All four chose (b) and all four framed it as a *measurement* decision (reward validity, eval trust, hack surface, HELM). None asked the **markets** question: do the ~202 verifiable fields (mostly numerics — sizes, prices, allocations, expected values) actually correlate with trading edge? A model that optimizes numeric accuracy on these fields might not be a better trader. The benchmark measures *numerical bookkeeping correctness*, not *strategy quality*. A fifth seat (markets/quant practitioner) would pressure-test whether the verifiable subset is even worth optimizing. **The council cannot answer this — it's outside the post-training craft.**

**What all seats missed:** None considered whether the 98 quarantined AGI could be recovered as a *real strategy verifier* (simulate the chosen strategy, check an outcome) rather than a label-matcher. Lambert gestured at this ("a research item, not a blocker") but no seat developed it. This is the path to recovering the AGI tier honestly — and it's a future research item, not a Phase 0 task.

**Confidence: HIGH.** Unanimous across four independent lanes, grounded in the Step 1 mutation evidence, with the decision invariant to the disclosure-count discrepancy.
