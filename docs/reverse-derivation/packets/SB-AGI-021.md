# Reverse-derivation audit packet — SB-AGI-021

tier: AGI   primary_domain: Futures / commodities / spreads / rolls   scenario_family: futures_roll_calendar

## A. WHAT THE SOLVER SEES (problem + required output)

```
Frozen market snapshot:
- Position: long 6 CL near-month futures. This is a futures roll calendar ahead of first notice; use executable bid/ask, not mid.
- First notice day is tomorrow; account policy forbids holding physically deliverable CL long into first notice.
- Only the displayed bid/ask is executable; mid prices are indicative and not executable.
Candidate routes (decide feasibility yourself):
- Route A (route_a): roll by selling near at bid 81.00 and buying next at ask 81.75; CL multiplier 1000 barrels; fee 4 USD/contract/leg
- Route B (route_b): roll using the near/next mid prices instead of bid/ask
- Route C (route_c): hold the long near-month position into first notice day

Frozen scenario PnL before action:
- gap_down: -130000 USD.
- melt_up: 52000 USD.
- range_chop: -70000 USD.
- sector_rotation: -62000 USD.
The selected route's per-scenario hedge effect (before cost) is: gap_down +3000, melt_up -1000, range_chop +2000, sector_rotation +2500 USD. Apply this effect to each scenario, then subtract the 4548 USD cash cost from every scenario.

Task:
Roll the position and compute total executable cost. Report rejected routes by route id.

Objective:
select the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.

Output JSON fields: { "decision", "selected_route", "contracts", "roll_cost_usd", "fees_usd", "total_cost_usd", "feasibility", "rejected_routes", "scenario_pnl", "worst_case_pnl", "self_check" }
```

## B. RUBRIC SCORING CONTRACT (how the answer is graded)

- pass_threshold: 0.7
- required_fields: [
  "decision",
  "selected_route",
  "contracts",
  "roll_cost_usd",
  "fees_usd",
  "total_cost_usd",
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
  "contracts",
  "roll_cost_usd",
  "fees_usd",
  "total_cost_usd",
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
    "expected": "roll"
  },
  "selected_route": {
    "type": "string",
    "expected": "route_a"
  },
  "contracts": {
    "type": "number",
    "expected": 6,
    "tolerance": 0.01
  },
  "roll_cost_usd": {
    "type": "number",
    "expected": 4500,
    "tolerance": 0.01
  },
  "fees_usd": {
    "type": "number",
    "expected": 48,
    "tolerance": 0.01
  },
  "total_cost_usd": {
    "type": "number",
    "expected": 4548,
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
  "scenario_pnl.gap_down": {
    "type": "number",
    "expected": -131548,
    "tolerance": 0.01
  },
  "scenario_pnl.melt_up": {
    "type": "number",
    "expected": 46452,
    "tolerance": 0.01
  },
  "scenario_pnl.range_chop": {
    "type": "number",
    "expected": -72548,
    "tolerance": 0.01
  },
  "scenario_pnl.sector_rotation": {
    "type": "number",
    "expected": -64048,
    "tolerance": 0.01
  },
  "worst_case_pnl": {
    "type": "number",
    "expected": -131548,
    "tolerance": 0.01
  },
  "self_check": {}
}
```
- failure_modes: [
  "uses mid prices",
  "holds into first notice",
  "omits fees"
]
- must_not: [
  "must_not_use_mid_when_bid_ask_given",
  "must_not_hold_deliverable_into_first_notice"
]

## C. CANONICAL ANSWER (the answer key — you MAY look at this)

```json
{
  "decision": "roll",
  "selected_route": "route_a",
  "contracts": 6,
  "roll_cost_usd": 4500,
  "fees_usd": 48,
  "total_cost_usd": 4548,
  "feasibility": "feasible",
  "rejected_routes": [
    "route_b",
    "route_c"
  ],
  "scenario_pnl": {
    "gap_down": -131548,
    "melt_up": 46452,
    "range_chop": -72548,
    "sector_rotation": -64048
  },
  "worst_case_pnl": -131548,
  "self_check": {
    "uses_executable_prices": true,
    "avoids_first_notice": true
  }
}
```

context.canonical_answer:
```json
{
  "decision": "roll",
  "selected_route": "route_a",
  "contracts": 6,
  "roll_cost_usd": 4500,
  "fees_usd": 48,
  "total_cost_usd": 4548,
  "feasibility": "feasible",
  "rejected_routes": [
    "route_b",
    "route_c"
  ],
  "scenario_pnl": {
    "gap_down": -131548,
    "melt_up": 46452,
    "range_chop": -72548,
    "sector_rotation": -64048
  },
  "worst_case_pnl": -131548,
  "self_check": {
    "uses_executable_prices": true,
    "avoids_first_notice": true
  }
}
```

## D. STATED DERIVATION

Roll cost = (81.75 - 81) * 1000 * 6 = 4500; fees = 48; total = 4548. Mid-price route not executable; holding into first notice violates policy.

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
