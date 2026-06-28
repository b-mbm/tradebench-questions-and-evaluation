#!/usr/bin/env bash
# Kill vLLM cleanly so SGLang has the full GPU. Run as a script (not inline)
# to avoid the pkill-kills-ssh trap.
pkill -9 -f "vllm serve" 2>/dev/null
pkill -9 -f "EngineCore" 2>/dev/null
sleep 3
echo "vllm: $(pgrep -f 'vllm serve' | head -1 || echo gone)"
echo "sglang: $(pgrep -f 'sglang.launch_server' | head -1 || echo gone)"
nvidia-smi --query-gpu=memory.used --format=csv,noheader
