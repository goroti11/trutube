/*
  # Optimize RLS Policies - Video Features Batch 2
  
  Tables:
  - video_bookmarks
  - video_downloads
  - video_clips
  - video_playlists
  - playlist_videos
  - video_reactions
*/

-- video_bookmarks
DROP POLICY IF EXISTS "Users can create own bookmarks" ON video_bookmarks;
DROP POLICY IF EXISTS "Users can delete own bookmarks" ON video_bookmarks;
DROP POLICY IF EXISTS "Users can view own bookmarks" ON video_bookmarks;

CREATE POLICY "Users can create own bookmarks" ON video_bookmarks
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own bookmarks" ON video_bookmarks
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can view own bookmarks" ON video_bookmarks
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- video_downloads
DROP POLICY IF EXISTS "Users can view own downloads" ON video_downloads;

CREATE POLICY "Users can view own downloads" ON video_downloads
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- video_clips
DROP POLICY IF EXISTS "Users can create clips" ON video_clips;
DROP POLICY IF EXISTS "Users can delete own clips" ON video_clips;
DROP POLICY IF EXISTS "Users can update own clips" ON video_clips;

CREATE POLICY "Users can create clips" ON video_clips
  FOR INSERT TO authenticated
  WITH CHECK (creator_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own clips" ON video_clips
  FOR DELETE TO authenticated
  USING (creator_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own clips" ON video_clips
  FOR UPDATE TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

-- video_playlists
DROP POLICY IF EXISTS "Anyone can view public playlists" ON video_playlists;
DROP POLICY IF EXISTS "Users can create playlists" ON video_playlists;
DROP POLICY IF EXISTS "Users can delete own playlists" ON video_playlists;
DROP POLICY IF EXISTS "Users can update own playlists" ON video_playlists;

CREATE POLICY "Anyone can view public playlists" ON video_playlists
  FOR SELECT TO authenticated
  USING (is_public = true OR user_id = (SELECT auth.uid()));

CREATE POLICY "Users can create playlists" ON video_playlists
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own playlists" ON video_playlists
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own playlists" ON video_playlists
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- playlist_videos
DROP POLICY IF EXISTS "Anyone can view playlist videos from public playlists" ON playlist_videos;
DROP POLICY IF EXISTS "Users can add videos to own playlists" ON playlist_videos;
DROP POLICY IF EXISTS "Users can remove videos from own playlists" ON playlist_videos;

CREATE POLICY "Anyone can view playlist videos from public playlists" ON playlist_videos
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM video_playlists 
      WHERE video_playlists.id = playlist_videos.playlist_id 
      AND (video_playlists.is_public = true OR video_playlists.user_id = (SELECT auth.uid()))
    )
  );

CREATE POLICY "Users can add videos to own playlists" ON playlist_videos
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM video_playlists 
      WHERE video_playlists.id = playlist_videos.playlist_id 
      AND video_playlists.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can remove videos from own playlists" ON playlist_videos
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM video_playlists 
      WHERE video_playlists.id = playlist_videos.playlist_id 
      AND video_playlists.user_id = (SELECT auth.uid())
    )
  );

-- video_reactions
DROP POLICY IF EXISTS "Users can create reactions" ON video_reactions;
DROP POLICY IF EXISTS "Users can delete own reactions" ON video_reactions;
DROP POLICY IF EXISTS "Users can update own reactions" ON video_reactions;
DROP POLICY IF EXISTS "Users can view own reactions" ON video_reactions;

CREATE POLICY "Users can create reactions" ON video_reactions
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own reactions" ON video_reactions
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own reactions" ON video_reactions
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can view own reactions" ON video_reactions
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));
