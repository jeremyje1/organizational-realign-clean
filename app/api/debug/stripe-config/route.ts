import { NextRequest, NextResponse } from 'next/server';
import { STRIPE_TIER_MAPPINGS } from '@/lib/stripe-tier-mapping';

function mask(v?: string, keep: number = 6) {
  if (!v) return 'NOT_SET';
  if (v.length <= keep) return '*'.repeat(v.length);
  return v.slice(0,2) + '***' + v.slice(-keep);
}

export async function GET(_request: NextRequest) {
  try {
    const debug = {
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      required: {
        STRIPE_SECRET_KEY: mask(process.env.STRIPE_SECRET_KEY),
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: mask(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
        STRIPE_WEBHOOK_SECRET: mask(process.env.STRIPE_WEBHOOK_SECRET),
    STRIPE_PRICE_EXPRESS_99: process.env.STRIPE_PRICE_EXPRESS_99 ? 'SET' : 'NOT_SET',
    STRIPE_PRICE_MONTHLY_149: process.env.STRIPE_PRICE_MONTHLY_149 ? 'SET' : 'NOT_SET',
  STRIPE_PRICE_ENTERPRISE: process.env.STRIPE_PRICE_ENTERPRISE ? 'SET' : 'NOT_SET',
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'NOT_SET'
      },
      legacyPriceEnvVars: {
        STRIPE_BASIC_PRICE_ID: process.env.STRIPE_BASIC_PRICE_ID ? 'SET' : 'NOT_SET',
        STRIPE_MONTHLY_SUBSCRIPTION_PRICE_ID: process.env.STRIPE_MONTHLY_SUBSCRIPTION_PRICE_ID ? 'SET' : 'NOT_SET'
      },
      mappingSnapshot: Object.fromEntries(Object.entries(STRIPE_TIER_MAPPINGS).map(([k,m]) => [k, { priceId: m.stripePriceId, mode: m.stripeMode, tierPrice: m.tierPrice } ])),
      readiness: {
  expressConfigured: !!process.env.STRIPE_PRICE_EXPRESS_99,
  monthlyConfigured: !!process.env.STRIPE_PRICE_MONTHLY_149,
  enterpriseConfigured: !!process.env.STRIPE_PRICE_ENTERPRISE,
        hasSecret: !!process.env.STRIPE_SECRET_KEY,
        hasPublishable: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET
      }
    };

    return NextResponse.json(debug, { status: 200 });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Debug endpoint failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
