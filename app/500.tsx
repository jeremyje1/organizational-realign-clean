import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertOctagon, Home, Mail } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Server Error - NorthPath Strategies',
  description: 'Our server encountered an error. Please try again later.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ServerErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-white dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center space-y-8">
        <div className="flex flex-col items-center">
          <div className="h-24 w-24 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-6">
            <AlertOctagon size={40} className="text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Server Error</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-sm">
            We're experiencing some technical difficulties. Our team has been notified and we're working to fix the issue.
          </p>
        </div>
        
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-center">
          <Button 
            variant="outline"
            asChild
          >
            <Link href="/" className="flex items-center">
              <Home size={18} className="mr-2" />
              Return Home
            </Link>
          </Button>
          
          <Button 
            asChild
          >
            <Link href="/contact" className="flex items-center">
              <Mail size={18} className="mr-2" />
              Contact Support
            </Link>
          </Button>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
          Error Code: 500 - Internal Server Error
        </p>
      </div>
    </div>
  );
}