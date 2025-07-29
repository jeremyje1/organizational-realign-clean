import { NextRequest, NextResponse } from 'next/server';
import { 
  pullWorkdayPositions, 
  pullWorkdayOrgUnits, 
  testWorkdayConnection 
} from '@/services/integrations/workday';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get('apiKey');
    const action = searchParams.get('action') || 'positions';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'test':
        const isConnected = await testWorkdayConnection(apiKey);
        return NextResponse.json({ 
          success: isConnected, 
          message: isConnected ? 'Connection successful' : 'Connection failed' 
        });

      case 'positions':
        const positions = await pullWorkdayPositions(apiKey);
        return NextResponse.json({
          success: true,
          data: positions
        });

      case 'org-units':
        const orgUnits = await pullWorkdayOrgUnits(apiKey);
        return NextResponse.json({
          success: true,
          data: orgUnits
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: test, positions, org-units' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Workday integration error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch data from Workday',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, action } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'sync-positions':
        const positions = await pullWorkdayPositions(apiKey);
        // Here you would typically save the positions to your database
        // For now, we'll just return the data
        return NextResponse.json({
          success: true,
          message: `Synced ${positions.positions.length} positions`,
          data: positions
        });

      case 'sync-org-units':
        const orgUnits = await pullWorkdayOrgUnits(apiKey);
        // Here you would typically save the org units to your database
        return NextResponse.json({
          success: true,
          message: 'Org units synced successfully',
          data: orgUnits
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: sync-positions, sync-org-units' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Workday sync error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to sync data from Workday',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
