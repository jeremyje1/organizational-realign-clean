/**
 * Scenarios API Route - Enhanced with ROI Engine
 * Handles CRUD operations for organizational scenarios with financial modeling
 * 
 * @version 2.1.0
 * @author NorthPath Strategies
 */

import { NextRequest, NextResponse } from 'next/server';
import { createScenarioServiceDev } from '@/lib/services/scenario-service-dev';
import { CreateScenarioRequest } from '@/types/scenario';

const scenarioService = createScenarioServiceDev();

/**
 * Simple in‑memory store for backward compatibility
 * TODO: Remove once full migration to new scenario system is complete
 */
interface LegacyScenario {
  id: number;
  title: string;
  description: string;
}

let legacyScenarios: LegacyScenario[] = [
  {
    id: 1,
    title: 'Department Restructure',
    description: 'Realign departments into new functional units.'
  },
  {
    id: 2,
    title: 'Budget Reallocation',
    description: 'Shift recurring funds to the top three strategic priorities.'
  }
];

/**
 * GET /api/scenarios - Get scenarios for organization
 * Query params: 
 * - organizationId: string (required for new scenarios)
 * - status: string (optional filter)
 * - limit: number (default 50)
 * - legacy: boolean (to get legacy scenarios)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const legacy = searchParams.get('legacy') === 'true';

    // Return legacy scenarios for backward compatibility
    if (legacy || !organizationId) {
      return NextResponse.json({
        success: true,
        data: legacyScenarios,
        count: legacyScenarios.length,
        type: 'legacy'
      });
    }

    // Get new scenario system data
    const scenarios = await scenarioService.getOrganizationScenarios(
      organizationId,
      status || undefined,
      limit
    );

    return NextResponse.json({
      success: true,
      data: scenarios,
      count: scenarios.length,
      type: 'enhanced'
    });

  } catch (error: any) {
    console.error('Error fetching scenarios:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scenarios', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/scenarios - Create new scenario
 * Supports both legacy format and new enhanced format
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, organizationId, baseline, variant } = body;

    // Handle legacy format for backward compatibility
    if (!organizationId && title && description) {
      const newLegacyScenario: LegacyScenario = {
        id: legacyScenarios.length ? legacyScenarios[legacyScenarios.length - 1].id + 1 : 1,
        title,
        description
      };
      
      legacyScenarios.push(newLegacyScenario);
      
      return NextResponse.json(newLegacyScenario, { status: 201 });
    }

    // Handle new enhanced scenario format
    if (!organizationId || !title || !description) {
      return NextResponse.json(
        { error: 'organizationId, title, and description are required for enhanced scenarios.' },
        { status: 400 }
      );
    }

    // Create enhanced scenario request
    const createRequest: CreateScenarioRequest = {
      organizationId,
      name: title,
      description,
      baseline,
      variant
    };

    const newScenario = await scenarioService.createScenario(createRequest, 'user_placeholder');

    return NextResponse.json({
      success: true,
      data: newScenario,
      type: 'enhanced'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating scenario:', error);
    return NextResponse.json(
      { error: 'Failed to create scenario', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Mark this route as dynamic so Next.js doesn’t cache responses.
 */
export const dynamic = 'force-dynamic';
