/*
  # Enhance Gaming System - Add Complete Competition Infrastructure
  
  Enhances existing gaming tables and adds new complete system
*/

-- Enhance existing gaming_teams
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gaming_teams' AND column_name = 'slug') THEN
    ALTER TABLE gaming_teams ADD COLUMN slug text;
    UPDATE gaming_teams SET slug = lower(replace(name, ' ', '-')) WHERE slug IS NULL;
    CREATE UNIQUE INDEX IF NOT EXISTS idx_gaming_teams_slug ON gaming_teams(slug) WHERE slug IS NOT NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gaming_teams' AND column_name = 'banner_url') THEN
    ALTER TABLE gaming_teams ADD COLUMN banner_url text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gaming_teams' AND column_name = 'team_type') THEN
    ALTER TABLE gaming_teams ADD COLUMN team_type text DEFAULT 'public';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gaming_teams' AND column_name = 'member_count') THEN
    ALTER TABLE gaming_teams ADD COLUMN member_count integer DEFAULT 1;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gaming_teams' AND column_name = 'total_tournaments') THEN
    ALTER TABLE gaming_teams ADD COLUMN total_tournaments integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gaming_teams' AND column_name = 'team_score') THEN
    ALTER TABLE gaming_teams ADD COLUMN team_score bigint DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gaming_teams' AND column_name = 'description') THEN
    ALTER TABLE gaming_teams ADD COLUMN description text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gaming_teams' AND column_name = 'recruitment_open') THEN
    ALTER TABLE gaming_teams ADD COLUMN recruitment_open boolean DEFAULT true;
  END IF;
END $$;

-- Gaming Team Members (new table)
CREATE TABLE IF NOT EXISTS gaming_team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES gaming_teams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role text DEFAULT 'player' CHECK (role IN ('captain', 'player', 'substitute', 'coach')),
  joined_at timestamptz DEFAULT now(),
  total_matches integer DEFAULT 0,
  total_wins integer DEFAULT 0,
  contribution_score bigint DEFAULT 0,
  is_active boolean DEFAULT true,
  UNIQUE(team_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_team_members_team ON gaming_team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON gaming_team_members(user_id);

-- Arena Fund
CREATE TABLE IF NOT EXISTS arena_fund (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  balance bigint DEFAULT 0,
  total_deposited bigint DEFAULT 0,
  total_distributed bigint DEFAULT 0,
  season_id uuid REFERENCES gaming_seasons(id) ON DELETE SET NULL,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS arena_fund_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fund_id uuid NOT NULL REFERENCES arena_fund(id) ON DELETE CASCADE,
  transaction_type text NOT NULL CHECK (transaction_type IN ('deposit', 'distribution', 'sponsorship', 'bonus')),
  amount bigint NOT NULL,
  source_type text CHECK (source_type IN ('platform_fee', 'tournament_entry', 'sponsorship', 'manual')),
  reference_id uuid,
  reference_type text,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_arena_transactions_fund ON arena_fund_transactions(fund_id, created_at DESC);

-- Gaming Badges
CREATE TABLE IF NOT EXISTS gaming_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  badge_type text UNIQUE NOT NULL,
  badge_name text NOT NULL,
  description text,
  icon_url text,
  badge_tier text CHECK (badge_tier IN ('standard', 'verified', 'elite', 'champion', 'legend')),
  requirements jsonb NOT NULL DEFAULT '{}',
  color_primary text DEFAULT '#6C3BFF',
  color_secondary text DEFAULT '#00E5FF',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_gaming_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id uuid NOT NULL REFERENCES gaming_badges(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  season_id uuid REFERENCES gaming_seasons(id) ON DELETE SET NULL,
  is_active boolean DEFAULT true,
  UNIQUE(user_id, badge_id, season_id)
);

CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_gaming_badges(user_id);

-- TruPower Gaming Score
CREATE TABLE IF NOT EXISTS gaming_user_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  trupower_score bigint DEFAULT 0,
  total_hours_streamed integer DEFAULT 0,
  total_trucoins_generated bigint DEFAULT 0,
  total_tournaments_won integer DEFAULT 0,
  total_tournaments_participated integer DEFAULT 0,
  viewer_engagement_score integer DEFAULT 0,
  fair_play_score integer DEFAULT 100,
  reports_count integer DEFAULT 0,
  ranking_position integer,
  tier text DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum', 'diamond', 'master', 'grandmaster')),
  last_calculated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gaming_scores_ranking ON gaming_user_scores(trupower_score DESC);

-- Anti-Fraud Detection
CREATE TABLE IF NOT EXISTS fraud_detection_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  risk_type text NOT NULL CHECK (risk_type IN (
    'multi_account', 'device_anomaly', 'ip_anomaly', 'velocity_abuse', 
    'manipulation', 'collusion', 'boosting', 'suspicious_pattern'
  )),
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  details jsonb DEFAULT '{}',
  device_fingerprint text,
  ip_address text,
  geo_location text,
  detected_at timestamptz DEFAULT now(),
  reviewed boolean DEFAULT false,
  action_taken text
);

CREATE INDEX IF NOT EXISTS idx_fraud_logs_user ON fraud_detection_logs(user_id, detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_fraud_logs_severity ON fraud_detection_logs(severity, reviewed);

-- Global Leaderboards
CREATE TABLE IF NOT EXISTS global_leaderboards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  leaderboard_type text NOT NULL CHECK (leaderboard_type IN ('global', 'regional', 'seasonal', 'alltime', 'team', 'game')),
  leaderboard_scope text NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  team_id uuid REFERENCES gaming_teams(id) ON DELETE CASCADE,
  game_id uuid REFERENCES games(id) ON DELETE CASCADE,
  season_id uuid REFERENCES gaming_seasons(id) ON DELETE CASCADE,
  region text,
  score bigint DEFAULT 0,
  rank integer,
  stats jsonb DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_global_leaderboards_type ON global_leaderboards(leaderboard_type, leaderboard_scope);
CREATE INDEX IF NOT EXISTS idx_global_leaderboards_rank ON global_leaderboards(leaderboard_type, rank);

-- Gaming Rules Acceptance
CREATE TABLE IF NOT EXISTS gaming_rules_acceptance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rule_type text NOT NULL CHECK (rule_type IN ('general', 'fair_play', 'tournament', 'anti_cheat', 'prize_pool')),
  rule_version text NOT NULL,
  accepted_at timestamptz DEFAULT now(),
  ip_address text,
  UNIQUE(user_id, rule_type, rule_version)
);

CREATE INDEX IF NOT EXISTS idx_rules_acceptance_user ON gaming_rules_acceptance(user_id);

-- Gaming Reports
CREATE TABLE IF NOT EXISTS gaming_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reported_user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  report_type text NOT NULL CHECK (report_type IN ('cheating', 'manipulation', 'toxic', 'collusion', 'boosting', 'other')),
  session_id uuid,
  tournament_id uuid,
  description text,
  evidence_urls text[],
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_gaming_reports_reported ON gaming_reports(reported_user_id, status);

-- Gaming Sanctions
CREATE TABLE IF NOT EXISTS gaming_sanctions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  sanction_type text NOT NULL CHECK (sanction_type IN ('warning', 'suspension_gaming', 'prize_freeze', 'badge_removal', 'permanent_ban')),
  reason text NOT NULL,
  report_id uuid REFERENCES gaming_reports(id) ON DELETE SET NULL,
  duration_days integer,
  starts_at timestamptz DEFAULT now(),
  ends_at timestamptz,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gaming_sanctions_user ON gaming_sanctions(user_id, is_active);

-- Tournament Prize Distribution
CREATE TABLE IF NOT EXISTS tournament_prize_distribution (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid NOT NULL REFERENCES game_tournaments(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  team_id uuid REFERENCES gaming_teams(id) ON DELETE SET NULL,
  position integer NOT NULL,
  prize_amount bigint NOT NULL,
  arena_fund_contribution bigint DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'distributed', 'disputed')),
  distributed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_prize_distribution_tournament ON tournament_prize_distribution(tournament_id);

-- Enable RLS
ALTER TABLE gaming_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE arena_fund ENABLE ROW LEVEL SECURITY;
ALTER TABLE arena_fund_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaming_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_gaming_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaming_user_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_detection_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaming_rules_acceptance ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaming_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaming_sanctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_prize_distribution ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "team_members_public_read" ON gaming_team_members FOR SELECT TO authenticated USING (true);
CREATE POLICY "arena_fund_public_read" ON arena_fund FOR SELECT TO authenticated USING (true);
CREATE POLICY "arena_transactions_public_read" ON arena_fund_transactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "badges_public_read" ON gaming_badges FOR SELECT TO authenticated USING (true);
CREATE POLICY "user_badges_public_read" ON user_gaming_badges FOR SELECT TO authenticated USING (true);
CREATE POLICY "gaming_scores_public_read" ON gaming_user_scores FOR SELECT TO authenticated USING (true);
CREATE POLICY "leaderboards_public_read" ON global_leaderboards FOR SELECT TO authenticated USING (true);
CREATE POLICY "prize_distribution_public_read" ON tournament_prize_distribution FOR SELECT TO authenticated USING (true);

CREATE POLICY "rules_acceptance_own" ON gaming_rules_acceptance FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reports_create_own" ON gaming_reports FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "sanctions_view_own" ON gaming_sanctions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
