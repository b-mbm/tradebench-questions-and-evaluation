# Reverse-derivation audit packet — SB-AGI-015

tier: AGI   primary_domain: Listed options strategy / Greeks   scenario_family: exercise_assignment_roll_decision

## A. WHAT THE SOLVER SEES (problem + required output)

```
Frozen market snapshot:
- You hold 1 long ITM IWM ETF call, strike 190, spot 200.00.
- Call quote 13.00/share; intrinsic = spot - strike = 10.00; remaining time value = quote - intrinsic = 3.00.
- Ordinary dividend 3.60/share, ex-dividend tomorrow. Early exercise/assignment of an American call is rational only when the dividend exceeds the remaining time value.
Candidate routes (decide from the exercise economics; do not assume a route):
- Route A (route_a): exercise the long call early to capture the 3.60/share dividend (you forfeit remaining time value)
- Route B (route_b): sell the long call at its 13.00 quote and keep the time value
- Route C (route_c): roll the call to the next expiry

Frozen scenario PnL before action:
- gap_down: -130000 USD.
- melt_up: 48000 USD.
- range_chop: -76000 USD.
- sector_rotation: -62000 USD.
The selected route's per-scenario hedge effect (before cost) is: gap_down +1200, melt_up -400, range_chop +900, sector_rotation +1050 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.

Task:
Compare the dividend to the time value, decide whether to exercise early, and select the route. Report rejected routes by route id.

Objective:
resolve the exercise/assignment decision at the highest economic value.

Output JSON fields: { "decision", "selected_route", "instrument", "dividend_per_share", "call_time_value", "exercise_early", "feasibility", "rejected_routes", "scenario_pnl", "worst_case_pnl", "self_check" }
```

## B. RUBRIC SCORING CONTRACT (how the answer is graded)

- pass_threshold: 0.7
- required_fields: [
  "decision",
  "selected_route",
  "instrument",
  "dividend_per_share",
  "call_time_value",
  "exercise_early",
  "feasibility",
  "rejected_routes",
  "scenario_pnl.gap_down",
  "scenario_pnl.melt_up",
  "scenario_pnl.range_chop",
  "scenario_pnl.sector_rotation",
  "worst_case_pnl",
  "self_check"
]
- critical_fields (must be exactly correct or the row fails): [
  "decision",
  "selected_route",
  "instrument",
  "dividend_per_share",
  "call_time_value",
  "exercise_early",
  "feasibility",
  "scenario_pnl.gap_down",
  "scenario_pnl.melt_up",
  "scenario_pnl.range_chop",
  "scenario_pnl.sector_rotation",
  "worst_case_pnl"
]
- field validation specs (type/expected/tolerance/range/enum/expected_set):
```json
{
  "decision": {
    "type": "string",
    "expected": "exercise_decision"
  },
  "selected_route": {
    "type": "string",
    "expected": "route_a"
  },
  "instrument": {
    "type": "string",
    "expected": "IWM"
  },
  "dividend_per_share": {
    "type": "number",
    "expected": 3.6,
    "tolerance": 0.01
  },
  "call_time_value": {
    "type": "number",
    "expected": 3,
    "tolerance": 0.01
  },
  "exercise_early": {
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
      "route_b",
      "route_c"
    ],
    "min_items": 2,
    "match_type": "exact_set"
  },
  "scenario_pnl.gap_down": {
    "type": "number",
    "expected": -128800,
    "tolerance": 0.01
  },
  "scenario_pnl.melt_up": {
    "type": "number",
    "expected": 47600,
    "tolerance": 0.01
  },
  "scenario_pnl.range_chop": {
    "type": "number",
    "expected": -75100,
    "tolerance": 0.01
  },
  "scenario_pnl.sector_rotation": {
    "type": "number",
    "expected": -60950,
    "tolerance": 0.01
  },
  "worst_case_pnl": {
    "type": "number",
    "expected": -128800,
    "tolerance": 0.01
  },
  "self_check": {}
}
```
- failure_modes: [
  "exercises when time value exceeds dividend",
  "ignores exercise economics"
]
- must_not: [
  "must_not_ignore_dividend_vs_time_value"
]

## C. CANONICAL ANSWER (the answer key — you MAY look at this)

```json
{
  "decision": "exercise_decision",
  "selected_route": "route_a",
  "instrument": "IWM",
  "dividend_per_share": 3.6,
  "call_time_value": 3,
  "exercise_early": true,
  "feasibility": "feasible",
  "rejected_routes": [
    "route_b",
    "route_c"
  ],
  "scenario_pnl": {
    "gap_down": -128800,
    "melt_up": 47600,
    "range_chop": -75100,
    "sector_rotation": -60950
  },
  "worst_case_pnl": -128800,
  "self_check": {
    "compared_dividend_to_time_value": true,
    "exercise_or_assignment_resolved": true
  }
}
```

context.canonical_answer:
```json
{
  "decision": "exercise_decision",
  "selected_route": "route_a",
  "instrument": "IWM",
  "dividend_per_share": 3.6,
  "call_time_value": 3,
  "exercise_early": true,
  "feasibility": "feasible",
  "rejected_routes": [
    "route_b",
    "route_c"
  ],
  "scenario_pnl": {
    "gap_down": -128800,
    "melt_up": 47600,
    "range_chop": -75100,
    "sector_rotation": -60950
  },
  "worst_case_pnl": -128800,
  "self_check": {
    "compared_dividend_to_time_value": true,
    "exercise_or_assignment_resolved": true
  }
}
```

## D. STATED DERIVATION

Time value = 13 - 10.00 = 3. Dividend 3.6 > time value -> exercise early.

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
