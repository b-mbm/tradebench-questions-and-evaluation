# Chunk 2 — Phase B recoverable pool (27B-failed, ≥1 other passed), by failure mode

Source: authoritative 69×300 `intermediate-matrix.csv` + per-cell `advanced.jsonl` (27B = `qwen/qwen3.6-27b`).
27B base = **166/300**. Recoverable = 27B failed AND ≥1 other model passed.

- **Recoverable pool: 55** · **Strong (≥10 other models passed): 28**
- Recovering the 28 strong → 166 + 28 = **194 > 189 target**; even ~23/28 hits 189. The win is reachable
  on demonstrably-solvable recoverable points alone (no AGI hidden-schema row needed).

## Failure-mode map (verified by failureReasons, NOT raw field-diff)
> Note: a naive answer-vs-`expected_values` diff mislabels L9/L10 as "missing_field" because their
> `expected_values` stores rubric metadata (`expected_value`, `acceptable_range`, `grading_logic`).
> The real modes come from `failureReasons`:

| failure mode | count | strong | tiers | 27B's actual error (failureReasons) | training lever |
|---|---|---|---|---|---|
| **numeric exactness** | **27** | 15 | L9(14)+L10(13) | `l9_expected_value_mismatch`, `l10_expected_value_out_of_range` | GRPO dense numeric reward + numeric SFT siblings |
| **structured-plan synthesis** | **17** | 7 | AGI | `agi_validation_failed` + `missing_field` (incomplete multi-field plan) | AGI synthesis SFT (full plan shape + correct sub-values) |
| **categorical schema/intent** | **11** | 6 | L2–L7 | wrong intent/order_type/venue (+ a couple LP net-return consistency) | schema-discipline SFT siblings |

## Strong-28 (the primary win engine), by mode
- **Numeric (15):** L10-047, L9-072, L10-068, L9-015, L9-005, L10-051, L10-043, L10-017, L10-044, L9-037, L9-021, L10-024, L9-053, L10-006, L10-025
- **Synthesis (7):** AGI-015, AGI-059, AGI-108, AGI-086, AGI-025, AGI-026, AGI-087
- **Categorical (6):** L6-004, L3-003, L3-001, L7-002, L4-002, L4-004

(2 L10 strong rows had infra noise — 1 `transport_error`, 1 `truncated_response` — so they may be even
easier than "recoverable"; re-confirm on the clean 27B re-eval in Chunk 4.)

## Implication for Chunk 3 (V2 build sizing)
Size the training set to the failure-map prevalence: **numeric-heaviest** (27 modes → biggest sibling
family), then **synthesis** (17), then **categorical** (11) — plus Prong-A AGI skill pool (68) and
maintenance examples. Never pad to a round number.
