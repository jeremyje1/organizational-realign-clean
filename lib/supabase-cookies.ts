import { cookies } from 'next/headers';
import type { CookieMethodsServerDeprecated, CookieOptions } from '@supabase/ssr';

export const cookieMethods: CookieMethodsServerDeprecated = {
  get: async (name: string) => {
    const cookieStore = await cookies();
    return cookieStore.get(name)?.value;
  },
  set: async (name: string, value: string, options?: CookieOptions) => {
    const cookieStore = await cookies();
    cookieStore.set({ name, value, ...(options ?? {}) });
  },
  remove: async (name: string, options?: CookieOptions) => {
    const cookieStore = await cookies();
    cookieStore.delete({ name, ...(options ?? {}) });
  },
};