# StockBench 300Q External Review Prompt

Please independently audit the StockBench 300Q freeze candidate in this repo:

`/Users/bradleymiles/Documents/tradebench-questions-and-evaluation`

Do not run paid model calls.

## Files To Read

1. `docs/stockbench-300q-plan_v2.md`
2. `docs/stockbench-freeze-candidate-summary.md`
3. `docs/stockbench-coverage-matrix.md`
4. `docs/stockbench-300q-audit.csv`
5. `src/questions/stockbench-questions-300q.ts`
6. `src/questions/stockbench-generated-questions.ts`
7. `scripts/generate-stockbench-first-draft.ts`
8. `scripts/audit-stockbench-freeze-candidate.ts`
9. `scripts/prove-stockbench-solvability.ts`
10. `src/grading/schema-grader-300q.ts`
11. Representative rubrics from `src/rubrics/stockbench-*.json`

If you need a single attachment-style file, use `docs/stockbench-300q-external-review-bundle.json`.

## Current Hashes

Expected current proof result from `npx tsx scripts/prove-stockbench-solvability.ts`:

- aggregate problem/rubric hash: `1a20f7c86afdc2ab5a36971b1c6c616e6ccd6d97f0b4a76ecaa048dd7009ebc0`
- aggregate full-review hash: `17e1b03bc6590101cc4ba6ae17c00d4ed1fb95108b0e83c9d9b7010997e0ac0e`

## Review Goal

Verify whether StockBench 300Q is ready to freeze.

For each reviewed item, inspect the prompt/context, rubric, and expected/canonical answer. Determine whether the canonical answer can be derived from the problem and rubric alone, without using live market data, hidden assumptions, or the answer itself.

## Required Checks

1. Solvability:
   - Can the canonical answer be derived from prompt/context/rubric alone?
   - Are all needed prices, multipliers, rates, dates, permissions, margin assumptions, borrow/locate constraints, option specs, futures specs, FX rates, and settlement rules present?

2. Difficulty:
   - Does the tagged tier match observed difficulty?
   - Flag any item where observed tier differs by more than 1.

3. Answer leakage:
   - Confirm prompts list output fields but do not reveal answer values.

4. Rubric quality:
   - Are deterministic grading fields present?
   - Are tolerances/ranges/objective functions clear enough?
   - Are negative routes/failure modes represented for hard questions?

5. TradFi discriminator quality:
   - Does the benchmark test real traditional-market structure, not just CoinBench with stock tickers?
   - Check coverage of settlement, locates, hard-to-borrow, option assignment/exercise, futures rolls, margin, jurisdiction/product permissions, market session constraints, and no-trade traps.

6. Repetition/template risk:
   - The first external review cycle found severe L10/AGI template collapse. This pass added exact duplicate checks and hard-tier skeleton diversity thresholds.
   - Independently decide whether the current repetition level is acceptable for a freeze candidate.
   - Check whether L10/AGI prompts now contain domain-specific constraints that are more than cosmetic labels.

7. Critical-field grading:
   - The grader now supports `rubric.metadata.critical_fields`.
   - Verify that nested fields such as `scenario_pnl.risk_off` are actually scored, not merely object-presence checked.
   - Verify that missing critical fields cause failure.

## Suggested Sampling

Review all 30 handcrafted anchors if time permits.

For generated rows, sample at least:

- 5 from L1-L4
- 5 from L5-L8
- 10 from L9
- 10 from L10
- 15 from AGI

Also sample across all primary domains:

- Spot equities / ETFs
- Shorting / borrow / margin / locates
- Listed options strategy / Greeks
- Futures / commodities / spreads / rolls
- Spot FX / CFDs / multi-currency
- Portfolio risk / rebalancing
- Execution / liquidity / microstructure
- Corporate actions / settlement / calendar / jurisdiction
- Feasibility / rejection / no-trade traps

## Output Requested

Return:

1. Overall verdict:
   - FREEZE READY
   - FREEZE READY WITH MINOR FIXES
   - NOT READY

2. Summary of any blocking issues.

3. Table of reviewed items:
   - ID
   - solvability verdict
   - tagged tier
   - observed tier
   - issue, if any
   - recommended fix, if any

4. Any systemic concerns about generator templates, rubric design, answer leakage, or benchmark difficulty.
