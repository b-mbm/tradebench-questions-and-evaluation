#!/usr/bin/env bash
# Self-contained orchestrator: serve vLLM → wait ready → run two-stage test.
# This script STAYS ALIVE as the parent of vllm, preventing orphan-kill.
# Launch: setsid bash /workspace/pod-orchestrate-twostage.sh > /workspace/orch-twostage.log 2>&1 < /dev/null &
set -u
WS=/workspace
MODEL_DIR="$WS/models/qwen3.6-27b"
LOG="$WS/vllm-run.log"

echo "=== ORCHESTRATOR START $(date -u) ==="
pkill -9 -f "vllm serve" 2>/dev/null
sleep 4
rm -f "$LOG"
# CRITICAL: ninja must be on PATH for EngineCore's GDN kernel compilation
ln -sf "$WS/vllm/bin/ninja" /usr/local/bin/ninja
export PATH="/workspace/vllm/bin:$PATH"
echo "ninja: $(which ninja 2>/dev/null || echo MISSING)"

# Serve vLLM with reasoning parser (proven config from n=2 run)
setsid "$WS/vllm/bin/vllm" serve "$MODEL_DIR" \
  --served-model-name local-qwen36-27b-base \
  --enable-lora --lora-modules "local-qwen36-27b-sft=$WS/out/sft" \
  --max-lora-rank 32 --max-num-seqs 8 --dtype bfloat16 \
  --max-model-len 32768 --gpu-memory-utilization 0.90 \
  --reasoning-parser qwen3 --enforce-eager \
  --port 8000 --trust-remote-code \
  > "$LOG" 2>&1 < /dev/null &
disown
echo "vllm launched"

# Wait for readiness (forward progress, not just elapsed time)
echo "waiting for readiness..."
for i in $(seq 1 120); do
  sleep 15
  ready=$(curl -s -m5 http://localhost:8000/v1/models 2>/dev/null | grep -c local-qwen)
  if [ "$ready" = "1" ]; then
    echo "=== VLLM READY after $((i*15))s $(date -u) ==="
    break
  fi
  # Check it's still alive
  pgrep -f "vllm serve" >/dev/null || { echo "VLLM DIED"; exit 1; }
  if [ $((i % 4)) -eq 0 ]; then
    sz=$(stat -c %s "$LOG" 2>/dev/null || echo 0)
    echo "...still loading (${i}0s elapsed, log=${sz}b)"
  fi
done

if [ "$ready" != "1" ]; then
  echo "TIMEOUT waiting for vllm"
  exit 1
fi

# Run the two-stage probe
echo "=== RUNNING TWO-STAGE PROBE $(date -u) ==="
"$WS/venv/bin/python" "$WS/test-twostage.py" 2>&1 | tee "$WS/twostage-results.txt"
echo "=== TWO-STAGE PROBE DONE $(date -u) ==="

echo "TWOSTAGE_DONE" > "$WS/twostage-done.flag"
echo "=== ORCHESTRATOR COMPLETE $(date -u) ==="
