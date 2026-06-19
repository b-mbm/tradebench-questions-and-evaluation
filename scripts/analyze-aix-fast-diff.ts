import fs from 'fs';
import path from 'path';
import { SCHEMA_QUESTIONS_300Q } from '../src/questions/schema-questions-300q';

type EvalRow = {
  questionId: string;
  raw: string;
  grade: {
    pass: boolean;
    score: number;
    failureReasons?: string[];
    normalizedResponse?: unknown;
  };
};

const ROOT = process.cwd();
const BASE_FILE = path.join(ROOT, 'results/community/300/base-together-9b-300-clean-2026-06-19.json');
const TUNED_FILE = path.join(ROOT, 'results/community/300/aix-fast-sft1500-300-2026-06-19T17-47-20-697Z.json');
const OUT_MD = path.join(ROOT, 'Internal_docs/aix_fast_sft1500_item_diff_analysis_2026-06-19.md');
const OUT_JSON = path.join(ROOT, 'Internal_docs/aix_fast_sft1500_item_diff_analysis_2026-06-19.json');
const RUBRIC_DIR = path.join(ROOT, 'src/rubrics');

function readRun(file: string) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const byId = new Map<string, EvalRow>();
  for (const row of data.evaluations as EvalRow[]) byId.set(row.questionId, row);
  return { data, byId };
}

function tierOf(id: string) {
  if (id.startsWith('AGI-')) return 'AGI';
  const m = id.match(/^L(\d+)-/);
  return m ? `L${m[1]}` : 'UNKNOWN';
}

function bucketOf(tier: string) {
  if (tier === 'AGI') return 'AGI';
  const n = Number(tier.slice(1));
  if (n <= 8) return 'L1-L8';
  return tier;
}

function inc(map: Record<string, number>, key: string, amount = 1) {
  map[key] = (map[key] ?? 0) + amount;
}

function reasons(row: EvalRow) {
  return row.grade.failureReasons ?? [];
}

function reasonGroup(reason: string) {
  if (reason === 'missing_field') return 'missing_field';
  if (reason === 'mismatch_fieldname') return 'field_name_mismatch';
  if (reason.includes('expected_value') || reason.includes('out_of_range')) return 'numeric_exactness';
  if (reason.includes('intent') || reason.includes('chosen_strategy') || reason.includes('execution_sequence')) return 'task_schema_or_strategy';
  if (reason.includes('self_check')) return 'self_check';
  if (reason.includes('venue_fills') || reason.includes('route') || reason.includes('venue')) return 'venue_or_route';
  if (reason.startsWith('agi_validation_failed:')) return 'agi_field_exactness';
  return reason;
}

function summarizeReasons(rows: EvalRow[]) {
  const exact: Record<string, number> = {};
  const grouped: Record<string, number> = {};
  for (const row of rows) {
    for (const reason of reasons(row)) {
      inc(exact, reason);
      inc(grouped, reasonGroup(reason));
    }
  }
  return {
    grouped: Object.entries(grouped).sort((a, b) => b[1] - a[1]),
    exactTop: Object.entries(exact).sort((a, b) => b[1] - a[1]).slice(0, 25),
  };
}

function mdTable(headers: string[], rows: (string | number)[][]) {
  const esc = (v: string | number) => String(v).replace(/\|/g, '\\|').replace(/\n/g, '<br>');
  return [
    `| ${headers.map(esc).join(' |')} |`,
    `| ${headers.map(() => '---').join(' |')} |`,
    ...rows.map(row => `| ${row.map(esc).join(' |')} |`),
  ].join('\n');
}

function short(text: string, n = 700) {
  return text.length > n ? `${text.slice(0, n)}...` : text;
}

function loadRubricCanonical(rubricId: string) {
  const rubricPath = path.join(RUBRIC_DIR, `${rubricId}.json`);
  if (!fs.existsSync(rubricPath)) return null;
  const rubric = JSON.parse(fs.readFileSync(rubricPath, 'utf8'));
  return rubric._agi_canonical ?? rubric._l10_canonical ?? rubric._l9_canonical ?? {
    required_fields: rubric.required_fields ?? null,
    range_fields: rubric.range_fields ?? null,
  };
}

const base = readRun(BASE_FILE);
const tuned = readRun(TUNED_FILE);
const questionById = new Map(SCHEMA_QUESTIONS_300Q.map(q => [q.id, q]));

const rows = [...questionById.keys()].sort((a, b) => {
  const ta = tierOf(a), tb = tierOf(b);
  if (ta !== tb) return ta.localeCompare(tb, undefined, { numeric: true });
  return a.localeCompare(b);
}).map(id => {
  const b = base.byId.get(id);
  const t = tuned.byId.get(id);
  if (!b || !t) throw new Error(`missing eval row for ${id}`);
  const q = questionById.get(id)!;
  let outcome = 'bothFail';
  if (b.grade.pass && t.grade.pass) outcome = 'bothPass';
  else if (!b.grade.pass && t.grade.pass) outcome = 'tunedOnly';
  else if (b.grade.pass && !t.grade.pass) outcome = 'baseOnly';
  return {
    id,
    tier: tierOf(id),
    bucket: bucketOf(tierOf(id)),
    rubric_id: q.rubric_id,
    level: q.level,
    prompt: q.prompt,
    outcome,
    base_pass: b.grade.pass,
    tuned_pass: t.grade.pass,
    base_score: b.grade.score,
    tuned_score: t.grade.score,
    delta: t.grade.score - b.grade.score,
    base_failures: reasons(b),
    tuned_failures: reasons(t),
    base_raw: b.raw,
    tuned_raw: t.raw,
    expected_values: q.expected_values,
    rubric_canonical: loadRubricCanonical(q.rubric_id),
  };
});

const outcomeCounts: Record<string, number> = {};
const byTier: Record<string, Record<string, number>> = {};
const byRubricOutcome: Record<string, Record<string, number>> = {};
for (const row of rows) {
  inc(outcomeCounts, row.outcome);
  byTier[row.tier] ??= {};
  inc(byTier[row.tier], row.outcome);
  byRubricOutcome[row.rubric_id] ??= {};
  inc(byRubricOutcome[row.rubric_id], row.outcome);
}

const tunedOnly = rows.filter(r => r.outcome === 'tunedOnly');
const baseOnly = rows.filter(r => r.outcome === 'baseOnly');
const bothFail = rows.filter(r => r.outcome === 'bothFail');
const bothPass = rows.filter(r => r.outcome === 'bothPass');

const baseFailureSummary = summarizeReasons(rows.map(r => base.byId.get(r.id)!));
const tunedFailureSummary = summarizeReasons(rows.map(r => tuned.byId.get(r.id)!));
const baseOnlyFailureSummary = summarizeReasons(baseOnly.map(r => tuned.byId.get(r.id)!));
const tunedOnlyPriorFailureSummary = summarizeReasons(tunedOnly.map(r => base.byId.get(r.id)!));

const rubricFlipRows = Object.entries(byRubricOutcome)
  .map(([rubric, counts]) => ({
    rubric,
    tunedOnly: counts.tunedOnly ?? 0,
    baseOnly: counts.baseOnly ?? 0,
    bothPass: counts.bothPass ?? 0,
    bothFail: counts.bothFail ?? 0,
    total: Object.values(counts).reduce((a, b) => a + b, 0),
  }))
  .filter(r => r.tunedOnly || r.baseOnly)
  .sort((a, b) => (b.tunedOnly + b.baseOnly) - (a.tunedOnly + a.baseOnly) || b.tunedOnly - a.tunedOnly);

const representativeIds = [
  'AGI-030', 'AGI-058', 'AGI-063', 'AGI-065', 'AGI-083',
  'L9-001', 'L9-024', 'L9-077',
  'L10-001', 'L10-006', 'L10-060',
  'L8-002', 'L4-001',
].filter(id => questionById.has(id));

const artifact = {
  files: { base: BASE_FILE, tuned: TUNED_FILE },
  outcomeCounts,
  byTier,
  byRubricOutcome: rubricFlipRows,
  failureSummaries: {
    baseAll: baseFailureSummary,
    tunedAll: tunedFailureSummary,
    tunedOnly_baseFailureReasons: tunedOnlyPriorFailureSummary,
    baseOnly_tunedFailureReasons: baseOnlyFailureSummary,
  },
  lists: {
    tunedOnly: tunedOnly.map(r => r.id),
    baseOnly: baseOnly.map(r => r.id),
    bothPass: bothPass.map(r => r.id),
    bothFail: bothFail.map(r => r.id),
  },
  representatives: representativeIds.map(id => rows.find(r => r.id === id)),
};

fs.writeFileSync(OUT_JSON, `${JSON.stringify(artifact, null, 2)}\n`);

const tierRows = Object.keys(byTier)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .map(tier => [tier, byTier[tier].bothPass ?? 0, byTier[tier].tunedOnly ?? 0, byTier[tier].baseOnly ?? 0, byTier[tier].bothFail ?? 0, Object.values(byTier[tier]).reduce((a, b) => a + b, 0)]);

const rubricRows = rubricFlipRows.slice(0, 20)
  .map(r => [r.rubric, r.tunedOnly, r.baseOnly, r.bothPass, r.bothFail, r.total]);

const md = `# AIX-fast SFT1500 vs Together Base 9B Item Diff

Generated: ${new Date().toISOString()}

Base file: \`${path.relative(ROOT, BASE_FILE)}\`

Tuned file: \`${path.relative(ROOT, TUNED_FILE)}\`

## Headline

Both models scored **124/300**, but they did not pass the same items.

- Both pass: **${outcomeCounts.bothPass ?? 0}**
- Tuned-only wins: **${outcomeCounts.tunedOnly ?? 0}**
- Base-only regressions: **${outcomeCounts.baseOnly ?? 0}**
- Both fail: **${outcomeCounts.bothFail ?? 0}**

Interpretation: this SFT changed behavior but did not create a net capability jump. It strongly reduced missing-field failures, while adding exactness and strategy regressions elsewhere.

## Flip Matrix By Tier

${mdTable(['Tier', 'Both pass', 'Tuned only', 'Base only', 'Both fail', 'Total'], tierRows)}

## Flip-Heavy Rubrics

${mdTable(['Rubric', 'Tuned only', 'Base only', 'Both pass', 'Both fail', 'Total'], rubricRows)}

## Failure Reason Shift

### Base, All Failures

${mdTable(['Grouped reason', 'Count'], baseFailureSummary.grouped.slice(0, 12))}

### Tuned, All Failures

${mdTable(['Grouped reason', 'Count'], tunedFailureSummary.grouped.slice(0, 12))}

### What Tuned Fixed

These are base failure reasons on rows that tuned passed.

${mdTable(['Base failure reason before tuned win', 'Count'], tunedOnlyPriorFailureSummary.grouped)}

### What Tuned Broke

These are tuned failure reasons on rows that base passed.

${mdTable(['Tuned failure reason after regression', 'Count'], baseOnlyFailureSummary.grouped)}

## Item Lists

Tuned-only wins:

\`${tunedOnly.map(r => r.id).join('`, `')}\`

Base-only regressions:

\`${baseOnly.map(r => r.id).join('`, `')}\`

## Representative Rows

${representativeIds.map(id => {
  const r = rows.find(row => row.id === id)!;
  return `### ${id} (${r.outcome}, ${r.rubric_id})

Prompt: ${short(r.prompt, 500)}

Expected values:

\`\`\`json
${JSON.stringify(r.expected_values, null, 2)}
\`\`\`

Rubric canonical / validation:

\`\`\`json
${JSON.stringify(r.rubric_canonical, null, 2)}
\`\`\`

Base: pass=${r.base_pass}, score=${r.base_score.toFixed(3)}, failures=${r.base_failures.join('|') || '(none)'}

\`\`\`json
${short(r.base_raw, 900)}
\`\`\`

Tuned: pass=${r.tuned_pass}, score=${r.tuned_score.toFixed(3)}, failures=${r.tuned_failures.join('|') || '(none)'}

\`\`\`json
${short(r.tuned_raw, 900)}
\`\`\`
`;
}).join('\n')}

## Training Implications

1. The tuned model learned format/task-family behavior: missing-field failures fell from 114 to 11 across all graded failures.
2. The tuned model did not learn enough precise hard-tier arithmetic or field exactness: numeric exactness and field-name mismatch failures increased in key flipped rows.
3. The 32 base-only rows are regression guards. A next SFT recipe should include sibling tasks for these failure modes and reject any checkpoint that loses them.
4. The 32 tuned-only rows show useful behavior worth preserving, especially L9 and AGI task-family recognition.
5. The 144 both-fail rows are the real capability-growth pool; training should target these with sibling examples rather than reusing eval items.
6. A full 27B SFT run should wait until this taxonomy informs the next data recipe. A small 27B smoke/export path is fine, but a full training spend before fixing regressions is premature.
7. GRPO/RL is attractive only after the verifier/reward catches the exact regressions found here. Otherwise RL will optimize grader loopholes or reinforce brittle schema tricks.
`;

fs.writeFileSync(OUT_MD, md);

console.log(JSON.stringify({
  wrote: [OUT_MD, OUT_JSON],
  outcomeCounts,
  byTier,
}, null, 2));
