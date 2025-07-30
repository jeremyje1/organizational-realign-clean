/**
 * Scenario Comparison API Route
 * Handles scenario comparison and structural analysis using the scenario engine
 * 
 * @version 2.2.0
 * @author NorthPath Strategies
 */

import { NextRequest, NextResponse } from 'next/server';
import { createScenarioServiceDev } from '@/lib/services/scenario-service-dev';

const scenarioService = createScenarioServiceDev();

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/scenarios/[id]/compare?with=[otherId] - Compare two scenarios
 * GET /api/scenarios/[id]/compare - Analyze single scenario structure
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const scenarioId = params.id;
    const { searchParams } = new URL(request.url);
    const compareWithId = searchParams.get('with');

    let analysis;

    if (compareWithId) {
      // Compare two scenarios
      analysis = await scenarioService.compareScenarios(scenarioId, compareWithId);
      
      if (!analysis) {
        return NextResponse.json(
          { error: 'One or both scenarios not found' },
          { status: 404 }
        );
      }
    } else {
      // Analyze single scenario structure
      analysis = await scenarioService.analyzeScenarioStructure(scenarioId);
      
      if (!analysis) {
        return NextResponse.json(
          { error: 'Scenario not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        analysis,
        summary: {
          totalCostChange: analysis.comparison.deltaCost,
          percentageCostChange: analysis.comparison.summary.costSummary.percentageChange,
          fteChange: analysis.comparison.summary.fteImpact.fteChange,
          structuralChanges: {
            added: analysis.comparison.summary.positionsAdded,
            removed: analysis.comparison.summary.positionsRemoved,
            modified: analysis.comparison.summary.positionsModified
          },
          riskFactors: analysis.comparison.riskFactors,
          recommendations: analysis.comparison.recommendations
        }
      }
    });

  } catch (error: any) {
    console.error('Error in scenario comparison:', error);
    return NextResponse.json(
      { error: 'Failed to compare scenarios', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/scenarios/[id]/compare - Perform bulk scenario comparison
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const scenarioId = params.id;
    const body = await request.json();
    const { compareWith = [] } = body;

    if (!Array.isArray(compareWith) || compareWith.length === 0) {
      return NextResponse.json(
        { error: 'compareWith array is required' },
        { status: 400 }
      );
    }

    const comparisons = [];

    for (const otherScenarioId of compareWith) {
      const analysis = await scenarioService.compareScenarios(scenarioId, otherScenarioId);
      
      if (analysis) {
        const summary = await scenarioService.getScenarioComparisonSummary(scenarioId);
        
        comparisons.push({
          scenarioId: otherScenarioId,
          analysis,
          summary
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        baseScenarioId: scenarioId,
        comparisons,
        totalComparisons: comparisons.length
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error in bulk scenario comparison:', error);
    return NextResponse.json(
      { error: 'Failed to perform bulk comparison', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Mark this route as dynamic so Next.js doesn't cache responses.
 */
export const dynamic = 'force-dynamic';
