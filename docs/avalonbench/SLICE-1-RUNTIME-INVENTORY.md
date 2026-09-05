# AvalonBench v1 — Slice 1 runtime inventory

This inventory records the runtime facts observed on 2026-09-05 before Slice 1 was implemented. It is evidence for the benchmark fixture, not a substitute product API.

## Source identities

- Product repository: `https://github.com/aix-ai/aix.git`
- Product commit: `605ed8fa10297e2d266e096600504bb4c35857b9`
- Read-only product worktree: `/Users/bradleymiles/Documents/aix-hyperliquid-metered-thinking-shared-parity`
- Benchmark repository: `https://github.com/b-mbm/tradebench-questions-and-evaluation.git`
- Benchmark baseline: `8c53b50eb32fc0c958086aca504d92c9836046c6`
- Benchmark branch/upstream: `feat/avalon-bench-v1` / `origin/main`

## Actual harness and capability surfaces

| Surface | Evidence | Verified observation |
| --- | --- | --- |
| Basic and Pro chat scaffold | `apps/aix-frontend/lib/prompt.ts:485` | `buildSystemPrompt` builds the common scaffold and adds Pro context for Pro. |
| Chat-to-agent bridge | `apps/aix-frontend/app/api/chat/route.ts:6320` | Eligible chat requests and recent conversation state are forwarded to the backend typed-run endpoint. |
| Frontend tool manifest | `apps/aix-frontend/lib/orchestrationTools.ts:1` | Market data, web search, pool data, and gated strategy/backtest tools exist. No product-capability lookup tool exists. |
| Backend typed tools | `apps/api/src/lib/agent-execution/tools/registry.ts:1` | The registry includes `commission_observer` and `manage_trading_agent_setup` alongside research, portfolio, monitoring, and execution tools. |
| Tool permissions | `apps/api/src/lib/agent-execution/permissions.ts:1` | Kill switch, agent-type ceilings, and policy constrain tool access. General-purpose agents do not have unrestricted transaction submission. |
| Observer | `apps/api/src/lib/agent-execution/tools/commission-observer.ts:1` | Observer creation is a watch-only preview with no signing/execution mode. |
| Momentum | `apps/api/src/lib/agent-execution/tools/manage-trading-agent-setup.ts:1` | Persistent Hyperliquid momentum setup exists; mainnet is the default, testnet is explicit, and installation requires confirmation. |
| Strategy catalog | `packages/execution-domain/src/strategy.ts:330` | Approved Hyperliquid packages include configurable momentum plus protected-order, limit, trigger, and TWAP strategies. |
| HIP-3 catalog | `packages/protocol-adapter/src/hl-equity-catalog.ts:1` | NVIDIA/NVDA maps to `xyz:NVDA`, an equity-reference perpetual rather than an actual NVIDIA share. |
| Account readiness | `apps/api/src/lib/execution/hyperliquid-mainnet-readiness.ts:32` | Account readiness has its own connection, environment, signer, capability, safety, policy, approval, and snapshot checks. It cannot be inferred from venue listing. |
| Durable agent registry | `apps/api/src/lib/execution/storage.ts:4549` | Persistent agents are `execution_strategy_instances`; user reads exclude disabled strategies. |

## Sanctioned test entrypoints and the exact gap

The product repository has workspace test/build scripts, Playwright suites, Hyperliquid concierge live QA, and deterministic smoke scripts. A code-only search across `apps`, `packages`, `scripts`, and the root package manifest found no `AvalonBench` adapter and no single authoritative product-capability registry or lookup surface (search exit 1, zero matches).

That gap is intentionally not fabricated in Slice 1. The benchmark capability snapshot is a committed, immutable fixture independently derived from the runtime sources above. A production adapter or authoritative capability service is Slice 2 work.

## Product / venue / account separation

For the four visible cases, the verified contract is:

- Product: Observer preview and reviewed Momentum setup are supported Avalon workflows.
- Venue: `xyz:NVDA` is present as an equity-reference perpetual, not cash equity ownership.
- Account: readiness is `UNKNOWN` because Slice 1 has no authenticated account fixture or sanctioned runtime bridge.

No provider calls, live trading actions, account mutations, or financial mutations were used to derive this inventory.
