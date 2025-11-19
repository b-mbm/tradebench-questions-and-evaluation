import type { SchemaQuestion, ExecuteOneResponse } from '../types/schema';

const SCHEMA_DEFINITION = `You must respond with a valid JSON object matching this TypeScript interface:

interface ExecuteOneResponse {
  intent: string;
  order_type: string;
  asset: string;
  size: string | number;
  unit?: string;  // denomination of size (e.g., "usd", "btc", "eth")
  price?: string | number;
  venue: string;
  venue_name?: string;
  risk_controls: {
    stop_loss?: string | number;
    take_profit?: string | number;
    slippage_tolerance?: string | number;
    max_gas?: string | number;
    position_size_limit?: string | number;
  };
  follow_up?: string;
  reasoning?: string;
  requires_follow_up?: boolean;
  follow_up_description?: string;
}`;

const SAMPLE_RESPONSES = `Example 1:
{
  "intent": "buy",
  "order_type": "market",
  "asset": "BTC",
  "size": "0.5",
  "venue": "coinbase",
  "risk_controls": {
    "slippage_tolerance": "0.5%"
  },
  "follow_up": "confirm fill",
  "reasoning": "market order for immediate execution"
}

Example 2:
{
  "intent": "swap",
  "order_type": "dex",
  "asset": "DAI",
  "size": "5000",
  "price": "pool spot",
  "venue": "dex",
  "venue_name": "uniswap",
  "risk_controls": {
    "slippage_tolerance": "1%",
    "max_gas": "40 gwei"
  },
  "follow_up": "monitor pool depth",
  "reasoning": "route via largest pool"
}`;

export const RUBRIC_SCHEMA_HINTS: Record<string, {
  keys: string[];
  numericKeys: string[];
  disallowed?: string[];
  notes?: string[];
}> = {
  lp_net_return_analysis: {
    keys: [
      'intent',
      'order_type',
      'asset',
      'size',
      'venue',
      'il_percentage',
      'il_loss_usd',
      'net_gain_usd',
      'net_return_pct',
      'hold_value',
      'lp_value',
      'reasoning'
    ],
    numericKeys: [
      'size',
      'il_percentage',
      'il_loss_usd',
      'net_gain_usd',
      'net_return_pct',
      'hold_value',
      'lp_value'
    ],
    disallowed: ['unit', 'venue_name', 'risk_controls', 'follow_up', 'requires_follow_up'],
    notes: [
      '- All required keys must have non-null, non-empty values.',
      '- size must be greater than 0.',
      '- il_percentage and il_loss_usd represent loss magnitudes; do not return negative values for these fields.',
      '- net_gain_usd and net_return_pct should account for fee earnings offsetting impermanent loss.'
    ]
  },
  portfolio_efficiency_analysis: {
    keys: [
      'intent',
      'order_type',
      'asset',
      'size',
      'venue',
      'blended_apy',
      'weighted_risk_score',
      'excess_return',
      'risk_adjusted_ratio',
      'total_annual_yield_usd',
      'allocation',
      'reasoning'
    ],
    numericKeys: [
      'size',
      'blended_apy',
      'weighted_risk_score',
      'excess_return',
      'risk_adjusted_ratio',
      'total_annual_yield_usd'
    ],
    disallowed: ['unit', 'venue_name', 'risk_controls', 'follow_up', 'requires_follow_up'],
    notes: [
      '- All required keys must have non-null values; do not return empty strings.',
      '- blended_apy, weighted_risk_score, excess_return, risk_adjusted_ratio, total_annual_yield_usd must be numeric JSON values (not strings).',
      '- allocation must be an object including numeric USD fields for aave, curve, and yearn.'
    ]
  },
  multi_protocol_yield_optimization: {
    keys: [
      'intent',
      'order_type',
      'asset',
      'size',
      'venue',
      'venue_name',
      'expected_value',
      'unit',
      'allocation'
    ],
    numericKeys: ['size', 'expected_value'],
    disallowed: ['risk_controls', 'follow_up', 'requires_follow_up'],
    notes: ['- The allocation object must include numeric fields: pendle_pt_steth, convex_curve_3pool.']
  },
  mev_protection_cost_benefit: {
    keys: [
      'intent',
      'order_type',
      'asset',
      'size',
      'eth_price',
      'gross_value',
      'uniswap_slippage_cost',
      'uniswap_gas_cost',
      'uniswap_mev_cost',
      'uniswap_total_cost',
      'uniswap_total_cost_pct',
      'uniswap_net_proceeds',
      'cowswap_slippage_cost',
      'cowswap_gas_cost',
      'cowswap_mev_cost',
      'cowswap_total_cost',
      'cowswap_total_cost_pct',
      'cowswap_net_proceeds',
      'oneinch_slippage_cost',
      'oneinch_gas_cost',
      'oneinch_mev_cost',
      'oneinch_total_cost',
      'oneinch_total_cost_pct',
      'oneinch_net_proceeds',
      'best_option',
      'worst_option',
      'savings_vs_worst',
      'venue',
      'venue_name',
      'reasoning'
    ],
    numericKeys: [
      'size',
      'eth_price',
      'gross_value',
      'uniswap_slippage_cost',
      'uniswap_gas_cost',
      'uniswap_mev_cost',
      'uniswap_total_cost',
      'uniswap_total_cost_pct',
      'uniswap_net_proceeds',
      'cowswap_slippage_cost',
      'cowswap_gas_cost',
      'cowswap_mev_cost',
      'cowswap_total_cost',
      'cowswap_total_cost_pct',
      'cowswap_net_proceeds',
      'oneinch_slippage_cost',
      'oneinch_gas_cost',
      'oneinch_mev_cost',
      'oneinch_total_cost',
      'oneinch_total_cost_pct',
      'oneinch_net_proceeds',
      'savings_vs_worst'
    ],
    disallowed: ['unit', 'risk_controls', 'follow_up', 'requires_follow_up']
  },
  // Generic arbitrage analysis (used by L7-001 etc.)
  arbitrage: {
    keys: [
      'intent',
      'order_type',
      'asset',
      'size',
      'venue',
      'venue_name',
      'reasoning'
    ],
    numericKeys: [],
    disallowed: ['unit', 'price', 'risk_controls', 'follow_up', 'requires_follow_up'],
    notes: [
      '- asset must be "multi" (or a generic portfolio descriptor) for cross-venue/flash-loan analysis — do not return a single ticker like ETH/BTC.',
      '- order_type should be "analysis" for arbitrage assessment tasks.',
      '- All required keys must be present with non-null, non-empty values.',
      '- Keep the JSON strictly to the listed keys.'
    ]
  },
  execute_mev_defense: {
    keys: [
      'intent',
      'strategy',
      'expected_total_cost',
      'cost_breakdown',
      'reasoning'
    ],
    numericKeys: [
      'expected_total_cost',
      'cost_breakdown.gas',
      'cost_breakdown.fees',
      'cost_breakdown.expected_mev_loss'
    ],
    disallowed: [
      'order_type',
      'asset',
      'input_asset',
      'output_asset',
      'venue',
      'venue_name',
      'risk_controls',
      'follow_up',
      'requires_follow_up'
    ],
    notes: [
      '- `strategy` must be either "A" or "B".',
      '- Provide numeric USD amounts for gas, fees, and expected MEV loss inside cost_breakdown.',
      '- Example response structure:\n  {\n    "intent": "execute_mev_defense",\n    "strategy": "A",\n    "expected_total_cost": 0,\n    "cost_breakdown": {\n      "gas": 0,\n      "fees": 0,\n      "expected_mev_loss": 0\n    },\n    "reasoning": "..."\n  }'
    ]
  },
  risk_adjusted_leverage: {
    keys: [
      'action',
      'action_name',
      'liquidation_probabilities',
      'expected_values',
      'reasoning',
      'calculation_method'
    ],
    numericKeys: [
      'liquidation_probabilities.maintain_3x',
      'liquidation_probabilities.deleverage_2x',
      'liquidation_probabilities.deleverage_1_5x',
      'expected_values.maintain_3x',
      'expected_values.deleverage_2x',
      'expected_values.deleverage_1_5x',
      'expected_values.close'
    ],
    disallowed: [
      'intent',
      'order_type',
      'asset',
      'size',
      'venue',
      'venue_name',
      'risk_controls',
      'follow_up',
      'requires_follow_up'
    ],
    notes: [
      '- Report weekly liquidation probabilities as decimal fractions (e.g., 0.0081).',
      '- Provide 7-day expected values (USD) for each action after subtracting expected liquidation penalties.',
      '- Indicate whether barrier_hitting or endpoint_probability was used in calculation_method.',
      '- Example structure:\n  {\n    "action": "B",\n    "action_name": "deleverage_to_2x",\n    "liquidation_probabilities": {\n      "maintain_3x": 0,\n      "deleverage_2x": 0,\n      "deleverage_1_5x": 0\n    },\n    "expected_values": {\n      "maintain_3x": 0,\n      "deleverage_2x": 0,\n      "deleverage_1_5x": 0,\n      "close": 0\n    },\n    "reasoning": "...",\n    "calculation_method": "barrier_hitting"\n  }'
    ]
  },
  fixed_yield_allocation: {
    keys: [
      'intent',
      'strategy',
      'asset',
      'allocation',
      'venue',
      'maturity',
      'expected_apy',
      'selected_strategy',
      'reasoning',
      'risk_assessment',
      'meets_constraints',
      'alternatives_rejected'
    ],
    numericKeys: [
      'allocation',
      'expected_apy'
    ],
    disallowed: [
      'order_type',
      'size',
      'venue_name',
      'risk_controls',
      'follow_up',
      'follow_up_description',
      'requires_follow_up',
      'unit'
    ],
    notes: [
      '- Allocation must be in USD (<= 100000).',
      '- Provide expected_apy as a percentage (e.g., 12.3).',
      '- Use selected_strategy letter (A/B/C/D or D-tilted).',
      '- Do not include legacy fields such as order_type, size, venue_name, risk_controls, follow_up, or requires_follow_up.',
      '- Include reasoning that references APY optimization, leverage/depeg risk, and 90-day horizon alignment.',
      '- Example structure:\n  {\n    "intent": "fixed_yield_allocation",\n    "strategy": "fixed_yield",\n    "asset": "PT-USDe",\n    "allocation": 100000,\n    "venue": "pendle",\n    "maturity": "90d",\n    "expected_apy": 12.3,\n    "selected_strategy": "C",\n    "reasoning": "...",\n    "risk_assessment": "low",\n    "meets_constraints": true,\n    "alternatives_rejected": {"B": "...", "D": "..."}\n  }'
    ]
  },
  cash_and_carry_arbitrage: {
    keys: [
      'decision',
      'reasoning',
      'execution'
    ],
    numericKeys: [
      'reasoning.capital_allocation.spot_usd',
      'reasoning.capital_allocation.margin_usd',
      'reasoning.position_size_eth',
      'reasoning.perp_notional_usd',
      'reasoning.funding_revenue_daily',
      'reasoning.costs_entry',
      'reasoning.break_even_periods',
      'reasoning.annualized_funding_rate_pct',
      'reasoning.annual_roi_on_total_capital_pct'
    ],
    disallowed: [
      'intent',
      'order_type',
      'asset',
      'size',
      'venue',
      'risk_controls',
      'follow_up',
      'requires_follow_up'
    ],
    notes: [
      '- decision must be "execute" to earn full credit; omit legacy intent/order_type fields.',
      '- Provide capital_allocation with spot_usd + margin_usd totaling 100000 and margin covering perp notional.',
      '- Include position_size_eth (~20.4), perp_notional_usd (~50k), daily funding revenue, entry costs, break_even_periods, and annualized metrics.',
      '- Execution steps must include transferring margin (step_1), buying spot ETH, and shorting ETH perps; explicitly state the position is delta neutral.',
      '- Example structure:\n  {\n    "decision": "execute",\n    "reasoning": {\n      "capital_allocation": {"spot_usd": <spot_allocation>, "margin_usd": <margin_allocation>},\n      "position_size_eth": <eth_size>,\n      "perp_notional_usd": <perp_notional>,\n      "funding_revenue_daily": <funding_usd>,\n      "costs_entry": <costs_usd>,\n      "break_even_periods": <periods>,\n      "annualized_funding_rate_pct": <funding_pct>,\n      "annual_roi_on_total_capital_pct": <roi_pct>\n    },\n    "execution": {\n      "step_1": "transfer_<amount>_usdt_to_binance_for_margin",\n      "step_2": "buy_<eth_size>_eth_spot_coinbase_maker",\n      "step_3": "short_<eth_size>_eth_perp_binance_maker",\n      "delta_neutral": <boolean>,\n      "exit_trigger": <exit_condition>\n    }\n  }'
    ]
  },
  risk_parity_rebalance: {
    keys: [
      'intent',
      'order_type',
      'asset',
      'size',
      'venue',
      'portfolio_volatility',
      'risk_contributions',
      'btc_contribution_pct',
      'eth_contribution_pct',
      'bonds_contribution_pct',
      'rebalancing_required',
      'target_allocations_usd',
      'target_btc_usd',
      'target_eth_usd',
      'target_bonds_usd',
      'transactions',
      'btc_sell_amount',
      'eth_sell_amount',
      'bonds_buy_amount',
      'btc_post_slippage',
      'eth_post_slippage',
      'bonds_post_slippage',
      'reasoning'
    ],
    numericKeys: [
      'portfolio_volatility',
      'btc_contribution_pct',
      'eth_contribution_pct',
      'bonds_contribution_pct',
      'target_btc_usd',
      'target_eth_usd',
      'target_bonds_usd',
      'btc_sell_amount',
      'eth_sell_amount',
      'bonds_buy_amount',
      'btc_post_slippage',
      'eth_post_slippage',
      'bonds_post_slippage'
    ],
    disallowed: ['follow_up', 'requires_follow_up', 'risk_controls']
  }
  ,
  restaking_optimization: {
    keys: [
      'intent',
      'order_type',
      'asset',
      'size',
      'venue',
      'venue_name',
      'rationale',
      'decision_factors',
      'total_staking_apr',
      'borrow_rate',
      'effective_borrow_cost_on_portfolio',
      'net_apr_after_borrow',
      'meets_net_apr_target',
      'slashing_risk_pct',
      'within_risk_tolerance',
      'liquidity_days',
      'meets_collateral_timing',
      'option_c_net_apr_comparison',
      'option_a_outperformance'
    ],
    numericKeys: [
      'total_staking_apr',
      'borrow_rate',
      'effective_borrow_cost_on_portfolio',
      'net_apr_after_borrow',
      'slashing_risk_pct',
      'liquidity_days',
      'option_c_net_apr_comparison',
      'option_a_outperformance'
    ],
    disallowed: ['follow_up', 'requires_follow_up', 'risk_controls']
  }
  ,
  collar_min_cost: {
    keys: [
      'intent',
      'order_type',
      'asset',
      'size',
      'call_strike',
      'put_strike',
      'net_cost_per_btc',
      'venue',
      'venue_name',
      'expiry_days'
    ],
    numericKeys: [
      'size',
      'call_strike',
      'put_strike',
      'net_cost_per_btc',
      'expiry_days'
    ],
    disallowed: ['risk_controls', 'follow_up', 'requires_follow_up', 'unit'],
    notes: [
      '- Provide both legs of the collar: long put and short call with strikes in USD.',
      '- Net cost per BTC should be a negative debit between -80 and -40 inclusive.'
    ]
  }
  ,
  risk_parity_execution: {
    keys: [
      'intent',
      'strategy',
      'execution_plan',
      'fee_summary',
      'rationale',
      'constraints_met'
    ],
    numericKeys: [
      'execution_plan[].notional',
      'execution_plan[].fee_rate',
      'execution_plan[].fee_amount',
      'fee_summary.total_fees',
      'fee_summary.total_notional',
      'fee_summary.total_execution_cost'
    ],
    notes: [
      '- Provide four execution_plan entries covering BTC, ETH, GLD, and TLT.',
      '- Use explicit USD fee amounts (e.g., 22.50) and matching fee rates.',
      '- Rationale should explain why the chosen venue mix minimizes fees while meeting constraints.'
    ]
  }
  ,
  mev_resilient_unwind: {
    keys: [
      'intent',
      'order_type',
      'asset',
      'size',
      'venue',
      'venue_name',
      'expected_value',
      'unit',
      'reasoning',
      'constraint_awareness'
    ],
    numericKeys: [
      'size',
      'expected_value'
    ],
    disallowed: ['risk_controls', 'follow_up', 'requires_follow_up']
  }
};

export interface ExecuteOnePrompts {
  system: string;
  user: string;
}

export function buildExecuteOnePrompts(question: SchemaQuestion): ExecuteOnePrompts {
  const COMPACT = process.env.TB_COMPACT_PROMPT === '0' ? false : true;
  const contextBlock = JSON.stringify(question.context ?? {}, null, 2);
  const expectedValues = JSON.stringify(question.expected_values ?? {}, null, 2);

  const schemaHintConfig = RUBRIC_SCHEMA_HINTS[question.rubric_id];
  let schemaHint = '';
  if (schemaHintConfig) {
    const keysList = schemaHintConfig.keys.join(', ');
    const numericList = schemaHintConfig.numericKeys.join(', ');
    const disallowedList = schemaHintConfig.disallowed?.join(', ');
    const lines = [
      'Output Requirements:',
      `- Return a single JSON object with exactly these top-level keys: ${keysList}.`,
      '- Do not include any additional top-level keys.',
      `- Use numeric JSON values (not quoted strings) for: ${numericList}.`,
      '- The `reasoning` field must be a concise string summarizing how you derived the numbers.'
    ];
    if (disallowedList) {
      lines.push(`- Omit fields such as ${disallowedList}; they are not part of the required schema.`);
    }
    if (schemaHintConfig.notes) {
      for (const note of schemaHintConfig.notes) {
        lines.push(note);
      }
    }
    lines.push('- If a field is not listed in the required keys, omit it. Do NOT include optional fields like unit, price, risk_controls, venue_name, or follow_up unless explicitly listed.');
    lines.push('- Do not wrap the JSON in markdown fences.');
    schemaHint = lines.join('\n');
  }

  const systemParts = [
    'You are Execute@1, a deterministic trading execution assistant.',
    'Return ONLY JSON. Do not include explanations outside of JSON.',
    SCHEMA_DEFINITION,
  ];
  if (!COMPACT) {
    systemParts.push(SAMPLE_RESPONSES);
  }
  const system = systemParts.join('\n\n');

  const userSections: string[] = [
    `Question ID: ${question.id}`,
    `Level: ${question.level}`,
    '',
    'Prompt:',
    question.prompt,
    '',
    'Context JSON:',
    contextBlock,
    ''
  ];

  if (schemaHint) {
    userSections.push(schemaHint, '');
  }

  userSections.push('Respond with a valid JSON object matching ExecuteOneResponse. Do not wrap in markdown fences.');

  const user = userSections.join('\n');

  return { system, user };
}

export function getSchemaFinalAttemptHint(rubricId: string | undefined): string | null {
  if (!rubricId) return null;
  const cfg = RUBRIC_SCHEMA_HINTS[rubricId];
  if (!cfg) return null;
  const keysList = cfg.keys.join(', ');
  const numericList = cfg.numericKeys.join(', ');
  const disallowedList = cfg.disallowed?.join(', ');
  const lines: string[] = [];
  lines.push('Final attempt (schema enforcement):');
  lines.push(`- Emit ONE JSON object with exactly these keys: ${keysList}.`);
  lines.push(`- Use numeric JSON values (not strings) for: ${numericList}.`);
  if (disallowedList) {
    lines.push(`- Do NOT include: ${disallowedList}.`);
  }
  lines.push("- If unsure, use 0 for numbers, false for booleans, and short placeholders for strings (e.g., 'analysis', 'multi').");
  lines.push('- Do not use null. Do not add extra keys. JSON only.');
  return lines.join('\n');
}
