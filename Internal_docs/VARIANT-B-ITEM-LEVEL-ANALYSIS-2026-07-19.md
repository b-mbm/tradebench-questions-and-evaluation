# Variant B 175-gate item-level analysis

Date: 2026-07-19

Decision owner: Bradley Miles

Analysis cost: $0

Inference performed: none

## Executive conclusion

Variant B fixed the narrow prompt/schema conflict, but it did not demonstrate a benchmark-level score improvement.

- Historical base reference: 143/175.
- Variant B exploratory run: 141/175.
- Raw delta: -2.
- Direct mechanism result: all four base-run `mismatch_fieldname` failures on L9/L10 disappeared under Variant B.
- Only two of those four became passes. The other two then failed numeric range checks because the question-specific output requirements did not state whether `expected_value` should be dollars, tokens, or percent.
- The 12 pass/fail flips include benchmark defects, ambiguous questions, percentage-scale mistakes, unrelated mathematical changes, and stochastic allocation changes. They do not support a causal claim that Variant B reduced general reasoning ability.

The scientifically defensible disposition is:

> The schema-conflict mechanism is confirmed in this sample. The preregistered benchmark-level improvement is not supported at n=1. Close Variant B without replication or inference spend, retain Variant A as the release prompt, and carry the prompt and grading defects into the CoinBench lock audit.

The 143/175 result is a canonical historical reference, not a statistical baseline: the two arms were not seed-paired, the temperature was 0.1 without a supplied seed, and the June 29 serving provenance is incomplete.

## Inputs and method

The deterministic comparison script is `scripts/analyze-variant-b-item-diff.ts`. It:

1. loads the preserved June 29 base responses and July 19 Variant B responses;
2. restricts both to the identical 175 gate IDs;
3. grades every response through the same current TypeScript grader and rubrics;
4. asserts the reproduced totals, 143 and 141;
5. records prompt equality, normalized outputs, field scores, failure reasons, and full evidence for each pass/fail flip.

The machine-readable output is `Internal_docs/variant-b-item-diff-2026-07-19.json`. It includes SHA-256 hashes for both response sets, both prompt files, the gate file, the question source, the grader and rubric loader, and every rubric used by the 175 items. Any source or rubric edit therefore changes the matrix hash and requires regeneration.

Observed prompt scope:

| Group | Gate items | Prompts changed A to B |
|---|---:|---:|
| L1-L8 | 32 | 0 |
| L9 | 68 | 68 |
| L10 | 63 | 63 |
| L11 | 12 | 12 |

Because the run was unseeded, unchanged prompts are a noise/grader control, not paired deterministic outputs. L11 also received the schema-prompt change and is not a pure negative control.

## Reproduced score comparison

| Group | Historical base | Variant B | Delta |
|---|---:|---:|---:|
| L1-L8 | 24/32 | 22/32 | -2 |
| L9 | 63/68 | 62/68 | -1 |
| L10 | 54/63 | 56/63 | +2 |
| L11 | 2/12 | 1/12 | -1 |
| **Total** | **143/175** | **141/175** | **-2** |

The preregistered Variant B prediction was +3 to +6 across L9/L10. The observed combined L9/L10 result was +1, so the prediction was not met.

## Direct mechanism test

The base run had four L9/L10 failures caused by the generic `ExecuteOneResponse` schema omitting `expected_value`:

| Item | Base | Variant B | Interpretation |
|---|---|---|---|
| L10-011 | `mismatch_fieldname` | numeric range failure | Schema fixed. Candidate reports USD profit while rubric expects percent return; its reasoning also states the correct 25.3% return. Output requirements name `expected_value` but omit its unit. |
| L10-014 | `mismatch_fieldname` | numeric range failure | Schema fixed. Candidate reports 10 ETH while rubric expects 1% profit; its reasoning states both. The formula narrative references net profit percentage, but the output requirements do not unambiguously instruct the model to emit percentage rather than ETH. |
| L10-046 | `mismatch_fieldname` | pass | Clean causal schema win. Correct 0.35% cost moved into `expected_value`. |
| L10-050 | `mismatch_fieldname` | pass | Clean causal schema win. Correct $35,510 hedge cost moved into `expected_value`. |

Counts:

- Base L9/L10 `mismatch_fieldname`: 4.
- Variant B L9/L10 `mismatch_fieldname`: 0.
- Base missing `expected_value`: 4.
- Variant B missing `expected_value`: 0.

This is strong within-run evidence for the mechanism. It is not evidence for the larger predicted score effect because question-level unit specification and unrelated answer variance still determine final pass/fail.

## Classification of every pass/fail flip

| Item | Flip | Classification | Finding |
|---|---|---|---|
| L4-002 | Base only | Grader synonym brittleness; unchanged prompt | `risk_analysis` passes while semantically equivalent `correlation_risk_assessment` is a fatal invalid order type. This is not a Variant B effect. |
| L4-004 | Base only | Response/grader interaction; unchanged prompt | Base soft-passes because its `follow_up_description` explicitly contains a -50% shock. Candidate mentions the -50% scenario in `reasoning`, but not in `follow_up_description`; the grader checks only the latter. The `100` and `100%` sizes are equivalent and neither directly encodes the shock. This is not a Variant B effect. |
| L9-021 | Base only | Ambiguous question | Borrow drag does not specify its principal. Base applies 11% APR to $1.65M notional; candidate applies it to $750k capital. A leveraged trade could imply a third principal. The narrow key silently assumes trade notional. |
| L9-027 | Variant B only | Defective and internally contradictory question/key | Prompt says votes may be bribed **or** borrowed, then its formula subtracts both. The canonical note uses $243k bribes although 54,000 x $5 = $270k. Candidate's bribe-only $524,250 happens to fall in the range; the cheaper borrow-only action is $767,365. This pass is not valid capability evidence. |
| L9-031 | Variant B only | Genuine math/input-selection improvement; mechanism-unrelated | Base uses the generic context price $2,990 instead of the question's explicit $3,300 stETH price. Candidate uses $3,300 and obtains the keyed $373,547.54 repayment. |
| L9-042 | Base only | Percentage-scale regression | Candidate reasoning correctly derives 4.33% APR but emits decimal fraction `0.04329361548`; rubric expects percentage points. |
| L9-043 | Base only | Genuine arithmetic regression plus flawed canonical note | Candidate computes five-day borrow interest as $15,616.44, ten times the correct $1,561.64. Base also answers incorrectly by omitting interest, but its error fits inside the wide range. The canonical note is separately wrong at $1,874; the correct EV is about $450,788. |
| L10-044 | Base only | Percentage-scale regression | Candidate correctly derives 74.8% upside capture but emits `0.748`; rubric expects percentage points. |
| L10-046 | Variant B only | Direct schema-conflict win | Base math and execution plan are correct but use the generic execution schema. Variant B follows the question-specific three-field schema and passes. |
| L10-050 | Variant B only | Direct schema-conflict win | Base math is correct but omits `expected_value` under the generic schema. Variant B emits the keyed USD cost and passes. |
| L10-055 | Variant B only | Genuine math improvement; mechanism-unrelated | Base incorrectly treats 3.2% APR as roughly $347k of 91-day gross interest. Candidate correctly prorates the yield and lands near $59.5k net. |
| AGI-004 | Base only | Unrelated allocation regression | Both outputs use the requested AGI schema. Base selects the keyed higher-yield allocation; candidate shifts $10k from GMX to Aave and lowers expected APY. This is not the L9/L10 schema mechanism. |

The five Variant B-only passes decompose into:

- 2 direct schema wins: L10-046, L10-050;
- 2 genuine but mechanism-unrelated math/input wins: L9-031, L10-055;
- 1 invalid benchmark win: L9-027.

The seven base-only passes decompose into:

- 1 unchanged-prompt grader synonym defect: L4-002;
- 1 unchanged-prompt response/grader-location interaction: L4-004;
- 1 ambiguous item: L9-021;
- 2 percentage-scale output regressions after correct reasoning: L9-042, L10-044;
- 1 arithmetic regression with a separately flawed canonical note: L9-043;
- 1 unrelated AGI allocation regression: AGI-004.

## Decision and scientific record

Founder decisions recorded for this run:

1. Adopt 143/175 as the canonical historical base reference, not as a statistical baseline.
2. Close Variant B as `benchmark-level improvement not supported at n=1`; do not replicate.
3. Spend $0 on additional inference. Evidence retrieval was completed through S3 at $0.

Variant B should not be described simply as “the prompt made the model two questions worse.” That causal statement is unsupported by an unseeded comparison and contradicted by the item evidence. It should also not be shipped based solely on the disappearance of schema mismatches, because the actual frozen-grader score did not improve and the intervention exposed missing unit contracts.

## CoinBench-lock implications

These findings become concrete lock-sprint work, not reasons to retroactively rescore this experiment:

1. Make every numeric `expected_value` contract state its unit and scale in the question's output requirements.
2. Add equivalent-representation tests: `0.748` versus `74.8%`, `$10` in asset units versus `1%`, and string/number percentage forms.
3. Repair or adjudicate L4-002, L4-004, L9-021, L9-027, and L9-043 before CoinBench lock.
4. Audit every `borrow_bribe_vote` sibling, because L9-027 and L9-043 show two canonical-arithmetic failures in the same family.
5. Add known-bad fixtures proving contradictory alternatives, wrong canonical arithmetic, and silent principal assumptions fail validation.
6. Require future run manifests to record seed, model/checkpoint hash, prompt hash, serving command, SGLang version, CUDA/driver, and GPU.
7. Do not use the sealed CoinBench set as a training fitness function. Convert these defect classes into item-disjoint development siblings after the benchmark is repaired and split.

## Residual uncertainty

- The full-gate variance remains unmeasured.
- The historical base serving environment cannot be fully reconstructed.
- The two runs were not seed-paired.
- This analysis establishes what happened in the observed outputs; it does not estimate a population-average prompt effect.

Those uncertainties limit causal claims, but they do not justify a roughly $61 paired replication before the benchmark defects are repaired. Such a design would also help estimate the missing variance floor, so it may have post-lock methodological value; under the founder's immediate per-dollar lock objective, fixing benchmark contracts has higher expected value.
