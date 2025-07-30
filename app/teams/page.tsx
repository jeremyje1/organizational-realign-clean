import { Suspense } from 'react';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { TeamDashboard } from '@/components/collaboration/TeamDashboard';

async function TeamsPageContent() {
  const supabase = await createSupabaseServerClient();

  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/auth/login?redirectTo=/teams');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="mt-2 text-gray-600">
            Manage your teams, invite members, and collaborate on assessments.
          </p>
        </div>
        
        <TeamDashboard userId={session.user.id} />
      </div>
    </div>
  );
}

export default function TeamsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <TeamsPageContent />
    </Suspense>
  );
}
