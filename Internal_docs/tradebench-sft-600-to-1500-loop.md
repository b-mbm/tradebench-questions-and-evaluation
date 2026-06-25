# AIX SFT 600 → 1500 — Finalized Audit + Expansion `/loop`

**Status:** finalized loop, ready to paste into the `tradebench-lite-tests` Claude Code session.
Created 2026-06-17. A section is reserved at the bottom for Codex's Part-2 (1500-expansion) notes.

## What this loop does (one paragraph)

Takes the canonical 600-example SFT training set (read-only, from pinned commit `5c4e679`),
independently re-derives every answer to catch wrong "gold" labels (the worst defect for a training
set — it poisons the model), checks each example is solvable / schema-valid / trace-consistent /
non-duplicate, and runs a **contamination gate** comparing every example (structure + wording +
answer) against the held-out CoinBench/TradeBench eval so any copy/near-copy/reskin is rejected. It
emits a per-example issue ledger with PASS/REPAIR/DROP, remediates into a **new clean v2** (never
overwriting the original), then **expands to ~1,500** by authoring new *archetypal* examples (same
skills, novel surface), each forced through the contamination gate before admission — leaving a
re-runnable proof of every gate for independent verification.

## Desired end state

A clean ~1,500-example training set where: every answer is independently verified correct (no poison);
every example is provably **item-disjoint** from the eval (skill-aligned, not a copy); schema + traces
consistent; zero internal near-dups; original 600 preserved immutable; a re-runnable command + ledger
proves it all. Mantra: **teach the skill, never the test → skill-aligned, item-disjoint.**

## Is the end state "final"?

The loop produces "self-verified clean" — necessary but NOT final on its own (single-model self-audit
misses things, proven on StockBench). **FINAL = loop-clean + independent Codex + Perplexity passes
agreeing** (+ optionally an empirical check later: a model trained on the set can't recover eval
answers it never saw). Expansion-to-1500 lives inside the loop, gated on the 600 being verifiably
clean + contamination-free first.

## Two decisions — RESOLVED (fresh session: obey these; only revisit if a fact contradicts them)

1. **Contamination target = the CoinBench/TradeBench 300 eval at**
   `/Users/bradleymiles/Documents/tradebench-questions-and-evaluation/src/questions/schema-questions-300q.ts`
   (also treat `schema-questions.ts` as eval). FIRST step of Phase 1: read it + its loader and
   confirm it is the held-out eval; if it's clearly NOT the right eval file, STOP and log — do not
   guess a different one.
2. **Target = a HARD 1,500 total clean examples.** After Phase 2 yields the clean survivor count S
   (≤600), Phase 3 generates exactly `1500 − S` new archetypal examples to reach 1,500. (This is the
   intent behind "2.5×"; do not interpret it as 2.5×S.) Keep the final 1,500 tier-proportional to the
   canonical distribution.

---

## THE LOOP (paste this)

```
/loop
You are hardening the canonical 600-example AIX SFT TRAINING set to a paper-grade standard, then
expanding it — without contaminating the held-out CoinBench/TradeBench eval. This is a TRAINING set:
label correctness is paramount (a wrong gold answer POISONS the model), and the headline gate is
train↔eval contamination ("archetype, not copy"). Do NOT cut corners; a single small model generated
and self-audited this set, so trust nothing — re-derive.

═══════════════════════════════════════════════════════════════════════
SOURCES (read-only; never mutate the canonical)
═══════════════════════════════════════════════════════════════════════
- Canonical 600 (immutable): extract from the PINNED commit, not the working tree —
  `git -C /Users/bradleymiles/Documents/tradebench-lite-tests show 5c4e679c56ec21dab6460d09aed1957f37f16563:training/sft-600q-v1/all.jsonl > audit/canonical-600.jsonl`
  Also read at that commit: training/README.md, training/sft-600q-v1/README.md, full-audit.jsonl.
  Schema per row: { "messages":[...], "meta":{...} }. user msg = prompt; assistant msg = reasoning
  trace + final JSON answer.
- Held-out EVAL (the thing we must NOT contaminate): the CoinBench/TradeBench 300 at
  /Users/bradleymiles/Documents/tradebench-questions-and-evaluation/src/questions/schema-questions-300q.ts
  (confirm it is the real held-out eval by reading it + its loader; also treat schema-questions.ts as
  eval). The training set's own val.jsonl (61) is a second holdout — train must not duplicate it.
- SUPERSEDED, do not consume: training/qwen3-8b-mini-v1/. Renders live under training/renders/<model>/.

═══════════════════════════════════════════════════════════════════════
DISCIPLINE (the lessons that make this hold up)
═══════════════════════════════════════════════════════════════════════
- BUILD THE GATES FIRST, and prove each can FAIL: write the audit + contamination checks as code with
  assertions; for each, feed a deliberately-bad input and confirm it flags RED before trusting any
  GREEN. A check never seen to fail is worthless.
- LABEL CORRECTNESS IS #1: independently RECOMPUTE every derivable/numeric answer from the prompt.
  If your recomputation disagrees with the gold, it's a wrong label (REPAIR/DROP) — do not trust the
  prior "certified" verdict; it came from a small generator+auditor and one reviewer.
- VERIFY BEFORE CLAIM; check EXIT CODES, not log strings. AUTHOR GREEN ≠ CONFIRMATION — leave
  re-runnable evidence; Codex + Perplexity independently verify in the morning.
- DO NOT REWRITE THE CANONICAL. Phase-1 audit is read-only. Repairs/expansion go to NEW versioned
  outputs (sft-600q-v2/, sft-1500q-v1/) — the pinned 600 stays immutable.
- KARPATHY: smallest code that works. Resumable: per-row result files, commit after each green step,
  on restart read state and resume at the first incomplete step. Work on a feature branch.
- NO paid/LLM/external API calls. Audit = your own recomputation; contamination = local lexical +
  structural methods (no embedding API required). You are also the author of new questions (no
  external generator).

═══════════════════════════════════════════════════════════════════════
THE CONTAMINATION GATE — "archetype, not copy" (headline; locked method)
═══════════════════════════════════════════════════════════════════════
For EVERY training row, compute vs its nearest neighbor in the held-out eval (and vs val):
  (a) STRUCTURAL SKELETON: mask numbers/tickers/entities/amounts → compare skeletons. Exact skeleton
      match to an eval item = COPY.
  (b) LEXICAL SIMILARITY: content-word token Jaccard AND char 5-gram cosine. ≥ 0.60 to nearest eval
      item = near-duplicate.
  (c) ANSWER-KEY OVERLAP: same final answer with only trivial numeric changes + matching skeleton =
      reskin.
  Verdict: COPY/near-dup/reskin → REJECT or REWRITE. distinct-archetype (same skill/scenario_family
  tag but all three below threshold) → OK. Emit per row: nearest-eval-id + the 3 scores + verdict.
  Thresholds are NAMED constants — also report the full similarity DISTRIBUTION so they can be tuned.
  PASS REQUIRES: zero rows above the COPY threshold, vs eval AND vs val. Also run this WITHIN the set
  (internal near-dup dedup).
  Harden, don't reinvent: a prior contamination-rejects mechanism exists in the superseded
  qwen3-8b-mini-v1 path — read it for ideas, then implement cleanly here.

═══════════════════════════════════════════════════════════════════════
PHASE 1 — RIGOROUS AUDIT OF THE 600 (read-only; this is the gating deliverable)
═══════════════════════════════════════════════════════════════════════
Per example verify (merge of the canonical checklist + reverse-derivation):
  1. The user prompt contains enough info to DERIVE the assistant answer (reverse-derivation).
  2. Label correctness: recompute the answer yourself; it must match the gold (or the accepted
     range/ambiguity policy must be explicit). Wrong gold = critical.
  3. Final answer is unique OR the accepted-range/ambiguity policy is explicit (uniqueness is softer
     than for an eval, but contradictions are defects).
  4. No hidden assumptions / no look-ahead / no live-data dependency.
  5. JSON output matches the requested schema; reasoning trace AGREES with the final fields.
  6. No duplicate/near-duplicate prompts (internal).
  7. CONTAMINATION gate above: no leakage from the held-out eval.
Output:
  - audit/ledger.jsonl  (id/line, tier, severity, defect_type, explanation, suggested_fix,
    contamination{nearest_eval_id,skeleton,jaccard,cosine,verdict})
  - audit/summary.json  (counts by severity, tier, defect_type; contamination distribution)
  - PASS / REPAIR / DROP recommendation per example.
Demonstrate each check able-to-fail before trusting the ledger.

═══════════════════════════════════════════════════════════════════════
PHASE 2 — REMEDIATE TO A CLEAN v2 (new output; canonical stays immutable)
═══════════════════════════════════════════════════════════════════════
Apply REPAIR/DROP into training/sft-600q-v2/all.jsonl (never overwrite v1). Re-run Phase-1 audit on
v2 until: 0 wrong labels, 0 schema/trace mismatches, 0 contamination-COPY rows, 0 internal near-dups.
Log every change. Record how many of the 600 survive (DROP count) — the clean base size.

═══════════════════════════════════════════════════════════════════════
PHASE 3 — EXPAND TO ~1,500 (archetypal, contamination-gated AT GENERATION)
═══════════════════════════════════════════════════════════════════════
Add new archetypal examples (≈900 → ~1,500; 2.5× off the CLEAN survivor base — confirm exact target
once the v2 survivor count is known; do NOT multiply defects). Use the eval ONLY as archetype
INSPIRATION, never as source text — never paraphrase a heldout question; build sibling tasks with
different numbers, assets, constraints, venues, route choices, and answer structures.
Each generated example:
  - messages: system + user prompt + assistant JSON answer (+ reasoning/self_check where appropriate),
    matching the canonical schema.
  - meta: { tier, archetype_id, source_family, generated_id } for provenance/traceability.
  - DETERMINISTIC answer, NO ambiguous optimal route, all needed facts inside the prompt, strict JSON
    shape, no external market knowledge required.
  - MUST pass the contamination gate vs eval, vs val, AND vs the existing set BEFORE admission
    (gate at generation; reject-and-regenerate on COPY/near-dup).
STAGED, never auto-merge: write candidates to a SEPARATE file (sft-candidates-900.jsonl) first; run
the full Phase-1 audit on the candidates; only AFTER they pass, assemble sft-1500q-v1/ and produce
train/val splits. Never modify the canonical 600 or its splits.
Outputs: the candidate JSONL, a generation/audit-notes file (method, dedupe checks, tier counts,
known risks), and a manifest (counts by tier, archetype_id/source_family, schema shape). Keep the
tier mix proportional to the canonical distribution; report the matrix.

═══════════════════════════════════════════════════════════════════════
TERMINATE + HANDOFF
═══════════════════════════════════════════════════════════════════════
Loop terminates only when: Phase-1 ledger complete for all 600; v2 is clean per the criteria; the
1,500 set is generated and clean; a single re-runnable command reproduces every gate green; and
BUILD-LOG.md records each step with command, exit code, the red-then-green proof, and any blocker
(STOP+log genuine blockers, never fabricate). Leave everything on a feature branch for independent
Codex + Perplexity verification; author self-review counts for zero. Do not merge.
If a phase can't complete, finishing Phase 1 (the audit ledger) is the minimum valuable outcome.
```

---

## Codex's Part 2 — synthesized (what was folded into Phase 3, what wasn't)

Reviewed Codex's 900-expansion notes. **Adopted into Phase 3** (genuinely additive):
- Per-generated-row **metadata schema**: `{ tier, archetype_id, source_family, generated_id }` +
  system/user/assistant(+reasoning/self_check) — gives provenance and makes the manifest + dedup real.
- **"Eval as archetype inspiration, not source text; never paraphrase heldout questions"** — stated as
  an explicit generation-time rule (reinforces the contamination gate).
- **Staged candidate → audit → merge**: write to a separate `sft-candidates-900.jsonl`, audit, and
  only then assemble `sft-1500q-v1/` + splits — never auto-merge into canonical train/val.
- **Manifest** output (counts by tier, archetype_id/source_family, schema shape) + generation-notes.
- **"Deterministic answer / no ambiguous optimal route"** for generated rows (clean labels at birth).
- Tier-balanced to the canonical distribution (already in the loop).

**Kept from my version (stronger; do NOT downgrade to Codex's lighter version):**
- The **locked contamination GATE method + thresholds** (skeleton / Jaccard+5-gram cosine / answer
  overlap) — Codex says "no leakage" but doesn't define how to measure it; mine does. If Codex later
  proposes thresholds, keep the **stricter** one.
- **Label-correctness recompute** as the #1 audit check (poisoned-label risk).
- **Gates-first + prove-each-can-fail**, resumability, **immutable canonical**, and **independent
  dual verification** (Codex + Perplexity) since author-green ≠ final.

Net: Codex's notes sharpened the *generation/provenance/packaging* of Phase 3; the *audit rigor and
contamination measurement* stay as the spine. The loop above is the finalized, merged version.
