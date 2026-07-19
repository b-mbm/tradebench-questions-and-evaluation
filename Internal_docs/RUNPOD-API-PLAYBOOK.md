# RunPod API Playbook — for Codex (and any new agent)

**Purpose:** Everything you need to operate RunPod pods via the GraphQL API: check balance, list/find/stop/terminate/resume pods, read data off the network volume, and deploy. Grounded in commands proven working in the 2026-07-19 variant B gate run session. Copy-pasteable.

**Read this BEFORE touching any pod.** The RunPod API is the primary interface; the web dashboard is the fallback for deployment only (the API's `podFindAndDeployOnDemand` returns `SUPPLY_CONSTRAINT` even when the dashboard shows stock).

---

## 0. The one rule above all others

**ONE POD PER SESSION.** Never deploy a second pod while one lives. If a pod fails, `podStop` it, investigate, and `podResume` the same pod — never deploy a replacement. If resume fails, tell the operator before deploying anything new. This rule exists because the agent repeatedly failed to close pods reliably in prior sessions, and zombie pods drained real money ($20+ on 2026-07-09 alone).

Companion rules:
- **Zombie rule:** at the start of EVERY session, list all pods and terminate old ones you don't own.
- **Verify-termination rule:** `podTerminate` returning `null` does NOT mean terminated. Wait 5s, re-query, verify `desiredStatus: EXITED`. If still RUNNING, try again or fall back to `podStop`.
- **Budget rule:** before any deploy, state out loud: balance $X, this step costs ~$Y, ceiling $Z, and Y×1.5 must fit.

---

## 1. Authentication

The RunPod API key lives at `~/.runpod_key` (51 chars, ED25519-prefixed token). **Never print it, commit it, or echo it.** Always load it into a shell variable:

```bash
KEY=$(cat ~/.runpod_key)
```

All queries go to: `https://api.runpod.io/graphql?api_key=$KEY`

**CRITICAL — Content-Type header:** every request MUST include `-H "Content-Type: application/json"`. Without it you get a confusing CSRF error: `"This operation has been blocked as a potential Cross-Site Request Forgery (CSRF)"`. This wasted 10 minutes in the 2026-07-19 session.

---

## 2. Balance check (the correct field)

```bash
KEY=$(cat ~/.runpod_key)
curl -s "https://api.runpod.io/graphql?api_key=$KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"{myself{clientBalance underBalance}}"}'
```

**Use `clientBalance`, NOT `hostBalance`.** `hostBalance` is the compute-provider balance and is always 0 for us. (Failure mode #10 in the bayesian skill.)

Parsed version:
```bash
KEY=$(cat ~/.runpod_key)
curl -s "https://api.runpod.io/graphql?api_key=$KEY" -H "Content-Type: application/json" \
  -d '{"query":"{myself{clientBalance}}"}' | \
  python3 -c "import json,sys; print(f'Balance: \${json.load(sys.stdin)[\"data\"][\"myself\"][\"clientBalance\"]:.2f}')"
```

---

## 3. List all pods (the zombie check)

```bash
KEY=$(cat ~/.runpod_key)
curl -s "https://api.runpod.io/graphql?api_key=$KEY" -H "Content-Type: application/json" \
  -d '{"query":"{myself{pods{id name desiredStatus}}}"}'
```

Filter to just RUNNING pods (the ones burning money):
```bash
KEY=$(cat ~/.runpod_key)
curl -s "https://api.runpod.io/graphql?api_key=$KEY" -H "Content-Type: application/json" \
  -d '{"query":"{myself{pods{id name desiredStatus}}}"}' | \
  python3 -c "
import json,sys
d=json.load(sys.stdin)['data']['myself']
print(f'Balance: \${d[\"clientBalance\"]:.2f}')
running=[p for p in d['pods'] if p['desiredStatus']=='RUNNING']
print(f'RUNNING pods: {len(running)}')
for p in running: print(f'  {p[\"id\"]}  {p[\"name\"]}')
"
```

**Statuses you'll see:** `RUNNING` (billable), `EXITED` (stopped, not billing), `RECLAMED` (deleted for non-payment). Only RUNNING burns money.

---

## 4. Find a specific pod (get ports + cost)

```bash
KEY=$(cat ~/.runpod_key)
POD_ID="crpo2po5lv18m3"  # replace with your pod id
curl -s "https://api.runpod.io/graphql?api_key=$KEY" -H "Content-Type: application/json" \
  -d "{\"query\":\"{pod(input:{podId:\\\"$POD_ID\\\"}){id name desiredStatus costPerHr runtime{ports{privatePort publicPort isIpPublic}}}}\"}"
```

Example output (from the 2026-07-19 run):
```json
{"data":{"pod":{"id":"crpo2po5lv18m3","name":"comparative_peach_woodpecker",
  "desiredStatus":"RUNNING","costPerHr":2.99,
  "runtime":{"ports":[
    {"privatePort":22,"publicPort":12722,"isIpPublic":true},
    {"privatePort":8000,"publicPort":60600,"isIpPublic":false},
    {"privatePort":19123,"publicPort":60601,"isIpPublic":false}
  ]}}}}
```

**Schema gotchas (learned the hard way):**
- It's `costPerHr`, NOT `costPerHour`.
- `runtime.machine` and `runtime.gpuDisplayName` are NOT valid fields — you'll get `GRAPHQL_VALIDATION_FAILED`. Query `machine{gpuDisplayName costPerHr}` at the top level, not under `runtime`.
- Valid minimal fields: `id name desiredStatus machineId costPerHr runtime{ports{privatePort publicPort isIpPublic}}`.

The **HTTP proxy URL** is constructed from the pod ID + private port 8000:
```
https://<podId>-8000.proxy.runpod.net/
```
For `crpo2po5lv18m3`: `https://crpo2po5lv18m3-8000.proxy.runpod.net/`

---

## 5. Stop a pod (podStop) — the everyday action

Stops the pod. It goes to `EXITED` (not deleted). Volume data is preserved. Does NOT bill while EXITED. Can be resumed later.

```bash
KEY=$(cat ~/.runpod_key)
POD_ID="crpo2po5lv18m3"
curl -s "https://api.runpod.io/graphql?api_key=$KEY" -H "Content-Type: application/json" \
  -d "{\"query\":\"mutation{podStop(input:{podId:\\\"$POD_ID\\\"}){id desiredStatus}}\"}"
```

**VERIFY after stopping** (wait ~8s, then re-query):
```bash
sleep 8
KEY=$(cat ~/.runpod_key)
curl -s "https://api.runpod.io/graphql?api_key=$KEY" -H "Content-Type: application/json" \
  -d "{\"query\":\"{pod(input:{podId:\\\"$POD_ID\\\"}){id desiredStatus}}\"}"
# Expect: desiredStatus: EXITED
```

If it still shows `RUNNING`, the stop FAILED. Retry, or fall back to `podTerminate`.

---

## 6. Terminate a pod (podTerminate) — the nuclear option

**Permanently deletes pod-local data** (container disk). Network volume data is preserved. Use for zombies and end-of-life pods. Terminated pods cannot be resumed.

```bash
KEY=$(cat ~/.runpod_key)
POD_ID="crpo2po5lv18m3"
curl -s "https://api.runpod.io/graphql?api_key=$KEY" -H "Content-Type: application/json" \
  -d "{\"query\":\"mutation{podTerminate(input:{podId:\\\"$POD_ID\\\"}){id desiredStatus}}\"}"
```

**VERIFY-TERMINATION RULE (non-negotiable):** `podTerminate` may return `null` or `desiredStatus: EXITED` while the pod is still actually RUNNING. Always wait + re-query:
```bash
sleep 5
KEY=$(cat ~/.runpod_key)
curl -s "https://api.runpod.io/graphql?api_key=$KEY" -H "Content-Type: application/json" \
  -d "{\"query\":\"{pod(input:{podId:\\\"$POD_ID\\\"}){id desiredStatus}}\"}"
```
If still `RUNNING`, retry or use `podStop` as fallback. Zombie pods that survive termination silently drain balance at the hourly rate (cost $20+ on 2026-07-09).

**Only TERMINATE when the run is complete.** Use `podStop` for intermediate stops (you might want to resume).

---

## 7. Resume a stopped pod (podResume)

Brings an EXITED pod back to RUNNING. The pod re-runs its `dockerArgs` startup command, so the curl-pipe-to-bash pattern re-runs automatically. **Use this instead of deploying a new pod** when you just need to fetch files or re-run with a fixed script.

```bash
KEY=$(cat ~/.runpod_key)
POD_ID="crpo2po5lv18m3"
curl -s "https://api.runpod.io/graphql?api_key=$KEY" -H "Content-Type: application/json" \
  -d "{\"query\":\"mutation{podResume(input:{podId:\\\"$POD_ID\\\"}){id desiredStatus}}\"}"
```

Wait ~60s for the pod to come up and the HTTP log server to start, then poll:
```bash
sleep 60
# poll the proxy
curl -s --max-time 15 "https://$POD_ID-8000.proxy.runpod.net/" -o /dev/null -w "HTTP %{http_code}\n"
```

**To fetch files off the volume via resume:**
1. `podResume` the stopped pod
2. Wait for the log server to respond (HTTP 200 at the proxy root)
3. `curl -s "https://<podId>-8000.proxy.runpod.net/path/to/file" -o local_copy`
4. `podStop` immediately when done (don't let it idle-burn)

**Important:** if the pod's `dockerArgs` was the full run script (like `run_variant_b_gate.sh`), resuming will RE-RUN the whole eval. To just fetch files, you either need a pod whose startup just starts the log server, OR you race the curl before the eval restarts. Cleaner: deploy a fresh "fetch-only" pod with a minimal dockerArgs that just serves `/workspace/` via the log server. Example dockerArgs for a fetch-only pod:
```
bash -c 'cd /workspace && python3 -m http.server 8000'
```
But that's a new pod — only do it if resume is impractical, and get operator permission first per the one-pod rule.

---

## 8. Deploy a pod via API (often fails — prefer dashboard)

The API deploy mutation is `podFindAndDeployOnDemand`. **As of 2026-07-19 this returns `SUPPLY_CONSTRAINT` even when the dashboard shows H100s available.** This has persisted for 5+ hours in prior sessions. Have the operator deploy from `https://www.runpod.io/console/deploy` instead.

For reference, the API call (likely to fail):
```bash
KEY=$(cat ~/.runpod_key)
curl -s "https://api.runpod.io/graphql?api_key=$KEY" -H "Content-Type: application/json" \
  -d '{"query":"mutation{podFindAndDeployOnDemand(input:{cloudType:ALL gpuCount:1 volumeInGb:80 containerDiskInGb:80 minCPU:1 minMemoryIn1Gb:1 gpuTypeId:\"NVIDIA H100 80GB HBM3\" ports:\"8000/http,22/tcp\" bidPerGpu:false networkVolumeId:\"qqz94ksxmn\" imageName:\"runpod/pytorch:1.0.2-cu1281-torch280-ubuntu2404\" dockerArgs:\"bash /workspace/sglang-startup-lora.sh\"}){id status}}"}'
```

**Dashboard deploy (the reliable path):** See `SESSION-HANDOFF-2026-07-18.md` and `SESSION-HANDOFF-2026-07-19.md` for the exact operator steps. Summary:
1. Operator goes to `https://www.runpod.io/console/deploy`
2. Selects H100 SXM 80GB, Community Cloud
3. Selects network volume `tradebench` (`qqz94ksxmn`) → filters to US-MO-1
4. Clicks "Set overrides", pastes Docker Args + HTTP Port 8000 + Container Disk 80
5. Deploys, returns the pod ID

---

## 9. Reading data off the pod (the HTTP-proxy log pattern)

This is the primary debugging tool (failure mode #17 in the bayesian skill). The pod runs a Python HTTP file server on port 8000 (the proxied port) that serves `/workspace/`. SGLang runs on port 30000 (internal only). This way logs are reachable even when SGLang crashes.

**Files you can read via the proxy (for pod `crpo2po5lv18m3`):**
```
https://crpo2po5lv18m3-8000.proxy.runpod.net/variant-b-gate.log     # main run log
https://crpo2po5lv18m3-8000.proxy.runpod.net/sglang.log             # SGLang stderr
https://crpo2po5lv18m3-8000.proxy.runpod.net/logserver.out          # log server's own stderr
https://crpo2po5lv18m3-8000.proxy.runpod.net/results/variant-b-gate/results.jsonl
https://crpo2po5lv18m3-8000.proxy.runpod.net/results/variant-b-gate/grade-output.txt
https://crpo2po5lv18m3-8000.proxy.runpod.net/results/variant-b-gate/DONE
https://crpo2po5lv18m3-8000.proxy.runpod.net/results/variant-b-gate/FAILED
```

**Check for completion flags:**
```bash
PROXY="https://crpo2po5lv18m3-8000.proxy.runpod.net"
curl -s --max-time 8 -o /dev/null -w "DONE: HTTP %{http_code}\n"   "$PROXY/results/variant-b-gate/DONE"
curl -s --max-time 8 -o /dev/null -w "FAILED: HTTP %{http_code}\n" "$PROXY/results/variant-b-gate/FAILED"
```
- HTTP 200 = flag exists (run complete or failed)
- HTTP 404 = flag doesn't exist (still running, or path wrong)

**Download a file to local disk:**
```bash
PROXY="https://crpo2po5lv18m3-8000.proxy.runpod.net"
curl -s --max-time 60 "$PROXY/results/variant-b-gate/results.jsonl" -o /tmp/variant-b-results.jsonl
wc -l /tmp/variant-b-results.jsonl  # should be 175 lines
```

**Note on stale logs:** `/workspace/sglang.log` and other volume files persist across pods. A fresh pod that hasn't started SGLang yet will show the PRIOR pod's stale `sglang.log`. Always check timestamps in the log content before treating it as live (the 2026-07-19 run's stale log was from 2026-07-11 until the new SGLang overwrote it ~5 min after deploy).

---

## 10. SSH access (works as of 2026-07-08)

Direct SSH to pods WORKS. The skill incorrectly documented it as broken for 4 days, which led to wasted time. Use SSH for debugging and running commands; use the curl-pipe-to-bash pattern for fully-automated deployment.

**SSH key:** `~/.ssh/id_ed25519` (ED25519, fingerprint `SHA256:8MPYChu/SIdff3hFZPcSlmD3qLHFBYx7z+20UseXzpU tech@aixfi.ai`).

**To SSH in:**
```bash
# First get the pod's SSH port mapping
KEY=$(cat ~/.runpod_key)
POD_ID="crpo2po5lv18m3"
curl -s "https://api.runpod.io/graphql?api_key=$KEY" -H "Content-Type: application/json" \
  -d "{\"query\":\"{pod(input:{podId:\\\"$POD_ID\\\"}){runtime{ports{privatePort publicPort}}}}\"}"
# Find the port entry where privatePort==22, note its publicPort

# Then SSH (replace <publicPort> and use the pod IP if isIpPublic)
ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no \
    -i ~/.ssh/id_ed25519 root@<pod-ip> -p <publicPort>
```

**Important:** when using `dockerArgs`, the pod template's SSH setup is OVERRIDDEN. The startup script must start SSH itself:
```bash
ssh-keygen -A 2>/dev/null
mkdir -p /root/.ssh
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJH5q7y112XdnwOh7ExUMw3f+HUMPxbjJvZD/ERyTSU3 tech@aixfi.ai" >> /root/.ssh/authorized_keys
/usr/sbin/sshd
```

---

## 11. The curl-pipe-to-bash deployment pattern (proven 2026-07-08)

For any complex multi-step pod work (training, eval, etc.), don't paste commands into the Web Terminal. Use this pattern:

1. Write a self-contained `run_all.sh` (clone repo, install deps, start SGLang, run work, write DONE flag).
2. Publish to a public GitHub Gist: `gh gist create scripts/run_all.sh --public`.
3. Deploy the pod with `dockerArgs`:
   ```
   bash -c 'curl -sL https://gist.githubusercontent.com/<user>/<gist-id>/raw/<file> | bash'
   ```
4. The script runs as PID 1's child, ports bind correctly, operator touches nothing.
5. Monitor via `https://<podId>-8000.proxy.runpod.net/`.

**The script must:**
- Use `exec > >(tee -a /workspace/logfile.log) 2>&1` to capture all output to the volume.
- Write a DONE or FAILED flag to `/workspace/` when complete.
- Start the HTTP log server FIRST (before SGLang), so logs are accessible ~60s after deploy.

**Reference implementation:** `scripts/run_variant_b_gate.sh` (the script that ran the 2026-07-19 variant B gate eval). Read it as the canonical example.

---

## 12. Monitoring cadence

Poll at the cadence the money burns. For a $3/hr pod: every 5-10 min. The ZCode Bash tool has a 10-min ceiling on single commands, so `sleep 540; <poll>` is the pattern.

**What to watch during a run:**
1. **Log proxy reachable:** `curl -s -o /dev/null -w "%{http_code}" "$PROXY/"` → 200
2. **Question count growing:** `curl -s "$PROXY/results/<dir>/results.jsonl" | wc -l`
3. **SGLang throughput:** tail `sglang.log`, look for `gen throughput (token/s): ~100` and `#running-req: 4`
4. **DONE/FAILED flags:** HTTP 200 = complete
5. **Balance:** query `clientBalance` — should descend at ~`costPerHr/60` per minute

**On any anomaly (proxy down, throughput crash, balance dropping too fast):** investigate immediately. A silently-dead 5-hour run is the research version of "it stopped coding for five hours," with a bill attached.

---

## 13. Reference values (this project, as of 2026-07-19)

| Thing | Value |
|---|---|
| Network volume ID | `qqz94ksxmn` (named "tradebench") |
| Volume region | US-MO-1 (only usable with US-MO-1 GPUs) |
| Volume mount path | `/workspace` |
| Model path | `/workspace/models/qwen3.6-27b` (~54GB bf16) |
| Pod template image | `runpod/pytorch:1.0.2-cu1281-torch280-ubuntu2404` |
| Typical H100 SXM 80GB Community price | $2.99/hr (1 GPU) |
| 2×H100 price (for GRPO: SGLang + training) | $6.58/hr |
| API key location | `~/.runpod_key` |
| SSH key location | `~/.ssh/id_ed25519` |

---

## 14. Common errors and fixes

| Error | Cause | Fix |
|---|---|---|
| `CSRF` / `BAD_REQUEST` on GraphQL | Missing Content-Type header | Add `-H "Content-Type: application/json"` |
| `Cannot query field "costPerHour"` | Wrong field name | It's `costPerHr` |
| `Cannot query field "machine" on type "PodRuntime"` | Wrong nesting | Query `machine{...}` at top level, not under `runtime` |
| `SUPPLY_CONSTRAINT` on deploy | API inventory split from dashboard | Have operator deploy from dashboard |
| `runtime: null` after deploy with dockerArgs | Script failed before binding ports | Check `/workspace/*.log` for the script error |
| Pod shows RUNNING but proxy 404s | Log server not started yet, or wrong pod id | Wait 60s; verify pod id |
| `podTerminate` returns null but pod still RUNNING | Termination didn't take | Wait 5s, re-query, retry or use `podStop` |

---

## 15. The pre-deploy checklist (non-negotiable, every time)

Before deploying ANY pod:

1. **List all pods, confirm zero RUNNING.** Terminate zombies from prior sessions.
2. **Check balance.** If balance < (estimated_run_cost × 1.5), do NOT deploy. Tell operator to add funds.
3. **Estimate cost out loud.** `hourly_rate × estimated_hours`. State it to the operator.
4. **One-pod rule acknowledged.** Zero conductor-owned RUNNING instances.
5. **Local validation done (Rule #20).** Grade real model output locally first. $0, 5 min.
6. **Fractional plan (Rule #24).** Test 10% before committing to 100%.
7. **Teardown command named.** Write the exact `podStop`/`podTerminate` command in the ledger BEFORE provisioning.

---

*This playbook is grounded in the 2026-07-19 variant B gate run session. Update it when you learn a new failure mode or schema quirk.*
