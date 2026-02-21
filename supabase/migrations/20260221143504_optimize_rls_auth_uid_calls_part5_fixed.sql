/*
  # Optimize RLS Policies - Part 5: Monetization (Fixed)

  1. Performance Improvements
    - Wraps auth.uid() calls in SELECT to prevent re-evaluation per row

  2. Tables Affected (Part 5)
    - affiliate_links, affiliate_conversions
    - merchandise_products, merchandise_orders, merchandise_order_items, merchandise_inventory
    - kyc_verifications
    - brand_deals, video_sponsorships, sponsorship_deliverables
*/

-- affiliate_links policies
DROP POLICY IF EXISTS "Creators can manage own affiliate links" ON public.affiliate_links;
CREATE POLICY "Creators can manage own affiliate links"
  ON public.affiliate_links
  FOR ALL
  TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

-- affiliate_conversions policies
DROP POLICY IF EXISTS "Creators can view own conversions" ON public.affiliate_conversions;
CREATE POLICY "Creators can view own conversions"
  ON public.affiliate_conversions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.affiliate_links
      WHERE affiliate_links.id = affiliate_conversions.affiliate_link_id
      AND affiliate_links.creator_id = (SELECT auth.uid())
    )
  );

-- merchandise_products policies
DROP POLICY IF EXISTS "Creators can manage own merchandise" ON public.merchandise_products;
CREATE POLICY "Creators can manage own merchandise"
  ON public.merchandise_products
  FOR ALL
  TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

-- kyc_verifications policies
DROP POLICY IF EXISTS "Users can view own KYC data" ON public.kyc_verifications;
CREATE POLICY "Users can view own KYC data"
  ON public.kyc_verifications
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert own KYC data" ON public.kyc_verifications;
CREATE POLICY "Users can insert own KYC data"
  ON public.kyc_verifications
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own KYC data" ON public.kyc_verifications;
CREATE POLICY "Users can update own KYC data"
  ON public.kyc_verifications
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- merchandise_orders policies
DROP POLICY IF EXISTS "Creators can view own orders" ON public.merchandise_orders;
CREATE POLICY "Creators can view own orders"
  ON public.merchandise_orders
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.merchandise_products
      WHERE merchandise_products.creator_id = (SELECT auth.uid())
      AND EXISTS (
        SELECT 1 FROM public.merchandise_order_items
        WHERE merchandise_order_items.order_id = merchandise_orders.id
        AND merchandise_order_items.product_id = merchandise_products.id
      )
    )
  );

DROP POLICY IF EXISTS "Customers can create orders" ON public.merchandise_orders;
CREATE POLICY "Customers can create orders"
  ON public.merchandise_orders
  FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = (SELECT auth.uid()));

-- merchandise_order_items policies
DROP POLICY IF EXISTS "Users can view order items of their orders" ON public.merchandise_order_items;
CREATE POLICY "Users can view order items of their orders"
  ON public.merchandise_order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.merchandise_orders
      WHERE merchandise_orders.id = merchandise_order_items.order_id
      AND merchandise_orders.customer_id = (SELECT auth.uid())
    )
  );

-- merchandise_inventory policies
DROP POLICY IF EXISTS "Creators manage own inventory" ON public.merchandise_inventory;
CREATE POLICY "Creators manage own inventory"
  ON public.merchandise_inventory
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.merchandise_products
      WHERE merchandise_products.id = merchandise_inventory.product_id
      AND merchandise_products.creator_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.merchandise_products
      WHERE merchandise_products.id = merchandise_inventory.product_id
      AND merchandise_products.creator_id = (SELECT auth.uid())
    )
  );

-- brand_deals policies
DROP POLICY IF EXISTS "Creators manage own brand deals" ON public.brand_deals;
CREATE POLICY "Creators manage own brand deals"
  ON public.brand_deals
  FOR ALL
  TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

-- video_sponsorships policies
DROP POLICY IF EXISTS "Creators manage sponsorships for own videos" ON public.video_sponsorships;
CREATE POLICY "Creators manage sponsorships for own videos"
  ON public.video_sponsorships
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.videos
      WHERE videos.id = video_sponsorships.video_id
      AND videos.creator_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.videos
      WHERE videos.id = video_sponsorships.video_id
      AND videos.creator_id = (SELECT auth.uid())
    )
  );

-- sponsorship_deliverables policies
DROP POLICY IF EXISTS "Creators view own deliverables" ON public.sponsorship_deliverables;
CREATE POLICY "Creators view own deliverables"
  ON public.sponsorship_deliverables
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.brand_deals
      WHERE brand_deals.id = sponsorship_deliverables.brand_deal_id
      AND brand_deals.creator_id = (SELECT auth.uid())
    )
  );
