# Reverse-derivation audit packet — SB-AGI-006

tier: AGI   primary_domain: Execution / liquidity / microstructure   scenario_family: invalid_route_session_trap

## A. WHAT THE SOLVER SEES (problem + required output)

```
Frozen market snapshot:
- Timestamp: 2026-07-22 16:10:00 America/New_York.
- Position: long 1,000 SPY shares at 500.00.
- Regular equity session is closed. Extended-hours SPY liquidity is firm for only 300 shares at 499.50.
- CME ES futures are open. ES quote: 5,000, multiplier 50, margin 13,000, margin capacity 15,000, slippage/fees 25.
- CFD route unavailable. New SPY short sale unavailable in extended hours.
- Objective: maximize immediate exposure reduction before overnight under these route constraints.

Task: Build the valid immediate reduction plan and reject invalid routes.

Objective: maximize beta-dollar exposure reduction subject to session liquidity, margin, and route-permission constraints.

Output JSON fields: { "decision", "chosen_strategy", "spy_sell_shares", "es_contracts", "exposure_reduction_usd", "margin_used", "feasibility", "rejected_routes", "self_check", "reasoning" }
```

## B. RUBRIC SCORING CONTRACT (how the answer is graded)

- pass_threshold: 0.7
- required_fields: [
  "decision",
  "chosen_strategy",
  "spy_sell_shares",
  "es_contracts",
  "exposure_reduction_usd",
  "margin_used",
  "feasibility",
  "rejected_routes",
  "self_check"
]
- critical_fields (must be exactly correct or the row fails): [
  "decision",
  "chosen_strategy",
  "spy_sell_shares",
  "es_contracts",
  "exposure_reduction_usd",
  "margin_used",
  "feasibility"
]
- field validation specs (type/expected/tolerance/range/enum/expected_set):
```json
{
  "decision": {
    "type": "string",
    "expected": "reduce"
  },
  "chosen_strategy": {
    "type": "string",
    "expected": "sell_300_SPY_extended_hours_and_sell_1_ES"
  },
  "spy_sell_shares": {
    "type": "number",
    "expected": 300,
    "tolerance": 0
  },
  "es_contracts": {
    "type": "number",
    "expected": 1,
    "tolerance": 0
  },
  "exposure_reduction_usd": {
    "type": "number",
    "expected": 399850,
    "tolerance": 0
  },
  "margin_used": {
    "type": "number",
    "expected": 13000,
    "tolerance": 0
  },
  "feasibility": {
    "type": "string",
    "expected": "feasible"
  },
  "rejected_routes": {
    "type": "array",
    "expected_set": [
      "sell_1000_SPY_extended_hours_liquidity_exceeded",
      "use_CFD_unavailable",
      "new_SPY_short_unavailable"
    ],
    "min_items": 3
  },
  "self_check": {
    "type": "array",
    "expected_set": [
      "session_constraint_checked",
      "margin_within_limit",
      "route_permissions_checked"
    ],
    "min_items": 3
  }
}
```
- failure_modes: [
  "uses closed regular session liquidity",
  "uses unavailable CFD",
  "ignores futures margin"
]
- must_not: [
  "must_not_exceed_extended_hours_liquidity",
  "must_not_use_unavailable_route"
]

## C. CANONICAL ANSWER (the answer key — you MAY look at this)

```json
{
  "decision": "reduce",
  "chosen_strategy": "sell_300_SPY_extended_hours_and_sell_1_ES",
  "spy_sell_shares": 300,
  "es_contracts": 1,
  "exposure_reduction_usd": 399850,
  "margin_used": 13000,
  "feasibility": "feasible",
  "rejected_routes": [
    "sell_1000_SPY_extended_hours_liquidity_exceeded",
    "use_CFD_unavailable",
    "new_SPY_short_unavailable"
  ],
  "self_check": [
    "session_constraint_checked",
    "margin_within_limit",
    "route_permissions_checked"
  ]
}
```

context.canonical_answer:
```json
null
```

## D. STATED DERIVATION

Extended-hours SPY liquidity permits 300 shares = 149,850 exposure reduction. One ES adds 250,000 with 13,000 margin; total reduction 399,850.

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
