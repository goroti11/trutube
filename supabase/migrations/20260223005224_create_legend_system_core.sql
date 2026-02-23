/*
  # Create GOROTI LÉGENDE System - Core Infrastructure

  ## 1. New Tables
  
  ### legend_categories
  - `id` (uuid, primary key)
  - `name` (text) - Video, Music, Gaming, Live, Culture
  - `slug` (text, unique)
  - `description` (text)
  - `icon` (text) - Emoji or icon identifier
  - `is_active` (boolean)
  - `created_at` (timestamptz)
  
  ### legend_registry
  Main registry for all legendary content
  - `id` (uuid, primary key)
  - `entity_type` (text) - video, music, gaming_achievement, live_replay
  - `entity_id` (uuid) - Reference to the actual content
  - `level` (int) - 1, 2, 3, or 4 (Legend I through IV)
  - `category_id` (uuid, FK to legend_categories)
  - `reason` (text) - Why it became legend
  - `verified_metrics` (jsonb) - Snapshot of metrics at grant time
  - `granted_by` (text) - system or admin user_id
  - `granted_at` (timestamptz)
  - `is_revoked` (boolean, default false)
  - `revoked_at` (timestamptz)
  - `revoked_reason` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### legend_candidates
  Audit trail for legend evaluation
  - `id` (uuid, primary key)
  - `entity_type` (text)
  - `entity_id` (uuid)
  - `candidate_reason` (text)
  - `metrics_snapshot` (jsonb) - Calculated metrics
  - `status` (text) - pending, approved, rejected, revoked
  - `reviewed_by` (uuid, FK to profiles)
  - `reviewed_at` (timestamptz)
  - `review_notes` (text)
  - `created_at` (timestamptz)
  
  ### legend_fraud_checks
  Anti-manipulation checks
  - `id` (uuid, primary key)
  - `entity_type` (text)
  - `entity_id` (uuid)
  - `check_type` (text) - fake_views, wash_trading, collusion, etc.
  - `risk_score` (int) - 0-100
  - `is_flagged` (boolean)
  - `details` (jsonb)
  - `checked_at` (timestamptz)
  
  ## 2. Security
  - Enable RLS on all tables
  - Public can read legend_registry and categories
  - Only authenticated users can read candidates
  - Only admins can approve/revoke
  
  ## 3. Indexes
  - Fast lookups by entity
  - Fast filtering by level and category
  - Temporal queries (granted_at, revoked_at)
*/

-- Create legend categories table
CREATE TABLE IF NOT EXISTS legend_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create legend registry table
CREATE TABLE IF NOT EXISTS legend_registry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL CHECK (entity_type IN ('video', 'music', 'gaming_achievement', 'live_replay')),
  entity_id uuid NOT NULL,
  level int NOT NULL CHECK (level BETWEEN 1 AND 4),
  category_id uuid REFERENCES legend_categories(id),
  reason text NOT NULL,
  verified_metrics jsonb NOT NULL DEFAULT '{}',
  granted_by text NOT NULL,
  granted_at timestamptz DEFAULT now(),
  is_revoked boolean DEFAULT false,
  revoked_at timestamptz,
  revoked_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create legend candidates table
CREATE TABLE IF NOT EXISTS legend_candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL CHECK (entity_type IN ('video', 'music', 'gaming_achievement', 'live_replay')),
  entity_id uuid NOT NULL,
  candidate_reason text NOT NULL,
  metrics_snapshot jsonb NOT NULL DEFAULT '{}',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'revoked')),
  reviewed_by uuid REFERENCES profiles(id),
  reviewed_at timestamptz,
  review_notes text,
  created_at timestamptz DEFAULT now()
);

-- Create legend fraud checks table
CREATE TABLE IF NOT EXISTS legend_fraud_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  check_type text NOT NULL CHECK (check_type IN ('fake_views', 'wash_trading', 'collusion', 'bot_activity', 'sanction_history')),
  risk_score int CHECK (risk_score BETWEEN 0 AND 100),
  is_flagged boolean DEFAULT false,
  details jsonb DEFAULT '{}',
  checked_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_legend_registry_entity ON legend_registry(entity_type, entity_id) WHERE is_revoked = false;
CREATE INDEX IF NOT EXISTS idx_legend_registry_level ON legend_registry(level DESC) WHERE is_revoked = false;
CREATE INDEX IF NOT EXISTS idx_legend_registry_category ON legend_registry(category_id) WHERE is_revoked = false;
CREATE INDEX IF NOT EXISTS idx_legend_registry_granted ON legend_registry(granted_at DESC);
CREATE INDEX IF NOT EXISTS idx_legend_candidates_status ON legend_candidates(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_legend_fraud_entity ON legend_fraud_checks(entity_type, entity_id, checked_at DESC);

-- Enable Row Level Security
ALTER TABLE legend_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE legend_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE legend_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE legend_fraud_checks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for legend_categories
CREATE POLICY "Anyone can view active categories"
  ON legend_categories FOR SELECT
  TO public
  USING (is_active = true);

-- RLS Policies for legend_registry
CREATE POLICY "Anyone can view non-revoked legends"
  ON legend_registry FOR SELECT
  TO public
  USING (is_revoked = false);

CREATE POLICY "Authenticated users can view all legends"
  ON legend_registry FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for legend_candidates
CREATE POLICY "Authenticated users can view candidates"
  ON legend_candidates FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for legend_fraud_checks
CREATE POLICY "Authenticated users can view fraud checks"
  ON legend_fraud_checks FOR SELECT
  TO authenticated
  USING (true);

-- Seed legend categories
INSERT INTO legend_categories (name, slug, description, icon) VALUES
  ('Video', 'video', 'Legendary video content', '🎥'),
  ('Music', 'music', 'Legendary music tracks and albums', '🎵'),
  ('Gaming', 'gaming', 'Legendary gaming achievements and performances', '🎮'),
  ('Live', 'live', 'Legendary live stream replays', '🔴'),
  ('Culture', 'culture', 'Culturally significant content', '🌍')
ON CONFLICT (slug) DO NOTHING;
