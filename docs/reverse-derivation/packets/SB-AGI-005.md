# Reverse-derivation audit packet — SB-AGI-005

tier: AGI   primary_domain: Portfolio risk / rebalancing   scenario_family: multi_asset_drawdown_hedge

## A. WHAT THE SOLVER SEES (problem + required output)

```
Frozen market snapshot:
- Objective: reduce 1-day stress loss by at least 100,000 USD before the close.
- Cash available for hedges: 30,000 USD. Futures margin capacity: 20,000 USD.
- Action A: buy SPY put package, stress-loss reduction 120,000 USD, premium 25,000 USD, margin 0.
- Action B: sell 2 ES futures, stress-loss reduction 100,000 USD, cost 50 USD, margin 26,000 USD.
- Action C: sell HYG block, stress-loss reduction 45,000 USD, cost 300 USD, margin 0.
- Action D: sell 1 ES future plus sell HYG block, stress-loss reduction 95,000 USD, cost 325 USD, margin 13,000 USD.

Task: Select the feasible action set that satisfies the stress-loss target with the lowest valid cash cost.

Objective: minimize cash cost subject to stress_loss_reduction_usd >= 100,000, hedge_cash <= 30,000, and margin_used <= 20,000.

Output JSON fields: { "decision", "chosen_strategy", "stress_loss_reduction_usd", "hedge_cash_used", "margin_used", "feasibility", "rejected_routes", "self_check", "reasoning" }
```

## B. RUBRIC SCORING CONTRACT (how the answer is graded)

- pass_threshold: 0.7
- required_fields: [
  "decision",
  "chosen_strategy",
  "stress_loss_reduction_usd",
  "hedge_cash_used",
  "margin_used",
  "feasibility",
  "rejected_routes",
  "self_check"
]
- critical_fields (must be exactly correct or the row fails): [
  "decision",
  "chosen_strategy",
  "stress_loss_reduction_usd",
  "hedge_cash_used",
  "margin_used",
  "feasibility"
]
- field validation specs (type/expected/tolerance/range/enum/expected_set):
```json
{
  "decision": {
    "type": "string",
    "expected": "hedge"
  },
  "chosen_strategy": {
    "type": "string",
    "expected": "buy_SPY_put_package"
  },
  "stress_loss_reduction_usd": {
    "type": "number",
    "expected": 120000,
    "tolerance": 0
  },
  "hedge_cash_used": {
    "type": "number",
    "expected": 25000,
    "tolerance": 0
  },
  "margin_used": {
    "type": "number",
    "expected": 0,
    "tolerance": 0
  },
  "feasibility": {
    "type": "string",
    "expected": "feasible"
  },
  "rejected_routes": {
    "type": "array",
    "expected_set": [
      "sell_2_ES_margin_exceeded",
      "sell_HYG_block_fails_target",
      "sell_1_ES_plus_HYG_fails_target"
    ],
    "min_items": 3
  },
  "self_check": {
    "type": "array",
    "expected_set": [
      "stress_reduction_target_met",
      "cash_within_limit",
      "margin_within_limit"
    ],
    "min_items": 3
  }
}
```
- failure_modes: [
  "chooses margin-infeasible futures",
  "chooses cheaper but insufficient hedge"
]
- must_not: [
  "must_not_miss_stress_reduction_target",
  "must_not_exceed_margin_capacity"
]

## C. CANONICAL ANSWER (the answer key — you MAY look at this)

```json
{
  "decision": "hedge",
  "chosen_strategy": "buy_SPY_put_package",
  "stress_loss_reduction_usd": 120000,
  "hedge_cash_used": 25000,
  "margin_used": 0,
  "feasibility": "feasible",
  "rejected_routes": [
    "sell_2_ES_margin_exceeded",
    "sell_HYG_block_fails_target",
    "sell_1_ES_plus_HYG_fails_target"
  ],
  "self_check": [
    "stress_reduction_target_met",
    "cash_within_limit",
    "margin_within_limit"
  ]
}
```

context.canonical_answer:
```json
null
```

## D. STATED DERIVATION

The SPY put package is the only listed action that reaches at least 100,000 stress reduction while staying within cash and margin constraints.

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
