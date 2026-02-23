export interface GamePublisher {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  website?: string;
  verified: boolean;
  created_at: string;
}

export interface Game {
  id: string;
  name: string;
  slug: string;
  description?: string;
  cover_url?: string;
  banner_url?: string;
  category: string;
  publisher_id?: string;
  is_active: boolean;
  is_premium: boolean;
  is_competitive: boolean;
  anti_cheat_enabled: boolean;
  min_players: number;
  max_players: number;
  total_streams: number;
  total_viewers: number;
  total_trucoins_generated: number;
  tags?: string[];
  platforms?: string[];
  created_at: string;
  updated_at: string;
  publisher?: GamePublisher;
}

export interface GamingRulesAcceptance {
  id: string;
  user_id: string;
  rule_type: 'anti_cheat' | 'fair_play' | 'prize_transparency' | 'license_compliance';
  version: string;
  accepted_at: string;
  ip_address?: string;
}

export interface GamingSeason {
  id: string;
  name: string;
  slug: string;
  season_number: number;
  description?: string;
  banner_url?: string;
  status: 'upcoming' | 'active' | 'ended';
  starts_at: string;
  ends_at: string;
  reward_pool: number;
  rewards_distributed: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface GamingTeam {
  id: string;
  name: string;
  slug: string;
  tag?: string;
  logo_url?: string;
  banner_url?: string;
  description?: string;
  captain_id: string;
  season_id?: string;
  verified: boolean;
  is_active: boolean;
  total_members: number;
  max_members: number;
  total_wins: number;
  total_losses: number;
  total_draws: number;
  ranking_points: number;
  trucoins_earned: number;
  created_at: string;
  updated_at: string;
  captain?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  season?: GamingSeason;
  members?: GamingTeamMember[];
}

export interface GamingTeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'captain' | 'co_captain' | 'member';
  status: 'pending' | 'active' | 'inactive' | 'kicked';
  joined_at: string;
  updated_at: string;
  user?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}

export interface GamingTournament {
  id: string;
  game_id: string;
  season_id?: string;
  name: string;
  slug: string;
  description?: string;
  banner_url?: string;
  format: 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss' | 'battle_royale';
  entry_fee: number;
  prize_pool: number;
  max_participants: number;
  current_participants: number;
  min_team_size: number;
  max_team_size: number;
  status: 'draft' | 'registration' | 'ongoing' | 'finished' | 'cancelled';
  registration_starts_at: string;
  registration_ends_at: string;
  starts_at: string;
  ends_at?: string;
  rules: Record<string, any>;
  brackets: Record<string, any>;
  created_by?: string;
  created_at: string;
  updated_at: string;
  game?: Game;
  season?: GamingSeason;
}

export interface TournamentParticipant {
  id: string;
  tournament_id: string;
  team_id?: string;
  user_id?: string;
  status: 'registered' | 'confirmed' | 'checked_in' | 'disqualified' | 'withdrawn';
  seed?: number;
  final_rank?: number;
  entry_paid: boolean;
  entry_paid_at?: string;
  registered_at: string;
  team?: GamingTeam;
  user?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}

export interface TournamentMatch {
  id: string;
  tournament_id: string;
  round: number;
  match_number: number;
  participant_1_id?: string;
  participant_2_id?: string;
  winner_id?: string;
  status: 'pending' | 'ongoing' | 'completed' | 'disputed' | 'cancelled';
  scheduled_at?: string;
  started_at?: string;
  ended_at?: string;
  score_1?: number;
  score_2?: number;
  match_data: Record<string, any>;
  created_at: string;
  participant_1?: TournamentParticipant;
  participant_2?: TournamentParticipant;
  winner?: TournamentParticipant;
}

export interface TournamentPrizeDistribution {
  id: string;
  tournament_id: string;
  participant_id: string;
  rank: number;
  prize_amount: number;
  arena_fund_contribution: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  paid_at?: string;
  transaction_id?: string;
  created_at: string;
  participant?: TournamentParticipant;
}

export interface GamingLiveSession {
  id: string;
  stream_id: string;
  game_id: string;
  streamer_id: string;
  mode: 'casual' | 'competitive' | 'tournament';
  tournament_id?: string;
  season_id?: string;
  enable_leaderboard: boolean;
  enable_trucoins_boost: boolean;
  anti_cheat_reported: boolean;
  viewers_count: number;
  peak_viewers: number;
  trucoins_generated: number;
  trucoins_to_arena: number;
  gifts_received: number;
  boost_count: number;
  session_data: Record<string, any>;
  started_at: string;
  ended_at?: string;
  created_at: string;
  game?: Game;
  tournament?: GamingTournament;
  season?: GamingSeason;
  streamer?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}

export interface GamingStreamStats {
  id: string;
  session_id: string;
  timestamp: string;
  viewers: number;
  trucoins_received: number;
  gifts_count: number;
  engagement_score: number;
}

export interface GamingLeaderboard {
  id: string;
  game_id: string;
  season_id?: string;
  user_id?: string;
  team_id?: string;
  leaderboard_type: 'individual' | 'team' | 'seasonal';
  score: number;
  wins: number;
  losses: number;
  draws: number;
  total_matches: number;
  trucoins_earned: number;
  trucoins_spent: number;
  performance_score: number;
  rank?: number;
  previous_rank?: number;
  tier?: string;
  badges: any[];
  stats: Record<string, any>;
  last_match_at?: string;
  updated_at: string;
  created_at: string;
  user?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  team?: GamingTeam;
  game?: Game;
  season?: GamingSeason;
}

export interface ArenaFund {
  id: string;
  season_id?: string;
  current_balance: number;
  total_contributions: number;
  total_distributed: number;
  contribution_percentage: number;
  last_distribution_at?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  season?: GamingSeason;
}

export interface ArenaTransaction {
  id: string;
  arena_fund_id: string;
  transaction_type: 'contribution' | 'distribution' | 'adjustment';
  amount: number;
  source_type: 'tournament_entry' | 'gaming_boost' | 'gift' | 'sponsorship' | 'prize_payout' | 'admin';
  source_id?: string;
  reference_type?: string;
  reference_id?: string;
  description?: string;
  processed_by?: string;
  created_at: string;
}

export interface GamingStats {
  total_tournaments: number;
  active_seasons: number;
  total_teams: number;
  total_players: number;
  arena_fund_balance: number;
  total_prizes_distributed: number;
}
