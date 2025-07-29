import { useState, useEffect, useCallback } from 'react';

/**
 * Interface for tracking progress state through a multi-step process
 */
interface ProgressState {
  currentStep: number;
  totalSteps: number;
  isComplete: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Configuration for auto-save functionality
 */
interface AutoSaveConfig {
  /** Delay in milliseconds before saving */
  delay?: number;
  /** Storage key for localStorage */
  storageKey?: string;
  /** Maximum age for drafts in hours */
  maxAge?: number;
  /** Enable/disable localStorage fallback */
  useLocalStorage?: boolean;
}

/**
 * Common validation functions for form fields
 */
export const validationRules = {
  required: (value: any) => !value ? 'This field is required' : null,
  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return value && !emailRegex.test(value) ? 'Please enter a valid email address' : null;
  },
  minLength: (min: number) => (value: string) => 
    value && value.length < min ? `Must be at least ${min} characters` : null,
  maxLength: (max: number) => (value: string) => 
    value && value.length > max ? `Must be no more than ${max} characters` : null,
  numeric: (value: any) => {
    const num = Number(value);
    return value && (isNaN(num) || !isFinite(num)) ? 'Must be a valid number' : null;
  },
  range: (min: number, max: number) => (value: number) => {
    const num = Number(value);
    return value && (num < min || num > max) ? `Must be between ${min} and ${max}` : null;
  }
};

/**
 * Storage utilities for progress data
 */
export const storageUtils = {
  /**
   * Save data to localStorage with timestamp
   */
  save: (key: string, data: any): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: new Date().toISOString()
      }));
      return true;
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      return false;
    }
  },

  /**
   * Load data from localStorage with age validation
   */
  load: <T>(key: string, maxAgeHours = 24): T | null => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return null;

      const { data, timestamp } = JSON.parse(saved);
      const savedTime = new Date(timestamp);
      const isRecent = Date.now() - savedTime.getTime() < maxAgeHours * 60 * 60 * 1000;
      
      return isRecent ? data : null;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return null;
    }
  },

  /**
   * Remove data from localStorage
   */
  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
      return false;
    }
  },

  /**
   * Check if localStorage is available
   */
  isAvailable: (): boolean => {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, 'test');
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
};

/**
 * Hook for managing progress through a multi-step process
 * @param initialSteps - The total number of steps in the process
 * @returns Progress state and control functions
 */
export function useProgress(initialSteps = 5) {
  const [progress, setProgress] = useState<ProgressState>({
    currentStep: 0,
    totalSteps: initialSteps,
    isComplete: false,
    errors: [],
    warnings: []
  });

  const nextStep = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, prev.totalSteps),
      isComplete: prev.currentStep + 1 >= prev.totalSteps
    }));
  }, []);

  const prevStep = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0),
      isComplete: false
    }));
  }, []);

  const setStep = useCallback((step: number) => {
    setProgress(prev => ({
      ...prev,
      currentStep: Math.max(0, Math.min(step, prev.totalSteps)),
      isComplete: step >= prev.totalSteps
    }));
  }, []);

  const addError = useCallback((error: string) => {
    setProgress(prev => ({
      ...prev,
      errors: [...prev.errors, error]
    }));
  }, []);

  const addWarning = useCallback((warning: string) => {
    setProgress(prev => ({
      ...prev,
      warnings: [...prev.warnings, warning]
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      errors: []
    }));
  }, []);

  const clearWarnings = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      warnings: []
    }));
  }, []);

  const reset = useCallback(() => {
    setProgress({
      currentStep: 0,
      totalSteps: initialSteps,
      isComplete: false,
      errors: [],
      warnings: []
    });
  }, [initialSteps]);

  const getProgressPercentage = useCallback(() => {
    return Math.round((progress.currentStep / progress.totalSteps) * 100);
  }, [progress.currentStep, progress.totalSteps]);

  const canGoNext = progress.currentStep < progress.totalSteps;
  const canGoPrev = progress.currentStep > 0;
  const hasIssues = progress.errors.length > 0 || progress.warnings.length > 0;

  return {
    progress,
    nextStep,
    prevStep,
    setStep,
    addError,
    addWarning,
    clearErrors,
    clearWarnings,
    reset,
    getProgressPercentage,
    canGoNext,
    canGoPrev,
    hasIssues
  };
}

/**
 * Auto-save hook for survey responses
 * @param data - The data to auto-save
 * @param delay - Delay in milliseconds before saving (default: 2000ms)
 * @returns Auto-save state and control functions
 */
export function useAutoSave<T>(data: T, delay = 2000) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!data) return;
    
    const timer = setTimeout(async () => {
      setIsSaving(true);
      setSaveError(null);
      
      try {
        // Save data to localStorage as fallback
        localStorage.setItem('survey_draft', JSON.stringify({
          data,
          timestamp: new Date().toISOString()
        }));
        
        // TODO: Implement API save
        // await saveDraft(data);
        
        setLastSaved(new Date());
      } catch (error) {
        setSaveError(error instanceof Error ? error.message : 'Failed to save progress');
        console.error('Auto-save error:', error);
      } finally {
        setIsSaving(false);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [data, delay]);

  const loadDraft = useCallback(() => {
    try {
      const saved = localStorage.getItem('survey_draft');
      if (saved) {
        const { data: savedData, timestamp } = JSON.parse(saved);
        const savedTime = new Date(timestamp);
        const isRecent = Date.now() - savedTime.getTime() < 24 * 60 * 60 * 1000; // 24 hours
        
        if (isRecent) {
          return savedData;
        }
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
    return null;
  }, []);

  const clearDraft = useCallback(() => {
    localStorage.removeItem('survey_draft');
    setLastSaved(null);
  }, []);

  const forceSave = useCallback(async () => {
    if (!data) return;
    
    setIsSaving(true);
    setSaveError(null);
    
    try {
      localStorage.setItem('survey_draft', JSON.stringify({
        data,
        timestamp: new Date().toISOString()
      }));
      
      // TODO: Implement API save
      // await saveDraft(data);
      
      setLastSaved(new Date());
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save progress');
      console.error('Force save error:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [data]);

  return {
    isSaving,
    lastSaved,
    saveError,
    loadDraft,
    clearDraft,
    forceSave
  };
}

/**
 * Form validation hook with field-level and form-level validation
 * @param initialValues - Initial form values
 * @param validationRules - Validation rules for each field
 * @returns Form state and validation functions
 */
export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: Record<keyof T, (value: any) => string | null>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouchedState] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateField = useCallback((field: keyof T, value: any) => {
    const rule = validationRules[field];
    if (rule) {
      const error = rule(value);
      setErrors(prev => ({
        ...prev,
        [field]: error
      }));
      return error === null;
    }
    return true;
  }, [validationRules]);

  const validateAll = useCallback(() => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      const rule = validationRules[field as keyof T];
      const value = values[field as keyof T];
      const error = rule(value);
      
      if (error) {
        newErrors[field as keyof T] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validationRules, values]);

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (touched[field]) {
      validateField(field, value);
    }
  }, [touched, validateField]);

  const setTouched = useCallback((field: keyof T) => {
    setTouchedState(prev => ({
      ...prev,
      [field]: true
    }));
    validateField(field, values[field]);
  }, [validateField, values]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouchedState({});
  }, [initialValues]);

  // Check if the form is valid (no errors and all required fields are valid)
  const isValid = Object.values(errors).every(error => !error);
  
  // Check if the form has been modified from initial values
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  return {
    values,
    errors,
    touched,
    setValue,
    setTouched,
    validateAll,
    reset,
    isValid,
    isDirty,
    hasErrors: Object.values(errors).some(error => Boolean(error))
  };
}

/**
 * Hook for managing survey step progression with validation
 * @param totalSections - Total number of survey sections
 * @param validationFn - Function to validate current section before proceeding
 * @returns Survey navigation state and functions
 */
export function useSurveyProgress(
  totalSections: number,
  validationFn?: (sectionIndex: number) => boolean
) {
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const canGoNext = currentSection < totalSections - 1;
  const canGoPrev = currentSection > 0;
  const isLastSection = currentSection === totalSections - 1;
  const progressPercentage = Math.round(((currentSection + 1) / totalSections) * 100);

  const goToNext = useCallback(() => {
    if (!canGoNext) return false;

    // Validate current section if validation function is provided
    if (validationFn && !validationFn(currentSection)) {
      setValidationErrors(['Please complete all required fields in this section']);
      return false;
    }

    setCompletedSections(prev => new Set(prev).add(currentSection));
    setCurrentSection(prev => prev + 1);
    setValidationErrors([]);
    return true;
  }, [canGoNext, currentSection, validationFn]);

  const goToPrev = useCallback(() => {
    if (!canGoPrev) return false;
    
    setCurrentSection(prev => prev - 1);
    setValidationErrors([]);
    return true;
  }, [canGoPrev]);

  const goToSection = useCallback((index: number) => {
    if (index < 0 || index >= totalSections) return false;
    
    setCurrentSection(index);
    setValidationErrors([]);
    return true;
  }, [totalSections]);

  const markSectionComplete = useCallback((index: number) => {
    setCompletedSections(prev => new Set(prev).add(index));
  }, []);

  const resetProgress = useCallback(() => {
    setCurrentSection(0);
    setCompletedSections(new Set());
    setValidationErrors([]);
  }, []);

  return {
    currentSection,
    completedSections: Array.from(completedSections),
    validationErrors,
    canGoNext,
    canGoPrev,
    isLastSection,
    progressPercentage,
    goToNext,
    goToPrev,
    goToSection,
    markSectionComplete,
    resetProgress,
    setValidationErrors
  };
}

/**
 * Hook for managing survey form state with auto-save and validation
 * @param initialData - Initial survey data
 * @param autoSaveConfig - Configuration for auto-save functionality
 * @returns Combined form state, validation, and auto-save functionality
 */
export function useSurveyForm<T extends Record<string, any>>(
  initialData: T,
  autoSaveConfig: AutoSaveConfig = {}
) {
  const {
    delay = 2000,
    storageKey = 'survey_draft',
    maxAge = 24,
    useLocalStorage = true
  } = autoSaveConfig;

  const [formData, setFormData] = useState<T>(initialData);
  const [isDirty, setIsDirty] = useState(false);
  const [lastModified, setLastModified] = useState<Date | null>(null);

  // Auto-save functionality
  const {
    isSaving,
    lastSaved,
    saveError,
    forceSave,
    clearDraft
  } = useAutoSave(formData, delay);

  // Update form field
  const updateField = useCallback((field: keyof T, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
    setLastModified(new Date());
  }, []);

  // Update multiple fields at once
  const updateFields = useCallback((updates: Partial<T>) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
    setIsDirty(true);
    setLastModified(new Date());
  }, []);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setFormData(initialData);
    setIsDirty(false);
    setLastModified(null);
    if (useLocalStorage) {
      clearDraft();
    }
  }, [initialData, useLocalStorage, clearDraft]);

  // Load draft from storage
  const loadDraft = useCallback(() => {
    if (!useLocalStorage) return null;
    
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const { data: savedData, timestamp } = JSON.parse(saved);
        const savedTime = new Date(timestamp);
        const isRecent = Date.now() - savedTime.getTime() < maxAge * 60 * 60 * 1000;
        
        if (isRecent) {
          setFormData(savedData);
          setIsDirty(true);
          setLastModified(savedTime);
          return savedData;
        }
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
    return null;
  }, [storageKey, maxAge, useLocalStorage]);

  // Check if form has unsaved changes
  const hasUnsavedChanges = isDirty && (!lastSaved || (lastModified && lastModified > lastSaved));

  return {
    formData,
    updateField,
    updateFields,
    resetForm,
    loadDraft,
    isDirty,
    hasUnsavedChanges,
    lastModified,
    isSaving,
    lastSaved,
    saveError,
    forceSave,
    clearDraft
  };
}

/**
 * Utility function to create a section validation function for surveys
 * @param requiredQuestions - Array of question IDs that must be answered
 * @param answeredQuestions - Set of currently answered question IDs
 * @returns Validation function for useSurveyProgress
 */
export function createSectionValidator(
  requiredQuestions: string[],
  answeredQuestions: Set<string>
) {
  return (sectionIndex: number): boolean => {
    // For now, just check if all required questions are answered
    // This could be enhanced to check specific sections
    return requiredQuestions.every(questionId => answeredQuestions.has(questionId));
  };
}

/**
 * Utility function to calculate survey completion percentage
 * @param answeredQuestions - Set of answered question IDs
 * @param totalQuestions - Total number of questions in the survey
 * @returns Completion percentage (0-100)
 */
export function calculateCompletionPercentage(
  answeredQuestions: Set<string>,
  totalQuestions: number
): number {
  if (totalQuestions === 0) return 0;
  return Math.round((answeredQuestions.size / totalQuestions) * 100);
}

/**
 * Utility function to get survey status based on completion
 * @param completionPercentage - Current completion percentage
 * @returns Status string
 */
export function getSurveyStatus(completionPercentage: number): string {
  if (completionPercentage === 0) return 'Not Started';
  if (completionPercentage < 25) return 'Just Started';
  if (completionPercentage < 50) return 'In Progress';
  if (completionPercentage < 75) return 'Halfway There';
  if (completionPercentage < 100) return 'Almost Complete';
  return 'Complete';
}
