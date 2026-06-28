#!/usr/bin/env bash
# Option 1: vLLM + enable_in_reasoning=True + qwen3-thinking parser.
# Keeps --reasoning-parser (enables thinking) + applies JSON constraint only after </think>.
# Uses the ORIGINAL prompt (ExecuteOneResponse intact) for true OpenRouter parity.
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
  --reasoning-parser qwen3 \
  --structured-outputs-config '{"enable_in_reasoning": true}' \
  --enforce-eager --port 8000 --trust-remote-code \
  > "$WS/vllm-run.log" 2>&1 < /dev/null &
disown
sleep 3
echo "=== vLLM Option 1 launched (PID: $(pgrep -f 'vllm serve' | head -1)) ==="
echo "parser=qwen3-thinking enable_in_reasoning=true"
date -u
