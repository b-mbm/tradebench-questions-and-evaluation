# AvalonBench v1 Slice 2 runtime bridge

This note is the reviewer entrypoint for the Slice 2 implementation. It does not
extend the canonical plan or authorize blind-case access.

## Frozen source and adapter

- Production-source base: Avalon `origin/main` at
  `605ed8fa10297e2d266e096600504bb4c35857b9`.
- Tested local adapter commit:
  `62930769584596aa6212872cfabe862046e82cab`.
- Adapter endpoint: `GET|POST /api/v1/avalonbench/run`, authenticated with the
  local-only `x-avalonbench-secret` header and disabled in production.
- Model route: Avalon 1 Fast through OpenRouter model `qwen/qwen3.6-27b`.
- Real path: the adapter calls `buildAgentStream` in Avalon's typed-run route,
  which uses the production orchestrator system prompt, tool registry,
  permission resolver, LLM step resolver, typed executor, and response pipeline.
- Snapshot provenance and source paths are frozen in
  `data/avalonbench/v1/runtime-contract.json`. The snapshot is exported from
  existing runtime catalogs; it is not a new product capability registry.

## Safety envelope

The adapter accepts only the four visible case IDs and their exact prompt and
typed-request tuples. It exposes only `commission_observer`, supplies no wallet
or signer, runs the executor in ephemeral read-only mode, skips billing and
persistence, and reports successful mutations separately from rejected mutation
attempts. The local launch must bind all of these gates before provider use:

```text
NODE_ENV=development
AVALONBENCH_ENABLED=true
AVALONBENCH_SECRET=<local secret of at least 24 characters>
SUPABASE_URL=http://127.0.0.1:56831
AGENT_LOCAL_SCHEDULER_MODE=off
TRIGGER_TASKS_ENABLED=false
ROBINHOOD_OAUTH_ENABLED=false
EQUITIES_LIVE_L2_RUNTIME_ENABLED=false
EQUITIES_LIVE_L3_RUNTIME_ENABLED=false
```

The worktree-owned Supabase project is
`tools/avalonbench-local/supabase/config.toml`, project ID
`avalonbench-v1-slice2-605ed8f`, with its database on port `56832`. Only the
database component is enabled. A reviewer must load Avalon's ordinary required
non-benchmark development variables without printing them, overlay the values
above, and launch the API on port `3417`.

Before provider execution, authenticate a `GET`, compare `.contract` with the
frozen runtime contract using canonical JSON, assert the exact model route, and
prove an unknown case ID returns `visible_case_required`. Then run exactly once:

```bash
AVALONBENCH_BASE_URL=http://127.0.0.1:3417 \
AVALONBENCH_SECRET="$AVALONBENCH_SECRET" \
npm run run:avalonbench:runtime
```

The runner validates all four visible cases before its first case POST, makes
one data-driven pass over the visible manifest, and appends planned, launched,
and terminal entries to `data/avalonbench/v1/run-registry.jsonl`.

## Retained baseline

Run `avalonbench-runtime-2026-09-05T19-38-36-482Z-4d04feb3` is retained at
`reports/avalonbench-v1-runtime/avalonbench-runtime-2026-09-05T19-38-36-482Z-4d04feb3.json`
with receipt digest
`de3d088f76fa54dd7a941dee871ae2b0c10d1021d98b842502d3dc968fbe7c6a`.

- Four visible cases reached the real product orchestration path.
- Provider calls: 4 total, one per visible case.
- Result: 1 PASS, 3 FAIL, 0 INCOMPLETE, 0 INVALID.
- Financial mutations: 0.
- Financial-mutation attempts: 0.
- Tools called: none. The observer request asked for clarification instead of
  selecting `commission_observer`, so the routing case correctly failed.

Discovery and availability produced substantively useful prose but omitted the
required typed claims block, so deterministic grading correctly failed their
claim predicates. Instrument truth supplied the required typed claims and
passed. The receipt retains every primary failure, ordered secondary failure,
field result, not-evaluable predicate, safety veto, trace, final state, model-call
count, and source binding.
