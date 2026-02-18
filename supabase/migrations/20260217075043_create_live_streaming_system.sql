/*
  # Système de Live Streaming TruTube

  1. Tables
    - live_streams: Sessions de live
    - live_stream_viewers: Spectateurs
    - live_stream_messages: Chat live

  2. Statistiques temps réel
    - Spectateurs actuels, totaux, moyens
    - Durée, tips, messages

  3. Sécurité RLS
*/

-- Type enum statut
DO $$ BEGIN
  CREATE TYPE live_stream_status AS ENUM ('scheduled', 'live', 'ended', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Table live_streams
CREATE TABLE IF NOT EXISTS live_streams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  universe_id uuid,
  sub_universe_id uuid,
  status live_stream_status NOT NULL DEFAULT 'scheduled',
  stream_key text,
  thumbnail_url text,
  scheduled_at timestamptz,
  started_at timestamptz,
  ended_at timestamptz,
  duration_seconds integer DEFAULT 0,
  peak_viewers integer DEFAULT 0,
  total_viewers integer DEFAULT 0,
  average_viewers numeric(10, 2) DEFAULT 0,
  total_tips numeric(10, 2) DEFAULT 0,
  total_messages integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table live_stream_viewers
CREATE TABLE IF NOT EXISTS live_stream_viewers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id uuid NOT NULL REFERENCES live_streams(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  joined_at timestamptz DEFAULT now(),
  left_at timestamptz,
  watch_duration_seconds integer DEFAULT 0
);

-- Table live_stream_messages
CREATE TABLE IF NOT EXISTS live_stream_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id uuid NOT NULL REFERENCES live_streams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  is_pinned boolean DEFAULT false,
  is_deleted boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_live_streams_creator ON live_streams(creator_id);
CREATE INDEX IF NOT EXISTS idx_live_streams_status ON live_streams(status);
CREATE INDEX IF NOT EXISTS idx_live_stream_viewers_stream ON live_stream_viewers(stream_id);
CREATE INDEX IF NOT EXISTS idx_live_stream_messages_stream ON live_stream_messages(stream_id);

-- Enable RLS
ALTER TABLE live_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_stream_viewers ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_stream_messages ENABLE ROW LEVEL SECURITY;

-- Policies live_streams
CREATE POLICY "Anyone can view live streams"
  ON live_streams FOR SELECT
  USING (true);

CREATE POLICY "Creators can insert streams"
  ON live_streams FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update streams"
  ON live_streams FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

-- Policies live_stream_viewers
CREATE POLICY "Anyone can view viewers"
  ON live_stream_viewers FOR SELECT
  USING (true);

CREATE POLICY "Users can join streams"
  ON live_stream_viewers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update viewer record"
  ON live_stream_viewers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Policies live_stream_messages
CREATE POLICY "Anyone can view messages"
  ON live_stream_messages FOR SELECT
  USING (NOT is_deleted);

CREATE POLICY "Users can send messages"
  ON live_stream_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Creators can moderate"
  ON live_stream_messages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM live_streams
      WHERE id = stream_id AND creator_id = auth.uid()
    )
  );