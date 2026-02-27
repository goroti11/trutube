/*
  # Enhance Gaming for Live Integration

  Add missing columns and tables for YouTube Gaming-style live integration
*/

-- Add slug and cover fields to games if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'games' AND column_name = 'slug') THEN
    ALTER TABLE games ADD COLUMN slug text;
    UPDATE games SET slug = lower(replace(name, ' ', '-')) WHERE slug IS NULL;
    CREATE UNIQUE INDEX IF NOT EXISTS idx_games_slug_unique ON games(slug) WHERE slug IS NOT NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'games' AND column_name = 'cover_url') THEN
    ALTER TABLE games ADD COLUMN cover_url text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'games' AND column_name = 'banner_url') THEN
    ALTER TABLE games ADD COLUMN banner_url text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'games' AND column_name = 'total_streams') THEN
    ALTER TABLE games ADD COLUMN total_streams integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'games' AND column_name = 'total_viewers') THEN
    ALTER TABLE games ADD COLUMN total_viewers bigint DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'games' AND column_name = 'trucoins_generated') THEN
    ALTER TABLE games ADD COLUMN trucoins_generated bigint DEFAULT 0;
  END IF;
END $$;

-- Interactive gaming effects library
CREATE TABLE IF NOT EXISTS gaming_effect_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  effect_name text NOT NULL,
  effect_type text NOT NULL CHECK (effect_type IN (
    'slow_motion', 'speed_boost', 'camera_shake', 'zoom_in', 'color_filter',
    'particle_effect', 'sound_effect', 'screen_flash', 'dramatic_music', 'boss_mode'
  )),
  trigger_gift_tier text CHECK (trigger_gift_tier IN ('bronze', 'silver', 'gold', 'platinum', 'diamond', 'legendary')),
  trigger_trucoin_amount bigint,
  duration_seconds integer DEFAULT 5,
  visual_config jsonb DEFAULT '{}',
  audio_config jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gaming_effects_type ON gaming_effect_library(effect_type);
CREATE INDEX IF NOT EXISTS idx_gaming_effects_gift_tier ON gaming_effect_library(trigger_gift_tier);

-- Gaming categories
CREATE TABLE IF NOT EXISTS gaming_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text,
  description text,
  display_order integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gaming_categories_slug ON gaming_categories(slug);

-- Link games to categories
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'games' AND column_name = 'category_id') THEN
    ALTER TABLE games ADD COLUMN category_id uuid REFERENCES gaming_categories(id) ON DELETE SET NULL;
  END IF;
END $$;

-- RLS
ALTER TABLE gaming_effect_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaming_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "effects_public_read" ON gaming_effect_library FOR SELECT TO authenticated USING (true);
CREATE POLICY "categories_public_read" ON gaming_categories FOR SELECT TO authenticated USING (true);

-- Seed gaming categories
INSERT INTO gaming_categories (name, slug, icon, description, display_order, is_featured) VALUES
('Battle Royale', 'battle-royale', 'target', 'Last player standing games', 1, true),
('MOBA', 'moba', 'swords', 'Multiplayer Online Battle Arena', 2, true),
('FPS', 'fps', 'crosshair', 'First Person Shooter', 3, true),
('RPG', 'rpg', 'shield', 'Role Playing Games', 4, false),
('Sports', 'sports', 'trophy', 'Sports and Racing', 5, false),
('Strategy', 'strategy', 'brain', 'Strategy and Tactics', 6, false),
('Casual', 'casual', 'smile', 'Casual and Party Games', 7, false),
('Horror', 'horror', 'ghost', 'Horror and Survival', 8, false)
ON CONFLICT (slug) DO NOTHING;

-- Seed gaming effects
INSERT INTO gaming_effect_library (effect_name, effect_type, trigger_gift_tier, duration_seconds, visual_config, audio_config) VALUES
('Epic Slow Motion', 'slow_motion', 'diamond', 10, '{"speed": 0.3, "zoom": 1.2}', '{"music": "dramatic", "volume": 0.8}'),
('Speed Demon', 'speed_boost', 'gold', 5, '{"particles": "fire", "trail": true}', '{"sound": "whoosh"}'),
('Camera Shake', 'camera_shake', 'silver', 3, '{"intensity": 0.5}', '{"sound": "explosion"}'),
('Cinematic Zoom', 'zoom_in', 'platinum', 8, '{"zoom_level": 2.0, "smooth": true}', '{"music": "epic"}'),
('Boss Mode', 'boss_mode', 'legendary', 15, '{"overlay": "red", "particles": "dark"}', '{"music": "boss_theme", "volume": 1.0}'),
('Victory Flash', 'screen_flash', 'bronze', 2, '{"color": "gold", "intensity": 0.7}', '{"sound": "victory"}')
ON CONFLICT DO NOTHING;
