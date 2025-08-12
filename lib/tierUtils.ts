import { PricingTier } from './tierConfiguration';

/** Legacy tiers retained in type for backward compatibility */
export const LEGACY_TIERS: PricingTier[] = [
  'one-time-diagnostic',
  'comprehensive-package',
  'express-diagnostic' // fully deprecated public entry tier
];

/** Active public tiers */
export const ACTIVE_TIERS: PricingTier[] = [
  'monthly-subscription',
  'enterprise-transformation'
];

/** Mapping legacy tiers to recommended replacements */
const LEGACY_REPLACEMENT: Record<string, PricingTier> = {
  'one-time-diagnostic': 'monthly-subscription',
  'comprehensive-package': 'enterprise-transformation',
  'express-diagnostic': 'monthly-subscription'
};

export interface NormalizedTierResult {
  tier: PricingTier;              // Final active/legacy tier actually used
  normalizedTier: PricingTier;    // Active tier after normalization
  isLegacy: boolean;              // Was the original tier legacy?
  original?: PricingTier;         // Original requested tier (if legacy)
}

/** Normalize any incoming tier to an active tier if legacy */
export function normalizeTier(tier: PricingTier): NormalizedTierResult {
  if (LEGACY_TIERS.includes(tier)) {
    const replacement = LEGACY_REPLACEMENT[tier] || 'monthly-subscription';
    return { tier, normalizedTier: replacement, isLegacy: true, original: tier };
  }
  return { tier, normalizedTier: tier, isLegacy: false };
}

/** Determine if user should see upgrade banner (legacy to active) */
export function needsLegacyUpgrade(tier: PricingTier): boolean {
  return LEGACY_TIERS.includes(tier);
}

/** Provide display label for any tier, including legacy flag */
export function getDisplayLabel(tier: PricingTier): string {
  if (LEGACY_TIERS.includes(tier)) return `${tier} (Legacy)`;
  switch (tier) {
    case 'monthly-subscription': return 'Monthly Platform Access';
    case 'enterprise-transformation': return 'Enterprise Realignment';
    default: return tier;
  }
}

/** Basic upgrade ordering for gating logic */
export function tierRank(tier: PricingTier): number {
  // Express + other legacy tiers collapse to base rank 0
  const normalized = normalizeTier(tier).normalizedTier;
  const order: PricingTier[] = [
    'monthly-subscription',
    'enterprise-transformation'
  ];
  const idx = order.indexOf(normalized);
  return idx === -1 ? 0 : idx + 1; // shift active tiers up so legacy=0
}

export function hasAccess(userTier: PricingTier, requiredTier: PricingTier): boolean {
  return tierRank(userTier) >= tierRank(requiredTier);
}
