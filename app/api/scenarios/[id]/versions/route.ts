/**
 * Scenario Versions API Route
 * Handles version management for scenarios
 * 
 * @version 2.1.0
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
 * GET /api/scenarios/[id]/versions - Get all versions for a scenario
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const scenarioId = params.id;

    const versions = await scenarioService.getScenarioVersions(scenarioId);

    return NextResponse.json({
      success: true,
      data: versions,
      count: versions.length
    });

  } catch (error: any) {
    console.error('Error fetching scenario versions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scenario versions', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/scenarios/[id]/versions - Create a new version
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const scenarioId = params.id;
    const body = await request.json();
    const { changes } = body;

    const version = await scenarioService.createScenarioVersion(
      scenarioId,
      changes || { description: 'Manual version creation' },
      'user_placeholder'
    );

    return NextResponse.json({
      success: true,
      data: version
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating scenario version:', error);
    return NextResponse.json(
      { error: 'Failed to create scenario version', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Mark this route as dynamic so Next.js doesn't cache responses.
 */
export const dynamic = 'force-dynamic';
