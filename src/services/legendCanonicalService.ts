import { supabase } from '../lib/supabase';

export type LegendLevel = 1 | 2 | 3 | 4;
export type LegendStatus = 'active' | 'expired' | 'revoked';
export type CandidateStatus = 'pending' | 'under_review' | 'approved' | 'rejected';

export interface LegendRegistry {
  id: string;
  entity_type: string;
  entity_id: string;
  legend_level: LegendLevel;
  status: LegendStatus;
  reason: string;
  legend_score: number;
  boost_factor: number;
  promotion_date: string;
  expiration_date: string | null;
  revoked_at: string | null;
  revoke_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface LegendCandidate {
  id: string;
  entity_type: string;
  entity_id: string;
  candidate_status: CandidateStatus;
  legend_score: number;
  watch_score: number;
  engagement_score: number;
  economic_score: number;
  submission_date: string;
  review_date: string | null;
  reviewer_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface LegendVote {
  id: string;
  candidate_id: string | null;
  registry_id: string | null;
  voter_id: string;
  vote_weight: number;
  created_at: string;
}

export interface LegendRanking {
  id: string;
  user_id: string;
  universe_id: string | null;
  ranking_type: 'weekly_universe' | 'weekly_global' | 'alltime';
  rank_position: number;
  legend_score: number;
  period_start: string;
  period_end: string;
  badge_level: number | null;
  created_at: string;
}

export interface LegendActiveHolder {
  id: string;
  user_id: string;
  universe_id: string | null;
  holder_type: 'universe_legend' | 'global_legend';
  level: LegendLevel;
  achieved_at: string;
  lost_at: string | null;
  is_current: boolean;
  weeks_held: number;
}

class LegendCanonicalService {
  async getActiveLegends(entityType?: string, limit: number = 50): Promise<LegendRegistry[]> {
    try {
      let query = supabase
        .from('legend_registry')
        .select('*')
        .eq('status', 'active')
        .order('legend_level', { ascending: false })
        .order('legend_score', { ascending: false })
        .limit(limit);

      if (entityType) {
        query = query.eq('entity_type', entityType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching active legends:', error);
      return [];
    }
  }

  async getLegendByEntity(entityType: string, entityId: string): Promise<LegendRegistry | null> {
    try {
      const { data, error } = await supabase
        .from('legend_registry')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching legend:', error);
      return null;
    }
  }

  async getCandidates(status?: CandidateStatus, limit: number = 20): Promise<LegendCandidate[]> {
    try {
      let query = supabase
        .from('legend_candidates')
        .select('*')
        .order('legend_score', { ascending: false })
        .limit(limit);

      if (status) {
        query = query.eq('candidate_status', status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching candidates:', error);
      return [];
    }
  }

  async voteForCandidate(candidateId: string, voterId: string, weight: number = 1.0): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('legend_votes')
        .insert({
          candidate_id: candidateId,
          voter_id: voterId,
          vote_weight: weight
        });

      return !error;
    } catch (error) {
      console.error('Error voting for candidate:', error);
      return false;
    }
  }

  async checkEligibility(entityType: string, entityId: string): Promise<{
    eligible: boolean;
    legend_score: number;
    reasons: string[];
  } | null> {
    try {
      const { data, error } = await supabase.rpc('check_legend_promotion_eligibility', {
        p_entity_type: entityType,
        p_entity_id: entityId
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error checking eligibility:', error);
      return null;
    }
  }

  async autoPromote(entityType: string, entityId: string): Promise<{
    success: boolean;
    legend_level?: number;
    error?: string;
  }> {
    try {
      const { data, error } = await supabase.rpc('auto_promote_legend_content', {
        p_entity_type: entityType,
        p_entity_id: entityId
      });

      if (error) throw error;
      return data || { success: false, error: 'Unknown error' };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getCurrentHolders(type?: 'universe_legend' | 'global_legend'): Promise<LegendActiveHolder[]> {
    try {
      let query = supabase
        .from('legend_active_holders')
        .select(`
          *,
          profiles:user_id (
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('is_current', true)
        .order('level', { ascending: false });

      if (type) {
        query = query.eq('holder_type', type);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching current holders:', error);
      return [];
    }
  }

  async getRankingHistory(userId: string, limit: number = 12): Promise<LegendRanking[]> {
    try {
      const { data, error } = await supabase
        .from('legend_rankings_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching ranking history:', error);
      return [];
    }
  }

  async getGlobalLeaderboard(limit: number = 50): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('legend_rankings_history')
        .select(`
          *,
          profiles:user_id (
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('ranking_type', 'weekly_global')
        .is('universe_id', null)
        .order('rank_position', { ascending: true })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching global leaderboard:', error);
      return [];
    }
  }

  getLevelName(level: LegendLevel): string {
    const names = {
      1: 'Legend I',
      2: 'Legend II',
      3: 'Legend III',
      4: 'Legend IV'
    };
    return names[level];
  }

  getLevelColor(level: LegendLevel): string {
    const colors = {
      1: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
      2: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      3: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
      4: 'text-purple-400 border-purple-500/30 bg-purple-500/10'
    };
    return colors[level];
  }

  getLevelGradient(level: LegendLevel): string {
    const gradients = {
      1: 'from-yellow-600 to-yellow-400',
      2: 'from-yellow-500 to-orange-400',
      3: 'from-orange-500 to-red-500',
      4: 'from-purple-600 to-pink-500'
    };
    return gradients[level];
  }
}

export const legendCanonicalService = new LegendCanonicalService();
