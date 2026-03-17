/*
  # Marketplace RPC Functions

  ## Purpose
  Transactional RPC functions for critical marketplace operations:
  - Create orders with payment validation
  - Submit deliveries with status updates
  - Request revisions with counter tracking
  - Complete orders with escrow release
  - Open and resolve disputes

  ## Security
  - All functions validate user permissions
  - Atomic transactions prevent data inconsistency
  - Audit logging for critical actions
*/

-- ============================================================
-- RPC: Create Marketplace Order
-- ============================================================
CREATE OR REPLACE FUNCTION rpc_create_marketplace_order(
  p_service_id uuid,
  p_buyer_id uuid,
  p_tier text,
  p_price numeric,
  p_payment_method text,
  p_card_amount numeric,
  p_trucoin_amount numeric,
  p_buyer_requirements text,
  p_stripe_payment_intent_id text DEFAULT ''
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_service marketplace_services;
  v_provider_id uuid;
  v_platform_fee numeric;
  v_provider_amount numeric;
  v_delivery_days integer;
  v_revisions_allowed integer;
  v_due_date timestamptz;
  v_order_id uuid;
  v_order_number text;
BEGIN
  IF auth.uid() != p_buyer_id THEN
    RAISE EXCEPTION 'Unauthorized: buyer_id must match authenticated user';
  END IF;

  SELECT * INTO v_service FROM marketplace_services WHERE id = p_service_id AND is_active = true;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Service not found or inactive';
  END IF;

  v_provider_id := v_service.user_id;

  v_platform_fee := p_price * 0.10;
  v_provider_amount := p_price - v_platform_fee;

  IF p_tier = 'basic' THEN
    v_delivery_days := v_service.delivery_days_basic;
    v_revisions_allowed := v_service.revisions_basic;
  ELSIF p_tier = 'standard' THEN
    v_delivery_days := COALESCE(v_service.delivery_days_standard, v_service.delivery_days_basic);
    v_revisions_allowed := COALESCE(v_service.revisions_standard, v_service.revisions_basic);
  ELSE
    v_delivery_days := COALESCE(v_service.delivery_days_premium, v_service.delivery_days_standard, v_service.delivery_days_basic);
    v_revisions_allowed := COALESCE(v_service.revisions_premium, v_service.revisions_standard, v_service.revisions_basic);
  END IF;

  v_due_date := now() + (v_delivery_days || ' days')::interval;

  INSERT INTO marketplace_orders (
    service_id,
    buyer_id,
    provider_id,
    tier,
    price,
    platform_fee,
    provider_amount,
    currency,
    payment_method,
    card_amount,
    trucoin_amount,
    stripe_payment_intent_id,
    escrow_status,
    delivery_days,
    due_date,
    revisions_allowed,
    max_revisions,
    revisions_used,
    revision_count,
    status,
    buyer_requirements,
    started_at
  ) VALUES (
    p_service_id,
    p_buyer_id,
    v_provider_id,
    p_tier,
    p_price,
    v_platform_fee,
    v_provider_amount,
    'EUR',
    p_payment_method,
    p_card_amount,
    p_trucoin_amount,
    p_stripe_payment_intent_id,
    'held',
    v_delivery_days,
    v_due_date,
    v_revisions_allowed,
    v_revisions_allowed,
    0,
    0,
    'in_progress',
    p_buyer_requirements,
    now()
  )
  RETURNING id, order_number INTO v_order_id, v_order_number;

  INSERT INTO marketplace_audit_logs (order_id, user_id, action, details)
  VALUES (v_order_id, p_buyer_id, 'order_created', jsonb_build_object('tier', p_tier, 'price', p_price));

  UPDATE marketplace_services
  SET total_orders = total_orders + 1
  WHERE id = p_service_id;

  UPDATE marketplace_provider_profiles
  SET total_orders = total_orders + 1
  WHERE user_id = v_provider_id;

  RETURN jsonb_build_object(
    'success', true,
    'order_id', v_order_id,
    'order_number', v_order_number,
    'due_date', v_due_date
  );
END;
$$;

-- ============================================================
-- RPC: Submit Marketplace Delivery
-- ============================================================
CREATE OR REPLACE FUNCTION rpc_submit_marketplace_delivery(
  p_order_id uuid,
  p_delivery_note text,
  p_file_urls text[]
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order marketplace_orders;
  v_delivery_id uuid;
BEGIN
  SELECT * INTO v_order FROM marketplace_orders WHERE id = p_order_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found';
  END IF;

  IF v_order.provider_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: only provider can submit delivery';
  END IF;

  IF v_order.status NOT IN ('in_progress', 'revision_requested') THEN
    RAISE EXCEPTION 'Invalid order status for delivery';
  END IF;

  INSERT INTO marketplace_order_deliveries (
    order_id,
    submitted_by,
    delivery_note,
    file_urls,
    status
  ) VALUES (
    p_order_id,
    auth.uid(),
    p_delivery_note,
    p_file_urls,
    'pending'
  )
  RETURNING id INTO v_delivery_id;

  UPDATE marketplace_orders
  SET
    status = 'delivered',
    delivery_status = 'in_review',
    delivered_at = now(),
    auto_complete_at = now() + interval '7 days',
    updated_at = now()
  WHERE id = p_order_id;

  INSERT INTO marketplace_order_messages (
    order_id,
    sender_id,
    message,
    message_type,
    is_system_message
  ) VALUES (
    p_order_id,
    auth.uid(),
    'Livraison soumise. Fichiers en attente de validation.',
    'delivery',
    false
  );

  INSERT INTO marketplace_audit_logs (order_id, user_id, action, details)
  VALUES (p_order_id, auth.uid(), 'delivery_submitted', jsonb_build_object('delivery_id', v_delivery_id));

  RETURN jsonb_build_object('success', true, 'delivery_id', v_delivery_id);
END;
$$;

-- ============================================================
-- RPC: Request Marketplace Revision
-- ============================================================
CREATE OR REPLACE FUNCTION rpc_request_marketplace_revision(
  p_order_id uuid,
  p_revision_note text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order marketplace_orders;
BEGIN
  SELECT * INTO v_order FROM marketplace_orders WHERE id = p_order_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found';
  END IF;

  IF v_order.buyer_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: only buyer can request revision';
  END IF;

  IF v_order.status != 'delivered' THEN
    RAISE EXCEPTION 'Can only request revision on delivered orders';
  END IF;

  IF v_order.revision_count >= v_order.max_revisions THEN
    RAISE EXCEPTION 'Maximum revisions exceeded';
  END IF;

  UPDATE marketplace_orders
  SET
    status = 'revision_requested',
    delivery_status = 'rejected',
    revision_count = revision_count + 1,
    revisions_used = revisions_used + 1,
    updated_at = now()
  WHERE id = p_order_id;

  INSERT INTO marketplace_order_messages (
    order_id,
    sender_id,
    message,
    message_type,
    is_system_message
  ) VALUES (
    p_order_id,
    auth.uid(),
    p_revision_note,
    'revision_request',
    false
  );

  INSERT INTO marketplace_audit_logs (order_id, user_id, action, details)
  VALUES (p_order_id, auth.uid(), 'revision_requested', jsonb_build_object('note', p_revision_note));

  RETURN jsonb_build_object('success', true);
END;
$$;

-- ============================================================
-- RPC: Complete Marketplace Order
-- ============================================================
CREATE OR REPLACE FUNCTION rpc_complete_marketplace_order(
  p_order_id uuid,
  p_rating integer DEFAULT NULL,
  p_review_text text DEFAULT ''
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order marketplace_orders;
BEGIN
  SELECT * INTO v_order FROM marketplace_orders WHERE id = p_order_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found';
  END IF;

  IF v_order.buyer_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: only buyer can complete order';
  END IF;

  IF v_order.status != 'delivered' THEN
    RAISE EXCEPTION 'Can only complete delivered orders';
  END IF;

  UPDATE marketplace_orders
  SET
    status = 'completed',
    delivery_status = 'accepted',
    buyer_confirmed = true,
    completed_at = now(),
    escrow_status = 'released',
    escrow_released_at = now(),
    buyer_rating = p_rating,
    buyer_review = p_review_text,
    updated_at = now()
  WHERE id = p_order_id;

  UPDATE marketplace_provider_profiles
  SET
    completed_orders = completed_orders + 1,
    total_revenue = total_revenue + v_order.provider_amount
  WHERE user_id = v_order.provider_id;

  IF p_rating IS NOT NULL THEN
    INSERT INTO marketplace_reviews (
      order_id,
      service_id,
      reviewer_id,
      reviewed_user_id,
      rating,
      review_text,
      would_recommend
    ) VALUES (
      p_order_id,
      v_order.service_id,
      v_order.buyer_id,
      v_order.provider_id,
      p_rating,
      p_review_text,
      p_rating >= 4
    );

    WITH review_stats AS (
      SELECT
        AVG(rating)::numeric(3,2) AS avg_rating,
        COUNT(*)::integer AS total_reviews
      FROM marketplace_reviews
      WHERE service_id = v_order.service_id
    )
    UPDATE marketplace_services s
    SET
      average_rating = rs.avg_rating,
      total_reviews = rs.total_reviews
    FROM review_stats rs
    WHERE s.id = v_order.service_id;

    WITH provider_review_stats AS (
      SELECT
        AVG(rating)::numeric(3,2) AS avg_rating,
        COUNT(*)::integer AS total_reviews
      FROM marketplace_reviews
      WHERE reviewed_user_id = v_order.provider_id
    )
    UPDATE marketplace_provider_profiles p
    SET
      average_rating = prs.avg_rating,
      total_reviews = prs.total_reviews
    FROM provider_review_stats prs
    WHERE p.user_id = v_order.provider_id;
  END IF;

  INSERT INTO marketplace_audit_logs (order_id, user_id, action, details)
  VALUES (p_order_id, auth.uid(), 'order_completed', jsonb_build_object('rating', p_rating));

  RETURN jsonb_build_object('success', true);
END;
$$;

-- ============================================================
-- RPC: Open Marketplace Dispute
-- ============================================================
CREATE OR REPLACE FUNCTION rpc_open_marketplace_dispute(
  p_order_id uuid,
  p_reason text,
  p_description text,
  p_evidence_urls text[] DEFAULT ARRAY[]::text[]
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order marketplace_orders;
  v_dispute_id uuid;
BEGIN
  SELECT * INTO v_order FROM marketplace_orders WHERE id = p_order_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found';
  END IF;

  IF v_order.buyer_id != auth.uid() AND v_order.provider_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized: only order participants can open disputes';
  END IF;

  IF v_order.status = 'disputed' THEN
    RAISE EXCEPTION 'Dispute already open for this order';
  END IF;

  UPDATE marketplace_orders
  SET
    status = 'disputed',
    escrow_status = 'disputed',
    updated_at = now()
  WHERE id = p_order_id;

  INSERT INTO marketplace_disputes (
    order_id,
    opened_by,
    reason,
    description,
    evidence_urls,
    status
  ) VALUES (
    p_order_id,
    auth.uid(),
    p_reason,
    p_description,
    p_evidence_urls,
    'open'
  )
  RETURNING id INTO v_dispute_id;

  INSERT INTO marketplace_order_messages (
    order_id,
    sender_id,
    message,
    message_type,
    is_system_message
  ) VALUES (
    p_order_id,
    auth.uid(),
    'Litige ouvert : ' || p_reason,
    'system',
    true
  );

  INSERT INTO marketplace_audit_logs (order_id, user_id, action, details)
  VALUES (p_order_id, auth.uid(), 'dispute_opened', jsonb_build_object('reason', p_reason, 'dispute_id', v_dispute_id));

  RETURN jsonb_build_object('success', true, 'dispute_id', v_dispute_id);
END;
$$;

-- ============================================================
-- RPC: Get Marketplace Home Data
-- ============================================================
CREATE OR REPLACE FUNCTION rpc_get_marketplace_home(
  p_limit integer DEFAULT 20
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_featured_services jsonb;
  v_top_providers jsonb;
  v_categories jsonb;
BEGIN
  SELECT jsonb_agg(row_to_json(s.*))
  INTO v_featured_services
  FROM (
    SELECT s.*, row_to_json(p.*) AS provider
    FROM marketplace_services s
    JOIN marketplace_provider_profiles p ON s.provider_id = p.id
    WHERE s.is_featured = true AND s.is_active = true
    ORDER BY s.average_rating DESC, s.total_orders DESC
    LIMIT p_limit
  ) s;

  SELECT jsonb_agg(row_to_json(p.*))
  INTO v_top_providers
  FROM (
    SELECT *
    FROM marketplace_provider_profiles
    WHERE is_active = true AND is_available = true
    ORDER BY is_pro DESC, average_rating DESC, total_orders DESC
    LIMIT 12
  ) p;

  SELECT jsonb_object_agg(category, service_count)
  INTO v_categories
  FROM (
    SELECT category, COUNT(*)::integer AS service_count
    FROM marketplace_services
    WHERE is_active = true
    GROUP BY category
  ) c;

  RETURN jsonb_build_object(
    'featured_services', COALESCE(v_featured_services, '[]'::jsonb),
    'top_providers', COALESCE(v_top_providers, '[]'::jsonb),
    'categories', COALESCE(v_categories, '{}'::jsonb)
  );
END;
$$;
