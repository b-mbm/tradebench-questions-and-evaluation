# OpenRouter Llama 300Q n=2 Analysis (Threshold AGI)

Generated from the n=2 level files.

## Binary Inspection

- Error rows: 0
- AGI pass uses rubric threshold 0.7, uniform canonical-field weighting, and structural object validation.
- L10 pass is scalar expected-value range/close-match scoring, not full protocol-reasoning proof.

## Model Summary

| Model | Passes | Pass Rate | Avg Score | Avg Time (ms) | Error Rows |
|---|---:|---:|---:|---:|---:|
| meta-llama/llama-3.3-70b-instruct | 52/300 | 17.3% | 0.285 | 4720 | 0 |
| meta-llama/llama-4-maverick | 47/300 | 15.7% | 0.285 | 2517 | 0 |
| meta-llama/llama-4-scout | 49/300 | 16.3% | 0.283 | 3386 | 0 |
| meta-llama/llama-3.1-8b-instruct | 35/300 | 11.7% | 0.218 | 3742 | 0 |

## Level Summary

| Level | Total Questions | Total Passes | Zero-Pass Qs | Partial-Pass Qs | All-Pass Qs | Avg Score | Avg Time (ms) |
|---:|---:|---:|---:|---:|---:|---:|---:|
| L1 | 3 | 11/12 | 0 | 1 | 2 | 0.861 | 2419 |
| L2 | 4 | 8/16 | 1 | 2 | 1 | 0.752 | 2476 |
| L3 | 3 | 4/12 | 1 | 2 | 0 | 0.628 | 3991 |
| L4 | 5 | 3/20 | 3 | 2 | 0 | 0.373 | 4095 |
| L5 | 5 | 8/20 | 3 | 0 | 2 | 0.578 | 4438 |
| L6 | 5 | 11/20 | 1 | 3 | 1 | 0.562 | 3727 |
| L7 | 5 | 6/20 | 2 | 3 | 0 | 0.334 | 4738 |
| L8 | 10 | 19/40 | 2 | 6 | 2 | 0.586 | 4521 |
| L9 | 81 | 53/324 | 60 | 15 | 6 | 0.164 | 2928 |
| L10 | 69 | 53/276 | 37 | 30 | 2 | 0.206 | 3129 |
| L11 | 110 | 7/440 | 104 | 6 | 0 | 0.275 | 4227 |

## Question Sets

- Zero-pass questions: 214
- Partial-pass questions: 70
- All-pass questions: 16
- L10 pass rows: 42 exact, 11 close-match partial
- AGI pass rows: 7
- AGI near-pass rows with score >= 0.6: 24

## Files

- `pass-matrix-300q.csv`
- `partial-pass-questions.csv`
- `zero-pass-questions.csv`
- `all-pass-questions.csv`
- `model-summary.csv`
- `level-summary.csv`
- `l10-passes-inspection.csv`
- `agi-passes-and-near-passes.csv`
