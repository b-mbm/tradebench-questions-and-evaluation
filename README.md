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

Outputs land in `results/<channel>/` (defaults to `community`; set `OUTPUT_SUBDIR=official` for maintainer runs).

### Dry runs vs no-call
- `--dry-run`: prints the plan (models + questions) and exits. No files written, zero API calls.
- `--no-call`: executes the harness, graders, and file writing but deliberately does not contact providers (scaffolding sanity check).

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

### Official combine (via manifest)
After approving runs, use the manifest-aware helper:

```bash
npx tsx scripts/combine-from-manifest.ts results/official-manifest.json --out results/official-combined.json --label official
npx tsx scripts/report-combined.ts results/official-combined.json
```

## GitHub Actions (workflow_dispatch)
- Configure Actions secrets for the providers you plan to use.
- Trigger the `Evaluate 60Q` workflow manually with a `model_id`.
- Use `Evaluate Smoke (subset)` for 2–3 question probes or scaffolding (`no_call=true`).
- Promote a reviewed community run via `Approve Run`, then refresh the leaderboard with `Combine and Report (Official)`.

## Layout
- `scripts/` – runner/repair/combine/report utilities
- `src/questions/schema-questions.ts` – 60Q definitions (L0 + L1–L8)
- `src/rubrics/` – rubric JSON + loader
- `src/grading/schema-grader.ts` – normalized grading
- `src/models/` – provider adapters + model roster
- `src/utils/` – response sanitizer, pricing, etc.
- `src/config/model-roster.json` – allowed model IDs (edit this to lock the set)
- `results/official/` – approved artifacts that back the public leaderboard
- `results/official-manifest.json` – mapping of model IDs → approved files
- `results/` – output artifacts (git‑ignored)

### Model roster (locking the list)
- Default roster file: `src/config/model-roster.json` (preferred).
- Override via env: set `MODEL_ROSTER=path/to/your-roster.json` (absolute or relative) in Actions inputs or locally.
- Legacy path is still supported for back‑compat: `src/Trading Reasoning Round 4/Round-4-Extension-4/benchmark.json`.

## Notes
- Keep this repo private; do not commit `.env` or results containing provider responses.
- Use `--no-call` only for scaffolding checks; it does not exercise rate limits.
