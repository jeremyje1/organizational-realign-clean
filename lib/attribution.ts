// lib/attribution.ts
// Helpers to read and normalize first-touch attribution from cookie set by AttributionTracker.

import { cookies } from 'next/headers';

export interface FirstTouchAttribution {
  firstTouchAt: string;
  referrer: string | null;
  landingUrl: string;
  utm: Record<string, string>;
}

const COOKIE_NAME = 'np_attribution_first_touch';

export function parseRawAttributionString(raw?: string | null): FirstTouchAttribution | null {
  if (!raw) return null;
  try {
    const decoded = decodeURIComponent(raw);
    const data = JSON.parse(decoded);
    if (data && data.firstTouchAt) return data as FirstTouchAttribution;
  } catch {}
  return null;
}

export function parseAttributionCookie(): FirstTouchAttribution | null {
  try {
    const store = cookies();
    const raw = store.get(COOKIE_NAME)?.value || null;
    return parseRawAttributionString(raw);
  } catch {
    return null;
  }
}

export function flattenAttribution(a: FirstTouchAttribution | null): Record<string, any> | null {
  if (!a) return null;
  return {
    first_touch_at: a.firstTouchAt,
    referrer: a.referrer,
    landing_url: a.landingUrl,
    ...Object.fromEntries(Object.entries(a.utm || {}).map(([k, v]) => [`utm_${k}`, v]))
  };
}
