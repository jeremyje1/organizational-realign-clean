/**
 * Feature Flag Higher-Order Component
 * Conditionally renders components based on feature flags
 * 
 * @version 1.0.0
 * @author NorthPath Strategies
 */

import React from 'react';
import { isFeatureEnabled } from '@/lib/featureFlags';

interface FeatureGateProps {
  flag: string;
  userTier?: string;
  userGroups?: string[];
  environment?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Feature Gate Component
 * Conditionally renders children based on feature flag
 */
export function FeatureGate({
  flag,
  userTier = 'individual',
  userGroups = [],
  environment = process.env.NODE_ENV || 'development',
  fallback = null,
  children
}: FeatureGateProps) {
  const isEnabled = isFeatureEnabled(flag, userTier, userGroups, environment);
  
  if (!isEnabled) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

/**
 * Higher-Order Component for Feature Flags
 * Wraps a component with feature flag checking
 */
export function withFeatureFlag<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  flag: string,
  fallbackComponent?: React.ComponentType<P>
) {
  return function FeatureFlaggedComponent(props: P & {
    userTier?: string;
    userGroups?: string[];
    environment?: string;
  }) {
    const {
      userTier = 'individual',
      userGroups = [],
      environment = process.env.NODE_ENV || 'development',
      ...componentProps
    } = props;

    const isEnabled = isFeatureEnabled(flag, userTier, userGroups, environment);
    
    if (!isEnabled) {
      if (fallbackComponent) {
        const FallbackComponent = fallbackComponent;
        return <FallbackComponent {...(componentProps as P)} />;
      }
      return null;
    }
    
    return <WrappedComponent {...(componentProps as P)} />;
  };
}

/**
 * Hook for feature flag checking in functional components
 */
export function useFeatureFlag(
  flag: string,
  userTier: string = 'individual',
  userGroups: string[] = [],
  environment: string = process.env.NODE_ENV || 'development'
): boolean {
  return isFeatureEnabled(flag, userTier, userGroups, environment);
}

/**
 * Enterprise Feature Banner Component
 * Shows upgrade prompt for disabled enterprise features
 */
interface EnterpriseFeatureBannerProps {
  featureName: string;
  description?: string;
  className?: string;
}

export function EnterpriseFeatureBanner({
  featureName,
  description,
  className = ''
}: EnterpriseFeatureBannerProps) {
  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {featureName} - Enterprise Feature
          </h3>
          <p className="text-gray-600 mb-4">
            {description || `${featureName} is available with our Enterprise plan. Upgrade to unlock advanced capabilities and premium features.`}
          </p>
          <div className="flex items-center space-x-4">
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              View Enterprise Plans
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Feature Flag Loading Skeleton
 * Shows while feature flags are being determined
 */
export function FeatureFlagSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-32 bg-gray-200 rounded"></div>
    </div>
  );
}
