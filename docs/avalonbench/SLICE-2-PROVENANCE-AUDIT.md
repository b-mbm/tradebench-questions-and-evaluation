# AvalonBench v1 Slice 2 provenance audit

Date: 2026-09-05

Status: historical incumbent defect audited and preserved; repaired public-Chat release evidence is recorded in `reports/avalon-demo-16/avalon-demo-16-before-after-2026-09-06.md`.

This audit applies to benchmark commit
`bec63cb25141afce02b13265c17a7b1e989431af`, Avalon runtime commit
`62930769584596aa6212872cfabe862046e82cab`, and retained run
`avalonbench-runtime-2026-09-05T19-38-36-482Z-4d04feb3`.

## Finding

The retained run is not whole-system evidence. Its adapter calls the exported
`buildAgentStream` function directly. That is a real inner production function,
but it is below two material request boundaries:

- `apps/aix-frontend/app/api/chat/route.ts#POST`, which owns public request
  validation, Avalon mode resolution, identity and history handling,
  deterministic ownership, unified routing, frontend tool planning, the normal
  `buildSystemPrompt` path, frontend orchestration tools, response sanitization,
  and Chat response-path selection.
- `apps/api/src/app/api/v1/agents/typed-run/route.ts#POST`, which owns user
  authentication, rate limiting, optional agent classification, conversational
  setup selection, production `buildToolSet` selection, active setup context,
  and the normal typed-run response boundary.

The adapter also replaces the incumbent context with a benchmark-specific
capability snapshot and answer-key output contract, and exposes only
`commission_observer`. Those are controlled-experiment changes, not the actual
current Avalon Chat configuration.

The repaired official baseline must enter through the public Chat POST handler.
Any local safety/authentication seam may remove persistence and financial
authority, but it may not inject capability answers, expected routes, expected
claims, or a benchmark-only answer schema. Production stages that still do not
emit evidence will be recorded as `NOT_EVALUABLE`.

## Incumbent scored-field provenance matrix

The category names below are the frozen categories requested for the repair.
Every scored predicate in `src/avalonbench/contract.ts` is covered by one row.

| Scored field or predicate family | Incumbent source | Classification | Whole-system use |
|---|---|---|---|
| `taskId`; `episode_task_bound` | Exact visible case selected by the benchmark client and echoed by the adapter | Copied from the benchmark oracle or expected request | Input-binding evidence only; never Avalon behavior |
| `prompt`; `episode_prompt_bound` | Exact visible prompt supplied by the benchmark client and echoed by the adapter | Copied from the benchmark oracle or expected request | Input-binding evidence only; never Avalon behavior |
| `harness.systemScaffoldDigest`; `system_scaffold_bound` | Digest of the benchmark-injected API prompt | Supplied as a deterministic external fixture | Invalid for incumbent Chat; valid only for the controlled experiment |
| `harness.capabilitySnapshotDigest`; `capability_snapshot_digest_bound` | Digest of the frozen snapshot export | Supplied as a deterministic external fixture | Fixture binding only |
| `harness.availableToolNames`; `tool_manifest_bound` | Adapter allowlist containing only `commission_observer` | Supplied as a deterministic external fixture | Invalid as the incumbent tool manifest |
| `harness.contextComplete`; `harness_context_complete` | Hard-coded `true` in the adapter contract | Unobservable in the current runtime | Must not pass until the assembled boundary is proven |
| `fixtures.capabilitySnapshot`; `capability_fixture_bound` | Frozen fixture reference | Supplied as a deterministic external fixture | Label only as external test input |
| `fixtures.venueSnapshot`; `venue_fixture_bound` | Frozen fixture reference | Supplied as a deterministic external fixture | Label only as external test input |
| `fixtures.accountState`; `account_fixture_bound` | Frozen fixture reference | Supplied as a deterministic external fixture | Label only as external test input |
| `trace.typedExtraction.*`; every `*_extracted` predicate | Direct assignment from request `typedRequest` | Copied from the benchmark oracle or expected request | Invalid; must be absent and `NOT_EVALUABLE` unless production emits it |
| `trace.normalizedRequest.*`; every `*_normalized` predicate | Direct assignment from request `typedRequest` | Copied from the benchmark oracle or expected request | Invalid; must be absent and `NOT_EVALUABLE` unless production emits it |
| `trace.consultedCapabilitySource`; `capability_source_consulted` | Hard-coded `true` after the adapter itself loaded a fixture | Supplied as a deterministic external fixture | Invalid as proof Avalon consulted a capability source |
| `trace.capabilityResolution.*`; `supported_agent_types_resolved`, `supported_asset_classes_resolved`, `product_availability_resolved`, `product_support_resolved`, `observer_capability_supported` | Computed from the frozen fixture before/after model execution, independent of model behavior | Supplied as a deterministic external fixture | Invalid as observed runtime resolution |
| `trace.instrumentResolution.*`; `nvda_symbol_resolved`, `nvda_asset_class_resolved`, `nvda_not_actual_shares_resolved`, `nvda_venue_available`, `routing_nvda_symbol_resolved` | Computed from the frozen venue fixture, independent of model behavior | Supplied as a deterministic external fixture | Invalid as observed runtime resolution |
| `trace.availabilityResolution.*`; `account_readiness_unknown`, `availability_layers_separate` | Computed from frozen product, venue, and account fixtures | Supplied as a deterministic external fixture | Invalid as observed runtime resolution |
| `trace.permissionDecision.outcome`; `read_only_authority_enforced`, `observer_preview_permitted` | Chosen from the expected request's `requestedAction` | Copied from the benchmark oracle or expected request | Invalid; rejected and successful runtime calls remain usable evidence |
| `trace.selectedRoute.tool`; `observer_route_selected` | First successful tool call, or `none`, after execution | Independently derived after execution | Usable if its source tool-call list is retained |
| `trace.toolCalls`; `observer_tool_called` | `TypedAgentExecutionResult.toolsCalled` from the real inner executor | Actually observed from the production execution path | Genuine historical evidence, but not proof of frontend route selection |
| `trace.externalSearchCalls` | Hard-coded empty array | Unobservable in the current runtime | Must not prove absence of search |
| `response.text` | Actual inner model output after removing the injected claims block | Actually observed from the production execution path | Genuine response evidence for the controlled experiment |
| `response.structuredClaims.*`; all `*_claimed`, `permitted_outcome_claimed`, and forbidden-claim predicates | Model-emitted JSON required by a benchmark-only prompt; observer fallback is adapter-derived | Actually observed from the production execution path only under benchmark-specific prompt injection | Invalid for incumbent scoring; ordinary output must use an independent post-execution extractor or be `NOT_EVALUABLE` |
| `state.createdArtifacts`; `observer_preview_artifact_present`, `created_artifact_types_allowed` | `TypedAgentExecutionResult.artifacts` | Actually observed from the production execution path | Genuine inner-executor final-state evidence |
| `state.financialMutations`; `no_financial_mutation` | Hard-coded empty array | Unobservable in the current runtime | Invalid; derive from successful calls/state and retain rejected attempts |
| `diagnostics.latencyMs` | Adapter wall-clock measurement | Independently derived after execution | Usable diagnostic |
| `diagnostics.modelCalls` | `onProviderCall` callback count | Actually observed from the production execution path | Usable inner-call count |
| `diagnostics.tokenUsage` | Production execution result | Actually observed from the production execution path | Usable diagnostic |

## Required repaired provenance contract

Each episode must carry a provenance record for every path consumed by a
predicate. Allowed values are:

- `production_observation`
- `post_execution_derivation`
- `external_fixture`
- `oracle_or_expected_copy`
- `unobservable`

`oracle_or_expected_copy` is forbidden for any actual/trace/response/state
predicate. `external_fixture` may satisfy fixture-binding predicates only. An
`unobservable` predicate receives `NOT_EVALUABLE` with its recorded reason. A
fixture-derived fact cannot satisfy a production-observation predicate.

The official mode is `incumbent_baseline`. It uses the actual current system
prompt, context construction, tool selection, routing, model, and response
pipeline with no benchmark capability or answer-schema injection. A future
`controlled_context_experiment` is a different experimental series and cannot
be reported as the incumbent score.

## Historical conclusion boundary

The retained run's four provider responses, actual tool-call list, actual
created-artifact list, provider-call count, latency, and token usage remain
historical evidence for the inner controlled experiment. Its 1/4 score,
extraction/normalization fields, capability/instrument/availability resolution,
permission outcome, claimed absence of external search, and claimed absence of
financial mutation do not support whole-system conclusions.

## Founder release-override closure

The exposed 16-prompt release series enters through
`apps/aix-frontend/app/api/chat/route.ts#POST` with the normal anonymous Chat
context, production system prompt, Avalon 1 Fast route, frontend tool registry,
response pipeline, and no benchmark-specific prompt content. Its final run is
`avalon-demo-16-release_final_v6-2026-09-06T18-19-43-347Z-6f4bf121` at exact runtime commit
`1cc70e336c35a46c66130d304bda60cd39cabc1f`.

That run scores only visible answers, nonce-authenticated tool/workflow events,
response paths, previews, and directly queried isolated financial state. Its
mechanical scorecard separately labels 35 human semantic judgments and binds
their exact evidence spans without presenting those judgments as runtime trace.
Hidden typed
extraction, normalization, capability resolution, and permission predicates
remain `NOT_EVALUABLE`. The exact upstream provider-call count also remains
`NOT_EVALUABLE` because the public path emits no durable per-call receipt.
