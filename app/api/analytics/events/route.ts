// BigQuery analytics endpoint for deep funnel tracking
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { event, payload } = await request.json();
    
    // In production, this would send to BigQuery via the client library
    // For now, we'll log and store in a simple format
    const analyticsData = {
      timestamp: new Date().toISOString(),
      event,
      payload,
      ip: request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer')
    };

    // Log for development/debugging
    console.log('[BigQuery Analytics]', analyticsData);

    // In production, replace with:
    // await bigQueryClient.dataset('analytics').table('events').insert([analyticsData]);

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Analytics endpoint error:', error);
    return NextResponse.json(
      { error: 'Failed to record analytics event' },
      { status: 500 }
    );
  }
}
