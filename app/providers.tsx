/* ------------------------------------------------------------------
   app/providers.tsx
   Global client‑side context wrapper (Supabase Auth & Language, SEO)
------------------------------------------------------------------- */
"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import type { ReactNode } from "react";
import type { Database } from "@/types/supabase";
import { SocketProvider } from "@/lib/socket-client";
import { LanguageProvider } from "@/hooks/useLanguage";

interface ProvidersProps {
  children: ReactNode;
}

/* ──────────────────────────────────────────────────────────────
   Create one Supabase browser client for the entire session.
   The generic <Database> keeps row‑level types accurate.
   The client is memo‑safe because this module is executed once.
─────────────────────────────────────────────────────────────── */
const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Wrap the entire client tree so that hooks like useUser()
 * from @supabase/auth-helpers-react can access session / auth state.
 * Also provides industry-specific language context.
 */
export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <SocketProvider>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </SocketProvider>
    </SessionContextProvider>
  );
}