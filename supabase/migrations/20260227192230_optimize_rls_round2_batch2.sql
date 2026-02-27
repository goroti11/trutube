/*
  # Optimize RLS Policies - Round 2 Batch 2

  1. Optimized Policies (10 tables)
    - creator_support
    - creator_wallets
    - digital_products
    - messages
    - payment_methods
    - premium_subscriptions
    - profiles
    - social_links
    - subscriptions
    - user_settings

  2. Changes
    - Replace auth.uid() with (SELECT auth.uid())
*/

-- creator_support
DROP POLICY IF EXISTS "Supporters can update own supports" ON creator_support;
CREATE POLICY "Supporters can update own supports" ON creator_support
  FOR UPDATE TO authenticated
  USING (supporter_id = (SELECT auth.uid()))
  WITH CHECK (supporter_id = (SELECT auth.uid()));

-- creator_wallets
DROP POLICY IF EXISTS "Creators can update own wallet" ON creator_wallets;
CREATE POLICY "Creators can update own wallet" ON creator_wallets
  FOR UPDATE TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

-- digital_products
DROP POLICY IF EXISTS "Creators manage own digital products" ON digital_products;
CREATE POLICY "Creators manage own digital products" ON digital_products
  FOR ALL TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

-- messages
DROP POLICY IF EXISTS "Users can update own messages" ON messages;
CREATE POLICY "Users can update own messages" ON messages
  FOR UPDATE TO authenticated
  USING (from_user_id = (SELECT auth.uid()))
  WITH CHECK (from_user_id = (SELECT auth.uid()));

-- payment_methods
DROP POLICY IF EXISTS "Users can update own payment methods" ON payment_methods;
CREATE POLICY "Users can update own payment methods" ON payment_methods
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- premium_subscriptions
DROP POLICY IF EXISTS "Users can update own premium subscription" ON premium_subscriptions;
CREATE POLICY "Users can update own premium subscription" ON premium_subscriptions
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- profiles
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

-- social_links
DROP POLICY IF EXISTS "Users can update own social links" ON social_links;
CREATE POLICY "Users can update own social links" ON social_links
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- subscriptions
DROP POLICY IF EXISTS "Users can update own subscriptions" ON subscriptions;
CREATE POLICY "Users can update own subscriptions" ON subscriptions
  FOR UPDATE TO authenticated
  USING (supporter_id = (SELECT auth.uid()))
  WITH CHECK (supporter_id = (SELECT auth.uid()));

-- user_settings
DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;
CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));
