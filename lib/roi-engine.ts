/**
 * ROI Engine - Financial Analysis and Modeling
 * Core engine for calculating Return on Investment for organizational scenarios
 * 
 * @version 2.1.0
 * @author NorthPath Strategies
 */

import { 
  ROIAnalysis, 
  FinancialMetrics, 
  ROIAssumptions, 
  SensitivityAnalysis,
  MonteCarloResults,
  ROIRecommendation,
  OrganizationalBaseline,
  OrganizationalVariant
} from '@/types/scenario';

export class ROIEngine {
  private defaultAssumptions: ROIAssumptions = {
    discountRate: 0.08, // 8% discount rate
    inflationRate: 0.03, // 3% inflation
    timeHorizon: 5, // 5 years
    riskPremium: 0.02, // 2% risk premium
    implementationSuccess: 0.85, // 85% success probability
    savingsRealization: 0.90, // 90% of projected savings
    customAssumptions: {}
  };

  /**
   * Calculate comprehensive ROI analysis for a scenario
   */
  public async calculateROI(
    baseline: OrganizationalBaseline,
    variant: OrganizationalVariant,
    calculationType: 'SIMPLE' | 'DETAILED' | 'MONTE_CARLO' | 'SENSITIVITY' = 'DETAILED',
    customAssumptions?: Partial<ROIAssumptions>
  ): Promise<ROIAnalysis> {
    const assumptions = { ...this.defaultAssumptions, ...customAssumptions };
    
    // Calculate core financial metrics
    const financialMetrics = this.calculateFinancialMetrics(baseline, variant, assumptions);
    
    // Perform additional analysis based on calculation type
    let sensitivityAnalysis: SensitivityAnalysis | undefined;
    let monteCarloResults: MonteCarloResults | undefined;

    if (calculationType === 'SENSITIVITY' || calculationType === 'DETAILED') {
      sensitivityAnalysis = this.performSensitivityAnalysis(baseline, variant, assumptions);
    }

    if (calculationType === 'MONTE_CARLO') {
      monteCarloResults = this.performMonteCarloSimulation(baseline, variant, assumptions);
    }

    // Generate recommendations
    const recommendations = this.generateRecommendations(financialMetrics, assumptions);

    return {
      scenarioId: '', // Will be set by caller
      calculationType,
      financialMetrics,
      assumptions,
      sensitivityAnalysis,
      monteCarloResults,
      recommendations
    };
  }

  /**
   * Calculate core financial metrics
   */
  private calculateFinancialMetrics(
    baseline: OrganizationalBaseline,
    variant: OrganizationalVariant,
    assumptions: ROIAssumptions
  ): FinancialMetrics {
    // Calculate initial investment and implementation costs
    const implementationCost = this.calculateImplementationCost(variant);
    const initialInvestment = implementationCost;

    // Calculate annual savings
    const annualSavings = this.calculateAnnualSavings(baseline, variant, assumptions);
    
    // Calculate operational cost changes
    const operationalCostChange = this.calculateOperationalCostChange(baseline, variant);

    // Calculate net annual benefit
    const netAnnualBenefit = annualSavings - operationalCostChange;

    // Calculate payback period
    const paybackPeriod = initialInvestment / netAnnualBenefit * 12; // in months

    // Calculate NPV
    const npv = this.calculateNPV(
      initialInvestment,
      netAnnualBenefit,
      assumptions.discountRate,
      assumptions.timeHorizon
    );

    // Calculate IRR
    const irr = this.calculateIRR(initialInvestment, netAnnualBenefit, assumptions.timeHorizon);

    // Calculate ROI percentage
    const totalBenefit = netAnnualBenefit * assumptions.timeHorizon;
    const roiPercentage = ((totalBenefit - initialInvestment) / initialInvestment) * 100;

    // Calculate break-even point
    const breakEvenPoint = paybackPeriod;

    return {
      initialInvestment,
      implementationCost,
      annualSavings,
      operationalCostChange,
      roiPercentage,
      paybackPeriod,
      npv,
      irr,
      breakEvenPoint
    };
  }

  /**
   * Calculate implementation cost based on proposed changes
   */
  private calculateImplementationCost(variant: OrganizationalVariant): number {
    let totalCost = 0;

    // Sum costs from implementation plan
    variant.implementationPlan.forEach(step => {
      totalCost += step.cost;
    });

    // Add costs from organizational changes
    variant.changesRequired.forEach(change => {
      totalCost += Math.abs(change.costImpact);
    });

    return totalCost;
  }

  /**
   * Calculate annual savings from organizational changes
   */
  private calculateAnnualSavings(
    baseline: OrganizationalBaseline,
    variant: OrganizationalVariant,
    assumptions: ROIAssumptions
  ): number {
    // Calculate salary savings
    const baselineSalaryCost = this.calculateTotalSalaryCost(baseline.organizationChart);
    const variantSalaryCost = this.calculateTotalSalaryCost(variant.proposedChart);
    const salarySavings = baselineSalaryCost - variantSalaryCost;

    // Calculate overhead savings
    const overheadSavings = baseline.costStructure.totalAnnualCost - 
                           variant.proposedCostStructure.totalAnnualCost;

    // Calculate efficiency gains
    const efficiencyGains = this.calculateEfficiencyGains(baseline, variant);

    // Apply realization factor
    const totalSavings = (salarySavings + overheadSavings + efficiencyGains) * 
                        assumptions.savingsRealization;

    return Math.max(0, totalSavings);
  }

  /**
   * Calculate total salary cost from org chart
   */
  private calculateTotalSalaryCost(orgChart: any): number {
    let totalCost = 0;
    
    const calculateNodeCost = (node: any): number => {
      let nodeCost = (node.salary || 0) + (node.benefits || 0) + (node.overhead || 0);
      
      if (node.directReports) {
        node.directReports.forEach((report: any) => {
          nodeCost += calculateNodeCost(report);
        });
      }
      
      return nodeCost;
    };

    return calculateNodeCost(orgChart);
  }

  /**
   * Calculate efficiency gains from organizational improvements
   */
  private calculateEfficiencyGains(
    baseline: OrganizationalBaseline,
    variant: OrganizationalVariant
  ): number {
    // Calculate span of control improvements
    const spanImprovement = variant.projectedMetrics.averageSpanOfControl - 
                           baseline.currentMetrics.averageSpanOfControl;
    
    // Calculate management ratio improvements
    const mgmtRatioImprovement = baseline.currentMetrics.managementRatio - 
                                variant.projectedMetrics.managementRatio;

    // Estimate efficiency gains (simplified model)
    const spanEfficiencyGain = spanImprovement * 10000; // $10k per span improvement
    const mgmtEfficiencyGain = mgmtRatioImprovement * baseline.currentMetrics.totalEmployees * 5000;

    return Math.max(0, spanEfficiencyGain + mgmtEfficiencyGain);
  }

  /**
   * Calculate operational cost changes
   */
  private calculateOperationalCostChange(
    baseline: OrganizationalBaseline,
    variant: OrganizationalVariant
  ): number {
    // This would include increased costs from new systems, training, etc.
    return variant.proposedCostStructure.costBreakdown.other - 
           baseline.costStructure.costBreakdown.other;
  }

  /**
   * Calculate Net Present Value
   */
  private calculateNPV(
    initialInvestment: number,
    annualCashFlow: number,
    discountRate: number,
    years: number
  ): number {
    let npv = -initialInvestment;
    
    for (let year = 1; year <= years; year++) {
      npv += annualCashFlow / Math.pow(1 + discountRate, year);
    }
    
    return npv;
  }

  /**
   * Calculate Internal Rate of Return using Newton-Raphson method
   */
  private calculateIRR(
    initialInvestment: number,
    annualCashFlow: number,
    years: number
  ): number {
    let irr = 0.1; // Initial guess
    const maxIterations = 100;
    const tolerance = 0.0001;

    for (let i = 0; i < maxIterations; i++) {
      let npv = -initialInvestment;
      let dnpv = 0;

      for (let year = 1; year <= years; year++) {
        const factor = Math.pow(1 + irr, year);
        npv += annualCashFlow / factor;
        dnpv -= year * annualCashFlow / (factor * (1 + irr));
      }

      const newIrr = irr - npv / dnpv;
      
      if (Math.abs(newIrr - irr) < tolerance) {
        return newIrr;
      }
      
      irr = newIrr;
    }

    return irr;
  }

  /**
   * Perform sensitivity analysis
   */
  private performSensitivityAnalysis(
    baseline: OrganizationalBaseline,
    variant: OrganizationalVariant,
    assumptions: ROIAssumptions
  ): SensitivityAnalysis {
    const variables = [
      {
        name: 'Savings Realization Rate',
        baseValue: assumptions.savingsRealization,
        minValue: 0.6,
        maxValue: 1.0,
        impact: 'HIGH' as const
      },
      {
        name: 'Implementation Success Rate',
        baseValue: assumptions.implementationSuccess,
        minValue: 0.7,
        maxValue: 0.95,
        impact: 'HIGH' as const
      },
      {
        name: 'Discount Rate',
        baseValue: assumptions.discountRate,
        minValue: 0.05,
        maxValue: 0.12,
        impact: 'MEDIUM' as const
      }
    ];

    const scenarios = [
      { name: 'Best Case', variables: {}, probability: 0.1 },
      { name: 'Most Likely', variables: {}, probability: 0.7 },
      { name: 'Worst Case', variables: {}, probability: 0.2 }
    ];

    const results = scenarios.map(scenario => ({
      scenario: scenario.name,
      roiChange: 0, // Would calculate actual changes
      npvChange: 0,
      paybackPeriodChange: 0
    }));

    return {
      variables,
      scenarios,
      results
    };
  }

  /**
   * Perform Monte Carlo simulation
   */
  private performMonteCarloSimulation(
    baseline: OrganizationalBaseline,
    variant: OrganizationalVariant,
    assumptions: ROIAssumptions,
    iterations: number = 10000
  ): MonteCarloResults {
    const roiResults: number[] = [];
    const npvResults: number[] = [];

    for (let i = 0; i < iterations; i++) {
      // Generate random variations in key parameters
      const simulationAssumptions = {
        ...assumptions,
        savingsRealization: this.randomNormal(assumptions.savingsRealization, 0.1),
        implementationSuccess: this.randomNormal(assumptions.implementationSuccess, 0.05),
        discountRate: this.randomNormal(assumptions.discountRate, 0.01)
      };

      // Calculate metrics with varied parameters
      const metrics = this.calculateFinancialMetrics(baseline, variant, simulationAssumptions);
      roiResults.push(metrics.roiPercentage);
      npvResults.push(metrics.npv);
    }

    return {
      iterations,
      roiDistribution: this.calculateDistributionStats(roiResults),
      npvDistribution: this.calculateDistributionStats(npvResults),
      successProbability: roiResults.filter(roi => roi > 0).length / iterations,
      confidence: 0.95
    };
  }

  /**
   * Generate ROI recommendations
   */
  private generateRecommendations(
    metrics: FinancialMetrics,
    assumptions: ROIAssumptions
  ): ROIRecommendation[] {
    const recommendations: ROIRecommendation[] = [];

    // Evaluate based on ROI percentage
    if (metrics.roiPercentage > 20) {
      recommendations.push({
        type: 'PROCEED',
        priority: 'HIGH',
        rationale: `Excellent ROI of ${metrics.roiPercentage.toFixed(1)}% exceeds target threshold`,
        conditions: ['Ensure implementation plan is realistic', 'Monitor progress closely']
      });
    } else if (metrics.roiPercentage > 10) {
      recommendations.push({
        type: 'PROCEED',
        priority: 'MEDIUM',
        rationale: `Good ROI of ${metrics.roiPercentage.toFixed(1)}% justifies investment`,
        conditions: ['Review implementation risks', 'Consider phased approach']
      });
    } else if (metrics.roiPercentage > 0) {
      recommendations.push({
        type: 'MODIFY',
        priority: 'MEDIUM',
        rationale: `Marginal ROI of ${metrics.roiPercentage.toFixed(1)}% suggests optimization needed`,
        alternativeApproaches: ['Reduce implementation costs', 'Increase efficiency targets']
      });
    } else {
      recommendations.push({
        type: 'REJECT',
        priority: 'HIGH',
        rationale: `Negative ROI of ${metrics.roiPercentage.toFixed(1)}% does not justify investment`,
        alternativeApproaches: ['Redesign scenario', 'Consider alternative approaches']
      });
    }

    // Evaluate based on payback period
    if (metrics.paybackPeriod > 36) {
      recommendations.push({
        type: 'MODIFY',
        priority: 'MEDIUM',
        rationale: `Long payback period of ${metrics.paybackPeriod.toFixed(1)} months`,
        riskMitigation: ['Accelerate benefit realization', 'Reduce upfront costs']
      });
    }

    return recommendations;
  }

  /**
   * Utility functions
   */
  private randomNormal(mean: number, stdDev: number): number {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + stdDev * z0;
  }

  private calculateDistributionStats(values: number[]) {
    const sorted = values.sort((a, b) => a - b);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const median = sorted[Math.floor(sorted.length / 2)];
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const standardDeviation = Math.sqrt(variance);

    const percentiles = {
      '5': sorted[Math.floor(sorted.length * 0.05)],
      '25': sorted[Math.floor(sorted.length * 0.25)],
      '75': sorted[Math.floor(sorted.length * 0.75)],
      '95': sorted[Math.floor(sorted.length * 0.95)]
    };

    return {
      mean,
      median,
      standardDeviation,
      percentiles
    };
  }
}

/**
 * Factory function to create ROI Engine instance
 */
export function createROIEngine(): ROIEngine {
  return new ROIEngine();
}

/**
 * Utility function for quick ROI calculation
 */
export async function calculateQuickROI(
  baseline: OrganizationalBaseline,
  variant: OrganizationalVariant,
  customAssumptions?: Partial<ROIAssumptions>
): Promise<FinancialMetrics> {
  const engine = createROIEngine();
  const analysis = await engine.calculateROI(baseline, variant, 'SIMPLE', customAssumptions);
  return analysis.financialMetrics;
}
