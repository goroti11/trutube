/*
  # Gaming Leaderboards and Arena Fund
  
  ## Tables
  1. gaming_live_sessions - Gaming live stream sessions
  2. gaming_stream_stats - Real-time gaming stream statistics
  3. gaming_leaderboards - Optimized leaderboard system
  4. arena_fund - TruCoins sponsor system
  5. arena_transactions - Arena fund transaction log
  
  ## Features
  - Optimized queries for leaderboards
  - Transparent arena fund tracking
  - Automatic contribution system
*/

-- Gaming live sessions
CREATE TABLE IF NOT EXISTS gaming_live_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id uuid NOT NULL REFERENCES live_streams(id) ON DELETE CASCADE,
  game_id uuid NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  streamer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode text NOT NULL DEFAULT 'casual' CHECK (mode IN ('casual', 'competitive', 'tournament')),
  tournament_id uuid REFERENCES gaming_tournaments(id) ON DELETE SET NULL,
  season_id uuid REFERENCES gaming_seasons(id) ON DELETE SET NULL,
  enable_leaderboard boolean DEFAULT false,
  enable_trucoins_boost boolean DEFAULT true,
  anti_cheat_reported boolean DEFAULT false,
  viewers_count integer DEFAULT 0,
  peak_viewers integer DEFAULT 0,
  trucoins_generated bigint DEFAULT 0,
  trucoins_to_arena bigint DEFAULT 0,
  gifts_received integer DEFAULT 0,
  boost_count integer DEFAULT 0,
  session_data jsonb DEFAULT '{}',
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gaming_live_sessions_stream ON gaming_live_sessions(stream_id);
CREATE INDEX IF NOT EXISTS idx_gaming_live_sessions_game ON gaming_live_sessions(game_id);
CREATE INDEX IF NOT EXISTS idx_gaming_live_sessions_streamer ON gaming_live_sessions(streamer_id);
CREATE INDEX IF NOT EXISTS idx_gaming_live_sessions_tournament ON gaming_live_sessions(tournament_id) WHERE tournament_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_gaming_live_sessions_season ON gaming_live_sessions(season_id) WHERE season_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_gaming_live_sessions_active ON gaming_live_sessions(game_id, viewers_count DESC) WHERE ended_at IS NULL;

-- Gaming stream stats (real-time aggregation)
CREATE TABLE IF NOT EXISTS gaming_stream_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES gaming_live_sessions(id) ON DELETE CASCADE,
  timestamp timestamptz DEFAULT now(),
  viewers integer DEFAULT 0,
  trucoins_received bigint DEFAULT 0,
  gifts_count integer DEFAULT 0,
  engagement_score decimal(10,2) DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_gaming_stream_stats_session ON gaming_stream_stats(session_id, timestamp DESC);

-- Gaming leaderboards (optimized)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'gaming_leaderboards'
  ) THEN
    CREATE TABLE gaming_leaderboards (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      game_id uuid NOT NULL REFERENCES games(id) ON DELETE CASCADE,
      season_id uuid REFERENCES gaming_seasons(id) ON DELETE CASCADE,
      user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
      team_id uuid REFERENCES gaming_teams(id) ON DELETE CASCADE,
      leaderboard_type text NOT NULL CHECK (leaderboard_type IN ('individual', 'team', 'seasonal')),
      score bigint DEFAULT 0,
      wins integer DEFAULT 0,
      losses integer DEFAULT 0,
      draws integer DEFAULT 0,
      total_matches integer DEFAULT 0,
      trucoins_earned bigint DEFAULT 0,
      trucoins_spent bigint DEFAULT 0,
      performance_score decimal(10,2) DEFAULT 0,
      rank integer,
      previous_rank integer,
      tier text,
      badges jsonb DEFAULT '[]',
      stats jsonb DEFAULT '{}',
      last_match_at timestamptz,
      updated_at timestamptz DEFAULT now(),
      created_at timestamptz DEFAULT now(),
      CHECK (user_id IS NOT NULL OR team_id IS NOT NULL)
    );
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_gaming_leaderboards_game_season ON gaming_leaderboards(game_id, season_id, score DESC);
CREATE INDEX IF NOT EXISTS idx_gaming_leaderboards_user ON gaming_leaderboards(user_id, game_id);
CREATE INDEX IF NOT EXISTS idx_gaming_leaderboards_team ON gaming_leaderboards(team_id, game_id);
CREATE INDEX IF NOT EXISTS idx_gaming_leaderboards_type ON gaming_leaderboards(leaderboard_type, game_id, score DESC);
CREATE INDEX IF NOT EXISTS idx_gaming_leaderboards_rank ON gaming_leaderboards(game_id, season_id, rank) WHERE rank IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_gaming_leaderboards_unique_user ON gaming_leaderboards(game_id, season_id, user_id, leaderboard_type) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_gaming_leaderboards_unique_team ON gaming_leaderboards(game_id, season_id, team_id, leaderboard_type) WHERE team_id IS NOT NULL;

-- Arena fund (sponsor system)
CREATE TABLE IF NOT EXISTS arena_fund (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id uuid REFERENCES gaming_seasons(id) ON DELETE SET NULL,
  current_balance bigint DEFAULT 0,
  total_contributions bigint DEFAULT 0,
  total_distributed bigint DEFAULT 0,
  contribution_percentage integer DEFAULT 10,
  last_distribution_at timestamptz,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_arena_fund_season ON arena_fund(season_id);

-- Arena transactions
CREATE TABLE IF NOT EXISTS arena_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  arena_fund_id uuid NOT NULL REFERENCES arena_fund(id) ON DELETE CASCADE,
  transaction_type text NOT NULL CHECK (transaction_type IN ('contribution', 'distribution', 'adjustment')),
  amount bigint NOT NULL,
  source_type text NOT NULL CHECK (source_type IN ('tournament_entry', 'gaming_boost', 'gift', 'sponsorship', 'prize_payout', 'admin')),
  source_id uuid,
  reference_type text,
  reference_id uuid,
  description text,
  processed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_arena_transactions_fund ON arena_transactions(arena_fund_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_arena_transactions_type ON arena_transactions(transaction_type, source_type);
CREATE INDEX IF NOT EXISTS idx_arena_transactions_source ON arena_transactions(source_type, source_id);

-- RLS Policies
ALTER TABLE gaming_live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaming_stream_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaming_leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE arena_fund ENABLE ROW LEVEL SECURITY;
ALTER TABLE arena_transactions ENABLE ROW LEVEL SECURITY;

-- Gaming live sessions
DROP POLICY IF EXISTS "Anyone can view gaming sessions" ON gaming_live_sessions;
CREATE POLICY "Anyone can view gaming sessions"
  ON gaming_live_sessions FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Streamers can create sessions" ON gaming_live_sessions;
CREATE POLICY "Streamers can create sessions"
  ON gaming_live_sessions FOR INSERT
  TO authenticated
  WITH CHECK (streamer_id = auth.uid());

DROP POLICY IF EXISTS "Streamers can update own sessions" ON gaming_live_sessions;
CREATE POLICY "Streamers can update own sessions"
  ON gaming_live_sessions FOR UPDATE
  TO authenticated
  USING (streamer_id = auth.uid())
  WITH CHECK (streamer_id = auth.uid());

-- Gaming stream stats (read only for users)
DROP POLICY IF EXISTS "Anyone can view stream stats" ON gaming_stream_stats;
CREATE POLICY "Anyone can view stream stats"
  ON gaming_stream_stats FOR SELECT
  USING (true);

-- Gaming leaderboards (public read)
DROP POLICY IF EXISTS "Anyone can view leaderboards" ON gaming_leaderboards;
CREATE POLICY "Anyone can view leaderboards"
  ON gaming_leaderboards FOR SELECT
  USING (true);

-- Arena fund (public read)
DROP POLICY IF EXISTS "Anyone can view arena fund" ON arena_fund;
CREATE POLICY "Anyone can view arena fund"
  ON arena_fund FOR SELECT
  USING (true);

-- Arena transactions (public read)
DROP POLICY IF EXISTS "Anyone can view arena transactions" ON arena_transactions;
CREATE POLICY "Anyone can view arena transactions"
  ON arena_transactions FOR SELECT
  USING (true);

-- Trigger for arena fund balance
CREATE OR REPLACE FUNCTION update_arena_fund_balance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.transaction_type = 'contribution' THEN
    UPDATE arena_fund 
    SET current_balance = current_balance + NEW.amount,
        total_contributions = total_contributions + NEW.amount,
        updated_at = now()
    WHERE id = NEW.arena_fund_id;
  ELSIF NEW.transaction_type = 'distribution' THEN
    UPDATE arena_fund 
    SET current_balance = GREATEST(0, current_balance - NEW.amount),
        total_distributed = total_distributed + NEW.amount,
        last_distribution_at = now(),
        updated_at = now()
    WHERE id = NEW.arena_fund_id;
  ELSIF NEW.transaction_type = 'adjustment' THEN
    UPDATE arena_fund 
    SET current_balance = current_balance + NEW.amount,
        updated_at = now()
    WHERE id = NEW.arena_fund_id;
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_arena_fund_balance_trigger ON arena_transactions;
CREATE TRIGGER update_arena_fund_balance_trigger
  AFTER INSERT ON arena_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_arena_fund_balance();