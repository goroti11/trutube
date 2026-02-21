/*
  # Optimize RLS Policies - Part 3: Videos and Content

  1. Performance Improvements
    - Wraps auth.uid() calls in SELECT to prevent re-evaluation per row

  2. Tables Affected (Part 3)
    - video_downloads
    - video_clips
    - video_playlists
    - playlist_videos
    - video_reactions
*/

-- video_downloads policies
DROP POLICY IF EXISTS "Users can view own downloads" ON public.video_downloads;
CREATE POLICY "Users can view own downloads"
  ON public.video_downloads
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- video_clips policies
DROP POLICY IF EXISTS "Users can create clips" ON public.video_clips;
CREATE POLICY "Users can create clips"
  ON public.video_clips
  FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own clips" ON public.video_clips;
CREATE POLICY "Users can update own clips"
  ON public.video_clips
  FOR UPDATE
  TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete own clips" ON public.video_clips;
CREATE POLICY "Users can delete own clips"
  ON public.video_clips
  FOR DELETE
  TO authenticated
  USING (creator_id = (SELECT auth.uid()));

-- video_playlists policies
DROP POLICY IF EXISTS "Anyone can view public playlists" ON public.video_playlists;
CREATE POLICY "Anyone can view public playlists"
  ON public.video_playlists
  FOR SELECT
  TO authenticated
  USING (
    is_public = true
    OR user_id = (SELECT auth.uid())
  );

DROP POLICY IF EXISTS "Users can create playlists" ON public.video_playlists;
CREATE POLICY "Users can create playlists"
  ON public.video_playlists
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own playlists" ON public.video_playlists;
CREATE POLICY "Users can update own playlists"
  ON public.video_playlists
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete own playlists" ON public.video_playlists;
CREATE POLICY "Users can delete own playlists"
  ON public.video_playlists
  FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- playlist_videos policies
DROP POLICY IF EXISTS "Anyone can view playlist videos from public playlists" ON public.playlist_videos;
CREATE POLICY "Anyone can view playlist videos from public playlists"
  ON public.playlist_videos
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.video_playlists
      WHERE video_playlists.id = playlist_videos.playlist_id
      AND (video_playlists.is_public = true OR video_playlists.user_id = (SELECT auth.uid()))
    )
  );

DROP POLICY IF EXISTS "Users can add videos to own playlists" ON public.playlist_videos;
CREATE POLICY "Users can add videos to own playlists"
  ON public.playlist_videos
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.video_playlists
      WHERE video_playlists.id = playlist_videos.playlist_id
      AND video_playlists.user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can remove videos from own playlists" ON public.playlist_videos;
CREATE POLICY "Users can remove videos from own playlists"
  ON public.playlist_videos
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.video_playlists
      WHERE video_playlists.id = playlist_videos.playlist_id
      AND video_playlists.user_id = (SELECT auth.uid())
    )
  );

-- video_reactions policies
DROP POLICY IF EXISTS "Users can view own reactions" ON public.video_reactions;
CREATE POLICY "Users can view own reactions"
  ON public.video_reactions
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can create reactions" ON public.video_reactions;
CREATE POLICY "Users can create reactions"
  ON public.video_reactions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own reactions" ON public.video_reactions;
CREATE POLICY "Users can update own reactions"
  ON public.video_reactions
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete own reactions" ON public.video_reactions;
CREATE POLICY "Users can delete own reactions"
  ON public.video_reactions
  FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));
