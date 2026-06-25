# No-JSON 29 Gate: AGI Validator Diagnosis

Source artifact: `results/community/300/nojson29-gate-graded-2026-06-23.json`

Scope: the six AGI rows in the no-json 29-row gate. This diagnosis separates model capability from validator/parser/truncation artifacts.

## Verified Code Finding

The AGI verifier exact-matches string fields when `_agi_canonical.validation.<field>.expected` is set. In `src/grading/schema-grader-300q.ts`, string validation normalizes the received value and requires equality with the expected canonical string. For AGI rows this affects fields such as `intent` and `chosen_strategy`.

This matters because the prompts ask the model to output `intent` and `chosen_strategy`, but they do not disclose exact canonical strings such as `adversarial_event_execution`, `private_first_hidden_completion`, `hedge_adversarial_beta`, or `alt_beta_pair_matic_first`. So these fields are strict hidden-label checks unless the canonical string is directly derivable from the prompt wording.

Correction to prior handoff language: these six rows are CoinBench/TradeBench AGI rubrics under `src/rubrics/agi-AGI-*.json`, not StockBench rubrics.

## Summary

AGI `0/6` is not a clean capability read. It is mixed:

- Some rows are genuine misses (`AGI-002`, `AGI-003`, base `AGI-004`, `AGI-014`).
- Some rows are economically close/correct but fail exact labels, nesting, or missing required schema fields (tuned `AGI-004`, both `AGI-024`).
- Several rows hit `finish=length`, so max-token truncation is still suppressing scores (`AGI-001`, `AGI-002`, `AGI-004`).
- Every row, for both base and tuned, failed `intent` and `chosen_strategy`. That is a verifier warning sign, not by itself proof of model incapability.

Bottom line: do not run full 300 until the hard-tier max-token and AGI parser/nesting behavior are settled.

## Row Diagnosis

| ID | Expected Core | Base Analysis | Fine-Tune Analysis | Verdict |
|---|---|---|---|---|
| `AGI-001` | Short MATIC then SOL, nested `shorts`, risk reduction `55-55.4%`, residual PnL `-74k..-73k`. | Partially understood the hedge but truncated. Missing nested `shorts.SOL`, risk reduction `53.3%` too low, residual just outside range. Not right. | Closer: MATIC/SOL idea and residual PnL in range, but truncated/missing SOL nested fields and risk reduction `52.9%` too low. Not right. | Rerun with more tokens; also schema/nesting issue. |
| `AGI-002` | Private-first cross-venue buy: `Dark_RFQ_B 10k`, `CEX_Y 8k`, `RFQ_A 7k`, avg `2.4719-2.4726`, slip `0.68-0.72%`. | Chose DEX route and `CEX_Y=0`, avg/slippage too low. This is a genuine route/canonical mismatch, not just labels. | Truncated/parse failed and reasoning also considered DEX-heavy route. Not right. | Genuine miss/truncation; keep strict for now. |
| `AGI-003` | Private delever to mandate floor: hedge `60 ETH`, net `40 ETH`, drawdown `-13.8..-13.5%`, funding `-520..-460`. | Got hedge/net exposure but wrong economics: drawdown `-2.14%`, funding `+90`. Not right. | Same mechanism but wrong economics: drawdown `+8.74%`, funding `+92`. Not right. | Genuine numeric/sign failure. Good training target. |
| `AGI-004` | Yield allocation: Curve `30k`, Aave `20k`, Ethena `20k`, GMX `30k`, APY `8.6-8.8%`, profit `$2120-$2165`, liquidity `50k`. | Wrong allocation: Aave `30k`, Ethena `0`, Pendle `10k`, APY/profit low. Not right. | Economically correct: allocation, APY, profit, liquidity all match. Failed strict `intent` and nested `allocation_usd.*` shape. | Fine-tune likely right; parser/schema/label artifact. |
| `AGI-014` | Multi-venue funding carry with venue caps, `apr_pct 28.7-29.2`, `pnl_30d 11750-12050`, survives cascade. | Allocations and leverage right, but APR `22.9` and PnL `$9541.67` wrong. Not right. | Same: allocations right but APR/PnL wrong. Not right. | Genuine formula miss, not merely validator. |
| `AGI-024` | Event execution: private-first sequence, nested venue fills, hidden public `7k`, avg `~1.20686`, slippage `~0.57%`, self-check labels. | Values are economically right: fills, hidden qty, avg price, slippage. Fails exact labels plus missing `execution_sequence` and nested `venue_fills.*` shape. | Same: economically right, exact values right, but missing required structure/exact labels. | Both models close/right economically; schema/label artifact. |

## Practical Takeaways

1. The fine-tune did show real AGI promise on `AGI-004`: tuned solved the economics where base did not.
2. The fine-tune did not solve AGI broadly: `AGI-002`, `AGI-003`, and `AGI-014` remain real misses.
3. Some failures are on our side if we interpret "capability" broadly: `AGI-004` tuned and `AGI-024` both are correct enough economically but fail strict shape/labels.
4. For benchmark scoring, strict schema still matters. For training strategy, treat schema/nesting and exact-label compliance as separate trainable skills from trading reasoning.

## Recommended Next Step

Before a paid full 300 run:

1. Do a no-pod verifier policy pass first: decide whether exact `intent` / `chosen_strategy` strings are intended strict labels or should be treated as semantic/proximity fields.
2. Preserve the current strict grade for comparability, but add an audit-only secondary score for AGI proximity:
   - economic values right,
   - strategy right,
   - schema/nesting right,
   - exact labels right.
3. Rerun only the truncated rows (`AGI-001`, `AGI-002`, `AGI-004`) with `max_tokens >= 9000` after the verifier policy is settled.
4. Use the full strict score for final reporting, but use the proximity score to decide what to train.
