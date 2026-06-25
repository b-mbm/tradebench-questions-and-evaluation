# V2 Greedy Failure-Mode Training Plan — "least generous, most greedy"

**Created 2026-06-19.** For Codex audit. Goal: a specialist trading model (27B) that scores
materially higher than every frontier model on TradeBench-300 — the artifact behind a raise.

## Thesis (least generous, most greedy)
The asset is the **discovery**: frontier models share specific trading failure modes; we isolate them
and build the model that doesn't. We do NOT dilute the benchmark so competitors pass — diluting the
benchmark destroys the discovery. We keep the bar hard and make *our* model clear it. Greedy on
**skills**; strict on **item-disjointness** (the one inviolable line).

## Two inviolable rules (these protect the raise)
1. **Item-disjointness, provable.** Train on failure-mode SIBLING tasks (different numbers/instruments/
   constraints), NEVER eval items or reskins. Keep a contamination gate (as in the 1500 work) so it's
   provable in due diligence. Memorizing eval strings = gaming = dead raise.
2. **Held-out generalization set.** Carve out a held-out slice of the benchmark (or a fresh question
   set) that we build ZERO siblings for. Report the model's lift on THAT. "Better on held-out it never
   trained toward" is fundable; "better on what we optimized" is dismissed.

## Phase 0 — define the claim
- Pin "20% better": vs which baseline (best generalist 176 vs the TRUE clean 27B base) and
  absolute-points vs relative. This sets the target and the pitch.

## Phase 1 — verify & classify the 79 universal-fails (no relaxing grader for competitors)
Per-row, classify into:
- **bug** (broken prompt/canonical/under-spec) — e.g. L9-043 (bribe contradiction), L7-001
  (under-specified), L5-002 (narrow validator). → FIX so they're answerable/correct (integrity, and
  so we don't train our model on a wrong answer). NOT generosity.
- **genuine failure mode** — real capability gap. → gold; skill-target for V2.
- **artifact-but-real-skill** (e.g. AGI near-miss: right strategy, exact undisclosed label) → keep the
  SKILL as a V2 target (train via siblings), but do NOT relax the grader for competitors.
- L5-001 → accept the correct 0.718 answer (fix synonym over-strictness), making it a valid question.

## Phase 2 — build the 27B-specific failure map (the recoverable prong)
- New table: questions **27B got wrong AND ≥1 other model got right** (demonstrably solvable gaps).
- Categorize by failure mode. These are the cheapest points toward the target. (Source: authoritative
  69×300 matrix.)

## Phase 3 — V2 SFT design (two-pronged, failure-map-sized)
- **Prong A (moat):** AGI/universal genuine failure modes (Phase 1 gold).
- **Prong B (recoverable):** 27B-specific failure modes (Phase 2).
- **Mine V1 1500 as a candidate pool:** keep examples that target a verified 27B/AGI failure mode AND
  pass label-correctness + schema-diversity re-checks. Discard off-target/mono-schema ones. Do NOT
  bolt V1 on wholesale; do NOT anchor V2 at 1500.
- Build item-disjoint sibling tasks per failure-mode archetype (~20–30 each); fix schema diversity
  (produce exactly the prompt's requested fields, many shapes). Size = failure map (~600–1,500),
  NOT a blind target.
- Include "maintain what works" examples (anti-forgetting).

## Phase 4 — baseline & training
- **Clean 27B base re-eval** (fair token budget, per-tier) = the TRUE baseline to measure lift against.
- **SFT the 27B** (clean base, not the churned 9B) on V2.
- **Re-eval ALL tiers** (not just targeted) to catch catastrophic forgetting/regressions.

## Phase 5 — verifier audit, then GRPO
- **Clean the grader/verifier BEFORE GRPO** (the 4 bugs + over-strict labels in our reward fn), or
  GRPO reward-hacks the bug.
- **GRPO** with dense fieldScore rewards on L9/L10 + numeric (the lift zone). Guardrail: re-eval +
  eyeball for reward-hacking.

## Phase 6 — report & DD-proof
- Report lift vs the true 27B baseline AND on the HELD-OUT set.
- Publish methodology + contamination proof. The claim must survive technical due diligence.

## 9B usage
- 9B = optional ultra-cheap recipe/plumbing check only. Deliverable = 27B. Do not treat 9B numbers as
  predictive (esp. AGI).

## Sequence
Verify(1) + 27B-map(2) → fix bugs(1) → V2 design + V1 mining(3) → held-out carve-out → clean 27B
baseline(4) → 27B SFT(4) → re-eval all tiers → verifier audit(5) → GRPO(5) → report on held-out(6).
