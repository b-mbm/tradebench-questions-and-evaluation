# GLM 5.2 independent review: Variant B item analysis

Date: 2026-07-19

Model: `zai/glm-5.2`

Mode: read-only (`read`, `grep`, `find`, `ls`; no shell or edit tools)

Inference/RunPod spend authorized: none

Process result: exit 0

## Scope reviewed

GLM 5.2 independently read and audited:

- `Internal_docs/VARIANT-B-ITEM-LEVEL-ANALYSIS-2026-07-19.md`
- `Internal_docs/variant-b-item-diff-2026-07-19.json`
- `scripts/analyze-variant-b-item-diff.ts`
- `RESEARCH-RUN.md` R4 through R6
- the grader, rubric loader, question source, and relevant rubric files for every disputed item

It was instructed to challenge the lead analysis, verify all 12 flips and all arithmetic, identify overclaims, and assess whether a roughly $61 replication was the highest expected CoinBench progress per dollar.

## Verdict

> **PASS WITH NON-BLOCKING CORRECTIONS**

GLM's conclusion:

- The 143/141 reproduction logic is sound and reconciles at every group level.
- All four observed base L9/L10 `mismatch_fieldname` failures disappear under Variant B.
- L10-046 and L10-050 are clean direct schema wins.
- L10-011 and L10-014 expose incomplete emitted-unit contracts after the schema is fixed.
- Eleven of the twelve flip explanations were correct as written.
- Closing Variant B without replication is the correct per-dollar decision for the CoinBench-lock milestone because benchmark repair dominates measuring a small prompt effect on a defective instrument.
- The raw -2 must not be described as a causal degradation.

## Corrections GLM required

1. **L4-004:** The original analysis incorrectly said the two responses had the same -50% follow-up. The base `follow_up_description` contains the explicit -50% shock; the candidate mentions -50% in `reasoning`, not in `follow_up_description`. The grader checks only the follow-up field for its soft pass. The prompt was unchanged, so this still is not a Variant B effect.
2. **L10-014:** The formula narrative references net profit percentage, but the output requirements do not unambiguously say to emit percentage rather than the equivalent ETH profit. The analysis should say the emitted unit was not pinned, not wholly omitted.
3. **Source pinning:** The initial matrix hashed responses, prompts, and gate IDs but not grader/rubric sources. The generator now hashes the question source, grader, rubric loader, and all 165 rubrics used by the gate.

All three corrections were applied before this review record was finalized.

## Additional caveats accepted

- L9-043's base pass is accidental: it also omits borrow interest, but its smaller error fits in the wide range. The candidate's interest is ten times the correct amount, while the canonical note is separately wrong.
- L9-027 and L9-043 show that canonical arithmetic failures may be systemic within the `borrow_bribe_vote` family.
- The unchanged-prompt L1-L8 flips demonstrate stochastic variation but do not estimate or bound the full-gate SEM.
- A paired n=5-per-arm run would have dual value: Variant B resolution and a variance-floor estimate. That may matter after benchmark repair, but does not outrank $0 lock defects now.

## GLM's five highest-priority lock defects

1. Pin unit and scale for every numeric `expected_value`, including percent versus decimal-fraction equivalence.
2. Audit and repair canonical arithmetic across the full `governance_incentive_action` / `borrow_bribe_vote` family.
3. Replace narrow semantic allow-lists and field-location tricks with tested normalization rules.
4. State the exact principal for every borrowing-cost and annualization calculation.
5. Ensure action-selection rubrics reward the optimal action and include known-bad fixtures proving inferior actions fail.

## Final independent disposition

GLM agreed with the founder disposition:

- 143/175 is a historical reference, not a statistical baseline.
- Variant B's narrow schema mechanism is confirmed in the observed sample.
- Benchmark-level improvement is not supported at n=1.
- Do not replicate Variant B now.
- Spend $0 on additional inference and move the surfaced defects into CoinBench lock work.
