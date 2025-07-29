// Algorithm-specific types for scoring and assessment
import { AssessmentResponse } from '../realignment-engine';

export type Segment = 'HIGHER_ED' | 'NON_PROFIT' | 'HEALTHCARE' | 'GOVERNMENT' | 'FOR_PROFIT';

export interface ScoringAlgorithmInput {
  segment: Segment;
  answers: Record<string, number>; // 0-4 Likert scale
}

export interface AlgorithmOutput {
  score: number; // 0-1
  tier: string;
  percentile: number; // 0-100 (renamed from peerPercentile for test compatibility)
  confidence: {
    overall: number;
    sections: Record<string, [number, number]>;
  };
  explainability: Record<string, string>;
  sectionScores: Record<string, number>;
}

export interface FactorWeight {
  spanControl: number;
  culture: number;
  techFit: number;
  readiness: number;
}

// Re-export from realignment-engine for convenience
export type { AssessmentResponse };
