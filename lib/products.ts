// Express Diagnostic removed from active offerings (legacy only)
export const ASSESSMENT_PRODUCTS = [
  {
    id: 'monthly-subscription',
    name: 'Monthly Platform Access',
    description: 'Run recurring diagnostics, track improvement, and model structural scenarios as you iterate toward leaner, higher performing operations.',
  tagline: 'Continuous Optimization – $149/mo',
    features: [
      'Unlimited diagnostic runs',
      'Month-over-month trend dashboards',
      'Scenario comparison & capacity modeling',
      'Org chart refresh & export',
      'Early feature & algorithm updates',
      'Priority email support'
    ],
    price: 149,
    isMonthly: true,
    recommended: false,
    stripeUrl: '/api/stripe/create-tier-checkout?tier=monthly-subscription'
  },
  {
    id: 'enterprise-transformation',
    name: 'Enterprise Realignment (Full Partnership)',
    description: 'High-touch engagement combining the platform with executive facilitation, roadmap design, benchmarking, and implementation support.',
    tagline: 'High-Impact Guided Transformation',
    features: [
      'Executive discovery & structural risk audit',
      'Full algorithm suite & benchmarking',
      'Prioritized 12‑month transformation roadmap',
      'Scenario & savings modeling workshops',
      'Quarterly progress audits & recalibration',
      'On‑demand strategist access'
    ],
    price: 0,
    recommended: false,
    stripeUrl: 'https://calendly.com/jeremyestrella/30min?utm=enterprise-inquiry',
    contactForPricing: true
  }
];
