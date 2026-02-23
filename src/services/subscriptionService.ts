import { supabase } from '../lib/supabase';

export interface Subscriber {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  subscribed_at: string;
  tier: 'free' | 'premium';
  tier_name?: string;
  activity_score: number;
  videos_watched: number;
  comments_count: number;
  likes_given: number;
}

export const subscriptionService = {
  async getChannelSubscribers(channelId: string, limit = 50, offset = 0): Promise<Subscriber[]> {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        id,
        supporter_id,
        tier,
        created_at,
        supporter:user_profiles!subscriptions_supporter_id_fkey(
          id,
          username,
          display_name,
          avatar_url
        )
      `)
      .eq('creator_id', channelId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching subscribers:', error);
      throw error;
    }

    if (!data) return [];

    const subscriberIds = data.map(s => s.supporter_id);

    const [videosWatched, comments, likes] = await Promise.all([
      supabase
        .from('video_views')
        .select('user_id')
        .in('user_id', subscriberIds),
      supabase
        .from('comments')
        .select('user_id')
        .in('user_id', subscriberIds),
      supabase
        .from('video_likes')
        .select('user_id')
        .in('user_id', subscriberIds)
    ]);

    const videosByUser = videosWatched.data?.reduce((acc, v) => {
      acc[v.user_id] = (acc[v.user_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    const commentsByUser = comments.data?.reduce((acc, c) => {
      acc[c.user_id] = (acc[c.user_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    const likesByUser = likes.data?.reduce((acc, l) => {
      acc[l.user_id] = (acc[l.user_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    return data.map(sub => {
      const supporterId = sub.supporter_id;
      const videosCount = videosByUser[supporterId] || 0;
      const commentsCount = commentsByUser[supporterId] || 0;
      const likesCount = likesByUser[supporterId] || 0;

      const activityScore = Math.min(100, Math.round(
        (videosCount * 0.4) +
        (commentsCount * 1.5) +
        (likesCount * 0.3)
      ));

      return {
        id: sub.id,
        username: sub.supporter?.username || 'unknown',
        display_name: sub.supporter?.display_name || 'Unknown User',
        avatar_url: sub.supporter?.avatar_url || '/default-avatar.png',
        subscribed_at: sub.created_at,
        tier: sub.tier === 'supporter' ? 'free' : 'premium',
        tier_name: sub.tier !== 'supporter' ? sub.tier : undefined,
        activity_score: activityScore,
        videos_watched: videosCount,
        comments_count: commentsCount,
        likes_given: likesCount
      };
    });
  },

  async getSubscriberCount(channelId: string): Promise<number> {
    const { count, error } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('creator_id', channelId)
      .eq('status', 'active');

    if (error) {
      console.error('Error counting subscribers:', error);
      return 0;
    }

    return count || 0;
  },

  async getSubscriberStats(channelId: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('tier')
      .eq('creator_id', channelId)
      .eq('status', 'active');

    if (error) {
      console.error('Error fetching subscriber stats:', error);
      return { total: 0, premium: 0, free: 0 };
    }

    const total = data?.length || 0;
    const premium = data?.filter(s => s.tier !== 'supporter').length || 0;
    const free = total - premium;

    return { total, premium, free };
  }
};
