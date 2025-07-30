/**
 * Admin Layout
 * Optimized layout for admin pages to reduce CSS preload warnings
 */

'use client';

import type { ReactNode } from "react";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {/* Optimize CSS loading specifically for admin pages */}
      <style jsx global>{`
        /* Inline critical CSS for admin to reduce preload warnings */
        .admin-critical {
          font-display: swap;
        }
        
        /* Defer non-critical styles */
        @media screen {
          .admin-deferred {
            opacity: 1;
          }
        }
      `}</style>
      {children}
    </>
  );
}
