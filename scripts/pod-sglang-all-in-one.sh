#!/usr/bin/env bash
# All-in-one: install SGLang → serve → wait ready → run probe. Runs in foreground.
# Designed to be run in a SINGLE long SSH session. No detachment.
set -e
echo "=== STEP 1: install SGLang $(date -u) ==="
rm -rf /root/sglang
python3 -m venv --system-site-packages /root/sglang
/root/sglang/bin/pip install --upgrade pip -q
/root/sglang/bin/pip install "sglang[all]" -q 2>&1 | tail -2
/root/sglang/bin/python -c "import sglang; print('sglang', sglang.__version__)"
echo "=== STEP 2: serve SGLang $(date -u) ==="
# Launch in background but within THIS session's process tree
/root/sglang/bin/sglang serve \
  --model-path /workspace/models/qwen3.6-27b \
  --served-model-name local-qwen36-27b-base \
  --lora-paths "local-qwen36-27b-sft=/workspace/out/sft" \
  --max-lora-rank 32 --dtype bfloat16 \
  --context-length 32768 --mem-fraction-static 0.82 \
  --reasoning-parser qwen3 --disable-cuda-graph \
  --port 8000 --trust-remote-code --host 0.0.0.0 \
  > /workspace/sglang-fg.log 2>&1 &
SGLANG_PID=$!
echo "sglang pid=$SGLANG_PID"
echo "=== STEP 3: wait for readiness $(date -u) ==="
for i in $(seq 1 30); do
  sleep 5
  ready=$(curl -s -m5 http://localhost:8000/v1/models 2>/dev/null | grep -c local-qwen)
  if [ "$ready" = "1" ]; then
    echo "=== SGLANG READY after $((i*5))s $(date -u) ==="
    break
  fi
  kill -0 $SGLANG_PID 2>/dev/null || { echo "SGLANG DIED"; tail -10 /workspace/sglang-fg.log; exit 1; }
  [ $((i % 4)) -eq 0 ] && echo "...waiting ${i}0s"
done
[ "$ready" = "1" ] || { echo "TIMEOUT"; exit 1; }
echo "=== STEP 4: run tier 1 probe $(date -u) ==="
/workspace/venv/bin/python /workspace/probe-parity.py 2>&1 | tee /workspace/tier1-results.txt
echo "=== DONE $(date -u) ==="
echo "done" > /workspace/tier1-done.flag
