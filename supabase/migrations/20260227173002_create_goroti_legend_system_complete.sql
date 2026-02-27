/*
  # Goroti Legend System - Complete Architecture
  
  3-Pillar Composite Scoring System:
  - Performance Verified (60%)
  - Community Vote Weighted (20%)
  - Editorial Validation (20%)
  
  Features:
  - 4 Legend levels (I, II, III, IV)
  - Multiple categories (Video, Music, Gaming, Live, Culture)
  - Anti-manipulation voting
  - Regional legends
  - Dynamic level changes
  - Complete audit trail
*/

-- Legend Categories
CREATE TABLE IF NOT EXISTS legend_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_key text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  icon_name text,
  color_primary text,
  color_secondary text,
  created_at timestamptz DEFAULT now()
);

-- Legend Registry (Main Table)
CREATE TABLE IF NOT EXISTS legend_registry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL CHECK (entity_type IN ('video', 'music', 'gaming', 'live', 'community', 'tournament')),
  entity_id uuid NOT NULL,
  category_id uuid NOT NULL REFERENCES legend_categories(id) ON DELETE CASCADE,
  level integer NOT NULL CHECK (level BETWEEN 1 AND 4),
  status text DEFAULT 'candidate' CHECK (status IN ('candidate', 'active', 'downgraded', 'revoked')),
  
  -- Composite Score Components
  performance_score numeric DEFAULT 0 CHECK (performance_score BETWEEN 0 AND 100),
  community_score numeric DEFAULT 0 CHECK (community_score BETWEEN 0 AND 100),
  editorial_score numeric DEFAULT 0 CHECK (editorial_score BETWEEN 0 AND 100),
  composite_score numeric GENERATED ALWAYS AS (
    (performance_score * 0.6) + (community_score * 0.2) + (editorial_score * 0.2)
  ) STORED,
  
  -- Verified Metrics
  verified_views bigint DEFAULT 0,
  verified_engagement numeric DEFAULT 0,
  verified_trucoins bigint DEFAULT 0,
  account_age_days integer DEFAULT 0,
  retention_rate numeric DEFAULT 0,
  risk_score numeric DEFAULT 0,
  
  -- Metadata
  reason text,
  granted_by text DEFAULT 'system' CHECK (granted_by IN ('system', 'admin', 'community')),
  granted_at timestamptz DEFAULT now(),
  is_revoked boolean DEFAULT false,
  revoked_at timestamptz,
  revoked_reason text,
  
  -- Regional
  region text,
  country_code text,
  
  -- Tracking
  last_calculated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(entity_type, entity_id, category_id)
);

CREATE INDEX IF NOT EXISTS idx_legend_registry_entity ON legend_registry(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_legend_registry_level ON legend_registry(level DESC, composite_score DESC);
CREATE INDEX IF NOT EXISTS idx_legend_registry_status ON legend_registry(status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_legend_registry_category ON legend_registry(category_id, status);
CREATE INDEX IF NOT EXISTS idx_legend_registry_region ON legend_registry(region, status) WHERE region IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_legend_registry_score ON legend_registry(composite_score DESC);

-- Legend Candidates (Temporary holding before promotion)
CREATE TABLE IF NOT EXISTS legend_candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  category_id uuid NOT NULL REFERENCES legend_categories(id) ON DELETE CASCADE,
  proposed_level integer NOT NULL,
  performance_score numeric DEFAULT 0,
  voting_window_start timestamptz DEFAULT now(),
  voting_window_end timestamptz NOT NULL,
  total_votes integer DEFAULT 0,
  weighted_vote_score numeric DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'promoted', 'rejected', 'expired')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(entity_type, entity_id, category_id)
);

CREATE INDEX IF NOT EXISTS idx_legend_candidates_window ON legend_candidates(voting_window_end, status) WHERE status = 'pending';

-- Legend Votes (Community Pillar)
CREATE TABLE IF NOT EXISTS legend_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES legend_candidates(id) ON DELETE CASCADE,
  registry_id uuid REFERENCES legend_registry(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vote_type text NOT NULL CHECK (vote_type IN ('promote', 'demote', 'support')),
  vote_weight numeric NOT NULL DEFAULT 1.0,
  trucoins_staked bigint DEFAULT 0,
  user_trupower_score bigint DEFAULT 0,
  user_account_age_days integer DEFAULT 0,
  ip_address text,
  device_fingerprint text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(candidate_id, user_id),
  UNIQUE(registry_id, user_id, vote_type)
);

CREATE INDEX IF NOT EXISTS idx_legend_votes_candidate ON legend_votes(candidate_id);
CREATE INDEX IF NOT EXISTS idx_legend_votes_registry ON legend_votes(registry_id);
CREATE INDEX IF NOT EXISTS idx_legend_votes_user ON legend_votes(user_id, created_at DESC);

-- Vote Security & Limits
CREATE TABLE IF NOT EXISTS legend_vote_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vote_date date NOT NULL DEFAULT CURRENT_DATE,
  daily_votes_used integer DEFAULT 0,
  last_vote_at timestamptz,
  is_suspended boolean DEFAULT false,
  suspension_reason text,
  suspension_until timestamptz,
  UNIQUE(user_id, vote_date)
);

CREATE INDEX IF NOT EXISTS idx_vote_limits_user ON legend_vote_limits(user_id, vote_date);

-- Vote Fraud Detection
CREATE TABLE IF NOT EXISTS legend_vote_fraud_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  candidate_id uuid REFERENCES legend_candidates(id) ON DELETE SET NULL,
  fraud_type text NOT NULL CHECK (fraud_type IN (
    'vote_farming', 'multi_account', 'ip_pattern', 'velocity_abuse',
    'trucoins_circular', 'collusion', 'suspicious_pattern'
  )),
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  details jsonb DEFAULT '{}',
  detected_at timestamptz DEFAULT now(),
  action_taken text,
  reviewed boolean DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_vote_fraud_user ON legend_vote_fraud_logs(user_id, detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_vote_fraud_severity ON legend_vote_fraud_logs(severity, reviewed);

-- Editorial Actions (Admin Pillar)
CREATE TABLE IF NOT EXISTS legend_editorial_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registry_id uuid NOT NULL REFERENCES legend_registry(id) ON DELETE CASCADE,
  action_type text NOT NULL CHECK (action_type IN ('validate', 'adjust_level', 'revoke', 'restore', 'annotate')),
  previous_level integer,
  new_level integer,
  editorial_score_adjustment numeric DEFAULT 0,
  reason text NOT NULL,
  admin_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_editorial_actions_registry ON legend_editorial_actions(registry_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_editorial_actions_admin ON legend_editorial_actions(admin_id);

-- Legend Level History (Track all changes)
CREATE TABLE IF NOT EXISTS legend_level_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registry_id uuid NOT NULL REFERENCES legend_registry(id) ON DELETE CASCADE,
  previous_level integer,
  new_level integer,
  previous_score numeric,
  new_score numeric,
  reason text,
  changed_by text,
  changed_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_level_history_registry ON legend_level_history(registry_id, changed_at DESC);

-- Regional Legends
CREATE TABLE IF NOT EXISTS legend_regional_rankings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registry_id uuid NOT NULL REFERENCES legend_registry(id) ON DELETE CASCADE,
  region text NOT NULL,
  country_code text,
  regional_rank integer,
  regional_score numeric,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(registry_id, region)
);

CREATE INDEX IF NOT EXISTS idx_regional_rankings_region ON legend_regional_rankings(region, regional_rank);

-- Hall of Legends (Top 100 Historical)
CREATE TABLE IF NOT EXISTS hall_of_legends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registry_id uuid NOT NULL REFERENCES legend_registry(id) ON DELETE CASCADE,
  historical_rank integer NOT NULL,
  peak_level integer NOT NULL,
  peak_score numeric NOT NULL,
  achievement_date timestamptz NOT NULL,
  is_current boolean DEFAULT false,
  inducted_at timestamptz DEFAULT now(),
  UNIQUE(registry_id, achievement_date)
);

CREATE INDEX IF NOT EXISTS idx_hall_rank ON hall_of_legends(historical_rank) WHERE is_current = true;
CREATE INDEX IF NOT EXISTS idx_hall_date ON hall_of_legends(achievement_date DESC);

-- Enable RLS
ALTER TABLE legend_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE legend_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE legend_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE legend_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE legend_vote_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE legend_vote_fraud_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE legend_editorial_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE legend_level_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE legend_regional_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hall_of_legends ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "categories_public_read" ON legend_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "registry_public_read" ON legend_registry FOR SELECT TO authenticated USING (true);
CREATE POLICY "candidates_public_read" ON legend_candidates FOR SELECT TO authenticated USING (true);
CREATE POLICY "votes_public_count" ON legend_votes FOR SELECT TO authenticated USING (true);
CREATE POLICY "level_history_public" ON legend_level_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "regional_rankings_public" ON legend_regional_rankings FOR SELECT TO authenticated USING (true);
CREATE POLICY "hall_public_read" ON hall_of_legends FOR SELECT TO authenticated USING (true);

-- User voting policies
CREATE POLICY "users_can_vote" ON legend_votes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_view_own_votes" ON legend_votes FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "users_view_own_limits" ON legend_vote_limits FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

-- Editorial actions (admin only - will be enforced in application logic)
CREATE POLICY "editorial_actions_read" ON legend_editorial_actions FOR SELECT
  TO authenticated USING (true);

-- Fraud logs (admin only)
CREATE POLICY "fraud_logs_admin" ON legend_vote_fraud_logs FOR SELECT
  TO authenticated USING (false);
