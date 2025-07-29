/**
 * Simplified Algorithm Runner
 * Matches the pattern from your requirements
 * 
 * @version 2.1.0
 * @author NorthPath Strategies
 */

import { calcDSCH } from './dsch-simple';
import { calcCRF } from './crf-simple';
import { calcLEI } from './lei-simple';

// Define inline types for simplicity
export interface DSCHInput {
  layers: number;
  spanByMgr: number[];
}

export interface DSCHResult {
  score: number;
  recommendation: string;
}

export interface CRFInput {
  ratios: number[];
  benchmark: number;
}

export interface CRFResult {
  score: number;
  recommendation: string;
}

export interface LEIInput {
  initiatives: number;
  capacity: number;
}

export interface LEIResult {
  score: number;
  recommendation: string;
}

export interface AlgorithmPayload {
  structure: {
    layers: number;
    spanByMgr: number[];
  };
  culture: {
    cultureMetrics: {
      adaptability: number;
      cohesion: number;
      innovation: number;
    };
  };
  licenses: {
    leadership: number;
    effectiveness: number;
    impact: number;
  };
}

export interface AlgorithmResults {
  dsch: { score: number; idealSpan: number };
  crf: { score: number };
  lei: { score: number };
}

/**
 * Run all algorithms as specified in requirements
 * Matches the exact pattern from your example
 */
export const runAlgorithms = async (payload: AlgorithmPayload): Promise<AlgorithmResults> => ({
  dsch: calcDSCH(payload.structure),
  crf: calcCRF(payload.culture),
  lei: calcLEI(payload.licenses),
});

// Export individual algorithms for direct use
export { calcDSCH, calcCRF, calcLEI };
