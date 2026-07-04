# Phase 0 Preconditions Loop — GRPO Readiness (steps 1–4, no GPU)

**Status:** finalized loop, ready to paste.
**Purpose:** clear the four no-GPU GRPO preconditions the post-training council flagged as blockers
(commit `25dba8a`, `Internal_docs/council-consensus-grpo-preconditions-2026-07-02.md`).
**Design:** mechanical steps get automated verification gates; the ONE consequential decision
(grader-freeze strategy, step 2) gets a full 4-seat council convening. Operator can lay back;
the loop self-terminates and leaves durable evidence on a feature branch.

---

## THE LOOP (paste this)

```
You are clearing the four no-GPU GRPO preconditions for the AIX Qwen3.6-27B trading model,
as mandated by the post-training council (Internal_docs/council-consensus-grpo-preconditions-2026-07-02.md).
Work autonomously through steps 1→4. The ONLY step that needs a human-oracle decision is Step 2
(the grader-freeze strategy) — convene the full post-training council there via the Skill tool
(skill name: post-training-council). Every other step is mechanical: do it, prove it with a
re-runnable artifact, commit, move on. Operator is laying back; surface only at a genuine blocker
or the Step 2 decision.

═══════════════════════════════════════════════════════════════════════
CONTEXT (read first, do not guess)
═══════════════════════════════════════════════════════════════════════
- Repo: /Users/bradleymiles/Documents/tradebench-questions-and-evaluation (branch codex-work).
- The grader: src/grading/schema-grader-300q.ts (gradeSchemaResponse). NEVER port to Python.
- Rubrics (the ground truth for what's graded): src/rubrics/*.json. AGI rubrics live the
  _agi_canonical.validation block. VERIFIED FACTS (commit 25dba8a, checked directly):
    * 110/110 AGI rubrics validate chosen_strategy by exact normalized string match (46 distinct values).
    * 109/110 validate intent by exact string match (31 distinct values).
    * normalizeCategorical() = case/punctuation/whitespace only; NO synonym/Levenshtein tolerance.
    * Only 11/110 AGI questions disclose the expected label in a "Choose the strategy from: [...]"
      candidate list (AGI-004/006/008/010/015/042/048/049/050/100/104). 99/110 are HIDDEN ORACLES.
    * There is NO selected_route field anywhere (0 rubrics). Do not trust any agent that claims otherwise
      — re-verify against src/rubrics/agi-*.json if it comes up.
    * Non-AGI questions (190) use fuzzyScore (Levenshtein + synonyms) = genuinely verifiable.
- Prompts: prompts-300q.json (id → {system, user}).
- The 39 latent / 14 deficit probe split (from results/community/300/capability-probe-2026-07-02/graded-probe.json):
    * 39 latent: AGI-024, AGI-026, AGI-085, AGI-108, L10-006, L10-015, L10-017, L10-022, L10-024,
      L10-043, L10-046, L10-047, L10-050, L10-055, L10-056, L3-001, L3-002, L3-003, L4-001, L5-003,
      L6-001, L6-003, L7-003, L8-001, L9-005, L9-006, L9-007, L9-013, L9-024, L9-027, L9-029,
      L9-031, L9-037, L9-040, L9-051, L9-053, L9-055, L9-059, L9-064.
    * 14 deficit: L10-004, L10-011, L10-014, L10-025, L2-004, L4-003, L4-005, L5-001, L5-002,
      L7-001, L7-002, L9-019, L9-035, L9-045.
  Finn's rule: the 4 AGI latent (AGI-024/026/085/108) are EXCLUDED from GRPO training because the
  reward fires on the hidden label string, not the decision. So the GRPO training pool = the 35
  non-AGI latent.

═══════════════════════════════════════════════════════════════════════
DISCIPLINE (the lessons that make this hold up)
═══════════════════════════════════════════════════════════════════════
- VERIFY BEFORE CLAIM. Check exit codes, not log strings. AUTHOR GREEN ≠ CONFIRMATION. Leave
  re-runnable evidence (command + output committed), not assertions.
- PROVE EACH GATE CAN FAIL before trusting a green. Feed a deliberately-bad input; confirm RED.
- KARPATHY: smallest code that works. Resumable: per-step result files; commit after each green step;
  on restart read state and resume at the first incomplete step.
- NO paid/LLM/external API calls. NO GPU pods. NO RunPod starts. This is all local/offline work.
- Work on a feature branch (branch from codex-work). Commit after each step. Do not merge.
- If any agent disputes a ground-truth fact, RE-VERIFY against the primary source (src/rubrics/*.json)
  before proceeding. The council's blind-spot hunt already caught one agent inventing a field.

═══════════════════════════════════════════════════════════════════════
STEP 1 — RUN THE GRADER MUTATION-TEST (mechanical; verification gate)
═══════════════════════════════════════════════════════════════════════
Goal: confirm the grader REJECTS wrong answers (not just accepts right ones). Harness exists but has
never been run.
1. Read scripts/mutation-test-stockbench.ts. VERIFY what grader/rubric set it targets — the filename
   says "stockbench". If it targets a DIFFERENT benchmark than the 300Q grader, adapt it (or write a
   300Q-targeted variant scripts/mutation-test-300q.ts) using the SAME mutation logic (wrong
   strategy/instrument, +1,000,007 on critical numerics, missing critical field, route/decision flip,
   self-contradiction). Note: lines 66-69 of the existing harness EXCLUDE chosen_strategy/chosen_route
   from testing with a comment — for the 300Q variant, ALSO add a mutation that tests whether the grader
   correctly scores a semantically-equivalent-but-differently-named chosen_strategy (this probes the
   hidden-oracle issue directly).
2. Run it. Capture full output. Gate: canonical answers PASS (300/300 or near), mutants REJECTED.
3. Prove-it-can-fail: temporarily flip one mutant to the canonical answer and confirm the gate goes
   from RED to GREEN (proves the harness isn't trivially passing).
4. Output: results/mutation-test-300q/ (output.json, summary, any failures). Commit.
5. Verification gate (not a full council — this is mechanical): re-read the output. If ANY canonical
   answer FAILS or ANY mutant PASSES, that is a genuine blocker — STOP and report (do not proceed to
   Step 2). The grader is broken and GRPO is impossible on it until fixed.

═══════════════════════════════════════════════════════════════════════
STEP 2 — GRADER-FREEZE STRATEGY (THE consequential decision — convene full council)
═══════════════════════════════════════════════════════════════════════
This is the one hard-to-reverse call: changing the grader invalidates the 161/300 baseline (Liang's
HELM comparability rule). Two paths, mutually exclusive — do NOT drift between them:
  (a) FIX THEN RE-BASELINE: disclose the label candidate list in all 110 AGI prompts AND add
      synonym/Levenshtein tolerance to scoreAgiValidation for the AGI label fields (mirror the non-AGI
      fuzzyScore path). Then re-run the full 300Q base eval and RESET the baseline number. Preserves the
      full 300Q signal; costs a re-baseline.
  (b) RESTRICT THE REWARD: leave the grader frozen; restrict the GRPO reward to the verifiable subset
      (190 non-AGI + 11 disclosed AGI = 201). Quarantine the 99 hidden-oracle AGI from the reward only.
      Baseline 161/300 stands. Smaller training signal.
1. Prepare both options as concrete diffs (what files change, how many lines, what breaks).
2. CONVENE THE POST-TRAINING COUNCIL via the Skill tool (skill: post-training-council). Put the
   decision as: "grader-freeze: fix-and-rebaseline (a) vs restrict-to-verifiable-201 (b)?" Feed the
   seats the Step 1 mutation-test result, the verified hidden-oracle facts, and the two diffs. Let the
   seats weigh in from their lanes (Schulman: reward design; Lambert: eval-trust + does re-baselining
   cost comparability to OpenRouter's 164; Finn: which path minimizes reward-hack surface; Liang: HELM
   comparability — BUT re-verify his oracle count against rubrics if he disputes it again).
3. PAUSE for operator decision if the council is split (it may be). Present the tradeoff crisply and
   wait. This is the one place the loop stops for a human.
4. Implement the chosen path. If (a): edit prompts + grader, re-baseline is a Phase-1 GPU task (note it,
   don't run it now). If (b): produce the verifiable-subset manifest (201 question IDs) as a file.
5. Commit with the decision rationale + council output attached.

═══════════════════════════════════════════════════════════════════════
STEP 3 — BUILD THE HELD-OUT SPLIT (mechanical; verification gate)
═══════════════════════════════════════════════════════════════════════
Goal: an item-disjoint generalization probe so a GRPO delta can be tested for memorization (Finn/MAML).
1. Start from the 35 non-AGI latent (the GRPO training pool; AGI latent already excluded).
2. Carve 8 as held-out, STRATIFIED to span tiers and latent strength:
   - 1-2 high-latent (≥10/16 pass at temp 0.7), 3-4 mid-latent (5-9/16), 3-4 low-latent (1-4/16).
   - Span the L-tiers present (L3, L4, L5, L6, L7, L8, L9, L10).
   Use the per-question pass counts from graded-probe.json to stratify. Train pool = the other 27.
3. Run the contamination gate against the held-out 8 (the existing skeleton/Jaccard/5-gram machinery
   lives in the sibling repo ~/Documents/tradebench-lite-tests/gates/maskedsim.py; call it or re-implement
   locally). Confirm the 8 are item-disjoint from any training data. (They're eval questions by
   definition, so this is about confirming no SFT-data bleed.)
4. Output: grpo-holdout-split.json ({train_ids: [...27], holdout_ids: [...8], stratification: {...},
   per_question_pass_counts: {...}}). Commit.
5. Verification gate: confirm holdout ∩ train = ∅, confirm stratification spans tiers/latent-bands.
   Re-read the file. If the split is degenerate (e.g., all 8 from one tier, or all high-latent), redo it.

═══════════════════════════════════════════════════════════════════════
STEP 4 — WIRE KL-FROM-REFERENCE + REWARD-HACK MONITORING MODULE (mechanical; code review gate)
═══════════════════════════════════════════════════════════════════════
Goal: the monitoring the GRPO script will import. The GRPO training script doesn't exist yet, so write
the monitoring as a standalone, importable module the future GRPO loop will call.
1. Write scripts/grpo_monitoring.py with two instruments (Schulman's gates):
   (a) KL-from-reference logger: a function that, given current + reference policy logits (or log-probs
       of sampled tokens), computes KL(π_current || π_reference) per step and appends {step, kl,
       per_prompt_kl} to results/grpo-runs/<run>/kl_log.jsonl. Healthy = single-digit nats, slow growth;
       flag a warning if KL > 10 nats or jumps >3 nats in one step.
   (b) Reward-hack argmax dump: a function that, given a group's rollouts+rewards, saves the
       highest-reward rollout per group every N steps (default 30) to
       results/grpo-runs/<run>/argmax_dump/step_<N>.jsonl with {prompt_id, reward, rollout_text,
       field_scores, finish_reason}. This is what a human reads to check reasoning-vs-label-farming.
   Add Finn's monitors too: (c) label-string entropy across rollouts (collapse = hacking tell),
   (d) length of rewarded vs non-rewarded rollouts (length-hacking tell).
2. Include a self-test (prove-it-can-fail): feed synthetic logits/rollouts that should trigger each
   warning, confirm it fires. Run it.
3. Output: scripts/grpo_monitoring.py + a one-paragraph integration note (how the future GRPO loop calls
   these functions, at what cadence). Commit.
4. Verification gate: read the code. Confirm the KL formula is correct (Σ p log(p/q), forward KL
   current||reference), confirm the argmax dump captures enough to eyeball reasoning quality, confirm
   the self-test passes.

═══════════════════════════════════════════════════════════════════════
TERMINATE + HANDOFF
═══════════════════════════════════════════════════════════════════════
Loop terminates when all four steps are green and committed on the feature branch. Final deliverable:
a Phase-0-REPORT.md recording each step with the command run, exit code/output, the red-then-green
proof, the Step 2 council decision + rationale, and any genuine blocker (STOP+log, never fabricate).
Leave everything on the feature branch for operator review; author self-review counts for zero.
If Step 1 reveals a broken grader (canonical fails or mutant passes), that is a hard STOP — report it;
do not paper over it to reach Step 2.
```
