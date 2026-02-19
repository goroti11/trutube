/*
  # Optimize RLS Policies - Part 4

  1. Tables Updated
    - video_reactions (4 policies)
    - profile_reviews (4 policies)
    - social_links (4 policies)
    - creator_support (3 policies)
    - creator_memberships (3 policies)
*/

-- Video Reactions
DROP POLICY IF EXISTS "Users can create reactions" ON video_reactions;
CREATE POLICY "Users can create reactions"
  ON video_reactions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete own reactions" ON video_reactions;
CREATE POLICY "Users can delete own reactions"
  ON video_reactions FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own reactions" ON video_reactions;
CREATE POLICY "Users can update own reactions"
  ON video_reactions FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view own reactions" ON video_reactions;
CREATE POLICY "Users can view own reactions"
  ON video_reactions FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- Profile Reviews
DROP POLICY IF EXISTS "Users can create reviews" ON profile_reviews;
CREATE POLICY "Users can create reviews"
  ON profile_reviews FOR INSERT
  TO authenticated
  WITH CHECK (reviewer_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete own reviews" ON profile_reviews;
CREATE POLICY "Users can delete own reviews"
  ON profile_reviews FOR DELETE
  TO authenticated
  USING (reviewer_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own reviews" ON profile_reviews;
CREATE POLICY "Users can update own reviews"
  ON profile_reviews FOR UPDATE
  TO authenticated
  USING (reviewer_id = (SELECT auth.uid()))
  WITH CHECK (reviewer_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view own reviews" ON profile_reviews;
CREATE POLICY "Users can view own reviews"
  ON profile_reviews FOR SELECT
  TO authenticated
  USING (reviewer_id = (SELECT auth.uid()) OR profile_id = (SELECT auth.uid()));

-- Social Links
DROP POLICY IF EXISTS "Users can create own social links" ON social_links;
CREATE POLICY "Users can create own social links"
  ON social_links FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete own social links" ON social_links;
CREATE POLICY "Users can delete own social links"
  ON social_links FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own social links" ON social_links;
CREATE POLICY "Users can update own social links"
  ON social_links FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view own social links" ON social_links;
CREATE POLICY "Users can view own social links"
  ON social_links FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()) OR is_visible = true);

-- Creator Support
DROP POLICY IF EXISTS "Users can create supports" ON creator_support;
CREATE POLICY "Users can create supports"
  ON creator_support FOR INSERT
  TO authenticated
  WITH CHECK (supporter_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Supporters can update own supports" ON creator_support;
CREATE POLICY "Supporters can update own supports"
  ON creator_support FOR UPDATE
  TO authenticated
  USING (supporter_id = (SELECT auth.uid()))
  WITH CHECK (supporter_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view own supports" ON creator_support;
CREATE POLICY "Users can view own supports"
  ON creator_support FOR SELECT
  TO authenticated
  USING (
    supporter_id = (SELECT auth.uid()) 
    OR creator_id = (SELECT auth.uid())
    OR is_public = true
  );

-- Creator Memberships
DROP POLICY IF EXISTS "Active memberships are viewable" ON creator_memberships;
CREATE POLICY "Active memberships are viewable"
  ON creator_memberships FOR SELECT
  TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR creator_id = (SELECT auth.uid())
  );

DROP POLICY IF EXISTS "Users can create memberships" ON creator_memberships;
CREATE POLICY "Users can create memberships"
  ON creator_memberships FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own memberships" ON creator_memberships;
CREATE POLICY "Users can update own memberships"
  ON creator_memberships FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));