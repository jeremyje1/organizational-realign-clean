import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// AI Readiness Database Client (separate database)
const aiReadinessSupabase = process.env.AI_READINESS_SUPABASE_URL && process.env.AI_READINESS_SUPABASE_ANON_KEY
  ? createClient(
      process.env.AI_READINESS_SUPABASE_URL,
      process.env.AI_READINESS_SUPABASE_ANON_KEY
    )
  : null;

export async function GET(request: NextRequest) {
  console.log('Analytics API called');
  
  try {
    const authHeader = request.headers.get('Authorization');
    console.log('Authorization header:', authHeader ? 'present' : 'missing');
    
    // Simple admin authentication check
    if (!authHeader || !authHeader.includes('admin-token')) {
      console.log('Authorization failed');
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    console.log('Authorization successful');

    const { searchParams } = new URL(request.url);
    const range = parseInt(searchParams.get('range') || '30');
    console.log('Date range:', range, 'days');
    
    // Check environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase environment variables');
      const emptyAnalytics = processAnalyticsData([]);
      return NextResponse.json(emptyAnalytics);
    }

    console.log('Environment variables present');
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - range);
    console.log('Date range:', startDate.toISOString(), 'to', endDate.toISOString());

    // Fetch organizational assessments with admin privileges (bypassing RLS)
    console.log('Fetching organizational assessments from Supabase...');
    const { data: orgAssessments, error: orgError } = await supabase
      .from('assessments')
      .select(`
        id,
        tier,
        organization_type,
        institution_name,
        contact_email,
        responses,
        ai_readiness_score,
        analysis_results,
        created_at
      `)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: false });

    if (orgError) {
      console.error('Error fetching organizational assessments for analytics:', orgError);
    }

    // Fetch AI readiness assessments
    console.log('Fetching AI readiness assessments from separate database...');
    let aiAssessments = null;
    let aiError = null;
    
    if (aiReadinessSupabase) {
      const result = await aiReadinessSupabase
        .from('ai_readiness_assessments')
        .select(`
          id,
          tier,
          institution_type,
          institution_name,
          contact_email,
          responses,
          ai_readiness_score,
          ai_analysis,
          created_at
        `)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false });
      
      aiAssessments = result.data;
      aiError = result.error;
    } else {
      console.warn('AI readiness database not configured');
    }

    // Handle case where AI readiness table doesn't exist yet
    if (aiError && aiError.message?.includes('does not exist')) {
      console.warn('AI readiness assessments table does not exist yet, skipping...');
    } else if (aiError) {
      console.error('Error fetching AI readiness assessments for analytics:', aiError);
    }

    // If both queries failed, return empty analytics
    if (orgError && (aiError && !aiError.message?.includes('does not exist'))) {
      console.log('Falling back to empty analytics data due to database errors');
      const emptyAnalytics = processAnalyticsData([]);
      return NextResponse.json(emptyAnalytics);
    }

    // Combine assessments with type indicators
    const formattedOrgAssessments = (orgAssessments || []).map(assessment => ({
      ...assessment,
      type: 'organizational',
      organization_name: assessment.institution_name,
      industry: assessment.organization_type
    }));

    const formattedAiAssessments = (aiAssessments || []).map(assessment => ({
      ...assessment,
      type: 'ai-readiness',
      institution_name: assessment.institution_name,
      industry: assessment.institution_type,
      analysis_results: assessment.ai_analysis
    }));

    const allAssessments = [...formattedOrgAssessments, ...formattedAiAssessments]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    console.log('Fetched', allAssessments.length, 'total assessments (', 
      formattedOrgAssessments.length, 'organizational,', 
      formattedAiAssessments.length, 'AI readiness)');

    // Process analytics data
    const analytics = processAnalyticsData(allAssessments);
    console.log('Processed analytics successfully');

    return NextResponse.json(analytics);

  } catch (error) {
    console.error('Admin analytics error:', error);
    
    // Return empty analytics data instead of error for testing
    console.log('Falling back to empty analytics due to unexpected error');
    const emptyAnalytics = processAnalyticsData([]);
    return NextResponse.json(emptyAnalytics);
  }
}

function processAnalyticsData(assessments: any[]) {
  const analytics = {
    totalAssessments: assessments.length,
    assessmentsByType: {} as Record<string, number>,
    assessmentsByTier: {} as Record<string, number>,
    assessmentsByIndustry: {} as Record<string, number>,
    assessmentsByMonth: {} as Record<string, number>,
    completionRates: {} as Record<string, number>,
    avgResponseCounts: {} as Record<string, number>,
    aiReadinessScores: {
      average: 0,
      byTier: {} as Record<string, number>,
      distribution: {} as Record<string, number>
    },
    recentAssessments: [] as Array<{
      id: string;
      tier: string;
      industry: string;
      institution: string;
      created_at: string;
      status: string;
    }>
  };

  // Track counts and sums for calculations
  const tierCounts = {} as Record<string, number>;
  const tierResponseCounts = {} as Record<string, number[]>;
  const tierCompletions = {} as Record<string, { total: number; completed: number }>;
  const tierAiScores = {} as Record<string, number[]>;

  let totalAiScore = 0;
  let aiScoreCount = 0;

  assessments.forEach((assessment) => {
    const tier = assessment.tier || 'unknown';
    const type = assessment.type || 'unknown';
    const industry = assessment.industry || assessment.organization_type || 'unknown';
    const responseCount = Object.keys(assessment.responses || {}).length;
    const hasAnalysis = !!assessment.analysis_results;
    const aiScore = assessment.ai_readiness_score;

    // Count by type
    analytics.assessmentsByType[type] = (analytics.assessmentsByType[type] || 0) + 1;

    // Count by tier
    tierCounts[tier] = (tierCounts[tier] || 0) + 1;
    analytics.assessmentsByTier[tier] = tierCounts[tier];

    // Count by industry
    analytics.assessmentsByIndustry[industry] = (analytics.assessmentsByIndustry[industry] || 0) + 1;

    // Track response counts by tier
    if (!tierResponseCounts[tier]) tierResponseCounts[tier] = [];
    tierResponseCounts[tier].push(responseCount);

    // Track completion rates
    if (!tierCompletions[tier]) tierCompletions[tier] = { total: 0, completed: 0 };
    tierCompletions[tier].total++;
    if (hasAnalysis) tierCompletions[tier].completed++;

    // Track AI readiness scores
    if (aiScore !== null && aiScore !== undefined) {
      totalAiScore += aiScore;
      aiScoreCount++;
      
      if (!tierAiScores[tier]) tierAiScores[tier] = [];
      tierAiScores[tier].push(aiScore);
    }

    // Track by month
    const monthKey = new Date(assessment.created_at).toISOString().substring(0, 7); // YYYY-MM
    analytics.assessmentsByMonth[monthKey] = (analytics.assessmentsByMonth[monthKey] || 0) + 1;
  });

  // Calculate completion rates
  Object.entries(tierCompletions).forEach(([tier, data]) => {
    analytics.completionRates[tier] = data.total > 0 ? data.completed / data.total : 0;
  });

  // Calculate average response counts
  Object.entries(tierResponseCounts).forEach(([tier, counts]) => {
    analytics.avgResponseCounts[tier] = counts.length > 0 
      ? counts.reduce((sum, count) => sum + count, 0) / counts.length 
      : 0;
  });

  // Calculate AI readiness scores
  analytics.aiReadinessScores.average = aiScoreCount > 0 ? totalAiScore / aiScoreCount : 0;

  Object.entries(tierAiScores).forEach(([tier, scores]) => {
    analytics.aiReadinessScores.byTier[tier] = scores.length > 0 
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length 
      : 0;
  });

  // AI readiness distribution (0-20, 21-40, 41-60, 61-80, 81-100)
  const distributionRanges = ['0-20', '21-40', '41-60', '61-80', '81-100'];
  distributionRanges.forEach(range => analytics.aiReadinessScores.distribution[range] = 0);

  assessments.forEach((assessment) => {
    const score = assessment.ai_readiness_score;
    if (score !== null && score !== undefined) {
      if (score <= 20) analytics.aiReadinessScores.distribution['0-20']++;
      else if (score <= 40) analytics.aiReadinessScores.distribution['21-40']++;
      else if (score <= 60) analytics.aiReadinessScores.distribution['41-60']++;
      else if (score <= 80) analytics.aiReadinessScores.distribution['61-80']++;
      else analytics.aiReadinessScores.distribution['81-100']++;
    }
  });

  // Recent assessments (last 10)
  analytics.recentAssessments = assessments.slice(0, 10).map((assessment) => ({
    id: assessment.id,
    tier: assessment.tier || 'unknown',
    industry: assessment.organization_type || 'unknown',
    institution: assessment.institution_name || 'Unknown Institution',
    created_at: assessment.created_at,
    status: assessment.analysis_results ? 'completed' : 'in-progress'
  }));

  return analytics;
}
