/*
  # Security Fix Part 2: Consolidate Multiple Permissive RLS Policies

  This migration consolidates tables that have multiple permissive policies for the same action.
  Multiple permissive policies create redundancy and can lead to security gaps.

  ## Tables Fixed
  1. affiliate_links - Merge SELECT policies
  2. community_members - Merge SELECT policies
  3. community_premium_pricing - Merge SELECT policies
  4. creator_support - Merge SELECT policies
  5. digital_products - Merge SELECT policies
  6. merchandise_products - Merge SELECT policies
  7. music_albums - Merge SELECT policies
  8. music_tracks - Merge SELECT policies
  9. profile_reviews - Merge SELECT policies
  10. services - Merge SELECT policies
  11. social_links - Merge SELECT policies
  12. support_leaderboard - Merge SELECT policies
  13. user_appearance_settings - Merge SELECT policies
  14. video_sponsorships - Merge SELECT policies
  15. videos - Merge SELECT policies

  ## Strategy
  - Drop existing permissive policies
  - Create single consolidated policy with OR conditions
  - Maintain same access levels
*/

-- 1. affiliate_links
DROP POLICY IF EXISTS "Anyone can view active affiliate links" ON affiliate_links;
DROP POLICY IF EXISTS "Creators can manage own affiliate links" ON affiliate_links;

CREATE POLICY "Users can view active links and creators manage own"
  ON affiliate_links FOR SELECT
  TO authenticated
  USING (
    (is_active = true) OR 
    (creator_id = auth.uid())
  );

-- 2. community_members
DROP POLICY IF EXISTS "Anyone can view community members" ON community_members;
DROP POLICY IF EXISTS "Members can view own membership" ON community_members;

CREATE POLICY "Users can view members and own membership"
  ON community_members FOR SELECT
  TO authenticated
  USING (
    true OR
    (user_id = auth.uid())
  );

-- Simplified: since "Anyone can view" already covers everything
DROP POLICY IF EXISTS "Users can view members and own membership" ON community_members;

CREATE POLICY "Anyone can view community members"
  ON community_members FOR SELECT
  TO authenticated
  USING (true);

-- 3. community_premium_pricing
DROP POLICY IF EXISTS "Créateurs gèrent prix communautés" ON community_premium_pricing;
DROP POLICY IF EXISTS "Prix premium communautés publics" ON community_premium_pricing;

CREATE POLICY "Public pricing and creators manage own"
  ON community_premium_pricing FOR SELECT
  TO authenticated
  USING (
    true OR
    EXISTS (
      SELECT 1 FROM communities
      WHERE communities.id = community_premium_pricing.community_id
      AND communities.creator_id = auth.uid()
    )
  );

-- Simplified: since public covers everything
DROP POLICY IF EXISTS "Public pricing and creators manage own" ON community_premium_pricing;

CREATE POLICY "Public premium pricing viewable"
  ON community_premium_pricing FOR SELECT
  TO authenticated
  USING (true);

-- 4. creator_support
DROP POLICY IF EXISTS "Public supports are viewable by everyone" ON creator_support;
DROP POLICY IF EXISTS "Users can view own supports" ON creator_support;

CREATE POLICY "Users view public supports and own"
  ON creator_support FOR SELECT
  TO authenticated
  USING (
    (is_public = true) OR
    (supporter_id = auth.uid()) OR
    (creator_id = auth.uid())
  );

-- 5. digital_products
DROP POLICY IF EXISTS "Anyone can view published products" ON digital_products;
DROP POLICY IF EXISTS "Creators manage own digital products" ON digital_products;

CREATE POLICY "Users view published products and creators manage own"
  ON digital_products FOR SELECT
  TO authenticated
  USING (
    (is_published = true) OR
    (creator_id = auth.uid())
  );

-- 6. merchandise_products
DROP POLICY IF EXISTS "Anyone can view active products" ON merchandise_products;
DROP POLICY IF EXISTS "Creators can manage own merchandise" ON merchandise_products;

CREATE POLICY "Users view active products and creators manage own"
  ON merchandise_products FOR SELECT
  TO authenticated
  USING (
    (is_active = true) OR
    (creator_id = auth.uid())
  );

-- 7. music_albums
DROP POLICY IF EXISTS "Anyone can view published albums" ON music_albums;
DROP POLICY IF EXISTS "Creators manage own albums" ON music_albums;

CREATE POLICY "Users view published albums and creators manage own"
  ON music_albums FOR SELECT
  TO authenticated
  USING (
    (is_published = true) OR
    (creator_id = auth.uid())
  );

-- 8. music_tracks
DROP POLICY IF EXISTS "Anyone can view published tracks" ON music_tracks;
DROP POLICY IF EXISTS "Creators manage own tracks" ON music_tracks;

CREATE POLICY "Users view published tracks and creators manage own"
  ON music_tracks FOR SELECT
  TO authenticated
  USING (
    (is_published = true) OR
    (creator_id = auth.uid())
  );

-- 9. profile_reviews
DROP POLICY IF EXISTS "Public reviews are viewable by everyone" ON profile_reviews;
DROP POLICY IF EXISTS "Users can view own reviews" ON profile_reviews;

CREATE POLICY "Users view public reviews and own"
  ON profile_reviews FOR SELECT
  TO authenticated
  USING (
    (is_public = true) OR
    (reviewer_id = auth.uid()) OR
    (profile_id = auth.uid())
  );

-- 10. services
DROP POLICY IF EXISTS "Anyone can view active services" ON services;
DROP POLICY IF EXISTS "Creators manage own services" ON services;

CREATE POLICY "Users view active services and creators manage own"
  ON services FOR SELECT
  TO authenticated
  USING (
    (is_active = true) OR
    (creator_id = auth.uid())
  );

-- 11. social_links
DROP POLICY IF EXISTS "Users can view own social links" ON social_links;
DROP POLICY IF EXISTS "Visible social links are viewable by everyone" ON social_links;

CREATE POLICY "Users view visible links and own"
  ON social_links FOR SELECT
  TO authenticated
  USING (
    (is_visible = true) OR
    (user_id = auth.uid())
  );

-- 12. support_leaderboard
DROP POLICY IF EXISTS "Creator can view own leaderboard" ON support_leaderboard;
DROP POLICY IF EXISTS "System can manage leaderboard" ON support_leaderboard;
DROP POLICY IF EXISTS "Visible leaderboard entries are public" ON support_leaderboard;

CREATE POLICY "Users view visible entries and creators view own"
  ON support_leaderboard FOR SELECT
  TO authenticated
  USING (
    (is_visible = true) OR
    (creator_id = auth.uid())
  );

-- 13. user_appearance_settings
DROP POLICY IF EXISTS "Utilisateurs gèrent leur apparence" ON user_appearance_settings;
DROP POLICY IF EXISTS "Utilisateurs voient leur apparence" ON user_appearance_settings;

CREATE POLICY "Users manage own appearance"
  ON user_appearance_settings FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- 14. video_sponsorships
DROP POLICY IF EXISTS "Anyone can view video sponsorships" ON video_sponsorships;
DROP POLICY IF EXISTS "Creators manage sponsorships for own videos" ON video_sponsorships;

CREATE POLICY "Users view sponsorships and creators manage own"
  ON video_sponsorships FOR SELECT
  TO authenticated
  USING (
    true OR
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.id = video_sponsorships.video_id
      AND videos.creator_id = auth.uid()
    )
  );

-- Simplified: since public covers everything
DROP POLICY IF EXISTS "Users view sponsorships and creators manage own" ON video_sponsorships;

CREATE POLICY "Anyone can view video sponsorships"
  ON video_sponsorships FOR SELECT
  TO authenticated
  USING (true);

-- 15. videos
DROP POLICY IF EXISTS "Anyone can view public videos" ON videos;
DROP POLICY IF EXISTS "Creators can view own unpublished videos" ON videos;

CREATE POLICY "Users view published videos and creators view own"
  ON videos FOR SELECT
  TO authenticated
  USING (
    (is_published = true) OR
    (creator_id = auth.uid())
  );
