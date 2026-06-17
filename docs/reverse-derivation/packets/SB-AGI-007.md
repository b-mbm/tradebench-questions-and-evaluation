# Reverse-derivation audit packet — SB-AGI-007

tier: AGI   primary_domain: Futures / commodities / spreads / rolls   scenario_family: commodity_roll_basis_hedge

## A. WHAT THE SOLVER SEES (problem + required output)

```
Frozen market snapshot:
- Position: long 5 CL June futures contracts.
- First notice day is tomorrow; account policy forbids holding physically deliverable long CL into first notice.
- Desired post-trade exposure: stay long 5 CL-equivalent contracts in July.
- CL multiplier: 1,000 barrels.
- June executable bid: 77.90. July executable ask: 78.40.
- Alternative: sell June and buy August at 79.10 ask, but August basis risk penalty is fixed at 1,500 USD.
- Fee: 4 USD per contract per leg.

Task: Choose the valid roll that avoids delivery risk and minimizes total roll cost plus stated basis penalty.

Objective: minimize total_cost_usd while eliminating June first-notice risk and preserving 5-contract long CL exposure.

Output JSON fields: { "decision", "chosen_strategy", "sell_contract", "buy_contract", "contracts", "roll_cost_usd", "basis_penalty_usd", "total_cost_usd", "feasibility", "rejected_routes", "self_check", "reasoning" }
```

## B. RUBRIC SCORING CONTRACT (how the answer is graded)

- pass_threshold: 0.7
- required_fields: [
  "decision",
  "chosen_strategy",
  "sell_contract",
  "buy_contract",
  "contracts",
  "roll_cost_usd",
  "basis_penalty_usd",
  "total_cost_usd",
  "feasibility",
  "rejected_routes",
  "self_check"
]
- critical_fields (must be exactly correct or the row fails): [
  "decision",
  "chosen_strategy",
  "contracts",
  "roll_cost_usd",
  "basis_penalty_usd",
  "total_cost_usd",
  "feasibility"
]
- field validation specs (type/expected/tolerance/range/enum/expected_set):
```json
{
  "decision": {
    "type": "string",
    "expected": "roll"
  },
  "chosen_strategy": {
    "type": "string",
    "expected": "sell_June_buy_July"
  },
  "sell_contract": {
    "type": "string",
    "expected": "CL_June"
  },
  "buy_contract": {
    "type": "string",
    "expected": "CL_July"
  },
  "contracts": {
    "type": "number",
    "expected": 5,
    "tolerance": 0
  },
  "roll_cost_usd": {
    "type": "number",
    "expected": 2500,
    "tolerance": 0
  },
  "basis_penalty_usd": {
    "type": "number",
    "expected": 0,
    "tolerance": 0
  },
  "total_cost_usd": {
    "type": "number",
    "expected": 2540,
    "tolerance": 0
  },
  "feasibility": {
    "type": "string",
    "expected": "feasible"
  },
  "rejected_routes": {
    "type": "array",
    "expected_set": [
      "hold_June_delivery_risk",
      "roll_to_August_higher_total_cost"
    ],
    "min_items": 2
  },
  "self_check": {
    "type": "array",
    "expected_set": [
      "first_notice_risk_removed",
      "exposure_preserved",
      "cost_includes_fees"
    ],
    "min_items": 3
  }
}
```
- failure_modes: [
  "holds into delivery risk",
  "misses basis penalty",
  "omits fees"
]
- must_not: [
  "must_not_hold_physically_deliverable_long_into_first_notice"
]

## C. CANONICAL ANSWER (the answer key — you MAY look at this)

```json
{
  "decision": "roll",
  "chosen_strategy": "sell_June_buy_July",
  "sell_contract": "CL_June",
  "buy_contract": "CL_July",
  "contracts": 5,
  "roll_cost_usd": 2500,
  "basis_penalty_usd": 0,
  "total_cost_usd": 2540,
  "feasibility": "feasible",
  "rejected_routes": [
    "hold_June_delivery_risk",
    "roll_to_August_higher_total_cost"
  ],
  "self_check": [
    "first_notice_risk_removed",
    "exposure_preserved",
    "cost_includes_fees"
  ]
}
```

context.canonical_answer:
```json
null
```

## D. STATED DERIVATION

July roll cost = (78.40 - 77.90) * 1,000 * 5 = 2,500. Fees = 5 * 2 * 4 = 40. Total = 2,540, below August after basis penalty.

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
