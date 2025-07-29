export const ASSESSMENT_PRODUCTS = [
  {
    id: 'express-diagnostic',
    name: 'NorthPath Express Diagnostic',
    description: 'Perfect for small teams, pilot initiatives, or getting quick organizational insights.',
    tagline: 'Rapid Insight, Immediate Action',
    features: [
      '60‑question smart survey',
      '25‑page AI‑enhanced analysis report',
      'Core index scores: OCI™, HOCI™, JCI™',
      'One‑click org chart generator',
      '30‑minute debrief call with strategist',
      '2‑3 immediate action recommendations',
      'Results within 3‑5 business days'
    ],
    price: 2495,
    recommended: true,
    stripeUrl: 'https://organizational-realign-app.vercel.app/api/stripe/create-tier-checkout?tier=express-diagnostic'
  },
  {
    id: 'one-time-diagnostic',
    name: 'One‑Time Diagnostic',
    description: 'Ideal for a single‑campus college, small hospital unit, or departmental pilot.',
    tagline: 'Best for Pilots',
    features: [
      '100‑item survey + secure file upload',
      '35‑page comprehensive AI‑powered analysis',
      'OCI / HOCI / JCI scores + AI analysis',
      '45‑min strategy consultation call',
      'One‑Click Org‑Chart + scenario modeling'
    ],
    price: 4995,
    recommended: false,
    stripeUrl: 'https://organizational-realign-app.vercel.app/api/stripe/create-tier-checkout?tier=one-time-diagnostic'
  },
  {
    id: 'monthly-subscription',
    name: 'Monthly Subscription',
    description: 'For programs or departments that refine operations every term.',
    tagline: 'Iteration Friendly',
    features: [
      'Unlimited assessments each month',
      'CSV dashboard refreshes',
      '60‑min office‑hours call / month',
      'One‑Click Org‑Chart + 3 cost scenarios',
      'Cancel or upgrade anytime'
    ],
    price: 2995,
    isMonthly: true,
    recommended: false,
    stripeUrl: 'https://organizational-realign-app.vercel.app/api/stripe/create-tier-checkout?tier=monthly-subscription'
  },
  {
    id: 'comprehensive-package',
    name: 'Comprehensive Package',
    description: 'For mid‑sized institutions needing a narrative report and deep scenario work.',
    tagline: 'Board‑Ready',
    features: [
      'Everything in Monthly tier',
      'One‑Click Org‑Chart + 3 cost scenarios',
      '45‑page board‑ready executive report',
      '90‑min strategy session'
    ],
    price: 9900,
    recommended: false,
    stripeUrl: 'https://organizational-realign-app.vercel.app/api/stripe/create-tier-checkout?tier=comprehensive-package'
  },
  {
    id: 'enterprise-transformation',
    name: 'Enterprise Transformation',
    description: 'Designed for multi‑campus systems, hospital networks, or public agencies.',
    tagline: 'System‑Wide',
    features: [
      'Everything in Comprehensive tier',
      'One‑Click Org‑Chart + 3 cost scenarios',
      '55‑page enterprise transformation report',
      'Unlimited scenarios & API export',
      'Power BI embedded dashboard + API connectors',
      'On‑site facilitation & quarterly audits'
    ],
    price: 0, // Contact for pricing
    recommended: false,
    stripeUrl: 'https://calendly.com/jeremyestrella/30min?month=2025-07',
    contactForPricing: true
  }
];
