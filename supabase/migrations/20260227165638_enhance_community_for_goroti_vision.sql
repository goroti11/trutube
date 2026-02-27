/*
  # Enhance Goroti Community System for Strategic Vision

  1. Updates to community_posts
    - Add announcement types (album, live, merch, collaboration)
    - Add product linking fields
    - Add discovery_score for intelligent feed
  
  2. New Tables
    - `user_feed_preferences` - User control over feed algorithm
    - `expert_validations` - Expert status for premium group creation
    - `group_subscriptions` - Premium group subscriptions
    - `story_announcements` - Official announcement tracking in stories
  
  3. Features
    - Three-layer feed algorithm support
    - Premium group validation
    - Official announcement types
    - Expert validation system
*/

-- Add new columns to community_posts for Goroti-specific features
ALTER TABLE community_posts
ADD COLUMN IF NOT EXISTS announcement_type text CHECK (announcement_type IN ('album', 'live', 'merch', 'collaboration')),
ADD COLUMN IF NOT EXISTS discovery_score integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS tru_score_boost integer DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_community_posts_discovery ON community_posts(discovery_score DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_universe_score ON community_posts(universe_id, discovery_score DESC);

-- Add announcement type to stories
ALTER TABLE community_stories
ADD COLUMN IF NOT EXISTS announcement_type text CHECK (announcement_type IN ('album', 'live', 'merch', 'collaboration')),
ADD COLUMN IF NOT EXISTS linked_content_id uuid;

-- User Feed Preferences
CREATE TABLE IF NOT EXISTS user_feed_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  feed_mode text DEFAULT 'intelligent' CHECK (feed_mode IN ('chronological', 'intelligent', 'universe_only')),
  show_discovery boolean DEFAULT true,
  discovery_limit_per_day integer DEFAULT 10,
  prioritize_followed boolean DEFAULT true,
  filter_universes uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_feed_preferences_user_id ON user_feed_preferences(user_id);

-- Expert Validations (for premium group creation)
CREATE TABLE IF NOT EXISTS expert_validations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  expertise_domain text NOT NULL,
  universe_id uuid REFERENCES universes(id) ON DELETE SET NULL,
  validation_status text DEFAULT 'pending' CHECK (validation_status IN ('pending', 'approved', 'rejected', 'suspended')),
  min_tru_score integer DEFAULT 70,
  identity_verified boolean DEFAULT false,
  positive_history_score integer DEFAULT 0,
  validated_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  validated_at timestamptz,
  suspension_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_expert_validations_user_id ON expert_validations(user_id);
CREATE INDEX IF NOT EXISTS idx_expert_validations_status ON expert_validations(validation_status);
CREATE INDEX IF NOT EXISTS idx_expert_validations_domain ON expert_validations(expertise_domain);

-- Update community_groups for expert-created premium groups
ALTER TABLE community_groups
ADD COLUMN IF NOT EXISTS created_by_expert boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS subscription_price_monthly numeric(10,2),
ADD COLUMN IF NOT EXISTS subscription_price_annual numeric(10,2),
ADD COLUMN IF NOT EXISTS subscription_price_lifetime numeric(10,2),
ADD COLUMN IF NOT EXISTS quality_score integer DEFAULT 0;

-- Group Subscriptions
CREATE TABLE IF NOT EXISTS group_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES community_groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subscription_type text CHECK (subscription_type IN ('monthly', 'annual', 'lifetime')),
  amount_paid numeric(10,2),
  payment_status text DEFAULT 'active' CHECK (payment_status IN ('active', 'expired', 'cancelled', 'refunded')),
  started_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  auto_renew boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(group_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_group_subscriptions_group_id ON group_subscriptions(group_id);
CREATE INDEX IF NOT EXISTS idx_group_subscriptions_user_id ON group_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_group_subscriptions_active ON group_subscriptions(user_id, payment_status) WHERE payment_status = 'active';

-- Story Announcements Tracking
CREATE TABLE IF NOT EXISTS story_announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid NOT NULL REFERENCES community_stories(id) ON DELETE CASCADE,
  announcement_type text NOT NULL CHECK (announcement_type IN ('album', 'live', 'merch', 'collaboration')),
  linked_album_id uuid,
  linked_live_id uuid,
  linked_product_id uuid,
  click_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_story_announcements_story_id ON story_announcements(story_id);

-- Enhanced messaging preferences
ALTER TABLE message_preferences
ADD COLUMN IF NOT EXISTS allow_priority_messages boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS priority_message_cost integer DEFAULT 10,
ADD COLUMN IF NOT EXISTS daily_message_limit integer DEFAULT 50;

-- Enable RLS on new tables
ALTER TABLE user_feed_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE expert_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_announcements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_feed_preferences
CREATE POLICY "users_feed_prefs_select_own" ON user_feed_preferences FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "users_feed_prefs_insert" ON user_feed_preferences FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_feed_prefs_update_own" ON user_feed_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for expert_validations
CREATE POLICY "expert_validations_select_own" ON expert_validations FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "expert_validations_insert" ON expert_validations FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- RLS Policies for group_subscriptions
CREATE POLICY "group_subs_select_own" ON group_subscriptions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "group_subs_insert" ON group_subscriptions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- RLS Policies for story_announcements
CREATE POLICY "story_announcements_select" ON story_announcements FOR SELECT
  TO public USING (true);

CREATE POLICY "story_announcements_insert" ON story_announcements FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM community_stories
      WHERE community_stories.id = story_announcements.story_id
      AND community_stories.user_id = auth.uid()
    )
  );

-- Function to create default feed preferences
CREATE OR REPLACE FUNCTION create_default_feed_preferences()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO user_feed_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_create_feed_preferences'
  ) THEN
    CREATE TRIGGER trigger_create_feed_preferences
      AFTER INSERT ON profiles
      FOR EACH ROW EXECUTE FUNCTION create_default_feed_preferences();
  END IF;
END$$;

-- Function to calculate discovery score
CREATE OR REPLACE FUNCTION calculate_post_discovery_score(post_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_score integer := 0;
  v_engagement_rate numeric;
  v_post_age_hours numeric;
BEGIN
  SELECT
    EXTRACT(EPOCH FROM (now() - created_at)) / 3600,
    (likes_count + comments_count * 2 + shares_count * 3)
  INTO v_post_age_hours, v_score
  FROM community_posts
  WHERE id = post_id;
  
  -- Decay score based on age
  IF v_post_age_hours < 24 THEN
    v_score := v_score * 2;
  ELSIF v_post_age_hours < 48 THEN
    v_score := v_score;
  ELSIF v_post_age_hours < 168 THEN
    v_score := v_score / 2;
  ELSE
    v_score := v_score / 4;
  END IF;
  
  RETURN v_score;
END;
$$;

-- Function to check if user can create premium group
CREATE OR REPLACE FUNCTION can_create_premium_group(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_verified boolean;
  v_has_expert_status boolean;
BEGIN
  -- Check if user is verified creator
  SELECT is_verified INTO v_is_verified
  FROM profiles
  WHERE id = p_user_id;
  
  -- Check if user has approved expert validation
  SELECT EXISTS (
    SELECT 1 FROM expert_validations
    WHERE user_id = p_user_id
    AND validation_status = 'approved'
  ) INTO v_has_expert_status;
  
  RETURN (v_is_verified OR v_has_expert_status);
END;
$$;