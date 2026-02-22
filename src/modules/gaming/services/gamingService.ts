import { supabase } from '../../../lib/supabase';
import type {
  Game,
  GamingSeason,
  GamingTeam,
  GamingTournament,
  GamingLeaderboard,
  GamingLiveSession,
  ArenaFund,
  ArenaTransaction,
  TournamentParticipant,
  GamingRulesAcceptance
} from '../types';

class GamingService {
  async getGames(options: {
    category?: string;
    is_competitive?: boolean;
    search?: string;
    limit?: number;
  } = {}): Promise<Game[]> {
    try {
      let query = supabase
        .from('games')
        .select('*, publisher:game_publishers(*)')
        .eq('is_active', true);

      if (options.category) {
        query = query.eq('category', options.category);
      }

      if (options.is_competitive !== undefined) {
        query = query.eq('is_competitive', options.is_competitive);
      }

      if (options.search) {
        query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`);
      }

      query = query.order('total_viewers', { ascending: false });

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as Game[];
    } catch (error) {
      console.error('Error fetching games:', error);
      return [];
    }
  }

  async getGame(slugOrId: string): Promise<Game | null> {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*, publisher:game_publishers(*)')
        .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching game:', error);
      return null;
    }
  }

  async getActiveSeasons(): Promise<GamingSeason[]> {
    try {
      const { data, error } = await supabase
        .from('gaming_seasons')
        .select('*')
        .in('status', ['upcoming', 'active'])
        .order('starts_at', { ascending: false });

      if (error) throw error;
      return (data || []) as GamingSeason[];
    } catch (error) {
      console.error('Error fetching seasons:', error);
      return [];
    }
  }

  async getCurrentSeason(): Promise<GamingSeason | null> {
    try {
      const { data, error } = await supabase
        .from('gaming_seasons')
        .select('*')
        .eq('status', 'active')
        .order('starts_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching current season:', error);
      return null;
    }
  }

  async getTeams(options: {
    season_id?: string;
    verified?: boolean;
    limit?: number;
  } = {}): Promise<GamingTeam[]> {
    try {
      let query = supabase
        .from('gaming_teams')
        .select(`
          *,
          captain:profiles!captain_id(id, username, avatar_url),
          season:gaming_seasons(*)
        `)
        .eq('is_active', true);

      if (options.season_id) {
        query = query.eq('season_id', options.season_id);
      }

      if (options.verified !== undefined) {
        query = query.eq('verified', options.verified);
      }

      query = query.order('ranking_points', { ascending: false });

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as GamingTeam[];
    } catch (error) {
      console.error('Error fetching teams:', error);
      return [];
    }
  }

  async getTeam(slugOrId: string): Promise<GamingTeam | null> {
    try {
      const { data, error } = await supabase
        .from('gaming_teams')
        .select(`
          *,
          captain:profiles!captain_id(id, username, avatar_url),
          season:gaming_seasons(*),
          members:gaming_team_members(
            *,
            user:profiles(id, username, avatar_url)
          )
        `)
        .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching team:', error);
      return null;
    }
  }

  async createTeam(team: {
    name: string;
    slug: string;
    tag?: string;
    description?: string;
    season_id?: string;
    max_members?: number;
  }): Promise<{ success: boolean; data?: GamingTeam; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { success: false, error: 'Not authenticated' };

      const { data, error } = await supabase
        .from('gaming_teams')
        .insert({
          ...team,
          captain_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      await supabase
        .from('gaming_team_members')
        .insert({
          team_id: data.id,
          user_id: user.id,
          role: 'captain',
          status: 'active'
        });

      return { success: true, data };
    } catch (error: any) {
      console.error('Error creating team:', error);
      return { success: false, error: error.message };
    }
  }

  async getTournaments(options: {
    game_id?: string;
    season_id?: string;
    status?: string;
    limit?: number;
  } = {}): Promise<GamingTournament[]> {
    try {
      let query = supabase
        .from('gaming_tournaments')
        .select(`
          *,
          game:games(*),
          season:gaming_seasons(*)
        `);

      if (options.game_id) {
        query = query.eq('game_id', options.game_id);
      }

      if (options.season_id) {
        query = query.eq('season_id', options.season_id);
      }

      if (options.status) {
        query = query.eq('status', options.status);
      }

      query = query.order('starts_at', { ascending: false });

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as GamingTournament[];
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      return [];
    }
  }

  async getTournament(slugOrId: string): Promise<GamingTournament | null> {
    try {
      const { data, error } = await supabase
        .from('gaming_tournaments')
        .select(`
          *,
          game:games(*),
          season:gaming_seasons(*)
        `)
        .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching tournament:', error);
      return null;
    }
  }

  async enterTournament(
    tournamentId: string,
    teamId?: string
  ): Promise<{ success: boolean; error?: string; participant_id?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { success: false, error: 'Not authenticated' };

      const { data, error } = await supabase.rpc('rpc_enter_tournament', {
        p_tournament_id: tournamentId,
        p_team_id: teamId || null,
        p_user_id: user.id
      });

      if (error) throw error;

      if (data && typeof data === 'object' && 'success' in data) {
        return data as { success: boolean; error?: string; participant_id?: string };
      }

      return { success: false, error: 'Invalid response' };
    } catch (error: any) {
      console.error('Error entering tournament:', error);
      return { success: false, error: error.message };
    }
  }

  async getLeaderboard(options: {
    game_id?: string;
    season_id?: string;
    leaderboard_type?: 'individual' | 'team' | 'seasonal';
    limit?: number;
  } = {}): Promise<GamingLeaderboard[]> {
    try {
      let query = supabase
        .from('gaming_leaderboards')
        .select(`
          *,
          user:profiles!user_id(id, username, avatar_url),
          team:gaming_teams!team_id(*),
          game:games(*),
          season:gaming_seasons(*)
        `);

      if (options.game_id) {
        query = query.eq('game_id', options.game_id);
      }

      if (options.season_id) {
        query = query.eq('season_id', options.season_id);
      }

      if (options.leaderboard_type) {
        query = query.eq('leaderboard_type', options.leaderboard_type);
      }

      query = query.order('rank', { ascending: true, nullsFirst: false });

      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as GamingLeaderboard[];
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
  }

  async getActiveSessions(gameId?: string): Promise<GamingLiveSession[]> {
    try {
      let query = supabase
        .from('gaming_live_sessions')
        .select(`
          *,
          game:games(*),
          tournament:gaming_tournaments(*),
          season:gaming_seasons(*),
          streamer:profiles!streamer_id(id, username, avatar_url)
        `)
        .is('ended_at', null);

      if (gameId) {
        query = query.eq('game_id', gameId);
      }

      query = query.order('viewers_count', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as GamingLiveSession[];
    } catch (error) {
      console.error('Error fetching active sessions:', error);
      return [];
    }
  }

  async getArenaFund(seasonId?: string): Promise<ArenaFund | null> {
    try {
      let query = supabase
        .from('arena_fund')
        .select('*, season:gaming_seasons(*)');

      if (seasonId) {
        query = query.eq('season_id', seasonId);
      }

      query = query.order('created_at', { ascending: false }).limit(1);

      const { data, error } = await query.maybeSingle();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching arena fund:', error);
      return null;
    }
  }

  async getArenaTransactions(
    fundId: string,
    limit: number = 50
  ): Promise<ArenaTransaction[]> {
    try {
      const { data, error } = await supabase
        .from('arena_transactions')
        .select('*')
        .eq('arena_fund_id', fundId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []) as ArenaTransaction[];
    } catch (error) {
      console.error('Error fetching arena transactions:', error);
      return [];
    }
  }

  async checkRulesAcceptance(userId: string): Promise<{
    anti_cheat: boolean;
    fair_play: boolean;
    prize_transparency: boolean;
    license_compliance: boolean;
  }> {
    try {
      const { data, error } = await supabase
        .from('gaming_rules_acceptance')
        .select('rule_type, version')
        .eq('user_id', userId);

      if (error) throw error;

      const accepted = {
        anti_cheat: false,
        fair_play: false,
        prize_transparency: false,
        license_compliance: false
      };

      (data || []).forEach((rule: GamingRulesAcceptance) => {
        accepted[rule.rule_type] = true;
      });

      return accepted;
    } catch (error) {
      console.error('Error checking rules acceptance:', error);
      return {
        anti_cheat: false,
        fair_play: false,
        prize_transparency: false,
        license_compliance: false
      };
    }
  }

  async acceptRule(
    ruleType: 'anti_cheat' | 'fair_play' | 'prize_transparency' | 'license_compliance',
    version: string = '1.0'
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { success: false, error: 'Not authenticated' };

      const { error } = await supabase
        .from('gaming_rules_acceptance')
        .insert({
          user_id: user.id,
          rule_type: ruleType,
          version
        });

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Error accepting rule:', error);
      return { success: false, error: error.message };
    }
  }

  subscribeToActiveSessions(gameId: string, callback: (session: GamingLiveSession) => void) {
    const channel = supabase
      .channel(`gaming-sessions:${gameId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'gaming_live_sessions',
          filter: `game_id=eq.${gameId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            callback(payload.new as GamingLiveSession);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }

  subscribeToTournament(tournamentId: string, callback: (tournament: GamingTournament) => void) {
    const channel = supabase
      .channel(`tournament:${tournamentId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'gaming_tournaments',
          filter: `id=eq.${tournamentId}`
        },
        (payload) => {
          callback(payload.new as GamingTournament);
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
