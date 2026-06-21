# V2 SFT audit — benchmark-design skill applied (pre-training, before 27B spend)

Independent audit (Gate 8 dual-verification) of sft-1500q-v2 BEFORE any training spend. Status: NO
training has run (provision-and-stop held; SageMaker job list empty).

## Verdict by gate
| gate | result | evidence |
|---|---|---|
| 1 Solvability / reverse-derivation | PASS | label-correct-by-construction; each family self-test re-parses the prompt and re-derives every field; underivable.py = 0 on train |
| 3 Answer-key correctness | PASS (numeric); see Gate 6 (labels) | L9 family EV+constraint formula reproduces L9-043 canonical ($450,476); agents reproduced AGI-015 665.40/AGI-108 188K/AGI-059 24,910/L10-068 173,800 |
| 4 Contamination / item-disjointness | PASS, RED-proven | detector RED on planted reskins; V2 train max-cos 0.597 / max-jac 0.527 / 0 reskins vs 340 eval; first L9/L10 attempt (paraphrased eval, cos 0.62–0.81) was 100% rejected → gate demonstrably bites |
| 6 Hidden-schema / undisclosed-label | **FINDING** | of 17 recoverable AGI rows, **4 are exact-label-gated** (AGI-002,006,013,015): chosen_strategy weight 0.32–0.71 AND all passers emit ONE verbatim string → label-trivia, Tranche-2; **13 are skill-recoverable** (low weight, varied passer labels) |
| 8 Dual independent verification | DONE (this audit) | reproduced contamination result; found the AGI-015 mis-targeting the agent self-report missed |
| Training-set: target failure modes, item-disjoint, schema diversity, anti-forgetting | PASS | sized to failure map; 158 schema sigs; train_sft.py = LoRA r16 / lr1e-4 / 2 epochs (matches v4 anti-forgetting) |

## Exact-label-gated recoverable AGI (Tranche-2, NOT Tranche-1 skill targets)
AGI-002 (cs 0.47), AGI-006 (0.71), AGI-013 (0.32), AGI-015 (0.69). All passers share one verbatim
chosen_strategy → unrecoverable by skill-training; recover in Tranche 2 by loosening AGI grading to
semantic match (per Gate 6 + v4 plan). Counting these as Tranche-1 recoverable would overstate the win.

## Spec correction
- `venue_route` (70 ex) was specced "mirrors AGI-015" — but AGI-015 is exact-label-gated → it is NOT a
  Tranche-1 recoverable point. The venue-allocation SKILL is still valid (transfers; recoverable when
  AGI-015's grading loosens in Tranche 2), but do not count AGI-015 in the Tranche-1 lift.
- The other 5 synthesis/numeric families target skill-recoverable rows correctly (darkpool→025/026/086/087,
  hedge→108, tax→059, l9_fusion→L9 numeric, l10_composition→L10 numeric).

## chosen_strategy treatment (minor improvement)
Skill-recoverable rows have low cs-weight + varied passer labels → my families' descriptive labels pass.
Improvement (not blocking): emit chosen_strategy as a concise DERIVED snake_case label (mirrors passers;
future-proofs any partial-credit), still derived-not-memorized.

## Open skill-transfer risk (empirical, measure post-SFT)
The rebuilt l10_composition teaches restake/loop/collar/ladder/margin compositions (distinct from the
eval's cefi-waterfall/IL-hedge/oracle skills, to clear contamination). Bet: multi-step composition is a
transferable general skill. De-risk option: add closer-but-surface-distinct variants of the actual eval
composition skills. Same applies to l9_fusion framings vs the specific L9 rows. Verify on the clean
re-eval before trusting the lift.

## Training spec accuracy (new base Qwen 3.6 27B)
- train_sft.py hyperparams match design (LoRA/modest LR/2 epochs). 
- CONFIRM before launch: exact HF repo id (placeholder Qwen/Qwen3.6-27B) AND that the new base ships a
  chat template matching our system/user/assistant messages (apply_chat_template). A non-instruct base
  may lack one → SFT formatting would be wrong.
