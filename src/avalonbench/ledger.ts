import { appendFileSync, readFileSync } from 'node:fs';
import type { ExposureLedgerEntry, RunRecord } from './schema';
import { parseJsonLines, validateExposureLedger, validateRunRegistry } from './validator';
import type { AvalonBenchCase } from './schema';

export function assertAppendOnlyPrefix(previous: string, next: string): void {
  if (!next.startsWith(previous)) {
    throw new Error('APPEND_ONLY_PREFIX_VIOLATION');
  }
}

function appendJsonLine(filePath: string, value: unknown): void {
  const raw = readFileSync(filePath, 'utf8');
  const separator = raw.length === 0 || raw.endsWith('\n') ? '' : '\n';
  appendFileSync(filePath, `${separator}${JSON.stringify(value)}\n`, { encoding: 'utf8', flag: 'a' });
  const updated = readFileSync(filePath, 'utf8');
  assertAppendOnlyPrefix(raw, updated);
}

export function appendExposureEntry(
  filePath: string,
  entry: ExposureLedgerEntry,
  cases: AvalonBenchCase[],
): void {
  const before = readFileSync(filePath, 'utf8');
  const proposed = `${before}${before.length === 0 || before.endsWith('\n') ? '' : '\n'}${JSON.stringify(entry)}\n`;
  const validation = validateExposureLedger(parseJsonLines<ExposureLedgerEntry>(proposed), cases);
  if (!validation.valid) throw new Error(`EXPOSURE_ENTRY_INVALID:${JSON.stringify(validation.issues)}`);
  appendJsonLine(filePath, entry);
}

export function appendRunRecord(filePath: string, entry: RunRecord): void {
  const before = readFileSync(filePath, 'utf8');
  const proposed = `${before}${before.length === 0 || before.endsWith('\n') ? '' : '\n'}${JSON.stringify(entry)}\n`;
  const validation = validateRunRegistry(parseJsonLines<RunRecord>(proposed));
  if (!validation.valid) throw new Error(`RUN_RECORD_INVALID:${JSON.stringify(validation.issues)}`);
  appendJsonLine(filePath, entry);
}
