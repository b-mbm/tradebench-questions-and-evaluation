#!/usr/bin/env bash
# SGLang detached launch with --disable-cuda-graph (fixes the semaphore crash on this pod).
set -u
WS=/workspace
pkill -9 -f "sglang" 2>/dev/null
sleep 3
rm -f "$WS/sglang-run.log"
cd "$WS"
nohup setsid /root/sglang/bin/sglang serve \
  --model-path "$WS/models/qwen3.6-27b" \
  --served-model-name local-qwen36-27b-base \
  --lora-paths "local-qwen36-27b-sft=$WS/out/sft" \
  --max-lora-rank 32 \
  --dtype bfloat16 \
  --context-length 32768 \
  --mem-fraction-static 0.88 \
  --reasoning-parser qwen3 \
  --disable-cuda-graph \
  --port 8000 \
  --trust-remote-code \
  --host 0.0.0.0 \
  > "$WS/sglang-run.log" 2>&1 < /dev/null &
echo $! > "$WS/sglang.pid"
sleep 8
echo "=== SGLang launched (pid=$(cat $WS/sglang.pid)) with --disable-cuda-graph ==="
pgrep -f "sglang serve" >/dev/null && echo "ALIVE" || echo "DEAD - check log"
sz=$(stat -c %s "$WS/sglang-run.log" 2>/dev/null || echo 0); echo "log: $sz"
date -u
