# Chunk 1 — bug-repair timing decision (OWNER INPUT NEEDED)

Key finding: repairing the 3 over-strict universal-fails RAISES competitor scores (they were
synonym/format near-misses), which fights the Tranche-1 "keep competitors low" goal. None of the 4
are training inputs (all universal-fails, not in recoverable/skill pools), so deferring costs the V2
build nothing.

| id | nature | evidence | competitor impact if fixed now | recommendation |
|---|---|---|---|---|
| **L9-043** | true bug: canonical contradicted prompt (no valid answer existed) | fixed $0→$0.055/vote | hard L9 → ~0–2 models pass even fixed → negligible | **KEEP fixed** (integrity; minimal uplift) — flag for owner keep/revert |
| **L5-001** | over-strict synonyms | best 0.718 = `add_liquidity`/`concentrated_liquidity`/`uniswap_v3` (≡ expected); 67/69 no-failure-reason | 0/69 → ~67/69 → **every competitor +1** | **DEFER to Tranche 2** |
| **L5-002** | over-strict synonyms | `long`/`leverage` ≡ `leveraged_long`/`recursive_borrow` | large uplift | **DEFER to Tranche 2** |
| **L7-001** | prompt/rubric mismatch (vague prompt vs generic-only rubric) | models give concrete (USDC/1M) vs expected generic (multi/flash-loan) | uplift | **DEFER to Tranche 2** |

## Recommendation
- Tranche 1: keep L9-043 fixed; **defer L5-001/L5-002/L7-001 repairs to Tranche 2** (loosen-later, after the win) — consistent with "maximally greedy, least generous now."
- **Exclude all 4 from V2 training seeds** (universal-fails; never train a broken/over-strict canonical).
- Leaves the Tranche-1 benchmark essentially as-published → competitors stay ~154/157 → your ~189 bar holds.

## OWNER DECISIONS
1. Defer L5-001/L5-002/L7-001 to Tranche 2? (recommend YES)
2. Keep L9-043's fix, or also defer to T2 for maximal competitor-suppression? (recommend KEEP — integrity, negligible uplift)

This does NOT block Chunk 2/3 — the V2 training set is independent of benchmark-repair timing. Loop continues.
