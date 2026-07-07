#!/usr/bin/env tsx
/**
 * build-gate-eval-set.ts — Build the gate eval set for the null-reward control.
 *
 * Per Lambert's requirement #1 and Liang's eval-design directive:
 *   gate_eval = 202 verifiable MINUS 27 training pool
 *
 * This is the set used to:
 *   (a) measure base variance (≥5 runs) for the SEM
 *   (b) evaluate null-reward checkpoints (steps 10/20/30)
 *   (c) compare to the contamination ceiling (base_mean + 2·SEM)
 *
 * It is DISJOINT from the training pool — no question is both trained and evaluated on.
 *
 * Output: results/grpo-preconditions/gate-eval-ids.txt (one ID per line)
 */
import fs from 'fs';
import path from 'path';

const VERIFIABLE_PATH = 'results/mutation-test-300q/grpo-verifiable-subset.json';
const SPLIT_PATH = 'results/grpo-preconditions/grpo-holdout-split.json';
const OUT_PATH = 'results/grpo-preconditions/gate-eval-ids.txt';

const verifiable = JSON.parse(fs.readFileSync(VERIFIABLE_PATH, 'utf8'));
const split = JSON.parse(fs.readFileSync(SPLIT_PATH, 'utf8'));

const verifiableIds: string[] = verifiable.verifiable;
const trainIds: string[] = split.train.ids;
const holdoutIds: string[] = split.holdout.ids;

// Gate = verifiable MINUS training. Holdout stays IN the gate (it's item-disjoint from
// training by construction — different questions). Liang's 2×3 panel needs the holdout
// as a separate stratum, so we keep it in the gate set but tag it.
const trainSet = new Set(trainIds);
const gateIds = verifiableIds.filter(id => !trainSet.has(id));

// Stratify for Liang's 2×3 panel: {training (excluded), holdout, rest}
const holdoutSet = new Set(holdoutIds);
const holdoutInGate = gateIds.filter(id => holdoutSet.has(id));
const restInGate = gateIds.filter(id => !holdoutSet.has(id));

console.log('=== GATE EVAL SET ===');
console.log(`202 verifiable - ${trainIds.length} training = ${gateIds.length} gate questions`);
console.log(`  holdout stratum: ${holdoutInGate.length}`);
console.log(`  rest stratum:    ${restInGate.length}`);
console.log(`  training excluded: ${trainIds.length}`);

// Verify disjointness: no training question in gate
const leak = gateIds.filter(id => trainSet.has(id));
if (leak.length > 0) {
  console.error(`FATAL: ${leak.length} training questions leaked into gate: ${leak.slice(0, 5)}`);
  process.exit(1);
}

// Write gate IDs
fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, gateIds.join('\n') + '\n');

// Write stratified manifest
const manifest = {
  decision: 'gate-eval-set (council 2026-07-07: Lambert req #1, Liang 2×3 panel)',
  source: '202 verifiable MINUS 27 training',
  total: gateIds.length,
  strata: {
    holdout: { count: holdoutInGate.length, ids: holdoutInGate },
    rest: { count: restInGate.length, ids: restInGate },
  },
  excluded: { count: trainIds.length, reason: 'training pool (27 questions)' },
};
const manifestPath = OUT_PATH.replace('.txt', '-manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log(`\nwrote ${OUT_PATH} (${gateIds.length} ids)`);
console.log(`wrote ${manifestPath} (stratified manifest)`);
console.log(`\nGATE: PASS (training-disjoint)`);
