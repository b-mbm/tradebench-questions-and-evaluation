#!/usr/bin/env tsx
/**
 * StockBench honest quality gate.
 *
 * This is a GUARDRAIL, not a freeze proof. It is deliberately allowed to FAIL,
 * and it does not certify difficulty. It measures the things the circular
 * audit cannot:
 *
 *   1. Answer leakage  - expected rejected_routes / self_check values printed
 *                        in the prompt, or reason-encoded route labels.
 *   2. Cognitive diversity - distinct prompt skeletons after masking numbers,
 *                        tickers, snake_case identifiers AND scenario_family text.
 *   3. scenario_family content match - the tagged family must actually appear
 *                        as mechanics in the prompt.
 *   4. Answer-key duplication - identical expected_values across rows.
 *   5. Difficulty honesty proxy - hard rows whose route feasibility is
 *                        pre-labeled in the prompt are flagged as extraction,
 *                        not synthesis (a heuristic, reported not enforced).
 *
 * No paid model calls.
 */
import { STOCKBENCH_QUESTIONS_300Q } from '../src/questions/stockbench-questions-300q';

type Json = any;
const qs = STOCKBENCH_QUESTIONS_300Q as Json[];
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

// ---------- 1. Answer leakage ----------
const LEAK_PATTERNS = [
  /_valid_plan(_\d+)?/i,
  /_reject_(margin_capacity|minimum_reduction|permission_or_calendar|target)/i,
  /_domain_constraint_satisfied/i,
  /satisfies the domain check/i,
  /violates margin capacity/i,
  /fails the required reduction/i,
  /required self_check labels:/i,
  /reject (invalid )?routes using exact labels/i,
  /using the exact labels shown above/i,
];
let labelPatternRows = 0;
let valueLeakRows = 0;
const leakIds: string[] = [];
for (const q of qs) {
  const p = q.prompt as string;
  const np = norm(p);
  const patternHit = LEAK_PATTERNS.some(re => re.test(p));
  if (patternHit) labelPatternRows += 1;
  // Neutral handles (route_a, none) printed in the prompt are NOT leakage: the model must
  // still DERIVE which routes are infeasible. Only reason-BEARING labels that encode the
  // verdict and also appear in the prompt count as answer leakage.
  const REASON_BEARING = /(reject|valid_plan|_fail|violat|satisf|exceed|within_limit|margin_capacity|minimum_reduction|no_valid|permission|liquidity|unhedged|cheaper|first_notice)/i;
  const isNeutral = (x: string) => /^(route_[a-d]|none)$/i.test(x);
  let valueLeak = false;
  for (const key of ['rejected_routes', 'self_check']) {
    const v = q.expected_values?.[key];
    if (Array.isArray(v) && v.length) {
      const reasonItems = v.filter((x: Json) => typeof x === 'string' && !isNeutral(x) && REASON_BEARING.test(x));
      if (reasonItems.length && reasonItems.every((x: string) => np.includes(norm(x)))) valueLeak = true;
    }
  }
  if (valueLeak) valueLeakRows += 1;
  if (patternHit || valueLeak) leakIds.push(q.id);
}

// ---------- 2. Cognitive diversity ----------
const FAMILIES = new Set<string>(qs.map(q => String(q.context?.stockbench?.scenario_family ?? '')).filter(Boolean));
function cognitiveSkeleton(p: string): string {
  let s = p.toLowerCase();
  // mask families explicitly so a different decorative family tag != different question
  for (const f of FAMILIES) s = s.split(f.toLowerCase()).join('<family>');
  return s
    .replace(/\b20\d{2}-\d{2}-\d{2}\b/g, '<date>')
    .replace(/\b\d{1,2}:\d{2}(?::\d{2})?\b/g, '<time>')
    .replace(/[a-z0-9]+(?:_[a-z0-9]+)+/g, '<id>')           // snake_case identifiers/labels
    .replace(/\b(spy|aapl|msft|nvda|tsla|qqq|iwm|gld|xlk|xlf|xle|slv|tlt|es|mes|cl|nq|rty|hg|ng|zc|zn|eurusd|gbpusd|usdjpy|eur|usd|gbp|jpy)\b/g, '<sym>')
    .replace(/\b\d+(?:,\d{3})*(?:\.\d+)?%?\b/g, '<num>')
    .replace(/\s+/g, ' ')
    .trim();
}
const tiers = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'AGI'];
const diversity: Record<string, { q: number; skeletons: number; ratio: number; largest: number; bar: number; pass: boolean }> = {};
for (const t of tiers) {
  const arr = qs.filter(q => String(q.context?.stockbench?.tier) === t);
  if (!arr.length) continue;
  const counts = new Map<string, number>();
  for (const q of arr) { const k = cognitiveSkeleton(q.prompt); counts.set(k, (counts.get(k) ?? 0) + 1); }
  const ratio = counts.size / arr.length;
  const bar = (t === 'L9' || t === 'L10' || t === 'AGI') ? 0.4 : 0;
  diversity[t] = {
    q: arr.length,
    skeletons: counts.size,
    ratio: Math.round(ratio * 1000) / 1000,
    largest: Math.max(...counts.values()),
    bar,
    pass: bar === 0 || ratio >= bar,
  };
}

// ---------- 3. scenario_family content match ----------
const FAMILY_SIGNATURES: Record<string, RegExp[]> = {
  span_margin_calendar_spread: [/span/i, /calendar spread/i],
  early_assignment_dividend_risk: [/assign/i, /dividend|ex-div/i],
  put_spread_downside_floor: [/put spread|put/i, /floor|downside/i],
  covered_call_assignment: [/covered call|call/i, /assign/i],
  exercise_assignment_roll_decision: [/exercise|assign|roll/i],
  futures_roll_calendar: [/roll/i, /notice|near-month|next-month/i],
  commodity_roll_basis_hedge: [/roll|basis/i],
  futures_beta_hedge: [/beta/i, /futures|es\b/i],
  fx_settlement_mismatch: [/settl/i, /t\+|fx|eur|currency/i],
  cfd_margin_regional_constraint: [/cfd/i],
  forward_vs_spot_payment: [/forward|spot/i],
  multi_currency_cash_buffer: [/currenc|fx|cash buffer/i],
  short_locate_failure: [/locate/i],
  borrow_cost_vs_trade_edge: [/borrow/i],
  hard_to_borrow_margin_recall: [/borrow|recall|hard.to.borrow/i],
  locate_recall_options_substitution: [/locate|recall/i],
  order_book_liquidity_limit: [/ask book|order book|average (execution )?price|clip/i],
  twap_slippage_limit: [/twap|slippage/i],
  invalid_route_session_trap: [/session|permission|unavailable|not approved|reject/i],
  auction_session_constraint: [/auction|session/i],
  ex_dividend_adjustment: [/ex-div|dividend/i],
  t_plus_one_settlement_sequence: [/t\+1|settle/i],
  corporate_action_adjustment: [/dividend|split|corporate action|stop/i],
  regional_market_holiday: [/holiday|calendar/i],
  no_trade_invalid_route: [/no.trade|reject|infeasible|unavailable/i],
  borrow_recall_margin_hedge: [/recall|borrow|margin/i],
  unsupported_product_permission: [/unavailable|not approved|permission/i],
  session_permission_rejection: [/session|permission|closed/i],
  beta_dollar_rebalance: [/beta/i],
  multi_asset_drawdown_hedge: [/drawdown|hedge/i],
  cross_asset_var_liquidity_triage: [/var|liquidity/i],
  risk_budget_rebalance: [/risk budget|rebalance/i],
  equity_order_ticket: [/limit|ticket|order/i],
  etf_sector_rebalance_t_plus_one: [/etf|sector|rebalance/i],
  opening_auction_limit: [/auction|opening/i],
  market_on_close_rebalance: [/market on close|moc|close/i],
};
let familyChecked = 0, familyMismatch = 0;
const familyMismatchByFamily: Record<string, { miss: number; total: number }> = {};
const familyMismatchIds: string[] = [];
for (const q of qs) {
  // scenario_family content is enforced where it matters most: the hard tiers, where
  // "decorative family" was the original blocker. Low/mid-tier family tags are nominal.
  if (!['L9', 'L10', 'AGI'].includes(String(q.context?.stockbench?.tier))) continue;
  const fam = String(q.context?.stockbench?.scenario_family ?? '');
  const sig = FAMILY_SIGNATURES[fam];
  if (!sig) continue;
  familyChecked += 1;
  familyMismatchByFamily[fam] ??= { miss: 0, total: 0 };
  familyMismatchByFamily[fam].total += 1;
  const matched = sig.every(re => re.test(q.prompt));
  if (!matched) {
    familyMismatch += 1;
    familyMismatchByFamily[fam].miss += 1;
    if (familyMismatchIds.length < 30) familyMismatchIds.push(`${q.id}(${fam})`);
  }
}

// ---------- 4. answer-key duplication ----------
const exv = new Map<string, string[]>();
for (const q of qs) { const k = JSON.stringify(q.expected_values); (exv.get(k) ?? exv.set(k, []).get(k)!).push(q.id); }
const dupAnswerGroups = [...exv.values()].filter(v => v.length > 1);
const dupAnswerRows = dupAnswerGroups.reduce((s, v) => s + v.length - 1, 0);

// ---------- 5. difficulty honesty proxy ----------
// hard row whose route feasibility is pre-labeled OR which leaks => extraction, not synthesis
let hardExtractionFlagged = 0;
for (const q of qs) {
  const t = String(q.context?.stockbench?.tier);
  if (!['L9', 'L10', 'AGI'].includes(t)) continue;
  if (LEAK_PATTERNS.some(re => re.test(q.prompt))) hardExtractionFlagged += 1;
}

// ---------- report ----------
console.log('=== StockBench quality gate (guardrail, NOT a freeze proof) ===\n');
console.log('1. ANSWER LEAKAGE');
console.log(`   rows with reason-encoded label patterns: ${labelPatternRows}`);
console.log(`   rows printing rejected_routes/self_check verbatim: ${valueLeakRows}`);
console.log(`   total leaking rows: ${new Set(leakIds).size}  (target: 0)`);
console.log('\n2. COGNITIVE DIVERSITY (number/ticker/id/family-masked)');
for (const t of tiers) if (diversity[t]) {
  const d = diversity[t];
  console.log(`   ${t}: ${d.skeletons}/${d.q} = ${d.ratio} (largest cluster ${d.largest}) bar ${d.bar} -> ${d.pass ? 'ok' : 'FAIL'}`);
}
console.log('\n3. SCENARIO_FAMILY CONTENT MATCH');
console.log(`   mismatched: ${familyMismatch}/${familyChecked} = ${(familyChecked ? (familyMismatch / familyChecked * 100) : 0).toFixed(1)}%  (target <5%)`);
const worstFam = Object.entries(familyMismatchByFamily).filter(([, v]) => v.miss > 0).sort((a, b) => b[1].miss - a[1].miss).slice(0, 8);
worstFam.forEach(([f, v]) => console.log(`     ${f}: ${v.miss}/${v.total}`));
console.log('\n4. ANSWER-KEY DUPLICATION');
console.log(`   identical-answer-key groups: ${dupAnswerGroups.length}, redundant rows: ${dupAnswerRows}  (target: 0)`);
console.log('\n5. DIFFICULTY HONESTY PROXY');
console.log(`   L9/L10/AGI rows with pre-labeled feasibility (extraction, not synthesis): ${hardExtractionFlagged}`);

const gatePass =
  new Set(leakIds).size === 0 &&
  tiers.every(t => !diversity[t] || diversity[t].pass) &&
  (familyChecked === 0 || familyMismatch / familyChecked < 0.05) &&
  dupAnswerRows === 0;

console.log(`\nGUARDRAIL: ${gatePass ? 'PASS' : 'FAIL'} (informational; freeze also requires the mutation gate + a model smoke run)`);
if (!gatePass) process.exitCode = 1;
