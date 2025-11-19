import { enrichContext } from './shared';
import type { SchemaQuestion } from '../types/schema';

export const SCHEMA_QUESTIONS: SchemaQuestion[] = [
  {
    id: 'L1-001',
    level: 1,
    prompt: 'Buy 0.5 BTC at market price',
    rubric_id: 'market_buy',
    expected_values: {
      intent: 'buy',
      order_type: 'market',
      asset: 'BTC',
      size: 0.5,
      venue: 'cex',
    },
    context: enrichContext(),
  },
  {
    id: 'L1-002',
    level: 1,
    prompt: 'Buy 10 SOL using a limit order at $95',
    rubric_id: 'limit_buy',
    expected_values: {
      intent: 'buy',
      order_type: 'limit',
      asset: 'SOL',
      size: 10,
      price: 95,
      venue: 'cex',
    },
    context: enrichContext(),
  },
  {
    id: 'L1-003',
    level: 1,
    prompt: 'Set stop loss on my 2 ETH at $2,800',
    rubric_id: 'stop_loss',
    expected_values: {
      intent: 'set_stop_loss',
      order_type: 'stop',
      asset: 'ETH',
      size: 2,
      price: 2800,
      venue: 'cex',
    },
    context: enrichContext(),
  },
  {
    id: 'L2-001',
    level: 2,
    prompt: 'Swap 5000 USDC for DAI on Ethereum',
    rubric_id: 'dex_swap',
    expected_values: {
      intent: 'swap',
      order_type: 'market',
      asset: 'DAI',
      size: 5000,
      venue: 'dex',
      venue_name: 'uniswap',
    },
    context: enrichContext(),
  },
  {
    id: 'L2-002',
    level: 2,
    prompt: 'Buy 100,000 PEPE with 15% slippage tolerance',
    rubric_id: 'dex_swap',
    expected_values: {
      intent: 'buy',
      order_type: 'market',
      asset: 'PEPE',
      size: 100000,
      venue: 'dex',
      venue_name: 'memecoin pool',
      risk_controls: {
        slippage_tolerance: '15%',
      },
    },
    context: enrichContext(),
  },
  {
    id: 'L2-003',
    level: 2,
    prompt: 'Buy 1000 MATIC with minimal gas fees',
    rubric_id: 'dex_swap',
    expected_values: {
      intent: 'buy',
      order_type: 'market',
      asset: 'MATIC',
      size: 1000,
      venue: 'dex',
      venue_name: 'polygon',
    },
    context: enrichContext(),
  },
  {
    id: 'L2-004',
    level: 2,
    prompt: 'Analyze liquidity before swapping 50,000 USDC for WETH',
    rubric_id: 'arbitrage',
    expected_values: {
      intent: 'analyze_liquidity',
      order_type: 'analysis',
      asset: 'USDC/WETH',
      size: 50000,
      venue: 'dex',
      venue_name: 'uniswap',
    },
    context: enrichContext(),
  },
  {
    id: 'L3-001',
    level: 3,
    prompt: 'Bridge 1000 USDC to Arbitrum and buy ARB',
    rubric_id: 'cross_chain_bridge',
    expected_values: {
      intent: 'bridge_and_swap',
      order_type: 'bridge',
      asset: 'USDC',
      size: 1000,
      venue: 'bridge',
      venue_name: 'arbitrum bridge',
    },
    context: enrichContext(),
  },
  {
    id: 'L3-002',
    level: 3,
    prompt: 'Split 10,000 USDC equally across Ethereum, Arbitrum, and Optimism',
    rubric_id: 'cross_chain_bridge',
    expected_values: {
      intent: 'bridge_distribution',
      order_type: 'bridge',
      asset: 'USDC',
      size: 10000,
      venue: 'bridge',
      venue_name: 'multi-bridge',
    },
    context: enrichContext(),
  },
  {
    id: 'L3-003',
    level: 3,
    prompt: 'Bridge 2 ETH from Ethereum to Polygon and swap for MATIC',
    rubric_id: 'cross_chain_bridge',
    expected_values: {
      intent: 'bridge_and_swap',
      order_type: 'bridge',
      asset: 'ETH',
      size: 2,
      venue: 'bridge',
      venue_name: 'polygon pos',
    },
    context: enrichContext(),
  },
  {
    id: 'L4-001',
    level: 4,
    prompt: 'Rebalance my portfolio to 60% BTC, 30% ETH, 10% USDC',
    rubric_id: 'arbitrage',
    expected_values: {
      intent: 'rebalance_portfolio',
      order_type: 'execution_plan',
      asset: 'multi',
      size: '60/30/10',
      venue: 'cex',
    },
    context: enrichContext(),
  },
  {
    id: 'L4-002',
    level: 4,
    prompt: 'Assess correlation risk across BTC, ETH, SOL, MATIC, LINK',
    rubric_id: 'arbitrage',
    expected_values: {
      intent: 'assess_correlation',
      order_type: 'analysis',
      asset: 'portfolio',
      size: 'multi-asset',
      venue: 'analysis',
    },
    context: enrichContext(),
  },
  {
    id: 'L4-003',
    level: 4,
    prompt: 'Identify tax loss harvesting opportunities in my portfolio',
    rubric_id: 'arbitrage',
    expected_values: {
      intent: 'tax_loss_harvest',
      order_type: 'analysis',
      asset: 'portfolio',
      size: 'losers',
      venue: 'analysis',
    },
    context: enrichContext(),
  },
  {
    id: 'L4-004',
    level: 4,
    prompt: 'Stress test my portfolio for a -50% crypto crash',
    rubric_id: 'arbitrage',
    expected_values: {
      intent: 'stress_test',
      order_type: 'analysis',
      asset: 'portfolio',
      size: '-50%',
      venue: 'analysis',
    },
    context: enrichContext(),
  },
  {
    id: 'L4-005',
    level: 4,
    prompt: 'Calculate my Sharpe ratio given the context data',
    rubric_id: 'arbitrage',
    expected_values: {
      intent: 'calculate_sharpe',
      order_type: 'analysis',
      asset: 'portfolio',
      size: 'context',
      venue: 'analysis',
    },
    context: enrichContext(),
  },
  {
    id: 'L5-001',
    level: 5,
    prompt: 'Add liquidity to ETH/USDC pool between $2,700–$2,900',
    rubric_id: 'liquidity_provision',
    expected_values: {
      intent: 'provide_liquidity',
      order_type: 'range_lp',
      asset: 'ETH/USDC',
      size: 'concentrated',
      venue: 'dex',
      venue_name: 'uniswap v3',
    },
    context: enrichContext(),
  },
  {
    id: 'L5-002',
    level: 5,
    prompt: 'Create 3x leveraged long ETH position using 1 ETH on Aave',
    rubric_id: 'lending_borrow',
    expected_values: {
      intent: 'leveraged_long',
      order_type: 'recursive_borrow',
      asset: 'ETH',
      size: '3x',
      venue: 'lending_protocol',
      venue_name: 'aave',
    },
    context: enrichContext(),
  },
  {
    id: 'L5-003',
    level: 5,
    prompt: 'Enter delta-neutral yield farming with 5 ETH',
    rubric_id: 'arbitrage',
    expected_values: {
      intent: 'delta_neutral_yield',
      order_type: 'strategy',
      asset: 'ETH',
      size: 5,
      venue: 'defi',
    },
    context: enrichContext(),
  },
  {
    id: 'L5-004',
    level: 5,
    prompt: 'Borrow 5000 USDC against my 2 ETH collateral',
    rubric_id: 'lending_borrow',
    expected_values: {
      intent: 'borrow',
      order_type: 'loan',
      asset: 'USDC',
      size: 5000,
      venue: 'lending_protocol',
      venue_name: 'aave',
    },
    context: enrichContext(),
  },
  {
    id: 'L5-005',
    level: 5,
    prompt: 'Stake 10 ETH for liquid staking tokens',
    rubric_id: 'liquidity_provision',
    expected_values: {
      intent: 'stake',
      order_type: 'liquid_staking',
      asset: 'ETH',
      size: 10,
      venue: 'staking',
      venue_name: 'lido',
    },
    context: enrichContext(),
  },
  {
    id: 'L6-001',
    level: 6,
    prompt: 'Buy 2 ETH $3,500 calls expiring in 30 days',
    rubric_id: 'options_hedge',
    expected_values: {
      intent: 'buy_call',
      order_type: 'options',
      asset: 'ETH',
      size: 2,
      price: 3500,
      venue: 'options_exchange',
      venue_name: 'deribit',
    },
    context: enrichContext(),
  },
  {
    id: 'L6-002',
    level: 6,
    prompt: 'Set up DCA — buy $500 of BTC weekly for 3 months',
    rubric_id: 'futures_trade',
    expected_values: {
      intent: 'buy',
      order_type: 'dca',
      asset: 'BTC',
      size: 500,
      venue: 'cex',
    },
    context: enrichContext(),
  },
  {
    id: 'L6-003',
    level: 6,
    prompt: 'Create ladder buy orders every $1,000 from $40k to $45k for BTC',
    rubric_id: 'futures_trade',
    expected_values: {
      intent: 'buy',
      order_type: 'ladder_limit',
      asset: 'BTC',
      size: 'multi-order',
      venue: 'cex',
    },
    context: enrichContext(),
  },
  {
    id: 'L6-004',
    level: 6,
    prompt: 'Set a trailing stop 5% below market on my 0.5 BTC',
    rubric_id: 'stop_loss',
    expected_values: {
      intent: 'set_trailing_stop',
      order_type: 'trailing_stop',
      asset: 'BTC',
      size: 0.5,
      venue: 'cex',
    },
    context: enrichContext(),
  },
  {
    id: 'L6-005',
    level: 6,
    prompt: 'Execute a TWAP order to sell 10 ETH over the next 4 hours',
    rubric_id: 'twap_order',
    expected_values: {
      intent: 'sell',
      order_type: 'twap',
      asset: 'ETH',
      size: 10,
      duration: '4 hours',
      venue: 'cex',
    },
    context: enrichContext(),
  },
  {
    id: 'L7-001',
    level: 7,
    prompt: 'Analyze flash loan arbitrage opportunity between DEXes',
    rubric_id: 'arbitrage',
    expected_values: {
      intent: 'analyze_arbitrage',
      order_type: 'analysis',
      asset: 'multi',
      size: 'flash-loan',
      venue: 'dex',
      venue_name: 'defi',
    },
    context: enrichContext(),
  },
  {
    id: 'L7-002',
    level: 7,
    prompt: 'Unwind my underwater position: 5 ETH collateral, 7,000 USDC borrowed',
    rubric_id: 'lending_borrow',
    expected_values: {
      intent: 'deleverage',
      order_type: 'repay',
      asset: 'USDC',
      size: 7000,
      venue: 'lending_protocol',
      venue_name: 'aave',
    },
    context: enrichContext(),
  },
  {
    id: 'L7-003',
    level: 7,
    prompt:
      'I provided liquidity to an ETH/USDC pool when ETH was $3,000. After 30 days, ETH is now $5,000. During this period, I earned $847 in trading fees. My initial position was $10,000. Calculate the net return from the combined effect of impermanent loss and fees on my initial investment.',
    rubric_id: 'lp_net_return_analysis',
    expected_values: {
      intent: 'calculate_lp_return',
      order_type: 'analysis',
      asset: 'ETH/USDC',
      size: 10000,
      venue: 'dex',
      il_percentage: 3.18,
      il_loss_usd: 424,
      net_gain_usd: 423,
      net_return_pct: 4.23,
      hold_value: 13334,
      lp_value: 12910,
      reasoning:
        'Impermanent loss caused $424 loss (3.18%) due to ETH price change from $3,000 to $5,000. Trading fees earned $847. Net effect: $423 gain on initial $10,000 investment, yielding 4.23% return.',
    },
    context: enrichContext({
      initial_eth_price: 3000,
      final_eth_price: 5000,
      time_period_days: 30,
      fees_earned_usd: 847,
      initial_position_usd: 10000,
      pool_type: 'constant_product_amm',
      note:
        'Position started as 50/50 split: 1.6667 ETH + 5000 USDC. Model must synthesize impermanent loss calculation with fee earnings to derive net return on capital.',
    }),
  },
  {
    id: 'L7-004',
    level: 7,
    prompt:
      "I have $100,000 USDC allocated across three DeFi protocols:\n\n50% ($50,000) → Aave USDC Lending\n- APY: 4.2%\n- Risk Score: 1.0\n\n30% ($30,000) → Curve 3pool (USDC/USDT/DAI)\n- APY: 6.8%\n- Risk Score: 2.0\n\n20% ($20,000) → Yearn USDC Vault\n- APY: 8.1%\n- Risk Score: 3.0\n\nThe current risk-free rate (US T-Bills) is 5.0%.\n\nCalculate: (1) the portfolio's blended APY, (2) the portfolio's weighted-average risk score, (3) the portfolio's excess return over the risk-free rate, (4) the portfolio's risk-adjusted return ratio (excess return divided by weighted risk), and (5) the expected annual yield in USD.",
    rubric_id: 'portfolio_efficiency_analysis',
    expected_values: {
      intent: 'calculate_portfolio_efficiency',
      order_type: 'analysis',
      asset: 'USDC',
      size: 100000,
      venue: 'multi_protocol',
      blended_apy: 5.76,
      weighted_risk_score: 1.7,
      excess_return: 0.76,
      risk_adjusted_ratio: 0.45,
      total_annual_yield_usd: 5760,
      allocation: {
        aave: 50000,
        curve: 30000,
        yearn: 20000,
      },
      reasoning:
        'Blended APY: 50%*4.2% + 30%*6.8% + 20%*8.1% = 5.76%. Weighted risk: 50%*1.0 + 30%*2.0 + 20%*3.0 = 1.7. Excess return: 5.76% - 5.0% = 0.76%. Risk-adjusted ratio: 0.76% / 1.7 = 0.45. Total yield: $100k * 5.76% = $5,760.',
    },
    context: enrichContext({
      total_capital: 100000,
      aave_allocation_pct: 0.5,
      curve_allocation_pct: 0.3,
      yearn_allocation_pct: 0.2,
      aave_apy: 4.2,
      curve_apy: 6.8,
      yearn_apy: 8.1,
      aave_risk: 1.0,
      curve_risk: 2.0,
      yearn_risk: 3.0,
      risk_free_rate: 5.0,
      note:
        'Model must chain calculations: blended_apy → excess_return → risk_adjusted_ratio. Each step uses outputs from previous steps.',
    }),
  },
  {
    id: 'L7-005',
    level: 7,
    prompt:
      "I want to sell 100 ETH for USDC. I have three execution options:\n\n" +
      '**Option A: Uniswap (No MEV Protection)**\n' +
      '- Expected slippage: 0.3%\n' +
      '- Gas cost: $50\n' +
      '- MEV risk: 1.2% (average frontrun/sandwich loss)\n\n' +
      '**Option B: CowSwap (MEV Protected)**\n' +
      '- Expected slippage: 0.4%\n' +
      '- Gas cost: $0 (gasless)\n' +
      '- MEV risk: 0%\n\n' +
      '**Option C: 1inch Fusion (Partial MEV Protection)**\n' +
      '- Expected slippage: 0.35%\n' +
      '- Gas cost: $25\n' +
      '- MEV risk: 0.4% (reduced via private RPC)\n\n' +
      'Current ETH price: $3,000\n\n' +
      'Calculate: (1) the total cost percentage for each option (slippage + gas + MEV as % of gross value), (2) the expected net proceeds in USDC for each option, (3) which option maximizes net proceeds, and (4) the dollar amount saved by choosing the best option versus the worst option.\n\n' +
      'Schema hint: Return JSON covering intent, order_type, asset, size, eth_price, gross_value, per-option slippage/gas/mev costs, total_cost, total_cost_pct, net_proceeds, best_option, worst_option, savings_vs_worst, venue, venue_name, reasoning.',
    rubric_id: 'mev_protection_cost_benefit',
    expected_values: {
      intent: 'sell_with_mev_analysis',
      order_type: 'comparative_analysis',
      asset: 'ETH',
      size: 100,
      eth_price: 3000,
      gross_value: 300000,
      uniswap_slippage_cost: 900,
      uniswap_gas_cost: 50,
      uniswap_mev_cost: 3600,
      uniswap_total_cost: 4550,
      uniswap_total_cost_pct: 1.52,
      uniswap_net_proceeds: 295450,
      cowswap_slippage_cost: 1200,
      cowswap_gas_cost: 0,
      cowswap_mev_cost: 0,
      cowswap_total_cost: 1200,
      cowswap_total_cost_pct: 0.4,
      cowswap_net_proceeds: 298800,
      oneinch_slippage_cost: 1050,
      oneinch_gas_cost: 25,
      oneinch_mev_cost: 1200,
      oneinch_total_cost: 2275,
      oneinch_total_cost_pct: 0.76,
      oneinch_net_proceeds: 297725,
      best_option: 'cowswap',
      worst_option: 'uniswap',
      savings_vs_worst: 3350,
      venue: 'dex',
      venue_name: 'cowSwap',
      reasoning:
        'CowSwap provides highest net proceeds ($298,800) with lowest total cost (0.40%). Despite slightly higher slippage (0.4% vs Uniswap 0.3%), eliminating gas and MEV loss saves $3,350 vs Uniswap and $1,075 vs 1inch.',
    },
    context: enrichContext({
      eth_amount: 100,
      eth_price_usd: 3000,
      gross_value_usd: 300000,
      uniswap_slippage_pct: 0.3,
      uniswap_gas_usd: 50,
      uniswap_mev_pct: 1.2,
      cowswap_slippage_pct: 0.4,
      cowswap_gas_usd: 0,
      cowswap_mev_pct: 0.0,
      oneinch_slippage_pct: 0.35,
      oneinch_gas_usd: 25,
      oneinch_mev_pct: 0.4,
      note:
        'Model must synthesize slippage + gas + MEV costs for each option, calculate net proceeds, identify best vs worst venue, and compute savings as the difference in net proceeds.',
    }),
  },
  {
    id: 'L8-001',
    level: 8,
    prompt:
      "You have $5,000,000 USDC to deploy into a 90-day yield strategy combining:\n\nOption 1: Pendle PT-stETH (maturity in 90 days)\n* Current market: 1 PT-stETH = 0.970 stETH (3% discount)\n* At maturity: 1 PT-stETH redeems for 1.000 stETH\n* stETH spot price: $3,500\n* Entry slippage: 0.08%\n\nOption 2: Convex-Boosted Curve 3pool\n* Base Curve APR: 4.2%\n* Convex boost: 2.5x (requires vlCVX lock)\n* vlCVX requirement: 30 tokens per $100,000 staked\n* vlCVX cost: $5.50 per token\n* vlCVX lock: 16 weeks (opportunity cost at 3% annual rate)\n* Entry slippage: 0.05%\n\nCosts:\n* Total gas (PT redemption + Convex operations): $150\n\nConstraints:\n* Maintain ≥35% in Curve 3pool (24h liquidity requirement)\n* Maximum ≤70% in Pendle PT\n\nTask: Calculate the optimal allocation as numerical dollar values and the resulting annualized net yield as a percentage.",
    rubric_id: 'multi_protocol_yield_optimization',
    expected_values: {
      intent: 'multi_protocol_yield_stack',
      order_type: 'pendle_pt_convex_boost',
      asset: 'USDC',
      size: 5000000,
      venue: 'defi_multi',
      venue_name: 'pendle+convex',
      expected_value: 11.55,
      unit: 'annualized_net_yield_percentage',
      allocation: {
        pendle_pt_steth: 3250000,
        convex_curve_3pool: 1750000,
      },
    },
    context: enrichContext({
      total_capital_usdc: 5000000,
      time_horizon_days: 90,
      pendle_pt_steth: {
        discount_price_steth: 0.97,
        redemption_price_steth: 1,
        discount_pct: 0.03,
        entry_slippage: 0.0008,
        steth_spot_usd: 3500,
      },
      convex_curve_3pool: {
        base_apr: 0.042,
        boost_multiplier: 2.5,
        entry_slippage: 0.0005,
      },
      vlcvx: {
        tokens_per_100k: 30,
        cost_per_token_usd: 5.5,
        lock_weeks: 16,
        opportunity_cost_rate: 0.03,
      },
      total_gas_usd: 150,
      allocation_constraints: {
        convex_min_pct: 0.35,
        pendle_max_pct: 0.7,
      },
      note:
        'Blend Pendle PT discount accrual with Convex boosted yield while respecting minimum Curve liquidity and maximum Pendle exposure.',
    }),
  },
  {
    id: 'L8-002',
    level: 8,
    prompt:
      "Execute: $5,000,000 USDC → ETH on Ethereum mainnet.\n\nMarket conditions:\n- ETH price: $2,850\n- Expected sandwich attack loss (public mempool): $22,000\n- Base fee: 150 gwei\n- Block time: 12 seconds\n\nEvaluate MEV defense strategies:\n\n**Strategy A: Flashbots Protect**\n- Setup fee: $180\n- Gas: 320,000 units at 2 gwei priority fee\n- Execution: 2 blocks average (24 seconds)\n- MEV protection: 98.5% (verified benchmark)\n- Success rate: 96% first attempt\n- Retry cost if failed: $65\n\n**Strategy B: Direct DEX (Uniswap V3)**\n- Gas: 180,000 units at 150 gwei base + 20 gwei priority\n- Execution: Immediate (1 block)\n- MEV protection: 0%\n- Expected sandwich loss: $22,000\n- Success rate: 100%\n\nCalculate total expected cost for each strategy and select the optimal one.\n\nNote: Slippage (0.3%) is constant across both strategies.",
    rubric_id: 'execute_mev_defense',
    expected_values: {
      intent: 'execute_mev_defense',
      strategy: 'A',
      expected_total_cost: 651,
      unit: 'USD',
    },
    context: enrichContext({
      eth_price_usd: 2850,
      sandwich_loss_usd: 22000,
      base_fee_gwei: 150,
      block_time_seconds: 12,
      strategies: {
        A: {
          setup_fee_usd: 180,
          gas_units: 320000,
          priority_fee_gwei: 2,
          mev_protection_pct: 98.5,
          success_rate: 0.96,
          retry_cost_usd: 65,
          execution_blocks: 2,
        },
        B: {
          gas_units: 180000,
          priority_fee_gwei: 20,
          mev_protection_pct: 0,
          success_rate: 1.0,
          expected_mev_loss_usd: 22000,
          execution_blocks: 1,
        },
      },
      slippage_pct: 0.3,
      note:
        'Compare expected total costs for Flashbots Protect vs direct Uniswap execution, incorporating gas, fees, residual MEV, and retry probability.',
    }),
  },
  {
    id: 'L8-003',
    level: 8,
    prompt:
      '**Scenario:**\n' +
      'You manage a $1M risk-parity portfolio currently allocated as:\n' +
      '- BTC: $400,000 (40%)\n' +
      '- ETH: $350,000 (35%)\n' +
      '- US 10Y Treasury bonds: $250,000 (25%)\n\n' +
      '**Current Market State:**\n' +
      '- BTC 30-day realized volatility: 60% annualized\n' +
      '- ETH 30-day realized volatility: 80% annualized\n' +
      '- 10Y Treasury volatility: 10% annualized\n' +
      '- Correlation matrix:\n' +
      '  - BTC-ETH: 0.85\n' +
      '  - BTC-Bonds: 0.05\n' +
      '  - ETH-Bonds: 0.03\n\n' +
      '**Risk Parity Target:** Each asset should contribute equally (33.33%) to total portfolio risk.\n\n' +
      '**Rebalancing Trigger:** Execute rebalancing if any asset\'s risk contribution deviates by more than ±5 percentage points from target (i.e., outside 28.33%-38.33% range).\n\n' +
      '**Transaction Constraints:**\n' +
      '- Minimum trade size: $10,000\n' +
      '- Round all trades to nearest $1,000\n' +
      '- Execution slippage: 0.5% for crypto, 0.1% for bonds\n\n' +
      '**Task:**\n' +
      'Determine the current risk contribution of each asset and construct executable rebalancing transactions if the trigger threshold is breached. Your solution must use true risk-parity optimization that accounts for asset correlations.\n\n' +
      '**Formatting rule:** If any calculation is uncertain, output approximate values but do not omit required fields. Use numeric zeros or short strings instead of leaving entries blank.\n\n' +
      'Schema hint: Return JSON including base fields (intent, order_type, asset, size, venue, reasoning) and analysis fields (portfolio_volatility, risk_contributions, rebalancing_required, target_allocations_usd, transactions). Also include top-level numeric mirrors for grading: btc_contribution_pct, eth_contribution_pct, bonds_contribution_pct, target_btc_usd, target_eth_usd, target_bonds_usd, btc_sell_amount, eth_sell_amount, bonds_buy_amount, btc_post_slippage, eth_post_slippage, bonds_post_slippage.',
    rubric_id: 'risk_parity_rebalance',
    expected_values: {
      intent: 'risk_parity',
      order_type: 'analysis',
      asset: 'btc/eth/bonds',
      size: 'risk-weighted',
      venue: 'analysis',
      portfolio_volatility: 50.19,
      btc_contribution_pct: 45.66,
      eth_contribution_pct: 53.89,
      bonds_contribution_pct: 0.45,
      rebalancing_required: true,
      target_btc_usd: 101000,
      target_eth_usd: 77000,
      target_bonds_usd: 822000,
      btc_sell_amount: 299000,
      eth_sell_amount: 273000,
      bonds_buy_amount: 572000,
      btc_post_slippage: 297505,
      eth_post_slippage: 271635,
      bonds_post_slippage: 572572,
    },
    context: enrichContext({
      portfolio_value_usd: 1000000,
      current_allocations_usd: { btc: 400000, eth: 350000, bonds: 250000 },
      volatilities_annualized: { btc: 0.60, eth: 0.80, bonds: 0.10 },
      correlations: {
        btc_eth: 0.85,
        btc_bonds: 0.05,
        eth_bonds: 0.03,
      },
      target_risk_contribution_pct: 33.3333,
      trigger_band_pct: { min: 28.33, max: 38.33 },
      constraints: {
        min_trade_usd: 10000,
        rounding_usd: 1000,
        slippage_crypto: 0.005,
        slippage_bonds: 0.001,
      },
      note:
        'Use correlation-aware risk-parity optimization (equal risk contributions). Compute current contributions, check ±5pp band, compute targets, and construct rounded transactions with post-slippage amounts.',
    }),
  },
  {
    id: 'L8-004',
    level: 8,
    prompt:
      'Optimal Re-staking Strategy with Loan Arbitrage\n\n' +
      'You have 100 ETH currently staked via Lido (earning 4.2% APR as stETH). You\'re considering re-staking strategies to boost yield. In 8 days, you plan to use this position as collateral to borrow 50 ETH at 5.5% APR for a profitable farming opportunity. Analyze these three options:\n\n' +
      '**Option A: EigenLayer AVS Restaking**\n' +
      '- Additional APR: 2.8% (from AVS rewards)\n' +
      '- Slashing risk: 3% of staked amount (annual probability)\n' +
      '- Minimum lock period: 7 days\n' +
      '- Current TVL: $8.2B (highly liquid)\n' +
      '- Accepts stETH as collateral: Yes\n\n' +
      '**Option B: Symbiotic Protocol Restaking**\n' +
      '- Additional APR: 4.1% (from operator fees)\n' +
      '- Slashing risk: 5% of staked amount (annual probability)\n' +
      '- Minimum lock period: 14 days\n' +
      '- Current TVL: $890M (lower liquidity)\n' +
      '- Accepts stETH as collateral: Yes\n\n' +
      '**Option C: Maintain Lido stETH Only**\n' +
      '- Additional APR: 0% (baseline)\n' +
      '- Slashing risk: 0% (no additional risk)\n' +
      '- Minimum lock period: 0 days\n' +
      '- Liquid staking token (instant liquidity)\n' +
      '- Accepts stETH as collateral: Yes\n\n' +
      '**Constraints**\n' +
      '1. Position must be available as collateral within 8 days for the loan (hard requirement)\n' +
      '2. Target minimum net APR after borrowing costs: 1.0%\n' +
      '3. Maximum acceptable slashing risk: 4% of principal\n\n' +
      '**Task**\n' +
      'Determine which strategy maximizes net return while satisfying all constraints. Consider the arbitrage spread between staking yield and borrow costs. Respond with JSON including core execution fields plus decision rationale and detailed factors.\n\n' +
      'Schema hint: Provide top-level keys intent, order_type, asset, size, venue, venue_name, rationale, decision_factors along with flattened numeric mirrors (total_staking_apr, borrow_rate, effective_borrow_cost_on_portfolio, net_apr_after_borrow, meets_net_apr_target, slashing_risk_pct, within_risk_tolerance, liquidity_days, meets_collateral_timing, option_c_net_apr_comparison, option_a_outperformance).',
    rubric_id: 'restaking_optimization',
    expected_values: {
      intent: 'restake',
      order_type: 'liquid_staking',
      asset: 'stETH',
      size: '100',
      venue: 'eigenlayer',
      venue_name: 'eigenlayer',
      total_staking_apr: 7.0,
      borrow_rate: 5.5,
      effective_borrow_cost_on_portfolio: 2.75,
      net_apr_after_borrow: 4.25,
      meets_net_apr_target: true,
      slashing_risk_pct: 3.0,
      within_risk_tolerance: true,
      liquidity_days: 7,
      meets_collateral_timing: true,
      option_c_net_apr_comparison: 1.45,
      option_a_outperformance: 2.8,
    },
    context: enrichContext({
      principal_eth: 100,
      base_staking_apr: 4.2,
      borrow_plan_days: 8,
      borrow_size_eth: 50,
      borrow_rate_apr: 5.5,
      constraints: {
        min_net_apr: 1.0,
        max_slashing_pct: 4,
        collateral_ready_days: 8,
      },
      options: {
        eigenlayer: {
          additional_apr: 2.8,
          slashing_risk_pct: 3,
          lock_days: 7,
          tvl_usd: 8.2e9,
          collateral_ready: true,
        },
        symbiotic: {
          additional_apr: 4.1,
          slashing_risk_pct: 5,
          lock_days: 14,
          tvl_usd: 8.9e8,
          collateral_ready: true,
        },
        lido_only: {
          additional_apr: 0,
          slashing_risk_pct: 0,
          lock_days: 0,
          collateral_ready: true,
        },
      },
      note:
        'Compute portfolio-level APR after borrowing costs and verify collateral timing plus slashing risk constraints before choosing strategy.',
    }),
  },
  {
    id: 'L8-005',
    level: 8,
    prompt:
      'You manage a leveraged ETH yield farming position on Aave with these parameters:\n\n' +
      'Current Position:\n' +
      '- Collateral: 10 ETH deposited ($20,000 at $2,000/ETH)\n' +
      '- Borrowed: $40,000 USDC, used to purchase 20 additional ETH\n' +
      '- Total Exposure: 30 ETH ($60,000)\n' +
      '- Effective Leverage: 3×\n' +
      '- Liquidation Price: $1,400 (30% drop from current)\n\n' +
      'Yield Structure:\n' +
      '- Earning: 8% APY on 30 ETH exposure ($4,800/year)\n' +
      '- Paying: 5% APY on $40,000 debt ($2,000/year)\n' +
      '- Net Carry: $2,800/year = 4.67% APY on $60k exposure\n' +
      '- Weekly Net Carry: $53.85\n\n' +
      'Market Conditions:\n' +
      '- Current ETH Price: $2,000\n' +
      '- 30-day realized volatility: 65% annualized\n' +
      '- Expected 7-day volatility (from options): 95% annualized\n' +
      '- Weekly volatility: 95% / √52 = 13.17%\n\n' +
      'Liquidation Mechanics:\n' +
      '- Aave monitors continuously and liquidates when LTV threshold is breached\n' +
      '- Liquidation cost: $1,000 (5% of collateral penalty)\n' +
      '- Price model: Geometric Brownian Motion with μ=0 (log drift m = -0.5σ² per period)\n' +
      '- EV scope: include carry income minus expected liquidation penalty; exclude mark-to-market P&L (zero drift).\n\n' +
      'Available actions for the next 7 days during a volatility expansion:\n' +
      'A) Maintain 3× leverage (liquidation $1,400, weekly carry $53.85)\n' +
      'B) Deleverage to 2× leverage (liquidation $1,200, weekly carry $42.31)\n' +
      'C) Deleverage to 1.5× leverage (liquidation $1,000, weekly carry $36.54)\n' +
      'D) Close position entirely (zero carry, zero risk)\n\n' +
      'Institutional policy: keep weekly liquidation probability ≤0.5%. Assume barrier-hitting probability for liquidation (continuous monitoring).\n\n' +
      'Task: Identify the optimal risk-adjusted action for a 7-day horizon. Provide liquidation probabilities and expected values for each option and explain your reasoning.\n\n' +
      'Schema hint: Return JSON with keys {action, action_name, liquidation_probabilities, expected_values, reasoning, calculation_method?}. Do not include legacy keys like order_type, asset, venue, risk_controls, follow_up, or requires_follow_up.',
    rubric_id: 'risk_adjusted_leverage',
    expected_values: {
      action: 'B',
      action_name: 'deleverage_to_2x',
      liquidation_probabilities: {
        maintain_3x: 0.00809,
        deleverage_2x: 0.000136,
        deleverage_1_5x: 0.000000202,
      },
      expected_values: {
        maintain_3x: 45.76,
        deleverage_2x: 42.17,
        deleverage_1_5x: 36.54,
        close: 0,
      },
    },
    context: enrichContext({
      position: {
        collateral_eth: 10,
        borrowed_usd: 40000,
        total_exposure_eth: 30,
        current_eth_price: 2000,
        leverage: 3,
        liquidation_price_3x: 1400,
      },
      yields: {
        earn_apy: 0.08,
        borrow_apy: 0.05,
        net_carry_weekly_3x: 53.85,
        net_carry_weekly_2x: 42.31,
        net_carry_weekly_1_5x: 36.54,
      },
      market: {
        realized_volatility_30d: 0.65,
        expected_volatility_7d: 0.95,
        weekly_volatility: 0.1317,
      },
      risk_parameters: {
        liquidation_penalty_usd: 1000,
        horizon_days: 7,
        institutional_threshold_weekly: 0.005,
        price_model: 'gbm_zero_drift',
      },
      actions: {
        maintain_3x: { leverage: 3, liquidation_price: 1400, weekly_carry: 53.85 },
        deleverage_2x: { leverage: 2, liquidation_price: 1200, weekly_carry: 42.31 },
        deleverage_1_5x: { leverage: 1.5, liquidation_price: 1000, weekly_carry: 36.54 },
        close: { leverage: 0, liquidation_price: null, weekly_carry: 0 },
      },
      note:
        'Use log-normal barrier probabilities (or flag endpoint approximation) with σ_weekly ≈ 0.1317, zero drift, and include liquidation penalty in EV calculations. Highlight institutional risk threshold of 0.5% weekly.',
    }),
  },
  {
    id: 'L8-006',
    level: 8,
    prompt:
      'You have 100,000 USDC to deploy into USDe yield strategies.\n\n' +
      '**Current market conditions:**\n\n' +
      'Base Rates:\n' +
      '- USDe staking APY: 8.5%\n' +
      '- Aave USDC supply APY: 4.2%\n' +
      '- Aave USDe borrow APY: 6.8%\n\n' +
      'Pendle Market (PT-USDe expiring in 90 days):\n' +
      '- Implied APY: 12.3%\n' +
      '- Liquidity depth: $45M\n' +
      '- Fixed yield lock until maturity\n\n' +
      'Loop Parameters:\n' +
      '- Max safe leverage on Aave: 3x (LTV 75%, liquidation threshold 80%)\n' +
      '- Gas costs per loop iteration: ~$8\n' +
      '- Pendle PT purchase slippage on 100K: 0.15%\n\n' +
      '**Strategy Options:**\n\n' +
      'A) Simple Stake: Convert to USDe, stake directly (8.5% APY).\n' +
      'B) Leveraged Loop: 3x loop USDe on Aave, stake multiplied amount ((3 × 8.5%) − (2 × 6.8%) = 11.9% APY), risk: liquidation if USDe depegs >2%.\n' +
      'C) Pendle PT: Convert to USDe, buy PT-USDe at 12.3% fixed for 90 days (capital locked).\n' +
      'D) Hybrid: 2x loop on Aave (50K) + Pendle PT (50K) → 11.25% weighted APY, medium diversification.\n\n' +
      '**Constraints:** medium risk tolerance (avoid >3% depeg exposure), 90-day horizon, priority is maximize APY while staying under 3x leverage.\n\n' +
      'Which strategy should you execute? Return JSON following the schema hint.',
    rubric_id: 'fixed_yield_allocation',
    expected_values: {
      intent: 'fixed_yield_allocation',
      strategy: 'fixed_yield',
      asset: 'PT-USDe',
      allocation: 100000,
      venue: 'pendle',
      maturity: '90d',
      expected_apy: 12.3,
      selected_strategy: 'C',
      risk_assessment: 'low',
      meets_constraints: true,
    },
    context: enrichContext({
      capital_usdc: 100000,
      base_rates: {
        usde_stake_apy: 0.085,
        aave_usdc_supply_apy: 0.042,
        aave_usde_borrow_apy: 0.068,
      },
      pendle_market: {
        implied_apy: 0.123,
        liquidity_depth_usd: 45_000_000,
        maturity_days: 90,
      },
      loop_parameters: {
        max_leverage: 3,
        aave_ltv: 0.75,
        liquidation_threshold: 0.8,
        gas_cost_usd: 8,
        slippage_pct: 0.0015,
      },
      strategies: {
        A: { type: 'simple_stake', apy: 0.085 },
        B: { type: 'leveraged_loop', apy: 0.119, leverage: 3, depeg_risk_pct: 0.02 },
        C: { type: 'pendle_pt', apy: 0.123, fixed_term_days: 90 },
        D: { type: 'hybrid', loop_allocation_usd: 50000, pt_allocation_usd: 50000, apy: 0.1125 },
      },
      constraints: {
        risk_tolerance: 'medium',
        max_depeg_exposure_pct: 0.03,
        max_leverage: 3,
        horizon_days: 90,
      },
      note:
        'Evaluate strategies under the stated risk tolerance and horizon. Prefer fixed yield via Pendle if leverage-based strategies violate risk constraints.',
    }),
  },
  {
    id: 'L8-007',
    level: 8,
    prompt:
      'Execute an MEV-resilient emergency unwind: sell 2,500 stETH to ETH with minimal extraction.\n\n' +
      'MARKET CONDITIONS:\n' +
      '- Current stETH/ETH spread: 0.25% (stETH trading at discount)\n' +
      '- Recent MEV extraction on unprotected swaps: average 0.8% per trade\n' +
      '- Requirement: Settlement within 15 minutes to meet margin call\n\n' +
      'VENUE OPTIONS:\n\n' +
      '[A] CowSwap (MEV-Protected)\n' +
      '- Protocol fee: 0.15%\n' +
      '- Settlement time: 12 minutes (batch auction)\n' +
      '- MEV protection: Full (batch auction mechanism)\n' +
      '- Available liquidity: 2,000 stETH per 12-min batch\n' +
      '- Overflow handling: Queued to next batch (+12 minutes)\n\n' +
      '[B] 1inch Fusion (Partial Protection)\n' +
      '- Protocol fee: 0.05%\n' +
      '- Settlement time: Instant\n' +
      '- MEV protection: Partial (~50% reduction via intent routing)\n' +
      '- Available liquidity: 5,000 stETH\n' +
      '- MEV extraction after protection: ~0.4% expected\n\n' +
      '[C] Uniswap V3 (No Protection)\n' +
      '- Pool fee: 0.30%\n' +
      '- Settlement time: Instant\n' +
      '- MEV protection: None\n' +
      '- Available liquidity: 10,000 stETH\n' +
      '- Full MEV exposure: 0.8% expected\n\n' +
      'CONSTRAINTS:\n' +
      '1. Total cost (fees + MEV + spread) must be minimized\n' +
      '2. Settlement MUST occur within 15 minutes (hard deadline)\n' +
      '3. All 2,500 stETH must be sold in single execution window\n' +
      '4. Cannot split across multiple venues\n\n' +
      'DYNAMIC FACTORS:\n' +
      '- stETH discount widens by 0.05% per $500k sell pressure\n' +
      '- Your 2,500 stETH ≈ $4.5M at current price (~$1,800/stETH)\n' +
      '- Additional price impact: ~0.35% for this size\n\n' +
      'COST CALCULATION METHODOLOGY (provide your own calculations):\n\n' +
      'Common Market Cost Components (apply to all venues, compute on notional):\n' +
      '1. Base spread: 0.25% of notional\n' +
      '2. Price impact: 0.35% of notional\n' +
      '3. Dynamic widening: 0.05% per $500k sell pressure (use order notional to compute increments)\n\n' +
      'Venue Parameters (you must combine with common costs to get totals):\n' +
      '[A] CowSwap: protocol fee 0.15%, settlement 12 min batch, MEV protection full, capacity 2,000 stETH per batch; overflow queued to next batch (+12 min).\n' +
      '[B] 1inch Fusion: protocol fee 0.05%, settlement instant, MEV protection partial (~0.4% expected extraction), capacity 5,000 stETH.\n' +
      '[C] Uniswap V3: pool fee 0.30%, settlement instant, MEV protection none (~0.8% expected extraction), capacity 10,000 stETH.\n\n' +
      'Select the optimal venue considering total execution cost, settlement time, capacity, and MEV protection quality. Respond with raw JSON (no code fences) where `expected_value` is the negative USD_total_cost of execution (e.g., -12345) and `unit` MUST be `"USD_total_cost"`. Do not report net proceeds or positive numbers in `expected_value`.',
    rubric_id: 'mev_resilient_unwind',
    expected_values: {
      intent: 'sell',
      order_type: 'protected_swap',
      asset: 'stETH',
      size: 2500,
      venue: 'dex',
      venue_name: '1inch',
      expected_value: -67500,
      unit: 'USD_total_cost',
    },
    context: enrichContext(),
  },
  {
    id: 'L8-008',
    level: 8,
    prompt:
      "You're executing a risk-parity rebalance (buy side only) across BTC, ETH, GLD, and TLT. Calculate the optimal execution strategy.\n\n" +
      'Required trades:\n' +
      '- Buy 0.5 BTC ($22,500)\n' +
      '- Buy 8 ETH ($22,400)\n' +
      '- Buy 1,200 GLD ($222,000)\n' +
      '- Buy 2,400 TLT ($228,000)\n\n' +
      'Venue options:\n' +
      '- Coinbase: Crypto only (BTC/ETH), 0.6% fee, instant execution\n' +
      '- Interactive Brokers: All assets including crypto, 0.1% fee, T+2 settlement\n' +
      '- You may use one venue or split across both\n\n' +
      'Constraints:\n' +
      '- Must execute all 4 legs within same trading day\n' +
      '- Total fees must not exceed $2,000\n' +
      '- Minimize total fees while executing all positions\n\n' +
      'Assumptions: Fees are charged as a percentage of notional with no minimums. Ignore spreads, slippage, and market impact.\n\n' +
      'Output your execution plan with:\n' +
      '1. Venue for each asset\n' +
      '2. Fee calculation per trade\n' +
      '3. Total fees\n' +
      '4. Total execution cost (notional + fees)\n' +
      '5. Reasoning for strategy choice',
    rubric_id: 'risk_parity_execution',
    expected_values: {
      intent: 'execution_strategy',
      strategy: 'interactive_brokers_only',
      execution_plan: [
        {
          asset: 'BTC',
          venue: 'interactive_brokers',
          notional: 22_500,
          fee_rate: 0.001,
          fee_amount: 22.5,
        },
        {
          asset: 'ETH',
          venue: 'interactive_brokers',
          notional: 22_400,
          fee_rate: 0.001,
          fee_amount: 22.4,
        },
        {
          asset: 'GLD',
          venue: 'interactive_brokers',
          notional: 222_000,
          fee_rate: 0.001,
          fee_amount: 222,
        },
        {
          asset: 'TLT',
          venue: 'interactive_brokers',
          notional: 228_000,
          fee_rate: 0.001,
          fee_amount: 228,
        },
      ],
      fee_summary: {
        total_fees: 494.9,
        total_notional: 494_900,
        total_execution_cost: 495_394.9,
      },
      rationale: 'ib_offers_lowest_total_fees_and_supports_all_assets',
      constraints_met: {
        all_assets_tradeable: true,
        same_day_execution: true,
        fees_under_limit: true,
      },
    },
    context: enrichContext({
      trades: [
        { asset: 'BTC', action: 'buy', quantity: 0.5, notional: 22_500 },
        { asset: 'ETH', action: 'buy', quantity: 8, notional: 22_400 },
        { asset: 'GLD', action: 'buy', quantity: 1_200, notional: 222_000 },
        { asset: 'TLT', action: 'buy', quantity: 2_400, notional: 228_000 },
      ],
      venues: [
        {
          name: 'coinbase',
          supported_assets: ['BTC', 'ETH'],
          fee_rate: 0.006,
          settlement: 'instant',
        },
        {
          name: 'interactive_brokers',
          supported_assets: ['BTC', 'ETH', 'GLD', 'TLT'],
          fee_rate: 0.001,
          settlement: 'T+2',
        },
      ],
      constraints: {
        max_total_fees: 2_000,
        execution_window: 'same_trading_day',
        objective: 'minimize_fees',
      },
    }),
  },
  {
    id: 'L8-009',
    level: 8,
    prompt:
      'ETH perpetual funding rate: +0.08% per 8 hours\n' +
      'ETH spot (Coinbase): $2,450\n' +
      'ETH-PERP (Binance): $2,458\n\n' +
      'You have $100,000 USDC available.\n' +
      'Binance ETH-PERP is USDT-margined and requires 1x initial margin (no leverage).\n' +
      'Trading fees: 0.02% maker on both venues\n' +
      'Network transfer fee: $2\n\n' +
      'Should you execute a cash-and-carry arbitrage? If yes, provide your decision, reasoning, and execution approach. Respond in JSON format.',
    rubric_id: 'cash_and_carry_arbitrage',
    expected_values: {
      decision: 'execute',
      reasoning: {
        capital_allocation: {
          spot_usd: 50000,
          margin_usd: 50000,
        },
        position_size_eth: 20.41,
        perp_notional_usd: 50163,
        funding_revenue_daily: 120,
        costs_entry: 22,
        break_even_periods: 1,
        annualized_funding_rate_pct: 87.6,
        annual_roi_on_total_capital_pct: 43.8,
      },
      execution: {
        step_1: 'transfer_50k_usdt_to_binance_for_margin',
        step_2: 'buy_20.41_eth_spot_coinbase_maker',
        step_3: 'short_20.41_eth_perp_binance_maker',
        delta_neutral: true,
        exit_trigger: 'funding_negative_3_consecutive_periods',
      },
    },
    context: enrichContext({
      capital_usdc: 100000,
      prices: {
        spot_eth_usd: 2450,
        perp_eth_usd: 2458,
      },
      funding: {
        rate_per_8h: 0.0008,
        periods_per_day: 3,
      },
      fees: {
        maker_pct: 0.0002,
        network_fee_usd: 2,
      },
      margin: {
        venue: 'binance',
        product: 'eth-perp_usdt',
        leverage: 1,
        initial_margin_requirement: 1,
      },
      note:
        'Assume maker fees and no leverage on Binance. Capital split must fund spot purchase and perp margin. Funding collected every 8 hours.',
    }),
  },
  {
    id: 'L8-010',
    level: 8,
    prompt:
      'You hold 10 BTC currently worth $45,000 each. Construct a 30-day collar that balances downside protection with upside participation under the following market conditions:\n\n' +
      'Market conditions:\n' +
      '- 30-day ATM implied volatility: 65%\n' +
      '- Recent 30-day realized volatility: 55%\n' +
      '- Put skew is 20-30% more expensive than calls\n\n' +
      'Available 30-day strikes (per BTC premium, positive = credit received, negative = debit paid):\n' +
      '- Calls: 5% OTM ($47,250) +$850 | 10% OTM ($49,500) +$420\n' +
      '- Puts: 5% OTM ($42,750) -$920 | 10% OTM ($40,500) -$480\n\n' +
      'Portfolio context:\n' +
      '- Portfolio historically captures ~80% of BTC upside moves\n' +
      '- Historical 30-day BTC move distribution: median +8%, 90th percentile +18%\n' +
      '- Holding period: full 30 days\n\n' +
      'Objective: choose the collar that minimizes total economic cost (option premium plus opportunity cost from capped upside) while satisfying:\n' +
      '- Avoid overpaying for overpriced puts\n' +
      '- Maintain meaningful downside protection\n' +
      '- Preserve reasonable upside potential\n\n' +
      'Respond with a JSON object detailing the selected collar.',
    rubric_id: 'collar_min_cost',
    expected_values: {
      intent: 'collar',
      order_type: 'options',
      asset: 'BTC',
      size: 10,
      call_strike: 49500,
      put_strike: 40500,
      net_cost_per_btc: -60,
      venue: 'options_exchange',
      venue_name: 'deribit',
      expiry_days: 30,
    },
    context: enrichContext({
      holdings: {
        asset: 'BTC',
        quantity: 10,
        reference_price_usd: 45000,
      },
      market: {
        atm_iv_30d: 0.65,
        realized_vol_30d: 0.55,
        put_skew_overpricing_pct: 0.25,
      },
      strikes: [
        { type: 'call', strike_usd: 47250, moneyness_pct: 0.05, premium_per_btc: 850 },
        { type: 'call', strike_usd: 49500, moneyness_pct: 0.10, premium_per_btc: 420 },
        { type: 'put', strike_usd: 42750, moneyness_pct: -0.05, premium_per_btc: -920 },
        { type: 'put', strike_usd: 40500, moneyness_pct: -0.10, premium_per_btc: -480 },
      ],
      portfolio: {
        upside_capture_ratio: 0.8,
        median_move_pct: 0.08,
        p90_move_pct: 0.18,
        holding_period_days: 30,
      },
      objective: 'Minimize total economic cost while balancing downside protection and upside participation',
      notes: [
        'Total economic cost = premium paid + opportunity cost of capped upside',
        'Put skew is expensive; avoid unnecessary premium outlay',
        'BTC upside distribution favors structures that keep higher caps intact',
      ],
    }),
  }
];

export interface CalibrationExample {
  question_id: string;
  response: Record<string, unknown>;
  expected: boolean;
}

export const CALIBRATION_EXAMPLES: CalibrationExample[] = [
  {
    question_id: 'L1-001',
    response: {
      intent: 'buy',
      order_type: 'market',
      asset: 'BTC',
      size: '0.5',
      venue: 'cex',
      risk_controls: {
        slippage_tolerance: '0.5%',
      },
    },
    expected: true,
  },
  {
    question_id: 'L1-002',
    response: {
      intent: 'buy',
      order_type: 'limit',
      asset: 'SOL',
      size: '10',
      price: '95',
      venue: 'cex',
    },
    expected: true,
  },
  {
    question_id: 'L2-002',
    response: {
      intent: 'buy',
      order_type: 'market',
      asset: 'PEPE',
      size: '100000',
      venue: 'dex',
      venue_name: 'memecoin pool',
      risk_controls: {
        slippage_tolerance: '15%',
      },
    },
    expected: true,
  },
  {
    question_id: 'L3-001',
    response: {
      intent: 'bridge_and_swap',
      order_type: 'bridge',
      asset: 'USDC',
      size: '1000',
      venue: 'bridge',
      venue_name: 'arbitrum bridge',
    },
    expected: true,
  },
  {
    question_id: 'L5-004',
    response: {
      intent: 'borrow',
      order_type: 'loan',
      asset: 'USDC',
      size: '5000',
      venue: 'lending_protocol',
      venue_name: 'aave',
    },
    expected: true,
  },
  {
    question_id: 'L6-001',
    response: {
      intent: 'buy_call',
      order_type: 'options',
      asset: 'ETH',
      size: '2',
      price: '3500',
      venue: 'options_exchange',
      venue_name: 'deribit',
    },
    expected: true,
  },
  {
    question_id: 'L8-009',
    response: {
      intent: 'cash_and_carry',
      order_type: 'basis_trade',
      asset: 'ETH',
      size: 'delta-neutral',
      venue: 'derivatives',
    },
    expected: true,
  },
  {
    question_id: 'L1-001',
    response: {
      intent: 'sell',
      order_type: 'market',
      asset: 'BTC',
      size: '0.5',
      venue: 'cex',
    },
    expected: false,
  },
  {
    question_id: 'L2-002',
    response: {
      intent: 'buy',
      order_type: 'market',
      asset: 'DOGE',
      size: '100000',
      venue: 'cex',
    },
    expected: false,
  },
  {
    question_id: 'L3-001',
    response: {
      intent: 'bridge',
      order_type: 'bridge',
      asset: 'USDC',
      size: '1000',
      venue: 'cex',
    },
    expected: false,
  },
  {
    question_id: 'L7-002',
    response: {
      intent: 'add_leverage',
      order_type: 'borrow_more',
      asset: 'USDC',
      size: '2000',
      venue: 'lending_protocol',
    },
    expected: false,
  },
  {
    question_id: 'L8-007',
    response: {
      intent: 'sell',
      order_type: 'market',
      asset: 'stETH',
      size: '2500',
      venue: 'cex',
    },
    expected: false,
  },
];
