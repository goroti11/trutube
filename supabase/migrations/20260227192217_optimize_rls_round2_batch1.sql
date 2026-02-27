/*
  # Optimize RLS Policies - Round 2 Batch 1

  1. Optimized Policies (5 tables)
    - ad_campaigns
    - affiliate_links  
    - brand_deals
    - comments
    - community_posts

  2. Changes
    - Replace auth.uid() with (SELECT auth.uid()) in all policies
    - Caches auth check per query instead of per row
    - Reduces CPU usage by up to 90% on large queries
*/

-- ad_campaigns
DROP POLICY IF EXISTS "Creators can update own campaigns" ON ad_campaigns;
CREATE POLICY "Creators can update own campaigns" ON ad_campaigns
  FOR UPDATE TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

-- affiliate_links
DROP POLICY IF EXISTS "Creators can manage own affiliate links" ON affiliate_links;
CREATE POLICY "Creators can manage own affiliate links" ON affiliate_links
  FOR ALL TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

-- brand_deals
DROP POLICY IF EXISTS "Creators manage own brand deals" ON brand_deals;
CREATE POLICY "Creators manage own brand deals" ON brand_deals
  FOR ALL TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

-- comments
DROP POLICY IF EXISTS "Users can update own comments" ON comments;
CREATE POLICY "Users can update own comments" ON comments
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- community_posts
DROP POLICY IF EXISTS "posts_update_own" ON community_posts;
CREATE POLICY "posts_update_own" ON community_posts
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));
