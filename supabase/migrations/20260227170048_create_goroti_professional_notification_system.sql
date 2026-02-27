/*
  # Goroti Professional Notification System

  1. Central Architecture
    - `notifications` - Main notification table with all event types
    - `notification_preferences` - User preferences per notification type and channel
    - `notification_rules` - Anti-spam rules with cooldowns and grouping
    - `notification_groups` - Grouped notifications to avoid spam
    - `notification_queue` - Async processing queue

  2. Features
    - Priority system (1-5)
    - Multi-channel (in_app, push, email)
    - Smart grouping (10 likes = 1 notification)
    - Rate limiting
    - Real-time delivery via Supabase Realtime
    - User behavior-based smart notifications

  3. Entity Types Covered
    - Video (upload, like, comment, reply)
    - Flow (start, end, published, recommended)
    - Live (started, scheduled, milestone, top_supporter)
    - Gifts (received, badge_unlocked, status_achieved)
    - TruCoins (purchase, gift_sent, earnings, low_balance)
    - Gaming (duel_launched, victory, leaderboard_update)
    - Marketplace (order_received, payment_validated, delivery, dispute)
    - Moderation (warning, suspension, report_processed)
    - Studio (milestone, monetization_threshold, analytics_ready)
    - Premium (subscription_activated, expired, new_content)
    - System (security, update)

  4. Security
    - RLS on all tables
    - Rate limiting
    - Spam prevention
*/

-- Main notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  entity_type text NOT NULL CHECK (entity_type IN (
    'video', 'flow', 'live', 'gift', 'trucoin', 'gaming', 
    'marketplace', 'moderation', 'studio', 'premium', 'system',
    'comment', 'subscription', 'community'
  )),
  entity_id uuid,
  notification_type text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  data jsonb DEFAULT '{}',
  channel text DEFAULT 'in_app' CHECK (channel IN ('in_app', 'push', 'email')),
  priority integer DEFAULT 2 CHECK (priority BETWEEN 1 AND 5),
  is_read boolean DEFAULT false,
  is_seen boolean DEFAULT false,
  is_grouped boolean DEFAULT false,
  group_id uuid,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '30 days')
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_user_unseen ON notifications(user_id, is_seen) WHERE is_seen = false;
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON notifications(priority DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_entity ON notifications(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_notifications_group ON notifications(group_id) WHERE group_id IS NOT NULL;

-- Notification preferences per user
CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Entity preferences
  video_enabled boolean DEFAULT true,
  video_likes_enabled boolean DEFAULT true,
  video_comments_enabled boolean DEFAULT true,
  
  flow_enabled boolean DEFAULT true,
  flow_start_enabled boolean DEFAULT true,
  flow_end_enabled boolean DEFAULT true,
  
  live_enabled boolean DEFAULT true,
  live_start_enabled boolean DEFAULT true,
  live_milestone_enabled boolean DEFAULT true,
  
  gift_enabled boolean DEFAULT true,
  gift_received_enabled boolean DEFAULT true,
  gift_badge_enabled boolean DEFAULT true,
  
  wallet_enabled boolean DEFAULT true,
  wallet_purchase_enabled boolean DEFAULT true,
  wallet_earnings_enabled boolean DEFAULT true,
  wallet_low_balance_enabled boolean DEFAULT false,
  
  gaming_enabled boolean DEFAULT true,
  gaming_duel_enabled boolean DEFAULT true,
  gaming_victory_enabled boolean DEFAULT true,
  
  marketplace_enabled boolean DEFAULT true,
  marketplace_order_enabled boolean DEFAULT true,
  marketplace_payment_enabled boolean DEFAULT true,
  
  studio_enabled boolean DEFAULT true,
  studio_milestone_enabled boolean DEFAULT true,
  studio_monetization_enabled boolean DEFAULT true,
  
  premium_enabled boolean DEFAULT true,
  premium_subscription_enabled boolean DEFAULT true,
  premium_content_enabled boolean DEFAULT true,
  
  moderation_enabled boolean DEFAULT true,
  system_enabled boolean DEFAULT true,
  marketing_enabled boolean DEFAULT false,
  
  -- Channel preferences
  in_app_enabled boolean DEFAULT true,
  push_enabled boolean DEFAULT true,
  email_enabled boolean DEFAULT false,
  email_digest_frequency text DEFAULT 'weekly' CHECK (email_digest_frequency IN ('never', 'daily', 'weekly', 'monthly')),
  
  -- Smart notifications
  smart_notifications_enabled boolean DEFAULT true,
  quiet_hours_start time DEFAULT '22:00',
  quiet_hours_end time DEFAULT '08:00',
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notification_prefs_user ON notification_preferences(user_id);

-- Notification rules (anti-spam)
CREATE TABLE IF NOT EXISTS notification_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_type text UNIQUE NOT NULL,
  entity_type text NOT NULL,
  min_priority integer DEFAULT 2,
  cooldown_seconds integer DEFAULT 0,
  groupable boolean DEFAULT false,
  group_window_seconds integer DEFAULT 3600,
  max_per_hour integer DEFAULT 10,
  title_template text NOT NULL,
  body_template text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notification_rules_type ON notification_rules(notification_type);

-- Notification groups (for grouping similar notifications)
CREATE TABLE IF NOT EXISTS notification_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  notification_type text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  count integer DEFAULT 1,
  actor_ids uuid[] DEFAULT '{}',
  last_actor_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  first_created_at timestamptz DEFAULT now(),
  last_updated_at timestamptz DEFAULT now(),
  is_sent boolean DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_notification_groups_user ON notification_groups(user_id, notification_type);
CREATE INDEX IF NOT EXISTS idx_notification_groups_entity ON notification_groups(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_notification_groups_pending ON notification_groups(is_sent) WHERE is_sent = false;

-- Notification queue (async processing)
CREATE TABLE IF NOT EXISTS notification_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  notification_type text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  actor_id uuid,
  data jsonb DEFAULT '{}',
  priority integer DEFAULT 2,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'sent', 'failed', 'grouped')),
  retry_count integer DEFAULT 0,
  max_retries integer DEFAULT 3,
  error_message text,
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_notification_queue_pending ON notification_queue(status, priority DESC, created_at) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_notification_queue_user ON notification_queue(user_id);

-- User notification stats
CREATE TABLE IF NOT EXISTS notification_stats (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  total_sent integer DEFAULT 0,
  total_read integer DEFAULT 0,
  total_clicked integer DEFAULT 0,
  last_notification_at timestamptz,
  last_read_at timestamptz,
  avg_read_time_seconds integer,
  favorite_notification_types text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notifications
CREATE POLICY "users_select_own_notifications" ON notifications FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "users_update_own_notifications" ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for notification_preferences
CREATE POLICY "users_select_own_prefs" ON notification_preferences FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "users_insert_own_prefs" ON notification_preferences FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_update_own_prefs" ON notification_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for notification_rules (public read)
CREATE POLICY "notification_rules_select_public" ON notification_rules FOR SELECT
  TO authenticated USING (true);

-- RLS Policies for notification_groups
CREATE POLICY "users_select_own_groups" ON notification_groups FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for notification_queue
CREATE POLICY "users_select_own_queue" ON notification_queue FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for notification_stats
CREATE POLICY "users_select_own_stats" ON notification_stats FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

-- Function to create default notification preferences
CREATE OR REPLACE FUNCTION create_default_notification_preferences()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  INSERT INTO notification_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  DROP TRIGGER IF EXISTS trigger_create_notification_preferences ON profiles;
  CREATE TRIGGER trigger_create_notification_preferences
    AFTER INSERT ON profiles
    FOR EACH ROW EXECUTE FUNCTION create_default_notification_preferences();
END$$;

-- Function to check if notification should be sent
CREATE OR REPLACE FUNCTION should_send_notification(
  p_user_id uuid,
  p_notification_type text,
  p_entity_type text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_prefs record;
  v_enabled boolean := true;
BEGIN
  SELECT * INTO v_prefs
  FROM notification_preferences
  WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN true;
  END IF;
  
  -- Check entity type preferences
  CASE p_entity_type
    WHEN 'video' THEN v_enabled := v_prefs.video_enabled;
    WHEN 'flow' THEN v_enabled := v_prefs.flow_enabled;
    WHEN 'live' THEN v_enabled := v_prefs.live_enabled;
    WHEN 'gift' THEN v_enabled := v_prefs.gift_enabled;
    WHEN 'trucoin' THEN v_enabled := v_prefs.wallet_enabled;
    WHEN 'gaming' THEN v_enabled := v_prefs.gaming_enabled;
    WHEN 'marketplace' THEN v_enabled := v_prefs.marketplace_enabled;
    WHEN 'studio' THEN v_enabled := v_prefs.studio_enabled;
    WHEN 'premium' THEN v_enabled := v_prefs.premium_enabled;
    WHEN 'moderation' THEN v_enabled := v_prefs.moderation_enabled;
    WHEN 'system' THEN v_enabled := v_prefs.system_enabled;
  END CASE;
  
  RETURN v_enabled;
END;
$$;

-- Function to mark notifications as read
CREATE OR REPLACE FUNCTION mark_notifications_read(p_notification_ids uuid[])
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE notifications
  SET is_read = true
  WHERE id = ANY(p_notification_ids)
  AND user_id = auth.uid();
  
  UPDATE notification_stats
  SET 
    total_read = total_read + array_length(p_notification_ids, 1),
    last_read_at = now()
  WHERE user_id = auth.uid();
END;
$$;

-- Function to mark all notifications as seen
CREATE OR REPLACE FUNCTION mark_all_notifications_seen()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE notifications
  SET is_seen = true
  WHERE user_id = auth.uid()
  AND is_seen = false;
END;
$$;