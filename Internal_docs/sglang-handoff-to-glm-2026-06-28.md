# Delta Memo → GLM: SGLang on RunPod (persistence SOLVED, request-crash OPEN)

**Date:** 2026-06-28 · **From:** Claude Code · **To:** GLM (taking over SGLang stabilization)
**Status:** Persistence blocker fixed. SGLang now stays alive without SSH. New blocker: it crashes on the first inference request. Your job: read the crash traceback and stabilize.

---

## TL;DR
- ✅ **The thing you couldn't do — keep SGLang alive without SSH — is solved.** Launch it as the **container start-command (`dockerArgs`)**, not from an SSH session. Verified: pod came up to `GET /v1/models → 200` with zero SSH connected, via the RunPod HTTP proxy.
- ❌ **New blocker:** SGLang serves `/v1/models` but **crashes on the first `POST /v1/chat/completions`** (then the restart loop cycles it: 200 → request → 502 → restart). Happens **base-only** (not the LoRA).
- 📄 **The crash traceback is persisted** at `/workspace/sglang-serve.log` on volume `qqz94ksxmn`. Read it to find the cause.

## Access
- RunPod API key: `~/.runpod_key` · SSH key: `~/.ssh/id_ed25519`
- Repo: `/Users/bradleymiles/Documents/tradebench-questions-and-evaluation`, branch `codex-work` (`git pull` — all scripts here)
- Network volume `qqz94ksxmn` ("tradebench", US-MO-1) at `/workspace`: model `/workspace/models/qwen3.6-27b`, LoRA `/workspace/out/sft`, prompts `/workspace/prompts-300q.json`, and `/workspace/sglang-serve.log` (the crash log).
- GPU: NVIDIA H100 80GB HBM3. Both prior SGLang pods (`f7faago3t2mmgx`, `3vt1yawn2rfd2x`) are EXITED. Balance ~$71.

## The proven persistence recipe (this is the win — reuse it)
Deploy via `podFindAndDeployOnDemand`: cloudType SECURE, gpu "NVIDIA H100 80GB HBM3", `dataCenterId:"US-MO-1"` (must match the volume), `networkVolumeId:"qqz94ksxmn"`, `volumeMountPath:"/workspace"`, image `runpod/pytorch:1.0.2-cu1281-torch280-ubuntu2404`, `ports:"8000/http"`, and `dockerArgs` = a `bash -lc` that **installs sglang to container disk `/root/sglang` (NOT a venv on /workspace — FUSE made that take 30+ min) then runs a `while true; do sglang.launch_server …; sleep 5; done` restart loop**, logging to `/workspace/sglang-serve.log`. Access serving via `https://<podId>-8000.proxy.runpod.net`. SGLang as the container command = survives SSH disconnect (child of PID 1).

Serve flags that were used: `--model-path /workspace/models/qwen3.6-27b --served-model-name local-qwen36-27b-base --dtype bfloat16 --context-length 32768 --mem-fraction-static 0.82 --reasoning-parser qwen3 --disable-cuda-graph --port 8000 --host 0.0.0.0 --trust-remote-code`. sglang `0.5.14`.

## The open blocker — and how to read the traceback
SGLang dies on the first chat request. **You need `/workspace/sglang-serve.log`.** Two ways:
1. **Plain debug pod (recommended, gives working SSH):** deploy a normal pod on volume `qqz94ksxmn` with **NO `dockerArgs` override** (so the pytorch template's own sshd setup runs and SSH works), then `ssh … cat /workspace/sglang-serve.log`. Read the traceback there.
2. RunPod **console logs** while an SGLang pod is running.

**SSH gotcha (why Claude was blind):** overriding `dockerArgs` skips the template's sshd setup; a manual sshd needs `ssh-keygen -A` (host keys) + `echo "$PUBLIC_KEY" >> /root/.ssh/authorized_keys` + `/usr/sbin/sshd`. Easier: use a plain pod (no dockerArgs) just to read logs, and the container-command pod for serving.

## What to try once you have the traceback
- If it's the **reasoning-parser + json_object** interaction: test serving **without** `--reasoning-parser qwen3` and parse `<think>` in code (loses the clean split but may stabilize), or pin a different sglang version.
- Tune `--mem-fraction-static` (OOM?), check the **GDN/hybrid-kernel** path for this brand-new arch with `--disable-cuda-graph`.
- Re-add LoRA only after base is stable.

## Success criteria
SGLang serves `POST /v1/chat/completions` with `response_format:{"type":"json_object"}` + original prompt and returns **populated `reasoning_content` + valid nested JSON (not collapsed to ExecuteOneResponse)**, survives 5+ consecutive requests, stays up 60+ min without SSH. Validate with `scripts/probe-parity-remote.py` (set `PROBE_ENDPOINT=https://<podId>-8000.proxy.runpod.net`).

## Coordination & fallback
- **Only one operator on a given pod.** Claude is off the controls; you're sole operator. Claude stays on analysis — hand back the traceback / probe output for interpretation.
- **Fallback** if SGLang won't stabilize: two-stage vLLM (think with no json_object → format) — works and preserves thinking; it's "two calls not one" (not strict single-call parity), but it's the pragmatic backup.

## Related docs
`Internal_docs/sglang-deploy-status-2026-06-28.md` (same findings), `Internal_docs/delta-memo-json-parity-2026-06-28.md` (why SGLang), `scripts/probe-parity-remote.py` (validator).
