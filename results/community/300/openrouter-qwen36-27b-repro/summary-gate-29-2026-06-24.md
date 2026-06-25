# OpenRouter Qwen3.6-27B Repro Gate 29

Generated: 2026-06-24T23:28:10.941Z

## Verdict

STOP: do not run full 300. The 29-row gate scored 10/29, below the <=12 hard-stop threshold and far below the archived 26/29 for the same selected IDs.

## Run Config

- Model: qwen/qwen3.6-27b
- Provider: OpenRouter
- Script: scripts/run-300q.ts
- response_format: json_object (hard-coded by src/models/providers/openrouter.ts)
- Temperature: 0.1
- Max tokens: 2200
- Concurrency: 4
- Retry attempts: 2
- Result file: results/community/300/openrouter-qwen36-27b-repro/openrouter-qwen36-27b-repro-gate-29-2026-06-24T23-27-01-899Z.json

## Score

- Pass: 10/29
- Fail: 19/29
- Parsing methods: {"json":13,"none":16}
- Failure reason counts: {"agi_validation_failed:intent":2,"agi_validation_failed:chosen_strategy":2,"agi_validation_failed:execution_sequence":1,"agi_validation_failed:worst_case_residual_pnl_usd":1,"truncated_response":16,"transport_error":16,"agi_validation_failed:leverage":1,"agi_validation_failed:apr_pct":1,"agi_validation_failed:pnl_30d_usd":1}

## Per-Tier

- AGI: 0/6
- L1: 2/2
- L10: 2/8
- L2: 2/2
- L4: 0/1
- L6: 1/2
- L9: 3/8

## Archived Reference For Same 29 IDs

- Archived qwen/qwen3.6-27b total: 166/300
- Archived selected 29 score: 26/29
- Archived selected split: L1 2/2, L2 2/2, L4 1/1, L6 2/2, L9 8/8, L10 8/8, AGI 3/6

## Interpretation

This run does not reproduce the archived OpenRouter behavior. Because 16 rows returned parsingMethod=none with blank raw output and truncated_response/transport_error failure reasons, the result is primarily a current OpenRouter/provider/protocol reproducibility failure, not a new full-benchmark score. The full 300 was intentionally not run.

## Failed Rows

- AGI-001: score=0.556 conf=1.00 parse=json rawLen=990 reasons=agi_validation_failed:intent|agi_validation_failed:chosen_strategy|agi_validation_failed:execution_sequence|agi_validation_failed:worst_case_residual_pnl_usd
- AGI-002: score=0.000 conf=0.00 parse=none rawLen=0 reasons=truncated_response|transport_error
- AGI-003: score=0.000 conf=0.00 parse=none rawLen=0 reasons=truncated_response|transport_error
- AGI-004: score=0.000 conf=0.00 parse=none rawLen=0 reasons=truncated_response|transport_error
- AGI-014: score=0.545 conf=1.00 parse=json rawLen=985 reasons=agi_validation_failed:intent|agi_validation_failed:chosen_strategy|agi_validation_failed:leverage|agi_validation_failed:apr_pct|agi_validation_failed:pnl_30d_usd
- AGI-024: score=0.000 conf=0.00 parse=none rawLen=0 reasons=truncated_response|transport_error
- L10-001: score=0.000 conf=0.00 parse=none rawLen=0 reasons=truncated_response|transport_error
- L10-002: score=0.000 conf=0.00 parse=none rawLen=0 reasons=truncated_response|transport_error
- L10-005: score=0.000 conf=0.00 parse=none rawLen=0 reasons=truncated_response|transport_error
- L10-007: score=0.000 conf=0.00 parse=none rawLen=0 reasons=truncated_response|transport_error
- L10-009: score=0.000 conf=0.00 parse=none rawLen=0 reasons=truncated_response|transport_error
- L10-012: score=0.000 conf=0.00 parse=none rawLen=0 reasons=truncated_response|transport_error
- L4-001: score=0.557 conf=0.60 parse=json rawLen=558 reasons=
- L6-003: score=0.000 conf=0.00 parse=none rawLen=0 reasons=truncated_response|transport_error
- L9-001: score=0.000 conf=0.00 parse=none rawLen=0 reasons=truncated_response|transport_error
- L9-003: score=0.000 conf=0.00 parse=none rawLen=0 reasons=truncated_response|transport_error
- L9-004: score=0.000 conf=0.00 parse=none rawLen=0 reasons=truncated_response|transport_error
- L9-006: score=0.000 conf=0.00 parse=none rawLen=0 reasons=truncated_response|transport_error
- L9-007: score=0.000 conf=0.00 parse=none rawLen=0 reasons=truncated_response|transport_error
