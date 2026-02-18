/*
  # Système de Support Financier aux Créateurs

  ## Nouvelles tables
  
  1. creator_support
    - id (uuid, primary key)
    - supporter_id (uuid, references profiles)
    - creator_id (uuid, references profiles)
    - amount (numeric)
    - currency (text, default 'USD')
    - support_type (text: 'tip', 'membership', 'superchat', 'donation')
    - message (text)
    - is_public (boolean)
    - status (text: 'pending', 'completed', 'failed', 'refunded')
    - payment_method (text)
    - created_at (timestamptz)
  
  2. creator_memberships
    - id (uuid, primary key)
    - user_id (uuid, references profiles)
    - creator_id (uuid, references profiles)
    - tier (text: 'basic', 'premium', 'vip')
    - amount (numeric)
    - start_date (timestamptz)
    - end_date (timestamptz)
    - is_active (boolean)
    - auto_renew (boolean)
    - created_at (timestamptz)
  
  3. support_leaderboard
    - id (uuid, primary key)
    - creator_id (uuid, references profiles)
    - supporter_id (uuid, references profiles)
    - total_amount (numeric)
    - support_count (integer)
    - last_support_at (timestamptz)
    - is_visible (boolean)
    - created_at (timestamptz)
  
  ## Modifications
  
  1. Ajout de champs au profil créateur
    - support_enabled (boolean)
    - minimum_support_amount (numeric)
    - total_support_received (numeric)
    - top_supporter_id (uuid)
    - membership_tiers (jsonb)
  
  ## Sécurité
  
  - RLS activé sur toutes les tables
  - Policies pour gérer l'accès aux supports
  - Validation des montants
*/

-- Ajouter des champs aux profils
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'support_enabled'
  ) THEN
    ALTER TABLE profiles ADD COLUMN support_enabled boolean DEFAULT true;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'minimum_support_amount'
  ) THEN
    ALTER TABLE profiles ADD COLUMN minimum_support_amount numeric(10,2) DEFAULT 1.00;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'total_support_received'
  ) THEN
    ALTER TABLE profiles ADD COLUMN total_support_received numeric(10,2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'top_supporter_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN top_supporter_id uuid REFERENCES profiles(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'membership_tiers'
  ) THEN
    ALTER TABLE profiles ADD COLUMN membership_tiers jsonb DEFAULT '[
      {"tier": "basic", "name": "Supporter", "amount": 4.99, "benefits": ["Badge exclusif", "Emojis personnalisés"]},
      {"tier": "premium", "name": "Fan", "amount": 9.99, "benefits": ["Tous les avantages Basic", "Accès anticipé aux vidéos", "Contenu exclusif"]},
      {"tier": "vip", "name": "Super Fan", "amount": 24.99, "benefits": ["Tous les avantages Premium", "Nom dans les crédits", "Chat privé mensuel"]}
    ]'::jsonb;
  END IF;
END $$;

-- Table pour les supports financiers
CREATE TABLE IF NOT EXISTS creator_support (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supporter_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount numeric(10,2) NOT NULL CHECK (amount > 0),
  currency text DEFAULT 'USD',
  support_type text NOT NULL CHECK (support_type IN ('tip', 'membership', 'superchat', 'donation')),
  message text DEFAULT '',
  is_public boolean DEFAULT true,
  status text DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method text DEFAULT 'stripe',
  created_at timestamptz DEFAULT now()
);

-- Table pour les abonnements membres
CREATE TABLE IF NOT EXISTS creator_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tier text NOT NULL CHECK (tier IN ('basic', 'premium', 'vip')),
  amount numeric(10,2) NOT NULL,
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  is_active boolean DEFAULT true,
  auto_renew boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, creator_id, tier)
);

-- Table pour le classement des supporters
CREATE TABLE IF NOT EXISTS support_leaderboard (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  supporter_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  total_amount numeric(10,2) DEFAULT 0,
  support_count integer DEFAULT 0,
  last_support_at timestamptz DEFAULT now(),
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(creator_id, supporter_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_creator_support_creator ON creator_support(creator_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_creator_support_supporter ON creator_support(supporter_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_creator_support_status ON creator_support(status) WHERE status = 'completed';
CREATE INDEX IF NOT EXISTS idx_creator_memberships_user ON creator_memberships(user_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_creator_memberships_creator ON creator_memberships(creator_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_support_leaderboard_creator ON support_leaderboard(creator_id, total_amount DESC);

-- Enable RLS
ALTER TABLE creator_support ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_leaderboard ENABLE ROW LEVEL SECURITY;

-- Policies for creator_support
CREATE POLICY "Public supports are viewable by everyone"
  ON creator_support FOR SELECT
  TO authenticated
  USING (is_public = true AND status = 'completed');

CREATE POLICY "Users can view own supports"
  ON creator_support FOR SELECT
  TO authenticated
  USING (auth.uid() = supporter_id OR auth.uid() = creator_id);

CREATE POLICY "Users can create supports"
  ON creator_support FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = supporter_id AND supporter_id != creator_id);

CREATE POLICY "Supporters can update own supports"
  ON creator_support FOR UPDATE
  TO authenticated
  USING (auth.uid() = supporter_id)
  WITH CHECK (auth.uid() = supporter_id);

-- Policies for creator_memberships
CREATE POLICY "Active memberships are viewable"
  ON creator_memberships FOR SELECT
  TO authenticated
  USING (is_active = true AND (auth.uid() = user_id OR auth.uid() = creator_id));

CREATE POLICY "Users can create memberships"
  ON creator_memberships FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND user_id != creator_id);

CREATE POLICY "Users can update own memberships"
  ON creator_memberships FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for support_leaderboard
CREATE POLICY "Visible leaderboard entries are public"
  ON support_leaderboard FOR SELECT
  TO authenticated
  USING (is_visible = true);

CREATE POLICY "Creator can view own leaderboard"
  ON support_leaderboard FOR SELECT
  TO authenticated
  USING (auth.uid() = creator_id);

CREATE POLICY "System can manage leaderboard"
  ON support_leaderboard FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Fonction pour mettre à jour les statistiques de support
CREATE OR REPLACE FUNCTION update_creator_support_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.status = 'completed' THEN
    -- Mettre à jour le total reçu par le créateur
    UPDATE profiles
    SET total_support_received = (
      SELECT COALESCE(SUM(amount), 0)
      FROM creator_support
      WHERE creator_id = NEW.creator_id AND status = 'completed'
    )
    WHERE id = NEW.creator_id;

    -- Mettre à jour ou créer l'entrée dans le leaderboard
    INSERT INTO support_leaderboard (creator_id, supporter_id, total_amount, support_count, last_support_at)
    VALUES (NEW.creator_id, NEW.supporter_id, NEW.amount, 1, NEW.created_at)
    ON CONFLICT (creator_id, supporter_id)
    DO UPDATE SET
      total_amount = support_leaderboard.total_amount + NEW.amount,
      support_count = support_leaderboard.support_count + 1,
      last_support_at = NEW.created_at;

    -- Mettre à jour le top supporter
    UPDATE profiles
    SET top_supporter_id = (
      SELECT supporter_id
      FROM support_leaderboard
      WHERE creator_id = NEW.creator_id
      ORDER BY total_amount DESC
      LIMIT 1
    )
    WHERE id = NEW.creator_id;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger pour mettre à jour les stats automatiquement
DROP TRIGGER IF EXISTS trigger_update_creator_support_stats ON creator_support;
CREATE TRIGGER trigger_update_creator_support_stats
  AFTER INSERT OR UPDATE ON creator_support
  FOR EACH ROW
  EXECUTE FUNCTION update_creator_support_stats();

-- Fonction pour vérifier l'expiration des memberships
CREATE OR REPLACE FUNCTION check_membership_expiration()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE creator_memberships
  SET is_active = false
  WHERE end_date < now() AND is_active = true AND auto_renew = false;
END;
$$;

COMMENT ON TABLE creator_support IS 'Système de support financier pour les créateurs (tips, donations, superchats)';
COMMENT ON TABLE creator_memberships IS 'Abonnements membres avec différents tiers';
COMMENT ON TABLE support_leaderboard IS 'Classement des meilleurs supporters par créateur';
