# OpenRouter Mistral Family 300Q N1/N2/N3 Threshold-AGI Comparison

Generated from saved raw model answers and regraded with the current local `schema-grader-300q.ts`.

## Important Interpretation

- This is not a 900-question benchmark.
- Each model answered the same 300 questions three independent times.
- `combined_pass_rows` is descriptive only: pass rows out of 900 attempts.
- `majority_pass_questions` is the proposed canonical 3-run aggregate: a model gets a question if it passes at least 2 of 3 attempts.

## Headline

- Attempt rows: 1800
- Pass rows: 335/1800 (18.6%)
- Majority-pass model/question pairs: 108/600 (18%)
- Questions with zero passes across all 6 attempts: 211/300

## Model Comparison

- mistralai/mistral-medium-3-5: n1 56/300 (18.7%), n2 50/300 (16.7%), n3 52/300 (17.3%), majority 51/300 (17%)
- mistralai/mistral-small-2603: n1 57/300 (19%), n2 57/300 (19%), n3 63/300 (21%), majority 57/300 (19%)

## Level Comparison

- L1: n1 5/6 (83.3%), n2 6/6 (100%), n3 6/6 (100%), majority 6/6 (100%)
- L2: n1 5/8 (62.5%), n2 5/8 (62.5%), n3 6/8 (75%), majority 5/8 (62.5%)
- L3: n1 2/6 (33.3%), n2 1/6 (16.7%), n3 1/6 (16.7%), majority 1/6 (16.7%)
- L4: n1 1/10 (10%), n2 1/10 (10%), n3 2/10 (20%), majority 1/10 (10%)
- L5: n1 4/10 (40%), n2 4/10 (40%), n3 4/10 (40%), majority 4/10 (40%)
- L6: n1 8/10 (80%), n2 8/10 (80%), n3 8/10 (80%), majority 8/10 (80%)
- L7: n1 3/10 (30%), n2 4/10 (40%), n3 3/10 (30%), majority 4/10 (40%)
- L8: n1 10/20 (50%), n2 9/20 (45%), n3 11/20 (55%), majority 11/20 (55%)
- L9: n1 37/162 (22.8%), n2 35/162 (21.6%), n3 40/162 (24.7%), majority 36/162 (22.2%)
- L10: n1 28/138 (20.3%), n2 26/138 (18.8%), n3 24/138 (17.4%), majority 23/138 (16.7%)
- L11/AGI: n1 10/220 (4.5%), n2 8/220 (3.6%), n3 10/220 (4.5%), majority 9/220 (4.1%)

## Files

- `model-comparison.csv`
- `level-comparison.csv`
- `question-majority-aggregate.csv`
- `unstable-model-question-pairs.csv`
- `question-pass-counts-across-all-runs.csv`
- `zero-pass-questions-across-all-runs.csv`
- `QUESTION-READOUT.md`
