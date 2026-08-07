# StockBench v3 Fable 5 audit — tag stockbench-v3.0.0

**Verdict:** `REPAIR`

**Model:** anthropic/claude-fable-5  
**Audited:** 2026-08-07T03:20:33.672Z  
**Tag:** `stockbench-v3.0.0` (commit 8a89c41)  
**Route:** OpenRouter (direct Anthropic API was 429-saturated on premium tiers)  
**finish_reason:** stop  
**Tokens:** 7509 | **Cost:** $0.28337

## Note on prior passes

Fable 5 was reached via OpenRouter because the direct Anthropic API was 429-saturated on all premium tiers (Fable/Opus/Sonnet 4.5) at audit time; only Haiku was reachable directly. The first OpenRouter pass tripped an Anthropic content filter on raw scenario text (financial-instrument language); this second pass used a structure/hashes/grader-focused packet that pre-resolved two earlier concerns. This is a substantive retained verdict, not a blank/empty response.

## Fable verdict

# VERDICT: REPAIR

The freeze evidence is strong (bundle integrity, corpus identity, gate re-runs on post-drift source are all done correctly). But everything in this packet is **internal-consistency evidence**. Two defect classes that would invalidate the scoped claim — semantically invalid questions and factually stale canonical answers — cannot be ruled out from anything presented here. No concrete counterexample found, so not VETO; but the missing evidence is nameable and specific, so not GREEN.

---

## Findings

**F1 — Content validity is entirely unaudited, by construction of the packet.**
The packet says raw scenario text was excluded because a prior pass tripped a content filter, and pivots to "structure, hashes, grader logic, and scope." Hashes prove the questions are *frozen*; they prove nothing about whether the 300 items are well-posed equities-reasoning questions. The claim under audit is "300-question **equities-reasoning benchmark**," and the semantic half of that claim has zero supporting evidence here. **Missing artifact:** a stratified sample review (e.g., 30/300 across the dividend/settlement/margin/options families) with reviewer identity and a signed hash tying the reviewed text to blobs in SHA256SUMS.

**F2 — The solvability proof is self-referential, and identity with v2 creates a temporal-staleness exposure.**
`prove-stockbench-solvability.ts` re-derives canonical answers and re-grades them *with the same code family that defines the answers*. `ALL_300_VERIFIED` therefore attests "the pipeline agrees with itself," not "the answers are true." Worse, the aggregate hashes being **byte-identical to the v2 tag** means the answer set has been frozen across versions — and this is a market-conventions corpus. Concrete example of the risk class: US equity settlement moved T+2 → T+1 in May 2024. If any v2-era settlement question encodes the old convention, every gate in this packet still passes green. **Missing artifact:** a dated SME correctness attestation (or an independent oracle check) over the answer key, specifically covering time-sensitive conventions (settlement cycles, margin regs).

**F3 — No cross-runner equivalence evidence.**
The parallel runner gained `--suite stockbench` and its own StockBench *prompt dispatch* post-ledger; `run-300q.ts` is unchanged and bundle-canonical. If scored runs are ever produced via the parallel runner, a dispatch divergence (different prompt assembly, different context stripping) would silently change the benchmark. **Missing artifact:** a test showing both runners produce byte-identical prompts and identical grades for the same question set (or a manifest assertion that only `run-300q` output is authoritative).

**F4 — Numeric-answer grading tolerance is unevidenced.**
`normalizeCategorical` preserves `% / . -`, implying numeric/fraction-style answers pass through strict string comparison after normalization. `"0.5"`, `".5"`, and `"50%"` all normalize to distinct strings. If numeric answers are graded via this path, the benchmark partially measures format compliance rather than reasoning — a validity confound partially mitigated by the appended "public response conventions," which are not shown. **Missing artifact:** the numeric grading spec/tests, or the response-convention text, demonstrating equivalent-form handling.

**F5 — The content-filter trip has no disposition record.**
"Neutral factual language" that trips a content filter is either a filter false-positive (fine — document it) or a sign the scenario text contains something other than what's described. Either way, an audit trail that *routes around* the flagged content rather than dispositioning it is itself a finding. **Missing artifact:** the filter incident record with a human disposition.

---

## Assessment of the two "resolved" concerns

**Concern 1 (verdict-only proofs): partially closed.** The resolution fully answers the *reproducibility* question — deterministic recomputation receipts are legitimately sufficient for a static benchmark; human-readable prose derivations are not required. But it does **not** close the *correctness* question, and the resolution quietly conflates the two. Receipts of `{derivable, unique, recomputed_ok}` prove the answer key is a fixed point of the pipeline, not that it matches market reality (see F2). Closed for derivability; open for ground truth.

**Concern 2 (`_`→space collisions): closed, with one documented residual.** The 25→25 empirical check plus the bidirectional trade/no_trade canary is the right evidence, and it's sufficient for the label set. Residual worth one line of documentation, not a blocker: the charset strip *deletes* illegal characters rather than replacing with space, so `"no–trade"` (en dash) → `"notrade"` and `"no&trade"` → `"notrade"`. These fail toward strictness (false negative), never toward a wrong-answer collision, so validity is preserved — but expect some format-driven score noise on categorical answers.

---

## Least-sure dimension

**Ground-truth correctness of the frozen answer key** (F2). Every gate presented — solvability, mutation, canary, quality — is closed-loop. Not one artifact in this packet involves a check against the world outside the repository, and for a market-conventions corpus inherited byte-identical from v2, that is precisely where a defect would hide while all lights stay green.

**Repair path to GREEN:** (1) sampled SME content review with signed hash linkage (F1), (2) dated SME/oracle attestation on the answer key with explicit coverage of time-sensitive conventions (F2), (3) cross-runner prompt/grade equivalence test or authoritative-runner declaration (F3). F4 and F5 are documentation-level and should not block a re-verdict on their own.


## F2 re-verdict (after ground-truth attestation)

After the F2 ground-truth attestation (see f2-ground-truth-attestation-2026-08-06.md), Fable re-verdicted via OpenRouter (finish_reason: stop, cost: $0.13765, tokens: 4229).

### Re-verdict: GREEN (conditional)

# Re-Verdict: StockBench v3.0.0 (stockbench-v3.0.0 / 8a89c41)

## VERDICT: GREEN — conditional on one release gate (below)

---

## F2 status: CLOSED

The attestation directly refutes the specific defect I named, and does so in the strongest available form:

1. **The named defect is falsified, not just unaddressed.** My REPAIR was predicated on the answer key being byte-identical to v2 and therefore presumptively pre-dating the May-2024 T+1 transition. The scan shows the *content* is not stale even though the *bytes* are inherited: all 24 US equity/ETF settlement items state T+1; all 27 FX spot items state T+2. The zero-count in both error cells (equity-stating-T+2, FX-stating-T+1) is the decisive signature — a stale-from-v2 key would almost certainly show at least one equity T+2. The correct inference is that v2's key was already written post-transition (or written forward-looking), which is consistent with the 2026-dated scenarios (SB-L6-001, SB-L6-003). My original inference "byte-identical to v2 ⇒ pre-T+1" was wrong; the attestation shows why.

2. **The check is genuinely open-loop.** My core F2 objection was that closed-loop gates (solvability, mutation, canary) verify internal consistency, not correspondence to reality. This attestation validates stated conventions *against current real-world practice* (T+1/T+2 split, OCC non-adjustment of strikes for ordinary dividends, Reg-T 50%), which is exactly the missing loop.

3. **The division of labor between checks is sound.** The attestor's honest limit — "does not re-derive every numeric answer" — is acceptable because re-derivation is the closed-loop script's job (300/300, 0 errors). The two checks compose: closed-loop proves the answers follow from the stated conventions; open-loop proves the stated conventions match reality. That covers the stale-GT failure mode structurally, not just by sampling. The numeric spot-checks (59.56 = 60.00 − 0.44; 204.45 = 205.00 − 0.55; strike unchanged in both) confirm the composition works on real rows.

4. **Coverage of the other convention classes is adequate for the claim scope.** Reg-T 50% unchanged since 1974; margin items citing dollar capacity rather than percentages are convention-robust by construction; short-borrow items are procedural. No stale citation found in 107 + 48 + 8 items.

## Residual condition gating public release

**Signed founder/SME attestation must land before the GREEN is publishable.** The current evidence is an automated scan plus attestor spot-checks; the human sign-off is named by the attestor themselves as the final step. Until it exists, treat this as GREEN-pending, not GREEN-released. This is a gate, not a re-audit trigger — no new technical evidence is required unless the signature surfaces a discrepancy.

## What would flip this verdict

If the founder/SME review finds even one item where a stated convention contradicts current practice in a class the scanner covered, F2 reopens and the verdict reverts to REPAIR — because it would mean the scanner's classification has false negatives in-class, invalidating the zero-count argument.

## New least-sure dimension

**Recall of the convention-signal taxonomy itself.** The scan classified items into five convention classes (settlement, ex-dividend, margin/Reg-T, corporate actions, short-borrow). Its zero-stale result is only as strong as the claim that *those five classes exhaust the convention-dependent surface of the benchmark*. Items whose answers silently depend on conventions outside the taxonomy would evade detection entirely — candidates in an equities-reasoning benchmark: exchange holiday/half-day calendars used by the business-day-roll items (SB-L8-009, SB-L9-034 were checked, but only for T+1 roll logic, not calendar accuracy for their scenario dates), option contract multipliers, tick-size/price-increment assumptions, odd-lot/round-lot rules, and pattern-day-trader thresholds if any item touches them.

**Exact evidence that would close it:** either (a) the scanner's methodology showing how the five classes were derived (e.g., keyword coverage audit over all 300 prompts demonstrating no unclassified convention-bearing language), or (b) a stratified manual read of ~30 items sampled from the 300 *outside* the 51+48+107+8 tagged set, confirming they carry no untagged convention dependence. Either is a light lift and can ride alongside the founder signature; neither blocks the conditional GREEN, because the benchmark is frozen and dated-scenario (2026 dates pin conventions in-prompt), which bounds the residual risk.

---

**Summary:** F2 closed. GREEN, gated on the signed founder/SME confirmation. Least-sure: scanner taxonomy recall (unknown convention classes), with a concrete, cheap path to closure.
