import { createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const container = process.env.AVALON_DEMO_DB_CONTAINER ?? '';
const labelArgument = process.argv.find((value) => value.startsWith('--label='));
const outputArgument = process.argv.find((value) => value.startsWith('--output='));
const label = labelArgument?.slice('--label='.length) ?? '';
const outputPath = outputArgument?.slice('--output='.length) ?? '';

if (!/^supabase_db_avalonbench-v1-slice2-[0-9a-f]+$/.test(container)) {
  throw new Error('ISOLATED_AVALONBENCH_DB_CONTAINER_REQUIRED');
}
if (!/^[a-z0-9_-]+$/.test(label)) throw new Error('SAFE_SNAPSHOT_LABEL_REQUIRED');
if (!outputPath.endsWith('.json')) throw new Error('JSON_OUTPUT_PATH_REQUIRED');

function psql(sql) {
  const result = spawnSync(
    'docker',
    ['exec', '-i', container, 'psql', '-U', 'postgres', '-d', 'postgres', '-tA', '-v', 'ON_ERROR_STOP=1'],
    { input: sql, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 }
  );
  if (result.status !== 0) {
    throw new Error(`PSQL_FAILED_${result.status}: ${result.stderr.trim().slice(0, 500)}`);
  }
  return result.stdout.trim();
}

const tableInventory = psql(
  "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;"
).split('\n').filter(Boolean);

const mutationTerms = ['execution', 'fill', 'order', 'position', 'transfer', 'wallet'];
const explicitMutationTables = new Set([
  'base_spot_live_lots',
  'base_spot_risk_exit_cursors',
  'base_spot_token_approvals',
  'base_spot_withdrawal_fences',
]);
const selectedTables = tableInventory.filter((table) =>
  mutationTerms.some((term) => table.includes(term)) || explicitMutationTables.has(table)
);

if (selectedTables.length === 0) throw new Error('NO_FINANCIAL_TABLES_SELECTED');
for (const table of selectedTables) {
  if (!/^[a-z0-9_]+$/.test(table)) throw new Error(`UNSAFE_TABLE_NAME_${table}`);
}
for (const table of explicitMutationTables) {
  if (!selectedTables.includes(table)) throw new Error(`REQUIRED_FINANCIAL_TABLE_MISSING_${table}`);
}

const rowsSql = selectedTables.map((table) =>
  `SELECT '${table}' AS table_name, count(*)::bigint AS row_count FROM public.${table}`
).join('\nUNION ALL\n');
const observedRows = JSON.parse(psql(
  `SELECT json_agg(row_to_json(counts) ORDER BY table_name) FROM (${rowsSql}) counts;`
)).map((row) => ({ table: `public.${row.table_name}`, rowCount: Number(row.row_count) }));

for (const row of observedRows) {
  const table = row.table.slice('public.'.length);
  const canonicalTableRows = psql(
    `SELECT COALESCE(jsonb_agg(to_jsonb(source_row) ORDER BY to_jsonb(source_row)::text), '[]'::jsonb)::text FROM public.${table} AS source_row;`
  );
  row.contentSha256 = createHash('sha256').update(`${canonicalTableRows}\n`).digest('hex');
}

const canonicalRows = JSON.stringify(observedRows);
const receipt = {
  receiptVersion: 'avalon-demo-financial-snapshot-v1',
  label,
  observedAt: new Date().toISOString(),
  target: {
    environment: 'isolated_local_avalonbench',
    container,
    database: 'postgres',
    schema: 'public',
  },
  selectionContract: {
    mutationTerms,
    explicitMutationTables: [...explicitMutationTables].sort(),
  },
  tableCount: observedRows.length,
  totalRows: observedRows.reduce((sum, row) => sum + row.rowCount, 0),
  nonzero: Object.fromEntries(observedRows.filter((row) => row.rowCount !== 0).map((row) => [row.table, row.rowCount])),
  rowsSha256: createHash('sha256').update(`${canonicalRows}\n`).digest('hex'),
  rows: observedRows,
};

await writeFile(resolve(outputPath), `${JSON.stringify(receipt, null, 2)}\n`, { flag: 'wx' });
process.stdout.write(`${JSON.stringify({
  ok: true,
  label,
  outputPath: resolve(outputPath),
  tableCount: receipt.tableCount,
  totalRows: receipt.totalRows,
  nonzero: receipt.nonzero,
  rowsSha256: receipt.rowsSha256,
})}\n`);
