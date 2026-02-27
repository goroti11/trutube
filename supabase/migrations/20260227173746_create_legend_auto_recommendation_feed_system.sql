/*
  # Legend Auto-Recommendation Feed System
  
  Automatic Legend promotion in feed based on:
  - Score thresholds (65+ for Legend I, 75+ for Legend II, etc.)
  - Risk validation (risk_flag = false)
  - Vote thresholds met
  - Content quality verified
  - No active sanctions
  - Freshness boost for recent Legends
  
  Features:
  - Auto-promotion to feed when conditions met
  - Boosted visibility (3x-10x normal)
  - Regional prioritization
  - Freshness decay
  - Performance monitoring
*/

-- Legend feed promotion tracking
CREATE TABLE IF NOT EXISTS legend_feed_promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  legend_level integer NOT NULL CHECK (legend_level BETWEEN 1 AND 4),
  legend_score numeric NOT NULL,
  promotion_boost_factor numeric DEFAULT 3.0,
  promoted_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  region_priority text[],
  impressions_count bigint DEFAULT 0,
  clicks_count bigint DEFAULT 0,
  ctr numeric DEFAULT 0,
  is_active boolean DEFAULT true,
  auto_promoted boolean DEFAULT true,
  UNIQUE(entity_type, entity_id)
);

CREATE INDEX IF NOT EXISTS idx_legend_promotions_active ON legend_feed_promotions(is_active, promoted_at DESC) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_legend_promotions_level ON legend_feed_promotions(legend_level, legend_score DESC);
CREATE INDEX IF NOT EXISTS idx_legend_promotions_entity ON legend_feed_promotions(entity_type, entity_id);

-- Legend auto-promotion log
CREATE TABLE IF NOT EXISTS legend_auto_promotion_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  candidate_id uuid REFERENCES legend_candidates(id) ON DELETE SET NULL,
  promoted_at timestamptz DEFAULT now(),
  legend_level integer NOT NULL,
  legend_score numeric NOT NULL,
  reason text,
  conditions_met jsonb,
  boost_factor numeric DEFAULT 3.0
);

CREATE INDEX IF NOT EXISTS idx_auto_promotion_log_entity ON legend_auto_promotion_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_auto_promotion_log_time ON legend_auto_promotion_log(promoted_at DESC);

-- Check if content is eligible for Legend auto-promotion
CREATE OR REPLACE FUNCTION check_legend_promotion_eligibility(
  p_entity_type text,
  p_entity_id uuid
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_candidate legend_candidates%ROWTYPE;
  v_scores jsonb;
  v_legend_score numeric;
  v_legend_level integer;
  v_is_eligible boolean := false;
  v_reasons text[] := ARRAY[]::text[];
  v_boost_factor numeric := 1.0;
  v_has_sanctions boolean;
  v_creator_id uuid;
BEGIN
  -- Get candidate data
  SELECT * INTO v_candidate
  FROM legend_candidates
  WHERE entity_type = p_entity_type 
    AND entity_id = p_entity_id
    AND status IN ('active', 'approved');
  
  IF v_candidate.id IS NULL THEN
    RETURN jsonb_build_object(
      'eligible', false,
      'reason', 'No active Legend candidate found'
    );
  END IF;
  
  -- Calculate current scores
  v_scores := calculate_legend_scores(p_entity_type, p_entity_id);
  v_legend_score := (v_scores->>'legend_score')::numeric;
  v_legend_level := (v_scores->>'level')::integer;
  
  -- Get creator and check sanctions
  IF p_entity_type = 'video' THEN
    SELECT creator_id INTO v_creator_id FROM videos WHERE id = p_entity_id;
  ELSIF p_entity_type = 'channel' THEN
    SELECT owner_id INTO v_creator_id FROM channels WHERE id = p_entity_id;
  END IF;
  
  SELECT EXISTS(
    SELECT 1 FROM gaming_user_sanctions
    WHERE user_id = v_creator_id 
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > now())
  ) INTO v_has_sanctions;
  
  -- Check eligibility conditions
  
  -- 1. Minimum Legend I score (65+)
  IF v_legend_score < 65 THEN
    v_reasons := array_append(v_reasons, 'Score below Legend threshold (65+)');
  END IF;
  
  -- 2. No risk flag
  IF v_candidate.risk_flag THEN
    v_reasons := array_append(v_reasons, 'Content flagged as risky');
  END IF;
  
  -- 3. Minimum votes received (50+ for auto-promotion)
  IF v_candidate.total_votes < 50 THEN
    v_reasons := array_append(v_reasons, 'Minimum 50 votes required');
  END IF;
  
  -- 4. No active sanctions
  IF v_has_sanctions THEN
    v_reasons := array_append(v_reasons, 'Creator has active sanctions');
  END IF;
  
  -- 5. Not expired (within 30 days for videos)
  IF p_entity_type = 'video' THEN
    IF v_candidate.submitted_at < now() - interval '30 days' THEN
      v_reasons := array_append(v_reasons, 'Content older than 30 days');
    END IF;
  END IF;
  
  -- 6. Minimum watch score (prevents viral but low-quality content)
  IF (v_scores->>'watch_score')::numeric < 40 THEN
    v_reasons := array_append(v_reasons, 'Watch score too low');
  END IF;
  
  -- Determine eligibility
  v_is_eligible := (
    v_legend_score >= 65
    AND NOT v_candidate.risk_flag
    AND v_candidate.total_votes >= 50
    AND NOT v_has_sanctions
    AND (v_scores->>'watch_score')::numeric >= 40
    AND (p_entity_type != 'video' OR v_candidate.submitted_at >= now() - interval '30 days')
  );
  
  -- Calculate boost factor based on Legend level
  IF v_is_eligible THEN
    v_boost_factor := CASE v_legend_level
      WHEN 4 THEN 10.0  -- Legend IV: 10x boost
      WHEN 3 THEN 7.0   -- Legend III: 7x boost
      WHEN 2 THEN 5.0   -- Legend II: 5x boost
      WHEN 1 THEN 3.0   -- Legend I: 3x boost
      ELSE 1.0
    END;
    
    -- Freshness bonus (recent promotions get extra boost)
    IF v_candidate.submitted_at >= now() - interval '7 days' THEN
      v_boost_factor := v_boost_factor * 1.5;
    ELSIF v_candidate.submitted_at >= now() - interval '14 days' THEN
      v_boost_factor := v_boost_factor * 1.2;
    END IF;
  END IF;
  
  RETURN jsonb_build_object(
    'eligible', v_is_eligible,
    'legend_level', v_legend_level,
    'legend_score', v_legend_score,
    'boost_factor', v_boost_factor,
    'reasons', CASE WHEN v_is_eligible THEN ARRAY['All conditions met'] ELSE v_reasons END,
    'scores', v_scores,
    'conditions', jsonb_build_object(
      'score_threshold_met', v_legend_score >= 65,
      'no_risk_flag', NOT v_candidate.risk_flag,
      'minimum_votes_met', v_candidate.total_votes >= 50,
      'no_sanctions', NOT v_has_sanctions,
      'watch_score_ok', (v_scores->>'watch_score')::numeric >= 40,
      'not_expired', (p_entity_type != 'video' OR v_candidate.submitted_at >= now() - interval '30 days')
    )
  );
END;
$$;

-- Auto-promote eligible Legend content
CREATE OR REPLACE FUNCTION auto_promote_legend_content(
  p_entity_type text,
  p_entity_id uuid
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_eligibility jsonb;
  v_is_eligible boolean;
  v_legend_level integer;
  v_legend_score numeric;
  v_boost_factor numeric;
  v_expires_at timestamptz;
  v_region_priority text[];
BEGIN
  -- Check eligibility
  v_eligibility := check_legend_promotion_eligibility(p_entity_type, p_entity_id);
  v_is_eligible := (v_eligibility->>'eligible')::boolean;
  
  IF NOT v_is_eligible THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Content not eligible for auto-promotion',
      'reasons', v_eligibility->'reasons'
    );
  END IF;
  
  -- Extract data
  v_legend_level := (v_eligibility->>'legend_level')::integer;
  v_legend_score := (v_eligibility->>'legend_score')::numeric;
  v_boost_factor := (v_eligibility->>'boost_factor')::numeric;
  
  -- Calculate expiration (Legend promotions last 14 days)
  v_expires_at := now() + interval '14 days';
  
  -- Get regional priority from votes
  SELECT array_agg(region ORDER BY weighted_votes DESC)
  INTO v_region_priority
  FROM (
    SELECT region FROM legend_regional_votes
    WHERE entity_type = p_entity_type AND entity_id = p_entity_id
    ORDER BY weighted_votes DESC
    LIMIT 5
  ) sub;
  
  -- Insert or update promotion
  INSERT INTO legend_feed_promotions (
    entity_type,
    entity_id,
    legend_level,
    legend_score,
    promotion_boost_factor,
    promoted_at,
    expires_at,
    region_priority,
    is_active,
    auto_promoted
  )
  VALUES (
    p_entity_type,
    p_entity_id,
    v_legend_level,
    v_legend_score,
    v_boost_factor,
    now(),
    v_expires_at,
    v_region_priority,
    true,
    true
  )
  ON CONFLICT (entity_type, entity_id)
  DO UPDATE SET
    legend_level = EXCLUDED.legend_level,
    legend_score = EXCLUDED.legend_score,
    promotion_boost_factor = EXCLUDED.promotion_boost_factor,
    promoted_at = now(),
    expires_at = EXCLUDED.expires_at,
    region_priority = EXCLUDED.region_priority,
    is_active = true;
  
  -- Log promotion
  INSERT INTO legend_auto_promotion_log (
    entity_type,
    entity_id,
    candidate_id,
    legend_level,
    legend_score,
    reason,
    conditions_met,
    boost_factor
  )
  SELECT
    p_entity_type,
    p_entity_id,
    id,
    v_legend_level,
    v_legend_score,
    'Auto-promoted based on Legend criteria',
    v_eligibility->'conditions',
    v_boost_factor
  FROM legend_candidates
  WHERE entity_type = p_entity_type AND entity_id = p_entity_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'legend_level', v_legend_level,
    'legend_score', v_legend_score,
    'boost_factor', v_boost_factor,
    'expires_at', v_expires_at,
    'eligibility', v_eligibility
  );
END;
$$;

-- Get Legend-boosted feed recommendations
CREATE OR REPLACE FUNCTION get_legend_feed_recommendations(
  p_user_id uuid,
  p_region text DEFAULT NULL,
  p_limit integer DEFAULT 20,
  p_offset integer DEFAULT 0
) RETURNS TABLE (
  entity_type text,
  entity_id uuid,
  legend_level integer,
  legend_score numeric,
  boost_factor numeric,
  is_legend_promoted boolean,
  video_title text,
  video_thumbnail text,
  creator_name text,
  view_count bigint,
  like_count bigint,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH legend_content AS (
    SELECT 
      lfp.entity_type,
      lfp.entity_id,
      lfp.legend_level,
      lfp.legend_score,
      lfp.promotion_boost_factor,
      true as is_legend,
      -- Apply freshness decay
      lfp.promotion_boost_factor * (
        CASE 
          WHEN lfp.promoted_at >= now() - interval '3 days' THEN 1.0
          WHEN lfp.promoted_at >= now() - interval '7 days' THEN 0.8
          WHEN lfp.promoted_at >= now() - interval '14 days' THEN 0.6
          ELSE 0.4
        END
      ) * (
        -- Regional boost if user's region matches priority regions
        CASE 
          WHEN p_region IS NOT NULL AND p_region = ANY(lfp.region_priority) THEN 1.3
          ELSE 1.0
        END
      ) as final_boost
    FROM legend_feed_promotions lfp
    WHERE lfp.is_active = true
      AND (lfp.expires_at IS NULL OR lfp.expires_at > now())
      AND lfp.entity_type = 'video'
  ),
  ranked_videos AS (
    SELECT
      lc.entity_type,
      lc.entity_id,
      lc.legend_level,
      lc.legend_score,
      lc.promotion_boost_factor,
      lc.is_legend,
      v.title,
      v.thumbnail_url,
      p.display_name,
      v.view_count,
      v.like_count,
      v.created_at,
      -- Calculate final ranking score
      (
        (v.view_count::numeric / 1000.0) * 0.3 +
        (v.like_count::numeric / 100.0) * 0.2 +
        EXTRACT(EPOCH FROM (now() - v.created_at)) / 86400.0 * (-0.1) +
        (lc.final_boost * 100)
      ) as ranking_score
    FROM legend_content lc
    JOIN videos v ON v.id = lc.entity_id
    JOIN profiles p ON p.id = v.creator_id
    WHERE v.status = 'published'
      AND v.is_archived = false
  )
  SELECT
    rv.entity_type::text,
    rv.entity_id,
    rv.legend_level,
    rv.legend_score,
    rv.promotion_boost_factor,
    rv.is_legend,
    rv.title,
    rv.thumbnail_url,
    rv.display_name,
    rv.view_count,
    rv.like_count,
    rv.created_at
  FROM ranked_videos rv
  ORDER BY rv.ranking_score DESC, rv.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- Trigger to auto-check and promote when candidate reaches threshold
CREATE OR REPLACE FUNCTION trigger_legend_auto_promotion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
BEGIN
  -- Only check if status is active or approved
  IF NEW.status IN ('active', 'approved') AND NEW.total_votes >= 50 THEN
    -- Try to auto-promote
    v_result := auto_promote_legend_content(NEW.entity_type, NEW.entity_id);
    
    -- Update candidate with promotion status
    IF (v_result->>'success')::boolean THEN
      NEW.community_approved := true;
      NEW.approval_threshold_met := true;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on legend_candidates
DROP TRIGGER IF EXISTS auto_promote_legend_on_threshold ON legend_candidates;
CREATE TRIGGER auto_promote_legend_on_threshold
  BEFORE UPDATE ON legend_candidates
  FOR EACH ROW
  WHEN (
    NEW.total_votes >= 50 
    AND (OLD.total_votes < 50 OR NEW.weighted_vote_score > OLD.weighted_vote_score)
  )
  EXECUTE FUNCTION trigger_legend_auto_promotion();

-- Function to expire old promotions and refresh active ones
CREATE OR REPLACE FUNCTION refresh_legend_feed_promotions()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_expired_count integer := 0;
  v_refreshed_count integer := 0;
  v_newly_promoted_count integer := 0;
BEGIN
  -- Expire old promotions
  UPDATE legend_feed_promotions
  SET is_active = false
  WHERE is_active = true
    AND expires_at < now();
  
  GET DIAGNOSTICS v_expired_count = ROW_COUNT;
  
  -- Refresh existing active promotions (recalculate scores)
  UPDATE legend_feed_promotions lfp
  SET 
    legend_score = (scores_data->>'legend_score')::numeric,
    legend_level = (scores_data->>'level')::integer,
    is_active = CASE 
      WHEN (check_data->>'eligible')::boolean THEN true
      ELSE false
    END
  FROM (
    SELECT 
      lfp2.id,
      calculate_legend_scores(lfp2.entity_type, lfp2.entity_id) as scores_data,
      check_legend_promotion_eligibility(lfp2.entity_type, lfp2.entity_id) as check_data
    FROM legend_feed_promotions lfp2
    WHERE lfp2.is_active = true
  ) updates
  WHERE lfp.id = updates.id;
  
  GET DIAGNOSTICS v_refreshed_count = ROW_COUNT;
  
  -- Check for new candidates that should be auto-promoted
  WITH eligible_candidates AS (
    SELECT 
      lc.entity_type,
      lc.entity_id
    FROM legend_candidates lc
    WHERE lc.status IN ('active', 'approved')
      AND lc.total_votes >= 50
      AND NOT EXISTS (
        SELECT 1 FROM legend_feed_promotions lfp
        WHERE lfp.entity_type = lc.entity_type
          AND lfp.entity_id = lc.entity_id
          AND lfp.is_active = true
      )
  )
  SELECT COUNT(*) INTO v_newly_promoted_count
  FROM eligible_candidates ec
  WHERE (
    SELECT (check_legend_promotion_eligibility(ec.entity_type, ec.entity_id)->>'eligible')::boolean
  ) = true
  AND (
    SELECT auto_promote_legend_content(ec.entity_type, ec.entity_id)->>'success'
  )::boolean = true;
  
  RETURN jsonb_build_object(
    'success', true,
    'expired_count', v_expired_count,
    'refreshed_count', v_refreshed_count,
    'newly_promoted_count', v_newly_promoted_count,
    'timestamp', now()
  );
END;
$$;

-- RLS Policies
ALTER TABLE legend_feed_promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE legend_auto_promotion_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "feed_promotions_public" ON legend_feed_promotions FOR SELECT
  TO authenticated USING (is_active = true);

CREATE POLICY "promotion_log_admin_only" ON legend_auto_promotion_log FOR SELECT
  TO authenticated USING (false);

-- Track impressions and CTR
CREATE OR REPLACE FUNCTION track_legend_feed_impression(
  p_entity_type text,
  p_entity_id uuid,
  p_clicked boolean DEFAULT false
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE legend_feed_promotions
  SET 
    impressions_count = impressions_count + 1,
    clicks_count = CASE WHEN p_clicked THEN clicks_count + 1 ELSE clicks_count END,
    ctr = CASE 
      WHEN impressions_count + 1 > 0 
      THEN ((clicks_count + CASE WHEN p_clicked THEN 1 ELSE 0 END)::numeric / (impressions_count + 1)::numeric) * 100
      ELSE 0
    END
  WHERE entity_type = p_entity_type
    AND entity_id = p_entity_id
    AND is_active = true;
END;
$$;
