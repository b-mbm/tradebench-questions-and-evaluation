# Reverse-derivation audit packet — SB-AGI-004

tier: AGI   primary_domain: Futures / commodities / spreads / rolls   scenario_family: span_margin_calendar_spread

## A. WHAT THE SOLVER SEES (problem + required output)

```
Frozen market snapshot:
- Account: futures account using the simplified SPAN margin figures in this packet.
- Objective: add crude-oil carry exposure with margin_used <= 10,000 USD.
- Strategy A: long 3 outright CL contracts, expected carry 1,800 USD, SPAN margin 24,000 USD.
- Strategy B: long 6 CL June / short 6 CL July calendar spreads, expected carry 1,200 USD, SPAN margin 9,000 USD.
- Strategy C: long 2 outright CL contracts, expected carry 1,100 USD, SPAN margin 16,000 USD.
- Execution fees are included. Ignore basis beyond expected carry.

Task: Select the feasible strategy with the highest expected carry.

Objective: maximize expected_carry_usd subject to SPAN margin_used <= 10,000.

Output JSON fields: { "decision", "chosen_strategy", "spread_count", "expected_carry_usd", "margin_used", "feasibility", "rejected_routes", "self_check", "reasoning" }
```

## B. RUBRIC SCORING CONTRACT (how the answer is graded)

- pass_threshold: 0.7
- required_fields: [
  "decision",
  "chosen_strategy",
  "spread_count",
  "expected_carry_usd",
  "margin_used",
  "feasibility",
  "rejected_routes",
  "self_check"
]
- critical_fields (must be exactly correct or the row fails): [
  "decision",
  "spread_count",
  "expected_carry_usd",
  "margin_used",
  "feasibility"
]
- field validation specs (type/expected/tolerance/range/enum/expected_set):
```json
{
  "decision": {
    "type": "string",
    "expected": "trade"
  },
  "chosen_strategy": {
    "type": "string",
    "expected": "CL_June_July_calendar_spread"
  },
  "spread_count": {
    "type": "number",
    "expected": 6,
    "tolerance": 0
  },
  "expected_carry_usd": {
    "type": "number",
    "expected": 1200,
    "tolerance": 0
  },
  "margin_used": {
    "type": "number",
    "expected": 9000,
    "tolerance": 0
  },
  "feasibility": {
    "type": "string",
    "expected": "feasible"
  },
  "rejected_routes": {
    "type": "array",
    "expected_set": [
      "strategy_A_margin_exceeded",
      "strategy_C_margin_exceeded"
    ],
    "min_items": 2
  },
  "self_check": {
    "type": "array",
    "expected_set": [
      "span_margin_within_limit",
      "highest_feasible_carry_selected"
    ],
    "min_items": 2
  }
}
```
- failure_modes: [
  "chooses higher carry but margin-infeasible outright",
  "ignores SPAN margin"
]
- must_not: [
  "must_not_exceed_span_margin"
]

## C. CANONICAL ANSWER (the answer key — you MAY look at this)

```json
{
  "decision": "trade",
  "chosen_strategy": "CL_June_July_calendar_spread",
  "spread_count": 6,
  "expected_carry_usd": 1200,
  "margin_used": 9000,
  "feasibility": "feasible",
  "rejected_routes": [
    "strategy_A_margin_exceeded",
    "strategy_C_margin_exceeded"
  ],
  "self_check": [
    "span_margin_within_limit",
    "highest_feasible_carry_selected"
  ]
}
```

context.canonical_answer:
```json
null
```

## D. STATED DERIVATION

Only strategy B is within the 10,000 margin cap and it has expected carry 1,200 with margin 9,000.

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
