# TradeBench 300 Verifier Audit

Scope: first-pass verifier audit of the 79 universal-fail questions from the authoritative 69-model matrix.

This audit checks whether universal failure is likely genuine model difficulty or a benchmark/verifier artifact.
It focuses first on non-AGI universal fails, because low/mid-tier universal failure is more suspicious than AGI universal failure.

Inputs:

- `results/official/300/June 15th final/exhaustive analysis/basic.txt`
- `results/official/300/June 15th final/exhaustive analysis/advanced.jsonl`
- `src/questions/schema-questions-300q.ts`
- `src/rubrics/*.json`
- `src/grading/schema-grader-300q.ts`

## Summary

Universal fails: 79

Tier breakdown:

- L5: 2
- L7: 1
- L9: 1
- AGI: 75

Verifier verdict:

- The 4 non-AGI universal fails should be treated as verifier/problem artifacts until repaired or waived.
- The 75 AGI universal fails look mostly like genuinely hard strategy/synthesis rows, but many failures are driven by strict categorical labels (`intent`, `chosen_strategy`, `self_check`) as well as missing fields/numeric misses. These are usable as a hard pool only after a second verifier pass confirms the categorical labels are fair.

## Non-AGI Universal Fails

| ID | Verdict | Evidence | Recommendation |
|---|---|---|---|
| `L5-001` | PARTIAL / rubric too narrow | 67/69 failures have no explicit failure reason but scores just below threshold. Example good answers use `concentrated_liquidity` and `uniswap_v3`; top score observed was `0.704` vs pass threshold `0.72`. Prompt asks for Uniswap V3 concentrated liquidity, and many answers did that. | Add/loosen synonyms for `concentrated_liquidity`, `uniswap_v3`, range LP wording, or lower threshold slightly. Do not use as a clean training failure until fixed. |
| `L5-002` | PARTIAL / custom validator too narrow | Most failures are `leverage_invalid_order_type` or `leverage_invalid_intent`. Good answers use `loop`, `leverage`, or `leverage_long` with Aave recursive deposit/borrow/swap reasoning. Custom validator accepts `recursive_borrow` but rejects common equivalent wording. | Accept `loop`, `leverage`, `recursive_loop`, `deposit_borrow_swap` as valid order types if reasoning describes the 3x Aave loop. |
| `L7-001` | PARTIAL / prompt underspecified vs strict rubric | Prompt says “Analyze flash loan arbitrage opportunity between DEXes.” Rubric auto-fails concrete assets and numeric sizes because it treats the row as a meta-question. Many models reasonably instantiate an example asset/size. | Either rewrite prompt to explicitly request generic/meta analysis, or loosen rubric to accept concrete example analysis if the flash-loan arbitrage logic is correct. |
| `L9-043` | ERROR / prompt-canonical contradiction | Prompt says missing votes can be rented with bribes at `$0 per ARB vote` or borrowed at `$1` spot with `12% APR`. Canonical subtracts `$52,250` bribe cost plus `$1,874` borrow interest, producing `$450,476`. Models commonly compute `$503,038` or `$504,600`, consistent with the prompt as written. | Fix prompt or canonical. Do not train on this row as-is. |

`L4-003` is not universal-fail in the authoritative matrix; it has 2 passes.

## AGI Universal Fails

AGI universal-fail count: 75.

Aggregate failure reasons across the 5,175 AGI universal-fail cells:

- `agi_validation_failed:intent`: 4,944
- `missing_field`: 4,877
- `agi_validation_failed:chosen_strategy`: 3,998
- `agi_validation_failed:self_check`: 3,479

Interpretation:

- These rows are not obviously broken in the same way as `L9-043`; many include detailed primitives, derivations, and numeric ranges.
- But the verifier is strict about exact categorical labels for `intent`, `chosen_strategy`, and ordered `self_check` tokens.
- That strictness may be intentional for AGI pass@1, but it should be independently reviewed before treating every AGI universal fail as pure model incapability.

## Training Implication

Do not build V2 training data by copying these eval rows.

For training:

1. Exclude or repair the 4 non-AGI artifact rows before using them as failure-derived curriculum.
2. For AGI rows, create sibling tasks with different numbers/assets/routes but the same reasoning pattern.
3. Include output-shape examples that teach the model to follow the requested schema without memorizing exact eval labels.
4. Treat `self_check` labels carefully: train semantic self-checking behavior, not just exact string copying.

## Claude/External Review Target

Ask external reviewers to verify:

1. Whether the four non-AGI rows above are truly artifacts.
2. Whether AGI categorical labels are fair under strict pass@1.
3. Whether any AGI universal-fail row has a hidden missing assumption, wrong derivation, or over-narrow rubric.
