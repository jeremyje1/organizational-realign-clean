/**
 * Power BI Embed Component
 * React component for embedding Power BI reports
 * 
 * @version 1.0.0
 * @author NorthPath Strategies
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { EmbedConfig } from '@/lib/powerbi';

// Power BI JavaScript SDK types (you'll need to install powerbi-client)
declare global {
  interface Window {
    powerbi: any;
  }
}

interface PowerBIEmbedProps {
  reportId: string;
  workspaceId?: string;
  datasetId?: string;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: (error: any) => void;
}

export default function PowerBIEmbed({
  reportId,
  workspaceId,
  datasetId,
  className = '',
  style = {},
  onLoad,
  onError,
}: PowerBIEmbedProps) {
  const embedRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [embedConfig, setEmbedConfig] = useState<EmbedConfig | null>(null);

  // Load Power BI JavaScript SDK
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.powerbi.com/lib/powerbi.min.js';
    script.async = true;
    script.onload = () => {
      console.log('Power BI SDK loaded');
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Fetch embed configuration
  useEffect(() => {
    const fetchEmbedConfig = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({ reportId });
        if (workspaceId) params.append('workspaceId', workspaceId);
        if (datasetId) params.append('datasetId', datasetId);

        const response = await fetch(`/api/powerbi/embed-token?${params}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch embed configuration');
        }

        const data = await response.json();
        setEmbedConfig(data.embedConfig);
      } catch (_err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        onError?.(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmbedConfig();
  }, [reportId, workspaceId, datasetId, onError]);

  // Embed the Power BI report
  useEffect(() => {
    if (!embedConfig || !embedRef.current || !window.powerbi) {
      return;
    }

    try {
      // Clear any existing embed
      window.powerbi.reset(embedRef.current);

      // Embed the report
      const report = window.powerbi.embed(embedRef.current, embedConfig);

      // Set up event handlers
      report.on('loaded', () => {
        console.log('Power BI report loaded');
        onLoad?.();
      });

      report.on('error', (event: any) => {
        console.error('Power BI report error:', event.detail);
        setError('Error loading Power BI report');
        onError?.(event.detail);
      });

      // Clean up on unmount
      return () => {
        if (embedRef.current) {
          window.powerbi.reset(embedRef.current);
        }
      };
    } catch (_err) {
      console.error('Error embedding Power BI report:', err);
      setError('Failed to embed Power BI report');
      onError?.(err);
    }
  }, [embedConfig, onLoad, onError]);

  if (loading) {
    return (
      <div 
        className={`flex items-center justify-center min-h-[400px] bg-gray-50 ${className}`}
        style={style}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading Power BI report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className={`flex items-center justify-center min-h-[400px] bg-red-50 border border-red-200 rounded-md ${className}`}
        style={style}
      >
        <div className="text-center text-red-600">
          <svg className="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-medium">Error loading report</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={embedRef}
      className={`powerbi-embed w-full min-h-[400px] ${className}`}
      style={style}
    />
  );
}

// Example usage component
export function PowerBIDashboard() {
  const handleReportLoad = () => {
    console.log('Power BI report loaded successfully');
  };

  const handleReportError = (error: any) => {
    console.error('Power BI report error:', error);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Organizational Analysis Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-lg">
        <PowerBIEmbed
          reportId={process.env.NEXT_PUBLIC_POWERBI_REPORT_ID || 'your-report-id'}
          workspaceId={process.env.NEXT_PUBLIC_POWERBI_WORKSPACE_ID}
          className="h-[600px]"
          onLoad={handleReportLoad}
          onError={handleReportError}
        />
      </div>
    </div>
  );
}
