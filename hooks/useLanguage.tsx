/**
 * React Hook for Industry-Specific Language Context
 * 
 * This hook provides access to the current institution type and language
 * translation functions throughout the application.
 * 
 * @module @/hooks/useLanguage
 */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  translateText, 
  translateSectionName, 
  translateUIElement, 
  getIndustryContext, 
  getReportLabels,
  InstitutionType 
} from '@/lib/industryLanguageMapping';

interface LanguageContextType {
  institutionType: InstitutionType | null;
  setInstitutionType: (type: InstitutionType | null) => void;
  t: (text: string) => string; // Main translation function
  tSection: (sectionName: string) => string; // Section name translation
  tUI: (element: string) => string; // UI element translation
  getContext: () => ReturnType<typeof getIndustryContext> | null;
  getLabels: () => Record<string, string>;
  isLanguageCustomized: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  initialInstitutionType?: InstitutionType | null;
}

export function LanguageProvider({ children, initialInstitutionType }: LanguageProviderProps) {
  const [institutionType, setInstitutionTypeState] = useState<InstitutionType | null>(initialInstitutionType || null);

  // Load institution type from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('institutionType');
      if (saved) {
        setInstitutionTypeState(saved as InstitutionType);
      } else if (!initialInstitutionType) {
        // Only set default if no saved value and no initial value
        setInstitutionTypeState('community-college');
      }
    }
  }, [initialInstitutionType]);

  // Save institution type to localStorage when it changes
  const setInstitutionType = (type: InstitutionType | null) => {
    setInstitutionTypeState(type);
    if (typeof window !== 'undefined') {
      if (type) {
        localStorage.setItem('institutionType', type);
      } else {
        localStorage.removeItem('institutionType');
      }
    }
  };

  // Main translation function
  const t = (text: string): string => {
    const currentType = institutionType || 'community-college';
    if (!text) return text;
    return translateText(text, currentType);
  };

  // Section name translation
  const tSection = (sectionName: string): string => {
    const currentType = institutionType || 'community-college';
    if (!sectionName) return sectionName;
    return translateSectionName(sectionName, currentType);
  };

  // UI element translation
  const tUI = (element: string): string => {
    const currentType = institutionType || 'community-college';
    if (!element) return element;
    return translateUIElement(element, currentType);
  };

  // Get industry context
  const getContext = () => {
    const currentType = institutionType || 'community-college';
    return getIndustryContext(currentType);
  };

  // Get report labels
  const getLabels = (): Record<string, string> => {
    const currentType = institutionType || 'community-college';
    return getReportLabels(currentType);
  };

  const isLanguageCustomized = institutionType !== null && institutionType !== 'corporate';

  const value: LanguageContextType = {
    institutionType: institutionType || 'community-college',
    setInstitutionType,
    t,
    tSection,
    tUI,
    getContext,
    getLabels,
    isLanguageCustomized
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

/**
 * Hook for components that need language-aware text rendering
 */
export function useTranslatedText() {
  const { t, institutionType } = useLanguage();
  
  return {
    translateText: t,
    institutionType,
    isCustomized: institutionType !== null && institutionType !== 'corporate'
  };
}

/**
 * Hook for section headers and navigation
 */
export function useTranslatedSections() {
  const { tSection, institutionType } = useLanguage();
  
  return {
    translateSection: tSection,
    institutionType,
    isCustomized: institutionType !== null && institutionType !== 'corporate'
  };
}

/**
 * Hook for UI elements like buttons, labels, etc.
 */
export function useTranslatedUI() {
  const { tUI, institutionType } = useLanguage();
  
  return {
    translateUI: tUI,
    institutionType,
    isCustomized: institutionType !== null && institutionType !== 'corporate'
  };
}

/**
 * Hook for reports and documents
 */
export function useReportLanguage() {
  const { getLabels, t, institutionType } = useLanguage();
  
  return {
    getReportLabels: getLabels,
    translateText: t,
    institutionType,
    isCustomized: institutionType !== null && institutionType !== 'corporate'
  };
}

/**
 * Higher-order component for wrapping components with language context
 */
export function withLanguage<P extends object>(
  Component: React.ComponentType<P & { language: LanguageContextType }>
) {
  return function WrappedComponent(props: P) {
    const language = useLanguage();
    return <Component {...props} language={language} />;
  };
}

export default useLanguage;
