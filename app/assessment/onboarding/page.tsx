'use client';

import React, { useState } from 'react';
import { PageHero } from '@/components/PageHero';
import { PricingTier, PRICING_TIERS } from '@/lib/tierConfiguration';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';

export default function AssessmentOnboardingPage() {
  const [selectedTier, setSelectedTier] = useState<PricingTier>('one-time-diagnostic');

  const tierInfo = PRICING_TIERS[selectedTier];

  const features = [
    {
      title: 'One-Click Org Chart Generator',
      description: 'Instantly generate interactive org charts with scenario costing and SVG/CSV exports.',
      icon: '📊'
    },
    {
      title: 'Dynamic Survey',
      description: 'Questions adapt to your institution type and earlier answers.',
      icon: '🔄'
    },
    {
      title: 'Secure File Uploads',
      description: 'Upload org charts, salary rosters, and system inventories — all encrypted in transit and at rest.',
      icon: '🔒'
    },
    {
      title: 'AI Scoring Engine (DSCH / CRF / LEI)',
      description: 'Produces your Organizational Complexity Index (OCI™, HOCI™, or ICI™).',
      icon: '🤖'
    },
    {
      title: 'Instant Snapshot Report',
      description: 'Quick‑view metrics in minutes; full PDF within 5–10 business days.',
      icon: '📊'
    },
    {
      title: 'Collaboration‑Ready',
      description: 'Invite colleagues to answer their sections or review data.',
      icon: '👥'
    }
  ];

  const checklist = [
    {
      step: 'Select Package',
      owner: 'Project sponsor',
      target: 'Today',
      notes: 'Already done if you reached this page.',
      completed: true
    },
    {
      step: 'Gather Required Files',
      owner: 'HR / Finance / IT',
      target: '+3 days',
      notes: 'CSV/XLSX/XLS/PDF/DOCX/ZIP accepted.',
      completed: false
    },
    {
      step: 'Identify Section Leads',
      owner: 'Project sponsor',
      target: '+3 days',
      notes: 'At least 1 per area.',
      completed: false
    },
    {
      step: 'Send Assessment Invites',
      owner: 'NorthPath platform',
      target: 'Auto',
      notes: 'Via "Team" tab after you click Start Assessment.',
      completed: false
    },
    {
      step: 'Complete Survey',
      owner: 'Section leads',
      target: '+10 days',
      notes: 'Save‑and‑resume supported.',
      completed: false
    },
    {
      step: 'Review Draft Report',
      owner: 'Exec sponsor + NorthPath analyst',
      target: '+15 days',
      notes: 'Schedule 60‑min read‑out.',
      completed: false
    }
  ];

  const requiredFiles = [
    {
      code: 'U‑01',
      file: 'org_units.csv',
      why: 'Unit hierarchy and reporting lines',
      template: true
    },
    {
      code: 'U‑02',
      file: 'positions.csv',
      why: 'Role titles, FTE, salary, benefits %',
      template: true
    },
    {
      code: 'U‑03',
      file: 'people.csv',
      why: 'Span‑of‑control and vacancy map',
      template: true
    },
    {
      code: 'U‑04',
      file: 'systems_inventory.csv',
      why: 'License cost & redundancy analysis',
      template: true
    },
    {
      code: 'U‑05',
      file: 'Strategic plan (PDF)',
      why: 'Constraints and mission alignment',
      template: false
    },
    {
      code: 'Optional',
      file: 'BPMN diagrams (.zip)',
      why: 'Process mining accuracy',
      template: false
    }
  ];

  const teamRoles = [
    {
      role: 'Executive Sponsor',
      responsibility: 'Approves scope & timelines; attends read‑out.'
    },
    {
      role: 'HR / People Ops',
      responsibility: 'Provides org_units and positions files.'
    },
    {
      role: 'Finance / Budget',
      responsibility: 'Supplies salary, overhead, and benefit figures.'
    },
    {
      role: 'IT / CIO',
      responsibility: 'Exports systems_inventory.xlsx; verifies license counts.'
    },
    {
      role: 'Institutional Research / Quality',
      responsibility: 'Answers governance & KPI sections.'
    },
    {
      role: 'Department Leads (optional)',
      responsibility: 'Validate span‑of‑control and process details.'
    }
  ];

  const timeline = [
    { phase: 'Prep', days: '0-3', tasks: ['Select package', 'Gather files', 'Identify section leads'] },
    { phase: 'Execution', days: '3-10', tasks: ['Send invites', 'Complete survey', 'Upload docs'] },
    { phase: 'Wrap‑Up', days: '10-15', tasks: ['AI processing', 'Analyst review', 'Executive read‑out'] }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero 
        title="Organizational Realignment Diagnostic"
        subtitle="Our AI‑enhanced diagnostic pinpoints structural inefficiencies, cost‑saving opportunities, and cultural friction points in under 60 minutes of staff time."
      />
      
      <div className="max-w-7xl mx-auto py-12 px-4 space-y-12">
        
        {/* Quick Wins Promotion */}
        <section className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                🎯 Not sure where to start? Try our Free Quick Wins Assessment!
              </h3>
              <p className="text-green-700">
                Get immediate cost-saving recommendations in just 5 minutes. Quick email required for your results.
              </p>
            </div>
            <a 
              href="/quick-wins"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
            >
              Try Quick Wins Assessment
              <span>→</span>
            </a>
          </div>
        </section>
        
        {/* Package Selection */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Selected Package</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {Object.entries(PRICING_TIERS).map(([key, tier]) => (
              <button
                key={key}
                onClick={() => setSelectedTier(key as PricingTier)}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  selectedTier === key
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-semibold text-sm">{tier.name}</h3>
                <p className="text-xs text-gray-600">${tier.price.toLocaleString()}</p>
              </button>
            ))}
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">{tierInfo.name}</h3>
            <p className="text-blue-800 mb-4">{tierInfo.targetCustomer}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Core Deliverables:</h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  {tierInfo.coreDeliverables.map((deliverable, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-4 h-4 bg-blue-500 rounded-full text-xs text-white flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">✓</span>
                      {deliverable}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Assessment Scope:</h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>• {tierInfo.assessmentScope.questionCount} targeted questions</li>
                  <li>• {tierInfo.assessmentScope.reportPages}-page detailed report</li>
                  <li>• {tierInfo.assessmentScope.algorithms.join(', ')} analysis</li>
                  <li>• {tierInfo.assessmentScope.followUpSupport}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* What the Tool Does */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">1. What the Tool Does — In Plain English</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <div className="text-sm mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Launch Checklist */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Quick Launch Checklist</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Step</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {checklist.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.step}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.owner}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-bold">{item.target}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.notes}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.completed ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Complete
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Documents to Gather */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Documents to Gather</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Why We Need It</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requiredFiles.map((file, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{file.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{file.file}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{file.why}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {file.template ? (
                        <a 
                          href={`/downloads/${file.file}`}
                          download
                          className="inline-flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                          Download
                        </a>
                      ) : file.code === 'U‑05' ? (
                        <a 
                          href="/downloads/strategic-plan-template.pdf"
                          download
                          className="inline-flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                          Template
                        </a>
                      ) : file.code === 'Optional' ? (
                        <a 
                          href="/downloads/bpmn-diagram-guide.zip"
                          download
                          className="inline-flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                          Guide
                        </a>
                      ) : (
                        '–'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Tip:</strong> If you can&apos;t extract all salary data, supply salary bands; our model will interpolate.
            </p>
          </div>
        </section>

        {/* Who Should Be Involved */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Who Should Be Involved</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teamRoles.map((role, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{role.role}</h3>
                <p className="text-sm text-gray-600">{role.responsibility}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              Enterprise clients often include <strong>Change‑Management / PMO</strong> for implementation planning.
            </p>
          </div>
        </section>

        {/* Adding Team Members */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Adding Team Members to the Assessment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-semibold text-blue-900 mb-2">1. Access Team Tab</h4>
              <p className="text-sm text-blue-800">Click the <strong>Team</strong> tab once inside the assessment wizard.</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-semibold text-blue-900 mb-2">2. Set Permissions</h4>
              <p className="text-sm text-blue-800">Enter each colleague&apos;s email and select their <strong>section permissions</strong> (e.g., &quot;Finance only&quot;).</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-semibold text-blue-900 mb-2">3. Secure Delivery</h4>
              <p className="text-sm text-blue-800">They receive a secure, single‑use link.</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-semibold text-blue-900 mb-2">4. Track Progress</h4>
              <p className="text-sm text-blue-800">Progress indicators show which sections are complete.</p>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">✓</span>
              </div>
              <div>
                <p className="text-sm text-green-800">
                  <strong>Auto-Save & Security:</strong> The survey auto‑saves every 30 seconds; partial answers are fine. 
                  Each invite token expires after 14 days or on survey submission.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Timeline at a Glance</h2>
          <div className="space-y-8">
            {timeline.map((phase, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-6 pb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{phase.phase}</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    Days {phase.days}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {phase.tasks.map((task, taskIndex) => (
                    <div key={taskIndex} className="bg-gray-50 px-4 py-3 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-sm text-purple-800">
              <strong>Enterprise customers:</strong> Timelines can compress if you purchase the Accelerated Sprint add‑on.
            </p>
          </div>
        </section>

        {/* Data Security & Compliance */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Data Security & Compliance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <h3 className="font-semibold text-gray-900 mb-2">SOC‑2‑Aligned AWS Infrastructure</h3>
                <p className="text-sm text-gray-600">Enterprise-grade cloud security with compliance monitoring</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <h3 className="font-semibold text-gray-900 mb-2">TLS 1.3 End‑to‑End Encryption</h3>
                <p className="text-sm text-gray-600">All data encrypted in transit with latest protocols</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <h3 className="font-semibold text-gray-900 mb-2">AES‑256 at Rest with Object‑Lock</h3>
                <p className="text-sm text-gray-600">Military-grade encryption for stored data</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <h3 className="font-semibold text-gray-900 mb-2">FERPA‑Aligned Controls</h3>
                <p className="text-sm text-gray-600">HIPAA BAA available on request</p>
              </div>
            </div>
          </div>
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Data Retention:</strong> Data purged after 90 days unless you enable ongoing monitoring.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Frequently Asked Onboarding Questions</h2>
          <div className="space-y-4">
            <details className="border border-gray-200 rounded-lg">
              <summary className="cursor-pointer p-4 font-semibold text-gray-900 hover:bg-gray-50">
                How many people can I invite?
              </summary>
              <div className="px-4 pb-4 text-gray-600">
                <p>Unlimited. We recommend 3‑8 subject‑matter experts for most mid‑sized institutions.</p>
              </div>
            </details>

            <details className="border border-gray-200 rounded-lg">
              <summary className="cursor-pointer p-4 font-semibold text-gray-900 hover:bg-gray-50">
                Can I pause and resume?
              </summary>
              <div className="px-4 pb-4 text-gray-600">
                <p>Yes. The wizard auto‑saves; you can leave and return at any time before submission.</p>
              </div>
            </details>

            <details className="border border-gray-200 rounded-lg">
              <summary className="cursor-pointer p-4 font-semibold text-gray-900 hover:bg-gray-50">
                What file formats do you accept?
              </summary>
              <div className="px-4 pb-4 text-gray-600">
                <p>.csv, .xlsx, .xls, .pdf, .docx, .zip (for BPMN diagrams).</p>
              </div>
            </details>

            <details className="border border-gray-200 rounded-lg">
              <summary className="cursor-pointer p-4 font-semibold text-gray-900 hover:bg-gray-50">
                How do we handle sensitive salary data?
              </summary>
              <div className="px-4 pb-4 text-gray-600">
                <p><strong>Option A</strong> – Provide anonymized salary bands.</p>
                <p><strong>Option B</strong> – Provide hashed employee IDs. Our model works with either.</p>
              </div>
            </details>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Begin?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Your {tierInfo.name} package is configured and ready to launch.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <button
              onClick={() => {
                // Direct to tier-based assessment
                window.location.href = `/assessment/tier-based?tier=${selectedTier}`;
              }}
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg"
            >
              👉 Begin Assessment Now
            </button>
            <button
              onClick={() => window.location.href = '/demo/org-chart'}
              className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              📊 Try One-Click Org Chart Demo
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Manage Team Access
            </button>
          </div>
          <p className="text-sm text-blue-200">
            Need help first?{' '}
            <a 
              href="https://calendly.com/jeremyestrella/30min?month=2025-07" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline hover:text-blue-100"
            >
              Book a 15‑min onboarding call.
            </a>
          </p>
        </section>

        {/* Footer Information */}
        <footer className="text-center text-gray-500 text-sm py-6">
          <p>
            Version 2025‑07‑12 • Questions?{' '}
            <a 
              href="mailto:support@northpathstrategies.org" 
              className="text-blue-600 hover:text-blue-800"
            >
              Email support@northpathstrategies.org
            </a>
          </p>
        </footer>

      </div>
    </div>
  );
}
