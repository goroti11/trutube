/*
  # Création Automatique de Chaîne au Signup

  1. Description
    - Création automatique d'une chaîne créateur pour chaque nouveau compte
    - La chaîne utilise les données du profil utilisateur (pseudo, avatar)
    - Chaîne publique par défaut avec monétisation désactivée jusqu'au KYC
    - Un compte TruTube possède toujours au moins une chaîne

  2. Trigger
    - Déclenché automatiquement après création du profiles
    - Génère une chaîne avec données par défaut depuis le profil
    - Utilise le username comme nom de chaîne
    - URL de chaîne unique basée sur le user_id

  3. Statut Initial
    - Publication vidéo: activée
    - Monétisation: désactivée (jusqu'au KYC approuvé)
    - Vente premium: désactivée
    - Marketplace: désactivée
    - Paiements: bloqués jusqu'au KYC

  4. Activation Post-KYC
    - Ventes activées après KYC approuvé
    - Retraits possibles après KYC approuvé
    - Marketplace accessible après vérification
    - Abonnements fans activés

  5. Personnalisation
    - Utilisateur peut modifier nom, branding, catégorie
    - Peut créer d'autres chaînes manuellement (max 5 par défaut)
    - Chaîne indépendante de l'identité légale
*/

-- Fonction de création automatique de chaîne par défaut
CREATE OR REPLACE FUNCTION create_default_creator_channel()
RETURNS TRIGGER AS $$
DECLARE
  v_channel_url TEXT;
  v_display_name TEXT;
BEGIN
  -- Générer URL unique basée sur user_id (toujours unique)
  v_channel_url := 'channel-' || NEW.id;

  -- Utiliser le username comme display_name, sinon générer un nom
  v_display_name := COALESCE(NEW.username, NEW.display_name, 'Créateur ' || substring(NEW.id::text from 1 for 8));

  -- Créer la chaîne par défaut
  INSERT INTO creator_channels (
    user_id,
    channel_url,
    display_name,
    channel_type,
    description,
    avatar_url,
    banner_url,
    category,
    is_verified,
    visibility,
    allow_comments,
    allow_video_uploads,
    monetization_enabled,
    premium_sales_enabled,
    marketplace_enabled,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    v_channel_url,
    v_display_name,
    'individual',
    'Bienvenue sur ma chaîne TruTube!',
    COALESCE(NEW.avatar_url, 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg'),
    COALESCE(NEW.banner_url, 'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg'),
    'general',
    false,
    'public',
    true,
    true,
    false,
    false,
    false,
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id, channel_url) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour création automatique de chaîne
DROP TRIGGER IF EXISTS trigger_create_default_channel ON profiles;
CREATE TRIGGER trigger_create_default_channel
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_default_creator_channel();

-- Fonction pour activer la monétisation après KYC
CREATE OR REPLACE FUNCTION activate_channel_monetization_on_kyc()
RETURNS TRIGGER AS $$
BEGIN
  -- Si KYC approuvé, activer monétisation sur toutes les chaînes de l'utilisateur
  IF NEW.kyc_status = 'approved' AND (OLD.kyc_status IS NULL OR OLD.kyc_status != 'approved') THEN
    UPDATE creator_channels
    SET
      monetization_enabled = true,
      premium_sales_enabled = true,
      marketplace_enabled = true,
      updated_at = NOW()
    WHERE user_id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour activation monétisation post-KYC
DROP TRIGGER IF EXISTS trigger_activate_monetization_on_kyc ON legal_profiles;
CREATE TRIGGER trigger_activate_monetization_on_kyc
  AFTER UPDATE OF kyc_status ON legal_profiles
  FOR EACH ROW
  EXECUTE FUNCTION activate_channel_monetization_on_kyc();

-- Fonction pour obtenir la chaîne par défaut d'un utilisateur
CREATE OR REPLACE FUNCTION get_user_default_channel(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  channel_url TEXT,
  display_name TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  category TEXT,
  subscriber_count INTEGER,
  total_views BIGINT,
  is_verified BOOLEAN,
  monetization_enabled BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    cc.id,
    cc.channel_url,
    cc.display_name,
    cc.avatar_url,
    cc.banner_url,
    cc.category,
    cc.subscriber_count,
    cc.total_views,
    cc.is_verified,
    cc.monetization_enabled
  FROM creator_channels cc
  WHERE cc.user_id = p_user_id
  ORDER BY cc.created_at ASC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour vérifier si l'utilisateur peut créer d'autres chaînes
CREATE OR REPLACE FUNCTION can_create_additional_channel(p_user_id UUID)
RETURNS TABLE (
  can_create BOOLEAN,
  current_count INTEGER,
  max_allowed INTEGER,
  reason TEXT
) AS $$
DECLARE
  v_count INTEGER;
  v_kyc_status TEXT;
  v_max_channels INTEGER;
BEGIN
  -- Compter les chaînes existantes
  SELECT COUNT(*) INTO v_count
  FROM creator_channels
  WHERE user_id = p_user_id;

  -- Obtenir le statut KYC
  SELECT COALESCE(lp.kyc_status, 'pending') INTO v_kyc_status
  FROM legal_profiles lp
  WHERE lp.user_id = p_user_id
  LIMIT 1;

  -- Déterminer le nombre max de chaînes selon KYC
  v_max_channels := CASE
    WHEN v_kyc_status = 'approved' THEN 5
    ELSE 1
  END;

  -- Vérifier si peut créer
  IF v_count >= v_max_channels THEN
    RETURN QUERY SELECT
      false,
      v_count,
      v_max_channels,
      'Limite de chaînes atteinte. Complétez la vérification KYC pour créer plus de chaînes.'::TEXT;
  ELSE
    RETURN QUERY SELECT
      true,
      v_count,
      v_max_channels,
      'Vous pouvez créer des chaînes supplémentaires.'::TEXT;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_creator_channels_user_created
ON creator_channels(user_id, created_at);

CREATE INDEX IF NOT EXISTS idx_creator_channels_monetization
ON creator_channels(user_id, monetization_enabled);

-- Commentaires
COMMENT ON FUNCTION create_default_creator_channel() IS
'Crée automatiquement une chaîne par défaut pour chaque nouveau utilisateur';

COMMENT ON FUNCTION activate_channel_monetization_on_kyc() IS
'Active la monétisation sur toutes les chaînes après validation KYC';

COMMENT ON FUNCTION get_user_default_channel(UUID) IS
'Retourne la chaîne par défaut (première créée) d''un utilisateur';

COMMENT ON FUNCTION can_create_additional_channel(UUID) IS
'Vérifie si l''utilisateur peut créer des chaînes supplémentaires selon son statut KYC';