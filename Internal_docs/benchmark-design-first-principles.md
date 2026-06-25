# Benchmark Design & Training-Set Design — First Principles

A portable field guide. Hand to any environment (Claude, Codex, Perplexity, ChatGPT) to upskill it on
building benchmarks and training sets that survive expert scrutiny. Distilled from building/hardening
StockBench, CoinBench, the SFT-1500, and TradeBench-Deep.

---

## PART I — WHY, AND THE CARDINAL SINS

A benchmark exists to **discriminate** capability with a **trustworthy ground truth**. A training set
exists to **teach** a capability. They are designed differently (Part III). Most benchmarks die from
one of five cardinal sins:

1. **Contamination** — eval items (or trivial reskins) leak into training → scores measure memory, not skill.
2. **Non-uniqueness** — a materially-different second answer also passes → the item can't discriminate.
3. **Unsolvability** — the answer isn't derivable from prompt + rubric → you measure luck/bluffing.
4. **Look-ahead / temporal leakage** — the answer is knowable from info the agent shouldn't have (future bars; training-cutoff facts).
5. **Faulty answer key** — the "correct" answer is wrong, contradictory, or not actually optimal.

---

## PART II — THE GATES (and the meta-rule)

**META-RULE (anti-circularity): build the gate before the thing it gates, and prove every gate can go
RED before you trust GREEN.** A gate that cannot fail on a known-bad input is theater. For each gate,
plant a deliberately-broken input and confirm it's caught.

### Gate 1 — Solvability / reverse-derivation audit
For each item, look at the answer and prove it is **uniquely derivable from problem + rubric alone**.
This is NOT a blind solve (that measures capability, not solvability). Trace: can the answer be
reached from only what's given? If it needs external/unstated data → unsolvable → cut or fix.
- Fail mode it catches: questions no honest solver can get right (e.g., "assert specific correlations
  from 'typical behavior'" with no data → fabrication required).

### Gate 2 — Non-uniqueness check
Search for a **second, materially-different answer that also passes** the rubric. If one exists, the
item can't discriminate. Tighten the rubric or constraints until the optimum is unique.

### Gate 3 — Answer-key correctness / oracle-optimality
Independently verify the keyed answer is correct AND optimal. For computed answers, re-derive. For
"pick the best option," brute-force the option space and confirm nothing beats the key.
- Fail mode: a canonical that contradicts its own prompt (e.g., prompt says bribes cost $0, key
  subtracts a bribe cost). Universal-fail (0/N models) on a non-frontier question is the tell.

### Gate 4 — Contamination / item-disjointness (the linchpin shared with training)
Train and eval must be **item-disjoint**. Detect with a similarity scan that **masks the swappable
surface tokens** (numbers, tickers, venues) AND **normalizes action-verb synonyms** (deposit≡stake,
place≡create) before comparing — a reskin hides exactly in those swaps. Also gate on **provenance**
(if a row's source id maps to an eval id, treat as contamination candidate). Don't tune the metric
forever; if a whole provenance class is eval-derived, drop the class by construction.

### Gate 5 — Mutation testing
Inject each known-bad mutation into a correct answer (wrong number, wrong instrument, wrong strategy,
missing critical field, invalid route) and confirm **each makes the score fall**. A scorer that
doesn't punish a clear error is broken.

### Gate 6 — Hidden-schema / un-derivable token detection
Ensure required output fields are named/derivable from the prompt. A rubric that demands an exact,
**undisclosed** enum/label string the solver can't infer is testing label-trivia, not skill — fix to
semantic matching or disclose the schema.

### Gate 7 — Reproducibility & immutability
Freeze with pinned commit + content hashes; a single command must re-derive byte-identical. Pin
upstream by COMMIT hash, not version string. Real, frozen, hashed data — never fabricated.

### Gate 8 — Dual independent verification
**Author-green ≠ final.** A second *independent* model (and ideally a third) must reproduce or refute
every gate with its own hands — check exit codes, not log strings. One model self-auditing is the
weakest evidence there is. Where reviewers disagree on a judgment call, a neutral referee adjudicates.

### The verifier/grader itself
- Prefer **deterministic rubric grading** over an LLM judge (no judge drift).
- Decide **exact vs semantic** matching per field. Exact-undisclosed-string matching is usually a flaw.
- Expose **partial credit (field-level scores)** — invaluable as a dense training/RL reward later.
- Audit the grader before trusting it: over-strict (penalizes correct answers) and over-lenient (passes
  wrong ones) are both fatal. A universal-fail set is the place to find over-strictness.

### Difficulty & coverage
- Tier by difficulty (L1…AGI) with a **published stratification matrix** (capability/domain × tier ×
  regime) so coverage is deliberate, not accidentally monoculture.
- Difficulty is best understood by **failure mode** (why items fail), which cuts across tiers — not by
  tier label alone.

### Live / temporal benchmarks (forecasting-type)
If the "answer" is a real-world fact that resolves over time (prediction markets, forecasts), the
benchmark must be **live/rolling or training-cutoff-gated** — score only on events that resolve AFTER
the model's cutoff, or the model recalls instead of reasons. Score **calibration over large N**
(Brier/log-loss, proper scoring rules), never single outcomes (that rewards luck). Process > outcome.

### The failure-map / proximity audit (post-hoc benchmark QC)
Run many models; for each item, who passed? **Universal-fail items (0 models)** are either genuinely
frontier-hard or **broken** — audit them: bug (fix), genuine failure mode (keep), or grading artifact
(fix grader). This both cleans the benchmark and reveals what to teach.

---

## PART III — TRAINING-SET DESIGN (different goal, different rules)

**A benchmark MEASURES; a training set TEACHES.** Consequences:
- A benchmark: every item is load-bearing — one bad item poisons the published claim. Must be perfect,
  unique, held out.
- A training set: robust to a little noise (the model averages over thousands). But it has its own
  cardinal rule.

### Training-set cardinal rules
1. **Label correctness is #1.** The model trusts what you show it; wrong labels teach confident
   wrongness at scale. Re-derive labels; for synthetic data, "correct by construction" (answer computed
   in code from in-prompt values) is stronger than a sampled spot-check — but verify the construction.
2. **Item-disjoint from eval ("archetype, not copy").** Same SKILL, different ITEM. If masking
   numbers/tickers/verbs makes a train row identical to an eval row, it's a reskin = contamination.
   This is the inviolable line (and what makes any benchmark claim survive due diligence).
3. **Solvability-from-prompt.** Don't include rows whose answer needs info not in the prompt — that
   teaches the model to **bluff** (confidently emit numbers it can't derive).
4. **Representativeness / schema diversity.** Match the eval's distribution of question types AND output
   shapes. Mono-schema data over-rigidifies the model (it learns one output shape and ignores the
   prompt's requested fields) — a real capability *regression*.
5. **Target failure modes, not tiers.** Build data that drills each *failure mode* (numeric exactness,
   strategy/intent, schema, missing assumptions, synthesis), sized to its prevalence in the failure map.
6. **Anti-forgetting.** Heavy training on hard modes can regress what the model already does well
   (catastrophic forgetting). Mix in "maintenance" examples, train gently (LoRA/modest LR/fewer
   epochs), and re-eval ALL tiers to catch regressions.

### SFT vs GRPO (imitation vs optimization)
- **SFT = imitation:** show (prompt → ideal answer); the model copies. Ceiling = your demonstrations.
  Teaches format/capability/baseline. Good foundation.
- **GRPO/RL = optimization:** the model generates, a reward scores, it's pushed toward higher reward.
  Can exceed the demonstrations. Needs a **trustworthy reward** (a clean verifier) and **reward
  variance** (the model must be sometimes-right). With a **dense reward** (partial field scores) it can
  learn even where nothing fully passes yet.
- **Order is base-dependent.** Weak base → SFT-prime then GRPO-refine. Strong base (already competent,
  good schema) → GRPO can be the primary lever. Don't dogmatically order them.
- **GRPO guardrails:** clean the reward first (a buggy/contradictory canonical gets reward-hacked); RL
  on item-disjoint siblings (so it learns skill, not eval strings); re-eval AND eyeball for
  reward-hacking (higher score, degenerate outputs).

### The fundability linchpin (for training claims)
If you train toward a benchmark's failure modes and then beat that benchmark, prove **generalization**:
**hold out a slice of the eval you build ZERO training toward, and report lift on it.** "Better on
held-out items it never trained toward" is believed; "better on what we optimized" is dismissed.

---

## PART IV — THE ONE-LINE TESTS
- Benchmark item: *"Is the answer uniquely derivable from the prompt+rubric, correct, and not in any
  training set?"*
- Training row: *"Is the label correct, derivable from the prompt, item-disjoint from eval, and aimed
  at a real failure mode?"*
- Every gate: *"Can I make it go RED on a known-bad input? Show me."*
- Every result: *"Did a second independent model reproduce it with its own hands?"*
