# Reverse-derivation audit packet — SB-AGI-017

tier: AGI   primary_domain: Listed options strategy / Greeks   scenario_family: put_spread_downside_floor

## A. WHAT THE SOLVER SEES (problem + required output)

```
Frozen market snapshot:
- Position: long 1,000 MSFT common stock at 480.00.
- Downside scenario for grading: MSFT closes at 430.00 at option expiry.
- Constraint: scenario PnL including option premium must be no worse than -38000 USD (a downside floor on this put spread).
- Option multiplier: 100 shares; use exactly 10 spreads. Stock PnL + spread payoff - net premium = scenario PnL.
Candidate put spreads (decide which meet the floor; pick the lowest net premium among those that do):
- Route A (route_a): buy 10 MSFT 480 puts at 12.00 and sell 10 MSFT 470 puts at 7.00 (put spread)
- Route B (route_b): buy 10 MSFT 480 puts at 12.00 and sell 10 MSFT 460 puts at 5.00 (put spread)
- Route C (route_c): buy 10 MSFT 480 puts at 12.00 and sell 10 MSFT 450 puts at 3.00 (put spread)

Frozen scenario PnL before action:
- rate_shock: -140000 USD.
- vol_spike: 56000 USD.
- credit_widening: -70000 USD.
The selected route's per-scenario hedge effect (before cost) is: rate_shock +20000, vol_spike -3000, credit_widening +14000 USD. Apply this effect to each scenario, then subtract the 7000 USD cash cost from every scenario.

Task:
Select the feasible put spread and compute net premium and scenario PnL. Report rejected routes by route id.

Objective:
minimize net premium subject to scenario_pnl_usd >= the stated floor.

For this task set "decision" = "hedge".
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
  "scenario_pnl.rate_shock",
  "scenario_pnl.vol_spike",
  "scenario_pnl.credit_widening",
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
    "expected": "hedge"
  },
  "selected_route": {
    "type": "string",
    "expected": "route_b"
  },
  "buy_put_strike": {
    "type": "number",
    "expected": 480,
    "tolerance": 0.01
  },
  "sell_put_strike": {
    "type": "number",
    "expected": 460,
    "tolerance": 0.01
  },
  "contracts": {
    "type": "number",
    "expected": 10,
    "tolerance": 0.01
  },
  "net_premium_paid": {
    "type": "number",
    "expected": 7000,
    "tolerance": 0.01
  },
  "scenario_pnl_usd": {
    "type": "number",
    "expected": -37000,
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
      "route_c"
    ],
    "min_items": 2,
    "match_type": "exact_set"
  },
  "scenario_pnl.rate_shock": {
    "type": "number",
    "expected": -127000,
    "tolerance": 0.01
  },
  "scenario_pnl.vol_spike": {
    "type": "number",
    "expected": 46000,
    "tolerance": 0.01
  },
  "scenario_pnl.credit_widening": {
    "type": "number",
    "expected": -63000,
    "tolerance": 0.01
  },
  "worst_case_pnl": {
    "type": "number",
    "expected": -127000,
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
  "selected_route": "route_b",
  "buy_put_strike": 480,
  "sell_put_strike": 460,
  "contracts": 10,
  "net_premium_paid": 7000,
  "scenario_pnl_usd": -37000,
  "feasibility": "feasible",
  "rejected_routes": [
    "route_a",
    "route_c"
  ],
  "scenario_pnl": {
    "rate_shock": -127000,
    "vol_spike": 46000,
    "credit_widening": -63000
  },
  "worst_case_pnl": -127000,
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
  "selected_route": "route_b",
  "buy_put_strike": 480,
  "sell_put_strike": 460,
  "contracts": 10,
  "net_premium_paid": 7000,
  "scenario_pnl_usd": -37000,
  "feasibility": "feasible",
  "rejected_routes": [
    "route_a",
    "route_c"
  ],
  "scenario_pnl": {
    "rate_shock": -127000,
    "vol_spike": 46000,
    "credit_widening": -63000
  },
  "worst_case_pnl": -127000,
  "self_check": {
    "downside_floor_met": true,
    "lowest_premium_selected": true
  }
}
```

## D. STATED DERIVATION

For each spread: net premium = (long-short)*100*10; scenario PnL = stock loss + spread payoff - net premium. Feasible if PnL >= -38000. Lowest-premium feasible = route_b (sell 460), net 7000, PnL -37000.

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
