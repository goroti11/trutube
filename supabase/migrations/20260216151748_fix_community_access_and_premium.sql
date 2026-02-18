/*
  # Correction des accès communautés et intégration Premium

  1. Changements
    - Permet à tout utilisateur authentifié de créer une communauté
    - Permet de rejoindre toute communauté (avec vérification premium)
    - Ajoute des helpers pour vérifier le statut premium
    - Améliore les policies pour gérer les communautés premium

  2. Sécurité
    - RLS maintenu sur toutes les tables
    - Vérification du statut premium pour les communautés premium
    - Contrôle d'accès par role
*/

-- Helper function pour vérifier si un utilisateur est premium
CREATE OR REPLACE FUNCTION is_user_premium(user_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  premium_status boolean;
BEGIN
  SELECT is_premium INTO premium_status
  FROM profiles
  WHERE id = user_id_param;
  
  RETURN COALESCE(premium_status, false);
END;
$$;

-- Helper function pour vérifier si un utilisateur est membre d'une communauté
CREATE OR REPLACE FUNCTION is_community_member(community_id_param uuid, user_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_member boolean;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM community_members
    WHERE community_id = community_id_param
    AND user_id = user_id_param
  ) INTO is_member;
  
  RETURN is_member;
END;
$$;

-- Supprimer les anciennes policies restrictives
DROP POLICY IF EXISTS "Creators can manage own communities" ON communities;

-- Nouvelle policy: Tout utilisateur authentifié peut créer une communauté
DROP POLICY IF EXISTS "Users can create communities" ON communities;
CREATE POLICY "Users can create communities"
  ON communities
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

-- Policy: Les créateurs peuvent modifier leurs propres communautés
DROP POLICY IF EXISTS "Creators can update own communities" ON communities;
CREATE POLICY "Creators can update own communities"
  ON communities
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

-- Policy: Les créateurs peuvent supprimer leurs propres communautés
DROP POLICY IF EXISTS "Creators can delete own communities" ON communities;
CREATE POLICY "Creators can delete own communities"
  ON communities
  FOR DELETE
  TO authenticated
  USING (auth.uid() = creator_id);

-- Améliorer la policy de visualisation pour gérer le premium
DROP POLICY IF EXISTS "Anyone can view public communities" ON communities;
CREATE POLICY "Anyone can view public communities"
  ON communities
  FOR SELECT
  TO authenticated
  USING (
    is_active = true 
    AND (
      -- Communautés non-premium: tout le monde peut voir
      is_premium = false
      OR
      -- Communautés premium: seulement les membres premium ou le créateur
      (is_premium = true AND (is_user_premium(auth.uid()) OR auth.uid() = creator_id))
      OR
      -- Ou si l'utilisateur est déjà membre
      is_community_member(id, auth.uid())
    )
  );

-- Policy améliorée pour rejoindre les communautés
DROP POLICY IF EXISTS "Users can join communities" ON community_members;
CREATE POLICY "Users can join communities"
  ON community_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND (
      -- Peut rejoindre si la communauté n'est pas premium
      NOT EXISTS (
        SELECT 1 FROM communities 
        WHERE id = community_id 
        AND is_premium = true
      )
      OR
      -- Ou si l'utilisateur est premium
      is_user_premium(auth.uid())
      OR
      -- Ou si c'est le créateur de la communauté
      EXISTS (
        SELECT 1 FROM communities 
        WHERE id = community_id 
        AND creator_id = auth.uid()
      )
    )
  );

-- Policy pour que les membres puissent quitter une communauté
DROP POLICY IF EXISTS "Users can leave communities" ON community_members;
CREATE POLICY "Users can leave communities"
  ON community_members
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy améliorée pour voir les posts selon le statut premium
DROP POLICY IF EXISTS "Anyone can view approved public posts" ON community_posts;
CREATE POLICY "Anyone can view approved public posts"
  ON community_posts
  FOR SELECT
  TO authenticated
  USING (
    moderation_status = 'approved' 
    AND deleted_at IS NULL
    AND (
      -- Posts publics: tout le monde
      visibility = 'public'
      OR
      -- L'auteur peut voir ses propres posts
      auth.uid() = author_id
      OR
      -- Posts members: si membre de la communauté
      (visibility = 'members' AND is_community_member(community_id, auth.uid()))
      OR
      -- Posts premium: si utilisateur premium
      (visibility = 'premium' AND is_user_premium(auth.uid()))
    )
  );

-- Policy pour créer des posts (seulement si membre de la communauté)
DROP POLICY IF EXISTS "Users can create posts" ON community_posts;
CREATE POLICY "Users can create posts"
  ON community_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = author_id
    AND is_community_member(community_id, auth.uid())
  );

-- Fonction pour mettre à jour le compteur de membres
CREATE OR REPLACE FUNCTION update_community_member_count()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE communities
    SET member_count = member_count + 1
    WHERE id = NEW.community_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE communities
    SET member_count = GREATEST(0, member_count - 1)
    WHERE id = OLD.community_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Trigger pour mettre à jour le compteur de membres
DROP TRIGGER IF EXISTS on_community_member_change ON community_members;
CREATE TRIGGER on_community_member_change
  AFTER INSERT OR DELETE ON community_members
  FOR EACH ROW
  EXECUTE FUNCTION update_community_member_count();

-- Fonction pour mettre à jour le compteur de posts
CREATE OR REPLACE FUNCTION update_community_post_count()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE communities
    SET post_count = post_count + 1
    WHERE id = NEW.community_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE communities
    SET post_count = GREATEST(0, post_count - 1)
    WHERE id = OLD.community_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Trigger pour mettre à jour le compteur de posts
DROP TRIGGER IF EXISTS on_community_post_change ON community_posts;
CREATE TRIGGER on_community_post_change
  AFTER INSERT OR DELETE ON community_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_community_post_count();

-- Ajouter le créateur automatiquement comme owner lors de la création d'une communauté
CREATE OR REPLACE FUNCTION add_creator_as_owner()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO community_members (community_id, user_id, role)
  VALUES (NEW.id, NEW.creator_id, 'owner')
  ON CONFLICT (community_id, user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Trigger pour ajouter le créateur comme owner
DROP TRIGGER IF EXISTS on_community_created ON communities;
CREATE TRIGGER on_community_created
  AFTER INSERT ON communities
  FOR EACH ROW
  EXECUTE FUNCTION add_creator_as_owner();
