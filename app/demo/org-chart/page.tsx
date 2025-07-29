'use client';

import React from 'react';
import { OrgChartPage } from '@/components/OrgChartPage';

export default function OrgChartDemoPage() {
  // Demo assessment ID for testing
  const demoAssessmentId = 'demo-assessment-123';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Org Chart Generator Demo</h1>
          <p className="text-blue-100">
            Interactive organizational chart generation with scenario-based cost modeling
          </p>
        </div>
      </div>
      
      <OrgChartPage assessmentId={demoAssessmentId} />
    </div>
  );
}
