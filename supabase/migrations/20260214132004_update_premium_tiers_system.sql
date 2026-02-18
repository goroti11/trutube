/*
  # Mise à jour du système d'abonnements premium

  ## Modifications
  
  1. Mise à jour de la table premium_subscriptions
    - Modification du check constraint sur le champ tier pour supporter 'premium', 'platine', 'gold'
    - Mise à jour des prix par défaut selon les tiers
  
  2. Nouvelles fonctionnalités
    - Les trois tiers premium disponibles : Premium (9.99€), Platine (19.99€), Gold (29.99€)
    - Chaque tier offre des avantages progressifs
    - Système de changement de tier disponible
  
  ## Avantages par tier
  
  ### Premium (9.99€/mois)
  - Vidéos sans publicité
  - Accès aux contenus exclusifs
  - Téléchargement HD
  - Badge Premium
  - Support prioritaire
  
  ### Platine (19.99€/mois)
  - Tous les avantages Premium
  - Téléchargement 4K
  - Badge Platine animé
  - Statistiques avancées
  - Événements exclusifs
  
  ### Gold (29.99€/mois)
  - Tous les avantages Platine
  - Badge Gold prestigieux
  - Accès VIP créateurs
  - Support dédié 24/7
  - Participation aux décisions
*/

-- Supprimer l'ancien constraint sur le tier
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'premium_subscriptions_tier_check'
  ) THEN
    ALTER TABLE premium_subscriptions DROP CONSTRAINT premium_subscriptions_tier_check;
  END IF;
END $$;

-- Ajouter le nouveau constraint avec les tiers premium, platine, gold
ALTER TABLE premium_subscriptions
ADD CONSTRAINT premium_subscriptions_tier_check 
CHECK (tier IN ('premium', 'platine', 'gold'));

-- Mettre à jour le default du tier vers 'premium'
ALTER TABLE premium_subscriptions
ALTER COLUMN tier SET DEFAULT 'premium';

-- Fonction pour obtenir les avantages d'un tier
CREATE OR REPLACE FUNCTION get_tier_benefits(p_tier text)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN CASE p_tier
    WHEN 'premium' THEN jsonb_build_object(
      'name', 'Premium',
      'price', 9.99,
      'benefits', jsonb_build_array(
        'Vidéos sans publicité',
        'Accès aux contenus exclusifs',
        'Téléchargement HD',
        'Badge Premium',
        'Support prioritaire',
        'Accès anticipé aux nouvelles fonctionnalités'
      )
    )
    WHEN 'platine' THEN jsonb_build_object(
      'name', 'Platine',
      'price', 19.99,
      'benefits', jsonb_build_array(
        'Tous les avantages Premium',
        'Téléchargement 4K',
        'Accès illimité à tous les univers',
        'Badge Platine animé',
        'Playlists personnalisées',
        'Statistiques avancées',
        'Événements en direct exclusifs',
        'Stockage cloud favoris'
      )
    )
    WHEN 'gold' THEN jsonb_build_object(
      'name', 'Gold',
      'price', 29.99,
      'benefits', jsonb_build_array(
        'Tous les avantages Platine',
        'Badge Gold prestigieux',
        'Accès VIP créateurs',
        'Téléchargements illimités',
        'Mode hors ligne avancé',
        'Suggestions IA personnalisées',
        'Événements exclusifs',
        'Coulisses créateurs',
        'Support dédié 24/7',
        'Participation aux décisions'
      )
    )
    ELSE jsonb_build_object('error', 'Invalid tier')
  END;
END;
$$;

-- Fonction pour vérifier si un utilisateur a accès à une fonctionnalité
CREATE OR REPLACE FUNCTION user_has_premium_feature(
  p_user_id uuid,
  p_feature text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_tier text;
  v_status text;
  v_expires_at timestamptz;
BEGIN
  SELECT tier, status, expires_at
  INTO v_tier, v_status, v_expires_at
  FROM premium_subscriptions
  WHERE user_id = p_user_id;

  -- Si pas d'abonnement, pas d'accès
  IF v_tier IS NULL THEN
    RETURN false;
  END IF;

  -- Si abonnement expiré, pas d'accès
  IF v_status != 'active' OR v_expires_at < NOW() THEN
    RETURN false;
  END IF;

  -- Définir les fonctionnalités par tier
  CASE p_feature
    WHEN 'no_ads' THEN RETURN v_tier IN ('premium', 'platine', 'gold');
    WHEN 'hd_download' THEN RETURN v_tier IN ('premium', 'platine', 'gold');
    WHEN '4k_download' THEN RETURN v_tier IN ('platine', 'gold');
    WHEN 'unlimited_downloads' THEN RETURN v_tier = 'gold';
    WHEN 'exclusive_content' THEN RETURN v_tier IN ('premium', 'platine', 'gold');
    WHEN 'advanced_stats' THEN RETURN v_tier IN ('platine', 'gold');
    WHEN 'vip_access' THEN RETURN v_tier = 'gold';
    WHEN 'priority_support' THEN RETURN v_tier IN ('premium', 'platine', 'gold');
    WHEN 'dedicated_support' THEN RETURN v_tier = 'gold';
    ELSE RETURN false;
  END CASE;
END;
$$;

-- Index pour améliorer les performances des requêtes sur les abonnements
CREATE INDEX IF NOT EXISTS idx_premium_subscriptions_status 
ON premium_subscriptions(user_id, status) 
WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_premium_subscriptions_expires 
ON premium_subscriptions(expires_at) 
WHERE status = 'active';

-- Vue pour obtenir les statistiques des abonnements
CREATE OR REPLACE VIEW premium_subscription_stats AS
SELECT
  tier,
  COUNT(*) as total_subscriptions,
  COUNT(*) FILTER (WHERE status = 'active') as active_subscriptions,
  COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_subscriptions,
  COUNT(*) FILTER (WHERE status = 'expired') as expired_subscriptions,
  SUM(price) FILTER (WHERE status = 'active') as monthly_revenue,
  AVG(price) FILTER (WHERE status = 'active') as avg_price
FROM premium_subscriptions
GROUP BY tier;

COMMENT ON VIEW premium_subscription_stats IS 'Statistiques en temps réel des abonnements premium par tier';
