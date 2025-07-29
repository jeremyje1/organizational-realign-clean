import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { AssessmentDB, type AssessmentTier } from '@/lib/assessment-db';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, customerEmail, plan } = await request.json();

    if (!sessionId || !customerEmail) {
      return NextResponse.json({ error: 'Session ID and customer email are required' }, { status: 400 });
    }

    // Verify the Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    // Create Supabase client
    const supabase = createRouteHandlerClient({ cookies });

    // Create or get user
    let user;
    try {
      // Try to get existing user
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', customerEmail)
        .single();

      if (existingUser) {
        user = existingUser;
      } else {
        // Create new user profile
        const { data: newUser, error: userError } = await supabase
          .from('profiles')
          .insert({
            email: customerEmail,
            full_name: session.metadata?.customerName || customerEmail.split('@')[0],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (userError) {
          console.error('Error creating user:', userError);
          return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
        }

        user = newUser;
      }
    } catch (error) {
      console.error('Error handling user:', error);
      return NextResponse.json({ error: 'Failed to process user' }, { status: 500 });
    }

    // Create assessment
    try {
      // Map plan to AssessmentTier
      const tierMapping: Record<string, AssessmentTier> = {
        'basic': 'INDIVIDUAL',
        'team': 'TEAM', 
        'enterprise': 'ENTERPRISE'
      };
      
      const assessment = await AssessmentDB.createAssessment({
        userId: user.id,
        tier: tierMapping[plan] || 'INDIVIDUAL',
        stripeSessionId: sessionId,
        stripeCustomerId: session.customer as string,
      });

      // Create default organization for the user
      const { error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: `${user.full_name}'s Organization`,
          type: 'university',
          assessment_id: assessment.id,
          created_by: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (orgError) {
        console.warn('Error creating default organization:', orgError);
      }

      return NextResponse.json({
        success: true,
        assessment: {
          id: assessment.id,
          status: assessment.status,
          tier: assessment.tier
        },
        user: {
          id: user.id,
          email: user.email,
          name: user.full_name
        }
      });

    } catch (error) {
      console.error('Error creating assessment:', error);
      return NextResponse.json({ error: 'Failed to create assessment' }, { status: 500 });
    }

  } catch (error) {
    console.error('Create assessment from payment error:', error);
    return NextResponse.json(
      { error: 'Failed to create assessment from payment' },
      { status: 500 }
    );
  }
}
