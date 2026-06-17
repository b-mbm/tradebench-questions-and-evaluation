# StockBench 300Q Plan V2

Version: V2

## Goal

Create a new 300-question benchmark named **StockBench** for traditional trading intelligence.

StockBench is not a surface rewrite of CoinBench with equity tickers. It should be a discriminator: a benchmark that reveals whether a model understands traditional market structure that may not appear in crypto-native trading tasks.

It should test reasoning across:

- Spot equities and ETFs
- Long and short equity positions
- Listed index and single-name options
- Commodities and futures
- Futures spreads and rolls
- CFDs
- Spot FX
- Index instruments
- Cross-asset portfolio and execution decisions

The public metric remains strict pass@1 / pass count.

## Fixed Decisions

- Benchmark name: StockBench.
- Use real tickers and instrument symbols such as SPY, AAPL, ES, CL, and EURUSD.
- Real tickers are allowed, but all prices and assumptions must be frozen in the prompt.
- Start with a 30-question anchor set before expanding to 300.
- Preserve CoinBench's hard-tail philosophy, but do not simply mirror CoinBench's exact reasoning patterns.
- At least 30-40% of the suite should test TradFi-specific market structure with no clean crypto analogue: T+1 settlement, locates, hard-to-borrow names, ex-dividend adjustments, futures rolls, option exercise/assignment, portfolio margin/SPAN, regional market rules, CFDs, and jurisdiction constraints.

## Design Principle

Every question must be self-contained.

Do not rely on live market data, a Nautilus backend, broker APIs, hidden price feeds, or runtime lookup. If a model needs a price, contract multiplier, borrow rate, option premium, expiry, FX rate, margin rule, holiday/calendar fact, settlement assumption, or jurisdiction rule, it must appear directly in the question or the question's frozen context.

The prompt is the market data packet. The rubric is the judge.

## Reuse Existing Benchmark Shape

StockBench should be a sister dataset, not a new harness.

Reuse the existing runner, generation flow, scoring flow, dirty-row accounting, pass@1 reporting, and JSON/CSV archive process where possible.

Likely minimal file shape:

- `src/questions/stockbench-questions-300q.ts`
- `src/rubrics/stockbench/...` or equivalent rubric files
- optional `docs/stockbench-difficulty-levels.md` only if the existing difficulty contract needs domain-specific notes

Author questions into the same typed schema used by the current benchmark. The frozen market packet should live in the prompt and/or structured `context`, not in an external system.

## Hard-Tail Difficulty Distribution

StockBench should remain hard for a static benchmark that models will compete against over time.

Use the same L1-to-AGI distribution as CoinBench. StockBench should differ through TradFi-specific content and market-structure traps, not by becoming easier.

| Tier | Count | Role |
|---|---:|---|
| L1 | 3 | Literal extraction |
| L2 | 4 | Direct arithmetic |
| L3 | 3 | Multi-variable arithmetic |
| L4 | 5 | Time/rate/calendar arithmetic |
| L5 | 5 | Order/schema mapping |
| L6 | 5 | Procedural rules |
| L7 | 5 | Multi-field synthesis |
| L8 | 10 | Conditional decisions |
| L9 | 81 | Multi-intent trading reasoning |
| L10 | 69 | Cross-instrument strategy composition |
| AGI | 110 | Autonomous strategy synthesis |
| Total | 300 | |

This is intentionally hard: 260/300 questions are L9 or above.

Because the distribution matches CoinBench, tier-level comparisons are possible in principle. Still, the most meaningful CoinBench-vs-StockBench analysis should use overall pass@1, capability tags, and domain slices because the content domains are intentionally different.

## 30-Question Anchor Distribution

The anchor set should be a miniature hard-tail eval, not a warmup set.

| Tier | Anchor Count |
|---|---:|
| L1 | 1 |
| L2 | 1 |
| L3 | 1 |
| L4 | 1 |
| L5 | 1 |
| L6 | 1 |
| L7 | 1 |
| L8 | 1 |
| L9 | 7 |
| L10 | 7 |
| AGI | 8 |
| Total | 30 |

## Domain x Difficulty Matrix

Before writing all 300 questions, fill the domain x tier matrix. This prevents accidental holes such as no AGI futures-spread questions or no L9 FX questions.

Initial 300Q target matrix:

| Primary Domain | L1-L4 | L5-L8 | L9 | L10 | AGI | Total |
|---|---:|---:|---:|---:|---:|---:|
| Spot equities / ETFs | 4 | 4 | 5 | 3 | 4 | 20 |
| Shorting / borrow / margin / locates | 1 | 3 | 8 | 8 | 15 | 35 |
| Listed options strategy / Greeks | 2 | 4 | 15 | 13 | 21 | 55 |
| Futures / commodities / spreads / rolls | 2 | 4 | 14 | 12 | 18 | 50 |
| Spot FX / CFDs / multi-currency | 2 | 3 | 8 | 6 | 11 | 30 |
| Portfolio risk / rebalancing | 1 | 2 | 10 | 10 | 17 | 40 |
| Execution / liquidity / microstructure | 2 | 3 | 10 | 8 | 12 | 35 |
| Corporate actions / settlement / calendar / jurisdiction | 1 | 2 | 6 | 5 | 6 | 20 |
| Feasibility / rejection / no-trade traps | 0 | 0 | 5 | 4 | 6 | 15 |
| Total | 15 | 25 | 81 | 69 | 110 | 300 |

Anchor domain mix:

| Primary Domain | Anchor Count |
|---|---:|
| Spot equities / ETFs | 2 |
| Shorting / borrow / margin / locates | 4 |
| Listed options strategy / Greeks | 6 |
| Futures / commodities / spreads / rolls | 5 |
| Spot FX / CFDs / multi-currency | 3 |
| Portfolio risk / rebalancing | 4 |
| Execution / liquidity / microstructure | 3 |
| Corporate actions / settlement / calendar / jurisdiction | 2 |
| Feasibility / rejection / no-trade traps | 1 |
| Total | 30 |

## Capability Tags

Each question should also carry a capability tag. This keeps StockBench aligned with the trading-intelligence thesis instead of drifting into a generic finance quiz.

Target capability mix:

- Execution/action quality: roughly 60-65%.
- Judgment/risk augmentation: roughly 30-35%.
- Pure directional prediction: at most 1-2%.

AGI questions should be strategy synthesis under frozen conditions, not "will AAPL go up?" questions.

Capability mix should be checked in aggregate and spot-checked inside each major domain. Do not put all judgment questions in options or all execution questions in futures by accident.

## Metadata Tags

Each question should carry:

- `primary_domain`
- `tier`
- `capability_tag`
- `scenario_family`
- `feasibility_trap`

Example `scenario_family` values:

- `short_locate_failure`
- `borrow_cost_vs_trade_edge`
- `futures_beta_hedge`
- `futures_roll_calendar`
- `covered_call_assignment`
- `put_spread_downside_floor`
- `fx_settlement_mismatch`
- `corporate_action_adjustment`
- `order_book_liquidity_limit`
- `margin_call_triage`
- `no_trade_invalid_route`

`feasibility_trap` should be a secondary boolean, not only a primary domain. A locate trap can live inside shorting, a stale-quote trap inside execution, and a settlement trap inside FX.

## Question Packet Format

Use a consistent packet shape:

```text
Frozen market snapshot:
- Timestamp:
- Jurisdiction / account regime:
- Market session / timezone:
- Allowed products / permissions:
- Account base currency:
- Cash / margin / borrow assumptions:
- Instrument quotes:
- Contract specs:
- Fees / spread / slippage:
- Calendar / settlement:
- Risk constraints:

Task:
...

Objective:
...

Output JSON fields:
...
```

Only include fields needed for that question. Do not create giant universal snapshots.

Example allowed-products packet:

```text
Allowed products / permissions:
- Equities: allowed
- Listed options: level 2 only
- Futures: not approved
- CFDs: unavailable in this jurisdiction
- Short selling: allowed only with locate
```

## Objective Function Rule

Every L9/L10/AGI question must define the objective function clearly enough that the best answer is unique or rubric-bounded.

Examples:

- Minimize hedge cost while keeping portfolio loss above `-$X` under the stated shock.
- Maximize execution certainty while keeping estimated slippage under `Y` bps.
- Choose the lowest-margin instrument that reduces beta exposure by at least `Z%`.
- Select the strategy with the best worst-case PnL under the provided scenarios.
- Reject every strategy that violates borrow, settlement, margin, liquidity, or risk constraints.

If several answers are valid, the rubric must list the acceptable strategy families and the fields required for a pass.

## Examples By Tier

L1-L4 should test extraction and arithmetic:

- Extract order side, ticker, quantity, and order type.
- Compute average fill price from an order book.
- Compute option premium received.
- Compute futures notional from price, contracts, and multiplier.
- Compute borrow cost over a stated number of days.
- Convert EUR PnL to USD using a stated FX rate.

L5-L8 should test schema, procedure, and conditional choice:

- Convert a user instruction into a valid order ticket.
- Choose market vs limit order under a stated liquidity constraint.
- Decide whether a short is feasible given locate availability and margin.
- Rebalance a portfolio under max single-name and sector constraints.
- Select the cheapest hedge that satisfies a stated downside floor.

L9 should require multiple intents or instruments:

- Hedge single-name event risk with stock plus options.
- Compare SPY put spread vs ES futures hedge under cash and margin constraints.
- Build a delta-neutral options trade from a frozen option chain.
- Choose between FX forward hedge and spot conversion under rate and settlement constraints.
- Execute an equity index rebalance with order-book impact and cash residual.

L10 should compose several mechanisms:

- Manage a multi-asset portfolio across SPY, QQQ, ES, NQ, GLD, CL, and EURUSD.
- Design an options collar plus futures overlay while preserving upside and liquidity.
- Handle a corporate-action event, borrow recall, margin pressure, and hedge slippage together.
- Allocate across equities, bonds, commodities, and cash under drawdown, VaR, and liquidity constraints.

AGI should force autonomous strategy synthesis:

- Pick the correct strategy from raw primitives.
- Reconcile execution sequence, hedges, residual exposure, and worst-case PnL.
- Avoid tempting but invalid routes, stale quotes, missing borrow, infeasible settlement, or unsupported instruments.
- Include a self-check field where appropriate.

## Options Policy

Options questions should mostly test strategy, Greeks, exercise/assignment, hedge construction, and feasibility.

Default mix:

- 80% options strategy and market-structure reasoning.
- 20% options pricing/math.

Prefer frozen premiums and Greeks. Avoid turning StockBench into a Black-Scholes calculator benchmark.

## Standard Hard-Question Output Shape

For L9/L10/AGI, prefer a consistent JSON shape when practical:

```json
{
  "decision": "trade | no_trade | rebalance | hedge | reduce | hold",
  "strategy": "...",
  "orders": [
    {
      "instrument": "...",
      "side": "buy | sell | sell_short | buy_to_cover",
      "quantity": 0,
      "order_type": "market | limit | stop | stop_limit | spread",
      "limit_price": null,
      "time_in_force": "day | gtc | ioc | fok"
    }
  ],
  "expected_cost": 0,
  "margin_used": 0,
  "worst_case_pnl": 0,
  "residual_exposure": {
    "delta": 0,
    "beta_dollars": 0,
    "fx_exposure": 0
  },
  "feasibility": "feasible | infeasible",
  "rejected_routes": ["..."],
  "self_check": "..."
}
```

Not every question needs every field. The purpose is scorer consistency, not boilerplate.

## Rubric Policy

Use strict pass@1 as the public metric.

Each question should have:

- Required output fields
- Expected values or acceptable ranges
- Units
- Pass threshold
- Canonical derivation or grading notes
- Failure modes
- Negative constraints for tempting invalid routes

For hard questions, prefer several required fields over one scalar. A model should not pass AGI-level questions by producing a plausible number while missing the strategy or feasibility logic.

Default scoring contract:

- Numeric tolerances should be explicit in each rubric. When no better domain-specific tolerance is provided, use level-scaled tolerances: L1-L2 within 1%, L3-L5 within 5%, L6-L8 within 10%, and L9+ as explicitly specified by the rubric.
- Structured hard questions should use weighted required fields, semantic correctness, and edge-case/negative-constraint checks with pass threshold `0.70`.
- Every graded numeric field must be deterministically derivable from the frozen packet. If a field such as `worst_case_pnl` is graded, the scenario set and calculation basis must be pinned in the prompt/rubric.
- Free-text fields such as `self_check` should be presence-checked or keyword/condition-checked. Do not require subjective semantic judgment for strict pass@1.
- Per-rubric schema hints should be authored alongside the rubric, not discovered after the first fairness run.

Example hard-rubric failure modes:

```json
{
  "failure_modes": [
    "uses unstated live market data",
    "ignores margin constraint",
    "chooses infeasible short due to no locate",
    "hedges notional but leaves delta exposure outside tolerance",
    "misses settlement mismatch",
    "returns plausible strategy without required JSON fields"
  ],
  "must_not": [
    "must_not_use_borrow_when_locate_unavailable",
    "must_not_use_options_when_option_chain_not_in_packet",
    "must_not_cross_settlement_holiday_without_self_check"
  ]
}
```

## Refusal And Disclaimer Policy

Refusals, generic financial-advice disclaimers, or "consult a licensed professional" answers are failures unless the required actionable answer is still present and unambiguous.

StockBench is measuring trading-task execution under a frozen benchmark packet, not public-facing advice compliance.

## Ambiguity Rules

Traditional instruments get ambiguous fast. StockBench should avoid ambiguity by embedding the needed assumptions:

- Jurisdiction/account regime: required when it affects legality, margin, settlement, or product access.
- Equity multiplier: normally 1 share.
- Listed option multiplier: normally 100 shares unless stated otherwise.
- Futures multiplier and tick value: always stated when futures appear.
- Borrow rate and borrow availability: stated when shorting appears.
- Margin assumptions: Reg-T, portfolio margin, SPAN, CFD margin, or stated simplified margin.
- FX conversion rate: stated when non-USD currency matters.
- Settlement/calendar assumption: stated when timing matters.
- Dividends/corporate actions: stated when relevant.
- Fees, spreads, slippage, and impact: stated when relevant.

If an assumption is not in the question, the rubric should not require it.

## Real-Ticker Contamination Controls

Real tickers help realism, but they can trigger memorized market priors.

Mitigations:

- Tell models to use only the frozen packet values.
- Use synthetic-but-plausible price levels when needed, even for real tickers.
- Use unusual constraints that prevent textbook answers.
- Occasionally use plausible fake tickers at L9+ only when testing reasoning rather than ticker recognition.
- Do not ask for live/current prices or forecasts.

## Leakage Rule

StockBench is an evaluation set, not a training set.

Do not train on the final frozen StockBench questions, rubrics, or canonical answers. If training examples are needed, create sibling questions with different numbers, instruments, constraints, and outcomes. Maintain a clean held-out StockBench freeze for pass@1 reporting.

## Pre-Evaluation Audits

Run both audits before the first paid model evaluation.

### Solvability Audit

For each item, inspect the prompt, canonical answer, and rubric. Verify that the canonical answer is objectively derivable from the prompt and context alone.

This is a reverse-derivation audit, not a blind solve. The reviewer should be able to reason from the canonical answer back to the prompt without contradiction.

Output per item:

- `answer_key_verdict`: `VERIFIED | PARTIAL | ERROR | UNKNOWN`
- notes on any contradiction, missing assumption, or prompt-edit candidate

Use multi-pass audit precedence when needed: later-pass `MATCH` overrides earlier flags, so `v5 > v4 > v3 > v2 > v1`.

### Difficulty-Tier Audit

For each item, independently estimate observed difficulty and compare it to the tagged tier.

Output per item:

- `tier_tagged`
- `tier_observed`
- `tier_variance`
- notes when the item appears more than one level away from its tag

Flag any item with large variance before model runs.

### Audit Standard

No canonical, rubric, or pass-threshold edits after freeze without a recorded amendment. Prompt edits before freeze are allowed when arithmetic, outlier pattern, and allocation rationality all point to the same correction.

Review depth:

- L10 and AGI: one author plus two independent reviewers.
- L1-L9: one author plus one independent reviewer.

For the anchor set, read low-tier results with the right noise model: L1-L7 have only one anchor each, so one refusal or parse failure is informative but not a tier-level verdict.

## Dirty-Row Taxonomy

When anchor or full runs fail, classify dirty/scoring issues with a stable taxonomy:

```ts
dirty_reason:
  | "blank_response"
  | "transport_error"
  | "parse_error"
  | "schema_mismatch"
  | "refusal_only"
  | "uses_live_data"
  | "arithmetic_error"
  | "unit_error"
  | "invalid_instrument"
  | "violates_margin"
  | "violates_borrow_or_locate"
  | "violates_settlement"
  | "wrong_strategy_family"
  | "ambiguous_prompt"
  | "rubric_too_strict"
  | "canonical_answer_error"
```

This lets the anchor run explain why models fail, not only how often.

## Build Order

1. Fill the domain x difficulty matrix.
2. Draft 3 pilot questions first: one L4, one L9, and one AGI, each with a matching rubric.
3. Validate that the existing runner/scorer can ingest and score those 3 pilots.
4. Draft the full 30 anchor questions and matching rubrics.
5. Run solvability and difficulty-tier audits on the anchors.
6. Run the anchors through a small roster of known strong and weak models.
7. Check whether StockBench produces useful CoinBench-vs-StockBench deltas, not just identical rankings.
8. Check whether L10/AGI anchors spread models apart. If most models cluster near zero on AGI, reduce or rewrite the AGI share before expanding.
9. Expand to 300 questions using the revised distribution and domain matrix.
10. Build rubrics as questions are written, not after the fact.
11. Run pre-evaluation solvability and difficulty-tier audits on all 300.
12. Smoke test across 5-10 models using the same roster used for comparable CoinBench runs.
13. Audit dirty rows, scoring weirdness, refusal behavior, and ambiguity.
14. Freeze the dataset.
15. Run the candidate model roster.

## Session Recommendation

Start a fresh chat/session before implementation.

This current session is fine for planning, but dataset creation will be cleaner in a new session with this document as the handoff. The new session should begin by reading:

- `docs/stockbench-300q-plan_v2.md`
- `docs/difficulty-levels.md`
- `src/questions/schema-questions-300q.ts`
- representative rubrics from `src/rubrics/`

Then it should create the domain x difficulty matrix and the first 30 anchor questions before expanding to 300.

## Definition Of Done

StockBench is ready for full model runs when:

- 300 self-contained questions exist.
- Every question has a matching rubric.
- The domain x difficulty matrix is filled.
- Capability tags exist for every question.
- Scenario-family tags and feasibility-trap flags exist for every question.
- Rubric schema hints and failure modes exist for every hard question.
- Numeric tolerances and structured-field weights are explicit.
- Every graded hard-question field is deterministically derivable.
- No question depends on live data or hidden backend state.
- Every L9/L10/AGI question has a clear objective function.
- Solvability audit is complete.
- Difficulty-tier audit is complete.
- A smoke run confirms the existing runner and scorer can process the dataset.
- A manual audit finds no unresolved ambiguity in contract specs, prices, units, calendars, jurisdiction, or required output fields.
