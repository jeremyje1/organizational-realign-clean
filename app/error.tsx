'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Client components cannot export metadata
// Metadata should be moved to a separate layout file if needed

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-white dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center space-y-8">
        <div className="flex flex-col items-center">
          <div className="h-24 w-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl text-red-600 dark:text-red-400">⚠️</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-sm">
            We've encountered an unexpected error. Please try again or return to the homepage.
          </p>
        </div>
        
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-center">
          <Button 
            onClick={reset}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <span className="mr-2">🔄</span>
            Try again
          </Button>
          
          <Button asChild>
            <Link href="/" className="flex items-center">
              <span className="mr-2">🏠</span>
              Return Home
            </Link>
          </Button>
        </div>
        
        {error.digest && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
