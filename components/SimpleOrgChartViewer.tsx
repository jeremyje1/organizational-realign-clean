/**
 * Simple Org Chart Viewer (Non-D3 Version)
 * 
 * @version 1.0.0
 * @author NorthPath Strategies
 */

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface OrgNode {
  id: string;
  roleTitle: string;
  fte: number;
  annualCost?: number;
  level?: number;
  children?: OrgNode[];
}

interface SimpleOrgChartViewerProps {
  data: OrgNode[];
  className?: string;
  onNodeClick?: (node: OrgNode) => void;
}

export function SimpleOrgChartViewer({ 
  data, 
  className = '',
  onNodeClick 
}: SimpleOrgChartViewerProps) {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderNode = (node: OrgNode, level: number = 0) => {
    const bgColor = level === 0 ? 'bg-blue-600' : 
                    level === 1 ? 'bg-blue-500' : 
                    level === 2 ? 'bg-blue-400' : 'bg-blue-300';
    
    const textColor = level <= 2 ? 'text-white' : 'text-gray-900';

    return (
      <div key={node.id} className={`mb-4 ${level > 0 ? 'ml-8' : ''}`}>
        <Card 
          className={`${bgColor} ${textColor} cursor-pointer hover:shadow-lg transition-shadow`}
          onClick={() => onNodeClick?.(node)}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">{node.roleTitle}</CardTitle>
              <Badge variant="secondary" className="bg-white/20 text-white">
                Level {level}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex justify-between items-center text-sm">
              <span>FTE: {node.fte}</span>
              <span>
                {node.annualCost ? formatCurrency(node.annualCost) : 'Cost: TBD'}
              </span>
            </div>
          </CardContent>
        </Card>
        
        {node.children && node.children.length > 0 && (
          <div className="relative">
            {/* Connection line */}
            <div className="absolute left-4 top-0 w-0.5 h-4 bg-gray-300"></div>
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (!data.length) {
    return (
      <div className={`flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 ${className}`}>
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Chart Data</h3>
          <p className="text-gray-600">Generate an org chart to view it here.</p>
        </div>
      </div>
    );
  }

  const totalNodes = data.reduce((count, node) => {
    const countChildren = (n: OrgNode): number => 1 + (n.children?.reduce((sum, child) => sum + countChildren(child), 0) || 0);
    return count + countChildren(node);
  }, 0);

  const totalCost = data.reduce((cost, node) => {
    const sumCost = (n: OrgNode): number => (n.annualCost || 0) + (n.children?.reduce((sum, child) => sum + sumCost(child), 0) || 0);
    return cost + sumCost(node);
  }, 0);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Chart Info */}
      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
        <div>
          <h3 className="font-semibold text-gray-900">Organization Chart</h3>
          <p className="text-sm text-gray-600">Click on any role to view details</p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-gray-900">{totalNodes}</div>
            <div className="text-gray-600">Total Roles</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-900">{formatCurrency(totalCost)}</div>
            <div className="text-gray-600">Total Cost</div>
          </div>
        </div>
      </div>

      {/* Chart Display */}
      <div className="space-y-4">
        {data.map(node => renderNode(node, 0))}
      </div>

      {/* Legend */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Chart Legend</h4>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
            <span>C-Level (Level 0)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>VP Level (Level 1)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-400 rounded"></div>
            <span>Director Level (Level 2)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-300 rounded"></div>
            <span>Manager+ (Level 3+)</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-600">
          <strong>Note:</strong> This is a simplified view. Full interactive D3 chart coming soon!
        </div>
      </div>
    </div>
  );
}
