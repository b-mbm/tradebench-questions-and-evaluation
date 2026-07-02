#!/usr/bin/env bash
# Bulletproof SFT v3 training startup — runs as container start-command.
# Survives SSH disconnect, lid close, internet drop. Child of PID 1.
# Writes a DONE flag to the volume when training completes.
set -u
WS=/workspace
LOG="$WS/train-v3.log"
DONE_FLAG="$WS/train-v3-DONE"

echo "=== TRAIN STARTUP $(date -u) ==="

# ninja symlink (in case we serve after training)
ln -sf "$WS/vllm/bin/ninja" /usr/local/bin/ninja 2>/dev/null

# Install training venv if not present
if [ ! -f "$WS/train-venv/bin/python" ]; then
  echo "Installing training venv..."
  python3 -m venv --system-site-packages "$WS/train-venv"
  "$WS/train-venv/bin/pip" install --upgrade pip -q
  "$WS/train-venv/bin/pip" install "trl>=0.21" "peft>=0.14" "bitsandbytes>=0.45" "accelerate>=1.4" "datasets>=3.0" -q 2>&1 | tail -2
fi

# Start SSH for later debugging (non-blocking)
ssh-keygen -A 2>/dev/null
mkdir -p /root/.ssh
cat /root/.ssh/authorized_keys 2>/dev/null || true
/usr/sbin/sshd 2>/dev/null

# Run training
echo "=== STARTING SFT v3 TRAINING $(date -u) ==="
"$WS/train-venv/bin/python" "$WS/train-sft-v3.py" > "$LOG" 2>&1
RC=$?

if [ $RC -eq 0 ]; then
  echo "TRAIN_SUCCESS rc=$RC $(date -u)" > "$DONE_FLAG"
  echo "=== TRAINING SUCCESS ==="
else
  echo "TRAIN_FAILED rc=$RC $(date -u)" > "$DONE_FLAG"
  echo "=== TRAINING FAILED (rc=$RC) ==="
fi
