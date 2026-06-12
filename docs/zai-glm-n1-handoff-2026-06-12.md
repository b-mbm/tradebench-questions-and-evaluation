# Z.ai GLM N=1 Handoff - 2026-06-12

## Scope

This note records the TradeBench 300Q Z.ai GLM N=1 run state for future Codex sessions.

Models in scope:

- `z-ai/glm-5.1`
- `z-ai/glm-5-turbo`
- `z-ai/glm-5`

Model dropped from this baseline:

- `z-ai/glm-5v-turbo` - visual/turbo variant was removed from the GLM baseline discussion.

## Run And Repair Policy

- Suite: `r5e1-300q`
- Provider: OpenRouter
- Temperature: `0.1`
- Max tokens: `2200`
- Concurrency for repair: `1`
- Runner retries per repair invocation: `RETRY_ATTEMPTS=2`
- Main repair ceiling: `MAX_REPAIR_ATTEMPTS=2`
- Additional focused pass: retried only latest dirty rows whose dirty type included `provider_aborted_request`.

Dirty row definition used in the analysis:

- missing latest result
- empty raw response
- explicit provider/model error
- `transport_error`
- generic `error` failure reason

## Final N=1 Status

After the max-2 repair pass and the focused provider-abort pass:

| Model | Clean Rows | Dirty Rows | Passes | Pass Rate Of 300 | Remaining Dirty Type |
|---|---:|---:|---:|---:|---|
| `z-ai/glm-5.1` | 233 | 67 | 129 | 43.0% | `empty_raw + transport_error + truncated_response` |
| `z-ai/glm-5-turbo` | 198 | 102 | 121 | 40.3% | `empty_raw + transport_error + truncated_response` |
| `z-ai/glm-5` | 226 | 74 | 114 | 38.0% | `empty_raw + transport_error + truncated_response` |

Remaining dirty rows by level:

| Model | L5 | L7 | L8 | L9 | L10 | AGI |
|---|---:|---:|---:|---:|---:|---:|
| `z-ai/glm-5.1` | 0 | 0 | 2 | 1 | 14 | 50 |
| `z-ai/glm-5-turbo` | 0 | 0 | 5 | 5 | 27 | 65 |
| `z-ai/glm-5` | 1 | 1 | 1 | 10 | 13 | 48 |

## Focused Provider-Abort Pass

Before the focused pass, `z-ai/glm-5` had eight latest dirty rows with `provider_aborted_request`:

- `L9-021`
- `L9-029`
- `L10-030`
- `AGI-003`
- `AGI-071`
- `AGI-072`
- `AGI-093`
- `AGI-106`

Result of focused pass:

- `L9-029` converted to a clean scored fail with non-empty raw output.
- The other seven rows remained dirty, now as `empty_raw + transport_error + truncated_response`.
- No additional passes were recovered in this focused pass.

## Interpretation

These GLM runs should not be treated as normal publish-ready leaderboard entries without an explicit completion/reliability indicator.

The unanswered volume is too high to read as ordinary retry noise:

- `glm-5.1`: 67 unanswered rows
- `glm-5-turbo`: 102 unanswered rows
- `glm-5`: 74 unanswered rows

The remaining dirty category is overwhelmingly transport/truncated empty output. Historical repair analysis showed this category converted to clean output at a low rate, so further retries are likely to measure provider/model reliability more than recover benchmark signal.

Recommended next step:

- Preserve the raw local results.
- Publish only if the `/300` surface includes completion/reliability status, or place these models in an incomplete runs table.
- Prefer running the next model family rather than spending more on broad GLM dirty-row retries.
