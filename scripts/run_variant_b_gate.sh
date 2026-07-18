#!/usr/bin/env bash
# run_variant_b_gate.sh — Run variant B prompt on the full 175-gate
# Starts SGLang, runs 175 questions with variant B prompts, grades, writes DONE
set -u

REPO_URL="https://github.com/b-mbm/tradebench-questions-and-evaluation.git"
BRANCH="phase0-grpo-preconditions"
MODEL_PATH="/workspace/models/qwen3.6-27b"
SGLANG_PORT=30000
SGLANG_URL="http://127.0.0.1:${SGLANG_PORT}"
LOG="/workspace/variant-b-gate.log"

mkdir -p /workspace/results/variant-b-gate
exec > >(tee -a "$LOG") 2>&1
echo "═══════════════════════════════════════════════════════════════"
echo "  VARIANT B FULL 175-GATE — $(date -u)"
echo "═══════════════════════════════════════════════════════════════"

# ─── 0. Log server ─────────────────────────────────────────────────────
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
  echo "SGLANG_FAILED" > /workspace/results/variant-b-gate/FAILED
  exit 1
fi

# ─── 4. Run the 175-gate eval with variant B prompts ───────────────────
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  RUNNING VARIANT B ON 175-GATE"
echo "═══════════════════════════════════════════════════════════════"

cd /workspace/repo

# Run the benchmark runner with variant B prompts
OUT_DIR=/workspace/results/variant-b-gate
IDS=$(cat results/grpo-preconditions/gate-eval-ids.txt | tr '\n' ',' | sed 's/,$//')

PROBE_ENDPOINT="$SGLANG_URL" \
IDS="$IDS" \
OUT_DIR="$OUT_DIR" \
MODELS=local-qwen36-27b-base \
ENABLE_THINKING=1 \
CONCURRENCY=4 \
BUDGET_LADDER=8000,16000,24000 \
TRANSPORT_RETRIES=6 \
TEMPERATURE=0.1 \
PROMPTS_FILE=prompts-300q-variantB.json \
python3 scripts/run-sglang-concurrent.py 2>&1 | tail -20

EVAL_RC=$?
echo "Eval exit code: $EVAL_RC"

# ─── 5. Grade ───────────────────────────────────────────────────────────
echo ""
echo "── grading variant B results ──"

# Build outputs.json from results.jsonl
python3 -c "
import json
outputs = {}
with open('$OUT_DIR/results.jsonl') as f:
    for line in f:
        r = json.loads(line)
        outputs[r['questionId']] = r['raw']
with open('$OUT_DIR/outputs.json', 'w') as f:
    json.dump(outputs, f)
print(f'Built outputs.json with {len(outputs)} responses')
"

npx tsx scripts/grade-300q.ts "$OUT_DIR/outputs.json" 2>&1 | tee "$OUT_DIR/grade-output.txt"

# ─── 6. Compare to baseline ─────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  RESULTS COMPARISON"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Baseline (variant A, de22a08 grader): 131/175"
echo "Variant B result:"
tail -15 "$OUT_DIR/grade-output.txt"

if [ -f "$OUT_DIR/outputs.json" ]; then
  date -u > "$OUT_DIR/DONE"
  echo "SUCCESS — results in $OUT_DIR"
  echo "Check: https://<podId>-8000.proxy.runpod.net/results/variant-b-gate/grade-output.txt"
else
  echo "FAILURE — check logs"
  echo "EVAL_FAILED" > "$OUT_DIR/FAILED"
fi

echo "═══════════════════════════════════════════════════════════════"
echo "  FINISHED — $(date -u)"
echo "═══════════════════════════════════════════════════════════════"
echo "Container staying alive 10 min for log access, then will stop."
sleep 600
echo "10 min passed — exiting."
exit 0
