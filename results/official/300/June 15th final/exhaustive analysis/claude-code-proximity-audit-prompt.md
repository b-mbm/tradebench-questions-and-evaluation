You are an independent, adversarial auditor for the CoinBench/TradeBench 300Q universal-fail proximity review.

Repo: `/Users/bradleymiles/Documents/tradebench-questions-and-evaluation`

Hard rule: no paid model calls. Review only. Do not modify benchmark questions, rubrics, raw model outputs, or final accounting unless explicitly asked.

Read these files first:

1. `results/official/300/June 15th final/exhaustive analysis/tradebench-300-matrix-methodology.md`
2. `results/official/300/June 15th final/exhaustive analysis/basic.txt`
3. `results/official/300/June 15th final/exhaustive analysis/intermediate-matrix.csv`
4. `results/official/300/June 15th final/exhaustive analysis/advanced.jsonl`
5. `results/official/300/June 15th final/exhaustive analysis/verifier-audit.md`
6. `results/official/300/June 15th final/exhaustive analysis/universal-fail-proximity-basic.csv`
7. `results/official/300/June 15th final/exhaustive analysis/universal-fail-proximity-intermediate.csv`
8. `results/official/300/June 15th final/exhaustive analysis/universal-fail-proximity-advanced.jsonl`
9. `results/official/300/June 15th final/exhaustive analysis/universal-fail-proximity-summary.md`

Context:

The authoritative 69-model matrix found 79 universal-fail rows:

- 4 non-AGI: `L5-001`, `L5-002`, `L7-001`, `L9-043`
- 75 AGI rows

Codex's current claim:

- The 4 non-AGI universal fails are likely verifier/problem artifacts, not clean model failures.
- `L9-043` likely has a prompt/canonical contradiction: prompt says bribes cost `$0 per ARB vote`, but canonical subtracts `$52,250` bribe cost.
- The 75 AGI universal fails are mostly genuinely hard, but some near-miss/close rows may be over-strict on exact categorical labels such as `intent`, `chosen_strategy`, and `self_check`.
- Proximity artifacts were generated from the same canonical final matrix that exactly matches the June 15 final pass totals.

Your task:

Independently audit the 79 universal-fail rows and challenge Codex's proximity classification.

For each row, answer:

1. Is the canonical answer derivable from the prompt + rubric?
2. Did any model answer get close to a valid answer, even if strict pass@1 rejected it?
3. Is the row a verifier artifact, prompt/canonical error, rubric synonym problem, over-strict categorical label problem, genuinely hard but fair, or too ambiguous to keep as-is?
4. For AGI rows: are models failing because the task is genuinely beyond them, or because the grader requires exact canonical route names / exact self-check wording / overly narrow intent labels?
5. What skill or failure mode does this row test if it is fair?

Required spot checks:

- Fully inspect all 4 non-AGI universal fails.
- Fully inspect every AGI row with best score `>= 0.68` in `universal-fail-proximity-intermediate.csv`.
- Fully inspect at least 10 AGI rows with best score between `0.60` and `0.68`.
- Fully inspect at least 10 AGI rows with best score `< 0.40` to ensure they are truly hard rather than impossible/buggy.
- Recompute proximity from `advanced.jsonl` for your inspected rows instead of trusting Codex's CSVs.

Return:

1. One-line verdict: `PROXIMITY_AUDIT_ACCEPTED`, `ACCEPTED_WITH_ROW_FIXES`, or `REJECT_CODEX_PROXIMITY_AUDIT`.
2. Counts by your row category:
   - verifier/problem artifact
   - answer-key/canonical error
   - over-strict categorical labels
   - close but fair fail
   - genuinely hard/fair
   - ambiguous/needs human decision
3. A table of every row where you disagree with Codex:
   `question_id | Codex status | your status | severity | evidence | recommended fix`
4. A table of rows you would repair or exclude before using failures for training.
5. A table of AGI rows that are good sibling-task seeds for V2 SFT/GRPO training.
6. Any systemic issue in the verifier or failure-map methodology.

Be blunt. The goal is not to protect the benchmark; the goal is to know whether the 79 universal fails are real capability failures or benchmark artifacts.
