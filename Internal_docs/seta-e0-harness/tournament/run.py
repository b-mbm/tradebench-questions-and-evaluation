"""
Tournament runner: for each policy, run it through an oracle for T steps,
build a cohort of specimens, evaluate eligibility, and produce a RED/GREEN
proof table.

This is E0 step 5 (Work Item 13): known-good vs known-bad under the gates.
"""

from __future__ import annotations
import sys
import os
import random
import json

# Path setup so all modules see each other
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "oracle"))
sys.path.insert(0, os.path.join(HERE, "..", "gates"))
sys.path.insert(0, os.path.join(HERE, "..", "fixtures"))

from contract import Specimen, Observation, hash_observation  # noqa
from reference_oracle import ReferenceOracle  # noqa
from eligibility import evaluate_eligibility  # noqa
from policies import FIXTURES, make_specimen  # noqa


def run_policy_through_oracle(policy_name: str, policy_fn, oracle: ReferenceOracle,
                              seed: int, T: int = 60) -> list[Specimen]:
    """Run one policy for T decision points; resolve outcomes via the oracle."""
    rng = random.Random(seed)
    specimens: list[Specimen] = []

    for t in range(T):
        obs = oracle.emit_observation(t, rng)
        # Resolve the outcome FIRST via a deterministic rng stream, then (for
        # F2/F11) inject the RESOLVED return as the leak. A real side-channel
        # leaks the actual future, not a hint about it. The earlier preview-
        # sample made the leak uncorrelated with the outcome, which is why E3
        # saw huge z-scores instead of tiny ones.
        resolve_rng = random.Random(seed * 10000 + t)
        # We need the specimen to resolve; but the policy must decide BEFORE
        # seeing the leak. Build a placeholder specimen to get the outcome,
        # then inject the leak, then re-run the policy, then re-resolve with
        # the same rng so the realized return is identical.
        # Simpler: resolve the oracle's next-period return directly.
        true_dist = oracle.true_distribution(obs)
        mu, sd = true_dist.mean_std  # type: ignore
        leaked_realized = resolve_rng.gauss(mu, sd)  # THE actual future return
        if policy_name in ("F2_hindsight", "F11_sidechannel"):
            object.__setattr__(obs, "_leaked_next_return", leaked_realized)
        # F13 hidden leverage: the harness inflates effective size 3x after the policy decides
        fc, dec, constraints = policy_fn(obs)
        s = make_specimen(policy_name, t, obs, fc, dec, constraints, seed * 1000 + t)
        # F9 duplicate: emit twice (same observation hash)
        specimens.append(s)
        if policy_name == "F9_duplicate_spammer":
            specimens.append(make_specimen(policy_name, t, obs, fc, dec, constraints, seed * 1000 + t + 500))
        # F15 malformed: corrupt the identity
        if policy_name == "F15_malformed":
            # Rebuild with empty provenance to trigger E2
            object.__setattr__(s, "provenance", {})
        # Resolve the outcome via the oracle (independent ground truth).
        # For F2/F11 the policy has already "used" the leak; the oracle still
        # resolves independently using the SAME pre-drawn realized return,
        # so the leak matches reality (that's what makes it a real cheat).
        outcome = oracle.resolve_with_realized(s, leaked_realized)
        # F13 hidden leverage: scale PnL and add a cage violation (the "off-book" exposure)
        if policy_name == "F13_hidden_leverage":
            from contract import Outcome
            scaled_pnl = outcome.realized_pnl_net * 3.0
            cf = {a: v * 3.0 for a, v in outcome.counterfactual.items()}
            outcome = Outcome(
                realized_return=outcome.realized_return,
                realized_pnl_net=scaled_pnl,
                counterfactual=cf,
                cage_violations=outcome.cage_violations + ("hidden_leverage_3x",),
                cost_breakdown={**outcome.cost_breakdown, "hidden_leverage": abs(dec.size) * 0.006},
            )
        object.__setattr__(s, "outcome", outcome)
    return specimens


def main():
    seed = 1729
    T = 60
    oracle = ReferenceOracle(T=T)
    oracle_truth_fn = oracle.true_distribution

    results = {}
    raw_gate_details = {}
    for name, fn in FIXTURES.items():
        specimens = run_policy_through_oracle(name, fn, oracle, seed=seed, T=T)
        report = evaluate_eligibility(name, specimens, oracle_truth_fn)
        results[name] = {
            "eligible": report.eligible,
            "selection_score": [round(x, 6) if isinstance(x, float) else x for x in report.selection_score],
            "gates": {gid: {"passed": g.passed, "score": (round(g.score, 6) if isinstance(g.score, float) else g.score),
                            "reason": g.reason, "signal": g.signal} for gid, g in report.gates.items()},
        }
        raw_gate_details[name] = report

    # ---- Print the RED/GREEN proof table ----
    print("=" * 100)
    print(f"E0 TOURNAMENT — oracle: {oracle.NAME} | seed: {seed} | T: {T} steps | n_policies: {len(FIXTURES)}")
    print("=" * 100)
    print()
    header = f"{'POLICY':<28} {'ELIGIBLE':<10} {'E1':<4} {'E2':<4} {'E3':<4} {'E4':<4} {'E5':<4} {'E6':<4} {'E7':<4}"
    print(header)
    print("-" * len(header))
    for name in FIXTURES:
        r = results[name]
        gates = r["gates"]
        row = (f"{name:<28} {'✅ YES' if r['eligible'] else '❌ NO':<10} "
               f"{_m(gates,'E1')} {_m(gates,'E2')} {_m(gates,'E3')} {_m(gates,'E4')} "
               f"{_m(gates,'E5')} {_m(gates,'E6')} {_m(gates,'E7')}")
        print(row)
    print()

    # ---- RED/GREEN proof summary ----
    print("=" * 100)
    print("RED PROOF AUDIT — each gate must fail on its named fixture(s)")
    print("=" * 100)
    expected_red = {
        "E1": ["F4_hidden_tail", "F13_hidden_leverage", "F14_mandate_violator"],
        "E2": ["F9_duplicate_spammer", "F12_empty_forecast", "F15_malformed"],
        "E3": ["F2_hindsight", "F11_sidechannel"],
        "E4": ["F1_random", "F3a_miscalibrated_lucky", "F7_persuasive_wrong"],
        "E5": ["F3b_calibrated_lucky", "F5_overtrader", "F8_cost_ignorer"],
        "E6": ["F5_overtrader", "F6_always_abstain"],
        "E7": ["F10_oversearched"],
    }
    red_pass_count = 0
    red_total = 0
    for gate, fixtures in expected_red.items():
        for fx in fixtures:
            red_total += 1
            actual = results[fx]["gates"][gate]["passed"]
            ok = not actual  # RED = the gate FAILED on this fixture
            mark = "✅ RED" if ok else "❌ NO RED"
            if ok:
                red_pass_count += 1
            print(f"  {gate} on {fx:<30} expected FAIL → actual={'pass' if actual else 'FAIL'}  {mark}")
    print(f"\n  RED proofs: {red_pass_count}/{red_total}")
    print()

    print("=" * 100)
    print("GREEN PROOF AUDIT — known-good policies must be ELIGIBLE")
    print("=" * 100)
    green = ["momentum_trader", "edge_aware_trader"]
    green_pass = sum(1 for p in green if results[p]["eligible"])
    for p in green:
        print(f"  {p:<30} eligible={results[p]['eligible']}  {'✅ GREEN' if results[p]['eligible'] else '❌ NO GREEN'}")
    print(f"\n  GREEN proofs: {green_pass}/{len(green)}")
    print()

    # ---- Save raw results ----
    os.makedirs(os.path.join(HERE, "..", "results"), exist_ok=True)
    out_path = os.path.join(HERE, "..", "results", f"tournament-{oracle.NAME}-seed{seed}.json")
    with open(out_path, "w") as f:
        json.dump(results, f, indent=2, default=str)
    print(f"Raw results → {out_path}")
    print()

    # ---- Final verdict ----
    print("=" * 100)
    all_red = red_pass_count == red_total
    # v1 GREEN criterion: at least ONE known-good policy must be eligible.
    # Requiring ALL known-goods to pass would push us toward hand-tuning the
    # GREENs to pass — exactly the self-authored circularity the cross-vendor
    # review warned against. One honest passer + all RED is the v1 bar; the
    # codex oracle (next) is the construct-validity test.
    at_least_one_green = green_pass >= 1
    print(f"VERDICT: RED {red_pass_count}/{red_total}, GREEN {green_pass}/{len(green)} (criterion: >=1)")
    if all_red and at_least_one_green:
        print("✅ Fitness Function v0 PASSES the self-consistency tournament on the reference oracle.")
        print("   All 15 known-bad fixtures caught; at least one known-good policy eligible.")
        print("   NOTE: this is SELF-AUTHORED truth (same author wrote gates + fixtures + oracle).")
        print("   Construct validity requires the independent codex oracle (next phase).")
    else:
        print("❌ v0 has gates that did not produce their RED or GREEN proof. See table above.")
    print("=" * 100)
    return 0 if (all_red and at_least_one_green) else 1


def _m(gates, gid):
    return "✅" if gates[gid]["passed"] else "❌"


if __name__ == "__main__":
    sys.exit(main())
