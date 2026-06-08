# TradeBench Difficulty Levels

This file is the repo-local difficulty contract for TradeBench question design and audit.

Source references used to initialize it:

- `/Users/bradleymiles/Documents/New project 2/l9-l10-agi-workbench/source/tradebench-lite-tests/Round-5-Extension-1/tradebench Difficulty Scaling Table.md`
- `/Users/bradleymiles/Documents/tradebench-lite-tests/audit-results/difficulty-scaling-table.md`
- `/Users/bradleymiles/Documents/tradebench-lite-tests/audit-results/DIFFICULTY-TIER-AUDIT.md`

Those references are secondary guidance. The live benchmark should be governed by this repo and by observed grader behavior.

| Tier | Name | Benchmark Contract | Primary Failure Mode |
|---|---|---|---|
| L1 | Literal recall | Identify or extract one simple field. | Missing the obvious field. |
| L2 | Direct arithmetic | Perform one clear calculation step. | Basic arithmetic or rounding error. |
| L3 | Multi-variable math | Combine a small number of numeric inputs with the correct order of operations. | Wrong formula or missing fee/spread term. |
| L4 | Context plus time | Apply a duration, rate, or temporal conversion to a calculation. | Wrong annualization, compounding, or time basis. |
| L5 | Structural mapping | Put known information into the required execution schema. | Wrong key names or schema shape. |
| L6 | Procedural reasoning | Follow a defined sequence, schedule, or rule. | Skipped step or wrong order. |
| L7 | Multi-field synthesis | Combine multiple fields into one consistent result. | Partial calculation or inconsistent fields. |
| L8 | Conditional reasoning | Choose among alternatives using constraints, thresholds, or decision rules. | Correct math but wrong decision. |
| L9 | Multi-intent fusion | Combine at least two intents, venues, protocols, or action types with numeric reasoning and constraint satisfaction. | Emits a plausible scalar but misses route/action/constraint logic. |
| L10 | Protocol composition | Compose several protocols or market mechanisms into a nested plan with tradeoffs and guardrails. | Local correctness with global logic drift. |
| AGI | Autonomous strategy synthesis | Produce a self-consistent strategy that selects actions, checks constraints, and reconciles its own outputs. | Internally inconsistent plan or missing self-check. |

## L9 Minimum Standard

L9 should not be a single formula with one scalar answer unless the prompt also requires a non-trivial action choice or constraint check.

A strong L9 item should include at least two of:

- Cross-venue, cross-chain, or cross-protocol execution.
- A numeric result that depends on multiple market primitives.
- A route, action, or allocation choice.
- A hard feasibility constraint such as time, liquidity, oracle freshness, leverage, or risk cap.
- A consistency check between the scalar result and the selected action.

For grading, L9 rubrics must use canonical answer metadata when present. A response must not pass merely because it includes an `expected_value` field.
