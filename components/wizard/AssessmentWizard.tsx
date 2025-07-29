// Placeholder AssessmentWizard component
import React from 'react';

interface AssessmentWizardProps {
  assessmentId: string;
  onComplete: () => void;
}

export function AssessmentWizard({ assessmentId, onComplete }: AssessmentWizardProps) {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Assessment Wizard</h2>
      <p className="text-gray-600 mb-4">
        Assessment wizard for step: {assessmentId}
      </p>
      <button 
        onClick={onComplete}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Complete Assessment
      </button>
    </div>
  );
}
