# Session Handoff: Avalon1 / CoinBench — Variant B Gate Run COMPLETE

**Date:** 2026-07-19
**Prior handoff:** `SESSION-HANDOFF-2026-07-18.md` (staged the deployment this session executed)
**Author session:** the one that deployed pod `crpo2po5lv18m3`, monitored it, and discovered the baseline confound.
**Purpose:** Codex (or any new session) reads this FIRST. It contains everything: what ran, what the result was, a baseline confound that changes the project's history, and the open decisions.

> **Status update:** the open decisions and the $20-30 replication estimate below are superseded by the `Codex takeover addendum` at the end of this file. Variant B is closed without replication; no further inference spend is authorized.

---

## TL;DR — read this paragraph first

We deployed the variant B 175-gate eval (the thing the prior handoff staged). The run was clean: 123 min, ~$6, zero errors, pod stopped the instant it finished. **Variant B scored 141/175.** But while analyzing the result, I discovered that the "131/175 baseline" cited everywhere in the project (handoff, RESEARCH-RUN.md, bayesian skill) was actually the **SFT v2 model**, which we had already rejected. The correct **base-model** baseline is **143/175**. So variant B is **−2 vs base, not +10 vs SFT**. Hypothesis h-001 (predicted +3-6 on L9/L10) is **falsified on this single run**. The 175-gate SEM was never measured, so −2 is plausibly within noise — a replicate (n=5, ~$20-30) is the only way to know for sure. Three founder decisions are open.

---

## Repository

**Path:** `/Users/bradleymiles/Documents/tradebench-questions-and-evaluation`
**Remote:** `https://github.com/b-mbm/tradebench-questions-and-evaluation.git` (PUBLIC — needed for in-pod clone)
**Branch:** `phase0-grpo-preconditions`
**Git user:** `b-mbm` / `91922943+b-mbm@users.noreply.github.com`
**HEAD commit (end of this session):** the commit that adds this file + RESEARCH-RUN.md + the guard store receipts (see git log after commit)

---

## What this session actually did (chronological)

### 1. Resumed from the 2026-07-18 handoff
Read `SESSION-HANDOFF-2026-07-18.md`, `RESEARCH-RUN.md`, `~/.agents/skills/bayesian-post-training/SKILL.md`, and the authoritative conductor `~/.claude/skills/research-conductor/SKILL.md` (608 lines — the conductor-kit copy is stale, do not use).

### 2. Pre-deploy verification (all $0, all passed)
- **Zombie check:** all 70 pods EXITED, 0 RUNNING, zero zombies.
- **Balance:** $7.41 at session start.
- **Gist liveness:** `https://gist.githubusercontent.com/b-mbm/b87de12124a7ab8ce85ec44bacd54fad/raw/run_variant_b_gate.sh` fetched OK, **byte-identical** to local `scripts/run_variant_b_gate.sh`.
- **Script correctness:** verified `scripts/run-sglang-concurrent.py` honors the `PROMPTS_FILE`, `IDS`, `OUT_DIR`, `TEMPERATURE` env vars (lines 15-20) — so the pod would actually run variant B on the 175 gate IDs.
- **Remote state:** `prompts-300q-variantB.json` (857 KB) and `results/grpo-preconditions/gate-eval-ids.txt` (175 IDs) both committed on `origin/phase0-grpo-preconditions` (the branch the pod clones).
- **Grader freeze:** the committed `scripts/grade-300q.ts` + `scripts/_grader_worker.ts` are identical between the frozen point `de22a08` and HEAD `0d156b3`. The pod grades under the exact evaluator that produced the baseline.

### 3. Operator deployed from the RunPod dashboard
RunPod API still returns SUPPLY_CONSTRAINT; the dashboard has H100s. Operator went to `https://www.runpod.io/console/deploy`, selected H100 SXM 80GB Community Cloud in US-MO-1, network volume `tradebench` (`qqz94ksxmn`), set Docker Args to:
```
bash -c 'curl -sL https://gist.githubusercontent.com/b-mbm/b87de12124a7ab8ce85ec44bacd54fad/raw/run_variant_b_gate.sh | bash'
```
HTTP Port 8000, Container Disk 80 GB. Pod ID returned: **`crpo2po5lv18m3`** (name `comparative_peach_woodpecker`), $2.99/hr.

### 4. Monitoring
Polled the log proxy at `https://crpo2po5lv18m3-8000.proxy.runpod.net/` every ~9 min (tool ceiling was 10 min). Timeline:
- **03:28:55 UTC** — run started
- **03:29:09** — Node.js installed
- **03:30:00** — repo cloned at HEAD `0d156b3` (verified in pod log)
- **03:34:38** — SGLang ready after 35×5s (~3 min cold start; ninja symlink + cached install worked)
- **03:35:10** — first prefill batch, eval generating
- **03:35 → 05:31** — steady ~102 tok/s, 4 concurrent, zero errors, ~1.4 questions/min
- **05:31:52 UTC** — DONE flag appeared, 175/175 complete
- Pod stopped within seconds via `podStop`, verified `desiredStatus: EXITED`. No idle burn.

### 5. Result capture + baseline reconciliation ($0 local analysis, Rule #20)
The grader output on the pod said variant B = **scoreSum 144.5, passCount 141/175**. To compute the delta, I re-graded the candidate baseline files locally on the exact 175 gate IDs under the `de22a08` grader. This is where the confound surfaced. See "The confound" below.

### 6. Receipts recorded in the guard store
All paid/promotion receipts are hash-chained in `.lenny/research/variant-b-gate-2026-07-18/events.jsonl`:
- seq 1: `run_initialized` (prior session)
- seq 2: `executor_conformance` (prior session)
- seq 3: `eval_trust` (prior session)
- seq 4: `comparability` (prior session)
- seq 5: `budget` (prior session)
- **seq 6: `budget` — R4 deployment receipt (this session)**
- **seq 7: `phase_live_qa` — R5 result receipt (this session)**

Artifacts at `.lenny/research/variant-b-gate-2026-07-18/artifacts/`:
- `r4-deploy/deploy-manifest.json` + `deploy-payload.json`
- `r5-result/variant-b-result.json` + `variant-b-result-payload.json`
- `sha256/` — content-addressed copies of each subject/payload

---

## The result

### Variant B graded output (175 gate questions, de22a08 grader, thinking ON, temp 0.1)

```
graded 175/300 | parsed 175/175 | scoreSum 144.5 | passCount 141
per-level:
  L1: 3/3 pass    L2: 3/4 pass    L3: 0/1 pass    L4: 0/4 pass
  L5: 2/4 pass    L6: 3/3 pass    L7: 2/4 pass    L8: 9/9 pass
  L9: 62/68 pass    L10: 56/63 pass    L11: 1/12 pass
```

### ⚠️ The confound: which baseline is correct?

Re-grading the three candidate baselines locally ($0) on the exact 175 gate IDs under `de22a08`:

| Model | scoreSum | passCount | Source file | Status |
|---|---|---|---|---|
| **Base (variant A prompt)** | **145.5** | **143/175** | `results/community/300/run300-base-thinkon-2026-06-29/results.jsonl` | **✅ correct comparator** |
| SFT v2 | 136.3 | 131/175 | `results/community/300/run300-sft-thinkon-2026-06-29/results.jsonl` | ❌ rejected (plateaued 4×, −3 vs base) |
| **Variant B (this run)** | **144.5** | **141/175** | pod `crpo2po5lv18m3` → volume | under test |

**The "131/175 baseline" cited in `SESSION-HANDOFF-2026-07-18.md`, `RESEARCH-RUN.md` R3.1, and the bayesian skill is the SFT v2 number, not the base number.** R3.1 cited the SFT file (`run300-sft-thinkon-2026-06-29`) as the baseline source. SFT was rejected in the same skill doc. The correct comparator for a prompt-only change is the **base model on variant A prompts** = **143/175**.

This means every prior "within noise of 131/175" claim in the project (e.g. GRPO step-10 at 131/175) was being compared to SFT, not base.

### Per-stratum delta (variant B vs correct base baseline)

| Stratum | Base (variant A) | Variant B | Delta | h-001 prediction |
|---|---|---|---|---|
| L9 | 63/68 | 62/68 | **−1** | +3-6 ❌ |
| L10 | 54/63 | 56/63 | **+2** | partial ✓ |
| L11 (AGI) | 2/12 | 1/12 | −1 | N/A (AGI fix parked) |
| L1-L8 | 24/32 | 22/32 | **−2** | 0 expected ❌ |
| **Total** | **143/175** | **141/175** | **−2** | **+3-6 ❌** |

### Verdict

**h-001 is FALSIFIED on this single run.** The pre-registered prediction (+3-6 on L9/L10) is not supported. Observed delta is −2 overall.

Caveats (both real):
1. **This is a single run.** The 175-gate SEM was never measured (R1.2 known gap, open since the start). The 35-subset SD of 2.70 was on a cherry-picked high-variance subset and is an over-estimate, but the full-gate SD is unknown. −2 is plausibly within noise.
2. **L10 moved as predicted (+2).** The schema-conflict fix is mechanistically real for the questions that had the conflict. It just didn't generalize to a stratum-level gain, and there's an unexpected −2 on L1-L8 (which the prompt fix shouldn't have touched — worth investigating for prompt-construction side-effects).

The cheaper-rung A/B (17 questions, 12/17→14/17, schema class 4/7→7/7) that greenlit this run was underpowered — a 2-question swing on 17 questions is within the 29% per-question flip rate documented in the skill.

---

## What's recorded where

| Artifact | Path | Status |
|---|---|---|
| This handoff | `SESSION-HANDOFF-2026-07-19.md` | committed (this session) |
| Conductor ledger (R0-R5 + finding) | `RESEARCH-RUN.md` | committed (this session) |
| Guard store events (hash-chained) | `.lenny/research/variant-b-gate-2026-07-18/events.jsonl` | committed (this session) |
| Guard store artifacts | `.lenny/research/variant-b-gate-2026-07-18/artifacts/{r4-deploy,r5-result,sha256}/` | committed (this session) |
| Binary reward fix (uncommitted before) | `scripts/_grader_worker.ts` (line ~35: `score: result.score`) | committed (this session) |
| Deployment script | `scripts/run_variant_b_gate.sh` | already on HEAD `0d156b3` |
| Variant B prompts | `prompts-300q-variantB.json` | already on HEAD `0d156b3` |
| Gate IDs | `results/grpo-preconditions/gate-eval-ids.txt` (175) | already on HEAD `0d156b3` |
| Prior handoff (staged the deploy) | `SESSION-HANDOFF-2026-07-18.md` | untracked — committed this session |
| Project retrospective | `Internal_docs/AI-RESEARCH-RETROSPECTIVE.md` | untracked — committed this session |
| Conductor ground-truth | `Internal_docs/POST-TRAINING-CONDUCTOR-GROUND-TRUTH.md` | untracked — committed this session |
| Deployment decision amendment | `Internal_docs/aix_training_deployment_decision_AMENDMENT_v1.md` | untracked — committed this session |
| AGI fuzzy grader (experimental) | `scripts/grade-agi-fuzzy.ts` | untracked — committed this session |
| Score scratch script | `scripts/grade_scores_tmp.ts` | untracked — committed this session |

### What is NOT on disk locally (still on the RunPod volume)

The full per-question variant B outputs are on the network volume at `/workspace/results/variant-b-gate/`:
- `results.jsonl` (175 raw responses)
- `outputs.json` (id → raw map)
- `grade-output.txt` (full grader stdout)
- `DONE` flag

**The pod is EXITED but the volume persists.** These files survive until another pod overwrites them. To fetch: resume pod `crpo2po5lv18m3` (or deploy a fresh one with the same volume), curl the files down via the HTTP proxy at `https://<podId>-8000.proxy.runpod.net/results/variant-b-gate/`, then stop the pod. ~$1 for a quick up/down. Worth doing for per-question reasoning reads (especially for the L1-L8 regression investigation).

---

## Three founder decisions (the open queue)

### Decision 1 — Adopt 143/175 (base) as the canonical baseline? [URGENT]

The handoff, RESEARCH-RUN.md, and the bayesian skill all say "baseline 131/175." That's SFT v2, which we rejected. Every prior "within noise of 131/175" claim was comparing against SFT, not base.

**Recommendation:** YES, adopt 143/175 (base, variant A, de22a08 grader, 175 gate IDs) as canonical. Update the bayesian skill + any future handoffs to reflect this.

### Decision 2 — Variant B: accept falsification, replicate, or investigate the regression?

A −2 single-run delta is plausibly within noise. Three options:

- **(a) Accept falsification.** Variant B does not help at 175-gate scale. Revert to variant A. $0.
- **(b) Replicate (the pre-registered design we skipped).** Run variant A AND variant B each n=5 on the 175-gate, same seeds, same serving config. ~$20-30. This is the only way to separate signal from noise — and it's the variance floor we should have measured before any intervention test (council BLOCKER 1, R1.2).
- **(c) Investigate the L1-L8 regression first ($0), THEN decide.** Variant B should not have touched L1-L8 (those aren't L9+ schema-conflict questions). A −2 there suggests either (i) prompt-construction side-effects in variant B beyond the documented fix, or (ii) noise. Read the reasoning on the 2 regressed L1-L8 items before spending more.

**Recommendation:** (c) first, then (b) if (c) doesn't explain it. The variance floor measurement (b) is overdue regardless of variant B's fate.

### Decision 3 — Budget

Balance: **$10.81** (operator added ~$9.50 mid-run; session started at $7.41).
- Option (c) investigation: $0 locally, or ~$1 to pull raw outputs off the volume.
- Option (b) replicate: ~$20-30. Affordable within current balance if we skip the AGI A/B.

The AGI intent-label A/B (~$1) remains parked on the Q4 benchmark-legitimacy decision (unchanged from prior handoff).

---

## Immediate next actions for Codex (if taking over)

1. **Read this file.** Then `RESEARCH-RUN.md` (the R4/R5 section at the bottom is this session's work). Then `~/.agents/skills/bayesian-post-training/SKILL.md`.
2. **Use the authoritative conductor:** `~/.claude/skills/research-conductor/SKILL.md` (608 lines). The conductor-kit copy is stale.
3. **Confirm pod state:** `crpo2po5lv18m3` should be EXITED. Verify with the RunPod API before any new pod work. One-pod rule still applies.
4. **If pulling raw outputs:** resume `crpo2po5lv18m3` (don't deploy new), curl the files down, stop it again. If resume fails, tell the operator before deploying anything new.
5. **Do not re-deploy variant B.** It's been tested. The question is now interpretation, not execution.
6. **The guard store is the source of truth for paid/promotion receipts.** `.lenny/research/variant-b-gate-2026-07-18/events.jsonl` is hash-chained and append-only. Do not edit historical entries.

---

## Key files quick reference

| File | Purpose |
|---|---|
| `SESSION-HANDOFF-2026-07-19.md` | **THIS FILE — start here** |
| `SESSION-HANDOFF-2026-07-18.md` | Prior handoff (staged the deploy this session ran) |
| `RESEARCH-RUN.md` | Conductor ledger, R0-R5 + finding |
| `scripts/run_variant_b_gate.sh` | The deployment script that ran |
| `prompts-300q-variantB.json` | Variant B prompts (L9+ without ExecuteOneResponse) |
| `results/grpo-preconditions/gate-eval-ids.txt` | The 175 gate question IDs |
| `scripts/grade-300q.ts` | The grader (freeze point: `de22a08`) |
| `scripts/_grader_worker.ts` | Grader subprocess (binary reward bug FIXED) |
| `results/community/300/run300-base-thinkon-2026-06-29/results.jsonl` | **Correct baseline source (base model, variant A)** |
| `results/community/300/run300-sft-thinkon-2026-06-29/results.jsonl` | SFT v2 (the mislabeled "131/175") |
| `.lenny/research/variant-b-gate-2026-07-18/` | Guard store (hash-chained receipts) |
| `~/.agents/skills/bayesian-post-training/SKILL.md` | Living project knowledge base |
| `~/.claude/skills/research-conductor/SKILL.md` | Lenny Researcher (authoritative conductor) |
| `Internal_docs/AI-RESEARCH-RETROSPECTIVE.md` | Full project retrospective |
| `Internal_docs/POST-TRAINING-CONDUCTOR-GROUND-TRUTH.md` | Ground-truth workflow extraction |

---

## Gist URLs (deployment scripts)

| Script | Gist URL |
|---|---|
| Variant B 175-gate eval (this run) | https://gist.github.com/b-mbm/b87de12124a7ab8ce85ec44bacd54fad |
| Prompt A/B test (17 questions, prior) | https://gist.github.com/b-mbm/ebbd3d4828901d4f7abc4754796e53ea |

---

## RunPod operational notes (unchanged from prior handoff)

- **API vs dashboard:** RunPod API (`podFindAndDeployOnDemand`) still returns SUPPLY_CONSTRAINT. Dashboard works. Always have the operator deploy from `https://www.runpod.io/console/deploy`.
- **Network volume:** `qqz94ksxmn` (named "tradebench"), 200GB, US-MO-1. Model at `/workspace/models/qwen3.6-27b`. Only usable with US-MO-1 GPUs.
- **RunPod key:** `~/.runpod_key`
- **Balance query:** `curl -s "https://api.runpod.io/graphql?api_key=$(cat ~/.runpod_key)" -H "Content-Type: application/json" -d '{"query":"{myself{clientBalance}}"}'` (MUST include Content-Type header or you get a CSRF error)
- **One-pod rule:** ONE pod per session. Never deploy while one lives. `podStop` → verify EXITED → resume or deploy new.
- **Log access pattern:** HTTP file server on port 8000 (the proxied port) serving `/workspace/`. SGLang on port 30000 (internal only). This is how we monitored the run without SSH.

---

*Session ended with variant B falsified on single run, baseline confound surfaced and documented, all receipts hash-chained in the guard store, pod stopped and verified EXITED, balance $10.81. Three founder decisions open.*

---

## Codex takeover addendum (2026-07-19)

The three founder decisions above are now closed:

1. Adopt **143/175 as a canonical historical reference, not a statistical baseline**.
2. Complete the item-level analysis, then close Variant B as **benchmark-level improvement not supported at n=1**. Do not replicate.
3. Spend **$0 on inference**. The evidence was recovered through RunPod S3 for $0; no pod was resumed.

The earlier paired-replication estimate of $20-30 was incorrect. At the observed 123 minutes and $2.99/hour, n=5 per arm means 10 runs and approximately **$61**, or approximately **$92 available** under the 1.5x reserve rule.

The item analysis is recorded in:

- `Internal_docs/VARIANT-B-ITEM-LEVEL-ANALYSIS-2026-07-19.md`
- `Internal_docs/variant-b-item-diff-2026-07-19.json`
- `scripts/analyze-variant-b-item-diff.ts`
- `Internal_docs/GLM-5.2-VARIANT-B-INDEPENDENT-REVIEW-2026-07-19.md`

Final interpretation: the schema-conflict mechanism is confirmed in the observed sample (four base L9/L10 field-name failures reduced to zero), but the preregistered benchmark-level gain is not supported. The raw -2 is not a defensible causal degradation claim because the comparison was unseeded and the flips include grader defects, ambiguous items, numeric-scale mistakes, and unrelated answer variance.

Independent GLM 5.2 verdict: **PASS WITH NON-BLOCKING CORRECTIONS**. Its three requested corrections were applied: L4-004 field-location wording, L10-014 emitted-unit wording, and source hashes for the grader, rubric loader, question source, and all gate rubrics.
