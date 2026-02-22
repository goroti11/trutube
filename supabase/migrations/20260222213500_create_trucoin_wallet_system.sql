/*
  # TruCoin Wallet System - Append-Only Ledger

  1. New Tables
    - `user_wallets` - User TruCoin balance tracking
      - `user_id` (uuid, primary key, references profiles)
      - `balance` (numeric, current balance)
      - `total_earned` (numeric, lifetime earnings)
      - `total_spent` (numeric, lifetime spending)
      - `version` (bigint, for optimistic locking)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on user_wallets
    - Users can only view own wallet
    - Only RPC functions can modify balances (no direct updates)
    - All transactions are immutable (INSERT only)
    
  3. Notes
    - Balance is derived from transaction ledger but cached in user_wallets for performance
    - version field prevents race conditions via optimistic locking
    - All amounts stored as NUMERIC(10,2) for precision
*/

-- Create user_wallets table
CREATE TABLE IF NOT EXISTS user_wallets (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  balance numeric(10,2) DEFAULT 0 NOT NULL CHECK (balance >= 0),
  total_earned numeric(10,2) DEFAULT 0 NOT NULL CHECK (total_earned >= 0),
  total_spent numeric(10,2) DEFAULT 0 NOT NULL CHECK (total_spent >= 0),
  version bigint DEFAULT 1 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_user_wallets_balance ON user_wallets(balance) WHERE balance > 0;

-- Enable RLS
ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Users can only view own wallet
CREATE POLICY "Users can view own wallet"
  ON user_wallets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- No INSERT/UPDATE/DELETE policies - only RPC functions can modify
-- This enforces transactional integrity

-- Function to auto-create wallet on profile creation
CREATE OR REPLACE FUNCTION create_user_wallet()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO user_wallets (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger to create wallet when profile is created
DROP TRIGGER IF EXISTS create_wallet_on_profile ON profiles;
CREATE TRIGGER create_wallet_on_profile
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_user_wallet();

-- Function to update wallet updated_at timestamp
CREATE OR REPLACE FUNCTION update_wallet_timestamp()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_user_wallets_timestamp ON user_wallets;
CREATE TRIGGER update_user_wallets_timestamp
  BEFORE UPDATE ON user_wallets
  FOR EACH ROW
  EXECUTE FUNCTION update_wallet_timestamp();
