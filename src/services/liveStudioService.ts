import { supabase } from '../lib/supabase';

export interface LiveStream {
  id: string;
  creator_id: string;
  title: string;
  description: string | null;
  category: string | null;
  thumbnail_url: string | null;
  stream_key: string;
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  mode: 'public' | 'premium' | 'private';
  trucoin_price: number;
  max_viewers: number;
  bitrate_max: number;
  orientation: 'landscape' | 'portrait' | 'auto';
  multi_camera: boolean;
  stream_delay: number;
  auto_replay: boolean;
  auto_flow_generation: boolean;
  scheduled_start: string | null;
  actual_start: string | null;
  actual_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface LiveGift {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
  icon: string;
  tier: 'micro' | 'pack' | 'status' | 'cinema';
  category: string;
  price_trucoins: number;
  rarity_score: number;
  status_boost: number;
  animation_url: string | null;
  sound_url: string | null;
  duration_seconds: number;
  requires_voice_announcement: boolean;
  grants_temporary_badge: boolean;
  badge_duration_seconds: number;
}

export interface GiftPack {
  id: string;
  name: string;
  display_name: string;
  description: string;
  pack_type: 'bronze' | 'gold' | 'legendary' | 'limited_edition';
  icon: string;
  base_price: number;
  discount_percentage: number;
  final_price: number;
  contents: any;
  bonus_items: any;
  includes_exclusive_badge: boolean;
  includes_vip_access: boolean;
}

export interface GameSession {
  id: string;
  stream_id: string;
  game_type: 'quiz' | 'duel' | 'wheel' | 'boss' | 'poll' | 'duel_live' | 'quiz_fan' | 'community_challenge' | 'live_draw';
  title: string;
  description: string | null;
  config: Record<string, any>;
  status: 'waiting' | 'active' | 'ended' | 'cancelled';
  min_bet: number;
  max_participants: number;
  current_participants: number;
  prize_pool: number;
  duration_seconds: number;
  started_at: string | null;
  ended_at: string | null;
  winner_ids: string[] | null;
}

export interface CommunityChallenge {
  id: string;
  stream_id: string;
  title: string;
  description: string;
  challenge_type: string;
  goal_type: string;
  goal_amount: number;
  current_amount: number;
  status: 'pending' | 'active' | 'completed' | 'failed' | 'expired';
  reward_description: string | null;
  expires_at: string | null;
  completed_at: string | null;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  score: number;
  metadata: Record<string, any>;
  profiles?: {
    username: string;
    display_name: string;
    avatar_url: string;
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'legendary';
  rarity_score: number;
}

export const liveStudioService = {
  // Stream Management
  async createStream(params: {
    title: string;
    description?: string;
    category?: string;
    mode?: 'public' | 'premium' | 'private';
    trucoin_price?: number;
    scheduled_start?: string;
  }) {
    const { data, error } = await supabase.rpc('rpc_create_live_stream', {
      p_title: params.title,
      p_description: params.description || null,
      p_category: params.category || null,
      p_mode: params.mode || 'public',
      p_trucoin_price: params.trucoin_price || 0,
      p_scheduled_start: params.scheduled_start || null,
    });

    if (error) throw error;
    return data;
  },

  async startStream(streamId: string) {
    const { data, error } = await supabase.rpc('rpc_start_live_stream', {
      p_stream_id: streamId,
    });

    if (error) throw error;
    return data;
  },

  async endStream(streamId: string) {
    const { data, error } = await supabase.rpc('rpc_end_live_stream', {
      p_stream_id: streamId,
    });

    if (error) throw error;
    return data;
  },

  // Gifts Management
  async getGiftCatalog(tier?: string) {
    let query = supabase
      .from('live_gift_catalog')
      .select('*')
      .eq('is_active', true)
      .order('price_trucoins', { ascending: true });

    if (tier) {
      query = query.eq('tier', tier);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as LiveGift[];
  },

  async getGiftPacks() {
    const { data, error } = await supabase
      .from('live_gift_packs')
      .select('*')
      .eq('is_active', true)
      .order('final_price', { ascending: true });

    if (error) throw error;
    return data as GiftPack[];
  },

  async purchaseGiftPack(packId: string, streamId?: string) {
    const { data, error } = await supabase.rpc('rpc_purchase_gift_pack', {
      p_pack_id: packId,
      p_stream_id: streamId || null,
    });

    if (error) throw error;
    return data;
  },

  // Game Management
  async startGameSession(streamId: string, gameType: string, title: string, config: Record<string, any> = {}) {
    const { data, error } = await supabase.rpc('rpc_start_game_session', {
      p_stream_id: streamId,
      p_game_type: gameType,
      p_title: title,
      p_config: config,
    });

    if (error) throw error;
    return data;
  },

  async joinGame(sessionId: string, betAmount: number = 10) {
    const { data, error } = await supabase.rpc('rpc_join_game', {
      p_session_id: sessionId,
      p_bet_amount: betAmount,
    });

    if (error) throw error;
    return data;
  },

  async submitGameAction(sessionId: string, actionType: string, actionData: Record<string, any>) {
    const { data, error } = await supabase.rpc('rpc_submit_game_action', {
      p_session_id: sessionId,
      p_action_type: actionType,
      p_action_data: actionData,
    });

    if (error) throw error;
    return data;
  },

  async getActiveGames(streamId: string) {
    const { data, error } = await supabase
      .from('live_game_sessions')
      .select('*')
      .eq('stream_id', streamId)
      .in('status', ['waiting', 'active'])
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as GameSession[];
  },

  // Community Challenges
  async createChallenge(
    streamId: string,
    title: string,
    description: string,
    challengeType: string,
    goalType: string,
    goalAmount: number
  ) {
    const { data, error } = await supabase.rpc('rpc_create_community_challenge', {
      p_stream_id: streamId,
      p_title: title,
      p_description: description,
      p_challenge_type: challengeType,
      p_goal_type: goalType,
      p_goal_amount: goalAmount,
    });

    if (error) throw error;
    return data;
  },

  async contributeToChallenge(challengeId: string, amount: number) {
    const { data, error } = await supabase.rpc('rpc_contribute_to_challenge', {
      p_challenge_id: challengeId,
      p_contribution_amount: amount,
    });

    if (error) throw error;
    return data;
  },

  async getActiveChallenges(streamId: string) {
    const { data, error } = await supabase
      .from('live_community_challenges')
      .select('*')
      .eq('stream_id', streamId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as CommunityChallenge[];
  },

  // Leaderboards
  async updateLeaderboard(streamId: string, category: string, userId: string, score: number) {
    const { data, error } = await supabase.rpc('rpc_update_leaderboard', {
      p_stream_id: streamId,
      p_category: category,
      p_user_id: userId,
      p_score: score,
    });

    if (error) throw error;
    return data;
  },

  async getLeaderboard(streamId: string, category: string, limit: number = 10) {
    const { data, error } = await supabase
      .from('live_leaderboard_entries')
      .select(`
        *,
        profiles:user_id(username, display_name, avatar_url)
      `)
      .eq('leaderboard_id', streamId)
      .order('rank', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data as LeaderboardEntry[];
  },

  // Badges
  async getBadges() {
    const { data, error } = await supabase
      .from('live_badges')
      .select('*')
      .eq('is_active', true)
      .order('rarity_score', { ascending: false });

    if (error) throw error;
    return data as Badge[];
  },

  async getUserBadges(userId: string) {
    const { data, error } = await supabase
      .from('user_earned_badges')
      .select(`
        *,
        badges:badge_id(name, description, icon, tier, rarity_score)
      `)
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Eligibility Check
  async checkLiveEligibility() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase.rpc('check_creator_live_eligibility', {
      p_creator_id: user.id,
    });

    if (error) throw error;
    return data;
  },

  // Premiere Events
  async createPremiere(params: {
    title: string;
    description: string;
    premiereMode: string;
    contentType: string;
    contentUrl?: string;
    accessPrice?: number;
    scheduledAt: string;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('live_premiere_events')
      .insert({
        creator_id: user.id,
        ...params,
        premiere_mode: params.premiereMode,
        content_type: params.contentType,
        content_url: params.contentUrl,
        access_price: params.accessPrice || 0,
        scheduled_at: params.scheduledAt,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async registerForPremiere(premiereId: string, isVip: boolean = false) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('live_premiere_attendees')
      .insert({
        premiere_id: premiereId,
        user_id: user.id,
        has_vip_access: isVip,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUpcomingPremieres(limit: number = 10) {
    const { data, error } = await supabase
      .from('live_premiere_events')
      .select('*, profiles:creator_id(username, display_name, avatar_url)')
      .gte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data;
  },
};
