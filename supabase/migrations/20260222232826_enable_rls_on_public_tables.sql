/*
  # Enable RLS on Public Tables
  
  Enable RLS and add policies for public gaming tables
*/

-- Enable RLS on games tables
ALTER TABLE goroti_internal_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_categories ENABLE ROW LEVEL SECURITY;

-- Public read access for game categories
DROP POLICY IF EXISTS "Anyone can view game categories" ON game_categories;
CREATE POLICY "Anyone can view game categories"
  ON game_categories FOR SELECT
  USING (true);

-- Public read access for active games
DROP POLICY IF EXISTS "Anyone can view active games" ON games;
CREATE POLICY "Anyone can view active games"
  ON games FOR SELECT
  USING (is_active = true);

-- Public read access for internal games
DROP POLICY IF EXISTS "Anyone can view active internal games" ON goroti_internal_games;
CREATE POLICY "Anyone can view active internal games"
  ON goroti_internal_games FOR SELECT
  USING (is_active = true);

-- Add policy for live_game_results
ALTER TABLE live_game_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view game results" ON live_game_results;
CREATE POLICY "Anyone can view game results"
  ON live_game_results FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "System can insert results" ON live_game_results;
CREATE POLICY "System can insert results"
  ON live_game_results FOR INSERT
  TO authenticated
  WITH CHECK (true);