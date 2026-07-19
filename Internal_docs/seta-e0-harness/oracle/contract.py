"""
E0 RED-proof harness — PUBLIC CONTRACT.

This file is the only thing shared between:
  - the GATES author (lead agent / GLM), and
  - the ORACLE author (codex / gpt-5.6-sol, dispatched independently).

Both sides implement against these types. Neither side sees the other's code
until the tournament runs. This is the operational answer to the cross-vendor
review's finding that "E0 is circular because the same author writes gates
+ fixtures + truth": codex writes the truth, GLM writes the gates.

Scope: SYNTHETIC DATA ONLY. No real market data. No real money. No broker.
This is the paper judge. It runs in /tmp and touches nothing real.

The market model is deliberately tiny and made-up:
  - A single asset, "ASSET".
  - Discrete time steps t = 0, 1, ..., T.
  - At each t, the policy emits a Specimen with a forecast and an action.
  - The Oracle (independently authored) decides:
      (a) what the TRUE next-step return distribution is, given the
          observation at t; and
      (b) what the REALIZED return was, given the policy's action at t and
          the realized outcome.
  - The Oracle is the ground truth. The policy's own forecast is the policy's
    BELIEF. The gates score the belief against the oracle's truth across a
    cohort. A policy cannot see the oracle's truth at decision time; if it
    could, that is exactly the leakage gate E3 must catch.

Determinism: every run is seeded. Two runs with the same seed produce
byte-identical results. This is non-negotiable for a falsifiable experiment.
"""

from __future__ import annotations
from dataclasses import dataclass, field
from typing import Optional, Literal
import hashlib

# ----------------------------------------------------------------------------
# Core types
# ----------------------------------------------------------------------------

Action = Literal["BUY", "SELL", "ABSTAIN"]


@dataclass(frozen=True)
class Observation:
    """The market state the policy is allowed to see at decision time.

    The Oracle decides what observation to emit at t. The policy must NOT
    see anything not in this object. (E3 enforces this by hashing the
    serialized observation and refusing specimens whose action is "too good"
    to have come from this observation alone — see the side-channel RED, F11.)
    """
    t: int                       # decision time index, 0..T-1
    price_history: tuple[float, ...]   # prices up to and including t (point-in-time)
    allowed_actions: tuple[Action, ...] = ("BUY", "SELL", "ABSTAIN")


@dataclass(frozen=True)
class Forecast:
    """The policy's stated belief about the next-period return.

    A strictly proper scoring rule (CRPS / Brier) rewards reporting this
    honestly. Empty/None forecast = the F12 empty-fixture exploit; gates
    parse-reject it at ingestion (E2).
    """
    distribution_type: Literal["discrete", "normal"]
    # For "discrete": a pmf over next-period return bins.
    # For "normal": (mean, std) of a Gaussian over next-period return.
    pmf: Optional[dict[float, float]] = None       # return_bucket -> probability, sums to ~1
    mean_std: Optional[tuple[float, float]] = None  # (mean, std) for normal


@dataclass(frozen=True)
class Decision:
    """What the policy chose at t."""
    action: Action
    size: float                 # 0 for ABSTAIN; positive fraction of bankroll in [0, 1]
    confidence: float           # policy-emitted, in [0,1]
    invalidation: str           # machine-readable exit condition ("exit if price < X")
    reason_codes: tuple[str, ...]   # deterministic, machine-readable


@dataclass(frozen=True)
class Constraints:
    """The fixed risk cage as it applied to this decision.

    These are FROZEN by the human (or by the oracle author, for the synthetic
    world). The policy may NOT mutate them. E1 checks they were honored.
    """
    max_size: float             # hard cap on |size|
    mandate_long_only: bool     # if True, SELL is forbidden


# Identity block — frozen at decision time, hash-bound, never mutated.
@dataclass(frozen=True)
class Specimen:
    spec_id: str                # ulid
    decision_t: int
    as_of_t: int                # <= decision_t
    observation_hash: str       # sha256 of serialized Observation
    observation: Observation    # the blob itself (so the oracle can re-derive truth)
    forecast: Forecast
    decision: Decision
    constraints: Constraints
    provenance: dict[str, str]  # model/prompt/code/seed — full identity
    # OUTCOME BLOCK — appended by the oracle, NEVER visible at decision time.
    # Set to None when the specimen is created; the oracle fills it after.
    outcome: Optional["Outcome"] = field(default=None)


@dataclass(frozen=True)
class Outcome:
    """What actually happened. Appended by the oracle after decision time."""
    realized_return: float      # the actual next-period return of the asset
    realized_pnl_net: float     # the policy's realized P&L after costs (size * return - costs)
    counterfactual: dict[Action, float]   # what pnl WOULD have been under each action
    cage_violations: tuple[str, ...]      # which constraints were breached in execution
    cost_breakdown: dict[str, float]      # fee, slippage, etc.


# ----------------------------------------------------------------------------
# The Oracle contract — codex implements this, GLM consumes it.
# ----------------------------------------------------------------------------

class Oracle:
    """The ground truth. INDEPENDENTLY AUTHORED.

    The Oracle knows the true data-generating process. The policy does not.
    The Oracle has two jobs:
      1. emit_observation(t, rng) -> Observation
           Produce the next observation. Must NOT leak future information
           (the observation at t may only depend on data up to t).
      2. resolve(specimen, rng) -> Outcome
           Given a specimen decided at t, produce the realized outcome at t+1
           AND the counterfactuals for every action in allowed_actions.
           This is the independent "math machine" — it computes pathwise
           P&L the gates use for E5, E6, E7.

    The Oracle MUST be seeded and deterministic. The gates author re-runs it
    with the same seed and expects byte-identical outcomes.
    """

    NAME: str = "abstract"   # codex's implementation sets this to something identifying

    def emit_observation(self, t: int, rng) -> Observation:
        raise NotImplementedError

    def resolve(self, specimen: "Specimen", rng) -> "Outcome":
        raise NotImplementedError

    # Optional: the oracle may declare its known true next-period distribution
    # given an observation. This lets the gates author build a KNOWN-GOOD
    # "calibrated forecaster" fixture that genuinely matches the truth, so
    # GREEN proofs are honest rather than self-flattering.
    def true_distribution(self, obs: Observation) -> Forecast:
        raise NotImplementedError


# ----------------------------------------------------------------------------
# Helpers (shared)
# ----------------------------------------------------------------------------

def hash_observation(obs: Observation) -> str:
    """Stable content hash of an observation."""
    blob = f"{obs.t}|{','.join(f'{p:.10f}' for p in obs.price_history)}|{','.join(obs.allowed_actions)}"
    return hashlib.sha256(blob.encode()).hexdigest()[:16]


def _fallback_ulid(seed_int: int) -> str:
    """Deterministic fallback if the ulid package is unavailable."""
    return f"S{abs(hash(seed_int)) % (10**16):016d}"
