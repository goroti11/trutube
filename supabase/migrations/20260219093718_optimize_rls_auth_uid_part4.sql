/*
  # Optimize RLS Policies - Part 4: Marketplace Orders, Messages, Disputes, Legal, Channels

  1. Performance Optimization
    - Replace auth.uid() with (SELECT auth.uid()) in RLS policies
    - Tables: marketplace_orders, marketplace_order_messages, marketplace_disputes,
      legal_profiles, creator_channels, saved_videos, user_referral_codes, video_share_events
*/

-- marketplace_orders
DROP POLICY IF EXISTS "Buyers and providers view own orders" ON marketplace_orders;
CREATE POLICY "Buyers and providers view own orders"
  ON marketplace_orders FOR SELECT TO authenticated
  USING ((buyer_id = (SELECT auth.uid())) OR (provider_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Buyers create orders" ON marketplace_orders;
CREATE POLICY "Buyers create orders"
  ON marketplace_orders FOR INSERT TO authenticated
  WITH CHECK (buyer_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Buyers and providers update own orders" ON marketplace_orders;
CREATE POLICY "Buyers and providers update own orders"
  ON marketplace_orders FOR UPDATE TO authenticated
  USING ((buyer_id = (SELECT auth.uid())) OR (provider_id = (SELECT auth.uid())))
  WITH CHECK ((buyer_id = (SELECT auth.uid())) OR (provider_id = (SELECT auth.uid())));

-- marketplace_order_messages
DROP POLICY IF EXISTS "Order participants view messages" ON marketplace_order_messages;
CREATE POLICY "Order participants view messages"
  ON marketplace_order_messages FOR SELECT TO authenticated
  USING (EXISTS ( SELECT 1 FROM marketplace_orders WHERE ((marketplace_orders.id = marketplace_order_messages.order_id) AND ((marketplace_orders.buyer_id = (SELECT auth.uid())) OR (marketplace_orders.provider_id = (SELECT auth.uid()))))));

DROP POLICY IF EXISTS "Order participants send messages" ON marketplace_order_messages;
CREATE POLICY "Order participants send messages"
  ON marketplace_order_messages FOR INSERT TO authenticated
  WITH CHECK ((sender_id = (SELECT auth.uid())) AND (EXISTS ( SELECT 1 FROM marketplace_orders WHERE ((marketplace_orders.id = marketplace_order_messages.order_id) AND ((marketplace_orders.buyer_id = (SELECT auth.uid())) OR (marketplace_orders.provider_id = (SELECT auth.uid())))))));

-- marketplace_disputes
DROP POLICY IF EXISTS "Dispute parties view own disputes" ON marketplace_disputes;
CREATE POLICY "Dispute parties view own disputes"
  ON marketplace_disputes FOR SELECT TO authenticated
  USING ((opened_by = (SELECT auth.uid())) OR (EXISTS ( SELECT 1 FROM marketplace_orders WHERE ((marketplace_orders.id = marketplace_disputes.order_id) AND ((marketplace_orders.buyer_id = (SELECT auth.uid())) OR (marketplace_orders.provider_id = (SELECT auth.uid())))))));

DROP POLICY IF EXISTS "Order participants open disputes" ON marketplace_disputes;
CREATE POLICY "Order participants open disputes"
  ON marketplace_disputes FOR INSERT TO authenticated
  WITH CHECK ((opened_by = (SELECT auth.uid())) AND (EXISTS ( SELECT 1 FROM marketplace_orders WHERE ((marketplace_orders.id = marketplace_disputes.order_id) AND ((marketplace_orders.buyer_id = (SELECT auth.uid())) OR (marketplace_orders.provider_id = (SELECT auth.uid())))))));

-- legal_profiles
DROP POLICY IF EXISTS "Owner can read own legal profile" ON legal_profiles;
CREATE POLICY "Owner can read own legal profile"
  ON legal_profiles FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Owner can insert own legal profile" ON legal_profiles;
CREATE POLICY "Owner can insert own legal profile"
  ON legal_profiles FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Owner can update own legal profile" ON legal_profiles;
CREATE POLICY "Owner can update own legal profile"
  ON legal_profiles FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- creator_channels
DROP POLICY IF EXISTS "Owner can read own channels" ON creator_channels;
CREATE POLICY "Owner can read own channels"
  ON creator_channels FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Owner can insert own channels" ON creator_channels;
CREATE POLICY "Owner can insert own channels"
  ON creator_channels FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Owner can update own channels" ON creator_channels;
CREATE POLICY "Owner can update own channels"
  ON creator_channels FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Owner can delete own channels" ON creator_channels;
CREATE POLICY "Owner can delete own channels"
  ON creator_channels FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- saved_videos
DROP POLICY IF EXISTS "Users can view own saved videos" ON saved_videos;
CREATE POLICY "Users can view own saved videos"
  ON saved_videos FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can save videos" ON saved_videos;
CREATE POLICY "Users can save videos"
  ON saved_videos FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can unsave videos" ON saved_videos;
CREATE POLICY "Users can unsave videos"
  ON saved_videos FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- user_referral_codes
DROP POLICY IF EXISTS "Users can view own referral code" ON user_referral_codes;
CREATE POLICY "Users can view own referral code"
  ON user_referral_codes FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can create own referral code" ON user_referral_codes;
CREATE POLICY "Users can create own referral code"
  ON user_referral_codes FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own referral code" ON user_referral_codes;
CREATE POLICY "Users can update own referral code"
  ON user_referral_codes FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- video_share_events
DROP POLICY IF EXISTS "Users can view own share events" ON video_share_events;
CREATE POLICY "Users can view own share events"
  ON video_share_events FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = shared_by);

DROP POLICY IF EXISTS "Users can log share events" ON video_share_events;
CREATE POLICY "Users can log share events"
  ON video_share_events FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = shared_by);