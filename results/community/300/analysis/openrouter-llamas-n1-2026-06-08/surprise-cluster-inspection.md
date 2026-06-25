# Surprise Cluster Inspection

## Binary Readiness Call

- **L10/AGI rubrics are mechanically solvable:** yes. Canonical L10 answers pass 69/69; canonical AGI validation answers pass 110/110.
- **Answer leakage found in prompt builder:** no. The 300Q prompt builder sends question text, context, and schema hints; it does not include rubric canonical answers.
- **Should questions be made easier because Llamas failed:** no. Failures are useful signal unless a rubric/prompt mismatch is found.
- **Should we inspect before n=3:** yes. L10 scalar-only grading and AGI near-passes deserve review before publication.

## L10 8B Passes

8B passed 15/69 L10 questions: L10-008, L10-013, L10-016, L10-019, L10-024, L10-025, L10-027, L10-029, L10-045, L10-046, L10-047, L10-048, L10-049, L10-059, L10-063.

Important interpretation: current L10 grading enforces the canonical `expected_value` range. It does **not** enforce all rubric dimension metadata such as portfolio construction, risk modeling, or interpretability as separate fields. So an L10 pass means the scalar result landed in range, not necessarily that the full protocol-composition reasoning was proven.

| Question | 8B Value | Canonical | Range | Pass Count |
|---|---:|---:|---|---:|
| L10-008 | 47500000 | 48400000 | [47500000,49000000] | 3 |
| L10-013 | 0.017 | 0.0154 | [0.012,0.018] | 1 |
| L10-016 | 0.55 | 0.55 | [0.45,0.65] | 3 |
| L10-019 | 9.32 | 9.26 | [9,9.5] | 1 |
| L10-024 | 18000 | 18000 | [16000,20000] | 2 |
| L10-025 | 7200 | 7200 | [6500,8000] | 1 |
| L10-027 | 3125000 | 3152845 | [3120000,3190000] | 2 |
| L10-029 | 1200000 | 1260000 | [1200000,1320000] | 1 |
| L10-045 | 0.37 | 0.37 | [0.33,0.42] | 3 |
| L10-046 | 0.35 | 0.35 | [0.31,0.4] | 3 |
| L10-047 | 15 | 15 | [13,17] | 1 |
| L10-048 | 14.5 | 15 | [13,17] | 1 |
| L10-049 | 11.32 | 11.5 | [11.3,11.7] | 2 |
| L10-059 | 32000000 | 31884320 | [31750000,32000000] | 3 |
| L10-063 | 7680000 | 7621325 | [7570000,7670000] | 4 |

## AGI Passes And Near-Passes

AGI questions with at least one pass: AGI-004(4), AGI-006(3), AGI-015(2), AGI-063(1), AGI-065(1), AGI-088(1).
AGI model responses with pass or score >= 0.6: 35. See `agi-passes-and-near-passes.csv`.

## Pass Distribution

- Zero-pass questions: 218
- Partial-pass questions: 66
- All-pass questions: 16

## Files

- `pass-matrix-300q.csv`
- `partial-pass-questions.csv`
- `zero-pass-questions.csv`
- `all-pass-questions.csv`
- `l10-8b-passes-inspection.csv`
- `agi-passes-and-near-passes.csv`
