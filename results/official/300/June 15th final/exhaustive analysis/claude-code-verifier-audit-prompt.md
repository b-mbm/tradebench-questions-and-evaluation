You are doing an independent verifier audit of TradeBench/CoinBench 300Q, focused on the authoritative 69-model June 15 final matrix.

Repo:
`/Users/bradleymiles/Documents/tradebench-questions-and-evaluation`

Read first:

1. `results/official/300/June 15th final/exhaustive analysis/tradebench-300-matrix-methodology.md`
2. `results/official/300/June 15th final/exhaustive analysis/basic.txt`
3. `results/official/300/June 15th final/exhaustive analysis/verifier-audit.md`
4. `src/questions/schema-questions-300q.ts`
5. relevant rubrics in `src/rubrics/`
6. relevant custom validation in `src/grading/schema-grader-300q.ts`

Do not run paid model calls. This is static audit only.

Goal:

Decide whether universal-fail questions are real model failures or verifier/question artifacts.

Important context:

- The authoritative matrix has 69 models x 300 questions.
- `intermediate-matrix.csv` row totals exactly match `June 15th final numbers.json`.
- Universal-fail set is 79 questions:
  - L5: 2
  - L7: 1
  - L9: 1
  - AGI: 75
- Non-AGI universal fails are: `L5-001`, `L5-002`, `L7-001`, `L9-043`.
- `L4-003` is not universal-fail; it has 2 passes.

Tasks:

1. Reproduce or inspect the matrix enough to trust the universal-fail list.
2. For `L5-001`, `L5-002`, `L7-001`, and `L9-043`, inspect prompt + rubric + custom grader logic + recorded model answers/failure reasons in `advanced.jsonl`.
3. Decide whether each is VERIFIED hard, PARTIAL/rubric-too-strict, ERROR, or UNKNOWN.
4. For the 75 AGI universal fails, do a targeted verifier audit:
   - sample at least 15 rows across different AGI families,
   - inspect prompt, canonical derivation, validation fields, and recorded failure reasons,
   - decide whether `intent`, `chosen_strategy`, and `self_check` exact-label grading is fair or too narrow.
5. Flag any row where the canonical answer cannot be derived from the prompt alone.
6. Flag any row where strict pass@1 would reject a materially correct answer.

Return:

- One-line verdict: verifier mostly sound / verifier sound with fixes / verifier not sound.
- Table of problem rows: ID | issue | severity | recommended fix.
- Whether you agree with these current findings:
  - `L5-001` rubric too narrow/threshold issue.
  - `L5-002` custom validator too narrow for Aave loop synonyms.
  - `L7-001` prompt/rubric mismatch: generic meta-question expected but prompt permits concrete analysis.
  - `L9-043` prompt-canonical contradiction around bribe cost.
- AGI section: are the 75 AGI universal fails genuinely hard, or are many verifier artifacts?
- Final recommendation for V2 training data: which universal-fail rows to exclude, repair, or use as sibling-task seeds.

Be adversarial. Do not rubber-stamp Codex's verifier audit.
