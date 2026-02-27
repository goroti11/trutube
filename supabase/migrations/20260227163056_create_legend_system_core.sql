/*
  # TruTube Legend System - Core Tables

  ## Tables Created

  ### legend_badges
  - `id` (uuid, primary key)
  - `name` (text) - Badge name
  - `badge_type` (text) - trending, explosion, impact, premium_hit, top_universe, legend
  - `level` (integer) - 1-5 (Rising, Breakout, Power, Elite, Legend Active)
  - `icon` (text) - Icon identifier
  - `color` (text) - Badge color theme
  - `description` (text)
  - `created_at` (timestamptz)

  ### video_legend_awards
  - `id` (uuid, primary key)
  - `video_id` (uuid, foreign key)
  - `badge_id` (uuid, foreign key)
  - `universe_id` (uuid, foreign key)
  - `period` (text) - 24h, 7d, 30d, 90d
  - `awarded_at` (timestamptz)
  - `expires_at` (timestamptz, nullable)
  - `metrics_snapshot` (jsonb) - Snapshot of metrics at time of award
  - `is_active` (boolean) - Whether badge is currently active
  - `revoked_at` (timestamptz, nullable)
  - `revoke_reason` (text, nullable)

  ### creator_tru_scores
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to profiles)
  - `universe_id` (uuid, nullable, foreign key)
  - `tru_score_weekly` (decimal) - 0-100 score based on last 7 days
  - `tru_score_global` (decimal) - 0-100 score based on long term
  - `rank_weekly_universe` (integer, nullable)
  - `rank_weekly_global` (integer, nullable)
  - `rank_alltime_universe` (integer, nullable)
  - `rank_alltime_global` (integer, nullable)
  - `trend` (text) - up, down, stable
  - `performance_factors` (jsonb) - Qualitative factors
  - `last_calculated_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### legend_rankings_history
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to profiles)
  - `universe_id` (uuid, nullable)
  - `ranking_type` (text) - weekly_universe, weekly_global, alltime
  - `rank_position` (integer)
  - `tru_score` (decimal)
  - `period_start` (timestamptz)
  - `period_end` (timestamptz)
  - `badge_level` (integer, nullable)
  - `created_at` (timestamptz)

  ### legend_active_holders
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to profiles)
  - `universe_id` (uuid, nullable)
  - `holder_type` (text) - universe_legend, global_legend
  - `level` (integer) - 1-5
  - `achieved_at` (timestamptz)
  - `lost_at` (timestamptz, nullable)
  - `is_current` (boolean)
  - `weeks_held` (integer, default: 1)

  ## Security
  - Enable RLS on all tables
  - Public read access for rankings and active badges
  - Only system can write scores
  - Creators can view their own detailed metrics

  ## Indexes
  - Performance indexes for ranking queries
  - Composite indexes for leaderboard generation
  - Time-based indexes for historical queries
*/

-- Legend Badges (predefined badge types)
CREATE TABLE IF NOT EXISTS legend_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  badge_type text NOT NULL CHECK (badge_type IN ('trending', 'explosion', 'impact', 'premium_hit', 'top_universe', 'legend')),
  level integer CHECK (level BETWEEN 1 AND 5),
  icon text NOT NULL,
  color text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Video Legend Awards
CREATE TABLE IF NOT EXISTS video_legend_awards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  badge_id uuid NOT NULL REFERENCES legend_badges(id) ON DELETE CASCADE,
  universe_id uuid REFERENCES universes(id) ON DELETE SET NULL,
  period text NOT NULL CHECK (period IN ('24h', '7d', '30d', '90d')),
  awarded_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  metrics_snapshot jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  revoked_at timestamptz,
  revoke_reason text,
  UNIQUE(video_id, badge_id, period, awarded_at)
);

-- Creator Tru Scores
CREATE TABLE IF NOT EXISTS creator_tru_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  universe_id uuid REFERENCES universes(id) ON DELETE SET NULL,
  tru_score_weekly decimal(5,2) DEFAULT 0 CHECK (tru_score_weekly BETWEEN 0 AND 100),
  tru_score_global decimal(5,2) DEFAULT 0 CHECK (tru_score_global BETWEEN 0 AND 100),
  rank_weekly_universe integer,
  rank_weekly_global integer,
  rank_alltime_universe integer,
  rank_alltime_global integer,
  trend text DEFAULT 'stable' CHECK (trend IN ('up', 'down', 'stable')),
  performance_factors jsonb DEFAULT '{}',
  last_calculated_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, universe_id)
);

-- Legend Rankings History
CREATE TABLE IF NOT EXISTS legend_rankings_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  universe_id uuid REFERENCES universes(id) ON DELETE SET NULL,
  ranking_type text NOT NULL CHECK (ranking_type IN ('weekly_universe', 'weekly_global', 'alltime')),
  rank_position integer NOT NULL,
  tru_score decimal(5,2) NOT NULL,
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  badge_level integer CHECK (badge_level BETWEEN 1 AND 5),
  created_at timestamptz DEFAULT now()
);

-- Legend Active Holders
CREATE TABLE IF NOT EXISTS legend_active_holders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  universe_id uuid REFERENCES universes(id) ON DELETE SET NULL,
  holder_type text NOT NULL CHECK (holder_type IN ('universe_legend', 'global_legend')),
  level integer NOT NULL CHECK (level BETWEEN 1 AND 5),
  achieved_at timestamptz DEFAULT now(),
  lost_at timestamptz,
  is_current boolean DEFAULT true,
  weeks_held integer DEFAULT 1
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_video_legend_awards_video ON video_legend_awards(video_id);
CREATE INDEX IF NOT EXISTS idx_video_legend_awards_active ON video_legend_awards(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_video_legend_awards_universe ON video_legend_awards(universe_id);
CREATE INDEX IF NOT EXISTS idx_video_legend_awards_expires ON video_legend_awards(expires_at) WHERE expires_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_creator_tru_scores_user ON creator_tru_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_creator_tru_scores_universe ON creator_tru_scores(universe_id);
CREATE INDEX IF NOT EXISTS idx_creator_tru_scores_weekly_global ON creator_tru_scores(rank_weekly_global) WHERE rank_weekly_global IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_creator_tru_scores_weekly_universe ON creator_tru_scores(universe_id, rank_weekly_universe) WHERE rank_weekly_universe IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_legend_rankings_history_user ON legend_rankings_history(user_id);
CREATE INDEX IF NOT EXISTS idx_legend_rankings_history_period ON legend_rankings_history(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_legend_rankings_history_type ON legend_rankings_history(ranking_type);

CREATE INDEX IF NOT EXISTS idx_legend_active_holders_current ON legend_active_holders(is_current) WHERE is_current = true;
CREATE INDEX IF NOT EXISTS idx_legend_active_holders_type ON legend_active_holders(holder_type, is_current);
CREATE INDEX IF NOT EXISTS idx_legend_active_holders_universe ON legend_active_holders(universe_id) WHERE universe_id IS NOT NULL;

-- Enable RLS
ALTER TABLE legend_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_legend_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_tru_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE legend_rankings_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE legend_active_holders ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Legend Badges: Public read
CREATE POLICY "Anyone can view legend badges"
  ON legend_badges FOR SELECT
  TO public
  USING (true);

-- Video Legend Awards: Public read active awards
CREATE POLICY "Anyone can view active legend awards"
  ON video_legend_awards FOR SELECT
  TO public
  USING (is_active = true);

-- Creator Tru Scores: Public read, creators see own details
CREATE POLICY "Anyone can view tru scores"
  ON creator_tru_scores FOR SELECT
  TO public
  USING (true);

-- Legend Rankings History: Public read
CREATE POLICY "Anyone can view rankings history"
  ON legend_rankings_history FOR SELECT
  TO public
  USING (true);

-- Legend Active Holders: Public read current holders
CREATE POLICY "Anyone can view current legend holders"
  ON legend_active_holders FOR SELECT
  TO public
  USING (is_current = true);