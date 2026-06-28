#!/usr/bin/env bash
# Self-contained SGLang launcher v2. Clean stdin redirect, no heredoc.
set -u
WS=/workspace
LOG="$WS/sglang-run.log"
STATUS="$WS/sglang-status.txt"

pkill -9 -f "sglang" 2>/dev/null
sleep 3
rm -f "$LOG" "$STATUS"
echo "launching" > "$STATUS"

cd "$WS"
/root/sglang/bin/sglang serve \
  --model-path "$WS/models/qwen3.6-27b" \
  --served-model-name local-qwen36-27b-base \
  --lora-paths "local-qwen36-27b-sft=$WS/out/sft" \
  --max-lora-rank 32 \
  --dtype bfloat16 \
  --context-length 32768 \
  --mem-fraction-static 0.82 \
  --reasoning-parser qwen3 \
  --disable-cuda-graph \
  --port 8000 \
  --trust-remote-code \
  --host 0.0.0.0 \
  > "$LOG" 2>&1 < /dev/null &
SGLANG_PID=$!
echo "pid=$SGLANG_PID" >> "$STATUS"

# Wait for readiness (up to 600s)
for i in $(seq 1 60); do
  sleep 10
  ready=$(curl -s -m5 http://localhost:8000/v1/models 2>/dev/null | grep -c local-qwen)
  if [ "$ready" = "1" ]; then
    echo "ready" > "$STATUS"
    exit 0
  fi
  kill -0 $SGLANG_PID 2>/dev/null || { echo "dead_at_${i}0s" > "$STATUS"; exit 1; }
done
echo "timeout" > "$STATUS"
exit 1
