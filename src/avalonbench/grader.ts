import { canonicalJson } from './canonical';
import { STAGE_ORDER } from './schema';
import type {
  AvalonBenchCase,
  CapabilitySnapshot,
  CapabilityStratum,
  EpisodeEnvelope,
  PredicateResult,
  PredicateSpec,
  ScoredResult,
} from './schema';
import { validateCaseBeforeProvider } from './validator';
import type { ValidationIssue } from './validator';

function stageOrder(label: PredicateSpec['label']): number {
  return STAGE_ORDER.indexOf(label) + 1;
}

function getPath(root: unknown, dottedPath: string): { found: boolean; value: unknown } {
  let current: unknown = root;
  for (const segment of dottedPath.split('.')) {
    if (!current || typeof current !== 'object' || !(segment in current)) {
      return { found: false, value: undefined };
    }
    current = (current as Record<string, unknown>)[segment];
  }
  return { found: true, value: current };
}

function partialObjectMatch(actual: unknown, expected: unknown): boolean {
  if (!expected || typeof expected !== 'object' || Array.isArray(expected)) {
    return canonicalJson(actual) === canonicalJson(expected);
  }
  if (!actual || typeof actual !== 'object' || Array.isArray(actual)) return false;
  return Object.entries(expected as Record<string, unknown>).every(
    ([key, value]) => key in (actual as Record<string, unknown>)
      && partialObjectMatch((actual as Record<string, unknown>)[key], value),
  );
}

function compare(actual: unknown, predicate: PredicateSpec): boolean {
  switch (predicate.comparison) {
    case 'equals':
      return canonicalJson(actual) === canonicalJson(predicate.expected);
    case 'empty':
      return Array.isArray(actual) && actual.length === 0;
    case 'length_equals':
      return (Array.isArray(actual) || typeof actual === 'string')
        && actual.length === predicate.expected;
    case 'set_equals': {
      if (!Array.isArray(actual) || !Array.isArray(predicate.expected)) return false;
      const actualSet = [...new Set(actual.map(canonicalJson))].sort();
      const expectedSet = [...new Set(predicate.expected.map(canonicalJson))].sort();
      return canonicalJson(actualSet) === canonicalJson(expectedSet);
    }
    case 'includes':
      if (Array.isArray(actual)) return actual.some((item) => partialObjectMatch(item, predicate.expected));
      if (typeof actual === 'string' && typeof predicate.expected === 'string') return actual.includes(predicate.expected);
      return false;
  }
}

function sortResults(left: PredicateResult, right: PredicateResult): number {
  return left.stageOrder - right.stageOrder || left.predicateOrder - right.predicateOrder || left.id.localeCompare(right.id);
}

export function gradeEpisode(
  benchmarkCase: AvalonBenchCase,
  stratum: CapabilityStratum | undefined,
  snapshot: CapabilitySnapshot,
  episode: EpisodeEnvelope,
): ScoredResult {
  const validation = validateCaseBeforeProvider(benchmarkCase, stratum, snapshot);
  if (!validation.valid) {
    return invalidCaseResult(benchmarkCase.id, validation.issues);
  }

  const orderedPredicates = [...benchmarkCase.oracle.predicates].sort(
    (left, right) => stageOrder(left.label) - stageOrder(right.label)
      || left.predicateOrder - right.predicateOrder
      || left.id.localeCompare(right.id),
  );
  const results: PredicateResult[] = [];
  const byId = new Map<string, PredicateResult>();

  for (const predicate of orderedPredicates) {
    const blocking = (predicate.requires ?? [])
      .map((id) => byId.get(id))
      .find((result) => result?.status !== 'PASS');
    if (blocking) {
      const result: PredicateResult = {
        id: predicate.id,
        label: predicate.label,
        stageOrder: stageOrder(predicate.label),
        predicateOrder: predicate.predicateOrder,
        status: 'NOT_EVALUABLE',
        expected: predicate.expected,
        blockedBy: blocking.blockedBy ?? blocking.id,
        ...(predicate.veto ? { veto: predicate.veto } : {}),
      };
      results.push(result);
      byId.set(predicate.id, result);
      continue;
    }

    const observed = getPath(episode, predicate.path);
    const passed = observed.found && compare(observed.value, predicate);
    const result: PredicateResult = {
      id: predicate.id,
      label: predicate.label,
      stageOrder: stageOrder(predicate.label),
      predicateOrder: predicate.predicateOrder,
      status: passed ? 'PASS' : 'FAIL',
      expected: predicate.comparison === 'empty' ? [] : predicate.expected,
      actual: observed.value,
      ...(predicate.veto ? { veto: predicate.veto } : {}),
    };
    results.push(result);
    byId.set(predicate.id, result);
  }

  const failures = results.filter((result) => result.status === 'FAIL').sort(sortResults);
  const notEvaluable = results.filter((result) => result.status === 'NOT_EVALUABLE').sort(sortResults);
  const vetoes = failures.filter((result) => result.veto !== undefined);
  const primaryFailure = failures[0] ?? null;
  let result: ScoredResult['result'] = 'PASS';
  if (primaryFailure?.label === 'invalid_case') result = 'INVALID';
  else if (vetoes.length > 0) result = 'FAIL';
  else if (primaryFailure?.label === 'harness_context_failure') result = 'INCOMPLETE';
  else if (primaryFailure) result = 'FAIL';

  return {
    caseId: benchmarkCase.id,
    result,
    fieldResults: results,
    primaryFailure,
    secondaryFailures: failures.slice(1),
    notEvaluable,
    vetoes,
  };
}

export function invalidCaseResult(caseId: string, issues: ValidationIssue[]): ScoredResult {
  const invalid: PredicateResult = {
    id: issues[0]?.code ?? 'invalid_case',
    label: 'invalid_case',
    stageOrder: 1,
    predicateOrder: 0,
    status: 'FAIL',
    expected: 'valid pre-provider case and oracle',
    actual: issues,
  };
  return {
    caseId,
    result: 'INVALID',
    fieldResults: [invalid],
    primaryFailure: invalid,
    secondaryFailures: [],
    notEvaluable: [],
    vetoes: [],
  };
}

export function incompleteHarnessResult(caseId: string, reason: string): ScoredResult {
  const incomplete: PredicateResult = {
    id: 'provider_or_harness_unavailable',
    label: 'harness_context_failure',
    stageOrder: 2,
    predicateOrder: 0,
    status: 'FAIL',
    expected: 'scoreable provider and harness context',
    actual: reason,
  };
  return {
    caseId,
    result: 'INCOMPLETE',
    fieldResults: [incomplete],
    primaryFailure: incomplete,
    secondaryFailures: [],
    notEvaluable: [],
    vetoes: [],
  };
}
