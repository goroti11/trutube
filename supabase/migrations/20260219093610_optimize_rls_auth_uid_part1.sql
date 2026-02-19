/*
  # Optimize RLS Policies - Part 1: Auth Function Performance

  1. Performance Optimization
    - Replace auth.uid() with (SELECT auth.uid()) in RLS policies
    - This prevents re-evaluation of auth functions for each row
    - Tables: videos, partner_program_acceptances, monetization_suspensions,
      revenue_holds, communities, community_members, marketplace_reviews

  2. Important Notes
    - No data changes, only policy definition updates
    - Existing access patterns are preserved exactly
*/

-- videos: "Creators can view own unpublished videos"
DROP POLICY IF EXISTS "Creators can view own unpublished videos" ON videos;
CREATE POLICY "Creators can view own unpublished videos"
  ON videos FOR SELECT TO authenticated
  USING (((SELECT auth.uid()) = creator_id) OR ((is_published = true) AND (processing_status = 'completed'::text)));

-- partner_program_acceptances
DROP POLICY IF EXISTS "Users can view own acceptances" ON partner_program_acceptances;
CREATE POLICY "Users can view own acceptances"
  ON partner_program_acceptances FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own acceptances" ON partner_program_acceptances;
CREATE POLICY "Users can insert own acceptances"
  ON partner_program_acceptances FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- monetization_suspensions
DROP POLICY IF EXISTS "Users can view own suspensions" ON monetization_suspensions;
CREATE POLICY "Users can view own suspensions"
  ON monetization_suspensions FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own appeal" ON monetization_suspensions;
CREATE POLICY "Users can update own appeal"
  ON monetization_suspensions FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK (((SELECT auth.uid()) = user_id) AND (appeal_submitted = true));

-- revenue_holds
DROP POLICY IF EXISTS "Users can view own revenue holds" ON revenue_holds;
CREATE POLICY "Users can view own revenue holds"
  ON revenue_holds FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- communities
DROP POLICY IF EXISTS "Anyone can view public communities" ON communities;
CREATE POLICY "Anyone can view public communities"
  ON communities FOR SELECT TO authenticated
  USING ((is_active = true) AND ((is_premium = false) OR ((is_premium = true) AND (is_user_premium((SELECT auth.uid())) OR ((SELECT auth.uid()) = creator_id))) OR is_community_member(id, (SELECT auth.uid()))));

DROP POLICY IF EXISTS "Users can create communities" ON communities;
CREATE POLICY "Users can create communities"
  ON communities FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = creator_id);

DROP POLICY IF EXISTS "Creators can update own communities" ON communities;
CREATE POLICY "Creators can update own communities"
  ON communities FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = creator_id)
  WITH CHECK ((SELECT auth.uid()) = creator_id);

DROP POLICY IF EXISTS "Creators can delete own communities" ON communities;
CREATE POLICY "Creators can delete own communities"
  ON communities FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = creator_id);

-- community_members
DROP POLICY IF EXISTS "Members can view own membership" ON community_members;
CREATE POLICY "Members can view own membership"
  ON community_members FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can join communities" ON community_members;
CREATE POLICY "Users can join communities"
  ON community_members FOR INSERT TO authenticated
  WITH CHECK (((SELECT auth.uid()) = user_id) AND ((NOT (EXISTS ( SELECT 1 FROM communities WHERE ((communities.id = community_members.community_id) AND (communities.is_premium = true))))) OR is_user_premium((SELECT auth.uid())) OR (EXISTS ( SELECT 1 FROM communities WHERE ((communities.id = community_members.community_id) AND (communities.creator_id = (SELECT auth.uid())))))));

DROP POLICY IF EXISTS "Users can leave communities" ON community_members;
CREATE POLICY "Users can leave communities"
  ON community_members FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- marketplace_reviews
DROP POLICY IF EXISTS "Anyone views public reviews" ON marketplace_reviews;
CREATE POLICY "Anyone views public reviews"
  ON marketplace_reviews FOR SELECT TO authenticated
  USING ((is_public = true) OR (reviewer_id = (SELECT auth.uid())) OR (reviewed_user_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Reviewers post own reviews" ON marketplace_reviews;
CREATE POLICY "Reviewers post own reviews"
  ON marketplace_reviews FOR INSERT TO authenticated
  WITH CHECK (reviewer_id = (SELECT auth.uid()));