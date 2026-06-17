# StockBench 300Q — FREEZE RECORD

**Status: FROZEN (v1)**
**Frozen commit:** `4d6aae2` on `codex-work` · **tag:** `stockbench-300q-freeze-v1`
**Freeze date:** 2026-06-16
**Lead:** Claude · **Independent reviewers:** Codex, Perplexity

## Frozen-state hashes (reproduce with `npx tsx scripts/prove-stockbench-solvability.ts`)

- problem/rubric: `cadf634ec421d0149b72cb7ae71d1f351e6cd71f6f31bb7a975c82089be30cdc`
- full-review: `a4647f8729847c603aa4fd0687f03822cb8ab49c0804acd48a804e9f2ed42948`

The working tree is clean at the frozen commit; HEAD reproduces these hashes.

## Gate results at freeze

| Gate | Result |
|---|---|
| `scripts/mutation-test-stockbench.ts` | 300/300 mutation-robust, 0 wrong-answer leaks |
| `scripts/stockbench-quality-gate.ts` | PASS — leakage 0, scenario_family mismatch 0/293, answer-key dups 0, hidden-schema 0, pre-labeled feasibility 0; cognitive diversity L9 0.593 / L10 0.667 / AGI 0.491 (bar 0.40), L1–L8 all above bar |
| `scripts/audit-stockbench-freeze-candidate.ts` | `freezeReady: true` (tier/domain/matrix all match) |
| `scripts/prove-stockbench-solvability.ts` | ALL_300_VERIFIED (consistency linter) |

## Reviewer sign-offs

- **Codex — APPROVE** at `4d6aae2` / `64f4c60`: reproduced gates + both hashes; all prior findings closed (self_check schema, selected∈rejected consistency, L8 honesty, AGI reallocation, low/mid domain/family honesty, clean committed tree); cleared for smoke + freeze; problem rows: none.
- **Perplexity — APPROVE** at `488f135` (rebuild `8906fef`): fresh 30-row / 69-probe hand-derivation, 0 canonical errors, 0 leakage, 0 mis-tier blockers; cleared for smoke + freeze. The changes between `488f135` and the frozen `4d6aae2` are the low/mid-tier metadata-honesty fixes (domain-aware mechanics + honest families) — improvement-only, no regression, verified green by all gates.

## What this benchmark is

300 self-contained TradFi trading questions (L1→AGI). Hard tail concentrated in synthesis domains
(98/110 AGI in options/futures/portfolio/shorting). Strict pass@1. Every graded field is
deterministically derivable from the frozen packet; feasibility must be derived, not read from a
label; wrong strategy/instrument/number/missing-critical/invalid-route all fail the grader.

## Freeze contract (from plan v2, "Audit Standard")

- **No edits to canonical answers, rubric scoring contracts, or pass thresholds after this freeze
  without a recorded amendment** in this file (id, reason, reviewer, new hashes).
- Prompt typo/clarity fixes that do not change any answer are permitted but must be re-gated and the
  hashes updated here.
- The AGI matrix reallocation (2026-06-16) is recorded in `stockbench-300q-plan_v2.md`.

## Next step (not part of the freeze)

Model smoke run across the free/local roster (plan step 12) — measurement only, no paid calls.
Suggested canary (per Perplexity): a strong model (Sonnet 4.6 / Opus) for AGI-threshold sanity, one
small open-weight (Qwen / Llama) as a floor canary, with L1–L7 gated separately.

## Amendments

_(none yet)_
