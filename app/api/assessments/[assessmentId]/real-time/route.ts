// app/api/assessments/[assessmentId]/real-time/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { AssessmentDB } from '@/lib/assessment-db';

export async function GET(
  request: Request,
  { params }: { params: { assessmentId: string } }
) {
  try {
    const assessmentId = params.assessmentId;
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the assessment to check permissions
    const assessment = await AssessmentDB.getAssessment(assessmentId);
    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }
    
    // Check if user has access to the assessment
    const hasAccess = assessment.user_id === user.id || 
                     (assessment.shared_with && assessment.shared_with.includes(user.email as string));
    
    if (!hasAccess) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // Get all versions of this assessment
    const versions = await AssessmentDB.getAssessmentVersions(assessmentId);
    
    return NextResponse.json({
      versions,
    });
  } catch (error) {
    console.error('Error fetching assessment versions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { assessmentId: string } }
) {
  try {
    const assessmentId = params.assessmentId;
    const { section, content, version } = await request.json();
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the assessment to check permissions
    const assessment = await AssessmentDB.getAssessment(assessmentId);
    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }
    
    // Check if user has access to the assessment
    const hasAccess = assessment.user_id === user.id || 
                     (assessment.shared_with && assessment.shared_with.includes(user.email as string));
    
    if (!hasAccess) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // Create a new version
    const newVersion = await AssessmentDB.createAssessmentVersion(
      assessmentId,
      version,
      {
        section,
        content,
        updated_at: new Date().toISOString()
      },
      user.id,
      'Update from collaborative editor'
    );
    
    // If there's an active Socket.IO server, broadcast the change
    const io = global.io;
    if (io) {
      io.to(`assessment:${assessmentId}`).emit('assessment-edited', {
        section,
        data: { content },
        version,
        timestamp: new Date().toISOString(),
        editor: {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name,
        }
      });
    }
    
    return NextResponse.json({
      success: true,
      version: newVersion,
    });
  } catch (error) {
    console.error('Error creating assessment version:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
