/* ------------------------------------------------------------------
   app/providers.tsx
   Global client‑side context wrapper (Language)
------------------------------------------------------------------- */
"use client";

import type { ReactNode } from "react";
import { LanguageProvider } from "@/hooks/useLanguage";

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Wrap the entire client tree with necessary providers
 */
export default function Providers({ children }: ProvidersProps) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  );
}