'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

function SecureAssessmentAccessContent() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get redirect parameters
  const redirect = searchParams.get('redirect');
  const assessmentId = searchParams.get('assessmentId');

  // Development password - in production, this should be handled more securely
  const ASSESSMENT_PASSWORD = 'northpath2025';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Form submitted!');
    console.log('Password entered:', password);
    console.log('Expected password:', ASSESSMENT_PASSWORD);
    console.log('Redirect param:', redirect);
    console.log('Assessment ID param:', assessmentId);
    
    setLoading(true);
    setError('');

    // Authenticate and redirect
    setTimeout(() => {
      console.log('Checking password...');
      if (password === ASSESSMENT_PASSWORD) {
        console.log('Password is correct!');
        
        // Set authorization flag in sessionStorage
        sessionStorage.setItem('assessment_authorized', 'true');
        console.log('Session storage set');
        
        // Determine redirect URL
        let redirectUrl = '/assessment/start'; // default
        
        if (redirect === 'results' && assessmentId) {
          redirectUrl = `/assessment/results?assessmentId=${assessmentId}`;
          console.log('Will redirect to results page:', redirectUrl);
        } else if (redirect === 'admin' && assessmentId) {
          redirectUrl = `/admin/assessment/${assessmentId}`;
          console.log('Will redirect to admin page:', redirectUrl);
        } else {
          console.log('Will redirect to start page:', redirectUrl);
        }
        
        console.log('Final redirect URL:', redirectUrl);
        
        // Perform redirect
        try {
          window.location.href = redirectUrl;
          console.log('Redirect initiated');
        } catch (error) {
          console.error('Redirect failed:', error);
          setError('Redirect failed. Please try again.');
          setLoading(false);
        }
      } else {
        console.log('Password is incorrect');
        setError('Invalid password. Please try again.');
        setLoading(false);
      }
    }, 500);
  };

  // Get appropriate title and subtitle based on redirect type
  const getPageInfo = () => {
    if (redirect === 'results') {
      return {
        title: 'Access Assessment Results',
        subtitle: 'Enter your access credentials to view your analysis'
      };
    } else if (redirect === 'admin') {
      return {
        title: 'Admin Access Required',
        subtitle: 'Enter admin credentials to view assessment details'
      };
    } else {
      return {
        title: 'Secure Assessment Access',
        subtitle: 'Enter your access credentials to continue'
      };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-4">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/images/NorthPath_logo_optimized.jpg"
            alt="NorthPath Strategies"
            width={200}
            height={80}
            className="rounded-lg shadow-md object-cover"
          />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{pageInfo.title}</h1>
          <p className="text-gray-600">{pageInfo.subtitle}</p>
        </div>

        {/* Assessment Info Card */}
        {assessmentId && (
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm font-medium">
                <span className="font-semibold">Assessment ID:</span> {assessmentId}
              </p>
              {redirect === 'results' && (
                <p className="text-blue-700 text-xs mt-1">
                  Your personalized analysis and recommendations are ready for review.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                  Assessment Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full py-3 px-4 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-blue-600 hover:text-blue-800"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm font-medium text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors duration-200"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Verifying Access...
                </>
              ) : (
                'Access Assessment'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <p className="text-xs text-gray-500">
              Your session is secured with enterprise-grade encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  );
}

export default function SecureAssessmentAccess() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SecureAssessmentAccessContent />
    </Suspense>
  );
}
