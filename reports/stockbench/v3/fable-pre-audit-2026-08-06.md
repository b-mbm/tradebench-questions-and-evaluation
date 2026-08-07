# StockBench v3 Fable pre-audit attempt

**Status:** no substantive verdict received; this is not approval.

## Verified invocation conditions

- CLI: `/Users/bradleymiles/.local/bin/claude`, version `2.1.223`.
- Model: `claude-fable-5`.
- Read-only tools: `Read`.
- Budget cap: `$15`.
- The command exited without a substantive auditor response on 2026-08-06.

The same local CLI returned a minimal Fable canary earlier in this session, so this record distinguishes a working model selection from an unusable substantive-audit response. The release candidate cannot receive a Fable PASS, REPAIR, or VETO until an actual response is retained.

## Second attempt — against tag `stockbench-v3.0.0` (commit 8a89c41)

A second Fable 5 audit was attempted against the exact tagged bundle. The CLI
(`/Users/bradleymiles/.local/bin/claude`, version `2.1.223`) failed before any
model call with `Not logged in · Please run /login`.

Root-cause diagnosis (2026-08-06):

- `claude auth status` reports `loggedIn: false`, `authMethod: none` — the CLI has
  no active session and no `~/.claude/.credentials.json` to bind credentials.
- The `ANTHROPIC_API_KEY` in `/Users/bradleymiles/Documents/aix/apps/api/.env.local`
  (prefix `sk-ant-`) is **invalid**: a direct `POST /v1/messages` returns
  `HTTP 401 { "invalid x-api-key" }`. This is a dead/revoked key, not a CLI issue.
- `~/.claude/.oauth_token` (prefix `sk-ant-oat0…`) is a valid OAuth-granted token —
  it authenticates (no 401) but is currently returning `HTTP 429 rate_limit_error`
  on repeated attempts. The CLI cannot use it without a credentials file regardless.

No substantive Fable response was obtained. This is **not** approval. The release
remains blocked on a Fable verdict until either (a) an interactive `claude auth
login` is completed and the audit re-run, (b) a valid `ANTHROPIC_API_KEY` is
supplied, or (c) the user formally marks Fable unavailable/waived (never passed).
