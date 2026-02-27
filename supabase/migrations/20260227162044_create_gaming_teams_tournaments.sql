/*
  # Gaming Teams and Tournaments System

  ## Tables Created

  ### gaming_teams
  - `id` (uuid, primary key)
  - `name` (text, unique)
  - `tag` (text, unique, 2-5 chars)
  - `captain_id` (uuid, foreign key to profiles)
  - `logo_url` (text, nullable)
  - `verified` (boolean, default: false)
  - `season_id` (uuid, foreign key)
  - `total_wins` (integer, default: 0)
  - `total_losses` (integer, default: 0)
  - `trucoins_earned` (decimal, default: 0)
  - `created_at` (timestamptz)

  ### gaming_team_members
  - `id` (uuid, primary key)
  - `team_id` (uuid, foreign key)
  - `user_id` (uuid, foreign key to profiles)
  - `role` (text: captain, player, substitute)
  - `joined_at` (timestamptz)
  - `status` (text: active, inactive)

  ### gaming_tournaments
  - `id` (uuid, primary key)
  - `name` (text)
  - `game_id` (uuid, foreign key)
  - `season_id` (uuid, foreign key)
  - `entry_fee` (decimal)
  - `prize_pool` (decimal)
  - `max_participants` (integer)
  - `tournament_format` (text: single_elimination, double_elimination, round_robin)
  - `status` (text: registration, ongoing, completed, cancelled)
  - `start_date` (timestamptz)
  - `end_date` (timestamptz, nullable)
  - `arena_fund_percentage` (decimal, default: 10)
  - `created_at` (timestamptz)

  ### tournament_participants
  - `id` (uuid, primary key)
  - `tournament_id` (uuid, foreign key)
  - `participant_type` (text: solo, team)
  - `user_id` (uuid, nullable, foreign key to profiles)
  - `team_id` (uuid, nullable, foreign key)
  - `entry_paid` (boolean)
  - `rank` (integer, nullable)
  - `prize_amount` (decimal, default: 0)
  - `registered_at` (timestamptz)

  ### tournament_matches
  - `id` (uuid, primary key)
  - `tournament_id` (uuid, foreign key)
  - `round_number` (integer)
  - `match_number` (integer)
  - `participant_1_id` (uuid, foreign key)
  - `participant_2_id` (uuid, foreign key)
  - `winner_id` (uuid, nullable, foreign key)
  - `score_p1` (integer, default: 0)
  - `score_p2` (integer, default: 0)
  - `status` (text: pending, ongoing, completed, cancelled)
  - `scheduled_at` (timestamptz)
  - `completed_at` (timestamptz, nullable)

  ### tournament_prize_distribution
  - `id` (uuid, primary key)
  - `tournament_id` (uuid, foreign key)
  - `rank` (integer)
  - `percentage` (decimal)
  - `amount` (decimal)

  ## Security
  - Enable RLS on all tables
  - Users can only modify their own team memberships
  - Captains can manage their teams
  - Public read access for most data
  - Admins can manage tournaments

  ## Indexes
  - Foreign key indexes
  - Status and date indexes
  - Unique constraints for teams
*/

-- Gaming Teams
CREATE TABLE IF NOT EXISTS gaming_teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  tag text UNIQUE NOT NULL CHECK (length(tag) BETWEEN 2 AND 5),
  captain_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  logo_url text,
  verified boolean DEFAULT false,
  season_id uuid REFERENCES gaming_seasons(id) ON DELETE SET NULL,
  total_wins integer DEFAULT 0,
  total_losses integer DEFAULT 0,
  trucoins_earned decimal(15,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Gaming Team Members
CREATE TABLE IF NOT EXISTS gaming_team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES gaming_teams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('captain', 'player', 'substitute')),
  joined_at timestamptz DEFAULT now(),
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  UNIQUE(team_id, user_id)
);

-- Gaming Tournaments
CREATE TABLE IF NOT EXISTS gaming_tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  game_id uuid NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  season_id uuid REFERENCES gaming_seasons(id) ON DELETE SET NULL,
  entry_fee decimal(15,2) NOT NULL DEFAULT 0,
  prize_pool decimal(15,2) DEFAULT 0,
  max_participants integer NOT NULL,
  tournament_format text DEFAULT 'single_elimination' CHECK (tournament_format IN ('single_elimination', 'double_elimination', 'round_robin')),
  status text DEFAULT 'registration' CHECK (status IN ('registration', 'ongoing', 'completed', 'cancelled')),
  start_date timestamptz NOT NULL,
  end_date timestamptz,
  arena_fund_percentage decimal(5,2) DEFAULT 10,
  created_at timestamptz DEFAULT now()
);

-- Tournament Participants
CREATE TABLE IF NOT EXISTS tournament_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid NOT NULL REFERENCES gaming_tournaments(id) ON DELETE CASCADE,
  participant_type text NOT NULL CHECK (participant_type IN ('solo', 'team')),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  team_id uuid REFERENCES gaming_teams(id) ON DELETE CASCADE,
  entry_paid boolean DEFAULT false,
  rank integer,
  prize_amount decimal(15,2) DEFAULT 0,
  registered_at timestamptz DEFAULT now(),
  CONSTRAINT valid_participant CHECK (
    (participant_type = 'solo' AND user_id IS NOT NULL AND team_id IS NULL) OR
    (participant_type = 'team' AND team_id IS NOT NULL AND user_id IS NULL)
  ),
  UNIQUE(tournament_id, user_id),
  UNIQUE(tournament_id, team_id)
);

-- Tournament Matches
CREATE TABLE IF NOT EXISTS tournament_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid NOT NULL REFERENCES gaming_tournaments(id) ON DELETE CASCADE,
  round_number integer NOT NULL,
  match_number integer NOT NULL,
  participant_1_id uuid NOT NULL REFERENCES tournament_participants(id) ON DELETE CASCADE,
  participant_2_id uuid NOT NULL REFERENCES tournament_participants(id) ON DELETE CASCADE,
  winner_id uuid REFERENCES tournament_participants(id) ON DELETE SET NULL,
  score_p1 integer DEFAULT 0,
  score_p2 integer DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'ongoing', 'completed', 'cancelled')),
  scheduled_at timestamptz,
  completed_at timestamptz
);

-- Tournament Prize Distribution
CREATE TABLE IF NOT EXISTS tournament_prize_distribution (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid NOT NULL REFERENCES gaming_tournaments(id) ON DELETE CASCADE,
  rank integer NOT NULL,
  percentage decimal(5,2) NOT NULL,
  amount decimal(15,2) DEFAULT 0,
  UNIQUE(tournament_id, rank)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_gaming_teams_captain ON gaming_teams(captain_id);
CREATE INDEX IF NOT EXISTS idx_gaming_teams_season ON gaming_teams(season_id);
CREATE INDEX IF NOT EXISTS idx_gaming_team_members_team ON gaming_team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_gaming_team_members_user ON gaming_team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_gaming_tournaments_game ON gaming_tournaments(game_id);
CREATE INDEX IF NOT EXISTS idx_gaming_tournaments_season ON gaming_tournaments(season_id);
CREATE INDEX IF NOT EXISTS idx_gaming_tournaments_status ON gaming_tournaments(status);
CREATE INDEX IF NOT EXISTS idx_tournament_participants_tournament ON tournament_participants(tournament_id);
CREATE INDEX IF NOT EXISTS idx_tournament_participants_user ON tournament_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_tournament_participants_team ON tournament_participants(team_id);
CREATE INDEX IF NOT EXISTS idx_tournament_matches_tournament ON tournament_matches(tournament_id);
CREATE INDEX IF NOT EXISTS idx_tournament_matches_status ON tournament_matches(status);
CREATE INDEX IF NOT EXISTS idx_tournament_prize_tournament ON tournament_prize_distribution(tournament_id);

-- Enable RLS
ALTER TABLE gaming_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaming_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaming_tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_prize_distribution ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Gaming Teams: Public read, captains manage
CREATE POLICY "Anyone can view gaming teams"
  ON gaming_teams FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create teams"
  ON gaming_teams FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = captain_id);

CREATE POLICY "Captains can update their teams"
  ON gaming_teams FOR UPDATE
  TO authenticated
  USING (auth.uid() = captain_id)
  WITH CHECK (auth.uid() = captain_id);

-- Gaming Team Members: Public read, members manage own
CREATE POLICY "Anyone can view team members"
  ON gaming_team_members FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Captains can add team members"
  ON gaming_team_members FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM gaming_teams
      WHERE id = team_id AND captain_id = auth.uid()
    )
  );

CREATE POLICY "Users can leave teams"
  ON gaming_team_members FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Gaming Tournaments: Public read
CREATE POLICY "Anyone can view tournaments"
  ON gaming_tournaments FOR SELECT
  TO public
  USING (true);

-- Tournament Participants: Public read, users manage own
CREATE POLICY "Anyone can view tournament participants"
  ON tournament_participants FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can register for tournaments"
  ON tournament_participants FOR INSERT
  TO authenticated
  WITH CHECK (
    (participant_type = 'solo' AND auth.uid() = user_id) OR
    (participant_type = 'team' AND EXISTS (
      SELECT 1 FROM gaming_teams
      WHERE id = team_id AND captain_id = auth.uid()
    ))
  );

-- Tournament Matches: Public read
CREATE POLICY "Anyone can view tournament matches"
  ON tournament_matches FOR SELECT
  TO public
  USING (true);

-- Tournament Prize Distribution: Public read
CREATE POLICY "Anyone can view prize distribution"
  ON tournament_prize_distribution FOR SELECT
  TO public
  USING (true);