'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageHero } from '@/components/PageHero';
import { PricingTier, PRICING_TIERS } from '@/lib/tierConfiguration';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const tier = searchParams.get('tier') as PricingTier;
  const newCustomer = searchParams.get('new_customer') === 'true';
  
  const [_paymentVerified, setPaymentVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await fetch(`/api/payments/verify-session?session_id=${sessionId}`);
        const data = await response.json();
        
        if (data.success && data.paymentStatus === 'paid') {
          setPaymentVerified(true);
          
          // Redirect to appropriate tier-based page after 3 seconds
          setTimeout(() => {
            redirectToTierContent();
          }, 3000);
        } else {
          setError('Payment verification failed');
        }
      } catch {
        setError('Failed to verify payment');
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      verifyPayment();
    } else {
      setError('No payment session found');
      setLoading(false);
    }
  }, [sessionId, redirectToTierContent]);

  const redirectToTierContent = useCallback(() => {
    if (tier && PRICING_TIERS[tier]) {
      // Redirect to tier-specific assessment
      window.location.href = `/assessment/tier-based?tier=${tier}`;
    } else {
      // Default redirect to dashboard
      window.location.href = '/dashboard';
    }
  }, [tier]);

  const getTierInfo = () => {
    if (tier && PRICING_TIERS[tier]) {
      return PRICING_TIERS[tier];
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHero 
          title="Payment Error"
          subtitle="There was an issue processing your payment"
        />
        
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800">Payment Processing Error</h3>
                <p className="mt-1 text-red-700">{error}</p>
                <div className="mt-4">
                  <button
                    onClick={() => window.location.href = '/upgrade'}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tierInfo = getTierInfo();

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero 
        title="Payment Successful!"
        subtitle="Welcome to NorthPath Organizational Assessment"
      />
      
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-green-800">
                Payment Confirmed
              </h3>
              <p className="mt-1 text-green-700">
                {newCustomer 
                  ? "Welcome! Your account has been created and your payment has been processed successfully."
                  : "Your payment has been processed successfully and your account has been upgraded."
                }
              </p>
            </div>
          </div>
        </div>

        {/* Tier Information */}
        {tierInfo && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {tierInfo.name} Access Activated
            </h2>
            <p className="text-gray-600 mb-6">
              You now have access to all features included in your {tierInfo.name} subscription.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Included Features:</h3>
                <ul className="space-y-2">
                  {tierInfo.coreDeliverables.map((deliverable, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="ml-3 text-gray-700">{deliverable}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Assessment Scope:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• {tierInfo.assessmentScope.questionCount} targeted questions</li>
                  <li>• {tierInfo.assessmentScope.reportPages}-page detailed report</li>
                  <li>• {tierInfo.assessmentScope.algorithms.join(', ')} algorithmic analysis</li>
                  <li>• {tierInfo.assessmentScope.followUpSupport}</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Next Steps</h3>
          <div className="space-y-3 text-blue-800">
            <p>1. You&apos;ll be automatically redirected to start your assessment in a few seconds</p>
            <p>2. Complete the questionnaire based on your tier&apos;s scope</p>
            <p>3. Review your comprehensive analysis report</p>
            <p>4. Contact our team for your included support session</p>
          </div>
          
          <div className="mt-6 flex gap-4">
            <button
              onClick={redirectToTierContent}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Assessment Now
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment confirmation...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
