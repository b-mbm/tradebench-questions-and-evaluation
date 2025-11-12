# Tradebench Questions and Evaluation (60Q Harness)

A minimal, self‑contained runner to execute the private 60‑question schema suite (L0 + L1–L8) against one or more models, produce per‑model JSON results, optionally repair failed pairs, and combine into a single report.

## Quick Start

1. Clone this private repo.
2. Create `.env` in the repo root with only the keys you intend to use:
   - `OPENAI_API_KEY=...`
   - `ANTHROPIC_API_KEY=...`
   - `GOOGLE_API_KEY=...`
   - `GROQ_API_KEY=...`
   - `OPENROUTER_API_KEY=...`
3. Install deps: `npm install`
4. Run a single model (example):

```bash
NODE_OPTIONS='-r dotenv/config' MODEL_IDS="claude-sonnet-4-5-20250929" \
  npx tsx scripts/run-60q.ts \
  --label 60q-claude-sonnet-4-5 --file-prefix 60q-claude-sonnet-4-5
```

Knobs (env):
- `CALL_SPACING_MS` per‑question delay, e.g. `600`
- `MODEL_SPACING_MS` delay between models
- `RETRY_ATTEMPTS` retries for transient errors (429/503/timeout/blank)
- `RETRY_BASE_DELAY_MS` base backoff for retries

Outputs land in `results/`.

## Repair Passes (runtime failures only)
Re‑run specific question IDs for a model and merge back:

```bash
NODE_OPTIONS='-r dotenv/config' MODEL_IDS="gemini-2.5-pro" \
  npx tsx scripts/run-60q.ts --ids L3-002 --label 60q-gemini-pro-retry --file-prefix 60q-gemini-pro-retry

npx tsx scripts/merge-repairs.ts \
  --base results/60q-gemini-pro-<timestamp>.json \
  --repairs results/60q-gemini-pro-retry-<timestamp>.json \
  --inplace
```

## Combine + Report

```bash
npx tsx scripts/combine-results.ts results/60q-*.json --label combined-all --out results/combined-60q-all.json
npx tsx scripts/report-combined.ts results/combined-60q-all.json
```

## GitHub Actions (workflow_dispatch)
- Configure Actions secrets for the providers you plan to use.
- Trigger the `Evaluate 60Q` workflow manually with a `model_id`.

## Layout
- `scripts/` – runner/repair/combine/report utilities
- `src/questions/schema-questions.ts` – 60Q definitions (L0 + L1–L8)
- `src/rubrics/` – rubric JSON + loader
- `src/grading/schema-grader.ts` – normalized grading
- `src/models/` – provider adapters + model roster
- `src/utils/` – response sanitizer, pricing, etc.
- `results/` – output artifacts (git‑ignored)

## Notes
- Keep this repo private; do not commit `.env` or results containing provider responses.
- Use `--no-call` only for scaffolding checks; it does not exercise rate limits.
