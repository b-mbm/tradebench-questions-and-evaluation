# Reverse-derivation audit packet — SB-AGI-093

tier: AGI   primary_domain: Execution / liquidity / microstructure   scenario_family: invalid_route_session_trap

## A. WHAT THE SOLVER SEES (problem + required output)

```
Frozen market snapshot:
- Instrument: SPY ETF. Order size: 900 shares at limit 66.25. The regular session is OPEN now; the after-hours venue is CLOSED; the dark venue is NOT enabled on this account.
- Session/permission trap: only permitted, open venues are executable.
Candidate routes (decide which venue is permitted and open yourself):
- Route A (route_a): route the order to the continuous regular session
- Route B (route_b): route the order to the closed after-hours venue with no permission
- Route C (route_c): route via an unsupported dark venue not enabled on this account

Frozen scenario PnL before action:
- gap_down: -130000 USD.
- melt_up: 40000 USD.
- range_chop: -70000 USD.
- sector_rotation: -62000 USD.
This action does not hedge the book (no per-scenario market effect), so each scenario's PnL is the frozen base PnL minus the action's cash cost (0 USD).

Task:
Route to the only feasible venue. Report rejected routes by route id.

Objective:
select the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.

For this task set "decision" = "trade".
Output JSON fields: { "decision", "selected_route", "instrument", "order_shares", "limit_price", "venue", "feasibility", "rejected_routes", "scenario_pnl", "worst_case_pnl", "self_check" }
```

## B. RUBRIC SCORING CONTRACT (how the answer is graded)

- pass_threshold: 0.7
- required_fields: [
  "decision",
  "selected_route",
  "instrument",
  "order_shares",
  "limit_price",
  "venue",
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
  "order_shares",
  "limit_price",
  "venue",
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
    "expected": "trade"
  },
  "selected_route": {
    "type": "string",
    "expected": "route_a"
  },
  "instrument": {
    "type": "string",
    "expected": "SPY"
  },
  "order_shares": {
    "type": "number",
    "expected": 900,
    "tolerance": 0.01
  },
  "limit_price": {
    "type": "number",
    "expected": 66.25,
    "tolerance": 0.01
  },
  "venue": {
    "type": "string",
    "expected": "regular_session"
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
    "expected": -130000,
    "tolerance": 0.01
  },
  "scenario_pnl.melt_up": {
    "type": "number",
    "expected": 40000,
    "tolerance": 0.01
  },
  "scenario_pnl.range_chop": {
    "type": "number",
    "expected": -70000,
    "tolerance": 0.01
  },
  "scenario_pnl.sector_rotation": {
    "type": "number",
    "expected": -62000,
    "tolerance": 0.01
  },
  "worst_case_pnl": {
    "type": "number",
    "expected": -130000,
    "tolerance": 0.01
  },
  "self_check": {}
}
```
- failure_modes: [
  "routes to a closed/unpermitted venue"
]
- must_not: [
  "must_not_route_to_unpermitted_venue"
]

## C. CANONICAL ANSWER (the answer key — you MAY look at this)

```json
{
  "decision": "trade",
  "selected_route": "route_a",
  "instrument": "SPY",
  "order_shares": 900,
  "limit_price": 66.25,
  "venue": "regular_session",
  "feasibility": "feasible",
  "rejected_routes": [
    "route_b",
    "route_c"
  ],
  "scenario_pnl": {
    "gap_down": -130000,
    "melt_up": 40000,
    "range_chop": -70000,
    "sector_rotation": -62000
  },
  "worst_case_pnl": -130000,
  "self_check": {
    "session_open": true,
    "venue_permitted": true
  }
}
```

context.canonical_answer:
```json
{
  "decision": "trade",
  "selected_route": "route_a",
  "instrument": "SPY",
  "order_shares": 900,
  "limit_price": 66.25,
  "venue": "regular_session",
  "feasibility": "feasible",
  "rejected_routes": [
    "route_b",
    "route_c"
  ],
  "scenario_pnl": {
    "gap_down": -130000,
    "melt_up": 40000,
    "range_chop": -70000,
    "sector_rotation": -62000
  },
  "worst_case_pnl": -130000,
  "self_check": {
    "session_open": true,
    "venue_permitted": true
  }
}
```

## D. STATED DERIVATION

Only the open, permitted regular session is executable. After-hours is closed; dark venue not enabled.

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
