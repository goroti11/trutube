/*
  # Consolidate Duplicate Permissive Policies - Part 2

  1. Remaining tables with duplicate permissive SELECT policies
    - profile_reviews, profiles, services, social_links,
      support_leaderboard, user_appearance_settings,
      video_sponsorships, videos, community_premium_pricing
*/

-- profile_reviews: "Users can view own" already covers public reviews via OR, subsumes "Public reviews"
DROP POLICY IF EXISTS "Public reviews are viewable by everyone" ON profile_reviews;

-- profiles: merge duplicate UPDATE policies (identical logic)
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

-- services: merge
DROP POLICY IF EXISTS "Anyone can view active services" ON services;
DROP POLICY IF EXISTS "Creators manage own services" ON services;
CREATE POLICY "Users can view services"
  ON services FOR SELECT TO authenticated
  USING (is_active = true OR creator_id = (SELECT auth.uid()));
CREATE POLICY "Creators can insert services"
  ON services FOR INSERT TO authenticated
  WITH CHECK (creator_id = (SELECT auth.uid()));
CREATE POLICY "Creators can update services"
  ON services FOR UPDATE TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));
CREATE POLICY "Creators can delete services"
  ON services FOR DELETE TO authenticated
  USING (creator_id = (SELECT auth.uid()));

-- social_links: "Users can view own" already includes is_visible=true via OR, subsumes "Visible viewable by everyone"
DROP POLICY IF EXISTS "Visible social links are viewable by everyone" ON social_links;

-- support_leaderboard: "System can manage" is ALL which includes SELECT.
-- "Creator can view own" and "Visible public" are subsumed by the ALL policy's USING condition
-- which already covers creator_id match. But visible=true entries need to be readable by non-owners.
-- Replace all three with clean separate policies.
DROP POLICY IF EXISTS "System can manage leaderboard" ON support_leaderboard;
DROP POLICY IF EXISTS "Creator can view own leaderboard" ON support_leaderboard;
DROP POLICY IF EXISTS "Visible leaderboard entries are public" ON support_leaderboard;
CREATE POLICY "Users can view leaderboard"
  ON support_leaderboard FOR SELECT TO authenticated
  USING (is_visible = true OR creator_id = (SELECT auth.uid()) OR supporter_id = (SELECT auth.uid()));
CREATE POLICY "Users can insert leaderboard entries"
  ON support_leaderboard FOR INSERT TO authenticated
  WITH CHECK (supporter_id = (SELECT auth.uid()) OR creator_id = (SELECT auth.uid()));
CREATE POLICY "Users can update leaderboard entries"
  ON support_leaderboard FOR UPDATE TO authenticated
  USING (supporter_id = (SELECT auth.uid()) OR creator_id = (SELECT auth.uid()))
  WITH CHECK (supporter_id = (SELECT auth.uid()) OR creator_id = (SELECT auth.uid()));
CREATE POLICY "Users can delete leaderboard entries"
  ON support_leaderboard FOR DELETE TO authenticated
  USING (supporter_id = (SELECT auth.uid()) OR creator_id = (SELECT auth.uid()));

-- user_appearance_settings: "gèrent" is ALL which already covers SELECT, making "voient" redundant
DROP POLICY IF EXISTS "Utilisateurs voient leur apparence" ON user_appearance_settings;

-- video_sponsorships: "Anyone can view" is USING(true) which subsumes "Creators manage" SELECT.
-- "Creators manage" is ALL. Replace with clean separate policies.
DROP POLICY IF EXISTS "Anyone can view video sponsorships" ON video_sponsorships;
DROP POLICY IF EXISTS "Creators manage sponsorships for own videos" ON video_sponsorships;
CREATE POLICY "Users can view video sponsorships"
  ON video_sponsorships FOR SELECT TO authenticated
  USING (true);
CREATE POLICY "Creators can insert video sponsorships"
  ON video_sponsorships FOR INSERT TO authenticated
  WITH CHECK (EXISTS ( SELECT 1 FROM videos WHERE videos.id = video_sponsorships.video_id AND videos.creator_id = (SELECT auth.uid())));
CREATE POLICY "Creators can update video sponsorships"
  ON video_sponsorships FOR UPDATE TO authenticated
  USING (EXISTS ( SELECT 1 FROM videos WHERE videos.id = video_sponsorships.video_id AND videos.creator_id = (SELECT auth.uid())))
  WITH CHECK (EXISTS ( SELECT 1 FROM videos WHERE videos.id = video_sponsorships.video_id AND videos.creator_id = (SELECT auth.uid())));
CREATE POLICY "Creators can delete video sponsorships"
  ON video_sponsorships FOR DELETE TO authenticated
  USING (EXISTS ( SELECT 1 FROM videos WHERE videos.id = video_sponsorships.video_id AND videos.creator_id = (SELECT auth.uid())));

-- videos: merge two SELECT policies into one
DROP POLICY IF EXISTS "Anyone can view public videos" ON videos;
DROP POLICY IF EXISTS "Creators can view own unpublished videos" ON videos;
CREATE POLICY "Users can view videos"
  ON videos FOR SELECT TO authenticated
  USING (
    (SELECT auth.uid()) = creator_id
    OR (is_published = true AND processing_status = 'completed'::text AND is_masked = false)
  );

-- community_premium_pricing: "Créateurs gèrent" is ALL for authenticated,
-- "Prix premium publics" is SELECT for public role. These target different roles so they don't conflict.
-- No change needed for community_premium_pricing since roles differ (authenticated vs public).