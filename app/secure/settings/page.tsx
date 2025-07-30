'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the secure settings page
    router.push('/(secure)/settings');
  }, [router]);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Redirecting to Settings...</h1>
    </main>
  );
}