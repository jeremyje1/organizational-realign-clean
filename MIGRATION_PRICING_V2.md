# Pricing Model Migration (v2.0.0)

Date: 2025-08-11

## Summary
The pricing model has been consolidated from 5 public tiers to 3 active tiers:

Active Tiers:
- `express-diagnostic` – $99 one-time
- `monthly-subscription` – $149 / month
- `enterprise-transformation` (Enterprise Realignment) – Contact / custom

Legacy (Deprecated) Tiers (still present so historical data & old sessions don’t break):
- `one-time-diagnostic`
- `comprehensive-package`

## Rationale
- Reduce purchase complexity and cognitive load.
- Lower barrier to entry with a self-serve $99 diagnostic.
- Emphasize recurring value (monthly iteration) and high-touch enterprise partnership.

## Code Changes Overview
| Area | Change |
|------|--------|
| `lib/tierConfiguration.ts` | Only 3 active tiers keep full definitions; legacy tiers replaced with inert placeholders. |
| `lib/stripe-tier-mapping.ts` | Added new $99 / $149 price placeholders (env-based). Legacy tiers redirect to pricing. Hierarchy updated to Express → Monthly → Enterprise. |
| WordPress HTML pages | All public pricing references updated to new model. |
| `lib/products.ts` | Reduced to 3 offerings with SEO-oriented descriptions. |
| New | `lib/tierUtils.ts` helper for tier normalization and legacy detection. |
| New | `.env.example` documents required Stripe env vars. |

## Environment Variables (Add to Deployment)
Use server-side Stripe price IDs only; do not set public NEXT_PUBLIC_* price variables.
```
# Server-side (recommended)
STRIPE_PRICE_EXPRESS_99=price_xxx   # Live one-time price for Express
STRIPE_PRICE_MONTHLY_149=price_yyy  # Live recurring (monthly) price
# Optional placeholder for enterprise (usually not needed)
STRIPE_PRICE_ENTERPRISE=price_enterprise_placeholder

```

## Mapping Legacy → Active
| Legacy | Suggested Replacement | Reason |
|--------|-----------------------|--------|
| one-time-diagnostic | monthly-subscription | Recurring access provides more long-term value than a single snapshot. |
| comprehensive-package | enterprise-transformation | Closest to high-touch, strategic support expectations. |

## Upgrade / Downgrade Logic
The validation hierarchy now: `express-diagnostic` < `monthly-subscription` < `enterprise-transformation`.
Legacy tiers are excluded from feature gating; any user record still holding one is encouraged (via UI/redirect) to upgrade.

## How Legacy Sessions Are Handled
If a checkout or feature request references a legacy tier key:
1. It is normalized to an equivalent active tier (see mapping rules in `tierUtils.ts`).
2. Metadata preserves the original tier (`legacy_original`).
3. User can be shown an informational banner prompting acceptance of new terms/pricing.

## Required Operational Follow-Up
| Task | Owner | Status |
|------|-------|--------|
| Create new Stripe Products & Prices (Express $99, Monthly $149) | Billing | TODO |
| Insert env vars in Vercel / hosting | DevOps | TODO |
| QA checkout sessions (all 3 tiers) | QA | TODO |
| Remove legacy marketing pages or add redirects | Marketing | TODO |
| Update internal playbooks / sales collateral | RevOps | TODO |

## Safe Removal (Later Phase)
After 60–90 days (post-cutover) and data audit:
- Remove legacy literals from `PricingTier` union.
- Delete legacy placeholder configs from `PRICING_TIERS` and `STRIPE_TIER_MAPPINGS`.
- Purge conditional code branches referencing legacy tiers.

## Rollback Plan
If unforeseen issues occur:
1. Reintroduce previous stripe price IDs via env vars.
2. Revert to Git commit prior to migration (tag recommended before deploy).
3. Re-enable old pricing section blocks in WordPress templates if needed.

## Testing Checklist
- [ ] Express $99 one-time checkout creates a Payment session and returns success redirect.
- [ ] Monthly $149 checkout creates Subscription session; metadata contains `tier`.
- [ ] Enterprise CTA routes to Calendly (no Stripe invocation).
- [ ] Legacy URL `/api/stripe/create-tier-checkout?tier=one-time-diagnostic` normalizes and logs legacy metadata.
- [ ] Feature gating respects new hierarchy; legacy records do not break app load.

---
Questions? Open an issue with label `pricing-migration`.
