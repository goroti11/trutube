/*
  # Consolidate Duplicate Permissive Policies

  1. Security & Performance Fix
    - Merge multiple permissive SELECT policies into single consolidated policies
    - Having multiple permissive policies for the same role+action causes OR evaluation
      which is harder to audit and can have unexpected access patterns

  2. Tables Consolidated
    - affiliate_links: merge "Anyone can view active" + "Creators manage" SELECT
    - community_members: merge "Anyone can view" + "Members can view own"
    - creator_channels: merge "Owner can read own" + "Public can read public"
    - creator_support: merge "Public supports viewable" + "Users can view own"
    - digital_products: merge "Anyone can view published" + "Creators manage" SELECT
    - merchandise_products: merge "Anyone can view active" + "Creators manage" SELECT
    - music_albums: merge "Anyone can view published" + "Creators manage" SELECT
    - music_tracks: merge "Anyone can view published" + "Creators manage" SELECT
    - profile_reviews: merge "Public reviews viewable" + "Users can view own"
    - profiles: merge duplicate UPDATE policies
    - services: merge "Anyone can view active" + "Creators manage" SELECT
    - social_links: merge "Users can view own" + "Visible viewable by everyone"
    - support_leaderboard: merge "Creator can view own" + "System can manage" + "Visible public"
    - user_appearance_settings: merge "gèrent" ALL + "voient" SELECT
    - video_sponsorships: merge "Anyone can view" + "Creators manage" SELECT
    - videos: merge "Anyone can view public" + "Creators can view own unpublished"
*/

-- affiliate_links: "Creators manage" is ALL so it already covers SELECT for owners.
-- Drop the narrow "Anyone can view active" and replace with a consolidated SELECT.
DROP POLICY IF EXISTS "Anyone can view active affiliate links" ON affiliate_links;
DROP POLICY IF EXISTS "Creators can manage own affiliate links" ON affiliate_links;
CREATE POLICY "Users can view affiliate links"
  ON affiliate_links FOR SELECT TO authenticated
  USING (is_active = true OR creator_id = (SELECT auth.uid()));
CREATE POLICY "Creators can manage own affiliate links"
  ON affiliate_links FOR INSERT TO authenticated
  WITH CHECK (creator_id = (SELECT auth.uid()));
CREATE POLICY "Creators can update own affiliate links"
  ON affiliate_links FOR UPDATE TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));
CREATE POLICY "Creators can delete own affiliate links"
  ON affiliate_links FOR DELETE TO authenticated
  USING (creator_id = (SELECT auth.uid()));

-- community_members: "Anyone can view" is USING(true) which already subsumes "Members can view own"
DROP POLICY IF EXISTS "Members can view own membership" ON community_members;

-- creator_channels: merge into one SELECT
DROP POLICY IF EXISTS "Owner can read own channels" ON creator_channels;
DROP POLICY IF EXISTS "Public can read public channels" ON creator_channels;
CREATE POLICY "Users can read channels"
  ON creator_channels FOR SELECT TO authenticated
  USING (visibility = 'public'::text OR (SELECT auth.uid()) = user_id);

-- creator_support: "Users can view own" already includes is_public=true, so it subsumes "Public supports"
DROP POLICY IF EXISTS "Public supports are viewable by everyone" ON creator_support;

-- digital_products: "Anyone can view published" already includes creator_id check, subsumes "Creators manage" SELECT
DROP POLICY IF EXISTS "Creators manage own digital products" ON digital_products;
DROP POLICY IF EXISTS "Anyone can view published products" ON digital_products;
CREATE POLICY "Users can view digital products"
  ON digital_products FOR SELECT TO authenticated
  USING (is_published = true OR creator_id = (SELECT auth.uid()));
CREATE POLICY "Creators can insert digital products"
  ON digital_products FOR INSERT TO authenticated
  WITH CHECK (creator_id = (SELECT auth.uid()));
CREATE POLICY "Creators can update digital products"
  ON digital_products FOR UPDATE TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));
CREATE POLICY "Creators can delete digital products"
  ON digital_products FOR DELETE TO authenticated
  USING (creator_id = (SELECT auth.uid()));

-- merchandise_products: merge
DROP POLICY IF EXISTS "Anyone can view active products" ON merchandise_products;
DROP POLICY IF EXISTS "Creators can manage own merchandise" ON merchandise_products;
CREATE POLICY "Users can view merchandise"
  ON merchandise_products FOR SELECT TO authenticated
  USING (is_active = true OR creator_id = (SELECT auth.uid()));
CREATE POLICY "Creators can insert merchandise"
  ON merchandise_products FOR INSERT TO authenticated
  WITH CHECK (creator_id = (SELECT auth.uid()));
CREATE POLICY "Creators can update merchandise"
  ON merchandise_products FOR UPDATE TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));
CREATE POLICY "Creators can delete merchandise"
  ON merchandise_products FOR DELETE TO authenticated
  USING (creator_id = (SELECT auth.uid()));

-- music_albums: merge
DROP POLICY IF EXISTS "Anyone can view published albums" ON music_albums;
DROP POLICY IF EXISTS "Creators manage own albums" ON music_albums;
CREATE POLICY "Users can view albums"
  ON music_albums FOR SELECT TO authenticated
  USING (is_published = true OR creator_id = (SELECT auth.uid()));
CREATE POLICY "Creators can insert albums"
  ON music_albums FOR INSERT TO authenticated
  WITH CHECK (creator_id = (SELECT auth.uid()));
CREATE POLICY "Creators can update albums"
  ON music_albums FOR UPDATE TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));
CREATE POLICY "Creators can delete albums"
  ON music_albums FOR DELETE TO authenticated
  USING (creator_id = (SELECT auth.uid()));

-- music_tracks: merge
DROP POLICY IF EXISTS "Anyone can view published tracks" ON music_tracks;
DROP POLICY IF EXISTS "Creators manage own tracks" ON music_tracks;
CREATE POLICY "Users can view tracks"
  ON music_tracks FOR SELECT TO authenticated
  USING (is_published = true OR primary_artist_id = (SELECT auth.uid()));
CREATE POLICY "Creators can insert tracks"
  ON music_tracks FOR INSERT TO authenticated
  WITH CHECK (primary_artist_id = (SELECT auth.uid()));
CREATE POLICY "Creators can update tracks"
  ON music_tracks FOR UPDATE TO authenticated
  USING (primary_artist_id = (SELECT auth.uid()))
  WITH CHECK (primary_artist_id = (SELECT auth.uid()));
CREATE POLICY "Creators can delete tracks"
  ON music_tracks FOR DELETE TO authenticated
  USING (primary_artist_id = (SELECT auth.uid()));