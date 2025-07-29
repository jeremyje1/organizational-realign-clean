import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    
    if (!organizationId) {
      return NextResponse.json(
        { error: 'organizationId is required' },
        { status: 400 }
      );
    }
    
    // TODO: Implement with Prisma once schema is migrated
    const mockUnits = [
      {
        id: "unit_1",
        organizationId: organizationId,
        name: "Academic Affairs",
        parentUnitId: null,
        positions: [],
        children: [],
        parent: null,
      },
      {
        id: "unit_2", 
        organizationId: organizationId,
        name: "Student Services",
        parentUnitId: null,
        positions: [],
        children: [],
        parent: null,
      }
    ];
    
    return NextResponse.json(mockUnits);
  } catch (error) {
    console.error('Error fetching units:', error);
    return NextResponse.json(
      { error: 'Failed to fetch units' },
      { status: 500 }
    );
  }
}