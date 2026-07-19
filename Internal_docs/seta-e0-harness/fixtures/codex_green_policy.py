"""Honest cost-aware policy for CodexOracle's public market process."""

from __future__ import annotations

import math

from contract import Constraints, Decision, Forecast, Observation

# Tolerate both package-style and directory-on-path imports
try:
    from fixtures.policies import DEFAULT_CONSTRAINTS
except ImportError:
    from policies import DEFAULT_CONSTRAINTS


def policy_codex_green(
    obs: Observation,
) -> tuple[Forecast, Decision, Constraints]:
    returns = [
        math.log(current / previous)
        for previous, current in zip(obs.price_history, obs.price_history[1:])
    ]
    last = returns[-1] if returns else 0.0
    recent = returns[-3:]
    average = sum(recent) / len(recent) if recent else 0.0
    seasonal = math.sin(2.0 * math.pi * (obs.t + 1) / 10.0)

    if obs.t < 20:
        mean = 0.0010 + 0.55 * max(-0.012, min(0.012, average)) + 0.006 * seasonal
        base_std = 0.010
    elif obs.t < 40:
        mean = 0.0005 - 0.50 * max(-0.015, min(0.015, last)) + 0.005 * seasonal
        base_std = 0.014
    else:
        mean = 0.0008 + 0.30 * max(-0.020, min(0.020, average)) + 0.008 * seasonal
        base_std = 0.021

    average_move = sum(abs(value) for value in recent) / len(recent) if recent else 0.0
    std = base_std * (1.0 + min(0.75, 0.35 * average_move / base_std))
    forecast = Forecast(distribution_type="normal", mean_std=(mean, std))

    cost = 0.0014 + 0.04 * std
    net_edge = abs(mean) - cost
    if net_edge <= 0.15 * std:
        decision = Decision(
            action="ABSTAIN",
            size=0.0,
            confidence=0.5,
            invalidation="n/a",
            reason_codes=("edge_below_cost_and_risk_hurdle",),
        )
    else:
        action = "BUY" if mean > 0.0 else "SELL"
        size = min(0.20, 0.003 / std) * min(1.0, net_edge / (0.25 * std))
        confidence = 0.5 * (1.0 + math.erf(abs(mean) / (std * math.sqrt(2.0))))
        decision = Decision(
            action=action,
            size=size,
            confidence=confidence,
            invalidation="abstain when expected edge no longer clears costs and risk hurdle",
            reason_codes=("oracle_signal", "cost_aware", "volatility_sized"),
        )

    return forecast, decision, DEFAULT_CONSTRAINTS
