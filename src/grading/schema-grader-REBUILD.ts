import { fuzzyScore, fieldPresent, normalizeCategorical } from '../utils/fuzzy-matcher';
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
    const parsed = JSON.parse(raw);
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

  return { parsed: null, method: 'none', wasTruncated };
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
  const normalized: ExecuteOneResponse = {};
  for (const [key, value] of Object.entries(response)) {
    normalized[key as keyof ExecuteOneResponse] = value;
  }
  return normalized;
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
  'portfolio rebalance',
  'rebalance portfolio',
  'market',
  'market order',
  'strategy',
  'plan',
  'execution plan',
  'multi leg',
  'exact amount',
  'swap',
  'risk modeling',
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
  'assess_correlation',
  'assess correlation',
  'assess_correlation_risk',
  'assess correlation risk',
  'risk_modeling',
  'risk modeling',
  'risk_analysis',
  'risk analysis',
  'analysis',
  'correlation_assessment',
  'correlation assessment'
]);

const CORRELATION_ALLOWED_ORDER_TYPES = new Set([
  'analysis',
  'correlation_analysis',
  'correlation analysis',
  'correlation_assessment',
  'correlation assessment',
  'assess_correlation',
  'assess correlation',
  'analyze_correlation',
  'analyze correlation',
  'risk_modeling',
  'risk modeling',
  'risk_analysis',
  'risk analysis',
  'strategy',
  'plan'
]);

const CORRELATION_ALLOWED_VENUES = new Set([
  'analysis',
  'risk_analysis',
  'risk analysis',
  'risk_modeling',
  'risk modeling',
  'research',
  'research_platform',
  'market_data',
  'market data',
  'analytics',
  'onchain',
  'onchain_analytics',
  'internal',
  'internal_system',
  'offchain',
  'portfolio_analysis',
  'risk_engine'
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

  const intentMatch = CORRELATION_ALLOWED_INTENTS.has(intentNorm);
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
  'stress testing',
  'risk_modeling',
  'risk modeling',
  'risk_analysis',
  'risk analysis'
]);

const STRESS_TEST_ALLOWED_ORDER_TYPES = new Set([
  'stress_test',
  'stress testing',
  'stress_analysis',
  'analysis',
  'risk_analysis',
  'risk modeling'
]);

const STRESS_TEST_ALLOWED_VENUES = new Set([
  'analysis',
  'risk_analysis',
  'risk analysis',
  'risk_modeling',
  'risk modeling',
  'portfolio_analysis',
  'risk_engine',
  'local_simulation',
  'local_simulator',
  'simulator',
  'simulation',
  'off_chain',
  'offchain',
  'internal'
]);

const STRESS_TEST_ALLOWED_ASSETS = new Set([
  'portfolio',
  'crypto_portfolio',
  'all_crypto',
  'all crypto',
  'crypto',
  'multi_asset',
  'multi asset',
  'multi_asset_portfolio',
  'portfolio_total'
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
  'leverage_long',
  'leveraged_long',
  'leveraged long',
  'create_leveraged_position',
  'create leveraged position',
  'open_position',
  'open position',
  'leveraged_long_position',
  'leveraged long position',
  'long'
]);

const LEVERAGE_BORROW_ORDER_TYPES = new Set([
  'collateralized_borrow',
  'collateralized borrow',
  'collateralized_loan',
  'collateralized loan',
  'recursive_borrow',
  'recursive borrow',
  'deposit_collateral',
  'deposit collateral',
  'supply_collateral',
  'supply collateral',
  'leveraged_borrow',
  'leveraged borrow',
  'borrow',
  'loan'
]);

const LEVERAGE_GENERIC_ORDER_TYPES = new Set([
  'market',
  'market order',
  'deposit',
  'open_position',
  'open position',
  'leveraged_position',
  'leveraged position',
  'leverage_long'
]);

const LEVERAGE_FORBIDDEN_ORDER_TYPES = new Set([
  'margin',
  'margin_trade',
  'margin trade'
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
  const venueMatch = venueNorm.includes('aave') || venueNorm.includes('lending') || venueNorm === 'defi';

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
    const weight = rubric.field_weights[field] ?? 0;
    weightTotal += weight;

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
  if (!['L4-001', 'L4-002', 'L4-004', 'L5-002'].includes(question.id)) {
    const weightedSum = Object.values(scores).reduce((sum, value) => sum + value, 0);
    return { scores, weightedSum, requiredPresent, fatalFailure: false };
  }

  const weightedSumInitial = Object.values(scores).reduce((sum, value) => sum + value, 0);

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
  const { parsed: response, method, wasTruncated } = tryParseJson(raw);

  if (!response) {
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
      parsingMethod: method,
      warnings,
      color: 'red',
    };
  }

  const normalizedResponse = normalizeResponseFields(response);

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
      parsingMethod: method,
      warnings,
      color: 'red',
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
      parsingMethod: method,
      warnings,
      color: 'red',
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

  const color = pass ? 'green' : normalizedScore >= rubric.pass_threshold * 0.9 ? 'yellow' : 'red';

  return {
    pass,
    confidence,
    score: normalizedScore,
    fieldScores: scores,
    normalizedResponse,
    failureReasons,
    parsingMethod: method,
    warnings,
    color,
  };
}

