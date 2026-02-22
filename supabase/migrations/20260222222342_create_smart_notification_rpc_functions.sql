/*
  # Smart Notification RPC Functions
  
  1. Core Functions
    - Create notification with smart filtering
    - Mark as read/unread
    - Get unread count
    - Get notifications with pagination
    - Update preferences
    - Track user behavior
  
  2. Smart Filtering Logic
    - Check user preferences
    - Verify engagement score
    - Respect quiet hours
    - Apply priority throttling
*/

-- Create Smart Notification
CREATE OR REPLACE FUNCTION rpc_create_notification(
  p_user_id uuid,
  p_type text,
  p_data jsonb DEFAULT '{}'
)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_template record;
  v_preferences record;
  v_title text;
  v_body text;
  v_action_url text;
  v_notification_id uuid;
  v_should_send boolean;
  v_category text;
  v_current_time time;
  v_engagement_score integer;
BEGIN
  -- Get template
  SELECT * INTO v_template
  FROM notification_templates
  WHERE type = p_type::notification_type
  AND is_active = true;
  
  IF v_template IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'TEMPLATE_NOT_FOUND');
  END IF;
  
  v_category := v_template.category::text;
  
  -- Get user preferences
  SELECT * INTO v_preferences
  FROM notification_preferences
  WHERE user_id = p_user_id;
  
  IF v_preferences IS NULL THEN
    -- Create default preferences
    INSERT INTO notification_preferences (user_id)
    VALUES (p_user_id)
    RETURNING * INTO v_preferences;
  END IF;
  
  -- Check if user wants this notification category (in-app)
  v_should_send := CASE v_category
    WHEN 'live' THEN v_preferences.live_in_app
    WHEN 'gifts' THEN v_preferences.gifts_in_app
    WHEN 'games' THEN v_preferences.games_in_app
    WHEN 'wallet' THEN v_preferences.wallet_in_app
    WHEN 'moderation' THEN v_preferences.moderation_in_app
    WHEN 'marketing' THEN v_preferences.marketing_in_app
    ELSE true
  END;
  
  IF NOT v_should_send THEN
    RETURN jsonb_build_object('success', false, 'reason', 'USER_DISABLED');
  END IF;
  
  -- Check quiet hours
  IF v_preferences.quiet_hours_enabled THEN
    v_current_time := CURRENT_TIME;
    
    IF v_preferences.quiet_hours_start < v_preferences.quiet_hours_end THEN
      -- Normal range (e.g., 22:00 - 08:00 next day)
      IF v_current_time >= v_preferences.quiet_hours_start 
         OR v_current_time <= v_preferences.quiet_hours_end THEN
        -- Skip unless priority 5 (security)
        IF v_template.priority < 5 THEN
          RETURN jsonb_build_object('success', false, 'reason', 'QUIET_HOURS');
        END IF;
      END IF;
    ELSE
      -- Wraps midnight (e.g., 08:00 - 22:00)
      IF v_current_time >= v_preferences.quiet_hours_start 
         AND v_current_time <= v_preferences.quiet_hours_end THEN
        IF v_template.priority < 5 THEN
          RETURN jsonb_build_object('success', false, 'reason', 'QUIET_HOURS');
        END IF;
      END IF;
    END IF;
  END IF;
  
  -- Smart filtering for live notifications
  IF v_category = 'live' AND p_data ? 'creator_id' THEN
    -- Check engagement score
    SELECT engagement_score INTO v_engagement_score
    FROM user_notification_behavior
    WHERE user_id = p_user_id
    AND creator_id = (p_data->>'creator_id')::uuid;
    
    -- Only notify if engagement score > 20 (unless favorite or recent activity)
    IF COALESCE(v_engagement_score, 0) < 20 THEN
      RETURN jsonb_build_object('success', false, 'reason', 'LOW_ENGAGEMENT');
    END IF;
  END IF;
  
  -- Replace template variables
  v_title := v_template.title_template;
  v_body := v_template.body_template;
  v_action_url := v_template.action_url_template;
  
  -- Replace placeholders with actual data
  FOREACH v_title IN ARRAY string_to_array(v_title, '{') LOOP
    IF position('}' IN v_title) > 0 THEN
      DECLARE
        v_key text := split_part(v_title, '}', 1);
        v_value text := p_data->>v_key;
      BEGIN
        IF v_value IS NOT NULL THEN
          v_title := replace(v_template.title_template, '{' || v_key || '}', v_value);
          v_body := replace(v_body, '{' || v_key || '}', v_value);
          IF v_action_url IS NOT NULL THEN
            v_action_url := replace(v_action_url, '{' || v_key || '}', v_value);
          END IF;
        END IF;
      END;
    END IF;
  END LOOP;
  
  -- Create notification
  INSERT INTO notifications (
    user_id,
    type,
    category,
    priority,
    title,
    body,
    data,
    action_url,
    is_actionable,
    expires_at
  ) VALUES (
    p_user_id,
    p_type::notification_type,
    v_template.category,
    v_template.priority,
    v_title,
    v_body,
    p_data,
    v_action_url,
    v_action_url IS NOT NULL,
    CASE 
      WHEN v_category = 'live' THEN now() + interval '6 hours'
      WHEN v_category = 'games' THEN now() + interval '2 hours'
      ELSE now() + interval '30 days'
    END
  )
  RETURNING id INTO v_notification_id;
  
  -- Log in-app delivery
  INSERT INTO notification_delivery_log (
    notification_id,
    channel,
    status,
    delivered_at
  ) VALUES (
    v_notification_id,
    'in_app',
    'delivered',
    now()
  );
  
  -- Check if should send push
  IF (v_category = 'live' AND v_preferences.live_push)
     OR (v_category = 'gifts' AND v_preferences.gifts_push)
     OR (v_category = 'games' AND v_preferences.games_push)
     OR (v_category = 'wallet' AND v_preferences.wallet_push)
     OR (v_category = 'moderation' AND v_preferences.moderation_push)
     OR (v_category = 'marketing' AND v_preferences.marketing_push) THEN
    
    -- Log push delivery (actual sending handled by edge function)
    INSERT INTO notification_delivery_log (
      notification_id,
      channel,
      status
    ) VALUES (
      v_notification_id,
      'push',
      'pending'
    );
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'notification_id', v_notification_id
  );
END;
$$;

-- Mark notification as read
CREATE OR REPLACE FUNCTION rpc_mark_notification_read(
  p_notification_id uuid,
  p_is_read boolean DEFAULT true
)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE notifications
  SET is_read = p_is_read,
      read_at = CASE WHEN p_is_read THEN now() ELSE NULL END
  WHERE id = p_notification_id
  AND user_id = auth.uid();
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'NOT_FOUND');
  END IF;
  
  RETURN jsonb_build_object('success', true);
END;
$$;

-- Mark all notifications as read
CREATE OR REPLACE FUNCTION rpc_mark_all_notifications_read(
  p_category text DEFAULT NULL
)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_updated_count integer;
BEGIN
  IF p_category IS NULL THEN
    UPDATE notifications
    SET is_read = true,
        read_at = now()
    WHERE user_id = auth.uid()
    AND is_read = false;
  ELSE
    UPDATE notifications
    SET is_read = true,
        read_at = now()
    WHERE user_id = auth.uid()
    AND category = p_category::notification_category
    AND is_read = false;
  END IF;
  
  GET DIAGNOSTICS v_updated_count = ROW_COUNT;
  
  RETURN jsonb_build_object(
    'success', true,
    'updated_count', v_updated_count
  );
END;
$$;

-- Get unread count
CREATE OR REPLACE FUNCTION rpc_get_unread_notification_count()
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_total integer;
  v_by_category jsonb;
BEGIN
  SELECT COUNT(*) INTO v_total
  FROM notifications
  WHERE user_id = auth.uid()
  AND is_read = false
  AND (expires_at IS NULL OR expires_at > now());
  
  SELECT jsonb_object_agg(category, count)
  INTO v_by_category
  FROM (
    SELECT category, COUNT(*) as count
    FROM notifications
    WHERE user_id = auth.uid()
    AND is_read = false
    AND (expires_at IS NULL OR expires_at > now())
    GROUP BY category
  ) counts;
  
  RETURN jsonb_build_object(
    'total', v_total,
    'by_category', COALESCE(v_by_category, '{}'::jsonb)
  );
END;
$$;

-- Update notification preferences
CREATE OR REPLACE FUNCTION rpc_update_notification_preferences(
  p_preferences jsonb
)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO notification_preferences (user_id)
  VALUES (auth.uid())
  ON CONFLICT (user_id) DO UPDATE SET
    live_in_app = COALESCE((p_preferences->>'live_in_app')::boolean, notification_preferences.live_in_app),
    gifts_in_app = COALESCE((p_preferences->>'gifts_in_app')::boolean, notification_preferences.gifts_in_app),
    games_in_app = COALESCE((p_preferences->>'games_in_app')::boolean, notification_preferences.games_in_app),
    wallet_in_app = COALESCE((p_preferences->>'wallet_in_app')::boolean, notification_preferences.wallet_in_app),
    moderation_in_app = COALESCE((p_preferences->>'moderation_in_app')::boolean, notification_preferences.moderation_in_app),
    marketing_in_app = COALESCE((p_preferences->>'marketing_in_app')::boolean, notification_preferences.marketing_in_app),
    
    live_push = COALESCE((p_preferences->>'live_push')::boolean, notification_preferences.live_push),
    gifts_push = COALESCE((p_preferences->>'gifts_push')::boolean, notification_preferences.gifts_push),
    games_push = COALESCE((p_preferences->>'games_push')::boolean, notification_preferences.games_push),
    wallet_push = COALESCE((p_preferences->>'wallet_push')::boolean, notification_preferences.wallet_push),
    moderation_push = COALESCE((p_preferences->>'moderation_push')::boolean, notification_preferences.moderation_push),
    marketing_push = COALESCE((p_preferences->>'marketing_push')::boolean, notification_preferences.marketing_push),
    
    live_email = COALESCE((p_preferences->>'live_email')::boolean, notification_preferences.live_email),
    gifts_email = COALESCE((p_preferences->>'gifts_email')::boolean, notification_preferences.gifts_email),
    games_email = COALESCE((p_preferences->>'games_email')::boolean, notification_preferences.games_email),
    wallet_email = COALESCE((p_preferences->>'wallet_email')::boolean, notification_preferences.wallet_email),
    moderation_email = COALESCE((p_preferences->>'moderation_email')::boolean, notification_preferences.moderation_email),
    marketing_email = COALESCE((p_preferences->>'marketing_email')::boolean, notification_preferences.marketing_email),
    
    fcm_token = COALESCE(p_preferences->>'fcm_token', notification_preferences.fcm_token),
    apns_token = COALESCE(p_preferences->>'apns_token', notification_preferences.apns_token),
    
    quiet_hours_enabled = COALESCE((p_preferences->>'quiet_hours_enabled')::boolean, notification_preferences.quiet_hours_enabled),
    quiet_hours_start = COALESCE((p_preferences->>'quiet_hours_start')::time, notification_preferences.quiet_hours_start),
    quiet_hours_end = COALESCE((p_preferences->>'quiet_hours_end')::time, notification_preferences.quiet_hours_end),
    
    updated_at = now();
  
  RETURN jsonb_build_object('success', true);
END;
$$;

-- Track user behavior (watch, gift, game)
CREATE OR REPLACE FUNCTION rpc_track_user_behavior(
  p_creator_id uuid,
  p_action_type text, -- 'watch', 'gift', 'game', 'favorite'
  p_action_data jsonb DEFAULT '{}'
)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'NOT_AUTHENTICATED');
  END IF;
  
  -- Upsert behavior tracking
  INSERT INTO user_notification_behavior (
    user_id,
    creator_id,
    last_watched_at,
    last_gift_sent_at,
    total_gifts_sent,
    last_game_played_at,
    games_played_count,
    is_favorite
  ) VALUES (
    v_user_id,
    p_creator_id,
    CASE WHEN p_action_type = 'watch' THEN now() ELSE NULL END,
    CASE WHEN p_action_type = 'gift' THEN now() ELSE NULL END,
    CASE WHEN p_action_type = 'gift' THEN COALESCE((p_action_data->>'amount')::numeric, 0) ELSE 0 END,
    CASE WHEN p_action_type = 'game' THEN now() ELSE NULL END,
    CASE WHEN p_action_type = 'game' THEN 1 ELSE 0 END,
    CASE WHEN p_action_type = 'favorite' THEN COALESCE((p_action_data->>'is_favorite')::boolean, false) ELSE false END
  )
  ON CONFLICT (user_id, creator_id) DO UPDATE SET
    last_watched_at = CASE WHEN p_action_type = 'watch' THEN now() ELSE user_notification_behavior.last_watched_at END,
    last_gift_sent_at = CASE WHEN p_action_type = 'gift' THEN now() ELSE user_notification_behavior.last_gift_sent_at END,
    total_gifts_sent = CASE WHEN p_action_type = 'gift' 
      THEN user_notification_behavior.total_gifts_sent + COALESCE((p_action_data->>'amount')::numeric, 0)
      ELSE user_notification_behavior.total_gifts_sent END,
    last_game_played_at = CASE WHEN p_action_type = 'game' THEN now() ELSE user_notification_behavior.last_game_played_at END,
    games_played_count = CASE WHEN p_action_type = 'game' 
      THEN user_notification_behavior.games_played_count + 1
      ELSE user_notification_behavior.games_played_count END,
    is_favorite = CASE WHEN p_action_type = 'favorite' 
      THEN COALESCE((p_action_data->>'is_favorite')::boolean, user_notification_behavior.is_favorite)
      ELSE user_notification_behavior.is_favorite END,
    updated_at = now();
  
  -- Update engagement score
  PERFORM update_user_engagement_score(v_user_id, p_creator_id);
  
  RETURN jsonb_build_object('success', true);
END;
$$;

-- Delete old notifications
CREATE OR REPLACE FUNCTION rpc_delete_old_notifications(
  p_days_old integer DEFAULT 30
)
RETURNS jsonb
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_deleted_count integer;
BEGIN
  DELETE FROM notifications
  WHERE user_id = auth.uid()
  AND is_read = true
  AND created_at < now() - (p_days_old || ' days')::interval;
  
  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  
  RETURN jsonb_build_object(
    'success', true,
    'deleted_count', v_deleted_count
  );
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION rpc_create_notification TO authenticated;
GRANT EXECUTE ON FUNCTION rpc_mark_notification_read TO authenticated;
GRANT EXECUTE ON FUNCTION rpc_mark_all_notifications_read TO authenticated;
GRANT EXECUTE ON FUNCTION rpc_get_unread_notification_count TO authenticated;
GRANT EXECUTE ON FUNCTION rpc_update_notification_preferences TO authenticated;
GRANT EXECUTE ON FUNCTION rpc_track_user_behavior TO authenticated;
GRANT EXECUTE ON FUNCTION rpc_delete_old_notifications TO authenticated;
