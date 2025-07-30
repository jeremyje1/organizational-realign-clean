import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'member', 'viewer']),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { teamId: string } }
) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { email, role } = inviteSchema.parse(body);

    // Check if user is admin of the team
    const { data: membership, error: membershipError } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', params.teamId)
      .eq('user_id', user.id)
      .single();

    if (membershipError || membership?.role !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Check if user being invited exists
    const { data: invitedUser, error: userLookupError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (userLookupError) {
      // User doesn't exist yet - create invitation
      const { data: invitation, error: inviteError } = await supabase
        .from('team_invitations')
        .insert({
          team_id: params.teamId,
          email,
          role,
          invited_by: user.id,
          token: crypto.randomUUID(),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        })
        .select()
        .single();

      if (inviteError) {
        console.error('Invitation creation error:', inviteError);
        return NextResponse.json({ error: 'Failed to create invitation' }, { status: 500 });
      }

      // TODO: Send email invitation here
      // Send team invitation email
      try {
        const { data: teamData } = await supabase
          .from('teams')
          .select('name')
          .eq('id', params.teamId)
          .single();

        const inviterProfile = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', user.id)
          .single();

        const inviterName = inviterProfile.data?.full_name || inviterProfile.data?.email || user.email;
        
        // Import email service
        const { sendTeamInvitation } = await import('@/lib/email-notifications');
        
        await sendTeamInvitation({
          teamName: teamData?.name || 'Team',
          inviterName,
          inviterEmail: user.email || '',
          recipientEmail: email,
          role,
          invitationToken: invitation.token,
        });
        
        console.log('Team invitation email sent successfully');
      } catch (emailError) {
        console.error('Failed to send team invitation email:', emailError);
        // Continue even if email fails - invitation is still created
      }
      return NextResponse.json({ invitation, message: 'Invitation sent' });
    }

    // User exists - add directly to team
    const { error: addMemberError } = await supabase
      .from('team_members')
      .insert({
        team_id: params.teamId,
        user_id: invitedUser.id,
        role,
      });

    if (addMemberError) {
      console.error('Add member error:', addMemberError);
      return NextResponse.json({ error: 'Failed to add team member' }, { status: 500 });
    }

    return NextResponse.json({ message: 'User added to team' });
  } catch (error) {
    console.error('Invite error:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

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

    // Get team members
    const { data: members, error: membersError } = await supabase
      .from('team_members')
      .select(`
        *,
        profiles (
          email,
          full_name
        )
      `)
      .eq('team_id', params.teamId);

    if (membersError) {
      console.error('Members fetch error:', membersError);
      return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
    }

    return NextResponse.json({ members });
  } catch (error) {
    console.error('Get members error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
