import { supabase } from '../lib/supabase';

export interface CreatorSupport {
  id: string;
  supporter_id: string;
  creator_id: string;
  amount: number;
  currency: string;
  support_type: 'tip' | 'membership' | 'superchat' | 'donation';
  message: string;
  is_public: boolean;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: string;
  created_at: string;
  supporter?: {
    username: string;
    display_name: string;
    avatar_url: string;
  };
}

export interface CreatorMembership {
  id: string;
  user_id: string;
  creator_id: string;
  tier: 'basic' | 'premium' | 'vip';
  amount: number;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  auto_renew: boolean;
  created_at: string;
}

export interface SupportLeaderboard {
  id: string;
  creator_id: string;
  supporter_id: string;
  total_amount: number;
  support_count: number;
  last_support_at: string;
  is_visible: boolean;
  supporter?: {
    username: string;
    display_name: string;
    avatar_url: string;
  };
}

export interface MembershipTier {
  tier: 'basic' | 'premium' | 'vip';
  name: string;
  amount: number;
  benefits: string[];
}

class CreatorSupportService {
  async createSupport(
    supporterId: string,
    creatorId: string,
    amount: number,
    supportType: CreatorSupport['support_type'],
    message: string = '',
    isPublic: boolean = true
  ): Promise<CreatorSupport | null> {
    try {
      const { data, error } = await supabase
        .from('creator_support')
        .insert({
          supporter_id: supporterId,
          creator_id: creatorId,
          amount,
          support_type: supportType,
          message,
          is_public: isPublic,
          status: 'completed',
          currency: 'USD',
          payment_method: 'stripe'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating support:', error);
      return null;
    }
  }

  async getCreatorSupports(
    creatorId: string,
    limit: number = 50
  ): Promise<CreatorSupport[]> {
    try {
      const { data, error } = await supabase
        .from('creator_support')
        .select(`
          *,
          supporter:supporter_id (
            username,
            display_name,
            avatar_url
          )
        `)
        .eq('creator_id', creatorId)
        .eq('is_public', true)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching creator supports:', error);
      return [];
    }
  }

  async getUserSupports(userId: string): Promise<CreatorSupport[]> {
    try {
      const { data, error } = await supabase
        .from('creator_support')
        .select('*')
        .eq('supporter_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user supports:', error);
      return [];
    }
  }

  async getTotalSupportReceived(creatorId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('creator_support')
        .select('amount')
        .eq('creator_id', creatorId)
        .eq('status', 'completed');

      if (error) throw error;

      const total = data?.reduce((sum, support) => sum + parseFloat(support.amount.toString()), 0) || 0;
      return total;
    } catch (error) {
      console.error('Error calculating total support:', error);
      return 0;
    }
  }

  async createMembership(
    userId: string,
    creatorId: string,
    tier: CreatorMembership['tier'],
    amount: number,
    duration: number = 30
  ): Promise<CreatorMembership | null> {
    try {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + duration);

      const { data, error } = await supabase
        .from('creator_memberships')
        .insert({
          user_id: userId,
          creator_id: creatorId,
          tier,
          amount,
          end_date: endDate.toISOString(),
          is_active: true,
          auto_renew: true
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating membership:', error);
      return null;
    }
  }

  async getUserMembership(
    userId: string,
    creatorId: string
  ): Promise<CreatorMembership | null> {
    try {
      const { data, error } = await supabase
        .from('creator_memberships')
        .select('*')
        .eq('user_id', userId)
        .eq('creator_id', creatorId)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching membership:', error);
      return null;
    }
  }

  async getCreatorMemberships(creatorId: string): Promise<CreatorMembership[]> {
    try {
      const { data, error } = await supabase
        .from('creator_memberships')
        .select('*')
        .eq('creator_id', creatorId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching creator memberships:', error);
      return [];
    }
  }

  async cancelMembership(membershipId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('creator_memberships')
        .update({ auto_renew: false })
        .eq('id', membershipId);

      return !error;
    } catch (error) {
      console.error('Error canceling membership:', error);
      return false;
    }
  }

  async getSupportLeaderboard(
    creatorId: string,
    limit: number = 10
  ): Promise<SupportLeaderboard[]> {
    try {
      const { data, error } = await supabase
        .from('support_leaderboard')
        .select(`
          *,
          supporter:supporter_id (
            username,
            display_name,
            avatar_url
          )
        `)
        .eq('creator_id', creatorId)
        .eq('is_visible', true)
        .order('total_amount', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
  }

  async getMembershipTiers(creatorId: string): Promise<MembershipTier[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('membership_tiers')
        .eq('id', creatorId)
        .maybeSingle();

      if (error) throw error;
      return data?.membership_tiers || [];
    } catch (error) {
      console.error('Error fetching membership tiers:', error);
      return [];
    }
  }

  async updateMembershipTiers(
    creatorId: string,
    tiers: MembershipTier[]
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ membership_tiers: tiers })
        .eq('id', creatorId);

      return !error;
    } catch (error) {
      console.error('Error updating membership tiers:', error);
      return false;
    }
  }

  async toggleSupportEnabled(
    creatorId: string,
    enabled: boolean
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ support_enabled: enabled })
        .eq('id', creatorId);

      return !error;
    } catch (error) {
      console.error('Error toggling support:', error);
      return false;
    }
  }

  async setMinimumSupportAmount(
    creatorId: string,
    amount: number
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ minimum_support_amount: amount })
        .eq('id', creatorId);

      return !error;
    } catch (error) {
      console.error('Error setting minimum amount:', error);
      return false;
    }
  }

  async getTopSupporter(creatorId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('support_leaderboard')
        .select(`
          supporter:supporter_id (
            id,
            username,
            display_name,
            avatar_url
          ),
          total_amount
        `)
        .eq('creator_id', creatorId)
        .eq('is_visible', true)
        .order('total_amount', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching top supporter:', error);
      return null;
    }
  }

  formatAmount(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }
}

export const creatorSupportService = new CreatorSupportService();
