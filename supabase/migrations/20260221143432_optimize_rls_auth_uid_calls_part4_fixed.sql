/*
  # Optimize RLS Policies - Part 4: Profile and Social

  1. Performance Improvements
    - Wraps auth.uid() calls in SELECT to prevent re-evaluation per row

  2. Tables Affected (Part 4)
    - profile_reviews
    - social_links
    - videos
    - creator_support
    - creator_memberships
    - support_leaderboard
*/

-- profile_reviews policies
DROP POLICY IF EXISTS "Users can view own reviews" ON public.profile_reviews;
CREATE POLICY "Users can view own reviews"
  ON public.profile_reviews
  FOR SELECT
  TO authenticated
  USING (reviewer_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can create reviews" ON public.profile_reviews;
CREATE POLICY "Users can create reviews"
  ON public.profile_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (reviewer_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own reviews" ON public.profile_reviews;
CREATE POLICY "Users can update own reviews"
  ON public.profile_reviews
  FOR UPDATE
  TO authenticated
  USING (reviewer_id = (SELECT auth.uid()))
  WITH CHECK (reviewer_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete own reviews" ON public.profile_reviews;
CREATE POLICY "Users can delete own reviews"
  ON public.profile_reviews
  FOR DELETE
  TO authenticated
  USING (reviewer_id = (SELECT auth.uid()));

-- social_links policies
DROP POLICY IF EXISTS "Users can view own social links" ON public.social_links;
CREATE POLICY "Users can view own social links"
  ON public.social_links
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can create own social links" ON public.social_links;
CREATE POLICY "Users can create own social links"
  ON public.social_links
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own social links" ON public.social_links;
CREATE POLICY "Users can update own social links"
  ON public.social_links
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete own social links" ON public.social_links;
CREATE POLICY "Users can delete own social links"
  ON public.social_links
  FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- videos policies
DROP POLICY IF EXISTS "Creators can insert own videos" ON public.videos;
CREATE POLICY "Creators can insert own videos"
  ON public.videos
  FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Creators can update own videos" ON public.videos;
CREATE POLICY "Creators can update own videos"
  ON public.videos
  FOR UPDATE
  TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Creators can view own unpublished videos" ON public.videos;
CREATE POLICY "Creators can view own unpublished videos"
  ON public.videos
  FOR SELECT
  TO authenticated
  USING (
    is_published = true
    OR creator_id = (SELECT auth.uid())
  );

-- creator_support policies
DROP POLICY IF EXISTS "Users can view own supports" ON public.creator_support;
CREATE POLICY "Users can view own supports"
  ON public.creator_support
  FOR SELECT
  TO authenticated
  USING (supporter_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can create supports" ON public.creator_support;
CREATE POLICY "Users can create supports"
  ON public.creator_support
  FOR INSERT
  TO authenticated
  WITH CHECK (supporter_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Supporters can update own supports" ON public.creator_support;
CREATE POLICY "Supporters can update own supports"
  ON public.creator_support
  FOR UPDATE
  TO authenticated
  USING (supporter_id = (SELECT auth.uid()))
  WITH CHECK (supporter_id = (SELECT auth.uid()));

-- creator_memberships policies
DROP POLICY IF EXISTS "Active memberships are viewable" ON public.creator_memberships;
CREATE POLICY "Active memberships are viewable"
  ON public.creator_memberships
  FOR SELECT
  TO authenticated
  USING (
    is_active = true
    OR user_id = (SELECT auth.uid())
  );

DROP POLICY IF EXISTS "Users can create memberships" ON public.creator_memberships;
CREATE POLICY "Users can create memberships"
  ON public.creator_memberships
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own memberships" ON public.creator_memberships;
CREATE POLICY "Users can update own memberships"
  ON public.creator_memberships
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- support_leaderboard policies
DROP POLICY IF EXISTS "Creator can view own leaderboard" ON public.support_leaderboard;
CREATE POLICY "Creator can view own leaderboard"
  ON public.support_leaderboard
  FOR SELECT
  TO authenticated
  USING (creator_id = (SELECT auth.uid()));
