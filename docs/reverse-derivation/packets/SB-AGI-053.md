# Reverse-derivation audit packet — SB-AGI-053

tier: AGI   primary_domain: Shorting / borrow / margin / locates   scenario_family: borrow_cost_vs_trade_edge

## A. WHAT THE SOLVER SEES (problem + required output)

```
Frozen market snapshot:
- Account: US margin account. Borrow rate is 8.00% APR; weigh borrow cost against edge.
- Instrument: SPY ETF at 160.00. Desired bearish target: short 1000 shares of exposure.
- Locate availability: exactly 400 shares. Option cash available: 1600 USD. Put delta -0.35 means 35 delta-shares per contract.
Candidate routes (decide feasibility from the locate and cash limits yourself):
- Route A (route_a): short exactly the 400 located shares and buy 2 listed puts (delta -0.35, premium 8.00 USD/share, multiplier 100) within 1600 USD option cash
- Route B (route_b): short the full 1000-share target (requires shares beyond the locate)
- Route C (route_c): buy 6 listed puts (premium 8.00 USD/share, multiplier 100), ignoring the option cash limit

Frozen scenario PnL before action:
- rate_shock: -140000 USD.
- vol_spike: 40000 USD.
- credit_widening: -70000 USD.
The selected route's per-scenario hedge effect (before cost) is: rate_shock +12000, vol_spike -20000, credit_widening +9000 USD. Apply this effect to each scenario, then subtract the 1600 USD cash cost from every scenario.

Task:
Choose the feasible bearish implementation that maximizes bearish delta-shares without breaching the locate or option cash. Report rejected routes by route id.

Objective:
maximize bearish delta-shares subject to locate and option-cash constraints.

Output JSON fields: { "decision", "selected_route", "instrument", "short_shares", "put_contracts", "premium_paid", "bearish_delta_shares", "feasibility", "rejected_routes", "scenario_pnl", "worst_case_pnl", "self_check" }
```

## B. RUBRIC SCORING CONTRACT (how the answer is graded)

- pass_threshold: 0.7
- required_fields: [
  "decision",
  "selected_route",
  "instrument",
  "short_shares",
  "put_contracts",
  "premium_paid",
  "bearish_delta_shares",
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
  "instrument",
  "short_shares",
  "put_contracts",
  "premium_paid",
  "bearish_delta_shares",
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
    "expected": "trade"
  },
  "selected_route": {
    "type": "string",
    "expected": "route_a"
  },
  "instrument": {
    "type": "string",
    "expected": "SPY"
  },
  "short_shares": {
    "type": "number",
    "expected": 400,
    "tolerance": 0.01
  },
  "put_contracts": {
    "type": "number",
    "expected": 2,
    "tolerance": 0.01
  },
  "premium_paid": {
    "type": "number",
    "expected": 1600,
    "tolerance": 0.01
  },
  "bearish_delta_shares": {
    "type": "number",
    "expected": 470,
    "tolerance": 0.01
  },
  "feasibility": {
    "type": "string",
    "expected": "feasible"
  },
  "rejected_routes": {
    "type": "array",
    "expected_set": [
      "route_b",
      "route_c"
    ],
    "min_items": 2,
    "match_type": "exact_set"
  },
  "scenario_pnl.rate_shock": {
    "type": "number",
    "expected": -129600,
    "tolerance": 0.01
  },
  "scenario_pnl.vol_spike": {
    "type": "number",
    "expected": 18400,
    "tolerance": 0.01
  },
  "scenario_pnl.credit_widening": {
    "type": "number",
    "expected": -62600,
    "tolerance": 0.01
  },
  "worst_case_pnl": {
    "type": "number",
    "expected": -129600,
    "tolerance": 0.01
  },
  "self_check": {}
}
```
- failure_modes: [
  "shorts beyond locate",
  "exceeds option cash",
  "misses option delta multiplier"
]
- must_not: [
  "must_not_short_more_than_locate",
  "must_not_exceed_option_cash"
]

## C. CANONICAL ANSWER (the answer key — you MAY look at this)

```json
{
  "decision": "trade",
  "selected_route": "route_a",
  "instrument": "SPY",
  "short_shares": 400,
  "put_contracts": 2,
  "premium_paid": 1600,
  "bearish_delta_shares": 470,
  "feasibility": "feasible",
  "rejected_routes": [
    "route_b",
    "route_c"
  ],
  "scenario_pnl": {
    "rate_shock": -129600,
    "vol_spike": 18400,
    "credit_widening": -62600
  },
  "worst_case_pnl": -129600,
  "self_check": {
    "within_locate": true,
    "within_option_cash": true
  }
}
```

context.canonical_answer:
```json
{
  "decision": "trade",
  "selected_route": "route_a",
  "instrument": "SPY",
  "short_shares": 400,
  "put_contracts": 2,
  "premium_paid": 1600,
  "bearish_delta_shares": 470,
  "feasibility": "feasible",
  "rejected_routes": [
    "route_b",
    "route_c"
  ],
  "scenario_pnl": {
    "rate_shock": -129600,
    "vol_spike": 18400,
    "credit_widening": -62600
  },
  "worst_case_pnl": -129600,
  "self_check": {
    "within_locate": true,
    "within_option_cash": true
  }
}
```

## D. STATED DERIVATION

Short 400 located shares + 2 puts * 35 delta-shares = 470; premium = 2*8*100 = 1600 (<= 1600). Route B shorts beyond locate; Route C exceeds option cash.

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
