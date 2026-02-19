/*
  # Optimize RLS Policies - Part 2: Community Posts, Comments, Reactions, Votes, Wallets

  1. Performance Optimization
    - Replace auth.uid() with (SELECT auth.uid()) in RLS policies
    - Tables: community_posts, post_comments, post_reactions, poll_votes,
      trucoin_wallets, trucoin_transactions, premium_access,
      community_premium_pricing, user_appearance_settings
*/

-- community_posts
DROP POLICY IF EXISTS "Anyone can view approved public posts" ON community_posts;
CREATE POLICY "Anyone can view approved public posts"
  ON community_posts FOR SELECT TO authenticated
  USING ((moderation_status = 'approved'::moderation_status) AND (deleted_at IS NULL) AND ((visibility = 'public'::post_visibility) OR ((SELECT auth.uid()) = author_id) OR ((visibility = 'members'::post_visibility) AND is_community_member(community_id, (SELECT auth.uid()))) OR ((visibility = 'premium'::post_visibility) AND is_user_premium((SELECT auth.uid())))));

DROP POLICY IF EXISTS "Users can create posts" ON community_posts;
CREATE POLICY "Users can create posts"
  ON community_posts FOR INSERT TO authenticated
  WITH CHECK (((SELECT auth.uid()) = author_id) AND is_community_member(community_id, (SELECT auth.uid())));

DROP POLICY IF EXISTS "Authors can update own posts" ON community_posts;
CREATE POLICY "Authors can update own posts"
  ON community_posts FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = author_id)
  WITH CHECK ((SELECT auth.uid()) = author_id);

-- post_comments
DROP POLICY IF EXISTS "Users can create comments" ON post_comments;
CREATE POLICY "Users can create comments"
  ON post_comments FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = author_id);

DROP POLICY IF EXISTS "Authors can update own comments" ON post_comments;
CREATE POLICY "Authors can update own comments"
  ON post_comments FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = author_id)
  WITH CHECK ((SELECT auth.uid()) = author_id);

-- post_reactions
DROP POLICY IF EXISTS "Users can add reactions" ON post_reactions;
CREATE POLICY "Users can add reactions"
  ON post_reactions FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can remove own reactions" ON post_reactions;
CREATE POLICY "Users can remove own reactions"
  ON post_reactions FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- poll_votes
DROP POLICY IF EXISTS "Users can vote" ON poll_votes;
CREATE POLICY "Users can vote"
  ON poll_votes FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- trucoin_wallets
DROP POLICY IF EXISTS "Users can view own wallet" ON trucoin_wallets;
CREATE POLICY "Users can view own wallet"
  ON trucoin_wallets FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- trucoin_transactions
DROP POLICY IF EXISTS "Users can view own transactions" ON trucoin_transactions;
CREATE POLICY "Users can view own transactions"
  ON trucoin_transactions FOR SELECT TO authenticated
  USING (((SELECT auth.uid()) = from_user_id) OR ((SELECT auth.uid()) = to_user_id));

-- premium_access
DROP POLICY IF EXISTS "Users can view own premium access" ON premium_access;
CREATE POLICY "Users can view own premium access"
  ON premium_access FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- community_premium_pricing
DROP POLICY IF EXISTS "Créateurs gèrent prix communautés" ON community_premium_pricing;
CREATE POLICY "Créateurs gèrent prix communautés"
  ON community_premium_pricing FOR ALL TO authenticated
  USING (EXISTS ( SELECT 1 FROM communities WHERE ((communities.id = community_premium_pricing.community_id) AND (communities.creator_id = (SELECT auth.uid())))))
  WITH CHECK (EXISTS ( SELECT 1 FROM communities WHERE ((communities.id = community_premium_pricing.community_id) AND (communities.creator_id = (SELECT auth.uid())))));

-- user_appearance_settings
DROP POLICY IF EXISTS "Utilisateurs voient leur apparence" ON user_appearance_settings;
CREATE POLICY "Utilisateurs voient leur apparence"
  ON user_appearance_settings FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Utilisateurs gèrent leur apparence" ON user_appearance_settings;
CREATE POLICY "Utilisateurs gèrent leur apparence"
  ON user_appearance_settings FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));