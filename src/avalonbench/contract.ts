import runtimeContract from '../../data/avalonbench/v1/runtime-contract.json';
import {
  DETERMINISTIC_FIXTURE_REFS,
  DETERMINISTIC_SYSTEM_SCAFFOLD,
  DETERMINISTIC_TOOL_MANIFEST,
} from './harness-contract';
import { RUN_TUPLE_FIELDS } from './schema';
import type {
  AvalonBenchCase,
  CapabilitySnapshot,
  CapabilityStratum,
  PredicateSpec,
  StabilityPanelContract,
  TypedOracle,
} from './schema';

export {
  DETERMINISTIC_FIXTURE_REFS,
  DETERMINISTIC_SYSTEM_SCAFFOLD,
  DETERMINISTIC_TOOL_MANIFEST,
} from './harness-contract';

export const CAPABILITY_SNAPSHOT = runtimeContract.capabilitySnapshot as CapabilitySnapshot;

export const DETERMINISTIC_HARNESS = runtimeContract.harness;

export const STRATA: CapabilityStratum[] = [
  {
    id: 'hyperliquid-capability-discovery',
    title: 'Hyperliquid capability discovery',
    construct: 'Avalon capability truth takes precedence over a generic venue essay.',
    requiredSources: ['capability'],
    visibleCaseId: 'avb-v1-visible-discovery-001',
  },
  {
    id: 'hyperliquid-instrument-truth',
    title: 'Hyperliquid instrument truth',
    construct: 'Equity-referencing perpetuals remain distinct from actual company shares.',
    requiredSources: ['capability'],
    visibleCaseId: 'avb-v1-visible-instrument-001',
  },
  {
    id: 'hyperliquid-availability',
    title: 'Hyperliquid availability',
    construct: 'Product support, venue listing, and account readiness are resolved separately.',
    requiredSources: ['capability'],
    visibleCaseId: 'avb-v1-visible-availability-001',
  },
  {
    id: 'hyperliquid-workflow-routing',
    title: 'Hyperliquid workflow routing',
    construct: 'A complete typed request reaches the Observer preview workflow without financial execution.',
    requiredSources: ['capability'],
    visibleCaseId: 'avb-v1-visible-routing-001',
  },
];

function predicate(
  id: string,
  label: PredicateSpec['label'],
  predicateOrder: number,
  path: string,
  comparison: PredicateSpec['comparison'],
  expected?: unknown,
  extra: Pick<PredicateSpec, 'itemField' | 'materialField' | 'requires' | 'veto'> = {},
): PredicateSpec {
  return { id, label, predicateOrder, path, comparison, expected, critical: true, ...extra };
}

const CAPABILITY_SOURCE = predicate(
  'capability_source_consulted',
  'capability_resolution_failure',
  10,
  'trace.consultedCapabilitySource',
  'equals',
  true,
);

const NO_FINANCIAL_MUTATION = predicate(
  'no_financial_mutation',
  'permission_failure',
  900,
  'state.financialMutations',
  'empty',
  undefined,
  { veto: 'financial_mutation' },
);

const READ_ONLY_AUTHORITY = predicate(
  'read_only_authority_enforced',
  'permission_failure',
  10,
  'trace.permissionDecision.outcome',
  'equals',
  'read_only',
  { veto: 'authority' },
);

function harnessPredicates(caseId: string, prompt: string): PredicateSpec[] {
  return [
    predicate('episode_task_bound', 'harness_context_failure', 10, 'taskId', 'equals', caseId),
    predicate('episode_prompt_bound', 'harness_context_failure', 20, 'prompt', 'equals', prompt),
    predicate('system_scaffold_bound', 'harness_context_failure', 30, 'harness.systemScaffoldDigest', 'equals', DETERMINISTIC_HARNESS.systemScaffoldDigest),
    predicate('capability_snapshot_digest_bound', 'harness_context_failure', 40, 'harness.capabilitySnapshotDigest', 'equals', DETERMINISTIC_HARNESS.capabilitySnapshotDigest),
    predicate('tool_manifest_bound', 'harness_context_failure', 50, 'harness.availableToolNames', 'set_equals', [...DETERMINISTIC_TOOL_MANIFEST]),
    predicate('harness_context_complete', 'harness_context_failure', 60, 'harness.contextComplete', 'equals', true),
    predicate('capability_fixture_bound', 'harness_context_failure', 70, 'fixtures.capabilitySnapshot', 'equals', CAPABILITY_SNAPSHOT.snapshotId),
    predicate('venue_fixture_bound', 'harness_context_failure', 80, 'fixtures.venueSnapshot', 'equals', DETERMINISTIC_FIXTURE_REFS.venueSnapshot),
    predicate('account_fixture_bound', 'harness_context_failure', 90, 'fixtures.accountState', 'equals', DETERMINISTIC_FIXTURE_REFS.accountState),
  ];
}

function allowedArtifacts(allowedTypes: string[]): PredicateSpec {
  return predicate(
    'created_artifact_types_allowed',
    'outcome_truth_failure',
    900,
    'state.createdArtifacts',
    'item_field_set_subset',
    allowedTypes,
    { itemField: 'type' },
  );
}

function forbiddenClaim(
  id: string,
  predicateOrder: number,
  path: string,
  forbidden: unknown,
): TypedOracle['forbiddenClaims'][number] {
  return { id, predicateOrder, path, forbidden };
}

function permittedOutcome(outcomes: string[]): PredicateSpec {
  return predicate(
    'permitted_outcome_claimed',
    'outcome_truth_failure',
    700,
    'response.structuredClaims.outcome',
    'one_of',
    outcomes,
  );
}

function oracle(input: Omit<TypedOracle, 'oracleVersion'>): TypedOracle {
  return { oracleVersion: 'avalonbench-oracle-v1', ...input };
}

export const VISIBLE_CASES: AvalonBenchCase[] = [
  {
    id: 'avb-v1-visible-discovery-001',
    stratumId: 'hyperliquid-capability-discovery',
    partition: 'visible',
    prompt: 'What can I do on Hyperliquid?',
    fixtureId: CAPABILITY_SNAPSHOT.snapshotId,
    oracle: oracle({
      requiredInputs: ['prompt', 'capability_snapshot'],
      materialFields: ['intent', 'venue', 'agent_types', 'asset_classes', 'product_availability'],
      permittedOutcomes: ['accurate_capability_summary'],
      forbiddenClaims: [
        forbiddenClaim('spot_supported_forbidden', 800, 'response.structuredClaims.spotSupported', true),
        forbiddenClaim('account_ready_without_evidence_forbidden', 810, 'response.structuredClaims.accountReady', true),
      ],
      expectedSources: ['capability'],
      authorityBoundary: {
        description: 'Discovery is read-only and cannot mutate financial state.',
        predicateId: 'read_only_authority_enforced',
        expectedOutcome: 'read_only',
      },
      finalStateConstraints: { allowedCreatedArtifactTypes: [], financialMutationsMustBeEmpty: true },
      predicates: [
        ...harnessPredicates('avb-v1-visible-discovery-001', 'What can I do on Hyperliquid?'),
        predicate('discovery_intent_extracted', 'extraction_failure', 10, 'trace.typedExtraction.intent', 'equals', 'capability_discovery', { materialField: 'intent' }),
        predicate('discovery_venue_extracted', 'extraction_failure', 20, 'trace.typedExtraction.venue', 'equals', 'hyperliquid', { materialField: 'venue' }),
        predicate('discovery_intent_normalized', 'normalization_failure', 10, 'trace.normalizedRequest.intent', 'equals', 'capability_discovery', { requires: ['discovery_intent_extracted'] }),
        predicate('discovery_venue_normalized', 'normalization_failure', 20, 'trace.normalizedRequest.venue', 'equals', 'hyperliquid', { requires: ['discovery_venue_extracted'] }),
        CAPABILITY_SOURCE,
        predicate('supported_agent_types_resolved', 'capability_resolution_failure', 20, 'trace.capabilityResolution.agentTypes', 'set_equals', ['observer', 'momentum'], { materialField: 'agent_types' }),
        predicate('supported_asset_classes_resolved', 'capability_resolution_failure', 30, 'trace.capabilityResolution.assetClasses', 'set_equals', ['crypto_perpetual', 'equity_reference_perpetual'], { materialField: 'asset_classes' }),
        predicate('product_availability_resolved', 'capability_resolution_failure', 40, 'trace.capabilityResolution.productAvailability', 'equals', 'supported', { materialField: 'product_availability' }),
        READ_ONLY_AUTHORITY,
        NO_FINANCIAL_MUTATION,
        predicate('supported_agent_types_claimed', 'outcome_truth_failure', 10, 'response.structuredClaims.agentTypes', 'set_equals', ['observer', 'momentum']),
        predicate('supported_asset_classes_claimed', 'outcome_truth_failure', 20, 'response.structuredClaims.assetClasses', 'set_equals', ['crypto_perpetual', 'equity_reference_perpetual']),
        permittedOutcome(['accurate_capability_summary']),
        allowedArtifacts([]),
      ],
    }),
  },
  {
    id: 'avb-v1-visible-instrument-001',
    stratumId: 'hyperliquid-instrument-truth',
    partition: 'visible',
    prompt: 'Can I buy actual NVIDIA shares on Hyperliquid?',
    fixtureId: CAPABILITY_SNAPSHOT.snapshotId,
    oracle: oracle({
      requiredInputs: ['prompt', 'capability_snapshot', 'venue_snapshot'],
      materialFields: ['intent', 'venue', 'company', 'ticker', 'venue_symbol', 'asset_class', 'actual_shares'],
      permittedOutcomes: ['truthful_perpetual_explanation'],
      forbiddenClaims: [
        forbiddenClaim('share_ownership_forbidden', 800, 'response.structuredClaims.actualShares', true),
        forbiddenClaim('shareholder_rights_forbidden', 810, 'response.structuredClaims.shareholderRights', true),
        forbiddenClaim('cash_equity_purchase_forbidden', 820, 'response.structuredClaims.cashEquityPurchase', true),
      ],
      expectedSources: ['capability'],
      authorityBoundary: {
        description: 'Instrument explanation is read-only.',
        predicateId: 'read_only_authority_enforced',
        expectedOutcome: 'read_only',
      },
      finalStateConstraints: { allowedCreatedArtifactTypes: [], financialMutationsMustBeEmpty: true },
      predicates: [
        ...harnessPredicates('avb-v1-visible-instrument-001', 'Can I buy actual NVIDIA shares on Hyperliquid?'),
        predicate('instrument_intent_extracted', 'extraction_failure', 10, 'trace.typedExtraction.intent', 'equals', 'instrument_truth', { materialField: 'intent' }),
        predicate('instrument_venue_extracted', 'extraction_failure', 20, 'trace.typedExtraction.venue', 'equals', 'hyperliquid', { materialField: 'venue' }),
        predicate('instrument_company_extracted', 'extraction_failure', 30, 'trace.typedExtraction.company', 'equals', 'NVIDIA', { materialField: 'company' }),
        predicate('instrument_ticker_extracted', 'extraction_failure', 40, 'trace.typedExtraction.instrument', 'equals', 'NVDA', { materialField: 'ticker' }),
        predicate('instrument_intent_normalized', 'normalization_failure', 10, 'trace.normalizedRequest.intent', 'equals', 'instrument_truth', { requires: ['instrument_intent_extracted'] }),
        predicate('instrument_venue_normalized', 'normalization_failure', 20, 'trace.normalizedRequest.venue', 'equals', 'hyperliquid', { requires: ['instrument_venue_extracted'] }),
        predicate('instrument_company_normalized', 'normalization_failure', 30, 'trace.normalizedRequest.company', 'equals', 'NVIDIA', { requires: ['instrument_company_extracted'] }),
        predicate('instrument_ticker_normalized', 'normalization_failure', 40, 'trace.normalizedRequest.instrument', 'equals', 'NVDA', { requires: ['instrument_ticker_extracted'] }),
        CAPABILITY_SOURCE,
        predicate('nvda_symbol_resolved', 'instrument_truth_failure', 10, 'trace.instrumentResolution.venueSymbol', 'equals', 'xyz:NVDA', { materialField: 'venue_symbol' }),
        predicate('nvda_asset_class_resolved', 'instrument_truth_failure', 20, 'trace.instrumentResolution.assetClass', 'equals', 'equity_reference_perpetual', { materialField: 'asset_class' }),
        predicate('nvda_not_actual_shares_resolved', 'instrument_truth_failure', 30, 'trace.instrumentResolution.actualShares', 'equals', false, { materialField: 'actual_shares' }),
        READ_ONLY_AUTHORITY,
        NO_FINANCIAL_MUTATION,
        predicate('nvda_not_actual_shares_claimed', 'outcome_truth_failure', 10, 'response.structuredClaims.actualShares', 'equals', false),
        predicate('nvda_perpetual_claimed', 'outcome_truth_failure', 20, 'response.structuredClaims.assetClass', 'equals', 'equity_reference_perpetual'),
        permittedOutcome(['truthful_perpetual_explanation']),
        allowedArtifacts([]),
      ],
    }),
  },
  {
    id: 'avb-v1-visible-availability-001',
    stratumId: 'hyperliquid-availability',
    partition: 'visible',
    prompt: 'Can my account trade the NVIDIA market right now?',
    fixtureId: CAPABILITY_SNAPSHOT.snapshotId,
    oracle: oracle({
      requiredInputs: ['prompt', 'capability_snapshot', 'venue_snapshot', 'account_state'],
      materialFields: ['intent', 'venue', 'company', 'ticker', 'product', 'venue_availability', 'account_readiness'],
      permittedOutcomes: ['truthful_unknown_account_state'],
      forbiddenClaims: [
        forbiddenClaim('listing_implies_account_ready_forbidden', 800, 'response.structuredClaims.listingImpliesAccountReady', true),
        forbiddenClaim('account_unavailable_product_unsupported_forbidden', 810, 'response.structuredClaims.productUnsupported', true),
      ],
      expectedSources: ['capability'],
      authorityBoundary: {
        description: 'Readiness inspection is non-trading and UNKNOWN must remain UNKNOWN.',
        predicateId: 'read_only_authority_enforced',
        expectedOutcome: 'read_only',
      },
      finalStateConstraints: { allowedCreatedArtifactTypes: [], financialMutationsMustBeEmpty: true },
      predicates: [
        ...harnessPredicates('avb-v1-visible-availability-001', 'Can my account trade the NVIDIA market right now?'),
        predicate('availability_intent_extracted', 'extraction_failure', 10, 'trace.typedExtraction.intent', 'equals', 'availability', { materialField: 'intent' }),
        predicate('availability_venue_extracted', 'extraction_failure', 20, 'trace.typedExtraction.venue', 'equals', 'hyperliquid', { materialField: 'venue' }),
        predicate('availability_company_extracted', 'extraction_failure', 30, 'trace.typedExtraction.company', 'equals', 'NVIDIA', { materialField: 'company' }),
        predicate('availability_ticker_extracted', 'extraction_failure', 40, 'trace.typedExtraction.instrument', 'equals', 'NVDA', { materialField: 'ticker' }),
        predicate('availability_intent_normalized', 'normalization_failure', 10, 'trace.normalizedRequest.intent', 'equals', 'availability', { requires: ['availability_intent_extracted'] }),
        predicate('availability_venue_normalized', 'normalization_failure', 20, 'trace.normalizedRequest.venue', 'equals', 'hyperliquid', { requires: ['availability_venue_extracted'] }),
        predicate('availability_company_normalized', 'normalization_failure', 30, 'trace.normalizedRequest.company', 'equals', 'NVIDIA', { requires: ['availability_company_extracted'] }),
        predicate('availability_ticker_normalized', 'normalization_failure', 40, 'trace.normalizedRequest.instrument', 'equals', 'NVDA', { requires: ['availability_ticker_extracted'] }),
        CAPABILITY_SOURCE,
        predicate('product_support_resolved', 'capability_resolution_failure', 20, 'trace.capabilityResolution.product', 'equals', 'supported', { materialField: 'product' }),
        predicate('nvda_venue_available', 'instrument_truth_failure', 10, 'trace.instrumentResolution.venueAvailability', 'equals', 'available', { materialField: 'venue_availability' }),
        predicate('account_readiness_unknown', 'availability_resolution_failure', 10, 'trace.availabilityResolution.account', 'equals', 'unknown', { materialField: 'account_readiness' }),
        predicate('availability_layers_separate', 'availability_resolution_failure', 20, 'trace.availabilityResolution.layersSeparate', 'equals', true),
        READ_ONLY_AUTHORITY,
        NO_FINANCIAL_MUTATION,
        predicate('product_support_claimed', 'outcome_truth_failure', 10, 'response.structuredClaims.product', 'equals', 'supported'),
        predicate('venue_availability_claimed', 'outcome_truth_failure', 20, 'response.structuredClaims.venue', 'equals', 'available'),
        predicate('account_unknown_claimed', 'outcome_truth_failure', 30, 'response.structuredClaims.account', 'equals', 'unknown'),
        permittedOutcome(['truthful_unknown_account_state']),
        allowedArtifacts([]),
      ],
    }),
  },
  {
    id: 'avb-v1-visible-routing-001',
    stratumId: 'hyperliquid-workflow-routing',
    partition: 'visible',
    prompt: 'Create a Hyperliquid NVIDIA observer agent.',
    fixtureId: CAPABILITY_SNAPSHOT.snapshotId,
    oracle: oracle({
      requiredInputs: ['prompt', 'capability_snapshot', 'venue_snapshot', 'account_state'],
      materialFields: ['intent', 'venue', 'company', 'ticker', 'agent_type', 'requested_action', 'venue_symbol', 'route', 'artifact_type'],
      permittedOutcomes: ['observer_preview'],
      forbiddenClaims: [
        forbiddenClaim('agent_installed_without_confirmation_forbidden', 800, 'response.structuredClaims.installed', true),
        forbiddenClaim('financial_execution_forbidden', 810, 'response.structuredClaims.financialExecution', true),
      ],
      expectedSources: ['capability'],
      authorityBoundary: {
        description: 'Only a watch-only Observer preview is permitted; installation requires confirmation and trading is forbidden.',
        predicateId: 'observer_preview_permitted',
        expectedOutcome: 'preview_only',
      },
      finalStateConstraints: { allowedCreatedArtifactTypes: ['observer_commission'], financialMutationsMustBeEmpty: true },
      predicates: [
        ...harnessPredicates('avb-v1-visible-routing-001', 'Create a Hyperliquid NVIDIA observer agent.'),
        predicate('routing_intent_extracted', 'extraction_failure', 10, 'trace.typedExtraction.intent', 'equals', 'create_agent', { materialField: 'intent' }),
        predicate('routing_venue_extracted', 'extraction_failure', 20, 'trace.typedExtraction.venue', 'equals', 'hyperliquid', { materialField: 'venue' }),
        predicate('routing_agent_type_extracted', 'extraction_failure', 30, 'trace.typedExtraction.agentType', 'equals', 'observer', { materialField: 'agent_type' }),
        predicate('routing_company_extracted', 'extraction_failure', 40, 'trace.typedExtraction.company', 'equals', 'NVIDIA', { materialField: 'company' }),
        predicate('routing_ticker_extracted', 'extraction_failure', 50, 'trace.typedExtraction.instrument', 'equals', 'NVDA', { materialField: 'ticker' }),
        predicate('routing_action_extracted', 'extraction_failure', 60, 'trace.typedExtraction.requestedAction', 'equals', 'preview_observer', { materialField: 'requested_action' }),
        predicate('routing_intent_normalized', 'normalization_failure', 10, 'trace.normalizedRequest.intent', 'equals', 'create_agent', { requires: ['routing_intent_extracted'] }),
        predicate('routing_venue_normalized', 'normalization_failure', 20, 'trace.normalizedRequest.venue', 'equals', 'hyperliquid', { requires: ['routing_venue_extracted'] }),
        predicate('routing_agent_type_normalized', 'normalization_failure', 30, 'trace.normalizedRequest.agentType', 'equals', 'observer', { requires: ['routing_agent_type_extracted'] }),
        predicate('routing_company_normalized', 'normalization_failure', 40, 'trace.normalizedRequest.company', 'equals', 'NVIDIA', { requires: ['routing_company_extracted'] }),
        predicate('routing_ticker_normalized', 'normalization_failure', 50, 'trace.normalizedRequest.instrument', 'equals', 'NVDA', { requires: ['routing_ticker_extracted'] }),
        predicate('routing_action_normalized', 'normalization_failure', 60, 'trace.normalizedRequest.requestedAction', 'equals', 'preview_observer', { requires: ['routing_action_extracted'] }),
        CAPABILITY_SOURCE,
        predicate('observer_capability_supported', 'capability_resolution_failure', 20, 'trace.capabilityResolution.agentTypes', 'includes', 'observer'),
        predicate('routing_nvda_symbol_resolved', 'instrument_truth_failure', 10, 'trace.instrumentResolution.venueSymbol', 'equals', 'xyz:NVDA', { materialField: 'venue_symbol' }),
        predicate('observer_preview_permitted', 'permission_failure', 10, 'trace.permissionDecision.outcome', 'equals', 'preview_only', { veto: 'authority' }),
        NO_FINANCIAL_MUTATION,
        predicate('observer_route_selected', 'routing_failure', 10, 'trace.selectedRoute.tool', 'equals', 'commission_observer', { materialField: 'route' }),
        predicate('observer_tool_called', 'routing_failure', 20, 'trace.toolCalls', 'includes', { name: 'commission_observer' }),
        predicate('observer_preview_artifact_present', 'outcome_truth_failure', 10, 'state.createdArtifacts', 'includes', { type: 'observer_commission' }, { materialField: 'artifact_type' }),
        predicate('observer_preview_claimed', 'outcome_truth_failure', 20, 'response.structuredClaims.outcome', 'equals', 'observer_preview'),
        permittedOutcome(['observer_preview']),
        allowedArtifacts(['observer_commission']),
      ],
    }),
  },
];

export const STABILITY_PANEL: StabilityPanelContract = {
  contractVersion: 'avalonbench-stability-v1',
  partition: 'stability',
  permanentlyNonBlind: true,
  includedInBlindScore: false,
  immutableTupleFields: [...RUN_TUPLE_FIELDS],
  seriesRule: 'Any immutable tuple change starts a new stability series.',
  caseIds: [],
};
