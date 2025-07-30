// lib/auth.ts
// ──────────────────────────────────────────────────────────────
// Server-side auth() helper for Server Components.
// Uses Supabase to get the current session and returns null during development

// Access the server-side Supabase client
import { createSupabaseServerClient } from './supabase-server';
import type { Session } from '@supabase/auth-helpers-nextjs';

/**
 * auth: retrieves the current Supabase session.
 * Returns null during development if no session exists (instead of throwing)
 */
export async function auth(): Promise<Session | null> {
  const supabase = createSupabaseServerClient();
  const supabaseClient = await supabase;
  const {
    data: { session },
    error,
  } = await supabaseClient.auth.getSession();

  if (error) {
    console.error('Error fetching session:', error.message);
    return null;
  }
  
  // During development, return null instead of throwing for unauthenticated users
  if (!session) {
    console.warn('No session found - user is not authenticated');
    return null;
  }
  
  return session;
}