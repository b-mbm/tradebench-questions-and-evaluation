#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

DOTENV_CONFIG_PATH="${DOTENV_CONFIG_PATH:-/Users/bradleymiles/Documents/tradebench-lite-tests/.env}"
OUTPUT_SUBDIR="${OUTPUT_SUBDIR:-community/300}"
LOG_DIR="${LOG_DIR:-$ROOT_DIR/logs}"
mkdir -p "$LOG_DIR"

RUN_STAMP="$(date -u +"%Y-%m-%dT%H-%M-%SZ")"
LOG_FILE="${LOG_FILE:-$LOG_DIR/moonshot-kimi-overnight-$RUN_STAMP.log}"
if [[ "${KIMI_TEE_LOG:-1}" == "1" ]]; then
  exec > >(tee -a "$LOG_FILE") 2>&1
fi

MODEL_IDS="${MODEL_IDS:-moonshotai/kimi-k2-thinking,moonshotai/kimi-k2.6,moonshotai/kimi-k2.5,moonshotai/kimi-k2-0905}"
SMOKE_TEMP="${SMOKE_TEMP:-0.1}"
SMOKE_MAX_TOKENS="${SMOKE_MAX_TOKENS:-2200}"
SMOKE_CONCURRENCY="${SMOKE_CONCURRENCY:-1}"
CALL_SPACING_MS="${CALL_SPACING_MS:-3000}"
RETRY_ATTEMPTS="${RETRY_ATTEMPTS:-2}"
RETRY_BASE_DELAY_MS="${RETRY_BASE_DELAY_MS:-700}"
OPENROUTER_TIMEOUT_MS="${OPENROUTER_TIMEOUT_MS:-180000}"
OPENROUTER_SDK_RETRIES="${OPENROUTER_SDK_RETRIES:-0}"

MIN_CREDITS_START="${MIN_CREDITS_START:-50}"
MIN_CREDITS_BEFORE_LEVEL="${MIN_CREDITS_BEFORE_LEVEL:-15}"
CREDIT_POLL_SECONDS="${CREDIT_POLL_SECONDS:-300}"
MAX_N="${MAX_N:-3}"

ROSTER_FILE="${ROSTER_FILE:-/tmp/tradebench-moonshot-kimi-family.json}"
cat > "$ROSTER_FILE" <<'JSON'
{"models":["moonshotai/kimi-k2-thinking","moonshotai/kimi-k2.6","moonshotai/kimi-k2.5","moonshotai/kimi-k2-0905"]}
JSON

timestamp() {
  date -u +"%Y-%m-%dT%H:%M:%SZ"
}

remaining_credits() {
  DOTENV_CONFIG_PATH="$DOTENV_CONFIG_PATH" node -r dotenv/config - <<'NODE'
const key = process.env.OPENROUTER_API_KEY;
if (!key) {
  console.error("missing OPENROUTER_API_KEY");
  process.exit(2);
}
const res = await fetch("https://openrouter.ai/api/v1/credits", {
  headers: { Authorization: `Bearer ${key}` },
});
const text = await res.text();
if (!res.ok) {
  console.error(`${res.status} ${text}`);
  process.exit(1);
}
const json = JSON.parse(text);
const data = json.data || json;
const remaining = Number(data.total_credits) - Number(data.total_usage);
if (!Number.isFinite(remaining)) {
  console.error(`bad credit response: ${text}`);
  process.exit(1);
}
console.log(remaining.toFixed(3));
NODE
}

credits_ge() {
  local current="$1"
  local minimum="$2"
  node -e 'process.exit(Number(process.argv[1]) >= Number(process.argv[2]) ? 0 : 1)' -- "$current" "$minimum"
}

wait_for_credits() {
  local minimum="$1"
  local context="$2"
  while true; do
    local current
    current="$(remaining_credits)"
    echo "[$(timestamp)] credits=${current}; need>=${minimum} for ${context}"
    if credits_ge "$current" "$minimum"; then
      return 0
    fi
    echo "[$(timestamp)] waiting ${CREDIT_POLL_SECONDS}s for OpenRouter top-up before ${context}"
    sleep "$CREDIT_POLL_SECONDS"
  done
}

latest_result_for() {
  local n="$1"
  local level="$2"
  find "$ROOT_DIR/results/$OUTPUT_SUBDIR" -maxdepth 1 -type f \
    -name "openrouter-moonshot-kimi-family-300q-l${level}-n${n}-threshold-agi-*.json" \
    | sort | tail -n 1
}

run_level() {
  local n="$1"
  local level="$2"
  local existing
  existing="$(latest_result_for "$n" "$level")"
  if [[ -n "$existing" ]]; then
    echo "[$(timestamp)] SKIP Kimi N=${n} L${level}; existing result: $existing"
    return 0
  fi

  wait_for_credits "$MIN_CREDITS_BEFORE_LEVEL" "Kimi N=${n} L${level}"

  local label="openrouter-moonshot-kimi-family-300q-l${level}-n${n}-threshold-agi"
  echo "[$(timestamp)] START Kimi N=${n} L${level}; label=${label}"
  DOTENV_CONFIG_PATH="$DOTENV_CONFIG_PATH" \
  MODEL_ROSTER="$ROSTER_FILE" \
  MODEL_IDS="$MODEL_IDS" \
  SMOKE_TEMP="$SMOKE_TEMP" \
  SMOKE_MAX_TOKENS="$SMOKE_MAX_TOKENS" \
  SMOKE_CONCURRENCY="$SMOKE_CONCURRENCY" \
  CALL_SPACING_MS="$CALL_SPACING_MS" \
  RETRY_ATTEMPTS="$RETRY_ATTEMPTS" \
  RETRY_BASE_DELAY_MS="$RETRY_BASE_DELAY_MS" \
  OPENROUTER_TIMEOUT_MS="$OPENROUTER_TIMEOUT_MS" \
  OPENROUTER_SDK_RETRIES="$OPENROUTER_SDK_RETRIES" \
  OUTPUT_SUBDIR="$OUTPUT_SUBDIR" \
  npm run run:300q -- --levels "$level" --label "$label" --file-prefix "$label"

  existing="$(latest_result_for "$n" "$level")"
  if [[ -z "$existing" ]]; then
    echo "[$(timestamp)] ERROR Kimi N=${n} L${level} exited without a result file"
    return 1
  fi
  echo "[$(timestamp)] DONE Kimi N=${n} L${level}; result=$existing"
}

echo "[$(timestamp)] Moonshot Kimi overnight queue starting"
echo "[$(timestamp)] root=$ROOT_DIR"
echo "[$(timestamp)] log=$LOG_FILE"
echo "[$(timestamp)] dotenv=$DOTENV_CONFIG_PATH"
echo "[$(timestamp)] models=$MODEL_IDS"
echo "[$(timestamp)] options temp=$SMOKE_TEMP maxTokens=$SMOKE_MAX_TOKENS concurrency=$SMOKE_CONCURRENCY spacingMs=$CALL_SPACING_MS retries=$RETRY_ATTEMPTS timeoutMs=$OPENROUTER_TIMEOUT_MS"
echo "[$(timestamp)] max_n=$MAX_N"

wait_for_credits "$MIN_CREDITS_START" "overnight queue start"

for level in 9 10 11; do
  run_level 1 "$level"
done

for n in 2 3; do
  if ! node -e 'process.exit(Number(process.argv[1]) <= Number(process.argv[2]) ? 0 : 1)' -- "$n" "$MAX_N"; then
    echo "[$(timestamp)] STOP before Kimi N=${n}; MAX_N=${MAX_N}"
    break
  fi
  for level in 1 2 3 4 5 6 7 8 9 10 11; do
    run_level "$n" "$level"
  done
done

echo "[$(timestamp)] Moonshot Kimi overnight queue complete"
