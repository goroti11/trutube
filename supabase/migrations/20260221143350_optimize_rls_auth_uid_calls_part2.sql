/*
  # Optimize RLS Policies - Part 2: Premium and Payments

  1. Performance Improvements
    - Wraps auth.uid() calls in SELECT to prevent re-evaluation per row

  2. Tables Affected (Part 2)
    - premium_subscriptions
    - video_bookmarks
    - payment_methods
    - ad_campaigns
    - ad_impressions
*/

-- premium_subscriptions policies
DROP POLICY IF EXISTS "Users can view own premium subscription" ON public.premium_subscriptions;
CREATE POLICY "Users can view own premium subscription"
  ON public.premium_subscriptions
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert own premium subscription" ON public.premium_subscriptions;
CREATE POLICY "Users can insert own premium subscription"
  ON public.premium_subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own premium subscription" ON public.premium_subscriptions;
CREATE POLICY "Users can update own premium subscription"
  ON public.premium_subscriptions
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- video_bookmarks policies
DROP POLICY IF EXISTS "Users can view own bookmarks" ON public.video_bookmarks;
CREATE POLICY "Users can view own bookmarks"
  ON public.video_bookmarks
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can create own bookmarks" ON public.video_bookmarks;
CREATE POLICY "Users can create own bookmarks"
  ON public.video_bookmarks
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete own bookmarks" ON public.video_bookmarks;
CREATE POLICY "Users can delete own bookmarks"
  ON public.video_bookmarks
  FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- payment_methods policies
DROP POLICY IF EXISTS "Users can view own payment methods" ON public.payment_methods;
CREATE POLICY "Users can view own payment methods"
  ON public.payment_methods
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert own payment methods" ON public.payment_methods;
CREATE POLICY "Users can insert own payment methods"
  ON public.payment_methods
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own payment methods" ON public.payment_methods;
CREATE POLICY "Users can update own payment methods"
  ON public.payment_methods
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete own payment methods" ON public.payment_methods;
CREATE POLICY "Users can delete own payment methods"
  ON public.payment_methods
  FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- ad_campaigns policies
DROP POLICY IF EXISTS "Creators can view own campaigns" ON public.ad_campaigns;
CREATE POLICY "Creators can view own campaigns"
  ON public.ad_campaigns
  FOR SELECT
  TO authenticated
  USING (creator_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Creators can create campaigns" ON public.ad_campaigns;
CREATE POLICY "Creators can create campaigns"
  ON public.ad_campaigns
  FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Creators can update own campaigns" ON public.ad_campaigns;
CREATE POLICY "Creators can update own campaigns"
  ON public.ad_campaigns
  FOR UPDATE
  TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Creators can delete own campaigns" ON public.ad_campaigns;
CREATE POLICY "Creators can delete own campaigns"
  ON public.ad_campaigns
  FOR DELETE
  TO authenticated
  USING (creator_id = (SELECT auth.uid()));

-- ad_impressions policies
DROP POLICY IF EXISTS "Campaign owners can view campaign impressions" ON public.ad_impressions;
CREATE POLICY "Campaign owners can view campaign impressions"
  ON public.ad_impressions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.ad_campaigns
      WHERE ad_campaigns.id = ad_impressions.campaign_id
      AND ad_campaigns.creator_id = (SELECT auth.uid())
    )
  );
