import { supabase } from '../lib/supabase';

export interface SocialPost {
  id: string;
  user_id: string;
  post_type: 'image' | 'video' | 'carousel' | 'text' | 'announcement';
  content: Record<string, any>;
  caption?: string;
  universe_id?: string;
  is_official_announcement: boolean;
  announcement_type?: 'album' | 'live' | 'merch' | 'collaboration';
  linked_album_id?: string;
  linked_live_id?: string;
  linked_product_id?: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  visibility: 'public' | 'followers' | 'private';
  discovery_score: number;
  tru_score_boost: number;
  created_at: string;
  updated_at: string;
  profiles?: {
    id: string;
    username: string;
    avatar_url?: string;
    is_verified?: boolean;
  };
}

export interface Story {
  id: string;
  user_id: string;
  story_type: 'image' | 'video' | 'poll' | 'qa' | 'countdown';
  content: Record<string, any>;
  duration_seconds: number;
  universe_id?: string;
  announcement_type?: 'album' | 'live' | 'merch' | 'collaboration';
  linked_content_id?: string;
  views_count: number;
  expires_at: string;
  created_at: string;
  profiles?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}

export interface Reel {
  id: string;
  user_id: string;
  video_url: string;
  thumbnail_url?: string;
  caption?: string;
  duration_seconds: number;
  universe_id?: string;
  music_track?: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  views_count: number;
  created_at: string;
  profiles?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  parent_comment_id?: string;
  content: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
  profiles?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}

export interface FeedPreferences {
  id: string;
  user_id: string;
  feed_mode: 'chronological' | 'intelligent' | 'universe_only';
  show_discovery: boolean;
  discovery_limit_per_day: number;
  prioritize_followed: boolean;
  filter_universes: string[];
}

class SocialService {
  async getFeedPreferences(userId: string): Promise<FeedPreferences | null> {
    const { data, error } = await supabase
      .from('user_feed_preferences')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async updateFeedPreferences(userId: string, preferences: Partial<FeedPreferences>) {
    const { data, error } = await supabase
      .from('user_feed_preferences')
      .upsert({
        user_id: userId,
        ...preferences
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getIntelligentFeed(userId: string, limit = 20, _offset = 0): Promise<SocialPost[]> {
    const posts: SocialPost[] = [];

    const layerALimit = Math.floor(limit * 0.6);
    const layerBLimit = Math.floor(limit * 0.3);
    const layerCLimit = limit - layerALimit - layerBLimit;

    const { data: followedCreators } = await supabase
      .from('subscriptions')
      .select('channel_id')
      .eq('user_id', userId);

    const followedIds = followedCreators?.map(s => s.channel_id) || [];

    if (followedIds.length > 0) {
      const { data: layerA } = await supabase
        .from('community_posts')
        .select(`
          *,
          profiles:user_id (
            id,
            username,
            avatar_url,
            is_verified
          )
        `)
        .in('user_id', followedIds)
        .eq('visibility', 'public')
        .order('is_official_announcement', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(layerALimit);

      if (layerA) posts.push(...layerA);
    }

    const { data: userPrefs } = await supabase
      .from('profiles')
      .select('universe_preferences')
      .eq('id', userId)
      .maybeSingle();

    const universeIds = userPrefs?.universe_preferences || [];

    if (universeIds.length > 0) {
      const { data: layerB } = await supabase
        .from('community_posts')
        .select(`
          *,
          profiles:user_id (
            id,
            username,
            avatar_url,
            is_verified
          )
        `)
        .in('universe_id', universeIds)
        .eq('visibility', 'public')
        .not('user_id', 'in', `(${followedIds.join(',')})`)
        .order('discovery_score', { ascending: false })
        .limit(layerBLimit);

      if (layerB) posts.push(...layerB);
    }

    const { data: layerC } = await supabase
      .from('community_posts')
      .select(`
        *,
        profiles:user_id (
          id,
          username,
          avatar_url,
          is_verified
        )
      `)
      .eq('visibility', 'public')
      .not('user_id', 'in', `(${followedIds.join(',')})`)
      .order('discovery_score', { ascending: false })
      .order('tru_score_boost', { ascending: false })
      .limit(layerCLimit);

    if (layerC) posts.push(...layerC);

    return posts;
  }

  async getFeed(userId?: string, mode: 'chronological' | 'intelligent' | 'universe_only' = 'intelligent', universeId?: string, limit = 20, offset = 0) {
    if (mode === 'intelligent' && userId) {
      return this.getIntelligentFeed(userId, limit, offset);
    }

    let query = supabase
      .from('community_posts')
      .select(`
        *,
        profiles:user_id (
          id,
          username,
          avatar_url,
          is_verified
        )
      `)
      .eq('visibility', 'public')
      .range(offset, offset + limit - 1);

    if (mode === 'universe_only' && universeId) {
      query = query.eq('universe_id', universeId);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data as SocialPost[];
  }

  async getUserPosts(userId: string, limit = 20) {
    const { data, error } = await supabase
      .from('community_posts')
      .select(`
        *,
        profiles:user_id (
          id,
          username,
          avatar_url
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as SocialPost[];
  }

  async createPost(postData: Partial<SocialPost>) {
    const { data, error } = await supabase
      .from('community_posts')
      .insert([postData])
      .select()
      .single();

    if (error) throw error;
    return data as SocialPost;
  }

  async likePost(postId: string, userId: string) {
    const { error } = await supabase
      .from('post_likes')
      .insert([{ post_id: postId, user_id: userId }]);

    if (error) throw error;
  }

  async unlikePost(postId: string, userId: string) {
    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  async getPostComments(postId: string) {
    const { data, error } = await supabase
      .from('post_comments')
      .select(`
        *,
        profiles:user_id (
          id,
          username,
          avatar_url
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data as PostComment[];
  }

  async addComment(postId: string, userId: string, content: string, parentId?: string) {
    const { data, error } = await supabase
      .from('post_comments')
      .insert([{
        post_id: postId,
        user_id: userId,
        content,
        parent_comment_id: parentId
      }])
      .select()
      .single();

    if (error) throw error;
    return data as PostComment;
  }

  async getActiveStories(universeId?: string) {
    let query = supabase
      .from('community_stories')
      .select(`
        *,
        profiles:user_id (
          id,
          username,
          avatar_url
        )
      `)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (universeId) {
      query = query.eq('universe_id', universeId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Story[];
  }

  async createStory(storyData: Partial<Story>) {
    const { data, error } = await supabase
      .from('community_stories')
      .insert([storyData])
      .select()
      .single();

    if (error) throw error;

    if (storyData.announcement_type) {
      await supabase.from('story_announcements').insert([{
        story_id: data.id,
        announcement_type: storyData.announcement_type,
        linked_album_id: storyData.linked_content_id
      }]);
    }

    return data as Story;
  }

  async viewStory(storyId: string, userId: string) {
    const { error } = await supabase
      .from('story_views')
      .insert([{ story_id: storyId, user_id: userId }]);

    if (error && error.code !== '23505') throw error;
  }

  async getReels(universeId?: string, limit = 20, offset = 0) {
    let query = supabase
      .from('community_reels')
      .select(`
        *,
        profiles:user_id (
          id,
          username,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (universeId) {
      query = query.eq('universe_id', universeId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Reel[];
  }

  async createReel(reelData: Partial<Reel>) {
    const { data, error } = await supabase
      .from('community_reels')
      .insert([reelData])
      .select()
      .single();

    if (error) throw error;
    return data as Reel;
  }

  async likeReel(reelId: string, userId: string) {
    const { error } = await supabase
      .from('reel_likes')
      .insert([{ reel_id: reelId, user_id: userId }]);

    if (error) throw error;
  }

  async unlikeReel(reelId: string, userId: string) {
    const { error } = await supabase
      .from('reel_likes')
      .delete()
      .eq('reel_id', reelId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  async canCreatePremiumGroup(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .rpc('can_create_premium_group', { p_user_id: userId });

    if (error) throw error;
    return data || false;
  }

  async requestExpertValidation(userId: string, domain: string, universeId?: string) {
    const { data, error } = await supabase
      .from('expert_validations')
      .insert([{
        user_id: userId,
        expertise_domain: domain,
        universe_id: universeId,
        validation_status: 'pending'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export const socialService = new SocialService();
