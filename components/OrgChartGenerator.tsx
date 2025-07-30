/**
 * Org Chart Generator Button
 * 
 * @version 1.0.0
 * @author NorthPath Strategies
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface OrgChartGeneratorProps {
  assessmentId: string;
  onChartGenerated?: (chartData: any) => void;
  className?: string;
}

export function OrgChartGenerator({ 
  assessmentId, 
  onChartGenerated,
  className = ''
}: OrgChartGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [chartData, setChartData] = useState<any>(null);
  const { toast } = useToast();

  const generateChart = async (format: 'svg' | 'json' | 'csv' = 'json') => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/chart/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assessmentId,
          includeScenarios: true,
          exportFormat: format,
          saveToDatabase: true
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to generate chart');
      }

      if (format === 'svg') {
        // Handle SVG download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `org-chart-${assessmentId}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        toast({
          title: "Chart Downloaded",
          description: "Your org chart has been downloaded as an SVG file.",
        });
      } else if (format === 'csv') {
        // Handle CSV download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `org-chart-${assessmentId}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        toast({
          title: "Data Exported",
          description: "Your org chart data has been exported as a CSV file.",
        });
      } else {
        // Handle JSON response
        const data = await response.json();
        setChartData(data);
        onChartGenerated?.(data);
        
        toast({
          title: "Chart Generated",
          description: `Created org chart with ${data.metadata?.roleCount || 0} roles.`,
        });
      }

    } catch (error) {
      console.error('Chart generation failed:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate org chart",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadExisting = async (format: 'svg' | 'csv') => {
    try {
      const response = await fetch(`/api/chart/${assessmentId}?format=${format}`);
      
      if (!response.ok) {
        throw new Error('Chart not found');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `org-chart-${assessmentId}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Download Complete",
        description: `Org chart downloaded as ${format.toUpperCase()}.`,
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download chart. Try generating a new one.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Generation Button */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={() => generateChart('json')}
          disabled={isGenerating}
          size="lg"
          className="flex-1"
        >
          {isGenerating ? 'Generating Chart...' : 'Generate Org Chart'}
        </Button>
        
        {chartData && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => downloadExisting('svg')}
              size="lg"
            >
              SVG
            </Button>
            
            <Button
              variant="outline"
              onClick={() => downloadExisting('csv')}
              size="lg"
            >
              CSV
            </Button>
          </div>
        )}
      </div>

      {/* Quick Export Options */}
      {!chartData && (
        <div className="flex gap-2 text-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => generateChart('svg')}
            disabled={isGenerating}
          >
            Generate & Download SVG
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => generateChart('csv')}
            disabled={isGenerating}
          >
            Export as CSV
          </Button>
        </div>
      )}

      {/* Chart Preview Info */}
      {chartData && (
        <div className="p-4 bg-gray-50 rounded-lg border">
          <h4 className="font-medium text-gray-900 mb-2">Chart Generated Successfully</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Roles:</span>
              <div>{chartData.metadata?.roleCount || 0}</div>
            </div>
            <div>
              <span className="font-medium">Current Cost:</span>
              <div>${chartData.scenarios?.current?.totalCost?.toLocaleString() || 0}</div>
            </div>
            <div>
              <span className="font-medium">Issues:</span>
              <div>{chartData.issues?.length || 0}</div>
            </div>
            <div>
              <span className="font-medium">Generated:</span>
              <div>{new Date(chartData.metadata?.generatedAt).toLocaleDateString()}</div>
            </div>
          </div>
          
          {chartData.issues && chartData.issues.length > 0 && (
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
              <div className="font-medium text-yellow-800 text-sm">Issues Found:</div>
              <ul className="mt-1 text-xs text-yellow-700 list-disc list-inside">
                {chartData.issues.slice(0, 3).map((issue: any, index: number) => (
                  <li key={index}>{issue.message}</li>
                ))}
                {chartData.issues.length > 3 && (
                  <li>+ {chartData.issues.length - 3} more issues</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
