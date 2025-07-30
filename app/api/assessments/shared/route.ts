// app/api/assessments/shared/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { AssessmentDB } from '@/lib/assessment-db';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Verify authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's email from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single();

    if (!profile?.email) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    // Get all assessments where user is a collaborator
    const sharedAssessments = await AssessmentDB.getSharedAssessments(profile.email);
    
    // Enrich assessment data with owner and collaborator information
    const enrichedAssessments = await Promise.all(
      sharedAssessments.map(async (assessment) => {
        // Get owner email
        const { data: ownerData } = await supabase
          .from('profiles')
          .select('email, full_name')
          .eq('id', assessment.user_id)
          .single();
        
        // Get all collaborators for this assessment
        const collaborators = await AssessmentDB.getCollaborators(assessment.id);
        
        // Get current user's role for this assessment
        const userCollaborator = collaborators.find(c => c.email === profile.email);
        
        return {
          ...assessment,
          owner_email: ownerData?.email || 'Unknown',
          owner_name: ownerData?.full_name,
          collaborators,
          role: userCollaborator?.role || 'VIEWER',
          // You can add a title property based on some logic if needed
          title: `Organizational Assessment ${new Date(assessment.created_at).toLocaleDateString()}`
        };
      })
    );
    
    return NextResponse.json({
      success: true,
      assessments: enrichedAssessments
    });

  } catch (error) {
    console.error('Failed to fetch shared assessments:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch shared assessments' },
      { status: 500 }
    );
  }
}
