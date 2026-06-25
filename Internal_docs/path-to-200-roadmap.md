# Path to 200/300 on TradeBench — roadmap (v1)

**Created 2026-06-19.** Goal: a specialist model that maxes the benchmark — stretch target **200/300**,
honest near-term target **beat the best generalist (176)**. This is the converged view of two
independent analyses (Claude + Codex); where they differed, the stronger point was kept.

## Anchors (the facts the plan is built on)
- Tiers: L1–L8 (~50q), **L9 (81)**, **L10 (69)**, **AGI (110)**.
- **84 questions are universal-fail** (no model of 63 passed): 79 AGI + 5 non-AGI (L4-003, L5-001,
  L5-002, L7-001, L9-043). Effective ceiling for ANY model ≈ **216**.
- Best model on earth here: **176**. So 200 is a stretch and needs the *full stack*, not one move.
- Bases: 9B ≈ 124 (clean) · Qwen3.5-27B = 153 · **Qwen3.6-27B = 166** (deflated — true # higher).
- The 9B SFT **churned** (124→124): a DATA problem (mono-schema, unrepresentative), not proof SFT
  fails. Numeric exactness was the churn zone; schema-rigidity was a damaged base capability.
- Deliverable = **27B**. 9B = guinea pig for cheap direction checks only.

## The core principle
Train the **failure MODE (why it failed)**, not the **tier (where it failed)**. Failure modes cut
across tiers. The five modes (from the failure map):
1. numeric exactness  2. wrong strategy/intent  3. output schema/field mismatch
4. missing assumptions  5. AGI synthesis/planning

## Step-by-step

### 1. Failure map + benchmark audit  *(highest leverage; in progress)*
- Get the authoritative 69×300 matrix (Codex; validated against the CSV pass counts).
- Classify every model failure into the 5 modes above (use grade.failureReasons / fieldScores).
- **Audit the 84 universal-fails** — esp. the 5 non-AGI — for FAULTY questions (unsolvable as written,
  contradictory constraints, wrong key). Fix/remove broken ones. This raises the *real* ceiling and
  decides whether 200 is even possible. (Legit QC = fix broken, not soften hard.)
- Output: a per-mode failure inventory + a cleaned benchmark.

### 2. Lock the base
- Re-eval the strongest base **clean** (proper 12–16k token budget, per-tier) for its true number.
- Choose: **3.5-27B** (fine-tunable on Together, easy) vs **3.6-27B** (higher, but SageMaker to tune).

### 3. Build V2 SFT data — by failure mode, not by tier
- For each failure mode, author **sibling tasks** (archetype-aligned, **item-disjoint** from eval —
  never train on eval questions). Size ≈ a few hundred per mode, weighted by failure-map prevalence
  → ~500–1,500 total. The map sets the allocation.
- Fix the v1 defects: **schema diversity** (produce exactly the prompt's requested fields, many shapes)
  and **representativeness** (match the eval's distribution of shapes + difficulty).
- Cannibalize good v1 examples; redesign the distribution. Do NOT reuse v1 as-is; do NOT blind-scale.

### 4. Cheap recipe-direction check
- Validate the V2 recipe LIFTS (not churns) on the held-out eval — on a small/cheap run.
- 9B optional here as the ultra-cheap smoke test; but transfer 9B→27B is NOT guaranteed and AGI can't
  be tested on 9B — so prefer a cheap 27B check if affordable.

### 5. 27B SFT (from a CLEAN base, not the churned 9B)
- Train the 27B on V2. Re-eval per-tier on the cleaned benchmark. Confirm it lifts, esp. on the
  numeric (L9/L10) + schema modes.

### 6. GRPO on L9/L10 — the refinement, AFTER a verifier audit
- Only after a clean **verifier/reward audit** (don't optimize a weird grader).
- Reward = rubric pass/fail + **partial fieldScores** (dense reward → works even where nothing fully
  passes yet; the unlock for harder rows). Run on Predibase.
- Target L9/L10 numeric exactness first (clear verifiable reward, the churn zone). Extend to
  partial-credit AGI cautiously.
- Guardrail: re-eval AND eyeball answers for reward-hacking (higher score, degenerate outputs).

### 7. Re-eval + iterate
- Score on the **cleaned** benchmark. Track toward "beat 176," 200 as the stretch.
- Keep eval items held out throughout — that's what makes the number mean something.

## Honest expectations
- 200 needs BOTH a meaningfully cleaned benchmark AND a strong specialist 27B + GRPO. No single move
  gets there.
- A specialist 27B that beats 176 on a clean benchmark is itself a real, defensible result.
- The 9B will not reach 200 (capability wall) — it's a guinea pig, not the product.

## Rough rating of moves (/1000, toward 200) — converged
- Failure map + benchmark audit: **880** (prerequisite; decides feasibility)
- 27B as the deliverable base: **850**
- V2 SFT from the failure map (foundation): **800** (updated up — churn was data, not method)
- GRPO on L9/L10 with dense rewards (refinement, post-verifier-audit): **780**
- 9B as cheap recipe/plumbing check only: **520**
- Continue on the churned 9B / train 27B on the old 1500 unchanged: **150–350** (don't)
- Mass-generate 10k+ examples before analysis: **220** (volume without geometry)
