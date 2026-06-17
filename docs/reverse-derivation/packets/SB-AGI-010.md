# Reverse-derivation audit packet — SB-AGI-010

tier: AGI   primary_domain: Listed options strategy / Greeks   scenario_family: early_assignment_dividend_risk

## A. WHAT THE SOLVER SEES (problem + required output)

```
Frozen market snapshot:
- Covered call on XLK ETF: long 100 shares at 205.00, short 1 200 call.
- Call quote: 5.80 USD/share; option multiplier 100 shares. Intrinsic = max(0, spot - strike).
- Ordinary cash dividend 0.90/share with ex-dividend tomorrow. Early assignment of an American call is rational for the holder when the dividend exceeds the call's remaining time value.
Candidate routes (decide which is required by the assignment economics):
- Route A (route_a): roll/close the short call before ex-dividend to avoid early assignment
- Route B (route_b): hold the covered call through ex-dividend unchanged

Frozen scenario PnL before action:
- risk_off: -135000 USD.
- squeeze: 48000 USD.
The selected route's per-scenario hedge effect (before cost) is: risk_off +1500, squeeze -500 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.

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
  "scenario_pnl.risk_off",
  "scenario_pnl.squeeze",
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
  "scenario_pnl.risk_off",
  "scenario_pnl.squeeze",
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
    "expected": "route_a"
  },
  "instrument": {
    "type": "string",
    "expected": "XLK"
  },
  "call_strike": {
    "type": "number",
    "expected": 200,
    "tolerance": 0.01
  },
  "dividend_per_share": {
    "type": "number",
    "expected": 0.9,
    "tolerance": 0.01
  },
  "call_time_value": {
    "type": "number",
    "expected": 0.8,
    "tolerance": 0.01
  },
  "early_assignment_risk": {
    "type": "boolean",
    "expected": true
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
  "scenario_pnl.risk_off": {
    "type": "number",
    "expected": -133500,
    "tolerance": 0.01
  },
  "scenario_pnl.squeeze": {
    "type": "number",
    "expected": 47500,
    "tolerance": 0.01
  },
  "worst_case_pnl": {
    "type": "number",
    "expected": -133500,
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
  "selected_route": "route_a",
  "instrument": "XLK",
  "call_strike": 200,
  "dividend_per_share": 0.9,
  "call_time_value": 0.8,
  "early_assignment_risk": true,
  "feasibility": "feasible",
  "rejected_routes": [
    "route_b"
  ],
  "scenario_pnl": {
    "risk_off": -133500,
    "squeeze": 47500
  },
  "worst_case_pnl": -133500,
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
  "selected_route": "route_a",
  "instrument": "XLK",
  "call_strike": 200,
  "dividend_per_share": 0.9,
  "call_time_value": 0.8,
  "early_assignment_risk": true,
  "feasibility": "feasible",
  "rejected_routes": [
    "route_b"
  ],
  "scenario_pnl": {
    "risk_off": -133500,
    "squeeze": 47500
  },
  "worst_case_pnl": -133500,
  "self_check": {
    "compared_dividend_to_time_value": true,
    "assignment_handled": true
  }
}
```

## D. STATED DERIVATION

Intrinsic = max(0, 205-200); time value = 5.8 - intrinsic = 0.8. Dividend 0.9 > time value -> early assignment rational (roll/close).

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
