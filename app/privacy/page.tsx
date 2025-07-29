import React from 'react';
import { Metadata } from 'next';
import { PageWrapper } from '@/components/ui/page-wrapper';
import { PagesBackground } from '@/components/ui/pages-background';

export const metadata: Metadata = {
  title: 'Privacy Policy - NorthPath Strategies',
  description: 'Learn how NorthPath Strategies protects and handles your personal information.',
};

export default function PrivacyPage() {
  return (
    <PagesBackground>
      <PageWrapper>
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-4xl mx-auto pages-content-overlay rounded-xl p-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Privacy Policy
          </h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Effective Date: July 6, 2025
            </p>
            
            <p>
              At NorthPath Strategies, we take your privacy seriously. This Privacy Policy describes how we collect, use, and protect your information when you use our services.
            </p>
            
            <h2>Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you:
            </p>
            <ul>
              <li>Complete our organizational assessment</li>
              <li>Contact us through our website</li>
              <li>Subscribe to our newsletters</li>
              <li>Use our consulting services</li>
            </ul>
            
            <h2>How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul>
              <li>Provide and improve our services</li>
              <li>Generate assessment reports and insights</li>
              <li>Communicate with you about our services</li>
              <li>Comply with legal obligations</li>
            </ul>
            
            <h2>Information Sharing</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
            </p>
            
            <h2>Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            
            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@northpathstrategies.com" className="text-primary-600 hover:text-primary-700">
                privacy@northpathstrategies.com
              </a>
            </p>
          </div>
        </div>        </div>
      </PageWrapper>
    </PagesBackground>
  );
}
