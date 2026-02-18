/*
  # Configuration Storage et Prix Premium

  1. Storage Buckets
    - avatars, banners, videos, thumbnails
    
  2. Premium Tiers
    - Free, Gold, Platinum avec prix
    
  3. Community Premium Pricing
    - Prix personnalisables par communauté
    
  4. Appearance Settings
    - Paramètres d'apparence utilisateur
*/

-- ===== STORAGE BUCKETS =====

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'banners',
  'banners',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'thumbnails',
  'thumbnails',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'videos',
  'videos',
  true,
  524288000,
  ARRAY['video/mp4', 'video/webm', 'video/quicktime']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 524288000,
  allowed_mime_types = ARRAY['video/mp4', 'video/webm', 'video/quicktime'];

-- ===== STORAGE POLICIES =====

DROP POLICY IF EXISTS "Avatars publics" ON storage.objects;
CREATE POLICY "Avatars publics"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Upload avatars" ON storage.objects;
CREATE POLICY "Upload avatars"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Update avatars" ON storage.objects;
CREATE POLICY "Update avatars"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Delete avatars" ON storage.objects;
CREATE POLICY "Delete avatars"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Bannières publiques" ON storage.objects;
CREATE POLICY "Bannières publiques"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'banners');

DROP POLICY IF EXISTS "Upload bannières" ON storage.objects;
CREATE POLICY "Upload bannières"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'banners');

DROP POLICY IF EXISTS "Update bannières" ON storage.objects;
CREATE POLICY "Update bannières"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'banners');

DROP POLICY IF EXISTS "Delete bannières" ON storage.objects;
CREATE POLICY "Delete bannières"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'banners');

DROP POLICY IF EXISTS "Miniatures publiques" ON storage.objects;
CREATE POLICY "Miniatures publiques"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'thumbnails');

DROP POLICY IF EXISTS "Upload miniatures" ON storage.objects;
CREATE POLICY "Upload miniatures"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'thumbnails');

DROP POLICY IF EXISTS "Vidéos publiques" ON storage.objects;
CREATE POLICY "Vidéos publiques"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'videos');

DROP POLICY IF EXISTS "Upload vidéos" ON storage.objects;
CREATE POLICY "Upload vidéos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'videos');

-- ===== TABLE PREMIUM TIERS =====

CREATE TABLE IF NOT EXISTS premium_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  price_monthly numeric(10,2) NOT NULL,
  price_yearly numeric(10,2),
  features jsonb DEFAULT '[]'::jsonb,
  limits jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE premium_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tiers premium publics"
  ON premium_tiers FOR SELECT
  USING (is_active = true);

INSERT INTO premium_tiers (name, slug, description, price_monthly, price_yearly, features, limits, display_order) VALUES
  (
    'Free',
    'free',
    'Accès gratuit aux fonctionnalités de base',
    0.00,
    0.00,
    '["Visionnage illimité", "Commentaires", "Likes", "Abonnements"]'::jsonb,
    '{"upload_size_mb": 100, "storage_gb": 1, "videos_per_month": 10}'::jsonb,
    0
  ),
  (
    'Gold',
    'gold',
    'Pour les créateurs sérieux',
    9.99,
    99.99,
    '["Tout de Free", "Sans publicité", "Qualité 4K", "Recherche IA basique", "Badge Gold"]'::jsonb,
    '{"upload_size_mb": 500, "storage_gb": 50, "videos_per_month": 100}'::jsonb,
    1
  ),
  (
    'Platinum',
    'platinum',
    'Expérience ultime',
    19.99,
    199.99,
    '["Tout de Gold", "Recherche IA GPT-4.2", "Assistant créateur", "Badge Platinum", "Support VIP"]'::jsonb,
    '{"upload_size_mb": 2000, "storage_gb": 200, "videos_per_month": -1}'::jsonb,
    2
  )
ON CONFLICT (slug) DO NOTHING;

-- ===== TABLE COMMUNITY PREMIUM =====

CREATE TABLE IF NOT EXISTS community_premium_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  tier_name text NOT NULL,
  price_monthly numeric(10,2) NOT NULL,
  price_yearly numeric(10,2),
  benefits jsonb DEFAULT '[]'::jsonb,
  max_members integer,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(community_id, tier_name)
);

CREATE INDEX IF NOT EXISTS idx_community_premium_pricing ON community_premium_pricing(community_id);

ALTER TABLE community_premium_pricing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Prix premium communautés publics"
  ON community_premium_pricing FOR SELECT
  USING (is_active = true);

CREATE POLICY "Créateurs gèrent prix communautés"
  ON community_premium_pricing FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM communities
      WHERE communities.id = community_premium_pricing.community_id
      AND communities.creator_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM communities
      WHERE communities.id = community_premium_pricing.community_id
      AND communities.creator_id = auth.uid()
    )
  );

-- ===== TABLE APPEARANCE =====

CREATE TABLE IF NOT EXISTS user_appearance_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  theme text DEFAULT 'dark',
  accent_color text DEFAULT '#ef4444',
  font_size text DEFAULT 'medium',
  layout text DEFAULT 'default',
  sidebar_position text DEFAULT 'left',
  show_thumbnails boolean DEFAULT true,
  autoplay_videos boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_appearance_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Utilisateurs voient leur apparence"
  ON user_appearance_settings FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Utilisateurs gèrent leur apparence"
  ON user_appearance_settings FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Trigger pour créer paramètres par défaut
CREATE OR REPLACE FUNCTION create_default_appearance()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_appearance_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS appearance_trigger ON profiles;
CREATE TRIGGER appearance_trigger
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_default_appearance();
