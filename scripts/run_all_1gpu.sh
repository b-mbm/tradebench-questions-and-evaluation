#!/usr/bin/env bash
# run_all_1gpu.sh — Fully self-contained GRPO training script for ONE GPU.
# Designed to be curl-piped: curl -sL <gist-url> | bash
#
# Colocated mode: SGLang + QLoRA training on the SAME GPU.
# SGLang uses mem-fraction-static 0.55 (44GB) leaving ~36GB for QLoRA.
#
# Modes via $MODE env var: "smoke" (3 steps) or "null" (30 steps)
set -u

MODE="${MODE:-smoke}"
REPO_URL="https://github.com/b-mbm/tradebench-questions-and-evaluation.git"
BRANCH="phase0-grpo-preconditions"
MODEL_PATH="/workspace/models/qwen3.6-27b"
OUTPUT_DIR="/workspace/grpo-results"
SGLANG_URL="http://127.0.0.1:8000"
LOG="/workspace/grpo-results.log"
STEPS="${STEPS:-3}"

mkdir -p "$OUTPUT_DIR"
exec > >(tee -a "$LOG") 2>&1
echo "═══════════════════════════════════════════════════════════════"
echo "  GRPO 1-GPU AUTO-DEPLOY (mode=$MODE) — $(date -u)"
echo "═══════════════════════════════════════════════════════════════"

# ─── 1. Clone repo ──────────────────────────────────────────────────────
if [ ! -f /workspace/repo/prompts-300q.json ]; then
  echo "── cloning repo ──"
  rm -rf /workspace/repo
  git clone --depth 1 -b "$BRANCH" "$REPO_URL" /workspace/repo 2>&1 | tail -3
fi
if [ ! -f /workspace/repo/prompts-300q.json ]; then
  echo "FATAL: repo clone failed"
  echo "CLONE_FAILED" > "$OUTPUT_DIR/FAILED"
  exit 1
fi
echo "repo OK"

# ─── 2. Ninja fix ───────────────────────────────────────────────────────
ln -sf /workspace/vllm/bin/ninja /usr/local/bin/ninja 2>/dev/null || true
export PATH="/usr/local/bin:/root/sglang/bin:$PATH"

# ─── 3. Install SGLang ─────────────────────────────────────────────────
if [ ! -f /root/sglang/bin/sglang ]; then
  echo "── installing SGLang ──"
  python3 -m venv --system-site-packages /root/sglang
  /root/sglang/bin/pip install --upgrade pip -q
  /root/sglang/bin/pip install "sglang[all]" -q 2>&1 | tail -2
  /root/sglang/bin/pip install ninja -q
  ln -sf /root/sglang/bin/ninja /usr/local/bin/ninja
fi
echo "SGLang OK"

# ─── 4. Start SGLang — LOWER memory for colocated training ─────────────
echo "── starting SGLang (mem-fraction 0.55 for colocated training) ──"
CUDA_VISIBLE_DEVICES=0 nohup /root/sglang/bin/sglang serve \
  --model-path "$MODEL_PATH" \
  --served-model-name local-qwen36-27b-base \
  --dtype bfloat16 \
  --context-length 32768 \
  --mem-fraction-static 0.55 \
  --reasoning-parser qwen3 \
  --disable-cuda-graph \
  --port 8000 \
  --trust-remote-code \
  --host 0.0.0.0 \
  > /workspace/sglang.log 2>&1 &

echo "── waiting for SGLang (up to 10 min) ──"
for i in $(seq 1 120); do
  if curl -sf "$SGLANG_URL/v1/models" | grep -q "local-qwen36"; then
    echo "SGLang ready after ${i}x5s"
    break
  fi
  sleep 5
done
if ! curl -sf "$SGLANG_URL/v1/models" | grep -q "local-qwen36"; then
  echo "FATAL: SGLang not ready"
  tail -30 /workspace/sglang.log
  echo "SGLANG_FAILED" > "$OUTPUT_DIR/FAILED"
  exit 1
fi

# ─── 5. Install training deps ──────────────────────────────────────────
if [ ! -f /root/train/bin/python ]; then
  echo "── installing training deps ──"
  python3 -m venv --system-site-packages /root/train
  /root/train/bin/pip install --upgrade pip -q
  /root/train/bin/pip install torch transformers peft bitsandbytes accelerate -q 2>&1 | tail -3
fi
echo "training deps OK"

# ─── 6. Run the training ───────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  STARTING GRPO TRAINING (mode=$MODE, steps=$STEPS)"
echo "═══════════════════════════════════════════════════════════════"

CUDA_VISIBLE_DEVICES=0 /root/train/bin/python -c "
import sys, os
sys.path.insert(0, '/workspace/repo/scripts')
os.chdir('/workspace/repo')

from grpo_null_loop import main
sys.argv = ['grpo_null_loop.py',
    '--mode', '$MODE',
    '--sglang-url', '$SGLANG_URL',
    '--repo-root', '/workspace/repo',
    '--model-path', '$MODEL_PATH',
    '--output-dir', '$OUTPUT_DIR',
    '--steps', '$STEPS',
    '--group-size', '4',
    '--eval-at', '10,20,30',
    '--max-completion-len', '2048',
]
exit(main())
" 2>&1

TRAIN_RC=$?
echo "training exit code: $TRAIN_RC"

if [ "$TRAIN_RC" -eq 0 ]; then
  echo "SUCCESS"
  date -u > "$OUTPUT_DIR/DONE"
else
  echo "FAILURE (rc=$TRAIN_RC)"
  echo "TRAIN_RC=$TRAIN_RC" > "$OUTPUT_DIR/FAILED"
fi

echo "═══════════════════════════════════════════════════════════════"
echo "  FINISHED — $(date -u)"
echo "═══════════════════════════════════════════════════════════════"
