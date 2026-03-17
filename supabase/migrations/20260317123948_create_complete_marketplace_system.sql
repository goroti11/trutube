/*
  # Goroti Complete Marketplace System - Production Ready

  ## Overview
  Professional services marketplace connecting creators with specialized providers.
  Includes services, digital products, merchandise, orders, messaging, disputes, reviews.

  ## Categories
  - Production musicale (beatmakers, mix/master, compositeurs)
  - Vidéo (monteurs, motion designers, coloristes, réalisateurs)
  - Branding (graphistes, designers merch, UI/UX)
  - Marketing (community managers, stratèges lancement, ads managers)
  - Juridique (contrats, dépôt droits, conseil royalties)

  ## New Tables
  1. marketplace_provider_profiles - Professional seller profiles
  2. marketplace_services - Service listings with tiers
  3. marketplace_orders - Orders with escrow system
  4. marketplace_order_messages - Order messaging
  5. marketplace_order_deliveries - File delivery tracking
  6. marketplace_disputes - Dispute resolution
  7. marketplace_reviews - Verified reviews
  8. marketplace_audit_logs - Audit trail

  ## Security
  - RLS enabled on all tables
  - Strict access control per user role
  - Audit logging for critical actions
*/

-- ============================================================
-- TABLE: marketplace_provider_profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS marketplace_provider_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

  display_name text NOT NULL DEFAULT '',
  tagline text DEFAULT '',
  bio text DEFAULT '',
  avatar_url text DEFAULT '',
  portfolio_images text[] DEFAULT ARRAY[]::text[],
  portfolio_urls text[] DEFAULT ARRAY[]::text[],

  primary_category text NOT NULL DEFAULT 'video' CHECK (primary_category IN ('music_production','video','branding','marketing','legal')),
  secondary_categories text[] DEFAULT ARRAY[]::text[],
  specializations text[] DEFAULT ARRAY[]::text[],

  languages text[] DEFAULT ARRAY['fr']::text[],
  experience_years integer NOT NULL DEFAULT 0,
  expertise_level text NOT NULL DEFAULT 'intermediate' CHECK (expertise_level IN ('beginner','intermediate','expert','pro')),

  is_verified boolean NOT NULL DEFAULT false,
  verified_at timestamptz,
  is_pro boolean NOT NULL DEFAULT false,
  pro_subscription_ends_at timestamptz,

  identity_verified boolean NOT NULL DEFAULT false,
  identity_verified_at timestamptz,

  total_orders integer NOT NULL DEFAULT 0,
  completed_orders integer NOT NULL DEFAULT 0,
  cancelled_orders integer NOT NULL DEFAULT 0,
  average_rating numeric(3,2) NOT NULL DEFAULT 0,
  total_reviews integer NOT NULL DEFAULT 0,
  total_revenue numeric(14,2) NOT NULL DEFAULT 0,
  response_rate numeric(5,2) NOT NULL DEFAULT 100,
  on_time_delivery_rate numeric(5,2) NOT NULL DEFAULT 100,

  is_available boolean NOT NULL DEFAULT true,
  away_until timestamptz,
  max_active_orders integer NOT NULL DEFAULT 5,

  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE marketplace_provider_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone views active provider profiles"
  ON marketplace_provider_profiles FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Providers manage own profile"
  ON marketplace_provider_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Providers update own profile"
  ON marketplace_provider_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_marketplace_providers_user ON marketplace_provider_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_providers_category ON marketplace_provider_profiles(primary_category);
CREATE INDEX IF NOT EXISTS idx_marketplace_providers_rating ON marketplace_provider_profiles(average_rating DESC);

-- ============================================================
-- TABLE: marketplace_services
-- ============================================================
CREATE TABLE IF NOT EXISTS marketplace_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES marketplace_provider_profiles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL CHECK (category IN ('music_production','video','branding','marketing','legal')),
  subcategory text DEFAULT '',
  tags text[] DEFAULT ARRAY[]::text[],

  price_basic numeric(10,2) NOT NULL DEFAULT 0,
  price_standard numeric(10,2),
  price_premium numeric(10,2),
  currency text NOT NULL DEFAULT 'EUR',

  delivery_days_basic integer NOT NULL DEFAULT 7,
  delivery_days_standard integer,
  delivery_days_premium integer,

  revisions_basic integer NOT NULL DEFAULT 1,
  revisions_standard integer,
  revisions_premium integer,

  includes_basic text DEFAULT '',
  includes_standard text DEFAULT '',
  includes_premium text DEFAULT '',

  cover_image_url text DEFAULT '',
  gallery_images text[] DEFAULT ARRAY[]::text[],
  sample_work_url text DEFAULT '',

  requirements text DEFAULT '',

  total_orders integer NOT NULL DEFAULT 0,
  total_revenue numeric(14,2) NOT NULL DEFAULT 0,
  average_rating numeric(3,2) NOT NULL DEFAULT 0,
  total_reviews integer NOT NULL DEFAULT 0,

  is_featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE marketplace_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone views active services"
  ON marketplace_services FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Providers manage own services"
  ON marketplace_services FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Providers update own services"
  ON marketplace_services FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_marketplace_services_provider ON marketplace_services(provider_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_services_category ON marketplace_services(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_services_rating ON marketplace_services(average_rating DESC);
CREATE INDEX IF NOT EXISTS idx_marketplace_services_active ON marketplace_services(provider_id, is_active) WHERE is_active = true;

-- ============================================================
-- TABLE: marketplace_orders
-- ============================================================
CREATE TABLE IF NOT EXISTS marketplace_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES marketplace_services(id) ON DELETE RESTRICT,
  buyer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  order_number text NOT NULL UNIQUE DEFAULT 'MKT-' || upper(substring(gen_random_uuid()::text, 1, 8)),

  tier text NOT NULL DEFAULT 'basic' CHECK (tier IN ('basic','standard','premium')),
  price numeric(10,2) NOT NULL DEFAULT 0,
  platform_fee numeric(10,2) NOT NULL DEFAULT 0,
  provider_amount numeric(10,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'EUR',

  payment_method text NOT NULL DEFAULT 'card' CHECK (payment_method IN ('card','trucoin','mixed')),
  card_amount numeric(10,2) NOT NULL DEFAULT 0,
  trucoin_amount numeric(10,2) NOT NULL DEFAULT 0,
  stripe_payment_intent_id text DEFAULT '',

  escrow_status text NOT NULL DEFAULT 'held' CHECK (escrow_status IN ('held','released','refunded','disputed')),
  escrow_released_at timestamptz,

  delivery_days integer NOT NULL DEFAULT 7,
  due_date timestamptz,
  revisions_allowed integer NOT NULL DEFAULT 1,
  revisions_used integer NOT NULL DEFAULT 0,
  max_revisions integer NOT NULL DEFAULT 0,
  revision_count integer NOT NULL DEFAULT 0,

  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','in_progress','delivered','revision_requested','completed','cancelled','disputed')),
  delivery_status text DEFAULT 'pending' CHECK (delivery_status IN ('pending','in_review','accepted','rejected')),
  buyer_requirements text DEFAULT '',
  delivery_message text DEFAULT '',
  completion_note text DEFAULT '',
  buyer_confirmed boolean NOT NULL DEFAULT false,
  auto_complete_at timestamptz,

  buyer_rating integer CHECK (buyer_rating >= 1 AND buyer_rating <= 5),
  buyer_review text DEFAULT '',
  provider_rating integer CHECK (provider_rating >= 1 AND provider_rating <= 5),
  provider_review text DEFAULT '',

  started_at timestamptz,
  delivered_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  cancellation_reason text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE marketplace_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers and providers view own orders"
  ON marketplace_orders FOR SELECT
  TO authenticated
  USING (buyer_id = auth.uid() OR provider_id = auth.uid());

CREATE POLICY "Buyers create orders"
  ON marketplace_orders FOR INSERT
  TO authenticated
  WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Buyers and providers update own orders"
  ON marketplace_orders FOR UPDATE
  TO authenticated
  USING (buyer_id = auth.uid() OR provider_id = auth.uid())
  WITH CHECK (buyer_id = auth.uid() OR provider_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_marketplace_orders_buyer ON marketplace_orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_provider ON marketplace_orders(provider_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_status ON marketplace_orders(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_created ON marketplace_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_buyer_created ON marketplace_orders(buyer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_provider_created ON marketplace_orders(provider_id, created_at DESC);

-- ============================================================
-- TABLE: marketplace_order_messages
-- ============================================================
CREATE TABLE IF NOT EXISTS marketplace_order_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES marketplace_orders(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message text NOT NULL,
  attachment_url text DEFAULT '',
  attachment_type text DEFAULT '',
  message_type text DEFAULT 'text' CHECK (message_type IN ('text','delivery','revision_request','system')),
  is_system_message boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE marketplace_order_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Order participants view messages"
  ON marketplace_order_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM marketplace_orders
      WHERE id = marketplace_order_messages.order_id
      AND (buyer_id = auth.uid() OR provider_id = auth.uid())
    )
  );

CREATE POLICY "Order participants send messages"
  ON marketplace_order_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM marketplace_orders
      WHERE id = marketplace_order_messages.order_id
      AND (buyer_id = auth.uid() OR provider_id = auth.uid())
    )
  );

CREATE INDEX IF NOT EXISTS idx_marketplace_messages_order ON marketplace_order_messages(order_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_messages_created ON marketplace_order_messages(order_id, created_at ASC);

-- ============================================================
-- TABLE: marketplace_order_deliveries
-- ============================================================
CREATE TABLE IF NOT EXISTS marketplace_order_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES marketplace_orders(id) ON DELETE CASCADE,
  submitted_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  delivery_note text DEFAULT '',
  file_urls text[] DEFAULT ARRAY[]::text[],
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected','revision_requested')),
  buyer_feedback text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz
);

ALTER TABLE marketplace_order_deliveries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Order participants view deliveries"
  ON marketplace_order_deliveries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM marketplace_orders
      WHERE id = marketplace_order_deliveries.order_id
      AND (buyer_id = auth.uid() OR provider_id = auth.uid())
    )
  );

CREATE POLICY "Providers submit deliveries"
  ON marketplace_order_deliveries FOR INSERT
  TO authenticated
  WITH CHECK (
    submitted_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM marketplace_orders
      WHERE id = marketplace_order_deliveries.order_id
      AND provider_id = auth.uid()
    )
  );

CREATE POLICY "Buyers update delivery status"
  ON marketplace_order_deliveries FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM marketplace_orders
      WHERE id = marketplace_order_deliveries.order_id
      AND buyer_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM marketplace_orders
      WHERE id = marketplace_order_deliveries.order_id
      AND buyer_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_marketplace_deliveries_order ON marketplace_order_deliveries(order_id, created_at DESC);

-- ============================================================
-- TABLE: marketplace_disputes
-- ============================================================
CREATE TABLE IF NOT EXISTS marketplace_disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL UNIQUE REFERENCES marketplace_orders(id) ON DELETE CASCADE,
  opened_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason text NOT NULL,
  description text NOT NULL DEFAULT '',
  evidence_urls text[] DEFAULT ARRAY[]::text[],
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','investigating','resolved_buyer','resolved_provider','resolved_split')),
  resolution_note text DEFAULT '',
  refund_amount numeric(10,2),
  resolved_at timestamptz,
  resolved_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE marketplace_disputes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dispute parties view own disputes"
  ON marketplace_disputes FOR SELECT
  TO authenticated
  USING (
    opened_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM marketplace_orders
      WHERE id = marketplace_disputes.order_id
      AND (buyer_id = auth.uid() OR provider_id = auth.uid())
    )
  );

CREATE POLICY "Order participants open disputes"
  ON marketplace_disputes FOR INSERT
  TO authenticated
  WITH CHECK (
    opened_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM marketplace_orders
      WHERE id = marketplace_disputes.order_id
      AND (buyer_id = auth.uid() OR provider_id = auth.uid())
    )
  );

CREATE INDEX IF NOT EXISTS idx_marketplace_disputes_order ON marketplace_disputes(order_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_disputes_status ON marketplace_disputes(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_disputes_created ON marketplace_disputes(order_id, created_at DESC);

-- ============================================================
-- TABLE: marketplace_reviews
-- ============================================================
CREATE TABLE IF NOT EXISTS marketplace_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES marketplace_orders(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES marketplace_services(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewed_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text DEFAULT '',
  communication_rating integer CHECK (communication_rating >= 1 AND communication_rating <= 5),
  quality_rating integer CHECK (quality_rating >= 1 AND quality_rating <= 5),
  delivery_rating integer CHECK (delivery_rating >= 1 AND delivery_rating <= 5),
  would_recommend boolean NOT NULL DEFAULT true,
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(order_id, reviewer_id)
);

ALTER TABLE marketplace_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone views public reviews"
  ON marketplace_reviews FOR SELECT
  TO authenticated
  USING (is_public = true OR reviewer_id = auth.uid() OR reviewed_user_id = auth.uid());

CREATE POLICY "Reviewers post own reviews"
  ON marketplace_reviews FOR INSERT
  TO authenticated
  WITH CHECK (reviewer_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_service ON marketplace_reviews(service_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_reviewed_user ON marketplace_reviews(reviewed_user_id);

-- ============================================================
-- TABLE: marketplace_audit_logs
-- ============================================================
CREATE TABLE IF NOT EXISTS marketplace_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES marketplace_orders(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  ip_address inet,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE marketplace_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Order participants view audit logs"
  ON marketplace_audit_logs FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM marketplace_orders
      WHERE id = marketplace_audit_logs.order_id
      AND (buyer_id = auth.uid() OR provider_id = auth.uid())
    )
  );

CREATE INDEX IF NOT EXISTS idx_marketplace_audit_order ON marketplace_audit_logs(order_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketplace_audit_user ON marketplace_audit_logs(user_id, created_at DESC);
