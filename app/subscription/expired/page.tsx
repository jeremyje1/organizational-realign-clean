'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

function SubscriptionExpiredContent() {
  const searchParams = useSearchParams();
  const tier = searchParams.get('tier');
  const reason = searchParams.get('reason');

  const tierNames: Record<string, string> = {
    'monthly-subscription': 'Monthly Subscription',
    'comprehensive-package': 'Comprehensive Package',
    'enterprise-transformation': 'Enterprise Transformation'
  };

  const tierName = tier ? tierNames[tier] || tier : 'Subscription';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            {/* Warning Icon */}
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.86-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>

            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Subscription Access Required
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              {reason === 'expired' && (
                <>Your <strong>{tierName}</strong> subscription has expired. Please renew to continue accessing your features.</>
              )}
              {reason === 'cancelled' && (
                <>Your <strong>{tierName}</strong> subscription has been cancelled. Reactivate to restore access.</>
              )}
              {reason === 'past_due' && (
                <>Your <strong>{tierName}</strong> subscription payment is past due. Please update your payment method.</>
              )}
              {reason === 'unpaid' && (
                <>Your <strong>{tierName}</strong> subscription requires payment. Please complete payment to continue.</>
              )}
              {!reason && (
                <>Your subscription access could not be verified. Please check your subscription status.</>
              )}
            </p>

            <div className="space-y-3">
              {/* Renew Subscription Button */}
              <Link
                href={`/upgrade?tier=${tier}&action=renew`}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Renew Subscription
              </Link>

              {/* Manage Billing */}
              <Link
                href="/account/billing"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Manage Billing
              </Link>

              {/* Contact Support */}
              <Link
                href="/support?issue=subscription"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Contact Support
              </Link>

              {/* Back to Dashboard */}
              <Link
                href="/dashboard"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Back to Dashboard
              </Link>
            </div>

            {/* Grace Period Notice */}
            {reason === 'grace_period' && (
              <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Grace Period Active
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Your subscription has expired but you&apos;re in a 7-day grace period. 
                        Renew now to avoid service interruption.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionExpiredPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SubscriptionExpiredContent />
    </Suspense>
  );
}
