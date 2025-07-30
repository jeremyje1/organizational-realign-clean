"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from 'next/navigation';
import { useUser } from "@supabase/auth-helpers-react";
import PublicNavigation from "@/components/PublicNavigation";
import { CheckCircle2, AlertCircle, Clock, Building2, Upload, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  allQuestions,
  OrganizationType, 
  Question
} from "@/data/northpathQuestionBank";

// Likert scale component
function LikertInput({ onSelect, value }: { onSelect: (value: number) => void; value?: number }) {
  const options = [
    { value: 1, label: "Strongly Disagree" },
    { value: 2, label: "Disagree" },
    { value: 3, label: "Neutral" },
    { value: 4, label: "Agree" },
    { value: 5, label: "Strongly Agree" }
  ];

  return (
    <div className="space-y-3">
      {options.map((option) => (
        <label key={option.value} className="flex items-center p-3 bg-slate-800/30 border border-slate-600/30 rounded-lg hover:border-slate-500/50 cursor-pointer transition-all duration-200">
          <input
            type="radio"
            value={option.value}
            checked={value === option.value}
            onChange={() => onSelect(option.value)}
            className="sr-only"
          />
          <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
            value === option.value 
              ? 'bg-purple-400 border-purple-400' 
              : 'border-slate-400'
          }`}>
            {value === option.value && (
              <div className="w-full h-full rounded-full bg-white scale-50"></div>
            )}
          </div>
          <span className={`text-sm ${
            value === option.value ? 'text-purple-200' : 'text-slate-300'
          }`}>
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
}

// Text input component
function TextInput({ onSubmit, value, placeholder }: { 
  onSubmit: (value: string) => void; 
  value?: string;
  placeholder?: string;
}) {
  const [text, setText] = useState(value || '');

  useEffect(() => {
    if (text.trim() && text !== value) {
      const timer = setTimeout(() => onSubmit(text), 500);
      return () => clearTimeout(timer);
    }
  }, [text, onSubmit, value]);

  return (
    <textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder={placeholder || "Enter your response..."}
      rows={4}
      className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 resize-none"
    />
  );
}

// File upload component
function FileUpload({ onUpload, uploadedFiles }: { 
  onUpload: (files: File[]) => void;
  uploadedFiles?: File[];
}) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onUpload(files);
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
        <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
        <p className="text-slate-300 mb-2">Upload required files</p>
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer transition-colors">
          Choose Files
        </label>
      </div>
      
      {uploadedFiles && uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-slate-300">Uploaded files:</p>
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-slate-800/50 rounded">
              <span className="text-sm text-slate-200">{file.name}</span>
              <button
                onClick={() => {
                  const newFiles = uploadedFiles.filter((_, i) => i !== index);
                  onUpload(newFiles);
                }}
                className="text-slate-400 hover:text-red-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SurveyPage() {
  const user = useUser();
  const searchParams = useSearchParams();
  const orgType = searchParams.get('orgType') as OrganizationType;
  const sessionId = searchParams.get('sessionId');

  // State management
  const [loading, setLoading] = useState(true);
  const [sectionIdx, setSectionIdx] = useState(0);
  const [answers, setAnswers] = useState<Map<string, any>>(new Map());
  const [uploadedFiles, setUploadedFiles] = useState<Map<string, File[]>>(new Map());
  const [showValidation, setShowValidation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check for Supabase configuration
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn('Supabase not configured - running in demo mode');
    }
    setLoading(false);
  }, []);

  // Filter questions based on organization type
  const filteredQuestions = useMemo(() => {
    if (!orgType) return allQuestions.slice(0, 20); // Show first 20 questions if no org type
    
    return allQuestions.filter(question => {
      // Always include algorithm parameters and universal data uploads
      if (question.id.startsWith('P_') || question.id.startsWith('U_')) {
        return true;
      }
      
      // Include universal questions (no specific vertical)
      if (!question.vertical) {
        return true;
      }
      
      // Include questions for specific organization type
      return question.vertical === orgType;
    });
  }, [orgType]);

  // Group questions by section
  const sections = useMemo(() => {
    const sectionMap = new Map<string, Question[]>();
    
    filteredQuestions.forEach(question => {
      const section = question.section;
      if (!sectionMap.has(section)) {
        sectionMap.set(section, []);
      }
      sectionMap.get(section)!.push(question);
    });
    
    return Array.from(sectionMap.entries()).map(([name, questions]) => ({
      name,
      questions
    }));
  }, [filteredQuestions]);

  const currentSection = sections[sectionIdx];
  const isLastSection = sectionIdx === sections.length - 1;

  // Handle answer submission
  const handleAnswer = (questionId: string, value: any) => {
    const newAnswers = new Map(answers);
    newAnswers.set(questionId, value);
    setAnswers(newAnswers);
    
    // Auto-save logic could go here
    console.log(`Answer for ${questionId}:`, value);
  };

  // Handle file uploads
  const handleFileUpload = (questionId: string, files: File[]) => {
    const newFiles = new Map(uploadedFiles);
    newFiles.set(questionId, files);
    setUploadedFiles(newFiles);
    
    // Also save as answer
    handleAnswer(questionId, files.map(f => f.name));
  };

  // Navigation handlers
  const handleNext = () => {
    if (!currentSection) return;
    
    // Validate required questions
    const unansweredRequired = currentSection.questions
      .filter(q => q.required)
      .filter(q => !answers.has(q.id));
      
    if (unansweredRequired.length > 0) {
      setShowValidation(true);
      return;
    }
    
    setShowValidation(false);
    
    if (isLastSection) {
      handleSubmit();
    } else {
      setSectionIdx(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (sectionIdx > 0) {
      setSectionIdx(prev => prev - 1);
      setShowValidation(false);
    }
  };

  // Submit final assessment
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Prepare submission data
      const submissionData = {
        sessionId,
        organizationType: orgType,
        answers: Object.fromEntries(answers),
        uploadedFiles: Object.fromEntries(uploadedFiles),
        completedAt: new Date().toISOString(),
        userId: user?.id
      };

      console.log('Submitting assessment:', submissionData);
      
      // Send to API endpoint for processing
      const response = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });

      const result = await response.json();
      
      if (result.success) {
        // Redirect to results page with analysis
        window.location.href = `/assessment/results?sessionId=${sessionId}&assessmentId=${result.analysisResults.assessmentId}`;
      } else {
        throw new Error(result.error || 'Submission failed');
      }
      
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error submitting your assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen elegant-bg flex items-center justify-center">
        <div className="card p-12 text-center max-w-lg animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400"></div>
          </div>
          <h2 className="text-2xl font-semibold text-slate-100 mb-4">Loading Assessment</h2>
          <p className="text-slate-300">Preparing your customized evaluation...</p>
        </div>
      </div>
    );
  }

  if (!currentSection) {
    return (
      <div className="min-h-screen elegant-bg flex items-center justify-center">
        <div className="card p-12 text-center max-w-lg">
          <AlertCircle className="h-16 w-16 text-amber-400 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-slate-100 mb-4">Assessment Error</h2>
          <p className="text-slate-300 mb-6">
            Unable to load assessment questions. Please check your organization type selection.
          </p>
          <Button onClick={() => window.location.href = '/assessment/start'}>
            Return to Setup
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen elegant-bg">
      <PublicNavigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Building2 className="h-6 w-6 text-purple-400" />
            <span className="text-purple-200 font-medium">
              {orgType ? orgType.replace('_', ' ').toUpperCase() : 'ASSESSMENT'}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">
            NorthPath Organizational Assessment
          </h1>
          <p className="text-slate-300">
            Section {sectionIdx + 1} of {sections.length}: {currentSection.name}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Overall Progress</span>
            <span>{Math.round(((sectionIdx + 1) / sections.length) * 100)}%</span>
          </div>
          <div className="bg-slate-700/30 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-500"
              style={{width: `${((sectionIdx + 1) / sections.length) * 100}%`}}
            ></div>
          </div>
        </div>

        {/* Validation message */}
        {showValidation && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-400/30 rounded-lg">
            <div className="flex items-center gap-2 text-amber-200">
              <AlertCircle className="h-5 w-5" />
              <span>Please answer all required questions before proceeding.</span>
            </div>
          </div>
        )}

        {/* Questions */}
        <div className="space-y-6 mb-8">
          {currentSection.questions.map((question, index) => {
            const isRequired = question.required;
            const isAnswered = answers.has(question.id);
            
            return (
              <Card key={question.id} className="bg-slate-800/30 border-slate-600/30">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-slate-400">
                          Question {index + 1} of {currentSection.questions.length}
                        </span>
                        {isRequired && (
                          <span className="text-xs bg-amber-500/20 text-amber-200 px-2 py-1 rounded">
                            Required
                          </span>
                        )}
                        {question.tags && question.tags.length > 0 && (
                          <div className="flex gap-1">
                            {question.tags.map(tag => (
                              <span key={tag} className="text-xs bg-blue-500/20 text-blue-200 px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-slate-100 text-lg">
                        {question.prompt}
                      </CardTitle>
                    </div>
                    {isAnswered && (
                      <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 ml-4" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {question.type === 'likert' && (
                    <LikertInput 
                      value={answers.get(question.id)}
                      onSelect={(value) => handleAnswer(question.id, value)}
                    />
                  )}
                  
                  {question.type === 'text' && (
                    <TextInput
                      value={answers.get(question.id) || ''}
                      onSubmit={(value) => handleAnswer(question.id, value)}
                      placeholder="Enter your response..."
                    />
                  )}
                  
                  {question.type === 'upload' && (
                    <FileUpload
                      uploadedFiles={uploadedFiles.get(question.id)}
                      onUpload={(files) => handleFileUpload(question.id, files)}
                    />
                  )}

                  {question.type === 'numeric' && (
                    <input
                      type="number"
                      value={answers.get(question.id) || ''}
                      onChange={(e) => handleAnswer(question.id, parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                      placeholder="Enter a number..."
                    />
                  )}

                  {question.type === 'select' && question.options && (
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <button
                          key={optionIndex}
                          onClick={() => handleAnswer(question.id, option)}
                          className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                            answers.get(question.id) === option
                              ? 'bg-purple-500/20 border-purple-400/50 text-purple-200'
                              : 'bg-slate-700/30 border-slate-600/30 hover:border-slate-500/50 text-slate-300'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {question.type === 'multiselect' && question.options && (
                    <div className="space-y-3">
                      <p className="text-sm text-slate-400">Select all that apply:</p>
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => {
                          const selectedOptions = answers.get(question.id) || [];
                          const isSelected = selectedOptions.includes(optionIndex);
                          
                          return (
                            <label key={optionIndex} className="flex items-center p-3 bg-slate-700/30 border border-slate-600/30 rounded-lg hover:border-slate-500/50 cursor-pointer transition-all duration-200">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  const currentSelections = answers.get(question.id) || [];
                                  let newSelections;
                                  if (e.target.checked) {
                                    newSelections = [...currentSelections, optionIndex];
                                  } else {
                                    newSelections = currentSelections.filter((i: number) => i !== optionIndex);
                                  }
                                  handleAnswer(question.id, newSelections);
                                }}
                                className="sr-only"
                              />
                              <div className={`w-4 h-4 rounded border-2 mr-3 ${
                                isSelected 
                                  ? 'bg-purple-400 border-purple-400' 
                                  : 'border-slate-400'
                              }`}>
                                {isSelected && (
                                  <CheckCircle2 className="h-3 w-3 text-white" />
                                )}
                              </div>
                              <span className={`text-sm ${
                                isSelected ? 'text-purple-200' : 'text-slate-300'
                              }`}>
                                {option}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={sectionIdx === 0}
            className="bg-slate-700/30 hover:bg-slate-600/50 text-slate-200 border-slate-600/50"
          >
            Previous Section
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-slate-400 mb-2">
              {answers.size} of {filteredQuestions.length} questions answered
            </p>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-400">
                {Math.max(1, Math.ceil((filteredQuestions.length - answers.size) * 1.5))} min remaining
              </span>
            </div>
          </div>
          
          <Button
            onClick={handleNext}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </div>
            ) : isLastSection ? (
              'Complete Assessment'
            ) : (
              'Next Section'
            )}
          </Button>
        </div>

        {/* Help section */}
        <div className="mt-8 p-4 bg-slate-800/30 rounded-lg border border-slate-600/30">
          <p className="text-sm text-slate-400 text-center">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@northpathstrategies.org" className="text-purple-400 hover:text-purple-300 transition-colors">
              support@northpathstrategies.org
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
