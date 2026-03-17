import { supabase } from '../lib/supabase';

export interface LiveStream {
  id: string;
  creator_id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  stream_type: 'general' | 'gaming' | 'music' | 'event' | 'premiere';
  access_type: 'public' | 'premium' | 'private' | 'subscribers';
  subscription_tier_required?: string;
  universe_id?: string;
  sub_universe_id?: string;
  stream_key: string;
  rtmp_url?: string;
  playback_url?: string;
  bitrate_kbps?: number;
  orientation?: 'landscape' | 'portrait' | 'square';
  stream_status: 'scheduled' | 'live' | 'ended' | 'archived';
  scheduled_at?: string;
  started_at?: string;
  ended_at?: string;
  viewer_count: number;
  peak_viewers: number;
  total_gifts_received: number;
  total_trucoins_earned: number;
  replay_video_id?: string;
  replay_ready: boolean;
  gaming_session_id?: string;
  created_at: string;
  updated_at: string;
}

export interface LiveViewer {
  id: string;
  stream_id: string;
  user_id?: string;
  joined_at: string;
  left_at?: string;
  watch_duration_seconds: number;
}

export interface LiveMessage {
  id: string;
  stream_id: string;
  user_id: string;
  message: string;
  is_pinned: boolean;
  is_deleted: boolean;
  created_at: string;
}

export interface LiveGift {
  id: string;
  stream_id: string;
  sender_id: string;
  gift_type: string;
  gift_name: string;
  trucoin_amount: number;
  message?: string;
  created_at: string;
}

export interface LiveStreamStats {
  viewer_count: number;
  peak_viewers: number;
  total_viewers: number;
  total_messages: number;
  total_gifts: number;
  total_trucoins: number;
  duration_seconds: number;
}

export interface CreateLiveStreamParams {
  title: string;
  description?: string;
  stream_type?: 'general' | 'gaming' | 'music' | 'event' | 'premiere';
  access_type?: 'public' | 'premium' | 'private' | 'subscribers';
  universe_id?: string;
  sub_universe_id?: string;
  scheduled_at?: string;
}

export interface CreateLiveStreamResult {
  stream_id: string;
  stream_key: string;
  rtmp_url: string;
}

class LiveService {
  async createLiveStream(params: CreateLiveStreamParams): Promise<CreateLiveStreamResult> {
    const { data, error } = await supabase.rpc('create_live_stream', {
      p_title: params.title,
      p_description: params.description,
      p_stream_type: params.stream_type || 'general',
      p_access_type: params.access_type || 'public',
      p_universe_id: params.universe_id,
      p_sub_universe_id: params.sub_universe_id,
      p_scheduled_at: params.scheduled_at,
    });

    if (error) throw error;
    return data;
  }

  async startLiveStream(streamId: string): Promise<void> {
    const { error } = await supabase.rpc('start_live_stream', {
      p_stream_id: streamId,
    });

    if (error) throw error;
  }

  async endLiveStream(streamId: string): Promise<void> {
    const { error } = await supabase.rpc('end_live_stream', {
      p_stream_id: streamId,
    });

    if (error) throw error;
  }

  async joinLiveStream(streamId: string): Promise<string> {
    const { data, error } = await supabase.rpc('join_live_stream', {
      p_stream_id: streamId,
    });

    if (error) throw error;
    return data;
  }

  async leaveLiveStream(viewerId: string): Promise<void> {
    const { error } = await supabase.rpc('leave_live_stream', {
      p_viewer_id: viewerId,
    });

    if (error) throw error;
  }

  async getLiveStreamById(streamId: string): Promise<LiveStream | null> {
    const { data, error } = await supabase
      .from('live_streams')
      .select('*')
      .eq('id', streamId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async getCreatorLiveStreams(creatorId: string): Promise<LiveStream[]> {
    const { data, error } = await supabase
      .from('live_streams')
      .select('*')
      .eq('creator_id', creatorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getCurrentLiveStreams(streamType?: string, limit = 50): Promise<LiveStream[]> {
    let query = supabase
      .from('live_streams')
      .select('*')
      .eq('stream_status', 'live')
      .order('viewer_count', { ascending: false })
      .limit(limit);

    if (streamType) {
      query = query.eq('stream_type', streamType);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  async getLiveStreamStats(streamId: string): Promise<LiveStreamStats> {
    const { data, error } = await supabase.rpc('get_live_stream_stats', {
      p_stream_id: streamId,
    });

    if (error) throw error;
    return data;
  }

  async sendMessage(streamId: string, message: string): Promise<LiveMessage> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('live_messages')
      .insert({
        stream_id: streamId,
        user_id: user.user.id,
        message,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getMessages(streamId: string, limit = 100): Promise<LiveMessage[]> {
    const { data, error } = await supabase
      .from('live_messages')
      .select('*')
      .eq('stream_id', streamId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  async sendGift(streamId: string, giftType: string, giftName: string, trucoinAmount: number, message?: string): Promise<LiveGift> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('live_gifts')
      .insert({
        stream_id: streamId,
        sender_id: user.user.id,
        gift_type: giftType,
        gift_name: giftName,
        trucoin_amount: trucoinAmount,
        message,
      })
      .select()
      .single();

    if (error) throw error;

    await supabase
      .from('live_streams')
      .update({
        total_gifts_received: supabase.sql`total_gifts_received + 1`,
        total_trucoins_earned: supabase.sql`total_trucoins_earned + ${trucoinAmount}`,
      })
      .eq('id', streamId);

    return data;
  }

  async getGifts(streamId: string, limit = 50): Promise<LiveGift[]> {
    const { data, error } = await supabase
      .from('live_gifts')
      .select('*')
      .eq('stream_id', streamId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  subscribeToStream(streamId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`live_stream:${streamId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'live_streams',
        filter: `id=eq.${streamId}`,
      }, callback)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'live_messages',
        filter: `stream_id=eq.${streamId}`,
      }, callback)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'live_gifts',
        filter: `stream_id=eq.${streamId}`,
      }, callback)
      .subscribe();
  }

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}

export const liveService = new LiveService();
