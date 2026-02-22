/*
  # Gift Packs, Premiere Mode & Dynamic Leaderboards
  
  1. Gift Pack System
    - Bronze, Gold, Legendary packs
    - Bundle discounts
    - Exclusive bonuses
  
  2. Premiere Mode
    - Film screening live events
    - Exclusive access system
    - Synchronized reactions
    - Behind-the-scenes mode
  
  3. Dynamic Leaderboards
    - Real-time rankings
    - Multiple categories
    - Time-based periods
    - Milestone achievements
  
  4. Requirements for Live Access
    - 1000 followers minimum to go live
    - Verification checkmarks
*/

-- Pack type enum
DO $$ BEGIN
  CREATE TYPE gift_pack_type AS ENUM ('bronze', 'gold', 'legendary', 'limited_edition');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Premiere mode enum
DO $$ BEGIN
  CREATE TYPE premiere_mode AS ENUM ('screening', 'behind_scenes', 'exclusive_reveal', 'q_and_a');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Leaderboard period enum
DO $$ BEGIN
  CREATE TYPE leaderboard_period AS ENUM ('stream', 'daily', 'weekly', 'monthly', 'all_time');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Leaderboard category enum
DO $$ BEGIN
  CREATE TYPE leaderboard_category AS ENUM (
    'top_gifter',
    'top_gamer',
    'most_active',
    'longest_viewer',
    'most_loyal',
    'badge_collector'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Live Gift Packs
CREATE TABLE IF NOT EXISTS live_gift_packs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  display_name text NOT NULL,
  description text NOT NULL,
  pack_type gift_pack_type NOT NULL,
  icon text NOT NULL,
  base_price numeric(10,2) NOT NULL CHECK (base_price > 0),
  discount_percentage numeric(5,2) DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  final_price numeric(10,2) NOT NULL CHECK (final_price > 0),
  contents jsonb NOT NULL,
  bonus_items jsonb DEFAULT '[]',
  includes_exclusive_badge boolean DEFAULT false,
  includes_vip_access boolean DEFAULT false,
  is_limited_edition boolean DEFAULT false,
  available_quantity integer,
  sold_count integer DEFAULT 0,
  is_active boolean DEFAULT true NOT NULL,
  valid_from timestamptz DEFAULT now(),
  valid_until timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Live Gift Pack Purchases
CREATE TABLE IF NOT EXISTS live_gift_pack_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  pack_id uuid REFERENCES live_gift_packs(id) ON DELETE RESTRICT NOT NULL,
  stream_id uuid REFERENCES live_streams(id) ON DELETE SET NULL,
  price_paid numeric(10,2) NOT NULL,
  purchased_at timestamptz DEFAULT now() NOT NULL
);

-- Premiere Events
CREATE TABLE IF NOT EXISTS live_premiere_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  stream_id uuid REFERENCES live_streams(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  premiere_mode premiere_mode NOT NULL,
  content_type text NOT NULL,
  content_url text,
  thumbnail_url text,
  access_price numeric(10,2) DEFAULT 0,
  max_attendees integer,
  countdown_minutes integer DEFAULT 5,
  allows_reactions boolean DEFAULT true,
  allows_voting boolean DEFAULT false,
  scheduled_at timestamptz NOT NULL,
  started_at timestamptz,
  ended_at timestamptz,
  status text DEFAULT 'scheduled',
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Premiere Attendees
CREATE TABLE IF NOT EXISTS live_premiere_attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  premiere_id uuid REFERENCES live_premiere_events(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  has_vip_access boolean DEFAULT false,
  paid_amount numeric(10,2) DEFAULT 0,
  joined_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(premiere_id, user_id)
);

-- Dynamic Leaderboards
CREATE TABLE IF NOT EXISTS live_leaderboards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id uuid REFERENCES live_streams(id) ON DELETE CASCADE,
  category leaderboard_category NOT NULL,
  period leaderboard_period NOT NULL,
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(stream_id, category, period, period_start)
);

-- Leaderboard Entries
CREATE TABLE IF NOT EXISTS live_leaderboard_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  leaderboard_id uuid REFERENCES live_leaderboards(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  score numeric(15,2) NOT NULL,
  rank integer NOT NULL,
  metadata jsonb DEFAULT '{}',
  last_updated timestamptz DEFAULT now() NOT NULL,
  UNIQUE(leaderboard_id, user_id)
);

-- Creator Requirements (for going live)
CREATE TABLE IF NOT EXISTS live_creator_requirements (
  creator_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  min_followers integer DEFAULT 1000 NOT NULL,
  requires_verification boolean DEFAULT true NOT NULL,
  requires_phone_verified boolean DEFAULT false NOT NULL,
  requires_email_verified boolean DEFAULT true NOT NULL,
  can_go_live boolean DEFAULT false NOT NULL,
  eligibility_checked_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Milestones
CREATE TABLE IF NOT EXISTS live_milestone_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  stream_id uuid REFERENCES live_streams(id) ON DELETE CASCADE,
  milestone_type text NOT NULL,
  milestone_value numeric(15,2) NOT NULL,
  reward_data jsonb DEFAULT '{}',
  achieved_at timestamptz DEFAULT now() NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_live_gift_packs_type ON live_gift_packs(pack_type, is_active);
CREATE INDEX IF NOT EXISTS idx_live_gift_pack_purchases_user ON live_gift_pack_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_live_premiere_events_creator ON live_premiere_events(creator_id, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_live_premiere_attendees_premiere ON live_premiere_attendees(premiere_id);
CREATE INDEX IF NOT EXISTS idx_live_leaderboards_stream ON live_leaderboards(stream_id, is_active);
CREATE INDEX IF NOT EXISTS idx_live_leaderboard_entries_rank ON live_leaderboard_entries(leaderboard_id, rank);
CREATE INDEX IF NOT EXISTS idx_live_milestone_achievements_user ON live_milestone_achievements(user_id);

-- Enable RLS
ALTER TABLE live_gift_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_gift_pack_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_premiere_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_premiere_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_creator_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_milestone_achievements ENABLE ROW LEVEL SECURITY;

-- Gift Packs Policies
CREATE POLICY "Anyone can view active packs"
  ON live_gift_packs FOR SELECT
  USING (is_active = true AND (valid_until IS NULL OR valid_until > now()));

-- Gift Pack Purchases Policies
CREATE POLICY "Users view own purchases"
  ON live_gift_pack_purchases FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Premiere Events Policies
CREATE POLICY "Anyone can view upcoming premieres"
  ON live_premiere_events FOR SELECT
  USING (scheduled_at > now() OR status = 'live');

CREATE POLICY "Creators manage own premieres"
  ON live_premiere_events FOR ALL
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

-- Premiere Attendees Policies
CREATE POLICY "Attendees view premiere list"
  ON live_premiere_attendees FOR SELECT
  USING (true);

CREATE POLICY "Users register for premieres"
  ON live_premiere_attendees FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Leaderboards Policies
CREATE POLICY "Anyone can view leaderboards"
  ON live_leaderboards FOR SELECT
  USING (is_active = true);

-- Leaderboard Entries Policies
CREATE POLICY "Anyone can view leaderboard entries"
  ON live_leaderboard_entries FOR SELECT
  USING (true);

-- Creator Requirements Policies
CREATE POLICY "Users view own requirements"
  ON live_creator_requirements FOR SELECT
  TO authenticated
  USING (auth.uid() = creator_id);

-- Milestone Achievements Policies
CREATE POLICY "Users view own milestones"
  ON live_milestone_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Seed Gift Packs
INSERT INTO live_gift_packs (
  name, display_name, description, pack_type, icon,
  base_price, discount_percentage, final_price,
  contents, bonus_items
) VALUES
  (
    'bronze_fan_pack',
    'Bronze Fan Pack',
    'Perfect starter pack for new supporters',
    'bronze',
    '🥉',
    150,
    10,
    135,
    '[{"gift": "heart", "quantity": 10}, {"gift": "star", "quantity": 3}, {"gift": "flame", "quantity": 1}]'::jsonb,
    '[{"type": "badge", "name": "Bronze Supporter", "duration": 86400}]'::jsonb
  ),
  (
    'gold_fan_pack',
    'Gold Fan Pack',
    'For dedicated supporters with exclusive perks',
    'gold',
    '🥇',
    1200,
    15,
    1020,
    '[{"gift": "gold_record", "quantity": 1}, {"gift": "heart", "quantity": 25}, {"gift": "rose", "quantity": 5}]'::jsonb,
    '[{"type": "badge", "name": "Gold VIP", "duration": 259200}, {"type": "chat_color", "color": "gold"}]'::jsonb
  ),
  (
    'legendary_pack',
    'Legendary Pack',
    'Ultimate prestige package with maximum status',
    'legendary',
    '💎',
    10000,
    20,
    8000,
    '[{"gift": "diamond_record", "quantity": 1}, {"gift": "galaxy", "quantity": 1}, {"gift": "epic_scene", "quantity": 1}]'::jsonb,
    '[{"type": "badge", "name": "Legendary Status", "duration": 2592000}, {"type": "vip_access", "duration": 2592000}, {"type": "exclusive_emotes", "count": 10}]'::jsonb
  )
ON CONFLICT (name) DO NOTHING;

-- Function to check if creator can go live
CREATE OR REPLACE FUNCTION check_creator_live_eligibility(p_creator_id uuid)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_follower_count integer;
  v_is_verified boolean;
  v_can_go_live boolean;
BEGIN
  -- Count followers (assuming a followers table exists)
  SELECT COUNT(*) INTO v_follower_count
  FROM user_subscriptions
  WHERE creator_id = p_creator_id
  AND status = 'active';
  
  -- Check verification status
  SELECT is_verified INTO v_is_verified
  FROM profiles
  WHERE id = p_creator_id;
  
  v_can_go_live := v_follower_count >= 1000 AND COALESCE(v_is_verified, false) = true;
  
  -- Upsert requirements
  INSERT INTO live_creator_requirements (
    creator_id,
    can_go_live,
    eligibility_checked_at
  ) VALUES (
    p_creator_id,
    v_can_go_live,
    now()
  )
  ON CONFLICT (creator_id) DO UPDATE SET
    can_go_live = v_can_go_live,
    eligibility_checked_at = now();
  
  RETURN jsonb_build_object(
    'can_go_live', v_can_go_live,
    'follower_count', v_follower_count,
    'min_required', 1000,
    'is_verified', COALESCE(v_is_verified, false)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION check_creator_live_eligibility TO authenticated;
