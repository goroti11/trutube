/*
  # Enhance Payments and Tips System

  ## Overview
  Enhances the existing tips table and adds new payment-related tables

  ## Changes
  1. Add columns to existing tips table
  2. Create new payment tables (payment_methods, transactions, creator_wallets, withdrawal_requests)
  3. Add Stripe fields to profiles and premium_subscriptions
  4. Create helper functions for payments

  ## Security
  - RLS policies for all tables
  - Strict access control
*/

-- Add Stripe customer ID to profiles
DO $$ 
BEGIN
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id text UNIQUE;
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_payment_method_id text;
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username text;
EXCEPTION 
  WHEN duplicate_column THEN NULL;
END $$;

-- Add username index
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- Add Stripe info to premium_subscriptions
DO $$ 
BEGIN
  ALTER TABLE premium_subscriptions ADD COLUMN IF NOT EXISTS stripe_subscription_id text UNIQUE;
  ALTER TABLE premium_subscriptions ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text;
EXCEPTION 
  WHEN duplicate_column THEN NULL;
END $$;

-- Enhance tips table with missing columns
DO $$
BEGIN
  ALTER TABLE tips ADD COLUMN IF NOT EXISTS video_id uuid REFERENCES videos(id) ON DELETE SET NULL;
  ALTER TABLE tips ADD COLUMN IF NOT EXISTS currency text DEFAULT 'USD';
  ALTER TABLE tips ADD COLUMN IF NOT EXISTS is_anonymous boolean DEFAULT false;
  ALTER TABLE tips ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT true;
  ALTER TABLE tips ADD COLUMN IF NOT EXISTS status text DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded'));
  ALTER TABLE tips ADD COLUMN IF NOT EXISTS transaction_id uuid;
  ALTER TABLE tips ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text DEFAULT '';
  ALTER TABLE tips ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
EXCEPTION
  WHEN duplicate_column THEN NULL;
END $$;

-- Payment methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  stripe_payment_method_id text NOT NULL,
  payment_type text DEFAULT 'card' CHECK (payment_type IN ('card', 'bank_account', 'paypal')),
  card_brand text DEFAULT '',
  card_last4 text DEFAULT '',
  is_default boolean DEFAULT false,
  billing_details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  transaction_type text NOT NULL CHECK (transaction_type IN ('subscription', 'tip', 'campaign', 'withdrawal', 'refund')),
  amount numeric NOT NULL,
  currency text DEFAULT 'USD',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled')),
  stripe_payment_intent_id text DEFAULT '',
  stripe_charge_id text DEFAULT '',
  description text DEFAULT '',
  metadata jsonb DEFAULT '{}',
  related_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Creator wallets table
CREATE TABLE IF NOT EXISTS creator_wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid UNIQUE REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  balance numeric DEFAULT 0 CHECK (balance >= 0),
  total_earned numeric DEFAULT 0,
  total_withdrawn numeric DEFAULT 0,
  pending_balance numeric DEFAULT 0,
  stripe_account_id text DEFAULT '',
  currency text DEFAULT 'USD',
  last_payout_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Withdrawal requests table
CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  currency text DEFAULT 'USD',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  stripe_transfer_id text DEFAULT '',
  payment_method text DEFAULT 'bank_transfer',
  destination_details jsonb DEFAULT '{}',
  notes text DEFAULT '',
  requested_at timestamptz DEFAULT now(),
  processed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can view own payment methods" ON payment_methods;
  DROP POLICY IF EXISTS "Users can insert own payment methods" ON payment_methods;
  DROP POLICY IF EXISTS "Users can update own payment methods" ON payment_methods;
  DROP POLICY IF EXISTS "Users can delete own payment methods" ON payment_methods;
  
  DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
  DROP POLICY IF EXISTS "System can insert transactions" ON transactions;
  
  DROP POLICY IF EXISTS "Creators can view own wallet" ON creator_wallets;
  DROP POLICY IF EXISTS "Creators can update own wallet" ON creator_wallets;
  DROP POLICY IF EXISTS "System can create wallets" ON creator_wallets;
  
  DROP POLICY IF EXISTS "Creators can view own withdrawal requests" ON withdrawal_requests;
  DROP POLICY IF EXISTS "Creators can create withdrawal requests" ON withdrawal_requests;
  DROP POLICY IF EXISTS "Creators can update own withdrawal requests" ON withdrawal_requests;
EXCEPTION 
  WHEN undefined_object THEN NULL;
END $$;

-- Policies for payment_methods
CREATE POLICY "Users can view own payment methods"
  ON payment_methods FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payment methods"
  ON payment_methods FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payment methods"
  ON payment_methods FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own payment methods"
  ON payment_methods FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for transactions
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policies for creator_wallets
CREATE POLICY "Creators can view own wallet"
  ON creator_wallets FOR SELECT
  TO authenticated
  USING (auth.uid() = creator_id);

CREATE POLICY "Creators can update own wallet"
  ON creator_wallets FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "System can create wallets"
  ON creator_wallets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

-- Policies for withdrawal_requests
CREATE POLICY "Creators can view own withdrawal requests"
  ON withdrawal_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = creator_id);

CREATE POLICY "Creators can create withdrawal requests"
  ON withdrawal_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update own withdrawal requests"
  ON withdrawal_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_payment_methods_user ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_default ON payment_methods(is_default) WHERE is_default = true;

CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created ON transactions(created_at);

CREATE INDEX IF NOT EXISTS idx_tips_video ON tips(video_id);
CREATE INDEX IF NOT EXISTS idx_tips_status ON tips(status);

CREATE INDEX IF NOT EXISTS idx_creator_wallets_creator ON creator_wallets(creator_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_creator ON withdrawal_requests(creator_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_status ON withdrawal_requests(status);

-- Function to create or get creator wallet
CREATE OR REPLACE FUNCTION get_or_create_creator_wallet(p_creator_id uuid)
RETURNS uuid AS $$
DECLARE
  wallet_id uuid;
BEGIN
  SELECT id INTO wallet_id
  FROM creator_wallets
  WHERE creator_id = p_creator_id;

  IF wallet_id IS NULL THEN
    INSERT INTO creator_wallets (creator_id)
    VALUES (p_creator_id)
    RETURNING id INTO wallet_id;
  END IF;

  RETURN wallet_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to process tip payment
CREATE OR REPLACE FUNCTION process_tip_payment(
  p_tip_id uuid,
  p_transaction_id uuid
)
RETURNS void AS $$
DECLARE
  tip_amount numeric;
  creator_id_val uuid;
  wallet_id_val uuid;
BEGIN
  SELECT amount, to_creator_id
  INTO tip_amount, creator_id_val
  FROM tips
  WHERE id = p_tip_id;

  IF tip_amount IS NULL THEN
    RAISE EXCEPTION 'Tip not found';
  END IF;

  UPDATE tips
  SET 
    status = 'completed',
    transaction_id = p_transaction_id,
    updated_at = now()
  WHERE id = p_tip_id;

  UPDATE transactions
  SET 
    status = 'completed',
    updated_at = now()
  WHERE id = p_transaction_id;

  wallet_id_val := get_or_create_creator_wallet(creator_id_val);

  UPDATE creator_wallets
  SET
    balance = balance + (tip_amount * 0.85),
    pending_balance = pending_balance + (tip_amount * 0.15),
    total_earned = total_earned + tip_amount,
    updated_at = now()
  WHERE creator_id = creator_id_val;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get creator earnings breakdown
CREATE OR REPLACE FUNCTION get_creator_earnings_breakdown(p_creator_id uuid)
RETURNS TABLE (
  total_tips numeric,
  total_subscriptions numeric,
  total_ad_revenue numeric,
  total_earnings numeric,
  available_balance numeric,
  pending_balance numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE((SELECT SUM(t2.amount) FROM tips t2 WHERE t2.to_creator_id = p_creator_id AND t2.status = 'completed'), 0) as total_tips,
    COALESCE((SELECT SUM(tr.amount) FROM transactions tr WHERE tr.user_id = p_creator_id AND tr.transaction_type = 'subscription' AND tr.status = 'completed'), 0) as total_subscriptions,
    0::numeric as total_ad_revenue,
    COALESCE(cw.total_earned, 0) as total_earnings,
    COALESCE(cw.balance, 0) as available_balance,
    COALESCE(cw.pending_balance, 0) as pending_balance
  FROM creator_wallets cw
  WHERE cw.creator_id = p_creator_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to request withdrawal
CREATE OR REPLACE FUNCTION request_withdrawal(
  p_creator_id uuid,
  p_amount numeric,
  p_payment_method text DEFAULT 'bank_transfer',
  p_destination_details jsonb DEFAULT '{}'
)
RETURNS uuid AS $$
DECLARE
  wallet_balance numeric;
  request_id uuid;
BEGIN
  SELECT balance INTO wallet_balance
  FROM creator_wallets
  WHERE creator_id = p_creator_id;

  IF wallet_balance IS NULL OR wallet_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  IF p_amount < 10 THEN
    RAISE EXCEPTION 'Minimum withdrawal amount is $10';
  END IF;

  INSERT INTO withdrawal_requests (
    creator_id,
    amount,
    payment_method,
    destination_details,
    requested_at
  )
  VALUES (
    p_creator_id,
    p_amount,
    p_payment_method,
    p_destination_details,
    now()
  )
  RETURNING id INTO request_id;

  UPDATE creator_wallets
  SET
    balance = balance - p_amount,
    pending_balance = pending_balance + p_amount,
    updated_at = now()
  WHERE creator_id = p_creator_id;

  RETURN request_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get top tippers for a creator
CREATE OR REPLACE FUNCTION get_top_tippers(
  p_creator_id uuid,
  p_limit integer DEFAULT 10
)
RETURNS TABLE (
  user_id uuid,
  username text,
  avatar_url text,
  total_tipped numeric,
  tip_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    COALESCE(p.username, p.display_name) as username,
    p.avatar_url,
    COALESCE(SUM(t.amount), 0) as total_tipped,
    COUNT(t.id) as tip_count
  FROM tips t
  JOIN profiles p ON p.id = t.from_user_id
  WHERE
    t.to_creator_id = p_creator_id
    AND t.status = 'completed'
    AND t.is_anonymous = false
  GROUP BY p.id, p.username, p.display_name, p.avatar_url
  ORDER BY total_tipped DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;