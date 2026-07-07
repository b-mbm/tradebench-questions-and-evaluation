#!/usr/bin/env bash
# run_training.sh — Self-contained training script for the null-reward control.
# Run on the 2xH100 pod via Web Terminal: bash /workspace/repo/scripts/run_training.sh
#
# Does everything: install deps, smoke test, null-reward control, eval.
# SGLang must already be running on GPU 0 (port 8000).
set -e

REPO="/workspace/repo"
cd "$REPO"

echo "═══════════════════════════════════════════════════════════════"
echo "  NULL-REWARD CONTROL TRAINING — $(date -u)"
echo "═══════════════════════════════════════════════════════════════"

# ─── 1. Verify SGLang is up ──────────────────────────────────────
echo "── checking SGLang ──"
if ! curl -sf http://127.0.0.1:8000/v1/models | grep -q "local-qwen36"; then
  echo "FATAL: SGLang not running on port 8000. Start it first."
  exit 1
fi
echo "SGLang OK"

# ─── 2. Install npm deps (for tsx grader) ────────────────────────
if [ ! -d node_modules ]; then
  echo "── installing npm deps ──"
  npm install --silent 2>&1 | tail -2
fi
echo "npm OK"

# ─── 3. Install training deps ────────────────────────────────────
if [ ! -f /root/train/bin/python ]; then
  echo "── creating training venv ──"
  python3 -m venv --system-site-packages /root/train
  /root/train/bin/pip install --upgrade pip -q
  /root/train/bin/pip install torch transformers peft bitsandbytes accelerate datasets 2>&1 | tail -3
fi
echo "training deps OK"

# ─── 4. Run smoke test (3 steps) ─────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  SMOKE TEST (3 steps, real reward)"
echo "═══════════════════════════════════════════════════════════════"

CUDA_VISIBLE_DEVICES=1 /root/train/bin/python scripts/grpo_null_loop.py \
  --mode smoke \
  --sglang-url http://127.0.0.1:8000 \
  --repo-root "$REPO" \
  --model-path /workspace/models/qwen3.6-27b \
  --output-dir /workspace/smoke-test \
  --steps 3 \
  --group-size 4 \
  2>&1 | tee /workspace/smoke-test.log

SMOKE_RC=${PIPESTATUS[0]}
if [ "$SMOKE_RC" -ne 0 ]; then
  echo "SMOKE TEST FAILED (rc=$SMOKE_RC)"
  echo "SMOKE_FAILED" > /workspace/SMOKE_RESULT
  exit 1
fi
echo "SMOKE_TEST_PASSED" > /workspace/SMOKE_RESULT
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  SMOKE TEST PASSED — proceeding to null-reward control"
echo "═══════════════════════════════════════════════════════════════"

# ─── 5. Run null-reward control (30 steps) ───────────────────────
echo ""
CUDA_VISIBLE_DEVICES=1 /root/train/bin/python scripts/grpo_null_loop.py \
  --mode null \
  --sglang-url http://127.0.0.1:8000 \
  --repo-root "$REPO" \
  --model-path /workspace/models/qwen3.6-27b \
  --output-dir /workspace/null-reward \
  --steps 30 \
  --group-size 8 \
  --eval-at "10,20,30" \
  2>&1 | tee /workspace/null-reward.log

NULL_RC=${PIPESTATUS[0]}
if [ "$NULL_RC" -ne 0 ]; then
  echo "NULL-REWARD FAILED (rc=$NULL_RC)"
  echo "NULL_FAILED" > /workspace/NULL_RESULT
  exit 1
fi

echo "NULL_REWARD_DONE" > /workspace/NULL_RESULT
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  COMPLETE — results in /workspace/null-reward/"
echo "  $(date -u)"
echo "═══════════════════════════════════════════════════════════════"
