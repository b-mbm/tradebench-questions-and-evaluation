# AvalonBench v1 — Slice 1 contract

Slice 1 is an executable benchmark contract. It does not call a model or the Avalon product runtime, and it contains no blind prompt or oracle bodies.

## Configuration and schemas

- `src/avalonbench/schema.ts` freezes the five partition names, ten failure stages, typed request, oracle, episode, exposure, run, and stability schemas.
- `src/avalonbench/contract.ts` configures the four strata and their four visible direct cases. The grader has no stratum-specific control-flow branches.
- `src/avalonbench/runtime-inventory.ts` is the machine-readable counterpart to `SLICE-1-RUNTIME-INVENTORY.md`.
- `src/avalonbench/fixtures.ts` contains deterministic observable episodes authored from the verified snapshot. They were not produced by the production function under evaluation.

Every oracle declares its material fields. Pre-provider validation rejects an oracle unless every declared material field is covered by a deterministic structured predicate. Extraction and normalized-request predicates separately expose dropped or silently changed values.

Every episode is bound to its case id, exact prompt, system-scaffold digest, capability-snapshot digest, tool manifest, and capability/venue/account fixture references. Cross-case or cross-fixture evidence is classified as `INCOMPLETE`. Permitted outcomes, typed forbidden claims, authority boundaries, allowed artifact types, and the empty-financial-mutation rule are all linked to active predicates; declaration drift is invalid before provider execution.

## Deterministic grading

`src/avalonbench/grader.ts` evaluates structured paths only. Exact response prose is forbidden as an authoritative predicate surface. Predicates are sorted by frozen stage, frozen within-stage order, and stable predicate id. The first failed predicate is primary; all later observable failures are ordered secondary failures; dependency-blocked checks are `NOT_EVALUABLE`; authority and financial vetoes remain in causal order and are also copied into the veto list.

`src/avalonbench/provider-runner.ts` validates a case and oracle before invoking a provider callback. Invalid cases return `INVALID` with zero callback invocations. Provider or harness failure returns `INCOMPLETE`. A safely observed veto forces `FAIL` even if the earliest failure is a harness-context failure.

No regex interprets user language. Slice 1 begins with typed requests and validates/grades the resulting observable episode.

## Append-only artifacts

- `data/avalonbench/v1/exposure-ledger.jsonl` records authorship and oracle validation for the four visible cases. Each entry binds the complete case-and-oracle digest. Partition chains are validated, and `consumed` is irreversible.
- `data/avalonbench/v1/run-registry.jsonl` records planned, launched, and completed states for the zero-provider deterministic contract run. The exact ten-field run tuple is immutable across entries.
- `data/avalonbench/v1/stability-panel.json` permanently marks the panel non-blind and excluded from blind scoring. Slice 1 defines no stability case bodies.

The deterministic contract run uses content-addressed SHA-256 identities in `scorerCommit` and `runnerCommit`. This gives the pre-commit report an exact, non-circular source identity: a Git commit cannot contain its own eventual hash.

Runtime validators check required exposure and run fields rather than relying on TypeScript alone. Exposure to an implementation-capable role forces reserve or active-blind metadata into `consumed`, and stability membership is permanent. The Slice 1 tests exercise these rules with in-memory metadata only; they do not create, allocate, or expose a blind case body.

## Verification

From the repository root:

```sh
npm ci --ignore-scripts
npm run typecheck:avalonbench
npm run test:avalonbench:contract
npm run report:avalonbench:contract
shasum -a 256 reports/avalonbench-v1-contract-report.json
```

Run the report command twice and compare SHA-256 output to prove reproducibility. The test command retains the four direct GREEN receipts, alternate-wording and truthful-UNKNOWN GREEN receipts, all 13 required RED mutation receipts, append-only negative proofs, pre-provider rejection proof, ordered simultaneous-failure proof, same-stage tiebreak proof, and independent veto-retention proofs.

## Frozen Slice 1 boundary

There are zero authored, allocated, or executed blind cases. There are zero provider calls, paid model calls, Avalon runtime mutations, financial mutations, product behavior changes, PRs, merges, or deployments. The absent sanctioned runtime adapter and authoritative product-capability lookup remain explicit Slice 2 blockers.
