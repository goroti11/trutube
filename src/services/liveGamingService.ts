import { supabase } from '../lib/supabase';

export interface Game {
  id: string;
  name: string;
  slug: string;
  description?: string;
  genre: string;
  cover_url?: string;
  banner_url?: string;
  thumbnail_url?: string;
  category_id?: string;
  is_active: boolean;
  total_streams: number;
  total_viewers: number;
  trucoins_generated: number;
  supports_competitive: boolean;
  supports_tournaments: boolean;
}

export interface LiveGameSession {
  id: string;
  streamer_id: string;
  game_id: string;
  title: string;
  mode: 'casual' | 'competitive' | 'tournament';
  is_ranked: boolean;
  trucoin_bonus_enabled: boolean;
  status: 'active' | 'ended';
  started_at: string;
  ended_at?: string;
}

export interface GamingCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  display_order: number;
  is_featured: boolean;
}

export interface TopGame {
  id: string;
  name: string;
  slug: string;
  cover_url?: string;
  genre: string;
  active_streams: number;
  total_viewers: number;
  trucoins_generated: number;
  all_time_viewers: number;
}

export interface GameEffect {
  id: string;
  effect_name: string;
  effect_type: string;
  trigger_gift_tier?: string;
  trigger_trucoin_amount?: number;
  duration_seconds: number;
  visual_config: Record<string, any>;
  audio_config: Record<string, any>;
}

class LiveGamingService {
  async getTopGames(limit = 20): Promise<Game[]> {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('is_active', true)
      .order('total_viewers', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  async getActiveGamingSessions(gameId?: string): Promise<any[]> {
    let query = supabase
      .from('gaming_live_sessions')
      .select(`
        *,
        game:game_id (
          id,
          name,
          slug,
          cover_url
        ),
        streamer:streamer_id (
          id,
          username,
          avatar_url,
          is_verified
        )
      `)
      .eq('status', 'active');

    if (gameId) {
      query = query.eq('game_id', gameId);
    }

    const { data, error } = await query;
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

  async getGameBySlug(slug: string): Promise<Game | null> {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async getGamingCategories(): Promise<GamingCategory[]> {
    const { data, error } = await supabase
      .from('gaming_categories')
      .select('*')
      .order('display_order');

    if (error) throw error;
    return data || [];
  }

  async getGamesByCategory(categorySlug: string, limit = 20): Promise<Game[]> {
    const { data: category } = await supabase
      .from('gaming_categories')
      .select('id')
      .eq('slug', categorySlug)
      .maybeSingle();

    if (!category) return [];

    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('category_id', category.id)
      .eq('is_active', true)
      .order('total_viewers', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  async startGamingSession(streamerId: string, gameId: string, title: string, options: {
    mode?: 'casual' | 'competitive' | 'tournament';
    isRanked?: boolean;
    trucoinBonusEnabled?: boolean;
    tournamentId?: string;
  } = {}) {
    const { data, error } = await supabase
      .from('gaming_live_sessions')
      .insert([{
        streamer_id: streamerId,
        game_id: gameId,
        title,
        mode: options.mode || 'casual',
        is_ranked: options.isRanked || false,
        trucoin_bonus_enabled: options.trucoinBonusEnabled !== false,
        tournament_id: options.tournamentId,
        status: 'active',
        started_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    await supabase
      .from('games')
      .update({ total_streams: supabase.raw('total_streams + 1') })
      .eq('id', gameId);

    return data;
  }

  async endGamingSession(sessionId: string) {
    const { error } = await supabase
      .from('gaming_live_sessions')
      .update({
        status: 'ended',
        ended_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (error) throw error;
  }

  async getGameLeaderboard(gameId: string, season = 'season_1', limit = 100) {
    const { data, error } = await supabase
      .from('game_leaderboard')
      .select(`
        *,
        user:user_id (
          id,
          username,
          avatar_url,
          is_verified
        )
      `)
      .eq('game_id', gameId)
      .eq('season', season)
      .order('score', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  async getGamingEffects(gameId?: string): Promise<GameEffect[]> {
    const { data, error } = await supabase
      .from('gaming_effect_library')
      .select('*')
      .eq('is_active', true)
      .order('trigger_trucoin_amount', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async triggerGamingEffect(sessionId: string, effectId: string, triggeredBy: string, trucoinAmount: number) {
    const { data: effect } = await supabase
      .from('gaming_effect_library')
      .select('*')
      .eq('id', effectId)
      .single();

    if (!effect) throw new Error('Effect not found');

    const { error } = await supabase
      .from('game_interactions')
      .insert([{
        session_id: sessionId,
        user_id: triggeredBy,
        interaction_type: effect.effect_type,
        trucoins_amount: trucoinAmount,
        effect_data: {
          effect_id: effectId,
          effect_name: effect.effect_name,
          visual_config: effect.visual_config,
          audio_config: effect.audio_config,
          duration_seconds: effect.duration_seconds
        }
      }]);

    if (error) throw error;

    return effect;
  }

  async recordGameInteraction(sessionId: string, userId: string, type: string, trucoinAmount: number, effectData: any = {}) {
    const { error } = await supabase
      .from('game_interactions')
      .insert([{
        session_id: sessionId,
        user_id: userId,
        interaction_type: type,
        trucoins_amount: trucoinAmount,
        effect_data: effectData
      }]);

    if (error) throw error;
  }

  async getSessionStats(sessionId: string) {
    const { data, error } = await supabase
      .from('gaming_stream_stats')
      .select('*')
      .eq('session_id', sessionId)
      .order('recorded_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async updateGameStats(gameId: string, viewersDelta: number, trucoinsDelta: number) {
    const { error } = await supabase
      .from('games')
      .update({
        total_viewers: supabase.raw(`total_viewers + ${viewersDelta}`),
        trucoins_generated: supabase.raw(`trucoins_generated + ${trucoinsDelta}`)
      })
      .eq('id', gameId);

    if (error) throw error;
  }

  async getTournaments(gameId?: string, status?: string) {
    let query = supabase
      .from('game_tournaments')
      .select(`
        *,
        game:game_id (
          id,
          name,
          slug,
          cover_url
        )
      `);

    if (gameId) query = query.eq('game_id', gameId);
    if (status) query = query.eq('status', status);

    query = query.order('starts_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async searchGames(query: string, limit = 20): Promise<Game[]> {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,genre.ilike.%${query}%`)
      .eq('is_active', true)
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  subscribeToGameSession(sessionId: string, callback: (event: any) => void) {
    const channel = supabase
      .channel(`gaming_session:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_interactions',
          filter: `session_id=eq.${sessionId}`
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}

export const liveGamingService = new LiveGamingService();
