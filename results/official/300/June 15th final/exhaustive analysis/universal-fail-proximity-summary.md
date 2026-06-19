# Universal-Fail Proximity Audit

Scope: 79 universal-fail rows from the authoritative 69-model TradeBench/CoinBench 300Q matrix.

## Verdict

The universal-fail pool is mixed. The 4 non-AGI universal fails are likely verifier/problem artifacts, not clean model failures. The 75 AGI universal fails are mostly genuinely hard, but many near-miss rows should be reviewed for over-strict categorical labels (`intent`, `chosen_strategy`, `self_check`) before being used as proof of model incapability.

## Counts By Codex Status

- genuinely_hard_partial: 32
- close_but_strict: 24
- genuinely_hard_far: 11
- near_miss_review: 5
- way_off_or_too_strict: 3
- verifier_artifact_likely: 2
- prompt_rubric_mismatch: 1
- canonical_error_likely: 1

## Most Actionable Rows

- `L9-043`: likely canonical error. Prompt says bribes cost `$0 per ARB vote`; canonical subtracts `$52,250` bribe cost.
- `L5-001`: near-threshold concentrated-liquidity answers rejected; likely synonym/threshold artifact.
- `L5-002`: Aave leverage-loop answers rejected due narrow order_type/intent validator.
- `L7-001`: prompt allows concrete flash-loan analysis, rubric expects generic meta-answer.
- AGI near-threshold rows worth manual review: rows with `best_score >= 0.68` in `universal-fail-proximity-intermediate.csv`.

## Training Guidance

Do not copy eval rows into training. Build sibling tasks that preserve the skill pattern but change numbers, instruments, route sets, and constraints. Exclude or repair the 4 non-AGI artifact rows before using them as failure-derived curriculum.
