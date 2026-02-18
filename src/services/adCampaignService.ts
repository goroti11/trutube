import { supabase } from '../lib/supabase';

export interface AdCampaign {
  id: string;
  creator_id: string;
  campaign_name: string;
  campaign_type: 'video_promotion' | 'channel_promotion' | 'universe_promotion';
  target_video_id?: string;
  budget_total: number;
  budget_spent: number;
  daily_budget: number;
  cost_per_click: number;
  cost_per_impression: number;
  target_audience: Record<string, any>;
  target_universes?: string[];
  start_date: string;
  end_date?: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  total_impressions: number;
  total_clicks: number;
  total_conversions: number;
  click_through_rate: number;
  conversion_rate: number;
  created_at: string;
  updated_at: string;
}

export interface AdImpression {
  id: string;
  campaign_id?: string;
  ad_type: 'google_adsense' | 'creator_campaign' | 'sponsored';
  ad_unit_id: string;
  viewer_id?: string;
  page_location: string;
  impression_time: string;
  clicked: boolean;
  click_time?: string;
  converted: boolean;
  conversion_time?: string;
  conversion_type?: 'view' | 'subscribe' | 'tip' | 'purchase';
  revenue_generated: number;
}

export interface PremiumSubscription {
  id: string;
  user_id: string;
  tier: 'basic' | 'pro' | 'elite';
  price: number;
  status: 'active' | 'cancelled' | 'expired' | 'paused';
  started_at: string;
  expires_at: string;
  auto_renew: boolean;
}

export interface CampaignStats {
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  conversionRate: number;
  avgCostPerClick: number;
  totalSpent: number;
  remainingBudget: number;
}

class AdCampaignService {
  async createCampaign(campaign: Partial<AdCampaign>): Promise<AdCampaign | null> {
    try {
      const { data, error } = await supabase
        .from('ad_campaigns')
        .insert({
          creator_id: campaign.creator_id,
          campaign_name: campaign.campaign_name,
          campaign_type: campaign.campaign_type || 'video_promotion',
          target_video_id: campaign.target_video_id,
          budget_total: campaign.budget_total || 100,
          daily_budget: campaign.daily_budget || 10,
          cost_per_click: campaign.cost_per_click || 0.50,
          cost_per_impression: campaign.cost_per_impression || 0.01,
          target_audience: campaign.target_audience || {},
          target_universes: campaign.target_universes || [],
          start_date: campaign.start_date || new Date().toISOString(),
          end_date: campaign.end_date,
          status: campaign.status || 'draft'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating campaign:', error);
      return null;
    }
  }

  async getCampaignsByCreator(creatorId: string): Promise<AdCampaign[]> {
    try {
      const { data, error } = await supabase
        .from('ad_campaigns')
        .select('*')
        .eq('creator_id', creatorId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    }
  }

  async getCampaign(campaignId: string): Promise<AdCampaign | null> {
    try {
      const { data, error } = await supabase
        .from('ad_campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching campaign:', error);
      return null;
    }
  }

  async updateCampaign(
    campaignId: string,
    updates: Partial<AdCampaign>
  ): Promise<AdCampaign | null> {
    try {
      const { data, error } = await supabase
        .from('ad_campaigns')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', campaignId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating campaign:', error);
      return null;
    }
  }

  async pauseCampaign(campaignId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('ad_campaigns')
        .update({ status: 'paused', updated_at: new Date().toISOString() })
        .eq('id', campaignId);

      return !error;
    } catch (error) {
      console.error('Error pausing campaign:', error);
      return false;
    }
  }

  async resumeCampaign(campaignId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('ad_campaigns')
        .update({ status: 'active', updated_at: new Date().toISOString() })
        .eq('id', campaignId);

      return !error;
    } catch (error) {
      console.error('Error resuming campaign:', error);
      return false;
    }
  }

  async deleteCampaign(campaignId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('ad_campaigns')
        .delete()
        .eq('id', campaignId);

      return !error;
    } catch (error) {
      console.error('Error deleting campaign:', error);
      return false;
    }
  }

  async getCampaignStats(campaignId: string): Promise<CampaignStats | null> {
    try {
      const campaign = await this.getCampaign(campaignId);
      if (!campaign) return null;

      return {
        impressions: campaign.total_impressions,
        clicks: campaign.total_clicks,
        conversions: campaign.total_conversions,
        ctr: campaign.click_through_rate,
        conversionRate: campaign.conversion_rate,
        avgCostPerClick: campaign.cost_per_click,
        totalSpent: campaign.budget_spent,
        remainingBudget: campaign.budget_total - campaign.budget_spent
      };
    } catch (error) {
      console.error('Error fetching campaign stats:', error);
      return null;
    }
  }

  async getImpressionsByCampaign(campaignId: string): Promise<AdImpression[]> {
    try {
      const { data, error } = await supabase
        .from('ad_impressions')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('impression_time', { ascending: false })
        .limit(1000);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching impressions:', error);
      return [];
    }
  }

  async recordImpression(
    campaignId: string | null,
    adType: 'google_adsense' | 'creator_campaign' | 'sponsored',
    adUnitId: string,
    viewerId: string | null,
    pageLocation: string
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase.rpc('record_ad_impression', {
        p_campaign_id: campaignId,
        p_ad_type: adType,
        p_ad_unit_id: adUnitId,
        p_viewer_id: viewerId,
        p_page_location: pageLocation
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error recording impression:', error);
      return null;
    }
  }

  async recordClick(impressionId: string): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('record_ad_click', {
        p_impression_id: impressionId
      });

      return !error;
    } catch (error) {
      console.error('Error recording click:', error);
      return false;
    }
  }

  async checkPremiumStatus(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('check_user_premium', {
        p_user_id: userId
      });

      if (error) throw error;
      return data || false;
    } catch (error) {
      console.error('Error checking premium status:', error);
      return false;
    }
  }

  async getPremiumSubscription(userId: string): Promise<PremiumSubscription | null> {
    try {
      const { data, error } = await supabase
        .from('premium_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching premium subscription:', error);
      return null;
    }
  }

  async createPremiumSubscription(
    userId: string,
    tier: 'basic' | 'pro' | 'elite' = 'basic',
    durationDays: number = 30
  ): Promise<PremiumSubscription | null> {
    try {
      const prices = { basic: 9.99, pro: 19.99, elite: 49.99 };
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + durationDays);

      const { data, error } = await supabase
        .from('premium_subscriptions')
        .insert({
          user_id: userId,
          tier,
          price: prices[tier],
          status: 'active',
          started_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
          auto_renew: true,
          next_billing_date: expiresAt.toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      await supabase.rpc('check_user_premium', { p_user_id: userId });

      return data;
    } catch (error) {
      console.error('Error creating premium subscription:', error);
      return null;
    }
  }

  async cancelPremiumSubscription(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('premium_subscriptions')
        .update({
          status: 'cancelled',
          auto_renew: false,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (!error) {
        await supabase.rpc('check_user_premium', { p_user_id: userId });
      }

      return !error;
    } catch (error) {
      console.error('Error cancelling premium subscription:', error);
      return false;
    }
  }

  async getActiveCampaignsForUniverse(
    universeId: string,
    limit: number = 5
  ): Promise<AdCampaign[]> {
    try {
      const { data, error } = await supabase.rpc('get_active_campaigns_for_universe', {
        p_universe_id: universeId,
        p_limit: limit
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching active campaigns:', error);
      return [];
    }
  }
}

export const adCampaignService = new AdCampaignService();