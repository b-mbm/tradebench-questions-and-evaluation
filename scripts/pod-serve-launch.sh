#!/usr/bin/env bash
# Launch vLLM serve (mirror of orchestrator serve flags) WITHOUT auto-running generator.
set -u
WS=/workspace
ln -sf "$WS/vllm/bin/ninja" /usr/local/bin/ninja
pkill -9 -f "vllm serve" 2>/dev/null
sleep 4
rm -f "$WS/vllm-run.log"
mkdir -p "$WS/runpod-run/run30/pass1" "$WS/runpod-run/run30/pass2"
cd "$WS"
setsid "$WS/vllm/bin/vllm" serve "$WS/models/qwen3.6-27b" \
  --served-model-name local-qwen36-27b-base \
  --enable-lora --lora-modules "local-qwen36-27b-sft=$WS/out/sft" \
  --max-lora-rank 32 --max-num-seqs 8 --dtype bfloat16 \
  --max-model-len 32768 --gpu-memory-utilization 0.90 \
  --reasoning-parser qwen3 --enforce-eager --port 8000 --trust-remote-code \
  > "$WS/vllm-run.log" 2>&1 < /dev/null &
disown
sleep 3
echo "=== vllm serve launched (PID: $(pgrep -f 'vllm serve' | head -1)) ==="
date -u
