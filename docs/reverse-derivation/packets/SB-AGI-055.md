# Reverse-derivation audit packet — SB-AGI-055

tier: AGI   primary_domain: Futures / commodities / spreads / rolls   scenario_family: span_margin_calendar_spread

## A. WHAT THE SOLVER SEES (problem + required output)

```
Frozen market snapshot:
- Account: futures account using the simplified SPAN margin figures in this packet.
- Objective: add crude-oil carry exposure with SPAN margin_used <= 11000 USD.
Candidate routes (decide feasibility yourself from the SPAN margin figures):
- Route A (route_a): long 3 CL June / short 3 CL July calendar spread, expected carry 1600 USD, SPAN margin 9500 USD
- Route B (route_b): long 1 outright CL contracts, expected carry 2000 USD, SPAN margin 24000 USD
- Route C (route_c): stay flat, expected carry 0 USD, SPAN margin 0 USD

Frozen scenario PnL before action:
- risk_off: -120000 USD.
- squeeze: 48000 USD.
The selected route's per-scenario hedge effect (before cost) is: risk_off +8000, squeeze -2000 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.

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
  "scenario_pnl.risk_off",
  "scenario_pnl.squeeze",
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
  "scenario_pnl.risk_off",
  "scenario_pnl.squeeze",
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
    "expected": 3,
    "tolerance": 0.01
  },
  "expected_carry_usd": {
    "type": "number",
    "expected": 1600,
    "tolerance": 0.01
  },
  "margin_used": {
    "type": "number",
    "expected": 9500,
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
  "scenario_pnl.risk_off": {
    "type": "number",
    "expected": -112000,
    "tolerance": 0.01
  },
  "scenario_pnl.squeeze": {
    "type": "number",
    "expected": 46000,
    "tolerance": 0.01
  },
  "worst_case_pnl": {
    "type": "number",
    "expected": -112000,
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
  "spread_count": 3,
  "expected_carry_usd": 1600,
  "margin_used": 9500,
  "feasibility": "feasible",
  "rejected_routes": [
    "route_b",
    "route_c"
  ],
  "scenario_pnl": {
    "risk_off": -112000,
    "squeeze": 46000
  },
  "worst_case_pnl": -112000,
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
  "spread_count": 3,
  "expected_carry_usd": 1600,
  "margin_used": 9500,
  "feasibility": "feasible",
  "rejected_routes": [
    "route_b",
    "route_c"
  ],
  "scenario_pnl": {
    "risk_off": -112000,
    "squeeze": 46000
  },
  "worst_case_pnl": -112000,
  "self_check": {
    "span_margin_within_limit": true,
    "highest_feasible_carry_selected": true
  }
}
```

## D. STATED DERIVATION

Outright SPAN margin 24000 > cap 11000 (infeasible). Calendar spread margin 9500 <= cap, carry 1600. Flat earns 0. Best feasible = calendar spread.

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
