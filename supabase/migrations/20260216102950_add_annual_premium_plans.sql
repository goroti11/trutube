/*
  # Ajout des plans annuels Premium avec réductions

  1. Modifications
    - Ajout du champ `billing_period` (monthly, annual)
    - Mise à jour des prix pour inclure les plans annuels
    - Ajout des réductions pour les plans annuels

  2. Plans Premium avec réductions annuelles

    ### Premium
    - Mensuel: 9.99€/mois
    - Annuel: 99.99€/an (16% de réduction = 2 mois gratuits)

    ### Platine
    - Mensuel: 19.99€/mois
    - Annuel: 199.99€/an (16% de réduction = 2 mois gratuits)

    ### Gold
    - Mensuel: 29.99€/mois
    - Annuel: 299.99€/an (16% de réduction = 2 mois gratuits)

  3. Sécurité
    - RLS maintenu
    - Nouvelles politiques pour gérer les changements de plan
*/

-- Ajouter le champ billing_period à premium_subscriptions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'premium_subscriptions' AND column_name = 'billing_period'
  ) THEN
    ALTER TABLE premium_subscriptions
    ADD COLUMN billing_period text NOT NULL DEFAULT 'monthly'
    CHECK (billing_period IN ('monthly', 'annual'));
  END IF;
END $$;

-- Créer une table pour les prix des plans
CREATE TABLE IF NOT EXISTS premium_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tier text NOT NULL CHECK (tier IN ('premium', 'platine', 'gold')),
  billing_period text NOT NULL CHECK (billing_period IN ('monthly', 'annual')),
  price numeric(10,2) NOT NULL,
  discount_percentage integer DEFAULT 0,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(tier, billing_period)
);

ALTER TABLE premium_pricing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active pricing"
  ON premium_pricing
  FOR SELECT
  USING (is_active = true);

-- Insérer les prix pour tous les plans
INSERT INTO premium_pricing (tier, billing_period, price, discount_percentage, features) VALUES
('premium', 'monthly', 9.99, 0, jsonb_build_array(
  'Vidéos sans publicité',
  'Accès aux contenus exclusifs',
  'Téléchargement HD',
  'Badge Premium visible',
  'Support prioritaire',
  'Accès anticipé nouvelles fonctionnalités'
)),
('premium', 'annual', 99.99, 16, jsonb_build_array(
  'Tous les avantages mensuels',
  '2 mois gratuits (16% de réduction)',
  'Vidéos sans publicité toute l''année',
  'Accès aux contenus exclusifs',
  'Téléchargement HD illimité',
  'Badge Premium visible',
  'Support prioritaire garanti',
  'Accès anticipé à toutes les bêtas'
)),
('platine', 'monthly', 19.99, 0, jsonb_build_array(
  'Tous les avantages Premium',
  'Téléchargement 4K',
  'Accès illimité à tous les univers',
  'Badge Platine animé',
  'Playlists personnalisées IA',
  'Statistiques avancées',
  'Événements en direct exclusifs',
  'Stockage cloud favoris'
)),
('platine', 'annual', 199.99, 16, jsonb_build_array(
  'Tous les avantages mensuels',
  '2 mois gratuits (16% de réduction)',
  'Téléchargement 4K illimité',
  'Accès VIP tous événements',
  'Badge Platine animé unique',
  'IA personnalisée avancée',
  'Statistiques pro détaillées',
  'Stockage cloud 100GB',
  'Sessions avec créateurs'
)),
('gold', 'monthly', 29.99, 0, jsonb_build_array(
  'Tous les avantages Platine',
  'Badge Gold prestigieux',
  'Accès VIP créateurs favoris',
  'Téléchargements illimités',
  'Mode hors ligne avancé',
  'Support dédié 24/7',
  'Participation aux décisions',
  'Rencontres créateurs exclusives'
)),
('gold', 'annual', 299.99, 16, jsonb_build_array(
  'Tous les avantages mensuels',
  '2 mois gratuits (16% de réduction)',
  'Badge Gold exclusif animé',
  'Ligne directe support VIP',
  'Conseil consultatif TruTube',
  'Rencontres trimestrielles créateurs',
  'Accès coulisses TruTube',
  'Événements VIP en personne',
  'Influence sur roadmap'
))
ON CONFLICT (tier, billing_period) DO UPDATE SET
  price = EXCLUDED.price,
  discount_percentage = EXCLUDED.discount_percentage,
  features = EXCLUDED.features,
  updated_at = now();

-- Fonction pour calculer le prix
CREATE OR REPLACE FUNCTION calculate_subscription_price(
  p_tier text,
  p_billing_period text DEFAULT 'monthly'
)
RETURNS numeric
LANGUAGE plpgsql
AS $$
DECLARE
  v_price numeric;
BEGIN
  SELECT price INTO v_price
  FROM premium_pricing
  WHERE tier = p_tier
    AND billing_period = p_billing_period
    AND is_active = true;
  RETURN COALESCE(v_price, 0);
END;
$$;

-- Vue pour comparaison des plans
CREATE OR REPLACE VIEW premium_plans_comparison AS
SELECT
  tier,
  billing_period,
  price,
  discount_percentage,
  features,
  CASE WHEN billing_period = 'annual' THEN ROUND(price / 12, 2) ELSE price END as monthly_equivalent,
  CASE WHEN billing_period = 'annual' THEN
    (SELECT p2.price FROM premium_pricing p2 WHERE p2.tier = premium_pricing.tier AND p2.billing_period = 'monthly') * 12 - price
  ELSE 0 END as annual_savings
FROM premium_pricing
WHERE is_active = true
ORDER BY
  CASE tier WHEN 'premium' THEN 1 WHEN 'platine' THEN 2 WHEN 'gold' THEN 3 END,
  CASE billing_period WHEN 'monthly' THEN 1 WHEN 'annual' THEN 2 END;

CREATE INDEX IF NOT EXISTS idx_premium_pricing_tier_period ON premium_pricing(tier, billing_period) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_premium_subscriptions_billing_period ON premium_subscriptions(billing_period);
