import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies as nextCookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { assessmentId: string } }
) {
  try {
    const { assessmentId } = await params;

    if (!assessmentId) {
      return NextResponse.json(
        { error: 'Assessment ID is required' },
        { status: 400 }
      );
    }

    // Build a fresh Supabase client inside the request scope
    const cookieStore = nextCookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: async (name) => {
            const cookie = await cookieStore;
            return cookie.get(name)?.value;
          },
          set: async (name: string, value: string, options?: CookieOptions) => {
            const cookie = await cookieStore;
            cookie.set({ name, value, ...(options ?? {}) });
          },
          remove: async (name: string, options?: CookieOptions) => {
            const cookie = await cookieStore;
            cookie.delete({ name, ...(options ?? {}) });
          },
        },
      },
    );

    // Handle test IDs with mock data
    if (assessmentId.startsWith('test-')) {
      console.log(`[GET /api/assessments/${assessmentId}] Returning mock data for test ID`);
      
      const mockAssessment = {
        id: assessmentId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: 'test-user',
        company_name: 'Demo Company',
        title: 'Demo Assessment',
        assessment_type: 'organizational_readiness',
        status: 'completed',
        responses: {
          span_control_1: 2,
          span_control_2: 3,
          culture_1: 3,
          culture_2: 3,
          tech_fit_1: 2,
          tech_fit_2: 4,
          readiness_1: 3,
          readiness_2: 2,
          industry: 'technology',
          company_size: 'medium',
          segment: 'midmarket'
        },
        segment: 'midmarket',
        metadata: {
          source: 'secure_access_demo',
          demo_mode: true
        }
      };

      return NextResponse.json({ 
        success: true, 
        data: mockAssessment,
        source: 'mock'
      });
    }

    // Try to fetch from the assessments table first
    console.log(`[GET /api/assessments/${assessmentId}] Fetching assessment...`);
    
    const { data: assessmentData, error: assessmentError } = await supabase
      .from('assessments')
      .select('*')
      .eq('id', assessmentId)
      .single();

    if (!assessmentError && assessmentData) {
      // Found in organizational assessments table
      return NextResponse.json({ 
        success: true, 
        data: assessmentData,
        source: 'organizational',
        type: 'organizational'
      });
    }

    // If not found in assessments table, try surveys table
    console.log(`[GET /api/assessments/${assessmentId}] Not found in assessments, trying surveys...`);
    
    const { data: surveyData, error: surveyError } = await supabase
      .from('surveys')
      .select('*')
      .eq('id', assessmentId)
      .single();

    if (!surveyError && surveyData) {
      // Found in surveys table
      return NextResponse.json({ 
        success: true, 
        data: surveyData,
        source: 'surveys',
        type: 'survey'
      });
    }

    // If not found in surveys table, try AI readiness assessments
    console.log(`[GET /api/assessments/${assessmentId}] Not found in surveys, trying AI readiness...`);
    
    try {
      // Create AI readiness database client
      const aiReadinessSupabase = createServerClient(
        process.env.NEXT_PUBLIC_AI_READINESS_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_AI_READINESS_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get: async (name) => {
              const cookie = await cookieStore;
              return cookie.get(name)?.value;
            },
            set: async (name: string, value: string, options?: CookieOptions) => {
              const cookie = await cookieStore;
              cookie.set({ name, value, ...(options ?? {}) });
            },
            remove: async (name: string, options?: CookieOptions) => {
              const cookie = await cookieStore;
              cookie.delete({ name, ...(options ?? {}) });
            },
          },
        },
      );

      const { data: aiAssessmentData, error: aiError } = await aiReadinessSupabase
        .from('ai_readiness_assessments')
        .select('*')
        .eq('id', assessmentId)
        .single();

      if (!aiError && aiAssessmentData) {
        // Found in AI readiness assessments table
        // Format it to match the expected assessment structure
        const formattedData = {
          id: aiAssessmentData.id,
          created_at: aiAssessmentData.created_at,
          updated_at: aiAssessmentData.updated_at,
          tier: aiAssessmentData.tier,
          institution_name: aiAssessmentData.institution_name,
          institution_type: aiAssessmentData.institution_type,
          contact_email: aiAssessmentData.contact_email,
          contact_name: aiAssessmentData.contact_name,
          responses: aiAssessmentData.responses,
          uploaded_files: aiAssessmentData.uploaded_files,
          analysis_results: aiAssessmentData.analysis_results,
          ai_readiness_score: aiAssessmentData.ai_readiness_score,
          ai_opportunity_assessment: aiAssessmentData.ai_opportunity_assessment,
          status: 'completed'
        };

        return NextResponse.json({ 
          success: true, 
          data: formattedData,
          source: 'ai_readiness',
          type: 'ai-readiness'
        });
      }
    } catch (aiError) {
      console.warn('Error checking AI readiness database:', aiError);
    }

    // Not found in either database
    console.error('Assessment not found in either database:', assessmentId);
    
    // If we get a policy error or not found, return a structured response
    if (assessmentError?.code === '42P17' || assessmentError?.message?.includes('policy')) {
      return NextResponse.json(
        { error: 'Access denied or assessment not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Assessment not found' },
      { status: 404 }
    );

  } catch (error) {
    console.error('Error in GET /api/assessments/[assessmentId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
