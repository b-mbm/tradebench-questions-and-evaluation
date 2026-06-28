#!/usr/bin/env bash
# Launch SGLang via nohup+setsid in a subshell wrapper to survive SSH disconnect.
# Uses 'sglang serve' entry point. Writes a PID file for tracking.
set -u
WS=/workspace
pkill -9 -f "sglang" 2>/dev/null
sleep 3
rm -f "$WS/sglang-run.log" "$WS/sglang.pid"
cd "$WS"
# nohup + setsid + full detachment
nohup setsid /root/sglang/bin/sglang serve \
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
  > "$WS/sglang-run.log" 2>&1 < /dev/null &
echo $! > "$WS/sglang.pid"
sleep 8
echo "=== launched, pid=$(cat $WS/sglang.pid) ==="
pgrep -f "sglang serve" | head -1 && echo "ALIVE" || echo "check log"
sz=$(stat -c %s "$WS/sglang-run.log" 2>/dev/null || echo 0); echo "log: $sz"
date -u
