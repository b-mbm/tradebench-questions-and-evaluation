#!/usr/bin/env tsx
/**
 * Build the GRPO held-out generalization split (Phase 0, Step 3).
 *
 * Per council decision (Finn/MAML): carve 8 of the 35 non-AGI latent as held-out,
 * stratified to span latent-strength bands and L-tiers. Train pool = other 27.
 *
 * Per Finn's refinement: the 98 quarantined AGI serve as a SECOND held-out set
 * (unseen generalization probe, no reward, no disclosure) — included here for
 * completeness but tracked separately.
 *
 * No GPU. Reads probe pass counts + question metadata. Writes grpo-holdout-split.json.
 */
import { SCHEMA_QUESTIONS_300Q } from '../src/questions/schema-questions-300q';
import fs from 'fs';

type Json = any;

// ─── Load probe pass counts ───
const probe = JSON.parse(fs.readFileSync('results/community/300/capability-probe-2026-07-02/graded-probe.json', 'utf8'));
const passCountByQid = new Map<string, { passes: number; samples: number; rate: number }>();
for (const row of probe.rows as Json[]) {
  const qid = row.questionId;
  if (!passCountByQid.has(qid)) passCountByQid.set(qid, { passes: 0, samples: 0, rate: 0 });
  const e = passCountByQid.get(qid)!;
  e.samples += 1;
  if (row.pass) e.passes += 1;
}
for (const e of passCountByQid.values()) e.rate = e.passes / e.samples;

// ─── The 35 non-AGI latent (39 latent minus 4 AGI excluded per Finn) ───
const latent35 = [
  'L10-006','L10-015','L10-017','L10-022','L10-024','L10-043','L10-046','L10-047',
  'L10-050','L10-055','L10-056','L3-001','L3-002','L3-003','L4-001','L5-003',
  'L6-001','L6-003','L7-003','L8-001','L9-005','L9-006','L9-007','L9-013',
  'L9-024','L9-027','L9-029','L9-031','L9-037','L9-040','L9-051','L9-053',
  'L9-055','L9-059','L9-064',
];

const qById = new Map<string, Json>();
for (const q of SCHEMA_QUESTIONS_300Q as Json[]) qById.set(String(q.id), q);

type Candidate = { id: string; tier: string; passes: number; samples: number; rate: number; band: string };
const candidates: Candidate[] = [];
for (const id of latent35) {
  const q = qById.get(id);
  const tier = q ? `L${q.level}` : '?';
  const e = passCountByQid.get(id) || { passes: 0, samples: 16, rate: 0 };
  let band = 'low'; // 1-4 / 16
  if (e.passes >= 10) band = 'high';
  else if (e.passes >= 5) band = 'mid';
  candidates.push({ id, tier, passes: e.passes, samples: e.samples, rate: e.rate, band });
}

// ─── Stratified selection: 8 held-out ───
// Target: 1-2 high-latent (≥10/16), 3-4 mid (5-9/16), 3-4 low (1-4/16); span L-tiers
// Sort within each band, pick to maximize tier diversity.
const byBand = (band: string) => candidates.filter(c => c.band === band).sort((a, b) => b.passes - a.passes);

const heldout: Candidate[] = [];
const usedTiers = new Set<string>();

// 2 high-latent, preferring different tiers
const high = byBand('high');
for (const c of high) {
  if (heldout.length >= 2) break;
  heldout.push(c); usedTiers.add(c.tier);
}
// If high has <2, we'll fill below
let midTarget = 3, lowTarget = 3;
if (heldout.length < 2) { midTarget += (2 - heldout.length); }

// 3-4 mid-latent, preferring unused tiers
const mid = byBand('mid');
for (const c of mid) {
  if (heldout.filter(h => h.band === 'mid').length >= midTarget) break;
  heldout.push(c); usedTiers.add(c.tier);
}
// 3-4 low-latent, preferring unused tiers
const low = byBand('low');
for (const c of low) {
  if (heldout.filter(h => h.band === 'low').length >= lowTarget) break;
  heldout.push(c); usedTiers.add(c.tier);
}
// top up to 8 if short (prefer remaining mid/low for tier diversity)
const heldoutIds = new Set(heldout.map(h => h.id));
for (const c of [...mid, ...low]) {
  if (heldout.length >= 8) break;
  if (heldoutIds.has(c.id)) continue;
  heldout.push(c); heldoutIds.add(c.id);
}

const holdoutIds = heldout.map(h => h.id);
const trainIds = latent35.filter(id => !holdoutIds.includes(id));

// ─── Verification ───
const overlap = holdoutIds.filter(id => trainIds.includes(id));
const holdoutTiers = [...new Set(heldout.map(h => h.tier))];
const holdoutBands = heldout.reduce((acc, h) => { acc[h.band] = (acc[h.band]||0)+1; return acc; }, {} as Record<string,number>);

// ─── The 98 quarantined AGI as second held-out set (Finn) ───
const manifestSubset = JSON.parse(fs.readFileSync('results/mutation-test-300q/grpo-verifiable-subset.json', 'utf8'));
const quarantinedAgi: string[] = manifestSubset.quarantined;

const split = {
  decision: 'path-b + Finn/MAML held-out (council 2026-07-03)',
  method: 'stratified by latent-strength band (high≥10/16, mid 5-9, low 1-4) + L-tier diversity',
  latentPool: { total: 35, source: '39 latent minus 4 AGI excluded (Finn)' },
  train: {
    count: trainIds.length,
    ids: trainIds,
    description: 'GRPO training prompts (from the verifiable 202, restricted to non-AGI latent with capability)',
  },
  holdout: {
    count: holdoutIds.length,
    ids: holdoutIds,
    tiers: holdoutTiers,
    bands: holdoutBands,
    description: 'item-disjoint held-out generalization probe (no training, measured for transfer)',
    detail: heldout.map(h => ({ id: h.id, tier: h.tier, passes: h.passes, band: h.band })),
  },
  secondHoldout: {
    description: 'Finn: the 98 quarantined AGI as unseen generalization probe (no reward, no disclosure)',
    count: quarantinedAgi.length,
    ids: quarantinedAgi,
  },
  verification: {
    overlapTrainHoldout: overlap.length, // must be 0
    holdoutSpansTiers: holdoutTiers.length,
    holdoutSpansBands: Object.keys(holdoutBands).length,
    allLatentAccounted: trainIds.length + holdoutIds.length === 35,
  },
};

fs.mkdirSync('results/grpo-preconditions', { recursive: true });
fs.writeFileSync('results/grpo-preconditions/grpo-holdout-split.json', JSON.stringify(split, null, 2));

console.log('=== GRPO held-out split (Step 3) ===');
console.log(`latent pool: 35 non-AGI latent`);
console.log(`train: ${trainIds.length} | holdout: ${holdoutIds.length}`);
console.log(`holdout tiers span: ${holdoutTiers.join(', ')} (${holdoutTiers.length} tiers)`);
console.log(`holdout bands: ${JSON.stringify(holdoutBands)}`);
console.log(`overlap train∩holdout: ${overlap.length} (must be 0)`);
console.log(`all 35 accounted: ${trainIds.length + holdoutIds.length === 35}`);
console.log(`second holdout (quarantined AGI, Finn): ${quarantinedAgi.length}`);
console.log('\nHOLDOUT DETAIL:');
for (const h of heldout) console.log(`  ${h.id} [${h.tier}] ${h.passes}/${h.samples} (${h.band})`);
console.log('\nTRAIN:');
console.log(`  ${trainIds.join(', ')}`);
console.log('\nwrote results/grpo-preconditions/grpo-holdout-split.json');
