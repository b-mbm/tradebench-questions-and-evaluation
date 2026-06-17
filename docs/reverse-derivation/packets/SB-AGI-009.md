# Reverse-derivation audit packet — SB-AGI-009

tier: AGI   primary_domain: Listed options strategy / Greeks   scenario_family: put_spread_downside_floor

## A. WHAT THE SOLVER SEES (problem + required output)

```
Frozen market snapshot:
- Position: long 1,000 TSLA common stock at 510.00.
- Downside scenario for grading: TSLA closes at 460.00 at option expiry.
- Constraint: scenario PnL including option premium must be no worse than -30000 USD (a downside floor on this put spread).
- Option multiplier: 100 shares; use exactly 10 spreads. Stock PnL + spread payoff - net premium = scenario PnL.
Candidate put spreads (decide which meet the floor; pick the lowest net premium among those that do):
- Route A (route_a): buy 10 TSLA 510 puts at 12.00 and sell 10 TSLA 500 puts at 7.00 (put spread)
- Route B (route_b): buy 10 TSLA 510 puts at 12.00 and sell 10 TSLA 490 puts at 5.00 (put spread)
- Route C (route_c): buy 10 TSLA 510 puts at 12.00 and sell 10 TSLA 480 puts at 3.00 (put spread)

Frozen scenario PnL before action:
- gap_down: -130000 USD.
- melt_up: 44000 USD.
- range_chop: -70000 USD.
- sector_rotation: -62000 USD.
The selected route's per-scenario hedge effect (before cost) is: gap_down +20000, melt_up -3000, range_chop +14000, sector_rotation +17000 USD. Apply this effect to each scenario, then subtract the 9000 USD cash cost from every scenario.

Task:
Select the feasible put spread and compute net premium and scenario PnL. Report rejected routes by route id.

Objective:
minimize net premium subject to scenario_pnl_usd >= the stated floor.

Output JSON fields: { "decision", "selected_route", "buy_put_strike", "sell_put_strike", "contracts", "net_premium_paid", "scenario_pnl_usd", "feasibility", "rejected_routes", "scenario_pnl", "worst_case_pnl", "self_check" }
```

## B. RUBRIC SCORING CONTRACT (how the answer is graded)

- pass_threshold: 0.7
- required_fields: [
  "decision",
  "selected_route",
  "buy_put_strike",
  "sell_put_strike",
  "contracts",
  "net_premium_paid",
  "scenario_pnl_usd",
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
  "buy_put_strike",
  "sell_put_strike",
  "contracts",
  "net_premium_paid",
  "scenario_pnl_usd",
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
    "expected": "route_c"
  },
  "buy_put_strike": {
    "type": "number",
    "expected": 510,
    "tolerance": 0.01
  },
  "sell_put_strike": {
    "type": "number",
    "expected": 480,
    "tolerance": 0.01
  },
  "contracts": {
    "type": "number",
    "expected": 10,
    "tolerance": 0.01
  },
  "net_premium_paid": {
    "type": "number",
    "expected": 9000,
    "tolerance": 0.01
  },
  "scenario_pnl_usd": {
    "type": "number",
    "expected": -29000,
    "tolerance": 0.01
  },
  "feasibility": {
    "type": "string",
    "expected": "feasible"
  },
  "rejected_routes": {
    "type": "array",
    "expected_set": [
      "route_a",
      "route_b"
    ],
    "min_items": 2,
    "match_type": "exact_set"
  },
  "scenario_pnl.gap_down": {
    "type": "number",
    "expected": -119000,
    "tolerance": 0.01
  },
  "scenario_pnl.melt_up": {
    "type": "number",
    "expected": 32000,
    "tolerance": 0.01
  },
  "scenario_pnl.range_chop": {
    "type": "number",
    "expected": -65000,
    "tolerance": 0.01
  },
  "scenario_pnl.sector_rotation": {
    "type": "number",
    "expected": -54000,
    "tolerance": 0.01
  },
  "worst_case_pnl": {
    "type": "number",
    "expected": -119000,
    "tolerance": 0.01
  },
  "self_check": {}
}
```
- failure_modes: [
  "omits option multiplier",
  "chooses cheaper spread that breaches floor",
  "ignores premium in PnL"
]
- must_not: [
  "must_not_ignore_downside_floor",
  "must_not_ignore_option_multiplier"
]

## C. CANONICAL ANSWER (the answer key — you MAY look at this)

```json
{
  "decision": "hedge",
  "selected_route": "route_c",
  "buy_put_strike": 510,
  "sell_put_strike": 480,
  "contracts": 10,
  "net_premium_paid": 9000,
  "scenario_pnl_usd": -29000,
  "feasibility": "feasible",
  "rejected_routes": [
    "route_a",
    "route_b"
  ],
  "scenario_pnl": {
    "gap_down": -119000,
    "melt_up": 32000,
    "range_chop": -65000,
    "sector_rotation": -54000
  },
  "worst_case_pnl": -119000,
  "self_check": {
    "downside_floor_met": true,
    "lowest_premium_selected": true
  }
}
```

context.canonical_answer:
```json
{
  "decision": "hedge",
  "selected_route": "route_c",
  "buy_put_strike": 510,
  "sell_put_strike": 480,
  "contracts": 10,
  "net_premium_paid": 9000,
  "scenario_pnl_usd": -29000,
  "feasibility": "feasible",
  "rejected_routes": [
    "route_a",
    "route_b"
  ],
  "scenario_pnl": {
    "gap_down": -119000,
    "melt_up": 32000,
    "range_chop": -65000,
    "sector_rotation": -54000
  },
  "worst_case_pnl": -119000,
  "self_check": {
    "downside_floor_met": true,
    "lowest_premium_selected": true
  }
}
```

## D. STATED DERIVATION

For each spread: net premium = (long-short)*100*10; scenario PnL = stock loss + spread payoff - net premium. Feasible if PnL >= -30000. Lowest-premium feasible = route_c (sell 480), net 9000, PnL -29000.

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
