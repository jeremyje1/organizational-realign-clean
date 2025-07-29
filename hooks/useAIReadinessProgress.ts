import { useState, useEffect, useCallback } from 'react';

/**
 * AI Readiness Assessment Progress State
 */
interface AIReadinessProgressState {
  currentStep: number;
  totalSteps: number;
  currentSection: string;
  completedSections: Set<string>;
  responses: Record<string, any>;
  teamResponses: Record<string, Record<string, any>>;
  isComplete: boolean;
  validationErrors: string[];
  warnings: string[];
}

/**
 * Team member for collaborative assessments
 */
interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'contributor' | 'viewer';
  joinedAt: Date;
  lastActive?: Date;
}

/**
 * Auto-save configuration for AI readiness assessments
 */
interface AIReadinessAutoSaveConfig {
  delay?: number;
  storageKey?: string;
  maxAge?: number;
  enableTeamSync?: boolean;
}

/**
 * Hook for managing AI readiness assessment progress with team support
 */
export function useAIReadinessProgress(
  initialSteps: number,
  sections: string[],
  autoSaveConfig: AIReadinessAutoSaveConfig = {}
) {
  const {
    delay = 2000,
    storageKey = 'ai-readiness-progress',
    maxAge = 24,
    enableTeamSync = false
  } = autoSaveConfig;

  const [progress, setProgress] = useState<AIReadinessProgressState>({
    currentStep: 0,
    totalSteps: initialSteps,
    currentSection: sections[0] || '',
    completedSections: new Set(),
    responses: {},
    teamResponses: {},
    isComplete: false,
    validationErrors: [],
    warnings: []
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isTeamMode, setIsTeamMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Auto-save progress
  useEffect(() => {
    if (delay > 0) {
      const timeoutId = setTimeout(() => {
        saveProgress();
      }, delay);

      return () => clearTimeout(timeoutId);
    }
  }, [progress, delay]);

  // Load saved progress on mount
  useEffect(() => {
    loadProgress();
  }, []);

  const saveProgress = useCallback(async () => {
    if (typeof window === 'undefined') return;

    setIsSaving(true);
    try {
      const dataToSave = {
        ...progress,
        completedSections: Array.from(progress.completedSections),
        teamMembers,
        isTeamMode,
        timestamp: new Date().toISOString()
      };

      localStorage.setItem(storageKey, JSON.stringify(dataToSave));
      setLastSaved(new Date());

      // If team mode is enabled, sync with team
      if (enableTeamSync && isTeamMode) {
        await syncWithTeam(dataToSave);
      }
    } catch (error) {
      console.error('Failed to save AI readiness progress:', error);
    } finally {
      setIsSaving(false);
    }
  }, [progress, teamMembers, isTeamMode, storageKey, enableTeamSync]);

  const loadProgress = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const data = JSON.parse(saved);
        const savedTime = new Date(data.timestamp);
        const now = new Date();
        const hoursOld = (now.getTime() - savedTime.getTime()) / (1000 * 60 * 60);

        if (hoursOld <= maxAge) {
          setProgress(prev => ({
            ...prev,
            ...data,
            completedSections: new Set(data.completedSections || [])
          }));
          setTeamMembers(data.teamMembers || []);
          setIsTeamMode(data.isTeamMode || false);
        }
      }
    } catch (error) {
      console.error('Failed to load AI readiness progress:', error);
    }
  }, [storageKey, maxAge]);

  const syncWithTeam = useCallback(async (data: any) => {
    // Implementation would sync with backend/database
    // For now, this is a placeholder
    console.log('Syncing team progress:', data);
  }, []);

  const nextStep = useCallback(() => {
    setProgress(prev => {
      const newStep = Math.min(prev.currentStep + 1, prev.totalSteps - 1);
      const sectionIndex = Math.floor(newStep / (prev.totalSteps / sections.length));
      return {
        ...prev,
        currentStep: newStep,
        currentSection: sections[sectionIndex] || prev.currentSection,
        isComplete: newStep >= prev.totalSteps - 1
      };
    });
  }, [sections]);

  const prevStep = useCallback(() => {
    setProgress(prev => {
      const newStep = Math.max(prev.currentStep - 1, 0);
      const sectionIndex = Math.floor(newStep / (prev.totalSteps / sections.length));
      return {
        ...prev,
        currentStep: newStep,
        currentSection: sections[sectionIndex] || prev.currentSection,
        isComplete: false
      };
    });
  }, [sections]);

  const setStep = useCallback((step: number) => {
    setProgress(prev => {
      const newStep = Math.max(0, Math.min(step, prev.totalSteps - 1));
      const sectionIndex = Math.floor(newStep / (prev.totalSteps / sections.length));
      return {
        ...prev,
        currentStep: newStep,
        currentSection: sections[sectionIndex] || prev.currentSection,
        isComplete: newStep >= prev.totalSteps - 1
      };
    });
  }, [sections]);

  const updateResponse = useCallback((questionId: string, value: any, userId?: string) => {
    setProgress(prev => {
      if (isTeamMode && userId) {
        return {
          ...prev,
          teamResponses: {
            ...prev.teamResponses,
            [userId]: {
              ...prev.teamResponses[userId],
              [questionId]: value
            }
          }
        };
      } else {
        return {
          ...prev,
          responses: {
            ...prev.responses,
            [questionId]: value
          }
        };
      }
    });
  }, [isTeamMode]);

  const completeSection = useCallback((sectionName: string) => {
    setProgress(prev => ({
      ...prev,
      completedSections: new Set(prev.completedSections).add(sectionName)
    }));
  }, []);

  const addTeamMember = useCallback((member: Omit<TeamMember, 'id' | 'joinedAt'>) => {
    const newMember: TeamMember = {
      ...member,
      id: `member_${Date.now()}`,
      joinedAt: new Date()
    };
    setTeamMembers(prev => [...prev, newMember]);
  }, []);

  const removeTeamMember = useCallback((memberId: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== memberId));
  }, []);

  const enableTeamMode = useCallback(() => {
    setIsTeamMode(true);
  }, []);

  const disableTeamMode = useCallback(() => {
    setIsTeamMode(false);
    setTeamMembers([]);
  }, []);

  const addValidationError = useCallback((error: string) => {
    setProgress(prev => ({
      ...prev,
      validationErrors: [...prev.validationErrors, error]
    }));
  }, []);

  const clearValidationErrors = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      validationErrors: []
    }));
  }, []);

  const reset = useCallback(() => {
    setProgress({
      currentStep: 0,
      totalSteps: initialSteps,
      currentSection: sections[0] || '',
      completedSections: new Set(),
      responses: {},
      teamResponses: {},
      isComplete: false,
      validationErrors: [],
      warnings: []
    });
    setTeamMembers([]);
    setIsTeamMode(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(storageKey);
    }
  }, [initialSteps, sections, storageKey]);

  const getProgressPercentage = useCallback(() => {
    return Math.round((progress.currentStep / progress.totalSteps) * 100);
  }, [progress.currentStep, progress.totalSteps]);

  const getSectionProgress = useCallback((sectionName: string) => {
    const sectionQuestions = Object.keys(progress.responses).filter(q => 
      q.startsWith(sectionName.toLowerCase().replace(/\s+/g, '_'))
    );
    const answered = sectionQuestions.filter(q => progress.responses[q]).length;
    return sectionQuestions.length > 0 ? (answered / sectionQuestions.length) * 100 : 0;
  }, [progress.responses]);

  const canGoNext = progress.currentStep < progress.totalSteps - 1;
  const canGoPrev = progress.currentStep > 0;
  const hasValidationErrors = progress.validationErrors.length > 0;

  return {
    // Progress state
    progress,
    getProgressPercentage,
    getSectionProgress,
    
    // Navigation
    nextStep,
    prevStep,
    setStep,
    canGoNext,
    canGoPrev,
    
    // Response management
    updateResponse,
    completeSection,
    
    // Team features
    teamMembers,
    isTeamMode,
    addTeamMember,
    removeTeamMember,
    enableTeamMode,
    disableTeamMode,
    
    // Validation
    addValidationError,
    clearValidationErrors,
    hasValidationErrors,
    
    // Auto-save
    isSaving,
    lastSaved,
    saveProgress,
    loadProgress,
    
    // Utilities
    reset
  };
}
