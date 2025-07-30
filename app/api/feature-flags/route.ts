import { NextRequest, NextResponse } from 'next/server';
import { FEATURE_FLAGS, isFeatureEnabled, getEnabledFeatures } from '@/lib/featureFlags';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userTier = searchParams.get('tier') || 'individual';
    const userGroups = searchParams.get('groups')?.split(',') || [];
    const environment = process.env.NODE_ENV || 'development';

    // Get all enabled features for the user
    const enabledFeatures = getEnabledFeatures(userTier, userGroups, environment);

    // Return detailed feature information
    const featureDetails = Object.entries(FEATURE_FLAGS).map(([key, flag]) => ({
      name: key,
      enabled: enabledFeatures.includes(key),
      description: flag.description,
      userGroups: flag.userGroups,
      rolloutPercentage: flag.rolloutPercentage,
      environment: flag.environment
    }));

    return NextResponse.json({
      success: true,
      userTier,
      userGroups,
      environment,
      enabledFeatures,
      allFeatures: featureDetails
    });

  } catch (error) {
    console.error('Feature flags error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve feature flags' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { featureName, userTier, userGroups, environment } = body;

    if (!featureName) {
      return NextResponse.json(
        { error: 'Feature name is required' },
        { status: 400 }
      );
    }

    const isEnabled = isFeatureEnabled(
      featureName,
      userTier || 'individual',
      userGroups || [],
      environment || process.env.NODE_ENV
    );

    const flag = FEATURE_FLAGS[featureName];

    return NextResponse.json({
      success: true,
      featureName,
      enabled: isEnabled,
      flag: flag || null,
      userContext: {
        tier: userTier,
        groups: userGroups,
        environment: environment || process.env.NODE_ENV
      }
    });

  } catch (error) {
    console.error('Feature flag check error:', error);
    return NextResponse.json(
      { error: 'Failed to check feature flag' },
      { status: 500 }
    );
  }
}
