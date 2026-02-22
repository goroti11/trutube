/*
  # Live Gift Payment System

  1. New Tables
    - `live_gifts` - Catalog of available live gifts
      - `id` (uuid, primary key)
      - `name` (text, gift name)
      - `icon` (text, emoji or icon identifier)
      - `trucoin_price` (numeric, price in TruCoins)
      - `animation_url` (text, optional animation)
      - `is_active` (boolean)
      - `display_order` (integer)
      - `created_at` (timestamptz)
      
    - `live_gift_transactions` - Immutable record of all live gifts sent
      - `id` (uuid, primary key)
      - `gift_id` (uuid, references live_gifts)
      - `sender_id` (uuid, references profiles)
      - `recipient_id` (uuid, references profiles)
      - `stream_id` (uuid, references live streams/videos)
      - `trucoin_amount` (numeric, amount paid)
      - `commission_amount` (numeric, platform commission)
      - `net_amount` (numeric, amount received by creator)
      - `transaction_id` (uuid, references trucoin_transactions)
      - `message` (text, optional message with gift)
      - `is_anonymous` (boolean, hide sender name)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on both tables
    - live_gifts: Public read, admin write only
    - live_gift_transactions: Participants can view, RPC only write
    
  3. Business Rules
    - Platform takes 20% commission on all live gifts
    - All transactions are atomic via RPC
    - Transactions are immutable (append-only)
*/

-- Live Gifts Catalog
CREATE TABLE IF NOT EXISTS live_gifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) >= 2 AND char_length(name) <= 50),
  icon text NOT NULL CHECK (char_length(icon) >= 1 AND char_length(icon) <= 10),
  trucoin_price numeric(10,2) NOT NULL CHECK (trucoin_price > 0 AND trucoin_price <= 100000),
  animation_url text,
  is_active boolean DEFAULT true NOT NULL,
  display_order integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Live Gift Transactions (append-only ledger)
CREATE TABLE IF NOT EXISTS live_gift_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gift_id uuid REFERENCES live_gifts(id) ON DELETE RESTRICT NOT NULL,
  sender_id uuid REFERENCES profiles(id) ON DELETE RESTRICT NOT NULL,
  recipient_id uuid REFERENCES profiles(id) ON DELETE RESTRICT NOT NULL,
  stream_id uuid NOT NULL,
  trucoin_amount numeric(10,2) NOT NULL CHECK (trucoin_amount > 0),
  commission_amount numeric(10,2) NOT NULL CHECK (commission_amount >= 0),
  net_amount numeric(10,2) NOT NULL CHECK (net_amount > 0),
  transaction_id uuid REFERENCES trucoin_transactions(id) ON DELETE RESTRICT NOT NULL,
  message text CHECK (message IS NULL OR char_length(message) <= 200),
  is_anonymous boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  
  -- Ensure amounts are consistent
  CONSTRAINT valid_amounts CHECK (trucoin_amount = commission_amount + net_amount),
  
  -- Prevent sending gifts to self
  CONSTRAINT different_users CHECK (sender_id != recipient_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_live_gifts_active ON live_gifts(display_order) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_live_gift_transactions_sender ON live_gift_transactions(sender_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_live_gift_transactions_recipient ON live_gift_transactions(recipient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_live_gift_transactions_stream ON live_gift_transactions(stream_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_live_gift_transactions_gift ON live_gift_transactions(gift_id);

-- Enable RLS
ALTER TABLE live_gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_gift_transactions ENABLE ROW LEVEL SECURITY;

-- Live Gifts Policies - Public can view active gifts
CREATE POLICY "Anyone can view active gifts"
  ON live_gifts FOR SELECT
  USING (is_active = true);

-- Live Gift Transactions Policies
CREATE POLICY "Users can view gifts they sent"
  ON live_gift_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id);

CREATE POLICY "Users can view gifts they received"
  ON live_gift_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = recipient_id);

CREATE POLICY "Anyone can view non-anonymous gifts on streams"
  ON live_gift_transactions FOR SELECT
  USING (is_anonymous = false);

-- No INSERT/UPDATE/DELETE policies - only RPC can modify
-- This enforces transactional integrity and prevents double-spend

-- Insert default live gifts
INSERT INTO live_gifts (name, icon, trucoin_price, display_order) VALUES
  ('Heart', '❤️', 10, 1),
  ('Star', '⭐', 25, 2),
  ('Rose', '🌹', 50, 3),
  ('Diamond', '💎', 100, 4),
  ('Crown', '👑', 250, 5),
  ('Trophy', '🏆', 500, 6),
  ('Rocket', '🚀', 1000, 7),
  ('Castle', '🏰', 2500, 8)
ON CONFLICT (id) DO NOTHING;
