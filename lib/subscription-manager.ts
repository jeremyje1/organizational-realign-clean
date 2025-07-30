/**
 * Subscription Manager
 * Handles subscription expiration checking and access control
 */

import { createClient } from '@supabase/supabase-js';
import { PricingTier } from './tierConfiguration';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface SubscriptionStatus {
  isValid: boolean;
  status: 'active' | 'expired' | 'cancelled' | 'past_due' | 'unpaid' | 'grace_period';
  expiresAt?: Date;
  lastPaymentDate?: Date;
  daysUntilExpiration?: number;
  gracePeriodDays?: number;
}

export interface AccessControlResult {
  access: 'granted' | 'denied' | 'limited';
  reason?: string;
  upgradeRequired?: boolean;
  subscriptionStatus?: SubscriptionStatus;
}

export class SubscriptionManager {
  
  /**
   * Check if user has valid subscription access
   */
  static async checkSubscriptionAccess(
    userId: string, 
    tier: PricingTier
  ): Promise<AccessControlResult> {
    try {
      // One-time tiers don't require subscription checking
      if (tier === 'one-time-diagnostic' || tier === 'comprehensive-package' || tier === 'enterprise-transformation' || tier === 'express-diagnostic') {
        return { access: 'granted' };
      }

      // Get user's subscription status
      const subscriptionStatus = await this.getSubscriptionStatus(userId, tier);

      // Check if subscription is valid
      if (!subscriptionStatus.isValid) {
        return {
          access: 'denied',
          reason: `Subscription ${subscriptionStatus.status}`,
          upgradeRequired: true,
          subscriptionStatus
        };
      }

      // Check if in grace period
      if (subscriptionStatus.status === 'grace_period') {
        return {
          access: 'limited',
          reason: 'Subscription in grace period',
          subscriptionStatus
        };
      }

      return { 
        access: 'granted',
        subscriptionStatus
      };

    } catch (error) {
      console.error('Error checking subscription access:', error);
      return {
        access: 'denied',
        reason: 'Unable to verify subscription'
      };
    }
  }

  /**
   * Get detailed subscription status for a user
   */
  static async getSubscriptionStatus(
    userId: string, 
    tier: PricingTier
  ): Promise<SubscriptionStatus> {
    try {
      // Get the most recent assessment for this user and tier
      const { data: assessment, error } = await supabase
        .from('assessments')
        .select('subscription_expires_at, last_payment_date, subscription_status, created_at')
        .eq('user_id', userId)
        .eq('tier', tier)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !assessment) {
        return { 
          isValid: false, 
          status: 'unpaid' 
        };
      }

      const now = new Date();
      const expiresAt = assessment.subscription_expires_at 
        ? new Date(assessment.subscription_expires_at) 
        : null;
      const lastPaymentDate = assessment.last_payment_date 
        ? new Date(assessment.last_payment_date) 
        : null;

      // Calculate days until expiration
      const daysUntilExpiration = expiresAt 
        ? Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        : null;

      // Define grace period (7 days for monthly subscriptions)
      const gracePeriodDays = tier === 'monthly-subscription' ? 7 : 0;

      // Determine status
      let status: SubscriptionStatus['status'] = assessment.subscription_status || 'unpaid';
      let isValid = false;

      if (expiresAt) {
        if (now <= expiresAt) {
          // Subscription is still valid
          status = 'active';
          isValid = true;
        } else if (daysUntilExpiration !== null && daysUntilExpiration >= -gracePeriodDays) {
          // In grace period
          status = 'grace_period';
          isValid = true;
        } else {
          // Expired beyond grace period
          status = 'expired';
          isValid = false;
        }
      }

      return {
        isValid,
        status,
        expiresAt: expiresAt || undefined,
        lastPaymentDate: lastPaymentDate || undefined,
        daysUntilExpiration: daysUntilExpiration || undefined,
        gracePeriodDays
      };

    } catch (error) {
      console.error('Error getting subscription status:', error);
      return { 
        isValid: false, 
        status: 'unpaid' 
      };
    }
  }

  /**
   * Update subscription expiration after successful payment
   */
  static async updateSubscriptionExpiration(
    userId: string,
    tier: PricingTier,
    paymentData: {
      stripeSessionId?: string;
      subscriptionId?: string;
      nextBillingDate?: Date;
    }
  ): Promise<boolean> {
    try {
      // Calculate expiration date based on tier
      let expirationDate: Date;
      const now = new Date();

      switch (tier) {
        case 'monthly-subscription':
          // Monthly subscription: 30 days from now
          expirationDate = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
          break;
        case 'comprehensive-package':
          // Comprehensive: 30 days access as stated in pricing
          expirationDate = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
          break;
        case 'enterprise-transformation':
          // Enterprise: 1 year access
          expirationDate = new Date(now.getTime() + (365 * 24 * 60 * 60 * 1000));
          break;
        default:
          // One-time diagnostic: no expiration
          return true;
      }

      // Use provided next billing date if available (from Stripe)
      if (paymentData.nextBillingDate) {
        expirationDate = paymentData.nextBillingDate;
      }

      // Update the assessment record
      const { error } = await supabase
        .from('assessments')
        .update({
          subscription_expires_at: expirationDate.toISOString(),
          last_payment_date: now.toISOString(),
          subscription_status: 'active'
        })
        .eq('user_id', userId)
        .eq('tier', tier);

      if (error) {
        console.error('Error updating subscription expiration:', error);
        return false;
      }

      console.log(`Subscription updated for user ${userId}, tier ${tier}, expires: ${expirationDate}`);
      return true;

    } catch (error) {
      console.error('Error in updateSubscriptionExpiration:', error);
      return false;
    }
  }

  /**
   * Mark subscription as cancelled
   */
  static async cancelSubscription(
    userId: string,
    tier: PricingTier
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('assessments')
        .update({
          subscription_status: 'cancelled'
        })
        .eq('user_id', userId)
        .eq('tier', tier);

      if (error) {
        console.error('Error cancelling subscription:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in cancelSubscription:', error);
      return false;
    }
  }

  /**
   * Get expiring subscriptions (for notification purposes)
   */
  static async getExpiringSubscriptions(daysAhead: number = 7): Promise<any[]> {
    try {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + daysAhead);

      const { data, error } = await supabase
        .from('assessments')
        .select('user_id, tier, subscription_expires_at, contact_email, contact_name')
        .gte('subscription_expires_at', new Date().toISOString())
        .lte('subscription_expires_at', futureDate.toISOString())
        .eq('subscription_status', 'active')
        .in('tier', ['monthly-subscription', 'comprehensive-package', 'enterprise-transformation']);

      if (error) {
        console.error('Error getting expiring subscriptions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getExpiringSubscriptions:', error);
      return [];
    }
  }

  /**
   * Check if assessment creation is allowed for user's tier and subscription
   */
  static async canCreateAssessment(
    userId: string,
    tier: PricingTier
  ): Promise<{ allowed: boolean; reason?: string }> {
    // Check subscription access first
    const accessResult = await this.checkSubscriptionAccess(userId, tier);
    
    if (accessResult.access === 'denied') {
      return {
        allowed: false,
        reason: accessResult.reason || 'Subscription expired'
      };
    }

    // Check tier-specific limits (you might want to add usage tracking here)
    if (tier === 'one-time-diagnostic') {
      // Check if they already have an assessment
      const { count } = await supabase
        .from('assessments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('tier', tier);

      if (count && count >= 1) {
        return {
          allowed: false,
          reason: 'One-time diagnostic limit reached (1 assessment)'
        };
      }
    }

    return { allowed: true };
  }
}

export default SubscriptionManager;
