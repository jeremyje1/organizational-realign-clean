import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const shareAssessmentSchema = z.object({
  teamId: z.string().uuid(),
  permissions: z.enum(['view', 'comment', 'edit']),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { assessmentId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { teamId, permissions } = shareAssessmentSchema.parse(body);

    // Check if user owns the assessment
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .select('user_id')
      .eq('id', params.assessmentId)
      .single();

    if (assessmentError || assessment.user_id !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Check if user is member of the team
    const { error: membershipError } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', user.id)
      .single();

    if (membershipError) {
      return NextResponse.json({ error: 'Team access denied' }, { status: 403 });
    }

    // Share assessment with team
    const { data: share, error: shareError } = await supabase
      .from('assessment_shares')
      .insert({
        assessment_id: params.assessmentId,
        team_id: teamId,
        permissions,
        shared_by: user.id,
      })
      .select()
      .single();

    if (shareError) {
      console.error('Assessment share error:', shareError);
      return NextResponse.json({ error: 'Failed to share assessment' }, { status: 500 });
    }

    return NextResponse.json({ share });
  } catch (error) {
    console.error('Share assessment error:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { assessmentId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get assessment shares for assessments the user has access to
    const { data: shares, error: sharesError } = await supabase
      .from('assessment_shares')
      .select(`
        *,
        teams (
          name
        ),
        profiles (
          email,
          full_name
        )
      `)
      .eq('assessment_id', params.assessmentId);

    if (sharesError) {
      console.error('Shares fetch error:', sharesError);
      return NextResponse.json({ error: 'Failed to fetch shares' }, { status: 500 });
    }

    return NextResponse.json({ shares });
  } catch (error) {
    console.error('Get shares error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
