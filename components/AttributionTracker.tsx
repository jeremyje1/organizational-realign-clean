"use client";

// components/AttributionTracker.tsx
// Captures first-touch attribution (UTM params + referrer) and stores in localStorage & a cookie.
// On first capture it also sends a lightweight analytics event.

import { useEffect } from 'react';

const UTM_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content'
] as const;

interface AttributionData {
  firstTouchAt: string;
  referrer: string | null;
  landingUrl: string;
  utm: Partial<Record<(typeof UTM_PARAMS)[number], string>>;
}

function parseUTMs(searchParams: URLSearchParams) {
  const utm: Partial<Record<(typeof UTM_PARAMS)[number], string>> = {};
  UTM_PARAMS.forEach(key => {
    const v = searchParams.get(key);
    if (v) utm[key] = v;
  });
  return utm;
}

export function AttributionTracker() {
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const existing = window.localStorage.getItem('np_attribution_first_touch');
      if (existing) return; // Already captured

      const url = new URL(window.location.href);
      const utm = parseUTMs(url.searchParams);
      const hasUtm = Object.keys(utm).length > 0;
      const referrer = document.referrer || null;
      if (!hasUtm && !referrer) return; // Nothing to capture

      const payload: AttributionData = {
        firstTouchAt: new Date().toISOString(),
        referrer,
        landingUrl: window.location.href.split('?')[0],
        utm
      };

      const serialized = JSON.stringify(payload);
      window.localStorage.setItem('np_attribution_first_touch', serialized);
      const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toUTCString();
      document.cookie = `np_attribution_first_touch=${encodeURIComponent(serialized)}; path=/; expires=${expires}; samesite=lax`;

      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'attribution',
          eventAction: 'first_touch_capture',
          properties: payload,
          url: payload.landingUrl,
          referrer: payload.referrer
        })
      }).catch(() => {});
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') console.warn('Attribution capture failed', e);
    }
  }, []);
  return null;
}

export default AttributionTracker;
