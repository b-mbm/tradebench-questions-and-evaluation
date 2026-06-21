# Codex V2-SFT Audit — METAPROMPT (paste this whole block into a fresh Codex session)

---

You are the **independent, adversarial second reviewer** of a fine-tuning training set, before any GPU
spend. A trading-model SFT set ("V2") was built by another AI (Claude) plus subagents to fine-tune
**Qwen3.6-27B** via SageMaker Model Customization. Your job is NOT to agree — it is to **reproduce or
refute** every claim with your own code, **prove each gate can go RED**, hunt for contamination / wrong
labels / over-claims, and end with a **GO or NO-GO** on spending money to train. Check exit codes and
your own numbers, not the author's logs.

## Repos (both on this machine; also on GitHub under b-mbm/)
- **Training set + generators:** `/Users/bradleymiles/Documents/tradebench-lite-tests` (branch `v2-failure-mode-build`)
  - Set: `training/sft-1500q-v2/{all,train,val}.jsonl` = **2085 / 1877 / 208**
  - SFT upload form: `training/sft-1500q-v2/smc/{train,val}.jsonl` (`{prompt,completion}`)
  - Generators: `gates/fam_v2_*.py` (l9_fusion, l10_composition, darkpool_exec, venue_route, hedge_struct, tax_loss), `gates/fam_v3_agi_a.py`, `gates/fam_v3_agi_b.py`, `gates/fam_v3_categorical.py`
  - Pipeline: `gates/gen_run_v2.py` (driver), `gates/assemble_v2.py` (assembler), `gates/maskedsim.py` + `gates/gatelib.py` + `gates/underivable.py` (gate libs), `gates/v2_targets.json`
  - Parsed eval corpora the gate uses: `audit/eval-300.json`, `audit/eval-60.json`
- **Eval (training MUST stay disjoint FROM this):** `/Users/bradleymiles/Documents/tradebench-questions-and-evaluation` (branch `codex-work`)
  - `src/questions/schema-questions-300q.ts` (the 300 CoinBench eval questions), `src/rubrics/*.json`
  - `results/official/300/June 15th final/exhaustive analysis/` → `intermediate-matrix.csv` (69 models × 300), `advanced.jsonl` (per-question rubric + per-cell answers)

## The author's claims to REFUTE (verify each independently)
- Contamination: **0 reskins, 0 verbatim eval questions, max content-cosine 0.597, max jaccard ~0.53** across all 2085 vs all 360 eval prompts.
- Labels: **0 unverifiable** (`underivable.py`), all gold "correct by construction"; **~158 distinct output-schema signatures**.
- The 14 new families teach failure-mode *siblings* (item-disjoint), not eval copies; **no eval magic-string labels**.
- Bug questions: **L9-043 fixed** in the benchmark; **L5-001/L5-002/L7-001 deferred** (not fixed); **all 4 excluded from training seeds** (0 in train).
- **18 AGI rows** (13 universal-fail + 5 recoverable; high `chosen_strategy` weight + passers converge on one verbatim label) deferred to "Tranche 2" as exact-label-gated.

## Audit checklist — each is a gate; prove it can go RED
1. **Contamination / item-disjointness.** Scan all 2085 train+val vs all 360 eval prompts with your own metric: reskins (maskedsim verdict != ok), max cosine, max jaccard, any verbatim eval prompt embedded. **Then PLANT a verbatim eval prompt into a row and confirm the scanner flags it** — a gate that can't fail is theater. Report your numbers vs the author's.
2. **Label correctness (highest risk — families are code-generated).** For each of the 14 families, re-derive a sample of gold answers from the prompt text with your OWN independent code and assert equality. Critically, check each family's math **matches the eval's canonical method** for the rows it mirrors (read `_agi_canonical.derivation` / `grading_logic` in `advanced.jsonl`), not merely internal consistency. Flag any family whose computation diverges from how the eval grades.
3. **No magic-string labels.** Confirm no family emits the eval's exact `chosen_strategy`/`intent` strings; labels must be derivable + meaningful.
4. **Skill-transfer risk.** l9_fusion / l10_composition / the v3 families teach *adjacent* compositions (reworded to clear contamination). Judge: do they plausibly transfer to the eval's actual skills, or did they diverge too far to help? This is a bet — give your read.
5. **Bug-question handling.** Confirm L9-043 fixed; L5/L7 deferred; `grep` source_seed for all 4 bug ids in `train.jsonl` = 0.
6. **Exact-label-gated AGI.** Re-derive the 18-row classification (field-weight × passer-label convergence from the matrix + advanced.jsonl) and confirm it's right.
7. **Solvability + schema diversity.** Spot-check rows are solvable from the prompt alone; confirm output-schema diversity.

## Deliverable
A concise report: per-gate **PASS / REFUTE** with YOUR numbers; the planted-reskin RED proof; a list of
any bad rows or families you found; the skill-transfer verdict; and a final **GO / NO-GO** on spending to
fine-tune Qwen3.6-27B on this set. If NO-GO, give the minimal fix list.
