#!/usr/bin/env bash
# Run the generator for ONE pass (29 hard-tier Qs × base+sft = 58 rows).
# Usage:  bash /workspace/pod-run-launch.sh <passN>
# TRANSPORT_RETRIES=6 gives 7 total attempts = EXACT parity with OpenRouter (maxRetries=6).
set -u
WS=/workspace
PASS="${1:-pass1}"
OUT="$WS/runpod-run/run30/$PASS"
mkdir -p "$OUT"

# The 29 hard-tier IDs (matches nojson29 gate set; OR reference = 26/29)
IDS="L1-001,L1-002,L2-001,L2-002,L4-001,L6-002,L6-003,L9-001,L9-002,L9-003,L9-004,L9-006,L9-007,L9-008,L9-009,L10-001,L10-002,L10-003,L10-005,L10-007,L10-009,L10-010,L10-012,AGI-001,AGI-002,AGI-003,AGI-004,AGI-014,AGI-024"

cd "$WS"
echo "=== RUNNER start $(date -u) PASS=$PASS OUT=$OUT ==="
TRANSPORT_RETRIES=6 \
MAX_MODEL_LEN=32768 \
BUDGET_LADDER=26000,31000 \
CONCURRENCY=8 \
MODELS="local-qwen36-27b-base,local-qwen36-27b-sft" \
IDS="$IDS" \
OUT_DIR="$OUT" \
PROMPTS_FILE="$WS/prompts-300q.json" \
"$WS/venv/bin/python" "$WS/runpod-runner.py" > "$OUT/runner.log" 2>&1
RC=$?
echo "=== RUNNER done $(date -u) PASS=$PASS rc=$RC ==="
[ $RC -eq 0 ] && echo "RUN_DONE" > "$OUT/RUN_DONE" || echo "RUN_FAILED rc=$RC" > "$OUT/RUN_DONE"
echo "rows: $(wc -l < "$OUT/generations.jsonl" 2>/dev/null || echo 0)"
