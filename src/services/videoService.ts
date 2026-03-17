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
  legend_tier?: string;
  has_auto_dub?: boolean;
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

  async getLiveVideos(limit: number = 20): Promise<VideoWithCreator[]> {
    const { data, error } = await supabase
      .from('live_streams')
      .select(`
        id,
        title,
        description,
        thumbnail_url,
        viewer_count,
        created_at,
        creator:profiles!live_streams_creator_id_fkey(
          display_name,
          avatar_url,
          user_status,
          subscriber_count
        )
      `)
      .eq('status', 'live')
      .order('viewer_count', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching live videos:', error);
      return [];
    }

    return (data || []).map((stream: any) => ({
      id: stream.id,
      creator_id: stream.creator?.id || '',
      universe_id: null,
      sub_universe_id: null,
      title: stream.title,
      description: stream.description,
      thumbnail_url: stream.thumbnail_url,
      video_url: null,
      duration: 0,
      is_short: false,
      is_premium: false,
      view_count: stream.viewer_count || 0,
      like_count: 0,
      comment_count: 0,
      avg_watch_time: 0,
      quality_score: 100,
      authenticity_score: 100,
      is_masked: false,
      created_at: stream.created_at,
      creator: stream.creator,
    })) as VideoWithCreator[];
  },

  async getRecommendedVideos(userId: string, limit: number = 20): Promise<VideoWithCreator[]> {
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
      .order('quality_score', { ascending: false })
      .order('view_count', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recommended videos:', error);
      return [];
    }

    return data as VideoWithCreator[];
  },

  async getGlobalModeVideos(limit: number = 20): Promise<VideoWithCreator[]> {
    const { data, error } = await supabase
      .from('videos')
      .select(`
        *,
        creator:profiles!videos_creator_id_fkey(
          display_name,
          avatar_url,
          user_status,
          subscriber_count
        ),
        auto_dub_videos!inner(id)
      `)
      .eq('is_masked', false)
      .order('view_count', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching global mode videos:', error);
      return [];
    }

    return (data || []).map((video: any) => ({
      ...video,
      has_auto_dub: true,
    })) as VideoWithCreator[];
  },
};
