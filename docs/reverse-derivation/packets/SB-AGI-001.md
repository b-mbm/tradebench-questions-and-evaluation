# Reverse-derivation audit packet — SB-AGI-001

tier: AGI   primary_domain: Feasibility / rejection / no-trade traps   scenario_family: borrow_recall_margin_hedge

## A. WHAT THE SOLVER SEES (problem + required output)

```
Frozen market snapshot:
- Timestamp: 2026-05-14 15:20:00 America/New_York.
- Jurisdiction / account regime: US Reg-T margin account.
- Account base currency: USD.
- Market session: regular US equity session, all orders must be accepted before 15:55 ET.
- Permissions: US equities allowed, listed options level 2 allowed, CME ES futures allowed, CFDs unavailable, no new short sales without a locate.
- Cash available: 60,000 USD.
- Remaining futures initial-margin capacity: 14,000 USD.
- Current positions at frozen marks: long 1,000 SPY at 500.00; short 500 AAPL at 180.00.
- Borrow/locate constraint: the AAPL locate is being recalled. You must buy to cover at least 300 AAPL shares by 15:55 ET. New AAPL or SPY shorts are not permitted because no new locate is available.
- AAPL cover quote: ask 181.00, commission 0.005 USD/share, exactly 300 shares are executable in this packet.
- SPY quote: 500.00.
- SPY 1-day 495 put: premium 4.00 USD/share, delta -0.40, multiplier 100 shares, max executable size 10 contracts.
- ES quote: 5,000.00, multiplier 50 USD/index point, initial margin 13,000 USD/contract, slippage/fees 25 USD/contract.
- CFD route: unavailable in this US account.
- Settlement/calendar: equity trades settle T+1, futures variation margin is same day, ignore interest and dividends.
- Required overnight beta hedge: after satisfying the borrow recall, reduce SPY beta-dollar exposure by at least 45%.

Frozen next-day scenarios for evaluating PnL relative to current marks and including immediate execution costs:
- Scenario A risk-off: SPY 470.00, ES 4,700.00, AAPL 176.00.
- Scenario B tech squeeze: SPY 510.00, ES 5,100.00, AAPL 190.00.
- Scenario C index-flat AAPL squeeze: SPY 500.00, ES 5,000.00, AAPL 195.00.

Task:
Synthesize the valid action plan. It must satisfy the AAPL recall, satisfy the beta hedge, keep cash nonnegative, stay within futures margin, and reject invalid routes.

Objective:
Among feasible plans, maximize worst-case PnL across the frozen scenarios. If two feasible plans tie on worst-case PnL, choose the lower immediate execution cost.

Output JSON fields:
{ "decision", "chosen_strategy", "execution_sequence", "aapl_buy_to_cover_shares", "aapl_cover_cash_used", "es_contracts", "spy_put_contracts", "option_premium_paid", "margin_used", "cash_after_execution", "beta_reduction_pct", "scenario_pnl", "worst_case_pnl", "feasibility", "rejected_routes", "self_check", "reasoning" }
```

## B. RUBRIC SCORING CONTRACT (how the answer is graded)

- pass_threshold: 0.7
- required_fields: [
  "decision",
  "chosen_strategy",
  "execution_sequence",
  "aapl_buy_to_cover_shares",
  "aapl_cover_cash_used",
  "es_contracts",
  "spy_put_contracts",
  "option_premium_paid",
  "margin_used",
  "cash_after_execution",
  "beta_reduction_pct",
  "scenario_pnl.risk_off",
  "scenario_pnl.tech_squeeze",
  "scenario_pnl.index_flat_aapl_squeeze",
  "worst_case_pnl",
  "feasibility",
  "rejected_routes",
  "self_check"
]
- critical_fields (must be exactly correct or the row fails): [
  "decision",
  "aapl_buy_to_cover_shares",
  "aapl_cover_cash_used",
  "es_contracts",
  "spy_put_contracts",
  "option_premium_paid",
  "margin_used",
  "cash_after_execution",
  "beta_reduction_pct",
  "scenario_pnl.risk_off",
  "scenario_pnl.tech_squeeze",
  "scenario_pnl.index_flat_aapl_squeeze",
  "worst_case_pnl",
  "feasibility"
]
- field validation specs (type/expected/tolerance/range/enum/expected_set):
```json
{
  "decision": {
    "type": "string",
    "expected": "trade"
  },
  "chosen_strategy": {
    "type": "string",
    "expected": "cover_recall_sell_1_es_buy_5_spy_puts"
  },
  "execution_sequence": {
    "type": "array",
    "expected_order": [
      "buy_to_cover_300_AAPL",
      "sell_1_ES",
      "buy_5_SPY_495_puts"
    ]
  },
  "aapl_buy_to_cover_shares": {
    "type": "number",
    "expected": 300,
    "tolerance": 0
  },
  "aapl_cover_cash_used": {
    "type": "number",
    "range": [
      54301.49,
      54301.51
    ]
  },
  "es_contracts": {
    "type": "number",
    "expected": 1,
    "tolerance": 0
  },
  "spy_put_contracts": {
    "type": "number",
    "expected": 5,
    "tolerance": 0
  },
  "option_premium_paid": {
    "type": "number",
    "expected": 2000,
    "tolerance": 0
  },
  "margin_used": {
    "type": "number",
    "expected": 13000,
    "tolerance": 0
  },
  "cash_after_execution": {
    "type": "number",
    "range": [
      3673.49,
      3673.51
    ]
  },
  "beta_reduction_pct": {
    "type": "number",
    "range": [
      69.99,
      70.01
    ]
  },
  "scenario_pnl.risk_off": {
    "type": "number",
    "range": [
      -4026.51,
      -4026.49
    ]
  },
  "scenario_pnl.tech_squeeze": {
    "type": "number",
    "range": [
      673.49,
      673.51
    ]
  },
  "scenario_pnl.index_flat_aapl_squeeze": {
    "type": "number",
    "range": [
      -5326.51,
      -5326.49
    ]
  },
  "worst_case_pnl": {
    "type": "number",
    "range": [
      -5326.51,
      -5326.49
    ]
  },
  "feasibility": {
    "type": "string",
    "expected": "feasible"
  },
  "rejected_routes": {
    "type": "array",
    "expected_set": [
      "no_cover_violates_borrow_recall",
      "sell_2_ES_violates_margin",
      "put_only_fails_beta_target",
      "buy_10_puts_with_es_worse_worst_case",
      "SPY_CFD_unavailable_US"
    ],
    "min_items": 5
  },
  "self_check": {
    "type": "array",
    "expected_set": [
      "borrow_recall_satisfied",
      "beta_reduction_70_pct",
      "margin_within_limit",
      "cash_nonnegative",
      "no_cfd_or_new_short",
      "worst_case_optimized_at_5_puts"
    ],
    "min_items": 6
  }
}
```
- failure_modes: [
  "does not cover the recalled AAPL borrow",
  "uses two ES contracts despite insufficient margin",
  "uses only SPY puts even though max executable contracts fail the beta target",
  "misses the 5-put overlay that maximizes worst-case PnL",
  "uses unavailable CFD route",
  "opens a new short without a locate",
  "reports PnL without immediate execution costs",
  "returns a plausible plan without self-checking constraints"
]
- must_not: [
  "must_not_skip_borrow_recall",
  "must_not_use_cfds_when_unavailable",
  "must_not_open_new_short_without_locate",
  "must_not_exceed_futures_margin_capacity",
  "must_not_return_generic_financial_advice_without_answer"
]

## C. CANONICAL ANSWER (the answer key — you MAY look at this)

```json
{
  "decision": "trade",
  "chosen_strategy": "cover_recall_sell_1_es_buy_5_spy_puts",
  "execution_sequence": [
    "buy_to_cover_300_AAPL",
    "sell_1_ES",
    "buy_5_SPY_495_puts"
  ],
  "aapl_buy_to_cover_shares": 300,
  "aapl_cover_cash_used": 54301.5,
  "es_contracts": 1,
  "spy_put_contracts": 5,
  "option_premium_paid": 2000,
  "margin_used": 13000,
  "cash_after_execution": 3673.5,
  "beta_reduction_pct": 70,
  "scenario_pnl": {
    "risk_off": -4026.5,
    "tech_squeeze": 673.5,
    "index_flat_aapl_squeeze": -5326.5
  },
  "worst_case_pnl": -5326.5,
  "feasibility": "feasible",
  "rejected_routes": [
    "no_cover_violates_borrow_recall",
    "sell_2_ES_violates_margin",
    "put_only_fails_beta_target",
    "buy_10_puts_with_es_worse_worst_case",
    "SPY_CFD_unavailable_US"
  ],
  "self_check": [
    "borrow_recall_satisfied",
    "beta_reduction_70_pct",
    "margin_within_limit",
    "cash_nonnegative",
    "no_cfd_or_new_short",
    "worst_case_optimized_at_5_puts"
  ]
}
```

context.canonical_answer:
```json
{
  "strategy": "cover_recall_sell_1_es_buy_5_spy_puts",
  "cash_after_execution": 3673.5,
  "beta_reduction_pct": 70,
  "scenario_pnl": {
    "risk_off": -4026.5,
    "tech_squeeze": 673.5,
    "index_flat_aapl_squeeze": -5326.5
  },
  "worst_case_pnl": -5326.5
}
```

## D. STATED DERIVATION

Covering 300 AAPL costs 300 * 181 + 300 * 0.005 = 54301.50, leaving 5698.50 before ES slippage and options. One ES hedges 5000 * 50 = 250000, or 50% of 500000 SPY beta dollars, and uses 13000 of 14000 margin. Two ES violates margin. Put-only hedging maxes at 10 * 100 * 500 * 0.40 = 200000 delta hedge, or 40%, below the 45% target. With one ES, k SPY puts changes risk-off PnL by +2100 per contract and flat/squeeze PnL by -400 per contract, so the worst-case PnL is maximized at 5 puts. Final cash after cover, ES slippage, and 5 puts is 3673.50. Scenario PnL: risk-off = -30000 + 15000 + 800 + 12500 - 301.50 - 25 - 2000 = -4026.50; tech squeeze = 10000 - 5000 - 2000 + 0 - 301.50 - 25 - 2000 = 673.50; index-flat AAPL squeeze = 0 + 0 - 3000 + 0 - 301.50 - 25 - 2000 = -5326.50.

## YOUR TASK

Looking ONLY at sections A and B (problem + rubric), and then checking against C/D:

1. DERIVABLE? Can the canonical answer be reached using only A+B — no outside/live data, no hidden
   convention not stated, no contradiction, every graded value forced by the packet? Verdict one of:
   VERIFIED | PARTIAL | ERROR.
   - PARTIAL = derivable but with a wrinkle (e.g. a needed convention/rounding rule not stated,
     a graded label the solver couldn't know to produce).
   - ERROR = canonical not derivable from A+B, or contradicts the packet, or arithmetic is wrong.
2. UNIQUE? Given the rubric's pass rule (tolerances/ranges/set-equality), is the canonical answer the
   ONLY answer that passes — or could a DIFFERENT, equally-valid answer also pass (e.g. two candidate
   routes tie on the objective; a second feasible value inside tolerance; ambiguous rounding)?
   Verdict one of: UNIQUE | NON_UNIQUE | UNSURE.
3. Recompute the arithmetic yourself; if it disagrees with C, that's an ERROR.
