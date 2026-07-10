#!/usr/bin/env bash
# run_prompt_ab_test.sh — Self-contained prompt A/B test
# Starts SGLang, runs 17-question A/B, writes DONE flag
set -u

REPO_URL="https://github.com/b-mbm/tradebench-questions-and-evaluation.git"
BRANCH="phase0-grpo-preconditions"
MODEL_PATH="/workspace/models/qwen3.6-27b"
SGLANG_PORT=30000
SGLANG_URL="http://127.0.0.1:${SGLANG_PORT}"
LOG="/workspace/prompt-ab-test.log"

mkdir -p /workspace/results/prompt-ab-test
exec > >(tee -a "$LOG") 2>&1
echo "═══════════════════════════════════════════════════════════════"
echo "  PROMPT A/B TEST — $(date -u)"
echo "═══════════════════════════════════════════════════════════════"

# ─── 0. Log server on port 8000 ─────────────────────────────────────────
echo "Starting log server on port 8000..."
nohup python3 -c "
import http.server, os, socketserver, signal
signal.signal(signal.SIGHUP, signal.SIG_IGN)
os.chdir('/workspace')
class LogHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()
    def log_message(self, format, *args): pass
socketserver.TCPServer.allow_reuse_address = True
socketserver.TCPServer(('0.0.0.0', 8000), LogHandler).serve_forever()
" > /workspace/logserver.out 2>&1 &
disown
sleep 2
echo "Log server started"

# ─── 1. Clone repo + npm install ────────────────────────────────────────
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
  echo "── updating repo ──"
  cd /workspace/repo && git fetch origin && git reset --hard origin/"$BRANCH" 2>&1 | tail -3
fi

if [ ! -d /workspace/repo/node_modules ]; then
  echo "── npm install ──"
  cd /workspace/repo && npm install --silent 2>&1 | tail -3
fi
echo "repo + npm OK"

# ─── 2. SGLang ──────────────────────────────────────────────────────────
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

# ─── 3. Start SGLang ────────────────────────────────────────────────────
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
  echo "FATAL: SGLang not ready"
  echo "SGLANG_FAILED" > /workspace/results/prompt-ab-test/FAILED
  exit 1
fi

# ─── 4. Run the A/B test ────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  RUNNING PROMPT A/B TEST (17 questions × 2 variants)"
echo "═══════════════════════════════════════════════════════════════"

cd /workspace/repo
python3 scripts/prompt-ab-test.py \
  --sglang-url "$SGLANG_URL" \
  --output-dir /workspace/results/prompt-ab-test \
  --temperature 0.1 \
  --max-tokens 8000 \
  --concurrency 4 \
  2>&1

AB_RC=$?
echo "A/B test exit code: $AB_RC"

if [ -f /workspace/results/prompt-ab-test/ab-summary.json ]; then
  date -u > /workspace/results/prompt-ab-test/DONE
  echo "SUCCESS — results in /workspace/results/prompt-ab-test/"
  echo "Check: https://<podId>-8000.proxy.runpod.net/results/prompt-ab-test/ab-summary.json"
else
  echo "FAILURE — check logs"
  echo "AB_FAILED" > /workspace/results/prompt-ab-test/FAILED
fi

echo "═══════════════════════════════════════════════════════════════"
echo "  FINISHED — $(date -u)"
echo "═══════════════════════════════════════════════════════════════"
echo "Container staying alive 10 min for log access, then will stop."
sleep 600
echo "10 min passed — exiting."
exit 0
