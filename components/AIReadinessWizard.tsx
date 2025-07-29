"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Save,
  Upload,
  FileText,
  User
} from 'lucide-react';
import { AIReadinessQuestion } from './AIReadinessQuestion';
import { AIReadinessProgressTracker } from './AIReadinessProgressTracker';
import { AIReadinessTeamManager } from './AIReadinessTeamManager';
import { useAIReadinessProgress } from '@/hooks/useAIReadinessProgress';
import { motion, AnimatePresence } from 'framer-motion';

// Import AI readiness data
import aiReadinessData from '@/data/ai_readiness_questions.json';

/**
 * Enhanced AI Readiness Assessment Wizard
 */
interface AIReadinessWizardProps {
  onComplete: (results: any) => void;
  onSave?: (progress: any) => void;
  institutionName?: string;
  initialTeamMode?: boolean;
}

interface FormData {
  institutionName: string;
  institutionType: string;
  enrollmentSize: string;
  contactName: string;
  contactEmail: string;
  contactRole: string;
}

// Convert question data to our format
const convertQuestions = () => {
  return aiReadinessData.questions.map((q: any) => ({
    id: q.id,
    section: aiReadinessData.meta.domains.find((d: any) => d.id === q.domain)?.name || 'General',
    question: q.question,
    type: q.type === 'multiple_choice' ? 'multiple-choice' as const : 
          q.type === 'text_area' ? 'text' as const :
          q.type === 'likert_scale' ? 'likert' as const :
          q.type === 'numeric' ? 'numeric' as const :
          q.type === 'file_upload' ? 'upload' as const : 'text' as const,
    options: q.options?.map((opt: any) => ({
      value: opt.value,
      label: opt.label,
      weight: opt.score
    })),
    validationRules: {
      required: q.required,
      maxLength: q.maxLength,
      min: q.minValue,
      max: q.maxValue
    },
    helpText: q.helpText,
    contextPrompt: q.contextPrompt,
    enableContext: q.allowContext || false,
    tierMinimum: q.tierRequirement || 'starter',
    teamInput: q.teamQuestion ? {
      allowMultipleResponses: true,
      requireConsensus: q.requireConsensus || false,
      roles: ['admin', 'contributor']
    } : undefined
  }));
};

export function AIReadinessWizard({ 
  onComplete, 
  onSave, 
  institutionName = '',
  initialTeamMode = false 
}: AIReadinessWizardProps) {
  const questions = convertQuestions();
  const sections = [...new Set(questions.map(q => q.section))];
  
  // Form data state
  const [formData, setFormData] = useState<FormData>({
    institutionName,
    institutionType: '',
    enrollmentSize: '',
    contactName: '',
    contactEmail: '',
    contactRole: ''
  });

  // Progress management
  const {
    progress,
    getProgressPercentage,
    getSectionProgress,
    nextStep,
    prevStep,
    canGoNext,
    canGoPrev,
    updateResponse,
    completeSection,
    teamMembers,
    isTeamMode,
    addTeamMember,
    removeTeamMember,
    enableTeamMode,
    disableTeamMode,
    hasValidationErrors,
    clearValidationErrors,
    saveProgress,
    isSaving,
    lastSaved
  } = useAIReadinessProgress(
    questions.length + 2, // +2 for institution info and team setup
    sections,
    {
      storageKey: 'ai-readiness-assessment',
      enableTeamSync: true
    }
  );

  const [currentUser] = useState({
    id: 'user_' + Date.now(),
    name: formData.contactName || 'Assessment User',
    role: 'admin'
  });

  const [showTeamManager, setShowTeamManager] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize team mode if specified
  useEffect(() => {
    if (initialTeamMode && !isTeamMode) {
      enableTeamMode();
    }
  }, [initialTeamMode, isTeamMode, enableTeamMode]);

  // Auto-save on progress changes
  useEffect(() => {
    if (onSave) {
      onSave({
        progress,
        formData,
        teamMembers,
        isTeamMode
      });
    }
  }, [progress, formData, teamMembers, isTeamMode, onSave]);

  // Create steps for progress tracker
  const createSteps = () => {
    const steps = [
      {
        id: 'institution-info',
        label: 'Institution Info',
        description: 'Basic institution information',
        section: 'Setup',
        status: progress.currentStep === 0 ? 'current' as const :
                progress.currentStep > 0 ? 'completed' as const : 'upcoming' as const,
        estimatedTime: '3 min'
      }
    ];

    if (isTeamMode) {
      steps.push({
        id: 'team-setup',
        label: 'Team Setup',
        description: 'Configure team collaboration',
        section: 'Setup',
        status: progress.currentStep === 1 ? 'current' as const :
                progress.currentStep > 1 ? 'completed' as const : 'upcoming' as const,
        estimatedTime: '5 min'
      });
    }

    // Add section steps
    sections.forEach((section, index) => {
      const stepIndex = isTeamMode ? index + 2 : index + 1;
      const sectionQuestions = questions.filter(q => q.section === section);
      
      steps.push({
        id: section.toLowerCase().replace(/\s+/g, '-'),
        label: section,
        description: `${sectionQuestions.length} questions`,
        section: section,
        status: progress.currentStep === stepIndex ? 'current' as const :
                progress.currentStep > stepIndex ? 'completed' as const : 'upcoming' as const,
        estimatedTime: `${Math.ceil(sectionQuestions.length * 1.5)} min`
      });
    });

    return steps;
  };

  const steps = createSteps();
  const currentStepId = steps[progress.currentStep]?.id || 'institution-info';

  // Handle form data updates
  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle question responses
  const handleQuestionResponse = (questionId: string, response: any) => {
    updateResponse(questionId, response.value, isTeamMode ? currentUser.id : undefined);
    clearValidationErrors();
  };

  // Handle team member management
  const handleAddTeamMember = (member: any) => {
    addTeamMember({
      ...member,
      status: 'invited' as const,
      progress: 0
    });
  };

  const handleRemoveTeamMember = (memberId: string) => {
    removeTeamMember(memberId);
  };

  const handleUpdateMemberRole = (memberId: string, role: any) => {
    // Implementation would update member role
    console.log('Update member role:', memberId, role);
  };

  // Navigation handlers
  const handleNext = () => {
    if (progress.currentStep === 0) {
      // Validate institution info
      if (!formData.institutionName || !formData.institutionType || !formData.enrollmentSize) {
        return;
      }
    }
    
    if (canGoNext) {
      nextStep();
    }
  };

  const handlePrevious = () => {
    if (canGoPrev) {
      prevStep();
    }
  };

  // Submit assessment
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const results = {
        institutionInfo: formData,
        responses: progress.responses,
        teamResponses: progress.teamResponses,
        teamMembers,
        isTeamMode,
        completedAt: new Date().toISOString(),
        progress: getProgressPercentage()
      };
      
      await onComplete(results);
    } catch (error) {
      console.error('Assessment submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render institution info step
  const renderInstitutionInfo = () => (
    <Card className="bg-slate-800/50 border-slate-600/50">
      <CardHeader>
        <CardTitle className="text-xl text-slate-100">Institution Information</CardTitle>
        <p className="text-slate-400">Please provide basic information about your institution.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Institution Name *
          </label>
          <input
            type="text"
            value={formData.institutionName}
            onChange={(e) => updateFormData('institutionName', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your institution name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Institution Type *
          </label>
          <select
            value={formData.institutionType}
            onChange={(e) => updateFormData('institutionType', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select institution type</option>
            <option value="public_research">Public Research University</option>
            <option value="private_research">Private Research University</option>
            <option value="public_liberal_arts">Public Liberal Arts College</option>
            <option value="private_liberal_arts">Private Liberal Arts College</option>
            <option value="community_college">Community College</option>
            <option value="technical_vocational">Technical/Vocational School</option>
            <option value="graduate_school">Graduate School</option>
            <option value="online_university">Online University</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Enrollment Size *
          </label>
          <select
            value={formData.enrollmentSize}
            onChange={(e) => updateFormData('enrollmentSize', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select enrollment size</option>
            <option value="under_1000">Under 1,000</option>
            <option value="1000_5000">1,000 - 5,000</option>
            <option value="5001_10000">5,001 - 10,000</option>
            <option value="10001_20000">10,001 - 20,000</option>
            <option value="20001_30000">20,001 - 30,000</option>
            <option value="over_30000">Over 30,000</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Contact Name
            </label>
            <input
              type="text"
              value={formData.contactName}
              onChange={(e) => updateFormData('contactName', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Your name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Contact Email
            </label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => updateFormData('contactEmail', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="your.email@institution.edu"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Your Role
          </label>
          <input
            type="text"
            value={formData.contactRole}
            onChange={(e) => updateFormData('contactRole', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="e.g., CIO, VP of Academic Affairs, Faculty"
          />
        </div>
      </CardContent>
    </Card>
  );

  // Render current step content
  const renderCurrentStep = () => {
    if (progress.currentStep === 0) {
      return renderInstitutionInfo();
    }
    
    if (isTeamMode && progress.currentStep === 1) {
      return (
        <AIReadinessTeamManager
          teamMembers={teamMembers.map(m => ({ 
            ...m, 
            status: 'active' as const, 
            progress: 0 
          }))}
          onAddMember={handleAddTeamMember}
          onRemoveMember={handleRemoveTeamMember}
          onUpdateMemberRole={handleUpdateMemberRole}
          currentUserId={currentUser.id}
          isTeamMode={isTeamMode}
          onToggleTeamMode={(enabled) => enabled ? enableTeamMode() : disableTeamMode()}
        />
      );
    }
    
    // Render questions for current section
    const currentSectionIndex = isTeamMode ? progress.currentStep - 2 : progress.currentStep - 1;
    const currentSection = sections[currentSectionIndex];
    const sectionQuestions = questions.filter(q => q.section === currentSection);
    
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-100 mb-2">{currentSection}</h2>
          <p className="text-slate-400">
            {sectionQuestions.length} questions in this section
          </p>
        </div>
        
        <div className="space-y-6">
          {sectionQuestions.map((question) => (
            <AIReadinessQuestion
              key={question.id}
              question={question}
              response={progress.responses[question.id]}
              onResponseChange={handleQuestionResponse}
              isTeamMode={isTeamMode}
              currentUser={currentUser}
              teamMembers={teamMembers.map(m => ({ 
                id: m.id, 
                name: m.name, 
                role: m.role 
              }))}
            />
          ))}
        </div>
      </div>
    );
  };

  const isLastStep = progress.currentStep >= steps.length - 1;
  const canProceed = progress.currentStep === 0 ? 
    formData.institutionName && formData.institutionType && formData.enrollmentSize :
    true;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">
            AI Readiness Assessment
          </h1>
          <p className="text-slate-400">
            Comprehensive evaluation of your institution's readiness for AI integration
          </p>
          {isTeamMode && (
            <Badge className="mt-2 bg-green-500/20 text-green-300 border-green-400/30">
              <Users className="h-3 w-3 mr-1" />
              Team Assessment
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <AIReadinessProgressTracker
              steps={steps}
              currentStepId={currentStepId}
              showTimeEstimates={true}
              showTeamProgress={isTeamMode}
              variant="vertical"
              teamMembers={teamMembers.map(m => ({ 
                id: m.id, 
                name: m.name, 
                role: m.role, 
                progress: 0 
              }))}
            />

            {/* Auto-save status */}
            <div className="mt-6 p-3 bg-slate-700/30 rounded-lg text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                {isSaving ? (
                  <>
                    <Save className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : lastSaved ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Saved {lastSaved.toLocaleTimeString()}
                  </>
                ) : (
                  <>
                    <Clock className="h-4 w-4" />
                    Auto-save enabled
                  </>
                )}
              </div>
            </div>

            {/* Team toggle for initial setup */}
            {progress.currentStep === 0 && (
              <div className="mt-6">
                <button
                  onClick={() => isTeamMode ? disableTeamMode() : enableTeamMode()}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/30 rounded-lg text-blue-300 transition-colors"
                >
                  <Users className="h-4 w-4" />
                  {isTeamMode ? 'Switch to Individual' : 'Enable Team Mode'}
                </button>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={progress.currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderCurrentStep()}
              </motion.div>
            </AnimatePresence>

            {/* Validation Errors */}
            {hasValidationErrors && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-400/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <p className="text-red-300">Please complete all required fields before proceeding.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-600/50">
              <Button
                onClick={handlePrevious}
                disabled={!canGoPrev}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-400">
                  Step {progress.currentStep + 1} of {steps.length}
                </span>
                
                {isLastStep ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={!canProceed || isSubmitting}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Save className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Complete Assessment
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
