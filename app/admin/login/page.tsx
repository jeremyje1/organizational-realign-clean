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

    // Simple token-based authentication
    if (token === 'stardynamics1124*') {
      // Set admin session
      localStorage.setItem('admin-token', token);
      localStorage.setItem('admin-logged-in', 'true');
      document.cookie = 'admin-token=stardynamics1124*; path=/; secure; samesite=strict';
      
      // Redirect to dashboard
      router.push('/admin/dashboard');
    } else {
      setError('Invalid admin token. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">NP</span>
          </div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900">
            🔐 Admin Portal
          </h2>
          <p className="mt-3 text-center text-base text-gray-600">
            Secure access to dashboard analytics
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl p-8 space-y-6 border border-gray-200">
          <div>
            <label htmlFor="token" className="block text-sm font-semibold text-gray-700 mb-3">
              🔑 Authentication Token
            </label>
            <input
              id="token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your admin token"
              required
            />
          </div>
          
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm font-medium">❌ {error}</p>
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 font-semibold"
          >
            {loading ? '🔄 Authenticating...' : '🚀 Access Dashboard'}
          </button>
        </form>
        
        <div className="text-center">
          <a 
            href="/"
            className="text-blue-600 hover:text-blue-500 text-sm"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
