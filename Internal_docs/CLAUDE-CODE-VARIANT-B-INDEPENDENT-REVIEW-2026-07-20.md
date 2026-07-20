# Claude Code independent review: Variant B closure

Date: 2026-07-20

Reviewer: Claude Code 2.1.116, `opus`, high effort

Mode: clean read-only review (`Read`, `Grep`, `Glob` only; no edits or shell)

Process result: exit 0

## Verdict

> Approve closure with the stated disposition.

Claude found no blocking correction. It agreed that:

- the observed totals are 143/175 for the historical base responses and 141/175 for Variant B;
- all four observed base L9/L10 `mismatch_fieldname` failures disappear under Variant B, with L10-046 and L10-050 becoming passes;
- the raw -2 cannot be described as a causal degradation under an unseeded, historical n=1 comparison;
- declining the approximately $61 paired replication is the correct per-dollar decision before CoinBench's known defects are repaired; and
- the next highest-value action is a unit-and-scale contract audit, followed by adjudication of the known defective items.

## Useful additional finding

Two of the seven base-only flips, L4-002 and L4-004, occurred among the 32 questions whose prompts were byte-identical across arms. That observed 2/32 unchanged-prompt flip count is already the same magnitude as the aggregate -2 result. It is not a variance estimate, but it is direct evidence that the headline delta is contaminated by stochastic output/grader interaction rather than a clean Variant B effect.

AGI-004 is likewise an unrelated allocation/grader flip, not evidence about the L9/L10 schema mechanism.

## Lead adjudication of Claude's proposed corrections

Two proposed non-blocking corrections were rejected after direct source verification:

1. Claude described 143/141 as merely asserted by the analysis script. The script actually loads all raw responses, grades each gate item through `gradeSchemaResponse`, counts the resulting passes, and then asserts 143/141 as a drift guard. A local replay at commit `8cff1335f54a4273da589b403ff97581c9245296` reproduced both totals and regenerated the item matrix byte-identically.
2. Claude could not verify the L9-027 canonical note's `$243,000` bribe figure because it did not open the rubric. `src/rubrics/l9-L9-027.json` does contain `$243,000`; the prompt's stated arithmetic is 54,000 votes times $5, or `$270,000`. The defect is confirmed.

One additional arithmetic refinement is non-blocking: L10-055's exact stated-convention result is approximately `$59,482.85`, while the rubric key is `$59,473` and the Variant B response is `$59,525.75`. The response remains inside the rubric range, so its pass and its classification as a mechanism-unrelated mathematical improvement are unchanged.

## Final disposition

- Keep 143/175 labeled a historical reference, not a statistical baseline.
- Close Variant B as `benchmark-level improvement not supported at n=1`.
- Do not replicate or spend on inference.
- Carry unit/scale contracts and L4-002, L4-004, L9-021, L9-027, and L9-043 into the CoinBench lock audit.
