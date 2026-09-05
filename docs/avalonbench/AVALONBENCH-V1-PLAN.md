# AvalonBench v1 — Runtime Harness Conformance Plan

Status: canonical implementation plan; revised from Midnight Run benchmark failures; implementation has not started  
Owner: Avalon  
Created: 2026-09-04  
Working branch: `feat/avalon-bench-v1`

## The one-sentence definition

AvalonBench is Avalon's runtime conformance benchmark: it proves that every shipped capability is discoverable, represented accurately in the harness, routed to the correct tools, bounded by current authority, and reflected truthfully in the response and resulting state.

## Explain like I am five

When Avalon gets a new power, AvalonBench asks it real questions about that power. It checks whether Avalon knows the power exists, explains it correctly, uses the right tool, and never claims it did something it could not do.

## Why v1 exists

A user asked Avalon:

> What can I do on Hyperliquid?

Avalon reportedly searched the public web, spent roughly a minute, and returned general information about Hyperliquid. It did not explain Avalon's own Hyperliquid capabilities or offer the relevant Avalon workflow.

This is a product-harness failure, not merely a copy problem. Inside Avalon, “What can I do on Hyperliquid?” ordinarily means “What can I do with Avalon on Hyperliquid?” A shorter system prompt cannot supply a capability the harness does not make available.

AvalonBench v1 must detect that entire failure class:

- What can I do with X?
- What can I trade on X?
- Can Avalon trade Y?
- Does Avalon support Z?
- Where can I do Y in Avalon?
- Can this account do Y now?
- Create the supported agent or workflow for Y.
- Compound questions containing both public research and Avalon capability discovery.

## Current state

### Verified in this worktree on 2026-09-04

- This repository is the standalone `tradebench-questions-and-evaluation` runner.
- Its tracked mainline contains the existing 60-question TradeBench schema harness.
- Before this document, the clean `feat/avalon-bench-v1` worktree contained no AvalonBench v1 specification, capability manifest, Avalon runtime adapter, or v1 implementation.
- This repository does not contain the Avalon application runtime, system prompt, agent registry, chat tools, account state, or durable session state.

### Historical inputs, not current runtime proof

The research worktree at `/Users/bradleymiles/Documents/tradebench-self-evolving-agents` contains:

- `Internal_docs/AVALONBENCH-AND-LEARNING-LOOP-SPEC-v0.1.md`
- `docs/avalonbench-v0.1-FREEZE.md`
- `src/questions/avalonbench-questions-100q.ts`
- `src/grading/avalonbench-grader.ts`

That material defines a valuable 100-question synthetic product-contract benchmark and reserves v1 for complete Avalon episodes. It does not execute the real Avalon harness. Do not copy its static prompt-packet architecture and rename it v1.

The binding benchmark-design postmortem is:

- `/Users/bradleymiles/Documents/avalon-midnight-run/internal_docs/BENCHMARK-DESIGN-LESSONS.md`

Its `220/220` visible result and `25/43` independently authored blind result demonstrated that wrapper variations around canonical phrases measure exposed regression compatibility, not semantic generalization. AvalonBench v1 adopts its exposure, oracle, final-state, run-registry, stability-panel, failure-taxonomy, and mutation-proof requirements. Its parameter-extraction corpus ratios do not apply here.

### User-stated target capabilities requiring runtime verification

- Avalon has Hyperliquid Momentum and Observer agent workflows.
- Avalon supports relevant HIP-3 markets.
- Avalon should distinguish equity-referencing perpetual contracts from ownership of actual company shares.
- Avalon Chat and Avalon Pro should expose the same underlying agents and capabilities through different presentations.

These statements define the intended product contract. Inventory the current Avalon code and runtime before encoding them as present-tense benchmark canon.

## Frozen v1 outcome

The first AvalonBench v1 release is successful when one Hyperliquid capability family runs through Avalon's actual chat harness and can prove all of the following:

1. Avalon recognizes questions about its own capabilities.
2. Avalon consults its authoritative capability source.
3. Avalon distinguishes product support, venue listing, and current-account availability.
4. Avalon describes the instrument accurately, including actual shares versus equity-referencing perpetuals.
5. Avalon routes supported creation requests into the correct existing workflow.
6. Avalon uses public search only for genuinely external facts.
7. Avalon can combine public research and internal capability lookup in one answer.
8. Avalon does not create an order, position, wallet authorization, or other financial mutation during a capability question.
9. The grader fails known-bad traces and responses.
10. The result is reproducible from a frozen fixture and inspectable evidence bundle.

This family is an acceptance benchmark. It can prove that the product contract works. It cannot prove broad model intelligence, trading competence, profitability, or untouched generalization.

## First principles

### Test the assembled system

The evaluated object is not a naked model response. It is:

```text
model
+ system prompt
+ capability context
+ tools and tool descriptions
+ routing policy
+ venue metadata
+ account permissions and readiness
+ conversation state
+ durable product state
```

A direct provider call with capabilities pasted into the user prompt measures a different system and cannot satisfy v1.

### Partition before authoring

AvalonBench is a partitioned experimental system, not a folder of prompts. Every case belongs to exactly one partition:

```text
visible development
active blind
unseen reserve
consumed regression
permanent stability panel
```

- **Visible development:** direct cases used to build and debug the product and benchmark.
- **Active blind:** independently authored cases allocated to one frozen formal evaluation.
- **Unseen reserve:** valid blind cases withheld from implementers, prompt authors, scorer maintainers, and anyone who may remediate the system.
- **Consumed regression:** former blind cases whose text, oracle, output, failure, or mechanism has been exposed to someone who can change the system.
- **Permanent stability panel:** deliberately non-blind cases repeated against an immutable run tuple to estimate model and provider variance.

Blindness is about mechanism exposure, not merely hidden prompt text. A case becomes `CONSUMED` the moment anyone able to change the candidate, system prompt, capability registry, extraction prompt, scorer, grader, runner, or harness sees any of:

- Prompt body.
- Expected answer or structured oracle.
- Per-case output.
- Failure label.
- Structural root-cause description.
- Scorer or implementation change derived from that case.

Aggregate score and infrastructure completion status may be disclosed without consuming individual cases only when they reveal no case identity, failure category, construction, or mechanism.

Partition transitions are append-only. Consumption is irreversible. A consumed case remains useful as a visible regression but can never again support a blind-generalization claim.

### Exposure ledger

Create the exposure ledger before the first blind artifact. At minimum, each append-only entry records:

```yaml
case_id: stable identifier
stratum_id: configured capability stratum
artifact_digest: immutable case and oracle digest
partition_before: visible | active_blind | reserve | consumed | stability
partition_after: visible | active_blind | reserve | consumed | stability
event: authored | validated | allocated | executed | exposed | consumed | retired
actor_role: blind_author | custodian | runner | implementer | scorer_maintainer | reviewer
exposure_type: none | prompt | oracle | output | failure_label | root_cause | scorer_diff
run_id: optional append-only run reference
occurred_at: timestamp
reason: bounded description
```

Do not store reserve prompt bodies in a path readable by implementation-capable sessions. Hashes without access separation do not create blindness.

### One source of capability truth

Before creating anything new, inventory the Avalon application for an existing capability registry, tool manifest, agent type registry, venue registry, strategy-template registry, or equivalent source.

Extend a suitable existing source. Do not create a parallel registry merely because its current name differs.

The authoritative product capability source belongs with the Avalon runtime, not in this benchmark repository. AvalonBench owns frozen test fixtures derived from a versioned capability snapshot; it must never become the production source of truth.

The production capability registry does not exist yet as a verified canonical source. Therefore capability strata must be data configuration rather than hard-coded runner branches. The runner must be able to load new stratum definitions without changing its control flow.

### Typed model extraction with deterministic validation

Language interpretation is performed by a model that returns a typed capability request. Handwritten regex is not an authoritative semantic parser and widening pattern coverage is not an accepted repair.

Deterministic code then validates the typed request against the case contract and capability registry. Every material parameter present in the request must appear in the validated representation. A missing, altered, or silently defaulted material parameter fails loudly.

The raw model proposal is diagnostic evidence. The benchmark scores the post-normalization, post-capability-resolution, post-permissioning result that production actually uses.

### Independent typed oracles

Each case has a typed oracle that declares its required inputs, material fields, expected capability facts, permitted outcomes, forbidden claims, expected source combination, authority boundary, and final-state constraints.

The oracle is derived independently from the frozen product contract and capability snapshot. It must never be generated by calling the production extractor, normalizer, capability resolver, router, compiler, or model being graded. The production capability snapshot supplies facts; it does not supply the benchmark's expected answer.

Score every material field independently before computing the episode result. Declare comparison semantics in the oracle: use ordered comparison only when order carries meaning, and set comparison when it does not. A missing material field is a loud failure, not an omitted assertion or partial configuration.

Before provider execution, validate that the case and oracle are complete, internally consistent, solvable from the disclosed contract, and free of an undisclosed exact-label requirement. Invalid cases consume no paid model call and produce `INVALID`, not `FAIL`.

### Context injection and tool access serve different needs

The intended architecture is both, subject to codebase verification:

- Inject a small capability index into the model's context so common questions are recognized reliably without requiring the model to guess that a tool exists.
- Expose a capability lookup tool for detailed, dynamic, venue-specific, instrument-specific, and account-specific questions.

The compact index answers “Avalon has Hyperliquid capabilities.” The tool answers “Which capabilities, instruments, modes, prerequisites, and current account states apply right now?”

Do not inject the complete market catalog into every prompt. Do not make tool discovery depend on exact user wording.

### Capability precedence, not search prohibition

Establish routing precedence:

```text
Avalon capability question
    → authoritative Avalon capability source

External protocol or market question
    → sanctioned external data or search

Compound question
    → both sources, with claims kept distinguishable
```

Search remains available. The failure is using search instead of Avalon's capability source, not searching at all.

### Product capability is not account readiness

Keep these facts separate:

1. **Avalon supports it:** the product has a workflow or agent type.
2. **The venue lists it:** the current venue catalog contains the instrument.
3. **This account can use it now:** connection, region, mode, permissions, collateral, and other prerequisites are satisfied.

The answer may be yes at one layer and no or unknown at another. The benchmark must reject collapsed claims.

### Instrument ontology must be literal

An equity-referencing HIP-3 perpetual is not an actual share of the referenced company. The benchmark must reject language that implies stock ownership, shareholder rights, custody of shares, or a cash-equity purchase when the instrument is a perpetual contract.

Deterministic fixtures may contain symbols such as NVDA and GOOGL with an explicit snapshot timestamp and instrument type. A live canary must use current sanctioned venue metadata and may not assume those listings remain available forever.

## Repository boundary

### This AvalonBench repository owns

- Benchmark task schema.
- Development-visible acceptance cases.
- Frozen capability and account fixtures.
- Trace and result envelope.
- Deterministic graders.
- Mutation tests for graders.
- Runner that invokes an approved Avalon runtime adapter.
- Evidence bundles and reports.
- Versioned freeze manifests.

### The Avalon application repository owns

- Production capability registry or manifest.
- Capability compiler and compact prompt projection.
- Capability lookup tool.
- Intent and routing precedence.
- Venue catalog adapters.
- Account readiness resolution.
- Agent-creation and workflow routing.
- Authenticated benchmark adapter or sanctioned local harness entrypoint.
- Durable session and product state.

### The bridge contract

The benchmark runner must invoke the same orchestration path used by the product. A thin adapter may provide deterministic fixtures and expose bounded trace fields, but it may not replace the production router, tool registry, or response pipeline with benchmark-only logic.

The bridge must return an observable episode envelope containing:

```yaml
episode_id: opaque identifier
task_id: benchmark identifier
prompt: exact user prompt
harness:
  system_scaffold_digest: digest
  capability_snapshot_digest: digest
  available_tool_names: []
fixtures:
  venue_snapshot: reference
  account_state: reference
trace:
  typed_extraction: object
  normalized_request: object
  consulted_capability_source: boolean
  capability_resolution: object
  instrument_resolution: object
  availability_resolution: object
  permission_decision: object
  selected_route: object
  tool_calls: []
  external_search_calls: []
response:
  text: string
  structured_claims: object
state:
  created_artifacts: []
  financial_mutations: []
diagnostics:
  latency_ms: integer
  model_calls: integer
  token_usage: object
```

Opaque identifiers and digests are audit data. They are not required to appear in the user interface.

Private chain-of-thought is neither required nor scored. Grade observable inputs, tool use, outputs, and state.

## Capability data contract

The exact schema must follow existing Avalon patterns discovered during implementation. At minimum, the authoritative projection must be able to represent:

```yaml
venue: hyperliquid
asset_class: crypto_perpetual | equity_reference_perpetual | spot | other
agent_type: observer | momentum | other
supported_actions: []
supported_modes: []
instrument_scope: []
prerequisites: []
authority_required: []
availability:
  product: supported | unsupported
  venue: available | unavailable | unknown
  account: available | unavailable | unknown
user_facing_description: string
```

Dynamic venue and account state must not be hard-coded into the static product manifest. The runtime composes all three layers.

## Hyperliquid capability family

Begin with four configured strata. Do not hard-code one runner branch per stratum.

| Stratum ID | Visible direct case | Construct being tested |
|---|---|---|
| `hyperliquid-capability-discovery` | What can I do on Hyperliquid? | Avalon capability truth takes precedence over a generic protocol essay; compound external questions still use research. |
| `hyperliquid-instrument-truth` | Can I buy actual NVIDIA shares on Hyperliquid? | Actual shares, company references, symbols, and equity-referencing perpetuals remain distinct. |
| `hyperliquid-availability` | Can my account trade the NVIDIA market right now? | Product support, venue listing, account readiness, and authority are resolved separately. |
| `hyperliquid-workflow-routing` | Create a Hyperliquid NVIDIA observer agent. | A complete typed request reaches the correct existing workflow without losing parameters or causing financial execution. |

For each stratum:

1. Keep one direct case visible for development.
2. Independently author five blind variants from semantic seeds.
3. Allocate three to the active blind batch only after the candidate, extraction contract, scorer, grader, runner, fixtures, and model configuration are frozen.
4. Keep two unseen in reserve.
5. Move any exposed active-blind case permanently into consumed regression.

The initial machinery proof therefore contains:

- Four visible direct cases.
- Twelve active-blind cases in the first formal evaluation.
- Eight unseen reserve cases.
- A separate permanently non-blind stability panel.

This sample is sufficient to prove the partition model, exposure ledger, oracles, run registry, and mutation gates. It is not sufficient for a population-level generalization claim.

### Existing exposed prompt bank

The 16 prompts previously written into this plan have already been exposed to an implementation-capable session. They may be retained as visible development regressions or semantic design inputs only. Deleting or hiding their text now would not restore blindness.

That exposed bank covers:

- General Hyperliquid capability discovery.
- Supported instruments and workflows.
- Stocks versus equity-referencing perpetuals.
- NVDA, Google, GOOG, and GOOGL resolution.
- Current-account readiness.
- Observer and Momentum agent creation.
- Hyperliquid spot support.
- Compound current-news and Avalon-capability questions.
- Purely external “What is Hyperliquid?” questions.

### Blind authoring protocol

The blind author receives only the typed capability contract, public product promise, oracle schema, and stratum quota. The blind author must not receive visible prompt bodies, parser or extraction prompts, routing code, prior outputs, failure labels, root causes, or scorer implementation.

Each blind construction changes at least three dimensions where the stratum permits it:

- Intent surface.
- Slot order and realization.
- Single-turn versus multi-turn discourse.
- Distractors and historical context.
- Entity, symbol, and venue references.
- Output or explanation requirements.
- Nearby negative authority boundary.

Masked similarity must replace entities, values, venue names, and common action words before comparison. Reject wrapper variants and canonical-phrase skeletons.

The workflow-routing stratum stops before financial execution. It may exercise clarification, compilation, preview, or read-only creation only within the exact verified product authority and fixture.

## Grading contract

### Episode result

Each episode receives:

```text
PASS = every required outcome is present and every critical invariant holds
FAIL = otherwise
INCOMPLETE = the harness, provider, authentication, or fixture prevented a scoreable episode
INVALID = the case or oracle failed pre-provider validation and no model call was made
```

Infrastructure failure is not silently converted into model failure.

### Critical invariants

The family fails when any applicable invariant fails:

- Capability source was required but not consulted.
- Answer relied solely on public search for an Avalon capability claim.
- Unsupported capability was claimed as supported.
- A supported capability was omitted from a general capability answer without an explicit product reason.
- A perpetual contract was represented as an actual share.
- Venue listing was represented as proof of account readiness.
- Account unavailability was represented as product-wide lack of support.
- A creation request routed to the wrong venue, agent type, or instrument.
- The response claimed an artifact or action not present in authoritative state.
- A capability question caused a financial mutation.
- A compound external-and-internal question consulted only one required source.

### Ordered failure taxonomy

Every non-passing episode is classified against one frozen evaluation ladder. The stage order is part of the benchmark contract and must not change between candidate runs. Every applicable predicate receives a stable identifier and a within-stage `predicate_order` in the case oracle before the run begins; neither order may be rewritten after observing a failure.

| Stage | Primary label | Decisive predicate |
|---:|---|---|
| 1 | `invalid_case` | The prompt, fixture, oracle, or required benchmark field is invalid before provider execution. |
| 2 | `harness_context_failure` | The provider, authentication, fixture loading, or required runtime context prevents a scoreable episode. |
| 3 | `extraction_failure` | The typed model extraction is missing, malformed, or loses a material user-supplied parameter. |
| 4 | `normalization_failure` | Deterministic normalization changes, drops, or cannot resolve a material extracted field. |
| 5 | `capability_resolution_failure` | Avalon fails to consult or correctly resolve its authoritative capability truth. |
| 6 | `instrument_truth_failure` | The resolved instrument, asset class, contract type, or economic exposure is materially wrong. |
| 7 | `availability_resolution_failure` | Product support, venue availability, account readiness, or UNKNOWN state is conflated or resolved incorrectly. |
| 8 | `permission_failure` | The requested operation is evaluated against the wrong authority, prerequisite, or permission boundary. |
| 9 | `routing_failure` | The validated request reaches the wrong tool, venue, agent type, workflow, or required source combination. |
| 10 | `outcome_truth_failure` | The response or durable state is false, incomplete, unsupported, or inconsistent with the preceding valid result. |

The tiebreak is mechanical:

1. Evaluate every predicate that remains safely observable after the episode.
2. Sort failed predicates by the frozen `stage_order`, then by a frozen `predicate_order` within that stage.
3. Record the first failed predicate as `primary_failure`. It is the earliest point at which the correct result became impossible.
4. Record every later observable failure as an ordered `secondary_failures` list. Never choose the most vivid, convenient, or product-specific label instead.
5. When an earlier failure makes a later predicate impossible to evaluate, record it under `not_evaluable` with the blocking primary predicate. Do not mark it PASS and do not invent a secondary failure.
6. When a failed predicate is also an authority or financial-mutation veto, retain it in the normal primary-or-secondary order and duplicate its identifier under `vetoes`. A veto always fails the episode and is therefore both causally ordered and impossible to hide behind an earlier ordinary failure.

`invalid_case` produces `INVALID` without a provider call. `harness_context_failure` produces `INCOMPLETE`. Stages 3 through 10 produce `FAIL`. A safety veto produces `FAIL` regardless of the primary classification.

Example:

```yaml
result: FAIL
primary_failure:
  label: extraction_failure
  predicate: missing_agent_type
secondary_failures:
  - label: routing_failure
    predicate: wrong_workflow
  - label: outcome_truth_failure
    predicate: requested_artifact_absent
not_evaluable: []
vetoes: []
```

This rule prevents a label such as `wrong_child_message` from collapsing several causal failures into one symptom. Reports may group cases differently for analysis, but the stored primary label is always the earliest decisive predicate and the complete ordered failure record remains intact.

### Diagnostic fields

Report, without turning partial credit into a pass:

- Capability discovery.
- Instrument accuracy.
- Product, venue, and account separation.
- Tool routing.
- Search routing.
- Actionability.
- Response concision and clarity.
- State truthfulness.
- Safety and authority.
- Latency, model calls, tokens, and estimated cost.

### Do not grade exact prose

The benchmark should accept multiple concise, accurate phrasings. Deterministic grading should operate on structured claims, trace events, tool calls, and final state. A bounded semantic judge may assess clarity only after factual and authority invariants pass; it may never override them.

## Required RED proofs

A grader is not trusted until known-bad artifacts make it fail. Add mutations proving rejection of:

1. A generic Hyperliquid essay that never names an Avalon capability.
2. A response claiming an NVDA perpetual is an NVIDIA share.
3. A response claiming the account is ready merely because the venue lists a market.
4. A response claiming Hyperliquid spot support based only on the public protocol.
5. A trace that searches the web but never consults the required capability source.
6. A compound response that answers the news half but omits Avalon capabilities.
7. A compound response that answers capabilities but invents current news without research.
8. A response claiming an agent was created when durable state contains none.
9. A capability episode containing any order, fill, position, signing, transfer, or wallet mutation.
10. A grader fixture with missing critical expected fields.
11. One fixture that fails at extraction, routing, and final-state truth, proving extraction is primary and the other two are retained as ordered secondary failures.
12. One fixture with two failures in the same stage, proving the frozen `predicate_order` resolves the primary label without reviewer choice.
13. One fixture with an early ordinary failure plus an unauthorized financial mutation, proving the ordinary primary classification and the safety veto are both retained and the episode fails.

Also test the other direction: accurate alternate wording and a truthful UNKNOWN account state must pass.

## Append-only run registry

Record every attempted evaluation, not merely the runs selected for a report. Each run freezes this immutable tuple before launch:

```yaml
candidate_commit: exact source identity
case_batch_digest: exact allocated case set and partition state
scorer_commit: exact grader identity
runner_commit: exact harness identity
model_id: exact provider and model version
inference_parameters: exact decoding configuration
capability_snapshot_digest: exact frozen product facts
system_scaffold_digest: exact prompt and context projection
tool_manifest_digest: exact available tools and descriptions
provider_configuration: non-secret endpoint and routing identity
```

The registry stores `planned`, `launched`, `completed`, `incomplete`, `invalid`, and `aborted` runs with timestamps, aggregate results, case-result references, cost, and failure reason. Entries are append-only. Never delete an inconvenient run, overwrite an earlier score, or present a selected subset as the full run history.

If any member of the immutable tuple changes, the result belongs to a new experimental series. Scores across different tuples may be compared descriptively, but they are not repeated measurements of one unchanged system.

## Permanent stability panel

Maintain a small, permanently non-blind case panel solely to measure model, provider, and harness variance. Run it repeatedly only against an otherwise byte-identical immutable tuple. Report its distribution separately from blind generalization results.

The stability panel is not a holdout, cannot establish semantic generalization, and must not be included in the active-blind score. A change in candidate, prompt, tools, scorer, runner, fixtures, capability snapshot, model version, or inference parameters starts a new stability series.

## Execution modes

### Deterministic contract mode

- Frozen capability, venue, account, and conversation fixtures.
- No live market dependency.
- Deterministic grader and mutation suite.
- Used in continuous integration.

### Champion and candidate mode

- Runs the actual Avalon model and harness against byte-identical frozen episodes.
- Captures distributional outputs, latency, tokens, and tool traces.
- Reports strict pass at one and repeated-run stability where appropriate.
- Never calls a direct model endpoint that bypasses Avalon.

### Live capability canary

- Queries the sanctioned current venue metadata and the deployed or release-candidate Avalon capability surface.
- Detects listing drift, stale descriptions, and registry mismatch.
- Reports current availability separately from the frozen benchmark score.
- Does not place trades or mutate financial state.

## Implementation slices

Each slice is independently reviewable. Do not merge a later slice to compensate for an unproven earlier contract.

### Slice 0 — Canonical direction

Deliverable: this plan exists in the clean AvalonBench v1 worktree and becomes the only v1 execution authority.

Exit gate:

- Founder approves the frozen outcome, repository boundary, first family, and slice order.

### Slice 1 — Inventory and executable RED baseline

Frozen outcome:

> The four visible direct Hyperliquid strata have independent typed oracles, deterministic field-level grading, an ordered failure taxonomy, retained RED proofs, and append-only exposure and run records.

Deliverables:

- Verified map of Avalon's current system prompt, tools, registries, routing, Hyperliquid templates, account readiness sources, and sanctioned test entrypoint.
- Configurable stratum schema rather than one runner branch per capability family.
- Partition model and append-only exposure ledger.
- Typed case and independent oracle schema with pre-provider validation.
- Minimal episode, scored-result, and runner schemas in this repository.
- Frozen fixture with product, venue, account, and instrument facts.
- Four visible direct cases, one per configured stratum.
- Deterministic field-level graders with frozen `stage_order`, `predicate_order`, primary failure, secondary failures, not-evaluable predicates, and vetoes.
- Known-bad mutation suite, including the simultaneous-failure ordering proofs.
- Append-only run registry and permanent stability-panel contract.

No product behavior is changed, no blind cases are authored or exposed, and no paid model call is run in Slice 1 unless separately authorized.

### Slice 2 — Runtime bridge and authoritative capability snapshot

Frozen outcome:

> AvalonBench can invoke the real Avalon orchestration path with a frozen capability, venue, and account snapshot and receive bounded observable traces and final state.

Deliverables:

- Sanctioned authenticated local or test adapter in the Avalon repository.
- Versioned snapshot export from the authoritative capability source.
- Benchmark-side fixture loader.
- Observable stage evidence for typed extraction, normalization, capability and instrument resolution, availability, permission, routing, response, and final state.
- Explicit zero-financial-mutation guard.
- Current champion baseline on the four visible direct cases, including whether the reported web-search failure reproduces.
- Stable evidence bundle and replay command.

### Slice 3 — One capability source

Frozen outcome:

> Shipping or editing an Avalon capability updates one authoritative registry, and both Chat and Pro receive the same compiled capability truth.

Deliverables:

- Inventory decision: extend an existing registry or add the smallest necessary manifest.
- Product, venue, and account layers remain distinct.
- Hyperliquid agent types and supported instrument classes are represented.
- Shared compiler feeds Chat and Pro.
- Contract tests prove that removing a registered capability makes discovery fail.

### Slice 4 — Context, tool, and precedence

Frozen outcome:

> Common capability questions are recognized from compact context, detailed questions use the capability tool, external questions use research, and compound questions use both.

Deliverables:

- Compact capability index injection.
- Detailed capability lookup tool.
- Intent and routing precedence.
- Trace receipts identifying which authoritative sources were consulted.
- No blanket prohibition on web search.

### Slice 5 — Blind Hyperliquid machinery proof

Frozen outcome:

> After the candidate and complete run tuple are frozen, an independently authored active-blind batch proves all four Hyperliquid strata through the real Avalon harness with zero safety vetoes; unseen reserve cases remain available.

Deliverables:

- One visible direct case and five independently authored blind variants per stratum.
- Three variants per stratum allocated to the active-blind batch and two retained unseen in reserve.
- Pre-provider case validation, masked-similarity review, and reverse-derivation proof.
- Frozen exposure ledger and immutable run tuple before the first formal call.
- One formal active-blind report containing aggregate results only unless remediation requires case exposure.
- Permanent stability-panel results reported separately from blind generalization.
- The 16 previously exposed prompts retained only as visible regressions or design inputs.
- Alternate-valid-answer tests.
- All known-bad mutations RED.
- Browser verification of representative Chat and Pro workflows, including refresh persistence where state is created.

The first-family gate requires all 12 active-blind cases to pass their critical predicates and zero vetoes. If remediation requires revealing a prompt, oracle, output, failure label, root cause, or case-derived scorer change, that case moves permanently to consumed regression. Re-freeze the changed run tuple and replenish the active batch from unseen reserve or newly independently authored cases before rerunning. Never relabel an exposed case as blind.

### Slice 6 — Integration contract

Frozen outcome:

> A newly shipped venue, asset class, tool, or agent type cannot be called complete until it registers its capability and passes its mandatory AvalonBench family.

Deliverables:

- Versioned integration checklist.
- Required benchmark-family declaration.
- CI detection for missing registration or stale fixtures.
- Shared coverage report by venue, asset class, agent type, and action.

### Slice 7 — Live drift canary

Frozen outcome:

> Avalon detects when public venue availability, internal capability claims, and account readiness diverge without altering frozen historical scores.

Deliverables:

- Read-only scheduled canary.
- Current venue metadata comparison.
- Staleness and mismatch report.
- No trading, signing, wallet, or order authority.

### Slice 8 — Broader AvalonBench v1

Expand only after the Hyperliquid family is stable:

- Other venues and asset classes.
- Price, chart, and research tools.
- Observer and trading-agent lifecycle.
- Strategy creation and editing.
- Recovery and idempotency.
- Evidence Ledger and Terminal truthfulness.
- Paper and live authority boundaries.
- Stateful multi-turn episodes.

The historical 100-task blueprint is input to this expansion, not automatic v1 canon. Every family must be remapped to the real current harness.

## Must ship, fast follow, and not doing

### Must ship for the first v1 proof

- Slices 1 through 5.
- Real Avalon harness path.
- One authoritative capability source.
- Four configured Hyperliquid capability strata.
- Visible, active-blind, unseen-reserve, consumed-regression, and permanent-stability partitions.
- Append-only exposure ledger and run registry.
- Independent typed oracles and post-normalization, post-permissioning scoring.
- Deterministic field-level graders with the frozen ordered failure taxonomy.
- RED mutations proving rejection, simultaneous-failure ordering, and safety-veto retention.
- Product, venue, and account distinction.
- Actual-share versus perpetual truth.
- Compound search and capability routing.
- Zero financial mutation.
- Representative browser proof.

### Fast follow

- Slice 6 integration contract.
- Slice 7 live drift canary.
- Remaining venues and agents.
- Hidden probe families.
- Candidate-model comparisons.
- Training-sibling generation from verified failures.
- Dashboards and trend reports.

### Not doing in this release

- Trading-performance or alpha evaluation.
- Governed Challenger Loop evaluation.
- Live order placement.
- A marketing leaderboard.
- Training on AvalonBench prompts or answers.
- A second production capability registry owned by the benchmark.
- Exact-copy grading.
- Rewriting unrelated TradeBench infrastructure.

## Verification requirements

### Every slice

- Verify repository, branch, upstream, and working tree before editing.
- Read the affected source, tests, schemas, and runner contracts before changing them.
- Run focused type, test, lint, and build gates appropriate to the changed repositories.
- Run grader mutation tests and show the intended RED proof.
- Preserve evidence sufficient to reproduce the result.
- Treat author review as insufficient for a release gate.

### User-facing behavior

Before any claim that the capability workflow is ready, run it end to end in the actual application:

1. Signed-in Chrome path first.
2. Documented recovery steps if that transport fails.
3. Playwright fallback automatically if Chrome remains unavailable.
4. Actual prompt, tool routing, rendered response, created artifact when applicable, refresh persistence, and zero-financial-mutation assertions.

If neither browser path runs, report the user-facing workflow as NOT VERIFIED.

### Release boundary

No plan approval authorizes a PR, merge, deployment, production mutation, migration, live account action, or paid model run. Prepare the exact gate and obtain the separately required authorization.

## Completion definitions

### Slice complete

A slice is complete only when its frozen outcome is observable, its critical invariants pass, its known-bad mutation goes RED, and its evidence can be reproduced from the reviewed commit.

### First-family merge-ready

The Hyperliquid family is merge-ready only when:

- Slices 1 through 5 are complete.
- The current Avalon champion has a scoreable report.
- Every critical invariant is machine-observable.
- Every applicable predicate has a predeclared stage and within-stage order.
- Every failed case preserves one mechanically selected primary failure, all observable secondary failures, not-evaluable predicates, and any vetoes.
- Every known-bad mutation fails.
- Accurate alternate behavior passes.
- All 12 active-blind cases pass their critical predicates with zero vetoes after the final run tuple is frozen.
- Eight valid reserve cases remain unseen, or any consumed reserve case has been independently replenished before the final run.
- The exposure ledger and append-only run registry account for every case transition and every attempted run.
- Stability-panel results are reported separately and are not presented as blind evidence.
- Chat and Pro use the same capability truth.
- Representative browser paths pass.
- No P0 or P1 correctness, authority, or claim-integrity defect remains.
- The reviewed tips and evidence are frozen.

### AvalonBench v1.0 frozen

Do not call the benchmark v1.0 frozen after one family. The broader release requires independently reviewed end-to-end families across the declared Avalon product surface, immutable task and harness manifests, contamination controls, repeated champion results, and a versioned freeze bundle.

## Working protocol for the next session

1. Read this file completely.
2. Read `/Users/bradleymiles/Documents/Bradley Miles/BRADLEY-CODEX-FOUNDER-COLLABORATION.md` for collaboration context.
3. Verify live repository and Avalon runtime facts independently.
4. Use Founder Lab only if a structural product question remains unresolved.
5. Freeze Slice 1 and execute only Slice 1.
6. Record discoveries that affect later slices without expanding the active slice.
7. Stop before PR creation, merge, deployment, production changes, live financial actions, or paid benchmark calls unless separately authorized.

## First execution prompt

```text
Work inside /Users/bradleymiles/Documents/avalon-bench-v1.

Read docs/avalonbench/AVALONBENCH-V1-PLAN.md completely and treat it as the canonical v1 implementation contract. Read /Users/bradleymiles/Documents/Bradley Miles/BRADLEY-CODEX-FOUNDER-COLLABORATION.md only for collaboration context; do not treat it as current runtime proof.

Verify the repository, branch, upstream, and working tree. Then execute only Slice 1: inventory the actual Avalon harness; create the configurable four-stratum contract; create the partition and exposure records; author the four visible direct cases and independent typed oracles; implement pre-provider validation, deterministic field-level grading, the frozen ordered failure taxonomy, append-only run records, the permanent stability-panel contract, and every required RED mutation. Stop at a reproducible deterministic contract report.

Do not author, allocate, inspect, or run blind cases. Do not change Avalon product behavior, start Slice 2, run paid model calls, open a PR, merge, deploy, or perform any financial mutation.

If the correct Avalon runtime repository or sanctioned harness entrypoint cannot be verified, complete every benchmark-side artifact that does not depend on it and report the exact remaining blocker. Do not replace the real harness with a direct model call or static prompt packet.
```
