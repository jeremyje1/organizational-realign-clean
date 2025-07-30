import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { AssessmentDB } from '../../../../lib/assessment-db';
import EmailNotifications from '../../../../lib/email-notifications';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    console.error('No Stripe signature found');
    return NextResponse.json({ error: 'No signature provided' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }
      
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      }
      
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentFailed(paymentIntent);
        break;
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout session completed:', session.id);
  
  const { metadata, customer_email, amount_total } = session;
  
  if (!metadata?.assessmentId || !metadata?.plan) {
    console.error('Missing required metadata in checkout session');
    return;
  }

  try {
    // Handle new customers vs existing assessments
    if (metadata.isNewCustomer === 'true') {
      // For new customers, the assessment will be created by the success page
      console.log('New customer payment completed, assessment will be created by success page');
      
      // Send welcome email for new customers
      if (customer_email) {
        try {
          await EmailNotifications.sendNewCustomerWelcome(
            { email: customer_email, name: metadata.customerName || '' },
            metadata.plan,
            session.id
          );
        } catch (emailError) {
          console.error('Failed to send welcome email:', emailError);
        }
      }
    } else {
      // For existing assessments, update with premium status
      const updatedAssessment = await AssessmentDB.updateAssessmentPremium(
        metadata.assessmentId,
        metadata.plan,
        {
          stripeSessionId: session.id,
          stripeCustomerId: session.customer as string,
          paymentAmount: amount_total || 0,
          paymentStatus: 'completed',
          paidAt: new Date(),
          customerEmail: customer_email || '',
        }
      );

      console.log('Assessment updated with premium status:', updatedAssessment?.id);
    }

    // Trigger AI analysis generation for premium plans
    if (metadata.plan !== 'basic') {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/analysis/ai-enhanced`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            assessmentId: metadata.assessmentId,
            priority: 'high' // Mark as high priority for paid customers
          }),
        });
        
        console.log('AI analysis generation triggered for assessment:', metadata.assessmentId);
      } catch (aiError) {
        console.error('Failed to trigger AI analysis:', aiError);
      }
    }

    // Send confirmation email to customer
    if (customer_email) {
      try {
        await EmailNotifications.sendPremiumUpgradeConfirmation(
          { email: customer_email, name: metadata.customerName || '' },
          metadata.plan,
          metadata.assessmentId
        );
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
      }
    }

    // Log successful upgrade for analytics
    console.log(`Premium upgrade completed: ${metadata.plan} for assessment ${metadata.assessmentId}`);

  } catch (error) {
    console.error('Error handling checkout session completion:', error);
    throw error;
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment intent succeeded:', paymentIntent.id);
  
  // Additional payment processing if needed
  const { metadata } = paymentIntent;
  
  if (metadata?.assessmentId) {
    try {
      // Update any additional payment tracking
      console.log(`Payment confirmed for assessment: ${metadata.assessmentId}`);
    } catch (error) {
      console.error('Error updating payment tracking:', error);
    }
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment intent failed:', paymentIntent.id);
  
  const { metadata, last_payment_error } = paymentIntent;
  
  if (metadata?.assessmentId) {
    try {
      // Log payment failure and potentially notify customer
      console.error(`Payment failed for assessment ${metadata.assessmentId}:`, last_payment_error?.message);
      
      // Could implement retry logic or customer notification here
    } catch (error) {
      console.error('Error handling payment failure:', error);
    }
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Invoice payment succeeded:', invoice.id);
  
  // Handle recurring payments or enterprise billing
  const { metadata, customer_email: _customer_email } = invoice;
  
  if (metadata?.assessmentId) {
    try {
      // Update subscription status or enterprise features
      console.log(`Invoice paid for assessment: ${metadata.assessmentId}`);
    } catch (error) {
      console.error('Error handling invoice payment:', error);
    }
  }
}