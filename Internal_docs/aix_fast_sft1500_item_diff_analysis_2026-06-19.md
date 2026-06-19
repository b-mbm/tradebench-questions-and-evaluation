# AIX-fast SFT1500 vs Together Base 9B Item Diff

Generated: 2026-06-19T18:06:25.968Z

Base file: `results/community/300/base-together-9b-300-clean-2026-06-19.json`

Tuned file: `results/community/300/aix-fast-sft1500-300-2026-06-19T17-47-20-697Z.json`

## Headline

Both models scored **124/300**, but they did not pass the same items.

- Both pass: **92**
- Tuned-only wins: **32**
- Base-only regressions: **32**
- Both fail: **144**

Interpretation: this SFT changed behavior but did not create a net capability jump. It strongly reduced missing-field failures, while adding exactness and strategy regressions elsewhere.

## Flip Matrix By Tier

| Tier |Both pass |Tuned only |Base only |Both fail |Total |
| --- |--- |--- |--- |--- |--- |
| AGI |4 |5 |2 |99 |110 |
| L1 |3 |0 |0 |0 |3 |
| L2 |2 |0 |0 |2 |4 |
| L3 |1 |0 |0 |2 |3 |
| L4 |0 |0 |1 |4 |5 |
| L5 |1 |1 |1 |2 |5 |
| L6 |2 |1 |1 |1 |5 |
| L7 |2 |1 |0 |2 |5 |
| L8 |6 |0 |2 |2 |10 |
| L9 |41 |15 |10 |15 |81 |
| L10 |30 |9 |15 |15 |69 |

## Flip-Heavy Rubrics

| Rubric |Tuned only |Base only |Both pass |Both fail |Total |
| --- |--- |--- |--- |--- |--- |
| lending_borrow |1 |1 |0 |1 |3 |
| agi-AGI-030 |1 |0 |0 |0 |1 |
| agi-AGI-058 |1 |0 |0 |0 |1 |
| agi-AGI-065 |1 |0 |0 |0 |1 |
| agi-AGI-083 |1 |0 |0 |0 |1 |
| agi-AGI-092 |1 |0 |0 |0 |1 |
| liquidity_provision |1 |0 |1 |0 |2 |
| futures_trade |1 |0 |1 |0 |2 |
| l9-L9-001 |1 |0 |0 |0 |1 |
| l9-L9-015 |1 |0 |0 |0 |1 |
| l9-L9-016 |1 |0 |0 |0 |1 |
| l9-L9-022 |1 |0 |0 |0 |1 |
| l9-L9-031 |1 |0 |0 |0 |1 |
| l9-L9-036 |1 |0 |0 |0 |1 |
| l9-L9-037 |1 |0 |0 |0 |1 |
| l9-L9-038 |1 |0 |0 |0 |1 |
| l9-L9-039 |1 |0 |0 |0 |1 |
| l9-L9-045 |1 |0 |0 |0 |1 |
| l9-L9-047 |1 |0 |0 |0 |1 |
| l9-L9-058 |1 |0 |0 |0 |1 |

## Failure Reason Shift

### Base, All Failures

| Grouped reason |Count |
| --- |--- |
| agi_field_exactness |210 |
| task_schema_or_strategy |208 |
| missing_field |114 |
| self_check |75 |
| venue_or_route |43 |
| numeric_exactness |42 |
| field_name_mismatch |11 |
| size_mismatch |2 |
| correlation_invalid_order_type |1 |
| stress_test_invalid_size |1 |
| options_missing_call_type |1 |
| l7_001_asset_must_be_multi_or_generic |1 |

### Tuned, All Failures

| Grouped reason |Count |
| --- |--- |
| agi_field_exactness |240 |
| task_schema_or_strategy |224 |
| self_check |86 |
| numeric_exactness |49 |
| venue_or_route |38 |
| field_name_mismatch |16 |
| missing_field |11 |
| size_mismatch |1 |
| stress_test_invalid_order_type |1 |
| leverage_invalid_order_type |1 |
| options_missing_call_type |1 |
| twap_missing_duration_autofail |1 |

### What Tuned Fixed

These are base failure reasons on rows that tuned passed.

| Base failure reason before tuned win |Count |
| --- |--- |
| missing_field |19 |
| numeric_exactness |15 |
| task_schema_or_strategy |8 |
| field_name_mismatch |6 |
| agi_field_exactness |4 |
| size_mismatch |2 |
| venue_or_route |1 |
| self_check |1 |

### What Tuned Broke

These are tuned failure reasons on rows that base passed.

| Tuned failure reason after regression |Count |
| --- |--- |
| numeric_exactness |21 |
| field_name_mismatch |11 |
| agi_field_exactness |8 |
| task_schema_or_strategy |4 |
| self_check |2 |
| twap_missing_duration_autofail |1 |

## Item Lists

Tuned-only wins:

`AGI-030`, `AGI-058`, `AGI-065`, `AGI-083`, `AGI-092`, `L5-001`, `L6-002`, `L7-002`, `L9-001`, `L9-015`, `L9-016`, `L9-022`, `L9-031`, `L9-036`, `L9-037`, `L9-038`, `L9-039`, `L9-045`, `L9-047`, `L9-058`, `L9-067`, `L9-077`, `L9-079`, `L10-001`, `L10-002`, `L10-017`, `L10-023`, `L10-026`, `L10-034`, `L10-049`, `L10-055`, `L10-060`

Base-only regressions:

`AGI-063`, `AGI-108`, `L4-001`, `L5-004`, `L6-005`, `L8-002`, `L8-004`, `L9-007`, `L9-023`, `L9-024`, `L9-034`, `L9-042`, `L9-051`, `L9-052`, `L9-056`, `L9-068`, `L9-069`, `L10-006`, `L10-008`, `L10-013`, `L10-016`, `L10-019`, `L10-032`, `L10-045`, `L10-050`, `L10-052`, `L10-057`, `L10-058`, `L10-062`, `L10-064`, `L10-067`, `L10-069`

## Representative Rows

### AGI-030 (tunedOnly, agi-AGI-030)

Prompt: Stable yield holdout. Allocate $100,000 for 90 days across five protocol venues with APY, tail-loss, cap, and exit-window differences.

Venue signals after tail losses and hedge drag: Aave_USDC: cap 20000, net APY signal 7.04%, 48h-liquid; Curve_3pool: cap 30000, net APY signal 8.14%, 48h-liquid; Ethena_USDe: cap 20000, net APY signal 9.24%, term/slow-exit; GMX_GLP: cap 30000, net APY signal 10.34%, term/slow-exit; a fifth uncapped-looking venue has lower net APY and enters a redemption queue ab...

Expected values:

```json
{}
```

Rubric canonical / validation:

```json
{
  "id": "AGI-030",
  "title": "OOD Composite Risk: Stable Yield Holdout",
  "archetype": "tail-adjusted-protocol-allocation",
  "validation": {
    "intent": {
      "type": "string",
      "expected": "tail_adjusted_protocol_allocation"
    },
    "chosen_strategy": {
      "type": "string",
      "expected": "liquid_capped_tail_barbell"
    },
    "expected_net_apy_pct": {
      "type": "number",
      "range": [
        8.49,
        8.889999999999999
      ]
    },
    "expected_90d_profit_usd": {
      "type": "number",
      "range": [
        2067,
        2217
      ]
    },
    "liquidity_48h_usd": {
      "type": "number",
      "range": [
        49750,
        50250
      ]
    },
    "allocation_usd.Aave_USDC": {
      "type": "number",
      "range": [
        19850,
        20150
      ]
    },
    "allocation_usd.Curve_3pool": {
      "type": "number",
      "range": [
        29850,
        30150
      ]
    },
    "allocation_usd.Ethena_USDe": {
      "type": "number",
      "range": [
        19850,
        20150
      ]
    },
    "allocation_usd.GMX_GLP": {
      "type": "number",
      "range": [
        29850,
        30150
      ]
    }
  },
  "derivation": "Caps, liquidity, and queue thresholds force {\"Aave_USDC\":20000,\"Curve_3pool\":30000,\"Ethena_USDe\":20000,\"GMX_GLP\":30000}. Weighted net APY is 8.69% and 90-day profit is 2142.",
  "pass_condition": "All required strategy fields must match and all numeric fields must fall inside tolerance/range."
}
```

Base: pass=false, score=0.667, failures=agi_validation_failed:intent|agi_validation_failed:chosen_strategy|agi_validation_failed:expected_90d_profit_usd

```json
{
  "intent": "allocate",
  "chosen_strategy": "risk_adjusted_yield_allocation",
  "allocation_usd": {
    "Aave_USDC": 20000,
    "Curve_3pool": 30000,
    "Ethena_USDe": 20000,
    "GMX_GLP": 30000
  },
  "expected_net_apy_pct": 8.695,
  "expected_90d_profit_usd": 1274.25,
  "liquidity_48h_usd": 50000,
  "reasoning": "Allocated $50k to liquid venues (Aave 20k@7.04% + Curve 30k@8.14%) meeting 50% 48h liquidity requirement. Remaining $50k to higher-yield term venues (Ethena 20k@9.24% + GMX 30k@10.34%). Weighted APY = (20k×7.04 + 30k×8.14 + 20k×9.24 + 30k×10.34)/100k = 8.695%. 90d profit = 100k×8.695%×90/365 = $1,274.25. Excluded fifth venue due to redemption queue risk."
}
```

Tuned: pass=true, score=0.778, failures=agi_validation_failed:intent|agi_validation_failed:chosen_strategy

```json
{"intent":"yield_allocation","chosen_strategy":"maximize_yield_within_48h_liquidity_constraint","allocation_usd":{"Aave_USDC":20000,"Curve_3pool":30000,"Ethena_USDe":20000,"GMX_GLP":30000},"expected_net_apy_pct":8.7,"expected_90d_profit_usd":2156.16,"liquidity_48h_usd":50000,"reasoning":"Fill highest APY term venues first within caps: GMX_GLP 30000 (10.34%), Ethena_USDe 20000 (9.24%), Curve_3pool 30000 (8.14%), Aave_USDC 20000 (7.04%). Weighted APY=8.70%. 90d profit=100000*0.0870*90/365=2156.16. Liquid 48h: Aave 20000+Curve 30000=50000, meeting the half-capital requirement. Fifth venue excluded due to redemption queue risk.","self_check":"Re-deriving via cap-constrained greedy fill: caps sum to 100000 exactly. Highest yield first: GMX_GLP 30000*10.34%=3102, Ethena 20000*9.24%=1848, Curve 30000*8.14%=2442, Aave 20000*7.04%=1408. Total annual yield=8800. 90d=8800*90/365=2156.16. Confirmed....
```

### AGI-058 (tunedOnly, agi-AGI-058)

Prompt: A taxpayer has $60,000 of realized short-term gains and several crypto lots with losses. They must stay fully invested without buying the same ticker inside 30 days. A market maker widens later exits if the thinnest loss lot is left until after deeper lots have traded.

Raw lot primitives:
- DOGE: unrealized loss $20,000, current value $60,000, exit-depth score 0.6, replacement basket MEME_largecap_basket.
- OP: unrealized loss $12,000, current value $80,000, exit-depth score 0.9, replacement ba...

Expected values:

```json
{}
```

Rubric canonical / validation:

```json
{
  "id": "AGI-058",
  "title": "December Harvest B Rebuild",
  "bar": "Autonomous Strategy Synthesis with self-verifying reasoning; strategy is not disclosed in prompt",
  "validation": {
    "intent": {
      "type": "string",
      "expected": "tax_loss_harvest_strategy"
    },
    "chosen_strategy": {
      "type": "string",
      "expected": "thin_first_full_loss_harvest"
    },
    "assets_to_sell": {
      "type": "array",
      "expected_set": [
        "DOGE",
        "OP",
        "AVAX"
      ],
      "match_type": "exact_set"
    },
    "sale_sequence": {
      "type": "array",
      "expected_order": [
        "DOGE",
        "OP",
        "AVAX"
      ]
    },
    "net_tax_benefit": {
      "type": "number",
      "range": [
        16000,
        16160
      ]
    },
    "remaining_unoffset_gains": {
      "type": "number",
      "range": [
        11900,
        12100
      ]
    },
    "self_check": {
      "type": "array",
      "expected_order": [
        "all_loss_lots_reconciled",
        "thin_first_sequence_preserved",
        "tax_benefit_net_of_costs"
      ]
    },
    "replacement_assets.DOGE": {
      "type": "string",
      "expected": "MEME_largecap_basket"
    },
    "replacement_assets.OP": {
      "type": "string",
      "expected": "ARB_IMX_basket"
    },
    "replacement_assets.AVAX": {
      "type": "string",
      "expected": "TIA_ATOM_basket"
    }
  },
  "derivation": "All listed loss lots are below realized gains in aggregate, so harvesting them preserves tax value while replacements maintain exposure. Thin-first sequence is DOGE -> OP -> AVAX. Net benefit is 48000*37% - 280000*0.60% = 16080, with 12000 remaining unoffset gains. Self-check verifies lot selection, sequence, and tax arithmetic.",
  "pass_condition": "All required strategy fields must match and all numeric fields must fall inside tolerance/range."
}
```

Base: pass=false, score=0.000, failures=agi_validation_failed:intent|missing_field|missing_field|missing_field|missing_field|missing_field|missing_field|missing_field|missing_field|missing_field

```json
{
  "intent": "sell",
  "order_type": "market",
  "asset": "DOGE,OP,AVAX",
  "size": 48000,
  "unit": "usd",
  "venue": "exchange",
  "risk_controls": {
    "slippage_tolerance": "0.60%",
    "position_size_limit": "48000"
  },
  "follow_up": "confirm wash sale compliance",
  "reasoning": "Tax loss harvesting: Sell all 3 loss lots ($48k total) to offset $48k of $60k short-term gains. Net tax benefit = $48,000 × 37% - $48,000 × 0.60% = $17,472. Remaining unoffset gains = $12,000. Sale sequence prioritizes lowest exit-depth first (DOGE 0.6 → OP 0.9 → AVAX 2.5) to avoid market maker widening. Replacements: DOGE→MEME_largecap_basket, OP→ARB_IMX_basket, AVAX→TIA_ATOM_basket to maintain broad beta without same-ticker wash sale violation."
}
```

Tuned: pass=true, score=0.700, failures=agi_validation_failed:intent|agi_validation_failed:chosen_strategy|agi_validation_failed:self_check

```json
{"intent":"tax_loss_harvest","chosen_strategy":"sell_all_loss_lots_first_in_liquidity_order","assets_to_sell":["DOGE","OP","AVAX"],"sale_sequence":["DOGE","OP","AVAX"],"replacement_assets":{"DOGE":"MEME_largecap_basket","OP":"ARB_IMX_basket","AVAX":"TIA_ATOM_basket"},"net_tax_benefit":16080,"remaining_unoffset_gains":12000,"self_check":"Total losses $48,000 × 37% = $17,760 tax benefit; round-trip cost $280,000 × 0.60% = $1,680; net $16,080. Remaining gains $60,000 - $48,000 = $12,000. Reinvested in non-identical baskets per wash-sale rule.","reasoning":"Sell all three loss lots in liquidity order (DOGE 0.6, OP 0.9, AVAX 2.5) to minimize slippage on the thinnest lot. Total losses $48,000 offset $48,000 of $60,000 short-term gains. Net tax benefit after 0.60% round-trip cost: $17,760 - $1,680 = $16,080. Remaining $12,000 gains taxed at 37%. Replacements preserve beta without violating wash...
```

### AGI-063 (baseOnly, agi-AGI-063)

Prompt: Convert $2,000,000 USDC into ETH before an announcement window. Visible overuse of any route is copied by searchers and repriced worse than the next venue; private/OTC routes do not create a public pre-fill graph.

Raw venue primitives:
- Kraken: usable clip $500,000, quoted price $2992, fee 0.07%, fixed cost $40, publicly visible before completion.
- Uniswap_Arbitrum: usable clip $450,000, quoted price $2996, fee 0.10%, fixed cost $120, private before completion.
- Curve_ETH: usable clip $400,0...

Expected values:

```json
{}
```

Rubric canonical / validation:

```json
{
  "id": "AGI-063",
  "title": "ETH Buy Router Rebuild",
  "bar": "Autonomous Strategy Synthesis with self-verifying reasoning; strategy is not disclosed in prompt",
  "validation": {
    "intent": {
      "type": "string",
      "expected": "adversarial_multi_venue_acquisition"
    },
    "chosen_strategy": {
      "type": "string",
      "expected": "capacity_capped_private_public_router"
    },
    "largest_visible_clip_usd": {
      "type": "number",
      "range": [
        495000,
        505000
      ]
    },
    "expected_asset_received": {
      "type": "number",
      "range": [
        665.2126989377251,
        667.8788820998001
      ]
    },
    "effective_price": {
      "type": "number",
      "range": [
        2994.5429532253784,
        3006.545129390611
      ]
    },
    "self_check": {
      "type": "array",
      "expected_order": [
        "full_notional_allocated",
        "visible_clip_below_copy_threshold",
        "received_and_effective_price_reconcile"
      ]
    },
    "venue_allocation_usd.Kraken": {
      "type": "number",
      "range": [
        495000,
        505000
      ]
    },
    "venue_allocation_usd.Uniswap_Arbitrum": {
      "type": "number",
      "range": [
        445500,
        454500
      ]
    },
    "venue_allocation_usd.Curve_ETH": {
      "type": "number",
      "range": [
        396000,
        404000
      ]
    },
    "venue_allocation_usd.Binance": {
      "type": "number",
      "range": [
        346500,
        353500
      ]
    },
    "venue_allocation_usd.Velodrome_Optimism": {
      "type": "number",
      "range": [
        297000,
        303000
      ]
    }
  },
  "derivation": "Selected clips sum to $2000000. Asset received is sum((allocation-fixed)*(1-fee)/price) = 666.545791 ETH, giving effective price 3000.544041. Largest visible public clip is $500000. Self-check verifies notional allocation, visible-clip constraint, and received/effective-price arithmetic.",
  "pass_condition": "All required strategy fields must match and all numeric fields must fall inside tolerance/range."
}
```

Base: pass=true, score=0.727, failures=agi_validation_failed:intent|agi_validation_failed:chosen_strategy|agi_validation_failed:self_check

```json
{
  "intent": "buy",
  "chosen_strategy": "private_first_allocation",
  "venue_allocation_usd": {
    "Kraken": 500000,
    "Uniswap_Arbitrum": 450000,
    "Curve_ETH": 400000,
    "Binance": 350000,
    "Velodrome_Optimism": 300000
  },
  "largest_visible_clip_usd": 500000,
  "expected_asset_received": 666.529,
  "effective_price": 2999.12,
  "self_check": "total_allocation_2M_verified",
  "reasoning": "Allocate $2M across 5 venues using private routes first (Uniswap $450K, Curve $400K, Velodrome $300K) to avoid market impact, then public routes (Kraken $500K, Binance $350K) at their clip limits. Largest visible clip $500K on Kraken stays within absorption capacity. ETH received calculated per venue after fixed costs and percentage fees: Kraken 166.982, Uniswap 149.993, Curve 133.286, Binance 116.548, Velodrome 99.720 = 666.529 ETH total. Effective price $2,000,000/666.529 = $2,999.12."...
```

Tuned: pass=false, score=0.545, failures=agi_validation_failed:intent|agi_validation_failed:chosen_strategy|agi_validation_failed:expected_asset_received|agi_validation_failed:effective_price|agi_validation_failed:self_check

```json
{"intent":"buy","chosen_strategy":"fill_private_first_then_public","venue_allocation_usd":{"Kraken":500000,"Uniswap_Arbitrum":450000,"Curve_ETH":400000,"Binance":350000,"Velodrome_Optimism":300000},"largest_visible_clip_usd":500000,"expected_asset_received":14977.45,"effective_price":133.53,"self_check":"Recomputed each figure from the prompt inputs; values reproduce.","reasoning":"Fill private venues first (Uniswap_Arbitrum 450k, Curve_ETH 400k, Velodrome_Optimism 300k) then public (Kraken 500k, Binance 350k). Largest visible clip = Kraken 500k. ETH per venue after fees: Kraken 2,989.66, Uniswap_Arbitrum 2,992.22, Curve_ETH 2,995.02, Binance 3,000.96, Velodrome_Optimism 2,999.59; total 14,977.45 ETH. Effective price = 2,000,000/14,977.45 = 133.53.","venue":"cex","venue_name":"Kraken"}
```

### AGI-065 (tunedOnly, agi-AGI-065)

Prompt: Convert $2,000,000 USDC into SOL before an announcement window. Visible overuse of any route is copied by searchers and repriced worse than the next venue; private/OTC routes do not create a public pre-fill graph.

Raw venue primitives:
- Binance: usable clip $550,000, quoted price $149.7, fee 0.06%, fixed cost $30, publicly visible before completion.
- Jupiter_Solana: usable clip $450,000, quoted price $149.8, fee 0.10%, fixed cost $80, private before completion.
- Uniswap_Arbitrum: usable clip...

Expected values:

```json
{}
```

Rubric canonical / validation:

```json
{
  "id": "AGI-065",
  "title": "SOL Buy Router Rebuild",
  "bar": "Autonomous Strategy Synthesis with self-verifying reasoning; strategy is not disclosed in prompt",
  "validation": {
    "intent": {
      "type": "string",
      "expected": "adversarial_multi_venue_acquisition"
    },
    "chosen_strategy": {
      "type": "string",
      "expected": "capacity_capped_private_public_router"
    },
    "largest_visible_clip_usd": {
      "type": "number",
      "range": [
        544500,
        555500
      ]
    },
    "expected_asset_received": {
      "type": "number",
      "range": [
        13300.103933152865,
        13353.41096294506
      ]
    },
    "effective_price": {
      "type": "number",
      "range": [
        149.77386718268923,
        150.37416324354172
      ]
    },
    "self_check": {
      "type": "array",
      "expected_order": [
        "full_notional_allocated",
        "visible_clip_below_copy_threshold",
        "received_and_effective_price_reconcile"
      ]
    },
    "venue_allocation_usd.Binance": {
      "type": "number",
      "range": [
        544500,
        555500
      ]
    },
    "venue_allocation_usd.Jupiter_Solana": {
      "type": "number",
      "range": [
        445500,
        454500
      ]
    },
    "venue_allocation_usd.Uniswap_Arbitrum": {
      "type": "number",
      "range": [
        346500,
        353500
      ]
    },
    "venue_allocation_usd.OTC_Circle": {
      "type": "number",
      "range": [
        346500,
        353500
      ]
    },
    "venue_allocation_usd.Coinbase": {
      "type": "number",
      "range": [
        297000,
        303000
      ]
    }
  },
  "derivation": "Selected clips sum to $2000000. Asset received is sum((allocation-fixed)*(1-fee)/price) = 13326.757448 SOL, giving effective price 150.074015. Largest visible public clip is $550000. Self-check verifies notional allocation, visible-clip constraint, and received/effective-price arithmetic.",
  "pass_condition": "All required strategy fields must match and all numeric fields must fall inside tolerance/range."
}
```

Base: pass=false, score=0.000, failures=agi_validation_failed:intent|missing_field|missing_field|missing_field|missing_field|missing_field|missing_field|missing_field|missing_field|missing_field|missing_field

```json
{
  "intent": "buy",
  "order_type": "multi_venue",
  "asset": "SOL",
  "size": 2000000,
  "unit": "usd",
  "price": "weighted_average",
  "venue": "multi_venue",
  "venue_name": "aggregated",
  "risk_controls": {
    "slippage_tolerance": "0.5%",
    "max_gas": "40 gwei"
  },
  "follow_up": "monitor fills",
  "reasoning": "Allocated $2M across 5 venues prioritizing private routes first. Jupiter_Solana ($450k) and Uniswap_Arbitrum ($350k) are private to avoid market impact. Public routes (Binance $550k, OTC_Circle $350k, Coinbase $300k) stay within visible clip limits. Total fees ~$1,580. Effective price ~$150.07/SOL. Largest visible clip $550k on Binance won't trigger copy-trading repricing."
}
```

Tuned: pass=true, score=0.727, failures=agi_validation_failed:intent|agi_validation_failed:chosen_strategy|agi_validation_failed:self_check

```json
{"intent":"buy","chosen_strategy":"split across private and public venues, max visible clip at Binance $550,000","venue_allocation_usd":{"Binance":550000,"Jupiter_Solana":450000,"Uniswap_Arbitrum":350000,"OTC_Circle":350000,"Coinbase":300000},"largest_visible_clip_usd":550000,"expected_asset_received":13326.73,"effective_price":150.07,"self_check":"Recomputed each figure from the prompt inputs; values reproduce.","reasoning":"Fill private routes first (Jupiter_Solana $450,000, Uniswap_Arbitrum $350,000), then public routes up to their clips (Binance $550,000, OTC_Circle $350,000, Coinbase $300,000). Largest visible clip is Binance at $550,000. Net SOL per venue after fixed+percentage fees: Jupiter 3,000.47, Uniswap 2,329.87, Binance 3,671.61, OTC 2,329.90, Coinbase 1,994.88; total 13,326.73 SOL. Effective price = 2,000,000/13,326.73 = $150.07."}
```

### AGI-083 (tunedOnly, agi-AGI-083)

Prompt: Convert $2,850,000 USDC into JUP during a pre-announcement liquidity window. Public route overuse is copied by searchers and repriced before completion; private routes do not create a public pre-fill graph. No spot inventory may be used to offset the acquisition.

Current JUP mid is $0.91. Venue primitives:
- Jupiter_Solana: usable clip $700,000, quoted price $0.91, fee 0.10%, fixed cost $90, private before completion
- Binance: usable clip $650,000, quoted price $0.91, fee 0.06%, fixed cost $35...

Expected values:

```json
{}
```

Rubric canonical / validation:

```json
{
  "id": "AGI-083",
  "title": "JUP Announcement Router",
  "bar": "Autonomous Strategy Synthesis with self-verifying reasoning; strategy is not disclosed in prompt",
  "validation": {
    "intent": {
      "type": "string",
      "expected": "adversarial_multi_venue_acquisition"
    },
    "chosen_strategy": {
      "type": "string",
      "expected": "visibility_capped_best_execution_router"
    },
    "largest_visible_clip_usd": {
      "type": "number",
      "range": [
        638720,
        641280
      ]
    },
    "expected_asset_received": {
      "type": "number",
      "range": [
        3103714.551227,
        3116154.288907
      ]
    },
    "effective_price": {
      "type": "number",
      "range": [
        0.914585,
        0.918251
      ]
    },
    "self_check": {
      "type": "array",
      "expected_order": [
        "full_notional_allocated",
        "visible_clip_below_copy_threshold",
        "received_and_effective_price_reconcile"
      ]
    },
    "venue_allocation_usd.Jupiter_Solana": {
      "type": "number",
      "range": [
        698600,
        701400
      ]
    },
    "venue_allocation_usd.Binance": {
      "type": "number",
      "range": [
        638720,
        641280
      ]
    },
    "venue_allocation_usd.OKX": {
      "type": "number",
      "range": [
        499000,
        501000
      ]
    },
    "venue_allocation_usd.Wintermute_RFQ": {
      "type": "number",
      "range": [
        548900,
        551100
      ]
    },
    "venue_allocation_usd.Orca": {
      "type": "number",
      "range": [
        299400,
        300600
      ]
    },
    "venue_allocation_usd.Coinbase": {
      "type": "number",
      "range": [
        159680,
        160320
      ]
    }
  },
  "derivation": "Filled venues in visibility-capped best-execution order. Allocations sum to 2850000; received 3109934.42006689 JUP; effective price 0.916418038; largest visible clip 640000.",
  "pass_condition": "All required strategy fields must match and all numeric fields must fall inside tolerance/range."
}
```

Base: pass=false, score=0.500, failures=agi_validation_failed:intent|agi_validation_failed:chosen_strategy|agi_validation_failed:venue_allocation_usd.Coinbase|agi_validation_failed:expected_asset_received|agi_validation_failed:effective_price|agi_validation_failed:self_check

```json
{
  "intent": "buy",
  "chosen_strategy": "split_private_public",
  "venue_allocation_usd": {
    "Jupiter_Solana": 700000,
    "Binance": 640000,
    "OKX": 500000,
    "Wintermute_RFQ": 550000,
    "Orca": 300000,
    "Coinbase": 350000
  },
  "largest_visible_clip_usd": 640000,
  "expected_asset_received": 3312756.56,
  "effective_price": 0.8603,
  "self_check": "total_allocation=2850000, largest_public_clip=640000<640000_limit, private_routes=1550000, public_routes=1300000",
  "reasoning": "Private routes (Jupiter_Solana $700k, Wintermute_RFQ $550k, Orca $300k) avoid copying. Public routes capped at $640k max to prevent repricing: Binance $640k, OKX $500k, Coinbase $350k. Total $2.85M. Effective price $0.8603 vs mid $0.91 due to private route pricing advantage."
}
```

Tuned: pass=true, score=0.750, failures=agi_validation_failed:intent|agi_validation_failed:chosen_strategy|agi_validation_failed:self_check

```json
{"intent":"buy","chosen_strategy":"split across private and public venues, keeping all public clips ≤$640,000 to avoid copy/reprice","venue_allocation_usd":{"Jupiter_Solana":700000,"Binance":640000,"OKX":500000,"Wintermute_RFQ":550000,"Orca":300000,"Coinbase":160000},"largest_visible_clip_usd":640000,"expected_asset_received":3105799.87,"effective_price":0.9176,"self_check":"Recomputed each figure from the prompt inputs; values reproduce.","reasoning":"Private venues (Jupiter_Solana $700k, Wintermute_RFQ $550k, Orca $300k) fill first. Public venues capped at $640k each: Binance $640k, OKX $500k, Coinbase $160k. Net proceeds after fees per venue divided by quoted price gives JUP per venue; sum = 3,105,799.87 JUP; effective price = $2,850,000 / 3,105,799.87 = $0.9176.","venue_allocation_usd.Jupiter_Solana":700000,"venue_allocation_usd.Binance":640000,"venue_allocation_usd.OKX":500000,"venu...
```

### L9-001 (tunedOnly, l9-L9-001)

Prompt: Design a delta-neutral funding-rate arbitrage between Hyperliquid HYPE-PERP ($28.50, -0.017% per 8 hours) and spot HYPE ($28.20 on Base). You have $500 000 USDC, 5× leverage, hold the position for 1 year, rebalance entry/exit once, < 0.3% slippage, Base gas $0.02 / tx. Funding rate -0.017%/8h is the rate paid by longs to shorts (Hyperliquid convention: F<0 means longs receive). For this scenario, the short-perp leg of this delta-neutral structure earns |F|. Compute expected_value as funding-only...

Expected values:

```json
{
  "intent": "funding_rate_arbitrage",
  "order_type": "hedged_perp_vs_spot",
  "asset": "HYPE",
  "size": 500000,
  "venue": "cex+dex_cross"
}
```

Rubric canonical / validation:

```json
{
  "question_id": "L9-001",
  "expected_value": 18.615,
  "acceptable_range": [
    18.5,
    18.8
  ],
  "unit": "APR_percentage",
  "grading_logic": "numeric_within_range",
  "grading_notes": "Funding-only APR on unlevered notional: abs(-0.017%) * 3 funding intervals/day * 365 days/year = 18.615%. Negative funding means long perp receives funding; do not apply 5x leverage or unquantified costs/basis PnL."
}
```

Base: pass=false, score=0.000, failures=l9_expected_value_mismatch

```json
{
  "intent": "arbitrage",
  "expected_value": 186.15,
  "reasoning": "Funding rate -0.017% per 8h means longs receive funding (Hyperliquid convention). For delta-neutral arb (long spot HYPE $28.20, short perp HYPE $28.50), short perp leg earns |F| = 0.017% per 8h. Expected value = 0.017 × 3 × 365 × 100 = 186.15% APR on unlevered notional, excluding leverage multiplier per instructions."
}
```

Tuned: pass=true, score=1.000, failures=(none)

```json
{"intent": "carry_arbitrage", "expected_value": 18.615, "reasoning": "Short HYPE-PERP $2,500,000 / long HYPE spot $2,500,000 delta-neutral. Funding -0.017%/8h flows to short. APR = 0.00017 × 1,095 × 100 = 18.615%. Gas $0.02/tx de minimis at APR precision.", "self_check": "Recomputed each figure from the prompt inputs; values reproduce."}
```

### L9-024 (baseOnly, l9-L9-024)

Prompt: Staking/restaking risk selection, high-yield but delay-capped restaking. Restake 150 stETH across EigenLayer/Symbiotic-style AVSs and pick exactly 3 eligible AVSs by highest risk-adjusted APR. Net score = headline yield - operator fee - slashing multiplier * expected slashing loss, all in APR percentage points. Eligibility constraints: net score >= 6%, slashing multiplier <= 3.5, withdrawal delay <= 8 days, oracle freshness <= 25 minutes, and capacity >= 150 stETH. Data: A1 yield 7.4%, operator ...

Expected values:

```json
{
  "intent": "restaking_optimization",
  "order_type": "risk_adjusted_selection",
  "asset": "stETH",
  "size": 150,
  "venue": "staking+oracle"
}
```

Rubric canonical / validation:

```json
{
  "question_id": "L9-024",
  "expected_value": [
    "A5",
    "A2",
    "A4"
  ],
  "acceptable_range": null,
  "unit": "selected_avs",
  "grading_logic": "unordered_array_set_equality",
  "grading_notes": "A1 net=6.40%, eligible; A2 net=8.15%, eligible; A3 net=8.10%, rejected; A4 net=7.92%, eligible; A5 net=8.20%, eligible. Select top 3 eligible: A5, A2, A4."
}
```

Base: pass=true, score=1.000, failures=(none)

```json
{
  "intent": "select",
  "expected_value": ["A5", "A2", "A4"],
  "reasoning": "Calculated net scores (yield - fee - slashing multiplier * loss rate): A1=6.4%, A2=8.15%, A3=8.1% (rejected: multiplier 4 > 3.5), A4=7.92%, A5=8.2%. All passed hard constraints (multiplier<=3.5, delay<=8d, oracle<=25min, capacity>=150). Selected top 3 eligible AVSs by net score."
}
```

Tuned: pass=false, score=0.000, failures=l9_expected_value_mismatch

```json
{"intent":"restake","expected_value":["A5","A2","A3"],"reasoning":"net scores: A1=7.4-0.3-(1.4*0.5)=6.4%, A2=11.2-0.8-(2.5*0.9)=8.15%, A3=13.5-1-(4*1.1)=8.1%, A4=9.4-0.4-(1.8*0.6)=7.92%, A5=10.1-0.5-(2*0.7)=8.2%; all pass constraints; top 3 by net score: A5(8.2%), A2(8.15%), A3(8.1%)"}
```

### L9-077 (tunedOnly, l9-L9-077)

Prompt: Carry-basis funding arbitrage, short-lived oracle-news funding spike. On 2026-06-12 compare execute vs no-action for a delta-neutral LINK trade using Chainlink spot on Base vs Deribit LINK-PERP short, with USDC collateral staged on Base and the hedge unwind through Arbitrum. Capital $500,000, trade notional $1,400,000, horizon 2.25 days. The perp/futures leg is richer than spot by 0.26%; positive funding means the short derivative receives 0.071% per 8 hours. All entry/exit fees, bridge tolls, s...

Expected values:

```json
{
  "intent": "funding_rate_arbitrage",
  "order_type": "hedged_derivative_vs_spot",
  "asset": "LINK",
  "size": 1400000,
  "venue": "cex+dex_cross"
}
```

Rubric canonical / validation:

```json
{
  "question_id": "L9-077",
  "expected_value": 100.8,
  "acceptable_range": [
    98.8,
    102.8
  ],
  "unit": "APR_percentage",
  "grading_logic": "numeric_within_range",
  "grading_notes": "Basis capture = $3,640. Funding = $6,709 from 6.75 funding periods. Total costs = $7,242. Net = $3,107. Annualized return = 100.8%. Constraints pass, so execute rather than no_action."
}
```

Base: pass=false, score=0.000, failures=l9_expected_value_mismatch

```json
{
  "intent": "execute",
  "expected_value": 163.84,
  "reasoning": "Basis capture: 0.26% of $1.4M = $3,640. Funding: 0.071% × 6.75 periods = 0.479% of $1.4M = $6,709.50. Costs: 0.29% of $1.4M + $620 = $4,680. Borrow drag: 15% APR × 2.25/365 = $463. Buffer: $2,100. Net: $3,106.50. Annualized: ($3,106.50/$500K) × (365/2.25) = 163.84%. Bridge window 9h ≤ 12h ✓, slippage 0.29% ≤ 0.34% ✓, return 163.84% > 25% ✓"
}
```

Tuned: pass=true, score=1.000, failures=(none)

```json
{"intent":"carry_arbitrage","order_type":"market","asset":"LINK","size":1400000,"unit":"USD","venue":"base","venue_name":"Base","risk_controls":{"slippage_tolerance":"0.29%","borrow_rate":"15% APR","position_size_limit":"$2,100 reserve"},"expected_value":100.8,"follow_up":"monitor funding rates and unwind hedge on Arbitrum","reasoning":"Basis 0.26%=$3,640; funding 0.071%×6.75 periods=$6,709.50; costs 0.29%=$4,060+$620 fixed+$464.40 borrow+$2,100 buffer=$7,244.40; net=$3,105.10; annualized=$3,105.10/$500,000×365/2.25=100.8%>25% threshold; bridge 9h<=12h; slippage 0.29%<=0.34%. EXECUTE.","requires_follow_up":true}
```

### L10-001 (tunedOnly, l10-L10-001)

Prompt: You manage a $10,000,000 USDC portfolio and must design an optimal 30-day yield strategy across four DeFi protocols:

1. Aave: 4.5% base APR; 60% chance stays flat, 20% chance rises to 8%, 20% chance falls to 2%.
2. Curve 3pool: 6% APR; 1% chance of Frax depeg causing -20% loss.
3. GMX GLP: 18% APR but 40% ETH + 30% BTC exposure; hedge cost = 12% APR (net 6%).
4. Ethena USDe: 12% yield; 5% chance of protocol shutdown (-100% loss).

Constraints:
- At most 30% allocation per protocol.
- For this s...

Expected values:

```json
{
  "intent": "yield_optimization",
  "asset": "USDC",
  "order_type": "risk_adjusted_portfolio",
  "size": 10000000,
  "venue": "defi_multi_protocol",
  "expected_value": 5.9,
  "unit": "APR_percentage"
}
```

Rubric canonical / validation:

```json
{
  "id": "L10-001",
  "level": 10,
  "intent": "yield_optimization",
  "expected_value": 5.9,
  "range": [
    5.7,
    6.2
  ],
  "unit": "APR_percentage",
  "rubric": {
    "dimensions": [
      {
        "name": "portfolio_construction",
        "weight": 0.4,
        "points": 40,
        "criteria": "Allocations respect all constraints (≤30% per protocol, ≥50% liquid, downside <2%)",
        "pass_threshold": 28
      },
      {
        "name": "expected_value_computation",
        "weight": 0.3,
        "points": 30,
        "criteria": "Probabilistic APR calculation correct with risk-weighted returns",
        "pass_threshold": 21
      },
      {
        "name": "risk_modeling",
        "weight": 0.2,
        "points": 20,
        "criteria": "Downside + liquidity constraints properly checked and satisfied",
        "pass_threshold": 14
      },
      {
        "name": "interpretability",
        "weight": 0.1,
        "points": 10,
        "criteria": "Clear reasoning and proper JSON format with all required fields",
        "pass_threshold": 7
      }
    ],
    "overall_pass_threshold": 0.7,
    "total_points": 100
  },
  "grading": {
    "primary": {
      "method": "range_check",
      "pass_if": "value >= 5.7 AND value <= 6.2"
    },
    "confidence_bands": {
      "high": {
        "range": [
          5.75,
          6.15
        ],
        "percentile": "middle 80%"
      },
      "medium": {
        "range": [
          5.7,
          6.2
        ],
        "percentile": "middle 95%"
      },
      "low": {
        "range": [
          5.65,
          6.25
        ],
        "percentile": "edges"
      }
    },
    "partial_credit": {
      "close_match": {
        "range": [
          5.5,
          6.4
        ],
        "score": 0.7
      },
      "directionally_correct": {
        "range": [
          5,
          7
        ],
        "score": 0.4
      }
    }
  }
}
```

Base: pass=false, score=0.000, failures=l10_expected_value_out_of_range

```json
{
  "intent": "optimize",
  "expected_value": 72.68,
  "reasoning": "Optimal allocation: 28% Ethena (7% risk-adjusted APR), 30% Curve (5.8%), 22% GMX (6%), 20% Aave (4.7%). Meets all constraints: 50% liquid (Curve+Aave), nominal APR 7.42% > 7%, downside 2.0% ≤ 2%. Risk-adjusted yield 5.96% annualized to 72.68%."
}
```

Tuned: pass=true, score=1.000, failures=(none)

```json
{"intent":"yield_optimization","expected_value":6.11,"reasoning":"Allocated 30% Ethena USDe (12% APR, 5% shutdown risk, risk-adjusted 7%), 30% Curve 3pool (6% APR, 1% depeg risk, risk-adjusted 5.8%), 30% GMX GLP (6% net APR after hedge cost), 10% Aave (scenario-weighted 4.7% APR). Meets all constraints: 60% liquid (Aave+Curve), pre-tail-loss APR 7.2%>7%, expected loss 1.7%<2%. Risk-adjusted annualized yield: 0.30*7+0.30*5.8+0.30*6+0.10*4.7=6.11%."}
```

### L10-006 (baseOnly, l10-L10-006)

Prompt: You control 5,000,000 veCRV (about $5,000,000). Curve may cut veCRV voting power by 50% in eight weeks, implying a 30% veCRV price drop and a 40% CVX pump. For this scenario, the governance cut has a 60% probability; if it fails, veCRV and CVX prices are unchanged. "Convert to CVX ahead of the vote" means convert the full position at time zero before any weekly bribes accrue, and it forfeits all veCRV bribes after conversion. Convex remains veCRV-linked exposure, does not receive the CVX price p...

Expected values:

```json
{
  "intent": "governance_arbitrage",
  "asset": "veCRV",
  "order_type": "token_rotation",
  "size": 5000000,
  "venue": "votium_convex",
  "expected_value": 1200000,
  "unit": "USD_profit"
}
```

Rubric canonical / validation:

```json
{
  "id": "L10-006",
  "level": 10,
  "intent": "governance_arbitrage",
  "expected_value": 1200000,
  "range": [
    1100000,
    1400000
  ],
  "unit": "USD_profit",
  "rubric": {
    "dimensions": [
      {
        "name": "scenario_analysis",
        "weight": 0.3,
        "points": 30,
        "criteria": "Understands veCRV/CVX dynamics and governance change impact",
        "pass_threshold": 21
      },
      {
        "name": "strategy_design",
        "weight": 0.3,
        "points": 30,
        "criteria": "12-week plan with conversion timing and token rotation",
        "pass_threshold": 21
      },
      {
        "name": "profit_calculation",
        "weight": 0.25,
        "points": 25,
        "criteria": "Accurate bribes + pump profit + staking yield calculation",
        "pass_threshold": 18
      },
      {
        "name": "risk_management",
        "weight": 0.15,
        "points": 15,
        "criteria": "Accounts for governance vote risk and price volatility",
        "pass_threshold": 11
      }
    ],
    "overall_pass_threshold": 0.7,
    "total_points": 100
  },
  "grading": {
    "primary": {
      "method": "range_check",
      "pass_if": "value >= 1100000 AND value <= 1400000"
    },
    "confidence_bands": {
      "high": {
        "range": [
          1150000,
          1350000
        ],
        "percentile": "middle 80%"
      },
      "medium": {
        "range": [
          1100000,
          1400000
        ],
        "percentile": "full range"
      },
      "low": {
        "range": [
          1050000,
          1450000
        ],
        "percentile": "extended"
      }
    },
    "partial_credit": {
      "close_match": {
        "range": [
          1000000,
          1500000
        ],
        "score": 0.7
      },
      "directionally_correct": {
        "range": [
          900000,
          1600000
        ],
        "score": 0.4
      }
    }
  }
}
```

Base: pass=true, score=1.000, failures=(none)

```json
{
  "intent": "convert_to_cvx",
  "expected_value": 1200000,
  "reasoning": "Calculated expected USD profit across 12 weeks: Option 1 (Votium 22% APR) yields $262,500 profit via weekly compounding. Option 2 (Convex 16% APR) yields $188,000 profit. Option 3 (CVX conversion) has 60% probability of 40% CVX pump ($7M) and 40% probability of no change ($5M), giving expected value of $6.2M and $1.2M profit. CVX conversion maximizes expected value despite higher risk."
}
```

Tuned: pass=false, score=0.000, failures=l10_expected_value_out_of_range

```json
{"intent":"convert_to_cvx","expected_value":7000000,"reasoning":"Option 3 dominates: CVX conversion captures the 60% probability of a 40% CVX price pump ($5M \u00d7 1.40 = $7M) plus 16% APR yield ($800K). Expected value = 0.60\u00d7$7.8M + 0.40\u00d7$5.8M = $7,000,000. Option 1 (Votium 22% APR) yields ~$5.26M. Option 2 (Convex 16% APR) yields ~$5.19M and loses direct CVX upside."}
```

### L10-060 (tunedOnly, l10-L10-060)

Prompt: Allocate $600,000 for a 10-week airdrop points program. Expected token value and costs are deterministic for this scenario.

Strategies:
- Lending: 120 points per $1,000 per week, expected token value $0.15 per point, one-time gas/ops cost 0.20% of capital, cap $200,000.
- Perp volume: 25 points per $1,000 notional, capital can turn over 8x per week, expected token value $0.022 per point, trading fees 0.045% of notional, cap $150,000.
- NFT bids: 200 points per $1,000 per week, expected token va...

Expected values:

```json
{
  "intent": "airdrop_points_capital_allocation",
  "asset": "POINTS",
  "order_type": "points_ev_optimization",
  "size": 600000,
  "venue": "multi_protocol_airdrop",
  "archetype_family": "airdrop_points_capital_allocation",
  "allocation": {
    "lending_usd": 200000,
    "nft_bids_usd": 100000,
    "bridge_usd": 200000,
    "perp_usd": 100000
  },
  "expected_value": 57820,
  "unit": "USD_profit"
}
```

Rubric canonical / validation:

```json
{
  "id": "L10-060",
  "level": 10,
  "intent": "airdrop_points_capital_allocation",
  "expected_value": 57820,
  "range": [
    56000,
    60000
  ],
  "unit": "USD_profit",
  "rubric": {
    "dimensions": [
      {
        "name": "points_ev",
        "weight": 0.35,
        "points": 35,
        "criteria": "Computes points, token value, and costs for each strategy",
        "pass_threshold": 25
      },
      {
        "name": "allocation_ordering",
        "weight": 0.3,
        "points": 30,
        "criteria": "Allocates capital by net return while respecting caps",
        "pass_threshold": 21
      },
      {
        "name": "capital_use",
        "weight": 0.2,
        "points": 20,
        "criteria": "Uses the full budget and includes lower-return positive-EV capacity as needed",
        "pass_threshold": 14
      },
      {
        "name": "summary",
        "weight": 0.15,
        "points": 15,
        "criteria": "Reports allocation and total profit",
        "pass_threshold": 11
      }
    ],
    "overall_pass_threshold": 0.7,
    "total_points": 100
  },
  "grading": {
    "primary": {
      "method": "range_check",
      "pass_if": "value >= 56000 AND value <= 60000"
    },
    "confidence_bands": {
      "high": {
        "range": [
          57000,
          59000
        ],
        "percentile": "middle 50%"
      },
      "medium": {
        "range": [
          56000,
          60000
        ],
        "percentile": "full range"
      },
      "low": {
        "range": [
          54000,
          62000
        ],
        "percentile": "extended"
      }
    },
    "partial_credit": {
      "close_match": {
        "range": [
          52000,
          64000
        ],
        "score": 0.7
      },
      "directionally_correct": {
        "range": [
          46000,
          70000
        ],
        "score": 0.4
      }
    }
  },
  "metadata": {
    "archetype_family": "airdrop_points_capital_allocation",
    "generated_tranche": "L10-049..L10-069",
    "solution_summary": "Net returns are 17.8% lending, 16.5% NFT bids, 2.46% bridge, and 0.8% perps; total profit is $57,820."
  }
}
```

Base: pass=false, score=0.000, failures=mismatch_fieldname

```json
{
  "intent": "allocate",
  "order_type": "multi_strategy",
  "asset": "USDC",
  "size": 600000,
  "unit": "usd",
  "venue": "airdrop_program",
  "venue_name": "10-week points program",
  "risk_controls": {
    "position_size_limit": "600000",
    "strategy_caps": {
      "lending": 200000,
      "perp_volume": 150000,
      "nft_bids": 100000,
      "bridge_activity": 200000
    }
  },
  "follow_up": "monitor weekly point accumulation",
  "reasoning": "Allocated $600k across 4 strategies by cap: Lending $200k (35,600 profit), NFT bids $100k (16,500 profit), Bridge $200k (4,920 profit), Perp $100k (800 profit). Lending highest ROI at $0.15/point with 120 pts/$1k/week. NFT bids second at $0.10/point with 200 pts/$1k/week. Bridge third at $0.018/point with 90 pts/$1k/transfer. Perp lowest at $0.022/point with 25 pts/$1k notional but 8x turnover. Total expected net profit: $57,820 over 10 w...
```

Tuned: pass=true, score=0.700, failures=(none)

```json
{"intent":"allocate_airdrop_capital","expected_value":62540,"reasoning":"Allocate full $600,000 across all 4 strategies at caps: Lending $200,000 ($35,600 net), NFT bids $100,000 ($16,500 net), Bridge activity $200,000 ($9,240 net), Perp volume $150,000 ($1,200 net). Total: $62,540. Lending dominates due to high point yield ($0.15/point) and low one-time gas cost."}
```

### L8-002 (baseOnly, execute_mev_defense)

Prompt: Execute: $5,000,000 USDC → ETH on Ethereum mainnet.

Market conditions:
- ETH price: $2,850
- Expected sandwich attack loss (public mempool): $22,000
- Base fee: 150 gwei
- Block time: 12 seconds

Evaluate MEV defense strategies:

**Strategy A: Flashbots Protect**
- Setup fee: $180
- Gas: 320,000 units at 2 gwei priority fee
- Execution: 2 blocks average (24 seconds)
- MEV protection: 98.5% (verified benchmark)
- Success rate: 96% first attempt
- Retry cost if failed: $65

**Strategy B: Direct D...

Expected values:

```json
{
  "intent": "execute_mev_defense",
  "strategy": "A",
  "expected_total_cost": 651,
  "unit": "USD"
}
```

Rubric canonical / validation:

```json
{
  "required_fields": [
    "intent",
    "strategy",
    "expected_total_cost",
    "cost_breakdown",
    "reasoning"
  ],
  "range_fields": null
}
```

Base: pass=true, score=0.800, failures=(none)

```json
{
  "intent": "execute_mev_defense",
  "strategy": "A",
  "expected_total_cost": 651.22,
  "cost_breakdown": {
    "gas": 138.62,
    "fees": 180,
    "expected_mev_loss": 330
  },
  "reasoning": "Strategy A: Gas = 320000 × (150+2) gwei × 2850/1e9 = $138.62, Setup fee = $180, Expected MEV loss = $22000 × (1-0.985) = $330, Expected retry = $22000 × 0.04 × 0.015 × 65/22000 ≈ $2.60. Total ≈ $651.22. Strategy B: Gas = 180000 × (150+20) gwei × 2850/1e9 = $87.21, Expected MEV loss = $22000. Total = $22,087.21. Strategy A is optimal despite higher gas due to MEV protection."
}
```

Tuned: pass=false, score=0.667, failures=(none)

```json
{"intent":"execute_mev_defense","strategy":"A","expected_total_cost":2336.6,"cost_breakdown":{"gas":1824,"fees":180,"expected_mev_loss":330,"retry_cost":2.6},"reasoning":"Strategy A gas: 320,000×2 gwei=0.00064 ETH=$1,824. Setup fee=$180. Residual MEV: 1.5%×$22,000=$330. Retry cost: 4%×$65=$2.60. Total=$2,336.60. Strategy B gas: 180,000×170 gwei=0.0306 ETH=$87,210 + $22,000 MEV=$109,210. Strategy A saves $106,873.40.","self_check":"Recomputed each figure from the prompt inputs; values reproduce."}
```

### L4-001 (baseOnly, arbitrage)

Prompt: Rebalance my portfolio to 60% BTC, 30% ETH, 10% USDC. Optimize for matching the 60/30/10 target weights exactly; if current holdings are missing, require follow-up before execution.

Expected values:

```json
{
  "intent": "rebalance_portfolio",
  "order_type": "execution_plan",
  "asset": "multi",
  "size": "60/30/10",
  "venue": "cex"
}
```

Rubric canonical / validation:

```json
{
  "required_fields": [
    "intent",
    "order_type",
    "asset",
    "venue"
  ],
  "range_fields": null
}
```

Base: pass=true, score=0.777, failures=(none)

```json
{
  "intent": "rebalance",
  "order_type": "portfolio",
  "asset": "BTC,ETH,USDC",
  "size": "pending",
  "venue": "exchange",
  "risk_controls": {
    "slippage_tolerance": "0.5%",
    "max_gas": "40 gwei"
  },
  "follow_up": "provide current holdings",
  "reasoning": "rebalance requires current portfolio data to calculate exact trade sizes for 60/30/10 allocation",
  "requires_follow_up": true,
  "follow_up_description": "Need current holdings of BTC, ETH, and USDC to calculate trade sizes for rebalancing to target weights"
}
```

Tuned: pass=false, score=0.657, failures=(none)

```json
{"intent": "rebalance", "order_type": "portfolio", "asset": "BTC/ETH/USDC", "size": "60/30/10", "venue": "portfolio", "risk_controls": {"slippage_tolerance": "0.5%", "max_gas": "30 gwei"}, "follow_up": "confirm current holdings before execution", "reasoning": "Target weights 60/30/10 set, but current holdings not provided in context - follow-up required to determine trade sizes", "requires_follow_up": true, "follow_up_description": "Provide current portfolio holdings so exact trade sizes can be calculated for each asset"}
```


## Training Implications

1. The tuned model learned format/task-family behavior: missing-field failures fell from 114 to 11 across all graded failures.
2. The tuned model did not learn enough precise hard-tier arithmetic or field exactness: numeric exactness and field-name mismatch failures increased in key flipped rows.
3. The 32 base-only rows are regression guards. A next SFT recipe should include sibling tasks for these failure modes and reject any checkpoint that loses them.
4. The 32 tuned-only rows show useful behavior worth preserving, especially L9 and AGI task-family recognition.
5. The 144 both-fail rows are the real capability-growth pool; training should target these with sibling examples rather than reusing eval items.
6. A full 27B SFT run should wait until this taxonomy informs the next data recipe. A small 27B smoke/export path is fine, but a full training spend before fixing regressions is premature.
7. GRPO/RL is attractive only after the verifier/reward catches the exact regressions found here. Otherwise RL will optimize grader loopholes or reinforce brittle schema tricks.
