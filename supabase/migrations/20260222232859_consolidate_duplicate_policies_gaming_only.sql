/*
  # Consolidate Duplicate Policies - Gaming Only
  
  Remove duplicate permissive policies for gaming tables
*/

-- gaming_team_members - Consolidate SELECT policies
DROP POLICY IF EXISTS "Captains can manage members" ON gaming_team_members;
DROP POLICY IF EXISTS "Team members can view team" ON gaming_team_members;

CREATE POLICY "Team members and captains can view"
  ON gaming_team_members FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid()) OR
    team_id IN (SELECT id FROM gaming_teams WHERE captain_id = (select auth.uid()))
  );

CREATE POLICY "Captains can manage members ops"
  ON gaming_team_members FOR INSERT
  TO authenticated
  WITH CHECK (
    team_id IN (SELECT id FROM gaming_teams WHERE captain_id = (select auth.uid()))
  );

CREATE POLICY "Captains can update members ops"
  ON gaming_team_members FOR UPDATE
  TO authenticated
  USING (
    team_id IN (SELECT id FROM gaming_teams WHERE captain_id = (select auth.uid()))
  )
  WITH CHECK (
    team_id IN (SELECT id FROM gaming_teams WHERE captain_id = (select auth.uid()))
  );

CREATE POLICY "Captains can delete members ops"
  ON gaming_team_members FOR DELETE
  TO authenticated
  USING (
    team_id IN (SELECT id FROM gaming_teams WHERE captain_id = (select auth.uid()))
  );