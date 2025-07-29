import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { cookies as nextCookies } from 'next/headers';
import {
  createServerClient,
  type CookieOptions,
} from '@supabase/ssr';

export const dynamic = 'force-dynamic';

/** POST /api/database/inspect – inspect database schema */
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

    console.log('🔍 Inspecting database schema...');

    const tableInfo: any = {};

    // Test assessments table
    try {
      const { data: assessmentsTest, error: assessmentsError } = await supabase
        .from('assessments')
        .select('*')
        .limit(1);

      if (assessmentsError) {
        console.log('❌ Assessments table issue:', assessmentsError.message);
        tableInfo.assessments = { exists: false, error: assessmentsError.message };
      } else {
        console.log('✅ Assessments table accessible');
        tableInfo.assessments = { exists: true, sample: assessmentsTest };
      }
    } catch (error) {
      console.log('❌ Assessments table error:', error);
      tableInfo.assessments = { exists: false, error: error };
    }

    // Test surveys table
    try {
      const { data: surveysTest, error: surveysError } = await supabase
        .from('surveys')
        .select('*')
        .limit(1);

      if (surveysError) {
        console.log('❌ Surveys table issue:', surveysError.message);
        tableInfo.surveys = { exists: false, error: surveysError.message };
      } else {
        console.log('✅ Surveys table accessible');
        tableInfo.surveys = { exists: true, sample: surveysTest };
      }
    } catch (error) {
      console.log('❌ Surveys table error:', error);
      tableInfo.surveys = { exists: false, error: error };
    }

    return NextResponse.json({
      success: true,
      connection: 'active',
      tableDetails: tableInfo,
      message: 'Database schema inspection complete'
    });

  } catch (error) {
    console.error('🚨 Database inspection failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Database inspection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
