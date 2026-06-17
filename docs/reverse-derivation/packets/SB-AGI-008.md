# Reverse-derivation audit packet — SB-AGI-008

tier: AGI   primary_domain: Listed options strategy / Greeks   scenario_family: event_vol_assignment_constrained

## A. WHAT THE SOLVER SEES (problem + required output)

```
Frozen market snapshot:
- Position: long 1,000 TSLA shares at 250.00 and short 10 TSLA 260 calls expiring in 2 days.
- TSLA current price: 258.00. Earnings event is tonight.
- Short 260 call buy-to-close ask: 7.00.
- Replacement roll: sell 10 TSLA 285 calls expiring in 32 days at 3.20 bid.
- Protective put package: buy 10 TSLA 235 puts expiring in 32 days at 4.50 ask.
- Cash available for net debit: 9,000 USD. Option multiplier: 100 shares.
- Event risk rule in this packet: do not carry short near-the-money calls through earnings unless assignment/gap risk is explicitly removed.

Task: Choose the valid event-risk adjustment under the cash constraint.

Objective: remove near-the-money short-call event risk and add downside protection with net debit <= 9,000, maximizing covered-share protection.

Output JSON fields: { "decision", "chosen_strategy", "buy_to_close_calls", "sell_to_open_calls", "buy_put_contracts", "net_debit_usd", "covered_shares", "feasibility", "rejected_routes", "self_check", "reasoning" }
```

## B. RUBRIC SCORING CONTRACT (how the answer is graded)

- pass_threshold: 0.7
- required_fields: [
  "decision",
  "chosen_strategy",
  "buy_to_close_calls",
  "sell_to_open_calls",
  "buy_put_contracts",
  "net_debit_usd",
  "covered_shares",
  "feasibility",
  "rejected_routes",
  "self_check"
]
- critical_fields (must be exactly correct or the row fails): [
  "decision",
  "chosen_strategy",
  "buy_to_close_calls",
  "sell_to_open_calls",
  "buy_put_contracts",
  "net_debit_usd",
  "covered_shares",
  "feasibility"
]
- field validation specs (type/expected/tolerance/range/enum/expected_set):
```json
{
  "decision": {
    "type": "string",
    "expected": "adjust_options"
  },
  "chosen_strategy": {
    "type": "string",
    "expected": "roll_calls_to_285_and_buy_235_puts"
  },
  "buy_to_close_calls": {
    "type": "number",
    "expected": 10,
    "tolerance": 0
  },
  "sell_to_open_calls": {
    "type": "number",
    "expected": 10,
    "tolerance": 0
  },
  "buy_put_contracts": {
    "type": "number",
    "expected": 10,
    "tolerance": 0
  },
  "net_debit_usd": {
    "type": "number",
    "expected": 8300,
    "tolerance": 0
  },
  "covered_shares": {
    "type": "number",
    "expected": 1000,
    "tolerance": 0
  },
  "feasibility": {
    "type": "string",
    "expected": "feasible"
  },
  "rejected_routes": {
    "type": "array",
    "expected_set": [
      "hold_260_calls_through_earnings",
      "buy_puts_without_closing_short_calls",
      "full_call_close_plus_puts_without_roll_costs_11500"
    ],
    "min_items": 3
  },
  "self_check": {
    "type": "array",
    "expected_set": [
      "event_call_risk_removed",
      "downside_puts_added",
      "net_debit_within_cash"
    ],
    "min_items": 3
  }
}
```
- failure_modes: [
  "holds near-the-money short calls through earnings",
  "adds puts without removing call risk",
  "exceeds cash"
]
- must_not: [
  "must_not_hold_near_money_short_calls_through_event",
  "must_not_exceed_net_debit_limit"
]

## C. CANONICAL ANSWER (the answer key — you MAY look at this)

```json
{
  "decision": "adjust_options",
  "chosen_strategy": "roll_calls_to_285_and_buy_235_puts",
  "buy_to_close_calls": 10,
  "sell_to_open_calls": 10,
  "buy_put_contracts": 10,
  "net_debit_usd": 8300,
  "covered_shares": 1000,
  "feasibility": "feasible",
  "rejected_routes": [
    "hold_260_calls_through_earnings",
    "buy_puts_without_closing_short_calls",
    "full_call_close_plus_puts_without_roll_costs_11500"
  ],
  "self_check": [
    "event_call_risk_removed",
    "downside_puts_added",
    "net_debit_within_cash"
  ]
}
```

context.canonical_answer:
```json
null
```

## D. STATED DERIVATION

Close 260 calls costs 7,000; sell 285 calls receives 3,200; buy 235 puts costs 4,500. Net debit = 8,300, within 9,000, and covers 1,000 shares.

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
