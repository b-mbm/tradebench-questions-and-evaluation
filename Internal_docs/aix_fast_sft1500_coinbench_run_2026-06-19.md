# AIX-fast SFT1500 CoinBench run

Date: 2026-06-19
Suite: CoinBench / TradeBench 300Q
Provider: Together
Temperature: 0.1
Max tokens: 12000 for full runs; 16000 for base dirty repair

## Models

- Base: `Qwen/Qwen3.5-9B`
- Tuned / AIX-fast: `bradley_21b0/Qwen3.5-9B-coinbench-sft1500-qwen3p5-9b-6913bd85-4008a86f`

Together dedicated endpoint inference required the endpoint deployment name ending in `-4008a86f`, not the original fine-tuned model id ending in `-6913bd85`.

## Results

| Model | Pass@1 | Dirty | Answered fail | Notes |
|---|---:|---:|---:|---|
| Base Together 9B | 124/300 | 0 | 176 | Main run had 2 blank rows; both were repaired cleanly. |
| AIX-fast SFT1500 | 124/300 | 0 | 176 | Full run was clean on first pass. |

## Tier split

| Tier | Base pass | AIX-fast pass |
|---|---:|---:|
| L1 | 3/3 | 3/3 |
| L2 | 2/4 | 2/4 |
| L3 | 1/3 | 1/3 |
| L4 | 1/5 | 0/5 |
| L5 | 2/5 | 2/5 |
| L6 | 3/5 | 3/5 |
| L7 | 2/5 | 3/5 |
| L8 | 8/10 | 6/10 |
| L9 | 51/81 | 56/81 |
| L10 | 45/69 | 39/69 |
| AGI | 6/110 | 9/110 |

## Evidence files

- Base raw main run: `results/community/300/base-together-9b-300-2026-06-19T17-24-34-602Z.json`
- Base dirty repair: `results/community/300/base-together-9b-300-repair-dirty-2026-06-19T17-29-21-409Z.json`
- Base clean merged run: `results/community/300/base-together-9b-300-clean-2026-06-19.json`
- AIX-fast run: `results/community/300/aix-fast-sft1500-300-2026-06-19T17-47-20-697Z.json`

## Interpretation

This run does not show an overall pass@1 lift from the 1500-example SFT on 9B. It shows a redistribution: gains on L9 and AGI, losses on L8/L10 and one low-mid tier. Treat this as a mixed signal, not a failure of the training program.

Immediate implication: do not scale this exact recipe blindly. Use the diff to inspect whether SFT improved style/format/constraint following while harming some precise rubric fields, then decide whether the next iteration should use stronger data curation, higher-capacity 27B SFT, or preference/RL-style training.
