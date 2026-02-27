/*
  # Optimize RLS Policies - Creators & Videos Batch 4 (Fixed)
  
  Tables:
  - creator_support
  - creator_memberships
  - support_leaderboard
  - creator_global_settings
  - voice_consent
  - videos
  - affiliate_links
  - affiliate_conversions
*/

-- creator_support
DROP POLICY IF EXISTS "Supporters can update own supports" ON creator_support;
DROP POLICY IF EXISTS "Users can create supports" ON creator_support;
DROP POLICY IF EXISTS "Users can view own supports" ON creator_support;

CREATE POLICY "Supporters can update own supports" ON creator_support
  FOR UPDATE TO authenticated
  USING (supporter_id = (SELECT auth.uid()))
  WITH CHECK (supporter_id = (SELECT auth.uid()));

CREATE POLICY "Users can create supports" ON creator_support
  FOR INSERT TO authenticated
  WITH CHECK (supporter_id = (SELECT auth.uid()));

CREATE POLICY "Users can view own supports" ON creator_support
  FOR SELECT TO authenticated
  USING (supporter_id = (SELECT auth.uid()) OR is_public = true);

-- creator_memberships
DROP POLICY IF EXISTS "Active memberships are viewable" ON creator_memberships;
DROP POLICY IF EXISTS "Users can create memberships" ON creator_memberships;
DROP POLICY IF EXISTS "Users can update own memberships" ON creator_memberships;

CREATE POLICY "Active memberships are viewable" ON creator_memberships
  FOR SELECT TO authenticated
  USING (
    is_active = true AND 
    (user_id = (SELECT auth.uid()) OR creator_id = (SELECT auth.uid()))
  );

CREATE POLICY "Users can create memberships" ON creator_memberships
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own memberships" ON creator_memberships
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- support_leaderboard
DROP POLICY IF EXISTS "Creator can view own leaderboard" ON support_leaderboard;

CREATE POLICY "Creator can view own leaderboard" ON support_leaderboard
  FOR SELECT TO authenticated
  USING (creator_id = (SELECT auth.uid()) OR is_visible = true);

-- creator_global_settings
DROP POLICY IF EXISTS "Creators can insert own global settings" ON creator_global_settings;
DROP POLICY IF EXISTS "Creators can update own global settings" ON creator_global_settings;
DROP POLICY IF EXISTS "Creators can view own global settings" ON creator_global_settings;

CREATE POLICY "Creators can insert own global settings" ON creator_global_settings
  FOR INSERT TO authenticated
  WITH CHECK (creator_id = (SELECT auth.uid()));

CREATE POLICY "Creators can update own global settings" ON creator_global_settings
  FOR UPDATE TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

CREATE POLICY "Creators can view own global settings" ON creator_global_settings
  FOR SELECT TO authenticated
  USING (creator_id = (SELECT auth.uid()));

-- voice_consent
DROP POLICY IF EXISTS "Creators can manage own voice consent" ON voice_consent;
DROP POLICY IF EXISTS "Creators can view own voice consent" ON voice_consent;

CREATE POLICY "Creators can manage own voice consent" ON voice_consent
  FOR ALL TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

CREATE POLICY "Creators can view own voice consent" ON voice_consent
  FOR SELECT TO authenticated
  USING (creator_id = (SELECT auth.uid()));

-- videos
DROP POLICY IF EXISTS "Creators can insert own videos" ON videos;
DROP POLICY IF EXISTS "Creators can update own videos" ON videos;
DROP POLICY IF EXISTS "Creators can view own unpublished videos" ON videos;

CREATE POLICY "Creators can insert own videos" ON videos
  FOR INSERT TO authenticated
  WITH CHECK (creator_id = (SELECT auth.uid()));

CREATE POLICY "Creators can update own videos" ON videos
  FOR UPDATE TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

CREATE POLICY "Creators can view own unpublished videos" ON videos
  FOR SELECT TO authenticated
  USING (
    creator_id = (SELECT auth.uid()) OR 
    (is_published = true AND processing_status = 'completed')
  );

-- affiliate_links
DROP POLICY IF EXISTS "Creators can manage own affiliate links" ON affiliate_links;

CREATE POLICY "Creators can manage own affiliate links" ON affiliate_links
  FOR ALL TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

-- affiliate_conversions
DROP POLICY IF EXISTS "Creators can view own conversions" ON affiliate_conversions;

CREATE POLICY "Creators can view own conversions" ON affiliate_conversions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM affiliate_links 
      WHERE affiliate_links.id = affiliate_conversions.affiliate_link_id 
      AND affiliate_links.creator_id = (SELECT auth.uid())
    )
  );
