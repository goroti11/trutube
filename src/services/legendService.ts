import { legendCanonicalService } from './legendCanonicalService';
import { supabase } from '../lib/supabase';

export interface LegendBadge {
  id: string;
  name: string;
  badge_type: 'trending' | 'explosion' | 'impact' | 'premium_hit' | 'top_universe' | 'legend';
  level: number;
  icon: string;
  color: string;
  description: string;
}

export interface VideoLegendAward {
  id: string;
  video_id: string;
  badge_id: string;
  universe_id?: string;
  period: '24h' | '7d' | '30d' | '90d';
  awarded_at: string;
  expires_at?: string;
  metrics_snapshot: Record<string, any>;
  is_active: boolean;
  legend_badges?: LegendBadge;
}

export interface CreatorTruScore {
  id: string;
  user_id: string;
  universe_id?: string;
  tru_score_weekly: number;
  tru_score_global: number;
  rank_weekly_universe?: number;
  rank_weekly_global?: number;
  rank_alltime_universe?: number;
  rank_alltime_global?: number;
  trend: 'up' | 'down' | 'stable';
  performance_factors: {
    engagement?: string;
    growth?: string;
    authenticity?: string;
    weekly_views?: number;
  };
  last_calculated_at: string;
  updated_at: string;
}

export interface LegendRankingHistory {
  id: string;
  user_id: string;
  universe_id?: string;
  ranking_type: 'weekly_universe' | 'weekly_global' | 'alltime';
  rank_position: number;
  tru_score: number;
  period_start: string;
  period_end: string;
  badge_level?: number;
  created_at: string;
}

export interface LegendActiveHolder {
  id: string;
  user_id: string;
  universe_id?: string;
  holder_type: 'universe_legend' | 'global_legend';
  level: number;
  achieved_at: string;
  lost_at?: string;
  is_current: boolean;
  weeks_held: number;
}

class LegendService {
  async getAllBadges() {
    const { data, error } = await supabase
      .from('legend_badges')
      .select('*')
      .order('level', { ascending: true });

    if (error) throw error;
    return data as LegendBadge[];
  }

  async getVideoBadges(videoId: string) {
    const legend = await legendCanonicalService.getLegendByEntity('video', videoId);
    if (!legend) return [];

    const { data, error } = await supabase
      .from('video_legend_awards')
      .select(`
        *,
        legend_badges (*)
      `)
      .eq('video_id', videoId)
      .eq('is_active', true);

    if (error) throw error;
    return data as VideoLegendAward[];
  }

  async getCreatorTruScore(userId: string, universeId?: string) {
    let query = supabase
      .from('creator_tru_scores')
      .select('*')
      .eq('user_id', userId);

    if (universeId) {
      query = query.eq('universe_id', universeId);
    } else {
      query = query.is('universe_id', null);
    }

    const { data, error } = await query.maybeSingle();

    if (error) throw error;
    return data as CreatorTruScore | null;
  }

  async getCreatorAllScores(userId: string) {
    const { data, error } = await supabase
      .from('creator_tru_scores')
      .select('*')
      .eq('user_id', userId)
      .order('tru_score_weekly', { ascending: false });

    if (error) throw error;
    return data as CreatorTruScore[];
  }

  async getCurrentLegendHolders(type?: 'universe_legend' | 'global_legend') {
    return legendCanonicalService.getCurrentHolders(type);
  }

  async getCreatorRankingHistory(userId: string, limit = 12) {
    return legendCanonicalService.getRankingHistory(userId, limit);
  }

  async getGlobalLeaderboard(limit = 50) {
    return legendCanonicalService.getGlobalLeaderboard(limit);
  }

  async getUniverseLeaderboard(universeId: string, limit = 50) {
    const { data, error } = await supabase
      .from('creator_tru_scores')
      .select(`
        *,
        profiles:user_id (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('universe_id', universeId)
      .order('rank_weekly_universe', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  async getLegendVideos(limit = 20) {
    const legends = await legendCanonicalService.getActiveLegends('video', limit);

    const videoIds = legends.map(l => l.entity_id);
    if (videoIds.length === 0) return [];

    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        creator:profiles!videos_creator_id_fkey(
          display_name,
          avatar_url,
          user_status,
          subscriber_count
        )
      `)
      .in('id', videoIds)
      .eq('is_masked', false);

    if (error) {
      console.error('Error fetching legend videos:', error);
      return [];
    }

    return (data || []).map((video: any) => {
      const legend = legends.find(l => l.entity_id === video.id);
      return {
        ...video,
        legend_tier: this.getLegendTierFromLevel(legend?.legend_level || 1),
        legend_level: legend?.legend_level || 1
      };
    });
  }

  getBadgeLevelName(level: number): string {
    return legendCanonicalService.getLevelName(level as 1 | 2 | 3 | 4);
  }

  getBadgeLevelColor(level: number): string {
    return legendCanonicalService.getLevelColor(level as 1 | 2 | 3 | 4);
  }

  getTrendIcon(trend: 'up' | 'down' | 'stable'): string {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      case 'stable': return '→';
      default: return '→';
    }
  }

  getTrendColor(trend: 'up' | 'down' | 'stable'): string {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      case 'stable': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  }

  private getLegendTierFromLevel(level: number): string {
    switch (level) {
      case 1: return 'bronze';
      case 2: return 'silver';
      case 3: return 'gold';
      case 4: return 'platinum';
      default: return 'bronze';
    }
  }
}

export const legendService = new LegendService();
