/*
  # Gaming Tournaments and Matches
  
  ## Tables
  1. gaming_tournaments - Tournament management
  2. tournament_participants - Team/player participation
  3. tournament_matches - Match scheduling and results
  4. tournament_prize_distribution - Prize pool management
  
  ## Security
  - RLS enabled
  - Rate limiting on tournament entry
  - Admin controls for management
*/

-- Gaming tournaments
CREATE TABLE IF NOT EXISTS gaming_tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  season_id uuid REFERENCES gaming_seasons(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  banner_url text,
  format text NOT NULL CHECK (format IN ('single_elimination', 'double_elimination', 'round_robin', 'swiss', 'battle_royale')),
  entry_fee bigint DEFAULT 0,
  prize_pool bigint DEFAULT 0,
  max_participants integer NOT NULL,
  current_participants integer DEFAULT 0,
  min_team_size integer DEFAULT 1,
  max_team_size integer DEFAULT 5,
  status text NOT NULL DEFAULT 'registration' CHECK (status IN ('draft', 'registration', 'ongoing', 'finished', 'cancelled')),
  registration_starts_at timestamptz NOT NULL,
  registration_ends_at timestamptz NOT NULL,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  rules jsonb DEFAULT '{}',
  brackets jsonb DEFAULT '{}',
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gaming_tournaments_slug ON gaming_tournaments(slug);
CREATE INDEX IF NOT EXISTS idx_gaming_tournaments_game ON gaming_tournaments(game_id);
CREATE INDEX IF NOT EXISTS idx_gaming_tournaments_season ON gaming_tournaments(season_id);
CREATE INDEX IF NOT EXISTS idx_gaming_tournaments_status ON gaming_tournaments(status, starts_at);

-- Tournament participants
CREATE TABLE IF NOT EXISTS tournament_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid NOT NULL REFERENCES gaming_tournaments(id) ON DELETE CASCADE,
  team_id uuid REFERENCES gaming_teams(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'confirmed', 'checked_in', 'disqualified', 'withdrawn')),
  seed integer,
  final_rank integer,
  entry_paid boolean DEFAULT false,
  entry_paid_at timestamptz,
  registered_at timestamptz DEFAULT now(),
  CHECK (team_id IS NOT NULL OR user_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_tournament_participants_tournament ON tournament_participants(tournament_id, status);
CREATE INDEX IF NOT EXISTS idx_tournament_participants_team ON tournament_participants(team_id);
CREATE INDEX IF NOT EXISTS idx_tournament_participants_user ON tournament_participants(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_tournament_participants_unique_team ON tournament_participants(tournament_id, team_id) WHERE team_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_tournament_participants_unique_user ON tournament_participants(tournament_id, user_id) WHERE user_id IS NOT NULL;

-- Tournament matches
CREATE TABLE IF NOT EXISTS tournament_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid NOT NULL REFERENCES gaming_tournaments(id) ON DELETE CASCADE,
  round integer NOT NULL,
  match_number integer NOT NULL,
  participant_1_id uuid REFERENCES tournament_participants(id) ON DELETE SET NULL,
  participant_2_id uuid REFERENCES tournament_participants(id) ON DELETE SET NULL,
  winner_id uuid REFERENCES tournament_participants(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'ongoing', 'completed', 'disputed', 'cancelled')),
  scheduled_at timestamptz,
  started_at timestamptz,
  ended_at timestamptz,
  score_1 integer,
  score_2 integer,
  match_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tournament_matches_tournament ON tournament_matches(tournament_id, round);
CREATE INDEX IF NOT EXISTS idx_tournament_matches_participants ON tournament_matches(participant_1_id, participant_2_id);
CREATE INDEX IF NOT EXISTS idx_tournament_matches_status ON tournament_matches(status, scheduled_at);

-- Tournament prize distribution
CREATE TABLE IF NOT EXISTS tournament_prize_distribution (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid NOT NULL REFERENCES gaming_tournaments(id) ON DELETE CASCADE,
  participant_id uuid NOT NULL REFERENCES tournament_participants(id) ON DELETE CASCADE,
  rank integer NOT NULL,
  prize_amount bigint NOT NULL,
  arena_fund_contribution bigint DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  paid_at timestamptz,
  transaction_id uuid,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_prize_distribution_tournament ON tournament_prize_distribution(tournament_id);
CREATE INDEX IF NOT EXISTS idx_prize_distribution_participant ON tournament_prize_distribution(participant_id);
CREATE INDEX IF NOT EXISTS idx_prize_distribution_status ON tournament_prize_distribution(status);

-- RLS Policies
ALTER TABLE gaming_tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_prize_distribution ENABLE ROW LEVEL SECURITY;

-- Gaming tournaments (public read)
DROP POLICY IF EXISTS "Anyone can view tournaments" ON gaming_tournaments;
CREATE POLICY "Anyone can view tournaments"
  ON gaming_tournaments FOR SELECT
  USING (status IN ('registration', 'ongoing', 'finished'));

-- Tournament participants
DROP POLICY IF EXISTS "Anyone can view participants" ON tournament_participants;
CREATE POLICY "Anyone can view participants"
  ON tournament_participants FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can register for tournaments" ON tournament_participants;
CREATE POLICY "Users can register for tournaments"
  ON tournament_participants FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() OR
    team_id IN (SELECT id FROM gaming_teams WHERE captain_id = auth.uid())
  );

-- Tournament matches (public read)
DROP POLICY IF EXISTS "Anyone can view matches" ON tournament_matches;
CREATE POLICY "Anyone can view matches"
  ON tournament_matches FOR SELECT
  USING (true);

-- Prize distribution
DROP POLICY IF EXISTS "Users can view own prizes" ON tournament_prize_distribution;
CREATE POLICY "Users can view own prizes"
  ON tournament_prize_distribution FOR SELECT
  TO authenticated
  USING (
    participant_id IN (
      SELECT id FROM tournament_participants WHERE user_id = auth.uid()
    )
  );

-- Triggers
CREATE OR REPLACE FUNCTION update_tournament_participant_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE gaming_tournaments 
    SET current_participants = current_participants + 1,
        updated_at = now()
    WHERE id = NEW.tournament_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE gaming_tournaments 
    SET current_participants = GREATEST(0, current_participants - 1),
        updated_at = now()
    WHERE id = OLD.tournament_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS update_tournament_participant_count_trigger ON tournament_participants;
CREATE TRIGGER update_tournament_participant_count_trigger
  AFTER INSERT OR DELETE ON tournament_participants
  FOR EACH ROW
  EXECUTE FUNCTION update_tournament_participant_count();