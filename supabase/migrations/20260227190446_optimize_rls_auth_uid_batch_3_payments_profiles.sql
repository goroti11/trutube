/*
  # Optimize RLS Policies - Payments & Profiles Batch 3
  
  Tables:
  - payment_methods
  - transactions
  - creator_wallets
  - withdrawal_requests
  - profiles
  - profile_reviews
  - social_links
*/

-- payment_methods
DROP POLICY IF EXISTS "Users can delete own payment methods" ON payment_methods;
DROP POLICY IF EXISTS "Users can insert own payment methods" ON payment_methods;
DROP POLICY IF EXISTS "Users can update own payment methods" ON payment_methods;
DROP POLICY IF EXISTS "Users can view own payment methods" ON payment_methods;

CREATE POLICY "Users can delete own payment methods" ON payment_methods
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert own payment methods" ON payment_methods
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own payment methods" ON payment_methods
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can view own payment methods" ON payment_methods
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- transactions
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;

CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- creator_wallets
DROP POLICY IF EXISTS "Creators can update own wallet" ON creator_wallets;
DROP POLICY IF EXISTS "Creators can view own wallet" ON creator_wallets;
DROP POLICY IF EXISTS "System can create wallets" ON creator_wallets;

CREATE POLICY "Creators can update own wallet" ON creator_wallets
  FOR UPDATE TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

CREATE POLICY "Creators can view own wallet" ON creator_wallets
  FOR SELECT TO authenticated
  USING (creator_id = (SELECT auth.uid()));

CREATE POLICY "System can create wallets" ON creator_wallets
  FOR INSERT TO authenticated
  WITH CHECK (creator_id = (SELECT auth.uid()));

-- withdrawal_requests
DROP POLICY IF EXISTS "Creators can create withdrawal requests" ON withdrawal_requests;
DROP POLICY IF EXISTS "Creators can update own withdrawal requests" ON withdrawal_requests;
DROP POLICY IF EXISTS "Creators can view own withdrawal requests" ON withdrawal_requests;

CREATE POLICY "Creators can create withdrawal requests" ON withdrawal_requests
  FOR INSERT TO authenticated
  WITH CHECK (creator_id = (SELECT auth.uid()));

CREATE POLICY "Creators can update own withdrawal requests" ON withdrawal_requests
  FOR UPDATE TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

CREATE POLICY "Creators can view own withdrawal requests" ON withdrawal_requests
  FOR SELECT TO authenticated
  USING (creator_id = (SELECT auth.uid()));

-- profiles
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = (SELECT auth.uid()));

-- profile_reviews
DROP POLICY IF EXISTS "Users can create reviews" ON profile_reviews;
DROP POLICY IF EXISTS "Users can delete own reviews" ON profile_reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON profile_reviews;
DROP POLICY IF EXISTS "Users can view own reviews" ON profile_reviews;

CREATE POLICY "Users can create reviews" ON profile_reviews
  FOR INSERT TO authenticated
  WITH CHECK (reviewer_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own reviews" ON profile_reviews
  FOR DELETE TO authenticated
  USING (reviewer_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own reviews" ON profile_reviews
  FOR UPDATE TO authenticated
  USING (reviewer_id = (SELECT auth.uid()))
  WITH CHECK (reviewer_id = (SELECT auth.uid()));

CREATE POLICY "Users can view own reviews" ON profile_reviews
  FOR SELECT TO authenticated
  USING (reviewer_id = (SELECT auth.uid()) OR is_public = true);

-- social_links
DROP POLICY IF EXISTS "Users can create own social links" ON social_links;
DROP POLICY IF EXISTS "Users can delete own social links" ON social_links;
DROP POLICY IF EXISTS "Users can update own social links" ON social_links;
DROP POLICY IF EXISTS "Users can view own social links" ON social_links;

CREATE POLICY "Users can create own social links" ON social_links
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own social links" ON social_links
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own social links" ON social_links
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can view own social links" ON social_links
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()) OR is_visible = true);
