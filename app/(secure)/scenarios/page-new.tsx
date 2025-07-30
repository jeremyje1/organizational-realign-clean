/**
 * Scenarios Page - Scenario Modeling & ROI Engine (Secure)
 * Secure access to scenario management and ROI calculation functionality
 * 
 * @version 2.1.0
 * @author NorthPath Strategies
 */

import { Metadata } from 'next';
import ScenarioManager from '@/components/scenarios/ScenarioManager';

export const metadata: Metadata = {
  title: 'Scenario Modeling & ROI Engine | NorthPath Strategies',
  description: 'Create, analyze, and manage organizational restructuring scenarios with advanced ROI calculations',
};

export default function ScenariosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <ScenarioManager />
      </div>
    </div>
  );
}
