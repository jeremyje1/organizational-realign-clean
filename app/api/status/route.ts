import { NextResponse } from 'next/server';

// Simple health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
}
