// app/(secure)/assessments/[assessmentId]/collaborate/page.tsx
import { Suspense } from 'react';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import { AssessmentDB } from '@/lib/assessment-db';

// Placeholder component for removed CollaborativeAssessment
const CollaborativeAssessment = ({ data }: any) => <div className="p-4 border rounded">Collaborative Assessment Component (Placeholder)</div>;

interface CollaboratePageProps {
  params: {
    assessmentId: string;
  };
}

async function getAssessmentData(assessmentId: string) {
  // Get the assessment data including sections
  const assessment = await AssessmentDB.getAssessment(assessmentId);
  
  if (!assessment) {
    return null;
  }
  
  // Get all sections for this assessment
  const sections = {
    'overview': 'This is the overview section of the assessment.',
    'current-state': 'Document the current organizational state.',
    'goals': 'Define the goals of the realignment.',
    'challenges': 'Identify key challenges in the current organization.',
    'recommendations': 'Strategic recommendations for realignment.'
  };
  
  return {
    assessment,
    sections
  };
}

export default async function CollaboratePage({ params }: CollaboratePageProps) {
  const supabase = await createClient();
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/auth/login?redirectTo=/assessments/${params.assessmentId}/collaborate`);
  }
  
  // Get assessment data
  const data = await getAssessmentData(params.assessmentId);
  
  if (!data) {
    notFound();
  }
  
  // Check if user has access to this assessment
  const hasAccess = data.assessment.user_id === user.id || 
                   (data.assessment.shared_with && 
                    data.assessment.shared_with.includes(user.email as string));
  
  if (!hasAccess) {
    redirect('/assessments');
  }
  
  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={<div>Loading collaborative assessment...</div>}>
        <CollaborativeAssessment
          assessmentId={params.assessmentId}
          initialSections={data.sections}
          readOnly={data.assessment.user_id !== user.id}
        />
      </Suspense>
    </div>
  );
}
