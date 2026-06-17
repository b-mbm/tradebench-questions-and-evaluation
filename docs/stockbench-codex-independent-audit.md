# StockBench 300Q Codex Independent Audit

Date: 2026-06-16

Status: PASS AS FREEZE CANDIDATE

No paid model calls were run.

## Scope

I audited the StockBench 300Q freeze candidate after the first generated draft was produced. The audit checked whether each question is solvable from the prompt/context/rubric alone, whether canonical answers are derivable, and whether tagged difficulty is directionally credible.

Because 270 of 300 questions are generated from templates, I audited the generator templates and parameterization, then regenerated and validated all 300 rows. The 30 handcrafted anchors remain in `src/questions/stockbench-questions-300q.ts`; the generated supplement lives in `src/questions/stockbench-generated-questions.ts`.

## Problems Found Before Repair

The first generated draft was not acceptable. I found:

- Generated prompts leaked answer values in `Output JSON fields` by embedding the whole `expected_values` object.
- Some generated prompts contained `Objective: undefined`.
- Low-tier generated rows could be too complex for their tier, for example options spreads appearing as L1/L2-style items.
- One execution template had a denominator bug that produced impossible average prices.
- Generated AGI rows were too simple and looked like L9 option-spread calculations rather than AGI strategy synthesis.

## Repairs Made

- Changed generated prompts to list output field names only, not answer values.
- Added tier-aware L1-L4 templates for extraction, direct arithmetic, multi-step arithmetic, and time/rate calculations.
- Added tier-aware L5-L8 templates for schema mapping, sequencing, multi-field synthesis, and route choice.
- Fixed the execution-template fill denominator.
- Added explicit L10 generated templates with multi-route risk-reduction, cost, margin, and product-permission constraints.
- Added explicit AGI generated templates with route selection, risk-reduction thresholds, cash/margin/permission constraints, scenario PnL, rejected invalid routes, worst-case PnL, and self-check fields.
- Regenerated the 270 generated questions and their rubrics.

## Current Verification Results

Live local checks after repair:

```bash
npx tsx scripts/audit-stockbench-freeze-candidate.ts
```

Result:

```json
{
  "freezeReady": true,
  "questions": 300,
  "canonicalFailures": 0,
  "metadataFailures": 0,
  "ambiguityFailures": 0,
  "duplicateRisk": 0,
  "tierMismatch": false,
  "domainMismatch": false,
  "matrixMismatch": false
}
```

Canonical grading:

```bash
npx tsx -e 'import { STOCKBENCH_QUESTIONS_300Q } from "./src/questions/stockbench-questions-300q"; import { loadRubric300q } from "./src/rubrics/loader-300q"; import { gradeSchemaResponse } from "./src/grading/schema-grader-300q"; let failures=0; for (const q of STOCKBENCH_QUESTIONS_300Q) { const rubric=loadRubric300q(q.rubric_id); const raw=JSON.stringify({ ...q.expected_values, reasoning: "canonical derivation from frozen packet" }); const grade=gradeSchemaResponse(raw,q,rubric); if (!grade.pass) failures++; } console.log(`canonical_failures=${failures}`); if (failures) process.exit(1);'
```

Result:

```text
canonical_failures=0
```

TypeScript check:

```bash
npx tsc --noEmit --module ESNext --moduleResolution Bundler --target ES2022 --skipLibCheck src/questions/stockbench-questions-300q.ts src/questions/stockbench-generated-questions.ts scripts/generate-stockbench-first-draft.ts scripts/audit-stockbench-freeze-candidate.ts
```

Result: passed.

Leak checks:

- No `undefined` prompt fragments remain.
- Generated output-field prompts no longer include answer-valued JSON.
- All AGI rows include `self_check`.

## Final Counts

Tier counts match the hard CoinBench distribution:

```json
{"L1":3,"L2":4,"L3":3,"L4":5,"L5":5,"L6":5,"L7":5,"L8":10,"L9":81,"L10":69,"AGI":110}
```

Domain counts:

```json
{
  "Spot equities / ETFs": 20,
  "Shorting / borrow / margin / locates": 35,
  "Listed options strategy / Greeks": 55,
  "Futures / commodities / spreads / rolls": 50,
  "Spot FX / CFDs / multi-currency": 30,
  "Portfolio risk / rebalancing": 40,
  "Execution / liquidity / microstructure": 35,
  "Corporate actions / settlement / calendar / jurisdiction": 20,
  "Feasibility / rejection / no-trade traps": 15
}
```

Capability counts:

```json
{"execution_action_quality":202,"judgment_risk_augmentation":98}
```

## Solvability Verdict

PASS.

After repair, I believe all 300 questions are solvable from the prompt/context/rubric alone, without live market data or hidden backend state.

For the generated supplement, this verdict is based on template-level derivation plus all-row parameter validation. The generated rows are systematic but now avoid answer leakage and include enough frozen facts for the canonical answer.

## Difficulty Verdict

PASS AS FREEZE CANDIDATE.

- L1-L4 generated rows are now tier-aware and simple.
- L5-L8 generated rows are schema/procedure/synthesis/conditional-route tasks.
- L9 rows are multi-intent or constraint-driven tasks.
- L10 rows are multi-route constraint-composition tasks.
- AGI rows include strategy selection, feasibility filtering, scenario PnL, worst-case PnL, and self-checks.

The generated L10/AGI rows are still more systematic than handcrafted questions. That is acceptable for a freeze candidate, but external reviewers should spot-check whether the repeated template style is acceptable for the final benchmark.

## Remaining Risks

- No real model smoke run has been performed.
- The 270 generated questions are template-derived, so they are cleaner than fully handcrafted questions but less varied.
- External reviewers should independently audit a mix of anchors and generated rows, especially L9/L10/AGI.

