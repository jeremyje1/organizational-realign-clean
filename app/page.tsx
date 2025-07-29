import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight, BarChart3, Users, Shield, Zap } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "NorthPath Strategies Assessment Platform",
  description: "Advanced organizational assessment and analytics platform for institutional transformation.",
  keywords: "organizational assessment, analytics platform, institutional transformation, data-driven insights",
  openGraph: {
    title: "NorthPath Strategies Assessment Platform",
    description: "Advanced organizational assessment and analytics platform for institutional transformation.",
    url: "https://app.northpathstrategies.org",
    siteName: "NorthPath Strategies App",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NorthPath Analytics Platform",
    description: "Advanced organizational assessment and analytics platform for data-driven transformation.",
    creator: "@northpathstrat",
    images: ["/og-app.png"],
  },
};

export default function AppHomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">NorthPath Analytics</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/quick-wins" className="text-slate-300 hover:text-white transition-colors">
                Quick Wins
              </Link>
              <Link href="/pricing" className="text-slate-300 hover:text-white transition-colors">
                Organizational Assessment
              </Link>
              <Link href="/ai-readiness" className="text-slate-300 hover:text-white transition-colors">
                AI Readiness
              </Link>
              <Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
            <Zap className="h-4 w-4 mr-2" />
            Assessment Platform
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            NorthPath Strategies
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              {" "}Assessment Platform
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Comprehensive assessment platform for organizational transformation and AI readiness. 
            Get insights, analyze patterns, and drive strategic decisions.
          </p>
          
          {/* Assessment Type Selection */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-white mb-3">Organizational Realignment</h3>
              <p className="text-slate-300 mb-4">
                Comprehensive diagnostic for organizational transformation and strategic realignment.
              </p>
              <div className="flex flex-col gap-3">
                <Button size="lg" asChild className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold">
                  <Link href="/quick-wins">
                    Free Quick Wins Assessment
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" asChild className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <Link href="/pricing">
                    Full Assessment
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm border border-indigo-500/50 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-white mb-3">AI Readiness Assessment</h3>
              <p className="text-slate-300 mb-4">
                Evaluate your institution's AI readiness across strategy, governance, pedagogy, and technology.
              </p>
              <div className="flex flex-col gap-3">
                <Button size="lg" asChild className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold">
                  <Link href="/ai-readiness/pricing">
                    View Pricing
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" asChild className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                  <Link href="/ai-readiness">
                    Learn More
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" asChild className="border-slate-600 text-slate-300 hover:bg-slate-800">
              <Link href="/dashboard">
                View Dashboard
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Advanced Analytics</h3>
            <p className="text-slate-300 text-sm">
              Comprehensive organizational assessment with AI-powered insights and pattern recognition.
            </p>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Team Collaboration</h3>
            <p className="text-slate-300 text-sm">
              Multi-user dashboards and collaborative analysis tools for strategic planning.
            </p>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Secure Platform</h3>
            <p className="text-slate-300 text-sm">
              Enterprise-grade security with data encryption and compliance protocols.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Get Started Today</h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Begin with our comprehensive organizational assessment to unlock insights and drive transformation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Link href="/assessment/onboarding">Begin Assessment</Link>
            </Button>
            <Button variant="outline" asChild className="border-slate-600 text-slate-300 hover:bg-slate-800">
              <Link href="/secure/results">View Sample Results</Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-sm mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-slate-400 text-sm">
              © 2025 NorthPath Strategies Analytics Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
