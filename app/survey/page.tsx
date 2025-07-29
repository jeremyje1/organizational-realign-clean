'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Building2 } from 'lucide-react';
import { PageContainer } from '@/components/ui/page-container';
import { PageHero } from '@/components/ui/page-hero';
import { NpsCard } from '@/components/ui/nps-card';
import { NpsButton } from '@/components/ui/nps-button';

export default function SurveyPage() {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      title: 'Welcome',
      description: 'Get started with your organizational assessment'
    },
    {
      title: 'Organization Details',
      description: 'Tell us about your organization'
    },
    {
      title: 'Assessment Questions',
      description: 'Complete the comprehensive evaluation'
    },
    {
      title: 'Results',
      description: 'Review your personalized recommendations'
    }
  ];

  return (
    <div className="min-h-screen">
      <PageContainer>
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/images/NorthPath_logo_optimized.jpg"
            alt="NorthPath Strategies"
            width={200}
            height={80}
            className="rounded-lg shadow-md object-cover"
          />
        </div>

        {/* Header */}
        <PageHero
          title="Organizational Assessment Survey"
          subtitle="Complete your comprehensive organizational evaluation to receive personalized insights and recommendations"
          icon="📊"
        />

        {/* Progress Steps */}
        <section className="mb-12">
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl w-full">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NpsCard className={`p-6 ${index <= currentStep ? 'border-nps-blue bg-blue-50' : 'border-gray-200'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-3 ${
                      index <= currentStep ? 'bg-nps-blue text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {index < currentStep ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-semibold">{index + 1}</span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-nps-slate mb-2">{step.title}</h3>
                    <p className="text-sm text-nps-slate">{step.description}</p>
                  </NpsCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Assessment Features */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-nps-blue mb-4">
              What&apos;s Included in Your Assessment
            </h2>
            <p className="text-lg text-nps-slate max-w-2xl mx-auto">
              Our comprehensive assessment covers all critical areas of your organization
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🏢',
                title: 'Organizational Structure',
                description: 'Analyze reporting structures, decision-making processes, and management layers'
              },
              {
                icon: '⚙️',
                title: 'Operational Efficiency',
                description: 'Evaluate workflows, process automation, and resource utilization'
              },
              {
                icon: '💰',
                title: 'Financial Analysis',
                description: 'Review cost structures, budget allocation, and ROI opportunities'
              },
              {
                icon: '🎯',
                title: 'Strategic Alignment',
                description: 'Assess goal setting, performance metrics, and strategic execution'
              },
              {
                icon: '👥',
                title: 'Team Dynamics',
                description: 'Examine collaboration, communication, and leadership effectiveness'
              },
              {
                icon: '🚀',
                title: 'Growth Opportunities',
                description: 'Identify areas for improvement and expansion potential'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <NpsCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Assessment Details */}
        <section className="mb-12">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-nps-blue mb-6">
                Assessment Process
              </h3>
              <div className="space-y-4">
                {[
                  'Organization type and industry selection',
                  'Comprehensive questionnaire completion',
                  'Document and data upload (if applicable)',
                  'AI-powered analysis and insights generation',
                  'Personalized report with recommendations',
                  'Optional strategy consultation session'
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 bg-nps-blue rounded-full flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-nps-slate">{step}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <NpsCard className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-nps-slate">Assessment Duration</h4>
                </div>
                <p className="text-3xl font-bold text-blue-600 mb-2">45-90 minutes</p>
                <p className="text-sm text-nps-slate">Complete at your own pace with save functionality</p>
              </NpsCard>

              <NpsCard className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-nps-slate">Organizations Assessed</h4>
                </div>
                <p className="text-3xl font-bold text-green-600 mb-2">500+</p>
                <p className="text-sm text-nps-slate">Across multiple industries and sectors</p>
              </NpsCard>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <NpsCard className="border-2 border-nps-blue bg-gradient-to-r from-nps-blue to-blue-700 text-white">
            <h3 className="text-3xl font-bold mb-4 text-white">Ready to Begin Your Assessment?</h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Get personalized insights and actionable recommendations for your organization.
            </p>
            <NpsButton
              size="lg"
              className="bg-white text-nps-blue hover:bg-blue-50 px-12 py-4 text-xl font-semibold"
              onClick={() => setCurrentStep(1)}
            >
              <Building2 className="mr-3 h-6 w-6" />
              Start Assessment
            </NpsButton>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-blue-200">
              <div className="bg-white/10 border border-white/30 rounded-lg px-3 py-1">
                ✓ Secure & Confidential
              </div>
              <div className="bg-white/10 border border-white/30 rounded-lg px-3 py-1">
                ✓ Save Progress
              </div>
              <div className="bg-white/10 border border-white/30 rounded-lg px-3 py-1">
                ✓ Instant Analysis
              </div>
            </div>
          </NpsCard>
        </section>
      </PageContainer>
    </div>
  );
}