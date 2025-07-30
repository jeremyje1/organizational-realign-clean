'use client';

import { useEffect, useState, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '../../../components/ui/button';
import { Brain, Download, Share2, BookOpen, CheckCircle, Target, AlertTriangle, Sparkles, Crown } from 'lucide-react';

// Placeholder components for removed modules
const AnalysisResults = ({ data: _data }: any) => <div className="p-4 border rounded">Analysis Results Component (Placeholder)</div>;
const InteractiveInsights = ({ data: _data }: any) => <div className="p-4 border rounded">Interactive Insights Component (Placeholder)</div>;
const AIAnalysisResults = ({ data: _data }: any) => <div className="p-4 border rounded">AI Analysis Results Component (Placeholder)</div>;
const AssessmentComments = ({ data: _data }: any) => <div className="p-4 border rounded">Assessment Comments Component (Placeholder)</div>;
const ConsultationBooking = ({ data: _data }: any) => <div className="p-4 border rounded">Consultation Booking Component (Placeholder)</div>;
const PremiumUpgrade = ({ data: _data }: any) => <div className="p-4 border rounded">Premium Upgrade Component (Placeholder)</div>;

function ResultsPageContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session');
  const [analysis, setAnalysis] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [showPremiumUpgrade, setShowPremiumUpgrade] = useState(false);
  const [userPremiumStatus, setUserPremiumStatus] = useState<'basic' | 'premium' | 'enterprise'>('basic');

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided');
      setLoading(false);
      return;
    }

    const fetchAnalysis = async () => {
      try {
        // First get the assessment details
        const assessmentResponse = await fetch(`/api/assessment/by-session/${sessionId}`);
        if (!assessmentResponse.ok) {
          throw new Error('Assessment not found');
        }
        const assessmentData = await assessmentResponse.json();
        setAssessmentId(assessmentData.assessment.id);

        // Check if this is a return from payment
        const urlParams = new URLSearchParams(window.location.search);
        const premiumParam = urlParams.get('premium');
        const stripeSessionId = urlParams.get('session');
        
        if (premiumParam === 'true' && stripeSessionId) {
          // Verify payment and get premium status
          try {
            const paymentResponse = await fetch(`/api/payments/create-session?session_id=${stripeSessionId}`);
            if (paymentResponse.ok) {
              const paymentData = await paymentResponse.json();
              if (paymentData.success && paymentData.session.paymentStatus === 'paid') {
                const planTier = paymentData.session.metadata?.plan;
                if (planTier) {
                  setUserPremiumStatus(planTier === 'enterprise' ? 'enterprise' : 'premium');
                  
                  // Check for pending upgrade callback
                  const pendingUpgrade = sessionStorage.getItem('pendingUpgrade');
                  if (pendingUpgrade) {
                    sessionStorage.removeItem('pendingUpgrade');
                    // Automatically trigger AI analysis for premium users - use setTimeout to avoid dependency issues
                    setTimeout(() => {
                      // Call handleAIAnalysis when it's available
                      const triggerAI = async () => {
                        if (!assessmentData.assessment.id) return;
                        
                        try {
                          const response = await fetch('/api/analysis/ai-enhanced', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                              assessmentId: assessmentData.assessment.id,
                              analysisData: null 
                            }),
                          });
                          if (response.ok) {
                            const data = await response.json();
                            setAiAnalysis(data.analysis);
                            setShowAIAnalysis(true);
                          }
                        } catch (_err) {
                          console.error('AI analysis error:', err);
                        }
                      };
                      triggerAI();
                    }, 1000);
                  }
                }
              }
            }
          } catch (paymentError) {
            console.log('Payment verification failed:', paymentError);
          }
        }

        // Then get the analysis
        const response = await fetch('/api/analysis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            sessionId,
            assessmentId: assessmentData.assessment.id
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate analysis');
        }

        const data = await response.json();
        setAnalysis(data.analysis);

        // Check if AI analysis is available
        try {
          const aiResponse = await fetch(`/api/analysis/ai-enhanced?assessmentId=${assessmentData.assessment.id}`);
          if (aiResponse.ok) {
            const aiData = await aiResponse.json();
            setAiAnalysis(aiData.analysis);
          }
        } catch (aiError) {
          console.log('AI analysis not available yet:', aiError);
        }
      } catch (_err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [sessionId]);

  const handleDownloadReport = async () => {
    if (!assessmentId) return;
    
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          assessmentId,
          includeAI: !!aiAnalysis 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `organizational-analysis-report-${assessmentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Report download error:', error);
    }
  };

  const handleAIAnalysis = useCallback(async () => {
    if (!assessmentId || aiLoading) return;
    
    setAiLoading(true);
    try {
      const response = await fetch('/api/analysis/ai-enhanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          assessmentId,
          analysisData: analysis 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI analysis');
      }

      const data = await response.json();
      setAiAnalysis(data.analysis);
      setShowAIAnalysis(true);
    } catch (_err) {
      console.error('AI analysis error:', err);
      // Could add error toast here
    } finally {
      setAiLoading(false);
    }
  }, [assessmentId, aiLoading, analysis]);

  if (loading) {
    return (
      <div className="min-h-screen elegant-bg flex items-center justify-center">
        <div className="card p-12 text-center max-w-lg animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <Brain className="h-16 w-16 text-purple-400 animate-pulse" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-100 mb-4">Analyzing Your Organization</h2>
          <p className="text-slate-300 mb-6 leading-relaxed">
            Our advanced AI is processing your assessment responses and generating comprehensive insights...
          </p>
          
          {/* Enhanced progress indicator */}
          <div className="space-y-4">
            <div className="bg-slate-700/50 rounded-full h-3">
              <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-3 rounded-full animate-pulse transition-all duration-1000" style={{ width: '85%' }}></div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle className="h-4 w-4" />
                <span>Data Processed</span>
              </div>
              <div className="flex items-center gap-2 text-purple-400">
                <Brain className="h-4 w-4 animate-pulse" />
                <span>AI Analysis</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Target className="h-4 w-4" />
                <span>Recommendations</span>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-slate-400 mt-6">This typically takes 2-3 minutes</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen elegant-bg flex items-center justify-center">
        <div className="card p-12 text-center max-w-lg animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-slate-100 mb-4">Analysis Encountered an Issue</h2>
          <p className="text-red-300 mb-6 bg-red-900/20 p-4 rounded-lg border border-red-500/30">{error}</p>
          <div className="space-y-3">
            <Button 
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Try Again
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/dashboard'}
              className="w-full bg-slate-700/30 hover:bg-slate-600/50 text-slate-200 border-slate-600/50"
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen elegant-bg flex items-center justify-center">
        <div className="card p-12 text-center max-w-lg animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-slate-100 mb-4">No Analysis Available</h2>
          <p className="text-slate-300 mb-6">Unable to load analysis results. Please try completing the assessment again.</p>
          <div className="space-y-3">
            <Button 
              onClick={() => window.location.href = '/survey'}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Take Assessment
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/dashboard'}
              className="w-full bg-slate-700/30 hover:bg-slate-600/50 text-slate-200 border-slate-600/50"
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen elegant-bg">
      {/* Action Bar */}
      <div className="card mx-4 mt-4 mb-6 sticky top-4 z-10 backdrop-blur-lg bg-slate-800/90 border-slate-600/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="font-semibold text-slate-100">Analysis Complete</span>
                  <div className="text-sm text-slate-400">
                    Session: {sessionId?.substring(0, 8)}...
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {!aiAnalysis && (
                <Button 
                  onClick={handleAIAnalysis}
                  disabled={aiLoading}
                  className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {aiLoading ? 'Generating AI Insights...' : 'AI Enhanced Analysis'}
                </Button>
              )}
              
              <Button 
                variant="outline" 
                onClick={handleDownloadReport}
                className="bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 border-slate-600/50 hover:border-slate-500/50"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
              
              <Button 
                variant="outline"
                className="bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 border-slate-600/50 hover:border-slate-500/50"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Results
              </Button>
              
              {assessmentId && (
                <ConsultationBooking 
                  assessmentId={assessmentId}
                  premiumTier={userPremiumStatus}
                  isPremium={userPremiumStatus !== 'basic'}
                  trigger={
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Schedule Consultation
                    </Button>
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Enhanced Analysis */}
      {(aiAnalysis || showAIAnalysis) && (
        <div className="px-4 pb-8">
          <div className="card mb-6">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-400 rounded-full flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-100">AI Enhanced Analysis</h2>
                    <p className="text-slate-300">Advanced insights powered by artificial intelligence</p>
                  </div>
                </div>
                
                {aiAnalysis && (
                  <Button 
                    variant="outline"
                    onClick={() => setShowAIAnalysis(!showAIAnalysis)}
                    className="bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 border-slate-600/50"
                  >
                    {showAIAnalysis ? 'Hide AI Analysis' : 'Show AI Analysis'}
                  </Button>
                )}
              </div>
              
              {showAIAnalysis && aiAnalysis && (
                <AIAnalysisResults analysis={aiAnalysis} />
              )}
              
              {showAIAnalysis && aiLoading && (
                <div className="text-center py-12">
                  <div className="flex items-center justify-center mb-4">
                    <Sparkles className="h-8 w-8 text-violet-400 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-100 mb-2">Generating AI Insights</h3>
                  <p className="text-slate-300">Our AI is analyzing your assessment data to provide enhanced insights...</p>
                  <div className="mt-4 bg-slate-700/50 rounded-full h-2 max-w-md mx-auto">
                    <div className="bg-gradient-to-r from-violet-400 to-purple-400 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Interactive Insights Dashboard */}
      <div className="px-4 pb-8">
        {analysis.strategicInsights && analysis.performanceMetrics && (
          <InteractiveInsights 
            analysisData={analysis}
            sectionData={analysis.performanceMetrics.sectionBreakdown || []}
            insights={analysis.strategicInsights || []}
          />
        )}
      </div>

      {/* Premium Upgrade Section */}
      {userPremiumStatus === 'basic' && !aiAnalysis && (
        <div className="px-4 pb-8">
          <div className="card">
            <div className="max-w-7xl mx-auto px-6 py-12">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-slate-100 mb-4">Unlock Advanced Analysis</h2>
                <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-6">
                  Get deeper insights with AI-powered analysis, comprehensive reports, and expert consultation.
                </p>
                <Button 
                  onClick={() => setShowPremiumUpgrade(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-3"
                >
                  <Crown className="h-5 w-5 mr-2" />
                  Upgrade to Premium
                </Button>
              </div>
              
              {/* Feature Preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">AI Enhanced Analysis</h3>
                  <p className="text-slate-300 text-sm">
                    Advanced AI insights with predictive recommendations and strategic roadmaps
                  </p>
                </div>
                
                <div className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Comprehensive Reports</h3>
                  <p className="text-slate-300 text-sm">
                    Professional PDF reports with implementation timelines and ROI analysis
                  </p>
                </div>
                
                <div className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">Expert Consultation</h3>
                  <p className="text-slate-300 text-sm">
                    Priority access to strategy sessions with higher education experts
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Premium Upgrade Modal */}
      {showPremiumUpgrade && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <Button
              onClick={() => setShowPremiumUpgrade(false)}
              variant="outline"
              className="absolute top-4 right-4 z-10 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border-slate-600 h-8 w-8 p-0"
            >
              ✕
            </Button>
            <PremiumUpgrade 
              assessmentId={assessmentId || ''}
              trigger={<div />}
              onUpgradeSuccess={(tier: string) => {
                setUserPremiumStatus(tier as 'basic' | 'premium' | 'enterprise');
                setShowPremiumUpgrade(false);
                // Trigger AI analysis for premium users
                if (tier !== 'basic') {
                  handleAIAnalysis();
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Analysis Results */}
      <div className="px-4 pb-8">
        <AnalysisResults analysis={analysis} />
      </div>

      {/* Comments Section */}
      <div className="card mx-4 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-100 mb-4">Collaborate on Your Results</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Add comments and insights to your analysis for collaborative planning with your team.
            </p>
          </div>

          <div className="mb-8">
            {assessmentId && <AssessmentComments assessmentId={assessmentId} />}
          </div>

          <div className="text-center">
            {assessmentId && (
              <ConsultationBooking 
                assessmentId={assessmentId}
                premiumTier={userPremiumStatus}
                isPremium={userPremiumStatus !== 'basic'}
                trigger={
                  <Button className="w-full max-w-md mx-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Schedule Expert Consultation
                  </Button>
                }
              />
            )}
          </div>
        </div>
      </div>

      {/* Next Steps Section */}
      <div className="card mx-4 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-100 mb-4">Ready to Transform Your Institution?</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Take the next step with personalized consultation from our higher education experts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6 text-center bg-slate-800/30 border-slate-600/30 hover:border-slate-500/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-2">Expert Consultation</h3>
              <p className="text-slate-300 mb-6">
                Deep-dive discussion of your results with our strategic advisors
              </p>
              {assessmentId && (
                <ConsultationBooking 
                  assessmentId={assessmentId}
                  premiumTier={userPremiumStatus}
                  isPremium={userPremiumStatus !== 'basic'}
                  trigger={
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                      Schedule Call
                    </Button>
                  }
                />
              )}
            </div>

            <div className="card p-6 text-center bg-slate-800/30 border-slate-600/30 hover:border-slate-500/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-2">Detailed Report</h3>
              <p className="text-slate-300 mb-6">
                Comprehensive PDF report with implementation guidelines
              </p>
              <Button 
                variant="outline" 
                onClick={handleDownloadReport} 
                className="w-full bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 border-slate-600/50 hover:border-slate-500/50"
              >
                Download PDF
              </Button>
            </div>

            <div className="card p-6 text-center bg-slate-800/30 border-slate-600/30 hover:border-slate-500/50 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-2">Team Collaboration</h3>
              <p className="text-slate-300 mb-6">
                Share results with your leadership team for collaborative planning
              </p>
              <Button 
                variant="outline" 
                className="w-full bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 border-slate-600/50 hover:border-slate-500/50"
              >
                Invite Team
              </Button>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-slate-400">
              Questions about your results? Contact us at{' '}
              <a href="mailto:results@northpathstrategies.org" className="text-purple-400 hover:text-purple-300 transition-colors">
                results@northpathstrategies.org
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    }>
      <ResultsPageContent />
    </Suspense>
  );
}