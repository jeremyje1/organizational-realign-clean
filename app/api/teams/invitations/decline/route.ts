import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

// POST - Decline invitation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();

    // Mark invitation as expired/declined by setting expires_at to past date
    const { error: declineError } = await supabase
      .from('team_invitations')
      .update({
        expires_at: new Date(0).toISOString() // Set to epoch to mark as declined
      })
      .eq('token', token)
      .is('accepted_at', null);

    if (declineError) {
      console.error('Failed to decline invitation:', declineError);
      return NextResponse.json({ error: 'Failed to decline invitation' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Invitation declined successfully' });

  } catch (error) {
    console.error('Decline invitation error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
