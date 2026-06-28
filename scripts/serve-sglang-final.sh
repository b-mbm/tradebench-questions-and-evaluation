#!/usr/bin/env bash
# SGLang serve — tuned for stability (lowered mem fraction, disable-cuda-graph).
# Launched with nohup; caller keeps SSH alive 130s during weight load.
set -u
WS=/workspace
pkill -9 -f "sglang" 2>/dev/null
sleep 3
rm -f "$WS/sglang-run.log"
cd "$WS"
nohup /workspace/sglang/bin/sglang serve \
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
  > "$WS/sglang-run.log" 2>&1 < /dev/null &
echo $! > "$WS/sglang.pid"
sleep 5
echo "=== SGLang launched pid=$(cat $WS/sglang.pid) ==="
echo "mem-fraction=0.82 disable-cuda-graph reasoning-parser=qwen3"
date -u
