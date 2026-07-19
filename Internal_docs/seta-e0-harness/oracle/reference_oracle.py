"""
Reference Oracle — the LEAD AUTHOR's (GLM) ground truth.

This is the "self-authored truth" for the self-consistency phase of E0.
It is deliberately simple and known, so I can verify my gates fire on
fixtures BEFORE the independent codex oracle arrives.

Once codex's oracle lands, I re-run the tournament against THAT oracle
to test construct validity. If my gates rank the same fixtures the same
way on codex's unknown world, that's evidence the gates measure something
real, not just my own assumptions.

Market model (deliberately toy):
  - Geometric random walk with a small positive drift and time-varying vol.
  - One-period decisions: BUY profits when next return > cost; SELL when < -cost;
    ABSTAIN pays nothing and costs nothing.
  - Cost: a fixed per-trade friction `c` (fee + half-spread).
  - The TRUE next-period distribution, given the observation, is Gaussian with
    a known (to the oracle) mean and std. The oracle's `true_distribution`
    exposes this so the calibrated-forecaster fixture can be honestly built.

No real market data. No real money. Synthetic only. Seeded and deterministic.
"""

from __future__ import annotations
import math
import random
from contract import (Oracle, Observation, Forecast, Specimen, Outcome, Action)


class ReferenceOracle(Oracle):
    """GLM's reference ground truth."""

    NAME = "reference-glm"

    def __init__(self, T: int = 60, drift: float = 0.0015,
                 base_vol: float = 0.01, cost: float = 0.0005,
                 starting_price: float = 100.0):
        self.T = T
        self.drift = drift
        self.base_vol = base_vol
        self.cost = cost
        self.start = starting_price
        # Regime: vol clusters in tertiles to give E7 (robustness) something to bite on.
        # Determined by the rng, so seeded runs reproduce.

    def emit_observation(self, t: int, rng: random.Random) -> Observation:
        if t >= self.T:
            raise IndexError(f"t={t} beyond T={self.T}")
        # Generate the price history up to t deterministically from the rng.
        prices = self._history_up_to(t, rng)
        return Observation(t=t, price_history=tuple(prices))

    def _history_up_to(self, t: int, rng: random.Random) -> list[float]:
        prices = [self.start]
        vol = self.base_vol
        for _ in range(t):
            # vol cluster: slow random walk of vol itself
            vol = max(0.002, vol + rng.gauss(0, 0.001))
            ret = rng.gauss(self.drift, vol)
            prices.append(prices[-1] * (1.0 + ret))
        return prices

    def true_distribution(self, obs: Observation) -> Forecast:
        """The TRUE next-period return distribution given the observation.

        Gaussian with the oracle's known drift and a vol INFERRED from the
        observation's recent realized volatility. (The oracle knows the rule;
        the policy has to estimate it.)
        """
        mean = self.drift
        # Infer vol from recent window (the policy can do this too, but less well)
        recent = obs.price_history[-min(10, len(obs.price_history)):]
        if len(recent) >= 2:
            rets = [(recent[i] / recent[i-1]) - 1 for i in range(1, len(recent))]
            var = sum(r*r for r in rets) / max(1, len(rets))
            std = max(0.002, math.sqrt(var))
        else:
            std = self.base_vol
        return Forecast(distribution_type="normal", mean_std=(mean, std))

    def resolve(self, specimen: Specimen, rng: random.Random) -> Outcome:
        obs = specimen.observation
        true = self.true_distribution(obs)
        mean, std = true.mean_std  # type: ignore
        realized_return = rng.gauss(mean, std)
        return self.resolve_with_realized(specimen, realized_return)

    def resolve_with_realized(self, specimen: Specimen, realized_return: float) -> Outcome:
        """Resolve using a pre-drawn realized return. Used by the tournament
        to model a true side-channel: the F2/F11 policy sees the ACTUAL future
        return (the same value the oracle resolves against), not a hint about it."""
        obs = specimen.observation

        def pnl_for(action: Action, size: float) -> float:
            if action == "ABSTAIN":
                return 0.0
            if action == "BUY":
                return size * realized_return - (abs(size) * self.cost)
            if action == "SELL":
                return -size * realized_return - (abs(size) * self.cost)
            raise ValueError(action)

        d = specimen.decision
        realized_pnl = pnl_for(d.action, d.size)
        cf: dict[Action, float] = {}
        for a in obs.allowed_actions:
            # counterfactual size = the policy's chosen size (so we compare actions at equal sizing)
            cf[a] = pnl_for(a, d.size if a != "ABSTAIN" else 0.0)

        # Constraint check
        violations: list[str] = []
        if abs(d.size) > specimen.constraints.max_size + 1e-9:
            violations.append("size_over_max")
        if specimen.constraints.mandate_long_only and d.action == "SELL":
            violations.append("sell_in_long_only_mandate")

        return Outcome(
            realized_return=realized_return,
            realized_pnl_net=realized_pnl,
            counterfactual=cf,
            cage_violations=tuple(violations),
            cost_breakdown={"fee_slippage": abs(d.size) * self.cost if d.action != "ABSTAIN" else 0.0},
        )
