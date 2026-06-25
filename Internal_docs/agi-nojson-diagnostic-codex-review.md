# AGI No-JSON Diagnostic: Codex Review

Date: 2026-06-23

Scope: Six AGI rows from the 29-row no-json RunPod gate:
`AGI-001`, `AGI-002`, `AGI-003`, `AGI-004`, `AGI-014`, `AGI-024`.

Primary artifacts:

- `results/community/300/nojson29-gate-graded-2026-06-23.json`
- `results/community/300/nojson-agi6-graded-2026-06-23-from29.json`
- `results/community/300/nojson29-agi-validator-diagnosis-2026-06-23.md`

Note: `results/*` is gitignored, so this document exists as the durable handoff summary.

## Verified Findings

1. The 29-row no-json gate was clean at the runner level: 29 base + 29 tuned rows, zero connection errors in the final graded artifact.
2. The six AGI rows scored `0/6` for both base and tuned under strict grading.
3. The AGI failures are mixed, not one thing:
   - Truncation at `max_tokens=6000`: `AGI-001`, `AGI-002`, `AGI-004`.
   - Completed but numerically wrong or partially wrong: `AGI-003`, `AGI-014`.
   - Economically close/correct but failed strict labels/schema: `AGI-024`, tuned `AGI-004`.
4. `src/grading/schema-grader-300q.ts` exact-matches AGI string fields when `_agi_canonical.validation.<field>.expected` is present.
5. For these AGI rows, `intent` and `chosen_strategy` are exact canonical string checks. The prompts ask for those fields but do not disclose exact strings such as `adversarial_event_execution`, `private_first_hidden_completion`, `hedge_adversarial_beta`, or `alt_beta_pair_matic_first`.

## Interpretation

AGI `0/6` is not a clean model-capability read. It combines:

- token truncation,
- exact hidden-label validation,
- schema/nesting mismatch,
- real numeric and strategy misses.

This means another paid full-300 run would bake in known artifacts unless the scoring policy is explicit.

## Row-Level Read

| ID | Base | Tuned | Main Issue |
|---|---|---|---|
| `AGI-001` | Partially got hedge, truncated, risk reduction low. | Closer residual PnL, truncated, risk reduction low. | Needs higher-token rerun after verifier policy decision. |
| `AGI-002` | Chose DEX-heavy route; avg/slippage too low. | Truncated/parse failed; reasoning also not clearly canonical. | Genuine route miss plus truncation. |
| `AGI-003` | Hedge idea present, but drawdown/funding wrong. | Same mechanism, wrong drawdown/funding. | Genuine numeric/sign failure. |
| `AGI-004` | Wrong allocation/economics. | Economics match canonical but failed `intent` and nested `allocation_usd.*`. | Fine-tune likely solved the economics; strict label/schema artifact. |
| `AGI-014` | Allocation/leverage right, APR/PnL wrong. | Same. | Genuine formula failure. |
| `AGI-024` | Fills, avg price, slippage, trigger avoidance right. | Same. | Mostly verifier/schema artifact: exact labels plus missing nested wrapper/sequence. |

## Recommendation

Do not run the full 300 yet.

Next, do a no-pod verifier policy pass:

1. Decide whether `intent` and `chosen_strategy` should remain exact-label fields in the official strict score.
2. Preserve the current strict score for historical comparability unless intentionally versioning the benchmark.
3. Add an audit-only AGI proximity score that separates:
   - economic values,
   - strategy selection,
   - schema/nesting,
   - exact labels.
4. Rerun only the truncated rows (`AGI-001`, `AGI-002`, `AGI-004`) at `max_tokens >= 9000` after the verifier policy is settled.

## Important Correction

These six rows use CoinBench/TradeBench rubrics under `src/rubrics/agi-AGI-*.json`, not StockBench rubrics.
