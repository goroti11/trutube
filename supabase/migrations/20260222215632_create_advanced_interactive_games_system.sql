/*
  # Advanced Interactive Games System
  
  1. Enhanced Game Types
    - Duel Live: Chat votes A vs B, creator performs challenge
    - Quiz Fan: Real-time questions with badge rewards
    - Community Challenges: Milestone-based creator challenges
    - Live Draw: TruCoin ticket lottery system
    - Wheel: Spin the wheel game
    - Boss Fight: Community vs boss battle
  
  2. New Tables
    - `live_game_templates` - Reusable game configurations
    - `live_game_sessions` - Individual game instances
    - `live_game_actions` - Player actions in games
    - `live_game_rewards` - Prizes and badges earned
    - `live_community_challenges` - Milestone-based challenges
    - `live_draw_tickets` - Lottery ticket system
    - `live_badges` - Achievement badges
    - `user_earned_badges` - Badge inventory
  
  3. Features
    - Real-time voting
    - Progressive challenges
    - Badge system with tiers
    - Lottery mechanics
    - Community goal tracking
*/

-- Enhanced game types
DO $$ BEGIN
  ALTER TYPE live_game_type ADD VALUE IF NOT EXISTS 'duel_live';
  ALTER TYPE live_game_type ADD VALUE IF NOT EXISTS 'quiz_fan';
  ALTER TYPE live_game_type ADD VALUE IF NOT EXISTS 'community_challenge';
  ALTER TYPE live_game_type ADD VALUE IF NOT EXISTS 'live_draw';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Challenge status enum
DO $$ BEGIN
  CREATE TYPE challenge_status AS ENUM ('pending', 'active', 'completed', 'failed', 'expired');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Badge tier enum
DO $$ BEGIN
  CREATE TYPE badge_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum', 'diamond', 'legendary');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Live Game Templates
CREATE TABLE IF NOT EXISTS live_game_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  game_type live_game_type NOT NULL,
  name text NOT NULL CHECK (char_length(name) >= 2 AND char_length(name) <= 100),
  description text,
  config jsonb DEFAULT '{}' NOT NULL,
  default_bet_amount numeric(10,2) DEFAULT 10,
  default_duration_seconds integer DEFAULT 300,
  is_active boolean DEFAULT true NOT NULL,
  times_used integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Live Game Sessions (enhanced)
CREATE TABLE IF NOT EXISTS live_game_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id uuid REFERENCES live_streams(id) ON DELETE CASCADE NOT NULL,
  template_id uuid REFERENCES live_game_templates(id) ON DELETE SET NULL,
  game_type live_game_type NOT NULL,
  title text NOT NULL,
  description text,
  config jsonb DEFAULT '{}' NOT NULL,
  status live_game_status DEFAULT 'waiting' NOT NULL,
  min_bet numeric(10,2) DEFAULT 10,
  max_participants integer DEFAULT 100,
  current_participants integer DEFAULT 0,
  prize_pool numeric(10,2) DEFAULT 0,
  duration_seconds integer DEFAULT 300,
  started_at timestamptz,
  ended_at timestamptz,
  winner_ids uuid[],
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Live Game Actions (player moves)
CREATE TABLE IF NOT EXISTS live_game_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES live_game_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  action_type text NOT NULL,
  action_data jsonb DEFAULT '{}' NOT NULL,
  points_earned numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Live Game Rewards
CREATE TABLE IF NOT EXISTS live_game_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES live_game_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reward_type text NOT NULL,
  reward_data jsonb DEFAULT '{}' NOT NULL,
  trucoin_amount numeric(10,2) DEFAULT 0,
  badge_id uuid,
  claimed_at timestamptz DEFAULT now() NOT NULL
);

-- Live Community Challenges
CREATE TABLE IF NOT EXISTS live_community_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id uuid REFERENCES live_streams(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  challenge_type text NOT NULL,
  goal_type text NOT NULL,
  goal_amount numeric(10,2) NOT NULL,
  current_amount numeric(10,2) DEFAULT 0,
  status challenge_status DEFAULT 'pending' NOT NULL,
  reward_description text,
  expires_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Live Draw Tickets
CREATE TABLE IF NOT EXISTS live_draw_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id uuid REFERENCES live_streams(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  ticket_number integer NOT NULL,
  price_paid numeric(10,2) NOT NULL,
  is_winner boolean DEFAULT false,
  prize_data jsonb,
  purchased_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(stream_id, ticket_number)
);

-- Live Badges
CREATE TABLE IF NOT EXISTS live_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  icon text NOT NULL,
  tier badge_tier DEFAULT 'bronze' NOT NULL,
  requirements jsonb DEFAULT '{}' NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  rarity_score integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- User Earned Badges
CREATE TABLE IF NOT EXISTS user_earned_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  badge_id uuid REFERENCES live_badges(id) ON DELETE CASCADE NOT NULL,
  stream_id uuid REFERENCES live_streams(id) ON DELETE SET NULL,
  earned_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, badge_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_live_game_templates_creator ON live_game_templates(creator_id, is_active);
CREATE INDEX IF NOT EXISTS idx_live_game_sessions_stream ON live_game_sessions(stream_id, status);
CREATE INDEX IF NOT EXISTS idx_live_game_actions_session ON live_game_actions(session_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_live_game_actions_user ON live_game_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_live_game_rewards_user ON live_game_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_live_community_challenges_stream ON live_community_challenges(stream_id, status);
CREATE INDEX IF NOT EXISTS idx_live_draw_tickets_stream ON live_draw_tickets(stream_id);
CREATE INDEX IF NOT EXISTS idx_live_draw_tickets_user ON live_draw_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_user_earned_badges_user ON user_earned_badges(user_id);

-- Enable RLS
ALTER TABLE live_game_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_game_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_game_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_community_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_draw_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_earned_badges ENABLE ROW LEVEL SECURITY;

-- Game Templates Policies
CREATE POLICY "Creators manage own templates"
  ON live_game_templates FOR ALL
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users view active templates"
  ON live_game_templates FOR SELECT
  USING (is_active = true);

-- Game Sessions Policies
CREATE POLICY "Users view active sessions"
  ON live_game_sessions FOR SELECT
  USING (status IN ('waiting', 'active'));

CREATE POLICY "Creators manage stream sessions"
  ON live_game_sessions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM live_streams
      WHERE id = live_game_sessions.stream_id
      AND creator_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM live_streams
      WHERE id = live_game_sessions.stream_id
      AND creator_id = auth.uid()
    )
  );

-- Game Actions Policies
CREATE POLICY "Users view game actions"
  ON live_game_actions FOR SELECT
  USING (true);

CREATE POLICY "Users create own actions"
  ON live_game_actions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Game Rewards Policies
CREATE POLICY "Users view own rewards"
  ON live_game_rewards FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Community Challenges Policies
CREATE POLICY "Users view challenges"
  ON live_community_challenges FOR SELECT
  USING (true);

CREATE POLICY "Creators manage challenges"
  ON live_community_challenges FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM live_streams
      WHERE id = live_community_challenges.stream_id
      AND creator_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM live_streams
      WHERE id = live_community_challenges.stream_id
      AND creator_id = auth.uid()
    )
  );

-- Draw Tickets Policies
CREATE POLICY "Users view own tickets"
  ON live_draw_tickets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Creators view stream tickets"
  ON live_draw_tickets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM live_streams
      WHERE id = live_draw_tickets.stream_id
      AND creator_id = auth.uid()
    )
  );

-- Badges Policies
CREATE POLICY "Anyone can view badges"
  ON live_badges FOR SELECT
  USING (is_active = true);

-- User Earned Badges Policies
CREATE POLICY "Users view own badges"
  ON user_earned_badges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users view others public badges"
  ON user_earned_badges FOR SELECT
  USING (true);

-- Seed default badges
INSERT INTO live_badges (name, description, icon, tier, rarity_score) VALUES
  ('Quiz Master', 'Won 10 quiz games', '🧠', 'bronze', 10),
  ('Quiz Legend', 'Won 50 quiz games', '🎓', 'gold', 50),
  ('Duel Champion', 'Won 10 duels', '⚔️', 'silver', 20),
  ('Generous Supporter', 'Sent 1000 TruCoins in gifts', '💝', 'silver', 25),
  ('Legendary Supporter', 'Sent 10000 TruCoins in gifts', '👑', 'platinum', 100),
  ('First Fan', 'First viewer in a stream', '🥇', 'bronze', 15),
  ('Loyal Fan', 'Attended 50 streams', '🏆', 'gold', 60),
  ('Community Hero', 'Completed 5 community challenges', '🦸', 'gold', 45),
  ('Lucky Winner', 'Won a live draw', '🎰', 'silver', 30),
  ('Game Master', 'Participated in all game types', '🎮', 'platinum', 80)
ON CONFLICT (name) DO NOTHING;
