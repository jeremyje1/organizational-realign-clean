import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { STRIPE_TIER_MAPPINGS } from '@/lib/stripe-tier-mapping';

/**
 * Verifies that configured Stripe price IDs exist and match expected amounts.
 * NEVER expose full price data publicly in production (leave route protected / remove before GA if needed).
 */
export async function GET(req: NextRequest) {
  try {
    // Simple admin guard
    const adminKey = req.headers.get('x-admin-key');
    if (!process.env.ADMIN_API_KEY || !adminKey || adminKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const results: any[] = [];
    for (const [tier, mapping] of Object.entries(STRIPE_TIER_MAPPINGS)) {
      if (mapping.stripePriceId.includes('PLACEHOLDER')) {
        results.push({ tier, status: 'MISSING', message: 'Placeholder price ID' });
        continue;
      }
      try {
        const price = await stripe.prices.retrieve(mapping.stripePriceId);
        const unit = (price.unit_amount || 0) / 100;
        const currency = price.currency;
        const ok = unit === mapping.tierPrice;
        results.push({
          tier,
            priceId: mapping.stripePriceId,
          expected: mapping.tierPrice,
          actual: unit,
          currency,
          match: ok,
          mode: mapping.stripeMode,
          product: price.product,
          type: price.type
        });
      } catch (e: any) {
        results.push({ tier, status: 'ERROR', error: e.message || 'Failed to retrieve price' });
      }
    }

    const mismatches = results.filter(r => r.match === false).length;
    return NextResponse.json({ ok: mismatches === 0, mismatches, results }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Verification failed', details: error instanceof Error ? error.message : 'Unknown' }, { status: 500 });
  }
}
