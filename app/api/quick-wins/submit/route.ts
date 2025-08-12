import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// Basic rate limiting + logging for Quick Wins submissions
// Limits: max 3 per email per 24h, max 5 per IP per 24h
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: false, error: 'Email required' }, { status: 400 });
    }
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '0.0.0.0';
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex');
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // NOTE: After running `prisma generate`, the delegate will be available as prisma.quickWinsSubmission.
    const quickWinsDelegate: any = (prisma as any).quickWinsSubmission;
    const [emailCount, ipCount] = await Promise.all([
      quickWinsDelegate.count({ where: { email, createdAt: { gte: since } } }),
      quickWinsDelegate.count({ where: { ipHash, createdAt: { gte: since } } })
    ]);

    if (emailCount >= 3) {
      return NextResponse.json({ success: false, error: 'Daily email limit reached' }, { status: 429 });
    }
    if (ipCount >= 5) {
      return NextResponse.json({ success: false, error: 'Daily IP limit reached' }, { status: 429 });
    }

  await quickWinsDelegate.create({ data: { email, ipHash } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Quick Wins submission error', e);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
