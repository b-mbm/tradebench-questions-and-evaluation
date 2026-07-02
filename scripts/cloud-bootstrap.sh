#!/usr/bin/env bash
# Cloud bootstrap — provisions the local-only state an ephemeral cloud Claude Code
# session lacks (secrets + optional training data). Run automatically by the
# SessionStart hook in .claude/settings.json.
#
# SAFE ANYWHERE: it NEVER clobbers an existing local ~/.runpod_key. On your own
# machine it just logs and exits; in a cloud session it fills the gaps from env vars.
#
# Provide these to the cloud environment (claude.ai/code -> environment -> variables):
#   RUNPOD_API_KEY     (required for RunPod ops; our scripts read the file ~/.runpod_key)
#   OPENROUTER_API_KEY (required for OpenRouter runs; the runner reads it from env directly)
#   TRAIN_DATA_URL     (optional; only if you train/prep FROM the cloud box rather than the volume)
set -u
log(){ echo "[cloud-bootstrap] $*"; }

# 1) RunPod API key — scripts read the FILE ~/.runpod_key; the cloud gives us the env var.
if [ ! -s "$HOME/.runpod_key" ] && [ -n "${RUNPOD_API_KEY:-}" ]; then
  printf '%s' "$RUNPOD_API_KEY" > "$HOME/.runpod_key"
  chmod 600 "$HOME/.runpod_key"
  log "wrote \$RUNPOD_API_KEY -> ~/.runpod_key (chmod 600)"
elif [ -s "$HOME/.runpod_key" ]; then
  log "~/.runpod_key already present — leaving it untouched"
else
  log "no ~/.runpod_key and no \$RUNPOD_API_KEY — RunPod ops will fail until one is provided"
fi

# 2) OpenRouter key — openrouter-runner.py reads \$OPENROUTER_API_KEY from env first (no file needed).
if [ -n "${OPENROUTER_API_KEY:-}" ]; then
  log "\$OPENROUTER_API_KEY present in env (runner reads it directly)"
else
  log "no \$OPENROUTER_API_KEY in env — OpenRouter runs will fail until provided"
fi

# 3) Training data — normally lives on the RunPod volume (/workspace/training/...), so the cloud
#    box usually does NOT need a local copy (it orchestrates the pod over the RunPod API).
#    Only fetch a local copy if you set TRAIN_DATA_URL (e.g. a presigned S3/HTTPS link).
TRAIN_DEST="$HOME/Documents/tradebench-lite-tests/training/sft-v4/train.jsonl"
if [ ! -f "$TRAIN_DEST" ] && [ -n "${TRAIN_DATA_URL:-}" ]; then
  mkdir -p "$(dirname "$TRAIN_DEST")"
  if curl -fsSL "$TRAIN_DATA_URL" -o "$TRAIN_DEST"; then
    log "fetched training data -> $TRAIN_DEST ($(wc -l < "$TRAIN_DEST" 2>/dev/null) lines)"
  else
    log "WARN: TRAIN_DATA_URL set but fetch failed"
  fi
elif [ -f "$TRAIN_DEST" ]; then
  log "training data present locally"
else
  log "training data not local + no TRAIN_DATA_URL — expected on RunPod volume /workspace/training/"
fi

log "done."
