/*
  # TruTube Communauté - Fonctionnalités avancées

  1. Nouvelles tables
    - polls (sondages)
    - poll_votes (votes sondages)
    - user_reputation (réputation)
    - badge_types (types de badges)
    - user_badges (badges utilisateurs)
    - trucoin_wallets (portefeuilles)
    - trucoin_transactions (transactions)
    - premium_access (accès premium)

  2. Sécurité
    - RLS sur toutes les tables
*/

-- Types supplémentaires
DO $$ BEGIN
  CREATE TYPE badge_category AS ENUM ('founder', 'creator', 'expert', 'moderator', 'contributor', 'verified');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE transaction_type AS ENUM ('purchase', 'tip', 'subscription', 'badge', 'event', 'reward', 'refund');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE report_status AS ENUM ('pending', 'reviewing', 'resolved', 'dismissed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- SONDAGES
CREATE TABLE IF NOT EXISTS polls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  question text NOT NULL,
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  
  allow_multiple boolean DEFAULT false,
  closes_at timestamptz,
  
  total_votes integer DEFAULT 0,
  
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_polls_post ON polls(post_id);

ALTER TABLE polls ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view polls" ON polls;
CREATE POLICY "Anyone can view polls"
  ON polls FOR SELECT
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS poll_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id uuid REFERENCES polls(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  option_index integer NOT NULL,
  
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_poll_votes_unique ON poll_votes(poll_id, user_id, option_index);
CREATE INDEX IF NOT EXISTS idx_poll_votes_poll ON poll_votes(poll_id);
CREATE INDEX IF NOT EXISTS idx_poll_votes_user ON poll_votes(user_id);

ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view poll votes" ON poll_votes;
CREATE POLICY "Anyone can view poll votes"
  ON poll_votes FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can vote" ON poll_votes;
CREATE POLICY "Users can vote"
  ON poll_votes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RÉPUTATION
CREATE TABLE IF NOT EXISTS user_reputation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  universe_id text,
  community_id uuid REFERENCES communities(id) ON DELETE CASCADE,
  
  reputation_score integer DEFAULT 0,
  helpful_count integer DEFAULT 0,
  post_count integer DEFAULT 0,
  quality_score integer DEFAULT 50,
  
  level integer DEFAULT 0,
  
  last_calculated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_reputation_user_community ON user_reputation(user_id, community_id) WHERE community_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_reputation_user ON user_reputation(user_id);
CREATE INDEX IF NOT EXISTS idx_reputation_score ON user_reputation(reputation_score DESC);

ALTER TABLE user_reputation ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view reputation" ON user_reputation;
CREATE POLICY "Anyone can view reputation"
  ON user_reputation FOR SELECT
  TO authenticated
  USING (true);

-- BADGES
CREATE TABLE IF NOT EXISTS badge_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  category badge_category NOT NULL,
  
  icon text,
  color text,
  
  requirements jsonb DEFAULT '{}'::jsonb,
  
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE badge_types ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view badge types" ON badge_types;
CREATE POLICY "Anyone can view badge types"
  ON badge_types FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_type_id uuid REFERENCES badge_types(id) ON DELETE CASCADE NOT NULL,
  
  earned_at timestamptz DEFAULT now(),
  is_displayed boolean DEFAULT true,
  
  UNIQUE(user_id, badge_type_id)
);

CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge ON user_badges(badge_type_id);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view badges" ON user_badges;
CREATE POLICY "Anyone can view badges"
  ON user_badges FOR SELECT
  TO authenticated
  USING (true);

-- TRUCOIN
CREATE TABLE IF NOT EXISTS trucoin_wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  balance numeric DEFAULT 0 CHECK (balance >= 0),
  total_earned numeric DEFAULT 0,
  total_spent numeric DEFAULT 0,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wallets_user ON trucoin_wallets(user_id);

ALTER TABLE trucoin_wallets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own wallet" ON trucoin_wallets;
CREATE POLICY "Users can view own wallet"
  ON trucoin_wallets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS trucoin_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  from_user_id uuid REFERENCES auth.users(id),
  to_user_id uuid REFERENCES auth.users(id),
  
  amount numeric NOT NULL CHECK (amount > 0),
  transaction_type transaction_type NOT NULL,
  
  reference_id uuid,
  description text,
  
  metadata jsonb DEFAULT '{}'::jsonb,
  
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_transactions_from ON trucoin_transactions(from_user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_to ON trucoin_transactions(to_user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON trucoin_transactions(transaction_type);

ALTER TABLE trucoin_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own transactions" ON trucoin_transactions;
CREATE POLICY "Users can view own transactions"
  ON trucoin_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

-- ACCÈS PREMIUM
CREATE TABLE IF NOT EXISTS premium_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  community_id uuid REFERENCES communities(id) ON DELETE CASCADE NOT NULL,
  
  access_type text DEFAULT 'subscription' CHECK (access_type IN ('subscription', 'lifetime', 'trial')),
  
  starts_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  
  is_active boolean DEFAULT true,
  
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id, community_id)
);

CREATE INDEX IF NOT EXISTS idx_premium_user ON premium_access(user_id);
CREATE INDEX IF NOT EXISTS idx_premium_community ON premium_access(community_id);

ALTER TABLE premium_access ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own premium access" ON premium_access;
CREATE POLICY "Users can view own premium access"
  ON premium_access FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- BADGES INITIAUX
INSERT INTO badge_types (name, description, category, icon, color) VALUES
('Fondateur', 'Membre fondateur de TruTube', 'founder', 'crown', 'gold'),
('Créateur Vérifié', 'Créateur avec identité vérifiée', 'creator', 'check-circle', 'blue'),
('Expert Communauté', 'Contributeur actif et respecté', 'expert', 'star', 'purple'),
('Modérateur', 'Modérateur élu de la communauté', 'moderator', 'shield', 'green'),
('Top Contributeur', 'Membre avec contributions de qualité', 'contributor', 'award', 'orange')
ON CONFLICT (name) DO NOTHING;
