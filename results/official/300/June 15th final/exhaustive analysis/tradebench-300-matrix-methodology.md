# TradeBench 300 Result Matrix Methodology

This documents the accounting method used by
`scripts/build-tradebench-300-result-matrices.ts`.

## Goal

Rebuild the official June 15 N=1 300Q pass/fail matrix:

- 69 official models
- 300 question columns
- one canonical final answer per `(model, question)`
- row totals must exactly match
  `results/official/300/June 15th final/June 15th final numbers.json`

If row totals do not match that file, the matrix is wrong.

## Source Of Truth

The source of truth for model membership and final pass totals is:

`results/official/300/June 15th final/June 15th final numbers.json`

The source of truth for question order and tiers is:

`src/questions/schema-questions-300q.ts`

The source of truth for rubrics is:

`src/rubrics/*.json`, loaded by `loadRubric300q`.

## Accounting Model

Do not use naive "best pass anywhere". That overcounts because the repo contains
N2/N3 reruns, smoke tests, repair attempts, and partial exploratory runs.

Do not use naive "latest row wins" either. That undercounts or miscounts because
some final June 15 values came from approved clean repair overlays rather than
from the last raw row in the filesystem.

Use this model:

1. Read only official evidence families:
   - `results/parallel-level*-working/scores.jsonl`
   - `results/community/300/*.json`
   - `results/repair-checkpoints/*.jsonl`
   - `results/local-qwen35-q6k-300/*`
   - GLM 5.2 official/archive result folders
2. Exclude non-final attempts:
   - N2/N3 paths
   - `rep2`, `rep3`
   - smoke runs
   - old official submit/GPT artifacts
3. Parse every result row into a candidate:
   - `model`
   - `questionId`
   - `pass`
   - `score`
   - `confidence`
   - `grade.failureReasons`
   - `grade.normalizedResponse`
   - source file
   - timestamp
4. Pick a baseline candidate per cell by source priority, then timestamp:
   - final archive files
   - full Qwen open-weight N1 streaming checkpoint
   - community N1 result files
   - GLM 5.2 raw folder
   - local Qwen folder
   - original parallel-level working files
5. Overlay successful repair passes only where:
   - the baseline selected cell is still failing, and
   - the model's row total is below the June 15 final target, and
   - the passing row came from a repair/backfill/final-candidate source.
6. Stop as soon as the model reaches the June 15 final total.
7. Hard-validate every model row sum against the June 15 final JSON.

This is intentionally validation-bound: repair overlays are allowed only to
reconcile to the official final table, never to inflate beyond it.

## Why Claude Code Could Not Replicate It Naively

The repo has multiple valid-looking rows per `(model, question)`:

- original N1 rows
- N2/N3 rows
- dirty failed repairs
- clean successful repairs
- final-candidate/backfill rows
- local model rows
- later GLM 5.2 archive rows

Several simple rules are wrong:

- `best pass anywhere` overcounts.
- `latest row wins` can undercount or select a dirty repair failure after a
  previously accepted clean answer.
- including N2/N3 rows corrupts N=1 pass@1 accounting.
- excluding paths with a bare `n3` substring also corrupts local qwen35 names.

The hard validation row sums are the guardrail.

## Deliverables

Running:

```bash
npx tsx scripts/build-tradebench-300-result-matrices.ts
```

writes:

- `results/official/300/June 15th final/exhaustive analysis/intermediate-matrix.csv`
  - 69 model rows
  - 300 question columns
  - cells are `1` or `0`
  - includes tier row and per-question pass-count row
- `results/official/300/June 15th final/exhaustive analysis/advanced.jsonl`
  - 300 rubric records
  - 20,700 model-question cell records
  - includes normalized answer, pass, score, confidence, failure reasons, source
- `results/official/300/June 15th final/exhaustive analysis/basic.txt`
  - universal-fail question list
  - tier breakdown

Current verified result:

- 69 models
- 300 questions
- 20,700 cells
- 79 universal-fail questions
- non-AGI universal fails:
  - `L5-001`
  - `L5-002`
  - `L7-001`
  - `L9-043`

`L4-003` is not universal-fail in the authoritative matrix; it has 2 passes.
