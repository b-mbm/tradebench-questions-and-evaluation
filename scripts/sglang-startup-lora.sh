#!/usr/bin/env bash
# SGLang startup WITH LoRA adapter. Based on the proven sglang-startup.sh + ninja fix.
set -u
echo "=== SGLANG STARTUP + LORA $(date -u) ==="

# THE FIX: ninja on PATH for Triton JIT (GDN kernels)
ln -sf /workspace/vllm/bin/ninja /usr/local/bin/ninja 2>/dev/null
export PATH="/usr/local/bin:/root/sglang/bin:$PATH"
echo "ninja: $(which ninja 2>/dev/null || echo MISSING)"
ninja --version 2>/dev/null && echo "ninja OK" || echo "ninja FAILED"

# Install SGLang if not present
if [ ! -f /root/sglang/bin/sglang ]; then
  echo "Installing SGLang..."
  python3 -m venv --system-site-packages /root/sglang
  /root/sglang/bin/pip install --upgrade pip -q
  /root/sglang/bin/pip install "sglang[all]" -q 2>&1 | tail -2
  /root/sglang/bin/pip install ninja -q
  ln -sf /root/sglang/bin/ninja /usr/local/bin/ninja
fi

# Start SSH for debugging
ssh-keygen -A 2>/dev/null
mkdir -p /root/.ssh
echo "PUBKEY_PLACEHOLDER" >> /root/.ssh/authorized_keys
/usr/sbin/sshd 2>/dev/null

echo "Starting SGLang serve loop (WITH LoRA)..."
while true; do
  /root/sglang/bin/sglang serve \
    --model-path /workspace/models/qwen3.6-27b \
    --served-model-name local-qwen36-27b-base \
    --lora-paths "local-qwen36-27b-sft=/workspace/out/sft" \
    --max-lora-rank 32 \
    --dtype bfloat16 \
    --context-length 32768 \
    --mem-fraction-static 0.82 \
    --reasoning-parser qwen3 \
    --disable-cuda-graph \
    --port 8000 \
    --trust-remote-code \
    --host 0.0.0.0 \
    > /workspace/sglang-serve.log 2>&1
  echo "[$(date -u)] sglang exited (rc=$?), restarting in 5s..." >> /workspace/sglang-serve.log
  sleep 5
done
