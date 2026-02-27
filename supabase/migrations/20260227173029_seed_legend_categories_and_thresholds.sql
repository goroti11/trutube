/*
  # Seed Legend Categories and Define Level Thresholds
*/

-- Insert Legend Categories
INSERT INTO legend_categories (category_key, name, description, icon_name, color_primary, color_secondary) VALUES
('video', 'Vidéo Légende', 'Contenus vidéo légendaires de Goroti', 'Video', '#3B82F6', '#60A5FA'),
('music', 'Musique Légende', 'Créations musicales iconiques', 'Music', '#EC4899', '#F472B6'),
('gaming', 'Gaming Légende', 'Performances gaming exceptionnelles', 'Gamepad2', '#8B5CF6', '#A78BFA'),
('live', 'Live Légende', 'Moments live inoubliables', 'Radio', '#EF4444', '#F87171'),
('culture', 'Culture Légende', 'Impact culturel et communautaire', 'Globe', '#10B981', '#34D399'),
('tournament', 'Tournoi Légende', 'Compétitions gaming historiques', 'Trophy', '#F59E0B', '#FBBF24')
ON CONFLICT (category_key) DO NOTHING;

-- Create function to calculate vote weight
CREATE OR REPLACE FUNCTION calculate_vote_weight(
  p_user_id uuid,
  p_trucoins_staked bigint
) RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_trupower_score bigint;
  v_account_age_days integer;
  v_base_weight numeric;
  v_trupower_multiplier numeric;
  v_age_multiplier numeric;
  v_stake_multiplier numeric;
  v_final_weight numeric;
BEGIN
  -- Get user's TruPower score
  SELECT COALESCE(trupower_score, 0)
  INTO v_trupower_score
  FROM gaming_user_scores
  WHERE user_id = p_user_id;
  
  -- Calculate account age
  SELECT EXTRACT(DAY FROM (now() - created_at))::integer
  INTO v_account_age_days
  FROM profiles
  WHERE id = p_user_id;
  
  -- Base weight
  v_base_weight := 1.0;
  
  -- TruPower multiplier (0.5x to 2.0x)
  v_trupower_multiplier := LEAST(2.0, 0.5 + (v_trupower_score::numeric / 1000000.0));
  
  -- Account age multiplier (0.5x to 1.5x)
  v_age_multiplier := LEAST(1.5, 0.5 + (v_account_age_days::numeric / 365.0));
  
  -- Stake multiplier (1.0x to 1.5x)
  v_stake_multiplier := LEAST(1.5, 1.0 + (p_trucoins_staked::numeric / 100000.0));
  
  -- Calculate final weight
  v_final_weight := v_base_weight * v_trupower_multiplier * v_age_multiplier * v_stake_multiplier;
  
  RETURN GREATEST(0.1, LEAST(10.0, v_final_weight));
END;
$$;

-- Create function to check daily vote limit
CREATE OR REPLACE FUNCTION check_vote_limit(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_daily_limit integer := 10;
  v_votes_used integer;
  v_is_suspended boolean;
BEGIN
  -- Check if user is suspended
  SELECT is_suspended INTO v_is_suspended
  FROM legend_vote_limits
  WHERE user_id = p_user_id
    AND vote_date = CURRENT_DATE
    AND is_suspended = true
    AND (suspension_until IS NULL OR suspension_until > now());
  
  IF v_is_suspended THEN
    RETURN false;
  END IF;
  
  -- Get current votes used
  SELECT COALESCE(daily_votes_used, 0) INTO v_votes_used
  FROM legend_vote_limits
  WHERE user_id = p_user_id AND vote_date = CURRENT_DATE;
  
  RETURN COALESCE(v_votes_used, 0) < v_daily_limit;
END;
$$;

-- Create function to submit legend vote
CREATE OR REPLACE FUNCTION submit_legend_vote(
  p_candidate_id uuid,
  p_user_id uuid,
  p_vote_type text,
  p_trucoins_stake bigint DEFAULT 0
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_vote_weight numeric;
  v_can_vote boolean;
  v_result jsonb;
BEGIN
  -- Check vote limit
  v_can_vote := check_vote_limit(p_user_id);
  
  IF NOT v_can_vote THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Daily vote limit reached or account suspended'
    );
  END IF;
  
  -- Calculate vote weight
  v_vote_weight := calculate_vote_weight(p_user_id, p_trucoins_stake);
  
  -- Insert vote
  INSERT INTO legend_votes (
    candidate_id,
    user_id,
    vote_type,
    vote_weight,
    trucoins_staked,
    user_trupower_score,
    user_account_age_days
  )
  SELECT
    p_candidate_id,
    p_user_id,
    p_vote_type,
    v_vote_weight,
    p_trucoins_stake,
    COALESCE(gus.trupower_score, 0),
    EXTRACT(DAY FROM (now() - p.created_at))::integer
  FROM profiles p
  LEFT JOIN gaming_user_scores gus ON gus.user_id = p.id
  WHERE p.id = p_user_id;
  
  -- Update candidate vote count
  UPDATE legend_candidates
  SET 
    total_votes = total_votes + 1,
    weighted_vote_score = weighted_vote_score + v_vote_weight
  WHERE id = p_candidate_id;
  
  -- Update vote limit
  INSERT INTO legend_vote_limits (user_id, vote_date, daily_votes_used, last_vote_at)
  VALUES (p_user_id, CURRENT_DATE, 1, now())
  ON CONFLICT (user_id, vote_date)
  DO UPDATE SET
    daily_votes_used = legend_vote_limits.daily_votes_used + 1,
    last_vote_at = now();
  
  RETURN jsonb_build_object(
    'success', true,
    'vote_weight', v_vote_weight
  );
END;
$$;

-- Create function to calculate performance score
CREATE OR REPLACE FUNCTION calculate_legend_performance_score(
  p_entity_type text,
  p_entity_id uuid
) RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_views bigint;
  v_engagement numeric;
  v_retention numeric;
  v_age_days integer;
  v_risk_score numeric;
  v_score numeric := 0;
BEGIN
  IF p_entity_type = 'video' THEN
    SELECT 
      COALESCE(view_count, 0),
      COALESCE(engagement_rate, 0),
      COALESCE(retention_rate, 0),
      EXTRACT(DAY FROM (now() - created_at))::integer,
      COALESCE(risk_score, 0)
    INTO v_views, v_engagement, v_retention, v_age_days, v_risk_score
    FROM videos
    WHERE id = p_entity_id;
    
    -- Calculate score components
    v_score := LEAST(100, (
      (LEAST(50, v_views::numeric / 20000)) +
      (v_engagement * 20) +
      (v_retention * 20) +
      (LEAST(10, v_age_days::numeric / 18))
    ));
    
    -- Penalty for risk
    v_score := v_score * (1 - (v_risk_score / 100));
  END IF;
  
  RETURN GREATEST(0, LEAST(100, v_score));
END;
$$;
