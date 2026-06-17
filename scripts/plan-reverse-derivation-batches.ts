#!/usr/bin/env tsx
// Compute which questions still need a reverse-derivation result, and chunk them into batch files.
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const PACKETS = path.join(ROOT, 'docs', 'reverse-derivation', 'packets');
const RESULTS = path.join(ROOT, 'docs', 'reverse-derivation', 'results');
const BATCHES = path.join(ROOT, 'docs', 'reverse-derivation', 'batches');
fs.mkdirSync(BATCHES, { recursive: true });
for (const f of fs.readdirSync(BATCHES)) fs.unlinkSync(path.join(BATCHES, f));

const CHUNK = Number(process.argv[2] ?? 15);
const allIds = fs.readdirSync(PACKETS).filter(f => f.endsWith('.md')).map(f => f.replace('.md', '')).sort();
const done = new Set(fs.readdirSync(RESULTS).filter(f => f.endsWith('.json')).map(f => f.replace('.json', '')));
const remaining = allIds.filter(id => !done.has(id));

const batches: string[] = [];
for (let i = 0; i < remaining.length; i += CHUNK) {
  const chunk = remaining.slice(i, i + CHUNK);
  const name = `batch-${String(batches.length + 1).padStart(2, '0')}.txt`;
  fs.writeFileSync(path.join(BATCHES, name), chunk.join('\n') + '\n');
  batches.push(name);
}
console.log(JSON.stringify({ total: allIds.length, done: done.size, remaining: remaining.length, batches }, null, 2));
