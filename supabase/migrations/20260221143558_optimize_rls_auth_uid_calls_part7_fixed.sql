/*
  # Optimize RLS Policies - Part 7: Community and Final Tables (Fixed)

  1. Performance Improvements
    - Wraps auth.uid() calls in SELECT to prevent re-evaluation per row

  2. Tables Affected (Part 7)
    - partner_program_acceptances, monetization_suspensions, revenue_holds
    - post_reactions, community_members, community_posts, post_comments
    - poll_votes, trucoin_wallets, trucoin_transactions
    - premium_access, profiles, communities
    - community_premium_pricing, user_appearance_settings
*/

-- partner_program_acceptances policies
DROP POLICY IF EXISTS "Users can view own acceptances" ON public.partner_program_acceptances;
CREATE POLICY "Users can view own acceptances"
  ON public.partner_program_acceptances
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert own acceptances" ON public.partner_program_acceptances;
CREATE POLICY "Users can insert own acceptances"
  ON public.partner_program_acceptances
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

-- monetization_suspensions policies
DROP POLICY IF EXISTS "Users can view own suspensions" ON public.monetization_suspensions;
CREATE POLICY "Users can view own suspensions"
  ON public.monetization_suspensions
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own appeal" ON public.monetization_suspensions;
CREATE POLICY "Users can update own appeal"
  ON public.monetization_suspensions
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- revenue_holds policies
DROP POLICY IF EXISTS "Users can view own revenue holds" ON public.revenue_holds;
CREATE POLICY "Users can view own revenue holds"
  ON public.revenue_holds
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- post_reactions policies
DROP POLICY IF EXISTS "Users can add reactions" ON public.post_reactions;
CREATE POLICY "Users can add reactions"
  ON public.post_reactions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can remove own reactions" ON public.post_reactions;
CREATE POLICY "Users can remove own reactions"
  ON public.post_reactions
  FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- community_members policies
DROP POLICY IF EXISTS "Members can view own membership" ON public.community_members;
CREATE POLICY "Members can view own membership"
  ON public.community_members
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can join communities" ON public.community_members;
CREATE POLICY "Users can join communities"
  ON public.community_members
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can leave communities" ON public.community_members;
CREATE POLICY "Users can leave communities"
  ON public.community_members
  FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- community_posts policies
DROP POLICY IF EXISTS "Authors can update own posts" ON public.community_posts;
CREATE POLICY "Authors can update own posts"
  ON public.community_posts
  FOR UPDATE
  TO authenticated
  USING (author_id = (SELECT auth.uid()))
  WITH CHECK (author_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Anyone can view approved public posts" ON public.community_posts;
CREATE POLICY "Anyone can view approved public posts"
  ON public.community_posts
  FOR SELECT
  TO authenticated
  USING (
    moderation_status = 'approved'
    OR author_id = (SELECT auth.uid())
  );

DROP POLICY IF EXISTS "Users can create posts" ON public.community_posts;
CREATE POLICY "Users can create posts"
  ON public.community_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (author_id = (SELECT auth.uid()));

-- post_comments policies
DROP POLICY IF EXISTS "Users can create comments" ON public.post_comments;
CREATE POLICY "Users can create comments"
  ON public.post_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (author_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Authors can update own comments" ON public.post_comments;
CREATE POLICY "Authors can update own comments"
  ON public.post_comments
  FOR UPDATE
  TO authenticated
  USING (author_id = (SELECT auth.uid()))
  WITH CHECK (author_id = (SELECT auth.uid()));

-- poll_votes policies
DROP POLICY IF EXISTS "Users can vote" ON public.poll_votes;
CREATE POLICY "Users can vote"
  ON public.poll_votes
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

-- trucoin_wallets policies
DROP POLICY IF EXISTS "Users can view own wallet" ON public.trucoin_wallets;
CREATE POLICY "Users can view own wallet"
  ON public.trucoin_wallets
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- trucoin_transactions policies
DROP POLICY IF EXISTS "Users can view own transactions" ON public.trucoin_transactions;
CREATE POLICY "Users can view own transactions"
  ON public.trucoin_transactions
  FOR SELECT
  TO authenticated
  USING (
    from_user_id = (SELECT auth.uid())
    OR to_user_id = (SELECT auth.uid())
  );

-- premium_access policies
DROP POLICY IF EXISTS "Users can view own premium access" ON public.premium_access;
CREATE POLICY "Users can view own premium access"
  ON public.premium_access
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- profiles policies
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = (SELECT auth.uid()));

-- communities policies
DROP POLICY IF EXISTS "Users can create communities" ON public.communities;
CREATE POLICY "Users can create communities"
  ON public.communities
  FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Creators can update own communities" ON public.communities;
CREATE POLICY "Creators can update own communities"
  ON public.communities
  FOR UPDATE
  TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Creators can delete own communities" ON public.communities;
CREATE POLICY "Creators can delete own communities"
  ON public.communities
  FOR DELETE
  TO authenticated
  USING (creator_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Anyone can view public communities" ON public.communities;
CREATE POLICY "Anyone can view public communities"
  ON public.communities
  FOR SELECT
  TO authenticated
  USING (
    is_active = true
    OR creator_id = (SELECT auth.uid())
  );

-- community_premium_pricing policies
DROP POLICY IF EXISTS "Créateurs gèrent prix communautés" ON public.community_premium_pricing;
CREATE POLICY "Créateurs gèrent prix communautés"
  ON public.community_premium_pricing
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.communities
      WHERE communities.id = community_premium_pricing.community_id
      AND communities.creator_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.communities
      WHERE communities.id = community_premium_pricing.community_id
      AND communities.creator_id = (SELECT auth.uid())
    )
  );

-- user_appearance_settings policies
DROP POLICY IF EXISTS "Utilisateurs voient leur apparence" ON public.user_appearance_settings;
CREATE POLICY "Utilisateurs voient leur apparence"
  ON public.user_appearance_settings
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Utilisateurs gèrent leur apparence" ON public.user_appearance_settings;
CREATE POLICY "Utilisateurs gèrent leur apparence"
  ON public.user_appearance_settings
  FOR ALL
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));
