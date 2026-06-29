#!/usr/bin/env bash
# Orchestrator: wait for SGLang ready → run 29Q → write DONE flag.
# Runs detached on the pod (launched via SSH setsid, survives disconnect
# because it writes to the volume).
set -u
echo "=== 29Q ORCHESTRATOR $(date -u) ==="

# Wait for SGLang readiness (up to 10min)
for i in $(seq 1 60); do
  sleep 10
  ready=$(curl -s -m5 http://localhost:8000/v1/models 2>/dev/null | grep -c local-qwen)
  if [ "$ready" -ge 2 ]; then
    echo "=== SGLANG READY (both models loaded) after $((i*10))s ==="
    break
  fi
  [ $((i % 6)) -eq 0 ] && echo "...waiting ${i}0s (ready=$ready)"
done
[ "$ready" -ge 2 ] || { echo "TIMEOUT or only base loaded"; exit 1; }

echo "=== RUNNING 29Q ==="
python3 /workspace/run-29q-sglang.py
echo "=== 29Q ORCHESTRATOR COMPLETE $(date -u) ==="
