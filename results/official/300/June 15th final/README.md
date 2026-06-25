# June 15th Final

This folder is the canonical June 15, 2026 archive for the active TradeBench 300Q N=1 candidate numbers. It was updated on June 16, 2026 to include the local Qwen3.5 Q6K runs, and on June 17, 2026 to add the OpenRouter `z-ai/glm-5.2` CoinBench run.

## Files

- `June 15th final numbers.csv` - canonical CSV ranking.
- `June 15th final numbers.json` - same rows as JSON with metadata.
- `local-qwen35-q6k-300-summary.csv` - local Qwen run summary.
- `local-qwen35-q6k-300-scores.jsonl` - local Qwen scored rows.
- `local-qwen35-q6k-300-generations.jsonl` - local Qwen generation rows.
- `glm-5-2-openrouter-coinbench-2026-06-17/` - raw generation, score, and summary artifacts for `z-ai/glm-5.2`.
- `manifest.json` - machine-readable archive metadata and evidence path patterns.
- `evidence-results.tar.gz` - compressed raw evidence bundle for another agent to inspect.
- `evidence/README.md` - extraction note for the raw evidence bundle.

## Definitions

- `pass_at_1`: count of passing questions out of 300.
- `clean`: scoreable answers.
- `dirty`: still unanswered, blank, transport error, truncated, provider/generation failure, or otherwise non-scoreable.
- `answered_fail`: clean scored answers that did not pass.

## Excluded

The following rows were explicitly excluded from this active candidate archive as unsalvageable for the public candidate set:

- `openai/gpt-5.4-pro`
- `openai/gpt-5.5-pro`
