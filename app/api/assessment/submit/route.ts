import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { cookies as nextCookies } from 'next/headers';
import {
  createServerClient,
  type CookieOptions,
} from '@supabase/ssr';
import emailNotifications from '@/lib/email-notifications';
import mockDatabaseMode from '@/lib/mock-database';
import SubscriptionManager from '@/lib/subscription-manager';
import { PricingTier } from '@/lib/tierConfiguration';

export const dynamic = 'force-dynamic';

// Handle CORS preflight requests
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

/** POST /api/assessment/submit – persists tier-based assessment data */
export async function POST(req: NextRequest) {
  try {
    console.log('[assessment/submit] Received POST request');
    console.log('[assessment/submit] Content-Type:', req.headers.get('content-type'));
    console.log('[assessment/submit] Method:', req.method);
    
    // Build a fresh Supabase client **inside** the request scope so that
    // the cookies helper receives the current request/response context.
    const cookieStore = nextCookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: async (name) => {
            const cookie = await cookieStore;
            return cookie.get(name)?.value;
          },
          set: async (name: string, value: string, options?: CookieOptions) => {
            const cookie = await cookieStore;
            cookie.set({ name, value, ...(options ?? {}) });
          },
          remove: async (name: string, options?: CookieOptions) => {
            const cookie = await cookieStore;
            cookie.delete({ name, ...(options ?? {}) });
          },
        },
      },
    );

    let body;
    try {
      body = await req.json();
      console.log('[assessment/submit] Successfully parsed JSON body');
    } catch (parseError) {
      console.error('[assessment/submit] Failed to parse JSON:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
        }
      );
    }
    
    // Validate required fields
    const { tier, organizationType, institutionName, responses, uploadedFiles, contactEmail, contactName, userId, testMode } = body;
    
    // Debug logging for test mode
    if (testMode) {
      console.log('Test mode assessment submission:', { tier, organizationType, userId, testMode });
    }
    
    if (!tier || !organizationType || !responses) {
      return NextResponse.json(
        { error: 'Missing required fields: tier, organizationType, and responses are required' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
        }
      );
    }

    // Check subscription access for subscription-based tiers (skip for test mode)
    if (!testMode && userId && (tier === 'monthly-subscription')) {
      console.log('Checking subscription for non-test mode:', { userId, tier });
      try {
        const canCreate = await SubscriptionManager.canCreateAssessment(userId, tier as PricingTier);
        
        if (!canCreate.allowed) {
          console.log('Subscription check failed:', canCreate);
          return NextResponse.json(
            { 
              error: 'Subscription access required',
              reason: canCreate.reason,
              requiresUpgrade: true,
              tier: tier
            },
            { 
              status: 403,
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
              }
            }
          );
        }
      } catch (subscriptionError) {
        console.error('Subscription check failed:', subscriptionError);
        // Continue with assessment creation but log the error
      }
    } else if (testMode) {
      console.log('Skipping subscription check for test mode');
    } else {
      console.log('Skipping subscription check - one-time purchase tier or no userId:', { tier, userId: !!userId });
    }

    // Prepare assessment data for the updated schema
    let assessmentResult;
    
    // Try assessments table first with the new schema
    try {
      console.log('[assessment/submit] Attempting to save to assessments table with new schema...');
      console.log('[assessment/submit] Payload:', {
        tier,
        organization_type: organizationType,
        institution_name: institutionName || 'Anonymous Institution',
        contact_email: contactEmail,
        contact_name: contactName,
        responses_count: Object.keys(responses || {}).length,
        test_mode: testMode || false
      });
      
      const assessmentPayload = {
        tier,
        organization_type: organizationType,
        institution_name: institutionName || 'Anonymous Institution',
        contact_email: contactEmail,
        contact_name: contactName,
        responses: responses,
        uploaded_files: uploadedFiles || [],
        status: 'COMPLETED',
        submitted_at: new Date().toISOString(),
        test_mode: testMode || false
      };
      
      const { data: assessmentData, error: assessmentError } = await supabase
        .from('assessments')
        .insert([assessmentPayload])
        .select()
        .single();

      if (assessmentError) {
        console.error('[assessment/submit] Assessments table error:', {
          message: assessmentError.message,
          details: assessmentError.details,
          hint: assessmentError.hint,
          code: assessmentError.code
        });
        throw new Error(`Assessment table error: ${assessmentError.message}`);
      }
      
      assessmentResult = assessmentData;
      console.log('[assessment/submit] ✅ Successfully saved to assessments table with ID:', assessmentResult.id);
      
    } catch (dbError) {
      console.log('[assessment/submit] Assessments table failed, trying surveys table...');
      console.error('Assessment table error:', dbError);
      
      try {
        // Fall back to surveys table with new schema
        const surveyPayload = {
          data: {
            tier,
            organizationType,
            institutionName: institutionName || 'Anonymous Institution',
            contactEmail,
            contactName,
            responses,
            uploadedFiles: uploadedFiles || [],
            submittedAt: new Date().toISOString()
          },
          survey_type: 'tier-based-assessment'
        };
        
        const { data: surveyData, error: surveyError } = await supabase
          .from('surveys')
          .insert([surveyPayload])
          .select()
          .single();

        if (surveyError) {
          console.log('[assessment/submit] Surveys table failed:', surveyError.message);
          throw new Error(`Survey table error: ${surveyError.message}`);
        }
        
        assessmentResult = surveyData;
        console.log('[assessment/submit] ✅ Successfully saved to surveys table');
        
      } catch (finalError) {
        console.error('[assessment/submit] All database operations failed:', finalError);
        
        // Fall back to mock mode
        console.log('[assessment/submit] Falling back to mock database mode');
        const mockResult = await mockDatabaseMode.mockAssessmentSubmission({
          tier,
          organizationType,
          institutionName: institutionName || 'Anonymous Institution',
          responses,
          uploadedFiles: uploadedFiles || []
        });
        
        return NextResponse.json(mockResult);
      }
    }

    // Database save successful - continue with normal flow

    // Send email notification to support team
    try {
      await emailNotifications.sendAssessmentSubmissionNotification({
        assessmentId: assessmentResult.id.toString(),
        tier,
        organizationType,
        institutionName: institutionName || 'Anonymous Institution',
        responseCount: Object.keys(responses).length,
        uploadedFileCount: uploadedFiles?.length || 0,
        submittedAt: new Date().toISOString()
      });
    } catch (emailError) {
      // Log email error but don't fail the submission
      console.error('[assessment/submit] Failed to send support email notification:', emailError);
    }

    // Send confirmation email to client (if email provided)
    if (contactEmail) {
      try {
        await emailNotifications.sendAssessmentConfirmation({
          clientEmail: contactEmail,
          clientName: contactName || undefined,
          assessmentId: assessmentResult.id.toString(),
          tier,
          organizationType,
          institutionName: institutionName || 'Anonymous Institution',
          responseCount: Object.keys(responses).length,
          submittedAt: new Date().toISOString()
        });
      } catch (emailError) {
        // Log email error but don't fail the submission
        console.error('[assessment/submit] Failed to send client confirmation email:', emailError);
      }
    }

    // Generate a session ID for the results
    const sessionId = `assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return NextResponse.json({ 
      success: true,
      assessmentId: assessmentResult.id,
      sessionId,
      message: 'Assessment submitted successfully',
      redirectUrl: `/assessment/results?sessionId=${sessionId}&tier=${tier}&orgType=${organizationType}`
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });

  } catch (error) {
    console.error('[assessment/submit] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    );
  }
}
