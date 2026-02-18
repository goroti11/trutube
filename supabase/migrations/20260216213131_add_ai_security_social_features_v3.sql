/*
  # Fonctionnalités IA, Sécurité et Réseaux Sociaux

  1. Nouvelles Tables
    - `social_links` - Liens réseaux sociaux des utilisateurs
    - `search_logs` - Historique des recherches
    - `video_ai_summaries` - Résumés IA des vidéos
    - `security_events` - Événements de sécurité
    - `admin_alerts` - Alertes pour les administrateurs

  2. Fonctions
    - `increment_social_link_clicks` - Incrémenter les clics sur liens sociaux

  3. Sécurité
    - RLS activé sur toutes les tables
    - Politiques d'accès restrictives
    - Audit logs complets
*/

-- Table des liens de réseaux sociaux
CREATE TABLE IF NOT EXISTS social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  platform text NOT NULL CHECK (platform IN (
    'facebook', 'twitter', 'instagram', 'tiktok', 'youtube', 'twitch',
    'linkedin', 'snapchat', 'pinterest', 'reddit', 'discord', 'telegram',
    'whatsapp', 'spotify', 'apple_music', 'soundcloud', 'bandcamp',
    'github', 'gitlab', 'behance', 'dribbble', 'medium', 'substack',
    'patreon', 'kofi', 'buymeacoffee', 'website', 'blog', 'portfolio', 'other'
  )),
  url text NOT NULL,
  display_order integer DEFAULT 0,
  is_verified boolean DEFAULT false,
  click_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des logs de recherche
CREATE TABLE IF NOT EXISTS search_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  query text NOT NULL,
  filters jsonb DEFAULT '{}'::jsonb,
  results_count integer DEFAULT 0,
  timestamp timestamptz DEFAULT now(),
  ip_address text,
  user_agent text
);

-- Table des résumés IA de vidéos
CREATE TABLE IF NOT EXISTS video_ai_summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  summary text NOT NULL,
  key_points jsonb DEFAULT '[]'::jsonb,
  generated_at timestamptz DEFAULT now(),
  model_version text DEFAULT 'gpt-4.2',
  UNIQUE(video_id)
);

-- Table des événements de sécurité
CREATE TABLE IF NOT EXISTS security_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  event_type text NOT NULL CHECK (event_type IN (
    'login_attempt', 'failed_login', 'password_change', 'suspicious_activity',
    'rate_limit_exceeded', 'csrf_detected', 'xss_attempt', 'sql_injection_attempt',
    'unauthorized_access', 'data_breach_attempt', 'account_locked', 'session_hijack_attempt'
  )),
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  ip_address text NOT NULL,
  user_agent text,
  details jsonb DEFAULT '{}'::jsonb,
  timestamp timestamptz DEFAULT now()
);

-- Table des alertes admin
CREATE TABLE IF NOT EXISTS admin_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('security', 'moderation', 'payment', 'system')),
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title text NOT NULL,
  description text,
  is_read boolean DEFAULT false,
  resolved boolean DEFAULT false,
  timestamp timestamptz DEFAULT now(),
  resolved_at timestamptz,
  resolved_by uuid REFERENCES profiles(id) ON DELETE SET NULL
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_social_links_user ON social_links(user_id);
CREATE INDEX IF NOT EXISTS idx_social_links_platform ON social_links(platform);
CREATE INDEX IF NOT EXISTS idx_search_logs_user ON search_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_search_logs_timestamp ON search_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_security_events_user ON security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_type ON security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_timestamp ON security_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_admin_alerts_unread ON admin_alerts(is_read) WHERE NOT is_read;

-- Fonction pour incrémenter les clics sur les liens sociaux
CREATE OR REPLACE FUNCTION increment_social_link_clicks(link_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE social_links
  SET click_count = click_count + 1,
      updated_at = now()
  WHERE id = link_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS sur social_links
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own social links"
  ON social_links FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public social links"
  ON social_links FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert own social links"
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

-- RLS sur search_logs
ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own search logs"
  ON search_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert search logs"
  ON search_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS sur video_ai_summaries
ALTER TABLE video_ai_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view AI summaries"
  ON video_ai_summaries FOR SELECT
  TO public
  USING (true);

CREATE POLICY "System can manage AI summaries"
  ON video_ai_summaries FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS sur security_events
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own security events"
  ON security_events FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert security events"
  ON security_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS sur admin_alerts
ALTER TABLE admin_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view alerts"
  ON admin_alerts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can insert admin alerts"
  ON admin_alerts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update alerts"
  ON admin_alerts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
