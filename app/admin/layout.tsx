/**
 * Admin Layout
 * Optimized layout for admin pages with error boundary
 */

'use client';

import type { ReactNode } from "react";
import { AdminErrorBoundary } from "@/components/AdminErrorBoundary";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AdminErrorBoundary>
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
    </AdminErrorBoundary>
  );
}
