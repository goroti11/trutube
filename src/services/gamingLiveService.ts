import { supabase } from '../lib/supabase';
import { LiveStream } from './liveService';

export interface Game {
  id: string;
  name: string;
  description?: string;
  publisher_id?: string;
  genre: string;
  thumbnail_url?: string;
  is_active: boolean;
  supports_competitive: boolean;
  supports_tournaments: boolean;
  supports_leaderboards: boolean;
  created_at: string;
  updated_at: string;
}

export interface GamingLiveSession {
  id: string;
  live_stream_id: string;
  streamer_id: string;
  game_id: string;
  title: string;
  mode: 'casual' | 'competitive' | 'tournament';
  is_ranked: boolean;
  anti_cheat_enabled: boolean;
  trucoin_bonus_enabled: boolean;
  tournament_id?: string;
  status: 'active' | 'ended';
  started_at: string;
  ended_at?: string;
}

export interface GamingSessionStats {
  id: string;
  session_id: string;
  viewer_count: number;
  peak_viewers: number;
  trucoins_earned: number;
  gifts_received: number;
  duration_minutes: number;
  recorded_at: string;
}

export interface ActiveGamingSession {
  session_id: string;
  live_stream_id: string;
  streamer_id: string;
  streamer_username: string;
  streamer_display_name: string;
  game_id: string;
  game_name: string;
  title: string;
  mode: string;
  is_ranked: boolean;
  viewer_count: number;
  peak_viewers: number;
  started_at: string;
  thumbnail_url?: string;
}

export interface CreateGamingLiveStreamParams {
  game_id: string;
  title: string;
  description?: string;
  mode?: 'casual' | 'competitive' | 'tournament';
  is_ranked?: boolean;
  anti_cheat_enabled?: boolean;
  trucoin_bonus_enabled?: boolean;
  tournament_id?: string;
  universe_id?: string;
  sub_universe_id?: string;
}

export interface CreateGamingLiveStreamResult {
  live_stream_id: string;
  gaming_session_id: string;
  stream_key: string;
  rtmp_url: string;
}

class GamingLiveService {
  async createGamingLiveStream(params: CreateGamingLiveStreamParams): Promise<CreateGamingLiveStreamResult> {
    const { data, error } = await supabase.rpc('create_gaming_live_stream', {
      p_game_id: params.game_id,
      p_title: params.title,
      p_description: params.description,
      p_mode: params.mode || 'casual',
      p_is_ranked: params.is_ranked || false,
      p_anti_cheat_enabled: params.anti_cheat_enabled !== false,
      p_trucoin_bonus_enabled: params.trucoin_bonus_enabled || false,
      p_tournament_id: params.tournament_id,
      p_universe_id: params.universe_id,
      p_sub_universe_id: params.sub_universe_id,
    });

    if (error) throw error;
    return data;
  }

  async startGamingLiveStream(liveStreamId: string): Promise<void> {
    const { error } = await supabase.rpc('start_gaming_live_stream', {
      p_live_stream_id: liveStreamId,
    });

    if (error) throw error;
  }

  async endGamingLiveStream(liveStreamId: string): Promise<void> {
    const { error } = await supabase.rpc('end_gaming_live_stream', {
      p_live_stream_id: liveStreamId,
    });

    if (error) throw error;
  }

  async getActiveGamingSessions(gameId?: string, limit = 50): Promise<ActiveGamingSession[]> {
    const { data, error } = await supabase.rpc('get_active_gaming_sessions', {
      p_game_id: gameId,
      p_limit: limit,
    });

    if (error) throw error;
    return data || [];
  }

  async getGamingSessionById(sessionId: string): Promise<GamingLiveSession | null> {
    const { data, error } = await supabase
      .from('gaming_live_sessions')
      .select('*')
      .eq('id', sessionId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async getGamingSessionByLiveStreamId(liveStreamId: string): Promise<GamingLiveSession | null> {
    const { data, error } = await supabase
      .from('gaming_live_sessions')
      .select('*')
      .eq('live_stream_id', liveStreamId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async getGamingSessionStats(sessionId: string): Promise<GamingSessionStats[]> {
    const { data, error } = await supabase
      .from('gaming_stream_stats')
      .select('*')
      .eq('session_id', sessionId)
      .order('recorded_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async updateGamingSessionStats(sessionId: string): Promise<void> {
    const { error } = await supabase.rpc('update_gaming_session_stats', {
      p_session_id: sessionId,
    });

    if (error) throw error;
  }

  async getActiveGames(limit = 50): Promise<Game[]> {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('is_active', true)
      .order('name')
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  async getGameById(gameId: string): Promise<Game | null> {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('id', gameId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async searchGames(query: string, limit = 20): Promise<Game[]> {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('is_active', true)
      .ilike('name', `%${query}%`)
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  subscribeToGamingSession(sessionId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`gaming_session:${sessionId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'gaming_live_sessions',
        filter: `id=eq.${sessionId}`,
      }, callback)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'gaming_stream_stats',
        filter: `session_id=eq.${sessionId}`,
      }, callback)
      .subscribe();
  }
}

export const gamingLiveService = new GamingLiveService();
