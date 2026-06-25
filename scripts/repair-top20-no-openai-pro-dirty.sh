#!/usr/bin/env bash
set -u

cd "$(dirname "$0")/.." || exit 1

export DOTENV_CONFIG_PATH="${DOTENV_CONFIG_PATH:-/Users/bradleymiles/Documents/tradebench-lite-tests/.env}"
export OPENROUTER_TIMEOUT_MS="${OPENROUTER_TIMEOUT_MS:-600000}"

DIRTY_JSON="${DIRTY_JSON:-results/official/300/tradebench-all-current-n1-dirty-rows-2026-06-15.json}"
SUMMARY_CSV="${SUMMARY_CSV:-results/official/300/tradebench-all-current-n1-summary-2026-06-15.csv}"
CHECKPOINT="${CHECKPOINT:-results/repair-checkpoints/top20-no-openai-pro-dirty-repair.jsonl}"
SOURCE_DIR="${SOURCE_DIR:-results/repair-empty-source}"
LABEL="${LABEL:-top20-no-openai-pro-dirty-repair}"
REPAIR_EXCLUDE_MODELS="${REPAIR_EXCLUDE_MODELS:-}"
CONCURRENCY="${CONCURRENCY:-4}"
MAX_RETRIES="${MAX_RETRIES:-2}"
MAX_REPAIR_ROUNDS="${MAX_REPAIR_ROUNDS:-6}"
MAX_TOKENS="${MAX_TOKENS:-6000}"
COOLDOWN_SECONDS="${COOLDOWN_SECONDS:-180}"
MODEL_TIMEOUT_SECONDS="${MODEL_TIMEOUT_SECONDS:-0}"
NO_STREAM="${NO_STREAM:-0}"
NO_RESPONSE_FORMAT="${NO_RESPONSE_FORMAT:-0}"
REASONING_EXCLUDE="${REASONING_EXCLUDE:-0}"
REASONING_EFFORT="${REASONING_EFFORT:-}"
REASONING_MAX_TOKENS="${REASONING_MAX_TOKENS:-}"
DISABLE_THINKING="${DISABLE_THINKING:-0}"
LOG="${1:-results/overnight-logs/top20-no-openai-pro-dirty-repair-$(date +%Y%m%d-%H%M%S).log}"

mkdir -p results/overnight-logs results/repair-checkpoints "$SOURCE_DIR"

echo "$LOG" > results/overnight-logs/latest-top20-no-openai-pro-dirty-repair.log

if ! DOTENV_CONFIG_PATH="$DOTENV_CONFIG_PATH" node -r dotenv/config -e 'process.exit(process.env.OPENROUTER_API_KEY ? 0 : 1)'; then
  echo "OPENROUTER_API_KEY is not available via DOTENV_CONFIG_PATH=$DOTENV_CONFIG_PATH" > "$LOG"
  exit 1
fi

write_plan() {
  REPAIR_EXCLUDE_MODELS="$REPAIR_EXCLUDE_MODELS" node - "$SUMMARY_CSV" "$DIRTY_JSON" <<'NODE'
const fs = require("fs");
const [summaryCsv, dirtyJson] = process.argv.slice(2);
const top20Excluded = new Set(["openai/gpt-5.4-pro", "openai/gpt-5.5-pro"]);
const repairExcluded = new Set(top20Excluded);
for (const model of (process.env.REPAIR_EXCLUDE_MODELS || "").split(/[,\s]+/).filter(Boolean)) {
  repairExcluded.add(model);
}
const summary = fs.readFileSync(summaryCsv, "utf8").trim().split(/\r?\n/).slice(1).map(line => {
  const [rank, model] = line.split(",");
  return { rank: Number(rank), model };
});
const dirty = JSON.parse(fs.readFileSync(dirtyJson, "utf8")).full_300q_n1 || {};
const top20 = summary.filter(row => !top20Excluded.has(row.model)).slice(0, 20);
for (const row of top20) {
  if (repairExcluded.has(row.model)) continue;
  const ids = dirty[row.model]?.dirty_ids || [];
  if (ids.length) console.log(`${row.model}\t${ids.join(" ")}`);
}
NODE
}

audit_checkpoint() {
  REPAIR_EXCLUDE_MODELS="$REPAIR_EXCLUDE_MODELS" node - "$SUMMARY_CSV" "$DIRTY_JSON" "$CHECKPOINT" <<'NODE'
const fs = require("fs");
const [summaryCsv, dirtyJson, checkpoint] = process.argv.slice(2);
const top20Excluded = new Set(["openai/gpt-5.4-pro", "openai/gpt-5.5-pro"]);
const repairExcluded = new Set(top20Excluded);
for (const model of (process.env.REPAIR_EXCLUDE_MODELS || "").split(/[,\s]+/).filter(Boolean)) {
  repairExcluded.add(model);
}
const summary = fs.readFileSync(summaryCsv, "utf8").trim().split(/\r?\n/).slice(1).map(line => {
  const [rank, model] = line.split(",");
  return { rank: Number(rank), model };
});
const dirty = JSON.parse(fs.readFileSync(dirtyJson, "utf8")).full_300q_n1 || {};
const top20 = summary.filter(row => !top20Excluded.has(row.model)).slice(0, 20);
const latest = new Map();

if (fs.existsSync(checkpoint)) {
  for (const line of fs.readFileSync(checkpoint, "utf8").split(/\r?\n/)) {
    if (!line.trim()) continue;
    try {
      const row = JSON.parse(line);
      latest.set(`${row.modelId}\t${row.questionId}`, row);
    } catch {}
  }
}

let initial = 0;
let clean = 0;
let stillDirty = 0;
let untouched = 0;
const byModel = [];

for (const row of top20) {
  if (repairExcluded.has(row.model)) continue;
  const ids = dirty[row.model]?.dirty_ids || [];
  if (!ids.length) continue;
  let modelClean = 0;
  let modelDirty = 0;
  let modelUntouched = 0;
  for (const id of ids) {
    initial += 1;
    const repaired = latest.get(`${row.model}\t${id}`);
    if (!repaired) {
      untouched += 1;
      modelUntouched += 1;
    } else if (repaired.dirty) {
      stillDirty += 1;
      modelDirty += 1;
    } else {
      clean += 1;
      modelClean += 1;
    }
  }
  byModel.push({ model: row.model, initial: ids.length, clean: modelClean, dirty: modelDirty, untouched: modelUntouched });
}

console.log(`AUDIT initial_dirty=${initial} clean_repaired=${clean} still_dirty=${stillDirty} untouched=${untouched} remaining=${stillDirty + untouched}`);
for (const row of byModel) {
  console.log(`AUDIT ${row.model} initial=${row.initial} clean=${row.clean} still_dirty=${row.dirty} untouched=${row.untouched}`);
}
NODE
}

remaining_count() {
  audit_checkpoint | awk -F'[ =]' '/^AUDIT initial_dirty=/ {print $11}'
}

kill_pid_tree() {
  local pid="$1"
  local signal="${2:-TERM}"
  local child
  for child in $(pgrep -P "$pid" 2>/dev/null || true); do
    kill_pid_tree "$child" "$signal"
  done
  kill "-$signal" "$pid" 2>/dev/null || true
}

run_model_repair() {
  local model="$1"
  local ids="$2"
  local cmd=(
    npx tsx scripts/repair-dirty-openrouter-300q.ts
    --models "$model"
    --question-ids "$ids"
    --source-dir "$SOURCE_DIR"
    --checkpoint "$CHECKPOINT"
    --label "$LABEL"
    --max-retries "$MAX_RETRIES"
    --max-tokens "$MAX_TOKENS"
    --concurrency "$CONCURRENCY"
  )
  if [ "$NO_STREAM" = "1" ]; then
    cmd+=(--no-stream)
  fi
  if [ "$NO_RESPONSE_FORMAT" = "1" ]; then
    cmd+=(--no-response-format)
  fi
  if [ "$REASONING_EXCLUDE" = "1" ]; then
    cmd+=(--reasoning-exclude)
  fi
  if [ -n "$REASONING_EFFORT" ]; then
    cmd+=(--reasoning-effort "$REASONING_EFFORT")
  fi
  if [ -n "$REASONING_MAX_TOKENS" ]; then
    cmd+=(--reasoning-max-tokens "$REASONING_MAX_TOKENS")
  fi
  if [ "$DISABLE_THINKING" = "1" ]; then
    cmd+=(--disable-thinking)
  fi
  if [ "$MODEL_TIMEOUT_SECONDS" -gt 0 ]; then
    DOTENV_CONFIG_PATH="$DOTENV_CONFIG_PATH" OPENROUTER_TIMEOUT_MS="$OPENROUTER_TIMEOUT_MS" \
      "${cmd[@]}" &
    local child_pid=$!
    (
      sleep "$MODEL_TIMEOUT_SECONDS"
      if kill -0 "$child_pid" 2>/dev/null; then
        echo "WATCHDOG timeout ${MODEL_TIMEOUT_SECONDS}s for model=${model}; terminating process tree pid=${child_pid}" >&2
        kill_pid_tree "$child_pid" TERM
        sleep 3
        if kill -0 "$child_pid" 2>/dev/null; then
          echo "WATCHDOG escalation for model=${model}; killing process tree pid=${child_pid}" >&2
          kill_pid_tree "$child_pid" KILL
        fi
      fi
    ) &
    local watchdog_pid=$!
    wait "$child_pid"
    local status=$?
    kill "$watchdog_pid" 2>/dev/null || true
    wait "$watchdog_pid" 2>/dev/null || true
    return "$status"
  fi
  DOTENV_CONFIG_PATH="$DOTENV_CONFIG_PATH" OPENROUTER_TIMEOUT_MS="$OPENROUTER_TIMEOUT_MS" \
    "${cmd[@]}"
}

{
  echo "=== TOP20 NO OPENAI PRO DIRTY REPAIR START $(date) ==="
  echo "checkpoint=$CHECKPOINT source_dir=$SOURCE_DIR concurrency=$CONCURRENCY max_retries=$MAX_RETRIES max_tokens=$MAX_TOKENS timeout_ms=$OPENROUTER_TIMEOUT_MS no_stream=$NO_STREAM no_response_format=$NO_RESPONSE_FORMAT reasoning_exclude=$REASONING_EXCLUDE reasoning_effort=${REASONING_EFFORT:-} reasoning_max_tokens=${REASONING_MAX_TOKENS:-} disable_thinking=$DISABLE_THINKING model_timeout_seconds=$MODEL_TIMEOUT_SECONDS repair_exclude_models=$REPAIR_EXCLUDE_MODELS"
  echo "=== PLAN ==="
  write_plan
  echo "=== INITIAL AUDIT ==="
  audit_checkpoint

  round=1
  while [ "$round" -le "$MAX_REPAIR_ROUNDS" ]; do
    remaining="$(remaining_count)"
    echo "=== ROUND ${round} remaining=${remaining} $(date) ==="
    if [ "$remaining" = "0" ]; then
      break
    fi

    while IFS=$'\t' read -r model ids; do
      [ -n "$model" ] || continue
      echo "=== REPAIR round=${round} model=${model} ids=${ids} $(date) ==="
      run_model_repair "$model" "$ids"
      status=$?
      echo "=== EXIT round=${round} model=${model} status=${status} $(date) ==="
      if [ "$status" -ne 0 ]; then
        if tail -260 "$LOG" | grep -Eiq "insufficient credits|429|rate limit|timeout|connection|ETIMEDOUT|fetch failed|overloaded"; then
          echo "=== recoverable provider/credit issue; cooldown ${COOLDOWN_SECONDS}s $(date) ==="
          sleep "$COOLDOWN_SECONDS"
        else
          echo "STOPPING: non-recoverable repair failure for ${model}"
          exit "$status"
        fi
      fi
      audit_checkpoint
    done < <(write_plan)

    round=$((round + 1))
  done

  echo "=== FINAL AUDIT ==="
  audit_checkpoint
  echo "=== TOP20 NO OPENAI PRO DIRTY REPAIR DONE $(date) ==="
} > "$LOG" 2>&1
