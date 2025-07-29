// app/api/assessments/[assessmentId]/collaborators/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { AssessmentDB, CollaboratorRole } from '@/lib/assessment-db';
import { sendCollaborationInvite } from '@/lib/email-notifications';

// Validation schema for adding collaborators
const addCollaboratorSchema = z.object({
  email: z.string().email(),
  role: z.enum(['ADMIN', 'COLLABORATOR', 'VIEWER']),
});

// GET - List all collaborators for an assessment
export async function GET(
  request: NextRequest,
  { params }: { params: { assessmentId: string } }
) {
  try {
    const assessmentId = params.assessmentId;
    // Use Next.js cookies (stubbed by jest.setup.js in tests)
    const supabase = createRouteHandlerClient({ cookies });
    
    // Verify user has access to this assessment
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get assessment to verify ownership/permissions
    const assessment = await AssessmentDB.findAssessmentById(assessmentId);
    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }
    
    // Check if user is owner or collaborator
    if (assessment.user_id !== user.id) {
      const isCollaborator = await AssessmentDB.checkCollaboratorAccess(assessmentId, user.email);
      if (!isCollaborator) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }
    
    // Get collaborators
    const collaborators = await AssessmentDB.getCollaborators(assessmentId);
    
    return NextResponse.json({ collaborators });
  } catch (error) {
    console.error('Failed to get collaborators:', error);
    return NextResponse.json(
      { error: 'Failed to get collaborators' },
      { status: 500 }
    );
  }
}

// POST - Add a new collaborator
export async function POST(
  request: NextRequest,
  { params }: { params: { assessmentId: string } }
) {
  try {
    const assessmentId = params.assessmentId;
    const supabase = createRouteHandlerClient({ cookies });
    
    // Verify user has access to this assessment
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get assessment to verify ownership
    const assessment = await AssessmentDB.findAssessmentById(assessmentId);
    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }
    
    // Only the owner or admin can add collaborators
    if (assessment.user_id !== user.id) {
      const isAdmin = await AssessmentDB.checkCollaboratorRole(assessmentId, user.email, 'ADMIN');
      if (!isAdmin) {
        return NextResponse.json({ error: 'Only assessment owners and admins can add collaborators' }, { status: 403 });
      }
    }
    
    // Parse and validate request body
    const body = await request.json();
    const { email, role } = addCollaboratorSchema.parse(body);
    
    // Add collaborator
    const collaborator = await AssessmentDB.addCollaborator(assessmentId, email, role as CollaboratorRole);
    
    // Send invite email
    try {
      const userProfile = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
      
      const inviterName = userProfile.data?.full_name || user.email;
      
      await sendCollaborationInvite({
        assessmentId,
        inviterName,
        inviterEmail: user.email,
        recipientEmail: email,
        role,
      });
    } catch (emailError) {
      console.error('Failed to send invitation email:', emailError);
      // Continue even if email fails
    }
    
    return NextResponse.json({ collaborator });
  } catch (error) {
    console.error('Failed to add collaborator:', error);
    return NextResponse.json(
      { 
        error: 'Failed to add collaborator',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE - Remove a collaborator
export async function DELETE(
  request: NextRequest,
  { params }: { params: { assessmentId: string } }
) {
  try {
    const assessmentId = params.assessmentId;
    const { searchParams } = new URL(request.url);
    const collaboratorEmail = searchParams.get('email');
    
    if (!collaboratorEmail) {
      return NextResponse.json({ error: 'Collaborator email is required' }, { status: 400 });
    }
    
    const supabase = createRouteHandlerClient({ cookies });
    
    // Verify user has access to this assessment
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get assessment to verify ownership
    const assessment = await AssessmentDB.findAssessmentById(assessmentId);
    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }
    
    // Only the owner, admin, or the collaborator themselves can remove
    const isOwner = assessment.user_id === user.id;
    const isAdmin = await AssessmentDB.checkCollaboratorRole(assessmentId, user.email, 'ADMIN');
    const isSelf = user.email === collaboratorEmail;
    
    if (!isOwner && !isAdmin && !isSelf) {
      return NextResponse.json({ error: 'Unauthorized to remove this collaborator' }, { status: 403 });
    }
    
    // Remove collaborator
    await AssessmentDB.removeCollaborator(assessmentId, collaboratorEmail);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to remove collaborator:', error);
    return NextResponse.json(
      { error: 'Failed to remove collaborator' },
      { status: 500 }
    );
  }
}
