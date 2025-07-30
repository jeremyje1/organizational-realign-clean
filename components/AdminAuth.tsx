'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function AdminAuth({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      // Check both localStorage and cookies for admin authentication
      const adminToken = localStorage.getItem('admin-token');
      const adminLoggedIn = localStorage.getItem('admin-logged-in');
      
      if (adminToken === 'stardynamics1124*' && adminLoggedIn === 'true') {
        // Also set cookie for server-side middleware
        document.cookie = 'admin-token=stardynamics1124*; path=/; secure; samesite=strict';
        setIsAuthenticated(true);
      } else {
        router.push('/admin/login');
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    localStorage.removeItem('admin-logged-in');
    document.cookie = 'admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">NP</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  North Path Strategies Admin
                </h1>
                <p className="text-xs text-gray-500">Assessment Management System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Admin Session Active
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-800 px-3 py-1 border border-red-300 rounded hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Navigation */}
      <div className="bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-3">
            <a
              href="/admin/dashboard"
              className="text-white hover:text-indigo-100 px-3 py-2 text-sm font-medium"
            >
              Dashboard
            </a>
            <a
              href="/admin/testing/unified"
              className="text-white hover:text-indigo-100 px-3 py-2 text-sm font-medium"
            >
              Test Center
            </a>
            <a
              href="/admin"
              className="text-white hover:text-indigo-100 px-3 py-2 text-sm font-medium"
            >
              Assessments
            </a>
            <a
              href="/admin/users"
              className="text-white hover:text-indigo-100 px-3 py-2 text-sm font-medium"
            >
              Users
            </a>
            <a
              href="/admin/analytics"
              className="text-white hover:text-indigo-100 px-3 py-2 text-sm font-medium"
            >
              Analytics
            </a>
            <a
              href="/admin/settings"
              className="text-white hover:text-indigo-100 px-3 py-2 text-sm font-medium"
            >
              Settings
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  );
}
