import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token?.id) return NextResponse.json({ success: false, error: 'Auth required' }, { status: 401 });
    const { inviteToken } = await req.json();
    if (!inviteToken) return NextResponse.json({ success: false, error: 'Token required' }, { status: 400 });

    const record: any = await (prisma as any).inviteAccessToken.findUnique({ where: { token: inviteToken } });
    if (!record) return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 404 });
    if (record.usedAt) return NextResponse.json({ success: false, error: 'Already used' }, { status: 409 });
    if (record.expiresAt && new Date(record.expiresAt) < new Date()) return NextResponse.json({ success: false, error: 'Expired' }, { status: 410 });

    const updates: any = {};
    if (record.tierGrant) updates.tier = record.tierGrant;
    if (record.featureGrants) updates.features = record.featureGrants;

    await prisma.user.update({ where: { id: token.id as string }, data: updates });
    await (prisma as any).inviteAccessToken.update({ where: { token: inviteToken }, data: { usedAt: new Date(), usedByUserId: token.id as string } });

    return NextResponse.json({ success: true, applied: updates });
  } catch (e) {
    console.error('Invite redeem error', e);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
