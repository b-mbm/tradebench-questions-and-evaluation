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
   - Optional (for email notifications the runner sends on your behalf): `RESEND_API_KEY`, `RESEND_FROM`
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
After approving runs, use the manifest-aware helper (private):

```bash
npx tsx scripts/combine-from-manifest.ts results/official-manifest.json --out results/official-combined.json --label official
npx tsx scripts/report-combined.ts results/official-combined.json

### Publish sanitized website data
Build a public summary and push to your website repo:

```bash
npx tsx scripts/make-public-summary.ts --in results/official-combined.json --out results/site-current.json --suite r5e1-60q
```
Then run the `Publish Official Leaderboard` workflow to copy that sanitized JSON to the website repo at `public/data/current.json` (or the path you configure) and optionally trigger a Vercel deploy.
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

## Approvals & Publishing Workflow

1. **Community run** – every `/submit` dispatch hits `Evaluate Smoke` (optional) and/or `Evaluate 60Q` with `channel=community`.
2. **Review + Approve** – once you trust a run:
   - Use `Approve Run (Promote to Official)` if the JSON already exists locally/committed.
   - Use `Approve From Run (Auto-download)` to pull the artifact by `run_id`, copy it into `results/official/`, and update the manifest.
3. **Publish official data** – `Publish Official Leaderboard` workflow clones the website repo, drops `results/official-combined.json`, commits, and (optionally) pings your Vercel deploy hook. This workflow also runs automatically at the end of `Approve From Run`.

### Required secrets (GitHub Actions)
- Provider keys: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_API_KEY`, `GROQ_API_KEY`, `OPENROUTER_API_KEY`
- Optional email notifications (still using your key, never the user's): `RESEND_API_KEY`, `RESEND_FROM`
- Website publishing:
  - `WEBSITE_REPO_PAT` – PAT with write access to the website repo (used by `publish-official.yml`)
  - `VERCEL_DEPLOY_HOOK` – optional hook URL to trigger a redeploy when official data updates
