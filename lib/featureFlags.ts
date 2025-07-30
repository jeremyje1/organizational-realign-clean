/**
 * Feature Flags Configuration
 * Manages enterprise feature rollouts and A/B testing
 * 
 * @version 1.0.0
 * @author NorthPath Strategies
 */

export interface FeatureFlag {
  name: string;
  enabled: boolean;
  description: string;
  rolloutPercentage: number;
  userGroups?: string[];
  environment?: ('development' | 'staging' | 'production')[];
  startDate?: string;
  endDate?: string;
}

/**
 * Enterprise Feature Flags
 * Controls access to premium and experimental features
 */
export const FEATURE_FLAGS: Record<string, FeatureFlag> = {
  // Monte Carlo Simulation Engine
  MONTE_CARLO_SIMULATION: {
    name: 'monte-carlo-simulation',
    enabled: false,
    description: 'Advanced Monte Carlo simulation for DSCH scenarios with probabilistic modeling',
    rolloutPercentage: 0,
    userGroups: ['enterprise', 'beta'],
    environment: ['development', 'staging'],
    startDate: '2025-04-01',
    endDate: '2025-08-01'
  },

  // Enhanced DSCH Algorithm
  DSCH_ENHANCED: {
    name: 'dsch-enhanced',
    enabled: false,
    description: 'Enhanced Decision Support for Cost-Heavy scenarios with advanced analytics',
    rolloutPercentage: 0,
    userGroups: ['enterprise'],
    environment: ['development'],
    startDate: '2025-04-15'
  },

  // Banner ERP Integration
  BANNER_ERP_INTEGRATION: {
    name: 'banner-erp-integration',
    enabled: false,
    description: 'Real-time integration with Banner Student Information System',
    rolloutPercentage: 0,
    userGroups: ['enterprise', 'education'],
    environment: ['development'],
    startDate: '2025-07-01'
  },

  // Enhanced Workday Integration
  WORKDAY_ENHANCED: {
    name: 'workday-enhanced',
    enabled: false,
    description: 'Enhanced Workday HCM integration with real-time sync and webhooks',
    rolloutPercentage: 0,
    userGroups: ['enterprise'],
    environment: ['development', 'staging'],
    startDate: '2025-06-15'
  },

  // Row-Level Security
  ROW_LEVEL_SECURITY: {
    name: 'row-level-security',
    enabled: false,
    description: 'Advanced multi-tenant security with granular data access controls',
    rolloutPercentage: 0,
    userGroups: ['enterprise'],
    environment: ['development'],
    startDate: '2026-01-01'
  },

  // Advanced Analytics Dashboard
  ADVANCED_ANALYTICS: {
    name: 'advanced-analytics',
    enabled: false,
    description: 'Enhanced analytics dashboard with predictive modeling',
    rolloutPercentage: 0,
    userGroups: ['enterprise', 'ai-enhanced'],
    environment: ['development'],
    startDate: '2025-09-01'
  },

  // Real-time Collaboration
  REAL_TIME_COLLABORATION: {
    name: 'real-time-collaboration',
    enabled: false,
    description: 'Real-time collaborative scenario building and analysis',
    rolloutPercentage: 0,
    userGroups: ['team', 'enterprise'],
    environment: ['development'],
    startDate: '2025-10-01'
  },

  // Custom Reporting Engine
  CUSTOM_REPORTING: {
    name: 'custom-reporting',
    enabled: false,
    description: 'Advanced custom report builder with drag-and-drop interface',
    rolloutPercentage: 0,
    userGroups: ['comprehensive', 'enterprise'],
    environment: ['development'],
    startDate: '2025-11-01'
  },

  // API Rate Limiting Enhanced
  API_RATE_LIMITING_ENHANCED: {
    name: 'api-rate-limiting-enhanced',
    enabled: true,
    description: 'Enhanced API rate limiting with tier-based quotas',
    rolloutPercentage: 100,
    userGroups: ['all'],
    environment: ['development', 'staging', 'production']
  },

  // Audit Logging
  AUDIT_LOGGING: {
    name: 'audit-logging',
    enabled: true,
    description: 'Comprehensive audit logging for compliance and security',
    rolloutPercentage: 100,
    userGroups: ['enterprise'],
    environment: ['staging', 'production']
  }
};

/**
 * Check if a feature flag is enabled for a user
 * @param flagName - Name of the feature flag
 * @param userTier - User's subscription tier
 * @param userGroups - User's groups (beta, enterprise, etc.)
 * @param environment - Current environment
 * @returns boolean indicating if feature is enabled
 */
export function isFeatureEnabled(
  flagName: string,
  userTier?: string,
  userGroups?: string[],
  environment?: string
): boolean {
  const flag = FEATURE_FLAGS[flagName];
  
  if (!flag) {
    console.warn(`Feature flag '${flagName}' not found`);
    return false;
  }

  // Check if feature is globally enabled
  if (!flag.enabled) {
    return false;
  }

  // Check environment restrictions
  if (flag.environment && environment && !flag.environment.includes(environment as any)) {
    return false;
  }

  // Check date restrictions
  const now = new Date();
  if (flag.startDate && now < new Date(flag.startDate)) {
    return false;
  }
  if (flag.endDate && now > new Date(flag.endDate)) {
    return false;
  }

  // Check user group restrictions
  if (flag.userGroups && flag.userGroups.length > 0) {
    const hasAccess = flag.userGroups.some(group => {
      if (group === 'all') return true;
      if (group === userTier) return true;
      if (userGroups?.includes(group)) return true;
      return false;
    });
    if (!hasAccess) {
      return false;
    }
  }

  // Check rollout percentage (simple implementation)
  if (flag.rolloutPercentage < 100) {
    // In production, this would use a consistent hash of user ID
    // For now, use a simple random check
    return Math.random() * 100 < flag.rolloutPercentage;
  }

  return true;
}

/**
 * Get all enabled features for a user
 * @param userTier - User's subscription tier
 * @param userGroups - User's groups
 * @param environment - Current environment
 * @returns Array of enabled feature names
 */
export function getEnabledFeatures(
  userTier?: string,
  userGroups?: string[],
  environment?: string
): string[] {
  return Object.keys(FEATURE_FLAGS).filter(flagName =>
    isFeatureEnabled(flagName, userTier, userGroups, environment)
  );
}

/**
 * Feature flag middleware for API routes
 * @param requiredFeature - Required feature flag
 * @returns Express middleware function
 */
export function requireFeature(requiredFeature: string) {
  return (req: any, res: any, next: any) => {
    const userTier = req.user?.tier;
    const userGroups = req.user?.groups || [];
    const environment = process.env.NODE_ENV;

    if (!isFeatureEnabled(requiredFeature, userTier, userGroups, environment)) {
      return res.status(403).json({
        error: 'Feature not available',
        feature: requiredFeature,
        message: 'This feature is not enabled for your account'
      });
    }

    next();
  };
}

/**
 * React hook for feature flags
 */
export function useFeatureFlag(flagName: string) {
  // This would integrate with your auth context in a real implementation
  const userTier = 'enterprise'; // From auth context
  const userGroups = ['beta']; // From auth context
  const environment = process.env.NODE_ENV;

  return isFeatureEnabled(flagName, userTier, userGroups, environment);
}

/**
 * Feature flag configuration for different environments
 */
export const ENVIRONMENT_CONFIGS = {
  development: {
    MONTE_CARLO_SIMULATION: { enabled: true, rolloutPercentage: 100 },
    DSCH_ENHANCED: { enabled: true, rolloutPercentage: 100 },
    BANNER_ERP_INTEGRATION: { enabled: true, rolloutPercentage: 100 },
    WORKDAY_ENHANCED: { enabled: true, rolloutPercentage: 100 }
  },
  staging: {
    MONTE_CARLO_SIMULATION: { enabled: true, rolloutPercentage: 50 },
    WORKDAY_ENHANCED: { enabled: true, rolloutPercentage: 75 }
  },
  production: {
    AUDIT_LOGGING: { enabled: true, rolloutPercentage: 100 },
    API_RATE_LIMITING_ENHANCED: { enabled: true, rolloutPercentage: 100 }
  }
};

export default FEATURE_FLAGS;
