// app/(secure)/assessment-details/[assessmentId]/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { AssessmentDB } from '@/lib/assessment-db';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Download, Share2 } from 'lucide-react';
import Link from 'next/link';

// Placeholder components for removed modules
const CollaboratorManagement = ({ data }: any) => <div className="p-4 border rounded">Collaborator Management Component (Placeholder)</div>;
const AssessmentComments = ({ data }: any) => <div className="p-4 border rounded">Assessment Comments Component (Placeholder)</div>;

export const metadata = {
  title: 'Assessment Details',
  description: 'View and manage your organizational assessment',
};

export default async function AssessmentDetailPage({
  params,
}: {
  params: { assessmentId: string };
}) {
  const supabase = await createSupabaseServerClient();
  
  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/auth/login?redirectTo=/assessment-details/' + params.assessmentId);
  }
  
  // Get assessment data
  const assessment = await AssessmentDB.findAssessmentById(params.assessmentId);
  
  if (!assessment) {
    redirect('/not-found');
  }
  
  // Check if user has access to this assessment
  const isOwner = assessment.user_id === session.user.id;
  
  // If not owner, check if they're a collaborator
  let collaboratorRole = null;
  if (!isOwner) {
    // Get user's email from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', session.user.id)
      .single();
    
    if (!profile?.email) {
      redirect('/auth/login'); // Profile not found, redirect to login
    }
    
    // Check collaborator access
    const hasAccess = await AssessmentDB.checkCollaboratorAccess(params.assessmentId, profile.email);
    
    if (!hasAccess) {
      // No access, redirect to not found page
      redirect('/not-found');
    }
    
    // Get collaborator role
    const collaborators = await AssessmentDB.getCollaborators(params.assessmentId);
    const collaborator = collaborators.find(c => c.email === profile.email);
    collaboratorRole = collaborator?.role || 'VIEWER';
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" asChild className="mr-2">
              <Link href="/dashboard">
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Assessment Details</h1>
              <p className="text-muted-foreground">
                {assessment.tier} · Created {new Date(assessment.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {assessment.status === 'ANALYZED' && (
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            )}
            {(isOwner || collaboratorRole === 'ADMIN') && (
              <Button size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            )}
          </div>
        </div>
        
        <div className="bg-muted p-4 rounded-lg text-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="font-medium block">Status</span>
              <span className="capitalize">{assessment.status.replace('_', ' ')}</span>
            </div>
            <div>
              <span className="font-medium block">Tier</span>
              <span className="capitalize">{assessment.tier}</span>
            </div>
            <div>
              <span className="font-medium block">Completed</span>
              <span>
                {assessment.completed_at 
                  ? new Date(assessment.completed_at).toLocaleDateString() 
                  : 'Not completed'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="responses">Responses</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Assessment Summary</h2>
              <p className="text-muted-foreground mb-2">
                This assessment was created on {new Date(assessment.created_at).toLocaleDateString()} 
                and is currently in {assessment.status.toLowerCase().replace('_', ' ')} status.
              </p>
              
              {assessment.status === 'PENDING' && (
                <div className="mt-6">
                  <Button asChild>
                    <Link href={`/assessment/start/${params.assessmentId}`}>
                      Start Assessment
                    </Link>
                  </Button>
                </div>
              )}
              
              {assessment.status === 'IN_PROGRESS' && (
                <div className="mt-6">
                  <Button asChild>
                    <Link href={`/assessment/continue/${params.assessmentId}`}>
                      Continue Assessment
                    </Link>
                  </Button>
                </div>
              )}
              
              {assessment.status === 'COMPLETED' && (
                <div className="mt-6">
                  <Button asChild>
                    <Link href={`/assessment/${params.assessmentId}/results`}>
                      View Results
                    </Link>
                  </Button>
                </div>
              )}
              
              {assessment.status === 'ANALYZED' && (
                <div className="mt-6">
                  <Button asChild>
                    <Link href={`/assessment/${params.assessmentId}/results`}>
                      View AI Analysis
                    </Link>
                  </Button>
                </div>
              )}
            </div>
            
            <CollaboratorManagement 
              assessmentId={params.assessmentId} 
              isOwner={isOwner}
              userRole={isOwner ? 'ADMIN' : collaboratorRole}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="responses" className="space-y-4">
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Assessment Responses</h2>
            <p className="text-muted-foreground mb-6">
              {assessment.status === 'PENDING' && 'This assessment has not been started yet.'}
              {assessment.status === 'IN_PROGRESS' && 'This assessment is in progress.'}
              {(assessment.status === 'COMPLETED' || assessment.status === 'ANALYZED' || assessment.status === 'DELIVERED') && 
               'This assessment has been completed.'}
            </p>
            
            {(assessment.status === 'COMPLETED' || assessment.status === 'ANALYZED' || assessment.status === 'DELIVERED') && (
              <Button asChild>
                <Link href={`/assessment/${params.assessmentId}/responses`}>
                  View Responses
                </Link>
              </Button>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="analysis" className="space-y-4">
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">AI Analysis</h2>
            <p className="text-muted-foreground mb-6">
              {assessment.status === 'PENDING' && 'The assessment needs to be completed before analysis.'}
              {assessment.status === 'IN_PROGRESS' && 'Complete the assessment to get AI-powered analysis.'}
              {assessment.status === 'COMPLETED' && 'The assessment is ready for AI analysis.'}
              {(assessment.status === 'ANALYZED' || assessment.status === 'DELIVERED') && 
               'AI analysis has been completed for this assessment.'}
            </p>
            
            {assessment.status === 'COMPLETED' && (
              <div className="flex flex-col space-y-4">
                <p className="text-sm">
                  Upgrade to a premium tier to get AI-powered insights and recommendations.
                </p>
                <Button asChild>
                  <Link href={`/assessment/${params.assessmentId}/upgrade`}>
                    Upgrade to Premium
                  </Link>
                </Button>
              </div>
            )}
            
            {(assessment.status === 'ANALYZED' || assessment.status === 'DELIVERED') && (
              <Button asChild>
                <Link href={`/assessment/${params.assessmentId}/analysis`}>
                  View Analysis
                </Link>
              </Button>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="collaboration" className="space-y-4">
          <AssessmentComments 
            assessmentId={params.assessmentId}
            isReadOnly={collaboratorRole === 'VIEWER' && !isOwner}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
