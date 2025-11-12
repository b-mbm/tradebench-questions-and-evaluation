import { distance as levenshtein } from 'fastest-levenshtein';

type SynonymMap = Record<string, string[]>;

function normalize(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9%/.\-\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function exactMatch(a: string, b: string): boolean {
  return normalize(a) === normalize(b);
}

function synonymMatch(field: string, value: string, synonyms?: SynonymMap): boolean {
  if (!synonyms) return false;
  const normalizedValue = normalize(value);
  const normalizedField = normalize(field);

  const candidateLists = [synonyms[field], synonyms[normalizedField]].filter(Array.isArray) as string[][];
  if (!candidateLists.length) return false;

  for (const list of candidateLists) {
    for (const synonym of list) {
      if (normalize(synonym) === normalizedValue) {
        return true;
      }
    }
  }

  return false;
}

export function fuzzyScore(
  expected: unknown,
  received: unknown,
  field: string,
  synonyms?: SynonymMap
): number {
  const expectedNorm = normalize(expected);
  const receivedNorm = normalize(received);

  if (!expectedNorm && !receivedNorm) return 1;
  if (!expectedNorm || !receivedNorm) return 0;

  if (exactMatch(expectedNorm, receivedNorm)) {
    return 1;
  }

  if (synonymMatch(field, receivedNorm, synonyms)) {
    return 1;
  }

  const maxLength = Math.max(expectedNorm.length, receivedNorm.length);
  if (maxLength === 0) return 1;

  const distance = levenshtein(expectedNorm, receivedNorm);
  const ratio = 1 - distance / maxLength;
  return Math.max(0, Math.min(1, ratio));
}

export function fieldPresent(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
}
