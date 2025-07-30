import { Suspense } from 'react';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { AuthForm } from '@/components/auth/AuthForm';

async function LoginPageContent() {
  const supabase = await createSupabaseServerClient();

  // Check if user is already authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    redirect('/teams');
  }

  return <AuthForm />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
