/*
  # Goroti Complete Database Schema

  ## 1. New Tables
  
  ### `profiles`
  User profiles with creator/supporter status
  
  ### `universes`
  Content categories (MusicVerse, GameVerse, etc.)
  
  ### `videos`
  Video content with engagement metrics
  
  ### `video_scores`
  Algorithmic scoring for each video
  
  ### `subscriptions`
  Creator subscriptions (Silver, Gold, Platinum)
  
  ### `tips`
  One-time payments to creators
  
  ### `messages`
  Direct messages between supporters and creators
  
  ### `creator_revenue`
  Revenue tracking for creators
  
  ### `comments`
  Video comments

  ## 2. Security
  - Enable RLS on all tables
  - Authenticated users can view public content
  - Creators can manage own content
  - Supporters can message creators they support
*/

-- Create enums
DO $$ BEGIN
  CREATE TYPE user_status AS ENUM ('viewer', 'supporter', 'creator', 'pro', 'elite');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE subscription_tier AS ENUM ('silver', 'gold', 'platinum');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  display_name text NOT NULL,
  avatar_url text,
  bio text DEFAULT '',
  user_status user_status DEFAULT 'viewer',
  subscriber_count integer DEFAULT 0,
  upload_frequency integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Universes table
CREATE TABLE IF NOT EXISTS universes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  color_primary text DEFAULT '#00BFFF',
  color_secondary text DEFAULT '#FF7F50',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE universes ENABLE ROW LEVEL SECURITY;

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  universe_id uuid REFERENCES universes(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text DEFAULT '',
  thumbnail_url text,
  video_url text,
  duration integer DEFAULT 0,
  is_short boolean DEFAULT false,
  is_premium boolean DEFAULT false,
  view_count integer DEFAULT 0,
  like_count integer DEFAULT 0,
  comment_count integer DEFAULT 0,
  avg_watch_time float DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Video scores table
CREATE TABLE IF NOT EXISTS video_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE UNIQUE NOT NULL,
  engagement_score float DEFAULT 0,
  support_score float DEFAULT 0,
  freshness_score float DEFAULT 0,
  diversity_boost float DEFAULT 0,
  final_score float DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE video_scores ENABLE ROW LEVEL SECURITY;

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supporter_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tier subscription_tier DEFAULT 'silver',
  amount decimal(10,2) NOT NULL,
  status subscription_status DEFAULT 'active',
  started_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT now() + interval '30 days'
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Tips table
CREATE TABLE IF NOT EXISTS tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  to_creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount decimal(10,2) NOT NULL,
  message text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tips ENABLE ROW LEVEL SECURITY;

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  to_creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Creator revenue table
CREATE TABLE IF NOT EXISTS creator_revenue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  total_revenue decimal(10,2) DEFAULT 0,
  subscription_revenue decimal(10,2) DEFAULT 0,
  tips_revenue decimal(10,2) DEFAULT 0,
  premium_revenue decimal(10,2) DEFAULT 0,
  live_revenue decimal(10,2) DEFAULT 0,
  month date DEFAULT date_trunc('month', now()),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE creator_revenue ENABLE ROW LEVEL SECURITY;

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  like_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for universes
CREATE POLICY "Anyone can view universes"
  ON universes FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for videos
CREATE POLICY "Anyone can view public videos"
  ON videos FOR SELECT
  TO authenticated
  USING (NOT is_premium OR creator_id = auth.uid() OR EXISTS (
    SELECT 1 FROM subscriptions
    WHERE supporter_id = auth.uid()
    AND creator_id = videos.creator_id
    AND status = 'active'
  ));

CREATE POLICY "Creators can insert own videos"
  ON videos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update own videos"
  ON videos FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can delete own videos"
  ON videos FOR DELETE
  TO authenticated
  USING (auth.uid() = creator_id);

-- RLS Policies for video_scores
CREATE POLICY "Anyone can view video scores"
  ON video_scores FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can manage video scores"
  ON video_scores FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM videos
    WHERE videos.id = video_scores.video_id
    AND videos.creator_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM videos
    WHERE videos.id = video_scores.video_id
    AND videos.creator_id = auth.uid()
  ));

-- RLS Policies for subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = supporter_id OR auth.uid() = creator_id);

CREATE POLICY "Users can create subscriptions"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = supporter_id);

CREATE POLICY "Users can update own subscriptions"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = supporter_id)
  WITH CHECK (auth.uid() = supporter_id);

-- RLS Policies for tips
CREATE POLICY "Users can view own tips"
  ON tips FOR SELECT
  TO authenticated
  USING (auth.uid() = from_user_id OR auth.uid() = to_creator_id);

CREATE POLICY "Users can send tips"
  ON tips FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = from_user_id);

-- RLS Policies for messages
CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  TO authenticated
  USING (auth.uid() = from_user_id OR auth.uid() = to_creator_id);

CREATE POLICY "Supporters can message creators"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = from_user_id
    AND EXISTS (
      SELECT 1 FROM subscriptions
      WHERE supporter_id = auth.uid()
      AND creator_id = messages.to_creator_id
      AND status = 'active'
    )
  );

CREATE POLICY "Users can update own messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = to_creator_id)
  WITH CHECK (auth.uid() = to_creator_id);

-- RLS Policies for creator_revenue
CREATE POLICY "Creators can view own revenue"
  ON creator_revenue FOR SELECT
  TO authenticated
  USING (auth.uid() = creator_id);

CREATE POLICY "Creators can update own revenue"
  ON creator_revenue FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

-- RLS Policies for comments
CREATE POLICY "Anyone can view comments"
  ON comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert default universes
INSERT INTO universes (name, slug, description, color_primary, color_secondary)
VALUES
  ('MusicVerse', 'music', 'Clips, lives, freestyles', '#FF1493', '#FF69B4'),
  ('GameVerse', 'game', 'Streams, highlights, tournaments', '#00FF00', '#32CD32'),
  ('LearnVerse', 'learn', 'Formations, tutorials, crypto, AI', '#FFD700', '#FFA500'),
  ('CultureVerse', 'culture', 'Podcasts, debates, storytelling', '#9370DB', '#BA55D3'),
  ('LifeVerse', 'life', 'Lifestyle, private lives, meetings', '#FF6347', '#FF4500')
ON CONFLICT (slug) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_videos_creator_id ON videos(creator_id);
CREATE INDEX IF NOT EXISTS idx_videos_universe_id ON videos(universe_id);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_video_scores_final_score ON video_scores(final_score DESC);
CREATE INDEX IF NOT EXISTS idx_subscriptions_supporter_creator ON subscriptions(supporter_id, creator_id);
CREATE INDEX IF NOT EXISTS idx_comments_video_id ON comments(video_id);
CREATE INDEX IF NOT EXISTS idx_messages_to_creator ON messages(to_creator_id, is_read);
