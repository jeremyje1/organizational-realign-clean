/**
 * Scenario API Route (Version 2.3)
 * Returns simplified JSON format for scenario comparison
 * 
 * @version 2.3.0
 * @author NorthPath Strategies
 */

import { NextRequest, NextResponse } from 'next/server';
import { compareScenarios } from '@/lib/services/scenarioEngine';
import { createScenarioServiceDev } from '@/lib/services/scenario-service-dev';

const scenarioService = createScenarioServiceDev();

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/scenario/[id] - Get scenario comparison analysis
 * Returns simplified JSON format: {changes, deltaCost, confidencePct}
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const scenarioId = params.id;
    const { searchParams } = new URL(request.url);
    const compareWith = searchParams.get('compareWith');

    // Get scenario data
    const scenario = await scenarioService.getScenario(scenarioId);
    
    if (!scenario) {
      return NextResponse.json(
        { error: 'Scenario not found' },
        { status: 404 }
      );
    }

    let result;

    if (compareWith) {
      // Compare with another scenario
      const compareScenario = await scenarioService.getScenario(compareWith);
      
      if (!compareScenario) {
        return NextResponse.json(
          { error: 'Comparison scenario not found' },
          { status: 404 }
        );
      }

      // Use simplified compareScenarios function
      // Ensure we have the right data structure
      const baselineData = { positions: compareScenario.baseline?.positions || [] };
      const variantData = { positions: scenario.variant?.positions || [] };
      
      const comparison = compareScenarios(baselineData, variantData);
      
      result = {
        changes: comparison.changes,
        deltaCost: comparison.deltaCost,
        confidencePct: calculateConfidence(comparison.changes, scenario)
      };
    } else {
      // Compare scenario with its baseline
      const baseline = scenario.baseline;
      const variant = scenario.variant;

      if (!baseline || !variant) {
        return NextResponse.json(
          { error: 'Scenario missing baseline or variant data' },
          { status: 400 }
        );
      }

      // Use simplified compareScenarios function
      // Ensure we have the right data structure
      const baselineData = { positions: baseline?.positions || [] };
      const variantData = { positions: variant?.positions || [] };

      const comparison = compareScenarios(baselineData, variantData);
      
      result = {
        changes: comparison.changes,
        deltaCost: comparison.deltaCost,
        confidencePct: calculateConfidence(comparison.changes, scenario)
      };
    }

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Error in scenario comparison:', error);
    return NextResponse.json(
      { error: 'Failed to process scenario comparison', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Calculate confidence percentage based on scenario data quality and changes
 */
function calculateConfidence(changes: any[], scenario: any): number {
  let confidence = 100;

  // Reduce confidence based on number of changes (more changes = more uncertainty)
  const changeCount = changes.length;
  if (changeCount > 0) {
    confidence -= Math.min(changeCount * 2, 30); // Max 30% reduction for changes
  }

  // Reduce confidence if scenario data is incomplete
  if (!scenario.baseline?.positions || !scenario.variant?.positions) {
    confidence -= 20;
  }

  // Reduce confidence if positions lack detailed cost data
  const positions = scenario.baseline?.positions || [];
  const positionsWithoutCost = positions.filter((p: any) => !p.totalCost || p.totalCost === 0);
  if (positionsWithoutCost.length > 0) {
    const incompletePct = (positionsWithoutCost.length / positions.length) * 100;
    confidence -= Math.min(incompletePct * 0.5, 25); // Max 25% reduction for incomplete data
  }

  // Ensure confidence is between 0 and 100
  return Math.max(0, Math.min(100, Math.round(confidence)));
}

/**
 * Mark this route as dynamic so Next.js doesn't cache responses
 */
export const dynamic = 'force-dynamic';
