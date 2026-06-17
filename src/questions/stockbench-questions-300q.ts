import type { SchemaQuestion } from '../types/schema';
import { STOCKBENCH_GENERATED_QUESTIONS } from './stockbench-generated-questions';

// StockBench pilot questions. Kept separate from the active TradeBench 300Q suite
// until anchors are audited and intentionally wired into a run script.
export const STOCKBENCH_QUESTIONS_300Q: SchemaQuestion[] = [
  {
    id: 'SB-L4-001',
    level: 4,
    type: 'schema',
    rubric_id: 'stockbench-l4-001',
    prompt:
      'Frozen market snapshot:\n' +
      '- Timestamp: 2026-03-10 15:30:00 America/New_York.\n' +
      '- Jurisdiction / account regime: US Reg-T margin account.\n' +
      '- Account base currency: USD.\n' +
      '- Instrument: AAPL common stock.\n' +
      '- AAPL mark price: 180.00 USD per share.\n' +
      '- Proposed position: short 500 AAPL shares.\n' +
      '- Borrow availability: locate is available for exactly 500 shares.\n' +
      '- Borrow rate: 8.40% APR, simple interest, Actual/360 day count.\n' +
      '- Holding period: 17 calendar days.\n' +
      '- Fees, dividends, price movement, and compounding: ignore.\n\n' +
      'Task:\n' +
      'Compute the dollar borrow cost for carrying the short for the full 17-day period. Use only this frozen packet.\n\n' +
      'Output JSON fields:\n' +
      '{ "intent", "order_type", "asset", "size", "price", "borrow_days", "borrow_cost_usd", "venue", "reasoning" }',
    expected_values: {
      intent: 'calculate_borrow_cost',
      order_type: 'analysis',
      asset: 'AAPL',
      size: 500,
      price: 180,
      borrow_days: 17,
      borrow_cost_usd: 357,
      venue: 'broker_margin_account',
    },
    context: {
      benchmark: 'StockBench',
      stockbench: {
        primary_domain: 'Shorting / borrow / margin / locates',
        tier: 'L4',
        capability_tag: 'judgment_risk_augmentation',
        scenario_family: 'borrow_cost_calendar',
        feasibility_trap: false,
        deterministic_grading_fields: ['borrow_days', 'borrow_cost_usd'],
      },
      frozen_packet: {
        symbol: 'AAPL',
        side: 'short',
        shares: 500,
        price_usd: 180,
        borrow_rate_apr: 0.084,
        day_count: 'Actual/360',
        holding_days: 17,
        formula: 'shares * price_usd * borrow_rate_apr * holding_days / 360',
      },
      canonical_answer: {
        short_notional_usd: 90000,
        borrow_cost_usd: 357,
      },
    },
  },
  {
    id: 'SB-L9-001',
    level: 9,
    type: 'schema',
    rubric_id: 'stockbench-l9-001',
    prompt:
      'Frozen market snapshot:\n' +
      '- Timestamp: 2026-04-21 10:15:00 America/New_York.\n' +
      '- Jurisdiction / account regime: US portfolio margin account.\n' +
      '- Account base currency: USD.\n' +
      '- Portfolio: long-only US equity book, market value 2,400,000 USD, beta to S&P 500 = 1.15.\n' +
      '- Objective: reduce beta-dollar exposure by at least 60% by today close while minimizing upfront hedge cost.\n' +
      '- Cash available for premiums/fees: 75,000 USD.\n' +
      '- Remaining futures initial-margin capacity: 100,000 USD.\n' +
      '- Permissions: equities allowed, listed options level 2 allowed, CME equity index futures allowed, CFDs unavailable.\n' +
      '- ES quote: 5,000.00 index points.\n' +
      '- ES contract spec: E-mini S&P 500 futures, multiplier 50 USD per index point, initial margin 13,000 USD per contract.\n' +
      '- ES execution cost: 25 USD slippage/fees per contract. Assume beta hedge notional = ES price * multiplier * contracts.\n' +
      '- SPY quote: 500.00 USD.\n' +
      '- SPY put chain: 30-day 500 strike put, delta -0.45, premium 8.20 USD per share, multiplier 100 shares, max executable size 60 contracts.\n' +
      '- SPY option execution cost: included in premium. Ignore gamma and vega after trade.\n' +
      '- Settlement/calendar: all trades can be opened today; do not use live data.\n\n' +
      'Task:\n' +
      'Choose the feasible hedge that satisfies the 60% beta-dollar reduction target at the lowest upfront hedge cost. Reject infeasible or inferior routes.\n\n' +
      'Objective:\n' +
      'Minimize upfront hedge cost subject to beta_reduction_pct >= 60, cash cost <= 75,000, and futures margin_used <= 100,000.\n\n' +
      'Output JSON fields:\n' +
      '{ "decision", "selected_instrument", "es_contracts", "hedge_notional_usd", "beta_reduction_pct", "margin_used", "expected_cost", "feasibility", "rejected_routes", "reasoning" }',
    expected_values: {
      decision: 'hedge',
      selected_instrument: 'ES',
      es_contracts: 7,
      hedge_notional_usd: 1750000,
      beta_reduction_pct: 63.41,
      margin_used: 91000,
      expected_cost: 175,
      feasibility: 'feasible',
      rejected_routes: [
        'spy_puts_liquidity_fail',
        'mixed_puts_es_higher_cost',
        'cfds_unavailable',
      ],
    },
    context: {
      benchmark: 'StockBench',
      stockbench: {
        primary_domain: 'Futures / commodities / spreads / rolls',
        tier: 'L9',
        capability_tag: 'execution_action_quality',
        scenario_family: 'futures_beta_hedge',
        feasibility_trap: true,
        objective_function: 'minimize upfront hedge cost subject to beta_reduction_pct >= 60, cash cost <= 75000, and margin_used <= 100000',
        deterministic_grading_fields: [
          'selected_instrument',
          'es_contracts',
          'hedge_notional_usd',
          'beta_reduction_pct',
          'margin_used',
          'expected_cost',
          'rejected_routes',
        ],
      },
      frozen_packet: {
        portfolio_market_value_usd: 2400000,
        portfolio_beta: 1.15,
        beta_dollars_usd: 2760000,
        target_reduction_pct: 60,
        target_beta_reduction_usd: 1656000,
        es: {
          price: 5000,
          multiplier: 50,
          notional_per_contract_usd: 250000,
          margin_per_contract_usd: 13000,
          execution_cost_per_contract_usd: 25,
        },
        spy_put: {
          delta_abs: 0.45,
          premium_per_share_usd: 8.2,
          multiplier: 100,
          max_contracts: 60,
          beta_hedge_per_contract_usd: 22500,
        },
      },
      canonical_answer: {
        es_contracts: 7,
        hedge_notional_usd: 1750000,
        beta_reduction_pct: 63.41,
        margin_used: 91000,
        expected_cost: 175,
      },
    },
  },
  {
    id: 'SB-AGI-001',
    level: 11,
    type: 'schema',
    rubric_id: 'stockbench-agi-001',
    prompt:
      'Frozen market snapshot:\n' +
      '- Timestamp: 2026-05-14 15:20:00 America/New_York.\n' +
      '- Jurisdiction / account regime: US Reg-T margin account.\n' +
      '- Account base currency: USD.\n' +
      '- Market session: regular US equity session, all orders must be accepted before 15:55 ET.\n' +
      '- Permissions: US equities allowed, listed options level 2 allowed, CME ES futures allowed, CFDs unavailable, no new short sales without a locate.\n' +
      '- Cash available: 60,000 USD.\n' +
      '- Remaining futures initial-margin capacity: 14,000 USD.\n' +
      '- Current positions at frozen marks: long 1,000 SPY at 500.00; short 500 AAPL at 180.00.\n' +
      '- Borrow/locate constraint: the AAPL locate is being recalled. You must buy to cover at least 300 AAPL shares by 15:55 ET. New AAPL or SPY shorts are not permitted because no new locate is available.\n' +
      '- AAPL cover quote: ask 181.00, commission 0.005 USD/share, exactly 300 shares are executable in this packet.\n' +
      '- SPY quote: 500.00.\n' +
      '- SPY 1-day 495 put: premium 4.00 USD/share, delta -0.40, multiplier 100 shares, max executable size 10 contracts.\n' +
      '- ES quote: 5,000.00, multiplier 50 USD/index point, initial margin 13,000 USD/contract, slippage/fees 25 USD/contract.\n' +
      '- CFD route: unavailable in this US account.\n' +
      '- Settlement/calendar: equity trades settle T+1, futures variation margin is same day, ignore interest and dividends.\n' +
      '- Required overnight beta hedge: after satisfying the borrow recall, reduce SPY beta-dollar exposure by at least 45%.\n\n' +
      'Frozen next-day scenarios for evaluating PnL relative to current marks and including immediate execution costs:\n' +
      '- Scenario A risk-off: SPY 470.00, ES 4,700.00, AAPL 176.00.\n' +
      '- Scenario B tech squeeze: SPY 510.00, ES 5,100.00, AAPL 190.00.\n' +
      '- Scenario C index-flat AAPL squeeze: SPY 500.00, ES 5,000.00, AAPL 195.00.\n\n' +
      'Task:\n' +
      'Synthesize the valid action plan. It must satisfy the AAPL recall, satisfy the beta hedge, keep cash nonnegative, stay within futures margin, and reject invalid routes.\n\n' +
      'Objective:\n' +
      'Among feasible plans, maximize worst-case PnL across the frozen scenarios. If two feasible plans tie on worst-case PnL, choose the lower immediate execution cost.\n\n' +
      'Output JSON fields:\n' +
      '{ "decision", "chosen_strategy", "execution_sequence", "aapl_buy_to_cover_shares", "aapl_cover_cash_used", "es_contracts", "spy_put_contracts", "option_premium_paid", "margin_used", "cash_after_execution", "beta_reduction_pct", "scenario_pnl", "worst_case_pnl", "feasibility", "rejected_routes", "self_check", "reasoning" }',
    expected_values: {
      decision: 'trade',
      chosen_strategy: 'cover_recall_sell_1_es_buy_5_spy_puts',
      execution_sequence: ['buy_to_cover_300_AAPL', 'sell_1_ES', 'buy_5_SPY_495_puts'],
      aapl_buy_to_cover_shares: 300,
      aapl_cover_cash_used: 54301.5,
      es_contracts: 1,
      spy_put_contracts: 5,
      option_premium_paid: 2000,
      margin_used: 13000,
      cash_after_execution: 3673.5,
      beta_reduction_pct: 70,
      scenario_pnl: {
        risk_off: -4026.5,
        tech_squeeze: 673.5,
        index_flat_aapl_squeeze: -5326.5,
      },
      worst_case_pnl: -5326.5,
      feasibility: 'feasible',
      rejected_routes: [
        'no_cover_violates_borrow_recall',
        'sell_2_ES_violates_margin',
        'put_only_fails_beta_target',
        'buy_10_puts_with_es_worse_worst_case',
        'SPY_CFD_unavailable_US',
      ],
      self_check: [
        'borrow_recall_satisfied',
        'beta_reduction_70_pct',
        'margin_within_limit',
        'cash_nonnegative',
        'no_cfd_or_new_short',
        'worst_case_optimized_at_5_puts',
      ],
    },
    context: {
      benchmark: 'StockBench',
      stockbench: {
        primary_domain: 'Feasibility / rejection / no-trade traps',
        tier: 'AGI',
        capability_tag: 'execution_action_quality',
        scenario_family: 'borrow_recall_margin_hedge',
        feasibility_trap: true,
        objective_function: 'maximize worst-case PnL across frozen scenarios, with feasibility constraints binding before PnL ranking',
        deterministic_grading_fields: [
          'chosen_strategy',
          'execution_sequence',
          'aapl_buy_to_cover_shares',
          'aapl_cover_cash_used',
          'es_contracts',
          'spy_put_contracts',
          'option_premium_paid',
          'margin_used',
          'cash_after_execution',
          'beta_reduction_pct',
          'scenario_pnl',
          'worst_case_pnl',
          'rejected_routes',
          'self_check',
        ],
      },
      frozen_packet: {
        cash_usd: 60000,
        futures_margin_capacity_usd: 14000,
        positions: {
          SPY: { side: 'long', shares: 1000, mark: 500 },
          AAPL: { side: 'short', shares: 500, mark: 180 },
        },
        required_actions: {
          aapl_min_buy_to_cover: 300,
          beta_reduction_min_pct: 45,
        },
        quotes: {
          AAPL_cover_ask: 181,
          AAPL_commission_per_share: 0.005,
          ES: { price: 5000, multiplier: 50, margin_per_contract: 13000, slippage_per_contract: 25 },
          SPY_put_495_1d: { premium_per_share: 4, delta_abs: 0.4, multiplier: 100, max_contracts: 10 },
        },
      },
      canonical_answer: {
        strategy: 'cover_recall_sell_1_es_buy_5_spy_puts',
        cash_after_execution: 3673.5,
        beta_reduction_pct: 70,
        scenario_pnl: {
          risk_off: -4026.5,
          tech_squeeze: 673.5,
          index_flat_aapl_squeeze: -5326.5,
        },
        worst_case_pnl: -5326.5,
      },
    },
  },
  {
    id: 'SB-L1-001',
    level: 1,
    type: 'schema',
    rubric_id: 'stockbench-l1-001',
    prompt:
      'Frozen market snapshot:\n' +
      '- Timestamp: 2026-04-02 10:00:00 America/New_York.\n' +
      '- Instrument: SPY ETF, trading on NYSE Arca.\n' +
      '- User instruction: Buy 100 SPY with a day limit order at 499.50 USD.\n\n' +
      'Task: Return the order ticket fields from the instruction. Use only this frozen packet.\n\n' +
      'Output JSON fields: { "decision", "instrument", "side", "quantity", "order_type", "limit_price", "time_in_force", "venue" }',
    expected_values: {
      decision: 'trade',
      instrument: 'SPY',
      side: 'buy',
      quantity: 100,
      order_type: 'limit',
      limit_price: 499.5,
      time_in_force: 'day',
      venue: 'NYSE Arca',
    },
    context: {
      benchmark: 'StockBench',
      stockbench: {
        primary_domain: 'Spot equities / ETFs',
        tier: 'L1',
        capability_tag: 'execution_action_quality',
        scenario_family: 'equity_order_ticket',
        feasibility_trap: false,
        deterministic_grading_fields: ['instrument', 'side', 'quantity', 'order_type', 'limit_price'],
      },
    },
  },
  {
    id: 'SB-L2-001',
    level: 2,
    type: 'schema',
    rubric_id: 'stockbench-l2-001',
    prompt:
      'Frozen market snapshot:\n' +
      '- Instrument: CL crude oil futures.\n' +
      '- CL price: 78.40 USD/barrel.\n' +
      '- Contract multiplier: 1,000 barrels per contract.\n' +
      '- Position: long 2 contracts.\n\n' +
      'Task: Compute the total notional exposure in USD. Use only this frozen packet.\n\n' +
      'Output JSON fields: { "decision", "instrument", "contracts", "multiplier", "price", "notional_usd" }',
    expected_values: {
      decision: 'calculate',
      instrument: 'CL',
      contracts: 2,
      multiplier: 1000,
      price: 78.4,
      notional_usd: 156800,
    },
    context: {
      benchmark: 'StockBench',
      stockbench: {
        primary_domain: 'Futures / commodities / spreads / rolls',
        tier: 'L2',
        capability_tag: 'judgment_risk_augmentation',
        scenario_family: 'futures_notional_math',
        feasibility_trap: false,
        deterministic_grading_fields: ['contracts', 'multiplier', 'price', 'notional_usd'],
      },
      canonical_answer: { notional_usd: 2 * 1000 * 78.4 },
    },
  },
  {
    id: 'SB-L3-001',
    level: 3,
    type: 'schema',
    rubric_id: 'stockbench-l3-001',
    prompt:
      'Frozen market snapshot:\n' +
      '- Instrument: EURUSD spot FX, quoted USD per EUR.\n' +
      '- Position: long 200,000 EUR.\n' +
      '- Entry price: 1.0820.\n' +
      '- Exit price: 1.0865.\n' +
      '- Brokerage fee: 25 USD total.\n\n' +
      'Task: Compute gross and net USD PnL. Use only this frozen packet.\n\n' +
      'Output JSON fields: { "decision", "instrument", "eur_notional", "gross_pnl_usd", "fee_usd", "net_pnl_usd" }',
    expected_values: {
      decision: 'calculate',
      instrument: 'EURUSD',
      eur_notional: 200000,
      gross_pnl_usd: 900,
      fee_usd: 25,
      net_pnl_usd: 875,
    },
    context: {
      benchmark: 'StockBench',
      stockbench: {
        primary_domain: 'Spot FX / CFDs / multi-currency',
        tier: 'L3',
        capability_tag: 'judgment_risk_augmentation',
        scenario_family: 'fx_pnl_conversion',
        feasibility_trap: false,
        deterministic_grading_fields: ['gross_pnl_usd', 'fee_usd', 'net_pnl_usd'],
      },
      canonical_answer: { gross_pnl_usd: 200000 * (1.0865 - 1.082), net_pnl_usd: 875 },
    },
  },
  {
    id: 'SB-L5-001',
    level: 5,
    type: 'schema',
    rubric_id: 'stockbench-l5-001',
    prompt:
      'Frozen market snapshot:\n' +
      '- Timestamp: 2026-04-08 15:45:00 America/New_York, regular US equity session.\n' +
      '- Instrument: MSFT common stock on NASDAQ.\n' +
      '- Current position: long 800 MSFT shares.\n' +
      '- Instruction: Sell 800 MSFT with a day limit order at 415.25 USD. No short sale is allowed.\n\n' +
      'Task: Map the instruction into a valid order ticket. Use only this frozen packet.\n\n' +
      'Output JSON fields: { "decision", "instrument", "side", "quantity", "order_type", "limit_price", "time_in_force", "venue", "feasibility" }',
    expected_values: {
      decision: 'trade',
      instrument: 'MSFT',
      side: 'sell',
      quantity: 800,
      order_type: 'limit',
      limit_price: 415.25,
      time_in_force: 'day',
      venue: 'NASDAQ',
      feasibility: 'feasible',
    },
    context: {
      benchmark: 'StockBench',
      stockbench: {
        primary_domain: 'Execution / liquidity / microstructure',
        tier: 'L5',
        capability_tag: 'execution_action_quality',
        scenario_family: 'session_limit_order_ticket',
        feasibility_trap: false,
        deterministic_grading_fields: ['side', 'quantity', 'order_type', 'limit_price', 'feasibility'],
      },
    },
  },
  {
    id: 'SB-L6-001',
    level: 6,
    type: 'schema',
    rubric_id: 'stockbench-l6-001',
    prompt:
      'Frozen market snapshot:\n' +
      '- Jurisdiction / account regime: US cash brokerage account.\n' +
      '- Trade date: Monday 2026-06-15.\n' +
      '- Holiday calendar: no market or bank holiday on 2026-06-15 or 2026-06-16.\n' +
      '- US equities settlement rule: T+1 business day.\n' +
      '- Trade: sell 200 SPY shares at 500.00 USD.\n\n' +
      'Task: Determine the settlement date and when sale proceeds become settled cash. Use only this frozen packet.\n\n' +
      'Output JSON fields: { "decision", "instrument", "trade_date", "settlement_rule", "settlement_date", "settled_cash_usd", "withdrawal_allowed_date" }',
    expected_values: {
      decision: 'settlement_schedule',
      instrument: 'SPY',
      trade_date: '2026-06-15',
      settlement_rule: 'T+1',
      settlement_date: '2026-06-16',
      settled_cash_usd: 100000,
      withdrawal_allowed_date: '2026-06-16',
    },
    context: {
      benchmark: 'StockBench',
      stockbench: {
        primary_domain: 'Corporate actions / settlement / calendar / jurisdiction',
        tier: 'L6',
        capability_tag: 'execution_action_quality',
        scenario_family: 't_plus_one_settlement_sequence',
        feasibility_trap: true,
        deterministic_grading_fields: ['settlement_date', 'settled_cash_usd', 'withdrawal_allowed_date'],
      },
    },
  },
  {
    id: 'SB-L7-001',
    level: 7,
    type: 'schema',
    rubric_id: 'stockbench-l7-001',
    prompt:
      'Frozen market snapshot:\n' +
      '- Portfolio: long 800 SPY at 500.00, beta 1.00; long 500 QQQ at 420.00, beta 1.20.\n' +
      '- Constraint: reduce portfolio beta-dollar exposure to at most 550,000 USD by selling only QQQ.\n' +
      '- QQQ trade price: 420.00. Fractional shares are not allowed.\n' +
      '- Ignore fees, taxes, and slippage.\n\n' +
      'Task: Compute the minimum whole QQQ shares to sell and the resulting beta-dollar exposure. Use only this frozen packet.\n\n' +
      'Output JSON fields: { "decision", "instrument", "side", "quantity", "current_beta_dollars", "target_max_beta_dollars", "post_trade_beta_dollars" }',
    expected_values: {
      decision: 'rebalance',
      instrument: 'QQQ',
      side: 'sell',
      quantity: 203,
      current_beta_dollars: 652000,
      target_max_beta_dollars: 550000,
      post_trade_beta_dollars: 549688,
    },
    context: {
      benchmark: 'StockBench',
      stockbench: {
        primary_domain: 'Portfolio risk / rebalancing',
        tier: 'L7',
        capability_tag: 'judgment_risk_augmentation',
        scenario_family: 'beta_dollar_rebalance',
        feasibility_trap: false,
        deterministic_grading_fields: ['quantity', 'current_beta_dollars', 'post_trade_beta_dollars'],
      },
      canonical_answer: { current_beta_dollars: 800 * 500 + 500 * 420 * 1.2, post_trade_beta_dollars: 549688 },
    },
  },
  {
    id: 'SB-L8-001',
    level: 8,
    type: 'schema',
    rubric_id: 'stockbench-l8-001',
    prompt:
      'Frozen market snapshot:\n' +
      '- Position: long 100 AAPL shares and short 1 AAPL 175 call expiring in 2 days.\n' +
      '- AAPL stock price: 181.00.\n' +
      '- Short call premium to buy back: 6.50 per share. Intrinsic value: 6.00 per share. Remaining extrinsic value: 0.50 per share.\n' +
      '- Ex-dividend date: tomorrow. Cash dividend: 1.20 per share.\n' +
      '- Option multiplier: 100 shares.\n' +
      '- Assignment-risk rule in this packet: if dividend > remaining extrinsic value, early assignment risk is material and must be avoided.\n\n' +
      'Task: Choose whether to leave the covered call open or buy it back before ex-dividend. Use only this frozen packet.\n\n' +
      'Output JSON fields: { "decision", "instrument", "action", "contracts", "premium_paid", "assignment_risk", "reason_code" }',
    expected_values: {
      decision: 'reduce_assignment_risk',
      instrument: 'AAPL_175_call',
      action: 'buy_to_close',
      contracts: 1,
      premium_paid: 650,
      assignment_risk: 'material',
      reason_code: 'dividend_exceeds_extrinsic',
    },
    context: {
      benchmark: 'StockBench',
      stockbench: {
        primary_domain: 'Listed options strategy / Greeks',
        tier: 'L8',
        capability_tag: 'execution_action_quality',
        scenario_family: 'covered_call_assignment',
        feasibility_trap: true,
        deterministic_grading_fields: ['action', 'contracts', 'premium_paid', 'assignment_risk', 'reason_code'],
      },
    },
  },
  {
    id: 'SB-L9-002',
    level: 9,
    type: 'schema',
    rubric_id: 'stockbench-l9-002',
    prompt:
      'Frozen market snapshot:\n' +
      '- Account: US margin account. Short selling requires a locate before order entry.\n' +
      '- Target bearish exposure: as close as possible to short 1,000 TSLA shares without violating constraints.\n' +
      '- TSLA quote: 250.00. Locate availability: exactly 400 TSLA shares.\n' +
      '- TSLA 30-day 240 put: delta -0.35, premium 8.00 per share, multiplier 100, max executable 20 contracts.\n' +
      '- Cash available for option premium: 6,000 USD.\n' +
      '- Ignore borrow cost, fees, and gamma after trade.\n\n' +
      'Task: Choose the feasible bearish implementation that maximizes bearish delta-share exposure. Reject invalid routes.\n\n' +
      'Objective: maximize bearish_delta_shares subject to locate shares <= 400 and option premium <= 6,000.\n\n' +
      'Output JSON fields: { "decision", "chosen_strategy", "short_shares", "put_contracts", "premium_paid", "bearish_delta_shares", "feasibility", "rejected_routes", "reasoning" }',
    expected_values: {
      decision: 'trade',
      chosen_strategy: 'short_locate_plus_puts',
      short_shares: 400,
      put_contracts: 7,
      premium_paid: 5600,
      bearish_delta_shares: 645,
      feasibility: 'feasible',
      rejected_routes: ['short_1000_no_locate', 'buy_8_puts_cash_exceeded'],
    },
    context: {
      benchmark: 'StockBench',
      stockbench: {
        primary_domain: 'Shorting / borrow / margin / locates',
        tier: 'L9',
        capability_tag: 'execution_action_quality',
        scenario_family: 'short_locate_failure',
        feasibility_trap: true,
        objective_function: 'maximize bearish delta-share exposure subject to locate and cash constraints',
        deterministic_grading_fields: ['short_shares', 'put_contracts', 'premium_paid', 'bearish_delta_shares', 'rejected_routes'],
      },
    },
  },
  {
    id: 'SB-L9-003',
    level: 9,
    type: 'schema',
    rubric_id: 'stockbench-l9-003',
    prompt:
      'Frozen market snapshot:\n' +
      '- Position: long 1,000 SPY shares at 500.00.\n' +
      '- Downside scenario for grading: SPY closes at 450.00 at option expiry.\n' +
      '- Constraint: scenario PnL including option premium must be no worse than -30,000 USD.\n' +
      '- Option multiplier: 100 shares. Need exactly 10 spreads to hedge 1,000 shares.\n' +
      '- Candidate A: buy 10 SPY 500 puts at 12.00 and sell 10 SPY 480 puts at 2.00.\n' +
      '- Candidate B: buy 10 SPY 500 puts at 12.00 and sell 10 SPY 470 puts at 4.00.\n' +
      '- Candidate C: buy 10 SPY 500 puts at 12.00 and sell 10 SPY 460 puts at 3.00.\n' +
      '- Fees and early exercise: ignore.\n\n' +
      'Task: Select the lowest-premium put spread that satisfies the downside floor.\n\n' +
      'Objective: minimize net premium subject to scenario_pnl_usd >= -30,000.\n\n' +
      'Output JSON fields: { "decision", "chosen_strategy", "buy_put_strike", "sell_put_strike", "contracts", "net_premium_paid", "scenario_pnl_usd", "feasibility", "rejected_routes", "reasoning" }',
    expected_values: {
      decision: 'hedge',
      chosen_strategy: 'SPY_500_470_put_spread',
      buy_put_strike: 500,
      sell_put_strike: 470,
      contracts: 10,
      net_premium_paid: 8000,
      scenario_pnl_usd: -28000,
      feasibility: 'feasible',
      rejected_routes: ['unhedged_floor_fail', 'SPY_500_480_put_spread_floor_fail', 'SPY_500_460_put_spread_higher_cost'],
    },
    context: {
      benchmark: 'StockBench',
      stockbench: {
        primary_domain: 'Listed options strategy / Greeks',
        tier: 'L9',
        capability_tag: 'execution_action_quality',
        scenario_family: 'put_spread_downside_floor',
        feasibility_trap: false,
        objective_function: 'minimize net premium while keeping frozen downside scenario PnL >= -30000',
        deterministic_grading_fields: ['buy_put_strike', 'sell_put_strike', 'net_premium_paid', 'scenario_pnl_usd'],
      },
    },
  },
  {
    id: 'SB-L9-004',
    level: 9,
    type: 'schema',
    rubric_id: 'stockbench-l9-004',
    prompt:
      'Frozen market snapshot:\n' +
      '- Account base currency: USD.\n' +
      '- Required payment: 1,000,000 EUR due today by 17:00 Europe/Berlin.\n' +
      '- Current time: 2026-05-05 09:00 America/New_York.\n' +
      '- Same-day EUR purchase route: EURUSD 1.1010, settles today, fee included.\n' +
      '- Standard spot EURUSD route: 1.1000, settles T+2, fee included.\n' +
      '- One-day forward route: 1.1004, settles tomorrow, fee included.\n' +
      '- CFD route: unavailable for payment and unavailable in this account.\n\n' +
      'Task: Choose the valid route that meets the payment deadline at the lowest USD cost. Reject invalid settlement routes.\n\n' +
      'Objective: minimize USD cost subject to EUR funds being settled today before the payment deadline.\n\n' +
      'Output JSON fields: { "decision", "chosen_route", "eur_amount", "usd_cost", "settlement_date", "feasibility", "rejected_routes", "reasoning" }',
    expected_values: {
      decision: 'convert_fx',
      chosen_route: 'same_day_EURUSD',
      eur_amount: 1000000,
      usd_cost: 1101000,
      settlement_date: '2026-05-05',
      feasibility: 'feasible',
      rejected_routes: ['standard_spot_T_plus_2_late', 'one_day_forward_late', 'cfd_unavailable_for_payment'],
    },
    context: {
      benchmark: 'StockBench',
      stockbench: {
        primary_domain: 'Spot FX / CFDs / multi-currency',
        tier: 'L9',
        capability_tag: 'judgment_risk_augmentation',
        scenario_family: 'fx_settlement_mismatch',
        feasibility_trap: true,
        objective_function: 'minimize USD cost subject to same-day settled EUR availability',
        deterministic_grading_fields: ['chosen_route', 'usd_cost', 'settlement_date', 'rejected_routes'],
      },
    },
  },
  {
    id: 'SB-L9-005',
    level: 9,
    type: 'schema',
    rubric_id: 'stockbench-l9-005',
    prompt:
      'Frozen market snapshot:\n' +
      '- Portfolio beta-dollar exposure to reduce: 1,000,000 USD.\n' +
      '- Target: reduce beta-dollar exposure by at least 30%.\n' +
      '- Margin capacity: 20,000 USD.\n' +
      '- ES quote: 5,000, multiplier 50, margin 13,000, slippage/fees 25 per contract.\n' +
      '- MES quote: 5,000, multiplier 5, margin 1,300, slippage/fees 5 per contract.\n' +
      '- SPY put package: reduces beta dollars by 320,000, premium 12,000.\n' +
      '- Objective uses upfront cost only; margin is a constraint, not cost.\n\n' +
      'Task: Choose the lowest upfront-cost feasible hedge that reduces beta exposure by at least 30%.\n\n' +
      'Objective: minimize upfront cost subject to beta_reduction_pct >= 30 and margin_used <= 20,000.\n\n' +
      'Output JSON fields: { "decision", "chosen_strategy", "es_contracts", "mes_contracts", "beta_reduction_usd", "beta_reduction_pct", "margin_used", "expected_cost", "feasibility", "rejected_routes", "reasoning" }',
    expected_values: {
      decision: 'hedge',
      chosen_strategy: 'sell_1_ES_and_4_MES',
      es_contracts: 1,
      mes_contracts: 4,
      beta_reduction_usd: 350000,
      beta_reduction_pct: 35,
      margin_used: 18200,
      expected_cost: 45,
      feasibility: 'feasible',
      rejected_routes: ['sell_1_ES_fails_target', 'sell_2_ES_exceeds_margin', 'SPY_put_package_higher_cost'],
    },
    context: {
      benchmark: 'StockBench',
      stockbench: {
        primary_domain: 'Portfolio risk / rebalancing',
        tier: 'L9',
        capability_tag: 'judgment_risk_augmentation',
        scenario_family: 'cross_asset_beta_trim',
        feasibility_trap: false,
        objective_function: 'minimize upfront hedge cost subject to beta reduction and margin constraints',
        deterministic_grading_fields: ['es_contracts', 'mes_contracts', 'beta_reduction_pct', 'margin_used', 'expected_cost'],
      },
    },
  },
  {
    id: 'SB-L9-006',
    level: 9,
    type: 'schema',
    rubric_id: 'stockbench-l9-006',
    prompt:
      'Frozen market snapshot:\n' +
      '- Instrument: AMD common stock.\n' +
      '- Mid price: 100.00. Maximum average execution price: 100.20.\n' +
      '- Need: buy as many shares as possible up to 50,000 shares using the visible ask book.\n' +
      '- Ask book: 10,000 @ 100.05; 15,000 @ 100.10; 20,000 @ 100.30; 30,000 @ 100.60.\n' +
      '- Fees: ignore. Partial fills at a level are allowed.\n\n' +
      'Task: Compute the maximum buy quantity that keeps average price <= 100.20.\n\n' +
      'Objective: maximize filled_shares subject to average_price <= 100.20 and filled_shares <= 50,000.\n\n' +
      'Output JSON fields: { "decision", "instrument", "side", "filled_shares", "average_price", "limit_price", "feasibility", "rejected_routes", "reasoning" }',
    expected_values: {
      decision: 'trade',
      instrument: 'AMD',
      side: 'buy',
      filled_shares: 47500,
      average_price: 100.2,
      limit_price: 100.6,
      feasibility: 'feasible',
      rejected_routes: ['buy_50000_exceeds_slippage_limit'],
    },
    context: {
      benchmark: 'StockBench',
      stockbench: {
        primary_domain: 'Execution / liquidity / microstructure',
        tier: 'L9',
        capability_tag: 'execution_action_quality',
        scenario_family: 'order_book_liquidity_limit',
        feasibility_trap: true,
        objective_function: 'maximize fill quantity subject to average execution price cap',
        deterministic_grading_fields: ['filled_shares', 'average_price', 'limit_price'],
      },
    },
  },
  {
    id: 'SB-L9-007',
    level: 9,
    type: 'schema',
    rubric_id: 'stockbench-l9-007',
    prompt:
      'Frozen market snapshot:\n' +
      '- Instrument: KO common stock.\n' +
      '- Existing GTC sell stop order: 1,000 KO shares, stop price 60.00.\n' +
      '- Corporate action: ordinary cash dividend 0.44 per share, ex-dividend tomorrow.\n' +
      '- Broker rule in this packet: GTC equity stop prices are reduced by the ordinary cash dividend on ex-dividend date.\n' +
      '- Listed option strikes are not adjusted for ordinary cash dividends in this packet.\n' +
      '- Current short option: short 10 KO 62.50 calls. No strike adjustment applies.\n\n' +
      'Task: Determine the adjusted stop price and whether the option strike changes. Use only this frozen packet.\n\n' +
      'Objective: apply the corporate-action adjustment rule exactly and reject dividend-only trigger logic.\n\n' +
      'Output JSON fields: { "decision", "instrument", "adjusted_stop_price", "option_strike_adjusted", "option_strike_after", "feasibility", "rejected_routes", "reasoning" }',
    expected_values: {
      decision: 'adjust_order_for_ex_dividend',
      instrument: 'KO',
      adjusted_stop_price: 59.56,
      option_strike_adjusted: false,
      option_strike_after: 62.5,
      feasibility: 'feasible',
      rejected_routes: ['leave_stop_at_60', 'adjust_option_strike_for_ordinary_dividend', 'treat_dividend_drop_as_stop_trigger'],
    },
    context: {
      benchmark: 'StockBench',
      stockbench: {
        primary_domain: 'Corporate actions / settlement / calendar / jurisdiction',
        tier: 'L9',
        capability_tag: 'judgment_risk_augmentation',
        scenario_family: 'ex_dividend_adjustment',
        feasibility_trap: true,
        objective_function: 'apply frozen corporate-action adjustment rules without using unstated market data',
        deterministic_grading_fields: ['adjusted_stop_price', 'option_strike_adjusted', 'option_strike_after', 'rejected_routes'],
      },
    },
  },
  {
    id: 'SB-L10-001',
    level: 10,
    type: 'schema',
    rubric_id: 'stockbench-l10-001',
    prompt:
      'Frozen market snapshot:\n' +
      '- Position: long 1,000 SPY shares at 500.00.\n' +
      '- Downside grading shock: SPY 460.00 at option expiry.\n' +
      '- Constraint: shock PnL including premium must be no worse than -25,000 USD.\n' +
      '- Cash available for option premium: 10,000 USD. Futures margin capacity: 10,000 USD.\n' +
      '- Candidate A collar: buy 10 SPY 480 puts at 6.00 and sell 10 SPY 530 calls at 3.00.\n' +
      '- Candidate B collar: buy 10 SPY 470 puts at 4.00 and sell 10 SPY 530 calls at 3.00.\n' +
      '- Candidate C: short 1 ES future, ES quote 5,000, multiplier 50, initial margin 13,000, execution cost 25.\n' +
      '- Option multiplier: 100 shares. Ignore dividends, early exercise, and taxes.\n\n' +
      'Task: Choose the lowest-cost feasible downside hedge.\n\n' +
      'Objective: minimize upfront cost subject to shock_pnl_usd >= -25,000, cash <= 10,000, and futures margin <= 10,000.\n\n' +
      'Output JSON fields: { "decision", "chosen_strategy", "put_strike", "call_strike", "contracts", "net_premium_paid", "shock_pnl_usd", "feasibility", "rejected_routes", "reasoning" }',
    expected_values: {
      decision: 'hedge',
      chosen_strategy: 'SPY_480_530_collar',
      put_strike: 480,
      call_strike: 530,
      contracts: 10,
      net_premium_paid: 3000,
      shock_pnl_usd: -23000,
      feasibility: 'feasible',
      rejected_routes: ['SPY_470_530_collar_floor_fail', 'short_ES_margin_exceeded'],
    },
    context: {
      benchmark: 'StockBench',
      stockbench: {
        primary_domain: 'Listed options strategy / Greeks',
        tier: 'L10',
        capability_tag: 'execution_action_quality',
        scenario_family: 'collar_plus_futures_overlay',
        feasibility_trap: false,
        objective_function: 'minimize upfront hedge cost subject to downside floor and cash/margin constraints',
        deterministic_grading_fields: ['put_strike', 'call_strike', 'net_premium_paid', 'shock_pnl_usd', 'rejected_routes'],
      },
    },
  },
  {
    id: 'SB-L10-002',
    level: 10,
    type: 'schema',
    rubric_id: 'stockbench-l10-002',
    prompt:
      'Frozen market snapshot:\n' +
      '- Position: long 4 CL June futures contracts.\n' +
      '- Requirement: roll out of June before first-notice risk today.\n' +
      '- CL multiplier: 1,000 barrels per contract.\n' +
      '- June CL bid/ask: 78.20 / 78.22.\n' +
      '- July CL bid/ask: 78.85 / 78.87.\n' +
      '- Roll execution: sell June at bid and buy July at ask.\n' +
      '- Exchange/broker fee: 4 USD per contract per leg.\n\n' +
      'Task: Build the roll order and compute total roll debit including fees.\n\n' +
      'Objective: eliminate June delivery risk while preserving 4-contract long CL exposure at minimum executable roll cost.\n\n' +
      'Output JSON fields: { "decision", "chosen_strategy", "sell_contract", "buy_contract", "contracts", "roll_debit_usd", "fees_usd", "total_cost_usd", "feasibility", "rejected_routes", "reasoning" }',
    expected_values: {
      decision: 'roll',
      chosen_strategy: 'sell_June_buy_July_CL',
      sell_contract: 'CL_June',
      buy_contract: 'CL_July',
      contracts: 4,
      roll_debit_usd: 2680,
      fees_usd: 32,
      total_cost_usd: 2712,
      feasibility: 'feasible',
      rejected_routes: ['hold_June_into_first_notice', 'use_mid_prices_not_executable'],
    },
    context: {
      benchmark: 'StockBench',
      stockbench: {
        primary_domain: 'Futures / commodities / spreads / rolls',
        tier: 'L10',
        capability_tag: 'execution_action_quality',
        scenario_family: 'futures_roll_calendar',
        feasibility_trap: true,
        objective_function: 'preserve exposure and eliminate first-notice risk at minimum executable bid/ask roll cost',
        deterministic_grading_fields: ['contracts', 'roll_debit_usd', 'fees_usd', 'total_cost_usd', 'rejected_routes'],
      },
    },
  },
  {
    id: 'SB-L10-003',
    level: 10,
    type: 'schema',
    rubric_id: 'stockbench-l10-003',
    prompt:
      'Frozen market snapshot:\n' +
      '- Position: short 1,500 GME shares at 20.00.\n' +
      '- Borrow recall: buy to cover at least 900 shares today.\n' +
      '- GME cover ask: 22.10. Commission: 0.01 USD/share.\n' +
      '- Cash available: 30,000 USD.\n' +
      '- GME 30-day 20 put: delta -0.50, premium 2.00 per share, multiplier 100, max executable 9 contracts.\n' +
      '- No new GME short sales are allowed because no locate remains.\n\n' +
      'Task: Satisfy the recall and maximize remaining bearish delta with listed puts under the cash and liquidity constraints.\n\n' +
      'Objective: maximize bearish_delta_shares after recall subject to cash >= 0, put contracts <= 9, and no new shorts.\n\n' +
      'Output JSON fields: { "decision", "chosen_strategy", "buy_to_cover_shares", "put_contracts", "cash_used", "bearish_delta_shares", "feasibility", "rejected_routes", "reasoning" }',
    expected_values: {
      decision: 'trade',
      chosen_strategy: 'cover_recall_buy_9_puts',
      buy_to_cover_shares: 900,
      put_contracts: 9,
      cash_used: 21699,
      bearish_delta_shares: 1050,
      feasibility: 'feasible',
      rejected_routes: ['skip_recall', 'new_short_without_locate', 'buy_10_puts_liquidity_exceeded'],
    },
    context: {
      benchmark: 'StockBench',
      stockbench: {
        primary_domain: 'Shorting / borrow / margin / locates',
        tier: 'L10',
        capability_tag: 'execution_action_quality',
        scenario_family: 'hard_to_borrow_margin_recall',
        feasibility_trap: true,
        objective_function: 'maximize remaining bearish delta after mandatory recall cover under cash/liquidity constraints',
        deterministic_grading_fields: ['buy_to_cover_shares', 'put_contracts', 'cash_used', 'bearish_delta_shares', 'rejected_routes'],
      },
    },
  },
  {
    id: 'SB-L10-004',
    level: 10,
    type: 'schema',
    rubric_id: 'stockbench-l10-004',
    prompt:
      'Frozen market snapshot:\n' +
      '- Portfolio equity beta-dollar exposure: 960,000 USD.\n' +
      '- Objective: reduce equity beta-dollar exposure by at least 40% before today close.\n' +
      '- Futures margin capacity: 30,000 USD.\n' +
      '- ES quote: 5,000, multiplier 50, margin 13,000, execution cost 25 per contract.\n' +
      '- SPY put package: beta reduction 420,000 USD, premium cost 18,000 USD.\n' +
      '- Cash for premiums: 15,000 USD.\n' +
      '- Ignore basis, dividends, and taxes.\n\n' +
      'Task: Choose the feasible hedge with lowest upfront cost that meets the beta-reduction target.\n\n' +
      'Objective: minimize upfront cost subject to beta_reduction_pct >= 40, futures margin <= 30,000, and premium cash <= 15,000.\n\n' +
      'Output JSON fields: { "decision", "chosen_strategy", "es_contracts", "beta_reduction_usd", "beta_reduction_pct", "margin_used", "expected_cost", "feasibility", "rejected_routes", "reasoning" }',
    expected_values: {
      decision: 'hedge',
      chosen_strategy: 'sell_2_ES',
      es_contracts: 2,
      beta_reduction_usd: 500000,
      beta_reduction_pct: 52.08,
      margin_used: 26000,
      expected_cost: 50,
      feasibility: 'feasible',
      rejected_routes: ['sell_1_ES_fails_target', 'SPY_put_package_cash_exceeded'],
    },
    context: {
      benchmark: 'StockBench',
      stockbench: {
        primary_domain: 'Portfolio risk / rebalancing',
        tier: 'L10',
        capability_tag: 'judgment_risk_augmentation',
        scenario_family: 'multi_asset_drawdown_hedge',
        feasibility_trap: false,
        objective_function: 'minimize upfront hedge cost while satisfying beta-reduction and cash/margin constraints',
        deterministic_grading_fields: ['es_contracts', 'beta_reduction_pct', 'margin_used', 'expected_cost', 'rejected_routes'],
      },
    },
  },
  {
    id: 'SB-L10-005',
    level: 10,
    type: 'schema',
    rubric_id: 'stockbench-l10-005',
    prompt:
      'Frozen market snapshot:\n' +
      '- Account: US cash account. US ETF settlement rule: T+1.\n' +
      '- Trade date: 2026-06-17. No market holiday on trade date or next business day.\n' +
      '- Current position: long 1,000 XLK at 210.00.\n' +
      '- Target order: reduce technology exposure and add utilities exposure by buying 1,500 XLU at 70.00.\n' +
      '- Cash before trades: 0 USD.\n' +
      '- Broker permits same-day paired ETF sell/buy if both settle T+1 and net cash is nonnegative on settlement.\n' +
      '- Fees: ignore.\n\n' +
      'Task: Determine the paired rebalance and settlement cash outcome.\n\n' +
      'Objective: complete the rebalance without creating a settlement cash deficit.\n\n' +
      'Output JSON fields: { "decision", "chosen_strategy", "sell_instrument", "sell_shares", "buy_instrument", "buy_shares", "settlement_date", "net_settlement_cash_usd", "feasibility", "rejected_routes", "reasoning" }',
    expected_values: {
      decision: 'rebalance',
      chosen_strategy: 'sell_XLK_buy_XLU_same_trade_date',
      sell_instrument: 'XLK',
      sell_shares: 1000,
      buy_instrument: 'XLU',
      buy_shares: 1500,
      settlement_date: '2026-06-18',
      net_settlement_cash_usd: 105000,
      feasibility: 'feasible',
      rejected_routes: ['withdraw_sale_proceeds_on_trade_date', 'buy_more_than_settlement_proceeds'],
    },
    context: {
      benchmark: 'StockBench',
      stockbench: {
        primary_domain: 'Spot equities / ETFs',
        tier: 'L10',
        capability_tag: 'execution_action_quality',
        scenario_family: 'etf_sector_rebalance_t_plus_one',
        feasibility_trap: true,
        objective_function: 'complete paired ETF rebalance while respecting T+1 settlement cash constraints',
        deterministic_grading_fields: ['sell_shares', 'buy_shares', 'settlement_date', 'net_settlement_cash_usd', 'rejected_routes'],
      },
    },
  },
  {
    id: 'SB-L10-006',
    level: 10,
    type: 'schema',
    rubric_id: 'stockbench-l10-006',
    prompt:
      'Frozen market snapshot:\n' +
      '- Position: short 10 MSFT 420 calls expiring in 3 days; no long stock.\n' +
      '- MSFT stock price: 425.00.\n' +
      '- Ex-dividend date: tomorrow. Dividend: 0.80 per share.\n' +
      '- Short call buy-to-close ask: 5.30. Intrinsic: 5.00. Extrinsic: 0.30.\n' +
      '- Available roll: sell 10 MSFT 435 calls expiring in 31 days at 1.20 bid.\n' +
      '- Multiplier: 100 shares. Fees: ignore.\n' +
      '- Rule in this packet: if dividend exceeds extrinsic value, avoid overnight short-call assignment risk.\n\n' +
      'Task: Choose the valid adjustment and compute net debit.\n\n' +
      'Objective: remove material early-assignment risk while keeping short-call exposure via the stated roll at minimum net debit.\n\n' +
      'Output JSON fields: { "decision", "chosen_strategy", "buy_to_close_contracts", "sell_to_open_contracts", "new_call_strike", "net_debit_usd", "assignment_risk_removed", "feasibility", "rejected_routes", "reasoning" }',
    expected_values: {
      decision: 'roll',
      chosen_strategy: 'buy_close_420_sell_open_435',
      buy_to_close_contracts: 10,
      sell_to_open_contracts: 10,
      new_call_strike: 435,
      net_debit_usd: 4100,
      assignment_risk_removed: true,
      feasibility: 'feasible',
      rejected_routes: ['hold_short_420_calls_through_ex_div', 'exercise_not_applicable_short_call'],
    },
    context: {
      benchmark: 'StockBench',
      stockbench: {
        primary_domain: 'Listed options strategy / Greeks',
        tier: 'L10',
        capability_tag: 'execution_action_quality',
        scenario_family: 'early_assignment_dividend_risk',
        feasibility_trap: true,
        objective_function: 'remove assignment risk and preserve short-call exposure at stated executable roll prices',
        deterministic_grading_fields: ['new_call_strike', 'net_debit_usd', 'assignment_risk_removed', 'rejected_routes'],
      },
    },
  },
  {
    id: 'SB-L10-007',
    level: 10,
    type: 'schema',
    rubric_id: 'stockbench-l10-007',
    prompt:
      'Frozen market snapshot:\n' +
      '- Account holder: US retail customer. Account base currency: USD.\n' +
      '- Objective: obtain 200,000 EUR exposure for a supplier payment settling T+2.\n' +
      '- CFD permissions: CFDs unavailable for this jurisdiction.\n' +
      '- Spot EURUSD route: buy EUR at 1.0902, settles T+2, fee included.\n' +
      '- EUR futures route: one 6E contract is 125,000 EUR, margin 2,750 USD per contract. Margin capacity: 2,000 USD.\n' +
      '- Cash available: 230,000 USD.\n\n' +
      'Task: Choose the feasible route that satisfies the payment exposure and settlement need.\n\n' +
      'Objective: satisfy the T+2 EUR need with the lowest valid USD cash cost while rejecting unavailable or margin-infeasible routes.\n\n' +
      'Output JSON fields: { "decision", "chosen_route", "eur_amount", "usd_cost", "settlement_date_rule", "feasibility", "rejected_routes", "reasoning" }',
    expected_values: {
      decision: 'convert_fx',
      chosen_route: 'spot_EURUSD_T_plus_2',
      eur_amount: 200000,
      usd_cost: 218040,
      settlement_date_rule: 'T+2',
      feasibility: 'feasible',
      rejected_routes: ['cfd_unavailable_US_retail', 'EUR_futures_margin_exceeded'],
    },
    context: {
      benchmark: 'StockBench',
      stockbench: {
        primary_domain: 'Spot FX / CFDs / multi-currency',
        tier: 'L10',
        capability_tag: 'judgment_risk_augmentation',
        scenario_family: 'cfd_margin_regional_constraint',
        feasibility_trap: true,
        objective_function: 'satisfy EUR exposure need with lowest valid cash cost under regional and margin constraints',
        deterministic_grading_fields: ['chosen_route', 'eur_amount', 'usd_cost', 'rejected_routes'],
      },
    },
  },
  {
    id: 'SB-AGI-002',
    level: 11,
    type: 'schema',
    rubric_id: 'stockbench-agi-002',
    prompt:
      'Frozen market snapshot:\n' +
      '- Position: short 1,000 NVDA shares at 120.00.\n' +
      '- Borrow recall: exactly 700 shares must be bought to cover today.\n' +
      '- NVDA cover ask: 121.00. Commission: 0.005 USD/share.\n' +
      '- No new NVDA short sales are allowed; no locate remains.\n' +
      '- Cash available: 100,000 USD.\n' +
      '- NVDA 30-day 115 put: delta -0.40, premium 3.00 per share, multiplier 100, max executable 10 contracts.\n' +
      '- Required post-adjustment bearish exposure: at least 500 delta-shares.\n\n' +
      'Task: Synthesize the valid adjustment that satisfies recall and bearish-exposure constraints at minimum option premium.\n\n' +
      'Objective: minimize option premium subject to recall cover, no new shorts, cash >= 0, and bearish_delta_shares >= 500.\n\n' +
      'Output JSON fields: { "decision", "chosen_strategy", "buy_to_cover_shares", "put_contracts", "cash_used", "bearish_delta_shares", "feasibility", "rejected_routes", "self_check", "reasoning" }',
    expected_values: {
      decision: 'trade',
      chosen_strategy: 'cover_700_buy_5_puts',
      buy_to_cover_shares: 700,
      put_contracts: 5,
      cash_used: 86203.5,
      bearish_delta_shares: 500,
      feasibility: 'feasible',
      rejected_routes: ['skip_recall', 'new_short_without_locate', 'buy_4_puts_fails_delta'],
      self_check: ['recall_satisfied', 'bearish_delta_500', 'cash_nonnegative', 'no_new_short'],
    },
    context: {
      benchmark: 'StockBench',
      stockbench: {
        primary_domain: 'Shorting / borrow / margin / locates',
        tier: 'AGI',
        capability_tag: 'execution_action_quality',
        scenario_family: 'locate_recall_options_substitution',
        feasibility_trap: true,
        objective_function: 'minimize option premium while satisfying recall and bearish delta constraints',
        deterministic_grading_fields: ['buy_to_cover_shares', 'put_contracts', 'cash_used', 'bearish_delta_shares', 'rejected_routes', 'self_check'],
      },
    },
  },
  {
    id: 'SB-AGI-003',
    level: 11,
    type: 'schema',
    rubric_id: 'stockbench-agi-003',
    prompt:
      'Frozen market snapshot:\n' +
      '- Position: long 5 SPY 500 calls and short 5 SPY 510 calls expiring today.\n' +
      '- SPY stock price: 512.00.\n' +
      '- Long 500 call bid: 12.20. Short 510 call ask to close: 2.30.\n' +
      '- Option multiplier: 100. Cash available: 20,000 USD.\n' +
      '- Exercise of 5 long 500 calls would require 250,000 USD, which is unavailable.\n' +
      '- Assignment/exercise risk must be closed before expiration.\n\n' +
      'Task: Choose the valid expiration-day handling action and compute proceeds.\n\n' +
      'Objective: eliminate expiration exercise/assignment risk while maximizing executable cash proceeds under the cash constraint.\n\n' +
      'Output JSON fields: { "decision", "chosen_strategy", "sell_to_close_long_calls", "buy_to_close_short_calls", "net_credit_usd", "exercise_required_cash_usd", "feasibility", "rejected_routes", "self_check", "reasoning" }',
    expected_values: {
      decision: 'close_spread',
      chosen_strategy: 'sell_long_calls_buy_short_calls',
      sell_to_close_long_calls: 5,
      buy_to_close_short_calls: 5,
      net_credit_usd: 4950,
      exercise_required_cash_usd: 250000,
      feasibility: 'feasible',
      rejected_routes: ['exercise_long_calls_cash_unavailable', 'let_expire_assignment_risk'],
      self_check: ['cash_constraint_checked', 'assignment_risk_removed', 'spread_closed'],
    },
    context: {
      benchmark: 'StockBench',
      stockbench: {
        primary_domain: 'Listed options strategy / Greeks',
        tier: 'AGI',
        capability_tag: 'execution_action_quality',
        scenario_family: 'exercise_assignment_roll_decision',
        feasibility_trap: true,
        objective_function: 'maximize executable proceeds while removing expiration exercise/assignment risk under cash constraint',
        deterministic_grading_fields: ['net_credit_usd', 'exercise_required_cash_usd', 'rejected_routes', 'self_check'],
      },
    },
  },
  {
    id: 'SB-AGI-004',
    level: 11,
    type: 'schema',
    rubric_id: 'stockbench-agi-004',
    prompt:
      'Frozen market snapshot:\n' +
      '- Account: futures account using the simplified SPAN margin figures in this packet.\n' +
      '- Objective: add crude-oil carry exposure with margin_used <= 10,000 USD.\n' +
      '- Strategy A: long 3 outright CL contracts, expected carry 1,800 USD, SPAN margin 24,000 USD.\n' +
      '- Strategy B: long 6 CL June / short 6 CL July calendar spreads, expected carry 1,200 USD, SPAN margin 9,000 USD.\n' +
      '- Strategy C: long 2 outright CL contracts, expected carry 1,100 USD, SPAN margin 16,000 USD.\n' +
      '- Execution fees are included. Ignore basis beyond expected carry.\n\n' +
      'Task: Select the feasible strategy with the highest expected carry.\n\n' +
      'Objective: maximize expected_carry_usd subject to SPAN margin_used <= 10,000.\n\n' +
      'Output JSON fields: { "decision", "chosen_strategy", "spread_count", "expected_carry_usd", "margin_used", "feasibility", "rejected_routes", "self_check", "reasoning" }',
    expected_values: {
      decision: 'trade',
      chosen_strategy: 'CL_June_July_calendar_spread',
      spread_count: 6,
      expected_carry_usd: 1200,
      margin_used: 9000,
      feasibility: 'feasible',
      rejected_routes: ['strategy_A_margin_exceeded', 'strategy_C_margin_exceeded'],
      self_check: ['span_margin_within_limit', 'highest_feasible_carry_selected'],
    },
    context: {
      benchmark: 'StockBench',
      stockbench: {
        primary_domain: 'Futures / commodities / spreads / rolls',
        tier: 'AGI',
        capability_tag: 'execution_action_quality',
        scenario_family: 'span_margin_calendar_spread',
        feasibility_trap: true,
        objective_function: 'maximize expected carry subject to frozen SPAN margin constraint',
        deterministic_grading_fields: ['chosen_strategy', 'spread_count', 'expected_carry_usd', 'margin_used', 'rejected_routes'],
      },
    },
  },
  {
    id: 'SB-AGI-005',
    level: 11,
    type: 'schema',
    rubric_id: 'stockbench-agi-005',
    prompt:
      'Frozen market snapshot:\n' +
      '- Objective: reduce 1-day stress loss by at least 100,000 USD before the close.\n' +
      '- Cash available for hedges: 30,000 USD. Futures margin capacity: 20,000 USD.\n' +
      '- Action A: buy SPY put package, stress-loss reduction 120,000 USD, premium 25,000 USD, margin 0.\n' +
      '- Action B: sell 2 ES futures, stress-loss reduction 100,000 USD, cost 50 USD, margin 26,000 USD.\n' +
      '- Action C: sell HYG block, stress-loss reduction 45,000 USD, cost 300 USD, margin 0.\n' +
      '- Action D: sell 1 ES future plus sell HYG block, stress-loss reduction 95,000 USD, cost 325 USD, margin 13,000 USD.\n\n' +
      'Task: Select the feasible action set that satisfies the stress-loss target with the lowest valid cash cost.\n\n' +
      'Objective: minimize cash cost subject to stress_loss_reduction_usd >= 100,000, hedge_cash <= 30,000, and margin_used <= 20,000.\n\n' +
      'Output JSON fields: { "decision", "chosen_strategy", "stress_loss_reduction_usd", "hedge_cash_used", "margin_used", "feasibility", "rejected_routes", "self_check", "reasoning" }',
    expected_values: {
      decision: 'hedge',
      chosen_strategy: 'buy_SPY_put_package',
      stress_loss_reduction_usd: 120000,
      hedge_cash_used: 25000,
      margin_used: 0,
      feasibility: 'feasible',
      rejected_routes: ['sell_2_ES_margin_exceeded', 'sell_HYG_block_fails_target', 'sell_1_ES_plus_HYG_fails_target'],
      self_check: ['stress_reduction_target_met', 'cash_within_limit', 'margin_within_limit'],
    },
    context: {
      benchmark: 'StockBench',
      stockbench: {
        primary_domain: 'Portfolio risk / rebalancing',
        tier: 'AGI',
        capability_tag: 'judgment_risk_augmentation',
        scenario_family: 'multi_asset_drawdown_hedge',
        feasibility_trap: false,
        objective_function: 'minimize feasible hedge cash cost subject to stress-loss reduction and margin constraints',
        deterministic_grading_fields: ['chosen_strategy', 'stress_loss_reduction_usd', 'hedge_cash_used', 'margin_used', 'rejected_routes'],
      },
    },
  },
  {
    id: 'SB-AGI-006',
    level: 11,
    type: 'schema',
    rubric_id: 'stockbench-agi-006',
    prompt:
      'Frozen market snapshot:\n' +
      '- Timestamp: 2026-07-22 16:10:00 America/New_York.\n' +
      '- Position: long 1,000 SPY shares at 500.00.\n' +
      '- Regular equity session is closed. Extended-hours SPY liquidity is firm for only 300 shares at 499.50.\n' +
      '- CME ES futures are open. ES quote: 5,000, multiplier 50, margin 13,000, margin capacity 15,000, slippage/fees 25.\n' +
      '- CFD route unavailable. New SPY short sale unavailable in extended hours.\n' +
      '- Objective: maximize immediate exposure reduction before overnight under these route constraints.\n\n' +
      'Task: Build the valid immediate reduction plan and reject invalid routes.\n\n' +
      'Objective: maximize beta-dollar exposure reduction subject to session liquidity, margin, and route-permission constraints.\n\n' +
      'Output JSON fields: { "decision", "chosen_strategy", "spy_sell_shares", "es_contracts", "exposure_reduction_usd", "margin_used", "feasibility", "rejected_routes", "self_check", "reasoning" }',
    expected_values: {
      decision: 'reduce',
      chosen_strategy: 'sell_300_SPY_extended_hours_and_sell_1_ES',
      spy_sell_shares: 300,
      es_contracts: 1,
      exposure_reduction_usd: 399850,
      margin_used: 13000,
      feasibility: 'feasible',
      rejected_routes: ['sell_1000_SPY_extended_hours_liquidity_exceeded', 'use_CFD_unavailable', 'new_SPY_short_unavailable'],
      self_check: ['session_constraint_checked', 'margin_within_limit', 'route_permissions_checked'],
    },
    context: {
      benchmark: 'StockBench',
      stockbench: {
        primary_domain: 'Execution / liquidity / microstructure',
        tier: 'AGI',
        capability_tag: 'execution_action_quality',
        scenario_family: 'invalid_route_session_trap',
        feasibility_trap: true,
        objective_function: 'maximize immediate exposure reduction under frozen session/liquidity/margin constraints',
        deterministic_grading_fields: ['spy_sell_shares', 'es_contracts', 'exposure_reduction_usd', 'margin_used', 'rejected_routes'],
      },
    },
  },
  {
    id: 'SB-AGI-007',
    level: 11,
    type: 'schema',
    rubric_id: 'stockbench-agi-007',
    prompt:
      'Frozen market snapshot:\n' +
      '- Position: long 5 CL June futures contracts.\n' +
      '- First notice day is tomorrow; account policy forbids holding physically deliverable long CL into first notice.\n' +
      '- Desired post-trade exposure: stay long 5 CL-equivalent contracts in July.\n' +
      '- CL multiplier: 1,000 barrels.\n' +
      '- June executable bid: 77.90. July executable ask: 78.40.\n' +
      '- Alternative: sell June and buy August at 79.10 ask, but August basis risk penalty is fixed at 1,500 USD.\n' +
      '- Fee: 4 USD per contract per leg.\n\n' +
      'Task: Choose the valid roll that avoids delivery risk and minimizes total roll cost plus stated basis penalty.\n\n' +
      'Objective: minimize total_cost_usd while eliminating June first-notice risk and preserving 5-contract long CL exposure.\n\n' +
      'Output JSON fields: { "decision", "chosen_strategy", "sell_contract", "buy_contract", "contracts", "roll_cost_usd", "basis_penalty_usd", "total_cost_usd", "feasibility", "rejected_routes", "self_check", "reasoning" }',
    expected_values: {
      decision: 'roll',
      chosen_strategy: 'sell_June_buy_July',
      sell_contract: 'CL_June',
      buy_contract: 'CL_July',
      contracts: 5,
      roll_cost_usd: 2500,
      basis_penalty_usd: 0,
      total_cost_usd: 2540,
      feasibility: 'feasible',
      rejected_routes: ['hold_June_delivery_risk', 'roll_to_August_higher_total_cost'],
      self_check: ['first_notice_risk_removed', 'exposure_preserved', 'cost_includes_fees'],
    },
    context: {
      benchmark: 'StockBench',
      stockbench: {
        primary_domain: 'Futures / commodities / spreads / rolls',
        tier: 'AGI',
        capability_tag: 'execution_action_quality',
        scenario_family: 'commodity_roll_basis_hedge',
        feasibility_trap: true,
        objective_function: 'minimize executable roll cost plus basis penalty while avoiding first-notice risk',
        deterministic_grading_fields: ['buy_contract', 'contracts', 'roll_cost_usd', 'basis_penalty_usd', 'total_cost_usd', 'rejected_routes'],
      },
    },
  },
  {
    id: 'SB-AGI-008',
    level: 11,
    type: 'schema',
    rubric_id: 'stockbench-agi-008',
    prompt:
      'Frozen market snapshot:\n' +
      '- Position: long 1,000 TSLA shares at 250.00 and short 10 TSLA 260 calls expiring in 2 days.\n' +
      '- TSLA current price: 258.00. Earnings event is tonight.\n' +
      '- Short 260 call buy-to-close ask: 7.00.\n' +
      '- Replacement roll: sell 10 TSLA 285 calls expiring in 32 days at 3.20 bid.\n' +
      '- Protective put package: buy 10 TSLA 235 puts expiring in 32 days at 4.50 ask.\n' +
      '- Cash available for net debit: 9,000 USD. Option multiplier: 100 shares.\n' +
      '- Event risk rule in this packet: do not carry short near-the-money calls through earnings unless assignment/gap risk is explicitly removed.\n\n' +
      'Task: Choose the valid event-risk adjustment under the cash constraint.\n\n' +
      'Objective: remove near-the-money short-call event risk and add downside protection with net debit <= 9,000, maximizing covered-share protection.\n\n' +
      'Output JSON fields: { "decision", "chosen_strategy", "buy_to_close_calls", "sell_to_open_calls", "buy_put_contracts", "net_debit_usd", "covered_shares", "feasibility", "rejected_routes", "self_check", "reasoning" }',
    expected_values: {
      decision: 'adjust_options',
      chosen_strategy: 'roll_calls_to_285_and_buy_235_puts',
      buy_to_close_calls: 10,
      sell_to_open_calls: 10,
      buy_put_contracts: 10,
      net_debit_usd: 8300,
      covered_shares: 1000,
      feasibility: 'feasible',
      rejected_routes: ['hold_260_calls_through_earnings', 'buy_puts_without_closing_short_calls', 'full_call_close_plus_puts_without_roll_costs_11500'],
      self_check: ['event_call_risk_removed', 'downside_puts_added', 'net_debit_within_cash'],
    },
    context: {
      benchmark: 'StockBench',
      stockbench: {
        primary_domain: 'Listed options strategy / Greeks',
        tier: 'AGI',
        capability_tag: 'execution_action_quality',
        scenario_family: 'event_vol_assignment_constrained',
        feasibility_trap: true,
        objective_function: 'remove short-call event risk and maximize protected shares subject to net debit constraint',
        deterministic_grading_fields: ['buy_to_close_calls', 'sell_to_open_calls', 'buy_put_contracts', 'net_debit_usd', 'covered_shares', 'rejected_routes'],
      },
    },
  },
  ...STOCKBENCH_GENERATED_QUESTIONS,
];
