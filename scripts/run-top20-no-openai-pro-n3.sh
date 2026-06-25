#!/usr/bin/env bash
set -u

cd "$(dirname "$0")/.." || exit 1

mkdir -p results/overnight-logs results/top20-no-openai-pro-n3

export DOTENV_CONFIG_PATH="${DOTENV_CONFIG_PATH:-/Users/bradleymiles/Documents/tradebench-lite-tests/.env}"
export OPENROUTER_TIMEOUT_MS="${OPENROUTER_TIMEOUT_MS:-600000}"

MODELS_FILE="${MODELS_FILE:-models.tradebench-top20-no-openai-pro.yaml}"
BASE_DIR="${BASE_DIR:-results/top20-no-openai-pro-n3}"
CONCURRENCY="${CONCURRENCY:-6}"
MAX_RETRIES="${MAX_RETRIES:-2}"
MAX_REPAIR_ROUNDS="${MAX_REPAIR_ROUNDS:-3}"
TRANSPORT_ABORT_THRESHOLD="${TRANSPORT_ABORT_THRESHOLD:-30}"
CREDIT_COOLDOWN_SECONDS="${CREDIT_COOLDOWN_SECONDS:-300}"
TRANSPORT_COOLDOWN_SECONDS="${TRANSPORT_COOLDOWN_SECONDS:-300}"
LOG="${1:-results/overnight-logs/top20-no-openai-pro-n3-$(date +%Y%m%d-%H%M%S).log}"

echo "$LOG" > results/overnight-logs/latest-top20-no-openai-pro-n3.log

if ! DOTENV_CONFIG_PATH="$DOTENV_CONFIG_PATH" node -r dotenv/config -e 'process.exit(process.env.OPENROUTER_API_KEY ? 0 : 1)'; then
  echo "OPENROUTER_API_KEY is not available via DOTENV_CONFIG_PATH=$DOTENV_CONFIG_PATH" > "$LOG"
  exit 1
fi

count_field() {
  local dir="$1"
  local field="$2"
  node - "$MODELS_FILE" "$dir" "$field" <<'NODE'
const fs = require("fs");
const [modelsFile, dir, field] = process.argv.slice(2);

function readJsonl(file) {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map(line => {
      try { return JSON.parse(line); } catch { return null; }
    })
    .filter(Boolean);
}

function latest(rows) {
  const byKey = new Map();
  for (const row of rows) {
    if (row.model && row.questionId) byKey.set(`${row.model}\t${row.questionId}`, row);
  }
  return [...byKey.values()];
}

const yaml = fs.readFileSync(modelsFile, "utf8");
const models = [...yaml.matchAll(/^\s*-\s+(.+)$/gm)]
  .map(match => match[1].trim().replace(/^['"]|['"]$/g, ""));
const selected = new Set(models);
const expected = models.length * 300;
const generations = latest(readJsonl(`${dir}/generations.jsonl`)).filter(row => selected.has(row.model));
const scores = latest(readJsonl(`${dir}/scores.jsonl`)).filter(row => selected.has(row.model));
const values = {
  models: models.length,
  expected,
  generations: generations.length,
  ok: generations.filter(row => row.status === "ok").length,
  failed: generations.filter(row => row.status !== "ok").length,
  missing: expected - generations.length,
  scores: scores.length,
  scoreFailed: scores.filter(row => row.status !== "ok").length,
};

process.stdout.write(String(values[field] ?? ""));
NODE
}

audit_run() {
  local tag="$1"
  local dir="$2"
  node - "$MODELS_FILE" "$tag" "$dir" <<'NODE'
const fs = require("fs");
const [modelsFile, tag, dir] = process.argv.slice(2);

function readJsonl(file) {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map(line => {
      try { return JSON.parse(line); } catch { return null; }
    })
    .filter(Boolean);
}

function latest(rows) {
  const byKey = new Map();
  for (const row of rows) {
    if (row.model && row.questionId) byKey.set(`${row.model}\t${row.questionId}`, row);
  }
  return [...byKey.values()];
}

const yaml = fs.readFileSync(modelsFile, "utf8");
const models = [...yaml.matchAll(/^\s*-\s+(.+)$/gm)]
  .map(match => match[1].trim().replace(/^['"]|['"]$/g, ""));
const selected = new Set(models);
const expected = models.length * 300;
const generations = latest(readJsonl(`${dir}/generations.jsonl`)).filter(row => selected.has(row.model));
const scores = latest(readJsonl(`${dir}/scores.jsonl`)).filter(row => selected.has(row.model));
const failuresByModel = new Map();
for (const row of generations.filter(row => row.status !== "ok")) {
  failuresByModel.set(row.model, (failuresByModel.get(row.model) || 0) + 1);
}

console.log(`AUDIT ${tag} dir=${dir}`);
console.log(`AUDIT ${tag} generation latest=${generations.length}/${expected} ok=${generations.filter(row => row.status === "ok").length} failed=${generations.filter(row => row.status !== "ok").length} missing=${expected - generations.length}`);
console.log(`AUDIT ${tag} scoring latest=${scores.length}/${expected} ok=${scores.filter(row => row.status === "ok").length} failed=${scores.filter(row => row.status !== "ok").length}`);
console.log(`AUDIT ${tag} generation failures by model ${JSON.stringify([...failuresByModel.entries()].sort((a, b) => b[1] - a[1]))}`);
NODE
}

run_parallel() {
  local dir="$1"
  shift
  DOTENV_CONFIG_PATH="$DOTENV_CONFIG_PATH" OPENROUTER_TIMEOUT_MS="$OPENROUTER_TIMEOUT_MS" \
    npx tsx scripts/parallel-runner.ts \
      --models-file "$MODELS_FILE" \
      --results-dir "$dir" \
      --concurrency "$CONCURRENCY" \
      --max-retries "$MAX_RETRIES" \
      --generate \
      --score \
      --transport-failure-abort-threshold "$TRANSPORT_ABORT_THRESHOLD" \
      "$@"
}

handle_runner_status() {
  local status="$1"
  local tag="$2"
  if [ "$status" -eq 0 ]; then
    return 0
  fi

  if tail -260 "$LOG" | grep -Eiq "insufficient-credit|insufficient credits"; then
    echo "=== ${tag}: credit abort; cooling down ${CREDIT_COOLDOWN_SECONDS}s $(date) ==="
    sleep "$CREDIT_COOLDOWN_SECONDS"
    return 0
  fi

  if tail -260 "$LOG" | grep -Eiq "transport failures|connection|timeout|ETIMEDOUT|fetch failed"; then
    echo "=== ${tag}: transport abort; cooling down ${TRANSPORT_COOLDOWN_SECONDS}s $(date) ==="
    sleep "$TRANSPORT_COOLDOWN_SECONDS"
    return 0
  fi

  echo "STOPPING ${tag}: non-recoverable runner status=${status}"
  exit "$status"
}

complete_missing() {
  local tag="$1"
  local dir="$2"
  local missing
  missing="$(count_field "$dir" missing)"

  while [ "$missing" -gt 0 ]; do
    echo "=== ${tag}: filling missing=${missing} $(date) ==="
    run_parallel "$dir"
    local status=$?
    handle_runner_status "$status" "$tag"
    audit_run "$tag" "$dir"
    missing="$(count_field "$dir" missing)"
  done
}

repair_failures() {
  local tag="$1"
  local dir="$2"
  local round=1
  local failed
  failed="$(count_field "$dir" failed)"

  while [ "$failed" -gt 0 ] && [ "$round" -le "$MAX_REPAIR_ROUNDS" ]; do
    echo "=== ${tag}: repair round=${round} failed=${failed} $(date) ==="
    run_parallel "$dir" --retry-failed
    local status=$?
    handle_runner_status "$status" "$tag"
    audit_run "$tag" "$dir"
    failed="$(count_field "$dir" failed)"
    round=$((round + 1))
  done
}

{
  echo "=== TOP20 NO OPENAI PRO N3 START $(date) ==="
  echo "models_file=$MODELS_FILE base_dir=$BASE_DIR concurrency=$CONCURRENCY max_retries=$MAX_RETRIES timeout_ms=$OPENROUTER_TIMEOUT_MS"

  for run in 1 2 3; do
    tag="n${run}"
    dir="${BASE_DIR}/run${run}"
    mkdir -p "$dir"
    echo "=== ${tag}: start $(date) ==="
    complete_missing "$tag" "$dir"
    repair_failures "$tag" "$dir"
    audit_run "$tag" "$dir"
    echo "=== ${tag}: done $(date) ==="
  done

  echo "=== TOP20 NO OPENAI PRO N3 DONE $(date) ==="
} > "$LOG" 2>&1
