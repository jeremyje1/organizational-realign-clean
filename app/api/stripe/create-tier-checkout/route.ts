import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getStripeMappingForTier, STRIPE_TIER_MAPPINGS } from '@/lib/stripe-tier-mapping';
import { PricingTier } from '@/lib/tierConfiguration';
import { normalizeTier } from '@/lib/tierUtils';
import { parseAttributionCookie, flattenAttribution } from '@/lib/attribution';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
  const requestedTier = searchParams.get('tier') as PricingTier;
    const customerEmail = searchParams.get('customer_email');
    const successUrl = searchParams.get('success_url');
    const cancelUrl = searchParams.get('cancel_url');

  if (!requestedTier || !STRIPE_TIER_MAPPINGS[requestedTier]) {
      return NextResponse.json(
        { error: 'Invalid or missing tier specified' },
        { status: 400 }
      );
    }
  const norm = normalizeTier(requestedTier);
  const effectiveTier = norm.normalizedTier;
  const mapping = getStripeMappingForTier(effectiveTier);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://app.northpathstrategies.org';

  // Validation: ensure price ID configured
  if (mapping.stripePriceId.includes('PLACEHOLDER')) {
      return NextResponse.json({
        error: 'Stripe price ID not configured for tier',
        tier: effectiveTier,
        message: `Configure server env var for ${effectiveTier} (expected STRIPE_PRICE_* e.g. STRIPE_PRICE_EXPRESS_99) before creating checkout.`
      }, { status: 500 });
    }

    // Optional price sanity check (one-time payments)
    let useDynamicPriceData = false;
    try {
      if (mapping.stripeMode === 'payment') {
        const priceObj = await stripe.prices.retrieve(mapping.stripePriceId);
        const unit = (priceObj.unit_amount || 0) / 100;
        if (unit !== mapping.tierPrice) {
          console.warn('[Stripe Price Mismatch]', { tier: effectiveTier, configured: mapping.tierPrice, stripePrice: unit, priceId: mapping.stripePriceId });
          // Fallback: generate price_data line item to force expected amount (prevents $2,495 legacy price showing for $99 tier)
          useDynamicPriceData = true;
        }
      }
    } catch (e) {
      console.warn('Unable to verify Stripe price amount – proceeding with configured price id', e);
    }

  // Attribution (first-touch) flatten
  const attribution = flattenAttribution(parseAttributionCookie());

  // Create Stripe checkout session with tier-specific configuration
    const sessionConfig: any = {
      mode: mapping.stripeMode,
      payment_method_types: ['card'],
      line_items: useDynamicPriceData ? [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: mapping.tierName },
            unit_amount: mapping.tierPrice * 100
          },
          quantity: 1
        }
      ] : [
        {
          price: mapping.stripePriceId,
          quantity: 1
        }
      ],
      success_url: successUrl || `${baseUrl}${mapping.successRedirect}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${baseUrl}${mapping.cancelRedirect}`,
      metadata: {
        tier: effectiveTier,
        original_tier: norm.isLegacy ? norm.tier : undefined,
        tier_name: mapping.tierName,
        tier_price: mapping.tierPrice.toString(),
        purchased_at: new Date().toISOString(),
    legacy_normalized: norm.isLegacy ? 'true' : 'false',
    ...(attribution ? Object.fromEntries(Object.entries(attribution).map(([k,v]) => [`attr_${k}`, String(v)])) : {})
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
      tier: effectiveTier,
      original_tier: norm.isLegacy ? norm.tier : undefined,
      tier_name: mapping.tierName,
      legacy_normalized: norm.isLegacy ? 'true' : 'false',
      ...(attribution ? Object.fromEntries(Object.entries(attribution).map(([k,v]) => [`attr_${k}`, String(v)])) : {})
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    // Log the checkout session creation for tracking
    console.log(`Stripe checkout session created for tier: ${effectiveTier}`, {
      sessionId: session.id,
      tier: effectiveTier,
      original_tier: norm.isLegacy ? norm.tier : undefined,
      priceId: mapping.stripePriceId,
      mode: mapping.stripeMode,
      amount: mapping.tierPrice,
      legacy_normalized: norm.isLegacy
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
  const { tier: bodyTier, customerEmail, customerName, successUrl, cancelUrl } = await request.json();

  if (!bodyTier || !STRIPE_TIER_MAPPINGS[bodyTier as PricingTier]) {
      return NextResponse.json(
        { error: 'Invalid or missing tier specified' },
        { status: 400 }
      );
    }
  const norm = normalizeTier(bodyTier as PricingTier);
  const effectiveTier = norm.normalizedTier;
  const mapping = getStripeMappingForTier(effectiveTier as PricingTier);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://app.northpathstrategies.org';

  if (mapping.stripePriceId.includes('PLACEHOLDER')) {
      return NextResponse.json({
        error: 'Stripe price ID not configured for tier',
        tier: effectiveTier,
        message: `Configure server env var for ${effectiveTier} (expected STRIPE_PRICE_* e.g. STRIPE_PRICE_EXPRESS_99) before creating checkout.`
      }, { status: 500 });
    }

    let useDynamicPriceData = false;
    try {
      if (mapping.stripeMode === 'payment') {
        const priceObj = await stripe.prices.retrieve(mapping.stripePriceId);
        const unit = (priceObj.unit_amount || 0) / 100;
        if (unit !== mapping.tierPrice) {
          console.warn('[Stripe Price Mismatch]', { tier: effectiveTier, configured: mapping.tierPrice, stripePrice: unit, priceId: mapping.stripePriceId });
          useDynamicPriceData = true;
        }
      }
    } catch (e) {
      console.warn('Unable to verify Stripe price amount – proceeding with configured price id', e);
    }

  const attribution = flattenAttribution(parseAttributionCookie());

  const sessionConfig: any = {
      mode: mapping.stripeMode,
      payment_method_types: ['card'],
      line_items: useDynamicPriceData ? [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: mapping.tierName },
            unit_amount: mapping.tierPrice * 100
          },
          quantity: 1
        }
      ] : [
        {
          price: mapping.stripePriceId,
          quantity: 1
        }
      ],
      success_url: successUrl || `${baseUrl}${mapping.successRedirect}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${baseUrl}${mapping.cancelRedirect}`,
      metadata: {
        tier: effectiveTier,
        original_tier: norm.isLegacy ? norm.tier : undefined,
        tier_name: mapping.tierName,
        tier_price: mapping.tierPrice.toString(),
        customer_name: customerName || '',
        purchased_at: new Date().toISOString(),
    legacy_normalized: norm.isLegacy ? 'true' : 'false',
    ...(attribution ? Object.fromEntries(Object.entries(attribution).map(([k,v]) => [`attr_${k}`, String(v)])) : {})
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
          tier: effectiveTier,
          original_tier: norm.isLegacy ? norm.tier : undefined,
            tier_name: mapping.tierName,
            customer_name: customerName || '',
      legacy_normalized: norm.isLegacy ? 'true' : 'false',
      ...(attribution ? Object.fromEntries(Object.entries(attribution).map(([k,v]) => [`attr_${k}`, String(v)])) : {})
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
  tier: effectiveTier,
  original_tier: norm.isLegacy ? norm.tier : undefined,
  tierName: mapping.tierName,
  tierPrice: mapping.tierPrice,
  legacy_normalized: norm.isLegacy
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
