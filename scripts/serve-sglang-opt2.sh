#!/usr/bin/env bash
# Option 2: SGLang serve with reasoning + structured output support.
# SGLang is Qwen's officially recommended framework, with a dedicated
# "Structured Outputs for Reasoning Models" feature that disables grammar
# inside <think> blocks and enforces the schema on the final answer.
set -u
WS=/workspace
pkill -9 -f "vllm serve" 2>/dev/null
pkill -9 -f "sgl" 2>/dev/null
sleep 4
rm -f "$WS/sglang-run.log"
cd "$WS"

# SGLang serve command for Qwen3.6-27B with LoRA + reasoning + json mode
setsid /root/sglang/bin/python -m sglang.launch_server \
  --model-path "$WS/models/qwen3.6-27b" \
  --served-model-name local-qwen36-27b-base \
  --lora-paths "local-qwen36-27b-sft=$WS/out/sft" \
  --max-lora-rank 32 \
  --dtype bfloat16 \
  --context-length 32768 \
  --mem-fraction-static 0.90 \
  --enable-overlap-schedule \
  --reasoning-parser qwen3 \
  --port 8000 \
  --trust-remote-code \
  --host 0.0.0.0 \
  > "$WS/sglang-run.log" 2>&1 < /dev/null &
disown
sleep 3
echo "=== SGLang Option 2 launched (PID: $(pgrep -f 'sglang.launch_server' | head -1)) ==="
echo "reasoning-parser=qwen3 context=32768 lora=enabled"
date -u
