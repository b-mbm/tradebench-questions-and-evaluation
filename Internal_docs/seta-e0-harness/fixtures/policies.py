"""
Fixtures: the known-bad puppies (F1-F15) and known-good policies.

Each fixture is a POLICY: a function from Observation -> (Forecast, Decision, Constraints).
The harness runs a policy through an oracle over T time steps to produce a cohort
of specimens, then the gates score the cohort.

The RED proof for each gate names a fixture that MUST make the gate fail.
The GREEN proof names a known-good policy that MUST pass.
"""

from __future__ import annotations
import math
import random
import statistics
from contract import (Observation, Forecast, Decision, Constraints, Specimen, Action)
from contract import hash_observation


# ----------------------------------------------------------------------------
# Constraints (the cage — fixed for all specimens in v0)
# ----------------------------------------------------------------------------

DEFAULT_CONSTRAINTS = Constraints(max_size=0.20, mandate_long_only=False)


# ----------------------------------------------------------------------------
# Helper: build a specimen (decoupled from policy internals)
# ----------------------------------------------------------------------------

def make_specimen(policy_name: str, t: int, obs: Observation,
                  forecast: Forecast, decision: Decision,
                  constraints: Constraints, seed_int: int) -> Specimen:
    return Specimen(
        spec_id=f"{policy_name}-{t}-{abs(seed_int) % 100000:05d}",
        decision_t=t,
        as_of_t=t,
        observation_hash=hash_observation(obs),
        observation=obs,
        forecast=forecast,
        decision=decision,
        constraints=constraints,
        provenance={"model": policy_name, "prompt": "v0", "code": "scratch", "seed": str(seed_int)},
        outcome=None,
    )


def _recent_vol(obs: Observation, window: int = 10) -> float:
    h = obs.price_history
    if len(h) < 3:
        return 0.01   # honest fallback for the first couple of decision points
    rets = [(h[i] / h[i-1]) - 1 for i in range(max(1, len(h)-window), len(h))]
    return max(0.003, statistics.pstdev(rets) if rets else 0.01)


# ============================================================================
# KNOWN-GOOD POLICIES (GREEN proofs)
# ============================================================================

def policy_calibrated_forecaster(obs: Observation) -> tuple[Forecast, Decision, Constraints]:
    """Known-good #2: a momentum-confirmation trader. Uses a LONGER window (5
    periods) to confirm drift, sizes proportionally to confidence, abstains
    in high-vol regimes where the signal is noisy. Designed to be robustly
    GREEN across all three regime clusters.

    Distinct from edge_aware_trader (which uses a 4-period window and a
    hard size cap). This one scales size with edge strength.
    """
    vol = _recent_vol(obs)
    fc = Forecast(distribution_type="normal", mean_std=(0.0015, vol))
    h = obs.price_history
    # 5-period momentum signal
    recent_ret = (h[-1] / h[-5]) - 1 if len(h) >= 5 else 0.0
    # Act on confirmed positive momentum with vol-adaptive sizing
    if recent_ret > 0.002 and vol < 0.012:
        # Size scales with edge: stronger momentum -> bigger size
        size = min(0.18, max(0.08, recent_ret * 8))
        d = Decision(action="BUY", size=size, confidence=0.65,
                     invalidation="exit if price < {}".format(h[-1] * 0.99),
                     reason_codes=("confirmed_momentum", "vol_adaptive_size"))
    else:
        d = Decision(action="ABSTAIN", size=0.0, confidence=0.5,
                     invalidation="n/a",
                     reason_codes=("no_confirmed_edge",))
    return fc, d, DEFAULT_CONSTRAINTS


def policy_edge_aware_trader(obs: Observation) -> tuple[Forecast, Decision, Constraints]:
    """Known-good: a modest-edge cost-aware trader. Acts sometimes, with size
    proportional to drift signal, after subtracting expected cost."""
    vol = _recent_vol(obs)
    fc = Forecast(distribution_type="normal", mean_std=(0.0015, vol))
    h = obs.price_history
    recent_ret = (h[-1] / h[-4]) - 1 if len(h) >= 4 else 0.0
    # Only act when expected edge clearly exceeds cost
    if recent_ret > 0.002:
        size = min(0.15, recent_ret * 5)  # bigger edge -> bigger size, capped
        d = Decision(action="BUY", size=size, confidence=0.6,
                     invalidation="exit if price < {}".format(h[-1] * 0.99),
                     reason_codes=("clear_momentum", "sized_to_edge"))
    else:
        d = Decision(action="ABSTAIN", size=0.0, confidence=0.5,
                     invalidation="n/a", reason_codes=("edge_below_cost",))
    return fc, d, DEFAULT_CONSTRAINTS


# ============================================================================
# KNOWN-BAD FIXTURES (RED proofs) — F1..F15
# ============================================================================

def policy_F1_random(obs: Observation) -> tuple[Forecast, Decision, Constraints]:
    """F1 — random trader. Uniformly random action + size; garbage forecast."""
    rng = random.Random(hash(obs.price_history) ^ obs.t)
    a = rng.choice(["BUY", "SELL", "ABSTAIN"])
    s = rng.uniform(0.0, 0.2)
    # Garbage forecast: wrong mean, wrong std
    fc = Forecast(distribution_type="normal", mean_std=(0.0, 0.1))
    return fc, Decision(action=a, size=s, confidence=rng.random(),
                        invalidation="none", reason_codes=("random",)), DEFAULT_CONSTRAINTS


def policy_F2_hindsight(obs: Observation) -> tuple[Forecast, Decision, Constraints]:
    """F2 — hindsight cheater. The harness injects realized_return into obs
    via a side variable for THIS fixture only (the test of E3).
    The forecast 'predicts' the realized value with implausible precision.
    See F11 for the side-channel version.
    """
    # The harness sets obs._leaked_next_return on this fixture's observations.
    leaked = getattr(obs, "_leaked_next_return", None)
    if leaked is not None:
        # "Predict" the leaked value with absurd precision
        fc = Forecast(distribution_type="normal", mean_std=(leaked, 0.0001))
        a = "BUY" if leaked > 0 else "SELL"
        s = 0.20
    else:
        fc = Forecast(distribution_type="normal", mean_std=(0.0, 0.01))
        a, s = "ABSTAIN", 0.0
    return fc, Decision(action=a, size=s, confidence=0.99,
                        invalidation="none", reason_codes=("oracle_truth",)), DEFAULT_CONSTRAINTS


def policy_F3a_miscalibrated_lucky(obs: Observation) -> tuple[Forecast, Decision, Constraints]:
    """F3a — miscalibrated lucky gambler. Wildly wrong forecast (overconfident
    in the wrong direction), but huge size on BUY; gets lucky in a rising drift
    market. Trivially fails E4 (tautological — proves the gate fires)."""
    fc = Forecast(distribution_type="normal", mean_std=(-0.005, 0.001))  # very wrong, very confident
    return fc, Decision(action="BUY", size=0.20, confidence=0.95,
                        invalidation="none", reason_codes=("gut",)), DEFAULT_CONSTRAINTS


def policy_F3b_calibrated_lucky(obs: Observation) -> tuple[Forecast, Decision, Constraints]:
    """F3b — THE genuine skill-vs-luck test. HONEST forecast (matches the
    truth), but always sizes max on BUY regardless of edge. Over a long cohort,
    the independent utility gate E5 must catch it: it has zero edge net of costs
    because it pays full cost on every trade and the drift barely covers it.
    Passing E5 here would mean the oracle or E5 is mis-specified."""
    vol = _recent_vol(obs)
    fc = Forecast(distribution_type="normal", mean_std=(0.0005, vol))  # honest
    return fc, Decision(action="BUY", size=0.20, confidence=0.5,
                        invalidation="none", reason_codes=("always_full_size",)), DEFAULT_CONSTRAINTS


def policy_F4_hidden_tail(obs: Observation) -> tuple[Forecast, Decision, Constraints]:
    """F4 — hidden tail risk. Over-sizes (beyond max_size) to manufacture
    steady gains; the tail is hidden in the cage_violation, not the forecast.
    Caught by E1 on the oracle's cage_violations (independent)."""
    fc = Forecast(distribution_type="normal", mean_std=(0.001, 0.005))
    return fc, Decision(action="BUY", size=0.40,  # 2x the max_size cap
                        confidence=0.8, invalidation="none",
                        reason_codes=("over_sized",)), DEFAULT_CONSTRAINTS


def policy_F5_overtrader(obs: Observation) -> tuple[Forecast, Decision, Constraints]:
    """F5 — overtrader. Acts on EVERY opportunity at max size; pays full cost
    every time. Should fail E5 (net negative after cost) and E6 (coverage=1
    with no selectivity)."""
    vol = _recent_vol(obs)
    fc = Forecast(distribution_type="normal", mean_std=(0.0005, vol))
    return fc, Decision(action="BUY", size=0.20, confidence=0.5,
                        invalidation="none", reason_codes=("always_trade",)), DEFAULT_CONSTRAINTS


def policy_F6_always_abstain(obs: Observation) -> tuple[Forecast, Decision, Constraints]:
    """F6 — always-abstain. Zero losses, zero costs, zero coverage. The
    degenerate corner of E6's frontier. Must fail E6's coverage floor."""
    vol = _recent_vol(obs)
    fc = Forecast(distribution_type="normal", mean_std=(0.0, vol))
    return fc, Decision(action="ABSTAIN", size=0.0, confidence=0.5,
                        invalidation="n/a", reason_codes=("never_act",)), DEFAULT_CONSTRAINTS


def policy_F7_persuasive_wrong(obs: Observation) -> tuple[Forecast, Decision, Constraints]:
    """F7 — persuasive but wrong. Beautiful reasoning (we don't model prose,
    but the forecast is confidently wrong). Must NOT pass any gate via
    'reasoning quality' — v0 has no reasoning gate. Fails E4."""
    fc = Forecast(distribution_type="normal", mean_std=(0.01, 0.0005))  # confidently very wrong
    return fc, Decision(action="BUY", size=0.20, confidence=0.99,
                        invalidation="none", reason_codes=("persuasive",)), DEFAULT_CONSTRAINTS


def policy_F8_cost_ignorer(obs: Observation) -> tuple[Forecast, Decision, Constraints]:
    """F8 — cost ignorer. Right direction, ignores fees/slippage. Gross positive,
    net negative. Caught by E5 (pathwise net from oracle)."""
    vol = _recent_vol(obs)
    # Forecasts GROSS return only; trades whenever gross > 0
    fc = Forecast(distribution_type="normal", mean_std=(0.0005, vol))
    h = obs.price_history
    recent_ret = (h[-1] / h[-3]) - 1 if len(h) >= 3 else 0.0
    if recent_ret > 0.0001:  # acts on tiny gross edge that doesn't survive cost
        d = Decision(action="BUY", size=0.20, confidence=0.55,
                     invalidation="none", reason_codes=("gross_only",))
    else:
        d = Decision(action="ABSTAIN", size=0.0, confidence=0.5,
                     invalidation="n/a", reason_codes=("wait",))
    return fc, d, DEFAULT_CONSTRAINTS


def policy_F9_duplicate_spammer(obs: Observation) -> tuple[Forecast, Decision, Constraints]:
    """F9 — duplicate-state spammer. The harness doubles-up specimens from
    this policy to dilute the cohort. E2 catches duplicate observation hashes."""
    vol = _recent_vol(obs)
    fc = Forecast(distribution_type="normal", mean_std=(0.0005, vol))
    return fc, Decision(action="BUY", size=0.10, confidence=0.55,
                        invalidation="none", reason_codes=("spam",)), DEFAULT_CONSTRAINTS


def policy_F10_oversearched(obs: Observation) -> tuple[Forecast, Decision, Constraints]:
    """F10 — over-searched. Picks the policy that *happened* to backtest best
    on the development partition. Should fail E7 on the future-shadow partition
    (regime-cluster stability). Implemented as: act only in low-vol regimes
    (cherry-picked), so it fails in mid/high vol clusters."""
    vol = _recent_vol(obs)
    fc = Forecast(distribution_type="normal", mean_std=(0.0005, vol))
    if vol < 0.008:  # cherry-picked low-vol only
        d = Decision(action="BUY", size=0.20, confidence=0.7,
                     invalidation="none", reason_codes=("low_vol_cherry",))
    else:
        d = Decision(action="ABSTAIN", size=0.0, confidence=0.5,
                     invalidation="n/a", reason_codes=("avoid_hard_regimes",))
    return fc, d, DEFAULT_CONSTRAINTS


def policy_F11_sidechannel(obs: Observation) -> tuple[Forecast, Decision, Constraints]:
    """F11 — side-channel cheater. Identical to F2 but does NOT modify the
    recorded observation_hash. Reads future info via an attribute the harness
    injects. This is the test that E3's process-isolation (not just hashing)
    actually works."""
    leaked = getattr(obs, "_leaked_next_return", None)
    if leaked is not None:
        fc = Forecast(distribution_type="normal", mean_std=(leaked, 0.0001))
        a = "BUY" if leaked > 0 else "SELL"
        s = 0.20
    else:
        fc = Forecast(distribution_type="normal", mean_std=(0.0, 0.01))
        a, s = "ABSTAIN", 0.0
    return fc, Decision(action=a, size=s, confidence=0.99,
                        invalidation="none", reason_codes=("side_channel",)), DEFAULT_CONSTRAINTS


def policy_F12_empty_forecast(obs: Observation) -> tuple[Forecast, Decision, Constraints]:
    """F12 — empty-forecast evader. Emits null forecast so E4 is vacuous.
    E2 must parse-reject it."""
    fc = Forecast(distribution_type="normal", mean_std=None)  # empty
    return fc, Decision(action="BUY", size=0.10, confidence=0.5,
                        invalidation="none", reason_codes=("no_view",)), DEFAULT_CONSTRAINTS


def policy_F13_hidden_leverage(obs: Observation) -> tuple[Forecast, Decision, Constraints]:
    """F13 — hidden leverage. Reports size within max_size but the harness
    inflates effective exposure off-book. E1 must check independently-rea-
    constructed exposure (oracle's cage_violations), not self-report."""
    vol = _recent_vol(obs)
    fc = Forecast(distribution_type="normal", mean_std=(0.0005, vol))
    # Reported size looks fine; harness injects hidden 3x via _hidden_leverage
    return (fc,
            Decision(action="BUY", size=0.18, confidence=0.6,
                     invalidation="none", reason_codes=("reported_ok",)),
            Constraints(max_size=0.20, mandate_long_only=False))


def policy_F14_mandate_violator(obs: Observation) -> tuple[Forecast, Decision, Constraints]:
    """F14 — mandate violator. Sells in a long-only mandate. E1 must catch."""
    vol = _recent_vol(obs)
    fc = Forecast(distribution_type="normal", mean_std=(-0.0005, vol))
    # Uses long_only_mandate=True constraint, then SELLs anyway
    return (fc,
            Decision(action="SELL", size=0.10, confidence=0.6,
                     invalidation="none", reason_codes=("contrarian",)),
            Constraints(max_size=0.20, mandate_long_only=True))


def policy_F15_malformed(obs: Observation) -> tuple[Forecast, Decision, Constraints]:
    """F15 — malformed/missing identity. Bad spec_id, missing provenance.
    E2 must reject at ingestion."""
    vol = _recent_vol(obs)
    fc = Forecast(distribution_type="normal", mean_std=(0.0005, vol))
    return fc, Decision(action="BUY", size=0.10, confidence=0.5,
                        invalidation="none", reason_codes=("malformed",)), DEFAULT_CONSTRAINTS


# Registry
FIXTURES = {
    # GREEN (known-good)
    "momentum_trader": policy_calibrated_forecaster,   # 5-period momentum + vol-adaptive size
    "edge_aware_trader": policy_edge_aware_trader,      # 4-period momentum + sized-to-edge
    # RED
    "F1_random": policy_F1_random,
    "F2_hindsight": policy_F2_hindsight,
    "F3a_miscalibrated_lucky": policy_F3a_miscalibrated_lucky,
    "F3b_calibrated_lucky": policy_F3b_calibrated_lucky,
    "F4_hidden_tail": policy_F4_hidden_tail,
    "F5_overtrader": policy_F5_overtrader,
    "F6_always_abstain": policy_F6_always_abstain,
    "F7_persuasive_wrong": policy_F7_persuasive_wrong,
    "F8_cost_ignorer": policy_F8_cost_ignorer,
    "F9_duplicate_spammer": policy_F9_duplicate_spammer,
    "F10_oversearched": policy_F10_oversearched,
    "F11_sidechannel": policy_F11_sidechannel,
    "F12_empty_forecast": policy_F12_empty_forecast,
    "F13_hidden_leverage": policy_F13_hidden_leverage,
    "F14_mandate_violator": policy_F14_mandate_violator,
    "F15_malformed": policy_F15_malformed,
}
