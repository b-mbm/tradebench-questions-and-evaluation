#!/usr/bin/env bash
# Relaunch SGLang detached, properly this time. Foreground test showed it loads fine.
set -u
WS=/workspace
pkill -9 -f "sglang" 2>/dev/null
pkill -9 -f "launch_server" 2>/dev/null
sleep 3
rm -f "$WS/sglang-run.log"
cd "$WS"
setsid /root/sglang/bin/python -m sglang.launch_server \
  --model-path "$WS/models/qwen3.6-27b" \
  --served-model-name local-qwen36-27b-base \
  --lora-paths "local-qwen36-27b-sft=$WS/out/sft" \
  --max-lora-rank 32 \
  --dtype bfloat16 \
  --context-length 32768 \
  --mem-fraction-static 0.90 \
  --reasoning-parser qwen3 \
  --port 8000 \
  --trust-remote-code \
  --host 0.0.0.0 \
  >> "$WS/sglang-run.log" 2>&1 < /dev/null &
disown
sleep 5
echo "=== SGLang launched (PID: $(pgrep -f 'launch_server' | head -1)) ==="
echo "log size: $(stat -c %s "$WS/sglang-run.log" 2>/dev/null || echo 0)"
date -u
