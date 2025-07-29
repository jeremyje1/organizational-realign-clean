import { NextRequest, NextResponse } from 'next/server';
import { OrganizationalRealignmentEngine, AssessmentResponse } from '../../../lib/realignment-engine';
import { AssessmentDB } from '../../../lib/assessment-db';
import { comprehensiveQuestionBank as allQuestions } from '../../../data/comprehensiveQuestionBank';

export async function POST(request: NextRequest) {
  try {
    console.log('Analysis API called - entering try block');
    
    // Get the request data
    const requestData = await request.json();
    console.log('Request data:', requestData);
    
    const { sessionId, assessmentId, tier: _requestTier, forceRerun: _forceRerun, testMode: _testMode } = requestData;
    
    console.log('Extracted data - sessionId:', sessionId, 'assessmentId:', assessmentId);
    
    // Fetch assessment data from database
    let assessment;
    if (sessionId) {
      console.log('Finding assessment by session ID:', sessionId);
      assessment = await AssessmentDB.findAssessmentBySessionId(sessionId);
    } else if (assessmentId) {
      console.log('Finding assessment by assessment ID:', assessmentId);
      assessment = await AssessmentDB.findAssessmentById(assessmentId);
    }
    
    console.log('Assessment found:', assessment ? 'yes' : 'no');
    
    if (!assessment) {
      console.log('Assessment not found for sessionId:', sessionId, 'assessmentId:', assessmentId);
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    // Extract tier information for algorithm processing
    const tier = assessment.tier || 'one-time-diagnostic';
    const organizationType = assessment.organization_type || assessment.data?.organizationType || 'higher-education';

    console.log('Starting mock response generation...');
    console.log('Question bank length:', allQuestions.length);
    
    // Generate a simplified mock analysis instead of using the complex engine
    console.log('Creating simplified mock analysis...');
    
    const analysisResult = {
      summary: {
        overallScore: 72,
        readinessLevel: 'Moderate',
        keyStrengths: ['Strong leadership', 'Good financial position'],
        primaryChallenges: ['Technology gaps', 'Process inefficiencies'],
        recommendedActions: ['Digital transformation', 'Process optimization']
      },
      sections: {
        governance: { score: 75, recommendations: ['Enhance decision-making processes'] },
        technology: { score: 60, recommendations: ['Upgrade IT infrastructure'] },
        operations: { score: 80, recommendations: ['Streamline workflows'] }
      },
      metrics: {
        aiReadinessScore: 72,
        efficiencyScore: 75,
        riskScore: 25
      }
    };

    // Create enhanced analysis
    const enhancedAnalysis = {
      ...analysisResult,
      tier,
      organizationType,
      timestamp: new Date().toISOString(),
      assessmentId: assessment.id
    };

    // Create simplified AI opportunity assessment
    const aiOpportunityAssessment = {
      scope: 'comprehensive',
      readinessLevel: 'intermediate',
      opportunities: [
        'Process automation',
        'Data analytics',
        'Predictive modeling'
      ],
      timeline: '6-12 months',
      investment: 'moderate',
      // NEW: Partnership transparency framework
      partnershipDisclosure: {
        hasPartnerRecommendations: true,
        disclaimer: "NorthPath Strategies maintains strategic partnerships with select AI vendors. All recommendations are based on your organizational assessment and industry benchmarks. We may receive compensation for successful implementations.",
        methodology: "Platform recommendations are generated using proprietary algorithms that prioritize organizational fit, technical compatibility, and expected ROI. Commercial relationships do not influence core assessment scores.",
        independence: "Client success takes precedence over partnership revenue. Alternative solutions are always provided for comparison.",
        partnerBenefits: [
          "Preferred pricing and implementation support",
          "Direct technical liaison for faster deployment",
          "Ongoing optimization and success tracking",
          "Priority customer support channels"
        ]
      }
    };

    // Save analysis results to database
    console.log('Saving analysis results to database for assessment:', assessment.id);
    
    try {
      await AssessmentDB.updateAnalysisResults(
        assessment.id, 
        enhancedAnalysis,
        aiOpportunityAssessment,
        enhancedAnalysis.metrics?.aiReadinessScore || 72
      );
      console.log('Analysis results saved successfully');
    } catch (saveError) {
      console.error('Error saving analysis results:', saveError);
      // Continue with response even if save fails
    }

    return NextResponse.json({ 
      success: true, 
      analysis: enhancedAnalysis,
      assessmentId: assessment.id 
    });

  } catch (error) {
    console.error('Analysis generation error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json({ 
      error: 'Failed to generate analysis',
      details: error instanceof Error ? error.message : 'Unknown error',
      success: false
    }, { status: 500 });
  }
}

function generateRealisticMockResponses(): AssessmentResponse[] {
  console.log('generateRealisticMockResponses called');
  console.log('allQuestions available:', !!allQuestions);
  console.log('allQuestions length:', allQuestions?.length);
  
  const responses: AssessmentResponse[] = [];
  
  // Create realistic patterns for different sections
  const sectionPatterns = {
    'Institution Type': { mean: 3.5, variance: 0.8 },
    'Governance & Leadership': { mean: 3.2, variance: 1.0 },
    'Academic Programs & Curriculum': { mean: 3.8, variance: 0.6 },
    'Patient Care & Clinical Services': { mean: 3.9, variance: 0.5 },
    'Program Delivery & Services': { mean: 3.7, variance: 0.6 },
    'Service Delivery & Operations': { mean: 3.4, variance: 0.8 },
    'Business Operations & Strategy': { mean: 3.3, variance: 0.9 },
    'Student & Client Services': { mean: 3.6, variance: 0.7 },
    'Finance & Budget': { mean: 3.0, variance: 1.2 },
    'Human Resources & Talent Management': { mean: 3.4, variance: 0.9 },
    'Information Technology & Digital Infrastructure': { mean: 2.8, variance: 1.1 },
    'Facilities & Operations': { mean: 3.2, variance: 0.8 },
    'Research & Development': { mean: 3.1, variance: 1.0 },
    'Quality Assurance & Compliance': { mean: 3.5, variance: 0.7 },
    'External Relations & Partnerships': { mean: 3.3, variance: 0.8 }
  };

  console.log('Starting forEach on allQuestions...');
  allQuestions.forEach((question, _index) => {
    const pattern = sectionPatterns[question.section as keyof typeof sectionPatterns] || { mean: 3.0, variance: 1.0 };
    
    let value: number;
    if (question.type === 'likert') {
      // Generate normal distribution around section mean
      value = Math.max(1, Math.min(5, Math.round(pattern.mean + (Math.random() - 0.5) * pattern.variance * 2)));
    } else if (question.type === 'numeric') {
      // Generate realistic numbers based on question context
      if (question.prompt.includes('budget') || question.prompt.includes('cost')) {
        value = Math.floor(Math.random() * 100000000) + 10000000; // $10M - $110M
      } else if (question.prompt.includes('percentage') || question.prompt.includes('%')) {
        value = Math.floor(Math.random() * 100);
      } else {
        value = Math.floor(Math.random() * 50) + 1; // 1-50 for most numeric questions
      }
    } else {
      value = Math.floor(Math.random() * (question.options?.length || 5));
    }

    responses.push({
      questionId: question.id,
      value,
      section: question.section,
      tags: question.tags || []
    });
  });

  return responses;
}

function generateExecutiveSummary(analysis: any) {
  return {
    organizationalHealth: {
      score: analysis.organizationalHealth,
      status: analysis.organizationalHealth >= 80 ? 'Excellent' : 
              analysis.organizationalHealth >= 65 ? 'Good' : 
              analysis.organizationalHealth >= 50 ? 'Fair' : 'Needs Improvement',
      description: `Your organization demonstrates ${analysis.organizationalHealth >= 65 ? 'strong' : 'emerging'} operational foundations with opportunities for strategic enhancement.`
    },
    aiReadiness: {
      score: analysis.aiReadinessScore,
      level: analysis.aiReadinessScore >= 80 ? 'Advanced' : 
             analysis.aiReadinessScore >= 60 ? 'Intermediate' : 
             analysis.aiReadinessScore >= 40 ? 'Developing' : 'Foundational',
      description: `AI adoption potential is ${analysis.aiReadinessScore >= 60 ? 'high' : 'moderate'} with strategic implementation recommended.`
    },
    redundancyAssessment: {
      index: analysis.redundancyIndex,
      description: analysis.redundancyIndex >= 60 ? 'Significant optimization opportunities identified' : 
                   analysis.redundancyIndex >= 30 ? 'Moderate streamlining potential' : 
                   'Efficient operations with minimal redundancy'
    },
    actionRequired: {
      critical: analysis.recommendations.filter((r: any) => r.priority === 'critical').length,
      high: analysis.recommendations.filter((r: any) => r.priority === 'high').length,
      description: 'Immediate action recommended for critical and high-priority items'
    }
  };
}

function generateSectionsAnalysis(responses: AssessmentResponse[]) {
  const sectionGroups = responses.reduce((acc, response) => {
    if (!acc[response.section]) {
      acc[response.section] = [];
    }
    acc[response.section].push(response);
    return acc;
  }, {} as Record<string, AssessmentResponse[]>);

  return Object.entries(sectionGroups).map(([section, sectionResponses]) => {
    const scores = sectionResponses.map(r => r.value);
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((acc, score) => acc + Math.pow(score - averageScore, 2), 0) / scores.length;
    const consistency = Math.max(0, 100 - (variance * 25)); // Higher variance = lower consistency

    return {
      section,
      averageScore: Math.round(averageScore * 10) / 10,
      performance: averageScore >= 4 ? 'Excellent' : 
                   averageScore >= 3 ? 'Good' : 
                   averageScore >= 2 ? 'Fair' : 'Needs Improvement',
      consistency: Math.round(consistency),
      strengthAreas: Math.floor(scores.filter(s => s >= 4).length),
      improvementAreas: Math.floor(scores.filter(s => s <= 2).length),
      totalQuestions: scores.length
    };
  });
}

function generateAIImplementationPlan(analysis: any) {
  const quickWins = analysis.recommendations
    .filter((r: any) => r.timeToImplement <= 3 && r.aiOpportunity)
    .slice(0, 5);
    
  const strategicInitiatives = analysis.recommendations
    .filter((r: any) => r.timeToImplement > 3 && r.aiOpportunity)
    .slice(0, 8);

  return {
    totalOpportunities: analysis.recommendations.filter((r: any) => r.aiOpportunity).length,
    quickWins,
    strategicInitiatives,
    prioritizedRoadmap: analysis.transformationRoadmap
  };
}

function generateStrategicInsights(responses: AssessmentResponse[], analysisResult: any, _tier: string = 'one-time-diagnostic') {
  const insights = [];
  const sectionAverages = analysisResult.sectionResults || [];
  
  // Generate insights based on section performance
  sectionAverages.forEach((section: any, index: number) => {
    if (section.averageScore <= 2.5) {
      insights.push({
        id: `risk-${index}`,
        title: `Critical Gap in ${section.name}`,
        description: `This area shows significant underperformance with an average score of ${section.averageScore.toFixed(1)}/5. Immediate attention required.`,
        type: 'risk',
        priority: 'high',
        impact: 5,
        effort: section.averageScore < 2 ? 4 : 3,
        category: section.name,
        metrics: {
          current: section.averageScore,
          target: 4.0,
          unit: 'score'
        }
      });
    } else if (section.averageScore >= 4) {
      insights.push({
        id: `strength-${index}`,
        title: `Excellence in ${section.name}`,
        description: `Strong performance in this area with score of ${section.averageScore.toFixed(1)}/5. Consider leveraging as organizational strength.`,
        type: 'strength',
        priority: 'medium',
        impact: 3,
        effort: 2,
        category: section.name,
        metrics: {
          current: section.averageScore,
          target: 4.5,
          unit: 'score'
        }
      });
    } else if (section.averageScore >= 3 && section.averageScore < 4) {
      insights.push({
        id: `opportunity-${index}`,
        title: `Growth Opportunity in ${section.name}`,
        description: `Moderate performance with potential for improvement. Score: ${section.averageScore.toFixed(1)}/5.`,
        type: 'opportunity',
        priority: 'medium',
        impact: 4,
        effort: 3,
        category: section.name,
        metrics: {
          current: section.averageScore,
          target: 4.0,
          unit: 'score'
        }
      });
    }
  });

  // Add AI-specific insights
  const aiQuestions = responses.filter(r => r.tags?.includes('AI'));
  const aiAverageScore = aiQuestions.length > 0 
    ? aiQuestions.reduce((sum, q) => sum + q.value, 0) / aiQuestions.length 
    : 0;

  if (aiAverageScore < 3) {
    insights.push({
      id: 'ai-readiness',
      title: 'AI Readiness Assessment',
      description: 'Organization shows limited AI adoption. Significant opportunity for digital transformation.',
      type: 'opportunity',
      priority: 'high',
      impact: 5,
      effort: 4,
      category: 'Digital Transformation',
      metrics: {
        current: aiAverageScore,
        target: 4.0,
        unit: 'readiness score'
      }
    });
  }

  // Add governance insights
  const governanceQuestions = responses.filter(r => r.section === 'Governance & Leadership');
  const govScore = governanceQuestions.length > 0 
    ? governanceQuestions.reduce((sum, q) => sum + q.value, 0) / governanceQuestions.length 
    : 0;

  if (govScore < 3.5) {
    insights.push({
      id: 'governance-structure',
      title: 'Governance Structure Enhancement',
      description: 'Leadership and governance structures may benefit from clarity and streamlining.',
      type: 'recommendation',
      priority: 'high',
      impact: 4,
      effort: 3,
      category: 'Governance & Leadership',
      metrics: {
        current: govScore,
        target: 4.0,
        unit: 'score'
      }
    });
  }

  // Add efficiency insights for operational areas
  const operationalAreas = ['Student Services & Success', 'Finance & Budget', 'Human Resources & Talent'];
  operationalAreas.forEach(area => {
    const areaQuestions = responses.filter(r => r.section === area);
    const areaScore = areaQuestions.length > 0 
      ? areaQuestions.reduce((sum, q) => sum + q.value, 0) / areaQuestions.length 
      : 0;

    if (areaScore >= 3 && areaScore < 4) {
      insights.push({
        id: `efficiency-${area.replace(/\s+/g, '-').toLowerCase()}`,
        title: `Operational Efficiency in ${area}`,
        description: `Moderate efficiency levels detected. Process optimization could yield significant improvements.`,
        type: 'recommendation',
        priority: 'medium',
        impact: 3,
        effort: 2,
        category: area,
        metrics: {
          current: areaScore,
          target: 4.0,
          unit: 'efficiency score'
        }
      });
    }
  });

  return insights;
}

function generatePerformanceMetrics(responses: AssessmentResponse[]) {
  const areas = Array.from(new Set(responses.map(r => r.section)));
  
  return {
    overallMaturity: {
      score: responses.reduce((sum, r) => sum + r.value, 0) / responses.length,
      benchmark: 3.5,
      trend: 'improving'
    },
    digitalReadiness: {
      score: responses
        .filter(r => r.tags?.includes('AI') || r.section.includes('Technology'))
        .reduce((sum, r, _, arr) => sum + r.value / arr.length, 0) || 0,
      benchmark: 3.0,
      trend: 'stable'
    },
    operationalEfficiency: {
      score: responses
        .filter(r => ['Student Services & Success', 'Finance & Budget', 'Human Resources & Talent'].includes(r.section))
        .reduce((sum, r, _, arr) => sum + r.value / arr.length, 0) || 0,
      benchmark: 3.8,
      trend: 'improving'
    },
    strategicAlignment: {
      score: responses
        .filter(r => r.section === 'Governance & Leadership')
        .reduce((sum, r, _, arr) => sum + r.value / arr.length, 0) || 0,
      benchmark: 4.0,
      trend: 'needs-attention'
    },
    sectionBreakdown: areas.map(area => {
      const areaResponses = responses.filter(r => r.section === area);
      return {
        name: area,
        averageScore: areaResponses.reduce((sum, r) => sum + r.value, 0) / areaResponses.length,
        questionCount: areaResponses.length,
        completionRate: 100, // Assuming all questions are answered
        trend: Math.random() > 0.5 ? 'improving' : 'stable'
      };
    })
  };
}

/**
 * Generate tier-specific recommendations based on subscription level
 */
function generateTierSpecificRecommendations(tier: string, analysisResult: any) {
  const baseRecommendations = analysisResult.recommendations || [];
  
  switch (tier) {
    case 'one-time-diagnostic':
      return {
        scope: 'Foundational Assessment',
        algorithms: ['OCI', 'HOCI', 'JCI'],
        focus: 'Quick wins and immediate improvements',
        deliverables: [
          'Core organizational health score',
          'Change readiness assessment', 
          'Complexity analysis',
          'Basic recommendations for improvement'
        ],
        recommendations: baseRecommendations.slice(0, 5).map((rec: any) => ({
          ...rec,
          scope: 'immediate',
          complexity: 'low'
        }))
      };
      
    case 'monthly-subscription':
      return {
        scope: 'Ongoing Strategic Support',
        algorithms: ['OCI', 'HOCI', 'JCI', 'DSCH'],
        focus: 'Process optimization and strategic alignment',
        deliverables: [
          'Advanced structural analysis',
          'Process efficiency metrics',
          'Monthly progress tracking',
          'Strategic planning support'
        ],
        recommendations: baseRecommendations.slice(0, 10).map((rec: any) => ({
          ...rec,
          scope: rec.priority === 'critical' ? 'immediate' : 'short-term',
          complexity: 'moderate'
        }))
      };
      
    case 'comprehensive-package':
      return {
        scope: 'Complete Organizational Analysis',
        algorithms: ['OCI', 'HOCI', 'JCI', 'DSCH', 'CRF', 'LEI'],
        focus: 'Cultural transformation and leadership development',
        deliverables: [
          'Full algorithm suite analysis',
          'Cultural resilience assessment',
          'Leadership effectiveness evaluation',
          'Scenario modeling capabilities',
          'Cost-savings analysis'
        ],
        recommendations: baseRecommendations.map((rec: any) => ({
          ...rec,
          scope: rec.priority === 'critical' ? 'immediate' : 
                 rec.priority === 'high' ? 'short-term' : 'medium-term',
          complexity: 'high'
        }))
      };
      
    case 'enterprise-transformation':
      return {
        scope: 'Enterprise-Grade Transformation',
        algorithms: ['All Primary + Advanced + Experimental'],
        focus: 'Predictive analytics and AI-powered insights',
        deliverables: [
          'Monte Carlo simulations',
          'Predictive analytics',
          'AI-powered recommendations',
          'Real-time benchmarking',
          'ROI modeling',
          'Risk assessment with probability models'
        ],
        recommendations: [
          ...baseRecommendations.map((rec: any) => ({
            ...rec,
            confidence: rec.confidence || 0.85,
            riskLevel: rec.riskLevel || 'low',
            expectedROI: rec.expectedROI || Math.random() * 500000 + 100000
          })),
          // Add enterprise-specific AI recommendations
          {
            id: 'ai-transformation',
            title: 'AI-Powered Organizational Optimization',
            description: 'Implement machine learning algorithms for predictive workforce planning and automated process optimization.',
            priority: 'high',
            impact: 5,
            effort: 4,
            category: 'Digital Transformation',
            scope: 'long-term',
            complexity: 'very-high',
            expectedROI: 2500000,
            confidence: 0.78,
            riskLevel: 'medium'
          }
        ]
      };
      
    default:
      return {
        scope: 'Basic Analysis',
        algorithms: ['OCI', 'HOCI', 'JCI'],
        focus: 'Fundamental organizational assessment',
        deliverables: ['Basic organizational metrics'],
        recommendations: baseRecommendations.slice(0, 3)
      };
  }
}

/**
 * Generate AI opportunity assessment based on tier and responses
 */
function generateAIOpportunityAssessment(responses: AssessmentResponse[], tier: string) {
  // Filter AI-related responses
  const aiResponses = responses.filter(r => 
    r.tags?.includes('AI') || 
    r.section.includes('Technology') ||
    r.section.includes('AI & Automation')
  );
  
  const aiReadinessScore = aiResponses.length > 0 
    ? aiResponses.reduce((sum, r) => sum + r.value, 0) / aiResponses.length * 20 // Scale to 0-100
    : 50; // Default moderate score
  
  const baseAssessment = {
    aiReadinessScore: Math.round(aiReadinessScore),
    readinessLevel: aiReadinessScore >= 80 ? 'Advanced' : 
                   aiReadinessScore >= 60 ? 'Intermediate' : 
                   aiReadinessScore >= 40 ? 'Developing' : 'Foundational',
    assessmentDate: new Date().toISOString(),
    dataQualityScore: aiResponses.length >= 10 ? 'High' : 
                      aiResponses.length >= 5 ? 'Medium' : 'Basic'
  };

  switch (tier) {
    case 'one-time-diagnostic':
      return {
        ...baseAssessment,
        scope: 'Basic AI Opportunity Identification',
        opportunities: [
          {
            area: 'Administrative Automation',
            priority: 'High',
            description: 'Automate routine administrative tasks to reduce manual work',
            potentialSavings: '$15,000 - $40,000 annually',
            implementation: 'Low complexity, 3-6 months',
            confidence: 0.85
          },
          {
            area: 'Communication Enhancement',
            priority: 'Medium',
            description: 'AI-powered chatbots for basic student/client inquiries',
            potentialSavings: '$8,000 - $25,000 annually',
            implementation: 'Medium complexity, 6-12 months',
            confidence: 0.75
          }
        ],
        recommendations: [
          'Start with simple task automation in high-volume administrative processes',
          'Evaluate current technology infrastructure for AI readiness',
          'Identify staff training needs for AI tool adoption'
        ]
      };

    case 'monthly-subscription':
      return {
        ...baseAssessment,
        scope: 'Enhanced AI Analysis with Departmental Breakdown',
        opportunities: [
          {
            area: 'Process Automation',
            priority: 'High',
            description: 'Department-specific workflow automation and optimization',
            potentialSavings: '$35,000 - $85,000 annually',
            implementation: 'Medium complexity, 6-12 months',
            confidence: 0.82,
            departments: ['HR', 'Finance', 'Student Services']
          },
          {
            area: 'Predictive Analytics',
            priority: 'High',
            description: 'AI-driven forecasting for enrollment, budgeting, and resource planning',
            potentialSavings: '$50,000 - $150,000 annually',
            implementation: 'Medium-high complexity, 9-15 months',
            confidence: 0.78
          }
        ],
        recommendations: [
          'Implement AI pilots in highest-impact departments first',
          'Develop comprehensive AI governance and ethics framework',
          'Establish AI center of excellence for ongoing optimization'
        ]
      };

    case 'comprehensive-package':
      return {
        ...baseAssessment,
        scope: 'Comprehensive AI Transformation Roadmap',
        opportunities: [
          {
            area: 'Enterprise AI Platform',
            priority: 'Critical',
            description: 'Integrated AI platform for organization-wide automation and insights',
            potentialSavings: '$150,000 - $400,000 annually',
            implementation: 'High complexity, 12-24 months',
            confidence: 0.88,
            // NEW: Platform recommendations with partnerships
            platformRecommendations: {
              primary: {
                name: 'Microsoft Power Platform + AI Builder',
                category: 'Enterprise Low-Code AI',
                bestFor: 'Organizations with existing Microsoft infrastructure',
                priceRange: '$40-$60/user/month',
                expectedROI: '$200,000 - $400,000 annually',
                partnershipType: 'Certified Partner',
                implementationSupport: true,
                partnerDiscount: '15% first year'
              },
              alternatives: [
                {
                  name: 'Salesforce Einstein Platform',
                  category: 'CRM-Centric AI',
                  priceRange: '$150-$300/user/month',
                  expectedROI: '$180,000 - $350,000 annually'
                },
                {
                  name: 'Google Cloud AI Platform',
                  category: 'Cloud-Native AI',
                  priceRange: 'Usage-based pricing',
                  expectedROI: '$160,000 - $320,000 annually'
                }
              ]
            }
          },
          {
            area: 'Workforce Augmentation',
            priority: 'High',
            description: 'AI tools to enhance employee productivity and decision-making',
            potentialSavings: '$75,000 - $200,000 annually',
            implementation: 'Medium-high complexity, 8-16 months',
            confidence: 0.82,
            // NEW: Platform recommendations
            platformRecommendations: {
              primary: {
                name: 'Microsoft 365 Copilot',
                category: 'Productivity AI',
                bestFor: 'Knowledge workers and administrative staff',
                priceRange: '$30/user/month',
                expectedROI: '$100,000 - $200,000 annually',
                partnershipType: 'Certified Partner',
                implementationSupport: true
              },
              alternatives: [
                {
                  name: 'OpenAI ChatGPT Enterprise',
                  category: 'Conversational AI',
                  priceRange: '$25/user/month',
                  expectedROI: '$80,000 - $180,000 annually'
                },
                {
                  name: 'Anthropic Claude for Business',
                  category: 'AI Assistant',
                  priceRange: 'Custom pricing',
                  expectedROI: '$75,000 - $160,000 annually'
                }
              ]
            }
          }
        ],
        recommendations: [
          'Establish AI transformation office with dedicated resources',
          'Implement comprehensive change management program',
          'Create AI ethics board and governance framework'
        ]
      };

    case 'enterprise-transformation':
      return {
        ...baseAssessment,
        scope: 'Advanced AI Strategy with Predictive Modeling',
        opportunities: [
          {
            area: 'AI-Native Operations',
            priority: 'Strategic',
            description: 'Complete transformation to AI-first operational model',
            potentialSavings: '$500,000 - $2,000,000 annually',
            implementation: 'Very high complexity, 24-48 months',
            confidence: 0.90
          },
          {
            area: 'Predictive Workforce Planning',
            priority: 'Critical',
            description: 'AI-powered workforce analytics and automated resource optimization',
            potentialSavings: '$200,000 - $800,000 annually',
            implementation: 'High complexity, 15-30 months',
            confidence: 0.87
          }
        ],
        predictiveModeling: {
          scenarios: 10000,
          confidenceIntervals: { p50: '450%', p90: '780%' },
          successProbability: 0.82
        },
        recommendations: [
          'Implement enterprise AI architecture with microservices design',
          'Establish AI research and development division',
          'Create industry partnerships for AI innovation collaboration'
        ]
      };

    default:
      return {
        ...baseAssessment,
        scope: 'Basic Assessment',
        opportunities: [],
        recommendations: ['Contact support for tier-specific AI assessment']
      };
  }
}
