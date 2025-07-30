import React from 'react';
import { Metadata } from 'next';
import { PageWrapper } from '@/components/ui/page-wrapper';
import { PagesBackground } from '@/components/ui/pages-background';

export const metadata: Metadata = {
  title: 'Terms of Service - NorthPath Strategies',
  description: 'Terms and conditions for using NorthPath Strategies services. Read our policies on usage, privacy, and legal requirements.',
  keywords: [
    'terms of service',
    'legal agreement',
    'service conditions',
    'privacy terms',
    'northpath strategies terms',
    'user agreement'
  ],
  openGraph: {
    title: 'Terms of Service - NorthPath Strategies',
    description: 'Terms and conditions for using NorthPath Strategies organizational realignment services.',
    url: 'https://app.northpathstrategies.org/terms',
  },
};

export default function TermsPage() {
  return (
    <PagesBackground>
      <PageWrapper>
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-4xl mx-auto pages-content-overlay rounded-xl p-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Terms of Service
          </h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Effective Date: July 6, 2025
            </p>
            
            <p>
              Welcome to NorthPath Strategies. These Terms of Service govern your use of our website and services.
            </p>
            
            <h2>Acceptance of Terms</h2>
            <p>
              By accessing or using our services, you agree to be bound by these Terms of Service and our Privacy Policy.
            </p>
            
            <h2>Use of Services</h2>
            <p>
              You may use our services for lawful purposes only. You agree not to:
            </p>
            <ul>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit harmful or malicious code</li>
              <li>Attempt to gain unauthorized access to our systems</li>
            </ul>
            
            <h2>Intellectual Property</h2>
            <p>
              All content and materials on our website are owned by NorthPath Strategies and are protected by copyright and other intellectual property laws.
            </p>
            
            <h2>Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, NorthPath Strategies shall not be liable for any indirect, incidental, special, or consequential damages.
            </p>
            
            <h2>Contact Information</h2>
            <p>
              If you have questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:legal@northpathstrategies.com" className="text-primary-600 hover:text-primary-700">
                legal@northpathstrategies.com
              </a>
            </p>
          </div>
        </div>        </div>
      </PageWrapper>
    </PagesBackground>
  );
}
