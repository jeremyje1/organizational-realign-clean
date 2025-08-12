"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/admin/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const supabase = getSupabaseBrowser();
      // Sign in
      const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
      if (signInErr) {
        setError(signInErr.message || 'Authentication failed');
        setLoading(false);
        return;
      }
      // server validation (allowlist)
      const res = await fetch('/api/admin/session-check');
      if (!res.ok) {
        setError('You are not authorized for admin access');
        setLoading(false);
        return;
      }
      router.push(next);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-tr from-emerald-500 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-xl">
            <span className="text-white font-bold text-2xl">NP</span>
          </div>
          <h1 className="mt-6 text-4xl font-extrabold text-white">Admin Login</h1>
          <p className="mt-2 text-sm text-blue-200">Authorized personnel only</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur border border-white/40 rounded-2xl shadow-2xl p-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input id="email" type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" placeholder="you@company.com"/>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input id="password" type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" placeholder="••••••••"/>
          </div>
          {error && <div className="text-sm bg-red-50 border border-red-300 text-red-700 rounded-md p-3">{error}</div>}
          <button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed transition">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <div className="text-center">
          <a href="/" className="text-blue-200 hover:text-white text-sm font-medium">← Back to site</a>
        </div>
      </div>
    </div>
  );
}
