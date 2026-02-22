/*
  # Add Missing Gaming Tables
*/

CREATE TABLE IF NOT EXISTS game_leaderboard (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score bigint DEFAULT 0,
  wins integer DEFAULT 0,
  losses integer DEFAULT 0,
  total_matches integer DEFAULT 0,
  trucoins_earned bigint DEFAULT 0,
  trucoins_spent bigint DEFAULT 0,
  season text DEFAULT 'season_1',
  rank integer,
  tier text,
  stats jsonb DEFAULT '{}',
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_game_leaderboard_game_season ON game_leaderboard(game_id, season, score DESC);
CREATE INDEX IF NOT EXISTS idx_game_leaderboard_user ON game_leaderboard(user_id, season);
CREATE UNIQUE INDEX IF NOT EXISTS idx_game_leaderboard_unique ON game_leaderboard(game_id, user_id, season);

CREATE TABLE IF NOT EXISTS game_tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid REFERENCES games(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  banner_url text,
  prize_pool bigint DEFAULT 0,
  entry_fee bigint DEFAULT 0,
  max_participants integer,
  current_participants integer DEFAULT 0,
  status text DEFAULT 'upcoming',
  tournament_type text DEFAULT 'single_elimination',
  rules jsonb DEFAULT '{}',
  prizes jsonb DEFAULT '[]',
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_game_tournaments_game ON game_tournaments(game_id);
CREATE INDEX IF NOT EXISTS idx_game_tournaments_status ON game_tournaments(status, starts_at);

CREATE TABLE IF NOT EXISTS game_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES live_game_sessions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  interaction_type text NOT NULL,
  trucoins_amount bigint NOT NULL DEFAULT 0,
  effect_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_game_interactions_session ON game_interactions(session_id, created_at DESC);

CREATE TABLE IF NOT EXISTS internal_game_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES live_game_sessions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bet_amount bigint NOT NULL,
  win_amount bigint DEFAULT 0,
  position integer,
  is_winner boolean DEFAULT false,
  result_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_internal_game_results_session ON internal_game_results(session_id);
CREATE INDEX IF NOT EXISTS idx_internal_game_results_user ON internal_game_results(user_id, created_at DESC);

-- RLS
ALTER TABLE game_leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_game_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view leaderboard" ON game_leaderboard;
CREATE POLICY "Anyone can view leaderboard"
  ON game_leaderboard FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can view tournaments" ON game_tournaments;
CREATE POLICY "Anyone can view tournaments"
  ON game_tournaments FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can view interactions" ON game_interactions;
CREATE POLICY "Users can view interactions"
  ON game_interactions FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can create interactions" ON game_interactions;
CREATE POLICY "Users can create interactions"
  ON game_interactions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can view results" ON internal_game_results;
CREATE POLICY "Users can view results"
  ON internal_game_results FOR SELECT
  TO authenticated
  USING (true);