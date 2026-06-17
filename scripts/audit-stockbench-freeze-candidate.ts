#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

import { STOCKBENCH_QUESTIONS_300Q } from '../src/questions/stockbench-questions-300q';
import { loadRubric300q } from '../src/rubrics/loader-300q';
import { gradeSchemaResponse } from '../src/grading/schema-grader-300q';

type Row = {
  ID: string;
  tier_tagged: string;
  tier_observed: string;
  tier_variance: number;
  answer_key_verdict: 'VERIFIED' | 'PARTIAL' | 'ERROR' | 'UNKNOWN';
  primary_domain: string;
  capability_tag: string;
  scenario_family: string;
  feasibility_trap: boolean;
  notes: string;
};

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'docs');
const AUDIT_CSV = path.join(OUT_DIR, 'stockbench-300q-audit.csv');
const SUMMARY_MD = path.join(OUT_DIR, 'stockbench-freeze-candidate-summary.md');

const tierTargets: Record<string, number> = {
  L1: 3,
  L2: 4,
  L3: 3,
  L4: 5,
  L5: 5,
  L6: 5,
  L7: 5,
  L8: 10,
  L9: 81,
  L10: 69,
  AGI: 110,
};

const domainTargets: Record<string, number> = {
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

const bucketTargets: Record<string, Record<string, number>> = {
  // AGI reallocated (amendment 2026-06-16) — mirrors generate-stockbench-first-draft.ts.
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

function bucket(tier: string): string {
  if (['L1', 'L2', 'L3', 'L4'].includes(tier)) return 'L1-L4';
  if (['L5', 'L6', 'L7', 'L8'].includes(tier)) return 'L5-L8';
  return tier;
}

function observedTier(tagged: string, prompt: string): string {
  const hasObjective = /Objective:/i.test(prompt);
  const hasReject = /reject|unavailable|not permitted|violates|infeasible/i.test(prompt);
  const hasSelfCheck = /self_check/i.test(prompt);
  if (tagged === 'AGI') return hasObjective && hasReject && hasSelfCheck ? 'AGI' : 'L10';
  if (tagged === 'L10') return hasObjective && hasReject ? 'L10' : 'L9';
  if (tagged === 'L9') return hasObjective && hasReject ? 'L9' : 'L8';
  return tagged;
}

function tierRank(tier: string): number {
  if (tier === 'AGI') return 11;
  return Number(tier.replace('L', ''));
}

function csvCell(value: unknown): string {
  const text = String(value).replace(/"/g, '""');
  return /[",\n]/.test(text) ? `"${text}"` : text;
}

function countBy<T>(items: T[], fn: (item: T) => string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const item of items) out[fn(item)] = (out[fn(item)] ?? 0) + 1;
  return Object.fromEntries(Object.entries(out).sort());
}

let canonicalFailures = 0;
let metadataFailures = 0;
let ambiguityFailures = 0;
let duplicateRisk = 0;
let templateDiversityFailures = 0;
const rows: Row[] = [];
const ids = new Set<string>();
const rubricIds = new Set<string>();
const exactPrompts = new Map<string, string[]>();
const skeletonsByTier = new Map<string, Set<string>>();

function normalizedPromptSkeleton(prompt: string): string {
  return prompt
    .toLowerCase()
    .replace(/\b20\d{2}-\d{2}-\d{2}\b/g, '<date>')
    .replace(/\b\d{1,2}:\d{2}(?::\d{2})?\b/g, '<time>')
    .replace(/\b\d+(?:,\d{3})+(?:\.\d+)?\b/g, '<num>')
    .replace(/\b\d+(?:\.\d+)?%?\b/g, '<num>')
    .replace(/\b(spy|aapl|msft|nvda|tsla|qqq|iwm|gld|xlk|xlf|es|cl|eurusd)\b/g, '<symbol>')
    .replace(/[a-z0-9]+_[a-z0-9_]+_(valid_plan|reject_margin_capacity|reject_minimum_reduction|reject_permission_or_calendar|domain_constraint_satisfied|minimum_reduction_satisfied|cash_budget_satisfied|margin_capacity_satisfied|permissions_satisfied|worst_case_matches_scenarios)_?\d*/g, '<route_label>')
    .replace(/\s+/g, ' ')
    .trim();
}

for (const q of STOCKBENCH_QUESTIONS_300Q) {
  const meta = q.context?.stockbench as Record<string, unknown>;
  const rubric = loadRubric300q(q.rubric_id) as any;
  const raw = JSON.stringify({ ...q.expected_values, reasoning: 'canonical derivation from frozen packet' });
  const grade = gradeSchemaResponse(raw, q, rubric);
  if (!grade.pass) canonicalFailures += 1;

  const tagged = String(meta?.tier ?? '');
  const observed = observedTier(tagged, q.prompt);
  const variance = Math.abs(tierRank(tagged) - tierRank(observed));

  const missing: string[] = [];
  for (const key of ['primary_domain', 'tier', 'capability_tag', 'scenario_family', 'feasibility_trap']) {
    if (meta?.[key] === undefined) missing.push(key);
  }
  if (['L9', 'L10', 'AGI'].includes(tagged) && !meta?.objective_function) missing.push('objective_function');
  if (!Array.isArray(meta?.deterministic_grading_fields) || !meta.deterministic_grading_fields.length) missing.push('deterministic_grading_fields');
  if (!Array.isArray(rubric.metadata?.failure_modes) || !rubric.metadata.failure_modes.length) missing.push('failure_modes');
  if (!Array.isArray(rubric.metadata?.must_not) || !rubric.metadata.must_not.length) missing.push('must_not');
  if (missing.length) metadataFailures += 1;

  const promptMissing: string[] = [];
  if (!/Frozen market snapshot:/i.test(q.prompt)) promptMissing.push('frozen_packet');
  if (!/Output JSON fields:/i.test(q.prompt)) promptMissing.push('output_fields');
  if (['L9', 'L10', 'AGI'].includes(tagged) && !/Objective:/i.test(q.prompt)) promptMissing.push('objective');
  const expectedKeys = new Set(Object.keys(q.expected_values));
  const optionMathRequired = ['contracts', 'put_contracts', 'buy_put_contracts', 'premium_paid', 'option_premium_paid', 'net_debit_usd', 'net_premium_paid']
    .some(key => expectedKeys.has(key));
  if (
    optionMathRequired &&
    /\b(option|options|call|calls|put|puts)\b/i.test(q.prompt) &&
    !/\b(multiplier|100 shares)\b/i.test(q.prompt)
  ) {
    promptMissing.push('option_multiplier');
  }
  const futuresMathRequired = ['es_contracts', 'mes_contracts', 'contracts', 'roll_cost_usd', 'roll_debit_usd', 'hedge_notional_usd', 'beta_reduction_usd']
    .some(key => expectedKeys.has(key));
  if (
    futuresMathRequired &&
    /\b(future|futures|ES|CL|MES|6E)\b/i.test(q.prompt) &&
    !/\b(multiplier|notional per contract|contract spec|contract is|contract size)\b/i.test(q.prompt)
  ) {
    promptMissing.push('futures_multiplier');
  }
  const equityShortRequired = ['short_shares', 'buy_to_cover_shares', 'aapl_buy_to_cover_shares'].some(key => expectedKeys.has(key));
  if (
    equityShortRequired &&
    /\b(short|shorts|borrow|locate|located)\b/i.test(q.prompt) &&
    !/\b(locate|located|borrow|short selling|borrow recall)\b/i.test(q.prompt)
  ) {
    promptMissing.push('borrow_locate');
  }
  if (/settle|settlement|T\+1|T\+2/i.test(q.prompt) && !/settlement|T\+1|T\+2/i.test(q.prompt)) promptMissing.push('settlement_rule');
  if (promptMissing.length) ambiguityFailures += 1;

  if (ids.has(q.id)) duplicateRisk += 1;
  ids.add(q.id);
  if (rubricIds.has(q.rubric_id)) duplicateRisk += 1;
  rubricIds.add(q.rubric_id);
  exactPrompts.set(q.prompt, [...(exactPrompts.get(q.prompt) ?? []), q.id]);
  const skeleton = normalizedPromptSkeleton(q.prompt);
  const skeletonSet = skeletonsByTier.get(tagged) ?? new Set<string>();
  skeletonSet.add(skeleton);
  skeletonsByTier.set(tagged, skeletonSet);

  const notes = [
    grade.pass ? 'canonical local grade pass' : 'canonical local grade fail',
    missing.length ? `metadata missing: ${missing.join('|')}` : 'metadata complete',
    promptMissing.length ? `prompt gaps: ${promptMissing.join('|')}` : 'packet assumptions present',
  ].join('; ');

  rows.push({
    ID: q.id,
    tier_tagged: tagged,
    tier_observed: observed,
    tier_variance: variance,
    answer_key_verdict: grade.pass && !promptMissing.length ? 'VERIFIED' : 'ERROR',
    primary_domain: String(meta.primary_domain),
    capability_tag: String(meta.capability_tag),
    scenario_family: String(meta.scenario_family),
    feasibility_trap: Boolean(meta.feasibility_trap),
    notes,
  });
}

const exactDuplicateGroups = [...exactPrompts.values()].filter(group => group.length > 1);
duplicateRisk += exactDuplicateGroups.reduce((sum, group) => sum + group.length - 1, 0);

const tierCounts = countBy(STOCKBENCH_QUESTIONS_300Q, q => String((q.context?.stockbench as any).tier));
const domainCounts = countBy(STOCKBENCH_QUESTIONS_300Q, q => String((q.context?.stockbench as any).primary_domain));
const capCounts = countBy(STOCKBENCH_QUESTIONS_300Q, q => String((q.context?.stockbench as any).capability_tag));

const templateDiversity: Record<string, { questions: number; distinctSkeletons: number; ratio: number; minRatio: number }> = {};
for (const [tier, skeletons] of skeletonsByTier.entries()) {
  const questions = tierCounts[tier] ?? 0;
  const ratio = questions > 0 ? skeletons.size / questions : 1;
  const minRatio = tier === 'AGI' || tier === 'L10' ? 0.3 : tier === 'L9' ? 0.25 : 0;
  templateDiversity[tier] = {
    questions,
    distinctSkeletons: skeletons.size,
    ratio: Math.round(ratio * 1000) / 1000,
    minRatio,
  };
  if (minRatio > 0 && ratio < minRatio) templateDiversityFailures += 1;
}

const matrix: Record<string, Record<string, number>> = {};
for (const q of STOCKBENCH_QUESTIONS_300Q) {
  const meta = q.context?.stockbench as any;
  matrix[meta.primary_domain] ??= { 'L1-L4': 0, 'L5-L8': 0, L9: 0, L10: 0, AGI: 0 };
  matrix[meta.primary_domain][bucket(meta.tier)] += 1;
}

const matrixMismatch = Object.entries(bucketTargets).some(([domain, target]) =>
  Object.entries(target).some(([b, value]) => matrix[domain]?.[b] !== value)
);
const tierMismatch = Object.entries(tierTargets).some(([tier, value]) => tierCounts[tier] !== value);
const domainMismatch = Object.entries(domainTargets).some(([domain, value]) => domainCounts[domain] !== value);

const csv = [
  Object.keys(rows[0]).join(','),
  ...rows.map(row => Object.values(row).map(csvCell).join(',')),
].join('\n');
fs.writeFileSync(AUDIT_CSV, `${csv}\n`);

const freezeReady =
  STOCKBENCH_QUESTIONS_300Q.length === 300 &&
  canonicalFailures === 0 &&
  metadataFailures === 0 &&
  ambiguityFailures === 0 &&
  duplicateRisk === 0 &&
  templateDiversityFailures === 0 &&
  !matrixMismatch &&
  !tierMismatch &&
  !domainMismatch;

const summary = `# StockBench 300Q Freeze-Candidate Audit

Status: ${freezeReady ? 'FREEZE-CANDIDATE READY' : 'NOT READY'}

This is an audit artifact for the first StockBench 300Q draft. No paid model calls were run.

## Counts

- Questions: ${STOCKBENCH_QUESTIONS_300Q.length}
- Canonical grading failures: ${canonicalFailures}
- Metadata failures: ${metadataFailures}
- Ambiguity/precondition failures: ${ambiguityFailures}
- Duplicate/near-duplicate risk flags: ${duplicateRisk}
- Template diversity failures: ${templateDiversityFailures}
- Tier mismatch: ${tierMismatch}
- Domain mismatch: ${domainMismatch}
- Domain-by-difficulty matrix mismatch: ${matrixMismatch}

## Tier Counts

\`\`\`json
${JSON.stringify(tierCounts, null, 2)}
\`\`\`

## Domain Counts

\`\`\`json
${JSON.stringify(domainCounts, null, 2)}
\`\`\`

## Capability Counts

\`\`\`json
${JSON.stringify(capCounts, null, 2)}
\`\`\`

## Template Diversity

\`\`\`json
${JSON.stringify(templateDiversity, null, 2)}
\`\`\`

## Domain x Difficulty Matrix

\`\`\`json
${JSON.stringify(matrix, null, 2)}
\`\`\`

## Validation Commands

\`\`\`bash
npx tsx scripts/audit-stockbench-freeze-candidate.ts
npx tsx -e 'import { STOCKBENCH_QUESTIONS_300Q } from "./src/questions/stockbench-questions-300q"; import { loadRubric300q } from "./src/rubrics/loader-300q"; import { gradeSchemaResponse } from "./src/grading/schema-grader-300q"; let failures = 0; for (const q of STOCKBENCH_QUESTIONS_300Q) { const rubric = loadRubric300q(q.rubric_id); const raw = JSON.stringify({ ...q.expected_values, reasoning: "canonical derivation from frozen packet" }); const grade = gradeSchemaResponse(raw, q, rubric); if (!grade.pass) failures++; } console.log(\`canonical_failures=\${failures}\`); if (failures) process.exit(1);'
npx tsc --noEmit --module ESNext --moduleResolution Bundler --target ES2022 --skipLibCheck src/questions/stockbench-questions-300q.ts src/questions/stockbench-generated-questions.ts scripts/generate-stockbench-first-draft.ts scripts/audit-stockbench-freeze-candidate.ts
\`\`\`

## Remaining Risks

- This is a local deterministic audit, not a model smoke run.
- The generated supplement is intentionally systematic; it is locally valid and matrix-balanced, but should still receive human spot review before permanent freeze.
- No paid model evaluations have been run.
`;
fs.writeFileSync(SUMMARY_MD, summary);

console.log(JSON.stringify({
  freezeReady,
  questions: STOCKBENCH_QUESTIONS_300Q.length,
  canonicalFailures,
  metadataFailures,
  ambiguityFailures,
  duplicateRisk,
  templateDiversityFailures,
  tierMismatch,
  domainMismatch,
  matrixMismatch,
  auditCsv: AUDIT_CSV,
  summaryMd: SUMMARY_MD,
}, null, 2));

if (!freezeReady) process.exit(1);
