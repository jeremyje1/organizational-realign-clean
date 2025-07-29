import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getStripeMappingForTier, STRIPE_TIER_MAPPINGS } from '@/lib/stripe-tier-mapping';
import { PricingTier } from '@/lib/tierConfiguration';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tier = searchParams.get('tier') as PricingTier;
    const customerEmail = searchParams.get('customer_email');
    const successUrl = searchParams.get('success_url');
    const cancelUrl = searchParams.get('cancel_url');

    if (!tier || !STRIPE_TIER_MAPPINGS[tier]) {
      return NextResponse.json(
        { error: 'Invalid or missing tier specified' },
        { status: 400 }
      );
    }

    const mapping = getStripeMappingForTier(tier);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://app.northpathstrategies.org';

    // Create Stripe checkout session with tier-specific configuration
    const sessionConfig: any = {
      mode: mapping.stripeMode,
      payment_method_types: ['card'],
      line_items: [
        {
          price: mapping.stripePriceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${baseUrl}${mapping.successRedirect}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${baseUrl}${mapping.cancelRedirect}`,
      metadata: {
        tier: tier,
        tier_name: mapping.tierName,
        tier_price: mapping.tierPrice.toString(),
        purchased_at: new Date().toISOString(),
      },
      automatic_tax: {
        enabled: true,
      },
      invoice_creation: mapping.stripeMode === 'payment' ? {
        enabled: true,
      } : undefined,
    };

    // Set customer email if provided
    if (customerEmail) {
      sessionConfig.customer_email = customerEmail;
    }

    // Add subscription-specific configuration
    if (mapping.stripeMode === 'subscription') {
      sessionConfig.subscription_data = {
        metadata: {
          tier: tier,
          tier_name: mapping.tierName,
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    // Log the checkout session creation for tracking
    console.log(`Stripe checkout session created for tier: ${tier}`, {
      sessionId: session.id,
      tier: tier,
      priceId: mapping.stripePriceId,
      mode: mapping.stripeMode,
      amount: mapping.tierPrice,
    });

    // Redirect to Stripe Checkout
    return NextResponse.redirect(session.url!);
    
  } catch (error) {
    console.error('Stripe tier checkout session creation failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { tier, customerEmail, customerName, successUrl, cancelUrl } = await request.json();

    if (!tier || !STRIPE_TIER_MAPPINGS[tier as PricingTier]) {
      return NextResponse.json(
        { error: 'Invalid or missing tier specified' },
        { status: 400 }
      );
    }

    const mapping = getStripeMappingForTier(tier as PricingTier);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://app.northpathstrategies.org';

    const sessionConfig: any = {
      mode: mapping.stripeMode,
      payment_method_types: ['card'],
      line_items: [
        {
          price: mapping.stripePriceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${baseUrl}${mapping.successRedirect}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${baseUrl}${mapping.cancelRedirect}`,
      metadata: {
        tier: tier,
        tier_name: mapping.tierName,
        tier_price: mapping.tierPrice.toString(),
        customer_name: customerName || '',
        purchased_at: new Date().toISOString(),
      },
      automatic_tax: {
        enabled: true,
      },
      invoice_creation: mapping.stripeMode === 'payment' ? {
        enabled: true,
      } : undefined,
    };

    if (customerEmail) {
      sessionConfig.customer_email = customerEmail;
    }

    if (mapping.stripeMode === 'subscription') {
      sessionConfig.subscription_data = {
        metadata: {
          tier: tier,
          tier_name: mapping.tierName,
          customer_name: customerName || '',
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      tier: tier,
      tierName: mapping.tierName,
      tierPrice: mapping.tierPrice,
    });

  } catch (error) {
    console.error('Stripe tier checkout session creation failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
