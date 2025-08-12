import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

// Simple guard to prevent accidental execution in prod
function assertBootstrapEnabled(req: NextRequest) {
  if (process.env.STRIPE_BOOTSTRAP_ENABLED !== 'true') {
    throw new Error('Bootstrap disabled. Set STRIPE_BOOTSTRAP_ENABLED=true to allow.');
  }
  const adminKey = req.headers.get('x-admin-key');
  if (!adminKey || adminKey !== process.env.ADMIN_API_KEY) {
    throw new Error('Unauthorized: missing or invalid admin key');
  }
}

async function ensureProduct(params: { name: string; slug: string; description: string; metadata?: Record<string, string> }) {
  // Try to find by metadata.slug
  const products = await stripe.products.list({ limit: 100, active: true });
  const existing = products.data.find(p => (p.metadata as any)?.slug === params.slug);
  if (existing) return existing;
  return await stripe.products.create({
    name: params.name,
    description: params.description,
    metadata: { slug: params.slug, app: 'organizational-realign-v2', ...(params.metadata || {}) },
  });
}

async function ensurePrice(args: {
  productId: string;
  lookup_key: string;
  unit_amount: number; // in cents
  currency: string;
  recurring?: { interval: 'month' | 'year' };
  nickname: string;
}) {
  // Look among product prices for a matching lookup_key first
  const prices = await stripe.prices.list({ product: args.productId, limit: 100, active: true });
  const byLookup = prices.data.find(p => p.lookup_key === args.lookup_key);
  if (byLookup) return byLookup;

  // Fallback: try to find by exact amount + currency + recurring interval
  const byAmount = prices.data.find(p =>
    (p.unit_amount || 0) === args.unit_amount &&
    p.currency === args.currency &&
    (!!p.recurring ? p.recurring.interval === (args.recurring?.interval || null) : !args.recurring)
  );
  if (byAmount) return byAmount;

  return await stripe.prices.create({
    product: args.productId,
    unit_amount: args.unit_amount,
    currency: args.currency,
    lookup_key: args.lookup_key,
    nickname: args.nickname,
    recurring: args.recurring,
  });
}

export async function POST(req: NextRequest) {
  try {
    assertBootstrapEnabled(req);

  // Monthly Platform – $149/month
    const monthlyProduct = await ensureProduct({
      name: 'Monthly Platform Access',
      slug: 'monthly_platform_v2',
      description: 'Monthly access with dashboards, scenarios, and collaboration',
      metadata: { tier: 'monthly-subscription' },
    });
    const monthlyPrice = await ensurePrice({
      productId: monthlyProduct.id,
      lookup_key: 'monthly_149_usd_recurring_v2',
      unit_amount: 14900,
      currency: 'usd',
      recurring: { interval: 'month' },
      nickname: 'Monthly $149',
    });

    return NextResponse.json({
      ok: true,
  products: { monthly: { id: monthlyProduct.id, name: monthlyProduct.name } },
  prices: { monthly_149: { id: monthlyPrice.id, lookup_key: monthlyPrice.lookup_key } },
      nextSteps: [
        'Set STRIPE_PRICE_MONTHLY_149 to the monthly price id returned above',
        'Unset STRIPE_BOOTSTRAP_ENABLED and redeploy',
      ],
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || 'Bootstrap failed' }, { status: 400 });
  }
}
