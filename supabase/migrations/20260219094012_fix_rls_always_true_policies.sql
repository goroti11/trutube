/*
  # Fix RLS Always-True Policies

  1. Security Fix
    - Replace always-true (WITH CHECK true) policies with proper ownership checks
    - This prevents any authenticated user from inserting arbitrary data

  2. Tables Updated
    - ad_impressions: restrict to viewer_id matching current user (or allow anon with null viewer)
    - affiliate_clicks: restrict to user_id matching current user
    - music_streams: restrict to listener_id matching current user
    - profile_shares: restrict to shared_by_user_id matching current user
    - support_leaderboard: restrict system manage to creator/supporter ownership
    - support_tickets: restrict to user_id matching current user (or allow anon with null user)
    - transactions: restrict to user_id matching current user
    - video_downloads: restrict to user_id matching current user
    - referrals: restrict to referrer_id matching current user
*/

-- ad_impressions: viewer could be null for anon, but must match if authenticated
DROP POLICY IF EXISTS "System can insert ad impressions" ON ad_impressions;
CREATE POLICY "System can insert ad impressions"
  ON ad_impressions FOR INSERT TO authenticated, anon
  WITH CHECK (viewer_id IS NULL OR viewer_id = (SELECT auth.uid()));

-- affiliate_clicks: must belong to authenticated user or be anonymous
DROP POLICY IF EXISTS "Anyone can create affiliate clicks" ON affiliate_clicks;
CREATE POLICY "Authenticated users create affiliate clicks"
  ON affiliate_clicks FOR INSERT TO authenticated
  WITH CHECK (user_id IS NULL OR user_id = (SELECT auth.uid()));

-- music_streams: listener must match current user
DROP POLICY IF EXISTS "Anyone can create streams" ON music_streams;
CREATE POLICY "Authenticated users create streams"
  ON music_streams FOR INSERT TO authenticated
  WITH CHECK (listener_id = (SELECT auth.uid()));

-- profile_shares: sharer must match current user
DROP POLICY IF EXISTS "Authenticated users can create shares" ON profile_shares;
CREATE POLICY "Authenticated users can create shares"
  ON profile_shares FOR INSERT TO authenticated
  WITH CHECK (shared_by_user_id = (SELECT auth.uid()));

-- support_leaderboard: replace full bypass with ownership check
DROP POLICY IF EXISTS "System can manage leaderboard" ON support_leaderboard;
CREATE POLICY "System can manage leaderboard"
  ON support_leaderboard FOR ALL TO authenticated
  USING (supporter_id = (SELECT auth.uid()) OR creator_id = (SELECT auth.uid()))
  WITH CHECK (supporter_id = (SELECT auth.uid()) OR creator_id = (SELECT auth.uid()));

-- support_tickets: user_id must match for authenticated, allow anon with null user
DROP POLICY IF EXISTS "Anyone can create support tickets" ON support_tickets;
CREATE POLICY "Authenticated users create support tickets"
  ON support_tickets FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Anonymous users create support tickets"
  ON support_tickets FOR INSERT TO anon
  WITH CHECK (user_id IS NULL);

-- transactions: user_id must match current user
DROP POLICY IF EXISTS "System can insert transactions" ON transactions;
CREATE POLICY "System can insert transactions"
  ON transactions FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

-- video_downloads: user_id must match current user
DROP POLICY IF EXISTS "Users can track downloads" ON video_downloads;
CREATE POLICY "Users can track downloads"
  ON video_downloads FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

-- referrals: referrer must match current user
DROP POLICY IF EXISTS "System can insert referrals" ON referrals;
CREATE POLICY "Users can create referrals"
  ON referrals FOR INSERT TO authenticated
  WITH CHECK (referrer_id = (SELECT auth.uid()));