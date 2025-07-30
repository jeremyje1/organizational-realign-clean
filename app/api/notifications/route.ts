// app/api/notifications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Verify authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's email from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single();

    if (!profile?.email) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    // Get all notifications for this user
    // Note: This is a placeholder - we would typically have a notifications table
    // For now, we'll generate some sample notifications based on team/assessment activity
    const { data: collaborations } = await supabase
      .from('assessment_collaborators')
      .select(`
        *,
        assessments:assessment_id (
          id,
          status,
          updated_at
        )
      `)
      .eq('email', profile.email)
      .order('invited_at', { ascending: false })
      .limit(10);
      
    const { data: teamMembers } = await supabase
      .from('team_members')
      .select(`
        *,
        teams:team_id (
          id,
          name,
          created_at,
          created_by
        )
      `)
      .eq('user_id', user.id)
      .order('joined_at', { ascending: false })
      .limit(10);
    
    // Get team invitations for this user
    const { data: teamInvitations } = await supabase
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
      .eq('email', profile.email)
      .is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(10);
    
    // Generate notifications based on recent activity
    const notifications = [];
    
    // Add collaboration notifications
    if (collaborations?.length) {
      collaborations.forEach((collab, _index) => {
        // For new invitations
        if (!collab.joined_at) {
          notifications.push({
            id: `collab-invite-${collab.id}`,
            title: 'New Collaboration Invitation',
            message: `You've been invited to collaborate on an assessment as ${collab.role.toLowerCase()}`,
            created_at: collab.invited_at,
            action: 'View Assessment',
            link: `/assessment/${collab.assessment_id}`,
            read: false,
            type: 'invitation'
          });
        }
        
        // For assessment updates
        if (collab.assessments?.status === 'ANALYZED' && collab.assessments?.updated_at) {
          notifications.push({
            id: `analysis-${collab.assessment_id}`,
            title: 'Assessment Analysis Ready',
            message: 'The AI analysis for a shared assessment has been completed',
            created_at: collab.assessments.updated_at,
            action: 'View Results',
            link: `/assessment/${collab.assessment_id}/results`,
            read: false,
            type: 'analysis'
          });
        }
      });
    }
    
    
    // Add team invitation notifications
    if (teamInvitations?.length) {
      teamInvitations.forEach((invitation) => {
        const inviterName = invitation.profiles?.full_name || invitation.profiles?.email || 'Someone';
        notifications.push({
          id: `team-invite-${invitation.id}`,
          title: 'Team Invitation',
          message: `${inviterName} has invited you to join the ${invitation.teams?.name} team as ${invitation.role}`,
          created_at: invitation.created_at,
          action: 'View Invitation',
          link: `/teams/accept-invitation?token=${invitation.token}`,
          read: false,
          type: 'team_invitation'
        });
      });
    }
    
    // Add team notifications
    if (teamMembers?.length) {
      teamMembers.forEach((member) => {
        if (member.status === 'pending') {
          notifications.push({
            id: `team-invite-${member.id}`,
            title: 'Team Invitation',
            message: `You've been invited to join the ${member.teams?.name} team`,
            created_at: member.invited_at,
            action: 'View Team',
            link: `/teams`,
            read: false,
            type: 'team_invitation'
          });
        }
      });
    }
    
    // Sort by date, newest first
    notifications.sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    
    return NextResponse.json({
      success: true,
      notifications
    });

  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}
