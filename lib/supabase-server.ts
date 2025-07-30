

import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
/**
 * Creates a typed Supabase client using the current request's cookies.
 * Call this within server actions, Route Handlers or Server Components.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = cookieStore.get(name);
          return cookie?.value ?? null;
        },
        set(name: string, value: string, options?: CookieOptions) {
          cookieStore.set({ name, value, path: '/', ...options });
        },
        remove(name: string, options?: CookieOptions) {
          cookieStore.set({ name, value: '', path: '/', maxAge: -1, ...options });
        },
      },
    },
  );
}

// Alias for backward compatibility with existing code
export const createClient = createSupabaseServerClient;