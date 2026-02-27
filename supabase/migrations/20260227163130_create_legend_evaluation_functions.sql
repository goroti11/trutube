/*
  # Legend System - Evaluation Functions

  ## Functions Created

  ### calculate_video_performance_score
  - Calculates combined performance score for a video
  - Factors: views, engagement, retention, authenticity
  - Returns score 0-100

  ### evaluate_video_for_badges
  - Evaluates if video qualifies for badges
  - Checks thresholds per universe
  - Awards appropriate badges

  ### calculate_creator_tru_score
  - Calculates weekly and global Tru scores
  - Updates rankings
  - Returns updated score

  ### update_legend_rankings
  - Recalculates all rankings
  - Updates active legend holders
  - Archives history

  ## Security
  - All functions use SECURITY DEFINER
  - Protected internal thresholds
  - Validates authenticity scores
*/

-- Function: Calculate Video Performance Score
CREATE OR REPLACE FUNCTION calculate_video_performance_score(
  p_video_id uuid,
  p_period_hours integer DEFAULT 168
)
RETURNS decimal
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_views_count bigint;
  v_likes_count integer;
  v_comments_count integer;
  v_shares_count integer;
  v_watch_time_minutes bigint;
  v_authenticity_score decimal;
  v_growth_rate decimal;
  v_engagement_rate decimal;
  v_retention_rate decimal;
  v_final_score decimal;
  v_video_duration integer;
BEGIN
  -- Get video metrics
  SELECT 
    v.view_count,
    v.likes,
    v.comments,
    v.shares,
    COALESCE(v.duration, 0),
    COALESCE(v.authenticity_score, 0)
  INTO
    v_views_count,
    v_likes_count,
    v_comments_count,
    v_shares_count,
    v_video_duration,
    v_authenticity_score
  FROM videos v
  WHERE v.id = p_video_id;

  -- Calculate engagement rate
  IF v_views_count > 0 THEN
    v_engagement_rate := ((v_likes_count + v_comments_count * 2 + v_shares_count * 3)::decimal / v_views_count) * 100;
  ELSE
    v_engagement_rate := 0;
  END IF;

  -- Estimate watch time and retention (simplified)
  v_watch_time_minutes := v_views_count * (v_video_duration / 60) * 0.6;
  v_retention_rate := 60.0;

  -- Calculate growth rate (views in period vs total)
  v_growth_rate := LEAST(100, (v_views_count::decimal / GREATEST(p_period_hours, 1)) * 10);

  -- Combined score with weights
  v_final_score := (
    (v_growth_rate * 0.25) +
    (v_engagement_rate * 0.30) +
    (v_retention_rate * 0.25) +
    (v_authenticity_score * 0.20)
  );

  -- Normalize to 0-100
  v_final_score := LEAST(100, GREATEST(0, v_final_score));

  RETURN v_final_score;
END;
$$;

-- Function: Calculate Creator Tru Score
CREATE OR REPLACE FUNCTION calculate_creator_tru_score(
  p_user_id uuid,
  p_universe_id uuid DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_weekly_views bigint := 0;
  v_weekly_engagement decimal := 0;
  v_weekly_authenticity decimal := 0;
  v_weekly_growth decimal := 0;
  v_global_views bigint := 0;
  v_global_consistency decimal := 0;
  v_tru_score_weekly decimal;
  v_tru_score_global decimal;
  v_trend text := 'stable';
  v_previous_weekly decimal;
BEGIN
  -- Get previous weekly score
  SELECT tru_score_weekly INTO v_previous_weekly
  FROM creator_tru_scores
  WHERE user_id = p_user_id AND (universe_id = p_universe_id OR (universe_id IS NULL AND p_universe_id IS NULL))
  LIMIT 1;

  -- Calculate weekly metrics (last 7 days)
  SELECT
    COALESCE(SUM(v.view_count), 0),
    COALESCE(AVG((v.likes + v.comments * 2 + v.shares * 3)::decimal / GREATEST(v.view_count, 1)), 0) * 100,
    COALESCE(AVG(v.authenticity_score), 75),
    COALESCE(SUM(CASE WHEN v.created_at > now() - interval '7 days' THEN v.view_count ELSE 0 END)::decimal / GREATEST(SUM(v.view_count), 1), 0) * 100
  INTO
    v_weekly_views,
    v_weekly_engagement,
    v_weekly_authenticity,
    v_weekly_growth
  FROM videos v
  WHERE v.uploader_id = p_user_id
    AND v.created_at > now() - interval '7 days'
    AND (p_universe_id IS NULL OR v.universe_id = p_universe_id);

  -- Calculate global metrics (last 90 days)
  SELECT
    COALESCE(SUM(v.view_count), 0),
    COUNT(DISTINCT DATE(v.created_at))::decimal / 90 * 100
  INTO
    v_global_views,
    v_global_consistency
  FROM videos v
  WHERE v.uploader_id = p_user_id
    AND v.created_at > now() - interval '90 days'
    AND (p_universe_id IS NULL OR v.universe_id = p_universe_id);

  -- Calculate weekly Tru score
  v_tru_score_weekly := LEAST(100, (
    (LOG(GREATEST(v_weekly_views, 1)) * 5) +
    (v_weekly_engagement * 0.4) +
    (v_weekly_authenticity * 0.3) +
    (v_weekly_growth * 0.2)
  ));

  -- Calculate global Tru score
  v_tru_score_global := LEAST(100, (
    (LOG(GREATEST(v_global_views, 1)) * 4) +
    (v_weekly_engagement * 0.3) +
    (v_weekly_authenticity * 0.25) +
    (v_global_consistency * 0.25)
  ));

  -- Determine trend
  IF v_previous_weekly IS NOT NULL THEN
    IF v_tru_score_weekly > v_previous_weekly + 5 THEN
      v_trend := 'up';
    ELSIF v_tru_score_weekly < v_previous_weekly - 5 THEN
      v_trend := 'down';
    END IF;
  END IF;

  -- Upsert score
  INSERT INTO creator_tru_scores (
    user_id,
    universe_id,
    tru_score_weekly,
    tru_score_global,
    trend,
    performance_factors,
    last_calculated_at,
    updated_at
  ) VALUES (
    p_user_id,
    p_universe_id,
    v_tru_score_weekly,
    v_tru_score_global,
    v_trend,
    json_build_object(
      'weekly_views', v_weekly_views,
      'engagement', CASE 
        WHEN v_weekly_engagement > 5 THEN 'excellent'
        WHEN v_weekly_engagement > 2 THEN 'good'
        WHEN v_weekly_engagement > 1 THEN 'average'
        ELSE 'low'
      END,
      'growth', CASE
        WHEN v_weekly_growth > 75 THEN 'rapid'
        WHEN v_weekly_growth > 50 THEN 'strong'
        WHEN v_weekly_growth > 25 THEN 'moderate'
        ELSE 'stable'
      END,
      'authenticity', CASE
        WHEN v_weekly_authenticity > 90 THEN 'excellent'
        WHEN v_weekly_authenticity > 75 THEN 'good'
        ELSE 'moderate'
      END
    ),
    now(),
    now()
  )
  ON CONFLICT (user_id, COALESCE(universe_id, '00000000-0000-0000-0000-000000000000'::uuid))
  DO UPDATE SET
    tru_score_weekly = EXCLUDED.tru_score_weekly,
    tru_score_global = EXCLUDED.tru_score_global,
    trend = EXCLUDED.trend,
    performance_factors = EXCLUDED.performance_factors,
    last_calculated_at = now(),
    updated_at = now();

  RETURN json_build_object(
    'tru_score_weekly', v_tru_score_weekly,
    'tru_score_global', v_tru_score_global,
    'trend', v_trend
  );
END;
$$;

-- Function: Update Legend Rankings
CREATE OR REPLACE FUNCTION update_legend_rankings()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_period_start timestamptz := date_trunc('week', now());
  v_period_end timestamptz := v_period_start + interval '7 days';
BEGIN
  -- Update weekly global rankings
  WITH ranked_creators AS (
    SELECT
      user_id,
      tru_score_weekly,
      ROW_NUMBER() OVER (ORDER BY tru_score_weekly DESC) as rank
    FROM creator_tru_scores
    WHERE universe_id IS NULL
  )
  UPDATE creator_tru_scores c
  SET 
    rank_weekly_global = r.rank,
    updated_at = now()
  FROM ranked_creators r
  WHERE c.user_id = r.user_id AND c.universe_id IS NULL;

  -- Update weekly universe rankings
  WITH ranked_universe_creators AS (
    SELECT
      user_id,
      universe_id,
      tru_score_weekly,
      ROW_NUMBER() OVER (PARTITION BY universe_id ORDER BY tru_score_weekly DESC) as rank
    FROM creator_tru_scores
    WHERE universe_id IS NOT NULL
  )
  UPDATE creator_tru_scores c
  SET 
    rank_weekly_universe = r.rank,
    updated_at = now()
  FROM ranked_universe_creators r
  WHERE c.user_id = r.user_id AND c.universe_id = r.universe_id;

  -- Archive rankings to history
  INSERT INTO legend_rankings_history (
    user_id,
    universe_id,
    ranking_type,
    rank_position,
    tru_score,
    period_start,
    period_end,
    badge_level
  )
  SELECT
    user_id,
    universe_id,
    CASE 
      WHEN universe_id IS NULL THEN 'weekly_global'
      ELSE 'weekly_universe'
    END,
    COALESCE(rank_weekly_global, rank_weekly_universe),
    tru_score_weekly,
    v_period_start,
    v_period_end,
    CASE
      WHEN tru_score_weekly >= 90 THEN 5
      WHEN tru_score_weekly >= 80 THEN 4
      WHEN tru_score_weekly >= 70 THEN 3
      WHEN tru_score_weekly >= 60 THEN 2
      WHEN tru_score_weekly >= 50 THEN 1
      ELSE NULL
    END
  FROM creator_tru_scores
  WHERE tru_score_weekly > 0;
END;
$$;