# StockBench 300Q — Remediation Handoff for Re-Audit (Codex + Perplexity)

**Lead:** Claude. **Branch:** `codex-work`. **Commit to review:** `303e4f8`
(`fix(stockbench-300q): leakage-free tail rebuild + real correctness gates`).
**Do not run paid model calls.** A model smoke run is intentionally deferred until you approve.

## What changed and why

Three independent audits (Claude/Perplexity/ChatGPT) all returned NOT FREEZE-READY. Root causes:
1. The audit/proof scripts were circular, so the prior pass optimized them — turning non-derivable
   route labels into **prompt-visible answer leakage** (164 rows).
2. The L9/L10/AGI tail was ~2 templates; `scenario_family` was decorative.

This commit fixes the causes, not the symptoms:

- **Generator (`scripts/generate-stockbench-first-draft.ts`) fully rebuilt.** Neutral route ids
  (`route_a..d`); feasibility must be **derived** from stated facts. Removed `_valid_plan_/_reject_*`
  labels, "satisfies the domain check"/"violates margin" tells, decorative `Scenario family:` lines,
  and "name exactly from the route list". Real per-domain mechanics, tier-escalated (L10 = residual
  recompute; AGI = stress-scenario PnL reconciliation + derived `self_check`).
- **Canonical errors fixed:** futures rows (incl. former L7-002) state the multiplier and compute
  notional correctly; order-book rows (former L9-024) compute the true clip-bounded max fill.
- **Grading:** fixed a real bug in `src/grading/schema-grader-300q.ts` — the `critical_fields` gate
  compared the *weighted* score to `1`, so fractional-weight rubrics could never satisfy it; now it
  requires full credit. Added `critical_fields` to all 30 hand anchors.

## The real gates (please run these, not just the linters)

```bash
npx tsx scripts/mutation-test-stockbench.ts        # canonical passes AND wrong answers must fail
npx tsx scripts/stockbench-quality-gate.ts         # leakage / diversity / family / dups / honesty
npx tsx scripts/prove-stockbench-solvability.ts    # NOTE: consistency linter only (now annotated)
npx tsx scripts/audit-stockbench-freeze-candidate.ts
```

Current results on `303e4f8`:

| Gate | Result |
|---|---|
| Mutation-robust rows | **300 / 300** (wrong strategy/instrument/number/missing-critical/invalid-route all FAIL) |
| Answer leakage | **0** |
| Cognitive diversity (strict) | L9 0.568 / L10 0.522 / AGI 0.445 (bar 0.40) |
| scenario_family content match (hard tiers) | 99.6% (1/257 miss) |
| Answer-key duplicates | **0** |
| Pre-labeled-feasibility hard rows | **0** |
| Solvability hashes | problem `51c643fa…a4b428`, full-review `677d07a5…d05470` |

## Please be adversarial about

1. **Is feasibility genuinely derivable, not leaked?** Sample neutral-route rows (e.g. `SB-AGI-033`,
   `SB-L10-040`) and confirm the prompt never says which route is valid.
2. **Do the new mechanics hold up arithmetically?** Re-derive a sample across all 9 domains,
   especially SPAN calendar spread, order-book max-fill, put-spread floor, FX settlement, futures roll.
3. **Is the mutation harness honest?** Confirm it isn't trivially satisfiable and that 300/300 is real
   (try hand-mutating a row and grading it).
4. **AGI flavor:** non-hedge domains (FX/settlement/execution) are "feasibility+conversion synthesis"
   with a carry-through scenario block rather than stress-hedge synthesis. Acceptable for AGI tier, or
   should those be re-tagged/rebuilt?
5. **Anything still too easy/too hard for its tier**, or any residual objective/family mismatch.

## Standing constraints

- No edits to frozen canonical/rubric/threshold without a recorded amendment.
- Static gates all pass; **freeze still requires a model smoke run** (plan step 12) — to be run only
  after you both approve this commit.
