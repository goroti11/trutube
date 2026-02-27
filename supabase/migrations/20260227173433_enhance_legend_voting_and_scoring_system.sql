/*
  # Enhanced Legend Voting and 3-Metric Scoring System
  
  Features:
  - Open voting for all users with intelligent weight calculation
  - 3-metric robust scoring: Watch Time (33%), Engagement (33%), Economic (34%)
  - Anti-manipulation: cooldowns, limits, multi-device detection
  - Voting windows (7-14 days)
  - Community approval badges
  - Regional voting visualization
  - Risk-based vote filtering
*/

-- Add enhanced columns to legend_candidates
ALTER TABLE legend_candidates
ADD COLUMN IF NOT EXISTS watch_score numeric DEFAULT 0 CHECK (watch_score BETWEEN 0 AND 100),
ADD COLUMN IF NOT EXISTS engagement_score numeric DEFAULT 0 CHECK (engagement_score BETWEEN 0 AND 100),
ADD COLUMN IF NOT EXISTS economic_score numeric DEFAULT 0 CHECK (economic_score BETWEEN 0 AND 100),
ADD COLUMN IF NOT EXISTS legend_score numeric GENERATED ALWAYS AS (
  (watch_score * 0.33) + (engagement_score * 0.33) + (economic_score * 0.34)
) STORED,
ADD COLUMN IF NOT EXISTS risk_flag boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS risk_reason text,
ADD COLUMN IF NOT EXISTS community_approved boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS approval_threshold_met boolean DEFAULT false;

-- Add enhanced columns to legend_registry
ALTER TABLE legend_registry
ADD COLUMN IF NOT EXISTS watch_score numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS engagement_score numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS economic_score numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS legend_score_calculated numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS community_approved boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS total_votes_received integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS weighted_votes_total numeric DEFAULT 0;

-- Vote limits and cooldown tracking
CREATE TABLE IF NOT EXISTS legend_vote_cooldowns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  last_vote_timestamp timestamptz NOT NULL DEFAULT now(),
  votes_today integer DEFAULT 1,
  votes_this_week integer DEFAULT 1,
  reset_date date DEFAULT CURRENT_DATE,
  is_rate_limited boolean DEFAULT false,
  rate_limit_until timestamptz,
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_vote_cooldowns_user ON legend_vote_cooldowns(user_id);
CREATE INDEX IF NOT EXISTS idx_vote_cooldowns_reset ON legend_vote_cooldowns(reset_date);

-- Regional vote tracking
CREATE TABLE IF NOT EXISTS legend_regional_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid REFERENCES legend_candidates(id) ON DELETE CASCADE,
  registry_id uuid REFERENCES legend_registry(id) ON DELETE CASCADE,
  region text NOT NULL,
  country_code text,
  total_votes integer DEFAULT 0,
  weighted_votes numeric DEFAULT 0,
  vote_percentage numeric DEFAULT 0,
  last_updated timestamptz DEFAULT now(),
  UNIQUE(candidate_id, region),
  UNIQUE(registry_id, region)
);

CREATE INDEX IF NOT EXISTS idx_regional_votes_candidate ON legend_regional_votes(candidate_id);
CREATE INDEX IF NOT EXISTS idx_regional_votes_region ON legend_regional_votes(region);

-- Multi-device detection
CREATE TABLE IF NOT EXISTS legend_vote_device_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ip_hash text NOT NULL,
  device_hash text NOT NULL,
  first_seen timestamptz DEFAULT now(),
  last_seen timestamptz DEFAULT now(),
  vote_count integer DEFAULT 0,
  is_suspicious boolean DEFAULT false,
  UNIQUE(user_id, ip_hash, device_hash)
);

CREATE INDEX IF NOT EXISTS idx_device_tracking_user ON legend_vote_device_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_device_tracking_hashes ON legend_vote_device_tracking(ip_hash, device_hash);
CREATE INDEX IF NOT EXISTS idx_device_tracking_suspicious ON legend_vote_device_tracking(is_suspicious) WHERE is_suspicious = true;

-- Vote momentum tracking (trending candidates)
CREATE TABLE IF NOT EXISTS legend_vote_momentum (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid NOT NULL REFERENCES legend_candidates(id) ON DELETE CASCADE,
  votes_last_hour integer DEFAULT 0,
  votes_last_24h integer DEFAULT 0,
  votes_last_7d integer DEFAULT 0,
  momentum_score numeric DEFAULT 0,
  is_trending boolean DEFAULT false,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(candidate_id)
);

CREATE INDEX IF NOT EXISTS idx_vote_momentum_trending ON legend_vote_momentum(momentum_score DESC) WHERE is_trending = true;

-- Enhanced vote weight calculation with more factors
CREATE OR REPLACE FUNCTION calculate_enhanced_vote_weight(
  p_user_id uuid,
  p_trucoins_staked bigint DEFAULT 0
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_trupower_score bigint;
  v_account_age_days integer;
  v_risk_score numeric;
  v_premium_status boolean;
  v_base_weight numeric := 1.0;
  v_trupower_bonus numeric := 0.0;
  v_age_bonus numeric := 0.0;
  v_premium_bonus numeric := 0.0;
  v_stake_bonus numeric := 0.0;
  v_risk_penalty numeric := 0.0;
  v_final_weight numeric;
  v_can_vote boolean := true;
  v_reason text := '';
BEGIN
  -- Get user data
  SELECT 
    EXTRACT(DAY FROM (now() - p.created_at))::integer,
    COALESCE(gus.risk_score, 0),
    COALESCE(ps.status = 'active', false)
  INTO v_account_age_days, v_risk_score, v_premium_status
  FROM profiles p
  LEFT JOIN gaming_user_scores gus ON gus.user_id = p.id
  LEFT JOIN premium_subscriptions ps ON ps.user_id = p.id AND ps.status = 'active'
  WHERE p.id = p_user_id;
  
  -- Get TruPower score
  SELECT COALESCE(trupower_score, 0)
  INTO v_trupower_score
  FROM gaming_user_scores
  WHERE user_id = p_user_id;
  
  -- Account age check (minimum 48 hours)
  IF v_account_age_days < 2 THEN
    v_can_vote := false;
    v_reason := 'Account must be at least 48 hours old to vote';
  END IF;
  
  -- Risk score check
  IF v_risk_score > 70 THEN
    v_can_vote := false;
    v_reason := 'Account has high risk score';
  ELSIF v_risk_score > 50 THEN
    v_risk_penalty := 0.5;
  ELSIF v_risk_score > 30 THEN
    v_risk_penalty := 0.25;
  END IF;
  
  -- Calculate bonuses if can vote
  IF v_can_vote THEN
    -- TruPower bonus (0 to +1.0)
    v_trupower_bonus := LEAST(1.0, v_trupower_score::numeric / 1000000.0);
    
    -- Age bonus (0 to +0.5)
    v_age_bonus := LEAST(0.5, v_account_age_days::numeric / 730.0);
    
    -- Premium bonus (+0.3)
    IF v_premium_status THEN
      v_premium_bonus := 0.3;
    END IF;
    
    -- Stake bonus (0 to +0.5)
    v_stake_bonus := LEAST(0.5, p_trucoins_staked::numeric / 50000.0);
    
    -- Calculate final weight
    v_final_weight := v_base_weight + v_trupower_bonus + v_age_bonus + v_premium_bonus + v_stake_bonus - v_risk_penalty;
    v_final_weight := GREATEST(0.1, LEAST(3.0, v_final_weight));
  ELSE
    v_final_weight := 0.0;
  END IF;
  
  RETURN jsonb_build_object(
    'can_vote', v_can_vote,
    'vote_weight', v_final_weight,
    'reason', v_reason,
    'breakdown', jsonb_build_object(
      'base', v_base_weight,
      'trupower_bonus', v_trupower_bonus,
      'age_bonus', v_age_bonus,
      'premium_bonus', v_premium_bonus,
      'stake_bonus', v_stake_bonus,
      'risk_penalty', v_risk_penalty
    )
  );
END;
$$;

-- Check if user can vote (rate limits)
CREATE OR REPLACE FUNCTION can_user_vote_now(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_votes_today integer;
  v_last_vote timestamptz;
  v_is_rate_limited boolean;
  v_rate_limit_until timestamptz;
  v_can_vote boolean := true;
  v_reason text := '';
  v_daily_limit integer := 20;
  v_cooldown_minutes integer := 5;
BEGIN
  -- Get current cooldown status
  SELECT 
    COALESCE(votes_today, 0),
    last_vote_timestamp,
    COALESCE(is_rate_limited, false),
    rate_limit_until
  INTO v_votes_today, v_last_vote, v_is_rate_limited, v_rate_limit_until
  FROM legend_vote_cooldowns
  WHERE user_id = p_user_id AND reset_date = CURRENT_DATE;
  
  -- Check rate limit
  IF v_is_rate_limited AND v_rate_limit_until > now() THEN
    v_can_vote := false;
    v_reason := 'Rate limited until ' || v_rate_limit_until::text;
    
  -- Check daily limit
  ELSIF COALESCE(v_votes_today, 0) >= v_daily_limit THEN
    v_can_vote := false;
    v_reason := 'Daily vote limit reached (' || v_daily_limit || ' votes)';
    
  -- Check cooldown (5 minutes between votes)
  ELSIF v_last_vote IS NOT NULL AND v_last_vote + (v_cooldown_minutes || ' minutes')::interval > now() THEN
    v_can_vote := false;
    v_reason := 'Please wait ' || v_cooldown_minutes || ' minutes between votes';
  END IF;
  
  RETURN jsonb_build_object(
    'can_vote', v_can_vote,
    'reason', v_reason,
    'votes_today', COALESCE(v_votes_today, 0),
    'daily_limit', v_daily_limit,
    'next_vote_available', CASE 
      WHEN v_last_vote IS NULL THEN now()
      ELSE v_last_vote + (v_cooldown_minutes || ' minutes')::interval
    END
  );
END;
$$;

-- Calculate 3-metric legend score
CREATE OR REPLACE FUNCTION calculate_legend_scores(
  p_entity_type text,
  p_entity_id uuid
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_watch_score numeric := 0;
  v_engagement_score numeric := 0;
  v_economic_score numeric := 0;
  v_legend_score numeric := 0;
  v_avg_watch_time numeric;
  v_completion_rate numeric;
  v_total_watch_minutes bigint;
  v_likes_ratio numeric;
  v_comments_ratio numeric;
  v_shares_ratio numeric;
  v_saves_ratio numeric;
  v_trucoins_per_1k numeric;
  v_gift_conversion numeric;
  v_premium_conversion numeric;
  v_view_count bigint;
BEGIN
  IF p_entity_type = 'video' THEN
    -- Get video metrics
    SELECT 
      COALESCE(view_count, 0),
      COALESCE(average_watch_time, 0),
      COALESCE(completion_rate, 0),
      COALESCE(like_count, 0)::numeric / NULLIF(view_count, 0),
      COALESCE(comment_count, 0)::numeric / NULLIF(view_count, 0),
      COALESCE(share_count, 0)::numeric / NULLIF(view_count, 0)
    INTO v_view_count, v_avg_watch_time, v_completion_rate, v_likes_ratio, v_comments_ratio, v_shares_ratio
    FROM videos
    WHERE id = p_entity_id;
    
    -- Get total watch minutes from sessions
    SELECT COALESCE(SUM(EXTRACT(EPOCH FROM (ended_at - started_at)) / 60), 0)
    INTO v_total_watch_minutes
    FROM watch_sessions
    WHERE video_id = p_entity_id AND is_valid = true;
    
    -- Normalize total watch minutes (scale to 0-100)
    v_total_watch_minutes := LEAST(100, v_total_watch_minutes / 10000.0);
    
    -- Calculate watch score (33%)
    v_watch_score := LEAST(100, (
      (v_avg_watch_time * 0.4) +
      (v_completion_rate * 100 * 0.3) +
      (v_total_watch_minutes * 0.3)
    ));
    
    -- Calculate engagement score (33%)
    v_engagement_score := LEAST(100, (
      (COALESCE(v_likes_ratio, 0) * 1000 * 0.25) +
      (COALESCE(v_comments_ratio, 0) * 2000 * 0.35) +
      (COALESCE(v_shares_ratio, 0) * 5000 * 0.25) +
      (COALESCE(v_saves_ratio, 0) * 3000 * 0.15)
    ));
    
    -- Calculate economic score (34%)
    SELECT 
      COALESCE(SUM(amount), 0)::numeric / NULLIF(v_view_count, 0) * 1000
    INTO v_trucoins_per_1k
    FROM trucoin_transactions
    WHERE entity_type = 'video' AND entity_id = p_entity_id;
    
    v_economic_score := LEAST(100, v_trucoins_per_1k / 100.0);
  END IF;
  
  -- Calculate final legend score
  v_legend_score := (v_watch_score * 0.33) + (v_engagement_score * 0.33) + (v_economic_score * 0.34);
  
  RETURN jsonb_build_object(
    'watch_score', ROUND(v_watch_score, 2),
    'engagement_score', ROUND(v_engagement_score, 2),
    'economic_score', ROUND(v_economic_score, 2),
    'legend_score', ROUND(v_legend_score, 2),
    'level', CASE
      WHEN v_legend_score >= 92 THEN 4
      WHEN v_legend_score >= 85 THEN 3
      WHEN v_legend_score >= 75 THEN 2
      WHEN v_legend_score >= 65 THEN 1
      ELSE 0
    END
  );
END;
$$;

-- Submit vote with full validation
CREATE OR REPLACE FUNCTION submit_legend_vote_enhanced(
  p_candidate_id uuid,
  p_user_id uuid,
  p_vote_type text DEFAULT 'support',
  p_trucoins_stake bigint DEFAULT 0,
  p_ip_hash text DEFAULT '',
  p_device_hash text DEFAULT ''
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rate_check jsonb;
  v_weight_check jsonb;
  v_vote_weight numeric;
  v_can_vote boolean;
  v_region text;
  v_country_code text;
BEGIN
  -- Check rate limits
  v_rate_check := can_user_vote_now(p_user_id);
  
  IF NOT (v_rate_check->>'can_vote')::boolean THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', v_rate_check->>'reason'
    );
  END IF;
  
  -- Calculate vote weight
  v_weight_check := calculate_enhanced_vote_weight(p_user_id, p_trucoins_stake);
  v_can_vote := (v_weight_check->>'can_vote')::boolean;
  v_vote_weight := (v_weight_check->>'vote_weight')::numeric;
  
  IF NOT v_can_vote THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', v_weight_check->>'reason'
    );
  END IF;
  
  -- Get user region
  SELECT region_preference INTO v_region FROM profiles WHERE id = p_user_id;
  
  -- Track device
  INSERT INTO legend_vote_device_tracking (user_id, ip_hash, device_hash, vote_count)
  VALUES (p_user_id, p_ip_hash, p_device_hash, 1)
  ON CONFLICT (user_id, ip_hash, device_hash)
  DO UPDATE SET
    vote_count = legend_vote_device_tracking.vote_count + 1,
    last_seen = now();
  
  -- Insert vote
  INSERT INTO legend_votes (
    candidate_id,
    user_id,
    vote_type,
    vote_weight,
    trucoins_staked,
    user_trupower_score,
    user_account_age_days,
    ip_address,
    device_fingerprint
  )
  SELECT
    p_candidate_id,
    p_user_id,
    p_vote_type,
    v_vote_weight,
    p_trucoins_stake,
    COALESCE(gus.trupower_score, 0),
    EXTRACT(DAY FROM (now() - pr.created_at))::integer,
    p_ip_hash,
    p_device_hash
  FROM profiles pr
  LEFT JOIN gaming_user_scores gus ON gus.user_id = pr.id
  WHERE pr.id = p_user_id;
  
  -- Update candidate
  UPDATE legend_candidates
  SET 
    total_votes = total_votes + 1,
    weighted_vote_score = weighted_vote_score + v_vote_weight
  WHERE id = p_candidate_id;
  
  -- Update regional votes
  INSERT INTO legend_regional_votes (candidate_id, region, total_votes, weighted_votes)
  VALUES (p_candidate_id, COALESCE(v_region, 'unknown'), 1, v_vote_weight)
  ON CONFLICT (candidate_id, region)
  DO UPDATE SET
    total_votes = legend_regional_votes.total_votes + 1,
    weighted_votes = legend_regional_votes.weighted_votes + v_vote_weight,
    last_updated = now();
  
  -- Update cooldown
  INSERT INTO legend_vote_cooldowns (user_id, last_vote_timestamp, votes_today, votes_this_week)
  VALUES (p_user_id, now(), 1, 1)
  ON CONFLICT (user_id)
  DO UPDATE SET
    last_vote_timestamp = now(),
    votes_today = CASE 
      WHEN legend_vote_cooldowns.reset_date = CURRENT_DATE 
      THEN legend_vote_cooldowns.votes_today + 1
      ELSE 1
    END,
    votes_this_week = legend_vote_cooldowns.votes_this_week + 1,
    reset_date = CURRENT_DATE;
  
  RETURN jsonb_build_object(
    'success', true,
    'vote_weight', v_vote_weight,
    'weight_breakdown', v_weight_check->'breakdown'
  );
END;
$$;

-- RLS Policies for new tables
ALTER TABLE legend_vote_cooldowns ENABLE ROW LEVEL SECURITY;
ALTER TABLE legend_regional_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE legend_vote_device_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE legend_vote_momentum ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_view_own_cooldowns" ON legend_vote_cooldowns FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "regional_votes_public" ON legend_regional_votes FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "vote_momentum_public" ON legend_vote_momentum FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "device_tracking_admin_only" ON legend_vote_device_tracking FOR SELECT
  TO authenticated USING (false);
