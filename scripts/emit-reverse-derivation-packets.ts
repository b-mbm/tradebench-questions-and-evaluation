#!/usr/bin/env tsx
/**
 * Emit one self-contained audit packet per StockBench question for the reverse-derivation +
 * non-uniqueness audit. Each packet contains exactly what a solver sees (problem + output schema +
 * rubric scoring contract) PLUS the canonical answer and stated derivation, so an auditor can
 * judge: (a) is the canonical answer uniquely derivable from problem+rubric alone, and
 * (b) could a DIFFERENT answer also satisfy the rubric (non-uniqueness)?
 * No paid model calls.
 */
import fs from 'fs';
import path from 'path';
import { STOCKBENCH_QUESTIONS_300Q } from '../src/questions/stockbench-questions-300q';

const ROOT = process.cwd();
const RUBRIC_DIR = path.join(ROOT, 'src', 'rubrics');
const OUT = path.join(ROOT, 'docs', 'reverse-derivation', 'packets');
const RESULTS = path.join(ROOT, 'docs', 'reverse-derivation', 'results');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(RESULTS, { recursive: true });

function j(v: unknown): string { return JSON.stringify(v, null, 2); }

let n = 0;
for (const q of STOCKBENCH_QUESTIONS_300Q as any[]) {
  const rubric = JSON.parse(fs.readFileSync(path.join(RUBRIC_DIR, `${q.rubric_id}.json`), 'utf8'));
  const meta = q.context?.stockbench ?? {};
  const canonical = rubric._agi_canonical ?? rubric._l10_canonical ?? rubric._l9_canonical ?? {};
  const validation = canonical.validation ?? rubric.range_fields ?? {};
  const derivation = canonical.derivation ?? rubric.metadata?.canonical_derivation ?? '(none stated)';

  const md = `# Reverse-derivation audit packet — ${q.id}

tier: ${meta.tier}   primary_domain: ${meta.primary_domain}   scenario_family: ${meta.scenario_family}

## A. WHAT THE SOLVER SEES (problem + required output)

\`\`\`
${q.prompt}
\`\`\`

## B. RUBRIC SCORING CONTRACT (how the answer is graded)

- pass_threshold: ${rubric.pass_threshold}
- required_fields: ${j(rubric.required_fields)}
- critical_fields (must be exactly correct or the row fails): ${j(rubric.metadata?.critical_fields ?? [])}
- field validation specs (type/expected/tolerance/range/enum/expected_set):
\`\`\`json
${j(validation)}
\`\`\`
- failure_modes: ${j(rubric.metadata?.failure_modes ?? [])}
- must_not: ${j(rubric.metadata?.must_not ?? [])}

## C. CANONICAL ANSWER (the answer key — you MAY look at this)

\`\`\`json
${j(q.expected_values)}
\`\`\`

context.canonical_answer:
\`\`\`json
${j(q.context?.canonical_answer ?? null)}
\`\`\`

## D. STATED DERIVATION

${derivation}

## YOUR TASK

Looking ONLY at sections A and B (problem + rubric), and then checking against C/D:

1. DERIVABLE? Can the canonical answer be reached using only A+B — no outside/live data, no hidden
   convention not stated, no contradiction, every graded value forced by the packet? Verdict one of:
   VERIFIED | PARTIAL | ERROR.
   - PARTIAL = derivable but with a wrinkle (e.g. a needed convention/rounding rule not stated,
     a graded label the solver couldn't know to produce).
   - ERROR = canonical not derivable from A+B, or contradicts the packet, or arithmetic is wrong.
2. UNIQUE? Given the rubric's pass rule (tolerances/ranges/set-equality), is the canonical answer the
   ONLY answer that passes — or could a DIFFERENT, equally-valid answer also pass (e.g. two candidate
   routes tie on the objective; a second feasible value inside tolerance; ambiguous rounding)?
   Verdict one of: UNIQUE | NON_UNIQUE | UNSURE.
3. Recompute the arithmetic yourself; if it disagrees with C, that's an ERROR.
`;
  fs.writeFileSync(path.join(OUT, `${q.id}.md`), md);
  n++;
}
console.log(JSON.stringify({ packets: n, out: OUT, results: RESULTS }));
