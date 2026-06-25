# Explaining Trading Models To VCs

## Short Version

CoinBench exposed a class of failures where models can answer crypto finance questions in isolation, but fail when a trade requires planning across multiple mechanisms. They do not reliably track constraints, reject invalid routes, or verify the final plan. We are using those failure modes to build targeted post-training data, while keeping the benchmark held out.

## Explain It Like I'm Five

Most models can answer one trading question at a time.

But hard trading is like following a recipe where every step changes what you are allowed to do next. The model might do step one correctly, then forget a rule, pick a trade that is not allowed, or forget to check if the final answer still works.

CoinBench shows us exactly where that happens, so we can train models to stop making those mistakes.

## Explain It Like I'm Two

The model can count blocks.

But when it has to build a tower, remember the rules, and make sure it does not fall over, it gets confused.

We found the confusing parts. Now we train on those.

## Five-Second Explanation

Models know a lot about crypto, but they break when a trading decision requires several connected steps. CoinBench shows where they lose constraints, choose invalid routes, or fail to check risk. We keep the benchmark held out, then train on sibling tasks that target those exact failure modes.

## What The Benchmark Revealed

Current frontier models are often competent at isolated calculations: compute a return, compare two rates, estimate a cost, or identify an obvious risk.

Where they break is multi-step trading reasoning. A realistic trading task often requires several linked decisions under constraints:

- What is feasible?
- What route is invalid even if it looks profitable?
- What changes after step one?
- What is the worst-case outcome?
- Does the final plan still satisfy the original goal?

The universal AGI failures are not mostly broken questions. They are a map of where current models still fail under realistic trading pressure.

## AGI Failure Modes

### 1. Constraint Blindness

The model proposes a trade that looks smart but violates a rule: liquidity, borrow, collateral, venue, timing, governance, unlock schedule, or liquidation risk.

### 2. Multi-Step State Drift

The model starts correctly, but loses track of balances, exposures, collateral, or risk after several steps.

### 3. Plausible-But-Invalid Strategy Selection

The model chooses the attractive route instead of the actually feasible route.

### 4. Worst-Case / Tail-Risk Failure

The model optimizes expected profit but misses the bad scenario that makes the trade unacceptable.

### 5. Cross-Mechanism Reasoning Failure

The model can handle staking, borrowing, swaps, governance, liquidations, or hedging individually, but not when they interact.

### 6. Self-Check Failure

The model does not ask: “Did this plan still satisfy the original constraint after all calculations?”

## Why This Matters

The benchmark is not just a scoreboard. It is a diagnostic map.

If every strong model fails the same class of questions, that is not automatically a reason to make the benchmark easier. It may mean the benchmark found a real capability frontier.

The right move is:

1. Fix rows that are objectively broken.
2. Keep valid hard questions held out.
3. Build sibling training tasks that target the discovered failure modes.
4. Re-test on the frozen benchmark.

That lets us train against the weakness without contaminating the eval.

## Investor Framing

We are not simply asking whether a model can “know crypto.” We are testing whether it can reason like a trading system under constraints.

The opportunity is that frontier models already have broad financial knowledge, but they often fail at execution-grade reasoning: rejecting invalid trades, tracking state across steps, and self-checking risk.

Our post-training strategy is to target those failure modes directly.
