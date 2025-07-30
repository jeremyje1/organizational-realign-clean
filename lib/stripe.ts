// lib/stripe.ts
import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

// Client-side Stripe instance
export const getStripe = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
};

// Assessment pricing tiers
export const ASSESSMENT_PRODUCTS = {
  BASIC: {
    name: 'Basic Assessment',
    description: 'Essential assessment for small teams and departments',
    price: 199900, // $1,999 in cents
    features: [
      'Up to 25 team members',
      'Basic AI analysis',
      'PDF report',
      'Email support'
    ]
  },
  TEAM: {
    name: 'Team Assessment',
    description: 'Comprehensive assessment for medium to large teams',
    price: 399900, // $3,999 in cents
    features: [
      'Unlimited team members',
      'Advanced AI analysis',
      'Custom PDF report',
      'Priority support',
      'Team collaboration features'
    ]
  },
  ENTERPRISE: {
    name: 'Enterprise Assessment',
    description: 'Full organizational transformation package',
    price: 899900, // $8,999 in cents
    features: [
      'Unlimited teams & departments',
      'Premium AI analysis',
      'Consulting session included',
      'Implementation support',
      'Dedicated success manager',
      'Custom integration options'
    ]
  }
} as const;

export type AssessmentTier = keyof typeof ASSESSMENT_PRODUCTS;
