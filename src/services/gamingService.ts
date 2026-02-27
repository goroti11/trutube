import { supabase } from '../lib/supabase';

export interface Game {
  id: string;
  name: string;
  description: string;
  publisher_id: string;
  genre: string;
  thumbnail_url: string;
  is_active: boolean;
  supports_competitive: boolean;
  supports_tournaments: boolean;
  supports_leaderboards: boolean;
  created_at: string;
  updated_at: string;
}

export interface GamingSeason {
  id: string;
  name: string;
  season_number: number;
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'active' | 'ended';
  prize_pool: number;
  created_at: string;
}

export interface GamingTeam {
  id: string;
  name: string;
  tag: string;
  captain_id: string;
  logo_url?: string;
  verified: boolean;
  season_id?: string;
  total_wins: number;
  total_losses: number;
  trucoins_earned: number;
  created_at: string;
}

export interface GamingTournament {
  id: string;
  name: string;
  game_id: string;
  season_id?: string;
  entry_fee: number;
  prize_pool: number;
  max_participants: number;
  tournament_format: 'single_elimination' | 'double_elimination' | 'round_robin';
  status: 'registration' | 'ongoing' | 'completed' | 'cancelled';
  start_date: string;
  end_date?: string;
  arena_fund_percentage: number;
  created_at: string;
}

export interface LeaderboardEntry {
  id: string;
  season_id: string;
  game_id: string;
  user_id?: string;
  team_id?: string;
  category: 'solo' | 'team' | 'trucoin_earnings' | 'performance_score';
  rank: number;
  score: number;
  matches_played: number;
  wins: number;
  losses: number;
  trucoins_earned: number;
  updated_at: string;
}

export interface ArenaFund {
  id: string;
  season_id: string;
  total_balance: number;
  allocated_amount: number;
  remaining_balance: number;
  last_distribution_date?: string;
  created_at: string;
  updated_at: string;
}

class GamingService {
  async getActiveGames() {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data as Game[];
  }

  async getGameById(gameId: string) {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('id', gameId)
      .maybeSingle();

    if (error) throw error;
    return data as Game | null;
  }

  async getActiveSeasons() {
    const { data, error } = await supabase
      .from('gaming_seasons')
      .select('*')
      .in('status', ['upcoming', 'active'])
      .order('start_date', { ascending: false });

    if (error) throw error;
    return data as GamingSeason[];
  }

  async getCurrentSeason() {
    const { data, error } = await supabase
      .from('gaming_seasons')
      .select('*')
      .eq('status', 'active')
      .maybeSingle();

    if (error) throw error;
    return data as GamingSeason | null;
  }

  async getTeams(seasonId?: string) {
    let query = supabase
      .from('gaming_teams')
      .select('*')
      .order('trucoins_earned', { ascending: false });

    if (seasonId) {
      query = query.eq('season_id', seasonId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as GamingTeam[];
  }

  async getTeamById(teamId: string) {
    const { data, error } = await supabase
      .from('gaming_teams')
      .select('*')
      .eq('id', teamId)
      .maybeSingle();

    if (error) throw error;
    return data as GamingTeam | null;
  }

  async getTeamMembers(teamId: string) {
    const { data, error } = await supabase
      .from('gaming_team_members')
      .select(`
        *,
        profiles:user_id (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('team_id', teamId)
      .eq('status', 'active');

    if (error) throw error;
    return data;
  }

  async createTeam(name: string, tag: string, captainId: string, seasonId?: string) {
    const { data, error } = await supabase
      .from('gaming_teams')
      .insert({
        name,
        tag,
        captain_id: captainId,
        season_id: seasonId
      })
      .select()
      .single();

    if (error) throw error;

    await supabase
      .from('gaming_team_members')
      .insert({
        team_id: data.id,
        user_id: captainId,
        role: 'captain'
      });

    return data as GamingTeam;
  }

  async getTournaments(status?: string, gameId?: string) {
    let query = supabase
      .from('gaming_tournaments')
      .select(`
        *,
        games (
          id,
          name,
          thumbnail_url
        )
      `)
      .order('start_date', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (gameId) {
      query = query.eq('game_id', gameId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  }

  async getTournamentById(tournamentId: string) {
    const { data, error } = await supabase
      .from('gaming_tournaments')
      .select(`
        *,
        games (
          id,
          name,
          thumbnail_url,
          genre
        )
      `)
      .eq('id', tournamentId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async getTournamentParticipants(tournamentId: string) {
    const { data, error } = await supabase
      .from('tournament_participants')
      .select(`
        *,
        profiles:user_id (
          id,
          username,
          avatar_url
        ),
        gaming_teams:team_id (
          id,
          name,
          tag,
          logo_url
        )
      `)
      .eq('tournament_id', tournamentId)
      .order('registered_at');

    if (error) throw error;
    return data;
  }

  async enterTournament(
    tournamentId: string,
    participantType: 'solo' | 'team',
    userId?: string,
    teamId?: string
  ) {
    const { data, error } = await supabase.rpc('rpc_enter_tournament', {
      p_tournament_id: tournamentId,
      p_participant_type: participantType,
      p_user_id: userId,
      p_team_id: teamId
    });

    if (error) throw error;
    return data;
  }

  async getLeaderboard(
    seasonId: string,
    gameId: string,
    category: 'solo' | 'team' | 'trucoin_earnings' | 'performance_score',
    limit = 100
  ) {
    const { data, error } = await supabase
      .from('gaming_leaderboards')
      .select(`
        *,
        profiles:user_id (
          id,
          username,
          avatar_url
        ),
        gaming_teams:team_id (
          id,
          name,
          tag,
          logo_url
        )
      `)
      .eq('season_id', seasonId)
      .eq('game_id', gameId)
      .eq('category', category)
      .order('rank')
      .limit(limit);

    if (error) throw error;
    return data as LeaderboardEntry[];
  }

  async getUserRank(seasonId: string, gameId: string, userId: string, category: string) {
    const { data, error } = await supabase
      .from('gaming_leaderboards')
      .select('*')
      .eq('season_id', seasonId)
      .eq('game_id', gameId)
      .eq('user_id', userId)
      .eq('category', category)
      .maybeSingle();

    if (error) throw error;
    return data as LeaderboardEntry | null;
  }

  async getArenaFund(seasonId: string) {
    const { data, error } = await supabase
      .from('arena_fund')
      .select('*')
      .eq('season_id', seasonId)
      .maybeSingle();

    if (error) throw error;
    return data as ArenaFund | null;
  }

  async getArenaTransactions(arenaFundId: string, limit = 50) {
    const { data, error } = await supabase
      .from('arena_transactions')
      .select(`
        *,
        profiles:recipient_id (
          id,
          username,
          avatar_url
        )
      `)
      .eq('arena_fund_id', arenaFundId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  async checkRulesAcceptance(userId: string) {
    const { data, error } = await supabase
      .from('gaming_rules_acceptance')
      .select('rule_type')
      .eq('user_id', userId);

    if (error) throw error;

    const acceptedRules = new Set(data.map(r => r.rule_type));
    const requiredRules = ['anti_cheat', 'fair_play', 'prize_transparency', 'license_compliance'];

    return {
      allAccepted: requiredRules.every(rule => acceptedRules.has(rule)),
      acceptedRules: Array.from(acceptedRules),
      missingRules: requiredRules.filter(rule => !acceptedRules.has(rule))
    };
  }

  async acceptRule(
    userId: string,
    ruleType: 'anti_cheat' | 'fair_play' | 'prize_transparency' | 'license_compliance',
    version: string,
    ipAddress?: string
  ) {
    const { data, error } = await supabase
      .from('gaming_rules_acceptance')
      .insert({
        user_id: userId,
        rule_type: ruleType,
        version,
        ip_address: ipAddress
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async startLiveGamingSession(
    streamerId: string,
    gameId: string,
    title: string,
    mode: 'casual' | 'competitive' | 'tournament',
    options?: {
      tournamentId?: string;
      isRanked?: boolean;
      antiCheatEnabled?: boolean;
      trucoinBonusEnabled?: boolean;
    }
  ) {
    const { data, error } = await supabase
      .from('gaming_live_sessions')
      .insert({
        streamer_id: streamerId,
        game_id: gameId,
        title,
        mode,
        tournament_id: options?.tournamentId,
        is_ranked: options?.isRanked ?? false,
        anti_cheat_enabled: options?.antiCheatEnabled ?? true,
        trucoin_bonus_enabled: options?.trucoinBonusEnabled ?? false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async endLiveGamingSession(sessionId: string) {
    const { data, error } = await supabase
      .from('gaming_live_sessions')
      .update({
        ended_at: new Date().toISOString(),
        status: 'ended'
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getActiveLiveSessions(gameId?: string) {
    let query = supabase
      .from('gaming_live_sessions')
      .select(`
        *,
        profiles:streamer_id (
          id,
          username,
          avatar_url
        ),
        games (
          id,
          name,
          thumbnail_url
        )
      `)
      .eq('status', 'active')
      .order('started_at', { ascending: false });

    if (gameId) {
      query = query.eq('game_id', gameId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  }
}

export const gamingService = new GamingService();
