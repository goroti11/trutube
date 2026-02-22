/*
  # Smart Notification RPC Functions

  Intelligent notification creation with anti-spam, grouping, and preferences
*/

-- Create or update notification with smart logic
CREATE OR REPLACE FUNCTION create_smart_notification(
  p_user_id uuid,
  p_actor_id uuid,
  p_entity_type text,
  p_entity_id uuid,
  p_type text,
  p_title text,
  p_body text,
  p_data jsonb DEFAULT '{}'::jsonb,
  p_channel text DEFAULT 'in_app',
  p_priority integer DEFAULT 2
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rule notification_rules%ROWTYPE;
  v_prefs notification_preferences%ROWTYPE;
  v_last_notif notifications%ROWTYPE;
  v_group notification_groups%ROWTYPE;
  v_notification_id uuid;
  v_can_send boolean := true;
  v_should_group boolean := false;
  v_result jsonb;
BEGIN
  -- Get notification rule
  SELECT * INTO v_rule FROM notification_rules WHERE type = p_type;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unknown notification type');
  END IF;

  -- Check priority
  IF p_priority < v_rule.min_priority THEN
    RETURN jsonb_build_object('success', false, 'error', 'Priority too low');
  END IF;

  -- Get user preferences
  SELECT * INTO v_prefs FROM notification_preferences WHERE user_id = p_user_id;
  
  -- Check if category is enabled
  IF v_prefs IS NOT NULL THEN
    IF p_entity_type = 'live' AND NOT v_prefs.live_in_app THEN v_can_send := false; END IF;
    IF p_entity_type = 'gift' AND NOT v_prefs.gifts_in_app THEN v_can_send := false; END IF;
    IF p_entity_type = 'game' AND v_prefs.game_enabled IS NOT NULL AND NOT v_prefs.game_enabled THEN v_can_send := false; END IF;
    IF p_entity_type = 'wallet' AND NOT v_prefs.wallet_in_app THEN v_can_send := false; END IF;
    IF p_entity_type = 'video' AND v_prefs.video_enabled IS NOT NULL AND NOT v_prefs.video_enabled THEN v_can_send := false; END IF;
    IF p_entity_type = 'community' AND v_prefs.community_enabled IS NOT NULL AND NOT v_prefs.community_enabled THEN v_can_send := false; END IF;
    IF p_entity_type = 'marketplace' AND v_prefs.marketplace_enabled IS NOT NULL AND NOT v_prefs.marketplace_enabled THEN v_can_send := false; END IF;
    IF p_entity_type = 'studio' AND v_prefs.studio_enabled IS NOT NULL AND NOT v_prefs.studio_enabled THEN v_can_send := false; END IF;
    IF p_entity_type = 'premium' AND v_prefs.premium_enabled IS NOT NULL AND NOT v_prefs.premium_enabled THEN v_can_send := false; END IF;
    IF p_entity_type = 'moderation' AND NOT v_prefs.moderation_in_app THEN v_can_send := false; END IF;
    
    -- Check quiet hours
    IF v_prefs.quiet_hours_enabled AND v_prefs.quiet_hours_start IS NOT NULL AND v_prefs.quiet_hours_end IS NOT NULL THEN
      IF CURRENT_TIME BETWEEN v_prefs.quiet_hours_start AND v_prefs.quiet_hours_end THEN
        IF p_priority < 4 THEN
          v_can_send := false;
        END IF;
      END IF;
    END IF;
  END IF;

  IF NOT v_can_send THEN
    RETURN jsonb_build_object('success', false, 'error', 'Notification blocked by user preferences');
  END IF;

  -- Check cooldown
  IF v_rule.cooldown_seconds > 0 THEN
    SELECT * INTO v_last_notif 
    FROM notifications 
    WHERE user_id = p_user_id 
      AND type = p_type 
      AND entity_id = p_entity_id
      AND created_at > (now() - (v_rule.cooldown_seconds || ' seconds')::interval)
    ORDER BY created_at DESC 
    LIMIT 1;
    
    IF FOUND THEN
      RETURN jsonb_build_object('success', false, 'error', 'Cooldown active');
    END IF;
  END IF;

  -- Check if should group
  IF v_rule.groupable THEN
    SELECT * INTO v_group
    FROM notification_groups
    WHERE user_id = p_user_id
      AND type = p_type
      AND entity_id = p_entity_id
      AND is_active = true
      AND updated_at > (now() - (v_rule.group_window_seconds || ' seconds')::interval)
    LIMIT 1;
    
    IF FOUND AND v_group.count < v_rule.max_group_size THEN
      v_should_group := true;
    END IF;
  END IF;

  -- Create or group notification
  IF v_should_group THEN
    -- Update existing group
    UPDATE notification_groups
    SET count = count + 1,
        actor_ids = array_append(actor_ids, p_actor_id),
        latest_actor_id = p_actor_id,
        updated_at = now()
    WHERE id = v_group.id;
    
    -- Update grouped notification
    UPDATE notifications
    SET title = CASE
        WHEN v_group.count + 1 = 2 THEN p_title || ' et 1 autre'
        ELSE p_title || ' et ' || v_group.count || ' autres'
      END,
      body = p_body,
      is_seen = false,
      created_at = now()
    WHERE id = (
      SELECT id FROM notifications
      WHERE user_id = p_user_id
        AND type = p_type
        AND entity_id = p_entity_id
        AND grouped_with IS NULL
      ORDER BY created_at DESC
      LIMIT 1
    )
    RETURNING id INTO v_notification_id;
    
    v_result := jsonb_build_object(
      'success', true,
      'notification_id', v_notification_id,
      'grouped', true,
      'group_count', v_group.count + 1
    );
  ELSE
    -- Create new notification
    INSERT INTO notifications (
      user_id, actor_id, entity_type, entity_id, type,
      title, body, data, channel, priority
    ) VALUES (
      p_user_id, p_actor_id, p_entity_type, p_entity_id, p_type,
      p_title, p_body, p_data, p_channel, p_priority
    )
    RETURNING id INTO v_notification_id;
    
    -- Create new group if groupable
    IF v_rule.groupable THEN
      INSERT INTO notification_groups (
        user_id, type, entity_type, entity_id, count,
        actor_ids, latest_actor_id, sample_data
      ) VALUES (
        p_user_id, p_type, p_entity_type, p_entity_id, 1,
        ARRAY[p_actor_id], p_actor_id, p_data
      );
    END IF;
    
    v_result := jsonb_build_object(
      'success', true,
      'notification_id', v_notification_id,
      'grouped', false
    );
  END IF;

  RETURN v_result;
END;
$$;

-- Mark notifications as read
CREATE OR REPLACE FUNCTION mark_notifications_read(p_notification_ids uuid[])
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_updated_count integer;
BEGIN
  UPDATE notifications
  SET is_read = true, read_at = now()
  WHERE id = ANY(p_notification_ids)
    AND user_id = auth.uid()
    AND is_read = false;
  
  GET DIAGNOSTICS v_updated_count = ROW_COUNT;
  
  RETURN jsonb_build_object(
    'success', true,
    'updated_count', v_updated_count
  );
END;
$$;

-- Mark notifications as seen
CREATE OR REPLACE FUNCTION mark_notifications_seen(p_notification_ids uuid[])
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_updated_count integer;
BEGIN
  UPDATE notifications
  SET is_seen = true
  WHERE id = ANY(p_notification_ids)
    AND user_id = auth.uid()
    AND is_seen = false;
  
  GET DIAGNOSTICS v_updated_count = ROW_COUNT;
  
  RETURN jsonb_build_object(
    'success', true,
    'updated_count', v_updated_count
  );
END;
$$;

-- Get unread count
CREATE OR REPLACE FUNCTION get_unread_notification_count()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count integer;
BEGIN
  SELECT COUNT(*)::integer INTO v_count
  FROM notifications
  WHERE user_id = auth.uid()
    AND is_read = false;
  
  RETURN v_count;
END;
$$;

-- Get unseen count
CREATE OR REPLACE FUNCTION get_unseen_notification_count()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count integer;
BEGIN
  SELECT COUNT(*)::integer INTO v_count
  FROM notifications
  WHERE user_id = auth.uid()
    AND is_seen = false;
  
  RETURN v_count;
END;
$$;

-- Delete old notifications for a user
CREATE OR REPLACE FUNCTION delete_old_user_notifications()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deleted_count integer;
BEGIN
  DELETE FROM notifications
  WHERE user_id = auth.uid()
    AND is_read = true
    AND created_at < now() - interval '30 days';
  
  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  
  RETURN jsonb_build_object(
    'success', true,
    'deleted_count', v_deleted_count
  );
END;
$$;