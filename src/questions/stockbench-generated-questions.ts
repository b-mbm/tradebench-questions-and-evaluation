import type { SchemaQuestion } from '../types/schema';

// Generated StockBench expansion (leakage-free rebuild). Audited by mutation-test + quality-gate.
export const STOCKBENCH_GENERATED_QUESTIONS: SchemaQuestion[] = [
  {
    "id": "SB-L1-002",
    "level": 1,
    "type": "schema",
    "rubric_id": "stockbench-l1-002",
    "prompt": "Frozen market snapshot:\n- Instrument: XLF ETF.\n- Quote: 154.00 USD/share.\n- Unit type: share.\n\nTask:\nExtract the instrument, quote, and unit type from the packet. Use only the frozen packet.\n\nOutput JSON fields: { \"decision\", \"instrument\", \"quote\", \"unit\" }",
    "expected_values": {
      "decision": "extract",
      "instrument": "XLF ETF",
      "quote": "154.00 USD/share",
      "unit": "share"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot equities / ETFs",
        "tier": "L1",
        "capability_tag": "execution_action_quality",
        "scenario_family": "etf_sector_rebalance_t_plus_one",
        "feasibility_trap": false,
        "deterministic_grading_fields": [
          "instrument",
          "quote",
          "unit"
        ]
      },
      "canonical_answer": {
        "decision": "extract",
        "instrument": "XLF ETF",
        "quote": "154.00 USD/share",
        "unit": "share"
      }
    }
  },
  {
    "id": "SB-L1-003",
    "level": 1,
    "type": "schema",
    "rubric_id": "stockbench-l1-003",
    "prompt": "Frozen market snapshot:\n- Instrument: GLD 500 call.\n- Quote: 7.00 USD/share premium.\n- Unit type: option_contract.\n\nTask:\nExtract the instrument, quote, and unit type from the packet. Use only the frozen packet.\n\nOutput JSON fields: { \"decision\", \"instrument\", \"quote\", \"unit\" }",
    "expected_values": {
      "decision": "extract",
      "instrument": "GLD 500 call",
      "quote": "7.00 USD/share premium",
      "unit": "option_contract"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "L1",
        "capability_tag": "execution_action_quality",
        "scenario_family": "early_assignment_dividend_risk",
        "feasibility_trap": false,
        "deterministic_grading_fields": [
          "instrument",
          "quote",
          "unit"
        ]
      },
      "canonical_answer": {
        "decision": "extract",
        "instrument": "GLD 500 call",
        "quote": "7.00 USD/share premium",
        "unit": "option_contract"
      }
    }
  },
  {
    "id": "SB-L2-002",
    "level": 2,
    "type": "schema",
    "rubric_id": "stockbench-l2-002",
    "prompt": "Frozen market snapshot:\n- Instrument: XLK ETF.\n- Quantity: 300.\n- Price: 165.00 USD.\n\nTask:\nCompute notional USD value.\n\nOutput JSON fields: { \"decision\", \"instrument\", \"quantity\", \"price\", \"notional_usd\" }",
    "expected_values": {
      "decision": "calculate_notional",
      "instrument": "XLK",
      "quantity": 300,
      "price": 165,
      "notional_usd": 49500
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Execution / liquidity / microstructure",
        "tier": "L2",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "twap_slippage_limit",
        "feasibility_trap": true,
        "deterministic_grading_fields": [
          "instrument",
          "quantity",
          "price",
          "notional_usd"
        ]
      },
      "canonical_answer": {
        "decision": "calculate_notional",
        "instrument": "XLK",
        "quantity": 300,
        "price": 165,
        "notional_usd": 49500
      }
    }
  },
  {
    "id": "SB-L2-003",
    "level": 2,
    "type": "schema",
    "rubric_id": "stockbench-l2-003",
    "prompt": "Frozen market snapshot:\n- Instrument: XLF ETF.\n- Quantity: 400.\n- Price: 170.00 USD.\n\nTask:\nCompute notional USD value.\n\nOutput JSON fields: { \"decision\", \"instrument\", \"quantity\", \"price\", \"notional_usd\" }",
    "expected_values": {
      "decision": "calculate_notional",
      "instrument": "XLF",
      "quantity": 400,
      "price": 170,
      "notional_usd": 68000
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot equities / ETFs",
        "tier": "L2",
        "capability_tag": "execution_action_quality",
        "scenario_family": "equity_order_ticket",
        "feasibility_trap": false,
        "deterministic_grading_fields": [
          "instrument",
          "quantity",
          "price",
          "notional_usd"
        ]
      },
      "canonical_answer": {
        "decision": "calculate_notional",
        "instrument": "XLF",
        "quantity": 400,
        "price": 170,
        "notional_usd": 68000
      }
    }
  },
  {
    "id": "SB-L2-004",
    "level": 2,
    "type": "schema",
    "rubric_id": "stockbench-l2-004",
    "prompt": "Frozen market snapshot:\n- Listed option premium: 6.00 USD/share.\n- Contracts: 6.\n- Option multiplier: 100 shares per contract.\n\nTask:\nCompute total option premium in USD.\n\nOutput JSON fields: { \"decision\", \"contracts\", \"premium_per_share\", \"multiplier\", \"total_premium_usd\" }",
    "expected_values": {
      "decision": "calculate_option_premium",
      "contracts": 6,
      "premium_per_share": 6,
      "multiplier": 100,
      "total_premium_usd": 3600
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "L2",
        "capability_tag": "execution_action_quality",
        "scenario_family": "put_spread_downside_floor",
        "feasibility_trap": false,
        "deterministic_grading_fields": [
          "contracts",
          "premium_per_share",
          "multiplier",
          "total_premium_usd"
        ]
      },
      "canonical_answer": {
        "decision": "calculate_option_premium",
        "contracts": 6,
        "premium_per_share": 6,
        "multiplier": 100,
        "total_premium_usd": 3600
      }
    }
  },
  {
    "id": "SB-L3-002",
    "level": 3,
    "type": "schema",
    "rubric_id": "stockbench-l3-002",
    "prompt": "Frozen market snapshot:\n- Buy quantity: 300 shares.\n- Frozen price: 135.00 USD/share.\n- Commission: 0.005 USD/share.\n\nTask:\nCompute gross value, commission, and total cash required.\n\nOutput JSON fields: { \"decision\", \"quantity\", \"price\", \"gross_value_usd\", \"fee_usd\", \"cash_required_usd\" }",
    "expected_values": {
      "decision": "calculate_trade_cash",
      "quantity": 300,
      "price": 135,
      "gross_value_usd": 40500,
      "fee_usd": 1.5,
      "cash_required_usd": 40501.5
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "L3",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "commodity_roll_basis_hedge",
        "feasibility_trap": true,
        "deterministic_grading_fields": [
          "quantity",
          "price",
          "gross_value_usd",
          "fee_usd",
          "cash_required_usd"
        ]
      },
      "canonical_answer": {
        "decision": "calculate_trade_cash",
        "quantity": 300,
        "price": 135,
        "gross_value_usd": 40500,
        "fee_usd": 1.5,
        "cash_required_usd": 40501.5
      }
    }
  },
  {
    "id": "SB-L3-003",
    "level": 3,
    "type": "schema",
    "rubric_id": "stockbench-l3-003",
    "prompt": "Frozen market snapshot:\n- Buy quantity: 400 shares.\n- Frozen price: 140.00 USD/share.\n- Commission: 0.005 USD/share.\n\nTask:\nCompute gross value, commission, and total cash required.\n\nOutput JSON fields: { \"decision\", \"quantity\", \"price\", \"gross_value_usd\", \"fee_usd\", \"cash_required_usd\" }",
    "expected_values": {
      "decision": "calculate_trade_cash",
      "quantity": 400,
      "price": 140,
      "gross_value_usd": 56000,
      "fee_usd": 2,
      "cash_required_usd": 56002
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Portfolio risk / rebalancing",
        "tier": "L3",
        "capability_tag": "execution_action_quality",
        "scenario_family": "risk_budget_rebalance",
        "feasibility_trap": false,
        "deterministic_grading_fields": [
          "quantity",
          "price",
          "gross_value_usd",
          "fee_usd",
          "cash_required_usd"
        ]
      },
      "canonical_answer": {
        "decision": "calculate_trade_cash",
        "quantity": 400,
        "price": 140,
        "gross_value_usd": 56000,
        "fee_usd": 2,
        "cash_required_usd": 56002
      }
    }
  },
  {
    "id": "SB-L4-002",
    "level": 4,
    "type": "schema",
    "rubric_id": "stockbench-l4-002",
    "prompt": "Frozen market snapshot:\n- Principal: 110000 USD.\n- Annual rate: 6.00%.\n- Day count: Actual/360.\n- Holding period: 19 calendar days.\n- Simple interest; ignore compounding.\n\nTask:\nCompute the time-based cost in USD.\n\nOutput JSON fields: { \"decision\", \"principal_usd\", \"annual_rate\", \"day_count\", \"days\", \"cost_usd\" }",
    "expected_values": {
      "decision": "calculate_time_cost",
      "principal_usd": 110000,
      "annual_rate": 0.06,
      "day_count": "Actual/360",
      "days": 19,
      "cost_usd": 348.33
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Execution / liquidity / microstructure",
        "tier": "L4",
        "capability_tag": "execution_action_quality",
        "scenario_family": "order_book_liquidity_limit",
        "feasibility_trap": true,
        "deterministic_grading_fields": [
          "principal_usd",
          "annual_rate",
          "day_count",
          "days",
          "cost_usd"
        ]
      },
      "canonical_answer": {
        "decision": "calculate_time_cost",
        "principal_usd": 110000,
        "annual_rate": 0.06,
        "day_count": "Actual/360",
        "days": 19,
        "cost_usd": 348.33
      }
    }
  },
  {
    "id": "SB-L4-003",
    "level": 4,
    "type": "schema",
    "rubric_id": "stockbench-l4-003",
    "prompt": "Frozen market snapshot:\n- Principal: 50000 USD.\n- Annual rate: 7.00%.\n- Day count: Actual/360.\n- Holding period: 20 calendar days.\n- Simple interest; ignore compounding.\n\nTask:\nCompute the time-based cost in USD.\n\nOutput JSON fields: { \"decision\", \"principal_usd\", \"annual_rate\", \"day_count\", \"days\", \"cost_usd\" }",
    "expected_values": {
      "decision": "calculate_time_cost",
      "principal_usd": 50000,
      "annual_rate": 0.07,
      "day_count": "Actual/360",
      "days": 20,
      "cost_usd": 194.44
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot FX / CFDs / multi-currency",
        "tier": "L4",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "cfd_margin_regional_constraint",
        "feasibility_trap": false,
        "deterministic_grading_fields": [
          "principal_usd",
          "annual_rate",
          "day_count",
          "days",
          "cost_usd"
        ]
      },
      "canonical_answer": {
        "decision": "calculate_time_cost",
        "principal_usd": 50000,
        "annual_rate": 0.07,
        "day_count": "Actual/360",
        "days": 20,
        "cost_usd": 194.44
      }
    }
  },
  {
    "id": "SB-L4-004",
    "level": 4,
    "type": "schema",
    "rubric_id": "stockbench-l4-004",
    "prompt": "Frozen market snapshot:\n- Principal: 60000 USD.\n- Annual rate: 8.00%.\n- Day count: Actual/360.\n- Holding period: 21 calendar days.\n- Simple interest; ignore compounding.\n\nTask:\nCompute the time-based cost in USD.\n\nOutput JSON fields: { \"decision\", \"principal_usd\", \"annual_rate\", \"day_count\", \"days\", \"cost_usd\" }",
    "expected_values": {
      "decision": "calculate_time_cost",
      "principal_usd": 60000,
      "annual_rate": 0.08,
      "day_count": "Actual/360",
      "days": 21,
      "cost_usd": 280
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Corporate actions / settlement / calendar / jurisdiction",
        "tier": "L4",
        "capability_tag": "execution_action_quality",
        "scenario_family": "corporate_action_adjustment",
        "feasibility_trap": true,
        "deterministic_grading_fields": [
          "principal_usd",
          "annual_rate",
          "day_count",
          "days",
          "cost_usd"
        ]
      },
      "canonical_answer": {
        "decision": "calculate_time_cost",
        "principal_usd": 60000,
        "annual_rate": 0.08,
        "day_count": "Actual/360",
        "days": 21,
        "cost_usd": 280
      }
    }
  },
  {
    "id": "SB-L4-005",
    "level": 4,
    "type": "schema",
    "rubric_id": "stockbench-l4-005",
    "prompt": "Frozen market snapshot:\n- Principal: 70000 USD.\n- Annual rate: 9.00%.\n- Day count: Actual/360.\n- Holding period: 22 calendar days.\n- Simple interest; ignore compounding.\n\nTask:\nCompute the time-based cost in USD.\n\nOutput JSON fields: { \"decision\", \"principal_usd\", \"annual_rate\", \"day_count\", \"days\", \"cost_usd\" }",
    "expected_values": {
      "decision": "calculate_time_cost",
      "principal_usd": 70000,
      "annual_rate": 0.09,
      "day_count": "Actual/360",
      "days": 22,
      "cost_usd": 385
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot equities / ETFs",
        "tier": "L4",
        "capability_tag": "execution_action_quality",
        "scenario_family": "market_on_close_rebalance",
        "feasibility_trap": false,
        "deterministic_grading_fields": [
          "principal_usd",
          "annual_rate",
          "day_count",
          "days",
          "cost_usd"
        ]
      },
      "canonical_answer": {
        "decision": "calculate_time_cost",
        "principal_usd": 70000,
        "annual_rate": 0.09,
        "day_count": "Actual/360",
        "days": 22,
        "cost_usd": 385
      }
    }
  },
  {
    "id": "SB-L5-002",
    "level": 5,
    "type": "schema",
    "rubric_id": "stockbench-l5-002",
    "prompt": "Frozen market snapshot:\n- Allowed products: XLK ETF trading allowed.\n- Buy 200 shares, limit 168.25, time in force day.\n\nTask:\nMap the instruction into the required order ticket schema.\n\nOutput JSON fields: { \"decision\", \"instrument\", \"side\", \"quantity\", \"order_type\", \"limit_price\", \"time_in_force\", \"feasibility\" }",
    "expected_values": {
      "decision": "trade",
      "instrument": "XLK",
      "side": "buy",
      "quantity": 200,
      "order_type": "limit",
      "limit_price": 168.25,
      "time_in_force": "day",
      "feasibility": "feasible"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "L5",
        "capability_tag": "execution_action_quality",
        "scenario_family": "futures_beta_hedge",
        "feasibility_trap": true,
        "deterministic_grading_fields": [
          "instrument",
          "side",
          "quantity",
          "order_type",
          "limit_price",
          "time_in_force",
          "feasibility"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "instrument": "XLK",
        "side": "buy",
        "quantity": 200,
        "order_type": "limit",
        "limit_price": 168.25,
        "time_in_force": "day",
        "feasibility": "feasible"
      }
    }
  },
  {
    "id": "SB-L5-003",
    "level": 5,
    "type": "schema",
    "rubric_id": "stockbench-l5-003",
    "prompt": "Frozen market snapshot:\n- Allowed products: XLF ETF trading allowed.\n- Buy 300 shares, limit 172.25, time in force day.\n\nTask:\nMap the instruction into the required order ticket schema.\n\nOutput JSON fields: { \"decision\", \"instrument\", \"side\", \"quantity\", \"order_type\", \"limit_price\", \"time_in_force\", \"feasibility\" }",
    "expected_values": {
      "decision": "trade",
      "instrument": "XLF",
      "side": "buy",
      "quantity": 300,
      "order_type": "limit",
      "limit_price": 172.25,
      "time_in_force": "day",
      "feasibility": "feasible"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot equities / ETFs",
        "tier": "L5",
        "capability_tag": "execution_action_quality",
        "scenario_family": "etf_sector_rebalance_t_plus_one",
        "feasibility_trap": false,
        "deterministic_grading_fields": [
          "instrument",
          "side",
          "quantity",
          "order_type",
          "limit_price",
          "time_in_force",
          "feasibility"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "instrument": "XLF",
        "side": "buy",
        "quantity": 300,
        "order_type": "limit",
        "limit_price": 172.25,
        "time_in_force": "day",
        "feasibility": "feasible"
      }
    }
  },
  {
    "id": "SB-L5-004",
    "level": 5,
    "type": "schema",
    "rubric_id": "stockbench-l5-004",
    "prompt": "Frozen market snapshot:\n- Allowed products: GLD ETF trading allowed.\n- Buy 400 shares, limit 176.25, time in force day.\n\nTask:\nMap the instruction into the required order ticket schema.\n\nOutput JSON fields: { \"decision\", \"instrument\", \"side\", \"quantity\", \"order_type\", \"limit_price\", \"time_in_force\", \"feasibility\" }",
    "expected_values": {
      "decision": "trade",
      "instrument": "GLD",
      "side": "buy",
      "quantity": 400,
      "order_type": "limit",
      "limit_price": 176.25,
      "time_in_force": "day",
      "feasibility": "feasible"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "L5",
        "capability_tag": "execution_action_quality",
        "scenario_family": "early_assignment_dividend_risk",
        "feasibility_trap": false,
        "deterministic_grading_fields": [
          "instrument",
          "side",
          "quantity",
          "order_type",
          "limit_price",
          "time_in_force",
          "feasibility"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "instrument": "GLD",
        "side": "buy",
        "quantity": 400,
        "order_type": "limit",
        "limit_price": 176.25,
        "time_in_force": "day",
        "feasibility": "feasible"
      }
    }
  },
  {
    "id": "SB-L5-005",
    "level": 5,
    "type": "schema",
    "rubric_id": "stockbench-l5-005",
    "prompt": "Frozen market snapshot:\n- Allowed products: SPY ETF trading allowed.\n- Buy 500 shares, limit 100.25, time in force day.\n\nTask:\nMap the instruction into the required order ticket schema.\n\nOutput JSON fields: { \"decision\", \"instrument\", \"side\", \"quantity\", \"order_type\", \"limit_price\", \"time_in_force\", \"feasibility\" }",
    "expected_values": {
      "decision": "trade",
      "instrument": "SPY",
      "side": "buy",
      "quantity": 500,
      "order_type": "limit",
      "limit_price": 100.25,
      "time_in_force": "day",
      "feasibility": "feasible"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "L5",
        "capability_tag": "execution_action_quality",
        "scenario_family": "span_margin_calendar_spread",
        "feasibility_trap": false,
        "deterministic_grading_fields": [
          "instrument",
          "side",
          "quantity",
          "order_type",
          "limit_price",
          "time_in_force",
          "feasibility"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "instrument": "SPY",
        "side": "buy",
        "quantity": 500,
        "order_type": "limit",
        "limit_price": 100.25,
        "time_in_force": "day",
        "feasibility": "feasible"
      }
    }
  },
  {
    "id": "SB-L6-002",
    "level": 6,
    "type": "schema",
    "rubric_id": "stockbench-l6-002",
    "prompt": "Frozen market snapshot:\n- Account permission for XLF ETF: allowed.\n- US equity proceeds settle T+1; cash date 2026-06-24.\n- Same-day withdrawal of unsettled proceeds is not allowed.\n\nTask:\nReturn the correct operational sequence and the T+1 cash date.\n\nOutput JSON fields: { \"decision\", \"execution_sequence\", \"settlement_rule\", \"settlement_cash_date\", \"feasibility\" }",
    "expected_values": {
      "decision": "sequence",
      "execution_sequence": [
        "check_permission",
        "submit_order",
        "confirm_settlement"
      ],
      "settlement_rule": "T+1",
      "settlement_cash_date": "2026-06-24",
      "feasibility": "feasible"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Shorting / borrow / margin / locates",
        "tier": "L6",
        "capability_tag": "execution_action_quality",
        "scenario_family": "short_locate_failure",
        "feasibility_trap": true,
        "deterministic_grading_fields": [
          "execution_sequence",
          "settlement_rule",
          "settlement_cash_date",
          "feasibility"
        ]
      },
      "canonical_answer": {
        "decision": "sequence",
        "execution_sequence": [
          "check_permission",
          "submit_order",
          "confirm_settlement"
        ],
        "settlement_rule": "T+1",
        "settlement_cash_date": "2026-06-24",
        "feasibility": "feasible"
      }
    }
  },
  {
    "id": "SB-L6-003",
    "level": 6,
    "type": "schema",
    "rubric_id": "stockbench-l6-003",
    "prompt": "Frozen market snapshot:\n- Account permission for GLD ETF: allowed.\n- US equity proceeds settle T+1; cash date 2026-06-25.\n- Same-day withdrawal of unsettled proceeds is not allowed.\n\nTask:\nReturn the correct operational sequence and the T+1 cash date.\n\nOutput JSON fields: { \"decision\", \"execution_sequence\", \"settlement_rule\", \"settlement_cash_date\", \"feasibility\" }",
    "expected_values": {
      "decision": "sequence",
      "execution_sequence": [
        "check_permission",
        "submit_order",
        "confirm_settlement"
      ],
      "settlement_rule": "T+1",
      "settlement_cash_date": "2026-06-25",
      "feasibility": "feasible"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot FX / CFDs / multi-currency",
        "tier": "L6",
        "capability_tag": "execution_action_quality",
        "scenario_family": "cfd_margin_regional_constraint",
        "feasibility_trap": false,
        "deterministic_grading_fields": [
          "execution_sequence",
          "settlement_rule",
          "settlement_cash_date",
          "feasibility"
        ]
      },
      "canonical_answer": {
        "decision": "sequence",
        "execution_sequence": [
          "check_permission",
          "submit_order",
          "confirm_settlement"
        ],
        "settlement_rule": "T+1",
        "settlement_cash_date": "2026-06-25",
        "feasibility": "feasible"
      }
    }
  },
  {
    "id": "SB-L6-004",
    "level": 6,
    "type": "schema",
    "rubric_id": "stockbench-l6-004",
    "prompt": "Frozen market snapshot:\n- Account permission for SPY ETF: allowed.\n- US equity proceeds settle T+1; cash date 2026-06-16.\n- Same-day withdrawal of unsettled proceeds is not allowed.\n\nTask:\nReturn the correct operational sequence and the T+1 cash date.\n\nOutput JSON fields: { \"decision\", \"execution_sequence\", \"settlement_rule\", \"settlement_cash_date\", \"feasibility\" }",
    "expected_values": {
      "decision": "sequence",
      "execution_sequence": [
        "check_permission",
        "submit_order",
        "confirm_settlement"
      ],
      "settlement_rule": "T+1",
      "settlement_cash_date": "2026-06-16",
      "feasibility": "feasible"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot equities / ETFs",
        "tier": "L6",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "opening_auction_limit",
        "feasibility_trap": false,
        "deterministic_grading_fields": [
          "execution_sequence",
          "settlement_rule",
          "settlement_cash_date",
          "feasibility"
        ]
      },
      "canonical_answer": {
        "decision": "sequence",
        "execution_sequence": [
          "check_permission",
          "submit_order",
          "confirm_settlement"
        ],
        "settlement_rule": "T+1",
        "settlement_cash_date": "2026-06-16",
        "feasibility": "feasible"
      }
    }
  },
  {
    "id": "SB-L6-005",
    "level": 6,
    "type": "schema",
    "rubric_id": "stockbench-l6-005",
    "prompt": "Frozen market snapshot:\n- Account permission for QQQ ETF: allowed.\n- US equity proceeds settle T+1; cash date 2026-06-17.\n- Same-day withdrawal of unsettled proceeds is not allowed.\n\nTask:\nReturn the correct operational sequence and the T+1 cash date.\n\nOutput JSON fields: { \"decision\", \"execution_sequence\", \"settlement_rule\", \"settlement_cash_date\", \"feasibility\" }",
    "expected_values": {
      "decision": "sequence",
      "execution_sequence": [
        "check_permission",
        "submit_order",
        "confirm_settlement"
      ],
      "settlement_rule": "T+1",
      "settlement_cash_date": "2026-06-17",
      "feasibility": "feasible"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "L6",
        "capability_tag": "execution_action_quality",
        "scenario_family": "exercise_assignment_roll_decision",
        "feasibility_trap": false,
        "deterministic_grading_fields": [
          "execution_sequence",
          "settlement_rule",
          "settlement_cash_date",
          "feasibility"
        ]
      },
      "canonical_answer": {
        "decision": "sequence",
        "execution_sequence": [
          "check_permission",
          "submit_order",
          "confirm_settlement"
        ],
        "settlement_rule": "T+1",
        "settlement_cash_date": "2026-06-17",
        "feasibility": "feasible"
      }
    }
  },
  {
    "id": "SB-L7-002",
    "level": 7,
    "type": "schema",
    "rubric_id": "stockbench-l7-002",
    "prompt": "Frozen market snapshot:\n- Target notional: 650000 USD via ES futures.\n- ES price 5075.00 index points; multiplier 50 USD/point; notional per contract = price * multiplier = 253750 USD.\n- Fractional contracts not allowed.\n\nTask:\nCompute whole contracts, used notional, and residual cash.\n\nOutput JSON fields: { \"decision\", \"instrument\", \"target_notional_usd\", \"price\", \"multiplier\", \"contracts\", \"used_notional_usd\", \"residual_cash_usd\" }",
    "expected_values": {
      "decision": "rebalance",
      "instrument": "ES futures",
      "target_notional_usd": 650000,
      "price": 5075,
      "multiplier": 50,
      "contracts": 2,
      "used_notional_usd": 507500,
      "residual_cash_usd": 142500
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "L7",
        "capability_tag": "execution_action_quality",
        "scenario_family": "futures_beta_hedge",
        "feasibility_trap": true,
        "deterministic_grading_fields": [
          "instrument",
          "target_notional_usd",
          "price",
          "multiplier",
          "contracts",
          "used_notional_usd",
          "residual_cash_usd"
        ]
      },
      "canonical_answer": {
        "decision": "rebalance",
        "instrument": "ES futures",
        "target_notional_usd": 650000,
        "price": 5075,
        "multiplier": 50,
        "contracts": 2,
        "used_notional_usd": 507500,
        "residual_cash_usd": 142500
      }
    }
  },
  {
    "id": "SB-L7-003",
    "level": 7,
    "type": "schema",
    "rubric_id": "stockbench-l7-003",
    "prompt": "Frozen market snapshot:\n- Target notional: 50000 USD in SPY ETF.\n- Price: 100.00 USD/share. Fractional shares not allowed.\n\nTask:\nCompute whole shares, used notional, and residual cash.\n\nOutput JSON fields: { \"decision\", \"instrument\", \"target_notional_usd\", \"price\", \"shares\", \"used_notional_usd\", \"residual_cash_usd\" }",
    "expected_values": {
      "decision": "rebalance",
      "instrument": "SPY",
      "target_notional_usd": 50000,
      "price": 100,
      "shares": 500,
      "used_notional_usd": 50000,
      "residual_cash_usd": 0
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Shorting / borrow / margin / locates",
        "tier": "L7",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "borrow_cost_vs_trade_edge",
        "feasibility_trap": true,
        "deterministic_grading_fields": [
          "instrument",
          "target_notional_usd",
          "price",
          "shares",
          "used_notional_usd",
          "residual_cash_usd"
        ]
      },
      "canonical_answer": {
        "decision": "rebalance",
        "instrument": "SPY",
        "target_notional_usd": 50000,
        "price": 100,
        "shares": 500,
        "used_notional_usd": 50000,
        "residual_cash_usd": 0
      }
    }
  },
  {
    "id": "SB-L7-004",
    "level": 7,
    "type": "schema",
    "rubric_id": "stockbench-l7-004",
    "prompt": "Frozen market snapshot:\n- Target notional: 60000 USD in QQQ ETF.\n- Price: 104.00 USD/share. Fractional shares not allowed.\n\nTask:\nCompute whole shares, used notional, and residual cash.\n\nOutput JSON fields: { \"decision\", \"instrument\", \"target_notional_usd\", \"price\", \"shares\", \"used_notional_usd\", \"residual_cash_usd\" }",
    "expected_values": {
      "decision": "rebalance",
      "instrument": "QQQ",
      "target_notional_usd": 60000,
      "price": 104,
      "shares": 576,
      "used_notional_usd": 59904,
      "residual_cash_usd": 96
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Execution / liquidity / microstructure",
        "tier": "L7",
        "capability_tag": "execution_action_quality",
        "scenario_family": "auction_session_constraint",
        "feasibility_trap": true,
        "deterministic_grading_fields": [
          "instrument",
          "target_notional_usd",
          "price",
          "shares",
          "used_notional_usd",
          "residual_cash_usd"
        ]
      },
      "canonical_answer": {
        "decision": "rebalance",
        "instrument": "QQQ",
        "target_notional_usd": 60000,
        "price": 104,
        "shares": 576,
        "used_notional_usd": 59904,
        "residual_cash_usd": 96
      }
    }
  },
  {
    "id": "SB-L7-005",
    "level": 7,
    "type": "schema",
    "rubric_id": "stockbench-l7-005",
    "prompt": "Frozen market snapshot:\n- Target notional: 70000 USD in IWM ETF.\n- Price: 108.00 USD/share. Fractional shares not allowed.\n\nTask:\nCompute whole shares, used notional, and residual cash.\n\nOutput JSON fields: { \"decision\", \"instrument\", \"target_notional_usd\", \"price\", \"shares\", \"used_notional_usd\", \"residual_cash_usd\" }",
    "expected_values": {
      "decision": "rebalance",
      "instrument": "IWM",
      "target_notional_usd": 70000,
      "price": 108,
      "shares": 648,
      "used_notional_usd": 69984,
      "residual_cash_usd": 16
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot FX / CFDs / multi-currency",
        "tier": "L7",
        "capability_tag": "execution_action_quality",
        "scenario_family": "forward_vs_spot_payment",
        "feasibility_trap": false,
        "deterministic_grading_fields": [
          "instrument",
          "target_notional_usd",
          "price",
          "shares",
          "used_notional_usd",
          "residual_cash_usd"
        ]
      },
      "canonical_answer": {
        "decision": "rebalance",
        "instrument": "IWM",
        "target_notional_usd": 70000,
        "price": 108,
        "shares": 648,
        "used_notional_usd": 69984,
        "residual_cash_usd": 16
      }
    }
  },
  {
    "id": "SB-L8-002",
    "level": 8,
    "type": "schema",
    "rubric_id": "stockbench-l8-002",
    "prompt": "Frozen market snapshot:\n- Instrument: SPY ETF at 80.00. This is an equity order ticket; equities settle T+1.\n- Buy 800 shares with a protective day limit 80.25; T+1 cash date 2026-06-16.\nCandidate routes:\n- Route A (route_a): submit a day limit buy ticket for 800 shares at 80.25 in the regular session\n- Route B (route_b): submit a market buy that ignores the protective limit\n\nTask:\nCreate the order ticket and report trade value and T+1 date. Report rejected routes by route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"side\", \"quantity\", \"order_type\", \"limit_price\", \"trade_value_usd\", \"settlement_rule\", \"settlement_cash_date\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "SPY",
      "side": "buy",
      "quantity": 800,
      "order_type": "limit",
      "limit_price": 80.25,
      "trade_value_usd": 64000,
      "settlement_rule": "T+1",
      "settlement_cash_date": "2026-06-16",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot equities / ETFs",
        "tier": "L8",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "equity_order_ticket",
        "feasibility_trap": false,
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "side",
          "quantity",
          "order_type",
          "limit_price",
          "trade_value_usd",
          "settlement_rule",
          "settlement_cash_date"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "SPY",
        "side": "buy",
        "quantity": 800,
        "order_type": "limit",
        "limit_price": 80.25,
        "trade_value_usd": 64000,
        "settlement_rule": "T+1",
        "settlement_cash_date": "2026-06-16",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ]
      }
    }
  },
  {
    "id": "SB-L8-003",
    "level": 8,
    "type": "schema",
    "rubric_id": "stockbench-l8-003",
    "prompt": "Frozen market snapshot:\n- Position: long 1,000 QQQ ETF at 480.00.\n- Downside scenario for grading: QQQ closes at 430.00 at option expiry.\n- Constraint: scenario PnL including option premium must be no worse than -30000 USD (a downside floor on this put spread).\n- Option multiplier: 100 shares; use exactly 10 spreads. Stock PnL + spread payoff - net premium = scenario PnL.\nCandidate put spreads (decide which meet the floor; pick the lowest net premium among those that do):\n- Route A (route_a): buy 10 QQQ 480 puts at 12.00 and sell 10 QQQ 470 puts at 7.00 (put spread)\n- Route B (route_b): buy 10 QQQ 480 puts at 12.00 and sell 10 QQQ 460 puts at 5.00 (put spread)\n- Route C (route_c): buy 10 QQQ 480 puts at 12.00 and sell 10 QQQ 450 puts at 3.00 (put spread)\n\nTask:\nSelect the feasible put spread and compute net premium and scenario PnL. Report rejected routes by route id.\n\nObjective:\nminimize net premium subject to scenario_pnl_usd >= the stated floor.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"buy_put_strike\", \"sell_put_strike\", \"contracts\", \"net_premium_paid\", \"scenario_pnl_usd\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_c",
      "buy_put_strike": 480,
      "sell_put_strike": 450,
      "contracts": 10,
      "net_premium_paid": 9000,
      "scenario_pnl_usd": -29000,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_a",
        "route_b"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "L8",
        "capability_tag": "execution_action_quality",
        "scenario_family": "put_spread_downside_floor",
        "feasibility_trap": false,
        "deterministic_grading_fields": [
          "selected_route",
          "buy_put_strike",
          "sell_put_strike",
          "contracts",
          "net_premium_paid",
          "scenario_pnl_usd"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_c",
        "buy_put_strike": 480,
        "sell_put_strike": 450,
        "contracts": 10,
        "net_premium_paid": 9000,
        "scenario_pnl_usd": -29000,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_a",
          "route_b"
        ]
      }
    }
  },
  {
    "id": "SB-L8-004",
    "level": 8,
    "type": "schema",
    "rubric_id": "stockbench-l8-004",
    "prompt": "Frozen market snapshot:\n- Position: long 3 CL near-month futures. This is a commodity roll with basis between near and next; use executable bid/ask, not mid.\n- First notice day is tomorrow; account policy forbids holding physically deliverable CL long into first notice.\n- Only the displayed bid/ask is executable; mid prices are indicative and not executable.\nCandidate routes (decide feasibility yourself):\n- Route A (route_a): roll by selling near at bid 79.00 and buying next at ask 79.35; CL multiplier 1000 barrels; fee 4 USD/contract/leg\n- Route B (route_b): roll using the near/next mid prices instead of bid/ask\n- Route C (route_c): hold the long near-month position into first notice day\n\nTask:\nRoll the position and compute total executable cost. Report rejected routes by route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"contracts\", \"roll_cost_usd\", \"fees_usd\", \"total_cost_usd\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "roll",
      "selected_route": "route_a",
      "contracts": 3,
      "roll_cost_usd": 1050,
      "fees_usd": 24,
      "total_cost_usd": 1074,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "L8",
        "capability_tag": "execution_action_quality",
        "scenario_family": "commodity_roll_basis_hedge",
        "feasibility_trap": true,
        "deterministic_grading_fields": [
          "selected_route",
          "contracts",
          "roll_cost_usd",
          "fees_usd",
          "total_cost_usd"
        ]
      },
      "canonical_answer": {
        "decision": "roll",
        "selected_route": "route_a",
        "contracts": 3,
        "roll_cost_usd": 1050,
        "fees_usd": 24,
        "total_cost_usd": 1074,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L8-005",
    "level": 8,
    "type": "schema",
    "rubric_id": "stockbench-l8-005",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is a risk budget rebalance against the stated beta target.\n- Portfolio equity beta-dollar exposure: 850000 USD.\n- Required reduction: at least 45% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 33000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 261250 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 2 ES futures (beta hedge), ES at 5225.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 1 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 21000 USD premium that reduces beta-dollars by 522500 USD\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 2,
      "beta_reduction_usd": 522500,
      "beta_reduction_pct": 61.47,
      "margin_used": 26000,
      "expected_cost": 50,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Portfolio risk / rebalancing",
        "tier": "L8",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "risk_budget_rebalance",
        "feasibility_trap": false,
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 2,
        "beta_reduction_usd": 522500,
        "beta_reduction_pct": 61.47,
        "margin_used": 26000,
        "expected_cost": 50,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L8-006",
    "level": 8,
    "type": "schema",
    "rubric_id": "stockbench-l8-006",
    "prompt": "Frozen market snapshot:\n- Account: US margin account. Short selling requires a locate before order entry; you cannot short beyond the locate.\n- Instrument: MSFT common stock at 200.00. Desired bearish target: short 1000 shares of exposure.\n- Locate availability: exactly 600 shares. Option cash available: 2400 USD. Put delta -0.35 means 35 delta-shares per contract.\nCandidate routes (decide feasibility from the locate and cash limits yourself):\n- Route A (route_a): short exactly the 600 located shares and buy 3 listed puts (delta -0.35, premium 8.00 USD/share, multiplier 100) within 2400 USD option cash\n- Route B (route_b): short the full 1000-share target (requires shares beyond the locate)\n- Route C (route_c): buy 7 listed puts (premium 8.00 USD/share, multiplier 100), ignoring the option cash limit\n\nTask:\nChoose the feasible bearish implementation that maximizes bearish delta-shares without breaching the locate or option cash. Report rejected routes by route id.\n\nObjective:\nmaximize bearish delta-shares subject to locate and option-cash constraints.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"short_shares\", \"put_contracts\", \"premium_paid\", \"bearish_delta_shares\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "MSFT",
      "short_shares": 600,
      "put_contracts": 3,
      "premium_paid": 2400,
      "bearish_delta_shares": 705,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Shorting / borrow / margin / locates",
        "tier": "L8",
        "capability_tag": "execution_action_quality",
        "scenario_family": "short_locate_failure",
        "feasibility_trap": true,
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "short_shares",
          "put_contracts",
          "premium_paid",
          "bearish_delta_shares"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "MSFT",
        "short_shares": 600,
        "put_contracts": 3,
        "premium_paid": 2400,
        "bearish_delta_shares": 705,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L8-007",
    "level": 8,
    "type": "schema",
    "rubric_id": "stockbench-l8-007",
    "prompt": "Frozen market snapshot:\n- Instrument: NVDA common stock. Order size: 400 shares at limit 56.25. The regular session is OPEN now; the after-hours venue is CLOSED; the dark venue is NOT enabled on this account.\n- Session/permission trap: only permitted, open venues are executable.\nCandidate routes (decide which venue is permitted and open yourself):\n- Route A (route_a): route the order to the continuous regular session\n- Route B (route_b): route the order to the closed after-hours venue with no permission\n- Route C (route_c): route via an unsupported dark venue not enabled on this account\n\nTask:\nRoute to the only feasible venue. Report rejected routes by route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"order_shares\", \"limit_price\", \"venue\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "NVDA",
      "order_shares": 400,
      "limit_price": 56.25,
      "venue": "regular_session",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Execution / liquidity / microstructure",
        "tier": "L8",
        "capability_tag": "execution_action_quality",
        "scenario_family": "invalid_route_session_trap",
        "feasibility_trap": true,
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "order_shares",
          "limit_price",
          "venue"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "NVDA",
        "order_shares": 400,
        "limit_price": 56.25,
        "venue": "regular_session",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L8-008",
    "level": 8,
    "type": "schema",
    "rubric_id": "stockbench-l8-008",
    "prompt": "Frozen market snapshot:\n- Account holder: US retail customer. Account base currency: USD. Maintain a USD cash buffer; pick the lowest-USD-cost feasible conversion.\n- Required: obtain 340000 EUR settling T+2. Spot EURUSD 1.0600. EUR futures initial margin capacity: 2000 USD.\nCandidate routes (decide feasibility from jurisdiction, settlement and margin facts yourself):\n- Route A (route_a): buy EUR spot at 1.0600, settles T+2, fees included\n- Route B (route_b): use a retail CFD on EURUSD\n- Route C (route_c): use EUR futures requiring 3000 USD initial margin\n\nTask:\nChoose the feasible route and compute USD cost. Report rejected routes by route id.\n\nObjective:\nobtain the EUR by the required settlement date at the lowest feasible USD cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"eur_amount\", \"usd_cost\", \"settlement_date_rule\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "convert_fx",
      "selected_route": "route_a",
      "eur_amount": 340000,
      "usd_cost": 360400,
      "settlement_date_rule": "T+2",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot FX / CFDs / multi-currency",
        "tier": "L8",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "multi_currency_cash_buffer",
        "feasibility_trap": true,
        "deterministic_grading_fields": [
          "selected_route",
          "eur_amount",
          "usd_cost",
          "settlement_date_rule"
        ]
      },
      "canonical_answer": {
        "decision": "convert_fx",
        "selected_route": "route_a",
        "eur_amount": 340000,
        "usd_cost": 360400,
        "settlement_date_rule": "T+2",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L8-009",
    "level": 8,
    "type": "schema",
    "rubric_id": "stockbench-l8-009",
    "prompt": "Frozen market snapshot:\n- Instrument: XLK ETF at 270.00. Account calendar: the next day is a settlement holiday, so T+1 cash lands on the stated date.\n- Trade date 2026-06-24; T+1 cash settlement date 2026-06-25. Unsettled proceeds cannot be withdrawn before settlement.\nCandidate routes (decide which respects settlement):\n- Route A (route_a): sell 400 shares on 2026-06-24; withdraw cash only after T+1 settlement on 2026-06-25\n- Route B (route_b): sell 400 shares on 2026-06-24 and withdraw the proceeds on the trade date 2026-06-24\n\nTask:\nSell and report trade value and the T+1 cash date. Report rejected routes by route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"trade_value_usd\", \"settlement_rule\", \"settlement_cash_date\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "sell",
      "selected_route": "route_a",
      "trade_value_usd": 108000,
      "settlement_rule": "T+1",
      "settlement_cash_date": "2026-06-25",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Corporate actions / settlement / calendar / jurisdiction",
        "tier": "L8",
        "capability_tag": "execution_action_quality",
        "scenario_family": "regional_market_holiday",
        "feasibility_trap": true,
        "deterministic_grading_fields": [
          "selected_route",
          "trade_value_usd",
          "settlement_rule",
          "settlement_cash_date"
        ]
      },
      "canonical_answer": {
        "decision": "sell",
        "selected_route": "route_a",
        "trade_value_usd": 108000,
        "settlement_rule": "T+1",
        "settlement_cash_date": "2026-06-25",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ]
      }
    }
  },
  {
    "id": "SB-L8-010",
    "level": 8,
    "type": "schema",
    "rubric_id": "stockbench-l8-010",
    "prompt": "Frozen market snapshot:\n- Instrument: XLF ETF at 104.00. This is an equity order ticket; equities settle T+1.\n- Buy 700 shares with a protective day limit 104.25; T+1 cash date 2026-06-16.\nCandidate routes:\n- Route A (route_a): submit a day limit buy ticket for 700 shares at 104.25 in the regular session\n- Route B (route_b): submit a market buy that ignores the protective limit\n\nTask:\nCreate the order ticket and report trade value and T+1 date. Report rejected routes by route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"side\", \"quantity\", \"order_type\", \"limit_price\", \"trade_value_usd\", \"settlement_rule\", \"settlement_cash_date\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "XLF",
      "side": "buy",
      "quantity": 700,
      "order_type": "limit",
      "limit_price": 104.25,
      "trade_value_usd": 72800,
      "settlement_rule": "T+1",
      "settlement_cash_date": "2026-06-16",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot equities / ETFs",
        "tier": "L8",
        "capability_tag": "execution_action_quality",
        "scenario_family": "equity_order_ticket",
        "feasibility_trap": false,
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "side",
          "quantity",
          "order_type",
          "limit_price",
          "trade_value_usd",
          "settlement_rule",
          "settlement_cash_date"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "XLF",
        "side": "buy",
        "quantity": 700,
        "order_type": "limit",
        "limit_price": 104.25,
        "trade_value_usd": 72800,
        "settlement_rule": "T+1",
        "settlement_cash_date": "2026-06-16",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ]
      }
    }
  },
  {
    "id": "SB-L9-008",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-008",
    "prompt": "Frozen market snapshot:\n- Instrument: TSLA common stock. Order size: 700 shares at limit 77.25. The regular session is OPEN now; the after-hours venue is CLOSED; the dark venue is NOT enabled on this account.\n- Session/permission trap: only permitted, open venues are executable.\nCandidate routes (decide which venue is permitted and open yourself):\n- Route A (route_a): route the order to the continuous regular session\n- Route B (route_b): route the order to the closed after-hours venue with no permission\n- Route C (route_c): route via an unsupported dark venue not enabled on this account\n\nTask:\nRoute to the only feasible venue. Report rejected routes by route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"order_shares\", \"limit_price\", \"venue\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "TSLA",
      "order_shares": 700,
      "limit_price": 77.25,
      "venue": "regular_session",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Execution / liquidity / microstructure",
        "tier": "L9",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "invalid_route_session_trap",
        "feasibility_trap": true,
        "objective_function": "objective for invalid_route_session_trap",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "order_shares",
          "limit_price",
          "venue"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "TSLA",
        "order_shares": 700,
        "limit_price": 77.25,
        "venue": "regular_session",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-009",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-009",
    "prompt": "Frozen market snapshot:\n- Instrument: XLK ETF. Order size: 800 shares at limit 78.25. The regular session is OPEN now; the after-hours venue is CLOSED; the dark venue is NOT enabled on this account.\n- Auction/session constraint: only the open regular session is executable.\nCandidate routes (decide which venue is permitted and open yourself):\n- Route A (route_a): route the order to the continuous regular session\n- Route B (route_b): route the order to the closed after-hours venue with no permission\n- Route C (route_c): route via an unsupported dark venue not enabled on this account\n\nTask:\nRoute to the only feasible venue. Report rejected routes by route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"order_shares\", \"limit_price\", \"venue\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "XLK",
      "order_shares": 800,
      "limit_price": 78.25,
      "venue": "regular_session",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Execution / liquidity / microstructure",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "auction_session_constraint",
        "feasibility_trap": true,
        "objective_function": "objective for auction_session_constraint",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "order_shares",
          "limit_price",
          "venue"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "XLK",
        "order_shares": 800,
        "limit_price": 78.25,
        "venue": "regular_session",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-010",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-010",
    "prompt": "Frozen market snapshot:\n- Instrument: XLF ETF. TWAP-style execution with a hard slippage cap expressed as an average-price cap.\n- Mid price: 124.00. Maximum average execution price (cap): 124.11.\n- Ask book: 40000 @ 124.05; 40000 @ 124.10; 20000 @ 124.30.\n- Partial fills allowed only in 500-share clips. Fees ignored.\nCandidate routes:\n- Route A (route_a): walk the book filling cheapest levels first in 500-share clips while keeping the running average <= the cap\n- Route B (route_b): take the full displayed size across all levels at a single 124.30 limit\n\nTask:\nCompute the maximum buy quantity in allowed clips that keeps the average price at or below the cap. Report rejected routes by route id.\n\nObjective:\nmaximize filled_shares subject to average_price <= the cap, in 500-share clips.\n\nOutput JSON fields: { \"decision\", \"instrument\", \"side\", \"clip_size_shares\", \"filled_shares\", \"average_price\", \"limit_price\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "trade",
      "instrument": "XLF",
      "side": "buy",
      "clip_size_shares": 500,
      "filled_shares": 94500,
      "average_price": 124.11,
      "limit_price": 124.3,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Execution / liquidity / microstructure",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "twap_slippage_limit",
        "feasibility_trap": true,
        "objective_function": "objective for twap_slippage_limit",
        "deterministic_grading_fields": [
          "instrument",
          "side",
          "clip_size_shares",
          "filled_shares",
          "average_price",
          "limit_price"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "instrument": "XLF",
        "side": "buy",
        "clip_size_shares": 500,
        "filled_shares": 94500,
        "average_price": 124.11,
        "limit_price": 124.3,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ]
      }
    }
  },
  {
    "id": "SB-L9-011",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-011",
    "prompt": "Frozen market snapshot:\n- Account holder: US retail customer. Account base currency: USD. The EUR payment must settle on the required T+2 date (FX settlement mismatch trap).\n- Required: obtain 120000 EUR settling T+2. Spot EURUSD 1.0600. EUR futures initial margin capacity: 2000 USD.\nCandidate routes (decide feasibility from jurisdiction, settlement and margin facts yourself):\n- Route A (route_a): buy EUR spot at 1.0600, settles T+2, fees included\n- Route B (route_b): use a retail CFD on EURUSD\n- Route C (route_c): use EUR futures requiring 2750 USD initial margin\n- Route D (route_d): buy EUR via an outright forward that settles T+5, later than the required T+2 date\n\nTask:\nChoose the feasible route and compute USD cost. Report rejected routes by route id.\n\nObjective:\nobtain the EUR by the required settlement date at the lowest feasible USD cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"eur_amount\", \"usd_cost\", \"settlement_date_rule\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "convert_fx",
      "selected_route": "route_a",
      "eur_amount": 120000,
      "usd_cost": 127200,
      "settlement_date_rule": "T+2",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot FX / CFDs / multi-currency",
        "tier": "L9",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "fx_settlement_mismatch",
        "feasibility_trap": true,
        "objective_function": "objective for fx_settlement_mismatch",
        "deterministic_grading_fields": [
          "selected_route",
          "eur_amount",
          "usd_cost",
          "settlement_date_rule"
        ]
      },
      "canonical_answer": {
        "decision": "convert_fx",
        "selected_route": "route_a",
        "eur_amount": 120000,
        "usd_cost": 127200,
        "settlement_date_rule": "T+2",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ]
      }
    }
  },
  {
    "id": "SB-L9-012",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-012",
    "prompt": "Frozen market snapshot:\n- Instrument: SPY ETF. Order size: 200 shares at limit 81.25. The regular session is OPEN now; the after-hours venue is CLOSED; the dark venue is NOT enabled on this account.\n- Session/permission trap: only permitted, open venues are executable.\nCandidate routes (decide which venue is permitted and open yourself):\n- Route A (route_a): route the order to the continuous regular session\n- Route B (route_b): route the order to the closed after-hours venue with no permission\n- Route C (route_c): route via an unsupported dark venue not enabled on this account\n\nTask:\nRoute to the only feasible venue. Report rejected routes by route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"order_shares\", \"limit_price\", \"venue\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "SPY",
      "order_shares": 200,
      "limit_price": 81.25,
      "venue": "regular_session",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Execution / liquidity / microstructure",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "invalid_route_session_trap",
        "feasibility_trap": true,
        "objective_function": "objective for invalid_route_session_trap",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "order_shares",
          "limit_price",
          "venue"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "SPY",
        "order_shares": 200,
        "limit_price": 81.25,
        "venue": "regular_session",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-013",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-013",
    "prompt": "Frozen market snapshot:\n- Account holder: US retail customer. Account base currency: USD. Maintain a USD cash buffer; pick the lowest-USD-cost feasible conversion.\n- Required: obtain 160000 EUR settling T+2. Spot EURUSD 1.0600. EUR futures initial margin capacity: 2000 USD.\nCandidate routes (decide feasibility from jurisdiction, settlement and margin facts yourself):\n- Route A (route_a): buy EUR spot at 1.0600, settles T+2, fees included\n- Route B (route_b): use a retail CFD on EURUSD\n- Route C (route_c): use EUR futures requiring 3250 USD initial margin\n\nTask:\nChoose the feasible route and compute USD cost. Report rejected routes by route id.\n\nObjective:\nobtain the EUR by the required settlement date at the lowest feasible USD cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"eur_amount\", \"usd_cost\", \"settlement_date_rule\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "convert_fx",
      "selected_route": "route_a",
      "eur_amount": 160000,
      "usd_cost": 169600,
      "settlement_date_rule": "T+2",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot FX / CFDs / multi-currency",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "multi_currency_cash_buffer",
        "feasibility_trap": true,
        "objective_function": "objective for multi_currency_cash_buffer",
        "deterministic_grading_fields": [
          "selected_route",
          "eur_amount",
          "usd_cost",
          "settlement_date_rule"
        ]
      },
      "canonical_answer": {
        "decision": "convert_fx",
        "selected_route": "route_a",
        "eur_amount": 160000,
        "usd_cost": 169600,
        "settlement_date_rule": "T+2",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-014",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-014",
    "prompt": "Frozen market snapshot:\n- You hold 1 long ITM IWM ETF call, strike 180, spot 190.00.\n- Call quote 11.00/share; intrinsic = spot - strike = 10.00; remaining time value = quote - intrinsic = 1.00.\n- Ordinary dividend 1.60/share, ex-dividend tomorrow. Early exercise/assignment of an American call is rational only when the dividend exceeds the remaining time value.\nCandidate routes (decide from the exercise economics; do not assume a route):\n- Route A (route_a): exercise the long call early to capture the 1.60/share dividend (you forfeit remaining time value)\n- Route B (route_b): sell the long call at its 11.00 quote and keep the time value\n- Route C (route_c): roll the call to the next expiry\n\nTask:\nCompare the dividend to the time value, decide whether to exercise early, and select the route. Report rejected routes by route id.\n\nObjective:\nresolve the exercise/assignment decision at the highest economic value.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"dividend_per_share\", \"call_time_value\", \"exercise_early\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "exercise_decision",
      "selected_route": "route_a",
      "instrument": "IWM",
      "dividend_per_share": 1.6,
      "call_time_value": 1,
      "exercise_early": true,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "L9",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "exercise_assignment_roll_decision",
        "feasibility_trap": false,
        "objective_function": "objective for exercise_assignment_roll_decision",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "dividend_per_share",
          "call_time_value",
          "exercise_early"
        ]
      },
      "canonical_answer": {
        "decision": "exercise_decision",
        "selected_route": "route_a",
        "instrument": "IWM",
        "dividend_per_share": 1.6,
        "call_time_value": 1,
        "exercise_early": true,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-015",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-015",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is an index-futures beta hedge of the cash equity book using ES futures.\n- Portfolio equity beta-dollar exposure: 1000000 USD.\n- Required reduction: at least 45% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 33000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 257500 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 2 ES futures (beta hedge), ES at 5150.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 1 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 19000 USD premium that reduces beta-dollars by 515000 USD\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 2,
      "beta_reduction_usd": 515000,
      "beta_reduction_pct": 51.5,
      "margin_used": 26000,
      "expected_cost": 50,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "futures_beta_hedge",
        "feasibility_trap": true,
        "objective_function": "objective for futures_beta_hedge",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 2,
        "beta_reduction_usd": 515000,
        "beta_reduction_pct": 51.5,
        "margin_used": 26000,
        "expected_cost": 50,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-016",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-016",
    "prompt": "Frozen market snapshot:\n- Instrument: MSFT common stock. Order size: 600 shares at limit 85.25. The regular session is OPEN now; the after-hours venue is CLOSED; the dark venue is NOT enabled on this account.\n- Session/permission trap: only permitted, open venues are executable.\nCandidate routes (decide which venue is permitted and open yourself):\n- Route A (route_a): route the order to the continuous regular session\n- Route B (route_b): route the order to the closed after-hours venue with no permission\n- Route C (route_c): route via an unsupported dark venue not enabled on this account\n\nTask:\nRoute to the only feasible venue. Report rejected routes by route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"order_shares\", \"limit_price\", \"venue\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "MSFT",
      "order_shares": 600,
      "limit_price": 85.25,
      "venue": "regular_session",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Execution / liquidity / microstructure",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "invalid_route_session_trap",
        "feasibility_trap": true,
        "objective_function": "objective for invalid_route_session_trap",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "order_shares",
          "limit_price",
          "venue"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "MSFT",
        "order_shares": 600,
        "limit_price": 85.25,
        "venue": "regular_session",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-017",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-017",
    "prompt": "Frozen market snapshot:\n- Account holder: US retail customer. Account base currency: USD. Maintain a USD cash buffer; pick the lowest-USD-cost feasible conversion.\n- Required: obtain 240000 EUR settling T+2. Spot EURUSD 1.0600. EUR futures initial margin capacity: 2000 USD.\nCandidate routes (decide feasibility from jurisdiction, settlement and margin facts yourself):\n- Route A (route_a): buy EUR spot at 1.0600, settles T+2, fees included\n- Route B (route_b): use a retail CFD on EURUSD\n- Route C (route_c): use EUR futures requiring 2750 USD initial margin\n\nTask:\nChoose the feasible route and compute USD cost. Report rejected routes by route id.\n\nObjective:\nobtain the EUR by the required settlement date at the lowest feasible USD cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"eur_amount\", \"usd_cost\", \"settlement_date_rule\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "convert_fx",
      "selected_route": "route_a",
      "eur_amount": 240000,
      "usd_cost": 254400,
      "settlement_date_rule": "T+2",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot FX / CFDs / multi-currency",
        "tier": "L9",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "multi_currency_cash_buffer",
        "feasibility_trap": true,
        "objective_function": "objective for multi_currency_cash_buffer",
        "deterministic_grading_fields": [
          "selected_route",
          "eur_amount",
          "usd_cost",
          "settlement_date_rule"
        ]
      },
      "canonical_answer": {
        "decision": "convert_fx",
        "selected_route": "route_a",
        "eur_amount": 240000,
        "usd_cost": 254400,
        "settlement_date_rule": "T+2",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-018",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-018",
    "prompt": "Frozen market snapshot:\n- You hold 1 long ITM TSLA common stock call, strike 200, spot 210.00.\n- Call quote 12.00/share; intrinsic = spot - strike = 10.00; remaining time value = quote - intrinsic = 2.00.\n- Ordinary dividend 2.60/share, ex-dividend tomorrow. Early exercise/assignment of an American call is rational only when the dividend exceeds the remaining time value.\nCandidate routes (decide from the exercise economics; do not assume a route):\n- Route A (route_a): exercise the long call early to capture the 2.60/share dividend (you forfeit remaining time value)\n- Route B (route_b): sell the long call at its 12.00 quote and keep the time value\n- Route C (route_c): roll the call to the next expiry\n\nTask:\nCompare the dividend to the time value, decide whether to exercise early, and select the route. Report rejected routes by route id.\n\nObjective:\nresolve the exercise/assignment decision at the highest economic value.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"dividend_per_share\", \"call_time_value\", \"exercise_early\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "exercise_decision",
      "selected_route": "route_a",
      "instrument": "TSLA",
      "dividend_per_share": 2.6,
      "call_time_value": 2,
      "exercise_early": true,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "exercise_assignment_roll_decision",
        "feasibility_trap": false,
        "objective_function": "objective for exercise_assignment_roll_decision",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "dividend_per_share",
          "call_time_value",
          "exercise_early"
        ]
      },
      "canonical_answer": {
        "decision": "exercise_decision",
        "selected_route": "route_a",
        "instrument": "TSLA",
        "dividend_per_share": 2.6,
        "call_time_value": 2,
        "exercise_early": true,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-019",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-019",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is an index-futures beta hedge of the cash equity book using ES futures.\n- Portfolio equity beta-dollar exposure: 1200000 USD.\n- Required reduction: at least 50% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 46000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 262500 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 3 ES futures (beta hedge), ES at 5250.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 2 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 19000 USD premium that reduces beta-dollars by 787500 USD\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 3,
      "beta_reduction_usd": 787500,
      "beta_reduction_pct": 65.63,
      "margin_used": 39000,
      "expected_cost": 75,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "futures_beta_hedge",
        "feasibility_trap": true,
        "objective_function": "objective for futures_beta_hedge",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 3,
        "beta_reduction_usd": 787500,
        "beta_reduction_pct": 65.63,
        "margin_used": 39000,
        "expected_cost": 75,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-020",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-020",
    "prompt": "Frozen market snapshot:\n- Instrument: XLF ETF. Order size: 100 shares at limit 89.25. The regular session is OPEN now; the after-hours venue is CLOSED; the dark venue is NOT enabled on this account.\n- Session/permission trap: only permitted, open venues are executable.\nCandidate routes (decide which venue is permitted and open yourself):\n- Route A (route_a): route the order to the continuous regular session\n- Route B (route_b): route the order to the closed after-hours venue with no permission\n- Route C (route_c): route via an unsupported dark venue not enabled on this account\n\nTask:\nRoute to the only feasible venue. Report rejected routes by route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"order_shares\", \"limit_price\", \"venue\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "XLF",
      "order_shares": 100,
      "limit_price": 89.25,
      "venue": "regular_session",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Execution / liquidity / microstructure",
        "tier": "L9",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "invalid_route_session_trap",
        "feasibility_trap": true,
        "objective_function": "objective for invalid_route_session_trap",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "order_shares",
          "limit_price",
          "venue"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "XLF",
        "order_shares": 100,
        "limit_price": 89.25,
        "venue": "regular_session",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-021",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-021",
    "prompt": "Frozen market snapshot:\n- Account holder: US retail customer. Account base currency: USD. Maintain a USD cash buffer; pick the lowest-USD-cost feasible conversion.\n- Required: obtain 320000 EUR settling T+2. Spot EURUSD 1.0700. EUR futures initial margin capacity: 2000 USD.\nCandidate routes (decide feasibility from jurisdiction, settlement and margin facts yourself):\n- Route A (route_a): buy EUR spot at 1.0700, settles T+2, fees included\n- Route B (route_b): use a retail CFD on EURUSD\n- Route C (route_c): use EUR futures requiring 3000 USD initial margin\n\nTask:\nChoose the feasible route and compute USD cost. Report rejected routes by route id.\n\nObjective:\nobtain the EUR by the required settlement date at the lowest feasible USD cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"eur_amount\", \"usd_cost\", \"settlement_date_rule\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "convert_fx",
      "selected_route": "route_a",
      "eur_amount": 320000,
      "usd_cost": 342400,
      "settlement_date_rule": "T+2",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot FX / CFDs / multi-currency",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "multi_currency_cash_buffer",
        "feasibility_trap": true,
        "objective_function": "objective for multi_currency_cash_buffer",
        "deterministic_grading_fields": [
          "selected_route",
          "eur_amount",
          "usd_cost",
          "settlement_date_rule"
        ]
      },
      "canonical_answer": {
        "decision": "convert_fx",
        "selected_route": "route_a",
        "eur_amount": 320000,
        "usd_cost": 342400,
        "settlement_date_rule": "T+2",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-022",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-022",
    "prompt": "Frozen market snapshot:\n- You hold 1 long ITM SPY ETF call, strike 180, spot 190.00.\n- Call quote 13.00/share; intrinsic = spot - strike = 10.00; remaining time value = quote - intrinsic = 3.00.\n- Ordinary dividend 3.60/share, ex-dividend tomorrow. Early exercise/assignment of an American call is rational only when the dividend exceeds the remaining time value.\nCandidate routes (decide from the exercise economics; do not assume a route):\n- Route A (route_a): exercise the long call early to capture the 3.60/share dividend (you forfeit remaining time value)\n- Route B (route_b): sell the long call at its 13.00 quote and keep the time value\n- Route C (route_c): roll the call to the next expiry\n\nTask:\nCompare the dividend to the time value, decide whether to exercise early, and select the route. Report rejected routes by route id.\n\nObjective:\nresolve the exercise/assignment decision at the highest economic value.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"dividend_per_share\", \"call_time_value\", \"exercise_early\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "exercise_decision",
      "selected_route": "route_a",
      "instrument": "SPY",
      "dividend_per_share": 3.6,
      "call_time_value": 3,
      "exercise_early": true,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "exercise_assignment_roll_decision",
        "feasibility_trap": false,
        "objective_function": "objective for exercise_assignment_roll_decision",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "dividend_per_share",
          "call_time_value",
          "exercise_early"
        ]
      },
      "canonical_answer": {
        "decision": "exercise_decision",
        "selected_route": "route_a",
        "instrument": "SPY",
        "dividend_per_share": 3.6,
        "call_time_value": 3,
        "exercise_early": true,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-023",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-023",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is an index-futures beta hedge of the cash equity book using ES futures.\n- Portfolio equity beta-dollar exposure: 950000 USD.\n- Required reduction: at least 40% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 33000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 253750 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 2 ES futures (beta hedge), ES at 5075.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 1 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 19000 USD premium that reduces beta-dollars by 507500 USD\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 2,
      "beta_reduction_usd": 507500,
      "beta_reduction_pct": 53.42,
      "margin_used": 26000,
      "expected_cost": 50,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "L9",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "futures_beta_hedge",
        "feasibility_trap": true,
        "objective_function": "objective for futures_beta_hedge",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 2,
        "beta_reduction_usd": 507500,
        "beta_reduction_pct": 53.42,
        "margin_used": 26000,
        "expected_cost": 50,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-024",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-024",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is a drawdown hedge across the equity book; minimize hedge cost.\n- Portfolio equity beta-dollar exposure: 1000000 USD.\n- Required reduction: at least 45% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 33000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 255000 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 2 ES futures (beta hedge), ES at 5100.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 1 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 20000 USD premium that reduces beta-dollars by 510000 USD\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 2,
      "beta_reduction_usd": 510000,
      "beta_reduction_pct": 51,
      "margin_used": 26000,
      "expected_cost": 50,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Portfolio risk / rebalancing",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "multi_asset_drawdown_hedge",
        "feasibility_trap": false,
        "objective_function": "objective for multi_asset_drawdown_hedge",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 2,
        "beta_reduction_usd": 510000,
        "beta_reduction_pct": 51,
        "margin_used": 26000,
        "expected_cost": 50,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-025",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-025",
    "prompt": "Frozen market snapshot:\n- Instrument: AAPL common stock. Order size: 600 shares at limit 94.25. The regular session is OPEN now; the after-hours venue is CLOSED; the dark venue is NOT enabled on this account.\n- Auction/session constraint: only the open regular session is executable.\nCandidate routes (decide which venue is permitted and open yourself):\n- Route A (route_a): route the order to the continuous regular session\n- Route B (route_b): route the order to the closed after-hours venue with no permission\n- Route C (route_c): route via an unsupported dark venue not enabled on this account\n\nTask:\nRoute to the only feasible venue. Report rejected routes by route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"order_shares\", \"limit_price\", \"venue\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "AAPL",
      "order_shares": 600,
      "limit_price": 94.25,
      "venue": "regular_session",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Execution / liquidity / microstructure",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "auction_session_constraint",
        "feasibility_trap": true,
        "objective_function": "objective for auction_session_constraint",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "order_shares",
          "limit_price",
          "venue"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "AAPL",
        "order_shares": 600,
        "limit_price": 94.25,
        "venue": "regular_session",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-026",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-026",
    "prompt": "Frozen market snapshot:\n- Account holder: US retail customer. Account base currency: USD. Payment is required on the T+2 date; a later forward settlement misses it.\n- Required: obtain 80000 EUR settling T+2. Spot EURUSD 1.0700. EUR futures initial margin capacity: 2000 USD.\nCandidate routes (decide feasibility from jurisdiction, settlement and margin facts yourself):\n- Route A (route_a): buy EUR spot at 1.0700, settles T+2, fees included\n- Route B (route_b): use a retail CFD on EURUSD\n- Route C (route_c): use EUR futures requiring 2750 USD initial margin\n- Route D (route_d): buy EUR via an outright forward that settles T+5, later than the required T+2 date\n\nTask:\nChoose the feasible route and compute USD cost. Report rejected routes by route id.\n\nObjective:\nobtain the EUR by the required settlement date at the lowest feasible USD cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"eur_amount\", \"usd_cost\", \"settlement_date_rule\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "convert_fx",
      "selected_route": "route_a",
      "eur_amount": 80000,
      "usd_cost": 85600,
      "settlement_date_rule": "T+2",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot FX / CFDs / multi-currency",
        "tier": "L9",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "forward_vs_spot_payment",
        "feasibility_trap": false,
        "objective_function": "objective for forward_vs_spot_payment",
        "deterministic_grading_fields": [
          "selected_route",
          "eur_amount",
          "usd_cost",
          "settlement_date_rule"
        ]
      },
      "canonical_answer": {
        "decision": "convert_fx",
        "selected_route": "route_a",
        "eur_amount": 80000,
        "usd_cost": 85600,
        "settlement_date_rule": "T+2",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ]
      }
    }
  },
  {
    "id": "SB-L9-027",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-027",
    "prompt": "Frozen market snapshot:\n- Instrument: NVDA common stock. Corporate action: ordinary cash dividend 0.55/share, ex-dividend tomorrow.\n- Existing GTC sell-stop price: 245.00. Related listed option strike: 250.00.\n- Broker rule: reduce GTC equity stop prices by the ordinary cash dividend on ex-date; listed option strikes are NOT adjusted for ordinary cash dividends.\nCandidate routes (decide which matches the corporate-action rules):\n- Route A (route_a): reduce the GTC sell-stop by the ordinary dividend on ex-date; leave the listed option strike unchanged\n- Route B (route_b): leave the GTC stop unchanged through ex-date\n- Route C (route_c): reduce the listed option strike by the ordinary dividend\n\nTask:\nCompute the adjusted stop and the option-strike treatment. Report rejected routes by route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"adjusted_stop_price\", \"option_strike_adjusted\", \"option_strike_after\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "adjust_order_for_ex_dividend",
      "selected_route": "route_a",
      "adjusted_stop_price": 244.45,
      "option_strike_adjusted": false,
      "option_strike_after": 250,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Corporate actions / settlement / calendar / jurisdiction",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "ex_dividend_adjustment",
        "feasibility_trap": true,
        "objective_function": "objective for ex_dividend_adjustment",
        "deterministic_grading_fields": [
          "selected_route",
          "adjusted_stop_price",
          "option_strike_adjusted",
          "option_strike_after"
        ]
      },
      "canonical_answer": {
        "decision": "adjust_order_for_ex_dividend",
        "selected_route": "route_a",
        "adjusted_stop_price": 244.45,
        "option_strike_adjusted": false,
        "option_strike_after": 250,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-028",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-028",
    "prompt": "Frozen market snapshot:\n- Account: US margin account. A borrow recall on TSLA common stock forces you to close 500 short shares today; no new locate is available.\nCandidate routes (decide feasibility from the recall and locate facts):\n- Route A (route_a): buy to cover 500 recalled shares and replace exposure with 5 listed puts (premium 8.00/share, multiplier 100)\n- Route B (route_b): ignore the borrow recall and keep the short open\n- Route C (route_c): short additional shares to average down (no locate available)\n\nTask:\nHandle the borrow recall and keep bearish exposure feasibly. Report rejected routes by route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"buy_to_cover_shares\", \"put_contracts\", \"premium_paid\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "TSLA",
      "buy_to_cover_shares": 500,
      "put_contracts": 5,
      "premium_paid": 4000,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Feasibility / rejection / no-trade traps",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "borrow_recall_margin_hedge",
        "feasibility_trap": true,
        "objective_function": "objective for borrow_recall_margin_hedge",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "buy_to_cover_shares",
          "put_contracts",
          "premium_paid"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "TSLA",
        "buy_to_cover_shares": 500,
        "put_contracts": 5,
        "premium_paid": 4000,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-029",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-029",
    "prompt": "Frozen market snapshot:\n- Covered call on XLK ETF: long 100 shares at 215.00, short 1 210 call.\n- Call quote: 6.40 USD/share; option multiplier 100 shares. Intrinsic = max(0, spot - strike).\n- Ordinary cash dividend 0.90/share with ex-dividend tomorrow. Early assignment of an American call is rational for the holder when the dividend exceeds the call's remaining time value.\nCandidate routes (decide which is required by the assignment economics):\n- Route A (route_a): roll/close the short call before ex-dividend to avoid early assignment\n- Route B (route_b): hold the covered call through ex-dividend unchanged\n\nTask:\nCompute the call's time value, compare to the dividend, decide the early-assignment risk, and select the route. Report rejected routes by route id.\n\nObjective:\nremove early-assignment/dividend risk when and only when it is economically rational.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"call_strike\", \"dividend_per_share\", \"call_time_value\", \"early_assignment_risk\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "manage_assignment",
      "selected_route": "route_b",
      "instrument": "XLK",
      "call_strike": 210,
      "dividend_per_share": 0.9,
      "call_time_value": 1.4,
      "early_assignment_risk": false,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_a"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "L9",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "early_assignment_dividend_risk",
        "feasibility_trap": false,
        "objective_function": "objective for early_assignment_dividend_risk",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "call_strike",
          "dividend_per_share",
          "call_time_value",
          "early_assignment_risk"
        ]
      },
      "canonical_answer": {
        "decision": "manage_assignment",
        "selected_route": "route_b",
        "instrument": "XLK",
        "call_strike": 210,
        "dividend_per_share": 0.9,
        "call_time_value": 1.4,
        "early_assignment_risk": false,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_a"
        ]
      }
    }
  },
  {
    "id": "SB-L9-030",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-030",
    "prompt": "Frozen market snapshot:\n- Account: futures account using the simplified SPAN margin figures in this packet.\n- Objective: add crude-oil carry exposure with SPAN margin_used <= 11500 USD.\nCandidate routes (decide feasibility yourself from the SPAN margin figures):\n- Route A (route_a): long 7 CL June / short 7 CL July calendar spread, expected carry 1100 USD, SPAN margin 10000 USD\n- Route B (route_b): long 5 outright CL contracts, expected carry 1600 USD, SPAN margin 22000 USD\n- Route C (route_c): stay flat, expected carry 0 USD, SPAN margin 0 USD\n\nTask:\nSelect the feasible strategy with the highest expected carry under the SPAN margin cap. Report rejected routes by route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"spread_count\", \"expected_carry_usd\", \"margin_used\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "spread_count": 7,
      "expected_carry_usd": 1100,
      "margin_used": 10000,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "span_margin_calendar_spread",
        "feasibility_trap": false,
        "objective_function": "objective for span_margin_calendar_spread",
        "deterministic_grading_fields": [
          "selected_route",
          "spread_count",
          "expected_carry_usd",
          "margin_used"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "spread_count": 7,
        "expected_carry_usd": 1100,
        "margin_used": 10000,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-031",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-031",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is a beta-dollar rebalance against the stated beta target.\n- Portfolio equity beta-dollar exposure: 900000 USD.\n- Required reduction: at least 50% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 33000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 250000 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 2 ES futures (beta hedge), ES at 5000.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 1 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 19000 USD premium that reduces beta-dollars by 500000 USD\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 2,
      "beta_reduction_usd": 500000,
      "beta_reduction_pct": 55.56,
      "margin_used": 26000,
      "expected_cost": 50,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Portfolio risk / rebalancing",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "beta_dollar_rebalance",
        "feasibility_trap": true,
        "objective_function": "objective for beta_dollar_rebalance",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 2,
        "beta_reduction_usd": 500000,
        "beta_reduction_pct": 55.56,
        "margin_used": 26000,
        "expected_cost": 50,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-032",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-032",
    "prompt": "Frozen market snapshot:\n- Instrument: SPY ETF. Order size: 400 shares at limit 101.25. The regular session is OPEN now; the after-hours venue is CLOSED; the dark venue is NOT enabled on this account.\n- Session/permission trap: only permitted, open venues are executable.\nCandidate routes (decide which venue is permitted and open yourself):\n- Route A (route_a): route the order to the continuous regular session\n- Route B (route_b): route the order to the closed after-hours venue with no permission\n- Route C (route_c): route via an unsupported dark venue not enabled on this account\n\nTask:\nRoute to the only feasible venue. Report rejected routes by route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"order_shares\", \"limit_price\", \"venue\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "SPY",
      "order_shares": 400,
      "limit_price": 101.25,
      "venue": "regular_session",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Execution / liquidity / microstructure",
        "tier": "L9",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "invalid_route_session_trap",
        "feasibility_trap": true,
        "objective_function": "objective for invalid_route_session_trap",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "order_shares",
          "limit_price",
          "venue"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "SPY",
        "order_shares": 400,
        "limit_price": 101.25,
        "venue": "regular_session",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-033",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-033",
    "prompt": "Frozen market snapshot:\n- Account holder: US retail customer. Account base currency: USD. Maintain a USD cash buffer; pick the lowest-USD-cost feasible conversion.\n- Required: obtain 220000 EUR settling T+2. Spot EURUSD 1.0500. EUR futures initial margin capacity: 2000 USD.\nCandidate routes (decide feasibility from jurisdiction, settlement and margin facts yourself):\n- Route A (route_a): buy EUR spot at 1.0500, settles T+2, fees included\n- Route B (route_b): use a retail CFD on EURUSD\n- Route C (route_c): use EUR futures requiring 3000 USD initial margin\n\nTask:\nChoose the feasible route and compute USD cost. Report rejected routes by route id.\n\nObjective:\nobtain the EUR by the required settlement date at the lowest feasible USD cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"eur_amount\", \"usd_cost\", \"settlement_date_rule\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "convert_fx",
      "selected_route": "route_a",
      "eur_amount": 220000,
      "usd_cost": 231000,
      "settlement_date_rule": "T+2",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot FX / CFDs / multi-currency",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "multi_currency_cash_buffer",
        "feasibility_trap": true,
        "objective_function": "objective for multi_currency_cash_buffer",
        "deterministic_grading_fields": [
          "selected_route",
          "eur_amount",
          "usd_cost",
          "settlement_date_rule"
        ]
      },
      "canonical_answer": {
        "decision": "convert_fx",
        "selected_route": "route_a",
        "eur_amount": 220000,
        "usd_cost": 231000,
        "settlement_date_rule": "T+2",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-034",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-034",
    "prompt": "Frozen market snapshot:\n- Instrument: IWM ETF at 220.00. Account calendar: the next day is a settlement holiday, so T+1 cash lands on the stated date.\n- Trade date 2026-06-19; T+1 cash settlement date 2026-06-22. Unsettled proceeds cannot be withdrawn before settlement.\nCandidate routes (decide which respects settlement):\n- Route A (route_a): sell 400 shares on 2026-06-19; withdraw cash only after T+1 settlement on 2026-06-22\n- Route B (route_b): sell 400 shares on 2026-06-19 and withdraw the proceeds on the trade date 2026-06-19\n\nTask:\nSell and report trade value and the T+1 cash date. Report rejected routes by route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"trade_value_usd\", \"settlement_rule\", \"settlement_cash_date\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "sell",
      "selected_route": "route_a",
      "trade_value_usd": 88000,
      "settlement_rule": "T+1",
      "settlement_cash_date": "2026-06-22",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Corporate actions / settlement / calendar / jurisdiction",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "regional_market_holiday",
        "feasibility_trap": true,
        "objective_function": "objective for regional_market_holiday",
        "deterministic_grading_fields": [
          "selected_route",
          "trade_value_usd",
          "settlement_rule",
          "settlement_cash_date"
        ]
      },
      "canonical_answer": {
        "decision": "sell",
        "selected_route": "route_a",
        "trade_value_usd": 88000,
        "settlement_rule": "T+1",
        "settlement_cash_date": "2026-06-22",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ]
      }
    }
  },
  {
    "id": "SB-L9-035",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-035",
    "prompt": "Frozen market snapshot:\n- Jurisdiction / account regime: US cash account.\n- Permissions: CFDs unavailable; short selling unavailable in cash accounts; futures not approved; the regular equity session is closed.\n- No alternative product permission is enabled in this packet.\nCandidate routes (decide feasibility from the permission facts; a no-trade is required if all routes violate constraints):\n- Route A (route_a): short 600 AAPL shares via CFD after the regular session close\n- Route B (route_b): short 600 AAPL shares in the cash account\n- Route C (route_c): buy AAPL futures to get short exposure\n\nTask:\nReject every invalid route and return the no-trade decision. Report rejected routes by route id.\n\nObjective:\nreturn no_trade if and only if every route violates a permission, session, or product constraint.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"requested_shares\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "no_trade",
      "selected_route": "none",
      "instrument": "AAPL",
      "requested_shares": 600,
      "feasibility": "infeasible",
      "rejected_routes": [
        "route_a",
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Feasibility / rejection / no-trade traps",
        "tier": "L9",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "no_trade_invalid_route",
        "feasibility_trap": true,
        "objective_function": "objective for no_trade_invalid_route",
        "deterministic_grading_fields": [
          "decision",
          "selected_route",
          "instrument",
          "requested_shares",
          "feasibility"
        ]
      },
      "canonical_answer": {
        "decision": "no_trade",
        "selected_route": "none",
        "instrument": "AAPL",
        "requested_shares": 600,
        "feasibility": "infeasible",
        "rejected_routes": [
          "route_a",
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-036",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-036",
    "prompt": "Frozen market snapshot:\n- Instrument: MSFT common stock at 122.00. This is a sector ETF rebalance leg; equities/ETFs settle T+1.\n- Buy 800 shares with a protective day limit 122.25; T+1 cash date 2026-06-24.\nCandidate routes:\n- Route A (route_a): submit a day limit buy ticket for 800 shares at 122.25 in the regular session\n- Route B (route_b): submit a market buy that ignores the protective limit\n\nTask:\nCreate the order ticket and report trade value and T+1 date. Report rejected routes by route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"side\", \"quantity\", \"order_type\", \"limit_price\", \"trade_value_usd\", \"settlement_rule\", \"settlement_cash_date\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "MSFT",
      "side": "buy",
      "quantity": 800,
      "order_type": "limit",
      "limit_price": 122.25,
      "trade_value_usd": 97600,
      "settlement_rule": "T+1",
      "settlement_cash_date": "2026-06-24",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot equities / ETFs",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "etf_sector_rebalance_t_plus_one",
        "feasibility_trap": false,
        "objective_function": "objective for etf_sector_rebalance_t_plus_one",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "side",
          "quantity",
          "order_type",
          "limit_price",
          "trade_value_usd",
          "settlement_rule",
          "settlement_cash_date"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "MSFT",
        "side": "buy",
        "quantity": 800,
        "order_type": "limit",
        "limit_price": 122.25,
        "trade_value_usd": 97600,
        "settlement_rule": "T+1",
        "settlement_cash_date": "2026-06-24",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ]
      }
    }
  },
  {
    "id": "SB-L9-037",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-037",
    "prompt": "Frozen market snapshot:\n- Covered call on NVDA common stock: long 100 shares at 215.00, short 1 220 call.\n- Call quote: 1.40 USD/share; option multiplier 100 shares. Intrinsic = max(0, spot - strike).\n- Ordinary cash dividend 1.30/share with ex-dividend tomorrow. Early assignment of an American call is rational for the holder when the dividend exceeds the call's remaining time value.\nCandidate routes (decide which is required by the assignment economics):\n- Route A (route_a): roll/close the short call before ex-dividend to avoid early assignment\n- Route B (route_b): hold the covered call through ex-dividend unchanged\n\nTask:\nCompute the call's time value, compare to the dividend, decide the early-assignment risk, and select the route. Report rejected routes by route id.\n\nObjective:\nremove early-assignment/dividend risk when and only when it is economically rational.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"call_strike\", \"dividend_per_share\", \"call_time_value\", \"early_assignment_risk\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "manage_assignment",
      "selected_route": "route_b",
      "instrument": "NVDA",
      "call_strike": 220,
      "dividend_per_share": 1.3,
      "call_time_value": 1.4,
      "early_assignment_risk": false,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_a"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "early_assignment_dividend_risk",
        "feasibility_trap": false,
        "objective_function": "objective for early_assignment_dividend_risk",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "call_strike",
          "dividend_per_share",
          "call_time_value",
          "early_assignment_risk"
        ]
      },
      "canonical_answer": {
        "decision": "manage_assignment",
        "selected_route": "route_b",
        "instrument": "NVDA",
        "call_strike": 220,
        "dividend_per_share": 1.3,
        "call_time_value": 1.4,
        "early_assignment_risk": false,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_a"
        ]
      }
    }
  },
  {
    "id": "SB-L9-038",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-038",
    "prompt": "Frozen market snapshot:\n- Account: futures account using the simplified SPAN margin figures in this packet.\n- Objective: add crude-oil carry exposure with SPAN margin_used <= 10500 USD.\nCandidate routes (decide feasibility yourself from the SPAN margin figures):\n- Route A (route_a): long 3 CL June / short 3 CL July calendar spread, expected carry 1000 USD, SPAN margin 9000 USD\n- Route B (route_b): long 1 outright CL contracts, expected carry 1400 USD, SPAN margin 22000 USD\n- Route C (route_c): stay flat, expected carry 0 USD, SPAN margin 0 USD\n\nTask:\nSelect the feasible strategy with the highest expected carry under the SPAN margin cap. Report rejected routes by route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"spread_count\", \"expected_carry_usd\", \"margin_used\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "spread_count": 3,
      "expected_carry_usd": 1000,
      "margin_used": 9000,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "L9",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "span_margin_calendar_spread",
        "feasibility_trap": false,
        "objective_function": "objective for span_margin_calendar_spread",
        "deterministic_grading_fields": [
          "selected_route",
          "spread_count",
          "expected_carry_usd",
          "margin_used"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "spread_count": 3,
        "expected_carry_usd": 1000,
        "margin_used": 9000,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-039",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-039",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is a beta-dollar rebalance against the stated beta target.\n- Portfolio equity beta-dollar exposure: 850000 USD.\n- Required reduction: at least 45% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 33000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 260000 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 2 ES futures (beta hedge), ES at 5200.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 1 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 19000 USD premium that reduces beta-dollars by 520000 USD\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 2,
      "beta_reduction_usd": 520000,
      "beta_reduction_pct": 61.18,
      "margin_used": 26000,
      "expected_cost": 50,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Portfolio risk / rebalancing",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "beta_dollar_rebalance",
        "feasibility_trap": true,
        "objective_function": "objective for beta_dollar_rebalance",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 2,
        "beta_reduction_usd": 520000,
        "beta_reduction_pct": 61.18,
        "margin_used": 26000,
        "expected_cost": 50,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-040",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-040",
    "prompt": "Frozen market snapshot:\n- Account: US margin account. Borrow rate is 6.00% APR; weigh borrow cost against edge.\n- Instrument: XLF ETF at 140.00. Desired bearish target: short 1200 shares of exposure.\n- Locate availability: exactly 400 shares. Option cash available: 1600 USD. Put delta -0.35 means 35 delta-shares per contract.\nCandidate routes (decide feasibility from the locate and cash limits yourself):\n- Route A (route_a): short exactly the 400 located shares and buy 2 listed puts (delta -0.35, premium 8.00 USD/share, multiplier 100) within 1600 USD option cash\n- Route B (route_b): short the full 1200-share target (requires shares beyond the locate)\n- Route C (route_c): buy 6 listed puts (premium 8.00 USD/share, multiplier 100), ignoring the option cash limit\n\nTask:\nChoose the feasible bearish implementation that maximizes bearish delta-shares without breaching the locate or option cash. Report rejected routes by route id.\n\nObjective:\nmaximize bearish delta-shares subject to locate and option-cash constraints.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"short_shares\", \"put_contracts\", \"premium_paid\", \"bearish_delta_shares\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "XLF",
      "short_shares": 400,
      "put_contracts": 2,
      "premium_paid": 1600,
      "bearish_delta_shares": 470,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Shorting / borrow / margin / locates",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "borrow_cost_vs_trade_edge",
        "feasibility_trap": true,
        "objective_function": "objective for borrow_cost_vs_trade_edge",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "short_shares",
          "put_contracts",
          "premium_paid",
          "bearish_delta_shares"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "XLF",
        "short_shares": 400,
        "put_contracts": 2,
        "premium_paid": 1600,
        "bearish_delta_shares": 470,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-041",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-041",
    "prompt": "Frozen market snapshot:\n- Instrument: GLD ETF. Order size: 400 shares at limit 57.25. The regular session is OPEN now; the after-hours venue is CLOSED; the dark venue is NOT enabled on this account.\n- Auction/session constraint: only the open regular session is executable.\nCandidate routes (decide which venue is permitted and open yourself):\n- Route A (route_a): route the order to the continuous regular session\n- Route B (route_b): route the order to the closed after-hours venue with no permission\n- Route C (route_c): route via an unsupported dark venue not enabled on this account\n\nTask:\nRoute to the only feasible venue. Report rejected routes by route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"order_shares\", \"limit_price\", \"venue\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "GLD",
      "order_shares": 400,
      "limit_price": 57.25,
      "venue": "regular_session",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Execution / liquidity / microstructure",
        "tier": "L9",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "auction_session_constraint",
        "feasibility_trap": true,
        "objective_function": "objective for auction_session_constraint",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "order_shares",
          "limit_price",
          "venue"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "GLD",
        "order_shares": 400,
        "limit_price": 57.25,
        "venue": "regular_session",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-042",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-042",
    "prompt": "Frozen market snapshot:\n- Account holder: US retail customer. Account base currency: USD. Payment is required on the T+2 date; a later forward settlement misses it.\n- Required: obtain 400000 EUR settling T+2. Spot EURUSD 1.0600. EUR futures initial margin capacity: 2000 USD.\nCandidate routes (decide feasibility from jurisdiction, settlement and margin facts yourself):\n- Route A (route_a): buy EUR spot at 1.0600, settles T+2, fees included\n- Route B (route_b): use a retail CFD on EURUSD\n- Route C (route_c): use EUR futures requiring 3000 USD initial margin\n- Route D (route_d): buy EUR via an outright forward that settles T+5, later than the required T+2 date\n\nTask:\nChoose the feasible route and compute USD cost. Report rejected routes by route id.\n\nObjective:\nobtain the EUR by the required settlement date at the lowest feasible USD cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"eur_amount\", \"usd_cost\", \"settlement_date_rule\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "convert_fx",
      "selected_route": "route_a",
      "eur_amount": 400000,
      "usd_cost": 424000,
      "settlement_date_rule": "T+2",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot FX / CFDs / multi-currency",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "forward_vs_spot_payment",
        "feasibility_trap": false,
        "objective_function": "objective for forward_vs_spot_payment",
        "deterministic_grading_fields": [
          "selected_route",
          "eur_amount",
          "usd_cost",
          "settlement_date_rule"
        ]
      },
      "canonical_answer": {
        "decision": "convert_fx",
        "selected_route": "route_a",
        "eur_amount": 400000,
        "usd_cost": 424000,
        "settlement_date_rule": "T+2",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ]
      }
    }
  },
  {
    "id": "SB-L9-043",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-043",
    "prompt": "Frozen market snapshot:\n- Instrument: QQQ ETF. Corporate action: ordinary cash dividend 0.55/share, ex-dividend tomorrow.\n- Existing GTC sell-stop price: 205.00. Related listed option strike: 210.00.\n- Broker rule: reduce GTC equity stop prices by the ordinary cash dividend on ex-date; listed option strikes are NOT adjusted for ordinary cash dividends.\nCandidate routes (decide which matches the corporate-action rules):\n- Route A (route_a): reduce the GTC sell-stop by the ordinary dividend on ex-date; leave the listed option strike unchanged\n- Route B (route_b): leave the GTC stop unchanged through ex-date\n- Route C (route_c): reduce the listed option strike by the ordinary dividend\n\nTask:\nCompute the adjusted stop and the option-strike treatment. Report rejected routes by route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"adjusted_stop_price\", \"option_strike_adjusted\", \"option_strike_after\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "adjust_order_for_ex_dividend",
      "selected_route": "route_a",
      "adjusted_stop_price": 204.45,
      "option_strike_adjusted": false,
      "option_strike_after": 210,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Corporate actions / settlement / calendar / jurisdiction",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "ex_dividend_adjustment",
        "feasibility_trap": true,
        "objective_function": "objective for ex_dividend_adjustment",
        "deterministic_grading_fields": [
          "selected_route",
          "adjusted_stop_price",
          "option_strike_adjusted",
          "option_strike_after"
        ]
      },
      "canonical_answer": {
        "decision": "adjust_order_for_ex_dividend",
        "selected_route": "route_a",
        "adjusted_stop_price": 204.45,
        "option_strike_adjusted": false,
        "option_strike_after": 210,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-044",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-044",
    "prompt": "Frozen market snapshot:\n- Account: US margin account. A borrow recall on IWM ETF forces you to close 300 short shares today; no new locate is available.\nCandidate routes (decide feasibility from the recall and locate facts):\n- Route A (route_a): buy to cover 300 recalled shares and replace exposure with 3 listed puts (premium 8.00/share, multiplier 100)\n- Route B (route_b): ignore the borrow recall and keep the short open\n- Route C (route_c): short additional shares to average down (no locate available)\n\nTask:\nHandle the borrow recall and keep bearish exposure feasibly. Report rejected routes by route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"buy_to_cover_shares\", \"put_contracts\", \"premium_paid\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "IWM",
      "buy_to_cover_shares": 300,
      "put_contracts": 3,
      "premium_paid": 2400,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Feasibility / rejection / no-trade traps",
        "tier": "L9",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "borrow_recall_margin_hedge",
        "feasibility_trap": true,
        "objective_function": "objective for borrow_recall_margin_hedge",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "buy_to_cover_shares",
          "put_contracts",
          "premium_paid"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "IWM",
        "buy_to_cover_shares": 300,
        "put_contracts": 3,
        "premium_paid": 2400,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-045",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-045",
    "prompt": "Frozen market snapshot:\n- Instrument: AAPL common stock at 149.00. Objective is to participate in the opening auction with a protective limit.\n- Order size 800 shares; protective limit 149.25.\nCandidate routes (decide which matches the auction/close objective):\n- Route A (route_a): place a limit-on-open auction order for 800 shares\n- Route B (route_b): cross the spread immediately in the continuous session, missing the opening auction\n\nTask:\nSelect the order route matching the objective. Report rejected routes by route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"quantity\", \"limit_price\", \"venue\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "AAPL",
      "quantity": 800,
      "limit_price": 149.25,
      "venue": "opening_auction",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot equities / ETFs",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "opening_auction_limit",
        "feasibility_trap": false,
        "objective_function": "objective for opening_auction_limit",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "quantity",
          "limit_price",
          "venue"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "AAPL",
        "quantity": 800,
        "limit_price": 149.25,
        "venue": "opening_auction",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ]
      }
    }
  },
  {
    "id": "SB-L9-046",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-046",
    "prompt": "Frozen market snapshot:\n- You hold 1 long ITM MSFT common stock call, strike 180, spot 190.00.\n- Call quote 13.00/share; intrinsic = spot - strike = 10.00; remaining time value = quote - intrinsic = 3.00.\n- Ordinary dividend 3.60/share, ex-dividend tomorrow. Early exercise/assignment of an American call is rational only when the dividend exceeds the remaining time value.\nCandidate routes (decide from the exercise economics; do not assume a route):\n- Route A (route_a): exercise the long call early to capture the 3.60/share dividend (you forfeit remaining time value)\n- Route B (route_b): sell the long call at its 13.00 quote and keep the time value\n- Route C (route_c): roll the call to the next expiry\n\nTask:\nCompare the dividend to the time value, decide whether to exercise early, and select the route. Report rejected routes by route id.\n\nObjective:\nresolve the exercise/assignment decision at the highest economic value.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"dividend_per_share\", \"call_time_value\", \"exercise_early\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "exercise_decision",
      "selected_route": "route_a",
      "instrument": "MSFT",
      "dividend_per_share": 3.6,
      "call_time_value": 3,
      "exercise_early": true,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "exercise_assignment_roll_decision",
        "feasibility_trap": false,
        "objective_function": "objective for exercise_assignment_roll_decision",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "dividend_per_share",
          "call_time_value",
          "exercise_early"
        ]
      },
      "canonical_answer": {
        "decision": "exercise_decision",
        "selected_route": "route_a",
        "instrument": "MSFT",
        "dividend_per_share": 3.6,
        "call_time_value": 3,
        "exercise_early": true,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-047",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-047",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is an index-futures beta hedge of the cash equity book using ES futures.\n- Portfolio equity beta-dollar exposure: 800000 USD.\n- Required reduction: at least 40% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 33000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 256250 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 2 ES futures (beta hedge), ES at 5125.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 1 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 19000 USD premium that reduces beta-dollars by 512500 USD\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 2,
      "beta_reduction_usd": 512500,
      "beta_reduction_pct": 64.06,
      "margin_used": 26000,
      "expected_cost": 50,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "L9",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "futures_beta_hedge",
        "feasibility_trap": true,
        "objective_function": "objective for futures_beta_hedge",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 2,
        "beta_reduction_usd": 512500,
        "beta_reduction_pct": 64.06,
        "margin_used": 26000,
        "expected_cost": 50,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-048",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-048",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is a drawdown hedge across the equity book; minimize hedge cost.\n- Portfolio equity beta-dollar exposure: 850000 USD.\n- Required reduction: at least 45% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 33000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 257500 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 2 ES futures (beta hedge), ES at 5150.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 1 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 20000 USD premium that reduces beta-dollars by 515000 USD\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 2,
      "beta_reduction_usd": 515000,
      "beta_reduction_pct": 60.59,
      "margin_used": 26000,
      "expected_cost": 50,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Portfolio risk / rebalancing",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "multi_asset_drawdown_hedge",
        "feasibility_trap": false,
        "objective_function": "objective for multi_asset_drawdown_hedge",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 2,
        "beta_reduction_usd": 515000,
        "beta_reduction_pct": 60.59,
        "margin_used": 26000,
        "expected_cost": 50,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-049",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-049",
    "prompt": "Frozen market snapshot:\n- Account: US margin account. XLK is hard-to-borrow with recall risk; you cannot exceed the locate.\n- Instrument: XLK ETF at 230.00. Desired bearish target: short 1300 shares of exposure.\n- Locate availability: exactly 600 shares. Option cash available: 2400 USD. Put delta -0.35 means 35 delta-shares per contract.\nCandidate routes (decide feasibility from the locate and cash limits yourself):\n- Route A (route_a): short exactly the 600 located shares and buy 3 listed puts (delta -0.35, premium 8.00 USD/share, multiplier 100) within 2400 USD option cash\n- Route B (route_b): short the full 1300-share target (requires shares beyond the locate)\n- Route C (route_c): buy 7 listed puts (premium 8.00 USD/share, multiplier 100), ignoring the option cash limit\n\nTask:\nChoose the feasible bearish implementation that maximizes bearish delta-shares without breaching the locate or option cash. Report rejected routes by route id.\n\nObjective:\nmaximize bearish delta-shares subject to locate and option-cash constraints.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"short_shares\", \"put_contracts\", \"premium_paid\", \"bearish_delta_shares\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "XLK",
      "short_shares": 600,
      "put_contracts": 3,
      "premium_paid": 2400,
      "bearish_delta_shares": 705,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Shorting / borrow / margin / locates",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "hard_to_borrow_margin_recall",
        "feasibility_trap": true,
        "objective_function": "objective for hard_to_borrow_margin_recall",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "short_shares",
          "put_contracts",
          "premium_paid",
          "bearish_delta_shares"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "XLK",
        "short_shares": 600,
        "put_contracts": 3,
        "premium_paid": 2400,
        "bearish_delta_shares": 705,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-050",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-050",
    "prompt": "Frozen market snapshot:\n- Instrument: XLF ETF. TWAP-style execution with a hard slippage cap expressed as an average-price cap.\n- Mid price: 135.00. Maximum average execution price (cap): 135.11.\n- Ask book: 40000 @ 135.05; 40000 @ 135.10; 20000 @ 135.30.\n- Partial fills allowed only in 500-share clips. Fees ignored.\nCandidate routes:\n- Route A (route_a): walk the book filling cheapest levels first in 500-share clips while keeping the running average <= the cap\n- Route B (route_b): take the full displayed size across all levels at a single 135.30 limit\n\nTask:\nCompute the maximum buy quantity in allowed clips that keeps the average price at or below the cap. Report rejected routes by route id.\n\nObjective:\nmaximize filled_shares subject to average_price <= the cap, in 500-share clips.\n\nOutput JSON fields: { \"decision\", \"instrument\", \"side\", \"clip_size_shares\", \"filled_shares\", \"average_price\", \"limit_price\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "trade",
      "instrument": "XLF",
      "side": "buy",
      "clip_size_shares": 500,
      "filled_shares": 94500,
      "average_price": 135.11,
      "limit_price": 135.3,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Execution / liquidity / microstructure",
        "tier": "L9",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "twap_slippage_limit",
        "feasibility_trap": true,
        "objective_function": "objective for twap_slippage_limit",
        "deterministic_grading_fields": [
          "instrument",
          "side",
          "clip_size_shares",
          "filled_shares",
          "average_price",
          "limit_price"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "instrument": "XLF",
        "side": "buy",
        "clip_size_shares": 500,
        "filled_shares": 94500,
        "average_price": 135.11,
        "limit_price": 135.3,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ]
      }
    }
  },
  {
    "id": "SB-L9-051",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-051",
    "prompt": "Frozen market snapshot:\n- Account holder: US retail customer. Account base currency: USD. The EUR payment must settle on the required T+2 date (FX settlement mismatch trap).\n- Required: obtain 240000 EUR settling T+2. Spot EURUSD 1.0700. EUR futures initial margin capacity: 2000 USD.\nCandidate routes (decide feasibility from jurisdiction, settlement and margin facts yourself):\n- Route A (route_a): buy EUR spot at 1.0700, settles T+2, fees included\n- Route B (route_b): use a retail CFD on EURUSD\n- Route C (route_c): use EUR futures requiring 3000 USD initial margin\n- Route D (route_d): buy EUR via an outright forward that settles T+5, later than the required T+2 date\n\nTask:\nChoose the feasible route and compute USD cost. Report rejected routes by route id.\n\nObjective:\nobtain the EUR by the required settlement date at the lowest feasible USD cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"eur_amount\", \"usd_cost\", \"settlement_date_rule\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "convert_fx",
      "selected_route": "route_a",
      "eur_amount": 240000,
      "usd_cost": 256800,
      "settlement_date_rule": "T+2",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot FX / CFDs / multi-currency",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "fx_settlement_mismatch",
        "feasibility_trap": true,
        "objective_function": "objective for fx_settlement_mismatch",
        "deterministic_grading_fields": [
          "selected_route",
          "eur_amount",
          "usd_cost",
          "settlement_date_rule"
        ]
      },
      "canonical_answer": {
        "decision": "convert_fx",
        "selected_route": "route_a",
        "eur_amount": 240000,
        "usd_cost": 256800,
        "settlement_date_rule": "T+2",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ]
      }
    }
  },
  {
    "id": "SB-L9-052",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-052",
    "prompt": "Frozen market snapshot:\n- Instrument: SPY ETF at 200.00. US equities settle T+1.\n- Trade date 2026-06-23; T+1 cash settlement date 2026-06-24. Unsettled proceeds cannot be withdrawn before settlement.\nCandidate routes (decide which respects settlement):\n- Route A (route_a): sell 200 shares on 2026-06-23; withdraw cash only after T+1 settlement on 2026-06-24\n- Route B (route_b): sell 200 shares on 2026-06-23 and withdraw the proceeds on the trade date 2026-06-23\n\nTask:\nSell and report trade value and the T+1 cash date. Report rejected routes by route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"trade_value_usd\", \"settlement_rule\", \"settlement_cash_date\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "sell",
      "selected_route": "route_a",
      "trade_value_usd": 40000,
      "settlement_rule": "T+1",
      "settlement_cash_date": "2026-06-24",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Corporate actions / settlement / calendar / jurisdiction",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "t_plus_one_settlement_sequence",
        "feasibility_trap": true,
        "objective_function": "objective for t_plus_one_settlement_sequence",
        "deterministic_grading_fields": [
          "selected_route",
          "trade_value_usd",
          "settlement_rule",
          "settlement_cash_date"
        ]
      },
      "canonical_answer": {
        "decision": "sell",
        "selected_route": "route_a",
        "trade_value_usd": 40000,
        "settlement_rule": "T+1",
        "settlement_cash_date": "2026-06-24",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ]
      }
    }
  },
  {
    "id": "SB-L9-053",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-053",
    "prompt": "Frozen market snapshot:\n- Jurisdiction / account regime: US cash account.\n- Permissions: CFDs unavailable; short selling unavailable in cash accounts; futures not approved; the regular equity session is closed.\n- No alternative product permission is enabled in this packet.\nCandidate routes (decide feasibility from the permission facts; a no-trade is required if all routes violate constraints):\n- Route A (route_a): short 600 QQQ shares via CFD after the regular session close\n- Route B (route_b): short 600 QQQ shares in the cash account\n- Route C (route_c): buy QQQ futures to get short exposure\n\nTask:\nReject every invalid route and return the no-trade decision. Report rejected routes by route id.\n\nObjective:\nreturn no_trade if and only if every route violates a permission, session, or product constraint.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"requested_shares\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "no_trade",
      "selected_route": "none",
      "instrument": "QQQ",
      "requested_shares": 600,
      "feasibility": "infeasible",
      "rejected_routes": [
        "route_a",
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Feasibility / rejection / no-trade traps",
        "tier": "L9",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "unsupported_product_permission",
        "feasibility_trap": true,
        "objective_function": "objective for unsupported_product_permission",
        "deterministic_grading_fields": [
          "decision",
          "selected_route",
          "instrument",
          "requested_shares",
          "feasibility"
        ]
      },
      "canonical_answer": {
        "decision": "no_trade",
        "selected_route": "none",
        "instrument": "QQQ",
        "requested_shares": 600,
        "feasibility": "infeasible",
        "rejected_routes": [
          "route_a",
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-054",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-054",
    "prompt": "Frozen market snapshot:\n- Instrument: IWM ETF at 176.00. Objective is to participate in the closing print (market on close / MOC) for an index rebalance.\n- Order size 800 shares; protective limit 176.25.\nCandidate routes (decide which matches the auction/close objective):\n- Route A (route_a): place a market-on-close (MOC) order for 800 shares\n- Route B (route_b): cross the spread immediately in the continuous session, missing the close\n\nTask:\nSelect the order route matching the objective. Report rejected routes by route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"quantity\", \"limit_price\", \"venue\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "IWM",
      "quantity": 800,
      "limit_price": 176.25,
      "venue": "market_on_close",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot equities / ETFs",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "market_on_close_rebalance",
        "feasibility_trap": false,
        "objective_function": "objective for market_on_close_rebalance",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "quantity",
          "limit_price",
          "venue"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "IWM",
        "quantity": 800,
        "limit_price": 176.25,
        "venue": "market_on_close",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ]
      }
    }
  },
  {
    "id": "SB-L9-055",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-055",
    "prompt": "Frozen market snapshot:\n- Covered call on AAPL common stock: long 100 shares at 185.00, short 1 190 call.\n- Call quote: 0.80 USD/share; option multiplier 100 shares. Intrinsic = max(0, spot - strike).\n- Ordinary cash dividend 1.30/share with ex-dividend tomorrow. Early assignment of an American call is rational for the holder when the dividend exceeds the call's remaining time value.\nCandidate routes (decide which is required by the assignment economics):\n- Route A (route_a): roll/close the short call before ex-dividend to avoid early assignment\n- Route B (route_b): hold the covered call through ex-dividend unchanged\n\nTask:\nCompute the call's time value, compare to the dividend, decide the early-assignment risk, and select the route. Report rejected routes by route id.\n\nObjective:\nremove early-assignment/dividend risk when and only when it is economically rational.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"call_strike\", \"dividend_per_share\", \"call_time_value\", \"early_assignment_risk\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "manage_assignment",
      "selected_route": "route_b",
      "instrument": "AAPL",
      "call_strike": 190,
      "dividend_per_share": 1.3,
      "call_time_value": 0.8,
      "early_assignment_risk": false,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_a"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "covered_call_assignment",
        "feasibility_trap": true,
        "objective_function": "objective for covered_call_assignment",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "call_strike",
          "dividend_per_share",
          "call_time_value",
          "early_assignment_risk"
        ]
      },
      "canonical_answer": {
        "decision": "manage_assignment",
        "selected_route": "route_b",
        "instrument": "AAPL",
        "call_strike": 190,
        "dividend_per_share": 1.3,
        "call_time_value": 0.8,
        "early_assignment_risk": false,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_a"
        ]
      }
    }
  },
  {
    "id": "SB-L9-056",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-056",
    "prompt": "Frozen market snapshot:\n- Position: long 5 CL near-month futures. This is a futures roll calendar ahead of first notice; use executable bid/ask, not mid.\n- First notice day is tomorrow; account policy forbids holding physically deliverable CL long into first notice.\n- Only the displayed bid/ask is executable; mid prices are indicative and not executable.\nCandidate routes (decide feasibility yourself):\n- Route A (route_a): roll by selling near at bid 83.00 and buying next at ask 83.35; CL multiplier 1000 barrels; fee 4 USD/contract/leg\n- Route B (route_b): roll using the near/next mid prices instead of bid/ask\n- Route C (route_c): hold the long near-month position into first notice day\n\nTask:\nRoll the position and compute total executable cost. Report rejected routes by route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"contracts\", \"roll_cost_usd\", \"fees_usd\", \"total_cost_usd\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "roll",
      "selected_route": "route_a",
      "contracts": 5,
      "roll_cost_usd": 1750,
      "fees_usd": 40,
      "total_cost_usd": 1790,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "L9",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "futures_roll_calendar",
        "feasibility_trap": false,
        "objective_function": "objective for futures_roll_calendar",
        "deterministic_grading_fields": [
          "selected_route",
          "contracts",
          "roll_cost_usd",
          "fees_usd",
          "total_cost_usd"
        ]
      },
      "canonical_answer": {
        "decision": "roll",
        "selected_route": "route_a",
        "contracts": 5,
        "roll_cost_usd": 1750,
        "fees_usd": 40,
        "total_cost_usd": 1790,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-057",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-057",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is a VaR/liquidity triage; only listed futures liquidity is usable.\n- Portfolio equity beta-dollar exposure: 850000 USD.\n- Required reduction: at least 45% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 33000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 255000 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 2 ES futures (beta hedge), ES at 5100.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 1 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 21000 USD premium that reduces beta-dollars by 510000 USD\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 2,
      "beta_reduction_usd": 510000,
      "beta_reduction_pct": 60,
      "margin_used": 26000,
      "expected_cost": 50,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Portfolio risk / rebalancing",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "cross_asset_var_liquidity_triage",
        "feasibility_trap": false,
        "objective_function": "objective for cross_asset_var_liquidity_triage",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 2,
        "beta_reduction_usd": 510000,
        "beta_reduction_pct": 60,
        "margin_used": 26000,
        "expected_cost": 50,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-058",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-058",
    "prompt": "Frozen market snapshot:\n- Account: US margin account. On recall, substitute listed puts for the un-locatable short.\n- Instrument: TSLA common stock at 200.00. Desired bearish target: short 1000 shares of exposure.\n- Locate availability: exactly 800 shares. Option cash available: 3200 USD. Put delta -0.35 means 35 delta-shares per contract.\nCandidate routes (decide feasibility from the locate and cash limits yourself):\n- Route A (route_a): short exactly the 800 located shares and buy 4 listed puts (delta -0.35, premium 8.00 USD/share, multiplier 100) within 3200 USD option cash\n- Route B (route_b): short the full 1000-share target (requires shares beyond the locate)\n- Route C (route_c): buy 8 listed puts (premium 8.00 USD/share, multiplier 100), ignoring the option cash limit\n\nTask:\nChoose the feasible bearish implementation that maximizes bearish delta-shares without breaching the locate or option cash. Report rejected routes by route id.\n\nObjective:\nmaximize bearish delta-shares subject to locate and option-cash constraints.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"short_shares\", \"put_contracts\", \"premium_paid\", \"bearish_delta_shares\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "TSLA",
      "short_shares": 800,
      "put_contracts": 4,
      "premium_paid": 3200,
      "bearish_delta_shares": 940,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Shorting / borrow / margin / locates",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "locate_recall_options_substitution",
        "feasibility_trap": true,
        "objective_function": "objective for locate_recall_options_substitution",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "short_shares",
          "put_contracts",
          "premium_paid",
          "bearish_delta_shares"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "TSLA",
        "short_shares": 800,
        "put_contracts": 4,
        "premium_paid": 3200,
        "bearish_delta_shares": 940,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-059",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-059",
    "prompt": "Frozen market snapshot:\n- Instrument: XLK ETF. Order-book liquidity limit: maximize fill under the average-price cap.\n- Mid price: 115.00. Maximum average execution price (cap): 115.11.\n- Ask book: 40000 @ 115.05; 40000 @ 115.10; 20000 @ 115.30.\n- Partial fills allowed only in 500-share clips. Fees ignored.\nCandidate routes:\n- Route A (route_a): walk the book filling cheapest levels first in 500-share clips while keeping the running average <= the cap\n- Route B (route_b): take the full displayed size across all levels at a single 115.30 limit\n\nTask:\nCompute the maximum buy quantity in allowed clips that keeps the average price at or below the cap. Report rejected routes by route id.\n\nObjective:\nmaximize filled_shares subject to average_price <= the cap, in 500-share clips.\n\nOutput JSON fields: { \"decision\", \"instrument\", \"side\", \"clip_size_shares\", \"filled_shares\", \"average_price\", \"limit_price\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "trade",
      "instrument": "XLK",
      "side": "buy",
      "clip_size_shares": 500,
      "filled_shares": 94500,
      "average_price": 115.11,
      "limit_price": 115.3,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Execution / liquidity / microstructure",
        "tier": "L9",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "order_book_liquidity_limit",
        "feasibility_trap": true,
        "objective_function": "objective for order_book_liquidity_limit",
        "deterministic_grading_fields": [
          "instrument",
          "side",
          "clip_size_shares",
          "filled_shares",
          "average_price",
          "limit_price"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "instrument": "XLK",
        "side": "buy",
        "clip_size_shares": 500,
        "filled_shares": 94500,
        "average_price": 115.11,
        "limit_price": 115.3,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ]
      }
    }
  },
  {
    "id": "SB-L9-060",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-060",
    "prompt": "Frozen market snapshot:\n- Account holder: US retail customer. Account base currency: USD. CFDs are unavailable to US retail accounts in this jurisdiction.\n- Required: obtain 80000 EUR settling T+2. Spot EURUSD 1.0600. EUR futures initial margin capacity: 2000 USD.\nCandidate routes (decide feasibility from jurisdiction, settlement and margin facts yourself):\n- Route A (route_a): buy EUR spot at 1.0600, settles T+2, fees included\n- Route B (route_b): use a retail CFD on EURUSD\n- Route C (route_c): use EUR futures requiring 3000 USD initial margin\n\nTask:\nChoose the feasible route and compute USD cost. Report rejected routes by route id.\n\nObjective:\nobtain the EUR by the required settlement date at the lowest feasible USD cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"eur_amount\", \"usd_cost\", \"settlement_date_rule\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "convert_fx",
      "selected_route": "route_a",
      "eur_amount": 80000,
      "usd_cost": 84800,
      "settlement_date_rule": "T+2",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot FX / CFDs / multi-currency",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "cfd_margin_regional_constraint",
        "feasibility_trap": false,
        "objective_function": "objective for cfd_margin_regional_constraint",
        "deterministic_grading_fields": [
          "selected_route",
          "eur_amount",
          "usd_cost",
          "settlement_date_rule"
        ]
      },
      "canonical_answer": {
        "decision": "convert_fx",
        "selected_route": "route_a",
        "eur_amount": 80000,
        "usd_cost": 84800,
        "settlement_date_rule": "T+2",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-061",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-061",
    "prompt": "Frozen market snapshot:\n- Instrument: GLD ETF. Corporate action: ordinary cash dividend 0.65/share, ex-dividend tomorrow.\n- Existing GTC sell-stop price: 285.00. Related listed option strike: 290.00.\n- Broker rule: reduce GTC equity stop prices by the ordinary cash dividend on ex-date; listed option strikes are NOT adjusted for ordinary cash dividends.\nCandidate routes (decide which matches the corporate-action rules):\n- Route A (route_a): reduce the GTC sell-stop by the ordinary dividend on ex-date; leave the listed option strike unchanged\n- Route B (route_b): leave the GTC stop unchanged through ex-date\n- Route C (route_c): reduce the listed option strike by the ordinary dividend\n\nTask:\nCompute the adjusted stop and the option-strike treatment. Report rejected routes by route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"adjusted_stop_price\", \"option_strike_adjusted\", \"option_strike_after\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "adjust_order_for_ex_dividend",
      "selected_route": "route_a",
      "adjusted_stop_price": 284.35,
      "option_strike_adjusted": false,
      "option_strike_after": 290,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Corporate actions / settlement / calendar / jurisdiction",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "corporate_action_adjustment",
        "feasibility_trap": true,
        "objective_function": "objective for corporate_action_adjustment",
        "deterministic_grading_fields": [
          "selected_route",
          "adjusted_stop_price",
          "option_strike_adjusted",
          "option_strike_after"
        ]
      },
      "canonical_answer": {
        "decision": "adjust_order_for_ex_dividend",
        "selected_route": "route_a",
        "adjusted_stop_price": 284.35,
        "option_strike_adjusted": false,
        "option_strike_after": 290,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-062",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-062",
    "prompt": "Frozen market snapshot:\n- Jurisdiction / account regime: US cash account.\n- Permissions: CFDs unavailable; short selling unavailable in cash accounts; futures not approved; the regular equity session is closed.\n- No alternative product permission is enabled in this packet.\nCandidate routes (decide feasibility from the permission facts; a no-trade is required if all routes violate constraints):\n- Route A (route_a): short 300 SPY shares via CFD after the regular session close\n- Route B (route_b): short 300 SPY shares in the cash account\n- Route C (route_c): buy SPY futures to get short exposure\n\nTask:\nReject every invalid route and return the no-trade decision. Report rejected routes by route id.\n\nObjective:\nreturn no_trade if and only if every route violates a permission, session, or product constraint.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"requested_shares\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "no_trade",
      "selected_route": "none",
      "instrument": "SPY",
      "requested_shares": 300,
      "feasibility": "infeasible",
      "rejected_routes": [
        "route_a",
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Feasibility / rejection / no-trade traps",
        "tier": "L9",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "session_permission_rejection",
        "feasibility_trap": true,
        "objective_function": "objective for session_permission_rejection",
        "deterministic_grading_fields": [
          "decision",
          "selected_route",
          "instrument",
          "requested_shares",
          "feasibility"
        ]
      },
      "canonical_answer": {
        "decision": "no_trade",
        "selected_route": "none",
        "instrument": "SPY",
        "requested_shares": 300,
        "feasibility": "infeasible",
        "rejected_routes": [
          "route_a",
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-063",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-063",
    "prompt": "Frozen market snapshot:\n- Instrument: QQQ ETF at 83.00. This is an equity order ticket; equities settle T+1.\n- Buy 800 shares with a protective day limit 83.25; T+1 cash date 2026-06-17.\nCandidate routes:\n- Route A (route_a): submit a day limit buy ticket for 800 shares at 83.25 in the regular session\n- Route B (route_b): submit a market buy that ignores the protective limit\n\nTask:\nCreate the order ticket and report trade value and T+1 date. Report rejected routes by route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"side\", \"quantity\", \"order_type\", \"limit_price\", \"trade_value_usd\", \"settlement_rule\", \"settlement_cash_date\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "QQQ",
      "side": "buy",
      "quantity": 800,
      "order_type": "limit",
      "limit_price": 83.25,
      "trade_value_usd": 66400,
      "settlement_rule": "T+1",
      "settlement_cash_date": "2026-06-17",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot equities / ETFs",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "equity_order_ticket",
        "feasibility_trap": true,
        "objective_function": "objective for equity_order_ticket",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "side",
          "quantity",
          "order_type",
          "limit_price",
          "trade_value_usd",
          "settlement_rule",
          "settlement_cash_date"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "QQQ",
        "side": "buy",
        "quantity": 800,
        "order_type": "limit",
        "limit_price": 83.25,
        "trade_value_usd": 66400,
        "settlement_rule": "T+1",
        "settlement_cash_date": "2026-06-17",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ]
      }
    }
  },
  {
    "id": "SB-L9-064",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-064",
    "prompt": "Frozen market snapshot:\n- Position: long 1,000 IWM ETF at 500.00.\n- Downside scenario for grading: IWM closes at 450.00 at option expiry.\n- Constraint: scenario PnL including option premium must be no worse than -30000 USD (a downside floor on this put spread).\n- Option multiplier: 100 shares; use exactly 10 spreads. Stock PnL + spread payoff - net premium = scenario PnL.\nCandidate put spreads (decide which meet the floor; pick the lowest net premium among those that do):\n- Route A (route_a): buy 10 IWM 500 puts at 12.00 and sell 10 IWM 490 puts at 7.00 (put spread)\n- Route B (route_b): buy 10 IWM 500 puts at 12.00 and sell 10 IWM 480 puts at 5.00 (put spread)\n- Route C (route_c): buy 10 IWM 500 puts at 12.00 and sell 10 IWM 470 puts at 3.00 (put spread)\n\nTask:\nSelect the feasible put spread and compute net premium and scenario PnL. Report rejected routes by route id.\n\nObjective:\nminimize net premium subject to scenario_pnl_usd >= the stated floor.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"buy_put_strike\", \"sell_put_strike\", \"contracts\", \"net_premium_paid\", \"scenario_pnl_usd\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_c",
      "buy_put_strike": 500,
      "sell_put_strike": 470,
      "contracts": 10,
      "net_premium_paid": 9000,
      "scenario_pnl_usd": -29000,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_a",
        "route_b"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "put_spread_downside_floor",
        "feasibility_trap": false,
        "objective_function": "objective for put_spread_downside_floor",
        "deterministic_grading_fields": [
          "selected_route",
          "buy_put_strike",
          "sell_put_strike",
          "contracts",
          "net_premium_paid",
          "scenario_pnl_usd"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_c",
        "buy_put_strike": 500,
        "sell_put_strike": 470,
        "contracts": 10,
        "net_premium_paid": 9000,
        "scenario_pnl_usd": -29000,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_a",
          "route_b"
        ]
      }
    }
  },
  {
    "id": "SB-L9-065",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-065",
    "prompt": "Frozen market snapshot:\n- Position: long 7 CL near-month futures. This is a commodity roll with basis between near and next; use executable bid/ask, not mid.\n- First notice day is tomorrow; account policy forbids holding physically deliverable CL long into first notice.\n- Only the displayed bid/ask is executable; mid prices are indicative and not executable.\nCandidate routes (decide feasibility yourself):\n- Route A (route_a): roll by selling near at bid 75.00 and buying next at ask 75.35; CL multiplier 1000 barrels; fee 4 USD/contract/leg\n- Route B (route_b): roll using the near/next mid prices instead of bid/ask\n- Route C (route_c): hold the long near-month position into first notice day\n\nTask:\nRoll the position and compute total executable cost. Report rejected routes by route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"contracts\", \"roll_cost_usd\", \"fees_usd\", \"total_cost_usd\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "roll",
      "selected_route": "route_a",
      "contracts": 7,
      "roll_cost_usd": 2450,
      "fees_usd": 56,
      "total_cost_usd": 2506,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "L9",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "commodity_roll_basis_hedge",
        "feasibility_trap": true,
        "objective_function": "objective for commodity_roll_basis_hedge",
        "deterministic_grading_fields": [
          "selected_route",
          "contracts",
          "roll_cost_usd",
          "fees_usd",
          "total_cost_usd"
        ]
      },
      "canonical_answer": {
        "decision": "roll",
        "selected_route": "route_a",
        "contracts": 7,
        "roll_cost_usd": 2450,
        "fees_usd": 56,
        "total_cost_usd": 2506,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-066",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-066",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is a risk budget rebalance against the stated beta target.\n- Portfolio equity beta-dollar exposure: 850000 USD.\n- Required reduction: at least 45% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 33000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 252500 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 2 ES futures (beta hedge), ES at 5050.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 1 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 18000 USD premium that reduces beta-dollars by 505000 USD\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 2,
      "beta_reduction_usd": 505000,
      "beta_reduction_pct": 59.41,
      "margin_used": 26000,
      "expected_cost": 50,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Portfolio risk / rebalancing",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "risk_budget_rebalance",
        "feasibility_trap": false,
        "objective_function": "objective for risk_budget_rebalance",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 2,
        "beta_reduction_usd": 505000,
        "beta_reduction_pct": 59.41,
        "margin_used": 26000,
        "expected_cost": 50,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-067",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-067",
    "prompt": "Frozen market snapshot:\n- Account: US margin account. Short selling requires a locate before order entry; you cannot short beyond the locate.\n- Instrument: NVDA common stock at 170.00. Desired bearish target: short 1100 shares of exposure.\n- Locate availability: exactly 300 shares. Option cash available: 800 USD. Put delta -0.35 means 35 delta-shares per contract.\nCandidate routes (decide feasibility from the locate and cash limits yourself):\n- Route A (route_a): short exactly the 300 located shares and buy 1 listed puts (delta -0.35, premium 8.00 USD/share, multiplier 100) within 800 USD option cash\n- Route B (route_b): short the full 1100-share target (requires shares beyond the locate)\n- Route C (route_c): buy 5 listed puts (premium 8.00 USD/share, multiplier 100), ignoring the option cash limit\n\nTask:\nChoose the feasible bearish implementation that maximizes bearish delta-shares without breaching the locate or option cash. Report rejected routes by route id.\n\nObjective:\nmaximize bearish delta-shares subject to locate and option-cash constraints.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"short_shares\", \"put_contracts\", \"premium_paid\", \"bearish_delta_shares\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "NVDA",
      "short_shares": 300,
      "put_contracts": 1,
      "premium_paid": 800,
      "bearish_delta_shares": 335,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Shorting / borrow / margin / locates",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "short_locate_failure",
        "feasibility_trap": true,
        "objective_function": "objective for short_locate_failure",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "short_shares",
          "put_contracts",
          "premium_paid",
          "bearish_delta_shares"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "NVDA",
        "short_shares": 300,
        "put_contracts": 1,
        "premium_paid": 800,
        "bearish_delta_shares": 335,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-068",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-068",
    "prompt": "Frozen market snapshot:\n- Instrument: TSLA common stock. Order size: 400 shares at limit 84.25. The regular session is OPEN now; the after-hours venue is CLOSED; the dark venue is NOT enabled on this account.\n- Session/permission trap: only permitted, open venues are executable.\nCandidate routes (decide which venue is permitted and open yourself):\n- Route A (route_a): route the order to the continuous regular session\n- Route B (route_b): route the order to the closed after-hours venue with no permission\n- Route C (route_c): route via an unsupported dark venue not enabled on this account\n\nTask:\nRoute to the only feasible venue. Report rejected routes by route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"order_shares\", \"limit_price\", \"venue\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "TSLA",
      "order_shares": 400,
      "limit_price": 84.25,
      "venue": "regular_session",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Execution / liquidity / microstructure",
        "tier": "L9",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "invalid_route_session_trap",
        "feasibility_trap": true,
        "objective_function": "objective for invalid_route_session_trap",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "order_shares",
          "limit_price",
          "venue"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "TSLA",
        "order_shares": 400,
        "limit_price": 84.25,
        "venue": "regular_session",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-069",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-069",
    "prompt": "Frozen market snapshot:\n- Account holder: US retail customer. Account base currency: USD. Maintain a USD cash buffer; pick the lowest-USD-cost feasible conversion.\n- Required: obtain 260000 EUR settling T+2. Spot EURUSD 1.0700. EUR futures initial margin capacity: 2000 USD.\nCandidate routes (decide feasibility from jurisdiction, settlement and margin facts yourself):\n- Route A (route_a): buy EUR spot at 1.0700, settles T+2, fees included\n- Route B (route_b): use a retail CFD on EURUSD\n- Route C (route_c): use EUR futures requiring 3000 USD initial margin\n\nTask:\nChoose the feasible route and compute USD cost. Report rejected routes by route id.\n\nObjective:\nobtain the EUR by the required settlement date at the lowest feasible USD cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"eur_amount\", \"usd_cost\", \"settlement_date_rule\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "convert_fx",
      "selected_route": "route_a",
      "eur_amount": 260000,
      "usd_cost": 278200,
      "settlement_date_rule": "T+2",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot FX / CFDs / multi-currency",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "multi_currency_cash_buffer",
        "feasibility_trap": true,
        "objective_function": "objective for multi_currency_cash_buffer",
        "deterministic_grading_fields": [
          "selected_route",
          "eur_amount",
          "usd_cost",
          "settlement_date_rule"
        ]
      },
      "canonical_answer": {
        "decision": "convert_fx",
        "selected_route": "route_a",
        "eur_amount": 260000,
        "usd_cost": 278200,
        "settlement_date_rule": "T+2",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-070",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-070",
    "prompt": "Frozen market snapshot:\n- Instrument: XLF ETF at 280.00. Account calendar: the next day is a settlement holiday, so T+1 cash lands on the stated date.\n- Trade date 2026-06-15; T+1 cash settlement date 2026-06-16. Unsettled proceeds cannot be withdrawn before settlement.\nCandidate routes (decide which respects settlement):\n- Route A (route_a): sell 500 shares on 2026-06-15; withdraw cash only after T+1 settlement on 2026-06-16\n- Route B (route_b): sell 500 shares on 2026-06-15 and withdraw the proceeds on the trade date 2026-06-15\n\nTask:\nSell and report trade value and the T+1 cash date. Report rejected routes by route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"trade_value_usd\", \"settlement_rule\", \"settlement_cash_date\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "sell",
      "selected_route": "route_a",
      "trade_value_usd": 140000,
      "settlement_rule": "T+1",
      "settlement_cash_date": "2026-06-16",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Corporate actions / settlement / calendar / jurisdiction",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "regional_market_holiday",
        "feasibility_trap": true,
        "objective_function": "objective for regional_market_holiday",
        "deterministic_grading_fields": [
          "selected_route",
          "trade_value_usd",
          "settlement_rule",
          "settlement_cash_date"
        ]
      },
      "canonical_answer": {
        "decision": "sell",
        "selected_route": "route_a",
        "trade_value_usd": 140000,
        "settlement_rule": "T+1",
        "settlement_cash_date": "2026-06-16",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ]
      }
    }
  },
  {
    "id": "SB-L9-071",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-071",
    "prompt": "Frozen market snapshot:\n- Jurisdiction / account regime: US cash account.\n- Permissions: CFDs unavailable; short selling unavailable in cash accounts; futures not approved; the regular equity session is closed.\n- No alternative product permission is enabled in this packet.\nCandidate routes (decide feasibility from the permission facts; a no-trade is required if all routes violate constraints):\n- Route A (route_a): short 600 GLD shares via CFD after the regular session close\n- Route B (route_b): short 600 GLD shares in the cash account\n- Route C (route_c): buy GLD futures to get short exposure\n\nTask:\nReject every invalid route and return the no-trade decision. Report rejected routes by route id.\n\nObjective:\nreturn no_trade if and only if every route violates a permission, session, or product constraint.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"requested_shares\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "no_trade",
      "selected_route": "none",
      "instrument": "GLD",
      "requested_shares": 600,
      "feasibility": "infeasible",
      "rejected_routes": [
        "route_a",
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Feasibility / rejection / no-trade traps",
        "tier": "L9",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "no_trade_invalid_route",
        "feasibility_trap": true,
        "objective_function": "objective for no_trade_invalid_route",
        "deterministic_grading_fields": [
          "decision",
          "selected_route",
          "instrument",
          "requested_shares",
          "feasibility"
        ]
      },
      "canonical_answer": {
        "decision": "no_trade",
        "selected_route": "none",
        "instrument": "GLD",
        "requested_shares": 600,
        "feasibility": "infeasible",
        "rejected_routes": [
          "route_a",
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-072",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-072",
    "prompt": "Frozen market snapshot:\n- Instrument: SPY ETF at 110.00. This is a sector ETF rebalance leg; equities/ETFs settle T+1.\n- Buy 800 shares with a protective day limit 110.25; T+1 cash date 2026-06-18.\nCandidate routes:\n- Route A (route_a): submit a day limit buy ticket for 800 shares at 110.25 in the regular session\n- Route B (route_b): submit a market buy that ignores the protective limit\n\nTask:\nCreate the order ticket and report trade value and T+1 date. Report rejected routes by route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"side\", \"quantity\", \"order_type\", \"limit_price\", \"trade_value_usd\", \"settlement_rule\", \"settlement_cash_date\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "SPY",
      "side": "buy",
      "quantity": 800,
      "order_type": "limit",
      "limit_price": 110.25,
      "trade_value_usd": 88000,
      "settlement_rule": "T+1",
      "settlement_cash_date": "2026-06-18",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot equities / ETFs",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "etf_sector_rebalance_t_plus_one",
        "feasibility_trap": false,
        "objective_function": "objective for etf_sector_rebalance_t_plus_one",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "side",
          "quantity",
          "order_type",
          "limit_price",
          "trade_value_usd",
          "settlement_rule",
          "settlement_cash_date"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "SPY",
        "side": "buy",
        "quantity": 800,
        "order_type": "limit",
        "limit_price": 110.25,
        "trade_value_usd": 88000,
        "settlement_rule": "T+1",
        "settlement_cash_date": "2026-06-18",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ]
      }
    }
  },
  {
    "id": "SB-L9-073",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-073",
    "prompt": "Frozen market snapshot:\n- Covered call on QQQ ETF: long 100 shares at 195.00, short 1 200 call.\n- Call quote: 1.40 USD/share; option multiplier 100 shares. Intrinsic = max(0, spot - strike).\n- Ordinary cash dividend 1.30/share with ex-dividend tomorrow. Early assignment of an American call is rational for the holder when the dividend exceeds the call's remaining time value.\nCandidate routes (decide which is required by the assignment economics):\n- Route A (route_a): roll/close the short call before ex-dividend to avoid early assignment\n- Route B (route_b): hold the covered call through ex-dividend unchanged\n\nTask:\nCompute the call's time value, compare to the dividend, decide the early-assignment risk, and select the route. Report rejected routes by route id.\n\nObjective:\nremove early-assignment/dividend risk when and only when it is economically rational.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"call_strike\", \"dividend_per_share\", \"call_time_value\", \"early_assignment_risk\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "manage_assignment",
      "selected_route": "route_b",
      "instrument": "QQQ",
      "call_strike": 200,
      "dividend_per_share": 1.3,
      "call_time_value": 1.4,
      "early_assignment_risk": false,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_a"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "early_assignment_dividend_risk",
        "feasibility_trap": false,
        "objective_function": "objective for early_assignment_dividend_risk",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "call_strike",
          "dividend_per_share",
          "call_time_value",
          "early_assignment_risk"
        ]
      },
      "canonical_answer": {
        "decision": "manage_assignment",
        "selected_route": "route_b",
        "instrument": "QQQ",
        "call_strike": 200,
        "dividend_per_share": 1.3,
        "call_time_value": 1.4,
        "early_assignment_risk": false,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_a"
        ]
      }
    }
  },
  {
    "id": "SB-L9-074",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-074",
    "prompt": "Frozen market snapshot:\n- Account: futures account using the simplified SPAN margin figures in this packet.\n- Objective: add crude-oil carry exposure with SPAN margin_used <= 11000 USD.\nCandidate routes (decide feasibility yourself from the SPAN margin figures):\n- Route A (route_a): long 3 CL June / short 3 CL July calendar spread, expected carry 1000 USD, SPAN margin 9500 USD\n- Route B (route_b): long 1 outright CL contracts, expected carry 1400 USD, SPAN margin 22000 USD\n- Route C (route_c): stay flat, expected carry 0 USD, SPAN margin 0 USD\n\nTask:\nSelect the feasible strategy with the highest expected carry under the SPAN margin cap. Report rejected routes by route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"spread_count\", \"expected_carry_usd\", \"margin_used\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "spread_count": 3,
      "expected_carry_usd": 1000,
      "margin_used": 9500,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "L9",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "span_margin_calendar_spread",
        "feasibility_trap": false,
        "objective_function": "objective for span_margin_calendar_spread",
        "deterministic_grading_fields": [
          "selected_route",
          "spread_count",
          "expected_carry_usd",
          "margin_used"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "spread_count": 3,
        "expected_carry_usd": 1000,
        "margin_used": 9500,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-075",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-075",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is a beta-dollar rebalance against the stated beta target.\n- Portfolio equity beta-dollar exposure: 850000 USD.\n- Required reduction: at least 45% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 33000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 250000 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 2 ES futures (beta hedge), ES at 5000.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 1 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 19000 USD premium that reduces beta-dollars by 500000 USD\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 2,
      "beta_reduction_usd": 500000,
      "beta_reduction_pct": 58.82,
      "margin_used": 26000,
      "expected_cost": 50,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Portfolio risk / rebalancing",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "beta_dollar_rebalance",
        "feasibility_trap": true,
        "objective_function": "objective for beta_dollar_rebalance",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 2,
        "beta_reduction_usd": 500000,
        "beta_reduction_pct": 58.82,
        "margin_used": 26000,
        "expected_cost": 50,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-076",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-076",
    "prompt": "Frozen market snapshot:\n- Account: US margin account. Borrow rate is 6.00% APR; weigh borrow cost against edge.\n- Instrument: MSFT common stock at 140.00. Desired bearish target: short 1200 shares of exposure.\n- Locate availability: exactly 500 shares. Option cash available: 1600 USD. Put delta -0.35 means 35 delta-shares per contract.\nCandidate routes (decide feasibility from the locate and cash limits yourself):\n- Route A (route_a): short exactly the 500 located shares and buy 2 listed puts (delta -0.35, premium 8.00 USD/share, multiplier 100) within 1600 USD option cash\n- Route B (route_b): short the full 1200-share target (requires shares beyond the locate)\n- Route C (route_c): buy 6 listed puts (premium 8.00 USD/share, multiplier 100), ignoring the option cash limit\n\nTask:\nChoose the feasible bearish implementation that maximizes bearish delta-shares without breaching the locate or option cash. Report rejected routes by route id.\n\nObjective:\nmaximize bearish delta-shares subject to locate and option-cash constraints.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"short_shares\", \"put_contracts\", \"premium_paid\", \"bearish_delta_shares\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "MSFT",
      "short_shares": 500,
      "put_contracts": 2,
      "premium_paid": 1600,
      "bearish_delta_shares": 570,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Shorting / borrow / margin / locates",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "borrow_cost_vs_trade_edge",
        "feasibility_trap": true,
        "objective_function": "objective for borrow_cost_vs_trade_edge",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "short_shares",
          "put_contracts",
          "premium_paid",
          "bearish_delta_shares"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "MSFT",
        "short_shares": 500,
        "put_contracts": 2,
        "premium_paid": 1600,
        "bearish_delta_shares": 570,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-077",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-077",
    "prompt": "Frozen market snapshot:\n- Instrument: NVDA common stock. Order size: 400 shares at limit 93.25. The regular session is OPEN now; the after-hours venue is CLOSED; the dark venue is NOT enabled on this account.\n- Auction/session constraint: only the open regular session is executable.\nCandidate routes (decide which venue is permitted and open yourself):\n- Route A (route_a): route the order to the continuous regular session\n- Route B (route_b): route the order to the closed after-hours venue with no permission\n- Route C (route_c): route via an unsupported dark venue not enabled on this account\n\nTask:\nRoute to the only feasible venue. Report rejected routes by route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"order_shares\", \"limit_price\", \"venue\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "NVDA",
      "order_shares": 400,
      "limit_price": 93.25,
      "venue": "regular_session",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Execution / liquidity / microstructure",
        "tier": "L9",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "auction_session_constraint",
        "feasibility_trap": true,
        "objective_function": "objective for auction_session_constraint",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "order_shares",
          "limit_price",
          "venue"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "NVDA",
        "order_shares": 400,
        "limit_price": 93.25,
        "venue": "regular_session",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-078",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-078",
    "prompt": "Frozen market snapshot:\n- Account holder: US retail customer. Account base currency: USD. Payment is required on the T+2 date; a later forward settlement misses it.\n- Required: obtain 100000 EUR settling T+2. Spot EURUSD 1.0500. EUR futures initial margin capacity: 2000 USD.\nCandidate routes (decide feasibility from jurisdiction, settlement and margin facts yourself):\n- Route A (route_a): buy EUR spot at 1.0500, settles T+2, fees included\n- Route B (route_b): use a retail CFD on EURUSD\n- Route C (route_c): use EUR futures requiring 3000 USD initial margin\n- Route D (route_d): buy EUR via an outright forward that settles T+5, later than the required T+2 date\n\nTask:\nChoose the feasible route and compute USD cost. Report rejected routes by route id.\n\nObjective:\nobtain the EUR by the required settlement date at the lowest feasible USD cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"eur_amount\", \"usd_cost\", \"settlement_date_rule\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "convert_fx",
      "selected_route": "route_a",
      "eur_amount": 100000,
      "usd_cost": 105000,
      "settlement_date_rule": "T+2",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot FX / CFDs / multi-currency",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "forward_vs_spot_payment",
        "feasibility_trap": false,
        "objective_function": "objective for forward_vs_spot_payment",
        "deterministic_grading_fields": [
          "selected_route",
          "eur_amount",
          "usd_cost",
          "settlement_date_rule"
        ]
      },
      "canonical_answer": {
        "decision": "convert_fx",
        "selected_route": "route_a",
        "eur_amount": 100000,
        "usd_cost": 105000,
        "settlement_date_rule": "T+2",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ]
      }
    }
  },
  {
    "id": "SB-L9-079",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-079",
    "prompt": "Frozen market snapshot:\n- Instrument: XLK ETF. Corporate action: ordinary cash dividend 0.35/share, ex-dividend tomorrow.\n- Existing GTC sell-stop price: 265.00. Related listed option strike: 270.00.\n- Broker rule: reduce GTC equity stop prices by the ordinary cash dividend on ex-date; listed option strikes are NOT adjusted for ordinary cash dividends.\nCandidate routes (decide which matches the corporate-action rules):\n- Route A (route_a): reduce the GTC sell-stop by the ordinary dividend on ex-date; leave the listed option strike unchanged\n- Route B (route_b): leave the GTC stop unchanged through ex-date\n- Route C (route_c): reduce the listed option strike by the ordinary dividend\n\nTask:\nCompute the adjusted stop and the option-strike treatment. Report rejected routes by route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"adjusted_stop_price\", \"option_strike_adjusted\", \"option_strike_after\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "adjust_order_for_ex_dividend",
      "selected_route": "route_a",
      "adjusted_stop_price": 264.65,
      "option_strike_adjusted": false,
      "option_strike_after": 270,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Corporate actions / settlement / calendar / jurisdiction",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "ex_dividend_adjustment",
        "feasibility_trap": true,
        "objective_function": "objective for ex_dividend_adjustment",
        "deterministic_grading_fields": [
          "selected_route",
          "adjusted_stop_price",
          "option_strike_adjusted",
          "option_strike_after"
        ]
      },
      "canonical_answer": {
        "decision": "adjust_order_for_ex_dividend",
        "selected_route": "route_a",
        "adjusted_stop_price": 264.65,
        "option_strike_adjusted": false,
        "option_strike_after": 270,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-080",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-080",
    "prompt": "Frozen market snapshot:\n- Account: US margin account. A borrow recall on XLF ETF forces you to close 300 short shares today; no new locate is available.\nCandidate routes (decide feasibility from the recall and locate facts):\n- Route A (route_a): buy to cover 300 recalled shares and replace exposure with 3 listed puts (premium 8.00/share, multiplier 100)\n- Route B (route_b): ignore the borrow recall and keep the short open\n- Route C (route_c): short additional shares to average down (no locate available)\n\nTask:\nHandle the borrow recall and keep bearish exposure feasibly. Report rejected routes by route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"buy_to_cover_shares\", \"put_contracts\", \"premium_paid\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "XLF",
      "buy_to_cover_shares": 300,
      "put_contracts": 3,
      "premium_paid": 2400,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Feasibility / rejection / no-trade traps",
        "tier": "L9",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "borrow_recall_margin_hedge",
        "feasibility_trap": true,
        "objective_function": "objective for borrow_recall_margin_hedge",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "buy_to_cover_shares",
          "put_contracts",
          "premium_paid"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "XLF",
        "buy_to_cover_shares": 300,
        "put_contracts": 3,
        "premium_paid": 2400,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ]
      }
    }
  },
  {
    "id": "SB-L9-081",
    "level": 9,
    "type": "schema",
    "rubric_id": "stockbench-l9-081",
    "prompt": "Frozen market snapshot:\n- Instrument: GLD ETF at 137.00. Objective is to participate in the opening auction with a protective limit.\n- Order size 800 shares; protective limit 137.25.\nCandidate routes (decide which matches the auction/close objective):\n- Route A (route_a): place a limit-on-open auction order for 800 shares\n- Route B (route_b): cross the spread immediately in the continuous session, missing the opening auction\n\nTask:\nSelect the order route matching the objective. Report rejected routes by route id.\n\nObjective:\nselect the feasible route that satisfies all stated constraints at the lowest cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"quantity\", \"limit_price\", \"venue\", \"feasibility\", \"rejected_routes\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "GLD",
      "quantity": 800,
      "limit_price": 137.25,
      "venue": "opening_auction",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ]
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot equities / ETFs",
        "tier": "L9",
        "capability_tag": "execution_action_quality",
        "scenario_family": "opening_auction_limit",
        "feasibility_trap": false,
        "objective_function": "objective for opening_auction_limit",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "quantity",
          "limit_price",
          "venue"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "GLD",
        "quantity": 800,
        "limit_price": 137.25,
        "venue": "opening_auction",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ]
      }
    }
  },
  {
    "id": "SB-L10-008",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-008",
    "prompt": "Frozen market snapshot:\n- Instrument: XLK ETF. TWAP-style execution with a hard slippage cap expressed as an average-price cap.\n- Mid price: 126.00. Maximum average execution price (cap): 126.11.\n- Ask book: 40000 @ 126.05; 40000 @ 126.10; 20000 @ 126.30.\n- Partial fills allowed only in 500-share clips. Fees ignored.\nCandidate routes:\n- Route A (route_a): walk the book filling cheapest levels first in 500-share clips while keeping the running average <= the cap\n- Route B (route_b): take the full displayed size across all levels at a single 126.30 limit\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nCompute the maximum buy quantity in allowed clips that keeps the average price at or below the cap. Report rejected routes by route id.\n\nObjective:\nmaximize filled_shares subject to average_price <= the cap, in 500-share clips.\n\nOutput JSON fields: { \"decision\", \"instrument\", \"side\", \"clip_size_shares\", \"filled_shares\", \"average_price\", \"limit_price\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "trade",
      "instrument": "XLK",
      "side": "buy",
      "clip_size_shares": 500,
      "filled_shares": 94500,
      "average_price": 126.11,
      "limit_price": 126.3,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Execution / liquidity / microstructure",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "twap_slippage_limit",
        "feasibility_trap": true,
        "objective_function": "objective for twap_slippage_limit",
        "deterministic_grading_fields": [
          "instrument",
          "side",
          "clip_size_shares",
          "filled_shares",
          "average_price",
          "limit_price"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "instrument": "XLK",
        "side": "buy",
        "clip_size_shares": 500,
        "filled_shares": 94500,
        "average_price": 126.11,
        "limit_price": 126.3,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-009",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-009",
    "prompt": "Frozen market snapshot:\n- Instrument: XLF ETF. Order-book liquidity limit: maximize fill under the average-price cap.\n- Mid price: 127.00. Maximum average execution price (cap): 127.11.\n- Ask book: 40000 @ 127.05; 40000 @ 127.10; 20000 @ 127.30.\n- Partial fills allowed only in 500-share clips. Fees ignored.\nCandidate routes:\n- Route A (route_a): walk the book filling cheapest levels first in 500-share clips while keeping the running average <= the cap\n- Route B (route_b): take the full displayed size across all levels at a single 127.30 limit\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nCompute the maximum buy quantity in allowed clips that keeps the average price at or below the cap. Report rejected routes by route id.\n\nObjective:\nmaximize filled_shares subject to average_price <= the cap, in 500-share clips.\n\nOutput JSON fields: { \"decision\", \"instrument\", \"side\", \"clip_size_shares\", \"filled_shares\", \"average_price\", \"limit_price\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "trade",
      "instrument": "XLF",
      "side": "buy",
      "clip_size_shares": 500,
      "filled_shares": 94500,
      "average_price": 127.11,
      "limit_price": 127.3,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Execution / liquidity / microstructure",
        "tier": "L10",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "order_book_liquidity_limit",
        "feasibility_trap": true,
        "objective_function": "objective for order_book_liquidity_limit",
        "deterministic_grading_fields": [
          "instrument",
          "side",
          "clip_size_shares",
          "filled_shares",
          "average_price",
          "limit_price"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "instrument": "XLF",
        "side": "buy",
        "clip_size_shares": 500,
        "filled_shares": 94500,
        "average_price": 127.11,
        "limit_price": 127.3,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-010",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-010",
    "prompt": "Frozen market snapshot:\n- Instrument: GLD ETF. Order size: 100 shares at limit 64.25. The regular session is OPEN now; the after-hours venue is CLOSED; the dark venue is NOT enabled on this account.\n- Session/permission trap: only permitted, open venues are executable.\nCandidate routes (decide which venue is permitted and open yourself):\n- Route A (route_a): route the order to the continuous regular session\n- Route B (route_b): route the order to the closed after-hours venue with no permission\n- Route C (route_c): route via an unsupported dark venue not enabled on this account\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nRoute to the only feasible venue. Report rejected routes by route id.\n\nObjective:\nselect the lowest-cost feasible route and recompute residual exposure after the trade.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"order_shares\", \"limit_price\", \"venue\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "GLD",
      "order_shares": 100,
      "limit_price": 64.25,
      "venue": "regular_session",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Execution / liquidity / microstructure",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "invalid_route_session_trap",
        "feasibility_trap": true,
        "objective_function": "objective for invalid_route_session_trap",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "order_shares",
          "limit_price",
          "venue"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "GLD",
        "order_shares": 100,
        "limit_price": 64.25,
        "venue": "regular_session",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-011",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-011",
    "prompt": "Frozen market snapshot:\n- Account holder: US retail customer. Account base currency: USD. Maintain a USD cash buffer; pick the lowest-USD-cost feasible conversion.\n- Required: obtain 240000 EUR settling T+2. Spot EURUSD 1.0500. EUR futures initial margin capacity: 2000 USD.\nCandidate routes (decide feasibility from jurisdiction, settlement and margin facts yourself):\n- Route A (route_a): buy EUR spot at 1.0500, settles T+2, fees included\n- Route B (route_b): use a retail CFD on EURUSD\n- Route C (route_c): use EUR futures requiring 3000 USD initial margin\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nChoose the feasible route and compute USD cost. Report rejected routes by route id.\n\nObjective:\nobtain the EUR by the required settlement date at the lowest feasible USD cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"eur_amount\", \"usd_cost\", \"settlement_date_rule\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "convert_fx",
      "selected_route": "route_a",
      "eur_amount": 240000,
      "usd_cost": 252000,
      "settlement_date_rule": "T+2",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot FX / CFDs / multi-currency",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "multi_currency_cash_buffer",
        "feasibility_trap": true,
        "objective_function": "objective for multi_currency_cash_buffer",
        "deterministic_grading_fields": [
          "selected_route",
          "eur_amount",
          "usd_cost",
          "settlement_date_rule"
        ]
      },
      "canonical_answer": {
        "decision": "convert_fx",
        "selected_route": "route_a",
        "eur_amount": 240000,
        "usd_cost": 252000,
        "settlement_date_rule": "T+2",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-012",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-012",
    "prompt": "Frozen market snapshot:\n- Instrument: QQQ ETF. TWAP-style execution with a hard slippage cap expressed as an average-price cap.\n- Mid price: 130.00. Maximum average execution price (cap): 130.11.\n- Ask book: 40000 @ 130.05; 40000 @ 130.10; 20000 @ 130.30.\n- Partial fills allowed only in 500-share clips. Fees ignored.\nCandidate routes:\n- Route A (route_a): walk the book filling cheapest levels first in 500-share clips while keeping the running average <= the cap\n- Route B (route_b): take the full displayed size across all levels at a single 130.30 limit\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nCompute the maximum buy quantity in allowed clips that keeps the average price at or below the cap. Report rejected routes by route id.\n\nObjective:\nmaximize filled_shares subject to average_price <= the cap, in 500-share clips.\n\nOutput JSON fields: { \"decision\", \"instrument\", \"side\", \"clip_size_shares\", \"filled_shares\", \"average_price\", \"limit_price\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "trade",
      "instrument": "QQQ",
      "side": "buy",
      "clip_size_shares": 500,
      "filled_shares": 94500,
      "average_price": 130.11,
      "limit_price": 130.3,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Execution / liquidity / microstructure",
        "tier": "L10",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "twap_slippage_limit",
        "feasibility_trap": true,
        "objective_function": "objective for twap_slippage_limit",
        "deterministic_grading_fields": [
          "instrument",
          "side",
          "clip_size_shares",
          "filled_shares",
          "average_price",
          "limit_price"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "instrument": "QQQ",
        "side": "buy",
        "clip_size_shares": 500,
        "filled_shares": 94500,
        "average_price": 130.11,
        "limit_price": 130.3,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-013",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-013",
    "prompt": "Frozen market snapshot:\n- Account holder: US retail customer. Account base currency: USD. The EUR payment must settle on the required T+2 date (FX settlement mismatch trap).\n- Required: obtain 280000 EUR settling T+2. Spot EURUSD 1.0600. EUR futures initial margin capacity: 2000 USD.\nCandidate routes (decide feasibility from jurisdiction, settlement and margin facts yourself):\n- Route A (route_a): buy EUR spot at 1.0600, settles T+2, fees included\n- Route B (route_b): use a retail CFD on EURUSD\n- Route C (route_c): use EUR futures requiring 2750 USD initial margin\n- Route D (route_d): buy EUR via an outright forward that settles T+5, later than the required T+2 date\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nChoose the feasible route and compute USD cost. Report rejected routes by route id.\n\nObjective:\nobtain the EUR by the required settlement date at the lowest feasible USD cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"eur_amount\", \"usd_cost\", \"settlement_date_rule\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "convert_fx",
      "selected_route": "route_a",
      "eur_amount": 280000,
      "usd_cost": 296800,
      "settlement_date_rule": "T+2",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot FX / CFDs / multi-currency",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "fx_settlement_mismatch",
        "feasibility_trap": true,
        "objective_function": "objective for fx_settlement_mismatch",
        "deterministic_grading_fields": [
          "selected_route",
          "eur_amount",
          "usd_cost",
          "settlement_date_rule"
        ]
      },
      "canonical_answer": {
        "decision": "convert_fx",
        "selected_route": "route_a",
        "eur_amount": 280000,
        "usd_cost": 296800,
        "settlement_date_rule": "T+2",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-014",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-014",
    "prompt": "Frozen market snapshot:\n- Instrument: AAPL common stock. Order size: 500 shares at limit 68.25. The regular session is OPEN now; the after-hours venue is CLOSED; the dark venue is NOT enabled on this account.\n- Session/permission trap: only permitted, open venues are executable.\nCandidate routes (decide which venue is permitted and open yourself):\n- Route A (route_a): route the order to the continuous regular session\n- Route B (route_b): route the order to the closed after-hours venue with no permission\n- Route C (route_c): route via an unsupported dark venue not enabled on this account\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nRoute to the only feasible venue. Report rejected routes by route id.\n\nObjective:\nselect the lowest-cost feasible route and recompute residual exposure after the trade.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"order_shares\", \"limit_price\", \"venue\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "AAPL",
      "order_shares": 500,
      "limit_price": 68.25,
      "venue": "regular_session",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Execution / liquidity / microstructure",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "invalid_route_session_trap",
        "feasibility_trap": true,
        "objective_function": "objective for invalid_route_session_trap",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "order_shares",
          "limit_price",
          "venue"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "AAPL",
        "order_shares": 500,
        "limit_price": 68.25,
        "venue": "regular_session",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-015",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-015",
    "prompt": "Frozen market snapshot:\n- Account holder: US retail customer. Account base currency: USD. Maintain a USD cash buffer; pick the lowest-USD-cost feasible conversion.\n- Required: obtain 320000 EUR settling T+2. Spot EURUSD 1.0600. EUR futures initial margin capacity: 2000 USD.\nCandidate routes (decide feasibility from jurisdiction, settlement and margin facts yourself):\n- Route A (route_a): buy EUR spot at 1.0600, settles T+2, fees included\n- Route B (route_b): use a retail CFD on EURUSD\n- Route C (route_c): use EUR futures requiring 3250 USD initial margin\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nChoose the feasible route and compute USD cost. Report rejected routes by route id.\n\nObjective:\nobtain the EUR by the required settlement date at the lowest feasible USD cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"eur_amount\", \"usd_cost\", \"settlement_date_rule\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "convert_fx",
      "selected_route": "route_a",
      "eur_amount": 320000,
      "usd_cost": 339200,
      "settlement_date_rule": "T+2",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot FX / CFDs / multi-currency",
        "tier": "L10",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "multi_currency_cash_buffer",
        "feasibility_trap": true,
        "objective_function": "objective for multi_currency_cash_buffer",
        "deterministic_grading_fields": [
          "selected_route",
          "eur_amount",
          "usd_cost",
          "settlement_date_rule"
        ]
      },
      "canonical_answer": {
        "decision": "convert_fx",
        "selected_route": "route_a",
        "eur_amount": 320000,
        "usd_cost": 339200,
        "settlement_date_rule": "T+2",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-016",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-016",
    "prompt": "Frozen market snapshot:\n- You hold 1 long ITM NVDA common stock call, strike 205, spot 215.00.\n- Call quote 11.00/share; intrinsic = spot - strike = 10.00; remaining time value = quote - intrinsic = 1.00.\n- Ordinary dividend 0.40/share, ex-dividend tomorrow. Early exercise/assignment of an American call is rational only when the dividend exceeds the remaining time value.\nCandidate routes (decide from the exercise economics; do not assume a route):\n- Route A (route_a): exercise the long call early to capture the 0.40/share dividend (you forfeit remaining time value)\n- Route B (route_b): sell the long call at its 11.00 quote and keep the time value\n- Route C (route_c): roll the call to the next expiry\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nCompare the dividend to the time value, decide whether to exercise early, and select the route. Report rejected routes by route id.\n\nObjective:\nresolve the exercise/assignment decision at the highest economic value.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"dividend_per_share\", \"call_time_value\", \"exercise_early\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "exercise_decision",
      "selected_route": "route_b",
      "instrument": "NVDA",
      "dividend_per_share": 0.4,
      "call_time_value": 1,
      "exercise_early": false,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_a",
        "route_c"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "exercise_assignment_roll_decision",
        "feasibility_trap": false,
        "objective_function": "objective for exercise_assignment_roll_decision",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "dividend_per_share",
          "call_time_value",
          "exercise_early"
        ]
      },
      "canonical_answer": {
        "decision": "exercise_decision",
        "selected_route": "route_b",
        "instrument": "NVDA",
        "dividend_per_share": 0.4,
        "call_time_value": 1,
        "exercise_early": false,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_a",
          "route_c"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-017",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-017",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is an index-futures beta hedge of the cash equity book using ES futures.\n- Portfolio equity beta-dollar exposure: 1150000 USD.\n- Required reduction: at least 45% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 46000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 250000 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 3 ES futures (beta hedge), ES at 5000.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 2 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 20000 USD premium that reduces beta-dollars by 750000 USD\n- Route D (route_d): short 6 ES futures, same specs as Route A\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the lowest-cost feasible route and recompute residual exposure after the trade.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 3,
      "beta_reduction_usd": 750000,
      "beta_reduction_pct": 65.22,
      "margin_used": 39000,
      "expected_cost": 75,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "futures_beta_hedge",
        "feasibility_trap": true,
        "objective_function": "objective for futures_beta_hedge",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 3,
        "beta_reduction_usd": 750000,
        "beta_reduction_pct": 65.22,
        "margin_used": 39000,
        "expected_cost": 75,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-018",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-018",
    "prompt": "Frozen market snapshot:\n- Instrument: XLK ETF. Order size: 900 shares at limit 72.25. The regular session is OPEN now; the after-hours venue is CLOSED; the dark venue is NOT enabled on this account.\n- Session/permission trap: only permitted, open venues are executable.\nCandidate routes (decide which venue is permitted and open yourself):\n- Route A (route_a): route the order to the continuous regular session\n- Route B (route_b): route the order to the closed after-hours venue with no permission\n- Route C (route_c): route via an unsupported dark venue not enabled on this account\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nRoute to the only feasible venue. Report rejected routes by route id.\n\nObjective:\nselect the lowest-cost feasible route and recompute residual exposure after the trade.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"order_shares\", \"limit_price\", \"venue\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "XLK",
      "order_shares": 900,
      "limit_price": 72.25,
      "venue": "regular_session",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Execution / liquidity / microstructure",
        "tier": "L10",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "invalid_route_session_trap",
        "feasibility_trap": true,
        "objective_function": "objective for invalid_route_session_trap",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "order_shares",
          "limit_price",
          "venue"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "XLK",
        "order_shares": 900,
        "limit_price": 72.25,
        "venue": "regular_session",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-019",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-019",
    "prompt": "Frozen market snapshot:\n- Account holder: US retail customer. Account base currency: USD. Maintain a USD cash buffer; pick the lowest-USD-cost feasible conversion.\n- Required: obtain 400000 EUR settling T+2. Spot EURUSD 1.0600. EUR futures initial margin capacity: 2000 USD.\nCandidate routes (decide feasibility from jurisdiction, settlement and margin facts yourself):\n- Route A (route_a): buy EUR spot at 1.0600, settles T+2, fees included\n- Route B (route_b): use a retail CFD on EURUSD\n- Route C (route_c): use EUR futures requiring 2750 USD initial margin\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nChoose the feasible route and compute USD cost. Report rejected routes by route id.\n\nObjective:\nobtain the EUR by the required settlement date at the lowest feasible USD cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"eur_amount\", \"usd_cost\", \"settlement_date_rule\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "convert_fx",
      "selected_route": "route_a",
      "eur_amount": 400000,
      "usd_cost": 424000,
      "settlement_date_rule": "T+2",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot FX / CFDs / multi-currency",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "multi_currency_cash_buffer",
        "feasibility_trap": true,
        "objective_function": "objective for multi_currency_cash_buffer",
        "deterministic_grading_fields": [
          "selected_route",
          "eur_amount",
          "usd_cost",
          "settlement_date_rule"
        ]
      },
      "canonical_answer": {
        "decision": "convert_fx",
        "selected_route": "route_a",
        "eur_amount": 400000,
        "usd_cost": 424000,
        "settlement_date_rule": "T+2",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-020",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-020",
    "prompt": "Frozen market snapshot:\n- Instrument: GLD ETF at 290.00. Account calendar: the next day is a settlement holiday, so T+1 cash lands on the stated date.\n- Trade date 2026-06-16; T+1 cash settlement date 2026-06-17. Unsettled proceeds cannot be withdrawn before settlement.\nCandidate routes (decide which respects settlement):\n- Route A (route_a): sell 600 shares on 2026-06-16; withdraw cash only after T+1 settlement on 2026-06-17\n- Route B (route_b): sell 600 shares on 2026-06-16 and withdraw the proceeds on the trade date 2026-06-16\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nSell and report trade value and the T+1 cash date. Report rejected routes by route id.\n\nObjective:\nselect the lowest-cost feasible route and recompute residual exposure after the trade.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"trade_value_usd\", \"settlement_rule\", \"settlement_cash_date\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "sell",
      "selected_route": "route_a",
      "trade_value_usd": 174000,
      "settlement_rule": "T+1",
      "settlement_cash_date": "2026-06-17",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Corporate actions / settlement / calendar / jurisdiction",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "regional_market_holiday",
        "feasibility_trap": true,
        "objective_function": "objective for regional_market_holiday",
        "deterministic_grading_fields": [
          "selected_route",
          "trade_value_usd",
          "settlement_rule",
          "settlement_cash_date"
        ]
      },
      "canonical_answer": {
        "decision": "sell",
        "selected_route": "route_a",
        "trade_value_usd": 174000,
        "settlement_rule": "T+1",
        "settlement_cash_date": "2026-06-17",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-021",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-021",
    "prompt": "Frozen market snapshot:\n- Covered call on SPY ETF: long 100 shares at 190.00, short 1 195 call.\n- Call quote: 1.10 USD/share; option multiplier 100 shares. Intrinsic = max(0, spot - strike).\n- Ordinary cash dividend 0.70/share with ex-dividend tomorrow. Early assignment of an American call is rational for the holder when the dividend exceeds the call's remaining time value.\nCandidate routes (decide which is required by the assignment economics):\n- Route A (route_a): roll/close the short call before ex-dividend to avoid early assignment\n- Route B (route_b): hold the covered call through ex-dividend unchanged\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nCompute the call's time value, compare to the dividend, decide the early-assignment risk, and select the route. Report rejected routes by route id.\n\nObjective:\nremove early-assignment/dividend risk when and only when it is economically rational.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"call_strike\", \"dividend_per_share\", \"call_time_value\", \"early_assignment_risk\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "manage_assignment",
      "selected_route": "route_b",
      "instrument": "SPY",
      "call_strike": 195,
      "dividend_per_share": 0.7,
      "call_time_value": 1.1,
      "early_assignment_risk": false,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_a"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "L10",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "covered_call_assignment",
        "feasibility_trap": true,
        "objective_function": "objective for covered_call_assignment",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "call_strike",
          "dividend_per_share",
          "call_time_value",
          "early_assignment_risk"
        ]
      },
      "canonical_answer": {
        "decision": "manage_assignment",
        "selected_route": "route_b",
        "instrument": "SPY",
        "call_strike": 195,
        "dividend_per_share": 0.7,
        "call_time_value": 1.1,
        "early_assignment_risk": false,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_a"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-022",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-022",
    "prompt": "Frozen market snapshot:\n- Position: long 6 CL near-month futures. This is a futures roll calendar ahead of first notice; use executable bid/ask, not mid.\n- First notice day is tomorrow; account policy forbids holding physically deliverable CL long into first notice.\n- Only the displayed bid/ask is executable; mid prices are indicative and not executable.\nCandidate routes (decide feasibility yourself):\n- Route A (route_a): roll by selling near at bid 72.00 and buying next at ask 72.50; CL multiplier 1000 barrels; fee 4 USD/contract/leg\n- Route B (route_b): roll using the near/next mid prices instead of bid/ask\n- Route C (route_c): hold the long near-month position into first notice day\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nRoll the position and compute total executable cost. Report rejected routes by route id.\n\nObjective:\nselect the lowest-cost feasible route and recompute residual exposure after the trade.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"contracts\", \"roll_cost_usd\", \"fees_usd\", \"total_cost_usd\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "roll",
      "selected_route": "route_a",
      "contracts": 6,
      "roll_cost_usd": 3000,
      "fees_usd": 48,
      "total_cost_usd": 3048,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "futures_roll_calendar",
        "feasibility_trap": false,
        "objective_function": "objective for futures_roll_calendar",
        "deterministic_grading_fields": [
          "selected_route",
          "contracts",
          "roll_cost_usd",
          "fees_usd",
          "total_cost_usd"
        ]
      },
      "canonical_answer": {
        "decision": "roll",
        "selected_route": "route_a",
        "contracts": 6,
        "roll_cost_usd": 3000,
        "fees_usd": 48,
        "total_cost_usd": 3048,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-023",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-023",
    "prompt": "Frozen market snapshot:\n- Instrument: IWM ETF. Order size: 500 shares at limit 77.25. The regular session is OPEN now; the after-hours venue is CLOSED; the dark venue is NOT enabled on this account.\n- Auction/session constraint: only the open regular session is executable.\nCandidate routes (decide which venue is permitted and open yourself):\n- Route A (route_a): route the order to the continuous regular session\n- Route B (route_b): route the order to the closed after-hours venue with no permission\n- Route C (route_c): route via an unsupported dark venue not enabled on this account\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nRoute to the only feasible venue. Report rejected routes by route id.\n\nObjective:\nselect the lowest-cost feasible route and recompute residual exposure after the trade.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"order_shares\", \"limit_price\", \"venue\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "IWM",
      "order_shares": 500,
      "limit_price": 77.25,
      "venue": "regular_session",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Execution / liquidity / microstructure",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "auction_session_constraint",
        "feasibility_trap": true,
        "objective_function": "objective for auction_session_constraint",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "order_shares",
          "limit_price",
          "venue"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "IWM",
        "order_shares": 500,
        "limit_price": 77.25,
        "venue": "regular_session",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-024",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-024",
    "prompt": "Frozen market snapshot:\n- Account holder: US retail customer. Account base currency: USD. Payment is required on the T+2 date; a later forward settlement misses it.\n- Required: obtain 160000 EUR settling T+2. Spot EURUSD 1.0700. EUR futures initial margin capacity: 2000 USD.\nCandidate routes (decide feasibility from jurisdiction, settlement and margin facts yourself):\n- Route A (route_a): buy EUR spot at 1.0700, settles T+2, fees included\n- Route B (route_b): use a retail CFD on EURUSD\n- Route C (route_c): use EUR futures requiring 3250 USD initial margin\n- Route D (route_d): buy EUR via an outright forward that settles T+5, later than the required T+2 date\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nChoose the feasible route and compute USD cost. Report rejected routes by route id.\n\nObjective:\nobtain the EUR by the required settlement date at the lowest feasible USD cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"eur_amount\", \"usd_cost\", \"settlement_date_rule\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "convert_fx",
      "selected_route": "route_a",
      "eur_amount": 160000,
      "usd_cost": 171200,
      "settlement_date_rule": "T+2",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot FX / CFDs / multi-currency",
        "tier": "L10",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "forward_vs_spot_payment",
        "feasibility_trap": false,
        "objective_function": "objective for forward_vs_spot_payment",
        "deterministic_grading_fields": [
          "selected_route",
          "eur_amount",
          "usd_cost",
          "settlement_date_rule"
        ]
      },
      "canonical_answer": {
        "decision": "convert_fx",
        "selected_route": "route_a",
        "eur_amount": 160000,
        "usd_cost": 171200,
        "settlement_date_rule": "T+2",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-025",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-025",
    "prompt": "Frozen market snapshot:\n- Instrument: MSFT common stock. Corporate action: ordinary cash dividend 0.60/share, ex-dividend tomorrow.\n- Existing GTC sell-stop price: 235.00. Related listed option strike: 240.00.\n- Broker rule: reduce GTC equity stop prices by the ordinary cash dividend on ex-date; listed option strikes are NOT adjusted for ordinary cash dividends.\nCandidate routes (decide which matches the corporate-action rules):\n- Route A (route_a): reduce the GTC sell-stop by the ordinary dividend on ex-date; leave the listed option strike unchanged\n- Route B (route_b): leave the GTC stop unchanged through ex-date\n- Route C (route_c): reduce the listed option strike by the ordinary dividend\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nCompute the adjusted stop and the option-strike treatment. Report rejected routes by route id.\n\nObjective:\nselect the lowest-cost feasible route and recompute residual exposure after the trade.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"adjusted_stop_price\", \"option_strike_adjusted\", \"option_strike_after\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "adjust_order_for_ex_dividend",
      "selected_route": "route_a",
      "adjusted_stop_price": 234.4,
      "option_strike_adjusted": false,
      "option_strike_after": 240,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Corporate actions / settlement / calendar / jurisdiction",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "ex_dividend_adjustment",
        "feasibility_trap": true,
        "objective_function": "objective for ex_dividend_adjustment",
        "deterministic_grading_fields": [
          "selected_route",
          "adjusted_stop_price",
          "option_strike_adjusted",
          "option_strike_after"
        ]
      },
      "canonical_answer": {
        "decision": "adjust_order_for_ex_dividend",
        "selected_route": "route_a",
        "adjusted_stop_price": 234.4,
        "option_strike_adjusted": false,
        "option_strike_after": 240,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-026",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-026",
    "prompt": "Frozen market snapshot:\n- Position: long 1,000 NVDA common stock at 485.00.\n- Downside scenario for grading: NVDA closes at 435.00 at option expiry.\n- Constraint: scenario PnL including option premium must be no worse than -38000 USD (a downside floor on this put spread).\n- Option multiplier: 100 shares; use exactly 10 spreads. Stock PnL + spread payoff - net premium = scenario PnL.\nCandidate put spreads (decide which meet the floor; pick the lowest net premium among those that do):\n- Route A (route_a): buy 10 NVDA 485 puts at 12.00 and sell 10 NVDA 475 puts at 7.00 (put spread)\n- Route B (route_b): buy 10 NVDA 485 puts at 12.00 and sell 10 NVDA 465 puts at 5.00 (put spread)\n- Route C (route_c): buy 10 NVDA 485 puts at 12.00 and sell 10 NVDA 455 puts at 3.00 (put spread)\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nSelect the feasible put spread and compute net premium and scenario PnL. Report rejected routes by route id.\n\nObjective:\nminimize net premium subject to scenario_pnl_usd >= the stated floor.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"buy_put_strike\", \"sell_put_strike\", \"contracts\", \"net_premium_paid\", \"scenario_pnl_usd\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_b",
      "buy_put_strike": 485,
      "sell_put_strike": 465,
      "contracts": 10,
      "net_premium_paid": 7000,
      "scenario_pnl_usd": -37000,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_a",
        "route_c"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "put_spread_downside_floor",
        "feasibility_trap": false,
        "objective_function": "objective for put_spread_downside_floor",
        "deterministic_grading_fields": [
          "selected_route",
          "buy_put_strike",
          "sell_put_strike",
          "contracts",
          "net_premium_paid",
          "scenario_pnl_usd"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_b",
        "buy_put_strike": 485,
        "sell_put_strike": 465,
        "contracts": 10,
        "net_premium_paid": 7000,
        "scenario_pnl_usd": -37000,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_a",
          "route_c"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-027",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-027",
    "prompt": "Frozen market snapshot:\n- Position: long 4 CL near-month futures. This is a commodity roll with basis between near and next; use executable bid/ask, not mid.\n- First notice day is tomorrow; account policy forbids holding physically deliverable CL long into first notice.\n- Only the displayed bid/ask is executable; mid prices are indicative and not executable.\nCandidate routes (decide feasibility yourself):\n- Route A (route_a): roll by selling near at bid 77.00 and buying next at ask 77.75; CL multiplier 1000 barrels; fee 4 USD/contract/leg\n- Route B (route_b): roll using the near/next mid prices instead of bid/ask\n- Route C (route_c): hold the long near-month position into first notice day\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nRoll the position and compute total executable cost. Report rejected routes by route id.\n\nObjective:\nselect the lowest-cost feasible route and recompute residual exposure after the trade.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"contracts\", \"roll_cost_usd\", \"fees_usd\", \"total_cost_usd\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "roll",
      "selected_route": "route_a",
      "contracts": 4,
      "roll_cost_usd": 3000,
      "fees_usd": 32,
      "total_cost_usd": 3032,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "L10",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "commodity_roll_basis_hedge",
        "feasibility_trap": true,
        "objective_function": "objective for commodity_roll_basis_hedge",
        "deterministic_grading_fields": [
          "selected_route",
          "contracts",
          "roll_cost_usd",
          "fees_usd",
          "total_cost_usd"
        ]
      },
      "canonical_answer": {
        "decision": "roll",
        "selected_route": "route_a",
        "contracts": 4,
        "roll_cost_usd": 3000,
        "fees_usd": 32,
        "total_cost_usd": 3032,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-028",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-028",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is a risk budget rebalance against the stated beta target.\n- Portfolio equity beta-dollar exposure: 800000 USD.\n- Required reduction: at least 40% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 33000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 250000 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 2 ES futures (beta hedge), ES at 5000.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 1 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 19000 USD premium that reduces beta-dollars by 500000 USD\n- Route D (route_d): short 5 ES futures, same specs as Route A\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the lowest-cost feasible route and recompute residual exposure after the trade.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 2,
      "beta_reduction_usd": 500000,
      "beta_reduction_pct": 62.5,
      "margin_used": 26000,
      "expected_cost": 50,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Portfolio risk / rebalancing",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "risk_budget_rebalance",
        "feasibility_trap": false,
        "objective_function": "objective for risk_budget_rebalance",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 2,
        "beta_reduction_usd": 500000,
        "beta_reduction_pct": 62.5,
        "margin_used": 26000,
        "expected_cost": 50,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-029",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-029",
    "prompt": "Frozen market snapshot:\n- Account: US margin account. Short selling requires a locate before order entry; you cannot short beyond the locate.\n- Instrument: XLF ETF at 220.00. Desired bearish target: short 1200 shares of exposure.\n- Locate availability: exactly 700 shares. Option cash available: 2400 USD. Put delta -0.35 means 35 delta-shares per contract.\nCandidate routes (decide feasibility from the locate and cash limits yourself):\n- Route A (route_a): short exactly the 700 located shares and buy 3 listed puts (delta -0.35, premium 8.00 USD/share, multiplier 100) within 2400 USD option cash\n- Route B (route_b): short the full 1200-share target (requires shares beyond the locate)\n- Route C (route_c): buy 7 listed puts (premium 8.00 USD/share, multiplier 100), ignoring the option cash limit\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nChoose the feasible bearish implementation that maximizes bearish delta-shares without breaching the locate or option cash. Report rejected routes by route id.\n\nObjective:\nmaximize bearish delta-shares subject to locate and option-cash constraints.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"short_shares\", \"put_contracts\", \"premium_paid\", \"bearish_delta_shares\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "XLF",
      "short_shares": 700,
      "put_contracts": 3,
      "premium_paid": 2400,
      "bearish_delta_shares": 805,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Shorting / borrow / margin / locates",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "short_locate_failure",
        "feasibility_trap": true,
        "objective_function": "objective for short_locate_failure",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "short_shares",
          "put_contracts",
          "premium_paid",
          "bearish_delta_shares"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "XLF",
        "short_shares": 700,
        "put_contracts": 3,
        "premium_paid": 2400,
        "bearish_delta_shares": 805,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-030",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-030",
    "prompt": "Frozen market snapshot:\n- Instrument: GLD ETF. Order size: 300 shares at limit 84.25. The regular session is OPEN now; the after-hours venue is CLOSED; the dark venue is NOT enabled on this account.\n- Session/permission trap: only permitted, open venues are executable.\nCandidate routes (decide which venue is permitted and open yourself):\n- Route A (route_a): route the order to the continuous regular session\n- Route B (route_b): route the order to the closed after-hours venue with no permission\n- Route C (route_c): route via an unsupported dark venue not enabled on this account\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nRoute to the only feasible venue. Report rejected routes by route id.\n\nObjective:\nselect the lowest-cost feasible route and recompute residual exposure after the trade.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"order_shares\", \"limit_price\", \"venue\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "GLD",
      "order_shares": 300,
      "limit_price": 84.25,
      "venue": "regular_session",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Execution / liquidity / microstructure",
        "tier": "L10",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "invalid_route_session_trap",
        "feasibility_trap": true,
        "objective_function": "objective for invalid_route_session_trap",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "order_shares",
          "limit_price",
          "venue"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "GLD",
        "order_shares": 300,
        "limit_price": 84.25,
        "venue": "regular_session",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-031",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-031",
    "prompt": "Frozen market snapshot:\n- Account holder: US retail customer. Account base currency: USD. Maintain a USD cash buffer; pick the lowest-USD-cost feasible conversion.\n- Required: obtain 300000 EUR settling T+2. Spot EURUSD 1.0500. EUR futures initial margin capacity: 2000 USD.\nCandidate routes (decide feasibility from jurisdiction, settlement and margin facts yourself):\n- Route A (route_a): buy EUR spot at 1.0500, settles T+2, fees included\n- Route B (route_b): use a retail CFD on EURUSD\n- Route C (route_c): use EUR futures requiring 2750 USD initial margin\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nChoose the feasible route and compute USD cost. Report rejected routes by route id.\n\nObjective:\nobtain the EUR by the required settlement date at the lowest feasible USD cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"eur_amount\", \"usd_cost\", \"settlement_date_rule\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "convert_fx",
      "selected_route": "route_a",
      "eur_amount": 300000,
      "usd_cost": 315000,
      "settlement_date_rule": "T+2",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot FX / CFDs / multi-currency",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "multi_currency_cash_buffer",
        "feasibility_trap": true,
        "objective_function": "objective for multi_currency_cash_buffer",
        "deterministic_grading_fields": [
          "selected_route",
          "eur_amount",
          "usd_cost",
          "settlement_date_rule"
        ]
      },
      "canonical_answer": {
        "decision": "convert_fx",
        "selected_route": "route_a",
        "eur_amount": 300000,
        "usd_cost": 315000,
        "settlement_date_rule": "T+2",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-032",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-032",
    "prompt": "Frozen market snapshot:\n- Instrument: QQQ ETF at 210.00. Account calendar: the next day is a settlement holiday, so T+1 cash lands on the stated date.\n- Trade date 2026-06-22; T+1 cash settlement date 2026-06-23. Unsettled proceeds cannot be withdrawn before settlement.\nCandidate routes (decide which respects settlement):\n- Route A (route_a): sell 300 shares on 2026-06-22; withdraw cash only after T+1 settlement on 2026-06-23\n- Route B (route_b): sell 300 shares on 2026-06-22 and withdraw the proceeds on the trade date 2026-06-22\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nSell and report trade value and the T+1 cash date. Report rejected routes by route id.\n\nObjective:\nselect the lowest-cost feasible route and recompute residual exposure after the trade.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"trade_value_usd\", \"settlement_rule\", \"settlement_cash_date\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "sell",
      "selected_route": "route_a",
      "trade_value_usd": 63000,
      "settlement_rule": "T+1",
      "settlement_cash_date": "2026-06-23",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Corporate actions / settlement / calendar / jurisdiction",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "regional_market_holiday",
        "feasibility_trap": true,
        "objective_function": "objective for regional_market_holiday",
        "deterministic_grading_fields": [
          "selected_route",
          "trade_value_usd",
          "settlement_rule",
          "settlement_cash_date"
        ]
      },
      "canonical_answer": {
        "decision": "sell",
        "selected_route": "route_a",
        "trade_value_usd": 63000,
        "settlement_rule": "T+1",
        "settlement_cash_date": "2026-06-23",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-033",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-033",
    "prompt": "Frozen market snapshot:\n- Instrument: IWM ETF at 146.00. This is an equity order ticket; equities settle T+1.\n- Buy 600 shares with a protective day limit 146.25; T+1 cash date 2026-06-24.\nCandidate routes:\n- Route A (route_a): submit a day limit buy ticket for 600 shares at 146.25 in the regular session\n- Route B (route_b): submit a market buy that ignores the protective limit\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nCreate the order ticket and report trade value and T+1 date. Report rejected routes by route id.\n\nObjective:\nselect the lowest-cost feasible route and recompute residual exposure after the trade.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"side\", \"quantity\", \"order_type\", \"limit_price\", \"trade_value_usd\", \"settlement_rule\", \"settlement_cash_date\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "IWM",
      "side": "buy",
      "quantity": 600,
      "order_type": "limit",
      "limit_price": 146.25,
      "trade_value_usd": 87600,
      "settlement_rule": "T+1",
      "settlement_cash_date": "2026-06-24",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot equities / ETFs",
        "tier": "L10",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "equity_order_ticket",
        "feasibility_trap": true,
        "objective_function": "objective for equity_order_ticket",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "side",
          "quantity",
          "order_type",
          "limit_price",
          "trade_value_usd",
          "settlement_rule",
          "settlement_cash_date"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "IWM",
        "side": "buy",
        "quantity": 600,
        "order_type": "limit",
        "limit_price": 146.25,
        "trade_value_usd": 87600,
        "settlement_rule": "T+1",
        "settlement_cash_date": "2026-06-24",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-034",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-034",
    "prompt": "Frozen market snapshot:\n- Position: long 1,000 AAPL common stock at 490.00.\n- Downside scenario for grading: AAPL closes at 440.00 at option expiry.\n- Constraint: scenario PnL including option premium must be no worse than -46000 USD (a downside floor on this put spread).\n- Option multiplier: 100 shares; use exactly 10 spreads. Stock PnL + spread payoff - net premium = scenario PnL.\nCandidate put spreads (decide which meet the floor; pick the lowest net premium among those that do):\n- Route A (route_a): buy 10 AAPL 490 puts at 12.00 and sell 10 AAPL 480 puts at 7.00 (put spread)\n- Route B (route_b): buy 10 AAPL 490 puts at 12.00 and sell 10 AAPL 470 puts at 5.00 (put spread)\n- Route C (route_c): buy 10 AAPL 490 puts at 12.00 and sell 10 AAPL 460 puts at 3.00 (put spread)\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nSelect the feasible put spread and compute net premium and scenario PnL. Report rejected routes by route id.\n\nObjective:\nminimize net premium subject to scenario_pnl_usd >= the stated floor.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"buy_put_strike\", \"sell_put_strike\", \"contracts\", \"net_premium_paid\", \"scenario_pnl_usd\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "buy_put_strike": 490,
      "sell_put_strike": 480,
      "contracts": 10,
      "net_premium_paid": 5000,
      "scenario_pnl_usd": -45000,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "put_spread_downside_floor",
        "feasibility_trap": false,
        "objective_function": "objective for put_spread_downside_floor",
        "deterministic_grading_fields": [
          "selected_route",
          "buy_put_strike",
          "sell_put_strike",
          "contracts",
          "net_premium_paid",
          "scenario_pnl_usd"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "buy_put_strike": 490,
        "sell_put_strike": 480,
        "contracts": 10,
        "net_premium_paid": 5000,
        "scenario_pnl_usd": -45000,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-035",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-035",
    "prompt": "Frozen market snapshot:\n- Position: long 5 CL near-month futures. This is a commodity roll with basis between near and next; use executable bid/ask, not mid.\n- First notice day is tomorrow; account policy forbids holding physically deliverable CL long into first notice.\n- Only the displayed bid/ask is executable; mid prices are indicative and not executable.\nCandidate routes (decide feasibility yourself):\n- Route A (route_a): roll by selling near at bid 85.00 and buying next at ask 85.70; CL multiplier 1000 barrels; fee 4 USD/contract/leg\n- Route B (route_b): roll using the near/next mid prices instead of bid/ask\n- Route C (route_c): hold the long near-month position into first notice day\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nRoll the position and compute total executable cost. Report rejected routes by route id.\n\nObjective:\nselect the lowest-cost feasible route and recompute residual exposure after the trade.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"contracts\", \"roll_cost_usd\", \"fees_usd\", \"total_cost_usd\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "roll",
      "selected_route": "route_a",
      "contracts": 5,
      "roll_cost_usd": 3500,
      "fees_usd": 40,
      "total_cost_usd": 3540,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "commodity_roll_basis_hedge",
        "feasibility_trap": true,
        "objective_function": "objective for commodity_roll_basis_hedge",
        "deterministic_grading_fields": [
          "selected_route",
          "contracts",
          "roll_cost_usd",
          "fees_usd",
          "total_cost_usd"
        ]
      },
      "canonical_answer": {
        "decision": "roll",
        "selected_route": "route_a",
        "contracts": 5,
        "roll_cost_usd": 3500,
        "fees_usd": 40,
        "total_cost_usd": 3540,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-036",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-036",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is a risk budget rebalance against the stated beta target.\n- Portfolio equity beta-dollar exposure: 1200000 USD.\n- Required reduction: at least 50% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 46000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 260000 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 3 ES futures (beta hedge), ES at 5200.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 2 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 19000 USD premium that reduces beta-dollars by 780000 USD\n- Route D (route_d): short 6 ES futures, same specs as Route A\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the lowest-cost feasible route and recompute residual exposure after the trade.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 3,
      "beta_reduction_usd": 780000,
      "beta_reduction_pct": 65,
      "margin_used": 39000,
      "expected_cost": 75,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Portfolio risk / rebalancing",
        "tier": "L10",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "risk_budget_rebalance",
        "feasibility_trap": false,
        "objective_function": "objective for risk_budget_rebalance",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 3,
        "beta_reduction_usd": 780000,
        "beta_reduction_pct": 65,
        "margin_used": 39000,
        "expected_cost": 75,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-037",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-037",
    "prompt": "Frozen market snapshot:\n- Account: US margin account. Short selling requires a locate before order entry; you cannot short beyond the locate.\n- Instrument: TSLA common stock at 180.00. Desired bearish target: short 1200 shares of exposure.\n- Locate availability: exactly 800 shares. Option cash available: 3200 USD. Put delta -0.35 means 35 delta-shares per contract.\nCandidate routes (decide feasibility from the locate and cash limits yourself):\n- Route A (route_a): short exactly the 800 located shares and buy 4 listed puts (delta -0.35, premium 8.00 USD/share, multiplier 100) within 3200 USD option cash\n- Route B (route_b): short the full 1200-share target (requires shares beyond the locate)\n- Route C (route_c): buy 8 listed puts (premium 8.00 USD/share, multiplier 100), ignoring the option cash limit\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nChoose the feasible bearish implementation that maximizes bearish delta-shares without breaching the locate or option cash. Report rejected routes by route id.\n\nObjective:\nmaximize bearish delta-shares subject to locate and option-cash constraints.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"short_shares\", \"put_contracts\", \"premium_paid\", \"bearish_delta_shares\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "TSLA",
      "short_shares": 800,
      "put_contracts": 4,
      "premium_paid": 3200,
      "bearish_delta_shares": 940,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Shorting / borrow / margin / locates",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "short_locate_failure",
        "feasibility_trap": true,
        "objective_function": "objective for short_locate_failure",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "short_shares",
          "put_contracts",
          "premium_paid",
          "bearish_delta_shares"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "TSLA",
        "short_shares": 800,
        "put_contracts": 4,
        "premium_paid": 3200,
        "bearish_delta_shares": 940,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-038",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-038",
    "prompt": "Frozen market snapshot:\n- Instrument: XLK ETF. Order size: 200 shares at limit 92.25. The regular session is OPEN now; the after-hours venue is CLOSED; the dark venue is NOT enabled on this account.\n- Session/permission trap: only permitted, open venues are executable.\nCandidate routes (decide which venue is permitted and open yourself):\n- Route A (route_a): route the order to the continuous regular session\n- Route B (route_b): route the order to the closed after-hours venue with no permission\n- Route C (route_c): route via an unsupported dark venue not enabled on this account\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nRoute to the only feasible venue. Report rejected routes by route id.\n\nObjective:\nselect the lowest-cost feasible route and recompute residual exposure after the trade.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"order_shares\", \"limit_price\", \"venue\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "XLK",
      "order_shares": 200,
      "limit_price": 92.25,
      "venue": "regular_session",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Execution / liquidity / microstructure",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "invalid_route_session_trap",
        "feasibility_trap": true,
        "objective_function": "objective for invalid_route_session_trap",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "order_shares",
          "limit_price",
          "venue"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "XLK",
        "order_shares": 200,
        "limit_price": 92.25,
        "venue": "regular_session",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-039",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-039",
    "prompt": "Frozen market snapshot:\n- Jurisdiction / account regime: US cash account.\n- Permissions: CFDs unavailable; short selling unavailable in cash accounts; futures not approved; the regular equity session is closed.\n- No alternative product permission is enabled in this packet.\nCandidate routes (decide feasibility from the permission facts; a no-trade is required if all routes violate constraints):\n- Route A (route_a): short 500 XLF shares via CFD after the regular session close\n- Route B (route_b): short 500 XLF shares in the cash account\n- Route C (route_c): buy XLF futures to get short exposure\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nReject every invalid route and return the no-trade decision. Report rejected routes by route id.\n\nObjective:\nreturn no_trade if and only if every route violates a permission, session, or product constraint.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"requested_shares\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "no_trade",
      "selected_route": "none",
      "instrument": "XLF",
      "requested_shares": 500,
      "feasibility": "infeasible",
      "rejected_routes": [
        "route_a",
        "route_b",
        "route_c"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Feasibility / rejection / no-trade traps",
        "tier": "L10",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "unsupported_product_permission",
        "feasibility_trap": true,
        "objective_function": "objective for unsupported_product_permission",
        "deterministic_grading_fields": [
          "decision",
          "selected_route",
          "instrument",
          "requested_shares",
          "feasibility"
        ]
      },
      "canonical_answer": {
        "decision": "no_trade",
        "selected_route": "none",
        "instrument": "XLF",
        "requested_shares": 500,
        "feasibility": "infeasible",
        "rejected_routes": [
          "route_a",
          "route_b",
          "route_c"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-040",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-040",
    "prompt": "Frozen market snapshot:\n- Account holder: US retail customer. Account base currency: USD. Payment is required on the T+2 date; a later forward settlement misses it.\n- Required: obtain 140000 EUR settling T+2. Spot EURUSD 1.0600. EUR futures initial margin capacity: 2000 USD.\nCandidate routes (decide feasibility from jurisdiction, settlement and margin facts yourself):\n- Route A (route_a): buy EUR spot at 1.0600, settles T+2, fees included\n- Route B (route_b): use a retail CFD on EURUSD\n- Route C (route_c): use EUR futures requiring 2750 USD initial margin\n- Route D (route_d): buy EUR via an outright forward that settles T+5, later than the required T+2 date\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nChoose the feasible route and compute USD cost. Report rejected routes by route id.\n\nObjective:\nobtain the EUR by the required settlement date at the lowest feasible USD cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"eur_amount\", \"usd_cost\", \"settlement_date_rule\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "convert_fx",
      "selected_route": "route_a",
      "eur_amount": 140000,
      "usd_cost": 148400,
      "settlement_date_rule": "T+2",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot FX / CFDs / multi-currency",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "forward_vs_spot_payment",
        "feasibility_trap": false,
        "objective_function": "objective for forward_vs_spot_payment",
        "deterministic_grading_fields": [
          "selected_route",
          "eur_amount",
          "usd_cost",
          "settlement_date_rule"
        ]
      },
      "canonical_answer": {
        "decision": "convert_fx",
        "selected_route": "route_a",
        "eur_amount": 140000,
        "usd_cost": 148400,
        "settlement_date_rule": "T+2",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-041",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-041",
    "prompt": "Frozen market snapshot:\n- Instrument: SPY ETF. Corporate action: ordinary cash dividend 0.60/share, ex-dividend tomorrow.\n- Existing GTC sell-stop price: 195.00. Related listed option strike: 200.00.\n- Broker rule: reduce GTC equity stop prices by the ordinary cash dividend on ex-date; listed option strikes are NOT adjusted for ordinary cash dividends.\nCandidate routes (decide which matches the corporate-action rules):\n- Route A (route_a): reduce the GTC sell-stop by the ordinary dividend on ex-date; leave the listed option strike unchanged\n- Route B (route_b): leave the GTC stop unchanged through ex-date\n- Route C (route_c): reduce the listed option strike by the ordinary dividend\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nCompute the adjusted stop and the option-strike treatment. Report rejected routes by route id.\n\nObjective:\nselect the lowest-cost feasible route and recompute residual exposure after the trade.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"adjusted_stop_price\", \"option_strike_adjusted\", \"option_strike_after\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "adjust_order_for_ex_dividend",
      "selected_route": "route_a",
      "adjusted_stop_price": 194.4,
      "option_strike_adjusted": false,
      "option_strike_after": 200,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Corporate actions / settlement / calendar / jurisdiction",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "ex_dividend_adjustment",
        "feasibility_trap": true,
        "objective_function": "objective for ex_dividend_adjustment",
        "deterministic_grading_fields": [
          "selected_route",
          "adjusted_stop_price",
          "option_strike_adjusted",
          "option_strike_after"
        ]
      },
      "canonical_answer": {
        "decision": "adjust_order_for_ex_dividend",
        "selected_route": "route_a",
        "adjusted_stop_price": 194.4,
        "option_strike_adjusted": false,
        "option_strike_after": 200,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-042",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-042",
    "prompt": "Frozen market snapshot:\n- Instrument: QQQ ETF at 173.00. This is a sector ETF rebalance leg; equities/ETFs settle T+1.\n- Buy 600 shares with a protective day limit 173.25; T+1 cash date 2026-06-25.\nCandidate routes:\n- Route A (route_a): submit a day limit buy ticket for 600 shares at 173.25 in the regular session\n- Route B (route_b): submit a market buy that ignores the protective limit\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nCreate the order ticket and report trade value and T+1 date. Report rejected routes by route id.\n\nObjective:\nselect the lowest-cost feasible route and recompute residual exposure after the trade.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"side\", \"quantity\", \"order_type\", \"limit_price\", \"trade_value_usd\", \"settlement_rule\", \"settlement_cash_date\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "QQQ",
      "side": "buy",
      "quantity": 600,
      "order_type": "limit",
      "limit_price": 173.25,
      "trade_value_usd": 103800,
      "settlement_rule": "T+1",
      "settlement_cash_date": "2026-06-25",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot equities / ETFs",
        "tier": "L10",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "etf_sector_rebalance_t_plus_one",
        "feasibility_trap": false,
        "objective_function": "objective for etf_sector_rebalance_t_plus_one",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "side",
          "quantity",
          "order_type",
          "limit_price",
          "trade_value_usd",
          "settlement_rule",
          "settlement_cash_date"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "QQQ",
        "side": "buy",
        "quantity": 600,
        "order_type": "limit",
        "limit_price": 173.25,
        "trade_value_usd": 103800,
        "settlement_rule": "T+1",
        "settlement_cash_date": "2026-06-25",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-043",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-043",
    "prompt": "Frozen market snapshot:\n- Covered call on IWM ETF: long 100 shares at 180.00, short 1 175 call.\n- Call quote: 5.50 USD/share; option multiplier 100 shares. Intrinsic = max(0, spot - strike).\n- Ordinary cash dividend 0.30/share with ex-dividend tomorrow. Early assignment of an American call is rational for the holder when the dividend exceeds the call's remaining time value.\nCandidate routes (decide which is required by the assignment economics):\n- Route A (route_a): roll/close the short call before ex-dividend to avoid early assignment\n- Route B (route_b): hold the covered call through ex-dividend unchanged\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nCompute the call's time value, compare to the dividend, decide the early-assignment risk, and select the route. Report rejected routes by route id.\n\nObjective:\nremove early-assignment/dividend risk when and only when it is economically rational.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"call_strike\", \"dividend_per_share\", \"call_time_value\", \"early_assignment_risk\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "manage_assignment",
      "selected_route": "route_b",
      "instrument": "IWM",
      "call_strike": 175,
      "dividend_per_share": 0.3,
      "call_time_value": 0.5,
      "early_assignment_risk": false,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_a"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "early_assignment_dividend_risk",
        "feasibility_trap": false,
        "objective_function": "objective for early_assignment_dividend_risk",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "call_strike",
          "dividend_per_share",
          "call_time_value",
          "early_assignment_risk"
        ]
      },
      "canonical_answer": {
        "decision": "manage_assignment",
        "selected_route": "route_b",
        "instrument": "IWM",
        "call_strike": 175,
        "dividend_per_share": 0.3,
        "call_time_value": 0.5,
        "early_assignment_risk": false,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_a"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-044",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-044",
    "prompt": "Frozen market snapshot:\n- Account: futures account using the simplified SPAN margin figures in this packet.\n- Objective: add crude-oil carry exposure with SPAN margin_used <= 11500 USD.\nCandidate routes (decide feasibility yourself from the SPAN margin figures):\n- Route A (route_a): long 4 CL June / short 4 CL July calendar spread, expected carry 1700 USD, SPAN margin 10000 USD\n- Route B (route_b): long 2 outright CL contracts, expected carry 2200 USD, SPAN margin 23000 USD\n- Route C (route_c): stay flat, expected carry 0 USD, SPAN margin 0 USD\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nSelect the feasible strategy with the highest expected carry under the SPAN margin cap. Report rejected routes by route id.\n\nObjective:\nselect the lowest-cost feasible route and recompute residual exposure after the trade.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"spread_count\", \"expected_carry_usd\", \"margin_used\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "spread_count": 4,
      "expected_carry_usd": 1700,
      "margin_used": 10000,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "span_margin_calendar_spread",
        "feasibility_trap": false,
        "objective_function": "objective for span_margin_calendar_spread",
        "deterministic_grading_fields": [
          "selected_route",
          "spread_count",
          "expected_carry_usd",
          "margin_used"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "spread_count": 4,
        "expected_carry_usd": 1700,
        "margin_used": 10000,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-045",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-045",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is a beta-dollar rebalance against the stated beta target.\n- Portfolio equity beta-dollar exposure: 1200000 USD.\n- Required reduction: at least 50% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 46000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 257500 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 3 ES futures (beta hedge), ES at 5150.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 2 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 20000 USD premium that reduces beta-dollars by 772500 USD\n- Route D (route_d): short 6 ES futures, same specs as Route A\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the lowest-cost feasible route and recompute residual exposure after the trade.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 3,
      "beta_reduction_usd": 772500,
      "beta_reduction_pct": 64.38,
      "margin_used": 39000,
      "expected_cost": 75,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Portfolio risk / rebalancing",
        "tier": "L10",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "beta_dollar_rebalance",
        "feasibility_trap": true,
        "objective_function": "objective for beta_dollar_rebalance",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 3,
        "beta_reduction_usd": 772500,
        "beta_reduction_pct": 64.38,
        "margin_used": 39000,
        "expected_cost": 75,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-046",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-046",
    "prompt": "Frozen market snapshot:\n- Account: US margin account. Borrow rate is 7.00% APR; weigh borrow cost against edge.\n- Instrument: NVDA common stock at 150.00. Desired bearish target: short 1300 shares of exposure.\n- Locate availability: exactly 300 shares. Option cash available: 800 USD. Put delta -0.35 means 35 delta-shares per contract.\nCandidate routes (decide feasibility from the locate and cash limits yourself):\n- Route A (route_a): short exactly the 300 located shares and buy 1 listed puts (delta -0.35, premium 8.00 USD/share, multiplier 100) within 800 USD option cash\n- Route B (route_b): short the full 1300-share target (requires shares beyond the locate)\n- Route C (route_c): buy 5 listed puts (premium 8.00 USD/share, multiplier 100), ignoring the option cash limit\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nChoose the feasible bearish implementation that maximizes bearish delta-shares without breaching the locate or option cash. Report rejected routes by route id.\n\nObjective:\nmaximize bearish delta-shares subject to locate and option-cash constraints.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"short_shares\", \"put_contracts\", \"premium_paid\", \"bearish_delta_shares\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "NVDA",
      "short_shares": 300,
      "put_contracts": 1,
      "premium_paid": 800,
      "bearish_delta_shares": 335,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Shorting / borrow / margin / locates",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "borrow_cost_vs_trade_edge",
        "feasibility_trap": true,
        "objective_function": "objective for borrow_cost_vs_trade_edge",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "short_shares",
          "put_contracts",
          "premium_paid",
          "bearish_delta_shares"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "NVDA",
        "short_shares": 300,
        "put_contracts": 1,
        "premium_paid": 800,
        "bearish_delta_shares": 335,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-047",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-047",
    "prompt": "Frozen market snapshot:\n- Instrument: TSLA common stock. Order size: 200 shares at limit 101.25. The regular session is OPEN now; the after-hours venue is CLOSED; the dark venue is NOT enabled on this account.\n- Auction/session constraint: only the open regular session is executable.\nCandidate routes (decide which venue is permitted and open yourself):\n- Route A (route_a): route the order to the continuous regular session\n- Route B (route_b): route the order to the closed after-hours venue with no permission\n- Route C (route_c): route via an unsupported dark venue not enabled on this account\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nRoute to the only feasible venue. Report rejected routes by route id.\n\nObjective:\nselect the lowest-cost feasible route and recompute residual exposure after the trade.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"order_shares\", \"limit_price\", \"venue\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "TSLA",
      "order_shares": 200,
      "limit_price": 101.25,
      "venue": "regular_session",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Execution / liquidity / microstructure",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "auction_session_constraint",
        "feasibility_trap": true,
        "objective_function": "objective for auction_session_constraint",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "order_shares",
          "limit_price",
          "venue"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "TSLA",
        "order_shares": 200,
        "limit_price": 101.25,
        "venue": "regular_session",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-048",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-048",
    "prompt": "Frozen market snapshot:\n- Jurisdiction / account regime: US cash account.\n- Permissions: CFDs unavailable; short selling unavailable in cash accounts; futures not approved; the regular equity session is closed.\n- No alternative product permission is enabled in this packet.\nCandidate routes (decide feasibility from the permission facts; a no-trade is required if all routes violate constraints):\n- Route A (route_a): short 800 XLK shares via CFD after the regular session close\n- Route B (route_b): short 800 XLK shares in the cash account\n- Route C (route_c): buy XLK futures to get short exposure\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nReject every invalid route and return the no-trade decision. Report rejected routes by route id.\n\nObjective:\nreturn no_trade if and only if every route violates a permission, session, or product constraint.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"requested_shares\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "no_trade",
      "selected_route": "none",
      "instrument": "XLK",
      "requested_shares": 800,
      "feasibility": "infeasible",
      "rejected_routes": [
        "route_a",
        "route_b",
        "route_c"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Feasibility / rejection / no-trade traps",
        "tier": "L10",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "session_permission_rejection",
        "feasibility_trap": true,
        "objective_function": "objective for session_permission_rejection",
        "deterministic_grading_fields": [
          "decision",
          "selected_route",
          "instrument",
          "requested_shares",
          "feasibility"
        ]
      },
      "canonical_answer": {
        "decision": "no_trade",
        "selected_route": "none",
        "instrument": "XLK",
        "requested_shares": 800,
        "feasibility": "infeasible",
        "rejected_routes": [
          "route_a",
          "route_b",
          "route_c"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-049",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-049",
    "prompt": "Frozen market snapshot:\n- Account holder: US retail customer. Account base currency: USD. The EUR payment must settle on the required T+2 date (FX settlement mismatch trap).\n- Required: obtain 320000 EUR settling T+2. Spot EURUSD 1.0700. EUR futures initial margin capacity: 2000 USD.\nCandidate routes (decide feasibility from jurisdiction, settlement and margin facts yourself):\n- Route A (route_a): buy EUR spot at 1.0700, settles T+2, fees included\n- Route B (route_b): use a retail CFD on EURUSD\n- Route C (route_c): use EUR futures requiring 2750 USD initial margin\n- Route D (route_d): buy EUR via an outright forward that settles T+5, later than the required T+2 date\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nChoose the feasible route and compute USD cost. Report rejected routes by route id.\n\nObjective:\nobtain the EUR by the required settlement date at the lowest feasible USD cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"eur_amount\", \"usd_cost\", \"settlement_date_rule\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "convert_fx",
      "selected_route": "route_a",
      "eur_amount": 320000,
      "usd_cost": 342400,
      "settlement_date_rule": "T+2",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot FX / CFDs / multi-currency",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "fx_settlement_mismatch",
        "feasibility_trap": true,
        "objective_function": "objective for fx_settlement_mismatch",
        "deterministic_grading_fields": [
          "selected_route",
          "eur_amount",
          "usd_cost",
          "settlement_date_rule"
        ]
      },
      "canonical_answer": {
        "decision": "convert_fx",
        "selected_route": "route_a",
        "eur_amount": 320000,
        "usd_cost": 342400,
        "settlement_date_rule": "T+2",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-050",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-050",
    "prompt": "Frozen market snapshot:\n- Instrument: GLD ETF at 290.00. US equities settle T+1.\n- Trade date 2026-06-24; T+1 cash settlement date 2026-06-25. Unsettled proceeds cannot be withdrawn before settlement.\nCandidate routes (decide which respects settlement):\n- Route A (route_a): sell 600 shares on 2026-06-24; withdraw cash only after T+1 settlement on 2026-06-25\n- Route B (route_b): sell 600 shares on 2026-06-24 and withdraw the proceeds on the trade date 2026-06-24\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nSell and report trade value and the T+1 cash date. Report rejected routes by route id.\n\nObjective:\nselect the lowest-cost feasible route and recompute residual exposure after the trade.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"trade_value_usd\", \"settlement_rule\", \"settlement_cash_date\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "sell",
      "selected_route": "route_a",
      "trade_value_usd": 174000,
      "settlement_rule": "T+1",
      "settlement_cash_date": "2026-06-25",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Corporate actions / settlement / calendar / jurisdiction",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "t_plus_one_settlement_sequence",
        "feasibility_trap": true,
        "objective_function": "objective for t_plus_one_settlement_sequence",
        "deterministic_grading_fields": [
          "selected_route",
          "trade_value_usd",
          "settlement_rule",
          "settlement_cash_date"
        ]
      },
      "canonical_answer": {
        "decision": "sell",
        "selected_route": "route_a",
        "trade_value_usd": 174000,
        "settlement_rule": "T+1",
        "settlement_cash_date": "2026-06-25",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-051",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-051",
    "prompt": "Frozen market snapshot:\n- Instrument: SPY ETF at 80.00. Objective is to participate in the opening auction with a protective limit.\n- Order size 600 shares; protective limit 80.25.\nCandidate routes (decide which matches the auction/close objective):\n- Route A (route_a): place a limit-on-open auction order for 600 shares\n- Route B (route_b): cross the spread immediately in the continuous session, missing the opening auction\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nSelect the order route matching the objective. Report rejected routes by route id.\n\nObjective:\nselect the lowest-cost feasible route and recompute residual exposure after the trade.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"quantity\", \"limit_price\", \"venue\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "SPY",
      "quantity": 600,
      "limit_price": 80.25,
      "venue": "opening_auction",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot equities / ETFs",
        "tier": "L10",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "opening_auction_limit",
        "feasibility_trap": false,
        "objective_function": "objective for opening_auction_limit",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "quantity",
          "limit_price",
          "venue"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "SPY",
        "quantity": 600,
        "limit_price": 80.25,
        "venue": "opening_auction",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-052",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-052",
    "prompt": "Frozen market snapshot:\n- You hold 1 long ITM QQQ ETF call, strike 185, spot 195.00.\n- Call quote 11.00/share; intrinsic = spot - strike = 10.00; remaining time value = quote - intrinsic = 1.00.\n- Ordinary dividend 0.40/share, ex-dividend tomorrow. Early exercise/assignment of an American call is rational only when the dividend exceeds the remaining time value.\nCandidate routes (decide from the exercise economics; do not assume a route):\n- Route A (route_a): exercise the long call early to capture the 0.40/share dividend (you forfeit remaining time value)\n- Route B (route_b): sell the long call at its 11.00 quote and keep the time value\n- Route C (route_c): roll the call to the next expiry\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nCompare the dividend to the time value, decide whether to exercise early, and select the route. Report rejected routes by route id.\n\nObjective:\nresolve the exercise/assignment decision at the highest economic value.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"dividend_per_share\", \"call_time_value\", \"exercise_early\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "exercise_decision",
      "selected_route": "route_b",
      "instrument": "QQQ",
      "dividend_per_share": 0.4,
      "call_time_value": 1,
      "exercise_early": false,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_a",
        "route_c"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "exercise_assignment_roll_decision",
        "feasibility_trap": false,
        "objective_function": "objective for exercise_assignment_roll_decision",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "dividend_per_share",
          "call_time_value",
          "exercise_early"
        ]
      },
      "canonical_answer": {
        "decision": "exercise_decision",
        "selected_route": "route_b",
        "instrument": "QQQ",
        "dividend_per_share": 0.4,
        "call_time_value": 1,
        "exercise_early": false,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_a",
          "route_c"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-053",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-053",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is an index-futures beta hedge of the cash equity book using ES futures.\n- Portfolio equity beta-dollar exposure: 1150000 USD.\n- Required reduction: at least 45% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 46000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 253750 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 3 ES futures (beta hedge), ES at 5075.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 2 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 20000 USD premium that reduces beta-dollars by 761250 USD\n- Route D (route_d): short 6 ES futures, same specs as Route A\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the lowest-cost feasible route and recompute residual exposure after the trade.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 3,
      "beta_reduction_usd": 761250,
      "beta_reduction_pct": 66.2,
      "margin_used": 39000,
      "expected_cost": 75,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "futures_beta_hedge",
        "feasibility_trap": true,
        "objective_function": "objective for futures_beta_hedge",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 3,
        "beta_reduction_usd": 761250,
        "beta_reduction_pct": 66.2,
        "margin_used": 39000,
        "expected_cost": 75,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-054",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-054",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is a drawdown hedge across the equity book; minimize hedge cost.\n- Portfolio equity beta-dollar exposure: 1200000 USD.\n- Required reduction: at least 50% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 46000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 255000 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 3 ES futures (beta hedge), ES at 5100.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 2 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 21000 USD premium that reduces beta-dollars by 765000 USD\n- Route D (route_d): short 6 ES futures, same specs as Route A\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the lowest-cost feasible route and recompute residual exposure after the trade.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 3,
      "beta_reduction_usd": 765000,
      "beta_reduction_pct": 63.75,
      "margin_used": 39000,
      "expected_cost": 75,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Portfolio risk / rebalancing",
        "tier": "L10",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "multi_asset_drawdown_hedge",
        "feasibility_trap": false,
        "objective_function": "objective for multi_asset_drawdown_hedge",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 3,
        "beta_reduction_usd": 765000,
        "beta_reduction_pct": 63.75,
        "margin_used": 39000,
        "expected_cost": 75,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-055",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-055",
    "prompt": "Frozen market snapshot:\n- Account: US margin account. MSFT is hard-to-borrow with recall risk; you cannot exceed the locate.\n- Instrument: MSFT common stock at 120.00. Desired bearish target: short 1000 shares of exposure.\n- Locate availability: exactly 500 shares. Option cash available: 1600 USD. Put delta -0.35 means 35 delta-shares per contract.\nCandidate routes (decide feasibility from the locate and cash limits yourself):\n- Route A (route_a): short exactly the 500 located shares and buy 2 listed puts (delta -0.35, premium 8.00 USD/share, multiplier 100) within 1600 USD option cash\n- Route B (route_b): short the full 1000-share target (requires shares beyond the locate)\n- Route C (route_c): buy 6 listed puts (premium 8.00 USD/share, multiplier 100), ignoring the option cash limit\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nChoose the feasible bearish implementation that maximizes bearish delta-shares without breaching the locate or option cash. Report rejected routes by route id.\n\nObjective:\nmaximize bearish delta-shares subject to locate and option-cash constraints.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"short_shares\", \"put_contracts\", \"premium_paid\", \"bearish_delta_shares\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "MSFT",
      "short_shares": 500,
      "put_contracts": 2,
      "premium_paid": 1600,
      "bearish_delta_shares": 570,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Shorting / borrow / margin / locates",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "hard_to_borrow_margin_recall",
        "feasibility_trap": true,
        "objective_function": "objective for hard_to_borrow_margin_recall",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "short_shares",
          "put_contracts",
          "premium_paid",
          "bearish_delta_shares"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "MSFT",
        "short_shares": 500,
        "put_contracts": 2,
        "premium_paid": 1600,
        "bearish_delta_shares": 570,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-056",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-056",
    "prompt": "Frozen market snapshot:\n- Instrument: NVDA common stock. TWAP-style execution with a hard slippage cap expressed as an average-price cap.\n- Mid price: 116.00. Maximum average execution price (cap): 116.11.\n- Ask book: 40000 @ 116.05; 40000 @ 116.10; 20000 @ 116.30.\n- Partial fills allowed only in 500-share clips. Fees ignored.\nCandidate routes:\n- Route A (route_a): walk the book filling cheapest levels first in 500-share clips while keeping the running average <= the cap\n- Route B (route_b): take the full displayed size across all levels at a single 116.30 limit\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nCompute the maximum buy quantity in allowed clips that keeps the average price at or below the cap. Report rejected routes by route id.\n\nObjective:\nmaximize filled_shares subject to average_price <= the cap, in 500-share clips.\n\nOutput JSON fields: { \"decision\", \"instrument\", \"side\", \"clip_size_shares\", \"filled_shares\", \"average_price\", \"limit_price\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "trade",
      "instrument": "NVDA",
      "side": "buy",
      "clip_size_shares": 500,
      "filled_shares": 94500,
      "average_price": 116.11,
      "limit_price": 116.3,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Execution / liquidity / microstructure",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "twap_slippage_limit",
        "feasibility_trap": true,
        "objective_function": "objective for twap_slippage_limit",
        "deterministic_grading_fields": [
          "instrument",
          "side",
          "clip_size_shares",
          "filled_shares",
          "average_price",
          "limit_price"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "instrument": "NVDA",
        "side": "buy",
        "clip_size_shares": 500,
        "filled_shares": 94500,
        "average_price": 116.11,
        "limit_price": 116.3,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-057",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-057",
    "prompt": "Frozen market snapshot:\n- Jurisdiction / account regime: US cash account.\n- Permissions: CFDs unavailable; short selling unavailable in cash accounts; futures not approved; the regular equity session is closed.\n- No alternative product permission is enabled in this packet.\nCandidate routes (decide feasibility from the permission facts; a no-trade is required if all routes violate constraints):\n- Route A (route_a): short 500 TSLA shares via CFD after the regular session close\n- Route B (route_b): short 500 TSLA shares in the cash account\n- Route C (route_c): buy TSLA futures to get short exposure\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nReject every invalid route and return the no-trade decision. Report rejected routes by route id.\n\nObjective:\nreturn no_trade if and only if every route violates a permission, session, or product constraint.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"requested_shares\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "no_trade",
      "selected_route": "none",
      "instrument": "TSLA",
      "requested_shares": 500,
      "feasibility": "infeasible",
      "rejected_routes": [
        "route_a",
        "route_b",
        "route_c"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Feasibility / rejection / no-trade traps",
        "tier": "L10",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "no_trade_invalid_route",
        "feasibility_trap": true,
        "objective_function": "objective for no_trade_invalid_route",
        "deterministic_grading_fields": [
          "decision",
          "selected_route",
          "instrument",
          "requested_shares",
          "feasibility"
        ]
      },
      "canonical_answer": {
        "decision": "no_trade",
        "selected_route": "none",
        "instrument": "TSLA",
        "requested_shares": 500,
        "feasibility": "infeasible",
        "rejected_routes": [
          "route_a",
          "route_b",
          "route_c"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-058",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-058",
    "prompt": "Frozen market snapshot:\n- Account holder: US retail customer. Account base currency: USD. CFDs are unavailable to US retail accounts in this jurisdiction.\n- Required: obtain 160000 EUR settling T+2. Spot EURUSD 1.0600. EUR futures initial margin capacity: 2000 USD.\nCandidate routes (decide feasibility from jurisdiction, settlement and margin facts yourself):\n- Route A (route_a): buy EUR spot at 1.0600, settles T+2, fees included\n- Route B (route_b): use a retail CFD on EURUSD\n- Route C (route_c): use EUR futures requiring 2750 USD initial margin\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nChoose the feasible route and compute USD cost. Report rejected routes by route id.\n\nObjective:\nobtain the EUR by the required settlement date at the lowest feasible USD cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"eur_amount\", \"usd_cost\", \"settlement_date_rule\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "convert_fx",
      "selected_route": "route_a",
      "eur_amount": 160000,
      "usd_cost": 169600,
      "settlement_date_rule": "T+2",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot FX / CFDs / multi-currency",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "cfd_margin_regional_constraint",
        "feasibility_trap": false,
        "objective_function": "objective for cfd_margin_regional_constraint",
        "deterministic_grading_fields": [
          "selected_route",
          "eur_amount",
          "usd_cost",
          "settlement_date_rule"
        ]
      },
      "canonical_answer": {
        "decision": "convert_fx",
        "selected_route": "route_a",
        "eur_amount": 160000,
        "usd_cost": 169600,
        "settlement_date_rule": "T+2",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-059",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-059",
    "prompt": "Frozen market snapshot:\n- Instrument: XLF ETF. Corporate action: ordinary cash dividend 0.30/share, ex-dividend tomorrow.\n- Existing GTC sell-stop price: 275.00. Related listed option strike: 280.00.\n- Broker rule: reduce GTC equity stop prices by the ordinary cash dividend on ex-date; listed option strikes are NOT adjusted for ordinary cash dividends.\nCandidate routes (decide which matches the corporate-action rules):\n- Route A (route_a): reduce the GTC sell-stop by the ordinary dividend on ex-date; leave the listed option strike unchanged\n- Route B (route_b): leave the GTC stop unchanged through ex-date\n- Route C (route_c): reduce the listed option strike by the ordinary dividend\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nCompute the adjusted stop and the option-strike treatment. Report rejected routes by route id.\n\nObjective:\nselect the lowest-cost feasible route and recompute residual exposure after the trade.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"adjusted_stop_price\", \"option_strike_adjusted\", \"option_strike_after\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "adjust_order_for_ex_dividend",
      "selected_route": "route_a",
      "adjusted_stop_price": 274.7,
      "option_strike_adjusted": false,
      "option_strike_after": 280,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Corporate actions / settlement / calendar / jurisdiction",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "corporate_action_adjustment",
        "feasibility_trap": true,
        "objective_function": "objective for corporate_action_adjustment",
        "deterministic_grading_fields": [
          "selected_route",
          "adjusted_stop_price",
          "option_strike_adjusted",
          "option_strike_after"
        ]
      },
      "canonical_answer": {
        "decision": "adjust_order_for_ex_dividend",
        "selected_route": "route_a",
        "adjusted_stop_price": 274.7,
        "option_strike_adjusted": false,
        "option_strike_after": 280,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-060",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-060",
    "prompt": "Frozen market snapshot:\n- Instrument: GLD ETF at 107.00. Objective is to participate in the closing print (market on close / MOC) for an index rebalance.\n- Order size 600 shares; protective limit 107.25.\nCandidate routes (decide which matches the auction/close objective):\n- Route A (route_a): place a market-on-close (MOC) order for 600 shares\n- Route B (route_b): cross the spread immediately in the continuous session, missing the close\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nSelect the order route matching the objective. Report rejected routes by route id.\n\nObjective:\nselect the lowest-cost feasible route and recompute residual exposure after the trade.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"quantity\", \"limit_price\", \"venue\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "GLD",
      "quantity": 600,
      "limit_price": 107.25,
      "venue": "market_on_close",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot equities / ETFs",
        "tier": "L10",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "market_on_close_rebalance",
        "feasibility_trap": false,
        "objective_function": "objective for market_on_close_rebalance",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "quantity",
          "limit_price",
          "venue"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "GLD",
        "quantity": 600,
        "limit_price": 107.25,
        "venue": "market_on_close",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-061",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-061",
    "prompt": "Frozen market snapshot:\n- Covered call on SPY ETF: long 100 shares at 190.00, short 1 185 call.\n- Call quote: 6.10 USD/share; option multiplier 100 shares. Intrinsic = max(0, spot - strike).\n- Ordinary cash dividend 0.30/share with ex-dividend tomorrow. Early assignment of an American call is rational for the holder when the dividend exceeds the call's remaining time value.\nCandidate routes (decide which is required by the assignment economics):\n- Route A (route_a): roll/close the short call before ex-dividend to avoid early assignment\n- Route B (route_b): hold the covered call through ex-dividend unchanged\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nCompute the call's time value, compare to the dividend, decide the early-assignment risk, and select the route. Report rejected routes by route id.\n\nObjective:\nremove early-assignment/dividend risk when and only when it is economically rational.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"call_strike\", \"dividend_per_share\", \"call_time_value\", \"early_assignment_risk\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "manage_assignment",
      "selected_route": "route_b",
      "instrument": "SPY",
      "call_strike": 185,
      "dividend_per_share": 0.3,
      "call_time_value": 1.1,
      "early_assignment_risk": false,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_a"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "covered_call_assignment",
        "feasibility_trap": true,
        "objective_function": "objective for covered_call_assignment",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "call_strike",
          "dividend_per_share",
          "call_time_value",
          "early_assignment_risk"
        ]
      },
      "canonical_answer": {
        "decision": "manage_assignment",
        "selected_route": "route_b",
        "instrument": "SPY",
        "call_strike": 185,
        "dividend_per_share": 0.3,
        "call_time_value": 1.1,
        "early_assignment_risk": false,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_a"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-062",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-062",
    "prompt": "Frozen market snapshot:\n- Position: long 4 CL near-month futures. This is a futures roll calendar ahead of first notice; use executable bid/ask, not mid.\n- First notice day is tomorrow; account policy forbids holding physically deliverable CL long into first notice.\n- Only the displayed bid/ask is executable; mid prices are indicative and not executable.\nCandidate routes (decide feasibility yourself):\n- Route A (route_a): roll by selling near at bid 78.00 and buying next at ask 78.70; CL multiplier 1000 barrels; fee 4 USD/contract/leg\n- Route B (route_b): roll using the near/next mid prices instead of bid/ask\n- Route C (route_c): hold the long near-month position into first notice day\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nRoll the position and compute total executable cost. Report rejected routes by route id.\n\nObjective:\nselect the lowest-cost feasible route and recompute residual exposure after the trade.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"contracts\", \"roll_cost_usd\", \"fees_usd\", \"total_cost_usd\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "roll",
      "selected_route": "route_a",
      "contracts": 4,
      "roll_cost_usd": 2800,
      "fees_usd": 32,
      "total_cost_usd": 2832,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "futures_roll_calendar",
        "feasibility_trap": false,
        "objective_function": "objective for futures_roll_calendar",
        "deterministic_grading_fields": [
          "selected_route",
          "contracts",
          "roll_cost_usd",
          "fees_usd",
          "total_cost_usd"
        ]
      },
      "canonical_answer": {
        "decision": "roll",
        "selected_route": "route_a",
        "contracts": 4,
        "roll_cost_usd": 2800,
        "fees_usd": 32,
        "total_cost_usd": 2832,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-063",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-063",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is a VaR/liquidity triage; only listed futures liquidity is usable.\n- Portfolio equity beta-dollar exposure: 1200000 USD.\n- Required reduction: at least 50% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 46000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 252500 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 3 ES futures (beta hedge), ES at 5050.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 2 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 18000 USD premium that reduces beta-dollars by 757500 USD\n- Route D (route_d): short 6 ES futures, same specs as Route A\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the lowest-cost feasible route and recompute residual exposure after the trade.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 3,
      "beta_reduction_usd": 757500,
      "beta_reduction_pct": 63.13,
      "margin_used": 39000,
      "expected_cost": 75,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Portfolio risk / rebalancing",
        "tier": "L10",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "cross_asset_var_liquidity_triage",
        "feasibility_trap": false,
        "objective_function": "objective for cross_asset_var_liquidity_triage",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 3,
        "beta_reduction_usd": 757500,
        "beta_reduction_pct": 63.13,
        "margin_used": 39000,
        "expected_cost": 75,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-064",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-064",
    "prompt": "Frozen market snapshot:\n- Account: US margin account. On recall, substitute listed puts for the un-locatable short.\n- Instrument: AAPL common stock at 210.00. Desired bearish target: short 1100 shares of exposure.\n- Locate availability: exactly 700 shares. Option cash available: 2400 USD. Put delta -0.35 means 35 delta-shares per contract.\nCandidate routes (decide feasibility from the locate and cash limits yourself):\n- Route A (route_a): short exactly the 700 located shares and buy 3 listed puts (delta -0.35, premium 8.00 USD/share, multiplier 100) within 2400 USD option cash\n- Route B (route_b): short the full 1100-share target (requires shares beyond the locate)\n- Route C (route_c): buy 7 listed puts (premium 8.00 USD/share, multiplier 100), ignoring the option cash limit\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nChoose the feasible bearish implementation that maximizes bearish delta-shares without breaching the locate or option cash. Report rejected routes by route id.\n\nObjective:\nmaximize bearish delta-shares subject to locate and option-cash constraints.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"short_shares\", \"put_contracts\", \"premium_paid\", \"bearish_delta_shares\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "AAPL",
      "short_shares": 700,
      "put_contracts": 3,
      "premium_paid": 2400,
      "bearish_delta_shares": 805,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Shorting / borrow / margin / locates",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "locate_recall_options_substitution",
        "feasibility_trap": true,
        "objective_function": "objective for locate_recall_options_substitution",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "short_shares",
          "put_contracts",
          "premium_paid",
          "bearish_delta_shares"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "AAPL",
        "short_shares": 700,
        "put_contracts": 3,
        "premium_paid": 2400,
        "bearish_delta_shares": 805,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-065",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-065",
    "prompt": "Frozen market snapshot:\n- Instrument: MSFT common stock. Order-book liquidity limit: maximize fill under the average-price cap.\n- Mid price: 125.00. Maximum average execution price (cap): 125.11.\n- Ask book: 40000 @ 125.05; 40000 @ 125.10; 20000 @ 125.30.\n- Partial fills allowed only in 500-share clips. Fees ignored.\nCandidate routes:\n- Route A (route_a): walk the book filling cheapest levels first in 500-share clips while keeping the running average <= the cap\n- Route B (route_b): take the full displayed size across all levels at a single 125.30 limit\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nCompute the maximum buy quantity in allowed clips that keeps the average price at or below the cap. Report rejected routes by route id.\n\nObjective:\nmaximize filled_shares subject to average_price <= the cap, in 500-share clips.\n\nOutput JSON fields: { \"decision\", \"instrument\", \"side\", \"clip_size_shares\", \"filled_shares\", \"average_price\", \"limit_price\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "trade",
      "instrument": "MSFT",
      "side": "buy",
      "clip_size_shares": 500,
      "filled_shares": 94500,
      "average_price": 125.11,
      "limit_price": 125.3,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Execution / liquidity / microstructure",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "order_book_liquidity_limit",
        "feasibility_trap": true,
        "objective_function": "objective for order_book_liquidity_limit",
        "deterministic_grading_fields": [
          "instrument",
          "side",
          "clip_size_shares",
          "filled_shares",
          "average_price",
          "limit_price"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "instrument": "MSFT",
        "side": "buy",
        "clip_size_shares": 500,
        "filled_shares": 94500,
        "average_price": 125.11,
        "limit_price": 125.3,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-066",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-066",
    "prompt": "Frozen market snapshot:\n- Account: US margin account. A borrow recall on NVDA common stock forces you to close 800 short shares today; no new locate is available.\nCandidate routes (decide feasibility from the recall and locate facts):\n- Route A (route_a): buy to cover 800 recalled shares and replace exposure with 8 listed puts (premium 8.00/share, multiplier 100)\n- Route B (route_b): ignore the borrow recall and keep the short open\n- Route C (route_c): short additional shares to average down (no locate available)\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nHandle the borrow recall and keep bearish exposure feasibly. Report rejected routes by route id.\n\nObjective:\nselect the lowest-cost feasible route and recompute residual exposure after the trade.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"buy_to_cover_shares\", \"put_contracts\", \"premium_paid\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "NVDA",
      "buy_to_cover_shares": 800,
      "put_contracts": 8,
      "premium_paid": 6400,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Feasibility / rejection / no-trade traps",
        "tier": "L10",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "borrow_recall_margin_hedge",
        "feasibility_trap": true,
        "objective_function": "objective for borrow_recall_margin_hedge",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "buy_to_cover_shares",
          "put_contracts",
          "premium_paid"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "NVDA",
        "buy_to_cover_shares": 800,
        "put_contracts": 8,
        "premium_paid": 6400,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-067",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-067",
    "prompt": "Frozen market snapshot:\n- Account holder: US retail customer. Account base currency: USD. Maintain a USD cash buffer; pick the lowest-USD-cost feasible conversion.\n- Required: obtain 340000 EUR settling T+2. Spot EURUSD 1.0600. EUR futures initial margin capacity: 2000 USD.\nCandidate routes (decide feasibility from jurisdiction, settlement and margin facts yourself):\n- Route A (route_a): buy EUR spot at 1.0600, settles T+2, fees included\n- Route B (route_b): use a retail CFD on EURUSD\n- Route C (route_c): use EUR futures requiring 2750 USD initial margin\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nChoose the feasible route and compute USD cost. Report rejected routes by route id.\n\nObjective:\nobtain the EUR by the required settlement date at the lowest feasible USD cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"eur_amount\", \"usd_cost\", \"settlement_date_rule\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "convert_fx",
      "selected_route": "route_a",
      "eur_amount": 340000,
      "usd_cost": 360400,
      "settlement_date_rule": "T+2",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot FX / CFDs / multi-currency",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "multi_currency_cash_buffer",
        "feasibility_trap": true,
        "objective_function": "objective for multi_currency_cash_buffer",
        "deterministic_grading_fields": [
          "selected_route",
          "eur_amount",
          "usd_cost",
          "settlement_date_rule"
        ]
      },
      "canonical_answer": {
        "decision": "convert_fx",
        "selected_route": "route_a",
        "eur_amount": 340000,
        "usd_cost": 360400,
        "settlement_date_rule": "T+2",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-068",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-068",
    "prompt": "Frozen market snapshot:\n- Instrument: XLK ETF at 270.00. Account calendar: the next day is a settlement holiday, so T+1 cash lands on the stated date.\n- Trade date 2026-06-16; T+1 cash settlement date 2026-06-17. Unsettled proceeds cannot be withdrawn before settlement.\nCandidate routes (decide which respects settlement):\n- Route A (route_a): sell 400 shares on 2026-06-16; withdraw cash only after T+1 settlement on 2026-06-17\n- Route B (route_b): sell 400 shares on 2026-06-16 and withdraw the proceeds on the trade date 2026-06-16\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nSell and report trade value and the T+1 cash date. Report rejected routes by route id.\n\nObjective:\nselect the lowest-cost feasible route and recompute residual exposure after the trade.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"trade_value_usd\", \"settlement_rule\", \"settlement_cash_date\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "sell",
      "selected_route": "route_a",
      "trade_value_usd": 108000,
      "settlement_rule": "T+1",
      "settlement_cash_date": "2026-06-17",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Corporate actions / settlement / calendar / jurisdiction",
        "tier": "L10",
        "capability_tag": "execution_action_quality",
        "scenario_family": "regional_market_holiday",
        "feasibility_trap": true,
        "objective_function": "objective for regional_market_holiday",
        "deterministic_grading_fields": [
          "selected_route",
          "trade_value_usd",
          "settlement_rule",
          "settlement_cash_date"
        ]
      },
      "canonical_answer": {
        "decision": "sell",
        "selected_route": "route_a",
        "trade_value_usd": 108000,
        "settlement_rule": "T+1",
        "settlement_cash_date": "2026-06-17",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-L10-069",
    "level": 10,
    "type": "schema",
    "rubric_id": "stockbench-l10-069",
    "prompt": "Frozen market snapshot:\n- Instrument: XLF ETF at 134.00. This is an equity order ticket; equities settle T+1.\n- Buy 600 shares with a protective day limit 134.25; T+1 cash date 2026-06-18.\nCandidate routes:\n- Route A (route_a): submit a day limit buy ticket for 600 shares at 134.25 in the regular session\n- Route B (route_b): submit a market buy that ignores the protective limit\n\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n\nTask:\nCreate the order ticket and report trade value and T+1 date. Report rejected routes by route id.\n\nObjective:\nselect the lowest-cost feasible route and recompute residual exposure after the trade.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"side\", \"quantity\", \"order_type\", \"limit_price\", \"trade_value_usd\", \"settlement_rule\", \"settlement_cash_date\", \"feasibility\", \"rejected_routes\", \"residual_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "XLF",
      "side": "buy",
      "quantity": 600,
      "order_type": "limit",
      "limit_price": 134.25,
      "trade_value_usd": 80400,
      "settlement_rule": "T+1",
      "settlement_cash_date": "2026-06-18",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ],
      "residual_check": "recomputed"
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot equities / ETFs",
        "tier": "L10",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "equity_order_ticket",
        "feasibility_trap": true,
        "objective_function": "objective for equity_order_ticket",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "side",
          "quantity",
          "order_type",
          "limit_price",
          "trade_value_usd",
          "settlement_rule",
          "settlement_cash_date"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "XLF",
        "side": "buy",
        "quantity": 600,
        "order_type": "limit",
        "limit_price": 134.25,
        "trade_value_usd": 80400,
        "settlement_rule": "T+1",
        "settlement_cash_date": "2026-06-18",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ],
        "residual_check": "recomputed"
      }
    }
  },
  {
    "id": "SB-AGI-009",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-009",
    "prompt": "Frozen market snapshot:\n- Position: long 1,000 TSLA common stock at 510.00.\n- Downside scenario for grading: TSLA closes at 460.00 at option expiry.\n- Constraint: scenario PnL including option premium must be no worse than -30000 USD (a downside floor on this put spread).\n- Option multiplier: 100 shares; use exactly 10 spreads. Stock PnL + spread payoff - net premium = scenario PnL.\nCandidate put spreads (decide which meet the floor; pick the lowest net premium among those that do):\n- Route A (route_a): buy 10 TSLA 510 puts at 12.00 and sell 10 TSLA 500 puts at 7.00 (put spread)\n- Route B (route_b): buy 10 TSLA 510 puts at 12.00 and sell 10 TSLA 490 puts at 5.00 (put spread)\n- Route C (route_c): buy 10 TSLA 510 puts at 12.00 and sell 10 TSLA 480 puts at 3.00 (put spread)\n\nFrozen scenario PnL before action:\n- gap_down: -130000 USD.\n- melt_up: 44000 USD.\n- range_chop: -70000 USD.\n- sector_rotation: -62000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: gap_down +20000, melt_up -3000, range_chop +14000, sector_rotation +17000 USD. Apply this effect to each scenario, then subtract the 9000 USD cash cost from every scenario.\n\nTask:\nSelect the feasible put spread and compute net premium and scenario PnL. Report rejected routes by route id.\n\nObjective:\nminimize net premium subject to scenario_pnl_usd >= the stated floor.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"buy_put_strike\", \"sell_put_strike\", \"contracts\", \"net_premium_paid\", \"scenario_pnl_usd\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_c",
      "buy_put_strike": 510,
      "sell_put_strike": 480,
      "contracts": 10,
      "net_premium_paid": 9000,
      "scenario_pnl_usd": -29000,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_a",
        "route_b"
      ],
      "scenario_pnl": {
        "gap_down": -119000,
        "melt_up": 32000,
        "range_chop": -65000,
        "sector_rotation": -54000
      },
      "worst_case_pnl": -119000,
      "self_check": {
        "downside_floor_met": true,
        "lowest_premium_selected": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "put_spread_downside_floor",
        "feasibility_trap": false,
        "objective_function": "objective for put_spread_downside_floor",
        "deterministic_grading_fields": [
          "selected_route",
          "buy_put_strike",
          "sell_put_strike",
          "contracts",
          "net_premium_paid",
          "scenario_pnl_usd",
          "scenario_pnl.gap_down",
          "scenario_pnl.melt_up",
          "scenario_pnl.range_chop",
          "scenario_pnl.sector_rotation",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_c",
        "buy_put_strike": 510,
        "sell_put_strike": 480,
        "contracts": 10,
        "net_premium_paid": 9000,
        "scenario_pnl_usd": -29000,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_a",
          "route_b"
        ],
        "scenario_pnl": {
          "gap_down": -119000,
          "melt_up": 32000,
          "range_chop": -65000,
          "sector_rotation": -54000
        },
        "worst_case_pnl": -119000,
        "self_check": {
          "downside_floor_met": true,
          "lowest_premium_selected": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-010",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-010",
    "prompt": "Frozen market snapshot:\n- Covered call on XLK ETF: long 100 shares at 205.00, short 1 200 call.\n- Call quote: 5.80 USD/share; option multiplier 100 shares. Intrinsic = max(0, spot - strike).\n- Ordinary cash dividend 0.90/share with ex-dividend tomorrow. Early assignment of an American call is rational for the holder when the dividend exceeds the call's remaining time value.\nCandidate routes (decide which is required by the assignment economics):\n- Route A (route_a): roll/close the short call before ex-dividend to avoid early assignment\n- Route B (route_b): hold the covered call through ex-dividend unchanged\n\nFrozen scenario PnL before action:\n- risk_off: -135000 USD.\n- squeeze: 48000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: risk_off +1500, squeeze -500 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nCompute the call's time value, compare to the dividend, decide the early-assignment risk, and select the route. Report rejected routes by route id.\n\nObjective:\nremove early-assignment/dividend risk when and only when it is economically rational.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"call_strike\", \"dividend_per_share\", \"call_time_value\", \"early_assignment_risk\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "manage_assignment",
      "selected_route": "route_a",
      "instrument": "XLK",
      "call_strike": 200,
      "dividend_per_share": 0.9,
      "call_time_value": 0.8,
      "early_assignment_risk": true,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ],
      "scenario_pnl": {
        "risk_off": -133500,
        "squeeze": 47500
      },
      "worst_case_pnl": -133500,
      "self_check": {
        "compared_dividend_to_time_value": true,
        "assignment_handled": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "early_assignment_dividend_risk",
        "feasibility_trap": false,
        "objective_function": "objective for early_assignment_dividend_risk",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "call_strike",
          "dividend_per_share",
          "call_time_value",
          "early_assignment_risk",
          "scenario_pnl.risk_off",
          "scenario_pnl.squeeze",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "manage_assignment",
        "selected_route": "route_a",
        "instrument": "XLK",
        "call_strike": 200,
        "dividend_per_share": 0.9,
        "call_time_value": 0.8,
        "early_assignment_risk": true,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ],
        "scenario_pnl": {
          "risk_off": -133500,
          "squeeze": 47500
        },
        "worst_case_pnl": -133500,
        "self_check": {
          "compared_dividend_to_time_value": true,
          "assignment_handled": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-011",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-011",
    "prompt": "Frozen market snapshot:\n- You hold 1 long ITM XLF ETF call, strike 210, spot 220.00.\n- Call quote 12.00/share; intrinsic = spot - strike = 10.00; remaining time value = quote - intrinsic = 2.00.\n- Ordinary dividend 2.60/share, ex-dividend tomorrow. Early exercise/assignment of an American call is rational only when the dividend exceeds the remaining time value.\nCandidate routes (decide from the exercise economics; do not assume a route):\n- Route A (route_a): exercise the long call early to capture the 2.60/share dividend (you forfeit remaining time value)\n- Route B (route_b): sell the long call at its 12.00 quote and keep the time value\n- Route C (route_c): roll the call to the next expiry\n\nFrozen scenario PnL before action:\n- rate_shock: -140000 USD.\n- vol_spike: 52000 USD.\n- credit_widening: -76000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: rate_shock +1200, vol_spike -400, credit_widening +900 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nCompare the dividend to the time value, decide whether to exercise early, and select the route. Report rejected routes by route id.\n\nObjective:\nresolve the exercise/assignment decision at the highest economic value.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"dividend_per_share\", \"call_time_value\", \"exercise_early\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "exercise_decision",
      "selected_route": "route_a",
      "instrument": "XLF",
      "dividend_per_share": 2.6,
      "call_time_value": 2,
      "exercise_early": true,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "rate_shock": -138800,
        "vol_spike": 51600,
        "credit_widening": -75100
      },
      "worst_case_pnl": -138800,
      "self_check": {
        "compared_dividend_to_time_value": true,
        "exercise_or_assignment_resolved": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "AGI",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "exercise_assignment_roll_decision",
        "feasibility_trap": false,
        "objective_function": "objective for exercise_assignment_roll_decision",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "dividend_per_share",
          "call_time_value",
          "exercise_early",
          "scenario_pnl.rate_shock",
          "scenario_pnl.vol_spike",
          "scenario_pnl.credit_widening",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "exercise_decision",
        "selected_route": "route_a",
        "instrument": "XLF",
        "dividend_per_share": 2.6,
        "call_time_value": 2,
        "exercise_early": true,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "rate_shock": -138800,
          "vol_spike": 51600,
          "credit_widening": -75100
        },
        "worst_case_pnl": -138800,
        "self_check": {
          "compared_dividend_to_time_value": true,
          "exercise_or_assignment_resolved": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-012",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-012",
    "prompt": "Frozen market snapshot:\n- Covered call on GLD ETF: long 100 shares at 215.00, short 1 220 call.\n- Call quote: 1.40 USD/share; option multiplier 100 shares. Intrinsic = max(0, spot - strike).\n- Ordinary cash dividend 1.30/share with ex-dividend tomorrow. Early assignment of an American call is rational for the holder when the dividend exceeds the call's remaining time value.\nCandidate routes (decide which is required by the assignment economics):\n- Route A (route_a): roll/close the short call before ex-dividend to avoid early assignment\n- Route B (route_b): hold the covered call through ex-dividend unchanged\n\nFrozen scenario PnL before action:\n- gap_down: -145000 USD.\n- melt_up: 56000 USD.\n- range_chop: -79000 USD.\n- sector_rotation: -62000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: gap_down +1500, melt_up -500, range_chop +1000, sector_rotation +1250 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nCompute the call's time value, compare to the dividend, decide the early-assignment risk, and select the route. Report rejected routes by route id.\n\nObjective:\nremove early-assignment/dividend risk when and only when it is economically rational.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"call_strike\", \"dividend_per_share\", \"call_time_value\", \"early_assignment_risk\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "manage_assignment",
      "selected_route": "route_b",
      "instrument": "GLD",
      "call_strike": 220,
      "dividend_per_share": 1.3,
      "call_time_value": 1.4,
      "early_assignment_risk": false,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_a"
      ],
      "scenario_pnl": {
        "gap_down": -143500,
        "melt_up": 55500,
        "range_chop": -78000,
        "sector_rotation": -60750
      },
      "worst_case_pnl": -143500,
      "self_check": {
        "compared_dividend_to_time_value": true,
        "assignment_handled": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "covered_call_assignment",
        "feasibility_trap": true,
        "objective_function": "objective for covered_call_assignment",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "call_strike",
          "dividend_per_share",
          "call_time_value",
          "early_assignment_risk",
          "scenario_pnl.gap_down",
          "scenario_pnl.melt_up",
          "scenario_pnl.range_chop",
          "scenario_pnl.sector_rotation",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "manage_assignment",
        "selected_route": "route_b",
        "instrument": "GLD",
        "call_strike": 220,
        "dividend_per_share": 1.3,
        "call_time_value": 1.4,
        "early_assignment_risk": false,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_a"
        ],
        "scenario_pnl": {
          "gap_down": -143500,
          "melt_up": 55500,
          "range_chop": -78000,
          "sector_rotation": -60750
        },
        "worst_case_pnl": -143500,
        "self_check": {
          "compared_dividend_to_time_value": true,
          "assignment_handled": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-013",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-013",
    "prompt": "Frozen market snapshot:\n- Position: long 1,000 SPY ETF at 495.00.\n- Downside scenario for grading: SPY closes at 445.00 at option expiry.\n- Constraint: scenario PnL including option premium must be no worse than -46000 USD (a downside floor on this put spread).\n- Option multiplier: 100 shares; use exactly 10 spreads. Stock PnL + spread payoff - net premium = scenario PnL.\nCandidate put spreads (decide which meet the floor; pick the lowest net premium among those that do):\n- Route A (route_a): buy 10 SPY 495 puts at 12.00 and sell 10 SPY 485 puts at 7.00 (put spread)\n- Route B (route_b): buy 10 SPY 495 puts at 12.00 and sell 10 SPY 475 puts at 5.00 (put spread)\n- Route C (route_c): buy 10 SPY 495 puts at 12.00 and sell 10 SPY 465 puts at 3.00 (put spread)\n\nFrozen scenario PnL before action:\n- risk_off: -120000 USD.\n- squeeze: 40000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: risk_off +20000, squeeze -3000 USD. Apply this effect to each scenario, then subtract the 5000 USD cash cost from every scenario.\n\nTask:\nSelect the feasible put spread and compute net premium and scenario PnL. Report rejected routes by route id.\n\nObjective:\nminimize net premium subject to scenario_pnl_usd >= the stated floor.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"buy_put_strike\", \"sell_put_strike\", \"contracts\", \"net_premium_paid\", \"scenario_pnl_usd\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "buy_put_strike": 495,
      "sell_put_strike": 485,
      "contracts": 10,
      "net_premium_paid": 5000,
      "scenario_pnl_usd": -45000,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "risk_off": -105000,
        "squeeze": 32000
      },
      "worst_case_pnl": -105000,
      "self_check": {
        "downside_floor_met": true,
        "lowest_premium_selected": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "put_spread_downside_floor",
        "feasibility_trap": false,
        "objective_function": "objective for put_spread_downside_floor",
        "deterministic_grading_fields": [
          "selected_route",
          "buy_put_strike",
          "sell_put_strike",
          "contracts",
          "net_premium_paid",
          "scenario_pnl_usd",
          "scenario_pnl.risk_off",
          "scenario_pnl.squeeze",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "buy_put_strike": 495,
        "sell_put_strike": 485,
        "contracts": 10,
        "net_premium_paid": 5000,
        "scenario_pnl_usd": -45000,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "risk_off": -105000,
          "squeeze": 32000
        },
        "worst_case_pnl": -105000,
        "self_check": {
          "downside_floor_met": true,
          "lowest_premium_selected": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-014",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-014",
    "prompt": "Frozen market snapshot:\n- Position: long 6 CL near-month futures. This is a commodity roll with basis between near and next; use executable bid/ask, not mid.\n- First notice day is tomorrow; account policy forbids holding physically deliverable CL long into first notice.\n- Only the displayed bid/ask is executable; mid prices are indicative and not executable.\nCandidate routes (decide feasibility yourself):\n- Route A (route_a): roll by selling near at bid 74.00 and buying next at ask 74.40; CL multiplier 1000 barrels; fee 4 USD/contract/leg\n- Route B (route_b): roll using the near/next mid prices instead of bid/ask\n- Route C (route_c): hold the long near-month position into first notice day\n\nFrozen scenario PnL before action:\n- rate_shock: -125000 USD.\n- vol_spike: 44000 USD.\n- credit_widening: -73000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: rate_shock +3000, vol_spike -1000, credit_widening +2000 USD. Apply this effect to each scenario, then subtract the 2448 USD cash cost from every scenario.\n\nTask:\nRoll the position and compute total executable cost. Report rejected routes by route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"contracts\", \"roll_cost_usd\", \"fees_usd\", \"total_cost_usd\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "roll",
      "selected_route": "route_a",
      "contracts": 6,
      "roll_cost_usd": 2400,
      "fees_usd": 48,
      "total_cost_usd": 2448,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "rate_shock": -124448,
        "vol_spike": 40552,
        "credit_widening": -73448
      },
      "worst_case_pnl": -124448,
      "self_check": {
        "uses_executable_prices": true,
        "avoids_first_notice": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "AGI",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "commodity_roll_basis_hedge",
        "feasibility_trap": true,
        "objective_function": "objective for commodity_roll_basis_hedge",
        "deterministic_grading_fields": [
          "selected_route",
          "contracts",
          "roll_cost_usd",
          "fees_usd",
          "total_cost_usd",
          "scenario_pnl.rate_shock",
          "scenario_pnl.vol_spike",
          "scenario_pnl.credit_widening",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "roll",
        "selected_route": "route_a",
        "contracts": 6,
        "roll_cost_usd": 2400,
        "fees_usd": 48,
        "total_cost_usd": 2448,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "rate_shock": -124448,
          "vol_spike": 40552,
          "credit_widening": -73448
        },
        "worst_case_pnl": -124448,
        "self_check": {
          "uses_executable_prices": true,
          "avoids_first_notice": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-015",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-015",
    "prompt": "Frozen market snapshot:\n- You hold 1 long ITM IWM ETF call, strike 190, spot 200.00.\n- Call quote 13.00/share; intrinsic = spot - strike = 10.00; remaining time value = quote - intrinsic = 3.00.\n- Ordinary dividend 3.60/share, ex-dividend tomorrow. Early exercise/assignment of an American call is rational only when the dividend exceeds the remaining time value.\nCandidate routes (decide from the exercise economics; do not assume a route):\n- Route A (route_a): exercise the long call early to capture the 3.60/share dividend (you forfeit remaining time value)\n- Route B (route_b): sell the long call at its 13.00 quote and keep the time value\n- Route C (route_c): roll the call to the next expiry\n\nFrozen scenario PnL before action:\n- gap_down: -130000 USD.\n- melt_up: 48000 USD.\n- range_chop: -76000 USD.\n- sector_rotation: -62000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: gap_down +1200, melt_up -400, range_chop +900, sector_rotation +1050 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nCompare the dividend to the time value, decide whether to exercise early, and select the route. Report rejected routes by route id.\n\nObjective:\nresolve the exercise/assignment decision at the highest economic value.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"dividend_per_share\", \"call_time_value\", \"exercise_early\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "exercise_decision",
      "selected_route": "route_a",
      "instrument": "IWM",
      "dividend_per_share": 3.6,
      "call_time_value": 3,
      "exercise_early": true,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "gap_down": -128800,
        "melt_up": 47600,
        "range_chop": -75100,
        "sector_rotation": -60950
      },
      "worst_case_pnl": -128800,
      "self_check": {
        "compared_dividend_to_time_value": true,
        "exercise_or_assignment_resolved": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "exercise_assignment_roll_decision",
        "feasibility_trap": false,
        "objective_function": "objective for exercise_assignment_roll_decision",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "dividend_per_share",
          "call_time_value",
          "exercise_early",
          "scenario_pnl.gap_down",
          "scenario_pnl.melt_up",
          "scenario_pnl.range_chop",
          "scenario_pnl.sector_rotation",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "exercise_decision",
        "selected_route": "route_a",
        "instrument": "IWM",
        "dividend_per_share": 3.6,
        "call_time_value": 3,
        "exercise_early": true,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "gap_down": -128800,
          "melt_up": 47600,
          "range_chop": -75100,
          "sector_rotation": -60950
        },
        "worst_case_pnl": -128800,
        "self_check": {
          "compared_dividend_to_time_value": true,
          "exercise_or_assignment_resolved": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-016",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-016",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is an index-futures beta hedge of the cash equity book using ES futures.\n- Portfolio equity beta-dollar exposure: 950000 USD.\n- Required reduction: at least 40% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 33000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 250000 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 2 ES futures (beta hedge), ES at 5000.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 1 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 21000 USD premium that reduces beta-dollars by 500000 USD\n- Route D (route_d): short 5 ES futures, same specs as Route A\n\nFrozen scenario PnL before action:\n- risk_off: -135000 USD.\n- squeeze: 52000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: risk_off +95000, squeeze -15000 USD. Apply this effect to each scenario, then subtract the 50 USD cash cost from every scenario.\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 2,
      "beta_reduction_usd": 500000,
      "beta_reduction_pct": 52.63,
      "margin_used": 26000,
      "expected_cost": 50,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ],
      "scenario_pnl": {
        "risk_off": -40050,
        "squeeze": 36950
      },
      "worst_case_pnl": -40050,
      "self_check": {
        "min_reduction_met": true,
        "margin_ok": true,
        "lowest_cost_feasible": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "futures_beta_hedge",
        "feasibility_trap": true,
        "objective_function": "objective for futures_beta_hedge",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost",
          "scenario_pnl.risk_off",
          "scenario_pnl.squeeze",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 2,
        "beta_reduction_usd": 500000,
        "beta_reduction_pct": 52.63,
        "margin_used": 26000,
        "expected_cost": 50,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ],
        "scenario_pnl": {
          "risk_off": -40050,
          "squeeze": 36950
        },
        "worst_case_pnl": -40050,
        "self_check": {
          "min_reduction_met": true,
          "margin_ok": true,
          "lowest_cost_feasible": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-017",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-017",
    "prompt": "Frozen market snapshot:\n- Position: long 1,000 MSFT common stock at 480.00.\n- Downside scenario for grading: MSFT closes at 430.00 at option expiry.\n- Constraint: scenario PnL including option premium must be no worse than -38000 USD (a downside floor on this put spread).\n- Option multiplier: 100 shares; use exactly 10 spreads. Stock PnL + spread payoff - net premium = scenario PnL.\nCandidate put spreads (decide which meet the floor; pick the lowest net premium among those that do):\n- Route A (route_a): buy 10 MSFT 480 puts at 12.00 and sell 10 MSFT 470 puts at 7.00 (put spread)\n- Route B (route_b): buy 10 MSFT 480 puts at 12.00 and sell 10 MSFT 460 puts at 5.00 (put spread)\n- Route C (route_c): buy 10 MSFT 480 puts at 12.00 and sell 10 MSFT 450 puts at 3.00 (put spread)\n\nFrozen scenario PnL before action:\n- rate_shock: -140000 USD.\n- vol_spike: 56000 USD.\n- credit_widening: -70000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: rate_shock +20000, vol_spike -3000, credit_widening +14000 USD. Apply this effect to each scenario, then subtract the 7000 USD cash cost from every scenario.\n\nTask:\nSelect the feasible put spread and compute net premium and scenario PnL. Report rejected routes by route id.\n\nObjective:\nminimize net premium subject to scenario_pnl_usd >= the stated floor.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"buy_put_strike\", \"sell_put_strike\", \"contracts\", \"net_premium_paid\", \"scenario_pnl_usd\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_b",
      "buy_put_strike": 480,
      "sell_put_strike": 460,
      "contracts": 10,
      "net_premium_paid": 7000,
      "scenario_pnl_usd": -37000,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_a",
        "route_c"
      ],
      "scenario_pnl": {
        "rate_shock": -127000,
        "vol_spike": 46000,
        "credit_widening": -63000
      },
      "worst_case_pnl": -127000,
      "self_check": {
        "downside_floor_met": true,
        "lowest_premium_selected": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "AGI",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "put_spread_downside_floor",
        "feasibility_trap": false,
        "objective_function": "objective for put_spread_downside_floor",
        "deterministic_grading_fields": [
          "selected_route",
          "buy_put_strike",
          "sell_put_strike",
          "contracts",
          "net_premium_paid",
          "scenario_pnl_usd",
          "scenario_pnl.rate_shock",
          "scenario_pnl.vol_spike",
          "scenario_pnl.credit_widening",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_b",
        "buy_put_strike": 480,
        "sell_put_strike": 460,
        "contracts": 10,
        "net_premium_paid": 7000,
        "scenario_pnl_usd": -37000,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_a",
          "route_c"
        ],
        "scenario_pnl": {
          "rate_shock": -127000,
          "vol_spike": 46000,
          "credit_widening": -63000
        },
        "worst_case_pnl": -127000,
        "self_check": {
          "downside_floor_met": true,
          "lowest_premium_selected": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-018",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-018",
    "prompt": "Frozen market snapshot:\n- Position: long 3 CL near-month futures. This is a commodity roll with basis between near and next; use executable bid/ask, not mid.\n- First notice day is tomorrow; account policy forbids holding physically deliverable CL long into first notice.\n- Only the displayed bid/ask is executable; mid prices are indicative and not executable.\nCandidate routes (decide feasibility yourself):\n- Route A (route_a): roll by selling near at bid 78.00 and buying next at ask 78.60; CL multiplier 1000 barrels; fee 4 USD/contract/leg\n- Route B (route_b): roll using the near/next mid prices instead of bid/ask\n- Route C (route_c): hold the long near-month position into first notice day\n\nFrozen scenario PnL before action:\n- gap_down: -145000 USD.\n- melt_up: 40000 USD.\n- range_chop: -73000 USD.\n- sector_rotation: -62000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: gap_down +3000, melt_up -1000, range_chop +2000, sector_rotation +2500 USD. Apply this effect to each scenario, then subtract the 1824 USD cash cost from every scenario.\n\nTask:\nRoll the position and compute total executable cost. Report rejected routes by route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"contracts\", \"roll_cost_usd\", \"fees_usd\", \"total_cost_usd\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "roll",
      "selected_route": "route_a",
      "contracts": 3,
      "roll_cost_usd": 1800,
      "fees_usd": 24,
      "total_cost_usd": 1824,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "gap_down": -143824,
        "melt_up": 37176,
        "range_chop": -72824,
        "sector_rotation": -61324
      },
      "worst_case_pnl": -143824,
      "self_check": {
        "uses_executable_prices": true,
        "avoids_first_notice": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "commodity_roll_basis_hedge",
        "feasibility_trap": true,
        "objective_function": "objective for commodity_roll_basis_hedge",
        "deterministic_grading_fields": [
          "selected_route",
          "contracts",
          "roll_cost_usd",
          "fees_usd",
          "total_cost_usd",
          "scenario_pnl.gap_down",
          "scenario_pnl.melt_up",
          "scenario_pnl.range_chop",
          "scenario_pnl.sector_rotation",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "roll",
        "selected_route": "route_a",
        "contracts": 3,
        "roll_cost_usd": 1800,
        "fees_usd": 24,
        "total_cost_usd": 1824,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "gap_down": -143824,
          "melt_up": 37176,
          "range_chop": -72824,
          "sector_rotation": -61324
        },
        "worst_case_pnl": -143824,
        "self_check": {
          "uses_executable_prices": true,
          "avoids_first_notice": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-019",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-019",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is a risk budget rebalance against the stated beta target.\n- Portfolio equity beta-dollar exposure: 1100000 USD.\n- Required reduction: at least 40% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 33000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 253750 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 2 ES futures (beta hedge), ES at 5075.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 1 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 20000 USD premium that reduces beta-dollars by 507500 USD\n- Route D (route_d): short 5 ES futures, same specs as Route A\n\nFrozen scenario PnL before action:\n- risk_off: -120000 USD.\n- squeeze: 44000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: risk_off +95000, squeeze -15000 USD. Apply this effect to each scenario, then subtract the 50 USD cash cost from every scenario.\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 2,
      "beta_reduction_usd": 507500,
      "beta_reduction_pct": 46.14,
      "margin_used": 26000,
      "expected_cost": 50,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ],
      "scenario_pnl": {
        "risk_off": -25050,
        "squeeze": 28950
      },
      "worst_case_pnl": -25050,
      "self_check": {
        "min_reduction_met": true,
        "margin_ok": true,
        "lowest_cost_feasible": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Portfolio risk / rebalancing",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "risk_budget_rebalance",
        "feasibility_trap": false,
        "objective_function": "objective for risk_budget_rebalance",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost",
          "scenario_pnl.risk_off",
          "scenario_pnl.squeeze",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 2,
        "beta_reduction_usd": 507500,
        "beta_reduction_pct": 46.14,
        "margin_used": 26000,
        "expected_cost": 50,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ],
        "scenario_pnl": {
          "risk_off": -25050,
          "squeeze": 28950
        },
        "worst_case_pnl": -25050,
        "self_check": {
          "min_reduction_met": true,
          "margin_ok": true,
          "lowest_cost_feasible": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-020",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-020",
    "prompt": "Frozen market snapshot:\n- Covered call on XLK ETF: long 100 shares at 215.00, short 1 215 call.\n- Call quote: 1.40 USD/share; option multiplier 100 shares. Intrinsic = max(0, spot - strike).\n- Ordinary cash dividend 0.50/share with ex-dividend tomorrow. Early assignment of an American call is rational for the holder when the dividend exceeds the call's remaining time value.\nCandidate routes (decide which is required by the assignment economics):\n- Route A (route_a): roll/close the short call before ex-dividend to avoid early assignment\n- Route B (route_b): hold the covered call through ex-dividend unchanged\n\nFrozen scenario PnL before action:\n- rate_shock: -125000 USD.\n- vol_spike: 48000 USD.\n- credit_widening: -79000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: rate_shock +1500, vol_spike -500, credit_widening +1000 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nCompute the call's time value, compare to the dividend, decide the early-assignment risk, and select the route. Report rejected routes by route id.\n\nObjective:\nremove early-assignment/dividend risk when and only when it is economically rational.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"call_strike\", \"dividend_per_share\", \"call_time_value\", \"early_assignment_risk\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "manage_assignment",
      "selected_route": "route_b",
      "instrument": "XLK",
      "call_strike": 215,
      "dividend_per_share": 0.5,
      "call_time_value": 1.4,
      "early_assignment_risk": false,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_a"
      ],
      "scenario_pnl": {
        "rate_shock": -123500,
        "vol_spike": 47500,
        "credit_widening": -78000
      },
      "worst_case_pnl": -123500,
      "self_check": {
        "compared_dividend_to_time_value": true,
        "assignment_handled": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "AGI",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "covered_call_assignment",
        "feasibility_trap": true,
        "objective_function": "objective for covered_call_assignment",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "call_strike",
          "dividend_per_share",
          "call_time_value",
          "early_assignment_risk",
          "scenario_pnl.rate_shock",
          "scenario_pnl.vol_spike",
          "scenario_pnl.credit_widening",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "manage_assignment",
        "selected_route": "route_b",
        "instrument": "XLK",
        "call_strike": 215,
        "dividend_per_share": 0.5,
        "call_time_value": 1.4,
        "early_assignment_risk": false,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_a"
        ],
        "scenario_pnl": {
          "rate_shock": -123500,
          "vol_spike": 47500,
          "credit_widening": -78000
        },
        "worst_case_pnl": -123500,
        "self_check": {
          "compared_dividend_to_time_value": true,
          "assignment_handled": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-021",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-021",
    "prompt": "Frozen market snapshot:\n- Position: long 6 CL near-month futures. This is a futures roll calendar ahead of first notice; use executable bid/ask, not mid.\n- First notice day is tomorrow; account policy forbids holding physically deliverable CL long into first notice.\n- Only the displayed bid/ask is executable; mid prices are indicative and not executable.\nCandidate routes (decide feasibility yourself):\n- Route A (route_a): roll by selling near at bid 81.00 and buying next at ask 81.75; CL multiplier 1000 barrels; fee 4 USD/contract/leg\n- Route B (route_b): roll using the near/next mid prices instead of bid/ask\n- Route C (route_c): hold the long near-month position into first notice day\n\nFrozen scenario PnL before action:\n- gap_down: -130000 USD.\n- melt_up: 52000 USD.\n- range_chop: -70000 USD.\n- sector_rotation: -62000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: gap_down +3000, melt_up -1000, range_chop +2000, sector_rotation +2500 USD. Apply this effect to each scenario, then subtract the 4548 USD cash cost from every scenario.\n\nTask:\nRoll the position and compute total executable cost. Report rejected routes by route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"contracts\", \"roll_cost_usd\", \"fees_usd\", \"total_cost_usd\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "roll",
      "selected_route": "route_a",
      "contracts": 6,
      "roll_cost_usd": 4500,
      "fees_usd": 48,
      "total_cost_usd": 4548,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "gap_down": -131548,
        "melt_up": 46452,
        "range_chop": -72548,
        "sector_rotation": -64048
      },
      "worst_case_pnl": -131548,
      "self_check": {
        "uses_executable_prices": true,
        "avoids_first_notice": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "futures_roll_calendar",
        "feasibility_trap": false,
        "objective_function": "objective for futures_roll_calendar",
        "deterministic_grading_fields": [
          "selected_route",
          "contracts",
          "roll_cost_usd",
          "fees_usd",
          "total_cost_usd",
          "scenario_pnl.gap_down",
          "scenario_pnl.melt_up",
          "scenario_pnl.range_chop",
          "scenario_pnl.sector_rotation",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "roll",
        "selected_route": "route_a",
        "contracts": 6,
        "roll_cost_usd": 4500,
        "fees_usd": 48,
        "total_cost_usd": 4548,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "gap_down": -131548,
          "melt_up": 46452,
          "range_chop": -72548,
          "sector_rotation": -64048
        },
        "worst_case_pnl": -131548,
        "self_check": {
          "uses_executable_prices": true,
          "avoids_first_notice": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-022",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-022",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is a VaR/liquidity triage; only listed futures liquidity is usable.\n- Portfolio equity beta-dollar exposure: 800000 USD.\n- Required reduction: at least 40% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 33000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 257500 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 2 ES futures (beta hedge), ES at 5150.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 1 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 19000 USD premium that reduces beta-dollars by 515000 USD\n- Route D (route_d): short 5 ES futures, same specs as Route A\n\nFrozen scenario PnL before action:\n- risk_off: -135000 USD.\n- squeeze: 56000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: risk_off +95000, squeeze -15000 USD. Apply this effect to each scenario, then subtract the 50 USD cash cost from every scenario.\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 2,
      "beta_reduction_usd": 515000,
      "beta_reduction_pct": 64.38,
      "margin_used": 26000,
      "expected_cost": 50,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ],
      "scenario_pnl": {
        "risk_off": -40050,
        "squeeze": 40950
      },
      "worst_case_pnl": -40050,
      "self_check": {
        "min_reduction_met": true,
        "margin_ok": true,
        "lowest_cost_feasible": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Portfolio risk / rebalancing",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "cross_asset_var_liquidity_triage",
        "feasibility_trap": false,
        "objective_function": "objective for cross_asset_var_liquidity_triage",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost",
          "scenario_pnl.risk_off",
          "scenario_pnl.squeeze",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 2,
        "beta_reduction_usd": 515000,
        "beta_reduction_pct": 64.38,
        "margin_used": 26000,
        "expected_cost": 50,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ],
        "scenario_pnl": {
          "risk_off": -40050,
          "squeeze": 40950
        },
        "worst_case_pnl": -40050,
        "self_check": {
          "min_reduction_met": true,
          "margin_ok": true,
          "lowest_cost_feasible": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-023",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-023",
    "prompt": "Frozen market snapshot:\n- You hold 1 long ITM SPY ETF call, strike 190, spot 200.00.\n- Call quote 12.00/share; intrinsic = spot - strike = 10.00; remaining time value = quote - intrinsic = 2.00.\n- Ordinary dividend 2.60/share, ex-dividend tomorrow. Early exercise/assignment of an American call is rational only when the dividend exceeds the remaining time value.\nCandidate routes (decide from the exercise economics; do not assume a route):\n- Route A (route_a): exercise the long call early to capture the 2.60/share dividend (you forfeit remaining time value)\n- Route B (route_b): sell the long call at its 12.00 quote and keep the time value\n- Route C (route_c): roll the call to the next expiry\n\nFrozen scenario PnL before action:\n- rate_shock: -140000 USD.\n- vol_spike: 40000 USD.\n- credit_widening: -76000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: rate_shock +1200, vol_spike -400, credit_widening +900 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nCompare the dividend to the time value, decide whether to exercise early, and select the route. Report rejected routes by route id.\n\nObjective:\nresolve the exercise/assignment decision at the highest economic value.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"dividend_per_share\", \"call_time_value\", \"exercise_early\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "exercise_decision",
      "selected_route": "route_a",
      "instrument": "SPY",
      "dividend_per_share": 2.6,
      "call_time_value": 2,
      "exercise_early": true,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "rate_shock": -138800,
        "vol_spike": 39600,
        "credit_widening": -75100
      },
      "worst_case_pnl": -138800,
      "self_check": {
        "compared_dividend_to_time_value": true,
        "exercise_or_assignment_resolved": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "AGI",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "exercise_assignment_roll_decision",
        "feasibility_trap": false,
        "objective_function": "objective for exercise_assignment_roll_decision",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "dividend_per_share",
          "call_time_value",
          "exercise_early",
          "scenario_pnl.rate_shock",
          "scenario_pnl.vol_spike",
          "scenario_pnl.credit_widening",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "exercise_decision",
        "selected_route": "route_a",
        "instrument": "SPY",
        "dividend_per_share": 2.6,
        "call_time_value": 2,
        "exercise_early": true,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "rate_shock": -138800,
          "vol_spike": 39600,
          "credit_widening": -75100
        },
        "worst_case_pnl": -138800,
        "self_check": {
          "compared_dividend_to_time_value": true,
          "exercise_or_assignment_resolved": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-024",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-024",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is an index-futures beta hedge of the cash equity book using ES futures.\n- Portfolio equity beta-dollar exposure: 900000 USD.\n- Required reduction: at least 50% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 33000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 260000 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 2 ES futures (beta hedge), ES at 5200.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 1 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 21000 USD premium that reduces beta-dollars by 520000 USD\n- Route D (route_d): short 5 ES futures, same specs as Route A\n\nFrozen scenario PnL before action:\n- gap_down: -145000 USD.\n- melt_up: 44000 USD.\n- range_chop: -79000 USD.\n- sector_rotation: -62000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: gap_down +95000, melt_up -15000, range_chop +60000, sector_rotation +77500 USD. Apply this effect to each scenario, then subtract the 50 USD cash cost from every scenario.\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 2,
      "beta_reduction_usd": 520000,
      "beta_reduction_pct": 57.78,
      "margin_used": 26000,
      "expected_cost": 50,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ],
      "scenario_pnl": {
        "gap_down": -50050,
        "melt_up": 28950,
        "range_chop": -19050,
        "sector_rotation": 15450
      },
      "worst_case_pnl": -50050,
      "self_check": {
        "min_reduction_met": true,
        "margin_ok": true,
        "lowest_cost_feasible": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "futures_beta_hedge",
        "feasibility_trap": true,
        "objective_function": "objective for futures_beta_hedge",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost",
          "scenario_pnl.gap_down",
          "scenario_pnl.melt_up",
          "scenario_pnl.range_chop",
          "scenario_pnl.sector_rotation",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 2,
        "beta_reduction_usd": 520000,
        "beta_reduction_pct": 57.78,
        "margin_used": 26000,
        "expected_cost": 50,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ],
        "scenario_pnl": {
          "gap_down": -50050,
          "melt_up": 28950,
          "range_chop": -19050,
          "sector_rotation": 15450
        },
        "worst_case_pnl": -50050,
        "self_check": {
          "min_reduction_met": true,
          "margin_ok": true,
          "lowest_cost_feasible": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-025",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-025",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is a drawdown hedge across the equity book; minimize hedge cost.\n- Portfolio equity beta-dollar exposure: 950000 USD.\n- Required reduction: at least 40% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 33000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 261250 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 2 ES futures (beta hedge), ES at 5225.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 1 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 18000 USD premium that reduces beta-dollars by 522500 USD\n- Route D (route_d): short 5 ES futures, same specs as Route A\n\nFrozen scenario PnL before action:\n- risk_off: -120000 USD.\n- squeeze: 48000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: risk_off +95000, squeeze -15000 USD. Apply this effect to each scenario, then subtract the 50 USD cash cost from every scenario.\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 2,
      "beta_reduction_usd": 522500,
      "beta_reduction_pct": 55,
      "margin_used": 26000,
      "expected_cost": 50,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ],
      "scenario_pnl": {
        "risk_off": -25050,
        "squeeze": 32950
      },
      "worst_case_pnl": -25050,
      "self_check": {
        "min_reduction_met": true,
        "margin_ok": true,
        "lowest_cost_feasible": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Portfolio risk / rebalancing",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "multi_asset_drawdown_hedge",
        "feasibility_trap": false,
        "objective_function": "objective for multi_asset_drawdown_hedge",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost",
          "scenario_pnl.risk_off",
          "scenario_pnl.squeeze",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 2,
        "beta_reduction_usd": 522500,
        "beta_reduction_pct": 55,
        "margin_used": 26000,
        "expected_cost": 50,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ],
        "scenario_pnl": {
          "risk_off": -25050,
          "squeeze": 32950
        },
        "worst_case_pnl": -25050,
        "self_check": {
          "min_reduction_met": true,
          "margin_ok": true,
          "lowest_cost_feasible": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-026",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-026",
    "prompt": "Frozen market snapshot:\n- Covered call on AAPL common stock: long 100 shares at 205.00, short 1 205 call.\n- Call quote: 0.80 USD/share; option multiplier 100 shares. Intrinsic = max(0, spot - strike).\n- Ordinary cash dividend 0.50/share with ex-dividend tomorrow. Early assignment of an American call is rational for the holder when the dividend exceeds the call's remaining time value.\nCandidate routes (decide which is required by the assignment economics):\n- Route A (route_a): roll/close the short call before ex-dividend to avoid early assignment\n- Route B (route_b): hold the covered call through ex-dividend unchanged\n\nFrozen scenario PnL before action:\n- rate_shock: -125000 USD.\n- vol_spike: 52000 USD.\n- credit_widening: -73000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: rate_shock +1500, vol_spike -500, credit_widening +1000 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nCompute the call's time value, compare to the dividend, decide the early-assignment risk, and select the route. Report rejected routes by route id.\n\nObjective:\nremove early-assignment/dividend risk when and only when it is economically rational.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"call_strike\", \"dividend_per_share\", \"call_time_value\", \"early_assignment_risk\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "manage_assignment",
      "selected_route": "route_b",
      "instrument": "AAPL",
      "call_strike": 205,
      "dividend_per_share": 0.5,
      "call_time_value": 0.8,
      "early_assignment_risk": false,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_a"
      ],
      "scenario_pnl": {
        "rate_shock": -123500,
        "vol_spike": 51500,
        "credit_widening": -72000
      },
      "worst_case_pnl": -123500,
      "self_check": {
        "compared_dividend_to_time_value": true,
        "assignment_handled": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "AGI",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "early_assignment_dividend_risk",
        "feasibility_trap": false,
        "objective_function": "objective for early_assignment_dividend_risk",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "call_strike",
          "dividend_per_share",
          "call_time_value",
          "early_assignment_risk",
          "scenario_pnl.rate_shock",
          "scenario_pnl.vol_spike",
          "scenario_pnl.credit_widening",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "manage_assignment",
        "selected_route": "route_b",
        "instrument": "AAPL",
        "call_strike": 205,
        "dividend_per_share": 0.5,
        "call_time_value": 0.8,
        "early_assignment_risk": false,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_a"
        ],
        "scenario_pnl": {
          "rate_shock": -123500,
          "vol_spike": 51500,
          "credit_widening": -72000
        },
        "worst_case_pnl": -123500,
        "self_check": {
          "compared_dividend_to_time_value": true,
          "assignment_handled": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-027",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-027",
    "prompt": "Frozen market snapshot:\n- Account: futures account using the simplified SPAN margin figures in this packet.\n- Objective: add crude-oil carry exposure with SPAN margin_used <= 12000 USD.\nCandidate routes (decide feasibility yourself from the SPAN margin figures):\n- Route A (route_a): long 5 CL June / short 5 CL July calendar spread, expected carry 1500 USD, SPAN margin 10500 USD\n- Route B (route_b): long 3 outright CL contracts, expected carry 2100 USD, SPAN margin 24000 USD\n- Route C (route_c): stay flat, expected carry 0 USD, SPAN margin 0 USD\n\nFrozen scenario PnL before action:\n- gap_down: -130000 USD.\n- melt_up: 56000 USD.\n- range_chop: -76000 USD.\n- sector_rotation: -62000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: gap_down +8000, melt_up -2000, range_chop +5000, sector_rotation +6500 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nSelect the feasible strategy with the highest expected carry under the SPAN margin cap. Report rejected routes by route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"spread_count\", \"expected_carry_usd\", \"margin_used\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "spread_count": 5,
      "expected_carry_usd": 1500,
      "margin_used": 10500,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "gap_down": -122000,
        "melt_up": 54000,
        "range_chop": -71000,
        "sector_rotation": -55500
      },
      "worst_case_pnl": -122000,
      "self_check": {
        "span_margin_within_limit": true,
        "highest_feasible_carry_selected": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "span_margin_calendar_spread",
        "feasibility_trap": false,
        "objective_function": "objective for span_margin_calendar_spread",
        "deterministic_grading_fields": [
          "selected_route",
          "spread_count",
          "expected_carry_usd",
          "margin_used",
          "scenario_pnl.gap_down",
          "scenario_pnl.melt_up",
          "scenario_pnl.range_chop",
          "scenario_pnl.sector_rotation",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "spread_count": 5,
        "expected_carry_usd": 1500,
        "margin_used": 10500,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "gap_down": -122000,
          "melt_up": 54000,
          "range_chop": -71000,
          "sector_rotation": -55500
        },
        "worst_case_pnl": -122000,
        "self_check": {
          "span_margin_within_limit": true,
          "highest_feasible_carry_selected": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-028",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-028",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is a beta-dollar rebalance against the stated beta target.\n- Portfolio equity beta-dollar exposure: 1100000 USD.\n- Required reduction: at least 40% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 33000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 251250 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 2 ES futures (beta hedge), ES at 5025.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 1 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 21000 USD premium that reduces beta-dollars by 502500 USD\n- Route D (route_d): short 5 ES futures, same specs as Route A\n\nFrozen scenario PnL before action:\n- risk_off: -135000 USD.\n- squeeze: 40000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: risk_off +95000, squeeze -15000 USD. Apply this effect to each scenario, then subtract the 50 USD cash cost from every scenario.\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 2,
      "beta_reduction_usd": 502500,
      "beta_reduction_pct": 45.68,
      "margin_used": 26000,
      "expected_cost": 50,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ],
      "scenario_pnl": {
        "risk_off": -40050,
        "squeeze": 24950
      },
      "worst_case_pnl": -40050,
      "self_check": {
        "min_reduction_met": true,
        "margin_ok": true,
        "lowest_cost_feasible": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Portfolio risk / rebalancing",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "beta_dollar_rebalance",
        "feasibility_trap": true,
        "objective_function": "objective for beta_dollar_rebalance",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost",
          "scenario_pnl.risk_off",
          "scenario_pnl.squeeze",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 2,
        "beta_reduction_usd": 502500,
        "beta_reduction_pct": 45.68,
        "margin_used": 26000,
        "expected_cost": 50,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ],
        "scenario_pnl": {
          "risk_off": -40050,
          "squeeze": 24950
        },
        "worst_case_pnl": -40050,
        "self_check": {
          "min_reduction_met": true,
          "margin_ok": true,
          "lowest_cost_feasible": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-029",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-029",
    "prompt": "Frozen market snapshot:\n- Account: US margin account. Borrow rate is 8.00% APR; weigh borrow cost against edge.\n- Instrument: TSLA common stock at 160.00. Desired bearish target: short 1000 shares of exposure.\n- Locate availability: exactly 800 shares. Option cash available: 3200 USD. Put delta -0.35 means 35 delta-shares per contract.\nCandidate routes (decide feasibility from the locate and cash limits yourself):\n- Route A (route_a): short exactly the 800 located shares and buy 4 listed puts (delta -0.35, premium 8.00 USD/share, multiplier 100) within 3200 USD option cash\n- Route B (route_b): short the full 1000-share target (requires shares beyond the locate)\n- Route C (route_c): buy 8 listed puts (premium 8.00 USD/share, multiplier 100), ignoring the option cash limit\n\nFrozen scenario PnL before action:\n- rate_shock: -140000 USD.\n- vol_spike: 44000 USD.\n- credit_widening: -70000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: rate_shock +12000, vol_spike -20000, credit_widening +9000 USD. Apply this effect to each scenario, then subtract the 3200 USD cash cost from every scenario.\n\nTask:\nChoose the feasible bearish implementation that maximizes bearish delta-shares without breaching the locate or option cash. Report rejected routes by route id.\n\nObjective:\nmaximize bearish delta-shares subject to locate and option-cash constraints.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"short_shares\", \"put_contracts\", \"premium_paid\", \"bearish_delta_shares\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "TSLA",
      "short_shares": 800,
      "put_contracts": 4,
      "premium_paid": 3200,
      "bearish_delta_shares": 940,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "rate_shock": -131200,
        "vol_spike": 20800,
        "credit_widening": -64200
      },
      "worst_case_pnl": -131200,
      "self_check": {
        "within_locate": true,
        "within_option_cash": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Shorting / borrow / margin / locates",
        "tier": "AGI",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "borrow_cost_vs_trade_edge",
        "feasibility_trap": true,
        "objective_function": "objective for borrow_cost_vs_trade_edge",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "short_shares",
          "put_contracts",
          "premium_paid",
          "bearish_delta_shares",
          "scenario_pnl.rate_shock",
          "scenario_pnl.vol_spike",
          "scenario_pnl.credit_widening",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "TSLA",
        "short_shares": 800,
        "put_contracts": 4,
        "premium_paid": 3200,
        "bearish_delta_shares": 940,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "rate_shock": -131200,
          "vol_spike": 20800,
          "credit_widening": -64200
        },
        "worst_case_pnl": -131200,
        "self_check": {
          "within_locate": true,
          "within_option_cash": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-030",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-030",
    "prompt": "Frozen market snapshot:\n- Covered call on XLK ETF: long 100 shares at 185.00, short 1 190 call.\n- Call quote: 0.80 USD/share; option multiplier 100 shares. Intrinsic = max(0, spot - strike).\n- Ordinary cash dividend 1.30/share with ex-dividend tomorrow. Early assignment of an American call is rational for the holder when the dividend exceeds the call's remaining time value.\nCandidate routes (decide which is required by the assignment economics):\n- Route A (route_a): roll/close the short call before ex-dividend to avoid early assignment\n- Route B (route_b): hold the covered call through ex-dividend unchanged\n\nFrozen scenario PnL before action:\n- gap_down: -145000 USD.\n- melt_up: 48000 USD.\n- range_chop: -73000 USD.\n- sector_rotation: -62000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: gap_down +1500, melt_up -500, range_chop +1000, sector_rotation +1250 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nCompute the call's time value, compare to the dividend, decide the early-assignment risk, and select the route. Report rejected routes by route id.\n\nObjective:\nremove early-assignment/dividend risk when and only when it is economically rational.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"call_strike\", \"dividend_per_share\", \"call_time_value\", \"early_assignment_risk\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "manage_assignment",
      "selected_route": "route_b",
      "instrument": "XLK",
      "call_strike": 190,
      "dividend_per_share": 1.3,
      "call_time_value": 0.8,
      "early_assignment_risk": false,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_a"
      ],
      "scenario_pnl": {
        "gap_down": -143500,
        "melt_up": 47500,
        "range_chop": -72000,
        "sector_rotation": -60750
      },
      "worst_case_pnl": -143500,
      "self_check": {
        "compared_dividend_to_time_value": true,
        "assignment_handled": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "early_assignment_dividend_risk",
        "feasibility_trap": false,
        "objective_function": "objective for early_assignment_dividend_risk",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "call_strike",
          "dividend_per_share",
          "call_time_value",
          "early_assignment_risk",
          "scenario_pnl.gap_down",
          "scenario_pnl.melt_up",
          "scenario_pnl.range_chop",
          "scenario_pnl.sector_rotation",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "manage_assignment",
        "selected_route": "route_b",
        "instrument": "XLK",
        "call_strike": 190,
        "dividend_per_share": 1.3,
        "call_time_value": 0.8,
        "early_assignment_risk": false,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_a"
        ],
        "scenario_pnl": {
          "gap_down": -143500,
          "melt_up": 47500,
          "range_chop": -72000,
          "sector_rotation": -60750
        },
        "worst_case_pnl": -143500,
        "self_check": {
          "compared_dividend_to_time_value": true,
          "assignment_handled": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-031",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-031",
    "prompt": "Frozen market snapshot:\n- Account: futures account using the simplified SPAN margin figures in this packet.\n- Objective: add crude-oil carry exposure with SPAN margin_used <= 11500 USD.\nCandidate routes (decide feasibility yourself from the SPAN margin figures):\n- Route A (route_a): long 3 CL June / short 3 CL July calendar spread, expected carry 1000 USD, SPAN margin 10000 USD\n- Route B (route_b): long 1 outright CL contracts, expected carry 1400 USD, SPAN margin 24000 USD\n- Route C (route_c): stay flat, expected carry 0 USD, SPAN margin 0 USD\n\nFrozen scenario PnL before action:\n- risk_off: -120000 USD.\n- squeeze: 52000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: risk_off +8000, squeeze -2000 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nSelect the feasible strategy with the highest expected carry under the SPAN margin cap. Report rejected routes by route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"spread_count\", \"expected_carry_usd\", \"margin_used\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "spread_count": 3,
      "expected_carry_usd": 1000,
      "margin_used": 10000,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "risk_off": -112000,
        "squeeze": 50000
      },
      "worst_case_pnl": -112000,
      "self_check": {
        "span_margin_within_limit": true,
        "highest_feasible_carry_selected": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "span_margin_calendar_spread",
        "feasibility_trap": false,
        "objective_function": "objective for span_margin_calendar_spread",
        "deterministic_grading_fields": [
          "selected_route",
          "spread_count",
          "expected_carry_usd",
          "margin_used",
          "scenario_pnl.risk_off",
          "scenario_pnl.squeeze",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "spread_count": 3,
        "expected_carry_usd": 1000,
        "margin_used": 10000,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "risk_off": -112000,
          "squeeze": 50000
        },
        "worst_case_pnl": -112000,
        "self_check": {
          "span_margin_within_limit": true,
          "highest_feasible_carry_selected": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-032",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-032",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is a beta-dollar rebalance against the stated beta target.\n- Portfolio equity beta-dollar exposure: 850000 USD.\n- Required reduction: at least 45% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 33000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 256250 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 2 ES futures (beta hedge), ES at 5125.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 1 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 21000 USD premium that reduces beta-dollars by 512500 USD\n- Route D (route_d): short 5 ES futures, same specs as Route A\n\nFrozen scenario PnL before action:\n- rate_shock: -125000 USD.\n- vol_spike: 56000 USD.\n- credit_widening: -79000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: rate_shock +95000, vol_spike -15000, credit_widening +60000 USD. Apply this effect to each scenario, then subtract the 50 USD cash cost from every scenario.\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 2,
      "beta_reduction_usd": 512500,
      "beta_reduction_pct": 60.29,
      "margin_used": 26000,
      "expected_cost": 50,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ],
      "scenario_pnl": {
        "rate_shock": -30050,
        "vol_spike": 40950,
        "credit_widening": -19050
      },
      "worst_case_pnl": -30050,
      "self_check": {
        "min_reduction_met": true,
        "margin_ok": true,
        "lowest_cost_feasible": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Portfolio risk / rebalancing",
        "tier": "AGI",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "beta_dollar_rebalance",
        "feasibility_trap": true,
        "objective_function": "objective for beta_dollar_rebalance",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost",
          "scenario_pnl.rate_shock",
          "scenario_pnl.vol_spike",
          "scenario_pnl.credit_widening",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 2,
        "beta_reduction_usd": 512500,
        "beta_reduction_pct": 60.29,
        "margin_used": 26000,
        "expected_cost": 50,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ],
        "scenario_pnl": {
          "rate_shock": -30050,
          "vol_spike": 40950,
          "credit_widening": -19050
        },
        "worst_case_pnl": -30050,
        "self_check": {
          "min_reduction_met": true,
          "margin_ok": true,
          "lowest_cost_feasible": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-033",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-033",
    "prompt": "Frozen market snapshot:\n- Account: US margin account. Borrow rate is 6.00% APR; weigh borrow cost against edge.\n- Instrument: SPY ETF at 200.00. Desired bearish target: short 1000 shares of exposure.\n- Locate availability: exactly 500 shares. Option cash available: 1600 USD. Put delta -0.35 means 35 delta-shares per contract.\nCandidate routes (decide feasibility from the locate and cash limits yourself):\n- Route A (route_a): short exactly the 500 located shares and buy 2 listed puts (delta -0.35, premium 8.00 USD/share, multiplier 100) within 1600 USD option cash\n- Route B (route_b): short the full 1000-share target (requires shares beyond the locate)\n- Route C (route_c): buy 6 listed puts (premium 8.00 USD/share, multiplier 100), ignoring the option cash limit\n\nFrozen scenario PnL before action:\n- gap_down: -130000 USD.\n- melt_up: 40000 USD.\n- range_chop: -70000 USD.\n- sector_rotation: -62000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: gap_down +12000, melt_up -20000, range_chop +9000, sector_rotation +10500 USD. Apply this effect to each scenario, then subtract the 1600 USD cash cost from every scenario.\n\nTask:\nChoose the feasible bearish implementation that maximizes bearish delta-shares without breaching the locate or option cash. Report rejected routes by route id.\n\nObjective:\nmaximize bearish delta-shares subject to locate and option-cash constraints.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"short_shares\", \"put_contracts\", \"premium_paid\", \"bearish_delta_shares\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "SPY",
      "short_shares": 500,
      "put_contracts": 2,
      "premium_paid": 1600,
      "bearish_delta_shares": 570,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "gap_down": -119600,
        "melt_up": 18400,
        "range_chop": -62600,
        "sector_rotation": -53100
      },
      "worst_case_pnl": -119600,
      "self_check": {
        "within_locate": true,
        "within_option_cash": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Shorting / borrow / margin / locates",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "borrow_cost_vs_trade_edge",
        "feasibility_trap": true,
        "objective_function": "objective for borrow_cost_vs_trade_edge",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "short_shares",
          "put_contracts",
          "premium_paid",
          "bearish_delta_shares",
          "scenario_pnl.gap_down",
          "scenario_pnl.melt_up",
          "scenario_pnl.range_chop",
          "scenario_pnl.sector_rotation",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "SPY",
        "short_shares": 500,
        "put_contracts": 2,
        "premium_paid": 1600,
        "bearish_delta_shares": 570,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "gap_down": -119600,
          "melt_up": 18400,
          "range_chop": -62600,
          "sector_rotation": -53100
        },
        "worst_case_pnl": -119600,
        "self_check": {
          "within_locate": true,
          "within_option_cash": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-034",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-034",
    "prompt": "Frozen market snapshot:\n- Covered call on QQQ ETF: long 100 shares at 205.00, short 1 200 call.\n- Call quote: 5.80 USD/share; option multiplier 100 shares. Intrinsic = max(0, spot - strike).\n- Ordinary cash dividend 0.90/share with ex-dividend tomorrow. Early assignment of an American call is rational for the holder when the dividend exceeds the call's remaining time value.\nCandidate routes (decide which is required by the assignment economics):\n- Route A (route_a): roll/close the short call before ex-dividend to avoid early assignment\n- Route B (route_b): hold the covered call through ex-dividend unchanged\n\nFrozen scenario PnL before action:\n- risk_off: -135000 USD.\n- squeeze: 44000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: risk_off +1500, squeeze -500 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nCompute the call's time value, compare to the dividend, decide the early-assignment risk, and select the route. Report rejected routes by route id.\n\nObjective:\nremove early-assignment/dividend risk when and only when it is economically rational.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"call_strike\", \"dividend_per_share\", \"call_time_value\", \"early_assignment_risk\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "manage_assignment",
      "selected_route": "route_a",
      "instrument": "QQQ",
      "call_strike": 200,
      "dividend_per_share": 0.9,
      "call_time_value": 0.8,
      "early_assignment_risk": true,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ],
      "scenario_pnl": {
        "risk_off": -133500,
        "squeeze": 43500
      },
      "worst_case_pnl": -133500,
      "self_check": {
        "compared_dividend_to_time_value": true,
        "assignment_handled": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "early_assignment_dividend_risk",
        "feasibility_trap": false,
        "objective_function": "objective for early_assignment_dividend_risk",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "call_strike",
          "dividend_per_share",
          "call_time_value",
          "early_assignment_risk",
          "scenario_pnl.risk_off",
          "scenario_pnl.squeeze",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "manage_assignment",
        "selected_route": "route_a",
        "instrument": "QQQ",
        "call_strike": 200,
        "dividend_per_share": 0.9,
        "call_time_value": 0.8,
        "early_assignment_risk": true,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ],
        "scenario_pnl": {
          "risk_off": -133500,
          "squeeze": 43500
        },
        "worst_case_pnl": -133500,
        "self_check": {
          "compared_dividend_to_time_value": true,
          "assignment_handled": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-035",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-035",
    "prompt": "Frozen market snapshot:\n- Account: futures account using the simplified SPAN margin figures in this packet.\n- Objective: add crude-oil carry exposure with SPAN margin_used <= 11000 USD.\nCandidate routes (decide feasibility yourself from the SPAN margin figures):\n- Route A (route_a): long 7 CL June / short 7 CL July calendar spread, expected carry 1400 USD, SPAN margin 9500 USD\n- Route B (route_b): long 5 outright CL contracts, expected carry 1900 USD, SPAN margin 24000 USD\n- Route C (route_c): stay flat, expected carry 0 USD, SPAN margin 0 USD\n\nFrozen scenario PnL before action:\n- rate_shock: -140000 USD.\n- vol_spike: 48000 USD.\n- credit_widening: -76000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: rate_shock +8000, vol_spike -2000, credit_widening +5000 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nSelect the feasible strategy with the highest expected carry under the SPAN margin cap. Report rejected routes by route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"spread_count\", \"expected_carry_usd\", \"margin_used\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "spread_count": 7,
      "expected_carry_usd": 1400,
      "margin_used": 9500,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "rate_shock": -132000,
        "vol_spike": 46000,
        "credit_widening": -71000
      },
      "worst_case_pnl": -132000,
      "self_check": {
        "span_margin_within_limit": true,
        "highest_feasible_carry_selected": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "AGI",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "span_margin_calendar_spread",
        "feasibility_trap": false,
        "objective_function": "objective for span_margin_calendar_spread",
        "deterministic_grading_fields": [
          "selected_route",
          "spread_count",
          "expected_carry_usd",
          "margin_used",
          "scenario_pnl.rate_shock",
          "scenario_pnl.vol_spike",
          "scenario_pnl.credit_widening",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "spread_count": 7,
        "expected_carry_usd": 1400,
        "margin_used": 9500,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "rate_shock": -132000,
          "vol_spike": 46000,
          "credit_widening": -71000
        },
        "worst_case_pnl": -132000,
        "self_check": {
          "span_margin_within_limit": true,
          "highest_feasible_carry_selected": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-036",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-036",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is a beta-dollar rebalance against the stated beta target.\n- Portfolio equity beta-dollar exposure: 1050000 USD.\n- Required reduction: at least 50% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 46000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 261250 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 3 ES futures (beta hedge), ES at 5225.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 2 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 21000 USD premium that reduces beta-dollars by 783750 USD\n- Route D (route_d): short 6 ES futures, same specs as Route A\n\nFrozen scenario PnL before action:\n- gap_down: -145000 USD.\n- melt_up: 52000 USD.\n- range_chop: -79000 USD.\n- sector_rotation: -62000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: gap_down +95000, melt_up -15000, range_chop +60000, sector_rotation +77500 USD. Apply this effect to each scenario, then subtract the 75 USD cash cost from every scenario.\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 3,
      "beta_reduction_usd": 783750,
      "beta_reduction_pct": 74.64,
      "margin_used": 39000,
      "expected_cost": 75,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ],
      "scenario_pnl": {
        "gap_down": -50075,
        "melt_up": 36925,
        "range_chop": -19075,
        "sector_rotation": 15425
      },
      "worst_case_pnl": -50075,
      "self_check": {
        "min_reduction_met": true,
        "margin_ok": true,
        "lowest_cost_feasible": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Portfolio risk / rebalancing",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "beta_dollar_rebalance",
        "feasibility_trap": true,
        "objective_function": "objective for beta_dollar_rebalance",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost",
          "scenario_pnl.gap_down",
          "scenario_pnl.melt_up",
          "scenario_pnl.range_chop",
          "scenario_pnl.sector_rotation",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 3,
        "beta_reduction_usd": 783750,
        "beta_reduction_pct": 74.64,
        "margin_used": 39000,
        "expected_cost": 75,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ],
        "scenario_pnl": {
          "gap_down": -50075,
          "melt_up": 36925,
          "range_chop": -19075,
          "sector_rotation": 15425
        },
        "worst_case_pnl": -50075,
        "self_check": {
          "min_reduction_met": true,
          "margin_ok": true,
          "lowest_cost_feasible": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-037",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-037",
    "prompt": "Frozen market snapshot:\n- Account: US margin account. Borrow rate is 4.00% APR; weigh borrow cost against edge.\n- Instrument: MSFT common stock at 120.00. Desired bearish target: short 1000 shares of exposure.\n- Locate availability: exactly 900 shares. Option cash available: 3200 USD. Put delta -0.35 means 35 delta-shares per contract.\nCandidate routes (decide feasibility from the locate and cash limits yourself):\n- Route A (route_a): short exactly the 900 located shares and buy 4 listed puts (delta -0.35, premium 8.00 USD/share, multiplier 100) within 3200 USD option cash\n- Route B (route_b): short the full 1000-share target (requires shares beyond the locate)\n- Route C (route_c): buy 8 listed puts (premium 8.00 USD/share, multiplier 100), ignoring the option cash limit\n\nFrozen scenario PnL before action:\n- risk_off: -120000 USD.\n- squeeze: 56000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: risk_off +12000, squeeze -20000 USD. Apply this effect to each scenario, then subtract the 3200 USD cash cost from every scenario.\n\nTask:\nChoose the feasible bearish implementation that maximizes bearish delta-shares without breaching the locate or option cash. Report rejected routes by route id.\n\nObjective:\nmaximize bearish delta-shares subject to locate and option-cash constraints.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"short_shares\", \"put_contracts\", \"premium_paid\", \"bearish_delta_shares\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "MSFT",
      "short_shares": 900,
      "put_contracts": 4,
      "premium_paid": 3200,
      "bearish_delta_shares": 1040,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "risk_off": -111200,
        "squeeze": 32800
      },
      "worst_case_pnl": -111200,
      "self_check": {
        "within_locate": true,
        "within_option_cash": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Shorting / borrow / margin / locates",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "borrow_cost_vs_trade_edge",
        "feasibility_trap": true,
        "objective_function": "objective for borrow_cost_vs_trade_edge",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "short_shares",
          "put_contracts",
          "premium_paid",
          "bearish_delta_shares",
          "scenario_pnl.risk_off",
          "scenario_pnl.squeeze",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "MSFT",
        "short_shares": 900,
        "put_contracts": 4,
        "premium_paid": 3200,
        "bearish_delta_shares": 1040,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "risk_off": -111200,
          "squeeze": 32800
        },
        "worst_case_pnl": -111200,
        "self_check": {
          "within_locate": true,
          "within_option_cash": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-038",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-038",
    "prompt": "Frozen market snapshot:\n- Covered call on NVDA common stock: long 100 shares at 185.00, short 1 185 call.\n- Call quote: 0.80 USD/share; option multiplier 100 shares. Intrinsic = max(0, spot - strike).\n- Ordinary cash dividend 0.50/share with ex-dividend tomorrow. Early assignment of an American call is rational for the holder when the dividend exceeds the call's remaining time value.\nCandidate routes (decide which is required by the assignment economics):\n- Route A (route_a): roll/close the short call before ex-dividend to avoid early assignment\n- Route B (route_b): hold the covered call through ex-dividend unchanged\n\nFrozen scenario PnL before action:\n- rate_shock: -125000 USD.\n- vol_spike: 40000 USD.\n- credit_widening: -73000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: rate_shock +1500, vol_spike -500, credit_widening +1000 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nCompute the call's time value, compare to the dividend, decide the early-assignment risk, and select the route. Report rejected routes by route id.\n\nObjective:\nremove early-assignment/dividend risk when and only when it is economically rational.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"call_strike\", \"dividend_per_share\", \"call_time_value\", \"early_assignment_risk\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "manage_assignment",
      "selected_route": "route_b",
      "instrument": "NVDA",
      "call_strike": 185,
      "dividend_per_share": 0.5,
      "call_time_value": 0.8,
      "early_assignment_risk": false,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_a"
      ],
      "scenario_pnl": {
        "rate_shock": -123500,
        "vol_spike": 39500,
        "credit_widening": -72000
      },
      "worst_case_pnl": -123500,
      "self_check": {
        "compared_dividend_to_time_value": true,
        "assignment_handled": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "AGI",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "early_assignment_dividend_risk",
        "feasibility_trap": false,
        "objective_function": "objective for early_assignment_dividend_risk",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "call_strike",
          "dividend_per_share",
          "call_time_value",
          "early_assignment_risk",
          "scenario_pnl.rate_shock",
          "scenario_pnl.vol_spike",
          "scenario_pnl.credit_widening",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "manage_assignment",
        "selected_route": "route_b",
        "instrument": "NVDA",
        "call_strike": 185,
        "dividend_per_share": 0.5,
        "call_time_value": 0.8,
        "early_assignment_risk": false,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_a"
        ],
        "scenario_pnl": {
          "rate_shock": -123500,
          "vol_spike": 39500,
          "credit_widening": -72000
        },
        "worst_case_pnl": -123500,
        "self_check": {
          "compared_dividend_to_time_value": true,
          "assignment_handled": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-039",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-039",
    "prompt": "Frozen market snapshot:\n- Account: futures account using the simplified SPAN margin figures in this packet.\n- Objective: add crude-oil carry exposure with SPAN margin_used <= 10500 USD.\nCandidate routes (decide feasibility yourself from the SPAN margin figures):\n- Route A (route_a): long 5 CL June / short 5 CL July calendar spread, expected carry 1800 USD, SPAN margin 9000 USD\n- Route B (route_b): long 3 outright CL contracts, expected carry 2400 USD, SPAN margin 24000 USD\n- Route C (route_c): stay flat, expected carry 0 USD, SPAN margin 0 USD\n\nFrozen scenario PnL before action:\n- gap_down: -130000 USD.\n- melt_up: 44000 USD.\n- range_chop: -76000 USD.\n- sector_rotation: -62000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: gap_down +8000, melt_up -2000, range_chop +5000, sector_rotation +6500 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nSelect the feasible strategy with the highest expected carry under the SPAN margin cap. Report rejected routes by route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"spread_count\", \"expected_carry_usd\", \"margin_used\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "spread_count": 5,
      "expected_carry_usd": 1800,
      "margin_used": 9000,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "gap_down": -122000,
        "melt_up": 42000,
        "range_chop": -71000,
        "sector_rotation": -55500
      },
      "worst_case_pnl": -122000,
      "self_check": {
        "span_margin_within_limit": true,
        "highest_feasible_carry_selected": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "span_margin_calendar_spread",
        "feasibility_trap": false,
        "objective_function": "objective for span_margin_calendar_spread",
        "deterministic_grading_fields": [
          "selected_route",
          "spread_count",
          "expected_carry_usd",
          "margin_used",
          "scenario_pnl.gap_down",
          "scenario_pnl.melt_up",
          "scenario_pnl.range_chop",
          "scenario_pnl.sector_rotation",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "spread_count": 5,
        "expected_carry_usd": 1800,
        "margin_used": 9000,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "gap_down": -122000,
          "melt_up": 42000,
          "range_chop": -71000,
          "sector_rotation": -55500
        },
        "worst_case_pnl": -122000,
        "self_check": {
          "span_margin_within_limit": true,
          "highest_feasible_carry_selected": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-040",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-040",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is a beta-dollar rebalance against the stated beta target.\n- Portfolio equity beta-dollar exposure: 800000 USD.\n- Required reduction: at least 40% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 33000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 252500 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 2 ES futures (beta hedge), ES at 5050.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 1 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 21000 USD premium that reduces beta-dollars by 505000 USD\n- Route D (route_d): short 5 ES futures, same specs as Route A\n\nFrozen scenario PnL before action:\n- risk_off: -135000 USD.\n- squeeze: 48000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: risk_off +95000, squeeze -15000 USD. Apply this effect to each scenario, then subtract the 50 USD cash cost from every scenario.\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 2,
      "beta_reduction_usd": 505000,
      "beta_reduction_pct": 63.13,
      "margin_used": 26000,
      "expected_cost": 50,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ],
      "scenario_pnl": {
        "risk_off": -40050,
        "squeeze": 32950
      },
      "worst_case_pnl": -40050,
      "self_check": {
        "min_reduction_met": true,
        "margin_ok": true,
        "lowest_cost_feasible": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Portfolio risk / rebalancing",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "beta_dollar_rebalance",
        "feasibility_trap": true,
        "objective_function": "objective for beta_dollar_rebalance",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost",
          "scenario_pnl.risk_off",
          "scenario_pnl.squeeze",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 2,
        "beta_reduction_usd": 505000,
        "beta_reduction_pct": 63.13,
        "margin_used": 26000,
        "expected_cost": 50,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ],
        "scenario_pnl": {
          "risk_off": -40050,
          "squeeze": 32950
        },
        "worst_case_pnl": -40050,
        "self_check": {
          "min_reduction_met": true,
          "margin_ok": true,
          "lowest_cost_feasible": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-041",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-041",
    "prompt": "Frozen market snapshot:\n- Account: US margin account. Borrow rate is 8.00% APR; weigh borrow cost against edge.\n- Instrument: XLF ETF at 160.00. Desired bearish target: short 1000 shares of exposure.\n- Locate availability: exactly 600 shares. Option cash available: 2400 USD. Put delta -0.35 means 35 delta-shares per contract.\nCandidate routes (decide feasibility from the locate and cash limits yourself):\n- Route A (route_a): short exactly the 600 located shares and buy 3 listed puts (delta -0.35, premium 8.00 USD/share, multiplier 100) within 2400 USD option cash\n- Route B (route_b): short the full 1000-share target (requires shares beyond the locate)\n- Route C (route_c): buy 7 listed puts (premium 8.00 USD/share, multiplier 100), ignoring the option cash limit\n\nFrozen scenario PnL before action:\n- rate_shock: -140000 USD.\n- vol_spike: 52000 USD.\n- credit_widening: -70000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: rate_shock +12000, vol_spike -20000, credit_widening +9000 USD. Apply this effect to each scenario, then subtract the 2400 USD cash cost from every scenario.\n\nTask:\nChoose the feasible bearish implementation that maximizes bearish delta-shares without breaching the locate or option cash. Report rejected routes by route id.\n\nObjective:\nmaximize bearish delta-shares subject to locate and option-cash constraints.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"short_shares\", \"put_contracts\", \"premium_paid\", \"bearish_delta_shares\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "XLF",
      "short_shares": 600,
      "put_contracts": 3,
      "premium_paid": 2400,
      "bearish_delta_shares": 705,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "rate_shock": -130400,
        "vol_spike": 29600,
        "credit_widening": -63400
      },
      "worst_case_pnl": -130400,
      "self_check": {
        "within_locate": true,
        "within_option_cash": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Shorting / borrow / margin / locates",
        "tier": "AGI",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "borrow_cost_vs_trade_edge",
        "feasibility_trap": true,
        "objective_function": "objective for borrow_cost_vs_trade_edge",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "short_shares",
          "put_contracts",
          "premium_paid",
          "bearish_delta_shares",
          "scenario_pnl.rate_shock",
          "scenario_pnl.vol_spike",
          "scenario_pnl.credit_widening",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "XLF",
        "short_shares": 600,
        "put_contracts": 3,
        "premium_paid": 2400,
        "bearish_delta_shares": 705,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "rate_shock": -130400,
          "vol_spike": 29600,
          "credit_widening": -63400
        },
        "worst_case_pnl": -130400,
        "self_check": {
          "within_locate": true,
          "within_option_cash": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-042",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-042",
    "prompt": "Frozen market snapshot:\n- Covered call on GLD ETF: long 100 shares at 205.00, short 1 210 call.\n- Call quote: 0.80 USD/share; option multiplier 100 shares. Intrinsic = max(0, spot - strike).\n- Ordinary cash dividend 1.30/share with ex-dividend tomorrow. Early assignment of an American call is rational for the holder when the dividend exceeds the call's remaining time value.\nCandidate routes (decide which is required by the assignment economics):\n- Route A (route_a): roll/close the short call before ex-dividend to avoid early assignment\n- Route B (route_b): hold the covered call through ex-dividend unchanged\n\nFrozen scenario PnL before action:\n- gap_down: -145000 USD.\n- melt_up: 56000 USD.\n- range_chop: -73000 USD.\n- sector_rotation: -62000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: gap_down +1500, melt_up -500, range_chop +1000, sector_rotation +1250 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nCompute the call's time value, compare to the dividend, decide the early-assignment risk, and select the route. Report rejected routes by route id.\n\nObjective:\nremove early-assignment/dividend risk when and only when it is economically rational.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"call_strike\", \"dividend_per_share\", \"call_time_value\", \"early_assignment_risk\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "manage_assignment",
      "selected_route": "route_b",
      "instrument": "GLD",
      "call_strike": 210,
      "dividend_per_share": 1.3,
      "call_time_value": 0.8,
      "early_assignment_risk": false,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_a"
      ],
      "scenario_pnl": {
        "gap_down": -143500,
        "melt_up": 55500,
        "range_chop": -72000,
        "sector_rotation": -60750
      },
      "worst_case_pnl": -143500,
      "self_check": {
        "compared_dividend_to_time_value": true,
        "assignment_handled": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "early_assignment_dividend_risk",
        "feasibility_trap": false,
        "objective_function": "objective for early_assignment_dividend_risk",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "call_strike",
          "dividend_per_share",
          "call_time_value",
          "early_assignment_risk",
          "scenario_pnl.gap_down",
          "scenario_pnl.melt_up",
          "scenario_pnl.range_chop",
          "scenario_pnl.sector_rotation",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "manage_assignment",
        "selected_route": "route_b",
        "instrument": "GLD",
        "call_strike": 210,
        "dividend_per_share": 1.3,
        "call_time_value": 0.8,
        "early_assignment_risk": false,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_a"
        ],
        "scenario_pnl": {
          "gap_down": -143500,
          "melt_up": 55500,
          "range_chop": -72000,
          "sector_rotation": -60750
        },
        "worst_case_pnl": -143500,
        "self_check": {
          "compared_dividend_to_time_value": true,
          "assignment_handled": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-043",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-043",
    "prompt": "Frozen market snapshot:\n- Account: futures account using the simplified SPAN margin figures in this packet.\n- Objective: add crude-oil carry exposure with SPAN margin_used <= 10000 USD.\nCandidate routes (decide feasibility yourself from the SPAN margin figures):\n- Route A (route_a): long 3 CL June / short 3 CL July calendar spread, expected carry 1300 USD, SPAN margin 8500 USD\n- Route B (route_b): long 1 outright CL contracts, expected carry 1700 USD, SPAN margin 24000 USD\n- Route C (route_c): stay flat, expected carry 0 USD, SPAN margin 0 USD\n\nFrozen scenario PnL before action:\n- risk_off: -120000 USD.\n- squeeze: 40000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: risk_off +8000, squeeze -2000 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nSelect the feasible strategy with the highest expected carry under the SPAN margin cap. Report rejected routes by route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"spread_count\", \"expected_carry_usd\", \"margin_used\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "spread_count": 3,
      "expected_carry_usd": 1300,
      "margin_used": 8500,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "risk_off": -112000,
        "squeeze": 38000
      },
      "worst_case_pnl": -112000,
      "self_check": {
        "span_margin_within_limit": true,
        "highest_feasible_carry_selected": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "span_margin_calendar_spread",
        "feasibility_trap": false,
        "objective_function": "objective for span_margin_calendar_spread",
        "deterministic_grading_fields": [
          "selected_route",
          "spread_count",
          "expected_carry_usd",
          "margin_used",
          "scenario_pnl.risk_off",
          "scenario_pnl.squeeze",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "spread_count": 3,
        "expected_carry_usd": 1300,
        "margin_used": 8500,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "risk_off": -112000,
          "squeeze": 38000
        },
        "worst_case_pnl": -112000,
        "self_check": {
          "span_margin_within_limit": true,
          "highest_feasible_carry_selected": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-044",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-044",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is a beta-dollar rebalance against the stated beta target.\n- Portfolio equity beta-dollar exposure: 1000000 USD.\n- Required reduction: at least 45% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 33000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 257500 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 2 ES futures (beta hedge), ES at 5150.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 1 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 21000 USD premium that reduces beta-dollars by 515000 USD\n- Route D (route_d): short 5 ES futures, same specs as Route A\n\nFrozen scenario PnL before action:\n- rate_shock: -125000 USD.\n- vol_spike: 44000 USD.\n- credit_widening: -79000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: rate_shock +95000, vol_spike -15000, credit_widening +60000 USD. Apply this effect to each scenario, then subtract the 50 USD cash cost from every scenario.\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 2,
      "beta_reduction_usd": 515000,
      "beta_reduction_pct": 51.5,
      "margin_used": 26000,
      "expected_cost": 50,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ],
      "scenario_pnl": {
        "rate_shock": -30050,
        "vol_spike": 28950,
        "credit_widening": -19050
      },
      "worst_case_pnl": -30050,
      "self_check": {
        "min_reduction_met": true,
        "margin_ok": true,
        "lowest_cost_feasible": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Portfolio risk / rebalancing",
        "tier": "AGI",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "beta_dollar_rebalance",
        "feasibility_trap": true,
        "objective_function": "objective for beta_dollar_rebalance",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost",
          "scenario_pnl.rate_shock",
          "scenario_pnl.vol_spike",
          "scenario_pnl.credit_widening",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 2,
        "beta_reduction_usd": 515000,
        "beta_reduction_pct": 51.5,
        "margin_used": 26000,
        "expected_cost": 50,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ],
        "scenario_pnl": {
          "rate_shock": -30050,
          "vol_spike": 28950,
          "credit_widening": -19050
        },
        "worst_case_pnl": -30050,
        "self_check": {
          "min_reduction_met": true,
          "margin_ok": true,
          "lowest_cost_feasible": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-045",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-045",
    "prompt": "Frozen market snapshot:\n- Account: US margin account. Borrow rate is 6.00% APR; weigh borrow cost against edge.\n- Instrument: IWM ETF at 200.00. Desired bearish target: short 1000 shares of exposure.\n- Locate availability: exactly 300 shares. Option cash available: 800 USD. Put delta -0.35 means 35 delta-shares per contract.\nCandidate routes (decide feasibility from the locate and cash limits yourself):\n- Route A (route_a): short exactly the 300 located shares and buy 1 listed puts (delta -0.35, premium 8.00 USD/share, multiplier 100) within 800 USD option cash\n- Route B (route_b): short the full 1000-share target (requires shares beyond the locate)\n- Route C (route_c): buy 5 listed puts (premium 8.00 USD/share, multiplier 100), ignoring the option cash limit\n\nFrozen scenario PnL before action:\n- gap_down: -130000 USD.\n- melt_up: 48000 USD.\n- range_chop: -70000 USD.\n- sector_rotation: -62000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: gap_down +12000, melt_up -20000, range_chop +9000, sector_rotation +10500 USD. Apply this effect to each scenario, then subtract the 800 USD cash cost from every scenario.\n\nTask:\nChoose the feasible bearish implementation that maximizes bearish delta-shares without breaching the locate or option cash. Report rejected routes by route id.\n\nObjective:\nmaximize bearish delta-shares subject to locate and option-cash constraints.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"short_shares\", \"put_contracts\", \"premium_paid\", \"bearish_delta_shares\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "IWM",
      "short_shares": 300,
      "put_contracts": 1,
      "premium_paid": 800,
      "bearish_delta_shares": 335,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "gap_down": -118800,
        "melt_up": 27200,
        "range_chop": -61800,
        "sector_rotation": -52300
      },
      "worst_case_pnl": -118800,
      "self_check": {
        "within_locate": true,
        "within_option_cash": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Shorting / borrow / margin / locates",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "borrow_cost_vs_trade_edge",
        "feasibility_trap": true,
        "objective_function": "objective for borrow_cost_vs_trade_edge",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "short_shares",
          "put_contracts",
          "premium_paid",
          "bearish_delta_shares",
          "scenario_pnl.gap_down",
          "scenario_pnl.melt_up",
          "scenario_pnl.range_chop",
          "scenario_pnl.sector_rotation",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "IWM",
        "short_shares": 300,
        "put_contracts": 1,
        "premium_paid": 800,
        "bearish_delta_shares": 335,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "gap_down": -118800,
          "melt_up": 27200,
          "range_chop": -61800,
          "sector_rotation": -52300
        },
        "worst_case_pnl": -118800,
        "self_check": {
          "within_locate": true,
          "within_option_cash": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-046",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-046",
    "prompt": "Frozen market snapshot:\n- Covered call on AAPL common stock: long 100 shares at 185.00, short 1 180 call.\n- Call quote: 5.80 USD/share; option multiplier 100 shares. Intrinsic = max(0, spot - strike).\n- Ordinary cash dividend 0.90/share with ex-dividend tomorrow. Early assignment of an American call is rational for the holder when the dividend exceeds the call's remaining time value.\nCandidate routes (decide which is required by the assignment economics):\n- Route A (route_a): roll/close the short call before ex-dividend to avoid early assignment\n- Route B (route_b): hold the covered call through ex-dividend unchanged\n\nFrozen scenario PnL before action:\n- risk_off: -135000 USD.\n- squeeze: 52000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: risk_off +1500, squeeze -500 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nCompute the call's time value, compare to the dividend, decide the early-assignment risk, and select the route. Report rejected routes by route id.\n\nObjective:\nremove early-assignment/dividend risk when and only when it is economically rational.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"call_strike\", \"dividend_per_share\", \"call_time_value\", \"early_assignment_risk\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "manage_assignment",
      "selected_route": "route_a",
      "instrument": "AAPL",
      "call_strike": 180,
      "dividend_per_share": 0.9,
      "call_time_value": 0.8,
      "early_assignment_risk": true,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ],
      "scenario_pnl": {
        "risk_off": -133500,
        "squeeze": 51500
      },
      "worst_case_pnl": -133500,
      "self_check": {
        "compared_dividend_to_time_value": true,
        "assignment_handled": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "early_assignment_dividend_risk",
        "feasibility_trap": false,
        "objective_function": "objective for early_assignment_dividend_risk",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "call_strike",
          "dividend_per_share",
          "call_time_value",
          "early_assignment_risk",
          "scenario_pnl.risk_off",
          "scenario_pnl.squeeze",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "manage_assignment",
        "selected_route": "route_a",
        "instrument": "AAPL",
        "call_strike": 180,
        "dividend_per_share": 0.9,
        "call_time_value": 0.8,
        "early_assignment_risk": true,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ],
        "scenario_pnl": {
          "risk_off": -133500,
          "squeeze": 51500
        },
        "worst_case_pnl": -133500,
        "self_check": {
          "compared_dividend_to_time_value": true,
          "assignment_handled": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-047",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-047",
    "prompt": "Frozen market snapshot:\n- Account: futures account using the simplified SPAN margin figures in this packet.\n- Objective: add crude-oil carry exposure with SPAN margin_used <= 12000 USD.\nCandidate routes (decide feasibility yourself from the SPAN margin figures):\n- Route A (route_a): long 7 CL June / short 7 CL July calendar spread, expected carry 1700 USD, SPAN margin 10500 USD\n- Route B (route_b): long 5 outright CL contracts, expected carry 2200 USD, SPAN margin 24000 USD\n- Route C (route_c): stay flat, expected carry 0 USD, SPAN margin 0 USD\n\nFrozen scenario PnL before action:\n- rate_shock: -140000 USD.\n- vol_spike: 56000 USD.\n- credit_widening: -76000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: rate_shock +8000, vol_spike -2000, credit_widening +5000 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nSelect the feasible strategy with the highest expected carry under the SPAN margin cap. Report rejected routes by route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"spread_count\", \"expected_carry_usd\", \"margin_used\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "spread_count": 7,
      "expected_carry_usd": 1700,
      "margin_used": 10500,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "rate_shock": -132000,
        "vol_spike": 54000,
        "credit_widening": -71000
      },
      "worst_case_pnl": -132000,
      "self_check": {
        "span_margin_within_limit": true,
        "highest_feasible_carry_selected": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "AGI",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "span_margin_calendar_spread",
        "feasibility_trap": false,
        "objective_function": "objective for span_margin_calendar_spread",
        "deterministic_grading_fields": [
          "selected_route",
          "spread_count",
          "expected_carry_usd",
          "margin_used",
          "scenario_pnl.rate_shock",
          "scenario_pnl.vol_spike",
          "scenario_pnl.credit_widening",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "spread_count": 7,
        "expected_carry_usd": 1700,
        "margin_used": 10500,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "rate_shock": -132000,
          "vol_spike": 54000,
          "credit_widening": -71000
        },
        "worst_case_pnl": -132000,
        "self_check": {
          "span_margin_within_limit": true,
          "highest_feasible_carry_selected": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-048",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-048",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is a beta-dollar rebalance against the stated beta target.\n- Portfolio equity beta-dollar exposure: 1200000 USD.\n- Required reduction: at least 50% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 46000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 262500 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 3 ES futures (beta hedge), ES at 5250.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 2 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 21000 USD premium that reduces beta-dollars by 787500 USD\n- Route D (route_d): short 6 ES futures, same specs as Route A\n\nFrozen scenario PnL before action:\n- gap_down: -145000 USD.\n- melt_up: 40000 USD.\n- range_chop: -79000 USD.\n- sector_rotation: -62000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: gap_down +95000, melt_up -15000, range_chop +60000, sector_rotation +77500 USD. Apply this effect to each scenario, then subtract the 75 USD cash cost from every scenario.\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 3,
      "beta_reduction_usd": 787500,
      "beta_reduction_pct": 65.63,
      "margin_used": 39000,
      "expected_cost": 75,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ],
      "scenario_pnl": {
        "gap_down": -50075,
        "melt_up": 24925,
        "range_chop": -19075,
        "sector_rotation": 15425
      },
      "worst_case_pnl": -50075,
      "self_check": {
        "min_reduction_met": true,
        "margin_ok": true,
        "lowest_cost_feasible": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Portfolio risk / rebalancing",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "beta_dollar_rebalance",
        "feasibility_trap": true,
        "objective_function": "objective for beta_dollar_rebalance",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost",
          "scenario_pnl.gap_down",
          "scenario_pnl.melt_up",
          "scenario_pnl.range_chop",
          "scenario_pnl.sector_rotation",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 3,
        "beta_reduction_usd": 787500,
        "beta_reduction_pct": 65.63,
        "margin_used": 39000,
        "expected_cost": 75,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ],
        "scenario_pnl": {
          "gap_down": -50075,
          "melt_up": 24925,
          "range_chop": -19075,
          "sector_rotation": 15425
        },
        "worst_case_pnl": -50075,
        "self_check": {
          "min_reduction_met": true,
          "margin_ok": true,
          "lowest_cost_feasible": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-049",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-049",
    "prompt": "Frozen market snapshot:\n- Account: US margin account. Borrow rate is 4.00% APR; weigh borrow cost against edge.\n- Instrument: TSLA common stock at 120.00. Desired bearish target: short 1000 shares of exposure.\n- Locate availability: exactly 700 shares. Option cash available: 2400 USD. Put delta -0.35 means 35 delta-shares per contract.\nCandidate routes (decide feasibility from the locate and cash limits yourself):\n- Route A (route_a): short exactly the 700 located shares and buy 3 listed puts (delta -0.35, premium 8.00 USD/share, multiplier 100) within 2400 USD option cash\n- Route B (route_b): short the full 1000-share target (requires shares beyond the locate)\n- Route C (route_c): buy 7 listed puts (premium 8.00 USD/share, multiplier 100), ignoring the option cash limit\n\nFrozen scenario PnL before action:\n- risk_off: -120000 USD.\n- squeeze: 44000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: risk_off +12000, squeeze -20000 USD. Apply this effect to each scenario, then subtract the 2400 USD cash cost from every scenario.\n\nTask:\nChoose the feasible bearish implementation that maximizes bearish delta-shares without breaching the locate or option cash. Report rejected routes by route id.\n\nObjective:\nmaximize bearish delta-shares subject to locate and option-cash constraints.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"short_shares\", \"put_contracts\", \"premium_paid\", \"bearish_delta_shares\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "TSLA",
      "short_shares": 700,
      "put_contracts": 3,
      "premium_paid": 2400,
      "bearish_delta_shares": 805,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "risk_off": -110400,
        "squeeze": 21600
      },
      "worst_case_pnl": -110400,
      "self_check": {
        "within_locate": true,
        "within_option_cash": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Shorting / borrow / margin / locates",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "borrow_cost_vs_trade_edge",
        "feasibility_trap": true,
        "objective_function": "objective for borrow_cost_vs_trade_edge",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "short_shares",
          "put_contracts",
          "premium_paid",
          "bearish_delta_shares",
          "scenario_pnl.risk_off",
          "scenario_pnl.squeeze",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "TSLA",
        "short_shares": 700,
        "put_contracts": 3,
        "premium_paid": 2400,
        "bearish_delta_shares": 805,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "risk_off": -110400,
          "squeeze": 21600
        },
        "worst_case_pnl": -110400,
        "self_check": {
          "within_locate": true,
          "within_option_cash": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-050",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-050",
    "prompt": "Frozen market snapshot:\n- Covered call on XLK ETF: long 100 shares at 205.00, short 1 205 call.\n- Call quote: 0.80 USD/share; option multiplier 100 shares. Intrinsic = max(0, spot - strike).\n- Ordinary cash dividend 0.50/share with ex-dividend tomorrow. Early assignment of an American call is rational for the holder when the dividend exceeds the call's remaining time value.\nCandidate routes (decide which is required by the assignment economics):\n- Route A (route_a): roll/close the short call before ex-dividend to avoid early assignment\n- Route B (route_b): hold the covered call through ex-dividend unchanged\n\nFrozen scenario PnL before action:\n- rate_shock: -125000 USD.\n- vol_spike: 48000 USD.\n- credit_widening: -73000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: rate_shock +1500, vol_spike -500, credit_widening +1000 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nCompute the call's time value, compare to the dividend, decide the early-assignment risk, and select the route. Report rejected routes by route id.\n\nObjective:\nremove early-assignment/dividend risk when and only when it is economically rational.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"call_strike\", \"dividend_per_share\", \"call_time_value\", \"early_assignment_risk\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "manage_assignment",
      "selected_route": "route_b",
      "instrument": "XLK",
      "call_strike": 205,
      "dividend_per_share": 0.5,
      "call_time_value": 0.8,
      "early_assignment_risk": false,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_a"
      ],
      "scenario_pnl": {
        "rate_shock": -123500,
        "vol_spike": 47500,
        "credit_widening": -72000
      },
      "worst_case_pnl": -123500,
      "self_check": {
        "compared_dividend_to_time_value": true,
        "assignment_handled": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "AGI",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "early_assignment_dividend_risk",
        "feasibility_trap": false,
        "objective_function": "objective for early_assignment_dividend_risk",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "call_strike",
          "dividend_per_share",
          "call_time_value",
          "early_assignment_risk",
          "scenario_pnl.rate_shock",
          "scenario_pnl.vol_spike",
          "scenario_pnl.credit_widening",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "manage_assignment",
        "selected_route": "route_b",
        "instrument": "XLK",
        "call_strike": 205,
        "dividend_per_share": 0.5,
        "call_time_value": 0.8,
        "early_assignment_risk": false,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_a"
        ],
        "scenario_pnl": {
          "rate_shock": -123500,
          "vol_spike": 47500,
          "credit_widening": -72000
        },
        "worst_case_pnl": -123500,
        "self_check": {
          "compared_dividend_to_time_value": true,
          "assignment_handled": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-051",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-051",
    "prompt": "Frozen market snapshot:\n- Account: futures account using the simplified SPAN margin figures in this packet.\n- Objective: add crude-oil carry exposure with SPAN margin_used <= 11500 USD.\nCandidate routes (decide feasibility yourself from the SPAN margin figures):\n- Route A (route_a): long 5 CL June / short 5 CL July calendar spread, expected carry 1200 USD, SPAN margin 10000 USD\n- Route B (route_b): long 3 outright CL contracts, expected carry 1800 USD, SPAN margin 24000 USD\n- Route C (route_c): stay flat, expected carry 0 USD, SPAN margin 0 USD\n\nFrozen scenario PnL before action:\n- gap_down: -130000 USD.\n- melt_up: 52000 USD.\n- range_chop: -76000 USD.\n- sector_rotation: -62000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: gap_down +8000, melt_up -2000, range_chop +5000, sector_rotation +6500 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nSelect the feasible strategy with the highest expected carry under the SPAN margin cap. Report rejected routes by route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"spread_count\", \"expected_carry_usd\", \"margin_used\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "spread_count": 5,
      "expected_carry_usd": 1200,
      "margin_used": 10000,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "gap_down": -122000,
        "melt_up": 50000,
        "range_chop": -71000,
        "sector_rotation": -55500
      },
      "worst_case_pnl": -122000,
      "self_check": {
        "span_margin_within_limit": true,
        "highest_feasible_carry_selected": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "span_margin_calendar_spread",
        "feasibility_trap": false,
        "objective_function": "objective for span_margin_calendar_spread",
        "deterministic_grading_fields": [
          "selected_route",
          "spread_count",
          "expected_carry_usd",
          "margin_used",
          "scenario_pnl.gap_down",
          "scenario_pnl.melt_up",
          "scenario_pnl.range_chop",
          "scenario_pnl.sector_rotation",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "spread_count": 5,
        "expected_carry_usd": 1200,
        "margin_used": 10000,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "gap_down": -122000,
          "melt_up": 50000,
          "range_chop": -71000,
          "sector_rotation": -55500
        },
        "worst_case_pnl": -122000,
        "self_check": {
          "span_margin_within_limit": true,
          "highest_feasible_carry_selected": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-052",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-052",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is a beta-dollar rebalance against the stated beta target.\n- Portfolio equity beta-dollar exposure: 950000 USD.\n- Required reduction: at least 40% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 33000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 253750 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 2 ES futures (beta hedge), ES at 5075.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 1 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 21000 USD premium that reduces beta-dollars by 507500 USD\n- Route D (route_d): short 5 ES futures, same specs as Route A\n\nFrozen scenario PnL before action:\n- risk_off: -135000 USD.\n- squeeze: 56000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: risk_off +95000, squeeze -15000 USD. Apply this effect to each scenario, then subtract the 50 USD cash cost from every scenario.\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 2,
      "beta_reduction_usd": 507500,
      "beta_reduction_pct": 53.42,
      "margin_used": 26000,
      "expected_cost": 50,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ],
      "scenario_pnl": {
        "risk_off": -40050,
        "squeeze": 40950
      },
      "worst_case_pnl": -40050,
      "self_check": {
        "min_reduction_met": true,
        "margin_ok": true,
        "lowest_cost_feasible": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Portfolio risk / rebalancing",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "beta_dollar_rebalance",
        "feasibility_trap": true,
        "objective_function": "objective for beta_dollar_rebalance",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost",
          "scenario_pnl.risk_off",
          "scenario_pnl.squeeze",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 2,
        "beta_reduction_usd": 507500,
        "beta_reduction_pct": 53.42,
        "margin_used": 26000,
        "expected_cost": 50,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ],
        "scenario_pnl": {
          "risk_off": -40050,
          "squeeze": 40950
        },
        "worst_case_pnl": -40050,
        "self_check": {
          "min_reduction_met": true,
          "margin_ok": true,
          "lowest_cost_feasible": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-053",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-053",
    "prompt": "Frozen market snapshot:\n- Account: US margin account. Borrow rate is 8.00% APR; weigh borrow cost against edge.\n- Instrument: SPY ETF at 160.00. Desired bearish target: short 1000 shares of exposure.\n- Locate availability: exactly 400 shares. Option cash available: 1600 USD. Put delta -0.35 means 35 delta-shares per contract.\nCandidate routes (decide feasibility from the locate and cash limits yourself):\n- Route A (route_a): short exactly the 400 located shares and buy 2 listed puts (delta -0.35, premium 8.00 USD/share, multiplier 100) within 1600 USD option cash\n- Route B (route_b): short the full 1000-share target (requires shares beyond the locate)\n- Route C (route_c): buy 6 listed puts (premium 8.00 USD/share, multiplier 100), ignoring the option cash limit\n\nFrozen scenario PnL before action:\n- rate_shock: -140000 USD.\n- vol_spike: 40000 USD.\n- credit_widening: -70000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: rate_shock +12000, vol_spike -20000, credit_widening +9000 USD. Apply this effect to each scenario, then subtract the 1600 USD cash cost from every scenario.\n\nTask:\nChoose the feasible bearish implementation that maximizes bearish delta-shares without breaching the locate or option cash. Report rejected routes by route id.\n\nObjective:\nmaximize bearish delta-shares subject to locate and option-cash constraints.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"short_shares\", \"put_contracts\", \"premium_paid\", \"bearish_delta_shares\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "SPY",
      "short_shares": 400,
      "put_contracts": 2,
      "premium_paid": 1600,
      "bearish_delta_shares": 470,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "rate_shock": -129600,
        "vol_spike": 18400,
        "credit_widening": -62600
      },
      "worst_case_pnl": -129600,
      "self_check": {
        "within_locate": true,
        "within_option_cash": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Shorting / borrow / margin / locates",
        "tier": "AGI",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "borrow_cost_vs_trade_edge",
        "feasibility_trap": true,
        "objective_function": "objective for borrow_cost_vs_trade_edge",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "short_shares",
          "put_contracts",
          "premium_paid",
          "bearish_delta_shares",
          "scenario_pnl.rate_shock",
          "scenario_pnl.vol_spike",
          "scenario_pnl.credit_widening",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "SPY",
        "short_shares": 400,
        "put_contracts": 2,
        "premium_paid": 1600,
        "bearish_delta_shares": 470,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "rate_shock": -129600,
          "vol_spike": 18400,
          "credit_widening": -62600
        },
        "worst_case_pnl": -129600,
        "self_check": {
          "within_locate": true,
          "within_option_cash": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-054",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-054",
    "prompt": "Frozen market snapshot:\n- Covered call on QQQ ETF: long 100 shares at 185.00, short 1 190 call.\n- Call quote: 0.80 USD/share; option multiplier 100 shares. Intrinsic = max(0, spot - strike).\n- Ordinary cash dividend 1.30/share with ex-dividend tomorrow. Early assignment of an American call is rational for the holder when the dividend exceeds the call's remaining time value.\nCandidate routes (decide which is required by the assignment economics):\n- Route A (route_a): roll/close the short call before ex-dividend to avoid early assignment\n- Route B (route_b): hold the covered call through ex-dividend unchanged\n\nFrozen scenario PnL before action:\n- gap_down: -145000 USD.\n- melt_up: 44000 USD.\n- range_chop: -73000 USD.\n- sector_rotation: -62000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: gap_down +1500, melt_up -500, range_chop +1000, sector_rotation +1250 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nCompute the call's time value, compare to the dividend, decide the early-assignment risk, and select the route. Report rejected routes by route id.\n\nObjective:\nremove early-assignment/dividend risk when and only when it is economically rational.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"call_strike\", \"dividend_per_share\", \"call_time_value\", \"early_assignment_risk\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "manage_assignment",
      "selected_route": "route_b",
      "instrument": "QQQ",
      "call_strike": 190,
      "dividend_per_share": 1.3,
      "call_time_value": 0.8,
      "early_assignment_risk": false,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_a"
      ],
      "scenario_pnl": {
        "gap_down": -143500,
        "melt_up": 43500,
        "range_chop": -72000,
        "sector_rotation": -60750
      },
      "worst_case_pnl": -143500,
      "self_check": {
        "compared_dividend_to_time_value": true,
        "assignment_handled": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "early_assignment_dividend_risk",
        "feasibility_trap": false,
        "objective_function": "objective for early_assignment_dividend_risk",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "call_strike",
          "dividend_per_share",
          "call_time_value",
          "early_assignment_risk",
          "scenario_pnl.gap_down",
          "scenario_pnl.melt_up",
          "scenario_pnl.range_chop",
          "scenario_pnl.sector_rotation",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "manage_assignment",
        "selected_route": "route_b",
        "instrument": "QQQ",
        "call_strike": 190,
        "dividend_per_share": 1.3,
        "call_time_value": 0.8,
        "early_assignment_risk": false,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_a"
        ],
        "scenario_pnl": {
          "gap_down": -143500,
          "melt_up": 43500,
          "range_chop": -72000,
          "sector_rotation": -60750
        },
        "worst_case_pnl": -143500,
        "self_check": {
          "compared_dividend_to_time_value": true,
          "assignment_handled": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-055",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-055",
    "prompt": "Frozen market snapshot:\n- Account: futures account using the simplified SPAN margin figures in this packet.\n- Objective: add crude-oil carry exposure with SPAN margin_used <= 11000 USD.\nCandidate routes (decide feasibility yourself from the SPAN margin figures):\n- Route A (route_a): long 3 CL June / short 3 CL July calendar spread, expected carry 1600 USD, SPAN margin 9500 USD\n- Route B (route_b): long 1 outright CL contracts, expected carry 2000 USD, SPAN margin 24000 USD\n- Route C (route_c): stay flat, expected carry 0 USD, SPAN margin 0 USD\n\nFrozen scenario PnL before action:\n- risk_off: -120000 USD.\n- squeeze: 48000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: risk_off +8000, squeeze -2000 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nSelect the feasible strategy with the highest expected carry under the SPAN margin cap. Report rejected routes by route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"spread_count\", \"expected_carry_usd\", \"margin_used\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "spread_count": 3,
      "expected_carry_usd": 1600,
      "margin_used": 9500,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "risk_off": -112000,
        "squeeze": 46000
      },
      "worst_case_pnl": -112000,
      "self_check": {
        "span_margin_within_limit": true,
        "highest_feasible_carry_selected": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "span_margin_calendar_spread",
        "feasibility_trap": false,
        "objective_function": "objective for span_margin_calendar_spread",
        "deterministic_grading_fields": [
          "selected_route",
          "spread_count",
          "expected_carry_usd",
          "margin_used",
          "scenario_pnl.risk_off",
          "scenario_pnl.squeeze",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "spread_count": 3,
        "expected_carry_usd": 1600,
        "margin_used": 9500,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "risk_off": -112000,
          "squeeze": 46000
        },
        "worst_case_pnl": -112000,
        "self_check": {
          "span_margin_within_limit": true,
          "highest_feasible_carry_selected": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-056",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-056",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is a beta-dollar rebalance against the stated beta target.\n- Portfolio equity beta-dollar exposure: 1150000 USD.\n- Required reduction: at least 45% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 33000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 258750 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 2 ES futures (beta hedge), ES at 5175.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 1 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 21000 USD premium that reduces beta-dollars by 517500 USD\n- Route D (route_d): short 5 ES futures, same specs as Route A\n\nFrozen scenario PnL before action:\n- rate_shock: -125000 USD.\n- vol_spike: 52000 USD.\n- credit_widening: -79000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: rate_shock +95000, vol_spike -15000, credit_widening +60000 USD. Apply this effect to each scenario, then subtract the 50 USD cash cost from every scenario.\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 2,
      "beta_reduction_usd": 517500,
      "beta_reduction_pct": 45,
      "margin_used": 26000,
      "expected_cost": 50,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ],
      "scenario_pnl": {
        "rate_shock": -30050,
        "vol_spike": 36950,
        "credit_widening": -19050
      },
      "worst_case_pnl": -30050,
      "self_check": {
        "min_reduction_met": true,
        "margin_ok": true,
        "lowest_cost_feasible": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Portfolio risk / rebalancing",
        "tier": "AGI",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "beta_dollar_rebalance",
        "feasibility_trap": true,
        "objective_function": "objective for beta_dollar_rebalance",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost",
          "scenario_pnl.rate_shock",
          "scenario_pnl.vol_spike",
          "scenario_pnl.credit_widening",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 2,
        "beta_reduction_usd": 517500,
        "beta_reduction_pct": 45,
        "margin_used": 26000,
        "expected_cost": 50,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ],
        "scenario_pnl": {
          "rate_shock": -30050,
          "vol_spike": 36950,
          "credit_widening": -19050
        },
        "worst_case_pnl": -30050,
        "self_check": {
          "min_reduction_met": true,
          "margin_ok": true,
          "lowest_cost_feasible": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-057",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-057",
    "prompt": "Frozen market snapshot:\n- Account: US margin account. Borrow rate is 6.00% APR; weigh borrow cost against edge.\n- Instrument: MSFT common stock at 200.00. Desired bearish target: short 1000 shares of exposure.\n- Locate availability: exactly 800 shares. Option cash available: 3200 USD. Put delta -0.35 means 35 delta-shares per contract.\nCandidate routes (decide feasibility from the locate and cash limits yourself):\n- Route A (route_a): short exactly the 800 located shares and buy 4 listed puts (delta -0.35, premium 8.00 USD/share, multiplier 100) within 3200 USD option cash\n- Route B (route_b): short the full 1000-share target (requires shares beyond the locate)\n- Route C (route_c): buy 8 listed puts (premium 8.00 USD/share, multiplier 100), ignoring the option cash limit\n\nFrozen scenario PnL before action:\n- gap_down: -130000 USD.\n- melt_up: 56000 USD.\n- range_chop: -70000 USD.\n- sector_rotation: -62000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: gap_down +12000, melt_up -20000, range_chop +9000, sector_rotation +10500 USD. Apply this effect to each scenario, then subtract the 3200 USD cash cost from every scenario.\n\nTask:\nChoose the feasible bearish implementation that maximizes bearish delta-shares without breaching the locate or option cash. Report rejected routes by route id.\n\nObjective:\nmaximize bearish delta-shares subject to locate and option-cash constraints.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"short_shares\", \"put_contracts\", \"premium_paid\", \"bearish_delta_shares\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "MSFT",
      "short_shares": 800,
      "put_contracts": 4,
      "premium_paid": 3200,
      "bearish_delta_shares": 940,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "gap_down": -121200,
        "melt_up": 32800,
        "range_chop": -64200,
        "sector_rotation": -54700
      },
      "worst_case_pnl": -121200,
      "self_check": {
        "within_locate": true,
        "within_option_cash": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Shorting / borrow / margin / locates",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "borrow_cost_vs_trade_edge",
        "feasibility_trap": true,
        "objective_function": "objective for borrow_cost_vs_trade_edge",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "short_shares",
          "put_contracts",
          "premium_paid",
          "bearish_delta_shares",
          "scenario_pnl.gap_down",
          "scenario_pnl.melt_up",
          "scenario_pnl.range_chop",
          "scenario_pnl.sector_rotation",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "MSFT",
        "short_shares": 800,
        "put_contracts": 4,
        "premium_paid": 3200,
        "bearish_delta_shares": 940,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "gap_down": -121200,
          "melt_up": 32800,
          "range_chop": -64200,
          "sector_rotation": -54700
        },
        "worst_case_pnl": -121200,
        "self_check": {
          "within_locate": true,
          "within_option_cash": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-058",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-058",
    "prompt": "Frozen market snapshot:\n- Covered call on NVDA common stock: long 100 shares at 205.00, short 1 200 call.\n- Call quote: 5.80 USD/share; option multiplier 100 shares. Intrinsic = max(0, spot - strike).\n- Ordinary cash dividend 0.90/share with ex-dividend tomorrow. Early assignment of an American call is rational for the holder when the dividend exceeds the call's remaining time value.\nCandidate routes (decide which is required by the assignment economics):\n- Route A (route_a): roll/close the short call before ex-dividend to avoid early assignment\n- Route B (route_b): hold the covered call through ex-dividend unchanged\n\nFrozen scenario PnL before action:\n- risk_off: -135000 USD.\n- squeeze: 40000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: risk_off +1500, squeeze -500 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nCompute the call's time value, compare to the dividend, decide the early-assignment risk, and select the route. Report rejected routes by route id.\n\nObjective:\nremove early-assignment/dividend risk when and only when it is economically rational.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"call_strike\", \"dividend_per_share\", \"call_time_value\", \"early_assignment_risk\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "manage_assignment",
      "selected_route": "route_a",
      "instrument": "NVDA",
      "call_strike": 200,
      "dividend_per_share": 0.9,
      "call_time_value": 0.8,
      "early_assignment_risk": true,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ],
      "scenario_pnl": {
        "risk_off": -133500,
        "squeeze": 39500
      },
      "worst_case_pnl": -133500,
      "self_check": {
        "compared_dividend_to_time_value": true,
        "assignment_handled": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "early_assignment_dividend_risk",
        "feasibility_trap": false,
        "objective_function": "objective for early_assignment_dividend_risk",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "call_strike",
          "dividend_per_share",
          "call_time_value",
          "early_assignment_risk",
          "scenario_pnl.risk_off",
          "scenario_pnl.squeeze",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "manage_assignment",
        "selected_route": "route_a",
        "instrument": "NVDA",
        "call_strike": 200,
        "dividend_per_share": 0.9,
        "call_time_value": 0.8,
        "early_assignment_risk": true,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ],
        "scenario_pnl": {
          "risk_off": -133500,
          "squeeze": 39500
        },
        "worst_case_pnl": -133500,
        "self_check": {
          "compared_dividend_to_time_value": true,
          "assignment_handled": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-059",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-059",
    "prompt": "Frozen market snapshot:\n- Account: futures account using the simplified SPAN margin figures in this packet.\n- Objective: add crude-oil carry exposure with SPAN margin_used <= 10500 USD.\nCandidate routes (decide feasibility yourself from the SPAN margin figures):\n- Route A (route_a): long 7 CL June / short 7 CL July calendar spread, expected carry 1100 USD, SPAN margin 9000 USD\n- Route B (route_b): long 5 outright CL contracts, expected carry 1600 USD, SPAN margin 24000 USD\n- Route C (route_c): stay flat, expected carry 0 USD, SPAN margin 0 USD\n\nFrozen scenario PnL before action:\n- rate_shock: -140000 USD.\n- vol_spike: 44000 USD.\n- credit_widening: -76000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: rate_shock +8000, vol_spike -2000, credit_widening +5000 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nSelect the feasible strategy with the highest expected carry under the SPAN margin cap. Report rejected routes by route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"spread_count\", \"expected_carry_usd\", \"margin_used\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "spread_count": 7,
      "expected_carry_usd": 1100,
      "margin_used": 9000,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "rate_shock": -132000,
        "vol_spike": 42000,
        "credit_widening": -71000
      },
      "worst_case_pnl": -132000,
      "self_check": {
        "span_margin_within_limit": true,
        "highest_feasible_carry_selected": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "AGI",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "span_margin_calendar_spread",
        "feasibility_trap": false,
        "objective_function": "objective for span_margin_calendar_spread",
        "deterministic_grading_fields": [
          "selected_route",
          "spread_count",
          "expected_carry_usd",
          "margin_used",
          "scenario_pnl.rate_shock",
          "scenario_pnl.vol_spike",
          "scenario_pnl.credit_widening",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "spread_count": 7,
        "expected_carry_usd": 1100,
        "margin_used": 9000,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "rate_shock": -132000,
          "vol_spike": 42000,
          "credit_widening": -71000
        },
        "worst_case_pnl": -132000,
        "self_check": {
          "span_margin_within_limit": true,
          "highest_feasible_carry_selected": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-060",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-060",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is a beta-dollar rebalance against the stated beta target.\n- Portfolio equity beta-dollar exposure: 900000 USD.\n- Required reduction: at least 50% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 33000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 250000 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 2 ES futures (beta hedge), ES at 5000.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 1 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 21000 USD premium that reduces beta-dollars by 500000 USD\n- Route D (route_d): short 5 ES futures, same specs as Route A\n\nFrozen scenario PnL before action:\n- gap_down: -145000 USD.\n- melt_up: 48000 USD.\n- range_chop: -79000 USD.\n- sector_rotation: -62000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: gap_down +95000, melt_up -15000, range_chop +60000, sector_rotation +77500 USD. Apply this effect to each scenario, then subtract the 50 USD cash cost from every scenario.\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 2,
      "beta_reduction_usd": 500000,
      "beta_reduction_pct": 55.56,
      "margin_used": 26000,
      "expected_cost": 50,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ],
      "scenario_pnl": {
        "gap_down": -50050,
        "melt_up": 32950,
        "range_chop": -19050,
        "sector_rotation": 15450
      },
      "worst_case_pnl": -50050,
      "self_check": {
        "min_reduction_met": true,
        "margin_ok": true,
        "lowest_cost_feasible": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Portfolio risk / rebalancing",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "beta_dollar_rebalance",
        "feasibility_trap": true,
        "objective_function": "objective for beta_dollar_rebalance",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost",
          "scenario_pnl.gap_down",
          "scenario_pnl.melt_up",
          "scenario_pnl.range_chop",
          "scenario_pnl.sector_rotation",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 2,
        "beta_reduction_usd": 500000,
        "beta_reduction_pct": 55.56,
        "margin_used": 26000,
        "expected_cost": 50,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ],
        "scenario_pnl": {
          "gap_down": -50050,
          "melt_up": 32950,
          "range_chop": -19050,
          "sector_rotation": 15450
        },
        "worst_case_pnl": -50050,
        "self_check": {
          "min_reduction_met": true,
          "margin_ok": true,
          "lowest_cost_feasible": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-061",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-061",
    "prompt": "Frozen market snapshot:\n- Account: US margin account. Borrow rate is 4.00% APR; weigh borrow cost against edge.\n- Instrument: XLF ETF at 120.00. Desired bearish target: short 1000 shares of exposure.\n- Locate availability: exactly 500 shares. Option cash available: 1600 USD. Put delta -0.35 means 35 delta-shares per contract.\nCandidate routes (decide feasibility from the locate and cash limits yourself):\n- Route A (route_a): short exactly the 500 located shares and buy 2 listed puts (delta -0.35, premium 8.00 USD/share, multiplier 100) within 1600 USD option cash\n- Route B (route_b): short the full 1000-share target (requires shares beyond the locate)\n- Route C (route_c): buy 6 listed puts (premium 8.00 USD/share, multiplier 100), ignoring the option cash limit\n\nFrozen scenario PnL before action:\n- risk_off: -120000 USD.\n- squeeze: 52000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: risk_off +12000, squeeze -20000 USD. Apply this effect to each scenario, then subtract the 1600 USD cash cost from every scenario.\n\nTask:\nChoose the feasible bearish implementation that maximizes bearish delta-shares without breaching the locate or option cash. Report rejected routes by route id.\n\nObjective:\nmaximize bearish delta-shares subject to locate and option-cash constraints.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"short_shares\", \"put_contracts\", \"premium_paid\", \"bearish_delta_shares\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "XLF",
      "short_shares": 500,
      "put_contracts": 2,
      "premium_paid": 1600,
      "bearish_delta_shares": 570,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "risk_off": -109600,
        "squeeze": 30400
      },
      "worst_case_pnl": -109600,
      "self_check": {
        "within_locate": true,
        "within_option_cash": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Shorting / borrow / margin / locates",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "borrow_cost_vs_trade_edge",
        "feasibility_trap": true,
        "objective_function": "objective for borrow_cost_vs_trade_edge",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "short_shares",
          "put_contracts",
          "premium_paid",
          "bearish_delta_shares",
          "scenario_pnl.risk_off",
          "scenario_pnl.squeeze",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "XLF",
        "short_shares": 500,
        "put_contracts": 2,
        "premium_paid": 1600,
        "bearish_delta_shares": 570,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "risk_off": -109600,
          "squeeze": 30400
        },
        "worst_case_pnl": -109600,
        "self_check": {
          "within_locate": true,
          "within_option_cash": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-062",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-062",
    "prompt": "Frozen market snapshot:\n- Covered call on GLD ETF: long 100 shares at 185.00, short 1 185 call.\n- Call quote: 0.80 USD/share; option multiplier 100 shares. Intrinsic = max(0, spot - strike).\n- Ordinary cash dividend 0.50/share with ex-dividend tomorrow. Early assignment of an American call is rational for the holder when the dividend exceeds the call's remaining time value.\nCandidate routes (decide which is required by the assignment economics):\n- Route A (route_a): roll/close the short call before ex-dividend to avoid early assignment\n- Route B (route_b): hold the covered call through ex-dividend unchanged\n\nFrozen scenario PnL before action:\n- rate_shock: -125000 USD.\n- vol_spike: 56000 USD.\n- credit_widening: -73000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: rate_shock +1500, vol_spike -500, credit_widening +1000 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nCompute the call's time value, compare to the dividend, decide the early-assignment risk, and select the route. Report rejected routes by route id.\n\nObjective:\nremove early-assignment/dividend risk when and only when it is economically rational.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"call_strike\", \"dividend_per_share\", \"call_time_value\", \"early_assignment_risk\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "manage_assignment",
      "selected_route": "route_b",
      "instrument": "GLD",
      "call_strike": 185,
      "dividend_per_share": 0.5,
      "call_time_value": 0.8,
      "early_assignment_risk": false,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_a"
      ],
      "scenario_pnl": {
        "rate_shock": -123500,
        "vol_spike": 55500,
        "credit_widening": -72000
      },
      "worst_case_pnl": -123500,
      "self_check": {
        "compared_dividend_to_time_value": true,
        "assignment_handled": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "AGI",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "early_assignment_dividend_risk",
        "feasibility_trap": false,
        "objective_function": "objective for early_assignment_dividend_risk",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "call_strike",
          "dividend_per_share",
          "call_time_value",
          "early_assignment_risk",
          "scenario_pnl.rate_shock",
          "scenario_pnl.vol_spike",
          "scenario_pnl.credit_widening",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "manage_assignment",
        "selected_route": "route_b",
        "instrument": "GLD",
        "call_strike": 185,
        "dividend_per_share": 0.5,
        "call_time_value": 0.8,
        "early_assignment_risk": false,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_a"
        ],
        "scenario_pnl": {
          "rate_shock": -123500,
          "vol_spike": 55500,
          "credit_widening": -72000
        },
        "worst_case_pnl": -123500,
        "self_check": {
          "compared_dividend_to_time_value": true,
          "assignment_handled": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-063",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-063",
    "prompt": "Frozen market snapshot:\n- Account: futures account using the simplified SPAN margin figures in this packet.\n- Objective: add crude-oil carry exposure with SPAN margin_used <= 10000 USD.\nCandidate routes (decide feasibility yourself from the SPAN margin figures):\n- Route A (route_a): long 5 CL June / short 5 CL July calendar spread, expected carry 1500 USD, SPAN margin 8500 USD\n- Route B (route_b): long 3 outright CL contracts, expected carry 2100 USD, SPAN margin 24000 USD\n- Route C (route_c): stay flat, expected carry 0 USD, SPAN margin 0 USD\n\nFrozen scenario PnL before action:\n- gap_down: -130000 USD.\n- melt_up: 40000 USD.\n- range_chop: -76000 USD.\n- sector_rotation: -62000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: gap_down +8000, melt_up -2000, range_chop +5000, sector_rotation +6500 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nSelect the feasible strategy with the highest expected carry under the SPAN margin cap. Report rejected routes by route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"spread_count\", \"expected_carry_usd\", \"margin_used\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "spread_count": 5,
      "expected_carry_usd": 1500,
      "margin_used": 8500,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "gap_down": -122000,
        "melt_up": 38000,
        "range_chop": -71000,
        "sector_rotation": -55500
      },
      "worst_case_pnl": -122000,
      "self_check": {
        "span_margin_within_limit": true,
        "highest_feasible_carry_selected": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "span_margin_calendar_spread",
        "feasibility_trap": false,
        "objective_function": "objective for span_margin_calendar_spread",
        "deterministic_grading_fields": [
          "selected_route",
          "spread_count",
          "expected_carry_usd",
          "margin_used",
          "scenario_pnl.gap_down",
          "scenario_pnl.melt_up",
          "scenario_pnl.range_chop",
          "scenario_pnl.sector_rotation",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "spread_count": 5,
        "expected_carry_usd": 1500,
        "margin_used": 8500,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "gap_down": -122000,
          "melt_up": 38000,
          "range_chop": -71000,
          "sector_rotation": -55500
        },
        "worst_case_pnl": -122000,
        "self_check": {
          "span_margin_within_limit": true,
          "highest_feasible_carry_selected": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-064",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-064",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is a beta-dollar rebalance against the stated beta target.\n- Portfolio equity beta-dollar exposure: 1100000 USD.\n- Required reduction: at least 40% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 33000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 255000 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 2 ES futures (beta hedge), ES at 5100.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 1 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 21000 USD premium that reduces beta-dollars by 510000 USD\n- Route D (route_d): short 5 ES futures, same specs as Route A\n\nFrozen scenario PnL before action:\n- risk_off: -135000 USD.\n- squeeze: 44000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: risk_off +95000, squeeze -15000 USD. Apply this effect to each scenario, then subtract the 50 USD cash cost from every scenario.\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 2,
      "beta_reduction_usd": 510000,
      "beta_reduction_pct": 46.36,
      "margin_used": 26000,
      "expected_cost": 50,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ],
      "scenario_pnl": {
        "risk_off": -40050,
        "squeeze": 28950
      },
      "worst_case_pnl": -40050,
      "self_check": {
        "min_reduction_met": true,
        "margin_ok": true,
        "lowest_cost_feasible": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Portfolio risk / rebalancing",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "beta_dollar_rebalance",
        "feasibility_trap": true,
        "objective_function": "objective for beta_dollar_rebalance",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost",
          "scenario_pnl.risk_off",
          "scenario_pnl.squeeze",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 2,
        "beta_reduction_usd": 510000,
        "beta_reduction_pct": 46.36,
        "margin_used": 26000,
        "expected_cost": 50,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ],
        "scenario_pnl": {
          "risk_off": -40050,
          "squeeze": 28950
        },
        "worst_case_pnl": -40050,
        "self_check": {
          "min_reduction_met": true,
          "margin_ok": true,
          "lowest_cost_feasible": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-065",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-065",
    "prompt": "Frozen market snapshot:\n- Account: US margin account. Borrow rate is 8.00% APR; weigh borrow cost against edge.\n- Instrument: IWM ETF at 160.00. Desired bearish target: short 1000 shares of exposure.\n- Locate availability: exactly 900 shares. Option cash available: 3200 USD. Put delta -0.35 means 35 delta-shares per contract.\nCandidate routes (decide feasibility from the locate and cash limits yourself):\n- Route A (route_a): short exactly the 900 located shares and buy 4 listed puts (delta -0.35, premium 8.00 USD/share, multiplier 100) within 3200 USD option cash\n- Route B (route_b): short the full 1000-share target (requires shares beyond the locate)\n- Route C (route_c): buy 8 listed puts (premium 8.00 USD/share, multiplier 100), ignoring the option cash limit\n\nFrozen scenario PnL before action:\n- rate_shock: -140000 USD.\n- vol_spike: 48000 USD.\n- credit_widening: -70000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: rate_shock +12000, vol_spike -20000, credit_widening +9000 USD. Apply this effect to each scenario, then subtract the 3200 USD cash cost from every scenario.\n\nTask:\nChoose the feasible bearish implementation that maximizes bearish delta-shares without breaching the locate or option cash. Report rejected routes by route id.\n\nObjective:\nmaximize bearish delta-shares subject to locate and option-cash constraints.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"short_shares\", \"put_contracts\", \"premium_paid\", \"bearish_delta_shares\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "IWM",
      "short_shares": 900,
      "put_contracts": 4,
      "premium_paid": 3200,
      "bearish_delta_shares": 1040,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "rate_shock": -131200,
        "vol_spike": 24800,
        "credit_widening": -64200
      },
      "worst_case_pnl": -131200,
      "self_check": {
        "within_locate": true,
        "within_option_cash": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Shorting / borrow / margin / locates",
        "tier": "AGI",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "borrow_cost_vs_trade_edge",
        "feasibility_trap": true,
        "objective_function": "objective for borrow_cost_vs_trade_edge",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "short_shares",
          "put_contracts",
          "premium_paid",
          "bearish_delta_shares",
          "scenario_pnl.rate_shock",
          "scenario_pnl.vol_spike",
          "scenario_pnl.credit_widening",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "IWM",
        "short_shares": 900,
        "put_contracts": 4,
        "premium_paid": 3200,
        "bearish_delta_shares": 1040,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "rate_shock": -131200,
          "vol_spike": 24800,
          "credit_widening": -64200
        },
        "worst_case_pnl": -131200,
        "self_check": {
          "within_locate": true,
          "within_option_cash": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-066",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-066",
    "prompt": "Frozen market snapshot:\n- Covered call on AAPL common stock: long 100 shares at 205.00, short 1 210 call.\n- Call quote: 0.80 USD/share; option multiplier 100 shares. Intrinsic = max(0, spot - strike).\n- Ordinary cash dividend 1.30/share with ex-dividend tomorrow. Early assignment of an American call is rational for the holder when the dividend exceeds the call's remaining time value.\nCandidate routes (decide which is required by the assignment economics):\n- Route A (route_a): roll/close the short call before ex-dividend to avoid early assignment\n- Route B (route_b): hold the covered call through ex-dividend unchanged\n\nFrozen scenario PnL before action:\n- gap_down: -145000 USD.\n- melt_up: 52000 USD.\n- range_chop: -73000 USD.\n- sector_rotation: -62000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: gap_down +1500, melt_up -500, range_chop +1000, sector_rotation +1250 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nCompute the call's time value, compare to the dividend, decide the early-assignment risk, and select the route. Report rejected routes by route id.\n\nObjective:\nremove early-assignment/dividend risk when and only when it is economically rational.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"call_strike\", \"dividend_per_share\", \"call_time_value\", \"early_assignment_risk\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "manage_assignment",
      "selected_route": "route_b",
      "instrument": "AAPL",
      "call_strike": 210,
      "dividend_per_share": 1.3,
      "call_time_value": 0.8,
      "early_assignment_risk": false,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_a"
      ],
      "scenario_pnl": {
        "gap_down": -143500,
        "melt_up": 51500,
        "range_chop": -72000,
        "sector_rotation": -60750
      },
      "worst_case_pnl": -143500,
      "self_check": {
        "compared_dividend_to_time_value": true,
        "assignment_handled": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "early_assignment_dividend_risk",
        "feasibility_trap": false,
        "objective_function": "objective for early_assignment_dividend_risk",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "call_strike",
          "dividend_per_share",
          "call_time_value",
          "early_assignment_risk",
          "scenario_pnl.gap_down",
          "scenario_pnl.melt_up",
          "scenario_pnl.range_chop",
          "scenario_pnl.sector_rotation",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "manage_assignment",
        "selected_route": "route_b",
        "instrument": "AAPL",
        "call_strike": 210,
        "dividend_per_share": 1.3,
        "call_time_value": 0.8,
        "early_assignment_risk": false,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_a"
        ],
        "scenario_pnl": {
          "gap_down": -143500,
          "melt_up": 51500,
          "range_chop": -72000,
          "sector_rotation": -60750
        },
        "worst_case_pnl": -143500,
        "self_check": {
          "compared_dividend_to_time_value": true,
          "assignment_handled": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-067",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-067",
    "prompt": "Frozen market snapshot:\n- Account: futures account using the simplified SPAN margin figures in this packet.\n- Objective: add crude-oil carry exposure with SPAN margin_used <= 12000 USD.\nCandidate routes (decide feasibility yourself from the SPAN margin figures):\n- Route A (route_a): long 3 CL June / short 3 CL July calendar spread, expected carry 1000 USD, SPAN margin 10500 USD\n- Route B (route_b): long 1 outright CL contracts, expected carry 1400 USD, SPAN margin 24000 USD\n- Route C (route_c): stay flat, expected carry 0 USD, SPAN margin 0 USD\n\nFrozen scenario PnL before action:\n- risk_off: -120000 USD.\n- squeeze: 56000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: risk_off +8000, squeeze -2000 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nSelect the feasible strategy with the highest expected carry under the SPAN margin cap. Report rejected routes by route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"spread_count\", \"expected_carry_usd\", \"margin_used\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "spread_count": 3,
      "expected_carry_usd": 1000,
      "margin_used": 10500,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "risk_off": -112000,
        "squeeze": 54000
      },
      "worst_case_pnl": -112000,
      "self_check": {
        "span_margin_within_limit": true,
        "highest_feasible_carry_selected": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "span_margin_calendar_spread",
        "feasibility_trap": false,
        "objective_function": "objective for span_margin_calendar_spread",
        "deterministic_grading_fields": [
          "selected_route",
          "spread_count",
          "expected_carry_usd",
          "margin_used",
          "scenario_pnl.risk_off",
          "scenario_pnl.squeeze",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "spread_count": 3,
        "expected_carry_usd": 1000,
        "margin_used": 10500,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "risk_off": -112000,
          "squeeze": 54000
        },
        "worst_case_pnl": -112000,
        "self_check": {
          "span_margin_within_limit": true,
          "highest_feasible_carry_selected": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-068",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-068",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is a beta-dollar rebalance against the stated beta target.\n- Portfolio equity beta-dollar exposure: 850000 USD.\n- Required reduction: at least 45% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 33000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 260000 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 2 ES futures (beta hedge), ES at 5200.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 1 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 21000 USD premium that reduces beta-dollars by 520000 USD\n- Route D (route_d): short 5 ES futures, same specs as Route A\n\nFrozen scenario PnL before action:\n- rate_shock: -125000 USD.\n- vol_spike: 40000 USD.\n- credit_widening: -79000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: rate_shock +95000, vol_spike -15000, credit_widening +60000 USD. Apply this effect to each scenario, then subtract the 50 USD cash cost from every scenario.\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 2,
      "beta_reduction_usd": 520000,
      "beta_reduction_pct": 61.18,
      "margin_used": 26000,
      "expected_cost": 50,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ],
      "scenario_pnl": {
        "rate_shock": -30050,
        "vol_spike": 24950,
        "credit_widening": -19050
      },
      "worst_case_pnl": -30050,
      "self_check": {
        "min_reduction_met": true,
        "margin_ok": true,
        "lowest_cost_feasible": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Portfolio risk / rebalancing",
        "tier": "AGI",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "beta_dollar_rebalance",
        "feasibility_trap": true,
        "objective_function": "objective for beta_dollar_rebalance",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost",
          "scenario_pnl.rate_shock",
          "scenario_pnl.vol_spike",
          "scenario_pnl.credit_widening",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 2,
        "beta_reduction_usd": 520000,
        "beta_reduction_pct": 61.18,
        "margin_used": 26000,
        "expected_cost": 50,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ],
        "scenario_pnl": {
          "rate_shock": -30050,
          "vol_spike": 24950,
          "credit_widening": -19050
        },
        "worst_case_pnl": -30050,
        "self_check": {
          "min_reduction_met": true,
          "margin_ok": true,
          "lowest_cost_feasible": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-069",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-069",
    "prompt": "Frozen market snapshot:\n- Account: US margin account. Borrow rate is 6.00% APR; weigh borrow cost against edge.\n- Instrument: TSLA common stock at 200.00. Desired bearish target: short 1000 shares of exposure.\n- Locate availability: exactly 600 shares. Option cash available: 2400 USD. Put delta -0.35 means 35 delta-shares per contract.\nCandidate routes (decide feasibility from the locate and cash limits yourself):\n- Route A (route_a): short exactly the 600 located shares and buy 3 listed puts (delta -0.35, premium 8.00 USD/share, multiplier 100) within 2400 USD option cash\n- Route B (route_b): short the full 1000-share target (requires shares beyond the locate)\n- Route C (route_c): buy 7 listed puts (premium 8.00 USD/share, multiplier 100), ignoring the option cash limit\n\nFrozen scenario PnL before action:\n- gap_down: -130000 USD.\n- melt_up: 44000 USD.\n- range_chop: -70000 USD.\n- sector_rotation: -62000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: gap_down +12000, melt_up -20000, range_chop +9000, sector_rotation +10500 USD. Apply this effect to each scenario, then subtract the 2400 USD cash cost from every scenario.\n\nTask:\nChoose the feasible bearish implementation that maximizes bearish delta-shares without breaching the locate or option cash. Report rejected routes by route id.\n\nObjective:\nmaximize bearish delta-shares subject to locate and option-cash constraints.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"short_shares\", \"put_contracts\", \"premium_paid\", \"bearish_delta_shares\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "TSLA",
      "short_shares": 600,
      "put_contracts": 3,
      "premium_paid": 2400,
      "bearish_delta_shares": 705,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "gap_down": -120400,
        "melt_up": 21600,
        "range_chop": -63400,
        "sector_rotation": -53900
      },
      "worst_case_pnl": -120400,
      "self_check": {
        "within_locate": true,
        "within_option_cash": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Shorting / borrow / margin / locates",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "borrow_cost_vs_trade_edge",
        "feasibility_trap": true,
        "objective_function": "objective for borrow_cost_vs_trade_edge",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "short_shares",
          "put_contracts",
          "premium_paid",
          "bearish_delta_shares",
          "scenario_pnl.gap_down",
          "scenario_pnl.melt_up",
          "scenario_pnl.range_chop",
          "scenario_pnl.sector_rotation",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "TSLA",
        "short_shares": 600,
        "put_contracts": 3,
        "premium_paid": 2400,
        "bearish_delta_shares": 705,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "gap_down": -120400,
          "melt_up": 21600,
          "range_chop": -63400,
          "sector_rotation": -53900
        },
        "worst_case_pnl": -120400,
        "self_check": {
          "within_locate": true,
          "within_option_cash": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-070",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-070",
    "prompt": "Frozen market snapshot:\n- Covered call on XLK ETF: long 100 shares at 185.00, short 1 180 call.\n- Call quote: 5.80 USD/share; option multiplier 100 shares. Intrinsic = max(0, spot - strike).\n- Ordinary cash dividend 0.90/share with ex-dividend tomorrow. Early assignment of an American call is rational for the holder when the dividend exceeds the call's remaining time value.\nCandidate routes (decide which is required by the assignment economics):\n- Route A (route_a): roll/close the short call before ex-dividend to avoid early assignment\n- Route B (route_b): hold the covered call through ex-dividend unchanged\n\nFrozen scenario PnL before action:\n- risk_off: -135000 USD.\n- squeeze: 48000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: risk_off +1500, squeeze -500 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nCompute the call's time value, compare to the dividend, decide the early-assignment risk, and select the route. Report rejected routes by route id.\n\nObjective:\nremove early-assignment/dividend risk when and only when it is economically rational.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"call_strike\", \"dividend_per_share\", \"call_time_value\", \"early_assignment_risk\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "manage_assignment",
      "selected_route": "route_a",
      "instrument": "XLK",
      "call_strike": 180,
      "dividend_per_share": 0.9,
      "call_time_value": 0.8,
      "early_assignment_risk": true,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ],
      "scenario_pnl": {
        "risk_off": -133500,
        "squeeze": 47500
      },
      "worst_case_pnl": -133500,
      "self_check": {
        "compared_dividend_to_time_value": true,
        "assignment_handled": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "early_assignment_dividend_risk",
        "feasibility_trap": false,
        "objective_function": "objective for early_assignment_dividend_risk",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "call_strike",
          "dividend_per_share",
          "call_time_value",
          "early_assignment_risk",
          "scenario_pnl.risk_off",
          "scenario_pnl.squeeze",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "manage_assignment",
        "selected_route": "route_a",
        "instrument": "XLK",
        "call_strike": 180,
        "dividend_per_share": 0.9,
        "call_time_value": 0.8,
        "early_assignment_risk": true,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ],
        "scenario_pnl": {
          "risk_off": -133500,
          "squeeze": 47500
        },
        "worst_case_pnl": -133500,
        "self_check": {
          "compared_dividend_to_time_value": true,
          "assignment_handled": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-071",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-071",
    "prompt": "Frozen market snapshot:\n- Account: futures account using the simplified SPAN margin figures in this packet.\n- Objective: add crude-oil carry exposure with SPAN margin_used <= 11500 USD.\nCandidate routes (decide feasibility yourself from the SPAN margin figures):\n- Route A (route_a): long 7 CL June / short 7 CL July calendar spread, expected carry 1400 USD, SPAN margin 10000 USD\n- Route B (route_b): long 5 outright CL contracts, expected carry 1900 USD, SPAN margin 24000 USD\n- Route C (route_c): stay flat, expected carry 0 USD, SPAN margin 0 USD\n\nFrozen scenario PnL before action:\n- rate_shock: -140000 USD.\n- vol_spike: 52000 USD.\n- credit_widening: -76000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: rate_shock +8000, vol_spike -2000, credit_widening +5000 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nSelect the feasible strategy with the highest expected carry under the SPAN margin cap. Report rejected routes by route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"spread_count\", \"expected_carry_usd\", \"margin_used\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "spread_count": 7,
      "expected_carry_usd": 1400,
      "margin_used": 10000,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "rate_shock": -132000,
        "vol_spike": 50000,
        "credit_widening": -71000
      },
      "worst_case_pnl": -132000,
      "self_check": {
        "span_margin_within_limit": true,
        "highest_feasible_carry_selected": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "AGI",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "span_margin_calendar_spread",
        "feasibility_trap": false,
        "objective_function": "objective for span_margin_calendar_spread",
        "deterministic_grading_fields": [
          "selected_route",
          "spread_count",
          "expected_carry_usd",
          "margin_used",
          "scenario_pnl.rate_shock",
          "scenario_pnl.vol_spike",
          "scenario_pnl.credit_widening",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "spread_count": 7,
        "expected_carry_usd": 1400,
        "margin_used": 10000,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "rate_shock": -132000,
          "vol_spike": 50000,
          "credit_widening": -71000
        },
        "worst_case_pnl": -132000,
        "self_check": {
          "span_margin_within_limit": true,
          "highest_feasible_carry_selected": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-072",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-072",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is a beta-dollar rebalance against the stated beta target.\n- Portfolio equity beta-dollar exposure: 1050000 USD.\n- Required reduction: at least 50% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 46000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 251250 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 3 ES futures (beta hedge), ES at 5025.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 2 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 21000 USD premium that reduces beta-dollars by 753750 USD\n- Route D (route_d): short 6 ES futures, same specs as Route A\n\nFrozen scenario PnL before action:\n- gap_down: -145000 USD.\n- melt_up: 56000 USD.\n- range_chop: -79000 USD.\n- sector_rotation: -62000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: gap_down +95000, melt_up -15000, range_chop +60000, sector_rotation +77500 USD. Apply this effect to each scenario, then subtract the 75 USD cash cost from every scenario.\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 3,
      "beta_reduction_usd": 753750,
      "beta_reduction_pct": 71.79,
      "margin_used": 39000,
      "expected_cost": 75,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ],
      "scenario_pnl": {
        "gap_down": -50075,
        "melt_up": 40925,
        "range_chop": -19075,
        "sector_rotation": 15425
      },
      "worst_case_pnl": -50075,
      "self_check": {
        "min_reduction_met": true,
        "margin_ok": true,
        "lowest_cost_feasible": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Portfolio risk / rebalancing",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "beta_dollar_rebalance",
        "feasibility_trap": true,
        "objective_function": "objective for beta_dollar_rebalance",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost",
          "scenario_pnl.gap_down",
          "scenario_pnl.melt_up",
          "scenario_pnl.range_chop",
          "scenario_pnl.sector_rotation",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 3,
        "beta_reduction_usd": 753750,
        "beta_reduction_pct": 71.79,
        "margin_used": 39000,
        "expected_cost": 75,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ],
        "scenario_pnl": {
          "gap_down": -50075,
          "melt_up": 40925,
          "range_chop": -19075,
          "sector_rotation": 15425
        },
        "worst_case_pnl": -50075,
        "self_check": {
          "min_reduction_met": true,
          "margin_ok": true,
          "lowest_cost_feasible": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-073",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-073",
    "prompt": "Frozen market snapshot:\n- Account: US margin account. Borrow rate is 4.00% APR; weigh borrow cost against edge.\n- Instrument: SPY ETF at 120.00. Desired bearish target: short 1000 shares of exposure.\n- Locate availability: exactly 300 shares. Option cash available: 800 USD. Put delta -0.35 means 35 delta-shares per contract.\nCandidate routes (decide feasibility from the locate and cash limits yourself):\n- Route A (route_a): short exactly the 300 located shares and buy 1 listed puts (delta -0.35, premium 8.00 USD/share, multiplier 100) within 800 USD option cash\n- Route B (route_b): short the full 1000-share target (requires shares beyond the locate)\n- Route C (route_c): buy 5 listed puts (premium 8.00 USD/share, multiplier 100), ignoring the option cash limit\n\nFrozen scenario PnL before action:\n- risk_off: -120000 USD.\n- squeeze: 40000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: risk_off +12000, squeeze -20000 USD. Apply this effect to each scenario, then subtract the 800 USD cash cost from every scenario.\n\nTask:\nChoose the feasible bearish implementation that maximizes bearish delta-shares without breaching the locate or option cash. Report rejected routes by route id.\n\nObjective:\nmaximize bearish delta-shares subject to locate and option-cash constraints.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"short_shares\", \"put_contracts\", \"premium_paid\", \"bearish_delta_shares\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "SPY",
      "short_shares": 300,
      "put_contracts": 1,
      "premium_paid": 800,
      "bearish_delta_shares": 335,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "risk_off": -108800,
        "squeeze": 19200
      },
      "worst_case_pnl": -108800,
      "self_check": {
        "within_locate": true,
        "within_option_cash": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Shorting / borrow / margin / locates",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "borrow_cost_vs_trade_edge",
        "feasibility_trap": true,
        "objective_function": "objective for borrow_cost_vs_trade_edge",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "short_shares",
          "put_contracts",
          "premium_paid",
          "bearish_delta_shares",
          "scenario_pnl.risk_off",
          "scenario_pnl.squeeze",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "SPY",
        "short_shares": 300,
        "put_contracts": 1,
        "premium_paid": 800,
        "bearish_delta_shares": 335,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "risk_off": -108800,
          "squeeze": 19200
        },
        "worst_case_pnl": -108800,
        "self_check": {
          "within_locate": true,
          "within_option_cash": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-074",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-074",
    "prompt": "Frozen market snapshot:\n- Covered call on QQQ ETF: long 100 shares at 205.00, short 1 205 call.\n- Call quote: 0.80 USD/share; option multiplier 100 shares. Intrinsic = max(0, spot - strike).\n- Ordinary cash dividend 0.50/share with ex-dividend tomorrow. Early assignment of an American call is rational for the holder when the dividend exceeds the call's remaining time value.\nCandidate routes (decide which is required by the assignment economics):\n- Route A (route_a): roll/close the short call before ex-dividend to avoid early assignment\n- Route B (route_b): hold the covered call through ex-dividend unchanged\n\nFrozen scenario PnL before action:\n- rate_shock: -125000 USD.\n- vol_spike: 44000 USD.\n- credit_widening: -73000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: rate_shock +1500, vol_spike -500, credit_widening +1000 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nCompute the call's time value, compare to the dividend, decide the early-assignment risk, and select the route. Report rejected routes by route id.\n\nObjective:\nremove early-assignment/dividend risk when and only when it is economically rational.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"call_strike\", \"dividend_per_share\", \"call_time_value\", \"early_assignment_risk\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "manage_assignment",
      "selected_route": "route_b",
      "instrument": "QQQ",
      "call_strike": 205,
      "dividend_per_share": 0.5,
      "call_time_value": 0.8,
      "early_assignment_risk": false,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_a"
      ],
      "scenario_pnl": {
        "rate_shock": -123500,
        "vol_spike": 43500,
        "credit_widening": -72000
      },
      "worst_case_pnl": -123500,
      "self_check": {
        "compared_dividend_to_time_value": true,
        "assignment_handled": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "AGI",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "early_assignment_dividend_risk",
        "feasibility_trap": false,
        "objective_function": "objective for early_assignment_dividend_risk",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "call_strike",
          "dividend_per_share",
          "call_time_value",
          "early_assignment_risk",
          "scenario_pnl.rate_shock",
          "scenario_pnl.vol_spike",
          "scenario_pnl.credit_widening",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "manage_assignment",
        "selected_route": "route_b",
        "instrument": "QQQ",
        "call_strike": 205,
        "dividend_per_share": 0.5,
        "call_time_value": 0.8,
        "early_assignment_risk": false,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_a"
        ],
        "scenario_pnl": {
          "rate_shock": -123500,
          "vol_spike": 43500,
          "credit_widening": -72000
        },
        "worst_case_pnl": -123500,
        "self_check": {
          "compared_dividend_to_time_value": true,
          "assignment_handled": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-075",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-075",
    "prompt": "Frozen market snapshot:\n- Account: futures account using the simplified SPAN margin figures in this packet.\n- Objective: add crude-oil carry exposure with SPAN margin_used <= 11000 USD.\nCandidate routes (decide feasibility yourself from the SPAN margin figures):\n- Route A (route_a): long 5 CL June / short 5 CL July calendar spread, expected carry 1800 USD, SPAN margin 9500 USD\n- Route B (route_b): long 3 outright CL contracts, expected carry 2400 USD, SPAN margin 24000 USD\n- Route C (route_c): stay flat, expected carry 0 USD, SPAN margin 0 USD\n\nFrozen scenario PnL before action:\n- gap_down: -130000 USD.\n- melt_up: 48000 USD.\n- range_chop: -76000 USD.\n- sector_rotation: -62000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: gap_down +8000, melt_up -2000, range_chop +5000, sector_rotation +6500 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nSelect the feasible strategy with the highest expected carry under the SPAN margin cap. Report rejected routes by route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"spread_count\", \"expected_carry_usd\", \"margin_used\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "spread_count": 5,
      "expected_carry_usd": 1800,
      "margin_used": 9500,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "gap_down": -122000,
        "melt_up": 46000,
        "range_chop": -71000,
        "sector_rotation": -55500
      },
      "worst_case_pnl": -122000,
      "self_check": {
        "span_margin_within_limit": true,
        "highest_feasible_carry_selected": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "span_margin_calendar_spread",
        "feasibility_trap": false,
        "objective_function": "objective for span_margin_calendar_spread",
        "deterministic_grading_fields": [
          "selected_route",
          "spread_count",
          "expected_carry_usd",
          "margin_used",
          "scenario_pnl.gap_down",
          "scenario_pnl.melt_up",
          "scenario_pnl.range_chop",
          "scenario_pnl.sector_rotation",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "spread_count": 5,
        "expected_carry_usd": 1800,
        "margin_used": 9500,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "gap_down": -122000,
          "melt_up": 46000,
          "range_chop": -71000,
          "sector_rotation": -55500
        },
        "worst_case_pnl": -122000,
        "self_check": {
          "span_margin_within_limit": true,
          "highest_feasible_carry_selected": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-076",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-076",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is a beta-dollar rebalance against the stated beta target.\n- Portfolio equity beta-dollar exposure: 800000 USD.\n- Required reduction: at least 40% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 33000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 256250 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 2 ES futures (beta hedge), ES at 5125.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 1 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 21000 USD premium that reduces beta-dollars by 512500 USD\n- Route D (route_d): short 5 ES futures, same specs as Route A\n\nFrozen scenario PnL before action:\n- risk_off: -135000 USD.\n- squeeze: 52000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: risk_off +95000, squeeze -15000 USD. Apply this effect to each scenario, then subtract the 50 USD cash cost from every scenario.\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 2,
      "beta_reduction_usd": 512500,
      "beta_reduction_pct": 64.06,
      "margin_used": 26000,
      "expected_cost": 50,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ],
      "scenario_pnl": {
        "risk_off": -40050,
        "squeeze": 36950
      },
      "worst_case_pnl": -40050,
      "self_check": {
        "min_reduction_met": true,
        "margin_ok": true,
        "lowest_cost_feasible": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Portfolio risk / rebalancing",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "beta_dollar_rebalance",
        "feasibility_trap": true,
        "objective_function": "objective for beta_dollar_rebalance",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost",
          "scenario_pnl.risk_off",
          "scenario_pnl.squeeze",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 2,
        "beta_reduction_usd": 512500,
        "beta_reduction_pct": 64.06,
        "margin_used": 26000,
        "expected_cost": 50,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ],
        "scenario_pnl": {
          "risk_off": -40050,
          "squeeze": 36950
        },
        "worst_case_pnl": -40050,
        "self_check": {
          "min_reduction_met": true,
          "margin_ok": true,
          "lowest_cost_feasible": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-077",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-077",
    "prompt": "Frozen market snapshot:\n- Account: US margin account. Borrow rate is 8.00% APR; weigh borrow cost against edge.\n- Instrument: MSFT common stock at 160.00. Desired bearish target: short 1000 shares of exposure.\n- Locate availability: exactly 700 shares. Option cash available: 2400 USD. Put delta -0.35 means 35 delta-shares per contract.\nCandidate routes (decide feasibility from the locate and cash limits yourself):\n- Route A (route_a): short exactly the 700 located shares and buy 3 listed puts (delta -0.35, premium 8.00 USD/share, multiplier 100) within 2400 USD option cash\n- Route B (route_b): short the full 1000-share target (requires shares beyond the locate)\n- Route C (route_c): buy 7 listed puts (premium 8.00 USD/share, multiplier 100), ignoring the option cash limit\n\nFrozen scenario PnL before action:\n- rate_shock: -140000 USD.\n- vol_spike: 56000 USD.\n- credit_widening: -70000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: rate_shock +12000, vol_spike -20000, credit_widening +9000 USD. Apply this effect to each scenario, then subtract the 2400 USD cash cost from every scenario.\n\nTask:\nChoose the feasible bearish implementation that maximizes bearish delta-shares without breaching the locate or option cash. Report rejected routes by route id.\n\nObjective:\nmaximize bearish delta-shares subject to locate and option-cash constraints.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"short_shares\", \"put_contracts\", \"premium_paid\", \"bearish_delta_shares\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "MSFT",
      "short_shares": 700,
      "put_contracts": 3,
      "premium_paid": 2400,
      "bearish_delta_shares": 805,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "rate_shock": -130400,
        "vol_spike": 33600,
        "credit_widening": -63400
      },
      "worst_case_pnl": -130400,
      "self_check": {
        "within_locate": true,
        "within_option_cash": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Shorting / borrow / margin / locates",
        "tier": "AGI",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "borrow_cost_vs_trade_edge",
        "feasibility_trap": true,
        "objective_function": "objective for borrow_cost_vs_trade_edge",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "short_shares",
          "put_contracts",
          "premium_paid",
          "bearish_delta_shares",
          "scenario_pnl.rate_shock",
          "scenario_pnl.vol_spike",
          "scenario_pnl.credit_widening",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "MSFT",
        "short_shares": 700,
        "put_contracts": 3,
        "premium_paid": 2400,
        "bearish_delta_shares": 805,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "rate_shock": -130400,
          "vol_spike": 33600,
          "credit_widening": -63400
        },
        "worst_case_pnl": -130400,
        "self_check": {
          "within_locate": true,
          "within_option_cash": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-078",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-078",
    "prompt": "Frozen market snapshot:\n- Covered call on NVDA common stock: long 100 shares at 185.00, short 1 190 call.\n- Call quote: 0.80 USD/share; option multiplier 100 shares. Intrinsic = max(0, spot - strike).\n- Ordinary cash dividend 1.30/share with ex-dividend tomorrow. Early assignment of an American call is rational for the holder when the dividend exceeds the call's remaining time value.\nCandidate routes (decide which is required by the assignment economics):\n- Route A (route_a): roll/close the short call before ex-dividend to avoid early assignment\n- Route B (route_b): hold the covered call through ex-dividend unchanged\n\nFrozen scenario PnL before action:\n- gap_down: -145000 USD.\n- melt_up: 40000 USD.\n- range_chop: -73000 USD.\n- sector_rotation: -62000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: gap_down +1500, melt_up -500, range_chop +1000, sector_rotation +1250 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nCompute the call's time value, compare to the dividend, decide the early-assignment risk, and select the route. Report rejected routes by route id.\n\nObjective:\nremove early-assignment/dividend risk when and only when it is economically rational.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"call_strike\", \"dividend_per_share\", \"call_time_value\", \"early_assignment_risk\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "manage_assignment",
      "selected_route": "route_b",
      "instrument": "NVDA",
      "call_strike": 190,
      "dividend_per_share": 1.3,
      "call_time_value": 0.8,
      "early_assignment_risk": false,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_a"
      ],
      "scenario_pnl": {
        "gap_down": -143500,
        "melt_up": 39500,
        "range_chop": -72000,
        "sector_rotation": -60750
      },
      "worst_case_pnl": -143500,
      "self_check": {
        "compared_dividend_to_time_value": true,
        "assignment_handled": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "early_assignment_dividend_risk",
        "feasibility_trap": false,
        "objective_function": "objective for early_assignment_dividend_risk",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "call_strike",
          "dividend_per_share",
          "call_time_value",
          "early_assignment_risk",
          "scenario_pnl.gap_down",
          "scenario_pnl.melt_up",
          "scenario_pnl.range_chop",
          "scenario_pnl.sector_rotation",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "manage_assignment",
        "selected_route": "route_b",
        "instrument": "NVDA",
        "call_strike": 190,
        "dividend_per_share": 1.3,
        "call_time_value": 0.8,
        "early_assignment_risk": false,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_a"
        ],
        "scenario_pnl": {
          "gap_down": -143500,
          "melt_up": 39500,
          "range_chop": -72000,
          "sector_rotation": -60750
        },
        "worst_case_pnl": -143500,
        "self_check": {
          "compared_dividend_to_time_value": true,
          "assignment_handled": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-079",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-079",
    "prompt": "Frozen market snapshot:\n- Account: futures account using the simplified SPAN margin figures in this packet.\n- Objective: add crude-oil carry exposure with SPAN margin_used <= 10500 USD.\nCandidate routes (decide feasibility yourself from the SPAN margin figures):\n- Route A (route_a): long 3 CL June / short 3 CL July calendar spread, expected carry 1300 USD, SPAN margin 9000 USD\n- Route B (route_b): long 1 outright CL contracts, expected carry 1700 USD, SPAN margin 24000 USD\n- Route C (route_c): stay flat, expected carry 0 USD, SPAN margin 0 USD\n\nFrozen scenario PnL before action:\n- risk_off: -120000 USD.\n- squeeze: 44000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: risk_off +8000, squeeze -2000 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nSelect the feasible strategy with the highest expected carry under the SPAN margin cap. Report rejected routes by route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"spread_count\", \"expected_carry_usd\", \"margin_used\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "spread_count": 3,
      "expected_carry_usd": 1300,
      "margin_used": 9000,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "risk_off": -112000,
        "squeeze": 42000
      },
      "worst_case_pnl": -112000,
      "self_check": {
        "span_margin_within_limit": true,
        "highest_feasible_carry_selected": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "span_margin_calendar_spread",
        "feasibility_trap": false,
        "objective_function": "objective for span_margin_calendar_spread",
        "deterministic_grading_fields": [
          "selected_route",
          "spread_count",
          "expected_carry_usd",
          "margin_used",
          "scenario_pnl.risk_off",
          "scenario_pnl.squeeze",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "spread_count": 3,
        "expected_carry_usd": 1300,
        "margin_used": 9000,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "risk_off": -112000,
          "squeeze": 42000
        },
        "worst_case_pnl": -112000,
        "self_check": {
          "span_margin_within_limit": true,
          "highest_feasible_carry_selected": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-080",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-080",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is a beta-dollar rebalance against the stated beta target.\n- Portfolio equity beta-dollar exposure: 1000000 USD.\n- Required reduction: at least 45% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 33000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 261250 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 2 ES futures (beta hedge), ES at 5225.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 1 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 21000 USD premium that reduces beta-dollars by 522500 USD\n- Route D (route_d): short 5 ES futures, same specs as Route A\n\nFrozen scenario PnL before action:\n- rate_shock: -125000 USD.\n- vol_spike: 48000 USD.\n- credit_widening: -79000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: rate_shock +95000, vol_spike -15000, credit_widening +60000 USD. Apply this effect to each scenario, then subtract the 50 USD cash cost from every scenario.\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 2,
      "beta_reduction_usd": 522500,
      "beta_reduction_pct": 52.25,
      "margin_used": 26000,
      "expected_cost": 50,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ],
      "scenario_pnl": {
        "rate_shock": -30050,
        "vol_spike": 32950,
        "credit_widening": -19050
      },
      "worst_case_pnl": -30050,
      "self_check": {
        "min_reduction_met": true,
        "margin_ok": true,
        "lowest_cost_feasible": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Portfolio risk / rebalancing",
        "tier": "AGI",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "beta_dollar_rebalance",
        "feasibility_trap": true,
        "objective_function": "objective for beta_dollar_rebalance",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost",
          "scenario_pnl.rate_shock",
          "scenario_pnl.vol_spike",
          "scenario_pnl.credit_widening",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 2,
        "beta_reduction_usd": 522500,
        "beta_reduction_pct": 52.25,
        "margin_used": 26000,
        "expected_cost": 50,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ],
        "scenario_pnl": {
          "rate_shock": -30050,
          "vol_spike": 32950,
          "credit_widening": -19050
        },
        "worst_case_pnl": -30050,
        "self_check": {
          "min_reduction_met": true,
          "margin_ok": true,
          "lowest_cost_feasible": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-081",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-081",
    "prompt": "Frozen market snapshot:\n- Account: US margin account. Borrow rate is 6.00% APR; weigh borrow cost against edge.\n- Instrument: XLF ETF at 200.00. Desired bearish target: short 1000 shares of exposure.\n- Locate availability: exactly 400 shares. Option cash available: 1600 USD. Put delta -0.35 means 35 delta-shares per contract.\nCandidate routes (decide feasibility from the locate and cash limits yourself):\n- Route A (route_a): short exactly the 400 located shares and buy 2 listed puts (delta -0.35, premium 8.00 USD/share, multiplier 100) within 1600 USD option cash\n- Route B (route_b): short the full 1000-share target (requires shares beyond the locate)\n- Route C (route_c): buy 6 listed puts (premium 8.00 USD/share, multiplier 100), ignoring the option cash limit\n\nFrozen scenario PnL before action:\n- gap_down: -130000 USD.\n- melt_up: 52000 USD.\n- range_chop: -70000 USD.\n- sector_rotation: -62000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: gap_down +12000, melt_up -20000, range_chop +9000, sector_rotation +10500 USD. Apply this effect to each scenario, then subtract the 1600 USD cash cost from every scenario.\n\nTask:\nChoose the feasible bearish implementation that maximizes bearish delta-shares without breaching the locate or option cash. Report rejected routes by route id.\n\nObjective:\nmaximize bearish delta-shares subject to locate and option-cash constraints.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"short_shares\", \"put_contracts\", \"premium_paid\", \"bearish_delta_shares\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "XLF",
      "short_shares": 400,
      "put_contracts": 2,
      "premium_paid": 1600,
      "bearish_delta_shares": 470,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "gap_down": -119600,
        "melt_up": 30400,
        "range_chop": -62600,
        "sector_rotation": -53100
      },
      "worst_case_pnl": -119600,
      "self_check": {
        "within_locate": true,
        "within_option_cash": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Shorting / borrow / margin / locates",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "borrow_cost_vs_trade_edge",
        "feasibility_trap": true,
        "objective_function": "objective for borrow_cost_vs_trade_edge",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "short_shares",
          "put_contracts",
          "premium_paid",
          "bearish_delta_shares",
          "scenario_pnl.gap_down",
          "scenario_pnl.melt_up",
          "scenario_pnl.range_chop",
          "scenario_pnl.sector_rotation",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "XLF",
        "short_shares": 400,
        "put_contracts": 2,
        "premium_paid": 1600,
        "bearish_delta_shares": 470,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "gap_down": -119600,
          "melt_up": 30400,
          "range_chop": -62600,
          "sector_rotation": -53100
        },
        "worst_case_pnl": -119600,
        "self_check": {
          "within_locate": true,
          "within_option_cash": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-082",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-082",
    "prompt": "Frozen market snapshot:\n- Covered call on GLD ETF: long 100 shares at 205.00, short 1 200 call.\n- Call quote: 5.80 USD/share; option multiplier 100 shares. Intrinsic = max(0, spot - strike).\n- Ordinary cash dividend 0.90/share with ex-dividend tomorrow. Early assignment of an American call is rational for the holder when the dividend exceeds the call's remaining time value.\nCandidate routes (decide which is required by the assignment economics):\n- Route A (route_a): roll/close the short call before ex-dividend to avoid early assignment\n- Route B (route_b): hold the covered call through ex-dividend unchanged\n\nFrozen scenario PnL before action:\n- risk_off: -135000 USD.\n- squeeze: 56000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: risk_off +1500, squeeze -500 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nCompute the call's time value, compare to the dividend, decide the early-assignment risk, and select the route. Report rejected routes by route id.\n\nObjective:\nremove early-assignment/dividend risk when and only when it is economically rational.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"call_strike\", \"dividend_per_share\", \"call_time_value\", \"early_assignment_risk\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "manage_assignment",
      "selected_route": "route_a",
      "instrument": "GLD",
      "call_strike": 200,
      "dividend_per_share": 0.9,
      "call_time_value": 0.8,
      "early_assignment_risk": true,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ],
      "scenario_pnl": {
        "risk_off": -133500,
        "squeeze": 55500
      },
      "worst_case_pnl": -133500,
      "self_check": {
        "compared_dividend_to_time_value": true,
        "assignment_handled": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "early_assignment_dividend_risk",
        "feasibility_trap": false,
        "objective_function": "objective for early_assignment_dividend_risk",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "call_strike",
          "dividend_per_share",
          "call_time_value",
          "early_assignment_risk",
          "scenario_pnl.risk_off",
          "scenario_pnl.squeeze",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "manage_assignment",
        "selected_route": "route_a",
        "instrument": "GLD",
        "call_strike": 200,
        "dividend_per_share": 0.9,
        "call_time_value": 0.8,
        "early_assignment_risk": true,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ],
        "scenario_pnl": {
          "risk_off": -133500,
          "squeeze": 55500
        },
        "worst_case_pnl": -133500,
        "self_check": {
          "compared_dividend_to_time_value": true,
          "assignment_handled": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-083",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-083",
    "prompt": "Frozen market snapshot:\n- Account: futures account using the simplified SPAN margin figures in this packet.\n- Objective: add crude-oil carry exposure with SPAN margin_used <= 10000 USD.\nCandidate routes (decide feasibility yourself from the SPAN margin figures):\n- Route A (route_a): long 7 CL June / short 7 CL July calendar spread, expected carry 1700 USD, SPAN margin 8500 USD\n- Route B (route_b): long 5 outright CL contracts, expected carry 2200 USD, SPAN margin 24000 USD\n- Route C (route_c): stay flat, expected carry 0 USD, SPAN margin 0 USD\n\nFrozen scenario PnL before action:\n- rate_shock: -140000 USD.\n- vol_spike: 40000 USD.\n- credit_widening: -76000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: rate_shock +8000, vol_spike -2000, credit_widening +5000 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nSelect the feasible strategy with the highest expected carry under the SPAN margin cap. Report rejected routes by route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"spread_count\", \"expected_carry_usd\", \"margin_used\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "spread_count": 7,
      "expected_carry_usd": 1700,
      "margin_used": 8500,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "rate_shock": -132000,
        "vol_spike": 38000,
        "credit_widening": -71000
      },
      "worst_case_pnl": -132000,
      "self_check": {
        "span_margin_within_limit": true,
        "highest_feasible_carry_selected": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "AGI",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "span_margin_calendar_spread",
        "feasibility_trap": false,
        "objective_function": "objective for span_margin_calendar_spread",
        "deterministic_grading_fields": [
          "selected_route",
          "spread_count",
          "expected_carry_usd",
          "margin_used",
          "scenario_pnl.rate_shock",
          "scenario_pnl.vol_spike",
          "scenario_pnl.credit_widening",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "spread_count": 7,
        "expected_carry_usd": 1700,
        "margin_used": 8500,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "rate_shock": -132000,
          "vol_spike": 38000,
          "credit_widening": -71000
        },
        "worst_case_pnl": -132000,
        "self_check": {
          "span_margin_within_limit": true,
          "highest_feasible_carry_selected": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-084",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-084",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is a beta-dollar rebalance against the stated beta target.\n- Portfolio equity beta-dollar exposure: 1200000 USD.\n- Required reduction: at least 50% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 46000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 252500 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 3 ES futures (beta hedge), ES at 5050.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 2 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 21000 USD premium that reduces beta-dollars by 757500 USD\n- Route D (route_d): short 6 ES futures, same specs as Route A\n\nFrozen scenario PnL before action:\n- gap_down: -145000 USD.\n- melt_up: 44000 USD.\n- range_chop: -79000 USD.\n- sector_rotation: -62000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: gap_down +95000, melt_up -15000, range_chop +60000, sector_rotation +77500 USD. Apply this effect to each scenario, then subtract the 75 USD cash cost from every scenario.\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 3,
      "beta_reduction_usd": 757500,
      "beta_reduction_pct": 63.13,
      "margin_used": 39000,
      "expected_cost": 75,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ],
      "scenario_pnl": {
        "gap_down": -50075,
        "melt_up": 28925,
        "range_chop": -19075,
        "sector_rotation": 15425
      },
      "worst_case_pnl": -50075,
      "self_check": {
        "min_reduction_met": true,
        "margin_ok": true,
        "lowest_cost_feasible": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Portfolio risk / rebalancing",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "beta_dollar_rebalance",
        "feasibility_trap": true,
        "objective_function": "objective for beta_dollar_rebalance",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost",
          "scenario_pnl.gap_down",
          "scenario_pnl.melt_up",
          "scenario_pnl.range_chop",
          "scenario_pnl.sector_rotation",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 3,
        "beta_reduction_usd": 757500,
        "beta_reduction_pct": 63.13,
        "margin_used": 39000,
        "expected_cost": 75,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ],
        "scenario_pnl": {
          "gap_down": -50075,
          "melt_up": 28925,
          "range_chop": -19075,
          "sector_rotation": 15425
        },
        "worst_case_pnl": -50075,
        "self_check": {
          "min_reduction_met": true,
          "margin_ok": true,
          "lowest_cost_feasible": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-085",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-085",
    "prompt": "Frozen market snapshot:\n- Account: US margin account. Borrow rate is 4.00% APR; weigh borrow cost against edge.\n- Instrument: IWM ETF at 120.00. Desired bearish target: short 1000 shares of exposure.\n- Locate availability: exactly 800 shares. Option cash available: 3200 USD. Put delta -0.35 means 35 delta-shares per contract.\nCandidate routes (decide feasibility from the locate and cash limits yourself):\n- Route A (route_a): short exactly the 800 located shares and buy 4 listed puts (delta -0.35, premium 8.00 USD/share, multiplier 100) within 3200 USD option cash\n- Route B (route_b): short the full 1000-share target (requires shares beyond the locate)\n- Route C (route_c): buy 8 listed puts (premium 8.00 USD/share, multiplier 100), ignoring the option cash limit\n\nFrozen scenario PnL before action:\n- risk_off: -120000 USD.\n- squeeze: 48000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: risk_off +12000, squeeze -20000 USD. Apply this effect to each scenario, then subtract the 3200 USD cash cost from every scenario.\n\nTask:\nChoose the feasible bearish implementation that maximizes bearish delta-shares without breaching the locate or option cash. Report rejected routes by route id.\n\nObjective:\nmaximize bearish delta-shares subject to locate and option-cash constraints.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"short_shares\", \"put_contracts\", \"premium_paid\", \"bearish_delta_shares\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "IWM",
      "short_shares": 800,
      "put_contracts": 4,
      "premium_paid": 3200,
      "bearish_delta_shares": 940,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "risk_off": -111200,
        "squeeze": 24800
      },
      "worst_case_pnl": -111200,
      "self_check": {
        "within_locate": true,
        "within_option_cash": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Shorting / borrow / margin / locates",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "borrow_cost_vs_trade_edge",
        "feasibility_trap": true,
        "objective_function": "objective for borrow_cost_vs_trade_edge",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "short_shares",
          "put_contracts",
          "premium_paid",
          "bearish_delta_shares",
          "scenario_pnl.risk_off",
          "scenario_pnl.squeeze",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "IWM",
        "short_shares": 800,
        "put_contracts": 4,
        "premium_paid": 3200,
        "bearish_delta_shares": 940,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "risk_off": -111200,
          "squeeze": 24800
        },
        "worst_case_pnl": -111200,
        "self_check": {
          "within_locate": true,
          "within_option_cash": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-086",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-086",
    "prompt": "Frozen market snapshot:\n- Covered call on AAPL common stock: long 100 shares at 185.00, short 1 185 call.\n- Call quote: 0.80 USD/share; option multiplier 100 shares. Intrinsic = max(0, spot - strike).\n- Ordinary cash dividend 0.50/share with ex-dividend tomorrow. Early assignment of an American call is rational for the holder when the dividend exceeds the call's remaining time value.\nCandidate routes (decide which is required by the assignment economics):\n- Route A (route_a): roll/close the short call before ex-dividend to avoid early assignment\n- Route B (route_b): hold the covered call through ex-dividend unchanged\n\nFrozen scenario PnL before action:\n- rate_shock: -125000 USD.\n- vol_spike: 52000 USD.\n- credit_widening: -73000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: rate_shock +1500, vol_spike -500, credit_widening +1000 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nCompute the call's time value, compare to the dividend, decide the early-assignment risk, and select the route. Report rejected routes by route id.\n\nObjective:\nremove early-assignment/dividend risk when and only when it is economically rational.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"call_strike\", \"dividend_per_share\", \"call_time_value\", \"early_assignment_risk\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "manage_assignment",
      "selected_route": "route_b",
      "instrument": "AAPL",
      "call_strike": 185,
      "dividend_per_share": 0.5,
      "call_time_value": 0.8,
      "early_assignment_risk": false,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_a"
      ],
      "scenario_pnl": {
        "rate_shock": -123500,
        "vol_spike": 51500,
        "credit_widening": -72000
      },
      "worst_case_pnl": -123500,
      "self_check": {
        "compared_dividend_to_time_value": true,
        "assignment_handled": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "AGI",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "early_assignment_dividend_risk",
        "feasibility_trap": false,
        "objective_function": "objective for early_assignment_dividend_risk",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "call_strike",
          "dividend_per_share",
          "call_time_value",
          "early_assignment_risk",
          "scenario_pnl.rate_shock",
          "scenario_pnl.vol_spike",
          "scenario_pnl.credit_widening",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "manage_assignment",
        "selected_route": "route_b",
        "instrument": "AAPL",
        "call_strike": 185,
        "dividend_per_share": 0.5,
        "call_time_value": 0.8,
        "early_assignment_risk": false,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_a"
        ],
        "scenario_pnl": {
          "rate_shock": -123500,
          "vol_spike": 51500,
          "credit_widening": -72000
        },
        "worst_case_pnl": -123500,
        "self_check": {
          "compared_dividend_to_time_value": true,
          "assignment_handled": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-087",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-087",
    "prompt": "Frozen market snapshot:\n- Account: futures account using the simplified SPAN margin figures in this packet.\n- Objective: add crude-oil carry exposure with SPAN margin_used <= 12000 USD.\nCandidate routes (decide feasibility yourself from the SPAN margin figures):\n- Route A (route_a): long 5 CL June / short 5 CL July calendar spread, expected carry 1200 USD, SPAN margin 10500 USD\n- Route B (route_b): long 3 outright CL contracts, expected carry 1800 USD, SPAN margin 24000 USD\n- Route C (route_c): stay flat, expected carry 0 USD, SPAN margin 0 USD\n\nFrozen scenario PnL before action:\n- gap_down: -130000 USD.\n- melt_up: 56000 USD.\n- range_chop: -76000 USD.\n- sector_rotation: -62000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: gap_down +8000, melt_up -2000, range_chop +5000, sector_rotation +6500 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nSelect the feasible strategy with the highest expected carry under the SPAN margin cap. Report rejected routes by route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"spread_count\", \"expected_carry_usd\", \"margin_used\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "spread_count": 5,
      "expected_carry_usd": 1200,
      "margin_used": 10500,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "gap_down": -122000,
        "melt_up": 54000,
        "range_chop": -71000,
        "sector_rotation": -55500
      },
      "worst_case_pnl": -122000,
      "self_check": {
        "span_margin_within_limit": true,
        "highest_feasible_carry_selected": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "span_margin_calendar_spread",
        "feasibility_trap": false,
        "objective_function": "objective for span_margin_calendar_spread",
        "deterministic_grading_fields": [
          "selected_route",
          "spread_count",
          "expected_carry_usd",
          "margin_used",
          "scenario_pnl.gap_down",
          "scenario_pnl.melt_up",
          "scenario_pnl.range_chop",
          "scenario_pnl.sector_rotation",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "spread_count": 5,
        "expected_carry_usd": 1200,
        "margin_used": 10500,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "gap_down": -122000,
          "melt_up": 54000,
          "range_chop": -71000,
          "sector_rotation": -55500
        },
        "worst_case_pnl": -122000,
        "self_check": {
          "span_margin_within_limit": true,
          "highest_feasible_carry_selected": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-088",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-088",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is a beta-dollar rebalance against the stated beta target.\n- Portfolio equity beta-dollar exposure: 950000 USD.\n- Required reduction: at least 40% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 33000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 257500 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 2 ES futures (beta hedge), ES at 5150.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 1 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 21000 USD premium that reduces beta-dollars by 515000 USD\n- Route D (route_d): short 5 ES futures, same specs as Route A\n\nFrozen scenario PnL before action:\n- risk_off: -135000 USD.\n- squeeze: 40000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: risk_off +95000, squeeze -15000 USD. Apply this effect to each scenario, then subtract the 50 USD cash cost from every scenario.\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 2,
      "beta_reduction_usd": 515000,
      "beta_reduction_pct": 54.21,
      "margin_used": 26000,
      "expected_cost": 50,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ],
      "scenario_pnl": {
        "risk_off": -40050,
        "squeeze": 24950
      },
      "worst_case_pnl": -40050,
      "self_check": {
        "min_reduction_met": true,
        "margin_ok": true,
        "lowest_cost_feasible": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Portfolio risk / rebalancing",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "beta_dollar_rebalance",
        "feasibility_trap": true,
        "objective_function": "objective for beta_dollar_rebalance",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost",
          "scenario_pnl.risk_off",
          "scenario_pnl.squeeze",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 2,
        "beta_reduction_usd": 515000,
        "beta_reduction_pct": 54.21,
        "margin_used": 26000,
        "expected_cost": 50,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ],
        "scenario_pnl": {
          "risk_off": -40050,
          "squeeze": 24950
        },
        "worst_case_pnl": -40050,
        "self_check": {
          "min_reduction_met": true,
          "margin_ok": true,
          "lowest_cost_feasible": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-089",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-089",
    "prompt": "Frozen market snapshot:\n- Account: US margin account. Borrow rate is 8.00% APR; weigh borrow cost against edge.\n- Instrument: TSLA common stock at 160.00. Desired bearish target: short 1000 shares of exposure.\n- Locate availability: exactly 500 shares. Option cash available: 1600 USD. Put delta -0.35 means 35 delta-shares per contract.\nCandidate routes (decide feasibility from the locate and cash limits yourself):\n- Route A (route_a): short exactly the 500 located shares and buy 2 listed puts (delta -0.35, premium 8.00 USD/share, multiplier 100) within 1600 USD option cash\n- Route B (route_b): short the full 1000-share target (requires shares beyond the locate)\n- Route C (route_c): buy 6 listed puts (premium 8.00 USD/share, multiplier 100), ignoring the option cash limit\n\nFrozen scenario PnL before action:\n- rate_shock: -140000 USD.\n- vol_spike: 44000 USD.\n- credit_widening: -70000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: rate_shock +12000, vol_spike -20000, credit_widening +9000 USD. Apply this effect to each scenario, then subtract the 1600 USD cash cost from every scenario.\n\nTask:\nChoose the feasible bearish implementation that maximizes bearish delta-shares without breaching the locate or option cash. Report rejected routes by route id.\n\nObjective:\nmaximize bearish delta-shares subject to locate and option-cash constraints.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"short_shares\", \"put_contracts\", \"premium_paid\", \"bearish_delta_shares\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "TSLA",
      "short_shares": 500,
      "put_contracts": 2,
      "premium_paid": 1600,
      "bearish_delta_shares": 570,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "rate_shock": -129600,
        "vol_spike": 22400,
        "credit_widening": -62600
      },
      "worst_case_pnl": -129600,
      "self_check": {
        "within_locate": true,
        "within_option_cash": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Shorting / borrow / margin / locates",
        "tier": "AGI",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "borrow_cost_vs_trade_edge",
        "feasibility_trap": true,
        "objective_function": "objective for borrow_cost_vs_trade_edge",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "short_shares",
          "put_contracts",
          "premium_paid",
          "bearish_delta_shares",
          "scenario_pnl.rate_shock",
          "scenario_pnl.vol_spike",
          "scenario_pnl.credit_widening",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "TSLA",
        "short_shares": 500,
        "put_contracts": 2,
        "premium_paid": 1600,
        "bearish_delta_shares": 570,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "rate_shock": -129600,
          "vol_spike": 22400,
          "credit_widening": -62600
        },
        "worst_case_pnl": -129600,
        "self_check": {
          "within_locate": true,
          "within_option_cash": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-090",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-090",
    "prompt": "Frozen market snapshot:\n- Covered call on XLK ETF: long 100 shares at 205.00, short 1 210 call.\n- Call quote: 0.80 USD/share; option multiplier 100 shares. Intrinsic = max(0, spot - strike).\n- Ordinary cash dividend 1.30/share with ex-dividend tomorrow. Early assignment of an American call is rational for the holder when the dividend exceeds the call's remaining time value.\nCandidate routes (decide which is required by the assignment economics):\n- Route A (route_a): roll/close the short call before ex-dividend to avoid early assignment\n- Route B (route_b): hold the covered call through ex-dividend unchanged\n\nFrozen scenario PnL before action:\n- gap_down: -145000 USD.\n- melt_up: 48000 USD.\n- range_chop: -73000 USD.\n- sector_rotation: -62000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: gap_down +1500, melt_up -500, range_chop +1000, sector_rotation +1250 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nCompute the call's time value, compare to the dividend, decide the early-assignment risk, and select the route. Report rejected routes by route id.\n\nObjective:\nremove early-assignment/dividend risk when and only when it is economically rational.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"call_strike\", \"dividend_per_share\", \"call_time_value\", \"early_assignment_risk\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "manage_assignment",
      "selected_route": "route_b",
      "instrument": "XLK",
      "call_strike": 210,
      "dividend_per_share": 1.3,
      "call_time_value": 0.8,
      "early_assignment_risk": false,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_a"
      ],
      "scenario_pnl": {
        "gap_down": -143500,
        "melt_up": 47500,
        "range_chop": -72000,
        "sector_rotation": -60750
      },
      "worst_case_pnl": -143500,
      "self_check": {
        "compared_dividend_to_time_value": true,
        "assignment_handled": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "early_assignment_dividend_risk",
        "feasibility_trap": false,
        "objective_function": "objective for early_assignment_dividend_risk",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "call_strike",
          "dividend_per_share",
          "call_time_value",
          "early_assignment_risk",
          "scenario_pnl.gap_down",
          "scenario_pnl.melt_up",
          "scenario_pnl.range_chop",
          "scenario_pnl.sector_rotation",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "manage_assignment",
        "selected_route": "route_b",
        "instrument": "XLK",
        "call_strike": 210,
        "dividend_per_share": 1.3,
        "call_time_value": 0.8,
        "early_assignment_risk": false,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_a"
        ],
        "scenario_pnl": {
          "gap_down": -143500,
          "melt_up": 47500,
          "range_chop": -72000,
          "sector_rotation": -60750
        },
        "worst_case_pnl": -143500,
        "self_check": {
          "compared_dividend_to_time_value": true,
          "assignment_handled": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-091",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-091",
    "prompt": "Frozen market snapshot:\n- Account: futures account using the simplified SPAN margin figures in this packet.\n- Objective: add crude-oil carry exposure with SPAN margin_used <= 11500 USD.\nCandidate routes (decide feasibility yourself from the SPAN margin figures):\n- Route A (route_a): long 3 CL June / short 3 CL July calendar spread, expected carry 1600 USD, SPAN margin 10000 USD\n- Route B (route_b): long 1 outright CL contracts, expected carry 2000 USD, SPAN margin 24000 USD\n- Route C (route_c): stay flat, expected carry 0 USD, SPAN margin 0 USD\n\nFrozen scenario PnL before action:\n- risk_off: -120000 USD.\n- squeeze: 52000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: risk_off +8000, squeeze -2000 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nSelect the feasible strategy with the highest expected carry under the SPAN margin cap. Report rejected routes by route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"spread_count\", \"expected_carry_usd\", \"margin_used\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "spread_count": 3,
      "expected_carry_usd": 1600,
      "margin_used": 10000,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "risk_off": -112000,
        "squeeze": 50000
      },
      "worst_case_pnl": -112000,
      "self_check": {
        "span_margin_within_limit": true,
        "highest_feasible_carry_selected": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "span_margin_calendar_spread",
        "feasibility_trap": false,
        "objective_function": "objective for span_margin_calendar_spread",
        "deterministic_grading_fields": [
          "selected_route",
          "spread_count",
          "expected_carry_usd",
          "margin_used",
          "scenario_pnl.risk_off",
          "scenario_pnl.squeeze",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "spread_count": 3,
        "expected_carry_usd": 1600,
        "margin_used": 10000,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "risk_off": -112000,
          "squeeze": 50000
        },
        "worst_case_pnl": -112000,
        "self_check": {
          "span_margin_within_limit": true,
          "highest_feasible_carry_selected": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-092",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-092",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is a beta-dollar rebalance against the stated beta target.\n- Portfolio equity beta-dollar exposure: 1150000 USD.\n- Required reduction: at least 45% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 33000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 262500 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 2 ES futures (beta hedge), ES at 5250.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 1 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 21000 USD premium that reduces beta-dollars by 525000 USD\n- Route D (route_d): short 5 ES futures, same specs as Route A\n\nFrozen scenario PnL before action:\n- rate_shock: -125000 USD.\n- vol_spike: 56000 USD.\n- credit_widening: -79000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: rate_shock +95000, vol_spike -15000, credit_widening +60000 USD. Apply this effect to each scenario, then subtract the 50 USD cash cost from every scenario.\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 2,
      "beta_reduction_usd": 525000,
      "beta_reduction_pct": 45.65,
      "margin_used": 26000,
      "expected_cost": 50,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ],
      "scenario_pnl": {
        "rate_shock": -30050,
        "vol_spike": 40950,
        "credit_widening": -19050
      },
      "worst_case_pnl": -30050,
      "self_check": {
        "min_reduction_met": true,
        "margin_ok": true,
        "lowest_cost_feasible": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Portfolio risk / rebalancing",
        "tier": "AGI",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "beta_dollar_rebalance",
        "feasibility_trap": true,
        "objective_function": "objective for beta_dollar_rebalance",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost",
          "scenario_pnl.rate_shock",
          "scenario_pnl.vol_spike",
          "scenario_pnl.credit_widening",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 2,
        "beta_reduction_usd": 525000,
        "beta_reduction_pct": 45.65,
        "margin_used": 26000,
        "expected_cost": 50,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ],
        "scenario_pnl": {
          "rate_shock": -30050,
          "vol_spike": 40950,
          "credit_widening": -19050
        },
        "worst_case_pnl": -30050,
        "self_check": {
          "min_reduction_met": true,
          "margin_ok": true,
          "lowest_cost_feasible": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-093",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-093",
    "prompt": "Frozen market snapshot:\n- Instrument: SPY ETF. Order size: 900 shares at limit 66.25. The regular session is OPEN now; the after-hours venue is CLOSED; the dark venue is NOT enabled on this account.\n- Session/permission trap: only permitted, open venues are executable.\nCandidate routes (decide which venue is permitted and open yourself):\n- Route A (route_a): route the order to the continuous regular session\n- Route B (route_b): route the order to the closed after-hours venue with no permission\n- Route C (route_c): route via an unsupported dark venue not enabled on this account\n\nFrozen scenario PnL before action:\n- gap_down: -130000 USD.\n- melt_up: 40000 USD.\n- range_chop: -70000 USD.\n- sector_rotation: -62000 USD.\nThis action does not hedge the book (no per-scenario market effect), so each scenario's PnL is the frozen base PnL minus the action's cash cost (0 USD).\n\nTask:\nRoute to the only feasible venue. Report rejected routes by route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"order_shares\", \"limit_price\", \"venue\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "SPY",
      "order_shares": 900,
      "limit_price": 66.25,
      "venue": "regular_session",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "gap_down": -130000,
        "melt_up": 40000,
        "range_chop": -70000,
        "sector_rotation": -62000
      },
      "worst_case_pnl": -130000,
      "self_check": {
        "session_open": true,
        "venue_permitted": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Execution / liquidity / microstructure",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "invalid_route_session_trap",
        "feasibility_trap": true,
        "objective_function": "objective for invalid_route_session_trap",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "order_shares",
          "limit_price",
          "venue",
          "scenario_pnl.gap_down",
          "scenario_pnl.melt_up",
          "scenario_pnl.range_chop",
          "scenario_pnl.sector_rotation",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "SPY",
        "order_shares": 900,
        "limit_price": 66.25,
        "venue": "regular_session",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "gap_down": -130000,
          "melt_up": 40000,
          "range_chop": -70000,
          "sector_rotation": -62000
        },
        "worst_case_pnl": -130000,
        "self_check": {
          "session_open": true,
          "venue_permitted": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-094",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-094",
    "prompt": "Frozen market snapshot:\n- Jurisdiction / account regime: US cash account.\n- Permissions: CFDs unavailable; short selling unavailable in cash accounts; futures not approved; the regular equity session is closed.\n- No alternative product permission is enabled in this packet.\nCandidate routes (decide feasibility from the permission facts; a no-trade is required if all routes violate constraints):\n- Route A (route_a): short 600 QQQ shares via CFD after the regular session close\n- Route B (route_b): short 600 QQQ shares in the cash account\n- Route C (route_c): buy QQQ futures to get short exposure\n\nFrozen scenario PnL before action:\n- risk_off: -135000 USD.\n- squeeze: 44000 USD.\nThis action does not hedge the book (no per-scenario market effect), so each scenario's PnL is the frozen base PnL minus the action's cash cost (0 USD).\n\nTask:\nReject every invalid route and return the no-trade decision. Report rejected routes by route id.\n\nObjective:\nreturn no_trade if and only if every route violates a permission, session, or product constraint.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"requested_shares\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "no_trade",
      "selected_route": "none",
      "instrument": "QQQ",
      "requested_shares": 600,
      "feasibility": "infeasible",
      "rejected_routes": [
        "route_a",
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "risk_off": -135000,
        "squeeze": 44000
      },
      "worst_case_pnl": -135000,
      "self_check": {
        "permissions_checked": true,
        "no_valid_route": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Feasibility / rejection / no-trade traps",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "unsupported_product_permission",
        "feasibility_trap": true,
        "objective_function": "objective for unsupported_product_permission",
        "deterministic_grading_fields": [
          "decision",
          "selected_route",
          "instrument",
          "requested_shares",
          "feasibility",
          "scenario_pnl.risk_off",
          "scenario_pnl.squeeze",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "no_trade",
        "selected_route": "none",
        "instrument": "QQQ",
        "requested_shares": 600,
        "feasibility": "infeasible",
        "rejected_routes": [
          "route_a",
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "risk_off": -135000,
          "squeeze": 44000
        },
        "worst_case_pnl": -135000,
        "self_check": {
          "permissions_checked": true,
          "no_valid_route": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-095",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-095",
    "prompt": "Frozen market snapshot:\n- Account: US margin account. On recall, substitute listed puts for the un-locatable short.\n- Instrument: IWM ETF at 220.00. Desired bearish target: short 1200 shares of exposure.\n- Locate availability: exactly 400 shares. Option cash available: 1600 USD. Put delta -0.35 means 35 delta-shares per contract.\nCandidate routes (decide feasibility from the locate and cash limits yourself):\n- Route A (route_a): short exactly the 400 located shares and buy 2 listed puts (delta -0.35, premium 8.00 USD/share, multiplier 100) within 1600 USD option cash\n- Route B (route_b): short the full 1200-share target (requires shares beyond the locate)\n- Route C (route_c): buy 6 listed puts (premium 8.00 USD/share, multiplier 100), ignoring the option cash limit\n\nFrozen scenario PnL before action:\n- rate_shock: -140000 USD.\n- vol_spike: 48000 USD.\n- credit_widening: -76000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: rate_shock +12000, vol_spike -20000, credit_widening +9000 USD. Apply this effect to each scenario, then subtract the 1600 USD cash cost from every scenario.\n\nTask:\nChoose the feasible bearish implementation that maximizes bearish delta-shares without breaching the locate or option cash. Report rejected routes by route id.\n\nObjective:\nmaximize bearish delta-shares subject to locate and option-cash constraints.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"short_shares\", \"put_contracts\", \"premium_paid\", \"bearish_delta_shares\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "IWM",
      "short_shares": 400,
      "put_contracts": 2,
      "premium_paid": 1600,
      "bearish_delta_shares": 470,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "rate_shock": -129600,
        "vol_spike": 26400,
        "credit_widening": -68600
      },
      "worst_case_pnl": -129600,
      "self_check": {
        "within_locate": true,
        "within_option_cash": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Shorting / borrow / margin / locates",
        "tier": "AGI",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "locate_recall_options_substitution",
        "feasibility_trap": true,
        "objective_function": "objective for locate_recall_options_substitution",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "short_shares",
          "put_contracts",
          "premium_paid",
          "bearish_delta_shares",
          "scenario_pnl.rate_shock",
          "scenario_pnl.vol_spike",
          "scenario_pnl.credit_widening",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "IWM",
        "short_shares": 400,
        "put_contracts": 2,
        "premium_paid": 1600,
        "bearish_delta_shares": 470,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "rate_shock": -129600,
          "vol_spike": 26400,
          "credit_widening": -68600
        },
        "worst_case_pnl": -129600,
        "self_check": {
          "within_locate": true,
          "within_option_cash": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-096",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-096",
    "prompt": "Frozen market snapshot:\n- Covered call on AAPL common stock: long 100 shares at 195.00, short 1 200 call.\n- Call quote: 1.40 USD/share; option multiplier 100 shares. Intrinsic = max(0, spot - strike).\n- Ordinary cash dividend 1.30/share with ex-dividend tomorrow. Early assignment of an American call is rational for the holder when the dividend exceeds the call's remaining time value.\nCandidate routes (decide which is required by the assignment economics):\n- Route A (route_a): roll/close the short call before ex-dividend to avoid early assignment\n- Route B (route_b): hold the covered call through ex-dividend unchanged\n\nFrozen scenario PnL before action:\n- gap_down: -145000 USD.\n- melt_up: 52000 USD.\n- range_chop: -79000 USD.\n- sector_rotation: -62000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: gap_down +1500, melt_up -500, range_chop +1000, sector_rotation +1250 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nCompute the call's time value, compare to the dividend, decide the early-assignment risk, and select the route. Report rejected routes by route id.\n\nObjective:\nremove early-assignment/dividend risk when and only when it is economically rational.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"call_strike\", \"dividend_per_share\", \"call_time_value\", \"early_assignment_risk\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "manage_assignment",
      "selected_route": "route_b",
      "instrument": "AAPL",
      "call_strike": 200,
      "dividend_per_share": 1.3,
      "call_time_value": 1.4,
      "early_assignment_risk": false,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_a"
      ],
      "scenario_pnl": {
        "gap_down": -143500,
        "melt_up": 51500,
        "range_chop": -78000,
        "sector_rotation": -60750
      },
      "worst_case_pnl": -143500,
      "self_check": {
        "compared_dividend_to_time_value": true,
        "assignment_handled": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "covered_call_assignment",
        "feasibility_trap": true,
        "objective_function": "objective for covered_call_assignment",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "call_strike",
          "dividend_per_share",
          "call_time_value",
          "early_assignment_risk",
          "scenario_pnl.gap_down",
          "scenario_pnl.melt_up",
          "scenario_pnl.range_chop",
          "scenario_pnl.sector_rotation",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "manage_assignment",
        "selected_route": "route_b",
        "instrument": "AAPL",
        "call_strike": 200,
        "dividend_per_share": 1.3,
        "call_time_value": 1.4,
        "early_assignment_risk": false,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_a"
        ],
        "scenario_pnl": {
          "gap_down": -143500,
          "melt_up": 51500,
          "range_chop": -78000,
          "sector_rotation": -60750
        },
        "worst_case_pnl": -143500,
        "self_check": {
          "compared_dividend_to_time_value": true,
          "assignment_handled": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-097",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-097",
    "prompt": "Frozen market snapshot:\n- Position: long 5 CL near-month futures. This is a futures roll calendar ahead of first notice; use executable bid/ask, not mid.\n- First notice day is tomorrow; account policy forbids holding physically deliverable CL long into first notice.\n- Only the displayed bid/ask is executable; mid prices are indicative and not executable.\nCandidate routes (decide feasibility yourself):\n- Route A (route_a): roll by selling near at bid 72.00 and buying next at ask 72.50; CL multiplier 1000 barrels; fee 4 USD/contract/leg\n- Route B (route_b): roll using the near/next mid prices instead of bid/ask\n- Route C (route_c): hold the long near-month position into first notice day\n\nFrozen scenario PnL before action:\n- risk_off: -120000 USD.\n- squeeze: 56000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: risk_off +3000, squeeze -1000 USD. Apply this effect to each scenario, then subtract the 2540 USD cash cost from every scenario.\n\nTask:\nRoll the position and compute total executable cost. Report rejected routes by route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"contracts\", \"roll_cost_usd\", \"fees_usd\", \"total_cost_usd\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "roll",
      "selected_route": "route_a",
      "contracts": 5,
      "roll_cost_usd": 2500,
      "fees_usd": 40,
      "total_cost_usd": 2540,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "risk_off": -119540,
        "squeeze": 52460
      },
      "worst_case_pnl": -119540,
      "self_check": {
        "uses_executable_prices": true,
        "avoids_first_notice": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "futures_roll_calendar",
        "feasibility_trap": false,
        "objective_function": "objective for futures_roll_calendar",
        "deterministic_grading_fields": [
          "selected_route",
          "contracts",
          "roll_cost_usd",
          "fees_usd",
          "total_cost_usd",
          "scenario_pnl.risk_off",
          "scenario_pnl.squeeze",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "roll",
        "selected_route": "route_a",
        "contracts": 5,
        "roll_cost_usd": 2500,
        "fees_usd": 40,
        "total_cost_usd": 2540,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "risk_off": -119540,
          "squeeze": 52460
        },
        "worst_case_pnl": -119540,
        "self_check": {
          "uses_executable_prices": true,
          "avoids_first_notice": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-098",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-098",
    "prompt": "Frozen market snapshot:\n- Account holder: US retail customer. Account base currency: USD. Maintain a USD cash buffer; pick the lowest-USD-cost feasible conversion.\n- Required: obtain 140000 EUR settling T+2. Spot EURUSD 1.0600. EUR futures initial margin capacity: 2000 USD.\nCandidate routes (decide feasibility from jurisdiction, settlement and margin facts yourself):\n- Route A (route_a): buy EUR spot at 1.0600, settles T+2, fees included\n- Route B (route_b): use a retail CFD on EURUSD\n- Route C (route_c): use EUR futures requiring 3000 USD initial margin\n\nFrozen scenario PnL before action:\n- rate_shock: -125000 USD.\n- vol_spike: 40000 USD.\n- credit_widening: -73000 USD.\nThis action does not hedge the book (no per-scenario market effect), so each scenario's PnL is the frozen base PnL minus the action's cash cost (0 USD).\n\nTask:\nChoose the feasible route and compute USD cost. Report rejected routes by route id.\n\nObjective:\nobtain the EUR by the required settlement date at the lowest feasible USD cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"eur_amount\", \"usd_cost\", \"settlement_date_rule\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "convert_fx",
      "selected_route": "route_a",
      "eur_amount": 140000,
      "usd_cost": 148400,
      "settlement_date_rule": "T+2",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "rate_shock": -125000,
        "vol_spike": 40000,
        "credit_widening": -73000
      },
      "worst_case_pnl": -125000,
      "self_check": {
        "settlement_matches": true,
        "product_permitted": true,
        "margin_ok": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot FX / CFDs / multi-currency",
        "tier": "AGI",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "multi_currency_cash_buffer",
        "feasibility_trap": true,
        "objective_function": "objective for multi_currency_cash_buffer",
        "deterministic_grading_fields": [
          "selected_route",
          "eur_amount",
          "usd_cost",
          "settlement_date_rule",
          "scenario_pnl.rate_shock",
          "scenario_pnl.vol_spike",
          "scenario_pnl.credit_widening",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "convert_fx",
        "selected_route": "route_a",
        "eur_amount": 140000,
        "usd_cost": 148400,
        "settlement_date_rule": "T+2",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "rate_shock": -125000,
          "vol_spike": 40000,
          "credit_widening": -73000
        },
        "worst_case_pnl": -125000,
        "self_check": {
          "settlement_matches": true,
          "product_permitted": true,
          "margin_ok": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-099",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-099",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is a risk budget rebalance against the stated beta target.\n- Portfolio equity beta-dollar exposure: 1050000 USD.\n- Required reduction: at least 50% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 46000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 257500 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 3 ES futures (beta hedge), ES at 5150.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 2 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 20000 USD premium that reduces beta-dollars by 772500 USD\n- Route D (route_d): short 6 ES futures, same specs as Route A\n\nFrozen scenario PnL before action:\n- gap_down: -130000 USD.\n- melt_up: 44000 USD.\n- range_chop: -76000 USD.\n- sector_rotation: -62000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: gap_down +95000, melt_up -15000, range_chop +60000, sector_rotation +77500 USD. Apply this effect to each scenario, then subtract the 75 USD cash cost from every scenario.\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 3,
      "beta_reduction_usd": 772500,
      "beta_reduction_pct": 73.57,
      "margin_used": 39000,
      "expected_cost": 75,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ],
      "scenario_pnl": {
        "gap_down": -35075,
        "melt_up": 28925,
        "range_chop": -16075,
        "sector_rotation": 15425
      },
      "worst_case_pnl": -35075,
      "self_check": {
        "min_reduction_met": true,
        "margin_ok": true,
        "lowest_cost_feasible": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Portfolio risk / rebalancing",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "risk_budget_rebalance",
        "feasibility_trap": false,
        "objective_function": "objective for risk_budget_rebalance",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost",
          "scenario_pnl.gap_down",
          "scenario_pnl.melt_up",
          "scenario_pnl.range_chop",
          "scenario_pnl.sector_rotation",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 3,
        "beta_reduction_usd": 772500,
        "beta_reduction_pct": 73.57,
        "margin_used": 39000,
        "expected_cost": 75,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ],
        "scenario_pnl": {
          "gap_down": -35075,
          "melt_up": 28925,
          "range_chop": -16075,
          "sector_rotation": 15425
        },
        "worst_case_pnl": -35075,
        "self_check": {
          "min_reduction_met": true,
          "margin_ok": true,
          "lowest_cost_feasible": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-100",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-100",
    "prompt": "Frozen market snapshot:\n- Instrument: XLK ETF. Order-book liquidity limit: maximize fill under the average-price cap.\n- Mid price: 122.00. Maximum average execution price (cap): 122.11.\n- Ask book: 40000 @ 122.05; 40000 @ 122.10; 20000 @ 122.30.\n- Partial fills allowed only in 500-share clips. Fees ignored.\nCandidate routes:\n- Route A (route_a): walk the book filling cheapest levels first in 500-share clips while keeping the running average <= the cap\n- Route B (route_b): take the full displayed size across all levels at a single 122.30 limit\n\nFrozen scenario PnL before action:\n- risk_off: -135000 USD.\n- squeeze: 48000 USD.\nThis action does not hedge the book (no per-scenario market effect), so each scenario's PnL is the frozen base PnL minus the action's cash cost (0 USD).\n\nTask:\nCompute the maximum buy quantity in allowed clips that keeps the average price at or below the cap. Report rejected routes by route id.\n\nObjective:\nmaximize filled_shares subject to average_price <= the cap, in 500-share clips.\n\nOutput JSON fields: { \"decision\", \"instrument\", \"side\", \"clip_size_shares\", \"filled_shares\", \"average_price\", \"limit_price\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "trade",
      "instrument": "XLK",
      "side": "buy",
      "clip_size_shares": 500,
      "filled_shares": 94500,
      "average_price": 122.11,
      "limit_price": 122.3,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ],
      "scenario_pnl": {
        "risk_off": -135000,
        "squeeze": 48000
      },
      "worst_case_pnl": -135000,
      "self_check": {
        "average_price_within_cap": true,
        "max_fill_in_clips": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Execution / liquidity / microstructure",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "order_book_liquidity_limit",
        "feasibility_trap": true,
        "objective_function": "objective for order_book_liquidity_limit",
        "deterministic_grading_fields": [
          "instrument",
          "side",
          "clip_size_shares",
          "filled_shares",
          "average_price",
          "limit_price",
          "scenario_pnl.risk_off",
          "scenario_pnl.squeeze",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "instrument": "XLK",
        "side": "buy",
        "clip_size_shares": 500,
        "filled_shares": 94500,
        "average_price": 122.11,
        "limit_price": 122.3,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ],
        "scenario_pnl": {
          "risk_off": -135000,
          "squeeze": 48000
        },
        "worst_case_pnl": -135000,
        "self_check": {
          "average_price_within_cap": true,
          "max_fill_in_clips": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-101",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-101",
    "prompt": "Frozen market snapshot:\n- Instrument: XLF ETF at 280.00. US equities settle T+1.\n- Trade date 2026-06-15; T+1 cash settlement date 2026-06-16. Unsettled proceeds cannot be withdrawn before settlement.\nCandidate routes (decide which respects settlement):\n- Route A (route_a): sell 500 shares on 2026-06-15; withdraw cash only after T+1 settlement on 2026-06-16\n- Route B (route_b): sell 500 shares on 2026-06-15 and withdraw the proceeds on the trade date 2026-06-15\n\nFrozen scenario PnL before action:\n- rate_shock: -140000 USD.\n- vol_spike: 52000 USD.\n- credit_widening: -70000 USD.\nThis action does not hedge the book (no per-scenario market effect), so each scenario's PnL is the frozen base PnL minus the action's cash cost (0 USD).\n\nTask:\nSell and report trade value and the T+1 cash date. Report rejected routes by route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"trade_value_usd\", \"settlement_rule\", \"settlement_cash_date\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "sell",
      "selected_route": "route_a",
      "trade_value_usd": 140000,
      "settlement_rule": "T+1",
      "settlement_cash_date": "2026-06-16",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ],
      "scenario_pnl": {
        "rate_shock": -140000,
        "vol_spike": 52000,
        "credit_widening": -70000
      },
      "worst_case_pnl": -140000,
      "self_check": {
        "settlement_respected": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Corporate actions / settlement / calendar / jurisdiction",
        "tier": "AGI",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "t_plus_one_settlement_sequence",
        "feasibility_trap": true,
        "objective_function": "objective for t_plus_one_settlement_sequence",
        "deterministic_grading_fields": [
          "selected_route",
          "trade_value_usd",
          "settlement_rule",
          "settlement_cash_date",
          "scenario_pnl.rate_shock",
          "scenario_pnl.vol_spike",
          "scenario_pnl.credit_widening",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "sell",
        "selected_route": "route_a",
        "trade_value_usd": 140000,
        "settlement_rule": "T+1",
        "settlement_cash_date": "2026-06-16",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ],
        "scenario_pnl": {
          "rate_shock": -140000,
          "vol_spike": 52000,
          "credit_widening": -70000
        },
        "worst_case_pnl": -140000,
        "self_check": {
          "settlement_respected": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-102",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-102",
    "prompt": "Frozen market snapshot:\n- Jurisdiction / account regime: US cash account.\n- Permissions: CFDs unavailable; short selling unavailable in cash accounts; futures not approved; the regular equity session is closed.\n- No alternative product permission is enabled in this packet.\nCandidate routes (decide feasibility from the permission facts; a no-trade is required if all routes violate constraints):\n- Route A (route_a): short 800 GLD shares via CFD after the regular session close\n- Route B (route_b): short 800 GLD shares in the cash account\n- Route C (route_c): buy GLD futures to get short exposure\n\nFrozen scenario PnL before action:\n- gap_down: -145000 USD.\n- melt_up: 56000 USD.\n- range_chop: -73000 USD.\n- sector_rotation: -62000 USD.\nThis action does not hedge the book (no per-scenario market effect), so each scenario's PnL is the frozen base PnL minus the action's cash cost (0 USD).\n\nTask:\nReject every invalid route and return the no-trade decision. Report rejected routes by route id.\n\nObjective:\nreturn no_trade if and only if every route violates a permission, session, or product constraint.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"requested_shares\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "no_trade",
      "selected_route": "none",
      "instrument": "GLD",
      "requested_shares": 800,
      "feasibility": "infeasible",
      "rejected_routes": [
        "route_a",
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "gap_down": -145000,
        "melt_up": 56000,
        "range_chop": -73000,
        "sector_rotation": -62000
      },
      "worst_case_pnl": -145000,
      "self_check": {
        "permissions_checked": true,
        "no_valid_route": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Feasibility / rejection / no-trade traps",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "unsupported_product_permission",
        "feasibility_trap": true,
        "objective_function": "objective for unsupported_product_permission",
        "deterministic_grading_fields": [
          "decision",
          "selected_route",
          "instrument",
          "requested_shares",
          "feasibility",
          "scenario_pnl.gap_down",
          "scenario_pnl.melt_up",
          "scenario_pnl.range_chop",
          "scenario_pnl.sector_rotation",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "no_trade",
        "selected_route": "none",
        "instrument": "GLD",
        "requested_shares": 800,
        "feasibility": "infeasible",
        "rejected_routes": [
          "route_a",
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "gap_down": -145000,
          "melt_up": 56000,
          "range_chop": -73000,
          "sector_rotation": -62000
        },
        "worst_case_pnl": -145000,
        "self_check": {
          "permissions_checked": true,
          "no_valid_route": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-103",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-103",
    "prompt": "Frozen market snapshot:\n- Account: US margin account. On recall, substitute listed puts for the un-locatable short.\n- Instrument: SPY ETF at 180.00. Desired bearish target: short 1200 shares of exposure.\n- Locate availability: exactly 500 shares. Option cash available: 1600 USD. Put delta -0.35 means 35 delta-shares per contract.\nCandidate routes (decide feasibility from the locate and cash limits yourself):\n- Route A (route_a): short exactly the 500 located shares and buy 2 listed puts (delta -0.35, premium 8.00 USD/share, multiplier 100) within 1600 USD option cash\n- Route B (route_b): short the full 1200-share target (requires shares beyond the locate)\n- Route C (route_c): buy 6 listed puts (premium 8.00 USD/share, multiplier 100), ignoring the option cash limit\n\nFrozen scenario PnL before action:\n- risk_off: -120000 USD.\n- squeeze: 40000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: risk_off +12000, squeeze -20000 USD. Apply this effect to each scenario, then subtract the 1600 USD cash cost from every scenario.\n\nTask:\nChoose the feasible bearish implementation that maximizes bearish delta-shares without breaching the locate or option cash. Report rejected routes by route id.\n\nObjective:\nmaximize bearish delta-shares subject to locate and option-cash constraints.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"short_shares\", \"put_contracts\", \"premium_paid\", \"bearish_delta_shares\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "trade",
      "selected_route": "route_a",
      "instrument": "SPY",
      "short_shares": 500,
      "put_contracts": 2,
      "premium_paid": 1600,
      "bearish_delta_shares": 570,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "risk_off": -109600,
        "squeeze": 18400
      },
      "worst_case_pnl": -109600,
      "self_check": {
        "within_locate": true,
        "within_option_cash": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Shorting / borrow / margin / locates",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "locate_recall_options_substitution",
        "feasibility_trap": true,
        "objective_function": "objective for locate_recall_options_substitution",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "short_shares",
          "put_contracts",
          "premium_paid",
          "bearish_delta_shares",
          "scenario_pnl.risk_off",
          "scenario_pnl.squeeze",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "selected_route": "route_a",
        "instrument": "SPY",
        "short_shares": 500,
        "put_contracts": 2,
        "premium_paid": 1600,
        "bearish_delta_shares": 570,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "risk_off": -109600,
          "squeeze": 18400
        },
        "worst_case_pnl": -109600,
        "self_check": {
          "within_locate": true,
          "within_option_cash": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-104",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-104",
    "prompt": "Frozen market snapshot:\n- Covered call on QQQ ETF: long 100 shares at 195.00, short 1 195 call.\n- Call quote: 1.40 USD/share; option multiplier 100 shares. Intrinsic = max(0, spot - strike).\n- Ordinary cash dividend 0.50/share with ex-dividend tomorrow. Early assignment of an American call is rational for the holder when the dividend exceeds the call's remaining time value.\nCandidate routes (decide which is required by the assignment economics):\n- Route A (route_a): roll/close the short call before ex-dividend to avoid early assignment\n- Route B (route_b): hold the covered call through ex-dividend unchanged\n\nFrozen scenario PnL before action:\n- rate_shock: -125000 USD.\n- vol_spike: 44000 USD.\n- credit_widening: -79000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: rate_shock +1500, vol_spike -500, credit_widening +1000 USD. Apply this effect to each scenario, then subtract the 0 USD cash cost from every scenario.\n\nTask:\nCompute the call's time value, compare to the dividend, decide the early-assignment risk, and select the route. Report rejected routes by route id.\n\nObjective:\nremove early-assignment/dividend risk when and only when it is economically rational.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"call_strike\", \"dividend_per_share\", \"call_time_value\", \"early_assignment_risk\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "manage_assignment",
      "selected_route": "route_b",
      "instrument": "QQQ",
      "call_strike": 195,
      "dividend_per_share": 0.5,
      "call_time_value": 1.4,
      "early_assignment_risk": false,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_a"
      ],
      "scenario_pnl": {
        "rate_shock": -123500,
        "vol_spike": 43500,
        "credit_widening": -78000
      },
      "worst_case_pnl": -123500,
      "self_check": {
        "compared_dividend_to_time_value": true,
        "assignment_handled": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Listed options strategy / Greeks",
        "tier": "AGI",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "covered_call_assignment",
        "feasibility_trap": true,
        "objective_function": "objective for covered_call_assignment",
        "deterministic_grading_fields": [
          "selected_route",
          "instrument",
          "call_strike",
          "dividend_per_share",
          "call_time_value",
          "early_assignment_risk",
          "scenario_pnl.rate_shock",
          "scenario_pnl.vol_spike",
          "scenario_pnl.credit_widening",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "manage_assignment",
        "selected_route": "route_b",
        "instrument": "QQQ",
        "call_strike": 195,
        "dividend_per_share": 0.5,
        "call_time_value": 1.4,
        "early_assignment_risk": false,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_a"
        ],
        "scenario_pnl": {
          "rate_shock": -123500,
          "vol_spike": 43500,
          "credit_widening": -78000
        },
        "worst_case_pnl": -123500,
        "self_check": {
          "compared_dividend_to_time_value": true,
          "assignment_handled": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-105",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-105",
    "prompt": "Frozen market snapshot:\n- Position: long 6 CL near-month futures. This is a futures roll calendar ahead of first notice; use executable bid/ask, not mid.\n- First notice day is tomorrow; account policy forbids holding physically deliverable CL long into first notice.\n- Only the displayed bid/ask is executable; mid prices are indicative and not executable.\nCandidate routes (decide feasibility yourself):\n- Route A (route_a): roll by selling near at bid 80.00 and buying next at ask 80.45; CL multiplier 1000 barrels; fee 4 USD/contract/leg\n- Route B (route_b): roll using the near/next mid prices instead of bid/ask\n- Route C (route_c): hold the long near-month position into first notice day\n\nFrozen scenario PnL before action:\n- gap_down: -130000 USD.\n- melt_up: 48000 USD.\n- range_chop: -70000 USD.\n- sector_rotation: -62000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: gap_down +3000, melt_up -1000, range_chop +2000, sector_rotation +2500 USD. Apply this effect to each scenario, then subtract the 2748 USD cash cost from every scenario.\n\nTask:\nRoll the position and compute total executable cost. Report rejected routes by route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"contracts\", \"roll_cost_usd\", \"fees_usd\", \"total_cost_usd\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "roll",
      "selected_route": "route_a",
      "contracts": 6,
      "roll_cost_usd": 2700,
      "fees_usd": 48,
      "total_cost_usd": 2748,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "gap_down": -129748,
        "melt_up": 44252,
        "range_chop": -70748,
        "sector_rotation": -62248
      },
      "worst_case_pnl": -129748,
      "self_check": {
        "uses_executable_prices": true,
        "avoids_first_notice": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Futures / commodities / spreads / rolls",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "futures_roll_calendar",
        "feasibility_trap": false,
        "objective_function": "objective for futures_roll_calendar",
        "deterministic_grading_fields": [
          "selected_route",
          "contracts",
          "roll_cost_usd",
          "fees_usd",
          "total_cost_usd",
          "scenario_pnl.gap_down",
          "scenario_pnl.melt_up",
          "scenario_pnl.range_chop",
          "scenario_pnl.sector_rotation",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "roll",
        "selected_route": "route_a",
        "contracts": 6,
        "roll_cost_usd": 2700,
        "fees_usd": 48,
        "total_cost_usd": 2748,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "gap_down": -129748,
          "melt_up": 44252,
          "range_chop": -70748,
          "sector_rotation": -62248
        },
        "worst_case_pnl": -129748,
        "self_check": {
          "uses_executable_prices": true,
          "avoids_first_notice": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-106",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-106",
    "prompt": "Frozen market snapshot:\n- Account holder: US retail customer. Account base currency: USD. Maintain a USD cash buffer; pick the lowest-USD-cost feasible conversion.\n- Required: obtain 300000 EUR settling T+2. Spot EURUSD 1.0700. EUR futures initial margin capacity: 2000 USD.\nCandidate routes (decide feasibility from jurisdiction, settlement and margin facts yourself):\n- Route A (route_a): buy EUR spot at 1.0700, settles T+2, fees included\n- Route B (route_b): use a retail CFD on EURUSD\n- Route C (route_c): use EUR futures requiring 2750 USD initial margin\n\nFrozen scenario PnL before action:\n- risk_off: -135000 USD.\n- squeeze: 52000 USD.\nThis action does not hedge the book (no per-scenario market effect), so each scenario's PnL is the frozen base PnL minus the action's cash cost (0 USD).\n\nTask:\nChoose the feasible route and compute USD cost. Report rejected routes by route id.\n\nObjective:\nobtain the EUR by the required settlement date at the lowest feasible USD cost.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"eur_amount\", \"usd_cost\", \"settlement_date_rule\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "convert_fx",
      "selected_route": "route_a",
      "eur_amount": 300000,
      "usd_cost": 321000,
      "settlement_date_rule": "T+2",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "risk_off": -135000,
        "squeeze": 52000
      },
      "worst_case_pnl": -135000,
      "self_check": {
        "settlement_matches": true,
        "product_permitted": true,
        "margin_ok": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Spot FX / CFDs / multi-currency",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "multi_currency_cash_buffer",
        "feasibility_trap": true,
        "objective_function": "objective for multi_currency_cash_buffer",
        "deterministic_grading_fields": [
          "selected_route",
          "eur_amount",
          "usd_cost",
          "settlement_date_rule",
          "scenario_pnl.risk_off",
          "scenario_pnl.squeeze",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "convert_fx",
        "selected_route": "route_a",
        "eur_amount": 300000,
        "usd_cost": 321000,
        "settlement_date_rule": "T+2",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "risk_off": -135000,
          "squeeze": 52000
        },
        "worst_case_pnl": -135000,
        "self_check": {
          "settlement_matches": true,
          "product_permitted": true,
          "margin_ok": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-107",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-107",
    "prompt": "Frozen market snapshot:\n- Account: US portfolio margin account. This is a risk budget rebalance against the stated beta target.\n- Portfolio equity beta-dollar exposure: 1000000 USD.\n- Required reduction: at least 45% of beta-dollar exposure.\n- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: 33000 USD.\n- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges 253750 beta-dollars.\nCandidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n- Route A (route_a): short 2 ES futures (beta hedge), ES at 5075.00, multiplier 50, initial margin 13,000 USD/contract, execution cost 25 USD/contract\n- Route B (route_b): short 1 ES futures, same specs as Route A\n- Route C (route_c): buy a SPY put package costing 20000 USD premium that reduces beta-dollars by 507500 USD\n- Route D (route_d): short 5 ES futures, same specs as Route A\n\nFrozen scenario PnL before action:\n- rate_shock: -140000 USD.\n- vol_spike: 56000 USD.\n- credit_widening: -76000 USD.\nThe selected route's per-scenario hedge effect (before cost) is: rate_shock +95000, vol_spike -15000, credit_widening +60000 USD. Apply this effect to each scenario, then subtract the 50 USD cash cost from every scenario.\n\nTask:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"es_contracts\", \"beta_reduction_usd\", \"beta_reduction_pct\", \"margin_used\", \"expected_cost\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "hedge",
      "selected_route": "route_a",
      "es_contracts": 2,
      "beta_reduction_usd": 507500,
      "beta_reduction_pct": 50.75,
      "margin_used": 26000,
      "expected_cost": 50,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b",
        "route_c",
        "route_d"
      ],
      "scenario_pnl": {
        "rate_shock": -45050,
        "vol_spike": 40950,
        "credit_widening": -16050
      },
      "worst_case_pnl": -45050,
      "self_check": {
        "min_reduction_met": true,
        "margin_ok": true,
        "lowest_cost_feasible": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Portfolio risk / rebalancing",
        "tier": "AGI",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "risk_budget_rebalance",
        "feasibility_trap": false,
        "objective_function": "objective for risk_budget_rebalance",
        "deterministic_grading_fields": [
          "selected_route",
          "es_contracts",
          "beta_reduction_usd",
          "beta_reduction_pct",
          "margin_used",
          "expected_cost",
          "scenario_pnl.rate_shock",
          "scenario_pnl.vol_spike",
          "scenario_pnl.credit_widening",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "hedge",
        "selected_route": "route_a",
        "es_contracts": 2,
        "beta_reduction_usd": 507500,
        "beta_reduction_pct": 50.75,
        "margin_used": 26000,
        "expected_cost": 50,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b",
          "route_c",
          "route_d"
        ],
        "scenario_pnl": {
          "rate_shock": -45050,
          "vol_spike": 40950,
          "credit_widening": -16050
        },
        "worst_case_pnl": -45050,
        "self_check": {
          "min_reduction_met": true,
          "margin_ok": true,
          "lowest_cost_feasible": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-108",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-108",
    "prompt": "Frozen market snapshot:\n- Instrument: NVDA common stock. Order-book liquidity limit: maximize fill under the average-price cap.\n- Mid price: 130.00. Maximum average execution price (cap): 130.11.\n- Ask book: 40000 @ 130.05; 40000 @ 130.10; 20000 @ 130.30.\n- Partial fills allowed only in 500-share clips. Fees ignored.\nCandidate routes:\n- Route A (route_a): walk the book filling cheapest levels first in 500-share clips while keeping the running average <= the cap\n- Route B (route_b): take the full displayed size across all levels at a single 130.30 limit\n\nFrozen scenario PnL before action:\n- gap_down: -145000 USD.\n- melt_up: 40000 USD.\n- range_chop: -79000 USD.\n- sector_rotation: -62000 USD.\nThis action does not hedge the book (no per-scenario market effect), so each scenario's PnL is the frozen base PnL minus the action's cash cost (0 USD).\n\nTask:\nCompute the maximum buy quantity in allowed clips that keeps the average price at or below the cap. Report rejected routes by route id.\n\nObjective:\nmaximize filled_shares subject to average_price <= the cap, in 500-share clips.\n\nOutput JSON fields: { \"decision\", \"instrument\", \"side\", \"clip_size_shares\", \"filled_shares\", \"average_price\", \"limit_price\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "trade",
      "instrument": "NVDA",
      "side": "buy",
      "clip_size_shares": 500,
      "filled_shares": 94500,
      "average_price": 130.11,
      "limit_price": 130.3,
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ],
      "scenario_pnl": {
        "gap_down": -145000,
        "melt_up": 40000,
        "range_chop": -79000,
        "sector_rotation": -62000
      },
      "worst_case_pnl": -145000,
      "self_check": {
        "average_price_within_cap": true,
        "max_fill_in_clips": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Execution / liquidity / microstructure",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "order_book_liquidity_limit",
        "feasibility_trap": true,
        "objective_function": "objective for order_book_liquidity_limit",
        "deterministic_grading_fields": [
          "instrument",
          "side",
          "clip_size_shares",
          "filled_shares",
          "average_price",
          "limit_price",
          "scenario_pnl.gap_down",
          "scenario_pnl.melt_up",
          "scenario_pnl.range_chop",
          "scenario_pnl.sector_rotation",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "trade",
        "instrument": "NVDA",
        "side": "buy",
        "clip_size_shares": 500,
        "filled_shares": 94500,
        "average_price": 130.11,
        "limit_price": 130.3,
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ],
        "scenario_pnl": {
          "gap_down": -145000,
          "melt_up": 40000,
          "range_chop": -79000,
          "sector_rotation": -62000
        },
        "worst_case_pnl": -145000,
        "self_check": {
          "average_price_within_cap": true,
          "max_fill_in_clips": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-109",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-109",
    "prompt": "Frozen market snapshot:\n- Instrument: TSLA common stock at 260.00. US equities settle T+1.\n- Trade date 2026-06-15; T+1 cash settlement date 2026-06-16. Unsettled proceeds cannot be withdrawn before settlement.\nCandidate routes (decide which respects settlement):\n- Route A (route_a): sell 300 shares on 2026-06-15; withdraw cash only after T+1 settlement on 2026-06-16\n- Route B (route_b): sell 300 shares on 2026-06-15 and withdraw the proceeds on the trade date 2026-06-15\n\nFrozen scenario PnL before action:\n- risk_off: -120000 USD.\n- squeeze: 44000 USD.\nThis action does not hedge the book (no per-scenario market effect), so each scenario's PnL is the frozen base PnL minus the action's cash cost (0 USD).\n\nTask:\nSell and report trade value and the T+1 cash date. Report rejected routes by route id.\n\nObjective:\nselect the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"trade_value_usd\", \"settlement_rule\", \"settlement_cash_date\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "sell",
      "selected_route": "route_a",
      "trade_value_usd": 78000,
      "settlement_rule": "T+1",
      "settlement_cash_date": "2026-06-16",
      "feasibility": "feasible",
      "rejected_routes": [
        "route_b"
      ],
      "scenario_pnl": {
        "risk_off": -120000,
        "squeeze": 44000
      },
      "worst_case_pnl": -120000,
      "self_check": {
        "settlement_respected": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Corporate actions / settlement / calendar / jurisdiction",
        "tier": "AGI",
        "capability_tag": "execution_action_quality",
        "scenario_family": "t_plus_one_settlement_sequence",
        "feasibility_trap": true,
        "objective_function": "objective for t_plus_one_settlement_sequence",
        "deterministic_grading_fields": [
          "selected_route",
          "trade_value_usd",
          "settlement_rule",
          "settlement_cash_date",
          "scenario_pnl.risk_off",
          "scenario_pnl.squeeze",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "sell",
        "selected_route": "route_a",
        "trade_value_usd": 78000,
        "settlement_rule": "T+1",
        "settlement_cash_date": "2026-06-16",
        "feasibility": "feasible",
        "rejected_routes": [
          "route_b"
        ],
        "scenario_pnl": {
          "risk_off": -120000,
          "squeeze": 44000
        },
        "worst_case_pnl": -120000,
        "self_check": {
          "settlement_respected": true
        }
      }
    }
  },
  {
    "id": "SB-AGI-110",
    "level": 11,
    "type": "schema",
    "rubric_id": "stockbench-agi-110",
    "prompt": "Frozen market snapshot:\n- Jurisdiction / account regime: US cash account.\n- Permissions: CFDs unavailable; short selling unavailable in cash accounts; futures not approved; the regular equity session is closed.\n- No alternative product permission is enabled in this packet.\nCandidate routes (decide feasibility from the permission facts; a no-trade is required if all routes violate constraints):\n- Route A (route_a): short 400 XLK shares via CFD after the regular session close\n- Route B (route_b): short 400 XLK shares in the cash account\n- Route C (route_c): buy XLK futures to get short exposure\n\nFrozen scenario PnL before action:\n- rate_shock: -125000 USD.\n- vol_spike: 48000 USD.\n- credit_widening: -73000 USD.\nThis action does not hedge the book (no per-scenario market effect), so each scenario's PnL is the frozen base PnL minus the action's cash cost (0 USD).\n\nTask:\nReject every invalid route and return the no-trade decision. Report rejected routes by route id.\n\nObjective:\nreturn no_trade if and only if every route violates a permission, session, or product constraint.\n\nOutput JSON fields: { \"decision\", \"selected_route\", \"instrument\", \"requested_shares\", \"feasibility\", \"rejected_routes\", \"scenario_pnl\", \"worst_case_pnl\", \"self_check\" }",
    "expected_values": {
      "decision": "no_trade",
      "selected_route": "none",
      "instrument": "XLK",
      "requested_shares": 400,
      "feasibility": "infeasible",
      "rejected_routes": [
        "route_a",
        "route_b",
        "route_c"
      ],
      "scenario_pnl": {
        "rate_shock": -125000,
        "vol_spike": 48000,
        "credit_widening": -73000
      },
      "worst_case_pnl": -125000,
      "self_check": {
        "permissions_checked": true,
        "no_valid_route": true
      }
    },
    "context": {
      "benchmark": "StockBench",
      "stockbench": {
        "primary_domain": "Feasibility / rejection / no-trade traps",
        "tier": "AGI",
        "capability_tag": "judgment_risk_augmentation",
        "scenario_family": "unsupported_product_permission",
        "feasibility_trap": true,
        "objective_function": "objective for unsupported_product_permission",
        "deterministic_grading_fields": [
          "decision",
          "selected_route",
          "instrument",
          "requested_shares",
          "feasibility",
          "scenario_pnl.rate_shock",
          "scenario_pnl.vol_spike",
          "scenario_pnl.credit_widening",
          "worst_case_pnl"
        ]
      },
      "canonical_answer": {
        "decision": "no_trade",
        "selected_route": "none",
        "instrument": "XLK",
        "requested_shares": 400,
        "feasibility": "infeasible",
        "rejected_routes": [
          "route_a",
          "route_b",
          "route_c"
        ],
        "scenario_pnl": {
          "rate_shock": -125000,
          "vol_spike": 48000,
          "credit_widening": -73000
        },
        "worst_case_pnl": -125000,
        "self_check": {
          "permissions_checked": true,
          "no_valid_route": true
        }
      }
    }
  }
];
