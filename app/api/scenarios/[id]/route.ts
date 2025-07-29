/**
 * Individual Scenario API Route
 * Handles CRUD operations for a specific scenario
 * 
 * @version 2.1.0
 * @author NorthPath Strategies
 */

import { NextRequest, NextResponse } from 'next/server';
import { createScenarioServiceDev } from '@/lib/services/scenario-service-dev';
import { UpdateScenarioRequest } from '@/types/scenario';

const scenarioService = createScenarioServiceDev();

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/scenarios/[id] - Get specific scenario
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const scenarioId = params.id;
    const { searchParams } = new URL(request.url);
    const includeVersions = searchParams.get('includeVersions') === 'true';
    const includeROI = searchParams.get('includeROI') === 'true';

    const scenario = await scenarioService.getScenario(scenarioId);

    if (!scenario) {
      return NextResponse.json(
        { error: 'Scenario not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: scenario
    });

  } catch (error: any) {
    console.error('Error fetching scenario:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scenario', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/scenarios/[id] - Update scenario
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const scenarioId = params.id;
    const body = await request.json();

    const updateRequest: UpdateScenarioRequest = {
      ...body
    };

    const updatedScenario = await scenarioService.updateScenario(
      scenarioId,
      updateRequest,
      'user_placeholder' // TODO: Replace with actual user ID from auth
    );

    return NextResponse.json({
      success: true,
      data: updatedScenario
    });

  } catch (error: any) {
    console.error('Error updating scenario:', error);
    return NextResponse.json(
      { error: 'Failed to update scenario', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/scenarios/[id] - Delete scenario
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const scenarioId = params.id;

    await scenarioService.deleteScenario(scenarioId);

    return NextResponse.json({
      success: true,
      message: 'Scenario deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting scenario:', error);
    return NextResponse.json(
      { error: 'Failed to delete scenario', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Mark this route as dynamic so Next.js doesn't cache responses.
 */
export const dynamic = 'force-dynamic';
