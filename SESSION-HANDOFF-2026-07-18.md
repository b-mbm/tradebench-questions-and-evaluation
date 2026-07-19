# Session Handoff: Avalon1 / CoinBench — Start New Session Here

**Date:** 2026-07-18
**Purpose:** This session ran out of context. Everything you need to resume is below.

---

## What's happening RIGHT NOW (the immediate next action)

We are deploying a **variant B full 175-gate eval** on RunPod. The deployment is staged and ready. The operator needs to deploy it from the RunPod dashboard because the API returns SUPPLY_CONSTRAINT while the dashboard has H100s available.

### To deploy the variant B gate run:

1. Go to **https://www.runpod.io/console/deploy**
2. Select **H100 SXM 80GB**, Community Cloud
3. In the **Compute section**, select network volume **tradebench** (`qqz94ksxmn`) — this filters to US-MO-1
4. Click **Set overrides** and set:
   - **Docker Args:** `bash -c 'curl -sL https://gist.githubusercontent.com/b-mbm/b87de12124a7ab8ce85ec44bacd54fad/raw/run_variant_b_gate.sh | bash'`
   - **HTTP Port:** `8000`
   - **Container Disk:** `80` GB
5. Click **Set overrides**, then **Deploy Pod**
6. Tell the agent the pod ID

The script auto-runs: SGLang → 175 questions with variant B prompts → grade → compare to baseline (131/175) → write results. Takes ~90 minutes. Monitor at `https://<podId>-8000.proxy.runpod.net/variant-b-gate.log`.

### The Docker Args command (copy-paste this):

```
bash -c 'curl -sL https://gist.githubusercontent.com/b-mbm/b87de12124a7ab8ce85ec44bacd54fad/raw/run_variant_b_gate.sh | bash'
```

---

## Project state summary

**Goal:** Post-train Qwen3.6-27B → call it Avalon1 → top the CoinBench (TradeBench 300Q) benchmark → raise $10M.

**Current score:** 164/300 (base model, THINK ON, SGLang, de22a08 grader). 131/175 on the gate subset.

**Balance:** $7.56 on RunPod. Budget is the binding constraint.

**What works:**
- SGLang serving (NOT vLLM — vLLM has bugs #43388 and #18819 that break json_object + thinking)
- Thinking ON = +90 points (161 vs 67 without thinking)
- The serving stack beats OpenRouter by +14-17 points

**What's exhausted:**
- SFT: plateaued 4 times (v2/v3/v4, all within ±3 of base). Rejected.
- GRPO: shelved (council consensus 2026-07-09). Largest reusable error class is 2 questions.
- Post-processing/canonicalization: only +2 questions fixable. Noise.

**What's in progress:**
- Variant B prompt fix (removes ExecuteOneResponse conflict for L9+): A/B test showed schema 4/7→7/7. Full gate validation is the deployment above.
- AGI intent label disclosure (31 labels in prompt): coded but UNTESTED. Parked pending Q4 decision (is this benchmark-legitimate?).

---

## The three levers for improving the score

### Lever 1: Variant B prompt fix (+3-6 points, IN PROGRESS)

**The problem:** The system prompt injects `interface ExecuteOneResponse` (15 trading fields) into ALL questions. But L9/L10 questions need `{intent, expected_value, reasoning}` (3 fields). The model's reasoning literally says "the prompts conflict." 7 of 13 flipper questions fail because of this.

**The fix:** For L9+ questions, replace the system prompt with "follow the per-question Output Requirements." Variant B prompts are at `prompts-300q-variantB.json`.

**Evidence:** 17-question A/B test (2026-07-11): variant A 12/17 → variant B 14/17. Schema class 4/7→7/7. Holdout 2/4→3/4 (generalized). One regression (L10-017, single-sample variance).

**Status:** Full 175-gate validation is the immediate next deployment (see above).

### Lever 2: AGI intent labels (+15-40 points, PARKED)

**The problem:** 88 of 142 total benchmark failures are AGI questions failing on `intent` exact-string-match. The model reasons correctly (scores 0.5-0.69 on numeric fields) but fails because it can't guess the exact snake_case label string (e.g., `hedge_adversarial_beta`).

**The fix:** Disclose the 31 valid intent labels in the AGI prompt. Code is written and committed (`schema-prompts.ts` has the AGI_INTENT_LABELS array). The benchmark already discloses strategy labels on 11 questions — this extends the pattern.

**Status:** PARKED on the Q4 benchmark-integrity decision. The founder needs to decide: is disclosing labels benchmark-legitimate given this repo IS the benchmark? If yes, run the AGI A/B (~$1). If no, pursue semantic matching in the grader instead.

**The deeper fix:** The benchmark's own spec (§4.3) defines a strategy simulator as the oracle (deterministic replay, not label matching). The label matcher is a placeholder. Building the simulator is post-residency research.

### Lever 3: Deployment (Avalon1 on TensorDock 4090, $255/month)

**The plan:** Quantize the model to 4-bit (~14GB), deploy on RTX 4090 (24GB) via TensorDock. $0.35/hr = ~$255/month. Training stays on RunPod (big GPUs), production serving on TensorDock (cheap GPU).

**Blocker:** The 4-bit checkpoint doesn't exist yet. Need a GPU to create it.

---

## RunPod operational notes

**API vs dashboard:** The RunPod API (`podFindAndDeployOnDemand`) returns SUPPLY_CONSTRAINT even when the web dashboard shows H100s available. Always have the operator check the dashboard.

**Network volume:** `qqz94ksxmn` (named "tradebench"), 200GB, at US-MO-1. Contains the model files at `/workspace/models/qwen3.6-27b`. Can only be used with GPUs in US-MO-1.

**RunPod key:** `~/.runpod_key`

**Balance check:** `curl -s "https://api.runpod.io/graphql?api_key=$(cat ~/.runpod_key)" -H "Content-Type: application/json" -d '{"query":"{myself{clientBalance pods{id name desiredStatus}}}"}'`

**One-pod rule:** Deploy ONE pod per session. Never deploy a replacement while one lives. Stop with `podStop`, verify EXITED, then deploy new if needed.

---

## Lenny Researcher (the governing conductor)

**Authoritative version:** `~/.claude/skills/research-conductor/SKILL.md` (608 lines, updated 2026-07-18). The `.codex` copy is identical. The `conductor-kit` copy is STALE — do not use it.

**The guard:** `~/.claude/skills/research-conductor/scripts/research_guard.py` — mechanical interlock for paid commands and promotion. Copy into the repo when needed.

**Advanced profile:** `~/.claude/skills/research-conductor/references/advanced-profile.md` — initializes the append-only store, conformance check, paid-command boundary, hash-bound promotion. Mandatory before any GPU spend.

**The run ledger:** `RESEARCH-RUN.md` in the repo root. Contains R0-R2 receipts from the prior session. The advanced profile store is at `.lenny/research/variant-b-gate-2026-07-18/`.

**Current run state:**
- R0: ✅ (balance $7.56, zero running pods)
- R1: ✅ (eval-trust complete: reward audit, failure clustering, reasoning reads, A/B evidence)
- R2: ✅ (contract frozen, hypothesis h-001 written, council reviewed)
- R3: ✅ guard initialized, conformance passed, receipts recorded. Deployment staged (needs operator dashboard deploy).
- R4-R6: pending pod deployment

---

## Key files

| File | Purpose |
|---|---|
| `RESEARCH-RUN.md` | Conductor run ledger (R0-R2 receipts, contract, hypothesis, founder queue) |
| `scripts/run_variant_b_gate.sh` | Deployment script for variant B 175-gate eval |
| `prompts-300q-variantB.json` | Variant B prompts (L9+ without ExecuteOneResponse) |
| `scripts/prompt-ab-test.py` | 17-question A/B test (already run, 12/17→14/17) |
| `scripts/grpo_reward.py` | TS grader subprocess (FIXED: score passthrough) |
| `scripts/research_guard.py` | Advanced profile mechanical interlocks |
| `.lenny/research/variant-b-gate-2026-07-18/` | Guard store (init, conformance, receipts) |
| `~/.agents/skills/bayesian-post-training/SKILL.md` | Living project knowledge base |
| `~/.claude/skills/research-conductor/SKILL.md` | Lenny Researcher (governing conductor) |
| `Internal_docs/AI-RESEARCH-RETROSPECTIVE.md` | Full project retrospective (15 pages) |
| `Internal_docs/POST-TRAINING-CONDUCTOR-GROUND-TRUTH.md` | Ground-truth workflow extraction |

---

## Git state

**Branch:** `phase0-grpo-preconditions`
**Last commit:** `986a58e` — Variant B gate run: deployment script + advanced profile guard init
**Remote:** `https://github.com/b-mbm/tradebench-questions-and-evaluation.git`

---

## Gist URLs (deployment scripts)

| Script | Gist URL |
|---|---|
| Variant B 175-gate eval | https://gist.github.com/b-mbm/b87de12124a7ab8ce85ec44bacd54fad |
| Prompt A/B test (17 questions) | https://gist.github.com/b-mbm/ebbd3d4828901d4f7abc4754796e53ea |

---

## Founder Queue (open decisions)

1. **Budget:** $7.56 remaining. Variant B gate run costs ~$5. After that, need ~$15-20 for variance floor + AGI A/B. Add funds?

2. **Q4 AGI label legitimacy:** Is disclosing the 31 intent labels benchmark-legitimate? This repo IS the benchmark (no external eval server). The benchmark already discloses labels on 11 questions. The spec says "no strategy hints" but also defines a simulator (never built) as the real oracle. Founder decides: legitimate → run AGI A/B. Not legitimate → pursue semantic grader matching instead.

3. **Codex as third researcher:** Suggested giving Codex the AGI grader lane (implement semantic matching, analyze the 46 chosen_strategy labels, re-grade existing responses). This is $0 code work that doubles throughput. Founder to decide if/how to bring Codex in.

4. **RunPod supply:** API can't deploy. Operator must deploy from dashboard. This will likely persist.

---

## What to tell the new session

```
Resume the Avalon1 / CoinBench project. Read SESSION-HANDOFF-2026-07-18.md first, then RESEARCH-RUN.md, then ~/.agents/skills/bayesian-post-training/SKILL.md.

Immediate action: deploy the variant B 175-gate eval. The operator deploys from the RunPod dashboard using the Docker Args in the handoff doc. Monitor the pod when deployed.

Use ~/.claude/skills/research-conductor/SKILL.md as the governing Lenny Researcher (608 lines, the authoritative version). The conductor-kit copy is stale.
```
