/**
 * Stripe Tier Mapping Configuration
 * Maps tier configuration to Stripe pricing and redirects
 * 
 * @version 1.0.3
 * @author NorthPath Strategies
 */

import { PricingTier, PRICING_TIERS } from './tierConfiguration';

export interface StripeTierMapping {
  tierKey: PricingTier;
  stripeProductId: string;
  stripePriceId: string;
  stripeMode: 'payment' | 'subscription';
  successRedirect: string;
  cancelRedirect: string;
  tierName: string;
  tierPrice: number;
}

export const STRIPE_TIER_MAPPINGS: Record<PricingTier, StripeTierMapping> = {
  // Organizational Assessment Tiers (AI Blueprint has separate mapping)
  'one-time-diagnostic': {
    tierKey: 'one-time-diagnostic',
    stripeProductId: 'prod_org_diagnostic',
    stripePriceId: 'price_1Rhdf0ELd2WOuqIWwagqCdLa',
    stripeMode: 'payment',
    successRedirect: '/assessment/tier-based?tier=one-time-diagnostic&assessment_type=organizational',
    cancelRedirect: '/pricing',
    tierName: 'One-Time Diagnostic',
    tierPrice: 4995
  },
  'express-diagnostic': {
    tierKey: 'express-diagnostic',
    stripeProductId: 'prod_org_express',
    stripePriceId: 'price_1RmCmsELd2WOuqIWeM0rb7Gx',
    stripeMode: 'payment',
    successRedirect: '/assessment/tier-based?tier=express-diagnostic&assessment_type=organizational',
    cancelRedirect: '/pricing',
    tierName: 'Express Diagnostic',
    tierPrice: 2495
  },
  'monthly-subscription': {
    tierKey: 'monthly-subscription',
    stripeProductId: 'prod_org_monthly',
    stripePriceId: 'price_1RhdgNELd2WOuqIW9HDyggY3',
    stripeMode: 'subscription',
    successRedirect: '/assessment/tier-based?tier=monthly-subscription&assessment_type=organizational',
    cancelRedirect: '/pricing',
    tierName: 'Monthly Subscription',
    tierPrice: 2995
  },
  'comprehensive-package': {
    tierKey: 'comprehensive-package',
    stripeProductId: 'prod_org_comprehensive',
    stripePriceId: 'price_1RgUduELd2WOuqIWFHobukeZ',
    stripeMode: 'payment',
    successRedirect: '/assessment/tier-based?tier=comprehensive-package&assessment_type=organizational',
    cancelRedirect: '/pricing',
    tierName: 'Comprehensive Package',
    tierPrice: 9900
  },
  'enterprise-transformation': {
    tierKey: 'enterprise-transformation',
    stripeProductId: 'prod_org_enterprise',
    stripePriceId: 'price_1Ro4vNELd2WOuqIWHx9dKp3M',
    stripeMode: 'payment',
    successRedirect: '/assessment/tier-based?tier=enterprise-transformation&assessment_type=organizational',
    cancelRedirect: '/pricing',
    tierName: 'Enterprise Transformation',
    tierPrice: 24000
  }
};

/**
 * Cache-busting function to ensure Vercel uses the latest file.
 * @returns {string} The current version of the mapping file.
 */
export function getMappingVersion(): string {
  return '1.0.3';
}

/**
 * Get Stripe mapping for a specific tier
 */
export function getStripeMappingForTier(tier: PricingTier): StripeTierMapping {
  return STRIPE_TIER_MAPPINGS[tier];
}

/**
 * Get tier from Stripe price ID
 */
export function getTierFromStripePriceId(priceId: string): PricingTier | null {
  const mapping = Object.values(STRIPE_TIER_MAPPINGS).find(
    mapping => mapping.stripePriceId === priceId
  );
  return mapping?.tierKey || null;
}

/**
 * Validate that user has access to tier-specific features
 */
export function validateTierAccess(userTier: PricingTier, requiredTier: PricingTier): boolean {
  // Organizational assessment tier hierarchy
  const orgTierHierarchy: PricingTier[] = [
    'one-time-diagnostic',
    'monthly-subscription',
    'comprehensive-package',
    'enterprise-transformation'
  ];
  
  const userTierIndex = orgTierHierarchy.indexOf(userTier);
  const requiredTierIndex = orgTierHierarchy.indexOf(requiredTier);
  
  return userTierIndex !== -1 && requiredTierIndex !== -1 && userTierIndex >= requiredTierIndex;
}

/**
 * Get features available to user's tier
 */
export function getTierFeatures(tier: PricingTier) {
  return PRICING_TIERS[tier];
}

/**
 * Generate Stripe checkout URL for tier upgrade
 */
export function generateStripeCheckoutUrl(
  tier: PricingTier, 
  customerEmail?: string,
  successUrl?: string,
  cancelUrl?: string
): string {
  const mapping = getStripeMappingForTier(tier);
  // Get base URL from environment or use current request origin as fallback
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                  process.env.NEXT_PUBLIC_APP_URL || 
                  (typeof window !== 'undefined' ? window.location.origin : 'https://app.northpathstrategies.org');
  
  const params = new URLSearchParams({
    price_id: mapping.stripePriceId,
    tier: tier,
    mode: mapping.stripeMode,
    success_url: successUrl || `${baseUrl}${mapping.successRedirect}`,
    cancel_url: cancelUrl || `${baseUrl}${mapping.cancelRedirect}`
  });
  
  if (customerEmail) {
    params.set('customer_email', customerEmail);
  }
  const checkoutPath = `/api/stripe/create-tier-checkout?${params.toString()}`;
  console.log('Generated checkout URL:', checkoutPath);
  return checkoutPath;
}
