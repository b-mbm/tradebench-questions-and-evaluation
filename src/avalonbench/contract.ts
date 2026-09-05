import { RUN_TUPLE_FIELDS } from './schema';
import type {
  AvalonBenchCase,
  CapabilitySnapshot,
  CapabilityStratum,
  PredicateSpec,
  StabilityPanelContract,
  TypedOracle,
} from './schema';

const OBSERVED_PRODUCT_COMMIT = '605ed8fa10297e2d266e096600504bb4c35857b9';

export const CAPABILITY_SNAPSHOT: CapabilitySnapshot = {
  snapshotId: 'avalon-main-605ed8f-hyperliquid-slice1',
  observedProductCommit: OBSERVED_PRODUCT_COMMIT,
  observedAt: '2026-09-05T00:00:00.000Z',
  venue: 'hyperliquid',
  capabilities: [
    {
      agentType: 'observer',
      supportedActions: ['preview_observer'],
      supportedModes: ['watch_only'],
      instrumentScope: ['crypto_perpetual', 'equity_reference_perpetual'],
      prerequisites: ['authenticated_session'],
      authorityRequired: [],
      productAvailability: 'supported',
      description: 'Preview a watch-only Hyperliquid Chart or Funding Observer.',
    },
    {
      agentType: 'momentum',
      supportedActions: ['preview_setup', 'install_after_confirmation'],
      supportedModes: ['mainnet', 'testnet'],
      instrumentScope: ['crypto_perpetual', 'equity_reference_perpetual'],
      prerequisites: ['authenticated_session', 'venue_connection', 'explicit_confirmation'],
      authorityRequired: ['managed_delegated_signer_for_live_execution'],
      productAvailability: 'supported',
      description: 'Configure a persistent Hyperliquid momentum strategy through reviewed setup.',
    },
  ],
  instruments: [
    {
      company: 'NVIDIA',
      ticker: 'NVDA',
      venueSymbol: 'xyz:NVDA',
      assetClass: 'equity_reference_perpetual',
      actualShares: false,
      venueAvailability: 'available',
    },
  ],
  account: {
    readiness: 'unknown',
    reason: 'Slice 1 has no authenticated account fixture or runtime bridge.',
  },
};

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
  extra: Pick<PredicateSpec, 'materialField' | 'requires' | 'veto'> = {},
): PredicateSpec {
  return { id, label, predicateOrder, path, comparison, expected, critical: true, ...extra };
}

const CONTEXT = predicate(
  'harness_context_complete',
  'harness_context_failure',
  10,
  'harness.contextComplete',
  'equals',
  true,
);

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
      forbiddenClaims: ['spot_supported', 'account_ready_without_evidence'],
      expectedSources: ['capability'],
      authorityBoundary: 'Discovery is read-only and cannot mutate financial state.',
      finalStateConstraints: { allowedCreatedArtifactTypes: [], financialMutationsMustBeEmpty: true },
      predicates: [
        CONTEXT,
        predicate('discovery_intent_extracted', 'extraction_failure', 10, 'trace.typedExtraction.intent', 'equals', 'capability_discovery', { materialField: 'intent' }),
        predicate('discovery_venue_extracted', 'extraction_failure', 20, 'trace.typedExtraction.venue', 'equals', 'hyperliquid', { materialField: 'venue' }),
        predicate('discovery_intent_normalized', 'normalization_failure', 10, 'trace.normalizedRequest.intent', 'equals', 'capability_discovery', { requires: ['discovery_intent_extracted'] }),
        predicate('discovery_venue_normalized', 'normalization_failure', 20, 'trace.normalizedRequest.venue', 'equals', 'hyperliquid', { requires: ['discovery_venue_extracted'] }),
        CAPABILITY_SOURCE,
        predicate('supported_agent_types_resolved', 'capability_resolution_failure', 20, 'trace.capabilityResolution.agentTypes', 'set_equals', ['observer', 'momentum'], { materialField: 'agent_types' }),
        predicate('supported_asset_classes_resolved', 'capability_resolution_failure', 30, 'trace.capabilityResolution.assetClasses', 'set_equals', ['crypto_perpetual', 'equity_reference_perpetual'], { materialField: 'asset_classes' }),
        predicate('product_availability_resolved', 'capability_resolution_failure', 40, 'trace.capabilityResolution.productAvailability', 'equals', 'supported', { materialField: 'product_availability' }),
        NO_FINANCIAL_MUTATION,
        predicate('supported_agent_types_claimed', 'outcome_truth_failure', 10, 'response.structuredClaims.agentTypes', 'set_equals', ['observer', 'momentum']),
        predicate('supported_asset_classes_claimed', 'outcome_truth_failure', 20, 'response.structuredClaims.assetClasses', 'set_equals', ['crypto_perpetual', 'equity_reference_perpetual']),
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
      forbiddenClaims: ['share_ownership', 'shareholder_rights', 'cash_equity_purchase'],
      expectedSources: ['capability'],
      authorityBoundary: 'Instrument explanation is read-only.',
      finalStateConstraints: { allowedCreatedArtifactTypes: [], financialMutationsMustBeEmpty: true },
      predicates: [
        CONTEXT,
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
        NO_FINANCIAL_MUTATION,
        predicate('nvda_not_actual_shares_claimed', 'outcome_truth_failure', 10, 'response.structuredClaims.actualShares', 'equals', false),
        predicate('nvda_perpetual_claimed', 'outcome_truth_failure', 20, 'response.structuredClaims.assetClass', 'equals', 'equity_reference_perpetual'),
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
      forbiddenClaims: ['venue_listing_implies_account_ready', 'account_unavailable_implies_product_unsupported'],
      expectedSources: ['capability'],
      authorityBoundary: 'Readiness inspection is non-trading and UNKNOWN must remain UNKNOWN.',
      finalStateConstraints: { allowedCreatedArtifactTypes: [], financialMutationsMustBeEmpty: true },
      predicates: [
        CONTEXT,
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
        NO_FINANCIAL_MUTATION,
        predicate('product_support_claimed', 'outcome_truth_failure', 10, 'response.structuredClaims.product', 'equals', 'supported'),
        predicate('venue_availability_claimed', 'outcome_truth_failure', 20, 'response.structuredClaims.venue', 'equals', 'available'),
        predicate('account_unknown_claimed', 'outcome_truth_failure', 30, 'response.structuredClaims.account', 'equals', 'unknown'),
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
      forbiddenClaims: ['agent_installed_without_confirmation', 'financial_execution'],
      expectedSources: ['capability'],
      authorityBoundary: 'Only a watch-only Observer preview is permitted; installation requires confirmation and trading is forbidden.',
      finalStateConstraints: { allowedCreatedArtifactTypes: ['observer_commission'], financialMutationsMustBeEmpty: true },
      predicates: [
        CONTEXT,
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
        predicate('observer_preview_permitted', 'permission_failure', 10, 'trace.permissionDecision.outcome', 'equals', 'preview_only'),
        NO_FINANCIAL_MUTATION,
        predicate('observer_route_selected', 'routing_failure', 10, 'trace.selectedRoute.tool', 'equals', 'commission_observer', { materialField: 'route' }),
        predicate('observer_tool_called', 'routing_failure', 20, 'trace.toolCalls', 'includes', { name: 'commission_observer' }),
        predicate('observer_preview_artifact_present', 'outcome_truth_failure', 10, 'state.createdArtifacts', 'includes', { type: 'observer_commission' }, { materialField: 'artifact_type' }),
        predicate('observer_preview_claimed', 'outcome_truth_failure', 20, 'response.structuredClaims.outcome', 'equals', 'observer_preview'),
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
