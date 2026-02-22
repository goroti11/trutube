/*
  # Intelligent Notification System
  
  1. Core Features
    - Real-time in-app notifications
    - Push notification support (FCM/APNS)
    - Email notifications for important events
    - Priority-based delivery (1-5)
    - User preferences per category
    - Smart filtering based on user behavior
  
  2. Notification Types
    - Live: Stream starts, scheduled, premium, games, milestones, cinema
    - Gifts: Received, tier upgrade, records, badges
    - Games: Duel launch, lottery win, quiz end, leaderboard
    - Wallet: Credits, payment, low balance, suspicious activity
    - Moderation: Warnings, suspensions, terms updates, reports
  
  3. New Tables
    - `notifications` - All notifications
    - `notification_preferences` - User settings per category
    - `notification_delivery_log` - Track delivery status
    - `user_notification_behavior` - Track engagement for smart filtering
  
  4. Smart Filtering
    - Only notify for creators user recently watched
    - Only high-tier gifts above threshold
    - Only games user participates in
    - Priority-based throttling
*/

-- Notification type enum
DO $$ BEGIN
  CREATE TYPE notification_type AS ENUM (
    'live_started',
    'live_scheduled',
    'live_premium',
    'live_game_launched',
    'live_milestone_reached',
    'live_cinema_mode',
    'live_top_supporter',
    'gift_received',
    'gift_tier_upgrade',
    'gift_record',
    'gift_badge_unlocked',
    'game_duel_launched',
    'game_lottery_won',
    'game_quiz_ended',
    'game_leaderboard_rank',
    'wallet_credited',
    'wallet_payment_confirmed',
    'wallet_low_balance',
    'wallet_suspicious_activity',
    'moderation_warning',
    'moderation_suspension',
    'moderation_terms_update',
    'moderation_report_processed',
    'marketing_promotion',
    'marketing_new_feature'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Notification category enum
DO $$ BEGIN
  CREATE TYPE notification_category AS ENUM (
    'live',
    'gifts',
    'games',
    'wallet',
    'moderation',
    'marketing'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Delivery channel enum
DO $$ BEGIN
  CREATE TYPE delivery_channel AS ENUM ('in_app', 'push', 'email', 'sms');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Delivery status enum
DO $$ BEGIN
  CREATE TYPE delivery_status AS ENUM ('pending', 'sent', 'delivered', 'failed', 'skipped');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type notification_type NOT NULL,
  category notification_category NOT NULL,
  priority integer DEFAULT 3 CHECK (priority >= 1 AND priority <= 5),
  title text NOT NULL CHECK (char_length(title) >= 1 AND char_length(title) <= 100),
  body text NOT NULL CHECK (char_length(body) >= 1 AND char_length(body) <= 500),
  data jsonb DEFAULT '{}' NOT NULL,
  action_url text,
  is_read boolean DEFAULT false NOT NULL,
  is_actionable boolean DEFAULT false NOT NULL,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  read_at timestamptz
);

-- Notification Preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- In-App preferences
  live_in_app boolean DEFAULT true NOT NULL,
  gifts_in_app boolean DEFAULT true NOT NULL,
  games_in_app boolean DEFAULT true NOT NULL,
  wallet_in_app boolean DEFAULT true NOT NULL,
  moderation_in_app boolean DEFAULT true NOT NULL,
  marketing_in_app boolean DEFAULT false NOT NULL,
  
  -- Push preferences
  live_push boolean DEFAULT true NOT NULL,
  gifts_push boolean DEFAULT true NOT NULL,
  games_push boolean DEFAULT true NOT NULL,
  wallet_push boolean DEFAULT true NOT NULL,
  moderation_push boolean DEFAULT true NOT NULL,
  marketing_push boolean DEFAULT false NOT NULL,
  
  -- Email preferences
  live_email boolean DEFAULT false NOT NULL,
  gifts_email boolean DEFAULT false NOT NULL,
  games_email boolean DEFAULT false NOT NULL,
  wallet_email boolean DEFAULT true NOT NULL,
  moderation_email boolean DEFAULT true NOT NULL,
  marketing_email boolean DEFAULT false NOT NULL,
  
  -- Device tokens
  fcm_token text,
  apns_token text,
  
  -- Quiet hours
  quiet_hours_enabled boolean DEFAULT false NOT NULL,
  quiet_hours_start time DEFAULT '22:00:00',
  quiet_hours_end time DEFAULT '08:00:00',
  
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Notification Delivery Log
CREATE TABLE IF NOT EXISTS notification_delivery_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id uuid REFERENCES notifications(id) ON DELETE CASCADE NOT NULL,
  channel delivery_channel NOT NULL,
  status delivery_status DEFAULT 'pending' NOT NULL,
  error_message text,
  delivered_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- User Notification Behavior (for smart filtering)
CREATE TABLE IF NOT EXISTS user_notification_behavior (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  last_watched_at timestamptz,
  last_gift_sent_at timestamptz,
  total_gifts_sent numeric(10,2) DEFAULT 0,
  last_game_played_at timestamptz,
  games_played_count integer DEFAULT 0,
  is_favorite boolean DEFAULT false NOT NULL,
  engagement_score integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, creator_id)
);

-- Notification Templates (for consistency)
CREATE TABLE IF NOT EXISTS notification_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type notification_type NOT NULL UNIQUE,
  category notification_category NOT NULL,
  priority integer DEFAULT 3,
  title_template text NOT NULL,
  body_template text NOT NULL,
  action_url_template text,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_user_category ON notifications(user_id, category, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON notifications(priority DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_expires ON notifications(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_notification_delivery_log_notification ON notification_delivery_log(notification_id, channel);
CREATE INDEX IF NOT EXISTS idx_user_notification_behavior_user ON user_notification_behavior(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notification_behavior_creator ON user_notification_behavior(creator_id);
CREATE INDEX IF NOT EXISTS idx_user_notification_behavior_engagement ON user_notification_behavior(user_id, engagement_score DESC);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_delivery_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notification_behavior ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;

-- Notifications Policies
CREATE POLICY "Users view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Notification Preferences Policies
CREATE POLICY "Users manage own preferences"
  ON notification_preferences FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Notification Delivery Log Policies
CREATE POLICY "Users view own delivery logs"
  ON notification_delivery_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM notifications
      WHERE id = notification_delivery_log.notification_id
      AND user_id = auth.uid()
    )
  );

-- User Notification Behavior Policies
CREATE POLICY "Users view own behavior"
  ON user_notification_behavior FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Notification Templates Policies
CREATE POLICY "Anyone can view templates"
  ON notification_templates FOR SELECT
  USING (is_active = true);

-- Seed Notification Templates
INSERT INTO notification_templates (type, category, priority, title_template, body_template, action_url_template) VALUES
  -- Live notifications (Priority 4)
  ('live_started', 'live', 4, '{creator_name} is LIVE!', '{creator_name} just started streaming: {stream_title}', '/watch/{stream_id}'),
  ('live_scheduled', 'live', 4, '{creator_name} goes live soon', 'Starting in 10 minutes: {stream_title}', '/watch/{stream_id}'),
  ('live_premium', 'live', 3, 'Premium Live Available', '{creator_name} started a premium stream', '/watch/{stream_id}'),
  ('live_game_launched', 'live', 3, 'Game Started!', '{game_type} game launched in {creator_name}''s stream', '/watch/{stream_id}'),
  ('live_milestone_reached', 'live', 2, 'Milestone Reached!', 'Community challenge completed: {challenge_title}', '/watch/{stream_id}'),
  ('live_cinema_mode', 'live', 3, 'Cinema Mode Activated', '{creator_name} activated cinema effects!', '/watch/{stream_id}'),
  ('live_top_supporter', 'live', 3, 'You''re Top Supporter!', 'You''re ranked #{rank} in {creator_name}''s stream', '/watch/{stream_id}'),
  
  -- Gift notifications (Priority 3)
  ('gift_received', 'gifts', 3, 'Gift Received!', '{sender_name} sent you {gift_name}', '/wallet'),
  ('gift_tier_upgrade', 'gifts', 3, 'Tier Upgrade!', 'You''ve reached {tier} supporter status', '/profile/{user_id}'),
  ('gift_record', 'gifts', 2, 'New Record!', 'You set a new support record: {amount} TruCoins', '/profile/{user_id}'),
  ('gift_badge_unlocked', 'gifts', 3, 'Badge Unlocked!', 'You earned the {badge_name} badge!', '/profile/{user_id}/badges'),
  
  -- Game notifications (Priority 2)
  ('game_duel_launched', 'games', 2, 'Duel Started!', 'Vote now: {option_a} vs {option_b}', '/watch/{stream_id}'),
  ('game_lottery_won', 'games', 3, 'You Won!', 'Congratulations! You won {prize} in the live draw', '/wallet'),
  ('game_quiz_ended', 'games', 2, 'Quiz Results', 'Quiz ended. You scored {score} points', '/watch/{stream_id}'),
  ('game_leaderboard_rank', 'games', 2, 'Leaderboard Update', 'You''re ranked #{rank} on the {category} leaderboard', '/watch/{stream_id}'),
  
  -- Wallet notifications (Priority 5 for security, 4 for normal)
  ('wallet_credited', 'wallet', 4, 'TruCoins Credited', '{amount} TruCoins added to your wallet', '/wallet'),
  ('wallet_payment_confirmed', 'wallet', 4, 'Payment Confirmed', 'Your payment of {amount} has been processed', '/wallet'),
  ('wallet_low_balance', 'wallet', 3, 'Low Balance', 'Your wallet balance is low: {balance} TruCoins', '/wallet/add'),
  ('wallet_suspicious_activity', 'wallet', 5, 'Security Alert', 'Suspicious activity detected on your account', '/settings/security'),
  
  -- Moderation notifications (Priority 5)
  ('moderation_warning', 'moderation', 5, 'Warning Issued', 'You received a warning: {reason}', '/settings/account'),
  ('moderation_suspension', 'moderation', 5, 'Account Suspended', 'Your account has been suspended: {reason}', '/settings/account'),
  ('moderation_terms_update', 'moderation', 4, 'Terms Updated', 'Our terms of service have been updated', '/legal/terms'),
  ('moderation_report_processed', 'moderation', 3, 'Report Processed', 'Your report has been reviewed', '/settings/reports'),
  
  -- Marketing notifications (Priority 1)
  ('marketing_promotion', 'marketing', 1, 'Special Offer!', '{promotion_title}', '/promotions/{promo_id}'),
  ('marketing_new_feature', 'marketing', 1, 'New Feature!', 'Check out our latest feature: {feature_name}', '/features')
ON CONFLICT (type) DO NOTHING;

-- Function to create default preferences for new users
CREATE OR REPLACE FUNCTION create_default_notification_preferences()
RETURNS trigger
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

-- Trigger to auto-create preferences
DROP TRIGGER IF EXISTS on_profile_created_notification_preferences ON profiles;
CREATE TRIGGER on_profile_created_notification_preferences
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_default_notification_preferences();

-- Function to clean up expired notifications
CREATE OR REPLACE FUNCTION cleanup_expired_notifications()
RETURNS integer
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_deleted_count integer;
BEGIN
  DELETE FROM notifications
  WHERE expires_at IS NOT NULL
  AND expires_at < now();
  
  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  RETURN v_deleted_count;
END;
$$;

-- Function to update engagement score
CREATE OR REPLACE FUNCTION update_user_engagement_score(
  p_user_id uuid,
  p_creator_id uuid
)
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_score integer;
BEGIN
  -- Calculate engagement score based on recent activity
  v_score := 0;
  
  -- Recent watch (last 7 days): +30 points
  IF EXISTS (
    SELECT 1 FROM user_notification_behavior
    WHERE user_id = p_user_id
    AND creator_id = p_creator_id
    AND last_watched_at > now() - interval '7 days'
  ) THEN
    v_score := v_score + 30;
  END IF;
  
  -- Recent gift (last 7 days): +40 points
  IF EXISTS (
    SELECT 1 FROM user_notification_behavior
    WHERE user_id = p_user_id
    AND creator_id = p_creator_id
    AND last_gift_sent_at > now() - interval '7 days'
  ) THEN
    v_score := v_score + 40;
  END IF;
  
  -- Recent game (last 7 days): +20 points
  IF EXISTS (
    SELECT 1 FROM user_notification_behavior
    WHERE user_id = p_user_id
    AND creator_id = p_creator_id
    AND last_game_played_at > now() - interval '7 days'
  ) THEN
    v_score := v_score + 20;
  END IF;
  
  -- Favorite: +50 points
  IF EXISTS (
    SELECT 1 FROM user_notification_behavior
    WHERE user_id = p_user_id
    AND creator_id = p_creator_id
    AND is_favorite = true
  ) THEN
    v_score := v_score + 50;
  END IF;
  
  -- Update score
  UPDATE user_notification_behavior
  SET engagement_score = v_score,
      updated_at = now()
  WHERE user_id = p_user_id
  AND creator_id = p_creator_id;
END;
$$;

GRANT EXECUTE ON FUNCTION cleanup_expired_notifications TO authenticated;
GRANT EXECUTE ON FUNCTION update_user_engagement_score TO authenticated;
