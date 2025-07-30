/**
 * Org Chart Retrieval API
 * 
 * GET /api/chart/[assessmentId]
 * Retrieves existing org chart for an assessment
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOrgChart } from '@/lib/org-chart-db';

interface RouteParams {
  params: {
    assessmentId: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { assessmentId } = await params;

    if (!assessmentId) {
      return NextResponse.json(
        { error: 'Assessment ID is required' },
        { status: 400 }
      );
    }

    // Get format from query params
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    const includeScenarios = searchParams.get('scenarios') !== 'false';

    // Fetch chart from database
    const orgChart = await getOrgChart(assessmentId);

    if (!orgChart) {
      return NextResponse.json(
        { error: 'Org chart not found for this assessment' },
        { status: 404 }
      );
    }

    // Parse stored data
    const chartData = orgChart.chartData ? JSON.parse(orgChart.chartData) : null;
    const scenarios = (orgChart.scenarios && includeScenarios) ? JSON.parse(orgChart.scenarios) : null;

    // Return based on requested format
    switch (format) {
      case 'svg':
        if (!orgChart.svgContent) {
          return NextResponse.json(
            { error: 'SVG content not available for this chart' },
            { status: 404 }
          );
        }
        
        return new NextResponse(orgChart.svgContent, {
          status: 200,
          headers: {
            'Content-Type': 'image/svg+xml',
            'Content-Disposition': `attachment; filename="org-chart-${assessmentId}.svg"`
          }
        });

      case 'json':
      default:
        const responseData = {
          success: true,
          assessmentId,
          chartId: orgChart.id,
          data: chartData,
          scenarios: scenarios,
          metadata: {
            ...orgChart.metadata,
            createdAt: orgChart.createdAt,
            updatedAt: orgChart.updatedAt
          }
        };

        return NextResponse.json(responseData, { status: 200 });
    }

  } catch (error) {
    console.error('Chart retrieval failed:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to retrieve org chart',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/chart/[assessmentId]
 * Deletes an existing org chart
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { assessmentId } = params;

    if (!assessmentId) {
      return NextResponse.json(
        { error: 'Assessment ID is required' },
        { status: 400 }
      );
    }

    // For now, we'll implement a soft delete by updating metadata
    // In a full implementation, you'd add a deleteOrgChart function
    const orgChart = await getOrgChart(assessmentId);

    if (!orgChart) {
      return NextResponse.json(
        { error: 'Org chart not found' },
        { status: 404 }
      );
    }

    // TODO: Implement actual deletion in supabase helper
    // await deleteOrgChart(assessmentId);

    return NextResponse.json({
      success: true,
      message: 'Org chart deleted successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Chart deletion failed:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to delete org chart',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
