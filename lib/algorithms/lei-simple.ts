/**
 * LEI - Leadership Effectiveness Index (Simplified)
 * Core algorithm for leadership assessment
 * 
 * @version 2.1.0
 * @author NorthPath Strategies
 */

export interface LEIInput {
  licenses: {
    leadership: number;
    effectiveness: number;
    impact: number;
  };
}

export interface LEIResult {
  score: number;
}

/**
 * Calculate LEI score based on leadership metrics
 */
export function calcLEI(input: LEIInput | LEIInput['licenses']): LEIResult {
  // Handle both direct licenses object and wrapped input
  const licenses = 'licenses' in input ? input.licenses : input;
  const { leadership, effectiveness, impact } = licenses;
  const score = (leadership * 0.4 + effectiveness * 0.35 + impact * 0.25) * 100;
  
  return { score: Math.max(0, Math.min(100, score)) };
}

// Export for compatibility
export { calcLEI as calculateLEI };
