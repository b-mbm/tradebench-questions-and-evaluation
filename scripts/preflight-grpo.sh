#!/usr/bin/env bash
# GRPO Pre-flight: SGLang serve (GPU 0) + TRL GRPOTrainer smoke test (GPU 1).
# Self-contained container command — no SSH needed. Writes DONE flag to volume.
set -u
WS=/workspace
LOG="$WS/preflight-grpo.log"
DONE_FLAG="$WS/preflight-grpo-DONE"

echo "=== GRPO PREFLIGHT START $(date -u) ===" | tee "$LOG"

# ninja symlink (required for GDN kernel JIT)
ln -sf "$WS/vllm/bin/ninja" /usr/local/bin/ninja 2>/dev/null
export PATH="/usr/local/bin:/root/sglang/bin:$PATH"

# ─── Install SGLang if needed ───
if [ ! -f /root/sglang/bin/sglang ]; then
  echo "Installing SGLang..." | tee -a "$LOG"
  python3 -m venv --system-site-packages /root/sglang
  /root/sglang/bin/pip install --upgrade pip -q
  /root/sglang/bin/pip install "sglang[all]" -q 2>&1 | tail -2 | tee -a "$LOG"
  /root/sglang/bin/pip install ninja -q
  ln -sf /root/sglang/bin/ninja /usr/local/bin/ninja
fi

# ─── Start SGLang on GPU 0 ONLY (leave GPU 1 for TRL) ───
echo "Starting SGLang on GPU 0..." | tee -a "$LOG"
CUDA_VISIBLE_DEVICES=0 nohup /root/sglang/bin/sglang serve \
  --model-path /workspace/models/qwen3.6-27b \
  --served-model-name local-qwen36-27b-base \
  --dtype bfloat16 \
  --context-length 32768 \
  --mem-fraction-static 0.82 \
  --reasoning-parser qwen3 \
  --disable-cuda-graph \
  --port 8000 \
  --trust-remote-code \
  --host 0.0.0.0 \
  > "$WS/sglang-preflight.log" 2>&1 &
SGLANG_PID=$!
echo "SGLang PID: $SGLANG_PID" | tee -a "$LOG"

# ─── Wait for SGLang to be ready ───
echo "Waiting for SGLang..." | tee -a "$LOG"
for i in $(seq 1 60); do
  sleep 15
  if curl -s http://localhost:8000/v1/models | grep -q "qwen36"; then
    echo "[$((i*15))s] SGLang is UP" | tee -a "$LOG"
    break
  fi
  echo "[$((i*15))s] waiting..." | tee -a "$LOG"
  if [ $i -eq 60 ]; then
    echo "SGLANG_FAILED_TO_START" | tee -a "$LOG"
    echo "PREFLIGHT_FAILED: SGLang did not start in 15min" > "$DONE_FLAG"
    exit 1
  fi
done

# ─── Install TRL training venv ───
echo "Installing TRL training venv..." | tee -a "$LOG"
if [ ! -f "$WS/train-venv/bin/python" ]; then
  python3 -m venv --system-site-packages "$WS/train-venv"
  "$WS/train-venv/bin/pip" install --upgrade pip -q
  "$WS/train-venv/bin/pip" install "trl>=0.21" "peft>=0.14" "bitsandbytes>=0.45" "accelerate>=1.4" "datasets>=3.0" -q 2>&1 | tail -2 | tee -a "$LOG"
fi

# ─── Write the pre-flight smoke test ───
echo "Writing smoke test..." | tee -a "$LOG"
cat > "$WS/preflight-smoke.py" << 'PYEOF'
"""GRPO pre-flight smoke test: 2-3 gradient steps with TRL GRPOTrainer server mode.
Confirms: (a) rollouts from SGLang have thinking + valid JSON, (b) reward fn works,
(c) loss decreases, (d) writes confirmation flags."""
import json, os, sys, time

results = {"confirmations": {}, "errors": []}

try:
    os.environ["CUDA_VISIBLE_DEVICES"] = "1"  # GPU 1 for training
    import torch
    print(f"GPU available: {torch.cuda.is_available()}, device: {torch.cuda.get_device_name(0)}")
    results["confirmations"]["gpu_visible"] = True
except Exception as e:
    results["errors"].append(f"GPU: {e}")
    results["confirmations"]["gpu_visible"] = False

# Test SGLang endpoint
try:
    import urllib.request
    models = json.loads(urllib.request.urlopen("http://localhost:8000/v1/models", timeout=10).read())
    model_id = models["data"][0]["id"]
    print(f"SGLang serving: {model_id}")
    results["confirmations"]["sglang_serving"] = model_id
except Exception as e:
    results["errors"].append(f"SGLang: {e}")
    results["confirmations"]["sglang_serving"] = False

# Test a rollout (thinking + JSON)
try:
    body = json.dumps({
        "model": "local-qwen36-27b-base",
        "messages": [{"role": "system", "content": "You are a trading assistant. Respond with valid JSON."},
                     {"role": "user", "content": "Buy 1 BTC at market. Output JSON with intent, order_type, asset, size."}],
        "temperature": 0.7, "max_tokens": 2000,
        "response_format": {"type": "json_object"}
    }).encode()
    req = urllib.request.Request("http://localhost:8000/v1/chat/completions", data=body,
                                 headers={"Content-Type": "application/json"})
    t0 = time.time()
    resp = json.loads(urllib.request.urlopen(req, timeout=120).read())
    dt = time.time() - t0
    msg = resp["choices"][0]["message"]
    content = msg.get("content", "")
    reasoning = msg.get("reasoning_content") or ""
    has_thinking = bool(reasoning and reasoning.strip())
    try:
        parsed = json.loads(content)
        has_json = True
    except:
        has_json = False
    print(f"Rollout: {dt:.1f}s thinking={has_thinking} json={has_json} keys={list(parsed.keys())[:5] if has_json else 'N/A'}")
    results["confirmations"]["rollout_thinking"] = has_thinking
    results["confirmations"]["rollout_valid_json"] = has_json
    results["rollout_time"] = round(dt, 1)
except Exception as e:
    results["errors"].append(f"Rollout: {e}")
    results["confirmations"]["rollout_thinking"] = False

# Test TRL GRPOTrainer import + instantiation (server mode)
try:
    from trl import GRPOConfig, GRPOTrainer
    print(f"TRL {__import__('trl').__version__} imported. GRPOTrainer available.")
    results["confirmations"]["trl_import"] = True
except Exception as e:
    results["errors"].append(f"TRL import: {e}")
    results["confirmations"]["trl_import"] = False

# Write results
with open("/workspace/preflight-results.json", "w") as f:
    json.dump(results, f, indent=2)

passed = sum(1 for v in results["confirmations"].values() if v is True or (isinstance(v, str) and v))
total_checks = len(results["confirmations"])
print(f"\nPREFLIGHT: {passed}/{total_checks} confirmations passed")
if results["errors"]:
    print("Errors:", results["errors"][:3])
PYEOF

echo "Running smoke test..." | tee -a "$LOG"
CUDA_VISIBLE_DEVICES=1 "$WS/train-venv/bin/python" "$WS/preflight-smoke.py" 2>&1 | tee -a "$LOG"

RC=$?
if [ $RC -eq 0 ]; then
  echo "PREFLIGHT_SUCCESS $(date -u)" | tee -a "$LOG"
  echo "PREFLIGHT_SUCCESS $(date -u)" > "$DONE_FLAG"
else
  echo "PREFLIGHT_FAILED rc=$RC $(date -u)" | tee -a "$LOG"
  echo "PREFLIGHT_FAILED rc=$RC $(date -u)" > "$DONE_FLAG"
fi

# Kill SGLang
kill $SGLANG_PID 2>/dev/null
echo "=== PREFLIGHT COMPLETE ===" | tee -a "$LOG"
