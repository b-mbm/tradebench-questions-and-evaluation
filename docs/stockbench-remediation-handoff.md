# StockBench 300Q — Remediation Handoff (Round 2 re-audit) for Codex + Perplexity

**Lead:** Claude. **Branch:** `codex-work`. **Commit to review:** `8906fef`.
**Do not run paid model calls.** Smoke run deferred until you both approve.

## What changed since your last review (commit 303e4f8 → 8906fef)

Both prior reviews were reproduced and **every finding was verified against the grader before fixing.**

| Finding | Reviewer | Status |
|---|---|---|
| Hidden `self_check` schema (rubric required exact nested keys never named in prompt) | Codex (BLOCKER) | **Fixed** — `self_check` is now a pure presence check; a natural `self_check` passes. |
| `selected_route ∈ rejected_routes` still passes (self-contradiction) | Perplexity | **Fixed** — grader now hard-fails it; new mutation asserts it. |
| L8 = one template wearing 9 family labels | Perplexity (HIGH) + Codex | **Fixed** — L8 now uses the real per-family domain builders; L8 cognitive diversity 0.1 → 0.9; all L8 family tags match content. |
| ~38% of AGI is route-screening, not synthesis | Codex (MAJOR) + Perplexity (MED) | **Fixed by matrix reallocation** (recorded amendment): AGI concentrated in options/futures/portfolio/shorting = **98/110**; non-hedge content demoted to L9/L10. Per-tier (81/69/110) and per-domain totals unchanged. |
| `SB-AGI-005` family mismatch | Codex | **Fixed** — retagged to `multi_asset_drawdown_hedge` (its real content). |
| Gate blind spots (mutation builds from canonical; family check skipped L8) | both | **Fixed** — added a hidden-schema check + a self-contradiction mutator; family-content check now covers L8. |

Also fixed a real grader bug found while implementing: the `critical_fields` gate compared the
*weighted* score to 1, so fractional-weight rubrics could never satisfy a critical field.

## Reproduce (the real gates)

```
npx tsx scripts/mutation-test-stockbench.ts      # 300/300 robust, 0 leaks
npx tsx scripts/stockbench-quality-gate.ts       # PASS
npx tsx scripts/audit-stockbench-freeze-candidate.ts   # freezeReady:true (matrix/tier/domain match)
npx tsx scripts/prove-stockbench-solvability.ts  # consistency linter only (annotated)
```

Current results on `8906fef`:

| Gate | Result |
|---|---|
| Mutation-robust rows | **300 / 300** (now incl. self-contradiction mutator) |
| Answer leakage | 0 |
| Cognitive diversity | L8 0.9 / L9 0.593 / L10 0.667 / **AGI 0.491** (bar 0.40) |
| scenario_family content match (L8–AGI) | **0/267 mismatch** |
| Answer-key duplicates | 0 |
| Hidden-schema (critical nested key un-named in prompt) | 0 |
| AGI in synthesis domains | **98 / 110** |
| Solvability hashes | problem `9118a443…1343d`, full-review `28d3e4cb…14a3fc` |

## Please re-audit adversarially

1. Confirm the `self_check` fix: a natural/omitted `self_check` should no longer hard-fail; exact nested keys must NOT be required.
2. Confirm self-contradiction now fails (put `selected_route` into `rejected_routes`).
3. Confirm L8 rows genuinely exercise their tagged families (no fabricated labels).
4. Judge the reallocated AGI tier: are options/futures/portfolio/shorting AGI rows genuine autonomous synthesis? Re-derive a sample.
5. Independent re-derivation: please hand-derive a fresh 30-row sample (Perplexity item 3) — a different reviewer, not the author.
6. Anything still mis-tiered, mislabeled, or unfair under strict pass@1.

## Return

`APPROVE / APPROVE-WITH-FIXES / REJECT`, whether you reproduced the gates+hashes, counts, a table of any problem rows (`ID | issue | severity | fix`), systemic concerns, and explicit smoke-run clearance.

Freeze still requires a model smoke run (plan step 12) after your approval.
