import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const createCommentSchema = z.object({
  content: z.string().min(1).max(2000),
  section: z.string().optional(),
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
    const { content, section } = createCommentSchema.parse(body);

    // Check if user has access to comment on this assessment
    const { data: access, error: accessError } = await supabase
      .from('assessments')
      .select(`
        user_id,
        assessment_shares (
          permissions,
          team_id,
          team_members (
            user_id
          )
        )
      `)
      .eq('id', params.assessmentId)
      .single();

    if (accessError) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    // Check permissions
    const hasAccess = access.user_id === user.id || 
      access.assessment_shares?.some((share: any) => 
        ['comment', 'edit'].includes(share.permissions) &&
        share.team_members?.some((member: any) => member.user_id === user.id)
      );

    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Create comment
    const { data: comment, error: commentError } = await supabase
      .from('assessment_comments')
      .insert({
        assessment_id: params.assessmentId,
        user_id: user.id,
        content,
        section,
      })
      .select(`
        *,
        profiles (
          email,
          full_name
        )
      `)
      .single();

    if (commentError) {
      console.error('Comment creation error:', commentError);
      return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
    }

    return NextResponse.json({ comment });
  } catch (error) {
    console.error('Create comment error:', error);
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

    // Check access to assessment comments
    const { data: access, error: accessError } = await supabase
      .from('assessments')
      .select(`
        user_id,
        assessment_shares (
          permissions,
          team_id,
          team_members (
            user_id
          )
        )
      `)
      .eq('id', params.assessmentId)
      .single();

    if (accessError) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    // Check permissions
    const hasAccess = access.user_id === user.id || 
      access.assessment_shares?.some((share: any) => 
        share.team_members?.some((member: any) => member.user_id === user.id)
      );

    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get comments
    const { data: comments, error: commentsError } = await supabase
      .from('assessment_comments')
      .select(`
        *,
        profiles (
          email,
          full_name
        )
      `)
      .eq('assessment_id', params.assessmentId)
      .order('created_at', { ascending: true });

    if (commentsError) {
      console.error('Comments fetch error:', commentsError);
      return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }

    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
