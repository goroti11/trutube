/*
  # Optimize RLS Policies - Part 3

  1. Tables Updated
    - videos (3 policies)
    - video_bookmarks (3 policies)
    - video_downloads (1 policy)
    - video_clips (3 policies)
    - video_playlists (4 policies)
    - playlist_videos (3 policies)
*/

-- Videos
DROP POLICY IF EXISTS "Creators can insert own videos" ON videos;
CREATE POLICY "Creators can insert own videos"
  ON videos FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Creators can update own videos" ON videos;
CREATE POLICY "Creators can update own videos"
  ON videos FOR UPDATE
  TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

-- Video Bookmarks
DROP POLICY IF EXISTS "Users can create own bookmarks" ON video_bookmarks;
CREATE POLICY "Users can create own bookmarks"
  ON video_bookmarks FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete own bookmarks" ON video_bookmarks;
CREATE POLICY "Users can delete own bookmarks"
  ON video_bookmarks FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view own bookmarks" ON video_bookmarks;
CREATE POLICY "Users can view own bookmarks"
  ON video_bookmarks FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- Video Downloads
DROP POLICY IF EXISTS "Users can view own downloads" ON video_downloads;
CREATE POLICY "Users can view own downloads"
  ON video_downloads FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- Video Clips
DROP POLICY IF EXISTS "Users can create clips" ON video_clips;
CREATE POLICY "Users can create clips"
  ON video_clips FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete own clips" ON video_clips;
CREATE POLICY "Users can delete own clips"
  ON video_clips FOR DELETE
  TO authenticated
  USING (creator_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own clips" ON video_clips;
CREATE POLICY "Users can update own clips"
  ON video_clips FOR UPDATE
  TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

-- Video Playlists
DROP POLICY IF EXISTS "Anyone can view public playlists" ON video_playlists;
CREATE POLICY "Anyone can view public playlists"
  ON video_playlists FOR SELECT
  TO authenticated
  USING (
    is_public = true 
    OR user_id = (SELECT auth.uid())
  );

DROP POLICY IF EXISTS "Users can create playlists" ON video_playlists;
CREATE POLICY "Users can create playlists"
  ON video_playlists FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete own playlists" ON video_playlists;
CREATE POLICY "Users can delete own playlists"
  ON video_playlists FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own playlists" ON video_playlists;
CREATE POLICY "Users can update own playlists"
  ON video_playlists FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- Playlist Videos
DROP POLICY IF EXISTS "Anyone can view playlist videos from public playlists" ON playlist_videos;
CREATE POLICY "Anyone can view playlist videos from public playlists"
  ON playlist_videos FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM video_playlists
      WHERE video_playlists.id = playlist_videos.playlist_id
      AND (video_playlists.is_public = true OR video_playlists.user_id = (SELECT auth.uid()))
    )
  );

DROP POLICY IF EXISTS "Users can add videos to own playlists" ON playlist_videos;
CREATE POLICY "Users can add videos to own playlists"
  ON playlist_videos FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM video_playlists
      WHERE video_playlists.id = playlist_videos.playlist_id
      AND video_playlists.user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can remove videos from own playlists" ON playlist_videos;
CREATE POLICY "Users can remove videos from own playlists"
  ON playlist_videos FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM video_playlists
      WHERE video_playlists.id = playlist_videos.playlist_id
      AND video_playlists.user_id = (SELECT auth.uid())
    )
  );