# StockBench 300Q External Review Metaprompt

You are an independent reviewer for StockBench 300Q, a traditional-markets trading-intelligence benchmark. Your job is to verify benchmark hygiene before the dataset is frozen.

Be skeptical. Do not defend the draft. Find ambiguity, answer-key errors, hidden assumptions, difficulty drift, rubric weakness, answer leakage, repeated templates, or anything that would make strict pass@1 results less credible.

Do not run paid model calls.

## Files Provided

Required:

- `docs/stockbench-300q-plan_v2.md`
- `docs/difficulty-levels.md`
- `src/questions/stockbench-questions-300q.ts`
- `src/questions/stockbench-generated-questions.ts`
- all `src/rubrics/stockbench-*.json`
- `docs/stockbench-solvability-proof-summary.md`
- `docs/stockbench-solvability-proofs.csv`
- `docs/stockbench-solvability-proofs.jsonl`
- `docs/stockbench-solvability-external-review-prompt.md`

Useful if you can run code:

- `scripts/prove-stockbench-solvability.ts`
- `scripts/audit-stockbench-freeze-candidate.ts`
- `src/grading/schema-grader-300q.ts`
- `src/rubrics/loader-300q.ts`
- `src/types/schema.ts`
- `package.json`

Optional context:

- `docs/stockbench-coverage-matrix.md`
- `docs/stockbench-300q-audit.csv`
- `docs/stockbench-freeze-candidate-summary.md`
- `docs/stockbench-codex-independent-audit.md`

## Current Codex Proof Claim

Codex generated a per-question proof ledger and reports:

- `status`: `ALL_300_VERIFIED`
- `questions`: `300`
- `verified`: `300`
- `errors`: `0`
- aggregate problem/rubric hash: `1a20f7c86afdc2ab5a36971b1c6c616e6ccd6d97f0b4a76ecaa048dd7009ebc0`
- aggregate full-review hash: `17e1b03bc6590101cc4ba6ae17c00d4ed1fb95108b0e83c9d9b7010997e0ac0e`

If you can run commands, reproduce this first:

```bash
npx tsx scripts/prove-stockbench-solvability.ts
```

## Hash Contract

The proof ledger has three hashes per row:

- `problem_rubric_hash`: SHA-256 of the canonicalized problem/rubric review packet, excluding `expected_values`, `context.canonical_answer`, and canonical solution blocks such as `_agi_canonical`.
- `solution_hash`: SHA-256 of the answer-side packet, including expected values, canonical answer, and validation/derivation metadata.
- `full_review_hash`: SHA-256 of the complete local question object plus complete rubric JSON.

Use `problem_rubric_hash` to confirm you reviewed the same problem/rubric packet. Use `full_review_hash` to confirm you reviewed the exact same complete row.

## Review Task 1: Solvability / Answer-Key Trace

For each of the 300 rows:

1. Read the question prompt and non-answer context.
2. Read the rubric scoring contract.
3. Try to derive the canonical answer from the prompt and rubric alone.
4. Only then compare against the canonical solution/derivation.
5. Mark whether the answer key is objectively traceable.

This is an answer-key trace audit, not a blind benchmark run. You may look at the solution after trying to trace the problem/rubric.

Verdicts:

- `VERIFIED`: prompt + rubric contain enough information to derive the canonical answer; no contradiction; local canonical answer is acceptable.
- `PARTIAL`: mostly solvable, but one field is under-specified, tolerance-dependent, or has more than one plausible interpretation.
- `ERROR`: canonical answer cannot be derived, contradicts the prompt/rubric, leaks into the prompt in a problematic way, or uses unstated data.
- `UNKNOWN`: insufficient local context to review.

## Review Task 2: Difficulty-Tier Audit

Use `docs/difficulty-levels.md`.

For each row:

1. Record `tier_tagged`.
2. Assign your own `tier_observed`.
3. Compute `tier_variance = abs(tier_tagged - tier_observed)`.
4. Use rank `11` for `AGI`.
5. Flag every row where `tier_variance > 1`.

Difficulty scale summary:

- `L1`: literal extraction of one simple field.
- `L2`: one clear calculation.
- `L3`: multi-variable math with correct order of operations.
- `L4`: context plus time/rate/temporal conversion.
- `L5`: schema mapping.
- `L6`: sequence, schedule, or rule following.
- `L7`: multi-field synthesis.
- `L8`: conditional decision among alternatives.
- `L9`: multi-intent fusion with numeric reasoning plus constraints.
- `L10`: composition of several market mechanisms into a nested plan.
- `AGI`: autonomous strategy synthesis with action selection, constraint checks, and self-check.

## Review Task 3: Strict Benchmark Quality

Also flag:

- answer leakage in the prompt
- hidden live-data dependency
- missing contract specs, multipliers, settlement calendars, FX rates, borrow/locate assumptions, margin assumptions, or jurisdiction assumptions
- multiple equally valid answers when the objective function claims uniqueness
- overly broad rubric that would pass a wrong answer
- overly narrow rubric that would fail a valid answer
- repetitive generated templates that weaken benchmark diversity
- rows that are too easy or too hard for their tagged tier

## Required Output

Return:

1. Short summary verdict: freeze-ready, freeze-ready with caveats, or not ready.
2. Aggregate hashes you reproduced or reviewed.
3. Counts by answer-key verdict.
4. Counts by tagged tier and observed tier.
5. A table of every non-`VERIFIED` row.
6. A table of every row with `tier_variance > 1`.
7. A concise list of systemic concerns, even if all rows are individually solvable.

Use this schema for each finding:

```json
{
  "id": "SB-L9-001",
  "problem_rubric_hash": "...",
  "full_review_hash": "...",
  "answer_key_verdict": "VERIFIED | PARTIAL | ERROR | UNKNOWN",
  "tier_tagged": "L9",
  "tier_observed": "L9",
  "tier_variance": 0,
  "notes": "..."
}
```

Be blunt. The goal is to decide whether StockBench 300Q is trustworthy enough to freeze.
