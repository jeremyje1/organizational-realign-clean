/**
 * Scenario Management Component
 * Basic UI for testing scenario modeling functionality
 * 
 * @version 1.0.0
 * @author NorthPath Strategies
 */

'use client';

import React, { useState, useEffect } from 'react';

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
}

interface CreateScenarioData {
  name: string;
  description: string;
  organizationId: string;
  baseline: any;
  variant: any;
}

export default function ScenarioManager() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [comparisonResult, setComparisonResult] = useState<any>(null);
  const [showComparison, setShowComparison] = useState(false);
  
  const [formData, setFormData] = useState<CreateScenarioData>({
    name: '',
    description: '',
    organizationId: 'org_1',
    baseline: {
      organizationChart: { departments: [], positions: [] },
      currentMetrics: {
        totalEmployees: 100,
        managementLayers: 5,
        spanOfControl: 6
      },
      costStructure: {
        totalAnnualCost: 5000000,
        managementCost: 1500000
      }
    },
    variant: {
      proposedChart: { departments: [], positions: [] },
      projectedMetrics: {
        totalEmployees: 95,
        managementLayers: 4,
        spanOfControl: 8
      },
      changesRequired: [
        {
          type: 'RESTRUCTURE',
          description: 'Reduce management layers',
          riskLevel: 'MEDIUM',
          impact: 'HIGH'
        }
      ],
      implementationPlan: [
        {
          phase: 'Planning',
          duration: 4,
          tasks: ['Analyze current structure'],
          risks: [{ probability: 0.2, impact: 'LOW', description: 'Planning delays' }]
        }
      ]
    }
  });

  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/scenarios?organizationId=org_1');
      const result = await response.json();
      
      if (result.success) {
        setScenarios(result.data);
      } else {
        setError(result.error || 'Failed to load scenarios');
      }
    } catch (_err) {
      setError('Failed to load scenarios');
      console.error('Error loading scenarios:', err);
    } finally {
      setLoading(false);
    }
  };

  const createScenario = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setScenarios([result.data, ...scenarios]);
        setShowCreateForm(false);
        setFormData({
          ...formData,
          name: '',
          description: ''
        });
      } else {
        setError(result.error || 'Failed to create scenario');
      }
    } catch (_err) {
      setError('Failed to create scenario');
      console.error('Error creating scenario:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateROI = async (scenarioId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/scenarios/${scenarioId}/roi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          calculationType: 'SIMPLE',
          assumptions: {},
          discountRate: 0.08
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(`ROI Calculated: ${result.data.calculation.financialMetrics.roiPercentage}%`);
        loadScenarios(); // Refresh scenarios
      } else {
        setError(result.error || 'Failed to calculate ROI');
      }
    } catch (_err) {
      setError('Failed to calculate ROI');
      console.error('Error calculating ROI:', err);
    } finally {
      setLoading(false);
    }
  };

  const compareScenarios = async () => {
    if (selectedForComparison.length !== 2) {
      setError('Please select exactly 2 scenarios to compare');
      return;
    }

    try {
      setLoading(true);
      const [scenario1, scenario2] = selectedForComparison;
      const response = await fetch(`/api/scenarios/${scenario1}/compare?with=${scenario2}`);
      const result = await response.json();
      
      if (result.success) {
        setComparisonResult(result.data);
        setShowComparison(true);
      } else {
        setError(result.error || 'Failed to compare scenarios');
      }
    } catch (_err) {
      setError('Failed to compare scenarios');
      console.error('Error comparing scenarios:', err);
    } finally {
      setLoading(false);
    }
  };

  const analyzeScenarioStructure = async (scenarioId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/scenarios/${scenarioId}/compare`);
      const result = await response.json();
      
      if (result.success) {
        setComparisonResult(result.data);
        setShowComparison(true);
      } else {
        setError(result.error || 'Failed to analyze scenario');
      }
    } catch (_err) {
      setError('Failed to analyze scenario');
      console.error('Error analyzing scenario:', err);
    } finally {
      setLoading(false);
    }
  };

  const performDSCHAnalysis = async (scenarioId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/scenarios/${scenarioId}/dsch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysisType: 'COMPREHENSIVE_DSCH'
        })
      });
      const result = await response.json();
      
      if (result.success) {
        setComparisonResult(result.data);
        setShowComparison(true);
      } else {
        setError(result.error || 'Failed to perform DSCH analysis');
      }
    } catch (_err) {
      setError('Failed to perform DSCH analysis');
      console.error('Error performing DSCH analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleScenarioForComparison = (scenarioId: string) => {
    setSelectedForComparison(prev => {
      if (prev.includes(scenarioId)) {
        return prev.filter(id => id !== scenarioId);
      } else if (prev.length < 2) {
        return [...prev, scenarioId];
      } else {
        // Replace first selected with new one
        return [prev[1], scenarioId];
      }
    });
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value?: number) => {
    if (!value) return 'N/A';
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Scenario Modeling & ROI Engine
        </h1>
        <p className="text-gray-600">
          Create, analyze, and manage organizational restructuring scenarios
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800 text-sm mt-1"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          disabled={loading}
        >
          {showCreateForm ? 'Cancel' : 'Create New Scenario'}
        </button>
        
        {selectedForComparison.length === 2 && (
          <button
            onClick={compareScenarios}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            disabled={loading}
          >
            Compare Selected Scenarios
          </button>
        )}
        
        {selectedForComparison.length > 0 && (
          <button
            onClick={() => setSelectedForComparison([])}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
          >
            Clear Selection ({selectedForComparison.length})
          </button>
        )}
      </div>

      {showCreateForm && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Create New Scenario</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scenario Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter scenario name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={createScenario}
              disabled={!formData.name || loading}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Scenario'}
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading && scenarios.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading scenarios...</p>
          </div>
        ) : scenarios.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No scenarios found. Create your first scenario to get started.
          </div>
        ) : (
          scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className={`bg-white rounded-lg border p-6 hover:shadow-md transition-shadow ${
                selectedForComparison.includes(scenario.id) 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedForComparison.includes(scenario.id)}
                    onChange={() => toggleScenarioForComparison(scenario.id)}
                    className="mt-1"
                    disabled={!selectedForComparison.includes(scenario.id) && selectedForComparison.length >= 2}
                  />
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {scenario.name}
                  </h3>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  scenario.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                  scenario.status === 'UNDER_REVIEW' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {scenario.status}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {scenario.description || 'No description provided'}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Annual Savings:</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(scenario.savings)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Investment:</span>
                  <span className="font-medium text-orange-600">
                    {formatCurrency(scenario.costImpact)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Timeline:</span>
                  <span className="font-medium">{scenario.timeline || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Confidence:</span>
                  <span className="font-medium">
                    {formatPercentage(scenario.confidence)}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => calculateROI(scenario.id)}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  Calculate ROI
                </button>
                <button
                  onClick={() => analyzeScenarioStructure(scenario.id)}
                  disabled={loading}
                  className="flex-1 bg-purple-600 text-white px-3 py-2 rounded text-sm hover:bg-purple-700 disabled:opacity-50"
                >
                  Analyze Structure
                </button>
                <button
                  onClick={() => performDSCHAnalysis(scenario.id)}
                  disabled={loading}
                  className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded text-sm hover:bg-indigo-700 disabled:opacity-50"
                >
                  DSCH Analysis
                </button>
                <button
                  onClick={() => setSelectedScenario(scenario.id)}
                  className="flex-1 bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-300"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showComparison && comparisonResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Scenario Analysis Results</h3>
              <button
                onClick={() => setShowComparison(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-medium mb-3">Financial Impact</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Cost Change:</span>
                    <span className={comparisonResult.summary?.totalCostChange > 0 ? 'text-red-600' : 'text-green-600'}>
                      {formatCurrency(comparisonResult.summary?.totalCostChange || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Percentage Change:</span>
                    <span className={comparisonResult.summary?.percentageCostChange > 0 ? 'text-red-600' : 'text-green-600'}>
                      {formatPercentage(comparisonResult.summary?.percentageCostChange || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>FTE Change:</span>
                    <span className={comparisonResult.summary?.fteChange > 0 ? 'text-orange-600' : 'text-blue-600'}>
                      {comparisonResult.summary?.fteChange || 0}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-3">Structural Changes</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Positions Added:</span>
                    <span className="text-green-600">{comparisonResult.summary?.structuralChanges?.added || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Positions Removed:</span>
                    <span className="text-red-600">{comparisonResult.summary?.structuralChanges?.removed || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Positions Modified:</span>
                    <span className="text-orange-600">{comparisonResult.summary?.structuralChanges?.modified || 0}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {comparisonResult.summary?.recommendations?.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-medium mb-3">Recommendations</h4>
                <ul className="list-disc list-inside space-y-1">
                  {comparisonResult.summary.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="text-sm text-gray-700">{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* DSCH Analysis Results */}
            {comparisonResult.dschAnalysis && (
              <div className="mt-6">
                <h4 className="text-lg font-medium mb-3">DSCH Analysis</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded">
                    <h5 className="font-medium mb-2">Baseline Metrics</h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Structural Complexity:</span>
                        <span>{((comparisonResult.dschAnalysis.baseline?.structuralComplexity || 0) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Operational Efficiency:</span>
                        <span>{((comparisonResult.dschAnalysis.baseline?.operationalEfficiency || 0) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cultural Alignment:</span>
                        <span>{((comparisonResult.dschAnalysis.baseline?.culturalAlignment || 0) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Strategic Readiness:</span>
                        <span>{((comparisonResult.dschAnalysis.baseline?.strategicReadiness || 0) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded">
                    <h5 className="font-medium mb-2">Projected Improvements</h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Structural Complexity:</span>
                        <span className={comparisonResult.dschAnalysis.improvement?.structuralComplexity > 0 ? 'text-green-600' : 'text-red-600'}>
                          {comparisonResult.dschAnalysis.improvement?.structuralComplexity > 0 ? '+' : ''}
                          {((comparisonResult.dschAnalysis.improvement?.structuralComplexity || 0) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Operational Efficiency:</span>
                        <span className={comparisonResult.dschAnalysis.improvement?.operationalEfficiency > 0 ? 'text-green-600' : 'text-red-600'}>
                          {comparisonResult.dschAnalysis.improvement?.operationalEfficiency > 0 ? '+' : ''}
                          {((comparisonResult.dschAnalysis.improvement?.operationalEfficiency || 0) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cultural Alignment:</span>
                        <span className={comparisonResult.dschAnalysis.improvement?.culturalAlignment > 0 ? 'text-green-600' : 'text-red-600'}>
                          {comparisonResult.dschAnalysis.improvement?.culturalAlignment > 0 ? '+' : ''}
                          {((comparisonResult.dschAnalysis.improvement?.culturalAlignment || 0) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Overall Improvement:</span>
                        <span className={comparisonResult.dschAnalysis.improvement?.overallImprovement > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                          {comparisonResult.dschAnalysis.improvement?.overallImprovement > 0 ? '+' : ''}
                          {(comparisonResult.dschAnalysis.improvement?.overallImprovement || 0).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {comparisonResult.summary?.riskFactors?.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-medium mb-3 text-red-700">Risk Factors</h4>
                <ul className="list-disc list-inside space-y-1">
                  {comparisonResult.summary.riskFactors.map((risk: string, index: number) => (
                    <li key={index} className="text-sm text-red-600">{risk}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <button
              onClick={() => setShowComparison(false)}
              className="mt-6 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {selectedScenario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Scenario Details</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(scenarios.find(s => s.id === selectedScenario), null, 2)}
            </pre>
            <button
              onClick={() => setSelectedScenario(null)}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
