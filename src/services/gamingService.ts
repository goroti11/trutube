import { supabase } from '../lib/supabase';
import type {
  Game,
  GamingSeason,
  GamingTeam,
  GamingTournament,
  GamingLeaderboard,
  GamingSanction,
  ArenaFund,
} from '../types/database';

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

export const gamingService = {
  async getGames(): Promise<Game[]> {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async getCurrentSeason(): Promise<GamingSeason | null> {
    const { data, error } = await supabase
      .from('gaming_seasons')
      .select('*')
      .eq('status', 'active')
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getSeasons(): Promise<GamingSeason[]> {
    const { data, error } = await supabase
      .from('gaming_seasons')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getTournaments(seasonId?: string): Promise<GamingTournament[]> {
    let query = supabase
      .from('gaming_tournaments')
      .select('*, games(*)');

    if (seasonId) {
      query = query.eq('season_id', seasonId);
    }

    const { data, error } = await query.order('start_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getTournament(id: string): Promise<GamingTournament | null> {
    const { data, error } = await supabase
      .from('gaming_tournaments')
      .select('*, games(*), gaming_seasons(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async enterTournament(tournamentId: string, teamId?: string): Promise<{ success: boolean; newBalance: number }> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch(`${FUNCTIONS_URL}/gaming-tournament-enter`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tournament_id: tournamentId,
        team_id: teamId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to enter tournament');
    }

    const result = await response.json();
    return { success: result.success, newBalance: result.data.new_balance };
  },

  async getLeaderboard(gameId: string, seasonId?: string, limit = 100): Promise<GamingLeaderboard[]> {
    let query = supabase
      .from('gaming_leaderboards')
      .select('*, profiles(username, avatar_url)')
      .eq('game_id', gameId);

    if (seasonId) {
      query = query.eq('season_id', seasonId);
    }

    const { data, error } = await query
      .order('score', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  async getTeams(seasonId?: string): Promise<GamingTeam[]> {
    let query = supabase
      .from('gaming_teams')
      .select('*, profiles!gaming_teams_captain_id_fkey(username, avatar_url)');

    if (seasonId) {
      query = query.eq('season_id', seasonId);
    }

    const { data, error } = await query.order('name');

    if (error) throw error;
    return data || [];
  },

  async getTeam(id: string): Promise<GamingTeam | null> {
    const { data, error } = await supabase
      .from('gaming_teams')
      .select('*, profiles!gaming_teams_captain_id_fkey(username, avatar_url), gaming_team_members(*, profiles(username, avatar_url))')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getUserSanctions(userId: string): Promise<GamingSanction[]> {
    const { data, error } = await supabase
      .from('gaming_sanctions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async reportCheat(matchId: string, reportedUserId: string, pattern: string, details?: Record<string, unknown>): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const response = await fetch(`${FUNCTIONS_URL}/gaming-report-cheat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        match_id: matchId,
        reported_user_id: reportedUserId,
        pattern,
        details,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to report cheat');
    }
  },

  async getArenaFund(): Promise<ArenaFund | null> {
    const { data, error } = await supabase
      .from('arena_fund')
      .select('*')
      .maybeSingle();

    if (error) throw error;
    return data;
  },
};
