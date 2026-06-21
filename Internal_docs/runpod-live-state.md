# RunPod LIVE RUN STATE (operational handoff)

Updated 2026-06-21 ~23:56 UTC. Plan/architecture: see `delta-roadmap-to-sota-trading-model.md`.

## Current run
- **Pod** `z1n9i3xz6jxdf1` ("democratic_olive_firefly"), 1× H100 80GB, region US-MO-1, IP 64.247.201.49.
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
