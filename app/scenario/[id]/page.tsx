'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PageHero } from '@/components/PageHero';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

// Prevent static generation
export const dynamic = 'force-dynamic';

interface ScenarioData {
  id: string;
  name: string;
  description: string;
  baseline: any;
  variant: any;
  savings: number;
  costImpact: number;
  timeline: string;
  confidence: number;
  status: string;
  createdAt: string;
  createdBy: string;
}

interface SavingsBreakdown {
  category: string;
  baseline: number;
  variant: number;
  savings: number;
  percentage: number;
}

export default function ScenarioView() {
  const params = useParams();
  const { data: session, status } = useSession();
  const scenarioId = params.id as string;
  
  const [scenario, setScenario] = useState<ScenarioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'diff' | 'savings' | 'timeline'>('overview');

  // Fetch scenario data
  useEffect(() => {
    const fetchScenario = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/scenario/${scenarioId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch scenario');
        }
        
        const data = await response.json();
        setScenario(data);
      } catch (_err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching scenario:', err);
      } finally {
        setLoading(false);
      }
    };

    if (scenarioId) {
      fetchScenario();
    }
  }, [scenarioId]);

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading scenario...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    redirect('/auth');
  }

  // Mock savings data for demonstration
  const mockSavingsData: SavingsBreakdown[] = [
    { category: 'Personnel Costs', baseline: 2500000, variant: 2200000, savings: 300000, percentage: 12 },
    { category: 'Operational Expenses', baseline: 800000, variant: 720000, savings: 80000, percentage: 10 },
    { category: 'Technology Infrastructure', baseline: 500000, variant: 450000, savings: 50000, percentage: 10 },
    { category: 'Facilities & Utilities', baseline: 300000, variant: 270000, savings: 30000, percentage: 10 },
    { category: 'Training & Development', baseline: 150000, variant: 180000, savings: -30000, percentage: -20 },
  ];

  const totalBaseline = mockSavingsData.reduce((sum, item) => sum + item.baseline, 0);
  const totalVariant = mockSavingsData.reduce((sum, item) => sum + item.variant, 0);
  const totalSavings = totalBaseline - totalVariant;
  const totalPercentage = ((totalSavings / totalBaseline) * 100);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading scenario details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHero 
          title="Error Loading Scenario"
          subtitle="Unable to load scenario details"
        />
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Failed to Load Scenario
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero 
        title={scenario?.name || `Scenario ${scenarioId}`}
        subtitle={scenario?.description || 'Organizational restructuring scenario analysis'}
      />
      
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Scenario Header */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {scenario?.name || `Scenario ${scenarioId}`}
                </h1>
                <p className="text-gray-600 mt-2">
                  {scenario?.description || 'Detailed scenario comparison and financial analysis'}
                </p>
                <div className="flex gap-4 mt-4 text-sm text-gray-500">
                  <span>Status: <span className="font-medium text-blue-600">{scenario?.status || 'DRAFT'}</span></span>
                  <span>Timeline: <span className="font-medium">{scenario?.timeline || '12 months'}</span></span>
                  <span>Confidence: <span className="font-medium">{scenario?.confidence || 85}%</span></span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">
                  {formatCurrency(totalSavings)}
                </div>
                <div className="text-sm text-gray-600">Projected Savings</div>
                <div className="text-lg font-semibold text-green-600">
                  {formatPercentage(totalPercentage)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'diff', label: 'Scenario Diff' },
                { id: 'savings', label: 'Savings Analysis' },
                { id: 'timeline', label: 'Implementation' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Scenario Summary</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Current State (Baseline)</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      Traditional hierarchical structure with 5 management layers and 156 employees
                      across 12 departments. Average span of control: 4.2 employees per manager.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Proposed State (Variant)</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      Streamlined structure with 3 management layers and 142 employees across 8 departments.
                      Improved span of control: 6.8 employees per manager with cross-functional teams.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Savings</span>
                    <span className="font-semibold text-green-600">{formatCurrency(totalSavings)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ROI</span>
                    <span className="font-semibold">{formatPercentage(totalPercentage)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Positions Affected</span>
                    <span className="font-semibold">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Implementation Cost</span>
                    <span className="font-semibold text-orange-600">{formatCurrency(150000)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'savings' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Detailed Savings Analysis</h3>
              <p className="text-sm text-gray-600 mt-1">
                Breakdown of cost savings by category comparing baseline vs. proposed scenario
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Baseline
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Proposed
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Savings
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      % Change
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockSavingsData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {formatCurrency(item.baseline)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {formatCurrency(item.variant)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                        item.savings >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(item.savings)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                        item.percentage >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatPercentage(item.percentage)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-100">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      Total
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                      {formatCurrency(totalBaseline)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                      {formatCurrency(totalVariant)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600 text-right">
                      {formatCurrency(totalSavings)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600 text-right">
                      {formatPercentage(totalPercentage)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="p-6 bg-blue-50 border-t border-gray-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-800">Analysis Notes</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Training & Development shows an increase due to upskilling requirements for new roles.
                    This investment is expected to yield additional productivity gains not reflected in these numbers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'diff' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Structure (Baseline)</h3>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  <div className="font-medium text-red-800">Executive Layer</div>
                  <div className="text-sm text-red-600">CEO, COO, CFO (3 positions)</div>
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  <div className="font-medium text-red-800">Senior Management</div>
                  <div className="text-sm text-red-600">VPs, Directors (8 positions)</div>
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  <div className="font-medium text-red-800">Middle Management</div>
                  <div className="text-sm text-red-600">Managers, Supervisors (15 positions)</div>
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  <div className="font-medium text-red-800">Senior Staff</div>
                  <div className="text-sm text-red-600">Senior Analysts, Leads (28 positions)</div>
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  <div className="font-medium text-red-800">Staff</div>
                  <div className="text-sm text-red-600">Analysts, Associates (102 positions)</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Proposed Structure (Variant)</h3>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded">
                  <div className="font-medium text-green-800">Executive Layer</div>
                  <div className="text-sm text-green-600">CEO, COO, CFO (3 positions)</div>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <div className="font-medium text-blue-800">Senior Management</div>
                  <div className="text-sm text-blue-600">VPs, Directors (6 positions) ↓2</div>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded">
                  <div className="font-medium text-green-800">Cross-Functional Teams</div>
                  <div className="text-sm text-green-600">Team Leads, Product Owners (18 positions)</div>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded">
                  <div className="font-medium text-green-800">Specialists & Contributors</div>
                  <div className="text-sm text-green-600">Senior Staff, Specialists (115 positions)</div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-green-100 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Key Changes</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Eliminated middle management layer</li>
                  <li>• Reduced senior management by 2 positions</li>
                  <li>• Introduced cross-functional teams</li>
                  <li>• Increased span of control</li>
                  <li>• Total reduction: 14 positions</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Implementation Timeline</h3>
            
            <div className="space-y-8">
              {[
                {
                  phase: 'Phase 1: Planning & Communication',
                  timeframe: 'Months 1-2',
                  tasks: ['Stakeholder communication', 'Detailed planning', 'Training program design'],
                  status: 'upcoming'
                },
                {
                  phase: 'Phase 2: Training & Skill Development',
                  timeframe: 'Months 2-4',
                  tasks: ['Management training', 'Cross-functional team formation', 'Process documentation'],
                  status: 'upcoming'
                },
                {
                  phase: 'Phase 3: Gradual Transition',
                  timeframe: 'Months 4-8',
                  tasks: ['Role transitions', 'Process optimization', 'Performance monitoring'],
                  status: 'upcoming'
                },
                {
                  phase: 'Phase 4: Full Implementation',
                  timeframe: 'Months 8-12',
                  tasks: ['Complete structure rollout', 'Final adjustments', 'Results assessment'],
                  status: 'upcoming'
                }
              ].map((phase, index) => (
                <div key={index} className="flex">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      phase.status === 'completed' ? 'bg-green-100 text-green-600' :
                      phase.status === 'current' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-medium text-gray-900">{phase.phase}</h4>
                      <span className="text-sm text-gray-500">{phase.timeframe}</span>
                    </div>
                    <ul className="mt-2 text-sm text-gray-600 space-y-1">
                      {phase.tasks.map((task, taskIndex) => (
                        <li key={taskIndex}>• {task}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
