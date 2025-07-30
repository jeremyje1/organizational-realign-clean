/* ------------------------------------------------------------------
   app/providers.tsx
   Global client‑side context wrapper (Language)
------------------------------------------------------------------- */
"use client";

import type { ReactNode } from "react";
import { LanguageProvider } from "@/hooks/useLanguage";
import { Suspense } from "react";

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Wrap the entire client tree with necessary providers
 */
export default function Providers({ children }: ProvidersProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </Suspense>
  );
}