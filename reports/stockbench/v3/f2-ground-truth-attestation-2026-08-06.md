# StockBench v3 — F2 ground-truth attestation (time-sensitive conventions)

**Date:** 2026-08-06
**Tag:** `stockbench-v3.0.0` (commit 8a89c41)
**Purpose:** resolve Fable
audit finding **F2** (stale ground truth — answer key inherited byte-identical from v2, with no
check that time-sensitive market conventions still match reality).

This is a dated attestation covering the convention classes Fable named. It is an automated scan
of all 300 answer keys plus spot-checks of representative numeric answers, performed against the
tagged source. **No benchmark content was changed to produce this report.** Any repair requires
explicit founder sign-off.

## Scope: what "time-sensitive" means here

F2's concrete risk: US equity settlement moved T+2 → T+1 on **May 28, 2024**. A v2-era benchmark
frozen byte-identical across that transition could encode the old convention while every closed-loop
gate still reports green. The same risk class applies to any answer key tied to a dated rule.

## Method

1. Scan all 300 question prompts for convention-dependent signals: settlement timing (T+N),
   ex-dividend mechanics, margin/Reg-T, corporate actions, short-borrow.
2. For each convention class, classify by asset type and check the stated rule against the
   current real-world convention.
3. Spot-check representative numeric answer keys against stated rules.

## Findings by convention class

### 1. Settlement timing — ✅ ZERO STALE

214 questions are convention-dependent overall; **51** carry an explicit settlement-timing rule.
Classified by asset type:

| Asset | Count | Convention in benchmark | Current real-world rule | Verdict |
| --- | --- | --- | --- | --- |
| US equity / ETF | 24 | **T+1** (every item) | T+1 since May 28, 2024 | ✅ current |
| FX spot (EURUSD etc.) | 27 | **T+2** (every item) | T+2 (unchanged) | ✅ current |

**Decisive check:** zero equity-items-stating-T+2 (would be stale) and zero FX-items-stating-T+1
(would be wrong). The benchmark authors correctly distinguished the two settlement regimes, and
the May 2024 T+1 transition **is reflected** in the equity/ETF items. Examples verified:

- `SB-L6-001` (US equities): "T+1 business day", `settlement_cash_date: 2026-06-16` ✅
- `SB-L6-003` (EURUSD spot): "Proceeds settle T+2", `settlement_cash_date: 2026-06-25` ✅ (FX, not stale)
- `SB-L8-002` (SPY ETF): "equities settle T+1", cash date 2026-06-16 ✅
- `SB-L9-036` (MSFT / sector ETF leg): "equities/ETFs settle T+1" ✅

The calendar-holiday variant (`SB-L8-009`, `SB-L9-034`: "next day is a settlement holiday, so
T+1 cash lands on the stated date") is also current — it tests the business-day-roll mechanic
under T+1, which is correct.

### 2. Ex-dividend mechanics — ✅ CURRENT, arithmetic verified

48 ex-dividend items, in two coherent families:

- **`ex_dividend_adjustment` / `corporate_action_adjustment`** (8 items): all correctly state the
  standard convention — *"GTC equity stop prices are reduced by the ordinary cash dividend on
  ex-dividend date; listed option strikes are not adjusted for ordinary cash dividends."* This is
  current OCC/DTC practice for ordinary cash dividends.
  - Numeric spot-check `SB-L9-007`: stop 60.00 − dividend 0.44 = **59.56** ✅; option strike
    unchanged at 62.50 ✅.
  - Numeric spot-check `SB-L9-043` (the CoinBench-namesake, distinct StockBench question):
    route_a, `adjusted_stop_price: 204.45` (= 205.00 − 0.55) ✅; option strike unchanged at 210 ✅.
- **Assignment / roll / exercise** (40 items): use the ex-dividend *date* as an early-exercise
  timing input, not the strike-adjustment convention. No staleable convention claim.

### 3. Margin / Reg-T — ✅ NO STALE PERCENTAGES

107 questions mention margin/Reg-T, but they state margin as **dollar capacity** ("Margin
capacity: 20,000 USD") rather than citing percentage requirements. The only implied rate is
Reg-T 50% initial margin (unchanged since 1974) and standard portfolio-margin mechanics — both
current. No item cites a specific maintenance % or Rule 15c3-3 tier that could have changed.

### 4. Short-borrow — ✅ CURRENT

8 borrow/short items (locate, recall, hard-to-borrow) state operational rules (locate required
before short sale; recall forces buy-to-cover). These are procedural and current; no Reg-SHO
threshold-list specific that could have shifted.

## Verdict on F2

**No stale ground truth found.** The benchmark's time-sensitive conventions — specifically the
May 2024 equity T+1 transition that Fable named — are correctly reflected. Equity/ETF settlement
is T+1 throughout; FX is T+2 throughout; ex-dividend and margin conventions are current and
arithmetic-checked.

## Honest limits of this attestation

- This is an **automated scan plus spot-checks**, not a row-by-row SME read of all 300 answer
  keys. It covers the named convention classes (settlement, ex-div, margin, borrow) decisively but
  does not validate every numeric answer in the corpus.
- It checks that **stated conventions** match reality; it does not independently re-derive every
  numeric answer from first principles (the solvability script does the closed-loop re-derivation;
  this attestation adds the open-loop "does the convention still hold" check F2 asked for).
- Signed founder/SME confirmation of this attestation is the remaining step to close F2 for a
  public GREEN claim.

## Recommendation

F2 is resolved at the **automated-evidence** level: zero stale conventions, T+1 transition
reflected, key arithmetic verified. Combined with the prior closed-loop gates (ALL_300_VERIFIED,
mutation 300/300, categorical canary), this addresses Fable's "least-sure dimension." Re-submitting
this resolution to Fable for re-verdict is the next step; a founder signature on this attestation
is the final GREEN gate.

## Founder sign-off

**Status:** APPROVED — 2026-08-06
**Founder:** b-mbm (Bradley Miles), repo git user
**Authorization:** explicit ("sign off commit and tag"), covering this attestation and the
StockBench v3.0.0 scoped static release.

Basis of sign-off: founder-directed and reviewed the F2 scan methodology and results in-thread
before authorizing; the automated scan (zero stale conventions across settlement/ex-dividend/
margin/borrow classes) plus Fable's substantive GREEN re-verdict constitute the supported
evidence. This sign-off closes Fable's "GREEN-pending-signature" condition. It does **not**
assert a manual row-by-row SME read of all 300 numeric answers — that limit is stated above and
is why this is a **scoped static** benchmark claim, not a psychometric or live-execution claim.

Fable's residual "least-sure dimension" (scanner-taxonomy recall — untagged convention classes
such as holiday calendars, tick sizes, odd-lot rules) is accepted as a known, bounded residual
risk consistent with a frozen, dated-scenario static benchmark. It does not block this scoped
GREEN; it is recorded for future re-audit.
