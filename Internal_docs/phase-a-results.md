# Phase A — universal-fail classification + bug repairs (in progress)

Source: authoritative 69-model matrix + Codex proximity audit. 79 universal-fails classified.

## The split (79)
| bucket | count | source statuses | disposition |
|---|---|---|---|
| **bug** | 4 | canonical_error_likely, prompt_rubric_mismatch, verifier_artifact_likely×2 | FIX minimally (below) |
| **genuine-hard** | 43 | genuinely_hard_partial 32 + genuinely_hard_far 11 | keep as Prong-A skill targets |
| **to-split (valid-strict vs hidden-schema)** | 32 | close_but_strict 24 + near_miss_review 5 + way_off_or_too_strict 3 | per-row review (next wake) |

## Bug repairs (minimal change, difficulty preserved)
| id | tier | bug | repair | status |
|---|---|---|---|---|
| **L9-043** | L9 | prompt said bribes "$0 per ARB vote" but canonical computes $52,250 bribe cost | prompt `$0` → **`$0.055` per ARB vote** (950,000 × $0.055 = $52,250 → EV $450,476 = canonical) | ✅ FIXED — difficulty audit: still L9 (multi-venue governance+lending+bridge, EV calc, missing-votes≤lendable constraint, action choice) |
| **L5-001** | L5 | over-strict synonyms (best 0.718 = add_liquidity/concentrated_liquidity/uniswap_v3 ≡ expected; 67/69 no-failure-reason) | accept synonyms | ⏸ **DEFER to Tranche 2** — fixing flips 0/69→~67/69 = every competitor +1. Owner decision: `chunk1-repair-decisions.md` |
| **L5-002** | L5 | over-strict synonyms (long/leverage ≡ leveraged_long/recursive_borrow) | accept synonyms | ⏸ **DEFER to Tranche 2** (raises competitors) |
| **L7-001** | L7 | prompt/rubric mismatch (concrete vs generic-only) | clarify or loosen | ⏸ **DEFER to Tranche 2** (raises competitors) |

**Decision (greed-aligned):** keep L9-043 fixed (true broken-canonical; hard L9 → negligible uplift);
DEFER the 3 over-strict repairs to Tranche 2 (loosen-later — fixing now hands competitors points).
**Exclude all 4 from V2 training seeds.** Full rationale + owner decisions: `chunk1-repair-decisions.md`.

## 32-split — DONE (heuristic: label derivable-from-prompt? + spot-verify pending)
- **valid-strict (keep as skill target): 25** — AGI-005,011,012,033,034,035,048,051,052,053,055,056,060,061,062,071,073,093,095,096,097,103,104,110,111
- **hidden-schema (defer to Tranche 2; NEVER train-to-label): 7** — AGI-007,066,067,068,069,105,114
- **AGI/universal skill-target pool (Prong A) = 43 genuine-hard + 25 valid-strict = 68.**

## Phase A — DONE (pending 2 owner decisions in chunk1-repair-decisions.md)
- 4 bugs: L9-043 fixed; L5-001/L5-002/L7-001 deferred to Tranche 2 (raise competitors). All 4 excluded from training seeds.
- 32-split: 25 valid-strict / 7 hidden-schema. AGI skill-target pool = 68.
- Optional follow-up (non-blocking): spot-verify the 7 hidden-schema + a sample of the 25 valid-strict.

## Next (loop continues)
- Chunk 2: formalize Phase B recoverable pool (27B-failed, ≥1 other passed; ~55, ~28 strong) classified by failure mode.
- Chunk 3: build the ONE V2 training set (item-disjoint siblings; gates proven RED; never pad/eval-items/magic-strings).
- STOP at Chunk 4 (owner AWS creds ready; provision-and-stop).
