import { NextRequest, NextResponse } from 'next/server';
import { AssessmentDB } from '@/lib/assessment-db';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;

    const assessment = await AssessmentDB.findAssessmentBySessionId(sessionId);

    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      );
    }

    // Get user details from auth schema
    const user = await prisma.user.findUnique({
      where: { id: assessment.user_id },
      select: {
        email: true,
        name: true,
      },
    });

    return NextResponse.json({
      id: assessment.id,
      tier: assessment.tier,
      status: assessment.status,
      user: user,
      createdAt: assessment.created_at,
    });
  } catch (error) {
    console.error('Error fetching assessment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
