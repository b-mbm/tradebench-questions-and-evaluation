/**
 * Exact duplicate rows excluded from the executable CoinBench v1 repair candidate.
 * The source bank remains unchanged for provenance and legacy reproduction.
 */
export const COINBENCH_V1_EXACT_DUPLICATE_QUARANTINE_IDS = new Set([
]);

/**
 * Rows with a demonstrated specification or grader defect. They stay in the source bank
 * for provenance, but cannot contribute to the executable CoinBench v1 score.
 */
export const COINBENCH_V1_REPAIR_QUARANTINE_IDS = new Set([
]);

export const COINBENCH_V1_QUARANTINE_IDS = new Set([
  ...COINBENCH_V1_EXACT_DUPLICATE_QUARANTINE_IDS,
  ...COINBENCH_V1_REPAIR_QUARANTINE_IDS,
]);
