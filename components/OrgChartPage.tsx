/**
 * Org Chart Page - Complete Interactive Experience
 * 
 * @version 1.0.0
 * @author NorthPath Strategies
 */

'use client';

import React, { useState, useEffect } from 'react';
import { OrgChartGenerator } from '@/components/OrgChartGenerator';
import { SimpleOrgChartViewer } from '@/components/SimpleOrgChartViewer';
import { ScenarioSidebar } from '@/components/ScenarioSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

interface OrgChartPageProps {
  assessmentId: string;
  initialData?: any;
}

interface OrgNode {
  id: string;
  roleTitle: string;
  fte: number;
  annualCost?: number;
  level?: number;
  children?: OrgNode[];
}

interface Scenarios {
  current: {
    totalCost: number;
    roleCount: number;
    avgCostPerRole: number;
  };
  optimized: {
    totalCost: number;
    roleCount: number;
    avgCostPerRole: number;
    savings: number;
    savingsPercent: number;
  };
  expanded: {
    totalCost: number;
    roleCount: number;
    avgCostPerRole: number;
    increase: number;
    increasePercent: number;
  };
}

export function OrgChartPage({ assessmentId, initialData }: OrgChartPageProps) {
  const [chartData, setChartData] = useState<OrgNode[]>([]);
  const [scenarios, setScenarios] = useState<Scenarios | null>(null);
  const [selectedNode, setSelectedNode] = useState<OrgNode | null>(null);
  const [issues, setIssues] = useState<Array<{ type: string; message: string; nodeId?: string }>>([]);
  const [activeTab, setActiveTab] = useState('generate');
  const [_isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load existing chart on mount
  const loadExistingChart = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/chart/${assessmentId}`);
      
      if (response.ok) {
        const data = await response.json();
        setChartData(data.data || []);
        setScenarios(data.scenarios || null);
        setIssues([]);
        setActiveTab('view');
        
        toast({
          title: "Chart Loaded",
          description: "Existing org chart loaded successfully.",
        });
      }
    } catch (error) {
      console.error('Failed to load existing chart:', error);
      // No toast for this - it's expected if no chart exists yet
    } finally {
      setIsLoading(false);
    }
  }, [assessmentId, toast]);

  useEffect(() => {
    if (initialData) {
      setChartData(initialData.data || []);
      setScenarios(initialData.scenarios || null);
      setIssues(initialData.issues || []);
      if (initialData.data?.length > 0) {
        setActiveTab('view');
      }
    } else {
      loadExistingChart();
    }
  }, [assessmentId, initialData, loadExistingChart]);

  const handleChartGenerated = (newChartData: any) => {
    setChartData(newChartData.data || []);
    setScenarios(newChartData.scenarios || null);
    setIssues(newChartData.issues || []);
    setActiveTab('view');
  };

  const handleNodeClick = (node: OrgNode) => {
    setSelectedNode(node);
  };

  const handleScenarioSelect = (scenario: keyof Scenarios) => {
    // In a full implementation, this would update the chart view
    // to show the selected scenario's data
    console.log('Selected scenario:', scenario);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Organizational Chart Generator
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Generate interactive org charts with scenario-based cost modeling. 
            Visualize your current structure, explore optimization opportunities, 
            and plan for organizational growth.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Chart Area - 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="generate" className="flex items-center gap-2">
                  Generate
                </TabsTrigger>
                <TabsTrigger value="view" className="flex items-center gap-2">
                  View Chart
                </TabsTrigger>
                <TabsTrigger value="details" className="flex items-center gap-2">
                  Details
                </TabsTrigger>
              </TabsList>

              {/* Generate Tab */}
              <TabsContent value="generate" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      Chart Generation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <OrgChartGenerator
                      assessmentId={assessmentId}
                      onChartGenerated={handleChartGenerated}
                    />
                  </CardContent>
                </Card>

                {/* Generation Instructions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      How It Works
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">1</div>
                        <div>
                          <h4 className="font-medium">Data Analysis</h4>
                          <p className="text-sm text-gray-600">We extract role information from your assessment responses</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">2</div>
                        <div>
                          <h4 className="font-medium">Hierarchy Building</h4>
                          <p className="text-sm text-gray-600">Roles are organized into a hierarchical structure based on reporting relationships</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">3</div>
                        <div>
                          <h4 className="font-medium">Cost Modeling</h4>
                          <p className="text-sm text-gray-600">Each role is assigned costs and multiple scenarios are generated</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">4</div>
                        <div>
                          <h4 className="font-medium">Visualization</h4>
                          <p className="text-sm text-gray-600">Interactive chart with scenario comparison and export options</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* View Tab */}
              <TabsContent value="view" className="space-y-6">
                {chartData.length > 0 ? (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          Interactive Org Chart
                        </CardTitle>
                        <div className="flex gap-2">
                          {scenarios && (
                            <Badge variant="secondary">
                              Total: {formatCurrency(scenarios.current.totalCost)}
                            </Badge>
                          )}
                          <Badge variant="outline">
                            {chartData.length} roles
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <SimpleOrgChartViewer
                        data={chartData}
                        onNodeClick={handleNodeClick}
                      />
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Chart Available</h3>
                        <p className="text-gray-600 mb-4">Generate an org chart to view it here.</p>
                        <Button onClick={() => setActiveTab('generate')}>
                          Generate Chart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Selected Node Details */}
                {selectedNode && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Selected Role Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Role Title</label>
                          <p className="text-lg font-semibold">{selectedNode.roleTitle}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">FTE</label>
                          <p className="text-lg font-semibold">{selectedNode.fte}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Annual Cost</label>
                          <p className="text-lg font-semibold">
                            {selectedNode.annualCost ? formatCurrency(selectedNode.annualCost) : 'TBD'}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Level</label>
                          <p className="text-lg font-semibold">{selectedNode.level || 0}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details" className="space-y-6">
                {/* Issues and Warnings */}
                {issues.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        Issues & Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {issues.map((issue, index) => (
                          <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex gap-2">
                              <div>
                                <div className="font-medium text-yellow-800">{issue.type}</div>
                                <div className="text-sm text-yellow-700">{issue.message}</div>
                                {issue.nodeId && (
                                  <div className="text-xs text-yellow-600 mt-1">Node: {issue.nodeId}</div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Chart Statistics */}
                {chartData.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Chart Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{chartData.length}</div>
                          <div className="text-sm text-blue-700">Total Roles</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {chartData.reduce((sum, node) => sum + node.fte, 0)}
                          </div>
                          <div className="text-sm text-green-700">Total FTE</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {Math.max(...chartData.map(node => node.level || 0)) + 1}
                          </div>
                          <div className="text-sm text-purple-700">Org Levels</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Scenario Sidebar - 1 column */}
          <div className="lg:col-span-1">
            <ScenarioSidebar 
              scenarios={scenarios || undefined}
              onScenarioSelect={handleScenarioSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
