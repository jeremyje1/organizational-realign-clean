import { NextRequest, NextResponse } from 'next/server';
import { STRIPE_TIER_MAPPINGS } from '@/lib/stripe-tier-mapping';

export async function GET(_request: NextRequest) {
  try {
    const debug = {
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      envVars: {
        STRIPE_BASIC_PRICE_ID: process.env.STRIPE_BASIC_PRICE_ID || 'NOT_SET',
        STRIPE_MONTHLY_SUBSCRIPTION_PRICE_ID: process.env.STRIPE_MONTHLY_SUBSCRIPTION_PRICE_ID || 'NOT_SET',
        STRIPE_COMPREHENSIVE_PRICE_ID: process.env.STRIPE_COMPREHENSIVE_PRICE_ID || 'NOT_SET',
        STRIPE_ENTERPRISE_PRICE_ID: process.env.STRIPE_ENTERPRISE_PRICE_ID || 'NOT_SET',
        STRIPE_TEAM_PRICE_ID: process.env.STRIPE_TEAM_PRICE_ID || 'NOT_SET',
      },
      trimmedVars: {
        STRIPE_BASIC_PRICE_ID: (process.env.STRIPE_BASIC_PRICE_ID || 'NOT_SET').trim(),
        STRIPE_MONTHLY_SUBSCRIPTION_PRICE_ID: (process.env.STRIPE_MONTHLY_SUBSCRIPTION_PRICE_ID || 'NOT_SET').trim(),
        STRIPE_COMPREHENSIVE_PRICE_ID: (process.env.STRIPE_COMPREHENSIVE_PRICE_ID || 'NOT_SET').trim(),
        STRIPE_ENTERPRISE_PRICE_ID: (process.env.STRIPE_ENTERPRISE_PRICE_ID || 'NOT_SET').trim(),
        STRIPE_TEAM_PRICE_ID: (process.env.STRIPE_TEAM_PRICE_ID || 'NOT_SET').trim(),
      },
      mappings: STRIPE_TIER_MAPPINGS
    };

    return NextResponse.json(debug, { status: 200 });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Debug endpoint failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
