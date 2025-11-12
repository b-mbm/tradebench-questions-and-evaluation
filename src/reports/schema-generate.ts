#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

import { SCHEMA_QUESTIONS } from '../questions/schema-questions';

interface FieldScores {
  [key: string]: number;
}

interface GradeResult {
  pass: boolean;
  confidence: number;
  score: number;
  fieldScores: FieldScores;
  normalizedResponse: Record<string, unknown> | null;
  failureReasons: string[];
  parsingMethod: string;
}

interface EvaluationRow {
  modelId: string;
  modelLabel: string;
  questionId: string;
  raw: string;
  durationMs: number;
  grade: GradeResult;
  error?: string;
}

interface ResultFile {
  datasetHash: string;
  runAt: string;
  sampleSize: number;
  evaluations: EvaluationRow[];
}

function getResultsDir(): string {
  return path.join(__dirname, '..', '..', 'results');
}

function findLatestSchemaFile(): string {
  const dir = getResultsDir();
  const files = fs
    .readdirSync(dir)
    .filter(f => f.startsWith('execute-one-schema-') && f.endsWith('.json'))
    .map(f => path.join(dir, f));
  if (!files.length) {
    throw new Error('No execute-one-schema-*.json files found in results/');
  }
  const sorted = files
    .map(f => ({ file: f, mtime: fs.statSync(f).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime);
  return sorted[0].file;
}

function csvEscape(value: unknown): string {
  const s = String(value ?? '');
  const oneLine = s.replace(/\r?\n/g, '\n');
  const escaped = oneLine.replace(/"/g, '""');
  return `"${escaped}"`;
}

const QUESTION_INDEX = new Map(SCHEMA_QUESTIONS.map(question => [question.id, question]));

function writeTxtReport(payload: ResultFile, outPath: string): void {
  const lines: string[] = [];
  lines.push(`Dataset hash: ${payload.datasetHash}`);
  lines.push(`Run at: ${payload.runAt}`);
  lines.push(`Sample size: ${payload.sampleSize}`);
  lines.push('');

  const byModel = new Map<string, EvaluationRow[]>();
  for (const row of payload.evaluations) {
    if (!byModel.has(row.modelId)) {
      byModel.set(row.modelId, []);
    }
    byModel.get(row.modelId)!.push(row);
  }

  for (const [modelId, rows] of byModel) {
    const modelLabel = rows[0]?.modelLabel ?? modelId;
    lines.push('====================================================');
    lines.push(`Model: ${modelLabel} (${modelId})`);
    lines.push('====================================================');

    for (const row of rows) {
      const question = QUESTION_INDEX.get(row.questionId);
      lines.push('');
      lines.push(`Question: ${row.questionId} — ${question?.prompt ?? ''}`);
      lines.push(`Level: ${question?.level ?? ''} | Rubric: ${question?.rubric_id ?? ''}`);
      lines.push(`Pass: ${row.grade.pass ? 'Yes' : 'No'} | Score: ${row.grade.score.toFixed(2)} | Confidence: ${row.grade.confidence.toFixed(2)}`);
      lines.push(`Parsing method: ${row.grade.parsingMethod}`);
      lines.push(`Failure reasons: ${row.grade.failureReasons.join(', ') || 'none'}`);
      lines.push(`DurationMs: ${row.durationMs}`);
      lines.push(`Normalized response: ${JSON.stringify(row.grade.normalizedResponse ?? {}, null, 2)}`);
      lines.push(`Field scores: ${JSON.stringify(row.grade.fieldScores, null, 2)}`);
      lines.push('Raw model response:');
      lines.push(row.raw ?? '');
      if (row.error) {
        lines.push(`Error: ${row.error}`);
      }
      lines.push('----');
    }
    lines.push('');
  }

  fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
}

function writeFullCsv(payload: ResultFile, outPath: string): void {
  const headers = [
    'datasetHash',
    'runAt',
    'modelId',
    'modelLabel',
    'questionId',
    'rubricId',
    'pass',
    'score',
    'confidence',
    'parsingMethod',
    'failureReasons',
    'fieldScores',
    'durationMs',
    'raw',
    'normalizedResponse',
  ];
  const rows: string[] = [];
  rows.push(headers.map(csvEscape).join(','));

  for (const row of payload.evaluations) {
    const question = QUESTION_INDEX.get(row.questionId);
    const csvRow = [
      payload.datasetHash,
      payload.runAt,
      row.modelId,
      row.modelLabel,
      row.questionId,
      question?.rubric_id ?? '',
      row.grade.pass,
      row.grade.score,
      row.grade.confidence,
      row.grade.parsingMethod,
      row.grade.failureReasons.join('|'),
      JSON.stringify(row.grade.fieldScores),
      row.durationMs,
      row.raw,
      JSON.stringify(row.grade.normalizedResponse ?? {}),
    ].map(csvEscape);
    rows.push(csvRow.join(','));
  }

  fs.writeFileSync(outPath, rows.join('\n'), 'utf8');
}

function writeSummaryCsv(payload: ResultFile, outPath: string): void {
  const headers = ['modelId', 'modelLabel', 'total', 'passes', 'failures', 'passRate', 'avgScore', 'avgConfidence'];
  const rows: string[] = [];
  rows.push(headers.map(csvEscape).join(','));

  const byModel = new Map<string, { label: string; total: number; passes: number; scoreSum: number; confidenceSum: number }>();

  for (const row of payload.evaluations) {
    if (!byModel.has(row.modelId)) {
      byModel.set(row.modelId, {
        label: row.modelLabel,
        total: 0,
        passes: 0,
        scoreSum: 0,
        confidenceSum: 0,
      });
    }
    const agg = byModel.get(row.modelId)!;
    agg.total += 1;
    if (row.grade.pass) agg.passes += 1;
    agg.scoreSum += row.grade.score;
    agg.confidenceSum += row.grade.confidence;
  }

  for (const [modelId, agg] of byModel) {
    const failures = agg.total - agg.passes;
    const passRate = agg.total ? agg.passes / agg.total : 0;
    const avgScore = agg.total ? agg.scoreSum / agg.total : 0;
    const avgConfidence = agg.total ? agg.confidenceSum / agg.total : 0;
    const csvRow = [
      modelId,
      agg.label,
      agg.total,
      agg.passes,
      failures,
      passRate.toFixed(4),
      avgScore.toFixed(4),
      avgConfidence.toFixed(4),
    ].map(csvEscape);
    rows.push(csvRow.join(','));
  }

  fs.writeFileSync(outPath, rows.join('\n'), 'utf8');
}

async function main() {
  const resultsPath = findLatestSchemaFile();
  const payload = JSON.parse(fs.readFileSync(resultsPath, 'utf8')) as ResultFile;

  const resultsDir = getResultsDir();
  const txtPath = path.join(resultsDir, 'execute-one-schema-analysis.txt');
  const csvPath = path.join(resultsDir, 'execute-one-schema-analysis.csv');
  const summaryPath = path.join(resultsDir, 'execute-one-schema-summary.csv');

  writeTxtReport(payload, txtPath);
  writeFullCsv(payload, csvPath);
  writeSummaryCsv(payload, summaryPath);

  console.log('Schema analysis artifacts generated:');
  console.log(txtPath);
  console.log(csvPath);
  console.log(summaryPath);
}

main().catch(error => {
  console.error('Failed to generate schema analysis files:', error);
  process.exit(1);
});

