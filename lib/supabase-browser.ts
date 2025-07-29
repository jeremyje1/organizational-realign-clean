// lib/supabase-browser.ts
// ──────────────────────────────────────────────────────────────
// Typed Supabase client for *browser* (React Client Components).
// Reads project URL + anon key from NEXT_PUBLIC_SUPABASE_* env vars
// at build time; this avoids hard‑coding values in the codebase.

'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
export const supabase = createClientComponentClient({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
});