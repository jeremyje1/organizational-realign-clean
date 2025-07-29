/**
 * DSCH - Dynamic Span-of-Control Heuristic (Simplified)
 * Core algorithm for span-of-control optimization
 * 
 * This is a simplified version focused on organizational hierarchy
 * and span-of-control analysis as specified in the requirements.
 * 
 * @version 2.1.0
 * @author NorthPath Strategies
 */

import { OrgUnit } from '@/types/assessment';

export interface DSCHInput {
  layers: number;
  spanByMgr: number[];
}

export interface DSCHResult {
  score: number;
  idealSpan: number;
}

/**
 * Calculate DSCH score based on organizational layers and span of control
 * @param input - Organizational structure data
 * @returns DSCH calculation result
 */
export function calcDSCH({ layers, spanByMgr }: DSCHInput): DSCHResult {
  const avgSpan = spanByMgr.reduce((a, b) => a + b, 0) / spanByMgr.length;
  const layerPenalty = Math.max(0, (layers - 5)) * 2;
  const spanBonus = Math.max(0, (8 - avgSpan)) * 1.5;
  const score = Math.max(20, 100 - layerPenalty - spanBonus); // 0-100
  
  return { 
    score, 
    idealSpan: 8 
  };
}

/**
 * Enhanced DSCH calculation with Monte Carlo simulation support
 * TODO: Implement Monte Carlo simulation for v2.1 enhancement
 */
export function calcDSCHEnhanced(input: DSCHInput): DSCHResult {
  // For now, use the basic calculation
  // TODO: Replace with Monte Carlo simulation
  return calcDSCH(input);
}

// Export for compatibility with enterprise system
export { calcDSCH as calculateDSCH };
