# StockBench 300Q Solvability Proof Ledger

Status: ALL 300 VERIFIED

This proof ledger creates stable per-question hashes and a one-row-per-question solvability record. No paid model calls were run.

> NOTE ON SCOPE (read before trusting "ALL 300 VERIFIED"): this ledger grades each canonical
> answer against its own rubric, so it confirms rubric/answer COMPATIBILITY and produces stable
> review hashes — it does NOT independently prove difficulty or that wrong answers fail. The real
> correctness gate is `scripts/mutation-test-stockbench.ts` (canonical passes AND wrong
> strategy/instrument/number/missing-critical/invalid-route all fail), and answer-leakage /
> diversity / family-content are checked by `scripts/stockbench-quality-gate.ts`. Freeze also
> requires a model smoke run. Treat this ledger as a consistency linter, not a freeze proof.

## Hash Contract

- `problem_rubric_hash`: SHA-256 of a canonical JSON packet containing the question prompt/context and rubric scoring contract, excluding `expected_values`, `context.canonical_answer`, and canonical solution blocks such as `_agi_canonical`.
- `solution_hash`: SHA-256 of the answer-side packet: `expected_values`, `context.canonical_answer`, and canonical validation/derivation metadata.
- `full_review_hash`: SHA-256 of the complete local question object plus complete rubric JSON.

Use `problem_rubric_hash` when asking another agent to independently solve from the problem and rubric. Use `full_review_hash` when checking that two agents reviewed the exact same local row.

## Results

- Questions reviewed: 300
- Verified rows: 300
- Error rows: 0
- Aggregate problem/rubric hash: `6688f45ca0dbfe6c2f5f65cb01a796e5ec004bea6d86d659c1757f1ffe071cf1`
- Aggregate full-review hash: `984e1f8616f695b6835b123148c681b0d10704f2dd519e1b1c7c08528756cf69`

## Verdict Counts

```json
{
  "VERIFIED": 300
}
```

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

## Observed Tier Counts

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

## Output Files

- `docs/stockbench-solvability-proofs.jsonl`: full proof ledger with derivations.
- `docs/stockbench-solvability-proofs.csv`: compact review index for spreadsheet comparison.
- `docs/stockbench-solvability-proof-summary.md`: this summary.

## Reproduce

```bash
npx tsx scripts/prove-stockbench-solvability.ts
```

