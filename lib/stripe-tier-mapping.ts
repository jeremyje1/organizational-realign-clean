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
  // Deprecated / legacy tiers retained for backward compatibility (hidden from UI)
  'express-diagnostic': {
    tierKey: 'express-diagnostic',
    stripeProductId: 'prod_express_legacy_removed',
    stripePriceId: 'price_express_legacy_removed',
    stripeMode: 'payment',
    successRedirect: '/pricing?legacy=express-diagnostic',
    cancelRedirect: '/pricing',
    tierName: 'Express Diagnostic (Legacy)',
    tierPrice: 99
  },
  'one-time-diagnostic': {
    tierKey: 'one-time-diagnostic',
    stripeProductId: 'prod_org_diagnostic_legacy',
    stripePriceId: 'price_legacy_onetime',
    stripeMode: 'payment',
    successRedirect: '/pricing?legacy=one-time-diagnostic',
    cancelRedirect: '/pricing',
    tierName: 'One-Time Diagnostic (Legacy)',
    tierPrice: 4995
  },
  'monthly-subscription': {
    tierKey: 'monthly-subscription',
    // TODO: Replace with new $149/mo subscription price ID
    stripeProductId: 'prod_monthly_149',
  stripePriceId: process.env.STRIPE_PRICE_MONTHLY_149 || 'price_PLACEHOLDER_MONTHLY_149',
    stripeMode: 'subscription',
    successRedirect: '/assessment/tier-based?tier=monthly-subscription&assessment_type=organizational',
    cancelRedirect: '/pricing',
    tierName: 'Monthly Platform Access',
    tierPrice: 149
  },
  'comprehensive-package': {
    tierKey: 'comprehensive-package',
    stripeProductId: 'prod_org_comprehensive_legacy',
    stripePriceId: 'price_legacy_comprehensive',
    stripeMode: 'payment',
    successRedirect: '/pricing?legacy=comprehensive-package',
    cancelRedirect: '/pricing',
    tierName: 'Comprehensive Package (Legacy)',
    tierPrice: 9900
  },
  'enterprise-transformation': {
    tierKey: 'enterprise-transformation',
    // Enterprise becomes contact-only: keep placeholder so code referencing mapping doesn't break
    stripeProductId: 'prod_enterprise_contact',
  stripePriceId: process.env.STRIPE_PRICE_ENTERPRISE || 'price_CONTACT_SALES',
    stripeMode: 'payment',
    successRedirect: '/contact?interest=enterprise-transformation',
    cancelRedirect: '/pricing',
    tierName: 'Enterprise Realignment (Contact Sales)',
    tierPrice: 0
  }
};

/**
 * Cache-busting function to ensure Vercel uses the latest file.
 * @returns {string} The current version of the mapping file.
 */
export function getMappingVersion(): string {
  return '2.0.0';
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
  // Active upgrade path hierarchy (legacy tiers intentionally excluded)
  const orgTierHierarchy: PricingTier[] = [
    // Legacy tiers (like express-diagnostic) intentionally omitted
    'monthly-subscription',
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
// Client-side checkout URL generation is deprecated to avoid exposing price IDs.
// Use POST /api/stripe/create-tier-checkout instead.
