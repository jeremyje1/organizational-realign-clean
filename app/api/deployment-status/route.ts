// app/api/deployment-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

// Configure this endpoint to always be dynamic
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const results = {
    status: 'ok',
    environment: process.env.NODE_ENV,
    domain: process.env.NEXT_PUBLIC_DOMAIN || 'northpathstrategies.org',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://app.northpathstrategies.org',
    timestamp: new Date().toISOString(),
    services: {
      api: { status: 'ok', latency: 0 },
      database: { status: 'unknown', message: '', latency: 0 },
      supabase: { status: 'unknown', message: '', latency: 0 },
      socket: { status: 'unknown', message: '', latency: 0 },
      auth: { status: 'unknown', message: '', latency: 0 },
    },
    features: {
      analytics: { status: 'unknown', message: '' },
      realTimeCollaboration: { status: 'unknown', message: '' },
      aiAnalysis: { status: 'unknown', message: '' },
    }
  };

  // Check database connectivity
  const dbStartTime = Date.now();
  try {
    const prisma = new PrismaClient();
    await prisma.$connect();
    
    // Try a simple query to ensure connection works
    await prisma.$queryRaw`SELECT 1 as connected`;
    
    results.services.database = { 
      status: 'ok', 
      message: 'Connected successfully', 
      latency: Date.now() - dbStartTime 
    };
    
    // Check if CollaborationEvent table exists
    try {
      await prisma.$queryRaw`SELECT COUNT(*) FROM "CollaborationEvent"`;
      results.features.analytics.status = 'ok';
      results.features.analytics.message = 'Analytics tables available';
    } catch {
      results.features.analytics.status = 'warning';
      results.features.analytics.message = 'Analytics tables not found or not accessible';
    }
    
    await prisma.$disconnect();
  } catch (error) {
    results.services.database = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown database error',
      latency: Date.now() - dbStartTime
    };
  }

  // Check Supabase connectivity
  const supabaseStartTime = Date.now();
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { data: _data, error } = await supabase.from('questions').select('id').limit(1);
    
    if (error) {
      throw error;
    }
    
    results.services.supabase = {
      status: 'ok',
      message: 'Connected successfully',
      latency: Date.now() - supabaseStartTime
    };
  } catch (error) {
    results.services.supabase = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown Supabase error',
      latency: Date.now() - supabaseStartTime
    };
  }

  // Check Socket.IO availability
  try {
    const socketPath = '/api/socket';
    const socketResponse = await fetch(new URL(socketPath, request.nextUrl.origin));
    
    if (socketResponse.ok) {
      results.services.socket = {
        status: 'ok',
        message: 'Socket.IO endpoint available',
        latency: 0
      };
      results.features.realTimeCollaboration = {
        status: 'ok',
        message: 'Real-time collaboration should be available'
      };
    } else {
      results.services.socket = {
        status: 'warning',
        message: `Socket.IO endpoint returned status ${socketResponse.status}`,
        latency: 0
      };
    }
  } catch (error) {
    results.services.socket = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Socket.IO check failed',
      latency: 0
    };
  }

  // Check AI analysis endpoint
  try {
    const aiPath = '/api/analysis/ai-enhanced?assessmentId=test';
    const aiResponse = await fetch(new URL(aiPath, request.nextUrl.origin));
    
    // Even a 404 is okay, it means the endpoint exists but needs a valid assessmentId
    if (aiResponse.status !== 500) {
      results.features.aiAnalysis = {
        status: 'ok',
        message: 'AI analysis endpoint available'
      };
    } else {
      results.features.aiAnalysis = {
        status: 'warning',
        message: `AI analysis endpoint returned status ${aiResponse.status}`
      };
    }
  } catch (error) {
    results.features.aiAnalysis = {
      status: 'error',
      message: error instanceof Error ? error.message : 'AI analysis check failed'
    };
  }

  // Calculate overall API latency
  results.services.api.latency = Date.now() - startTime;
  
  return NextResponse.json(results);
}
