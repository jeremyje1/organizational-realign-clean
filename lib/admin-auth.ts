// lib/admin-auth.ts
// Centralized admin verification using Supabase session + email allowlist or metadata role.

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export interface AdminUser { id: string; email: string | null }

export async function verifyAdmin(): Promise<AdminUser | null> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return null;
    }
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          }
        }
      }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const allowlist = (process.env.ADMIN_EMAIL_ALLOWLIST || '')
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean);
    const email = user.email?.toLowerCase() || null;
    const meta: any = { ...(user.app_metadata || {}), ...(user.user_metadata || {}) };
    const role = meta.role;
    const isSuper = meta.is_super_admin || role === 'super_admin';
    const ok = (email && allowlist.includes(email)) || role === 'admin' || isSuper;
    if (!ok) return null;
    return { id: user.id, email: user.email ?? null };
  } catch {
    return null;
  }
}
