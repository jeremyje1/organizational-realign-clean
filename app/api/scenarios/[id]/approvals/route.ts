/**
 * Scenario Approvals API Route
 * Handles approval workflow for scenarios
 * 
 * @version 2.1.0
 * @author NorthPath Strategies
 */

import { NextRequest, NextResponse } from 'next/server';
import { createScenarioServiceDev } from '@/lib/services/scenario-service-dev';
import { ApprovalStatus } from '@/types/scenario';

const scenarioService = createScenarioServiceDev();

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/scenarios/[id]/approvals - Get approvals for a scenario
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const scenarioId = params.id;

    const approvals = await scenarioService.getScenarioApprovals(scenarioId);

    return NextResponse.json({
      success: true,
      data: approvals,
      count: approvals.length
    });

  } catch (error: any) {
    console.error('Error fetching scenario approvals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scenario approvals', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/scenarios/[id]/approvals - Submit approval decision
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const scenarioId = params.id;
    const body = await request.json();
    const { status, comments } = body;

    if (!status || !['PENDING', 'APPROVED', 'REJECTED', 'WITHDRAWN'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid approval status is required (PENDING, APPROVED, REJECTED, WITHDRAWN)' },
        { status: 400 }
      );
    }

    const approval = await scenarioService.submitApproval(
      scenarioId,
      'user_placeholder', // TODO: Get from auth
      status,
      comments
    );

    return NextResponse.json({
      success: true,
      data: approval
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error submitting approval:', error);
    return NextResponse.json(
      { error: 'Failed to submit approval', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Mark this route as dynamic so Next.js doesn't cache responses.
 */
export const dynamic = 'force-dynamic';
