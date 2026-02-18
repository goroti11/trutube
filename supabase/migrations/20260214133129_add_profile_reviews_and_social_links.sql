/*
  # Système d'avis sur les profils et liens sociaux

  ## Nouvelles tables
  
  1. profile_reviews
    - id (uuid, primary key)
    - reviewer_id (uuid, references profiles)
    - profile_id (uuid, references profiles)
    - rating (integer, 1-5)
    - review_text (text)
    - is_public (boolean)
    - helpful_count (integer)
    - created_at (timestamptz)
    - updated_at (timestamptz)
  
  2. social_links
    - id (uuid, primary key)
    - user_id (uuid, references profiles)
    - platform (text)
    - url (text)
    - display_order (integer)
    - is_visible (boolean)
    - created_at (timestamptz)
  
  3. profile_shares
    - id (uuid, primary key)
    - profile_id (uuid, references profiles)
    - shared_by_user_id (uuid, references profiles)
    - share_method (text)
    - created_at (timestamptz)
  
  ## Modifications
  
  1. Ajout de champs au profil
    - banner_url (text)
    - channel_url (text, unique)
    - about (text)
    - total_reviews (integer)
    - average_rating (numeric)
    - community_guidelines (jsonb)
    - privacy_settings (jsonb)
  
  ## Sécurité
  
  - RLS activé sur toutes les tables
  - Policies pour gérer l'accès aux avis
  - Validation des ratings (1-5)
*/

-- Ajouter des champs au profil
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'banner_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN banner_url text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'channel_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN channel_url text UNIQUE DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'about'
  ) THEN
    ALTER TABLE profiles ADD COLUMN about text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'total_reviews'
  ) THEN
    ALTER TABLE profiles ADD COLUMN total_reviews integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'average_rating'
  ) THEN
    ALTER TABLE profiles ADD COLUMN average_rating numeric(3,2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'community_guidelines'
  ) THEN
    ALTER TABLE profiles ADD COLUMN community_guidelines jsonb DEFAULT '{}'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'privacy_settings'
  ) THEN
    ALTER TABLE profiles ADD COLUMN privacy_settings jsonb DEFAULT '{"show_email": false, "show_subscribers": true, "allow_messages": true, "show_activity": true}'::jsonb;
  END IF;
END $$;

-- Table pour les avis sur les profils
CREATE TABLE IF NOT EXISTS profile_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text DEFAULT '',
  is_public boolean DEFAULT true,
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(reviewer_id, profile_id)
);

-- Table pour les liens sociaux
CREATE TABLE IF NOT EXISTS social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  platform text NOT NULL CHECK (platform IN ('twitter', 'instagram', 'youtube', 'tiktok', 'facebook', 'linkedin', 'twitch', 'discord', 'website', 'other')),
  url text NOT NULL,
  display_order integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Table pour les partages de profils
CREATE TABLE IF NOT EXISTS profile_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  shared_by_user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  share_method text CHECK (share_method IN ('link', 'facebook', 'twitter', 'whatsapp', 'email', 'other')),
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profile_reviews_profile ON profile_reviews(profile_id) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_profile_reviews_reviewer ON profile_reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_social_links_user ON social_links(user_id) WHERE is_visible = true;
CREATE INDEX IF NOT EXISTS idx_profile_shares_profile ON profile_shares(profile_id);
CREATE INDEX IF NOT EXISTS idx_profiles_channel_url ON profiles(channel_url) WHERE channel_url IS NOT NULL AND channel_url != '';

-- Enable RLS
ALTER TABLE profile_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_shares ENABLE ROW LEVEL SECURITY;

-- Policies for profile_reviews
CREATE POLICY "Public reviews are viewable by everyone"
  ON profile_reviews FOR SELECT
  TO authenticated
  USING (is_public = true);

CREATE POLICY "Users can view own reviews"
  ON profile_reviews FOR SELECT
  TO authenticated
  USING (auth.uid() = reviewer_id OR auth.uid() = profile_id);

CREATE POLICY "Users can create reviews"
  ON profile_reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reviewer_id AND reviewer_id != profile_id);

CREATE POLICY "Users can update own reviews"
  ON profile_reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = reviewer_id)
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can delete own reviews"
  ON profile_reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = reviewer_id);

-- Policies for social_links
CREATE POLICY "Visible social links are viewable by everyone"
  ON social_links FOR SELECT
  TO authenticated
  USING (is_visible = true);

CREATE POLICY "Users can view own social links"
  ON social_links FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own social links"
  ON social_links FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own social links"
  ON social_links FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own social links"
  ON social_links FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for profile_shares
CREATE POLICY "Anyone can view profile shares"
  ON profile_shares FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create shares"
  ON profile_shares FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Fonction pour mettre à jour les statistiques d'avis
CREATE OR REPLACE FUNCTION update_profile_review_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE profiles
    SET 
      total_reviews = (
        SELECT COUNT(*) FROM profile_reviews 
        WHERE profile_id = OLD.profile_id AND is_public = true
      ),
      average_rating = (
        SELECT COALESCE(AVG(rating), 0) FROM profile_reviews 
        WHERE profile_id = OLD.profile_id AND is_public = true
      )
    WHERE id = OLD.profile_id;
    RETURN OLD;
  ELSE
    UPDATE profiles
    SET 
      total_reviews = (
        SELECT COUNT(*) FROM profile_reviews 
        WHERE profile_id = NEW.profile_id AND is_public = true
      ),
      average_rating = (
        SELECT COALESCE(AVG(rating), 0) FROM profile_reviews 
        WHERE profile_id = NEW.profile_id AND is_public = true
      )
    WHERE id = NEW.profile_id;
    RETURN NEW;
  END IF;
END;
$$;

-- Trigger pour mettre à jour les stats automatiquement
DROP TRIGGER IF EXISTS trigger_update_profile_review_stats ON profile_reviews;
CREATE TRIGGER trigger_update_profile_review_stats
  AFTER INSERT OR UPDATE OR DELETE ON profile_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_review_stats();

-- Fonction pour générer une URL de chaîne unique
CREATE OR REPLACE FUNCTION generate_channel_url(p_username text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  v_base_url text;
  v_url text;
  v_counter integer := 0;
BEGIN
  v_base_url := LOWER(REGEXP_REPLACE(p_username, '[^a-zA-Z0-9]', '', 'g'));
  v_url := v_base_url;
  
  WHILE EXISTS (SELECT 1 FROM profiles WHERE channel_url = v_url) LOOP
    v_counter := v_counter + 1;
    v_url := v_base_url || v_counter::text;
  END LOOP;
  
  RETURN v_url;
END;
$$;

COMMENT ON TABLE profile_reviews IS 'Système d''avis et d''évaluations pour les profils utilisateurs';
COMMENT ON TABLE social_links IS 'Liens vers les réseaux sociaux et sites externes';
COMMENT ON TABLE profile_shares IS 'Tracking des partages de profils';
