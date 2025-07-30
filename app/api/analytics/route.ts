/**
 * Analytics API Route
 * 
 * Endpoint for server-side analytics events when client-side tracking is not possible
 * or for sensitive operations that shouldn't be exposed to the client
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const data = await request.json();
    
    // Basic validation
    if (!data.eventType || !data.eventAction) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }
    
    // Get user session if available
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    
    // Store event in Supabase
    const { error } = await supabase
      .from('analytics_events')
      .insert([
        {
          event_type: data.eventType,
          event_action: data.eventAction,
          user_id: userId || null,
          properties: data.properties || {},
          url: data.url || null,
          referrer: data.referrer || null,
          user_agent: request.headers.get('user-agent') || null,
          ip_address: request.headers.get('x-forwarded-for') || null,
        }
      ]);
    
    if (error) {
      console.error('Error storing analytics event:', error);
      return NextResponse.json(
        { error: 'Failed to store event' }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Server error' }, 
      { status: 500 }
    );
  }
}
