"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

export function AdminAuth({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [sessionOk, setSessionOk] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        const supabase = getSupabaseBrowser();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/admin/login?next=' + encodeURIComponent(pathname));
          return;
        }
        // Hit a lightweight server route to validate admin allowlist (reuse analytics verify?)
        const res = await fetch('/api/admin/session-check', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (mounted) {
            setSessionOk(true);
            setEmail(json.email || null);
          }
        } else {
          // Not authorized; sign out and redirect
          await supabase.auth.signOut();
          router.push('/admin/login?next=' + encodeURIComponent(pathname));
        }
      } catch (e) {
        router.push('/admin/login?next=' + encodeURIComponent(pathname));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => { mounted = false; };
  }, [router, pathname]);

  const handleLogout = async () => {
    const supabase = getSupabaseBrowser();
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }
  if (!sessionOk) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">NP</span>
              </div>
              <div>
                <h1 className="text-sm font-semibold text-gray-900">NorthPath Admin</h1>
                <p className="text-[10px] text-gray-500">Assessment Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-xs text-gray-600">
              {email && <span>{email}</span>}
              <button onClick={handleLogout} className="px-2 py-1 border rounded text-red-600 border-red-300 hover:bg-red-50">Logout</button>
            </div>
          </div>
        </div>
      </header>
      <div className="bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap space-x-4 py-2 text-xs">
            <a href="/admin/dashboard" className="text-white hover:text-indigo-100">Dashboard</a>
            <a href="/admin/testing/unified" className="text-white hover:text-indigo-100">Test Center</a>
            <a href="/admin" className="text-white hover:text-indigo-100">Assessments</a>
            <a href="/admin/users" className="text-white hover:text-indigo-100">Users</a>
            <a href="/admin/analytics" className="text-white hover:text-indigo-100">Analytics</a>
            <a href="/admin/settings" className="text-white hover:text-indigo-100">Settings</a>
          </nav>
        </div>
      </div>
      <main>{children}</main>
    </div>
  );
}
