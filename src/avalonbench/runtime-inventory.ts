export interface RuntimeSurfaceEvidence {
  surface: string;
  evidencePath: string;
  verifiedObservation: string;
}

export const RUNTIME_INVENTORY = {
  inventoryVersion: 'avalonbench-runtime-inventory-v1',
  observedAt: '2026-09-05T00:00:00.000Z',
  productRepository: {
    remote: 'https://github.com/aix-ai/aix.git',
    commit: '605ed8fa10297e2d266e096600504bb4c35857b9',
    localReadOnlyWorktree: '/Users/bradleymiles/Documents/aix-hyperliquid-metered-thinking-shared-parity',
  },
  benchmarkRepository: {
    remote: 'https://github.com/b-mbm/tradebench-questions-and-evaluation.git',
    baselineCommit: '8c53b50eb32fc0c958086aca504d92c9836046c6',
    branch: 'feat/avalon-bench-v1',
    upstream: 'origin/main',
  },
  surfaces: [
    {
      surface: 'Basic and Pro chat system scaffold',
      evidencePath: 'apps/aix-frontend/lib/prompt.ts:485',
      verifiedObservation:
        'buildSystemPrompt constructs the common chat scaffold and adds Pro-specific context when the selected surface is Pro.',
    },
    {
      surface: 'Chat-to-agent execution bridge',
      evidencePath: 'apps/aix-frontend/app/api/chat/route.ts:6320',
      verifiedObservation:
        'The chat route forwards eligible requests and recent conversation state to the backend typed-run endpoint.',
    },
    {
      surface: 'Frontend orchestration manifest',
      evidencePath: 'apps/aix-frontend/lib/orchestrationTools.ts:1',
      verifiedObservation:
        'The manifest exposes market data, web search, pool data, and gated strategy/backtest tools; it has no product-capability lookup tool.',
    },
    {
      surface: 'Backend typed tool registry',
      evidencePath: 'apps/api/src/lib/agent-execution/tools/registry.ts:1',
      verifiedObservation:
        'The typed registry includes commission_observer and manage_trading_agent_setup alongside research, portfolio, monitoring, and execution tools.',
    },
    {
      surface: 'Agent-type permission ceilings',
      evidencePath: 'apps/api/src/lib/agent-execution/permissions.ts:1',
      verifiedObservation:
        'Tool access is constrained by kill switch, agent-type allowlists, and per-agent policy; general-purpose agents do not receive unrestricted transaction submission.',
    },
    {
      surface: 'Observer workflow',
      evidencePath: 'apps/api/src/lib/agent-execution/tools/commission-observer.ts:1',
      verifiedObservation:
        'Observer commissioning is general-purpose-only, watch-only, fixed-cadence, and returns a preview artifact without signing or execution authority.',
    },
    {
      surface: 'Momentum setup workflow',
      evidencePath: 'apps/api/src/lib/agent-execution/tools/manage-trading-agent-setup.ts:1',
      verifiedObservation:
        'The setup tool supports persistent Hyperliquid momentum workflows, defaults to mainnet, permits explicit testnet selection, and requires explicit confirmation before installation.',
    },
    {
      surface: 'Approved strategy-package catalog',
      evidencePath: 'packages/execution-domain/src/strategy.ts:330',
      verifiedObservation:
        'The shared package catalog includes configurable Hyperliquid momentum templates and additional protected-order, limit, trigger, and TWAP packages.',
    },
    {
      surface: 'HIP-3 equity-reference catalog',
      evidencePath: 'packages/protocol-adapter/src/hl-equity-catalog.ts:1',
      verifiedObservation:
        'The shared venue-derived catalog maps NVIDIA/NVDA to xyz:NVDA as a Hyperliquid equity-reference perpetual, not a cash equity share.',
    },
    {
      surface: 'Account readiness',
      evidencePath: 'apps/api/src/lib/execution/hyperliquid-mainnet-readiness.ts:32',
      verifiedObservation:
        'Readiness is evaluated separately from product support and venue listing using connection, environment, signer, capability, incident-control, policy, approval, and account-snapshot checks.',
    },
    {
      surface: 'Durable agent registry',
      evidencePath: 'apps/api/src/lib/execution/storage.ts:4549',
      verifiedObservation:
        'Persistent strategy instances are stored in execution_strategy_instances and user-scoped reads exclude disabled strategies.',
    },
  ] satisfies RuntimeSurfaceEvidence[],
  sanctionedEntrypoints: {
    existing: [
      'npm run test:hyperliquid-strategy-demo-smoke',
      'npm run e2e (Playwright)',
      'npm run qa:hyperliquid:concierge:live',
    ],
    avalonBenchAdapterPresent: false,
  },
  negativeDiscoveryReceipt: {
    command:
      "rg -n -i 'avalonbench|avalon bench|capability_lookup|capability registry' apps packages scripts package.json",
    exitCode: 1,
    outputLines: 0,
  },
  slice2Blocker:
    'At the observed product commit there is no sanctioned AvalonBench adapter and no single authoritative product-capability lookup surface. Slice 1 therefore uses an immutable benchmark fixture derived from verified runtime code; adding a production bridge belongs to Slice 2.',
} as const;
