# Reverse-derivation audit packet — SB-AGI-094

tier: AGI   primary_domain: Feasibility / rejection / no-trade traps   scenario_family: unsupported_product_permission

## A. WHAT THE SOLVER SEES (problem + required output)

```
Frozen market snapshot:
- Jurisdiction / account regime: US cash account.
- Permissions: CFDs unavailable; short selling unavailable in cash accounts; futures not approved; the regular equity session is closed.
- No alternative product permission is enabled in this packet.
Candidate routes (decide feasibility from the permission facts; a no-trade is required if all routes violate constraints):
- Route A (route_a): short 600 QQQ shares via CFD after the regular session close
- Route B (route_b): short 600 QQQ shares in the cash account
- Route C (route_c): buy QQQ futures to get short exposure

Frozen scenario PnL before action:
- risk_off: -135000 USD.
- squeeze: 44000 USD.
This action does not hedge the book (no per-scenario market effect), so each scenario's PnL is the frozen base PnL minus the action's cash cost (0 USD).

Task:
Reject every invalid route and return the no-trade decision. Report rejected routes by route id.

Objective:
return no_trade if and only if every route violates a permission, session, or product constraint.

For this task set "decision" = "no_trade".
Output JSON fields: { "decision", "selected_route", "instrument", "requested_shares", "feasibility", "rejected_routes", "scenario_pnl", "worst_case_pnl", "self_check" }
```

## B. RUBRIC SCORING CONTRACT (how the answer is graded)

- pass_threshold: 0.7
- required_fields: [
  "decision",
  "selected_route",
  "instrument",
  "requested_shares",
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
  "requested_shares",
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
    "expected": "no_trade"
  },
  "selected_route": {
    "type": "string",
    "expected": "none"
  },
  "instrument": {
    "type": "string",
    "expected": "QQQ"
  },
  "requested_shares": {
    "type": "number",
    "expected": 600,
    "tolerance": 0.01
  },
  "feasibility": {
    "type": "string",
    "expected": "infeasible"
  },
  "rejected_routes": {
    "type": "array",
    "expected_set": [
      "route_a",
      "route_b",
      "route_c"
    ],
    "min_items": 3,
    "match_type": "exact_set"
  },
  "scenario_pnl.risk_off": {
    "type": "number",
    "expected": -135000,
    "tolerance": 0.01
  },
  "scenario_pnl.squeeze": {
    "type": "number",
    "expected": 44000,
    "tolerance": 0.01
  },
  "worst_case_pnl": {
    "type": "number",
    "expected": -135000,
    "tolerance": 0.01
  },
  "self_check": {}
}
```
- failure_modes: [
  "forces a trade on an invalid route"
]
- must_not: [
  "must_not_use_unavailable_route",
  "must_not_short_in_cash_account"
]

## C. CANONICAL ANSWER (the answer key — you MAY look at this)

```json
{
  "decision": "no_trade",
  "selected_route": "none",
  "instrument": "QQQ",
  "requested_shares": 600,
  "feasibility": "infeasible",
  "rejected_routes": [
    "route_a",
    "route_b",
    "route_c"
  ],
  "scenario_pnl": {
    "risk_off": -135000,
    "squeeze": 44000
  },
  "worst_case_pnl": -135000,
  "self_check": {
    "permissions_checked": true,
    "no_valid_route": true
  }
}
```

context.canonical_answer:
```json
{
  "decision": "no_trade",
  "selected_route": "none",
  "instrument": "QQQ",
  "requested_shares": 600,
  "feasibility": "infeasible",
  "rejected_routes": [
    "route_a",
    "route_b",
    "route_c"
  ],
  "scenario_pnl": {
    "risk_off": -135000,
    "squeeze": 44000
  },
  "worst_case_pnl": -135000,
  "self_check": {
    "permissions_checked": true,
    "no_valid_route": true
  }
}
```

## D. STATED DERIVATION

CFD unavailable, cash-account short not allowed, futures not approved, session closed -> every route infeasible -> no_trade.

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
