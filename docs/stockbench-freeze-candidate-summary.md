# StockBench 300Q Freeze-Candidate Audit

Status: FREEZE-CANDIDATE READY

This is an audit artifact for the first StockBench 300Q draft. No paid model calls were run.

## Counts

- Questions: 300
- Canonical grading failures: 0
- Metadata failures: 0
- Ambiguity/precondition failures: 0
- Duplicate/near-duplicate risk flags: 0
- Template diversity failures: 0
- Tier mismatch: false
- Domain mismatch: false
- Domain-by-difficulty matrix mismatch: false

## Tier Counts

```json
{
  "AGI": 110,
  "L1": 3,
  "L10": 69,
  "L2": 4,
  "L3": 3,
  "L4": 5,
  "L5": 5,
  "L6": 5,
  "L7": 5,
  "L8": 10,
  "L9": 81
}
```

## Domain Counts

```json
{
  "Corporate actions / settlement / calendar / jurisdiction": 20,
  "Execution / liquidity / microstructure": 35,
  "Feasibility / rejection / no-trade traps": 15,
  "Futures / commodities / spreads / rolls": 50,
  "Listed options strategy / Greeks": 55,
  "Portfolio risk / rebalancing": 40,
  "Shorting / borrow / margin / locates": 35,
  "Spot FX / CFDs / multi-currency": 30,
  "Spot equities / ETFs": 20
}
```

## Capability Counts

```json
{
  "execution_action_quality": 202,
  "judgment_risk_augmentation": 98
}
```

## Template Diversity

```json
{
  "L4": {
    "questions": 5,
    "distinctSkeletons": 2,
    "ratio": 0.4,
    "minRatio": 0
  },
  "L9": {
    "questions": 81,
    "distinctSkeletons": 46,
    "ratio": 0.568,
    "minRatio": 0.25
  },
  "AGI": {
    "questions": 110,
    "distinctSkeletons": 49,
    "ratio": 0.445,
    "minRatio": 0.3
  },
  "L1": {
    "questions": 3,
    "distinctSkeletons": 3,
    "ratio": 1,
    "minRatio": 0
  },
  "L2": {
    "questions": 4,
    "distinctSkeletons": 3,
    "ratio": 0.75,
    "minRatio": 0
  },
  "L3": {
    "questions": 3,
    "distinctSkeletons": 2,
    "ratio": 0.667,
    "minRatio": 0
  },
  "L5": {
    "questions": 5,
    "distinctSkeletons": 2,
    "ratio": 0.4,
    "minRatio": 0
  },
  "L6": {
    "questions": 5,
    "distinctSkeletons": 2,
    "ratio": 0.4,
    "minRatio": 0
  },
  "L7": {
    "questions": 5,
    "distinctSkeletons": 3,
    "ratio": 0.6,
    "minRatio": 0
  },
  "L8": {
    "questions": 10,
    "distinctSkeletons": 9,
    "ratio": 0.9,
    "minRatio": 0
  },
  "L10": {
    "questions": 69,
    "distinctSkeletons": 36,
    "ratio": 0.522,
    "minRatio": 0.3
  }
}
```

## Domain x Difficulty Matrix

```json
{
  "Shorting / borrow / margin / locates": {
    "L1-L4": 1,
    "L5-L8": 3,
    "L9": 8,
    "L10": 8,
    "AGI": 15
  },
  "Futures / commodities / spreads / rolls": {
    "L1-L4": 2,
    "L5-L8": 4,
    "L9": 14,
    "L10": 12,
    "AGI": 18
  },
  "Feasibility / rejection / no-trade traps": {
    "L1-L4": 0,
    "L5-L8": 0,
    "L9": 5,
    "L10": 4,
    "AGI": 6
  },
  "Spot equities / ETFs": {
    "L1-L4": 4,
    "L5-L8": 4,
    "L9": 5,
    "L10": 3,
    "AGI": 4
  },
  "Spot FX / CFDs / multi-currency": {
    "L1-L4": 2,
    "L5-L8": 3,
    "L9": 8,
    "L10": 6,
    "AGI": 11
  },
  "Execution / liquidity / microstructure": {
    "L1-L4": 2,
    "L5-L8": 3,
    "L9": 10,
    "L10": 8,
    "AGI": 12
  },
  "Corporate actions / settlement / calendar / jurisdiction": {
    "L1-L4": 1,
    "L5-L8": 2,
    "L9": 6,
    "L10": 5,
    "AGI": 6
  },
  "Portfolio risk / rebalancing": {
    "L1-L4": 1,
    "L5-L8": 2,
    "L9": 10,
    "L10": 10,
    "AGI": 17
  },
  "Listed options strategy / Greeks": {
    "L1-L4": 2,
    "L5-L8": 4,
    "L9": 15,
    "L10": 13,
    "AGI": 21
  }
}
```

## Validation Commands

```bash
npx tsx scripts/audit-stockbench-freeze-candidate.ts
npx tsx -e 'import { STOCKBENCH_QUESTIONS_300Q } from "./src/questions/stockbench-questions-300q"; import { loadRubric300q } from "./src/rubrics/loader-300q"; import { gradeSchemaResponse } from "./src/grading/schema-grader-300q"; let failures = 0; for (const q of STOCKBENCH_QUESTIONS_300Q) { const rubric = loadRubric300q(q.rubric_id); const raw = JSON.stringify({ ...q.expected_values, reasoning: "canonical derivation from frozen packet" }); const grade = gradeSchemaResponse(raw, q, rubric); if (!grade.pass) failures++; } console.log(`canonical_failures=${failures}`); if (failures) process.exit(1);'
npx tsc --noEmit --module ESNext --moduleResolution Bundler --target ES2022 --skipLibCheck src/questions/stockbench-questions-300q.ts src/questions/stockbench-generated-questions.ts scripts/generate-stockbench-first-draft.ts scripts/audit-stockbench-freeze-candidate.ts
```

## Remaining Risks

- This is a local deterministic audit, not a model smoke run.
- The generated supplement is intentionally systematic; it is locally valid and matrix-balanced, but should still receive human spot review before permanent freeze.
- No paid model evaluations have been run.
