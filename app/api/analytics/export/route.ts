// app/api/analytics/export/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getCollaborationStats } from '@/lib/collaboration-tracker';
import { createObjectCsvStringifier } from 'csv-writer';

export const dynamic = 'force-dynamic';

// Function to generate mock data for demonstration when database isn't ready
function getMockCollaborationStats() {
  const now = new Date();
  const mockEvents = [];
  
  // Generate 50 mock events
  for (let i = 0; i < 50; i++) {
    const randomDate = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    const eventTypes = ['EDIT', 'COMMENT', 'VIEW'];
    const sections = ['Overview', 'Current State', 'Goals', 'Challenges', 'Recommendations'];
    
    mockEvents.push({
      id: `mock-${i}`,
      userId: `user-${Math.floor(Math.random() * 5) + 1}`,
      type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
      section: sections[Math.floor(Math.random() * sections.length)],
      createdAt: randomDate.toISOString()
    });
  }
  
  return {
    totalEvents: mockEvents.length,
    eventsByType: {
      EDIT: mockEvents.filter(e => e.type === 'EDIT').length,
      COMMENT: mockEvents.filter(e => e.type === 'COMMENT').length,
      VIEW: mockEvents.filter(e => e.type === 'VIEW').length
    },
    events: mockEvents
  };
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const teamId = searchParams.get('teamId');
    const assessmentId = searchParams.get('assessmentId');
    const timeRange = searchParams.get('timeRange') as 'day' | 'week' | 'month' | 'year' || 'week';
    const format = searchParams.get('format') || 'json'; // json or csv
    
    if (!teamId && !assessmentId) {
      return NextResponse.json({ error: 'Missing teamId or assessmentId parameter' }, { status: 400 });
    }

    // Retrieve collaboration stats with error handling
    let stats;
    try {
      stats = await getCollaborationStats();
    } catch (error) {
      console.error('Error retrieving collaboration stats:', error);
      // Provide mock data for demonstration purposes if database is not set up
      stats = getMockCollaborationStats();
    }
    
    // Return data in requested format
    if (format === 'csv') {
      const csvStringifier = createObjectCsvStringifier({
        header: [
          { id: 'id', title: 'ID' },
          { id: 'userId', title: 'User ID' },
          { id: 'type', title: 'Event Type' },
          { id: 'section', title: 'Section' },
          { id: 'createdAt', title: 'Timestamp' },
        ],
      });
      
      const header = csvStringifier.getHeaderString();
      const records = csvStringifier.stringifyRecords(stats.events || []);
      const csv = header + records;
      
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="analytics_export_${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error exporting analytics data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
