/*
  # Optimize RLS Policies - Round 2 Batch 4

  1. Optimized Policies (10 tables)
    - merchandise_products
    - merchandise_inventory
    - dm_messages
    - dm_read_status
    - forum_posts
    - forum_threads
    - group_messages
    - post_comments
    - profile_reviews
    - kyc_verifications

  2. Changes
    - Replace auth.uid() with (SELECT auth.uid())
*/

-- merchandise_products
DROP POLICY IF EXISTS "Creators can manage own merchandise" ON merchandise_products;
CREATE POLICY "Creators can manage own merchandise" ON merchandise_products
  FOR ALL TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

-- merchandise_inventory
DROP POLICY IF EXISTS "Creators manage own inventory" ON merchandise_inventory;
CREATE POLICY "Creators manage own inventory" ON merchandise_inventory
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchandise_products
      WHERE merchandise_products.id = merchandise_inventory.product_id
      AND merchandise_products.creator_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchandise_products
      WHERE merchandise_products.id = merchandise_inventory.product_id
      AND merchandise_products.creator_id = (SELECT auth.uid())
    )
  );

-- dm_messages
DROP POLICY IF EXISTS "dm_messages_update_own" ON dm_messages;
CREATE POLICY "dm_messages_update_own" ON dm_messages
  FOR UPDATE TO authenticated
  USING (sender_id = (SELECT auth.uid()))
  WITH CHECK (sender_id = (SELECT auth.uid()));

-- dm_read_status
DROP POLICY IF EXISTS "dm_read_status_update_own" ON dm_read_status;
CREATE POLICY "dm_read_status_update_own" ON dm_read_status
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- forum_posts
DROP POLICY IF EXISTS "forum_posts_update_own" ON forum_posts;
CREATE POLICY "forum_posts_update_own" ON forum_posts
  FOR UPDATE TO authenticated
  USING (author_id = (SELECT auth.uid()))
  WITH CHECK (author_id = (SELECT auth.uid()));

-- forum_threads
DROP POLICY IF EXISTS "threads_update_own" ON forum_threads;
CREATE POLICY "threads_update_own" ON forum_threads
  FOR UPDATE TO authenticated
  USING (author_id = (SELECT auth.uid()))
  WITH CHECK (author_id = (SELECT auth.uid()));

-- group_messages
DROP POLICY IF EXISTS "messages_update_own" ON group_messages;
CREATE POLICY "messages_update_own" ON group_messages
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- post_comments
DROP POLICY IF EXISTS "comments_update_own" ON post_comments;
CREATE POLICY "comments_update_own" ON post_comments
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- profile_reviews
DROP POLICY IF EXISTS "Users can update own reviews" ON profile_reviews;
CREATE POLICY "Users can update own reviews" ON profile_reviews
  FOR UPDATE TO authenticated
  USING (reviewer_id = (SELECT auth.uid()))
  WITH CHECK (reviewer_id = (SELECT auth.uid()));

-- kyc_verifications
DROP POLICY IF EXISTS "Users can update own KYC data" ON kyc_verifications;
CREATE POLICY "Users can update own KYC data" ON kyc_verifications
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));
