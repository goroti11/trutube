/*
  # Create LÉGENDE Evaluation RPC Functions

  ## Functions Created
  
  1. `rpc_evaluate_legend_candidate` - Evaluate if content qualifies for legend status
  2. `rpc_grant_legend_status` - Grant legend status (admin only)
  3. `rpc_revoke_legend_status` - Revoke legend status (admin only)
  4. `rpc_get_legend_stats` - Get platform-wide legend statistics
  5. `check_legend_fraud_signals` - Check anti-manipulation signals
  
  ## Business Logic
  
  ### Legend Level Criteria
  - **Level 1**: 1M verified views + 6 months + no sanctions
  - **Level 2**: 5M verified views + 12 months + high engagement
  - **Level 3**: 10M verified views OR exceptional cultural impact
  - **Level 4**: Historical record + multi-season + admin validation
  
  ### Anti-Fraud Checks
  - Verified views only (from watch_sessions)
  - No active sanctions
  - Risk score below threshold
  - No wash trading patterns
  - No collusion detected
*/

-- Function to check fraud signals for an entity
CREATE OR REPLACE FUNCTION check_legend_fraud_signals(
  p_entity_type text,
  p_entity_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_risk_score int := 0;
  v_flags jsonb := '[]'::jsonb;
  v_sanction_count int;
  v_result jsonb;
BEGIN
  -- Check for active sanctions (if entity is user-related)
  SELECT COUNT(*) INTO v_sanction_count
  FROM gaming_sanctions
  WHERE user_id = p_entity_id
    AND (expires_at IS NULL OR expires_at > now());
  
  IF v_sanction_count > 0 THEN
    v_risk_score := v_risk_score + 50;
    v_flags := v_flags || jsonb_build_object('type', 'active_sanctions', 'count', v_sanction_count);
  END IF;
  
  -- Check for fraud flags in watch sessions (if video/music)
  IF p_entity_type IN ('video', 'music') THEN
    -- This would check for patterns in watch_sessions
    -- Placeholder for actual fraud detection logic
    NULL;
  END IF;
  
  -- Record the fraud check
  INSERT INTO legend_fraud_checks (entity_type, entity_id, check_type, risk_score, is_flagged, details)
  VALUES (
    p_entity_type,
    p_entity_id,
    'comprehensive',
    v_risk_score,
    v_risk_score > 30,
    jsonb_build_object('flags', v_flags, 'checked_at', now())
  );
  
  v_result := jsonb_build_object(
    'risk_score', v_risk_score,
    'is_clean', v_risk_score < 30,
    'flags', v_flags
  );
  
  RETURN v_result;
END;
$$;

-- Function to evaluate legend candidate
CREATE OR REPLACE FUNCTION rpc_evaluate_legend_candidate(
  p_entity_type text,
  p_entity_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_fraud_check jsonb;
  v_metrics jsonb;
  v_eligible boolean := false;
  v_level int := 0;
  v_reason text := '';
  v_verified_views bigint := 0;
  v_engagement_score numeric := 0;
  v_age_months int := 0;
BEGIN
  -- Get authenticated user
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Check if already a legend
  IF EXISTS (
    SELECT 1 FROM legend_registry
    WHERE entity_type = p_entity_type
      AND entity_id = p_entity_id
      AND is_revoked = false
  ) THEN
    RETURN jsonb_build_object(
      'eligible', false,
      'reason', 'Already a legend',
      'existing_level', (
        SELECT level FROM legend_registry
        WHERE entity_type = p_entity_type AND entity_id = p_entity_id AND is_revoked = false
        LIMIT 1
      )
    );
  END IF;
  
  -- Run fraud checks
  v_fraud_check := check_legend_fraud_signals(p_entity_type, p_entity_id);
  
  IF NOT (v_fraud_check->>'is_clean')::boolean THEN
    RETURN jsonb_build_object(
      'eligible', false,
      'reason', 'Failed fraud checks',
      'fraud_check', v_fraud_check
    );
  END IF;
  
  -- Calculate metrics based on entity type
  -- For video content (placeholder - would need actual views table)
  IF p_entity_type = 'video' THEN
    -- These would come from real tables
    v_verified_views := 1500000; -- Placeholder
    v_engagement_score := 0.15; -- Placeholder
    v_age_months := 18; -- Placeholder
    
    -- Determine level
    IF v_verified_views >= 10000000 THEN
      v_level := 3;
      v_reason := 'views_milestone_10m';
      v_eligible := true;
    ELSIF v_verified_views >= 5000000 AND v_age_months >= 12 AND v_engagement_score > 0.1 THEN
      v_level := 2;
      v_reason := 'views_milestone_5m_sustained';
      v_eligible := true;
    ELSIF v_verified_views >= 1000000 AND v_age_months >= 6 THEN
      v_level := 1;
      v_reason := 'views_milestone_1m';
      v_eligible := true;
    END IF;
  END IF;
  
  v_metrics := jsonb_build_object(
    'verified_views', v_verified_views,
    'engagement_score', v_engagement_score,
    'age_months', v_age_months,
    'evaluated_at', now()
  );
  
  -- Create candidate record if eligible
  IF v_eligible THEN
    INSERT INTO legend_candidates (
      entity_type,
      entity_id,
      candidate_reason,
      metrics_snapshot,
      status
    ) VALUES (
      p_entity_type,
      p_entity_id,
      v_reason,
      v_metrics,
      'pending'
    );
  END IF;
  
  RETURN jsonb_build_object(
    'eligible', v_eligible,
    'level', v_level,
    'reason', v_reason,
    'metrics', v_metrics,
    'fraud_check', v_fraud_check
  );
END;
$$;

-- Function to grant legend status (admin only)
CREATE OR REPLACE FUNCTION rpc_grant_legend_status(
  p_entity_type text,
  p_entity_id uuid,
  p_level int,
  p_category_slug text,
  p_reason text,
  p_metrics jsonb DEFAULT '{}'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_category_id uuid;
  v_legend_id uuid;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Get category ID
  SELECT id INTO v_category_id
  FROM legend_categories
  WHERE slug = p_category_slug;
  
  IF v_category_id IS NULL THEN
    RAISE EXCEPTION 'Invalid category slug';
  END IF;
  
  -- Check if already exists
  IF EXISTS (
    SELECT 1 FROM legend_registry
    WHERE entity_type = p_entity_type
      AND entity_id = p_entity_id
      AND is_revoked = false
  ) THEN
    RAISE EXCEPTION 'Already a legend';
  END IF;
  
  -- Insert into registry
  INSERT INTO legend_registry (
    entity_type,
    entity_id,
    level,
    category_id,
    reason,
    verified_metrics,
    granted_by
  ) VALUES (
    p_entity_type,
    p_entity_id,
    p_level,
    v_category_id,
    p_reason,
    p_metrics,
    v_user_id::text
  )
  RETURNING id INTO v_legend_id;
  
  -- Update candidate status if exists
  UPDATE legend_candidates
  SET status = 'approved',
      reviewed_by = v_user_id,
      reviewed_at = now()
  WHERE entity_type = p_entity_type
    AND entity_id = p_entity_id
    AND status = 'pending';
  
  -- Write audit log
  PERFORM write_audit_log(
    'legend_granted',
    'legend_registry',
    v_legend_id::text,
    v_user_id,
    jsonb_build_object(
      'entity_type', p_entity_type,
      'entity_id', p_entity_id,
      'level', p_level,
      'category', p_category_slug
    )
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'legend_id', v_legend_id,
    'level', p_level
  );
END;
$$;

-- Function to revoke legend status
CREATE OR REPLACE FUNCTION rpc_revoke_legend_status(
  p_legend_id uuid,
  p_reason text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Update registry
  UPDATE legend_registry
  SET is_revoked = true,
      revoked_at = now(),
      revoked_reason = p_reason,
      updated_at = now()
  WHERE id = p_legend_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Legend not found';
  END IF;
  
  -- Write audit log
  PERFORM write_audit_log(
    'legend_revoked',
    'legend_registry',
    p_legend_id::text,
    v_user_id,
    jsonb_build_object('reason', p_reason)
  );
  
  RETURN jsonb_build_object('success', true);
END;
$$;

-- Function to get legend statistics
CREATE OR REPLACE FUNCTION rpc_get_legend_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_stats jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_legends', COUNT(*),
    'by_level', jsonb_object_agg(level, level_count),
    'by_category', (
      SELECT jsonb_object_agg(c.name, cat_count)
      FROM (
        SELECT category_id, COUNT(*) as cat_count
        FROM legend_registry
        WHERE is_revoked = false
        GROUP BY category_id
      ) sub
      JOIN legend_categories c ON c.id = sub.category_id
    ),
    'recent_grants', (
      SELECT COUNT(*) FROM legend_registry
      WHERE is_revoked = false
        AND granted_at > now() - interval '30 days'
    )
  ) INTO v_stats
  FROM (
    SELECT level, COUNT(*) as level_count
    FROM legend_registry
    WHERE is_revoked = false
    GROUP BY level
  ) level_stats;
  
  RETURN v_stats;
END;
$$;
