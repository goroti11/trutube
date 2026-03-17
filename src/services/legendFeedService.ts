import { supabase } from '../lib/supabase';

export interface LegendFeedItem {
  entity_type: string;
  entity_id: string;
  legend_level: number;
  legend_score: number;
  boost_factor: number;
  is_legend_promoted: boolean;
  video_title: string;
  video_thumbnail: string;
  creator_name: string;
  view_count: number;
  like_count: number;
  created_at: string;
}

export interface LegendEligibilityCheck {
  eligible: boolean;
  legend_level: number;
  legend_score: number;
  boost_factor: number;
  reasons: string[];
  scores: {
    watch_score: number;
    engagement_score: number;
    economic_score: number;
    legend_score: number;
    level: number;
  };
  conditions: {
    score_threshold_met: boolean;
    no_risk_flag: boolean;
    minimum_votes_met: boolean;
    no_sanctions: boolean;
    watch_score_ok: boolean;
    not_expired: boolean;
  };
}

export interface LegendPromotionResult {
  success: boolean;
  legend_level?: number;
  legend_score?: number;
  boost_factor?: number;
  expires_at?: string;
  error?: string;
  reasons?: string[];
}

export const legendFeedService = {
  async getLegendFeedRecommendations(
    userId: string,
    region?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<LegendFeedItem[]> {
    try {
      const { data, error } = await supabase.rpc('get_legend_feed_recommendations', {
        p_user_id: userId,
        p_region: region || null,
        p_limit: limit,
        p_offset: offset
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching Legend feed:', error);
      return [];
    }
  },

  async checkPromotionEligibility(
    entityType: string,
    entityId: string
  ): Promise<LegendEligibilityCheck | null> {
    try {
      const { data, error } = await supabase.rpc('check_legend_promotion_eligibility', {
        p_entity_type: entityType,
        p_entity_id: entityId
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error checking Legend eligibility:', error);
      return null;
    }
  },

  async autoPromoteLegendContent(
    entityType: string,
    entityId: string
  ): Promise<LegendPromotionResult> {
    try {
      const { data, error } = await supabase.rpc('auto_promote_legend_content', {
        p_entity_type: entityType,
        p_entity_id: entityId
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error auto-promoting Legend content:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  async refreshLegendPromotions(): Promise<{
    success: boolean;
    expired_count: number;
    refreshed_count: number;
    newly_promoted_count: number;
    timestamp: string;
  }> {
    try {
      const { data, error } = await supabase.rpc('refresh_legend_feed_promotions');

      if (error) throw error;
      return data || {
        success: false,
        expired_count: 0,
        refreshed_count: 0,
        newly_promoted_count: 0,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error refreshing Legend promotions:', error);
      return {
        success: false,
        expired_count: 0,
        refreshed_count: 0,
        newly_promoted_count: 0,
        timestamp: new Date().toISOString()
      };
    }
  },

  async trackLegendImpression(
    entityType: string,
    entityId: string,
    clicked: boolean = false
  ): Promise<void> {
    try {
      const { error } = await supabase.rpc('track_legend_feed_impression', {
        p_entity_type: entityType,
        p_entity_id: entityId,
        p_clicked: clicked
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking Legend impression:', error);
    }
  },

  async getActiveLegendPromotions(limit: number = 50): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('legend_feed_promotions')
        .select('*')
        .eq('is_active', true)
        .order('legend_score', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching active Legend promotions:', error);
      return [];
    }
  },

  async getLegendPromotionStats(entityType: string, entityId: string): Promise<{
    impressions_count: number;
    clicks_count: number;
    ctr: number;
    boost_factor: number;
  } | null> {
    try {
      const { data, error } = await supabase
        .from('legend_feed_promotions')
        .select('impressions_count, clicks_count, ctr, promotion_boost_factor')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .eq('is_active', true)
        .single();

      if (error) throw error;

      return {
        impressions_count: data.impressions_count,
        clicks_count: data.clicks_count,
        ctr: data.ctr,
        boost_factor: data.promotion_boost_factor
      };
    } catch (error) {
      console.error('Error fetching Legend promotion stats:', error);
      return null;
    }
  },

  async getRegionalVoteBreakdown(entityId: string): Promise<Array<{
    region: string;
    total_votes: number;
    weighted_votes: number;
    vote_percentage: number;
  }>> {
    try {
      const { data, error } = await supabase
        .from('legend_regional_votes')
        .select('region, total_votes, weighted_votes, vote_percentage')
        .or(`candidate_id.eq.${entityId},registry_id.eq.${entityId}`)
        .order('weighted_votes', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching regional vote breakdown:', error);
      return [];
    }
  },

  async getTrendingLegendCandidates(limit: number = 10): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('legend_vote_momentum')
        .select(`
          *,
          candidate:legend_candidates(*)
        `)
        .eq('is_trending', true)
        .order('momentum_score', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching trending Legend candidates:', error);
      return [];
    }
  },

  calculateBoostMultiplier(legendLevel: number, freshnessDays: number): number {
    let baseBoost = 1.0;

    switch (legendLevel) {
      case 4:
        baseBoost = 10.0;
        break;
      case 3:
        baseBoost = 7.0;
        break;
      case 2:
        baseBoost = 5.0;
        break;
      case 1:
        baseBoost = 3.0;
        break;
    }

    if (freshnessDays <= 3) {
      return baseBoost * 1.5;
    } else if (freshnessDays <= 7) {
      return baseBoost * 1.2;
    } else if (freshnessDays <= 14) {
      return baseBoost;
    } else {
      return baseBoost * 0.8;
    }
  },

  getLegendLevelColor(level: number): string {
    const colors = {
      1: 'from-yellow-600 to-yellow-400',
      2: 'from-yellow-500 to-orange-400',
      3: 'from-orange-500 to-red-500',
      4: 'from-purple-600 to-pink-500'
    };
    return colors[level as keyof typeof colors] || 'from-gray-600 to-gray-400';
  },

  getLegendLevelName(level: number): string {
    const names = {
      1: 'Legend I',
      2: 'Legend II',
      3: 'Legend III',
      4: 'Legend IV'
    };
    return names[level as keyof typeof names] || 'Unknown';
  }
};
