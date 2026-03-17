/*
  # RPC Functions for Live & Gaming System
  
  ## Functions Created
  
  ### Live Stream Management
  - `create_live_stream` - Create a new live stream
  - `start_live_stream` - Start a scheduled stream
  - `end_live_stream` - End an active stream
  - `join_live_stream` - Join as viewer
  - `leave_live_stream` - Leave as viewer
  
  ### Gaming Live Management  
  - `create_gaming_live_stream` - Create gaming stream atomically
  - `start_gaming_live_stream` - Start gaming stream
  - `end_gaming_live_stream` - End gaming stream with stats
  - `get_active_gaming_sessions` - Get active gaming streams
  
  ### Statistics
  - `get_live_stream_stats` - Get stream statistics
  - `update_gaming_session_stats` - Update gaming stats
*/

-- =============================================================================
-- LIVE STREAM MANAGEMENT
-- =============================================================================

-- Create a new live stream
CREATE OR REPLACE FUNCTION create_live_stream(
  p_title text,
  p_description text DEFAULT NULL,
  p_stream_type text DEFAULT 'general',
  p_access_type text DEFAULT 'public',
  p_universe_id uuid DEFAULT NULL,
  p_sub_universe_id uuid DEFAULT NULL,
  p_scheduled_at timestamptz DEFAULT NULL
)
RETURNS jsonb AS $$
DECLARE
  v_stream_id uuid;
  v_stream_key text;
  v_rtmp_url text;
BEGIN
  -- Generate unique stream key
  v_stream_key := 'live_' || encode(gen_random_bytes(16), 'hex');
  v_rtmp_url := 'rtmp://live.goroti.com/live/' || v_stream_key;
  
  -- Create stream
  INSERT INTO live_streams (
    creator_id,
    title,
    description,
    stream_type,
    access_type,
    universe_id,
    sub_universe_id,
    stream_key,
    rtmp_url,
    stream_status,
    scheduled_at
  ) VALUES (
    auth.uid(),
    p_title,
    p_description,
    p_stream_type,
    p_access_type,
    p_universe_id,
    p_sub_universe_id,
    v_stream_key,
    v_rtmp_url,
    CASE WHEN p_scheduled_at IS NOT NULL THEN 'scheduled' ELSE 'live' END,
    p_scheduled_at
  )
  RETURNING id INTO v_stream_id;
  
  RETURN jsonb_build_object(
    'stream_id', v_stream_id,
    'stream_key', v_stream_key,
    'rtmp_url', v_rtmp_url
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

-- Start a live stream
CREATE OR REPLACE FUNCTION start_live_stream(
  p_stream_id uuid
)
RETURNS void AS $$
BEGIN
  UPDATE live_streams
  SET 
    stream_status = 'live',
    started_at = now(),
    updated_at = now()
  WHERE id = p_stream_id
    AND creator_id = auth.uid()
    AND stream_status = 'scheduled';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

-- End a live stream
CREATE OR REPLACE FUNCTION end_live_stream(
  p_stream_id uuid
)
RETURNS void AS $$
BEGIN
  UPDATE live_streams
  SET 
    stream_status = 'ended',
    ended_at = now(),
    updated_at = now()
  WHERE id = p_stream_id
    AND creator_id = auth.uid()
    AND stream_status = 'live';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

-- Join a live stream
CREATE OR REPLACE FUNCTION join_live_stream(
  p_stream_id uuid
)
RETURNS uuid AS $$
DECLARE
  v_viewer_id uuid;
BEGIN
  INSERT INTO live_viewers (stream_id, user_id)
  VALUES (p_stream_id, auth.uid())
  RETURNING id INTO v_viewer_id;
  
  -- Update viewer count
  UPDATE live_streams
  SET 
    viewer_count = viewer_count + 1,
    peak_viewers = GREATEST(peak_viewers, viewer_count + 1),
    updated_at = now()
  WHERE id = p_stream_id;
  
  RETURN v_viewer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

-- Leave a live stream
CREATE OR REPLACE FUNCTION leave_live_stream(
  p_viewer_id uuid
)
RETURNS void AS $$
DECLARE
  v_stream_id uuid;
  v_duration integer;
BEGIN
  -- Calculate watch duration and update viewer record
  UPDATE live_viewers
  SET 
    left_at = now(),
    watch_duration_seconds = EXTRACT(EPOCH FROM (now() - joined_at))::integer
  WHERE id = p_viewer_id
    AND user_id = auth.uid()
  RETURNING stream_id, watch_duration_seconds INTO v_stream_id, v_duration;
  
  -- Decrement viewer count
  IF v_stream_id IS NOT NULL THEN
    UPDATE live_streams
    SET 
      viewer_count = GREATEST(0, viewer_count - 1),
      updated_at = now()
    WHERE id = v_stream_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

-- Get live stream statistics
CREATE OR REPLACE FUNCTION get_live_stream_stats(
  p_stream_id uuid
)
RETURNS jsonb AS $$
DECLARE
  v_stats jsonb;
BEGIN
  SELECT jsonb_build_object(
    'viewer_count', ls.viewer_count,
    'peak_viewers', ls.peak_viewers,
    'total_viewers', (SELECT COUNT(*) FROM live_viewers WHERE stream_id = ls.id),
    'total_messages', (SELECT COUNT(*) FROM live_messages WHERE stream_id = ls.id AND NOT is_deleted),
    'total_gifts', ls.total_gifts_received,
    'total_trucoins', ls.total_trucoins_earned,
    'duration_seconds', EXTRACT(EPOCH FROM (COALESCE(ls.ended_at, now()) - ls.started_at))::integer
  )
  INTO v_stats
  FROM live_streams ls
  WHERE ls.id = p_stream_id;
  
  RETURN v_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

-- =============================================================================
-- GAMING LIVE MANAGEMENT
-- =============================================================================

-- Create gaming live stream atomically
CREATE OR REPLACE FUNCTION create_gaming_live_stream(
  p_game_id uuid,
  p_title text,
  p_description text DEFAULT NULL,
  p_mode text DEFAULT 'casual',
  p_is_ranked boolean DEFAULT false,
  p_anti_cheat_enabled boolean DEFAULT true,
  p_trucoin_bonus_enabled boolean DEFAULT false,
  p_tournament_id uuid DEFAULT NULL,
  p_universe_id uuid DEFAULT NULL,
  p_sub_universe_id uuid DEFAULT NULL
)
RETURNS jsonb AS $$
DECLARE
  v_live_stream_id uuid;
  v_gaming_session_id uuid;
  v_stream_key text;
  v_rtmp_url text;
BEGIN
  -- Generate unique stream key
  v_stream_key := 'live_' || encode(gen_random_bytes(16), 'hex');
  v_rtmp_url := 'rtmp://live.goroti.com/live/' || v_stream_key;
  
  -- Create base live stream
  INSERT INTO live_streams (
    creator_id,
    title,
    description,
    stream_key,
    rtmp_url,
    stream_status,
    stream_type,
    universe_id,
    sub_universe_id,
    access_type
  ) VALUES (
    auth.uid(),
    p_title,
    p_description,
    v_stream_key,
    v_rtmp_url,
    'scheduled',
    'gaming',
    p_universe_id,
    p_sub_universe_id,
    'public'
  )
  RETURNING id INTO v_live_stream_id;
  
  -- Create gaming session extension
  INSERT INTO gaming_live_sessions (
    live_stream_id,
    streamer_id,
    game_id,
    title,
    mode,
    tournament_id,
    is_ranked,
    anti_cheat_enabled,
    trucoin_bonus_enabled,
    status
  ) VALUES (
    v_live_stream_id,
    auth.uid(),
    p_game_id,
    p_title,
    p_mode,
    p_tournament_id,
    p_is_ranked,
    p_anti_cheat_enabled,
    p_trucoin_bonus_enabled,
    'active'
  )
  RETURNING id INTO v_gaming_session_id;
  
  -- Link back gaming session to live stream
  UPDATE live_streams
  SET gaming_session_id = v_gaming_session_id
  WHERE id = v_live_stream_id;
  
  RETURN jsonb_build_object(
    'live_stream_id', v_live_stream_id,
    'gaming_session_id', v_gaming_session_id,
    'stream_key', v_stream_key,
    'rtmp_url', v_rtmp_url
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

-- Start gaming live stream
CREATE OR REPLACE FUNCTION start_gaming_live_stream(
  p_live_stream_id uuid
)
RETURNS void AS $$
BEGIN
  -- Update live stream status
  UPDATE live_streams
  SET 
    stream_status = 'live',
    started_at = now(),
    updated_at = now()
  WHERE id = p_live_stream_id
    AND creator_id = auth.uid();
  
  -- Update gaming session status
  UPDATE gaming_live_sessions
  SET started_at = now()
  WHERE live_stream_id = p_live_stream_id
    AND streamer_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

-- End gaming live stream
CREATE OR REPLACE FUNCTION end_gaming_live_stream(
  p_live_stream_id uuid
)
RETURNS void AS $$
DECLARE
  v_gaming_session_id uuid;
  v_duration_minutes integer;
BEGIN
  -- Get gaming session and calculate duration
  SELECT 
    gaming_session_id,
    EXTRACT(EPOCH FROM (now() - started_at))::integer / 60
  INTO v_gaming_session_id, v_duration_minutes
  FROM live_streams
  WHERE id = p_live_stream_id
    AND creator_id = auth.uid();
  
  -- Update live stream status
  UPDATE live_streams
  SET 
    stream_status = 'ended',
    ended_at = now(),
    updated_at = now()
  WHERE id = p_live_stream_id
    AND creator_id = auth.uid();
  
  -- Update gaming session status
  UPDATE gaming_live_sessions
  SET 
    ended_at = now(),
    status = 'ended'
  WHERE id = v_gaming_session_id
    AND streamer_id = auth.uid();
  
  -- Insert final stats
  IF v_gaming_session_id IS NOT NULL THEN
    INSERT INTO gaming_stream_stats (
      session_id,
      viewer_count,
      peak_viewers,
      trucoins_earned,
      gifts_received,
      duration_minutes
    )
    SELECT
      v_gaming_session_id,
      ls.viewer_count,
      ls.peak_viewers,
      ls.total_trucoins_earned,
      ls.total_gifts_received,
      v_duration_minutes
    FROM live_streams ls
    WHERE ls.id = p_live_stream_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

-- Get active gaming sessions
CREATE OR REPLACE FUNCTION get_active_gaming_sessions(
  p_game_id uuid DEFAULT NULL,
  p_limit integer DEFAULT 50
)
RETURNS TABLE (
  session_id uuid,
  live_stream_id uuid,
  streamer_id uuid,
  streamer_username text,
  streamer_display_name text,
  game_id uuid,
  game_name text,
  title text,
  mode text,
  is_ranked boolean,
  viewer_count integer,
  peak_viewers integer,
  started_at timestamptz,
  thumbnail_url text
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    gls.id,
    gls.live_stream_id,
    gls.streamer_id,
    p.username,
    p.display_name,
    gls.game_id,
    g.name,
    gls.title,
    gls.mode,
    gls.is_ranked,
    ls.viewer_count,
    ls.peak_viewers,
    ls.started_at,
    ls.thumbnail_url
  FROM gaming_live_sessions gls
  INNER JOIN live_streams ls ON ls.id = gls.live_stream_id
  INNER JOIN profiles p ON p.id = gls.streamer_id
  INNER JOIN games g ON g.id = gls.game_id
  WHERE gls.status = 'active'
    AND ls.stream_status = 'live'
    AND (p_game_id IS NULL OR gls.game_id = p_game_id)
  ORDER BY ls.viewer_count DESC, ls.started_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

-- Update gaming session stats
CREATE OR REPLACE FUNCTION update_gaming_session_stats(
  p_session_id uuid
)
RETURNS void AS $$
BEGIN
  INSERT INTO gaming_stream_stats (
    session_id,
    viewer_count,
    peak_viewers,
    trucoins_earned,
    gifts_received,
    duration_minutes
  )
  SELECT
    p_session_id,
    ls.viewer_count,
    ls.peak_viewers,
    ls.total_trucoins_earned,
    ls.total_gifts_received,
    EXTRACT(EPOCH FROM (now() - ls.started_at))::integer / 60
  FROM gaming_live_sessions gls
  INNER JOIN live_streams ls ON ls.id = gls.live_stream_id
  WHERE gls.id = p_session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;