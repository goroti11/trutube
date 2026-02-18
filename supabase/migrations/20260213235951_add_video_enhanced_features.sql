/*
  # Enhanced Video Features

  ## Overview
  Adds enhanced features for videos including:
  - Dislike count
  - Hashtags
  - Transcript
  - Video saves/bookmarks
  - Video downloads tracking
  - Video clips

  ## New Tables
  
  ### video_bookmarks
  Stores user bookmarks/saved videos
  
  ### video_downloads
  Tracks video downloads
  
  ### video_clips
  User-created clips from videos
  
  ### video_playlists
  Custom playlists created by users
  
  ### playlist_videos
  Videos in playlists

  ## Schema Changes
  - Add dislike_count to videos
  - Add hashtags to videos
  - Add transcript to videos
  - Add saved_count to videos

  ## Security
  - Enable RLS on all new tables
  - Proper access control
*/

-- Add new fields to videos table
DO $$
BEGIN
  ALTER TABLE videos ADD COLUMN IF NOT EXISTS dislike_count integer DEFAULT 0;
  ALTER TABLE videos ADD COLUMN IF NOT EXISTS hashtags text[] DEFAULT '{}';
  ALTER TABLE videos ADD COLUMN IF NOT EXISTS transcript text DEFAULT '';
  ALTER TABLE videos ADD COLUMN IF NOT EXISTS saved_count integer DEFAULT 0;
  ALTER TABLE videos ADD COLUMN IF NOT EXISTS download_count integer DEFAULT 0;
EXCEPTION
  WHEN duplicate_column THEN NULL;
END $$;

-- Video bookmarks table
CREATE TABLE IF NOT EXISTS video_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, video_id)
);

-- Video downloads table
CREATE TABLE IF NOT EXISTS video_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  quality text DEFAULT '1080p',
  downloaded_at timestamptz DEFAULT now()
);

-- Video clips table
CREATE TABLE IF NOT EXISTS video_clips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  original_video_id uuid REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  start_time integer NOT NULL,
  end_time integer NOT NULL,
  duration integer NOT NULL,
  thumbnail_url text DEFAULT '',
  view_count integer DEFAULT 0,
  like_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Video playlists table
CREATE TABLE IF NOT EXISTS video_playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  is_public boolean DEFAULT true,
  video_count integer DEFAULT 0,
  thumbnail_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Playlist videos junction table
CREATE TABLE IF NOT EXISTS playlist_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id uuid REFERENCES video_playlists(id) ON DELETE CASCADE NOT NULL,
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  position integer DEFAULT 0,
  added_at timestamptz DEFAULT now(),
  UNIQUE(playlist_id, video_id)
);

-- Video likes/dislikes tracking
CREATE TABLE IF NOT EXISTS video_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  reaction_type text NOT NULL CHECK (reaction_type IN ('like', 'dislike')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, video_id)
);

-- Enable RLS
ALTER TABLE video_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_clips ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_reactions ENABLE ROW LEVEL SECURITY;

-- Policies for video_bookmarks
CREATE POLICY "Users can view own bookmarks"
  ON video_bookmarks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookmarks"
  ON video_bookmarks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
  ON video_bookmarks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for video_downloads
CREATE POLICY "Users can view own downloads"
  ON video_downloads FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can track downloads"
  ON video_downloads FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policies for video_clips
CREATE POLICY "Anyone can view clips"
  ON video_clips FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can create clips"
  ON video_clips FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update own clips"
  ON video_clips FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can delete own clips"
  ON video_clips FOR DELETE
  TO authenticated
  USING (auth.uid() = creator_id);

-- Policies for video_playlists
CREATE POLICY "Anyone can view public playlists"
  ON video_playlists FOR SELECT
  TO authenticated, anon
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create playlists"
  ON video_playlists FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own playlists"
  ON video_playlists FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own playlists"
  ON video_playlists FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for playlist_videos
CREATE POLICY "Anyone can view playlist videos from public playlists"
  ON playlist_videos FOR SELECT
  TO authenticated, anon
  USING (
    EXISTS (
      SELECT 1 FROM video_playlists
      WHERE video_playlists.id = playlist_videos.playlist_id
      AND (video_playlists.is_public = true OR video_playlists.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can add videos to own playlists"
  ON playlist_videos FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM video_playlists
      WHERE video_playlists.id = playlist_videos.playlist_id
      AND video_playlists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove videos from own playlists"
  ON playlist_videos FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM video_playlists
      WHERE video_playlists.id = playlist_videos.playlist_id
      AND video_playlists.user_id = auth.uid()
    )
  );

-- Policies for video_reactions
CREATE POLICY "Users can view own reactions"
  ON video_reactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create reactions"
  ON video_reactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reactions"
  ON video_reactions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reactions"
  ON video_reactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_video_bookmarks_user ON video_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_video_bookmarks_video ON video_bookmarks(video_id);
CREATE INDEX IF NOT EXISTS idx_video_downloads_video ON video_downloads(video_id);
CREATE INDEX IF NOT EXISTS idx_video_clips_original ON video_clips(original_video_id);
CREATE INDEX IF NOT EXISTS idx_video_clips_creator ON video_clips(creator_id);
CREATE INDEX IF NOT EXISTS idx_video_playlists_user ON video_playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_playlist_videos_playlist ON playlist_videos(playlist_id);
CREATE INDEX IF NOT EXISTS idx_playlist_videos_video ON playlist_videos(video_id);
CREATE INDEX IF NOT EXISTS idx_video_reactions_user_video ON video_reactions(user_id, video_id);
CREATE INDEX IF NOT EXISTS idx_videos_hashtags ON videos USING gin(hashtags);

-- Function to toggle video bookmark
CREATE OR REPLACE FUNCTION toggle_video_bookmark(p_user_id uuid, p_video_id uuid)
RETURNS boolean AS $$
DECLARE
  bookmark_exists boolean;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM video_bookmarks
    WHERE user_id = p_user_id AND video_id = p_video_id
  ) INTO bookmark_exists;

  IF bookmark_exists THEN
    DELETE FROM video_bookmarks
    WHERE user_id = p_user_id AND video_id = p_video_id;

    UPDATE videos
    SET saved_count = GREATEST(saved_count - 1, 0)
    WHERE id = p_video_id;

    RETURN false;
  ELSE
    INSERT INTO video_bookmarks (user_id, video_id)
    VALUES (p_user_id, p_video_id);

    UPDATE videos
    SET saved_count = saved_count + 1
    WHERE id = p_video_id;

    RETURN true;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to toggle video reaction
CREATE OR REPLACE FUNCTION toggle_video_reaction(
  p_user_id uuid,
  p_video_id uuid,
  p_reaction_type text
)
RETURNS void AS $$
DECLARE
  current_reaction text;
BEGIN
  SELECT reaction_type INTO current_reaction
  FROM video_reactions
  WHERE user_id = p_user_id AND video_id = p_video_id;

  IF current_reaction IS NULL THEN
    INSERT INTO video_reactions (user_id, video_id, reaction_type)
    VALUES (p_user_id, p_video_id, p_reaction_type);

    IF p_reaction_type = 'like' THEN
      UPDATE videos SET like_count = like_count + 1 WHERE id = p_video_id;
    ELSE
      UPDATE videos SET dislike_count = dislike_count + 1 WHERE id = p_video_id;
    END IF;
  ELSIF current_reaction = p_reaction_type THEN
    DELETE FROM video_reactions
    WHERE user_id = p_user_id AND video_id = p_video_id;

    IF p_reaction_type = 'like' THEN
      UPDATE videos SET like_count = GREATEST(like_count - 1, 0) WHERE id = p_video_id;
    ELSE
      UPDATE videos SET dislike_count = GREATEST(dislike_count - 1, 0) WHERE id = p_video_id;
    END IF;
  ELSE
    UPDATE video_reactions
    SET reaction_type = p_reaction_type
    WHERE user_id = p_user_id AND video_id = p_video_id;

    IF p_reaction_type = 'like' THEN
      UPDATE videos
      SET like_count = like_count + 1, dislike_count = GREATEST(dislike_count - 1, 0)
      WHERE id = p_video_id;
    ELSE
      UPDATE videos
      SET dislike_count = dislike_count + 1, like_count = GREATEST(like_count - 1, 0)
      WHERE id = p_video_id;
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add video to playlist
CREATE OR REPLACE FUNCTION add_video_to_playlist(
  p_playlist_id uuid,
  p_video_id uuid
)
RETURNS void AS $$
DECLARE
  max_position integer;
BEGIN
  SELECT COALESCE(MAX(position), -1) + 1 INTO max_position
  FROM playlist_videos
  WHERE playlist_id = p_playlist_id;

  INSERT INTO playlist_videos (playlist_id, video_id, position)
  VALUES (p_playlist_id, p_video_id, max_position)
  ON CONFLICT (playlist_id, video_id) DO NOTHING;

  UPDATE video_playlists
  SET video_count = video_count + 1, updated_at = now()
  WHERE id = p_playlist_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;