/**
 * Enhanced Scenario Manager with Feature Flag Integration
 * Demonstrates how to integrate enterprise features with flag checks
 * 
 * @version 2.0.0
 * @author NorthPath Strategies
 */

'use client';

import React, { useState, useEffect } from 'react';
import { FeatureGate, EnterpriseFeatureBanner, useFeatureFlag } from '@/components/FeatureGate';

interface Scenario {
  id: string;
  name: string;
  description: string;
  savings?: number;
  costImpact?: number;
  timeline?: string;
  confidence?: number;
  status: string;
  createdAt: string;
  monteCarloResults?: any;
  dschScore?: number;
  roiProjection?: any;
}

interface EnhancedScenarioManagerProps {
  userTier?: string;
  userGroups?: string[];
}

export default function EnhancedScenarioManager({ 
  userTier = 'individual',
  userGroups = []
}: EnhancedScenarioManagerProps) {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Feature flag hooks
  const hasMonteCarloAccess = useFeatureFlag('MONTE_CARLO_SIMULATION', userTier, userGroups);
  const hasDschEnhanced = useFeatureFlag('DSCH_ENHANCED', userTier, userGroups);

  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/scenarios');
      if (response.ok) {
        const data = await response.json();
        setScenarios(data.scenarios || []);
      }
    } catch {
      setError('Failed to load scenarios');
    } finally {
      setLoading(false);
    }
  };

  const runMonteCarloSimulation = async (scenarioId: string) => {
    if (!hasMonteCarloAccess) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/scenarios/${scenarioId}/monte-carlo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const result = await response.json();
        setScenarios(prev => prev.map(s => 
          s.id === scenarioId 
            ? { ...s, monteCarloResults: result.simulation }
            : s
        ));
      }
    } catch {
      setError('Monte Carlo simulation failed');
    } finally {
      setLoading(false);
    }
  };

  const calculateDschScore = async (scenarioId: string) => {
    if (!hasDschEnhanced) return;
    
    try {
      const response = await fetch(`/api/scenarios/${scenarioId}/dsch`);
      if (response.ok) {
        const result = await response.json();
        setScenarios(prev => prev.map(s => 
          s.id === scenarioId 
            ? { ...s, dschScore: result.score }
            : s
        ));
      }
    } catch {
      setError('DSCH calculation failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Scenario Management</h1>
        <p className="text-gray-600 mt-2">
          Create, analyze, and compare organizational restructuring scenarios
        </p>
      </div>

      {/* Collaboration Banner */}
      <FeatureGate
        flag="REAL_TIME_COLLABORATION"
        userTier={userTier}
        userGroups={userGroups}
        fallback={
          <EnterpriseFeatureBanner
            featureName="Real-time Collaboration"
            description="Collaborate with team members in real-time, see live updates, and work together on scenario modeling."
            className="mb-6"
          />
        }
      >
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm font-medium text-blue-800">
              Real-time collaboration enabled • 3 team members online
            </span>
          </div>
        </div>
      </FeatureGate>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {scenarios.map((scenario) => (
          <div key={scenario.id} className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            {/* Scenario Header */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{scenario.name}</h3>
              <p className="text-gray-600 text-sm">{scenario.description}</p>
              
              {/* Status Badge */}
              <div className="mt-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  scenario.status === 'completed' ? 'bg-green-100 text-green-800' :
                  scenario.status === 'running' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {scenario.status.charAt(0).toUpperCase() + scenario.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Basic Metrics */}
            <div className="p-6 space-y-4">
              {scenario.savings && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Projected Savings</span>
                  <span className="text-sm font-medium text-green-600">
                    ${scenario.savings.toLocaleString()}
                  </span>
                </div>
              )}
              
              {scenario.confidence && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Confidence</span>
                  <span className="text-sm font-medium text-gray-900">
                    {scenario.confidence}%
                  </span>
                </div>
              )}

              {/* DSCH Enhanced Score */}
              <FeatureGate
                flag="DSCH_ENHANCED"
                userTier={userTier}
                userGroups={userGroups}
              >
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">DSCH Score</span>
                  <span className="text-sm font-medium text-blue-600">
                    {scenario.dschScore ? `${scenario.dschScore.toFixed(2)}` : 'Not calculated'}
                  </span>
                </div>
              </FeatureGate>
            </div>

            {/* Enterprise Actions */}
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <div className="space-y-3">
                {/* Monte Carlo Simulation */}
                <FeatureGate
                  flag="MONTE_CARLO_SIMULATION"
                  userTier={userTier}
                  userGroups={userGroups}
                  fallback={
                    <button className="w-full px-4 py-2 bg-gray-200 text-gray-500 text-sm rounded-md cursor-not-allowed">
                      Monte Carlo Simulation (Enterprise)
                    </button>
                  }
                >
                  <button
                    onClick={() => runMonteCarloSimulation(scenario.id)}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {scenario.monteCarloResults ? 'Re-run Simulation' : 'Run Monte Carlo'}
                  </button>
                </FeatureGate>

                {/* DSCH Enhanced */}
                <FeatureGate
                  flag="DSCH_ENHANCED"
                  userTier={userTier}
                  userGroups={userGroups}
                  fallback={
                    <button className="w-full px-4 py-2 bg-gray-200 text-gray-500 text-sm rounded-md cursor-not-allowed">
                      Enhanced DSCH Analysis (Enterprise)
                    </button>
                  }
                >
                  <button
                    onClick={() => calculateDschScore(scenario.id)}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    Calculate DSCH Score
                  </button>
                </FeatureGate>

                {/* View Details */}
                <button
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>

            {/* Monte Carlo Results Display */}
            <FeatureGate
              flag="MONTE_CARLO_SIMULATION"
              userTier={userTier}
              userGroups={userGroups}
            >
              {scenario.monteCarloResults && (
                <div className="p-6 bg-blue-50 border-t border-blue-200">
                  <h4 className="text-sm font-medium text-blue-900 mb-3">Monte Carlo Results</h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-blue-700">P50 Savings:</span>
                      <span className="font-medium text-blue-900 ml-1">
                        ${scenario.monteCarloResults.p50?.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-700">P90 Savings:</span>
                      <span className="font-medium text-blue-900 ml-1">
                        ${scenario.monteCarloResults.p90?.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-700">Success Rate:</span>
                      <span className="font-medium text-blue-900 ml-1">
                        {scenario.monteCarloResults.successRate}%
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-700">Risk Score:</span>
                      <span className="font-medium text-blue-900 ml-1">
                        {scenario.monteCarloResults.riskScore}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </FeatureGate>
          </div>
        ))}
      </div>

      {/* Advanced Analytics Panel */}
      <FeatureGate
        flag="ADVANCED_ANALYTICS"
        userTier={userTier}
        userGroups={userGroups}
        fallback={
          <EnterpriseFeatureBanner
            featureName="Advanced Analytics"
            description="Unlock powerful analytics dashboards, comparative analysis, and predictive modeling capabilities."
            className="mt-8"
          />
        }
      >
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Advanced Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{scenarios.length}</div>
              <div className="text-sm text-green-700">Total Scenarios</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {scenarios.filter(s => s.monteCarloResults).length}
              </div>
              <div className="text-sm text-blue-700">Simulated Scenarios</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {scenarios.filter(s => s.dschScore).length}
              </div>
              <div className="text-sm text-purple-700">DSCH Analyzed</div>
            </div>
          </div>
        </div>
      </FeatureGate>

      {/* Error Display */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-900">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
}
