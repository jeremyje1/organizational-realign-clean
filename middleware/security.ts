// Security middleware for Content Security Policy and other security headers
// This extends the security headers set in next.config.js

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ALLOWED_ORIGINS = [
  'https://northpathstrategies.org',
  'https://www.northpathstrategies.org',
  'https://app.northpathstrategies.org',
  'https://js.stripe.com',
  'https://api.stripe.com',
];

// Generate a nonce for CSP using Web Crypto API (Edge Runtime compatible)
const generateNonce = () => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
};

export async function middleware(request: NextRequest) {
  // Generate a nonce for this request
  const nonce = generateNonce();
  
  // Clone the response and set CSP header
  const response = NextResponse.next();
  
  // Set Content Security Policy
  const csp = [
    // Default policy: deny all
    `default-src 'self'`,
    // Scripts: allow self, Stripe, Google Analytics with nonce
    `script-src 'self' 'nonce-${nonce}' https://js.stripe.com https://www.googletagmanager.com https://www.google-analytics.com`,
    // Styles: allow self and inline styles with nonce
    `style-src 'self' 'nonce-${nonce}' 'unsafe-inline'`,
    // Images: allow self and specific domains
    `img-src 'self' data: https: blob:`,
    // Connect: allow self and Stripe API
    `connect-src 'self' https://api.stripe.com https://vitals.vercel-insights.com https://*.supabase.co wss://*.supabase.co`,
    // Fonts: allow self and Google Fonts
    `font-src 'self' https://fonts.gstatic.com`,
    // Media: allow self only
    `media-src 'self'`,
    // Object: deny all
    `object-src 'none'`,
    // Frame: allow self only
    `frame-src 'self' https://js.stripe.com`,
    // Worker: allow self only
    `worker-src 'self' blob:`,
    // Form action: allow self only
    `form-action 'self'`,
    // Base URI: restrict to self
    `base-uri 'self'`,
    // Frame ancestors: same origin only
    `frame-ancestors 'self'`,
    // Upgrade insecure requests
    `upgrade-insecure-requests`,
  ].join('; ');
  
  // Set the header
  response.headers.set('Content-Security-Policy', csp);
  
  // Store nonce in headers so it can be used in _document.js
  response.headers.set('X-Nonce', nonce);
  
  return response;
}

// Apply middleware only to these paths
export const config = {
  matcher: [
    // Apply to all routes except static files, api routes, and _next
    '/((?!_next/static|_next/image|images/|api/|favicon.ico|robots.txt).*)',
  ],
};
