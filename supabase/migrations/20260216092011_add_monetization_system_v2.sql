/*
  # Système de Monétisation TruTube

  ## Vue d'ensemble
  Ce système gère la monétisation complète des créateurs sur TruTube avec :
  - Conditions d'éligibilité (KYC, seuils, score authenticité)
  - Types de revenus (publicité, abonnements, tips, marketplace, collabs)
  - Paliers créateurs (Basic, Pro, Elite)
  - Partage transparent des revenus

  ## Nouvelles Tables

  1. **creator_monetization_status**
     - Statut de monétisation du créateur
     - Conditions remplies
     - Score d'authenticité
     - Palier actuel
  
  2. **kyc_verifications**
     - Vérification d'identité KYC
     - Documents validés
     - Statut de vérification
  
  3. **revenue_transactions**
     - Transactions de revenus détaillées
     - Type de revenu
     - Partage créateur/plateforme
  
  4. **creator_tiers**
     - Définition des paliers (Basic, Pro, Elite)
     - Avantages par palier
  
  5. **monetization_settings**
     - Configuration des partages de revenus
     - Paramètres globaux

  ## Sécurité
  - RLS activé sur toutes les tables
  - Créateurs voient uniquement leurs données
  - Admin a accès complet
*/

-- Table des paliers créateurs
CREATE TABLE IF NOT EXISTS creator_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  level integer NOT NULL UNIQUE,
  min_subscribers integer NOT NULL DEFAULT 0,
  min_authenticity_score integer NOT NULL DEFAULT 80,
  min_revenue numeric DEFAULT 0,
  benefits jsonb NOT NULL DEFAULT '[]'::jsonb,
  revenue_share_boost numeric DEFAULT 0,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE creator_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view creator tiers"
  ON creator_tiers FOR SELECT
  TO authenticated
  USING (true);

-- Vérifications KYC
CREATE TABLE IF NOT EXISTS kyc_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  identity_verified boolean DEFAULT false,
  email_verified boolean DEFAULT false,
  phone_verified boolean DEFAULT false,
  age_verified boolean DEFAULT false,
  document_type text,
  document_number text,
  document_verified_at timestamptz,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'in_review', 'approved', 'rejected')),
  rejection_reason text,
  stripe_account_id text,
  bank_account_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE kyc_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own KYC data"
  ON kyc_verifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own KYC data"
  ON kyc_verifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own KYC data"
  ON kyc_verifications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Statut de monétisation des créateurs
CREATE TABLE IF NOT EXISTS creator_monetization_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  monetization_enabled boolean DEFAULT false,
  tier_id uuid REFERENCES creator_tiers(id),
  authenticity_score integer DEFAULT 0 CHECK (authenticity_score >= 0 AND authenticity_score <= 100),
  total_subscribers integer DEFAULT 0,
  watch_hours_12months numeric DEFAULT 0,
  shorts_views_90days bigint DEFAULT 0,
  total_videos integer DEFAULT 0,
  account_age_days integer DEFAULT 0,
  violations_count integer DEFAULT 0,
  kyc_completed boolean DEFAULT false,
  meets_audience_threshold boolean DEFAULT false,
  meets_authenticity_threshold boolean DEFAULT false,
  has_original_content boolean DEFAULT false,
  has_payment_method boolean DEFAULT false,
  eligibility_checked_at timestamptz,
  monetization_activated_at timestamptz,
  monetization_suspended boolean DEFAULT false,
  suspension_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE creator_monetization_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own monetization status"
  ON creator_monetization_status FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own monetization status"
  ON creator_monetization_status FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own monetization status"
  ON creator_monetization_status FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Paramètres de monétisation
CREATE TABLE IF NOT EXISTS monetization_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_type text NOT NULL UNIQUE,
  creator_share numeric NOT NULL CHECK (creator_share >= 0 AND creator_share <= 100),
  platform_share numeric NOT NULL CHECK (platform_share >= 0 AND platform_share <= 100),
  description text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE monetization_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view monetization settings"
  ON monetization_settings FOR SELECT
  TO authenticated
  USING (true);

-- Transactions de revenus
CREATE TABLE IF NOT EXISTS revenue_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  transaction_type text NOT NULL CHECK (transaction_type IN ('ad_revenue', 'subscription', 'tip', 'marketplace', 'collaboration', 'sponsorship')),
  gross_amount numeric NOT NULL,
  creator_share_amount numeric NOT NULL,
  platform_share_amount numeric NOT NULL,
  creator_share_percentage numeric NOT NULL,
  platform_share_percentage numeric NOT NULL,
  currency text DEFAULT 'EUR',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'validated', 'paid', 'disputed', 'refunded')),
  source_id uuid,
  description text,
  metadata jsonb DEFAULT '{}'::jsonb,
  validated_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE revenue_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own revenue transactions"
  ON revenue_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_revenue_transactions_user_id ON revenue_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_revenue_transactions_created_at ON revenue_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_revenue_transactions_status ON revenue_transactions(status);
CREATE INDEX IF NOT EXISTS idx_kyc_verifications_user_id ON kyc_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_creator_monetization_status_user_id ON creator_monetization_status(user_id);

-- Insertion des paliers créateurs
INSERT INTO creator_tiers (name, level, min_subscribers, min_authenticity_score, min_revenue, benefits, revenue_share_boost, description) VALUES
('Basic', 1, 1000, 80, 0, 
  '["Monétisation standard", "Analytics de base", "Support communautaire"]'::jsonb, 
  0, 
  'Accès monétisation standard'),
('Pro', 2, 10000, 90, 1000, 
  '["Analytics avancées", "Priorité recommandation", "Badge certifié", "Support prioritaire"]'::jsonb, 
  10, 
  'Pour créateurs établis avec audience engagée'),
('Elite', 3, 100000, 95, 10000, 
  '["Partage pub 75%", "Account manager dédié", "Accès bêta fonctionnalités", "Promotion prioritaire", "Support VIP 24/7"]'::jsonb, 
  20, 
  'Niveau élite pour créateurs professionnels')
ON CONFLICT (name) DO NOTHING;

-- Insertion des paramètres de monétisation
INSERT INTO monetization_settings (setting_type, creator_share, platform_share, description) VALUES
('ad_revenue', 65, 35, 'Publicité classique'),
('subscription', 80, 20, 'Abonnements payants fans'),
('tip', 95, 5, 'Tips et dons directs'),
('marketplace', 85, 15, 'Services marketplace'),
('collaboration', 100, 0, 'Collaborations (répartition libre entre créateurs)'),
('sponsorship', 90, 10, 'Sponsoring direct intégré')
ON CONFLICT (setting_type) DO NOTHING;

-- Supprimer l'ancienne fonction si elle existe
DROP FUNCTION IF EXISTS check_monetization_eligibility(uuid);

-- Fonction pour vérifier l'éligibilité à la monétisation
CREATE OR REPLACE FUNCTION check_monetization_eligibility(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result jsonb;
  v_kyc_completed boolean;
  v_authenticity_score integer;
  v_subscribers integer;
  v_watch_hours numeric;
  v_shorts_views bigint;
  v_videos integer;
  v_account_age integer;
  v_violations integer;
  v_has_payment boolean;
  v_eligible boolean;
  v_missing_conditions text[];
BEGIN
  -- Récupérer les données KYC
  SELECT 
    identity_verified AND email_verified AND phone_verified AND age_verified AND bank_account_verified
  INTO v_kyc_completed
  FROM kyc_verifications
  WHERE user_id = p_user_id;
  
  v_kyc_completed := COALESCE(v_kyc_completed, false);
  
  -- Récupérer le statut de monétisation actuel
  SELECT 
    authenticity_score,
    total_subscribers,
    watch_hours_12months,
    shorts_views_90days,
    total_videos,
    account_age_days,
    violations_count,
    has_payment_method
  INTO 
    v_authenticity_score,
    v_subscribers,
    v_watch_hours,
    v_shorts_views,
    v_videos,
    v_account_age,
    v_violations,
    v_has_payment
  FROM creator_monetization_status
  WHERE user_id = p_user_id;
  
  -- Valeurs par défaut
  v_authenticity_score := COALESCE(v_authenticity_score, 0);
  v_subscribers := COALESCE(v_subscribers, 0);
  v_watch_hours := COALESCE(v_watch_hours, 0);
  v_shorts_views := COALESCE(v_shorts_views, 0);
  v_videos := COALESCE(v_videos, 0);
  v_account_age := COALESCE(v_account_age, 0);
  v_violations := COALESCE(v_violations, 0);
  v_has_payment := COALESCE(v_has_payment, false);
  
  -- Initialiser le tableau des conditions manquantes
  v_missing_conditions := ARRAY[]::text[];
  
  -- Vérifier les conditions
  IF NOT v_kyc_completed THEN
    v_missing_conditions := array_append(v_missing_conditions, 'Vérification KYC incomplète');
  END IF;
  
  IF v_authenticity_score < 80 THEN
    v_missing_conditions := array_append(v_missing_conditions, 'Score authenticité < 80 (actuel: ' || v_authenticity_score || ')');
  END IF;
  
  IF v_subscribers < 1000 AND v_watch_hours < 4000 AND v_shorts_views < 1000000 THEN
    v_missing_conditions := array_append(v_missing_conditions, 'Seuil audience non atteint');
  END IF;
  
  IF v_videos < 3 THEN
    v_missing_conditions := array_append(v_missing_conditions, 'Minimum 3 vidéos publiques requises');
  END IF;
  
  IF v_account_age < 30 THEN
    v_missing_conditions := array_append(v_missing_conditions, 'Compte doit avoir 30 jours d''activité');
  END IF;
  
  IF v_violations > 0 THEN
    v_missing_conditions := array_append(v_missing_conditions, 'Violations des règles détectées');
  END IF;
  
  IF NOT v_has_payment THEN
    v_missing_conditions := array_append(v_missing_conditions, 'Compte bancaire/Stripe non validé');
  END IF;
  
  -- Déterminer l'éligibilité
  v_eligible := array_length(v_missing_conditions, 1) IS NULL;
  
  -- Construire le résultat JSON
  v_result := jsonb_build_object(
    'eligible', v_eligible,
    'checks', jsonb_build_object(
      'kyc_completed', v_kyc_completed,
      'authenticity_score_ok', v_authenticity_score >= 80,
      'audience_threshold_met', (v_subscribers >= 1000 OR v_watch_hours >= 4000 OR v_shorts_views >= 1000000),
      'minimum_videos_ok', v_videos >= 3,
      'account_age_ok', v_account_age >= 30,
      'no_violations', v_violations = 0,
      'payment_method_ok', v_has_payment
    ),
    'stats', jsonb_build_object(
      'authenticity_score', v_authenticity_score,
      'subscribers', v_subscribers,
      'watch_hours', v_watch_hours,
      'shorts_views', v_shorts_views,
      'videos', v_videos,
      'account_age_days', v_account_age,
      'violations', v_violations
    ),
    'missing_conditions', v_missing_conditions
  );
  
  RETURN v_result;
END;
$$;
