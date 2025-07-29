// app/api/analytics/team-collaboration/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

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
    const timeRange = searchParams.get('timeRange') || 'week'; // week, month, year
    
    if (!teamId && !assessmentId) {
      return NextResponse.json({ error: 'Missing teamId or assessmentId parameter' }, { status: 400 });
    }

    // Get the date range based on timeRange
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7); // Default to week
    }

    // Try to query collaborative events from the database
    let collaborativeEvents = [];
    try {
      collaborativeEvents = await prisma.collaborationEvent.findMany({
        where: {
          ...(teamId ? { teamId } : {}),
          ...(assessmentId ? { assessmentId } : {}),
          createdAt: {
            gte: startDate,
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      });
    } catch (error) {
      console.error('Error querying collaboration events:', error);
      // If there's an error (e.g., table doesn't exist yet), we'll use mock data
      collaborativeEvents = [];
    }

    // Process data for different analytics views
    // If no events found, use mock data for demonstration purposes
    const analyticsData = collaborativeEvents.length > 0 
      ? processAnalyticsData(collaborativeEvents)
      : getMockAnalyticsData();
    
    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Error fetching collaboration analytics:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Mock data generator for demonstration or when database is not yet set up
function getMockAnalyticsData() {
  return {
    userActivity: [
      { name: 'John D.', edits: 23, comments: 15, views: 42 },
      { name: 'Emma S.', edits: 18, comments: 32, views: 37 },
      { name: 'Michael R.', edits: 29, comments: 8, views: 31 },
      { name: 'Sophia L.', edits: 12, comments: 27, views: 45 },
      { name: 'Daniel K.', edits: 15, comments: 19, views: 28 },
    ],
    activityTimeline: [
      { date: 'Mon', edits: 15, comments: 8, views: 23 },
      { date: 'Tue', edits: 22, comments: 17, views: 32 },
      { date: 'Wed', edits: 18, comments: 23, views: 45 },
      { date: 'Thu', edits: 29, comments: 15, views: 36 },
      { date: 'Fri', edits: 32, comments: 24, views: 42 },
      { date: 'Sat', edits: 12, comments: 8, views: 18 },
      { date: 'Sun', edits: 9, comments: 6, views: 15 },
    ],
    collaborationDistribution: [
      { name: 'Edits', value: 137 },
      { name: 'Comments', value: 101 },
      { name: 'Views', value: 221 },
    ],
    sectionActivity: [
      { name: 'Overview', edits: 23, comments: 18, views: 45 },
      { name: 'Current State', edits: 31, comments: 24, views: 42 },
      { name: 'Goals', edits: 18, comments: 15, views: 37 },
      { name: 'Challenges', edits: 42, comments: 29, views: 53 },
      { name: 'Recommendations', edits: 28, comments: 22, views: 49 },
    ],
    timeSpent: [
      { name: 'Overview', value: 45 },
      { name: 'Current State', value: 83 },
      { name: 'Goals', value: 37 },
      { name: 'Challenges', value: 72 },
      { name: 'Recommendations', value: 65 },
    ],
    activeHours: Array(24).fill(0).map((_, i) => ({ hour: `${i}:00`, count: Math.floor(Math.random() * 30) })),
    totalEvents: 459
  };
}

function processAnalyticsData(events: any[]) {
  // User Activity: Counts of edits, comments, and views by user
  const userActivityMap = new Map();
  
  // Activity Timeline: Events over time
  const timelineMap = new Map();
  
  // Section Activity: Activity by section
  const sectionActivityMap = new Map();
  
  // Collaboration Distribution: Total counts by event type
  const distributionCounts = {
    edits: 0,
    comments: 0,
    views: 0,
  };

  // Process each event
  events.forEach(event => {
    const userName = event.user?.name || 'Unknown User';
    const shortName = userName.split(' ').map((part: string) => `${part.charAt(0)}.`).join(' ');
    const date = new Date(event.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
    const section = event.section || 'General';
    
    // Process user activity
    if (!userActivityMap.has(userName)) {
      userActivityMap.set(userName, { 
        name: shortName, 
        edits: 0, 
        comments: 0, 
        views: 0 
      });
    }
    
    // Process timeline
    if (!timelineMap.has(date)) {
      timelineMap.set(date, { 
        date, 
        edits: 0, 
        comments: 0, 
        views: 0 
      });
    }
    
    // Process section activity
    if (!sectionActivityMap.has(section)) {
      sectionActivityMap.set(section, { 
        name: section, 
        edits: 0, 
        comments: 0, 
        views: 0 
      });
    }
    
    // Increment counts based on event type
    const userActivity = userActivityMap.get(userName);
    const timelineActivity = timelineMap.get(date);
    const sectionActivity = sectionActivityMap.get(section);
    
    switch (event.type) {
      case 'EDIT':
        userActivity.edits++;
        timelineActivity.edits++;
        sectionActivity.edits++;
        distributionCounts.edits++;
        break;
      case 'COMMENT':
        userActivity.comments++;
        timelineActivity.comments++;
        sectionActivity.comments++;
        distributionCounts.comments++;
        break;
      case 'VIEW':
        userActivity.views++;
        timelineActivity.views++;
        sectionActivity.views++;
        distributionCounts.views++;
        break;
    }
  });

  // Convert maps to arrays for the frontend
  const userActivity = Array.from(userActivityMap.values());
  const activityTimeline = Array.from(timelineMap.values());
  const sectionActivity = Array.from(sectionActivityMap.values());
  
  // Format collaboration distribution for pie chart
  const collaborationDistribution = [
    { name: 'Edits', value: distributionCounts.edits },
    { name: 'Comments', value: distributionCounts.comments },
    { name: 'Views', value: distributionCounts.views },
  ];

  // Calculate active times
  const activeHours = calculateActiveHours(events);
  
  return {
    userActivity,
    activityTimeline,
    sectionActivity,
    collaborationDistribution,
    activeHours,
    totalEvents: events.length,
  };
}

function calculateActiveHours(events: any[]) {
  const hourCounts = Array(24).fill(0);
  
  events.forEach(event => {
    const hour = new Date(event.createdAt).getHours();
    hourCounts[hour]++;
  });
  
  return hourCounts.map((count, hour) => ({
    hour: `${hour}:00`,
    count,
  }));
}
