/*
  # Optimize RLS Policies - Part 1

  1. Performance Optimization
    - Replace auth.uid() with (SELECT auth.uid()) in RLS policies
    - Prevents re-evaluation for each row
    - Significantly improves query performance at scale

  2. Tables Updated
    - user_settings (4 policies)
    - support_tickets (1 policy)
    - ad_campaigns (4 policies)
    - ad_impressions (1 policy)
    - premium_subscriptions (3 policies)
*/

-- User Settings
DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert own settings" ON user_settings;
CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;
CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete own settings" ON user_settings;
CREATE POLICY "Users can delete own settings"
  ON user_settings FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- Support Tickets
DROP POLICY IF EXISTS "Users can view own tickets" ON support_tickets;
CREATE POLICY "Users can view own tickets"
  ON support_tickets FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- Ad Campaigns
DROP POLICY IF EXISTS "Creators can view own campaigns" ON ad_campaigns;
CREATE POLICY "Creators can view own campaigns"
  ON ad_campaigns FOR SELECT
  TO authenticated
  USING (creator_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Creators can create campaigns" ON ad_campaigns;
CREATE POLICY "Creators can create campaigns"
  ON ad_campaigns FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Creators can update own campaigns" ON ad_campaigns;
CREATE POLICY "Creators can update own campaigns"
  ON ad_campaigns FOR UPDATE
  TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Creators can delete own campaigns" ON ad_campaigns;
CREATE POLICY "Creators can delete own campaigns"
  ON ad_campaigns FOR DELETE
  TO authenticated
  USING (creator_id = (SELECT auth.uid()));

-- Ad Impressions
DROP POLICY IF EXISTS "Campaign owners can view campaign impressions" ON ad_impressions;
CREATE POLICY "Campaign owners can view campaign impressions"
  ON ad_impressions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ad_campaigns
      WHERE ad_campaigns.id = ad_impressions.campaign_id
      AND ad_campaigns.creator_id = (SELECT auth.uid())
    )
  );

-- Premium Subscriptions
DROP POLICY IF EXISTS "Users can view own premium subscription" ON premium_subscriptions;
CREATE POLICY "Users can view own premium subscription"
  ON premium_subscriptions FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert own premium subscription" ON premium_subscriptions;
CREATE POLICY "Users can insert own premium subscription"
  ON premium_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own premium subscription" ON premium_subscriptions;
CREATE POLICY "Users can update own premium subscription"
  ON premium_subscriptions FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));