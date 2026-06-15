# June 15th Final

This folder is the canonical June 15, 2026 archive for the active TradeBench 300Q N=1 candidate numbers.

## Files

- `June 15th final numbers.csv` - canonical CSV ranking.
- `June 15th final numbers.json` - same rows as JSON with metadata.
- `manifest.json` - machine-readable archive metadata and evidence path patterns.

## Definitions

- `pass_at_1`: count of passing questions out of 300.
- `clean`: scoreable answers.
- `dirty`: still unanswered, blank, transport error, truncated, provider/generation failure, or otherwise non-scoreable.
- `answered_fail`: clean scored answers that did not pass.

## Excluded

The following rows were explicitly excluded from this active candidate archive as unsalvageable for the public candidate set:

- `openai/gpt-5.4-pro`
- `openai/gpt-5.5-pro`
