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

  async calculateCreatorTruScore(userId: string, universeId?: string) {
    const { data, error } = await supabase.rpc('calculate_creator_tru_score', {
      p_user_id: userId,
      p_universe_id: universeId
    });

    if (error) throw error;
    return data;
  }

  async getGlobalLeaderboard(limit = 50) {
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
      .is('universe_id', null)
      .order('rank_weekly_global', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data;
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

  async getCurrentLegendHolders(type?: 'universe_legend' | 'global_legend') {
    let query = supabase
      .from('legend_active_holders')
      .select(`
        *,
        profiles:user_id (
          id,
          username,
          full_name,
          avatar_url
        ),
        universes:universe_id (
          id,
          name,
          icon
        )
      `)
      .eq('is_current', true)
      .order('level', { ascending: false });

    if (type) {
      query = query.eq('holder_type', type);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  }

  async getCreatorRankingHistory(userId: string, limit = 12) {
    const { data, error } = await supabase
      .from('legend_rankings_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as LegendRankingHistory[];
  }

  async getTrendingVideos(universeId?: string, period: '24h' | '7d' = '24h', limit = 20) {
    let query = supabase
      .from('video_legend_awards')
      .select(`
        *,
        videos:video_id (
          id,
          title,
          thumbnail_url,
          view_count,
          uploader_id,
          profiles:uploader_id (
            username,
            avatar_url
          )
        ),
        legend_badges (*)
      `)
      .eq('is_active', true)
      .eq('period', period)
      .in('badge_id', (await this.getAllBadges())
        .filter(b => b.badge_type === 'trending')
        .map(b => b.id))
      .order('awarded_at', { ascending: false })
      .limit(limit);

    if (universeId) {
      query = query.eq('universe_id', universeId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  }

  getBadgeLevelName(level: number): string {
    switch (level) {
      case 1: return 'Rising';
      case 2: return 'Breakout';
      case 3: return 'Power';
      case 4: return 'Elite';
      case 5: return 'Legend Active';
      default: return 'Unknown';
    }
  }

  getBadgeLevelColor(level: number): string {
    switch (level) {
      case 1: return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
      case 2: return 'text-gray-300 border-gray-400/30 bg-gray-400/10';
      case 3: return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
      case 4: return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
      case 5: return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
      default: return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
    }
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
}

export const legendService = new LegendService();
