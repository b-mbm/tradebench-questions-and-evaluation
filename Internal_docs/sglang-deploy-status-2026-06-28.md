# SGLang on RunPod — deploy status (2026-06-28, Claude session)

## Result: persistence SOLVED; request-time crash still OPEN

### ✅ WIN — the persistence blocker is fixed
SGLang stays alive without SSH when launched as the **container start-command** (`dockerArgs`), not from an SSH session. Pod `3vt1yawn2rfd2x` came up to `GET /v1/models → 200` with no SSH connected. This is what the 8 prior setsid/nohup/tmux attempts couldn't do — those rooted SGLang under the SSH session; the container-command makes it a child of PID 1.

**Working recipe (RunPod `podFindAndDeployOnDemand`):**
- image `runpod/pytorch:1.0.2-cu1281-torch280-ubuntu2404`, cloudType SECURE, gpu "NVIDIA H100 80GB HBM3", dataCenterId **US-MO-1** (must match volume `qqz94ksxmn`), volumeMountPath `/workspace`, ports `8000/http`.
- `dockerArgs` = `bash -lc '<install sglang to /root if absent>; while true; do <sglang.launch_server …>; sleep 5; done'` (restart loop = auto-recover + keeps container alive).
- **Install to container disk `/root/sglang` (~7 min), NOT a venv on `/workspace`** — the FUSE volume made a clean torch+flashinfer install take 30+ min (pod `f7faago3t2mmgx`, abandoned). Container disk is far faster; cost is reinstall per boot.
- Access via the HTTP proxy `https://<podId>-8000.proxy.runpod.net` — no SSH needed for serving.

### ❌ OPEN — SGLang crashes on the first inference request
Sequence observed: `/v1/models` 200 → probe POST `/v1/chat/completions` → 403/then 502 → restart loop. Happens **base-only** (not the LoRA). This matches the doc's known "SGLang crashes on the first json_object request." Cause unknown until we read the traceback.

**The traceback is persisted at `/workspace/sglang-serve.log`** (the serve loop redirects there). It survives pod stop. To read it: deploy a PLAIN pod (normal template start = working SSH, NO dockerArgs override) on volume `qqz94ksxmn`, then `cat /workspace/sglang-serve.log`. Or use the RunPod console logs while a pod runs.

### SSH gotcha (why I was blind)
Overriding `dockerArgs` skips the pytorch template's sshd setup. My manual `sshd` in dockerArgs was incomplete — **missing `ssh-keygen -A` (host keys)**, so sshd never came up → no SSH. Fix next time: `ssh-keygen -A; mkdir -p /root/.ssh; echo "$PUBLIC_KEY" >> /root/.ssh/authorized_keys; /usr/sbin/sshd`. Simpler: use a plain pod (no dockerArgs) purely to read `/workspace` logs.

## Next steps
1. Read `/workspace/sglang-serve.log` (plain-ssh pod or console) → get the crash traceback.
2. Likely things to try based on the traceback: drop `--reasoning-parser qwen3` to test if it's the reasoning-parser+json_object interaction; adjust `--mem-fraction-static`; try a different sglang version; check the GDN-kernel + `--disable-cuda-graph` path for this hybrid arch.
3. **Recommended division:** GLM (hit this exact crash before + reliable operator) stabilizes SGLang using the proven persistence recipe above; Claude stays on analysis. Fallback if SGLang stays unstable: the **two-stage vLLM path** (think → format) — works, preserves thinking, two calls instead of one.

## Cost/state
Both pods EXITED. Balance $71.11. Volume `qqz94ksxmn` (US-MO-1) holds model + LoRA + prompts + `/workspace/sglang-serve.log`.
