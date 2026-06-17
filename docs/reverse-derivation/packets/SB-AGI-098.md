# Reverse-derivation audit packet — SB-AGI-098

tier: AGI   primary_domain: Spot FX / CFDs / multi-currency   scenario_family: multi_currency_cash_buffer

## A. WHAT THE SOLVER SEES (problem + required output)

```
Frozen market snapshot:
- Account holder: US retail customer. Account base currency: USD. Maintain a USD cash buffer; pick the lowest-USD-cost feasible conversion.
- Required: obtain 140000 EUR settling T+2. Spot EURUSD 1.0600. EUR futures initial margin capacity: 2000 USD.
Candidate routes (decide feasibility from jurisdiction, settlement and margin facts yourself):
- Route A (route_a): buy EUR spot at 1.0600, settles T+2, fees included
- Route B (route_b): use a retail CFD on EURUSD
- Route C (route_c): use EUR futures requiring 3000 USD initial margin

Frozen scenario PnL before action:
- rate_shock: -125000 USD.
- vol_spike: 40000 USD.
- credit_widening: -73000 USD.
This action does not hedge the book (no per-scenario market effect), so each scenario's PnL is the frozen base PnL minus the action's cash cost (0 USD).

Task:
Choose the feasible route and compute USD cost. Report rejected routes by route id.

Objective:
obtain the EUR by the required settlement date at the lowest feasible USD cost.

Output JSON fields: { "decision", "selected_route", "eur_amount", "usd_cost", "settlement_date_rule", "feasibility", "rejected_routes", "scenario_pnl", "worst_case_pnl", "self_check" }
```

## B. RUBRIC SCORING CONTRACT (how the answer is graded)

- pass_threshold: 0.7
- required_fields: [
  "decision",
  "selected_route",
  "eur_amount",
  "usd_cost",
  "settlement_date_rule",
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
  "eur_amount",
  "usd_cost",
  "settlement_date_rule",
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
    "expected": "convert_fx"
  },
  "selected_route": {
    "type": "string",
    "expected": "route_a"
  },
  "eur_amount": {
    "type": "number",
    "expected": 140000,
    "tolerance": 0.01
  },
  "usd_cost": {
    "type": "number",
    "expected": 148400,
    "tolerance": 0.01
  },
  "settlement_date_rule": {
    "type": "string",
    "expected": "T+2"
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
    "expected": -125000,
    "tolerance": 0.01
  },
  "scenario_pnl.vol_spike": {
    "type": "number",
    "expected": 40000,
    "tolerance": 0.01
  },
  "scenario_pnl.credit_widening": {
    "type": "number",
    "expected": -73000,
    "tolerance": 0.01
  },
  "worst_case_pnl": {
    "type": "number",
    "expected": -125000,
    "tolerance": 0.01
  },
  "self_check": {}
}
```
- failure_modes: [
  "uses unavailable CFD",
  "uses margin-infeasible futures",
  "wrong FX multiplication",
  "misses settlement date"
]
- must_not: [
  "must_not_use_cfd_when_unavailable",
  "must_not_exceed_margin_capacity"
]

## C. CANONICAL ANSWER (the answer key — you MAY look at this)

```json
{
  "decision": "convert_fx",
  "selected_route": "route_a",
  "eur_amount": 140000,
  "usd_cost": 148400,
  "settlement_date_rule": "T+2",
  "feasibility": "feasible",
  "rejected_routes": [
    "route_b",
    "route_c"
  ],
  "scenario_pnl": {
    "rate_shock": -125000,
    "vol_spike": 40000,
    "credit_widening": -73000
  },
  "worst_case_pnl": -125000,
  "self_check": {
    "settlement_matches": true,
    "product_permitted": true,
    "margin_ok": true
  }
}
```

context.canonical_answer:
```json
{
  "decision": "convert_fx",
  "selected_route": "route_a",
  "eur_amount": 140000,
  "usd_cost": 148400,
  "settlement_date_rule": "T+2",
  "feasibility": "feasible",
  "rejected_routes": [
    "route_b",
    "route_c"
  ],
  "scenario_pnl": {
    "rate_shock": -125000,
    "vol_spike": 40000,
    "credit_widening": -73000
  },
  "worst_case_pnl": -125000,
  "self_check": {
    "settlement_matches": true,
    "product_permitted": true,
    "margin_ok": true
  }
}
```

## D. STATED DERIVATION

Spot route USD cost = 140000 * 1.06 = 148400, settles T+2 (feasible). CFD unavailable to US retail; futures margin 3000 > 2000.

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
