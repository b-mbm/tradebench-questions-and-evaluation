#!/usr/bin/env python3
"""Double-fork daemon launcher for vLLM. This is the POSIX-correct way to fully
detach a process so it survives the parent SSH session dying."""
import os, sys, time, subprocess

LOG = "/workspace/vllm-run.log"

# First fork
pid = os.fork()
if pid > 0:
    # Parent exits immediately
    print(f"first fork parent exiting, child={pid}")
    sys.exit(0)

# Decouple from parent environment
os.setsid()
os.umask(0)

# Second fork
pid = os.fork()
if pid > 0:
    sys.exit(0)

# We are now the daemon (grandchild), fully detached
# Redirect stdio
sys.stdout.flush()
sys.stderr.flush()
with open("/dev/null", "r") as f:
    os.dup2(f.fileno(), 0)
logf = open(LOG, "w")  # truncate
os.dup2(logf.fileno(), 1)
os.dup2(logf.fileno(), 2)

# Launch vLLM
cmd = [
    "/workspace/vllm/bin/vllm", "serve", "/workspace/models/qwen3.6-27b",
    "--served-model-name", "local-qwen36-27b-base",
    "--enable-lora", "--lora-modules", "local-qwen36-27b-sft=/workspace/out/sft",
    "--max-lora-rank", "32", "--max-num-seqs", "8", "--dtype", "bfloat16",
    "--max-model-len", "32768", "--gpu-memory-utilization", "0.90",
    "--reasoning-parser", "qwen3", "--enforce-eager",
    "--port", "8000", "--trust-remote-code",
]
os.execvp(cmd[0], cmd)
