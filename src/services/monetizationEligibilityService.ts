import { supabase } from '../lib/supabase';

export interface MonetizationEligibility {
  eligible: boolean;
  checks: {
    kyc_completed: boolean;
    authenticity_score_ok: boolean;
    audience_threshold_met: boolean;
    minimum_videos_ok: boolean;
    account_age_ok: boolean;
    no_violations: boolean;
    payment_method_ok: boolean;
  };
  stats: {
    authenticity_score: number;
    subscribers: number;
    watch_hours: number;
    shorts_views: number;
    videos: number;
    account_age_days: number;
    violations: number;
  };
  missing_conditions: string[];
}

export interface CreatorTier {
  id: string;
  name: string;
  level: number;
  min_subscribers: number;
  min_authenticity_score: number;
  min_revenue: number;
  benefits: string[];
  revenue_share_boost: number;
  description: string;
}

export interface MonetizationStatus {
  id: string;
  user_id: string;
  monetization_enabled: boolean;
  tier: CreatorTier | null;
  authenticity_score: number;
  total_subscribers: number;
  watch_hours_12months: number;
  shorts_views_90days: number;
  total_videos: number;
  account_age_days: number;
  violations_count: number;
  kyc_completed: boolean;
  meets_audience_threshold: boolean;
  meets_authenticity_threshold: boolean;
  has_original_content: boolean;
  has_payment_method: boolean;
  monetization_suspended: boolean;
  suspension_reason?: string;
  eligibility_checked_at?: string;
  monetization_activated_at?: string;
}

export interface KYCVerification {
  id: string;
  user_id: string;
  identity_verified: boolean;
  email_verified: boolean;
  phone_verified: boolean;
  age_verified: boolean;
  document_type?: string;
  verification_status: 'pending' | 'in_review' | 'approved' | 'rejected';
  rejection_reason?: string;
  stripe_account_id?: string;
  bank_account_verified: boolean;
}

export interface RevenueSettings {
  setting_type: string;
  creator_share: number;
  platform_share: number;
  description: string;
}

export interface RevenueTransaction {
  id: string;
  transaction_type: 'ad_revenue' | 'subscription' | 'tip' | 'marketplace' | 'collaboration' | 'sponsorship';
  gross_amount: number;
  creator_share_amount: number;
  platform_share_amount: number;
  creator_share_percentage: number;
  platform_share_percentage: number;
  currency: string;
  status: 'pending' | 'validated' | 'paid' | 'disputed' | 'refunded';
  description?: string;
  created_at: string;
  validated_at?: string;
  paid_at?: string;
}

export const monetizationEligibilityService = {
  async checkEligibility(userId: string): Promise<MonetizationEligibility | null> {
    try {
      const { data, error } = await supabase.rpc('check_monetization_eligibility', {
        p_user_id: userId,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error checking monetization eligibility:', error);
      return null;
    }
  },

  async getMonetizationStatus(userId: string): Promise<MonetizationStatus | null> {
    try {
      const { data, error } = await supabase
        .from('creator_monetization_status')
        .select(`
          *,
          tier:creator_tiers(*)
        `)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting monetization status:', error);
      return null;
    }
  },

  async initializeMonetizationStatus(userId: string): Promise<MonetizationStatus | null> {
    try {
      const { data, error } = await supabase
        .from('creator_monetization_status')
        .insert({
          user_id: userId,
          authenticity_score: 85,
          total_subscribers: 1250,
          watch_hours_12months: 4500,
          shorts_views_90days: 500000,
          total_videos: 12,
          account_age_days: 45,
          violations_count: 0,
          kyc_completed: false,
          has_payment_method: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error initializing monetization status:', error);
      return null;
    }
  },

  async getKYCStatus(userId: string): Promise<KYCVerification | null> {
    try {
      const { data, error } = await supabase
        .from('kyc_verifications')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting KYC status:', error);
      return null;
    }
  },

  async initializeKYC(userId: string): Promise<KYCVerification | null> {
    try {
      const { data, error } = await supabase
        .from('kyc_verifications')
        .insert({
          user_id: userId,
          email_verified: true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error initializing KYC:', error);
      return null;
    }
  },

  async getCreatorTiers(): Promise<CreatorTier[]> {
    try {
      const { data, error } = await supabase
        .from('creator_tiers')
        .select('*')
        .order('level', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting creator tiers:', error);
      return [];
    }
  },

  async getRevenueSettings(): Promise<RevenueSettings[]> {
    try {
      const { data, error } = await supabase
        .from('monetization_settings')
        .select('*')
        .eq('active', true);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting revenue settings:', error);
      return [];
    }
  },

  async getRevenueTransactions(userId: string, limit = 50): Promise<RevenueTransaction[]> {
    try {
      const { data, error } = await supabase
        .from('revenue_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting revenue transactions:', error);
      return [];
    }
  },

  async getRevenueByType(userId: string): Promise<Record<string, number>> {
    try {
      const { data, error } = await supabase
        .from('revenue_transactions')
        .select('transaction_type, creator_share_amount')
        .eq('user_id', userId)
        .in('status', ['validated', 'paid']);

      if (error) throw error;

      const revenueByType: Record<string, number> = {};
      data?.forEach((transaction) => {
        const type = transaction.transaction_type;
        revenueByType[type] = (revenueByType[type] || 0) + transaction.creator_share_amount;
      });

      return revenueByType;
    } catch (error) {
      console.error('Error getting revenue by type:', error);
      return {};
    }
  },

  async getTotalRevenue(userId: string, status?: string[]): Promise<number> {
    try {
      let query = supabase
        .from('revenue_transactions')
        .select('creator_share_amount')
        .eq('user_id', userId);

      if (status) {
        query = query.in('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data?.reduce((sum, t) => sum + t.creator_share_amount, 0) || 0;
    } catch (error) {
      console.error('Error getting total revenue:', error);
      return 0;
    }
  },

  async createMockTransactions(userId: string): Promise<void> {
    const transactions = [
      {
        user_id: userId,
        transaction_type: 'ad_revenue',
        gross_amount: 150.50,
        creator_share_amount: 97.83,
        platform_share_amount: 52.67,
        creator_share_percentage: 65,
        platform_share_percentage: 35,
        status: 'validated',
        description: 'Revenus publicitaires - Janvier 2026',
      },
      {
        user_id: userId,
        transaction_type: 'subscription',
        gross_amount: 500.00,
        creator_share_amount: 400.00,
        platform_share_amount: 100.00,
        creator_share_percentage: 80,
        platform_share_percentage: 20,
        status: 'validated',
        description: 'Abonnements mensuels',
      },
      {
        user_id: userId,
        transaction_type: 'tip',
        gross_amount: 250.00,
        creator_share_amount: 237.50,
        platform_share_amount: 12.50,
        creator_share_percentage: 95,
        platform_share_percentage: 5,
        status: 'paid',
        description: 'Tips des spectateurs',
      },
      {
        user_id: userId,
        transaction_type: 'marketplace',
        gross_amount: 450.00,
        creator_share_amount: 382.50,
        platform_share_amount: 67.50,
        creator_share_percentage: 85,
        platform_share_percentage: 15,
        status: 'validated',
        description: 'Services marketplace',
      },
    ];

    try {
      const { error } = await supabase
        .from('revenue_transactions')
        .insert(transactions);

      if (error) throw error;
    } catch (error) {
      console.error('Error creating mock transactions:', error);
    }
  },
};
