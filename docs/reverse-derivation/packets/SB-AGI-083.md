# Reverse-derivation audit packet — SB-AGI-083

tier: AGI   primary_domain: Futures / commodities / spreads / rolls   scenario_family: span_margin_calendar_spread

## A. WHAT THE SOLVER SEES (problem + required output)

```
Frozen market snapshot:
- Account: futures account using the simplified SPAN margin figures in this packet.
- Objective: add crude-oil carry exposure with SPAN margin_used <= 10000 USD.
Candidate routes (decide feasibility yourself from the SPAN margin figures):
- Route A (route_a): long 7 CL June / short 7 CL July calendar spread, expected carry 1700 USD, SPAN margin 8500 USD
- Route B (route_b): long 5 outright CL contracts, expected carry 2200 USD, SPAN margin 24000 USD
- Route C (route_c): stay flat, expected carry 0 USD, SPAN margin 0 USD

Frozen scenario PnL before action:
- rate_shock: -140000 USD.
- vol_spike: 40000 USD.
- credit_widening: -76000 USD.
The selected route's per-scenario hedge effect (before cost) is: rate_shock +8000, vol_spike -2000, credit_widening +5000 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.

Task:
Select the feasible strategy with the highest expected carry under the SPAN margin cap. Report rejected routes by route id.

Objective:
select the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.

Output JSON fields: { "decision", "selected_route", "spread_count", "expected_carry_usd", "margin_used", "feasibility", "rejected_routes", "scenario_pnl", "worst_case_pnl", "self_check" }
```

## B. RUBRIC SCORING CONTRACT (how the answer is graded)

- pass_threshold: 0.7
- required_fields: [
  "decision",
  "selected_route",
  "spread_count",
  "expected_carry_usd",
  "margin_used",
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
  "spread_count",
  "expected_carry_usd",
  "margin_used",
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
  "spread_count": {
    "type": "number",
    "expected": 7,
    "tolerance": 0.01
  },
  "expected_carry_usd": {
    "type": "number",
    "expected": 1700,
    "tolerance": 0.01
  },
  "margin_used": {
    "type": "number",
    "expected": 8500,
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
    "expected": -132000,
    "tolerance": 0.01
  },
  "scenario_pnl.vol_spike": {
    "type": "number",
    "expected": 38000,
    "tolerance": 0.01
  },
  "scenario_pnl.credit_widening": {
    "type": "number",
    "expected": -71000,
    "tolerance": 0.01
  },
  "worst_case_pnl": {
    "type": "number",
    "expected": -132000,
    "tolerance": 0.01
  },
  "self_check": {}
}
```
- failure_modes: [
  "picks outright that busts SPAN margin",
  "stays flat despite feasible carry"
]
- must_not: [
  "must_not_exceed_span_margin",
  "must_not_select_infeasible_route"
]

## C. CANONICAL ANSWER (the answer key — you MAY look at this)

```json
{
  "decision": "trade",
  "selected_route": "route_a",
  "spread_count": 7,
  "expected_carry_usd": 1700,
  "margin_used": 8500,
  "feasibility": "feasible",
  "rejected_routes": [
    "route_b",
    "route_c"
  ],
  "scenario_pnl": {
    "rate_shock": -132000,
    "vol_spike": 38000,
    "credit_widening": -71000
  },
  "worst_case_pnl": -132000,
  "self_check": {
    "span_margin_within_limit": true,
    "highest_feasible_carry_selected": true
  }
}
```

context.canonical_answer:
```json
{
  "decision": "trade",
  "selected_route": "route_a",
  "spread_count": 7,
  "expected_carry_usd": 1700,
  "margin_used": 8500,
  "feasibility": "feasible",
  "rejected_routes": [
    "route_b",
    "route_c"
  ],
  "scenario_pnl": {
    "rate_shock": -132000,
    "vol_spike": 38000,
    "credit_widening": -71000
  },
  "worst_case_pnl": -132000,
  "self_check": {
    "span_margin_within_limit": true,
    "highest_feasible_carry_selected": true
  }
}
```

## D. STATED DERIVATION

Outright SPAN margin 24000 > cap 10000 (infeasible). Calendar spread margin 8500 <= cap, carry 1700. Flat earns 0. Best feasible = calendar spread.

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
