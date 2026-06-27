#!/usr/bin/env bash
# Self-contained on-pod orchestrator for the reasoning-aware 300Q run.
# Launch detached:  setsid bash /workspace/runpod-orchestrate.sh > /workspace/orchestrate.log 2>&1 < /dev/null &
# It serves vLLM, waits for readiness (judged by FORWARD PROGRESS, not elapsed time),
# runs runpod-runner.py to completion, writes ORCH_DONE, and (optionally) stops the pod.
# Completion does NOT depend on any external chat/heartbeat. The chat only pulls + grades when ORCH_DONE appears.
set -u

WS="${WS:-/workspace}"
MODEL_DIR="${MODEL_DIR:-$WS/models/qwen3.6-27b}"
ADAPTER="${ADAPTER:-$WS/out/sft}"
OUT_DIR="${OUT_DIR:-$WS/runpod-run}"
MAX_MODEL_LEN="${MAX_MODEL_LEN:-32768}"
MAX_NUM_SEQS="${MAX_NUM_SEQS:-8}"
GPU_UTIL="${GPU_UTIL:-0.90}"
SERVE_LOG="$WS/vllm-run.log"
POD_ID="${POD_ID:-}"            # set to auto-stop the pod at the end (needs $WS/.rpk)
STOP_POD_AT_END="${STOP_POD_AT_END:-0}"
mkdir -p "$OUT_DIR"

echo "=== ORCH start $(date -u) max_model_len=$MAX_MODEL_LEN num_seqs=$MAX_NUM_SEQS ==="

serve() {
  local mml="$1"
  pkill -9 -f "vllm serve" 2>/dev/null; sleep 4
  ln -sf "$WS/vllm/bin/ninja" /usr/local/bin/ninja
  rm -f "$SERVE_LOG"
  cd "$WS"
  # REASONING_PARSER: separates <think> from the answer so message.content is clean JSON
  # (kills the parse/missing_field failures). Set REASONING_PARSER="" to disable if the
  # installed vLLM lacks the qwen3 parser. Verify the exact parser name for the pod's vLLM.
  local rp_arg=""
  [ -n "${REASONING_PARSER:-qwen3}" ] && rp_arg="--reasoning-parser ${REASONING_PARSER:-qwen3}"
  setsid "$WS/vllm/bin/vllm" serve "$MODEL_DIR" \
    --served-model-name local-qwen36-27b-base \
    --enable-lora --lora-modules "local-qwen36-27b-sft=$ADAPTER" \
    --max-lora-rank 32 --max-num-seqs "$MAX_NUM_SEQS" --dtype bfloat16 \
    --max-model-len "$mml" --gpu-memory-utilization "$GPU_UTIL" \
    $rp_arg --enforce-eager --port 8000 --trust-remote-code \
    > "$SERVE_LOG" 2>&1 < /dev/null &
  disown
}

ready() { curl -s -m6 http://localhost:8000/v1/models 2>/dev/null | grep -c local-qwen; }

wait_ready() {
  # judge loading-vs-stalled by FORWARD PROGRESS (log bytes / RSS), never by elapsed time
  local mml="$1" last_bytes=0 last_rss=0 stalls=0
  for i in $(seq 1 120); do
    [ "$(ready)" -ge 1 ] 2>/dev/null && { echo "SERVE READY (max_model_len=$mml)"; return 0; }
    if grep -qiE "out of memory|Free memory|No available memory for the cache|cannot allocate" "$SERVE_LOG" 2>/dev/null; then
      echo "SERVE OOM at $mml"; return 2
    fi
    if grep -qiE "Traceback|Engine core initialization failed|raise |Error: " "$SERVE_LOG" 2>/dev/null && [ "$(ready)" -eq 0 ]; then
      # could be a transient warning; only treat as fatal if no forward progress below
      :
    fi
    local pid bytes rss
    pid="$(pgrep -f 'vllm serve' | head -1)"
    bytes="$(stat -c %s "$SERVE_LOG" 2>/dev/null || echo 0)"
    rss="$(grep VmRSS /proc/$pid/status 2>/dev/null | awk '{print $2}')"; rss="${rss:-0}"
    if [ "$bytes" -gt "$last_bytes" ] || [ "$rss" -gt "$last_rss" ]; then
      stalls=0
    else
      stalls=$((stalls + 1))
    fi
    last_bytes="$bytes"; last_rss="$rss"
    echo "[serve $i] ready=0 bytes=$bytes rss_kb=$rss stalls=$stalls"
    if [ "$stalls" -ge 6 ]; then echo "SERVE STALLED (no progress ~3min)"; return 3; fi
    sleep 30
  done
  echo "SERVE TIMEOUT"; return 1
}

# try MAX_MODEL_LEN, fall back on OOM
for mml in "$MAX_MODEL_LEN" 24576 16384; do
  serve "$mml"
  wait_ready "$mml"; rc=$?
  if [ "$rc" -eq 0 ]; then SERVED_MML="$mml"; break; fi
  if [ "$rc" -eq 2 ]; then echo "falling back below $mml due to OOM"; continue; fi
  if [ "$rc" -eq 3 ]; then serve "$mml"; wait_ready "$mml" && { SERVED_MML="$mml"; break; } || continue; fi
done
if [ -z "${SERVED_MML:-}" ]; then echo "SERVE FAILED — aborting"; echo "ORCH_FAILED serve" > "$OUT_DIR/ORCH_STATUS"; exit 2; fi

echo "=== running generator (max_model_len=$SERVED_MML) $(date -u) ==="
MAX_MODEL_LEN="$SERVED_MML" OUT_DIR="$OUT_DIR" \
  PROMPTS_FILE="${PROMPTS_FILE:-$WS/prompts-300q.json}" \
  MODELS="${MODELS:-local-qwen36-27b-base,local-qwen36-27b-sft}" \
  IDS="${IDS:-}" LEVELS="${LEVELS:-}" \
  BUDGET_LADDER="${BUDGET_LADDER:-16000,24000,32000}" \
  CONCURRENCY="${CONCURRENCY:-8}" \
  python3 "$WS/runpod-runner.py"
rc=$?

echo "ORCH_DONE rc=$rc $(date -u)" | tee "$OUT_DIR/ORCH_STATUS"

if [ "$STOP_POD_AT_END" = "1" ] && [ -n "$POD_ID" ] && [ -f "$WS/.rpk" ]; then
  echo "stopping pod $POD_ID"
  curl -s "https://api.runpod.io/graphql?api_key=$(cat $WS/.rpk)" -H "Content-Type: application/json" \
    -d "{\"query\":\"mutation{podStop(input:{podId:\\\"$POD_ID\\\"}){id desiredStatus}}\"}" >> "$WS/autostop.log" 2>&1
fi
