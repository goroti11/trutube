import { supabase } from '../lib/supabase';

export interface AffiliateLink {
  id: string;
  creator_id: string;
  title: string;
  description: string | null;
  affiliate_url: string;
  platform: string;
  category: string | null;
  thumbnail_url: string | null;
  commission_rate: number;
  total_clicks: number;
  total_conversions: number;
  total_revenue: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AffiliateClick {
  id: string;
  affiliate_link_id: string;
  user_id: string | null;
  video_id: string | null;
  clicked_at: string;
}

export interface AffiliateConversion {
  id: string;
  affiliate_link_id: string;
  click_id: string | null;
  order_id: string | null;
  commission_amount: number;
  currency: string;
  status: string;
  converted_at: string;
  paid_at: string | null;
}

export const affiliationService = {
  async getCreatorAffiliateLinks(creatorId: string): Promise<AffiliateLink[]> {
    const { data, error } = await supabase
      .from('affiliate_links')
      .select('*')
      .eq('creator_id', creatorId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching affiliate links:', error);
      return [];
    }

    return data as AffiliateLink[];
  },

  async createAffiliateLink(linkData: {
    creator_id: string;
    title: string;
    description?: string;
    affiliate_url: string;
    platform: string;
    category?: string;
    thumbnail_url?: string;
    commission_rate?: number;
  }): Promise<AffiliateLink | null> {
    const { data, error } = await supabase
      .from('affiliate_links')
      .insert([linkData])
      .select()
      .single();

    if (error) {
      console.error('Error creating affiliate link:', error);
      return null;
    }

    return data as AffiliateLink;
  },

  async updateAffiliateLink(
    linkId: string,
    updates: Partial<AffiliateLink>
  ): Promise<AffiliateLink | null> {
    const { data, error } = await supabase
      .from('affiliate_links')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', linkId)
      .select()
      .single();

    if (error) {
      console.error('Error updating affiliate link:', error);
      return null;
    }

    return data as AffiliateLink;
  },

  async deleteAffiliateLink(linkId: string): Promise<boolean> {
    const { error } = await supabase
      .from('affiliate_links')
      .delete()
      .eq('id', linkId);

    if (error) {
      console.error('Error deleting affiliate link:', error);
      return false;
    }

    return true;
  },

  async trackAffiliateClick(
    linkId: string,
    userId?: string,
    videoId?: string
  ): Promise<AffiliateClick | null> {
    const { data, error } = await supabase
      .from('affiliate_clicks')
      .insert([
        {
          affiliate_link_id: linkId,
          user_id: userId || null,
          video_id: videoId || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error tracking affiliate click:', error);
      return null;
    }

    return data as AffiliateClick;
  },

  async recordConversion(conversionData: {
    affiliate_link_id: string;
    click_id?: string;
    order_id?: string;
    commission_amount: number;
    currency?: string;
  }): Promise<AffiliateConversion | null> {
    const { data, error } = await supabase
      .from('affiliate_conversions')
      .insert([conversionData])
      .select()
      .single();

    if (error) {
      console.error('Error recording conversion:', error);
      return null;
    }

    return data as AffiliateConversion;
  },

  async getAffiliateStats(creatorId: string, period: 'day' | 'week' | 'month' | 'year' = 'month') {
    const { data: links } = await supabase
      .from('affiliate_links')
      .select('*')
      .eq('creator_id', creatorId);

    if (!links || links.length === 0) {
      return {
        totalClicks: 0,
        totalConversions: 0,
        totalRevenue: 0,
        conversionRate: 0,
        topPerformingLinks: [],
      };
    }

    const totalClicks = links.reduce((sum, link) => sum + link.total_clicks, 0);
    const totalConversions = links.reduce((sum, link) => sum + link.total_conversions, 0);
    const totalRevenue = links.reduce((sum, link) => sum + link.total_revenue, 0);
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

    const topPerformingLinks = [...links]
      .sort((a, b) => b.total_revenue - a.total_revenue)
      .slice(0, 5);

    return {
      totalClicks,
      totalConversions,
      totalRevenue,
      conversionRate,
      topPerformingLinks,
    };
  },

  async getVideoAffiliateLinks(videoId: string): Promise<AffiliateLink[]> {
    const { data: clicks } = await supabase
      .from('affiliate_clicks')
      .select('affiliate_link_id')
      .eq('video_id', videoId)
      .order('clicked_at', { ascending: false })
      .limit(10);

    if (!clicks || clicks.length === 0) return [];

    const linkIds = [...new Set(clicks.map((c) => c.affiliate_link_id))];

    const { data: links, error } = await supabase
      .from('affiliate_links')
      .select('*')
      .in('id', linkIds)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching video affiliate links:', error);
      return [];
    }

    return links as AffiliateLink[];
  },
};
