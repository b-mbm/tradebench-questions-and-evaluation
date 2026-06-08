# Llama L1/L2 Calibration - 2026-06-08

## Scope

This was a cheap post-L9-fix calibration sweep, not an official leaderboard publish.

- Code commit: `4201069` (`fix(300q): enforce canonical L9 grading`)
- Temperature: `0.1`
- Retry attempts: `3`
- Concurrency: `1`
- Levels: L1 and L2
- Repetitions: 3 per level

## Model Identities

Four requested aliases worked directly:

- `llama-3.3-70b-versatile`
- `llama-3.1-8b-instant`
- `meta-llama/llama-4-maverick`
- `meta-llama/llama-4-scout`

The requested `meta-llama/llama-3.1-405b-instruct` returned `404 No endpoints found` on OpenRouter. A substitute smoke/full run was mistakenly attempted with:

- `nousresearch/hermes-3-llama-3.1-405b`

That substitute is excluded from accepted calibration because model identity is part of the benchmark condition. Do not substitute models unless explicitly authorized.

## Result Files

- `results/community/300/llama-gen-l1-rep1-fixed-l9-2026-06-08T02-05-09-863Z.json`
- `results/community/300/llama-gen-l1-rep2-fixed-l9-2026-06-08T02-05-49-109Z.json`
- `results/community/300/llama-gen-l1-rep3-fixed-l9-2026-06-08T02-06-59-159Z.json`
- `results/community/300/llama-gen-l2-rep1-fixed-l9-2026-06-08T02-08-14-048Z.json`
- `results/community/300/llama-gen-l2-rep2-fixed-l9-2026-06-08T02-09-53-631Z.json`
- `results/community/300/llama-gen-l2-rep3-fixed-l9-2026-06-08T02-11-04-059Z.json`

Smoke files:

- `results/community/300/llama-smoke-l1-fixed-l9-2026-06-08T02-03-08-131Z.json`
- `results/community/300/llama-405b-smoke-l1-fixed-l9-2026-06-08T02-03-44-877Z.json`

## Aggregate Pass Counts

| Model | L1 Passes | L1 Avg Score | L2 Passes | L2 Avg Score |
|---|---:|---:|---:|---:|
| `llama-3.3-70b-versatile` | 9/9 | 0.915 | 6/12 | 0.816 |
| `llama-3.1-8b-instant` | 8/9 | 0.810 | 3/12 | 0.677 |
| `meta-llama/llama-4-maverick` | 9/9 | 0.913 | 7/12 | 0.774 |
| `meta-llama/llama-4-scout` | 8/9 | 0.832 | 8/12 | 0.788 |

Excluded mistaken substitute:

| Model | L1 Passes | L1 Avg Score | L2 Passes | L2 Avg Score |
|---|---:|---:|---:|---:|
| `nousresearch/hermes-3-llama-3.1-405b` | 9/9 | 0.888 | 9/12 | 0.763 |

## Calibration Notes

- The n=3 policy was useful even at L1: `llama-3.1-8b-instant` and `meta-llama/llama-4-scout` each had one `L1-003` miss.
- `L2-004` failed for all four accepted requested model identities in all three repetitions.
- `L2-004` uses the generic `arbitrage` rubric while the prompt asks for liquidity analysis before a USDC/WETH swap. The observed outputs were plausible swap/liquidity schemas but repeatedly landed just under the pass threshold.
- This is a calibration inspection note, not a recommendation to make the item easier. Failed questions may be valuable and should remain strict when the rubric is correct.
