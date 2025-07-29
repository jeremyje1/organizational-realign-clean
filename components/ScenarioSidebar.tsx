/**
 * Scenario Cost Comparison Sidebar
 * 
 * @version 1.0.0
 * @author NorthPath Strategies
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

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

interface ScenarioSidebarProps {
  scenarios?: Scenarios;
  className?: string;
  onScenarioSelect?: (scenario: keyof Scenarios) => void;
}

export function ScenarioSidebar({ 
  scenarios, 
  className = '',
  onScenarioSelect
}: ScenarioSidebarProps) {
  const [selectedScenario, setSelectedScenario] = useState<keyof Scenarios>('current');
  const [customMultiplier, setCustomMultiplier] = useState([1.0]);

  const handleScenarioChange = (scenario: keyof Scenarios) => {
    setSelectedScenario(scenario);
    onScenarioSelect?.(scenario);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (percent: number): string => {
    return `${percent > 0 ? '+' : ''}${percent.toFixed(1)}%`;
  };

  const calculateCustomScenario = () => {
    if (!scenarios) return null;
    
    const multiplier = customMultiplier[0];
    const baseCost = scenarios.current.totalCost;
    const newCost = baseCost * multiplier;
    const difference = newCost - baseCost;
    const percentChange = ((newCost - baseCost) / baseCost) * 100;
    
    return {
      totalCost: newCost,
      roleCount: Math.round(scenarios.current.roleCount * multiplier),
      difference,
      percentChange
    };
  };

  if (!scenarios) {
    return (
      <div className={`space-y-4 ${className}`}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Cost Scenarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-500 py-8">
              <p>Generate an org chart to see cost scenarios</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const customScenario = calculateCustomScenario();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Scenario */}
      <Card className={selectedScenario === 'current' ? 'ring-2 ring-blue-500' : ''}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              Current State
            </CardTitle>
            <Button
              variant={selectedScenario === 'current' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleScenarioChange('current')}
            >
              View
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Annual Cost</span>
              <span className="font-semibold">{formatCurrency(scenarios.current.totalCost)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Number of Roles</span>
              <span className="font-semibold">{scenarios.current.roleCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg Cost/Role</span>
              <span className="font-semibold">{formatCurrency(scenarios.current.avgCostPerRole)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimized Scenario */}
      <Card className={selectedScenario === 'optimized' ? 'ring-2 ring-green-500' : ''}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              Optimized
            </CardTitle>
            <Button
              variant={selectedScenario === 'optimized' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleScenarioChange('optimized')}
            >
              View
            </Button>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {formatCurrency(scenarios.optimized.savings)} saved
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Annual Cost</span>
              <span className="font-semibold">{formatCurrency(scenarios.optimized.totalCost)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Number of Roles</span>
              <span className="font-semibold">{scenarios.optimized.roleCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Savings</span>
              <span className="font-semibold text-green-600">
                {formatPercent(-scenarios.optimized.savingsPercent)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expanded Scenario */}
      <Card className={selectedScenario === 'expanded' ? 'ring-2 ring-orange-500' : ''}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              Expanded
            </CardTitle>
            <Button
              variant={selectedScenario === 'expanded' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleScenarioChange('expanded')}
            >
              View
            </Button>
          </div>
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            {formatCurrency(scenarios.expanded.increase)} increase
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Annual Cost</span>
              <span className="font-semibold">{formatCurrency(scenarios.expanded.totalCost)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Number of Roles</span>
              <span className="font-semibold">{scenarios.expanded.roleCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Growth</span>
              <span className="font-semibold text-orange-600">
                {formatPercent(scenarios.expanded.increasePercent)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Scenario Builder */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            Custom Scenario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Cost Multiplier: {customMultiplier[0].toFixed(1)}x
              </label>
              <Slider
                value={customMultiplier}
                onValueChange={setCustomMultiplier}
                min={0.5}
                max={2.0}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.5x (50% reduction)</span>
                <span>2.0x (100% increase)</span>
              </div>
            </div>

            {customScenario && (
              <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Projected Cost</span>
                  <span className="font-semibold">{formatCurrency(customScenario.totalCost)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Projected Roles</span>
                  <span className="font-semibold">{customScenario.roleCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Difference</span>
                  <span className={`font-semibold ${
                    customScenario.difference > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {customScenario.difference > 0 ? '+' : ''}{formatCurrency(customScenario.difference)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Percent Change</span>
                  <span className={`font-semibold ${
                    customScenario.percentChange > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {formatPercent(customScenario.percentChange)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Comparison Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Scenario Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Most Efficient:</span>
              <span className="font-semibold text-green-600">
                Optimized ({formatPercent(-scenarios.optimized.savingsPercent)})
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Highest Growth:</span>
              <span className="font-semibold text-orange-600">
                Expanded ({formatPercent(scenarios.expanded.increasePercent)})
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Cost Range:</span>
              <span className="font-semibold">
                {formatCurrency(scenarios.optimized.totalCost)} - {formatCurrency(scenarios.expanded.totalCost)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
