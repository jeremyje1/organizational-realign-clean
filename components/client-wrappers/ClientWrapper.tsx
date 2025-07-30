// ClientWrapper component with all necessary providers
'use client';

import React from 'react';
import { LanguageProvider } from '@/hooks/useLanguage';

interface ClientWrapperProps {
  children: React.ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  );
}
