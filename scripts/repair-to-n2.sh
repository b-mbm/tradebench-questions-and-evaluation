#!/usr/bin/env bash
set -u

cd "$(dirname "$0")/.." || exit 1
mkdir -p results/overnight-logs

LOG="${1:-results/overnight-logs/repair-to-n2-$(date +%Y%m%d-%H%M%S).log}"
echo "$LOG" > results/overnight-logs/latest-repair-to-n2.log

MODELS_FILE="${MODELS_FILE:-models.tradebench-sweep-paid-active.yaml}"
CONCURRENCY="${CONCURRENCY:-6}"
MAX_RETRIES="${MAX_RETRIES:-2}"
MAX_REPAIR_ROUNDS="${MAX_REPAIR_ROUNDS:-2}"
TRANSPORT_ABORT_THRESHOLD="${TRANSPORT_ABORT_THRESHOLD:-25}"

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
const rows = latest(read(`${dir}/generations.jsonl`)).filter(row => selected.has(row.model));
process.stdout.write(String(rows.filter(row => row.status !== "ok").length));
NODE
}

audit_level() {
  local tag="$1"
  local level="$2"
  local dir="$3"
  node - "$MODELS_FILE" "$tag" "$level" "$dir" <<'NODE'
const fs = require("fs");
const [modelsFile, tag, level, dir] = process.argv.slice(2);
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
console.log(`AUDIT ${tag} L${level} dir=${dir}`);
console.log(`AUDIT ${tag} L${level} generations latest=${generations.length} ok=${generations.filter(row => row.status === "ok").length} failed=${generations.filter(row => row.status !== "ok").length}`);
console.log(`AUDIT ${tag} L${level} scores latest=${scores.length} ok=${scores.filter(row => row.status === "ok").length} failed=${scores.filter(row => row.status !== "ok").length}`);
console.log(`AUDIT ${tag} L${level} generation failures by model ${JSON.stringify([...byModel.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20))}`);
NODE
}

repair_level() {
  local tag="$1"
  local level="$2"
  local dir="$3"
  local round=1

  while [ "$round" -le "$MAX_REPAIR_ROUNDS" ]; do
    local failed
    failed="$(count_failed "$dir")"
    echo "=== CHECK ${tag} L${level} round=${round} failed=${failed} $(date) ==="
    if [ "$failed" = "0" ]; then
      audit_level "$tag" "$level" "$dir"
      echo "=== DONE ${tag} L${level} clean $(date) ==="
      return 0
    fi

    echo "=== START ${tag} L${level} repair round=${round} $(date) ==="
    npx tsx scripts/parallel-runner.ts \
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
    echo "=== EXIT ${tag} L${level} repair round=${round} status=${status} $(date) ==="
    audit_level "$tag" "$level" "$dir"

    if [ "$status" -ne 0 ]; then
      if tail -160 "$LOG" | grep -qi "transport failures"; then
        echo "=== TRANSPORT STORM ${tag} L${level}; cooling down 300s $(date) ==="
        sleep 300
      else
        echo "STOPPING: non-transport runner failure for ${tag} L${level}"
        exit "$status"
      fi
    fi
    round=$((round + 1))
  done

  local remaining
  remaining="$(count_failed "$dir")"
  echo "=== CARRYING ${tag} L${level} remaining_failures=${remaining} after ${MAX_REPAIR_ROUNDS} rounds $(date) ==="
  audit_level "$tag" "$level" "$dir"
}

{
  echo "=== REPAIR TO N2 START $(date) ==="
  for level in 1 2 3 4 5 6 7 8 9 10 11; do
    repair_level "n1" "$level" "results/parallel-level${level}-working"
  done
  for level in 1 2 3 4 5 6 7 8 9 10 11; do
    repair_level "n2" "$level" "results/parallel-n2-level${level}-working"
  done
  echo "=== REPAIR TO N2 DONE $(date) ==="
} > "$LOG" 2>&1
