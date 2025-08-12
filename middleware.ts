import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Paths that require enterprise tier
const ENTERPRISE_PATHS = ['/enterprise/dashboard'];
// Scenario paths (gated by auth, not tier for now)
const SCENARIO_PREFIX = '/scenario/';
// New protected prefixes (only Quick Wins stays fully public)
const PROTECTED_PREFIXES = ['/assessment', '/survey', '/secure', '/enterprise', '/scenario'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const requiresEnterprise = ENTERPRISE_PATHS.includes(pathname);
  const isScenario = pathname.startsWith(SCENARIO_PREFIX);
  const isProtected = PROTECTED_PREFIXES.some(p => pathname.startsWith(p)) && !pathname.startsWith('/quick-wins');

  if (!requiresEnterprise && !isScenario && !isProtected) return NextResponse.next();

  const token = await getToken({ req });
  const tier = (token as any)?.tier;

  if (!token) {
    const signIn = new URL('/auth', req.url);
    signIn.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signIn);
  }

  if (requiresEnterprise && tier !== 'enterprise-transformation') {
    return NextResponse.redirect(new URL('/upgrade?required=enterprise', req.url));
  }

  // Basic users cannot access deeper assessments (anything under /assessment except quick-wins)
  if (isProtected && tier === 'basic') {
    return NextResponse.redirect(new URL('/pricing?upgrade=required', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/enterprise/:path*', '/scenario/:path*']
};
