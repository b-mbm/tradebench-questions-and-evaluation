#!/usr/bin/env bash
set -u

cd "$(dirname "$0")/.." || exit 1
mkdir -p results/overnight-logs

export DOTENV_CONFIG_PATH="${DOTENV_CONFIG_PATH:-/Users/bradleymiles/Documents/tradebench-lite-tests/.env}"

LOG="${1:-results/overnight-logs/repair-n1-$(date +%Y%m%d-%H%M%S).log}"
echo "$LOG" > results/overnight-logs/latest-repair-n1.log

MODELS_FILE="${MODELS_FILE:-models.tradebench-sweep-paid-active.yaml}"
CONCURRENCY="${CONCURRENCY:-6}"
MAX_RETRIES="${MAX_RETRIES:-2}"
MAX_REPAIR_ROUNDS="${MAX_REPAIR_ROUNDS:-2}"
TRANSPORT_ABORT_THRESHOLD="${TRANSPORT_ABORT_THRESHOLD:-25}"
MAX_TRANSPORT_STORMS="${MAX_TRANSPORT_STORMS:-5}"

if ! DOTENV_CONFIG_PATH="$DOTENV_CONFIG_PATH" node -r dotenv/config -e 'process.exit(process.env.OPENROUTER_API_KEY ? 0 : 1)'; then
  echo "OPENROUTER_API_KEY is not available via DOTENV_CONFIG_PATH=$DOTENV_CONFIG_PATH" > "$LOG"
  exit 1
fi

count_failed() {
  local dir="$1"
  node - "$MODELS_FILE" "$dir" <<'NODE'
const fs = require("fs");
const [modelsFile, dir] = process.argv.slice(2);
function read(file) {
  return fs.existsSync(file)
    ? fs.readFileSync(file, "utf8").split(/\n/).filter(Boolean).map(line => {
        try { return JSON.parse(line); } catch { return null; }
      }).filter(Boolean)
    : [];
}
function latest(rows) {
  const map = new Map();
  for (const row of rows) {
    if (row.model && row.questionId) map.set(`${row.model}\t${row.questionId}`, row);
  }
  return [...map.values()];
}
const yaml = fs.readFileSync(modelsFile, "utf8");
const models = [...yaml.matchAll(/^\s*-\s+(.+)$/gm)].map(match => match[1].trim().replace(/^['"]|['"]$/g, ""));
const selected = new Set(models);
const generations = latest(read(`${dir}/generations.jsonl`)).filter(row => selected.has(row.model));
process.stdout.write(String(generations.filter(row => row.status !== "ok").length));
NODE
}

audit_level() {
  local level="$1"
  local dir="$2"
  node - "$MODELS_FILE" "$level" "$dir" <<'NODE'
const fs = require("fs");
const [modelsFile, level, dir] = process.argv.slice(2);
function read(file) {
  return fs.existsSync(file)
    ? fs.readFileSync(file, "utf8").split(/\n/).filter(Boolean).map(line => {
        try { return JSON.parse(line); } catch { return null; }
      }).filter(Boolean)
    : [];
}
function latest(rows) {
  const map = new Map();
  for (const row of rows) {
    if (row.model && row.questionId) map.set(`${row.model}\t${row.questionId}`, row);
  }
  return [...map.values()];
}
const yaml = fs.readFileSync(modelsFile, "utf8");
const models = [...yaml.matchAll(/^\s*-\s+(.+)$/gm)].map(match => match[1].trim().replace(/^['"]|['"]$/g, ""));
const selected = new Set(models);
const generations = latest(read(`${dir}/generations.jsonl`)).filter(row => selected.has(row.model));
const scores = latest(read(`${dir}/scores.jsonl`)).filter(row => selected.has(row.model));
const byModel = new Map();
for (const row of generations.filter(row => row.status !== "ok")) {
  byModel.set(row.model, (byModel.get(row.model) || 0) + 1);
}
console.log(`AUDIT n1 L${level} dir=${dir}`);
console.log(`AUDIT n1 L${level} generations latest=${generations.length} ok=${generations.filter(row => row.status === "ok").length} failed=${generations.filter(row => row.status !== "ok").length}`);
console.log(`AUDIT n1 L${level} scores latest=${scores.length} ok=${scores.filter(row => row.status === "ok").length} failed=${scores.filter(row => row.status !== "ok").length}`);
console.log(`AUDIT n1 L${level} generation failures by model ${JSON.stringify([...byModel.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25))}`);
NODE
}

repair_level() {
  local level="$1"
  local dir="results/parallel-level${level}-working"
  local round=1
  local transport_storms=0

  while [ "$round" -le "$MAX_REPAIR_ROUNDS" ]; do
    local failed
    failed="$(count_failed "$dir")"
    echo "=== CHECK n1 L${level} round=${round} failed=${failed} $(date) ==="
    if [ "$failed" = "0" ]; then
      audit_level "$level" "$dir"
      echo "=== DONE n1 L${level} clean $(date) ==="
      return 0
    fi

    echo "=== START n1 L${level} repair round=${round} $(date) ==="
    DOTENV_CONFIG_PATH="$DOTENV_CONFIG_PATH" npx tsx scripts/parallel-runner.ts \
      --models-file "$MODELS_FILE" \
      --levels "$level" \
      --results-dir "$dir" \
      --concurrency "$CONCURRENCY" \
      --max-retries "$MAX_RETRIES" \
      --generate \
      --score \
      --retry-failed \
      --transport-failure-abort-threshold "$TRANSPORT_ABORT_THRESHOLD"
    local status=$?
    echo "=== EXIT n1 L${level} repair round=${round} status=${status} $(date) ==="
    audit_level "$level" "$dir"

    if [ "$status" -ne 0 ]; then
      if tail -220 "$LOG" | grep -qi "Aborting generation after .* transport failures"; then
        transport_storms=$((transport_storms + 1))
        if [ "$transport_storms" -gt "$MAX_TRANSPORT_STORMS" ]; then
          echo "STOPPING: too many transport storms for n1 L${level}"
          exit 2
        fi
        echo "=== TRANSPORT STORM n1 L${level}; cooling down 300s $(date) ==="
        sleep 300
        continue
      fi
      echo "STOPPING: non-transport runner failure for n1 L${level}"
      exit "$status"
    fi

    round=$((round + 1))
  done

  local remaining
  remaining="$(count_failed "$dir")"
  echo "=== CARRYING n1 L${level} remaining_failures=${remaining} after ${MAX_REPAIR_ROUNDS} rounds $(date) ==="
  audit_level "$level" "$dir"
}

{
  echo "=== REPAIR N1 START $(date) ==="
  for level in 1 2 3 4 5 6 7 8 9 10 11; do
    repair_level "$level"
  done
  echo "=== REPAIR N1 DONE $(date) ==="
} > "$LOG" 2>&1
