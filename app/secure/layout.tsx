import '../globals.css';
import type { Metadata } from "next";
import Link from 'next/link';
import type { ReactNode } from "react";
import AuthButton from "@/components/AuthButton";

export const metadata: Metadata = {
  title: "Secure Dashboard - NorthPath Strategies",
  description: "Access your organizational realignment tools, assessments, and results in a secure environment.",
  keywords: [
    "secure dashboard",
    "organizational tools",
    "business assessment portal",
    "northpath client area",
    "secure business tools"
  ],
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col">
        {/* ---------- Navbar ---------- */}
        <header className="border-b bg-white shadow-sm sticky top-0 z-20">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <Link href="/" className="font-bold text-lg text-zinc-900">
              NorthPath
            </Link>
            <AuthButton />
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
          {children}
        </main>

        <footer className="border-t bg-white py-4 text-center text-sm text-zinc-500">
          Organizational Realignment Tool v1.0 —{" "}
          <a
            href="mailto:feedback@northpath.io"
            className="font-medium underline"
          >
            Send Feedback
          </a>
        </footer>
      </body>
    </html>
  );
}