/*
  # Optimize RLS Policies - Part 3: Music, Marketplace, Referrals

  1. Performance Optimization
    - Replace auth.uid() with (SELECT auth.uid()) in RLS policies
    - Tables: music_sale_releases, music_royalty_splits, music_sale_purchases,
      music_sale_preorders, marketplace_provider_profiles, music_limited_editions,
      music_royalty_payments, referrals, marketplace_services
*/

-- music_sale_releases
DROP POLICY IF EXISTS "Creators insert own releases" ON music_sale_releases;
CREATE POLICY "Creators insert own releases"
  ON music_sale_releases FOR INSERT TO authenticated
  WITH CHECK (creator_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Creators manage own releases" ON music_sale_releases;
CREATE POLICY "Creators manage own releases"
  ON music_sale_releases FOR SELECT TO authenticated
  USING ((creator_id = (SELECT auth.uid())) OR (phase = ANY (ARRAY['exclusive'::text, 'public'::text])));

DROP POLICY IF EXISTS "Creators update own releases" ON music_sale_releases;
CREATE POLICY "Creators update own releases"
  ON music_sale_releases FOR UPDATE TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

-- music_royalty_splits
DROP POLICY IF EXISTS "Release creator views splits" ON music_royalty_splits;
CREATE POLICY "Release creator views splits"
  ON music_royalty_splits FOR SELECT TO authenticated
  USING ((EXISTS ( SELECT 1 FROM music_sale_releases WHERE ((music_sale_releases.id = music_royalty_splits.release_id) AND (music_sale_releases.creator_id = (SELECT auth.uid()))))) OR (recipient_user_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Release creator manages splits" ON music_royalty_splits;
CREATE POLICY "Release creator manages splits"
  ON music_royalty_splits FOR INSERT TO authenticated
  WITH CHECK (EXISTS ( SELECT 1 FROM music_sale_releases WHERE ((music_sale_releases.id = music_royalty_splits.release_id) AND (music_sale_releases.creator_id = (SELECT auth.uid())))));

DROP POLICY IF EXISTS "Release creator updates splits" ON music_royalty_splits;
CREATE POLICY "Release creator updates splits"
  ON music_royalty_splits FOR UPDATE TO authenticated
  USING (EXISTS ( SELECT 1 FROM music_sale_releases WHERE ((music_sale_releases.id = music_royalty_splits.release_id) AND (music_sale_releases.creator_id = (SELECT auth.uid())))))
  WITH CHECK (EXISTS ( SELECT 1 FROM music_sale_releases WHERE ((music_sale_releases.id = music_royalty_splits.release_id) AND (music_sale_releases.creator_id = (SELECT auth.uid())))));

-- music_sale_purchases
DROP POLICY IF EXISTS "Authenticated users purchase" ON music_sale_purchases;
CREATE POLICY "Authenticated users purchase"
  ON music_sale_purchases FOR INSERT TO authenticated
  WITH CHECK (buyer_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Buyers view own purchases" ON music_sale_purchases;
CREATE POLICY "Buyers view own purchases"
  ON music_sale_purchases FOR SELECT TO authenticated
  USING ((buyer_id = (SELECT auth.uid())) OR (EXISTS ( SELECT 1 FROM music_sale_releases WHERE ((music_sale_releases.id = music_sale_purchases.release_id) AND (music_sale_releases.creator_id = (SELECT auth.uid()))))));

DROP POLICY IF EXISTS "Buyers update own purchases" ON music_sale_purchases;
CREATE POLICY "Buyers update own purchases"
  ON music_sale_purchases FOR UPDATE TO authenticated
  USING (buyer_id = (SELECT auth.uid()))
  WITH CHECK (buyer_id = (SELECT auth.uid()));

-- music_sale_preorders
DROP POLICY IF EXISTS "Authenticated users preorder" ON music_sale_preorders;
CREATE POLICY "Authenticated users preorder"
  ON music_sale_preorders FOR INSERT TO authenticated
  WITH CHECK (buyer_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Buyers view own preorders" ON music_sale_preorders;
CREATE POLICY "Buyers view own preorders"
  ON music_sale_preorders FOR SELECT TO authenticated
  USING ((buyer_id = (SELECT auth.uid())) OR (EXISTS ( SELECT 1 FROM music_sale_releases WHERE ((music_sale_releases.id = music_sale_preorders.release_id) AND (music_sale_releases.creator_id = (SELECT auth.uid()))))));

DROP POLICY IF EXISTS "Buyers update own preorders" ON music_sale_preorders;
CREATE POLICY "Buyers update own preorders"
  ON music_sale_preorders FOR UPDATE TO authenticated
  USING (buyer_id = (SELECT auth.uid()))
  WITH CHECK (buyer_id = (SELECT auth.uid()));

-- marketplace_provider_profiles
DROP POLICY IF EXISTS "Providers manage own profile" ON marketplace_provider_profiles;
CREATE POLICY "Providers manage own profile"
  ON marketplace_provider_profiles FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Providers update own profile" ON marketplace_provider_profiles;
CREATE POLICY "Providers update own profile"
  ON marketplace_provider_profiles FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- music_limited_editions
DROP POLICY IF EXISTS "System issues editions" ON music_limited_editions;
CREATE POLICY "System issues editions"
  ON music_limited_editions FOR INSERT TO authenticated
  WITH CHECK (EXISTS ( SELECT 1 FROM music_sale_releases WHERE ((music_sale_releases.id = music_limited_editions.release_id) AND (music_sale_releases.creator_id = (SELECT auth.uid())))));

DROP POLICY IF EXISTS "System updates editions" ON music_limited_editions;
CREATE POLICY "System updates editions"
  ON music_limited_editions FOR UPDATE TO authenticated
  USING ((owner_id = (SELECT auth.uid())) OR (EXISTS ( SELECT 1 FROM music_sale_releases WHERE ((music_sale_releases.id = music_limited_editions.release_id) AND (music_sale_releases.creator_id = (SELECT auth.uid()))))))
  WITH CHECK ((owner_id = (SELECT auth.uid())) OR (EXISTS ( SELECT 1 FROM music_sale_releases WHERE ((music_sale_releases.id = music_limited_editions.release_id) AND (music_sale_releases.creator_id = (SELECT auth.uid()))))));

-- music_royalty_payments
DROP POLICY IF EXISTS "Recipients view own royalty payments" ON music_royalty_payments;
CREATE POLICY "Recipients view own royalty payments"
  ON music_royalty_payments FOR SELECT TO authenticated
  USING ((recipient_id = (SELECT auth.uid())) OR (EXISTS ( SELECT 1 FROM music_sale_releases WHERE ((music_sale_releases.id = music_royalty_payments.release_id) AND (music_sale_releases.creator_id = (SELECT auth.uid()))))));

DROP POLICY IF EXISTS "System inserts royalty payments" ON music_royalty_payments;
CREATE POLICY "System inserts royalty payments"
  ON music_royalty_payments FOR INSERT TO authenticated
  WITH CHECK (EXISTS ( SELECT 1 FROM music_sale_releases WHERE ((music_sale_releases.id = music_royalty_payments.release_id) AND (music_sale_releases.creator_id = (SELECT auth.uid())))));

-- referrals
DROP POLICY IF EXISTS "Referrers can view their referrals" ON referrals;
CREATE POLICY "Referrers can view their referrals"
  ON referrals FOR SELECT TO authenticated
  USING (((SELECT auth.uid()) = referrer_id) OR ((SELECT auth.uid()) = referred_id));

DROP POLICY IF EXISTS "Referrers can update their referrals" ON referrals;
CREATE POLICY "Referrers can update their referrals"
  ON referrals FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = referrer_id)
  WITH CHECK ((SELECT auth.uid()) = referrer_id);

-- marketplace_services
DROP POLICY IF EXISTS "Providers manage own services" ON marketplace_services;
CREATE POLICY "Providers manage own services"
  ON marketplace_services FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Providers update own services" ON marketplace_services;
CREATE POLICY "Providers update own services"
  ON marketplace_services FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));