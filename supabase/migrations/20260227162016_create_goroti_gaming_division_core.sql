/*
  # Goroti Gaming Division - Core Tables

  ## Tables Created
  
  ### games
  - `id` (uuid, primary key)
  - `name` (text, unique)
  - `description` (text)
  - `publisher_id` (uuid, foreign key)
  - `genre` (text)
  - `thumbnail_url` (text)
  - `is_active` (boolean, default: true)
  - `supports_competitive` (boolean)
  - `supports_tournaments` (boolean)
  - `supports_leaderboards` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### game_publishers
  - `id` (uuid, primary key)
  - `name` (text, unique)
  - `website_url` (text)
  - `verified` (boolean, default: false)
  - `created_at` (timestamptz)

  ### gaming_live_sessions
  - `id` (uuid, primary key)
  - `streamer_id` (uuid, foreign key to profiles)
  - `game_id` (uuid, foreign key)
  - `title` (text)
  - `mode` (text: casual, competitive, tournament)
  - `tournament_id` (uuid, nullable, foreign key)
  - `is_ranked` (boolean)
  - `anti_cheat_enabled` (boolean)
  - `trucoin_bonus_enabled` (boolean)
  - `started_at` (timestamptz)
  - `ended_at` (timestamptz, nullable)
  - `status` (text: active, ended)

  ### gaming_stream_stats
  - `id` (uuid, primary key)
  - `session_id` (uuid, foreign key)
  - `viewer_count` (integer)
  - `peak_viewers` (integer)
  - `trucoins_earned` (decimal)
  - `gifts_received` (integer)
  - `duration_minutes` (integer)
  - `recorded_at` (timestamptz)

  ### gaming_seasons
  - `id` (uuid, primary key)
  - `name` (text)
  - `season_number` (integer)
  - `start_date` (timestamptz)
  - `end_date` (timestamptz)
  - `status` (text: upcoming, active, ended)
  - `prize_pool` (decimal, default: 0)
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Public read access for active games and publishers
  - Authenticated users can create live sessions
  - Only streamers can update their own sessions
  - Admin-only access for seasons management

  ## Indexes
  - Foreign key indexes for performance
  - Status and date indexes for filtering
*/

-- Game Publishers
CREATE TABLE IF NOT EXISTS game_publishers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  website_url text,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Games
CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  publisher_id uuid REFERENCES game_publishers(id) ON DELETE SET NULL,
  genre text NOT NULL,
  thumbnail_url text,
  is_active boolean DEFAULT true,
  supports_competitive boolean DEFAULT false,
  supports_tournaments boolean DEFAULT false,
  supports_leaderboards boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Gaming Live Sessions
CREATE TABLE IF NOT EXISTS gaming_live_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  streamer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  game_id uuid NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  title text NOT NULL,
  mode text NOT NULL CHECK (mode IN ('casual', 'competitive', 'tournament')),
  tournament_id uuid,
  is_ranked boolean DEFAULT false,
  anti_cheat_enabled boolean DEFAULT true,
  trucoin_bonus_enabled boolean DEFAULT false,
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  status text DEFAULT 'active' CHECK (status IN ('active', 'ended'))
);

-- Gaming Stream Stats
CREATE TABLE IF NOT EXISTS gaming_stream_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES gaming_live_sessions(id) ON DELETE CASCADE,
  viewer_count integer DEFAULT 0,
  peak_viewers integer DEFAULT 0,
  trucoins_earned decimal(15,2) DEFAULT 0,
  gifts_received integer DEFAULT 0,
  duration_minutes integer DEFAULT 0,
  recorded_at timestamptz DEFAULT now()
);

-- Gaming Seasons
CREATE TABLE IF NOT EXISTS gaming_seasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  season_number integer NOT NULL,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'ended')),
  prize_pool decimal(15,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_season_dates CHECK (end_date > start_date)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_games_publisher ON games(publisher_id);
CREATE INDEX IF NOT EXISTS idx_games_active ON games(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_gaming_sessions_streamer ON gaming_live_sessions(streamer_id);
CREATE INDEX IF NOT EXISTS idx_gaming_sessions_game ON gaming_live_sessions(game_id);
CREATE INDEX IF NOT EXISTS idx_gaming_sessions_status ON gaming_live_sessions(status);
CREATE INDEX IF NOT EXISTS idx_gaming_stats_session ON gaming_stream_stats(session_id);
CREATE INDEX IF NOT EXISTS idx_gaming_seasons_status ON gaming_seasons(status);

-- Enable RLS
ALTER TABLE game_publishers ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaming_live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaming_stream_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaming_seasons ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Game Publishers: Public read, admin write
CREATE POLICY "Public can view verified publishers"
  ON game_publishers FOR SELECT
  TO public
  USING (verified = true);

-- Games: Public read active games
CREATE POLICY "Public can view active games"
  ON games FOR SELECT
  TO public
  USING (is_active = true);

-- Gaming Live Sessions: Users can view all, create own, update own
CREATE POLICY "Anyone can view gaming sessions"
  ON gaming_live_sessions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create gaming sessions"
  ON gaming_live_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = streamer_id);

CREATE POLICY "Streamers can update own gaming sessions"
  ON gaming_live_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = streamer_id)
  WITH CHECK (auth.uid() = streamer_id);

-- Gaming Stream Stats: Public read, system write
CREATE POLICY "Anyone can view gaming stats"
  ON gaming_stream_stats FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Streamers can insert stats for own sessions"
  ON gaming_stream_stats FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM gaming_live_sessions
      WHERE id = session_id AND streamer_id = auth.uid()
    )
  );

-- Gaming Seasons: Public read
CREATE POLICY "Anyone can view gaming seasons"
  ON gaming_seasons FOR SELECT
  TO public
  USING (true);