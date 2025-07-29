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
  try {
    const authHeader = request.headers.get('Authorization');
    
    // Simple admin authentication check
    if (!authHeader || !authHeader.includes('admin-token')) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // Fetch recent organizational assessments
    const { data: orgAssessments, error: orgError } = await supabase
      .from('assessments')
      .select('id, institution_name, contact_email, tier, created_at, status')
      .order('created_at', { ascending: false })
      .limit(20);

    if (orgError) {
      console.error('Error fetching organizational assessments:', orgError);
      return NextResponse.json(
        { error: 'Failed to fetch organizational assessments', details: orgError.message },
        { status: 500 }
      );
    }

    // Fetch recent AI readiness assessments
    console.log('Fetching AI readiness assessments from separate database...');
    let aiAssessments = null;
    let aiError = null;
    
    if (aiReadinessSupabase) {
      const result = await aiReadinessSupabase
        .from('ai_readiness_assessments')
        .select('id, institution_name, contact_email, tier, created_at, status')
        .order('created_at', { ascending: false })
        .limit(20);
      
      aiAssessments = result.data;
      aiError = result.error;
    } else {
      console.warn('AI readiness database not configured');
    }

    // Handle case where AI readiness table doesn't exist yet
    if (aiError && aiError.message?.includes('does not exist')) {
      console.warn('AI readiness assessments table does not exist yet, skipping...');
    } else if (aiError) {
      console.error('Error fetching AI readiness assessments:', aiError);
      return NextResponse.json(
        { error: 'Failed to fetch AI readiness assessments', details: aiError.message },
        { status: 500 }
      );
    }

    // Combine and format assessments with type indicator
    const formattedOrgAssessments = (orgAssessments || []).map(assessment => ({
      ...assessment,
      type: 'organizational',
      institution_name: assessment.institution_name || 'N/A'
    }));

    const formattedAiAssessments = (aiAssessments || []).map(assessment => ({
      ...assessment,
      type: 'ai-readiness',
      institution_name: assessment.institution_name || 'N/A'
    }));

    const allAssessments = [...formattedOrgAssessments, ...formattedAiAssessments]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 20);

    return NextResponse.json({ 
      success: true, 
      count: allAssessments.length,
      assessments: allAssessments
    });

  } catch (error) {
    console.error('Admin assessments list error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
