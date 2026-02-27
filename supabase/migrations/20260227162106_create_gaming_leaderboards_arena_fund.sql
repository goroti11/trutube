/*
  # Gaming Leaderboards, Arena Fund, and Rules System

  ## Tables Created

  ### gaming_leaderboards
  - `id` (uuid, primary key)
  - `season_id` (uuid, foreign key)
  - `game_id` (uuid, foreign key)
  - `user_id` (uuid, foreign key to profiles)
  - `team_id` (uuid, nullable, foreign key)
  - `category` (text: solo, team, trucoin_earnings, performance_score)
  - `rank` (integer)
  - `score` (decimal)
  - `matches_played` (integer)
  - `wins` (integer)
  - `losses` (integer)
  - `trucoins_earned` (decimal)
  - `updated_at` (timestamptz)

  ### arena_fund
  - `id` (uuid, primary key)
  - `season_id` (uuid, foreign key)
  - `total_balance` (decimal)
  - `allocated_amount` (decimal)
  - `remaining_balance` (decimal)
  - `last_distribution_date` (timestamptz, nullable)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### arena_transactions
  - `id` (uuid, primary key)
  - `arena_fund_id` (uuid, foreign key)
  - `transaction_type` (text: contribution, distribution, adjustment)
  - `amount` (decimal)
  - `source_type` (text: tournament_entry, live_bonus, admin_adjustment)
  - `source_reference` (uuid, nullable)
  - `recipient_id` (uuid, nullable, foreign key to profiles)
  - `description` (text)
  - `created_at` (timestamptz)

  ### gaming_rules_acceptance
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to profiles)
  - `rule_type` (text: anti_cheat, fair_play, prize_transparency, license_compliance)
  - `version` (text)
  - `accepted_at` (timestamptz)
  - `ip_address` (text, nullable)

  ## Security
  - Enable RLS on all tables
  - Public read access for leaderboards
  - Admin-only write access for arena fund
  - Users can only accept rules for themselves
  - Transparent transaction logging

  ## Indexes
  - Composite indexes for leaderboard queries
  - Foreign key indexes
  - Transaction type and date indexes
*/

-- Gaming Leaderboards
CREATE TABLE IF NOT EXISTS gaming_leaderboards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id uuid NOT NULL REFERENCES gaming_seasons(id) ON DELETE CASCADE,
  game_id uuid NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  team_id uuid REFERENCES gaming_teams(id) ON DELETE CASCADE,
  category text NOT NULL CHECK (category IN ('solo', 'team', 'trucoin_earnings', 'performance_score')),
  rank integer NOT NULL,
  score decimal(15,2) DEFAULT 0,
  matches_played integer DEFAULT 0,
  wins integer DEFAULT 0,
  losses integer DEFAULT 0,
  trucoins_earned decimal(15,2) DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_leaderboard_entry CHECK (
    (category IN ('solo', 'trucoin_earnings', 'performance_score') AND user_id IS NOT NULL) OR
    (category = 'team' AND team_id IS NOT NULL)
  )
);

-- Arena Fund
CREATE TABLE IF NOT EXISTS arena_fund (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id uuid NOT NULL REFERENCES gaming_seasons(id) ON DELETE CASCADE,
  total_balance decimal(15,2) DEFAULT 0,
  allocated_amount decimal(15,2) DEFAULT 0,
  remaining_balance decimal(15,2) DEFAULT 0,
  last_distribution_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(season_id)
);

-- Arena Transactions
CREATE TABLE IF NOT EXISTS arena_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  arena_fund_id uuid NOT NULL REFERENCES arena_fund(id) ON DELETE CASCADE,
  transaction_type text NOT NULL CHECK (transaction_type IN ('contribution', 'distribution', 'adjustment')),
  amount decimal(15,2) NOT NULL,
  source_type text NOT NULL CHECK (source_type IN ('tournament_entry', 'live_bonus', 'admin_adjustment')),
  source_reference uuid,
  recipient_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Gaming Rules Acceptance
CREATE TABLE IF NOT EXISTS gaming_rules_acceptance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rule_type text NOT NULL CHECK (rule_type IN ('anti_cheat', 'fair_play', 'prize_transparency', 'license_compliance')),
  version text NOT NULL,
  accepted_at timestamptz DEFAULT now(),
  ip_address text,
  UNIQUE(user_id, rule_type, version)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_gaming_leaderboards_season_game ON gaming_leaderboards(season_id, game_id);
CREATE INDEX IF NOT EXISTS idx_gaming_leaderboards_category_rank ON gaming_leaderboards(category, rank);
CREATE INDEX IF NOT EXISTS idx_gaming_leaderboards_user ON gaming_leaderboards(user_id);
CREATE INDEX IF NOT EXISTS idx_gaming_leaderboards_team ON gaming_leaderboards(team_id);
CREATE INDEX IF NOT EXISTS idx_arena_fund_season ON arena_fund(season_id);
CREATE INDEX IF NOT EXISTS idx_arena_transactions_fund ON arena_transactions(arena_fund_id);
CREATE INDEX IF NOT EXISTS idx_arena_transactions_type ON arena_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_arena_transactions_source ON arena_transactions(source_type);
CREATE INDEX IF NOT EXISTS idx_arena_transactions_recipient ON arena_transactions(recipient_id);
CREATE INDEX IF NOT EXISTS idx_gaming_rules_user ON gaming_rules_acceptance(user_id);

-- Enable RLS
ALTER TABLE gaming_leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE arena_fund ENABLE ROW LEVEL SECURITY;
ALTER TABLE arena_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaming_rules_acceptance ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Gaming Leaderboards: Public read
CREATE POLICY "Anyone can view leaderboards"
  ON gaming_leaderboards FOR SELECT
  TO public
  USING (true);

-- Arena Fund: Public read
CREATE POLICY "Anyone can view arena fund"
  ON arena_fund FOR SELECT
  TO public
  USING (true);

-- Arena Transactions: Public read for transparency
CREATE POLICY "Anyone can view arena transactions"
  ON arena_transactions FOR SELECT
  TO public
  USING (true);

-- Gaming Rules Acceptance: Users can view and create own
CREATE POLICY "Users can view their own rule acceptances"
  ON gaming_rules_acceptance FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can accept rules"
  ON gaming_rules_acceptance FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);