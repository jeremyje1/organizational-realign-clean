import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { teamId: string } }
) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is member of the team
    const { error: membershipError } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', params.teamId)
      .eq('user_id', user.id)
      .single();

    if (membershipError) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get pending team invitations
    const { data: invitations, error: invitationsError } = await supabase
      .from('team_invitations')
      .select('*')
      .eq('team_id', params.teamId)
      .is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (invitationsError) {
      console.error('Invitations fetch error:', invitationsError);
      return NextResponse.json({ error: 'Failed to fetch invitations' }, { status: 500 });
    }

    return NextResponse.json({ invitations: invitations || [] });
  } catch (error) {
    console.error('Get invitations error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
