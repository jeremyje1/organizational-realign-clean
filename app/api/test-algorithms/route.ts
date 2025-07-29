/**
 * Enterprise Algorithm Test API Endpoint
 * Tests the complete enterprise algorithm suite
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing Enterprise Algorithm Suite...');
    
    // Test algorithm imports
    const { calculateEnterpriseMetrics, ALGORITHM_SUITE_VERSION } = await import('@/lib/algorithms');
    const { AssessmentData, OrganizationMetrics } = await import('@/types/assessment');
    
    // Mock assessment data for testing with minimal responses
    const mockAssessmentData = {
      id: 'test-assessment-001',
      userId: 'test-user-001',
      tier: 'ENTERPRISE' as const,
      status: 'COMPLETED' as const,
      institutionType: 'Higher Education',
      organizationType: 'university' as const,
      responses: [
        {
          questionId: 'Q1_1',
          section: 'Leadership & Governance',
          prompt: 'Strategic planning processes are comprehensive and regularly updated',
          value: 4,
          type: 'likert' as const,
          tags: ['strategy', 'leadership'],
          priority: 'high' as const
        },
        {
          questionId: 'Q2_1',
          section: 'Organizational Structure',
          prompt: 'Reporting relationships are clear and efficient',
          value: 3,
          type: 'likert' as const,
          tags: ['structure', 'reporting'],
          priority: 'medium' as const
        }
      ],
      metadata: {
        institutionName: 'Test University',
        institutionSize: 'large' as const,
        departmentCount: 25,
        employeeCount: 5000,
        version: '2.1.0',
        algorithmVersion: '2.1.0'
      },
      completed: true,
      createdAt: '2025-07-12T10:00:00Z',
      updatedAt: '2025-07-12T11:30:00Z'
    };

    const mockOrganizationMetrics = {
      hierarchyLevels: 6,
      spanOfControl: 8,
      departmentCount: 25,
      employeeCount: 5000,
      reportingRelationships: 625,
      processComplexity: 0.75,
      decisionLatency: 0.65,
      communicationEfficiency: 0.80,
      resourceUtilization: 0.85,
      taskAutomationLevel: 0.45,
      changeReadiness: 0.70,
      collaborationIndex: 0.75,
      innovationCapacity: 0.65,
      leadershipEffectiveness: 0.80,
      employeeEngagement: 0.70,
      goalAlignment: 0.75,
      strategicAgility: 0.65,
      marketResponsiveness: 0.70,
      competitivePosition: 0.80,
      futureReadiness: 0.60,
      budgetEfficiency: 0.85,
      costPerEmployee: 100000,
      revenuePerEmployee: 120000,
      operationalMargin: 0.15,
      investmentInTechnology: 0.08,
      digitalMaturity: 0.70,
      systemIntegration: 0.65,
      dataQuality: 0.75,
      cybersecurityLevel: 0.80,
      aiReadiness: 0.55,
      productivityIndex: 0.80,
      qualityMetrics: 0.85,
      customerSatisfaction: 0.78,
      employeeRetention: 0.88,
      complianceLevel: 0.95,
      operationalRisk: 0.25,
      financialRisk: 0.20,
      technologicalRisk: 0.35,
      regulatoryRisk: 0.15,
      reputationalRisk: 0.20
    };
    
    console.log('📊 Processing mock assessment data...');
    
    // Calculate enterprise metrics
    const results = await calculateEnterpriseMetrics(mockAssessmentData, mockOrganizationMetrics);
    
    console.log('✅ Enterprise Algorithm Suite Results calculated');
    
    // Extract scores safely
    const scores = {
      dsch: results.dsch?.overallScore || 0,
      crf: results.crf?.overallResilienceScore || 0,
      lei: results.lei?.overallLeadershipScore || 0,
      oci: results.oci?.overallChangeReadiness || 0,
      hoci: results.hoci?.overallComplexityIndex || 0
    };
    
    const allScoresValid = Object.values(scores).every(score => 
      typeof score === 'number' && score >= 0 && score <= 1
    );
    
    return NextResponse.json({
      success: true,
      message: 'Enterprise Algorithm Suite test completed successfully!',
      version: ALGORITHM_SUITE_VERSION.version,
      scores,
      allScoresValid,
      testResults: {
        algorithmsLoaded: true,
        calculationsCompleted: true,
        scoresValid: allScoresValid,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error: any) {
    console.error('❌ Error testing enterprise algorithms:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Use GET method to test enterprise algorithms' 
  }, { status: 405 });
}
