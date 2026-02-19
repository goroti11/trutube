/*
  # Optimize RLS Policies - Part 5: Channel Collaborators & Playlists
  
  1. Performance Optimization
    - Replace auth.uid() with (SELECT auth.uid()) in RLS policies
    - Tables: channel_collaborators, channel_playlists
  
  2. Consolidation
    - Merge duplicate permissive policies on channel_collaborators
    - Drop redundant "Collaborators * policy" duplicates
*/

-- channel_collaborators: Drop ALL existing policies first
DROP POLICY IF EXISTS "Channel owner can read collaborators" ON channel_collaborators;
DROP POLICY IF EXISTS "Collaborator can read own entry" ON channel_collaborators;
DROP POLICY IF EXISTS "Collaborators select policy" ON channel_collaborators;
DROP POLICY IF EXISTS "Channel owner can insert collaborators" ON channel_collaborators;
DROP POLICY IF EXISTS "Collaborators insert policy" ON channel_collaborators;
DROP POLICY IF EXISTS "Channel owner can update collaborators" ON channel_collaborators;
DROP POLICY IF EXISTS "Collaborator can accept own invite" ON channel_collaborators;
DROP POLICY IF EXISTS "Collaborators update policy" ON channel_collaborators;
DROP POLICY IF EXISTS "Channel owner can delete collaborators" ON channel_collaborators;
DROP POLICY IF EXISTS "Collaborators delete policy" ON channel_collaborators;

-- Recreate as single consolidated policies per action
CREATE POLICY "Channel owner or self can read collaborators"
  ON channel_collaborators FOR SELECT TO authenticated
  USING (
    (EXISTS ( SELECT 1 FROM creator_channels WHERE ((creator_channels.id = channel_collaborators.channel_id) AND (creator_channels.user_id = (SELECT auth.uid())))))
    OR (user_id = (SELECT auth.uid()))
  );

CREATE POLICY "Channel owner can insert collaborators"
  ON channel_collaborators FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS ( SELECT 1 FROM creator_channels WHERE ((creator_channels.id = channel_collaborators.channel_id) AND (creator_channels.user_id = (SELECT auth.uid()))))
  );

CREATE POLICY "Channel owner or self can update collaborators"
  ON channel_collaborators FOR UPDATE TO authenticated
  USING (
    (EXISTS ( SELECT 1 FROM creator_channels WHERE ((creator_channels.id = channel_collaborators.channel_id) AND (creator_channels.user_id = (SELECT auth.uid())))))
    OR (user_id = (SELECT auth.uid()))
  )
  WITH CHECK (
    (EXISTS ( SELECT 1 FROM creator_channels WHERE ((creator_channels.id = channel_collaborators.channel_id) AND (creator_channels.user_id = (SELECT auth.uid())))))
    OR (user_id = (SELECT auth.uid()))
  );

CREATE POLICY "Channel owner or self can delete collaborators"
  ON channel_collaborators FOR DELETE TO authenticated
  USING (
    (EXISTS ( SELECT 1 FROM creator_channels WHERE ((creator_channels.id = channel_collaborators.channel_id) AND (creator_channels.user_id = (SELECT auth.uid())))))
    OR (user_id = (SELECT auth.uid()))
  );

-- channel_playlists
DROP POLICY IF EXISTS "Playlists select policy" ON channel_playlists;
CREATE POLICY "Playlists select policy"
  ON channel_playlists FOR SELECT TO authenticated
  USING (
    (EXISTS ( SELECT 1 FROM creator_channels WHERE ((creator_channels.id = channel_playlists.channel_id) AND (creator_channels.user_id = (SELECT auth.uid())))))
    OR (visibility = 'public'::text)
  );

DROP POLICY IF EXISTS "Playlists insert policy" ON channel_playlists;
CREATE POLICY "Playlists insert policy"
  ON channel_playlists FOR INSERT TO authenticated
  WITH CHECK (
    ((SELECT auth.uid()) = user_id)
    AND (EXISTS ( SELECT 1 FROM creator_channels WHERE ((creator_channels.id = channel_playlists.channel_id) AND (creator_channels.user_id = (SELECT auth.uid())))))
  );

DROP POLICY IF EXISTS "Playlists update policy" ON channel_playlists;
CREATE POLICY "Playlists update policy"
  ON channel_playlists FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Playlists delete policy" ON channel_playlists;
CREATE POLICY "Playlists delete policy"
  ON channel_playlists FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = user_id);