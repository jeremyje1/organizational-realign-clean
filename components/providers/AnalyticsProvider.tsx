'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { ConsentStatus } from '@/lib/analytics';

interface AnalyticsContextType {
  trackEvent: (event: string, properties?: Record<string, any>) => void;
  trackPageView: (page: string) => void;
  identify: (userId: string, traits?: Record<string, any>) => void;
  consentStatus: ConsentStatus;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

interface AnalyticsProviderProps {
  children: ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const trackEvent = (event: string, properties?: Record<string, any>) => {
    // Implement your analytics tracking here
    if (typeof window !== 'undefined') {
      console.log('Analytics Event:', event, properties);
    }
  };

  const trackPageView = (page: string) => {
    // Implement page view tracking here
    if (typeof window !== 'undefined') {
      console.log('Analytics Page View:', page);
    }
  };

  const identify = (userId: string, traits?: Record<string, any>) => {
    // Implement user identification here
    if (typeof window !== 'undefined') {
      console.log('Analytics Identify:', userId, traits);
    }
  };

  const value = {
    trackEvent,
    trackPageView,
    identify,
    consentStatus: ConsentStatus.GRANTED,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}