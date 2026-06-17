# Reverse-derivation audit packet — SB-AGI-101

tier: AGI   primary_domain: Corporate actions / settlement / calendar / jurisdiction   scenario_family: t_plus_one_settlement_sequence

## A. WHAT THE SOLVER SEES (problem + required output)

```
Frozen market snapshot:
- Instrument: XLF ETF at 280.00. US equities settle T+1.
- Trade date 2026-06-15; T+1 cash settlement date 2026-06-16. Unsettled proceeds cannot be withdrawn before settlement.
Candidate routes (decide which respects settlement):
- Route A (route_a): sell 500 shares on 2026-06-15; withdraw cash only after T+1 settlement on 2026-06-16
- Route B (route_b): sell 500 shares on 2026-06-15 and withdraw the proceeds on the trade date 2026-06-15

Frozen scenario PnL before action:
- rate_shock: -140000 USD.
- vol_spike: 52000 USD.
- credit_widening: -70000 USD.
This action does not hedge the book (no per-scenario market effect), so each scenario's PnL is the frozen base PnL minus the action's cash cost (0 USD).

Task:
Sell and report trade value and the T+1 cash date. Report rejected routes by route id.

Objective:
select the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.

Output JSON fields: { "decision", "selected_route", "trade_value_usd", "settlement_rule", "settlement_cash_date", "feasibility", "rejected_routes", "scenario_pnl", "worst_case_pnl", "self_check" }
```

## B. RUBRIC SCORING CONTRACT (how the answer is graded)

- pass_threshold: 0.7
- required_fields: [
  "decision",
  "selected_route",
  "trade_value_usd",
  "settlement_rule",
  "settlement_cash_date",
  "feasibility",
  "rejected_routes",
  "scenario_pnl.rate_shock",
  "scenario_pnl.vol_spike",
  "scenario_pnl.credit_widening",
  "worst_case_pnl",
  "self_check"
]
- critical_fields (must be exactly correct or the row fails): [
  "decision",
  "selected_route",
  "trade_value_usd",
  "settlement_rule",
  "settlement_cash_date",
  "feasibility",
  "scenario_pnl.rate_shock",
  "scenario_pnl.vol_spike",
  "scenario_pnl.credit_widening",
  "worst_case_pnl"
]
- field validation specs (type/expected/tolerance/range/enum/expected_set):
```json
{
  "decision": {
    "type": "string",
    "expected": "sell"
  },
  "selected_route": {
    "type": "string",
    "expected": "route_a"
  },
  "trade_value_usd": {
    "type": "number",
    "expected": 140000,
    "tolerance": 0.01
  },
  "settlement_rule": {
    "type": "string",
    "expected": "T+1"
  },
  "settlement_cash_date": {
    "type": "string",
    "expected": "2026-06-16"
  },
  "feasibility": {
    "type": "string",
    "expected": "feasible"
  },
  "rejected_routes": {
    "type": "array",
    "expected_set": [
      "route_b"
    ],
    "min_items": 1,
    "match_type": "exact_set"
  },
  "scenario_pnl.rate_shock": {
    "type": "number",
    "expected": -140000,
    "tolerance": 0.01
  },
  "scenario_pnl.vol_spike": {
    "type": "number",
    "expected": 52000,
    "tolerance": 0.01
  },
  "scenario_pnl.credit_widening": {
    "type": "number",
    "expected": -70000,
    "tolerance": 0.01
  },
  "worst_case_pnl": {
    "type": "number",
    "expected": -140000,
    "tolerance": 0.01
  },
  "self_check": {}
}
```
- failure_modes: [
  "withdraws proceeds on trade date",
  "wrong settlement date"
]
- must_not: [
  "must_not_withdraw_unsettled_proceeds"
]

## C. CANONICAL ANSWER (the answer key — you MAY look at this)

```json
{
  "decision": "sell",
  "selected_route": "route_a",
  "trade_value_usd": 140000,
  "settlement_rule": "T+1",
  "settlement_cash_date": "2026-06-16",
  "feasibility": "feasible",
  "rejected_routes": [
    "route_b"
  ],
  "scenario_pnl": {
    "rate_shock": -140000,
    "vol_spike": 52000,
    "credit_widening": -70000
  },
  "worst_case_pnl": -140000,
  "self_check": {
    "settlement_respected": true
  }
}
```

context.canonical_answer:
```json
{
  "decision": "sell",
  "selected_route": "route_a",
  "trade_value_usd": 140000,
  "settlement_rule": "T+1",
  "settlement_cash_date": "2026-06-16",
  "feasibility": "feasible",
  "rejected_routes": [
    "route_b"
  ],
  "scenario_pnl": {
    "rate_shock": -140000,
    "vol_spike": 52000,
    "credit_widening": -70000
  },
  "worst_case_pnl": -140000,
  "self_check": {
    "settlement_respected": true
  }
}
```

## D. STATED DERIVATION

Trade value = 500 * 280 = 140000; cash settles T+1 on 2026-06-16. Same-day withdrawal route violates settlement.

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
