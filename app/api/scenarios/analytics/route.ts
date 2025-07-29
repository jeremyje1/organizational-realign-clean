/**
 * Scenario Analytics API Route
 * Provides analytics and summary data for scenarios
 * 
 * @version 2.1.0
 * @author NorthPath Strategies
 */

import { NextRequest, NextResponse } from 'next/server';
import { createScenarioServiceDev } from '@/lib/services/scenario-service-dev';

const scenarioService = createScenarioServiceDev();

/**
 * GET /api/scenarios/analytics - Get scenario analytics for organization
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    const timeframe = searchParams.get('timeframe') || '30'; // days

    if (!organizationId) {
      return NextResponse.json(
        { error: 'organizationId is required' },
        { status: 400 }
      );
    }

    // Get scenario summary statistics
    const scenarios = await scenarioService.getOrganizationScenarios(organizationId);
    
    const analytics = {
      totalScenarios: scenarios.length,
      statusBreakdown: {
        draft: scenarios.filter(s => s.status === 'DRAFT').length,
        underReview: scenarios.filter(s => s.status === 'UNDER_REVIEW').length,
        approved: scenarios.filter(s => s.status === 'APPROVED').length,
        implemented: scenarios.filter(s => s.status === 'IMPLEMENTED').length,
        archived: scenarios.filter(s => s.status === 'ARCHIVED').length
      },
      financialSummary: {
        totalPotentialSavings: scenarios.reduce((sum, s) => {
          const savings = s.savings ? parseFloat(s.savings.toString()) : 0;
          return sum + savings;
        }, 0),
        averageROI: 0, // TODO: Calculate from ROI calculations when available
        scenariosWithROI: 0 // TODO: Count scenarios with ROI calculations
      },
      recentActivity: scenarios
        .filter(s => {
          const daysSinceUpdate = (Date.now() - new Date(s.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
          return daysSinceUpdate <= parseInt(timeframe);
        })
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 10)
        .map(s => ({
          id: s.id,
          name: s.name,
          status: s.status,
          updatedAt: s.updatedAt,
          savings: s.savings
        }))
    };

    return NextResponse.json({
      success: true,
      data: analytics,
      timeframe: `${timeframe} days`
    });

  } catch (error: any) {
    console.error('Error fetching scenario analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scenario analytics', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Mark this route as dynamic so Next.js doesn't cache responses.
 */
export const dynamic = 'force-dynamic';
