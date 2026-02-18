import { supabase } from '../lib/supabase';

export interface LiveStream {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  universe_id: string | null;
  sub_universe_id: string | null;
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  stream_key: string | null;
  thumbnail_url: string | null;
  scheduled_at: string | null;
  started_at: string | null;
  ended_at: string | null;
  duration_seconds: number;
  peak_viewers: number;
  total_viewers: number;
  average_viewers: number;
  total_tips: number;
  total_messages: number;
  created_at: string;
  updated_at: string;
}

export interface LiveStreamViewer {
  id: string;
  stream_id: string;
  user_id: string | null;
  joined_at: string;
  left_at: string | null;
  watch_duration_seconds: number;
}

export interface LiveStreamMessage {
  id: string;
  stream_id: string;
  user_id: string;
  message: string;
  is_pinned: boolean;
  is_deleted: boolean;
  created_at: string;
}

export interface LiveStreamStats {
  currentViewers: number;
  peakViewers: number;
  totalViewers: number;
  averageViewers: number;
  duration: number;
  totalTips: number;
  totalMessages: number;
}

class LiveStreamService {
  async createLiveStream(data: {
    title: string;
    description?: string;
    universe_id?: string;
    sub_universe_id?: string;
    scheduled_at?: string;
  }): Promise<{ success: boolean; stream?: LiveStream; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Non authentifié' };
      }

      const streamKey = this.generateStreamKey();

      const { data: stream, error } = await supabase
        .from('live_streams')
        .insert({
          creator_id: user.id,
          title: data.title,
          description: data.description || '',
          universe_id: data.universe_id || null,
          sub_universe_id: data.sub_universe_id || null,
          stream_key: streamKey,
          scheduled_at: data.scheduled_at || null,
          status: data.scheduled_at ? 'scheduled' : 'live'
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, stream };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async startLiveStream(streamId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('live_streams')
        .update({
          status: 'live',
          started_at: new Date().toISOString()
        })
        .eq('id', streamId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async endLiveStream(streamId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('live_streams')
        .update({
          status: 'ended',
          ended_at: new Date().toISOString()
        })
        .eq('id', streamId);

      if (error) {
        return { success: false, error: error.message };
      }

      await this.updateAllViewersAsLeft(streamId);

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async joinStream(streamId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('live_stream_viewers')
        .insert({
          stream_id: streamId,
          user_id: user?.id || null,
          joined_at: new Date().toISOString()
        });

      if (error) {
        return { success: false, error: error.message };
      }

      await this.updateStreamStats(streamId);

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async leaveStream(streamId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data: viewer } = await supabase
        .from('live_stream_viewers')
        .select('*')
        .eq('stream_id', streamId)
        .eq('user_id', user?.id || null)
        .is('left_at', null)
        .single();

      if (viewer) {
        const joinedAt = new Date(viewer.joined_at);
        const leftAt = new Date();
        const duration = Math.floor((leftAt.getTime() - joinedAt.getTime()) / 1000);

        await supabase
          .from('live_stream_viewers')
          .update({
            left_at: leftAt.toISOString(),
            watch_duration_seconds: duration
          })
          .eq('id', viewer.id);
      }

      await this.updateStreamStats(streamId);

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async sendMessage(streamId: string, message: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Non authentifié' };
      }

      const { error } = await supabase
        .from('live_stream_messages')
        .insert({
          stream_id: streamId,
          user_id: user.id,
          message: message.trim()
        });

      if (error) {
        return { success: false, error: error.message };
      }

      await supabase
        .from('live_streams')
        .update({ total_messages: supabase.raw('total_messages + 1') })
        .eq('id', streamId);

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getStreamStats(streamId: string): Promise<LiveStreamStats | null> {
    try {
      const { data: stream } = await supabase
        .from('live_streams')
        .select('*')
        .eq('id', streamId)
        .single();

      if (!stream) return null;

      const { count: currentViewers } = await supabase
        .from('live_stream_viewers')
        .select('*', { count: 'exact', head: true })
        .eq('stream_id', streamId)
        .is('left_at', null);

      return {
        currentViewers: currentViewers || 0,
        peakViewers: stream.peak_viewers,
        totalViewers: stream.total_viewers,
        averageViewers: stream.average_viewers,
        duration: stream.duration_seconds,
        totalTips: stream.total_tips,
        totalMessages: stream.total_messages
      };
    } catch (error) {
      console.error('Error fetching stream stats:', error);
      return null;
    }
  }

  async getCreatorLiveStreams(creatorId: string): Promise<LiveStream[]> {
    try {
      const { data, error } = await supabase
        .from('live_streams')
        .select('*')
        .eq('creator_id', creatorId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching creator streams:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching creator streams:', error);
      return [];
    }
  }

  async getCurrentLiveStreams(): Promise<LiveStream[]> {
    try {
      const { data, error } = await supabase
        .from('live_streams')
        .select('*')
        .eq('status', 'live')
        .order('started_at', { ascending: false });

      if (error) {
        console.error('Error fetching current live streams:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching current live streams:', error);
      return [];
    }
  }

  async getStreamMessages(streamId: string, limit: number = 50): Promise<LiveStreamMessage[]> {
    try {
      const { data, error } = await supabase
        .from('live_stream_messages')
        .select('*')
        .eq('stream_id', streamId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching messages:', error);
        return [];
      }

      return (data || []).reverse();
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  private async updateStreamStats(streamId: string): Promise<void> {
    try {
      const { count: currentViewers } = await supabase
        .from('live_stream_viewers')
        .select('*', { count: 'exact', head: true })
        .eq('stream_id', streamId)
        .is('left_at', null);

      const { count: totalViewers } = await supabase
        .from('live_stream_viewers')
        .select('user_id', { count: 'exact', head: true })
        .eq('stream_id', streamId);

      const { data: stream } = await supabase
        .from('live_streams')
        .select('peak_viewers, started_at')
        .eq('id', streamId)
        .single();

      if (stream) {
        const newPeakViewers = Math.max(stream.peak_viewers, currentViewers || 0);

        let duration = 0;
        if (stream.started_at) {
          const startTime = new Date(stream.started_at);
          const now = new Date();
          duration = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        }

        await supabase
          .from('live_streams')
          .update({
            peak_viewers: newPeakViewers,
            total_viewers: totalViewers || 0,
            average_viewers: (currentViewers || 0),
            duration_seconds: duration
          })
          .eq('id', streamId);
      }
    } catch (error) {
      console.error('Error updating stream stats:', error);
    }
  }

  private async updateAllViewersAsLeft(streamId: string): Promise<void> {
    try {
      const { data: viewers } = await supabase
        .from('live_stream_viewers')
        .select('*')
        .eq('stream_id', streamId)
        .is('left_at', null);

      if (viewers) {
        const now = new Date();
        for (const viewer of viewers) {
          const joinedAt = new Date(viewer.joined_at);
          const duration = Math.floor((now.getTime() - joinedAt.getTime()) / 1000);

          await supabase
            .from('live_stream_viewers')
            .update({
              left_at: now.toISOString(),
              watch_duration_seconds: duration
            })
            .eq('id', viewer.id);
        }
      }
    } catch (error) {
      console.error('Error updating viewers as left:', error);
    }
  }

  private generateStreamKey(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = 'live_';
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  }

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    } else if (minutes > 0) {
      return `${minutes}min ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }
}

export const liveStreamService = new LiveStreamService();
