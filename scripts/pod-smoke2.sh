#!/usr/bin/env bash
# Quick 2Q smoke to confirm serve produces clean output post-JIT before the full 29.
# 2 questions × base+sft = 4 rows. Should take ~3-4 min.
set -u
WS=/workspace
OUT="$WS/runpod-run/smoke2"
rm -rf "$OUT"; mkdir -p "$OUT"
cd "$WS"
echo "=== SMOKE2 start $(date -u) ==="
TRANSPORT_RETRIES=6 \
MAX_MODEL_LEN=32768 \
BUDGET_LADDER=26000,31000 \
CONCURRENCY=4 \
MODELS="local-qwen36-27b-base,local-qwen36-27b-sft" \
IDS="L9-001,L10-001" \
OUT_DIR="$OUT" \
PROMPTS_FILE="$WS/prompts-300q.json" \
"$WS/venv/bin/python" "$WS/runpod-runner.py" > "$OUT/runner.log" 2>&1
RC=$?
echo "=== SMOKE2 done $(date -u) rc=$RC ==="
echo "rows: $(wc -l < "$OUT/generations.jsonl" 2>/dev/null || echo 0)"
echo "RUN_DONE" > "$OUT/RUN_DONE"
