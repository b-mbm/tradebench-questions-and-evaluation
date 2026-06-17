# StockBench 300Q — FREEZE RECORD

**Status: FROZEN (v2)**
**Tag:** `stockbench-300q-freeze-v2` · **Freeze date:** 2026-06-16
**Lead:** Claude · **Independent reviewers:** Codex, Perplexity · **Full audit:** subagent fan-out

## Why v2 supersedes v1

v1 (`4d6aae2`) passed the gates and both reviewers, but a subsequent **exhaustive per-row
reverse-derivation + non-uniqueness audit of all 300** (the check a peer reviewer would run) found
8 ERROR + 6 NON_UNIQUE + 51 PARTIAL — invalidating v1. Those were fixed and the full audit re-run to
a clean result. v2 is the remediated, fully-audited freeze.

## Frozen-state hashes (`npx tsx scripts/prove-stockbench-solvability.ts`)

- problem/rubric: `6688f45ca0dbfe6c2f5f65cb01a796e5ec004bea6d86d659c1757f1ffe071cf1`
- full-review: `984e1f8616f695b6835b123148c681b0d10704f2dd519e1b1c7c08528756cf69`

Working tree clean at the frozen commit; HEAD reproduces these hashes.

## Verification at freeze

| Check | Result |
|---|---|
| Mutation gate | 300/300 mutation-robust, 0 leaks |
| Quality gate | PASS — leakage 0, scenario_family mismatch 0/293, dups 0, hidden-schema 0, pre-labeled 0, diversity L9 .59 / L10 .67 / AGI .49 |
| Freeze audit | `freezeReady: true` |
| **Full reverse-derivation + non-uniqueness audit (all 300)** | **300 VERIFIED, 300 UNIQUE, 0 ERROR, 0 NON_UNIQUE, 0 PARTIAL** (per-row ledger in `docs/reverse-derivation/LEDGER.csv`, evidence in `docs/reverse-derivation/results/`) |

The reverse-derivation audit is the strongest claim: for every one of the 300, an independent
reasoner saw the answer and confirmed it is *uniquely* derivable from problem + rubric alone, with
all arithmetic recomputed.

## v2 amendments (recorded per the freeze contract)

1. Options early-assignment prompts state the full rule (rational only when ITM **and** dividend >
   remaining time value; OTM/ATM never assigned); derivation text corrected. (fixed 7 ERRORs)
2. SB-L9-005 target 30%→35% so the keyed 1ES+4MES is the true cost-minimum. (ERROR+NON_UNIQUE)
3. SB-L10-005 pins full XLK exit. (NON_UNIQUE)
4. Options exercise branch made a binary exercise-vs-sell choice. (NON_UNIQUE)
5. Spot-equity tickets state trade_value is marked at the snapshot price. (PARTIAL ×~8)
6. `decision` enum stated in the output line (derivable); un-derivable composed labels dropped from
   critical_fields. (PARTIAL ×~37)
7. FX prompts state the US-retail CFD ban; SB-L1-001 ticker SPY; SB-AGI-006 fill-price basis;
   SB-L8-001 instrument "AAPL 175 call"; SB-L3-001 PnL tolerance.
8. Grader: feasibility↔decision consistency check. Mutation harness: wrong-strategy targets the
   derivable critical choice field.

## Freeze contract

No edits to canonical answers, rubric scoring contracts, or pass thresholds after this freeze
without a recorded amendment here (id, reason, reviewer, new hashes). Prompt-only typo fixes must be
re-gated with updated hashes. The AGI matrix reallocation is recorded in `stockbench-300q-plan_v2.md`.

## Remaining step (not part of the freeze)

Model smoke run across the free/local roster (plan step 12) — measurement only, no paid calls.
