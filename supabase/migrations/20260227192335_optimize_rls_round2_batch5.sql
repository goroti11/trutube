/*
  # Optimize RLS Policies - Round 2 Batch 5 (Final)

  1. Optimized Policies (10 tables)
    - gaming_live_sessions
    - gaming_teams
    - creator_global_settings
    - creator_memberships
    - creator_monetization_status (uses user_id)
    - creator_revenue
    - monetization_suspensions (uses user_id)
    - notification_preferences
    - notifications
    - user_appearance_settings
    - user_feed_preferences
    - user_preferences

  2. Changes
    - Replace auth.uid() with (SELECT auth.uid())
*/

-- gaming_live_sessions
DROP POLICY IF EXISTS "Streamers can update own gaming sessions" ON gaming_live_sessions;
CREATE POLICY "Streamers can update own gaming sessions" ON gaming_live_sessions
  FOR UPDATE TO authenticated
  USING (streamer_id = (SELECT auth.uid()))
  WITH CHECK (streamer_id = (SELECT auth.uid()));

-- gaming_teams
DROP POLICY IF EXISTS "Captains can update their teams" ON gaming_teams;
CREATE POLICY "Captains can update their teams" ON gaming_teams
  FOR UPDATE TO authenticated
  USING (captain_id = (SELECT auth.uid()))
  WITH CHECK (captain_id = (SELECT auth.uid()));

-- creator_global_settings
DROP POLICY IF EXISTS "Creators can update own global settings" ON creator_global_settings;
CREATE POLICY "Creators can update own global settings" ON creator_global_settings
  FOR UPDATE TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

-- creator_memberships
DROP POLICY IF EXISTS "Users can update own memberships" ON creator_memberships;
CREATE POLICY "Users can update own memberships" ON creator_memberships
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- creator_monetization_status
DROP POLICY IF EXISTS "Users can update own monetization status" ON creator_monetization_status;
CREATE POLICY "Users can update own monetization status" ON creator_monetization_status
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- creator_revenue
DROP POLICY IF EXISTS "Creators can update own revenue" ON creator_revenue;
CREATE POLICY "Creators can update own revenue" ON creator_revenue
  FOR UPDATE TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

-- monetization_suspensions
DROP POLICY IF EXISTS "Users can update own appeal" ON monetization_suspensions;
CREATE POLICY "Users can update own appeal" ON monetization_suspensions
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- notification_preferences
DROP POLICY IF EXISTS "users_update_own_prefs" ON notification_preferences;
CREATE POLICY "users_update_own_prefs" ON notification_preferences
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- notifications
DROP POLICY IF EXISTS "users_update_own_notifications" ON notifications;
CREATE POLICY "users_update_own_notifications" ON notifications
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- user_appearance_settings
DROP POLICY IF EXISTS "Utilisateurs gèrent leur apparence" ON user_appearance_settings;
CREATE POLICY "Utilisateurs gèrent leur apparence" ON user_appearance_settings
  FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- user_feed_preferences
DROP POLICY IF EXISTS "users_feed_prefs_update_own" ON user_feed_preferences;
CREATE POLICY "users_feed_prefs_update_own" ON user_feed_preferences
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- user_preferences
DROP POLICY IF EXISTS "Users can manage own preferences" ON user_preferences;
CREATE POLICY "Users can manage own preferences" ON user_preferences
  FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- message_preferences
DROP POLICY IF EXISTS "message_preferences_update_own" ON message_preferences;
CREATE POLICY "message_preferences_update_own" ON message_preferences
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));
