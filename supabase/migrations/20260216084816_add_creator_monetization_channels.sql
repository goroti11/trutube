/*
  # Système Multi-Canaux de Monétisation pour Créateurs

  ## Vue d'ensemble
  Ce système permet aux créateurs de monétiser leur contenu via 5 canaux principaux :
  1. Affiliation (liens affiliés Amazon, etc.)
  2. Merchandising (boutique de produits)
  3. Placements de produits (sponsorships/brand deals)
  4. Streaming musique (royalties)
  5. Formations & Services (cours, coaching)

  ## Nouvelles Tables

  ### 1. AFFILIATION
  - `affiliate_links`: Liens affiliés des créateurs
  - `affiliate_clicks`: Tracking des clicks
  - `affiliate_conversions`: Tracking des conversions/ventes

  ### 2. MERCHANDISING
  - `merchandise_products`: Produits à vendre
  - `merchandise_orders`: Commandes clients
  - `merchandise_order_items`: Items de commande
  - `merchandise_inventory`: Gestion inventaire

  ### 3. PLACEMENTS DE PRODUITS
  - `brand_deals`: Contrats avec marques
  - `video_sponsorships`: Sponsorships par vidéo
  - `sponsorship_deliverables`: Livrables du contrat

  ### 4. STREAMING MUSIQUE
  - `music_albums`: Albums musicaux
  - `music_tracks`: Pistes musicales
  - `music_streams`: Écoutes/streams
  - `music_royalties`: Paiements royalties

  ### 5. FORMATIONS & SERVICES
  - `digital_products`: Cours, formations, ebooks
  - `digital_product_modules`: Modules de cours
  - `digital_product_purchases`: Achats
  - `services`: Consultations, coaching
  - `service_bookings`: Réservations

  ## Sécurité
  - RLS activé sur toutes les tables
  - Créateurs gèrent uniquement leur contenu
  - Users authentifiés peuvent acheter
  - Transactions sécurisées

  ## Notes Importantes
  - Intégration Stripe pour paiements
  - Tracking détaillé des revenus
  - Analytics par canal
  - Commission plateforme configurable (10% par défaut)
*/

-- =====================================================
-- 1. AFFILIATION SYSTEM
-- =====================================================

CREATE TABLE IF NOT EXISTS affiliate_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  affiliate_url text NOT NULL,
  platform text NOT NULL, -- 'amazon', 'aliexpress', 'clickbank', 'custom'
  category text, -- 'tech', 'fashion', 'beauty', 'gaming', etc.
  thumbnail_url text,
  commission_rate numeric(5,2) DEFAULT 0, -- Taux commission (%)
  total_clicks integer DEFAULT 0,
  total_conversions integer DEFAULT 0,
  total_revenue numeric(12,2) DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_link_id uuid REFERENCES affiliate_links(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  video_id uuid REFERENCES videos(id) ON DELETE SET NULL,
  ip_address text,
  user_agent text,
  referrer text,
  clicked_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS affiliate_conversions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_link_id uuid REFERENCES affiliate_links(id) ON DELETE CASCADE NOT NULL,
  click_id uuid REFERENCES affiliate_clicks(id) ON DELETE SET NULL,
  order_id text, -- ID externe de la plateforme
  commission_amount numeric(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  status text DEFAULT 'pending', -- 'pending', 'approved', 'paid'
  converted_at timestamptz DEFAULT now(),
  paid_at timestamptz
);

-- =====================================================
-- 2. MERCHANDISING SYSTEM
-- =====================================================

CREATE TABLE IF NOT EXISTS merchandise_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  category text NOT NULL, -- 'tshirt', 'hoodie', 'mug', 'poster', 'accessories', 'other'
  images text[] DEFAULT '{}', -- Array d'URLs d'images
  base_price numeric(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  cost_price numeric(10,2), -- Prix de revient
  sizes text[], -- ['XS', 'S', 'M', 'L', 'XL']
  colors text[], -- ['black', 'white', 'blue']
  stock_quantity integer DEFAULT 0,
  low_stock_threshold integer DEFAULT 10,
  total_sales integer DEFAULT 0,
  total_revenue numeric(12,2) DEFAULT 0,
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS merchandise_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  order_number text UNIQUE NOT NULL,
  status text DEFAULT 'pending', -- 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'
  subtotal numeric(10,2) NOT NULL,
  shipping_cost numeric(10,2) DEFAULT 0,
  tax_amount numeric(10,2) DEFAULT 0,
  total_amount numeric(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  
  -- Shipping info
  shipping_name text NOT NULL,
  shipping_email text NOT NULL,
  shipping_address text NOT NULL,
  shipping_city text NOT NULL,
  shipping_state text,
  shipping_postal_code text NOT NULL,
  shipping_country text NOT NULL,
  
  tracking_number text,
  stripe_payment_intent_id text,
  
  created_at timestamptz DEFAULT now(),
  paid_at timestamptz,
  shipped_at timestamptz,
  delivered_at timestamptz
);

CREATE TABLE IF NOT EXISTS merchandise_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES merchandise_orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES merchandise_products(id) ON DELETE SET NULL,
  product_name text NOT NULL, -- Snapshot du nom
  product_image text, -- Snapshot de l'image
  variant_size text,
  variant_color text,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric(10,2) NOT NULL,
  total_price numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS merchandise_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES merchandise_products(id) ON DELETE CASCADE NOT NULL,
  variant_size text,
  variant_color text,
  quantity integer DEFAULT 0,
  reserved_quantity integer DEFAULT 0, -- En cours de commande
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(product_id, variant_size, variant_color)
);

-- =====================================================
-- 3. BRAND DEALS & SPONSORSHIPS
-- =====================================================

CREATE TABLE IF NOT EXISTS brand_deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  brand_name text NOT NULL,
  brand_contact_email text,
  brand_contact_name text,
  
  deal_type text NOT NULL, -- 'per_video', 'monthly', 'campaign'
  contract_value numeric(12,2) NOT NULL,
  currency text DEFAULT 'USD',
  
  start_date date NOT NULL,
  end_date date,
  
  required_videos integer, -- Nombre de vidéos requises
  completed_videos integer DEFAULT 0,
  
  contract_terms text, -- PDF URL ou text
  status text DEFAULT 'active', -- 'draft', 'active', 'completed', 'cancelled'
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS video_sponsorships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE NOT NULL,
  brand_deal_id uuid REFERENCES brand_deals(id) ON DELETE SET NULL,
  brand_name text NOT NULL,
  
  sponsorship_type text NOT NULL, -- 'integrated', 'pre_roll', 'mid_roll', 'post_roll', 'dedicated'
  sponsor_message text, -- Message à dire
  sponsor_link text, -- Lien promo
  sponsor_code text, -- Code promo
  
  payment_amount numeric(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  
  timestamp_start integer, -- Seconde de début dans la vidéo
  timestamp_end integer, -- Seconde de fin
  
  is_disclosed boolean DEFAULT true, -- Divulgation légale
  status text DEFAULT 'active', -- 'active', 'expired'
  
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sponsorship_deliverables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_deal_id uuid REFERENCES brand_deals(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  due_date date,
  status text DEFAULT 'pending', -- 'pending', 'in_progress', 'submitted', 'approved'
  submitted_at timestamptz,
  approved_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- 4. MUSIC STREAMING SYSTEM
-- =====================================================

CREATE TABLE IF NOT EXISTS music_albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  cover_art_url text,
  release_date date,
  genre text, -- 'pop', 'rock', 'hip-hop', 'electronic', etc.
  label text,
  total_tracks integer DEFAULT 0,
  total_streams bigint DEFAULT 0,
  total_revenue numeric(12,2) DEFAULT 0,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS music_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id uuid REFERENCES music_albums(id) ON DELETE CASCADE,
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  audio_url text NOT NULL, -- URL Supabase Storage
  cover_art_url text,
  duration integer NOT NULL, -- Secondes
  track_number integer,
  genre text,
  lyrics text,
  isrc text, -- International Standard Recording Code
  
  -- Splits revenus (pour collaborations)
  primary_artist_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  featured_artists jsonb DEFAULT '[]', -- [{artist_id, split_percentage}]
  
  total_streams bigint DEFAULT 0,
  total_revenue numeric(12,2) DEFAULT 0,
  
  is_published boolean DEFAULT false,
  is_explicit boolean DEFAULT false,
  
  created_at timestamptz DEFAULT now(),
  released_at timestamptz
);

CREATE TABLE IF NOT EXISTS music_streams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id uuid REFERENCES music_tracks(id) ON DELETE CASCADE NOT NULL,
  listener_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  
  stream_duration integer NOT NULL, -- Secondes écoutées
  is_complete boolean DEFAULT false, -- >30s = complete
  
  platform text DEFAULT 'goroti', -- 'goroti', 'spotify', 'apple_music'
  device_type text, -- 'web', 'mobile', 'tablet'
  
  streamed_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS music_royalties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id uuid REFERENCES music_tracks(id) ON DELETE CASCADE NOT NULL,
  recipient_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  period_start date NOT NULL,
  period_end date NOT NULL,
  
  total_streams integer NOT NULL,
  rate_per_stream numeric(10,6), -- Ex: 0.004 USD par stream
  
  gross_amount numeric(10,2) NOT NULL,
  platform_fee numeric(10,2) DEFAULT 0, -- Commission Goroti (10%)
  net_amount numeric(10,2) NOT NULL,
  
  currency text DEFAULT 'USD',
  status text DEFAULT 'pending', -- 'pending', 'processing', 'paid'
  
  created_at timestamptz DEFAULT now(),
  paid_at timestamptz
);

-- =====================================================
-- 5. DIGITAL PRODUCTS & SERVICES
-- =====================================================

CREATE TABLE IF NOT EXISTS digital_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  product_type text NOT NULL, -- 'course', 'ebook', 'template', 'preset', 'plugin'
  title text NOT NULL,
  description text,
  long_description text,
  
  cover_image_url text,
  preview_video_url text,
  
  price numeric(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  
  -- Pour les cours
  level text, -- 'beginner', 'intermediate', 'advanced'
  duration_hours numeric(5,1), -- Durée totale en heures
  includes jsonb DEFAULT '[]', -- ['videos', 'exercises', 'certificate', 'community']
  
  -- Fichiers
  download_files jsonb DEFAULT '[]', -- [{name, url, size, type}]
  
  total_sales integer DEFAULT 0,
  total_revenue numeric(12,2) DEFAULT 0,
  average_rating numeric(3,2) DEFAULT 0,
  total_reviews integer DEFAULT 0,
  
  is_published boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS digital_product_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES digital_products(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  order_index integer NOT NULL,
  
  video_url text,
  video_duration integer,
  
  content_html text, -- Contenu texte/HTML
  attachments jsonb DEFAULT '[]', -- Fichiers additionnels
  
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS digital_product_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES digital_products(id) ON DELETE CASCADE NOT NULL,
  customer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  purchase_price numeric(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  
  stripe_payment_intent_id text,
  stripe_charge_id text,
  
  access_granted_at timestamptz DEFAULT now(),
  last_accessed_at timestamptz,
  
  -- Review
  rating integer, -- 1-5
  review_text text,
  reviewed_at timestamptz,
  
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(product_id, customer_id)
);

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  service_type text NOT NULL, -- 'consultation', 'coaching', 'mentoring', 'review', 'custom'
  title text NOT NULL,
  description text,
  
  duration_minutes integer NOT NULL, -- 30, 60, 90, 120
  price numeric(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  
  -- Disponibilité
  is_available boolean DEFAULT true,
  max_bookings_per_week integer,
  available_days integer[], -- [1,2,3,4,5] = Lun-Ven
  available_hours jsonb DEFAULT '{"start": 9, "end": 17}',
  timezone text DEFAULT 'UTC',
  
  -- Paramètres
  requires_approval boolean DEFAULT false,
  buffer_time_minutes integer DEFAULT 15, -- Temps entre sessions
  advance_booking_days integer DEFAULT 30, -- Réserver jusqu'à X jours à l'avance
  
  booking_instructions text,
  meeting_link_template text, -- Zoom, Google Meet, etc.
  
  total_bookings integer DEFAULT 0,
  total_revenue numeric(12,2) DEFAULT 0,
  average_rating numeric(3,2) DEFAULT 0,
  
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS service_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  customer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  booking_date date NOT NULL,
  booking_time time NOT NULL,
  duration_minutes integer NOT NULL,
  
  status text DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled', 'no_show'
  
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_notes text,
  
  meeting_link text,
  
  price numeric(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  
  stripe_payment_intent_id text,
  
  -- Review
  rating integer,
  review_text text,
  reviewed_at timestamptz,
  
  created_at timestamptz DEFAULT now(),
  confirmed_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Affiliation
CREATE INDEX IF NOT EXISTS idx_affiliate_links_creator ON affiliate_links(creator_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_link ON affiliate_clicks(affiliate_link_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_link ON affiliate_conversions(affiliate_link_id);

-- Merchandising
CREATE INDEX IF NOT EXISTS idx_merchandise_products_creator ON merchandise_products(creator_id);
CREATE INDEX IF NOT EXISTS idx_merchandise_orders_creator ON merchandise_orders(creator_id);
CREATE INDEX IF NOT EXISTS idx_merchandise_orders_customer ON merchandise_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_merchandise_order_items_order ON merchandise_order_items(order_id);

-- Brand Deals
CREATE INDEX IF NOT EXISTS idx_brand_deals_creator ON brand_deals(creator_id);
CREATE INDEX IF NOT EXISTS idx_video_sponsorships_video ON video_sponsorships(video_id);
CREATE INDEX IF NOT EXISTS idx_video_sponsorships_deal ON video_sponsorships(brand_deal_id);

-- Music
CREATE INDEX IF NOT EXISTS idx_music_albums_creator ON music_albums(creator_id);
CREATE INDEX IF NOT EXISTS idx_music_tracks_creator ON music_tracks(creator_id);
CREATE INDEX IF NOT EXISTS idx_music_tracks_album ON music_tracks(album_id);
CREATE INDEX IF NOT EXISTS idx_music_streams_track ON music_streams(track_id);
CREATE INDEX IF NOT EXISTS idx_music_royalties_recipient ON music_royalties(recipient_id);

-- Digital Products & Services
CREATE INDEX IF NOT EXISTS idx_digital_products_creator ON digital_products(creator_id);
CREATE INDEX IF NOT EXISTS idx_digital_product_modules_product ON digital_product_modules(product_id);
CREATE INDEX IF NOT EXISTS idx_digital_product_purchases_product ON digital_product_purchases(product_id);
CREATE INDEX IF NOT EXISTS idx_digital_product_purchases_customer ON digital_product_purchases(customer_id);
CREATE INDEX IF NOT EXISTS idx_services_creator ON services(creator_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_service ON service_bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_customer ON service_bookings(customer_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- AFFILIATION
ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_conversions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can manage own affiliate links"
  ON affiliate_links FOR ALL
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Anyone can view active affiliate links"
  ON affiliate_links FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Anyone can create affiliate clicks"
  ON affiliate_clicks FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Creators can view own conversions"
  ON affiliate_conversions FOR SELECT
  TO authenticated
  USING (
    affiliate_link_id IN (
      SELECT id FROM affiliate_links WHERE creator_id = auth.uid()
    )
  );

-- MERCHANDISING
ALTER TABLE merchandise_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchandise_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchandise_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchandise_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can manage own merchandise"
  ON merchandise_products FOR ALL
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Anyone can view active products"
  ON merchandise_products FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Creators can view own orders"
  ON merchandise_orders FOR SELECT
  TO authenticated
  USING (auth.uid() = creator_id OR auth.uid() = customer_id);

CREATE POLICY "Customers can create orders"
  ON merchandise_orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can view order items of their orders"
  ON merchandise_order_items FOR SELECT
  TO authenticated
  USING (
    order_id IN (
      SELECT id FROM merchandise_orders 
      WHERE customer_id = auth.uid() OR creator_id = auth.uid()
    )
  );

CREATE POLICY "Creators manage own inventory"
  ON merchandise_inventory FOR ALL
  TO authenticated
  USING (
    product_id IN (
      SELECT id FROM merchandise_products WHERE creator_id = auth.uid()
    )
  )
  WITH CHECK (
    product_id IN (
      SELECT id FROM merchandise_products WHERE creator_id = auth.uid()
    )
  );

-- BRAND DEALS
ALTER TABLE brand_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_sponsorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsorship_deliverables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators manage own brand deals"
  ON brand_deals FOR ALL
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Anyone can view video sponsorships"
  ON video_sponsorships FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Creators manage sponsorships for own videos"
  ON video_sponsorships FOR INSERT
  TO authenticated
  WITH CHECK (
    video_id IN (
      SELECT id FROM videos WHERE creator_id = auth.uid()
    )
  );

CREATE POLICY "Creators view own deliverables"
  ON sponsorship_deliverables FOR SELECT
  TO authenticated
  USING (
    brand_deal_id IN (
      SELECT id FROM brand_deals WHERE creator_id = auth.uid()
    )
  );

-- MUSIC
ALTER TABLE music_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE music_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE music_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE music_royalties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators manage own albums"
  ON music_albums FOR ALL
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Anyone can view published albums"
  ON music_albums FOR SELECT
  TO authenticated
  USING (is_published = true OR creator_id = auth.uid());

CREATE POLICY "Creators manage own tracks"
  ON music_tracks FOR ALL
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Anyone can view published tracks"
  ON music_tracks FOR SELECT
  TO authenticated
  USING (is_published = true OR creator_id = auth.uid());

CREATE POLICY "Anyone can create streams"
  ON music_streams FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Recipients view own royalties"
  ON music_royalties FOR SELECT
  TO authenticated
  USING (auth.uid() = recipient_id);

-- DIGITAL PRODUCTS & SERVICES
ALTER TABLE digital_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_product_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_product_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators manage own digital products"
  ON digital_products FOR ALL
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Anyone can view published products"
  ON digital_products FOR SELECT
  TO authenticated
  USING (is_published = true OR creator_id = auth.uid());

CREATE POLICY "Buyers and creators view modules"
  ON digital_product_modules FOR SELECT
  TO authenticated
  USING (
    product_id IN (
      SELECT id FROM digital_products WHERE creator_id = auth.uid()
    )
    OR product_id IN (
      SELECT product_id FROM digital_product_purchases WHERE customer_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own purchases"
  ON digital_product_purchases FOR SELECT
  TO authenticated
  USING (
    auth.uid() = customer_id OR 
    product_id IN (SELECT id FROM digital_products WHERE creator_id = auth.uid())
  );

CREATE POLICY "Users can create purchases"
  ON digital_product_purchases FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Creators manage own services"
  ON services FOR ALL
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Anyone can view active services"
  ON services FOR SELECT
  TO authenticated
  USING (is_active = true OR creator_id = auth.uid());

CREATE POLICY "Users view relevant bookings"
  ON service_bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = customer_id OR auth.uid() = creator_id);

CREATE POLICY "Users can create bookings"
  ON service_bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = customer_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function: Update affiliate link stats on click
CREATE OR REPLACE FUNCTION update_affiliate_link_clicks()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE affiliate_links
  SET total_clicks = total_clicks + 1,
      updated_at = now()
  WHERE id = NEW.affiliate_link_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_affiliate_clicks
  AFTER INSERT ON affiliate_clicks
  FOR EACH ROW
  EXECUTE FUNCTION update_affiliate_link_clicks();

-- Function: Update affiliate link stats on conversion
CREATE OR REPLACE FUNCTION update_affiliate_link_conversions()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE affiliate_links
  SET total_conversions = total_conversions + 1,
      total_revenue = total_revenue + NEW.commission_amount,
      updated_at = now()
  WHERE id = NEW.affiliate_link_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_affiliate_conversions
  AFTER INSERT ON affiliate_conversions
  FOR EACH ROW
  EXECUTE FUNCTION update_affiliate_link_conversions();

-- Function: Update product sales on order completion
CREATE OR REPLACE FUNCTION update_product_sales()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'paid' AND (OLD.status IS NULL OR OLD.status != 'paid') THEN
    UPDATE merchandise_products p
    SET total_sales = total_sales + oi.quantity,
        total_revenue = total_revenue + oi.total_price,
        updated_at = now()
    FROM merchandise_order_items oi
    WHERE oi.order_id = NEW.id
      AND oi.product_id = p.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_product_sales
  AFTER UPDATE ON merchandise_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_product_sales();

-- Function: Update music track streams
CREATE OR REPLACE FUNCTION update_music_track_streams()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_complete THEN
    UPDATE music_tracks
    SET total_streams = total_streams + 1,
        total_revenue = total_revenue + 0.004 -- $0.004 per stream
    WHERE id = NEW.track_id;
    
    -- Update album stats
    UPDATE music_albums
    SET total_streams = total_streams + 1
    WHERE id = (SELECT album_id FROM music_tracks WHERE id = NEW.track_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_music_streams
  AFTER INSERT ON music_streams
  FOR EACH ROW
  EXECUTE FUNCTION update_music_track_streams();

-- Function: Update digital product sales
CREATE OR REPLACE FUNCTION update_digital_product_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE digital_products
  SET total_sales = total_sales + 1,
      total_revenue = total_revenue + NEW.purchase_price,
      updated_at = now()
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_digital_product_sales
  AFTER INSERT ON digital_product_purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_digital_product_stats();

-- Function: Update service booking stats
CREATE OR REPLACE FUNCTION update_service_booking_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
    UPDATE services
    SET total_bookings = total_bookings + 1,
        total_revenue = total_revenue + NEW.price,
        updated_at = now()
    WHERE id = NEW.service_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_service_stats
  AFTER INSERT OR UPDATE ON service_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_service_booking_stats();
