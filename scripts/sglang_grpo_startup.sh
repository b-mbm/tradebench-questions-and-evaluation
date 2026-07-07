#!/usr/bin/env bash
# sglang_grpo_startup.sh — self-contained dockerArgs script.
#
# MODES:
#   baseline — SGLang serve only (for Phase B variance + Option D probe)
#   train    — SGLang serve (GPU 0) + hand-rolled GRPO loop (GPU 1)
#   smoke    — train mode, 2-3 steps only
#
# All results to /workspace/ (persistent volume). Operator polls
# /workspace/<OUTPUT_DIR>/DONE (via web terminal or next-pod mount).
#
set -u

echo "════════════════════════════════════════════════════════════════"
echo "  SGLANG STARTUP — $(date -u) — MODE=${MODE:-baseline}"
echo "════════════════════════════════════════════════════════════════"

MODE="${MODE:-baseline}"
REPO_ROOT="${REPO_ROOT:-/workspace/repo}"
MODEL_PATH="${MODEL_PATH:-/workspace/models/qwen3.6-27b}"
OUTPUT_DIR="${OUTPUT_DIR:-/workspace/null-reward}"
SGLANG_URL="${SGLANG_URL:-http://127.0.0.1:8000}"

mkdir -p "$OUTPUT_DIR"
cd "$REPO_ROOT"

# ─── 1. ninja for Triton JIT (GDN kernels) ───────────────────────────────
ln -sf /workspace/vllm/bin/ninja /usr/local/bin/ninja 2>/dev/null || true
ln -sf /root/sglang/bin/ninja /usr/local/bin/ninja 2>/dev/null || true
export PATH="/usr/local/bin:/root/sglang/bin:$PATH"

# ─── 2. SGLang venv ──────────────────────────────────────────────────────
if [ ! -f /root/sglang/bin/sglang ]; then
  echo "── installing SGLang ──"
  python3 -m venv --system-site-packages /root/sglang
  /root/sglang/bin/pip install --upgrade pip -q
  /root/sglang/bin/pip install "sglang[all]" -q 2>&1 | tail -3
  /root/sglang/bin/pip install ninja -q
  ln -sf /root/sglang/bin/ninja /usr/local/bin/ninja
fi

# ─── 3. Node/tsx for the grader ──────────────────────────────────────────
if [ -f "$REPO_ROOT/package.json" ]; then
  cd "$REPO_ROOT"
  [ -d node_modules ] || npm install --silent 2>&1 | tail -3
fi

# ─── 4. Start SGLang on GPU 0 ────────────────────────────────────────────
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

echo "── waiting for SGLang to be ready (up to 10 min) ──"
for i in $(seq 1 120); do
  if curl -sf "$SGLANG_URL/v1/models" >/dev/null 2>&1; then
    echo "SGLang ready after ${i}x5s"
    break
  fi
  if ! kill -0 $SGLANG_PID 2>/dev/null; then
    echo "FATAL: SGLang died during startup"; tail -50 "$OUTPUT_DIR/sglang-serve.log"
    echo "SGLANG_DIED" > "$OUTPUT_DIR/FAILED"; exit 1
  fi
  sleep 5
done
if ! curl -sf "$SGLANG_URL/v1/models" >/dev/null 2>&1; then
  echo "FATAL: SGLang not ready after 10 min"; tail -50 "$OUTPUT_DIR/sglang-serve.log"
  echo "SGLANG_TIMEOUT" > "$OUTPUT_DIR/FAILED"; exit 1
fi

# ─── 5. Baseline mode: just serve, no training ───────────────────────────
if [ "$MODE" = "baseline" ]; then
  echo "════════════════════════════════════════════════════════════════"
  echo "  BASELINE MODE — SGLang serving on $SGLANG_URL"
  echo "  Run eval scripts from the web terminal or HTTP proxy."
  echo "  Pod stays alive. Stop manually when done."
  echo "════════════════════════════════════════════════════════════════"
  touch "$OUTPUT_DIR/READY"
  # Keep the container alive
  wait $SGLANG_PID
  exit 0
fi

# ─── 6. Train / smoke mode: GPU 1 training ───────────────────────────────
echo "── switching to GPU 1 for training ──"
export CUDA_VISIBLE_DEVICES=1

# Install training deps
if [ ! -f /root/train/bin/python ]; then
  echo "── installing training deps ──"
  python3 -m venv --system-site-packages /root/train
  /root/train/bin/pip install --upgrade pip -q
  /root/train/bin/pip install torch transformers peft bitsandbytes accelerate datasets -q 2>&1 | tail -3
fi

# Run the hand-rolled loop
cd "$REPO_ROOT"
echo "── launching grpo_null_loop.py (mode=$MODE) ──"
/root/train/bin/python scripts/grpo_null_loop.py \
  --mode "$MODE" \
  --sglang-url "$SGLANG_URL" \
  --repo-root "$REPO_ROOT" \
  --model-path "$MODEL_PATH" \
  --output-dir "$OUTPUT_DIR" \
  --train-ids "${TRAIN_IDS:-}" \
  --steps "${STEPS:-0}" \
  2>&1 | tee "$OUTPUT_DIR/training.log"

TRAIN_RC=${PIPESTATUS[0]}
kill $SGLANG_PID 2>/dev/null || true

if [ "$TRAIN_RC" -eq 0 ]; then
  echo "SUCCESS — results in $OUTPUT_DIR"
  date -u > "$OUTPUT_DIR/DONE"
else
  echo "FAILURE (rc=$TRAIN_RC)"; echo "TRAIN_RC=$TRAIN_RC" > "$OUTPUT_DIR/FAILED"
fi
echo "════════════════════════════════════════════════════════════════"
echo "  FINISHED — $(date -u)"
echo "════════════════════════════════════════════════════════════════"
