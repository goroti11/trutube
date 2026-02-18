/*
  # Conditions légales Programme Partenaire TruTube

  ## Vue d'ensemble
  Ce système gère les conditions légales et contractuelles du Programme Partenaire TruTube :
  - Statut de partenaire et engagement
  - Conditions d'éligibilité légales
  - Règles de paiement et seuils
  - Suspension et responsabilités
  - Acceptation des termes par créateur

  ## Nouvelles Tables

  1. **partner_program_terms**
     - Versions des conditions légales
     - Historique des modifications
  
  2. **partner_program_acceptances**
     - Acceptation des termes par utilisateur
     - Date et version acceptée
  
  3. **payment_thresholds**
     - Seuils minimum de retrait
     - Configuration par devise

  ## Sécurité
  - RLS activé sur toutes les tables
  - Créateurs voient uniquement leurs données
  - Termes publics pour lecture
*/

-- Table des conditions du programme partenaire
CREATE TABLE IF NOT EXISTS partner_program_terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version text NOT NULL UNIQUE,
  title text NOT NULL,
  content text NOT NULL,
  effective_date date NOT NULL,
  is_current boolean DEFAULT false,
  terms_type text DEFAULT 'partner_program' CHECK (terms_type IN ('partner_program', 'monetization', 'privacy')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE partner_program_terms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view partner program terms"
  ON partner_program_terms FOR SELECT
  TO authenticated
  USING (true);

-- Table des acceptations des conditions par utilisateur
CREATE TABLE IF NOT EXISTS partner_program_acceptances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  terms_id uuid REFERENCES partner_program_terms(id) NOT NULL,
  terms_version text NOT NULL,
  accepted_at timestamptz DEFAULT now(),
  ip_address text,
  user_agent text,
  UNIQUE(user_id, terms_id)
);

ALTER TABLE partner_program_acceptances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own acceptances"
  ON partner_program_acceptances FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own acceptances"
  ON partner_program_acceptances FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Table des seuils de paiement
CREATE TABLE IF NOT EXISTS payment_thresholds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  currency text NOT NULL DEFAULT 'EUR',
  minimum_withdrawal numeric NOT NULL DEFAULT 100,
  processing_fee numeric DEFAULT 0,
  processing_time_days integer DEFAULT 7,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(currency)
);

ALTER TABLE payment_thresholds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view payment thresholds"
  ON payment_thresholds FOR SELECT
  TO authenticated
  USING (true);

-- Table des suspensions de monétisation avec historique
CREATE TABLE IF NOT EXISTS monetization_suspensions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  suspension_type text NOT NULL CHECK (suspension_type IN ('fraud', 'violation', 'copyright', 'fake_engagement', 'investigation')),
  reason text NOT NULL,
  suspended_at timestamptz DEFAULT now(),
  suspended_by uuid,
  is_active boolean DEFAULT true,
  appeal_submitted boolean DEFAULT false,
  appeal_text text,
  appeal_submitted_at timestamptz,
  appeal_decision text CHECK (appeal_decision IN ('pending', 'approved', 'rejected')),
  appeal_decided_at timestamptz,
  appeal_decided_by uuid,
  lifted_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE monetization_suspensions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own suspensions"
  ON monetization_suspensions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own appeal"
  ON monetization_suspensions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND appeal_submitted = true);

-- Table des revenus retenus en cas d'enquête
CREATE TABLE IF NOT EXISTS revenue_holds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount_held numeric NOT NULL,
  currency text DEFAULT 'EUR',
  reason text NOT NULL,
  held_at timestamptz DEFAULT now(),
  investigation_id uuid REFERENCES monetization_suspensions(id),
  is_active boolean DEFAULT true,
  released_at timestamptz,
  released_amount numeric,
  forfeited_amount numeric,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE revenue_holds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own revenue holds"
  ON revenue_holds FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_partner_acceptances_user_id ON partner_program_acceptances(user_id);
CREATE INDEX IF NOT EXISTS idx_monetization_suspensions_user_id ON monetization_suspensions(user_id);
CREATE INDEX IF NOT EXISTS idx_monetization_suspensions_active ON monetization_suspensions(is_active);
CREATE INDEX IF NOT EXISTS idx_revenue_holds_user_id ON revenue_holds(user_id);
CREATE INDEX IF NOT EXISTS idx_revenue_holds_active ON revenue_holds(is_active);

-- Insertion des seuils de paiement
INSERT INTO payment_thresholds (currency, minimum_withdrawal, processing_fee, processing_time_days) VALUES
('EUR', 100, 0, 7),
('USD', 100, 0, 7),
('GBP', 85, 0, 7)
ON CONFLICT (currency) DO NOTHING;

-- Insertion des conditions actuelles du programme partenaire
INSERT INTO partner_program_terms (version, title, content, effective_date, is_current, terms_type) VALUES
('1.0', 'Conditions du Programme Partenaire TruTube', 
'# Conditions légales officielles – Monétisation TruTube

## Statut de partenaire

En rejoignant le Programme Partenaire TruTube, le créateur accepte :
- Respect intégral des Conditions Générales
- Respect des règles communautaires
- Fourniture d''informations exactes (identité, fiscalité, paiement)

## Éligibilité

Pour être éligible, le créateur doit :
- Avoir 18 ans minimum
- Avoir validé son identité via KYC
- Atteindre les seuils d''audience définis (1000 abonnés + 4000h OU 1M vues shorts)
- Maintenir un score d''authenticité ≥ 80/100
- Publier du contenu original ou sous licence valide
- Minimum 3 vidéos publiques
- 30 jours d''activité réelle

## Revenus

Les revenus sont générés via :
- Publicité (65% créateur / 35% plateforme)
- Abonnements payants (80% / 20%)
- Dons / tips (95% / 5%)
- Sponsoring intégré (90% / 10%)
- Marketplace interne (85% / 15%)

## Paiement

- Paiement mensuel automatique
- Seuil minimum de retrait : 100€
- Déduction automatique des commissions
- Retenue possible en cas d''enquête fraude
- Délai de traitement : 7 jours ouvrés

## Suspension

La monétisation peut être suspendue si :
- Activité suspecte détectée
- Violation grave des règles
- Manipulation d''engagement (bots, achats de vues)
- Fraude publicitaire
- Violation des droits d''auteur

**Toute suspension doit être notifiée et justifiée** avec possibilité d''appel.

## Responsabilité

Le créateur est seul responsable de :
- Ses contenus publiés
- Ses déclarations fiscales
- Les droits d''auteur et licences
- Les obligations légales liées à son activité

TruTube agit comme plateforme d''hébergement et d''intermédiation.

## Modification des termes

TruTube se réserve le droit de modifier ces conditions avec :
- Préavis de 30 jours minimum
- Notification par email
- Acceptation requise pour continuer

## Résiliation

Le créateur peut quitter le programme à tout moment.
TruTube peut résilier le partenariat en cas de violations graves répétées.

---

En acceptant ces conditions, vous reconnaissez avoir lu, compris et accepté l''ensemble des termes du Programme Partenaire TruTube.', 
'2026-02-16', 
true,
'partner_program')
ON CONFLICT (version) DO NOTHING;

-- Fonction pour vérifier si un utilisateur a accepté les derniers termes
CREATE OR REPLACE FUNCTION has_accepted_latest_terms(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_latest_terms_id uuid;
  v_accepted boolean;
BEGIN
  -- Récupérer l'ID des termes actuels
  SELECT id INTO v_latest_terms_id
  FROM partner_program_terms
  WHERE is_current = true AND terms_type = 'partner_program'
  LIMIT 1;
  
  IF v_latest_terms_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Vérifier si l'utilisateur a accepté ces termes
  SELECT EXISTS(
    SELECT 1 FROM partner_program_acceptances
    WHERE user_id = p_user_id AND terms_id = v_latest_terms_id
  ) INTO v_accepted;
  
  RETURN v_accepted;
END;
$$;

-- Fonction pour calculer le revenu disponible au retrait
CREATE OR REPLACE FUNCTION get_available_balance(p_user_id uuid)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total_validated numeric;
  v_total_held numeric;
  v_total_withdrawn numeric;
  v_available numeric;
BEGIN
  -- Revenus validés
  SELECT COALESCE(SUM(creator_share_amount), 0) INTO v_total_validated
  FROM revenue_transactions
  WHERE user_id = p_user_id AND status IN ('validated', 'paid');
  
  -- Revenus retenus
  SELECT COALESCE(SUM(amount_held), 0) INTO v_total_held
  FROM revenue_holds
  WHERE user_id = p_user_id AND is_active = true;
  
  -- Déjà retiré (dans cet exemple simplifié on considère paid comme retiré)
  SELECT COALESCE(SUM(creator_share_amount), 0) INTO v_total_withdrawn
  FROM revenue_transactions
  WHERE user_id = p_user_id AND status = 'paid';
  
  -- Calcul du disponible
  v_available := v_total_validated - v_total_held - v_total_withdrawn;
  
  RETURN GREATEST(v_available, 0);
END;
$$;
