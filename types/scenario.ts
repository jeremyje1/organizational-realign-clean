/**
 * Scenario Modeling & ROI Engine Type Definitions
 * Types for organizational restructuring scenarios and financial modeling
 * 
 * @version 2.1.0
 * @author NorthPath Strategies
 */

// Core scenario data structures
export interface OrganizationalBaseline {
  organizationChart: OrgChartNode;
  costStructure: CostStructure;
  currentMetrics: BaselineMetrics;
  employeeData: EmployeeRecord[];
  departments: Department[];
}

export interface OrganizationalVariant {
  proposedChart: OrgChartNode;
  proposedCostStructure: CostStructure;
  projectedMetrics: ProjectedMetrics;
  changesRequired: OrganizationalChange[];
  implementationPlan: ImplementationStep[];
}

export interface OrgChartNode {
  id: string;
  name: string;
  title: string;
  department: string;
  level: number;
  directReports: OrgChartNode[];
  costCenterId?: string;
  salary?: number;
  benefits?: number;
  overhead?: number;
}

export interface CostStructure {
  totalAnnualCost: number;
  costBreakdown: {
    salaries: number;
    benefits: number;
    overhead: number;
    technology: number;
    facilities: number;
    other: number;
  };
  costCenters: CostCenterData[];
}

export interface CostCenterData {
  id: string;
  name: string;
  category: string;
  annualBudget: number;
  actualCost: number;
  employees: number;
  costPerEmployee: number;
}

export interface BaselineMetrics {
  totalEmployees: number;
  managementLayers: number;
  averageSpanOfControl: number;
  managementRatio: number; // managers to individual contributors
  costPerEmployee: number;
  totalAnnualCost: number;
  departmentCount: number;
}

export interface ProjectedMetrics extends BaselineMetrics {
  projectedSavings: number;
  efficiencyGains: number;
  riskAdjustment: number;
}

export interface EmployeeRecord {
  id: string;
  name: string;
  title: string;
  department: string;
  managerId?: string;
  salary: number;
  benefits: number;
  startDate: Date;
  level: number;
  isManager: boolean;
}

export interface Department {
  id: string;
  name: string;
  managerId: string;
  parentDepartmentId?: string;
  costCenterId?: string;
  employeeCount: number;
  annualBudget: number;
}

export interface OrganizationalChange {
  type: 'RESTRUCTURE' | 'ELIMINATE_POSITION' | 'ADD_POSITION' | 'CHANGE_REPORTING' | 'MERGE_DEPARTMENTS' | 'SPLIT_DEPARTMENT';
  description: string;
  affectedEmployees: string[];
  costImpact: number;
  timeframe: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  dependencies: string[];
}

export interface ImplementationStep {
  id: string;
  phase: number;
  description: string;
  duration: number; // in weeks
  cost: number;
  resources: string[];
  risks: ImplementationRisk[];
  dependencies: string[];
  deliverables: string[];
}

export interface ImplementationRisk {
  type: 'ORGANIZATIONAL' | 'FINANCIAL' | 'OPERATIONAL' | 'REGULATORY' | 'TECHNICAL';
  description: string;
  probability: number; // 0.0 to 1.0
  impact: number; // 0.0 to 1.0
  mitigation: string[];
}

// ROI Calculation types
export interface ROIAnalysis {
  scenarioId: string;
  calculationType: 'SIMPLE' | 'DETAILED' | 'MONTE_CARLO' | 'SENSITIVITY';
  financialMetrics: FinancialMetrics;
  assumptions: ROIAssumptions;
  sensitivityAnalysis?: SensitivityAnalysis;
  monteCarloResults?: MonteCarloResults;
  recommendations: ROIRecommendation[];
}

export interface FinancialMetrics {
  initialInvestment: number;
  implementationCost: number;
  annualSavings: number;
  operationalCostChange: number;
  roiPercentage: number;
  paybackPeriod: number; // in months
  npv: number; // Net Present Value
  irr: number; // Internal Rate of Return
  breakEvenPoint: number; // in months
}

export interface ROIAssumptions {
  discountRate: number;
  inflationRate: number;
  timeHorizon: number; // in years
  riskPremium: number;
  implementationSuccess: number; // probability 0.0 to 1.0
  savingsRealization: number; // percentage of projected savings actually realized
  customAssumptions: Record<string, any>;
}

export interface SensitivityAnalysis {
  variables: SensitivityVariable[];
  scenarios: SensitivityScenario[];
  results: SensitivityResult[];
}

export interface SensitivityVariable {
  name: string;
  baseValue: number;
  minValue: number;
  maxValue: number;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface SensitivityScenario {
  name: string;
  variables: Record<string, number>;
  probability: number;
}

export interface SensitivityResult {
  scenario: string;
  roiChange: number;
  npvChange: number;
  paybackPeriodChange: number;
}

export interface MonteCarloResults {
  iterations: number;
  roiDistribution: {
    mean: number;
    median: number;
    standardDeviation: number;
    percentiles: Record<string, number>; // 5th, 25th, 75th, 95th
  };
  npvDistribution: {
    mean: number;
    median: number;
    standardDeviation: number;
    percentiles: Record<string, number>;
  };
  successProbability: number; // probability of positive ROI
  confidence: number; // confidence level
}

export interface ROIRecommendation {
  type: 'PROCEED' | 'MODIFY' | 'REJECT' | 'DEFER';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  rationale: string;
  conditions?: string[];
  alternativeApproaches?: string[];
  riskMitigation?: string[];
}

// Benchmark and comparison types
export interface BenchmarkComparison {
  industry: string;
  organizationSize: string;
  metrics: BenchmarkMetric[];
  percentileRank: number;
  recommendations: string[];
}

export interface BenchmarkMetric {
  name: string;
  currentValue: number;
  industryMedian: number;
  industryBest: number;
  gap: number;
  improvementPotential: number;
}

// Scenario creation and management types
export interface ScenarioTemplate {
  id: string;
  name: string;
  description: string;
  category: 'COST_REDUCTION' | 'EFFICIENCY' | 'GROWTH' | 'RESTRUCTURE' | 'MERGER' | 'CUSTOM';
  defaultChanges: OrganizationalChange[];
  estimatedSavings: number;
  implementationTime: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface ScenarioComparison {
  scenarios: string[]; // scenario IDs
  metrics: ComparisonMetric[];
  recommendations: string[];
  bestOption: string;
  riskAssessment: RiskComparison[];
}

export interface ComparisonMetric {
  name: string;
  values: Record<string, number>; // scenarioId -> value
  unit: string;
  higherIsBetter: boolean;
}

export interface RiskComparison {
  scenarioId: string;
  overallRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  riskFactors: string[];
  mitigation: string[];
}

// API request/response types
export interface CreateScenarioRequest {
  organizationId: string;
  name: string;
  description?: string;
  baseline: OrganizationalBaseline;
  variant: OrganizationalVariant;
}

export interface UpdateScenarioRequest {
  name?: string;
  description?: string;
  baseline?: OrganizationalBaseline;
  variant?: OrganizationalVariant;
}

export interface CalculateROIRequest {
  scenarioId: string;
  calculationType: 'SIMPLE' | 'DETAILED' | 'MONTE_CARLO' | 'SENSITIVITY';
  assumptions?: Partial<ROIAssumptions>;
  sensitivityVariables?: SensitivityVariable[];
}

export interface ScenarioResponse {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  baseline: OrganizationalBaseline;
  variant: OrganizationalVariant;
  savings?: number;
  costImpact?: number;
  timeline?: string;
  confidence?: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface ROICalculationResponse {
  id: string;
  scenarioId: string;
  calculationType: string;
  financialMetrics: FinancialMetrics;
  assumptions: ROIAssumptions;
  sensitivityAnalysis?: SensitivityAnalysis;
  monteCarloResults?: MonteCarloResults;
  calculatedAt: Date;
  calculatedBy: string;
}

// Utility types for form handling and validation
export interface ScenarioValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ScenarioValidationResult {
  isValid: boolean;
  errors: ScenarioValidationError[];
  warnings: string[];
}

// Export all types
export type {
  // Prisma generated types will be imported separately
  ScenarioStatus,
  ROICalculationType,
  ApprovalStatus,
  CostCenterCategory
} from '@prisma/client';
