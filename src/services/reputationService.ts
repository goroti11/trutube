import { supabase } from '../lib/supabase';

export interface UserReputation {
  id: string;
  user_id: string;
  universe_id?: string;
  community_id?: string;
  reputation_score: number;
  helpful_count: number;
  post_count: number;
  quality_score: number;
  level: number;
  last_calculated_at: string;
  created_at: string;
}

export interface BadgeType {
  id: string;
  name: string;
  description?: string;
  category: 'founder' | 'creator' | 'expert' | 'moderator' | 'contributor' | 'verified';
  icon?: string;
  color?: string;
  requirements: Record<string, any>;
  is_active: boolean;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_type_id: string;
  earned_at: string;
  is_displayed: boolean;
  badge?: BadgeType;
}

export const reputationService = {
  async getUserReputation(userId: string, communityId?: string): Promise<UserReputation | null> {
    try {
      let query = supabase
        .from('user_reputation')
        .select('*')
        .eq('user_id', userId);

      if (communityId) {
        query = query.eq('community_id', communityId);
      }

      const { data, error } = await query.maybeSingle();

      if (error) throw error;

      if (!data) {
        return await this.initializeReputation(userId, communityId);
      }

      return data;
    } catch (error) {
      console.error('Error getting reputation:', error);
      return null;
    }
  },

  async initializeReputation(userId: string, communityId?: string): Promise<UserReputation | null> {
    try {
      const { data, error } = await supabase
        .from('user_reputation')
        .insert({
          user_id: userId,
          community_id: communityId,
          reputation_score: 0,
          quality_score: 50,
          level: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error initializing reputation:', error);
      return null;
    }
  },

  async updateReputation(
    userId: string,
    communityId: string | undefined,
    delta: number
  ): Promise<boolean> {
    try {
      const reputation = await this.getUserReputation(userId, communityId);
      if (!reputation) return false;

      const newScore = Math.max(0, reputation.reputation_score + delta);
      const newLevel = Math.floor(newScore / 100);

      const { error } = await supabase
        .from('user_reputation')
        .update({
          reputation_score: newScore,
          level: newLevel,
          last_calculated_at: new Date().toISOString(),
        })
        .eq('id', reputation.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating reputation:', error);
      return false;
    }
  },

  async incrementHelpfulCount(userId: string, communityId?: string): Promise<boolean> {
    try {
      const reputation = await this.getUserReputation(userId, communityId);
      if (!reputation) return false;

      const { error } = await supabase
        .from('user_reputation')
        .update({
          helpful_count: reputation.helpful_count + 1,
          reputation_score: reputation.reputation_score + 10,
          last_calculated_at: new Date().toISOString(),
        })
        .eq('id', reputation.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error incrementing helpful count:', error);
      return false;
    }
  },

  async incrementPostCount(userId: string, communityId?: string): Promise<boolean> {
    try {
      const reputation = await this.getUserReputation(userId, communityId);
      if (!reputation) return false;

      const { error } = await supabase
        .from('user_reputation')
        .update({
          post_count: reputation.post_count + 1,
          reputation_score: reputation.reputation_score + 5,
          last_calculated_at: new Date().toISOString(),
        })
        .eq('id', reputation.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error incrementing post count:', error);
      return false;
    }
  },

  async getTopUsers(communityId?: string, limit = 10): Promise<UserReputation[]> {
    try {
      let query = supabase
        .from('user_reputation')
        .select('*')
        .order('reputation_score', { ascending: false })
        .limit(limit);

      if (communityId) {
        query = query.eq('community_id', communityId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting top users:', error);
      return [];
    }
  },

  async getBadgeTypes(): Promise<BadgeType[]> {
    try {
      const { data, error } = await supabase
        .from('badge_types')
        .select('*')
        .eq('is_active', true)
        .order('category');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting badge types:', error);
      return [];
    }
  },

  async getUserBadges(userId: string): Promise<UserBadge[]> {
    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select(`
          *,
          badge:badge_types(*)
        `)
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting user badges:', error);
      return [];
    }
  },

  async awardBadge(userId: string, badgeTypeId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_badges')
        .insert({
          user_id: userId,
          badge_type_id: badgeTypeId,
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error awarding badge:', error);
      return false;
    }
  },

  async toggleBadgeDisplay(userId: string, badgeId: string, display: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_badges')
        .update({ is_displayed: display })
        .eq('id', badgeId)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error toggling badge display:', error);
      return false;
    }
  },

  async checkBadgeEligibility(userId: string): Promise<string[]> {
    const eligibleBadges: string[] = [];

    const reputation = await this.getUserReputation(userId);
    if (!reputation) return eligibleBadges;

    const badges = await this.getBadgeTypes();
    const userBadges = await this.getUserBadges(userId);
    const earnedBadgeIds = userBadges.map(b => b.badge_type_id);

    for (const badge of badges) {
      if (earnedBadgeIds.includes(badge.id)) continue;

      const requirements = badge.requirements as any;
      let eligible = true;

      if (requirements.min_reputation && reputation.reputation_score < requirements.min_reputation) {
        eligible = false;
      }
      if (requirements.min_posts && reputation.post_count < requirements.min_posts) {
        eligible = false;
      }
      if (requirements.min_helpful && reputation.helpful_count < requirements.min_helpful) {
        eligible = false;
      }

      if (eligible) {
        eligibleBadges.push(badge.id);
      }
    }

    return eligibleBadges;
  },
};
