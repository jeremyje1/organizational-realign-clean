/**
 * Scenario Engine Service
 * Advanced scenario comparison and analysis functionality
 * 
 * @version 2.3.0
 * @author NorthPath Strategies
 */

import { diff } from 'just-diff';
import { OrganizationalBaseline, OrganizationalVariant } from '@/types/scenario';

// Define missing types locally to resolve compilation errors
interface DSCHMetrics {
  structuralComplexity: number;
  operationalEfficiency: number;
  culturalAlignment: number;
  strategicReadiness: number;
  overallScore: number;
}

interface ROICalculation {
  initialCost: number;
  annualSavings: number;
  roiPercentage: number;
  paybackPeriod: number;
  npv?: number;
  irr?: number;
}

// Position interface for organizational positions
export interface Position {
  id: string;
  title: string;
  department: string;
  level: number;
  totalCost: number;
  benefits?: number;
  overhead?: number;
  salaryBand?: {
    min: number;
    max: number;
    current: number;
  };
  fte: number; // Full-time equivalent
  reportingTo?: string;
  subordinates?: string[];
}

// Scenario comparison result
export interface ScenarioComparison {
  changes: any[]; // Diff result from just-diff
  deltaCost: number;
  summary: {
    positionsAdded: number;
    positionsRemoved: number;
    positionsModified: number;
    totalPositions: {
      baseline: number;
      variant: number;
    };
    costSummary: {
      baselineCost: number;
      variantCost: number;
      absoluteChange: number;
      percentageChange: number;
    };
    fteImpact: {
      baselineFte: number;
      variantFte: number;
      fteChange: number;
    };
  };
  recommendations: string[];
  riskFactors: string[];
}

// Department-level analysis
export interface DepartmentAnalysis {
  departmentName: string;
  baselinePositions: Position[];
  variantPositions: Position[];
  costChange: number;
  fteChange: number;
  structuralChanges: string[];
}

// Enhanced scenario comparison result with DSCH integration
export interface EnhancedScenarioComparison extends ScenarioComparison {
  dschAnalysis: {
    baseline: DSCHMetrics;
    variant: DSCHMetrics;
    improvement: {
      structuralComplexity: number;
      operationalEfficiency: number;
      culturalAlignment: number;
      strategicReadiness: number;
      overallImprovement: number;
    };
  };
  roiAnalysis: ROICalculation;
  organizationalHealth: {
    currentState: 'poor' | 'fair' | 'good' | 'excellent';
    projectedState: 'poor' | 'fair' | 'good' | 'excellent';
    improvementAreas: string[];
    riskMitigation: string[];
  };
}

/**
 * Core scenario comparison function (Simplified Version 2.3)
 * Compares baseline and variant organizational structures using just-diff
 */
export function compareScenarios(base: any, variant: any) {
  const changes = diff(base.positions, variant.positions);
  const deltaCost =
    base.positions.reduce((s: number, p: any) => s + p.totalCost, 0) -
    variant.positions.reduce((s: number, p: any) => s + p.totalCost, 0);
  return { changes, deltaCost };
}

/**
 * Comprehensive scenario comparison function
 * Provides detailed analysis for backwards compatibility with existing components
 */
export function compareScenarios_comprehensive(
  base: OrganizationalBaseline, 
  variant: OrganizationalVariant
): ScenarioComparison {
  // Extract positions from organizational structures
  const basePositions = extractPositions(base);
  const variantPositions = extractPositions(variant);

  // Calculate detailed differences
  const changes = diff(basePositions, variantPositions);
  
  // Calculate cost delta
  const baselineCost = basePositions.reduce((sum, position) => sum + position.totalCost, 0);
  const variantCost = variantPositions.reduce((sum, position) => sum + position.totalCost, 0);
  const deltaCost = variantCost - baselineCost;

  // Calculate FTE impact
  const baselineFte = basePositions.reduce((sum, position) => sum + position.fte, 0);
  const variantFte = variantPositions.reduce((sum, position) => sum + position.fte, 0);
  const fteChange = variantFte - baselineFte;

  // Analyze structural changes
  const structuralAnalysis = analyzeStructuralChanges(basePositions, variantPositions);

  // Generate summary
  const summary = {
    positionsAdded: structuralAnalysis.added.length,
    positionsRemoved: structuralAnalysis.removed.length,
    positionsModified: structuralAnalysis.modified.length,
    totalPositions: {
      baseline: basePositions.length,
      variant: variantPositions.length
    },
    costSummary: {
      baselineCost,
      variantCost,
      absoluteChange: deltaCost,
      percentageChange: baselineCost > 0 ? (deltaCost / baselineCost) * 100 : 0
    },
    fteImpact: {
      baselineFte,
      variantFte,
      fteChange
    }
  };

  // Generate recommendations and risk factors
  const recommendations = generateRecommendations(summary, structuralAnalysis);
  const riskFactors = identifyRiskFactors(summary, structuralAnalysis);

  return {
    changes,
    deltaCost,
    summary,
    recommendations,
    riskFactors
  };
}

// Department-level analysis
export interface DepartmentAnalysis {
  departmentName: string;
  baselinePositions: Position[];
  variantPositions: Position[];
  costChange: number;
  fteChange: number;
  structuralChanges: string[];
}

// Enhanced scenario comparison result with DSCH integration
export interface EnhancedScenarioComparison extends ScenarioComparison {
  dschAnalysis: {
    baseline: DSCHMetrics;
    variant: DSCHMetrics;
    improvement: {
      structuralComplexity: number;
      operationalEfficiency: number;
      culturalAlignment: number;
      strategicReadiness: number;
      overallImprovement: number;
    };
  };
  roiAnalysis: ROICalculation;
  organizationalHealth: {
    currentState: 'poor' | 'fair' | 'good' | 'excellent';
    projectedState: 'poor' | 'fair' | 'good' | 'excellent';
    improvementAreas: string[];
    riskMitigation: string[];
  };
}

/**
 * Extract positions from organizational baseline/variant
 */
function extractPositions(org: OrganizationalBaseline | OrganizationalVariant): Position[] {
  const positions: Position[] = [];

  // Handle different organizational chart structures
  if ('organizationChart' in org && org.organizationChart) {
    // Baseline structure
    const chart = org.organizationChart as any;
    if (chart.positions) {
      positions.push(...chart.positions);
    }
    if (chart.departments) {
      chart.departments.forEach((dept: any) => {
        if (dept.positions) {
          positions.push(...dept.positions.map((pos: any) => ({
            ...pos,
            department: dept.name || 'Unknown'
          })));
        }
      });
    }
  } else if ('proposedChart' in org && org.proposedChart) {
    // Variant structure
    const chart = org.proposedChart as any;
    if (chart.positions) {
      positions.push(...chart.positions);
    }
    if (chart.departments) {
      chart.departments.forEach((dept: any) => {
        if (dept.positions) {
          positions.push(...dept.positions.map((pos: any) => ({
            ...pos,
            department: dept.name || 'Unknown'
          })));
        }
      });
    }
  }

  // Ensure all positions have required fields
  return positions.map((pos, index) => ({
    id: pos.id || `pos_${index}`,
    title: pos.title || 'Unknown Position',
    department: pos.department || 'General',
    level: pos.level || 1,
    totalCost: pos.totalCost || 0,
    benefits: pos.benefits || pos.totalCost * 0.3, // Default 30% benefits
    overhead: pos.overhead || pos.totalCost * 0.15, // Default 15% overhead
    salaryBand: pos.salaryBand || {
      min: (pos.totalCost || 0) * 0.9,
      max: (pos.totalCost || 0) * 1.1,
      current: pos.totalCost || 0
    },
    fte: pos.fte || 1.0,
    reportingTo: pos.reportingTo,
    subordinates: pos.subordinates || []
  }));
}

/**
 * Analyze structural changes between baseline and variant
 */
function analyzeStructuralChanges(
  basePositions: Position[], 
  variantPositions: Position[]
): {
  added: Position[];
  removed: Position[];
  modified: { baseline: Position; variant: Position }[];
  unchanged: Position[];
} {
  const baseMap = new Map(basePositions.map(pos => [pos.id, pos]));
  const variantMap = new Map(variantPositions.map(pos => [pos.id, pos]));

  const added: Position[] = [];
  const removed: Position[] = [];
  const modified: { baseline: Position; variant: Position }[] = [];
  const unchanged: Position[] = [];

  // Find added positions
  variantPositions.forEach(variantPos => {
    if (!baseMap.has(variantPos.id)) {
      added.push(variantPos);
    }
  });

  // Find removed and modified positions
  basePositions.forEach(basePos => {
    const variantPos = variantMap.get(basePos.id);
    
    if (!variantPos) {
      removed.push(basePos);
    } else {
      // Check if position was modified
      const isModified = 
        basePos.title !== variantPos.title ||
        basePos.department !== variantPos.department ||
        basePos.level !== variantPos.level ||
        basePos.totalCost !== variantPos.totalCost ||
        basePos.fte !== variantPos.fte ||
        basePos.reportingTo !== variantPos.reportingTo;

      if (isModified) {
        modified.push({ baseline: basePos, variant: variantPos });
      } else {
        unchanged.push(basePos);
      }
    }
  });

  return { added, removed, modified, unchanged };
}

/**
 * Analyze changes by department
 */
export function analyzeDepartmentChanges(
  base: OrganizationalBaseline,
  variant: OrganizationalVariant
): DepartmentAnalysis[] {
  const basePositions = extractPositions(base);
  const variantPositions = extractPositions(variant);

  // Group positions by department
  const baseDepartments = groupByDepartment(basePositions);
  const variantDepartments = groupByDepartment(variantPositions);

  // Get all unique departments
  const allDepartments = new Set([
    ...Object.keys(baseDepartments),
    ...Object.keys(variantDepartments)
  ]);

  const departmentAnalyses: DepartmentAnalysis[] = [];

  allDepartments.forEach(deptName => {
    const basePositions = baseDepartments[deptName] || [];
    const variantPositions = variantDepartments[deptName] || [];

    const baseCost = basePositions.reduce((sum, pos) => sum + pos.totalCost, 0);
    const variantCost = variantPositions.reduce((sum, pos) => sum + pos.totalCost, 0);
    const costChange = variantCost - baseCost;

    const baseFte = basePositions.reduce((sum, pos) => sum + pos.fte, 0);
    const variantFte = variantPositions.reduce((sum, pos) => sum + pos.fte, 0);
    const fteChange = variantFte - baseFte;

    const structuralChanges = generateDepartmentStructuralChanges(basePositions, variantPositions);

    departmentAnalyses.push({
      departmentName: deptName,
      baselinePositions: basePositions,
      variantPositions: variantPositions,
      costChange,
      fteChange,
      structuralChanges
    });
  });

  return departmentAnalyses.sort((a, b) => Math.abs(b.costChange) - Math.abs(a.costChange));
}

/**
 * Group positions by department
 */
function groupByDepartment(positions: Position[]): Record<string, Position[]> {
  return positions.reduce((groups, position) => {
    const dept = position.department || 'General';
    if (!groups[dept]) {
      groups[dept] = [];
    }
    groups[dept].push(position);
    return groups;
  }, {} as Record<string, Position[]>);
}

/**
 * Generate structural change descriptions for a department
 */
function generateDepartmentStructuralChanges(
  basePositions: Position[],
  variantPositions: Position[]
): string[] {
  const changes: string[] = [];
  const baseCount = basePositions.length;
  const variantCount = variantPositions.length;

  if (variantCount > baseCount) {
    changes.push(`Added ${variantCount - baseCount} positions`);
  } else if (variantCount < baseCount) {
    changes.push(`Removed ${baseCount - variantCount} positions`);
  }

  // Analyze management layer changes
  const baseLevels = new Set(basePositions.map(pos => pos.level));
  const variantLevels = new Set(variantPositions.map(pos => pos.level));

  if (variantLevels.size !== baseLevels.size) {
    changes.push(`Management levels changed from ${baseLevels.size} to ${variantLevels.size}`);
  }

  return changes;
}

/**
 * Generate recommendations based on scenario comparison
 */
function generateRecommendations(
  summary: any,
  structuralAnalysis: any
): string[] {
  const recommendations: string[] = [];

  // Cost impact recommendations
  if (Math.abs(summary.costSummary.percentageChange) > 10) {
    if (summary.costSummary.percentageChange > 0) {
      recommendations.push('Significant cost increase detected. Consider phased implementation to manage budget impact.');
    } else {
      recommendations.push('Substantial cost savings identified. Ensure quality of service is maintained during transition.');
    }
  }

  // FTE impact recommendations
  if (summary.fteImpact.fteChange > 0) {
    recommendations.push('Increased staffing requirements. Plan for recruitment and onboarding processes.');
  } else if (summary.fteImpact.fteChange < -5) {
    recommendations.push('Significant workforce reduction. Implement change management and support programs.');
  }

  // Structural change recommendations
  if (structuralAnalysis.added.length > 5) {
    recommendations.push('Multiple new positions created. Ensure clear role definitions and reporting structures.');
  }

  if (structuralAnalysis.removed.length > 3) {
    recommendations.push('Several positions eliminated. Review workload distribution to prevent overload.');
  }

  if (structuralAnalysis.modified.length > 10) {
    recommendations.push('Extensive role modifications. Provide comprehensive training and communication.');
  }

  return recommendations;
}

/**
 * Identify risk factors in the scenario comparison
 */
function identifyRiskFactors(
  summary: any,
  structuralAnalysis: any
): string[] {
  const riskFactors: string[] = [];

  // Financial risks
  if (summary.costSummary.percentageChange > 20) {
    riskFactors.push('High financial risk: Cost increase exceeds 20%');
  }

  // Operational risks
  if (summary.fteImpact.fteChange < -0.2 * summary.fteImpact.baselineFte) {
    riskFactors.push('Operational risk: Workforce reduction exceeds 20%');
  }

  // Change management risks
  if (structuralAnalysis.modified.length > 0.5 * summary.totalPositions.baseline) {
    riskFactors.push('Change management risk: Over 50% of positions modified');
  }

  // Implementation risks
  if (structuralAnalysis.added.length > 0.3 * summary.totalPositions.baseline) {
    riskFactors.push('Implementation risk: Significant new hiring required');
  }

  return riskFactors;
}

/**
 * Calculate span of control analysis
 */
export function analyzeSpanOfControl(
  base: OrganizationalBaseline,
  variant: OrganizationalVariant
): {
  baseline: { average: number; max: number; distribution: Record<number, number> };
  variant: { average: number; max: number; distribution: Record<number, number> };
  improvement: number;
} {
  const basePositions = extractPositions(base);
  const variantPositions = extractPositions(variant);

  const baselineStats = calculateSpanStats(basePositions);
  const variantStats = calculateSpanStats(variantPositions);

  return {
    baseline: baselineStats,
    variant: variantStats,
    improvement: variantStats.average - baselineStats.average
  };
}

/**
 * Calculate span of control statistics
 */
function calculateSpanStats(positions: Position[]): {
  average: number;
  max: number;
  distribution: Record<number, number>;
} {
  const subordinateCounts = positions.map(pos => pos.subordinates?.length || 0);
  const managerCounts = subordinateCounts.filter(count => count > 0);

  const average = managerCounts.length > 0 
    ? managerCounts.reduce((sum, count) => sum + count, 0) / managerCounts.length 
    : 0;

  const max = Math.max(...subordinateCounts);

  const distribution = subordinateCounts.reduce((dist, count) => {
    dist[count] = (dist[count] || 0) + 1;
    return dist;
  }, {} as Record<number, number>);

  return { average, max, distribution };
}

/**
 * Export interface for integration with existing scenario service
 */
export interface ScenarioEngineResult {
  comparison: ScenarioComparison;
  departmentAnalysis: DepartmentAnalysis[];
  spanOfControlAnalysis: ReturnType<typeof analyzeSpanOfControl>;
  metadata: {
    generatedAt: Date;
    version: string;
  };
}

/**
 * Main scenario engine function that provides comprehensive analysis
 */
export function runScenarioEngine(
  base: OrganizationalBaseline,
  variant: OrganizationalVariant
): ScenarioEngineResult {
  return {
    comparison: compareScenarios_comprehensive(base, variant),
    departmentAnalysis: analyzeDepartmentChanges(base, variant),
    spanOfControlAnalysis: analyzeSpanOfControl(base, variant),
    metadata: {
      generatedAt: new Date(),
      version: '2.3.0'
    }
  };
}

/**
 * Utility function to format currency values
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Utility function to format percentage values
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export default {
  compareScenarios,
  compareScenarios_comprehensive,
  analyzeDepartmentChanges,
  analyzeSpanOfControl,
  runScenarioEngine,
  formatCurrency,
  formatPercentage
};
