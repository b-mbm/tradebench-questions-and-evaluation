import { gradeEpisode, incompleteHarnessResult, invalidCaseResult } from './grader';
import type {
  AvalonBenchCase,
  CapabilitySnapshot,
  CapabilityStratum,
  EpisodeEnvelope,
  ScoredResult,
} from './schema';
import { validateCaseBeforeProvider } from './validator';

export interface ValidatedRunResult {
  providerInvoked: boolean;
  score: ScoredResult;
}

export async function runCaseWithPreProviderValidation(
  benchmarkCase: AvalonBenchCase,
  stratum: CapabilityStratum | undefined,
  snapshot: CapabilitySnapshot,
  provider: (validatedCase: AvalonBenchCase) => Promise<EpisodeEnvelope>,
): Promise<ValidatedRunResult> {
  const validation = validateCaseBeforeProvider(benchmarkCase, stratum, snapshot);
  if (!validation.valid) {
    const caseId = benchmarkCase !== null
      && typeof benchmarkCase === 'object'
      && typeof (benchmarkCase as Partial<AvalonBenchCase>).id === 'string'
      ? (benchmarkCase as Partial<AvalonBenchCase>).id!
      : '<invalid-case>';
    return {
      providerInvoked: false,
      score: invalidCaseResult(caseId, validation.issues),
    };
  }

  let episode: EpisodeEnvelope;
  try {
    episode = await provider(benchmarkCase);
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'Unknown provider or harness failure.';
    return {
      providerInvoked: true,
      score: incompleteHarnessResult(benchmarkCase.id, reason),
    };
  }
  return {
    providerInvoked: true,
    score: gradeEpisode(benchmarkCase, stratum, snapshot, episode),
  };
}
