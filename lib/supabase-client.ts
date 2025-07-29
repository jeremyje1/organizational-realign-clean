// lib/supabase-client.ts
// ──────────────────────────────────────────────────────────────
// Server-side Supabase helper for Server Components / route handlers.
// It injects Next.js cookies so Row-Level Security sees the authenticated user.

import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export const supabase = createServerComponentClient({
  cookies,
});