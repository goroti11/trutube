/*
  # GOROTI Canonical Live & Gaming System
  
  ## Architecture Principles
  
  1. **ONE Live Engine**: `live_streams` is the canonical base for ALL streaming
  2. **Gaming Extends Live**: `gaming_live_sessions` extends live_streams, not replaces it
  3. **Clear Separation**: Live = streaming engine, Gaming = competitive division
  4. **Unified Replay**: All streams use same replay/dubbing pipeline
  5. **Unified Gifts**: All streams use same TruCoin/gift system
  
  ## Tables Created
  
  ### Core Live System
  - `live_streams` - Canonical streaming base (ALL streams)
  - `live_viewers` - Real-time viewer tracking
  - `live_messages` - Live chat messages
  - `live_gifts` - TruCoin gifts sent during streams
  
  ### Gaming Extension
  - `games` - Game catalog
  - `game_publishers` - Game publishers
  - `gaming_live_sessions` - Gaming-specific extension of live_streams
  - `gaming_stream_stats` - Gaming session statistics
  - `gaming_seasons` - Competitive seasons
  
  ### Gaming Competitive
  - `gaming_teams` - Competitive teams
  - `gaming_team_members` - Team rosters
  - `gaming_tournaments` - Tournament system
  - `gaming_tournament_participants` - Tournament entries
  - `gaming_matches` - Match records
  - `gaming_leaderboards` - Rankings
  - `gaming_arena_fund` - Community prize pool
  
  ## Security
  - RLS enabled on all tables
  - Public read for active content
  - Creator ownership enforced
  - Authenticated actions only
*/

-- =============================================================================
-- CORE LIVE STREAMING SYSTEM
-- =============================================================================

-- Core live_streams table (canonical base for ALL streams)
CREATE TABLE IF NOT EXISTS live_streams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Basic info
  title text NOT NULL,
  description text,
  thumbnail_url text,
  
  -- Stream configuration
  stream_type text NOT NULL CHECK (stream_type IN ('general', 'gaming', 'music', 'event', 'premiere')) DEFAULT 'general',
  access_type text NOT NULL CHECK (access_type IN ('public', 'premium', 'private', 'subscribers')) DEFAULT 'public',
  subscription_tier_required text,
  
  -- Categorization
  universe_id uuid REFERENCES universes(id) ON DELETE SET NULL,
  sub_universe_id uuid REFERENCES sub_universes(id) ON DELETE SET NULL,
  
  -- Streaming tech
  stream_key text UNIQUE NOT NULL,
  rtmp_url text,
  playback_url text,
  bitrate_kbps integer,
  orientation text CHECK (orientation IN ('landscape', 'portrait', 'square')) DEFAULT 'landscape',
  
  -- Status & lifecycle
  stream_status text NOT NULL CHECK (stream_status IN ('scheduled', 'live', 'ended', 'archived')) DEFAULT 'scheduled',
  scheduled_at timestamptz,
  started_at timestamptz,
  ended_at timestamptz,
  
  -- Metrics
  viewer_count integer DEFAULT 0,
  peak_viewers integer DEFAULT 0,
  total_gifts_received integer DEFAULT 0,
  total_trucoins_earned decimal(15,2) DEFAULT 0,
  
  -- Replay linkage
  replay_video_id uuid,
  replay_ready boolean DEFAULT false,
  
  -- Gaming extension (optional, set when gaming stream)
  gaming_session_id uuid,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_live_streams_creator ON live_streams(creator_id);
CREATE INDEX idx_live_streams_status ON live_streams(stream_status);
CREATE INDEX idx_live_streams_type ON live_streams(stream_type);
CREATE INDEX idx_live_streams_started ON live_streams(started_at DESC) WHERE started_at IS NOT NULL;
CREATE INDEX idx_live_streams_universe ON live_streams(universe_id) WHERE universe_id IS NOT NULL;
CREATE INDEX idx_live_streams_gaming_session ON live_streams(gaming_session_id) WHERE gaming_session_id IS NOT NULL;

-- Live viewers tracking
CREATE TABLE IF NOT EXISTS live_viewers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id uuid NOT NULL REFERENCES live_streams(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  left_at timestamptz,
  watch_duration_seconds integer DEFAULT 0
);

CREATE INDEX idx_live_viewers_stream ON live_viewers(stream_id);
CREATE INDEX idx_live_viewers_user ON live_viewers(user_id) WHERE user_id IS NOT NULL;

-- Live chat messages
CREATE TABLE IF NOT EXISTS live_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id uuid NOT NULL REFERENCES live_streams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  is_pinned boolean DEFAULT false,
  is_deleted boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_live_messages_stream ON live_messages(stream_id, created_at DESC);
CREATE INDEX idx_live_messages_user ON live_messages(user_id);

-- Live gifts (TruCoin gifts sent during streams)
CREATE TABLE IF NOT EXISTS live_gifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id uuid NOT NULL REFERENCES live_streams(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  gift_type text NOT NULL,
  gift_name text NOT NULL,
  trucoin_amount decimal(15,2) NOT NULL,
  message text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_live_gifts_stream ON live_gifts(stream_id, created_at DESC);
CREATE INDEX idx_live_gifts_sender ON live_gifts(sender_id);

-- =============================================================================
-- GAMING SYSTEM
-- =============================================================================

-- Game publishers
CREATE TABLE IF NOT EXISTS game_publishers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  website_url text,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Games catalog
CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  publisher_id uuid REFERENCES game_publishers(id) ON DELETE SET NULL,
  genre text NOT NULL,
  thumbnail_url text,
  is_active boolean DEFAULT true,
  supports_competitive boolean DEFAULT false,
  supports_tournaments boolean DEFAULT false,
  supports_leaderboards boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_games_publisher ON games(publisher_id);
CREATE INDEX idx_games_active ON games(is_active) WHERE is_active = true;

-- Gaming live sessions (EXTENDS live_streams)
CREATE TABLE IF NOT EXISTS gaming_live_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Link to base live stream (canonical parent)
  live_stream_id uuid UNIQUE REFERENCES live_streams(id) ON DELETE CASCADE,
  
  -- Gaming-specific fields
  streamer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  game_id uuid NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  title text NOT NULL,
  
  -- Mode & competitive settings
  mode text NOT NULL CHECK (mode IN ('casual', 'competitive', 'tournament')),
  is_ranked boolean DEFAULT false,
  anti_cheat_enabled boolean DEFAULT true,
  trucoin_bonus_enabled boolean DEFAULT false,
  
  -- Tournament linkage (if applicable)
  tournament_id uuid,
  
  -- Status
  status text DEFAULT 'active' CHECK (status IN ('active', 'ended')),
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz
);

CREATE INDEX idx_gaming_sessions_streamer ON gaming_live_sessions(streamer_id);
CREATE INDEX idx_gaming_sessions_game ON gaming_live_sessions(game_id);
CREATE INDEX idx_gaming_sessions_status ON gaming_live_sessions(status);
CREATE INDEX idx_gaming_sessions_live_stream ON gaming_live_sessions(live_stream_id);

-- Add FK from live_streams to gaming_live_sessions
ALTER TABLE live_streams 
  ADD CONSTRAINT live_streams_gaming_session_fkey
  FOREIGN KEY (gaming_session_id) REFERENCES gaming_live_sessions(id) ON DELETE SET NULL;

-- Gaming stream stats
CREATE TABLE IF NOT EXISTS gaming_stream_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES gaming_live_sessions(id) ON DELETE CASCADE,
  viewer_count integer DEFAULT 0,
  peak_viewers integer DEFAULT 0,
  trucoins_earned decimal(15,2) DEFAULT 0,
  gifts_received integer DEFAULT 0,
  duration_minutes integer DEFAULT 0,
  recorded_at timestamptz DEFAULT now()
);

CREATE INDEX idx_gaming_stats_session ON gaming_stream_stats(session_id);

-- Gaming seasons
CREATE TABLE IF NOT EXISTS gaming_seasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  season_number integer NOT NULL,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'ended')),
  prize_pool decimal(15,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_season_dates CHECK (end_date > start_date)
);

CREATE INDEX idx_gaming_seasons_status ON gaming_seasons(status);

-- =============================================================================
-- GAMING COMPETITIVE SYSTEM
-- =============================================================================

-- Gaming teams
CREATE TABLE IF NOT EXISTS gaming_teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  tag text UNIQUE NOT NULL,
  captain_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  description text,
  avatar_url text,
  is_verified boolean DEFAULT false,
  total_wins integer DEFAULT 0,
  total_losses integer DEFAULT 0,
  trucoins_earned decimal(15,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_gaming_teams_captain ON gaming_teams(captain_id);

-- Gaming team members
CREATE TABLE IF NOT EXISTS gaming_team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES gaming_teams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role text CHECK (role IN ('captain', 'co_captain', 'member', 'substitute')),
  joined_at timestamptz DEFAULT now(),
  UNIQUE(team_id, user_id)
);

CREATE INDEX idx_team_members_team ON gaming_team_members(team_id);
CREATE INDEX idx_team_members_user ON gaming_team_members(user_id);

-- Gaming tournaments
CREATE TABLE IF NOT EXISTS gaming_tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  season_id uuid REFERENCES gaming_seasons(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  format text NOT NULL CHECK (format IN ('single_elimination', 'double_elimination', 'round_robin', 'swiss')),
  max_participants integer NOT NULL,
  entry_fee_trucoins decimal(15,2) DEFAULT 0,
  prize_pool decimal(15,2) DEFAULT 0,
  registration_start timestamptz NOT NULL,
  registration_end timestamptz NOT NULL,
  tournament_start timestamptz NOT NULL,
  tournament_end timestamptz,
  status text DEFAULT 'registration' CHECK (status IN ('registration', 'ongoing', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_gaming_tournaments_game ON gaming_tournaments(game_id);
CREATE INDEX idx_gaming_tournaments_season ON gaming_tournaments(season_id);
CREATE INDEX idx_gaming_tournaments_status ON gaming_tournaments(status);

-- Add FK from gaming_live_sessions to tournaments
ALTER TABLE gaming_live_sessions
  ADD CONSTRAINT gaming_live_sessions_tournament_fkey
  FOREIGN KEY (tournament_id) REFERENCES gaming_tournaments(id) ON DELETE SET NULL;

-- Tournament participants
CREATE TABLE IF NOT EXISTS gaming_tournament_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid NOT NULL REFERENCES gaming_tournaments(id) ON DELETE CASCADE,
  participant_type text NOT NULL CHECK (participant_type IN ('solo', 'team')),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  team_id uuid REFERENCES gaming_teams(id) ON DELETE CASCADE,
  registered_at timestamptz DEFAULT now(),
  is_checked_in boolean DEFAULT false,
  placement integer,
  prize_amount decimal(15,2),
  CONSTRAINT valid_participant CHECK (
    (participant_type = 'solo' AND user_id IS NOT NULL AND team_id IS NULL) OR
    (participant_type = 'team' AND team_id IS NOT NULL AND user_id IS NULL)
  )
);

CREATE INDEX idx_tournament_participants_tournament ON gaming_tournament_participants(tournament_id);
CREATE INDEX idx_tournament_participants_user ON gaming_tournament_participants(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_tournament_participants_team ON gaming_tournament_participants(team_id) WHERE team_id IS NOT NULL;

-- Gaming matches
CREATE TABLE IF NOT EXISTS gaming_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid NOT NULL REFERENCES gaming_tournaments(id) ON DELETE CASCADE,
  round_number integer NOT NULL,
  match_number integer NOT NULL,
  participant1_id uuid NOT NULL REFERENCES gaming_tournament_participants(id) ON DELETE CASCADE,
  participant2_id uuid REFERENCES gaming_tournament_participants(id) ON DELETE CASCADE,
  winner_id uuid REFERENCES gaming_tournament_participants(id) ON DELETE SET NULL,
  score_participant1 integer,
  score_participant2 integer,
  scheduled_at timestamptz,
  started_at timestamptz,
  ended_at timestamptz,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_gaming_matches_tournament ON gaming_matches(tournament_id);
CREATE INDEX idx_gaming_matches_status ON gaming_matches(status);

-- Gaming leaderboards
CREATE TABLE IF NOT EXISTS gaming_leaderboards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  season_id uuid REFERENCES gaming_seasons(id) ON DELETE CASCADE,
  category text NOT NULL CHECK (category IN ('solo', 'team', 'trucoin_earnings', 'performance_score')),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  team_id uuid REFERENCES gaming_teams(id) ON DELETE CASCADE,
  rank integer NOT NULL,
  score decimal(15,2) NOT NULL,
  wins integer DEFAULT 0,
  losses integer DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_leaderboard_entry CHECK (
    (category IN ('solo', 'trucoin_earnings', 'performance_score') AND user_id IS NOT NULL AND team_id IS NULL) OR
    (category = 'team' AND team_id IS NOT NULL AND user_id IS NULL)
  )
);

CREATE INDEX idx_gaming_leaderboards_game ON gaming_leaderboards(game_id);
CREATE INDEX idx_gaming_leaderboards_season ON gaming_leaderboards(season_id);
CREATE INDEX idx_gaming_leaderboards_category ON gaming_leaderboards(category);
CREATE INDEX idx_gaming_leaderboards_rank ON gaming_leaderboards(rank);

-- Gaming arena fund
CREATE TABLE IF NOT EXISTS gaming_arena_fund (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_type text NOT NULL CHECK (transaction_type IN ('contribution', 'distribution', 'adjustment')),
  amount decimal(15,2) NOT NULL,
  description text,
  related_tournament_id uuid REFERENCES gaming_tournaments(id) ON DELETE SET NULL,
  related_user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  balance_after decimal(15,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_arena_fund_type ON gaming_arena_fund(transaction_type);
CREATE INDEX idx_arena_fund_created ON gaming_arena_fund(created_at DESC);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE live_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_viewers ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_publishers ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaming_live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaming_stream_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaming_seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaming_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaming_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaming_tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaming_tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaming_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaming_leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaming_arena_fund ENABLE ROW LEVEL SECURITY;

-- Live Streams Policies
CREATE POLICY "Anyone can view live streams"
  ON live_streams FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create streams"
  ON live_streams FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Creators can update own streams"
  ON live_streams FOR UPDATE
  TO authenticated
  USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());

-- Live Viewers Policies
CREATE POLICY "Anyone can view stream viewers"
  ON live_viewers FOR SELECT USING (true);

CREATE POLICY "Authenticated users can join streams"
  ON live_viewers FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Live Messages Policies
CREATE POLICY "Anyone can view live messages"
  ON live_messages FOR SELECT USING (NOT is_deleted);

CREATE POLICY "Authenticated users can send messages"
  ON live_messages FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Live Gifts Policies
CREATE POLICY "Anyone can view gifts"
  ON live_gifts FOR SELECT USING (true);

CREATE POLICY "Authenticated users can send gifts"
  ON live_gifts FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

-- Games & Publishers Policies
CREATE POLICY "Anyone can view verified publishers"
  ON game_publishers FOR SELECT USING (verified = true);

CREATE POLICY "Anyone can view active games"
  ON games FOR SELECT USING (is_active = true);

-- Gaming Sessions Policies
CREATE POLICY "Anyone can view gaming sessions"
  ON gaming_live_sessions FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create gaming sessions"
  ON gaming_live_sessions FOR INSERT
  TO authenticated
  WITH CHECK (streamer_id = auth.uid());

CREATE POLICY "Streamers can update own gaming sessions"
  ON gaming_live_sessions FOR UPDATE
  TO authenticated
  USING (streamer_id = auth.uid())
  WITH CHECK (streamer_id = auth.uid());

-- Gaming Stats Policies
CREATE POLICY "Anyone can view gaming stats"
  ON gaming_stream_stats FOR SELECT USING (true);

-- Seasons Policies
CREATE POLICY "Anyone can view gaming seasons"
  ON gaming_seasons FOR SELECT USING (true);

-- Teams Policies
CREATE POLICY "Anyone can view gaming teams"
  ON gaming_teams FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create teams"
  ON gaming_teams FOR INSERT
  TO authenticated
  WITH CHECK (captain_id = auth.uid());

CREATE POLICY "Captains can update own teams"
  ON gaming_teams FOR UPDATE
  TO authenticated
  USING (captain_id = auth.uid())
  WITH CHECK (captain_id = auth.uid());

-- Team Members Policies
CREATE POLICY "Anyone can view team members"
  ON gaming_team_members FOR SELECT USING (true);

-- Tournaments Policies
CREATE POLICY "Anyone can view tournaments"
  ON gaming_tournaments FOR SELECT USING (true);

-- Tournament Participants Policies
CREATE POLICY "Anyone can view tournament participants"
  ON gaming_tournament_participants FOR SELECT USING (true);

CREATE POLICY "Users can register for tournaments"
  ON gaming_tournament_participants FOR INSERT
  TO authenticated
  WITH CHECK (
    (participant_type = 'solo' AND user_id = auth.uid()) OR
    (participant_type = 'team' AND EXISTS (
      SELECT 1 FROM gaming_team_members
      WHERE team_id = gaming_tournament_participants.team_id
        AND user_id = auth.uid()
    ))
  );

-- Matches Policies
CREATE POLICY "Anyone can view matches"
  ON gaming_matches FOR SELECT USING (true);

-- Leaderboards Policies
CREATE POLICY "Anyone can view leaderboards"
  ON gaming_leaderboards FOR SELECT USING (true);

-- Arena Fund Policies
CREATE POLICY "Anyone can view arena fund"
  ON gaming_arena_fund FOR SELECT USING (true);