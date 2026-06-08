# L9 Framework Audit - 2026-06-08

## Verdict

L9 should remain frozen for leaderboard interpretation until the canonical grader fix is included in the evaluation branch and the existing Llama run is recalibrated.

The primary issue found in the 2026-06-05 Llama rerun was a grading-path bug, not answer leakage. L9 rubric JSON files included `_l9_canonical` answers, but the 300Q grader did not score against them. Since L9 question objects did not contain `expected_values.expected_value`, the generic scoring path awarded full credit when the model merely emitted the `expected_value` field.

## Verified Local Findings

- L9 artifact before fix: 75/81 passed.
- Same raw L9 artifact regraded with canonical L9 scoring: 11/81 passed.
- False passes converted to failures: 64.
- All 81 L9 rubrics now pass when graded against their own canonical answers via `npm run verify:l9`.
- Known bad answers now fail:
  - `L9-001` with `21.91`, outside canonical range `18.5-18.8`.
  - `L9-003` with `33.33`, outside canonical range around `113.6 SOL`.
  - `L9-005` with `132000`, outside canonical result around `6.2M`.
  - `L9-009` with scalar `3`, where the canonical answer is an unordered set.
  - `L9-010` with `22750`, outside canonical result around `502550`.

## Difficulty Alignment

Using `docs/difficulty-levels.md`, L9 is supposed to test multi-intent fusion: action plus math plus constraints across venues, protocols, or routes.

The current L9 set contains real L9 candidates, especially restaking selection, hard route constraints, and no-action feasibility cases. It also contains too many repeated scalar templates.

Observed prompt-family concentration:

| Family | Count |
|---|---:|
| Cross-chain route math | 36 |
| Funding/arbitrage APR | 12 |
| Restaking selection | 11 |
| Liquidity/fee APR | 10 |
| Flash-loan EV | 10 |
| Leverage/LTV math | 1 |
| Other | 1 |

## Recommendation

Treat the grader fix as blocking and the content audit as next. After canonical L9 grading is in place:

1. Regrade the existing Llama artifact and publish the corrected L9 diagnostic internally.
2. Rerun cheap Llama smoke tests with the fixed prompt/grader path.
3. Audit L9 content for repetition and tier drift.
4. Demote or rewrite scalar-only L9 items such as simple APR, daily fee, or route-delta arithmetic unless they also require an action choice or constraint reconciliation.
5. Preserve hard questions even when models fail them; failure is useful if the rubric is fair and the task matches the tier contract.
