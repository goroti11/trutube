/*
  # Channel Full Management System

  ## Summary
  Extends the creator_channels table and adds supporting tables for a complete
  channel management module:
  - Channel type (creator, artist, label, studio, brand)
  - Configurable page sections ordering
  - Playlist system (standard, series, album, course, season)
  - Extended collaborator roles with RLS
  - Notification preferences per channel

  ## Changes
  1. New columns on creator_channels: channel_type, intro_video_url,
     trailer_visitors_url, trailer_subscribers_url, channel_language,
     official_hashtags, notification_settings, page_sections_order
  2. New table: channel_playlists
  3. Extended channel_collaborators with proper RLS policies
*/

-- 1. Add new columns to creator_channels
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'creator_channels' AND column_name = 'channel_type'
  ) THEN
    ALTER TABLE public.creator_channels
      ADD COLUMN channel_type text NOT NULL DEFAULT 'creator',
      ADD COLUMN intro_video_url text,
      ADD COLUMN trailer_visitors_url text,
      ADD COLUMN trailer_subscribers_url text,
      ADD COLUMN channel_language text DEFAULT 'fr',
      ADD COLUMN official_hashtags text[] DEFAULT '{}',
      ADD COLUMN notification_settings jsonb DEFAULT '{"video_release": true, "album_release": true, "live_start": true, "merch_promo": false, "preorder": false}'::jsonb,
      ADD COLUMN page_sections_order text[] DEFAULT ARRAY['home','videos','shorts','albums','lives','store','playlists','community'];
  END IF;
END $$;

-- 2. Add check constraint on channel_type
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'creator_channels_channel_type_check'
  ) THEN
    ALTER TABLE public.creator_channels
      ADD CONSTRAINT creator_channels_channel_type_check
      CHECK (channel_type IN ('creator', 'artist', 'label', 'studio', 'brand'));
  END IF;
END $$;

-- 3. Create channel_playlists table
CREATE TABLE IF NOT EXISTS public.channel_playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid NOT NULL REFERENCES public.creator_channels(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  playlist_type text NOT NULL DEFAULT 'standard',
  thumbnail_url text,
  visibility text NOT NULL DEFAULT 'public',
  is_premium_locked boolean NOT NULL DEFAULT false,
  video_count integer NOT NULL DEFAULT 0,
  sort_order text NOT NULL DEFAULT 'manual',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT channel_playlists_type_check CHECK (playlist_type IN ('standard', 'series', 'album', 'course', 'season')),
  CONSTRAINT channel_playlists_visibility_check CHECK (visibility IN ('public', 'unlisted', 'private'))
);

ALTER TABLE public.channel_playlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Playlists select policy"
  ON public.channel_playlists FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.creator_channels
      WHERE creator_channels.id = channel_playlists.channel_id
      AND creator_channels.user_id = auth.uid()
    )
    OR visibility = 'public'
  );

CREATE POLICY "Playlists insert policy"
  ON public.channel_playlists FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.creator_channels
      WHERE creator_channels.id = channel_playlists.channel_id
      AND creator_channels.user_id = auth.uid()
    )
  );

CREATE POLICY "Playlists update policy"
  ON public.channel_playlists FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Playlists delete policy"
  ON public.channel_playlists FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 4. Ensure channel_collaborators has proper RLS
ALTER TABLE public.channel_collaborators ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Channel owners view collaborators" ON public.channel_collaborators;
DROP POLICY IF EXISTS "Channel owners manage collaborators" ON public.channel_collaborators;
DROP POLICY IF EXISTS "Channel owners insert collaborators" ON public.channel_collaborators;
DROP POLICY IF EXISTS "Channel owners update collaborators" ON public.channel_collaborators;
DROP POLICY IF EXISTS "Channel owners delete collaborators" ON public.channel_collaborators;

CREATE POLICY "Collaborators select policy"
  ON public.channel_collaborators FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.creator_channels
      WHERE creator_channels.id = channel_collaborators.channel_id
      AND creator_channels.user_id = auth.uid()
    )
    OR user_id = auth.uid()
  );

CREATE POLICY "Collaborators insert policy"
  ON public.channel_collaborators FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.creator_channels
      WHERE creator_channels.id = channel_collaborators.channel_id
      AND creator_channels.user_id = auth.uid()
    )
  );

CREATE POLICY "Collaborators update policy"
  ON public.channel_collaborators FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.creator_channels
      WHERE creator_channels.id = channel_collaborators.channel_id
      AND creator_channels.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.creator_channels
      WHERE creator_channels.id = channel_collaborators.channel_id
      AND creator_channels.user_id = auth.uid()
    )
  );

CREATE POLICY "Collaborators delete policy"
  ON public.channel_collaborators FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.creator_channels
      WHERE creator_channels.id = channel_collaborators.channel_id
      AND creator_channels.user_id = auth.uid()
    )
  );

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_channel_playlists_channel_id ON public.channel_playlists(channel_id);
CREATE INDEX IF NOT EXISTS idx_channel_playlists_user_id ON public.channel_playlists(user_id);
