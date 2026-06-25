# OpenRouter Llama 300Q N1/N2/N3 Threshold-AGI Comparison

Generated from saved raw model answers and regraded with the current local `schema-grader-300q.ts`. This avoids mixing stale embedded AGI grades from the first run with the corrected threshold AGI grader.

## Important Interpretation

- This is not a 900-question benchmark.
- Each model answered the same 300 questions three independent times.
- `combined_pass_rows` is descriptive only: pass rows out of 900 attempts.
- `majority_pass_questions` is the proposed canonical 3-run aggregate: a model gets a question if it passes at least 2 of 3 attempts.
- Scores are regraded locally from raw answers; no model calls were made during analysis generation.

## Headline

- Attempt rows: 3600
- Pass rows: 562/3600 (15.6%)
- Majority-pass model/question pairs: 183/1200 (15.3%)
- Questions with zero passes across all 12 attempts: 191/300

## Model Comparison

- meta-llama/llama-3.3-70b-instruct: n1 53/300 (17.7%), n2 52/300 (17.3%), n3 53/300 (17.7%), majority 51/300 (17%)
- meta-llama/llama-4-maverick: n1 52/300 (17.3%), n2 47/300 (15.7%), n3 58/300 (19.3%), majority 51/300 (17%)
- meta-llama/llama-4-scout: n1 45/300 (15%), n2 49/300 (16.3%), n3 51/300 (17%), majority 47/300 (15.7%)
- meta-llama/llama-3.1-8b-instruct: n1 33/300 (11%), n2 35/300 (11.7%), n3 34/300 (11.3%), majority 34/300 (11.3%)

## Level Comparison

- L1: n1 9/12 (75%), n2 11/12 (91.7%), n3 12/12 (100%), majority 11/12 (91.7%)
- L2: n1 8/16 (50%), n2 8/16 (50%), n3 8/16 (50%), majority 7/16 (43.8%)
- L3: n1 4/12 (33.3%), n2 4/12 (33.3%), n3 4/12 (33.3%), majority 4/12 (33.3%)
- L4: n1 3/20 (15%), n2 3/20 (15%), n3 2/20 (10%), majority 2/20 (10%)
- L5: n1 8/20 (40%), n2 8/20 (40%), n3 9/20 (45%), majority 8/20 (40%)
- L6: n1 13/20 (65%), n2 11/20 (55%), n3 14/20 (70%), majority 13/20 (65%)
- L7: n1 6/20 (30%), n2 6/20 (30%), n3 7/20 (35%), majority 7/20 (35%)
- L8: n1 22/40 (55%), n2 19/40 (47.5%), n3 25/40 (62.5%), majority 23/40 (57.5%)
- L9: n1 51/324 (15.7%), n2 53/324 (16.4%), n3 56/324 (17.3%), majority 53/324 (16.4%)
- L10: n1 53/276 (19.2%), n2 53/276 (19.2%), n3 52/276 (18.8%), majority 50/276 (18.1%)
- L11/AGI: n1 6/440 (1.4%), n2 7/440 (1.6%), n3 7/440 (1.6%), majority 5/440 (1.1%)

## Files

- `model-comparison.csv`
- `level-comparison.csv`
- `question-majority-aggregate.csv`
- `unstable-model-question-pairs.csv`
- `question-pass-counts-across-all-runs.csv`
- `zero-pass-questions-across-all-runs.csv`
- `QUESTION-READOUT.md`
