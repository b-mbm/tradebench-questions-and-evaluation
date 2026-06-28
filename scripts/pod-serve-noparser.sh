#!/usr/bin/env bash
# Fix 1 test: serve vLLM WITHOUT --reasoning-parser, WITH json_object support.
# This isolates whether the reasoning parser (vLLM #18819) is the cause of schema collapse.
set -u
WS=/workspace
ln -sf "$WS/vllm/bin/ninja" /usr/local/bin/ninja
pkill -9 -f "vllm serve" 2>/dev/null; pkill -9 -f "sgl" 2>/dev/null
sleep 4
rm -f "$WS/vllm-run.log"
cd "$WS"
setsid "$WS/vllm/bin/vllm" serve "$WS/models/qwen3.6-27b" \
  --served-model-name local-qwen36-27b-base \
  --enable-lora --lora-modules "local-qwen36-27b-sft=$WS/out/sft" \
  --max-lora-rank 32 --max-num-seqs 8 --dtype bfloat16 \
  --max-model-len 32768 --gpu-memory-utilization 0.90 \
  --enforce-eager --port 8000 --trust-remote-code \
  > "$WS/vllm-run.log" 2>&1 < /dev/null &
disown
sleep 3
echo "=== vLLM serve launched WITHOUT reasoning-parser (PID: $(pgrep -f 'vllm serve' | head -1)) ==="
echo "NOTE: no --reasoning-parser flag. Testing vLLM #18819 hypothesis."
date -u
