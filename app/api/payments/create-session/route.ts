import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { AssessmentDB } from '../../../../lib/assessment-db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(request: NextRequest) {
  try {
    const { 
      assessmentId, 
      plan,
      customerEmail,
      customerName 
    } = await request.json();

    if (!assessmentId || !plan) {
      return NextResponse.json({ error: 'Assessment ID and plan are required' }, { status: 400 });
    }

    // Define pricing plans - Updated to match PACKAGES.md
    const plans = {
      'single_use': {
        priceId: 'price_1Rhdf0ELd2WOuqIWwagqCdLa', // NorthPath Organizational Assessment – Single Use
        name: 'NorthPath Assessment – Single Use',
        price: 89900, // $899.00
        features: [
          'AI-enhanced Assessment Tool access',
          'One complete assessment customized for your institution',
          'AI-generated organizational analysis report',
          'Actionable recommendations',
          'Single-use access only'
        ]
      },
      'monthly_subscription': {
        priceId: 'price_1RhdgNELd2WOuqIW9HDyggY3', // NorthPath Organizational Assessment – Monthly Subscription
        name: 'NorthPath Assessment – Monthly Subscription',
        price: 89900, // $899.00/month
        features: [
          'Unlimited access during active subscription',
          'Multiple assessments across teams/departments',
          'AI-generated report for each submission',
          'Full data export/download option',
          'Monthly progress reassessment capability'
        ]
      },
      'comprehensive': {
        priceId: 'price_1RgUduELd2WOuqIWFHobukeZ', // Comprehensive Analysis & Strategy Package
        name: 'Comprehensive Analysis & Strategy Package',
        price: 399900, // $3,999.00
        features: [
          'Unlimited tool access for 30 days',
          'Deep-dive review by NorthPath consultants',
          '1:1 virtual consulting session',
          'Executive-ready summary report with visuals',
          'Institutional benchmarking data'
        ]
      },
      'enterprise': {
        priceId: 'price_1RgUb8ELd2WOuqIWMxA0mLwz', // Enterprise Transformation Package
        name: 'Enterprise Transformation Package',
        price: 899900, // $8,999.00
        features: [
          'System-wide access to NorthPath platform',
          'Multi-campus/division data collection support',
          'Dedicated consultant for strategy & coaching',
          'Change management playbook',
          'Executive presentations & follow-up sessions'
        ]
      },
      // Legacy mappings for backward compatibility
      'basic': {
        priceId: 'price_1Rhdf0ELd2WOuqIWwagqCdLa', // Map to Single Use
        name: 'NorthPath Assessment – Single Use',
        price: 89900,
        features: ['Legacy basic plan mapped to Single Use']
      },
      'team': {
        priceId: 'price_1RgUduELd2WOuqIWFHobukeZ', // Map to Comprehensive
        name: 'Comprehensive Analysis & Strategy Package',
        price: 399900,
        features: ['Legacy team plan mapped to Comprehensive']
      }
    };

    const selectedPlan = plans[plan as keyof typeof plans];
    if (!selectedPlan) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    // For new customers, we'll create the assessment after payment
    let assessment = null;
    if (assessmentId !== 'new') {
      assessment = await AssessmentDB.findAssessmentById(assessmentId);
      if (!assessment) {
        return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
      }
    }

    // Create Stripe checkout session
    const isSubscription = plan === 'monthly_subscription';
    
    const sessionConfig: any = {
      payment_method_types: ['card'],
      customer_email: customerEmail,
      mode: isSubscription ? 'subscription' : 'payment',
      success_url: assessmentId === 'new' 
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&new_customer=true`
        : `${process.env.NEXT_PUBLIC_BASE_URL}/secure/results?session_id={CHECKOUT_SESSION_ID}&assessmentId=${assessmentId}&premium=true`,
      cancel_url: assessmentId === 'new'
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`
        : `${process.env.NEXT_PUBLIC_BASE_URL}/secure/results?assessmentId=${assessmentId}`,
      metadata: {
        assessmentId,
        plan,
        customerName: customerName || '',
        isNewCustomer: assessmentId === 'new' ? 'true' : 'false',
      },
      automatic_tax: {
        enabled: true,
      },
    };

    // Only enable invoice creation for one-time payments, not subscriptions
    if (!isSubscription) {
      sessionConfig.invoice_creation = {
        enabled: true,
      };
    }

    if (isSubscription) {
      // For subscriptions, use price_data with recurring billing
      sessionConfig.line_items = [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: selectedPlan.name,
              description: `Professional organizational analysis for assessment ${assessmentId}`,
              images: ['https://app.northpathstrategies.org/logo-stripe.png'],
            },
            unit_amount: selectedPlan.price,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ];
    } else {
      // For one-time payments
      sessionConfig.line_items = [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: selectedPlan.name,
              description: `Professional organizational analysis for assessment ${assessmentId}`,
              images: ['https://app.northpathstrategies.org/logo-stripe.png'],
            },
            unit_amount: selectedPlan.price,
          },
          quantity: 1,
        },
      ];
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      plan: selectedPlan
    });

  } catch (error) {
    console.error('Payment session creation error:', error);
    return NextResponse.json({ 
      error: 'Failed to create payment session',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Handle successful payments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === 'paid') {
      const { assessmentId, plan } = session.metadata || {};
      
      if (assessmentId) {
        // Update assessment with premium status
        await AssessmentDB.updateAssessmentPremium(assessmentId, plan);
        
        // Trigger premium analysis generation
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/analysis/ai-enhanced`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ assessmentId }),
        });
      }
    }

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        paymentStatus: session.payment_status,
        customerEmail: session.customer_email,
        amountTotal: session.amount_total,
        metadata: session.metadata
      }
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ 
      error: 'Failed to verify payment',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
