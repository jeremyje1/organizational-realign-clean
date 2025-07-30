'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AnalyticsData {
  totalAssessments: number;
  assessmentsByTier: Record<string, number>;
  assessmentsByIndustry: Record<string, number>;
  assessmentsByMonth: Record<string, number>;
  completionRates: Record<string, number>;
  avgResponseCounts: Record<string, number>;
  aiReadinessScores: {
    average: number;
    byTier: Record<string, number>;
    distribution: Record<string, number>;
  };
  recentAssessments: Array<{
    id: string;
    tier: string;
    industry: string;
    institution: string;
    created_at: string;
    status: string;
  }>;
}

export default function AdminAnalytics() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('30'); // days
  
  // Admin authentication state
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(true);
  const [adminPassword, setAdminPassword] = useState('');

  // Check for existing admin session
  useEffect(() => {
    const adminAuth = sessionStorage.getItem('admin_authenticated');
    if (adminAuth === 'true') {
      setIsAdmin(true);
      setShowPasswordPrompt(false);
    }
  }, []);

  const handleAdminLogin = () => {
    if (adminPassword === 'northpath-admin-2025') {
      setIsAdmin(true);
      setShowPasswordPrompt(false);
      sessionStorage.setItem('admin_authenticated', 'true');
    } else {
      alert('Invalid admin password');
    }
  };

  useEffect(() => {
    if (!isAdmin) return; // Only fetch when admin is authenticated
    
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(`/api/admin/analytics?range=${dateRange}`, {
          headers: {
            'Authorization': 'Bearer admin-token', // In production, use proper auth
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Analytics API Error Response:', errorText.substring(0, 500));
          throw new Error(`Failed to fetch analytics data (${response.status}): ${errorText.substring(0, 100)}`);
        }

        const data = await response.json();
        setAnalytics(data);

      } catch (_err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [dateRange, isAdmin]);

  const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const formatNumber = (value: number): string => {
    return value.toLocaleString();
  };

  const getTierDisplayName = (tier: string): string => {
    const names = {
      'one-time-diagnostic': 'One-Time Diagnostic',
      'monthly-subscription': 'Monthly Subscription',
      'comprehensive-package': 'Comprehensive Package',
      'enterprise-transformation': 'Enterprise Transformation'
    };
    return names[tier as keyof typeof names] || tier;
  };

  const getIndustryDisplayName = (industry: string): string => {
    const names = {
      'higher-education': 'Higher Education',
      'healthcare': 'Healthcare',
      'nonprofit': 'Nonprofit',
      'corporate': 'Corporate',
      'government': 'Government'
    };
    return names[industry as keyof typeof names] || industry;
  };

  // Show password prompt if not authenticated
  if (showPasswordPrompt) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Admin Access Required</h2>
              <p className="mt-2 text-sm text-gray-600">Enter admin password to access analytics</p>
            </div>
            <div className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Admin Password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleAdminLogin}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Access Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900">Error Loading Analytics</h2>
          <p className="mt-2 text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900">No Analytics Data</h2>
          <p className="mt-2 text-sm text-gray-600">No analytics data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="mt-2 text-sm text-gray-600">
                Assessment performance and usage analytics
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
              <button
                onClick={() => router.push('/admin/testing')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Testing Panel
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Assessments</dt>
                  <dd className="text-lg font-medium text-gray-900">{formatNumber(analytics.totalAssessments)}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg AI Readiness</dt>
                  <dd className="text-lg font-medium text-gray-900">{analytics.aiReadinessScores.average.toFixed(1)}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Top Tier</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {Object.entries(analytics.assessmentsByTier).sort(([,a], [,b]) => b - a)[0]?.[0] 
                      ? getTierDisplayName(Object.entries(analytics.assessmentsByTier).sort(([,a], [,b]) => b - a)[0][0])
                      : 'N/A'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Top Industry</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {Object.entries(analytics.assessmentsByIndustry).sort(([,a], [,b]) => b - a)[0]?.[0] 
                      ? getIndustryDisplayName(Object.entries(analytics.assessmentsByIndustry).sort(([,a], [,b]) => b - a)[0][0])
                      : 'N/A'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Assessments by Tier */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Assessments by Tier</h2>
            <div className="space-y-4">
              {Object.entries(analytics.assessmentsByTier).map(([tier, count]) => (
                <div key={tier} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{getTierDisplayName(tier)}</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(count / Math.max(...Object.values(analytics.assessmentsByTier))) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assessments by Industry */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Assessments by Industry</h2>
            <div className="space-y-4">
              {Object.entries(analytics.assessmentsByIndustry).map(([industry, count]) => (
                <div key={industry} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{getIndustryDisplayName(industry)}</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(count / Math.max(...Object.values(analytics.assessmentsByIndustry))) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Readiness Scores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">AI Readiness by Tier</h2>
            <div className="space-y-4">
              {Object.entries(analytics.aiReadinessScores.byTier).map(([tier, score]) => (
                <div key={tier} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{getTierDisplayName(tier)}</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{score.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Completion Rates</h2>
            <div className="space-y-4">
              {Object.entries(analytics.completionRates).map(([tier, rate]) => (
                <div key={tier} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{getTierDisplayName(tier)}</span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full" 
                        style={{ width: `${rate * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{formatPercentage(rate)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Assessments */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Assessments</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {analytics.recentAssessments.map((assessment) => (
              <div key={assessment.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {assessment.institution}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getTierDisplayName(assessment.tier)}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {getIndustryDisplayName(assessment.industry)}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <span>{new Date(assessment.created_at).toLocaleDateString()}</span>
                      <span className="ml-2">•</span>
                      <span className={`ml-2 ${
                        assessment.status === 'completed' ? 'text-green-600' : 
                        assessment.status === 'in-progress' ? 'text-yellow-600' : 'text-gray-600'
                      }`}>
                        {assessment.status}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push(`/admin/assessment/${assessment.id}?test=true`)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
