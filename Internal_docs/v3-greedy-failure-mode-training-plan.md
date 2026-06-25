# V3 Greedy Failure-Mode Training Plan ("least generous, most greedy")

**Created 2026-06-19. Supersedes v2.** For Codex audit, then Claude leads execution.
See also: `benchmark-design-first-principles.md`.

## Objective (precise)
Build a specialist **27B** trading model that beats the models people care about **by 20% relative**:
- GPT-5.5 = 157 → target **~189/300**. Fable 5 = 154 → ~185. **Headline target: ~189/300.**
- **Keep the grader STRICT** (do NOT loosen the 27 AGI rubrics now): that keeps Fable5/GPT5.5 at
  154/157 so the bar to beat stays fixed. Beat them under the **same strict grader** (apples-to-apples
  = legitimate). Loosen later (Part F), after the win is banked.

## Thesis
The asset is the **discovery** of frontier trading failure modes; we build the model that doesn't have
them. We do NOT dilute the benchmark for competitors. Greedy on **skills**; strict on
**item-disjointness** (the one inviolable line).

## A. Verify & classify the 79 universal-fails (read-only; sizes everything)
Per row → {bug | genuine failure mode | artifact-but-real-skill}. Keep grader strict for competitors.
- **bug → FIX** (so it's answerable AND so we never train our model on a wrong answer): L9-043
  (canonical contradicts prompt), L7-001 (under-specified), L5-002 (narrow validator). L5-001 → accept
  the correct 0.718 answer (synonym fix).
- **genuine failure mode → gold** (Prong A target).
- **artifact-but-real-skill** (e.g. the ~27 AGI near-misses: right strategy, exact undisclosed label)
  → KEEP the underlying SKILL as a Prong-A target, trained via item-disjoint siblings. Do NOT loosen
  the eval grader for these now.

## B. Build the 27B-specific failure map (the recoverable prong)
New table from the authoritative 69×300 matrix: **questions 27B got WRONG that ≥1 other model got
RIGHT** → demonstrably-solvable 27B gaps → categorize by failure mode. These are the cheapest points
toward ~189.

## C. V2 SFT design — two-pronged, failure-map-sized
- **Prong A (moat):** AGI/universal genuine failure modes + the ~27 near-miss SKILLS.
- **Prong B (recoverable):** 27B-specific failure modes (B).
- **Mine V1 1500 as a reservoir:** salvage (a) the real **AGI wins** v1 already produced, (b) any
  example targeting a verified 27B/AGI failure mode — each re-verified for label-correctness +
  schema-diversity. Discard off-target/mono-schema rows. Do NOT bolt v1 on wholesale; do NOT anchor at
  1500. Size = failure map (~600–1,500).
- Build **item-disjoint sibling tasks** per failure-mode archetype (~20–30 each); fix schema diversity
  (produce exactly the prompt's requested fields, many shapes).
- **Anti-forgetting (locked):** include "maintenance" examples (tiers/skills the 27B already passes);
  train gently (LoRA, modest LR, **2 epochs — maybe 3**); **re-eval ALL tiers** after, and if a tier
  drops, add maintenance examples / lower LR. The 9B broke L10 by forgetting — prevent the repeat.

## D. Baseline & SFT
- **Clean 27B base re-eval** (fair token budget, per-tier) = the TRUE baseline to measure lift against
  (the 166 is deflated).
- **SFT the 27B** (clean base, never the churned 9B) on the two-pronged set.
- **Re-eval ALL tiers** (not just targeted) to catch catastrophic forgetting. Score vs baseline.

## E. GRPO (the refinement)
- Fix ONLY the 4 broken-canonical bugs in the reward (contradictory canonicals get reward-hacked).
  **Do NOT loosen the 27 over-strict labels** — they just raise the bar (exploit-proof), which serves
  the greedy goal.
- GRPO on **item-disjoint siblings**, **dense fieldScore rewards**, targeting L9/L10 + numeric (the
  lift zone; sometimes-right → reward variance). Re-eval + eyeball for reward-hacking.

## F. Sequence (greedy timing)
SFT → score (frontier number for the audience) → GRPO → score (enhanced) → **bank the ~189 win** →
THEN (post-win) loosen the 27 AGI item-disjointness/grading → more GRPO → broader fairness release.

## G. Hard lines & the deferred linchpin
- **Item-disjointness, provable** (contamination gate, as in the 1500 work) — inviolable; what makes
  the claim survive due diligence.
- **Held-out generalization (OWNER-DECLINED for now):** owner's call — exploit every failure mode, no
  held-out, maximize the headline. Not a silent drop: note that a technical investor's due diligence
  may run its own generalization test (fresh/held-out questions) regardless — so keep "generalization
  evidence" as a DD-readiness item to produce when the raise gets to diligence. Not needed for the
  internal frontier-score demo.

## Roles
Codex audits this plan (confirm the greedy thesis + the hard lines + the 27B-map + anti-forgetting +
the GRPO correction). Then **Claude leads execution**, starting with A + B (read-only, no spend).
