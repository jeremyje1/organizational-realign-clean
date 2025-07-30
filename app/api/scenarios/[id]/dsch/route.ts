/**
 * DSCH Analysis API Route
 * Endpoint for performing Dynamic Structural Complexity Heuristic analysis on scenarios
 * 
 * @version 1.0.0
 * @author NorthPath Strategies
 */

import { NextRequest, NextResponse } from 'next/server';
import { createScenarioServiceDev } from '@/lib/services/scenario-service-dev';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const scenarioId = params.id;
    const scenarioService = createScenarioServiceDev();
    
    // Perform DSCH analysis
    const dschAnalysis = await scenarioService.performDSCHAnalysis(scenarioId);
    
    if (!dschAnalysis) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Scenario not found or analysis failed' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        scenarioId,
        dschAnalysis,
        metadata: {
          generatedAt: new Date().toISOString(),
          version: '2.1.0',
          analysisType: 'DSCH'
        }
      }
    });

  } catch (error) {
    console.error('DSCH analysis error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error during DSCH analysis' 
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const scenarioId = params.id;
    const body = await request.json();
    const { customAssessmentData, organizationMetrics } = body;
    
    const scenarioService = createScenarioServiceDev();
    
    // Get scenario
    const scenario = await scenarioService.getScenario(scenarioId);
    if (!scenario) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Scenario not found' 
        },
        { status: 404 }
      );
    }

    // Perform enhanced DSCH analysis with custom data
    const dschAnalysis = await scenarioService.performDSCHAnalysis(scenarioId);
    
    // Also perform structural analysis
    const structuralAnalysis = await scenarioService.analyzeScenarioStructure(scenarioId);
    
    // Get comparison summary
    const comparisonSummary = await scenarioService.getScenarioComparisonSummary(scenarioId);

    return NextResponse.json({
      success: true,
      data: {
        scenarioId,
        scenario: {
          name: scenario.name,
          description: scenario.description,
          status: scenario.status,
          savings: scenario.savings,
          costImpact: scenario.costImpact,
          confidence: scenario.confidence
        },
        dschAnalysis,
        structuralAnalysis,
        comparisonSummary,
        recommendations: generateRecommendations(dschAnalysis, structuralAnalysis, comparisonSummary),
        metadata: {
          generatedAt: new Date().toISOString(),
          version: '2.1.0',
          analysisType: 'COMPREHENSIVE_DSCH'
        }
      }
    });

  } catch (error) {
    console.error('Enhanced DSCH analysis error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error during enhanced DSCH analysis' 
      },
      { status: 500 }
    );
  }
}

/**
 * Generate recommendations based on DSCH and structural analysis
 */
function generateRecommendations(
  dschAnalysis: any,
  structuralAnalysis: any,
  comparisonSummary: any
): string[] {
  const recommendations: string[] = [];

  if (dschAnalysis?.improvement?.overallImprovement > 20) {
    recommendations.push('Excellent organizational improvement potential identified. Proceed with implementation.');
  } else if (dschAnalysis?.improvement?.overallImprovement > 10) {
    recommendations.push('Moderate improvement expected. Consider phased implementation approach.');
  } else if (dschAnalysis?.improvement?.overallImprovement < 0) {
    recommendations.push('Warning: Potential negative impact on organizational health. Review scenario design.');
  }

  if (comparisonSummary?.riskLevel === 'high') {
    recommendations.push('High risk scenario detected. Implement additional risk mitigation strategies.');
  }

  if (comparisonSummary?.costImpact > 1000000) {
    recommendations.push('High cost impact scenario. Ensure adequate budget allocation and stakeholder approval.');
  }

  if (structuralAnalysis?.comparison?.summary?.positionsRemoved > 10) {
    recommendations.push('Significant workforce reduction planned. Implement comprehensive change management program.');
  }

  if (dschAnalysis?.improvement?.operationalEfficiency > 0.2) {
    recommendations.push('Strong operational efficiency gains expected. Monitor performance metrics closely.');
  }

  if (recommendations.length === 0) {
    recommendations.push('Scenario appears balanced. Consider pilot implementation to validate assumptions.');
  }

  return recommendations;
}
