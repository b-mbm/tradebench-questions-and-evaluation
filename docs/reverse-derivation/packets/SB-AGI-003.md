# Reverse-derivation audit packet — SB-AGI-003

tier: AGI   primary_domain: Listed options strategy / Greeks   scenario_family: exercise_assignment_roll_decision

## A. WHAT THE SOLVER SEES (problem + required output)

```
Frozen market snapshot:
- Position: long 5 SPY 500 calls and short 5 SPY 510 calls expiring today.
- SPY stock price: 512.00.
- Long 500 call bid: 12.20. Short 510 call ask to close: 2.30.
- Option multiplier: 100. Cash available: 20,000 USD.
- Exercise of 5 long 500 calls would require 250,000 USD, which is unavailable.
- Assignment/exercise risk must be closed before expiration.

Task: Choose the valid expiration-day handling action and compute proceeds.

Objective: eliminate expiration exercise/assignment risk while maximizing executable cash proceeds under the cash constraint.

Output JSON fields: { "decision", "chosen_strategy", "sell_to_close_long_calls", "buy_to_close_short_calls", "net_credit_usd", "exercise_required_cash_usd", "feasibility", "rejected_routes", "self_check", "reasoning" }
```

## B. RUBRIC SCORING CONTRACT (how the answer is graded)

- pass_threshold: 0.7
- required_fields: [
  "decision",
  "chosen_strategy",
  "sell_to_close_long_calls",
  "buy_to_close_short_calls",
  "net_credit_usd",
  "exercise_required_cash_usd",
  "feasibility",
  "rejected_routes",
  "self_check"
]
- critical_fields (must be exactly correct or the row fails): [
  "sell_to_close_long_calls",
  "buy_to_close_short_calls",
  "net_credit_usd",
  "exercise_required_cash_usd",
  "feasibility"
]
- field validation specs (type/expected/tolerance/range/enum/expected_set):
```json
{
  "decision": {
    "type": "string",
    "expected": "close_spread"
  },
  "chosen_strategy": {
    "type": "string",
    "expected": "sell_long_calls_buy_short_calls"
  },
  "sell_to_close_long_calls": {
    "type": "number",
    "expected": 5,
    "tolerance": 0
  },
  "buy_to_close_short_calls": {
    "type": "number",
    "expected": 5,
    "tolerance": 0
  },
  "net_credit_usd": {
    "type": "number",
    "expected": 4950,
    "tolerance": 0
  },
  "exercise_required_cash_usd": {
    "type": "number",
    "expected": 250000,
    "tolerance": 0
  },
  "feasibility": {
    "type": "string",
    "expected": "feasible"
  },
  "rejected_routes": {
    "type": "array",
    "expected_set": [
      "exercise_long_calls_cash_unavailable",
      "let_expire_assignment_risk"
    ],
    "min_items": 2
  },
  "self_check": {
    "type": "array",
    "expected_set": [
      "cash_constraint_checked",
      "assignment_risk_removed",
      "spread_closed"
    ],
    "min_items": 3
  }
}
```
- failure_modes: [
  "chooses exercise despite insufficient cash",
  "lets spread expire with assignment risk"
]
- must_not: [
  "must_not_exercise_when_cash_unavailable",
  "must_not_leave_expiration_assignment_risk"
]

## C. CANONICAL ANSWER (the answer key — you MAY look at this)

```json
{
  "decision": "close_spread",
  "chosen_strategy": "sell_long_calls_buy_short_calls",
  "sell_to_close_long_calls": 5,
  "buy_to_close_short_calls": 5,
  "net_credit_usd": 4950,
  "exercise_required_cash_usd": 250000,
  "feasibility": "feasible",
  "rejected_routes": [
    "exercise_long_calls_cash_unavailable",
    "let_expire_assignment_risk"
  ],
  "self_check": [
    "cash_constraint_checked",
    "assignment_risk_removed",
    "spread_closed"
  ]
}
```

context.canonical_answer:
```json
null
```

## D. STATED DERIVATION

Closing spread credit = (12.20 - 2.30) * 100 * 5 = 4,950. Exercising long calls would require 500 shares * 500 = 250,000 cash, unavailable.

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
