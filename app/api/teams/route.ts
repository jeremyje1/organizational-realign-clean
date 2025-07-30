import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const createTeamSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description } = createTeamSchema.parse(body);

    // Create team
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .insert({
        name,
        description,
        created_by: user.id,
      })
      .select()
      .single();

    if (teamError) {
      console.error('Team creation error:', teamError);
      return NextResponse.json({ error: 'Failed to create team' }, { status: 500 });
    }

    // Add creator as team admin
    const { error: memberError } = await supabase
      .from('team_members')
      .insert({
        team_id: team.id,
        user_id: user.id,
        role: 'admin',
      });

    if (memberError) {
      console.error('Team member creation error:', memberError);
      // Try to clean up the team if member creation failed
      await supabase.from('teams').delete().eq('id', team.id);
      return NextResponse.json({ error: 'Failed to create team membership' }, { status: 500 });
    }

    return NextResponse.json({ team });
  } catch (error) {
    console.error('Create team error:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get teams where user is a member
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select(`
        *,
        team_members!inner (
          role,
          joined_at
        )
      `)
      .eq('team_members.user_id', user.id);

    if (teamsError) {
      console.error('Teams fetch error:', teamsError);
      return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
    }

    return NextResponse.json({ teams });
  } catch (error) {
    console.error('Get teams error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
