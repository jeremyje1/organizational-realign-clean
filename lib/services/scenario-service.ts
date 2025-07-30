/**
 * Scenario Service - Management layer for organizational scenarios
 * Handles CRUD operations and business logic for scenario modeling
 * 
 * @version 2.1.0
 * @author NorthPath Strategies
 */

import { PrismaClient } from '@prisma/client';
import { ROIEngine } from '@/lib/roi-engine';
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

export class ScenarioService {
  private prisma: PrismaClient;
  private roiEngine: ROIEngine;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.roiEngine = new ROIEngine();
  }

  /**
   * Create a new organizational scenario
   */
  async createScenario(request: CreateScenarioRequest, userId: string): Promise<ScenarioResponse> {
    // Validate the scenario data
    const validation = this.validateScenarioData(request.baseline, request.variant);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    // Calculate initial ROI estimate
    const roiAnalysis = await this.roiEngine.calculateROI(
      request.baseline,
      request.variant,
      'SIMPLE'
    );

    // Create scenario record
    const scenario = await this.prisma.scenario.create({
      data: {
        organizationId: request.organizationId,
        name: request.name,
        description: request.description,
        baseline: request.baseline as any,
        variant: request.variant as any,
        savings: roiAnalysis.financialMetrics.annualSavings,
        costImpact: roiAnalysis.financialMetrics.initialInvestment,
        timeline: this.estimateTimeline(request.variant),
        confidence: this.calculateConfidence(request.baseline, request.variant),
        createdBy: userId,
        status: 'DRAFT'
      }
    });

    // Create initial ROI calculation record
    await this.prisma.rOICalculation.create({
      data: {
        scenarioId: scenario.id,
        calculationType: 'SIMPLE',
        initialCost: roiAnalysis.financialMetrics.initialInvestment,
        annualSavings: roiAnalysis.financialMetrics.annualSavings,
        implementationCost: roiAnalysis.financialMetrics.implementationCost,
        operationalCost: roiAnalysis.financialMetrics.operationalCostChange,
        roiPercentage: roiAnalysis.financialMetrics.roiPercentage,
        paybackPeriod: roiAnalysis.financialMetrics.paybackPeriod,
        npv: roiAnalysis.financialMetrics.npv,
        irr: roiAnalysis.financialMetrics.irr,
        assumptions: roiAnalysis.assumptions as any,
        riskFactors: this.extractRiskFactors(request.variant),
        calculatedBy: userId
      }
    });

    return this.formatScenarioResponse(scenario);
  }

  /**
   * Get scenario by ID
   */
  async getScenario(scenarioId: string): Promise<ScenarioResponse | null> {
    const scenario = await this.prisma.scenario.findUnique({
      where: { id: scenarioId },
      include: {
        roiCalculations: {
          orderBy: { calculatedAt: 'desc' },
          take: 1
        },
        scenarioVersions: {
          orderBy: { version: 'desc' },
          take: 5
        }
      }
    });

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
    const scenarios = await this.prisma.scenario.findMany({
      where: {
        organizationId,
        ...(status && { status: status as any })
      },
      include: {
        roiCalculations: {
          orderBy: { calculatedAt: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

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
    // Get current scenario
    const currentScenario = await this.prisma.scenario.findUnique({
      where: { id: scenarioId }
    });

    if (!currentScenario) {
      throw new Error('Scenario not found');
    }

    // Create version snapshot before update
    const currentVersion = await this.prisma.scenarioVersion.count({
      where: { scenarioId }
    });

    await this.prisma.scenarioVersion.create({
      data: {
        scenarioId,
        version: currentVersion + 1,
        changes: this.calculateChanges(currentScenario, request),
        baseline: currentScenario.baseline,
        variant: currentScenario.variant,
        createdBy: userId
      }
    });

    // Update scenario
    const updateData: any = {};
    if (request.name) updateData.name = request.name;
    if (request.description !== undefined) updateData.description = request.description;
    if (request.baseline) updateData.baseline = request.baseline;
    if (request.variant) updateData.variant = request.variant;

    // Recalculate ROI if baseline or variant changed
    if (request.baseline || request.variant) {
      const baseline = (request.baseline || currentScenario.baseline) as OrganizationalBaseline;
      const variant = (request.variant || currentScenario.variant) as OrganizationalVariant;

      const roiAnalysis = await this.roiEngine.calculateROI(baseline, variant, 'SIMPLE');
      
      updateData.savings = roiAnalysis.financialMetrics.annualSavings;
      updateData.costImpact = roiAnalysis.financialMetrics.initialInvestment;
      updateData.timeline = this.estimateTimeline(variant);
      updateData.confidence = this.calculateConfidence(baseline, variant);
    }

    const updatedScenario = await this.prisma.scenario.update({
      where: { id: scenarioId },
      data: updateData
    });

    return this.formatScenarioResponse(updatedScenario);
  }

  /**
   * Delete a scenario
   */
  async deleteScenario(scenarioId: string): Promise<void> {
    await this.prisma.scenario.delete({
      where: { id: scenarioId }
    });
  }

  /**
   * Calculate detailed ROI for a scenario
   */
  async calculateDetailedROI(request: CalculateROIRequest, userId: string): Promise<ROICalculationResponse> {
    const scenario = await this.prisma.scenario.findUnique({
      where: { id: request.scenarioId }
    });

    if (!scenario) {
      throw new Error('Scenario not found');
    }

    const baseline = scenario.baseline as OrganizationalBaseline;
    const variant = scenario.variant as OrganizationalVariant;

    // Perform ROI calculation
    const roiAnalysis = await this.roiEngine.calculateROI(
      baseline,
      variant,
      request.calculationType,
      request.assumptions
    );

    // Save calculation results
    const roiCalculation = await this.prisma.rOICalculation.create({
      data: {
        scenarioId: request.scenarioId,
        calculationType: request.calculationType,
        initialCost: roiAnalysis.financialMetrics.initialInvestment,
        annualSavings: roiAnalysis.financialMetrics.annualSavings,
        implementationCost: roiAnalysis.financialMetrics.implementationCost,
        operationalCost: roiAnalysis.financialMetrics.operationalCostChange,
        roiPercentage: roiAnalysis.financialMetrics.roiPercentage,
        paybackPeriod: roiAnalysis.financialMetrics.paybackPeriod,
        npv: roiAnalysis.financialMetrics.npv,
        irr: roiAnalysis.financialMetrics.irr,
        assumptions: roiAnalysis.assumptions as any,
        riskFactors: this.extractRiskFactors(variant),
        sensitivityAnalysis: roiAnalysis.sensitivityAnalysis as any,
        calculatedBy: userId
      }
    });

    return {
      id: roiCalculation.id,
      scenarioId: roiCalculation.scenarioId,
      calculationType: roiCalculation.calculationType,
      financialMetrics: roiAnalysis.financialMetrics,
      assumptions: roiAnalysis.assumptions,
      sensitivityAnalysis: roiAnalysis.sensitivityAnalysis,
      monteCarloResults: roiAnalysis.monteCarloResults,
      calculatedAt: roiCalculation.calculatedAt,
      calculatedBy: roiCalculation.calculatedBy
    };
  }

  /**
   * Get ROI calculations for a scenario
   */
  async getROICalculations(scenarioId: string): Promise<ROICalculationResponse[]> {
    const calculations = await this.prisma.rOICalculation.findMany({
      where: { scenarioId },
      orderBy: { calculatedAt: 'desc' }
    });

    return calculations.map(calc => ({
      id: calc.id,
      scenarioId: calc.scenarioId,
      calculationType: calc.calculationType,
      financialMetrics: {
        initialInvestment: Number(calc.initialCost),
        implementationCost: Number(calc.implementationCost),
        annualSavings: Number(calc.annualSavings),
        operationalCostChange: Number(calc.operationalCost),
        roiPercentage: Number(calc.roiPercentage),
        paybackPeriod: Number(calc.paybackPeriod),
        npv: Number(calc.npv || 0),
        irr: Number(calc.irr || 0),
        breakEvenPoint: Number(calc.paybackPeriod) // Simplified
      },
      assumptions: calc.assumptions as any,
      sensitivityAnalysis: calc.sensitivityAnalysis as any,
      calculatedAt: calc.calculatedAt,
      calculatedBy: calc.calculatedBy
    }));
  }

  /**
   * Approve or reject a scenario
   */
  async approveScenario(
    scenarioId: string,
    approverId: string,
    status: 'APPROVED' | 'REJECTED',
    comments?: string
  ): Promise<void> {
    await this.prisma.scenarioApproval.create({
      data: {
        scenarioId,
        approverId,
        status,
        comments,
        approvedAt: status === 'APPROVED' ? new Date() : null
      }
    });

    // Update scenario status
    await this.prisma.scenario.update({
      where: { id: scenarioId },
      data: {
        status: status === 'APPROVED' ? 'APPROVED' : 'UNDER_REVIEW'
      }
    });
  }

  /**
   * Get scenario versions
   */
  async getScenarioVersions(scenarioId: string): Promise<any[]> {
    const versions = await this.prisma.scenarioVersion.findMany({
      where: { scenarioId },
      orderBy: { version: 'desc' }
    });

    return versions.map(version => ({
      id: version.id,
      scenarioId: version.scenarioId,
      version: version.version,
      changes: version.changes,
      baseline: version.baseline,
      variant: version.variant,
      createdAt: version.createdAt,
      createdBy: version.createdBy
    }));
  }

  /**
   * Create a new scenario version
   */
  async createScenarioVersion(
    scenarioId: string,
    changes: any,
    userId: string
  ): Promise<any> {
    const currentScenario = await this.prisma.scenario.findUnique({
      where: { id: scenarioId }
    });

    if (!currentScenario) {
      throw new Error('Scenario not found');
    }

    // Get the next version number
    const currentVersion = await this.prisma.scenarioVersion.count({
      where: { scenarioId }
    });

    const version = await this.prisma.scenarioVersion.create({
      data: {
        scenarioId,
        version: currentVersion + 1,
        changes,
        baseline: currentScenario.baseline,
        variant: currentScenario.variant,
        createdBy: userId
      }
    });

    return {
      id: version.id,
      scenarioId: version.scenarioId,
      version: version.version,
      changes: version.changes,
      baseline: version.baseline,
      variant: version.variant,
      createdAt: version.createdAt,
      createdBy: version.createdBy
    };
  }

  /**
   * Get scenario approvals
   */
  async getScenarioApprovals(scenarioId: string): Promise<any[]> {
    const approvals = await this.prisma.scenarioApproval.findMany({
      where: { scenarioId },
      orderBy: { createdAt: 'desc' }
    });

    return approvals.map(approval => ({
      id: approval.id,
      scenarioId: approval.scenarioId,
      approverId: approval.approverId,
      status: approval.status,
      comments: approval.comments,
      approvedAt: approval.approvedAt,
      createdAt: approval.createdAt
    }));
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
    const approval = await this.prisma.scenarioApproval.create({
      data: {
        scenarioId,
        approverId,
        status,
        comments,
        approvedAt: status === 'APPROVED' ? new Date() : null
      }
    });

    // Update scenario status based on approval
    let scenarioStatus = 'UNDER_REVIEW';
    if (status === 'APPROVED') {
      scenarioStatus = 'APPROVED';
    } else if (status === 'REJECTED') {
      scenarioStatus = 'DRAFT'; // Return to draft for revision
    }

    await this.prisma.scenario.update({
      where: { id: scenarioId },
      data: { status: scenarioStatus as any }
    });

    return {
      id: approval.id,
      scenarioId: approval.scenarioId,
      approverId: approval.approverId,
      status: approval.status,
      comments: approval.comments,
      approvedAt: approval.approvedAt,
      createdAt: approval.createdAt
    };
  }

  /**
   * Private helper methods
   */
  private validateScenarioData(
    baseline: OrganizationalBaseline,
    variant: OrganizationalVariant
  ): ScenarioValidationResult {
    const errors: ScenarioValidationError[] = [];
    const warnings: string[] = [];

    // Validate baseline data
    if (!baseline.organizationChart) {
      errors.push({
        field: 'baseline.organizationChart',
        message: 'Organization chart is required',
        code: 'MISSING_ORG_CHART'
      });
    }

    if (!baseline.costStructure || baseline.costStructure.totalAnnualCost <= 0) {
      errors.push({
        field: 'baseline.costStructure',
        message: 'Valid cost structure is required',
        code: 'INVALID_COST_STRUCTURE'
      });
    }

    // Validate variant data
    if (!variant.proposedChart) {
      errors.push({
        field: 'variant.proposedChart',
        message: 'Proposed organization chart is required',
        code: 'MISSING_PROPOSED_CHART'
      });
    }

    // Validate that variant actually changes something
    if (baseline.currentMetrics.totalEmployees === variant.projectedMetrics.totalEmployees &&
        baseline.currentMetrics.managementLayers === variant.projectedMetrics.managementLayers) {
      warnings.push('Scenario appears to make minimal organizational changes');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  private estimateTimeline(variant: OrganizationalVariant): string {
    const totalWeeks = variant.implementationPlan.reduce((sum, step) => sum + step.duration, 0);
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

    // Reduce confidence for complex changes
    if (variant.changesRequired.length > 10) confidence -= 0.1;
    if (variant.projectedMetrics.managementLayers < baseline.currentMetrics.managementLayers - 2) {
      confidence -= 0.1;
    }

    // Increase confidence for well-defined plans
    if (variant.implementationPlan.length > 3) confidence += 0.05;

    return Math.max(0.3, Math.min(0.95, confidence));
  }

  private extractRiskFactors(variant: OrganizationalVariant): any {
    return {
      organizationalRisks: variant.changesRequired
        .filter(change => change.riskLevel === 'HIGH')
        .map(change => change.description),
      implementationRisks: variant.implementationPlan
        .flatMap(step => step.risks)
        .filter(risk => risk.probability > 0.3)
    };
  }

  private calculateChanges(currentScenario: any, request: UpdateScenarioRequest): any {
    const changes: any = {};
    
    if (request.name && request.name !== currentScenario.name) {
      changes.name = { from: currentScenario.name, to: request.name };
    }
    
    if (request.description !== undefined && request.description !== currentScenario.description) {
      changes.description = { from: currentScenario.description, to: request.description };
    }
    
    // Add more sophisticated change tracking here
    
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
      savings: scenario.savings ? Number(scenario.savings) : undefined,
      costImpact: scenario.costImpact ? Number(scenario.costImpact) : undefined,
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
 * Factory function to create scenario service
 */
export function createScenarioService(prisma: PrismaClient): ScenarioService {
  return new ScenarioService(prisma);
}
