/**
 * Development Scenario Service - Mock implementation for development
 * This service provides mock implementations that don't require database connection
 * 
 * @version 2.2.0
 * @author NorthPath Strategies
 */

import {
  OrganizationalBaseline,
  OrganizationalVariant,
  ScenarioResponse,
  ROICalculationResponse,
  CreateScenarioRequest,
  UpdateScenarioRequest,
  CalculateROIRequest,
  ScenarioValidationResult,
  ScenarioValidationError
} from '@/types/scenario';
import { runScenarioEngine, ScenarioEngineResult } from './scenarioEngine';
import { createDSCHAlgorithm, calculateDSCHScore } from '@/lib/algorithms/dsch';
import { ROIEngine } from '@/lib/roi-engine';
import { 
  createRealisticBaseline, 
  createOptimizedVariant, 
  createAssessmentData, 
  createOrganizationMetrics 
} from './scenario-test-data';

export class ScenarioServiceDev {
  private scenarios: Map<string, any> = new Map();
  private roiCalculations: Map<string, any[]> = new Map();
  private versions: Map<string, any[]> = new Map();
  private approvals: Map<string, any[]> = new Map();

  constructor() {
    // Initialize with enhanced mock data
    this.initializeMockData();
  }

  /**
   * Create a new organizational scenario
   */
  async createScenario(request: CreateScenarioRequest, userId: string): Promise<ScenarioResponse> {
    const scenarioId = `scenario_${Date.now()}`;
    
    const scenario = {
      id: scenarioId,
      organizationId: request.organizationId,
      name: request.name,
      description: request.description,
      baseline: request.baseline,
      variant: request.variant,
      savings: 120000,
      costImpact: 50000,
      timeline: this.estimateTimeline(request.variant),
      confidence: this.calculateConfidence(request.baseline, request.variant),
      status: 'DRAFT',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userId
    };

    this.scenarios.set(scenarioId, scenario);
    
    // Create initial ROI calculation
    const roiCalculation = {
      id: `roi_${Date.now()}`,
      scenarioId,
      calculationType: 'SIMPLE',
      initialCost: 50000,
      annualSavings: 120000,
      implementationCost: 30000,
      operationalCost: 20000,
      roiPercentage: 240,
      paybackPeriod: 5,
      npv: 85000,
      irr: 0.35,
      assumptions: {},
      riskFactors: {},
      calculatedAt: new Date(),
      calculatedBy: userId
    };

    this.roiCalculations.set(scenarioId, [roiCalculation]);

    return this.formatScenarioResponse(scenario);
  }

  /**
   * Get scenario by ID
   */
  async getScenario(scenarioId: string): Promise<ScenarioResponse | null> {
    const scenario = this.scenarios.get(scenarioId);
    if (!scenario) return null;
    return this.formatScenarioResponse(scenario);
  }

  /**
   * Get scenarios for an organization
   */
  async getOrganizationScenarios(
    organizationId: string,
    status?: string,
    limit: number = 50
  ): Promise<ScenarioResponse[]> {
    const scenarios = Array.from(this.scenarios.values())
      .filter(s => s.organizationId === organizationId)
      .filter(s => !status || s.status === status)
      .slice(0, limit);

    return scenarios.map(scenario => this.formatScenarioResponse(scenario));
  }

  /**
   * Update an existing scenario
   */
  async updateScenario(
    scenarioId: string,
    request: UpdateScenarioRequest,
    userId: string
  ): Promise<ScenarioResponse> {
    const scenario = this.scenarios.get(scenarioId);
    if (!scenario) {
      throw new Error('Scenario not found');
    }

    // Create version snapshot
    const versions = this.versions.get(scenarioId) || [];
    versions.push({
      id: `version_${Date.now()}`,
      scenarioId,
      version: versions.length + 1,
      changes: this.calculateChanges(scenario, request),
      baseline: scenario.baseline,
      variant: scenario.variant,
      createdAt: new Date(),
      createdBy: userId
    });
    this.versions.set(scenarioId, versions);

    // Update scenario
    if (request.name) scenario.name = request.name;
    if (request.description !== undefined) scenario.description = request.description;
    if (request.baseline) scenario.baseline = request.baseline;
    if (request.variant) scenario.variant = request.variant;
    scenario.updatedAt = new Date();

    this.scenarios.set(scenarioId, scenario);

    return this.formatScenarioResponse(scenario);
  }

  /**
   * Delete a scenario
   */
  async deleteScenario(scenarioId: string): Promise<void> {
    this.scenarios.delete(scenarioId);
    this.roiCalculations.delete(scenarioId);
    this.versions.delete(scenarioId);
    this.approvals.delete(scenarioId);
  }

  /**
   * Calculate detailed ROI for a scenario
   */
  async calculateDetailedROI(request: CalculateROIRequest, userId: string): Promise<ROICalculationResponse> {
    const roiCalculation = {
      id: `roi_${Date.now()}`,
      scenarioId: request.scenarioId,
      calculationType: request.calculationType,
      financialMetrics: {
        initialInvestment: 50000,
        implementationCost: 30000,
        annualSavings: 120000,
        operationalCostChange: -20000,
        roiPercentage: 240,
        paybackPeriod: 5,
        npv: 85000,
        irr: 0.35,
        breakEvenPoint: 5
      },
      assumptions: {
        discountRate: request.assumptions?.discountRate || 0.08,
        timeHorizon: request.assumptions?.timeHorizon || 3,
        inflationRate: request.assumptions?.inflationRate || 0.03,
        riskAdjustment: request.assumptions?.riskAdjustment || 0.05,
        taxRate: request.assumptions?.taxRate || 0.25
      },
      sensitivityAnalysis: {
        pessimistic: { roiPercentage: 180, paybackPeriod: 7 },
        optimistic: { roiPercentage: 300, paybackPeriod: 3 }
      },
      calculatedAt: new Date(),
      calculatedBy: userId
    };

    const calculations = this.roiCalculations.get(request.scenarioId) || [];
    calculations.push(roiCalculation);
    this.roiCalculations.set(request.scenarioId, calculations);

    return roiCalculation;
  }

  /**
   * Get ROI calculations for a scenario
   */
  async getROICalculations(scenarioId: string): Promise<ROICalculationResponse[]> {
    return this.roiCalculations.get(scenarioId) || [];
  }

  /**
   * Get scenario versions
   */
  async getScenarioVersions(scenarioId: string): Promise<any[]> {
    return this.versions.get(scenarioId) || [];
  }

  /**
   * Create a new scenario version
   */
  async createScenarioVersion(
    scenarioId: string,
    changes: any,
    userId: string
  ): Promise<any> {
    const scenario = this.scenarios.get(scenarioId);
    if (!scenario) {
      throw new Error('Scenario not found');
    }

    const versions = this.versions.get(scenarioId) || [];
    const version = {
      id: `version_${Date.now()}`,
      scenarioId,
      version: versions.length + 1,
      changes,
      baseline: scenario.baseline,
      variant: scenario.variant,
      createdAt: new Date(),
      createdBy: userId
    };

    versions.push(version);
    this.versions.set(scenarioId, versions);

    return version;
  }

  /**
   * Get scenario approvals
   */
  async getScenarioApprovals(scenarioId: string): Promise<any[]> {
    return this.approvals.get(scenarioId) || [];
  }

  /**
   * Submit an approval for a scenario
   */
  async submitApproval(
    scenarioId: string,
    approverId: string,
    status: 'APPROVED' | 'REJECTED' | 'PENDING',
    comments?: string
  ): Promise<any> {
    const approval = {
      id: `approval_${Date.now()}`,
      scenarioId,
      approverId,
      status,
      comments,
      approvedAt: status === 'APPROVED' ? new Date() : null,
      createdAt: new Date()
    };

    const approvals = this.approvals.get(scenarioId) || [];
    approvals.push(approval);
    this.approvals.set(scenarioId, approvals);

    // Update scenario status
    const scenario = this.scenarios.get(scenarioId);
    if (scenario) {
      if (status === 'APPROVED') {
        scenario.status = 'APPROVED';
      } else if (status === 'REJECTED') {
        scenario.status = 'DRAFT';
      } else {
        scenario.status = 'UNDER_REVIEW';
      }
      this.scenarios.set(scenarioId, scenario);
    }

    return approval;
  }

  /**
   * Compare two scenarios using the scenario engine
   */
  async compareScenarios(scenarioId1: string, scenarioId2: string): Promise<ScenarioEngineResult | null> {
    const scenario1 = this.scenarios.get(scenarioId1);
    const scenario2 = this.scenarios.get(scenarioId2);

    if (!scenario1 || !scenario2) {
      return null;
    }

    const baseline = scenario1.baseline as OrganizationalBaseline;
    const variant = scenario2.baseline as OrganizationalVariant;

    return runScenarioEngine(baseline, variant);
  }

  /**
   * Analyze a single scenario's structural changes
   */
  async analyzeScenarioStructure(scenarioId: string): Promise<ScenarioEngineResult | null> {
    const scenario = this.scenarios.get(scenarioId);
    if (!scenario) {
      return null;
    }

    const baseline = scenario.baseline as OrganizationalBaseline;
    const variant = scenario.variant as OrganizationalVariant;

    return runScenarioEngine(baseline, variant);
  }

  /**
   * Perform DSCH analysis on a scenario
   */
  async performDSCHAnalysis(scenarioId: string): Promise<{
    baseline: any;
    variant: any;
    improvement: any;
  } | null> {
    const scenario = this.scenarios.get(scenarioId);
    if (!scenario) {
      return null;
    }

    try {
      const assessmentData = createAssessmentData();
      const organizationMetrics = createOrganizationMetrics();

      // Calculate DSCH for baseline scenario
      const baselineDSCH = await calculateDSCHScore(assessmentData, organizationMetrics);
      
      // Simulate variant DSCH with improvements
      const variantAssessmentData = {
        ...assessmentData,
        responses: assessmentData.responses.map(response => ({
          ...response,
          value: Math.min(5, response.value + 1) // Simulate improvement
        }))
      };
      
      const variantDSCH = await calculateDSCHScore(variantAssessmentData, organizationMetrics);

      const improvement = {
        structuralComplexity: variantDSCH.structuralComplexity - baselineDSCH.structuralComplexity,
        operationalEfficiency: variantDSCH.operationalEfficiency - baselineDSCH.operationalEfficiency,
        culturalAlignment: variantDSCH.culturalAlignment - baselineDSCH.culturalAlignment,
        strategicReadiness: variantDSCH.strategicReadiness - baselineDSCH.strategicReadiness,
        overallImprovement: (variantDSCH.overallScore - baselineDSCH.overallScore) * 100
      };

      return {
        baseline: baselineDSCH,
        variant: variantDSCH,
        improvement
      };
    } catch (error) {
      console.error('DSCH analysis error:', error);
      return null;
    }
  }

  /**
   * Get scenario comparison summary
   */
  async getScenarioComparisonSummary(scenarioId: string): Promise<{
    costImpact: number;
    fteImpact: number;
    structuralChanges: number;
    riskLevel: 'low' | 'medium' | 'high';
  } | null> {
    const analysis = await this.analyzeScenarioStructure(scenarioId);
    if (!analysis) return null;

    const { comparison } = analysis;
    const riskLevel = comparison.riskFactors.length > 3 ? 'high' : 
                     comparison.riskFactors.length > 1 ? 'medium' : 'low';

    return {
      costImpact: comparison.deltaCost,
      fteImpact: comparison.summary.fteImpact.fteChange,
      structuralChanges: comparison.summary.positionsAdded + 
                        comparison.summary.positionsRemoved + 
                        comparison.summary.positionsModified,
      riskLevel
    };
  }

  /**
   * Private helper methods
   */
  private initializeMockData(): void {
    // Create realistic test scenario using enhanced test data
    const realisticBaseline = createRealisticBaseline();
    const optimizedVariant = createOptimizedVariant();

    const sampleScenario = {
      id: 'sample_scenario_1',
      organizationId: 'org_1',
      name: 'Management Layer Reduction Initiative',
      description: 'Reduce management layers from 7 to 5 across the organization using data-driven approach',
      baseline: realisticBaseline,
      variant: optimizedVariant,
      savings: 2500000, // From optimized variant
      costImpact: 95000, // Implementation cost
      timeline: 'Medium-term (3-6 months)',
      confidence: 0.85,
      status: 'DRAFT',
      createdAt: new Date('2025-07-01'),
      updatedAt: new Date('2025-07-13'),
      createdBy: 'user_admin'
    };

    // Add a second test scenario for comparison
    const secondScenario = {
      id: 'sample_scenario_2',
      organizationId: 'org_1',
      name: 'Technology Team Restructure',
      description: 'Reorganize technology teams for improved agility and innovation',
      baseline: realisticBaseline,
      variant: {
        ...optimizedVariant,
        projectedMetrics: {
          ...optimizedVariant.projectedMetrics,
          totalEmployees: 250,
          projectedSavings: 1800000,
          efficiencyGains: 0.20
        }
      },
      savings: 1800000,
      costImpact: 120000,
      timeline: 'Long-term (6-12 months)',
      confidence: 0.70,
      status: 'IN_REVIEW',
      createdAt: new Date('2025-06-15'),
      updatedAt: new Date('2025-07-10'),
      createdBy: 'user_admin'
    };

    this.scenarios.set('sample_scenario_1', sampleScenario);
    this.scenarios.set('sample_scenario_2', secondScenario);

    // Initialize ROI calculations for test scenarios
    this.initializeROICalculations();
  }

  /**
   * Initialize ROI calculations for test scenarios
   */
  private initializeROICalculations(): void {
    const roiEngine = new ROIEngine();
    
    // ROI for scenario 1
    const roi1 = {
      id: 'roi_001',
      scenarioId: 'sample_scenario_1',
      calculationType: 'DETAILED',
      financialMetrics: {
        initialInvestment: 95000,
        implementationCost: 95000,
        annualSavings: 2500000,
        operationalCostChange: -50000,
        roiPercentage: 2526, // Very high ROI
        paybackPeriod: 0.46, // About 5.5 months
        npv: 8750000,
        irr: 0.89,
        breakEvenPoint: 0.46
      },
      assumptions: {
        discountRate: 0.08,
        timeHorizon: 5,
        inflationRate: 0.03,
        riskAdjustment: 0.05,
        taxRate: 0.25
      },
      sensitivityAnalysis: {
        pessimistic: { roiPercentage: 1800, paybackPeriod: 0.6 },
        optimistic: { roiPercentage: 3200, paybackPeriod: 0.35 }
      },
      calculatedAt: new Date('2025-07-01'),
      calculatedBy: 'user_admin'
    };

    // ROI for scenario 2
    const roi2 = {
      id: 'roi_002',
      scenarioId: 'sample_scenario_2',
      calculationType: 'DETAILED',
      financialMetrics: {
        initialInvestment: 120000,
        implementationCost: 120000,
        annualSavings: 1800000,
        operationalCostChange: -30000,
        roiPercentage: 1400, // 1400% ROI
        paybackPeriod: 0.8, // About 9.6 months
        npv: 6200000,
        irr: 0.75,
        breakEvenPoint: 0.8
      },
      assumptions: {
        discountRate: 0.08,
        timeHorizon: 5,
        inflationRate: 0.03,
        riskAdjustment: 0.07, // Higher risk
        taxRate: 0.25
      },
      sensitivityAnalysis: {
        pessimistic: { roiPercentage: 900, paybackPeriod: 1.2 },
        optimistic: { roiPercentage: 1800, paybackPeriod: 0.6 }
      },
      calculatedAt: new Date('2025-06-15'),
      calculatedBy: 'user_admin'
    };

    this.roiCalculations.set('sample_scenario_1', [roi1]);
    this.roiCalculations.set('sample_scenario_2', [roi2]);
  }

  private estimateTimeline(variant: OrganizationalVariant): string {
    const totalWeeks = variant.implementationPlan?.reduce((sum, step) => sum + (step.duration || 4), 0) || 12;
    const months = Math.ceil(totalWeeks / 4);
    
    if (months <= 3) return 'Short-term (1-3 months)';
    if (months <= 6) return 'Medium-term (3-6 months)';
    if (months <= 12) return 'Long-term (6-12 months)';
    return 'Extended (12+ months)';
  }

  private calculateConfidence(
    baseline: OrganizationalBaseline,
    variant: OrganizationalVariant
  ): number {
    let confidence = 0.8; // Base confidence

    // Add confidence calculation logic here
    return Math.max(0.3, Math.min(0.95, confidence));
  }

  private calculateChanges(currentScenario: any, request: UpdateScenarioRequest): any {
    const changes: any = {};
    
    if (request.name && request.name !== currentScenario.name) {
      changes.name = { from: currentScenario.name, to: request.name };
    }
    
    if (request.description !== undefined && request.description !== currentScenario.description) {
      changes.description = { from: currentScenario.description, to: request.description };
    }
    
    return changes;
  }

  private formatScenarioResponse(scenario: any): ScenarioResponse {
    return {
      id: scenario.id,
      organizationId: scenario.organizationId,
      name: scenario.name,
      description: scenario.description,
      baseline: scenario.baseline,
      variant: scenario.variant,
      savings: scenario.savings,
      costImpact: scenario.costImpact,
      timeline: scenario.timeline,
      confidence: scenario.confidence,
      status: scenario.status,
      createdAt: scenario.createdAt,
      updatedAt: scenario.updatedAt,
      createdBy: scenario.createdBy
    };
  }
}

/**
 * Factory function to create development scenario service
 */
export function createScenarioServiceDev(): ScenarioServiceDev {
  return new ScenarioServiceDev();
}
