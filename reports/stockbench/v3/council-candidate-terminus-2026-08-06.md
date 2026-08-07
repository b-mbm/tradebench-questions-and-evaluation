# StockBench v3 Council candidate terminus

**Verdict:** `PASS` for the **release candidate only**. This is not a final `GREEN` or frozen-public-release claim.

## Locked candidate

- Bundle: `reports/stockbench/frozen/v3.0.0`
- Manifest status: `content-addressed_release_candidate_pending_fable_and_council_terminus`
- Checksum verification: 919/919 entries passed on 2026-08-06.

## Four seats

| Seat | Candidate verdict | Evidence | Limit |
| --- | --- | --- | --- |
| Percy Liang | PASS | 919 checksum-verified artifacts; pinned question/grader/runner/prompt-builder hashes; byte-identical corpus inherits two independent 300/300 derivation and uniqueness audits. | Static 300-question equity reasoning only. |
| Marcos López de Prado | PASS | Versioned ledger excludes live-market lookup, PnL, alpha, generalization, and training-family use; records exact corpus identity and post-v2 evaluator audit. | No point-in-time market-validity or performance claim. |
| Maureen O'Hara | PASS | Frozen packets and carried-forward all-row convention review are bound by the candidate manifest; the scope excludes executable fills and venue competence. | No liquidity, fill, price-impact, or live-PnL claim. |
| Shunyu Yao | PASS | StockBench runner selects exactly 300 rows, uses the StockBench prompt builder, records source hashes, retains raw outputs, and the current categorical and mutation gates reject invalid decisions. | No repeated stochastic model-run reliability claim. |

## Remaining terminus conditions

1. A substantive, retained Fable 5 verdict on the exact candidate/tagged release. The local CLI produced no substantive result, so there is no Fable verdict to count.
2. Commit the exact release slice, create and verify annotated `stockbench-v3.0.0`, then recheck tag-tree blobs against the bundle.
3. Re-run this four-seat decision against that immutable tag. Only then may the scoped static claim be `GREEN`.
