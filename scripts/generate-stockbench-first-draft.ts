#!/usr/bin/env tsx
/**
 * StockBench generated-expansion builder (leakage-free rebuild).
 *
 * Design rules (enforced by scripts/stockbench-quality-gate.ts and
 * scripts/mutation-test-stockbench.ts):
 *   - NO answer leakage. Routes are neutral (Route A/B/C with ids route_a..).
 *     Feasibility is NEVER pre-labeled in the prompt; it must be derived from
 *     stated market facts (margins, premiums, multipliers, settlement, locate).
 *   - Real per-domain mechanics. Each scenario_family implements its actual
 *     market structure and contains its signature terms.
 *   - Tier escalation. L9 base; L10 adds a route + residual recompute; AGI adds
 *     stress-scenario PnL reconciliation + a derived self_check.
 *   - Deterministic, self-contained answers. Every graded field is computable
 *     from the frozen packet.
 *
 * No paid model calls.
 */
import fs from 'fs';
import path from 'path';

type Domain =
  | 'Spot equities / ETFs'
  | 'Shorting / borrow / margin / locates'
  | 'Listed options strategy / Greeks'
  | 'Futures / commodities / spreads / rolls'
  | 'Spot FX / CFDs / multi-currency'
  | 'Portfolio risk / rebalancing'
  | 'Execution / liquidity / microstructure'
  | 'Corporate actions / settlement / calendar / jurisdiction'
  | 'Feasibility / rejection / no-trade traps';

type Tier = 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6' | 'L7' | 'L8' | 'L9' | 'L10' | 'AGI';

type Question = {
  id: string;
  level: number;
  type: 'schema';
  rubric_id: string;
  prompt: string;
  expected_values: Record<string, unknown>;
  context: Record<string, unknown>;
};

type Packet = {
  prompt: string;
  expected: Record<string, unknown>;
  deterministic: string[];
  derivation: string;
  failureModes: string[];
  mustNot: string[];
  family?: string; // honest scenario_family override (used by low/mid tiers)
};

const ROOT = process.cwd();
const OUT_QUESTIONS = path.join(ROOT, 'src/questions/stockbench-generated-questions.ts');
const RUBRIC_DIR = path.join(ROOT, 'src/rubrics');

const tierTargets: Record<Tier, number> = {
  L1: 3, L2: 4, L3: 3, L4: 5, L5: 5, L6: 5, L7: 5, L8: 10, L9: 81, L10: 69, AGI: 110,
};
const existingTierCounts: Record<Tier, number> = {
  L1: 1, L2: 1, L3: 1, L4: 1, L5: 1, L6: 1, L7: 1, L8: 1, L9: 7, L10: 7, AGI: 8,
};
const domainTargets: Record<Domain, number> = {
  'Spot equities / ETFs': 20,
  'Shorting / borrow / margin / locates': 35,
  'Listed options strategy / Greeks': 55,
  'Futures / commodities / spreads / rolls': 50,
  'Spot FX / CFDs / multi-currency': 30,
  'Portfolio risk / rebalancing': 40,
  'Execution / liquidity / microstructure': 35,
  'Corporate actions / settlement / calendar / jurisdiction': 20,
  'Feasibility / rejection / no-trade traps': 15,
};
const existingDomainCounts: Record<Domain, number> = {
  'Spot equities / ETFs': 2,
  'Shorting / borrow / margin / locates': 4,
  'Listed options strategy / Greeks': 6,
  'Futures / commodities / spreads / rolls': 5,
  'Spot FX / CFDs / multi-currency': 3,
  'Portfolio risk / rebalancing': 4,
  'Execution / liquidity / microstructure': 3,
  'Corporate actions / settlement / calendar / jurisdiction': 2,
  'Feasibility / rejection / no-trade traps': 1,
};
const bucketTargets: Record<Domain, Record<string, number>> = {
  // AGI reallocated (amendment 2026-06-16): AGI concentrated in genuine-synthesis domains
  // (options/futures/portfolio/shorting = 98/110); non-hedge feasibility/conversion content
  // demoted into L9/L10. Per-tier totals (15/25/81/69/110) and per-domain totals unchanged.
  'Spot equities / ETFs': { 'L1-L4': 4, 'L5-L8': 4, L9: 6, L10: 6, AGI: 0 },
  'Shorting / borrow / margin / locates': { 'L1-L4': 1, 'L5-L8': 3, L9: 6, L10: 6, AGI: 19 },
  'Listed options strategy / Greeks': { 'L1-L4': 2, 'L5-L8': 4, L9: 10, L10: 9, AGI: 30 },
  'Futures / commodities / spreads / rolls': { 'L1-L4': 2, 'L5-L8': 4, L9: 10, L10: 8, AGI: 26 },
  'Spot FX / CFDs / multi-currency': { 'L1-L4': 2, 'L5-L8': 3, L9: 12, L10: 11, AGI: 2 },
  'Portfolio risk / rebalancing': { 'L1-L4': 1, 'L5-L8': 2, L9: 8, L10: 6, AGI: 23 },
  'Execution / liquidity / microstructure': { 'L1-L4': 2, 'L5-L8': 3, L9: 14, L10: 12, AGI: 4 },
  'Corporate actions / settlement / calendar / jurisdiction': { 'L1-L4': 1, 'L5-L8': 2, L9: 8, L10: 7, AGI: 2 },
  'Feasibility / rejection / no-trade traps': { 'L1-L4': 0, 'L5-L8': 0, L9: 7, L10: 4, AGI: 4 },
};
const existingBucketCounts: Record<Domain, Record<string, number>> = {
  'Spot equities / ETFs': { 'L1-L4': 1, 'L5-L8': 0, L9: 0, L10: 1, AGI: 0 },
  'Shorting / borrow / margin / locates': { 'L1-L4': 1, 'L5-L8': 0, L9: 1, L10: 1, AGI: 1 },
  'Listed options strategy / Greeks': { 'L1-L4': 0, 'L5-L8': 1, L9: 1, L10: 2, AGI: 2 },
  'Futures / commodities / spreads / rolls': { 'L1-L4': 1, 'L5-L8': 0, L9: 1, L10: 1, AGI: 2 },
  'Spot FX / CFDs / multi-currency': { 'L1-L4': 1, 'L5-L8': 0, L9: 1, L10: 1, AGI: 0 },
  'Portfolio risk / rebalancing': { 'L1-L4': 0, 'L5-L8': 1, L9: 1, L10: 1, AGI: 1 },
  'Execution / liquidity / microstructure': { 'L1-L4': 0, 'L5-L8': 1, L9: 1, L10: 0, AGI: 1 },
  'Corporate actions / settlement / calendar / jurisdiction': { 'L1-L4': 0, 'L5-L8': 1, L9: 1, L10: 0, AGI: 0 },
  'Feasibility / rejection / no-trade traps': { 'L1-L4': 0, 'L5-L8': 0, L9: 0, L10: 0, AGI: 1 },
};
const levelByTier: Record<Tier, number> = {
  L1: 1, L2: 2, L3: 3, L4: 4, L5: 5, L6: 6, L7: 7, L8: 8, L9: 9, L10: 10, AGI: 11,
};
const domains = Object.keys(domainTargets) as Domain[];
const tiers = Object.keys(tierTargets) as Tier[];
const scenarioFamilies: Record<Domain, string[]> = {
  'Spot equities / ETFs': ['equity_order_ticket', 'etf_sector_rebalance_t_plus_one', 'opening_auction_limit', 'market_on_close_rebalance'],
  'Shorting / borrow / margin / locates': ['short_locate_failure', 'borrow_cost_vs_trade_edge', 'hard_to_borrow_margin_recall', 'locate_recall_options_substitution'],
  'Listed options strategy / Greeks': ['covered_call_assignment', 'put_spread_downside_floor', 'early_assignment_dividend_risk', 'exercise_assignment_roll_decision'],
  'Futures / commodities / spreads / rolls': ['futures_beta_hedge', 'futures_roll_calendar', 'commodity_roll_basis_hedge', 'span_margin_calendar_spread'],
  'Spot FX / CFDs / multi-currency': ['fx_settlement_mismatch', 'cfd_margin_regional_constraint', 'multi_currency_cash_buffer', 'forward_vs_spot_payment'],
  'Portfolio risk / rebalancing': ['beta_dollar_rebalance', 'multi_asset_drawdown_hedge', 'cross_asset_var_liquidity_triage', 'risk_budget_rebalance'],
  'Execution / liquidity / microstructure': ['order_book_liquidity_limit', 'invalid_route_session_trap', 'auction_session_constraint', 'twap_slippage_limit'],
  'Corporate actions / settlement / calendar / jurisdiction': ['ex_dividend_adjustment', 't_plus_one_settlement_sequence', 'corporate_action_adjustment', 'regional_market_holiday'],
  'Feasibility / rejection / no-trade traps': ['no_trade_invalid_route', 'borrow_recall_margin_hedge', 'unsupported_product_permission', 'session_permission_rejection'],
};
const usedAnchorOrdinals: Record<Tier, Set<number>> = {
  L1: new Set([1]), L2: new Set([1]), L3: new Set([1]), L4: new Set([1]),
  L5: new Set([1]), L6: new Set([1]), L7: new Set([1]), L8: new Set([1]),
  L9: new Set([1, 2, 3, 4, 5, 6, 7]),
  L10: new Set([1, 2, 3, 4, 5, 6, 7]),
  AGI: new Set([1, 2, 3, 4, 5, 6, 7, 8]),
};
const tierOrdinals = Object.fromEntries(tiers.map(t => [t, 1])) as Record<Tier, number>;

function nextId(tier: Tier): string {
  while (usedAnchorOrdinals[tier].has(tierOrdinals[tier])) tierOrdinals[tier] += 1;
  const n = tierOrdinals[tier]++;
  return `SB-${tier}-${String(n).padStart(3, '0')}`;
}
function round2(v: number): number { return Math.round(v * 100) / 100; }
function bucketFor(tier: Tier): string {
  if (['L1', 'L2', 'L3', 'L4'].includes(tier)) return 'L1-L4';
  if (['L5', 'L6', 'L7', 'L8'].includes(tier)) return 'L5-L8';
  return tier;
}
function capTag(tier: Tier, index: number): string {
  if (tier === 'L1' || tier === 'L5') return 'execution_action_quality';
  return index % 3 === 0 ? 'judgment_risk_augmentation' : 'execution_action_quality';
}
function compact(values: Record<string, unknown>): string {
  return `{ ${Object.keys(values).map(k => `"${k}"`).join(', ')} }`;
}
function objectiveFor(tier: Tier, text: string): string | undefined {
  if (!['L9', 'L10', 'AGI'].includes(tier)) return undefined;
  return text;
}

const ETF_SYMS = new Set(['SPY', 'QQQ', 'IWM', 'GLD', 'XLK', 'XLF', 'XLE', 'SLV', 'TLT']);
const EQ_SYMS = ['SPY', 'QQQ', 'IWM', 'AAPL', 'MSFT', 'NVDA', 'TSLA', 'XLK', 'XLF', 'GLD'];
function instr(sym: string): string { return ETF_SYMS.has(sym) ? `${sym} ETF` : `${sym} common stock`; }
function symFor(seed: number): string { return EQ_SYMS[seed % EQ_SYMS.length]; }

const ROUTE_LABELS = ['Route A', 'Route B', 'Route C', 'Route D'];
const ROUTE_IDS = ['route_a', 'route_b', 'route_c', 'route_d'];
// Render candidate routes WITHOUT any feasibility tell. Each entry is raw facts only.
function renderRoutes(facts: string[]): string {
  return facts.map((f, i) => `- ${ROUTE_LABELS[i]} (${ROUTE_IDS[i]}): ${f}`).join('\n');
}

const BUSINESS_DATES = [
  ['2026-06-15', '2026-06-16'], ['2026-06-16', '2026-06-17'], ['2026-06-17', '2026-06-18'],
  ['2026-06-18', '2026-06-19'], ['2026-06-19', '2026-06-22'], ['2026-06-22', '2026-06-23'],
  ['2026-06-23', '2026-06-24'], ['2026-06-24', '2026-06-25'],
];
function tPlusOne(seed: number): { trade: string; settle: string } {
  const [trade, settle] = BUSINESS_DATES[seed % BUSINESS_DATES.length];
  return { trade, settle };
}

// AGI stress-scenario reconciliation: base PnL + chosen route's per-scenario effect - cost.
const SCENARIO_POOLS = [
  ['risk_off', 'squeeze', 'idiosyncratic_gap', 'liquidity_drain'],
  ['rate_shock', 'vol_spike', 'credit_widening', 'flight_to_quality'],
  ['gap_down', 'melt_up', 'range_chop', 'sector_rotation'],
];
function agiScenario(seed: number, effect: { risk_off: number; squeeze: number; gap: number }, cost: number) {
  // Vary the stress-scenario block by seed (name pool + 3-or-4 scenario count) so AGI rows are
  // cognitively distinct, not 110 copies of one block. Keys are always named in the prompt.
  const effArr = [effect.risk_off, effect.squeeze, effect.gap, Math.round((effect.risk_off + effect.gap) / 2)];
  const zeroEffect = effArr.every(e => e === 0);
  const count = 2 + (seed % 3); // 2-4 scenarios; varies per row and survives skeleton masking (line count)
  const names = SCENARIO_POOLS[seed % SCENARIO_POOLS.length].slice(0, count);
  const baseVals = [
    -120000 - (seed % 6) * 5000,
    40000 + (seed % 5) * 4000,
    -70000 - (seed % 4) * 3000,
    -50000 - (seed % 3) * 6000,
  ];
  const scenario_pnl: Record<string, number> = {};
  const baseLines: string[] = [];
  for (let i = 0; i < count; i++) {
    scenario_pnl[names[i]] = baseVals[i] + effArr[i] - cost;
    baseLines.push(`- ${names[i]}: ${baseVals[i]} USD.`);
  }
  const worst_case_pnl = Math.min(...Object.values(scenario_pnl));
  const effDesc = zeroEffect
    ? `This action does not hedge the book (no per-scenario market effect), so each scenario's PnL is the frozen base PnL minus the action's cash cost (${cost} USD).\n`
    : `The selected route's per-scenario hedge effect (before cost) is: ${names.map((n, i) => `${n} ${effArr[i] >= 0 ? '+' : ''}${effArr[i]}`).join(', ')} USD. Apply this effect to each scenario, then subtract the ${cost} USD cash cost from every scenario.\n`;
  const block = `\nFrozen scenario PnL before action:\n${baseLines.join('\n')}\n` + effDesc;
  return { scenario_pnl, worst_case_pnl, block, names };
}

// ----------------------------------------------------------------------------
// HARD-TIER DOMAIN BUILDERS (L9 / L10 / AGI). Neutral routes, derived feasibility.
// ----------------------------------------------------------------------------

function escalationFields(
  tier: Tier,
  seed: number,
  expected: Record<string, unknown>,
  deterministic: string[],
  chosenEffect: { risk_off: number; squeeze: number; gap: number },
  cost: number,
  selfChecks: Record<string, boolean>,
): { extraPrompt: string; objective: string } {
  if (tier === 'AGI') {
    const sc = agiScenario(seed, chosenEffect, cost);
    expected.scenario_pnl = sc.scenario_pnl;
    expected.worst_case_pnl = sc.worst_case_pnl;
    expected.self_check = selfChecks;
    for (const n of sc.names) deterministic.push(`scenario_pnl.${n}`);
    deterministic.push('worst_case_pnl');
    return {
      extraPrompt: sc.block,
      objective: 'select the feasible route required by the constraints, then reconcile stress-scenario PnL and report the worst case',
    };
  }
  if (tier === 'L10') {
    expected.residual_check = 'recomputed';
    return { extraPrompt: '\nAfter selecting, recompute residual exposure/cost so the choice is self-consistent.\n', objective: 'select the lowest-cost feasible route and recompute residual exposure after the trade' };
  }
  return { extraPrompt: '', objective: 'select the feasible route that satisfies all stated constraints at the lowest cost' };
}

// ---- Portfolio risk / rebalancing ----
function buildPortfolio(tier: Tier, family: string, seed: number): Packet {
  const beta = 800000 + (seed % 9) * 50000;
  const price = 5000 + (seed % 11) * 25; // ES index points
  const mult = 50;
  const notionalPer = price * mult; // beta-dollars hedged per ES contract
  const target = 0.4 + (seed % 3) * 0.05; // min reduction fraction
  const needed = beta * target;
  const esNeeded = Math.ceil(needed / notionalPer);
  const reduction = esNeeded * notionalPer;
  const pct = round2((reduction / beta) * 100);
  const margin = esNeeded * 13000;
  const esCost = esNeeded * 25;
  const marginCap = margin + 7000;
  // routes: A = correct ES count; B = fewer ES (misses target); C = SPY put package (higher cost); (D for L10/AGI) = too many ES (busts margin)
  const fewer = esNeeded - 1;
  const putCost = 18000 + (seed % 4) * 1000;
  const routes = [
    `short ${esNeeded} ES futures (beta hedge), ES at ${price.toFixed(2)}, multiplier ${mult}, initial margin 13,000 USD/contract, execution cost 25 USD/contract`,
    `short ${fewer} ES futures, same specs as Route A`,
    `buy a SPY put package costing ${putCost} USD premium that reduces beta-dollars by ${reduction} USD`,
  ];
  const fourRoutes = tier === 'L10' || tier === 'AGI';
  if (fourRoutes) routes.push(`short ${esNeeded + 3} ES futures, same specs as Route A`);
  const expected: Record<string, unknown> = {
    decision: 'hedge',
    selected_route: 'route_a',
    es_contracts: esNeeded,
    beta_reduction_usd: reduction,
    beta_reduction_pct: pct,
    margin_used: margin,
    expected_cost: esCost,
    feasibility: 'feasible',
    rejected_routes: fourRoutes ? ['route_b', 'route_c', 'route_d'] : ['route_b', 'route_c'],
  };
  const deterministic = ['selected_route', 'es_contracts', 'beta_reduction_usd', 'beta_reduction_pct', 'margin_used', 'expected_cost'];
  const familyLine =
    family === 'multi_asset_drawdown_hedge' ? 'This is a drawdown hedge across the equity book; minimize hedge cost.'
    : family === 'cross_asset_var_liquidity_triage' ? 'This is a VaR/liquidity triage; only listed futures liquidity is usable.'
    : family === 'risk_budget_rebalance' ? 'This is a risk budget rebalance against the stated beta target.'
    : family === 'futures_beta_hedge' ? 'This is an index-futures beta hedge of the cash equity book using ES futures.'
    : 'This is a beta-dollar rebalance against the stated beta target.';
  const esc = escalationFields(tier, seed, expected, deterministic, { risk_off: 95000, squeeze: -15000, gap: 60000 }, esCost,
    { min_reduction_met: true, margin_ok: true, lowest_cost_feasible: true });
  const prompt =
    `Frozen market snapshot:\n` +
    `- Account: US portfolio margin account. ${familyLine}\n` +
    `- Portfolio equity beta-dollar exposure: ${beta} USD.\n` +
    `- Required reduction: at least ${(target * 100).toFixed(0)}% of beta-dollar exposure.\n` +
    `- Cash budget for premium: 15,000 USD. Futures initial-margin capacity: ${marginCap} USD.\n` +
    `- ES beta-hedge notional per contract = price * multiplier; one ES contract hedges ${notionalPer} beta-dollars.\n` +
    `Candidate routes (decide feasibility yourself from the facts; do not assume any route is valid):\n` +
    renderRoutes(routes) + `\n` + esc.extraPrompt + `\n` +
    `Task:\nChoose the feasible route that meets the reduction target at the lowest upfront cost. Report rejected routes by their route id.\n\n` +
    `Objective:\n${esc.objective}.\n\n` +
    `Output JSON fields: ${compact(expected)}`;
  return {
    prompt, expected, deterministic,
    derivation: `Needed reduction = ${beta}*${target} = ${needed}; ES per contract hedges ${notionalPer}; ceil = ${esNeeded} contracts -> reduction ${reduction} (${pct}%), margin ${margin} (<= ${marginCap}), cost ${esCost}. Route B (${fewer}) misses target; Route C costs ${putCost} > ${esCost}; extra-ES route busts margin.`,
    failureModes: ['uses too few contracts and misses target', 'treats margin as cash cost', 'chooses higher-cost put package', 'ignores margin capacity'],
    mustNot: ['must_not_miss_beta_target', 'must_not_ignore_margin_capacity'],
  };
}

// ---- Futures / commodities / spreads / rolls ----
function buildFutures(tier: Tier, family: string, seed: number): Packet {
  if (family === 'span_margin_calendar_spread') {
    const carryCal = 1000 + (seed % 9) * 100;
    const carryOut = carryCal + 400 + (seed % 3) * 100;
    const marginCal = 8500 + (seed % 5) * 500;
    const marginOut = 22000 + (seed % 4) * 1000;
    const marginCap = marginCal + 1500; // outright busts cap
    const n = 3 + (seed % 6);
    const routes = [
      `long ${n} CL June / short ${n} CL July calendar spread, expected carry ${carryCal} USD, SPAN margin ${marginCal} USD`,
      `long ${Math.max(1, n - 2)} outright CL contracts, expected carry ${carryOut} USD, SPAN margin ${marginOut} USD`,
      `stay flat, expected carry 0 USD, SPAN margin 0 USD`,
    ];
    const expected: Record<string, unknown> = {
      decision: 'trade', selected_route: 'route_a', spread_count: n, expected_carry_usd: carryCal,
      margin_used: marginCal, feasibility: 'feasible', rejected_routes: ['route_b', 'route_c'],
    };
    const deterministic = ['selected_route', 'spread_count', 'expected_carry_usd', 'margin_used'];
    const esc = escalationFields(tier, seed, expected, deterministic, { risk_off: 8000, squeeze: -2000, gap: 5000 }, 0,
      { span_margin_within_limit: true, highest_feasible_carry_selected: true });
    const prompt =
      `Frozen market snapshot:\n- Account: futures account using the simplified SPAN margin figures in this packet.\n` +
      `- Objective: add crude-oil carry exposure with SPAN margin_used <= ${marginCap} USD.\n` +
      `Candidate routes (decide feasibility yourself from the SPAN margin figures):\n` +
      renderRoutes(routes) + `\n` + esc.extraPrompt + `\n` +
      `Task:\nSelect the feasible strategy with the highest expected carry under the SPAN margin cap. Report rejected routes by route id.\n\n` +
      `Objective:\n${esc.objective}.\n\nOutput JSON fields: ${compact(expected)}`;
    return { prompt, expected, deterministic,
      derivation: `Outright SPAN margin ${marginOut} > cap ${marginCap} (infeasible). Calendar spread margin ${marginCal} <= cap, carry ${carryCal}. Flat earns 0. Best feasible = calendar spread.`,
      failureModes: ['picks outright that busts SPAN margin', 'stays flat despite feasible carry'],
      mustNot: ['must_not_exceed_span_margin', 'must_not_select_infeasible_route'] };
  }
  if (family === 'futures_beta_hedge') {
    return buildPortfolio(tier, 'futures_beta_hedge', seed);
  }
  // roll calendar / commodity roll basis
  const contracts = 2 + (seed % 7);
  const nearBid = 70 + (seed % 17);
  const spread = round2(0.35 + (seed % 9) * 0.05);
  const nextAsk = round2(nearBid + spread);
  const mult = 1000; // CL barrels
  const fees = contracts * 2 * 4;
  const rollA = round2(spread * mult * contracts);
  const totalA = round2(rollA + fees);
  // Route B uses mid prices (not executable -> wrong), Route C holds into first notice (forbidden)
  const routes = [
    `roll by selling near at bid ${nearBid.toFixed(2)} and buying next at ask ${nextAsk.toFixed(2)}; CL multiplier ${mult} barrels; fee 4 USD/contract/leg`,
    `roll using the near/next mid prices instead of bid/ask`,
    `hold the long near-month position into first notice day`,
  ];
  const expected: Record<string, unknown> = {
    decision: 'roll', selected_route: 'route_a', contracts, roll_cost_usd: rollA, fees_usd: fees,
    total_cost_usd: totalA, feasibility: 'feasible', rejected_routes: ['route_b', 'route_c'],
  };
  const deterministic = ['selected_route', 'contracts', 'roll_cost_usd', 'fees_usd', 'total_cost_usd'];
  const familyLine = family === 'commodity_roll_basis_hedge'
    ? 'This is a commodity roll with basis between near and next; use executable bid/ask, not mid.'
    : 'This is a futures roll calendar ahead of first notice; use executable bid/ask, not mid.';
  const esc = escalationFields(tier, seed, expected, deterministic, { risk_off: 3000, squeeze: -1000, gap: 2000 }, totalA,
    { uses_executable_prices: true, avoids_first_notice: true });
  const prompt =
    `Frozen market snapshot:\n- Position: long ${contracts} CL near-month futures. ${familyLine}\n` +
    `- First notice day is tomorrow; account policy forbids holding physically deliverable CL long into first notice.\n` +
    `- Only the displayed bid/ask is executable; mid prices are indicative and not executable.\n` +
    `Candidate routes (decide feasibility yourself):\n` + renderRoutes(routes) + `\n` + esc.extraPrompt + `\n` +
    `Task:\nRoll the position and compute total executable cost. Report rejected routes by route id.\n\n` +
    `Objective:\n${esc.objective}.\n\nOutput JSON fields: ${compact(expected)}`;
  return { prompt, expected, deterministic,
    derivation: `Roll cost = (${nextAsk} - ${nearBid}) * ${mult} * ${contracts} = ${rollA}; fees = ${fees}; total = ${totalA}. Mid-price route not executable; holding into first notice violates policy.`,
    failureModes: ['uses mid prices', 'holds into first notice', 'omits fees'],
    mustNot: ['must_not_use_mid_when_bid_ask_given', 'must_not_hold_deliverable_into_first_notice'] };
}

// ---- Listed options strategy / Greeks ----
function buildOptions(tier: Tier, family: string, seed: number): Packet {
  const sym = symFor(seed);
  if (family === 'covered_call_assignment' || family === 'early_assignment_dividend_risk') {
    const stock = 180 + (seed % 8) * 5;
    const strike = stock - [5, 0, -5][seed % 3]; // ITM / ATM / OTM short call
    const intrinsic = Math.max(0, stock - strike);
    const timeValue = round2(0.5 + (seed % 4) * 0.3);
    const callBid = round2(intrinsic + timeValue);
    const div = round2(0.3 + (seed % 6) * 0.2);
    // early assignment is rational for the holder iff the call is ITM and the dividend
    // exceeds the call's remaining time value.
    const earlyAssignRational = intrinsic > 0 && div > timeValue;
    const expected: Record<string, unknown> = {
      decision: 'manage_assignment',
      selected_route: earlyAssignRational ? 'route_a' : 'route_b',
      instrument: sym,
      call_strike: strike,
      dividend_per_share: div,
      call_time_value: timeValue,
      early_assignment_risk: earlyAssignRational,
      feasibility: 'feasible',
      rejected_routes: earlyAssignRational ? ['route_b'] : ['route_a'],
    };
    const deterministic = ['selected_route', 'instrument', 'call_strike', 'dividend_per_share', 'call_time_value', 'early_assignment_risk'];
    const routes = [
      `roll/close the short call before ex-dividend to avoid early assignment`,
      `hold the covered call through ex-dividend unchanged`,
    ];
    const esc = escalationFields(tier, seed, expected, deterministic, { risk_off: 1500, squeeze: -500, gap: 1000 }, 0,
      { compared_dividend_to_time_value: true, assignment_handled: true });
    const prompt =
      `Frozen market snapshot:\n- Covered call on ${instr(sym)}: long 100 shares at ${stock.toFixed(2)}, short 1 ${strike} call.\n` +
      `- Call quote: ${callBid.toFixed(2)} USD/share; option multiplier 100 shares. Intrinsic = max(0, spot - strike).\n` +
      `- Ordinary cash dividend ${div.toFixed(2)}/share with ex-dividend tomorrow. Early assignment of an American call is rational for the holder when the dividend exceeds the call's remaining time value.\n` +
      `Candidate routes (decide which is required by the assignment economics):\n` + renderRoutes(routes) + `\n` + esc.extraPrompt + `\n` +
      `Task:\nCompute the call's time value, compare to the dividend, decide the early-assignment risk, and select the route. Report rejected routes by route id.\n\n` +
      `Objective:\nremove early-assignment/dividend risk when and only when it is economically rational.\n\nOutput JSON fields: ${compact(expected)}`;
    return { prompt, expected, deterministic,
      derivation: `Intrinsic = max(0, ${stock}-${strike}); time value = ${callBid} - intrinsic = ${timeValue}. Dividend ${div} ${earlyAssignRational ? '>' : '<='} time value -> early assignment ${earlyAssignRational ? 'rational (roll/close)' : 'not rational (hold)'}.`,
      failureModes: ['ignores dividend vs time value test', 'mishandles assignment'],
      mustNot: ['must_not_ignore_dividend_vs_time_value'] };
  }
  if (family === 'exercise_assignment_roll_decision') {
    // Long ITM American call holder before ex-dividend: exercise early (capture the
    // dividend, forfeit remaining time value), sell the call (keep time value), or roll.
    const stock = 190 + (seed % 8) * 5;
    const strike = stock - 10; // ITM
    const callBid = round2((stock - strike) + 1 + (seed % 3)); // intrinsic + time value
    const timeValue = round2(callBid - (stock - strike));
    const div = round2(timeValue + (seed % 2 === 0 ? 0.6 : -0.6)); // rotate which side wins
    const exerciseEarly = div > timeValue;
    const routes = [
      `exercise the long call early to capture the ${div.toFixed(2)}/share dividend (you forfeit remaining time value)`,
      `sell the long call at its ${callBid.toFixed(2)} quote and keep the time value`,
      `roll the call to the next expiry`,
    ];
    const expected: Record<string, unknown> = {
      decision: 'exercise_decision', selected_route: exerciseEarly ? 'route_a' : 'route_b',
      instrument: sym, dividend_per_share: div, call_time_value: timeValue, exercise_early: exerciseEarly,
      feasibility: 'feasible', rejected_routes: exerciseEarly ? ['route_b', 'route_c'] : ['route_a', 'route_c'],
    };
    const deterministic = ['selected_route', 'instrument', 'dividend_per_share', 'call_time_value', 'exercise_early'];
    const esc = escalationFields(tier, seed, expected, deterministic, { risk_off: 1200, squeeze: -400, gap: 900 }, 0,
      { compared_dividend_to_time_value: true, exercise_or_assignment_resolved: true });
    const prompt =
      `Frozen market snapshot:\n- You hold 1 long ITM ${instr(sym)} call, strike ${strike}, spot ${stock.toFixed(2)}.\n` +
      `- Call quote ${callBid.toFixed(2)}/share; intrinsic = spot - strike = ${(stock - strike).toFixed(2)}; remaining time value = quote - intrinsic = ${timeValue.toFixed(2)}.\n` +
      `- Ordinary dividend ${div.toFixed(2)}/share, ex-dividend tomorrow. Early exercise/assignment of an American call is rational only when the dividend exceeds the remaining time value.\n` +
      `Candidate routes (decide from the exercise economics; do not assume a route):\n` + renderRoutes(routes) + `\n` + esc.extraPrompt + `\n` +
      `Task:\nCompare the dividend to the time value, decide whether to exercise early, and select the route. Report rejected routes by route id.\n\n` +
      `Objective:\nresolve the exercise/assignment decision at the highest economic value.\n\nOutput JSON fields: ${compact(expected)}`;
    return { prompt, expected, deterministic,
      derivation: `Time value = ${callBid} - ${(stock - strike).toFixed(2)} = ${timeValue}. Dividend ${div} ${exerciseEarly ? '>' : '<='} time value -> ${exerciseEarly ? 'exercise early' : 'sell/roll, do not exercise'}.`,
      failureModes: ['exercises when time value exceeds dividend', 'ignores exercise economics'],
      mustNot: ['must_not_ignore_dividend_vs_time_value'] };
  }
  // put_spread_downside_floor
  // Long put at the stock strike (50 in-the-money at the downside close). Three short
  // strikes give fixed PnL of -45000 / -37000 / -29000 at premiums 5000 / 7000 / 9000.
  // Rotate the binding floor so sometimes a cheaper spread is feasible (genuine
  // "minimize premium subject to floor"), sometimes only the costliest qualifies.
  const stock = 480 + (seed % 7) * 5;
  const downside = stock - 50;
  const buyPut = stock;
  const longPrem = 12;
  const candidates = [
    { sell: stock - 10, prem: 7 }, // payoff 10000, netPrem 5000, pnl -45000
    { sell: stock - 20, prem: 5 }, // payoff 20000, netPrem 7000, pnl -37000
    { sell: stock - 30, prem: 3 }, // payoff 30000, netPrem 9000, pnl -29000
  ];
  const floor = [-46000, -38000, -30000][seed % 3];
  const evals = candidates.map(c => {
    const netPrem = round2((longPrem - c.prem) * 100 * 10);
    const spreadPayoff = (Math.max(0, buyPut - downside) - Math.max(0, c.sell - downside)) * 100 * 10;
    const stockLoss = (downside - stock) * 100 * 10;
    const pnl = round2(stockLoss + spreadPayoff - netPrem);
    return { ...c, netPrem, pnl, feasible: pnl >= floor };
  });
  // objective: lowest net premium meeting the floor
  const feasible = evals.filter(e => e.feasible).sort((a, b) => a.netPrem - b.netPrem);
  const chosen = feasible[0];
  const chosenIdx = evals.indexOf(chosen);
  const routes = candidates.map(c => `buy 10 ${sym} ${buyPut} puts at ${longPrem.toFixed(2)} and sell 10 ${sym} ${c.sell} puts at ${c.prem.toFixed(2)} (put spread)`);
  const expected: Record<string, unknown> = {
    decision: 'hedge', selected_route: ROUTE_IDS[chosenIdx],
    buy_put_strike: buyPut, sell_put_strike: chosen.sell, contracts: 10,
    net_premium_paid: chosen.netPrem, scenario_pnl_usd: chosen.pnl,
    feasibility: 'feasible', rejected_routes: ROUTE_IDS.slice(0, 3).filter((_, i) => i !== chosenIdx),
  };
  const deterministic = ['selected_route', 'buy_put_strike', 'sell_put_strike', 'contracts', 'net_premium_paid', 'scenario_pnl_usd'];
  const esc = escalationFields(tier, seed, expected, deterministic, { risk_off: 20000, squeeze: -3000, gap: 14000 }, chosen.netPrem,
    { downside_floor_met: true, lowest_premium_selected: true });
  const prompt =
    `Frozen market snapshot:\n- Position: long 1,000 ${instr(sym)} at ${stock.toFixed(2)}.\n` +
    `- Downside scenario for grading: ${sym} closes at ${downside.toFixed(2)} at option expiry.\n` +
    `- Constraint: scenario PnL including option premium must be no worse than ${floor} USD (a downside floor on this put spread).\n` +
    `- Option multiplier: 100 shares; use exactly 10 spreads. Stock PnL + spread payoff - net premium = scenario PnL.\n` +
    `Candidate put spreads (decide which meet the floor; pick the lowest net premium among those that do):\n` + renderRoutes(routes) + `\n` + esc.extraPrompt + `\n` +
    `Task:\nSelect the feasible put spread and compute net premium and scenario PnL. Report rejected routes by route id.\n\n` +
    `Objective:\nminimize net premium subject to scenario_pnl_usd >= the stated floor.\n\nOutput JSON fields: ${compact(expected)}`;
  return { prompt, expected, deterministic,
    derivation: `For each spread: net premium = (long-short)*100*10; scenario PnL = stock loss + spread payoff - net premium. Feasible if PnL >= ${floor}. Lowest-premium feasible = ${ROUTE_IDS[chosenIdx]} (sell ${chosen.sell}), net ${chosen.netPrem}, PnL ${chosen.pnl}.`,
    failureModes: ['omits option multiplier', 'chooses cheaper spread that breaches floor', 'ignores premium in PnL'],
    mustNot: ['must_not_ignore_downside_floor', 'must_not_ignore_option_multiplier'] };
}

// ---- Shorting / borrow / margin / locates ----
function buildShorting(tier: Tier, family: string, seed: number): Packet {
  const sym = symFor(seed);
  const price = 120 + (seed % 12) * 10;
  const target = 1000 + (seed % 4) * 100; // desired short shares
  const locate = 300 + (seed % 7) * 100;  // located shares available
  const putContracts = Math.floor((locate) / 200);
  const putDelta = 35;
  const putPremPerSh = 8;
  const premium = putContracts * putPremPerSh * 100;
  const cashAvail = premium + (seed % 2) * 0; // exactly enough
  const bearish = locate + putContracts * putDelta;
  const borrowApr = round2(0.04 + (seed % 6) * 0.01);
  const routes = [
    `short exactly the ${locate} located shares and buy ${putContracts} listed puts (delta -0.${putDelta}, premium ${putPremPerSh}.00 USD/share, multiplier 100) within ${cashAvail} USD option cash`,
    `short the full ${target}-share target (requires shares beyond the locate)`,
    `buy ${putContracts + 4} listed puts (premium ${putPremPerSh}.00 USD/share, multiplier 100), ignoring the option cash limit`,
  ];
  const familyLine =
    family === 'borrow_cost_vs_trade_edge' ? `Borrow rate is ${(borrowApr * 100).toFixed(2)}% APR; weigh borrow cost against edge.`
    : family === 'hard_to_borrow_margin_recall' ? `${sym} is hard-to-borrow with recall risk; you cannot exceed the locate.`
    : family === 'locate_recall_options_substitution' ? `On recall, substitute listed puts for the un-locatable short.`
    : `Short selling requires a locate before order entry; you cannot short beyond the locate.`;
  const expected: Record<string, unknown> = {
    decision: 'trade', selected_route: 'route_a', instrument: sym, short_shares: locate, put_contracts: putContracts,
    premium_paid: premium, bearish_delta_shares: bearish, feasibility: 'feasible', rejected_routes: ['route_b', 'route_c'],
  };
  const deterministic = ['selected_route', 'instrument', 'short_shares', 'put_contracts', 'premium_paid', 'bearish_delta_shares'];
  const esc = escalationFields(tier, seed, expected, deterministic, { risk_off: 12000, squeeze: -20000, gap: 9000 }, premium,
    { within_locate: true, within_option_cash: true });
  const prompt =
    `Frozen market snapshot:\n- Account: US margin account. ${familyLine}\n` +
    `- Instrument: ${instr(sym)} at ${price.toFixed(2)}. Desired bearish target: short ${target} shares of exposure.\n` +
    `- Locate availability: exactly ${locate} shares. Option cash available: ${cashAvail} USD. Put delta -0.${putDelta} means ${putDelta} delta-shares per contract.\n` +
    `Candidate routes (decide feasibility from the locate and cash limits yourself):\n` + renderRoutes(routes) + `\n` + esc.extraPrompt + `\n` +
    `Task:\nChoose the feasible bearish implementation that maximizes bearish delta-shares without breaching the locate or option cash. Report rejected routes by route id.\n\n` +
    `Objective:\nmaximize bearish delta-shares subject to locate and option-cash constraints.\n\nOutput JSON fields: ${compact(expected)}`;
  return { prompt, expected, deterministic,
    derivation: `Short ${locate} located shares + ${putContracts} puts * ${putDelta} delta-shares = ${bearish}; premium = ${putContracts}*${putPremPerSh}*100 = ${premium} (<= ${cashAvail}). Route B shorts beyond locate; Route C exceeds option cash.`,
    failureModes: ['shorts beyond locate', 'exceeds option cash', 'misses option delta multiplier'],
    mustNot: ['must_not_short_more_than_locate', 'must_not_exceed_option_cash'] };
}

// ---- Spot FX / CFDs / multi-currency ----
function buildFX(tier: Tier, family: string, seed: number): Packet {
  const eur = 80000 + (seed % 17) * 20000;
  const spot = round2(1.05 + (seed % 23) / 1000);
  const usdSpot = round2(eur * spot);
  const fwdPts = round2(0.002 + (seed % 3) / 1000);
  const usdFwd = round2(eur * (spot + fwdPts));
  const futMargin = 2750 + (seed % 3) * 250;
  const marginCap = 2000;
  const needT2 = family === 'fx_settlement_mismatch' || family === 'forward_vs_spot_payment';
  // Route A spot T+2 feasible & cheapest; B CFD unavailable (US retail); C futures margin too high
  const routes = [
    `buy EUR spot at ${spot.toFixed(4)}, settles T+2, fees included`,
    `use a retail CFD on EURUSD`,
    `use EUR futures requiring ${futMargin} USD initial margin`,
  ];
  if (needT2) routes.push(`buy EUR via an outright forward that settles T+5, later than the required T+2 date`);
  const familyLine =
    family === 'cfd_margin_regional_constraint' ? 'CFDs are unavailable to US retail accounts in this jurisdiction.'
    : family === 'multi_currency_cash_buffer' ? 'Maintain a USD cash buffer; pick the lowest-USD-cost feasible conversion.'
    : family === 'forward_vs_spot_payment' ? 'Payment is required on the T+2 date; a later forward settlement misses it.'
    : 'The EUR payment must settle on the required T+2 date (FX settlement mismatch trap).';
  const expected: Record<string, unknown> = {
    decision: 'convert_fx', selected_route: 'route_a', eur_amount: eur, usd_cost: usdSpot,
    settlement_date_rule: 'T+2', feasibility: 'feasible',
    rejected_routes: needT2 ? ['route_b', 'route_c', 'route_d'] : ['route_b', 'route_c'],
  };
  const deterministic = ['selected_route', 'eur_amount', 'usd_cost', 'settlement_date_rule'];
  const esc = escalationFields(tier, seed, expected, deterministic, { risk_off: 0, squeeze: 0, gap: 0 }, 0,
    { settlement_matches: true, product_permitted: true, margin_ok: true });
  const prompt =
    `Frozen market snapshot:\n- Account holder: US retail customer. Account base currency: USD. ${familyLine}\n` +
    `- Required: obtain ${eur} EUR settling T+2. Spot EURUSD ${spot.toFixed(4)}. EUR futures initial margin capacity: ${marginCap} USD.\n` +
    `Candidate routes (decide feasibility from jurisdiction, settlement and margin facts yourself):\n` + renderRoutes(routes) + `\n` + esc.extraPrompt + `\n` +
    `Task:\nChoose the feasible route and compute USD cost. Report rejected routes by route id.\n\n` +
    `Objective:\nobtain the EUR by the required settlement date at the lowest feasible USD cost.\n\nOutput JSON fields: ${compact(expected)}`;
  return { prompt, expected, deterministic,
    derivation: `Spot route USD cost = ${eur} * ${spot} = ${usdSpot}, settles T+2 (feasible). CFD unavailable to US retail; futures margin ${futMargin} > ${marginCap}${needT2 ? '; forward settles after the required date' : ''}.`,
    failureModes: ['uses unavailable CFD', 'uses margin-infeasible futures', 'wrong FX multiplication', 'misses settlement date'],
    mustNot: ['must_not_use_cfd_when_unavailable', 'must_not_exceed_margin_capacity'] };
}

// ---- Execution / liquidity / microstructure ----
function buildExecution(tier: Tier, family: string, seed: number): Packet {
  const sym = symFor(seed);
  const base = 110 + (seed % 29);
  if (family === 'invalid_route_session_trap' || family === 'auction_session_constraint') {
    // session/permission derivation, not a fill calc
    const routes = [
      `route the order to the continuous regular session`,
      `route the order to the closed after-hours venue with no permission`,
      `route via an unsupported dark venue not enabled on this account`,
    ];
    const sessQty = 100 + (seed % 9) * 100;
    const sessQuote = round2(50 + (seed % 53) + 0.25);
    const expected: Record<string, unknown> = {
      decision: 'trade', selected_route: 'route_a', instrument: sym, order_shares: sessQty, limit_price: sessQuote, venue: 'regular_session', feasibility: 'feasible', rejected_routes: ['route_b', 'route_c'],
    };
    const deterministic = ['selected_route', 'instrument', 'order_shares', 'limit_price', 'venue'];
    const esc = escalationFields(tier, seed, expected, deterministic, { risk_off: 0, squeeze: 0, gap: 0 }, 0,
      { session_open: true, venue_permitted: true });
    const prompt =
      `Frozen market snapshot:\n- Instrument: ${instr(sym)}. Order size: ${sessQty} shares at limit ${sessQuote.toFixed(2)}. The regular session is OPEN now; the after-hours venue is CLOSED; the dark venue is NOT enabled on this account.\n` +
      `- ${family === 'auction_session_constraint' ? 'Auction/session constraint: only the open regular session is executable.' : 'Session/permission trap: only permitted, open venues are executable.'}\n` +
      `Candidate routes (decide which venue is permitted and open yourself):\n` + renderRoutes(routes) + `\n` + esc.extraPrompt + `\n` +
      `Task:\nRoute to the only feasible venue. Report rejected routes by route id.\n\nObjective:\n${esc.objective}.\n\nOutput JSON fields: ${compact(expected)}`;
    return { prompt, expected, deterministic,
      derivation: `Only the open, permitted regular session is executable. After-hours is closed; dark venue not enabled.`,
      failureModes: ['routes to a closed/unpermitted venue'], mustNot: ['must_not_route_to_unpermitted_venue'] };
  }
  // order_book_liquidity_limit / twap_slippage_limit : true max-fill under avg-price cap with clips
  const l1 = base + 0.05, l2 = base + 0.10, l3 = base + 0.30;
  const q1 = 40000, q2 = 40000;
  const clip = 500;
  const cap = round2(base + 0.11);
  // fill l1,l2 fully then x at l3 keeping avg <= cap; x in clips
  const cost12 = q1 * l1 + q2 * l2;
  const sh12 = q1 + q2;
  // (cost12 + x*l3)/(sh12+x) <= cap  =>  x <= (cap*sh12 - cost12)/(l3 - cap)
  const xMax = (cap * sh12 - cost12) / (l3 - cap);
  const x = Math.max(0, Math.floor(xMax / clip) * clip);
  const fill = sh12 + x;
  const avg = round2((cost12 + x * l3) / fill);
  const expected: Record<string, unknown> = {
    decision: 'trade', instrument: sym, side: 'buy', clip_size_shares: clip, filled_shares: fill,
    average_price: avg, limit_price: l3, feasibility: 'feasible', rejected_routes: ['route_b'],
  };
  const deterministic = ['instrument', 'side', 'clip_size_shares', 'filled_shares', 'average_price', 'limit_price'];
  const routes = [
    `walk the book filling cheapest levels first in ${clip}-share clips while keeping the running average <= the cap`,
    `take the full displayed size across all levels at a single ${l3.toFixed(2)} limit`,
  ];
  const familyLine = family === 'twap_slippage_limit'
    ? 'TWAP-style execution with a hard slippage cap expressed as an average-price cap.'
    : 'Order-book liquidity limit: maximize fill under the average-price cap.';
  const esc = escalationFields(tier, seed, expected, deterministic, { risk_off: 0, squeeze: 0, gap: 0 }, 0,
    { average_price_within_cap: true, max_fill_in_clips: true });
  const prompt =
    `Frozen market snapshot:\n- Instrument: ${instr(sym)}. ${familyLine}\n` +
    `- Mid price: ${base.toFixed(2)}. Maximum average execution price (cap): ${cap.toFixed(2)}.\n` +
    `- Ask book: ${q1} @ ${l1.toFixed(2)}; ${q2} @ ${l2.toFixed(2)}; 20000 @ ${l3.toFixed(2)}.\n` +
    `- Partial fills allowed only in ${clip}-share clips. Fees ignored.\n` +
    `Candidate routes:\n` + renderRoutes(routes) + `\n` + esc.extraPrompt + `\n` +
    `Task:\nCompute the maximum buy quantity in allowed clips that keeps the average price at or below the cap. Report rejected routes by route id.\n\n` +
    `Objective:\nmaximize filled_shares subject to average_price <= the cap, in ${clip}-share clips.\n\nOutput JSON fields: ${compact(expected)}`;
  return { prompt, expected, deterministic,
    derivation: `Fill ${q1}@${l1.toFixed(2)} and ${q2}@${l2.toFixed(2)} (avg ${round2(cost12 / sh12)}), then x@${l3.toFixed(2)} with x <= (cap*${sh12}-${cost12})/(${l3}-cap) = ${round2(xMax)}; floor to ${clip} -> ${x}. Max fill ${fill} at avg ${avg} (<= ${cap}). Full-size route breaches the cap.`,
    failureModes: ['takes full book and breaches the average cap', 'ignores clip rounding', 'uses last price not average'],
    mustNot: ['must_not_exceed_average_price_cap'] };
}

// ---- Corporate actions / settlement / calendar / jurisdiction ----
function buildCorporate(tier: Tier, family: string, seed: number): Packet {
  const sym = symFor(seed);
  const price = 200 + (seed % 10) * 10;
  const { trade, settle } = tPlusOne(seed);
  if (family === 't_plus_one_settlement_sequence' || family === 'regional_market_holiday') {
    const shares = 200 + (seed % 5) * 100;
    const proceeds = shares * price;
    const routes = [
      `sell ${shares} shares on ${trade}; withdraw cash only after T+1 settlement on ${settle}`,
      `sell ${shares} shares on ${trade} and withdraw the proceeds on the trade date ${trade}`,
    ];
    const expected: Record<string, unknown> = {
      decision: 'sell', selected_route: 'route_a', trade_value_usd: proceeds, settlement_rule: 'T+1',
      settlement_cash_date: settle, feasibility: 'feasible', rejected_routes: ['route_b'],
    };
    const deterministic = ['selected_route', 'trade_value_usd', 'settlement_rule', 'settlement_cash_date'];
    const esc = escalationFields(tier, seed, expected, deterministic, { risk_off: 0, squeeze: 0, gap: 0 }, 0,
      { settlement_respected: true });
    const prompt =
      `Frozen market snapshot:\n- Instrument: ${instr(sym)} at ${price.toFixed(2)}. ${family === 'regional_market_holiday' ? 'Account calendar: the next day is a settlement holiday, so T+1 cash lands on the stated date.' : 'US equities settle T+1.'}\n` +
      `- Trade date ${trade}; T+1 cash settlement date ${settle}. Unsettled proceeds cannot be withdrawn before settlement.\n` +
      `Candidate routes (decide which respects settlement):\n` + renderRoutes(routes) + `\n` + esc.extraPrompt + `\n` +
      `Task:\nSell and report trade value and the T+1 cash date. Report rejected routes by route id.\n\nObjective:\n${esc.objective}.\n\nOutput JSON fields: ${compact(expected)}`;
    return { prompt, expected, deterministic,
      derivation: `Trade value = ${shares} * ${price} = ${proceeds}; cash settles T+1 on ${settle}. Same-day withdrawal route violates settlement.`,
      failureModes: ['withdraws proceeds on trade date', 'wrong settlement date'], mustNot: ['must_not_withdraw_unsettled_proceeds'] };
  }
  // ex_dividend_adjustment / corporate_action_adjustment : GTC stop reduced by dividend; option strike NOT adjusted for ordinary div
  const div = round2(0.3 + (seed % 8) * 0.05);
  const stop = round2(price - 5);
  const adjStop = round2(stop - div);
  const routes = [
    `reduce the GTC sell-stop by the ordinary dividend on ex-date; leave the listed option strike unchanged`,
    `leave the GTC stop unchanged through ex-date`,
    `reduce the listed option strike by the ordinary dividend`,
  ];
  const expected: Record<string, unknown> = {
    decision: 'adjust_order_for_ex_dividend', selected_route: 'route_a', adjusted_stop_price: adjStop,
    option_strike_adjusted: false, option_strike_after: price, feasibility: 'feasible', rejected_routes: ['route_b', 'route_c'],
  };
  const deterministic = ['selected_route', 'adjusted_stop_price', 'option_strike_adjusted', 'option_strike_after'];
  const esc = escalationFields(tier, seed, expected, deterministic, { risk_off: 0, squeeze: 0, gap: 0 }, 0,
    { stop_adjusted: true, option_strike_unchanged: true });
  const prompt =
    `Frozen market snapshot:\n- Instrument: ${instr(sym)}. Corporate action: ordinary cash dividend ${div.toFixed(2)}/share, ex-dividend tomorrow.\n` +
    `- Existing GTC sell-stop price: ${stop.toFixed(2)}. Related listed option strike: ${price.toFixed(2)}.\n` +
    `- Broker rule: reduce GTC equity stop prices by the ordinary cash dividend on ex-date; listed option strikes are NOT adjusted for ordinary cash dividends.\n` +
    `Candidate routes (decide which matches the corporate-action rules):\n` + renderRoutes(routes) + `\n` + esc.extraPrompt + `\n` +
    `Task:\nCompute the adjusted stop and the option-strike treatment. Report rejected routes by route id.\n\nObjective:\n${esc.objective}.\n\nOutput JSON fields: ${compact(expected)}`;
  return { prompt, expected, deterministic,
    derivation: `Adjusted stop = ${stop} - ${div} = ${adjStop}; ordinary dividend does not adjust the option strike (stays ${price}).`,
    failureModes: ['leaves stop unadjusted', 'adjusts option strike for ordinary dividend'], mustNot: ['must_not_treat_ordinary_dividend_as_strike_adjustment'] };
}

// ---- Spot equities / ETFs ----
function buildSpotEquities(tier: Tier, family: string, seed: number): Packet {
  const sym = symFor(seed);
  const price = 80 + (seed % 40) * 3;
  if (family === 'opening_auction_limit' || family === 'market_on_close_rebalance') {
    const qty = 100 + (seed % 9) * 100;
    const limit = round2(price + 0.25);
    const venue = family === 'market_on_close_rebalance' ? 'market_on_close' : 'opening_auction';
    const routes = [
      `place a ${family === 'market_on_close_rebalance' ? 'market-on-close (MOC)' : 'limit-on-open auction'} order for ${qty} shares`,
      `cross the spread immediately in the continuous session, missing the ${family === 'market_on_close_rebalance' ? 'close' : 'opening auction'}`,
    ];
    const expected: Record<string, unknown> = {
      decision: 'trade', selected_route: 'route_a', instrument: sym, quantity: qty, limit_price: limit, venue,
      feasibility: 'feasible', rejected_routes: ['route_b'],
    };
    const deterministic = ['selected_route', 'instrument', 'quantity', 'limit_price', 'venue'];
    const esc = escalationFields(tier, seed, expected, deterministic, { risk_off: 0, squeeze: 0, gap: 0 }, 0, { venue_matches_objective: true });
    const prompt =
      `Frozen market snapshot:\n- Instrument: ${instr(sym)} at ${price.toFixed(2)}. Objective is to participate in the ${family === 'market_on_close_rebalance' ? 'closing print (market on close / MOC) for an index rebalance' : 'opening auction with a protective limit'}.\n` +
      `- Order size ${qty} shares; protective limit ${limit.toFixed(2)}.\n` +
      `Candidate routes (decide which matches the auction/close objective):\n` + renderRoutes(routes) + `\n` + esc.extraPrompt + `\n` +
      `Task:\nSelect the order route matching the objective. Report rejected routes by route id.\n\nObjective:\n${esc.objective}.\n\nOutput JSON fields: ${compact(expected)}`;
    return { prompt, expected, deterministic,
      derivation: `Auction/close objective requires the ${venue} route; crossing the continuous-session spread misses the auction/close.`,
      failureModes: ['misses the auction/close', 'wrong venue'], mustNot: ['must_not_miss_auction_or_close'] };
  }
  // equity_order_ticket / etf_sector_rebalance_t_plus_one
  const qty = 100 + (seed % 9) * 100;
  const limit = round2(price + 0.25);
  const value = round2(qty * price);
  const { settle } = tPlusOne(seed);
  const routes = [
    `submit a day limit buy ticket for ${qty} shares at ${limit.toFixed(2)} in the regular session`,
    `submit a market buy that ignores the protective limit`,
  ];
  const expected: Record<string, unknown> = {
    decision: 'trade', selected_route: 'route_a', instrument: sym, side: 'buy', quantity: qty, order_type: 'limit',
    limit_price: limit, trade_value_usd: value, settlement_rule: 'T+1', settlement_cash_date: settle,
    feasibility: 'feasible', rejected_routes: ['route_b'],
  };
  const deterministic = ['selected_route', 'instrument', 'side', 'quantity', 'order_type', 'limit_price', 'trade_value_usd', 'settlement_rule', 'settlement_cash_date'];
  const familyLine = family === 'etf_sector_rebalance_t_plus_one' ? 'This is a sector ETF rebalance leg; equities/ETFs settle T+1.' : 'This is an equity order ticket; equities settle T+1.';
  const esc = escalationFields(tier, seed, expected, deterministic, { risk_off: 0, squeeze: 0, gap: 0 }, 0, { limit_respected: true });
  const prompt =
    `Frozen market snapshot:\n- Instrument: ${instr(sym)} at ${price.toFixed(2)}. ${familyLine}\n` +
    `- Buy ${qty} shares with a protective day limit ${limit.toFixed(2)}; T+1 cash date ${settle}.\n` +
    `Candidate routes:\n` + renderRoutes(routes) + `\n` + esc.extraPrompt + `\n` +
    `Task:\nCreate the order ticket and report trade value and T+1 date. Report rejected routes by route id.\n\nObjective:\n${esc.objective}.\n\nOutput JSON fields: ${compact(expected)}`;
  return { prompt, expected, deterministic,
    derivation: `Limit buy ${qty} @ ${limit}; trade value = ${qty}*${price} = ${value}; T+1 cash on ${settle}. Market route ignores the protective limit.`,
    failureModes: ['ignores protective limit', 'wrong T+1 date'], mustNot: ['must_not_ignore_protective_limit'] };
}

// ---- Feasibility / rejection / no-trade traps ----
function buildFeasibility(tier: Tier, family: string, seed: number): Packet {
  const sym = symFor(seed);
  const shares = 300 + (seed % 6) * 100;
  if (family === 'borrow_recall_margin_hedge') {
    // a recall forces buy-to-cover + hedge; there IS a feasible route here
    const cover = shares;
    const putContracts = Math.floor(shares / 100);
    const prem = putContracts * 8 * 100;
    const routes = [
      `buy to cover ${cover} recalled shares and replace exposure with ${putContracts} listed puts (premium 8.00/share, multiplier 100)`,
      `ignore the borrow recall and keep the short open`,
      `short additional shares to average down (no locate available)`,
    ];
    const expected: Record<string, unknown> = {
      decision: 'trade', selected_route: 'route_a', instrument: sym, buy_to_cover_shares: cover, put_contracts: putContracts,
      premium_paid: prem, feasibility: 'feasible', rejected_routes: ['route_b', 'route_c'],
    };
    const deterministic = ['selected_route', 'instrument', 'buy_to_cover_shares', 'put_contracts', 'premium_paid'];
    const esc = escalationFields(tier, seed, expected, deterministic, { risk_off: 9000, squeeze: -14000, gap: 6000 }, prem,
      { recall_handled: true, no_naked_short: true });
    const prompt =
      `Frozen market snapshot:\n- Account: US margin account. A borrow recall on ${instr(sym)} forces you to close ${shares} short shares today; no new locate is available.\n` +
      `Candidate routes (decide feasibility from the recall and locate facts):\n` + renderRoutes(routes) + `\n` + esc.extraPrompt + `\n` +
      `Task:\nHandle the borrow recall and keep bearish exposure feasibly. Report rejected routes by route id.\n\nObjective:\n${esc.objective}.\n\nOutput JSON fields: ${compact(expected)}`;
    return { prompt, expected, deterministic,
      derivation: `Recall forces buy-to-cover ${cover}; replace with ${putContracts} puts, premium ${prem}. Ignoring recall is not permitted; new short has no locate.`,
      failureModes: ['ignores recall', 'shorts without locate'], mustNot: ['must_not_ignore_borrow_recall', 'must_not_short_without_locate'] };
  }
  // genuine no-trade trap: every route violates something
  const routes = [
    `short ${shares} ${sym} shares via CFD after the regular session close`,
    `short ${shares} ${sym} shares in the cash account`,
    `buy ${sym} futures to get short exposure`,
  ];
  const expected: Record<string, unknown> = {
    decision: 'no_trade', selected_route: 'none', instrument: sym, requested_shares: shares,
    feasibility: 'infeasible', rejected_routes: ['route_a', 'route_b', 'route_c'],
  };
  const deterministic = ['decision', 'selected_route', 'instrument', 'requested_shares', 'feasibility'];
  const esc = escalationFields(tier, seed, expected, deterministic, { risk_off: 0, squeeze: 0, gap: 0 }, 0,
    { permissions_checked: true, no_valid_route: true });
  const prompt =
    `Frozen market snapshot:\n- Jurisdiction / account regime: US cash account.\n` +
    `- Permissions: CFDs unavailable; short selling unavailable in cash accounts; futures not approved; the regular equity session is closed.\n` +
    `- No alternative product permission is enabled in this packet.\n` +
    `Candidate routes (decide feasibility from the permission facts; a no-trade is required if all routes violate constraints):\n` + renderRoutes(routes) + `\n` + esc.extraPrompt + `\n` +
    `Task:\nReject every invalid route and return the no-trade decision. Report rejected routes by route id.\n\nObjective:\nreturn no_trade if and only if every route violates a permission, session, or product constraint.\n\nOutput JSON fields: ${compact(expected)}`;
  return { prompt, expected, deterministic,
    derivation: `CFD unavailable, cash-account short not allowed, futures not approved, session closed -> every route infeasible -> no_trade.`,
    failureModes: ['forces a trade on an invalid route'], mustNot: ['must_not_use_unavailable_route', 'must_not_short_in_cash_account'] };
}

function buildHardTier(tier: Tier, domain: Domain, family: string, seed: number): Packet {
  switch (domain) {
    case 'Portfolio risk / rebalancing': return buildPortfolio(tier, family, seed);
    case 'Futures / commodities / spreads / rolls': return buildFutures(tier, family, seed);
    case 'Listed options strategy / Greeks': return buildOptions(tier, family, seed);
    case 'Shorting / borrow / margin / locates': return buildShorting(tier, family, seed);
    case 'Spot FX / CFDs / multi-currency': return buildFX(tier, family, seed);
    case 'Execution / liquidity / microstructure': return buildExecution(tier, family, seed);
    case 'Corporate actions / settlement / calendar / jurisdiction': return buildCorporate(tier, family, seed);
    case 'Spot equities / ETFs': return buildSpotEquities(tier, family, seed);
    case 'Feasibility / rejection / no-trade traps': return buildFeasibility(tier, family, seed);
  }
}

// ----------------------------------------------------------------------------
// LOW / MID TIER BUILDERS (L1-L8). Real specs incl. futures multiplier.
// ----------------------------------------------------------------------------
type LMKind = 'equity' | 'option' | 'futures' | 'fx';
function lmProduct(domain: Domain, seed: number): { name: string; unit: string; kind: LMKind } {
  if (domain === 'Listed options strategy / Greeks') return { name: `${symFor(seed)} ${480 + (seed % 5) * 5} call`, unit: 'option_contract', kind: 'option' };
  if (domain === 'Futures / commodities / spreads / rolls') return { name: 'ES futures', unit: 'futures_contract', kind: 'futures' };
  if (domain === 'Spot FX / CFDs / multi-currency') return { name: 'EURUSD spot', unit: 'EUR', kind: 'fx' };
  return { name: instr(symFor(seed)), unit: 'share', kind: 'equity' };
}

// L1-L7 are tier-skill rows (extraction / arithmetic / schema / settlement / sizing). They are
// now DOMAIN-AWARE — the instrument and mechanic match the allocated domain — and carry an honest
// generic scenario_family that describes the actual task (no decorative strategy-family labels).
function buildLowMid(tier: Tier, domain: Domain, _family: string, seed: number): Packet {
  const p = lmProduct(domain, seed);

  if (tier === 'L1') {
    const quote = p.kind === 'option' ? `${(4 + (seed % 4)).toFixed(2)} USD/share premium`
      : p.kind === 'futures' ? `${(5000 + (seed % 8) * 25).toFixed(2)} index points`
      : p.kind === 'fx' ? `${round2(1.05 + (seed % 19) / 1000).toFixed(4)} USD per EUR`
      : `${(100 + (seed % 30) * 3).toFixed(2)} USD/share`;
    const expected = { decision: 'extract', instrument: p.name, quote, unit: p.unit };
    return { family: 'instrument_quote_extraction', prompt: `Frozen market snapshot:\n- Instrument: ${p.name}.\n- Quote: ${quote}.\n- Unit type: ${p.unit}.\n\nTask:\nExtract the instrument, quote, and unit type from the packet. Use only the frozen packet.\n\nOutput JSON fields: ${compact(expected)}`,
      expected, deterministic: ['instrument', 'quote', 'unit'], derivation: 'Literal extraction from the frozen packet.',
      failureModes: ['uses live data', 'changes a field'], mustNot: ['must_not_use_live_market_data'] };
  }

  if (tier === 'L2') {
    if (p.kind === 'option') {
      const contracts = 3 + (seed % 4); const premium = 2 + (seed % 5); const total = contracts * premium * 100;
      const expected = { decision: 'calculate_option_premium', instrument: p.name, contracts, premium_per_share: premium, multiplier: 100, total_premium_usd: total };
      return { family: 'option_premium_calc', prompt: `Frozen market snapshot:\n- Listed option: ${p.name}, premium ${premium}.00 USD/share.\n- Contracts: ${contracts}.\n- Option multiplier: 100 shares per contract.\n\nTask:\nCompute total option premium in USD.\n\nOutput JSON fields: ${compact(expected)}`,
        expected, deterministic: ['instrument', 'contracts', 'premium_per_share', 'multiplier', 'total_premium_usd'], derivation: `${contracts}*${premium}*100=${total}.`, failureModes: ['omits option multiplier'], mustNot: ['must_not_ignore_option_multiplier'] };
    }
    if (p.kind === 'futures') {
      const contracts = 1 + (seed % 4); const price = 5000 + (seed % 6) * 25; const mult = 50; const notional = contracts * price * mult;
      const expected = { decision: 'calculate_futures_notional', instrument: p.name, contracts, price, multiplier: mult, notional_usd: notional };
      return { family: 'futures_notional_calc', prompt: `Frozen market snapshot:\n- ES futures price: ${price.toFixed(2)} index points.\n- Contract multiplier: ${mult} USD per index point.\n- Contracts: ${contracts}.\n\nTask:\nCompute futures notional in USD (price * multiplier * contracts).\n\nOutput JSON fields: ${compact(expected)}`,
        expected, deterministic: ['instrument', 'contracts', 'price', 'multiplier', 'notional_usd'], derivation: `${contracts}*${price}*${mult}=${notional}.`, failureModes: ['omits futures multiplier'], mustNot: ['must_not_ignore_futures_multiplier'] };
    }
    if (p.kind === 'fx') {
      const eur = 100000 + (seed % 9) * 50000; const spot = round2(1.05 + (seed % 19) / 1000); const usd = round2(eur * spot);
      const expected = { decision: 'calculate_fx_conversion', instrument: p.name, eur_amount: eur, spot, usd_value: usd };
      return { family: 'fx_conversion_calc', prompt: `Frozen market snapshot:\n- EURUSD spot: ${spot.toFixed(4)} USD per EUR.\n- EUR amount: ${eur}.\n\nTask:\nConvert the EUR amount to USD at the frozen spot rate.\n\nOutput JSON fields: ${compact(expected)}`,
        expected, deterministic: ['instrument', 'eur_amount', 'spot', 'usd_value'], derivation: `${eur}*${spot}=${usd}.`, failureModes: ['wrong rate direction'], mustNot: ['must_not_use_live_fx_rate'] };
    }
    const qty = 100 + (seed % 5) * 100; const price = 80 + (seed % 20) * 5; const notional = qty * price;
    const expected = { decision: 'calculate_notional', instrument: p.name, quantity: qty, price, notional_usd: notional };
    return { family: 'equity_notional_calc', prompt: `Frozen market snapshot:\n- Instrument: ${p.name}.\n- Quantity: ${qty}.\n- Price: ${price}.00 USD.\n\nTask:\nCompute notional USD value.\n\nOutput JSON fields: ${compact(expected)}`,
      expected, deterministic: ['instrument', 'quantity', 'price', 'notional_usd'], derivation: `${qty}*${price}=${notional}.`, failureModes: ['wrong multiplication'], mustNot: ['must_not_use_live_market_data'] };
  }

  if (tier === 'L3') {
    if (p.kind === 'option') {
      const contracts = 2 + (seed % 5); const premium = 2 + (seed % 5); const fee = contracts * 1; const cost = round2(contracts * premium * 100 + fee);
      const expected = { decision: 'calculate_option_cost', instrument: p.name, contracts, premium_per_share: premium, fee_usd: fee, total_cost_usd: cost };
      return { family: 'option_cost_calc', prompt: `Frozen market snapshot:\n- Buy ${contracts} ${p.name} contracts at ${premium}.00 USD/share premium.\n- Option multiplier: 100 shares. Commission: 1.00 USD/contract.\n\nTask:\nCompute total premium cost including commission.\n\nOutput JSON fields: ${compact(expected)}`,
        expected, deterministic: ['instrument', 'contracts', 'premium_per_share', 'fee_usd', 'total_cost_usd'], derivation: `${contracts}*${premium}*100 + ${fee} = ${cost}.`, failureModes: ['omits commission', 'omits option multiplier'], mustNot: ['must_not_ignore_option_multiplier'] };
    }
    if (p.kind === 'futures') {
      const contracts = 1 + (seed % 4); const marginPer = 13000; const fee = contracts * 4; const cash = contracts * marginPer + fee;
      const expected = { decision: 'calculate_initial_margin', instrument: p.name, contracts, margin_per_contract: marginPer, fees_usd: fee, total_cash_usd: cash };
      return { family: 'futures_margin_calc', prompt: `Frozen market snapshot:\n- Buy ${contracts} ES futures (multiplier 50 USD/point). Initial margin: ${marginPer} USD/contract. Fee: 4.00 USD/contract.\n- Margin is posted as collateral, not full notional.\n\nTask:\nCompute total cash to post (initial margin plus fees).\n\nOutput JSON fields: ${compact(expected)}`,
        expected, deterministic: ['instrument', 'contracts', 'margin_per_contract', 'fees_usd', 'total_cash_usd'], derivation: `${contracts}*${marginPer} + ${fee} = ${cash}.`, failureModes: ['confuses notional with margin'], mustNot: ['must_not_post_full_notional_for_futures'] };
    }
    if (p.kind === 'fx') {
      const eur = 100000 + (seed % 9) * 50000; const spot = round2(1.05 + (seed % 19) / 1000); const fee = round2(eur * spot * 0.0001); const usd = round2(eur * spot + fee);
      const expected = { decision: 'calculate_fx_cost', instrument: p.name, eur_amount: eur, spot, fee_usd: fee, total_usd_cost: usd };
      return { family: 'fx_conversion_calc', prompt: `Frozen market snapshot:\n- Buy ${eur} EUR at EURUSD ${spot.toFixed(4)}. Fee: 1 bp of USD notional.\n\nTask:\nCompute total USD cost including the fee.\n\nOutput JSON fields: ${compact(expected)}`,
        expected, deterministic: ['instrument', 'eur_amount', 'spot', 'fee_usd', 'total_usd_cost'], derivation: `${eur}*${spot} + 1bp fee ${fee} = ${usd}.`, failureModes: ['omits fee'], mustNot: ['must_not_use_live_fx_rate'] };
    }
    const qty = 200 + (seed % 4) * 100; const price = 90 + (seed % 12) * 5; const fee = round2(qty * 0.005); const gross = qty * price; const net = round2(gross + fee);
    const expected = { decision: 'calculate_trade_cash', instrument: p.name, quantity: qty, price, gross_value_usd: gross, fee_usd: fee, cash_required_usd: net };
    return { family: 'trade_cash_calc', prompt: `Frozen market snapshot:\n- Buy ${qty} ${p.name} shares at ${price}.00 USD/share.\n- Commission: 0.005 USD/share.\n\nTask:\nCompute gross value, commission, and total cash required.\n\nOutput JSON fields: ${compact(expected)}`,
      expected, deterministic: ['instrument', 'quantity', 'price', 'gross_value_usd', 'fee_usd', 'cash_required_usd'], derivation: `gross=${qty}*${price}=${gross}; fee=${fee}; cash=${net}.`, failureModes: ['omits commission'], mustNot: ['must_not_omit_commission'] };
  }

  if (tier === 'L4') {
    // Financing/borrow cost — appropriate across margin/shorting/financing domains.
    const principal = 50000 + (seed % 7) * 10000; const rate = round2(0.06 + (seed % 4) * 0.01); const days = 15 + (seed % 8); const cost = round2(principal * rate * days / 360);
    const isShort = domain === 'Shorting / borrow / margin / locates';
    const label = isShort ? 'borrow' : 'financing';
    const expected = { decision: isShort ? 'calculate_borrow_cost' : 'calculate_financing_cost', instrument: p.name, principal_usd: principal, annual_rate: rate, day_count: 'Actual/360', days, cost_usd: cost };
    return { family: isShort ? 'borrow_cost_calc' : 'financing_cost_calc', prompt: `Frozen market snapshot:\n- Instrument: ${p.name}. Financed/borrowed principal: ${principal} USD.\n- ${label[0].toUpperCase() + label.slice(1)} rate: ${(rate * 100).toFixed(2)}% APR. Day count: Actual/360.\n- Holding period: ${days} calendar days. Simple interest; ignore compounding.\n\nTask:\nCompute the ${label} cost in USD.\n\nOutput JSON fields: ${compact(expected)}`,
      expected, deterministic: ['instrument', 'principal_usd', 'annual_rate', 'day_count', 'days', 'cost_usd'], derivation: `${principal}*${rate}*${days}/360=${cost}.`, failureModes: ['uses 365 basis'], mustNot: ['must_not_ignore_day_count'] };
  }

  if (tier === 'L5') {
    if (p.kind === 'futures') {
      const contracts = 1 + (seed % 5); const px = 5000 + (seed % 11) * 25; const limit = round2(px + 1);
      const expected = { decision: 'trade', instrument: p.name, side: 'buy', quantity: contracts, order_type: 'limit', limit_price: limit, multiplier: 50, time_in_force: 'day', feasibility: 'feasible' };
      return { family: 'order_ticket_mapping', prompt: `Frozen market snapshot:\n- Allowed products: ES futures trading allowed. Multiplier 50 USD/point.\n- Buy ${contracts} ES contracts, limit ${limit.toFixed(2)} index points, time in force day.\n\nTask:\nMap the instruction into the required order ticket schema.\n\nOutput JSON fields: ${compact(expected)}`,
        expected, deterministic: ['instrument', 'side', 'quantity', 'order_type', 'limit_price', 'multiplier', 'time_in_force', 'feasibility'], derivation: 'Schema mapping from the frozen futures instruction.', failureModes: ['wrong schema shape', 'omits multiplier'], mustNot: ['must_not_use_live_market_data'] };
    }
    if (p.kind === 'option') {
      const contracts = 1 + (seed % 6); const limit = round2(4 + (seed % 5) + 0.25);
      const expected = { decision: 'trade', instrument: p.name, side: 'buy_to_open', quantity: contracts, order_type: 'limit', limit_price: limit, multiplier: 100, time_in_force: 'day', feasibility: 'feasible' };
      return { family: 'order_ticket_mapping', prompt: `Frozen market snapshot:\n- Allowed products: listed options level 2 allowed. Multiplier 100 shares.\n- Buy to open ${contracts} ${p.name} contracts, limit ${limit.toFixed(2)} USD/share, time in force day.\n\nTask:\nMap the instruction into the required order ticket schema.\n\nOutput JSON fields: ${compact(expected)}`,
        expected, deterministic: ['instrument', 'side', 'quantity', 'order_type', 'limit_price', 'multiplier', 'time_in_force', 'feasibility'], derivation: 'Schema mapping from the frozen option instruction.', failureModes: ['wrong schema shape'], mustNot: ['must_not_use_live_market_data'] };
    }
    if (p.kind === 'fx') {
      const eur = 100000 + (seed % 9) * 50000; const limit = round2(1.05 + (seed % 19) / 1000);
      const expected = { decision: 'trade', instrument: p.name, side: 'buy', quantity: eur, order_type: 'limit', limit_price: limit, settlement_rule: 'T+2', time_in_force: 'day', feasibility: 'feasible' };
      return { family: 'order_ticket_mapping', prompt: `Frozen market snapshot:\n- Allowed products: spot FX allowed. Settlement T+2.\n- Buy ${eur} EUR via EURUSD, limit ${limit.toFixed(4)}, time in force day.\n\nTask:\nMap the instruction into the required order ticket schema.\n\nOutput JSON fields: ${compact(expected)}`,
        expected, deterministic: ['instrument', 'side', 'quantity', 'order_type', 'limit_price', 'settlement_rule', 'time_in_force', 'feasibility'], derivation: 'Schema mapping from the frozen FX instruction.', failureModes: ['wrong schema shape', 'omits T+2'], mustNot: ['must_not_use_live_fx_rate'] };
    }
    const qty = 100 + (seed % 6) * 100; const price = 100 + (seed % 20) * 4; const limit = round2(price + 0.25);
    const expected = { decision: 'trade', instrument: p.name, side: 'buy', quantity: qty, order_type: 'limit', limit_price: limit, time_in_force: 'day', feasibility: 'feasible' };
    return { family: 'order_ticket_mapping', prompt: `Frozen market snapshot:\n- Allowed products: ${p.name} trading allowed.\n- Buy ${qty} shares, limit ${limit.toFixed(2)}, time in force day.\n\nTask:\nMap the instruction into the required order ticket schema.\n\nOutput JSON fields: ${compact(expected)}`,
      expected, deterministic: ['instrument', 'side', 'quantity', 'order_type', 'limit_price', 'time_in_force', 'feasibility'], derivation: 'Schema mapping from the frozen instruction.', failureModes: ['wrong schema shape'], mustNot: ['must_not_use_live_market_data'] };
  }

  if (tier === 'L6') {
    const { settle } = tPlusOne(seed);
    const rule = p.kind === 'fx' ? 'T+2' : 'T+1';
    const expected = { decision: 'sequence', instrument: p.name, execution_sequence: ['check_permission', 'submit_order', 'confirm_settlement'], settlement_rule: rule, settlement_cash_date: settle, feasibility: 'feasible' };
    return { family: 'operational_settlement_sequence', prompt: `Frozen market snapshot:\n- Account permission for ${p.name}: allowed.\n- Proceeds settle ${rule}; cash date ${settle}.\n- Same-day withdrawal of unsettled proceeds is not allowed.\n\nTask:\nReturn the correct operational sequence and the ${rule} cash date.\n\nOutput JSON fields: ${compact(expected)}`,
      expected, deterministic: ['instrument', 'execution_sequence', 'settlement_rule', 'settlement_cash_date', 'feasibility'], derivation: `Permission precedes order; settlement confirmed ${rule}.`, failureModes: ['skips permission'], mustNot: ['must_not_ignore_settlement_rule'] };
  }

  // L7: whole-unit sizing with residual, domain-aware unit.
  if (p.kind === 'futures') {
    const target = 600000 + (seed % 6) * 50000; const price = 5000 + (seed % 8) * 25; const mult = 50; const notionalPer = price * mult;
    const contracts = Math.floor(target / notionalPer); const used = contracts * notionalPer; const residual = target - used;
    const expected = { decision: 'rebalance', instrument: p.name, target_notional_usd: target, price, multiplier: mult, contracts, used_notional_usd: used, residual_cash_usd: residual };
    return { family: 'futures_whole_unit_sizing', prompt: `Frozen market snapshot:\n- Target notional: ${target} USD via ES futures.\n- ES price ${price.toFixed(2)} index points; multiplier ${mult} USD/point; notional per contract = price * multiplier = ${notionalPer} USD.\n- Fractional contracts not allowed.\n\nTask:\nCompute whole contracts, used notional, and residual cash.\n\nOutput JSON fields: ${compact(expected)}`,
      expected, deterministic: ['instrument', 'target_notional_usd', 'price', 'multiplier', 'contracts', 'used_notional_usd', 'residual_cash_usd'], derivation: `notional/contract=${notionalPer}; floor(${target}/${notionalPer})=${contracts}; used=${used}; residual=${residual}.`, failureModes: ['ignores futures multiplier'], mustNot: ['must_not_ignore_futures_multiplier'] };
  }
  if (p.kind === 'option') {
    const budget = 40000 + (seed % 6) * 5000; const premium = 4 + (seed % 5); const per = premium * 100;
    const contracts = Math.floor(budget / per); const used = contracts * per; const residual = budget - used;
    const expected = { decision: 'rebalance', instrument: p.name, premium_budget_usd: budget, premium_per_share: premium, multiplier: 100, contracts, used_premium_usd: used, residual_cash_usd: residual };
    return { family: 'option_whole_unit_sizing', prompt: `Frozen market snapshot:\n- Premium budget: ${budget} USD for ${p.name}.\n- Premium ${premium}.00 USD/share; multiplier 100; cost per contract = ${per} USD.\n- Fractional contracts not allowed.\n\nTask:\nCompute whole contracts, used premium, and residual cash.\n\nOutput JSON fields: ${compact(expected)}`,
      expected, deterministic: ['instrument', 'premium_budget_usd', 'premium_per_share', 'multiplier', 'contracts', 'used_premium_usd', 'residual_cash_usd'], derivation: `cost/contract=${per}; floor(${budget}/${per})=${contracts}; used=${used}; residual=${residual}.`, failureModes: ['ignores option multiplier'], mustNot: ['must_not_ignore_option_multiplier'] };
  }
  const target = 50000 + (seed % 5) * 10000; const price = 100 + (seed % 20) * 4; const shares = Math.floor(target / price); const used = shares * price; const residual = target - used;
  const expected = { decision: 'rebalance', instrument: p.name, target_notional_usd: target, price, shares, used_notional_usd: used, residual_cash_usd: residual };
  return { family: 'equity_whole_unit_sizing', prompt: `Frozen market snapshot:\n- Target notional: ${target} USD in ${p.name}.\n- Price: ${price}.00 USD/share. Fractional shares not allowed.\n\nTask:\nCompute whole shares, used notional, and residual cash.\n\nOutput JSON fields: ${compact(expected)}`,
    expected, deterministic: ['instrument', 'target_notional_usd', 'price', 'shares', 'used_notional_usd', 'residual_cash_usd'], derivation: `floor(${target}/${price})=${shares}; used=${used}; residual=${residual}.`, failureModes: ['uses fractional shares'], mustNot: ['must_not_use_fractional_units'] };
}

function buildLowMidUnusedL8(tier: Tier, domain: Domain, seed: number): Packet {
  const sym = symFor(seed);
  // L8: route choice where feasibility is DERIVED from a stated fact (not labeled)
  const qty = 100 + (seed % 6) * 100; const price = 100 + (seed % 20) * 4;
  const directCost = qty * price; const compliantCost = directCost + 500 + (seed % 4) * 100;
  const { settle } = tPlusOne(seed);
  const routes = [
    `a same-day-settlement route at ${directCost} USD that requires cash to settle today`,
    `a standard T+1 route at ${compliantCost} USD with cash settling ${settle}`,
  ];
  const expected = { decision: 'choose_route', selected_route: 'route_b', route_a_cost_usd: directCost, route_b_cost_usd: compliantCost, incremental_cost_for_feasibility_usd: compliantCost - directCost, feasibility: 'feasible', rejected_routes: ['route_a'] };
  return { prompt: `Frozen market snapshot:\n- Instrument: ${instr(sym)}; order ${qty} shares. Account fact: only T+1 settlement is supported; same-day settlement is NOT available on this account.\n` +
    `Candidate routes (decide feasibility from the settlement fact yourself):\n` + renderRoutes(routes) + `\n\n` +
    `Task:\nChoose the feasible route and compute the incremental cost paid for feasibility. Report rejected routes by route id.\n\nOutput JSON fields: ${compact(expected)}`,
    expected, deterministic: ['selected_route', 'route_a_cost_usd', 'route_b_cost_usd', 'incremental_cost_for_feasibility_usd'], derivation: `Same-day settlement unavailable -> Route A infeasible. Route B feasible; incremental cost = ${compliantCost}-${directCost}=${compliantCost - directCost}.`, failureModes: ['picks infeasible same-day route'], mustNot: ['must_not_pick_unsupported_settlement'] };
}

function buildPacket(tier: Tier, domain: Domain, family: string, seed: number): Packet {
  // L8 (conditional reasoning) uses the real per-family domain builders too, so its
  // scenario_family is honest and it is not a single mislabeled template. L8 gets the base
  // route-selection shape (3 routes, no stress block); L10/AGI add depth.
  if (['L8', 'L9', 'L10', 'AGI'].includes(tier)) return buildHardTier(tier, domain, family, seed);
  return buildLowMid(tier, domain, family, seed);
}

// ----------------------------------------------------------------------------
// RUBRIC ASSEMBLY
// ----------------------------------------------------------------------------
function validationFor(value: unknown, key: string): Array<[string, Record<string, unknown>]> {
  // self_check is a self-verification artifact: presence-checked only, never an exact nested
  // schema. The prompt does not (and should not) name its sub-keys, so requiring exact keys
  // would be hidden-schema unfairness under strict pass@1.
  if (key === 'self_check' || key.endsWith('.self_check')) {
    return [[key, {}]]; // pure presence check — any non-empty self_check (object/array/string) is accepted
  }
  if (typeof value === 'number') return [[key, { type: 'number', expected: value, tolerance: 0.01 }]];
  if (typeof value === 'boolean') return [[key, { type: 'boolean', expected: value }]];
  if (Array.isArray(value)) return [[key, { type: 'array', expected_set: value, min_items: value.length, match_type: 'exact_set' }]];
  if (value !== null && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).flatMap(([ck, cv]) => validationFor(cv, `${key}.${ck}`));
  }
  return [[key, { type: 'string', expected: value }]];
}

const SEMANTIC_STRING_CRITICAL = new Set([
  'decision', 'feasibility', 'selected_route', 'chosen_route', 'selected_instrument', 'instrument',
  'side', 'unit', 'order_type', 'venue', 'settlement_rule', 'settlement_cash_date', 'settlement_date',
  'settlement_date_rule', 'day_count',
]);
function criticalFields(validation: Record<string, Record<string, unknown>>): string[] {
  return Object.entries(validation)
    .filter(([k, spec]) => spec.type === 'number' || spec.type === 'boolean' || (spec.type === 'string' && SEMANTIC_STRING_CRITICAL.has(k)))
    .map(([k]) => k);
}

function rubricFor(q: Question, derivation: string, failureModes: string[], mustNot: string[]) {
  const validation = Object.fromEntries(Object.entries(q.expected_values).flatMap(([k, v]) => validationFor(v, k)));
  const fields = Object.keys(validation);
  const meta = q.context.stockbench as Record<string, unknown>;
  return {
    id: q.rubric_id,
    expected_fields: fields,
    required_fields: fields,
    field_weights: {},
    pass_threshold: 0.7,
    _agi_canonical: { id: q.id, title: `${q.id} canonical`, validation, derivation, pass_condition: 'All required deterministic fields must match the frozen packet canonical answer; feasibility must be derived, not read from a label.' },
    metadata: {
      benchmark: 'StockBench',
      primary_domain: meta.primary_domain, tier: meta.tier, capability_tag: meta.capability_tag,
      scenario_family: meta.scenario_family, feasibility_trap: meta.feasibility_trap, objective_function: meta.objective_function,
      failure_modes: failureModes, must_not: mustNot, critical_fields: criticalFields(validation), needs_review: false,
    },
  };
}

function feasibilityFlag(domain: Domain, tier: Tier, index: number): boolean {
  if (domain === 'Feasibility / rejection / no-trade traps') return true;
  if (domain.includes('Shorting') || domain.includes('Corporate') || domain.includes('Execution')) return tier !== 'L1';
  if (domain.includes('Options') || domain.includes('FX') || domain.includes('Futures')) return index % 2 === 0;
  return ['L9', 'L10', 'AGI'].includes(tier) ? index % 4 === 0 : false;
}

// ----------------------------------------------------------------------------
// DISTRIBUTION LOOP
// ----------------------------------------------------------------------------
const domainRemaining = Object.fromEntries(domains.map(d => [d, domainTargets[d] - existingDomainCounts[d]])) as Record<Domain, number>;
const bucketRemaining = Object.fromEntries(domains.map(d => [d, Object.fromEntries(Object.entries(bucketTargets[d]).map(([b, t]) => [b, t - existingBucketCounts[d][b]]))])) as Record<Domain, Record<string, number>>;
const tierRemaining = Object.fromEntries(tiers.map(t => [t, tierTargets[t] - existingTierCounts[t]])) as Record<Tier, number>;
const questions: Question[] = [];
let globalIndex = 1;

for (const tier of tiers) {
  while (tierRemaining[tier] > 0) {
    const bucket = bucketFor(tier);
    const domain = domains
      .filter(c => domainRemaining[c] > 0 && bucketRemaining[c][bucket] > 0)
      .sort((a, b) => bucketRemaining[b][bucket] - bucketRemaining[a][bucket] || domainRemaining[b] - domainRemaining[a])[0];
    if (!domain) throw new Error(`No domain remaining for ${tier}`);
    const familyList = scenarioFamilies[domain];
    const family = familyList[globalIndex % familyList.length];
    const id = nextId(tier);
    const seed = globalIndex + levelByTier[tier] * 17;
    const packet = buildPacket(tier, domain, family, seed);
    const scenarioFamily = packet.family ?? family; // low/mid tiers carry an honest family override
    const objective_function = objectiveFor(tier, `objective for ${scenarioFamily}`);
    const q: Question = {
      id, level: levelByTier[tier], type: 'schema',
      rubric_id: `stockbench-${tier.toLowerCase()}-${id.split('-').at(-1)}`,
      prompt: packet.prompt, expected_values: packet.expected,
      context: {
        benchmark: 'StockBench',
        stockbench: {
          primary_domain: domain, tier, capability_tag: capTag(tier, globalIndex),
          scenario_family: scenarioFamily, feasibility_trap: feasibilityFlag(domain, tier, globalIndex),
          ...(objective_function ? { objective_function } : {}),
          deterministic_grading_fields: packet.deterministic,
        },
        canonical_answer: packet.expected,
      },
    };
    questions.push(q);
    fs.writeFileSync(path.join(RUBRIC_DIR, `${q.rubric_id}.json`), `${JSON.stringify(rubricFor(q, packet.derivation, packet.failureModes, packet.mustNot), null, 2)}\n`);
    domainRemaining[domain] -= 1;
    bucketRemaining[domain][bucket] -= 1;
    tierRemaining[tier] -= 1;
    globalIndex += 1;
  }
}

if (questions.length !== 270) throw new Error(`Expected 270 generated questions, got ${questions.length}`);

const source = `import type { SchemaQuestion } from '../types/schema';\n\n// Generated StockBench expansion (leakage-free rebuild). Audited by mutation-test + quality-gate.\nexport const STOCKBENCH_GENERATED_QUESTIONS: SchemaQuestion[] = ${JSON.stringify(questions, null, 2)};\n`;
fs.writeFileSync(OUT_QUESTIONS, source);
console.log(JSON.stringify({ generated_questions: questions.length, domainRemaining, bucketRemaining, tierRemaining }, null, 2));
