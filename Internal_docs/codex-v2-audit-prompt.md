# Codex hand-off — independent adversarial audit of the V2 SFT set (before training spend)

You are the **independent second reviewer** (dual-verification gate). A trading-model SFT set was built
by Claude + subagents to fine-tune **Qwen3.6-27B** (SageMaker Model Customization). Do NOT trust the
author's "all green" — reproduce or refute each claim with your own hands, check exit codes not logs,
and be adversarial: your job is to FIND contamination, wrong labels, or over-claims. End with a GO /
NO-GO for spending on training.

## Locations
- Training set: `tradebench-lite-tests` (branch `v2-failure-mode-build`) → `training/sft-1500q-v2/{all,train,val}.jsonl` (2085 / 1877 / 208). SFT upload form: `training/sft-1500q-v2/smc/{train,val}.jsonl` (`{prompt,completion}`).
- Generators: `gates/fam_v2_*.py` (l9_fusion, l10_composition, darkpool_exec, venue_route, hedge_struct, tax_loss), `gates/fam_v3_agi_a.py`, `gates/fam_v3_agi_b.py`, `gates/fam_v3_categorical.py`; driver `gates/gen_run_v2.py`; assembler `gates/assemble_v2.py`; gate libs `gates/maskedsim.py` + `gates/gatelib.py` + `gates/underivable.py`.
- Eval (must stay disjoint FROM): `tradebench-questions-and-evaluation/src/questions/schema-questions-300q.ts` and the analysis under `results/official/300/June 15th final/exhaustive analysis/` (`intermediate-matrix.csv`, `advanced.jsonl`, rubrics in `src/rubrics/`). Parsed eval corpora the gate uses: `tradebench-lite-tests/audit/eval-300.json` + `eval-60.json`.

## Verify (each is a gate — prove it can go RED)
1. **Contamination / item-disjointness.** Independently scan all 2085 train+val rows vs all 360 eval prompts: report reskins (maskedsim verdict != ok), max content-cosine, max content-jaccard, and any verbatim eval prompt embedded. Author claims 0 / 0 / 0 and max-cos 0.597. **Then PLANT a known reskin** (drop a verbatim eval prompt into a row) and confirm the scanner flags it — a gate that can't go RED is theater.
2. **Label correctness (highest risk — families are code-generated).** For each of the 14+ families, independently re-derive a sample of gold answers from the prompt text with your OWN code and assert equality. Crucially, check the families' computation **matches the eval's canonical method** (read each mirrored row's `_agi_canonical.derivation` / `grading_logic`), not just internal consistency. Flag any family whose math diverges from how the eval grades.
3. **No magic-string labels.** Confirm no family emits the eval's exact `chosen_strategy`/`intent` magic strings; labels must be derivable, meaningful.
4. **Skill-transfer risk.** The l9_fusion/l10_composition/v3 families teach *adjacent* compositions (reworded to clear contamination). Judge whether they plausibly transfer to the eval's actual skills, or diverged too far to help.
5. **Bug-question handling.** Confirm L9-043 is fixed in the benchmark; L5-001/L5-002/L7-001 deferred (not fixed); and all 4 are absent as training seeds (`grep` source_seed in train = 0).
6. **Exact-label-gated AGI deferral.** Author defers 18 AGI rows (13 universal-fail + 5 recoverable; high `chosen_strategy` weight + passer-label convergence) to Tranche 2. Verify that classification.
7. **Solvability + schema diversity.** Spot-check rows are solvable from the prompt; confirm output-schema diversity (~158+ signatures).

## Deliverable
A short report: per-gate PASS/REFUTE with your own numbers, any planted-RED proof, a list of any
bad rows/families found, and a **GO / NO-GO** on spending to fine-tune. If NO-GO, the minimal fix list.
