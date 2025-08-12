/**
 * Tier-Based Assessment Configuration
 * Aligns assessment depth and algorithms with pricing tiers
 * 
 * @version 1.0.0
 * @author NorthPath Strategies
 */

// PricingTier retains legacy literals for backward compatibility with stored records.
export type PricingTier = 
  | 'monthly-subscription'
  | 'enterprise-transformation'
  // Legacy (deprecated) tiers retained so historical data & old sessions don't break
  | 'one-time-diagnostic'
  | 'comprehensive-package'
  | 'express-diagnostic'; // moved to legacy

export interface TierConfiguration {
  name: string;
  price: number;
  targetCustomer: string;
  coreDeliverables: string[];
  assessmentScope: {
    questionCount: number;
    sections: string[];
    algorithms: string[];
    reportPages: number;
    followUpSupport: string;
  };    features: {
      uploadSupport: boolean;
      dashboardRefresh: boolean;
      customReporting: boolean;
      powerBIEmbedded: boolean;
      apiConnectors: boolean;
      onSiteFacilitation: boolean;
      progressAudits: boolean;
      orgChartGenerator: boolean;
      scenarioBuilder: boolean;
      monteCarloSimulation: boolean;
      realTimeCollaboration: boolean;
      aiOpportunityAssessment: boolean;
      // AI readiness functionality moved to separate app
      automationRecommendations: boolean;
    };
  guardrails: {
    maxAssessments?: number;
    maxUsers?: number;
    maxScenarios?: number;
    dataRetentionMonths: number;
  };
}

export const PRICING_TIERS: Record<PricingTier, TierConfiguration> = {
  // Active Tiers
  'monthly-subscription': {
    name: 'Monthly Platform Access',
    price: 149,
    targetCustomer: 'Teams iterating and tracking structural improvements over time.',
    coreDeliverables: [
      'Unlimited diagnostic runs',
      'Trend & comparison dashboards',
      'Scenario & capacity modeling',
      'Org chart refresh & export',
      'Priority support'
    ],
    assessmentScope: {
      questionCount: 120,
      sections: [
        'Leadership & Strategy',
        'Operations & Processes',
        'Human Capital',
        'Technology & Infrastructure',
        'Change & Performance'
      ],
      algorithms: ['OCI', 'HOCI', 'JCI', 'DSCH', 'CRF'],
      reportPages: 12,
      followUpSupport: 'Priority email support'
    },
    features: {
      uploadSupport: true,
      dashboardRefresh: true,
      customReporting: false,
      powerBIEmbedded: false,
      apiConnectors: false,
      onSiteFacilitation: false,
      progressAudits: false,
      orgChartGenerator: true,
      scenarioBuilder: true,
      monteCarloSimulation: false,
      realTimeCollaboration: true,
  aiOpportunityAssessment: true,
  automationRecommendations: true
    },
    guardrails: {
      maxAssessments: null,
      maxUsers: 25,
      maxScenarios: 10,
      dataRetentionMonths: 12
    }
  },
  'enterprise-transformation': {
    name: 'Enterprise Realignment (Custom)',
    price: 0,
    targetCustomer: 'Organizations pursuing guided transformation with facilitation & audits.',
    coreDeliverables: [
      'Executive discovery & risk audit',
      'Full algorithm suite + benchmarking',
      '12‑month transformation roadmap',
      'Scenario & savings workshops',
      'Quarterly progress audits',
      'On-demand strategist access'
    ],
    assessmentScope: {
      questionCount: 160,
      sections: [
        'Executive Leadership',
        'Strategic Planning',
        'Operations & Capacity',
        'Human Capital Strategy',
        'Technology & Infrastructure',
        'Change & Performance'
      ],
      algorithms: ['OCI', 'HOCI', 'JCI', 'DSCH', 'CRF', 'LEI'],
      reportPages: 30,
      followUpSupport: 'Dedicated strategist + quarterly audits'
    },
    features: {
      uploadSupport: true,
      dashboardRefresh: true,
      customReporting: true,
      powerBIEmbedded: true,
      apiConnectors: true,
      onSiteFacilitation: true,
      progressAudits: true,
      orgChartGenerator: true,
      scenarioBuilder: true,
      monteCarloSimulation: false,
      realTimeCollaboration: true,
  aiOpportunityAssessment: true,
  automationRecommendations: true
    },
    guardrails: {
      maxAssessments: null,
      maxUsers: null,
      maxScenarios: null,
      dataRetentionMonths: null
    }
  },
  // Legacy (hidden) tiers preserved for historical data access
  'one-time-diagnostic': {
    ...({} as TierConfiguration),
    name: 'One-Time Diagnostic (Legacy)',
    price: 4995,
    targetCustomer: 'Deprecated',
    coreDeliverables: [],
    assessmentScope: { questionCount: 0, sections: [], algorithms: [], reportPages: 0, followUpSupport: 'Deprecated' },
  features: { uploadSupport: false, dashboardRefresh: false, customReporting: false, powerBIEmbedded: false, apiConnectors: false, onSiteFacilitation: false, progressAudits: false, orgChartGenerator: false, scenarioBuilder: false, monteCarloSimulation: false, realTimeCollaboration: false, aiOpportunityAssessment: false, automationRecommendations: false },
    guardrails: { dataRetentionMonths: 0 }
  },
  'comprehensive-package': {
    ...({} as TierConfiguration),
    name: 'Comprehensive Package (Legacy)',
    price: 9900,
    targetCustomer: 'Deprecated',
    coreDeliverables: [],
    assessmentScope: { questionCount: 0, sections: [], algorithms: [], reportPages: 0, followUpSupport: 'Deprecated' },
  features: { uploadSupport: false, dashboardRefresh: false, customReporting: false, powerBIEmbedded: false, apiConnectors: false, onSiteFacilitation: false, progressAudits: false, orgChartGenerator: false, scenarioBuilder: false, monteCarloSimulation: false, realTimeCollaboration: false, aiOpportunityAssessment: false, automationRecommendations: false },
    guardrails: { dataRetentionMonths: 0 }
  }
};

/**
 * Helper Functions for Tier Feature Access
 */

export function hasOrgChartAccess(tier: PricingTier): boolean {
  return PRICING_TIERS[tier].features.orgChartGenerator;
}

export function hasScenarioBuilder(tier: PricingTier): boolean {
  return PRICING_TIERS[tier].features.scenarioBuilder;
}

export function hasRealTimeCollaboration(tier: PricingTier): boolean {
  return PRICING_TIERS[tier].features.realTimeCollaboration;
}

export function getOrgChartCapabilities(tier: PricingTier): {
  canGenerate: boolean;
  canModelScenarios: boolean;
  canCollaborate: boolean;
  maxScenarios?: number;
} {
  const config = PRICING_TIERS[tier];
  
  // Handle case where config doesn't exist (e.g., for AI readiness tiers)
  if (!config) {
    console.warn(`No configuration found for tier: ${tier}. Returning default org chart capabilities.`);
    return {
      canGenerate: false,
      canModelScenarios: false,
      canCollaborate: false,
      maxScenarios: 0
    };
  }
  
  return {
    canGenerate: config.features.orgChartGenerator,
    canModelScenarios: config.features.scenarioBuilder,
    canCollaborate: config.features.realTimeCollaboration,
    maxScenarios: config.guardrails.maxScenarios
  };
}

/**
 * Industry-Specific Question Modules
 * Loaded based on organization type and tier
 */
export const INDUSTRY_MODULES = {
  'higher-education': {
    name: 'Higher Education',
    sections: [
      'Academic Programs & Curriculum',
      'Faculty & Instructional Support',
      'Enrollment Management & Admissions',
      'Student Affairs & Success Services',
      'Continuing Education & Workforce Development'
    ],
    specializedQuestions: 45
  },
  'healthcare': {
    name: 'Healthcare',
    sections: [
      'Clinical Operations & Patient Care',
      'Medical Staff & Provider Management',
      'Revenue Cycle & Patient Financial Services',
      'Quality & Patient Safety',
      'Regulatory Compliance & Accreditation'
    ],
    specializedQuestions: 40
  },
  'public-sector': {
    name: 'Public Sector',
    sections: [
      'Public Service Delivery',
      'Regulatory & Compliance Functions',
      'Citizen Engagement & Communications',
      'Intergovernmental Relations',
      'Performance Measurement & Transparency'
    ],
    specializedQuestions: 35
  }
};

/**
 * Algorithm Configuration by Tier
 */
export const TIER_ALGORITHMS = {
  // Active algorithm sets + compact legacy placeholders
  'express-diagnostic': { primary: ['OCI', 'HOCI', 'JCI'], advanced: [], experimental: [] },
  'monthly-subscription': { primary: ['OCI', 'HOCI', 'JCI', 'DSCH', 'CRF'], advanced: [], experimental: [] },
  'enterprise-transformation': { primary: ['OCI', 'HOCI', 'JCI', 'DSCH', 'CRF', 'LEI'], advanced: [], experimental: [] },
  'one-time-diagnostic': { primary: ['OCI','HOCI','JCI'], advanced: [], experimental: [] },
  'comprehensive-package': { primary: ['OCI','HOCI','JCI','DSCH','CRF'], advanced: [], experimental: [] }
};

/**
 * Get tier configuration based on user subscription
 */
export function getTierConfiguration(tier: PricingTier): TierConfiguration | null {
  const config = PRICING_TIERS[tier];
  if (!config) {
    console.warn(`No configuration found for tier: ${tier}`);
    return null;
  }
  return config;
}

/**
 * Determine available algorithms for a tier
 */
export function getAvailableAlgorithms(tier: PricingTier): string[] {
  const config = TIER_ALGORITHMS[tier];
  return [...config.primary, ...config.advanced, ...config.experimental];
}

/**
 * Check if a feature is available for a tier
 */
export function hasFeatureAccess(tier: PricingTier, feature: keyof TierConfiguration['features']): boolean {
  return PRICING_TIERS[tier].features[feature];
}

/**
 * Get industry-specific questions for organization type
 */
export function getIndustryQuestions(organizationType: string, tier: PricingTier): string[] {
  const industryModule = INDUSTRY_MODULES[organizationType as keyof typeof INDUSTRY_MODULES];
  if (!industryModule) return [];
  
  const tierConfig = getTierConfiguration(tier);
  const maxQuestions = Math.min(industryModule.specializedQuestions, tierConfig.assessmentScope.questionCount * 0.3);
  
  return industryModule.sections.slice(0, Math.ceil(maxQuestions / 10));
}

/**
 * Validate tier access and usage limits
 */
export function validateTierAccess(
  tier: PricingTier, 
  usage: {
    assessmentsUsed?: number;
    usersCount?: number;
    scenariosCreated?: number;
  }
): { valid: boolean; message?: string; upgradeRequired?: boolean } {
  const config = getTierConfiguration(tier);
  
  // Handle case where config is null (e.g., for AI readiness tiers)
  if (!config) {
    console.warn(`No configuration found for tier: ${tier}. Allowing access.`);
    return { valid: true };
  }
  
  const { guardrails } = config;
  
  // Check assessment limits
  if (guardrails.maxAssessments && usage.assessmentsUsed && usage.assessmentsUsed > guardrails.maxAssessments) {
    return {
      valid: false,
      message: `Assessment limit reached (${guardrails.maxAssessments}). Upgrade to continue.`,
      upgradeRequired: true
    };
  }
  
  // Check user limits  
  if (guardrails.maxUsers && usage.usersCount && usage.usersCount > guardrails.maxUsers) {
    return {
      valid: false,
      message: `User limit reached (${guardrails.maxUsers}). Upgrade to add more users.`,
      upgradeRequired: true
    };
  }
  
  // Check scenario limits
  if (guardrails.maxScenarios && usage.scenariosCreated && usage.scenariosCreated >= guardrails.maxScenarios) {
    return {
      valid: false,
      message: `Scenario limit reached (${guardrails.maxScenarios}). Upgrade for unlimited scenarios.`,
      upgradeRequired: true
    };
  }
  
  return { valid: true };
}
