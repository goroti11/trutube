/*
  # Optimize RLS Policies - Round 2 Batch 3

  1. Optimized Policies (10 tables)
    - videos
    - video_clips
    - video_playlists
    - video_reactions
    - voice_consent
    - watch_sessions
    - withdrawal_requests
    - music_albums
    - music_tracks
    - services

  2. Changes
    - Replace auth.uid() with (SELECT auth.uid())
*/

-- videos
DROP POLICY IF EXISTS "Creators can update own videos" ON videos;
CREATE POLICY "Creators can update own videos" ON videos
  FOR UPDATE TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

-- video_clips
DROP POLICY IF EXISTS "Users can update own clips" ON video_clips;
CREATE POLICY "Users can update own clips" ON video_clips
  FOR UPDATE TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

-- video_playlists
DROP POLICY IF EXISTS "Users can update own playlists" ON video_playlists;
CREATE POLICY "Users can update own playlists" ON video_playlists
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- video_reactions
DROP POLICY IF EXISTS "Users can update own reactions" ON video_reactions;
CREATE POLICY "Users can update own reactions" ON video_reactions
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- voice_consent
DROP POLICY IF EXISTS "Creators can manage own voice consent" ON voice_consent;
CREATE POLICY "Creators can manage own voice consent" ON voice_consent
  FOR ALL TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

-- watch_sessions
DROP POLICY IF EXISTS "Users can update own watch sessions" ON watch_sessions;
CREATE POLICY "Users can update own watch sessions" ON watch_sessions
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- withdrawal_requests
DROP POLICY IF EXISTS "Creators can update own withdrawal requests" ON withdrawal_requests;
CREATE POLICY "Creators can update own withdrawal requests" ON withdrawal_requests
  FOR UPDATE TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

-- music_albums
DROP POLICY IF EXISTS "Creators manage own albums" ON music_albums;
CREATE POLICY "Creators manage own albums" ON music_albums
  FOR ALL TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

-- music_tracks
DROP POLICY IF EXISTS "Creators manage own tracks" ON music_tracks;
CREATE POLICY "Creators manage own tracks" ON music_tracks
  FOR ALL TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

-- services
DROP POLICY IF EXISTS "Creators manage own services" ON services;
CREATE POLICY "Creators manage own services" ON services
  FOR ALL TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));
