/*
  # Add Sub-Universes System to Goroti

  ## 1. New Tables
  
  ### `sub_universes`
  Sub-categories within each universe
  - `id` (uuid, primary key)
  - `universe_id` (uuid, references universes)
  - `name` (text) - e.g., "Freestyle", "Clips", "Stream"
  - `slug` (text, unique) - e.g., "freestyle", "clips"
  - `description` (text)
  - `created_at` (timestamptz)

  ### `creator_universes`
  Creators' chosen universes and sub-universes
  - `id` (uuid, primary key)
  - `creator_id` (uuid, references profiles)
  - `main_universe_id` (uuid, references universes) - Main universe
  - `sub_universe_ids` (uuid[]) - Array of sub-universe IDs
  - `created_at` (timestamptz)

  ### `user_preferences`
  User's universe and sub-universe preferences for feed
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles, unique)
  - `universe_ids` (uuid[]) - Array of preferred universe IDs
  - `sub_universe_ids` (uuid[]) - Array of preferred sub-universe IDs
  - `updated_at` (timestamptz)

  ## 2. Changes to Existing Tables
  
  ### Videos table
  - Add `sub_universe_id` (uuid, references sub_universes) - MANDATORY field

  ## 3. Security
  - Enable RLS on all new tables
  - Users can view all universes and sub-universes
  - Users can manage their own preferences
  - Creators can manage their own universe selections
*/

-- Create sub_universes table
CREATE TABLE IF NOT EXISTS sub_universes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  universe_id uuid REFERENCES universes(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sub_universes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view sub_universes"
  ON sub_universes FOR SELECT
  TO authenticated
  USING (true);

-- Create creator_universes table
CREATE TABLE IF NOT EXISTS creator_universes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  main_universe_id uuid REFERENCES universes(id) ON DELETE SET NULL NOT NULL,
  sub_universe_ids uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE creator_universes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view creator universes"
  ON creator_universes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Creators can manage own universe selection"
  ON creator_universes FOR ALL
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  universe_ids uuid[] DEFAULT '{}',
  sub_universe_ids uuid[] DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own preferences"
  ON user_preferences FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add sub_universe_id to videos table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'videos' AND column_name = 'sub_universe_id'
  ) THEN
    ALTER TABLE videos ADD COLUMN sub_universe_id uuid REFERENCES sub_universes(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_sub_universes_universe_id ON sub_universes(universe_id);
CREATE INDEX IF NOT EXISTS idx_creator_universes_creator_id ON creator_universes(creator_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_sub_universe_id ON videos(sub_universe_id);

-- Populate sub_universes for Music
INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Afrobeat', 'afrobeat', 'Afrobeat music content'
FROM universes WHERE slug = 'music'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Amapiano', 'amapiano', 'Amapiano music content'
FROM universes WHERE slug = 'music'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Hip-Hop / Rap', 'hip-hop-rap', 'Hip-Hop and Rap music'
FROM universes WHERE slug = 'music'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Trap', 'trap', 'Trap music'
FROM universes WHERE slug = 'music'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Drill', 'drill', 'Drill music'
FROM universes WHERE slug = 'music'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'R&B', 'rnb', 'R&B music'
FROM universes WHERE slug = 'music'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Soul', 'soul', 'Soul music'
FROM universes WHERE slug = 'music'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Funk', 'funk', 'Funk music'
FROM universes WHERE slug = 'music'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Jazz', 'jazz', 'Jazz music'
FROM universes WHERE slug = 'music'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Blues', 'blues', 'Blues music'
FROM universes WHERE slug = 'music'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Rock', 'rock', 'Rock music'
FROM universes WHERE slug = 'music'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Pop', 'pop', 'Pop music'
FROM universes WHERE slug = 'music'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Reggae', 'reggae', 'Reggae music'
FROM universes WHERE slug = 'music'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Dancehall', 'dancehall', 'Dancehall music'
FROM universes WHERE slug = 'music'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Latin', 'latin', 'Latin music'
FROM universes WHERE slug = 'music'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Electro', 'electro', 'Electronic music'
FROM universes WHERE slug = 'music'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Gospel', 'gospel', 'Gospel music'
FROM universes WHERE slug = 'music'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Classique', 'classique', 'Classical music'
FROM universes WHERE slug = 'music'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Freestyle', 'freestyle', 'Freestyle performances'
FROM universes WHERE slug = 'music'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Clips', 'clips', 'Music videos'
FROM universes WHERE slug = 'music'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Lives', 'lives', 'Live performances'
FROM universes WHERE slug = 'music'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Concerts', 'concerts', 'Concert recordings'
FROM universes WHERE slug = 'music'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Exclus', 'exclus', 'Exclusive content'
FROM universes WHERE slug = 'music'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Beatmaking', 'beatmaking', 'Beat production'
FROM universes WHERE slug = 'music'
ON CONFLICT (slug) DO NOTHING;

-- Populate sub_universes for Game
INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'FPS', 'fps', 'First-person shooter games'
FROM universes WHERE slug = 'game'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Battle Royale', 'battle-royale', 'Battle royale games'
FROM universes WHERE slug = 'game'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'MOBA', 'moba', 'Multiplayer online battle arena'
FROM universes WHERE slug = 'game'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'RPG', 'rpg', 'Role-playing games'
FROM universes WHERE slug = 'game'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Sport', 'sport', 'Sports games'
FROM universes WHERE slug = 'game'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Stream', 'stream', 'Live gaming streams'
FROM universes WHERE slug = 'game'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Highlights', 'highlights', 'Best gaming moments'
FROM universes WHERE slug = 'game'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Tournois', 'tournois', 'Gaming tournaments'
FROM universes WHERE slug = 'game'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Speedrun', 'speedrun', 'Speedrun content'
FROM universes WHERE slug = 'game'
ON CONFLICT (slug) DO NOTHING;

-- Populate sub_universes for Learn (Know)
INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Formations', 'formations', 'Training and courses'
FROM universes WHERE slug = 'learn'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Finance', 'finance', 'Personal finance'
FROM universes WHERE slug = 'learn'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Crypto', 'crypto', 'Cryptocurrency and blockchain'
FROM universes WHERE slug = 'learn'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'IA', 'ia', 'Artificial intelligence'
FROM universes WHERE slug = 'learn'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Business', 'business', 'Business and entrepreneurship'
FROM universes WHERE slug = 'learn'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Marketing', 'marketing', 'Marketing strategies'
FROM universes WHERE slug = 'learn'
ON CONFLICT (slug) DO NOTHING;

-- Populate sub_universes for Culture
INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Podcasts', 'podcasts', 'Podcast episodes'
FROM universes WHERE slug = 'culture'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Débats', 'debats', 'Debates and discussions'
FROM universes WHERE slug = 'culture'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Storytelling', 'storytelling', 'Stories and narratives'
FROM universes WHERE slug = 'culture'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Cinéma', 'cinema', 'Film and cinema'
FROM universes WHERE slug = 'culture'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Humour', 'humour', 'Comedy and humor'
FROM universes WHERE slug = 'culture'
ON CONFLICT (slug) DO NOTHING;

-- Populate sub_universes for Life
INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Dating', 'dating', 'Dating and relationships'
FROM universes WHERE slug = 'life'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Rencontres', 'rencontres', 'Meeting people'
FROM universes WHERE slug = 'life'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Lives Privés', 'lives-prives', 'Private live streams'
FROM universes WHERE slug = 'life'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Vlogs', 'vlogs', 'Video blogs'
FROM universes WHERE slug = 'life'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Fitness', 'fitness', 'Fitness and exercise'
FROM universes WHERE slug = 'life'
ON CONFLICT (slug) DO NOTHING;

-- Create additional universes (Mind and Lean)
INSERT INTO universes (name, slug, description, color_primary, color_secondary)
VALUES
  ('Mind', 'mind', 'Personal development and spirituality', '#8B5CF6', '#A78BFA'),
  ('Lean', 'lean', 'Tech careers and development', '#10B981', '#34D399')
ON CONFLICT (slug) DO NOTHING;

-- Populate sub_universes for Mind
INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Développement Personnel', 'dev-personnel', 'Personal development'
FROM universes WHERE slug = 'mind'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Spiritualité', 'spiritualite', 'Spirituality and consciousness'
FROM universes WHERE slug = 'mind'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Méditation', 'meditation', 'Meditation practices'
FROM universes WHERE slug = 'mind'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Motivation', 'motivation', 'Motivational content'
FROM universes WHERE slug = 'mind'
ON CONFLICT (slug) DO NOTHING;

-- Populate sub_universes for Lean
INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Développeur', 'developpeur', 'Developer content'
FROM universes WHERE slug = 'lean'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Frontend', 'frontend', 'Frontend development'
FROM universes WHERE slug = 'lean'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Backend', 'backend', 'Backend development'
FROM universes WHERE slug = 'lean'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'UI/UX', 'ui-ux', 'UI and UX design'
FROM universes WHERE slug = 'lean'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sub_universes (universe_id, name, slug, description)
SELECT id, 'Cybersécurité', 'cybersecurite', 'Cybersecurity'
FROM universes WHERE slug = 'lean'
ON CONFLICT (slug) DO NOTHING;
