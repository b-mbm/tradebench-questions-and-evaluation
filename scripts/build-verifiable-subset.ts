#!/usr/bin/env tsx
/**
 * Build the GRPO verifiable-subset manifest (council decision 2026-07-03, path b).
 *
 * The grader stays FROZEN. This script only identifies which questions go into the
 * GRPO reward set (verifiable) vs are quarantined (hidden-oracle AGI).
 *
 * Method (most auditable per Liang/HELM):
 *   VERIFIABLE = all non-AGI (190) + AGI questions whose expected chosen_strategy
 *                value appears verbatim (normalized) in the prompt.
 *   QUARANTINED = AGI questions whose expected chosen_strategy is NOT in the prompt
 *                 (hidden oracle — excluded from GRPO reward, kept for separate-tier eval).
 *
 * Output: grpo-verifiable-subset.json
 */
import { SCHEMA_QUESTIONS_300Q } from '../src/questions/schema-questions-300q';
import { loadRubric300q } from '../src/rubrics/loader-300q';
import fs from 'fs';

type Json = any;

const pdata = JSON.parse(fs.readFileSync('prompts-300q.json', 'utf8'));
const rows: Json[] = Array.isArray(pdata) ? pdata : (pdata.rows || pdata.questions || pdata.prompts || []);
const promptById = new Map<string, string>();
for (const r of rows) {
  const id = r.id || r.questionId;
  if (id) promptById.set(String(id), ((r.system || '') + ' ' + (r.user || '')));
}

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

const verifiable: string[] = [];
const quarantined: string[] = [];
const detail: Json[] = [];

for (const q of SCHEMA_QUESTIONS_300Q as Json[]) {
  const id = String(q.id);
  const isAgi = id.startsWith('AGI');
  const rubric = loadRubric300q(q.rubric_id) as Json;
  const agiValidation = rubric?._agi_canonical?.validation ?? {};

  if (!isAgi) {
    // all non-AGI use fuzzyScore = verifiable
    verifiable.push(id);
    detail.push({ id, tier: `L${q.level}`, set: 'verifiable', reason: 'non-AGI (fuzzyScore grading)' });
    continue;
  }

  // AGI: check if expected chosen_strategy is disclosed in the prompt
  const expectedStrategy = agiValidation?.chosen_strategy?.expected;
  const prompt = promptById.get(id) || '';
  const disclosed = expectedStrategy && normalize(prompt).includes(normalize(expectedStrategy));

  if (disclosed) {
    verifiable.push(id);
    detail.push({ id, tier: 'AGI', set: 'verifiable', reason: `disclosed: expected "${expectedStrategy}" found in prompt`, expectedStrategy });
  } else {
    quarantined.push(id);
    detail.push({ id, tier: 'AGI', set: 'quarantined', reason: `hidden oracle: expected "${expectedStrategy}" NOT in prompt`, expectedStrategy });
  }
}

const manifest = {
  decision: 'path-b-restrict-reward (council 2026-07-03)',
  graderStatus: 'FROZEN — no changes to schema-grader-300q.ts',
  verifiableCount: verifiable.length,
  quarantinedCount: quarantined.length,
  method: 'non-AGI (all verifiable) + AGI whose expected chosen_strategy appears verbatim-normalized in prompt',
  verifiable,        // ~202: reward set for GRPO
  quarantined,       // ~98: eval-only, separate-tier reporting
  detail,
};

const outDir = 'results/mutation-test-300q';
fs.writeFileSync(`${outDir}/grpo-verifiable-subset.json`, JSON.stringify(manifest, null, 2));

console.log('=== GRPO verifiable-subset manifest (path b) ===');
console.log(`verifiable (GRPO reward set): ${manifest.verifiableCount}`);
console.log(`quarantined (eval-only, hidden oracle): ${manifest.quarantinedCount}`);
console.log(`total: ${manifest.verifiableCount + manifest.quarantinedCount}`);
console.log(`\ndisclosed AGI in verifiable set:`);
for (const d of detail.filter((x: Json) => x.tier === 'AGI' && x.set === 'verifiable')) {
  console.log(`  ${d.id}: ${d.expectedStrategy}`);
}
console.log(`\nwrote ${outDir}/grpo-verifiable-subset.json`);
