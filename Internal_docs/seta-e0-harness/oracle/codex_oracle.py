"""Independent synthetic-market oracle.

The market has one asset, a 60-step horizon, and a starting price of 100.
Returns are Gaussian log returns, so prices evolve as ``P[t+1] = P[t] *
exp(r[t+1])`` and remain positive.  The conditional mean combines a public,
ten-step seasonal signal with recent returns.  Steps 0--19 reward momentum,
20--39 reward mean reversion, and 40--59 return to weaker momentum with higher
volatility.  Volatility also rises after large recent moves, providing simple
observable clustering.

Trading uses the submitted bankroll fraction.  A trade pays a 6 bp fee plus
slippage of 8 bp + 4% of conditional volatility; abstention is free.  An
action counterfactual changes only the action and holds submitted size fixed.
All randomness comes exclusively from the caller-provided ``rng``.
"""

from __future__ import annotations

import math

from contract import Forecast, Observation, Oracle, Outcome, Specimen


class CodexOracle(Oracle):
    """Ground truth for a predictable but noisy, regime-varying market."""

    NAME = "codex_regime_gaussian_v1"
    T = 60
    START_PRICE = 100.0

    def emit_observation(self, t: int, rng) -> Observation:
        """Generate the point-in-time price path through ``t``."""
        if not isinstance(t, int) or isinstance(t, bool) or not 0 <= t < self.T:
            raise ValueError(f"t must be an integer in [0, {self.T - 1}]")

        prices = [self.START_PRICE]
        for step in range(t):
            obs = Observation(t=step, price_history=tuple(prices))
            mean, std = self._parameters(obs)
            prices.append(prices[-1] * math.exp(rng.gauss(mean, std)))
        return Observation(t=t, price_history=tuple(prices))

    def true_distribution(self, obs: Observation) -> Forecast:
        """Return the exact conditional law of the next Gaussian log return."""
        mean, std = self._parameters(obs)
        return Forecast(distribution_type="normal", mean_std=(mean, std))

    def resolve(self, specimen: Specimen, rng) -> Outcome:
        """Sample the next return and resolve submitted and counterfactual P&L."""
        mean, std = self._parameters(specimen.observation)
        return self.resolve_with_realized(specimen, rng.gauss(mean, std))

    def resolve_with_realized(
        self, specimen: Specimen, realized_return: float
    ) -> Outcome:
        """Resolve P&L for a supplied pathwise return without further randomness."""
        decision = specimen.decision
        cage = specimen.constraints
        size = decision.size
        if decision.action not in ("BUY", "SELL", "ABSTAIN"):
            raise ValueError(f"unknown action: {decision.action!r}")
        if not math.isfinite(size) or size < 0:
            raise ValueError("decision size must be finite and non-negative")
        if not math.isfinite(realized_return):
            raise ValueError("realized_return must be finite")

        _, std = self._parameters(specimen.observation)
        fee = 0.0006 * size if decision.action != "ABSTAIN" else 0.0
        slippage = size * (0.0008 + 0.04 * std) if decision.action != "ABSTAIN" else 0.0

        counterfactual = {
            action: self._pnl(action, size, realized_return, std)
            for action in specimen.observation.allowed_actions
        }
        violations = []
        if size > cage.max_size:
            violations.append("max_size")
        if cage.mandate_long_only and decision.action == "SELL":
            violations.append("mandate_long_only")

        return Outcome(
            realized_return=realized_return,
            realized_pnl_net=self._pnl(
                decision.action, size, realized_return, std
            ),
            counterfactual=counterfactual,
            cage_violations=tuple(violations),
            cost_breakdown={"fee": fee, "slippage": slippage},
        )

    @staticmethod
    def _pnl(action: str, size: float, realized: float, std: float) -> float:
        if action == "ABSTAIN":
            return 0.0
        direction = 1.0 if action == "BUY" else -1.0
        costs = size * (0.0014 + 0.04 * std)
        return size * direction * realized - costs

    def _parameters(self, obs: Observation) -> tuple[float, float]:
        if not isinstance(obs.t, int) or isinstance(obs.t, bool) or not 0 <= obs.t < self.T:
            raise ValueError(f"observation t must be in [0, {self.T - 1}]")
        if len(obs.price_history) != obs.t + 1:
            raise ValueError("price_history must contain exactly prices 0..t")
        if any(not math.isfinite(p) or p <= 0 for p in obs.price_history):
            raise ValueError("all prices must be finite and positive")

        returns = [
            math.log(current / previous)
            for previous, current in zip(obs.price_history, obs.price_history[1:])
        ]
        last = returns[-1] if returns else 0.0
        recent = returns[-3:]
        average = sum(recent) / len(recent) if recent else 0.0
        seasonal = math.sin(2.0 * math.pi * (obs.t + 1) / 10.0)

        if obs.t < 20:
            mean = 0.0010 + 0.55 * self._clip(average, 0.012) + 0.006 * seasonal
            base_std = 0.010
        elif obs.t < 40:
            mean = 0.0005 - 0.50 * self._clip(last, 0.015) + 0.005 * seasonal
            base_std = 0.014
        else:
            mean = 0.0008 + 0.30 * self._clip(average, 0.020) + 0.008 * seasonal
            base_std = 0.021

        average_move = sum(abs(value) for value in recent) / len(recent) if recent else 0.0
        std = base_std * (1.0 + min(0.75, 0.35 * average_move / base_std))
        return mean, std

    @staticmethod
    def _clip(value: float, limit: float) -> float:
        return max(-limit, min(limit, value))
