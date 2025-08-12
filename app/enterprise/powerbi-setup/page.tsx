import React from 'react';
import { PageHero } from '@/components/PageHero';

export default function PowerBISetupPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <PageHero title="Power BI Setup" subtitle="Enterprise embedding configuration checklist" />
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Azure AD / Service Principal</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
            <li>Create an Azure AD App Registration for embedding.</li>
            <li>Grant it Power BI Service (Tenant) permissions: Dashboard.Read.All, Report.Read.All.</li>
            <li>Generate a client secret (store in POWERBI_CLIENT_SECRET env).</li>
            <li>Record Tenant ID, Client ID, Workspace ID, Report ID → set environment vars.</li>
            <li>Whitelist origin: <code>app.northpathstrategies.org</code> in embed settings.</li>
          </ol>
        </section>
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-x-auto">{`POWERBI_CLIENT_ID=...
POWERBI_CLIENT_SECRET=...
POWERBI_TENANT_ID=...
POWERBI_WORKSPACE_ID=...
POWERBI_REPORT_ID=...
NEXT_PUBLIC_POWERBI_EMBED_URL=https://app.powerbi.com/reportEmbed`}</pre>
        </section>
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Verification</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
            <li>Server API returns embed token (check /api/powerbi/embed-token).</li>
            <li>Report renders in Enterprise Dashboard without console auth errors.</li>
            <li>Access restricted to enterprise tier via middleware.</li>
          </ul>
        </section>
        <div className="text-sm text-gray-500">Need help? Contact support.</div>
      </div>
    </div>
  );
}
