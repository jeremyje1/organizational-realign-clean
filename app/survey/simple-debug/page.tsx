"use client";

import { useState, useMemo, useEffect } from "react";
import LikertInput from "@/components/LikertInput";
import NumericInput from "@/components/NumericInput";
import { SelectInput } from "@/components/SelectInput";

import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import types only to avoid data loading during SSR
import type { OrganizationType } from "@/data/northpathQuestionBank";

// Placeholder component for removed PublicNavigation
const PublicNavigation = () => <div className="p-4 border-b">Public Navigation (Placeholder)</div>;

type Question = {
  id: string;
  text: string;
  area: string;
  type: "likert" | "select" | "multi-select" | "number" | "text";
  options?: string[];
};

function adaptQuestion(q: any): Question {
  return {
    id: q.id,
    text: q.prompt,
    area: q.section,
    type: q.type === 'numeric' ? 'number' : q.type,
    options: q.options
  };
}

export default function SimpleDebugPage() {
  const [selectedInstitutionType, setSelectedInstitutionType] = useState<OrganizationType | undefined>();
  const [sectionIdx, setSectionIdx] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [allQuestions, setAllQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Lazy load questions data to avoid SSR serialization issues
  useEffect(() => {
    async function loadQuestions() {
      try {
        const { allQuestions: questionsData } = await import("@/data/northpathQuestionBank");
        setAllQuestions(questionsData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load questions:', error);
        setAllQuestions([]);
        setLoading(false);
      }
    }
    loadQuestions();
  }, []);

  // Get questions based on institution type
  const questions = useMemo(() => {
    if (!allQuestions.length) return [];
    
    if (selectedInstitutionType) {
      const filteredQuestions = allQuestions.filter((q: any) => 
        !q.vertical || q.vertical === selectedInstitutionType
      );
      return filteredQuestions.map(adaptQuestion);
    } else {
      // Show organization selection and parameter questions
      const orgQuestions = allQuestions.filter((q: any) => 
        q.section === 'Organization Selection' || q.id.startsWith('P_')
      );
      return orgQuestions.map(adaptQuestion);
    }
  }, [allQuestions, selectedInstitutionType]);

  // Get sections and current section questions
  const sections = useMemo(
    () => Array.from(new Set(questions?.map(q => q.area))),
    [questions]
  );
  
  const currentSection = sections[sectionIdx] ?? '';
  const sectionQuestions = useMemo(
    () => questions?.filter(q => q.area === currentSection) ?? [],
    [questions, currentSection]
  );

  // Only log in development/client-side to prevent build errors
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('Simple Survey Debug:', {
      selectedInstitutionType,
      questionsLength: questions.length,
      sections,
      currentSection,
      sectionQuestionsLength: sectionQuestions.length,
      sectionIdx
    });
  }

  const handleAnswer = (questionId: string, value: number | null, text?: string) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('Answer submitted:', { questionId, value, text });
    }
    
    setResponses(prev => ({
      ...prev,
      [questionId]: { value, text }
    }));

    // Handle organization type selection
    if (questionId === 'ORG_TYPE' && text) {
      const orgTypeMap: Record<string, OrganizationType> = {
        'Community College': 'community_college',
        'Trade & Technical School': 'trade_technical',
        'Hospital & Healthcare System': 'hospital_healthcare',
        'Public University': 'public_university',
        'Private University': 'private_university',
        'Nonprofit Organization': 'nonprofit',
        'Government Agency': 'government_agency',
        'Company & Business': 'company_business'
      };
      
      const orgType = orgTypeMap[text];
      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        console.log('Setting organization type to:', orgType);
      }
      
      if (orgType) {
        setSelectedInstitutionType(orgType);
        setSectionIdx(0); // Reset to first section
      }
    }
  };

  const handleNext = () => {
    if (sectionIdx < sections.length - 1) {
      setSectionIdx(sectionIdx + 1);
    }
  };

  const handlePrev = () => {
    if (sectionIdx > 0) {
      setSectionIdx(sectionIdx - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicNavigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-gray-600">Loading survey questions...</div>
        </div>
      </div>
    );
  }

  if (!sectionQuestions.length && selectedInstitutionType) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <PublicNavigation />
        <main className="max-w-xl mx-auto py-20 text-center space-y-6 flex-1">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-10">
            <h1 className="text-4xl font-bold text-slate-100 mb-4">Assessment Complete!</h1>
            <p className="text-lg text-slate-300 mb-8">
              Thank you for completing the organizational assessment.
            </p>
            <p className="text-sm text-slate-400">
              Total responses: {Object.keys(responses).length}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <PublicNavigation />
      
      <main className="max-w-4xl mx-auto px-4 py-8 flex-1">
        {/* Progress bar */}
        {selectedInstitutionType && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">
                Section {sectionIdx + 1} of {sections.length}: {currentSection}
              </span>
              <span className="text-sm text-slate-400">
                {Math.round(((sectionIdx + 1) / sections.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((sectionIdx + 1) / sections.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Questions */}
        <div className="space-y-6">
          {sectionQuestions.map((question, idx) => (
            <div key={question.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-medium text-slate-100 mb-4">
                {idx + 1}. {question.text}
              </h3>
              
              {question.type === 'likert' && (
                <LikertInput
                  onSelect={(value) => handleAnswer(question.id, value)}
                  initialValue={responses[question.id]?.value}
                />
              )}
              
              {question.type === 'number' && (
                <NumericInput
                  onSubmit={(value) => handleAnswer(question.id, value)}
                  initialValue={responses[question.id]?.value}
                />
              )}
              
              {question.type === 'select' && question.options && (
                <SelectInput
                  options={question.options}
                  onSelect={(text) => handleAnswer(question.id, null, text)}
                  type="select"
                  initialValue={responses[question.id]?.text}
                />
              )}
            </div>
          ))}
        </div>

        {/* Navigation */}
        {selectedInstitutionType && (
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrev}
              disabled={sectionIdx === 0}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            
            <button
              onClick={handleNext}
              disabled={sectionIdx >= sections.length - 1}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Debug info */}
        <div className="mt-8 text-xs text-slate-500 font-mono">
          Debug: {questions.length} total questions, {sectionQuestions.length} in current section
        </div>
      </main>
    </div>
  );
}