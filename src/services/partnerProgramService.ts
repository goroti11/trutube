import { supabase } from '../lib/supabase';

export interface PartnerProgramTerms {
  id: string;
  version: string;
  title: string;
  content: string;
  effective_date: string;
  is_current: boolean;
  terms_type: 'partner_program' | 'monetization' | 'privacy';
  created_at: string;
}

export interface PartnerProgramAcceptance {
  id: string;
  user_id: string;
  terms_id: string;
  terms_version: string;
  accepted_at: string;
  ip_address?: string;
}

export interface PaymentThreshold {
  id: string;
  currency: string;
  minimum_withdrawal: number;
  processing_fee: number;
  processing_time_days: number;
  active: boolean;
}

export interface MonetizationSuspension {
  id: string;
  user_id: string;
  suspension_type: 'fraud' | 'violation' | 'copyright' | 'fake_engagement' | 'investigation';
  reason: string;
  suspended_at: string;
  is_active: boolean;
  appeal_submitted: boolean;
  appeal_text?: string;
  appeal_decision?: 'pending' | 'approved' | 'rejected';
  lifted_at?: string;
}

export interface RevenueHold {
  id: string;
  user_id: string;
  amount_held: number;
  currency: string;
  reason: string;
  held_at: string;
  is_active: boolean;
  released_at?: string;
  released_amount?: number;
  forfeited_amount?: number;
}

export const partnerProgramService = {
  async getCurrentTerms(): Promise<PartnerProgramTerms | null> {
    try {
      const { data, error } = await supabase
        .from('partner_program_terms')
        .select('*')
        .eq('is_current', true)
        .eq('terms_type', 'partner_program')
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting current terms:', error);
      return null;
    }
  },

  async hasAcceptedLatestTerms(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('has_accepted_latest_terms', {
        p_user_id: userId,
      });

      if (error) throw error;
      return data || false;
    } catch (error) {
      console.error('Error checking terms acceptance:', error);
      return false;
    }
  },

  async acceptTerms(userId: string, termsId: string, termsVersion: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('partner_program_acceptances')
        .insert({
          user_id: userId,
          terms_id: termsId,
          terms_version: termsVersion,
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error accepting terms:', error);
      return false;
    }
  },

  async getUserAcceptances(userId: string): Promise<PartnerProgramAcceptance[]> {
    try {
      const { data, error } = await supabase
        .from('partner_program_acceptances')
        .select('*')
        .eq('user_id', userId)
        .order('accepted_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting user acceptances:', error);
      return [];
    }
  },

  async getPaymentThresholds(): Promise<PaymentThreshold[]> {
    try {
      const { data, error } = await supabase
        .from('payment_thresholds')
        .select('*')
        .eq('active', true);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting payment thresholds:', error);
      return [];
    }
  },

  async getAvailableBalance(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase.rpc('get_available_balance', {
        p_user_id: userId,
      });

      if (error) throw error;
      return data || 0;
    } catch (error) {
      console.error('Error getting available balance:', error);
      return 0;
    }
  },

  async getActiveSuspensions(userId: string): Promise<MonetizationSuspension[]> {
    try {
      const { data, error } = await supabase
        .from('monetization_suspensions')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('suspended_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting active suspensions:', error);
      return [];
    }
  },

  async submitAppeal(suspensionId: string, appealText: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('monetization_suspensions')
        .update({
          appeal_submitted: true,
          appeal_text: appealText,
          appeal_submitted_at: new Date().toISOString(),
          appeal_decision: 'pending',
        })
        .eq('id', suspensionId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error submitting appeal:', error);
      return false;
    }
  },

  async getActiveRevenueHolds(userId: string): Promise<RevenueHold[]> {
    try {
      const { data, error } = await supabase
        .from('revenue_holds')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('held_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting revenue holds:', error);
      return [];
    }
  },

  async getAllTermsHistory(): Promise<PartnerProgramTerms[]> {
    try {
      const { data, error } = await supabase
        .from('partner_program_terms')
        .select('*')
        .eq('terms_type', 'partner_program')
        .order('effective_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting terms history:', error);
      return [];
    }
  },
};
