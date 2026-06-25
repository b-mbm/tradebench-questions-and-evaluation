# OpenRouter Llama 300Q N3 Threshold-AGI Analysis

Generated from saved raw model answers and regraded with the current local `schema-grader-300q.ts`. This is not a 900-question aggregate; it is one independent 300Q attempt per model.

## Headline

- Rows: 1200
- Questions per model: 300
- Models: 4
- Total pass rows: 196/1200 (16.3%)
- L10 pass rows: 52
- AGI pass rows: 7
- AGI near-pass rows with score >= 0.6: 25

## Model Summary

- meta-llama/llama-3.3-70b-instruct: 53/300 (17.7%), avg score 0.288, avg 5836 ms
- meta-llama/llama-4-maverick: 58/300 (19.3%), avg score 0.307, avg 2499 ms
- meta-llama/llama-4-scout: 51/300 (17%), avg score 0.285, avg 2322 ms
- meta-llama/llama-3.1-8b-instruct: 34/300 (11.3%), avg score 0.208, avg 4379 ms

## Level Summary

- L1: 12/12 passes, avg score 0.861, avg 2764 ms
- L2: 8/16 passes, avg score 0.744, avg 4717 ms
- L3: 4/12 passes, avg score 0.640, avg 4716 ms
- L4: 2/20 passes, avg score 0.301, avg 3795 ms
- L5: 9/20 passes, avg score 0.591, avg 3294 ms
- L6: 14/20 passes, avg score 0.637, avg 2467 ms
- L7: 7/20 passes, avg score 0.337, avg 4904 ms
- L8: 25/40 passes, avg score 0.680, avg 5883 ms
- L9: 56/324 passes, avg score 0.173, avg 3940 ms
- L10: 52/276 passes, avg score 0.199, avg 3272 ms
- L11/AGI: 7/440 passes, avg score 0.275, avg 3731 ms

## Files

- `model-summary.csv`
- `level-summary.csv`
- `pass-matrix-300q.csv`
- `zero-pass-questions.csv`
- `partial-pass-questions.csv`
- `all-pass-questions.csv`
- `l10-passes-inspection.csv`
- `agi-passes-and-near-passes.csv`
