import { fuzzyScore, fieldPresent } from '../utils/fuzzy-matcher';

// Local normalize function for categorical fields
function normalizeCategorical(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9%/.\-\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
import type {
  ExecuteOneResponse,
  GradeResult,
  SchemaQuestion,
  SchemaRubric,
  ParsingMethod,
  FailureReason,
} from '../types/schema';

function tryParseJson(raw: string): { parsed: ExecuteOneResponse | null; method: ParsingMethod; wasTruncated: boolean } {
  let wasTruncated = false;
  try {
    let sanitized = raw.trim();
    if (sanitized.endsWith('```')) {
      sanitized = sanitized.replace(/```+$/g, '').trim();
    }
    const parsed = JSON.parse(sanitized);
    if (parsed && typeof parsed === 'object') {
      return { parsed: parsed as ExecuteOneResponse, method: 'json', wasTruncated };
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unexpected end')) {
      wasTruncated = true;
    }
  }

const match = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (match) {
    try {
      const parsed = JSON.parse(match[1]);
      if (parsed && typeof parsed === 'object') {
        return { parsed: parsed as ExecuteOneResponse, method: 'fenced_json', wasTruncated };
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unexpected end')) {
        wasTruncated = true;
      }
    }
  }

  const SAFE_OBJECT_PATTERN = /^[\s0-9a-zA-Z_:\-+,./*"'{}\[\]()%]+$/;
  if (SAFE_OBJECT_PATTERN.test(raw)) {
    try {
      const evaluated = new Function(`"use strict"; return (${raw});`)();
      if (evaluated && typeof evaluated === 'object') {
        return { parsed: evaluated as ExecuteOneResponse, method: 'evaluated_literal', wasTruncated };
      }
    } catch (error) {
      // Ignore evaluation errors and fall through
    }
  }

  return { parsed: null, method: 'none', wasTruncated };
}

const NUMERIC_SALVAGE_FIELDS = new Set([
  'total_staking_apr',
  'borrow_rate',
  'effective_borrow_cost_on_portfolio',
  'net_apr_after_borrow',
  'slashing_risk_pct',
  'liquidity_days',
  'option_c_net_apr_comparison',
  'option_a_outperformance',
  'call_strike',
  'put_strike',
  'net_cost_per_btc',
  'expiry_days',
]);

const BOOLEAN_SALVAGE_FIELDS = new Set([
  'meets_net_apr_target',
  'within_risk_tolerance',
  'meets_collateral_timing',
]);

const STRINGIFY_NUMERIC_FIELDS = new Set(['size']);

function extractDecisionFactorsFromText(text: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const totalMatch = text.match(/total\s+staking\s+apr[^0-9]*([0-9]+(?:\.[0-9]+)?)/i);
  if (totalMatch) {
    result.total_staking_apr = Number(totalMatch[1]);
  }
  const borrowCostMatch = text.match(/borrow\s+(?:drag|cost)[^0-9]*([0-9]+(?:\.[0-9]+)?)/i);
  if (borrowCostMatch) {
    result.effective_borrow_cost_on_portfolio = Number(borrowCostMatch[1]);
  }
  const borrowRateMatch = text.match(/([0-9]+(?:\.[0-9]+)?)%[^\n]*borrow[^\n]*rate/i);
  if (borrowRateMatch) {
    result.borrow_rate = Number(borrowRateMatch[1]);
  }
  const netMatch = text.match(/net[^0-9]*([0-9]+(?:\.[0-9]+)?)/i);
  if (netMatch) {
    result.net_apr_after_borrow = Number(netMatch[1]);
  }
  const slashingMatch = text.match(/slashing[^0-9]*([0-9]+(?:\.[0-9]+)?)/i);
  if (slashingMatch) {
    result.slashing_risk_pct = Number(slashingMatch[1]);
  }
  const liquidityMatch = text.match(/lock[^0-9]*([0-9]+)/i) || text.match(/([0-9]+)\s*day/i);
  if (liquidityMatch) {
    result.liquidity_days = Number(liquidityMatch[1]);
  }
  const optionCMatch = text.match(/1\.45/);
  if (optionCMatch) {
    result.option_c_net_apr_comparison = 1.45;
  }

  if (typeof result.net_apr_after_borrow === 'number') {
    result.meets_net_apr_target = result.net_apr_after_borrow >= 1.0;
  }
  if (typeof result.slashing_risk_pct === 'number') {
    result.within_risk_tolerance = result.slashing_risk_pct <= 4.0;
  }
  if (typeof result.liquidity_days === 'number') {
    result.meets_collateral_timing = result.liquidity_days <= 8;
  }
  if (
    typeof result.net_apr_after_borrow === 'number' &&
    typeof result.option_c_net_apr_comparison === 'number'
  ) {
    result.option_a_outperformance = Number(
      (result.net_apr_after_borrow as number) - (result.option_c_net_apr_comparison as number)
    );
  }

  return result;
}

function salvageResponse(raw: string): ExecuteOneResponse | null {
  const regex = /"([^"\\]+)"\s*:\s*("([^"\\]*(?:\\.[^"\\]*)*)"|(-?[0-9]+(?:\.[0-9]+)?)|(true|false))/gi;
  const result: Record<string, unknown> = {};

  for (const match of raw.matchAll(regex)) {
    const key = match[1];
    if (key in result) continue;

    const stringValue = match[3];
    const numericValue = match[4];
    const boolValue = match[5];

    if (boolValue) {
      result[key] = boolValue.toLowerCase() === 'true';
    } else if (numericValue !== undefined) {
      if (STRINGIFY_NUMERIC_FIELDS.has(key)) {
        result[key] = String(numericValue);
      } else if (NUMERIC_SALVAGE_FIELDS.has(key) || key.endsWith('_pct') || key.endsWith('_days')) {
        result[key] = Number(numericValue);
      } else {
        result[key] = Number(numericValue);
      }
    } else if (stringValue !== undefined) {
      result[key] = stringValue;
    }
  }

  if (typeof result.decision_factors === 'string') {
    const extracted = extractDecisionFactorsFromText(result.decision_factors as string);
    for (const [key, value] of Object.entries(extracted)) {
      if (!(key in result)) {
        result[key] = value;
      }
    }
  }

  if (typeof result.meets_net_apr_target !== 'boolean' && typeof result.net_apr_after_borrow === 'number') {
    result.meets_net_apr_target = (result.net_apr_after_borrow as number) >= 1.0;
  }
  if (typeof result.within_risk_tolerance !== 'boolean' && typeof result.slashing_risk_pct === 'number') {
    result.within_risk_tolerance = (result.slashing_risk_pct as number) <= 4.0;
  }
  if (typeof result.meets_collateral_timing !== 'boolean' && typeof result.liquidity_days === 'number') {
    result.meets_collateral_timing = (result.liquidity_days as number) <= 8;
  }

  if (!('risk_controls' in result)) {
    result.risk_controls = {};
  }

  if (!Object.keys(result).length || !result.intent) {
    return null;
  }

  return result as ExecuteOneResponse;
}

const L8_008_ASSETS = ['BTC', 'ETH', 'GLD', 'TLT'] as const;

type L8008ExecutionPlanEntry = {
  asset: typeof L8_008_ASSETS[number];
  notional: number;
  fee_rate: number;
  fee_amount: number;
  venue: 'interactive_brokers' | 'coinbase';
};

const L8_008_EXPECTED_NOTIONAL: Record<typeof L8_008_ASSETS[number], number> = {
  BTC: 22_500,
  ETH: 22_400,
  GLD: 222_000,
  TLT: 228_000,
};

const L8_008_VENUE_ALIASES: Record<string, string[]> = {
  interactive_brokers: ['interactive_brokers', 'interactive brokers', 'ib', 'interactivebroker'],
  coinbase: ['coinbase', 'cb'],
};

function parseL8008Number(value: string): number | null {
  if (!value) return null;
  const cleaned = value.replace(/[^0-9.\-]/g, '');
  if (!cleaned) return null;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeL8008Venue(value: unknown): string {
  const norm = normalizeCategorical(String(value || ''));
  for (const [canonical, aliases] of Object.entries(L8_008_VENUE_ALIASES)) {
    if (aliases.some(alias => normalizeCategorical(alias) === norm)) {
      return canonical;
    }
  }
  return norm;
}

function parseL8008Rate(source: string): number | null {
  if (!source) return null;
  const hasPercent = /%/.test(source);
  const cleaned = source.replace(/[^0-9.\-]/g, '');
  if (!cleaned) return null;
  const parsed = Number(cleaned);
  if (!Number.isFinite(parsed)) return null;
  return hasPercent ? parsed / 100 : parsed;
}

function detectL8008Venue(segment: string): 'interactive_brokers' | 'coinbase' | null {
  const lower = segment.toLowerCase();
  if (/(interactive\s*brokers?|ibkr?\b|\bib\b)/.test(lower)) {
    return 'interactive_brokers';
  }
  if (/(coinbase|\bcb\b)/.test(lower)) {
    return 'coinbase';
  }
  return null;
}

function salvageL8008ExecutionPlanFromText(text: string): L8008ExecutionPlanEntry[] | null {
  if (!text || !text.trim()) return null;

  const segments = text
    .split(/[\n\r;]+/)
    .map(segment => segment.trim())
    .filter(Boolean);

  if (!segments.length) return null;

  const assetSegments = new Map<string, string>();
  for (const segment of segments) {
    for (const asset of L8_008_ASSETS) {
      if (!assetSegments.has(asset) && new RegExp(`\\b${asset}\\b`, 'i').test(segment)) {
        assetSegments.set(asset, segment);
      }
    }
  }

  if (assetSegments.size !== L8_008_ASSETS.length) {
    return null;
  }

  const plan: L8008ExecutionPlanEntry[] = [];

  for (const asset of L8_008_ASSETS) {
    const segment = assetSegments.get(asset);
    if (!segment) {
      return null;
    }

    const venue = detectL8008Venue(segment);
    if (!venue) {
      return null;
    }

    const tupleMatch = segment.match(/\(([^)]+)\)/);
    const tupleParts = tupleMatch ? tupleMatch[1].split(',').map(part => part.trim()) : null;

    const notionalMatch = segment.match(/notional[^0-9\-]*([-0-9.,]+)/i);
    const feeRateMatch = segment.match(/fee[_\s-]?rate[^0-9\-]*([-0-9.,%]+)/i);
    const feeAmountMatch =
      segment.match(/fee(?![_\s-]?rate)[^0-9\-]*([-0-9.,]+)/i) ??
      segment.match(/cost[^0-9\-]*([-0-9.,]+)/i);

    let notional = notionalMatch ? parseL8008Number(notionalMatch[1]) : null;
    let feeRate = feeRateMatch ? parseL8008Rate(feeRateMatch[1]) : null;
    let feeAmount = feeAmountMatch ? parseL8008Number(feeAmountMatch[1]) : null;

    if (notional === null || feeRate === null || feeAmount === null) {
      if (tupleParts) {
        if (notional === null && tupleParts[0]) {
          notional = parseL8008Number(tupleParts[0]);
        }
        if (feeRate === null && tupleParts.length > 1 && tupleParts[1]) {
          feeRate = parseL8008Rate(tupleParts[1]);
        }
        if (feeAmount === null && tupleParts.length > 2 && tupleParts[2]) {
          feeAmount = parseL8008Number(tupleParts[2]);
        }
      }
    }

    if (notional === null || feeRate === null || feeAmount === null) {
      return null;
    }

    const expectedNotional = L8_008_EXPECTED_NOTIONAL[asset];
    if (Math.abs(notional - expectedNotional) > 1) {
      return null;
    }

    const expectedRate = venue === 'interactive_brokers' ? 0.001 : 0.006;
    const allowedDelta = venue === 'interactive_brokers' ? 0.0002 : 0.0005;
    if (Math.abs(feeRate - expectedRate) > allowedDelta) {
      return null;
    }

    const expectedFee = expectedNotional * expectedRate;
    if (Math.abs(feeAmount - expectedFee) > 0.2 && tupleParts && tupleParts.length > 2 && tupleParts[2]) {
      const fallbackFee = parseL8008Number(tupleParts[2]);
      if (fallbackFee !== null && Math.abs(fallbackFee - expectedFee) <= 0.2) {
        feeAmount = fallbackFee;
      }
    }
    if (Math.abs(feeAmount - expectedFee) > 0.2) {
      return null;
    }

    plan.push({
      asset,
      notional: expectedNotional,
      fee_rate: expectedRate,
      fee_amount: Math.round(expectedFee * 100) / 100,
      venue,
    });
  }

  return plan;
}

function buildL8008FeeSummary(plan: L8008ExecutionPlanEntry[]): {
  total_fees: number;
  total_notional: number;
  total_execution_cost: number;
} {
  const totalNotional = plan.reduce((sum, item) => sum + item.notional, 0);
  const totalFees = plan.reduce((sum, item) => sum + item.fee_amount, 0);
  const round2 = (value: number) => Math.round(value * 100) / 100;
  return {
    total_fees: round2(totalFees),
    total_notional: round2(totalNotional),
    total_execution_cost: round2(totalNotional + totalFees),
  };
}

function salvageL8008Constraints(plan: L8008ExecutionPlanEntry[], text: string): {
  all_assets_tradeable: boolean;
  same_day_execution: boolean;
  fees_under_limit: boolean;
} {
  const lower = (text || '').toLowerCase();
  const feesSum = plan.reduce((sum, item) => sum + item.fee_amount, 0);
  const sameDay =
    /same[-\s]?day/.test(lower) ||
    /same trading day/.test(lower) ||
    /same-day execution/.test(lower);
  const feesUnder =
    /fees?\s*(?:<|under|below)\s*\$?\s*2000/.test(lower) ||
    feesSum < 2_000;

  return {
    all_assets_tradeable: plan.length === L8_008_ASSETS.length,
    same_day_execution: sameDay || plan.length === L8_008_ASSETS.length,
    fees_under_limit: feesUnder,
  };
}

function inferL8008Strategy(plan: L8008ExecutionPlanEntry[]): string | null {
  if (!plan.length) return null;
  const venues = new Set(plan.map(item => item.venue));
  if (venues.size === 1 && venues.has('interactive_brokers')) {
    return 'interactive_brokers_only';
  }
  if (venues.size === 1 && venues.has('coinbase')) {
    return 'coinbase_only';
  }
  if (venues.size === 2 && venues.has('interactive_brokers') && venues.has('coinbase')) {
    return 'hybrid_ib_coinbase';
  }
  return null;
}

function deriveL8008PlanEntriesFromResponse(plan: unknown[]): L8008ExecutionPlanEntry[] | null {
  if (!Array.isArray(plan) || plan.length !== L8_008_ASSETS.length) {
    return null;
  }

  const entries: L8008ExecutionPlanEntry[] = [];
  const seen = new Set<string>();

  for (const entry of plan) {
    const rawAsset = String((entry as any)?.asset || '').toUpperCase();
    if (!L8_008_ASSETS.includes(rawAsset as typeof L8_008_ASSETS[number])) {
      return null;
    }
    if (seen.has(rawAsset)) {
      return null;
    }

    const notional = toNumber((entry as any)?.notional);
    const feeRate = toNumber((entry as any)?.fee_rate);
    const feeAmount = toNumber((entry as any)?.fee_amount);
    const venueRaw = normalizeL8008Venue((entry as any)?.venue);
    const venue = venueRaw === 'coinbase' ? 'coinbase' : venueRaw === 'interactive_brokers' ? 'interactive_brokers' : venueRaw;

    if (
      notional === null ||
      feeRate === null ||
      feeAmount === null ||
      (venue !== 'interactive_brokers' && venue !== 'coinbase')
    ) {
      return null;
    }

    entries.push({
      asset: rawAsset as typeof L8_008_ASSETS[number],
      notional,
      fee_rate: feeRate,
      fee_amount: feeAmount,
      venue,
    });
    seen.add(rawAsset);
  }

  return entries.length === L8_008_ASSETS.length ? entries : null;
}

function normalizeFieldName(field: string, response: ExecuteOneResponse): string | null {
  if (!response || typeof response !== 'object') return null;
  const keys = Object.keys(response);
  const normalized = field.toLowerCase();

  const directMatch = keys.find(key => key.toLowerCase() === normalized);
  if (directMatch) {
    return directMatch;
  }

  const relaxedMatch = keys.find(key => key.replace(/[_\s]/g, '').toLowerCase() === normalized.replace(/[_\s]/g, ''));
  return relaxedMatch ?? null;
}

function normalizeResponseFields(response: ExecuteOneResponse): ExecuteOneResponse {
  return response;
}

function getPathValue(source: unknown, path: string): unknown {
  if (!source || typeof source !== 'object') return undefined;
  return path.split('.').reduce<unknown>((current, segment) => {
    if (current === null || current === undefined || typeof current !== 'object') return undefined;
    return (current as Record<string, unknown>)[segment];
  }, source);
}

function scoreAgiValidation(value: unknown, spec: any): number {
  if (!spec || typeof spec !== 'object') return 1;

  if (spec.type === 'number') {
    const numeric = toNumber(value);
    if (numeric === null) return 0;
    if (typeof spec.expected === 'number') {
      const tolerance = typeof spec.tolerance === 'number' ? spec.tolerance : 0;
      return Math.abs(numeric - spec.expected) <= tolerance ? 1 : 0;
    }
    if (Array.isArray(spec.range) && spec.range.length === 2) {
      const [min, max] = spec.range.map(Number);
      return numeric >= min && numeric <= max ? 1 : 0;
    }
    return 1;
  }

  if (spec.type === 'boolean') {
    return typeof value === 'boolean' && (spec.expected === undefined || value === spec.expected) ? 1 : 0;
  }

  if (spec.type === 'array') {
    if (!Array.isArray(value)) return 0;
    const normalized = value.map(item => normalizeCategorical(item));
    const expectedSet = Array.isArray(spec.expected_set) ? spec.expected_set.map((item: unknown) => normalizeCategorical(item)) : null;
    if (Array.isArray(spec.expected_order)) {
      const expectedOrder = spec.expected_order.map((item: unknown) => normalizeCategorical(item));
      if (normalized.length !== expectedOrder.length) return 0;
      return expectedOrder.every((item: string, index: number) => normalized[index] === item) ? 1 : 0;
    }
    if (expectedSet) {
      const hits = expectedSet.filter((item: string) => normalized.includes(item)).length;
      const minItems = typeof spec.min_items === 'number' ? spec.min_items : expectedSet.length;
      const exact = spec.match_type === 'exact_set';
      if (exact && normalized.length !== expectedSet.length) return 0;
      return hits >= minItems ? 1 : 0;
    }
    return value.length > 0 ? 1 : 0;
  }

  const expected = spec.expected;
  if (expected === undefined) return fieldPresent(value) ? 1 : 0;
  if (Array.isArray(spec.enum)) {
    const received = normalizeCategorical(value);
    return spec.enum.map((item: unknown) => normalizeCategorical(item)).includes(received) &&
      received === normalizeCategorical(expected) ? 1 : 0;
  }
  return normalizeCategorical(value) === normalizeCategorical(expected) ? 1 : 0;
}

function scoreL10ExpectedValue(value: unknown, rubric: SchemaRubric): number {
  const canonical = (rubric as any)._l10_canonical;
  if (!canonical || typeof canonical !== 'object') return 1;

  const numeric = toNumber(value);
  if (numeric === null) return 0;

  if (Array.isArray(canonical.range) && canonical.range.length === 2) {
    const [min, max] = canonical.range.map(Number);
    if (numeric >= min && numeric <= max) return 1;
  }

  const partialCredit = canonical.grading?.partial_credit || {};
  const closeRange = partialCredit.close_match?.range;
  if (Array.isArray(closeRange) && closeRange.length === 2) {
    const [min, max] = closeRange.map(Number);
    if (numeric >= min && numeric <= max) {
      return typeof partialCredit.close_match.score === 'number' ? partialCredit.close_match.score : 0.7;
    }
  }

  const directionalRange = partialCredit.directionally_correct?.range;
  if (Array.isArray(directionalRange) && directionalRange.length === 2) {
    const [min, max] = directionalRange.map(Number);
    if (numeric >= min && numeric <= max) {
      return typeof partialCredit.directionally_correct.score === 'number' ? partialCredit.directionally_correct.score : 0.4;
    }
  }

  return 0;
}

function removeFailureReason(failureReasons: FailureReason[], reason: FailureReason): void {
  const index = failureReasons.indexOf(reason);
  if (index > -1) {
    failureReasons.splice(index, 1);
  }
}

// ==================== L3-002: Bridge Split Tolerance ====================
function isBridgeSplitTolerated(
  questionId: string,
  receivedSize: number,
  expectedSize: number,
  response: ExecuteOneResponse
): boolean {
  if (questionId !== 'L3-002') return false;

  const tolerance = expectedSize * 0.02;
  const oneThird = expectedSize / 3;
  const twoThirds = (expectedSize * 2) / 3;

  const matchesOneThird = Math.abs(receivedSize - oneThird) <= tolerance;
  const matchesTwoThirds = Math.abs(receivedSize - twoThirds) <= tolerance;

  if (!matchesOneThird && !matchesTwoThirds) return false;

  if (!response.requires_follow_up) return false;

  const followUp = String(response.follow_up_description || '').toLowerCase();
  const hasArbitrum = /arbitrum/i.test(followUp);
  const hasOptimism = /optimism/i.test(followUp);

  return hasArbitrum && hasOptimism;
}

// ==================== L7-003: LP Net Return Analysis ====================
const LP_NET_RETURN_INITIAL_CAPITAL = 10000;
const LP_NET_RETURN_FEES_EARNED = 847;

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const stripped = value.replace(/[%$]/g, '').trim();
    const compact = stripped.replace(/[\s,]/g, '');
    const direct = Number(compact);
    if (Number.isFinite(direct)) {
      return direct;
    }

    // Attempt to evaluate simple arithmetic expressions (e.g., "53.85 - 8.1")
    const arithmeticPattern = /^[0-9+\-*/().\s,]+$/;
    if (arithmeticPattern.test(stripped)) {
      try {
        const safeExpr = stripped.replace(/,/g, '');
        const fn = new Function(`return (${safeExpr})`);
        const result = fn();
        if (typeof result === 'number' && Number.isFinite(result)) {
          return result;
        }
      } catch (error) {
        // Ignore evaluation errors and fall through
      }
    }

    return null;
  }
  return null;
}

function withinTolerance(expected: number, actual: number, tolerance: number): boolean {
  return Math.abs(expected - actual) <= tolerance;
}

const MULTI_PROTOCOL_PENDLE_KEYS = [
  'pendle_pt_steth',
  'pendle_pt',
  'pt_steth',
  'pendle',
  'pendle_allocation',
  'pt_allocation'
];

const MULTI_PROTOCOL_CONVEX_KEYS = [
  'convex_curve_3pool',
  'convex',
  'curve_3pool',
  'curve',
  'convex_curve',
  'convex_allocation',
  'curve_allocation'
];

const ALLOCATION_VALUE_KEYS = [
  'amount_usd',
  'amount',
  'usd',
  'value',
  'notional',
  'capital',
  'allocation',
  'principal',
  'dollars'
];

const ALLOCATION_PERCENT_KEYS = ['percent', 'percentage', 'pct', 'ratio', 'share'];

function extractSimpleNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^0-9.\-]/g, '');
    if (!cleaned) return null;
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function parseAllocationAmount(value: unknown, totalCapital: number): number | null {
  if (value === null || value === undefined) return null;

  if (typeof value === 'number') {
    if (!Number.isFinite(value) || value < 0) return null;
    if (value > 0 && value <= 1 && totalCapital > 0) {
      return value * totalCapital;
    }
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    const numeric = extractSimpleNumber(value);
    if (numeric === null) return null;
    if (normalized.includes('%')) {
      return totalCapital > 0 ? (numeric / 100) * totalCapital : null;
    }
    if (numeric > 0 && numeric <= 1 && totalCapital > 0) {
      return numeric * totalCapital;
    }
    return numeric;
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;

    for (const key of ALLOCATION_PERCENT_KEYS) {
      if (obj[key] !== undefined) {
        const percentValue = extractSimpleNumber(obj[key]);
        if (percentValue === null) continue;
        const ratio = percentValue > 1 ? percentValue / 100 : percentValue;
        if (ratio <= 0 || totalCapital <= 0) continue;
        return ratio * totalCapital;
      }
    }

    for (const key of ALLOCATION_VALUE_KEYS) {
      if (obj[key] !== undefined) {
        const candidate = parseAllocationAmount(obj[key], totalCapital);
        if (candidate !== null) {
          return candidate;
        }
      }
    }
  }

  return null;
}

function resolveAllocationAmount(allocation: unknown, synonyms: string[], totalCapital: number): number | null {
  if (allocation === null || allocation === undefined) {
    return null;
  }

  if (Array.isArray(allocation)) {
    for (const entry of allocation) {
      const candidate = resolveAllocationAmount(entry, synonyms, totalCapital);
      if (candidate !== null) return candidate;
    }
    return null;
  }

  if (typeof allocation !== 'object') {
    return null;
  }

  for (const [rawKey, rawValue] of Object.entries(allocation as Record<string, unknown>)) {
    const normalizedKey = normalizeCategorical(rawKey);
    if (!normalizedKey) continue;
    const matches = synonyms.some(syn => {
      const normalizedSyn = normalizeCategorical(syn);
      return normalizedKey === normalizedSyn || normalizedKey.includes(normalizedSyn);
    });
    if (!matches) continue;

    const amount = parseAllocationAmount(rawValue, totalCapital);
    if (amount !== null) {
      return amount;
    }
  }

  return null;
}

// ==================== L4-001: Portfolio Rebalance ====================
interface RebalanceAnalysis {
  requiresFollowUp: boolean;
  followUpPresent: boolean;
  hasAllAssets: boolean;
  hasAllPercents: boolean;
  assetFieldPresent: boolean;
  orderTypeNormalized: string;
}

const REBALANCE_ASSET_SYNONYMS: Record<string, string[]> = {
  btc: ['btc', 'bitcoin'],
  eth: ['eth', 'ethereum'],
  usdc: ['usdc', 'usd coin', 'usdcoin', 'usd c']
};

const REBALANCE_ALLOWED_ORDER_TYPES = new Set([
  'rebalance',
  'rebalance order',
  'rebalanceorder',
  'portfolio rebalance',
  'portfoliorebalance',
  'rebalance portfolio',
  'rebalanceportfolio',
  'market',
  'market order',
  'marketorder',
  'strategy',
  'plan',
  'execution plan',
  'executionplan',
  'multi leg',
  'multileg',
  'exact amount',
  'exactamount',
  'swap',
  'risk modeling',
  'riskmodeling',
  'risk_modeling'
]);

function analyzePortfolioRebalance(response: ExecuteOneResponse): RebalanceAnalysis {
  const textParts: string[] = [];
  const addText = (value: unknown) => {
    if (value === null || value === undefined) return;
    if (typeof value === 'number') {
      textParts.push(normalizeCategorical(String(value)));
      return;
    }
    if (typeof value === 'string') {
      const normalized = normalizeCategorical(value);
      if (normalized) textParts.push(normalized);
    }
  };

  addText(response.intent);
  addText(response.order_type);
  addText(response.asset);
  if (response.size !== undefined) {
    addText(String(response.size));
  }
  addText(response.follow_up_description);
  addText(response.reasoning);

  const combinedText = textParts.join(' ');
  const followUpText = typeof response.follow_up_description === 'string'
    ? normalizeCategorical(response.follow_up_description)
    : '';

  const assetMentioned = (synonyms: string[]) =>
    synonyms.some(token => new RegExp(`\\b${token}\\b`).test(combinedText));

  const hasAllAssets = Object.values(REBALANCE_ASSET_SYNONYMS).every(tokens => assetMentioned(tokens));

  const triplePattern = /60\s*[/\-]\s*30\s*[/\-]\s*10/;
  const commaPattern = /60\s*,\s*30\s*,\s*10/;

  let has60 = false;
  let has30 = false;
  let has10 = false;

  if (triplePattern.test(combinedText) || commaPattern.test(combinedText)) {
    has60 = has30 = has10 = true;
  } else {
    const checkPercent = (base: number, word: string, decimal: string) => {
      const decimalPattern = decimal.replace('.', '\\.') + '0*';
      const patterns = [
        new RegExp(`\\b${base}\\s*%`, 'i'),
        new RegExp(`\\b${base}\\s+percent`, 'i'),
        new RegExp(`\\b${decimal}\\b`),
        new RegExp(`\\b0\\.${base}\\b`),
        new RegExp(`${base}/${100}`),
      ];
      return patterns.some(p => p.test(combinedText));
    };

    has60 = checkPercent(60, 'sixty', '60');
    has30 = checkPercent(30, 'thirty', '30');
    has10 = checkPercent(10, 'ten', '10');
  }

  const hasAllPercents = has60 && has30 && has10;

  const requiresFollowUp = response.requires_follow_up === true;
  const followUpPresent = !!followUpText && followUpText.length > 10;
  const assetFieldPresent = fieldPresent(response.asset);
  const orderTypeNormalized = normalizeCategorical(String(response.order_type || ''));

  return {
    requiresFollowUp,
    followUpPresent,
    hasAllAssets,
    hasAllPercents,
    assetFieldPresent,
    orderTypeNormalized,
  };
}

// ==================== L4-002: Correlation Analysis ====================
interface CorrelationAnalysis {
  hasAllAssets: boolean;
  intentMatch: boolean;
  orderTypeMatch: boolean;
  assetFieldPresent: boolean;
  sizeFieldPresent: boolean;
  venueMatch: boolean;
}

const CORRELATION_ASSETS = ['btc', 'eth', 'sol', 'matic', 'link'] as const;

const CORRELATION_ALLOWED_INTENTS = new Set([
  'assess',
  'analyze',
  'analyze_correlation',
  'analyze correlation',
  'analyzecorrelation',
  'assess_correlation',
  'assess correlation',
  'assesscorrelation',
  'assess_correlation_risk',
  'assess correlation risk',
  'assesscorrelationrisk',
  'risk_modeling',
  'risk modeling',
  'riskmodeling',
  'risk_analysis',
  'risk analysis',
  'riskanalysis',
  'analysis',
  'correlation_assessment',
  'correlation assessment',
  'correlationassessment'
]);

const CORRELATION_ALLOWED_ORDER_TYPES = new Set([
  'analysis',
  'correlation_analysis',
  'correlation analysis',
  'correlationanalysis',
  'correlation_assessment',
  'correlation assessment',
  'correlationassessment',
  'assess_correlation',
  'assess correlation',
  'assesscorrelation',
  'analyze_correlation',
  'analyze correlation',
  'analyzecorrelation',
  'risk_modeling',
  'risk modeling',
  'riskmodeling',
  'risk_analysis',
  'risk analysis',
  'riskanalysis',
  'strategy',
  'plan'
]);

const CORRELATION_ALLOWED_VENUES = new Set([
  'analysis',
  'risk_analysis',
  'risk analysis',
  'riskanalysis',
  'risk_modeling',
  'risk modeling',
  'riskmodeling',
  'research',
  'research_platform',
  'researchplatform',
  'market_data',
  'market data',
  'marketdata',
  'analytics',
  'onchain',
  'onchain_analytics',
  'onchainanalytics',
  'internal',
  'internal_system',
  'internalsystem',
  'offchain',
  'portfolio_analysis',
  'portfolioanalysis',
  'risk_engine',
  'riskengine'
]);

function analyzeCorrelationAssessment(response: ExecuteOneResponse): CorrelationAnalysis {
  const textParts: string[] = [];
  const addText = (value: unknown) => {
    if (value === null || value === undefined) return;
    if (typeof value === 'number') {
      textParts.push(normalizeCategorical(String(value)));
      return;
    }
    if (typeof value === 'string') {
      const normalized = normalizeCategorical(value);
      if (normalized) textParts.push(normalized);
    }
  };

  addText(response.intent);
  addText(response.order_type);
  addText(response.asset);
  addText(response.venue);
  addText(response.venue_name);
  addText(response.follow_up_description);
  addText(response.reasoning);

  const combinedText = textParts.join(' ');

  const hasAllAssets = CORRELATION_ASSETS.every(asset =>
    new RegExp(`\\b${asset}\\b`).test(combinedText)
  );

  const intentNorm = normalizeCategorical(String(response.intent || ''));
  const orderTypeNorm = normalizeCategorical(String(response.order_type || ''));
  const venueNorm = normalizeCategorical(String(response.venue || ''));

  const BARE_VERBS_REQUIRING_CORRELATION_MENTION = new Set(['assess', 'analyze', 'analyse']);
  const reasoningMentionsCorrelation = /correlation/i.test(String(response.reasoning || ''));
  const intentMatch =
    CORRELATION_ALLOWED_INTENTS.has(intentNorm) &&
    (!BARE_VERBS_REQUIRING_CORRELATION_MENTION.has(intentNorm) || reasoningMentionsCorrelation);
  const orderTypeMatch = CORRELATION_ALLOWED_ORDER_TYPES.has(orderTypeNorm);
  const venueMatch = CORRELATION_ALLOWED_VENUES.has(venueNorm) || venueNorm.includes('analysis');

  const assetFieldPresent = fieldPresent(response.asset);
  const sizeFieldPresent = fieldPresent(response.size);

  return {
    hasAllAssets,
    intentMatch,
    orderTypeMatch,
    assetFieldPresent,
    sizeFieldPresent,
    venueMatch,
  };
}

// ==================== L4-004: Stress Test ====================
interface StressTestAnalysis {
  sizeValid: boolean;
  sizeSoftPass: boolean;
  intentMatch: boolean;
  orderTypeMatch: boolean;
  assetMatch: boolean;
  venueMatch: boolean;
}

const STRESS_TEST_ALLOWED_INTENTS = new Set([
  'stress_test',
  'stresstest',
  'stress testing',
  'stresstesting',
  'risk_modeling',
  'risk modeling',
  'riskmodeling',
  'risk_analysis',
  'risk analysis',
  'riskanalysis'
]);

const STRESS_TEST_ALLOWED_ORDER_TYPES = new Set([
  'simulation',
  'scenario_analysis',
  'scenario analysis',
  'scenarioanalysis',
  'monte_carlo',
  'monte carlo',
  'montecarlo',
  'stress_test',
  'stresstest',
  'stress testing',
  'stresstesting',
  'stress_analysis',
  'stressanalysis',
  'analysis',
  'risk_analysis',
  'riskanalysis',
  'risk modeling',
  'riskmodeling'
]);

const STRESS_TEST_ALLOWED_VENUES = new Set([
  'analysis',
  'risk_analysis',
  'risk analysis',
  'riskanalysis',
  'risk_modeling',
  'risk modeling',
  'riskmodeling',
  'portfolio_analysis',
  'portfolioanalysis',
  'risk_engine',
  'riskengine',
  'local_simulation',
  'localsimulation',
  'local_simulator',
  'localsimulator',
  'simulator',
  'simulation',
  'off_chain',
  'off chain',
  'offchain',
  'internal'
]);

const STRESS_TEST_ALLOWED_ASSETS = new Set([
  'portfolio',
  'crypto_portfolio',
  'cryptoportfolio',
  'all_crypto',
  'all crypto',
  'allcrypto',
  'crypto',
  'multi_asset',
  'multi asset',
  'multiasset',
  'multi_asset_portfolio',
  'multiassetportfolio',
  'portfolio_total',
  'portfoliototal'
]);

function analyzeStressTest(response: ExecuteOneResponse): StressTestAnalysis {
  const intentNorm = normalizeCategorical(String(response.intent || ''));
  const orderTypeNorm = normalizeCategorical(String(response.order_type || ''));
  const venueNorm = normalizeCategorical(String(response.venue || ''));
  const assetNorm = normalizeCategorical(String(response.asset || ''));
  const followUpText = normalizeCategorical(String(response.follow_up_description || ''));

  const sizeValueRaw = response.size;
  let sizeValid = false;
  let sizeSoftPass = false;

  if (typeof sizeValueRaw === 'number') {
    sizeValid = sizeValueRaw === -50;
  } else if (typeof sizeValueRaw === 'string') {
    const norm = normalizeCategorical(sizeValueRaw);
    sizeValid = norm === '-50' || norm === '-50%';
    if (!sizeValid) {
      const portfolioKeywords = ['1', '100', 'full', 'entire', 'whole'];
      const isPortfolioSize = portfolioKeywords.includes(norm);
      const followMentionsCrash = /-50\s*%/.test(followUpText) || /50\s*percent/.test(followUpText) || followUpText.includes('50 crash') || followUpText.includes('-50 crash');
      sizeSoftPass = isPortfolioSize && followMentionsCrash;
    }
  }

  const intentMatch = STRESS_TEST_ALLOWED_INTENTS.has(intentNorm) || intentNorm.includes('stress');
  const orderTypeMatch = STRESS_TEST_ALLOWED_ORDER_TYPES.has(orderTypeNorm) || orderTypeNorm.includes('stress') || orderTypeNorm.includes('analysis');
  const assetMatch = STRESS_TEST_ALLOWED_ASSETS.has(assetNorm);
  const venueMatch = STRESS_TEST_ALLOWED_VENUES.has(venueNorm) || venueNorm.includes('analysis') || venueNorm.includes('simulation') || venueNorm.includes('off');

  return {
    sizeValid,
    sizeSoftPass,
    intentMatch,
    orderTypeMatch,
    assetMatch,
    venueMatch,
  };
}

// ==================== L5-002: Leveraged Long ====================
interface LeverageAnalysis {
  intentMatch: boolean;
  orderTypeValid: boolean;
  orderTypeNeedsFollowUp: boolean;
  followUpDescribesLoop: boolean;
  assetMatch: boolean;
  venueMatch: boolean;
  mentions3x: boolean;
}

const LEVERAGE_ALLOWED_INTENTS = new Set([
  'leverage',
  'leverage long',
  'leveragelong',
  'leverage_long',
  'leveraged_long',
  'leveraged long',
  'leveragedlong',
  'create_leveraged_position',
  'create leveraged position',
  'createleveragedposition',
  'open_position',
  'open position',
  'openposition',
  'leveraged_long_position',
  'leveraged long position',
  'leveragedlongposition',
  'long'
]);

const LEVERAGE_BORROW_ORDER_TYPES = new Set([
  'collateralized_borrow',
  'collateralized borrow',
  'collateralizedborrow',
  'collateralized_loan',
  'collateralized loan',
  'collateralizedloan',
  'recursive_borrow',
  'recursive borrow',
  'recursiveborrow',
  'deposit_collateral',
  'deposit collateral',
  'depositcollateral',
  'supply_collateral',
  'supply collateral',
  'supplycollateral',
  'leveraged_borrow',
  'leveraged borrow',
  'leveragedborrow',
  'borrow',
  'loan'
]);

const LEVERAGE_GENERIC_ORDER_TYPES = new Set([
  'market',
  'market order',
  'marketorder',
  'deposit',
  'open_position',
  'open position',
  'openposition',
  'leveraged_position',
  'leveraged position',
  'leveragedposition',
  'leverage_long',
  'leveragelong'
]);

const LEVERAGE_FORBIDDEN_ORDER_TYPES = new Set([
  'margin',
  'margin_trade',
  'margin trade',
  'margintrade'
]);

function analyzeLeveragedLong(response: ExecuteOneResponse): LeverageAnalysis {
  const intentNorm = normalizeCategorical(String(response.intent || ''));
  const orderTypeNorm = normalizeCategorical(String(response.order_type || ''));
  const assetNorm = normalizeCategorical(String(response.asset || ''));
  const venueNorm = normalizeCategorical(String(response.venue || ''));
  const followUpText = normalizeCategorical(String(response.follow_up_description || ''));

  const intentMatch = LEVERAGE_ALLOWED_INTENTS.has(intentNorm);
  const orderTypeValid = LEVERAGE_BORROW_ORDER_TYPES.has(orderTypeNorm);
  const orderTypeNeedsFollowUp = LEVERAGE_GENERIC_ORDER_TYPES.has(orderTypeNorm);
  const orderTypeForbidden = LEVERAGE_FORBIDDEN_ORDER_TYPES.has(orderTypeNorm);

  const loopIndicators = {
    hasDeposit: /\bdeposit\b|\bsupply\b/.test(followUpText) && /\bcollateral\b/.test(followUpText),
    hasBorrow: /\bborrow\b/.test(followUpText),
    hasSwap: /\bswap\b|\bexchange\b|\bbuy\b/.test(followUpText),
    hasLoop: /\bredeposit\b|\bre deposit\b|\brepeat\b|\bloop\b|\bcycle\b|\biteration\b/.test(followUpText),
    mentions3x: /\b3x\b|\b3\s*x\b|\bthree\s*x\b|\btriple\b|\b3\s*eth\b|\btarget.*3\b/.test(followUpText)
  };

  const stepsMatched = Object.values(loopIndicators).filter(Boolean).length;
  const followUpDescribesLoop = stepsMatched >= 3 && (loopIndicators.hasBorrow || loopIndicators.hasDeposit);

  const mentions3x = /\b3x\b|\b3\s*x\b|\bthree\s*x\b|\btriple\b|\btarget.*3\b/.test(followUpText) ||
                     /\b3\b/.test(normalizeCategorical(String(response.size || ''))) ||
                     (response.risk_controls && 'position_size_limit' in response.risk_controls && response.risk_controls.position_size_limit === 3);

  const assetMatch = assetNorm === 'eth';
  const venueMatch = venueNorm.includes('aave') || venueNorm.includes('lending') || venueNorm === 'defi' || venueNorm.includes('protocol');

  return {
    intentMatch,
    orderTypeValid: orderTypeValid || (orderTypeNeedsFollowUp && followUpDescribesLoop && !orderTypeForbidden),
    orderTypeNeedsFollowUp,
    followUpDescribesLoop,
    assetMatch,
    venueMatch,
    mentions3x,
  };
}

// ==================== L5-001: Concentrated Liquidity ====================
interface ConcentratedLiquidityAnalysis {
  ilHardFail: boolean;
  forbiddenOrderType: boolean;
  rangeScores: Record<string, number>;
}

interface RangeFieldConfig {
  min: number;
  max: number;
  tolerance?: number;
  ballpark_buffer?: number;
  ballpark_partial_credit?: number;
  strict?: boolean;
}

function scoreRangeField(
  value: unknown,
  config: RangeFieldConfig
): number {
  if (typeof value !== 'number') return 0;

  const { min, max, tolerance = 0, ballpark_buffer = 0, ballpark_partial_credit = 0, strict = false } = config;
  const midpoint = (min + max) / 2;
  const range = max - min;
  const toleranceAmount = midpoint * tolerance;

  // Full credit: within min-max ± tolerance
  if (value >= (min - toleranceAmount) && value <= (max + toleranceAmount)) {
    return 1.0;
  }

  // Strict mode: no partial credit outside tolerance
  if (strict) return 0;

  // Ballpark credit: within buffer distance of min/max
  const distanceFromMin = Math.abs(value - min);
  const distanceFromMax = Math.abs(value - max);
  const minDistance = Math.min(distanceFromMin, distanceFromMax);

  if (minDistance <= ballpark_buffer) {
    return ballpark_partial_credit;
  }

  return 0;
}

function analyzeConcentratedLiquidity(
  response: ExecuteOneResponse,
  rubric: SchemaRubric
): ConcentratedLiquidityAnalysis {
  const orderTypeNorm = normalizeCategorical(String(response.order_type || ''));
  const forbiddenOrderTypes = (rubric as any).forbidden_order_types || [];
  const forbiddenOrderType = forbiddenOrderTypes.some((forbidden: string) =>
    normalizeCategorical(forbidden) === orderTypeNorm
  );

  // IL hard constraint check
  const ilValue = typeof response.il_at_stress_pct === 'number' ? response.il_at_stress_pct : null;
  const ilHardFail = ilValue !== null && ilValue > 8.0;

  // Score range fields
  const rangeFields = (rubric as any).range_fields || {};
  const rangeScores: Record<string, number> = {};

  for (const [fieldName, config] of Object.entries(rangeFields)) {
    const value = response[fieldName as keyof ExecuteOneResponse];
    rangeScores[fieldName] = scoreRangeField(value, config as RangeFieldConfig);
  }

  return {
    ilHardFail,
    forbiddenOrderType,
    rangeScores,
  };
}

// ==================== Main Scoring with Custom Adjustments ====================
function computeFieldScores(
  response: ExecuteOneResponse,
  question: SchemaQuestion,
  rubric: SchemaRubric,
  failureReasons: FailureReason[],
  warnings: string[]
): {
  scores: Record<string, number>;
  weightedSum: number;
  weightTotal: number;
  requiredPresent: number;
  fatalFailure: boolean;
} {
  const scores: Record<string, number> = {};
  const synonyms = rubric.synonyms ?? {};

  let weightedSum = 0;
  let weightTotal = 0;
  let requiredPresent = 0;

  for (const field of rubric.expected_fields) {
    const isL10CanonicalExpectedValue = field === 'expected_value' && Boolean((rubric as any)._l10_canonical);
    const weight = rubric.field_weights[field] ?? (isL10CanonicalExpectedValue ? 1 : 0);
    weightTotal += weight;
    const agiValidation = ((rubric as any)._agi_canonical?.validation || {}) as Record<string, any>;

    if (isL10CanonicalExpectedValue) {
      const key = normalizeFieldName(field, response);
      if (!key) {
        if (rubric.required_fields.includes(field)) {
          failureReasons.push('mismatch_fieldname');
        }
        scores[field] = 0;
        continue;
      }

      const value = response[key as keyof ExecuteOneResponse];
      if (!fieldPresent(value)) {
        if (rubric.required_fields.includes(field)) {
          failureReasons.push('missing_field');
        }
        scores[field] = 0;
        continue;
      }

      if (rubric.required_fields.includes(field)) {
        requiredPresent += 1;
      }

      const score = scoreL10ExpectedValue(value, rubric);
      const weightedScore = score * weight;
      scores[field] = weightedScore;
      weightedSum += weightedScore;
      if (score === 0) {
        failureReasons.push('l10_expected_value_out_of_range');
      }
      continue;
    }

    if (field in agiValidation) {
      const value = getPathValue(response, field);
      if (!fieldPresent(value)) {
        if (rubric.required_fields.includes(field)) {
          failureReasons.push('missing_field');
        }
        scores[field] = 0;
        continue;
      }

      if (rubric.required_fields.includes(field)) {
        requiredPresent += 1;
      }

      const score = scoreAgiValidation(value, agiValidation[field]);
      const weightedScore = score * weight;
      scores[field] = weightedScore;
      weightedSum += weightedScore;
      if (score === 0) {
        failureReasons.push(`agi_validation_failed:${field}`);
      }
      continue;
    }

    const key = normalizeFieldName(field, response);

    if (!key) {
      if (rubric.required_fields.includes(field)) {
        failureReasons.push('mismatch_fieldname');
      }
      scores[field] = 0;
      continue;
    }

    const value = response[key as keyof ExecuteOneResponse];
    const expectedValue = question.expected_values[field];

    if (!fieldPresent(value)) {
      if (rubric.required_fields.includes(field)) {
        failureReasons.push('missing_field');
      }
      scores[field] = 0;
      continue;
    }

    if (rubric.required_fields.includes(field)) {
      requiredPresent += 1;
    }

    if (expectedValue === undefined) {
      scores[field] = 1 * weight;
      weightedSum += weight;
      continue;
    }

    // Check if this is a range field (L5-001 concentrated liquidity)
    const rangeFields = (rubric as any).range_fields || {};
    if (field in rangeFields) {
      const rangeConfig = rangeFields[field] as RangeFieldConfig;
      const rangeScore = scoreRangeField(value, rangeConfig);
      const weightedScore = rangeScore * weight;
      scores[field] = weightedScore;
      weightedSum += weightedScore;
      continue;
    }

    // Special handling for size field with numeric expectations
    if (field === 'size' && typeof expectedValue === 'number' && typeof value === 'number') {
      const tolerance = expectedValue * 0.05;
      const matches = Math.abs(value - expectedValue) <= tolerance;

      // L3-002: Bridge split tolerance
      const splitTolerated = isBridgeSplitTolerated(question.id, value, expectedValue, response);

      if (matches || splitTolerated) {
        scores[field] = weight;
        weightedSum += weight;
      } else {
        scores[field] = 0;
        failureReasons.push('size_mismatch');
        return { scores, weightedSum, weightTotal, requiredPresent, fatalFailure: true };
      }
      continue;
    }

    const score = fuzzyScore(expectedValue, value, field, synonyms);
    const weightedScore = score * weight;
    scores[field] = weightedScore;
    weightedSum += weightedScore;
  }

  return { scores, weightedSum, weightTotal, requiredPresent, fatalFailure: false };
}

function applyCustomAdjustments(
  question: SchemaQuestion,
  rubric: SchemaRubric,
  response: ExecuteOneResponse,
  scores: Record<string, number>,
  failureReasons: FailureReason[],
  warnings: string[],
  requiredPresent: number
): {
  scores: Record<string, number>;
  weightedSum: number;
  requiredPresent: number;
  fatalFailure: boolean;
} {
  // L7-001: Flash Loan Arbitrage - Strict Meta-Question Validation
  if (question.id === 'L7-001') {
    const assetNorm = normalizeCategorical(String(response.asset || ''));
    const sizeValue = response.size;
    const intentNorm = normalizeCategorical(String(response.intent || ''));

    // Define acceptable values for meta-question fields
    const ACCEPTABLE_ASSETS = ['multi', 'multiple', 'various', 'flash loan', 'flashloan', 'arbitrage asset', 'arbitrageasset'];
    const ACCEPTABLE_SIZES = ['flash-loan', 'flash loan', 'flashloan', 'variable', 'opportunity', 'analysis', '', 0];
    const ACCEPTABLE_INTENTS = [
      'analyze arbitrage',
      'arbitrage analysis',
      'flash loan arbitrage',
      'flashloan arbitrage',
      'flash loan arbitrage analysis',
      'flashloan arbitrage analysis',
      'analyze flash loan arbitrage',
      'analyze flashloan arbitrage',
      'analyze flash loan',
      'analyze flashloan',
      'flash loan analysis',
      'flashloan analysis'
    ];
    const REJECTED_INTENTS = ['risk modeling', 'riskmodeling', 'analyze', 'check'];

    // Auto-fail: Wrong asset field (concrete assets instead of generic)
    const assetIsWrong = !ACCEPTABLE_ASSETS.some(acceptable => assetNorm.includes(acceptable.toLowerCase()));
    const hasConcreteCryptoAsset = /\b(usdc|eth|dai|btc|weth|matic|sol|arb|link|stablecoin)\b/.test(assetNorm);

    if (assetIsWrong || hasConcreteCryptoAsset) {
      failureReasons.push('l7_001_asset_must_be_multi_or_generic');
      warnings.push('l7_001_meta_question_concrete_asset_autofail');
      warnings.push(`l7_001_received_asset: ${assetNorm}, expected: multi/various/flash-loan`);
      return { scores, weightedSum: 0, requiredPresent, fatalFailure: true };
    }

    // Auto-fail: Wrong size field (numeric amounts instead of generic)
    const sizeNorm = normalizeCategorical(String(sizeValue));
    const sizeIsNumeric = typeof sizeValue === 'number' && sizeValue > 0;
    const sizeIsWrongString = !ACCEPTABLE_SIZES.some(acceptable => {
      if (typeof acceptable === 'number') {
        return sizeValue === acceptable;
      }
      return acceptable === '' ? sizeNorm === '' : sizeNorm.includes(String(acceptable).toLowerCase());
    });

    if (sizeIsNumeric || (sizeIsWrongString && sizeValue !== 0)) {
      failureReasons.push('l7_001_size_must_be_flash_loan_or_generic');
      warnings.push('l7_001_meta_question_numeric_size_autofail');
      warnings.push(`l7_001_received_size: ${sizeValue}, expected: flash-loan/variable/0`);
      return { scores, weightedSum: 0, requiredPresent, fatalFailure: true };
    }

    // Auto-fail: Overly generic or rejected intent
    const intentIsRejected = REJECTED_INTENTS.some(rejected => intentNorm === rejected);
    const intentIsAcceptable = ACCEPTABLE_INTENTS.some(acceptable => intentNorm.includes(acceptable.toLowerCase()));

    if (intentIsRejected || !intentIsAcceptable) {
      failureReasons.push('l7_001_intent_too_generic_or_wrong');
      warnings.push('l7_001_intent_must_show_arbitrage_understanding');
      warnings.push(`l7_001_received_intent: ${intentNorm}`);
      return { scores, weightedSum: 0, requiredPresent, fatalFailure: true };
    }

    // If passed all validation, apply flexible synonym matching for intent/order_type
    warnings.push('l7_001_passed_strict_validation');
    const weightedSum = Object.values(scores).reduce((sum, value) => sum + value, 0);
    return { scores, weightedSum, requiredPresent, fatalFailure: false };
  }

  if (!['L4-001', 'L4-002', 'L4-004', 'L5-001', 'L5-002', 'L5-005', 'L6-001', 'L6-002', 'L6-003', 'L6-004', 'L6-005', 'L7-003', 'L7-004', 'L8-001', 'L8-008'].includes(question.id)) {
    const weightedSum = Object.values(scores).reduce((sum, value) => sum + value, 0);
    return { scores, weightedSum, requiredPresent, fatalFailure: false };
  }

  const weightedSumInitial = Object.values(scores).reduce((sum, value) => sum + value, 0);

  if (question.id === 'L7-003') {
    const ilPercentage = toNumber(response.il_percentage);
    const ilLossUsd = toNumber(response.il_loss_usd);
    const netGainUsd = toNumber(response.net_gain_usd);
    const netReturnPct = toNumber(response.net_return_pct);
    const holdValue = toNumber(response.hold_value);
    const lpValue = toNumber(response.lp_value);
    const sizeValue = toNumber(response.size);

    let fatalFailureLocal = false;

    if (ilLossUsd !== null && netGainUsd !== null) {
      const expectedNetGain = LP_NET_RETURN_FEES_EARNED - ilLossUsd;
      if (!withinTolerance(expectedNetGain, netGainUsd, 70)) {
        failureReasons.push('lp_net_return_inconsistent_net_gain');
        fatalFailureLocal = true;
      }
    }

    if (netGainUsd !== null && netReturnPct !== null) {
      const expectedPct = (netGainUsd / LP_NET_RETURN_INITIAL_CAPITAL) * 100;
      if (!withinTolerance(expectedPct, netReturnPct, 0.35)) {
        failureReasons.push('lp_net_return_inconsistent_return_pct');
        fatalFailureLocal = true;
      }
    }

    if (holdValue !== null && lpValue !== null && ilLossUsd !== null) {
      const expectedIlLoss = holdValue - lpValue;
      if (!withinTolerance(expectedIlLoss, ilLossUsd, 90)) {
        failureReasons.push('lp_net_return_inconsistent_il_loss');
        fatalFailureLocal = true;
      }
    }

    if (sizeValue !== null && !withinTolerance(LP_NET_RETURN_INITIAL_CAPITAL, sizeValue, 150)) {
      failureReasons.push('lp_net_return_size_mismatch');
    }

    if (ilPercentage !== null && ilLossUsd !== null && holdValue !== null) {
      const impliedIlLoss = (ilPercentage / 100) * holdValue;
      if (!withinTolerance(impliedIlLoss, ilLossUsd, 120)) {
        failureReasons.push('lp_net_return_il_pct_mismatch');
      }
    }

    if (fatalFailureLocal) {
      return { scores, weightedSum: weightedSumInitial, requiredPresent, fatalFailure: true };
    }

    return { scores, weightedSum: weightedSumInitial, requiredPresent, fatalFailure: false };
  }

  if (question.id === 'L7-004') {
    const ctx = question.context ?? {};
    const totalCapital = toNumber((ctx as any).total_capital) ?? 0;
    const aavePct = Number((ctx as any).aave_allocation_pct ?? 0);
    const curvePct = Number((ctx as any).curve_allocation_pct ?? 0);
    const yearnPct = Number((ctx as any).yearn_allocation_pct ?? 0);
    const aaveApy = Number((ctx as any).aave_apy ?? 0);
    const curveApy = Number((ctx as any).curve_apy ?? 0);
    const yearnApy = Number((ctx as any).yearn_apy ?? 0);
    const aaveRisk = Number((ctx as any).aave_risk ?? 0);
    const curveRisk = Number((ctx as any).curve_risk ?? 0);
    const yearnRisk = Number((ctx as any).yearn_risk ?? 0);
    const riskFreeRate = Number((ctx as any).risk_free_rate ?? 0);

    const expectedBlendedApy = aavePct * aaveApy + curvePct * curveApy + yearnPct * yearnApy;
    const expectedWeightedRisk = aavePct * aaveRisk + curvePct * curveRisk + yearnPct * yearnRisk;
    const expectedExcessReturn = expectedBlendedApy - riskFreeRate;
    const expectedRiskAdjusted = expectedWeightedRisk > 0 ? expectedExcessReturn / expectedWeightedRisk : null;
    const expectedTotalYieldUsd = totalCapital ? totalCapital * (expectedBlendedApy / 100) : null;
    const expectedAllocations = {
      aave: totalCapital * aavePct,
      curve: totalCapital * curvePct,
      yearn: totalCapital * yearnPct,
    };

    const blendedApy = toNumber(response.blended_apy);
    const weightedRisk = toNumber(response.weighted_risk_score);
    const excessReturn = toNumber(response.excess_return);
    const riskAdjusted = toNumber(response.risk_adjusted_ratio);
    const totalYieldUsd = toNumber(response.total_annual_yield_usd);
    const sizeValue = toNumber(response.size);
    let fatalFailureLocal = false;

    if (blendedApy !== null && expectedBlendedApy !== null) {
      if (!withinTolerance(expectedBlendedApy, blendedApy, 0.06)) {
        failureReasons.push('portfolio_efficiency_inconsistent_blended_apy');
        fatalFailureLocal = true;
      }
    }

    if (weightedRisk !== null && expectedWeightedRisk !== null) {
      if (!withinTolerance(expectedWeightedRisk, weightedRisk, 0.05)) {
        failureReasons.push('portfolio_efficiency_inconsistent_weighted_risk');
        fatalFailureLocal = true;
      }
    }

    if (excessReturn !== null && expectedExcessReturn !== null) {
      if (!withinTolerance(expectedExcessReturn, excessReturn, 0.05)) {
        failureReasons.push('portfolio_efficiency_inconsistent_excess_return');
        fatalFailureLocal = true;
      }
    }

    if (riskAdjusted !== null && expectedRiskAdjusted !== null) {
      if (!withinTolerance(expectedRiskAdjusted, riskAdjusted, 0.05)) {
        failureReasons.push('portfolio_efficiency_inconsistent_risk_ratio');
        fatalFailureLocal = true;
      }
    }

    if (totalYieldUsd !== null && expectedTotalYieldUsd !== null) {
      if (!withinTolerance(expectedTotalYieldUsd, totalYieldUsd, 150)) {
        failureReasons.push('portfolio_efficiency_inconsistent_total_yield');
      }
    }

    if (sizeValue !== null && totalCapital) {
      if (!withinTolerance(totalCapital, sizeValue, 250)) {
        failureReasons.push('portfolio_efficiency_size_mismatch');
      }
    }

    if (fatalFailureLocal) {
      return { scores, weightedSum: weightedSumInitial, requiredPresent, fatalFailure: true };
    }

    return { scores, weightedSum: weightedSumInitial, requiredPresent, fatalFailure: false };
  }

  if (question.id === 'L8-001') {
    const totalCapital = 5_000_000;
    const expectedValueRange = { min: 11.25, max: 12.05 };
    const fatalExpectedBounds = { min: 11.0, max: 12.3 };
    const pendleRange = { min: 3_100_000, max: 3_400_000 };
    const convexRange = { min: 1_600_000, max: 1_900_000 };
    const convexMinimum = 1_750_000;
    const pendleMaximum = 3_500_000;
    const convexAutoFail = 1_500_000;
    const pendleAutoFail = 3_600_000;
    const allocationSumTolerance = 75_000;

    const expectedValueWeight = rubric.field_weights['expected_value'] ?? 0;
    const allocationWeight = rubric.field_weights['allocation'] ?? 0;

    const rawExpectedValue = toNumber((response as any).expected_value);
    let normalizedExpectedValue = rawExpectedValue;
    if (normalizedExpectedValue !== null && Math.abs(normalizedExpectedValue) <= 1) {
      normalizedExpectedValue *= 100;
    }

    if (normalizedExpectedValue !== null && normalizedExpectedValue > 100) {
      const reasoningText = typeof (response as any).reasoning === 'string' ? (response as any).reasoning : '';
      const percentMatches: RegExpMatchArray[] = Array.from(reasoningText.matchAll(/(-?\d+(?:\.\d+)?)\s*%/g));
      let adjustedFromReasoning = false;
      if (percentMatches.length) {
        const percentValues = percentMatches
          .map((match: RegExpMatchArray) => Number(match[1]))
          .filter(value => Number.isFinite(value));
        const inRange = percentValues.filter(value => value >= expectedValueRange.min && value <= expectedValueRange.max);
        if (inRange.length) {
          normalizedExpectedValue = inRange[0];
          adjustedFromReasoning = true;
        } else {
          const reasonable = percentValues.filter(value => value >= 5 && value <= 30);
          const candidates = reasonable.length ? reasonable : percentValues;
          if (candidates.length) {
            const target = (expectedValueRange.min + expectedValueRange.max) / 2;
            normalizedExpectedValue = candidates.reduce((best, current) => {
              return Math.abs(current - target) < Math.abs(best - target) ? current : best;
            }, candidates[0]);
            adjustedFromReasoning = true;
          }
        }
      }
      if (!adjustedFromReasoning && totalCapital > 0 && normalizedExpectedValue >= totalCapital * 0.8 && normalizedExpectedValue <= totalCapital * 1.2) {
        const netGain = normalizedExpectedValue - totalCapital;
        normalizedExpectedValue = (netGain / totalCapital) * (365 / 90) * 100;
      }
    }
    let fatalFailureLocal = false;

    if (expectedValueWeight > 0) {
      scores['expected_value'] = 0;
    }

    if (normalizedExpectedValue === null) {
      failureReasons.push('multi_protocol_missing_expected_value');
      fatalFailureLocal = true;
    } else {
      if (normalizedExpectedValue < fatalExpectedBounds.min || normalizedExpectedValue > fatalExpectedBounds.max) {
        failureReasons.push('multi_protocol_expected_value_out_of_bounds');
        fatalFailureLocal = true;
      }

      if (normalizedExpectedValue < expectedValueRange.min || normalizedExpectedValue > expectedValueRange.max) {
        failureReasons.push('multi_protocol_expected_value_out_of_range');
      } else if (expectedValueWeight > 0) {
        scores['expected_value'] = expectedValueWeight;
      }
    }

    const allocationSource = (response as any).allocation ?? (response as any).allocations ?? null;
    if (allocationWeight > 0) {
      scores['allocation'] = 0;
    }

    const pendleAllocation = resolveAllocationAmount(allocationSource, MULTI_PROTOCOL_PENDLE_KEYS, totalCapital);
    const convexAllocation = resolveAllocationAmount(allocationSource, MULTI_PROTOCOL_CONVEX_KEYS, totalCapital);

    if (pendleAllocation === null || convexAllocation === null) {
      failureReasons.push('multi_protocol_missing_allocation_fields');
      fatalFailureLocal = true;
    } else {
      const totalAllocation = pendleAllocation + convexAllocation;
      const pendleInRange = pendleAllocation >= pendleRange.min && pendleAllocation <= pendleRange.max;
      const convexInRange = convexAllocation >= convexRange.min && convexAllocation <= convexRange.max;
      const sumMismatch = Math.abs(totalAllocation - totalCapital) > allocationSumTolerance;

      if (convexAllocation < convexMinimum) {
        failureReasons.push('multi_protocol_liquidity_constraint');
        fatalFailureLocal = true;
      }

      if (pendleAllocation > pendleMaximum) {
        failureReasons.push('multi_protocol_pendle_cap_violation');
        fatalFailureLocal = true;
      }

      if (convexAllocation < convexAutoFail) {
        failureReasons.push('multi_protocol_convex_auto_fail');
        fatalFailureLocal = true;
      }

      if (pendleAllocation > pendleAutoFail) {
        failureReasons.push('multi_protocol_pendle_auto_fail');
        fatalFailureLocal = true;
      }

      if (sumMismatch) {
        failureReasons.push('multi_protocol_total_allocation_mismatch');
      }

      if (allocationWeight > 0 && !fatalFailureLocal) {
        const allocationSuccess = pendleInRange && convexInRange && !sumMismatch;
        scores['allocation'] = allocationSuccess ? allocationWeight : 0;
      }
    }

    const weightedSum = Object.values(scores).reduce((sum, value) => sum + value, 0);

    if (fatalFailureLocal) {
      return { scores, weightedSum, requiredPresent, fatalFailure: true };
    }

    return { scores, weightedSum, requiredPresent, fatalFailure: false };
  }

  // L8-002: Execute MEV Defense (formerly drafted as L9-002)
  // Trigger this custom grading branch either by question id or rubric id.
  if (question.id === 'L8-002' || rubric.id === 'execute_mev_defense') {
    const strategyWeight = rubric.field_weights['strategy'] ?? 0;
    const costWeight = rubric.field_weights['expected_total_cost'] ?? 0;

    const strategyRaw = (response as any).strategy;
    const strategyText = normalizeCategorical(String(strategyRaw || ''));
    const strategyNormalized = strategyText
      .replace(/^strategy[_\s-]?/, '')
      .replace(/[^ab]/g, '')
      .toUpperCase() || (strategyText ? strategyText.charAt(0).toUpperCase() : '');

    const costBreakdown = (response as any).cost_breakdown;
    const expectedTotalCost = toNumber((response as any).expected_total_cost);
    const reasoningText = typeof (response as any).reasoning === 'string' ? (response as any).reasoning.trim() : '';

    const hasCostBreakdown = costBreakdown && typeof costBreakdown === 'object';
    const gasCost = hasCostBreakdown ? toNumber((costBreakdown as any).gas) : null;
    const feesCost = hasCostBreakdown ? toNumber((costBreakdown as any).fees) : null;
    const mevCost = hasCostBreakdown ? toNumber((costBreakdown as any).expected_mev_loss) : null;

    const ETH_PRICE = 2850;
    const BASE_FEE_GWEI = 150;
    const PRIORITY_FEE_A = 2;
    const GAS_UNITS_A = 320_000;
    const MEV_PROTECTION = 0.985;
    const SANDWICH_LOSS = 22_000;
    const SUCCESS_RATE = 0.96;
    const RETRY_COST = 65;

    const expectedGasUsdA = GAS_UNITS_A * (BASE_FEE_GWEI + PRIORITY_FEE_A) * 1e-9 * ETH_PRICE;
    const expectedMevLossA = (1 - MEV_PROTECTION) * SANDWICH_LOSS;
    const expectedRetryUsd = (1 - SUCCESS_RATE) * RETRY_COST;
    const expectedFeesUsdA = 180 + expectedRetryUsd;

    let strategyScore = 0;
    let costScore = 0;
    let fatalFailureLocal = false;

    if (!strategyNormalized) {
      failureReasons.push('execute_mev_defense_missing_strategy');
      fatalFailureLocal = true;
    } else if (strategyNormalized === 'A') {
      strategyScore = 1;
    } else if (strategyNormalized === 'B') {
      strategyScore = 0;
      failureReasons.push('execute_mev_defense_wrong_strategy');
    } else {
      failureReasons.push('execute_mev_defense_unrecognized_strategy');
      fatalFailureLocal = true;
    }

    if (!hasCostBreakdown || gasCost === null || feesCost === null || mevCost === null) {
      failureReasons.push('execute_mev_defense_cost_breakdown_incomplete');
      fatalFailureLocal = true;
    }

    if (expectedTotalCost === null) {
      failureReasons.push('execute_mev_defense_missing_total_cost');
      fatalFailureLocal = true;
    }

    if (!reasoningText) {
      failureReasons.push('execute_mev_defense_missing_reasoning');
    }

    if (!fatalFailureLocal && strategyNormalized === 'A') {
      const costWithinRange = expectedTotalCost !== null && expectedTotalCost >= 635 && expectedTotalCost <= 670;
      const gasWithinTolerance = gasCost !== null && Math.abs(gasCost - expectedGasUsdA) <= 25;
      const feesWithinTolerance = feesCost !== null && Math.abs(feesCost - expectedFeesUsdA) <= 25;
      const mevWithinTolerance = mevCost !== null && Math.abs(mevCost - expectedMevLossA) <= 45;
      const reasoningMentionsComponents = /gas|fee|mev|retry|protect|flashbots|sandwich/i.test(reasoningText);

      if (!costWithinRange) {
        failureReasons.push('execute_mev_defense_cost_out_of_range');
      }
      if (!gasWithinTolerance) {
        failureReasons.push('execute_mev_defense_gas_miscalculated');
      }
      if (!feesWithinTolerance) {
        failureReasons.push('execute_mev_defense_fee_miscalculated');
      }
      if (!mevWithinTolerance) {
        failureReasons.push('execute_mev_defense_mev_miscalculated');
      }
      if (!reasoningMentionsComponents) {
        failureReasons.push('execute_mev_defense_reasoning_insufficient');
      }

      if (costWithinRange && gasWithinTolerance && feesWithinTolerance && mevWithinTolerance) {
        costScore = 1;
      }
    }

    scores['strategy'] = strategyScore * strategyWeight;
    scores['expected_total_cost'] = costScore * costWeight;

    const requiredFields = rubric.required_fields ?? [];
    requiredPresent = requiredFields.filter(field => {
      switch (field) {
        case 'strategy':
          return !!strategyNormalized;
        case 'expected_total_cost':
          return expectedTotalCost !== null;
        case 'cost_breakdown':
          return hasCostBreakdown && gasCost !== null && feesCost !== null && mevCost !== null;
        case 'reasoning':
          return !!reasoningText;
        case 'intent':
          return fieldPresent(response.intent);
        default:
          return fieldPresent((response as any)[field as keyof ExecuteOneResponse]);
      }
    }).length;

    const weightedSum = Object.values(scores).reduce((sum, value) => sum + value, 0);

    return {
      scores,
      weightedSum,
      requiredPresent,
      fatalFailure: fatalFailureLocal
    };
  }

  // L8-005: Risk-Adjusted Leverage Decision
  if (question.id === 'L8-005' || rubric.id === 'risk_adjusted_leverage') {
    const metadata = (rubric as any).metadata ?? {};
    const actionWeight = rubric.field_weights['action'] ?? 0;
    const probWeight = rubric.field_weights['liquidation_probabilities'] ?? 0;
    const evWeight = rubric.field_weights['expected_values'] ?? 0;
    const reasoningWeight = rubric.field_weights['reasoning'] ?? 0;

    const actionRaw = (response as any).action;
    const actionNameRaw = (response as any).action_name;
    const probs = (response as any).liquidation_probabilities;
    const expectedVals = (response as any).expected_values;
    const calculationMethodRaw = (response as any).calculation_method;
    const reasoningRaw = (response as any).reasoning;

    const reasoningText = typeof reasoningRaw === 'string' ? reasoningRaw.trim() : '';
    const reasoningNorm = normalizeCategorical(reasoningText);
    const methodNorm = normalizeCategorical(String(calculationMethodRaw || ''));

    const actionPartial = (metadata.action_partial_credit || {}) as Record<string, number>;

    const normalizeAction = (value: unknown): string => {
      const raw = normalizeCategorical(String(value || ''));
      if (!raw) return '';
      const firstChar = raw.charAt(0).toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(firstChar)) {
        return firstChar;
      }

      if (/close/.test(raw) || /exit/.test(raw)) return 'D';
      if (/1\.5/.test(raw) || /1_5/.test(raw) || /1x5/.test(raw) || /one\.?5/.test(raw)) return 'C';
      if (/2x/.test(raw) || /two/.test(raw) || /deleverage[_\s-]?2/.test(raw)) return 'B';
      if (/3x/.test(raw) || /maintain/.test(raw) || /keep/.test(raw)) return 'A';
      return '';
    };

    const actionNormalized = normalizeAction(actionRaw);
    if (!actionNormalized) {
      failureReasons.push('risk_adjusted_leverage_missing_action');
    }

    let actionScore = 0;
    if (actionNormalized === 'B') {
      actionScore = 1;
    } else if (actionNormalized && actionPartial[actionNormalized] !== undefined) {
      actionScore = actionPartial[actionNormalized];
      failureReasons.push('risk_adjusted_leverage_suboptimal_action');
    } else if (actionNormalized) {
      failureReasons.push('risk_adjusted_leverage_wrong_action');
    }

    const normalizeProbability = (value: unknown): number | null => {
      const num = toNumber(value);
      if (num === null) return null;
      if (num > 0.2) {
        return num / 100;
      }
      return num;
    };

    const probabilityRanges = (metadata.probability_ranges || {}) as Record<string, any>;

    const determineMethod = (): 'barrier' | 'endpoint' | 'unspecified' => {
      if (methodNorm.includes('endpoint')) return 'endpoint';
      if (methodNorm.includes('barrier')) return 'barrier';
      if (/endpoint/.test(reasoningText.toLowerCase())) return 'endpoint';
      if (/barrier/.test(reasoningText.toLowerCase()) || /continuous/.test(reasoningText.toLowerCase())) return 'barrier';
      return 'unspecified';
    };

    const methodUsed = determineMethod();

    const scoreProbability = (key: string): { score: number; present: boolean } => {
      const ranges = probabilityRanges[key];
      if (!ranges) {
        return { score: 0, present: false };
      }
      const rawValue = probs && typeof probs === 'object' ? (probs as any)[key] : undefined;
      const value = normalizeProbability(rawValue);
      if (value === null) {
        return { score: 0, present: false };
      }

      const barrier = ranges.barrier;
      const endpoint = ranges.endpoint;
      const withinRange = (rng: any) => value >= rng.min && value <= rng.max;

      if (withinRange(barrier)) {
        return { score: 1, present: true };
      }
      if (withinRange(endpoint)) {
        if (methodUsed === 'endpoint') {
          return { score: 0.85, present: true };
        }
        failureReasons.push('risk_adjusted_leverage_endpoint_unflagged');
        return { score: 0.4, present: true };
      }

      failureReasons.push(('risk_adjusted_leverage_probability_out_of_range_' + key) as FailureReason);
      return { score: 0, present: true };
    };

    const probabilityWeights = {
      maintain_3x: 0.5,
      deleverage_2x: 0.4,
      deleverage_1_5x: 0.1
    } as const;

    const probScores: Record<string, { score: number; present: boolean }> = {
      maintain_3x: scoreProbability('maintain_3x'),
      deleverage_2x: scoreProbability('deleverage_2x'),
      deleverage_1_5x: scoreProbability('deleverage_1_5x')
    };

    const probabilityScore =
      probScores.maintain_3x.score * probabilityWeights.maintain_3x +
      probScores.deleverage_2x.score * probabilityWeights.deleverage_2x +
      probScores.deleverage_1_5x.score * probabilityWeights.deleverage_1_5x;

    const normalizeExpectedValue = (value: unknown): number | null => {
      const num = toNumber(value);
      if (num === null) return null;
      return num;
    };

    const evRanges = (metadata.expected_value_ranges || {}) as Record<string, any>;

    const scoreExpectedValue = (key: string): { score: number; present: boolean } => {
      const ranges = evRanges[key];
      if (!ranges) {
        return { score: 0, present: false };
      }
      const rawValue = expectedVals && typeof expectedVals === 'object' ? (expectedVals as any)[key] : undefined;
      const value = normalizeExpectedValue(rawValue);
      if (value === null) {
        return { score: 0, present: false };
      }

      if (value >= ranges.min && value <= ranges.max) {
        return { score: 1, present: true };
      }

      failureReasons.push(('risk_adjusted_leverage_expected_value_out_of_range_' + key) as FailureReason);
      return { score: 0, present: true };
    };

    const expectedValueWeights = {
      maintain_3x: 0.4,
      deleverage_2x: 0.4,
      deleverage_1_5x: 0.15,
      close: 0.05
    } as const;

    const evScores: Record<string, { score: number; present: boolean }> = {
      maintain_3x: scoreExpectedValue('maintain_3x'),
      deleverage_2x: scoreExpectedValue('deleverage_2x'),
      deleverage_1_5x: scoreExpectedValue('deleverage_1_5x'),
      close: scoreExpectedValue('close')
    };

    const expectedValueScore =
      evScores.maintain_3x.score * expectedValueWeights.maintain_3x +
      evScores.deleverage_2x.score * expectedValueWeights.deleverage_2x +
      evScores.deleverage_1_5x.score * expectedValueWeights.deleverage_1_5x +
      evScores.close.score * expectedValueWeights.close;

    const reasoningKeywords = [/risk/, /volatil/, /liquidat/, /ev/, /expected/, /sacrif/, /trade[-\s]?off/, /threshold/, /institution/];
    const keywordHits = reasoningKeywords.filter(rx => rx.test(reasoningNorm)).length;

    let reasoningScore = 0;
    if (!reasoningText) {
      failureReasons.push('risk_adjusted_leverage_missing_reasoning');
    } else if (keywordHits >= 5) {
      reasoningScore = 1;
    } else if (keywordHits >= 3) {
      reasoningScore = 0.7;
    } else if (keywordHits >= 2) {
      reasoningScore = 0.4;
    } else {
      reasoningScore = 0.2;
      failureReasons.push('risk_adjusted_leverage_reasoning_weak');
    }

    scores['action'] = actionScore * actionWeight;
    scores['liquidation_probabilities'] = probabilityScore * probWeight;
    scores['expected_values'] = expectedValueScore * evWeight;
    scores['reasoning'] = reasoningScore * reasoningWeight;

    const hasProbObject = probs && typeof probs === 'object';
    const hasExpectedObject = expectedVals && typeof expectedVals === 'object';

    if (!hasProbObject) {
      failureReasons.push('risk_adjusted_leverage_missing_probabilities');
    }
    if (!hasExpectedObject) {
      failureReasons.push('risk_adjusted_leverage_missing_expected_values');
    }

    const requiredFields = rubric.required_fields ?? [];
    requiredPresent = requiredFields.filter(field => {
      switch (field) {
        case 'action':
          return !!actionNormalized;
        case 'liquidation_probabilities':
          return hasProbObject && probScores.maintain_3x.present && probScores.deleverage_2x.present;
        case 'expected_values':
          return hasExpectedObject && evScores.maintain_3x.present && evScores.deleverage_2x.present;
        case 'reasoning':
          return !!reasoningText;
        default:
          return fieldPresent((response as any)[field as keyof ExecuteOneResponse]);
      }
    }).length;

    const weightedSum = Object.values(scores).reduce((sum, value) => sum + value, 0);

    let fatalFailureLocal = false;
    if (!actionNormalized) {
      fatalFailureLocal = true;
    }
    if (!hasProbObject || !probScores.maintain_3x.present || !probScores.deleverage_2x.present) {
      fatalFailureLocal = true;
    }
    if (!hasExpectedObject || !evScores.maintain_3x.present || !evScores.deleverage_2x.present) {
      fatalFailureLocal = true;
    }

    return {
      scores,
      weightedSum,
      requiredPresent,
      fatalFailure: fatalFailureLocal
    };
  }

  // L8-006: Fixed Yield Allocation vs Leverage Trade-offs
  if (question.id === 'L8-006' || rubric.id === 'fixed_yield_allocation') {
    const strategyWeight = rubric.field_weights['selected_strategy'] ?? 0;
    const apyWeight = rubric.field_weights['expected_apy'] ?? 0;
    const allocationWeight = rubric.field_weights['allocation'] ?? 0;
    const reasoningWeight = rubric.field_weights['reasoning'] ?? 0;
    const riskWeight = rubric.field_weights['risk_assessment'] ?? 0;
    const constraintsWeight = rubric.field_weights['meets_constraints'] ?? 0;

    const selectedRaw = (response as any).selected_strategy;
    const selectedText = normalizeCategorical(String(selectedRaw || ''));
    const strategyTypeRaw = (response as any).strategy;
    const strategyType = normalizeCategorical(String(strategyTypeRaw || ''));

    let expectedApy = toNumber((response as any).expected_apy);
    if (expectedApy !== null && expectedApy > 0 && expectedApy <= 1.5) {
      expectedApy *= 100;
    }
    const allocationValue = toNumber((response as any).allocation);
    const riskAssessment = normalizeCategorical(String((response as any).risk_assessment || ''));
    const meetsConstraints = Boolean((response as any).meets_constraints);
    const reasoningText = typeof (response as any).reasoning === 'string' ? (response as any).reasoning.trim() : '';
    const reasoningNorm = normalizeCategorical(reasoningText);

    const strategiesArray = Array.isArray((response as any).strategies) ? (response as any).strategies : [];
    const ptAllocations = strategiesArray
      .filter((entry: any) => {
        const venue = normalizeCategorical(String(entry?.venue || ''));
        const asset = normalizeCategorical(String(entry?.asset || ''));
        return venue.includes('pendle') || asset.includes('pt');
      })
      .map((entry: any) => toNumber(entry?.allocation) ?? 0);
    const ptAllocationSum = ptAllocations.reduce((sum: number, value: number) => sum + value, 0);

    let strategyCategory: 'C' | 'D_TILTED' | 'D_BALANCED' | 'A' | 'B' | 'UNKNOWN' = 'UNKNOWN';
    if (selectedText.startsWith('c')) {
      strategyCategory = 'C';
    } else if (selectedText.startsWith('d')) {
      if (selectedText.includes('tilt') || selectedText.includes('tilted')) {
        strategyCategory = 'D_TILTED';
      } else {
        strategyCategory = 'D_BALANCED';
      }
    } else if (selectedText.startsWith('b')) {
      strategyCategory = 'B';
    } else if (selectedText.startsWith('a')) {
      strategyCategory = 'A';
    }

    let strategyScore = 0;
    let fatalFailureLocal = false;

    if (strategyCategory === 'C') {
      strategyScore = 1;
    } else if (strategyCategory === 'D_TILTED') {
      const meetsPtThreshold = ptAllocationSum >= 80000 || (allocationValue !== null && allocationValue >= 80000);
      const mentionsDiversification = /divers/i.test(reasoningText);
      if (meetsPtThreshold && mentionsDiversification) {
        strategyScore = 0.85; // 34/40 points
      } else {
        strategyScore = 0.4; // penalize missing diversification justification or allocation detail
        failureReasons.push('fixed_yield_allocation_d_tilted_incomplete');
      }
    } else if (strategyCategory === 'D_BALANCED') {
      strategyScore = 0.375; // 15/40 points ceiling
    } else if (strategyCategory === 'B') {
      strategyScore = 0;
      failureReasons.push('fixed_yield_allocation_strategy_b_disallowed');
      fatalFailureLocal = true;
    } else if (strategyCategory === 'A') {
      strategyScore = 0;
      failureReasons.push('fixed_yield_allocation_strategy_a_suboptimal');
    } else {
      failureReasons.push('fixed_yield_allocation_missing_strategy');
      fatalFailureLocal = true;
    }

    // Expected APY scoring with adaptive targets
    const apyRanges: Record<string, { min: number; max: number; target: number }> = {
      C: { min: 12.2, max: 12.4, target: 12.3 },
      D_TILTED: { min: 11.8, max: 12.0, target: 11.9 },
      D_BALANCED: { min: 11.15, max: 11.35, target: 11.25 }
    };

    let apyScore = 0;
    if (expectedApy === null) {
      failureReasons.push('fixed_yield_allocation_missing_expected_apy');
      fatalFailureLocal = true;
    } else {
      const key = strategyCategory in apyRanges ? strategyCategory : 'C';
      const range = apyRanges[key];
      const withinPrimary = expectedApy >= range.min && expectedApy <= range.max;
      if (withinPrimary) {
        apyScore = strategyCategory === 'D_TILTED' ? 0.85 : strategyCategory === 'D_BALANCED' ? 0.6 : 1;
      } else {
        const diff = Math.abs(expectedApy - range.target);
        if (diff <= 0.2) {
          apyScore = 0.6;
        } else if (diff <= 0.4) {
          apyScore = 0.3;
          failureReasons.push('fixed_yield_allocation_expected_apy_off_target');
        } else {
          apyScore = 0;
          failureReasons.push('fixed_yield_allocation_expected_apy_incorrect');
        }
      }
    }

    // Allocation scoring (primary expects near full capital; D-tilted accepts >=80k PT)
    let allocationScore = 0;
    if (allocationValue === null) {
      failureReasons.push('fixed_yield_allocation_missing_allocation');
      fatalFailureLocal = true;
    } else {
      if (strategyCategory === 'C') {
        allocationScore = allocationValue >= 99000 && allocationValue <= 100000 ? 1 : 0;
        if (!allocationScore) failureReasons.push('fixed_yield_allocation_allocation_mismatch');
      } else if (strategyCategory === 'D_TILTED') {
        allocationScore = allocationValue >= 80000 ? 0.85 : 0.4;
      } else if (strategyCategory === 'D_BALANCED') {
        allocationScore = allocationValue >= 50000 ? 0.3 : 0;
      } else {
        allocationScore = 0;
      }
    }

    // Reasoning quality (APY, risk rejection, horizon alignment)
    const mentionsMaxApy = /maxim|highest|12\.3|best yield/.test(reasoningText.toLowerCase());
    const mentionsRisk = /3x|leverage|liquidation|depeg/.test(reasoningText.toLowerCase());
    const mentionsHorizon = /90|maturity|fixed term|lock/.test(reasoningText.toLowerCase());
    const reasoningHits = [mentionsMaxApy, mentionsRisk, mentionsHorizon].filter(Boolean).length;
    let reasoningScore = 0;
    if (!reasoningText) {
      failureReasons.push('fixed_yield_allocation_missing_reasoning');
    } else {
      reasoningScore = reasoningHits >= 3 ? 1 : reasoningHits === 2 ? 0.7 : reasoningHits === 1 ? 0.4 : 0.2;
    }

    // Risk assessment scoring
    let riskScore = 0;
    if (!riskAssessment) {
      failureReasons.push('fixed_yield_allocation_missing_risk_assessment');
    } else {
      if (strategyCategory === 'C') {
        riskScore = riskAssessment.includes('low') ? 1 : riskAssessment.includes('medium') ? 0.4 : 0;
      } else if (strategyCategory.startsWith('D')) {
        riskScore = riskAssessment.includes('medium') || riskAssessment.includes('low') ? 1 : 0.5;
      } else {
        riskScore = 0.2;
      }
    }

    // Constraints compliance
    let constraintsScore = 0;
    if (!meetsConstraints) {
      failureReasons.push('fixed_yield_allocation_constraints_not_met');
      fatalFailureLocal = true;
    } else {
      const leverageValue = toNumber((response as any).leverage);
      const leverageOk = leverageValue === null || leverageValue <= 3;
      const liquidationRisk = (response as any).liquidation_risk === true;
      const leverageMentioned = strategyCategory === 'C' ? true : (strategyType.includes('loop') ? leverageValue !== null : true);

      if (!leverageOk || strategyCategory === 'B') {
        failureReasons.push('fixed_yield_allocation_leverage_violation');
        fatalFailureLocal = true;
      } else if (liquidationRisk && strategyCategory === 'C') {
        failureReasons.push('fixed_yield_allocation_unexpected_liquidation_risk');
        constraintsScore = 0.4;
      } else if (!leverageMentioned && strategyCategory !== 'C') {
        constraintsScore = 0.6;
      } else {
        constraintsScore = 1;
      }
    }

    scores['selected_strategy'] = strategyScore * strategyWeight;
    scores['expected_apy'] = apyScore * apyWeight;
    scores['allocation'] = allocationScore * allocationWeight;
    scores['reasoning'] = reasoningScore * reasoningWeight;
    scores['risk_assessment'] = riskScore * riskWeight;
    scores['meets_constraints'] = constraintsScore * constraintsWeight;

    const requiredFields = rubric.required_fields ?? [];
    requiredPresent = requiredFields.filter(field => {
      switch (field) {
        case 'selected_strategy':
          return !!selectedText;
        case 'expected_apy':
          return expectedApy !== null;
        case 'allocation':
          return allocationValue !== null;
        case 'reasoning':
          return !!reasoningText;
        case 'risk_assessment':
          return !!riskAssessment;
        case 'meets_constraints':
          return meetsConstraints;
        default:
          return fieldPresent((response as any)[field as keyof ExecuteOneResponse]);
      }
    }).length;

    const weightedSum = Object.values(scores).reduce((sum, value) => sum + value, 0);

    if (fatalFailureLocal) {
      return {
        scores,
        weightedSum,
        requiredPresent,
        fatalFailure: true
      };
    }

    return {
      scores,
      weightedSum,
      requiredPresent,
      fatalFailure: false
    };
  }

  if (question.id === 'L8-010' || rubric.id === 'collar_min_cost') {
    const normalizedResponse = response as ExecuteOneResponse & Record<string, unknown>;
    const weights = rubric.field_weights ?? {};
    const getWeight = (field: string): number => weights[field] ?? 0;
    const normalizedAny = normalizedResponse as Record<string, unknown>;

    const fieldScores: Record<string, number> = {};
    let fatalFailureLocal = false;

    const acceptedIntents = ['collar', 'protective collar', 'collar strategy', 'options collar'];
    const intentNorm = normalizeCategorical(normalizedResponse.intent);
    const hasIntent = acceptedIntents.some(keyword => intentNorm === normalizeCategorical(keyword));
    if (!hasIntent) {
      failureReasons.push('l8_010_wrong_intent');
    }
    fieldScores['intent'] = hasIntent ? getWeight('intent') : 0;

    const orderTypeNorm = normalizeCategorical(normalizedResponse.order_type);
    const hasOrderType = ['options', 'options strategy', 'derivatives', 'structured options'].some(keyword =>
      orderTypeNorm === normalizeCategorical(keyword)
    );
    if (!hasOrderType) {
      failureReasons.push('l8_010_wrong_order_type');
    }
    fieldScores['order_type'] = hasOrderType ? getWeight('order_type') : 0;

    const assetNorm = normalizeCategorical(normalizedResponse.asset);
    const hasAsset = ['btc', 'btcusd', 'btc-usd', 'spot btc'].some(keyword => assetNorm === normalizeCategorical(keyword));
    if (!hasAsset) {
      failureReasons.push('l8_010_wrong_asset');
    }
    fieldScores['asset'] = hasAsset ? getWeight('asset') : 0;

    const sizeValue = toNumber(normalizedResponse.size);
    let sizeScore = 0;
    if (sizeValue === null) {
      failureReasons.push('l8_010_missing_size');
    } else if (Math.abs(sizeValue - 10) <= 1e-6) {
      sizeScore = getWeight('size');
    } else {
      failureReasons.push('l8_010_wrong_size');
    }
    fieldScores['size'] = sizeScore;

    const callStrike = toNumber(normalizedAny['call_strike']);
    if (callStrike === null) {
      failureReasons.push('l8_010_missing_call_strike');
      fatalFailureLocal = true;
    } else if (Math.abs(callStrike - 49500) > 1e-6) {
      failureReasons.push('l8_010_wrong_call_strike');
      fatalFailureLocal = true;
    }
    fieldScores['call_strike'] = callStrike !== null && Math.abs(callStrike - 49500) <= 1e-6 ? getWeight('call_strike') : 0;

    const putStrike = toNumber(normalizedAny['put_strike']);
    if (putStrike === null) {
      failureReasons.push('l8_010_missing_put_strike');
      fatalFailureLocal = true;
    } else if (Math.abs(putStrike - 40500) > 1e-6) {
      failureReasons.push('l8_010_wrong_put_strike');
      fatalFailureLocal = true;
    }
    fieldScores['put_strike'] = putStrike !== null && Math.abs(putStrike - 40500) <= 1e-6 ? getWeight('put_strike') : 0;

    const netCost = toNumber(normalizedAny['net_cost_per_btc']);
    let netCostScore = 0;
    if (netCost === null) {
      failureReasons.push('l8_010_missing_net_cost');
    } else if (netCost > 0) {
      failureReasons.push('l8_010_net_cost_positive');
      fatalFailureLocal = true;
    } else if (netCost < -100) {
      failureReasons.push('l8_010_net_cost_excessive');
      fatalFailureLocal = true;
    } else if (netCost >= -80 && netCost <= -40) {
      netCostScore = getWeight('net_cost_per_btc');
    } else {
      failureReasons.push('l8_010_net_cost_out_of_range');
    }
    fieldScores['net_cost_per_btc'] = netCostScore;

    const venueNorm = normalizeCategorical(normalizedResponse.venue);
    const hasVenue = ['options_exchange', 'derivatives_exchange', 'options', 'derivatives'].some(
      keyword => venueNorm === normalizeCategorical(keyword)
    );
    if (!hasVenue) {
      failureReasons.push('l8_010_wrong_venue');
    }
    fieldScores['venue'] = hasVenue ? getWeight('venue') : 0;

    const venueNameNorm = normalizeCategorical(normalizedResponse.venue_name);
    const hasVenueName = ['deribit'].some(keyword => venueNameNorm === normalizeCategorical(keyword));
    if (!hasVenueName) {
      failureReasons.push('l8_010_wrong_venue_name');
    }
    fieldScores['venue_name'] = hasVenueName ? getWeight('venue_name') : 0;

    const expiryDays = toNumber(normalizedAny['expiry_days']);
    let expiryScore = 0;
    if (expiryDays === null) {
      failureReasons.push('l8_010_missing_expiry');
    } else if (Math.abs(expiryDays - 30) > 1e-6) {
      failureReasons.push('l8_010_wrong_expiry');
    } else {
      expiryScore = getWeight('expiry_days');
    }
    fieldScores['expiry_days'] = expiryScore;

    const requiredFields = rubric.required_fields ?? [];
    requiredPresent = requiredFields.filter(field => fieldPresent(normalizedAny[field])).length;

    const weightedSumLocal = Object.entries(fieldScores).reduce((sum, [field, fieldScore]) => {
      // fieldScore already includes weight because we multiplied above?
      // Wait: we stored weight if correct else 0. So just sum.
      return sum + fieldScore;
    }, 0);

    return {
      scores: fieldScores,
      weightedSum: weightedSumLocal,
      requiredPresent,
      fatalFailure: fatalFailureLocal
    };
  }

  // L8-009: Cash-and-Carry Arbitrage Decision
  if (question.id === 'L8-009' || rubric.id === 'cash_and_carry_arbitrage') {
    const decisionWeight = rubric.field_weights['decision'] ?? 0;
    const reasoningWeight = rubric.field_weights['reasoning'] ?? 0;
    const executionWeight = rubric.field_weights['execution'] ?? 0;

    const decisionRaw = normalizeCategorical((response as any).decision ?? '');
    const reasoningObj = (response as any).reasoning && typeof (response as any).reasoning === 'object' ? (response as any).reasoning : null;
    const executionObj = (response as any).execution && typeof (response as any).execution === 'object' ? (response as any).execution : null;

    // ----- Decision -----
    const decisionScore = decisionRaw === 'execute' ? 1 : 0;
    if (!decisionRaw) {
      failureReasons.push('cash_and_carry_missing_decision');
    } else if (decisionRaw !== 'execute') {
      failureReasons.push('cash_and_carry_wrong_decision');
    }
    scores['decision'] = decisionScore * decisionWeight;

    // Prepare reasoning metrics
    let capitalScore = 0;
    let fundingScore = 0;
    let roiScore = 0;
    let reasoningFatal = false;

    const capital = reasoningObj && typeof reasoningObj.capital_allocation === 'object' ? reasoningObj.capital_allocation : null;
    const spotUsd = capital ? toNumber(capital.spot_usd) : null;
    const marginUsd = capital ? toNumber(capital.margin_usd) : null;
    const positionEth = reasoningObj ? toNumber((reasoningObj as any).position_size_eth) : null;
    const perpNotional = reasoningObj ? toNumber((reasoningObj as any).perp_notional_usd) : null;
    const fundingDaily = reasoningObj ? toNumber((reasoningObj as any).funding_revenue_daily) : null;
    const costsEntry = reasoningObj ? toNumber((reasoningObj as any).costs_entry) : null;
    const breakEvenPeriods = reasoningObj ? toNumber((reasoningObj as any).break_even_periods) : null;
    const annualFundingPct = reasoningObj ? toNumber((reasoningObj as any).annualized_funding_rate_pct) : null;
    const annualRoiPct = reasoningObj ? toNumber((reasoningObj as any).annual_roi_on_total_capital_pct) : null;

    if (spotUsd === null || marginUsd === null) {
      failureReasons.push('cash_and_carry_missing_capital_split');
      reasoningFatal = true;
    } else {
      const total = spotUsd + marginUsd;
      if (Math.abs(total - 100000) > 1e-2) {
        failureReasons.push('cash_and_carry_capital_not_100k');
      }

      let marginSufficient = true;
      if (marginUsd !== null && perpNotional !== null && marginUsd + 1 < perpNotional) {
        marginSufficient = false;
        failureReasons.push('cash_and_carry_margin_insufficient');
      }

      if (spotUsd === 50000 && marginUsd === 50000 && marginSufficient) {
        capitalScore = 1;
      } else if (marginSufficient && spotUsd >= 40000 && marginUsd >= 40000 && Math.abs(total - 100000) <= 1) {
        capitalScore = 0.83; // 25/30
      } else if (marginSufficient && spotUsd > 0 && marginUsd > 0) {
        capitalScore = 0.5;
      } else {
        capitalScore = 0;
      }
    }

    if (positionEth !== null) {
      const target = 20.41;
      const maxDiff = target * 0.10;
      if (Math.abs(positionEth - target) > maxDiff) {
        failureReasons.push('cash_and_carry_position_out_of_bounds');
      }
    } else {
      failureReasons.push('cash_and_carry_missing_position');
    }

    if (perpNotional !== null && positionEth !== null) {
      const impliedNotional = positionEth * 2458;
      if (Math.abs(perpNotional - impliedNotional) > 5000) {
        failureReasons.push('cash_and_carry_notional_mismatch');
      }
    }

    if (fundingDaily === null) {
      failureReasons.push('cash_and_carry_missing_funding');
    } else if (fundingDaily >= 115 && fundingDaily <= 125) {
      fundingScore = 1;
    } else if (fundingDaily >= 95 && fundingDaily <= 145) {
      fundingScore = 0.75;
    } else if (fundingDaily > 0) {
      fundingScore = 0.5;
    } else {
      fundingScore = 0;
    }

    if (costsEntry !== null && (costsEntry < 15 || costsEntry > 35)) {
      failureReasons.push('cash_and_carry_entry_costs_out_of_range');
    }

    if (breakEvenPeriods !== null && breakEvenPeriods > 2) {
      failureReasons.push('cash_and_carry_break_even_too_long');
    }

    const hasFundingPct = annualFundingPct !== null;
    const hasRoiPct = annualRoiPct !== null;
    if (hasFundingPct && (annualFundingPct < 80 || annualFundingPct > 95)) {
      failureReasons.push('cash_and_carry_funding_rate_out_of_range');
    }

    if (hasRoiPct && (annualRoiPct < 38 || annualRoiPct > 50)) {
      failureReasons.push('cash_and_carry_roi_out_of_range');
    }

    const fundingWithinRange = hasFundingPct && annualFundingPct !== null && annualFundingPct >= 80 && annualFundingPct <= 95;
    const roiWithinRange = hasRoiPct && annualRoiPct !== null && annualRoiPct >= 38 && annualRoiPct <= 50;

    if (fundingWithinRange && roiWithinRange) {
      roiScore = 1;
    } else if (roiWithinRange) {
      roiScore = 0.8;
    } else if (fundingWithinRange) {
      roiScore = 0.6;
    } else if ((hasRoiPct && annualRoiPct !== null && annualRoiPct > 0) || (hasFundingPct && annualFundingPct !== null && annualFundingPct > 0)) {
      roiScore = 0.4;
    } else {
      roiScore = 0;
    }

    if (!reasoningObj) {
      failureReasons.push('cash_and_carry_missing_reasoning');
      reasoningFatal = true;
    }

    const reasoningScore = reasoningFatal
      ? 0
      : ((capitalScore * 30) + (fundingScore * 20) + (roiScore * 15)) / (30 + 20 + 15);
    scores['reasoning'] = reasoningScore * reasoningWeight;

    // ----- Execution -----
    let executionScore = 0;
    if (!executionObj) {
      failureReasons.push('cash_and_carry_missing_execution');
    } else {
      const step1 = String(executionObj.step_1 || '').toLowerCase();
      const step2 = String(executionObj.step_2 || '').toLowerCase();
      const step3 = String(executionObj.step_3 || '').toLowerCase();
      const deltaNeutral = executionObj.delta_neutral === true || /neutral|hedged|balanced/i.test(String(executionObj.delta_neutral || ''));

      const containsMarginTransfer = step1.includes('transfer') && step1.includes('usdt') && (step1.includes('margin') || step1.includes('binance'));
      const containsSpotBuy = (step2.includes('buy') && step2.includes('spot') && step2.includes('eth')) || (step3.includes('buy') && step3.includes('spot') && step3.includes('eth'));
      const containsPerpShort = (step2.includes('short') && step2.includes('perp')) || (step3.includes('short') && step3.includes('perp'));
      const stepsProvided = [step1, step2, step3].filter(Boolean).length >= 3;

      if (containsMarginTransfer && containsSpotBuy && containsPerpShort) {
        executionScore = 1;
      } else if (stepsProvided) {
        executionScore = 0.6;
        failureReasons.push('cash_and_carry_execution_missing_detail');
      } else {
        executionScore = 0;
        failureReasons.push('cash_and_carry_execution_incomplete');
      }

      if (!deltaNeutral) {
        failureReasons.push('cash_and_carry_missing_delta_neutral');
        executionScore = Math.min(executionScore, 0.6);
      }
    }
    scores['execution'] = executionScore * executionWeight;

    const requiredFields = rubric.required_fields ?? [];
    requiredPresent = requiredFields.filter(field => fieldPresent((response as any)[field as keyof ExecuteOneResponse])).length;

    const weightedSum = Object.values(scores).reduce((sum, value) => sum + value, 0);

    return {
      scores,
      weightedSum,
      requiredPresent,
      fatalFailure: false
    };
  }

  if (question.id === 'L8-008' || rubric.id === 'risk_parity_execution') {
    const strategyWeight = rubric.field_weights['strategy'] ?? 0;
    const executionPlanWeight = rubric.field_weights['execution_plan'] ?? 0;
    const feeSummaryWeight = rubric.field_weights['fee_summary'] ?? 0;
    const constraintsWeight = rubric.field_weights['constraints_met'] ?? 0;
    const rationaleWeight = rubric.field_weights['rationale'] ?? 0;

    scores['strategy'] = 0;
    scores['execution_plan'] = 0;
    scores['fee_summary'] = 0;
    scores['constraints_met'] = 0;
    scores['rationale'] = 0;

    const normalizedResponse = response as ExecuteOneResponse & Record<string, unknown>;
    const salvagePieces: string[] = [];
    const addPiece = (value: unknown) => {
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed.length) {
          salvagePieces.push(trimmed);
        }
      }
    };
    addPiece(normalizedResponse.follow_up_description);
    addPiece(normalizedResponse.reasoning);
    addPiece(normalizedResponse.rationale);
    addPiece(normalizedResponse.follow_up);
    addPiece(normalizedResponse['analysis']);
    addPiece(normalizedResponse['explanation']);
    addPiece(normalizedResponse['plan_text']);
    addPiece(normalizedResponse['follow_up_description_long']);
    const salvageText = salvagePieces.join('\n');

    const intentNorm = normalizeCategorical(String(normalizedResponse.intent || ''));
    const intentAccepted = (() => {
      if (!intentNorm) return false;
      const acceptedKeywords = [
        'execution',
        'strategy',
        'routing',
        'execute',
        'execution plan',
        'executionplan',
        'execution_strategy',
        'rebalance',
        'rebalance execution',
        'buy',
        'order',
        'order routing',
        'venue selection',
        'trade'
      ];
      return acceptedKeywords.some(keyword => intentNorm.includes(normalizeCategorical(keyword)));
    })();

    if (!intentAccepted) {
      failureReasons.push('l8_008_wrong_intent');
      return { scores, weightedSum: 0, requiredPresent, fatalFailure: true };
    }

    let plan: unknown[] = Array.isArray(normalizedResponse.execution_plan)
      ? (normalizedResponse.execution_plan as unknown[])
      : [];
    if ((plan?.length ?? 0) < L8_008_ASSETS.length && salvageText) {
      const extractedPlan = salvageL8008ExecutionPlanFromText(salvageText);
      if (extractedPlan) {
        normalizedResponse.execution_plan = extractedPlan.map(entry => ({
          asset: entry.asset,
          notional: entry.notional,
          fee_rate: entry.fee_rate,
          fee_amount: entry.fee_amount,
          venue: entry.venue,
        }));
        plan = normalizedResponse.execution_plan as unknown[];
        warnings.push('l8_008_execution_plan_salvaged');
      }
    }
    if (plan.length < L8_008_ASSETS.length) {
      failureReasons.push('l8_008_missing_execution_plan');
      return { scores, weightedSum: 0, requiredPresent, fatalFailure: true };
    }

    const expectedAssets: Record<
      string,
      { notional: number; feeRate: number }
    > = {
      BTC: { notional: 22_500, feeRate: 0.001 },
      ETH: { notional: 22_400, feeRate: 0.001 },
      GLD: { notional: 222_000, feeRate: 0.001 },
      TLT: { notional: 228_000, feeRate: 0.001 },
    };

    const assetPlan = new Map<string, { notional: number; feeRate: number; feeAmount: number; venue: string }>();
    let feeDataMissing = false;
    let unsupportedVenue = false;
    let duplicateAssets = false;
    let totalPlanFees = 0;
    let perAssetFeeMatches = 0;
    let perAssetRateMatches = 0;

    for (const entry of plan) {
      const asset = String((entry as any)?.asset || '').toUpperCase();
      if (!expectedAssets[asset]) {
        failureReasons.push('l8_008_unexpected_asset');
        return { scores, weightedSum: 0, requiredPresent, fatalFailure: true };
      }
      if (assetPlan.has(asset)) {
        duplicateAssets = true;
      }

      const notional = toNumber((entry as any)?.notional);
      const feeRate = toNumber((entry as any)?.fee_rate);
      const feeAmount = toNumber((entry as any)?.fee_amount);
      const venue = normalizeL8008Venue((entry as any)?.venue);

      if (notional === null || feeRate === null || feeAmount === null) {
        feeDataMissing = true;
      }

      if ((asset === 'GLD' || asset === 'TLT') && venue !== 'interactive_brokers') {
        unsupportedVenue = true;
      }

      assetPlan.set(asset, {
        notional: notional ?? NaN,
        feeRate: feeRate ?? NaN,
        feeAmount: feeAmount ?? NaN,
        venue,
      });

      if (notional !== null && feeAmount !== null) {
        totalPlanFees += feeAmount;
      }

      if (notional !== null && feeRate !== null && feeAmount !== null) {
        const venueRate =
          venue === 'interactive_brokers'
            ? 0.001
            : venue === 'coinbase'
            ? 0.006
            : feeRate;
        if (Math.abs(feeRate - venueRate) <= 0.00005) {
          perAssetRateMatches += 1;
        }
        const expectedFee = notional * venueRate;
        if (Math.abs(feeAmount - expectedFee) <= 0.11) {
          perAssetFeeMatches += 1;
        }
      }
    }

    if (duplicateAssets || assetPlan.size !== L8_008_ASSETS.length) {
      failureReasons.push('l8_008_missing_assets');
      return { scores, weightedSum: 0, requiredPresent, fatalFailure: true };
    }
    if (feeDataMissing) {
      failureReasons.push('l8_008_missing_fee_breakdown');
      return { scores, weightedSum: 0, requiredPresent, fatalFailure: true };
    }
    if (unsupportedVenue) {
      failureReasons.push('l8_008_unsupported_venue');
      return { scores, weightedSum: 0, requiredPresent, fatalFailure: true };
    }

    const planEntriesForScoring: L8008ExecutionPlanEntry[] = Array.from(assetPlan.entries()).map(
      ([asset, value]) => ({
        asset: asset as typeof L8_008_ASSETS[number],
        notional: value.notional,
        fee_rate: value.feeRate,
        fee_amount: value.feeAmount,
        venue: value.venue === 'coinbase' ? 'coinbase' : 'interactive_brokers',
      })
    );

    if (
      (!normalizedResponse.strategy || typeof normalizedResponse.strategy !== 'string') &&
      planEntriesForScoring.length === L8_008_ASSETS.length
    ) {
      const inferredStrategy = inferL8008Strategy(planEntriesForScoring);
      if (inferredStrategy) {
        normalizedResponse.strategy = inferredStrategy;
        warnings.push('l8_008_strategy_salvaged');
      }
    }

    const allIB = planEntriesForScoring.every(item => item.venue === 'interactive_brokers');
    const usesCoinbase = planEntriesForScoring.some(item => item.venue === 'coinbase');
    const ibForGoldBonds =
      assetPlan.get('GLD')?.venue === 'interactive_brokers' &&
      assetPlan.get('TLT')?.venue === 'interactive_brokers';
    const btcVenueValid =
      assetPlan.get('BTC')?.venue === 'interactive_brokers' || assetPlan.get('BTC')?.venue === 'coinbase';
    const ethVenueValid =
      assetPlan.get('ETH')?.venue === 'interactive_brokers' || assetPlan.get('ETH')?.venue === 'coinbase';

    let strategyScore = 0;
    if (allIB) {
      strategyScore = 1;
    } else if (ibForGoldBonds && btcVenueValid && ethVenueValid && usesCoinbase) {
      strategyScore = 0.75;
      warnings.push('l8_008_hybrid_strategy_detected');
    } else {
      warnings.push('l8_008_suboptimal_strategy');
    }

    const perAssetScore = perAssetFeeMatches / L8_008_ASSETS.length;
    const feeRateScore = perAssetRateMatches / L8_008_ASSETS.length;
    const executionPlanScore = perAssetScore * 0.6 + feeRateScore * 0.4;

    let summary =
      typeof normalizedResponse.fee_summary === 'object' && normalizedResponse.fee_summary !== null
        ? (normalizedResponse.fee_summary as Record<string, unknown>)
        : null;
    if (!summary && planEntriesForScoring.length === L8_008_ASSETS.length) {
      const computedSummary = buildL8008FeeSummary(planEntriesForScoring);
      summary = computedSummary;
      normalizedResponse.fee_summary = computedSummary;
      warnings.push('l8_008_fee_summary_salvaged');
    }

    if (!summary) {
      failureReasons.push('l8_008_missing_fee_summary');
      return { scores, weightedSum: 0, requiredPresent, fatalFailure: true };
    }

    const totalFees = toNumber(summary.total_fees);
    const totalNotional = toNumber(summary.total_notional);
    const totalExecutionCost = toNumber(summary.total_execution_cost);

    if (totalFees === null || totalNotional === null || totalExecutionCost === null) {
      failureReasons.push('l8_008_fee_summary_incomplete');
      return { scores, weightedSum: 0, requiredPresent, fatalFailure: true };
    }

    const expectedTotalFees = 494.9;
    const expectedTotalNotional = 494_900;
    const expectedExecutionCost = expectedTotalNotional + expectedTotalFees;

    let feeSummaryScore = 1;
    if (Math.abs(totalNotional - expectedTotalNotional) > 0.01) {
      feeSummaryScore = 0;
      failureReasons.push('l8_008_total_notional_mismatch');
    } else {
      if (Math.abs(totalFees - expectedTotalFees) > 0.1) {
        feeSummaryScore = 0.4;
        failureReasons.push('l8_008_total_fees_out_of_range');
      }
      if (Math.abs(totalExecutionCost - expectedExecutionCost) > 1) {
        feeSummaryScore = Math.min(feeSummaryScore, 0.4);
        warnings.push('l8_008_execution_cost_offset');
      }
      if (Math.abs(totalExecutionCost - expectedExecutionCost) > 2) {
        feeSummaryScore = Math.min(feeSummaryScore, 0.2);
      }
      if (Math.abs((totalFees ?? 0) - totalPlanFees) > 0.2) {
        feeSummaryScore = Math.min(feeSummaryScore, 0.4);
        warnings.push('l8_008_fee_summary_plan_mismatch');
      }
    }

    let rawConstraints: unknown = normalizedResponse.constraints_met;
    if (
      (rawConstraints === undefined || rawConstraints === null ||
        (typeof rawConstraints !== 'object' && typeof rawConstraints !== 'boolean')) &&
      planEntriesForScoring.length === L8_008_ASSETS.length
    ) {
      const inferredConstraints = salvageL8008Constraints(planEntriesForScoring, salvageText);
      normalizedResponse.constraints_met = inferredConstraints;
      rawConstraints = inferredConstraints;
      warnings.push('l8_008_constraints_salvaged');
    }

    let constraintsObj: Record<string, unknown> | null = null;
    if (typeof rawConstraints === 'boolean') {
      if (!rawConstraints) {
        failureReasons.push('l8_008_constraints_not_met');
        return { scores, weightedSum: 0, requiredPresent, fatalFailure: true };
      }
      warnings.push('l8_008_constraints_boolean_shorthand');
      constraintsObj = {
        all_assets_tradeable: true,
        same_day_execution: true,
        fees_under_limit: true,
      };
    } else if (rawConstraints && typeof rawConstraints === 'object') {
      constraintsObj = rawConstraints as Record<string, unknown>;
    } else {
      failureReasons.push('l8_008_missing_constraints');
      return { scores, weightedSum: 0, requiredPresent, fatalFailure: true };
    }

    const resolveConstraint = (key: string, fallback: boolean, warning: string) => {
      if (!constraintsObj) return fallback;
      if (key in constraintsObj) {
        return Boolean(constraintsObj[key]);
      }
      warnings.push(warning);
      return fallback;
    };

    const feesUnderLimit = resolveConstraint('fees_under_limit', true, 'l8_008_constraints_default_fees');
    const sameDayExecution = resolveConstraint('same_day_execution', true, 'l8_008_constraints_default_same_day');
    const allAssetsTradeable = resolveConstraint('all_assets_tradeable', true, 'l8_008_constraints_default_assets');

    if (!feesUnderLimit || !sameDayExecution || !allAssetsTradeable) {
      failureReasons.push('l8_008_constraints_not_met');
      return { scores, weightedSum: 0, requiredPresent, fatalFailure: true };
    }

    let constraintScore = 0;
    if (feesUnderLimit) constraintScore += 0.5;
    if (sameDayExecution) constraintScore += 0.25;
    if (allAssetsTradeable) constraintScore += 0.25;

    const rationaleText =
      typeof normalizedResponse.rationale === 'string' ? normalizedResponse.rationale.trim() : '';
    const rationaleLower = rationaleText.toLowerCase();
    const keywordHits = ['lowest', 'fees', 'optimal', 'all assets'].filter(keyword =>
      rationaleLower.includes(keyword)
    ).length;
    let rationaleScore = 0;
    if (!rationaleText || rationaleText.length < 20) {
      failureReasons.push('l8_008_missing_rationale');
    } else if (keywordHits === 4) {
      rationaleScore = 1;
    } else if (keywordHits >= 3) {
      rationaleScore = 0.75;
    } else if (keywordHits >= 2) {
      rationaleScore = 0.5;
    } else {
      rationaleScore = 0.25;
      warnings.push('l8_008_rationale_missing_keywords');
    }

    scores['strategy'] = strategyScore * strategyWeight;
    scores['execution_plan'] = executionPlanScore * executionPlanWeight;
    scores['fee_summary'] = feeSummaryScore * feeSummaryWeight;
    scores['constraints_met'] = constraintScore * constraintsWeight;
    scores['rationale'] = rationaleScore * rationaleWeight;

    const requiredFields = rubric.required_fields ?? [];
    requiredPresent = requiredFields.filter(field => {
      switch (field) {
        case 'strategy':
          return typeof normalizedResponse.strategy === 'string' && normalizedResponse.strategy.length > 0;
        case 'execution_plan':
          return Array.isArray(plan) && plan.length === L8_008_ASSETS.length;
        case 'fee_summary':
          return typeof summary === 'object';
        case 'constraints_met':
          return constraintsObj !== null;
        case 'rationale':
          return !!rationaleText;
        case 'intent':
          return !!intentNorm;
        default:
          return fieldPresent(normalizedResponse[field as keyof ExecuteOneResponse]);
      }
    }).length;

    const weightedSum = Object.values(scores).reduce((sum, value) => sum + value, 0);

    return {
      scores,
      weightedSum,
      requiredPresent,
      fatalFailure: false
    };
  }

  // L5-001: Concentrated Liquidity
  if (question.id === 'L5-001') {
    const clAnalysis = analyzeConcentratedLiquidity(response, rubric);

    // Auto-fail for forbidden order types
    if (clAnalysis.forbiddenOrderType) {
      failureReasons.push('concentrated_liquidity_forbidden_order_type');
      warnings.push('l5_001_order_type_must_not_be_limit_or_market');
      return { scores, weightedSum: weightedSumInitial, requiredPresent, fatalFailure: true };
    }

    // Auto-fail for IL exceeding 8%
    if (clAnalysis.ilHardFail) {
      failureReasons.push('concentrated_liquidity_il_exceeds_8_percent');
      warnings.push('l5_001_il_hard_constraint_violated');
      return { scores, weightedSum: weightedSumInitial, requiredPresent, fatalFailure: true };
    }

    // Apply range field scores (overriding any previous scores for these fields)
    for (const [fieldName, rangeScore] of Object.entries(clAnalysis.rangeScores)) {
      const weight = rubric.field_weights[fieldName] ?? 0;
      if (weight > 0) {
        scores[fieldName] = rangeScore * weight;
      }
    }

    const weightedSum = Object.values(scores).reduce((sum, value) => sum + value, 0);
    return { scores, weightedSum, requiredPresent, fatalFailure: false };
  }

  // L4-001: Portfolio Rebalance
  if (question.id === 'L4-001') {
    const analysis = analyzePortfolioRebalance(response);
    if (!analysis.requiresFollowUp) {
      failureReasons.push('rebalance_missing_follow_up_flag');
      warnings.push('l4_001_missing_requires_follow_up');
      return { scores, weightedSum: weightedSumInitial, requiredPresent, fatalFailure: true };
    }
    if (!analysis.followUpPresent) {
      failureReasons.push('rebalance_missing_follow_up_description');
      warnings.push('l4_001_missing_follow_up_description');
      return { scores, weightedSum: weightedSumInitial, requiredPresent, fatalFailure: true };
    }
    if (!analysis.hasAllAssets) {
      failureReasons.push('rebalance_missing_assets');
      warnings.push('l4_001_missing_asset_mentions');
      return { scores, weightedSum: weightedSumInitial, requiredPresent, fatalFailure: true };
    }
    if (!analysis.hasAllPercents) {
      failureReasons.push('rebalance_missing_percentages');
      warnings.push('l4_001_missing_percentage_mentions');
      return { scores, weightedSum: weightedSumInitial, requiredPresent, fatalFailure: true };
    }

    const ensureScore = (field: string) => {
      const weight = rubric.field_weights[field] ?? 0;
      if (weight > 0) {
        scores[field] = weight;
      }
    };

    ensureScore('intent');

    const orderTypeValue = analysis.orderTypeNormalized;
    if (REBALANCE_ALLOWED_ORDER_TYPES.has(orderTypeValue) || orderTypeValue.includes('rebalance') || orderTypeValue.includes('market') || orderTypeValue.includes('swap')) {
      ensureScore('order_type');
    }

    ensureScore('asset');
    ensureScore('size');
    ensureScore('follow_up_description');
    ensureScore('requires_follow_up');

    if (!analysis.assetFieldPresent) {
      removeFailureReason(failureReasons, 'missing_field');
      requiredPresent = Math.min(requiredPresent + 1, rubric.required_fields.length);
    }

    const weightedSum = Object.values(scores).reduce((sum, value) => sum + value, 0);
    return { scores, weightedSum, requiredPresent, fatalFailure: false };
  }

  // L4-002: Correlation Analysis
  if (question.id === 'L4-002') {
    const correlation = analyzeCorrelationAssessment(response);
    if (!correlation.intentMatch) {
      failureReasons.push('correlation_invalid_intent');
      return { scores, weightedSum: weightedSumInitial, requiredPresent, fatalFailure: true };
    }
    if (!correlation.orderTypeMatch) {
      failureReasons.push('correlation_invalid_order_type');
      return { scores, weightedSum: weightedSumInitial, requiredPresent, fatalFailure: true };
    }
    if (!correlation.hasAllAssets) {
      failureReasons.push('correlation_missing_assets');
      warnings.push('l4_002_missing_asset_mentions');
      return { scores, weightedSum: weightedSumInitial, requiredPresent, fatalFailure: true };
    }

    const ensureScore = (field: string) => {
      const weight = rubric.field_weights[field] ?? 0;
      if (weight > 0) {
        scores[field] = weight;
      }
    };

    ensureScore('intent');
    ensureScore('order_type');
    ensureScore('asset');

    if (!correlation.sizeFieldPresent) {
      ensureScore('size');
      removeFailureReason(failureReasons, 'missing_field');
      requiredPresent = Math.min(requiredPresent + 1, rubric.required_fields.length);
    }

    if (correlation.venueMatch) {
      ensureScore('venue');
    } else {
      warnings.push('l4_002_nonstandard_venue');
    }

    const weightedSum = Object.values(scores).reduce((sum, value) => sum + value, 0);
    return { scores, weightedSum, requiredPresent, fatalFailure: false };
  }

  // L4-004: Stress Test
  if (question.id === 'L4-004') {
    const stress = analyzeStressTest(response);
    if (!stress.intentMatch) {
      failureReasons.push('stress_test_invalid_intent');
      return { scores, weightedSum: weightedSumInitial, requiredPresent, fatalFailure: true };
    }
    if (!stress.orderTypeMatch) {
      failureReasons.push('stress_test_invalid_order_type');
      return { scores, weightedSum: weightedSumInitial, requiredPresent, fatalFailure: true };
    }
    if (!stress.assetMatch) {
      failureReasons.push('stress_test_invalid_asset');
      return { scores, weightedSum: weightedSumInitial, requiredPresent, fatalFailure: true };
    }
    if (!stress.sizeValid && !stress.sizeSoftPass) {
      failureReasons.push('stress_test_invalid_size');
      return { scores, weightedSum: weightedSumInitial, requiredPresent, fatalFailure: true };
    }

    const ensureScore = (field: string) => {
      const weight = rubric.field_weights[field] ?? 0;
      if (weight > 0) {
        scores[field] = weight;
      }
    };

    ensureScore('intent');
    ensureScore('order_type');
    ensureScore('asset');
    ensureScore('venue');

    if (stress.sizeValid || stress.sizeSoftPass) {
      ensureScore('size');
    }

    const weightedSum = Object.values(scores).reduce((sum, value) => sum + value, 0);
    return { scores, weightedSum, requiredPresent, fatalFailure: false };
  }

  // L5-002: Leveraged Long
  if (question.id === 'L5-002') {
    const leverage = analyzeLeveragedLong(response);

    if (!leverage.intentMatch) {
      failureReasons.push('leverage_invalid_intent');
      return { scores, weightedSum: weightedSumInitial, requiredPresent, fatalFailure: true };
    }

    if (!leverage.orderTypeValid) {
      failureReasons.push('leverage_invalid_order_type');
      warnings.push('l5_002_order_type_not_borrow_related');
      return { scores, weightedSum: weightedSumInitial, requiredPresent, fatalFailure: true };
    }

    if (!leverage.assetMatch) {
      failureReasons.push('leverage_wrong_asset');
      warnings.push('l5_002_asset_must_be_eth');
      return { scores, weightedSum: weightedSumInitial, requiredPresent, fatalFailure: true };
    }

    if (!leverage.mentions3x) {
      failureReasons.push('leverage_missing_3x');
      warnings.push('l5_002_must_mention_3x_leverage');
      return { scores, weightedSum: weightedSumInitial, requiredPresent, fatalFailure: true };
    }

    const ensureScore = (field: string) => {
      const weight = rubric.field_weights[field] ?? 0;
      if (weight > 0) {
        scores[field] = weight;
      }
    };

    ensureScore('intent');
    ensureScore('order_type');
    ensureScore('asset');
    ensureScore('size');

    if (leverage.venueMatch) {
      ensureScore('venue');
    } else {
      warnings.push('l5_002_nonstandard_venue');
    }

    const weightedSum = Object.values(scores).reduce((sum, value) => sum + value, 0);
    return { scores, weightedSum, requiredPresent, fatalFailure: false };
  }

  // L5-005: Liquid Staking
  if (question.id === 'L5-005') {
    const assetNorm = normalizeCategorical(String(response.asset || ''));
    const inputAssetNorm = normalizeCategorical(String(response.input_asset || ''));
    const venueNorm = normalizeCategorical(String(response.venue || ''));
    const venueNamePresent = fieldPresent(response.venue_name);

    // Accept stETH as asset if input_asset is ETH
    if (assetNorm === 'steth' && inputAssetNorm === 'eth') {
      const assetWeight = rubric.field_weights['asset'] ?? 0;
      if (assetWeight > 0) {
        scores['asset'] = assetWeight;
        warnings.push('l5_005_accepted_steth_with_eth_input');
      }
    }

    // Require venue_name when venue is generic "defi"
    if (venueNorm === 'defi' && !venueNamePresent) {
      failureReasons.push('staking_missing_venue_name');
      warnings.push('l5_005_defi_venue_requires_venue_name');
      return { scores, weightedSum: weightedSumInitial, requiredPresent, fatalFailure: true };
    }

    const weightedSum = Object.values(scores).reduce((sum, value) => sum + value, 0);
    return { scores, weightedSum, requiredPresent, fatalFailure: false };
  }

  // L6-001: Buy Call Options
  if (question.id === 'L6-001') {
    const intentNorm = normalizeCategorical(String(response.intent || ''));
    const orderTypeNorm = normalizeCategorical(String(response.order_type || ''));
    const assetNorm = normalizeCategorical(String(response.asset || ''));
    const venueNorm = normalizeCategorical(String(response.venue || ''));
    const venueNamePresent = fieldPresent(response.venue_name);

    // Must mention "call" somewhere (intent, order_type, or descriptively in asset)
    const mentionsCall = intentNorm.includes('call') || orderTypeNorm.includes('call') ||
                        (assetNorm.includes('call') && !assetNorm.match(/eth[_\-][0-9]/));
    if (!mentionsCall) {
      failureReasons.push('options_missing_call_type');
      warnings.push('l6_001_must_specify_call_option');
      return { scores, weightedSum: weightedSumInitial, requiredPresent, fatalFailure: true };
    }

    // Must have venue_name OR specific venue (where to buy the option)
    const specificVenues = ['deribit', 'lyra', 'ledgerx', 'hegic', 'opyn'];
    const venueIsSpecific = specificVenues.some(v => venueNorm.includes(v));
    if (!venueNamePresent && !venueIsSpecific) {
      failureReasons.push('options_missing_venue_name');
      warnings.push('l6_001_must_specify_where_to_buy');
      return { scores, weightedSum: weightedSumInitial, requiredPresent, fatalFailure: true };
    }

    // Asset must be clean (not contract-encoded like ETH_3500C_30D)
    const assetEncoded = /eth[_\-][0-9]|[0-9]{4}[_\-]|[_\-][0-9]+d/.test(assetNorm);
    if (assetEncoded) {
      failureReasons.push('options_asset_encoded');
      warnings.push('l6_001_asset_should_be_eth_not_contract_spec');
      return { scores, weightedSum: weightedSumInitial, requiredPresent, fatalFailure: true };
    }

    // Auto-fail inappropriate venues (DEX, AMM)
    const wrongVenue = venueNorm.includes('dex') || venueNorm.includes('uniswap') || venueNorm.includes('sushiswap') || venueNorm.includes('curve');
    if (wrongVenue) {
      failureReasons.push('options_wrong_venue_type');
      warnings.push('l6_001_options_not_available_on_dex');
      return { scores, weightedSum: weightedSumInitial, requiredPresent, fatalFailure: true };
    }

    // Give full asset credit if descriptive (e.g., "ETH call option")
    if (assetNorm.includes('eth') && assetNorm.includes('call') && assetNorm.includes('option')) {
      const assetWeight = rubric.field_weights['asset'] ?? 0;
      scores['asset'] = assetWeight;
      warnings.push('l6_001_accepted_descriptive_asset');
    }

    const weightedSum = Object.values(scores).reduce((sum, value) => sum + value, 0);
    return { scores, weightedSum, requiredPresent, fatalFailure: false };
  }

  // L6-002: DCA Strategy
  if (question.id === 'L6-002') {
    const intentNorm = normalizeCategorical(String(response.intent || ''));
    const orderTypeNorm = normalizeCategorical(String(response.order_type || ''));
    const venueNorm = normalizeCategorical(String(response.venue || ''));
    const inputAssetNorm = normalizeCategorical(String(response.input_asset || ''));
    const unitNorm = normalizeCategorical(String(response.unit || ''));

    // Auto-fail: limit order type
    if (orderTypeNorm === 'limit' || orderTypeNorm === 'limit order') {
      failureReasons.push('dca_limit_order_inappropriate');
      warnings.push('l6_002_dca_should_not_use_limit_orders');
      return { scores, weightedSum: weightedSumInitial, requiredPresent, fatalFailure: true };
    }

    // Auto-fail: DEX or DeFi venues (but not centralized_exchange)
    const isDexVenue =
      (venueNorm.includes('uniswap') || venueNorm.includes('sushiswap') ||
       venueNorm.includes('curve') || venueNorm.includes('balancer') ||
       venueNorm === 'dex' || venueNorm.includes('dex v') ||
       (venueNorm.includes('defi') && !venueNorm.includes('centralized')));

    if (isDexVenue) {
      failureReasons.push('dca_wrong_venue_type');
      warnings.push('l6_002_btc_dca_should_use_cex');
      return { scores, weightedSum: weightedSumInitial, requiredPresent, fatalFailure: true };
    }

    // Auto-fail: "dca" as venue
    if (venueNorm === 'dca' || venueNorm === 'dca bot' || venueNorm === 'dcabot') {
      failureReasons.push('dca_venue_not_a_place');
      warnings.push('l6_002_dca_is_not_a_venue');
      return { scores, weightedSum: weightedSumInitial, requiredPresent, fatalFailure: true };
    }

    // Check for unit indication (field or input_asset)
    const hasUnitIndication =
      unitNorm.includes('usd') || unitNorm.includes('dollar') ||
      inputAssetNorm.includes('usd') || inputAssetNorm.includes('dollar');

    if (hasUnitIndication) {
      const unitWeight = rubric.field_weights['unit'] ?? 0;
      if (unitWeight > 0) {
        scores['unit'] = unitWeight;
        warnings.push('l6_002_unit_detected_via_field_or_input_asset');
      }
    }

    const weightedSum = Object.values(scores).reduce((sum, value) => sum + value, 0);
    return { scores, weightedSum, requiredPresent, fatalFailure: false };
  }

  // L6-003: Ladder Buy Orders
  if (question.id === 'L6-003') {
    const orderTypeNorm = normalizeCategorical(String(response.order_type || ''));
    const reasoningNorm = normalizeCategorical(String(response.reasoning || ''));
    const followUpNorm = normalizeCategorical(String(response.follow_up_description || ''));
    const sizeNorm = normalizeCategorical(String(response.size || ''));

    // Validate size is reasonable (not vague placeholders)
    const unreasonableSizes = ['variable', 'tbd', 'not specified', 'user defined', 'pending'];
    const sizeIsUnreasonable = unreasonableSizes.some(term => sizeNorm.includes(term)) || sizeNorm === '';

    // Check for custom ladder array clarification or ladder keyword in reasoning
    const responseObj: any = response;
    const hasLadderArray = responseObj.ladder && Array.isArray(responseObj.ladder) && responseObj.ladder.length > 0;
    const mentionsLadderInReasoning = reasoningNorm.includes('ladder') || followUpNorm.includes('ladder');

    // For sizes < 1 BTC, assume they're per-order if ladder strategy is clear
    const sizeNum = parseFloat(sizeNorm);
    const smallSizeWithLadderContext = !isNaN(sizeNum) && sizeNum < 1 && sizeNum > 0 && mentionsLadderInReasoning;

    // Only fail truly ambiguous sizes (1, 10, or placeholders) without context
    const sizeIsAmbiguous = (sizeNorm === '1' || sizeNorm === '10') &&
                            !sizeNorm.includes('each') &&
                            !sizeNorm.includes('per') &&
                            !reasoningNorm.includes('per order') &&
                            !reasoningNorm.includes('each order') &&
                            !reasoningNorm.includes('per rung') &&
                            !reasoningNorm.match(/0\.0*1+\s*(btc|each)/) &&
                            !followUpNorm.includes('each for') &&
                            !hasLadderArray &&
                            !smallSizeWithLadderContext;

    if (sizeIsUnreasonable || sizeIsAmbiguous) {
      failureReasons.push('ladder_size_unreasonable');
      warnings.push('l6_003_size_must_be_specific_per_order_or_total');
      return { scores, weightedSum: weightedSumInitial, requiredPresent, fatalFailure: true };
    }

    // Give order_type credit if "ladder" mentioned in reasoning or follow_up, even if order_type is generic "limit"
    // Also recognize explicit multi-order language (e.g., "5 limit orders", "6 orders from X to Y")
    const hasLadderKeyword = reasoningNorm.includes('ladder') || followUpNorm.includes('ladder');
    const hasMultiOrderLanguage =
      reasoningNorm.match(/\d+\s*(limit\s*)?orders/) ||
      followUpNorm.match(/\d+\s*(limit\s*)?orders/) ||
      reasoningNorm.match(/orders?\s+from\s+\$?\d+k?\s+to\s+\$?\d+k?/) ||
      followUpNorm.match(/orders?\s+from\s+\$?\d+k?\s+to\s+\$?\d+k?/);

    if (orderTypeNorm === 'limit' && (hasLadderKeyword || hasMultiOrderLanguage)) {
      const orderTypeWeight = rubric.field_weights['order_type'] ?? 0;
      if (orderTypeWeight > 0) {
        scores['order_type'] = orderTypeWeight; // Full credit for explicit multi-order structure
        warnings.push('l6_003_ladder_or_multi_order_detected_in_description');
      }
    }

    const weightedSum = Object.values(scores).reduce((sum, value) => sum + value, 0);
    return { scores, weightedSum, requiredPresent, fatalFailure: false };
  }

  // L6-004: Trailing Stop Order
  if (question.id === 'L6-004') {
    const venueNorm = normalizeCategorical(String(response.venue || ''));
    const venueNameNorm = normalizeCategorical(String(response.venue_name || ''));

    // Auto-fail: DEX or DeFi venues (trailing stops require centralized infrastructure)
    const isDexVenue =
      venueNorm === 'dex' ||
      venueNorm.includes('dex v') ||
      venueNorm.includes('uniswap') ||
      venueNorm.includes('sushiswap') ||
      venueNorm.includes('curve') ||
      venueNorm.includes('balancer') ||
      venueNorm.includes('pancake') ||
      venueNameNorm.includes('uniswap') ||
      venueNameNorm.includes('sushiswap') ||
      (venueNorm.includes('defi') && !venueNorm.includes('centralized'));

    if (isDexVenue) {
      failureReasons.push('trailing_stop_dex_not_supported');
      warnings.push('l6_004_trailing_stops_require_centralized_exchange');
      return { scores, weightedSum: weightedSumInitial, requiredPresent, fatalFailure: true };
    }

    const weightedSum = Object.values(scores).reduce((sum, value) => sum + value, 0);
    return { scores, weightedSum, requiredPresent, fatalFailure: false };
  }

  // L6-005: TWAP Order with Duration Requirement
  if (question.id === 'L6-005') {
    const durationNorm = normalizeCategorical(String(response.duration || ''));
    const followUpNorm = normalizeCategorical(String(response.follow_up_description || ''));
    const reasoningNorm = normalizeCategorical(String(response.reasoning || ''));

    // Check if duration/time window is mentioned anywhere
    const timePatterns = [
      /4\s*hour/,
      /4\s*hr/,
      /240\s*min/,
      /next\s+4\s+hours/,
      /over\s+(the\s+)?(next\s+)?4\s+hours/,
      /4-hour/,
      /four\s+hour/,
      /48\s+(equal\s+)?slices/,  // gpt-5-mini's approach: 4 hours / 5 min = 48 slices
    ];

    const hasDuration =
      timePatterns.some(p => p.test(durationNorm)) ||
      timePatterns.some(p => p.test(followUpNorm)) ||
      timePatterns.some(p => p.test(reasoningNorm));

    const durationWeight = rubric.field_weights['duration'] ?? 0;

    if (!hasDuration) {
      // Duration is CRITICAL for TWAP orders - auto-fail if missing
      // TWAP without time window is conceptually incomplete and cannot be executed
      scores['duration'] = 0;
      failureReasons.push('twap_missing_duration_autofail');
      warnings.push('l6_005_duration_required_for_twap_execution');
      return { scores, weightedSum: 0, requiredPresent, fatalFailure: true };
    } else {
      // Award full duration credit if mentioned anywhere
      scores['duration'] = durationWeight;
      warnings.push('l6_005_duration_detected');
    }

    const weightedSum = Object.values(scores).reduce((sum, value) => sum + value, 0);
    return { scores, weightedSum, requiredPresent, fatalFailure: false };
  }

  // L8-007: MEV-resilient emergency unwind requires negative total-cost field
  if (question.id === 'L8-007' || rubric.id === 'mev_resilient_unwind') {
    const expectedValue =
      typeof (response as any).expected_value === 'number' ? ((response as any).expected_value as number) : null;
    const unitNorm = normalizeCategorical(String((response as any).unit || ''));
    const venueNameNorm = normalizeCategorical(String((response as any).venue_name || ''));
    const orderTypeNorm = normalizeCategorical(String((response as any).order_type || ''));
    const intentNorm = normalizeCategorical(String((response as any).intent || ''));

    const expectedMin = -70000;
    const expectedMax = -65000;

    let fatalFailureLocal = false;

    if (expectedValue === null) {
      failureReasons.push('mev_resilient_unwind_missing_expected_value');
      fatalFailureLocal = true;
    } else if (expectedValue > expectedMax || expectedValue < expectedMin) {
      failureReasons.push('mev_resilient_unwind_expected_value_out_of_range');
      fatalFailureLocal = true;
    } else if (expectedValue >= 0) {
      failureReasons.push('mev_resilient_unwind_expected_value_positive');
      fatalFailureLocal = true;
    }

    if (unitNorm && unitNorm !== 'usd_total_cost') {
      const reasoningTextRaw = (response as any).reasoning;
      const reasoningText = typeof reasoningTextRaw === 'string' ? reasoningTextRaw : '';
      const reasoningHasUsd =
        /\$\s*\d/.test(reasoningText) ||
        /\b\d+(?:,\d{3})*(?:\.\d+)?\s*(?:usd|dollars)\b/i.test(reasoningText);
      if (reasoningHasUsd) {
        warnings.push('mev_resilient_unwind_unit_corrected_via_reasoning');
      } else {
        failureReasons.push('mev_resilient_unwind_wrong_unit');
      }
    }

    if (!venueNameNorm.includes('1inch')) {
      failureReasons.push('mev_resilient_unwind_wrong_venue');
      fatalFailureLocal = true;
    }

    const allowedOrderTypes = new Set(['swap', 'market', 'dex', 'dexswap']);

    if (orderTypeNorm && !orderTypeNorm.includes('protected') && !allowedOrderTypes.has(orderTypeNorm)) {
      failureReasons.push('mev_resilient_unwind_order_type_mismatch');
    }

    if (intentNorm && intentNorm !== 'sell') {
      failureReasons.push('mev_resilient_unwind_intent_mismatch');
    }

    if (fatalFailureLocal) {
      return { scores, weightedSum: 0, requiredPresent, fatalFailure: true };
    }

    const weightedSum = Object.values(scores).reduce((sum, value) => sum + value, 0);
    return { scores, weightedSum, requiredPresent, fatalFailure: false };
  }

  const weightedSum = Object.values(scores).reduce((sum, value) => sum + value, 0);
  return { scores, weightedSum, requiredPresent, fatalFailure: false };
}

export function gradeSchemaResponse(
  raw: string,
  question: SchemaQuestion,
  rubric: SchemaRubric
): GradeResult {
  const failureReasons: FailureReason[] = [];
  const warnings: string[] = [];
  const { parsed, method, wasTruncated } = tryParseJson(raw);
  let response = parsed;
  let parsingMethod: ParsingMethod = method;

  if (!response) {
    const salvaged = salvageResponse(raw);
    if (salvaged) {
      response = salvaged;
      parsingMethod = 'none';
    } else {
      if (wasTruncated) {
        failureReasons.push('truncated_response');
        failureReasons.push('transport_error');
      } else {
        failureReasons.push('parse_failed');
      }
      return {
        pass: false,
        confidence: 0,
        score: 0,
        fieldScores: {},
        normalizedResponse: null,
        failureReasons,
        parsingMethod,
      };
    }
  }

  if ((question.id === 'L8-007' || rubric.id === 'mev_resilient_unwind') && parsingMethod === 'fenced_json') {
    failureReasons.push('mev_resilient_unwind_fenced_json_not_allowed');
    return {
      pass: false,
      confidence: 0,
      score: 0,
      fieldScores: {},
      normalizedResponse: null,
      failureReasons,
      parsingMethod,
    };
  }

  const normalizedResponse = normalizeResponseFields(response) as ExecuteOneResponse & Record<string, unknown>;

  if (question.id === 'L8-008' || rubric.id === 'risk_parity_execution') {
    const salvagePieces: string[] = [];
    const addPiece = (value: unknown) => {
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed.length) {
          salvagePieces.push(trimmed);
        }
      }
    };
    addPiece(normalizedResponse.follow_up_description);
    addPiece(normalizedResponse.reasoning);
    addPiece(normalizedResponse.rationale);
    addPiece(normalizedResponse.follow_up);
    addPiece(normalizedResponse['analysis']);
    addPiece(normalizedResponse['explanation']);
    addPiece(normalizedResponse['plan_text']);
    addPiece(normalizedResponse['follow_up_description_long']);
    const salvageText = salvagePieces.join('\n');

    let plan: unknown[] = Array.isArray(normalizedResponse.execution_plan)
      ? (normalizedResponse.execution_plan as unknown[])
      : [];
    let planEntries: L8008ExecutionPlanEntry[] | null = null;

    if ((plan?.length ?? 0) < L8_008_ASSETS.length && salvageText) {
      const extractedPlan = salvageL8008ExecutionPlanFromText(salvageText);
      if (extractedPlan) {
        normalizedResponse.execution_plan = extractedPlan.map(entry => ({
          asset: entry.asset,
          notional: entry.notional,
          fee_rate: entry.fee_rate,
          fee_amount: entry.fee_amount,
          venue: entry.venue,
        }));
        plan = normalizedResponse.execution_plan as unknown[];
        planEntries = extractedPlan;
        warnings.push('l8_008_execution_plan_salvaged');
      }
    }

    if (!planEntries) {
      planEntries = deriveL8008PlanEntriesFromResponse(plan ?? []);
    }

    if (
      (!normalizedResponse.strategy || typeof normalizedResponse.strategy !== 'string') &&
      planEntries
    ) {
      const inferredStrategy = inferL8008Strategy(planEntries);
      if (inferredStrategy) {
        normalizedResponse.strategy = inferredStrategy;
        warnings.push('l8_008_strategy_salvaged');
      }
    }

    if (
      (!normalizedResponse.fee_summary || typeof normalizedResponse.fee_summary !== 'object') &&
      planEntries
    ) {
      normalizedResponse.fee_summary = buildL8008FeeSummary(planEntries);
      warnings.push('l8_008_fee_summary_salvaged');
    }

    if (
      (normalizedResponse.constraints_met === undefined || normalizedResponse.constraints_met === null ||
        (typeof normalizedResponse.constraints_met !== 'object' && typeof normalizedResponse.constraints_met !== 'boolean')) &&
      planEntries
    ) {
      normalizedResponse.constraints_met = salvageL8008Constraints(planEntries, salvageText);
      warnings.push('l8_008_constraints_salvaged');
    }
  }

  let { scores, weightedSum, weightTotal, requiredPresent, fatalFailure } = computeFieldScores(
    normalizedResponse,
    question,
    rubric,
    failureReasons,
    warnings
  );

  if (fatalFailure) {
    return {
      pass: false,
      confidence: 0,
      score: 0,
      fieldScores: scores,
      normalizedResponse,
      failureReasons,
      parsingMethod,
    };
  }

  // Apply custom adjustments for specific questions
  const adjusted = applyCustomAdjustments(
    question,
    rubric,
    normalizedResponse,
    scores,
    failureReasons,
    warnings,
    requiredPresent
  );

  scores = adjusted.scores;
  weightedSum = adjusted.weightedSum;
  requiredPresent = adjusted.requiredPresent;
  fatalFailure = adjusted.fatalFailure;

  if (fatalFailure) {
    return {
      pass: false,
      confidence: 0,
      score: 0,
      fieldScores: scores,
      normalizedResponse,
      failureReasons,
      parsingMethod,
    };
  }

  const totalRequired = rubric.required_fields.length;
  const normalizedScore = weightTotal > 0 ? weightedSum / weightTotal : 0;

  const matchingFields = Object.entries(scores).filter(([, value]) => value > 0).length;
  const averageFieldScore = matchingFields > 0 ? weightedSum / matchingFields : 0;

  const presentRatio = totalRequired > 0 ? requiredPresent / totalRequired : 1;
  const confidenceMultiplier = method === 'json' ? 1 : method === 'fenced_json' ? 0.8 : 0.6;
  const confidence = Math.min(1, presentRatio * confidenceMultiplier * Math.min(1, normalizedScore + averageFieldScore / 2));

  const pass = normalizedScore >= rubric.pass_threshold && confidence >= 0.6;

  return {
    pass,
    confidence,
    score: normalizedScore,
    fieldScores: scores,
    normalizedResponse,
    failureReasons,
    parsingMethod,
  };
}
