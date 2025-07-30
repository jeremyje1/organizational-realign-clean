// app/api/send-results-email/route.ts
// API endpoint to trigger sending results emails to clients

import { NextRequest, NextResponse } from 'next/server';
import emailNotifications from '@/lib/email-notifications';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      assessmentId,
      clientEmail,
      clientName,
      tier,
      organizationType,
      institutionName,
      analysisData,
      recommendationsPreview,
      overallScore
    } = body;

    // Validate required fields
    if (!assessmentId || !clientEmail || !tier || !organizationType || !institutionName) {
      return NextResponse.json(
        { error: 'Missing required fields: assessmentId, clientEmail, tier, organizationType, institutionName' },
        { status: 400 }
      );
    }

    console.log(`[send-results-email] Sending results email for assessment ${assessmentId} to ${clientEmail}`);

    // Send the results email
    const emailSent = await emailNotifications.sendAssessmentResults({
      clientEmail,
      clientName,
      assessmentId,
      tier,
      organizationType,
      institutionName,
      analysisData,
      recommendationsPreview,
      overallScore
    });

    if (emailSent) {
      console.log(`[send-results-email] ✅ Results email sent successfully to ${clientEmail}`);
      return NextResponse.json({
        success: true,
        message: 'Results email sent successfully',
        assessmentId,
        clientEmail
      });
    } else {
      console.error(`[send-results-email] ❌ Failed to send results email to ${clientEmail}`);
      return NextResponse.json(
        { error: 'Failed to send results email' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('[send-results-email] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET endpoint to test/trigger results emails (for development)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const assessmentId = searchParams.get('assessmentId');
  
  if (!assessmentId) {
    return NextResponse.json(
      { error: 'Missing assessmentId parameter' },
      { status: 400 }
    );
  }

  // Mock data for testing
  const mockData = {
    assessmentId,
    clientEmail: 'jeremy.estrella@gmail.com',
    clientName: 'Jeremy Estrella',
    tier: 'basic-organizational-health',
    organizationType: 'Healthcare',
    institutionName: 'Test Healthcare Organization',
    recommendationsPreview: 'Focus on improving leadership communication and operational efficiency. Consider implementing cross-functional teams to enhance collaboration.',
    overallScore: 0.75
  };

  try {
    console.log(`[send-results-email] GET request - sending test results email for ${assessmentId}`);
    
    const emailSent = await emailNotifications.sendAssessmentResults(mockData);

    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: 'Test results email sent successfully',
        data: mockData
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send test results email' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('[send-results-email] GET Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
