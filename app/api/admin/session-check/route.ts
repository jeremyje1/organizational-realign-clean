import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/admin-auth';
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0] || 'unknown';
  const rl = rateLimit('session-check:' + ip, 20, 60_000);
  if (rl.limited) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ ok: true, email: admin.email });
}
