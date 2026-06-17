# StockBench 300Q External Solvability Review Prompt

You are reviewing StockBench 300Q before it is frozen.

Repo path:

`/Users/bradleymiles/Documents/tradebench-questions-and-evaluation`

Goal: independently verify that each StockBench item is objectively solvable from the problem packet plus rubric, and that the tagged difficulty is reasonable.

Do not run paid model calls. This is an audit of the dataset, rubrics, and canonical answers.

## Files To Read

- `docs/stockbench-300q-plan_v2.md`
- `src/questions/stockbench-questions-300q.ts`
- `src/questions/stockbench-generated-questions.ts`
- `src/rubrics/stockbench-*.json`
- `scripts/prove-stockbench-solvability.ts`
- `docs/stockbench-solvability-proof-summary.md`
- `docs/stockbench-solvability-proofs.csv`
- `docs/stockbench-solvability-proofs.jsonl`

## Hash Contract

The Codex audit produced three hashes per row:

- `problem_rubric_hash`: SHA-256 of the canonicalized problem/rubric review packet, excluding `expected_values`, `context.canonical_answer`, and canonical solution blocks such as `_agi_canonical`.
- `solution_hash`: SHA-256 of the answer-side packet, including expected values, canonical answer, and validation/derivation metadata.
- `full_review_hash`: SHA-256 of the complete local question object plus complete rubric JSON.

Use `problem_rubric_hash` to confirm you reviewed the same problem/rubric packet. Use `full_review_hash` to confirm you reviewed the exact same complete local row.

Reproduce the proof ledger:

```bash
npx tsx scripts/prove-stockbench-solvability.ts
```

Expected current result:

- `status`: `ALL_300_VERIFIED`
- `questions`: `300`
- `verified`: `300`
- `errors`: `0`
- aggregate problem/rubric hash: `1a20f7c86afdc2ab5a36971b1c6c616e6ccd6d97f0b4a76ecaa048dd7009ebc0`
- aggregate full-review hash: `17e1b03bc6590101cc4ba6ae17c00d4ed1fb95108b0e83c9d9b7010997e0ac0e`

## Review Method

For each row:

1. Read the question prompt and non-answer context.
2. Read the rubric scoring contract.
3. Try to derive the canonical answer from the prompt and rubric alone.
4. Then compare against the canonical solution/derivation.
5. Mark whether the answer key is objectively traceable.
6. Independently rate observed difficulty and compare to the tagged tier.

This is an answer-key trace audit, not a blind benchmark run. You may look at the solution after trying to trace the problem/rubric.

## Verdict Definitions

- `VERIFIED`: prompt + rubric contain enough information to derive the canonical answer; no contradiction; local canonical answer is acceptable.
- `PARTIAL`: mostly solvable, but one field is under-specified, tolerance-dependent, or has more than one plausible interpretation.
- `ERROR`: canonical answer cannot be derived, contradicts the prompt/rubric, leaks into the prompt in a problematic way, or uses unstated data.
- `UNKNOWN`: insufficient local context to review.

Difficulty audit:

- Report `tier_tagged`.
- Report `tier_observed`.
- Flag any item with `abs(tier_tagged - tier_observed) > 1`.
- For `AGI`, use rank `11`.

## Required Output

Return:

1. A short summary verdict.
2. The aggregate hashes you reproduced.
3. Counts by answer-key verdict.
4. Counts by tagged tier and observed tier.
5. A table of every non-`VERIFIED` row, if any.
6. A table of every tier variance over `1`, if any.
7. Any rows where the question is repetitive, too template-like, too easy for its tag, or too ambiguous for strict pass@1.

Use this per-row schema for findings:

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

Be skeptical. The goal is not to defend the generated draft; the goal is to decide whether StockBench 300Q is actually ready to freeze.
