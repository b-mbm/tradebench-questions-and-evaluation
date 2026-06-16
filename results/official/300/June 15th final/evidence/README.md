# Evidence

Raw evidence for the June 15 final TradeBench/CoinBench 300Q N=1 archive is stored one directory up as:

- `evidence-results.tar.gz`

Extract it from this folder with:

```bash
tar -xzf evidence-results.tar.gz
```

It contains:

- `results/community`: raw community 300Q JSON result files and repair outputs.
- `results/parallel-level*-working`: main N=1 generation, score, and summary files by level.
- `results/repair-checkpoints`: JSONL repair checkpoints used for dirty-row cleanup.
- `results/local-qwen35-q6k-300`: local Qwen3.5 Q6K generation, score, summary, and logs.
