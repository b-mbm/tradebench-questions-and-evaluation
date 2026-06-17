# Reverse-derivation audit packet — SB-AGI-050

tier: AGI   primary_domain: Listed options strategy / Greeks   scenario_family: early_assignment_dividend_risk

## A. WHAT THE SOLVER SEES (problem + required output)

```
Frozen market snapshot:
- Covered call on XLK ETF: long 100 shares at 205.00, short 1 205 call.
- Call quote: 0.80 USD/share; option multiplier 100 shares. Intrinsic = max(0, spot - strike).
- Ordinary cash dividend 0.50/share with ex-dividend tomorrow. Early assignment of an American call is rational for the holder when the dividend exceeds the call's remaining time value.
Candidate routes (decide which is required by the assignment economics):
- Route A (route_a): roll/close the short call before ex-dividend to avoid early assignment
- Route B (route_b): hold the covered call through ex-dividend unchanged

Frozen scenario PnL before action:
- rate_shock: -125000 USD.
- vol_spike: 48000 USD.
- credit_widening: -73000 USD.
The selected route's per-scenario hedge effect (before cost) is: rate_shock +1500, vol_spike -500, credit_widening +1000 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.

Task:
Compute the call's time value, compare to the dividend, decide the early-assignment risk, and select the route. Report rejected routes by route id.

Objective:
remove early-assignment/dividend risk when and only when it is economically rational.

Output JSON fields: { "decision", "selected_route", "instrument", "call_strike", "dividend_per_share", "call_time_value", "early_assignment_risk", "feasibility", "rejected_routes", "scenario_pnl", "worst_case_pnl", "self_check" }
```

## B. RUBRIC SCORING CONTRACT (how the answer is graded)

- pass_threshold: 0.7
- required_fields: [
  "decision",
  "selected_route",
  "instrument",
  "call_strike",
  "dividend_per_share",
  "call_time_value",
  "early_assignment_risk",
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
  "call_strike",
  "dividend_per_share",
  "call_time_value",
  "early_assignment_risk",
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
    "expected": "manage_assignment"
  },
  "selected_route": {
    "type": "string",
    "expected": "route_b"
  },
  "instrument": {
    "type": "string",
    "expected": "XLK"
  },
  "call_strike": {
    "type": "number",
    "expected": 205,
    "tolerance": 0.01
  },
  "dividend_per_share": {
    "type": "number",
    "expected": 0.5,
    "tolerance": 0.01
  },
  "call_time_value": {
    "type": "number",
    "expected": 0.8,
    "tolerance": 0.01
  },
  "early_assignment_risk": {
    "type": "boolean",
    "expected": false
  },
  "feasibility": {
    "type": "string",
    "expected": "feasible"
  },
  "rejected_routes": {
    "type": "array",
    "expected_set": [
      "route_a"
    ],
    "min_items": 1,
    "match_type": "exact_set"
  },
  "scenario_pnl.rate_shock": {
    "type": "number",
    "expected": -123500,
    "tolerance": 0.01
  },
  "scenario_pnl.vol_spike": {
    "type": "number",
    "expected": 47500,
    "tolerance": 0.01
  },
  "scenario_pnl.credit_widening": {
    "type": "number",
    "expected": -72000,
    "tolerance": 0.01
  },
  "worst_case_pnl": {
    "type": "number",
    "expected": -123500,
    "tolerance": 0.01
  },
  "self_check": {}
}
```
- failure_modes: [
  "ignores dividend vs time value test",
  "mishandles assignment"
]
- must_not: [
  "must_not_ignore_dividend_vs_time_value"
]

## C. CANONICAL ANSWER (the answer key — you MAY look at this)

```json
{
  "decision": "manage_assignment",
  "selected_route": "route_b",
  "instrument": "XLK",
  "call_strike": 205,
  "dividend_per_share": 0.5,
  "call_time_value": 0.8,
  "early_assignment_risk": false,
  "feasibility": "feasible",
  "rejected_routes": [
    "route_a"
  ],
  "scenario_pnl": {
    "rate_shock": -123500,
    "vol_spike": 47500,
    "credit_widening": -72000
  },
  "worst_case_pnl": -123500,
  "self_check": {
    "compared_dividend_to_time_value": true,
    "assignment_handled": true
  }
}
```

context.canonical_answer:
```json
{
  "decision": "manage_assignment",
  "selected_route": "route_b",
  "instrument": "XLK",
  "call_strike": 205,
  "dividend_per_share": 0.5,
  "call_time_value": 0.8,
  "early_assignment_risk": false,
  "feasibility": "feasible",
  "rejected_routes": [
    "route_a"
  ],
  "scenario_pnl": {
    "rate_shock": -123500,
    "vol_spike": 47500,
    "credit_widening": -72000
  },
  "worst_case_pnl": -123500,
  "self_check": {
    "compared_dividend_to_time_value": true,
    "assignment_handled": true
  }
}
```

## D. STATED DERIVATION

Intrinsic = max(0, 205-205); time value = 0.8 - intrinsic = 0.8. Dividend 0.5 <= time value -> early assignment not rational (hold).

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
