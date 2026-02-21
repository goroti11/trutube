/*
  # Security Fix Part 7: Optimize RLS Policies - Auth UID (Batch 1)

  This migration optimizes RLS policies by wrapping auth.uid() calls in SELECT subqueries.
  This prevents the function from being re-evaluated for each row, dramatically improving
  query performance at scale.

  ## Policies Optimized (Batch 1 of 2)
  - videos
  - support_tickets
  - ad_impressions
  - transactions
  - video_downloads
  - profile_reviews
  - social_links
  - profile_shares
  - creator_support
  - support_leaderboard

  ## Performance Impact
  - auth.uid() evaluated once per query instead of once per row
  - Can improve query performance by 10-100x on large tables
  - Reduces CPU usage on auth validation
*/

-- 1. videos
DROP POLICY IF EXISTS "Users view published videos and creators view own" ON videos;

CREATE POLICY "Users view published videos and creators view own"
  ON videos FOR SELECT
  TO authenticated
  USING (
    (is_published = true) OR
    (creator_id = (SELECT auth.uid()))
  );

-- 2. support_tickets
DROP POLICY IF EXISTS "Authenticated users can create support tickets" ON support_tickets;

CREATE POLICY "Authenticated users can create support tickets"
  ON support_tickets FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
  );

-- 3. ad_impressions
DROP POLICY IF EXISTS "Authenticated users can create ad impressions" ON ad_impressions;

CREATE POLICY "Authenticated users can create ad impressions"
  ON ad_impressions FOR INSERT
  TO authenticated
  WITH CHECK (
    viewer_id = (SELECT auth.uid()) OR
    viewer_id IS NULL
  );

-- 4. transactions
DROP POLICY IF EXISTS "Users can insert own transactions" ON transactions;

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
  );

-- 5. video_downloads
DROP POLICY IF EXISTS "Users can track own downloads" ON video_downloads;

CREATE POLICY "Users can track own downloads"
  ON video_downloads FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
  );

-- 6. profile_reviews
DROP POLICY IF EXISTS "Users view public reviews and own" ON profile_reviews;

CREATE POLICY "Users view public reviews and own"
  ON profile_reviews FOR SELECT
  TO authenticated
  USING (
    (is_public = true) OR
    (reviewer_id = (SELECT auth.uid())) OR
    (profile_id = (SELECT auth.uid()))
  );

-- 7. social_links
DROP POLICY IF EXISTS "Users view visible links and own" ON social_links;

CREATE POLICY "Users view visible links and own"
  ON social_links FOR SELECT
  TO authenticated
  USING (
    (is_visible = true) OR
    (user_id = (SELECT auth.uid()))
  );

-- 8. profile_shares
DROP POLICY IF EXISTS "Users can create profile shares" ON profile_shares;

CREATE POLICY "Users can create profile shares"
  ON profile_shares FOR INSERT
  TO authenticated
  WITH CHECK (
    shared_by_user_id = (SELECT auth.uid())
  );

-- 9. creator_support
DROP POLICY IF EXISTS "Users view public supports and own" ON creator_support;

CREATE POLICY "Users view public supports and own"
  ON creator_support FOR SELECT
  TO authenticated
  USING (
    (is_public = true) OR
    (supporter_id = (SELECT auth.uid())) OR
    (creator_id = (SELECT auth.uid()))
  );

-- 10. support_leaderboard
DROP POLICY IF EXISTS "Creators can update own leaderboard" ON support_leaderboard;

CREATE POLICY "Creators can update own leaderboard"
  ON support_leaderboard FOR UPDATE
  TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users view visible entries and creators view own" ON support_leaderboard;

CREATE POLICY "Users view visible entries and creators view own"
  ON support_leaderboard FOR SELECT
  TO authenticated
  USING (
    (is_visible = true) OR
    (creator_id = (SELECT auth.uid()))
  );
