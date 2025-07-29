import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // TODO: ensure DB connection is configured

/**
 * GET /api/organizations/[orgId]
 * Returns the organisation with the given ID, or 404 if not found.
 */
export async function GET(
  _req: Request,
  { params }: { params: { orgId: string } },
) {
  try {
    const { orgId } = params;
    const org = await prisma.organization.findUnique({ where: { id: orgId } });

    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    return NextResponse.json(org);
  } catch (_err) {
    console.error('GET /organizations/:orgId error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/organizations/[orgId]
 * Updates the organisation. Only whitelisted fields are allowed for now.
 */
export async function PATCH(
  req: Request,
  { params }: { params: { orgId: string } },
) {
  try {
    const { orgId } = params;
    const payload = await req.json();

    // ‼️ TODO: replace with proper Zod schema validation
    const { name, description } = payload as {
      name?: string;
      description?: string;
    };

    const updated = await prisma.organization.update({
      where: { id: orgId },
      data: {
        ...(name && { name }),
        ...(description && { description }),
      },
    });

    return NextResponse.json(updated);
  } catch (_err) {
    console.error('PATCH /organizations/:orgId error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}