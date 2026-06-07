export type ParsingMethod = 'json' | 'fenced_json' | 'evaluated_literal' | 'none';

export type FailureReason =
  | 'missing_field'
  | 'mismatch_fieldname'
  | 'parse_failed'
  | string;

export interface RiskControls {
  stop_loss?: string | number;
  take_profit?: string | number;
  slippage_tolerance?: string | number;
  max_gas?: string | number;
  position_size_limit?: string | number;
  [key: string]: unknown;
}

export interface ExecuteOneResponse {
  intent: string;
  order_type: string;
  asset: string;
  size: string | number;
  price?: string | number;
  venue: string;
  venue_name?: string;
  risk_controls: RiskControls;
  follow_up?: string;
  reasoning?: string;
  [key: string]: unknown;
}

export interface SchemaQuestion {
  id: string;
  level: number;
  prompt: string;
  rubric_id: string;
  expected_values: Record<string, unknown>;
  context?: Record<string, unknown>;
  type?: 'schema';
}

export interface L0Question {
  id: string;
  level: 0;
  prompt: string;
  expected: number;
  range: [number, number];
  unit: string;
  difficulty: number;
  sourceQuestion?: Record<string, unknown>;
  type?: 'l0';
}

export interface SchemaRubric {
  id: string;
  expected_fields: string[];
  required_fields: string[];
  field_weights: Record<string, number>;
  synonyms?: Record<string, string[]>;
  pass_threshold: number;
}

export interface GradeResult {
  pass: boolean;
  confidence: number;
  score: number;
  fieldScores: Record<string, number>;
  normalizedResponse: Record<string, unknown> | null;
  failureReasons: FailureReason[];
  parsingMethod: ParsingMethod;
}

export type BenchmarkQuestion = SchemaQuestion | L0Question;
