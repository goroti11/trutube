/*
  # Optimize RLS Policies - Part 6

  1. Tables Updated
    - brand_deals (1 policy)
    - video_sponsorships (1 policy)
    - sponsorship_deliverables (1 policy)
    - music_albums (2 policies)
    - music_tracks (2 policies)
    - music_royalties (1 policy)
    - digital_products (2 policies)
    - digital_product_modules (1 policy)
*/

-- Brand Deals
DROP POLICY IF EXISTS "Creators manage own brand deals" ON brand_deals;
CREATE POLICY "Creators manage own brand deals"
  ON brand_deals FOR ALL
  TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

-- Video Sponsorships
DROP POLICY IF EXISTS "Creators manage sponsorships for own videos" ON video_sponsorships;
CREATE POLICY "Creators manage sponsorships for own videos"
  ON video_sponsorships FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = video_sponsorships.video_id
      AND videos.creator_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = video_sponsorships.video_id
      AND videos.creator_id = (SELECT auth.uid())
    )
  );

-- Sponsorship Deliverables
DROP POLICY IF EXISTS "Creators view own deliverables" ON sponsorship_deliverables;
CREATE POLICY "Creators view own deliverables"
  ON sponsorship_deliverables FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brand_deals
      WHERE brand_deals.id = sponsorship_deliverables.brand_deal_id
      AND brand_deals.creator_id = (SELECT auth.uid())
    )
  );

-- Music Albums
DROP POLICY IF EXISTS "Anyone can view published albums" ON music_albums;
CREATE POLICY "Anyone can view published albums"
  ON music_albums FOR SELECT
  TO authenticated
  USING (
    is_published = true 
    OR creator_id = (SELECT auth.uid())
  );

DROP POLICY IF EXISTS "Creators manage own albums" ON music_albums;
CREATE POLICY "Creators manage own albums"
  ON music_albums FOR ALL
  TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

-- Music Tracks
DROP POLICY IF EXISTS "Anyone can view published tracks" ON music_tracks;
CREATE POLICY "Anyone can view published tracks"
  ON music_tracks FOR SELECT
  TO authenticated
  USING (
    is_published = true 
    OR primary_artist_id = (SELECT auth.uid())
  );

DROP POLICY IF EXISTS "Creators manage own tracks" ON music_tracks;
CREATE POLICY "Creators manage own tracks"
  ON music_tracks FOR ALL
  TO authenticated
  USING (primary_artist_id = (SELECT auth.uid()))
  WITH CHECK (primary_artist_id = (SELECT auth.uid()));

-- Music Royalties
DROP POLICY IF EXISTS "Recipients view own royalties" ON music_royalties;
CREATE POLICY "Recipients view own royalties"
  ON music_royalties FOR SELECT
  TO authenticated
  USING (recipient_id = (SELECT auth.uid()));

-- Digital Products
DROP POLICY IF EXISTS "Anyone can view published products" ON digital_products;
CREATE POLICY "Anyone can view published products"
  ON digital_products FOR SELECT
  TO authenticated
  USING (
    is_published = true 
    OR creator_id = (SELECT auth.uid())
  );

DROP POLICY IF EXISTS "Creators manage own digital products" ON digital_products;
CREATE POLICY "Creators manage own digital products"
  ON digital_products FOR ALL
  TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

-- Digital Product Modules
DROP POLICY IF EXISTS "Buyers and creators view modules" ON digital_product_modules;
CREATE POLICY "Buyers and creators view modules"
  ON digital_product_modules FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM digital_products
      WHERE digital_products.id = digital_product_modules.product_id
      AND (
        digital_products.creator_id = (SELECT auth.uid())
        OR EXISTS (
          SELECT 1 FROM digital_product_purchases
          WHERE digital_product_purchases.product_id = digital_products.id
          AND digital_product_purchases.customer_id = (SELECT auth.uid())
        )
      )
    )
  );