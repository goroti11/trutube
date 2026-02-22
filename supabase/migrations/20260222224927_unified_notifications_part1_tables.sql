/*
  # Unified Notification System Part 1 - Tables

  Create core tables for unified notification system
*/

-- Add columns to existing notifications table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'is_seen') THEN
    ALTER TABLE notifications ADD COLUMN is_seen boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'grouped_with') THEN
    ALTER TABLE notifications ADD COLUMN grouped_with uuid;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'read_at') THEN
    ALTER TABLE notifications ADD COLUMN read_at timestamptz;
  END IF;
END $$;

-- Notification preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  live_enabled boolean DEFAULT true,
  gift_enabled boolean DEFAULT true,
  video_enabled boolean DEFAULT true,
  flow_enabled boolean DEFAULT true,
  studio_enabled boolean DEFAULT true,
  wallet_enabled boolean DEFAULT true,
  marketplace_enabled boolean DEFAULT true,
  moderation_enabled boolean DEFAULT true,
  marketing_enabled boolean DEFAULT false,
  community_enabled boolean DEFAULT true,
  game_enabled boolean DEFAULT true,
  premium_enabled boolean DEFAULT true,
  email_enabled boolean DEFAULT true,
  push_enabled boolean DEFAULT true,
  in_app_enabled boolean DEFAULT true,
  smart_enabled boolean DEFAULT true,
  digest_enabled boolean DEFAULT false,
  digest_frequency text DEFAULT 'daily',
  quiet_hours_start time,
  quiet_hours_end time,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Notification rules
CREATE TABLE IF NOT EXISTS notification_rules (
  type text PRIMARY KEY,
  entity_type text NOT NULL,
  min_priority integer NOT NULL DEFAULT 2,
  cooldown_seconds integer NOT NULL DEFAULT 0,
  groupable boolean DEFAULT false,
  group_window_seconds integer DEFAULT 3600,
  max_group_size integer DEFAULT 10,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Notification groups
CREATE TABLE IF NOT EXISTS notification_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  count integer DEFAULT 1,
  actor_ids uuid[] DEFAULT '{}',
  latest_actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  sample_data jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);