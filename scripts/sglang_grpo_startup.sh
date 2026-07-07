#!/usr/bin/env bash
# sglang_grpo_startup.sh — self-contained dockerArgs script for SGLang + TRL GRPO.
#
# Runs entirely inside the container (no SSH). Writes all results to /workspace/.
# The operator polls /workspace/null-reward/DONE (via web terminal or next-pod mount).
#
# USAGE (set via RunPod env vars or edit defaults below):
#   MODE=null|smoke     (null=30 steps shuffled reward; smoke=3 steps real reward)
#   Everything else is derived from the repo on the volume.
#
# ARCHITECTURE:
#   GPU 0: SGLang serve (Qwen3.6-27B, thinking ON, json_object)
#   GPU 1: TRL GRPOTrainer (QLoRA 4-bit) — talks to SGLang for rollouts
#   weight-sync glue: after each step, LoRA → merge → SGLang /update_weights_from_disk
#
set -u

echo "════════════════════════════════════════════════════════════════"
echo "  SGLANG + TRL GRPO STARTUP — $(date -u)"
echo "════════════════════════════════════════════════════════════════"

MODE="${MODE:-null}"
REPO_ROOT="${REPO_ROOT:-/workspace/repo}"
MODEL_PATH="${MODEL_PATH:-/workspace/models/qwen3.6-27b}"
OUTPUT_DIR="${OUTPUT_DIR:-/workspace/null-reward}"
SGLANG_URL="${SGLANG_URL:-http://127.0.0.1:8000}"
STEPS="${STEPS:-}"

echo "MODE=$MODE  REPO_ROOT=$REPO_ROOT  MODEL_PATH=$MODEL_PATH"
echo "OUTPUT_DIR=$OUTPUT_DIR  SGLANG_URL=$SGLANG_URL"

mkdir -p "$OUTPUT_DIR"
cd "$REPO_ROOT"

# ─── 1. Environment: ninja for Triton JIT (GDN kernels) ───────────────────
echo "── ninja / Triton JIT prep ──"
ln -sf /workspace/vllm/bin/ninja /usr/local/bin/ninja 2>/dev/null || true
ln -sf /root/sglang/bin/ninja /usr/local/bin/ninja 2>/dev/null || true
export PATH="/usr/local/bin:/root/sglang/bin:$PATH"
which ninja && ninja --version || echo "WARN: ninja missing"

# ─── 2. SGLang venv (GPU 0) ───────────────────────────────────────────────
if [ ! -f /root/sglang/bin/sglang ]; then
  echo "── installing SGLang ──"
  python3 -m venv --system-site-packages /root/sglang
  /root/sglang/bin/pip install --upgrade pip -q
  /root/sglang/bin/pip install "sglang[all]" -q 2>&1 | tail -3
  /root/sglang/bin/pip install ninja -q
  ln -sf /root/sglang/bin/ninja /usr/local/bin/ninja
fi

# ─── 3. TRL venv (GPU 1) ─────────────────────────────────────────────────
if [ ! -f /root/trl/bin/python ]; then
  echo "── installing TRL ──"
  python3 -m venv --system-site-packages /root/trl
  /root/trl/bin/pip install --upgrade pip -q
  /root/trl/bin/pip install "trl>=0.16" "transformers>=4.46" peft datasets accelerate bitsandbytes -q 2>&1 | tail -3
fi

# ─── 4. Node/tsx for the grader subprocess ───────────────────────────────
if ! command -v node >/dev/null 2>&1; then
  echo "── installing Node ──"
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash - 2>&1 | tail -2
  apt-get install -y nodejs 2>&1 | tail -2
fi
if [ -f "$REPO_ROOT/package.json" ]; then
  cd "$REPO_ROOT"
  [ -d node_modules ] || npm install --silent 2>&1 | tail -3
fi

# ─── 5. Start SGLang on GPU 0 (background, proven config) ────────────────
echo "── starting SGLang serve on GPU 0 ──"
export CUDA_VISIBLE_DEVICES=0
nohup /root/sglang/bin/sglang serve \
  --model-path "$MODEL_PATH" \
  --served-model-name local-qwen36-27b-base \
  --dtype bfloat16 \
  --context-length 32768 \
  --mem-fraction-static 0.82 \
  --reasoning-parser qwen3 \
  --disable-cuda-graph \
  --port 8000 \
  --trust-remote-code \
  --host 0.0.0.0 \
  > "$OUTPUT_DIR/sglang-serve.log" 2>&1 &
SGLANG_PID=$!
echo "sglang pid: $SGLANG_PID"

# Wait for SGLang to be ready (poll /v1/models)
echo "── waiting for SGLang to be ready (up to 10 min) ──"
for i in $(seq 1 120); do
  if curl -sf "$SGLANG_URL/v1/models" >/dev/null 2>&1; then
    echo "SGLang ready after ${i}x5s"
    break
  fi
  if ! kill -0 $SGLANG_PID 2>/dev/null; then
    echo "FATAL: SGLang process died during startup"
    tail -50 "$OUTPUT_DIR/sglang-serve.log"
    echo "SGLANG_DIED" > "$OUTPUT_DIR/FAILED"
    exit 1
  fi
  sleep 5
done
if ! curl -sf "$SGLANG_URL/v1/models" >/dev/null 2>&1; then
  echo "FATAL: SGLang not ready after 10 min"
  tail -50 "$OUTPUT_DIR/sglang-serve.log"
  echo "SGLANG_TIMEOUT" > "$OUTPUT_DIR/FAILED"
  exit 1
fi

# ─── 6. Switch to GPU 1 for training ─────────────────────────────────────
echo "── switching to GPU 1 for TRL training ──"
export CUDA_VISIBLE_DEVICES=1
unset CUDA_VISIBLE_DEVICES
export CUDA_VISIBLE_DEVICES=1

# ─── 7. Run the null-reward control ──────────────────────────────────────
cd "$REPO_ROOT"
STEPS_ARG=""
[ -n "$STEPS" ] && STEPS_ARG="--steps $STEPS"

echo "── launching null_reward_control.py (mode=$MODE) ──"
/root/trl/bin/python scripts/null_reward_control.py \
  --mode "$MODE" \
  --sglang-url "$SGLANG_URL" \
  --repo-root "$REPO_ROOT" \
  --model-path "$MODEL_PATH" \
  --output-dir "$OUTPUT_DIR" \
  $STEPS_ARG \
  2>&1 | tee "$OUTPUT_DIR/training.log"

TRAIN_RC=${PIPESTATUS[0]}
echo "training exit code: $TRAIN_RC"

# ─── 8. Tear down SGLang ─────────────────────────────────────────────────
kill $SGLANG_PID 2>/dev/null || true

if [ "$TRAIN_RC" -eq 0 ]; then
  echo "SUCCESS — results in $OUTPUT_DIR"
  date -u > "$OUTPUT_DIR/DONE"
else
  echo "FAILURE (rc=$TRAIN_RC) — see $OUTPUT_DIR/training.log"
  echo "TRAIN_RC=$TRAIN_RC" > "$OUTPUT_DIR/FAILED"
fi

echo "════════════════════════════════════════════════════════════════"
echo "  FINISHED — $(date -u)"
echo "════════════════════════════════════════════════════════════════"