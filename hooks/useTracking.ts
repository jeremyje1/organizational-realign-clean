'use client';

import { useEffect } from 'react';
import { 
  trackEvent, 
  trackButtonClick, 
  trackFormSubmission, 
  trackFunnelStage,
  trackContentEngagement,
  EventCategory,
  UserAction,
  ConversionFunnel,
  EventParams,
} from '@/lib/analytics';
import { useAnalytics } from '@/components/providers/AnalyticsProvider';
import { ConsentStatus } from '@/lib/analytics';

/**
 * Hook that provides analytics tracking functions
 * Only tracks events if user has granted consent
 */
export function useTracking() {
  const { consentStatus } = useAnalytics();
  const hasConsent = consentStatus === ConsentStatus.GRANTED;

  // Track page engagement metrics
  useEffect(() => {
    if (!hasConsent) return;
    
    let scrollDepth = 0;
    let timeOnPage = 0;
    let intervalId: NodeJS.Timeout;
    let hasStartedReading = false;
    
    // Track time spent on page
    intervalId = setInterval(() => {
      timeOnPage += 5;
      
      // After 30 seconds, consider user engaged
      if (timeOnPage === 30 && hasStartedReading) {
        trackEvent(EventCategory.ENGAGEMENT, 'engaged', { time_on_page: timeOnPage });
      }
      
      // After 2 minutes, track deeper engagement
      if (timeOnPage === 120 && hasStartedReading) {
        trackEvent(EventCategory.ENGAGEMENT, 'deep_engagement', { time_on_page: timeOnPage });
      }
    }, 5000);
    
    // Track scroll depth
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const viewportHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      const percentScrolled = Math.round((scrolled / (fullHeight - viewportHeight)) * 100);
      
      if (!hasStartedReading && percentScrolled > 10) {
        hasStartedReading = true;
        trackEvent(EventCategory.ENGAGEMENT, 'started_reading');
      }
      
      if (percentScrolled > scrollDepth) {
        scrollDepth = percentScrolled;
        
        // Track scroll milestones
        if (scrollDepth >= 25 && scrollDepth < 50) {
          trackEvent(EventCategory.ENGAGEMENT, 'scroll_depth', { depth: 25 });
        } else if (scrollDepth >= 50 && scrollDepth < 75) {
          trackEvent(EventCategory.ENGAGEMENT, 'scroll_depth', { depth: 50 });
        } else if (scrollDepth >= 75 && scrollDepth < 90) {
          trackEvent(EventCategory.ENGAGEMENT, 'scroll_depth', { depth: 75 });
        } else if (scrollDepth >= 90) {
          trackEvent(EventCategory.ENGAGEMENT, 'scroll_depth', { depth: 100 });
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('scroll', handleScroll);
      
      // Track exit time
      if (timeOnPage > 5) {
        trackEvent(EventCategory.ENGAGEMENT, 'exit', { time_on_page: timeOnPage });
      }
    };
  }, [hasConsent]);

  // Wrapper functions to ensure consent before tracking
  const trackCustomEvent = (category: EventCategory | string, action: UserAction | string, params?: EventParams) => {
    if (hasConsent) {
      trackEvent(category, action, params);
    }
  };

  const trackCTA = (buttonName: string, buttonLocation: string, params?: EventParams) => {
    if (hasConsent) {
      trackButtonClick(buttonName, buttonLocation, params);
    }
  };

  const trackForm = (formName: string, success: boolean, params?: EventParams) => {
    if (hasConsent) {
      trackFormSubmission(formName, success, params);
    }
  };

  const trackFunnel = (funnel: ConversionFunnel | string, stage: string, params?: EventParams) => {
    if (hasConsent) {
      trackFunnelStage(funnel, stage, params);
    }
  };

  const trackContent = (contentType: string, contentName: string, action: UserAction, params?: EventParams) => {
    if (hasConsent) {
      trackContentEngagement(contentType, contentName, action, params);
    }
  };

  // Function to track assessment funnel
  const trackAssessmentFunnel = (stage: 'view' | 'start' | 'question_answered' | 'halfway' | 'complete', params?: EventParams) => {
    trackFunnel(ConversionFunnel.ASSESSMENT_FUNNEL, stage, params);
  };

  // Function to track signup funnel
  const trackSignupFunnel = (stage: 'view' | 'start' | 'email_entered' | 'complete', params?: EventParams) => {
    trackFunnel(ConversionFunnel.SIGNUP_FUNNEL, stage, params);
  };

  // Function to track checkout funnel
  const trackCheckoutFunnel = (stage: 'view' | 'start' | 'add_payment' | 'complete', params?: EventParams) => {
    trackFunnel(ConversionFunnel.CHECKOUT_FUNNEL, stage, params);
  };

  return {
    trackEvent: trackCustomEvent,
    trackCTA,
    trackForm,
    trackFunnel,
    trackContent,
    trackAssessmentFunnel,
    trackSignupFunnel,
    trackCheckoutFunnel,
    hasConsent,
  };
}
