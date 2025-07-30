import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { cookies as nextCookies } from 'next/headers';
import {
  createServerClient,
  type CookieOptions,
} from '@supabase/ssr';

export const dynamic = 'force-dynamic';

/** POST /api/database/discover-schema – discover actual table schema */
export async function POST(_req: NextRequest) {
  try {
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

    console.log('🔍 Discovering actual database schema...');

    const schemaInfo: any = {};

    // Try to insert a test record with minimal data to see what errors we get
    // This will tell us what columns actually exist

    // Test assessments table with just an id
    try {
      const testAssessment = { id: 'schema-test-' + Date.now() };
      const { error: assessmentError } = await supabase
        .from('assessments')
        .insert([testAssessment]);

      if (assessmentError) {
        console.log('Assessments table error reveals schema:', assessmentError.message);
        schemaInfo.assessments = { 
          error: assessmentError.message,
          code: assessmentError.code,
          details: assessmentError.details
        };
      } else {
        // If no error, the table might have very loose constraints
        schemaInfo.assessments = { status: 'loose_schema_or_auto_fields' };
        
        // Clean up test record
        await supabase.from('assessments').delete().eq('id', testAssessment.id);
      }
    } catch (error) {
      console.log('Assessments table error:', error);
      schemaInfo.assessments = { error: error };
    }

    // Test surveys table
    try {
      const testSurvey = { id: 'schema-test-' + Date.now() };
      const { error: surveyError } = await supabase
        .from('surveys')
        .insert([testSurvey]);

      if (surveyError) {
        console.log('Surveys table error reveals schema:', surveyError.message);
        schemaInfo.surveys = { 
          error: surveyError.message,
          code: surveyError.code,
          details: surveyError.details
        };
      } else {
        schemaInfo.surveys = { status: 'loose_schema_or_auto_fields' };
        
        // Clean up test record
        await supabase.from('surveys').delete().eq('id', testSurvey.id);
      }
    } catch (error) {
      console.log('Surveys table error:', error);
      schemaInfo.surveys = { error: error };
    }

    // Try to select from each table to see existing structure
    try {
      const { data: assessmentSample } = await supabase
        .from('assessments')
        .select('*')
        .limit(1);
      
      if (assessmentSample && assessmentSample.length > 0) {
        schemaInfo.assessments.sampleColumns = Object.keys(assessmentSample[0]);
      }
    } catch (error) {
      console.log('Could not get assessments sample:', error);
    }

    try {
      const { data: surveySample } = await supabase
        .from('surveys')
        .select('*')
        .limit(1);
      
      if (surveySample && surveySample.length > 0) {
        schemaInfo.surveys.sampleColumns = Object.keys(surveySample[0]);
      }
    } catch (error) {
      console.log('Could not get surveys sample:', error);
    }

    return NextResponse.json({
      success: true,
      schemaDiscovery: schemaInfo,
      message: 'Schema discovery complete'
    });

  } catch (error) {
    console.error('🚨 Schema discovery failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Schema discovery failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
