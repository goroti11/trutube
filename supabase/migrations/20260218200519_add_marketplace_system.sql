/*
  # TruTube Marketplace System

  ## Overview
  Professional services marketplace connecting creators with specialized providers.
  Specialized for media creators (NOT a generic Fiverr clone).

  ## Categories
  A) Production musicale (beatmakers, mix/master, compositeurs)
  B) Vidéo (monteurs, motion designers, coloristes, réalisateurs)
  C) Branding (graphistes, designers merch, UI/UX)
  D) Marketing (community managers, stratèges lancement, ads managers)
  E) Juridique (contrats, dépôt droits, conseil royalties)

  ## New Tables

  ### 1. marketplace_provider_profiles
  Verified professional profiles with portfolio, ratings, expertise level.

  ### 2. marketplace_services
  Individual service listings with pricing, delivery time, revisions.

  ### 3. marketplace_orders
  Service orders with escrow payment system.

  ### 4. marketplace_order_messages
  Secure messaging between buyer and provider within an order.

  ### 5. marketplace_disputes
  Arbitration system for unresolved order issues.

  ### 6. marketplace_reviews
  Verified post-delivery review system.

  ## Security
  - RLS on all tables
  - Providers manage own profiles/services
  - Orders visible only to buyer and provider
  - Disputes handled by platform (admin)
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

  -- Categories (can be multi-category)
  primary_category text NOT NULL DEFAULT 'video' CHECK (primary_category IN ('music_production','video','branding','marketing','legal')),
  secondary_categories text[] DEFAULT ARRAY[]::text[],
  specializations text[] DEFAULT ARRAY[]::text[],

  -- Credentials
  languages text[] DEFAULT ARRAY['fr']::text[],
  experience_years integer NOT NULL DEFAULT 0,
  expertise_level text NOT NULL DEFAULT 'intermediate' CHECK (expertise_level IN ('beginner','intermediate','expert','pro')),

  -- Verification
  is_verified boolean NOT NULL DEFAULT false,
  verified_at timestamptz,
  is_pro boolean NOT NULL DEFAULT false,
  pro_subscription_ends_at timestamptz,

  -- KYC
  identity_verified boolean NOT NULL DEFAULT false,
  identity_verified_at timestamptz,

  -- Stats
  total_orders integer NOT NULL DEFAULT 0,
  completed_orders integer NOT NULL DEFAULT 0,
  cancelled_orders integer NOT NULL DEFAULT 0,
  average_rating numeric(3,2) NOT NULL DEFAULT 0,
  total_reviews integer NOT NULL DEFAULT 0,
  total_revenue numeric(14,2) NOT NULL DEFAULT 0,
  response_rate numeric(5,2) NOT NULL DEFAULT 100,
  on_time_delivery_rate numeric(5,2) NOT NULL DEFAULT 100,

  -- Availability
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

  -- Pricing tiers (basic / standard / premium)
  price_basic numeric(10,2) NOT NULL DEFAULT 0,
  price_standard numeric(10,2),
  price_premium numeric(10,2),
  currency text NOT NULL DEFAULT 'EUR',

  -- Delivery
  delivery_days_basic integer NOT NULL DEFAULT 7,
  delivery_days_standard integer,
  delivery_days_premium integer,

  -- Revisions
  revisions_basic integer NOT NULL DEFAULT 1,
  revisions_standard integer,
  revisions_premium integer,

  -- Descriptions per tier
  includes_basic text DEFAULT '',
  includes_standard text DEFAULT '',
  includes_premium text DEFAULT '',

  -- Media
  cover_image_url text DEFAULT '',
  gallery_images text[] DEFAULT ARRAY[]::text[],
  sample_work_url text DEFAULT '',

  -- Requirements
  requirements text DEFAULT '',

  -- Stats
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

-- ============================================================
-- TABLE: marketplace_orders
-- ============================================================
CREATE TABLE IF NOT EXISTS marketplace_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES marketplace_services(id) ON DELETE RESTRICT,
  buyer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  order_number text NOT NULL UNIQUE DEFAULT 'MKT-' || upper(substring(gen_random_uuid()::text, 1, 8)),

  -- Pricing
  tier text NOT NULL DEFAULT 'basic' CHECK (tier IN ('basic','standard','premium')),
  price numeric(10,2) NOT NULL DEFAULT 0,
  platform_fee numeric(10,2) NOT NULL DEFAULT 0,
  provider_amount numeric(10,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'EUR',

  -- Payment
  payment_method text NOT NULL DEFAULT 'card' CHECK (payment_method IN ('card','trucoin','mixed')),
  card_amount numeric(10,2) NOT NULL DEFAULT 0,
  trucoin_amount numeric(10,2) NOT NULL DEFAULT 0,
  stripe_payment_intent_id text DEFAULT '',

  -- Escrow
  escrow_status text NOT NULL DEFAULT 'held' CHECK (escrow_status IN ('held','released','refunded','disputed')),
  escrow_released_at timestamptz,

  -- Delivery
  delivery_days integer NOT NULL DEFAULT 7,
  due_date timestamptz,
  revisions_allowed integer NOT NULL DEFAULT 1,
  revisions_used integer NOT NULL DEFAULT 0,

  -- Order status
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','in_progress','delivered','revision_requested','completed','cancelled','disputed')),
  buyer_requirements text DEFAULT '',
  delivery_message text DEFAULT '',
  completion_note text DEFAULT '',

  -- Ratings
  buyer_rating integer CHECK (buyer_rating >= 1 AND buyer_rating <= 5),
  buyer_review text DEFAULT '',
  provider_rating integer CHECK (provider_rating >= 1 AND provider_rating <= 5),
  provider_review text DEFAULT '',

  -- Timestamps
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
