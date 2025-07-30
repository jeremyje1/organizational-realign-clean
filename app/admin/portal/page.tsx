'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPortalPage() {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3">
            <span className="text-white font-bold text-3xl transform -rotate-3">NP</span>
          </div>
          <h1 className="mt-8 text-center text-5xl font-extrabold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
            ⚡ ADMIN PORTAL ⚡
          </h1>
          <p className="mt-4 text-center text-lg text-gray-900 font-medium">
            🎯 Dashboard Analytics & Management
          </p>
          <div className="mt-2 text-center text-sm text-gray-600">
            Build: 2025-01-30 16:24:31
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-10 space-y-8 border-2 border-gray-100 backdrop-blur-sm">
          <div>
            <label htmlFor="token" className="block text-lg font-bold text-gray-800 mb-4">
              🔐 AUTHENTICATION TOKEN
            </label>
            <input
              id="token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-6 py-4 border-3 border-gray-300 rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-500 focus:border-purple-500 transition-all text-lg font-medium"
              placeholder="🔑 Enter your admin token here..."
              required
            />
          </div>
          
          {error && (
            <div className="bg-red-50 border-3 border-red-300 rounded-xl p-6">
              <p className="text-red-800 text-lg font-bold">🚨 {error}</p>
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white py-4 px-8 rounded-xl hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-6 focus:ring-purple-500 focus:ring-offset-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 font-bold text-xl shadow-2xl"
          >
            {loading ? '⏳ AUTHENTICATING...' : '🚀 LAUNCH DASHBOARD'}
          </button>
        </form>
        
        <div className="text-center">
          <a 
            href="/"
            className="text-purple-600 hover:text-purple-800 text-lg font-semibold hover:underline"
          >
            ← Return to Homepage
          </a>
        </div>
      </div>
    </div>
  );
}
