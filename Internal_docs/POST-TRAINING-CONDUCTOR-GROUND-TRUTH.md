# Post-Training Conductor: Ground-Truth Workflow Extraction

**Model:** Qwen3.6-27B (hybrid Gated DeltaNet + Gated Attention, 64 layers, dense ~54GB bf16)
**Benchmark:** TradeBench 300Q (trading execution, 10 difficulty tiers L1-L11/AGI, rubric-graded)
**Infra:** RunPod (H100 80GB pods), network volume `qqz94ksxmn` at US-MO-1
**Serving:** SGLang 0.5.14 (NOT vLLM — see §2 for why)
**Training:** Hand-rolled GRPO loop (NOT TRL — see §2 for why), QLoRA 4-bit
**Date compiled:** July 14, 2026

This document is the real workflow, extracted for building a "conductor" that drives a post-training run end to end with verification gates. It is concrete and honest. FAILURES are the most valuable part and are not sanitized.

---

## 1. THE RUN, PHASE BY PHASE

The chronological spine of one actual end-to-end GRPO run, from raw data to evaluated checkpoint. This is the 2026-07-10 run that produced no improvement — included in full because the failure is more instructive than a success would be.

### Phase 0: Precondition setup (one-time, ~$15 over multiple sessions)

**What:** Establish that the model serves correctly, the grader works, and you have a reliable baseline number.

**Commands/scripts:**
```bash
# SGLang serve (the proven config)
ln -sf /workspace/vllm/bin/ninja /usr/local/bin/ninja
sglang serve --model-path /workspace/models/qwen3.6-27b \
  --served-model-name local-qwen36-27b-base \
  --dtype bfloat16 --context-length 32768 --mem-fraction-static 0.82 \
  --reasoning-parser qwen3 --disable-cuda-graph --port 30000 \
  --trust-remote-code --host 0.0.0.0

# Benchmark runner (concurrent, matching OpenRouter parity)
IDS=L9-005,L9-024,... PROBE_ENDPOINT=http://127.0.0.1:30000 \
MODELS=local-qwen36-27b-base ENABLE_THINKING=1 CONCURRENCY=4 \
BUDGET_LADDER=8000,16000,24000 TRANSPORT_RETRIES=6 \
python3 scripts/run-sglang-concurrent.py

# Grade
npx tsx scripts/grade-300q.ts outputs.json
```

**Cost:** ~$5 per full 300Q run (~2-3 hours on 1× H100). Multiple runs needed for variance.
**Baseline result:** 161/300 (base model, THINK ON, SGLang). 134/175 on the gate subset.

### Phase 1: Data preparation and split (no GPU, $0)

**What:** Identify training questions, build held-out split, measure variance.

**Scripts:**
- `scripts/build-verifiable-subset.ts` → 202 verifiable questions (exclude 98 hidden-oracle AGI)
- `scripts/build-holdout-split.ts` → 27 train / 8 holdout, stratified by latent capability strength
- `results/grpo-preconditions/grpo-holdout-split.json` → the actual split

**Variance measurement:**
```bash
# 5 runs on the 35-question flipper subset at temp 0.1
for i in 1 2 3 4 5; do
  IDS=L9-005,... PROBE_ENDPOINT=... TEMPERATURE=0.1 \
  python3 scripts/run-sglang-concurrent.py
done
```
Result: 12, 10, 11, 9, 16 out of 35. SD=2.70. **29% per-question flip rate** — these are the questions where GRPO targets.

**Cost:** ~$10 for 5 variance runs. **Critical:** Lambert's caveat — n=3 is underpowered (CI on SD is 12× wide). Need ≥5 runs for a real noise floor.

### Phase 2: Grader validation (no GPU, $0)

**What:** Verify the grader produces non-zero rewards on real model output before spending GPU on training.

**Script:**
```bash
# Grade existing variance run outputs through the training grader
npx tsx scripts/grade_scores_tmp.ts  # outputs per-question score (0.0-1.0)
```

**What we found:** The TSX worker in `grpo_reward.py` line 69 was converting scores to binary: `score: result.pass ? 1.0 : 0.0`. This discarded 67.7% of the gradient signal. The grader produces 0.0-1.0 scores with partial credit, but the training loop only saw 0 or 1.

**The check that would have caught it BEFORE the $10 run:** A 30-second histogram of the reward distribution. If all scores are 0 or 1, the binary conversion is happening somewhere.

### Phase 3: Training loop (GPU, ~$10, ~5 hours)

**What:** Run GRPO on the training questions.

**Script:** `scripts/grpo_null_loop.py` (hand-rolled ~150 lines)
```bash
# Deploy via curl-pipe-to-bash Gist
dockerArgs: "bash -c 'curl -sL https://gist.githubusercontent.com/b-mbm/.../raw/run_all_v3.sh | bash'"
```

**Config (the actual config used):**
```python
--mode real
--steps 30
--group-size 8
--temperature 0.3          # ← THIS WAS WRONG (see §2)
--eval-at 10,20,30
--max-completion-len 2048
--train-ids L10-017,L10-043,L10-047,L10-056,L3-003,L9-005,L9-024,L9-040,L9-051,L9-055,L9-059,L9-064,L4-001
```

**What happened during the run:**
- Steps 1-10: Training ran. 12/30 steps produced gradient (40%). 18 passes out of ~960 rollouts (1.9% pass rate).
- Step 10 checkpoint: LoRA saved, merged to 54GB, synced to SGLang via `grpo_sglang_glue.py`. Eval ran: 131/175 (74.9% — within noise of the 134/175 baseline).
- Steps 11-20: Training continued. Step 20 eval was skipped — 0 rollouts passed the grader.
- Step 30: **CRASHED.** Disk quota exceeded. Multiple merged 54GB model checkpoints filled the 80GB container disk.

**Cost:** $10, 5 hours, zero improvement.

### Phase 4: Diagnosis (no GPU, $0)

**What:** Figure out why the run failed. This took multiple sessions and a council convening.

**Root cause (three compounding issues):**

1. **Binary reward bug** (code, fixed): `grpo_reward.py:69` converted 0.0-1.0 to binary. Fixed to `score: result.score`.

2. **Temperature 0.3 was too high** (config, critical): At temp 0.3, pass rate was 1.9%. At temp 0.1, pass rate was 40-60% (from the variance data). The higher temperature introduced enough output format noise that the exact-match grader failed almost every rollout. There was almost no positive signal for GRPO to reinforce.

3. **Prompt conflict** (system design, months to find): The system prompt's `ExecuteOneResponse` interface (15 trading fields) conflicts with the per-question schema (3 fields: intent, expected_value, reasoning). 7 of 13 training questions were failing because of this conflict, not because of math errors. The model's reasoning text literally said "the prompts conflict."

### Phase 5: Evaluation (GPU, ~$5, ~45 min per checkpoint eval)

**What:** Grade the trained checkpoint on the 175-question gate set.

**Script:** `eval_checkpoint()` in `grpo_null_loop.py` calls `run-sglang-concurrent.py` as subprocess, then grades via TS grader.

**Result:** 131/175 vs 134/175 baseline. Within noise (SEM ~2.7). No improvement.

---

## 2. RECURRING TRAPS AND FAILURE MODES (THE GOLD)

Every place something went wrong. For each: what happened, what it cost, how we recovered, and the check that would have caught it before the spend.

### Trap 1: Binary reward bug in grader subprocess

**What happened:** The TS grader (`gradeSchemaResponse`) returns `result.score` (0.0-1.0) and `result.pass` (boolean). The TSX worker that wraps the grader for the training loop converted to binary: `score: result.pass ? 1.0 : 0.0`. The training loop read `score` and got 0 or 1 for every rollout, discarding partial credit.

**Cost:** The entire $10 GRPO run was wasted. The gradient signal was 67.7% weaker than it should have been. 40% of steps had zero gradient (all rollouts scored the same → zero advantage).

**How recovered:** Found by post-run diagnostic — histogrammed the reward distribution and saw everything was 0 or 1 despite the grader producing partial credit.

**Check that catches it before spend:** Feed 10 real model responses through the grader, print the raw scores. If everything is 0 or 1, you have a binary conversion bug. 30 seconds, $0.

### Trap 2: Temperature too high for exact-match grader

**What happened:** Training used temp 0.3. The exact-match grader (numeric range checks, set equality, label matching) has zero tolerance for format variation. At temp 0.3, the model's output format became noisy enough that 98% of rollouts failed. GRPO had almost no positive examples to learn from.

**Cost:** Same $10 run. Even with the binary reward fixed, temp 0.3 would have produced too few passes for meaningful advantage computation.

**How recovered:** Checked the 5-run variance data: same questions at temp 0.1 showed 40-60% pass rate. The temperature was the killer.

**Check that catches it before spend:** Run 8 rollouts at the training temperature on 3 training questions. If pass rate <10%, the temperature is too high for the grader's tolerance. 5 minutes, ~$0.10.

### Trap 3: Prompt conflict masquerading as capability gap

**What happened:** 7 of 13 training questions were failing because the system prompt defines `interface ExecuteOneResponse` (15 fields) for ALL questions, but L9/L10 questions need `{intent, expected_value, reasoning}` (3 fields). The model's reasoning text explicitly said "the system prompt conflicts with the user prompt." When the model followed the system prompt, it omitted `expected_value` and filled in trading fields → zero credit.

**Cost:** Months of investigation, multiple SFT runs, a GRPO run — all partially aimed at fixing what was actually a prompt bug.

**How recovered:** A/B tested variant B (removed ExecuteOneResponse from L9+ system prompt) vs variant A (current). Schema class improved from 4/7 to 7/7. One holdout question generalized without being targeted.

**Check that catches it before spend:** Read the model's reasoning text on failing questions. If the model says "the prompts conflict" or "I'm confused about the schema," it's a prompt issue, not a capability issue. Free.

### Trap 4: TRL is incompatible with SGLang

**What happened:** Planned to use TRL GRPOTrainer with `vllm_mode="server"` pointing at SGLang. Verified from TRL's source code: it calls `/get_world_size/`, `/init_communicator/` (NCCL) at construction — SGLang implements none of these. TRL POSTs to `/generate/` (vLLM custom endpoint) — SGLang uses `/v1/chat/completions`. TRL calls `vllm_client.update_named_param()` → vLLM's `/start_weight_update/` — SGLang doesn't implement this.

**Cost:** ~3 hours of development on weight-sync glue code that couldn't work. No GPU spend (caught before deployment).

**How recovered:** Hand-rolled a ~150-line GRPO loop instead.

**Check that catches it before development:** Attempt one request through the framework's server mode to the target serving endpoint. If it fails, the integration is broken. 5 minutes.

### Trap 5: Disk quota from merged model checkpoints

**What happened:** Each checkpoint eval requires saving the LoRA adapter, merging it with the base model (54GB), and syncing to SGLang. The merged models were saved to the network volume and not cleaned up. After 3 checkpoints, the 80GB container disk was full. The run crashed at step 30.

**Cost:** Lost the final checkpoint eval. The first 2 checkpoints were fine (steps 10 and 20), but we couldn't evaluate the final model state.

**How recovered:** Identified the cause from the log. Did not re-run (the diagnosis showed no improvement anyway).

**Check that catches it before spend:** Calculate disk budget upfront: base model (54GB) × number of checkpoints + container overhead. If total > disk size, add cleanup between checkpoints. Or: only keep the latest merged model, delete previous.

### Trap 6: Sequential rollout generation hangs training

**What happened:** The first version of `grpo_null_loop.py` generated rollouts sequentially — one curl call at a time. With G=8 rollouts per question × 4 questions = 32 sequential requests, each taking 2-10 minutes (thinking ON generates long responses). Total: 60+ minutes per step. Training appeared stuck for 25+ minutes with no error.

**Cost:** ~2 hours of debugging a "hang" that was just slow code. No GPU waste (identified before the real run).

**How recovered:** ThreadPoolExecutor with concurrency=8. All G rollouts for a question generate in parallel. Step time dropped from 60+ min to ~5-10 min.

**Check that catches it before spend:** Time a single step with 2 questions × G=2. If it takes >10 min, you have a serialization problem.

### Trap 7: vLLM schema collapse with json_object + thinking

**What happened:** vLLM's xgrammar locks onto the `ExecuteOneResponse` TypeScript interface in the system prompt. Every AGI response collapses to `{intent, order_type, asset, size, venue}` — the question-specific fields never appear. Compounded by bug #18819: removing `--reasoning-parser` to fix collapse also removes thinking.

**Cost:** Weeks of investigation and multiple failed runs on vLLM before switching to SGLang. Estimated $30-50 in wasted GPU time across early sessions.

**How recovered:** Switched to SGLang, which handles json_object + thinking natively.

**Check that catches it before spend:** Generate one AGI response with the serving framework. Check whether the response contains question-specific fields or always collapses to the generic schema. 30 seconds.

### Trap 8: Zombie pods draining balance

**What happened:** Pods stopped via `podStop` sometimes survive in a zombie state and keep charging. Pods from prior sessions (different context windows) persist because the agent doesn't check for them. Each new session starts fresh and may not know about old pods. On 2026-07-09, zombie pods that survived termination cost $20+.

**Cost:** $20+ over multiple incidents.

**How recovered:** Iron Rule + Zombie Rule + Verify-Termination Rule (documented in skill). At session start: query ALL pods, terminate every one.

**Check that catches it before spend:** `curl -s "https://api.runpod.io/graphql?api_key=$KEY" -d '{"query":"{myself{pods{id name desiredStatus}}}"}'`. Verify zero RUNNING pods before deploying.

### Trap 9: RunPod API returns SUPPLY_CONSTRAINT when dashboard shows availability

**What happened:** The RunPod API's `podFindAndDeployOnDemand` returned `SUPPLY_CONSTRAINT` for every GPU type for 5+ hours. The operator checked the web dashboard and found H100s available immediately. Deployed manually in 2 minutes.

**Cost:** 5 hours of polling delay on the A/B test.

**How recovered:** Operator deployed from the dashboard.

**Check:** When the API reports no supply for >30 min, escalate to operator to check the dashboard.

### Trap 10: Python grader calibration mismatch

**What happened:** A pure-Python grader was written to replace the TS grader (to eliminate Node/tsx dependency). It scored 1/22 on training questions where the TS grader scored 7/22. The Python grader was too strict — L10 partial-credit bands didn't match, L3/L5 fuzzy thresholds differed.

**Cost:** $25+ — deployed a GPU pod and ran for 2+ hours before discovering the calibration mismatch. All rollouts scored 0 because the grader was wrong.

**How recovered:** Reverted to TS grader.

**Check that catches it before spend:** Run BOTH graders on the same 10 responses. If they disagree by >2 questions, you have a calibration issue. 5 minutes, $0.

### Trap 11: CUDA_VISIBLE_DEVICES device ordinal error

**What happened:** Setting `CUDA_VISIBLE_DEVICES=1` before the training subprocess made only GPU 1 visible as `cuda:0`. But transformers' internal device enumeration (`caching_allocator_warmup`) tried to access a device index that didn't exist. Crash at model load.

**Cost:** ~1 hour of debugging.

**How recovered:** Don't set CUDA_VISIBLE_DEVICES for training. Let it see both GPUs. Target GPU 1 via `device_map={"": "cuda:1"}`.

### Trap 12: Eval subprocess crash kills training loop

**What happened:** `eval_checkpoint()` spawns `run-sglang-concurrent.py` as subprocess. The eval crashed on a specific question (timeout or OOM). The subprocess failure propagated and killed the entire training loop.

**Cost:** Lost training progress at step 20.

**How recovered:** Wrapped eval in try/except. If eval crashes, log the error and skip — continue training.

---

## 3. RECURRING MANUAL STEPS

Everything done by hand on every run. These are conductor candidates.

### 3.1 Zombie pod termination (every session start)
```bash
RUNPOD_KEY=$(cat ~/.runpod_key)
curl -s "https://api.runpod.io/graphql?api_key=$RUNPOD_KEY" \
  -d '{"query":"{myself{pods{id name desiredStatus}}}"}'
# Then manually terminate each RUNNING pod
```
**Tedious because:** 66 exited pods in the list. Have to scan for RUNNING ones. Easy to miss one. Should be automated: "terminate all RUNNING pods at session start."

### 3.2 Balance check (every pre-deploy)
```bash
curl -s "https://api.runpod.io/graphql?api_key=$RUNPOD_KEY" \
  -d '{"query":"{myself{clientBalance}}"}'
```
**Tedious because:** Must verify balance > estimated cost × 1.5 before deploying. Easy to forget when excited about a new idea.

### 3.3 Gist publication (every script change)
```bash
gh gist create scripts/run_all_v3.sh --public --desc "GRPO deployment"
# Then update the dockerArgs in the deploy command with the new raw URL
```
**Tedious because:** Every script change requires re-publishing the Gist and updating the deploy command. The Gist URL is stable but the content changes. Should be: commit to repo → pod clones repo → runs script from repo. The Gist is a workaround for the deployment pattern.

### 3.4 Repo visibility toggle (for pod cloning)
```bash
# The repo is private. Pods can't clone without auth.
# Workaround: make repo public → deploy pod (which clones) → make repo private
gh repo set-public tradebench-questions-and-evaluation
# ... deploy pod, wait for clone to succeed ...
gh repo set-private tradebench-questions-and-evaluation
```
**Tedious because:** Timing-dependent. If the pod hasn't cloned yet when you set it private, the clone fails. Should be: use a deploy key or PAT baked into the deployment script.

### 3.5 SGLang startup verification (every pod)
```bash
# Wait for SGLang to be ready (up to 10 min for cold start)
for i in $(seq 1 120); do
  if curl -sf "$SGLANG_URL/v1/models" | grep -q "local-qwen36"; then
    echo "SGLang ready"; break
  fi
  sleep 5
done
```
**Tedious because:** Cold start takes 4-6 minutes (GDN kernel JIT). The ninja symlink must be created before serving. Easy to forget the ninja step → first request crashes.

### 3.6 Log monitoring via HTTP proxy
```bash
# Monitor training progress via the proxied log server
curl -s "https://<podId>-8000.proxy.runpod.net/training.log" | tail -50
# Check for DONE flag
curl -s "https://<podId>-8000.proxy.runpod.net/results/DONE"
```
**Tedious because:** Must know the pod ID, construct the proxy URL, and poll manually. Should be: conductor polls automatically and alerts on DONE/FAILED.

### 3.7 Pod stop after run completion
```bash
curl -s "https://api.runpod.io/graphql?api_key=$RUNPOD_KEY" \
  -d '{"query":"mutation{podStop(input:{podId:\"<id>\"}){id}}"}'
```
**Tedious because:** Easy to forget. The deployment script has a `sleep 600; exit 0` that stops the container, but if the script fails before that line, the pod stays alive and billing continues.

---

## 4. DECISION FORKS

### Fork 1: SFT vs GRPO vs DPO

**Options considered:**
- **SFT (Supervised Fine-Tuning):** Behavior cloning on corrected answers
- **GRPO (Group Relative Policy Optimization):** RL with group-relative advantage, using the grader as reward
- **DPO (Direct Preference Optimization):** Preference pairs from correct vs incorrect rollouts
- **RFT (Rejection-sampling Fine-Tuning):** SFT on the passing rollouts only

**What we chose:** SFT first (4 attempts), then GRPO. Never tried DPO or RFT.

**Why:** SFT was the cheapest and most standard. GRPO was chosen when SFT plateaued because the grader provides a verifiable reward signal — RL can optimize it directly. DPO requires preference pairs and doesn't directly optimize the reward. RFT was proposed by Finn (council) but not pursued.

**Would I trust an agent to decide this?** Partially. The framework choice depends on: (a) is the reward verifiable? (verifiable → GRPO/RL; non-verifiable → DPO), (b) does the model have latent capability? (yes → RL can work; no → need more data), (c) what's the budget? (SFT is cheap, GRPO is expensive). An agent can assess these factors but the final call benefits from human judgment on risk tolerance.

### Fork 2: Reward shape

**Options considered:**
- **Binary (pass/fail):** `result.pass ? 1.0 : 0.0`
- **Continuous (normalized score):** `result.score` (0.0-1.0 with partial credit)
- **Shuffled (null-reward control):** real scores permuted within each group

**What we chose:** Started with binary (accidentally — the TSX worker converted). Should have used continuous.

**Why:** The grader produces partial credit on most question types (L1-L8: 78% partial credit rate, L11/AGI: 100%). Binary discards this signal. For L9/L10 specifically, the grader is genuinely binary (exact match), so it doesn't matter there — but the binary bug was still wrong for L1-L8.

**Would I trust an agent to decide?** Yes, conditionally — if the agent histograms the reward distribution first. The reward shape is determined by the data, not by preference. An agent that checks "what does the score distribution look like?" will make the right call.

### Fork 3: Training temperature

**Options considered:** 0.1, 0.3, 0.7, 1.0

**What we chose:** 0.3 (wrong). Should have used 0.1.

**Why:** Higher temperature = more exploration = more diverse rollouts. That's the textbook RL intuition. But with an exact-match grader, higher temperature = more format noise = more false negatives. The variance data at temp 0.1 already showed sufficient within-group diversity (29% flip rate). There was no need for higher temperature.

**Would I trust an agent to decide?** Yes — if the agent checks the pass rate at the proposed temperature before committing. The temperature is determined by the grader's tolerance, not by RL theory.

### Fork 4: Training question selection

**Options considered:**
- All 27 questions from the holdout split
- 13 "flipper" questions (those that pass sometimes, fail sometimes)
- L1-L8 questions (dense partial credit)
- L9/L10 only (binary reward, proven variance)

**What we chose:** 13 L9/L10 flippers.

**Why:** Flippers are the ideal GRPO target — they have variance (sometimes right, sometimes wrong), which means GRPO can learn from the contrast. Always-pass questions provide no gradient (all positive). Always-fail questions provide no gradient (all negative). L1-L8 were considered (dense reward) but they're easy questions with less headroom.

**In hindsight:** This was wrong because 7/13 flippers were failing due to the prompt conflict, not capability gaps. The prompt fix should have come first.

**Would I trust an agent to decide?** Yes — if the agent categorizes failure modes (format vs capability) before selecting training questions.

### Fork 5: Checkpoint selection

**Options considered:** Steps 10, 20, 30 (pre-registered eval points)

**What we chose:** Eval at all three. Only step 10 produced a result (step 20 had 0 passes, step 30 crashed).

**Would I trust an agent?** Yes — checkpoint selection is mechanical. Eval every N steps, keep the best.

---

## 5. TOOLING AND COMMANDS

### Serving

| Component | Version | Purpose |
|---|---|---|
| SGLang | 0.5.14 | Model serving (handles json_object + thinking) |
| ninja | (from vllm venv) | Triton kernel JIT build tool (must be on PATH) |
| RunPod template | `runpod/pytorch:1.0.2-cu1281-torch280-ubuntu2404` | Base container image |

**Serve command:**
```bash
CUDA_VISIBLE_DEVICES=0 sglang serve \
  --model-path /workspace/models/qwen3.6-27b \
  --served-model-name local-qwen36-27b-base \
  --dtype bfloat16 --context-length 32768 --mem-fraction-static 0.82 \
  --reasoning-parser qwen3 --disable-cuda-graph --port 30000 \
  --trust-remote-code --host 0.0.0.0
```

### Training

| Component | Purpose |
|---|---|
| `scripts/grpo_null_loop.py` | Hand-rolled GRPO loop (REINFORCE + group-relative advantage) |
| `scripts/grpo_reward.py` | TS grader subprocess (GraderSubprocess class) |
| `scripts/grpo_sglang_glue.py` | Weight sync: save LoRA → merge → SGLang update |
| bitsandbytes | 4-bit quantization (NF4, double quant) |
| peft | LoRA adapter (r=32, alpha=64) |

**Training venv:**
```bash
python3 -m venv --system-site-packages /root/train
/root/train/bin/pip install torch transformers peft bitsandbytes accelerate numpy requests
```

### Eval

| Component | Purpose |
|---|---|
| `scripts/run-sglang-concurrent.py` | Benchmark runner (ThreadPoolExecutor, streaming, budget ladder) |
| `scripts/grade-300q.ts` | Full benchmark grader |
| `src/grading/schema-grader-300q.ts` | The actual grading logic (3700+ lines) |
| `src/rubrics/loader-300q.ts` | Rubric loader |

**Eval command:**
```bash
IDS=<question-ids> OUT_DIR=<dir> PROBE_ENDPOINT=<url> \
MODELS=local-qwen36-27b-base ENABLE_THINKING=1 CONCURRENCY=4 \
BUDGET_LADDER=8000,16000,24000 TRANSPORT_RETRIES=6 \
python3 scripts/run-sglang-concurrent.py
```

### Deployment

| Component | Purpose |
|---|---|
| `scripts/run_all_v3.sh` | Self-contained deployment script (published as Gist) |
| GitHub Gist | curl-pipe-to-bash distribution |
| RunPod API | Pod deployment, monitoring, termination |
| HTTP proxy | `https://<podId>-8000.proxy.runpod.net` for log access |

### Monitoring

```bash
# Pod status
curl -s "https://rest.runpod.io/v1/pods/<podId>" -H "Authorization: Bearer $KEY"

# Training log (via log server on port 8000)
curl -s "https://<podId>-8000.proxy.runpod.net/training.log" | tail -50

# SGLang health
curl -s "https://<podId>-8000.proxy.runpod.net:30000/v1/models"  # (localhost only — won't work via proxy)

# DONE/FAILED flag
curl -s "https://<podId>-8000.proxy.runpod.net/results/DONE"
```

### Checkpoint storage

- **LoRA adapters:** Saved to `/workspace/results/lora-step-N/` (small, ~600MB)
- **Merged models:** Saved to `/workspace/results/merged-step-N/` (large, 54GB each)
- **Problem:** Merged models fill disk. Must clean up between checkpoints.
- **Network volume:** Persists across pod restarts. But 200GB fills up fast with multiple 54GB checkpoints.

---

## 6. EVAL METHODOLOGY

### The benchmark

**TradeBench 300Q:** 300 trading execution questions across 10 difficulty tiers.
- L1-L8 (40 questions): Simple order execution. Output: ExecuteOneResponse JSON.
- L9 (81 questions): Quantitative trading math. Output: `{intent, expected_value, reasoning}`.
- L10 (69 questions): Harder scenarios. Same format.
- L11/AGI (110 questions): Complex multi-step agent scenarios. Output: strategy with intent, chosen_strategy, numeric fields, execution sequences.

### Grading

**TypeScript rubric grader** (`src/grading/schema-grader-300q.ts`). Each question has a rubric defining:
- Expected fields and weights
- Numeric ranges (re-derivable, verifiable)
- Label strings (exact-match for AGI intent/chosen_strategy)
- Pass threshold: normalized score ≥ 0.7

**What "the model got better" means:** More questions scoring ≥ 0.7. Specifically: net delta on the 175-question gate set, with variance bars (≥5 runs).

### Held-out methodology

**Split:** 27 train / 8 holdout, stratified by latent capability strength (`results/grpo-preconditions/grpo-holdout-split.json`).
**98 AGI questions:** Quarantined (later found to be partially unnecessary — see §2).
**Contamination check:** Capability probe at temp 0.7 showed 39/53 failed questions have latent capability (correct answer appears in sampling). 14 are knowledge-deficit (0/16 correct across 16 samples).

### Variance

- 5 runs on 35-question subset at temp 0.1: scores 12, 10, 11, 9, 16. SD=2.70.
- **Full 175-gate variance: NEVER MEASURED.** Only one baseline run (134/175). This is a known gap — Lambert flagged it repeatedly.
- **Noise floor estimate:** Scaling the 35-subset SD to 175 gives ~±5.6. So a delta of <6 questions is invisible.

### Definition of "green"

A training run is a success if:
1. Post-training score on 175-gate > baseline + 2×SEM (pre-registered)
2. Holdout (8 questions) shows non-negative delta
3. No regression on the 202 verifiable questions outside the training set
4. Null-reward control shows the same or worse performance (real reward is doing work)

We never hit green.

---

## 7. REPRODUCIBILITY AND PROVENANCE

### What we track

| Artifact | Tracked? | Where |
|---|---|---|
| Model version | Yes | `Qwen/Qwen3.6-27B` (HuggingFace) |
| SGLang version | Yes | 0.5.14, installed in `/root/sglang` venv |
| Training script version | Yes | Git commit hash on branch `phase0-grpo-preconditions` |
| LoRA config | Yes | r=32, alpha=64, target_modules=[all], nf4, double_quant |
| Training questions | Yes | 13 IDs in `--train-ids` argument |
| Gate eval questions | Yes | `results/grpo-preconditions/gate-eval-ids.txt` (175 IDs) |
| Holdout split | Yes | `results/grpo-preconditions/grpo-holdout-split.json` |
| Random seed | Partially | `--seed 42` for training. Eval does not seed (temp 0.1 sampling). |

### What we DO NOT track (but should)

| Missing | Impact |
|---|---|
| **Data hashes** | Training data is generated by scripts, not versioned. Can't verify two runs used the same data. |
| **Checkpoint lineage** | No record of which checkpoint was trained on which data with which config. LoRA adapters are saved but not linked to their training run. |
| **Eval environment** | SGLang version, CUDA version, and container image version are not pinned to eval results. An eval run could be on a different SGLang version than the training run. |
| **Temperature per eval** | The eval runner uses temp 0.1 but this is set via env var, not recorded in the output. |
| **Rubric versions** | The grader code changes over time (we modified it). No version pinning on which grader version produced which score. |
| **Full 175-gate variance** | Never measured. Without error bars, we can't distinguish signal from noise. |

---

## 8. WHAT IS EXPENSIVE OR IRREVERSIBLE vs CHEAP

### Expensive / slow / irreversible (measure twice, cut once)

| Step | Cost | Irreversible? | Why it's expensive |
|---|---|---|---|
| Full GRPO training run (30 steps) | $10-15, 5-6 hours | No (can re-run) | GPU time × duration. If it fails, you've burned the budget. |
| Full 300Q benchmark run | $5, 2-3 hours | No | Long inference time, especially AGI (15-20k char reasoning per question) |
| SFT training run | $5-10, 2-3 hours | No | GPU time for training |
| Merged model checkpoint | 54GB disk | Yes (fills disk) | If not cleaned up, disk fills and crashes the run |
| Data commit (publishing to repo) | $0 | Yes (git history) | Wrong data baked into a commit requires a new commit to fix |
| Balance depletion | $$$ | Yes (money) | Pod reclamation when balance hits zero — no warning, no graceful shutdown |

### Cheap / fast / re-runnable (front-load verification here)

| Step | Cost | Time | Why it's cheap |
|---|---|---|---|
| Local data analysis | $0 | Minutes | All data is on disk. Grading existing responses is free. |
| Reward histogram | $0 | 30 seconds | Feed 10 responses through the grader, plot scores |
| Prompt A/B test (17 questions) | $0.35 | 15 min | Small inference job |
| Fractional GRPO run (3 steps) | $2 | 45 min | 10% of the full run |
| Variance measurement (35-question subset) | $2 | 30 min | 5 runs at temp 0.1 |
| Code review (council / GPT-5.5) | $0 | 10-30 min | No GPU needed |
| Prompt/schema inspection | $0 | Minutes | Read the prompt, read the rubric, read the model's reasoning |

**The principle:** Every expensive step should be preceded by a cheap verification step. The conductor should enforce: local analysis → fractional run → full run. Each stage gates the next.

---

## 9. STILL UNSOLVED / MOST PAINFUL

### 9.1 The AGI tier (40 near-miss questions)

40 AGI questions score 0.5-0.69 — just below the 0.7 pass threshold. ALL 40 fail on `intent` exact-match against hidden labels. The fix (disclose 31 intent labels in the prompt) is coded but untested on GPU.

**Where an orchestrator helps:** The orchestrator should flag systematic failure patterns — when 100% of near-misses fail for the same reason, that's a grader issue, not a capability gap.

### 9.2 The chosen_strategy label problem

46 unique strategy labels, each a specific tactical decision (`alt_beta_pair_matic_first`, `private_first_cross_venue`). The model can't infer these from the prompt. Semantic matching in the grader would help, but it's a code change to the grader logic.

**Where an orchestrator helps:** The orchestrator should decompose pass/fail into field-level scores and identify which fields are the bottleneck. When one field type accounts for 100% of failures, that's the fix target.

### 9.3 Full-gate variance was never measured

We have ONE baseline run on the 175-gate (134/175). Without error bars, we can't claim any improvement is real. Every training decision was made against a number with unknown noise.

**Where an orchestrator helps:** The orchestrator should require variance measurement (≥3 runs, preferably 5) before any training decision is made. "One number is zero numbers."

### 9.4 GPU supply unpredictability

RunPod supply is inconsistent. The API and dashboard pull from different pools. Alternative providers exist but require separate accounts and different deployment scripts.

**Where an orchestrator helps:** Multi-provider support with automatic failover. When one provider returns no supply, automatically try the next. Fall back to the operator for dashboard-based deployment.

### 9.5 The prompt is not versioned or tested

Prompt changes affect the benchmark score but aren't tracked as first-class artifacts. The variant B prompt fix was tested once (A/B, 17 questions) but never validated at scale.

**Where an orchestrator helps:** The prompt should be a versioned artifact with its own test suite. Before any prompt change ships, it must pass a regression test on the full gate (no new failures on previously-passing questions).

### 9.6 The benchmark may not measure trading edge

No one has verified that a higher TradeBench score correlates with better trading decisions. The AGI questions test format compliance and label memorization as much as strategy. A markets/quant practitioner would question whether 161 → 200 means anything for actual PnL.

**Where an orchestrator helps:** The orchestrator should support multiple eval tracks — not just the benchmark score, but also qualitative assessments (does the model's reasoning make sense to a human expert?).

---

## TRADING-SPECIFIC CONSIDERATIONS

These are unique to post-training a TRADING model and would be missed by a generic post-training pipeline.

### Reward = regret/oracle design

Trading benchmarks grade against an "optimal" answer, but DeFi strategies often have multiple materially-different answers that pass. If the rubric's canonical is one of several optima, "cracking" it is matching an arbitrary choice. The benchmark's own spec (§4.3) defines a strategy simulator as the oracle (replay the strategy, check the outcome) — but it's never been built. The current label-matching grader is a placeholder.

### Market-data contamination and leakage

Qwen3.6 likely saw DeFi protocol documentation, governance proposals, and trading strategies in its pretraining data. The 20/110 AGI score may partly reflect recall (the model knows about MATIC/SOL/liquidation cascades from training) rather than reasoning. A null-reward control (train with random reward, see if score moves) would distinguish learned skill from recall.

### Difficulty-tier stratification

The benchmark has 10 tiers with fundamentally different output formats:
- L1-L8: trading orders (ExecuteOneResponse)
- L9-L10: numeric answers (expected_value)
- L11/AGI: strategy labels + numeric fields + execution sequences

A generic pipeline would treat these uniformly. A trading-specific pipeline must handle per-tier formatting, grading, and prompt construction separately. The system prompt conflict (§2, Trap 3) is a direct consequence of using one prompt template for all tiers.

### Look-ahead risks in the eval

The benchmark questions include "Context JSON" with prices and timestamps. The model could potentially learn to recognize patterns in the context that correlate with the expected answer (e.g., "if BTC price > $50k, the answer is always 'buy'"). This is a form of data leakage through the context block. Not currently checked.

### The label-trivia problem

AGI questions grade on exact snake_case strategy labels (`hedge_adversarial_beta`, `liquidation_cascade_defense`). These are domain-specific jargon that a general-purpose LLM wouldn't naturally emit. The benchmark is testing label memorization as much as strategy quality — a known defect flagged by the benchmark's own design methodology (Gate 6: "an exact undisclosed label string the solver can't infer is testing label-trivia, not skill").

---

*This document was extracted from the Qwen3.6-27B TradeBench post-training project (June-July 2026). It is intended as ground-truth input for building a post-training orchestration conductor. The failures are the most valuable part — they define where verification gates must be placed.*
