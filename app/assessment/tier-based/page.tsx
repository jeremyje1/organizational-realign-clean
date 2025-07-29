/**
 * Tier-Based Assessment Survey
 * Implements proper tier validation and industry-specific questions
 * 
 * @version 2.0.0
 * @author NorthPath Strategies
 */

'use client';

import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';


import { 
  getTierConfiguration, 
  hasFeatureAccess, 
  validateTierAccess,
  type PricingTier 
} from '@/lib/tierConfiguration';
import { 
  getQuestionsForTier, 
  validateAssessmentResponses as validateResponses,
  getAIOpportunityQuestions as _getAIOpportunityQuestions,
  getAIReadinessAssessment as _getAIReadinessAssessment,
  type Question, 
  type OrganizationType 
} from '@/lib/enhancedQuestionBankV3';

interface AssessmentState {
  currentSection: number;
  responses: Record<string, any>;
  organizationType: OrganizationType;
  institutionName: string;
  contactEmail: string;
  contactName: string;
  tier: string;  // Accept both organizational and AI Readiness tiers
  uploadedFiles: File[];
  isComplete: boolean;
  validationErrors: string[];
  assessmentId?: string;
}

// Memoized Input Components to prevent unnecessary re-renders
const LikertInput = React.memo(({ question, value, onResponse }: { 
  question: Question; 
  value?: number; 
  onResponse: (questionId: string, value: any) => void;
}) => {
  const options = [
    { value: 1, label: 'Strongly Disagree', color: 'bg-red-100 text-red-800' },
    { value: 2, label: 'Disagree', color: 'bg-orange-100 text-orange-800' },
    { value: 3, label: 'Neutral', color: 'bg-gray-100 text-gray-800' },
    { value: 4, label: 'Agree', color: 'bg-blue-100 text-blue-800' },
    { value: 5, label: 'Strongly Agree', color: 'bg-green-100 text-green-800' }
  ];

  return (
    <div className="space-y-3" role="radiogroup" aria-labelledby={`question-${question.id}`}>
      {options.map((option) => (
        <label 
          key={option.value} 
          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
            value === option.value 
              ? 'border-blue-500 bg-blue-50 shadow-sm' 
              : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          }`}
        >
          <input
            type="radio"
            name={`likert-${question.id}`}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onResponse(question.id, parseInt(e.target.value))}
            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
          />
          <div className="ml-3 flex-1">
            <span className={`text-sm font-medium px-2 py-1 rounded ${
              value === option.value ? option.color : 'text-gray-700'
            }`}>
              {option.label}
            </span>
          </div>
        </label>
      ))}
    </div>
  );
});
LikertInput.displayName = 'LikertInput';

const NumericInput = React.memo(({ question, value, onResponse }: { 
  question: Question; 
  value?: number; 
  onResponse: (questionId: string, value: any) => void;
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Handle empty string as undefined, otherwise parse as number
    const numericValue = inputValue === '' ? undefined : parseInt(inputValue);
    onResponse(question.id, numericValue);
  }, [onResponse, question.id]);

  return (
    <div className="space-y-2">
      <input
        type="number"
        value={value !== undefined ? value : ''}
        onChange={handleChange}
        min={question.validationRules?.min}
        max={question.validationRules?.max}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Enter numeric value"
      />
      {question.validationRules && (
        <p className="text-xs text-gray-500">
          Range: {question.validationRules.min} - {question.validationRules.max}
        </p>
      )}
    </div>
  );
});
NumericInput.displayName = 'NumericInput';

const TextInput = React.memo(({ question, value, onResponse }: { 
  question: Question; 
  value?: string; 
  onResponse: (questionId: string, value: any) => void;
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onResponse(question.id, e.target.value);
  }, [onResponse, question.id]);

  const maxLength = question.validationRules?.maxLength || 1000; // Default to 1000 characters
  const minLength = question.validationRules?.min || 0;
  const currentLength = (value || '').length;
  const rows = maxLength > 500 ? 6 : 4; // More rows for longer expected responses

  return (
    <div className="space-y-2">
      <textarea
        value={value || ''}
        onChange={handleChange}
        rows={rows}
        maxLength={maxLength}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
        placeholder={maxLength > 500 ? "Please provide detailed responses. You can list multiple items, challenges, or considerations..." : "Enter your response here..."}
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>
          {currentLength} / {maxLength} characters
          {minLength > 0 && ` (minimum: ${minLength})`}
        </span>
        {maxLength > 500 && (
          <span className="text-blue-600">💡 Feel free to list multiple items or elaborate on different aspects</span>
        )}
      </div>
      {question.helpText && (
        <p className="text-xs text-gray-600">{question.helpText}</p>
      )}
    </div>
  );
});
TextInput.displayName = 'TextInput';

const ContextInput = React.memo(({ question, value, onResponse }: { 
  question: Question; 
  value?: string; 
  onResponse: (questionId: string, value: any) => void;
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onResponse(`${question.id}_context`, e.target.value);
  }, [onResponse, question.id]);

  return (
    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <label className="block text-sm font-medium text-blue-900 mb-2">
        📝 Provide Additional Context (Optional)
      </label>
      <p className="text-sm text-blue-700 mb-3">
        {question.contextPrompt || "Please provide any additional context, variations across departments, or unique circumstances that would help us better understand your organization's situation."}
      </p>
      <textarea
        value={value || ''}
        onChange={handleChange}
        rows={3}
        maxLength={500}
        className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical bg-white"
        placeholder="Share additional details that help explain your response..."
      />
      <p className="text-xs text-blue-600 mt-1">
        {(value || '').length} / 500 characters • This helps our AI provide more tailored analysis
      </p>
    </div>
  );
});
ContextInput.displayName = 'ContextInput';

const FileUpload = React.memo(({ 
  question, 
  onFileUpload, 
  uploadedFiles 
}: { 
  question: Question;
  onFileUpload: (files: File[]) => void;
  uploadedFiles: File[];
}) => (
  <div className="space-y-4">
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <div className="h-8 w-8 text-gray-400 mx-auto mb-2 flex items-center justify-center text-2xl">📁</div>
      <p className="text-gray-600 mb-2">Upload organizational charts, job descriptions, or budget documents</p>
      <input
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
        onChange={(e) => onFileUpload(Array.from(e.target.files || []))}
        className="hidden"
        id={`upload-${question.id}`}
      />
      <label 
        htmlFor={`upload-${question.id}`}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
      >
        Choose Files
      </label>
    </div>
    
    {uploadedFiles.length > 0 && (
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Uploaded Files:</p>
        {uploadedFiles.map((file, index) => (
          <div key={index} className="flex items-center text-sm text-gray-600">
            <span className="text-green-500 mr-2">✓</span>
            {file.name}
          </div>
        ))}
      </div>
    )}
  </div>
));
FileUpload.displayName = 'FileUpload';

function TierBasedAssessmentContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dataRestored, setDataRestored] = useState(false);

  // Derive tier and organization type from URL params
  const tierParam = searchParams.get('tier') || 'one-time-diagnostic';
  const orgParam = (searchParams.get('org') as OrganizationType) || 'higher-education';
  const aiReadinessTiers = ['higher-ed-ai-pulse-check', 'ai-readiness-comprehensive', 'ai-transformation-blueprint', 'ai-enterprise-partnership'];
  const assessmentType = aiReadinessTiers.includes(tierParam) ? 'ai-readiness' : 'organizational';

  // Initialize state with URL-derived tier and orgType
  const [assessmentState, setAssessmentState] = useState<AssessmentState>({
    currentSection: 0,
    responses: {},
    organizationType: orgParam,
    institutionName: '',
    contactEmail: '',
    contactName: '',
    tier: tierParam,
    uploadedFiles: [],
    isComplete: false,
    validationErrors: []
  });
  
  // Ensure component is mounted on client to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Validate URL parameters with fallbacks
  const validateTier = (tier: string | null): PricingTier => {
    const validOrgTiers: PricingTier[] = ['one-time-diagnostic', 'monthly-subscription', 'comprehensive-package', 'enterprise-transformation'];
    const aiReadinessTiers: string[] = ['higher-ed-ai-pulse-check', 'ai-readiness-comprehensive', 'ai-transformation-blueprint', 'ai-enterprise-partnership'];
    
    // Only return valid organizational tiers
    if (validOrgTiers.includes(tier as PricingTier)) {
      return tier as PricingTier;
    }
    
    // If AI Blueprint tier is requested, default to basic organizational tier
    // (AI Blueprint should use separate pages)
    return 'one-time-diagnostic';
  };
  
  const validateOrgType = (orgType: string | null): OrganizationType => {
    const validOrgTypes: OrganizationType[] = ['higher-education', 'healthcare', 'nonprofit', 'corporate', 'government'];
    return validOrgTypes.includes(orgType as OrganizationType) ? orgType as OrganizationType : 'higher-education';
  };
  
  // Auto-save functionality
  const saveKey = useMemo(() => 
    `assessment-draft-${assessmentState.tier}-${assessmentState.organizationType}`,
    [assessmentState.tier, assessmentState.organizationType]
  );
  
  // Load saved assessment data on mount
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      const savedData = localStorage.getItem(saveKey);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          // Only restore if the tier and org type match current URL params
          if (parsed.tier === assessmentState.tier && 
              parsed.organizationType === assessmentState.organizationType) {
            setAssessmentState(prev => ({
              ...prev,
              ...parsed,
              isComplete: false, // Never restore as complete
              validationErrors: [] // Clear any old errors
            }));
            
            setDataRestored(true);
            // Show notification that we restored data
            console.log('Assessment progress restored from previous session');
          }
        } catch (e) {
          console.warn('Could not restore assessment data:', e);
        }
      }
    }
  }, [mounted, assessmentState.tier, assessmentState.organizationType, saveKey]);
  
  // Auto-save assessment state changes (debounced)
  useEffect(() => {
    if (mounted && !assessmentState.isComplete) {
      const timeoutId = setTimeout(() => {
        const dataToSave = {
          ...assessmentState,
          lastSaved: new Date().toISOString()
        };
        localStorage.setItem(saveKey, JSON.stringify(dataToSave));
      }, 2000); // Save 2 seconds after last change
      
      return () => clearTimeout(timeoutId);
    }
  }, [assessmentState, mounted, saveKey]);
  
  // Clear saved data when assessment is submitted successfully
  const clearSavedData = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(saveKey);
    }
  }, [saveKey]);

  // Get tier configuration and questions with safety checks
  const tierConfig = useMemo(() => {
    try {
      const config = getTierConfiguration(assessmentState.tier);
      if (!config) {
        console.error('Invalid tier configuration for:', assessmentState.tier);
        // Always return a valid config as fallback
        return getTierConfiguration('one-time-diagnostic') || {
          name: 'One-Time Diagnostic',
          price: 4995,
          targetCustomer: 'Default organizational assessment tier',
          coreDeliverables: ['Assessment and analysis'],
          assessmentScope: {
            questionCount: 50,
            sections: ['General Assessment'],
            algorithms: ['AIRIX'],
            reportPages: 8,
            followUpSupport: '30-min consultation'
          },
          features: {
            uploadSupport: true,
            dashboardRefresh: false,
            customReporting: false,
            powerBIEmbedded: false,
            apiConnectors: false,
            onSiteFacilitation: false,
            progressAudits: false,
            orgChartGenerator: true,
            scenarioBuilder: false,
            monteCarloSimulation: false,
            realTimeCollaboration: false,
            aiOpportunityAssessment: false,
            aiReadinessScore: false,
            automationRecommendations: false
          },
          guardrails: {
            maxAssessments: 1,
            maxUsers: 2,
            dataRetentionMonths: 3
          }
        };
      }
      return config;
    } catch (error) {
      console.error('Error getting tier configuration:', error);
      // Fallback to express-diagnostic if all else fails
      return {
        name: 'Express Diagnostic',
        price: 2495,
        targetCustomer: 'Default assessment tier',
        coreDeliverables: ['Assessment and analysis'],
        assessmentScope: {
          questionCount: 60,
          sections: ['General Assessment'],
          algorithms: ['OCI'],
          reportPages: 8,
          followUpSupport: '30-min consultation'
        },
        features: {
          uploadSupport: true,
          dashboardRefresh: false,
          customReporting: false,
          powerBIEmbedded: false,
          apiConnectors: false,
          onSiteFacilitation: false,
          progressAudits: false,
          orgChartGenerator: true,
          scenarioBuilder: false,
          monteCarloSimulation: false,
          realTimeCollaboration: false,
          aiOpportunityAssessment: false,
          aiReadinessScore: false,
          automationRecommendations: false
        },
        guardrails: {
          maxAssessments: 1,
          maxUsers: 2,
          dataRetentionMonths: 3
        }
      };
    }
  }, [assessmentState.tier]);
  
  const questions = useMemo(() => {
    // For AI readiness assessments, use the AI readiness questions
    if (assessmentType === 'ai-readiness' || assessmentState.tier.startsWith('ai-readiness')) {
      // Import and use AI readiness questions
      const { getAIReadinessQuestions } = require('@/lib/enhancedQuestionBankV3');
      
      // Map the organizational tier to appropriate AI readiness tier
      let aiTier: 'higher-ed-ai-pulse-check' | 'ai-readiness-comprehensive' | 'ai-transformation-blueprint' | 'ai-enterprise-partnership';
      
      // Check URL params to determine if this is specifically a pulse check
      const tierParam = searchParams.get('tier');
      
      if (tierParam === 'higher-ed-ai-pulse-check') {
        aiTier = 'higher-ed-ai-pulse-check'; // 50 questions for pulse check
      } else if (assessmentState.tier === 'one-time-diagnostic') {
        aiTier = 'ai-readiness-comprehensive'; // 105 questions for diagnostic
      } else if (assessmentState.tier === 'monthly-subscription') {
        aiTier = 'higher-ed-ai-pulse-check'; // 50 questions for pulse check
      } else if (assessmentState.tier === 'comprehensive-package') {
        aiTier = 'ai-transformation-blueprint'; // 150 questions for comprehensive
      } else if (assessmentState.tier === 'enterprise-transformation') {
        aiTier = 'ai-enterprise-partnership'; // 200 questions for enterprise
      } else {
        // If already an AI readiness tier, use it directly
        aiTier = assessmentState.tier as 'higher-ed-ai-pulse-check' | 'ai-readiness-comprehensive' | 'ai-transformation-blueprint' | 'ai-enterprise-partnership';
      }
      
      return getAIReadinessQuestions(aiTier);
    }
    
    // For organizational assessments, use the standard questions
    return getQuestionsForTier(assessmentState.tier, assessmentState.organizationType);
  }, [assessmentState.tier, assessmentState.organizationType, assessmentType]);

  // Group questions by section
  const questionSections = useMemo(() => {
    const sections: Record<string, Question[]> = {};
    questions.forEach(q => {
      if (!sections[q.section]) sections[q.section] = [];
      sections[q.section].push(q);
    });
    return sections;
  }, [questions]);

  const sectionNames = Object.keys(questionSections);
  const currentSectionQuestions = questionSections[sectionNames[assessmentState.currentSection]] || [];
  
  // Calculate progress
  const totalQuestions = questions.length;
  const answeredQuestions = Object.keys(assessmentState.responses).length;
  const progressPercentage = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  // Validate tier access
  useEffect(() => {
    const validation = validateTierAccess(assessmentState.tier, {
      assessmentsUsed: 0, // Check if they can start a new assessment
      usersCount: 1
    });
    
    if (!validation.valid && validation.upgradeRequired) {
      setShowUpgrade(true);
    }
  }, [assessmentState.tier]);

  const handleResponse = useCallback((questionId: string, value: any) => {
    setAssessmentState(prev => ({
      ...prev,
      responses: {
        ...prev.responses,
        [questionId]: value
      }
    }));
  }, []);

  const handleFileUpload = (files: File[]) => {
    if (!hasFeatureAccess(assessmentState.tier, 'uploadSupport')) {
      setShowUpgrade(true);
      return;
    }
    
    setAssessmentState(prev => ({
      ...prev,
      uploadedFiles: [...prev.uploadedFiles, ...files]
    }));
  };

  const navigateSection = (direction: 'next' | 'prev') => {
    const newSection = direction === 'next' 
      ? Math.min(assessmentState.currentSection + 1, sectionNames.length - 1)
      : Math.max(assessmentState.currentSection - 1, 0);
    
    setAssessmentState(prev => ({
      ...prev,
      currentSection: newSection
    }));

    // Scroll to top of the page when navigating to a new section
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const submitAssessment = async () => {
    setLoading(true);
    
    // Clear any previous validation errors
    setAssessmentState(prev => ({
      ...prev,
      validationErrors: []
    }));
    
    try {
      // Validate responses
      const aiReadinessTiers = [
        'higher-ed-ai-pulse-check',
        'ai-readiness-comprehensive',
        'ai-transformation-blueprint',
        'ai-enterprise-partnership'
      ];
      const isAI = aiReadinessTiers.includes(assessmentState.tier as string);
      if (isAI) {
        // For AI readiness assessments, validate with appropriate AI readiness tier
        let aiTier: 'higher-ed-ai-pulse-check' | 'ai-readiness-comprehensive' | 'ai-transformation-blueprint' | 'ai-enterprise-partnership';
        
        // Check URL params to determine if this is specifically a pulse check
        const tierParam = searchParams.get('tier');
        
        if (tierParam === 'higher-ed-ai-pulse-check') {
          aiTier = 'higher-ed-ai-pulse-check'; // 50 questions for pulse check
        } else if (assessmentState.tier === 'one-time-diagnostic') {
          aiTier = 'ai-readiness-comprehensive';
        } else if (assessmentState.tier === 'monthly-subscription') {
          aiTier = 'higher-ed-ai-pulse-check';
        } else if (assessmentState.tier === 'comprehensive-package') {
          aiTier = 'ai-transformation-blueprint';
        } else if (assessmentState.tier === 'enterprise-transformation') {
          aiTier = 'ai-enterprise-partnership';
        } else {
          aiTier = assessmentState.tier as 'higher-ed-ai-pulse-check' | 'ai-readiness-comprehensive' | 'ai-transformation-blueprint' | 'ai-enterprise-partnership';
        }
        
        const validation = validateResponses(
          assessmentState.responses, 
          aiTier,
          assessmentState.organizationType
        );
        
        if (!validation.valid) {
          setAssessmentState(prev => ({
            ...prev,
            validationErrors: [`Missing required responses: ${validation.missingRequired.join(', ')}`]
          }));
          setLoading(false);
          return;
        }
      } else {
        // For organizational assessments, use standard validation
        const validation = validateResponses(
          assessmentState.responses, 
          assessmentState.tier as Exclude<PricingTier, 'ai-readiness-basic' | 'ai-readiness-custom' | 'ai-readiness-advanced' | 'ai-readiness-comprehensive'>, 
          assessmentState.organizationType
        );
        
        if (!validation.valid) {
          setAssessmentState(prev => ({
            ...prev,
            validationErrors: [`Missing required responses: ${validation.missingRequired.join(', ')}`]
          }));
          setLoading(false);
          return;
        }
      }

      console.log('Submitting assessment with data:', {
        tier: assessmentState.tier,
        organizationType: assessmentState.organizationType,
        institutionName: assessmentState.institutionName,
        responseCount: Object.keys(assessmentState.responses).length,
        uploadedFileCount: assessmentState.uploadedFiles.length
      });

      // Determine API endpoint and request payload based on assessment type
      const apiEndpoint = assessmentType === 'ai-readiness' ? '/api/ai-readiness/submit' : '/api/assessment/submit';
      
      // Prepare request body based on assessment type
      const requestBody = assessmentType === 'ai-readiness' ? {
        responses: assessmentState.responses,
        tier: assessmentState.tier,
        industry: assessmentState.organizationType,
        institutionName: assessmentState.institutionName,
        contactEmail: assessmentState.contactEmail,
        contactName: assessmentState.contactName,
        uploadedFiles: assessmentState.uploadedFiles.map(f => ({ name: f.name, size: f.size, type: f.type })),
        assessmentType: 'ai-readiness'
      } : {
        tier: assessmentState.tier,
        organizationType: assessmentState.organizationType,
        institutionName: assessmentState.institutionName,
        contactEmail: assessmentState.contactEmail,
        contactName: assessmentState.contactName,
        responses: assessmentState.responses,
        uploadedFiles: assessmentState.uploadedFiles.map(f => ({ name: f.name, size: f.size, type: f.type }))
      };

      // Use AbortController to handle cleanup if component unmounts
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 30000); // 30 second timeout

      try {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
          signal: abortController.signal
        });

        clearTimeout(timeoutId);
        const result = await response.json();
        
        if (response.ok) {
          console.log('Assessment submitted successfully:', result);
          clearSavedData(); // Clear auto-saved draft data
          console.log('Submission result payload:', result);
          setAssessmentState(prev => ({
            ...prev,
            isComplete: true,
            assessmentId: result.assessmentId || result.id // Store the assessment ID returned as id
          }));
          
          // Remove automatic redirect - let user control their next step
          // if (result.redirectUrl) {
          //   setTimeout(() => {
          //     window.location.href = result.redirectUrl;
          //   }, 2000);
          // }
        } else {
          console.error('Assessment submission failed:', result);
          throw new Error(result.error || 'Assessment submission failed');
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          throw new Error('Request timed out. Please try again.');
        }
        throw fetchError;
      }
    } catch (error) {
      console.error('Error submitting assessment:', error);
      setAssessmentState(prev => ({
        ...prev,
        validationErrors: [error instanceof Error ? error.message : 'Failed to submit assessment. Please try again.']
      }));
    } finally {
      setLoading(false);
    }
  };

  if (assessmentState.isComplete) {
    // Additional safety check for success state
    if (!tierConfig || !tierConfig.name) {
      // Custom complete UI for AI readiness tiers (including pulse check and other AI tiers)
      if ([
        'higher-ed-ai-pulse-check',
        'ai-readiness-comprehensive',
        'ai-transformation-blueprint',
        'ai-enterprise-partnership'
      ].includes(assessmentState.tier)) {
        return (
          <div className="max-w-4xl mx-auto p-6">
            <Card>
              <CardHeader className="text-center">
                <div className="text-6xl text-green-500 mx-auto mb-4">✅</div>
                <CardTitle className="text-2xl text-green-700">AI Readiness Assessment Submitted!</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-gray-600">
                  Thank you! Your AI Readiness Assessment has been submitted successfully.
                </p>
                <p className="text-sm text-gray-500">
                  You will receive your detailed report at <strong>{assessmentState.contactEmail}</strong> within 3-5 business days.
                </p>
              </CardContent>
            </Card>
          </div>
        );
      }
      // Fallback for missing tier config
      return (
        <div className="max-w-4xl mx-auto p-6">
          <Card>
            <CardHeader className="text-center">
              <div className="text-6xl text-green-500 mx-auto mb-4">✅</div>
              <CardTitle className="text-2xl text-green-700">Assessment Complete!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">Your assessment has been submitted successfully.</p>
              <p className="text-sm text-gray-500 mt-4">Processing time: 3-5 business days</p>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader className="text-center">
            <div className="text-6xl text-green-500 mx-auto mb-4">✅</div>
            <CardTitle className="text-2xl text-green-700">Assessment Complete!</CardTitle>
            {assessmentState.assessmentId && (
              <p className="text-sm text-gray-500 mt-2">
                Assessment ID: <code className="bg-gray-100 px-2 py-1 rounded">{assessmentState.assessmentId}</code>
              </p>
            )}
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-gray-600">
              Your {tierConfig?.name || 'assessment'} assessment has been submitted successfully.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">What happens next:</h3>
              <ul className="text-sm text-blue-800 space-y-1 text-left">
                {tierConfig?.coreDeliverables?.map((deliverable, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-0.5 flex-shrink-0">✓</span>
                    {deliverable}
                  </li>
                )) || <li>Analysis will be completed within 3-5 business days</li>}
              </ul>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Email Confirmation</h3>
              <p className="text-sm text-green-800">
                A confirmation email has been sent to <strong>{assessmentState.contactEmail}</strong> with your assessment details and next steps.
              </p>
            </div>
            
            <p className="text-sm text-gray-500">
              <strong>Processing time:</strong> {tierConfig?.assessmentScope?.followUpSupport || '3-5 business days'}
            </p>
            
            {/* One-Time Diagnostic Upsell Section */}
            {assessmentState.tier === 'one-time-diagnostic' && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
                <h3 className="font-bold text-blue-900 mb-3 text-lg">🚀 Ready to Go Deeper?</h3>
                <p className="text-blue-800 mb-4">
                  Your Express Diagnostic has identified key areas for improvement. Take the next step with our comprehensive assessments for deeper insights and actionable roadmaps.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white p-4 rounded-lg border border-blue-100">
                    <h4 className="font-semibold text-blue-900 mb-2">One-Time Diagnostic</h4>
                    <p className="text-2xl font-bold text-green-600 mb-1">$4,995</p>
                    <p className="text-sm text-blue-700 mb-2">100+ questions • 35-page AI report • Advanced analysis</p>
                    <ul className="text-xs text-blue-600 space-y-1">
                      <li>✓ Complete organizational analysis</li>
                      <li>✓ Advanced AI opportunity identification</li>
                      <li>✓ 45-min strategy consultation</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-purple-100">
                    <h4 className="font-semibold text-purple-900 mb-2">Monthly Subscription</h4>
                    <p className="text-2xl font-bold text-green-600 mb-1">$2,995/mo</p>
                    <p className="text-sm text-purple-700 mb-2">Unlimited assessments • Dashboard • ROI modeling</p>
                    <ul className="text-xs text-purple-600 space-y-1">
                      <li>✓ Perfect for iterative improvement</li>
                      <li>✓ Track progress over time</li>
                      <li>✓ Monthly strategy calls</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() => window.location.href = `/assessment/tier-based?tier=one-time-diagnostic&org=${assessmentState.organizationType}`}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700"
                  >
                    Upgrade to One-Time Diagnostic
                  </Button>
                  <Button
                    onClick={() => window.location.href = `/assessment/tier-based?tier=monthly-subscription&org=${assessmentState.organizationType}`}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700"
                  >
                    Start Monthly Subscription
                  </Button>
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="px-6 py-3"
              >
                Return to Home
              </Button>
              <Button
                onClick={() => window.location.href = `/assessment/tier-based?tier=${assessmentState.tier}&org=${assessmentState.organizationType}`}
                variant="outline"
                className="px-6 py-3"
              >
                Start New Assessment
              </Button>
              {(assessmentState.tier === 'one-time-diagnostic' || assessmentState.tier === 'monthly-subscription') && (
                <Button
                  onClick={() => window.location.href = `/assessment/tier-based?tier=comprehensive-package&org=${assessmentState.organizationType}`}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700"
                >
                  Upgrade to Comprehensive
                </Button>
              )}
              {assessmentState.tier !== 'enterprise-transformation' && (
                <Button
                  onClick={() => window.location.href = `/assessment/tier-based?tier=enterprise-transformation&org=${assessmentState.organizationType}`}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700"
                >
                  Upgrade to Enterprise
                </Button>
              )}
            </div>
            
            <div className="border-t pt-4 mt-6">
              <p className="text-xs text-gray-500">
                Need help? Contact us at support@northpathstrategies.com or save your Assessment ID for reference.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showUpgrade) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-amber-600">
              <span className="text-amber-600 mr-2">⚠️</span>
              Upgrade Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>The feature you&apos;re trying to access requires a higher service tier.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(() => {
                const comprehensiveConfig = getTierConfiguration('comprehensive-package');
                const enterpriseConfig = getTierConfiguration('enterprise-transformation');
                
                return [
                  comprehensiveConfig && { key: 'comprehensive', tier: comprehensiveConfig },
                  enterpriseConfig && { key: 'enterprise', tier: enterpriseConfig }
                ].filter(Boolean).map(({ key, tier }) => (
                  <div key={key} className="p-4 border rounded-lg">
                    <h3 className="font-semibold">{tier.name}</h3>
                    <p className="text-2xl font-bold text-green-600">${tier.price.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{tier.targetCustomer}</p>
                  </div>
                ));
              })()}
            </div>
            <Button onClick={() => setShowUpgrade(false)} variant="outline">
              Continue with Current Tier
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header with tier info - show different info for AI readiness */}
      <Card className="mb-6">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-blue-900">
            {assessmentType === 'ai-readiness' ? (
              assessmentState.tier === 'higher-ed-ai-pulse-check' 
                ? 'AI Readiness Pulse Check - Higher Education'
                : 'AI Readiness Assessment'
            ) : (
              `${tierConfig?.name || 'Assessment'}`
            )}
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {assessmentType === 'ai-readiness' ? (
              assessmentState.tier === 'higher-ed-ai-pulse-check'
                ? 'Quick assessment to evaluate your institution\'s AI readiness and identify key opportunities'
                : 'Comprehensive AI readiness evaluation with strategic recommendations'
            ) : (
              tierConfig?.targetCustomer || 'Organizational assessment and analysis'
            )}
          </p>
          
          <div className="flex justify-center items-center space-x-6 mt-4">
            <div className="text-center">
              <span className="text-3xl font-bold text-green-600">
                {assessmentType === 'ai-readiness' ? (
                  assessmentState.tier === 'higher-ed-ai-pulse-check' ? '$1,995' : '$4,995'
                ) : (
                  `$${tierConfig?.price?.toLocaleString() || '4,995'}`
                )}
              </span>
              <p className="text-sm text-gray-500">
                {assessmentType === 'ai-readiness' ? (
                  assessmentState.tier === 'higher-ed-ai-pulse-check' ? '8 page report' : '15 page report'
                ) : (
                  `${tierConfig?.assessmentScope?.reportPages || 15} page report`
                )}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Progress indicator */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-700">Progress: {answeredQuestions} of {questions.length} questions</span>
            <span className="text-sm font-medium text-blue-600">{Math.round((answeredQuestions / questions.length) * 100)}% complete</span>
          </div>
          <Progress value={(answeredQuestions / questions.length) * 100} className="w-full" />
          
          {/* Section completion indicators */}
          <div className="flex flex-wrap gap-2 mt-4">
            {sectionNames.map((section, index) => {
              const sectionQuestions = questions.filter(q => q.section === section);
              const sectionAnswered = sectionQuestions.filter(q => 
                assessmentState.responses[q.id] !== undefined && assessmentState.responses[q.id] !== ''
              ).length;
              
              return (
                <button
                  key={section}
                  onClick={() => setAssessmentState(prev => ({ ...prev, currentSection: index }))}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    index === assessmentState.currentSection
                      ? 'bg-blue-600 text-white'
                      : sectionAnswered === sectionQuestions.length
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {section}
                  {sectionAnswered === sectionQuestions.length && (
                    <span className="ml-1 inline text-green-600">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Restored Data Notification */}
      {dataRestored && (
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <span className="text-blue-600 mr-2">🔄</span>
          <AlertDescription className="text-blue-800">
            Welcome back! We've restored your previous assessment progress. You can continue where you left off.
            <button 
              onClick={() => setDataRestored(false)}
              className="ml-2 text-blue-600 underline text-sm"
            >
              Dismiss
            </button>
          </AlertDescription>
        </Alert>
      )}

      {/* Error Messages */}
      {assessmentState.validationErrors.length > 0 && (
        <Alert className="mb-6">
          <span className="text-red-600 mr-2">⚠️</span>
          <AlertDescription>
            {assessmentState.validationErrors.join('; ')}
          </AlertDescription>
        </Alert>
      )}

      {/* Contact Information Section - shown only on first section */}
      {assessmentState.currentSection === 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
            <p className="text-sm text-gray-600">
              We&apos;ll use this information to send you updates about your assessment and results.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="institutionName" className="block text-sm font-medium text-gray-700 mb-2">
                Institution/Organization Name *
              </label>
              <input
                id="institutionName"
                type="text"
                value={assessmentState.institutionName}
                onChange={(e) => setAssessmentState(prev => ({ ...prev, institutionName: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your institution or organization name"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  id="contactName"
                  type="text"
                  value={assessmentState.contactName}
                  onChange={(e) => setAssessmentState(prev => ({ ...prev, contactName: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  id="contactEmail"
                  type="email"
                  value={assessmentState.contactEmail}
                  onChange={(e) => setAssessmentState(prev => ({ ...prev, contactEmail: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assessment Questions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">{currentSectionName}</CardTitle>
          <p className="text-sm text-gray-600">
            Section {assessmentState.currentSection + 1} of {sectionNames.length}
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          {currentQuestions.map((question) => {
            const response = assessmentState.responses[question.id];
            const contextResponse = assessmentState.responses[`${question.id}_context`];
            
            return (
              <div key={question.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {question.prompt}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </h3>
                  {question.helpText && (
                    <p className="text-sm text-gray-500 mb-3">{question.helpText}</p>
                  )}
                  
                  {question.type === 'likert' && (
                    <>
                      <p className="text-sm text-gray-600 mb-3">
                        {question.helpText || "Rate your agreement with this statement."}
                      </p>
                      <LikertInput
                        question={question}
                        value={response as number}
                        onResponse={handleResponse}
                      />
                    </>
                  )}
                  
                  {question.type === 'numeric' && (
                    <NumericInput
                      question={question}
                      value={response as number}
                      onResponse={handleResponse}
                    />
                  )}
                  
                  {question.type === 'text' && (
                    <TextInput
                      question={question}
                      value={response as string}
                      onResponse={handleResponse}
                    />
                  )}
                  
                  {question.type === 'upload' && (
                    <FileUpload
                      question={question}
                      onFileUpload={handleFileUpload}
                      uploadedFiles={assessmentState.uploadedFiles}
                    />
                  )}
                  
                  {question.enableContext && (
                    <ContextInput
                      question={question}
                      value={contextResponse as string}
                      onResponse={handleResponse}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigateSection('prev')}
            disabled={assessmentState.currentSection === 0}
            variant="outline"
          >
            Previous Section
          </Button>
          
          {/* Auto-save status */}
          <div className="text-sm text-gray-500 flex items-center">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
            Progress auto-saved
          </div>
        </div>
        
        <div className="space-x-4 flex items-center">
          {/* Manual save button */}
          <Button
            onClick={() => {
              const dataToSave = {
                ...assessmentState,
                lastSaved: new Date().toISOString()
              };
              localStorage.setItem(saveKey, JSON.stringify(dataToSave));
              alert('Assessment progress saved! You can return to complete it later.');
            }}
            variant="outline"
            size="sm"
          >
            💾 Save Progress
          </Button>
          
          {assessmentState.currentSection === sectionNames.length - 1 ? (
            <Button
              onClick={submitAssessment}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <>
                  <span className="mr-2 animate-spin">⏳</span>
                  Submitting...
                </>
              ) : (
                'Submit Assessment'
              )}
            </Button>
          ) : (
            <Button
              onClick={() => navigateSection('next')}
              disabled={assessmentState.currentSection === sectionNames.length - 1}
            >
              Next Section
            </Button>
          )}
        </div>
      </div>

      {/* Show package summary only for organizational tiers */}
      {assessmentType === 'organizational' && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Your {tierConfig?.name || 'Assessment'} Package Includes:</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Assessment Scope:</h4>
                <ul className="text-sm space-y-1">
                  <li>• {tierConfig?.assessmentScope?.questionCount || 0} targeted questions</li>
                  <li>• {tierConfig?.assessmentScope?.algorithms?.join(', ') || 'Standard'} analysis algorithms</li>
                  <li>• {tierConfig?.assessmentScope?.reportPages || 0} page comprehensive report</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Included Features:</h4>
                <ul className="text-sm space-y-1">
                  {tierConfig?.features?.uploadSupport && <li>• Secure file upload capability</li>}
                  {tierConfig?.features?.dashboardRefresh && <li>• Dashboard refresh & CSV exports</li>}
                  {tierConfig?.features?.powerBIEmbedded && <li>• Power BI embedded dashboards</li>}
                  {tierConfig?.features?.scenarioBuilder && <li>• Scenario modeling tools</li>}
                  {tierConfig?.features?.monteCarloSimulation && <li>• Monte Carlo simulations</li>}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function TierBasedAssessment() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assessment...</p>
        </div>
      </div>
    }>
      <TierBasedAssessmentContent />
    </Suspense>
  );
}
