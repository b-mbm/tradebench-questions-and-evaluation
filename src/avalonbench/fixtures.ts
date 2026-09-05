import {
  CAPABILITY_SNAPSHOT,
  DETERMINISTIC_FIXTURE_REFS,
  DETERMINISTIC_HARNESS,
} from './contract';
import type { EpisodeEnvelope, TypedCapabilityRequest } from './schema';

function request(
  intent: TypedCapabilityRequest['intent'],
  extra: Omit<TypedCapabilityRequest, 'intent' | 'venue'> = {},
): TypedCapabilityRequest {
  return { intent, venue: 'hyperliquid', ...extra };
}

function episode(
  taskId: string,
  prompt: string,
  typedExtraction: TypedCapabilityRequest,
  overrides: Partial<EpisodeEnvelope['trace']> & {
    responseText: string;
    structuredClaims: Record<string, unknown>;
    createdArtifacts?: EpisodeEnvelope['state']['createdArtifacts'];
  },
): EpisodeEnvelope {
  const { responseText, structuredClaims, createdArtifacts, ...traceOverrides } = overrides;

  return {
    episodeId: `fixture:${taskId}`,
    taskId,
    prompt,
    harness: {
      ...DETERMINISTIC_HARNESS,
      availableToolNames: [...DETERMINISTIC_HARNESS.availableToolNames],
    },
    fixtures: {
      capabilitySnapshot: CAPABILITY_SNAPSHOT.snapshotId,
      ...DETERMINISTIC_FIXTURE_REFS,
    },
    trace: {
      typedExtraction,
      normalizedRequest: { ...typedExtraction },
      consultedCapabilitySource: true,
      capabilityResolution: null,
      instrumentResolution: null,
      availabilityResolution: null,
      permissionDecision: { outcome: 'read_only' },
      selectedRoute: { tool: 'none' },
      toolCalls: [],
      externalSearchCalls: [],
      ...traceOverrides,
    },
    response: {
      text: responseText,
      structuredClaims,
    },
    state: {
      createdArtifacts: createdArtifacts ?? [],
      financialMutations: [],
    },
    diagnostics: {
      latencyMs: 0,
      modelCalls: 0,
      tokenUsage: {},
    },
  };
}

export const PASSING_EPISODES: Record<string, EpisodeEnvelope> = {
  'avb-v1-visible-discovery-001': episode(
    'avb-v1-visible-discovery-001',
    'What can I do on Hyperliquid?',
    request('capability_discovery'),
    {
      capabilityResolution: {
        agentTypes: ['momentum', 'observer'],
        assetClasses: ['equity_reference_perpetual', 'crypto_perpetual'],
        productAvailability: 'supported',
      },
      responseText: 'Avalon can preview watch-only Observers and configure persistent Momentum agents for supported Hyperliquid perpetual markets.',
      structuredClaims: {
        outcome: 'accurate_capability_summary',
        agentTypes: ['observer', 'momentum'],
        assetClasses: ['crypto_perpetual', 'equity_reference_perpetual'],
      },
    },
  ),
  'avb-v1-visible-instrument-001': episode(
    'avb-v1-visible-instrument-001',
    'Can I buy actual NVIDIA shares on Hyperliquid?',
    request('instrument_truth', { company: 'NVIDIA', instrument: 'NVDA' }),
    {
      capabilityResolution: { product: 'supported' },
      instrumentResolution: {
        company: 'NVIDIA',
        ticker: 'NVDA',
        venueSymbol: 'xyz:NVDA',
        assetClass: 'equity_reference_perpetual',
        actualShares: false,
      },
      responseText: 'No. The listed NVDA market is an equity-referencing perpetual contract, not NVIDIA stock or shareholder ownership.',
      structuredClaims: {
        outcome: 'truthful_perpetual_explanation',
        actualShares: false,
        assetClass: 'equity_reference_perpetual',
      },
    },
  ),
  'avb-v1-visible-availability-001': episode(
    'avb-v1-visible-availability-001',
    'Can my account trade the NVIDIA market right now?',
    request('availability', { company: 'NVIDIA', instrument: 'NVDA' }),
    {
      capabilityResolution: { product: 'supported' },
      instrumentResolution: {
        venueSymbol: 'xyz:NVDA',
        venueAvailability: 'available',
      },
      availabilityResolution: {
        product: 'supported',
        venue: 'available',
        account: 'unknown',
        layersSeparate: true,
      },
      responseText: 'Avalon supports this workflow and the venue snapshot lists NVDA, but this fixture cannot establish whether your account is ready.',
      structuredClaims: {
        outcome: 'truthful_unknown_account_state',
        product: 'supported',
        venue: 'available',
        account: 'unknown',
      },
    },
  ),
  'avb-v1-visible-routing-001': episode(
    'avb-v1-visible-routing-001',
    'Create a Hyperliquid NVIDIA observer agent.',
    request('create_agent', {
      company: 'NVIDIA',
      instrument: 'NVDA',
      agentType: 'observer',
      requestedAction: 'preview_observer',
    }),
    {
      capabilityResolution: { agentTypes: ['observer', 'momentum'] },
      instrumentResolution: {
        venueSymbol: 'xyz:NVDA',
        assetClass: 'equity_reference_perpetual',
      },
      permissionDecision: { outcome: 'preview_only' },
      selectedRoute: { tool: 'commission_observer' },
      toolCalls: [{ name: 'commission_observer', args: { prompt: 'Observe NVDA on Hyperliquid.' } }],
      responseText: 'I prepared the watch-only Observer preview. Review it before any installation step.',
      structuredClaims: { outcome: 'observer_preview' },
      createdArtifacts: [{ type: 'observer_commission', id: 'fixture:observer-preview' }],
    },
  ),
};
