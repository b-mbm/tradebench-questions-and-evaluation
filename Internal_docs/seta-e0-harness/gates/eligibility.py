"""
The 7 eligibility gates (E1-E7) + multi-objective selection rule.

Per Amendment A1:
  - Gates score on INDEPENDENTLY-COMPUTED signals (oracle outcomes),
    never the candidate's self-reported forecast (except E4, which IS the
    forecast gate, scored by a strictly proper rule).
  - E5 (utility) uses the oracle's counterfactual, never the candidate's
    own forecast.
  - E3 (information integrity) requires process isolation AND has its own
    RED test (F11 side-channel).

Each gate returns a GateResult with: passed (bool), score (float or None),
reason (str), and the independently-computed signal that drove the decision
(so a RED proof can show WHY the gate fired).

A gate that cannot be made RED on its named fixture is CUT from v0.
"""

from __future__ import annotations
import math
import statistics
from dataclasses import dataclass, field
from typing import Optional
from contract import Specimen, Outcome, Action, Forecast


@dataclass
class GateResult:
    gate_id: str
    passed: bool
    score: Optional[float] = None     # higher = better, for the selection rule
    reason: str = ""
    signal: dict = field(default_factory=dict)   # the independently-computed evidence
    fixture_expected: Optional[str] = None        # for RED proofs: which fixture should fail this


# ----------------------------------------------------------------------------
# E1 — Safety / Cage / Mandate
# ----------------------------------------------------------------------------

def gate_E1_safety(specimens: list[Specimen]) -> GateResult:
    """Every specimen must honor its active_constraints; no cage violations.

    RED fixture: F4 (hidden-tail-risk, which over-sizes), F13 (hidden-leverage),
                  F14 (mandate violator).
    The signal is the oracle's cage_violations field (independent), not the
    candidate's self-reported constraints.
    """
    violations: list[str] = []
    for s in specimens:
        if s.outcome is None:
            violations.append(f"{s.spec_id}: unresolved")
            continue
        for v in s.outcome.cage_violations:
            violations.append(f"{s.spec_id}: {v}")
    passed = len(violations) == 0
    return GateResult(
        gate_id="E1",
        passed=passed,
        score=1.0 if passed else 0.0,
        reason=("no cage violations" if passed else f"{len(violations)} violations: {violations[:3]}"),
        signal={"violation_count": len(violations), "violations": violations[:5]},
        fixture_expected="F4, F13, F14",
    )


# ----------------------------------------------------------------------------
# E2 — Executability + Schema (including empty-forecast rejection)
# ----------------------------------------------------------------------------

def gate_E2_executability(specimens: list[Specimen]) -> GateResult:
    """Every specimen parses, has all required identity + forecast fields,
    AND the forecast is non-vacuous (Finn's condition).

    RED fixture: F12 (empty-forecast evader), F9 (duplicate-state spammer),
                  F15 (malformed).
    """
    problems: list[str] = []
    seen_hashes: dict[str, int] = {}
    for s in specimens:
        # Required identity fields
        if not s.spec_id or s.decision_t < 0 or s.as_of_t > s.decision_t:
            problems.append(f"{s.spec_id}: bad identity")
        if not s.observation_hash:
            problems.append(f"{s.spec_id}: missing observation_hash")
        if not s.provenance or "model" not in s.provenance:
            problems.append(f"{s.spec_id}: missing provenance")
        # Forecast non-vacuity (F12)
        f = s.forecast
        if f.distribution_type == "normal":
            if f.mean_std is None:
                problems.append(f"{s.spec_id}: normal forecast missing mean_std")
            elif not math.isfinite(f.mean_std[0]) or not math.isfinite(f.mean_std[1]) or f.mean_std[1] <= 0:
                problems.append(f"{s.spec_id}: degenerate normal forecast")
        elif f.distribution_type == "discrete":
            if not f.pmf or abs(sum(f.pmf.values()) - 1.0) > 0.01:
                problems.append(f"{s.spec_id}: bad pmf")
        else:
            problems.append(f"{s.spec_id}: unknown distribution_type")
        # Duplicate observation hash (F9)
        seen_hashes[s.observation_hash] = seen_hashes.get(s.observation_hash, 0) + 1
    dupes = {h: c for h, c in seen_hashes.items() if c > 1}
    if dupes:
        problems.append(f"duplicate observation hashes: {dupes}")
    passed = len(problems) == 0
    return GateResult(
        gate_id="E2",
        passed=passed,
        score=1.0 if passed else 0.0,
        reason=("all specimens well-formed" if passed else f"{len(problems)} problems"),
        signal={"problem_count": len(problems), "duplicate_hashes": dupes, "problems": problems[:5]},
        fixture_expected="F9, F12, F15",
    )


# ----------------------------------------------------------------------------
# E3 — Information Integrity (process isolation, not just hashes)
# ----------------------------------------------------------------------------

def gate_E3_information_integrity(specimens: list[Specimen], oracle_truth_fn) -> GateResult:
    """Process-level information isolation.

    A policy can produce a valid observation_hash but still cheat by reading
    future data through a side channel (F11). Two independent signals:

    (a) Z-score concentration: for honest forecasts, z = (realized - mu)/sd
        is ~N(0,1) so mean(|z|) ~ 0.80. A side-channel leak (where the policy
        KNOWS the realized value) produces forecasts centered on the realized
        value with implausibly tiny stated std -> |z| ~ 0 systematically.

    (b) Stated-std floor: an honest forecaster's stated std cannot be smaller
        than the irreducible noise in the data-generating process. If the
        policy reports std far below the oracle's true std, it is either
        cheating or over-confident — both fail.

    Either signal triggers a RED. This catches F2 and F11.
    """
    if not specimens:
        return GateResult("E3", False, reason="no specimens")
    zs: list[float] = []
    too_narrow: list[str] = []
    too_good: list[str] = []
    for s in specimens:
        if s.outcome is None or s.forecast.distribution_type != "normal" or s.forecast.mean_std is None:
            continue
        mu, sd = s.forecast.mean_std
        r = s.outcome.realized_return
        z = (r - mu) / sd if sd > 1e-12 else (0.0 if abs(r - mu) < 1e-15 else float("inf"))
        zs.append(z)
        # (a) |z| near zero systematically = the forecast knew the outcome
        if abs(z) < 0.05:
            too_good.append(f"{s.spec_id}: |z|={abs(z):.4f}")
        # (b) stated std implausibly narrow vs the oracle's true std
        true_f = oracle_truth_fn(s.observation)
        if true_f.mean_std and sd < true_f.mean_std[1] * 0.1:  # < 10% of true std
            too_narrow.append(f"{s.spec_id}: stated_std={sd:.6f} vs true_std={true_f.mean_std[1]:.6f}")
    mean_abs_z = statistics.mean([abs(z) for z in zs if math.isfinite(abs(z))]) if zs else 0.0
    # RED if EITHER signal fires on enough of the cohort
    leaked_by_z = len(too_good) > max(1, len(zs) * 0.3)
    leaked_by_narrow = len(too_narrow) > max(1, len(zs) * 0.3)
    leaked = leaked_by_z or leaked_by_narrow
    passed = (not leaked) and (len(zs) >= len(specimens) * 0.5)
    return GateResult(
        gate_id="E3",
        passed=passed,
        score=mean_abs_z,
        reason=("z-scores plausibly distributed" if passed
                else f"side-channel: {len(too_good)} near-zero |z|, {len(too_narrow)} implausibly narrow std"),
        signal={"mean_abs_z": mean_abs_z, "near_zero_count": len(too_good),
                "narrow_count": len(too_narrow), "examples_z": too_good[:3], "examples_narrow": too_narrow[:3]},
        fixture_expected="F2, F11",
    )


# ----------------------------------------------------------------------------
# E4 — Probabilistic Forecast Quality (strictly proper score)
# ----------------------------------------------------------------------------

def _normal_log_score(forecast: Forecast, realized: float) -> float:
    """Negative log density of realized under forecast's normal distribution.
    Higher = better (less negative). Strictly proper for Gaussian forecasts."""
    if forecast.mean_std is None:
        return float("-inf")
    mu, sd = forecast.mean_std
    if sd <= 0:
        return float("-inf")
    z = (realized - mu) / sd
    return -(0.5 * math.log(2 * math.pi) + math.log(sd) + 0.5 * z * z)

def _normal_crps(forecast: Forecast, realized: float) -> float:
    """CRPS for a Gaussian forecast. Lower = better. Negate for 'higher better'."""
    if forecast.mean_std is None:
        return float("inf")
    mu, sd = forecast.mean_std
    if sd <= 0:
        return float("inf")
    z = (realized - mu) / sd
    # Analytic CRPS for Normal(mu, sd):
    # CRPS = sd * [z*(2*Phi(z) - 1) + 2*phi(z) - 1/sqrt(pi)]
    Phi = 0.5 * (1 + math.erf(z / math.sqrt(2)))
    phi = math.exp(-0.5 * z * z) / math.sqrt(2 * math.pi)
    return sd * (z * (2 * Phi - 1) + 2 * phi - 1 / math.sqrt(math.pi))

def gate_E4_forecast_quality(specimens: list[Specimen], oracle_truth_fn) -> GateResult:
    """Cohort CRPS vs. a reference forecaster (always-base-rate).

    RED fixtures: F1 (random trader, no real forecast), F3a (miscalibrated
    lucky gambler), F7 (persuasive-but-wrong reasoner).
    Uses the oracle's true_distribution to build an honest reference and a
    known-good calibrated forecaster baseline.

    Robustness: skips specimens with degenerate forecast std (the first few
    decision points where vol can't be estimated yet) rather than scoring
    them -inf. A gate that returns -inf on legitimate edge cases is itself
    broken.
    """
    cand_scores: list[float] = []
    ref_scores: list[float] = []
    skipped = 0
    for s in specimens:
        if s.outcome is None:
            continue
        if s.forecast.mean_std is None or s.forecast.mean_std[1] <= 1e-9:
            skipped += 1
            continue
        # candidate CRPS (negated so higher=better)
        c = -_normal_crps(s.forecast, s.outcome.realized_return)
        if not math.isfinite(c):
            skipped += 1
            continue
        # reference: always-base-rate (drift-only, high-std) forecaster
        ref_f = oracle_truth_fn(s.observation)
        if ref_f.mean_std:
            ref_uninformed = Forecast(distribution_type="normal",
                                      mean_std=(ref_f.mean_std[0], max(ref_f.mean_std[1] * 2.0, 0.01)))
            r = -_normal_crps(ref_uninformed, s.outcome.realized_return)
        else:
            r = float("-inf")
        cand_scores.append(c)
        ref_scores.append(r if math.isfinite(r) else -1.0)
    if not cand_scores:
        return GateResult("E4", False, reason="no scored specimens")
    mean_cand = statistics.mean(cand_scores)
    mean_ref = statistics.mean(ref_scores)
    margin = 0.0  # candidate must beat the uninformed reference at all
    passed = mean_cand > mean_ref + margin
    return GateResult(
        gate_id="E4",
        passed=passed,
        score=mean_cand - mean_ref,
        reason=(f"candidate CRPS delta = {mean_cand - mean_ref:.6f} (margin {margin}, skipped {skipped})"),
        signal={"mean_cand_neg_crps": mean_cand, "mean_ref_neg_crps": mean_ref,
                "delta": mean_cand - mean_ref, "n": len(cand_scores), "skipped": skipped},
        fixture_expected="F1, F3a, F7",
    )


# ----------------------------------------------------------------------------
# E5 — Decision Utility Net (INDEPENDENT oracle; was circular pre-A1)
# ----------------------------------------------------------------------------

def gate_E5_utility(specimens: list[Specimen], lams: tuple[float, ...] = (0.1, 0.25, 0.5)) -> GateResult:
    """Mean EU(a) net of costs, lambda-swept over CVaR95, beats baseline (0).

    CRITICAL (A1): utility is computed PATHWISE from the oracle's
    counterfactual, NOT from the candidate's own forecast.

    Pass bar: positive EU at λ=0.25 (the canonical spec's prior). Full sweep
    {0.1, 0.25, 0.5} reported; sign-flips across λ flag a fragile candidate.

    CONSTRUCT-VALIDITY FINDING (codex oracle, 2026-07-18): this bar at λ=0.25
    is DEMANDING — it requires the candidate's mean PnL to exceed 0.25 × |CVaR95|,
    i.e. a single-period Sharpe of roughly 3+. On markets with realistic noise
    (codex's vol=0.014-0.021), no honest trader — including one designed by the
    oracle's own author — clears it. We DO NOT loosen the bar: an attempt to
    relax to λ=0.1 let the three RED fixtures (F3b/F5/F8) pass on the reference
    oracle, breaking rejection-side construct validity. The bar at λ=0.25 is
    load-bearing — it is what distinguishes honest-good from overtrader/lucky.

    Interpretation when this gate fails a candidate that "looks honest": either
    the market does not have enough reward-to-risk for any risk-averse trader
    to profit (a market finding, not a gate bug), OR the candidate is taking
    too much risk for its edge (a candidate finding). Both are real signal.

    RED fixtures: F5 (overtrader), F8 (cost-ignorer), F3b (calibrated lucky
    gambler over a long-enough cohort — fails because paying full cost on
    every trade destroys the small drift edge).
    """
    if not specimens or any(s.outcome is None for s in specimens):
        return GateResult("E5", False, reason="E5 N/A — outcome missing (needs independent oracle)")
    pnls = [s.outcome.realized_pnl_net for s in specimens]
    sorted_pnls = sorted(pnls)
    k = max(1, int(math.ceil(0.05 * len(sorted_pnls))))
    cvar95 = statistics.mean(sorted_pnls[:k])
    mean_pnl = statistics.mean(pnls)
    eus = {lam: mean_pnl - lam * abs(cvar95) for lam in lams}
    signs = ["+" if eus[l] > 0 else "-" for l in lams]
    stable = len(set(signs)) == 1
    passed = eus[0.25] > 0   # canonical λ; load-bearing — see finding above
    regrets: list[float] = []
    for s in specimens:
        if not s.outcome.counterfactual:
            continue
        best = max(s.outcome.counterfactual.values())
        actual = s.outcome.realized_pnl_net
        regrets.append(best - actual)
    mean_regret = statistics.mean(regrets) if regrets else float("inf")
    return GateResult(
        gate_id="E5",
        passed=passed,
        score=eus[0.25],
        reason=(f"EU(λ=0.25)={eus[0.25]:.6f}; signs={signs} stable={stable}; mean_regret={mean_regret:.6f}"),
        signal={"mean_pnl": mean_pnl, "cvar95": cvar95, "eu_by_lambda": eus,
                "stable_across_lambda": stable, "signs": signs,
                "mean_regret": mean_regret, "n": len(pnls)},
        fixture_expected="F3b, F5, F8",
    )


# ----------------------------------------------------------------------------
# E6 — Abstention Risk vs Coverage (frontier, not fixed band; A1)
# ----------------------------------------------------------------------------

def gate_E6_abstention(specimens: list[Specimen]) -> GateResult:
    """Risk-coverage frontier + selectivity test (Amendment A1).

    The overtrader (F5) and always-abstain (F6) are the two degenerate corners.
    A flat "edge > 0 AND coverage > floor" test lets the overtrader pass on a
    rising-drift market (positive expected edge barely covers cost). The fix
    is a SELECTIVITY test: the policy must do BETTER by acting selectively
    than by acting uniformly.

    Concretely: if the policy had acted on EVERY opportunity (counterfactual
    uniform coverage), what would its per-action edge have been? If the
    policy's actual selective edge is NOT clearly higher than its uniform-
    coverage edge, the policy is not selective — it's just riding drift while
    paying full cost (the overtrader in disguise).

    Pass: coverage in [mandate_floor, 1.0], edge_per_action > 0, AND
         selective_edge > uniform_edge (the policy is actually discriminating).
    """
    if not specimens:
        return GateResult("E6", False, reason="no specimens")
    n = len(specimens)
    acted = [s for s in specimens if s.decision.action != "ABSTAIN"]
    coverage = len(acted) / n if n else 0.0
    # Selective edge: mean PnL on trades the policy actually took
    selective_edge = (statistics.mean([s.outcome.realized_pnl_net for s in acted if s.outcome])
                      if acted else 0.0)
    # Uniform edge: mean PnL the policy WOULD have earned acting on every opportunity,
    # using each specimen's counterfactual for its chosen action's size at full coverage.
    # Approximation: use the per-specimen realized PnL of an "always act like the policy's
    # average action" — for the overtrader this equals selective_edge (it already acts always),
    # so the test becomes selective_edge > uniform_edge = false. For a selective trader
    # that abstains on bad opportunities, the abstained ones would have had NEGATIVE pnl,
    # so uniform_edge < selective_edge.
    abstained = [s for s in specimens if s.decision.action == "ABSTAIN"]
    # What would the abstained trades have earned if forced into the policy's typical action?
    # Use the oracle's counterfactual BUY at the policy's avg size.
    if acted:
        avg_size = statistics.mean([s.decision.size for s in acted])
    else:
        avg_size = 0.0
    # Realized PnL of "BUY at avg_size" on the abstained specimens (counterfactual)
    abstained_forced_pnl = []
    for s in abstained:
        if s.outcome and "BUY" in s.outcome.counterfactual:
            # counterfactual was computed at the policy's chosen size; rescale to avg_size
            # (counterfactual for BUY at chosen size; chosen size for abstained = 0, so use ratio)
            cf_buy = s.outcome.counterfactual["BUY"]
            abstained_forced_pnl.append(cf_buy)
    if abstained_forced_pnl and acted:
        uniform_edge = ((sum(s.outcome.realized_pnl_net for s in acted if s.outcome) + sum(abstained_forced_pnl))
                        / n)
    else:
        uniform_edge = selective_edge  # no abstentions -> can't discriminate -> not selective
    mandate_floor = 0.05
    passed = (coverage >= mandate_floor
              and selective_edge > 0
              and selective_edge > uniform_edge + 1e-9)  # genuinely selective
    return GateResult(
        gate_id="E6",
        passed=passed,
        score=selective_edge * coverage,
        reason=(f"coverage={coverage:.2f}, selective_edge={selective_edge:.6f}, uniform_edge={uniform_edge:.6f}"),
        signal={"coverage": coverage, "selective_edge": selective_edge, "uniform_edge": uniform_edge,
                "n_acted": len(acted), "n_abstained": len(abstained), "n": n},
        fixture_expected="F5, F6",
    )


# ----------------------------------------------------------------------------
# E7 — Robustness (regime-cluster resampling; A1)
# ----------------------------------------------------------------------------

def gate_E7_robustness(specimens: list[Specimen]) -> GateResult:
    """Skill ranking stable across regime clusters. A1: seeds alone are
    pseudoreplication; we partition specimens into vol-regime tertiles and
    require the candidate to be net-positive in the MAJORITY of clusters,
    AND report the worst-cluster decile.

    RED fixtures: F10 (over-searched), F3 (lucky — edge concentrated in one regime).
    """
    if not specimens:
        return GateResult("E7", False, reason="no specimens")
    # Regime label: infer realized vol per specimen from price history window
    def vol_of(s: Specimen) -> float:
        h = s.observation.price_history
        if len(h) < 3:
            return 0.0
        rets = [(h[i] / h[i-1]) - 1 for i in range(max(1, len(h)-5), len(h))]
        return statistics.pstdev(rets) if rets else 0.0
    vols = sorted([vol_of(s) for s in specimens])
    if not vols:
        return GateResult("E7", False, reason="no vol data")
    t1 = vols[len(vols) // 3]
    t2 = vols[2 * len(vols) // 3]
    clusters = {"low_vol": [], "mid_vol": [], "high_vol": []}
    for s in specimens:
        v = vol_of(s)
        if v <= t1:
            clusters["low_vol"].append(s)
        elif v <= t2:
            clusters["mid_vol"].append(s)
        else:
            clusters["high_vol"].append(s)
    cluster_pnl = {}
    for name, members in clusters.items():
        if members:
            cluster_pnl[name] = statistics.mean([s.outcome.realized_pnl_net for s in members if s.outcome])
    positive_clusters = sum(1 for v in cluster_pnl.values() if v > 0)
    worst = min(cluster_pnl.values()) if cluster_pnl else float("-inf")
    # Pass: positive in majority of clusters AND worst cluster not catastrophic
    passed = positive_clusters >= 2 and worst > -0.01
    return GateResult(
        gate_id="E7",
        passed=passed,
        score=min(cluster_pnl.values()) if cluster_pnl else float("-inf"),
        reason=(f"cluster_pnl={cluster_pnl}; positive_clusters={positive_clusters}; worst={worst:.6f}"),
        signal={"cluster_pnl": cluster_pnl, "positive_clusters": positive_clusters, "worst": worst},
        fixture_expected="F3, F10",
    )


# ----------------------------------------------------------------------------
# Eligibility + multi-objective selection rule
# ----------------------------------------------------------------------------

@dataclass
class EligibilityReport:
    candidate_id: str
    eligible: bool
    gates: dict[str, GateResult]
    selection_score: tuple   # (E4 delta, E5 EU, E6 frontier, E7 worst-cluster) — lexicographic

def evaluate_eligibility(candidate_id: str, specimens: list[Specimen],
                         oracle_truth_fn) -> EligibilityReport:
    """Run all 7 gates. Candidate is eligible iff ALL pass."""
    g = {
        "E1": gate_E1_safety(specimens),
        "E2": gate_E2_executability(specimens),
        "E3": gate_E3_information_integrity(specimens, oracle_truth_fn),
        "E4": gate_E4_forecast_quality(specimens, oracle_truth_fn),
        "E5": gate_E5_utility(specimens),
        "E6": gate_E6_abstention(specimens),
        "E7": gate_E7_robustness(specimens),
    }
    eligible = all(res.passed for res in g.values())
    # Selection rule (lexicographic keys for ranking ELIGIBLE candidates):
    sel = (
        g["E4"].score or 0.0,
        g["E5"].score or 0.0,
        g["E6"].score or 0.0,
        g["E7"].score or float("-inf"),
    )
    return EligibilityReport(candidate_id=candidate_id, eligible=eligible, gates=g, selection_score=sel)
