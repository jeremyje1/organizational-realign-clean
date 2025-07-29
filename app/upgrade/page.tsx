'use client';

import React, { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageHero } from '@/components/PageHero';
import { PricingTier, PRICING_TIERS } from '@/lib/tierConfiguration';
import { generateStripeCheckoutUrl, getMappingVersion } from '@/lib/stripe-tier-mapping';

function UpgradeContent() {
  // Force reload on mapping version change to ensure latest price IDs
  useEffect(() => {
    const version = getMappingVersion();
    const prevVersion = sessionStorage.getItem('mappingVersion');
    if (prevVersion && prevVersion !== version) {
      sessionStorage.setItem('mappingVersion', version);
      window.location.reload();
    } else if (!prevVersion) {
      sessionStorage.setItem('mappingVersion', version);
    }
  }, []);

  const searchParams = useSearchParams();
  const requiredTier = searchParams.get('requiredTier') || 'enterprise-transformation';
  const currentTier = searchParams.get('currentTier') || 'one-time-diagnostic';

  // Use actual tier configuration instead of hardcoded features
  const tierFeatures = {
    'one-time-diagnostic': {
      name: 'One-Time Diagnostic',
      price: '$4,995',
      interval: 'one-time',
      tierKey: 'one-time-diagnostic' as PricingTier,
      features: PRICING_TIERS['one-time-diagnostic'].coreDeliverables
    },
    'monthly-subscription': {
      name: 'Monthly Subscription',
      price: '$2,995',
      interval: '/month',
      tierKey: 'monthly-subscription' as PricingTier,
      features: PRICING_TIERS['monthly-subscription'].coreDeliverables
    },
    'comprehensive-package': {
      name: 'Comprehensive Package',
      price: '$9,900',
      interval: 'one-time',
      tierKey: 'comprehensive-package' as PricingTier,
      features: PRICING_TIERS['comprehensive-package'].coreDeliverables
    },
    'enterprise-transformation': {
      name: 'Enterprise Transformation',
      price: '$24,000',
      interval: 'one-time',
      tierKey: 'enterprise-transformation' as PricingTier,
      features: PRICING_TIERS['enterprise-transformation'].coreDeliverables
    }
  };

  const handleUpgrade = async (tierKey: PricingTier) => {
    try {
      // Redirect to Stripe checkout for the selected tier
      const checkoutUrl = generateStripeCheckoutUrl(tierKey);
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Error initiating upgrade:', error);
      alert('There was an error processing your upgrade. Please try again.');
    }
  };

  const getCurrentTierInfo = () => tierFeatures[currentTier as keyof typeof tierFeatures] || tierFeatures.INDIVIDUAL;
  const getRequiredTierInfo = () => tierFeatures[requiredTier as keyof typeof tierFeatures] || tierFeatures.ENTERPRISE;

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero 
        title="Upgrade Required"
        subtitle="Access this feature with a higher tier subscription"
      />
      
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Access Denied Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-yellow-800">
                {getRequiredTierInfo().name} Tier Required
              </h3>
              <p className="mt-1 text-yellow-700">
                You currently have {getCurrentTierInfo().name} access. 
                To access this feature, you need to upgrade to {getRequiredTierInfo().name} tier.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(tierFeatures).map(([tier, info]) => {
            const isCurrent = tier === currentTier;
            const isRequired = tier === requiredTier;
            const isUpgrade = tier !== currentTier;

            return (
              <div
                key={tier}
                className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                  isRequired ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className={`px-6 py-8 ${
                  isRequired ? 'bg-blue-50' : 'bg-white'
                }`}>
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {info.name}
                    </h3>
                    {isCurrent && (
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full mt-2">
                        Current Plan
                      </span>
                    )}
                    {isRequired && (
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mt-2">
                        Required Plan
                      </span>
                    )}
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-gray-900">
                        {info.price}
                      </span>
                      <span className="text-gray-600">{info.interval}</span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-8">
                  <ul className="space-y-4">
                    {info.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="ml-3 text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    {isCurrent ? (
                      <button
                        disabled
                        className="w-full py-3 px-4 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
                      >
                        Current Plan
                      </button>
                    ) : isUpgrade ? (
                      <button
                        onClick={() => handleUpgrade(info.tierKey)}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                          isRequired
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                      >
                        {isRequired ? 'Upgrade Now' : 'Select Plan'}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full py-3 px-4 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
                      >
                        Contact Sales
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Feature Comparison
          </h2>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feature
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Individual
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { feature: 'Basic Assessment Reports', individual: true, team: true, enterprise: true },
                  { feature: 'Scenario Modeling', individual: false, team: true, enterprise: true },
                  { feature: 'Team Collaboration', individual: false, team: true, enterprise: true },
                  { feature: 'Power BI Dashboard', individual: false, team: false, enterprise: true },
                  { feature: 'Advanced Analytics', individual: false, team: true, enterprise: true },
                  { feature: 'API Access', individual: false, team: false, enterprise: true },
                  { feature: 'Custom Reporting', individual: false, team: false, enterprise: true }
                ].map((row, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.feature}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {row.individual ? (
                        <svg className="h-5 w-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {row.team ? (
                        <svg className="h-5 w-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {row.enterprise ? (
                        <svg className="h-5 w-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Questions about upgrading?
          </h3>
          <p className="text-gray-600 mb-6">
            Contact our team to learn more about our plans and find the right fit for your organization.
          </p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Go Back
            </button>
            <a 
              href="mailto:sales@northpathstrategies.org"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UpgradePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <UpgradeContent />
    </Suspense>
  );
}
