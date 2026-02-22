/*
  # Fix RLS Auth UID Optimization - Batch 2
  
  Optimize live gaming and notification RLS policies
*/

-- live_game_templates
DROP POLICY IF EXISTS "Creators manage own templates" ON live_game_templates;
CREATE POLICY "Creators manage own templates"
  ON live_game_templates FOR ALL
  TO authenticated
  USING (creator_id = (select auth.uid()))
  WITH CHECK (creator_id = (select auth.uid()));

-- live_game_sessions
DROP POLICY IF EXISTS "Creators manage stream sessions" ON live_game_sessions;
CREATE POLICY "Creators manage stream sessions"
  ON live_game_sessions FOR ALL
  TO authenticated
  USING (
    stream_id IN (
      SELECT id FROM live_streams WHERE creator_id = (select auth.uid())
    )
  )
  WITH CHECK (
    stream_id IN (
      SELECT id FROM live_streams WHERE creator_id = (select auth.uid())
    )
  );

-- live_game_actions
DROP POLICY IF EXISTS "Users create own actions" ON live_game_actions;
CREATE POLICY "Users create own actions"
  ON live_game_actions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- live_game_rewards
DROP POLICY IF EXISTS "Users view own rewards" ON live_game_rewards;
CREATE POLICY "Users view own rewards"
  ON live_game_rewards FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- user_earned_badges
DROP POLICY IF EXISTS "Users view own badges" ON user_earned_badges;
CREATE POLICY "Users view own badges"
  ON user_earned_badges FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- live_community_challenges
DROP POLICY IF EXISTS "Creators manage challenges" ON live_community_challenges;
CREATE POLICY "Creators manage challenges"
  ON live_community_challenges FOR ALL
  TO authenticated
  USING (
    stream_id IN (
      SELECT id FROM live_streams WHERE creator_id = (select auth.uid())
    )
  )
  WITH CHECK (
    stream_id IN (
      SELECT id FROM live_streams WHERE creator_id = (select auth.uid())
    )
  );

-- live_draw_tickets
DROP POLICY IF EXISTS "Creators view stream tickets" ON live_draw_tickets;
CREATE POLICY "Creators view stream tickets"
  ON live_draw_tickets FOR SELECT
  TO authenticated
  USING (
    stream_id IN (
      SELECT id FROM live_streams WHERE creator_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users view own tickets" ON live_draw_tickets;
CREATE POLICY "Users view own tickets"
  ON live_draw_tickets FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- user_wallets
DROP POLICY IF EXISTS "Users can view own wallet" ON user_wallets;
CREATE POLICY "Users can view own wallet"
  ON user_wallets FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- live_gift_transactions
DROP POLICY IF EXISTS "Users can view gifts they received" ON live_gift_transactions;
CREATE POLICY "Users can view gifts they received"
  ON live_gift_transactions FOR SELECT
  TO authenticated
  USING (recipient_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can view gifts they sent" ON live_gift_transactions;
CREATE POLICY "Users can view gifts they sent"
  ON live_gift_transactions FOR SELECT
  TO authenticated
  USING (sender_id = (select auth.uid()));