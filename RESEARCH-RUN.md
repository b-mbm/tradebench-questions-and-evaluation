# RESEARCH-RUN.md — Conductor Ledger

**Run ID:** rr-2026-07-15-001
**Started:** 2026-07-15
**Scope:** R0 through R2 ONLY. HARD STOP before R3 provisioning.
**Balance at start:** $9.00 (clientBalance)
**Living project doc:** `~/.agents/skills/bayesian-post-training/SKILL.md`

---

## R0: Session start (mechanical)

### R0.1: Ledger created
Decision: created RESEARCH-RUN.md · why: context WILL compact, ledger is the resume point · reverse: delete file

### R0.2: Zombie reap (ownership-scoped, fail-closed)
Command: `curl -s "https://api.runpod.io/graphql?api_key=$KEY" -d '{"query":"{myself{pods{id name desiredStatus}}}"}'`
Result: 70 pods total, 0 RUNNING, 70 EXITED. Zero zombies.
Decision: no pods to reap · why: zero RUNNING · reverse: N/A
Unattributable instances: none

### R0.3: Balance
Command: `curl -s "https://api.runpod.io/graphql?api_key=$KEY" -d '{"query":"{myself{clientBalance}}"}'`
Result: **$9.00** (clientBalance, verified correct field)
Budget ceiling: **ask-founder** (balance insufficient for full R3-R6 sequence; ~$25-30 needed per council estimate)

### R0 GATE: ✅ PASS
- Ledger read: ✅ (first session)
- Zero EXPIRED run-owned instances: ✅ (zero RUNNING)
- Unattributable instances: none
- Balance recorded: $9.00

---

## R1: Eval trust (receipts, not attestations)

### R1.1: Reward-distribution audit

**Command:** Grade 15 real model responses through the FIXED `grpo_reward.py` GraderSubprocess path + 2 known fixtures.
**Output:** Scores: [1.0, 1.0, 1.0, 1.0, 0.589, 0.760, 0.692, 0.0, 0.541, 0.657, 0.0, 0.0, 0.0, 0.865, 0.0]
**Decision:** Partial credit IS flowing (6/15 partial scores, 40% partial-credit ratio). Binary bug from GT-1 is CONFIRMED FIXED. ✅

### R1.2: Variance floor

**Known data:** 5 runs on 35-question flipper subset at temp 0.1: scores 12, 10, 11, 9, 16. SD=2.70, SEM=1.21.
**Known gap:** Full 175-gate variance NEVER measured. Single baseline: 134/175. Estimated floor (subset-scaled): ±5.6.
**Council note:** The ±5.6 is an OVER-ESTIMATE because the subset was cherry-picked for high variance. Always-pass and always-fail questions have zero variance. The real floor is likely lower.
**Decision:** Record as known gap. Plan measurement: ~$10 for 5 runs on 175-gate. Needs founder greenlight. Goes in R3 preflight draft. R6 acceptance REQUIRES floor measured on exact frozen gate set. ✅ (as planning value)

### R1.3: Read the reasoning on failures (3+ verbatim quotes)

**10 failing items examined, classified.** Verbatim quotes:

1. **L4-004 [prompt_conflict] score=0.00:** *"The system prompt requires me to return ONLY JSON matching `ExecuteOneRes[ponse]`..."* — model explicitly identifies the system/user prompt conflict.
2. **L5-002 [prompt_conflict] score=0.00:** *"However, the prompt asks for an execution response matching `ExecuteOneResponse`. I need to map this to the closest possible execution intent."* — model contorts DeFi operation into trading-order schema.
3. **L9-006 [grader_fieldname] score=0.00:** *"The system prompt defines a strict interface `ExecuteOneResponse` which includes fields like `intent`, `order_type`, `asset`, `size`, `venue`, `risk_controls`, etc."* — model follows system prompt's broader schema instead of per-question 3-field schema.
4. **L7-001 [grader_l7_asset] score=0.00:** *"I need to return a JSON object matching the `ExecuteOneResponse` interface."* — model correctly identifies arbitrage but uses USDC instead of "multi".
5. **L7-003 [capability_math] score=0.00:** Reasoning shows correct LP formula setup but arithmetic error in IL calculation. Genuine math error.

**Decision:** Prompt conflict is CONFIRMED as a failure cause (model reasoning explicitly identifies it). Variant B addresses this. ✅

### R1.4: Failure clustering (post-variant-B context)

| Category | Count | Notes |
|---|---|---|
| agi_label_intent | 88 | Exact-match on undisclosed AGI intent labels |
| prompt_conflict | 20 | System prompt ExecuteOneResponse vs per-question schema |
| agi_label_strategy | 1 | Exact-match on chosen_strategy |
| capability_wrong_answer | 12 | Genuine math/reasoning errors |
| grader_fieldname | 10 | Field name mismatch |
| partial_near_miss | 8 | Score 0.01-0.69, close to passing |
| grader_l7_asset | 1 | L7-001 asset="multi" strictness (FIXED) |
| capability_size | 1 | L7-002 wrong size |
| capability_math | 1 | L7-003 inconsistent LP returns |

**Total failures: 142/300.** The two largest categories (88 AGI intent + 20 prompt conflict = 108) are both addressable by the coded $0 fixes. ✅

### R1.5: Grader parity

**Finding:** `python_grader.py` exists but is DEPRECATED. Known calibration mismatch: scored 1/22 vs TS grader 7/22. Not used in any current pipeline.
**Decision:** Single-grader system (TS grader only). No parity check needed. ✅

### R1.6: Contamination gate (draft thresholds)

**Behavioral probe:**
- Held-out: 8 questions from holdout split
- Threshold: base-model pass rate >90% on held-out → memorization → STOP
- Capability probe data exists: 39/53 latent, 14/53 knowledge-deficit

**String-level probe:**
- For THIS hypothesis (prompt + grader changes): no training data, N/A
- For future training: 8-gram overlap check required

**Decision:** Draft thresholds recorded. Behavioral probe executable from existing gate-run data. ✅

### R1.7: Data-trust audit (R1-D)

**Finding:** This hypothesis introduces NO training data. Both fixes are prompt/grader code changes.
- No label-correctness sample needed
- No construction-bias check
- No spurious-correlate stats
**Decision:** R1-D N/A for this hypothesis. For future training: failure-only construction bias is a documented trap (SFT plateaued 4×). ✅

### R1.8: Rubric stability

**Finding:** AGI rubrics use exact string match (binary 0 or 1). Perturbing output by one character flips the score. BRITTLE by design.
- Intent label disclosure (31 labels in prompt) should make intent STABLE (model emits from the list)
- Chosen_strategy labels are NOT disclosed — still brittle
**Decision:** Rubric version frozen at commit de22a08. Intent labels should be stable post-disclosure. Strategy labels remain brittle. ✅

### R1 GATE: ✅ PASS (all 8 items with receipts)
- Reward audit: ✅ (6/15 partials flowing)
- Variance floor: ✅ (recorded as known gap, plan drafted)
- Read reasoning: ✅ (3+ verbatim quotes, 10 items classified)
- Failure clustering: ✅ (142 failures across 9 categories)
- Grader parity: ✅ (single-grader, deprecated python grader noted)
- Contamination: ✅ (draft thresholds, behavioral probe executable)
- Data-trust: ✅ (N/A for prompt/grader changes)
- Rubric stability: ✅ (exact-match brittleness noted, intent labels improve)

---

## R2: Contract + hypothesis

### Council review (Mode A roundtable)

**Convened:** post-training-council, all four seats. Notes folded below.

**Council blockers identified (3):**

1. **BLOCKER 1 (unanimous): Stale baseline.** The 134/175 baseline was scored under a different grader (pre-de22a08). The frozen evaluator includes L7-001 grader relaxation + binary reward fix. Any delta is confounded unless baseline is re-scored under de22a08. **Cost to fix: ~$0** (re-grade existing outputs if retained, or one re-run).

2. **BLOCKER 2 (Finn): Asymmetric cheaper-rung.** The A/B test (17 questions, $2) validated variant B ONLY. The AGI intent-label fix has ZERO small-scale validation. The 17-question A/B contained ZERO AGI questions. **Cost to fix: ~$1** (12-question AGI-only A/B).

3. **BLOCKER 3 (reconciled): 88/142 figure.** Council could not find provenance. **VERIFIED from graded JSON:** 88 of 142 total failures include `agi_validation_failed:intent`. This is correct — the council was looking in commit messages, not in the actual graded output. **Resolved.** ✅

**Council consensus (folded):**
- Test fixes SEPARATELY, not as bundle (3/4 seats: Lambert, Finn, Liang)
- Report per-stratum (L9 / L10 / AGI / other), not single aggregate (unanimous)
- Re-score baseline under de22a08 grader (unanimous, BLOCKER)
- Run AGI-only A/B before full hypothesis test (Finn, BLOCKER)
- Budget: ~$25-30 needed, $9 insufficient → founder greenlight required
- Variance floor measurement can run concurrently with intervention test (Schulman vs Lambert split resolved)

### Capability Contract (FROZEN DRAFT — pending founder review)

```
# Capability Contract: tb-prompt-grader-fixes
Frozen at R2 as DRAFT (founder review required before R3)

## Objective
- capability: TradeBench 300Q gate score improvement via prompt + grader fixes
- metric + threshold: per-stratum paired-seed delta, per statistical design below
- regression floors: no stratum regresses by more than its SEM

## Frozen
- evaluator version: TS grader at commit de22a08
  (includes: L7-001 asset relaxation, binary-reward fix)
  WARNING: baseline 134/175 was scored pre-de22a08 — MUST re-score
- prompt version: de22a08 (variant B for L9+, AGI intent labels for L11)
- gate set: results/grpo-preconditions/gate-eval-ids.txt (175 questions)
- held-out: 8 questions from grpo-holdout-split.json
- pass threshold: normalized score >= 0.7
- budget ceiling: ask-founder placeholder (~$25-30 estimated)
- stop conditions: budget exhausted / 2 consecutive rejects / evaluator invalidated

## Statistical design (pre-registered)
- design: PAIRED SEEDS n=5
  per-seed deltas d_i; accept iff mean(d) > 2.78 x SD(d)/sqrt(5)
  (t=2.776, df=4, two-sided alpha=0.05)
- variance floor: NOT MEASURED on 175-gate
  subset-scaled estimate: ±5.6 (OVER-ESTIMATE per council)
  PLANNED: 5 runs on exact 175-gate, ~$10
- exploratory looks: allowed at n=2, labeled exploratory, kill-only

## Pre-registered controls
- reward-exploit checklist: exact-match brittleness, length, format echo, label-mimicry
- null-reward-control trigger: N/A for prompt/grader changes (no training)
- contamination STOP thresholds:
  behavioral: base-model pass rate >90% on held-out → STOP
  string-level: N/A (no training data for this hypothesis)
- named regression slice: 200 questions from the 202 verifiable subset
- minimum eval schedule: 2 of 3 checkpoints (if training); N/A for prompt test

## Two-stage calibration fields
- R5 telemetry abort thresholds: N/A (no training run)
- minimum generalization delta: placeholder, set from AGI A/B result

## Mutable surfaces
- prompt variant (A vs B) / AGI label disclosure (on/off)

## Baseline
- 134/175 (2026-07-03, pre-de22a08 grader, single run)
- MUST be re-scored under de22a08 before any delta is computed
```

### Hypothesis: h-001 (parent: baseline)

```
# Hypothesis: h-001
- claim: Applying variant B prompt + AGI intent-label disclosure (tested SEPARATELY)
  raises the 175-gate score on L9/L10 and AGI strata respectively.
- mechanism:
  (1) Variant B removes the system/user prompt schema conflict for L9+.
      The model stops emitting ExecuteOneResponse fields and starts emitting
      expected_value consistently. (A/B showed: schema 4/7→7/7, holdout 2/4→3/4)
  (2) AGI intent labels let the model CLASSIFY rather than GUESS.
      88/142 failures include intent exact-match failure. Disclosing 31 labels
      should convert classification failures to correct labels.
- predicted effect:
  Variant B: +3-6 questions on L9/L10 stratum of the 175-gate
  AGI labels: +3-8 questions on AGI stratum of the 175-gate
  (per-stratum, NOT aggregate)
- falsifier:
  Variant B: no per-stratum improvement on L9/L10 after re-baselining
  AGI labels: no improvement on 12 AGI gate questions in the AGI A/B
- memory check:
  SFT plateaued 4x (rejected) — not redundant, this is not training
  GRPO shelved (council 2026-07-09) — not redundant, this is not RL
  Variant B has cheaper-rung artifact: A/B test 12/17→14/17 ✅
  AGI labels: NO cheaper-rung artifact — BLOCKER (council)
- simpler alternative rejected because:
  These ARE the simpler alternatives. They are $0 prompt/grader changes
  that precede any training. The ladder is: prompt fix ($0) → grader fix ($0)
  → eval ($5) → training ($10-15, if needed, which it isn't per current data).
- risks / confounders:
  (1) Baseline was scored under different grader — MUST re-score
  (2) AGI fix untested at any scale — needs 12-question A/B
  (3) Single-sample variance on A/B — L10-017 regression may be noise
  (4) Per-stratum testing doubles eval cost but is required for attribution
- cost estimate: $1 (AGI A/B) + $10 (variance floor) + $10 (paired n=5 per fix) = ~$21
  · duration: ~4 hours total GPU time across all steps
- rollback: revert to variant A prompt (git checkout pre-de22a08 schema-prompts.ts)
```

### R2 GATE: ✅ PASS (with council conditions)
- Contract frozen as DRAFT: ✅ (pending founder review)
- Hypothesis with falsifier: ✅
- Memory queried: ✅ (SFT rejected, GRPO shelved, not redundant)
- Method justified against cheaper alternative: ✅ (this IS the cheaper alternative)
- Council did not block: ✅ (3 blockers identified, all addressable in R3 preflight)

---

## R3 Pre-Flight Checklist (DRAFT — for founder review before greenlight)

```
# R3 Pre-Spend Recital: h-001  (DRAFT — NOT FOR EXECUTION)
- [ ] Local analysis done: ✅ R1 complete (reward audit, failure clustering,
      reasoning reads, 88/142 verified, variance gap documented)
- [ ] Fractional plan: 12-question AGI A/B (~$1) + variance floor (~$10)
      + paired n=5 per fix (~$10). Each gates the next.
- [ ] Balance $9 · this step ~$1 (AGI A/B first) · ceiling ask-founder ·
      Y×1.5 fits: NO — need founder to add ~$20
- [ ] Reward-path probe: N/A (prompt change, no training reward path)
- [ ] One-pod rule: zero conductor-owned RUNNING instances ✅
      (verified R0: 0 RUNNING pods)
- [ ] Framework seams: N/A (no training framework, just eval runner)
- [ ] Disk budget: N/A (no checkpoints, eval only)
- [ ] Wall-clock probe: ~15 min for 17-question A/B pattern (proven 2026-07-11)
- [ ] Teardown command: podStop + podTerminate via API (proven working)
- [ ] Serving-stack response sanity: verified 2026-07-11 A/B test run
      (question-specific fields + think-path present on SGLang)
- [ ] Provenance manifest: to be opened at actual R3 execution
- [ ] Zero unattributable instances: ✅ (R0 verified)
```

### R3 Sequence (proposed, pending founder greenlight)

| Step | What | Cost | Gate |
|---|---|---|---|
| 1 | Re-score baseline 134/175 under de22a08 grader | ~$0 (re-grade existing) | Like-for-like baseline established |
| 2 | 12-question AGI-only A/B (variant A vs B with intent labels) | ~$1 | AGI fix shows improvement OR not |
| 3 | Full 175-gate variance floor (5 runs, temp 0.1) | ~$10 | Real noise floor measured |
| 4 | Paired n=5: variant B vs baseline on 175-gate | ~$5 | Variant B per-stratum delta |
| 5 | Paired n=5: AGI labels vs baseline on 175-gate | ~$5 | AGI labels per-stratum delta |
| **Total** | | **~$21** | |

---

## Founder Queue

**Items requiring founder decision before R3 execution:**

1. **Budget increase: $9 → ~$25.** Council unanimously identified $9 as insufficient to clear the blockers and run the statistical design. Estimated total: ~$21-30.

2. **Re-scoring the baseline under de22a08.** The 134/175 baseline was scored under a pre-de22a08 grader. The current grader includes L7-001 relaxation + binary reward fix. Council (unanimous): baseline MUST be re-scored before any delta claim. This can be done by re-grading existing model outputs (~$0) if the raw outputs are retained on the network volume, or by one re-run (~$5).

3. **Separate vs bundle testing.** Council (3/4) recommends testing variant B and AGI labels separately. This doubles eval cost ($10 → $20) but provides clean attribution. Confirm: separate testing approved?

4. **AGI label disclosure benchmark-legitimacy.** Is disclosing the 31 intent labels in the prompt benchmark-legitimate? If TradeBench's official eval forces its own prompt, the disclosure doesn't help the leaderboard score. If the prompt is ours to control, it's legitimate. This is a rules question only the founder can answer.

5. **RunPod supply.** API deployment is broken (SUPPLY_CONSTRAINT for 5+ hours). Operator can deploy from the dashboard. Confirm: operator available for manual dashboard deployment when needed?

---

## Spend Meter

| Date | Item | Cost | What it bought |
|---|---|---|---|
| 2026-07-11 | Prompt A/B test pod (z6qmhkfgl27y1m) | ~$2.10 | 17-question A/B, variant A vs B |
| 2026-07-15 | R0-R2 conductor run | $0 | All analysis done on existing data |
| **Balance** | | **$9.00** | |

---

## Findings (none yet — R3+ not executed)

---

## R3: Pre-provision (executor resumed after founder greenlight)

Founder greenlit R3 with specific ordering: re-score baseline → AGI prompt-control check → AGI A/B only if Q4 clears → STOP before variance spend. Two corrections applied: Seat 4 is Chen (not Liang); all founder-facing outputs now lead with pre-k.

### R3.1: Re-scored baseline under de22a08 grader (~$0)

**ELI5:** We changed the grading rules since we last scored the model. Before we can say "the model improved," we need to know what score it gets TODAY under the CURRENT grading rules. So we re-graded the exact same model answers using the updated grader.

**ELI2:** Same test, same answers, new answer key. The score changed.

**Plain paragraph:** The baseline score was originally 158/300 (AGI 21/110), graded under a pre-de22a08 version of the grader. The grader has since changed (L7-001 asset relaxation, plus accumulated rubric fixes in commits bff19cb, 8a8a10d, 303e4f8). We re-graded the exact same 300 model responses from the 2026-06-29 run using the current de22a08 grader code.

**Receipt:**
- Command: `npx tsx scripts/grade-300q.ts /tmp/baseline-raw-outputs.json`
- Input: `results/community/300/run300-sft-thinkon-2026-06-29/results.jsonl` (300 responses, unchanged)
- Output:

| Stratum | Old score | New score (de22a08) | Delta |
|---|---|---|---|
| L1-L8 | 24/40 | 24/40 | 0 |
| L9 | 62/81 | 62/81 | 0 |
| L10 | 51/69 | 51/69 | 0 |
| **AGI** | **21/110** | **27/110** | **+6** |
| **Total** | **158/300** | **164/300** | **+6** |

175-gate subset: **131/175** (was 134/175 — the delta is from different AGI questions in the gate vs full set)

**Decision:** New like-for-like baseline is **164/300 (full)** and **131/175 (gate)**. All future deltas compare against these. The +6 on AGI came from accumulated grader/rubric fixes between the old run and de22a08 — not from any model change. This is exactly the confound the council flagged.

### R3.2: AGI prompt-control verification (Q4 — benchmark-integrity gate)

**ELI5:** We added a "cheat sheet" to the model's instructions — a list of 31 possible answer categories for the hardest questions. But is that fair? Are we allowed to change the instructions? It turns out: this repo IS the test itself. There's no separate referee. The test already gives hint lists on some questions. And the "real" way the test was supposed to work (simulating trades to check if the answer is good) was never built — we're still using a simplified "guess the exact word" checker. Giving the word list makes the simplified checker less random, not more unfair.

**ELI2:** We own the test. We can change the instructions. The instructions already had hints on some questions. Adding hints to more questions is consistent.

**Plain paragraph:** The question was whether disclosing 31 AGI intent labels in the prompt is benchmark-legitimate or "teaching to the test." The evidence from the repo:

1. **This repo IS the benchmark.** The questions (`src/questions/schema-questions-300q.ts`), rubrics (`src/rubrics/`), grader (`src/grading/schema-grader-300q.ts`), and prompt builder (`src/prompts/schema-prompts.ts`) are all in this repo. There is no external evaluation server, no leaderboard API, no separate referee. The prompt is entirely ours.

2. **The benchmark already discloses labels on some questions.** 11 AGI questions include "Choose the strategy from: [list of exact labels]" in the prompt. 15 questions disclose intent options. The pattern of disclosing valid labels already exists in the benchmark.

3. **The canonical spec (§4.3) defines a strategy simulator as the oracle** — "ensemble-optimal regret, deterministic replay, NautilusTrader." The current label-matching grader is a PLACEHOLDER that was never replaced with the simulator. Disclosing labels makes the placeholder less arbitrary, not more.

4. **The spec says "minimal scaffolding, no strategy hints"** (§2 Harness Rule). Disclosing intent labels partially violates this. However, the benchmark already violates it on 11+ questions.

5. **The spec says "identical across all models"** (§2). The prompt change applies to the benchmark itself — all models evaluated through this repo get the same labels. This is not special-casing our model.

**Decision (NEEDS FOUNDER):** The AGI intent label disclosure is benchmark-legitimate if you accept this repo as the benchmark and the label matcher as a placeholder for the simulator. It is NOT legitimate if there will be an external leaderboard eval or if you want to compare against external models that didn't get the labels. **Parked pending founder decision — variant B proceeds regardless (it's a pure bug fix, not a hint).**

### R3.3: AGI A/B — HELD pending Q4 founder decision

Not executed. The AGI intent label A/B test (~$1) is blocked on the Q4 benchmark-integrity decision. Variant B (the prompt schema fix) is unblocked — it's a bug fix, not a hint, and already has cheaper-rung evidence (the 17-question A/B from 2026-07-11).

### R1.1 supplement: Known-partial fixture receipts

**ELI5:** We checked that the grading system isn't accidentally rounding every score to pass/fail. We sent it two test answers — one we knew should get partial credit, one we knew should fail completely. The partial one got 0.589 (not 0 or 1). The failing one got 0. The system works correctly.

**Receipt:**
- Fixture 1 (L3-001 real response, known partial): score = **0.589** ✅ (partial credit confirmed)
- Fixture 2 (L10-017 real response, known pass): score = **1.000** ✅ (full pass confirmed)
- Synthetic fixture (L1-001 with wrong size): score = **0.000** — correct (exact size match required for simple questions, not a wrapper bug)

Decision: Wrapper path confirmed NOT binarizing. ✅

---

## Updated Founder Queue (pre-k-first form)

### Item 1: Budget

**ELI5:** We have $9 left. The free work is done. The next steps that cost money are: testing the prompt fix on the full 175-question set (~$5), and measuring how random the scores are by running the same test 5 times (~$10). We need about $20-25 total to do this properly.

**ELI2:** $9 isn't enough for the statistical validation. Need ~$20 more.

**Technical detail:** Steps remaining after R3:
- Variant B full 175-gate paired test (n=5): ~$5
- 175-gate variance floor (5 runs): ~$10
- AGI A/B (if Q4 clears): ~$1
Total needed: ~$16-21. Balance: $9. Shortfall: ~$7-12.

**Founder decision needed:** Add ~$15-20 to RunPod, or proceed with what $9 buys (variant B only, reduced n=3, labeled exploratory).

### Item 2: AGI label legitimacy (Q4)

**ELI5:** Can we give the model a list of possible answer categories for the hardest questions? We own the test — there's no separate referee. The test already gives hints on some questions. But the original design says "no hints." Your call: is this fair, or is it cheating?

**ELI2:** We own the benchmark. Disclosing labels is extending an existing pattern. But it violates the "no hints" design principle. Founder decides.

**Technical detail:** See R3.2 above. The disclosure is benchmark-legitimate if (a) this repo is the benchmark, (b) the label matcher is a placeholder for the simulator, (c) it applies to all models equally. Park the AGI fix if any condition fails. Variant B proceeds regardless.

### Item 3: Separate testing confirmed

**ELI5:** We'll test each fix separately so we know which one actually helped. Approved by you and the council.

**Technical detail:** Per founder greenlight Q3 and council consensus (3/4 seats). Variant B tested first (has cheaper-rung evidence). AGI labels tested only if Q4 clears. Per-stratum reporting (L9 / L10 / AGI / other).

---

## Updated Spend Meter

| Date | Item | Cost | What it bought |
|---|---|---|---|
| 2026-07-11 | Prompt A/B test pod | ~$2.10 | 17-question variant A vs B |
| 2026-07-15 | R0-R2 conductor run | $0 | All analysis on existing data |
| 2026-07-15 | R3.1 re-score baseline | $0 | Re-graded 300 responses under de22a08 |
| 2026-07-15 | R3.2 Q4 prompt-control check | $0 | Benchmark-integrity analysis |
| 2026-07-15 | R1.1 fixture supplement | $0 | Known-partial probe confirmed |
| **Balance** | | **$9.00** | |

---

## Current State Summary

**What we know now (all $0):**
- Baseline under current grader: **164/300 (full), 131/175 (gate)**
- The old baseline (158/300) was scored under a different grader — 6 questions' worth of difference
- Variant B prompt fix has cheaper-rung evidence (A/B: 12/17→14/17, schema 4/7→7/7)
- AGI intent labels: 88/142 failures include intent exact-match failure (verified from graded JSON)
- AGI label disclosure is a benchmark-integrity question pending founder decision
- Full 175-gate variance floor is unmeasured (~$10 needed)
- Budget: $9, need ~$16-21 for remaining validation steps

**What's blocked:**
- AGI A/B test: blocked on Q4 (founder decision)
- Variance floor: blocked on budget
- Variant B full-gate paired test: blocked on budget

**What's NOT blocked:**
- Variant B is validated at the cheaper-rung level and ready for full-gate testing
- The prompt fix is a pure bug fix (schema conflict), not a hint — no legitimacy concern

---

## R4/R5: Variant B 175-gate run EXECUTED (2026-07-19)

### R4 deployment receipt

- **Pod:** `crpo2po5lv18m3` (comparative_peach_woodpecker), H100 SXM 80GB, US-MO-1, $2.99/hr
- **Deployed:** 2026-07-19 03:28:55 UTC (operator dashboard, dockerArgs curl-pipe-bash — API still returns SUPPLY_CONSTRAINT)
- **Script:** Gist `b87de12124a7ab8ce85ec44bacd54fad` → `run_variant_b_gate.sh` (byte-identical to local)
- **Repo cloned at:** HEAD `0d156b3` on `phase0-grpo-preconditions` (verified in pod log)
- **SGLang cold-start:** ready after 35×5s = ~3 min (ninja symlink + cached install worked)
- **Eval:** 175 gate IDs, variant B prompts (`prompts-300q-variantB.json`), temp 0.1, thinking ON, concurrency 4, budget ladder 8000/16000/24000
- **Throughput:** steady ~102 tok/s, 4 concurrent, zero errors
- **Wall clock:** 123 min (03:28 → 05:31 UTC)
- **Cost:** ~$6.00 (balance $7.40 → $11.11 after operator added ~$9.50 mid-run)
- **Guard store:** seq 6 (budget/deploy receipt), seq 7 (phase_live_qa/result receipt), both hash-chained

### R5 result (the graded outcome)

**Per the grader (`de22a08`, frozen) on the 175-gate:**

Variant B: **scoreSum 144.5, passCount 141/175**
- L1 3/3, L2 3/4, L3 0/1, L4 0/4, L5 2/4, L6 3/3, L7 2/4, L8 9/9, L9 62/68, L10 56/63, L11 1/12

Pod stopped + verified EXITED immediately after DONE flag (05:31 UTC), before the 10-min idle sleep — no idle burn.

### R6 mechanical comparability pre-check — FAILED, confound found

**ELI5:** The "old score" we were comparing against (131/175) was the *wrong old score*. It came from a model we already rejected (SFT v2), not the base model. When I re-graded the actual base-model answers on the same 175 questions, the real baseline is 143/175. So variant B's 141 is actually *2 worse*, not 10 better.

**ELI2:** The handoff's "baseline 131/175" was SFT v2 mislabeled as the baseline. The correct base-model baseline is 143/175. Variant B scored 141/175 — a **−2 regression**, not a +10 gain.

**Plain:** Re-grading the three candidate baselines locally ($0, Rule #20) on the exact 175 gate IDs under `de22a08`:

| Model | scoreSum | passCount | Source file |
|---|---|---|---|
| Base (variant A prompt) | 145.5 | **143/175** | `run300-base-thinkon-2026-06-29` |
| SFT v2 (rejected) | 136.3 | 131/175 | `run300-sft-thinkon-2026-06-29` ← **this is the handoff's "131"** |
| Variant B (today) | 144.5 | 141/175 | pod `crpo2po5lv18m3` |

The R3.1 re-score (RESEARCH-RUN line 336) cited the **SFT** file (`run300-sft-thinkon-2026-06-29`) as the baseline and reported 131/175 — but SFT was rejected in the same skill doc ("plateaued 4×, −3 vs base"). The correct comparator for a prompt-only change is the **base** model on variant A prompts. That gives 143/175.

### Per-stratum delta (variant B vs correct base baseline)

| Stratum | Base (variant A) | Variant B | Delta | h-001 prediction |
|---|---|---|---|---|
| L9 | 63/68 | 62/68 | **−1** | +3-6 ❌ |
| L10 | 54/63 | 56/63 | **+2** | (part of +3-6) partial ✓ |
| L11 (AGI) | 2/12 | 1/12 | −1 | N/A (AGI fix parked) |
| L1-L8 | 24/32 | 22/32 | −2 | 0 expected |
| **Total** | **143/175** | **141/175** | **−2** | **+3-6 ❌** |

### Verdict: h-001 FALSIFIED on this single run

The pre-registered prediction (variant B: +3-6 on L9/L10 stratum) is **not supported**. The observed delta is **−2 overall** (L10 +2, L9 −1, L1-L8 −2, AGI −1). L10 moved in the predicted direction and magnitude; L9 did not.

**This is a single run.** The 175-gate SEM was never measured (R1.2 known gap). The 35-subset SD of 2.70 was on a cherry-picked high-variance subset and is an over-estimate for the full gate, but the full-gate SD is unknown. A −2 delta is plausibly within noise. **Call this REJECTED-on-single-run / RECOMMEND-REPLICATE, not ACCEPTED.**

The 17-question A/B (12/17→14/17) that greenlit this run is now revealed as underpowered — a 2-question swing on 17 questions is exactly within the per-question flip rate (29%) documented in the skill.

### What the cheaper-rung A/B actually showed (re-read in this light)

The 17-question A/B (2026-07-11) showed variant B schema class 4/7→7/7 on flipper questions. That is a real mechanistic observation: variant B *does* fix the ExecuteOneResponse contamination for the questions that had it. But "fixes the schema on 7 specific flipper questions" did not generalize to "+3-6 on the L9/L10 stratum of the 175-gate." The mechanism is real; the effect size was over-predicted.

### Updated Founder Queue

**Item 1 (URGENT — confound in our own records):** The handoff, RESEARCH-RUN.md, and the bayesian skill all cite "131/175 baseline." That number is SFT v2, which we rejected. The correct base-model baseline is **143/175**. Every prior "within noise of 131/175" claim (GRPO step-10 131/175, etc.) was being compared to SFT, not base. Do we adopt 143/175 (base) as the canonical baseline going forward?

**Item 2 (the actual decision on variant B):** Variant B is −2 vs base on a single run, with the 175-gate SEM unmeasured. Three options:
- **(a) Accept the falsification.** Variant B does not help at 175-gate scale. The L10 +2 is real but offset by L9 −1 and L1-L8 −2. Revert to variant A. Move on.
- **(b) Replicate before deciding.** Run variant A and variant B each n=5 on the 175-gate (the pre-registered R6 design). Cost ~$20-30. This is the only way to separate signal from noise — and it's the variance floor we should have measured before any intervention test (council BLOCKER, R1.2).
- **(c) Investigate the L1-L8 regression.** Variant B should not have touched L1-L8 (those aren't L9+ schema-conflict questions). A −2 there suggests either (i) prompt-construction side-effects in variant B beyond the documented fix, or (ii) noise. Read the reasoning on the 2 regressed L1-L8 items before deciding.

**Item 3 (budget):** Balance is ~$11.11. Operator added ~$9.50 mid-run. Replication (option b) needs ~$20-30.

### Spend Meter (updated)

| Date | Item | Cost | What it bought |
|---|---|---|---|
| 2026-07-11 | Prompt A/B test pod (z6qmhkfgl27y1m) | ~$2.10 | 17-question variant A vs B |
| 2026-07-15 | R0-R3 conductor run | $0 | All analysis on existing data |
| **2026-07-19** | **Variant B 175-gate (crpo2po5lv18m3)** | **~$6.00** | **141/175 — falsifies h-001 vs base 143/175** |
| **Balance** | | **$11.11** | |

---

*Conductor stopped at R5 with h-001 FALSIFIED on single run (variant B 141 vs base 143, delta −2). Baseline confound surfaced: handoff's 131/175 was SFT v2 (rejected), not base. Founder decision required on (1) canonical baseline, (2) replicate-vs-accept, (3) L1-L8 regression investigation.*

---

## R6 Amendment: item-level interpretation and founder disposition (2026-07-19)

This amendment supersedes the open recommendations above without altering the historical R4/R5 record.

### Founder decisions

1. **143/175 is adopted as the canonical historical base reference, not a statistical baseline.** It is the June 29 base-model output regraded on the exact 175 gate IDs under the same grader. The comparison remains unseeded and has incomplete historical serving provenance.
2. **Variant B is closed without replication.** Verdict: `benchmark-level improvement not supported at n=1`. Do not describe the observed -2 as a causal degradation.
3. **No additional inference spend.** The paired n=5-per-arm design would require 10 runs, approximately $61 at the observed runtime and rate, or approximately $92 under the project's 1.5x reserve rule. The earlier $20-30 estimate was wrong and is not executable from the available balance.
4. **Evidence retrieval was completed for $0 through RunPod S3.** No pod was resumed and no inference was rerun.

### Item-level result

Reproducible artifacts:

- `scripts/analyze-variant-b-item-diff.ts`
- `Internal_docs/variant-b-item-diff-2026-07-19.json`
- `Internal_docs/VARIANT-B-ITEM-LEVEL-ANALYSIS-2026-07-19.md`

The deterministic replay reproduced base 143/175 and Variant B 141/175. There were 12 pass/fail flips: five Variant B-only and seven base-only.

The direct prompt mechanism was confirmed in the observed sample:

- Base L9/L10 `mismatch_fieldname` failures: L10-011, L10-014, L10-046, L10-050.
- Variant B L9/L10 `mismatch_fieldname` failures: none.
- L10-046 and L10-050 became clean passes.
- L10-011 and L10-014 moved from schema failures to numeric-unit failures because their output requirements do not state whether `expected_value` is percent, USD, or asset units.

The aggregate flips are not a clean capability comparison. They include two unchanged-prompt grader defects (L4-002, L4-004), an ambiguous borrow-principal question (L9-021), a contradictory governance question/key (L9-027), two percentage-scale regressions after correct reasoning (L9-042, L10-044), one arithmetic regression plus flawed canonical note (L9-043), two unrelated genuine math/input improvements (L9-031, L10-055), and one unrelated AGI allocation regression (AGI-004).

### Final interpretation

**h-001's benchmark-level prediction remains unsupported.** The narrow schema-conflict mechanism is confirmed, but the intervention did not produce the preregistered +3 to +6 L9/L10 gain and did not improve the frozen-grader total in this exploratory sample. Variant A remains the release prompt while the discovered unit, grader, and item defects move into the CoinBench lock audit.

### Spend meter correction

| Proposed work | Correct observed-cost estimate | Decision |
|---|---:|---|
| Paired Variant A/B, n=5 per arm | ~$61 | Do not run |
| Same design with 1.5x reserve | ~$92 available required | Do not fund |
| Item-level analysis and closure | $0 | Completed |

### Independent GLM 5.2 review

GLM 5.2 completed a read-only independent audit and returned **PASS WITH NON-BLOCKING CORRECTIONS**. It confirmed the 143/141 replay, all four schema-failure removals, the arithmetic, the causal limitations, and the decision not to replicate. It corrected the L4-004 field-location explanation, softened the L10-014 unit wording, and requested grader/rubric source pinning; all three corrections were applied. Receipt: `Internal_docs/GLM-5.2-VARIANT-B-INDEPENDENT-REVIEW-2026-07-19.md`.

### Independent Claude Code review

Claude Code (`opus`, high effort, read-only) returned **APPROVE CLOSURE** with no blocking correction. Its useful addition was that the two flips among 32 byte-identical prompts are already the same magnitude as the aggregate -2, reinforcing that the headline is not a clean causal Variant B effect. Two proposed caveats were rejected after source verification: the replay script does regrade all 175 responses before asserting its totals, and the L9-027 rubric does contain the defective `$243,000` bribe note. Receipt: `Internal_docs/CLAUDE-CODE-VARIANT-B-INDEPENDENT-REVIEW-2026-07-20.md`.

*R6 closed with no RunPod or new benchmark inference spend. The local analysis and independent review gates pass. The worktree is ready for founder review and the subsequent CoinBench-lock worktree transition.*
