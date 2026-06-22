# RunPod LIVE RUN STATE (operational handoff)

Updated 2026-06-21 ~23:56 UTC. Plan/architecture: see `delta-roadmap-to-sota-trading-model.md`.

## EVAL PHASE — vLLM serving (Codex owns the run; Claude owns infra)
Decision (with Codex audit): the offline gen-300q.py path was a protocol mismatch (no JSON mode, thinking not suppressed, greedy vs temp0.1, maxtok 1024<2200) → mis-scored. Use the trusted runner `scripts/run-300q.ts` against a vLLM OpenAI endpoint.
- **Metric = strict `grade.pass` count /300.** Base `qwen/qwen3.6-27b` = **164** (exact OpenRouter run) / **166** (final archive). Baseline config: provider openrouter, temp 0.1, max_tokens 2200, retries 2, `response_format: json_object`.
- **Two comparisons:** (a) tuned vs official 164/166 (the story); (b) tuned vs base **on the same vLLM stack** (clean causal — did the FT help?).
- **vLLM installing to `/workspace/vllm`** (persists on volume). ⚠️ **RISK: install on the network volume is pathologically slow** (~45min+ for ~13G; normal is ~5min local). If the volume-installed vLLM is broken or too slow to load tomorrow, **fallback = install vLLM to the container disk** (`/usr/local/bin/python -m venv --system-site-packages /root/vllm && /root/vllm/bin/pip install vllm` — local disk, ~5min, but wiped on stop so reinstall each session) OR merge LoRA + serve.
- Governor `/root/pod-governor.sh` stops the pod on VLLM_INSTALL_DONE or 90-min backstop; 3h ultimate backstop also running; RunPod key staged at pod `/root/.rpk` (rotate after).

### TOMORROW'S TURNKEY RESUME
1. `bash /tmp/resume.sh` (POD=pdm12c618p0hnk) → note new SSH port (IP 64.247.201.58, key ~/.ssh/id_ed25519).
2. Confirm install: `grep -c VLLM_INSTALL_DONE /workspace/vllm-install.log` + `ls /workspace/vllm/bin/vllm`. If not done/broken → use container-disk fallback above.
3. Serve (detached): `/workspace/vllm/bin/vllm serve /workspace/models/qwen3.6-27b --served-model-name local-qwen36-27b-base --enable-lora --lora-modules local-qwen36-27b-sft=/workspace/out/sft --dtype bfloat16 --max-model-len 8192 --gpu-memory-utilization 0.90 --port 8000 --trust-remote-code` (add `--language-model-only` if the VLM arch errors; if `--enable-lora` unsupported on this VLM, merge the adapter with peft `merge_and_unload`, save, serve merged).
4. Wait for 'startup complete'; curl-smoke `POST localhost:8000/v1/chat/completions` model=local-qwen36-27b-sft, response_format json_object, temp 0.1 → confirm CLEAN JSON, NO `<think>`. Test base name too.
5. SSH tunnel from Mac (run_in_background): `ssh -N -L 8000:localhost:8000 -o StrictHostKeyChecking=no -p <PORT> -i ~/.ssh/id_ed25519 root@64.247.201.58`. Verify `curl localhost:8000/v1/models` from Mac.
6. Hand Codex: roster `{"models":["local-qwen36-27b-sft","local-qwen36-27b-base"]}`, env LMSTUDIO_BASE_URL=http://localhost:8000/v1, LMSTUDIO_RESPONSE_FORMAT=json_object, SMOKE_TEMP=0.1, SMOKE_MAX_TOKENS=2200, RETRY_ATTEMPTS=2. Codex smokes 10q then full 300 (both models). Re-arm a fresh pod-stop governor for the run window. Do NOT run the eval autonomously.

## ✅ SFT COMPLETE (2026-06-22 ~04:36 UTC)
- 232/232 steps, 2 epochs, ~2h49m. **eval_loss: epoch1 0.1336 → epoch2 0.1293** (DROPPED → no overfitting, epoch 2 helped). final train_loss ~0.15; train/eval gap small → good generalization.
- Adapter saved on volume: `/workspace/out/sft/` (adapter_model.safetensors + adapter_config.json + checkpoint-116 [ep1] + checkpoint-232 [ep2] + tokenizer). Persists while pod stopped.
- Pod `pdm12c618p0hnk` STOPPED. Spend ~$12 + this run.
- **NEXT (driven, owner go required): EVAL.** Resume/redeploy pod → serve `/workspace/out/sft` merged onto base via vLLM → point `scripts/run-300q.ts` at the vLLM endpoint → grade with TS `gradeSchemaResponse` → 166→X. ~$2, ~30min. Decision tree after: ≥189 ship / 166<X<189 + eval_loss-was-dropping → 3rd epoch / plateaued → GRPO / X<166 → roll back to checkpoint-116.

## Current run (historical)
- **Pod** `pdm12c618p0hnk` ("tradebench-sft"), 1× H100 80GB, region US-MO-1, IP **64.247.201.58**, SSH port **13656**. (Old pod `z1n9i3xz6jxdf1` terminated — see resume gotcha below.)
- **GOTCHA — resume can fail "not enough free GPUs on the host":** stop/resume is locked to the original host; if its GPU got taken, resume fails forever. **Recovery = deploy a NEW pod attached to the same network volume** (everything persists). Mutation that worked:
  `mutation{podFindAndDeployOnDemand(input:{cloudType:SECURE,gpuCount:1,gpuTypeId:"NVIDIA H100 80GB HBM3",containerDiskInGb:60,volumeMountPath:"/workspace",networkVolumeId:"qqz94ksxmn",imageName:"runpod/pytorch:1.0.2-cu1281-torch280-ubuntu2404",name:"tradebench-sft",ports:"22/tcp",startSsh:true,supportPublicIp:true}){id desiredStatus}}`
  Then poll `myself{pods{runtime{ports{ip publicPort privatePort}}}}` for the privatePort:22 entry → ip:publicPort. Update POD/HOST/port in /tmp/runpod-watcher.sh + the SSH commands.
- **Port changes on every stop/resume.** Get the current port: query the RunPod API (key at `~/.runpod_key`):
  `curl -s "https://api.runpod.io/graphql?api_key=$(cat ~/.runpod_key)" -H "Content-Type: application/json" -d '{"query":"query{myself{pods{id desiredStatus runtime{ports{ip publicPort privatePort}}}}}"}'`
  → the port with `privatePort:22` is the SSH port. (At launch it was 10483.)
- SSH: `ssh -o StrictHostKeyChecking=no -p <PORT> -i ~/.ssh/id_ed25519 root@64.247.201.49`
- **Watcher** background task `bdv8tu4b0` (script `/tmp/runpod-watcher.sh`, log `/tmp/runpod-watcher.log`): polls `/workspace/STATUS` every 3 min, auto-STOPS the pod (RunPod API) on DONE / FAILED / 6h guard, captures all logs. It will notify on completion.

## The pipeline (all on the persistent `/workspace` volume)
- venv `/workspace/venv` (torch from base image via --system-site-packages; transformers 5.12.1, trl 1.6.0, peft 0.19.1, bnb 0.49.2).
- `run.sh` stages → STATUS: `setup → download → verify → smoke → sft → DONE` (or `FAILED:<stage>`).
- Model **cached** at `/workspace/models/qwen3.6-27b` (Qwen/Qwen3.6-27B, ~54GB, 26 files) → retries skip re-download.
- Data `/workspace/data/{train,val}.jsonl` (1855/205, messages). Scripts `/workspace/{run.sh,sft.py}`. Logs `/workspace/{pip,dl,verify,smoke,sft}.log`, `smoke_result.txt`. Adapter out → `/workspace/out/sft`.

## If the watcher fires FAILED (resume → fix → relaunch; download is cached so it's cheap)
1. `bash /tmp/resume.sh` (resumes pod, prints new SSH port).
2. Read the failed stage's log via SSH (e.g. `/workspace/smoke.log`). Fix `runpod/sft.py` or `run.sh` locally.
3. Update the port in `/tmp/runpod-watcher.sh` (the `SSHK=...-p <PORT>` line).
4. `scp -P <PORT> ... runpod/run.sh runpod/sft.py root@64.247.201.49:/workspace/`
5. Relaunch: `ssh -p <PORT> ... "rm -f /workspace/STATUS; cd /workspace && setsid bash run.sh >/workspace/run.out 2>&1 </dev/null & disown"`
6. Re-arm watcher: `bash /tmp/runpod-watcher.sh` (run_in_background).

## Known risk still ahead
- **smoke** = first real VLM load (`Qwen3_5ForConditionalGeneration`, loaded text-only via the try-chain in sft.py) + QLoRA train 40ex/1ep + generate-and-validate JSON. If it fails, it's almost certainly the loader class or LoRA target-module names — read `/workspace/smoke.log`.

## After DONE (driven, next session)
Eval: serve `/workspace/out/sft` (merged) with vLLM, point `scripts/run-300q.ts` at it, grade with the TS `gradeSchemaResponse` → 166 → X. Then decide (≥189 ship / 3rd epoch / GRPO). **Rotate the RunPod API key** (it was pasted in chat).
