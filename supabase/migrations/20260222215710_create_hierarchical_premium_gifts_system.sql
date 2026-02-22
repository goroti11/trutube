/*
  # Hierarchical Premium Gifts System
  
  1. Four-Tier Gift System
    - Tier 1 (Micro): Hearts, Stars, Flames (10-50 TC)
    - Tier 2 (Emotional Packs): Mystery bundles (100-500 TC)
    - Tier 3 (Status): Gold/Platinum/Diamond Records (1000-5000 TC)
    - Tier 4 (Cinema): Epic scenes, spotlights (10000+ TC)
  
  2. Features
    - Visual effects per tier
    - Status badges for senders
    - Leaderboard impact
    - Voice announcements for high tiers
    - Animation triggers
    - Temporary badges
  
  3. New Tables
    - `live_gift_catalog` - Enhanced gift definitions
    - `live_gift_effects` - Visual/audio effect configurations
    - `live_gift_transactions_v2` - Enhanced transaction tracking
    - `live_gift_status_badges` - Temporary status badges
  
  4. Gift Categories
    - micro: Quick emotional support
    - pack: Mystery bundles with bonuses
    - status: Recognition and prestige
    - cinema: Hollywood-style effects
*/

-- Gift tier enum
DO $$ BEGIN
  CREATE TYPE gift_tier AS ENUM ('micro', 'pack', 'status', 'cinema');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Effect type enum
DO $$ BEGIN
  CREATE TYPE gift_effect_type AS ENUM (
    'animation',
    'sound',
    'voice_announcement',
    'screen_effect',
    'badge_grant',
    'leaderboard_boost',
    'chat_highlight',
    'spotlight'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Live Gift Catalog (Enhanced)
CREATE TABLE IF NOT EXISTS live_gift_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  display_name text NOT NULL,
  description text,
  icon text NOT NULL,
  tier gift_tier NOT NULL,
  category text NOT NULL,
  price_trucoins numeric(10,2) NOT NULL CHECK (price_trucoins > 0),
  rarity_score integer DEFAULT 0,
  status_boost integer DEFAULT 0,
  animation_url text,
  sound_url text,
  duration_seconds integer DEFAULT 3,
  requires_voice_announcement boolean DEFAULT false,
  grants_temporary_badge boolean DEFAULT false,
  badge_duration_seconds integer DEFAULT 0,
  is_active boolean DEFAULT true NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Live Gift Effects
CREATE TABLE IF NOT EXISTS live_gift_effects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gift_id uuid REFERENCES live_gift_catalog(id) ON DELETE CASCADE NOT NULL,
  effect_type gift_effect_type NOT NULL,
  effect_config jsonb DEFAULT '{}' NOT NULL,
  trigger_condition text,
  priority integer DEFAULT 0,
  is_active boolean DEFAULT true NOT NULL
);

-- Live Gift Status Badges
CREATE TABLE IF NOT EXISTS live_gift_status_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  stream_id uuid REFERENCES live_streams(id) ON DELETE CASCADE NOT NULL,
  badge_name text NOT NULL,
  badge_icon text NOT NULL,
  granted_at timestamptz DEFAULT now() NOT NULL,
  expires_at timestamptz NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_live_gift_catalog_tier ON live_gift_catalog(tier, is_active);
CREATE INDEX IF NOT EXISTS idx_live_gift_catalog_price ON live_gift_catalog(price_trucoins);
CREATE INDEX IF NOT EXISTS idx_live_gift_effects_gift ON live_gift_effects(gift_id, priority);
CREATE INDEX IF NOT EXISTS idx_live_gift_status_badges_user ON live_gift_status_badges(user_id, expires_at);
CREATE INDEX IF NOT EXISTS idx_live_gift_status_badges_stream ON live_gift_status_badges(stream_id, expires_at);

-- Enable RLS
ALTER TABLE live_gift_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_gift_effects ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_gift_status_badges ENABLE ROW LEVEL SECURITY;

-- Gift Catalog Policies
CREATE POLICY "Anyone can view active gifts"
  ON live_gift_catalog FOR SELECT
  USING (is_active = true);

-- Gift Effects Policies
CREATE POLICY "Anyone can view gift effects"
  ON live_gift_effects FOR SELECT
  USING (is_active = true);

-- Status Badges Policies
CREATE POLICY "Users view active badges"
  ON live_gift_status_badges FOR SELECT
  USING (expires_at > now());

-- Seed Hierarchical Gift Catalog

-- TIER 1: MICRO GIFTS (10-50 TC)
INSERT INTO live_gift_catalog (
  name, display_name, description, icon, tier, category,
  price_trucoins, rarity_score, status_boost, duration_seconds
) VALUES
  ('heart', 'Heart', 'Show love and support', '❤️', 'micro', 'emotion', 10, 1, 1, 2),
  ('star', 'Star', 'You shine bright', '⭐', 'micro', 'emotion', 15, 2, 1, 2),
  ('flame', 'Flame', 'On fire!', '🔥', 'micro', 'emotion', 20, 3, 2, 2),
  ('balloon', 'Balloon', 'Celebrate good times', '🎈', 'micro', 'emotion', 15, 2, 1, 2),
  ('music_note', 'Music Note', 'Great sound!', '🎵', 'micro', 'entertainment', 20, 2, 1, 2),
  ('microphone', 'Microphone', 'Speak up!', '🎤', 'micro', 'entertainment', 25, 3, 2, 2),
  ('gamepad', 'Gamepad', 'Gaming legend', '🎮', 'micro', 'gaming', 30, 3, 2, 2),
  ('popcorn', 'Popcorn', 'Enjoying the show', '🍿', 'micro', 'entertainment', 25, 2, 1, 2),
  ('clapper', 'Movie Clapper', 'Action!', '🎬', 'micro', 'cinema', 30, 3, 2, 3),
  ('rose', 'Rose', 'Beautiful content', '🌹', 'micro', 'emotion', 50, 5, 3, 3)
ON CONFLICT (name) DO NOTHING;

-- TIER 2: EMOTIONAL PACKS (100-500 TC)
INSERT INTO live_gift_catalog (
  name, display_name, description, icon, tier, category,
  price_trucoins, rarity_score, status_boost, duration_seconds,
  grants_temporary_badge, badge_duration_seconds
) VALUES
  ('mystery_pack', 'Mystery Pack', 'Surprise bundle with random effects', '🎒', 'pack', 'bundle', 100, 10, 5, 5, true, 300),
  ('surprise_box', 'Surprise Box', 'What''s inside?', '🎁', 'pack', 'bundle', 150, 12, 6, 5, true, 300),
  ('explosion_support', 'Explosion Support', 'Maximum impact!', '🎆', 'pack', 'power', 250, 15, 8, 6, true, 600),
  ('fan_booster', 'Fan Booster', 'Boost visibility', '💎', 'pack', 'power', 300, 18, 10, 6, true, 600),
  ('hero_pack', 'Hero Pack', 'Legendary support', '🏆', 'pack', 'power', 500, 25, 15, 8, true, 900)
ON CONFLICT (name) DO NOTHING;

-- TIER 3: STATUS GIFTS (1000-5000 TC)
INSERT INTO live_gift_catalog (
  name, display_name, description, icon, tier, category,
  price_trucoins, rarity_score, status_boost, duration_seconds,
  requires_voice_announcement, grants_temporary_badge, badge_duration_seconds
) VALUES
  ('gold_record', 'Gold Record', 'Music industry legend', '🥇', 'status', 'prestige', 1000, 50, 30, 10, true, true, 1800),
  ('platinum_record', 'Platinum Record', 'Elite supporter status', '🥈', 'status', 'prestige', 2500, 75, 50, 12, true, true, 3600),
  ('diamond_record', 'Diamond Record', 'Rare and precious', '💎', 'status', 'prestige', 5000, 100, 75, 15, true, true, 7200),
  ('crown', 'Royal Crown', 'King/Queen supporter', '👑', 'status', 'royalty', 3000, 80, 60, 12, true, true, 3600),
  ('dragon', 'Dragon Legend', 'Mythical power', '🐉', 'status', 'legend', 4000, 90, 70, 15, true, true, 5400),
  ('rocket', 'Rocket Launch', 'To the moon!', '🚀', 'status', 'power', 2000, 70, 40, 10, true, true, 2400),
  ('galaxy', 'Galaxy Supporter', 'Out of this world', '🌌', 'status', 'cosmic', 6000, 120, 100, 18, true, true, 10800)
ON CONFLICT (name) DO NOTHING;

-- TIER 4: CINEMA GIFTS (10000+ TC)
INSERT INTO live_gift_catalog (
  name, display_name, description, icon, tier, category,
  price_trucoins, rarity_score, status_boost, duration_seconds,
  requires_voice_announcement, grants_temporary_badge, badge_duration_seconds
) VALUES
  ('epic_scene', 'Epic Scene', 'Cinematic masterpiece', '🎬', 'cinema', 'hollywood', 10000, 200, 150, 20, true, true, 14400),
  ('movie_trailer', 'Movie Trailer', 'Personalized preview', '🎞️', 'cinema', 'hollywood', 15000, 250, 200, 25, true, true, 21600),
  ('giant_spotlight', 'Giant Spotlight', 'Center stage attention', '🎥', 'cinema', 'spotlight', 12000, 220, 175, 22, true, true, 18000),
  ('standing_ovation', 'Standing Ovation', 'Thunderous applause', '🎭', 'cinema', 'performance', 18000, 280, 250, 30, true, true, 28800),
  ('dramatic_music', 'Dramatic Orchestra', 'Epic soundtrack moment', '🎶', 'cinema', 'audio', 20000, 300, 300, 35, true, true, 36000),
  ('castle', 'Royal Castle', 'Ultimate prestige', '🏰', 'cinema', 'monument', 25000, 400, 500, 40, true, true, 86400)
ON CONFLICT (name) DO NOTHING;

-- Seed Gift Effects
INSERT INTO live_gift_effects (gift_id, effect_type, effect_config, priority) 
SELECT 
  id,
  'animation'::gift_effect_type,
  jsonb_build_object(
    'type', CASE 
      WHEN tier = 'micro' THEN 'float'
      WHEN tier = 'pack' THEN 'burst'
      WHEN tier = 'status' THEN 'dramatic'
      WHEN tier = 'cinema' THEN 'cinematic'
    END,
    'duration', duration_seconds
  ),
  1
FROM live_gift_catalog
WHERE NOT EXISTS (
  SELECT 1 FROM live_gift_effects 
  WHERE gift_id = live_gift_catalog.id 
  AND effect_type = 'animation'
);

-- Add voice announcement effects for high-tier gifts
INSERT INTO live_gift_effects (gift_id, effect_type, effect_config, priority)
SELECT
  id,
  'voice_announcement'::gift_effect_type,
  jsonb_build_object(
    'message', display_name || ' from {sender}!',
    'voice', 'dramatic'
  ),
  2
FROM live_gift_catalog
WHERE requires_voice_announcement = true
ON CONFLICT DO NOTHING;

-- Add leaderboard boost effects
INSERT INTO live_gift_effects (gift_id, effect_type, effect_config, priority)
SELECT
  id,
  'leaderboard_boost'::gift_effect_type,
  jsonb_build_object('multiplier', status_boost / 10.0),
  3
FROM live_gift_catalog
WHERE status_boost >= 10
ON CONFLICT DO NOTHING;
