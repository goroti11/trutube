import { supabase } from '../lib/supabase';

export interface Community {
  id: string;
  name: string;
  slug: string;
  description?: string;
  type: 'universe' | 'creator' | 'premium' | 'private';
  universe_id?: string;
  sub_universe_id?: string;
  creator_id?: string;
  is_premium: boolean;
  premium_price: number;
  member_count: number;
  post_count: number;
  avatar_url?: string;
  banner_url?: string;
  rules: any[];
  settings: Record<string, any>;
  is_active: boolean;
  created_at: string;
}

export interface CommunityMember {
  id: string;
  community_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'moderator' | 'member';
  reputation_score: number;
  post_count: number;
  helpful_count: number;
  joined_at: string;
  last_active_at: string;
}

export interface CommunityPost {
  id: string;
  community_id: string;
  author_id: string;
  title?: string;
  content: string;
  post_type: 'text' | 'image' | 'video' | 'poll' | 'thread' | 'qa';
  visibility: 'public' | 'members' | 'premium' | 'private';
  media_urls: string[];
  engagement_score: number;
  view_count: number;
  reaction_count: number;
  comment_count: number;
  share_count: number;
  is_pinned: boolean;
  is_announcement: boolean;
  moderation_status: 'pending' | 'approved' | 'flagged' | 'removed' | 'banned';
  created_at: string;
  updated_at: string;
}

export interface PostComment {
  id: string;
  post_id: string;
  author_id: string;
  parent_comment_id?: string;
  content: string;
  reaction_count: number;
  is_helpful: boolean;
  helpful_count: number;
  moderation_status: 'pending' | 'approved' | 'flagged' | 'removed' | 'banned';
  created_at: string;
  updated_at: string;
}

export interface PostReaction {
  id: string;
  post_id?: string;
  comment_id?: string;
  user_id: string;
  reaction_type: 'like' | 'love' | 'insightful' | 'helpful' | 'funny';
  created_at: string;
}

export const communityService = {
  async getCommunities(type?: Community['type']): Promise<Community[]> {
    try {
      let query = supabase
        .from('communities')
        .select('*')
        .eq('is_active', true);

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query.order('member_count', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting communities:', error);
      return [];
    }
  },

  async getCommunityBySlug(slug: string): Promise<Community | null> {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting community:', error);
      return null;
    }
  },

  async getCommunityByUniverse(universeId: string, subUniverseId?: string): Promise<Community | null> {
    try {
      let query = supabase
        .from('communities')
        .select('*')
        .eq('universe_id', universeId)
        .eq('type', 'universe')
        .eq('is_active', true);

      if (subUniverseId) {
        query = query.eq('sub_universe_id', subUniverseId);
      }

      const { data, error } = await query.maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting universe community:', error);
      return null;
    }
  },

  async getUserCommunities(userId: string): Promise<Community[]> {
    try {
      const { data, error } = await supabase
        .from('community_members')
        .select(`
          *,
          community:communities(*)
        `)
        .eq('user_id', userId);

      if (error) throw error;
      return data?.map((m: any) => m.community).filter(Boolean) || [];
    } catch (error) {
      console.error('Error getting user communities:', error);
      return [];
    }
  },

  async createCommunity(community: Partial<Community>): Promise<Community | null> {
    try {
      const { data, error } = await supabase
        .from('communities')
        .insert({
          name: community.name,
          slug: community.slug,
          description: community.description,
          type: community.type || 'creator',
          universe_id: community.universe_id,
          sub_universe_id: community.sub_universe_id,
          creator_id: community.creator_id,
          is_premium: community.is_premium || false,
          premium_price: community.premium_price || 0,
          avatar_url: community.avatar_url,
          banner_url: community.banner_url,
          rules: community.rules || [],
          settings: community.settings || {},
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating community:', error);
      return null;
    }
  },

  async joinCommunity(userId: string, communityId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('community_members')
        .insert({
          community_id: communityId,
          user_id: userId,
          role: 'member',
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error joining community:', error);
      return false;
    }
  },

  async leaveCommunity(userId: string, communityId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('community_members')
        .delete()
        .eq('user_id', userId)
        .eq('community_id', communityId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error leaving community:', error);
      return false;
    }
  },

  async isMember(userId: string, communityId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('community_members')
        .select('id')
        .eq('user_id', userId)
        .eq('community_id', communityId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking membership:', error);
      return false;
    }
  },

  async getCommunityPosts(communityId: string, limit = 20): Promise<CommunityPost[]> {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .eq('community_id', communityId)
        .eq('moderation_status', 'approved')
        .is('deleted_at', null)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting community posts:', error);
      return [];
    }
  },

  async createPost(post: Partial<CommunityPost>): Promise<CommunityPost | null> {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .insert({
          community_id: post.community_id,
          author_id: post.author_id,
          title: post.title,
          content: post.content,
          post_type: post.post_type || 'text',
          visibility: post.visibility || 'public',
          media_urls: post.media_urls || [],
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating post:', error);
      return null;
    }
  },

  async getPostComments(postId: string): Promise<PostComment[]> {
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .select('*')
        .eq('post_id', postId)
        .eq('moderation_status', 'approved')
        .is('deleted_at', null)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting comments:', error);
      return [];
    }
  },

  async addComment(comment: Partial<PostComment>): Promise<PostComment | null> {
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .insert({
          post_id: comment.post_id,
          author_id: comment.author_id,
          parent_comment_id: comment.parent_comment_id,
          content: comment.content,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding comment:', error);
      return null;
    }
  },

  async addReaction(
    userId: string,
    targetId: string,
    targetType: 'post' | 'comment',
    reactionType: PostReaction['reaction_type']
  ): Promise<boolean> {
    try {
      const { error } = await supabase.from('post_reactions').insert({
        user_id: userId,
        [targetType === 'post' ? 'post_id' : 'comment_id']: targetId,
        reaction_type: reactionType,
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error adding reaction:', error);
      return false;
    }
  },

  async removeReaction(
    userId: string,
    targetId: string,
    targetType: 'post' | 'comment',
    reactionType: PostReaction['reaction_type']
  ): Promise<boolean> {
    try {
      const { error} = await supabase
        .from('post_reactions')
        .delete()
        .eq('user_id', userId)
        .eq(targetType === 'post' ? 'post_id' : 'comment_id', targetId)
        .eq('reaction_type', reactionType);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error removing reaction:', error);
      return false;
    }
  },

  async getPostReactions(postId: string): Promise<Record<string, number>> {
    try {
      const { data, error } = await supabase
        .from('post_reactions')
        .select('reaction_type')
        .eq('post_id', postId);

      if (error) throw error;

      const counts: Record<string, number> = {};
      data?.forEach((r: any) => {
        counts[r.reaction_type] = (counts[r.reaction_type] || 0) + 1;
      });

      return counts;
    } catch (error) {
      console.error('Error getting reactions:', error);
      return {};
    }
  },
};
