'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  ArrowRight,
  Star,
  Users,
  FileText,
  TrendingUp,
  Shield,
  Headphones
} from 'lucide-react';
import { ASSESSMENT_PRODUCTS } from '@/lib/products';

export default function PricingPage() {
  const handleSelectPlan = (product: any) => {
    // Handle contact for pricing products
    if (product.contactForPricing) {
      window.open(product.stripeUrl, '_blank');
      return;
    }
    
    // Redirect to the actual Stripe checkout URL
    window.location.href = product.stripeUrl;
  };

  const getFeatureIcon = (feature: string) => {
    if (feature.includes('team') || feature.includes('members')) return <Users className="h-4 w-4" />;
    if (feature.includes('support')) return <Headphones className="h-4 w-4" />;
    if (feature.includes('report') || feature.includes('summary')) return <FileText className="h-4 w-4" />;
    if (feature.includes('visualization') || feature.includes('analysis')) return <TrendingUp className="h-4 w-4" />;
    if (feature.includes('security') || feature.includes('dedicated')) return <Shield className="h-4 w-4" />;
    return <CheckCircle2 className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white py-16">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Start with Our Express Diagnostic – Just $2,495
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Get rapid organizational insights in 3-5 days. Perfect for teams exploring transformation 
              or needing quick wins before committing to comprehensive analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                onClick={() => window.location.href = '/assessment/tier-based?tier=express-diagnostic&org=higher-education'}
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 text-lg"
              >
                Start Express Diagnostic
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-3 text-lg"
                onClick={() => {
                  const element = document.getElementById('all-packages');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View All Packages
              </Button>
            </div>
            <p className="text-sm text-blue-200">
              ⚡ Quick turnaround • 💡 Immediate action items • 🎯 Perfect for pilots
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section id="all-packages" className="container mx-auto px-4 py-16 -mt-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">All Assessment Packages</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            From rapid insights to enterprise transformation – choose the depth that matches your needs.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {ASSESSMENT_PRODUCTS.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Card className={`relative h-full ${
                product.recommended 
                  ? 'border-2 border-blue-500 shadow-xl scale-105' 
                  : 'border border-slate-200 shadow-lg'
              }`}>
                {product.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1 rounded-full">
                      <Star className="h-3 w-3 mr-1" />
                      Recommended
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  {product.tagline && (
                    <div className="text-sm font-medium text-blue-600 mb-2">
                      {product.tagline}
                    </div>
                  )}
                  <CardTitle className="text-2xl font-bold text-slate-800 mb-2">
                    {product.name}
                  </CardTitle>
                  <p className="text-slate-600 mb-4 text-sm">
                    {product.description}
                  </p>
                  <div className="text-4xl font-bold text-slate-900 mb-2">
                    {product.contactForPricing ? 'Contact for Pricing' : `$${product.price.toLocaleString()}`}{product.isMonthly ? ' / month' : ''}
                  </div>
                  <p className="text-sm text-slate-500">
                    {product.isMonthly ? 'Monthly subscription' : 'One-time payment'}
                  </p>
                </CardHeader>

                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-8">
                    {product.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <div className="text-green-500 mt-0.5">
                          {getFeatureIcon(feature)}
                        </div>
                        <span className="text-slate-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSelectPlan(product)}
                    className={`w-full py-3 font-semibold ${
                      product.recommended
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                    size="lg"
                  >
                    {product.contactForPricing ? 'Contact Us' : (product.isMonthly ? 'Subscribe' : 'Purchase')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              What&apos;s Included in Every Plan
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div>
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">Comprehensive Assessment</h4>
                <p className="text-sm text-slate-600">Detailed organizational analysis across all key areas</p>
              </div>
              <div>
                <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">AI-Powered Insights</h4>
                <p className="text-sm text-slate-600">Advanced analytics and pattern recognition</p>
              </div>
              <div>
                <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">Secure & Confidential</h4>
                <p className="text-sm text-slate-600">Enterprise-grade security for all your data</p>
              </div>
              <div>
                <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Headphones className="h-6 w-6 text-orange-600" />
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">Expert Support</h4>
                <p className="text-sm text-slate-600">Guidance from organizational transformation experts</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-slate-50 rounded-xl p-6 max-w-2xl mx-auto">
            <p className="text-slate-700 mb-4">
              <strong>Note:</strong> Prices shown in USD. Taxes (if applicable) calculated at checkout.
            </p>
            <p className="text-slate-600 text-sm">
              Scenario‑builder add‑on for the Comprehensive tier will be available on the confirmation page.
            </p>
          </div>
          <div className="mt-8">
            <p className="text-slate-600 mb-4">
              Have questions or need a custom solution?
            </p>
            <Button
              onClick={() => window.location.href = 'https://calendly.com/jeremyestrella/30min?month=2025-07'}
              variant="outline"
              size="lg"
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Schedule a Consultation
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
