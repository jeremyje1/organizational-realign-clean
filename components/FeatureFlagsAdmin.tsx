/**
 * Feature Flags Admin Component
 * Displays and manages enterprise feature flags
 * 
 * @version 1.0.0
 * @author NorthPath Strategies
 */

'use client';

import React, { useState, useEffect } from 'react';
import { FEATURE_FLAGS, getEnabledFeatures } from '@/lib/featureFlags';

interface FeatureFlagsProps {
  userTier?: string;
  userGroups?: string[];
  isAdmin?: boolean;
}

export default function FeatureFlagsAdmin({ 
  userTier = 'individual',
  userGroups = [],
  isAdmin = false 
}: FeatureFlagsProps) {
  const [enabledFeatures, setEnabledFeatures] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const environment = process.env.NODE_ENV || 'development';
    const enabled = getEnabledFeatures(userTier, userGroups, environment);
    setEnabledFeatures(enabled);
    setLoading(false);
  }, [userTier, userGroups]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (flagName: string) => {
    const isEnabled = enabledFeatures.includes(flagName);
    return isEnabled ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100';
  };

  const getStatusText = (flagName: string) => {
    return enabledFeatures.includes(flagName) ? 'Enabled' : 'Disabled';
  };

  const categorizedFlags = {
    'Core Features': [
      'AUDIT_LOGGING',
      'API_RATE_LIMITING_ENHANCED'
    ],
    'Analytics & Simulation': [
      'MONTE_CARLO_SIMULATION',
      'DSCH_ENHANCED',
      'ADVANCED_ANALYTICS'
    ],
    'Integrations': [
      'BANNER_ERP_INTEGRATION',
      'WORKDAY_ENHANCED'
    ],
    'Security & Collaboration': [
      'ROW_LEVEL_SECURITY',
      'REAL_TIME_COLLABORATION'
    ],
    'Reporting & Customization': [
      'CUSTOM_REPORTING'
    ]
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Enterprise Features</h2>
            <p className="text-gray-600 mt-1">
              Feature flags for {userTier} tier • {enabledFeatures.length} features enabled
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {process.env.NODE_ENV || 'development'}
            </span>
            {userGroups.map(group => (
              <span key={group} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {group}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {Object.entries(categorizedFlags).map(([category, flagNames]) => (
          <div key={category}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              {category}
            </h3>
            
            <div className="space-y-4">
              {flagNames.map(flagName => {
                const flag = FEATURE_FLAGS[flagName];
                if (!flag) return null;

                return (
                  <div key={flagName} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-base font-medium text-gray-900">
                            {flag.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(flagName)}`}>
                            {getStatusText(flagName)}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3">
                          {flag.description}
                        </p>

                        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                          {flag.rolloutPercentage !== undefined && (
                            <div className="flex items-center">
                              <span className="font-medium">Rollout:</span>
                              <span className="ml-1">{flag.rolloutPercentage}%</span>
                            </div>
                          )}
                          
                          {flag.userGroups && flag.userGroups.length > 0 && (
                            <div className="flex items-center">
                              <span className="font-medium">Groups:</span>
                              <span className="ml-1">{flag.userGroups.join(', ')}</span>
                            </div>
                          )}
                          
                          {flag.environment && flag.environment.length > 0 && (
                            <div className="flex items-center">
                              <span className="font-medium">Environments:</span>
                              <span className="ml-1">{flag.environment.join(', ')}</span>
                            </div>
                          )}
                          
                          {flag.startDate && (
                            <div className="flex items-center">
                              <span className="font-medium">Start:</span>
                              <span className="ml-1">{new Date(flag.startDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="ml-4">
                        {enabledFeatures.includes(flagName) ? (
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {isAdmin && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Administrative controls available for feature flag management
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
              Manage Flags
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
