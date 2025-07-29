import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

// GET - Verify invitation token and get details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();

    // Get invitation details with team and inviter info
    const { data: invitation, error: invitationError } = await supabase
      .from('team_invitations')
      .select(`
        *,
        teams:team_id (
          id,
          name,
          description
        ),
        profiles:invited_by (
          full_name,
          email
        )
      `)
      .eq('token', token)
      .is('accepted_at', null)
      .single();

    if (invitationError || !invitation) {
      return NextResponse.json({ error: 'Invalid or expired invitation' }, { status: 404 });
    }

    // Check if invitation has expired
    if (new Date(invitation.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Invitation has expired' }, { status: 410 });
    }

    return NextResponse.json({
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        expires_at: invitation.expires_at,
        team: invitation.teams,
        inviter: invitation.profiles
      }
    });

  } catch (error) {
    console.error('Invitation verification error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST - Accept invitation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get invitation details
    const { data: invitation, error: invitationError } = await supabase
      .from('team_invitations')
      .select('*')
      .eq('token', token)
      .is('accepted_at', null)
      .single();

    if (invitationError || !invitation) {
      return NextResponse.json({ error: 'Invalid invitation' }, { status: 404 });
    }

    // Check if invitation has expired
    if (new Date(invitation.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Invitation has expired' }, { status: 410 });
    }

    // Get user profile to check email
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single();

    // Check if the invitation email matches the user's email (optional - for security)
    if (profile?.email !== invitation.email) {
      return NextResponse.json({ 
        error: 'This invitation was sent to a different email address' 
      }, { status: 403 });
    }

    // Check if user is already a member of the team
    const { data: existingMember } = await supabase
      .from('team_members')
      .select('id')
      .eq('team_id', invitation.team_id)
      .eq('user_id', user.id)
      .single();

    if (existingMember) {
      return NextResponse.json({ 
        error: 'You are already a member of this team' 
      }, { status: 409 });
    }

    // Add user to team
    const { error: memberError } = await supabase
      .from('team_members')
      .insert({
        team_id: invitation.team_id,
        user_id: user.id,
        role: invitation.role,
      });

    if (memberError) {
      console.error('Failed to add team member:', memberError);
      return NextResponse.json({ error: 'Failed to join team' }, { status: 500 });
    }

    // Mark invitation as accepted
    const { error: acceptError } = await supabase
      .from('team_invitations')
      .update({
        accepted_at: new Date().toISOString()
      })
      .eq('id', invitation.id);

    if (acceptError) {
      console.error('Failed to mark invitation as accepted:', acceptError);
      // Don't fail the request if this fails - user is already added to team
    }

    return NextResponse.json({ 
      message: 'Successfully joined team',
      team_id: invitation.team_id 
    });

  } catch (error) {
    console.error('Accept invitation error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
