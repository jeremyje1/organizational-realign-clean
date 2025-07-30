/**
 * Cost Engine Service
 * Calculates cost savings based on organizational positions and redundancy analysis
 * 
 * @version 1.0.0
 * @author NorthPath Strategies
 */

// Position interface for cost calculations
export interface Position {
  id: string;
  title: string;
  department: string;
  totalCost: number;
  fte: number;
  benefits?: number;
  overhead?: number;
}

// Cost savings calculation result
export interface CostSavingsResult {
  conservative: number;
  moderate: number;
  aggressive: number;
}

// Detailed cost analysis result
export interface DetailedCostAnalysis {
  totalPositionCost: number;
  redundantCost: number;
  redundancyPct: number;
  savings: CostSavingsResult;
  breakdown: {
    salaryReduction: CostSavingsResult;
    benefitsReduction: CostSavingsResult;
    overheadReduction: CostSavingsResult;
  };
  affectedPositions: Position[];
}

/**
 * Core cost-saving calculation function
 * Calculates potential savings based on positions and redundancy percentage
 */
export function calcSavings(positions: Position[], redundancyPct: number): CostSavingsResult {
  const redundantCost = positions.reduce(
    (sum, p) => sum + p.totalCost * redundancyPct,
    0,
  );
  
  return {
    conservative: redundantCost * 0.6,
    moderate: redundantCost * 0.8,
    aggressive: redundantCost,
  };
}

/**
 * Calculate detailed cost analysis with breakdown
 */
export function calculateDetailedCostAnalysis(
  positions: Position[], 
  redundancyPct: number
): DetailedCostAnalysis {
  const totalPositionCost = positions.reduce((sum, p) => sum + p.totalCost, 0);
  const redundantCost = totalPositionCost * redundancyPct;
  
  // Calculate savings
  const savings = calcSavings(positions, redundancyPct);
  
  // Calculate breakdown by cost component
  const totalSalary = positions.reduce((sum, p) => {
    const baseSalary = p.totalCost - (p.benefits || 0) - (p.overhead || 0);
    return sum + baseSalary;
  }, 0);
  
  const totalBenefits = positions.reduce((sum, p) => sum + (p.benefits || p.totalCost * 0.3), 0);
  const totalOverhead = positions.reduce((sum, p) => sum + (p.overhead || p.totalCost * 0.15), 0);
  
  const redundantSalary = totalSalary * redundancyPct;
  const redundantBenefits = totalBenefits * redundancyPct;
  const redundantOverhead = totalOverhead * redundancyPct;
  
  const breakdown = {
    salaryReduction: {
      conservative: redundantSalary * 0.6,
      moderate: redundantSalary * 0.8,
      aggressive: redundantSalary,
    },
    benefitsReduction: {
      conservative: redundantBenefits * 0.6,
      moderate: redundantBenefits * 0.8,
      aggressive: redundantBenefits,
    },
    overheadReduction: {
      conservative: redundantOverhead * 0.6,
      moderate: redundantOverhead * 0.8,
      aggressive: redundantOverhead,
    },
  };
  
  // Identify affected positions (those contributing to redundancy)
  const redundantPositionCount = Math.ceil(positions.length * redundancyPct);
  const affectedPositions = positions
    .sort((a, b) => b.totalCost - a.totalCost) // Sort by cost descending
    .slice(0, redundantPositionCount);
  
  return {
    totalPositionCost,
    redundantCost,
    redundancyPct,
    savings,
    breakdown,
    affectedPositions,
  };
}

/**
 * Calculate cost savings by department
 */
export function calculateDepartmentSavings(
  positions: Position[], 
  departmentRedundancy: Record<string, number>
): Record<string, CostSavingsResult> {
  const departmentSavings: Record<string, CostSavingsResult> = {};
  
  // Group positions by department
  const departmentGroups = positions.reduce((groups, position) => {
    const dept = position.department || 'General';
    if (!groups[dept]) {
      groups[dept] = [];
    }
    groups[dept].push(position);
    return groups;
  }, {} as Record<string, Position[]>);
  
  // Calculate savings for each department
  Object.entries(departmentGroups).forEach(([dept, deptPositions]) => {
    const redundancyPct = departmentRedundancy[dept] || 0;
    departmentSavings[dept] = calcSavings(deptPositions, redundancyPct);
  });
  
  return departmentSavings;
}

/**
 * Calculate ROI timeline for cost savings implementation
 */
export function calculateROITimeline(
  savings: CostSavingsResult,
  implementationCost: number,
  timeframe: 'quarterly' | 'annual' = 'annual'
): {
  conservative: { roi: number; paybackMonths: number };
  moderate: { roi: number; paybackMonths: number };
  aggressive: { roi: number; paybackMonths: number };
} {
  const periods = timeframe === 'quarterly' ? 4 : 1;
  
  return {
    conservative: {
      roi: ((savings.conservative - implementationCost) / implementationCost) * 100,
      paybackMonths: implementationCost > 0 ? (implementationCost / (savings.conservative / 12)) : 0,
    },
    moderate: {
      roi: ((savings.moderate - implementationCost) / implementationCost) * 100,
      paybackMonths: implementationCost > 0 ? (implementationCost / (savings.moderate / 12)) : 0,
    },
    aggressive: {
      roi: ((savings.aggressive - implementationCost) / implementationCost) * 100,
      paybackMonths: implementationCost > 0 ? (implementationCost / (savings.aggressive / 12)) : 0,
    },
  };
}

/**
 * Calculate risk-adjusted savings based on implementation confidence
 */
export function calculateRiskAdjustedSavings(
  savings: CostSavingsResult,
  confidenceLevel: number // 0.0 to 1.0
): CostSavingsResult {
  return {
    conservative: savings.conservative * confidenceLevel,
    moderate: savings.moderate * (confidenceLevel * 0.9), // Slightly more risk
    aggressive: savings.aggressive * (confidenceLevel * 0.8), // Higher risk adjustment
  };
}

/**
 * Generate cost savings recommendations
 */
export function generateCostSavingsRecommendations(
  analysis: DetailedCostAnalysis
): string[] {
  const recommendations: string[] = [];
  
  if (analysis.redundancyPct > 0.2) {
    recommendations.push('High redundancy detected (>20%). Consider comprehensive organizational restructuring.');
  }
  
  if (analysis.savings.aggressive > 1000000) {
    recommendations.push('Significant savings potential (>$1M). Phased implementation recommended to manage risk.');
  }
  
  if (analysis.affectedPositions.length > 10) {
    recommendations.push('Large number of positions affected. Develop comprehensive change management plan.');
  }
  
  if (analysis.breakdown.benefitsReduction.moderate > analysis.breakdown.salaryReduction.moderate) {
    recommendations.push('Benefits represent significant cost component. Review benefits structure optimization.');
  }
  
  return recommendations;
}

/**
 * Utility function to format currency values
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Utility function to format percentage values
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export default {
  calcSavings,
  calculateDetailedCostAnalysis,
  calculateDepartmentSavings,
  calculateROITimeline,
  calculateRiskAdjustedSavings,
  generateCostSavingsRecommendations,
  formatCurrency,
  formatPercentage,
};
