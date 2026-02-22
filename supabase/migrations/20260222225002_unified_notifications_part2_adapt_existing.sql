/*
  # Unified Notification System Part 2 - Adapt Existing

  Adapt existing notification_preferences and add new columns
*/

-- Add new columns to notification_preferences
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notification_preferences' AND column_name = 'video_enabled') THEN
    ALTER TABLE notification_preferences ADD COLUMN video_enabled boolean DEFAULT true;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notification_preferences' AND column_name = 'flow_enabled') THEN
    ALTER TABLE notification_preferences ADD COLUMN flow_enabled boolean DEFAULT true;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notification_preferences' AND column_name = 'studio_enabled') THEN
    ALTER TABLE notification_preferences ADD COLUMN studio_enabled boolean DEFAULT true;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notification_preferences' AND column_name = 'marketplace_enabled') THEN
    ALTER TABLE notification_preferences ADD COLUMN marketplace_enabled boolean DEFAULT true;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notification_preferences' AND column_name = 'community_enabled') THEN
    ALTER TABLE notification_preferences ADD COLUMN community_enabled boolean DEFAULT true;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notification_preferences' AND column_name = 'game_enabled') THEN
    ALTER TABLE notification_preferences ADD COLUMN game_enabled boolean DEFAULT true;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notification_preferences' AND column_name = 'premium_enabled') THEN
    ALTER TABLE notification_preferences ADD COLUMN premium_enabled boolean DEFAULT true;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notification_preferences' AND column_name = 'smart_enabled') THEN
    ALTER TABLE notification_preferences ADD COLUMN smart_enabled boolean DEFAULT true;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notification_preferences' AND column_name = 'digest_enabled') THEN
    ALTER TABLE notification_preferences ADD COLUMN digest_enabled boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notification_preferences' AND column_name = 'digest_frequency') THEN
    ALTER TABLE notification_preferences ADD COLUMN digest_frequency text DEFAULT 'daily';
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_unseen ON notifications(user_id) WHERE is_seen = false;
CREATE INDEX IF NOT EXISTS idx_notif_prefs_smart ON notification_preferences(user_id) WHERE smart_enabled = true;
CREATE INDEX IF NOT EXISTS idx_notif_groups_user ON notification_groups(user_id, type, entity_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_notif_groups_active ON notification_groups(user_id, is_active, updated_at DESC);

-- RLS
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_groups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own prefs unified" ON notification_preferences;
CREATE POLICY "Users can view own prefs unified"
  ON notification_preferences FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own prefs unified" ON notification_preferences;
CREATE POLICY "Users can update own prefs unified"
  ON notification_preferences FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own prefs unified" ON notification_preferences;
CREATE POLICY "Users can insert own prefs unified"
  ON notification_preferences FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Anyone can view rules unified" ON notification_rules;
CREATE POLICY "Anyone can view rules unified"
  ON notification_rules FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can view own groups unified" ON notification_groups;
CREATE POLICY "Users can view own groups unified"
  ON notification_groups FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Helper functions
CREATE OR REPLACE FUNCTION initialize_notification_preferences_unified()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_user_created_init_notif_prefs_unified ON auth.users;
CREATE TRIGGER on_user_created_init_notif_prefs_unified
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION initialize_notification_preferences_unified();

CREATE OR REPLACE FUNCTION update_notification_timestamp_unified()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_notif_prefs_ts_unified ON notification_preferences;
CREATE TRIGGER update_notif_prefs_ts_unified
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_notification_timestamp_unified();

DROP TRIGGER IF EXISTS update_notif_groups_ts_unified ON notification_groups;
CREATE TRIGGER update_notif_groups_ts_unified
  BEFORE UPDATE ON notification_groups
  FOR EACH ROW
  EXECUTE FUNCTION update_notification_timestamp_unified();

CREATE OR REPLACE FUNCTION cleanup_old_notifications_unified()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM notifications
  WHERE is_read = true AND created_at < now() - interval '30 days';
  
  DELETE FROM notifications
  WHERE is_read = false AND priority <= 2 AND created_at < now() - interval '90 days';
  
  UPDATE notification_groups
  SET is_active = false
  WHERE updated_at < now() - interval '7 days' AND is_active = true;
END;
$$;