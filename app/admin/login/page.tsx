'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simple token-based authentication
      if (token === 'stardynamics1124*') {
        // Set admin session
        if (typeof window !== 'undefined') {
          localStorage.setItem('admin-token', token);
          localStorage.setItem('admin-logged-in', 'true');
          document.cookie = 'admin-token=stardynamics1124*; path=/; secure; samesite=strict';
        }
        
        // Redirect to dashboard
        router.push('/admin/dashboard');
      } else {
        setError('Invalid admin token. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Authentication failed. Please try again.');
      setLoading(false);
    }
  };

  // Cache buster - use static timestamp to avoid hydration issues
  const buildTime = "2025-01-30 16:24:31";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="max-w-lg w-full space-y-10 p-6">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-tr from-emerald-500 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-6 hover:rotate-12 transition-transform">
            <span className="text-white font-black text-3xl transform -rotate-6">NP</span>
          </div>
          <h1 className="mt-8 text-center text-6xl font-black bg-gradient-to-r from-white via-blue-100 to-emerald-100 bg-clip-text text-transparent">
            ✨ ADMIN HUB ✨
          </h1>
          <p className="mt-4 text-center text-xl text-white font-bold">
            🎯 Business Intelligence Dashboard
          </p>
          <div className="mt-2 text-xs text-blue-200 font-mono">
            v2.0 • {buildTime}
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 space-y-8 border-2 border-white/70">
          <div>
            <label htmlFor="token" className="block text-lg font-black text-slate-800 mb-4">
              🔒 SECURITY TOKEN
            </label>
            <input
              id="token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-6 py-4 border-3 border-slate-300 rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg font-medium bg-slate-50"
              placeholder="🔑 Enter authentication token..."
              required
            />
          </div>
          
          {error && (
            <div className="bg-red-50 border-3 border-red-300 rounded-xl p-6">
              <p className="text-red-900 text-lg font-bold">🚨 {error}</p>
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-700 text-white py-4 px-8 rounded-xl hover:from-emerald-700 hover:via-blue-700 hover:to-purple-800 focus:outline-none focus:ring-6 focus:ring-blue-500 focus:ring-offset-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 font-black text-xl shadow-2xl"
          >
            {loading ? '⏳ AUTHENTICATING...' : '🚀 LAUNCH CONTROL PANEL'}
          </button>
        </form>
        
        <div className="text-center">
          <a 
            href="/"
            className="text-blue-200 hover:text-white text-lg font-bold hover:underline transition-colors"
          >
            ← Return to Main Site
          </a>
        </div>
      </div>
    </div>
  );
}
