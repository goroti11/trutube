/*
  # Optimize RLS Policies - Part 6: Music and Digital Products

  1. Performance Improvements
    - Wraps auth.uid() calls in SELECT to prevent re-evaluation per row

  2. Tables Affected (Part 6)
    - music_albums, music_tracks, music_royalties
    - digital_products, digital_product_modules, digital_product_purchases
    - services, service_bookings
    - creator_monetization_status, revenue_transactions
*/

-- music_albums policies
DROP POLICY IF EXISTS "Creators manage own albums" ON public.music_albums;
CREATE POLICY "Creators manage own albums"
  ON public.music_albums
  FOR ALL
  TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Anyone can view published albums" ON public.music_albums;
CREATE POLICY "Anyone can view published albums"
  ON public.music_albums
  FOR SELECT
  TO authenticated
  USING (
    is_published = true
    OR creator_id = (SELECT auth.uid())
  );

-- music_tracks policies
DROP POLICY IF EXISTS "Creators manage own tracks" ON public.music_tracks;
CREATE POLICY "Creators manage own tracks"
  ON public.music_tracks
  FOR ALL
  TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Anyone can view published tracks" ON public.music_tracks;
CREATE POLICY "Anyone can view published tracks"
  ON public.music_tracks
  FOR SELECT
  TO authenticated
  USING (
    is_published = true
    OR creator_id = (SELECT auth.uid())
  );

-- music_royalties policies
DROP POLICY IF EXISTS "Recipients view own royalties" ON public.music_royalties;
CREATE POLICY "Recipients view own royalties"
  ON public.music_royalties
  FOR SELECT
  TO authenticated
  USING (recipient_id = (SELECT auth.uid()));

-- digital_products policies
DROP POLICY IF EXISTS "Creators manage own digital products" ON public.digital_products;
CREATE POLICY "Creators manage own digital products"
  ON public.digital_products
  FOR ALL
  TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Anyone can view published products" ON public.digital_products;
CREATE POLICY "Anyone can view published products"
  ON public.digital_products
  FOR SELECT
  TO authenticated
  USING (
    is_published = true
    OR creator_id = (SELECT auth.uid())
  );

-- digital_product_modules policies
DROP POLICY IF EXISTS "Buyers and creators view modules" ON public.digital_product_modules;
CREATE POLICY "Buyers and creators view modules"
  ON public.digital_product_modules
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.digital_products
      WHERE digital_products.id = digital_product_modules.product_id
      AND (
        digital_products.creator_id = (SELECT auth.uid())
        OR EXISTS (
          SELECT 1 FROM public.digital_product_purchases
          WHERE digital_product_purchases.product_id = digital_products.id
          AND digital_product_purchases.customer_id = (SELECT auth.uid())
        )
      )
    )
  );

-- digital_product_purchases policies
DROP POLICY IF EXISTS "Users can view own purchases" ON public.digital_product_purchases;
CREATE POLICY "Users can view own purchases"
  ON public.digital_product_purchases
  FOR SELECT
  TO authenticated
  USING (customer_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can create purchases" ON public.digital_product_purchases;
CREATE POLICY "Users can create purchases"
  ON public.digital_product_purchases
  FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = (SELECT auth.uid()));

-- services policies
DROP POLICY IF EXISTS "Creators manage own services" ON public.services;
CREATE POLICY "Creators manage own services"
  ON public.services
  FOR ALL
  TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Anyone can view active services" ON public.services;
CREATE POLICY "Anyone can view active services"
  ON public.services
  FOR SELECT
  TO authenticated
  USING (
    is_active = true
    OR creator_id = (SELECT auth.uid())
  );

-- service_bookings policies
DROP POLICY IF EXISTS "Users view relevant bookings" ON public.service_bookings;
CREATE POLICY "Users view relevant bookings"
  ON public.service_bookings
  FOR SELECT
  TO authenticated
  USING (
    customer_id = (SELECT auth.uid())
    OR creator_id = (SELECT auth.uid())
  );

DROP POLICY IF EXISTS "Users can create bookings" ON public.service_bookings;
CREATE POLICY "Users can create bookings"
  ON public.service_bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = (SELECT auth.uid()));

-- creator_monetization_status policies
DROP POLICY IF EXISTS "Users can view own monetization status" ON public.creator_monetization_status;
CREATE POLICY "Users can view own monetization status"
  ON public.creator_monetization_status
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own monetization status" ON public.creator_monetization_status;
CREATE POLICY "Users can update own monetization status"
  ON public.creator_monetization_status
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert own monetization status" ON public.creator_monetization_status;
CREATE POLICY "Users can insert own monetization status"
  ON public.creator_monetization_status
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

-- revenue_transactions policies
DROP POLICY IF EXISTS "Users can view own revenue transactions" ON public.revenue_transactions;
CREATE POLICY "Users can view own revenue transactions"
  ON public.revenue_transactions
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));
