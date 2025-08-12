"use client";
import React from 'react';
import Link from 'next/link';
import { normalizeTier, LEGACY_TIERS } from '@/lib/tierUtils';

interface UpgradeBannerProps {
  tier: string;
}

export const UpgradeBanner: React.FC<UpgradeBannerProps> = ({ tier }) => {
  if (!LEGACY_TIERS.includes(tier as any)) return null;
  const norm = normalizeTier(tier as any);
  return (
    <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-900">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-semibold text-amber-800">Legacy Tier Detected</h3>
          <p className="text-sm mt-1 max-w-xl">
            You are using a legacy assessment tier (<strong>{tier}</strong>). Upgrade to <strong>{norm.normalizedTier}</strong> for: unlimited diagnostics, benchmarking dashboards, scenario modeling, and faster insights powered by our latest algorithm enhancements.
          </p>
          <ul className="mt-2 text-sm list-disc list-inside space-y-1">
            <li>Faster structural friction scoring</li>
            <li>Continuous trend tracking</li>
            <li>Early access to new indices</li>
            <li>Priority expert guidance</li>
          </ul>
        </div>
        <div className="flex flex-col items-stretch min-w-[200px]">
          <Link href="/pricing" className="inline-block text-center rounded-md bg-amber-600 px-4 py-2 text-white text-sm font-medium hover:bg-amber-700">
            View Modern Plans
          </Link>
          <Link href="/api/stripe/create-tier-checkout?tier=monthly-subscription" className="mt-2 inline-block text-center rounded-md border border-amber-500 px-4 py-2 text-amber-700 text-sm font-medium hover:bg-amber-100">
            Upgrade Now →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UpgradeBanner;
