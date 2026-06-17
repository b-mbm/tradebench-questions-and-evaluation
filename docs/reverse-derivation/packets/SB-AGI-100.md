# Reverse-derivation audit packet — SB-AGI-100

tier: AGI   primary_domain: Execution / liquidity / microstructure   scenario_family: order_book_liquidity_limit

## A. WHAT THE SOLVER SEES (problem + required output)

```
Frozen market snapshot:
- Instrument: XLK ETF. Order-book liquidity limit: maximize fill under the average-price cap.
- Mid price: 122.00. Maximum average execution price (cap): 122.11.
- Ask book: 40000 @ 122.05; 40000 @ 122.10; 20000 @ 122.30.
- Partial fills allowed only in 500-share clips. Fees ignored.
Candidate routes:
- Route A (route_a): walk the book filling cheapest levels first in 500-share clips while keeping the running average <= the cap
- Route B (route_b): take the full displayed size across all levels at a single 122.30 limit

Frozen scenario PnL before action:
- risk_off: -135000 USD.
- squeeze: 48000 USD.
This action does not hedge the book (no per-scenario market effect), so each scenario's PnL is the frozen base PnL minus the action's cash cost (0 USD).

Task:
Compute the maximum buy quantity in allowed clips that keeps the average price at or below the cap. Report rejected routes by route id.

Objective:
maximize filled_shares subject to average_price <= the cap, in 500-share clips.

Output JSON fields: { "decision", "instrument", "side", "clip_size_shares", "filled_shares", "average_price", "limit_price", "feasibility", "rejected_routes", "scenario_pnl", "worst_case_pnl", "self_check" }
```

## B. RUBRIC SCORING CONTRACT (how the answer is graded)

- pass_threshold: 0.7
- required_fields: [
  "decision",
  "instrument",
  "side",
  "clip_size_shares",
  "filled_shares",
  "average_price",
  "limit_price",
  "feasibility",
  "rejected_routes",
  "scenario_pnl.risk_off",
  "scenario_pnl.squeeze",
  "worst_case_pnl",
  "self_check"
]
- critical_fields (must be exactly correct or the row fails): [
  "decision",
  "instrument",
  "side",
  "clip_size_shares",
  "filled_shares",
  "average_price",
  "limit_price",
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
    "expected": "trade"
  },
  "instrument": {
    "type": "string",
    "expected": "XLK"
  },
  "side": {
    "type": "string",
    "expected": "buy"
  },
  "clip_size_shares": {
    "type": "number",
    "expected": 500,
    "tolerance": 0.01
  },
  "filled_shares": {
    "type": "number",
    "expected": 94500,
    "tolerance": 0.01
  },
  "average_price": {
    "type": "number",
    "expected": 122.11,
    "tolerance": 0.01
  },
  "limit_price": {
    "type": "number",
    "expected": 122.3,
    "tolerance": 0.01
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
    "expected": -135000,
    "tolerance": 0.01
  },
  "scenario_pnl.squeeze": {
    "type": "number",
    "expected": 48000,
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
  "takes full book and breaches the average cap",
  "ignores clip rounding",
  "uses last price not average"
]
- must_not: [
  "must_not_exceed_average_price_cap"
]

## C. CANONICAL ANSWER (the answer key — you MAY look at this)

```json
{
  "decision": "trade",
  "instrument": "XLK",
  "side": "buy",
  "clip_size_shares": 500,
  "filled_shares": 94500,
  "average_price": 122.11,
  "limit_price": 122.3,
  "feasibility": "feasible",
  "rejected_routes": [
    "route_b"
  ],
  "scenario_pnl": {
    "risk_off": -135000,
    "squeeze": 48000
  },
  "worst_case_pnl": -135000,
  "self_check": {
    "average_price_within_cap": true,
    "max_fill_in_clips": true
  }
}
```

context.canonical_answer:
```json
{
  "decision": "trade",
  "instrument": "XLK",
  "side": "buy",
  "clip_size_shares": 500,
  "filled_shares": 94500,
  "average_price": 122.11,
  "limit_price": 122.3,
  "feasibility": "feasible",
  "rejected_routes": [
    "route_b"
  ],
  "scenario_pnl": {
    "risk_off": -135000,
    "squeeze": 48000
  },
  "worst_case_pnl": -135000,
  "self_check": {
    "average_price_within_cap": true,
    "max_fill_in_clips": true
  }
}
```

## D. STATED DERIVATION

Fill 40000@122.05 and 40000@122.10 (avg 122.08), then x@122.30 with x <= (cap*80000-9766000)/(122.3-cap) = 14736.84; floor to 500 -> 14500. Max fill 94500 at avg 122.11 (<= 122.11). Full-size route breaches the cap.

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
