/*
  # Google Ads Integration System

  ## Overview
  This migration adds comprehensive support for Google Ads integration with:
  - Ad-free experience for premium users
  - Creator ad campaigns for content promotion
  - Ad impression tracking and analytics
  - Premium subscription management

  ## New Tables
  
  ### 1. premium_subscriptions
  Manages premium (ad-free) subscriptions for users
  - Links to user profiles
  - Tracks subscription status, start/end dates
  - Supports different premium tiers
  
  ### 2. ad_campaigns
  Creator-managed advertising campaigns for promoting content
  - Campaign details (name, budget, target audience)
  - Performance metrics (impressions, clicks, conversions)
  - Status tracking (active, paused, completed)
  
  ### 3. ad_impressions
  Tracks all ad impressions for analytics
  - Links impressions to campaigns
  - Records user interactions
  - Tracks conversion events

  ## Schema Changes
  - Add `is_premium` flag to profiles table
  - Add `last_premium_check` timestamp to profiles

  ## Security
  - Enable RLS on all new tables
  - Premium users: can view their own subscriptions
  - Creators: can manage their own campaigns
  - Ad impressions: restricted read access for analytics
*/

-- Add premium status to profiles
DO $$ 
BEGIN
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_premium boolean DEFAULT false;
  ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_premium_check timestamptz DEFAULT now();
EXCEPTION 
  WHEN duplicate_column THEN NULL;
END $$;

-- Premium subscriptions table
CREATE TABLE IF NOT EXISTS premium_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tier text DEFAULT 'basic' CHECK (tier IN ('basic', 'pro', 'elite')),
  price numeric NOT NULL DEFAULT 9.99,
  status text DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'paused')),
  started_at timestamptz DEFAULT now() NOT NULL,
  expires_at timestamptz NOT NULL,
  auto_renew boolean DEFAULT true,
  payment_method text DEFAULT 'card',
  last_payment_date timestamptz,
  next_billing_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ad campaigns table (for creators to promote their content)
CREATE TABLE IF NOT EXISTS ad_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  campaign_name text NOT NULL,
  campaign_type text DEFAULT 'video_promotion' CHECK (campaign_type IN ('video_promotion', 'channel_promotion', 'universe_promotion')),
  target_video_id uuid REFERENCES videos(id) ON DELETE CASCADE,
  budget_total numeric NOT NULL DEFAULT 100,
  budget_spent numeric DEFAULT 0,
  daily_budget numeric DEFAULT 10,
  cost_per_click numeric DEFAULT 0.50,
  cost_per_impression numeric DEFAULT 0.01,
  target_audience jsonb DEFAULT '{}',
  target_universes uuid[],
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
  total_impressions integer DEFAULT 0,
  total_clicks integer DEFAULT 0,
  total_conversions integer DEFAULT 0,
  click_through_rate numeric DEFAULT 0,
  conversion_rate numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ad impressions tracking table
CREATE TABLE IF NOT EXISTS ad_impressions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES ad_campaigns(id) ON DELETE CASCADE,
  ad_type text DEFAULT 'google_adsense' CHECK (ad_type IN ('google_adsense', 'creator_campaign', 'sponsored')),
  ad_unit_id text DEFAULT '',
  viewer_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  page_location text NOT NULL,
  impression_time timestamptz DEFAULT now() NOT NULL,
  clicked boolean DEFAULT false,
  click_time timestamptz,
  converted boolean DEFAULT false,
  conversion_time timestamptz,
  conversion_type text CHECK (conversion_type IN ('view', 'subscribe', 'tip', 'purchase')),
  revenue_generated numeric DEFAULT 0,
  viewer_country text DEFAULT '',
  viewer_device text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE premium_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_impressions ENABLE ROW LEVEL SECURITY;

-- Policies for premium_subscriptions
CREATE POLICY "Users can view own premium subscription"
  ON premium_subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own premium subscription"
  ON premium_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own premium subscription"
  ON premium_subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for ad_campaigns
CREATE POLICY "Creators can view own campaigns"
  ON ad_campaigns FOR SELECT
  TO authenticated
  USING (auth.uid() = creator_id);

CREATE POLICY "Creators can create campaigns"
  ON ad_campaigns FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update own campaigns"
  ON ad_campaigns FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can delete own campaigns"
  ON ad_campaigns FOR DELETE
  TO authenticated
  USING (auth.uid() = creator_id);

-- Policies for ad_impressions
CREATE POLICY "Campaign owners can view campaign impressions"
  ON ad_impressions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ad_campaigns
      WHERE ad_campaigns.id = ad_impressions.campaign_id
      AND ad_campaigns.creator_id = auth.uid()
    )
  );

CREATE POLICY "System can insert ad impressions"
  ON ad_impressions FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_premium_subscriptions_user ON premium_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_premium_subscriptions_status ON premium_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_premium_subscriptions_expires ON premium_subscriptions(expires_at);

CREATE INDEX IF NOT EXISTS idx_ad_campaigns_creator ON ad_campaigns(creator_id);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_status ON ad_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_dates ON ad_campaigns(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_ad_impressions_campaign ON ad_impressions(campaign_id);
CREATE INDEX IF NOT EXISTS idx_ad_impressions_viewer ON ad_impressions(viewer_id);
CREATE INDEX IF NOT EXISTS idx_ad_impressions_time ON ad_impressions(impression_time);

-- Function to check if user is premium (and update cache)
CREATE OR REPLACE FUNCTION check_user_premium(p_user_id uuid)
RETURNS boolean AS $$
DECLARE
  is_premium_user boolean;
  sub_status text;
  sub_expires timestamptz;
BEGIN
  -- Get subscription details
  SELECT status, expires_at
  INTO sub_status, sub_expires
  FROM premium_subscriptions
  WHERE user_id = p_user_id;

  -- Determine if user is premium
  is_premium_user := (
    sub_status = 'active' AND
    sub_expires > now()
  );

  -- Update profile cache
  UPDATE profiles
  SET 
    is_premium = is_premium_user,
    last_premium_check = now()
  WHERE id = p_user_id;

  RETURN is_premium_user;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record ad impression
CREATE OR REPLACE FUNCTION record_ad_impression(
  p_campaign_id uuid,
  p_ad_type text,
  p_ad_unit_id text,
  p_viewer_id uuid,
  p_page_location text
)
RETURNS uuid AS $$
DECLARE
  impression_id uuid;
BEGIN
  -- Insert impression
  INSERT INTO ad_impressions (
    campaign_id,
    ad_type,
    ad_unit_id,
    viewer_id,
    page_location
  )
  VALUES (
    p_campaign_id,
    p_ad_type,
    p_ad_unit_id,
    p_viewer_id,
    p_page_location
  )
  RETURNING id INTO impression_id;

  -- Update campaign stats if campaign_id provided
  IF p_campaign_id IS NOT NULL THEN
    UPDATE ad_campaigns
    SET 
      total_impressions = total_impressions + 1,
      updated_at = now()
    WHERE id = p_campaign_id;
  END IF;

  RETURN impression_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record ad click
CREATE OR REPLACE FUNCTION record_ad_click(
  p_impression_id uuid
)
RETURNS void AS $$
DECLARE
  campaign_id_val uuid;
BEGIN
  -- Update impression
  UPDATE ad_impressions
  SET 
    clicked = true,
    click_time = now()
  WHERE id = p_impression_id
  RETURNING campaign_id INTO campaign_id_val;

  -- Update campaign stats
  IF campaign_id_val IS NOT NULL THEN
    UPDATE ad_campaigns
    SET 
      total_clicks = total_clicks + 1,
      click_through_rate = (total_clicks + 1)::numeric / NULLIF(total_impressions, 0),
      budget_spent = budget_spent + cost_per_click,
      updated_at = now()
    WHERE id = campaign_id_val;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get active campaigns for targeting
CREATE OR REPLACE FUNCTION get_active_campaigns_for_universe(
  p_universe_id uuid,
  p_limit integer DEFAULT 5
)
RETURNS TABLE (
  campaign_id uuid,
  creator_id uuid,
  campaign_name text,
  target_video_id uuid,
  cost_per_impression numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ac.id,
    ac.creator_id,
    ac.campaign_name,
    ac.target_video_id,
    ac.cost_per_impression
  FROM ad_campaigns ac
  WHERE
    ac.status = 'active'
    AND ac.start_date <= now()
    AND (ac.end_date IS NULL OR ac.end_date > now())
    AND ac.budget_spent < ac.budget_total
    AND (
      p_universe_id = ANY(ac.target_universes)
      OR ac.target_universes IS NULL
      OR array_length(ac.target_universes, 1) IS NULL
    )
  ORDER BY ac.cost_per_impression DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;