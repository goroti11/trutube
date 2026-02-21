/*
  # Optimize RLS Policies - Part 1: Auth UID Calls

  1. Performance Improvements
    - Wraps auth.uid() calls in SELECT to prevent re-evaluation per row
    - Significantly improves query performance at scale

  2. Tables Affected (Part 1)
    - user_settings
    - support_tickets
    - transactions
    - creator_wallets
    - withdrawal_requests
*/

-- user_settings policies
DROP POLICY IF EXISTS "Users can view own settings" ON public.user_settings;
CREATE POLICY "Users can view own settings"
  ON public.user_settings
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert own settings" ON public.user_settings;
CREATE POLICY "Users can insert own settings"
  ON public.user_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own settings" ON public.user_settings;
CREATE POLICY "Users can update own settings"
  ON public.user_settings
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete own settings" ON public.user_settings;
CREATE POLICY "Users can delete own settings"
  ON public.user_settings
  FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- support_tickets policies
DROP POLICY IF EXISTS "Users can view own tickets" ON public.support_tickets;
CREATE POLICY "Users can view own tickets"
  ON public.support_tickets
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- transactions policies
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
CREATE POLICY "Users can view own transactions"
  ON public.transactions
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- creator_wallets policies
DROP POLICY IF EXISTS "Creators can view own wallet" ON public.creator_wallets;
CREATE POLICY "Creators can view own wallet"
  ON public.creator_wallets
  FOR SELECT
  TO authenticated
  USING (creator_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Creators can update own wallet" ON public.creator_wallets;
CREATE POLICY "Creators can update own wallet"
  ON public.creator_wallets
  FOR UPDATE
  TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "System can create wallets" ON public.creator_wallets;
CREATE POLICY "System can create wallets"
  ON public.creator_wallets
  FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = (SELECT auth.uid()));

-- withdrawal_requests policies
DROP POLICY IF EXISTS "Creators can view own withdrawal requests" ON public.withdrawal_requests;
CREATE POLICY "Creators can view own withdrawal requests"
  ON public.withdrawal_requests
  FOR SELECT
  TO authenticated
  USING (creator_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Creators can create withdrawal requests" ON public.withdrawal_requests;
CREATE POLICY "Creators can create withdrawal requests"
  ON public.withdrawal_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Creators can update own withdrawal requests" ON public.withdrawal_requests;
CREATE POLICY "Creators can update own withdrawal requests"
  ON public.withdrawal_requests
  FOR UPDATE
  TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));
