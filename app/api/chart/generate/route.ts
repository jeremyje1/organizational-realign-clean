/**
 * Org Chart Generation API
 * 
 * POST /api/chart/generate
 * Generates org chart from assessment data with scenario costing
 */

import { NextRequest, NextResponse } from 'next/server';
import { buildChart, generateSVG, optimizeLayout, exportToFormat } from '@/lib/chart-builder';
import { getAssessment, createOrgChart } from '@/lib/org-chart-db';

interface GenerateChartRequest {
  assessmentId: string;
  includeScenarios?: boolean;
  exportFormat?: 'svg' | 'json' | 'csv';
  customRates?: Record<string, number>;
  saveToDatabase?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateChartRequest = await request.json();
    const { assessmentId, includeScenarios = true, exportFormat = 'svg', customRates, saveToDatabase = false } = body;

    if (!assessmentId) {
      return NextResponse.json(
        { error: 'Assessment ID is required' },
        { status: 400 }
      );
    }

    // 1. Fetch assessment data
    const assessment = await getAssessment(assessmentId);
    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      );
    }

    // 2. Extract role data from assessment
    const roles = extractRolesFromAssessment(assessment);
    
    if (roles.length === 0) {
      return NextResponse.json(
        { error: 'No roles found in assessment data' },
        { status: 400 }
      );
    }

    // 3. Build org chart
    console.log(`Building org chart for assessment ${assessmentId} with ${roles.length} roles`);
    const chartResult = await buildChart(roles, customRates);

    // 4. Optimize layout
    const optimizedTree = optimizeLayout(chartResult.tree);

    // 5. Generate output based on format
    let output: any;
    let contentType = 'application/json';

    switch (exportFormat) {
      case 'svg':
        output = await generateSVG(optimizedTree);
        contentType = 'image/svg+xml';
        break;
        
      case 'json':
        output = exportToFormat(optimizedTree, chartResult.scenarios, 'json');
        contentType = 'application/json';
        break;
        
      case 'csv':
        output = exportToFormat(optimizedTree, chartResult.scenarios, 'csv');
        contentType = 'text/csv';
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid export format' },
          { status: 400 }
        );
    }

    // 6. Save to database if requested
    if (saveToDatabase && exportFormat === 'svg') {
      try {
        await createOrgChart({
          assessmentId,
          chartData: JSON.stringify(optimizedTree),
          svgContent: output,
          scenarios: includeScenarios ? JSON.stringify(chartResult.scenarios) : null,
          metadata: {
            roleCount: roles.length,
            totalCost: chartResult.scenarios.current.totalCost,
            generatedAt: new Date().toISOString(),
            customRates: customRates || {},
            issues: chartResult.issues
          }
        });
        console.log(`Saved org chart to database for assessment ${assessmentId}`);
      } catch (saveError) {
        console.error('Failed to save chart to database:', saveError);
        // Continue anyway - don't fail the request
      }
    }

    // 7. Return response
    const responseData = {
      success: true,
      assessmentId,
      data: exportFormat === 'svg' ? null : JSON.parse(output),
      svg: exportFormat === 'svg' ? output : null,
      scenarios: includeScenarios ? chartResult.scenarios : null,
      issues: chartResult.issues,
      metadata: {
        roleCount: roles.length,
        format: exportFormat,
        generatedAt: new Date().toISOString()
      }
    };

    // Set appropriate headers
    const headers: Record<string, string> = {
      'Content-Type': contentType,
    };

    if (exportFormat === 'csv') {
      headers['Content-Disposition'] = `attachment; filename="org-chart-${assessmentId}.csv"`;
    } else if (exportFormat === 'svg') {
      headers['Content-Disposition'] = `attachment; filename="org-chart-${assessmentId}.svg"`;
    }

    return new NextResponse(
      exportFormat === 'svg' || exportFormat === 'csv' ? output : JSON.stringify(responseData),
      { 
        status: 200, 
        headers 
      }
    );

  } catch (error) {
    console.error('Chart generation failed:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to generate org chart',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Extracts role data from assessment responses
 */
function extractRolesFromAssessment(assessment: any): Array<{
  id: string;
  roleTitle: string;
  fte: number;
  parentId?: string | null;
  level?: number;
  annualCost?: number;
}> {
  const roles: any[] = [];
  
  try {
    // Parse responses to extract role information
    const responses = assessment.responses || {};
    
    // Look for role-related data in various question types
    Object.keys(responses).forEach(questionId => {
      const response = responses[questionId];
      
      // Handle different response formats
      if (response && typeof response === 'object') {
        // Check for role arrays
        if (Array.isArray(response.roles)) {
          response.roles.forEach((role: any, index: number) => {
            if (role.roleTitle && role.fte) {
              roles.push({
                id: role.id || `${questionId}-role-${index}`,
                roleTitle: role.roleTitle,
                fte: parseFloat(role.fte) || 1,
                parentId: role.parentId || null,
                level: role.level || 0,
                annualCost: role.annualCost ? parseFloat(role.annualCost) : undefined
              });
            }
          });
        }
        
        // Check for individual role data
        if (response.roleTitle && response.fte) {
          roles.push({
            id: response.id || `${questionId}-role`,
            roleTitle: response.roleTitle,
            fte: parseFloat(response.fte) || 1,
            parentId: response.parentId || null,
            level: response.level || 0,
            annualCost: response.annualCost ? parseFloat(response.annualCost) : undefined
          });
        }
      }
    });
    
    // If no structured role data found, create default structure
    if (roles.length === 0) {
      console.warn('No role data found in assessment, creating default structure');
      roles.push({
        id: 'default-ceo',
        roleTitle: 'Chief Executive Officer',
        fte: 1,
        level: 0
      });
    }
    
    return roles;
    
  } catch (error) {
    console.error('Error extracting roles from assessment:', error);
    throw new Error('Failed to parse assessment data for role extraction');
  }
}
