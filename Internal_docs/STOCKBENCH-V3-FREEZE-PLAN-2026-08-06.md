# StockBench v3 Freeze Plan

**Status:** Planned; no current-v3 freeze claim.  
**Scope:** Freeze StockBench as a static 300-question equities-reasoning benchmark.  
**Out of scope:** Claims of live execution, profitability, psychometric difficulty calibration, autonomous-agent reliability, or post-training lift.

## Exact release decision

May the current StockBench source, rubrics, grader, runner, proofs, and reports be called a frozen static benchmark?

The answer may be **GREEN** only after every gate below passes on one exact, tagged source tree. Historical v2 evidence is useful input, but it does not substitute for current-v3 evidence when the grader or runner changed.

## Current delta to freeze

The repository contains a historical v2 freeze record and current v3-quality artifacts, but the following must be established against the current source before a v3 release claim:

1. The current StockBench suite, not CoinBench, runs through the intended runner and retains raw outputs.
2. The current shared grader rejects `trade` for `no_trade` and `no_trade` for `trade` in both directions.
3. Every current row has an independently derived answer and an explicit alternate-answer/uniqueness disposition.
4. The current grader rejects construct-relevant wrong answers and accepts semantically equivalent valid answers.
5. Questions, rubrics, grader, runner, proof artifacts, split/provenance records, and reports are content-addressed in one release bundle.
6. An independent Fable audit and the Trading Benchmark Council accept the exact tagged bundle.

## 2026-08-06 baseline and Council pre-audit

Current local static gates are already green:

- quality guardrail: PASS — zero prompt answer leaks, duplicate keys, hidden schema rows, or family-content mismatches;
- mutation harness: 300/300 canonical and mutation-robust, zero wrong-answer leaks;
- categorical canaries: `trade` ↔ `no_trade` both fail as intended;
- structural consistency ledger: 300/300, with problem/rubric hash `6688f45ca0dbfe6c2f5f65cb01a796e5ec004bea6d86d659c1757f1ffe071cf1` and full-review hash `984e1f8616f695b6835b123148c681b0d10704f2dd519e1b1c7c08528756cf69`;
- runner dry run: `--suite stockbench` selects exactly 300 StockBench rows and makes no API calls.

The Trading Benchmark Council nevertheless does **not** release the benchmark yet:

- **Liang — VETO:** the structural ledger is not an independent all-row reverse derivation; release provenance, bundle, tag, and final audits are absent.
- **López de Prado — VETO:** record point-in-time availability, corporate-action/survivorship treatment, family-disjoint train/eval policy, and the post-v2 change/test ledger.
- **O'Hara — REPAIR:** independently prove that each convention-dependent answer is unique from the prompt or an explicitly declared synthetic convention.
- **Yao — REPAIR:** the runner chooses StockBench correctly, but real-run results omit a StockBench source/provenance object; add one before retaining a configured model-run receipt.

After rebuttal with the v2 identity proof and v3 provenance ledger, **Liang, López de Prado, and O'Hara accepted** the unchanged question/rubric corpus for the scoped static claim. Yao's runner-provenance repair is now implemented and verified by a StockBench dry run.

Fable 5's local transport can return a canary response but has twice returned no substantive result for this pre-audit prompt. That is **not** treated as approval. The release candidate remains pending an actual Fable verdict.

## Rules before changing content

- Do not rewrite a question because a model misses it. Repair only a concrete ambiguity, missing fact, non-unique answer, faulty key, or grader defect.
- Preserve the stated difficulty label unless the audit proves that the task definition—not the model—is defective.
- StockBench rows and close template siblings remain evaluation-only; future training uses item-disjoint siblings.
- No paid model run is a substitute for derivation, mutation, or release evidence.

## Protocol

### 1. Freeze the starting evidence packet

Record current commit, worktree disclosure, source/rubric/grader/runner hashes, existing v2/v3 artifacts, and the exact release claim above. Fable 5 audits this plan before any repair.

### 2. Trading Benchmark Council pre-audit

Run the four isolated lenses against the packet:

- **Liang:** answerability, uniqueness, grader behavior, duplicate/template-family risk, reproducibility, and truthful claim scope.
- **López de Prado:** point-in-time facts, temporal leakage, train/eval-family separation, and historical-test-selection disclosure.
- **O'Hara:** equity/options/futures/FX venue conventions, calendar, corporate-action, settlement, borrow, margin, liquidity, and execution assumptions stated in each prompt.
- **Yao:** parser, grader, runner, raw-output retention, deterministic replay, and degenerate/format exploit checks.

Each seat returns `PASS`, `REPAIR`, or `VETO` with concrete evidence. Council output cannot override a counterexample.

### 3. Current-source static gates

Run and retain current receipts for:

1. `scripts/stockbench-quality-gate.ts` — cardinality, metadata, duplicates, scenario/template coverage, and leakage controls.
2. `scripts/mutation-test-stockbench.ts` — canonical pass plus construct-relevant wrong-answer mutations.
3. `scripts/verify-stockbench-decision-categorical.ts` — planted `trade`/`no_trade` flips fail in both directions.
4. `scripts/prove-stockbench-solvability.ts` plus an independent all-row reverse derivation — every key is derived from prompt plus rubric, not copied from the grader.
5. Alternate-valid-answer tests and prompt-injection/format/empty-response tests — valid semantic variants pass; hidden-token and degenerate answers fail.
6. StockBench-specific runner proof — `--suite stockbench` executes the StockBench source and writes its complete run/config/output ledger, including a StockBench source/provenance object (questions, rubrics, grader, runner/config hashes).

Any red gate creates a row-level failure ledger. Repair only those demonstrated defects, then rerun the affected and full dependent gates.

### 4. Release bundle

Build `StockBench v3.0.0` only after all static gates pass. The content-addressed bundle must include:

- questions, rubrics, current grader, StockBench runner, and runner configuration;
- all-row derivations, uniqueness dispositions, mutation receipts, and repair ledger;
- train/development/hidden-family exclusion/provenance manifests;
- exact commands, environment/version provenance, and the release claim/limitations.

Verify every bundle checksum, create a commit containing exactly the release slice, create an annotated `stockbench-v3.0.0` tag, then reverify tagged source and tagged bundle blobs—not the dirty workspace.

### 5. Terminus

1. Fable 5 independently audits the exact tagged bundle.
2. The Trading Benchmark Council runs the final four-seat release decision against that tag.
3. `GREEN` requires every seat to pass for the scoped static claim. Any unresolved domain veto is `QUARANTINE` or `RED`.

## Model coverage run — after static freeze only

After the static release is locked, run the same cost-conscious calibration pattern used for the other benchmarks: Avalon/current Qwen plus the agreed comparator panel under identical runner, prompt, and decoding settings. Retain raw outputs and failure maps.

This run informs difficulty calibration and the Avalon baseline; it cannot justify retroactive prompt changes. Difficulty labels remain unclaimed unless separate calibration evidence supports them.

## Definition of done

StockBench v3.0.0 is done when it has:

- 300/300 current-row derivation and uniqueness evidence;
- current canonical, mutation, categorical, and runner gates passing;
- a content-addressed bundle and checksum verification;
- an annotated tag pointing to the exact release commit;
- Fable 5 `GREEN` and a Trading Benchmark Council `GREEN` for the scoped static claim;
- a published limitations statement preserving the boundaries above.
