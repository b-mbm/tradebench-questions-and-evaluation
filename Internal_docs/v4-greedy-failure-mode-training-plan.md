# V4 Greedy Failure-Mode Training Plan — tranched ("maximally greedy", earned not gamed)

**Created 2026-06-19. Supersedes v3.** For Codex review, then Claude leads execution.
See: `benchmark-design-first-principles.md`, the Codex v3 audit.

## The reframe (why this works)
You do NOT have to choose between the win and integrity. The legit path *gets* the win:
- 27B base ≈ 166 (deflated; true higher on a clean re-eval).
- **Prong B (27B failed, ≥1 other model passed) ≈ ~50 demonstrably-solvable points.** Recover ~25–30
  of them via failure-mode SFT → ~191–196, PAST the ~189 target, **without touching any AGI
  hidden-schema row.** Phase B confirms the exact pool. The win is reachable on legit recoverable
  points alone; AGI hidden-schema rows are deferred to Tranche 2.

## Target
**~189/300** (~20% relative over the strongest published baseline, ~154–157). **Grader kept strict.**
Integrity claim = "we beat the strongest published baseline **under the same repaired strict grader**"
— do NOT anchor to the stale 154/157, because repairing the 4 broken rows (universal-fails) may shift
competitor scores slightly upward; re-account after repair. ~189 < cleaned ceiling (~247) → feasible.

## The ONE invariant (cheap, non-negotiable, protects the identity)
**Train item-disjoint skill-siblings — never eval items, reskins, or undisclosed magic-string labels.**
Costs zero headline. It's what makes the win real and survives due diligence. Everything else is
sequencing.

## Tranche 0 — read-only, no spend (do first; sizes everything)
1. **Phase A — verify/classify the 79 universal-fails.** Split into: *bug* (fix), *valid-strict-
   semantic* (train skill, winnable now), *hidden-schema artifact* (defer to Tranche 2; do NOT
   train-to-label), *genuine-hard* (train skill). Fix the 4 bugs (L9-043, L7-001, L5-002, L5-001).
2. **Phase B — 27B-specific failure map** (27B failed, ≥1 other passed) → the recoverable pool;
   classify by failure mode. This is the primary path to ~189.
3. Freeze the repaired benchmark commit + hashes.

## Tranche 1 — MAXIMALLY GREEDY, LEAST GENEROUS (short-term: get the WIN)
Grader stays strict. Goal: ~189 via legit recoverable points.
- **V2 SFT design (two-pronged, failure-map-sized, NOT a magic 1,500):**
  - Prong A: valid-strict + genuine-hard AGI **skills** (item-disjoint siblings, meaningful labels —
    not the eval's magic strings).
  - Prong B: 27B-specific recoverable failure modes (the win engine).
  - Mine V1 1500 as a reservoir: salvage the real **AGI wins** + any example targeting a verified
    27B/AGI failure mode; re-verify label-correctness + schema-diversity; discard off-target/mono-schema.
  - **Anti-forgetting (locked):** maintenance examples for already-passed skills; LoRA + modest LR;
    **2 epochs (maybe 3)**; re-eval ALL tiers; if a tier drops, add maintenance / lower LR.
- **Clean 27B base re-eval** (fair token budget, per-tier) = true baseline.
- **SFT the 27B** (clean base) → re-eval ALL tiers → score vs baseline.
- **GRPO round 1** on **item-disjoint sibling TASKS derived from non-hidden-schema L9/L10/numeric
  failure modes** (never "questions"; dense fieldScore
  reward). Reward must be **mutation-tested** (punishes wrong, doesn't pass wrong), grade **semantic
  skill** (numeric correctness, valid-route rejection, constraint satisfaction, field reconciliation),
  and **exclude hidden-schema/exact-label + over-lenient rows**. Re-eval + eyeball for reward-hacking.
- **Bank the ~189 win** — the frontier-score demo, earned.

## Tranche 2 — MAXIMALLY GREEDY, MODERATELY GENEROUS (medium-term)
After the win is banked:
- **Loosen the 27 AGI** (semantic grading on intent/chosen_strategy/self_check; disclose schema) →
  fairer benchmark; everyone who'd pass passes — **and our model is in the winning group.**
- **SFT/GRPO round 2** incorporating the now-fair 27.
- **Generalization evidence** for external/DD claims — on this or another benchmark (owner deferred the
  held-out slice; produce evidence here when the raise reaches diligence).

## Execution gates (from the Codex audit, adopted)
- Before V2 build: freeze repaired benchmark; produce Prong B map; classify by skill not tier; define
  sibling templates; run a contamination scan (mask numbers/assets/venues + verb synonyms) and **prove
  it goes RED on a planted reskin.**
- Before SFT: every label derivable from its prompt; match eval output-shape diversity; include
  maintenance examples; size by failure-map prevalence.
- Before GRPO: mutation-test the reward; confirm dense field scores + reward variance; siblings only.

## External framing (use outside the build loop)
"We keep the benchmark strict and fix only objective defects, and train on item-disjoint sibling tasks
derived from observed failure modes." (Internally: "maximally greedy, earned not gamed.")

## Roles
Codex reviews v4. Then **Claude leads execution**, starting Tranche 0 (Phase A + B, read-only).
