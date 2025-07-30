'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building, Users, Target, CheckCircle, ArrowRight, Sparkles, TrendingUp, Star, Clock, Shield } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-slate-50">
      {/* Mobile-First Hero */}
      <section className="relative px-4 py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Mobile-Optimized Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Patent-Pending AI Technology
          </div>
          
          {/* Mobile-First Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Transform Your Organization with
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              AI-Powered Insights
            </span>
          </h1>
          
          {/* Mobile-Optimized Description */}
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Get instant organizational insights with our proprietary algorithms. 
            Align structure with strategy in minutes, not months.
          </p>
          
          {/* Mobile-First CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/assessment/tier-based" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 text-lg rounded-xl shadow-lg">
                Start Free Assessment
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" className="w-full sm:w-auto border-2 border-gray-300 hover:border-blue-500 px-8 py-4 text-lg rounded-xl">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Mobile-Optimized Features Grid */}
      <section className="px-4 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Leaders Choose NorthPath
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Proprietary algorithms designed specifically for organizational science
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Building className="w-8 h-8 text-blue-600" />,
                title: "Instant Analysis",
                description: "Get comprehensive organizational insights in under 10 minutes with our OCI™ algorithm"
              },
              {
                icon: <Users className="w-8 h-8 text-purple-600" />,
                title: "Team Alignment",
                description: "Identify and resolve structural misalignments using our HOCI™ methodology"
              },
              {
                icon: <Target className="w-8 h-8 text-green-600" />,
                title: "Strategic Focus",
                description: "Prioritize high-impact changes with data-driven recommendations"
              },
              {
                icon: <CheckCircle className="w-8 h-8 text-blue-600" />,
                title: "Proven Results",
                description: "Trusted by Fortune 500 companies for organizational transformation"
              },
              {
                icon: <Sparkles className="w-8 h-8 text-purple-600" />,
                title: "AI-Powered",
                description: "Patent-pending algorithms built specifically for organizational complexity"
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-green-600" />,
                title: "Measurable Impact",
                description: "Track improvements with real-time analytics and progress monitoring"
              }
            ].map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="px-4 py-12 sm:py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of organizations that have transformed with NorthPath
            </p>
          </div>
          
          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Organizations Transformed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-2">98%</div>
              <div className="text-gray-600">Client Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">45%</div>
              <div className="text-gray-600">Average Efficiency Gain</div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                quote: "NorthPath's AI insights revealed structural inefficiencies we'd been blind to for years. The transformation was remarkable.",
                author: "Sarah Chen",
                role: "VP of Operations, TechCorp",
                rating: 5
              },
              {
                quote: "The OCI™ algorithm provided actionable insights that led to a 40% improvement in team productivity within 3 months.",
                author: "Michael Rodriguez",
                role: "Chief Strategy Officer, InnovateLabs",
                rating: 5
              },
              {
                quote: "Finally, a tool that understands the complexity of modern organizations. The ROI was evident within weeks.",
                author: "Dr. Amanda Foster",
                role: "Director of Organizational Development",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-gradient-to-br from-gray-50 to-white border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="px-4 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get started with organizational transformation in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: <Clock className="w-8 h-8 text-blue-600" />,
                title: "Quick Assessment",
                description: "Complete our comprehensive organizational assessment in under 10 minutes"
              },
              {
                step: "02",
                icon: <Sparkles className="w-8 h-8 text-purple-600" />,
                title: "AI Analysis",
                description: "Our proprietary algorithms analyze your responses and generate insights"
              },
              {
                step: "03",
                icon: <TrendingUp className="w-8 h-8 text-green-600" />,
                title: "Implement Changes",
                description: "Receive actionable recommendations and track your transformation progress"
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full mb-6">
                  {step.icon}
                </div>
                <div className="text-sm font-bold text-blue-600 mb-2">STEP {step.step}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Mobile-First CTA Section */}
      <section className="px-4 py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            100% Free Assessment
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Organization?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of leaders who've unlocked their organization's potential
          </p>
          <Link href="/assessment/tier-based">
            <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg rounded-xl shadow-lg">
              Start Your Free Assessment
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
