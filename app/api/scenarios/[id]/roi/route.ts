/**
 * Scenario ROI Calculation API Route
 * Handles ROI calculations and financial analysis for scenarios
 * 
 * @version 2.1.0
 * @author NorthPath Strategies
 */

import { NextRequest, NextResponse } from 'next/server';
import { createScenarioServiceDev } from '@/lib/services/scenario-service-dev';
import { ROIEngine } from '@/lib/roi-engine';
import { ROICalculationType } from '@/types/scenario';

const scenarioService = createScenarioServiceDev();
const roiEngine = new ROIEngine();

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/scenarios/[id]/roi - Get ROI calculations for scenario
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const scenarioId = params.id;
    const { searchParams } = new URL(request.url);
    const calculationType = searchParams.get('type') as ROICalculationType;

    const scenario = await scenarioService.getScenario(scenarioId);
    
    if (!scenario) {
      return NextResponse.json(
        { error: 'Scenario not found' },
        { status: 404 }
      );
    }

    // TODO: Get ROI calculations from database when available
    // For now, return empty calculations
    const roiCalculations: any[] = [];

    return NextResponse.json({
      success: true,
      data: {
        scenarioId,
        calculations: roiCalculations,
        summary: roiCalculations.length > 0 ? {
          latestROI: roiCalculations[roiCalculations.length - 1]?.roiPercentage,
          latestPayback: roiCalculations[roiCalculations.length - 1]?.paybackPeriod,
          calculationCount: roiCalculations.length
        } : null
      }
    });

  } catch (error: any) {
    console.error('Error fetching ROI calculations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ROI calculations', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/scenarios/[id]/roi - Calculate ROI for scenario
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const scenarioId = params.id;
    const body = await request.json();
    const {
      calculationType = 'SIMPLE' as ROICalculationType,
      assumptions = {},
      discountRate = 0.08,
      timeHorizon = 36, // months
      iterations = 1000 // for Monte Carlo
    } = body;

    const scenario = await scenarioService.getScenario(scenarioId);
    
    if (!scenario) {
      return NextResponse.json(
        { error: 'Scenario not found' },
        { status: 404 }
      );
    }

    // Perform ROI calculation based on type
    let roiResult;
    
    switch (calculationType) {
      case 'SIMPLE':
        roiResult = await roiEngine.calculateROI(scenario.baseline, scenario.variant, 'SIMPLE');
        break;
        
      case 'DETAILED':
        roiResult = await roiEngine.calculateROI(
          scenario.baseline,
          scenario.variant,
          'DETAILED',
          { discountRate, timeHorizon: timeHorizon / 12, assumptions }
        );
        break;
        
      case 'MONTE_CARLO':
        roiResult = await roiEngine.calculateROI(
          scenario.baseline,
          scenario.variant,
          'MONTE_CARLO',
          { discountRate, timeHorizon: timeHorizon / 12, iterations, assumptions }
        );
        break;
        
      case 'SENSITIVITY':
        roiResult = await roiEngine.calculateROI(
          scenario.baseline,
          scenario.variant,
          'SENSITIVITY',
          { discountRate, timeHorizon: timeHorizon / 12, assumptions }
        );
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid calculation type' },
          { status: 400 }
        );
    }

    // Save the calculation to database using the service method
    const calculationRequest = {
      scenarioId,
      calculationType,
      assumptions: { ...assumptions, discountRate, timeHorizon: timeHorizon / 12 }
    };

    const savedCalculation = await scenarioService.calculateDetailedROI(
      calculationRequest,
      'user_placeholder' // TODO: Replace with actual user ID from auth
    );

    return NextResponse.json({
      success: true,
      data: {
        calculation: savedCalculation,
        analysis: roiResult
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error calculating ROI:', error);
    return NextResponse.json(
      { error: 'Failed to calculate ROI', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Mark this route as dynamic so Next.js doesn't cache responses.
 */
export const dynamic = 'force-dynamic';
