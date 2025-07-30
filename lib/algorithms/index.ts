/**
 * Algorithm Layer - Enterprise Suite
 * NorthPath Strategies Organizational Assessment Platform
 * 
 * This module exports all enterprise-grade algorithms for organizational analysis:
 * - DSCH: Dynamic Structural Complexity Heuristic v2.1
 * - CRF: Cultural Resilience Factor
 * - LEI: Leadership Effectiveness Index
 * - OCI: Organizational Change Index
 * - HOCI: Higher-Order Complexity Indicator
 * 
 * @version 2.1.0
 * @author NorthPath Strategies
 * @enterprise true
 */

// Core Algorithm Exports
export { 
  DSCHAlgorithm, 
  createDSCHAlgorithm, 
  calculateDSCHScore,
  DSCH_CONFIG,
  DSCH_VERSION,
  type DSCHMetrics,
  type RiskFactor,
  type Recommendation,
  type BenchmarkData
} from './dsch';

export {
  CRFAlgorithm,
  createCRFAlgorithm,
  calculateCRFScore,
  CRF_CONFIG,
  CRF_VERSION,
  type CRFMetrics,
  type CulturalFactor,
  type ResilienceIndicator
} from './crf';

export {
  LEIAlgorithm,
  createLEIAlgorithm,
  calculateLEIScore,
  LEI_CONFIG,
  LEI_VERSION,
  type LEIMetrics,
  type LeadershipDimension,
  type EffectivenessScore
} from './lei';

export {
  OCIAlgorithm,
  createOCIAlgorithm,
  calculateOCIScore,
  OCI_CONFIG,
  OCI_VERSION,
  type OCIMetrics,
  type ChangeReadiness,
  type AdaptabilityFactor
} from './oci';

export {
  HOCIAlgorithm,
  createHOCIAlgorithm,
  calculateHOCIScore,
  HOCI_CONFIG,
  HOCI_VERSION,
  type HOCIMetrics,
  type ComplexityLayer,
  type SystemicIndicator
} from './hoci';

// Utility Functions
export {
  calculateWeightedScore,
  normalizeScore,
  calculatePercentileRank,
  aggregateMetrics,
  generateInsights,
  validateAssessmentData,
  type AlgorithmConfig,
  type ScoreMetrics,
  type ValidationResult
} from './utils';

// Simplified Algorithm Pattern (matches requirements specification)
export {
  calcDSCH,
  calcCRF,
  calcLEI,
  runAlgorithms,
  type DSCHInput,
  type DSCHResult,
  type CRFInput,
  type CRFResult,
  type LEIInput,
  type LEIResult,
  type AlgorithmPayload,
  type AlgorithmResults
} from './simple-runner';

// Enterprise Algorithm Suite
export interface EnterpriseAlgorithmSuite {
  dsch: DSCHMetrics;
  crf: CRFMetrics;
  lei: LEIMetrics;
  oci: OCIMetrics;
  hoci: HOCIMetrics;
}

/**
 * Master function to calculate all enterprise algorithms
 * @param assessmentData Raw assessment responses
 * @param organizationMetrics Organizational context data
 * @returns Complete enterprise algorithm suite results
 */
export async function calculateEnterpriseMetrics(
  assessmentData: any,
  organizationMetrics: any
): Promise<EnterpriseAlgorithmSuite> {
  // Import algorithms directly to avoid re-export issues
  const { createDSCHAlgorithm } = await import('./dsch');
  const { createCRFAlgorithm } = await import('./crf');
  const { createLEIAlgorithm } = await import('./lei');
  const { createOCIAlgorithm } = await import('./oci');
  const { createHOCIAlgorithm } = await import('./hoci');

  // Create algorithm instances
  const dschAlg = createDSCHAlgorithm();
  const crfAlg = createCRFAlgorithm();
  const leiAlg = createLEIAlgorithm();
  const ociAlg = createOCIAlgorithm();
  const hociAlg = createHOCIAlgorithm();

  // Calculate all metrics
  const [dsch, crf, lei, oci, hoci] = await Promise.all([
    Promise.resolve(dschAlg.calculateDSCH(assessmentData, organizationMetrics)),
    Promise.resolve(crfAlg.calculateCRF(assessmentData, organizationMetrics)),
    Promise.resolve(leiAlg.calculateLEI(assessmentData, organizationMetrics)),
    Promise.resolve(ociAlg.calculateOCI(assessmentData, organizationMetrics)),
    Promise.resolve(hociAlg.calculateHOCI(assessmentData, organizationMetrics))
  ]);

  return { dsch, crf, lei, oci, hoci };
}

/**
 * Algorithm version information
 */
export const ALGORITHM_SUITE_VERSION = {
  version: '2.1.0',
  releaseDate: '2025-07-12',
  patterns: {
    enterprise: 'Full enterprise-grade multi-dimensional analysis',
    simplified: 'Core span-of-control and organizational metrics'
  },
  algorithms: {
    dsch: '2.1.0',
    crf: '2.1.0',
    lei: '2.1.0',
    oci: '2.1.0',
    hoci: '2.1.0'
  },
  features: [
    'Enterprise-grade multi-algorithm analysis',
    'Cross-algorithm correlation analysis',
    'Predictive analytics integration',
    'Real-time benchmarking',
    'Advanced risk assessment',
    'ROI-optimized recommendations'
  ]
} as const;
