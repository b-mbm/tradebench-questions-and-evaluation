# Reverse-derivation audit packet — SB-AGI-002

tier: AGI   primary_domain: Shorting / borrow / margin / locates   scenario_family: locate_recall_options_substitution

## A. WHAT THE SOLVER SEES (problem + required output)

```
Frozen market snapshot:
- Position: short 1,000 NVDA shares at 120.00.
- Borrow recall: exactly 700 shares must be bought to cover today.
- NVDA cover ask: 121.00. Commission: 0.005 USD/share.
- No new NVDA short sales are allowed; no locate remains.
- Cash available: 100,000 USD.
- NVDA 30-day 115 put: delta -0.40, premium 3.00 per share, multiplier 100, max executable 10 contracts.
- Required post-adjustment bearish exposure: at least 500 delta-shares.

Task: Synthesize the valid adjustment that satisfies recall and bearish-exposure constraints at minimum option premium.

Objective: minimize option premium subject to recall cover, no new shorts, cash >= 0, and bearish_delta_shares >= 500.

Output JSON fields: { "decision", "chosen_strategy", "buy_to_cover_shares", "put_contracts", "cash_used", "bearish_delta_shares", "feasibility", "rejected_routes", "self_check", "reasoning" }
```

## B. RUBRIC SCORING CONTRACT (how the answer is graded)

- pass_threshold: 0.7
- required_fields: [
  "decision",
  "chosen_strategy",
  "buy_to_cover_shares",
  "put_contracts",
  "cash_used",
  "bearish_delta_shares",
  "feasibility",
  "rejected_routes",
  "self_check"
]
- critical_fields (must be exactly correct or the row fails): [
  "decision",
  "buy_to_cover_shares",
  "put_contracts",
  "cash_used",
  "bearish_delta_shares",
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
    "expected": "cover_700_buy_5_puts"
  },
  "buy_to_cover_shares": {
    "type": "number",
    "expected": 700,
    "tolerance": 0
  },
  "put_contracts": {
    "type": "number",
    "expected": 5,
    "tolerance": 0
  },
  "cash_used": {
    "type": "number",
    "expected": 86203.5,
    "tolerance": 0
  },
  "bearish_delta_shares": {
    "type": "number",
    "expected": 500,
    "tolerance": 0
  },
  "feasibility": {
    "type": "string",
    "expected": "feasible"
  },
  "rejected_routes": {
    "type": "array",
    "expected_set": [
      "skip_recall",
      "new_short_without_locate",
      "buy_4_puts_fails_delta"
    ],
    "min_items": 3
  },
  "self_check": {
    "type": "array",
    "expected_set": [
      "recall_satisfied",
      "bearish_delta_500",
      "cash_nonnegative",
      "no_new_short"
    ],
    "min_items": 4
  }
}
```
- failure_modes: [
  "skips recall",
  "opens new short without locate",
  "under-hedges bearish delta"
]
- must_not: [
  "must_not_skip_borrow_recall",
  "must_not_open_new_short_without_locate"
]

## C. CANONICAL ANSWER (the answer key — you MAY look at this)

```json
{
  "decision": "trade",
  "chosen_strategy": "cover_700_buy_5_puts",
  "buy_to_cover_shares": 700,
  "put_contracts": 5,
  "cash_used": 86203.5,
  "bearish_delta_shares": 500,
  "feasibility": "feasible",
  "rejected_routes": [
    "skip_recall",
    "new_short_without_locate",
    "buy_4_puts_fails_delta"
  ],
  "self_check": [
    "recall_satisfied",
    "bearish_delta_500",
    "cash_nonnegative",
    "no_new_short"
  ]
}
```

context.canonical_answer:
```json
null
```

## D. STATED DERIVATION

Cover 700 costs 700*121 + 700*0.005 = 84,703.50. Remaining short 300 plus 5 puts * 40 delta shares = 500 bearish delta shares. Put premium = 1,500, total cash used = 86,203.50.

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
