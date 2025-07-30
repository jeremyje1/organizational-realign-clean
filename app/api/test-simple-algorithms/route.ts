/**
 * Simple test for the simplified algorithm pattern
 * Tests the exact pattern requested: runAlgorithms({ dsch: calcDSCH(...), crf: calcCRF(...), lei: calcLEI(...) })
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Import the simplified algorithms directly
    const { runAlgorithms } = await import('@/lib/algorithms/simple-runner');
    
    // Test the exact pattern from requirements
    const results = await runAlgorithms(body);
    
    return NextResponse.json({
      success: true,
      message: "Simplified algorithm pattern working correctly",
      results,
      pattern: "{ dsch: calcDSCH(payload.structure), crf: calcCRF(payload.culture), lei: calcLEI(payload.licenses) }"
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Test with sample data matching the specification
    const samplePayload = {
      structure: {
        layers: 4,
        spanByMgr: [6, 8, 5, 12, 4]
      },
      culture: {
        cultureMetrics: {
          adaptability: 0.8,
          cohesion: 0.7,
          innovation: 0.9
        }
      },
      licenses: {
        leadership: 0.85,
        effectiveness: 0.75,
        impact: 0.8
      }
    };

    const { runAlgorithms } = await import('@/lib/algorithms/simple-runner');
    const results = await runAlgorithms(samplePayload);
    
    return NextResponse.json({
      success: true,
      message: "✅ Simplified Algorithm Pattern Test Successful",
      samplePayload,
      results,
      explanation: "This matches the exact pattern specified: runAlgorithms returning { dsch, crf, lei }"
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
