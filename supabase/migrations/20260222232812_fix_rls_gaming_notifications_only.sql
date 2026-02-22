/*
  # Fix RLS Auth UID - Gaming and Notifications Only
  
  Optimize specific gaming and notification policies
*/

-- notifications
DROP POLICY IF EXISTS "Users update own notifications" ON notifications;
CREATE POLICY "Users update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users view own notifications" ON notifications;
CREATE POLICY "Users view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- notification_preferences
DROP POLICY IF EXISTS "Users can insert own prefs unified" ON notification_preferences;
CREATE POLICY "Users can insert own prefs unified"
  ON notification_preferences FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own prefs unified" ON notification_preferences;
CREATE POLICY "Users can update own prefs unified"
  ON notification_preferences FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can view own prefs unified" ON notification_preferences;
CREATE POLICY "Users can view own prefs unified"
  ON notification_preferences FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- notification_groups
DROP POLICY IF EXISTS "Users can view own groups unified" ON notification_groups;
CREATE POLICY "Users can view own groups unified"
  ON notification_groups FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- game_interactions
DROP POLICY IF EXISTS "Users can create interactions" ON game_interactions;
CREATE POLICY "Users can create interactions"
  ON game_interactions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- gaming_rules_acceptance
DROP POLICY IF EXISTS "Users can accept rules" ON gaming_rules_acceptance;
CREATE POLICY "Users can accept rules"
  ON gaming_rules_acceptance FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can view own rules" ON gaming_rules_acceptance;
CREATE POLICY "Users can view own rules"
  ON gaming_rules_acceptance FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- gaming_teams
DROP POLICY IF EXISTS "Captains can update teams" ON gaming_teams;
CREATE POLICY "Captains can update teams"
  ON gaming_teams FOR UPDATE
  TO authenticated
  USING (captain_id = (select auth.uid()))
  WITH CHECK (captain_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can create teams" ON gaming_teams;
CREATE POLICY "Users can create teams"
  ON gaming_teams FOR INSERT
  TO authenticated
  WITH CHECK (captain_id = (select auth.uid()));

-- gaming_team_members
DROP POLICY IF EXISTS "Captains can manage members" ON gaming_team_members;
CREATE POLICY "Captains can manage members"
  ON gaming_team_members FOR ALL
  TO authenticated
  USING (
    team_id IN (SELECT id FROM gaming_teams WHERE captain_id = (select auth.uid()))
  )
  WITH CHECK (
    team_id IN (SELECT id FROM gaming_teams WHERE captain_id = (select auth.uid()))
  );

DROP POLICY IF EXISTS "Team members can view team" ON gaming_team_members;
CREATE POLICY "Team members can view team"
  ON gaming_team_members FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid()) OR
    team_id IN (SELECT id FROM gaming_teams WHERE captain_id = (select auth.uid()))
  );

DROP POLICY IF EXISTS "Users can join teams" ON gaming_team_members;
CREATE POLICY "Users can join teams"
  ON gaming_team_members FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- tournament_participants
DROP POLICY IF EXISTS "Users can register for tournaments" ON tournament_participants;
CREATE POLICY "Users can register for tournaments"
  ON tournament_participants FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (select auth.uid()) OR
    team_id IN (SELECT id FROM gaming_teams WHERE captain_id = (select auth.uid()))
  );

-- tournament_prize_distribution
DROP POLICY IF EXISTS "Users can view own prizes" ON tournament_prize_distribution;
CREATE POLICY "Users can view own prizes"
  ON tournament_prize_distribution FOR SELECT
  TO authenticated
  USING (
    participant_id IN (
      SELECT id FROM tournament_participants WHERE user_id = (select auth.uid())
    )
  );

-- gaming_live_sessions
DROP POLICY IF EXISTS "Streamers can create sessions" ON gaming_live_sessions;
CREATE POLICY "Streamers can create sessions"
  ON gaming_live_sessions FOR INSERT
  TO authenticated
  WITH CHECK (streamer_id = (select auth.uid()));

DROP POLICY IF EXISTS "Streamers can update own sessions" ON gaming_live_sessions;
CREATE POLICY "Streamers can update own sessions"
  ON gaming_live_sessions FOR UPDATE
  TO authenticated
  USING (streamer_id = (select auth.uid()))
  WITH CHECK (streamer_id = (select auth.uid()));