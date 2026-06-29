# Three-Way Comparison: OpenRouter vs RunPod Base vs RunPod SFT

**Date:** 2026-06-29 · **All three runs on the exact same 29 hard-tier questions, same prompt, same json_object.**

## THE RESULT

| | OpenRouter (fresh) | RunPod base | RunPod SFT |
|---|---|---|---|
| **Total** | **19/29** | **16/29** | **19/29** |
| L1-8 | 5/7 | 5/7 | 5/7 |
| L9 | 6/8 | 4/8 | **6/8** |
| L10 | 8/8 | 7/8 | 7/8 |
| AGI | 0/6 | 0/6 | **1/6** |
| **vs OR** | — | -3 | **+0** |

**Our fine-tuned model matches OpenRouter's stock Qwen3.6-27B on the hard-tier set.** The 7-point gap we measured against the old OR reference (26/29) was an artifact of the old reference data — the fresh OR run also scores 19/29. When measured apples-to-apples on the same day, same questions, same json_object config: SFT = OR.

## Per-question comparison

| qid | OR | base | SFT | signal |
|---|---|---|---|---|
| L6-003 | ❌ | ❌ | **✅** | SFT improvement |
| L9-006 | ❌ | ❌ | **✅** | SFT improvement |
| L9-008 | ✅ | ❌ | **✅** | SFT recovered |
| L9-009 | ✅ | ❌ (truncated) | **✅** | SFT recovered (base spiraled) |
| **AGI-014** | ❌ | ❌ | **✅** | **SFT unique win** |
| L6-002 | ✅ | ✅ | ❌ | base regression |
| L9-002 | ✅ | ✅ | ❌ | base regression |
| L10-003 | ✅ | ❌ | ❌ | OR only |

## Key findings

1. **The old "26/29" OR reference was inflated.** The fresh OR run scored 19/29, not 26. The prior reference included a repair pass and different run conditions. Apples-to-apples, OR is 19/29 on this set.

2. **SFT = OR (19/29).** Our fine-tuned model matches stock Qwen3.6-27B served on OpenRouter. This is the parity we've been chasing.

3. **SFT is +3 over base (16→19).** The fine-tune added real capability: L9-008, L9-009 (recovered from base truncation), AGI-014 (unique solve), L6-003, L9-006.

4. **AGI-014 is the cleanest signal.** OR failed it, base failed it, SFT solved it. The fine-tune added a capability that neither the stock model on OpenRouter NOR our base model had.

5. **AGI is still hard for everyone.** OR scored 0/6, base scored 0/6, SFT scored 1/6. AGI-001/002/003/004/024 are genuine capability gaps for all three.

## What this means

The fine-tune is working, and it's competitive with stock Qwen3.6-27B on OpenRouter. The serving stack is fair. The comparison is honest. The next step is either (a) scaling to the full 300 to get the complete picture, or (b) iterating on the training data to close the remaining AGI gaps.
