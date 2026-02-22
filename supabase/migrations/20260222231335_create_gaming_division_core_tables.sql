/*
  # GOROTI Gaming Division - Core Tables
  
  ## Tables
  1. game_publishers - Official game publishers and developers
  2. games - Enhanced games catalog with publisher info
  3. gaming_rules_acceptance - User acceptance of gaming policies
  4. gaming_seasons - Seasonal competitive system
  5. gaming_teams - Team management system
  6. gaming_team_members - Team membership with roles
  
  ## Security
  - RLS enabled on all tables
  - Users can only modify their own data
  - Admins can manage tournaments
  - Team captains can manage their teams
*/

-- Game publishers
CREATE TABLE IF NOT EXISTS game_publishers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  logo_url text,
  website text,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_game_publishers_slug ON game_publishers(slug);
CREATE INDEX IF NOT EXISTS idx_game_publishers_verified ON game_publishers(verified) WHERE verified = true;

-- Update games table with publisher
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'games' AND column_name = 'publisher_id'
  ) THEN
    ALTER TABLE games ADD COLUMN publisher_id uuid REFERENCES game_publishers(id) ON DELETE SET NULL;
    CREATE INDEX idx_games_publisher ON games(publisher_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'games' AND column_name = 'is_competitive'
  ) THEN
    ALTER TABLE games ADD COLUMN is_competitive boolean DEFAULT false;
    ALTER TABLE games ADD COLUMN anti_cheat_enabled boolean DEFAULT false;
    ALTER TABLE games ADD COLUMN min_players integer DEFAULT 1;
    ALTER TABLE games ADD COLUMN max_players integer DEFAULT 100;
    CREATE INDEX idx_games_competitive ON games(is_competitive) WHERE is_competitive = true;
  END IF;
END $$;

-- Gaming rules acceptance
CREATE TABLE IF NOT EXISTS gaming_rules_acceptance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rule_type text NOT NULL CHECK (rule_type IN ('anti_cheat', 'fair_play', 'prize_transparency', 'license_compliance')),
  version text NOT NULL,
  accepted_at timestamptz DEFAULT now(),
  ip_address text,
  UNIQUE(user_id, rule_type, version)
);

CREATE INDEX IF NOT EXISTS idx_gaming_rules_user ON gaming_rules_acceptance(user_id);
CREATE INDEX IF NOT EXISTS idx_gaming_rules_type ON gaming_rules_acceptance(rule_type, version);

-- Gaming seasons
CREATE TABLE IF NOT EXISTS gaming_seasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  season_number integer NOT NULL,
  description text,
  banner_url text,
  status text NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'ended')),
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  reward_pool bigint DEFAULT 0,
  rewards_distributed boolean DEFAULT false,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gaming_seasons_slug ON gaming_seasons(slug);
CREATE INDEX IF NOT EXISTS idx_gaming_seasons_status ON gaming_seasons(status, starts_at DESC);
CREATE INDEX IF NOT EXISTS idx_gaming_seasons_number ON gaming_seasons(season_number DESC);

-- Gaming teams
CREATE TABLE IF NOT EXISTS gaming_teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  tag text,
  logo_url text,
  banner_url text,
  description text,
  captain_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  season_id uuid REFERENCES gaming_seasons(id) ON DELETE SET NULL,
  verified boolean DEFAULT false,
  is_active boolean DEFAULT true,
  total_members integer DEFAULT 1,
  max_members integer DEFAULT 5,
  total_wins integer DEFAULT 0,
  total_losses integer DEFAULT 0,
  total_draws integer DEFAULT 0,
  ranking_points bigint DEFAULT 0,
  trucoins_earned bigint DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gaming_teams_slug ON gaming_teams(slug);
CREATE INDEX IF NOT EXISTS idx_gaming_teams_captain ON gaming_teams(captain_id);
CREATE INDEX IF NOT EXISTS idx_gaming_teams_season ON gaming_teams(season_id);
CREATE INDEX IF NOT EXISTS idx_gaming_teams_ranking ON gaming_teams(is_active, ranking_points DESC) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_gaming_teams_verified ON gaming_teams(verified) WHERE verified = true;

-- Gaming team members
CREATE TABLE IF NOT EXISTS gaming_team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES gaming_teams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('captain', 'co_captain', 'member')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive', 'kicked')),
  joined_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(team_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_gaming_team_members_team ON gaming_team_members(team_id, status);
CREATE INDEX IF NOT EXISTS idx_gaming_team_members_user ON gaming_team_members(user_id, status);

-- RLS Policies
ALTER TABLE game_publishers ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaming_rules_acceptance ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaming_seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaming_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaming_team_members ENABLE ROW LEVEL SECURITY;

-- Game publishers (public read)
DROP POLICY IF EXISTS "Anyone can view publishers" ON game_publishers;
CREATE POLICY "Anyone can view publishers"
  ON game_publishers FOR SELECT
  USING (true);

-- Gaming rules acceptance
DROP POLICY IF EXISTS "Users can view own rules" ON gaming_rules_acceptance;
CREATE POLICY "Users can view own rules"
  ON gaming_rules_acceptance FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can accept rules" ON gaming_rules_acceptance;
CREATE POLICY "Users can accept rules"
  ON gaming_rules_acceptance FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Gaming seasons (public read)
DROP POLICY IF EXISTS "Anyone can view seasons" ON gaming_seasons;
CREATE POLICY "Anyone can view seasons"
  ON gaming_seasons FOR SELECT
  USING (true);

-- Gaming teams
DROP POLICY IF EXISTS "Anyone can view active teams" ON gaming_teams;
CREATE POLICY "Anyone can view active teams"
  ON gaming_teams FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Users can create teams" ON gaming_teams;
CREATE POLICY "Users can create teams"
  ON gaming_teams FOR INSERT
  TO authenticated
  WITH CHECK (captain_id = auth.uid());

DROP POLICY IF EXISTS "Captains can update teams" ON gaming_teams;
CREATE POLICY "Captains can update teams"
  ON gaming_teams FOR UPDATE
  TO authenticated
  USING (captain_id = auth.uid())
  WITH CHECK (captain_id = auth.uid());

-- Gaming team members
DROP POLICY IF EXISTS "Team members can view team" ON gaming_team_members;
CREATE POLICY "Team members can view team"
  ON gaming_team_members FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    team_id IN (SELECT id FROM gaming_teams WHERE captain_id = auth.uid())
  );

DROP POLICY IF EXISTS "Captains can manage members" ON gaming_team_members;
CREATE POLICY "Captains can manage members"
  ON gaming_team_members FOR ALL
  TO authenticated
  USING (
    team_id IN (SELECT id FROM gaming_teams WHERE captain_id = auth.uid())
  )
  WITH CHECK (
    team_id IN (SELECT id FROM gaming_teams WHERE captain_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can join teams" ON gaming_team_members;
CREATE POLICY "Users can join teams"
  ON gaming_team_members FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Triggers
CREATE OR REPLACE FUNCTION update_team_member_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'active' THEN
    UPDATE gaming_teams 
    SET total_members = total_members + 1,
        updated_at = now()
    WHERE id = NEW.team_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.status != 'active' AND NEW.status = 'active' THEN
    UPDATE gaming_teams 
    SET total_members = total_members + 1,
        updated_at = now()
    WHERE id = NEW.team_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.status = 'active' AND NEW.status != 'active' THEN
    UPDATE gaming_teams 
    SET total_members = GREATEST(0, total_members - 1),
        updated_at = now()
    WHERE id = NEW.team_id;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'active' THEN
    UPDATE gaming_teams 
    SET total_members = GREATEST(0, total_members - 1),
        updated_at = now()
    WHERE id = OLD.team_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS update_team_member_count_trigger ON gaming_team_members;
CREATE TRIGGER update_team_member_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON gaming_team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_team_member_count();