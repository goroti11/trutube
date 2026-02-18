import { supabase } from '../lib/supabase';

export interface Tip {
  id: string;
  from_user_id: string;
  to_creator_id: string;
  amount: number;
  message: string;
  created_at: string;
}

export interface CreatorRevenue {
  id: string;
  creator_id: string;
  total_revenue: number;
  subscription_revenue: number;
  tips_revenue: number;
  premium_revenue: number;
  live_revenue: number;
  month: string;
  updated_at: string;
}

export const revenueService = {
  async sendTip(
    fromUserId: string,
    toCreatorId: string,
    amount: number,
    message: string
  ): Promise<Tip | null> {
    const { data, error } = await supabase
      .from('tips')
      .insert({
        from_user_id: fromUserId,
        to_creator_id: toCreatorId,
        amount: amount,
        message: message,
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending tip:', error);
      return null;
    }

    await supabase.rpc('update_creator_revenue', {
      p_creator_id: toCreatorId,
      p_amount: amount,
      p_type: 'tips',
    });

    return data;
  },

  async getCreatorRevenue(creatorId: string): Promise<CreatorRevenue | null> {
    const { data, error } = await supabase
      .from('creator_revenue')
      .select('*')
      .eq('creator_id', creatorId)
      .order('month', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching creator revenue:', error);
      return null;
    }

    return data;
  },

  async getRevenueHistory(
    creatorId: string,
    months: number = 6
  ): Promise<CreatorRevenue[]> {
    const { data, error } = await supabase
      .from('creator_revenue')
      .select('*')
      .eq('creator_id', creatorId)
      .order('month', { ascending: false })
      .limit(months);

    if (error) {
      console.error('Error fetching revenue history:', error);
      return [];
    }

    return data;
  },

  async getTipsSent(userId: string): Promise<Tip[]> {
    const { data, error } = await supabase
      .from('tips')
      .select('*')
      .eq('from_user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tips sent:', error);
      return [];
    }

    return data;
  },

  async getTipsReceived(creatorId: string): Promise<Tip[]> {
    const { data, error } = await supabase
      .from('tips')
      .select('*')
      .eq('to_creator_id', creatorId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tips received:', error);
      return [];
    }

    return data;
  },
};
