import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

// Define consultation packages with your pricing structure
const CONSULTATION_PACKAGES = {
  'price_strategic_assessment': {
    name: 'Strategic Assessment',
    description: 'Comprehensive organizational analysis using proprietary DSCH algorithm',
    price: 199900, // $1,999.00 in cents
  },
  'price_transformation_planning': {
    name: 'Transformation Planning', 
    description: 'Advanced Monte-Carlo simulations and complete scenario modeling',
    price: 399900, // $3,999.00 in cents
  },
  'price_implementation_support': {
    name: 'Implementation Support',
    description: 'Full transformation partnership with hands-on coaching',
    price: 899900, // $8,999.00 in cents
  },
};

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const priceId = searchParams.get('price_id');
    const packageId = searchParams.get('package_id');

    if (!priceId || !CONSULTATION_PACKAGES[priceId as keyof typeof CONSULTATION_PACKAGES]) {
      return NextResponse.json(
        { error: 'Invalid consultation package' },
        { status: 400 }
      );
    }

    const consultationPackage = CONSULTATION_PACKAGES[priceId as keyof typeof CONSULTATION_PACKAGES];

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: consultationPackage.name,
              description: consultationPackage.description,
            },
            unit_amount: consultationPackage.price,
          },
          quantity: 1,
        },
      ],
      success_url: `${request.nextUrl.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}&package=${packageId}`,
      cancel_url: `${request.nextUrl.origin}/#consultation-packages`,
      metadata: {
        consultation_package: packageId || 'unknown',
        price_id: priceId,
      },
    });

    // Redirect to Stripe Checkout
    return NextResponse.redirect(session.url!);
  } catch (error) {
    console.error('Stripe checkout session creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
