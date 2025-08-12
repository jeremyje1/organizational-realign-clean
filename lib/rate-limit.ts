// lib/rate-limit.ts
// Very small in-memory rate limiter (per IP) suitable for low volume admin APIs.
// NOTE: For serverless multi-instance this is best replaced with Upstash/Redis.

const hits: Record<string, { count: number; first: number }> = {};

export function rateLimit(key: string, limit = 30, windowMs = 60_000) {
  const now = Date.now();
  const entry = hits[key] || { count: 0, first: now };
  if (now - entry.first > windowMs) {
    entry.count = 0;
    entry.first = now;
  }
  entry.count += 1;
  hits[key] = entry;
  const remaining = Math.max(0, limit - entry.count);
  return {
    limited: entry.count > limit,
    remaining,
    reset: entry.first + windowMs,
  };
}
