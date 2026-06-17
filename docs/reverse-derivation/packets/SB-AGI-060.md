# Reverse-derivation audit packet — SB-AGI-060

tier: AGI   primary_domain: Portfolio risk / rebalancing   scenario_family: beta_dollar_rebalance

## A. WHAT THE SOLVER SEES (problem + required output)

```
Frozen market snapshot:
- Account: US portfolio margin account. This is a beta-dollar rebalance against the stated beta target.
- Portfolio equity beta-dollar exposure: 900000 USD.
- Required reduction: at least 50% of beta-dollar exposure.
- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 33000 USD.
- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 250000 beta-dollars.
Candidate routes (decide feasibility yourself from the facts; do not assume any route is valid):
- Route A (route_a): short 2 ES futures (beta hedge), ES at 5000.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract
- Route B (route_b): short 1 ES futures, same specs as Route A
- Route C (route_c): buy a SPY put package costing 21000 USD premium that reduces beta-dollars by 500000 USD
- Route D (route_d): short 5 ES futures, same specs as Route A

Frozen scenario PnL before action:
- gap_down: -145000 USD.
- melt_up: 48000 USD.
- range_chop: -79000 USD.
- sector_rotation: -62000 USD.
The selected route's per-scenario hedge effect (before cost) is: gap_down +95000, melt_up -15000, range_chop +60000, sector_rotation +77500 USD. Apply this effect to each scenario, then subtract the 50 USD cash cost from every scenario.

Task:
Choose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.

Objective:
select the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.

Output JSON fields: { "decision", "selected_route", "es_contracts", "beta_reduction_usd", "beta_reduction_pct", "margin_used", "expected_cost", "feasibility", "rejected_routes", "scenario_pnl", "worst_case_pnl", "self_check" }
```

## B. RUBRIC SCORING CONTRACT (how the answer is graded)

- pass_threshold: 0.7
- required_fields: [
  "decision",
  "selected_route",
  "es_contracts",
  "beta_reduction_usd",
  "beta_reduction_pct",
  "margin_used",
  "expected_cost",
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
  "es_contracts",
  "beta_reduction_usd",
  "beta_reduction_pct",
  "margin_used",
  "expected_cost",
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
    "expected": "hedge"
  },
  "selected_route": {
    "type": "string",
    "expected": "route_a"
  },
  "es_contracts": {
    "type": "number",
    "expected": 2,
    "tolerance": 0.01
  },
  "beta_reduction_usd": {
    "type": "number",
    "expected": 500000,
    "tolerance": 0.01
  },
  "beta_reduction_pct": {
    "type": "number",
    "expected": 55.56,
    "tolerance": 0.01
  },
  "margin_used": {
    "type": "number",
    "expected": 26000,
    "tolerance": 0.01
  },
  "expected_cost": {
    "type": "number",
    "expected": 50,
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
      "route_c",
      "route_d"
    ],
    "min_items": 3,
    "match_type": "exact_set"
  },
  "scenario_pnl.gap_down": {
    "type": "number",
    "expected": -50050,
    "tolerance": 0.01
  },
  "scenario_pnl.melt_up": {
    "type": "number",
    "expected": 32950,
    "tolerance": 0.01
  },
  "scenario_pnl.range_chop": {
    "type": "number",
    "expected": -19050,
    "tolerance": 0.01
  },
  "scenario_pnl.sector_rotation": {
    "type": "number",
    "expected": 15450,
    "tolerance": 0.01
  },
  "worst_case_pnl": {
    "type": "number",
    "expected": -50050,
    "tolerance": 0.01
  },
  "self_check": {}
}
```
- failure_modes: [
  "uses too few contracts and misses target",
  "treats margin as cash cost",
  "chooses higher-cost put package",
  "ignores margin capacity"
]
- must_not: [
  "must_not_miss_beta_target",
  "must_not_ignore_margin_capacity"
]

## C. CANONICAL ANSWER (the answer key — you MAY look at this)

```json
{
  "decision": "hedge",
  "selected_route": "route_a",
  "es_contracts": 2,
  "beta_reduction_usd": 500000,
  "beta_reduction_pct": 55.56,
  "margin_used": 26000,
  "expected_cost": 50,
  "feasibility": "feasible",
  "rejected_routes": [
    "route_b",
    "route_c",
    "route_d"
  ],
  "scenario_pnl": {
    "gap_down": -50050,
    "melt_up": 32950,
    "range_chop": -19050,
    "sector_rotation": 15450
  },
  "worst_case_pnl": -50050,
  "self_check": {
    "min_reduction_met": true,
    "margin_ok": true,
    "lowest_cost_feasible": true
  }
}
```

context.canonical_answer:
```json
{
  "decision": "hedge",
  "selected_route": "route_a",
  "es_contracts": 2,
  "beta_reduction_usd": 500000,
  "beta_reduction_pct": 55.56,
  "margin_used": 26000,
  "expected_cost": 50,
  "feasibility": "feasible",
  "rejected_routes": [
    "route_b",
    "route_c",
    "route_d"
  ],
  "scenario_pnl": {
    "gap_down": -50050,
    "melt_up": 32950,
    "range_chop": -19050,
    "sector_rotation": 15450
  },
  "worst_case_pnl": -50050,
  "self_check": {
    "min_reduction_met": true,
    "margin_ok": true,
    "lowest_cost_feasible": true
  }
}
```

## D. STATED DERIVATION

Needed reduction = 900000*0.5 = 450000; ES per contract hedges 250000; ceil = 2 contracts -> reduction 500000 (55.56%), margin 26000 (<= 33000), cost 50. Route B (1) misses target; Route C costs 21000 > 50; extra-ES route busts margin.

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
