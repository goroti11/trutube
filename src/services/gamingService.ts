import { supabase } from '../lib/supabase';

export interface Game {
  id: string;
  name: string;
  slug: string;
  description?: string;
  cover_url?: string;
  banner_url?: string;
  category: string;
  is_active: boolean;
  is_premium: boolean;
  total_streams: number;
  total_viewers: number;
  total_trucoins_generated: number;
  tags?: string[];
  platforms?: string[];
  created_at: string;
  updated_at: string;
}

export interface GameCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  display_order: number;
  is_active: boolean;
}

export interface LiveGameSession {
  id: string;
  stream_id: string;
  game_id: string;
  streamer_id: string;
  viewers_count: number;
  peak_viewers: number;
  trucoins_generated: number;
  gifts_received: number;
  interactions_count: number;
  session_data: Record<string, any>;
  started_at: string;
  ended_at?: string;
  game?: Game;
  streamer?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}

export interface GameLeaderboard {
  id: string;
  game_id: string;
  user_id: string;
  score: number;
  wins: number;
  losses: number;
  total_matches: number;
  trucoins_earned: number;
  trucoins_spent: number;
  season: string;
  rank?: number;
  tier?: string;
  stats: Record<string, any>;
  user?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}

export interface InternalGame {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  game_type: 'quiz' | 'duel' | 'wheel' | 'boss' | 'prediction';
  min_bet: number;
  max_bet: number;
  config: Record<string, any>;
  is_active: boolean;
}

export interface InternalGameSession {
  id: string;
  game_id: string;
  stream_id?: string;
  host_id: string;
  status: 'waiting' | 'active' | 'finished' | 'cancelled';
  participants_count: number;
  total_pot: number;
  session_data: Record<string, any>;
  winner_id?: string;
  started_at?: string;
  ended_at?: string;
  game?: InternalGame;
  host?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  winner?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}

export interface GameInteraction {
  id: string;
  session_id: string;
  user_id: string;
  interaction_type: string;
  trucoins_amount: number;
  effect_data: Record<string, any>;
  created_at: string;
}

class GamingService {
  async getGames(options: {
    category?: string;
    search?: string;
    premium_only?: boolean;
    limit?: number;
  } = {}): Promise<Game[]> {
    try {
      let query = supabase
        .from('games')
        .select('*')
        .eq('is_active', true);

      if (options.category) {
        query = query.eq('category', options.category);
      }

      if (options.premium_only) {
        query = query.eq('is_premium', true);
      }

      if (options.search) {
        query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      query = query.order('total_viewers', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      return (data || []) as Game[];
    } catch (error: any) {
      console.error('Error fetching games:', error);
      return [];
    }
  }

  async getGame(slugOrId: string): Promise<Game | null> {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error fetching game:', error);
      return null;
    }
  }

  async getGameCategories(): Promise<GameCategory[]> {
    try {
      const { data, error } = await supabase
        .from('game_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      return (data || []) as GameCategory[];
    } catch (error: any) {
      console.error('Error fetching game categories:', error);
      return [];
    }
  }

  async getActiveGameSessions(gameId?: string): Promise<LiveGameSession[]> {
    try {
      let query = supabase
        .from('live_game_sessions')
        .select(`
          *,
          game:games(*),
          streamer:profiles!streamer_id(id, username, avatar_url)
        `)
        .is('ended_at', null);

      if (gameId) {
        query = query.eq('game_id', gameId);
      }

      query = query.order('viewers_count', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      return (data || []) as LiveGameSession[];
    } catch (error: any) {
      console.error('Error fetching active game sessions:', error);
      return [];
    }
  }

  async getTopGamesByViewers(limit: number = 10): Promise<Game[]> {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('is_active', true)
        .order('total_viewers', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []) as Game[];
    } catch (error: any) {
      console.error('Error fetching top games:', error);
      return [];
    }
  }

  async getGameLeaderboard(
    gameId: string,
    season: string = 'season_1',
    limit: number = 100
  ): Promise<GameLeaderboard[]> {
    try {
      const { data, error } = await supabase
        .from('game_leaderboard')
        .select(`
          *,
          user:profiles!user_id(id, username, avatar_url)
        `)
        .eq('game_id', gameId)
        .eq('season', season)
        .order('score', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []) as GameLeaderboard[];
    } catch (error: any) {
      console.error('Error fetching game leaderboard:', error);
      return [];
    }
  }

  async getInternalGames(): Promise<InternalGame[]> {
    try {
      const { data, error } = await supabase
        .from('goroti_internal_games')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return (data || []) as InternalGame[];
    } catch (error: any) {
      console.error('Error fetching internal games:', error);
      return [];
    }
  }

  async createGameInteraction(
    sessionId: string,
    interactionType: string,
    trucoinsAmount: number,
    effectData: Record<string, any> = {}
  ): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('game_interactions')
        .insert({
          session_id: sessionId,
          user_id: user.id,
          interaction_type: interactionType,
          trucoins_amount: trucoinsAmount,
          effect_data: effectData
        });

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Error creating game interaction:', error);
      return false;
    }
  }

  async getSessionInteractions(
    sessionId: string,
    limit: number = 50
  ): Promise<GameInteraction[]> {
    try {
      const { data, error } = await supabase
        .from('game_interactions')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []) as GameInteraction[];
    } catch (error: any) {
      console.error('Error fetching session interactions:', error);
      return [];
    }
  }

  async getGameStats(gameId: string): Promise<{
    total_sessions: number;
    total_viewers: number;
    total_trucoins: number;
    active_streams: number;
  }> {
    try {
      const game = await this.getGame(gameId);
      if (!game) {
        return { total_sessions: 0, total_viewers: 0, total_trucoins: 0, active_streams: 0 };
      }

      const activeSessions = await this.getActiveGameSessions(gameId);

      return {
        total_sessions: game.total_streams,
        total_viewers: game.total_viewers,
        total_trucoins: game.total_trucoins_generated,
        active_streams: activeSessions.length
      };
    } catch (error: any) {
      console.error('Error fetching game stats:', error);
      return { total_sessions: 0, total_viewers: 0, total_trucoins: 0, active_streams: 0 };
    }
  }

  subscribeToGameSessions(gameId: string, callback: (session: LiveGameSession) => void) {
    const channel = supabase
      .channel(`game-sessions:${gameId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'live_game_sessions',
          filter: `game_id=eq.${gameId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            callback(payload.new as LiveGameSession);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }

  subscribeToGameInteractions(sessionId: string, callback: (interaction: GameInteraction) => void) {
    const channel = supabase
      .channel(`game-interactions:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'game_interactions',
          filter: `session_id=eq.${sessionId}`
        },
        (payload) => {
          callback(payload.new as GameInteraction);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }
}

export const gamingService = new GamingService();
export default gamingService;
