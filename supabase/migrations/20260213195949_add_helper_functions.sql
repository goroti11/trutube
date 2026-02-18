/*
  # Add Helper Functions for Database Operations

  1. Functions Created
    - `increment_view_count` - Safely increment video view count
    - `increment_comment_count` - Safely increment video comment count
    - `update_creator_revenue` - Update creator revenue by type
    - `calculate_video_score` - Calculate video ranking score
    - `get_trending_videos` - Get videos sorted by engagement

  2. Purpose
    - These functions provide safe, atomic operations
    - Handle race conditions properly
    - Improve performance with database-side operations
*/

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(video_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE videos
  SET view_count = view_count + 1
  WHERE id = video_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment comment count
CREATE OR REPLACE FUNCTION increment_comment_count(video_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE videos
  SET comment_count = comment_count + 1
  WHERE id = video_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update creator revenue
CREATE OR REPLACE FUNCTION update_creator_revenue(
  p_creator_id uuid,
  p_amount numeric,
  p_type text
)
RETURNS void AS $$
DECLARE
  current_month date := date_trunc('month', now());
BEGIN
  INSERT INTO creator_revenue (
    creator_id,
    month,
    total_revenue,
    subscription_revenue,
    tips_revenue,
    premium_revenue,
    live_revenue
  )
  VALUES (
    p_creator_id,
    current_month,
    CASE WHEN p_type = 'total' THEN p_amount ELSE 0 END,
    CASE WHEN p_type = 'subscription' THEN p_amount ELSE 0 END,
    CASE WHEN p_type = 'tips' THEN p_amount ELSE 0 END,
    CASE WHEN p_type = 'premium' THEN p_amount ELSE 0 END,
    CASE WHEN p_type = 'live' THEN p_amount ELSE 0 END
  )
  ON CONFLICT (creator_id, month)
  DO UPDATE SET
    total_revenue = creator_revenue.total_revenue + p_amount,
    subscription_revenue = CASE 
      WHEN p_type = 'subscription' 
      THEN creator_revenue.subscription_revenue + p_amount 
      ELSE creator_revenue.subscription_revenue 
    END,
    tips_revenue = CASE 
      WHEN p_type = 'tips' 
      THEN creator_revenue.tips_revenue + p_amount 
      ELSE creator_revenue.tips_revenue 
    END,
    premium_revenue = CASE 
      WHEN p_type = 'premium' 
      THEN creator_revenue.premium_revenue + p_amount 
      ELSE creator_revenue.premium_revenue 
    END,
    live_revenue = CASE 
      WHEN p_type = 'live' 
      THEN creator_revenue.live_revenue + p_amount 
      ELSE creator_revenue.live_revenue 
    END,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate video engagement score
CREATE OR REPLACE FUNCTION calculate_video_score(video_id uuid)
RETURNS numeric AS $$
DECLARE
  engagement_score numeric;
  support_score numeric;
  freshness_score numeric;
  final_score numeric;
  v_view_count integer;
  v_like_count integer;
  v_comment_count integer;
  v_avg_watch_time numeric;
  v_duration integer;
  v_created_at timestamptz;
  hours_old numeric;
BEGIN
  SELECT 
    view_count, 
    like_count, 
    comment_count, 
    avg_watch_time, 
    duration, 
    created_at
  INTO 
    v_view_count, 
    v_like_count, 
    v_comment_count, 
    v_avg_watch_time, 
    v_duration, 
    v_created_at
  FROM videos
  WHERE id = video_id;

  -- Calculate hours since creation
  hours_old := EXTRACT(EPOCH FROM (now() - v_created_at)) / 3600;

  -- Engagement score (40% weight)
  engagement_score := (
    (v_view_count * 1.0) +
    (v_like_count * 5.0) +
    (v_comment_count * 10.0) +
    (v_avg_watch_time / NULLIF(v_duration, 0) * 20.0)
  ) * 0.4;

  -- Support score (30% weight) - based on likes and comments
  support_score := (
    (v_like_count * 1.0) +
    (v_comment_count * 2.0)
  ) * 0.3;

  -- Freshness score (30% weight) - decay over time
  freshness_score := GREATEST(0, (1.0 - (hours_old / 168.0))) * 0.3;

  -- Final score
  final_score := engagement_score + support_score + freshness_score;

  -- Update video_scores table
  INSERT INTO video_scores (
    video_id,
    engagement_score,
    support_score,
    freshness_score,
    final_score
  )
  VALUES (
    video_id,
    engagement_score,
    support_score,
    freshness_score,
    final_score
  )
  ON CONFLICT (video_id)
  DO UPDATE SET
    engagement_score = EXCLUDED.engagement_score,
    support_score = EXCLUDED.support_score,
    freshness_score = EXCLUDED.freshness_score,
    final_score = EXCLUDED.final_score,
    updated_at = now();

  RETURN final_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's feed based on preferences
CREATE OR REPLACE FUNCTION get_personalized_feed(
  p_user_id uuid,
  p_limit integer DEFAULT 20
)
RETURNS TABLE (
  id uuid,
  title text,
  thumbnail_url text,
  creator_id uuid,
  view_count integer,
  created_at timestamptz,
  final_score numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    v.id,
    v.title,
    v.thumbnail_url,
    v.creator_id,
    v.view_count,
    v.created_at,
    COALESCE(vs.final_score, 0) as final_score
  FROM videos v
  LEFT JOIN video_scores vs ON v.id = vs.video_id
  LEFT JOIN user_preferences up ON up.user_id = p_user_id
  WHERE 
    v.is_masked = false
    AND (
      up.universe_ids IS NULL 
      OR v.universe_id = ANY(up.universe_ids)
      OR up.universe_ids = '{}'
    )
  ORDER BY 
    COALESCE(vs.final_score, 0) DESC,
    v.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
