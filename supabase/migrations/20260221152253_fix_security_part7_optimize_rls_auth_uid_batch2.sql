/*
  # Security Fix Part 7: Optimize RLS Policies - Auth UID (Batch 2)

  This migration completes the optimization of RLS policies using SELECT subqueries.

  ## Policies Optimized (Batch 2 of 2)
  - affiliate_links
  - affiliate_clicks
  - merchandise_products
  - music_albums
  - music_tracks
  - music_streams
  - digital_products
  - services
  - user_appearance_settings

  ## Performance Impact
  - Completes auth.uid() optimization across all policies
  - Ensures consistent high performance for all RLS checks
*/

-- 1. affiliate_links
DROP POLICY IF EXISTS "Users can view active links and creators manage own" ON affiliate_links;

CREATE POLICY "Users can view active links and creators manage own"
  ON affiliate_links FOR SELECT
  TO authenticated
  USING (
    (is_active = true) OR 
    (creator_id = (SELECT auth.uid()))
  );

-- 2. affiliate_clicks
DROP POLICY IF EXISTS "Users can create affiliate clicks" ON affiliate_clicks;

CREATE POLICY "Users can create affiliate clicks"
  ON affiliate_clicks FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid()) OR
    user_id IS NULL
  );

-- 3. merchandise_products
DROP POLICY IF EXISTS "Users view active products and creators manage own" ON merchandise_products;

CREATE POLICY "Users view active products and creators manage own"
  ON merchandise_products FOR SELECT
  TO authenticated
  USING (
    (is_active = true) OR
    (creator_id = (SELECT auth.uid()))
  );

-- 4. music_albums
DROP POLICY IF EXISTS "Users view published albums and creators manage own" ON music_albums;

CREATE POLICY "Users view published albums and creators manage own"
  ON music_albums FOR SELECT
  TO authenticated
  USING (
    (is_published = true) OR
    (creator_id = (SELECT auth.uid()))
  );

-- 5. music_tracks
DROP POLICY IF EXISTS "Users view published tracks and creators manage own" ON music_tracks;

CREATE POLICY "Users view published tracks and creators manage own"
  ON music_tracks FOR SELECT
  TO authenticated
  USING (
    (is_published = true) OR
    (creator_id = (SELECT auth.uid()))
  );

-- 6. music_streams
DROP POLICY IF EXISTS "Users can create music streams" ON music_streams;

CREATE POLICY "Users can create music streams"
  ON music_streams FOR INSERT
  TO authenticated
  WITH CHECK (
    listener_id = (SELECT auth.uid()) OR
    listener_id IS NULL
  );

-- 7. digital_products
DROP POLICY IF EXISTS "Users view published products and creators manage own" ON digital_products;

CREATE POLICY "Users view published products and creators manage own"
  ON digital_products FOR SELECT
  TO authenticated
  USING (
    (is_published = true) OR
    (creator_id = (SELECT auth.uid()))
  );

-- 8. services
DROP POLICY IF EXISTS "Users view active services and creators manage own" ON services;

CREATE POLICY "Users view active services and creators manage own"
  ON services FOR SELECT
  TO authenticated
  USING (
    (is_active = true) OR
    (creator_id = (SELECT auth.uid()))
  );

-- 9. user_appearance_settings
DROP POLICY IF EXISTS "Users manage own appearance" ON user_appearance_settings;

CREATE POLICY "Users manage own appearance"
  ON user_appearance_settings FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));
