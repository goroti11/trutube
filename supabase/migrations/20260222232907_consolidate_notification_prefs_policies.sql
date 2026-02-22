/*
  # Consolidate Notification Preferences Policies
  
  Remove duplicate policies on notification_preferences
*/

-- Drop all duplicate policies on notification_preferences
DROP POLICY IF EXISTS "Users can insert own prefs unified" ON notification_preferences;
DROP POLICY IF EXISTS "Users manage own preferences" ON notification_preferences;

-- Create single INSERT policy
CREATE POLICY "Users can manage own prefs insert"
  ON notification_preferences FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- Drop duplicate SELECT policies
DROP POLICY IF EXISTS "Users can view own prefs unified" ON notification_preferences;

-- Keep only one SELECT policy (already exists as "Users can view own prefs unified")

-- Drop duplicate UPDATE policies
DROP POLICY IF EXISTS "Users can update own prefs unified" ON notification_preferences;

-- Create single UPDATE policy
CREATE POLICY "Users can manage own prefs update"
  ON notification_preferences FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));