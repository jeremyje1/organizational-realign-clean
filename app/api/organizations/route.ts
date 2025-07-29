import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // TODO: Implement with Prisma once schema is migrated
    const mockOrganizations = [
      {
        id: "org_1",
        name: "NorthPath University", 
        mission: "Excellence in higher education"
      }
    ];
    
    return NextResponse.json(mockOrganizations);
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch organizations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, mission } = body;
    
    // TODO: Implement with Prisma once schema is migrated
    const mockOrganization = {
      id: `org_${Date.now()}`,
      name,
      mission,
    };
    
    return NextResponse.json(mockOrganization, { status: 201 });
  } catch (error) {
    console.error('Error creating organization:', error);
    return NextResponse.json(
      { error: 'Failed to create organization' },
      { status: 500 }
    );
  }
}
