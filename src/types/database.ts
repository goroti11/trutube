export interface Profile {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface LegalDocument {
  id: string;
  domain: 'global' | 'live' | 'gaming' | 'wallet' | 'premium' | 'community';
  version: string;
  title: string;
  content_url?: string;
  content_md?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LegalAcceptance {
  id: string;
  user_id: string;
  document_id: string;
  accepted_at: string;
  ip_address?: string;
  device_fingerprint?: string;
}

export interface Notification {
  id: string;
  recipient_id: string;
  actor_id?: string;
  type: string;
  entity_type?: string;
  entity_id?: string;
  title: string;
  body?: string;
  data?: Record<string, unknown>;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  is_read: boolean;
  is_seen: boolean;
  created_at: string;
}

export interface NotificationPreference {
  id: string;
  user_id: string;
  domain: string;
  enabled: boolean;
  push_enabled: boolean;
  email_enabled: boolean;
}

export interface TrucoinWallet {
  user_id: string;
  balance: number;
  locked_balance: number;
  created_at: string;
  updated_at: string;
}

export interface TrucoinTransaction {
  id: string;
  user_id: string;
  amount: number;
  transaction_type: string;
  reference_type?: string;
  reference_id?: string;
  idempotency_key?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface LiveStream {
  id: string;
  creator_id: string;
  title: string;
  description?: string;
  status: 'scheduled' | 'live' | 'ended';
  is_premium: boolean;
  price_trucoins?: number;
  started_at?: string;
  ended_at?: string;
  created_at: string;
}

export interface LiveGift {
  id: string;
  name: string;
  price_trucoins: number;
  tier: number;
  commission_rate: number;
  animation_type?: string;
  image_url?: string;
  is_active: boolean;
}

export interface Game {
  id: string;
  name: string;
  slug: string;
  cover_url?: string;
  publisher?: string;
  is_active: boolean;
  created_at: string;
}

export interface GamingSeason {
  id: string;
  name: string;
  status: 'upcoming' | 'active' | 'ended';
  start_date: string;
  end_date: string;
  reward_pool_trucoins: number;
  created_at: string;
}

export interface GamingTeam {
  id: string;
  name: string;
  tag: string;
  captain_id: string;
  season_id?: string;
  logo_url?: string;
  created_at: string;
}

export interface GamingTournament {
  id: string;
  season_id?: string;
  game_id: string;
  name: string;
  description?: string;
  entry_fee_trucoins: number;
  prize_pool_trucoins: number;
  max_participants?: number;
  status: 'registration_open' | 'in_progress' | 'completed' | 'cancelled';
  start_date: string;
  end_date?: string;
  created_at: string;
}

export interface TournamentParticipant {
  id: string;
  tournament_id: string;
  user_id?: string;
  team_id?: string;
  paid: boolean;
  created_at: string;
}

export interface GamingLeaderboard {
  id: string;
  game_id: string;
  season_id?: string;
  user_id?: string;
  team_id?: string;
  score: number;
  rank?: number;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface GamingSanction {
  id: string;
  user_id: string;
  type: 'warning' | 'temporary_ban' | 'permanent_ban';
  reason: string;
  issued_by?: string;
  expires_at?: string;
  created_at: string;
  metadata?: Record<string, unknown>;
}

export interface ArenaFund {
  balance: number;
  updated_at: string;
}
