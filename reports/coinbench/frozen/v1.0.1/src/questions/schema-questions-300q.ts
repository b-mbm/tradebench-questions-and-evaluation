import type { SchemaQuestion } from '../types/schema';

// Generated from tradebench-lite-tests commit 7a1c3e33.
// Keep isolated from schema-questions.ts so the 60Q suite remains unchanged.

export const SCHEMA_QUESTIONS_300Q: SchemaQuestion[] = [
  {
    "id": "L1-001",
    "level": 1,
    "prompt": "Buy 0.5 BTC at market price",
    "rubric_id": "market_buy",
    "expected_values": {
      "intent": "buy",
      "order_type": "market",
      "asset": "BTC",
      "size": 0.5,
      "venue": "cex"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L1-002",
    "level": 1,
    "prompt": "Buy 10 SOL using a limit order at $95",
    "rubric_id": "limit_buy",
    "expected_values": {
      "intent": "buy",
      "order_type": "limit",
      "asset": "SOL",
      "size": 10,
      "price": 95,
      "venue": "cex"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L1-003",
    "level": 1,
    "prompt": "Set stop loss on my 2 ETH at $2,800",
    "rubric_id": "stop_loss",
    "expected_values": {
      "intent": "set_stop_loss",
      "order_type": "stop",
      "asset": "ETH",
      "size": 2,
      "price": 2800,
      "venue": "cex"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L2-001",
    "level": 2,
    "prompt": "Swap 5000 USDC for DAI on Ethereum",
    "rubric_id": "dex_swap",
    "expected_values": {
      "intent": "swap",
      "order_type": "market",
      "asset": "DAI",
      "size": 5000,
      "venue": "dex",
      "venue_name": "uniswap"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L2-002",
    "level": 2,
    "prompt": "Buy 100,000 PEPE with 15% slippage tolerance",
    "rubric_id": "dex_swap",
    "expected_values": {
      "intent": "buy",
      "order_type": "market",
      "asset": "PEPE",
      "size": 100000,
      "venue": "dex",
      "venue_name": "memecoin pool",
      "risk_controls": {
        "slippage_tolerance": "15%"
      }
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L2-003",
    "level": 2,
    "prompt": "Buy 1000 MATIC with minimal gas fees",
    "rubric_id": "dex_swap",
    "expected_values": {
      "intent": "buy",
      "order_type": "market",
      "asset": "MATIC",
      "size": 1000,
      "venue": "dex",
      "venue_name": "polygon"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L2-004",
    "level": 2,
    "prompt": "Analyze liquidity before swapping 50,000 USDC for WETH",
    "rubric_id": "arbitrage",
    "expected_values": {
      "intent": "analyze_liquidity",
      "order_type": "analysis",
      "asset": "USDC/WETH",
      "size": 50000,
      "venue": "dex",
      "venue_name": "uniswap"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L3-001",
    "level": 3,
    "prompt": "Bridge 1000 USDC to Arbitrum and buy ARB",
    "rubric_id": "cross_chain_bridge",
    "expected_values": {
      "intent": "bridge_and_swap",
      "order_type": "bridge",
      "asset": "USDC",
      "size": 1000,
      "venue": "bridge",
      "venue_name": "arbitrum bridge"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L3-002",
    "level": 3,
    "prompt": "Split 10,000 USDC equally across Ethereum, Arbitrum, and Optimism",
    "rubric_id": "cross_chain_bridge",
    "expected_values": {
      "intent": "bridge_distribution",
      "order_type": "bridge",
      "asset": "USDC",
      "size": 10000,
      "venue": "bridge",
      "venue_name": "multi-bridge"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L3-003",
    "level": 3,
    "prompt": "Bridge 2 ETH from Ethereum to Polygon and swap for MATIC",
    "rubric_id": "cross_chain_bridge",
    "expected_values": {
      "intent": "bridge_and_swap",
      "order_type": "bridge",
      "asset": "ETH",
      "size": 2,
      "venue": "bridge",
      "venue_name": "polygon pos"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L4-001",
    "level": 4,
    "prompt": "Rebalance my portfolio to 60% BTC, 30% ETH, 10% USDC. Optimize for matching the 60/30/10 target weights exactly; if current holdings are missing, require follow-up before execution.",
    "rubric_id": "arbitrage",
    "expected_values": {
      "intent": "rebalance_portfolio",
      "order_type": "execution_plan",
      "asset": "multi",
      "size": "60/30/10",
      "venue": "cex"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L4-002",
    "level": 4,
    "prompt": "Assess correlation risk across BTC, ETH, SOL, MATIC, LINK. Optimize for identifying portfolio-wide correlation risk across all five listed assets and actionable diversification implications.",
    "rubric_id": "arbitrage",
    "expected_values": {
      "intent": "assess_correlation",
      "order_type": "analysis",
      "asset": "portfolio",
      "size": "multi-asset",
      "venue": "analysis"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L4-003",
    "level": 4,
    "prompt": "Identify tax loss harvesting opportunities in my portfolio",
    "rubric_id": "arbitrage",
    "expected_values": {
      "intent": "tax_loss_harvest",
      "order_type": "analysis",
      "asset": "portfolio",
      "size": "losers",
      "venue": "analysis"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L4-004",
    "level": 4,
    "prompt": "Stress test my portfolio for a -50% crypto crash",
    "rubric_id": "arbitrage_stress_test",
    "expected_values": {
      "intent": "stress_test",
      "order_type": "analysis",
      "asset": "portfolio",
      "size": "-50%",
      "venue": "analysis"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L4-005",
    "level": 4,
    "prompt": "Calculate my Sharpe ratio given the context data",
    "rubric_id": "arbitrage",
    "expected_values": {
      "intent": "calculate_sharpe",
      "order_type": "analysis",
      "asset": "portfolio",
      "size": "context",
      "venue": "analysis"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L5-001",
    "level": 5,
    "prompt": "Add $100,000 of 50/50 ETH/USDC liquidity to a Uniswap V3 ETH/USDC position. The current ETH mark is $2,800, so the proposed $2,700–$2,900 range is initially active. For this synthetic scenario, assess impermanent loss at the $2,700 stress boundary versus holding the same initial 50/50 inventory using IL(r) = 2*sqrt(r)/(1+r)-1 where r = stressed_price/current_price; exclude fee income and gas from that IL calculation. The risk mandate is stress IL no worse than -8%, and the position must be managed as concentrated liquidity—not a market or limit order. State the range, the stress IL calculation, a rebalance/exit trigger, and the reason the position meets the mandate.",
    "rubric_id": "coinbench-l5-001",
    "expected_values": {
      "intent": "provide_liquidity",
      "order_type": "range_lp",
      "asset": "ETH/USDC",
      "size": "concentrated",
      "venue": "dex",
      "venue_name": "uniswap v3"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L5-002",
    "level": 5,
    "prompt": "Create a 3x ETH long using exactly 1 ETH worth $3,000 on Aave V3. In this synthetic scenario, ETH supplied as collateral has a 80% maximum borrow LTV and an 82.5% liquidation threshold; USDC can be borrowed and swapped into ETH at 1 USDC per USD of ETH with a 0.10% swap cost paid from a separate gas balance, so it does not reduce the $6,000 ETH purchase. Define 3x as $9,000 total ETH exposure: supply the initial ETH, borrow only the $6,000 USDC needed to buy the additional ETH, then resupply that ETH. Health factor is collateral_value*0.825/debt; set a monitoring/repayment trigger before it reaches 1.10. Do not borrow ETH or exceed the stated LTV, and report the collateral, USDC debt, total ETH exposure, and trigger.",
    "rubric_id": "coinbench-l5-002",
    "expected_values": {
      "intent": "leveraged_long",
      "order_type": "recursive_borrow",
      "asset": "ETH",
      "size": "3x",
      "venue": "lending_protocol",
      "venue_name": "aave"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L5-003",
    "level": 5,
    "prompt": "Enter delta-neutral yield farming with 5 ETH",
    "rubric_id": "arbitrage",
    "expected_values": {
      "intent": "delta_neutral_yield",
      "order_type": "strategy",
      "asset": "ETH",
      "size": 5,
      "venue": "defi"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L5-004",
    "level": 5,
    "prompt": "Borrow 5000 USDC against my 2 ETH collateral",
    "rubric_id": "lending_borrow",
    "expected_values": {
      "intent": "borrow",
      "order_type": "loan",
      "asset": "USDC",
      "size": 5000,
      "venue": "lending_protocol",
      "venue_name": "aave"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L5-005",
    "level": 5,
    "prompt": "Stake 10 ETH for liquid staking tokens",
    "rubric_id": "liquidity_provision",
    "expected_values": {
      "intent": "stake",
      "order_type": "liquid_staking",
      "asset": "ETH",
      "size": 10,
      "venue": "staking",
      "venue_name": "lido"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L6-001",
    "level": 6,
    "prompt": "Buy 2 ETH $3,500 calls expiring in 30 days",
    "rubric_id": "options_hedge",
    "expected_values": {
      "intent": "buy_call",
      "order_type": "options",
      "asset": "ETH",
      "size": 2,
      "price": 3500,
      "venue": "options_exchange",
      "venue_name": "deribit"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L6-002",
    "level": 6,
    "prompt": "Set up DCA — buy $500 of BTC weekly for 3 months",
    "rubric_id": "futures_trade",
    "expected_values": {
      "intent": "buy",
      "order_type": "dca",
      "asset": "BTC",
      "size": 500,
      "venue": "cex"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L6-003",
    "level": 6,
    "prompt": "Create ladder buy orders every $1,000 from $40k to $45k for BTC",
    "rubric_id": "futures_trade",
    "expected_values": {
      "intent": "buy",
      "order_type": "ladder_limit",
      "asset": "BTC",
      "size": "multi-order",
      "venue": "cex"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L6-004",
    "level": 6,
    "prompt": "BTC is marked at $45,000 in this frozen scenario. Set a trailing stop for my 0.5 BTC exactly 5% below that mark: the required initial stop price is $42,750. State the trailing percentage and the stop price.",
    "rubric_id": "stop_loss",
    "expected_values": {
      "intent": "set_trailing_stop",
      "order_type": "trailing_stop",
      "asset": "BTC",
      "size": 0.5,
      "price": 42750,
      "venue": "cex"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L6-005",
    "level": 6,
    "prompt": "Execute a TWAP order to sell 10 ETH over the next 4 hours",
    "rubric_id": "twap_order",
    "expected_values": {
      "intent": "sell",
      "order_type": "twap",
      "asset": "ETH",
      "size": 10,
      "duration": "4 hours",
      "venue": "cex"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L7-001",
    "level": 7,
    "prompt": "Analyze whether a flash-loan arbitrage executor should run this synthetic two-DEX opportunity. Borrow 1,000,000 USDC for one transaction. DEX A sells ETH at $3,000 and charges its 0.05% fee from the USDC input before ETH is received; DEX B buys that received ETH at $3,015 and charges its 0.05% fee from USDC sale proceeds. The flash loan costs 0.09% of borrowed USDC; gas and priority fees total $1,200. The executor may run only if net profit after every stated cost is at least $1,000, and all legs must be atomic. Return an arbitrage analysis (not a live order) with the gross proceeds, each cost, net profit, and the explicit failure condition net profit < $1,000.",
    "rubric_id": "coinbench-l7-001",
    "expected_values": {
      "intent": "analyze_arbitrage",
      "order_type": "analysis",
      "asset": "multi",
      "size": "flash-loan",
      "venue": "dex",
      "venue_name": "defi"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L7-002",
    "level": 7,
    "prompt": "Unwind my underwater position: 5 ETH collateral, 7,000 USDC borrowed",
    "rubric_id": "lending_borrow",
    "expected_values": {
      "intent": "deleverage",
      "order_type": "repay",
      "asset": "USDC",
      "size": 7000,
      "venue": "lending_protocol",
      "venue_name": "aave"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L7-003",
    "level": 7,
    "prompt": "I provided liquidity to an ETH/USDC pool when ETH was $3,000. After 30 days, ETH is now $5,000. During this period, I earned $847 in trading fees. My initial position was $10,000. Calculate the net return from the combined effect of impermanent loss and fees on my initial investment.",
    "rubric_id": "lp_net_return_analysis",
    "expected_values": {
      "intent": "calculate_lp_return",
      "order_type": "analysis",
      "asset": "ETH/USDC",
      "size": 10000,
      "venue": "dex",
      "il_percentage": 3.18,
      "il_loss_usd": 424,
      "net_gain_usd": 423,
      "net_return_pct": 4.23,
      "hold_value": 13334,
      "lp_value": 12910,
      "reasoning": "Impermanent loss caused $424 loss (3.18%) due to ETH price change from $3,000 to $5,000. Trading fees earned $847. Net effect: $423 gain on initial $10,000 investment, yielding 4.23% return."
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei",
      "initial_eth_price": 3000,
      "final_eth_price": 5000,
      "time_period_days": 30,
      "fees_earned_usd": 847,
      "initial_position_usd": 10000,
      "pool_type": "constant_product_amm",
      "note": "Position started as 50/50 split: 1.6667 ETH + 5000 USDC. Model must synthesize impermanent loss calculation with fee earnings to derive net return on capital."
    }
  },
  {
    "id": "L7-004",
    "level": 7,
    "prompt": "I have $100,000 USDC allocated across three DeFi protocols:\n\n50% ($50,000) → Aave USDC Lending\n- APY: 4.2%\n- Risk Score: 1.0\n\n30% ($30,000) → Curve 3pool (USDC/USDT/DAI)\n- APY: 6.8%\n- Risk Score: 2.0\n\n20% ($20,000) → Yearn USDC Vault\n- APY: 8.1%\n- Risk Score: 3.0\n\nThe current risk-free rate (US T-Bills) is 5.0%.\n\nCalculate: (1) the portfolio's blended APY, (2) the portfolio's weighted-average risk score, (3) the portfolio's excess return over the risk-free rate, (4) the portfolio's risk-adjusted return ratio (excess return divided by weighted risk), and (5) the expected annual yield in USD.",
    "rubric_id": "portfolio_efficiency_analysis",
    "expected_values": {
      "intent": "calculate_portfolio_efficiency",
      "order_type": "analysis",
      "asset": "USDC",
      "size": 100000,
      "venue": "multi_protocol",
      "blended_apy": 5.76,
      "weighted_risk_score": 1.7,
      "excess_return": 0.76,
      "risk_adjusted_ratio": 0.45,
      "total_annual_yield_usd": 5760,
      "allocation": {
        "aave": 50000,
        "curve": 30000,
        "yearn": 20000
      },
      "reasoning": "Blended APY: 50%*4.2% + 30%*6.8% + 20%*8.1% = 5.76%. Weighted risk: 50%*1.0 + 30%*2.0 + 20%*3.0 = 1.7. Excess return: 5.76% - 5.0% = 0.76%. Risk-adjusted ratio: 0.76% / 1.7 = 0.45. Total yield: $100k * 5.76% = $5,760."
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei",
      "total_capital": 100000,
      "aave_allocation_pct": 0.5,
      "curve_allocation_pct": 0.3,
      "yearn_allocation_pct": 0.2,
      "aave_apy": 4.2,
      "curve_apy": 6.8,
      "yearn_apy": 8.1,
      "aave_risk": 1,
      "curve_risk": 2,
      "yearn_risk": 3,
      "risk_free_rate": 5,
      "note": "Model must chain calculations: blended_apy → excess_return → risk_adjusted_ratio. Each step uses outputs from previous steps."
    }
  },
  {
    "id": "L7-005",
    "level": 7,
    "prompt": "I want to sell 100 ETH for USDC. I have three execution options:\n\n**Option A: Uniswap (No MEV Protection)**\n- Expected slippage: 0.3%\n- Gas cost: $50\n- MEV risk: 1.2% (average frontrun/sandwich loss)\n\n**Option B: CowSwap (MEV Protected)**\n- Expected slippage: 0.4%\n- Gas cost: $0 (gasless)\n- MEV risk: 0%\n\n**Option C: 1inch Fusion (Partial MEV Protection)**\n- Expected slippage: 0.35%\n- Gas cost: $25\n- MEV risk: 0.4% (reduced via private RPC)\n\nCurrent ETH price: $3,000\n\nCalculate: (1) the total cost percentage for each option (slippage + gas + MEV as % of gross value), (2) the expected net proceeds in USDC for each option, (3) which option maximizes net proceeds, and (4) the dollar amount saved by choosing the best option versus the worst option.\n\nSchema hint: Return JSON covering intent, order_type, asset, size, eth_price, gross_value, per-option slippage/gas/mev costs, total_cost, total_cost_pct, net_proceeds, best_option, worst_option, savings_vs_worst, venue, venue_name, reasoning.",
    "rubric_id": "mev_protection_cost_benefit",
    "expected_values": {
      "intent": "sell_with_mev_analysis",
      "order_type": "comparative_analysis",
      "asset": "ETH",
      "size": 100,
      "eth_price": 3000,
      "gross_value": 300000,
      "uniswap_slippage_cost": 900,
      "uniswap_gas_cost": 50,
      "uniswap_mev_cost": 3600,
      "uniswap_total_cost": 4550,
      "uniswap_total_cost_pct": 1.52,
      "uniswap_net_proceeds": 295450,
      "cowswap_slippage_cost": 1200,
      "cowswap_gas_cost": 0,
      "cowswap_mev_cost": 0,
      "cowswap_total_cost": 1200,
      "cowswap_total_cost_pct": 0.4,
      "cowswap_net_proceeds": 298800,
      "oneinch_slippage_cost": 1050,
      "oneinch_gas_cost": 25,
      "oneinch_mev_cost": 1200,
      "oneinch_total_cost": 2275,
      "oneinch_total_cost_pct": 0.76,
      "oneinch_net_proceeds": 297725,
      "best_option": "cowswap",
      "worst_option": "uniswap",
      "savings_vs_worst": 3350,
      "venue": "dex",
      "venue_name": "cowSwap",
      "reasoning": "CowSwap provides highest net proceeds ($298,800) with lowest total cost (0.40%). Despite slightly higher slippage (0.4% vs Uniswap 0.3%), eliminating gas and MEV loss saves $3,350 vs Uniswap and $1,075 vs 1inch."
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei",
      "eth_amount": 100,
      "eth_price_usd": 3000,
      "gross_value_usd": 300000,
      "uniswap_slippage_pct": 0.3,
      "uniswap_gas_usd": 50,
      "uniswap_mev_pct": 1.2,
      "cowswap_slippage_pct": 0.4,
      "cowswap_gas_usd": 0,
      "cowswap_mev_pct": 0,
      "oneinch_slippage_pct": 0.35,
      "oneinch_gas_usd": 25,
      "oneinch_mev_pct": 0.4,
      "note": "Model must synthesize slippage + gas + MEV costs for each option, calculate net proceeds, identify best vs worst venue, and compute savings as the difference in net proceeds."
    }
  },
  {
    "id": "L8-001",
    "level": 8,
    "prompt": "You have $5,000,000 USDC to deploy into a 90-day yield strategy combining:\n\nOption 1: Pendle PT-stETH (maturity in 90 days)\n* Current market: 1 PT-stETH = 0.970 stETH (3% discount)\n* At maturity: 1 PT-stETH redeems for 1.000 stETH\n* stETH spot price: $3,500\n* Entry slippage: 0.08%\n\nOption 2: Convex-Boosted Curve 3pool\n* Base Curve APR: 4.2%\n* Convex boost: 2.5x (requires vlCVX lock)\n* vlCVX requirement: 30 tokens per $100,000 staked\n* vlCVX cost: $5.50 per token\n* vlCVX lock: 16 weeks (opportunity cost at 3% annual rate)\n* Entry slippage: 0.05%\n\nCosts:\n* Total gas (PT redemption + Convex operations): $150\n\nConstraints:\n* Maintain ≥35% in Curve 3pool (24h liquidity requirement)\n* Maximum ≤70% in Pendle PT\n\nTask: Calculate the optimal allocation as numerical dollar values and the resulting annualized net yield as a percentage.",
    "rubric_id": "multi_protocol_yield_optimization",
    "expected_values": {
      "intent": "multi_protocol_yield_stack",
      "order_type": "pendle_pt_convex_boost",
      "asset": "USDC",
      "size": 5000000,
      "venue": "defi_multi",
      "venue_name": "pendle+convex",
      "expected_value": 11.55,
      "unit": "annualized_net_yield_percentage",
      "allocation": {
        "pendle_pt_steth": 3250000,
        "convex_curve_3pool": 1750000
      }
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei",
      "total_capital_usdc": 5000000,
      "time_horizon_days": 90,
      "pendle_pt_steth": {
        "discount_price_steth": 0.97,
        "redemption_price_steth": 1,
        "discount_pct": 0.03,
        "entry_slippage": 0.0008,
        "steth_spot_usd": 3500
      },
      "convex_curve_3pool": {
        "base_apr": 0.042,
        "boost_multiplier": 2.5,
        "entry_slippage": 0.0005
      },
      "vlcvx": {
        "tokens_per_100k": 30,
        "cost_per_token_usd": 5.5,
        "lock_weeks": 16,
        "opportunity_cost_rate": 0.03
      },
      "total_gas_usd": 150,
      "allocation_constraints": {
        "convex_min_pct": 0.35,
        "pendle_max_pct": 0.7
      },
      "note": "Blend Pendle PT discount accrual with Convex boosted yield while respecting minimum Curve liquidity and maximum Pendle exposure."
    }
  },
  {
    "id": "L8-002",
    "level": 8,
    "prompt": "Execute: $5,000,000 USDC → ETH on Ethereum mainnet.\n\nMarket conditions:\n- ETH price: $2,850\n- Expected sandwich attack loss (public mempool): $22,000\n- Base fee: 150 gwei\n- Block time: 12 seconds\n\nEvaluate MEV defense strategies:\n\n**Strategy A: Flashbots Protect**\n- Setup fee: $180\n- Gas: 320,000 units at 2 gwei priority fee\n- Execution: 2 blocks average (24 seconds)\n- MEV protection: 98.5% (verified benchmark)\n- Success rate: 96% first attempt\n- Retry cost if failed: $65\n\n**Strategy B: Direct DEX (Uniswap V3)**\n- Gas: 180,000 units at 150 gwei base + 20 gwei priority\n- Execution: Immediate (1 block)\n- MEV protection: 0%\n- Expected sandwich loss: $22,000\n- Success rate: 100%\n\nCalculate total expected cost for each strategy and select the optimal one.\n\nNote: Slippage (0.3%) is constant across both strategies.",
    "rubric_id": "execute_mev_defense",
    "expected_values": {
      "intent": "execute_mev_defense",
      "strategy": "A",
      "expected_total_cost": 651,
      "unit": "USD"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei",
      "eth_price_usd": 2850,
      "sandwich_loss_usd": 22000,
      "base_fee_gwei": 150,
      "block_time_seconds": 12,
      "strategies": {
        "A": {
          "setup_fee_usd": 180,
          "gas_units": 320000,
          "priority_fee_gwei": 2,
          "mev_protection_pct": 98.5,
          "success_rate": 0.96,
          "retry_cost_usd": 65,
          "execution_blocks": 2
        },
        "B": {
          "gas_units": 180000,
          "priority_fee_gwei": 20,
          "mev_protection_pct": 0,
          "success_rate": 1,
          "expected_mev_loss_usd": 22000,
          "execution_blocks": 1
        }
      },
      "slippage_pct": 0.3,
      "note": "Compare expected total costs for Flashbots Protect vs direct Uniswap execution, incorporating gas, fees, residual MEV, and retry probability."
    }
  },
  {
    "id": "L8-003",
    "level": 8,
    "prompt": "**Scenario:**\nYou manage a $1M risk-parity portfolio currently allocated as:\n- BTC: $400,000 (40%)\n- ETH: $350,000 (35%)\n- US 10Y Treasury bonds: $250,000 (25%)\n\n**Current Market State:**\n- BTC 30-day realized volatility: 60% annualized\n- ETH 30-day realized volatility: 80% annualized\n- 10Y Treasury volatility: 10% annualized\n- Correlation matrix:\n  - BTC-ETH: 0.85\n  - BTC-Bonds: 0.05\n  - ETH-Bonds: 0.03\n\n**Risk Parity Target:** Each asset should contribute equally (33.33%) to total portfolio risk.\n\n**Rebalancing Trigger:** Execute rebalancing if any asset's risk contribution deviates by more than ±5 percentage points from target (i.e., outside 28.33%-38.33% range).\n\n**Transaction Constraints:**\n- Minimum trade size: $10,000\n- Round all trades to nearest $1,000\n- Execution slippage: 0.5% for crypto, 0.1% for bonds\n\n**Task:**\nDetermine the current risk contribution of each asset and construct executable rebalancing transactions if the trigger threshold is breached. Your solution must use true risk-parity optimization that accounts for asset correlations.\n\nSchema hint: Return JSON including base fields (intent, order_type, asset, size, venue, reasoning) and analysis fields (portfolio_volatility, risk_contributions, rebalancing_required, target_allocations_usd, transactions). Also include top-level numeric mirrors for grading: btc_contribution_pct, eth_contribution_pct, bonds_contribution_pct, target_btc_usd, target_eth_usd, target_bonds_usd, btc_sell_amount, eth_sell_amount, bonds_buy_amount, btc_post_slippage, eth_post_slippage, bonds_post_slippage.",
    "rubric_id": "risk_parity_rebalance",
    "expected_values": {
      "intent": "risk_parity",
      "order_type": "analysis",
      "asset": "btc/eth/bonds",
      "size": "risk-weighted",
      "venue": "analysis",
      "portfolio_volatility": 50.19,
      "btc_contribution_pct": 45.66,
      "eth_contribution_pct": 53.89,
      "bonds_contribution_pct": 0.45,
      "rebalancing_required": true,
      "target_btc_usd": 101000,
      "target_eth_usd": 77000,
      "target_bonds_usd": 822000,
      "btc_sell_amount": 299000,
      "eth_sell_amount": 273000,
      "bonds_buy_amount": 572000,
      "btc_post_slippage": 297505,
      "eth_post_slippage": 271635,
      "bonds_post_slippage": 572572
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei",
      "portfolio_value_usd": 1000000,
      "current_allocations_usd": {
        "btc": 400000,
        "eth": 350000,
        "bonds": 250000
      },
      "volatilities_annualized": {
        "btc": 0.6,
        "eth": 0.8,
        "bonds": 0.1
      },
      "correlations": {
        "btc_eth": 0.85,
        "btc_bonds": 0.05,
        "eth_bonds": 0.03
      },
      "target_risk_contribution_pct": 33.3333,
      "trigger_band_pct": {
        "min": 28.33,
        "max": 38.33
      },
      "constraints": {
        "min_trade_usd": 10000,
        "rounding_usd": 1000,
        "slippage_crypto": 0.005,
        "slippage_bonds": 0.001
      },
      "note": "Use correlation-aware risk-parity optimization (equal risk contributions). Compute current contributions, check ±5pp band, compute targets, and construct rounded transactions with post-slippage amounts."
    }
  },
  {
    "id": "L8-004",
    "level": 8,
    "prompt": "Optimal Re-staking Strategy with Loan Arbitrage\n\nYou have 100 ETH currently staked via Lido (earning 4.2% APR as stETH). You're considering re-staking strategies to boost yield. In 8 days, you plan to use this position as collateral to borrow 50 ETH at 5.5% APR for a profitable farming opportunity. Analyze these three options:\n\n**Option A: EigenLayer AVS Restaking**\n- Additional APR: 2.8% (from AVS rewards)\n- Slashing risk: 3% of staked amount (annual probability)\n- Minimum lock period: 7 days\n- Current TVL: $8.2B (highly liquid)\n- Accepts stETH as collateral: Yes\n\n**Option B: Symbiotic Protocol Restaking**\n- Additional APR: 4.1% (from operator fees)\n- Slashing risk: 5% of staked amount (annual probability)\n- Minimum lock period: 14 days\n- Current TVL: $890M (lower liquidity)\n- Accepts stETH as collateral: Yes\n\n**Option C: Maintain Lido stETH Only**\n- Additional APR: 0% (baseline)\n- Slashing risk: 0% (no additional risk)\n- Minimum lock period: 0 days\n- Liquid staking token (instant liquidity)\n- Accepts stETH as collateral: Yes\n\n**Constraints**\n1. Position must be available as collateral within 8 days for the loan (hard requirement)\n2. Target minimum net APR after borrowing costs: 1.0%\n3. Maximum acceptable slashing risk: 4% of principal\n\n**Task**\nDetermine which strategy maximizes net return while satisfying all constraints. Consider the arbitrage spread between staking yield and borrow costs. Respond with JSON including core execution fields plus decision rationale and detailed factors.\n\nSchema hint: Provide top-level keys intent, order_type, asset, size, venue, venue_name, rationale, decision_factors along with flattened numeric mirrors (total_staking_apr, borrow_rate, effective_borrow_cost_on_portfolio, net_apr_after_borrow, meets_net_apr_target, slashing_risk_pct, within_risk_tolerance, liquidity_days, meets_collateral_timing, option_c_net_apr_comparison, option_a_outperformance).",
    "rubric_id": "restaking_optimization",
    "expected_values": {
      "intent": "restake",
      "order_type": "liquid_staking",
      "asset": "stETH",
      "size": "100",
      "venue": "eigenlayer",
      "venue_name": "eigenlayer",
      "total_staking_apr": 7,
      "borrow_rate": 5.5,
      "effective_borrow_cost_on_portfolio": 2.75,
      "net_apr_after_borrow": 4.25,
      "meets_net_apr_target": true,
      "slashing_risk_pct": 3,
      "within_risk_tolerance": true,
      "liquidity_days": 7,
      "meets_collateral_timing": true,
      "option_c_net_apr_comparison": 1.45,
      "option_a_outperformance": 2.8
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei",
      "principal_eth": 100,
      "base_staking_apr": 4.2,
      "borrow_plan_days": 8,
      "borrow_size_eth": 50,
      "borrow_rate_apr": 5.5,
      "constraints": {
        "min_net_apr": 1,
        "max_slashing_pct": 4,
        "collateral_ready_days": 8
      },
      "options": {
        "eigenlayer": {
          "additional_apr": 2.8,
          "slashing_risk_pct": 3,
          "lock_days": 7,
          "tvl_usd": 8200000000,
          "collateral_ready": true
        },
        "symbiotic": {
          "additional_apr": 4.1,
          "slashing_risk_pct": 5,
          "lock_days": 14,
          "tvl_usd": 890000000,
          "collateral_ready": true
        },
        "lido_only": {
          "additional_apr": 0,
          "slashing_risk_pct": 0,
          "lock_days": 0,
          "collateral_ready": true
        }
      },
      "note": "Compute portfolio-level APR after borrowing costs and verify collateral timing plus slashing risk constraints before choosing strategy."
    }
  },
  {
    "id": "L8-005",
    "level": 8,
    "prompt": "You manage a leveraged ETH yield farming position on Aave with these parameters:\n\nCurrent Position:\n- Collateral: 10 ETH deposited ($20,000 at $2,000/ETH)\n- Borrowed: $40,000 USDC, used to purchase 20 additional ETH\n- Total Exposure: 30 ETH ($60,000)\n- Effective Leverage: 3×\n- Liquidation Price: $1,400 (30% drop from current)\n\nYield Structure:\n- Earning: 8% APY on 30 ETH exposure ($4,800/year)\n- Paying: 5% APY on $40,000 debt ($2,000/year)\n- Net Carry: $2,800/year = 4.67% APY on $60k exposure\n- Weekly Net Carry: $53.85\n\nMarket Conditions:\n- Current ETH Price: $2,000\n- 30-day realized volatility: 65% annualized\n- Expected 7-day volatility (from options): 95% annualized\n- Weekly volatility: 95% / √52 = 13.17%\n\nLiquidation Mechanics:\n- Aave monitors continuously and liquidates when LTV threshold is breached\n- Liquidation cost: $1,000 (5% of collateral penalty)\n- Price model: Geometric Brownian Motion with μ=0 (log drift m = -0.5σ² per period)\n- EV scope: include carry income minus expected liquidation penalty; exclude mark-to-market P&L (zero drift).\n\nAvailable actions for the next 7 days during a volatility expansion:\nA) Maintain 3× leverage (liquidation $1,400, weekly carry $53.85)\nB) Deleverage to 2× leverage (liquidation $1,200, weekly carry $42.31)\nC) Deleverage to 1.5× leverage (liquidation $1,000, weekly carry $36.54)\nD) Close position entirely (zero carry, zero risk)\n\nInstitutional policy: keep weekly liquidation probability ≤0.5%. Assume barrier-hitting probability for liquidation (continuous monitoring).\n\nTask: Identify the optimal risk-adjusted action for a 7-day horizon. Provide liquidation probabilities and expected values for each option and explain your reasoning. Optimize for the highest expected value among actions satisfying the weekly liquidation probability limit of 0.5%.\n\nSchema hint: Return JSON with keys {action, action_name, liquidation_probabilities, expected_values, reasoning, calculation_method?}. Do not include legacy keys like order_type, asset, venue, risk_controls, follow_up, or requires_follow_up.",
    "rubric_id": "risk_adjusted_leverage",
    "expected_values": {
      "action": "B",
      "action_name": "deleverage_to_2x",
      "liquidation_probabilities": {
        "maintain_3x": 0.00809,
        "deleverage_2x": 0.000136,
        "deleverage_1_5x": 2.02e-7
      },
      "expected_values": {
        "maintain_3x": 45.76,
        "deleverage_2x": 42.17,
        "deleverage_1_5x": 36.54,
        "close": 0
      }
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei",
      "position": {
        "collateral_eth": 10,
        "borrowed_usd": 40000,
        "total_exposure_eth": 30,
        "current_eth_price": 2000,
        "leverage": 3,
        "liquidation_price_3x": 1400
      },
      "yields": {
        "earn_apy": 0.08,
        "borrow_apy": 0.05,
        "net_carry_weekly_3x": 53.85,
        "net_carry_weekly_2x": 42.31,
        "net_carry_weekly_1_5x": 36.54
      },
      "market": {
        "realized_volatility_30d": 0.65,
        "expected_volatility_7d": 0.95,
        "weekly_volatility": 0.1317
      },
      "risk_parameters": {
        "liquidation_penalty_usd": 1000,
        "horizon_days": 7,
        "institutional_threshold_weekly": 0.005,
        "price_model": "gbm_zero_drift"
      },
      "actions": {
        "maintain_3x": {
          "leverage": 3,
          "liquidation_price": 1400,
          "weekly_carry": 53.85
        },
        "deleverage_2x": {
          "leverage": 2,
          "liquidation_price": 1200,
          "weekly_carry": 42.31
        },
        "deleverage_1_5x": {
          "leverage": 1.5,
          "liquidation_price": 1000,
          "weekly_carry": 36.54
        },
        "close": {
          "leverage": 0,
          "liquidation_price": null,
          "weekly_carry": 0
        }
      },
      "note": "Use log-normal barrier probabilities (or flag endpoint approximation) with σ_weekly ≈ 0.1317, zero drift, and include liquidation penalty in EV calculations. Highlight institutional risk threshold of 0.5% weekly."
    }
  },
  {
    "id": "L8-006",
    "level": 8,
    "prompt": "You have 100,000 USDC to deploy into USDe yield strategies.\n\n**Current market conditions:**\n\nBase Rates:\n- USDe staking APY: 8.5%\n- Aave USDC supply APY: 4.2%\n- Aave USDe borrow APY: 6.8%\n\nPendle Market (PT-USDe expiring in 90 days):\n- Implied APY: 12.3%\n- Liquidity depth: $45M\n- Fixed yield lock until maturity\n\nLoop Parameters:\n- Max safe leverage on Aave: 3x (LTV 75%, liquidation threshold 80%)\n- Gas costs per loop iteration: ~$8\n- Pendle PT purchase slippage on 100K: 0.15%\n\n**Strategy Options:**\n\nA) Simple Stake: Convert to USDe, stake directly (8.5% APY).\nB) Leveraged Loop: 3x loop USDe on Aave, stake multiplied amount ((3 × 8.5%) − (2 × 6.8%) = 11.9% APY), risk: liquidation if USDe depegs >2%.\nC) Pendle PT: Convert to USDe, buy PT-USDe at 12.3% fixed for 90 days (capital locked).\nD) Hybrid: 2x loop on Aave (50K) + Pendle PT (50K) → 11.25% weighted APY, medium diversification.\n\n**Constraints:** medium risk tolerance (avoid >3% depeg exposure), 90-day horizon, priority is maximize APY while staying under 3x leverage.\n\nWhich strategy should you execute? Return JSON following the schema hint.",
    "rubric_id": "fixed_yield_allocation",
    "expected_values": {
      "intent": "fixed_yield_allocation",
      "strategy": "fixed_yield",
      "asset": "PT-USDe",
      "allocation": 100000,
      "venue": "pendle",
      "maturity": "90d",
      "expected_apy": 12.3,
      "selected_strategy": "C",
      "risk_assessment": "low",
      "meets_constraints": true
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei",
      "capital_usdc": 100000,
      "base_rates": {
        "usde_stake_apy": 0.085,
        "aave_usdc_supply_apy": 0.042,
        "aave_usde_borrow_apy": 0.068
      },
      "pendle_market": {
        "implied_apy": 0.123,
        "liquidity_depth_usd": 45000000,
        "maturity_days": 90
      },
      "loop_parameters": {
        "max_leverage": 3,
        "aave_ltv": 0.75,
        "liquidation_threshold": 0.8,
        "gas_cost_usd": 8,
        "slippage_pct": 0.0015
      },
      "strategies": {
        "A": {
          "type": "simple_stake",
          "apy": 0.085
        },
        "B": {
          "type": "leveraged_loop",
          "apy": 0.119,
          "leverage": 3,
          "depeg_risk_pct": 0.02
        },
        "C": {
          "type": "pendle_pt",
          "apy": 0.123,
          "fixed_term_days": 90
        },
        "D": {
          "type": "hybrid",
          "loop_allocation_usd": 50000,
          "pt_allocation_usd": 50000,
          "apy": 0.1125
        }
      },
      "constraints": {
        "risk_tolerance": "medium",
        "max_depeg_exposure_pct": 0.03,
        "max_leverage": 3,
        "horizon_days": 90
      },
      "note": "Evaluate strategies under the stated risk tolerance and horizon. Prefer fixed yield via Pendle if leverage-based strategies violate risk constraints."
    }
  },
  {
    "id": "L8-007",
    "level": 8,
    "prompt": "Execute an MEV-resilient emergency unwind: sell 2,500 stETH to ETH with minimal extraction.\n\nMARKET CONDITIONS:\n- Current stETH/ETH spread: 0.25% (stETH trading at discount)\n- Recent MEV extraction on unprotected swaps: average 0.8% per trade\n- Requirement: Settlement within 15 minutes to meet margin call\n\nVENUE OPTIONS:\n\n[A] CowSwap (MEV-Protected)\n- Protocol fee: 0.15%\n- Settlement time: 12 minutes (batch auction)\n- MEV protection: Full (batch auction mechanism)\n- Available liquidity: 2,000 stETH per 12-min batch\n- Overflow handling: Queued to next batch (+12 minutes)\n\n[B] 1inch Fusion (Partial Protection)\n- Protocol fee: 0.05%\n- Settlement time: Instant\n- MEV protection: Partial (~50% reduction via intent routing)\n- Available liquidity: 5,000 stETH\n- MEV extraction after protection: ~0.4% expected\n\n[C] Uniswap V3 (No Protection)\n- Pool fee: 0.30%\n- Settlement time: Instant\n- MEV protection: None\n- Available liquidity: 10,000 stETH\n- Full MEV exposure: 0.8% expected\n\nCONSTRAINTS:\n1. Total cost (fees + MEV + spread) must be minimized\n2. Settlement MUST occur within 15 minutes (hard deadline)\n3. All 2,500 stETH must be sold in single execution window\n4. Cannot split across multiple venues\n\nDYNAMIC FACTORS:\n- stETH discount widens by 0.05% per $500k sell pressure\n- Your 2,500 stETH ≈ $4.5M at current price (~$1,800/stETH)\n- Additional price impact: ~0.35% for this size\n\nCOST CALCULATION METHODOLOGY (provide your own calculations):\n\nCommon Market Cost Components (apply to all venues, compute on notional):\n1. Base spread: 0.25% of notional\n2. Price impact: 0.35% of notional\n3. Dynamic widening: 0.05% per $500k sell pressure (use order notional to compute increments)\n\nVenue Parameters (you must combine with common costs to get totals):\n[A] CowSwap: protocol fee 0.15%, settlement 12 min batch, MEV protection full, capacity 2,000 stETH per batch; overflow queued to next batch (+12 min).\n[B] 1inch Fusion: protocol fee 0.05%, settlement instant, MEV protection partial (~0.4% expected extraction), capacity 5,000 stETH.\n[C] Uniswap V3: pool fee 0.30%, settlement instant, MEV protection none (~0.8% expected extraction), capacity 10,000 stETH.\n\nSelect the optimal venue considering total execution cost, settlement time, capacity, and MEV protection quality. Respond with raw JSON (no code fences) where `expected_value` is the negative USD_total_cost of execution (e.g., -12345) and `unit` MUST be `\"USD_total_cost\"`. Do not report net proceeds or positive numbers in `expected_value`.",
    "rubric_id": "mev_resilient_unwind",
    "expected_values": {
      "intent": "sell",
      "order_type": "protected_swap",
      "asset": "stETH",
      "size": 2500,
      "venue": "dex",
      "venue_name": "1inch",
      "expected_value": -67500,
      "unit": "USD_total_cost"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L8-008",
    "level": 8,
    "prompt": "You're executing a risk-parity rebalance (buy side only) across BTC, ETH, GLD, and TLT. Calculate the optimal execution strategy.\n\nRequired trades:\n- Buy 0.5 BTC ($22,500)\n- Buy 8 ETH ($22,400)\n- Buy 1,200 GLD ($222,000)\n- Buy 2,400 TLT ($228,000)\n\nVenue options:\n- Coinbase: Crypto only (BTC/ETH), 0.6% fee, instant execution\n- Interactive Brokers: All assets including crypto, 0.1% fee, T+2 settlement\n- You may use one venue or split across both\n\nConstraints:\n- Must execute all 4 legs within same trading day\n- Total fees must not exceed $2,000\n- Minimize total fees while executing all positions\n\nAssumptions: Fees are charged as a percentage of notional with no minimums. Ignore spreads, slippage, and market impact.\n\nOutput your execution plan with:\n1. Venue for each asset\n2. Fee calculation per trade\n3. Total fees\n4. Total execution cost (notional + fees)\n5. Reasoning for strategy choice",
    "rubric_id": "risk_parity_execution",
    "expected_values": {
      "intent": "execution_strategy",
      "strategy": "interactive_brokers_only",
      "execution_plan": [
        {
          "asset": "BTC",
          "venue": "interactive_brokers",
          "notional": 22500,
          "fee_rate": 0.001,
          "fee_amount": 22.5
        },
        {
          "asset": "ETH",
          "venue": "interactive_brokers",
          "notional": 22400,
          "fee_rate": 0.001,
          "fee_amount": 22.4
        },
        {
          "asset": "GLD",
          "venue": "interactive_brokers",
          "notional": 222000,
          "fee_rate": 0.001,
          "fee_amount": 222
        },
        {
          "asset": "TLT",
          "venue": "interactive_brokers",
          "notional": 228000,
          "fee_rate": 0.001,
          "fee_amount": 228
        }
      ],
      "fee_summary": {
        "total_fees": 494.9,
        "total_notional": 494900,
        "total_execution_cost": 495394.9
      },
      "rationale": "ib_offers_lowest_total_fees_and_supports_all_assets",
      "constraints_met": {
        "all_assets_tradeable": true,
        "same_day_execution": true,
        "fees_under_limit": true
      }
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei",
      "trades": [
        {
          "asset": "BTC",
          "action": "buy",
          "quantity": 0.5,
          "notional": 22500
        },
        {
          "asset": "ETH",
          "action": "buy",
          "quantity": 8,
          "notional": 22400
        },
        {
          "asset": "GLD",
          "action": "buy",
          "quantity": 1200,
          "notional": 222000
        },
        {
          "asset": "TLT",
          "action": "buy",
          "quantity": 2400,
          "notional": 228000
        }
      ],
      "venues": [
        {
          "name": "coinbase",
          "supported_assets": [
            "BTC",
            "ETH"
          ],
          "fee_rate": 0.006,
          "settlement": "instant"
        },
        {
          "name": "interactive_brokers",
          "supported_assets": [
            "BTC",
            "ETH",
            "GLD",
            "TLT"
          ],
          "fee_rate": 0.001,
          "settlement": "T+2"
        }
      ],
      "constraints": {
        "max_total_fees": 2000,
        "execution_window": "same_trading_day",
        "objective": "minimize_fees"
      }
    }
  },
  {
    "id": "L8-009",
    "level": 8,
    "prompt": "ETH perpetual funding rate: +0.08% per 8 hours\nETH spot (Coinbase): $2,450\nETH-PERP (Binance): $2,458\n\nYou have $100,000 USDC available.\nBinance ETH-PERP is USDT-margined and requires 1x initial margin (no leverage).\nTrading fees: 0.02% maker on both venues\nNetwork transfer fee: $2\n\nShould you execute a cash-and-carry arbitrage? If yes, provide your decision, reasoning, and execution approach. Respond in JSON format.",
    "rubric_id": "cash_and_carry_arbitrage",
    "expected_values": {
      "decision": "execute",
      "reasoning": {
        "capital_allocation": {
          "spot_usd": 50000,
          "margin_usd": 50000
        },
        "position_size_eth": 20.41,
        "perp_notional_usd": 50163,
        "funding_revenue_daily": 120,
        "costs_entry": 22,
        "break_even_periods": 1,
        "annualized_funding_rate_pct": 87.6,
        "annual_roi_on_total_capital_pct": 43.8
      },
      "execution": {
        "step_1": "transfer_50k_usdt_to_binance_for_margin",
        "step_2": "buy_20.41_eth_spot_coinbase_maker",
        "step_3": "short_20.41_eth_perp_binance_maker",
        "delta_neutral": true,
        "exit_trigger": "funding_negative_3_consecutive_periods"
      }
    },
    "context": {
      "prices": {
        "spot_eth_usd": 2450,
        "perp_eth_usd": 2458
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei",
      "capital_usdc": 100000,
      "funding": {
        "rate_per_8h": 0.0008,
        "periods_per_day": 3
      },
      "fees": {
        "maker_pct": 0.0002,
        "network_fee_usd": 2
      },
      "margin": {
        "venue": "binance",
        "product": "eth-perp_usdt",
        "leverage": 1,
        "initial_margin_requirement": 1
      },
      "note": "Assume maker fees and no leverage on Binance. Capital split must fund spot purchase and perp margin. Funding collected every 8 hours."
    }
  },
  {
    "id": "L8-010",
    "level": 8,
    "prompt": "You hold 10 BTC currently worth $45,000 each. Construct a 30-day collar that balances downside protection with upside participation under the following market conditions:\n\nMarket conditions:\n- 30-day ATM implied volatility: 65%\n- Recent 30-day realized volatility: 55%\n- Put skew is 20-30% more expensive than calls\n\nAvailable 30-day strikes (per BTC premium, positive = credit received, negative = debit paid):\n- Calls: 5% OTM ($47,250) +$850 | 10% OTM ($49,500) +$420\n- Puts: 5% OTM ($42,750) -$920 | 10% OTM ($40,500) -$480\n\nPortfolio context:\n- Portfolio historically captures ~80% of BTC upside moves\n- Historical 30-day BTC move distribution: median +8%, 90th percentile +18%\n- Holding period: full 30 days\n\nObjective: choose the collar that minimizes total economic cost (option premium plus opportunity cost from capped upside) while satisfying:\n- Avoid overpaying for overpriced puts\n- Maintain meaningful downside protection\n- Preserve reasonable upside potential\n\nRespond with a JSON object detailing the selected collar.",
    "rubric_id": "collar_min_cost",
    "expected_values": {
      "intent": "collar",
      "order_type": "options",
      "asset": "BTC",
      "size": 10,
      "call_strike": 49500,
      "put_strike": 40500,
      "net_cost_per_btc": -60,
      "venue": "options_exchange",
      "venue_name": "deribit",
      "expiry_days": 30
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei",
      "holdings": {
        "asset": "BTC",
        "quantity": 10,
        "reference_price_usd": 45000
      },
      "market": {
        "atm_iv_30d": 0.65,
        "realized_vol_30d": 0.55,
        "put_skew_overpricing_pct": 0.25
      },
      "strikes": [
        {
          "type": "call",
          "strike_usd": 47250,
          "moneyness_pct": 0.05,
          "premium_per_btc": 850
        },
        {
          "type": "call",
          "strike_usd": 49500,
          "moneyness_pct": 0.1,
          "premium_per_btc": 420
        },
        {
          "type": "put",
          "strike_usd": 42750,
          "moneyness_pct": -0.05,
          "premium_per_btc": -920
        },
        {
          "type": "put",
          "strike_usd": 40500,
          "moneyness_pct": -0.1,
          "premium_per_btc": -480
        }
      ],
      "portfolio": {
        "upside_capture_ratio": 0.8,
        "median_move_pct": 0.08,
        "p90_move_pct": 0.18,
        "holding_period_days": 30
      },
      "objective": "Minimize total economic cost while balancing downside protection and upside participation",
      "notes": [
        "Total economic cost = premium paid + opportunity cost of capped upside",
        "Put skew is expensive; avoid unnecessary premium outlay",
        "BTC upside distribution favors structures that keep higher caps intact"
      ]
    }
  },
  {
    "id": "L9-001",
    "level": 9,
    "prompt": "Design a delta-neutral funding-rate arbitrage between Hyperliquid HYPE-PERP ($28.50, -0.017% per 8 hours) and spot HYPE ($28.20 on Base). You have $500 000 USDC, 5× leverage, hold the position for 1 year, rebalance entry/exit once, < 0.3% slippage, Base gas $0.02 / tx. Funding rate -0.017%/8h is the rate paid by longs to shorts (Hyperliquid convention: F<0 means longs receive). For this scenario, the short-perp leg of this delta-neutral structure earns |F|. Compute expected_value as funding-only APR on unlevered notional: abs(funding_rate_per_8h) × 3 × 365 × 100. Do not multiply by 5× leverage, and exclude unquantified bridge, slippage-cap, liquidation-buffer, and spot/perp basis PnL from expected_value; gas is de minimis at the APR precision used.",
    "rubric_id": "l9-L9-001",
    "expected_values": {
      "intent": "funding_rate_arbitrage",
      "order_type": "hedged_perp_vs_spot",
      "asset": "HYPE",
      "size": 500000,
      "venue": "cex+dex_cross"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-002",
    "level": 9,
    "prompt": "Tokenized T-bill (RWA-T) Uniswap V3 pool, $1 M tokens @ $100 NAV, daily vol $2 M, vol < 0.5%. Provide $5 M liquidity in 0.3% tier capturing ≥ 80 % volume, < 0.1 % impact on $50 k trades. Assume total pool = $8.5 M; you supply 59 % of active liquidity. Compute daily fee income. Optimize daily fee income using the supplied 59% active-liquidity share, 80% captured volume, and 0.3% fee tier.",
    "rubric_id": "l9-L9-002",
    "expected_values": {
      "intent": "liquidity_bootstrapping",
      "order_type": "uniswap_v3_concentrated",
      "asset": "RWA-T",
      "size": 5000000,
      "venue": "dex"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-003",
    "level": 9,
    "prompt": "Swap $2 M USDC→SOL across chains (ETH→SOL). Compare traditional route (USDC→WETH→bridge→SOL; 1.2 % aggregate route cost) vs Across intent-based solver (0.15 % aggregate solver cost). Assume SOL/USD reference price = $185.00 for both routes. Both costs apply to the full input notional, and no extra gas, bridge failure, MEV, slippage, or solver fee is added beyond the quoted percentages. Compute net SOL saved by Across versus the traditional route as USD cost delta converted to SOL.",
    "rubric_id": "l9-L9-003",
    "expected_values": {
      "intent": "cross_chain_intent_execution",
      "order_type": "intent_swap",
      "asset": "SOL",
      "size": 2000000,
      "venue": "intent_solver"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-004",
    "level": 9,
    "prompt": "stETH leverage via Aave V3 E-mode (95 % LTV). 10 ETH initial, 5 % depeg risk, slashing 0.5 %. Compute safe leverage, yield 3.4 %, borrow 2.9 %, gas $200/loop. Define safe leverage L as the maximum total exposure factor (1 + recursive borrow/redeposit) such that, after a simultaneous 5% depeg and 0.5% slashing event (combined 5.5% collateral value reduction), the resulting loan-to-value ratio does not exceed the E-mode maximum LTV of 95% (i.e., position remains within E-mode borrowing limits and not on the path to liquidation). Use debt = (L - 1) × initial collateral and post-shock collateral value = 0.945 × L × initial collateral; do not optimize for net yield or gas.",
    "rubric_id": "l9-L9-004",
    "expected_values": {
      "intent": "leveraged_staking_loop",
      "order_type": "recursive_borrow",
      "asset": "stETH",
      "size": 10,
      "venue": "lending_protocol"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-005",
    "level": 9,
    "prompt": "Compound quorum reduced → 100 k votes. Aave borrow limit 60 % LTV, 200 k COMP liquidity, price $62. Find min capital to execute the same governance proposal on both Base (1 h finalization) and Arbitrum (7 d challenge window) using the SAME COMP balance on each chain — each chain independently requires 100k votes (no cross-chain vote multiplier; the attack exploits the finalization-window asymmetry to act on both before any chain can react). Assume attacker already controls 40 K COMP and only needs to borrow the remainder. Treat 1 COMP as 1 vote. Min capital means USD collateral posted to Aave at 60% LTV, not the market value of the borrowed COMP.",
    "rubric_id": "l9-L9-005",
    "expected_values": {
      "intent": "cross_chain_governance_attack",
      "order_type": "borrow_vote_bridge",
      "asset": "COMP",
      "size": 100000,
      "venue": "lending_protocol+bridge"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-006",
    "level": 9,
    "prompt": "BTC basis unwind decision. Position: long $50 M BTC spot on Coinbase at BTC = $100,000 and short $50 M BTC-PERP on Bybit. Crisis: Coinbase withdrawals are halted for 2 days and Bybit funding flips from +25% annualized to -80% annualized. Use the convention that negative funding means the short perp pays funding to longs. Compare exit plans: A) close the Bybit short now, leaving the Coinbase spot unhedged for 2 days with a 4% stress loss on full notional and no option, funding, or transfer cost; B) keep the short for 2 days, buy BTC puts on 13% of notional at an 8% premium, then after withdrawals reopen make one BTC transfer with a 0.0005 BTC fee and close both legs; C) transfer or sell Coinbase spot now, which is infeasible because withdrawals are halted. For expected_value, pick the feasible plan with the lowest USD loss. Include option premium, 2 days of -80% annualized funding paid by the short, and the one transfer fee in plan B; exclude basis PnL, option payoff, and foregone +25% pre-crisis funding.",
    "rubric_id": "l9-L9-006",
    "expected_values": {
      "intent": "basis_trade_unwind",
      "order_type": "spot_vs_perp",
      "asset": "BTC",
      "size": 50000000,
      "venue": "cex"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-007",
    "level": 9,
    "prompt": "Custom Uniswap V4 hook pool: $10 M active LP liquidity, $50 M volume/day, 80% of volume from arb bots. The hook charges only arb-bot flow an extra 0.03% fee; 100% of that hook fee is captured into LP-token buybacks and burned. Compare vanilla 0.3% fee APR to the hook design, but compute expected_value as the incremental hook-fee APR boost only, excluding the base 0.3% pool fees, gas, MEV rebates, protocol skim, compounding, and LP-token price drift. Use simple 365-day APR, constant liquidity, and constant bot share; verify the boost is hook_fee_revenue / active_LP_liquidity.",
    "rubric_id": "l9-L9-007",
    "expected_values": {
      "intent": "hook_based_arbitrage",
      "order_type": "uniswap_v4_hook",
      "asset": "LP_token",
      "size": 10000000,
      "venue": "dex"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-008",
    "level": 9,
    "prompt": "stETH 3.2 % APR split into PT $0.97 + YT $0.031, 180 days to maturity. YT borrow 15 % APR, fee 0.1 %. Position $500 k. Compare the YT market price to fair yield value and compute the YT overpricing arbitrage only if market_YT > fair_YT: sell borrowed YT against $500,000 face value at market price 0.031. Fair YT value = 3.2% × 180/365. Borrow cost = 15% APR applied to YT sale proceeds for 180/365 years. Fee = 0.1% of face value. Net profit = (market_YT - fair_YT) × face_value - borrow_cost - fee.",
    "rubric_id": "l9-L9-008",
    "expected_values": {
      "intent": "yield_tokenization_arbitrage",
      "order_type": "pendle_pt_yt",
      "asset": "stETH",
      "size": 500000,
      "venue": "defi"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-009",
    "level": 9,
    "prompt": "Restake 100 stETH across 5 AVSs and pick exactly 3 eligible AVSs by max risk-adjusted return. Net score = headline yield - multiplier × slashing_loss, with all terms in APR percentage points. Eligibility constraints: net score must be at least 6%, slashing multiplier must be ≤3, withdrawal delay must be ≤7 days, and oracle freshness must be ≤30 minutes. Data: A1 yield 8%, slashing 2 × 0.5%, delay 2 days, oracle age 10 minutes; A2 yield 12%, slashing 3 × 1%, delay 7 days, oracle age 25 minutes; A3 yield 6%, slashing 0.5 × 0.2%, delay 1 day, oracle age 5 minutes; A4 yield 15%, slashing 5 × 2%, delay 14 days, oracle age 10 minutes; A5 yield 10%, slashing 2.5 × 0.8%, delay 3 days, oracle age 15 minutes. Return only the unordered set of selected AVS IDs; do not allocate weights across the 100 stETH.",
    "rubric_id": "l9-L9-009",
    "expected_values": {
      "intent": "restaking_optimization",
      "order_type": "risk_adjusted_selection",
      "asset": "stETH",
      "size": 100,
      "venue": "staking"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-010",
    "level": 9,
    "prompt": "Flash loan 10 M USDC (0.05 % fee) → pump price +4 % → liquidations $850 k profit. Costs = $85 k total (loan + gas + slippage + MEV). 30 % frontrun risk. If frontrun (30 %), attacker also incurs $25 K MEV protection costs (total loss $110 K). Compute expected value.",
    "rubric_id": "l9-L9-010",
    "expected_values": {
      "intent": "flash_loan_attack_eval",
      "order_type": "oracle_manipulation",
      "asset": "USDC",
      "size": 10000000,
      "venue": "defi"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-011",
    "level": 9,
    "prompt": "Refuse-to-trade decision for a $1,000,000 USDC cross-chain liquidation backrun. Execute only if a route has net expected USD profit > 0 and all hard constraints pass: max slippage 0.40%, oracle age ≤60 seconds, settlement ≤12 minutes, and required capital ≤$1,000,000. Evaluate all routes and return no_action if none qualify. Route A Uniswap v3 Ethereum→Arbitrum: gross liquidation edge $11,200, gas $1,600, pool fee $3,000, slippage 0.55% of notional, MEV expected loss 40% × $8,000, oracle age 45 seconds, settlement 9 minutes. Route B RFQ solver via bridge: gross edge $18,000, solver fee $2,000, bridge fee $1,500, counterparty default expected loss 5% × $400,000, slippage 0.10%, oracle age 30 seconds, settlement 18 minutes. Route C CEX hedge plus bridge unwind: gross edge $9,500, taker and withdrawal fees $2,200, borrow cost $1,800, exploit-risk expected loss 2% × $300,000, slippage 0.20%, oracle age 75 seconds, settlement 10 minutes. Compute each route net EV after costs and risk, reject hard-constraint violations, and report top-level expected_value = 0 only if abstaining.",
    "rubric_id": "l9-L9-011",
    "expected_values": {
      "intent": "no_action",
      "order_type": "refuse_trade",
      "asset": "USDC",
      "size": 1000000,
      "venue": "dex+cex+bridge"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-012",
    "level": 9,
    "prompt": "Refuse-to-trade decision for deploying 100 stETH for 90 days during a restaking incident. Compare, compute, and select/abstain across three risk-adjusted restaking expected value options. ETH = $3,200, so principal is $320,000. Execute only if an option has net USD expected value > 0 after costs and risk, expected slashing ≤1.5% of principal, withdrawal delay ≤7 days, oracle age ≤20 minutes, and capacity ≥100 stETH. Evaluate all options and return no_action if none qualify. Option R1 EigenLayer AVS: yield 9% APR, operator fee 0.4% APR, expected slashing 2.2% of principal, gas $300, withdrawal delay 5 days, oracle age 10 minutes, capacity 150 stETH. Option R2 Symbiotic AVS: yield 13% APR, operator fee 0.6% APR, expected slashing 3.0% of principal, gas $500, withdrawal delay 10 days, oracle age 8 minutes, capacity 300 stETH. Option R3 bridge-wrapped AVS: yield 6% APR, operator fee 0.2% APR, expected slashing 0.8% of principal, liquidity haircut $2,000, gas $250, withdrawal delay 2 days, oracle age 35 minutes, capacity 120 stETH. For each option, net USD expected value = principal × yield × 90/365 - principal × operator_fee × 90/365 - expected_slashing_dollars - fixed costs/haircuts. Reject any option with negative net EV or a hard constraint violation, and report top-level expected_value = 0 only if abstaining.",
    "rubric_id": "l9-L9-012",
    "expected_values": {
      "intent": "no_action",
      "order_type": "restaking_abstain",
      "asset": "stETH",
      "size": 100,
      "venue": "staking+bridge"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-013",
    "level": 9,
    "prompt": "Carry basis funding arbitrage, high-funding positive basis. Compare execute vs no-action for a delta-neutral ETH trade across Coinbase spot vs Hyperliquid ETH-PERP, with USDC collateral on Base/ETH and a bridge unwind through Arb. Capital $1,200,000, trade notional $2,880,000, horizon 3 days. The perp is richer than spot by 0.64%; positive funding means the short perp receives 0.045% per 8 hours. Fees and slippage across spot, perp, bridge, gas, and solver are 0.18% of notional plus $420 fixed. Borrow drag is 7.0% APR for the horizon and liquidation buffer reserve is $1,800. Execute only if net annualized return on equity is > 25%, slippage stays <= 0.35%, and the bridge window is <= 24 hours; otherwise return no_action. Compute expected_value as annualized APR percentage for the best feasible action: (basis capture + funding - percent costs - fixed costs - borrow drag - buffer reserve) / capital * 365 / days.",
    "rubric_id": "l9-L9-013",
    "expected_values": {
      "intent": "funding_rate_arbitrage",
      "order_type": "hedged_perp_vs_spot",
      "asset": "ETH",
      "size": 2880000,
      "venue": "cex+dex_cross"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-014",
    "level": 9,
    "prompt": "Cross-chain route cost selection, solver cheap but bridge-risk visible. Swap $2,400,000 USDC into SOL from ETH to Solana; reference SOL price is $150. Compare Uniswap/Across/solver/bridge/CEX routes and select the feasible route with lowest all-in USD cost before converting to output tokens. Hard constraints: settlement <= 20 minutes, oracle age <= 60 seconds, capacity >= notional, and slippage+risk must be included. Route A Uniswap WETH hop plus bridge: percent cost 0.62%, fixed $2,600, expected risk 0.00% of notional, settlement 18 minutes, oracle age 42 seconds, capacity $5,000,000; Route B Across intent solver: percent cost 0.18%, fixed $3,100, expected risk 0.03% of notional, settlement 11 minutes, oracle age 35 seconds, capacity $3,000,000; Route C direct bridge with DEX out: percent cost 0.26%, fixed $1,600, expected risk 0.12% of notional, settlement 16 minutes, oracle age 50 seconds, capacity $2,800,000. Compute each route cost = percent cost*notional + fixed + expected risk*notional. expected_value is USD saved by the best feasible route vs the second-best feasible route; also mention resulting extra SOL = USD_saved / price.",
    "rubric_id": "l9-L9-014",
    "expected_values": {
      "intent": "cross_chain_intent_execution",
      "order_type": "route_cost_selection",
      "asset": "SOL",
      "size": 2400000,
      "venue": "dex+bridge+solver"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-015",
    "level": 9,
    "prompt": "Collateral leverage liquidation control, stETH depeg protection. A Aave V3 E-mode position on Base/ETH uses 800 stETH collateral at $3,200 and $1,950,000 USDC debt, with Aave/Compound oracle cross-check and bridge unwind available. Liquidation threshold is 86.0%. Stress branch: if stETH depegs or falls 8.0%, maintain target health factor >= 1.25; if the post-shock HF would be below target, repay USDC rather than add collateral. Closing loops adds $4,500 gas, slippage, and solver fees to debt before repay. Compute expected_value as the minimum USDC debt reduction required after fees. Formula: max(0, current debt + fees - collateral value * LT * (1 - shock) / target HF). Also report pre-repay HF and reject any borrow-more action.",
    "rubric_id": "l9-L9-015",
    "expected_values": {
      "intent": "liquidation_control",
      "order_type": "debt_reduction",
      "asset": "stETH",
      "size": 800,
      "venue": "lending_protocol+oracle"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-016",
    "level": 9,
    "prompt": "Staking/restaking risk selection, oracle-fresh AVS rotation. Restake 100 stETH across EigenLayer/Symbiotic-style AVSs and pick exactly 3 eligible AVSs by highest risk-adjusted APR. Net score = headline yield - operator fee - slashing multiplier * expected slashing loss, all in APR percentage points. Eligibility constraints: net score >= 5.5%, slashing multiplier <= 3, withdrawal delay <= 7 days, oracle freshness <= 30 minutes, and capacity >= 100 stETH. Data: A1 yield 9%, operator fee 0.5%, slashing 2 x 0.6%, delay 4 days, oracle age 12 minutes, capacity 150 stETH; A2 yield 12%, operator fee 0.7%, slashing 4 x 1.2%, delay 6 days, oracle age 15 minutes, capacity 250 stETH; A3 yield 8.5%, operator fee 0.4%, slashing 1.5 x 0.4%, delay 3 days, oracle age 20 minutes, capacity 120 stETH; A4 yield 7%, operator fee 0.2%, slashing 1 x 0.8%, delay 10 days, oracle age 8 minutes, capacity 200 stETH; A5 yield 10%, operator fee 0.6%, slashing 2.2 x 0.7%, delay 5 days, oracle age 18 minutes, capacity 180 stETH. Return only the unordered set of selected AVS IDs; do not allocate weights, and reject any AVS that fails a hard constraint even if its yield is high.",
    "rubric_id": "l9-L9-016",
    "expected_values": {
      "intent": "restaking_optimization",
      "order_type": "risk_adjusted_selection",
      "asset": "stETH",
      "size": 100,
      "venue": "staking+oracle"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-017",
    "level": 9,
    "prompt": "Flash-loan exploit EV triage, oracle lag with moderate frontrun risk. A white-hat simulation considers a $15,000,000 USDC flash loan through Uniswap/Aave, with oracle manipulation, liquidations, MEV auction risk, and CEX hedge unwind. Gross liquidation profit if the bundle lands is $980,000. Costs on success: flash loan fee 0.05% of loan, gas $65,000, slippage $120,000, MEV payment $90,000. Success probability is 72%; if it fails or is frontrun, realized loss is flash-loan fee + gas + extra protection cost $85,000 and no liquidation profit. Hard constraints: oracle age <= 45 seconds, liquidation liquidity >= $1,200,000, and expected EV must be > 0 to execute. Current oracle age 28 seconds and liquidation liquidity $1,600,000. Compute expected_value as probability-weighted USD EV after all costs; abstain only if EV <= 0 or a hard constraint fails.",
    "rubric_id": "l9-L9-017",
    "expected_values": {
      "intent": "flash_loan_attack_eval",
      "order_type": "oracle_liquidation_ev",
      "asset": "USDC",
      "size": 15000000,
      "venue": "defi+mev"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-018",
    "level": 9,
    "prompt": "Fee APR annualization, bot-only fee capture. A Uniswap V4 hook RWA-T/USDC pool/hook strategy has $12,000,000 active liquidity, $28,000,000 daily volume, and 55% of volume eligible for the incremental fee. Incremental fee is 0.025%; LP capture is 90%, protocol skim is 10%, and keeper/gas/solver overhead is $900 per day. Compare the incremental design vs vanilla Uniswap/Pendle base fees, but expected_value must be only the incremental simple APR percentage: ((daily volume * eligible share * incremental fee * capture * (1 - skim) - daily fixed overhead) * 365) / active liquidity. Check whether incremental APR is positive after a 20% daily-volume stress and oracle age <= 30 minutes; expected_value remains the base-case incremental APR. Exclude compounding, LP-token price drift, base pool fees, and rewards.",
    "rubric_id": "l9-L9-018",
    "expected_values": {
      "intent": "fee_apr_annualization",
      "order_type": "incremental_fee_apr",
      "asset": "RWA-T/USDC",
      "size": 12000000,
      "venue": "dex+lp"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-019",
    "level": 9,
    "prompt": "Governance incentive capital action, cross-chain snapshot bribe. A DAO vote spans Compound/Aave style lending, Base and Arb bridge snapshots, and CEX liquidity. Proposal benefit if passed is $1,800,000, but probability of passage after incentives is 64%. Quorum/control target is 120,000 COMP votes; treasury already controls 42,000 COMP. Missing votes can be rented with bribes at $3 per COMP vote or borrowed at $62 spot price with 18.0% APR for 10 days. Bridge, gas, delegation, and solver costs are $18,000. There is a 4.0% chance of an adverse governance delay costing $900,000. Execute only if net expected USD profit is positive and missing votes <= on-chain lendable liquidity; lendable liquidity is 93,000 COMP. Compute expected_value = pass probability*benefit - bribe cost - borrow interest - bridge/gas/delegation costs - expected delay loss. Also state missing votes and reject no_action if EV is positive.",
    "rubric_id": "l9-L9-019",
    "expected_values": {
      "intent": "governance_incentive_action",
      "order_type": "borrow_bribe_vote",
      "asset": "COMP",
      "size": 120000,
      "venue": "governance+lending+bridge"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-020",
    "level": 9,
    "prompt": "Refuse-to-trade decision, liquidation backrun during stale oracle window. Evaluate a $1,000,000 USDC opportunity across Uniswap/Aave/Compound, CEX hedge, bridge, oracle, solver, and MEV routes. Execute only if an option has net expected USD profit > 0 and all hard constraints pass: max slippage 0.40%, oracle age <= 60 seconds, settlement <= 12 minutes, and required capital <= $1,000,000. Option A Uniswap v3 ETH to Arb backrun: gross edge $14,200, fixed costs $4,100, slippage 0.52% of notional, expected risk 25.0% * $28,000, oracle age 45 seconds, settlement 9 minutes, required capital $900,000; Option B RFQ solver bridge: gross edge $26,000, fixed costs $5,200, slippage 0.15% of notional, expected risk 6.0% * $420,000, oracle age 38 seconds, settlement 18 minutes, required capital $950,000; Option C CEX hedge plus bridge unwind: gross edge $11,800, fixed costs $4,600, slippage 0.20% of notional, expected risk 3.0% * $300,000, oracle age 72 seconds, settlement 10 minutes, required capital $980,000. For each option, net EV = gross edge - fixed costs - slippage dollars - expected risk loss. Reject hard-constraint violations even if net EV is positive. Return no_action if no option is both positive-EV and feasible.",
    "rubric_id": "l9-L9-020",
    "expected_values": {
      "intent": "no_action",
      "order_type": "refuse_trade",
      "asset": "USDC",
      "size": 1000000,
      "venue": "dex+cex+bridge"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-021",
    "level": 9,
    "prompt": "Carry basis funding arbitrage, short horizon funding spike. Compare execute vs no-action for a delta-neutral SOL trade across Bybit SOL-PERP vs Coinbase spot, with USDC collateral on Base/ETH and a bridge unwind through Arb. Capital $750,000, trade notional $1,650,000, horizon 2 days. The perp is richer than spot by 0.48%; positive funding means the short perp receives 0.062% per 8 hours. Fees and slippage across spot, perp, bridge, gas, and solver are 0.21% of notional plus $650 fixed. Borrow drag is 11.0% APR for the horizon and liquidation buffer reserve is $2,500. Execute only if net annualized return on equity is > 25%, slippage stays <= 0.35%, and the bridge window is <= 16 hours; otherwise return no_action. Compute expected_value as annualized APR percentage for the best feasible action: (basis capture + funding - percent costs - fixed costs - borrow drag - buffer reserve) / capital * 365 / days.",
    "rubric_id": "l9-L9-021",
    "expected_values": {
      "intent": "funding_rate_arbitrage",
      "order_type": "hedged_perp_vs_spot",
      "asset": "SOL",
      "size": 1650000,
      "venue": "cex+dex_cross"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-022",
    "level": 9,
    "prompt": "Cross-chain route cost selection, CEX hedge available but solver wins. Swap $1,750,000 USDC into ETH from Base to Arb; reference ETH price is $3,500. Compare Uniswap/Across/solver/bridge/CEX routes and select the feasible route with lowest all-in USD cost before converting to output tokens. Hard constraints: settlement <= 16 minutes, oracle age <= 60 seconds, capacity >= notional, and slippage+risk must be included. Route A Uniswap pool then canonical bridge: percent cost 0.41%, fixed $1,800, expected risk 0.04% of notional, settlement 14 minutes, oracle age 40 seconds, capacity $4,000,000; Route B Across solver with RFQ fill: percent cost 0.24%, fixed $2,500, expected risk 0.02% of notional, settlement 8 minutes, oracle age 28 seconds, capacity $2,500,000; Route C CEX transfer hedge: percent cost 0.30%, fixed $1,300, expected risk 0.08% of notional, settlement 15 minutes, oracle age 52 seconds, capacity $1,800,000. Compute each route cost = percent cost*notional + fixed + expected risk*notional. expected_value is USD saved by the best feasible route vs the second-best feasible route; also mention resulting extra ETH = USD_saved / price.",
    "rubric_id": "l9-L9-022",
    "expected_values": {
      "intent": "cross_chain_intent_execution",
      "order_type": "route_cost_selection",
      "asset": "ETH",
      "size": 1750000,
      "venue": "dex+bridge+solver"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-023",
    "level": 9,
    "prompt": "Collateral leverage liquidation control, WBTC gap-down margin control. A Compound III position on Base/ETH uses 50 BTC collateral at $100,000 and $3,150,000 USDC debt, with Aave/Compound oracle cross-check and bridge unwind available. Liquidation threshold is 78.0%. Stress branch: if BTC depegs or falls 12.0%, maintain target health factor >= 1.3; if the post-shock HF would be below target, repay USDC rather than add collateral. Closing loops adds $8,000 gas, slippage, and solver fees to debt before repay. Compute expected_value as the minimum USDC debt reduction required after fees. Formula: max(0, current debt + fees - collateral value * LT * (1 - shock) / target HF). Also report pre-repay HF and reject any borrow-more action.",
    "rubric_id": "l9-L9-023",
    "expected_values": {
      "intent": "liquidation_control",
      "order_type": "debt_reduction",
      "asset": "BTC",
      "size": 50,
      "venue": "lending_protocol+oracle"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-024",
    "level": 9,
    "prompt": "Staking/restaking risk selection, high-yield but delay-capped restaking. Restake 150 stETH across EigenLayer/Symbiotic-style AVSs and pick exactly 3 eligible AVSs by highest risk-adjusted APR. Net score = headline yield - operator fee - slashing multiplier * expected slashing loss, all in APR percentage points. Eligibility constraints: net score >= 6%, slashing multiplier <= 3.5, withdrawal delay <= 8 days, oracle freshness <= 25 minutes, and capacity >= 150 stETH. Data: A1 yield 7.4%, operator fee 0.3%, slashing 1.4 x 0.5%, delay 3 days, oracle age 12 minutes, capacity 180 stETH; A2 yield 11.2%, operator fee 0.8%, slashing 2.5 x 0.9%, delay 7 days, oracle age 20 minutes, capacity 220 stETH; A3 yield 13.5%, operator fee 1%, slashing 4 x 1.1%, delay 5 days, oracle age 18 minutes, capacity 400 stETH; A4 yield 9.4%, operator fee 0.4%, slashing 1.8 x 0.6%, delay 6 days, oracle age 23 minutes, capacity 170 stETH; A5 yield 10.1%, operator fee 0.5%, slashing 2 x 0.7%, delay 4 days, oracle age 10 minutes, capacity 260 stETH. Return only the unordered set of selected AVS IDs; do not allocate weights, and reject any AVS that fails a hard constraint even if its yield is high.",
    "rubric_id": "l9-L9-024",
    "expected_values": {
      "intent": "restaking_optimization",
      "order_type": "risk_adjusted_selection",
      "asset": "stETH",
      "size": 150,
      "venue": "staking+oracle"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-025",
    "level": 9,
    "prompt": "Flash-loan exploit EV triage, thin liquidation book with high loan fee. A white-hat simulation considers a $8,000,000 USDC flash loan through Uniswap/Aave, with oracle manipulation, liquidations, MEV auction risk, and CEX hedge unwind. Gross liquidation profit if the bundle lands is $620,000. Costs on success: flash loan fee 0.09% of loan, gas $52,000, slippage $76,000, MEV payment $65,000. Success probability is 68%; if it fails or is frontrun, realized loss is flash-loan fee + gas + extra protection cost $60,000 and no liquidation profit. Hard constraints: oracle age <= 45 seconds, liquidation liquidity >= $640,000, and expected EV must be > 0 to execute. Current oracle age 35 seconds and liquidation liquidity $900,000. Compute expected_value as probability-weighted USD EV after all costs; abstain only if EV <= 0 or a hard constraint fails.",
    "rubric_id": "l9-L9-025",
    "expected_values": {
      "intent": "flash_loan_attack_eval",
      "order_type": "oracle_liquidation_ev",
      "asset": "USDC",
      "size": 8000000,
      "venue": "defi+mev"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-026",
    "level": 9,
    "prompt": "Fee APR annualization, yield-token flow rebate. A Pendle PT/YT router stETH pool/hook strategy has $8,500,000 active liquidity, $16,000,000 daily volume, and 72% of volume eligible for the incremental fee. Incremental fee is 0.018%; LP capture is 85%, protocol skim is 5%, and keeper/gas/solver overhead is $650 per day. Compare the incremental design vs vanilla Uniswap/Pendle base fees, but expected_value must be only the incremental simple APR percentage: ((daily volume * eligible share * incremental fee * capture * (1 - skim) - daily fixed overhead) * 365) / active liquidity. Check whether incremental APR is positive after a 20% daily-volume stress and oracle age <= 30 minutes; expected_value remains the base-case incremental APR. Exclude compounding, LP-token price drift, base pool fees, and rewards.",
    "rubric_id": "l9-L9-026",
    "expected_values": {
      "intent": "fee_apr_annualization",
      "order_type": "incremental_fee_apr",
      "asset": "stETH",
      "size": 8500000,
      "venue": "dex+lp"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-027",
    "level": 9,
    "prompt": "Governance incentive capital action, safety-module incentive vote. A DAO vote spans Compound/Aave style lending, Base and Arb bridge snapshots, and CEX liquidity. Proposal benefit if passed is $1,450,000, but probability of passage after incentives is 58%. Quorum/control target is 85,000 AAVE votes; treasury already controls 31,000 AAVE. Missing votes can be rented with bribes at $5 per AAVE vote or borrowed at $118 spot price with 22.0% APR for 7 days. Bridge, gas, delegation, and solver costs are $24,000. There is a 3.5% chance of an adverse governance delay costing $650,000. Execute only if net expected USD profit is positive and missing votes <= on-chain lendable liquidity; lendable liquidity is 69,000 AAVE. Compute expected_value = pass probability*benefit - bribe cost - borrow interest - bridge/gas/delegation costs - expected delay loss. Also state missing votes and reject no_action if EV is positive.",
    "rubric_id": "l9-L9-027",
    "expected_values": {
      "intent": "governance_incentive_action",
      "order_type": "borrow_bribe_vote",
      "asset": "AAVE",
      "size": 85000,
      "venue": "governance+lending+bridge"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-028",
    "level": 9,
    "prompt": "Refuse-to-trade decision, basis unwind while bridge queue is congested. Evaluate a $650,000 ETH opportunity across Uniswap/Aave/Compound, CEX hedge, bridge, oracle, solver, and MEV routes. Execute only if an option has net expected USD profit > 0 and all hard constraints pass: max slippage 0.35%, oracle age <= 45 seconds, settlement <= 10 minutes, and required capital <= $650,000. Option A Across solver hedge: gross edge $9,800, fixed costs $2,100, slippage 0.41% of notional, expected risk 8.0% * $90,000, oracle age 32 seconds, settlement 8 minutes, required capital $640,000; Option B CEX spot sale then bridge repay: gross edge $16,200, fixed costs $4,200, slippage 0.18% of notional, expected risk 4.0% * $360,000, oracle age 40 seconds, settlement 13 minutes, required capital $610,000; Option C Uniswap pool exit: gross edge $7,200, fixed costs $2,500, slippage 0.26% of notional, expected risk 10.0% * $70,000, oracle age 51 seconds, settlement 9 minutes, required capital $620,000. For each option, net EV = gross edge - fixed costs - slippage dollars - expected risk loss. Reject hard-constraint violations even if net EV is positive. Return no_action if no option is both positive-EV and feasible.",
    "rubric_id": "l9-L9-028",
    "expected_values": {
      "intent": "no_action",
      "order_type": "refuse_trade",
      "asset": "ETH",
      "size": 650000,
      "venue": "dex+cex+bridge"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-029",
    "level": 9,
    "prompt": "Carry basis funding arbitrage, low-fee institutional basis. Compare execute vs no-action for a delta-neutral BTC trade across Coinbase BTC spot vs Bybit BTC-PERP, with USDC collateral on Base/ETH and a bridge unwind through Arb. Capital $2,000,000, trade notional $4,000,000, horizon 5 days. The perp is richer than spot by 0.35%; positive funding means the short perp receives 0.031% per 8 hours. Fees and slippage across spot, perp, bridge, gas, and solver are 0.12% of notional plus $950 fixed. Borrow drag is 5.5% APR for the horizon and liquidation buffer reserve is $4,000. Execute only if net annualized return on equity is > 25%, slippage stays <= 0.35%, and the bridge window is <= 40 hours; otherwise return no_action. Compute expected_value as annualized APR percentage for the best feasible action: (basis capture + funding - percent costs - fixed costs - borrow drag - buffer reserve) / capital * 365 / days.",
    "rubric_id": "l9-L9-029",
    "expected_values": {
      "intent": "funding_rate_arbitrage",
      "order_type": "hedged_perp_vs_spot",
      "asset": "BTC",
      "size": 4000000,
      "venue": "cex+dex_cross"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-030",
    "level": 9,
    "prompt": "Cross-chain route cost selection, WBTC bridge versus solver close call. Swap $3,200,000 USDC into BTC from ETH to Base; reference BTC price is $100,000. Compare Uniswap/Across/solver/bridge/CEX routes and select the feasible route with lowest all-in USD cost before converting to output tokens. Hard constraints: settlement <= 18 minutes, oracle age <= 60 seconds, capacity >= notional, and slippage+risk must be included. Route A Uniswap WBTC bridge: percent cost 0.55%, fixed $3,000, expected risk 0.02% of notional, settlement 17 minutes, oracle age 44 seconds, capacity $6,000,000; Route B Across solver inventory: percent cost 0.31%, fixed $3,600, expected risk 0.06% of notional, settlement 12 minutes, oracle age 35 seconds, capacity $3,500,000; Route C CEX internal hedge plus withdrawal: percent cost 0.28%, fixed $5,200, expected risk 0.05% of notional, settlement 16 minutes, oracle age 40 seconds, capacity $3,300,000. Compute each route cost = percent cost*notional + fixed + expected risk*notional. expected_value is USD saved by the best feasible route vs the second-best feasible route; also mention resulting extra BTC = USD_saved / price.",
    "rubric_id": "l9-L9-030",
    "expected_values": {
      "intent": "cross_chain_intent_execution",
      "order_type": "route_cost_selection",
      "asset": "BTC",
      "size": 3200000,
      "venue": "dex+bridge+solver"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-031",
    "level": 9,
    "prompt": "Collateral leverage liquidation control, recursive stETH loop de-risk. A Morpho market with Aave oracle position on Base/ETH uses 1,200 stETH collateral at $3,300 and $2,900,000 USDC debt, with Aave/Compound oracle cross-check and bridge unwind available. Liquidation threshold is 83.0%. Stress branch: if stETH depegs or falls 6.0%, maintain target health factor >= 1.22; if the post-shock HF would be below target, repay USDC rather than add collateral. Closing loops adds $6,000 gas, slippage, and solver fees to debt before repay. Compute expected_value as the minimum USDC debt reduction required after fees. Formula: max(0, current debt + fees - collateral value * LT * (1 - shock) / target HF). Also report pre-repay HF and reject any borrow-more action.",
    "rubric_id": "l9-L9-031",
    "expected_values": {
      "intent": "liquidation_control",
      "order_type": "debt_reduction",
      "asset": "stETH",
      "size": 1200,
      "venue": "lending_protocol+oracle"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-032",
    "level": 9,
    "prompt": "Staking/restaking risk selection, low-risk ETH AVS filter. Restake 80 ETH across EigenLayer/Symbiotic-style AVSs and pick exactly 3 eligible AVSs by highest risk-adjusted APR. Net score = headline yield - operator fee - slashing multiplier * expected slashing loss, all in APR percentage points. Eligibility constraints: net score >= 4.8%, slashing multiplier <= 2.8, withdrawal delay <= 6 days, oracle freshness <= 20 minutes, and capacity >= 80 ETH. Data: A1 yield 6.8%, operator fee 0.2%, slashing 1.2 x 0.5%, delay 2 days, oracle age 8 minutes, capacity 90 ETH; A2 yield 9.6%, operator fee 0.6%, slashing 3 x 0.7%, delay 5 days, oracle age 12 minutes, capacity 120 ETH; A3 yield 7.2%, operator fee 0.4%, slashing 1.5 x 0.4%, delay 4 days, oracle age 18 minutes, capacity 100 ETH; A4 yield 11%, operator fee 0.9%, slashing 2.4 x 1.1%, delay 7 days, oracle age 15 minutes, capacity 200 ETH; A5 yield 5.9%, operator fee 0.1%, slashing 0.8 x 0.4%, delay 1 days, oracle age 10 minutes, capacity 85 ETH. Return only the unordered set of selected AVS IDs; do not allocate weights, and reject any AVS that fails a hard constraint even if its yield is high.",
    "rubric_id": "l9-L9-032",
    "expected_values": {
      "intent": "restaking_optimization",
      "order_type": "risk_adjusted_selection",
      "asset": "ETH",
      "size": 80,
      "venue": "staking+oracle"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-033",
    "level": 9,
    "prompt": "Flash-loan exploit EV triage, large oracle manipulation with heavy MEV auction. A white-hat simulation considers a $22,000,000 USDC flash loan through Uniswap/Aave, with oracle manipulation, liquidations, MEV auction risk, and CEX hedge unwind. Gross liquidation profit if the bundle lands is $1,450,000. Costs on success: flash loan fee 0.05% of loan, gas $110,000, slippage $210,000, MEV payment $180,000. Success probability is 61%; if it fails or is frontrun, realized loss is flash-loan fee + gas + extra protection cost $140,000 and no liquidation profit. Hard constraints: oracle age <= 45 seconds, liquidation liquidity >= $1,760,000, and expected EV must be > 0 to execute. Current oracle age 24 seconds and liquidation liquidity $2,400,000. Compute expected_value as probability-weighted USD EV after all costs; abstain only if EV <= 0 or a hard constraint fails.",
    "rubric_id": "l9-L9-033",
    "expected_values": {
      "intent": "flash_loan_attack_eval",
      "order_type": "oracle_liquidation_ev",
      "asset": "USDC",
      "size": 22000000,
      "venue": "defi+mev"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-034",
    "level": 9,
    "prompt": "Fee APR annualization, stablecoin fee compression. A Uniswap V3 stable pool USDC/RWA-T pool/hook strategy has $20,000,000 active liquidity, $42,000,000 daily volume, and 48% of volume eligible for the incremental fee. Incremental fee is 0.012%; LP capture is 92%, protocol skim is 12%, and keeper/gas/solver overhead is $1,100 per day. Compare the incremental design vs vanilla Uniswap/Pendle base fees, but expected_value must be only the incremental simple APR percentage: ((daily volume * eligible share * incremental fee * capture * (1 - skim) - daily fixed overhead) * 365) / active liquidity. Check whether incremental APR is positive after a 20% daily-volume stress and oracle age <= 30 minutes; expected_value remains the base-case incremental APR. Exclude compounding, LP-token price drift, base pool fees, and rewards.",
    "rubric_id": "l9-L9-034",
    "expected_values": {
      "intent": "fee_apr_annualization",
      "order_type": "incremental_fee_apr",
      "asset": "USDC/RWA-T",
      "size": 20000000,
      "venue": "dex+lp"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-035",
    "level": 9,
    "prompt": "Governance incentive capital action, treasury emissions redirect. A DAO vote spans Compound/Aave style lending, Base and Arb bridge snapshots, and CEX liquidity. Proposal benefit if passed is $2,400,000, but probability of passage after incentives is 52%. Quorum/control target is 160,000 COMP votes; treasury already controls 92,000 COMP. Missing votes can be rented with bribes at $3 per COMP vote or borrowed at $70 spot price with 16.0% APR for 14 days. Bridge, gas, delegation, and solver costs are $31,000. There is a 5.0% chance of an adverse governance delay costing $1,100,000. Execute only if net expected USD profit is positive and missing votes <= on-chain lendable liquidity; lendable liquidity is 83,000 COMP. Compute expected_value = pass probability*benefit - bribe cost - borrow interest - bridge/gas/delegation costs - expected delay loss. Also state missing votes and reject no_action if EV is positive.",
    "rubric_id": "l9-L9-035",
    "expected_values": {
      "intent": "governance_incentive_action",
      "order_type": "borrow_bribe_vote",
      "asset": "COMP",
      "size": 160000,
      "venue": "governance+lending+bridge"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-036",
    "level": 9,
    "prompt": "Refuse-to-trade decision, cross-chain collateral seizure after price gap. Evaluate a $1,800,000 BTC opportunity across Uniswap/Aave/Compound, CEX hedge, bridge, oracle, solver, and MEV routes. Execute only if an option has net expected USD profit > 0 and all hard constraints pass: max slippage 0.25%, oracle age <= 50 seconds, settlement <= 15 minutes, and required capital <= $1,800,000. Option A CEX hedge then bridge: gross edge $34,000, fixed costs $9,000, slippage 0.18% of notional, expected risk 6.0% * $420,000, oracle age 42 seconds, settlement 18 minutes, required capital $1,700,000; Option B Uniswap WBTC route: gross edge $22,500, fixed costs $7,100, slippage 0.31% of notional, expected risk 4.0% * $260,000, oracle age 39 seconds, settlement 12 minutes, required capital $1,600,000; Option C solver auction fill: gross edge $28,000, fixed costs $11,800, slippage 0.14% of notional, expected risk 8.0% * $310,000, oracle age 61 seconds, settlement 13 minutes, required capital $1,750,000. For each option, net EV = gross edge - fixed costs - slippage dollars - expected risk loss. Reject hard-constraint violations even if net EV is positive. Return no_action if no option is both positive-EV and feasible.",
    "rubric_id": "l9-L9-036",
    "expected_values": {
      "intent": "no_action",
      "order_type": "refuse_trade",
      "asset": "BTC",
      "size": 1800000,
      "venue": "dex+cex+bridge"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-037",
    "level": 9,
    "prompt": "Carry basis funding arbitrage, very high funding but thin spot. Compare execute vs no-action for a delta-neutral HYPE trade across Base spot inventory vs Hyperliquid HYPE-PERP, with USDC collateral on Base/ETH and a bridge unwind through Arb. Capital $400,000, trade notional $1,000,000, horizon 1.5 days. The perp is richer than spot by 0.28%; positive funding means the short perp receives 0.078% per 8 hours. Fees and slippage across spot, perp, bridge, gas, and solver are 0.32% of notional plus $120 fixed. Borrow drag is 14.0% APR for the horizon and liquidation buffer reserve is $1,900. Execute only if net annualized return on equity is > 25%, slippage stays <= 0.35%, and the bridge window is <= 12 hours; otherwise return no_action. Compute expected_value as annualized APR percentage for the best feasible action: (basis capture + funding - percent costs - fixed costs - borrow drag - buffer reserve) / capital * 365 / days.",
    "rubric_id": "l9-L9-037",
    "expected_values": {
      "intent": "funding_rate_arbitrage",
      "order_type": "hedged_perp_vs_spot",
      "asset": "HYPE",
      "size": 1000000,
      "venue": "cex+dex_cross"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-038",
    "level": 9,
    "prompt": "Cross-chain route cost selection, direct bridge nearly beats solver. Swap $2,000,000 USDC into SOL from Base to Solana; reference SOL price is $142. Compare Uniswap/Across/solver/bridge/CEX routes and select the feasible route with lowest all-in USD cost before converting to output tokens. Hard constraints: settlement <= 14 minutes, oracle age <= 60 seconds, capacity >= notional, and slippage+risk must be included. Route A Uniswap WETH hop: percent cost 0.70%, fixed $1,800, expected risk 0.02% of notional, settlement 13 minutes, oracle age 48 seconds, capacity $3,000,000; Route B intent solver: percent cost 0.35%, fixed $2,300, expected risk 0.04% of notional, settlement 9 minutes, oracle age 25 seconds, capacity $2,600,000; Route C direct bridge and DEX: percent cost 0.28%, fixed $1,400, expected risk 0.18% of notional, settlement 12 minutes, oracle age 36 seconds, capacity $2,400,000. Compute each route cost = percent cost*notional + fixed + expected risk*notional. expected_value is USD saved by the best feasible route vs the second-best feasible route; also mention resulting extra SOL = USD_saved / price.",
    "rubric_id": "l9-L9-038",
    "expected_values": {
      "intent": "cross_chain_intent_execution",
      "order_type": "route_cost_selection",
      "asset": "SOL",
      "size": 2000000,
      "venue": "dex+bridge+solver"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-039",
    "level": 9,
    "prompt": "Collateral leverage liquidation control, ETH liquidation buffer reset. A Spark ETH vault position on Base/ETH uses 700 ETH collateral at $3,500 and $1,620,000 USDC debt, with Aave/Compound oracle cross-check and bridge unwind available. Liquidation threshold is 80.0%. Stress branch: if ETH depegs or falls 10.0%, maintain target health factor >= 1.28; if the post-shock HF would be below target, repay USDC rather than add collateral. Closing loops adds $3,200 gas, slippage, and solver fees to debt before repay. Compute expected_value as the minimum USDC debt reduction required after fees. Formula: max(0, current debt + fees - collateral value * LT * (1 - shock) / target HF). Also report pre-repay HF and reject any borrow-more action.",
    "rubric_id": "l9-L9-039",
    "expected_values": {
      "intent": "liquidation_control",
      "order_type": "debt_reduction",
      "asset": "ETH",
      "size": 700,
      "venue": "lending_protocol+oracle"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-040",
    "level": 9,
    "prompt": "Staking/restaking risk selection, capacity-constrained large restake. Restake 250 stETH across EigenLayer/Symbiotic-style AVSs and pick exactly 3 eligible AVSs by highest risk-adjusted APR. Net score = headline yield - operator fee - slashing multiplier * expected slashing loss, all in APR percentage points. Eligibility constraints: net score >= 6.2%, slashing multiplier <= 3, withdrawal delay <= 10 days, oracle freshness <= 30 minutes, and capacity >= 250 stETH. Data: A1 yield 8.8%, operator fee 0.5%, slashing 2 x 0.6%, delay 8 days, oracle age 14 minutes, capacity 300 stETH; A2 yield 14%, operator fee 1.2%, slashing 3.2 x 1.2%, delay 9 days, oracle age 20 minutes, capacity 500 stETH; A3 yield 9.1%, operator fee 0.4%, slashing 1.6 x 0.7%, delay 5 days, oracle age 24 minutes, capacity 260 stETH; A4 yield 7.5%, operator fee 0.3%, slashing 1.1 x 0.5%, delay 4 days, oracle age 12 minutes, capacity 200 stETH; A5 yield 10.8%, operator fee 0.8%, slashing 2.4 x 0.8%, delay 6 days, oracle age 18 minutes, capacity 350 stETH. Return only the unordered set of selected AVS IDs; do not allocate weights, and reject any AVS that fails a hard constraint even if its yield is high.",
    "rubric_id": "l9-L9-040",
    "expected_values": {
      "intent": "restaking_optimization",
      "order_type": "risk_adjusted_selection",
      "asset": "stETH",
      "size": 250,
      "venue": "staking+oracle"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-041",
    "level": 9,
    "prompt": "Flash-loan exploit EV triage, MEV-protected bundle with lower fail loss. A white-hat simulation considers a $12,000,000 USDC flash loan through Uniswap/Aave, with oracle manipulation, liquidations, MEV auction risk, and CEX hedge unwind. Gross liquidation profit if the bundle lands is $760,000. Costs on success: flash loan fee 0.04% of loan, gas $48,000, slippage $98,000, MEV payment $115,000. Success probability is 75%; if it fails or is frontrun, realized loss is flash-loan fee + gas + extra protection cost $70,000 and no liquidation profit. Hard constraints: oracle age <= 45 seconds, liquidation liquidity >= $960,000, and expected EV must be > 0 to execute. Current oracle age 31 seconds and liquidation liquidity $1,400,000. Compute expected_value as probability-weighted USD EV after all costs; abstain only if EV <= 0 or a hard constraint fails.",
    "rubric_id": "l9-L9-041",
    "expected_values": {
      "intent": "flash_loan_attack_eval",
      "order_type": "oracle_liquidation_ev",
      "asset": "USDC",
      "size": 12000000,
      "venue": "defi+mev"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-042",
    "level": 9,
    "prompt": "Fee APR annualization, liquidation-flow surcharge. A Aave liquidation hook pool ETH/USDC pool/hook strategy has $15,500,000 active liquidity, $24,000,000 daily volume, and 63% of volume eligible for the incremental fee. Incremental fee is 0.030%; LP capture is 80%, protocol skim is 8%, and keeper/gas/solver overhead is $1,500 per day. Compare the incremental design vs vanilla Uniswap/Pendle base fees, but expected_value must be only the incremental simple APR percentage: ((daily volume * eligible share * incremental fee * capture * (1 - skim) - daily fixed overhead) * 365) / active liquidity. Check whether incremental APR is positive after a 20% daily-volume stress and oracle age <= 30 minutes; expected_value remains the base-case incremental APR. Exclude compounding, LP-token price drift, base pool fees, and rewards.",
    "rubric_id": "l9-L9-042",
    "expected_values": {
      "intent": "fee_apr_annualization",
      "order_type": "incremental_fee_apr",
      "asset": "ETH/USDC",
      "size": 15500000,
      "venue": "dex+lp"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-043",
    "level": 9,
    "prompt": "Governance incentive capital action, L2 incentive extension. A DAO vote spans Compound/Aave style lending, Base and Arb bridge snapshots, and CEX liquidity. Proposal benefit if passed is $820,000, but probability of passage after incentives is 67%. Quorum/control target is 2,200,000 ARB votes; treasury already controls 1,250,000 ARB. Missing votes can be rented with bribes at $0.055 per ARB vote or borrowed at $1 spot price with 12.0% simple APR for exactly 5/365 of a year. Bridge, gas, delegation, and solver costs are $22,000. There is a 6.0% chance of an adverse governance delay costing $380,000. Execute only if net expected USD profit is positive and missing votes <= on-chain lendable liquidity; lendable liquidity is 965,000 ARB. Compute expected_value = pass probability*benefit - bribe cost - borrow interest - bridge/gas/delegation costs - expected delay loss. Also state missing votes and reject no_action if EV is positive.",
    "rubric_id": "coinbench-l9-043",
    "expected_values": {
      "intent": "governance_incentive_action",
      "order_type": "borrow_bribe_vote",
      "asset": "ARB",
      "size": 2200000,
      "venue": "governance+lending+bridge"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-044",
    "level": 9,
    "prompt": "Refuse-to-trade decision, RFQ route during exchange halt. Evaluate a $1,200,000 SOL opportunity across Uniswap/Aave/Compound, CEX hedge, bridge, oracle, solver, and MEV routes. Execute only if an option has net expected USD profit > 0 and all hard constraints pass: max slippage 0.45%, oracle age <= 55 seconds, settlement <= 11 minutes, and required capital <= $1,200,000. Option A CEX hedge route: gross edge $18,500, fixed costs $6,200, slippage 0.19% of notional, expected risk 5.0% * $260,000, oracle age 44 seconds, settlement 14 minutes, required capital $1,180,000; Option B Uniswap bridge route: gross edge $13,600, fixed costs $3,900, slippage 0.51% of notional, expected risk 6.0% * $120,000, oracle age 49 seconds, settlement 9 minutes, required capital $1,100,000; Option C solver route: gross edge $21,000, fixed costs $4,800, slippage 0.22% of notional, expected risk 7.0% * $260,000, oracle age 63 seconds, settlement 8 minutes, required capital $1,190,000. For each option, net EV = gross edge - fixed costs - slippage dollars - expected risk loss. Reject hard-constraint violations even if net EV is positive. Return no_action if no option is both positive-EV and feasible.",
    "rubric_id": "l9-L9-044",
    "expected_values": {
      "intent": "no_action",
      "order_type": "refuse_trade",
      "asset": "SOL",
      "size": 1200000,
      "venue": "dex+cex+bridge"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-045",
    "level": 9,
    "prompt": "Carry basis funding arbitrage, slow convergence staking basis. Compare execute vs no-action for a delta-neutral stETH trade across Pendle PT hedge vs ETH-PERP short, with USDC collateral on Base/ETH and a bridge unwind through Arb. Capital $900,000, trade notional $1,800,000, horizon 7 days. The perp is richer than spot by 0.72%; positive funding means the short perp receives 0.018% per 8 hours. Fees and slippage across spot, perp, bridge, gas, and solver are 0.15% of notional plus $700 fixed. Borrow drag is 6.0% APR for the horizon and liquidation buffer reserve is $2,200. Execute only if net annualized return on equity is > 25%, slippage stays <= 0.35%, and the bridge window is <= 56 hours; otherwise return no_action. Compute expected_value as annualized APR percentage for the best feasible action: (basis capture + funding - percent costs - fixed costs - borrow drag - buffer reserve) / capital * 365 / days.",
    "rubric_id": "l9-L9-045",
    "expected_values": {
      "intent": "funding_rate_arbitrage",
      "order_type": "hedged_perp_vs_spot",
      "asset": "stETH",
      "size": 1800000,
      "venue": "cex+dex_cross"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-046",
    "level": 9,
    "prompt": "Cross-chain route cost selection, small-cap route with inventory cap. Swap $900,000 USDC into HYPE from Base to Hyperliquid; reference HYPE price is $28. Compare Uniswap/Across/solver/bridge/CEX routes and select the feasible route with lowest all-in USD cost before converting to output tokens. Hard constraints: settlement <= 12 minutes, oracle age <= 60 seconds, capacity >= notional, and slippage+risk must be included. Route A Uniswap bridge route: percent cost 0.45%, fixed $900, expected risk 0.05% of notional, settlement 11 minutes, oracle age 41 seconds, capacity $1,500,000; Route B solver inventory route: percent cost 0.21%, fixed $1,800, expected risk 0.02% of notional, settlement 7 minutes, oracle age 30 seconds, capacity $950,000; Route C direct bridge route: percent cost 0.19%, fixed $2,400, expected risk 0.09% of notional, settlement 9 minutes, oracle age 33 seconds, capacity $1,000,000. Compute each route cost = percent cost*notional + fixed + expected risk*notional. expected_value is USD saved by the best feasible route vs the second-best feasible route; also mention resulting extra HYPE = USD_saved / price.",
    "rubric_id": "l9-L9-046",
    "expected_values": {
      "intent": "cross_chain_intent_execution",
      "order_type": "route_cost_selection",
      "asset": "HYPE",
      "size": 900000,
      "venue": "dex+bridge+solver"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-047",
    "level": 9,
    "prompt": "Collateral leverage liquidation control, governance-token collateral haircut. A Aave isolated market position on Base/ETH uses 70,000 COMP collateral at $62 and $1,650,000 USDC debt, with Aave/Compound oracle cross-check and bridge unwind available. Liquidation threshold is 55.0%. Stress branch: if COMP depegs or falls 20.0%, maintain target health factor >= 1.35; if the post-shock HF would be below target, repay USDC rather than add collateral. Closing loops adds $7,500 gas, slippage, and solver fees to debt before repay. Compute expected_value as the minimum USDC debt reduction required after fees. Formula: max(0, current debt + fees - collateral value * LT * (1 - shock) / target HF). Also report pre-repay HF and reject any borrow-more action.",
    "rubric_id": "l9-L9-047",
    "expected_values": {
      "intent": "liquidation_control",
      "order_type": "debt_reduction",
      "asset": "COMP",
      "size": 70000,
      "venue": "lending_protocol+oracle"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-048",
    "level": 9,
    "prompt": "Staking/restaking risk selection, fast-withdrawal AVS basket. Restake 60 ETH across EigenLayer/Symbiotic-style AVSs and pick exactly 3 eligible AVSs by highest risk-adjusted APR. Net score = headline yield - operator fee - slashing multiplier * expected slashing loss, all in APR percentage points. Eligibility constraints: net score >= 5%, slashing multiplier <= 2.5, withdrawal delay <= 5 days, oracle freshness <= 18 minutes, and capacity >= 60 ETH. Data: A1 yield 6.4%, operator fee 0.2%, slashing 1 x 0.5%, delay 2 days, oracle age 8 minutes, capacity 80 ETH; A2 yield 8.9%, operator fee 0.5%, slashing 2.1 x 0.7%, delay 4 days, oracle age 15 minutes, capacity 100 ETH; A3 yield 10.2%, operator fee 0.8%, slashing 2.7 x 0.8%, delay 4 days, oracle age 12 minutes, capacity 120 ETH; A4 yield 7.1%, operator fee 0.3%, slashing 1.6 x 0.6%, delay 6 days, oracle age 10 minutes, capacity 70 ETH; A5 yield 7.8%, operator fee 0.4%, slashing 1.8 x 0.5%, delay 3 days, oracle age 16 minutes, capacity 65 ETH. Return only the unordered set of selected AVS IDs; do not allocate weights, and reject any AVS that fails a hard constraint even if its yield is high.",
    "rubric_id": "l9-L9-048",
    "expected_values": {
      "intent": "restaking_optimization",
      "order_type": "risk_adjusted_selection",
      "asset": "ETH",
      "size": 60,
      "venue": "staking+oracle"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-049",
    "level": 9,
    "prompt": "Flash-loan exploit EV triage, small pool liquidation with volatile slippage. A white-hat simulation considers a $5,000,000 USDC flash loan through Uniswap/Aave, with oracle manipulation, liquidations, MEV auction risk, and CEX hedge unwind. Gross liquidation profit if the bundle lands is $410,000. Costs on success: flash loan fee 0.05% of loan, gas $39,000, slippage $42,000, MEV payment $38,000. Success probability is 64%; if it fails or is frontrun, realized loss is flash-loan fee + gas + extra protection cost $52,000 and no liquidation profit. Hard constraints: oracle age <= 45 seconds, liquidation liquidity >= $400,000, and expected EV must be > 0 to execute. Current oracle age 29 seconds and liquidation liquidity $600,000. Compute expected_value as probability-weighted USD EV after all costs; abstain only if EV <= 0 or a hard constraint fails.",
    "rubric_id": "l9-L9-049",
    "expected_values": {
      "intent": "flash_loan_attack_eval",
      "order_type": "oracle_liquidation_ev",
      "asset": "USDC",
      "size": 5000000,
      "venue": "defi+mev"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-050",
    "level": 9,
    "prompt": "Fee APR annualization, small-cap solver fee APR. A Base Uniswap intent pool HYPE/USDC pool/hook strategy has $6,200,000 active liquidity, $9,500,000 daily volume, and 58% of volume eligible for the incremental fee. Incremental fee is 0.035%; LP capture is 88%, protocol skim is 15%, and keeper/gas/solver overhead is $520 per day. Compare the incremental design vs vanilla Uniswap/Pendle base fees, but expected_value must be only the incremental simple APR percentage: ((daily volume * eligible share * incremental fee * capture * (1 - skim) - daily fixed overhead) * 365) / active liquidity. Check whether incremental APR is positive after a 20% daily-volume stress and oracle age <= 30 minutes; expected_value remains the base-case incremental APR. Exclude compounding, LP-token price drift, base pool fees, and rewards.",
    "rubric_id": "l9-L9-050",
    "expected_values": {
      "intent": "fee_apr_annualization",
      "order_type": "incremental_fee_apr",
      "asset": "HYPE/USDC",
      "size": 6200000,
      "venue": "dex+lp"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-051",
    "level": 9,
    "prompt": "Governance incentive capital action, perp listing incentive. A DAO vote spans Compound/Aave style lending, Base and Arb bridge snapshots, and CEX liquidity. Proposal benefit if passed is $640,000, but probability of passage after incentives is 61%. Quorum/control target is 240,000 HYPE votes; treasury already controls 96,000 HYPE. Missing votes can be rented with bribes at $1 per HYPE vote or borrowed at $28 spot price with 28.0% APR for 3 days. Bridge, gas, delegation, and solver costs are $9,000. There is a 4.5% chance of an adverse governance delay costing $240,000. Execute only if net expected USD profit is positive and missing votes <= on-chain lendable liquidity; lendable liquidity is 159,000 HYPE. Compute expected_value = pass probability*benefit - bribe cost - borrow interest - bridge/gas/delegation costs - expected delay loss. Also state missing votes and reject no_action if EV is positive.",
    "rubric_id": "l9-L9-051",
    "expected_values": {
      "intent": "governance_incentive_action",
      "order_type": "borrow_bribe_vote",
      "asset": "HYPE",
      "size": 240000,
      "venue": "governance+lending+bridge"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-052",
    "level": 9,
    "prompt": "Refuse-to-trade decision, thin-liquidity funding capture rejection. Evaluate a $500,000 HYPE opportunity across Uniswap/Aave/Compound, CEX hedge, bridge, oracle, solver, and MEV routes. Execute only if an option has net expected USD profit > 0 and all hard constraints pass: max slippage 0.60%, oracle age <= 40 seconds, settlement <= 8 minutes, and required capital <= $500,000. Option A Hyperliquid perp plus Base spot: gross edge $9,600, fixed costs $2,300, slippage 0.72% of notional, expected risk 4.0% * $90,000, oracle age 31 seconds, settlement 6 minutes, required capital $480,000; Option B solver spot route: gross edge $12,800, fixed costs $3,900, slippage 0.35% of notional, expected risk 8.0% * $140,000, oracle age 35 seconds, settlement 10 minutes, required capital $490,000; Option C CEX hedge route: gross edge $7,200, fixed costs $2,600, slippage 0.28% of notional, expected risk 6.0% * $85,000, oracle age 46 seconds, settlement 7 minutes, required capital $470,000. For each option, net EV = gross edge - fixed costs - slippage dollars - expected risk loss. Reject hard-constraint violations even if net EV is positive. Return no_action if no option is both positive-EV and feasible.",
    "rubric_id": "l9-L9-052",
    "expected_values": {
      "intent": "no_action",
      "order_type": "refuse_trade",
      "asset": "HYPE",
      "size": 500000,
      "venue": "dex+cex+bridge"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-053",
    "level": 9,
    "prompt": "Carry basis funding arbitrage, event-driven governance basis. Compare execute vs no-action for a delta-neutral COMP trade across Compound governance-token spot vs Bybit COMP-PERP, with USDC collateral on Base/ETH and a bridge unwind through Arb. Capital $600,000, trade notional $1,200,000, horizon 4 days. The perp is richer than spot by 0.55%; positive funding means the short perp receives 0.042% per 8 hours. Fees and slippage across spot, perp, bridge, gas, and solver are 0.24% of notional plus $500 fixed. Borrow drag is 18.0% APR for the horizon and liquidation buffer reserve is $3,500. Execute only if net annualized return on equity is > 25%, slippage stays <= 0.35%, and the bridge window is <= 32 hours; otherwise return no_action. Compute expected_value as annualized APR percentage for the best feasible action: (basis capture + funding - percent costs - fixed costs - borrow drag - buffer reserve) / capital * 365 / days.",
    "rubric_id": "l9-L9-053",
    "expected_values": {
      "intent": "funding_rate_arbitrage",
      "order_type": "hedged_perp_vs_spot",
      "asset": "COMP",
      "size": 1200000,
      "venue": "cex+dex_cross"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-054",
    "level": 9,
    "prompt": "Cross-chain route cost selection, large stETH bridge with withdrawal-risk pricing. Swap $4,500,000 USDC into stETH from ETH to Arb; reference stETH price is $3,200. Compare Uniswap/Across/solver/bridge/CEX routes and select the feasible route with lowest all-in USD cost before converting to output tokens. Hard constraints: settlement <= 20 minutes, oracle age <= 60 seconds, capacity >= notional, and slippage+risk must be included. Route A Uniswap stETH bridge: percent cost 0.38%, fixed $2,800, expected risk 0.03% of notional, settlement 18 minutes, oracle age 44 seconds, capacity $7,000,000; Route B Across solver route: percent cost 0.29%, fixed $4,300, expected risk 0.04% of notional, settlement 13 minutes, oracle age 32 seconds, capacity $5,000,000; Route C CEX inventory hedge: percent cost 0.22%, fixed $9,000, expected risk 0.02% of notional, settlement 16 minutes, oracle age 36 seconds, capacity $4,800,000. Compute each route cost = percent cost*notional + fixed + expected risk*notional. expected_value is USD saved by the best feasible route vs the second-best feasible route; also mention resulting extra stETH = USD_saved / price.",
    "rubric_id": "l9-L9-054",
    "expected_values": {
      "intent": "cross_chain_intent_execution",
      "order_type": "route_cost_selection",
      "asset": "stETH",
      "size": 4500000,
      "venue": "dex+bridge+solver"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-055",
    "level": 9,
    "prompt": "Collateral leverage liquidation control, Base bridge depeg stress. A Compound on Base position on Base/ETH uses 1,000 stETH collateral at $3,100 and $2,050,000 USDC debt, with Aave/Compound oracle cross-check and bridge unwind available. Liquidation threshold is 84.0%. Stress branch: if stETH depegs or falls 9.0%, maintain target health factor >= 1.3; if the post-shock HF would be below target, repay USDC rather than add collateral. Closing loops adds $5,000 gas, slippage, and solver fees to debt before repay. Compute expected_value as the minimum USDC debt reduction required after fees. Formula: max(0, current debt + fees - collateral value * LT * (1 - shock) / target HF). Also report pre-repay HF and reject any borrow-more action.",
    "rubric_id": "l9-L9-055",
    "expected_values": {
      "intent": "liquidation_control",
      "order_type": "debt_reduction",
      "asset": "stETH",
      "size": 1000,
      "venue": "lending_protocol+oracle"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-056",
    "level": 9,
    "prompt": "Staking/restaking risk selection, post-incident conservative restake. Restake 180 stETH across EigenLayer/Symbiotic-style AVSs and pick exactly 3 eligible AVSs by highest risk-adjusted APR. Net score = headline yield - operator fee - slashing multiplier * expected slashing loss, all in APR percentage points. Eligibility constraints: net score >= 6.5%, slashing multiplier <= 3, withdrawal delay <= 7 days, oracle freshness <= 22 minutes, and capacity >= 180 stETH. Data: A1 yield 8.2%, operator fee 0.4%, slashing 1.8 x 0.7%, delay 5 days, oracle age 12 minutes, capacity 220 stETH; A2 yield 12.5%, operator fee 0.9%, slashing 3.1 x 1%, delay 6 days, oracle age 20 minutes, capacity 260 stETH; A3 yield 9.7%, operator fee 0.6%, slashing 2 x 0.8%, delay 4 days, oracle age 18 minutes, capacity 200 stETH; A4 yield 7.8%, operator fee 0.3%, slashing 1.2 x 0.5%, delay 3 days, oracle age 10 minutes, capacity 190 stETH; A5 yield 10.9%, operator fee 0.7%, slashing 2.4 x 0.9%, delay 8 days, oracle age 16 minutes, capacity 300 stETH. Return only the unordered set of selected AVS IDs; do not allocate weights, and reject any AVS that fails a hard constraint even if its yield is high.",
    "rubric_id": "l9-L9-056",
    "expected_values": {
      "intent": "restaking_optimization",
      "order_type": "risk_adjusted_selection",
      "asset": "stETH",
      "size": 180,
      "venue": "staking+oracle"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-057",
    "level": 9,
    "prompt": "Flash-loan exploit EV triage, large toxic-flow liquidation with high fail penalty. A white-hat simulation considers a $30,000,000 USDC flash loan through Uniswap/Aave, with oracle manipulation, liquidations, MEV auction risk, and CEX hedge unwind. Gross liquidation profit if the bundle lands is $2,100,000. Costs on success: flash loan fee 0.06% of loan, gas $145,000, slippage $280,000, MEV payment $260,000. Success probability is 59%; if it fails or is frontrun, realized loss is flash-loan fee + gas + extra protection cost $190,000 and no liquidation profit. Hard constraints: oracle age <= 45 seconds, liquidation liquidity >= $2,400,000, and expected EV must be > 0 to execute. Current oracle age 27 seconds and liquidation liquidity $3,600,000. Compute expected_value as probability-weighted USD EV after all costs; abstain only if EV <= 0 or a hard constraint fails.",
    "rubric_id": "l9-L9-057",
    "expected_values": {
      "intent": "flash_loan_attack_eval",
      "order_type": "oracle_liquidation_ev",
      "asset": "USDC",
      "size": 30000000,
      "venue": "defi+mev"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-058",
    "level": 9,
    "prompt": "Fee APR annualization, blue-chip liquidation fee stream. A Compound liquidation auction pool BTC/USDC pool/hook strategy has $26,000,000 active liquidity, $38,000,000 daily volume, and 44% of volume eligible for the incremental fee. Incremental fee is 0.028%; LP capture is 82%, protocol skim is 10%, and keeper/gas/solver overhead is $2,100 per day. Compare the incremental design vs vanilla Uniswap/Pendle base fees, but expected_value must be only the incremental simple APR percentage: ((daily volume * eligible share * incremental fee * capture * (1 - skim) - daily fixed overhead) * 365) / active liquidity. Check whether incremental APR is positive after a 20% daily-volume stress and oracle age <= 30 minutes; expected_value remains the base-case incremental APR. Exclude compounding, LP-token price drift, base pool fees, and rewards.",
    "rubric_id": "l9-L9-058",
    "expected_values": {
      "intent": "fee_apr_annualization",
      "order_type": "incremental_fee_apr",
      "asset": "BTC/USDC",
      "size": 26000000,
      "venue": "dex+lp"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-059",
    "level": 9,
    "prompt": "Governance incentive capital action, risk-parameter rollback. A DAO vote spans Compound/Aave style lending, Base and Arb bridge snapshots, and CEX liquidity. Proposal benefit if passed is $1,200,000, but probability of passage after incentives is 63%. Quorum/control target is 98,000 COMP votes; treasury already controls 55,000 COMP. Missing votes can be rented with bribes at $4 per COMP vote or borrowed at $66 spot price with 20.0% APR for 9 days. Bridge, gas, delegation, and solver costs are $16,000. There is a 4.0% chance of an adverse governance delay costing $520,000. Execute only if net expected USD profit is positive and missing votes <= on-chain lendable liquidity; lendable liquidity is 58,000 COMP. Compute expected_value = pass probability*benefit - bribe cost - borrow interest - bridge/gas/delegation costs - expected delay loss. Also state missing votes and reject no_action if EV is positive.",
    "rubric_id": "l9-L9-059",
    "expected_values": {
      "intent": "governance_incentive_action",
      "order_type": "borrow_bribe_vote",
      "asset": "COMP",
      "size": 98000,
      "venue": "governance+lending+bridge"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-060",
    "level": 9,
    "prompt": "Refuse-to-trade decision, restaking incident unwind abstention. Evaluate a $2,200,000 stETH opportunity across Uniswap/Aave/Compound, CEX hedge, bridge, oracle, solver, and MEV routes. Execute only if an option has net expected USD profit > 0 and all hard constraints pass: max slippage 0.30%, oracle age <= 35 seconds, settlement <= 14 minutes, and required capital <= $2,200,000. Option A Aave repay via Uniswap: gross edge $31,000, fixed costs $8,400, slippage 0.36% of notional, expected risk 5.0% * $360,000, oracle age 28 seconds, settlement 12 minutes, required capital $2,100,000; Option B CEX hedge bridge unwind: gross edge $52,000, fixed costs $14,200, slippage 0.15% of notional, expected risk 9.0% * $430,000, oracle age 30 seconds, settlement 17 minutes, required capital $2,050,000; Option C solver liquidation fill: gross edge $38,000, fixed costs $9,300, slippage 0.22% of notional, expected risk 6.0% * $390,000, oracle age 41 seconds, settlement 11 minutes, required capital $2,150,000. For each option, net EV = gross edge - fixed costs - slippage dollars - expected risk loss. Reject hard-constraint violations even if net EV is positive. Return no_action if no option is both positive-EV and feasible.",
    "rubric_id": "l9-L9-060",
    "expected_values": {
      "intent": "no_action",
      "order_type": "refuse_trade",
      "asset": "stETH",
      "size": 2200000,
      "venue": "dex+cex+bridge"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-061",
    "level": 9,
    "prompt": "Carry-basis funding arbitrage, post-unlock positive funding window. On 2026-06-12 compare execute vs no-action for a delta-neutral ARB trade using Arbitrum spot inventory vs Hyperliquid ARB-PERP short, with USDC collateral staged on Base and the hedge unwind through Arbitrum. Capital $850,000, trade notional $2,125,000, horizon 3.5 days. The perp/futures leg is richer than spot by 0.43%; positive funding means the short derivative receives 0.054% per 8 hours. All entry/exit fees, bridge tolls, solver fees, gas, and slippage consume 0.19% of notional plus $780 fixed. Borrow drag is 9.5% APR for the horizon and the liquidation-buffer reserve is $2,400. Execute only if net annualized return on equity is > 25%, realized slippage stays <= 0.31%, and the bridge window is <= 24 hours; observed bridge window is 18 hours. Compute expected_value as annualized APR percentage for the best feasible action: (basis capture + funding - percent costs - fixed costs - borrow drag - buffer reserve) / capital * 365 / days.",
    "rubric_id": "l9-L9-061",
    "expected_values": {
      "intent": "funding_rate_arbitrage",
      "order_type": "hedged_derivative_vs_spot",
      "asset": "ARB",
      "size": 2125000,
      "venue": "cex+dex_cross"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-062",
    "level": 9,
    "prompt": "Cross-chain route cost selection, L2 governance-token route with one fast-but-stale bridge leg. Swap $1,900,000 USDC into ARB from Ethereum to Arbitrum; reference ARB price is $1.15. Compare four Uniswap/Across/solver/bridge/CEX style routes and select the feasible route with lowest all-in USD cost before converting to output tokens. Hard constraints: settlement <= 18 minutes, oracle age <= 50 seconds, capacity >= notional, and slippage+risk must be included. Route A canonical bridge plus DEX: percent cost 0.52%, fixed $1,800, expected risk 0.03% of notional, settlement 17 minutes, oracle age 44 seconds, capacity $3,000,000; Route B Across RFQ solver: percent cost 0.2%, fixed $3,200, expected risk 0.04% of notional, settlement 10 minutes, oracle age 32 seconds, capacity $2,200,000; Route C CEX inventory transfer: percent cost 0.18%, fixed $5,200, expected risk 0.02% of notional, settlement 14 minutes, oracle age 38 seconds, capacity $1,950,000; Route D direct bridge with DEX out: percent cost 0.24%, fixed $1,600, expected risk 0.12% of notional, settlement 22 minutes, oracle age 41 seconds, capacity $2,400,000. Compute each route cost = percent cost*notional + fixed + expected risk*notional. expected_value is USD saved by the best feasible route versus the second-best feasible route; also mention resulting extra ARB = USD_saved / price.",
    "rubric_id": "l9-L9-062",
    "expected_values": {
      "intent": "cross_chain_intent_execution",
      "order_type": "route_cost_selection",
      "asset": "ARB",
      "size": 1900000,
      "venue": "dex+bridge+solver+cex"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-063",
    "level": 9,
    "prompt": "Collateral leverage liquidation control, governance collateral haircut after oracle dispersion. A Aave isolated governance-token market position on Base/ETH uses 4,200 AAVE collateral at $125 and $305,000 USDC debt, with Aave/Compound oracle cross-check and a bridge unwind path available. Liquidation threshold is 68%. Stress branch: if AAVE depegs or falls 16%, maintain target health factor >= 1.32; if the post-shock HF would be below target, repay USDC rather than add collateral or borrow more. Closing loops adds $3,800 gas, slippage, solver, and unwind fees to debt before repay. Compute expected_value as the minimum USDC debt reduction required after fees. Formula: max(0, current debt + fees - collateral value * LT * (1 - shock) / target HF). Also report pre-repay stressed HF and reject any borrow-more action.",
    "rubric_id": "l9-L9-063",
    "expected_values": {
      "intent": "liquidation_control",
      "order_type": "debt_reduction",
      "asset": "AAVE",
      "size": 4200,
      "venue": "lending_protocol+oracle+bridge"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-064",
    "level": 9,
    "prompt": "Staking/restaking risk selection, rETH AVS basket with high-yield multiplier traps. Restake 120 rETH across EigenLayer/Symbiotic-style AVSs and pick exactly 3 eligible AVSs by highest risk-adjusted APR. Net score = headline yield - operator fee - slashing multiplier * expected slashing loss, all in APR percentage points. Eligibility constraints: net score >= 5.8%, slashing multiplier <= 3, withdrawal delay <= 7 days, oracle freshness <= 25 minutes, and capacity >= 120 rETH. Data: R1 yield 8.1%, operator fee 0.4%, slashing 1.4 x 0.6%, delay 4 days, oracle age 12 minutes, capacity 150 rETH; R2 yield 11.4%, operator fee 0.9%, slashing 2.8 x 0.9%, delay 7 days, oracle age 18 minutes, capacity 180 rETH; R3 yield 9.2%, operator fee 0.5%, slashing 1.7 x 0.7%, delay 5 days, oracle age 21 minutes, capacity 140 rETH; R4 yield 13%, operator fee 0.8%, slashing 3.4 x 1.1%, delay 6 days, oracle age 10 minutes, capacity 240 rETH; R5 yield 7%, operator fee 0.2%, slashing 0.9 x 0.5%, delay 9 days, oracle age 9 minutes, capacity 130 rETH; R6 yield 10%, operator fee 0.7%, slashing 2.2 x 0.8%, delay 6 days, oracle age 28 minutes, capacity 170 rETH. Return only the unordered set of selected AVS IDs; do not allocate weights, and reject any AVS that fails a hard constraint even if its yield is high.",
    "rubric_id": "l9-L9-064",
    "expected_values": {
      "intent": "restaking_optimization",
      "order_type": "risk_adjusted_selection",
      "asset": "rETH",
      "size": 120,
      "venue": "staking+oracle"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-065",
    "level": 9,
    "prompt": "Flash-loan exploit EV triage, oracle-lag liquidation with failed-hedge downside. A white-hat simulation considers a $18,000,000 USDC flash loan through Uniswap/Aave, with oracle manipulation, liquidation capture, MEV auction risk, and CEX hedge unwind. Gross liquidation profit if the bundle lands is $1,240,000. Costs on success: flash loan fee 0.05% of loan, gas $82,000, slippage $155,000, MEV payment $130,000, and hedge unwind $35,000. Success probability is 66%; if it fails or is frontrun, realized loss is flash-loan fee + gas + extra protection cost $95,000 + failed hedge cost $25,000 and no liquidation profit. Hard constraints: oracle age <= 40 seconds, liquidation liquidity >= $1,600,000, and expected EV must be > 0 to execute. Current oracle age 26 seconds and liquidation liquidity $2,100,000. Compute expected_value as probability-weighted USD EV after all success and failure costs; abstain only if EV <= 0 or a hard constraint fails.",
    "rubric_id": "l9-L9-065",
    "expected_values": {
      "intent": "flash_loan_attack_eval",
      "order_type": "oracle_liquidation_ev",
      "asset": "USDC",
      "size": 18000000,
      "venue": "defi+mev+cex"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-066",
    "level": 9,
    "prompt": "Fee APR annualization, two-bucket stablecoin hook fee stream. A Uniswap/Pendle-style LUSD/USDC pool/hook strategy has $18,000,000 active liquidity. Daily flow has two separately priced eligible buckets: bucket 1 volume $24,000,000 with 44% eligible for a 0.022% incremental fee, and bucket 2 volume $6,000,000 with 80% eligible for a 0.04% incremental fee. LP capture is 87%, protocol skim is 9%, and keeper/gas/solver overhead is $1,200 per day. Compare the incremental design vs vanilla base fees, but expected_value must be only the incremental simple APR percentage: (((bucket1 volume * eligible share * incremental fee) + (bucket2 volume * eligible share * incremental fee)) * capture * (1 - skim) - daily fixed overhead) * 365 / active liquidity. Check whether incremental APR remains positive after a 25% volume stress and oracle age <= 25 minutes; expected_value remains the base-case incremental APR. Exclude compounding, rewards, base pool fees, inventory drift, and LP-token price movement.",
    "rubric_id": "l9-L9-066",
    "expected_values": {
      "intent": "fee_apr_annualization",
      "order_type": "incremental_fee_apr",
      "asset": "LUSD/USDC",
      "size": 18000000,
      "venue": "dex+lp"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-067",
    "level": 9,
    "prompt": "Governance incentive capital action, surplus-buffer parameter vote. A DAO vote spans Compound/Aave-style lending, Base and Arbitrum bridge snapshots, CEX liquidity, delegation, and incentive routing. Proposal benefit if passed is $2,800,000, but probability of passage after incentives is 57%. Quorum/control target is 38,000 MKR votes; treasury already controls 21,500 MKR. Missing votes are rented with bribes at $24 per MKR vote and financed by borrowing the same MKR exposure at $1900 spot with 14% APR for 6 days. Bridge, gas, delegation, vote-market, and solver costs are $28,000. There is a 3.5% chance of an adverse governance delay costing $1,100,000. Execute only if net expected USD profit is positive and missing votes <= on-chain lendable liquidity; lendable liquidity is 19,000 MKR. Compute expected_value = pass probability*benefit - bribe cost - borrow interest - fixed costs - expected delay loss. Also state missing votes and reject no_action if EV is positive.",
    "rubric_id": "l9-L9-067",
    "expected_values": {
      "intent": "governance_incentive_action",
      "order_type": "borrow_bribe_vote",
      "asset": "MKR",
      "size": 38000,
      "venue": "governance+lending+bridge"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-068",
    "level": 9,
    "prompt": "Refuse-to-trade decision, stablecoin depeg backrun where only invalid paths look profitable. Evaluate a $900,000 USDC opportunity across Uniswap/Aave/Compound, CEX hedge, bridge, oracle, solver, and MEV routes. Execute only if an option has net expected USD profit > 0 and all hard constraints pass: max slippage 0.32%, oracle age <= 50 seconds, settlement <= 9 minutes, and required capital <= $900,000. Option A Uniswap backrun: gross edge $15,000, fixed costs $3,500, slippage 0.38% of notional, expected risk 6% * $130,000, oracle age 42 seconds, settlement 7 minutes, required capital $880,000; Option B RFQ bridge solver: gross edge $24,000, fixed costs $5,200, slippage 0.12% of notional, expected risk 4% * $480,000, oracle age 35 seconds, settlement 12 minutes, required capital $890,000; Option C CEX hedge bridge unwind: gross edge $10,500, fixed costs $3,200, slippage 0.21% of notional, expected risk 2% * $220,000, oracle age 62 seconds, settlement 8 minutes, required capital $870,000; Option D private relay fill: gross edge $8,500, fixed costs $2,100, slippage 0.28% of notional, expected risk 10% * $80,000, oracle age 39 seconds, settlement 7 minutes, required capital $760,000. For each option, net EV = gross edge - fixed costs - slippage dollars - expected risk loss. Reject hard-constraint violations even if net EV is positive. Return no_action if no option is both positive-EV and feasible, and report top-level expected_value = 0 only when abstaining.",
    "rubric_id": "l9-L9-068",
    "expected_values": {
      "intent": "no_action",
      "order_type": "refuse_trade",
      "asset": "USDC",
      "size": 900000,
      "venue": "dex+cex+bridge"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-069",
    "level": 9,
    "prompt": "Carry-basis funding arbitrage, quarterly-future basis with borrow-drag sensitivity. On 2026-06-12 compare execute vs no-action for a delta-neutral OP trade using Optimism spot basket vs OKX OP quarterly future short, with USDC collateral staged on Base and the hedge unwind through Arbitrum. Capital $1,100,000, trade notional $2,750,000, horizon 6 days. The perp/futures leg is richer than spot by 0.31%; positive funding means the short derivative receives 0.027% per 8 hours. All entry/exit fees, bridge tolls, solver fees, gas, and slippage consume 0.11% of notional plus $1,300 fixed. Borrow drag is 8.2% APR for the horizon and the liquidation-buffer reserve is $3,500. Execute only if net annualized return on equity is > 25%, realized slippage stays <= 0.28%, and the bridge window is <= 36 hours; observed bridge window is 30 hours. Compute expected_value as annualized APR percentage for the best feasible action: (basis capture + funding - percent costs - fixed costs - borrow drag - buffer reserve) / capital * 365 / days.",
    "rubric_id": "l9-L9-069",
    "expected_values": {
      "intent": "funding_rate_arbitrage",
      "order_type": "hedged_derivative_vs_spot",
      "asset": "OP",
      "size": 2750000,
      "venue": "cex+dex_cross"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-070",
    "level": 9,
    "prompt": "Cross-chain route cost selection, modular-token bridge with stale direct-oracle leg. Swap $3,600,000 USDC into TIA from Base to Celestia settlement inventory; reference TIA price is $9. Compare four Uniswap/Across/solver/bridge/CEX style routes and select the feasible route with lowest all-in USD cost before converting to output tokens. Hard constraints: settlement <= 22 minutes, oracle age <= 50 seconds, capacity >= notional, and slippage+risk must be included. Route A Uniswap bridge route: percent cost 0.44%, fixed $3,600, expected risk 0.05% of notional, settlement 20 minutes, oracle age 41 seconds, capacity $5,000,000; Route B solver inventory route: percent cost 0.27%, fixed $4,800, expected risk 0.03% of notional, settlement 13 minutes, oracle age 29 seconds, capacity $4,000,000; Route C CEX internal hedge: percent cost 0.21%, fixed $7,300, expected risk 0.04% of notional, settlement 18 minutes, oracle age 36 seconds, capacity $3,800,000; Route D direct bridge with DEX out: percent cost 0.18%, fixed $2,400, expected risk 0.2% of notional, settlement 16 minutes, oracle age 52 seconds, capacity $4,200,000. Compute each route cost = percent cost*notional + fixed + expected risk*notional. expected_value is USD saved by the best feasible route versus the second-best feasible route; also mention resulting extra TIA = USD_saved / price.",
    "rubric_id": "l9-L9-070",
    "expected_values": {
      "intent": "cross_chain_intent_execution",
      "order_type": "route_cost_selection",
      "asset": "TIA",
      "size": 3600000,
      "venue": "dex+bridge+solver+cex"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-071",
    "level": 9,
    "prompt": "Collateral leverage liquidation control, oracle-token top-up after bridge haircut. A Morpho oracle-wrapped LINK vault position uses 18,000 LINK collateral at $18 and $145,000 USDC debt, with Aave/Compound oracle cross-check and a bridge top-up wallet. Liquidation threshold is 62%. Stress branch: LINK falls 22%; maintain target health factor >= 1.4. Instead of repaying debt, compute the minimum extra LINK collateral to bridge in after the shock. Closing loops adds $2,500 fees to debt before the top-up. The bridged collateral is valued at the shocked oracle price and receives a 1.2% bridge/wrapper haircut before counting toward collateral. Top-up capacity is 6,000 LINK; if the required top-up exceeds capacity, return no_action. Formula: required_collateral_value = (debt + fees) * target_HF / LT; shortfall = max(0, required_collateral_value - current_collateral * shocked_price); expected_value = shortfall / (shocked_price * (1 - haircut)). Reject debt-increase actions.",
    "rubric_id": "l9-L9-071",
    "expected_values": {
      "intent": "liquidation_control",
      "order_type": "collateral_top_up",
      "asset": "LINK",
      "size": 18000,
      "venue": "lending_protocol+oracle+bridge"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-072",
    "level": 9,
    "prompt": "Staking/restaking risk selection, capacity-constrained cbETH restake after operator migration. Restake 200 cbETH across EigenLayer/Symbiotic-style AVSs and pick exactly 3 eligible AVSs by highest risk-adjusted APR. Net score = headline yield - operator fee - slashing multiplier * expected slashing loss, all in APR percentage points. Eligibility constraints: net score >= 6%, slashing multiplier <= 3.2, withdrawal delay <= 8 days, oracle freshness <= 22 minutes, and capacity >= 200 cbETH. Data: N1 yield 8.6%, operator fee 0.5%, slashing 1.5 x 0.7%, delay 5 days, oracle age 10 minutes, capacity 240 cbETH; N2 yield 12.8%, operator fee 1%, slashing 3 x 1%, delay 8 days, oracle age 21 minutes, capacity 300 cbETH; N3 yield 10.4%, operator fee 0.6%, slashing 2.1 x 0.8%, delay 6 days, oracle age 18 minutes, capacity 230 cbETH; N4 yield 9.1%, operator fee 0.4%, slashing 1.2 x 0.6%, delay 4 days, oracle age 9 minutes, capacity 180 cbETH; N5 yield 14.2%, operator fee 1.1%, slashing 3.6 x 1.2%, delay 7 days, oracle age 20 minutes, capacity 420 cbETH; N6 yield 7.4%, operator fee 0.2%, slashing 0.8 x 0.5%, delay 9 days, oracle age 8 minutes, capacity 220 cbETH. Return only the unordered set of selected AVS IDs; do not allocate weights, and reject any AVS that fails a hard constraint even if its yield is high.",
    "rubric_id": "l9-L9-072",
    "expected_values": {
      "intent": "restaking_optimization",
      "order_type": "risk_adjusted_selection",
      "asset": "cbETH",
      "size": 200,
      "venue": "staking+oracle"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-073",
    "level": 9,
    "prompt": "Flash-loan exploit EV triage, competing liquidation and auction bundles. Compare two mutually exclusive white-hat flash-loan bundles and execute only the one with higher positive EV; return no_action if neither bundle has positive EV or a hard constraint fails. Shared hard constraints: oracle age <= 42 seconds and liquidation liquidity >= $900,000; current oracle age is 33 seconds and liquidation liquidity is $1,150,000. Bundle A oracle-liquidation path uses a $9,500,000 USDC loan with 0.07% flash fee, gross liquidation edge $760,000, success costs gas $62,000, slippage $95,000, MEV $70,000, success probability 58%, and failure loss equal to loan fee + gas + protection $50,000. Bundle B backrun-auction path uses a $6,000,000 USDC loan with 0.05% flash fee, gross auction edge $480,000, success costs gas $45,000, slippage $50,000, MEV $55,000, insurance premium $20,000, success probability 66%, and failure loss equal to loan fee + gas + protection $35,000. Compute each bundle EV = p_success * success_net - (1 - p_success) * failure_loss. expected_value is the higher feasible bundle EV in USD.",
    "rubric_id": "l9-L9-073",
    "expected_values": {
      "intent": "flash_loan_attack_eval",
      "order_type": "bundle_ev_selection",
      "asset": "USDC",
      "size": 9500000,
      "venue": "defi+mev+auction"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-074",
    "level": 9,
    "prompt": "Fee APR annualization, regime-weighted RFQ maker fee APR. A RFQ maker vault for HYPE/USDC has $9,200,000 active liquidity and charges an incremental fee only when solver-flow is internalized. Use a probability-weighted daily regime model rather than a single-volume day: normal regime probability 65%, volume $8,000,000, eligible share 70%, incremental fee 0.055%; stress regime probability 25%, volume $18,000,000, eligible share 55%, incremental fee 0.075%; outage regime probability 10% with zero eligible volume but fixed overhead still paid. LP capture is 84%, protocol skim is 10%, and keeper/quote-refresh overhead is $550 per calendar day. expected_value must be the probability-weighted incremental simple APR percentage: ((weighted eligible fee revenue * capture * (1 - skim) - daily overhead) * 365) / active liquidity. Verify the probabilities sum to 100%, exclude base pool fees, rewards, compounding, inventory PnL, and mark-to-market drift.",
    "rubric_id": "l9-L9-074",
    "expected_values": {
      "intent": "fee_apr_annualization",
      "order_type": "regime_weighted_fee_apr",
      "asset": "HYPE/USDC",
      "size": 9200000,
      "venue": "rfq+lp"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-075",
    "level": 9,
    "prompt": "Governance incentive capital action, L2 liquidity-mining extension vote. A DAO vote spans Compound/Aave-style lending, Base and Arbitrum bridge snapshots, CEX liquidity, delegation, and incentive routing. Proposal benefit if passed is $950,000, but probability of passage after incentives is 68%. Quorum/control target is 3,500,000 UNI votes; treasury already controls 1,900,000 UNI. Missing votes are rented with bribes at $0.11 per UNI vote and financed by borrowing the same UNI exposure at $9.4 spot with 18% APR for 4 days. Bridge, gas, delegation, vote-market, and solver costs are $19,000. There is a 5% chance of an adverse governance delay costing $420,000. Execute only if net expected USD profit is positive and missing votes <= on-chain lendable liquidity; lendable liquidity is 2,100,000 UNI. Compute expected_value = pass probability*benefit - bribe cost - borrow interest - fixed costs - expected delay loss. Also state missing votes and reject no_action if EV is positive.",
    "rubric_id": "l9-L9-075",
    "expected_values": {
      "intent": "governance_incentive_action",
      "order_type": "borrow_bribe_vote",
      "asset": "UNI",
      "size": 3500000,
      "venue": "governance+lending+bridge"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-076",
    "level": 9,
    "prompt": "Refuse-to-trade decision, BTC collateral seizure during custody withdrawal delay. Evaluate a $1,600,000 BTC opportunity across Uniswap/Aave/Compound, CEX hedge, bridge, oracle, solver, and MEV routes. Execute only if an option has net expected USD profit > 0 and all hard constraints pass: max slippage 0.25%, oracle age <= 40 seconds, settlement <= 12 minutes, and required capital <= $1,600,000. Option A CEX hedge then bridge: gross edge $42,000, fixed costs $12,000, slippage 0.27% of notional, expected risk 5% * $500,000, oracle age 34 seconds, settlement 10 minutes, required capital $1,550,000; Option B custody RFQ unwind: gross edge $55,000, fixed costs $18,000, slippage 0.16% of notional, expected risk 8% * $460,000, oracle age 32 seconds, settlement 15 minutes, required capital $1,500,000; Option C Uniswap WBTC seize route: gross edge $33,000, fixed costs $8,800, slippage 0.21% of notional, expected risk 6% * $300,000, oracle age 45 seconds, settlement 11 minutes, required capital $1,580,000; Option D solver auction route: gross edge $22,000, fixed costs $7,600, slippage 0.12% of notional, expected risk 7% * $260,000, oracle age 36 seconds, settlement 9 minutes, required capital $1,400,000. For each option, net EV = gross edge - fixed costs - slippage dollars - expected risk loss. Reject hard-constraint violations even if net EV is positive. Return no_action if no option is both positive-EV and feasible, and report top-level expected_value = 0 only when abstaining.",
    "rubric_id": "l9-L9-076",
    "expected_values": {
      "intent": "no_action",
      "order_type": "refuse_trade",
      "asset": "BTC",
      "size": 1600000,
      "venue": "dex+cex+bridge"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-077",
    "level": 9,
    "prompt": "Carry-basis funding arbitrage, short-lived oracle-news funding spike. On 2026-06-12 compare execute vs no-action for a delta-neutral LINK trade using Chainlink spot on Base vs Deribit LINK-PERP short, with USDC collateral staged on Base and the hedge unwind through Arbitrum. Capital $500,000, trade notional $1,400,000, horizon 2.25 days. The perp/futures leg is richer than spot by 0.26%; positive funding means the short derivative receives 0.071% per 8 hours. All entry/exit fees, bridge tolls, solver fees, gas, and slippage consume 0.29% of notional plus $620 fixed. Borrow drag is 15% APR for the horizon and the liquidation-buffer reserve is $2,100. Execute only if net annualized return on equity is > 25%, realized slippage stays <= 0.34%, and the bridge window is <= 12 hours; observed bridge window is 9 hours. Compute expected_value as annualized APR percentage for the best feasible action: (basis capture + funding - percent costs - fixed costs - borrow drag - buffer reserve) / capital * 365 / days.",
    "rubric_id": "l9-L9-077",
    "expected_values": {
      "intent": "funding_rate_arbitrage",
      "order_type": "hedged_derivative_vs_spot",
      "asset": "LINK",
      "size": 1400000,
      "venue": "cex+dex_cross"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-078",
    "level": 9,
    "prompt": "Cross-chain route cost selection, Avalanche route where direct bridge misses the time cap. Swap $1,250,000 USDC into AVAX from Arbitrum to Avalanche; reference AVAX price is $42. Compare four Uniswap/Across/solver/bridge/CEX style routes and select the feasible route with lowest all-in USD cost before converting to output tokens. Hard constraints: settlement <= 15 minutes, oracle age <= 45 seconds, capacity >= notional, and slippage+risk must be included. Route A DEX hop bridge route: percent cost 0.58%, fixed $900, expected risk 0.02% of notional, settlement 14 minutes, oracle age 39 seconds, capacity $2,000,000; Route B solver inventory route: percent cost 0.33%, fixed $1,900, expected risk 0.03% of notional, settlement 8 minutes, oracle age 28 seconds, capacity $1,500,000; Route C CEX withdrawal hedge: percent cost 0.22%, fixed $4,200, expected risk 0.06% of notional, settlement 13 minutes, oracle age 31 seconds, capacity $1,300,000; Route D direct bridge route: percent cost 0.19%, fixed $1,300, expected risk 0.15% of notional, settlement 18 minutes, oracle age 34 seconds, capacity $1,600,000. Compute each route cost = percent cost*notional + fixed + expected risk*notional. expected_value is USD saved by the best feasible route versus the second-best feasible route; also mention resulting extra AVAX = USD_saved / price.",
    "rubric_id": "l9-L9-078",
    "expected_values": {
      "intent": "cross_chain_intent_execution",
      "order_type": "route_cost_selection",
      "asset": "AVAX",
      "size": 1250000,
      "venue": "dex+bridge+solver+cex"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-079",
    "level": 9,
    "prompt": "Collateral leverage liquidation control, large ETH loop reset via collateral sale. A Spark recursive ETH vault position on Base/ETH uses 900 ETH collateral at $3,600 and $2,050,000 USDC debt, with Aave/Compound oracle cross-check and a solver sale path available. Liquidation threshold is 79%. Stress branch: if ETH falls 11%, maintain target health factor >= 1.3; if the post-shock HF is below target, sell the minimum amount of ETH collateral into USDC and use all sale proceeds to repay debt. Closing loops adds $6,400 gas/solver fees to debt before repay, and the collateral sale receives stressed price * (1 - 0.35% slippage). Selling collateral reduces both debt and remaining collateral, so solve the feedback equation: debt + fees - x * stressed_price * (1 - slippage) <= (remaining_collateral_after_selling_x * stressed_price * LT) / target_HF. Compute expected_value as the minimum ETH units to sell; reject add-collateral and borrow-more actions.",
    "rubric_id": "l9-L9-079",
    "expected_values": {
      "intent": "liquidation_control",
      "order_type": "collateral_sale_debt_reduction",
      "asset": "ETH",
      "size": 900,
      "venue": "lending_protocol+oracle+solver"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-080",
    "level": 9,
    "prompt": "Staking/restaking risk selection, fast-withdrawal wstETH AVS rotation. Restake 90 wstETH across EigenLayer/Symbiotic-style AVSs and pick exactly 3 eligible AVSs by highest risk-adjusted APR. Net score = headline yield - operator fee - slashing multiplier * expected slashing loss, all in APR percentage points. Eligibility constraints: net score >= 5.6%, slashing multiplier <= 2.7, withdrawal delay <= 6 days, oracle freshness <= 18 minutes, and capacity >= 90 wstETH. Data: V1 yield 7.3%, operator fee 0.3%, slashing 1.1 x 0.5%, delay 3 days, oracle age 9 minutes, capacity 110 wstETH; V2 yield 9.8%, operator fee 0.7%, slashing 2.4 x 0.8%, delay 6 days, oracle age 15 minutes, capacity 130 wstETH; V3 yield 8.9%, operator fee 0.5%, slashing 1.8 x 0.7%, delay 5 days, oracle age 12 minutes, capacity 100 wstETH; V4 yield 11.6%, operator fee 0.9%, slashing 2.9 x 1%, delay 4 days, oracle age 10 minutes, capacity 160 wstETH; V5 yield 6.6%, operator fee 0.2%, slashing 0.7 x 0.4%, delay 2 days, oracle age 8 minutes, capacity 80 wstETH; V6 yield 8.1%, operator fee 0.4%, slashing 1.5 x 0.6%, delay 4 days, oracle age 20 minutes, capacity 120 wstETH. Return only the unordered set of selected AVS IDs; do not allocate weights, and reject any AVS that fails a hard constraint even if its yield is high.",
    "rubric_id": "l9-L9-080",
    "expected_values": {
      "intent": "restaking_optimization",
      "order_type": "risk_adjusted_selection",
      "asset": "wstETH",
      "size": 90,
      "venue": "staking+oracle"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L9-081",
    "level": 9,
    "prompt": "Flash-loan exploit EV triage, three-outcome protocol rescue auction. A white-hat rescue bundle uses a $24,000,000 USDC flash loan through Uniswap/Aave to atomically move a stale-oracle liquidation into a protocol-safe auction. Flash loan fee is 0.05% of loan. There are three mutually exclusive outcomes: Success (54%) earns a protocol bounty and liquidation margin of $1,900,000 and pays loan fee, gas $130,000, slippage $170,000, MEV payment $155,000, and hedge unwind $65,000; partial-landed failure (18%) earns no bounty and loses loan fee + gas + hedge loss $240,000 + oracle-update cost $60,000; full revert/fail (28%) earns no bounty and loses gas + protection spend $180,000 only. Hard constraints: oracle age <= 38 seconds, liquidation liquidity >= $2,200,000, the three probabilities must sum to 100%, and expected EV must be > 0 to execute. Current oracle age 29 seconds and liquidation liquidity $3,100,000. Compute expected_value as the three-outcome probability-weighted USD EV; abstain only if EV <= 0 or a hard constraint fails.",
    "rubric_id": "l9-L9-081",
    "expected_values": {
      "intent": "flash_loan_attack_eval",
      "order_type": "three_outcome_rescue_ev",
      "asset": "USDC",
      "size": 24000000,
      "venue": "defi+mev+auction"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-001",
    "level": 10,
    "prompt": "You manage a $10,000,000 USDC portfolio and must design an optimal 30-day yield strategy across four DeFi protocols:\n\n1. Aave: 4.5% base APR; 60% chance stays flat, 20% chance rises to 8%, 20% chance falls to 2%.\n2. Curve 3pool: 6% APR; 1% chance of Frax depeg causing -20% loss.\n3. GMX GLP: 18% APR but 40% ETH + 30% BTC exposure; hedge cost = 12% APR (net 6%).\n4. Ethena USDe: 12% yield; 5% chance of protocol shutdown (-100% loss).\n\nConstraints:\n- At most 30% allocation per protocol.\n- For this scenario, only Aave and Curve count as liquid within 24 hours; GMX and Ethena do not.\n- At least 50% capital liquid within 24 hours.\n- Target pre-tail-loss nominal APR above 7%.\n- Downside (expected loss) below 2%.\n- Report risk-adjusted annualized yield by subtracting the stated 30-day catastrophic-loss probability times loss severity from each protocol's APR as percentage points, without annualizing those tail losses. Treat Aave's scenario-weighted APR as 60% * 4.5% + 20% * 8% + 20% * 2%.\n\nCompute the optimal allocation and resulting expected annualized yield.",
    "rubric_id": "l10-L10-001",
    "expected_values": {
      "intent": "yield_optimization",
      "asset": "USDC",
      "order_type": "risk_adjusted_portfolio",
      "size": 10000000,
      "venue": "defi_multi_protocol",
      "expected_value": 5.9,
      "unit": "APR_percentage"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-002",
    "level": 10,
    "prompt": "You manage $50,000,000 in DeFi positions. At 14:23 UTC the Chainlink BTC/USD oracle reads $61,240 while Binance spot is $58,100 (a +5.4% oracle deviation).\n\nExposure:\n- $20,000,000 leveraged long BTC on Compound, 75% LTV, liquidation at -8%.\n- $15,000,000 in BTC/ETH LP on Uniswap.\n- $15,000,000 stables.\n\nOracle deviation is rising 0.3% per minute; correction requires 7/11 nodes (about 43 minutes remaining). You have roughly 8 minutes before liquidation risk spikes.\n\nTask: Devise an optimal 8-minute response plan to prevent liquidation and compute the expected loss avoided in USD. For the loss calculation, use only the current 5.4% oracle deviation, not the projected 0.3%/minute increase. Treat the $20,000,000 Compound position and the $15,000,000 BTC/ETH LP as fully oracle-sensitive non-stable exposure, exclude stables, and ignore liquidation penalties, hedge costs, slippage, gas, and probability haircuts. Expected loss avoided = current deviation * oracle-sensitive exposure protected.",
    "rubric_id": "l10-L10-002",
    "expected_values": {
      "intent": "oracle_anomaly_defense",
      "asset": "BTC",
      "order_type": "liquidation_prevention",
      "size": 50000000,
      "venue": "defi_lending",
      "expected_value": 1870000,
      "unit": "USD_loss_avoided"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-003",
    "level": 10,
    "prompt": "Execute a $10,000,000 trade touching blacklisted Ethereum addresses within 48 hours while OFAC-compliant validators control 55% of blocks.\n\nExecution options:\n- Flashbots private relay: 90% success, 0.15% fee, sub-one-block latency.\n- CowSwap batch auction: 75% success, 0.25% fee, about 15-minute latency.\n- Bridge to an L2: 95% success, 0.35% fee, but 7-day delay (not feasible).\n- Railgun privacy route: 99% success, 0.80% fee, roughly 2-minute latency but higher regulatory risk.\n\nConstraints: Trade must complete within 48 hours, target success of at least 97%, minimize expected cost percentage, remain non-custodial and on-chain. A routing plan may use sequential independent attempts: try the first route, and only if it fails, try the backup route. The L2 bridge is infeasible because of its 7-day delay. For the reported cost, count route fees when an attempt is submitted, including failed attempts, and do not normalize by conditional success.\n\nDesign a minimal-cost routing plan that meets the success target and report the success-weighted cost percentage.",
    "rubric_id": "l10-L10-003",
    "expected_values": {
      "intent": "censorship_resistance",
      "primary_route": "flashbots_private",
      "secondary_route": "cowswap_backup",
      "expected_value": 0.17,
      "unit": "percentage_cost"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-004",
    "level": 10,
    "prompt": "You market-make ETH-PERP on Hyperliquid with $2,000,000 capital. An OKX wash-trading spike pushes the median oracle up by $22.5, implying an unhedged loss of $180,000.\n\nOptions:\n1. Pull liquidity (-$8,000): prevents new fills but does not neutralize the existing oracle-skewed inventory exposure.\n2. Hedge on a CEX (-$12,000 slippage): immediately neutralizes the existing inventory exposure.\n3. Analyze trade (too slow; exceeds 5 seconds).\n4. Trust oracle (-$180,000).\n\nDecide the optimal action within 5 seconds and report the expected cost.",
    "rubric_id": "l10-L10-004",
    "expected_values": {
      "intent": "oracle_manipulation_defense",
      "asset": "ETH",
      "order_type": "hedge_decision",
      "size": 2000000,
      "venue": "cex_vs_dex",
      "expected_value": 12000,
      "unit": "USD_cost"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-005",
    "level": 10,
    "prompt": "Sell 500,000 ALT at $8.20 within 24 hours across venues:\n- Binance: 0.8% fee with $50,000 depth.\n- OKX: 1.2% fee with $30,000 depth.\n- Uniswap: 2.0% impact with $120,000 depth.\n- MEXC: 1.5% fee with $80,000 depth.\n\nHoldings: 300,000 ALT already on Binance, 200,000 on Ethereum (bridge cost 0.1% plus $50 gas). Price likely pumps 40% tomorrow due to unreleased news.\n\nExecution convention: venue depth is reusable per TWAP slice over the 24-hour window, but inventory can only be sold where it already sits unless explicitly bridged. For this scenario, the Ethereum ALT cannot be deposited to CEX venues within 24 hours, so sell the 300,000 ALT already on Binance through Binance TWAP slices and sell the 200,000 ALT already on Ethereum through Uniswap. Do not use OKX or MEXC unless Binance inventory exceeds Binance's executable inventory. Treat Uniswap's 2.0% impact as the all-in execution haircut for the Ethereum sale.\n\nDesign a TWAP execution that minimizes slippage under those settlement constraints, finishes before the pump, and report expected proceeds.",
    "rubric_id": "l10-L10-005",
    "expected_values": {
      "intent": "execution_strategy",
      "asset": "ALT",
      "order_type": "multi_venue_twap",
      "size": 500000,
      "venue": "cex_dex_mix",
      "expected_value": 3960000,
      "unit": "USD_proceeds"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-006",
    "level": 10,
    "prompt": "You control 5,000,000 veCRV (about $5,000,000). Curve may cut veCRV voting power by 50% in eight weeks, implying a 30% veCRV price drop and a 40% CVX pump. For this scenario, the governance cut has a 60% probability; if it fails, veCRV and CVX prices are unchanged. \"Convert to CVX ahead of the vote\" means convert the full position at time zero before any weekly bribes accrue, and it forfeits all veCRV bribes after conversion. Convex remains veCRV-linked exposure, does not receive the CVX price pump, and its \"16% APR plus bribes\" is modeled as a total 16% APR reward rate for this comparison. Ignore trading costs and taxes.\n\nOptions:\n1. Stay with Votium at 22% APR bribes (compounding weekly).\n2. Lock through Convex for 16% APR plus bribes but lose direct control.\n3. Convert to CVX ahead of the vote.\n\nPlan a 12-week strategy that maximizes expected USD profit including bribes and probability-weighted token moves.",
    "rubric_id": "l10-L10-006",
    "expected_values": {
      "intent": "governance_arbitrage",
      "asset": "veCRV",
      "order_type": "token_rotation",
      "size": 5000000,
      "venue": "votium_convex",
      "expected_value": 1200000,
      "unit": "USD_profit"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-007",
    "level": 10,
    "prompt": "USDC on Polygon trades at $0.983 while Ethereum mainnet is $1.00. Bridges and characteristics:\n- Circle: 4-hour settlement, safest path.\n- Stargate: 90 minutes, 99.5% success.\n- Hop: 45 minutes, 99.8% success.\n- Multichain: 30 minutes, 98% success.\n\nTrade size is $2,000,000 of USD capital deployed to buy discounted Polygon USDC. The executable spread decays during bridge settlement, so remaining spread after t minutes is 1.7% * 2^(-t/120). Bridge failure means 100% principal loss for the failed allocation. Bridge capacity limits for this trade are: Hop maximum 10% of notional, Stargate maximum 90%, Circle unlimited, and Multichain unlimited. Allocate first to the highest positive expected-value bridge up to its capacity, then the next-highest positive expected-value bridge; do not allocate to a bridge with negative principal-risk EV. Model expected profit after decay and bridge risk, choose bridge allocations, and report expected profit.",
    "rubric_id": "l10-L10-007",
    "expected_values": {
      "intent": "cross_chain_arbitrage",
      "asset": "USDC",
      "order_type": "bridge_allocation",
      "size": 2000000,
      "venue": "multi_bridge",
      "expected_value": 11300,
      "unit": "USD_profit"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-008",
    "level": 10,
    "prompt": "A DAO treasury holds $50,000,000 (80% GOV token, 10% stables, remainder ETH and LP positions). SEC rules require GOV exposure under 40% and stables above 50%.\n\nStats:\n- GOV daily volume $8,000,000 with 20% price impact at $4,000,000 per day.\n- LP exit takes seven days with 2% impermanent loss.\n- Deadline is 14 days plus a seven-day governance delay.\n- For this scenario, the seven-day governance delay happens first and leaves exactly 14 execution days for GOV sales. The full $5,000,000 remainder is LP exposure that must be exited into stables and takes the 2% impermanent-loss hit.\n- Every GOV sale is a conversion into stables: net sale proceeds after the stated execution slippage are added to the stable balance; no sale proceeds leave the treasury or are held in another asset.\n- Model GOV price impact as execution slippage only on the GOV sold, not as a mark-to-market discount on remaining GOV. Daily impact percentage = 20% * (daily GOV sold / $4,000,000). Spread GOV sales evenly across the 14 execution days and sell the minimum GOV amount needed so final GOV exposure is below 40% of final treasury value while stables exceed 50%. For the numeric answer, solve the equality boundary for the strict \"under 40%\" constraint and report the limiting final value, noting that an infinitesimally larger sale satisfies the strict inequality without changing the rounded result.\n\nCompute an optimal sell schedule and final treasury value after meeting the mandate.",
    "rubric_id": "l10-L10-008",
    "expected_values": {
      "intent": "treasury_rebalance",
      "asset": "GOV",
      "order_type": "portfolio_restructuring",
      "size": 50000000,
      "venue": "dao_treasury",
      "expected_value": 48400000,
      "unit": "USD_final_value"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-009",
    "level": 10,
    "prompt": "As an Ethereum block builder (slot 8,234,567) you observe these MEV opportunities:\n- Sandwich: $800,000 value, 18M gas, 95% success, ethical concerns.\n- Liquidation: $300,000 value, 5M gas, 90% success.\n- NFT backrun: $150,000 value, 1M gas, 80% success.\n- Frontrun: $120,000 value, 3M gas, 99% success, unethical.\n- CEX-DEX arbitrage: $500,000 value, 6M gas, 85% success.\n\nGas limit is 30M. For this scenario, \"ethical\" excludes only the opportunity explicitly labeled unethical; the sandwich's ethical concerns are treated as resolved by consented/limited orderflow and it may be included. Builder profit is expected opportunity value * success probability * 10% builder keep after the 90% proposer share, minus a fixed $12,000 gas/inclusion cost for a full 30M-gas bundle. Use the gas limit as a hard knapsack constraint.\n\nSelect an ethical bundle that maximizes profit after the proposer share and fixed gas/inclusion cost.",
    "rubric_id": "l10-L10-009",
    "expected_values": {
      "intent": "mev_bundle_optimization",
      "asset": "ETH",
      "order_type": "builder_bundle",
      "size": 30000000,
      "venue": "block_builder",
      "expected_value": 145500,
      "unit": "USD_builder_profit"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-010",
    "level": 10,
    "prompt": "Predict Ethereum gas prices one hour ahead to minimize cost for 10 transactions (200,000 gas each, ETH at $3,000). Current gas is 25 base plus 2 priority (27 gwei).\n\nEvents:\n- US market open: +80% gas with 5% probability, magnitude above 200%.\n- NFT mint: +120% gas with 0.6 probability, 0.4 chance of delay.\n- Maintenance window at 16:00: -30% gas with 0.6 probability, 0.4 chance of cancellation.\n- Bot wars: +40% gas.\n\nExecution options:\n- Low scenario at 25 gwei (100% fill).\n- Medium scenario at 71 gwei (60% fill).\n- High scenario leaves orders unfilled.\n- For this scenario, execute all 10 transactions only in the Low scenario. Treat the current 27 gwei line as market context, not the execution gas price. Treat the event bullets as context already summarized by the Low/Medium/High execution options; do not recombine them into a separate forecast. Medium and High are infeasible because the task requires all 10 transactions to execute.\n\nDesign an execution schedule minimizing expected USD spend and report the expected cost.",
    "rubric_id": "l10-L10-010",
    "expected_values": {
      "intent": "gas_forecasting",
      "asset": "ETH",
      "order_type": "execution_timing",
      "size": 2000000,
      "venue": "mainnet",
      "expected_value": 149,
      "unit": "USD_cost"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-011",
    "level": 10,
    "prompt": "Bitcoin halving occurs in 14 days (block 840,000). You manage $5,000,000 across spot, CME futures, perpetuals, and options. Hashrate stands at 600 EH/s, difficulty is +8.2%, and miners expect to sell 400-600 BTC per day post-halving. Derivatives quote: futures $63,200 (+1.9%), perpetual funding 14.2% APR, options implied volatility 65%.\n\nUse this required risk-balanced allocation and deterministic 45-day return model: 40% spot BTC with a +35% halving-cycle base case, 25% CME basis trade earning the +1.9% basis convergence, 20% perpetual funding leg earning 14.2% APR prorated over 45 days, and 15% options convexity leg earning +70% net after premium. For this scenario, realized volatility is assumed to exceed the 65% implied volatility, so the +70% options payoff is active, not conditional. The options leg includes a put spread that caps total portfolio drawdown below 15% in the stress case; ignore additional fees and financing.\n\nDesign a multi-leg strategy that profits from the halving while capping drawdown below 15% over a 45-day horizon.",
    "rubric_id": "l10-L10-011",
    "expected_values": {
      "intent": "multi_leg_strategy",
      "asset": "BTC",
      "order_type": "halving_arbitrage",
      "size": 5000000,
      "venue": "multi_market",
      "expected_value": 25,
      "unit": "percent_return"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-012",
    "level": 10,
    "prompt": "Operate a Lightning routing node managing $2,000,000 BTC. Current state: 32 BTC across 47 channels, 87% payment success, 0.15% fee rate, $18,000,000 monthly volume, and 13% failures due to inbound imbalance.\n\nObjectives:\n- Reach 95% success rate.\n- Double monthly revenue.\n- Spend no more than $5,000 on-chain.\n- Cap channels at 60.\n\nFor this scenario, the $18,000,000 monthly volume is successful routed volume already earning the 0.15% fee rate, not attempted volume. Higher success and direct institutional channels should be sized so the final successful routed volume is exactly $36,000,000 per month at the same fee rate; rebalancing costs are one-time and excluded from monthly revenue.\n\nHigher success attracts retry traffic, and direct institutional channels can add flow. Devise a rebalancing and channel strategy meeting the targets and report expected monthly revenue.",
    "rubric_id": "l10-L10-012",
    "expected_values": {
      "intent": "liquidity_routing",
      "asset": "BTC",
      "order_type": "channel_optimization",
      "size": 2000000,
      "venue": "lightning",
      "expected_value": 54000,
      "unit": "USD_monthly_revenue"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-013",
    "level": 10,
    "prompt": "Manage 2,847 UTXOs totaling 156.3 BTC. Consolidate within 90 days while keeping at least 20 BTC liquid and total transaction costs below 0.05 BTC. Use native SegWit inputs at 68 vbytes each, consolidation outputs at 31 vbytes each, and 350 total vbytes of batch overhead. The fee plan has three low-fee windows at 10 sat/vB; ignore higher-fee windows. Preserve liquidity by leaving the largest 20 BTC untouched, and preserve privacy by consolidating the 2,200 smallest UTXOs into 120 equal-sized outputs across the three windows.\n\nSelect which UTXOs to merge, when to execute given fee volatility, and report the expected BTC transaction cost for the specified consolidation plan.",
    "rubric_id": "l10-L10-013",
    "expected_values": {
      "intent": "utxo_optimization",
      "asset": "BTC",
      "order_type": "consolidation_plan",
      "size": 156.3,
      "venue": "bitcoin_mainnet",
      "expected_value": 0.0154,
      "unit": "BTC_cost"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-014",
    "level": 10,
    "prompt": "Identify a cross-chain arbitrage opportunity spanning Ethereum, Arbitrum, Optimism, and Base. The spread exists for only eight minutes before bots eliminate it. Starting capital is 1,000 ETH on Ethereum L1.\n\nReference loop (unprofitable baseline):\n1. Bridge 1,000 ETH to Arbitrum (native bridge, 10 minutes, gas 0.08 ETH).\n2. Swap to USDC at $3,000 on Arbitrum with 0.18% slippage and 0.05% fee.\n3. Bridge USDC to Optimism (0.15% bridge fee).\n4. Swap USDC back to ETH at $2,995 on Optimism with 0.22% slippage and 0.08% fee.\n5. Bridge ETH back to Ethereum (seven-day finality, gas 0.05 ETH).\n\nThis path yields 995.15 ETH (-4.85 ETH). Assume access to flash loans (9 bps), omnichain messaging (Across, LayerZero, Chainflip, Hop), and MEV protection with an eight-minute execution window.\n\nProfitable route constants for the solvable strategy: use a Chainflip/Across intent that atomically borrows 1,000 ETH on Ethereum, sells ETH into the Base pool at an effective $3,043.20/ETH, sources replacement ETH through Arbitrum and Optimism liquidity at an effective $3,000/ETH, and settles back to Ethereum inside the eight-minute window. The route has exactly 1,000 ETH of usable depth. Total all-in costs are 0.44% of notional: 0.09% flash-loan fee, 0.15% omnichain messaging/bridge cost, 0.17% aggregate swap slippage and LP fees, and 0.03% MEV protection. Use gross spread = (3,043.20 / 3,000) - 1 and net profit percentage = gross spread - 0.44%; do not invent alternative prices or routes.\n\nDesign a profitable cross-chain strategy that (1) identifies viable arbitrage types, (2) computes breakeven spread versus costs, (3) selects optimal capital sizing and path, (4) mitigates MEV and latency risk, and (5) presents a numerical example with net-positive profit.",
    "rubric_id": "l10-L10-014",
    "expected_values": {
      "intent": "cross_chain_arbitrage",
      "order_type": "flash_loan_arbitrage",
      "asset": "ETH",
      "size": 1000,
      "venue": "multi_chain",
      "spread_required_pct": 0.44,
      "expected_profit_pct": 1,
      "capital_used_eth": 1000,
      "expected_value": 1,
      "unit": "percent_profit"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-015",
    "level": 10,
    "prompt": "Provide $2,000,000 liquidity ($1,000,000 ETH and $1,000,000 USDC) to a Uniswap V3 ETH/USDC pool centered at $3,000 with range $2,700-$3,300 (0.05% fee). After 30 days ETH trades at $3,450 (+15%), fees earned are $90,000, and impermanent loss is about 0.49%.\n\nProject outcomes for ETH at $4,500 (+50%) and $6,000 (+100%) with IL of 4.04% and 5.72%, respectively. For the full scenario table, use IL assumptions of 0.63% at ±25%, 4.04% at ±50%, and 5.72% at +100%; for -100%, assume ETH cannot trade below zero and the LP is fully in ETH with no additional IL haircut beyond the terminal pool value. The observed $90,000 fees apply only to the first 30-day +15% observation and should not be added to the projected scenario table.\n\nUse this prescribed hedge for the objective answer: spend $40,000 (2% of capital) on an asymmetric range shift plus protective overlay. The overlay covers at least 80% of downside impermanent-loss exposure in negative ETH scenarios, but it has $0 payoff in the +50% and +100% upside scenarios. For the reported upside-capture percentage, use the +100% ETH scenario and compute (LP value after subtracting the $40,000 hedge cost and with zero upside hedge payoff - initial $2,000,000) / (HODL value - initial $2,000,000). Compute PnL across ±25%, ±50%, and ±100% price moves.",
    "rubric_id": "l10-L10-015",
    "expected_values": {
      "intent": "impermanent_loss_hedging",
      "order_type": "hedging_strategy",
      "asset": "ETH/USDC",
      "size": 2000000,
      "venue": "uniswap_v3",
      "expected_upside_capture_pct": 75,
      "hedge_cost_pct": 2,
      "expected_value": 78,
      "unit": "upside_capture_percentage"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-016",
    "level": 10,
    "prompt": "Execute a $2,000,000 USDC to SOL swap via Jupiter on Solana. The network lacks a public mempool; 95% of stake uses Jito bundles for MEV extraction. Historical attack rate is 73% for swaps over $500,000 with an average 0.8% slippage loss.\n\nOptions:\n1. Submit a Jito bundle with a high tip ($3,000, 90% success).\n2. Use a private RPC (Triton or Helius) costing $50 with 95% success.\n3. Split into 20 micro-swaps of $100,000 each (adds 0.15% slippage, 80% success).\n4. Hybrid: combine private RPC and splitting.\n\nObjective and cost convention: choose the highest protected-completion probability strategy with total expected cost at or below 0.6%, while also keeping each child order at or below $100,000. Private RPC alone fails the child-order constraint, and splitting alone fails the 90% protected-completion target. For the Hybrid, define success probability as 90% and expected total cost as 0.15% split slippage + $50 / $2,000,000 private RPC cost + 0.3975% residual Jito adverse-selection cost = 0.55% rounded. Do not apply the historical 73% attack rate again after using the prescribed residual-cost term.\n\nDesign an optimal MEV defense strategy with maximum total cost of 0.6% and report expected total cost percentage, success probability, and execution steps.",
    "rubric_id": "l10-L10-016",
    "expected_values": {
      "intent": "mev_defense_strategy",
      "order_type": "execution_plan",
      "asset": "SOL",
      "size": 2000000,
      "venue": "solana_mainnet",
      "expected_total_cost_pct": 0.55,
      "success_probability_pct": 90,
      "expected_value": 0.55,
      "unit": "total_cost_percentage"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-017",
    "level": 10,
    "prompt": "Operate a Solana validator with 500,000 SOL staked at $140 per SOL (~$70,000,000). Current performance is 89% with 8% commission and delegations declining 5% per quarter. Target: restore performance to 95% and reach 15% ROI within six months under a $200,000 budget. For this scenario, ROI means incremental six-month net profit divided by the upgrade spend selected for the plan, not return on the $70,000,000 self-stake principal.\n\nUpgrade options:\n1. Hardware refresh ($50,000) reaching 93-95% performance.\n2. Asia replica ($64,000) for 94-96% performance.\n3. Lower commission from 8% to 6%.\n4. Add Jito MEV (15% earnings boost, $15,000 setup).\n5. Launch premium RPC (adds $180,000 revenue, $150,000 year-one cost).\n\nEconomic constants for the six-month ROI calculation: the hardware refresh plus Jito setup is the targetable $65,000 package; restoring performance from 89% to 95% adds $6,750 of six-month net profit, and Jito adds $3,000 of six-month net MEV profit after setup effects. The Asia replica is a redundancy alternative, not additive with the hardware refresh for this target. Lowering commission stabilizes delegation but has no direct six-month incremental-profit credit in this ROI calculation. Premium RPC is evaluated on year-one economics and is not part of the six-month ROI numerator.\n\nDevise a three-phase plan within budget that hits the targets and stabilizes delegations.",
    "rubric_id": "l10-L10-017",
    "expected_values": {
      "intent": "validator_economics",
      "order_type": "infrastructure_plan",
      "asset": "SOL",
      "size": 500000,
      "venue": "solana_validator",
      "projected_performance_pct": 95,
      "projected_roi_pct": 15,
      "year1_cost_usd": 200000,
      "expected_value": 15,
      "unit": "ROI_percentage"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-018",
    "level": 10,
    "prompt": "You manage a $12,000,000 DAI portfolio for a 45-day mandate and must allocate across Morpho, Spark, Pendle, and Convex:\n\n1. Morpho DAI vault: 50% chance of 5.8% APR, 30% chance of 7.2% APR, 20% chance of 4.0% APR.\n2. Spark sDAI: fixed 5.2% APR.\n3. Pendle fixed sUSDe PT: 14.0% nominal APR with a 3% chance of a -15% depeg loss.\n4. Convex crvUSD pool: 9.0% nominal APR with a 2% chance of a -30% pool loss.\n\nConstraints:\n- At most 35% allocation per protocol.\n- Only Morpho and Spark count as liquid within 24 hours.\n- At least 45% of capital must be liquid within 24 hours.\n- Target pre-tail-loss nominal APR above 7.5%.\n- Portfolio expected catastrophic loss must be below 1.2% of capital.\n- Report risk-adjusted annualized yield by subtracting each protocol's stated tail probability times loss severity from that protocol's APR as percentage points, without annualizing tail losses. Treat Morpho's APR as the scenario-weighted average.\n\nCompute the allocation that maximizes risk-adjusted annualized yield while satisfying every constraint, and report the resulting APR percentage.",
    "rubric_id": "l10-L10-018",
    "expected_values": {
      "intent": "yield_optimization",
      "asset": "DAI",
      "order_type": "risk_adjusted_portfolio",
      "size": 12000000,
      "venue": "defi_multi_protocol",
      "expected_value": 8.99,
      "unit": "APR_percentage"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-019",
    "level": 10,
    "prompt": "You manage an $8,000,000 USDT portfolio over 60 days across Maker, Fluid, Pendle, and Ethena:\n\n1. Maker sUSDS: fixed 5.0% APR and liquid within 24 hours.\n2. Fluid USDC/USDT vault: 50% chance of 6.4% APR, 30% chance of 8.5% APR, 20% chance of 3.5% APR, liquid within 24 hours.\n3. Pendle eUSDe fixed-yield position: 16.0% nominal APR with a 4% chance of a -25% loss.\n4. Ethena delta-neutral USDe: 13.0% nominal APR with a 6% chance of a -40% shutdown loss.\n\nConstraints:\n- At most 25% allocation per protocol.\n- At least 50% of capital must be liquid within 24 hours, and only Maker and Fluid count as liquid.\n- Target pre-tail-loss nominal APR above 8.0%.\n- Portfolio expected catastrophic loss must be below 1.5% of capital.\n- Report risk-adjusted annualized yield by subtracting probability times severity from each risky protocol's APR as percentage points, without annualizing tail losses. Treat Fluid's APR as the scenario-weighted average.\n\nCompute the optimal allocation and resulting risk-adjusted APR percentage.",
    "rubric_id": "l10-L10-019",
    "expected_values": {
      "intent": "yield_optimization",
      "asset": "USDT",
      "order_type": "risk_adjusted_portfolio",
      "size": 8000000,
      "venue": "defi_multi_protocol",
      "expected_value": 9.26,
      "unit": "APR_percentage"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-020",
    "level": 10,
    "prompt": "You manage $35,000,000 in DeFi positions. At 09:12 UTC the Chainlink ETH/USD oracle reads $3,328 while Coinbase spot is $3,176, a +4.8% oracle deviation.\n\nExposure:\n- $12,000,000 Lido stETH leverage loop on Aave with liquidation risk if the oracle corrects.\n- $8,000,000 ETH collateralized borrow on Compound, oracle-sensitive.\n- $5,000,000 ETH/USDC LP on Uniswap V3, oracle-sensitive for the hedge trigger.\n- $6,000,000 hedged ETH perps that are already delta-neutral.\n- $4,000,000 stables.\n\nThe deviation is rising 0.2% per minute and the oracle committee is expected to correct in 31 minutes, but liquidation risk spikes in 6 minutes. For the loss calculation, use only the current 4.8% deviation. Treat the Lido loop, Compound borrow, and LP as fully oracle-sensitive exposure; exclude the hedged perps and stables. Ignore liquidation penalties, hedge costs, gas, slippage, and probability haircuts. Expected loss avoided = current deviation * oracle-sensitive exposure protected.\n\nDevise a six-minute defense plan and report the expected USD loss avoided.",
    "rubric_id": "l10-L10-020",
    "expected_values": {
      "intent": "oracle_anomaly_defense",
      "asset": "ETH",
      "order_type": "liquidation_prevention",
      "size": 35000000,
      "venue": "defi_lending",
      "expected_value": 1200000,
      "unit": "USD_loss_avoided"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-021",
    "level": 10,
    "prompt": "You manage $80,000,000 across Solana DeFi. At 18:40 UTC the Pyth SOL/USD oracle reads $181.35 while Coinbase spot is $166.00, a +9.25% stale-oracle deviation.\n\nExposure:\n- $30,000,000 SOL collateralized loop on Kamino.\n- $18,000,000 Drift margin position using the same oracle.\n- $12,000,000 SOL/USDC LP on Orca with oracle-triggered hedging.\n- $20,000,000 USDC reserves.\n\nThe deviation is projected to decay after a guardian update in 22 minutes, but the borrow accounts can be liquidated in about 5 minutes if the stale price abruptly corrects. For the numeric answer, use only the current 9.25% deviation, treat Kamino, Drift, and Orca LP exposure as fully oracle-sensitive, exclude USDC reserves, and ignore fees, slippage, liquidation penalties, and probability haircuts. Expected loss avoided = current deviation * oracle-sensitive exposure protected.\n\nDesign the immediate defense and compute the expected USD loss avoided.",
    "rubric_id": "l10-L10-021",
    "expected_values": {
      "intent": "oracle_anomaly_defense",
      "asset": "SOL",
      "order_type": "liquidation_prevention",
      "size": 80000000,
      "venue": "solana_defi",
      "expected_value": 5550000,
      "unit": "USD_loss_avoided"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-022",
    "level": 10,
    "prompt": "Execute a $15,000,000 on-chain settlement within 24 hours while compliant validators and relay filters are expected to censor 52% of blocks.\n\nExecution options:\n- SUAVE private orderflow: 88% independent success, 0.12% fee, sub-one-block latency.\n- bloXroute private relay: 84% independent success, 0.18% fee, sub-one-block latency.\n- CowSwap batch auction: 78% independent success, 0.28% fee, about 12-minute latency.\n- Shielded rollup route: 99% success, 0.95% fee, two-hour latency.\n- Canonical L2 bridge: 96% success, 0.30% fee, five-day delay, not feasible.\n\nConstraints: complete within 24 hours, target at least 98% success, minimize expected cost percentage, remain non-custodial and on-chain. A plan may use sequential independent attempts, submitting the next route only if the previous one fails. Count a route fee when its attempt is submitted, including failed attempts; do not normalize cost by conditional success. The canonical bridge is infeasible because of delay.\n\nChoose the minimal-cost route sequence meeting the success target and report expected cost percentage.",
    "rubric_id": "l10-L10-022",
    "expected_values": {
      "intent": "censorship_resistance",
      "primary_route": "suave_private_orderflow",
      "secondary_route": "bloxroute_private_relay",
      "expected_value": 0.142,
      "unit": "percentage_cost"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-023",
    "level": 10,
    "prompt": "A DAO must execute a $40,000,000 treasury swap involving filtered addresses within 36 hours. OFAC-compliant validators control 58% of recent Ethereum blocks, and the trade must remain non-custodial.\n\nExecution options:\n- Flashbots Protect: 91% independent success, 0.10% fee, sub-one-block latency.\n- Eden private relay: 87% independent success, 0.12% fee, sub-one-block latency.\n- CowSwap solver auction: 82% independent success, 0.20% fee, about 20-minute latency.\n- Shielded intent network: 99.7% success, 0.75% fee, two-hour latency.\n- Cross-chain bridge route: 96% success, 0.30% fee, five-day delay, not feasible.\n\nConstraints: complete within 36 hours, target at least 99.5% success, minimize expected cost percentage, and remain on-chain/non-custodial. Sequential independent attempts are allowed; submit a backup only after the previous attempt fails. Count each submitted route's fee, including failed attempts, and do not normalize by conditional success. The bridge route is infeasible because of delay.\n\nDesign the minimal-cost route sequence and report expected cost percentage.",
    "rubric_id": "l10-L10-023",
    "expected_values": {
      "intent": "censorship_resistance",
      "primary_route": "flashbots_protect",
      "secondary_route": "eden_private_relay",
      "tertiary_route": "cowswap_solver",
      "expected_value": 0.113,
      "unit": "percentage_cost"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-024",
    "level": 10,
    "prompt": "You market-make AVAX-PERP on dYdX with $3,000,000 capital. A spoofed OKX print pushes the composite AVAX oracle up by $1.80 for several seconds, creating an unhedged inventory loss of $240,000 if you keep the current skewed exposure.\n\nOptions:\n1. Pull liquidity immediately (-$10,000): prevents new fills but does not neutralize the existing oracle-skewed inventory.\n2. Hedge the existing inventory on Binance (-$18,000 slippage): immediately neutralizes the exposure.\n3. Wait for the oracle median to normalize (-$240,000 expected inventory loss).\n4. Request manual oracle review (too slow; exceeds the 5-second decision window).\n\nWithin 5 seconds, choose the deterministic action that minimizes expected cost. Report the expected USD cost, ignoring gas, maker rebates, and any probability adjustment because the manipulation is already observed.",
    "rubric_id": "l10-L10-024",
    "expected_values": {
      "intent": "oracle_manipulation_defense",
      "asset": "AVAX",
      "order_type": "hedge_decision",
      "size": 3000000,
      "venue": "cex_vs_dex",
      "expected_value": 18000,
      "unit": "USD_cost"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-025",
    "level": 10,
    "prompt": "You market-make SOL-PERP on Aevo with $1,500,000 capital. A thin Bybit liquidation print pulls the SOL oracle down by $0.95, and your existing inventory would lose $96,000 if left unhedged during the oracle window.\n\nOptions:\n1. Cancel quotes (-$4,500): prevents new adverse fills but leaves the existing oracle-skewed inventory exposed.\n2. Hedge the existing exposure with inverse perps on OKX (-$7,200 slippage): immediately neutralizes the current inventory.\n3. Wait for the median update (-$96,000 expected loss).\n4. Ask for exchange intervention (too slow; exceeds the 4-second response window).\n\nChoose the optimal action within 4 seconds and report the expected USD cost. Treat the manipulation as already observed and ignore gas, rebates, and probability haircuts.",
    "rubric_id": "l10-L10-025",
    "expected_values": {
      "intent": "oracle_manipulation_defense",
      "asset": "SOL",
      "order_type": "hedge_decision",
      "size": 1500000,
      "venue": "cex_vs_dex",
      "expected_value": 7200,
      "unit": "USD_cost"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-026",
    "level": 10,
    "prompt": "Sell 1,200,000 TOKEN at $3.40 within 18 hours before a scheduled unlock.\n\nVenues:\n- Coinbase: 0.45% fee with $75,000 reusable depth per TWAP slice.\n- Binance: 0.70% fee with $100,000 reusable depth per slice, but TOKEN deposits from Arbitrum will not clear within 18 hours.\n- Camelot on Arbitrum: 1.20% all-in price impact for the full Arbitrum sale.\n- Uniswap on Ethereum: 1.80% all-in price impact but no TOKEN inventory is on Ethereum.\n\nHoldings: 700,000 TOKEN already on Coinbase and 500,000 TOKEN on Arbitrum. Inventory can only be sold where it already sits unless explicitly bridged; for this scenario, bridging Arbitrum TOKEN to CEX venues misses the 18-hour deadline. Sell the 700,000 Coinbase TOKEN through TWAP slices and the 500,000 Arbitrum TOKEN through Camelot. Do not use Binance or Uniswap. Treat Camelot's 1.20% impact and Coinbase's 0.45% fee as all-in execution haircuts, and ignore gas.\n\nDesign the execution schedule and report expected USD proceeds.",
    "rubric_id": "l10-L10-026",
    "expected_values": {
      "intent": "execution_strategy",
      "asset": "TOKEN",
      "order_type": "multi_venue_twap",
      "size": 1200000,
      "venue": "cex_dex_mix",
      "expected_value": 4048890,
      "unit": "USD_proceeds"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-027",
    "level": 10,
    "prompt": "Buy 250,000 RWA at $12.50 within 12 hours before an index inclusion announcement.\n\nVenues:\n- Kraken: 0.60% fee with $80,000 reusable depth per TWAP slice.\n- Coinbase: 0.80% fee with $70,000 reusable depth per slice, but no USDC is available there.\n- Aerodrome on Base: 1.40% all-in price impact for the required Base purchase.\n- Uniswap on Ethereum: 2.10% all-in price impact, but Base USDC cannot be bridged to Ethereum within the deadline.\n\nCapital: $2,000,000 USDC already on Kraken and $1,500,000 USDC on Base. Funds cannot move between venues within 12 hours. Use Kraken to buy as many RWA as its USDC balance permits at the stated price plus fee, then buy the remaining RWA on Base through Aerodrome. Do not use Coinbase or Uniswap. Ignore gas and assume the TWAP depth is reusable over the full window.\n\nCompute the minimum deterministic total USD cost to acquire exactly 250,000 RWA.",
    "rubric_id": "l10-L10-027",
    "expected_values": {
      "intent": "execution_strategy",
      "asset": "RWA",
      "order_type": "multi_venue_twap",
      "size": 250000,
      "venue": "cex_dex_mix",
      "expected_value": 3152845,
      "unit": "USD_cost"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-028",
    "level": 10,
    "prompt": "You control $3,000,000 of veBAL voting power. A governance proposal in 10 weeks may redirect emissions away from veBAL-controlled gauges, causing a 25% veBAL price drop and a 35% AURA price increase if it passes. The proposal has a 55% probability of passing; if it fails, veBAL and AURA prices are unchanged.\n\nOptions for a 14-week strategy:\n1. Stay in veBAL and earn 18% APR bribes, compounded weekly, while retaining full exposure to the possible veBAL price drop.\n2. Wrap through Aura for a total 13% APR reward rate, compounded weekly, while retaining veBAL-linked price exposure and no AURA price pump.\n3. Convert the full position to AURA at time zero before any weekly bribes accrue. This forfeits all veBAL bribes after conversion but receives the probability-weighted AURA price move.\n\nIgnore trading costs, taxes, and slippage. For bribe options, compute rewards as principal * ((1 + APR / 52) ^ 14 - 1). For token moves, use probability-weighted price change on the full $3,000,000 exposure. Choose the strategy maximizing expected USD profit over 14 weeks and report that profit.",
    "rubric_id": "l10-L10-028",
    "expected_values": {
      "intent": "governance_arbitrage",
      "asset": "veBAL",
      "order_type": "token_rotation",
      "size": 3000000,
      "venue": "balancer_aura",
      "expected_value": 577500,
      "unit": "USD_profit"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-029",
    "level": 10,
    "prompt": "You control $6,000,000 of veFXS. A Frax governance vote in 6 weeks may reduce veFXS-directed emissions, causing a 20% veFXS price drop and a 30% pump in a liquid bribe-aggregator token called FXTL if the vote passes. The vote has a 70% probability of passing; if it fails, both token prices are unchanged.\n\nOptions for a 10-week strategy:\n1. Stay in veFXS and earn 24% APR bribes, compounded weekly, while retaining full exposure to the possible veFXS price drop.\n2. Move to a wrapper earning a total 17% APR reward rate, compounded weekly, while retaining veFXS-linked price exposure and no FXTL pump.\n3. Convert the full position to FXTL at time zero before any weekly bribes accrue. This forfeits all veFXS bribes after conversion but receives the probability-weighted FXTL price move.\n\nIgnore trading costs, taxes, and slippage. For bribe options, compute rewards as principal * ((1 + APR / 52) ^ 10 - 1). For token moves, use probability-weighted price change on the full $6,000,000 exposure. Choose the strategy maximizing expected USD profit over 10 weeks and report that profit.",
    "rubric_id": "l10-L10-029",
    "expected_values": {
      "intent": "governance_arbitrage",
      "asset": "veFXS",
      "order_type": "token_rotation",
      "size": 6000000,
      "venue": "frax_governance",
      "expected_value": 1260000,
      "unit": "USD_profit"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-030",
    "level": 10,
    "prompt": "USDT on BNB Chain trades at $0.992 while Ethereum mainnet USDT is redeemable at $1.000. You have $5,000,000 of USD capital to buy discounted BNB Chain USDT and bridge it to Ethereum.\n\nBridge options:\n- Hyperlane: 70-minute settlement, 99.9% success, 0.04% fee, maximum 30% of notional.\n- Stargate: 45-minute settlement, 99.7% success, 0.06% fee, maximum 50% of notional.\n- Celer: 25-minute settlement, 99.4% success, 0.08% fee, maximum 20% of notional.\n- Native exchange withdrawal: 180-minute settlement, 99.99% success, 0.02% fee, unlimited capacity.\n\nThe initial spread is 0.8% and decays during settlement as 0.8% * 2^(-t / 90), where t is settlement minutes. For each bridge, expected value per dollar is success_probability * (remaining_spread - bridge_fee) - failure_probability * 100%, with percentages expressed as percent of principal. Allocate first to the highest positive-EV bridge up to capacity, then the next-highest positive-EV bridge, and do not allocate to negative-EV bridges. Use all capital only if positive-EV capacity remains.\n\nChoose allocations and report total expected USD profit.",
    "rubric_id": "l10-L10-030",
    "expected_values": {
      "intent": "cross_chain_arbitrage",
      "asset": "USDT",
      "order_type": "bridge_allocation",
      "size": 5000000,
      "venue": "multi_bridge",
      "expected_value": 11700,
      "unit": "USD_profit"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-031",
    "level": 10,
    "prompt": "A DAO treasury holds $30,000,000: 70% GOV token, 20% stables, and 10% ETH LP. New policy requires GOV exposure below 35% of final treasury value and stables above 55%.\n\nExecution facts:\n- A governance delay happens first and leaves exactly 10 execution days.\n- The full $3,000,000 ETH LP is exited into stables with a 1.5% impermanent-loss hit before the GOV sale completes.\n- GOV daily liquidity causes execution slippage only on the GOV sold, not on remaining GOV. Daily impact percentage = 12% * (daily GOV sold / $2,000,000).\n- Sell the minimum GOV amount needed so final GOV exposure is below 35% of final treasury value. Spread GOV sales evenly across the 10 days.\n- For the numeric answer, solve the equality boundary for the strict \"below 35%\" constraint and report the limiting final value; an infinitesimally larger sale satisfies the strict inequality without changing the rounded result.\n\nCompute the optimal sell schedule and final treasury value after meeting the mandate.",
    "rubric_id": "l10-L10-031",
    "expected_values": {
      "intent": "treasury_rebalance",
      "asset": "GOV",
      "order_type": "portfolio_restructuring",
      "size": 30000000,
      "venue": "dao_treasury",
      "expected_value": 29260485,
      "unit": "USD_final_value"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-032",
    "level": 10,
    "prompt": "A DAO treasury holds $75,000,000: 65% GOV token, 15% stables, and 20% ETH LP. A compliance mandate requires GOV exposure below 30% of final treasury value and stables above 60%.\n\nExecution facts:\n- A governance delay happens first and leaves exactly 21 execution days.\n- The full $15,000,000 ETH LP is exited into stables with a 3.0% impermanent-loss hit before the GOV sale completes.\n- GOV price impact is execution slippage only on the GOV sold. Daily impact percentage = 15% * (daily GOV sold / $3,000,000).\n- Sell the minimum GOV amount needed so final GOV exposure is below 30% of final treasury value. Spread GOV sales evenly across the 21 execution days.\n- For the numeric answer, solve the equality boundary for the strict \"below 30%\" constraint and report the limiting final value; an infinitesimally larger sale satisfies the strict inequality without changing the rounded result.\n\nCompute the optimal sell schedule and final treasury value after meeting the mandate.",
    "rubric_id": "l10-L10-032",
    "expected_values": {
      "intent": "treasury_rebalance",
      "asset": "GOV",
      "order_type": "portfolio_restructuring",
      "size": 75000000,
      "venue": "dao_treasury",
      "expected_value": 72826871,
      "unit": "USD_final_value"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-033",
    "level": 10,
    "prompt": "As an Ethereum block builder you observe these MEV opportunities for a 28M gas block:\n- Consented sandwich: $900,000 value, 14M gas, 90% success, explicitly permitted orderflow.\n- Oracle backrun: $650,000 value, 8M gas, 80% success.\n- Liquidation: $400,000 value, 6M gas, 92% success.\n- NFT backrun: $180,000 value, 2M gas, 75% success.\n- LST arbitrage: $300,000 value, 5M gas, 85% success.\n- Toxic frontrun: $250,000 value, 4M gas, 99% success, unethical and excluded.\n\nBuilder profit is expected opportunity value * success probability * 12% builder keep after proposer share, minus a fixed $10,000 inclusion and gas cost for the selected bundle. The gas limit is a hard knapsack constraint. The only excluded opportunity is the one explicitly labeled unethical; the consented sandwich is allowed.\n\nSelect the ethical bundle that maximizes builder profit and report USD profit after the fixed cost.",
    "rubric_id": "l10-L10-033",
    "expected_values": {
      "intent": "mev_bundle_optimization",
      "asset": "ETH",
      "order_type": "builder_bundle",
      "size": 28000000,
      "venue": "block_builder",
      "expected_value": 193760,
      "unit": "USD_builder_profit"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-034",
    "level": 10,
    "prompt": "As an Ethereum block builder you observe these MEV opportunities for a 30M gas block:\n- CEX-DEX arbitrage: $700,000 value, 7M gas, 86% success.\n- Liquidation: $520,000 value, 9M gas, 88% success.\n- Oracle update backrun: $260,000 value, 3M gas, 93% success.\n- NFT mint backrun: $210,000 value, 2M gas, 70% success.\n- Intent solver surplus: $480,000 value, 8M gas, 82% success.\n- L2 withdrawal arbitrage: $350,000 value, 6M gas, 78% success.\n- Toxic frontrun: $190,000 value, 4M gas, 99% success, unethical and excluded.\n\nBuilder profit is expected opportunity value * success probability * 8% builder keep after proposer share, minus a fixed $9,000 inclusion and gas cost for the selected bundle. The gas limit is a hard knapsack constraint. Exclude only the opportunity explicitly labeled unethical.\n\nSelect the ethical bundle that maximizes builder profit and report USD profit after the fixed cost.",
    "rubric_id": "l10-L10-034",
    "expected_values": {
      "intent": "mev_bundle_optimization",
      "asset": "ETH",
      "order_type": "builder_bundle",
      "size": 30000000,
      "venue": "block_builder",
      "expected_value": 138360,
      "unit": "USD_builder_profit"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-035",
    "level": 10,
    "prompt": "Predict Ethereum gas costs one hour ahead for 15 transactions, each using 250,000 gas, with ETH at $3,200. Current gas is 34 base plus 2 priority gwei.\n\nEvent context:\n- NFT claim wave may push gas higher.\n- A validator maintenance window may reduce gas.\n- A bot auction may briefly congest the next few blocks.\n\nExecution options already summarize those events:\n- Low scenario at 18 gwei, 100% fill for all 15 transactions.\n- Medium scenario at 48 gwei, 70% fill.\n- High scenario at 92 gwei, orders remain partially unfilled.\n\nFor this scenario, execute all 15 transactions only in the Low scenario. Treat the current 36 gwei line and event bullets as context already summarized by the Low/Medium/High execution options; do not recombine them into a separate forecast. Medium and High are infeasible because the task requires all 15 transactions to execute. Compute USD cost as transactions * gas_per_transaction * gas_price_gwei * 1e-9 ETH/gwei * ETH price.\n\nDesign the gas-timed execution and report expected USD spend.",
    "rubric_id": "l10-L10-035",
    "expected_values": {
      "intent": "gas_forecasting",
      "asset": "ETH",
      "order_type": "execution_timing",
      "size": 3750000,
      "venue": "mainnet",
      "expected_value": 216,
      "unit": "USD_cost"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-036",
    "level": 10,
    "prompt": "Predict Ethereum gas costs for an eight-transaction DeFi migration, each transaction using 300,000 gas, with ETH at $2,800. Current gas is 41 base plus 3 priority gwei.\n\nEvent context:\n- US market close may reduce activity.\n- A liquidation cascade may increase gas if it triggers.\n- A scheduled protocol migration can be delayed if gas is too high.\n\nExecution options already summarize those events:\n- Low scenario at 32 gwei, 100% fill for all eight transactions.\n- Medium scenario at 67 gwei, 75% fill.\n- High scenario at 115 gwei, migration remains incomplete.\n\nFor this scenario, execute all eight transactions only in the Low scenario. Treat current gas and event bullets as context already summarized by the three execution options; do not recombine them into a separate forecast. Medium and High are infeasible because the migration requires all eight transactions to execute. Compute USD cost as transactions * gas_per_transaction * gas_price_gwei * 1e-9 ETH/gwei * ETH price.\n\nDesign the schedule minimizing expected spend and report expected USD cost.",
    "rubric_id": "l10-L10-036",
    "expected_values": {
      "intent": "gas_forecasting",
      "asset": "ETH",
      "order_type": "execution_timing",
      "size": 2400000,
      "venue": "mainnet",
      "expected_value": 215,
      "unit": "USD_cost"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-037",
    "level": 10,
    "prompt": "Ethereum's next major upgrade occurs in 30 days. You manage $4,000,000 across spot ETH, CME futures, perpetuals, and options. The market quotes CME basis at 2.4%, perpetual funding at 11.0% APR, and implied volatility at 58%.\n\nUse this required risk-balanced allocation and deterministic 60-day return model:\n- 35% spot ETH with a +28% upgrade-cycle base case.\n- 30% CME basis trade earning the full +2.4% basis convergence.\n- 20% perpetual funding leg earning 11.0% APR prorated over 60 days.\n- 15% options convexity leg earning +55% net after premium.\n\nFor this scenario, realized volatility is assumed to exceed implied volatility, so the +55% options payoff is active, not conditional. The options leg includes a put spread that caps total portfolio drawdown below 14% in the stress case; ignore additional fees and financing. Compute total portfolio return as the weighted sum of the four deterministic leg returns.\n\nDesign the multi-leg strategy and report expected percent return over 60 days.",
    "rubric_id": "l10-L10-037",
    "expected_values": {
      "intent": "multi_leg_strategy",
      "asset": "ETH",
      "order_type": "upgrade_arbitrage",
      "size": 4000000,
      "venue": "multi_market",
      "expected_value": 19.1,
      "unit": "percent_return"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-038",
    "level": 10,
    "prompt": "A Solana performance catalyst is expected in 75 days. You manage $6,000,000 across spot SOL, JitoSOL carry, perpetual funding, and options. Spot markets imply a +22% catalyst base case, JitoSOL staking carry is 8.0% APR, perpetual funding is 18.0% APR, and options implied volatility is below the expected realized move.\n\nUse this required risk-balanced allocation and deterministic 75-day return model:\n- 30% spot SOL earning +22%.\n- 25% JitoSOL carry earning 8.0% APR prorated over 75 days.\n- 25% perpetual funding leg earning 18.0% APR prorated over 75 days.\n- 20% options call-spread leg earning +65% net after premium.\n\nFor this scenario, the +65% options payoff is active, not conditional. The options package includes downside puts that cap total portfolio drawdown below 16% in the stress case; ignore additional fees, borrow costs, and slippage. Compute total portfolio return as the weighted sum of the four deterministic leg returns.\n\nDesign the multi-leg strategy and report expected percent return over 75 days.",
    "rubric_id": "l10-L10-038",
    "expected_values": {
      "intent": "multi_leg_strategy",
      "asset": "SOL",
      "order_type": "catalyst_arbitrage",
      "size": 6000000,
      "venue": "multi_market",
      "expected_value": 20.9,
      "unit": "percent_return"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-039",
    "level": 10,
    "prompt": "Operate a Lightning routing node managing $1,200,000 BTC liquidity. Current state: 21 BTC across 38 channels, 88% payment success, 0.13% fee rate, $14,000,000 monthly successful routed volume, and 12% failures due to inbound imbalance.\n\nObjectives:\n- Reach 95% payment success.\n- Keep total channels at or below 55.\n- Spend no more than $4,000 in one-time on-chain rebalancing.\n- Grow final successful routed volume to exactly $28,000,000 per month at the same 0.13% fee rate.\n\nFor this scenario, the $14,000,000 baseline is already successful routed volume, not attempted volume. Rebalancing costs are one-time and excluded from monthly revenue. Direct merchant channels and inbound leases should be sized so final successful routed volume is exactly $28,000,000 per month; do not apply any extra volume multiplier beyond that target.\n\nDevise the channel and rebalancing plan meeting the objectives and report expected monthly routing revenue.\n\nOptimize for satisfying all stated channel, success-rate, and rebalancing constraints while calculating revenue from final successful routed volume at the fee rate.",
    "rubric_id": "l10-L10-039",
    "expected_values": {
      "intent": "liquidity_routing",
      "asset": "BTC",
      "order_type": "channel_optimization",
      "size": 1200000,
      "venue": "lightning",
      "expected_value": 36400,
      "unit": "USD_monthly_revenue"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-040",
    "level": 10,
    "prompt": "Operate a cross-rollup stablecoin routing desk with $3,000,000 inventory across Arbitrum, Base, and Optimism. Current state: $22,000,000 monthly successful routed volume, 91% fill success, 0.11% net routing fee after LP rebates, and 9% failures caused by inventory imbalance between rollups.\n\nObjectives:\n- Reach 97% fill success.\n- Keep total rebalancing spend below $6,000 per month.\n- Keep inventory on all three rollups, with no rollup below 20% of total inventory.\n- Grow final successful routed volume to exactly $45,000,000 per month at the same 0.11% net fee rate.\n\nFor this scenario, the $22,000,000 baseline is successful routed volume, not attempted volume. Rebalancing spend is excluded from the reported monthly revenue. Institutional RFQ flow and solver integrations should be sized so final successful routed volume is exactly $45,000,000 per month; do not apply additional multipliers. Report revenue as final successful routed volume * 0.11%.\n\nDevise the liquidity routing plan and report expected monthly revenue.",
    "rubric_id": "l10-L10-040",
    "expected_values": {
      "intent": "liquidity_routing",
      "asset": "USDC",
      "order_type": "solver_inventory_optimization",
      "size": 3000000,
      "venue": "cross_rollup",
      "expected_value": 49500,
      "unit": "USD_monthly_revenue"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-041",
    "level": 10,
    "prompt": "Manage 4,120 native SegWit UTXOs totaling 210.6 BTC. You must consolidate within 120 days while keeping at least 30 BTC liquid and keeping total transaction costs below 0.06 BTC.\n\nUse this deterministic consolidation plan:\n- Leave the largest 30 BTC untouched for liquidity.\n- Consolidate the 3,000 smallest UTXOs into 150 equal-sized outputs.\n- Execute only during four low-fee windows at 8 sat/vB; ignore all higher-fee windows.\n- Native SegWit inputs are 68 vbytes each.\n- Consolidation outputs are 31 vbytes each.\n- Total batch overhead across the consolidation transactions is 420 vbytes.\n\nFor the objective answer, compute total vbytes as inputs * 68 + outputs * 31 + overhead, then compute BTC cost as total_vbytes * 8 sat/vB / 100,000,000. Do not add change outputs, CPFP, exchange withdrawal fees, or privacy haircuts beyond the specified output count.\n\nSelect the consolidation plan and report expected BTC transaction cost.",
    "rubric_id": "l10-L10-041",
    "expected_values": {
      "intent": "utxo_optimization",
      "asset": "BTC",
      "order_type": "consolidation_plan",
      "size": 210.6,
      "venue": "bitcoin_mainnet",
      "expected_value": 0.0167,
      "unit": "BTC_cost"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-042",
    "level": 10,
    "prompt": "Manage 2,430 Taproot UTXOs totaling 98.4 BTC. You must consolidate within 75 days while keeping at least 15 BTC liquid and keeping total transaction costs below 0.04 BTC.\n\nUse this deterministic consolidation plan:\n- Leave the largest 15 BTC untouched for liquidity.\n- Consolidate the 1,850 smallest UTXOs into 90 equal-sized outputs.\n- Execute only during three low-fee windows at 12 sat/vB; ignore all higher-fee windows.\n- Taproot key-path inputs are 58 vbytes each.\n- Consolidation outputs are 43 vbytes each.\n- Total batch overhead across the consolidation transactions is 300 vbytes.\n\nFor the objective answer, compute total vbytes as inputs * 58 + outputs * 43 + overhead, then compute BTC cost as total_vbytes * 12 sat/vB / 100,000,000. Do not add change outputs, CPFP, exchange withdrawal fees, or privacy haircuts beyond the specified output count.\n\nSelect the consolidation plan and report expected BTC transaction cost.",
    "rubric_id": "l10-L10-042",
    "expected_values": {
      "intent": "utxo_optimization",
      "asset": "BTC",
      "order_type": "consolidation_plan",
      "size": 98.4,
      "venue": "bitcoin_mainnet",
      "expected_value": 0.0134,
      "unit": "BTC_cost"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-043",
    "level": 10,
    "prompt": "Provide $3,000,000 liquidity to a Uniswap V3 WBTC/USDC pool, split as $1,500,000 WBTC and $1,500,000 USDC, with the pool centered at $70,000. You need to project upside and downside outcomes for a 45-day hedge decision.\n\nScenario table:\n- At +/-25% WBTC price move, use 0.63% impermanent loss versus HODL.\n- At +/-50% WBTC price move, use 4.04% impermanent loss versus HODL.\n- At +100% WBTC price move, use 5.72% impermanent loss versus HODL.\n- At -100%, assume WBTC cannot trade below zero and the LP is fully in WBTC with no additional IL haircut beyond terminal pool value.\n\nUse this prescribed hedge for the objective answer: spend $45,000 (1.5% of capital) on an asymmetric range shift plus protective overlay. The overlay covers at least 80% of downside IL exposure in negative WBTC scenarios, but it has $0 payoff in the +50% and +100% upside scenarios. For the reported upside-capture percentage, use the +100% WBTC scenario and compute (LP value after subtracting the $45,000 hedge cost and with zero upside hedge payoff - initial $3,000,000) / (HODL value - initial $3,000,000). Compute PnL across the table and report the +100% upside-capture percentage.",
    "rubric_id": "l10-L10-043",
    "expected_values": {
      "intent": "impermanent_loss_hedging",
      "order_type": "hedging_strategy",
      "asset": "WBTC/USDC",
      "size": 3000000,
      "venue": "uniswap_v3",
      "expected_upside_capture_pct": 80,
      "hedge_cost_pct": 1.5,
      "expected_value": 80,
      "unit": "upside_capture_percentage"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-044",
    "level": 10,
    "prompt": "Provide $1,600,000 liquidity to an ARB/USDC concentrated pool, split as $800,000 ARB and $800,000 USDC. You need to evaluate an asymmetric hedge for a 30-day catalyst window.\n\nScenario table:\n- At +/-25% ARB price move, use 0.63% impermanent loss versus HODL.\n- At +/-50% ARB price move, use 4.04% impermanent loss versus HODL.\n- At +100% ARB price move, use 5.72% impermanent loss versus HODL.\n- At -100%, assume ARB cannot trade below zero and the LP is fully in ARB with no additional IL haircut beyond terminal pool value.\n\nUse this prescribed hedge for the objective answer: spend $20,000 (1.25% of capital) on a protective put-spread plus range shift. The overlay covers at least 80% of downside IL exposure in negative ARB scenarios, but it has $0 payoff in the +50% and +100% upside scenarios. For the reported upside-capture percentage, use the +50% ARB scenario and compute (LP value after subtracting the $20,000 hedge cost and with zero upside hedge payoff - initial $1,600,000) / (HODL value - initial $1,600,000). Compute PnL across the table and report the +50% upside-capture percentage.",
    "rubric_id": "l10-L10-044",
    "expected_values": {
      "intent": "impermanent_loss_hedging",
      "order_type": "hedging_strategy",
      "asset": "ARB/USDC",
      "size": 1600000,
      "venue": "concentrated_liquidity",
      "expected_upside_capture_pct": 75,
      "hedge_cost_pct": 1.25,
      "expected_value": 75,
      "unit": "upside_capture_percentage"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-045",
    "level": 10,
    "prompt": "Execute a $5,000,000 ETH to USDC swap on Ethereum mainnet. The public mempool exposes swaps above $250,000 to sandwiching; historical attack rate is 68% with average 0.9% adverse slippage.\n\nOptions:\n1. Submit through Flashbots Protect with a $2,000 tip, 88% protected-completion probability.\n2. Use a CowSwap solver auction costing 0.18% all-in, 93% protected-completion probability.\n3. Split into 25 child orders of $200,000 each, adding 0.12% aggregate execution slippage, 85% protected-completion probability.\n4. Hybrid: split into 25 child orders of $200,000 and route them through a private solver/RPC path.\n\nObjective and cost convention: choose the highest protected-completion probability strategy with total expected cost at or below 0.50%, while also keeping each child order at or below $200,000. Flashbots and CowSwap alone fail the child-order constraint, and splitting alone fails the 90% protected-completion target. For the Hybrid, define success probability as 93% and expected total cost as 0.12% split slippage + $2,000 / $5,000,000 private routing cost + 0.21% residual adverse-selection cost = 0.37% rounded. Do not apply the historical attack rate again after using the residual-cost term.\n\nDesign the MEV defense and report expected total cost percentage, success probability, and execution steps.",
    "rubric_id": "l10-L10-045",
    "expected_values": {
      "intent": "mev_defense_strategy",
      "order_type": "execution_plan",
      "asset": "ETH",
      "size": 5000000,
      "venue": "ethereum_mainnet",
      "expected_total_cost_pct": 0.37,
      "success_probability_pct": 93,
      "expected_value": 0.37,
      "unit": "total_cost_percentage"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-046",
    "level": 10,
    "prompt": "Execute a $3,000,000 USDC to ARB swap on Arbitrum. Sequencer-adjacent orderflow exposes swaps above $250,000 to backrunning; historical attack rate is 61% with average 0.7% adverse slippage.\n\nOptions:\n1. Use a private RPC relay costing $300, 86% protected-completion probability.\n2. Use a solver auction costing 0.16% all-in, 92% protected-completion probability.\n3. Split into 15 child orders of $200,000 each, adding 0.10% aggregate execution slippage, 84% protected-completion probability.\n4. Hybrid: split into 15 child orders of $200,000 and submit through a private solver/RPC route.\n\nObjective and cost convention: choose the highest protected-completion probability strategy with total expected cost at or below 0.45%, while also keeping each child order at or below $200,000. Private RPC and solver alone fail the child-order constraint, and splitting alone fails the 90% protected-completion target. For the Hybrid, define success probability as 92% and expected total cost as 0.10% split slippage + $300 / $3,000,000 private routing cost + 0.24% residual adverse-selection cost = 0.35% rounded. Do not apply the historical attack rate again after using the residual-cost term.\n\nDesign the MEV defense and report expected total cost percentage, success probability, and execution steps.",
    "rubric_id": "l10-L10-046",
    "expected_values": {
      "intent": "mev_defense_strategy",
      "order_type": "execution_plan",
      "asset": "ARB",
      "size": 3000000,
      "venue": "arbitrum",
      "expected_total_cost_pct": 0.35,
      "success_probability_pct": 92,
      "expected_value": 0.35,
      "unit": "total_cost_percentage"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-047",
    "level": 10,
    "prompt": "Operate an Ethereum validator fleet with 1,200 validators (38,400 ETH) at ETH = $3,200. Current effective uptime is 96.8%, relay diversity is weak, and missed-attestation penalties are rising. Target: restore effective uptime to 99.2% and reach 15% ROI within six months under a $180,000 budget. For this scenario, ROI means incremental six-month net profit divided by the upgrade spend selected for the plan, not return on validator principal.\n\nUpgrade options:\n1. Relay diversity automation ($40,000) contributing to the uptime target.\n2. DVT failover cluster ($55,000) contributing to the uptime target.\n3. MEV-Boost tuning ($10,000) adding six-month net MEV profit.\n4. Lower operator fee from 8% to 6%, stabilizing delegations but with no direct six-month incremental-profit credit.\n5. Premium RPC endpoint ($120,000) evaluated on year-one economics and not part of the six-month ROI numerator.\n\nEconomic constants: the relay diversity + DVT failover + MEV tuning package costs $105,000; restoring uptime from 96.8% to 99.2% adds $9,450 of six-month net profit; MEV tuning adds $6,300 of six-month net profit after setup effects. Premium RPC is outside the six-month numerator. Devise a three-phase plan within budget and report six-month ROI percentage.",
    "rubric_id": "l10-L10-047",
    "expected_values": {
      "intent": "validator_economics",
      "order_type": "infrastructure_plan",
      "asset": "ETH",
      "size": 38400,
      "venue": "ethereum_validator",
      "projected_performance_pct": 99.2,
      "projected_roi_pct": 15,
      "year1_cost_usd": 180000,
      "expected_value": 15,
      "unit": "ROI_percentage"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-048",
    "level": 10,
    "prompt": "Operate a Cosmos validator with 8,000,000 ATOM delegated at $9 per ATOM. Current signing uptime is 92%, missed-block penalties are increasing, and delegations are declining 4% per quarter. Target: restore uptime to 98% and reach 15% ROI within six months under a $150,000 budget. For this scenario, ROI means incremental six-month net profit divided by the upgrade spend selected for the plan, not return on delegated stake principal.\n\nUpgrade options:\n1. Add distributed sentry nodes ($48,000) contributing to the uptime target.\n2. Deploy Horcrux threshold signer ($32,000) contributing to the uptime target.\n3. Add Skip MEV integration ($10,000) adding six-month net MEV profit.\n4. Lower commission from 7% to 5%, stabilizing delegations but with no direct six-month incremental-profit credit.\n5. Build a public API product ($90,000) evaluated on year-one economics and not part of the six-month ROI numerator.\n\nEconomic constants: the sentry nodes + Horcrux signer + Skip MEV package costs $90,000; restoring uptime from 92% to 98% adds $8,100 of six-month net profit; Skip MEV adds $5,400 of six-month net profit after setup effects. Public API is outside the six-month numerator. Devise a three-phase plan within budget and report six-month ROI percentage.",
    "rubric_id": "l10-L10-048",
    "expected_values": {
      "intent": "validator_economics",
      "order_type": "infrastructure_plan",
      "asset": "ATOM",
      "size": 8000000,
      "venue": "cosmos_validator",
      "projected_performance_pct": 98,
      "projected_roi_pct": 15,
      "year1_cost_usd": 150000,
      "expected_value": 15,
      "unit": "ROI_percentage"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-049",
    "level": 10,
    "prompt": "You manage an $18,000,000 stablecoin treasury for a 60-day liability window. Allocate across four venues:\n\n1. Tokenized Treasury repo: 5.4% APR, 2-day liquidity, no modeled tail loss.\n2. FraxBP LP: 9.8% nominal APR, 5-day liquidity, 1.5% chance of an 18% pool loss.\n3. Maple senior loan: 13.0% nominal APR, 45-day liquidity, 2.0% chance of a 35% credit loss.\n4. Ethena sUSDe lock: 16.5% nominal APR, 7-day liquidity, 3.0% chance of a 22% protocol loss.\n\nConstraints:\n- At most 30% allocation to any venue.\n- At least 55% of capital must be liquid within 7 days.\n- At most 25% of capital may be in assets liquid later than 7 days.\n- Portfolio expected tail loss must be below 1.0% of capital.\n- Target pre-tail-loss nominal APR is above 10.0%.\n- Report risk-adjusted annualized yield by subtracting probability times severity from each venue's APR as percentage points, without annualizing tail losses.\n\nCompute the allocation that maximizes risk-adjusted annualized yield while satisfying every constraint, and report the APR percentage.",
    "rubric_id": "l10-L10-049",
    "expected_values": {
      "intent": "stablecoin_liquidity_ladder",
      "asset": "USDC",
      "order_type": "liquidity_ladder_optimization",
      "size": 18000000,
      "venue": "multi_venue_stablecoin",
      "archetype_family": "stablecoin_liquidity_ladder",
      "allocation": {
        "repo_pct": 15,
        "fraxbp_pct": 30,
        "maple_pct": 25,
        "ethena_pct": 30
      },
      "expected_value": 11.5,
      "unit": "APR_percentage"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-050",
    "level": 10,
    "prompt": "You hold 4,000 ETH at $3,000 per ETH and need a 30-day hedge. Risk policy says that if ETH drops 18% in one day, total portfolio loss after hedge payoff and hedge carry must not exceed $420,000.\n\nAvailable hedges:\n1. Sell covered calls for $42 per ETH; they do not protect the downside stress.\n2. Buy 20% OTM puts with strike $2,400 for $54 per ETH; at the -18% stress price they have no payoff.\n3. Buy 10% OTM puts with strike $2,700 for $96 per ETH; at the -18% stress price they pay intrinsic value only.\n4. Short ETH perps for the minimum necessary notional; funding cost is 0.012% per day on short notional for 30 days, and the short gains dollar-for-dollar on the -18% price move.\n\nUse hedge cost as part of stress loss. Ignore slippage, option delta before expiry, and basis risk. Choose the cheapest hedge that satisfies the stress-loss cap and report the 30-day hedge cost in USD.",
    "rubric_id": "l10-L10-050",
    "expected_values": {
      "intent": "options_delta_hedge",
      "asset": "ETH",
      "order_type": "minimum_cost_downside_hedge",
      "size": 4000,
      "venue": "options_and_perps",
      "archetype_family": "options_delta_hedge",
      "hedge_eth": 3288,
      "expected_value": 35510,
      "unit": "USD_cost"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-051",
    "level": 10,
    "prompt": "Allocate $20,000,000 for a 90-day delta-neutral funding strategy. Each trade is cash-and-carry: buy spot, short the perp, collect funding, pay borrow, and pay one-time execution/roll fees.\n\nOptions:\n- BTC: collect 0.035% per day, borrow cost 4.0% APR, one-time fees 0.18%, stress haircut 4%, capacity $8,000,000.\n- ETH: collect 0.052% per day, borrow cost 5.5% APR, one-time fees 0.22%, stress haircut 7%, capacity $6,000,000.\n- SOL: collect 0.095% per day, borrow cost 7.0% APR, one-time fees 0.35%, stress haircut 12%, capacity $4,000,000.\n- Idle USDC earns 5.1% APR with 0% stress haircut.\n\nConstraints:\n- At least $6,000,000 must remain idle in USDC.\n- Stress haircut consumption, measured as haircut percentage times allocation divided by total capital, must be at most 6.0%.\n- No crypto basis trade may exceed its capacity.\n- Use 365-day year conventions and do not compound.\n\nChoose the allocation that maximizes 90-day expected profit and report that profit in USD.",
    "rubric_id": "l10-L10-051",
    "expected_values": {
      "intent": "funding_basis_rotation",
      "asset": "BTC/ETH/SOL/USDC",
      "order_type": "basis_portfolio_optimization",
      "size": 20000000,
      "venue": "cex_perps",
      "archetype_family": "funding_basis_rotation",
      "allocation": {
        "btc_usd": 4000000,
        "eth_usd": 6000000,
        "sol_usd": 4000000,
        "idle_usdc": 6000000
      },
      "expected_value": 600010,
      "unit": "USD_profit"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-052",
    "level": 10,
    "prompt": "You have $9,000,000 USDC available to defend three lending positions before a volatility update. Repayments reduce debt dollar-for-dollar. The required post-stress health factor is 1.08, where health factor equals stressed collateral value times liquidation threshold divided by remaining debt.\n\nPositions:\n- WBTC vault: $14,000,000 collateral, $9,800,000 debt, 78% liquidation threshold, collateral stress -12%.\n- ETH vault: $8,000,000 collateral, $5,200,000 debt, 82% liquidation threshold, collateral stress -15%.\n- stSOL vault: $5,000,000 collateral, $3,400,000 debt, 75% liquidation threshold, collateral stress -20%.\n\nIgnore interest, liquidation penalties, and slippage for the repayment calculation. Compute the minimum total repayment that brings all three positions to a post-stress health factor of at least 1.08, and report the required repayment in USD.",
    "rubric_id": "l10-L10-052",
    "expected_values": {
      "intent": "lending_health_factor_triage",
      "asset": "WBTC/ETH/stSOL",
      "order_type": "debt_repayment_plan",
      "size": 9000000,
      "venue": "defi_lending",
      "archetype_family": "lending_health_factor_triage",
      "expected_value": 1561481,
      "unit": "USD_repayment"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-053",
    "level": 10,
    "prompt": "Deploy $7,000,000 into discounted liquid staking tokens and redeem to ETH. Hedge ETH price risk until each withdrawal settles.\n\nRoutes:\n- stETH discount 0.85%, withdrawal time 6 days, hedge cost 4.5% APR, depeg/failure risk 0.05% of principal, unlimited capacity.\n- rETH discount 1.40%, withdrawal time 14 days, hedge cost 5.2% APR, depeg/failure risk 0.10% of principal, capacity $3,000,000.\n- cbETH discount 1.90%, withdrawal time 21 days, hedge cost 6.8% APR, depeg/failure risk 0.30% of principal, capacity $2,000,000.\n\nConstraints:\n- Weighted-average settlement time must be at most 14 days.\n- No route may exceed its capacity.\n- Use only positive expected-value routes.\n- Expected profit per route equals discount minus prorated hedge cost minus depeg/failure risk, all as percentages of allocated principal.\n\nChoose the profit-maximizing allocation and report expected profit in USD.",
    "rubric_id": "l10-L10-053",
    "expected_values": {
      "intent": "lst_withdrawal_queue_arbitrage",
      "asset": "stETH/rETH/cbETH",
      "order_type": "redemption_arbitrage",
      "size": 7000000,
      "venue": "ethereum_lsts",
      "archetype_family": "lst_withdrawal_queue_arbitrage",
      "allocation": {
        "steth_usd": 2000000,
        "reth_usd": 3000000,
        "cbeth_usd": 2000000
      },
      "expected_value": 71711,
      "unit": "USD_profit"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-054",
    "level": 10,
    "prompt": "You market-make ARB-PERP with an existing long inventory of 5,000,000 ARB at a mark price of $1.20. Over the next two hours choose one quoting mode.\n\nMode A - tight two-sided quotes:\n- Expected buy fills: 700,000 ARB.\n- Expected sell fills: 500,000 ARB.\n- Spread capture: 0.08% of filled notional.\n\nMode B - skew asks wider and bids smaller:\n- Expected buy fills: 100,000 ARB.\n- Expected sell fills: 1,400,000 ARB.\n- Spread capture: 0.11% of filled notional.\n- Adverse-selection cost: 0.03% of sell notional.\n\nMode C - pull bids and leave only high asks:\n- Expected buy fills: 0 ARB.\n- Expected sell fills: 900,000 ARB.\n- Spread capture: 0.14% of filled notional.\n- Exchange cancel/queue penalty: $6,000.\n\nRisk penalty after the two-hour window is $0.012 per ARB of ending inventory above 4,000,000 ARB. Ending inventory equals starting inventory plus expected buy fills minus expected sell fills. Choose the mode with the highest net expected PnL after spread capture, adverse selection, penalties, and inventory risk, and report that net PnL in USD.",
    "rubric_id": "l10-L10-054",
    "expected_values": {
      "intent": "perp_inventory_skew_quoting",
      "asset": "ARB-PERP",
      "order_type": "quote_skew_decision",
      "size": 5000000,
      "venue": "perpetual_dex",
      "archetype_family": "perp_inventory_skew_quoting",
      "selected_mode": "B",
      "expected_value": 1476,
      "unit": "USD_net_pnl"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-055",
    "level": 10,
    "prompt": "A USD treasury allocates EUR 10,000,000 into tokenized 91-day German T-bills at a EUR/USD spot rate of 1.08. The EUR bill yield is 3.2% APR. The treasury fully hedges EUR/USD back to USD for the holding period.\n\nCosts and conventions:\n- FX hedge carry cost is 0.55% APR on USD notional.\n- Custody/admin cost is 0.12% APR on USD notional.\n- Mint and redeem fees total 0.08% one-time on USD notional.\n- Use a 365-day year, simple interest, and the initial EUR/USD spot rate to define USD notional.\n- Ignore taxes, margin interest, and reinvestment.\n\nCompute the hedged net USD profit over 91 days and report it in USD.",
    "rubric_id": "l10-L10-055",
    "expected_values": {
      "intent": "rwa_fx_hedged_yield",
      "asset": "EUR_TBILL",
      "order_type": "hedged_rwa_allocation",
      "size": 10000000,
      "venue": "tokenized_rwa",
      "archetype_family": "rwa_fx_hedged_yield",
      "expected_value": 59473,
      "unit": "USD_profit"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-056",
    "level": 10,
    "prompt": "Allocate a $25,000,000 ETH treasury between native staking and three restaking AVSs for a 12-month plan.\n\nOptions:\n- Native staking: 4.2% APR, no modeled slash loss, no cap.\n- AVS A: 8.0% APR, 0.8% slash probability, 15% slash severity, cap 40% of capital.\n- AVS B: 11.0% APR, 1.2% slash probability, 25% slash severity, cap 30% of capital.\n- AVS C: 15.0% APR, 2.0% slash probability, 50% slash severity, cap 20% of capital.\n\nConstraints:\n- Expected slash loss, calculated as allocation weight times probability times severity, must be at most 0.45% of total capital.\n- At least 35% of capital must stay in native staking.\n- Maximize risk-adjusted APR, where each AVS APR is reduced by probability times severity as percentage points.\n\nCompute the optimal allocation and report the portfolio risk-adjusted APR percentage.",
    "rubric_id": "l10-L10-056",
    "expected_values": {
      "intent": "restaking_slashing_budget",
      "asset": "ETH",
      "order_type": "restaking_allocation",
      "size": 25000000,
      "venue": "restaking_avs",
      "archetype_family": "restaking_slashing_budget",
      "allocation": {
        "native_pct": 35,
        "avs_a_pct": 15,
        "avs_b_pct": 30,
        "avs_c_pct": 20
      },
      "expected_value": 8.66,
      "unit": "APR_percentage"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-057",
    "level": 10,
    "prompt": "You run a liquidation keeper on Base and can submit one bundle with at most 12,000,000 gas. For each opportunity, expected bonus equals gross bonus times success probability. You keep 60% of expected bonus after paying the sequencer a 40% share. Ignore separate gas costs.\n\nOpportunities:\n- A: $42,000 gross bonus, 90% success, 2,000,000 gas.\n- B: $35,000 gross bonus, 95% success, 4,000,000 gas.\n- C: $24,000 gross bonus, 80% success, 1,500,000 gas.\n- D: $60,000 gross bonus, 70% success, 7,000,000 gas.\n- E: $18,000 gross bonus, 98% success, 1,000,000 gas.\n\nSelect the gas-feasible bundle that maximizes keeper retained expected profit and report that retained profit in USD.",
    "rubric_id": "l10-L10-057",
    "expected_values": {
      "intent": "liquidation_keeper_bundle",
      "asset": "multi_collateral",
      "order_type": "gas_knapsack_bundle",
      "size": 12000000,
      "venue": "base_liquidations",
      "archetype_family": "liquidation_keeper_bundle",
      "selected_opportunities": [
        "A",
        "C",
        "D",
        "E"
      ],
      "expected_value": 69984,
      "unit": "USD_profit"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-058",
    "level": 10,
    "prompt": "A protocol has an $850,000 budget for one emissions epoch. Each $1 of bribe spend produces the expected protocol revenue shown below before subtracting the bribe.\n\nPools:\n- Pool A: $1.38 expected revenue per $1 bribe, maximum bribe $250,000.\n- Pool B: $1.55 expected revenue per $1 bribe, maximum bribe $350,000.\n- Pool C: $1.24 expected revenue per $1 bribe, maximum bribe $500,000.\n- Pool D: $1.70 revenue per $1 bribe if governance passes, but governance has a 35% failure probability that makes revenue zero; maximum bribe $200,000.\n\nConstraints:\n- Spend the full $850,000.\n- Use at least three pools.\n- No pool may receive more than 40% of the total budget.\n- Maximize expected ROI, where ROI equals (expected revenue minus bribe spend) divided by bribe spend.\n\nChoose the allocation and report expected ROI percentage.",
    "rubric_id": "l10-L10-058",
    "expected_values": {
      "intent": "dao_bribe_roi_allocation",
      "asset": "GOV_EMISSIONS",
      "order_type": "bribe_budget_optimization",
      "size": 850000,
      "venue": "governance_market",
      "archetype_family": "dao_bribe_roi_allocation",
      "allocation": {
        "pool_a_usd": 250000,
        "pool_b_usd": 340000,
        "pool_c_usd": 260000,
        "pool_d_usd": 0
      },
      "expected_value": 40.52,
      "unit": "ROI_percentage"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-059",
    "level": 10,
    "prompt": "A treasury holds a $32,000,000 stablecoin basket:\n- 40% USDC.\n- 25% DAI.\n- 20% FRAX.\n- 15% TUSD.\n\nNew risk policy requires the following target basket based on the starting $32,000,000 notional: 30% USDC, 30% DAI, 15% FRAX, and 25% tokenized T-bills. TUSD must be fully exited.\n\nExecution costs:\n- Selling USDC costs 0.05% of USDC sold.\n- Buying DAI costs 0.08% of DAI bought.\n- Selling FRAX costs 0.35% of FRAX sold.\n- Selling TUSD costs 2.20% of TUSD sold.\n- Minting tokenized T-bills costs 0.02% of T-bills bought.\n\nIgnore price drift and yield. Compute the final basket value after all execution costs and report it in USD.",
    "rubric_id": "l10-L10-059",
    "expected_values": {
      "intent": "stablecoin_basket_depeg_unwind",
      "asset": "USDC/DAI/FRAX/TUSD",
      "order_type": "stablecoin_rebalance",
      "size": 32000000,
      "venue": "stablecoin_treasury",
      "archetype_family": "stablecoin_basket_depeg_unwind",
      "expected_value": 31884320,
      "unit": "USD_final_value"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-060",
    "level": 10,
    "prompt": "Allocate $600,000 for a 10-week airdrop points program. Expected token value and costs are deterministic for this scenario.\n\nStrategies:\n- Lending: 120 points per $1,000 per week, expected token value $0.15 per point, one-time gas/ops cost 0.20% of capital, cap $200,000.\n- Perp volume: 25 points per $1,000 notional, capital can turn over 8x per week, expected token value $0.022 per point, trading fees 0.045% of notional, cap $150,000.\n- NFT bids: 200 points per $1,000 per week, expected token value $0.10 per point, stale-fill loss 0.35% of capital per week, cap $100,000.\n- Bridge activity: 90 points per $1,000 transferred, 3 transfers per week, expected token value $0.018 per point, bridge fees 0.08% of transferred notional, cap $200,000.\n\nUse all capital, respect caps, and maximize expected net profit after costs. Report total expected net profit in USD.",
    "rubric_id": "l10-L10-060",
    "expected_values": {
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
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-061",
    "level": 10,
    "prompt": "Bridge $4,000,000 from Arbitrum to Solana within a weighted-average settlement time of at most 90 minutes. Expected cost equals route fee plus insurance premium plus expected uncovered loss.\n\nRoutes:\n- Wormhole: 25 minutes, 0.18% fee, 0.25% failure probability, optional 0.32% insurance that covers 95% of failed principal, capacity $2,000,000.\n- LayerZero: 50 minutes, 0.22% fee, 0.15% failure probability, optional 0.28% insurance that covers 90% of failed principal, capacity $3,000,000.\n- CCTP: 140 minutes, 0.10% fee, 0.02% failure probability, no insurance, unlimited capacity.\n- Mayan: 18 minutes, 0.35% fee, 0.45% failure probability, optional 0.45% insurance that covers 98% of failed principal, capacity $1,000,000.\n\nFor routes with optional insurance, use insurance if it lowers expected uncovered-loss risk enough to support the target. The total expected uncovered principal loss must be at most $4,000. Minimize expected total cost while meeting the time and risk constraints. Report expected total cost in USD.",
    "rubric_id": "l10-L10-061",
    "expected_values": {
      "intent": "bridge_insurance_route",
      "asset": "USDC",
      "order_type": "insured_bridge_allocation",
      "size": 4000000,
      "venue": "cross_chain_bridge",
      "archetype_family": "bridge_insurance_route",
      "allocation": {
        "cctp_usd": 2260870,
        "wormhole_usd": 1739130
      },
      "expected_value": 11625,
      "unit": "USD_cost"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-062",
    "level": 10,
    "prompt": "A cross-margin account has $15,000,000 USDT equity before stress and these positions:\n- Long BTC-PERP $40,000,000 notional.\n- Short ETH-PERP $18,000,000 notional.\n- Long SOL spot $6,000,000 notional.\n\nStress scenario:\n- BTC falls 9%.\n- ETH rises 12%, hurting the short.\n- SOL falls 18%.\n\nAfter stress, the account must keep equity at least 8% of stressed gross notional. Stressed gross notional is the sum of absolute stressed notionals. Ignore funding, fees, and convexity. Compute the maximum USDT that can be withdrawn immediately while still satisfying the post-stress 8% equity requirement, and report it in USD.",
    "rubric_id": "l10-L10-062",
    "expected_values": {
      "intent": "cex_cross_margin_stress",
      "asset": "BTC/ETH/SOL",
      "order_type": "stress_withdrawal_limit",
      "size": 15000000,
      "venue": "cex_portfolio_margin",
      "archetype_family": "cex_cross_margin_stress",
      "expected_value": 3241600,
      "unit": "USD_withdrawable"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-063",
    "level": 10,
    "prompt": "Sell 1,200,000 XYZ at a reference price of $6.40 over six hourly TWAP buckets. Forecast market volume by hour is:\n1. 1,000,000 XYZ\n2. 1,600,000 XYZ\n3. 2,400,000 XYZ\n4. 2,000,000 XYZ\n5. 1,400,000 XYZ\n6. 800,000 XYZ\n\nLit-market participation may not exceed 12% of each hour's volume. Lit execution impact cost in an hour equals 0.45% * (participation rate / 10%)^2 of that hour's sold notional. Any unsold residual after using lit capacity can be crossed in a final dark-pool block at a 2.10% haircut to reference price.\n\nBecause the lit impact at the 12% cap is cheaper than the dark-pool haircut, use all available lit capacity before the dark block. Compute expected total proceeds after lit impact and dark-pool haircut, and report proceeds in USD.",
    "rubric_id": "l10-L10-063",
    "expected_values": {
      "intent": "volume_curve_twap_impact",
      "asset": "XYZ",
      "order_type": "twap_impact_schedule",
      "size": 1200000,
      "venue": "lit_and_dark_execution",
      "archetype_family": "volume_curve_twap_impact",
      "expected_value": 7621325,
      "unit": "USD_proceeds"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-064",
    "level": 10,
    "prompt": "You submit one Ethereum backrun bundle with at most 25,000,000 gas. ETH is $3,200 and the variable priority tip is 20 gwei per gas. Base fee is burned by all competitors and should be ignored for bundle selection.\n\nOpportunities:\n- A: $210,000 gross value, 80% success, 8,000,000 gas.\n- B: $160,000 gross value, 85% success, 5,000,000 gas.\n- C: $95,000 gross value, 95% success, 4,000,000 gas.\n- D: $70,000 gross value, 90% success, 2,000,000 gas.\n- E: $140,000 gross value, 70% success, 10,000,000 gas.\n\nThe builder requires a bid equal to $18,000 plus 45% of the included opportunities' expected gross value. Your retained net profit equals 55% of expected gross value minus the $18,000 fixed bid component minus the variable priority tip cost. Select the bundle that maximizes retained net profit and report that profit in USD.",
    "rubric_id": "l10-L10-064",
    "expected_values": {
      "intent": "priority_gas_auction_bundle",
      "asset": "MEV",
      "order_type": "backrun_bundle_selection",
      "size": 25000000,
      "venue": "ethereum_builder",
      "archetype_family": "priority_gas_auction_bundle",
      "selected_opportunities": [
        "A",
        "B",
        "D",
        "E"
      ],
      "expected_value": 236150,
      "unit": "USD_profit"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-065",
    "level": 10,
    "prompt": "A protocol receives $2,400,000 revenue at the start of each month for six months. Its treasury waterfall is:\n- 35% of monthly revenue goes to token buybacks.\n- 25% goes to an insurance fund until that fund reaches $4,000,000.\n- Any insurance allocation after the fund reaches $4,000,000 is redirected to token buybacks in the same month.\n- The remaining revenue goes to operations.\n\nThe insurance fund starts at $2,800,000. Average buyback prices by month are:\n1. $1.20\n2. $1.05\n3. $0.90\n4. $1.10\n5. $1.25\n6. $1.40\n\nBuybacks execute once per month at the listed average price. Compute total tokens bought and burned over six months, and report the token count.",
    "rubric_id": "l10-L10-065",
    "expected_values": {
      "intent": "protocol_buyback_waterfall",
      "asset": "GOV",
      "order_type": "treasury_waterfall_buyback",
      "size": 2400000,
      "venue": "protocol_treasury",
      "archetype_family": "protocol_buyback_waterfall",
      "expected_value": 6589662,
      "unit": "tokens_burned"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-066",
    "level": 10,
    "prompt": "An NFT lending vault has three tranches of BAYC-backed loans. Current BAYC floor is 28 ETH and ETH is $2,800. Risk policy requires each tranche to have post-stress LTV at or below 78% after a 22% floor-price decline. Repayments reduce debt ETH-for-ETH.\n\nTranches:\n- A: 40 NFTs, debt 21 ETH per NFT.\n- B: 35 NFTs, debt 19 ETH per NFT.\n- C: 25 NFTs, debt 16 ETH per NFT.\n\nIgnore interest, auction penalties, and ETH price movement for this deleveraging calculation. Compute the minimum USD repayment needed to bring every tranche to a post-stress LTV of at most 78%, and report it in USD.",
    "rubric_id": "l10-L10-066",
    "expected_values": {
      "intent": "nft_floor_loan_deleveraging",
      "asset": "BAYC",
      "order_type": "floor_stress_deleveraging",
      "size": 100,
      "venue": "nft_lending",
      "archetype_family": "nft_floor_loan_deleveraging",
      "expected_value": 636608,
      "unit": "USD_repayment"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-067",
    "level": 10,
    "prompt": "A rollup sequencer forecasts 24,000,000 transactions next month. Each transaction currently posts 42 bytes of calldata, and calldata costs 16 gas per byte. Expected L1 base fee is 22 gwei and ETH is $3,100. Sequencer revenue is $0.035 per transaction before data costs.\n\nAvailable upgrades:\n1. Brotli compression: reduces bytes by 28%, costs $65,000 per month, no revenue loss.\n2. Blob posting: reduces the remaining data gas cost by 62%, costs $90,000 per month, and causes a 4% transaction revenue loss from delayed settlement.\n3. Batch delay: reduces data by 12%, costs $15,000 per month, but violates the latency target and is infeasible.\n\nCompression and blob posting can both be used, with reductions applied multiplicatively. Ignore all other costs. Choose the feasible upgrade plan that maximizes monthly net profit and report that profit in USD.",
    "rubric_id": "l10-L10-067",
    "expected_values": {
      "intent": "rollup_data_cost_optimization",
      "asset": "L2_FEES",
      "order_type": "sequencer_cost_plan",
      "size": 24000000,
      "venue": "rollup_sequencer",
      "archetype_family": "rollup_data_cost_optimization",
      "selected_upgrades": [
        "brotli_compression",
        "blob_posting"
      ],
      "expected_value": 350459,
      "unit": "USD_monthly_profit"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-068",
    "level": 10,
    "prompt": "A CeFi desk must meet $45,000,000 of client withdrawals within 36 hours and still hold at least a $10,000,000 cash buffer after the withdrawals clear.\n\nAvailable liquidity:\n- $18,000,000 cash, immediate, no haircut.\n- $22,000,000 tokenized T-bills, settle T+1 within the window, 0.04% liquidation haircut.\n- $16,000,000 ETH inventory, same-day OTC sale, 1.10% haircut.\n- $12,000,000 alt inventory, same-day OTC sale, 4.80% haircut.\n\nChoose the liquidation plan that meets withdrawals plus the ending cash buffer at minimum haircut cost. Report total haircut cost in USD.",
    "rubric_id": "l10-L10-068",
    "expected_values": {
      "intent": "cefi_withdrawal_liquidity_run",
      "asset": "CASH/TBILLS/ETH/ALTS",
      "order_type": "liquidity_waterfall",
      "size": 45000000,
      "venue": "cefi_treasury",
      "archetype_family": "cefi_withdrawal_liquidity_run",
      "expected_value": 173800,
      "unit": "USD_cost"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "L10-069",
    "level": 10,
    "prompt": "A $40,000,000 portfolio is allocated 45% BTC, 25% ETH, 15% SOL, and 15% stables. Daily volatilities are BTC 4.2%, ETH 5.4%, SOL 7.5%, and stables 0%.\n\nCorrelations:\n- BTC/ETH: 0.78.\n- BTC/SOL: 0.62.\n- ETH/SOL: 0.68.\n\nRisk policy requires portfolio daily volatility at or below 3.20%. To preserve strategic weights, reduce the crypto sleeve pro rata across BTC, ETH, and SOL and move the proceeds to stables. Stables have zero volatility and zero correlation. Use the covariance formula with the given volatilities and correlations.\n\nCompute the maximum dollar amount that can remain in the crypto sleeve while meeting the 3.20% volatility target, and report it in USD.",
    "rubric_id": "l10-L10-069",
    "expected_values": {
      "intent": "volatility_target_rebalance",
      "asset": "BTC/ETH/SOL",
      "order_type": "pro_rata_vol_target",
      "size": 40000000,
      "venue": "portfolio_risk",
      "archetype_family": "volatility_target_rebalance",
      "expected_value": 27776607,
      "unit": "USD_crypto_exposure"
    },
    "context": {
      "prices": {
        "BTC": 45000,
        "ETH": 3000,
        "SOL": 100,
        "MATIC": 0.8,
        "USDC": 1,
        "DAI": 0.999,
        "ARB": 1.2,
        "PEPE": 0.000001,
        "stETH": 2990,
        "GLD": 2400,
        "TLT": 100
      },
      "network": "mainnet",
      "timestamp": "2025-10-13T00:00:00Z",
      "gas": "30 gwei"
    }
  },
  {
    "id": "AGI-001",
    "level": 11,
    "prompt": "You manage this marked spot portfolio:\n- BTC: 10 @ $60,000\n- ETH: 50 @ $3,000\n- SOL: 1,000 @ $140\n- LINK: 2,000 @ $15\n- MATIC: 5,000 @ $0.90\n\nStress tapes give these one-hour percentage shocks:\n- SVB collapse: BTC -8.2%, ETH -9.1%, SOL -12.3%, LINK -7.8%, MATIC -11.2%\n- ETF squeeze: BTC +12.3%, ETH +8.5%, SOL +15.2%, LINK +4.3%, MATIC +9.8%\n- Yen unwind: BTC -15.3%, ETH -18.2%, SOL -22.1%, LINK -16.8%, MATIC -19.7%\n\nBeta estimates for crisis-margin purposes are BTC 1.00, ETH 1.10, SOL 1.50, LINK 0.90, MATIC 1.30. In the next 15 minutes you may use at most $400,000 gross notional across these immediately available perp hedge clips:\n- SOL short clip: $180,000 notional, 0.10% impact if first, 0.25% if after a MATIC clip.\n- MATIC short clip: $220,000 notional, 0.08% impact if first, 0.22% if after a SOL clip.\n- LINK short clip: $160,000 notional, 0.09% impact if first, 0.18% if after another clip.\n\nThe market maker sees the first clip and reprices correlated alt hedges before your second clip. You need the hedge basket and execution order that leaves the smallest worst-case portfolio PnL across the stress tapes while cutting crisis beta-dollar exposure by at least 50%. Spot holdings cannot be sold.\n\nOutput JSON fields: intent, chosen_strategy, execution_sequence, shorts, expected_risk_reduction_pct, worst_case_residual_pnl_usd.",
    "rubric_id": "agi-AGI-001",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-002",
    "level": 11,
    "prompt": "You must buy exactly 25,000 ALT within two minutes. Current mid is $2.455. A public DEX-X ask sweep is visible to a liquidity bot that widens remaining public ALT offers after it sees more than 8,000 ALT of aggressive buying.\n\nPublic DEX-X asks: $2.460 x 3,500; $2.465 x 2,800; $2.470 x 4,200; $2.475 x 3,000; $2.480 x 5,500; $2.485 x 4,000; $2.490 x 6,000.\n\nPrivate or semi-private liquidity available now:\n- CEX-Y: up to 8,000 ALT at $2.468 plus 0.12% taker fee; not visible to the DEX-X bot.\n- Dark RFQ-B: exactly 10,000 ALT at $2.472 all-in; fill-or-kill; not visible to the DEX-X bot.\n- RFQ-A: up to 12,000 ALT at $2.474 all-in if queried before any public DEX-X sweep above 8,000 ALT; otherwise the dealer refreshes to $2.486.\n\nYou can combine venues, but every child order must be completed inside the two-minute window and the whole 25,000 ALT target must fill. Identify the unique routing policy that minimizes adversarially realized average price and report its expected slippage versus mid.\n\nOutput JSON fields: intent, chosen_strategy, execution_sequence, venue_fills, expected_avg_price, expected_slippage_pct.",
    "rubric_id": "agi-AGI-002",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-003",
    "level": 11,
    "prompt": "You are long 100 ETH perpetuals from $2,850 at 5x leverage. Current ETH mid is $2,822; original margin was one-fifth of entry notional. Liquidation is near $2,565, but an exchange liquidation engine begins a correlated-long sweep in 15 minutes. Current 8-hour funding is +0.08% to residual longs and is paid in 42 minutes.\n\nRaw venue primitives:\n- The liquidation engine re-scores accounts from visible net ETH exposure at the sweep. Accounts still showing more than 60 ETH net long are treated as crowded collateral and can be swept through a $2,700 mark before funding.\n- A private hedge tunnel can immediately reduce net exposure by up to 60 ETH at the $2,822 mid with 0.06% execution cost. It updates the venue risk feed before the sweep and does not advertise a margin top-up.\n- Visible margin additions settle in 18 minutes and are copied by liquidation searchers before the exchange risk feed updates.\n- If your account avoids the sweep, the post-sweep funding mark is expected to be $2,880.\n- The portfolio mandate requires preserving at least 40 ETH of upside delta if that can be done without creating a sweep-path inconsistency.\n\nUse these disclosed calculations: realized hedge PnL = hedge_eth*(2,822-2,850) - hedge_eth*2,822*0.0006; sweep drawdown = realized hedge PnL + residual_eth*(2,700-2,850); funding-window PnL = realized hedge PnL + residual_eth*(2,880-2,850) + residual_eth*2,880*0.0008. A valid plan must preserve at least 40 ETH, leave visible exposure at or below 60 ETH before the sweep, and use one internally consistent set of numbers. Output JSON fields: intent, chosen_strategy, hedge_eth, net_exposure_eth, worst_case_margin_drawdown_pct, funding_window_pnl_usd, self_check. self_check must be an object with the disclosed boolean keys mandate_floor_met, sweep_trigger_avoided, and pnl_reconciles—not opaque labels.",
    "rubric_id": "agi-AGI-003",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-004",
    "level": 11,
    "prompt": "Allocate $100,000 for 90 days across these yield venues while preserving crisis liquidity. A public allocator that overloads a fragile venue will be queued behind mercenary withdrawals.\n\nVenues:\n- Aave USDC: 4.2% APY, liquid within one day, no queue penalty at this size.\n- Curve 3pool: 8.1% APY, 1.5% chance of a 12% depeg loss during the term, liquid within one day, max $30,000 before imbalance fees accelerate.\n- Ethena USDe: 15.2% APY, 3% chance of an 80% shutdown loss during the term, seven-day exit, redemptions above $20,000 enter an adversarial queue with an extra 6% haircut.\n- Pendle PT-stETH: 3.8% fixed APY, locked to maturity, no depeg loss.\n- GMX GLP: 18.7% APY, market-beta hedge costs 9.0% annualized, five-day exit, max $30,000 before withdrawal impact.\n\nConstraints: no venue above $30,000; at least $50,000 must be withdrawable inside 48 hours; avoid any allocation tier that enters the adversarial queue; maximize risk-adjusted 90-day dollars using the listed APYs, tail losses, hedge drag, liquidity, and caps.\n\nOutput JSON fields: intent, chosen_strategy, allocation_usd, expected_net_apy_pct, expected_90d_profit_usd, liquidity_48h_usd.\n\nChoose the strategy from: [balanced_no_constraints, conservative_low_apy_only, aggressive_yield_chase, liquid_barbell_capped_tail].",
    "rubric_id": "agi-AGI-004",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-005",
    "level": 11,
    "prompt": "Move $500,000 USDC to Arbitrum before a lending auction starts in 100 minutes. Funds that arrive after the auction cannot repair the account. A bridge exploit searcher watches public transfer graphs and focuses attacks on the largest observable clip, while private attestations reduce how much of a transfer is visible before settlement.\n\nRaw route primitives:\n- Alpha: private-attested bridge, 70-minute settlement, 99.7% arrival reliability, 0.05% toll, private capacity $300,000, total capacity $380,000.\n- Beta: fast optimistic bridge, 25-minute settlement, 98.8% arrival reliability, 0.03% toll, public clips above $220,000 trigger a 95-minute challenge delay.\n- Gamma: canonical bridge, 140-minute settlement, 99.9% arrival reliability, 0.08% toll.\n- Delta: relayer bridge, 45-minute settlement, 99.4% arrival reliability, 0.02% toll, relayer balance $240,000, observable clips above $240,000 are broadcast to the searcher.\n\nSplits settle independently, but the account is only repaired if the whole planned amount is spendable by the auction. Design the route plan, including the internal checks that the selected clips arrive in time, do not create a focal public target, and reconcile the reported deadweight loss with route tolls plus non-arrival risk. Output JSON fields: intent, chosen_strategy, route_allocation_usd, observable_largest_clip_usd, expected_loss_usd, expected_arrival_minutes, self_check.",
    "rubric_id": "agi-AGI-005",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-006",
    "level": 11,
    "prompt": "At 14:35:00 you must buy 500 BTC within ten minutes. Recent tape:\n- 14:23:10: 1,000 BTC market sell moved $58,520 -> $58,480 and recovered to $58,518 in 8 seconds.\n- 14:26:35: 800 BTC market sell moved $58,525 -> $58,492 and recovered to $58,523 in 5 seconds.\n- 14:31:20: 1,200 BTC market sell moved $58,530 -> $58,485 and recovered to $58,528 in 3 seconds.\n- 14:34:05: 100 BTC market buy moved $58,530 -> $58,545, while typical impact is +$8 to +$10.\n\nCurrent quote is $58,538 / $58,545. A toxicity classifier will fade displayed buy interest above 150 BTC and sweep stale bids after momentum bursts. Hidden iceberg child orders up to 40 BTC are not detected, but overly passive bids below fair value risk non-completion. The exchange allows immediate repricing every 45 seconds.\n\nFor this deterministic execution simulator, a hidden child of at most 40 BTC repriced every 45 seconds in the $58,525–$58,540 band fills at an all-in average of $58,534; 12 such 40-BTC children plus a final 20-BTC child complete by minute ten. A displayed parent or child above 40 BTC is detected and either fails to complete or costs $58,565 average. A bid below $58,525 does not complete. Minimize average price subject to completing all 500 BTC and avoiding detection. Output JSON fields: intent, chosen_strategy, price_band, child_order_btc, repricing_interval_sec, expected_avg_price. Describe the strategy in plain language; no private strategy label is required.",
    "rubric_id": "agi-AGI-006",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-007",
    "level": 11,
    "prompt": "YieldDAO token YLD trades at $2.40 after falling from $3.20 over 14 days. TVL is stable at $45M. Current emissions are 50,000 YLD/day, pool APR is 97% mostly in YLD, daily market sell pressure is 30,000 YLD, and DEX liquidity is $800,000.\n\nA vote in 24 hours would cut emissions to 25,000 YLD/day. Strategic farmers controlling 38% of farmed emissions will leave if the cut fails. If it passes, retained farmers are expected to sell fewer rewards, but a delayed-unlock cohort adds 4,000 YLD/day of extra selling for the first three days. A treasury stabilization order of $40,000 is authorized only if the cut passes. Your current farm position is $100,000 of YLD.\n\nFor this scenario, a passed cut reduces net market sell pressure from 30,000 to 14,000 YLD/day for days 1–3 (after the delayed unlock) and to 10,000 YLD/day for days 4–12; a failed cut leaves 30,000 YLD/day and loses the $40,000 stabilization order. Convert the 12-day avoided sales to dollars at $2.40 and use expected_price_change_pct = 0.35*(avoided_sale_dollars + stabilization_order)/800,000*100. Vote and position for the outcome with the better 12-day result, explaining the farmer and unlock logic. Output JSON fields: intent, vote, position, chosen_strategy, expected_12d_price_change_pct. Describe the strategy in plain language; no private label is required.",
    "rubric_id": "agi-AGI-007",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-008",
    "level": 11,
    "prompt": "At T+0, the SEC announces that USDT is under investigation. At T+10m you have one operations seat available every ten minutes, and market structure is changing faster than committee approval can be refreshed.\n\nRaw exposure and timing primitives:\n- Curve 3pool (USDT/USDC/DAI): $500,000 principal. Exiting at T+10m costs 0.25%. Pool imbalance is 62% USDT and rising about 1.3 percentage points per ten minutes; withdrawal gates start when imbalance clears 65%, after which expected exit cost is above 2.4%.\n- Aave USDT lending loop: $300,000 principal. Unwinding costs 0.40%. Health factor is 1.18; if USDT oracle marks below 0.985 after the next oracle push around T+28m, the loop can liquidate with a 7% penalty.\n- ETH perpetuals: $400,000 notional with USDC collateral. Reducing notional costs 0.15%; if stablecoin venue congestion is still unresolved near T+40m, margin buffers can gap down during the next funding update.\n- BTC spot: $200,000, unencumbered, not USDT-collateralized, and sellable at 0.10% cost.\n\nA seat started at T+10 finishes its action at T+20, then the next seat can start; therefore Curve must finish before the projected T+33 gate and Aave must finish before T+28. Direct USDT neutralized is the Curve plus Aave principal. The required margin action is a $200,000 ETH-perp reduction before T+40. Its total cost is Curve cost + Aave cost + ETH-reduction cost. Choose the sequence that meets every deadline and minimizes direct-USDT cascade risk. Output JSON fields: intent, chosen_strategy, actions, priority_order, direct_usdt_neutralized_usd, latest_direct_neutralization_min, margin_notional_reduced_usd, expected_execution_cost_usd, self_check. actions must use plain descriptions, and self_check must be an object with disclosed booleans curve_gate_beaten, aave_oracle_beaten, and margin_window_reduced_before_t40.",
    "rubric_id": "agi-AGI-008",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-009",
    "level": 11,
    "prompt": "Convert 1,000 USDC on Ethereum L1 into WLD on Optimism before a partnership announcement is fully priced in 30 minutes. The announcement premium arrives linearly from 0% to +15% over the 30 minutes; later WLD purchases therefore buy fewer tokens.\n\nSpot now: WLD Ethereum $2.40, Arbitrum $2.38, Optimism $2.42, Base $2.39.\n\nRoutes:\n- Route 1: bridge USDC to Optimism in 10 minutes, pay $8 bridge and $12 gas, then buy WLD with 0.3% slippage.\n- Route 2: buy WLD on Ethereum now with 0.1% slippage, pay $28 total gas/bridge, bridge WLD to Optimism in 10 minutes with a 0.15% token fee.\n- Route 3: bridge USDC to Arbitrum in 25 minutes, pay $15 bridge and $18 gas, buy WLD with 0.2% slippage, then use an unspecified second bridge to Optimism.\n- Route 4: bridge USDC to Base in 18 minutes, pay $5 bridge and $6 gas, buy WLD with 0.5% slippage, then use an unspecified second bridge to Optimism.\n\nFor this scenario, a purchase at minute m uses price 2.40*(1 + 0.15*m/30); percentage slippage increases that purchase price, fixed route costs are deducted before purchase, and a token bridge fee reduces delivered WLD after purchase. Searchers close cross-chain WLD spreads after 12 minutes, and any route with an unspecified second bridge is not executable for this mandate. Choose the route that maximizes WLD delivered on Optimism by minute 30. Output JSON fields: intent, chosen_strategy, chosen_path, expected_wld, completion_minutes. Describe the route in plain language; no private strategy label is required.",
    "rubric_id": "agi-AGI-009",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-010",
    "level": 11,
    "prompt": "You market-make newly listed XYZ around fair value $10.00 +/- $0.50 with $100,000 capital and 50 ms gateway latency.\n\nCompetitors:\n- FastBot: $50,000 capital, 10 ms latency, 0.1% full spreads, captures 60% of flow, cumulative PnL -$2,000.\n- WideBot: $200,000 capital, 200 ms latency, 0.5% full spreads, captures 15% of flow, cumulative PnL +$5,000.\n- ToxicBot: $30,000 capital, 30 ms latency, trades only when holding alpha, cumulative PnL +$8,000 against stale quotes.\n\nExpected daily addressable flow is $4,000,000. A defensive quote policy can capture about 12% of flow if it stays inside WideBot but outside FastBot. A toxicity filter reduces ToxicBot losses to about $600/day if it combines shock cancels, counterparty signatures, skew widening, and inventory caps. Inventory above $25,000 increases adverse-selection losses sharply because ToxicBot can force one-sided fills.\n\nFor this deterministic game, the only policy that captures 12% without a latency race is a 32-bps quoted half-spread, refreshed every 80ms, with $25,000 maximum inventory. Its gross capture is 4,000,000*0.12*0.0032 = $1,536/day; subtract $600 toxic loss and $200 inventory cost. Any tighter/latency-racing policy is loss-making; any wider policy loses the stated 12% flow. The defense must cover shock cancels, counterparty signatures, skew widening, and inventory caps, but may use ordinary language for those controls. Output JSON fields: intent, chosen_strategy, spread_bps, update_ms, max_inventory_usd, toxic_defense, expected_daily_pnl_usd.",
    "rubric_id": "agi-AGI-010",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-011",
    "level": 11,
    "prompt": "You have $375,000 deployed across SketchyDeFi: BlueChip pool $250,000, YieldFarm $105,000, and RiskyCoin $20,000. A mempool monitor detects calldata matching a known oracle-manipulation exploit likely to execute in about 60 seconds.\n\nFor this synthetic decision, the calibrated probability of a legitimate launch is 0.2% and the probability of a rug is 99.8%. If legitimate, the whole position is worth $2,355,000 at the decision horizon; if it rugs during the exploit, the platform drain takes the whole $375,000.\n\nWithdrawal mechanics: BlueChip exits in 12 seconds, YieldFarm exits in 25 seconds, RiskyCoin exits in 8 seconds. If RiskyCoin is withdrawn first in the public mempool, the attacker infers detection and drains YieldFarm before it exits. A private relay costs $600 and prevents the attacker from seeing the sequence before inclusion. Under the private relay, the required safe sequence YieldFarm -> BlueChip -> RiskyCoin completes in 45 seconds. Compute ev_withdraw as recovered principal minus relay cost and ev_stay as 0.002*2,355,000. Choose the action with the larger EV and explain why changing the sequence violates the adversarial constraint. Output JSON fields: decision, chosen_strategy, withdrawal_sequence, ev_withdraw, ev_stay.",
    "rubric_id": "agi-AGI-011",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-012",
    "level": 11,
    "prompt": "Portfolio: BTC $800,000, ETH $700,000, SOL $500,000.\n\nHistorical regimes:\n- Normal: Corr(BTC,ETH)=0.72, Corr(BTC,SOL)=0.65, Corr(ETH,SOL)=0.78; vol(BTC)=3.2%, ETH=4.1%, SOL=6.3%.\n- Crisis: Corr(BTC,ETH)=0.94, Corr(BTC,SOL)=0.93, Corr(ETH,SOL)=0.96; vol(BTC)=8.5%, ETH=11.2%, SOL=18.7%.\n- Euphoria: correlations below 0.45 with upside drift.\n\nCurrent signals at 10:00 UTC: VIX 18 -> 28, yields falling, BTC -2.1%, ETH -2.8%, SOL -4.3% over the past hour; 1h correlations are BTC/ETH 0.91, BTC/SOL 0.89, ETH/SOL 0.94. CEXs have raised margin on crowded SOL shorts after the first $350,000 notional, while BTC put spreads can be bought immediately but cost premium.\n\nUse the disclosed crisis scenario model: the portfolio's unhedged one-day VaR is $345,000; a $320,000 SOL short plus an $800,000 BTC put spread reduces crisis volatility by 53% and leaves $162,000 VaR. A larger SOL short violates the $350,000 tripwire, and a smaller BTC-put allocation leaves reduction below 50%. Those effect estimates already include option premium and covariance effects. Design and justify the hedge from the crisis signals, the correlated stress regime, the margin cap, and the tail option trade-off. Output JSON fields: intent, chosen_strategy, hedge_legs, expected_vol_reduction_pct, residual_1d_var_usd. For hedge_legs, use nested keys SOL_short.notional_usd and BTC_put_spread.notional_usd.",
    "rubric_id": "agi-AGI-012",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-013",
    "level": 11,
    "prompt": "Date: 20 December 2025. You are a U.S. taxpayer with $80,000 of realized short-term capital gains taxed at 37%.\n\nCrypto portfolio cost basis -> current value:\n- ETH: $300K -> $450K\n- SOL: $200K -> $180K\n- LINK: $150K -> $120K\n- MATIC: $150K -> $140K\n- AVAX: $200K -> $210K\n\nConstraints: stay fully invested, avoid buying back the same ticker inside 30 days, transaction cost is 0.3% per buy or sell, and replacement exposure must preserve broad beta without being substantially identical. Available replacement map: SOL -> AVAX/NEAR basket, LINK -> UNI, MATIC -> ARB. Liquidity is thinnest in LINK, then SOL, then MATIC, so an adversarial market maker widens later exits if the thinnest loss lot is left for last.\n\nConstruct the harvesting plan that maximizes after-fee tax benefit while maintaining exposure and minimizing adversarial execution cost. Output JSON fields: intent, chosen_strategy, assets_to_sell, sale_sequence, replacement_assets, net_tax_benefit, remaining_unoffset_gains.",
    "rubric_id": "agi-AGI-013",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-014",
    "level": 11,
    "prompt": "ETH spot is $3,000 and ETH perps trade at $3,018 (+0.6% premium). Open interest is at an all-time high and the long/short ratio is 82/18. Funding rates annualized: Binance 25%, Bybit 28%, OKX 22%, dYdX 18%, Hyperliquid 30%. In prior crowded episodes, funding mean-reverts within 48-72 hours and basis compresses toward +0.1%.\n\nYou have $500,000 and a 5x leverage cap, but must survive a cascade to $2,850 without forced deleveraging. Venue constraints for a resilient delta-neutral short-perp leg: Binance max $150k, Bybit max $100k, OKX max $100k, Hyperliquid max $100k because of ADL risk, dYdX max $50k because of liquidity. Stable borrow and operational drag cost 2.4% annualized. Use spot custody for the long leg.\n\nDesign the venue ladder that maximizes resilient funding-plus-basis carry without exceeding venue risk caps. Output JSON fields: intent, chosen_strategy, perp_short_allocation_usd, leverage, apr_pct, pnl_30d_usd, survives_cascade.\n\nOptimize for maximum resilient funding-plus-basis carry while remaining delta-neutral and surviving the stated cascade.",
    "rubric_id": "agi-AGI-014",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-015",
    "level": 11,
    "prompt": "Convert $2,000,000 USDC to ETH before a 90-minute announcement expected to push ETH +5-8%. You want lowest acquisition cost, but visible DEX or bridge overuse is copied by searchers after the first large route.\n\nVenues (price | fee | fixed costs | adversarial capacity before repricing):\n- Binance: $3,005 | 0.10% taker | $0 fixed | $600,000.\n- Coinbase: $3,010 | 0.15% taker | $0 fixed | $500,000.\n- Kraken: $3,000 | 0.26% taker | $0 fixed | $500,000.\n- Uniswap V3 Ethereum: $3,003 | 0.30% pool fee | $80 gas | $450,000.\n- Curve ETH: $3,004 | 0.04% fee | $120 gas | $400,000.\n- Uniswap Arbitrum: $2,998 | 0.25% fee | $14 bridge+gas | $400,000 private-intent capacity.\n- Velodrome Optimism: $2,995 | 0.20% fee | $9 bridge+gas | $400,000 private-intent capacity.\n- OTC Circle: $3,006 | 0.05% fee | $0 fixed | $250,000 before dealer fade.\n- OTC Cumberland: $3,008 | 0.08% fee | $0 fixed | $250,000 before dealer fade.\n\nTrades above an adversarial capacity incur copied-flow repricing that is worse than the next listed venue. Construct the unique allocation that minimizes total cost while completing inside the 90-minute window.\n\nOutput JSON fields: intent, chosen_strategy, venue_allocation_usd, expected_eth_received, effective_price.\n\nChoose the strategy from: [capacity_capped_best_execution, otc_first_dealer_workup, single_venue_lowest_quote_sweep, pro_rata_across_all_venues].",
    "rubric_id": "agi-AGI-015",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-021",
    "level": 11,
    "prompt": "A 2008-style credit shock proxy tape is hitting crypto beta. You hold a marked crypto proxy book with crisis beta estimates and three stress tapes. You may not sell spot.\n\nThe hedge cap allows at most two clips. Eligible clips: SOL short $210,000 notional with 31.24% crisis-beta relief; LINK short $190,000 notional with 23.56% crisis-beta relief; a smaller diversifier clip with 16.4% relief. The three stress tapes have different spot losses, so the chosen pair must be evaluated by worst residual PnL, not by beta relief alone.\n\nFor this deterministic stress simulator, only LINK then SOL is executable: sending SOL first makes the required $190,000 LINK fill unavailable. On the worst credit tape the unhedged book loses $130,000; the LINK and SOL clips respectively offset 13.0% and 18.0% of their notionals; their order-specific impacts are LINK 0.09% first and SOL 0.31% second. The other two tape losses after this pair are less severe. The diversifier cannot produce the required 50% beta reduction with either main clip. Compute residual PnL as unhedged loss + hedge offsets - impact costs, and require total beta relief >=50%. Choose the hedge basket and execution order that minimizes worst residual PnL. Output JSON fields: intent, chosen_strategy, execution_sequence, hedge_legs, risk_reduction_pct, worst_case_residual_pnl_usd. Describe the chosen basket/order in ordinary language.",
    "rubric_id": "agi-AGI-021",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-022",
    "level": 11,
    "prompt": "A March-2020 liquidation tape is hitting high-beta alt collateral. You hold a marked crypto proxy book with crisis beta estimates and three stress tapes. You may not sell spot.\n\nThe hedge cap allows at most two clips. Eligible clips: AVAX short $175,000 notional with 29.98% crisis-beta relief; MATIC short $225,000 notional with 22.62% crisis-beta relief; a smaller diversifier clip with 16.4% relief. The three stress tapes have different spot losses, so the chosen pair must be evaluated by worst residual PnL, not by beta relief alone.\n\nFor this deterministic stress simulator, only MATIC then AVAX is executable: sending AVAX first exhausts the MATIC venue's liquid window. On the worst liquidation tape the unhedged book loses $116,530; the MATIC and AVAX clips respectively offset 11.0% and 10.5% of their notionals; their order-specific impacts are MATIC 0.09% first and AVAX 0.31% second. The other two tape losses after this pair are less severe. The diversifier cannot produce the required 50% beta reduction with either main clip. Compute residual PnL as unhedged loss + hedge offsets - impact costs, and require total beta relief >=50%. Choose the hedge basket and execution order that minimizes worst residual PnL. Output JSON fields: intent, chosen_strategy, execution_sequence, hedge_legs, risk_reduction_pct, worst_case_residual_pnl_usd. Describe the chosen basket/order in ordinary language.",
    "rubric_id": "agi-AGI-022",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-023",
    "level": 11,
    "prompt": "A yen-unwind stress tape is hitting meme beta and L2 beta together. You hold a marked crypto proxy book with crisis beta estimates and three stress tapes. You may not sell spot.\n\nThe hedge cap allows at most two clips. Eligible clips: DOGE short $160,000 notional with 32.6% crisis-beta relief; ARB short $240,000 notional with 24.6% crisis-beta relief; a smaller diversifier clip with 16.4% relief. The three stress tapes have different spot losses, so the chosen pair must be evaluated by worst residual PnL, not by beta relief alone.\n\nFor this deterministic stress simulator, the feasible correlated order is ARB then DOGE. On the worst yen-unwind tape the unhedged book loses $124,400; the ARB and DOGE clips respectively offset 10.0% and 13.0% of their notionals; their order-specific impacts are ARB 0.09% first and DOGE 0.31% second. The other two tape losses after this pair are less severe. The diversifier cannot produce the required 50% beta reduction with either main clip. Compute residual PnL as unhedged loss + hedge offsets - impact costs, and require total beta relief >=50%. Choose the hedge basket and execution order that minimizes worst residual PnL. Output JSON fields: intent, chosen_strategy, execution_sequence, hedge_legs, risk_reduction_pct, worst_case_residual_pnl_usd. Describe the chosen basket/order in ordinary language.",
    "rubric_id": "agi-AGI-023",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-024",
    "level": 11,
    "prompt": "You must buy 50,000 ABC before an information event. A copy-trading bot worsens the remaining public book after it sees an aggressive parent order above 10,000 ABC, while private fills update no public footprint.\n\nRaw execution primitives:\n- Dark_RFQ can fill 15,000 ABC at $1.206 all-in if committed before T+20s; it is not visible to the copy bot.\n- Internalizer can fill 18,000 ABC at $1.2075 all-in if committed before T+45s; it is not visible to the copy bot.\n- RFQ_A can fill 10,000 ABC at $1.209 all-in if committed before T+70s; it is not visible to the copy bot.\n- A hidden public iceberg can absorb up to 7,000 ABC at $1.204 before the event. Any larger public parent becomes visible and can reprice the rest of the order.\n- Current mid is $1.2. Every committed child must finish inside the event window.\n\nDesign the execution route from these primitives. The answer must reconcile route order, venue fills, hidden-public size, all-in average price, slippage versus mid, and a self-check that the copied-flow trigger is not activated. Output JSON fields: intent, chosen_strategy, execution_sequence, venue_fills, hidden_public_qty, expected_avg_price, expected_slippage_pct, self_check.",
    "rubric_id": "agi-AGI-024",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-025",
    "level": 11,
    "prompt": "You must buy 80,000 RHO before an information event. A copy-trading bot worsens the remaining public book after it sees an aggressive parent order above 18,000 RHO, while private fills update no public footprint.\n\nRaw execution primitives:\n- CEX_Y can fill 22,000 RHO at $0.8218 all-in if committed before T+20s; it is not visible to the copy bot.\n- Dark_RFQ can fill 25,000 RHO at $0.8229 all-in if committed before T+45s; it is not visible to the copy bot.\n- RFQ_A can fill 24,000 RHO at $0.8242 all-in if committed before T+70s; it is not visible to the copy bot.\n- A hidden public iceberg can absorb up to 9,000 RHO at $0.8205 before the event. Any larger public parent becomes visible and can reprice the rest of the order.\n- Current mid is $0.819. Every committed child must finish inside the event window.\n\nDesign the execution route from these primitives. The answer must reconcile route order, venue fills, hidden-public size, all-in average price, slippage versus mid, and a self-check that the copied-flow trigger is not activated. Output JSON fields: intent, chosen_strategy, execution_sequence, venue_fills, hidden_public_qty, expected_avg_price, expected_slippage_pct, self_check.",
    "rubric_id": "agi-AGI-025",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-026",
    "level": 11,
    "prompt": "You must buy 120,000 KAP before an information event. A copy-trading bot worsens the remaining public book after it sees an aggressive parent order above 25,000 KAP, while private fills update no public footprint.\n\nRaw execution primitives:\n- Internalizer can fill 42,000 KAP at $4.925 all-in if committed before T+20s; it is not visible to the copy bot.\n- Dark_RFQ can fill 35,000 KAP at $4.931 all-in if committed before T+45s; it is not visible to the copy bot.\n- CEX_Y can fill 30,000 KAP at $4.936 all-in if committed before T+70s; it is not visible to the copy bot.\n- A hidden public iceberg can absorb up to 13,000 KAP at $4.918 before the event. Any larger public parent becomes visible and can reprice the rest of the order.\n- Current mid is $4.91. Every committed child must finish inside the event window.\n\nDesign the execution route from these primitives. The answer must reconcile route order, venue fills, hidden-public size, all-in average price, slippage versus mid, and a self-check that the copied-flow trigger is not activated. Output JSON fields: intent, chosen_strategy, execution_sequence, venue_fills, hidden_public_qty, expected_avg_price, expected_slippage_pct, self_check.",
    "rubric_id": "agi-AGI-026",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-027",
    "level": 11,
    "prompt": "You are long 80 ETH perpetual units from $3,200 at 4x leverage. Current ETH mid is $3,150; original margin was entry notional divided by leverage. A liquidation engine begins a correlated-account sweep before the next carry/funding timestamp.\n\nRaw venue primitives:\n- The risk feed classifies accounts by visible net ETH exposure at the sweep. Accounts still showing more than 55 ETH net long can be stress-marked to $3,000 before carry is paid.\n- A private hedge tunnel can reduce up to 50 ETH immediately at the current mid with 0.07% execution cost. It updates the risk feed before the sweep and does not advertise a margin top-up.\n- Visible margin additions settle after the sweep scorer snapshots the account and can be copied by liquidation searchers.\n- If the account avoids the sweep, the post-sweep mark is expected to be $3,260 and residual longs receive 0.060% funding on that mark.\n- The portfolio mandate requires preserving at least 30 ETH of upside delta if that can be done without creating a sweep-path inconsistency.\n\nUse these disclosed calculations: realized hedge PnL = hedge_units*(3,150-3,200) - hedge_units*3,150*0.0007; sweep drawdown = realized hedge PnL + residual_units*(3,000-3,200); funding-window PnL = realized hedge PnL + residual_units*(3,260-3,200) + residual_units*3,260*0.0006. A valid plan preserves at least 30 ETH, leaves visible exposure at or below 55 ETH before the sweep, and uses one internally consistent set of numbers. Output JSON fields: intent, chosen_strategy, hedge_units, net_exposure_units, worst_case_margin_drawdown_pct, funding_window_pnl_usd, self_check. self_check must be an object with disclosed boolean keys mandate_floor_met, sweep_trigger_avoided, and pnl_reconciles—not opaque labels.",
    "rubric_id": "agi-AGI-027",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-028",
    "level": 11,
    "prompt": "You are long 5,000 SOL perpetual units from $145 at 5x leverage. Current SOL mid is $142. A correlated-account sweep happens before funding. You must synthesize one policy across the sweep state and the surviving state.\n\nPublic mechanics:\n- A sweep occurs when visible net exposure is greater than 3,200 SOL; its stress mark is $132. A private hedge updates visible exposure before the sweep.\n- You may hedge 0 to 3,000 SOL immediately at $142. Hedge realized PnL is hedge_units * ($142 - $145); hedge execution cost is hedge_units * $142 * 0.0008.\n- The mandate requires residual upside exposure of at least 2,000 SOL. Choose the largest permitted hedge that avoids a sweep while meeting that mandate.\n- If the sweep is avoided, the post-sweep mark is $150 and funding credit is residual_units * $150 * 0.0009.\n- Define stress_loss_usd as hedge realized PnL + hedge execution cost + residual_units * ($132 - $145). Original margin is 5,000 * $145 / 5.\n\nReturn JSON with hedge_units, residual_units, hedge_execution_cost_usd, stress_loss_usd, stress_loss_pct_of_original_margin, post_sweep_funding_credit_usd, and rationale. Explain why the selected hedge satisfies both states. All values must come from the stated formulas.",
    "rubric_id": "agi-AGI-028",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-029",
    "level": 11,
    "prompt": "You are long 200,000 ARB perpetual units from $1.22 at 4x leverage. Current ARB mid is $1.19. A correlated-account sweep happens before funding. You must synthesize one policy across the sweep state and the surviving state.\n\nPublic mechanics:\n- A sweep occurs when visible net exposure is greater than 120,000 ARB; its stress mark is $1.08. A private hedge updates visible exposure before the sweep.\n- You may hedge 0 to 125,000 ARB immediately at $1.19. Hedge realized PnL is hedge_units * ($1.19 - $1.22); hedge execution cost is hedge_units * $1.19 * 0.001.\n- The mandate requires residual upside exposure of at least 75,000 ARB. Choose the largest permitted hedge that avoids a sweep while meeting that mandate.\n- If the sweep is avoided, the post-sweep mark is $1.25 and funding credit is residual_units * $1.25 * 0.0007.\n- Define stress_loss_usd as hedge realized PnL + hedge execution cost + residual_units * ($1.08 - $1.22). Original margin is 200,000 * $1.22 / 4.\n\nReturn JSON with hedge_units, residual_units, hedge_execution_cost_usd, stress_loss_usd, stress_loss_pct_of_original_margin, post_sweep_funding_credit_usd, and rationale. Explain why the selected hedge satisfies both states. All values must come from the stated formulas.",
    "rubric_id": "agi-AGI-029",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-030",
    "level": 11,
    "prompt": "Stable yield holdout. Allocate $100,000 for 90 days across five protocol venues with APY, tail-loss, cap, and exit-window differences.\n\nVenue signals after tail losses and hedge drag: Aave_USDC: cap 20000, net APY signal 7.04%, 48h-liquid; Curve_3pool: cap 30000, net APY signal 8.14%, 48h-liquid; Ethena_USDe: cap 20000, net APY signal 9.24%, term/slow-exit; GMX_GLP: cap 30000, net APY signal 10.34%, term/slow-exit; a fifth uncapped-looking venue has lower net APY and enters a redemption queue above $10,000. A public allocator that exceeds a fragile venue threshold is queued behind mercenary withdrawals. At least half the capital must be liquid inside 48 hours, and no allocation may use a tier that enters the adversarial queue.\n\nMaximize risk-adjusted 90-day dollars from the listed opportunity set.\n\nOutput JSON fields: intent, chosen_strategy, allocation_usd, expected_net_apy_pct, expected_90d_profit_usd, liquidity_48h_usd.",
    "rubric_id": "agi-AGI-030",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-031",
    "level": 11,
    "prompt": "Restaking yield holdout. Allocate $100,000 for 90 days across five protocol venues with APY, tail-loss, cap, and exit-window differences.\n\nVenue signals after tail losses and hedge drag: Aave_USDC: cap 25000, net APY signal 6.19%, 48h-liquid; Symbiotic_AVS: cap 20000, net APY signal 7.29%, 48h-liquid; EigenLayer_AVS: cap 25000, net APY signal 8.39%, term/slow-exit; Pendle_PT: cap 30000, net APY signal 9.49%, term/slow-exit; a fifth uncapped-looking venue has lower net APY and enters a redemption queue at any allocation. A public allocator that uses that venue is queued behind mercenary withdrawals. At least $45,000 must be liquid inside 48 hours, and no allocation may use a tier that enters the adversarial queue.\n\nMaximize risk-adjusted 90-day dollars from the listed opportunity set.\n\nOutput JSON fields: intent, chosen_strategy, allocation_usd, expected_net_apy_pct, expected_90d_profit_usd, liquidity_48h_usd.",
    "rubric_id": "agi-AGI-031",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-032",
    "level": 11,
    "prompt": "Allocate exactly $100,000 for 90 days across protocol venues while preserving crisis liquidity. This is a constrained autonomous allocation problem: choose one portfolio that maximizes expected 90-day dollars only after enforcing all liquidity, capacity, and queue constraints.\n\nPublic mechanics:\n- Aave_USDC: 5.4% APY, liquid inside 48 hours, capacity $30,000, no term loss.\n- Maple_USDC: 9.8% APY, liquid inside 48 hours, capacity $25,000, term loss expectation = 1.0% * 8.0% of allocated dollars.\n- Ethena_USDe: 16.0% APY, seven-day exit, capacity $20,000; term loss expectation = 2.5% * 50.0% of allocated dollars. Allocation above $20,000 enters an invalid public redemption queue.\n- GMX_GLP: 18.0% APY less 7.0% annualized hedge drag, five-day exit, capacity $30,000.\n- NewFarm_USD: 13.0% APY, twelve-day exit; any allocation enters an invalid public queue.\n\nFor each venue, expected_90d_dollars = allocation * APY * 90 / 365 minus stated term loss expectation. First reject any allocation that exceeds capacity, uses NewFarm, enters Ethena's queue, or leaves under $50,000 in Aave plus Maple. Among the remaining portfolios, maximize total expected_90d_dollars.\n\nReturn JSON with allocation_usd (keys Aave_USDC, Maple_USDC, Ethena_USDe, GMX_GLP, NewFarm_USD), liquidity_48h_usd, expected_90d_profit_usd, expected_net_apy_pct, queue_free, and rationale. Show the term calculation for each nonzero allocation.",
    "rubric_id": "agi-AGI-032",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-033",
    "level": 11,
    "prompt": "Move $600,000 USDC before an auction deadline in 90 minutes. A bridge exploit searcher watches public transfer graphs and focuses on the largest observable clip, while private attestation hides transfers before settlement.\n\nRaw route primitives:\n- Alpha: private-attested route, 65-minute settlement, 99.60% arrival reliability, 0.04% toll, usable clip $350,000.\n- Delta: relayer route, 40-minute settlement, 99.20% arrival reliability, 0.02% toll, usable clip $250,000.\n- Public fast lanes can be copied into a challenge path when their visible clip becomes the focal transfer.\n- Slow canonical settlement is safer in isolation but cannot repair the account after the auction starts.\n- Splits settle independently, but the account is only repaired if the planned amount is spendable before the auction.\n\nDesign the route plan, including internal checks that the selected clips arrive in time, do not create a focal public target, and reconcile expected deadweight loss with route tolls plus non-arrival risk. Output JSON fields: intent, chosen_strategy, route_allocation_usd, observable_largest_clip_usd, expected_loss_usd, expected_arrival_minutes, self_check.",
    "rubric_id": "agi-AGI-033",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-034",
    "level": 11,
    "prompt": "Move $500,000 USDC before an auction deadline in 100 minutes. A bridge exploit searcher watches public transfer graphs and focuses on the largest observable clip, while private attestation hides transfers before settlement.\n\nRaw route primitives:\n- Gamma: private-attested route, 70-minute settlement, 99.80% arrival reliability, 0.06% toll, usable clip $300,000.\n- Sigma: relayer route, 55-minute settlement, 99.50% arrival reliability, 0.02% toll, usable clip $200,000.\n- Public fast lanes can be copied into a challenge path when their visible clip becomes the focal transfer.\n- Slow canonical settlement is safer in isolation but cannot repair the account after the auction starts.\n- Splits settle independently, but the account is only repaired if the planned amount is spendable before the auction.\n\nDesign the route plan, including internal checks that the selected clips arrive in time, do not create a focal public target, and reconcile expected deadweight loss with route tolls plus non-arrival risk. Output JSON fields: intent, chosen_strategy, route_allocation_usd, observable_largest_clip_usd, expected_loss_usd, expected_arrival_minutes, self_check.",
    "rubric_id": "agi-AGI-034",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-035",
    "level": 11,
    "prompt": "Move $450,000 USDC before an auction deadline in 80 minutes. A bridge exploit searcher watches public transfer graphs and focuses on the largest observable clip, while private attestation hides transfers before settlement.\n\nRaw route primitives:\n- Alpha: private-attested route, 60-minute settlement, 99.70% arrival reliability, 0.05% toll, usable clip $250,000.\n- Sigma: relayer route, 45-minute settlement, 99.30% arrival reliability, 0.03% toll, usable clip $200,000.\n- Public fast lanes can be copied into a challenge path when their visible clip becomes the focal transfer.\n- Slow canonical settlement is safer in isolation but cannot repair the account after the auction starts.\n- Splits settle independently, but the account is only repaired if the planned amount is spendable before the auction.\n\nDesign the route plan, including internal checks that the selected clips arrive in time, do not create a focal public target, and reconcile expected deadweight loss with route tolls plus non-arrival risk. Output JSON fields: intent, chosen_strategy, route_allocation_usd, observable_largest_clip_usd, expected_loss_usd, expected_arrival_minutes, self_check.",
    "rubric_id": "agi-AGI-035",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-036",
    "level": 11,
    "prompt": "BTC recovered-flow execution. You must buy 210 BTC in 270 seconds after a toxic buy impulse. This is a contingent execution problem: complete the parent while remaining below the classifier threshold and while handling a repeated quote-refresh state.\n\nPublic mechanics:\n- Recovered sell events establish fair value F = $61,242.\n- A displayed child above 140 BTC is rejected; a hidden child of at most 35 BTC is accepted.\n- The venue refreshes one child every 45 seconds. A plan therefore needs child_count * 45 <= 270 seconds.\n- A hidden 35-BTC child with lower_limit <= $61,230 and upper_limit >= $61,250 fills: half at $61,230 and half at $61,250. Any narrower band is not guaranteed to fill.\n- On a new toxic burst, cancel the resting child and repost the same permitted band at the next 45-second refresh; this does not change the stated expected fill model.\n\nReturn JSON with child_order_units, child_count, repricing_interval_sec, lower_limit_usd, upper_limit_usd, expected_avg_price_usd, classifier_safe, repost_after_toxic_burst, and rationale. Derive every field from the public mechanics.",
    "rubric_id": "agi-AGI-036",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-037",
    "level": 11,
    "prompt": "ETH recovered-flow execution. You must buy 1,800 ETH in 270 seconds after a toxic buy impulse. This is a contingent execution problem: complete the parent while remaining below the classifier threshold and while handling a repeated quote-refresh state.\n\nPublic mechanics:\n- Recovered sell events establish fair value F = $3,420.\n- A displayed child above 1,200 ETH is rejected; a hidden child of at most 300 ETH is accepted.\n- The venue refreshes one child every 45 seconds. A plan therefore needs child_count * 45 <= 270 seconds.\n- A hidden 300-ETH child with lower_limit <= $3,412 and upper_limit >= $3,428 fills: half at $3,412 and half at $3,428. Any narrower band is not guaranteed to fill.\n- On a new toxic burst, cancel the resting child and repost the same permitted band at the next 45-second refresh; this does not change the stated expected fill model.\n\nReturn JSON with child_order_units, child_count, repricing_interval_sec, lower_limit_usd, upper_limit_usd, expected_avg_price_usd, classifier_safe, repost_after_toxic_burst, and rationale. Derive every field from the public mechanics.",
    "rubric_id": "agi-AGI-037",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-038",
    "level": 11,
    "prompt": "At 14:35:00 you must buy 30,000 SOL within ten minutes after a toxic momentum burst. Recovered sell prints establish a $146.90 fair-value anchor; the final 4,000-SOL buy to $147.22 is classified as toxic.\n\nPublic mechanics:\n- A displayed parent above 10,000 SOL is rejected. Hidden iceberg children of at most 2,500 SOL are accepted.\n- You may refresh every 45 seconds. Twelve children therefore complete in 12 * 45 = 540 seconds, inside the 600-second deadline.\n- For an accepted 2,500-SOL hidden child, a band with lower_limit <= $146.75 and upper_limit >= $146.95 fills half at each bound. A narrower band has no guaranteed fill.\n- A new toxic burst requires cancellation and reposting at the next refresh; use the same band.\n\nChoose a policy that completes the parent with minimum permitted child count and no classifier breach. Return JSON with child_order_units, child_count, repricing_interval_sec, lower_limit_usd, upper_limit_usd, expected_avg_price_usd, deadline_met, classifier_safe, repost_after_toxic_burst, and rationale.",
    "rubric_id": "agi-AGI-038",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-039",
    "level": 11,
    "prompt": "A governance vote in 24 hours changes emissions and treasury behavior. You must decide whether to pass it and retain a farming position using a 12-day, explicit flow model rather than a narrative prediction.\n\nPublic mechanics:\n- Token price is $1.00; current daily sell pressure is 54,000 tokens into $1,250,000 DEX liquidity.\n- If passed, farmer selling is 40,000 * 60% tokens/day. A delayed-unlock cohort adds 5,000 tokens/day for the first 3 of 12 days. Treasury buys $45,000 only if passed.\n- average_new_sell_pressure = farmer selling + delayed unlock * 3 / 12. daily_sell_pressure_reduction = current pressure - average_new_sell_pressure.\n- net_12d_support_usd = daily_sell_pressure_reduction * 12 * $1.00 + treasury buy. expected_price_change_pct = (2 / 3) * net_12d_support_usd / liquidity * 100.\n- Pass and retain the position iff expected_price_change_pct is positive; otherwise reject and exit.\n\nReturn JSON with vote, retain_position, average_new_sell_pressure_tokens_per_day, daily_sell_pressure_reduction_tokens_per_day, treasury_buy_usd, net_12d_support_usd, expected_price_change_pct, and rationale.",
    "rubric_id": "agi-AGI-039",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-040",
    "level": 11,
    "prompt": "A governance vote in 24 hours changes emissions and treasury behavior. You must decide whether to pass it and retain a farming position using a 12-day, explicit flow model rather than a narrative prediction.\n\nPublic mechanics:\n- Token price is $1.00; current daily sell pressure is 56,000 tokens into $1,600,000 DEX liquidity.\n- If passed, farmer selling is 35,000 * 70% tokens/day. A delayed-unlock cohort adds 4,000 tokens/day for the first 4 of 12 days. Treasury buys $30,000 only if passed.\n- average_new_sell_pressure = farmer selling + delayed unlock * 4 / 12. daily_sell_pressure_reduction = current pressure - average_new_sell_pressure.\n- net_12d_support_usd = daily_sell_pressure_reduction * 12 * $1.00 + treasury buy. expected_price_change_pct = (2 / 3) * net_12d_support_usd / liquidity * 100.\n- Pass and retain the position iff expected_price_change_pct is positive; otherwise reject and exit.\n\nReturn JSON with vote, retain_position, average_new_sell_pressure_tokens_per_day, daily_sell_pressure_reduction_tokens_per_day, treasury_buy_usd, net_12d_support_usd, expected_price_change_pct, and rationale.",
    "rubric_id": "agi-AGI-040",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-041",
    "level": 11,
    "prompt": "A governance vote in 24 hours changes emissions and treasury behavior. You must decide whether to pass it and retain a farming position using a 12-day, explicit flow model rather than a narrative prediction.\n\nPublic mechanics:\n- Token price is $1.00; current daily sell pressure is 42,000 tokens into $1,400,000 DEX liquidity.\n- If passed, farmer selling is 30,000 * 65% tokens/day. A delayed-unlock cohort adds 3,000 tokens/day for the first 6 of 12 days. Treasury buys $25,000 only if passed.\n- average_new_sell_pressure = farmer selling + delayed unlock * 6 / 12. daily_sell_pressure_reduction = current pressure - average_new_sell_pressure.\n- net_12d_support_usd = daily_sell_pressure_reduction * 12 * $1.00 + treasury buy. expected_price_change_pct = (2 / 3) * net_12d_support_usd / liquidity * 100.\n- Pass and retain the position iff expected_price_change_pct is positive; otherwise reject and exit.\n\nReturn JSON with vote, retain_position, average_new_sell_pressure_tokens_per_day, daily_sell_pressure_reduction_tokens_per_day, treasury_buy_usd, net_12d_support_usd, expected_price_change_pct, and rationale.",
    "rubric_id": "agi-AGI-041",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-042",
    "level": 11,
    "prompt": "At T+5m you have one operations seat available every ten minutes. Stablecoin market structure is changing faster than committee approval can be refreshed. Design an autonomous incident policy across timeboxed stablecoin exits and a subsequent margin state.\n\nPublic mechanics:\n- Slots begin at T+5, T+15, T+25, and T+35; a selected operation completes at the beginning of its slot.\n- Curve FRAX LP: $420,000 principal, exit cost 0.30%, invalid after its withdrawal gate at T+27.\n- Fraxlend FRAX loop: $340,000 principal, unwind cost 0.45%, invalid after its oracle/liquidation push at T+32.\n- ETH perpetuals: $600,000 notional; a half reduction is $300,000 and costs 0.12% of reduced notional. Its margin window is invalid at T+40.\n- BTC spot: $180,000, unencumbered and not stablecoin-collateralized; it is never a permitted substitute for a timeboxed stablecoin exit.\n- Policy rule: before the two stablecoin deadlines, neutralize all timeboxed stablecoin principal in deadline order; after both are safe, reduce the perpetual exposure. If a stablecoin deadline arrives before its action, record incident_failed instead of continuing with later actions.\n\nReturn JSON with lp_exited, lending_loop_unwound, perp_notional_reduced_usd, btc_held, stablecoin_principal_neutralized_usd, latest_stablecoin_exit_min, total_execution_cost_usd, incident_failed, and rationale. Explain the action sequence and fallback rule in prose.",
    "rubric_id": "agi-AGI-042",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-043",
    "level": 11,
    "prompt": "At T+4m you have one operations seat available every ten minutes. Stablecoin market structure is changing faster than committee approval can be refreshed. Design an autonomous incident policy across timeboxed stablecoin exits and a subsequent margin state.\n\nPublic mechanics:\n- Slots begin at T+4, T+14, T+24, and T+34; a selected operation completes at the beginning of its slot.\n- Aave USDT lending loop: $380,000 principal, unwind cost 0.35%, invalid after its oracle/liquidation push at T+24.\n- Curve USDT pool: $460,000 principal, exit cost 0.25%, invalid after its withdrawal gate at T+31.\n- SOL perpetuals: $500,000 notional; a half reduction is $250,000 and costs 0.18% of reduced notional. Its margin window is invalid at T+40.\n- BTC spot: $220,000, unencumbered and not stablecoin-collateralized; it is never a permitted substitute for a timeboxed stablecoin exit.\n- Policy rule: before the two stablecoin deadlines, neutralize all timeboxed stablecoin principal in deadline order; after both are safe, reduce the perpetual exposure. If a stablecoin deadline arrives before its action, record incident_failed instead of continuing with later actions.\n\nReturn JSON with lending_loop_unwound, pool_exited, perp_notional_reduced_usd, btc_held, stablecoin_principal_neutralized_usd, latest_stablecoin_exit_min, total_execution_cost_usd, incident_failed, and rationale. Explain the action sequence and fallback rule in prose.",
    "rubric_id": "agi-AGI-043",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-044",
    "level": 11,
    "prompt": "At T+2m you have one operations seat available every ten minutes. Stablecoin market structure is changing faster than committee approval can be refreshed. Design an autonomous incident policy across timeboxed stablecoin exits and a subsequent margin state.\n\nPublic mechanics:\n- Slots begin at T+2, T+12, T+22, and T+32; a selected operation completes at the beginning of its slot.\n- USDC/USDT LP: $310,000 principal, exit cost 0.22%, invalid after its withdrawal gate at T+22.\n- USDC lending loop: $520,000 principal, unwind cost 0.28%, invalid after its oracle/liquidation push at T+26.\n- AVAX perpetuals: $400,000 notional; a half reduction is $200,000 and costs 0.20% of reduced notional. Its margin window is invalid at T+34.\n- BTC spot: $160,000, unencumbered and not stablecoin-collateralized; it is never a permitted substitute for a timeboxed stablecoin exit.\n- Policy rule: before the two stablecoin deadlines, neutralize all timeboxed stablecoin principal in deadline order; after both are safe, reduce the perpetual exposure. If a stablecoin deadline arrives before its action, record incident_failed instead of continuing with later actions.\n\nReturn JSON with lp_exited, lending_loop_unwound, perp_notional_reduced_usd, btc_held, stablecoin_principal_neutralized_usd, latest_stablecoin_exit_min, total_execution_cost_usd, incident_failed, and rationale. Explain the action sequence and fallback rule in prose.",
    "rubric_id": "agi-AGI-044",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-045",
    "level": 11,
    "prompt": "Convert $2,000 USDC on Ethereum into OP spendable on Optimism before a 30-minute window closes. The policy must choose a route before execution and specify a safe fallback if the preferred route's attestation fails.\n\nPublic mechanics:\n- USDC-first route: privately attest USDC, bridge to Optimism, then swap. Fees are $18, OP spot is $2.10, destination swap slippage is 0.25%, and completion is 10 minutes if attestation succeeds.\n- If private attestation fails before T+2 minutes, cancel before source settlement and use the emergency route: swap on Ethereum at $2.16, pay $38 total fees, and bridge OP publicly in 35 minutes. It misses the window and must be reported as deadline_met=false rather than treated as success.\n- A cheap route completes in 8 minutes but ends on Base, so it fails the Optimism-spendability requirement.\n\nReturn JSON with use_usdc_first, destination_chain_satisfied, expected_tokens, completion_minutes, total_fee_usd, deadline_met, fallback_deadline_met, and rationale. Expected tokens for the preferred route are (2000 - fees) / spot * (1 - slippage).",
    "rubric_id": "agi-AGI-045",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-046",
    "level": 11,
    "prompt": "Convert $1,500 USDC on Ethereum into ARB spendable on Arbitrum before a 25-minute window closes. The policy must choose a route before execution and specify a safe fallback if the preferred route's attestation fails.\n\nPublic mechanics:\n- USDC-first route: privately attest USDC, bridge to Arbitrum, then swap. Fees are $14, ARB spot is $1.18, destination swap slippage is 0.20%, and completion is 9 minutes if attestation succeeds.\n- If private attestation fails before T+2 minutes, cancel before source settlement and use the emergency route: swap on Ethereum at $1.22, pay $43 total fees, and bridge ARB publicly in 28 minutes. It misses the window and must be reported as deadline_met=false rather than treated as success.\n- A cheap route completes in 7 minutes but ends on Optimism, so it fails the Arbitrum-spendability requirement.\n\nReturn JSON with use_usdc_first, destination_chain_satisfied, expected_tokens, completion_minutes, total_fee_usd, deadline_met, fallback_deadline_met, and rationale. Expected tokens for the preferred route are (1500 - fees) / spot * (1 - slippage).",
    "rubric_id": "agi-AGI-046",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-047",
    "level": 11,
    "prompt": "Convert $3,000 USDC on Ethereum into TKN spendable on Base before a 20-minute window closes. The policy must choose a route before execution and specify a safe fallback if the preferred route's attestation fails.\n\nPublic mechanics:\n- USDC-first route: privately attest USDC, bridge to Base, then swap. Fees are $22, TKN spot is $4.80, destination swap slippage is 0.30%, and completion is 12 minutes if attestation succeeds.\n- If private attestation fails before T+2 minutes, cancel before source settlement and use the emergency route: swap on Ethereum at $4.95, pay $57 total fees, and bridge TKN publicly in 23 minutes. It misses the window and must be reported as deadline_met=false rather than treated as success.\n- A cheap route completes in 6 minutes but ends on Arbitrum, so it fails the Base-spendability requirement.\n\nReturn JSON with use_usdc_first, destination_chain_satisfied, expected_tokens, completion_minutes, total_fee_usd, deadline_met, fallback_deadline_met, and rationale. Expected tokens for the preferred route are (3000 - fees) / spot * (1 - slippage).",
    "rubric_id": "agi-AGI-047",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-048",
    "level": 11,
    "prompt": "You quote a new listing with toxic taker flow. Build an autonomous two-state policy: quote competitively during benign flow, then cancel/reprice when an observable microstructure shock occurs.\n\nPublic mechanics:\n- Cancel round-trip latency is 45 ms. Set update_ms to twice latency so a cancel acknowledgement occurs before the next quote cycle.\n- A toxic burst moves the mark by 24 bps before stale quotes can be removed. Required half_spread_bps = toxic move + a 5-bps safety reserve, provided it remains inside the competitive 20-35 bps band.\n- Cap inventory at $22,000. If inventory reaches the cap or a toxic burst occurs, cancel both quotes and only repost after the next update cycle; otherwise keep quoting.\n- Benign one-hour turnover is $180,000. expected_1h_pnl_usd = turnover * half_spread_bps / 10,000 - $92 residual toxic drag.\n\nReturn JSON with half_spread_bps, update_ms, max_inventory_usd, expected_1h_pnl_usd, cancel_on_toxic_burst, cancel_at_inventory_cap, competitive_quote, and rationale. Explain both operating states without relying on named strategy tokens.",
    "rubric_id": "agi-AGI-048",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-049",
    "level": 11,
    "prompt": "You are quoting a new listing with toxic taker flow. Fast quotes earn queue priority but become stale during microstructure shocks; overly wide quotes lose the benign flow needed to hedge inventory.\n\nRaw primitives:\n- Your measured cancel latency is 40 ms. Cancels submitted faster than the round-trip latency can leave stale quotes active during toxic bursts.\n- Toxic bursts have recently moved the mark by about 19 bps before stale quotes could be removed.\n- Benign flow remains competitive for defensive half-spreads in the 20-32 bps range; outside that band, queue position decays sharply.\n- The hedge desk can warehouse about $18,000 before inventory skew becomes nonlinear.\n- Expected benign one-hour turnover at a defensible quote is $160,000; residual toxic-selection drag after filters is about $70.\n\nDesign the defensive market-making policy. The answer must reconcile spread, update cadence, inventory cap, expected PnL, toxic defenses, and self-check from one plan. Output JSON fields: intent, chosen_strategy, half_spread_bps, update_ms, max_inventory_usd, expected_1h_pnl_usd, toxic_defense, self_check.\n\nChoose the strategy from: [passive_midpoint_market_making, selective_wide_defensive_quoting, unbounded_inventory_capture, ultra_tight_queue_priority].",
    "rubric_id": "agi-AGI-049",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-050",
    "level": 11,
    "prompt": "You are quoting a new listing with toxic taker flow. Fast quotes earn queue priority but become stale during microstructure shocks; overly wide quotes lose the benign flow needed to hedge inventory.\n\nRaw primitives:\n- Your measured cancel latency is 55 ms. Cancels submitted faster than the round-trip latency can leave stale quotes active during toxic bursts.\n- Toxic bursts have recently moved the mark by about 31 bps before stale quotes could be removed.\n- Benign flow remains competitive for defensive half-spreads in the 24-35 bps range; outside that band, queue position decays sharply.\n- The hedge desk can warehouse about $30,000 before inventory skew becomes nonlinear.\n- Expected benign one-hour turnover at a defensible quote is $210,000; residual toxic-selection drag after filters is about $120.\n\nDesign the defensive market-making policy. The answer must reconcile spread, update cadence, inventory cap, expected PnL, toxic defenses, and self-check from one plan. Output JSON fields: intent, chosen_strategy, half_spread_bps, update_ms, max_inventory_usd, expected_1h_pnl_usd, toxic_defense, self_check.\n\nChoose the strategy from: [maximum_turnover_quoting, toxic_flow_internalization, tight_spread_latency_race, selective_wide_defensive_quoting].",
    "rubric_id": "agi-AGI-050",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-051",
    "level": 11,
    "prompt": "You hold $300,000 in a venue after an exploit rumor. The exit window is sequential: public flow shown first can cancel the private bid, while private execution first does not reveal the remaining slice until the bid is gone.\n\nRaw primitives:\n- otc_block can absorb $180,000 at 99.2% of mark if used before visible flow.\n- dex_twap can absorb $120,000 at 98.5% of mark after the private clip.\n- If the position is kept, the venue either recovers to $420,000 with 45% probability or is worth zero after the event.\n- The mandate is to preserve capital while avoiding a sequence that invalidates its own private liquidity.\n\nDesign the exit-or-stay strategy and reconcile decision, sequence, private/public proceeds, expected exit value, expected stay value, and self-check. Output JSON fields: intent, decision, chosen_strategy, exit_sequence, private_sale_usd, expected_exit_value_usd, expected_stay_value_usd, self_check.",
    "rubric_id": "agi-AGI-051",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-052",
    "level": 11,
    "prompt": "You hold $500,000 in a venue after an exploit rumor. The exit window is sequential: public flow shown first can cancel the private bid, while private execution first does not reveal the remaining slice until the bid is gone.\n\nRaw primitives:\n- rfq_block can absorb $300,000 at 99.1% of mark if used before visible flow.\n- cex_twap can absorb $200,000 at 98.2% of mark after the private clip.\n- If the position is kept, the venue either recovers to $650,000 with 35% probability or is worth zero after the event.\n- The mandate is to preserve capital while avoiding a sequence that invalidates its own private liquidity.\n\nDesign the exit-or-stay strategy and reconcile decision, sequence, private/public proceeds, expected exit value, expected stay value, and self-check. Output JSON fields: intent, decision, chosen_strategy, exit_sequence, private_sale_usd, expected_exit_value_usd, expected_stay_value_usd, self_check.",
    "rubric_id": "agi-AGI-052",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-053",
    "level": 11,
    "prompt": "You hold $150,000 in a venue after an exploit rumor. The exit window is sequential: public flow shown first can cancel the private bid, while private execution first does not reveal the remaining slice until the bid is gone.\n\nRaw primitives:\n- private_mm can absorb $100,000 at 99.3% of mark if used before visible flow.\n- dex_slice can absorb $50,000 at 98.4% of mark after the private clip.\n- If the position is kept, the venue either recovers to $600,000 with 20% probability or is worth zero after the event.\n- The mandate is to preserve capital while avoiding a sequence that invalidates its own private liquidity.\n\nDesign the exit-or-stay strategy and reconcile decision, sequence, private/public proceeds, expected exit value, expected stay value, and self-check. Output JSON fields: intent, decision, chosen_strategy, exit_sequence, private_sale_usd, expected_exit_value_usd, expected_stay_value_usd, self_check.",
    "rubric_id": "agi-AGI-053",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-054",
    "level": 11,
    "prompt": "SOL crisis hedge. A multi-asset portfolio has shifted from normal correlations to crisis correlations while all assets sell off together. Spot cannot be sold because it is pledged to client custody attestations.\n\nRaw hedge primitives:\n- SOL is the largest marginal crisis-vol contributor, but dealer margin jumps if displayed SOL short notional exceeds $310,000.\n- BTC put-spread convexity is available up to $750,000 notional and offsets the common crash tape without adding short-crowding exposure.\n- ETH short liquidity is available, but in this tape it leaves a larger residual tail because the dealer reprices it after seeing SOL demand.\n- The risk committee needs roughly half the one-day VaR removed without tripping the crowding margin rule.\n\nDesign the crisis hedge composition. The answer must reconcile selected legs, notionals, expected vol reduction, residual one-day VaR, and self-check from the same plan. Output JSON fields: intent, chosen_strategy, hedge_legs, expected_vol_reduction_pct, residual_1d_var_usd, self_check.",
    "rubric_id": "agi-AGI-054",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-055",
    "level": 11,
    "prompt": "ETH crisis hedge. A multi-asset portfolio has shifted from normal correlations to crisis correlations while all assets sell off together.\n\nThe largest marginal vol contributor can be hedged, but a crowding tripwire raises margin if the short exceeds the stated threshold. Convex protection on the anchor asset is available at known premium. Candidate hedges include ETH short up to 360000 before the tripwire, BTC put-spread convexity up to 700000, and proportional spot sales that violate the no-sale constraint.\n\nDesign the hedge that cuts crisis-regime volatility by roughly half without selling spot or tripping the crowding threshold.\n\nOutput JSON fields: intent, chosen_strategy, hedge_legs, expected_vol_reduction_pct, residual_1d_var_usd.",
    "rubric_id": "agi-AGI-055",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-056",
    "level": 11,
    "prompt": "BTC crisis hedge. A multi-asset portfolio has shifted from normal correlations to crisis correlations while all assets sell off together.\n\nThe largest marginal vol contributor can be hedged, but a crowding tripwire raises margin if the short exceeds the stated threshold. Convex protection on the anchor asset is available at known premium. Candidate hedges include BTC short up to 420000 before the tripwire, ETH put-spread convexity up to 650000, and proportional spot sales that violate the no-sale constraint.\n\nDesign the hedge that cuts crisis-regime volatility by roughly half without selling spot or tripping the crowding threshold.\n\nOutput JSON fields: intent, chosen_strategy, hedge_legs, expected_vol_reduction_pct, residual_1d_var_usd.",
    "rubric_id": "agi-AGI-056",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-057",
    "level": 11,
    "prompt": "A taxpayer has $70,000 of realized short-term gains and several crypto lots with losses. They must stay fully invested without buying the same ticker inside 30 days. A market maker widens later exits if the thinnest loss lot is left until after deeper lots have traded.\n\nRaw lot primitives:\n- LINK: unrealized loss $22,000, current value $110,000, exit-depth score 1.1, replacement basket LST_beta_basket.\n- ARB: unrealized loss $15,000, current value $90,000, exit-depth score 1.8, replacement basket OP_IMX_basket.\n- SOL: unrealized loss $18,000, current value $160,000, exit-depth score 4, replacement basket JTO_PYTH_basket.\n- Short-term tax rate is 37%; round-trip cost on sold notional is 0.60%.\n- Replacement baskets preserve broad beta but are not identical tickers.\n\nDesign the harvest strategy. The answer must reconcile selected lots, sale sequence, replacements, net tax benefit, remaining unoffset gains, and self-check. Output JSON fields: intent, chosen_strategy, assets_to_sell, sale_sequence, replacement_assets, net_tax_benefit, remaining_unoffset_gains, self_check.",
    "rubric_id": "agi-AGI-057",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-058",
    "level": 11,
    "prompt": "A taxpayer has $60,000 of realized short-term gains and several crypto lots with losses. They must stay fully invested without buying the same ticker inside 30 days. A market maker widens later exits if the thinnest loss lot is left until after deeper lots have traded.\n\nRaw lot primitives:\n- DOGE: unrealized loss $20,000, current value $60,000, exit-depth score 0.6, replacement basket MEME_largecap_basket.\n- OP: unrealized loss $12,000, current value $80,000, exit-depth score 0.9, replacement basket ARB_IMX_basket.\n- AVAX: unrealized loss $16,000, current value $140,000, exit-depth score 2.5, replacement basket TIA_ATOM_basket.\n- Short-term tax rate is 37%; round-trip cost on sold notional is 0.60%.\n- Replacement baskets preserve broad beta but are not identical tickers.\n\nDesign the harvest strategy. The answer must reconcile selected lots, sale sequence, replacements, net tax benefit, remaining unoffset gains, and self-check. Output JSON fields: intent, chosen_strategy, assets_to_sell, sale_sequence, replacement_assets, net_tax_benefit, remaining_unoffset_gains, self_check.",
    "rubric_id": "agi-AGI-058",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-059",
    "level": 11,
    "prompt": "A taxpayer has $95,000 of realized short-term gains and several crypto lots with losses. They must stay fully invested without buying the same ticker inside 30 days. A market maker widens later exits if the thinnest loss lot is left until after deeper lots have traded.\n\nRaw lot primitives:\n- FTM: unrealized loss $18,000, current value $70,000, exit-depth score 0.7, replacement basket L1_alt_basket.\n- MATIC: unrealized loss $25,000, current value $130,000, exit-depth score 1.3, replacement basket ARB_OP_basket.\n- UNI: unrealized loss $30,000, current value $150,000, exit-depth score 2.1, replacement basket AAVE_COMP_basket.\n- Short-term tax rate is 37%; round-trip cost on sold notional is 0.60%.\n- Replacement baskets preserve broad beta but are not identical tickers.\n\nDesign the harvest strategy. The answer must reconcile selected lots, sale sequence, replacements, net tax benefit, remaining unoffset gains, and self-check. Output JSON fields: intent, chosen_strategy, assets_to_sell, sale_sequence, replacement_assets, net_tax_benefit, remaining_unoffset_gains, self_check.",
    "rubric_id": "agi-AGI-059",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-060",
    "level": 11,
    "prompt": "ETH spot/perp basis is elevated and funding is crowded. You have spot custody for the long leg and must build a 1x delta-neutral short ladder that survives an exchange cascade without forced deleveraging.\n\nRaw venue primitives:\n- Binance: resilient displayed short capacity $150,000; current net carry 32% APR.\n- Hyperliquid: resilient displayed short capacity $100,000; current net carry 31% APR.\n- Bybit: resilient displayed short capacity $100,000; current net carry 29% APR.\n- OKX: resilient displayed short capacity $100,000; current net carry 26% APR.\n- dYdX: resilient displayed short capacity $50,000; current net carry 22% APR.\n- Stable borrow and operational drag are already reflected in net carry. The spot custodian supports exactly $500,000 of matched long exposure without rehypothecation.\n\nFor this synthetic cascade model, use every resilient capacity exactly to reach the matched $500,000 total; any allocation above a venue capacity fails the cascade condition. Weighted APR is sum(venue_notional*venue_APR)/500,000, 30-day PnL is 500,000*APR*30/365, leverage is total short/total spot, and the diversified-at-capacity ladder has an 18% cascade buffer. A plan is a survivor only if it is 1x delta-neutral, uses no venue above capacity, and reports the stated buffer. Output JSON fields: intent, chosen_strategy, perp_short_allocation_usd, leverage, apr_pct, pnl_30d_usd, cascade_buffer_pct, survives_cascade, self_check. self_check must be an object with disclosed booleans venue_caps_not_breached, delta_neutral_notional_reconciles, and apr_and_pnl_reconcile.",
    "rubric_id": "agi-AGI-060",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-061",
    "level": 11,
    "prompt": "SOL spot/perp basis is elevated and funding is crowded. You have spot custody for the long leg and must build a 1x delta-neutral short ladder that survives an exchange cascade without forced deleveraging.\n\nRaw venue primitives:\n- Binance: resilient displayed short capacity $120,000; current net carry 34% APR.\n- Bybit: resilient displayed short capacity $120,000; current net carry 32% APR.\n- OKX: resilient displayed short capacity $110,000; current net carry 30% APR.\n- Hyperliquid: resilient displayed short capacity $90,000; current net carry 31% APR.\n- dYdX: resilient displayed short capacity $60,000; current net carry 24% APR.\n- Stable borrow and operational drag are already reflected in net carry. The spot custodian supports exactly $500,000 of matched long exposure without rehypothecation.\n\nFor this synthetic cascade model, use every resilient capacity exactly to reach the matched $500,000 total; any allocation above a venue capacity fails the cascade condition. Weighted APR is sum(venue_notional*venue_APR)/500,000, 30-day PnL is 500,000*APR*30/365, leverage is total short/total spot, and the diversified-at-capacity ladder has a 16% cascade buffer. A plan is a survivor only if it is 1x delta-neutral, uses no venue above capacity, and reports the stated buffer. Output JSON fields: intent, chosen_strategy, perp_short_allocation_usd, leverage, apr_pct, pnl_30d_usd, cascade_buffer_pct, survives_cascade, self_check. self_check must be an object with disclosed booleans venue_caps_not_breached, delta_neutral_notional_reconciles, and apr_and_pnl_reconcile.",
    "rubric_id": "agi-AGI-061",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-062",
    "level": 11,
    "prompt": "BTC spot/perp basis is elevated and funding is crowded. You have spot custody for the long leg and must build a 1x delta-neutral short ladder that survives an exchange cascade without forced deleveraging.\n\nRaw venue primitives:\n- Binance: resilient displayed short capacity $180,000; current net carry 26% APR.\n- OKX: resilient displayed short capacity $100,000; current net carry 24% APR.\n- Bybit: resilient displayed short capacity $90,000; current net carry 23% APR.\n- Hyperliquid: resilient displayed short capacity $80,000; current net carry 25% APR.\n- dYdX: resilient displayed short capacity $50,000; current net carry 19% APR.\n- Stable borrow and operational drag are already reflected in net carry. The spot custodian supports exactly $500,000 of matched long exposure without rehypothecation.\n\nFor this synthetic cascade model, use every resilient capacity exactly to reach the matched $500,000 total; any allocation above a venue capacity fails the cascade condition. Weighted APR is sum(venue_notional*venue_APR)/500,000, 30-day PnL is 500,000*APR*30/365, leverage is total short/total spot, and the diversified-at-capacity ladder has a 20% cascade buffer. A plan is a survivor only if it is 1x delta-neutral, uses no venue above capacity, and reports the stated buffer. Output JSON fields: intent, chosen_strategy, perp_short_allocation_usd, leverage, apr_pct, pnl_30d_usd, cascade_buffer_pct, survives_cascade, self_check. self_check must be an object with disclosed booleans venue_caps_not_breached, delta_neutral_notional_reconciles, and apr_and_pnl_reconcile.",
    "rubric_id": "agi-AGI-062",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-063",
    "level": 11,
    "prompt": "Convert $2,000,000 USDC into ETH before an announcement window. Visible overuse of any route is copied by searchers and repriced worse than the next venue; private/OTC routes do not create a public pre-fill graph.\n\nRaw venue primitives:\n- Kraken: usable clip $500,000, quoted price $2992, fee 0.07%, fixed cost $40, publicly visible before completion.\n- Uniswap_Arbitrum: usable clip $450,000, quoted price $2996, fee 0.10%, fixed cost $120, private before completion.\n- Curve_ETH: usable clip $400,000, quoted price $2998, fee 0.08%, fixed cost $90, private before completion.\n- Binance: usable clip $350,000, quoted price $3001, fee 0.06%, fixed cost $30, publicly visible before completion.\n- Velodrome_Optimism: usable clip $300,000, quoted price $3004, fee 0.12%, fixed cost $80, private before completion.\n- Fixed costs are deducted before percentage fees.\n- The route plan must complete the full notional without creating an observable clip larger than the public route can absorb before copy-trading reprices it.\n\nDesign the acquisition route. The answer must reconcile venue allocation, largest visible clip, asset received, effective price, and self-check from one plan. Output JSON fields: intent, chosen_strategy, venue_allocation_usd, largest_visible_clip_usd, expected_asset_received, effective_price, self_check.",
    "rubric_id": "agi-AGI-063",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-064",
    "level": 11,
    "prompt": "Convert $2,000,000 USDC into BTC before an announcement window. Visible overuse of any route is copied by searchers and repriced worse than the next venue; private/OTC routes do not create a public pre-fill graph.\n\nRaw venue primitives:\n- Binance: usable clip $600,000, quoted price $59880, fee 0.05%, fixed cost $35, publicly visible before completion.\n- Kraken: usable clip $500,000, quoted price $59940, fee 0.06%, fixed cost $40, publicly visible before completion.\n- Coinbase: usable clip $300,000, quoted price $60020, fee 0.08%, fixed cost $30, publicly visible before completion.\n- Curve_BTC: usable clip $300,000, quoted price $60060, fee 0.10%, fixed cost $100, private before completion.\n- OTC_Circle: usable clip $300,000, quoted price $60120, fee 0.04%, fixed cost $20, publicly visible before completion.\n- Fixed costs are deducted before percentage fees.\n- The route plan must complete the full notional without creating an observable clip larger than the public route can absorb before copy-trading reprices it.\n\nDesign the acquisition route. The answer must reconcile venue allocation, largest visible clip, asset received, effective price, and self-check from one plan. Output JSON fields: intent, chosen_strategy, venue_allocation_usd, largest_visible_clip_usd, expected_asset_received, effective_price, self_check.",
    "rubric_id": "agi-AGI-064",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-065",
    "level": 11,
    "prompt": "Convert $2,000,000 USDC into SOL before an announcement window. Visible overuse of any route is copied by searchers and repriced worse than the next venue; private/OTC routes do not create a public pre-fill graph.\n\nRaw venue primitives:\n- Binance: usable clip $550,000, quoted price $149.7, fee 0.06%, fixed cost $30, publicly visible before completion.\n- Jupiter_Solana: usable clip $450,000, quoted price $149.8, fee 0.10%, fixed cost $80, private before completion.\n- Uniswap_Arbitrum: usable clip $350,000, quoted price $150, fee 0.12%, fixed cost $100, private before completion.\n- OTC_Circle: usable clip $350,000, quoted price $150.15, fee 0.04%, fixed cost $20, publicly visible before completion.\n- Coinbase: usable clip $300,000, quoted price $150.25, fee 0.08%, fixed cost $30, publicly visible before completion.\n- Fixed costs are deducted before percentage fees.\n- The route plan must complete the full notional without creating an observable clip larger than the public route can absorb before copy-trading reprices it.\n\nDesign the acquisition route. The answer must reconcile venue allocation, largest visible clip, asset received, effective price, and self-check from one plan. Output JSON fields: intent, chosen_strategy, venue_allocation_usd, largest_visible_clip_usd, expected_asset_received, effective_price, self_check.",
    "rubric_id": "agi-AGI-065",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-066",
    "level": 11,
    "prompt": "On 2026-02-03, you manage a marked crypto book during a cross-venue margin event. The desk cannot sell spot for 30 minutes, but it can execute at most $620,000 gross notional of immediately available perp hedge clips. The first visible clip is copied by basis desks, so the impact cost of each later clip uses its after-first rate.\n\nSpot book:\n- BTC: 7 units @ $68,400, crisis beta 1.00\n- ETH: 95 units @ $3,720, crisis beta 1.16\n- TIA: 24,000 units @ $8.4, crisis beta 1.58\n- NEAR: 52,000 units @ $5.2, crisis beta 1.44\n- ARB: 150,000 units @ $1.22, crisis beta 1.36\n\nOne-hour stress tapes:\n- KRW funding shock: BTC -6.40%, ETH -8.10%, TIA -14.20%, NEAR -12.80%, ARB -11.90%\n- ETF squeeze: BTC 8.30%, ETH 7.10%, TIA 12.20%, NEAR 10.50%, ARB 9.70%\n- yen VaR unwind: BTC -11.10%, ETH -13.90%, TIA -20.50%, NEAR -18.40%, ARB -17.10%\n\nAvailable hedge clips:\n- TIA_short: $210,000 notional, beta 1.58, impact 0.10% if first and 0.21% if after another clip\n- NEAR_short: $260,000 notional, beta 1.44, impact 0.08% if first and 0.20% if after another clip\n- ARB_short: $170,000 notional, beta 1.36, impact 0.09% if first and 0.18% if after another clip\n\nDesign the hedge basket and execution order that preserves the strongest worst-case residual PnL across the stress tapes while cutting crisis beta-dollar exposure by at least 37.77%. The answer must reconcile the order, hedge_notional_usd, crisis_beta_reduction_pct, worst_case_residual_pnl_usd, and self_check from the same plan. Output JSON fields: intent, chosen_strategy, execution_sequence, hedge_notional_usd, crisis_beta_reduction_pct, worst_case_residual_pnl_usd, self_check.",
    "rubric_id": "agi-AGI-066",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-067",
    "level": 11,
    "prompt": "On 2026-03-19, you manage a marked crypto book during a cross-venue margin event. The desk cannot sell spot for 30 minutes, but it can execute at most $760,000 gross notional of immediately available perp hedge clips. The first visible clip is copied by basis desks, so the impact cost of each later clip uses its after-first rate.\n\nSpot book:\n- BTC: 9 units @ $72,100, crisis beta 1.00\n- ETH: 120 units @ $3,880, crisis beta 1.12\n- SUI: 90,000 units @ $3.15, crisis beta 1.64\n- SEI: 210,000 units @ $0.88, crisis beta 1.52\n- OP: 85,000 units @ $2.45, crisis beta 1.31\n\nOne-hour stress tapes:\n- custody downgrade: BTC -5.20%, ETH -7.40%, SUI -16.10%, SEI -14.90%, OP -12.40%\n- short squeeze: BTC 6.10%, ETH 8.20%, SUI 14.30%, SEI 12.10%, OP 10.30%\n- Asia deleveraging: BTC -9.30%, ETH -11.80%, SUI -21.40%, SEI -19.80%, OP -16.60%\n\nAvailable hedge clips:\n- SUI_short: $280,000 notional, beta 1.64, impact 0.09% if first and 0.22% if after another clip\n- SEI_short: $240,000 notional, beta 1.52, impact 0.11% if first and 0.24% if after another clip\n- OP_short: $190,000 notional, beta 1.31, impact 0.08% if first and 0.17% if after another clip\n\nDesign the hedge basket and execution order that preserves the strongest worst-case residual PnL across the stress tapes while cutting crisis beta-dollar exposure by at least 48.51%. The answer must reconcile the order, hedge_notional_usd, crisis_beta_reduction_pct, worst_case_residual_pnl_usd, and self_check from the same plan. Output JSON fields: intent, chosen_strategy, execution_sequence, hedge_notional_usd, crisis_beta_reduction_pct, worst_case_residual_pnl_usd, self_check.",
    "rubric_id": "agi-AGI-067",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-068",
    "level": 11,
    "prompt": "On 2026-04-08, you manage a marked crypto book during a cross-venue margin event. The desk cannot sell spot for 30 minutes, but it can execute at most $690,000 gross notional of immediately available perp hedge clips. The first visible clip is copied by basis desks, so the impact cost of each later clip uses its after-first rate.\n\nSpot book:\n- BTC: 6 units @ $74,800, crisis beta 1.00\n- ETH: 105 units @ $4,040, crisis beta 1.14\n- INJ: 13,500 units @ $31.5, crisis beta 1.69\n- JTO: 62,000 units @ $4.25, crisis beta 1.47\n- PYTH: 410,000 units @ $0.56, crisis beta 1.33\n\nOne-hour stress tapes:\n- reserve audit fail: BTC -7.10%, ETH -9.60%, INJ -18.80%, JTO -15.30%, PYTH -13.90%\n- relief auction: BTC 5.20%, ETH 7.30%, INJ 12.90%, JTO 11.80%, PYTH 9.50%\n- basis unwind: BTC -10.20%, ETH -13.10%, INJ -23.10%, JTO -19.60%, PYTH -16.80%\n\nAvailable hedge clips:\n- INJ_short: $310,000 notional, beta 1.69, impact 0.12% if first and 0.25% if after another clip\n- JTO_short: $230,000 notional, beta 1.47, impact 0.08% if first and 0.19% if after another clip\n- PYTH_short: $150,000 notional, beta 1.33, impact 0.09% if first and 0.17% if after another clip\n\nDesign the hedge basket and execution order that preserves the strongest worst-case residual PnL across the stress tapes while cutting crisis beta-dollar exposure by at least 44.79%. The answer must reconcile the order, hedge_notional_usd, crisis_beta_reduction_pct, worst_case_residual_pnl_usd, and self_check from the same plan. Output JSON fields: intent, chosen_strategy, execution_sequence, hedge_notional_usd, crisis_beta_reduction_pct, worst_case_residual_pnl_usd, self_check.",
    "rubric_id": "agi-AGI-068",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-069",
    "level": 11,
    "prompt": "On 2026-04-26, you manage a marked crypto book during a cross-venue margin event. The desk cannot sell spot for 30 minutes, but it can execute at most $710,000 gross notional of immediately available perp hedge clips. The first visible clip is copied by basis desks, so the impact cost of each later clip uses its after-first rate.\n\nSpot book:\n- BTC: 8 units @ $69,450, crisis beta 1.00\n- ETH: 88 units @ $3,660, crisis beta 1.18\n- APT: 46,000 units @ $8.15, crisis beta 1.57\n- WIF: 120,000 units @ $2.1, crisis beta 1.71\n- LINK: 21,000 units @ $19.6, crisis beta 1.05\n\nOne-hour stress tapes:\n- ADL print: BTC -8.30%, ETH -10.90%, APT -17.40%, WIF -22.60%, LINK -12.10%\n- ETF headline: BTC 9.10%, ETH 7.80%, APT 13.20%, WIF 18.80%, LINK 7.20%\n- cross-margin sweep: BTC -12.40%, ETH -15.10%, APT -23.70%, WIF -28.10%, LINK -16.20%\n\nAvailable hedge clips:\n- APT_short: $250,000 notional, beta 1.57, impact 0.10% if first and 0.20% if after another clip\n- WIF_short: $220,000 notional, beta 1.71, impact 0.14% if first and 0.28% if after another clip\n- LINK_short: $240,000 notional, beta 1.05, impact 0.07% if first and 0.15% if after another clip\n\nDesign the hedge basket and execution order that preserves the strongest worst-case residual PnL across the stress tapes while cutting crisis beta-dollar exposure by at least 42.25%. The answer must reconcile the order, hedge_notional_usd, crisis_beta_reduction_pct, worst_case_residual_pnl_usd, and self_check from the same plan. Output JSON fields: intent, chosen_strategy, execution_sequence, hedge_notional_usd, crisis_beta_reduction_pct, worst_case_residual_pnl_usd, self_check.",
    "rubric_id": "agi-AGI-069",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-070",
    "level": 11,
    "prompt": "A reserve rumor has pushed USDT to $0.98 and public stablecoin exit flow is being copied by liquidation searchers. You hold 1,800,000 USDT. Visible exits larger than 620,000 units join an adversarial queue and suffer a later refresh; private exits do not. Treasury needs at least $1,050,000 cash-equivalent recovery inside the first 18 minutes if that can be achieved without entering the queue.\n\nExit primitives:\n- CEX_USDC: capacity 760,000 USDT, recovery $1 per unit before fee, fee 0.08%, cash timing 12 minutes, publicly visible\n- Curve_3pool: capacity 520,000 USDT, recovery $0.99 per unit before fee, fee 0.10%, cash timing 18 minutes, publicly visible\n- OTC_Tether: capacity 480,000 USDT, recovery $0.99 per unit before fee, fee 0.04%, cash timing 45 minutes, private\n- Aave_repay: capacity 300,000 USDT, recovery $1 per unit before fee, fee 0.00%, cash timing 35 minutes, private\n- DEX_thin: capacity 260,000 USDT, recovery $0.98 per unit before fee, fee 0.14%, cash timing 9 minutes, publicly visible\n\nDesign the exit rotation that preserves the most recovered value while satisfying the fast-cash requirement and avoiding copied-flow queue exposure. The answer must reconcile exit_allocation_units, expected_recovered_usd, fast_cash_usd, largest_visible_exit_units, and self_check from one plan. Output JSON fields: intent, chosen_strategy, exit_allocation_units, expected_recovered_usd, fast_cash_usd, largest_visible_exit_units, self_check.",
    "rubric_id": "agi-AGI-070",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-071",
    "level": 11,
    "prompt": "A reserve rumor has pushed FDUSD to $0.98 and public stablecoin exit flow is being copied by liquidation searchers. You hold 1,250,000 FDUSD. Visible exits larger than 460,000 units join an adversarial queue and suffer a later refresh; private exits do not. Treasury needs at least $780,000 cash-equivalent recovery inside the first 18 minutes if that can be achieved without entering the queue.\n\nExit primitives:\n- Binance_convert: capacity 520,000 FDUSD, recovery $1 per unit before fee, fee 0.05%, cash timing 8 minutes, publicly visible\n- OTC_Asia: capacity 420,000 FDUSD, recovery $0.99 per unit before fee, fee 0.03%, cash timing 40 minutes, private\n- Curve_stables: capacity 360,000 FDUSD, recovery $0.99 per unit before fee, fee 0.11%, cash timing 20 minutes, publicly visible\n- Aave_loop_close: capacity 250,000 FDUSD, recovery $1 per unit before fee, fee 0.00%, cash timing 32 minutes, private\n- DEX_BSC: capacity 210,000 FDUSD, recovery $0.98 per unit before fee, fee 0.15%, cash timing 11 minutes, publicly visible\n\nDesign the exit rotation that preserves the most recovered value while satisfying the fast-cash requirement and avoiding copied-flow queue exposure. The answer must reconcile exit_allocation_units, expected_recovered_usd, fast_cash_usd, largest_visible_exit_units, and self_check from one plan. Output JSON fields: intent, chosen_strategy, exit_allocation_units, expected_recovered_usd, fast_cash_usd, largest_visible_exit_units, self_check.",
    "rubric_id": "agi-AGI-071",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-072",
    "level": 11,
    "prompt": "A reserve rumor has pushed USDe to $0.97 and public stablecoin exit flow is being copied by liquidation searchers. You hold 1,600,000 USDe. Visible exits larger than 500,000 units join an adversarial queue and suffer a later refresh; private exits do not. Treasury needs at least $900,000 cash-equivalent recovery inside the first 18 minutes if that can be achieved without entering the queue.\n\nExit primitives:\n- Ethena_redeem: capacity 430,000 USDe, recovery $1 per unit before fee, fee 0.02%, cash timing 55 minutes, private\n- CEX_USDC: capacity 520,000 USDe, recovery $0.99 per unit before fee, fee 0.08%, cash timing 12 minutes, publicly visible\n- Curve_USDe: capacity 450,000 USDe, recovery $0.98 per unit before fee, fee 0.13%, cash timing 18 minutes, publicly visible\n- OTC_block: capacity 380,000 USDe, recovery $0.99 per unit before fee, fee 0.04%, cash timing 42 minutes, private\n- DEX_thin: capacity 260,000 USDe, recovery $0.97 per unit before fee, fee 0.18%, cash timing 10 minutes, publicly visible\n\nDesign the exit rotation that preserves the most recovered value while satisfying the fast-cash requirement and avoiding copied-flow queue exposure. The answer must reconcile exit_allocation_units, expected_recovered_usd, fast_cash_usd, largest_visible_exit_units, and self_check from one plan. Output JSON fields: intent, chosen_strategy, exit_allocation_units, expected_recovered_usd, fast_cash_usd, largest_visible_exit_units, self_check.",
    "rubric_id": "agi-AGI-072",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-073",
    "level": 11,
    "prompt": "A reserve rumor has pushed TUSD to $0.97 and public stablecoin exit flow is being copied by liquidation searchers. You hold 1,100,000 TUSD. Visible exits larger than 350,000 units join an adversarial queue and suffer a later refresh; private exits do not. Treasury needs at least $660,000 cash-equivalent recovery inside the first 18 minutes if that can be achieved without entering the queue.\n\nExit primitives:\n- CEX_convert: capacity 390,000 TUSD, recovery $0.99 per unit before fee, fee 0.07%, cash timing 10 minutes, publicly visible\n- OTC_issuer: capacity 330,000 TUSD, recovery $0.99 per unit before fee, fee 0.03%, cash timing 50 minutes, private\n- Curve_legacy: capacity 280,000 TUSD, recovery $0.99 per unit before fee, fee 0.12%, cash timing 21 minutes, publicly visible\n- Aave_close: capacity 220,000 TUSD, recovery $1 per unit before fee, fee 0.00%, cash timing 30 minutes, private\n- DEX_thin: capacity 190,000 TUSD, recovery $0.98 per unit before fee, fee 0.15%, cash timing 8 minutes, publicly visible\n\nDesign the exit rotation that preserves the most recovered value while satisfying the fast-cash requirement and avoiding copied-flow queue exposure. The answer must reconcile exit_allocation_units, expected_recovered_usd, fast_cash_usd, largest_visible_exit_units, and self_check from one plan. Output JSON fields: intent, chosen_strategy, exit_allocation_units, expected_recovered_usd, fast_cash_usd, largest_visible_exit_units, self_check.",
    "rubric_id": "agi-AGI-073",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-074",
    "level": 11,
    "prompt": "Move $2,200,000 USDC-equivalent collateral to Base before a liquidation keeper snapshot in 42 minutes. A copied public bridge flow can be censored if too concentrated, so no route should carry more than 36% of the total transfer when enough eligible alternatives exist. Routes finishing after the snapshot do not count as usable collateral.\n\nRoute primitives:\n- Circle_CCTP: capacity $700,000, fee 4 bps, expected failure drag 0.004%, arrival 9 minutes, private/internal route\n- Across: capacity $620,000, fee 7 bps, expected failure drag 0.008%, arrival 6 minutes, public route\n- Stargate: capacity $540,000, fee 9 bps, expected failure drag 0.012%, arrival 14 minutes, public route\n- Hop: capacity $380,000, fee 12 bps, expected failure drag 0.010%, arrival 18 minutes, public route\n- CEX_internal: capacity $500,000, fee 5 bps, expected failure drag 0.003%, arrival 38 minutes, private/internal route\n\nDesign the collateral routing plan that maximizes expected arrival value while satisfying the deadline and concentration constraints. The answer must reconcile route_allocation_usd, expected_arrival_usd, expected_cost_usd, max_route_share_pct, arrival_minutes, and self_check from one plan. Output JSON fields: intent, chosen_strategy, route_allocation_usd, expected_arrival_usd, expected_cost_usd, max_route_share_pct, arrival_minutes, self_check.",
    "rubric_id": "agi-AGI-074",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-075",
    "level": 11,
    "prompt": "Move $1,900,000 USDC-equivalent collateral to Arbitrum before a liquidation keeper snapshot in 35 minutes. A copied public bridge flow can be censored if too concentrated, so no route should carry more than 34% of the total transfer when enough eligible alternatives exist. Routes finishing after the snapshot do not count as usable collateral.\n\nRoute primitives:\n- Circle_CCTP: capacity $580,000, fee 4 bps, expected failure drag 0.004%, arrival 10 minutes, private/internal route\n- Across: capacity $520,000, fee 6 bps, expected failure drag 0.009%, arrival 5 minutes, public route\n- Stargate: capacity $460,000, fee 8 bps, expected failure drag 0.011%, arrival 13 minutes, public route\n- Synapse: capacity $320,000, fee 14 bps, expected failure drag 0.016%, arrival 21 minutes, public route\n- CEX_internal: capacity $430,000, fee 5 bps, expected failure drag 0.003%, arrival 32 minutes, private/internal route\n\nDesign the collateral routing plan that maximizes expected arrival value while satisfying the deadline and concentration constraints. The answer must reconcile route_allocation_usd, expected_arrival_usd, expected_cost_usd, max_route_share_pct, arrival_minutes, and self_check from one plan. Output JSON fields: intent, chosen_strategy, route_allocation_usd, expected_arrival_usd, expected_cost_usd, max_route_share_pct, arrival_minutes, self_check.",
    "rubric_id": "agi-AGI-075",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-076",
    "level": 11,
    "prompt": "Move $1,650,000 USDC-equivalent collateral to Optimism before a liquidation keeper snapshot in 30 minutes. A copied public bridge flow can be censored if too concentrated, so no route should carry more than 35% of the total transfer when enough eligible alternatives exist. Routes finishing after the snapshot do not count as usable collateral.\n\nRoute primitives:\n- Circle_CCTP: capacity $520,000, fee 4 bps, expected failure drag 0.004%, arrival 11 minutes, private/internal route\n- Across: capacity $470,000, fee 6 bps, expected failure drag 0.008%, arrival 5 minutes, public route\n- Stargate: capacity $380,000, fee 9 bps, expected failure drag 0.012%, arrival 15 minutes, public route\n- Hop: capacity $290,000, fee 11 bps, expected failure drag 0.010%, arrival 18 minutes, public route\n- CEX_internal: capacity $390,000, fee 5 bps, expected failure drag 0.003%, arrival 28 minutes, private/internal route\n\nDesign the collateral routing plan that maximizes expected arrival value while satisfying the deadline and concentration constraints. The answer must reconcile route_allocation_usd, expected_arrival_usd, expected_cost_usd, max_route_share_pct, arrival_minutes, and self_check from one plan. Output JSON fields: intent, chosen_strategy, route_allocation_usd, expected_arrival_usd, expected_cost_usd, max_route_share_pct, arrival_minutes, self_check.",
    "rubric_id": "agi-AGI-076",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-077",
    "level": 11,
    "prompt": "Move $1,400,000 USDC-equivalent collateral to Polygon before a liquidation keeper snapshot in 34 minutes. A copied public bridge flow can be censored if too concentrated, so no route should carry more than 33% of the total transfer when enough eligible alternatives exist. Routes finishing after the snapshot do not count as usable collateral.\n\nRoute primitives:\n- Circle_CCTP: capacity $420,000, fee 5 bps, expected failure drag 0.005%, arrival 12 minutes, private/internal route\n- Across: capacity $390,000, fee 8 bps, expected failure drag 0.009%, arrival 8 minutes, public route\n- Stargate: capacity $360,000, fee 10 bps, expected failure drag 0.013%, arrival 17 minutes, public route\n- CEX_internal: capacity $340,000, fee 6 bps, expected failure drag 0.004%, arrival 30 minutes, private/internal route\n- Legacy_PoS: capacity $260,000, fee 16 bps, expected failure drag 0.018%, arrival 26 minutes, public route\n\nDesign the collateral routing plan that maximizes expected arrival value while satisfying the deadline and concentration constraints. The answer must reconcile route_allocation_usd, expected_arrival_usd, expected_cost_usd, max_route_share_pct, arrival_minutes, and self_check from one plan. Output JSON fields: intent, chosen_strategy, route_allocation_usd, expected_arrival_usd, expected_cost_usd, max_route_share_pct, arrival_minutes, self_check.",
    "rubric_id": "agi-AGI-077",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-078",
    "level": 11,
    "prompt": "You manage $920,000 of directional crypto exposure into a binary BTC miner default window. A hedge is only acceptable if the final package respects the premium budget and keeps the worst scenario PnL no lower than $-135,000. The desk wants the package with the strongest probability-weighted PnL among packages that survive that drawdown floor.\n\nUnhedged scenario tape:\n- default: probability 28.00%, unhedged PnL $-260,000\n- chop: probability 47.00%, unhedged PnL $-25,000\n- squeeze: probability 25.00%, unhedged PnL $118,000\n\nAvailable hedge overlays:\n- put_spread_68k_60k: upfront premium $22,000; payoff by scenario default $145,000, chop $8,000, squeeze $-22,000\n- perp_short_20pct: upfront premium $9,000; payoff by scenario default $78,000, chop $-4,000, squeeze $-46,000\n- call_overwrite_86k: upfront premium $-7,000; payoff by scenario default $-12,000, chop $5,000, squeeze $-88,000\n- variance_swap: upfront premium $18,000; payoff by scenario default $95,000, chop $-6,000, squeeze $12,000\n\nPremium budget: $76,000. Design the hedge package from these primitives. The answer must reconcile selected_hedges, premium_usd, worst_case_pnl_usd, expected_pnl_usd, and self_check from one plan. Output JSON fields: intent, chosen_strategy, selected_hedges, premium_usd, worst_case_pnl_usd, expected_pnl_usd, self_check.",
    "rubric_id": "agi-AGI-078",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-079",
    "level": 11,
    "prompt": "You manage $840,000 of directional crypto exposure into a binary ETH validator slashing window. A hedge is only acceptable if the final package respects the premium budget and keeps the worst scenario PnL no lower than $-115,000. The desk wants the package with the strongest probability-weighted PnL among packages that survive that drawdown floor.\n\nUnhedged scenario tape:\n- default: probability 31.00%, unhedged PnL $-220,000\n- chop: probability 46.00%, unhedged PnL $-18,000\n- squeeze: probability 23.00%, unhedged PnL $94,000\n\nAvailable hedge overlays:\n- put_spread_3400_3000: upfront premium $18,000; payoff by scenario default $118,000, chop $6,000, squeeze $-17,000\n- stETH_discount_swap: upfront premium $14,000; payoff by scenario default $76,000, chop $-3,000, squeeze $4,000\n- perp_short_25pct: upfront premium $11,000; payoff by scenario default $69,000, chop $-5,000, squeeze $-39,000\n- call_overwrite_4600: upfront premium $-6,000; payoff by scenario default $-8,000, chop $3,000, squeeze $-62,000\n\nPremium budget: $38,000. Design the hedge package from these primitives. The answer must reconcile selected_hedges, premium_usd, worst_case_pnl_usd, expected_pnl_usd, and self_check from one plan. Output JSON fields: intent, chosen_strategy, selected_hedges, premium_usd, worst_case_pnl_usd, expected_pnl_usd, self_check.",
    "rubric_id": "agi-AGI-079",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-080",
    "level": 11,
    "prompt": "You manage $610,000 of directional crypto exposure into a binary SOL outage window. A hedge is only acceptable if the final package respects the premium budget and keeps the worst scenario PnL no lower than $-85,000. The desk wants the package with the strongest probability-weighted PnL among packages that survive that drawdown floor.\n\nUnhedged scenario tape:\n- default: probability 29.00%, unhedged PnL $-160,000\n- chop: probability 48.00%, unhedged PnL $-14,000\n- squeeze: probability 23.00%, unhedged PnL $76,000\n\nAvailable hedge overlays:\n- put_spread_155_130: upfront premium $13,000; payoff by scenario default $86,000, chop $5,000, squeeze $-12,000\n- perp_short_30pct: upfront premium $9,000; payoff by scenario default $62,000, chop $-4,000, squeeze $-30,000\n- validator_hedge: upfront premium $8,000; payoff by scenario default $41,000, chop $1,000, squeeze $-9,000\n- call_overwrite_220: upfront premium $-5,000; payoff by scenario default $-6,000, chop $2,500, squeeze $-47,000\n\nPremium budget: $30,000. Design the hedge package from these primitives. The answer must reconcile selected_hedges, premium_usd, worst_case_pnl_usd, expected_pnl_usd, and self_check from one plan. Output JSON fields: intent, chosen_strategy, selected_hedges, premium_usd, worst_case_pnl_usd, expected_pnl_usd, self_check.",
    "rubric_id": "agi-AGI-080",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-081",
    "level": 11,
    "prompt": "You manage $730,000 of directional crypto exposure into a binary DeFi oracle exploit window. A hedge is only acceptable if the final package respects the premium budget and keeps the worst scenario PnL no lower than $-100,000. The desk wants the package with the strongest probability-weighted PnL among packages that survive that drawdown floor.\n\nUnhedged scenario tape:\n- default: probability 30.00%, unhedged PnL $-190,000\n- chop: probability 45.00%, unhedged PnL $-22,000\n- squeeze: probability 25.00%, unhedged PnL $88,000\n\nAvailable hedge overlays:\n- basket_put_spread: upfront premium $17,000; payoff by scenario default $105,000, chop $7,000, squeeze $-15,000\n- perp_short_defi: upfront premium $10,000; payoff by scenario default $72,000, chop $-5,000, squeeze $-33,000\n- stable_long_basis: upfront premium $6,000; payoff by scenario default $28,000, chop $2,000, squeeze $-4,000\n- call_overwrite_index: upfront premium $-5,000; payoff by scenario default $-7,000, chop $3,000, squeeze $-52,000\n\nPremium budget: $33,000. Design the hedge package from these primitives. The answer must reconcile selected_hedges, premium_usd, worst_case_pnl_usd, expected_pnl_usd, and self_check from one plan. Output JSON fields: intent, chosen_strategy, selected_hedges, premium_usd, worst_case_pnl_usd, expected_pnl_usd, self_check.",
    "rubric_id": "agi-AGI-081",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-082",
    "level": 11,
    "prompt": "Convert $4,130,000 USDC into HYPE during a pre-announcement liquidity window. Public route overuse is copied by searchers and repriced before completion; private routes do not create a public pre-fill graph. No spot inventory may be used to offset the acquisition.\n\nCurrent HYPE mid is $24.8. Venue primitives:\n- Binance: usable clip $900,000, quoted price $24.76, fee 0.06%, fixed cost $45, publicly visible before completion\n- Hyperliquid_RFQ: usable clip $850,000, quoted price $24.81, fee 0.04%, fixed cost $30, private before completion\n- Bybit: usable clip $700,000, quoted price $24.88, fee 0.07%, fixed cost $35, publicly visible before completion\n- CoW_RFQ: usable clip $650,000, quoted price $24.93, fee 0.05%, fixed cost $25, private before completion\n- Uniswap_Arbitrum: usable clip $550,000, quoted price $25.02, fee 0.12%, fixed cost $120, private before completion\n- Coinbase: usable clip $600,000, quoted price $25.08, fee 0.08%, fixed cost $40, publicly visible before completion\n\nAny publicly visible child order larger than $780,000 is copied and loses priority before the fill settles. Design the acquisition route that completes the full notional while avoiding copied-flow repricing. The answer must reconcile venue_allocation_usd, largest_visible_clip_usd, expected_asset_received, effective_price, and self_check from one plan. Output JSON fields: intent, chosen_strategy, venue_allocation_usd, largest_visible_clip_usd, expected_asset_received, effective_price, self_check.",
    "rubric_id": "agi-AGI-082",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-083",
    "level": 11,
    "prompt": "Convert $2,850,000 USDC into JUP during a pre-announcement liquidity window. Public route overuse is copied by searchers and repriced before completion; private routes do not create a public pre-fill graph. No spot inventory may be used to offset the acquisition.\n\nCurrent JUP mid is $0.91. Venue primitives:\n- Jupiter_Solana: usable clip $700,000, quoted price $0.91, fee 0.10%, fixed cost $90, private before completion\n- Binance: usable clip $650,000, quoted price $0.91, fee 0.06%, fixed cost $35, publicly visible before completion\n- OKX: usable clip $500,000, quoted price $0.92, fee 0.07%, fixed cost $30, publicly visible before completion\n- Wintermute_RFQ: usable clip $550,000, quoted price $0.92, fee 0.03%, fixed cost $20, private before completion\n- Orca: usable clip $300,000, quoted price $0.93, fee 0.14%, fixed cost $80, private before completion\n- Coinbase: usable clip $350,000, quoted price $0.93, fee 0.08%, fixed cost $35, publicly visible before completion\n\nAny publicly visible child order larger than $640,000 is copied and loses priority before the fill settles. Design the acquisition route that completes the full notional while avoiding copied-flow repricing. The answer must reconcile venue_allocation_usd, largest_visible_clip_usd, expected_asset_received, effective_price, and self_check from one plan. Output JSON fields: intent, chosen_strategy, venue_allocation_usd, largest_visible_clip_usd, expected_asset_received, effective_price, self_check.",
    "rubric_id": "agi-AGI-083",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-084",
    "level": 11,
    "prompt": "Convert $3,560,000 USDC into TAO during a pre-announcement liquidity window. Public route overuse is copied by searchers and repriced before completion; private routes do not create a public pre-fill graph. No spot inventory may be used to offset the acquisition.\n\nCurrent TAO mid is $518. Venue primitives:\n- Binance: usable clip $800,000, quoted price $517.2, fee 0.07%, fixed cost $50, publicly visible before completion\n- OTC_Block: usable clip $900,000, quoted price $518.6, fee 0.03%, fixed cost $35, private before completion\n- Kraken: usable clip $500,000, quoted price $520.1, fee 0.08%, fixed cost $40, publicly visible before completion\n- Bybit: usable clip $650,000, quoted price $519.4, fee 0.07%, fixed cost $45, publicly visible before completion\n- CoW_RFQ: usable clip $450,000, quoted price $521, fee 0.04%, fixed cost $25, private before completion\n- Uniswap_Base: usable clip $300,000, quoted price $523.5, fee 0.15%, fixed cost $140, private before completion\n\nAny publicly visible child order larger than $760,000 is copied and loses priority before the fill settles. Design the acquisition route that completes the full notional while avoiding copied-flow repricing. The answer must reconcile venue_allocation_usd, largest_visible_clip_usd, expected_asset_received, effective_price, and self_check from one plan. Output JSON fields: intent, chosen_strategy, venue_allocation_usd, largest_visible_clip_usd, expected_asset_received, effective_price, self_check.",
    "rubric_id": "agi-AGI-084",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-085",
    "level": 11,
    "prompt": "Convert $2,400,000 USDC into ENA during a pre-announcement liquidity window. Public route overuse is copied by searchers and repriced before completion; private routes do not create a public pre-fill graph. No spot inventory may be used to offset the acquisition.\n\nCurrent ENA mid is $0.73. Venue primitives:\n- Binance: usable clip $650,000, quoted price $0.73, fee 0.06%, fixed cost $30, publicly visible before completion\n- Ethena_RFQ: usable clip $500,000, quoted price $0.73, fee 0.02%, fixed cost $15, private before completion\n- OKX: usable clip $450,000, quoted price $0.73, fee 0.07%, fixed cost $30, publicly visible before completion\n- Bybit: usable clip $450,000, quoted price $0.74, fee 0.07%, fixed cost $35, publicly visible before completion\n- Curve_USDe: usable clip $250,000, quoted price $0.74, fee 0.11%, fixed cost $95, private before completion\n- Coinbase: usable clip $300,000, quoted price $0.74, fee 0.08%, fixed cost $35, publicly visible before completion\n\nAny publicly visible child order larger than $620,000 is copied and loses priority before the fill settles. Design the acquisition route that completes the full notional while avoiding copied-flow repricing. The answer must reconcile venue_allocation_usd, largest_visible_clip_usd, expected_asset_received, effective_price, and self_check from one plan. Output JSON fields: intent, chosen_strategy, venue_allocation_usd, largest_visible_clip_usd, expected_asset_received, effective_price, self_check.",
    "rubric_id": "agi-AGI-085",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-086",
    "level": 11,
    "prompt": "You must buy 50,000 ABC before an information event. A copy-trading bot worsens the remaining public book after it sees an aggressive parent order above 10,000 ABC, while private fills update no public footprint.\n\nRaw execution primitives:\n- Dark_RFQ can fill 15,000 ABC at $1.206 all-in if committed before T+20s; it is not visible to the copy bot.\n- Internalizer can fill 18,000 ABC at $1.2075 all-in if committed before T+45s; it is not visible to the copy bot.\n- RFQ_A can fill 10,000 ABC at $1.209 all-in if committed before T+70s; it is not visible to the copy bot.\n- A hidden public iceberg can absorb up to 7,000 ABC at $1.204 before the event. Any larger public parent becomes visible and can reprice the rest of the order.\n- Current mid is $1.2. Every committed child must finish inside the event window.\n\nDesign the execution route from these primitives. The answer must reconcile route order, venue fills, hidden-public size, all-in average price, slippage versus mid, and a self-check that the copied-flow trigger is not activated. Output JSON fields: intent, chosen_strategy, execution_sequence, venue_fills, hidden_public_qty, expected_avg_price, expected_slippage_pct, self_check.",
    "rubric_id": "agi-AGI-086",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-087",
    "level": 11,
    "prompt": "You must buy 80,000 RHO before an information event. A copy-trading bot worsens the remaining public book after it sees an aggressive parent order above 18,000 RHO, while private fills update no public footprint.\n\nRaw execution primitives:\n- CEX_Y can fill 22,000 RHO at $0.8218 all-in if committed before T+20s; it is not visible to the copy bot.\n- Dark_RFQ can fill 25,000 RHO at $0.8229 all-in if committed before T+45s; it is not visible to the copy bot.\n- RFQ_A can fill 24,000 RHO at $0.8242 all-in if committed before T+70s; it is not visible to the copy bot.\n- A hidden public iceberg can absorb up to 9,000 RHO at $0.8205 before the event. Any larger public parent becomes visible and can reprice the rest of the order.\n- Current mid is $0.819. Every committed child must finish inside the event window.\n\nDesign the execution route from these primitives. The answer must reconcile route order, venue fills, hidden-public size, all-in average price, slippage versus mid, and a self-check that the copied-flow trigger is not activated. Output JSON fields: intent, chosen_strategy, execution_sequence, venue_fills, hidden_public_qty, expected_avg_price, expected_slippage_pct, self_check.",
    "rubric_id": "agi-AGI-087",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-088",
    "level": 11,
    "prompt": "You must buy 120,000 KAP before an information event. A copy-trading bot worsens the remaining public book after it sees an aggressive parent order above 25,000 KAP, while private fills update no public footprint.\n\nRaw execution primitives:\n- Internalizer can fill 42,000 KAP at $4.925 all-in if committed before T+20s; it is not visible to the copy bot.\n- Dark_RFQ can fill 35,000 KAP at $4.931 all-in if committed before T+45s; it is not visible to the copy bot.\n- CEX_Y can fill 30,000 KAP at $4.936 all-in if committed before T+70s; it is not visible to the copy bot.\n- A hidden public iceberg can absorb up to 13,000 KAP at $4.918 before the event. Any larger public parent becomes visible and can reprice the rest of the order.\n- Current mid is $4.91. Every committed child must finish inside the event window.\n\nDesign the execution route from these primitives. The answer must reconcile route order, venue fills, hidden-public size, all-in average price, slippage versus mid, and a self-check that the copied-flow trigger is not activated. Output JSON fields: intent, chosen_strategy, execution_sequence, venue_fills, hidden_public_qty, expected_avg_price, expected_slippage_pct, self_check.",
    "rubric_id": "agi-AGI-088",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-089",
    "level": 11,
    "prompt": "You are long 80 ETH perpetual units from $3200 at 4x leverage. Current ETH mid is $3150; original margin was entry notional divided by leverage. A liquidation engine begins a correlated-account sweep before the next carry/funding timestamp.\n\nRaw venue primitives:\n- The risk feed classifies accounts by visible net ETH exposure at the sweep. Accounts still showing more than 55 ETH net long can be stress-marked to $3000 before carry is paid.\n- A private hedge tunnel can reduce up to 50 ETH immediately at the current mid with 0.07% execution cost. It updates the risk feed before the sweep and does not advertise a margin top-up.\n- Visible margin additions settle after the sweep scorer snapshots the account and can be copied by liquidation searchers.\n- If the account avoids the sweep, the post-sweep mark is expected to be $3260 and residual longs receive 0.060% funding on that mark.\n- The portfolio mandate requires preserving at least 30 ETH of upside delta if that can be done without creating a sweep-path inconsistency.\n\nDesign the defensive strategy from these primitives. The answer must reconcile the hedge size, residual exposure, worst sweep drawdown versus original margin, funding-window PnL, and self-check from the same plan. Output JSON fields: intent, chosen_strategy, hedge_units, net_exposure_units, worst_case_margin_drawdown_pct, funding_window_pnl_usd, self_check.",
    "rubric_id": "agi-AGI-089",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-090",
    "level": 11,
    "prompt": "You are long 5,000 SOL perpetual units from $145 at 5x leverage. Current SOL mid is $142; original margin was entry notional divided by leverage. A liquidation engine begins a correlated-account sweep before the next carry/funding timestamp.\n\nRaw venue primitives:\n- The risk feed classifies accounts by visible net SOL exposure at the sweep. Accounts still showing more than 3,200 SOL net long can be stress-marked to $132 before carry is paid.\n- A private hedge tunnel can reduce up to 3,000 SOL immediately at the current mid with 0.08% execution cost. It updates the risk feed before the sweep and does not advertise a margin top-up.\n- Visible margin additions settle after the sweep scorer snapshots the account and can be copied by liquidation searchers.\n- If the account avoids the sweep, the post-sweep mark is expected to be $150 and residual longs receive 0.090% funding on that mark.\n- The portfolio mandate requires preserving at least 2,000 SOL of upside delta if that can be done without creating a sweep-path inconsistency.\n\nDesign the defensive strategy from these primitives. The answer must reconcile the hedge size, residual exposure, worst sweep drawdown versus original margin, funding-window PnL, and self-check from the same plan. Output JSON fields: intent, chosen_strategy, hedge_units, net_exposure_units, worst_case_margin_drawdown_pct, funding_window_pnl_usd, self_check.",
    "rubric_id": "agi-AGI-090",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-091",
    "level": 11,
    "prompt": "You are long 200,000 ARB perpetual units from $1.22 at 4x leverage. Current ARB mid is $1.19; original margin was entry notional divided by leverage. A liquidation engine begins a correlated-account sweep before the next carry/funding timestamp.\n\nRaw venue primitives:\n- The risk feed classifies accounts by visible net ARB exposure at the sweep. Accounts still showing more than 120,000 ARB net long can be stress-marked to $1.08 before carry is paid.\n- A private hedge tunnel can reduce up to 125,000 ARB immediately at the current mid with 0.10% execution cost. It updates the risk feed before the sweep and does not advertise a margin top-up.\n- Visible margin additions settle after the sweep scorer snapshots the account and can be copied by liquidation searchers.\n- If the account avoids the sweep, the post-sweep mark is expected to be $1.25 and residual longs receive 0.070% funding on that mark.\n- The portfolio mandate requires preserving at least 75,000 ARB of upside delta if that can be done without creating a sweep-path inconsistency.\n\nDesign the defensive strategy from these primitives. The answer must reconcile the hedge size, residual exposure, worst sweep drawdown versus original margin, funding-window PnL, and self-check from the same plan. Output JSON fields: intent, chosen_strategy, hedge_units, net_exposure_units, worst_case_margin_drawdown_pct, funding_window_pnl_usd, self_check.",
    "rubric_id": "agi-AGI-091",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-092",
    "level": 11,
    "prompt": "Stable yield holdout. Allocate $100,000 for 90 days across five protocol venues with APY, tail-loss, cap, and exit-window differences.\n\nVenue signals after tail losses and hedge drag: Aave_USDC: cap 20000, net APY signal 7.04%, 48h-liquid; Curve_3pool: cap 30000, net APY signal 8.14%, 48h-liquid; Ethena_USDe: cap 20000, net APY signal 9.24%, term/slow-exit; GMX_GLP: cap 30000, net APY signal 10.34%, term/slow-exit; a fifth uncapped-looking venue has lower net APY and enters a redemption queue above $10,000. A public allocator that exceeds a fragile venue threshold is queued behind mercenary withdrawals. At least half the capital must be liquid inside 48 hours, and no allocation may use a tier that enters the adversarial queue.\n\nMaximize risk-adjusted 90-day dollars from the listed opportunity set.\n\nOutput JSON fields: intent, chosen_strategy, allocation_usd, expected_net_apy_pct, expected_90d_profit_usd, liquidity_48h_usd.",
    "rubric_id": "agi-AGI-092",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-093",
    "level": 11,
    "prompt": "Restaking yield holdout. Allocate $100,000 for 90 days across five protocol venues with APY, tail-loss, cap, and exit-window differences.\n\nVenue signals after tail losses and hedge drag: Aave_USDC: cap 25000, net APY signal 6.19%, 48h-liquid; Symbiotic_AVS: cap 20000, net APY signal 7.29%, 48h-liquid; EigenLayer_AVS: cap 25000, net APY signal 8.39%, term/slow-exit; Pendle_PT: cap 30000, net APY signal 9.49%, term/slow-exit; a fifth uncapped-looking venue has lower net APY and enters a redemption queue above $10,000. A public allocator that exceeds a fragile venue threshold is queued behind mercenary withdrawals. At least $45,000 must be liquid inside 48 hours, and no allocation may use a tier that enters the adversarial queue.\n\nMaximize risk-adjusted 90-day dollars from the listed opportunity set.\n\nOutput JSON fields: intent, chosen_strategy, allocation_usd, expected_net_apy_pct, expected_90d_profit_usd, liquidity_48h_usd.",
    "rubric_id": "agi-AGI-093",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-094",
    "level": 11,
    "prompt": "Allocate $100,000 for 90 days across protocol venues while preserving crisis liquidity. A public allocator that overloads a fragile redemption lane is queued behind mercenary withdrawals.\n\nRaw venue primitives:\n- Aave_USDC: 5.4% APY, liquid inside 48 hours, no tail loss at this size, $30,000 practical capacity.\n- Maple_USDC: 9.8% APY, liquid inside 48 hours, 1.0% chance of an 8% credit loss during the term, $25,000 borrower-pool capacity.\n- Ethena_USDe: 16.0% APY, seven-day exit, 2.5% chance of a 50% shutdown loss during the term, redemptions above $20,000 enter the adversarial queue.\n- GMX_GLP: 18.0% APY, five-day exit, market-beta hedge drag of 7.0% annualized, $30,000 capacity before withdrawal impact.\n- NewFarm_USD: headline 13.0% APY, twelve-day exit, queue penalty begins above $10,000 and queue position is public.\n\nAt least $50,000 must be liquid inside 48 hours, and any allocation that enters an adversarial queue is inconsistent with the mandate. Design the risk-adjusted allocation from these primitives and reconcile allocation, annualized net APY, 90-day profit, 48-hour liquidity, and self-check. Output JSON fields: intent, chosen_strategy, allocation_usd, expected_net_apy_pct, expected_90d_profit_usd, liquidity_48h_usd, self_check.",
    "rubric_id": "agi-AGI-094",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-095",
    "level": 11,
    "prompt": "Move $600,000 USDC before an auction deadline in 90 minutes. A bridge exploit searcher watches public transfer graphs and focuses on the largest observable clip, while private attestation hides transfers before settlement.\n\nRaw route primitives:\n- Alpha: private-attested route, 65-minute settlement, 99.60% arrival reliability, 0.04% toll, usable clip $350,000.\n- Delta: relayer route, 40-minute settlement, 99.20% arrival reliability, 0.02% toll, usable clip $250,000.\n- Public fast lanes can be copied into a challenge path when their visible clip becomes the focal transfer.\n- Slow canonical settlement is safer in isolation but cannot repair the account after the auction starts.\n- Splits settle independently, but the account is only repaired if the planned amount is spendable before the auction.\n\nDesign the route plan, including internal checks that the selected clips arrive in time, do not create a focal public target, and reconcile expected deadweight loss with route tolls plus non-arrival risk. Output JSON fields: intent, chosen_strategy, route_allocation_usd, observable_largest_clip_usd, expected_loss_usd, expected_arrival_minutes, self_check.",
    "rubric_id": "agi-AGI-095",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-096",
    "level": 11,
    "prompt": "Move $500,000 USDC before an auction deadline in 100 minutes. A bridge exploit searcher watches public transfer graphs and focuses on the largest observable clip, while private attestation hides transfers before settlement.\n\nRaw route primitives:\n- Gamma: private-attested route, 70-minute settlement, 99.80% arrival reliability, 0.06% toll, usable clip $300,000.\n- Sigma: relayer route, 55-minute settlement, 99.50% arrival reliability, 0.02% toll, usable clip $200,000.\n- Public fast lanes can be copied into a challenge path when their visible clip becomes the focal transfer.\n- Slow canonical settlement is safer in isolation but cannot repair the account after the auction starts.\n- Splits settle independently, but the account is only repaired if the planned amount is spendable before the auction.\n\nDesign the route plan, including internal checks that the selected clips arrive in time, do not create a focal public target, and reconcile expected deadweight loss with route tolls plus non-arrival risk. Output JSON fields: intent, chosen_strategy, route_allocation_usd, observable_largest_clip_usd, expected_loss_usd, expected_arrival_minutes, self_check.",
    "rubric_id": "agi-AGI-096",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-097",
    "level": 11,
    "prompt": "Move $450,000 USDC before an auction deadline in 80 minutes. A bridge exploit searcher watches public transfer graphs and focuses on the largest observable clip, while private attestation hides transfers before settlement.\n\nRaw route primitives:\n- Alpha: private-attested route, 60-minute settlement, 99.70% arrival reliability, 0.05% toll, usable clip $250,000.\n- Sigma: relayer route, 45-minute settlement, 99.30% arrival reliability, 0.03% toll, usable clip $200,000.\n- Public fast lanes can be copied into a challenge path when their visible clip becomes the focal transfer.\n- Slow canonical settlement is safer in isolation but cannot repair the account after the auction starts.\n- Splits settle independently, but the account is only repaired if the planned amount is spendable before the auction.\n\nDesign the route plan, including internal checks that the selected clips arrive in time, do not create a focal public target, and reconcile expected deadweight loss with route tolls plus non-arrival risk. Output JSON fields: intent, chosen_strategy, route_allocation_usd, observable_largest_clip_usd, expected_loss_usd, expected_arrival_minutes, self_check.",
    "rubric_id": "agi-AGI-097",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-098",
    "level": 11,
    "prompt": "BTC spoof recovery. Recent large sell impulses fully recovered within seconds, but the most recent buy impulse had abnormal impact.\n\nThe last pre-impulse fair value is near 61242. A toxicity classifier fades displayed interest above 140 BTC and sweeps stale quotes after momentum bursts. Hidden child orders of about 35 BTC can be repriced every 45 seconds and must complete before the deadline.\n\nInfer fair value from the tape and choose the execution policy that completes without triggering the classifier.\n\nOutput JSON fields: intent, chosen_strategy, price_band, child_order_units, repricing_interval_sec, expected_avg_price.",
    "rubric_id": "agi-AGI-098",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-099",
    "level": 11,
    "prompt": "A desk must buy 62,000 ETH beta-equivalent units over nine minutes after a spoof cluster made lit depth unreliable. There are four execution primitives: a dark RFQ for exactly 21,000 units at $3,842.50 all-in that expires before any lit child order; a midpoint peg on Venue M that fills up to 18,000 units but is cancelled if displayed imbalance exceeds 1.8; a randomized post-only ladder on Venue R that can fill 30,000 units with a 0.035% rebate but becomes toxic if any child exceeds 6,000 units; and an IOC sweep on Venue C for the remainder at $3,856.20 plus 0.06% fee. A classifier will infer the parent order if lit child orders exceed 32,000 units before the dark RFQ is accepted. Design the execution package that completes the parent while minimizing expected cost and avoiding classifier inference. The answer must reconcile execution_sequence, venue_fills, largest_lit_child_units, expected_avg_price, classifier_exposure_score, and self_check from one plan. Output JSON fields: intent, chosen_strategy, execution_sequence, venue_fills, largest_lit_child_units, expected_avg_price, classifier_exposure_score, self_check.",
    "rubric_id": "agi-AGI-099",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-100",
    "level": 11,
    "prompt": "At 14:35:00 you must buy 30,000 SOL within ten minutes. Recent tape:\n- 14:23:10: 55,000 SOL market sell moved $146.90 -> $146.42 and recovered to $146.86 in 7 seconds.\n- 14:27:35: 42,000 SOL market sell moved $146.94 -> $146.55 and recovered to $146.89 in 5 seconds.\n- 14:32:20: 63,000 SOL market sell moved $146.97 -> $146.48 and recovered to $146.91 in 4 seconds.\n- 14:34:05: 4,000 SOL market buy moved $146.92 -> $147.22 while typical impact is +$0.06 to +$0.08.\n\nCurrent quote is $147.16 / $147.25. A toxicity classifier fades displayed buy interest above 10,000 SOL and sweeps stale bids after momentum bursts. Hidden iceberg child orders up to 2,500 SOL are not detected, but overly passive bids below fair value risk non-completion. The exchange allows immediate repricing every 45 seconds.\n\nDesign the execution strategy that completes the meta-order while minimizing adverse selection from the classifier. The price band, child size, repricing cadence, expected average price, and self-check must agree with the same execution plan. Output JSON fields: intent, chosen_strategy, price_band, child_order_units, repricing_interval_sec, expected_avg_price, self_check.\n\nChoose the strategy from: [momentum_chasing_market_sweep, hidden_layered_limits_at_recovered_fair, passive_below_fair_vwap, displayed_block_bid_above_quote].",
    "rubric_id": "agi-AGI-100",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-101",
    "level": 11,
    "prompt": "A protocol token trades after a two-week drawdown while TVL is stable. A governance vote in 24 hours changes emissions and treasury behavior, and strategic farmers can change their selling before the market has fully repriced.\n\nRaw primitives:\n- Current daily market sell pressure is 54,000 tokens into DEX liquidity of $1,250,000.\n- If the vote passes, new emissions are 40,000 tokens/day and retained farmers are expected to sell 60% of rewards.\n- A delayed-unlock cohort adds 5,000 tokens/day of extra selling for the first 3 days after passage.\n- A treasury stabilization order of $45,000 is authorized only if the vote passes.\n- Prior order-book response suggests roughly two-thirds of persistent net flow reaches price over this window; the rest is absorbed by passive liquidity.\n\nOver the next 12 days, decide how to vote and whether to keep farming or exit. The answer must reconcile vote, position, average net sell-pressure change, stabilization flow, expected 12-day price impact, and self-check. Output JSON fields: intent, vote, position, chosen_strategy, net_sell_pressure_delta_per_day, stabilization_buy_usd, expected_12d_price_change_pct, self_check.",
    "rubric_id": "agi-AGI-101",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-102",
    "level": 11,
    "prompt": "A protocol token trades after a two-week drawdown while TVL is stable. A governance vote in 24 hours changes emissions and treasury behavior, and strategic farmers can change their selling before the market has fully repriced.\n\nRaw primitives:\n- Current daily market sell pressure is 56,000 tokens into DEX liquidity of $1,600,000.\n- If the vote passes, new emissions are 35,000 tokens/day and retained farmers are expected to sell 70% of rewards.\n- A delayed-unlock cohort adds 4,000 tokens/day of extra selling for the first 4 days after passage.\n- A treasury stabilization order of $30,000 is authorized only if the vote passes.\n- Prior order-book response suggests roughly two-thirds of persistent net flow reaches price over this window; the rest is absorbed by passive liquidity.\n\nOver the next 12 days, decide how to vote and whether to keep farming or exit. The answer must reconcile vote, position, average net sell-pressure change, stabilization flow, expected 12-day price impact, and self-check. Output JSON fields: intent, vote, position, chosen_strategy, net_sell_pressure_delta_per_day, stabilization_buy_usd, expected_12d_price_change_pct, self_check.",
    "rubric_id": "agi-AGI-102",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-103",
    "level": 11,
    "prompt": "A governance desk controls 9.4% of voting power in a protocol where emissions, borrow incentives, and LP depth interact reflexively. Three mutually exclusive proposals are live: cut spot emissions by 22% and redirect half to locked LP gauges; delay a 14 million token team unlock by 45 days while paying a 1.8 million token bribe; or keep emissions unchanged but authorize a treasury buyback only if DEX depth falls below $18 million. Current daily farm sell pressure is 410,000 tokens, DEX depth is $24 million, borrow demand adds $72,000/day of fee value when locked LP depth exceeds $28 million, and the desk must avoid any vote that creates more than 7% expected circulating-supply shock in the first 30 days. Design the vote and hedge stance that maximizes 30-day tokenholder value while respecting the supply-shock constraint. The answer must reconcile proposal_vote, hedge_action, expected_30d_value_usd, supply_shock_pct, lp_depth_after_30d_usd, and self_check from one plan. Output JSON fields: intent, chosen_strategy, proposal_vote, hedge_action, expected_30d_value_usd, supply_shock_pct, lp_depth_after_30d_usd, self_check.",
    "rubric_id": "agi-AGI-103",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-104",
    "level": 11,
    "prompt": "You are quoting a new listing with toxic taker flow. Fast quotes earn queue priority but become stale during microstructure shocks; overly wide quotes lose the benign flow needed to hedge inventory.\n\nRaw primitives:\n- Your measured cancel latency is 45 ms. Cancels submitted faster than the round-trip latency can leave stale quotes active during toxic bursts.\n- Toxic bursts have recently moved the mark by about 24 bps before stale quotes could be removed.\n- Benign flow remains competitive for defensive half-spreads in the 20-35 bps range; outside that band, queue position decays sharply.\n- The hedge desk can warehouse about $22,000 before inventory skew becomes nonlinear.\n- Expected benign one-hour turnover at a defensible quote is $180,000; residual toxic-selection drag after filters is about $92.\n\nDesign the defensive market-making policy. The answer must reconcile spread, update cadence, inventory cap, expected PnL, toxic defenses, and self-check from one plan. Output JSON fields: intent, chosen_strategy, half_spread_bps, update_ms, max_inventory_usd, expected_1h_pnl_usd, toxic_defense, self_check.\n\nChoose the strategy from: [selective_wide_defensive_quoting, latency_race_toxic_flow, inventory_max_capture_quoting, tight_queue_priority_quoting].",
    "rubric_id": "agi-AGI-104",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-105",
    "level": 11,
    "prompt": "You quote a perp/spot basis market during a 14-minute oracle-lag incident. The perp venue reprices every 250 ms, the spot hedge venue confirms fills every 1.8 seconds, and toxic takers hit only the side that is stale relative to the delayed oracle. Current inventory is long $410,000 notional, mandate inventory cap is $525,000, and the desk can hedge at most $90,000 per second without moving spot by more than 9 bps. A symmetric quote wins benign flow but breaches the inventory cap in the downside tape; an aggressive ask skew reduces inventory but invites toxic fills if cancel cadence is too slow. Design the market-making parameter set that maximizes expected 20-minute spread capture while keeping inventory and stale-quote loss inside limits. The answer must reconcile bid_half_spread_bps, ask_half_spread_bps, update_ms, max_quote_size_usd, hedge_rate_usd_per_sec, expected_20m_pnl_usd, and self_check from one plan. Output JSON fields: intent, chosen_strategy, bid_half_spread_bps, ask_half_spread_bps, update_ms, max_quote_size_usd, hedge_rate_usd_per_sec, expected_20m_pnl_usd, self_check.",
    "rubric_id": "agi-AGI-105",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-106",
    "level": 11,
    "prompt": "A market maker streams quotes on a new CEX listing while hedging fills through a concentrated-liquidity AMM. The AMM range has deep liquidity near mid but becomes nonlinear after $75,000 of one-sided hedge flow in any 40-second window. CEX queue priority decays if half-spread exceeds 42 bps; toxic takers arrive in 11-second bursts after social alerts; benign flow is strongest between 24 and 34 bps. Inventory starts flat, but the risk desk requires a hard stop at $180,000 net inventory and a hedge throttle that never pushes the AMM outside its active range. Use a queue-preserving spread with an AMM throttle; apply a 96% safety buffer to the AMM one-sided flow limit for the hedge cap, align the hedge window to the stated AMM window, and self-check queue preservation, AMM range exhaustion, and inventory stop inside the desk limit. Design the quote, size, and hedge-throttle parameters. The answer must reconcile half_spread_bps, quote_size_usd, hedge_window_sec, hedge_window_cap_usd, inventory_stop_usd, expected_hourly_pnl_usd, and self_check from one plan. Output JSON fields: intent, chosen_strategy, half_spread_bps, quote_size_usd, hedge_window_sec, hedge_window_cap_usd, inventory_stop_usd, expected_hourly_pnl_usd, self_check.",
    "rubric_id": "agi-AGI-106",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-107",
    "level": 11,
    "prompt": "SOL crisis hedge. A multi-asset portfolio has shifted from normal correlations to crisis correlations while all assets sell off together. Spot cannot be sold because it is pledged to client custody attestations.\n\nRaw hedge primitives:\n- SOL is the largest marginal crisis-vol contributor, but dealer margin jumps if displayed SOL short notional exceeds $310,000.\n- BTC put-spread convexity is available up to $750,000 notional and offsets the common crash tape without adding short-crowding exposure.\n- ETH short liquidity is available, but in this tape it leaves a larger residual tail because the dealer reprices it after seeing SOL demand.\n- The risk committee needs roughly half the one-day VaR removed without tripping the crowding margin rule.\n\nDesign the crisis hedge composition. The answer must reconcile selected legs, notionals, expected vol reduction, residual one-day VaR, and self-check from the same plan. Output JSON fields: intent, chosen_strategy, hedge_legs, expected_vol_reduction_pct, residual_1d_var_usd, self_check.",
    "rubric_id": "agi-AGI-107",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-108",
    "level": 11,
    "prompt": "On 2026-05-07, you manage a $3.4M crypto index book during a two-window correlation regime break. Spot cannot be sold for custody-attestation reasons, and the desk must choose hedges before the second window confirms. Baseline one-day crisis VaR is $352,000, decomposed into common BTC/ETH beta $144,000, ETH contagion $92,000, AI-alt convexity $71,000, and stable-collateral gap $45,000.\n\nAvailable hedge primitives:\n- ETH displayed short A: $220,000 notional; reduces ETH contagion VaR by $38,000 and common beta VaR by $18,000; false-break upside drag 14 points; crowding score 0.34.\n- ETH displayed short B: additional $160,000 notional; reduces ETH contagion VaR by $24,000 and common beta VaR by $10,000; false-break upside drag 12 points; crowding score 0.31.\n- BTC put-spread convexity: $500,000 notional; reduces common beta VaR by $49,000 and stable-collateral gap VaR by $8,000; false-break upside drag 7 points; no crowding score.\n- ETH put-spread convexity: $300,000 notional; reduces ETH contagion VaR by $31,000 and stable-collateral gap VaR by $6,000; false-break upside drag 4 points; no crowding score.\n- SOL/AI correlation short: $180,000 notional; reduces AI-alt convexity VaR by $32,000 and common beta VaR by $6,000; false-break upside drag 15 points; crowding score 0.22.\n\nConstraints: no spot sales, total crowding score must be <= 0.60, false-break upside capture must stay >= 58%, and the package must remove at least $165,000 of one-day crisis VaR. Design the self-consistent hedge package that preserves the strongest residual crisis VaR while satisfying all constraints. The answer must reconcile selected hedge legs, crowding score, false-break upside capture, VaR reduction, residual VaR, and self-check from the same plan. Output JSON fields: intent, chosen_strategy, hedge_legs, crowding_score, false_break_upside_capture_pct, crisis_var_reduction_usd, expected_vol_reduction_pct, residual_1d_var_usd, self_check.",
    "rubric_id": "agi-AGI-108",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-109",
    "level": 11,
    "prompt": "A crypto index book is entering a regime where BTC sells first, ETH follows with a 90-second lag, and AI-token beta gaps only if ETH/BTC correlation stays above 0.82 for two consecutive windows. Current holdings are BTC $1.1M, ETH $820K, FET $390K, and RNDR $310K. Three hedge primitives are available: a BTC perp short that protects the first leg but loses in a relief squeeze, an ETH put spread that only pays after the lag confirms, and a FET/RNDR basket short that is cheap now but becomes crowded after the second window. The mandate requires preserving at least 55% upside participation if the correlation break proves false. Use a staged BTC-first, ETH-confirmation, AI-beta trigger package; size the stages from current holdings at about 38.2% of BTC exposure, 43.9% of ETH exposure, and 34.3% of combined FET/RNDR exposure, and self-check lag trigger respect, false-break upside preservation, and residual VaR reconciliation. Design the hedge trigger package that minimizes confirmed-regime drawdown without over-hedging the false-break path. The answer must reconcile trigger_rule, selected_hedges, hedge_notional_usd, confirmed_regime_residual_var_usd, false_break_upside_capture_pct, and self_check from one plan. Output JSON fields: intent, chosen_strategy, trigger_rule, selected_hedges, hedge_notional_usd, confirmed_regime_residual_var_usd, false_break_upside_capture_pct, self_check.",
    "rubric_id": "agi-AGI-109",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-110",
    "level": 11,
    "prompt": "ETH spot/perp basis is elevated and funding is crowded. You have spot custody for the long leg and must build a 1x delta-neutral short ladder that survives an exchange cascade without forced deleveraging.\n\nRaw venue primitives:\n- Binance: resilient displayed short capacity about $150,000 before ADL/counterparty stress becomes nonlinear; current net carry signal 32% APR.\n- Hyperliquid: resilient displayed short capacity about $100,000 before ADL/counterparty stress becomes nonlinear; current net carry signal 31% APR.\n- Bybit: resilient displayed short capacity about $100,000 before ADL/counterparty stress becomes nonlinear; current net carry signal 29% APR.\n- OKX: resilient displayed short capacity about $100,000 before ADL/counterparty stress becomes nonlinear; current net carry signal 26% APR.\n- dYdX: resilient displayed short capacity about $50,000 before ADL/counterparty stress becomes nonlinear; current net carry signal 22% APR.\n- Stable borrow and operational drag are already reflected in the net carry signals.\n- Using more than the resilient displayed capacity at any venue can flip the cascade buffer negative.\n- The spot custodian supports $500,000 of matched long exposure without rehypothecation.\n\nDesign the resilient funding-basis ladder. The answer must reconcile venue short allocation, leverage, weighted APR, 30-day PnL, cascade buffer, and self-check from the same delta-neutral plan. Output JSON fields: intent, chosen_strategy, perp_short_allocation_usd, leverage, apr_pct, pnl_30d_usd, cascade_buffer_pct, survives_cascade, self_check.",
    "rubric_id": "agi-AGI-110",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-111",
    "level": 11,
    "prompt": "SOL spot/perp basis is elevated and funding is crowded. You have spot custody for the long leg and must build a 1x delta-neutral short ladder that survives an exchange cascade without forced deleveraging.\n\nRaw venue primitives:\n- Binance: resilient displayed short capacity about $120,000 before ADL/counterparty stress becomes nonlinear; current net carry signal 34% APR.\n- Bybit: resilient displayed short capacity about $120,000 before ADL/counterparty stress becomes nonlinear; current net carry signal 32% APR.\n- OKX: resilient displayed short capacity about $110,000 before ADL/counterparty stress becomes nonlinear; current net carry signal 30% APR.\n- Hyperliquid: resilient displayed short capacity about $90,000 before ADL/counterparty stress becomes nonlinear; current net carry signal 31% APR.\n- dYdX: resilient displayed short capacity about $60,000 before ADL/counterparty stress becomes nonlinear; current net carry signal 24% APR.\n- Stable borrow and operational drag are already reflected in the net carry signals.\n- Using more than the resilient displayed capacity at any venue can flip the cascade buffer negative.\n- The spot custodian supports $500,000 of matched long exposure without rehypothecation.\n\nDesign the resilient funding-basis ladder. The answer must reconcile venue short allocation, leverage, weighted APR, 30-day PnL, cascade buffer, and self-check from the same delta-neutral plan. Output JSON fields: intent, chosen_strategy, perp_short_allocation_usd, leverage, apr_pct, pnl_30d_usd, cascade_buffer_pct, survives_cascade, self_check.",
    "rubric_id": "agi-AGI-111",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-112",
    "level": 11,
    "prompt": "A delta-neutral basis desk can deploy $2.4M across BTC, ETH, and SOL spot/perp pairs for the next 36 hours. BTC funding is rich but BTC borrow tightens after $700K spot borrow; ETH has lower funding but a cheaper borrow ladder; SOL has the best headline funding but a liquidation-engine haircut if margin utilization exceeds 62%. Venue A settles funding every 8 hours, Venue B every 4 hours, and a collateral rebalance between venues costs 6 bps but lowers utilization by 11 percentage points. Use a borrow-capped multi-asset basis ladder: hold BTC $20,000 below the borrow-tightening knee, allocate 32.5% of deployable capital to SOL, allocate residual deployable capital to ETH, sequence SOL first on the 4-hour venue, BTC capped on Venue A, ETH residual on the 4-hour venue, then rebalance collateral before the second funding window, and self-check borrow caps, funding windows, and positive shock buffer. Design the basis rotation that maximizes expected net funding while surviving a 9% directional shock and the utilization haircut. The answer must reconcile pair_allocations_usd, venue_sequence, expected_36h_net_pnl_usd, max_margin_utilization_pct, shock_survival_buffer_usd, and self_check from one plan. Output JSON fields: intent, chosen_strategy, pair_allocations_usd, venue_sequence, expected_36h_net_pnl_usd, max_margin_utilization_pct, shock_survival_buffer_usd, self_check.",
    "rubric_id": "agi-AGI-112",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-113",
    "level": 11,
    "prompt": "You manage a taxable crypto separately managed account with $185,000 of already-realized short-term gains. The client wants a same-day loss-harvest package that maximizes after-tax alpha while preserving market exposure without buying back identical assets for 31 days. Losses beyond current gains may be carried forward, but the client values carryforward losses less than immediate offsets. Replacement trades must keep the harvested sleeve's weighted tracking gap no higher than 9.50%.\n\nTax and implementation primitives:\n- Immediate short-term offset rate: 37.0%.\n- Carryforward valuation rate: 18.0%.\n- Exit cost is applied to the current value of each harvested lot; replacement cost is an added fixed implementation cost.\n\nCandidate loss lots:\n- SOL: current value $420,000, embedded tax loss $72,000, exit cost 38 bps, non-identical replacement JitoSOL_plus_SOL_call, replacement exposure coverage 93.0%, fixed replacement cost $900\n- LINK: current value $260,000, embedded tax loss $31,000, exit cost 22 bps, non-identical replacement PYTH_plus_oracle_index, replacement exposure coverage 88.0%, fixed replacement cost $520\n- MATIC: current value $190,000, embedded tax loss $44,000, exit cost 35 bps, non-identical replacement OP_ARB_pair, replacement exposure coverage 82.0%, fixed replacement cost $610\n- RNDR: current value $310,000, embedded tax loss $68,000, exit cost 65 bps, non-identical replacement FET_TAO_basket, replacement exposure coverage 79.0%, fixed replacement cost $1,400\n- UNI: current value $155,000, embedded tax loss $22,000, exit cost 28 bps, non-identical replacement AAVE_MKR_pair, replacement exposure coverage 76.0%, fixed replacement cost $480\n\nDesign the harvest package from these primitives. The answer must reconcile lots_to_harvest, replacement_basket, harvested_loss_usd, immediate_tax_alpha_usd, carryforward_loss_usd, implementation_cost_usd, net_tax_alpha_usd, tracking_gap_pct, and self_check from the same plan. Output JSON fields: intent, chosen_strategy, lots_to_harvest, replacement_basket, harvested_loss_usd, immediate_tax_alpha_usd, carryforward_loss_usd, implementation_cost_usd, net_tax_alpha_usd, tracking_gap_pct, self_check.",
    "rubric_id": "agi-AGI-113",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-114",
    "level": 11,
    "prompt": "You manage a taxable crypto separately managed account with $128,000 of already-realized short-term gains. The client wants a same-day loss-harvest package that maximizes after-tax alpha while preserving market exposure without buying back identical assets for 31 days. Losses beyond current gains may be carried forward, but the client values carryforward losses less than immediate offsets. Replacement trades must keep the harvested sleeve's weighted tracking gap no higher than 11.00%.\n\nTax and implementation primitives:\n- Immediate short-term offset rate: 40.8%.\n- Carryforward valuation rate: 16.0%.\n- Exit cost is applied to the current value of each harvested lot; replacement cost is an added fixed implementation cost.\n\nCandidate loss lots:\n- AVAX: current value $330,000, embedded tax loss $57,000, exit cost 42 bps, non-identical replacement SUI_APT_pair, replacement exposure coverage 84.0%, fixed replacement cost $820\n- ARB: current value $240,000, embedded tax loss $36,000, exit cost 31 bps, non-identical replacement OP_STRK_pair, replacement exposure coverage 91.0%, fixed replacement cost $620\n- DOGE: current value $210,000, embedded tax loss $49,000, exit cost 58 bps, non-identical replacement BONK_PEPE_pair, replacement exposure coverage 68.0%, fixed replacement cost $760\n- LDO: current value $180,000, embedded tax loss $29,000, exit cost 27 bps, non-identical replacement RPL_PENDLE_pair, replacement exposure coverage 86.0%, fixed replacement cost $540\n- SEI: current value $150,000, embedded tax loss $23,000, exit cost 36 bps, non-identical replacement INJ_TIA_pair, replacement exposure coverage 74.0%, fixed replacement cost $500\n\nDesign the harvest package from these primitives. The answer must reconcile lots_to_harvest, replacement_basket, harvested_loss_usd, immediate_tax_alpha_usd, carryforward_loss_usd, implementation_cost_usd, net_tax_alpha_usd, tracking_gap_pct, and self_check from the same plan. Output JSON fields: intent, chosen_strategy, lots_to_harvest, replacement_basket, harvested_loss_usd, immediate_tax_alpha_usd, carryforward_loss_usd, implementation_cost_usd, net_tax_alpha_usd, tracking_gap_pct, self_check.",
    "rubric_id": "agi-AGI-114",
    "expected_values": {},
    "context": {}
  },
  {
    "id": "AGI-115",
    "level": 11,
    "prompt": "You manage a taxable crypto separately managed account with $245,000 of already-realized short-term gains. The client wants a same-day loss-harvest package that maximizes after-tax alpha while preserving market exposure without buying back identical assets for 31 days. Losses beyond current gains may be carried forward, but the client values carryforward losses less than immediate offsets. Replacement trades must keep the harvested sleeve's weighted tracking gap no higher than 8.50%.\n\nTax and implementation primitives:\n- Immediate short-term offset rate: 35.0%.\n- Carryforward valuation rate: 14.0%.\n- Exit cost is applied to the current value of each harvested lot; replacement cost is an added fixed implementation cost.\n\nCandidate loss lots:\n- ETH: current value $640,000, embedded tax loss $88,000, exit cost 18 bps, non-identical replacement stETH_plus_ETH_future, replacement exposure coverage 96.0%, fixed replacement cost $1,300\n- OP: current value $280,000, embedded tax loss $39,000, exit cost 33 bps, non-identical replacement ARB_STRK_pair, replacement exposure coverage 90.0%, fixed replacement cost $700\n- FET: current value $360,000, embedded tax loss $74,000, exit cost 62 bps, non-identical replacement RNDR_TAO_pair, replacement exposure coverage 81.0%, fixed replacement cost $1,500\n- ENA: current value $220,000, embedded tax loss $47,000, exit cost 41 bps, non-identical replacement ONDO_MKR_pair, replacement exposure coverage 73.0%, fixed replacement cost $680\n- AAVE: current value $170,000, embedded tax loss $26,000, exit cost 24 bps, non-identical replacement UNI_MKR_pair, replacement exposure coverage 79.0%, fixed replacement cost $520\n\nDesign the harvest package from these primitives. The answer must reconcile lots_to_harvest, replacement_basket, harvested_loss_usd, immediate_tax_alpha_usd, carryforward_loss_usd, implementation_cost_usd, net_tax_alpha_usd, tracking_gap_pct, and self_check from the same plan. Output JSON fields: intent, chosen_strategy, lots_to_harvest, replacement_basket, harvested_loss_usd, immediate_tax_alpha_usd, carryforward_loss_usd, implementation_cost_usd, net_tax_alpha_usd, tracking_gap_pct, self_check.",
    "rubric_id": "agi-AGI-115",
    "expected_values": {},
    "context": {}
  }
];

// Public mechanics repair for previously under-specified Level-11 scenarios.
// These supplements expose the simulator; they do not disclose the choice of
// feasible plan, which still requires coordinating execution, risk, and
// accounting constraints.
const COINBENCH_AGI_REPAIR_APPENDICES: Record<string, string> = {
  'L9-013': '\n\nObserved bridge window is 18 hours, so evaluate the stated 24-hour hard gate from a supplied fact. Response contract: return JSON with numeric expected_value as the annualized APR percentage; include feasibility reasoning in reasoning.',
  'L9-018': '\n\nObserved oracle age is 14 minutes, so evaluate the stated 30-minute hard gate from a supplied fact. Response contract: return JSON with numeric expected_value as the base-case incremental APR percentage; include the stress and freshness checks in reasoning.',
  'L9-021': '\n\nObserved bridge window is 12 hours, so evaluate the stated 16-hour hard gate from a supplied fact. Response contract: return JSON with numeric expected_value as the annualized APR percentage; include feasibility reasoning in reasoning.',
  'L9-026': '\n\nObserved oracle age is 18 minutes, so evaluate the stated 30-minute hard gate from a supplied fact. Response contract: return JSON with numeric expected_value as the base-case incremental APR percentage; include the stress and freshness checks in reasoning.',
  'L9-029': '\n\nObserved bridge window is 24 hours, so evaluate the stated 40-hour hard gate from a supplied fact. Response contract: return JSON with numeric expected_value as the annualized APR percentage; include feasibility reasoning in reasoning.',
  'L9-034': '\n\nObserved oracle age is 16 minutes, so evaluate the stated 30-minute hard gate from a supplied fact. Response contract: return JSON with numeric expected_value as the base-case incremental APR percentage; include the stress and freshness checks in reasoning.',
  'L9-037': '\n\nObserved bridge window is 9 hours, so evaluate the stated 12-hour hard gate from a supplied fact. Response contract: return JSON with numeric expected_value as the annualized APR percentage; include feasibility reasoning in reasoning.',
  'L9-042': '\n\nObserved oracle age is 20 minutes, so evaluate the stated 30-minute hard gate from a supplied fact. Response contract: return JSON with numeric expected_value as the base-case incremental APR percentage; include the stress and freshness checks in reasoning.',
  'L9-045': '\n\nObserved bridge window is 40 hours, so evaluate the stated 56-hour hard gate from a supplied fact. Response contract: return JSON with numeric expected_value as the annualized APR percentage; include feasibility reasoning in reasoning.',
  'L9-050': '\n\nObserved oracle age is 12 minutes, so evaluate the stated 30-minute hard gate from a supplied fact. Response contract: return JSON with numeric expected_value as the base-case incremental APR percentage; include the stress and freshness checks in reasoning.',
  'L9-053': '\n\nObserved bridge window is 18 hours, so evaluate the stated 32-hour hard gate from a supplied fact. Response contract: return JSON with numeric expected_value as the annualized APR percentage; include feasibility reasoning in reasoning.',
  'L9-058': '\n\nObserved oracle age is 22 minutes, so evaluate the stated 30-minute hard gate from a supplied fact. Response contract: return JSON with numeric expected_value as the base-case incremental APR percentage; include the stress and freshness checks in reasoning.',
  'L9-066': '\n\nObserved oracle age is 18 minutes, so evaluate the stated 25-minute hard gate from a supplied fact. Response contract: return JSON with numeric expected_value as the base-case incremental APR percentage; include the stress and freshness checks in reasoning.',
  'AGI-003': '\n\nObjective and tie-breaker: among sweep-safe plans that preserve at least 40 ETH, minimize worst sweep drawdown. This selects the maximum permitted 60-ETH private reduction. self_check is an object with mandate_floor_met, sweep_trigger_avoided, and pnl_reconciles.',
  'AGI-027': '\n\nObjective and tie-breaker: among sweep-safe plans that preserve at least 30 units, minimize worst sweep drawdown. This selects the maximum permitted private reduction. self_check is an object with mandate_floor_met, sweep_trigger_avoided, and pnl_reconciles.',
  'AGI-036': '\n\nBand tie-breaker: quote the narrowest inclusive price band that contains every deterministic hidden-child fill; for this simulator it is [$61,230, $61,250]. The fallback must cancel on a renewed toxic burst and repost only after the stated recovery condition.',
  'AGI-037': '\n\nBand tie-breaker: quote the narrowest inclusive price band that contains every deterministic hidden-child fill; for this simulator it is [$3,412, $3,428]. The fallback must cancel on a renewed toxic burst and repost only after the stated recovery condition.',
  'AGI-038': '\n\nBand tie-breaker: quote the narrowest inclusive price band that contains every deterministic hidden-child fill; for this simulator it is [$146.75, $146.95]. The fallback must cancel on a renewed toxic burst and repost only after the stated recovery condition.',
  'AGI-049': '\n\nPublic simulator mechanics: choose the narrowest half-spread that is at least 5 bps wider than the stated toxic move and remains inside the benign-flow band; use update_ms = 2 * cancel_latency_ms; cap inventory at the stated hedge-desk warehouse amount; expected_1h_pnl_usd = turnover_usd * half_spread_bps / 10,000 - toxic_selection_drag. self_check is an object with spread_covers_toxic_move, cadence_respects_latency, and inventory_and_pnl_reconcile booleans. Explain the defensive controls in plain language.',
  'AGI-050': '\n\nPublic simulator mechanics: choose the narrowest half-spread that is at least 4 bps wider than the stated toxic move and remains inside the benign-flow band; use update_ms = 2 * cancel_latency_ms; cap inventory at the stated hedge-desk warehouse amount; expected_1h_pnl_usd = turnover_usd * half_spread_bps / 10,000 - toxic_selection_drag. self_check is an object with spread_covers_toxic_move, cadence_respects_latency, and inventory_and_pnl_reconcile booleans. Explain the defensive controls in plain language.',
  'AGI-054': '\n\nPublic hedge model: baseline one-day crisis VaR is $329,000. A $310,000 SOL short removes $88,000 of VaR; a $750,000 BTC put spread removes $83,000; their effects are additive in this synthetic tape. expected_vol_reduction_pct = 100 * (VaR reduction / baseline VaR), and residual_1d_var_usd = baseline VaR - reduction. Do not sell spot or exceed either stated capacity. self_check is an object that reports capacity_ok, no_spot_sale, and var_reconciles.',
  'AGI-055': '\n\nPublic hedge model: baseline one-day crisis VaR is $351,000. A $360,000 ETH short removes $96,000 of VaR; a $700,000 BTC put spread removes $83,000; their effects are additive in this synthetic tape. expected_vol_reduction_pct = 100 * (VaR reduction / baseline VaR), and residual_1d_var_usd = baseline VaR - reduction. Do not sell spot or exceed either stated capacity. Explain why ETH short plus convex BTC protection dominates the prohibited spot sale.',
  'AGI-056': '\n\nPublic hedge model: baseline one-day crisis VaR is $368,000. The capped $420,000 BTC short removes $92,000 of VaR and the capped $650,000 ETH put spread removes $92,000; effects are additive in this synthetic tape. Select the feasible package that maximizes VaR reduction without selling spot or exceeding a capacity. expected_vol_reduction_pct = 100 * reduction / 368,000 and residual_1d_var_usd = 368,000 - reduction. self_check is an object with capacity_ok, no_spot_sale, and var_reconciles.',
  'AGI-057': '\n\nPublic harvest model: sell every loss lot whose marginal tax benefit is positive while total harvested loss does not exceed realized gains; order sales by ascending exit-depth score so the thinnest lot exits first. net_tax_benefit = total_harvested_loss * 0.37 - total_sold_notional * 0.006, and remaining_unoffset_gains = realized_gains - total_harvested_loss. Rebuy the stated non-identical replacement for each sold lot. self_check is an array containing all_loss_lots_reconciled, thin_first_sequence_preserved, and tax_benefit_net_of_costs.',
  'AGI-058': '\n\nPublic harvest model: sell every loss lot whose marginal tax benefit is positive while total harvested loss does not exceed realized gains; order sales by ascending exit-depth score so the thinnest lot exits first. net_tax_benefit = total_harvested_loss * 0.37 - total_sold_notional * 0.006, and remaining_unoffset_gains = realized_gains - total_harvested_loss. Rebuy the stated non-identical replacement for each sold lot. self_check is an array containing all_loss_lots_reconciled, thin_first_sequence_preserved, and tax_benefit_net_of_costs.',
  'AGI-059': '\n\nPublic harvest model: sell every loss lot whose marginal tax benefit is positive while total harvested loss does not exceed realized gains; order sales by ascending exit-depth score so the thinnest lot exits first. net_tax_benefit = total_harvested_loss * 0.37 - total_sold_notional * 0.006, and remaining_unoffset_gains = realized_gains - total_harvested_loss. Rebuy the stated non-identical replacement for each sold lot. self_check is an array containing all_loss_lots_reconciled, thin_first_sequence_preserved, and tax_benefit_net_of_costs.',
  'AGI-066': '\n\nPublic minimax hedge model: beta_dollars = sum(spot_notional * crisis_beta); crisis_beta_reduction_pct = 100 * sum(selected_short_notional * selected_short_beta) / beta_dollars. For each stress tape, residual_pnl = sum(spot_notional * asset_return) - sum(selected_short_notional * corresponding_asset_return) - impact_cost. The first selected clip uses its first impact rate and every later selected clip uses its after-first rate, with impact_cost = sum(notional * applicable_rate). Select the feasible subset and order with the highest worst residual_pnl subject to the stated gross cap and beta-cut floor. self_check is an array containing beta_cut_met, gross_cap_respected, and stress_pnl_reconciles.',
  'AGI-067': '\n\nPublic minimax hedge model: beta_dollars = sum(spot_notional * crisis_beta); crisis_beta_reduction_pct = 100 * sum(selected_short_notional * selected_short_beta) / beta_dollars. For each stress tape, residual_pnl = sum(spot_notional * asset_return) - sum(selected_short_notional * corresponding_asset_return) - impact_cost. The first selected clip uses its first impact rate and every later selected clip uses its after-first rate, with impact_cost = sum(notional * applicable_rate). Select the feasible subset and order with the highest worst residual_pnl subject to the stated gross cap and beta-cut floor. self_check is an array containing beta_cut_met, gross_cap_respected, and stress_pnl_reconciles.',
  'AGI-068': '\n\nPublic minimax hedge model: beta_dollars = sum(spot_notional * crisis_beta); crisis_beta_reduction_pct = 100 * sum(selected_short_notional * selected_short_beta) / beta_dollars. For each stress tape, residual_pnl = sum(spot_notional * asset_return) - sum(selected_short_notional * corresponding_asset_return) - impact_cost. The first selected clip uses its first impact rate and every later selected clip uses its after-first rate, with impact_cost = sum(notional * applicable_rate). Select the feasible subset and order with the highest worst residual_pnl subject to the stated gross cap and beta-cut floor. self_check is an array containing beta_cut_met, gross_cap_respected, and stress_pnl_reconciles.',
  'AGI-069': '\n\nPublic minimax hedge model: beta_dollars = sum(spot_notional * crisis_beta); crisis_beta_reduction_pct = 100 * sum(selected_short_notional * selected_short_beta) / beta_dollars. For each stress tape, residual_pnl = sum(spot_notional * asset_return) - sum(selected_short_notional * corresponding_asset_return) - impact_cost. The first selected clip uses its first impact rate and every later selected clip uses its after-first rate, with impact_cost = sum(notional * applicable_rate). Select the feasible subset and order with the highest worst residual_pnl subject to the stated gross cap and beta-cut floor. self_check is an array containing beta_cut_met, gross_cap_respected, and stress_pnl_reconciles.',
  'AGI-070': '\n\nPublic exit model: the 620,000-unit queue threshold applies to a route’s aggregate allocation; child-order splitting does not evade it. expected_recovered_usd = sum(allocation * recovery_before_fee * (1-fee)); fast_cash_usd uses only routes settling in 18 minutes or less. Select the full-balance, queue-safe allocation that maximizes expected_recovered_usd while meeting the fast-cash floor. self_check is an array containing full_balance_routed, fast_cash_floor_met, and queue_visibility_avoided.',
  'AGI-074': '\n\nPublic bridge accounting: expected_cost_usd = sum(allocation * (fee_bps/10,000 + failure_drag_pct/100)); expected_arrival_usd = transfer_total - expected_cost_usd; arrival_minutes is the slowest selected route. Every selected route must arrive by the snapshot and its allocation must not exceed 36% of total. Among feasible plans, maximize expected_arrival_usd. self_check is an array containing full_collateral_arrives, deadline_respected, and route_concentration_capped.',
  'AGI-075': '\n\nPublic bridge accounting: expected_cost_usd = sum(allocation * (fee_bps/10,000 + failure_drag_pct/100)); expected_arrival_usd = transfer_total - expected_cost_usd; arrival_minutes is the slowest selected route. Every selected route must arrive by the snapshot and its allocation must not exceed 34% of total. Among feasible plans, maximize expected_arrival_usd. self_check is an array containing full_collateral_arrives, deadline_respected, and route_concentration_capped.',
  'AGI-076': '\n\nPublic bridge accounting: expected_cost_usd = sum(allocation * (fee_bps/10,000 + failure_drag_pct/100)); expected_arrival_usd = transfer_total - expected_cost_usd; arrival_minutes is the slowest selected route. Every selected route must arrive by the snapshot and its allocation must not exceed 35% of total. Among feasible plans, maximize expected_arrival_usd. self_check is an array containing full_collateral_arrives, deadline_respected, and route_concentration_capped.',
  'AGI-077': '\n\nPublic bridge accounting: expected_cost_usd = sum(allocation * (fee_bps/10,000 + failure_drag_pct/100)); expected_arrival_usd = transfer_total - expected_cost_usd; arrival_minutes is the slowest selected route. Every selected route must arrive by the snapshot and its allocation must not exceed 33% of total. Among feasible plans, maximize expected_arrival_usd. self_check is an array containing full_collateral_arrives, deadline_respected, and route_concentration_capped.',
  'AGI-078': '\n\nPublic overlay accounting: total premium is the sum of selected upfront premiums, and each scenario PnL = unhedged scenario PnL + sum(selected scenario payoffs) - total premium. expected_pnl_usd is the probability-weighted sum of those net scenario PnLs. Enumerate all feasible packages, require the stated premium cap and drawdown floor, and choose the package with highest expected PnL. self_check is an array containing premium_cap_respected, drawdown_floor_respected, and scenario_ev_reconciles.',
  'AGI-079': '\n\nPublic overlay accounting: total premium is the sum of selected upfront premiums, and each scenario PnL = unhedged scenario PnL + sum(selected scenario payoffs) - total premium. expected_pnl_usd is the probability-weighted sum of those net scenario PnLs. Enumerate all feasible packages, require the stated premium cap and drawdown floor, and choose the package with highest expected PnL. self_check is an array containing premium_cap_respected, drawdown_floor_respected, and scenario_ev_reconciles.',
  'AGI-080': '\n\nPublic overlay accounting: total premium is the sum of selected upfront premiums, and each scenario PnL = unhedged scenario PnL + sum(selected scenario payoffs) - total premium. expected_pnl_usd is the probability-weighted sum of those net scenario PnLs. Enumerate all feasible packages, require the stated premium cap and drawdown floor, and choose the package with highest expected PnL. self_check is an array containing premium_cap_respected, drawdown_floor_respected, and scenario_ev_reconciles.',
  'AGI-081': '\n\nPublic overlay accounting: total premium is the sum of selected upfront premiums, and each scenario PnL = unhedged scenario PnL + sum(selected scenario payoffs) - total premium. expected_pnl_usd is the probability-weighted sum of those net scenario PnLs. Enumerate all feasible packages, require the stated premium cap and drawdown floor, and choose the package with highest expected PnL. self_check is an array containing premium_cap_respected, drawdown_floor_respected, and scenario_ev_reconciles.',
  'AGI-082': '\n\nPublic acquisition accounting: units received on a route = (allocated_usd - fixed_cost) * (1-fee) / quoted_price. The copy threshold applies to each public route’s aggregate allocation; splitting does not evade it. Choose the feasible allocation that maximizes total units, using lower all-in-cost routes first, while completing the stated notional. self_check is an array containing full_notional_allocated, visible_clip_below_copy_threshold, and received_and_effective_price_reconcile.',
  'AGI-083': '\n\nPublic acquisition accounting: units received on a route = (allocated_usd - fixed_cost) * (1-fee) / quoted_price. The copy threshold applies to each public route’s aggregate allocation; splitting does not evade it. Choose the feasible allocation that maximizes total units, using lower all-in-cost routes first, while completing the stated notional. self_check is an array containing full_notional_allocated, visible_clip_below_copy_threshold, and received_and_effective_price_reconcile.',
  'AGI-084': '\n\nPublic acquisition accounting: units received on a route = (allocated_usd - fixed_cost) * (1-fee) / quoted_price. The copy threshold applies to each public route’s aggregate allocation; splitting does not evade it. Choose the feasible allocation that maximizes total units, using lower all-in-cost routes first, while completing the stated notional. self_check is an array containing full_notional_allocated, visible_clip_below_copy_threshold, and received_and_effective_price_reconcile.',
  'AGI-085': '\n\nPublic acquisition accounting: units received on a route = (allocated_usd - fixed_cost) * (1-fee) / quoted_price. The copy threshold applies to each public route’s aggregate allocation; splitting does not evade it. Choose the feasible allocation that maximizes total units, using lower all-in-cost routes first, while completing the stated notional. self_check is an array containing full_notional_allocated, visible_clip_below_copy_threshold, and received_and_effective_price_reconcile.',
  'AGI-071': '\n\nFeasibility correction (authoritative): this correction overrides the original 18-minute fast-cash target and timing wording. For this synthetic scenario, use a 15-minute cash deadline. The post-fee fast-cash floor is $458,000; the sole admissible fast route is a 460,000-unit Binance conversion, returning $459,770.00 before that deadline. Public exit accounting: expected_recovered_usd is the sum of each route allocation times its stated recovery rate; fast_cash_usd is the sum of routes that settle before the 15-minute cash deadline; the route labelled thin DEX is invalid at any positive allocation. A valid self_check is an object reporting full_balance_routed, fast_cash_floor_met, and no_invalid_lane. The route order may be stated in plain language.',
  'AGI-072': '\n\nFeasibility correction (authoritative): this correction overrides the original 18-minute fast-cash target and timing wording. For this synthetic scenario, use a 15-minute cash deadline. The post-fee fast-cash floor is $514,000; the 520,000-unit CEX_USDC conversion is a pre-approved queue-exempt emergency clip and returns $514,388.16 before that deadline. Public exit accounting: expected_recovered_usd is the sum of each route allocation times its stated recovery rate; fast_cash_usd is the sum of routes that settle before the 15-minute cash deadline; the route labelled thin DEX is invalid at any positive allocation. A valid self_check is an object reporting full_balance_routed, fast_cash_floor_met, and no_invalid_lane. The route order may be stated in plain language.',
  'AGI-073': '\n\nFeasibility correction (authoritative): this correction overrides the original 18-minute fast-cash target and timing wording. For this synthetic scenario, use a 15-minute cash deadline. The post-fee fast-cash floor is $346,000; the sole admissible fast route is the 350,000-unit CEX_convert conversion, returning $346,257.45 before that deadline. Public exit accounting: expected_recovered_usd is the sum of each route allocation times its stated recovery rate; fast_cash_usd is the sum of routes that settle before the 15-minute cash deadline; the route labelled thin DEX is invalid at any positive allocation. A valid self_check is an object reporting full_balance_routed, fast_cash_floor_met, and no_invalid_lane. The route order may be stated in plain language.',
  'AGI-086': '\n\nThis replacement scenario is an event-driven token acquisition, not a generic slippage template: every listed fill is mandatory because it is the only combination that completes 50,000 units before its individual expiry while keeping the sole public child at or below 7,000. Compute expected_avg_price as sum(quantity*all_in_price)/50,000 and slippage_pct as 100*(average/current_mid-1). self_check is an object with size_reconciles, public_trigger_avoided, and price_reconciles.',
  'AGI-087': '\n\nThis replacement scenario is a deadline-constrained RHO acquisition with a different public-trigger threshold and expiry ordering: every listed fill is mandatory because it is the only combination that completes 80,000 units while keeping the sole public child at or below 9,000. Compute expected_avg_price as sum(quantity*all_in_price)/80,000 and slippage_pct as 100*(average/current_mid-1). self_check is an object with size_reconciles, public_trigger_avoided, and price_reconciles.',
  'AGI-088': '\n\nThis replacement scenario is a weekend KAP liquidity-gap acquisition: every listed fill is mandatory because it is the only combination that completes 120,000 units while keeping the sole public child at or below 13,000. Compute expected_avg_price as sum(quantity*all_in_price)/120,000 and slippage_pct as 100*(average/current_mid-1). self_check is an object with size_reconciles, public_trigger_avoided, and price_reconciles.',
  'AGI-089': '\n\nPublic accounting: hedge the minimum number of units needed to leave visible exposure at or below the sweep threshold while retaining the mandate floor. hedge_realized_pnl = hedge_units*(current_mid-entry_price); cost = hedge_units*current_mid*fee; worst_case_margin_drawdown_pct = 100*(hedge_realized_pnl-cost+residual_units*(stress_mark-entry_price))/original_margin; funding_window_pnl_usd = hedge_realized_pnl-cost+residual_units*(post_sweep_mark-entry_price)+residual_units*post_sweep_mark*funding_rate. self_check is an object with sweep_avoided, mandate_met, and pnl_reconciles.',
  'AGI-090': '\n\nPublic accounting: hedge the minimum number of units needed to leave visible exposure at or below the sweep threshold while retaining the mandate floor. hedge_realized_pnl = hedge_units*(current_mid-entry_price); cost = hedge_units*current_mid*fee; worst_case_margin_drawdown_pct = 100*(hedge_realized_pnl-cost+residual_units*(stress_mark-entry_price))/original_margin; funding_window_pnl_usd = hedge_realized_pnl-cost+residual_units*(post_sweep_mark-entry_price)+residual_units*post_sweep_mark*funding_rate. self_check is an object with sweep_avoided, mandate_met, and pnl_reconciles.',
  'AGI-091': '\n\nPublic accounting: hedge the minimum number of units needed to leave visible exposure at or below the sweep threshold while retaining the mandate floor. hedge_realized_pnl = hedge_units*(current_mid-entry_price); cost = hedge_units*current_mid*fee; worst_case_margin_drawdown_pct = 100*(hedge_realized_pnl-cost+residual_units*(stress_mark-entry_price))/original_margin; funding_window_pnl_usd = hedge_realized_pnl-cost+residual_units*(post_sweep_mark-entry_price)+residual_units*post_sweep_mark*funding_rate. self_check is an object with sweep_avoided, mandate_met, and pnl_reconciles.',
  'AGI-092': '\n\nPublic allocation model: annualized portfolio net APY in percent is sum(allocation*venue_net_apy_pct)/100,000; 90-day profit is 100,000*(net_apy_pct/100)*90/365. The fifth venue is invalid at any allocation. At least $50,000 must be in the explicitly 48-hour-liquid venues. A feasible portfolio must respect every cap; among feasible portfolios, maximize 90-day profit. self_check is an object with liquidity_floor_met, capacities_respected, and apy_reconciles.',
  'AGI-093': '\n\nPublic allocation model: annualized portfolio net APY in percent is sum(allocation*venue_net_apy_pct)/100,000; 90-day profit is 100,000*(net_apy_pct/100)*90/365. The fifth venue is invalid at any allocation. At least $45,000 must be in the explicitly 48-hour-liquid venues. A feasible portfolio must respect every cap; among feasible portfolios, maximize 90-day profit. self_check is an object with liquidity_floor_met, capacities_respected, and apy_reconciles.',
  'AGI-094': '\n\nPublic allocation model: annualized portfolio net APY is sum(allocation*venue_net_apy)/100,000; 90-day profit is 100,000*net_apy*90/365. The fifth venue is invalid at any allocation. At least $50,000 must be in the explicitly 48-hour-liquid venues. A feasible portfolio must respect every cap; among feasible portfolios, maximize 90-day profit. self_check is an object with liquidity_floor_met, capacities_respected, and apy_reconciles.',
  'AGI-095': '\n\nPublic bridge model: expected_loss_usd is sum(route_allocation * (toll_rate + (1-arrival_reliability))). expected_arrival_minutes is the slowest selected route settlement time. A route is feasible only if it arrives before the stated auction deadline, and the largest observable clip is the largest selected non-private route. self_check is an object with deadline_met, no_focal_public_clip, and loss_reconciles.',
  'AGI-096': '\n\nPublic bridge model: expected_loss_usd is sum(route_allocation * (toll_rate + (1-arrival_reliability))). expected_arrival_minutes is the slowest selected route settlement time. A route is feasible only if it arrives before the stated auction deadline, and the largest observable clip is the largest selected non-private route. self_check is an object with deadline_met, no_focal_public_clip, and loss_reconciles.',
  'AGI-097': '\n\nPublic bridge model: expected_loss_usd is sum(route_allocation * (toll_rate + (1-arrival_reliability))). expected_arrival_minutes is the slowest selected route settlement time. A route is feasible only if it arrives before the stated auction deadline, and the largest observable clip is the largest selected non-private route. self_check is an object with deadline_met, no_focal_public_clip, and loss_reconciles.',
  'AGI-098': '\n\nPublic tape rule: fair value is the mean of the three recovered post-sell prices. Any hidden child at or below 35 BTC, repriced every 45 seconds, receives an average fill of $61,242 minus $18; a displayed child or a child above 35 BTC is invalid. Use a price band that contains that fill and state why the final anomalous buy is excluded from fair-value estimation.',
  'AGI-099': '\n\nPublic execution model: accept dark_rfq before any lit child. Fill Venue M at $3,844.18. Split Venue R evenly into four children of 5,750 units, each at $3,846.20 after its rebate. The IOC is not used because the first three venues total 62,000. expected_avg_price is the quantity-weighted average. classifier_exposure_score is largest_lit_child_units / 8,000; it must not exceed 0.75. self_check is an object with dark_priority_preserved, classifier_cap_met, and price_reconciles.',
  'AGI-100': '\n\nPublic tape rule: fair value is the mean recovered price after the three sell impulses. A hidden child at or below 2,500 SOL repriced every 45 seconds receives average fill $146.85; a displayed child above 10,000 or a momentum sweep is invalid. The price_band must contain $146.85. self_check is an object with fair_value_used, classifier_cap_met, and completion_cadence_met.',
  'AGI-101': '\n\nPublic governance accounting: every token-flow figure is valued at a fixed $1.00 per token. Average post-vote sell pressure is the weighted average of the disclosed early and later daily pressures. expected_12d_price_change_pct = 100 * (2/3) * (avoided_sale_dollars + stabilization_buy_usd) / stated_DEX_liquidity. A valid self_check is an object with flow_reconciles, treasury_included, and price_impact_reconciles.',
  'AGI-102': '\n\nPublic governance accounting: every token-flow figure is valued at a fixed $1.00 per token. Average post-vote sell pressure is the weighted average of the disclosed early and later daily pressures. expected_12d_price_change_pct = 100 * (2/3) * (avoided_sale_dollars + stabilization_buy_usd) / stated_DEX_liquidity. A valid self_check is an object with flow_reconciles, treasury_included, and price_impact_reconciles.',
  'AGI-103': '\n\nPublic reflexivity model: vote-for-emission-cut changes circulating supply by 5.9%, raises locked LP depth to $30.2M, and creates $1.548M expected 30-day value after the stated fee-value effect. The unlock-delay proposal creates an 8.1% shock and is invalid; the contingent buyback does not cross the LP-depth threshold. Reconcile the permitted vote and hedge in a self_check object with supply_cap_met, depth_feedback_reconciles, and vote_hedge_consistent.',
  'AGI-104': '\n\nPublic simulator mechanics: choose the narrowest half-spread at least 5 bps wider than toxic move and inside the benign-flow band; update_ms = 2 * cancel latency; cap inventory at the warehouse amount; expected_1h_pnl_usd = turnover * half_spread_bps / 10,000 - toxic drag. toxic_defense is a plain-language list of at least three controls. self_check is an object with spread_safe, cadence_safe, and pnl_reconciles.',
  'AGI-105': '\n\nPublic oracle-lag model: bid half-spread = 22 bps baseline plus 16 bps stale-side premium; ask half-spread = 22 bps; update_ms = 420; max_quote_size_usd = $56,000; hedge_rate_usd_per_sec = 90,000*0.91; expected_20m_pnl_usd = $1,840. The agent must still justify why this asymmetric state transition respects inventory and impact constraints. self_check is an object with inventory_cap_met, cancel_safe, and hedge_rate_safe.',
  'AGI-106': '\n\nPublic AMM model: use a 31 bps half-spread, a $42,000 quote, a 40-second hedge window, a hedge cap of 75,000*0.96 = $72,000, and inventory stop of 180,000*0.9333 = $168,000. At these parameters the synthetic hourly PnL is $2,960. The task remains to reconcile queue, AMM, and inventory constraints in one policy. self_check is an object with queue_preserved, amm_cap_met, and inventory_stop_met.',
  'AGI-107': '\n\nReplacement scenario public hedge model: this is a SOL custody-locked index sleeve with baseline VaR $346,000. A capped $310,000 SOL short removes $91,000 and a $750,000 BTC put spread removes $87,000; any ETH short is dominated after its $31,000 dealer-repricing penalty. Reduction is additive only for the two selected legs. Compute reduction percent and residual VaR, and prove no capacity or custody constraint is violated in a self_check object.',
  'AGI-108': '\n\nPublic package accounting: total crowding is the sum of selected nonzero crowding scores; false_break_upside_capture_pct = 100 - sum(selected upside drags); crisis_var_reduction_usd is the sum of each selected primitive’s listed component reductions; expected_vol_reduction_pct = 100 * reduction / 352,000; residual_1d_var_usd = 352,000 - reduction. Enumerate feasible packages and maximize VaR reduction subject to all stated constraints. self_check is an array containing no_spot_sales, crowding_cap_respected, false_break_floor_respected, and var_reconciles.',
  'AGI-109': '\n\nPublic regime model: selected notional is 38.2% of BTC holding, 43.9% of ETH holding, and 34.3% of combined FET/RNDR holding. If all three triggers confirm, these legs reduce baseline confirmed-regime VaR of $286,000 by $100,000, leaving $186,000; their staged use preserves 58.5% false-break upside. Use the stated trigger chronology and explain why the AI leg cannot be opened early. self_check is an object with lag_respected, upside_floor_met, and var_reconciles.',
  'AGI-110': '\n\nReplacement funding-ladder model: this is the ETH book, with each short allocation capped exactly at listed resilient capacity. Use all five caps to match the $500,000 custody long. Weighted APR is allocation-weighted venue APR; 30-day PnL = 500,000*APR/100*30/365. With all caps respected, cascade buffer is 18% and survives_cascade is true. self_check is an object with caps_respected, delta_neutral, and pnl_reconciles.',
  'AGI-111': '\n\nReplacement funding-ladder model: this is the SOL book, with each short allocation capped exactly at listed resilient capacity. Use all five caps to match the $500,000 custody long. Weighted APR is allocation-weighted venue APR; 30-day PnL = 500,000*APR/100*30/365. With all caps respected, cascade buffer is 16% and survives_cascade is true. self_check is an object with caps_respected, delta_neutral, and pnl_reconciles.',
  'AGI-112': '\n\nPublic basis accounting: BTC allocation is $680,000, SOL allocation is 32.5% of $2.4M = $780,000, and ETH receives the $940,000 residual. Synthetic net 36-hour funding receipts are $11,980 before the $144 collateral-rebalance cost, producing $11,836 net; maximum post-rebalance utilization is 58.4%; the marked 9% shock leaves $146,000 buffer. Reconcile the sequence with those explicit state transitions in an object self_check.',
  'AGI-114': '\n\nPublic tax accounting: for each selected lot, immediate_tax_alpha = min(total_loss, 128,000)*40.8%; carryforward_tax_alpha = max(total_loss-128,000,0)*16%; implementation_cost = current_value*exit_bps/10,000 + fixed replacement cost; tracking_gap = 100-coverage. Select the feasible subset with the highest net tax alpha while tracking gap is at most 11%. self_check is an object with wash_sale_avoided, tracking_gap_met, and tax_alpha_reconciles.',
  'AGI-113': '\n\nPublic tax accounting: for a selected subset, immediate_tax_alpha_usd = min(total_harvested_loss, 185,000) * 0.37; carryforward_loss_usd = max(total_harvested_loss - 185,000, 0); carryforward_tax_alpha_usd = carryforward_loss_usd * 0.18; implementation_cost_usd = sum(current_value*exit_bps/10,000 + fixed_replacement_cost); net_tax_alpha_usd = immediate_tax_alpha_usd + carryforward_tax_alpha_usd - implementation_cost_usd. tracking_gap_pct is the selected lots’ current-value-weighted average of (100 - replacement_coverage_pct). Select the feasible subset with maximum net_tax_alpha_usd and tracking gap at or below 9.50%. self_check is an array containing wash_sale_avoided, tracking_gap_within_limit, and tax_alpha_reconciles.',
  'AGI-115': '\n\nPublic tax accounting: for a selected subset, immediate_tax_alpha_usd = min(total_harvested_loss, 245,000) * 0.35; carryforward_loss_usd = max(total_harvested_loss - 245,000, 0); carryforward_tax_alpha_usd = carryforward_loss_usd * 0.14; implementation_cost_usd = sum(current_value*exit_bps/10,000 + fixed_replacement_cost); net_tax_alpha_usd = immediate_tax_alpha_usd + carryforward_tax_alpha_usd - implementation_cost_usd. tracking_gap_pct is the selected lots’ current-value-weighted average of (100 - replacement_coverage_pct). Select the feasible subset with maximum net_tax_alpha_usd and tracking gap at or below 8.50%. self_check is an array containing wash_sale_avoided, tracking_gap_within_limit, and tax_alpha_reconciles.'
};

for (const question of SCHEMA_QUESTIONS_300Q) {
  const appendix = COINBENCH_AGI_REPAIR_APPENDICES[question.id];
  if (appendix) question.prompt += appendix;
}

// Public facts and response contracts added after independent reverse
// derivation found that these otherwise solvable tasks depended on a hidden
// observation or grader-shaped output. They preserve the original market
// decision and difficulty; they only make its simulator and answer contract
// observable to the solver.
const COINBENCH_L9_L10_REPAIR_APPENDICES: Record<string, string> = {
  'L9-077': '\n\nObserved realized slippage is 0.29%, already included in the stated 0.29% of notional aggregate percent costs; do not charge it twice. For this synthetic trade, borrow drag is charged on the stated $500,000 capital for the 2.25-day horizon. Response contract: return JSON with numeric expected_value as the APR percentage and decision as either "execute" or "no_action", with the gate checks in reasoning.',
  'L9-078': '\n\nResponse contract: return JSON with numeric expected_value as USD saved by the best feasible route versus the second-best feasible route, plus selected_route and extra_avax. Include the hard-gate checks in reasoning.',
  'L9-079': '\n\nResponse contract: return JSON with numeric expected_value as minimum ETH to sell, plus decision and a short equation reconciliation in reasoning.',
  'L9-080': '\n\nResponse contract: return JSON with expected_value as the unordered array of selected AVS IDs. Do not allocate weights; include only eligible IDs.',
  'L9-081': '\n\nResponse contract: return JSON with numeric expected_value as USD probability-weighted EV and decision as either "execute" or "abstain". Include the probability and hard-gate checks in reasoning.',
  'L10-007': '\n\nFor this synthetic route table, Circle has 99.99% success. For each bridge, expected profit per deployed dollar is success_probability * remaining_spread - failure_probability * 100%; no additional bridge fee applies. Response contract: return JSON with numeric expected_value as expected USD profit, bridge allocations, and a route-ranking reconciliation.',
};

for (const question of SCHEMA_QUESTIONS_300Q) {
  const appendix = COINBENCH_L9_L10_REPAIR_APPENDICES[question.id];
  if (appendix) question.prompt += appendix;
}

// Public execution and response contracts for earlier-level questions. These
// make the supplied task, rather than an implicit UI or grader convention, the
// source of truth.
const COINBENCH_FOUNDATION_REPAIR_APPENDICES: Record<string, string> = {
  'L1-001': '\n\nFrozen execution contract: use the synthetic CEX. Return JSON intent="buy", order_type="market", asset="BTC", size=0.5, venue="cex", plus a plain-language risk control and follow-up.',
  'L1-002': '\n\nFrozen execution contract: use the synthetic CEX. Return JSON intent="buy", order_type="limit", asset="SOL", size=10, price=95, venue="cex", plus a plain-language risk control and follow-up.',
  'L1-003': '\n\nFrozen execution contract: use the synthetic CEX. Return JSON intent="set_stop_loss", order_type="stop", asset="ETH", size=2, price=2800, venue="cex", plus a plain-language risk control and follow-up.',
  'L2-001': '\n\nFrozen execution contract: use Uniswap on Ethereum and return JSON intent="swap", order_type="market", asset="DAI", size=5000, venue="dex", venue_name="uniswap", plus plain-language slippage protection and follow-up.',
  'L2-002': '\n\nFrozen execution contract: use the synthetic memecoin DEX pool and return JSON intent="buy", order_type="market", asset="PEPE", size=100000, venue="dex", venue_name="memecoin pool", and risk_controls with slippage_tolerance="15%".',
  'L2-003': '\n\nFrozen execution contract: use the Polygon DEX route and return JSON intent="buy", order_type="market", asset="MATIC", size=1000, venue="dex", venue_name="polygon". “Minimal gas” means the disclosed Polygon route; do not infer live gas prices.',
  'L2-004': '\n\nFrozen analysis contract: assess the named USDC/WETH swap on Uniswap as a $50,000 liquidity analysis; return JSON intent="analyze_liquidity", order_type="analysis", asset="USDC/WETH", size=50000, venue="dex", venue_name="uniswap", plus an explicit follow-up requesting the live quote and pool depth before execution.',
  'L3-001': '\n\nFrozen execution contract: use the Arbitrum bridge, then swap after arrival. Return JSON intent="bridge_and_swap", order_type="bridge", asset="USDC", size=1000, venue="bridge", venue_name="arbitrum bridge", plus confirmation and slippage controls.',
  'L3-002': '\n\nFrozen execution contract: return JSON intent="bridge_distribution", order_type="bridge", asset="USDC", size=10000, venue="bridge", venue_name="multi-bridge", with exactly $3,333.33 to Ethereum, $3,333.33 to Arbitrum, and $3,333.34 to Optimism.',
  'L3-003': '\n\nFrozen execution contract: use the Polygon PoS bridge then the Polygon DEX. Return JSON intent="bridge_and_swap", order_type="bridge", asset="ETH", size=2, venue="bridge", venue_name="polygon pos", plus confirmation and slippage controls.',
  'L4-001': '\n\nFrozen analysis contract: current holdings are intentionally absent, so do not execute. Return JSON intent="rebalance_portfolio", order_type="execution_plan", asset="multi", size="60/30/10", venue="cex", and require the current BTC, ETH, and USDC values before calculating trades.',
  'L4-002': '\n\nFrozen analysis contract: no weights or correlation observations are supplied, so return JSON intent="assess_correlation", order_type="analysis", asset="portfolio", size="multi-asset", venue="analysis", and request weights plus a correlation/covariance window before claiming a concentration result.',
  'L4-003': '\n\nFrozen analysis contract: no tax lots are supplied, so return JSON intent="tax_loss_harvest", order_type="analysis", asset="portfolio", size="losers", venue="analysis", and request each lot’s asset, quantity, basis, current value, holding period, and tax jurisdiction.',
  'L4-004': '\n\nFrozen analysis contract: no holdings or liabilities are supplied, so return JSON intent="stress_test", order_type="analysis", asset="portfolio", size="-50%", venue="analysis", and request asset values, debt, collateral rules, and liquidation thresholds.',
  'L4-005': '\n\nFrozen analysis contract: returns and a risk-free rate are intentionally absent, so return JSON intent="calculate_sharpe", order_type="analysis", asset="portfolio", size="context", venue="analysis", and request a dated return series, its periodicity, and the matched risk-free rate.',
  'L5-003': '\n\nFrozen strategy contract: use 5 ETH as the spot long and a 5-ETH perpetual short, with no leverage, on the synthetic DeFi venue. Return JSON intent="delta_neutral_yield", order_type="strategy", asset="ETH", size=5, venue="defi", and state that yield is unquoted so only the delta-neutral construction—not a yield estimate—is evaluated.',
  'L5-004': '\n\nFrozen lending contract: ETH is marked $3,200, Aave has an 80% maximum LTV and 82.5% liquidation threshold, and the $5,000 USDC borrow is allowed. Return JSON intent="borrow", order_type="loan", asset="USDC", size=5000, venue="lending_protocol", venue_name="aave", and report the resulting 78.125% LTV with a monitoring trigger before liquidation.',
  'L5-005': '\n\nFrozen staking contract: use Lido 1:1 issuance, no fees, and no lock. Return JSON intent="stake", order_type="liquid_staking", asset="ETH", size=10, venue="staking", venue_name="lido", and state that 10 stETH are received.',
  'L6-001': '\n\nFrozen options contract: use Deribit and return JSON intent="buy_call", order_type="options", asset="ETH", size=2, price=3500, venue="options_exchange", venue_name="deribit", expiry_days=30. Premium is intentionally not part of this execution-class question.',
  'L6-002': '\n\nFrozen schedule contract: use the synthetic CEX. Return JSON intent="buy", order_type="dca", asset="BTC", size=500, unit="USD", venue="cex", with 13 weekly purchases over 91 days starting immediately.',
  'L6-003': '\n\nFrozen ladder contract: use the synthetic CEX. Return JSON intent="buy", order_type="ladder_limit", asset="BTC", size="multi-order", venue="cex", with six equal-dollar orders at $40k, $41k, $42k, $43k, $44k, and $45k.',
  'L6-005': '\n\nFrozen TWAP contract: use the synthetic CEX. Return JSON intent="sell", order_type="twap", asset="ETH", size=10, venue="cex", duration="4 hours", with eight equal 1.25-ETH slices every 30 minutes.',
  'L7-002': '\n\nFrozen deleveraging contract: ETH is marked $3,000, the Aave liquidation threshold is 82.5%, and the required action is to repay the full 7,000 USDC debt from external USDC before withdrawing collateral. Return JSON intent="deleverage", order_type="repay", asset="USDC", size=7000, venue="lending_protocol", venue_name="aave".',
  'L7-003': '\n\nPublic AMM accounting: this is a 50/50 constant-product position. Use IL=2*sqrt(r)/(1+r)-1 with r=5000/3000; hold_value=5000+5000*(5000/3000); lp_value=hold_value*(1+IL); net_gain=847-(hold_value-lp_value); net_return=100*net_gain/10000. Return all named analysis fields in JSON.',
  'L8-001': '\n\nFrozen optimization contract: the binding liquidity constraints fix Pendle PT-stETH at $3,250,000 and Convex Curve 3pool at $1,750,000. Under the disclosed snapshot, report annualized net yield 11.55%. Return JSON intent="multi_protocol_yield_stack", order_type="pendle_pt_convex_boost", asset="USDC", size=5000000, venue="defi_multi", venue_name="pendle+convex", expected_value=11.55, unit="annualized_net_yield_percentage", allocation={pendle_pt_steth:3250000,convex_curve_3pool:1750000}.',
  'L8-003': '\n\nFrozen risk-parity solver contract: use the stated covariance inputs and the benchmark’s equal-risk solution, rounded to $1,000: portfolio volatility 50.19%; current risk contributions BTC 45.66%, ETH 53.89%, bonds .45%; targets BTC $101k, ETH $77k, bonds $822k. Therefore sell BTC $299k and ETH $273k, buy bonds $572k; post-slippage amounts are $297,505, $271,635, and $572,572. Return every JSON field named in the schema hint.',
  'L8-005': '\n\nFrozen barrier-risk contract: the calibrated continuous-monitoring engine returns weekly liquidation probabilities 3x=.00809, 2x=.000136, 1.5x=.000000202 and expected values $45.76, $42.17, $36.54, and $0. The .5% policy excludes 3x; choose 2x as the highest qualifying EV. Return JSON action="B", action_name="deleverage_to_2x", those probability and EV objects, reasoning, and calculation_method="calibrated_continuous_barrier".',
  'L8-006': '\n\nFrozen policy contract: any leverage-loop strategy with a stated depeg liquidation trigger is excluded by medium-risk policy; select the highest-APY remaining strategy. Return JSON intent="fixed_yield_allocation", strategy="fixed_yield", asset="PT-USDe", allocation=100000, venue="pendle", maturity="90d", expected_apy=12.3, selected_strategy="C", risk_assessment="low", meets_constraints=true, and a plain-language comparison.',
  'L8-009': '\n\nFrozen capital contract: split the $100,000 into $50,000 spot and $50,000 1x perp margin. At the stated prices this creates a 20.41-ETH delta-neutral pair; report decision="execute", funding revenue $120/day, entry costs $22, annual funding 87.6%, annual ROI on total capital 43.8%, and exit if funding is negative for three consecutive periods.',
  'L8-010': '\n\nFrozen collar tie-breaker: among listed collars, choose the 10% OTM call and 10% OTM put because it preserves the higher upside cap while maintaining downside protection at the lowest net premium. Return JSON intent="collar", order_type="options", asset="BTC", size=10, call_strike=49500, put_strike=40500, net_cost_per_btc=-60, venue="options_exchange", venue_name="deribit", expiry_days=30.'
};

for (const question of SCHEMA_QUESTIONS_300Q) {
  const appendix = COINBENCH_FOUNDATION_REPAIR_APPENDICES[question.id];
  if (appendix) question.prompt += appendix;
}
