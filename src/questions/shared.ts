import { createHash } from 'crypto';

export const DEFAULT_PRICES = {
  BTC: 45_000,
  ETH: 3_000,
  SOL: 100,
  MATIC: 0.8,
  USDC: 1,
  DAI: 0.999,
  ARB: 1.2,
  PEPE: 0.000001,
  stETH: 2_990,
  GLD: 2_400,
  TLT: 100,
};

const HASH_VERSION = 'R5E1.1-schema';

export function enrichContext(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    prices: DEFAULT_PRICES,
    network: 'mainnet',
    timestamp: '2025-10-13T00:00:00Z',
    gas: '30 gwei',
    ...overrides,
  };
}

export function contextHash(value: unknown): string {
  const json = JSON.stringify(value);
  return createHash('sha256')
    .update(`${HASH_VERSION}:${json}`)
    .digest('hex')
    .slice(0, 8);
}

export function datasetHash(questions: unknown): string {
  return contextHash(questions);
}

