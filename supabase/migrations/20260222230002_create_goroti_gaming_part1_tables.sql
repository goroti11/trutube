/*
  # GOROTI Gaming System Part 1 - Core Tables

  Create core gaming tables
*/

-- Games catalog
CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  cover_url text,
  banner_url text,
  category text NOT NULL,
  is_active boolean DEFAULT true,
  is_premium boolean DEFAULT false,
  total_streams bigint DEFAULT 0,
  total_viewers bigint DEFAULT 0,
  total_trucoins_generated bigint DEFAULT 0,
  tags text[] DEFAULT '{}',
  platforms text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_games_slug ON games(slug);
CREATE INDEX IF NOT EXISTS idx_games_category ON games(category) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_games_active ON games(is_active, total_viewers DESC);

-- Game categories
CREATE TABLE IF NOT EXISTS game_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text,
  description text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_game_categories_slug ON game_categories(slug);

-- Internal games
CREATE TABLE IF NOT EXISTS goroti_internal_games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text,
  game_type text NOT NULL,
  min_bet bigint DEFAULT 100,
  max_bet bigint DEFAULT 10000,
  config jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_internal_games_slug ON goroti_internal_games(slug);