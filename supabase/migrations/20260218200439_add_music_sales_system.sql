/*
  # Music Sales System - Album & Single Sales

  ## Overview
  Full music sales infrastructure supporting:
  - Premium video sales (singles, albums)
  - Three-phase release model (exclusive → public → long-term)
  - Preorders with early supporter badges
  - Limited numbered digital editions
  - Automatic royalty splitting between co-artists/producers
  - Bundle packs (album + merch)
  - Anti-piracy metadata (ISRC, territory restrictions)

  ## New Tables

  ### 1. music_sale_releases
  Master release record with all legal/commercial metadata.
  Fields: artist info, ISRC, label, territory restrictions, pricing tiers,
  exclusive window, public release date, release type (single/album/bundle).

  ### 2. music_sale_purchases
  Per-user purchase records with access type (lifetime/temporary/rental).
  Tracks early supporter status, limited edition number if applicable.

  ### 3. music_sale_preorders
  Preorder registrations before release date. Payment captured upfront,
  access granted automatically on release day.

  ### 4. music_limited_editions
  Numbered digital editions (e.g. #245/1000). Certificate metadata,
  collector badge assignment.

  ### 5. music_royalty_splits
  Co-artist/producer/author revenue split declarations.
  Automatic distribution of revenue shares on each sale.

  ### 6. music_sale_stats
  Aggregated sales analytics per release (units sold, revenue, countries,
  conversion rates).

  ## Security
  - RLS enabled on all tables
  - Creators manage their own releases
  - Purchases visible only to buyer and release creator
  - Royalty splits visible only to involved parties
*/

-- ============================================================
-- TABLE: music_sale_releases
-- ============================================================
CREATE TABLE IF NOT EXISTS music_sale_releases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Identity
  title text NOT NULL,
  artist_name text NOT NULL,
  label_name text DEFAULT '',
  isrc text DEFAULT '',
  release_type text NOT NULL DEFAULT 'single' CHECK (release_type IN ('single','album','ep','bundle')),
  genre text DEFAULT '',
  cover_art_url text DEFAULT '',
  description text DEFAULT '',

  -- Legal
  rights_owned boolean NOT NULL DEFAULT false,
  rights_declaration_signed_at timestamptz,
  territories_allowed text[] DEFAULT ARRAY['worldwide'],
  credits jsonb DEFAULT '[]'::jsonb,

  -- Pricing
  price_standard numeric(10,2) NOT NULL DEFAULT 0,
  price_promo numeric(10,2),
  promo_starts_at timestamptz,
  promo_ends_at timestamptz,
  currency text NOT NULL DEFAULT 'EUR',
  sale_type text NOT NULL DEFAULT 'lifetime' CHECK (sale_type IN ('lifetime','limited_access','rental_48h','rental_72h')),
  access_duration_days integer,

  -- Bundle
  is_bundle boolean NOT NULL DEFAULT false,
  bundle_items jsonb DEFAULT '[]'::jsonb,

  -- Phase management
  phase text NOT NULL DEFAULT 'draft' CHECK (phase IN ('draft','preorder','exclusive','public','archived')),
  exclusive_starts_at timestamptz,
  exclusive_ends_at timestamptz,
  public_release_at timestamptz,

  -- Preorder
  preorder_enabled boolean NOT NULL DEFAULT false,
  preorder_price numeric(10,2),
  preorder_starts_at timestamptz,
  preorder_ends_at timestamptz,

  -- Limited edition
  is_limited_edition boolean NOT NULL DEFAULT false,
  limited_edition_total integer,
  limited_edition_sold integer NOT NULL DEFAULT 0,

  -- Stats
  total_sales integer NOT NULL DEFAULT 0,
  total_revenue numeric(14,2) NOT NULL DEFAULT 0,
  platform_commission_rate numeric(5,4) NOT NULL DEFAULT 0.15,

  -- Video content
  video_id uuid,
  preview_url text DEFAULT '',

  -- Distribution level
  distribution_level text NOT NULL DEFAULT 'independent' CHECK (distribution_level IN ('independent','label')),
  label_mandate_verified boolean NOT NULL DEFAULT false,

  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE music_sale_releases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators manage own releases"
  ON music_sale_releases FOR SELECT
  TO authenticated
  USING (creator_id = auth.uid() OR phase IN ('exclusive','public'));

CREATE POLICY "Creators insert own releases"
  ON music_sale_releases FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Creators update own releases"
  ON music_sale_releases FOR UPDATE
  TO authenticated
  USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_music_sale_releases_creator ON music_sale_releases(creator_id);
CREATE INDEX IF NOT EXISTS idx_music_sale_releases_phase ON music_sale_releases(phase);
CREATE INDEX IF NOT EXISTS idx_music_sale_releases_public_release ON music_sale_releases(public_release_at);

-- ============================================================
-- TABLE: music_royalty_splits
-- ============================================================
CREATE TABLE IF NOT EXISTS music_royalty_splits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  release_id uuid NOT NULL REFERENCES music_sale_releases(id) ON DELETE CASCADE,
  recipient_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  recipient_name text NOT NULL,
  recipient_email text NOT NULL DEFAULT '',
  role text NOT NULL CHECK (role IN ('main_artist','featured_artist','producer','author','composer','label','other')),
  percentage numeric(5,2) NOT NULL CHECK (percentage > 0 AND percentage <= 100),
  is_confirmed boolean NOT NULL DEFAULT false,
  confirmed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE music_royalty_splits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Release creator views splits"
  ON music_royalty_splits FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM music_sale_releases
      WHERE id = music_royalty_splits.release_id
      AND creator_id = auth.uid()
    )
    OR recipient_user_id = auth.uid()
  );

CREATE POLICY "Release creator manages splits"
  ON music_royalty_splits FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM music_sale_releases
      WHERE id = music_royalty_splits.release_id
      AND creator_id = auth.uid()
    )
  );

CREATE POLICY "Release creator updates splits"
  ON music_royalty_splits FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM music_sale_releases
      WHERE id = music_royalty_splits.release_id
      AND creator_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM music_sale_releases
      WHERE id = music_royalty_splits.release_id
      AND creator_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_music_royalty_splits_release ON music_royalty_splits(release_id);
CREATE INDEX IF NOT EXISTS idx_music_royalty_splits_recipient ON music_royalty_splits(recipient_user_id);

-- ============================================================
-- TABLE: music_sale_purchases
-- ============================================================
CREATE TABLE IF NOT EXISTS music_sale_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  release_id uuid NOT NULL REFERENCES music_sale_releases(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  purchase_price numeric(10,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'EUR',
  payment_method text NOT NULL DEFAULT 'card' CHECK (payment_method IN ('card','trucoin','mixed')),
  card_amount numeric(10,2) NOT NULL DEFAULT 0,
  trucoin_amount numeric(10,2) NOT NULL DEFAULT 0,

  sale_type text NOT NULL DEFAULT 'lifetime',
  access_expires_at timestamptz,

  -- Early supporter / preorder
  is_early_supporter boolean NOT NULL DEFAULT false,
  is_preorder boolean NOT NULL DEFAULT false,
  is_founder boolean NOT NULL DEFAULT false,

  -- Limited edition
  limited_edition_number integer,
  certificate_code text UNIQUE,

  -- Status
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('pending','completed','refunded','expired')),
  stripe_payment_intent_id text DEFAULT '',
  transaction_id uuid,

  -- HD access (for founders)
  hd_access boolean NOT NULL DEFAULT false,
  bonus_content_access boolean NOT NULL DEFAULT false,

  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(release_id, buyer_id)
);

ALTER TABLE music_sale_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers view own purchases"
  ON music_sale_purchases FOR SELECT
  TO authenticated
  USING (
    buyer_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM music_sale_releases
      WHERE id = music_sale_purchases.release_id
      AND creator_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users purchase"
  ON music_sale_purchases FOR INSERT
  TO authenticated
  WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Buyers update own purchases"
  ON music_sale_purchases FOR UPDATE
  TO authenticated
  USING (buyer_id = auth.uid())
  WITH CHECK (buyer_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_music_sale_purchases_buyer ON music_sale_purchases(buyer_id);
CREATE INDEX IF NOT EXISTS idx_music_sale_purchases_release ON music_sale_purchases(release_id);

-- ============================================================
-- TABLE: music_sale_preorders
-- ============================================================
CREATE TABLE IF NOT EXISTS music_sale_preorders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  release_id uuid NOT NULL REFERENCES music_sale_releases(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  preorder_price numeric(10,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'EUR',
  payment_method text NOT NULL DEFAULT 'card',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','converted','cancelled','refunded')),
  stripe_payment_intent_id text DEFAULT '',

  -- Auto-grant access on release day
  access_granted boolean NOT NULL DEFAULT false,
  access_granted_at timestamptz,
  purchase_id uuid REFERENCES music_sale_purchases(id),

  -- Display in supporter section
  display_name text DEFAULT '',
  show_publicly boolean NOT NULL DEFAULT false,

  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(release_id, buyer_id)
);

ALTER TABLE music_sale_preorders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers view own preorders"
  ON music_sale_preorders FOR SELECT
  TO authenticated
  USING (
    buyer_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM music_sale_releases
      WHERE id = music_sale_preorders.release_id
      AND creator_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users preorder"
  ON music_sale_preorders FOR INSERT
  TO authenticated
  WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Buyers update own preorders"
  ON music_sale_preorders FOR UPDATE
  TO authenticated
  USING (buyer_id = auth.uid())
  WITH CHECK (buyer_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_music_sale_preorders_buyer ON music_sale_preorders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_music_sale_preorders_release ON music_sale_preorders(release_id);

-- ============================================================
-- TABLE: music_limited_editions
-- ============================================================
CREATE TABLE IF NOT EXISTS music_limited_editions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  release_id uuid NOT NULL REFERENCES music_sale_releases(id) ON DELETE CASCADE,
  edition_number integer NOT NULL,
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  certificate_code text NOT NULL UNIQUE DEFAULT gen_random_uuid()::text,
  issued_at timestamptz,
  purchase_price numeric(10,2) NOT NULL DEFAULT 0,
  is_available boolean NOT NULL DEFAULT true,
  UNIQUE(release_id, edition_number)
);

ALTER TABLE music_limited_editions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone views limited editions"
  ON music_limited_editions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System issues editions"
  ON music_limited_editions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM music_sale_releases
      WHERE id = music_limited_editions.release_id
      AND creator_id = auth.uid()
    )
  );

CREATE POLICY "System updates editions"
  ON music_limited_editions FOR UPDATE
  TO authenticated
  USING (
    owner_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM music_sale_releases
      WHERE id = music_limited_editions.release_id
      AND creator_id = auth.uid()
    )
  )
  WITH CHECK (
    owner_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM music_sale_releases
      WHERE id = music_limited_editions.release_id
      AND creator_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_music_limited_editions_release ON music_limited_editions(release_id);
CREATE INDEX IF NOT EXISTS idx_music_limited_editions_owner ON music_limited_editions(owner_id);

-- ============================================================
-- TABLE: music_royalty_payments
-- ============================================================
CREATE TABLE IF NOT EXISTS music_royalty_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  release_id uuid NOT NULL REFERENCES music_sale_releases(id) ON DELETE CASCADE,
  purchase_id uuid NOT NULL REFERENCES music_sale_purchases(id) ON DELETE CASCADE,
  split_id uuid NOT NULL REFERENCES music_royalty_splits(id) ON DELETE CASCADE,
  recipient_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  gross_sale_amount numeric(10,2) NOT NULL,
  platform_fee numeric(10,2) NOT NULL,
  net_amount numeric(10,2) NOT NULL,
  recipient_percentage numeric(5,2) NOT NULL,
  recipient_amount numeric(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'EUR',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','credited','paid','failed')),
  credited_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE music_royalty_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Recipients view own royalty payments"
  ON music_royalty_payments FOR SELECT
  TO authenticated
  USING (
    recipient_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM music_sale_releases
      WHERE id = music_royalty_payments.release_id
      AND creator_id = auth.uid()
    )
  );

CREATE POLICY "System inserts royalty payments"
  ON music_royalty_payments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM music_sale_releases
      WHERE id = music_royalty_payments.release_id
      AND creator_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_music_royalty_payments_release ON music_royalty_payments(release_id);
CREATE INDEX IF NOT EXISTS idx_music_royalty_payments_recipient ON music_royalty_payments(recipient_id);
