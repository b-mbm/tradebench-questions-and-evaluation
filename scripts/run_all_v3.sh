#!/usr/bin/env bash
# run_all_v3.sh — Self-contained GRPO training with LOG ACCESS via HTTP proxy.
#
# KEY FIX: A simple Python HTTP server runs on port 8000 (the proxied port)
# that serves the log files. SGLang runs on port 30000 (localhost only).
# This way, even if SGLang crashes, we can read the error via:
#   https://<podId>-8000.proxy.runpod.net/grpo-results.log
#   https://<podId>-8000.proxy.runpod.net/sglang.log
#
# Usage: curl -sL <gist-url> | bash
set -u

REPO_URL="https://github.com/b-mbm/tradebench-questions-and-evaluation.git"
BRANCH="phase0-grpo-preconditions"
MODEL_PATH="/workspace/models/qwen3.6-27b"
OUTPUT_DIR="/workspace/grpo-results"
SGLANG_PORT=30000
SGLANG_URL="http://127.0.0.1:${SGLANG_PORT}"
LOG="/workspace/grpo-results.log"

mkdir -p "$OUTPUT_DIR"
exec > >(tee -a "$LOG") 2>&1
echo "═══════════════════════════════════════════════════════════════"
echo "  GRPO v3 — LOG ACCESSIBLE via HTTP proxy — $(date -u)"
echo "═══════════════════════════════════════════════════════════════"

# ─── 0. Start log server on port 8000 IMMEDIATELY ───────────────────────
# This serves /workspace/*.log files so we can debug via the HTTP proxy.
echo "Starting log server on port 8000..."
python3 -c "
import http.server, os, socketserver
os.chdir('/workspace')
class LogHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()
    def log_message(self, format, *args): pass
socketserver.TCPServer(('0.0.0.0', 8000), LogHandler).serve_forever()
" &
LOG_SERVER_PID=$!
echo "Log server started (PID $LOG_SERVER_PID) — access logs at https://<podId>-8000.proxy.runpod.net/"

# ─── 1. Clone or update repo + install Node + npm install ───────────────
# Install Node.js (not included in the RunPod pytorch image)
if ! command -v npm &>/dev/null; then
  echo "── installing Node.js ──"
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash - 2>&1 | tail -2
  apt-get install -y nodejs 2>&1 | tail -2
fi

if [ ! -d /workspace/repo/.git ]; then
  echo "── cloning repo ──"
  rm -rf /workspace/repo
  git clone --depth 1 -b "$BRANCH" "$REPO_URL" /workspace/repo 2>&1 | tail -3
else
  echo "── updating existing repo (resume) ──"
  cd /workspace/repo && git fetch origin && git reset --hard origin/"$BRANCH" 2>&1 | tail -3
fi
# CRITICAL: npm install for the TS grader (tsx + fastest-levenshtein)
if [ ! -d /workspace/repo/node_modules ] || [ ! -f /workspace/repo/node_modules/.package-lock.json ]; then
  echo "── npm install (for TS grader) ──"
  cd /workspace/repo && npm install --silent 2>&1 | tail -3
fi
echo "repo + npm OK"
echo "repo OK"

# ─── 2. Ninja + SGLang ──────────────────────────────────────────────────
ln -sf /workspace/vllm/bin/ninja /usr/local/bin/ninja 2>/dev/null || true
export PATH="/usr/local/bin:/root/sglang/bin:$PATH"
if [ ! -f /root/sglang/bin/sglang ]; then
  echo "── installing SGLang ──"
  python3 -m venv --system-site-packages /root/sglang
  /root/sglang/bin/pip install --upgrade pip -q
  /root/sglang/bin/pip install "sglang[all]" -q 2>&1 | tail -2
  /root/sglang/bin/pip install ninja -q
  ln -sf /root/sglang/bin/ninja /usr/local/bin/ninja
fi
echo "SGLang OK"

# ─── 3. Start SGLang on GPU 0, port 30000 ───────────────────────────────
echo "── starting SGLang on GPU 0 (port $SGLANG_PORT) ──"
CUDA_VISIBLE_DEVICES=0 nohup /root/sglang/bin/sglang serve \
  --model-path "$MODEL_PATH" \
  --served-model-name local-qwen36-27b-base \
  --dtype bfloat16 \
  --context-length 32768 \
  --mem-fraction-static 0.82 \
  --reasoning-parser qwen3 \
  --disable-cuda-graph \
  --port "$SGLANG_PORT" \
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
  echo "FATAL: SGLang not ready. Check /workspace/sglang.log"
  echo "SGLANG_FAILED" > "$OUTPUT_DIR/FAILED"
  exit 1
fi

# ─── 4. Install training deps ───────────────────────────────────────────
if [ ! -f /root/train/bin/python ]; then
  echo "── installing training deps ──"
  python3 -m venv --system-site-packages /root/train
  /root/train/bin/pip install --upgrade pip -q
  /root/train/bin/pip install torch transformers peft bitsandbytes accelerate numpy requests -q 2>&1 | tail -3
fi
echo "training deps OK"

# ─── 5. Run training (GPU 1) ────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  STARTING GRPO SMOKE TEST (3 steps, real reward)"
echo "═══════════════════════════════════════════════════════════════"

# NOTE: Do NOT set CUDA_VISIBLE_DEVICES here. Let the training see both GPUs
# and use device_map to target GPU 1 explicitly (avoids "invalid device ordinal" bug).
/root/train/bin/python -c "
import sys, os
sys.path.insert(0, '/workspace/repo/scripts')
os.chdir('/workspace/repo')
from grpo_null_loop import main
sys.argv = ['grpo_null_loop.py',
    '--mode', 'smoke',
    '--sglang-url', '$SGLANG_URL',
    '--repo-root', '/workspace/repo',
    '--model-path', '$MODEL_PATH',
    '--output-dir', '$OUTPUT_DIR',
    '--steps', '1',
    '--group-size', '2',
    '--eval-at', '',
    '--max-completion-len', '2048',
    '--train-ids', 'L10-017',
]
exit(main())
" 2>&1

TRAIN_RC=$?
echo "training exit code: $TRAIN_RC"
if [ "$TRAIN_RC" -eq 0 ]; then
  date -u > "$OUTPUT_DIR/DONE"
  echo "SUCCESS — results in $OUTPUT_DIR"
else
  echo "FAILURE (rc=$TRAIN_RC) — check logs at https://<podId>-8000.proxy.runpod.net/"
  echo "TRAIN_RC=$TRAIN_RC" > "$OUTPUT_DIR/FAILED"
fi
echo "═══════════════════════════════════════════════════════════════"
echo "  FINISHED — $(date -u)"
echo "═══════════════════════════════════════════════════════════════"
