'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  Sparkles, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  ArrowRight,
  Gift
} from 'lucide-react';
import { PageContainer } from '@/components/ui/page-container';
import { PageHero } from '@/components/ui/page-hero';
import { NpsCard } from '@/components/ui/nps-card';
import { NpsButton } from '@/components/ui/nps-button';
import { Input } from '@/components/ui/input';
import { CardContent } from '@/components/ui/card';
import QuickWinsAssessmentEnhanced from '@/components/QuickWinsAssessmentEnhanced';
import { QuickWinsResult } from '@/data/quickWinsQuestions';

export default function QuickWinsLandingPage() {
  const [showAssessment, setShowAssessment] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleStartAssessment = () => {
    setShowEmailForm(true);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && name.trim()) {
      // Store email and name for later use
      localStorage.setItem('quickWinsUser', JSON.stringify({ email, name }));
      setShowAssessment(true);
      setShowEmailForm(false);
    }
  };

  const handleAssessmentComplete = (_results: QuickWinsResult[]) => {
    // Results are handled within the assessment component
  };

  const handleUpgrade = () => {
    // Redirect to pricing page where users can choose their assessment plan
    window.location.href = '/pricing';
  };

  if (showEmailForm) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PageContainer>
          <div className="max-w-md mx-auto">
            <NpsCard>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <Gift className="h-12 w-12 text-nps-gold mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Get Your Free Report</h2>
                  <p className="text-nps-slate">Enter your details to receive your personalized quick wins assessment results.</p>
                </div>
                
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="w-full"
                    />
                  </div>
                  
                  <NpsButton
                    type="submit"
                    size="lg"
                    className="w-full"
                  >
                    Continue to Assessment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </NpsButton>
                  
                  <p className="text-xs text-nps-slate text-center">
                    We'll use your email to send you the assessment results and occasional updates about organizational improvement strategies.
                  </p>
                </form>
              </CardContent>
            </NpsCard>
          </div>
        </PageContainer>
      </div>
    );
  }

  if (showAssessment) {
    return (
      <div className="min-h-screen">
        <PageContainer>
          <QuickWinsAssessmentEnhanced 
            onComplete={handleAssessmentComplete}
            onUpgrade={handleUpgrade}
          />
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-nps-blue-100 rounded-full opacity-20 animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 right-20 w-96 h-96 bg-nps-blue-200 rounded-full opacity-15 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-nps-blue-150 rounded-full opacity-10 animate-float" style={{ animationDelay: '4s' }} />
      </div>
      
      <PageContainer className="relative z-10">
        {/* Hero Section */}
        <PageHero
          title="Free Quick Wins Assessment"
          subtitle="Discover immediate opportunities to save money and improve efficiency in your organization"
          icon="🚀"
        >
          <div className="space-y-6">
            <NpsButton
              onClick={handleStartAssessment}
              size="lg"
              className="px-12 py-4 text-xl font-semibold"
            >
              <Gift className="mr-3 h-6 w-6" />
              Start Free Assessment
              <ArrowRight className="ml-3 h-6 w-6" />
            </NpsButton>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-nps-slate">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Takes 5 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Free assessment</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span>Instant results</span>
              </div>
            </div>
          </div>
        </PageHero>

        {/* Logo */}
        <div className="flex justify-center mb-12">
          <Image
            src="/images/NorthPath_logo_optimized.jpg"
            alt="NorthPath Strategies"
            width={200}
            height={80}
            className="rounded-lg shadow-md object-cover"
          />
        </div>

        {/* Value Proposition */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-nps-blue mb-4">
              What You&apos;ll Get in 5 Minutes
            </h2>
            <p className="text-lg text-nps-slate max-w-2xl mx-auto">
              Our Quick Wins Assessment analyzes your organization across four critical areas and provides 
              immediate actionable recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '🎯',
                title: 'Organizational Structure',
                description: 'Identify management layers and decision-making bottlenecks'
              },
              {
                icon: '⚡',
                title: 'Process Efficiency',
                description: 'Find duplicate work and manual process automation opportunities'
              },
              {
                icon: '📊',
                title: 'Technology & Systems',
                description: 'Assess system integration and automation potential'
              },
              {
                icon: '💰',
                title: 'Cost Management',
                description: 'Uncover hidden costs and resource optimization opportunities'
              }
            ].map((area, index) => (
              <NpsCard
                key={area.title}
                icon={area.icon}
                title={area.title}
                description={area.description}
                index={index}
              />
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-2xl font-bold text-nps-blue mb-6">
              Immediate Value You&apos;ll Receive
            </h3>
            <div className="space-y-4">
              {[
                'Personalized cost-saving recommendations',
                'Efficiency improvement opportunities',
                'Technology optimization insights',
                'Process streamlining suggestions',
                'Estimated annual savings potential',
                'Priority areas for immediate action'
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-nps-slate">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <NpsCard className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-nps-slate">Average Savings Identified</h4>
              </div>
              <p className="text-3xl font-bold text-green-600 mb-2">$50,000 - $200,000</p>
              <p className="text-sm text-nps-slate">Annual cost reduction opportunities</p>
            </NpsCard>

            <NpsCard className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-nps-slate">Time Savings Potential</h4>
              </div>
              <p className="text-3xl font-bold text-blue-600 mb-2">10-25 hours</p>
              <p className="text-sm text-nps-slate">Per week across your organization</p>
            </NpsCard>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <NpsCard className="border-2 border-nps-blue bg-gradient-to-r from-nps-blue to-blue-700 text-white">
            <h3 className="text-3xl font-bold mb-4 text-white">Ready to Discover Your Quick Wins?</h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of organizations that have unlocked immediate cost savings and efficiency improvements.
            </p>
            <NpsButton
              onClick={handleStartAssessment}
              size="lg"
              className="bg-white text-nps-blue hover:bg-blue-50 px-12 py-4 text-xl font-semibold"
            >
              <Sparkles className="mr-3 h-6 w-6" />
              Start Your Free Assessment
              <ArrowRight className="ml-3 h-6 w-6" />
            </NpsButton>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-blue-200">
              <div className="bg-white/10 border border-white/30 rounded-lg px-3 py-1">
                ✓ 100% Free
              </div>
              <div className="bg-white/10 border border-white/30 rounded-lg px-3 py-1">
                ✓ Free Assessment
              </div>
              <div className="bg-white/10 border border-white/30 rounded-lg px-3 py-1">
                ✓ Instant Results
              </div>
              <div className="bg-white/10 border border-white/30 rounded-lg px-3 py-1">
                ✓ 5 Minutes
              </div>
            </div>
          </NpsCard>
        </section>
      </PageContainer>
    </div>
  );
}
