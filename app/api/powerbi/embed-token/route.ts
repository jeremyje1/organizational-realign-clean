/**
 * Power BI Embed Token API Route
 * Provides embed tokens for Power BI reports
 * 
 * @route GET /api/powerbi/embed-token
 */

import { NextRequest, NextResponse } from 'next/server';
import { getEmbedConfig, validatePowerBIConfig } from '@/lib/powerbi';

export async function GET(request: NextRequest) {
  try {
    // Validate Power BI configuration
    if (!validatePowerBIConfig()) {
      return NextResponse.json(
        { error: 'Power BI configuration is incomplete' },
        { status: 500 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get('reportId');
    const workspaceId = searchParams.get('workspaceId');
    const datasetId = searchParams.get('datasetId');

    // Validate required parameters
    if (!reportId) {
      return NextResponse.json(
        { error: 'Report ID is required' },
        { status: 400 }
      );
    }

    // Generate embed configuration
    const embedConfig = await getEmbedConfig(
      reportId,
      workspaceId || undefined,
      datasetId || undefined
    );

    return NextResponse.json({
      success: true,
      embedConfig,
    });

  } catch (error) {
    console.error('Power BI embed token error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate Power BI embed token',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Optional: Handle POST requests for more complex embed configurations
export async function POST(request: NextRequest) {
  try {
    // Validate Power BI configuration
    if (!validatePowerBIConfig()) {
      return NextResponse.json(
        { error: 'Power BI configuration is incomplete' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { reportId, workspaceId, datasetId, settings } = body;

    // Validate required parameters
    if (!reportId) {
      return NextResponse.json(
        { error: 'Report ID is required' },
        { status: 400 }
      );
    }

    // Generate embed configuration
    const embedConfig = await getEmbedConfig(
      reportId,
      workspaceId,
      datasetId
    );

    // Apply custom settings if provided
    if (settings) {
      embedConfig.settings = { ...embedConfig.settings, ...settings };
    }

    return NextResponse.json({
      success: true,
      embedConfig,
    });

  } catch (error) {
    console.error('Power BI embed token error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate Power BI embed token',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
