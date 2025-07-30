/**
 * Assessment Types for Enterprise Algorithm Suite
 * Type definitions for organizational assessment data structures
 * 
 * @version 2.1.0
 * @author NorthPath Strategies
 * @enterprise true
 */

// Core Assessment Data Structure
export interface AssessmentData {
  id: string;
  userId: string;
  tier: 'INDIVIDUAL' | 'TEAM' | 'ENTERPRISE';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ANALYZED' | 'DELIVERED';
  institutionType: string;
  organizationType: 'university' | 'community-college' | 'healthcare' | 'government' | 'company_business' | 'trade_technical';
  responses: AssessmentResponse[];
  metadata: AssessmentMetadata;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  reportUrl?: string;
  teamId?: string;
  sharedWith?: string[];
  sharingSettings?: {
    public: boolean;
    teamAccess: boolean;
    externalSharing: boolean;
  };
}

// Individual Assessment Response
export interface AssessmentResponse {
  questionId: string;
  section: string;
  prompt: string;
  value: number; // Likert scale (1-5) or numeric value
  type: 'likert' | 'numeric' | 'text' | 'select' | 'upload';
  tags?: string[];
  institutionTypes?: string[];
  priority?: 'low' | 'medium' | 'high';
  timestamp?: string;
  confidence?: number; // Response confidence level (0-1)
}

// Assessment Metadata
export interface AssessmentMetadata {
  institutionName?: string;
  institutionSize?: 'small' | 'medium' | 'large' | 'enterprise';
  departmentCount?: number;
  employeeCount?: number;
  annualBudget?: number;
  geographicScope?: 'local' | 'regional' | 'national' | 'international';
  assessmentPurpose?: string;
  timeframe?: string;
  primaryContact?: string;
  version: string;
  algorithmVersion: string;
}

// Organization Metrics for Advanced Analysis
export interface OrganizationMetrics {
  // Structural Metrics
  hierarchyLevels: number;
  spanOfControl: number;
  departmentCount: number;
  employeeCount: number;
  reportingRelationships: number;
  
  // Operational Metrics
  processComplexity: number;
  decisionLatency: number;
  communicationEfficiency: number;
  resourceUtilization: number;
  taskAutomationLevel: number;
  
  // Cultural Metrics
  changeReadiness: number;
  collaborationIndex: number;
  innovationCapacity: number;
  leadershipEffectiveness: number;
  employeeEngagement: number;
  
  // Strategic Metrics
  goalAlignment: number;
  strategicAgility: number;
  marketResponsiveness: number;
  competitivePosition: number;
  futureReadiness: number;
  
  // Financial Metrics
  budgetEfficiency: number;
  costPerEmployee: number;
  revenuePerEmployee: number;
  operationalMargin: number;
  investmentInTechnology: number;
  
  // Technology Metrics
  digitalMaturity: number;
  systemIntegration: number;
  dataQuality: number;
  cybersecurityLevel: number;
  aiReadiness: number;
  
  // Performance Indicators
  productivityIndex: number;
  qualityMetrics: number;
  customerSatisfaction: number;
  employeeRetention: number;
  complianceLevel: number;
  
  // Risk Factors
  operationalRisk: number;
  financialRisk: number;
  technologicalRisk: number;
  regulatoryRisk: number;
  reputationalRisk: number;
}

// Section-specific Analysis Data
export interface SectionData {
  id: string;
  name: string;
  responses: AssessmentResponse[];
  score: number;
  weightedScore: number;
  percentile: number;
  benchmarkComparison: number;
  insights: string[];
  recommendations: string[];
  riskFactors: string[];
  improvementAreas: string[];
}

// Algorithm Input/Output Interfaces
export interface AlgorithmInput {
  assessmentData: AssessmentData;
  organizationMetrics: OrganizationMetrics;
  benchmarkData?: BenchmarkData;
  historicalData?: HistoricalData[];
  industryStandards?: IndustryStandards;
}

export interface AlgorithmOutput {
  algorithmName: string;
  version: string;
  score: number; // Primary algorithm score (0-1)
  percentile: number; // Peer comparison percentile (0-100)
  confidence: number; // Algorithm confidence level (0-1)
  interpretation: string;
  insights: AlgorithmInsights;
  recommendations: AlgorithmRecommendations;
  riskAssessment: RiskAssessment;
  benchmarkComparison: BenchmarkComparison;
  metadata: {
    calculatedAt: string;
    processingTime: number;
    dataQuality: number;
    sampleSize: number;
  };
}

// Algorithm-specific Insight Structures
export interface AlgorithmInsights {
  primary: string[];
  secondary: string[];
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  keyFindings: InsightDetail[];
}

export interface InsightDetail {
  category: string;
  description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  urgency: 'low' | 'medium' | 'high' | 'immediate';
  evidence: string[];
  relatedMetrics: string[];
}

// Recommendation Structures
export interface AlgorithmRecommendations {
  immediate: RecommendationItem[];
  shortTerm: RecommendationItem[];
  longTerm: RecommendationItem[];
  strategic: RecommendationItem[];
  priorityMatrix: PriorityMatrix;
}

export interface RecommendationItem {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  effort: 'low' | 'medium' | 'high' | 'extensive';
  impact: 'low' | 'medium' | 'high' | 'transformational';
  timeframe: string;
  resources: string[];
  dependencies: string[];
  riskLevel: 'low' | 'medium' | 'high';
  successMetrics: string[];
  estimatedROI?: number;
}

export interface PriorityMatrix {
  quickWins: RecommendationItem[];
  majorProjects: RecommendationItem[];
  fillIns: RecommendationItem[];
  thanklessProjects: RecommendationItem[];
}

// Risk Assessment Structure
export interface RiskAssessment {
  overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskCategories: RiskCategory[];
  mitigationStrategies: MitigationStrategy[];
  contingencyPlans: ContingencyPlan[];
}

export interface RiskCategory {
  category: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  probability: number; // 0-1
  impact: number; // 0-1
  description: string;
  indicators: string[];
  triggers: string[];
}

export interface MitigationStrategy {
  riskCategory: string;
  strategy: string;
  actions: string[];
  timeline: string;
  owner: string;
  resources: string[];
  successCriteria: string[];
}

export interface ContingencyPlan {
  scenario: string;
  triggers: string[];
  actions: string[];
  resources: string[];
  timeline: string;
  communicationPlan: string[];
}

// Benchmark and Comparison Data
export interface BenchmarkData {
  industry: string;
  organizationSize: string;
  geographicRegion: string;
  peers: PeerData[];
  industryAverages: Record<string, number>;
  topPerformers: Record<string, number>;
  bestPractices: BestPractice[];
}

export interface PeerData {
  id: string;
  anonymizedName: string;
  size: string;
  region: string;
  metrics: Record<string, number>;
  performanceLevel: 'low' | 'average' | 'high' | 'exceptional';
}

export interface BestPractice {
  category: string;
  practice: string;
  description: string;
  benefits: string[];
  implementationSteps: string[];
  successFactors: string[];
  commonPitfalls: string[];
}

export interface BenchmarkComparison {
  vsIndustryAverage: number; // Percentage difference
  vsPeers: number; // Percentile ranking
  vsTopPerformers: number; // Gap analysis
  strengthAreas: string[];
  improvementAreas: string[];
  competitiveAdvantages: string[];
  marketPosition: 'laggard' | 'follower' | 'average' | 'leader' | 'innovator';
}

// Historical and Trend Data
export interface HistoricalData {
  assessmentId: string;
  date: string;
  scores: Record<string, number>;
  metrics: Partial<OrganizationMetrics>;
  changes: ChangeLog[];
}

export interface ChangeLog {
  metric: string;
  previousValue: number;
  currentValue: number;
  changePercentage: number;
  trend: 'improving' | 'stable' | 'declining';
  factors: string[];
}

// Industry Standards and Regulations
export interface IndustryStandards {
  industry: string;
  standards: Standard[];
  regulations: Regulation[];
  compliance: ComplianceRequirement[];
  certifications: Certification[];
}

export interface Standard {
  name: string;
  organization: string;
  version: string;
  requirements: string[];
  applicability: string[];
  complianceLevel: 'mandatory' | 'recommended' | 'optional';
}

export interface Regulation {
  name: string;
  authority: string;
  effectiveDate: string;
  requirements: string[];
  penalties: string[];
  complianceDeadline?: string;
}

export interface ComplianceRequirement {
  area: string;
  requirement: string;
  currentStatus: 'compliant' | 'partial' | 'non-compliant' | 'unknown';
  gapAnalysis: string[];
  remediationSteps: string[];
  timeline: string;
  cost: number;
}

export interface Certification {
  name: string;
  issuingBody: string;
  validityPeriod: string;
  requirements: string[];
  benefits: string[];
  maintenanceRequirements: string[];
}

// Enterprise Features
export interface EnterpriseFeatures {
  multiTenancy: boolean;
  advancedAnalytics: boolean;
  predictiveModeling: boolean;
  customAlgorithms: boolean;
  apiAccess: boolean;
  whiteLabeling: boolean;
  dedicatedSupport: boolean;
  onPremiseDeployment: boolean;
}

// Export utility types
export type AssessmentTier = 'INDIVIDUAL' | 'TEAM' | 'ENTERPRISE';
export type AssessmentStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ANALYZED' | 'DELIVERED';
export type OrganizationType = 'university' | 'community-college' | 'healthcare' | 'government' | 'company_business' | 'trade_technical';
export type InstitutionSize = 'small' | 'medium' | 'large' | 'enterprise';
export type ResponseType = 'likert' | 'numeric' | 'text' | 'select' | 'upload';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';
export type ImpactLevel = 'low' | 'medium' | 'high' | 'transformational';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type TrendDirection = 'improving' | 'stable' | 'declining';
export type PerformanceLevel = 'low' | 'average' | 'high' | 'exceptional';
export type MarketPosition = 'laggard' | 'follower' | 'average' | 'leader' | 'innovator';
