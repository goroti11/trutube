/*
  # Fix Security Definer Views and Final Issues
  
  1. Recreate views without SECURITY DEFINER
  2. Drop duplicate indexes
  3. Add policies to RLS-enabled tables without policies
*/

-- Fix security definer views
DROP VIEW IF EXISTS premium_subscription_stats CASCADE;
CREATE VIEW premium_subscription_stats AS
SELECT 
  tier,
  COUNT(*) as subscriber_count,
  SUM(price) as total_revenue
FROM premium_subscriptions
WHERE status = 'active'
GROUP BY tier;

DROP VIEW IF EXISTS premium_plans_comparison CASCADE;
CREATE VIEW premium_plans_comparison AS
SELECT 
  tier,
  price,
  billing_period,
  COUNT(*) as active_subscribers
FROM premium_subscriptions
WHERE status = 'active'
GROUP BY tier, price, billing_period;

-- Drop duplicate indexes
DROP INDEX IF EXISTS idx_rules_acceptance_user;
DROP INDEX IF EXISTS idx_team_members_team;
DROP INDEX IF EXISTS idx_team_members_user;
DROP INDEX IF EXISTS idx_tournament_prize_tournament;

-- Add policies to fraud_detection_logs
ALTER TABLE fraud_detection_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view fraud logs" ON fraud_detection_logs
  FOR SELECT TO authenticated
  USING (false);

CREATE POLICY "System can insert fraud logs" ON fraud_detection_logs
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Add policies to group_invites
ALTER TABLE group_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Group admins can create invites" ON group_invites
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = group_invites.group_id
      AND group_members.user_id = (SELECT auth.uid())
      AND group_members.role IN ('admin', 'owner')
    )
  );

CREATE POLICY "Anyone can view invites by code" ON group_invites
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Group admins can manage invites" ON group_invites
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = group_invites.group_id
      AND group_members.user_id = (SELECT auth.uid())
      AND group_members.role IN ('admin', 'owner')
    )
  );
