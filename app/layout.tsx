import "./globals.css";
import "./globals-hero.css";
import "./styles/print.css"; // Import print styles for SEO and accessibility
import "./skip-content.css"; // Import skip-to-content styles
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from 'next/font/google';
import ClientWrapper from "@/components/client-wrappers/ClientWrapper";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "NorthPath Strategies - Higher Education & Nonprofit Transformation",
  description: "We partner with mission-driven colleges, universities, and nonprofits to solve the root causes of misalignment, fragmentation, and underperformance.",
  keywords: "higher education transformation, institutional alignment, nonprofit strategy, systems design, university consulting, strategic planning, mission-driven institutions",
  metadataBase: new URL('https://northpathstrategies.org'),
  other: {
    // Optimize resource loading
    'resource-hints': 'preload',
    'font-display': 'swap',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://northpathstrategies.org/',
    title: 'NorthPath Strategies - Redesign Systems. Align Strategy. Transform Institutions.',
    description: 'We design the systems that support mission-driven colleges, universities, and nonprofits at the intersection of strategy, equity, and execution.',
    siteName: 'NorthPath Strategies',
    images: [
      {
        url: '/og-homepage.png',
        width: 1200,
        height: 630,
        alt: 'NorthPath Strategies',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NorthPath Strategies - Higher Education & Nonprofit Transformation',
    description: 'We design systems that help mission-driven institutions solve root causes of misalignment and underperformance',
    images: ['/og-homepage.png'],
    creator: '@northpathstrat',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* Skip to content link for accessibility */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Optimize CSS loading to reduce preload warnings */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Optimize preloaded CSS resources to reduce warnings
              (function() {
                if (typeof window !== 'undefined') {
                  window.addEventListener('load', function() {
                    const preloadedCSS = document.querySelectorAll('link[rel="preload"][as="style"]');
                    preloadedCSS.forEach(function(link) {
                      if (!link.sheet || !link.sheet.cssRules.length) {
                        setTimeout(function() {
                          link.rel = 'stylesheet';
                        }, 100);
                      }
                    });
                  });
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`min-h-screen bg-slate-900 text-white font-sans antialiased ${inter.variable}`}>
        <a href="#main-content" className="skip-to-content">Skip to content</a>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}