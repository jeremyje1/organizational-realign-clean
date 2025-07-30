'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import type { OrganizationType } from '@/data/northpathQuestionBank';

export default function SurveyDebugPage() {
  const [error, setError] = useState<string | null>(null);
  const [questionsData, setQuestionsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        console.log('Attempting to load question bank...');
        
        // Try to import the question bank
        const { allQuestions } = await import('@/data/northpathQuestionBank');
        
        console.log('Questions loaded successfully:', {
          questionCount: allQuestions?.length,
          orgTypes: 'Various organization types',
          firstQuestion: allQuestions?.[0]
        });
        
        setQuestionsData({
          questionCount: allQuestions?.length,
          firstFewQuestions: allQuestions?.slice(0, 3),
          availableTypes: ['community_college', 'trade_technical', 'hospital_healthcare', 'public_university', 'private_university', 'nonprofit', 'government_agency', 'company_business']
        });
        
      } catch (_err) {
        console.error('Error loading questions:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading questions debug...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Survey Debug Page</h1>
        
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
            <h2 className="font-bold">Error Loading Questions:</h2>
            <p>{error}</p>
          </div>
        ) : (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-8">
            <h2 className="font-bold">Questions Loaded Successfully!</h2>
            <p>Question count: {questionsData?.questionCount}</p>
          </div>
        )}

        {questionsData && (
          <div className="space-y-6">
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Question Data Summary:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(questionsData, null, 2)}
              </pre>
            </div>
          </div>
        )}

        <div className="mt-8 space-x-4">
          <Button onClick={() => window.location.href = '/survey'}>
            Try Regular Survey
          </Button>
          <Button onClick={() => window.location.href = '/assessment/start'} variant="outline">
            Back to Assessment Start
          </Button>
        </div>
      </div>
    </div>
  );
}