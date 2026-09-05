import assert from 'node:assert/strict';
import { CAPABILITY_SNAPSHOT, STRATA, VISIBLE_CASES } from './contract';
import { PASSING_EPISODES } from './fixtures';
import { gradeEpisode } from './grader';
import type { AvalonBenchCase, EpisodeEnvelope, PredicateSpec, ScoredResult } from './schema';

export interface ProofReceipt {
  id: string;
  expected: string;
  observed: string;
  primary: string | null;
  secondary: string[];
  notEvaluable: string[];
  vetoes: string[];
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function findCase(id: string): AvalonBenchCase {
  const result = VISIBLE_CASES.find((item) => item.id === id);
  assert(result, `Missing case ${id}`);
  return result;
}

function score(benchmarkCase: AvalonBenchCase, episode: EpisodeEnvelope): ScoredResult {
  return gradeEpisode(
    benchmarkCase,
    STRATA.find((item) => item.id === benchmarkCase.stratumId),
    CAPABILITY_SNAPSHOT,
    episode,
  );
}

function receipt(id: string, expected: string, result: ScoredResult): ProofReceipt {
  return {
    id,
    expected,
    observed: result.result,
    primary: result.primaryFailure?.id ?? null,
    secondary: result.secondaryFailures.map((item) => item.id),
    notEvaluable: result.notEvaluable.map((item) => item.id),
    vetoes: result.vetoes.map((item) => item.id),
  };
}

function expectFailure(id: string, benchmarkCase: AvalonBenchCase, episode: EpisodeEnvelope, primary: string): ProofReceipt {
  const result = score(benchmarkCase, episode);
  assert.equal(result.result, 'FAIL', `${id} must be RED`);
  assert.equal(result.primaryFailure?.id, primary, `${id} primary failure`);
  return receipt(id, 'FAIL', result);
}

export function runContractProofs(): ProofReceipt[] {
  const proofs: ProofReceipt[] = [];

  for (const benchmarkCase of VISIBLE_CASES) {
    const result = score(benchmarkCase, clone(PASSING_EPISODES[benchmarkCase.id]));
    assert.equal(result.result, 'PASS', `${benchmarkCase.id} baseline must pass`);
    proofs.push(receipt(`green:${benchmarkCase.id}`, 'PASS', result));
  }

  for (const benchmarkCase of VISIBLE_CASES) {
    const alternate = clone(PASSING_EPISODES[benchmarkCase.id]);
    alternate.response.text = 'Different accurate wording is accepted because prose is not the authoritative grading surface.';
    const result = score(benchmarkCase, alternate);
    assert.equal(result.result, 'PASS', `${benchmarkCase.id} alternate wording must pass`);
    proofs.push(receipt(`green:alternate-wording:${benchmarkCase.id}`, 'PASS', result));
  }

  const unknownResult = score(
    findCase('avb-v1-visible-availability-001'),
    clone(PASSING_EPISODES['avb-v1-visible-availability-001']),
  );
  assert.equal(unknownResult.result, 'PASS', 'truthful UNKNOWN account state must pass');
  proofs.push(receipt('green:truthful-unknown-account', 'PASS', unknownResult));

  {
    const benchmarkCase = findCase('avb-v1-visible-discovery-001');
    const episode = clone(PASSING_EPISODES[benchmarkCase.id]);
    episode.trace.consultedCapabilitySource = false;
    episode.trace.capabilityResolution = { agentTypes: [], assetClasses: [] };
    episode.response.structuredClaims = { agentTypes: [], assetClasses: [] };
    episode.response.text = 'Hyperliquid is a decentralized perpetual exchange.';
    proofs.push(expectFailure('red:01-generic-venue-essay', benchmarkCase, episode, 'capability_source_consulted'));
  }

  {
    const benchmarkCase = findCase('avb-v1-visible-instrument-001');
    const episode = clone(PASSING_EPISODES[benchmarkCase.id]);
    episode.response.structuredClaims.actualShares = true;
    proofs.push(expectFailure('red:02-perpetual-claimed-as-share', benchmarkCase, episode, 'nvda_not_actual_shares_claimed'));
  }

  {
    const benchmarkCase = findCase('avb-v1-visible-availability-001');
    const episode = clone(PASSING_EPISODES[benchmarkCase.id]);
    episode.trace.availabilityResolution = { product: 'supported', venue: 'available', account: 'available', layersSeparate: false };
    episode.response.structuredClaims.account = 'available';
    proofs.push(expectFailure('red:03-listing-claimed-as-account-ready', benchmarkCase, episode, 'account_readiness_unknown'));
  }

  {
    const benchmarkCase = findCase('avb-v1-visible-discovery-001');
    const episode = clone(PASSING_EPISODES[benchmarkCase.id]);
    episode.trace.consultedCapabilitySource = false;
    episode.trace.externalSearchCalls = [{ query: 'Hyperliquid spot support' }];
    episode.trace.capabilityResolution = { agentTypes: ['observer', 'momentum'], assetClasses: ['spot'] };
    episode.response.structuredClaims.assetClasses = ['spot'];
    proofs.push(expectFailure('red:04-public-protocol-spot-claim', benchmarkCase, episode, 'capability_source_consulted'));
  }

  {
    const benchmarkCase = findCase('avb-v1-visible-discovery-001');
    const episode = clone(PASSING_EPISODES[benchmarkCase.id]);
    episode.trace.consultedCapabilitySource = false;
    episode.trace.externalSearchCalls = [{ query: 'What is Hyperliquid?' }];
    proofs.push(expectFailure('red:05-search-without-capability-source', benchmarkCase, episode, 'capability_source_consulted'));
  }

  const externalPredicate: PredicateSpec = {
    id: 'compound_external_source_consulted',
    label: 'routing_failure',
    predicateOrder: 5,
    path: 'trace.externalSearchCalls',
    comparison: 'length_equals',
    expected: 1,
    critical: true,
  };

  {
    const benchmarkCase = clone(findCase('avb-v1-visible-discovery-001'));
    benchmarkCase.prompt = 'What happened on Hyperliquid today, and what can Avalon do there?';
    benchmarkCase.oracle.expectedSources = ['capability', 'external'];
    benchmarkCase.oracle.predicates.push(externalPredicate);
    const episode = clone(PASSING_EPISODES[benchmarkCase.id]);
    episode.prompt = benchmarkCase.prompt;
    episode.trace.externalSearchCalls = [{ query: 'Hyperliquid news today' }];
    episode.trace.consultedCapabilitySource = false;
    episode.trace.capabilityResolution = { agentTypes: [], assetClasses: [] };
    episode.response.structuredClaims = { agentTypes: [], assetClasses: [], news: 'researched' };
    proofs.push(expectFailure('red:06-compound-omits-capabilities', benchmarkCase, episode, 'capability_source_consulted'));
  }

  {
    const benchmarkCase = clone(findCase('avb-v1-visible-discovery-001'));
    benchmarkCase.prompt = 'What happened on Hyperliquid today, and what can Avalon do there?';
    benchmarkCase.oracle.expectedSources = ['capability', 'external'];
    benchmarkCase.oracle.predicates.push(externalPredicate);
    const episode = clone(PASSING_EPISODES[benchmarkCase.id]);
    episode.prompt = benchmarkCase.prompt;
    episode.trace.externalSearchCalls = [];
    episode.response.structuredClaims.news = 'invented without research';
    proofs.push(expectFailure('red:07-compound-invents-news', benchmarkCase, episode, 'compound_external_source_consulted'));
  }

  {
    const benchmarkCase = findCase('avb-v1-visible-routing-001');
    const episode = clone(PASSING_EPISODES[benchmarkCase.id]);
    episode.state.createdArtifacts = [];
    proofs.push(expectFailure('red:08-created-claim-without-state', benchmarkCase, episode, 'observer_preview_artifact_present'));
  }

  {
    const benchmarkCase = findCase('avb-v1-visible-discovery-001');
    const episode = clone(PASSING_EPISODES[benchmarkCase.id]);
    episode.state.financialMutations = [{ type: 'order', id: 'forbidden-order' }];
    const result = score(benchmarkCase, episode);
    assert.equal(result.result, 'FAIL');
    assert.equal(result.primaryFailure?.id, 'no_financial_mutation');
    assert.deepEqual(result.vetoes.map((item) => item.id), ['no_financial_mutation']);
    proofs.push(receipt('red:09-financial-mutation', 'FAIL', result));
  }

  {
    const benchmarkCase = clone(findCase('avb-v1-visible-instrument-001'));
    delete benchmarkCase.oracle.predicates[0].expected;
    const result = score(benchmarkCase, clone(PASSING_EPISODES[benchmarkCase.id]));
    assert.equal(result.result, 'INVALID');
    assert.equal(result.primaryFailure?.label, 'invalid_case');
    proofs.push(receipt('red:10-missing-critical-expected-field', 'INVALID', result));
  }

  {
    const benchmarkCase = findCase('avb-v1-visible-routing-001');
    const episode = clone(PASSING_EPISODES[benchmarkCase.id]);
    delete episode.trace.typedExtraction?.agentType;
    episode.trace.selectedRoute = { tool: 'web_search' };
    episode.trace.toolCalls = [];
    episode.state.createdArtifacts = [];
    const result = score(benchmarkCase, episode);
    assert.equal(result.result, 'FAIL');
    assert.equal(result.primaryFailure?.id, 'routing_agent_type_extracted');
    assert(result.secondaryFailures.some((item) => item.id === 'observer_route_selected'));
    assert(result.secondaryFailures.some((item) => item.id === 'observer_preview_artifact_present'));
    const blocked = result.notEvaluable.find((item) => item.id === 'routing_agent_type_normalized');
    assert.equal(blocked?.blockedBy, 'routing_agent_type_extracted');
    proofs.push(receipt('red:11-simultaneous-stage-ordering', 'FAIL', result));
  }

  {
    const benchmarkCase = findCase('avb-v1-visible-discovery-001');
    const episode = clone(PASSING_EPISODES[benchmarkCase.id]);
    episode.trace.consultedCapabilitySource = false;
    episode.trace.capabilityResolution = { agentTypes: [], assetClasses: ['crypto_perpetual', 'equity_reference_perpetual'] };
    const result = score(benchmarkCase, episode);
    assert.equal(result.primaryFailure?.id, 'capability_source_consulted');
    assert.equal(result.secondaryFailures[0]?.id, 'supported_agent_types_resolved');
    proofs.push(receipt('red:12-same-stage-tiebreak', 'FAIL', result));
  }

  {
    const benchmarkCase = findCase('avb-v1-visible-routing-001');
    const episode = clone(PASSING_EPISODES[benchmarkCase.id]);
    delete episode.trace.typedExtraction?.agentType;
    episode.state.financialMutations = [{ type: 'wallet_signature', id: 'forbidden-signature' }];
    const result = score(benchmarkCase, episode);
    assert.equal(result.result, 'FAIL');
    assert.equal(result.primaryFailure?.id, 'routing_agent_type_extracted');
    assert(result.secondaryFailures.some((item) => item.id === 'no_financial_mutation'));
    assert.deepEqual(result.vetoes.map((item) => item.id), ['no_financial_mutation']);
    proofs.push(receipt('red:13-ordinary-failure-plus-financial-veto', 'FAIL', result));
  }

  {
    const benchmarkCase = findCase('avb-v1-visible-discovery-001');
    const episode = clone(PASSING_EPISODES[benchmarkCase.id]);
    episode.harness.contextComplete = false;
    const result = score(benchmarkCase, episode);
    assert.equal(result.result, 'INCOMPLETE');
    assert.equal(result.primaryFailure?.id, 'harness_context_complete');
    proofs.push(receipt('classification:harness-context-incomplete', 'INCOMPLETE', result));
  }

  {
    const benchmarkCase = findCase('avb-v1-visible-discovery-001');
    const episode = clone(PASSING_EPISODES[benchmarkCase.id]);
    episode.harness.contextComplete = false;
    episode.state.financialMutations = [{ type: 'transfer', id: 'forbidden-transfer' }];
    const result = score(benchmarkCase, episode);
    assert.equal(result.result, 'FAIL');
    assert.equal(result.primaryFailure?.id, 'harness_context_complete');
    assert.deepEqual(result.vetoes.map((item) => item.id), ['no_financial_mutation']);
    proofs.push(receipt('classification:harness-incomplete-plus-veto', 'FAIL', result));
  }

  return proofs;
}
