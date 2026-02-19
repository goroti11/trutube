/*
  # Optimize RLS Policies - Part 2

  1. Tables Updated
    - profiles (2 policies)
    - payment_methods (4 policies)
    - transactions (1 policy)
    - creator_wallets (3 policies)
    - withdrawal_requests (3 policies)
*/

-- Profiles
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

-- Payment Methods
DROP POLICY IF EXISTS "Users can view own payment methods" ON payment_methods;
CREATE POLICY "Users can view own payment methods"
  ON payment_methods FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert own payment methods" ON payment_methods;
CREATE POLICY "Users can insert own payment methods"
  ON payment_methods FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own payment methods" ON payment_methods;
CREATE POLICY "Users can update own payment methods"
  ON payment_methods FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete own payment methods" ON payment_methods;
CREATE POLICY "Users can delete own payment methods"
  ON payment_methods FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- Transactions
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- Creator Wallets
DROP POLICY IF EXISTS "Creators can view own wallet" ON creator_wallets;
CREATE POLICY "Creators can view own wallet"
  ON creator_wallets FOR SELECT
  TO authenticated
  USING (creator_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Creators can update own wallet" ON creator_wallets;
CREATE POLICY "Creators can update own wallet"
  ON creator_wallets FOR UPDATE
  TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "System can create wallets" ON creator_wallets;
CREATE POLICY "System can create wallets"
  ON creator_wallets FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = (SELECT auth.uid()));

-- Withdrawal Requests
DROP POLICY IF EXISTS "Creators can view own withdrawal requests" ON withdrawal_requests;
CREATE POLICY "Creators can view own withdrawal requests"
  ON withdrawal_requests FOR SELECT
  TO authenticated
  USING (creator_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Creators can create withdrawal requests" ON withdrawal_requests;
CREATE POLICY "Creators can create withdrawal requests"
  ON withdrawal_requests FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Creators can update own withdrawal requests" ON withdrawal_requests;
CREATE POLICY "Creators can update own withdrawal requests"
  ON withdrawal_requests FOR UPDATE
  TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));