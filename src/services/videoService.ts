import { supabase } from '../lib/supabase';

export interface Video {
  id: string;
  creator_id: string;
  universe_id: string | null;
  sub_universe_id: string | null;
  title: string;
  description: string;
  thumbnail_url: string | null;
  video_url: string | null;
  duration: number;
  is_short: boolean;
  is_premium: boolean;
  view_count: number;
  like_count: number;
  comment_count: number;
  avg_watch_time: number;
  quality_score: number;
  authenticity_score: number;
  is_masked: boolean;
  created_at: string;
}

export interface VideoWithCreator extends Video {
  creator: {
    display_name: string;
    avatar_url: string | null;
    user_status: string;
    subscriber_count?: number;
  };
}

export const videoService = {
  async getVideos(limit: number = 20, universeId?: string): Promise<VideoWithCreator[]> {
    let query = supabase
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
      .eq('is_masked', false)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (universeId) {
      query = query.eq('universe_id', universeId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching videos:', error);
      return [];
    }

    return data as VideoWithCreator[];
  },

  async getVideoById(videoId: string): Promise<VideoWithCreator | null> {
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
      .eq('id', videoId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching video:', error);
      return null;
    }

    return data as VideoWithCreator;
  },

  async getTrendingVideos(limit: number = 20): Promise<VideoWithCreator[]> {
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
      .eq('is_masked', false)
      .order('view_count', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching trending videos:', error);
      return [];
    }

    return data as VideoWithCreator[];
  },

  async getVideosByCreator(creatorId: string, limit: number = 20): Promise<VideoWithCreator[]> {
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
      .eq('creator_id', creatorId)
      .eq('is_masked', false)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching creator videos:', error);
      return [];
    }

    return data as VideoWithCreator[];
  },

  async incrementViewCount(videoId: string): Promise<void> {
    const { error } = await supabase.rpc('increment_view_count', {
      video_id: videoId,
    });

    if (error) {
      console.error('Error incrementing view count:', error);
    }
  },
};
