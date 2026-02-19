/*
  # Optimize RLS Policies - Part 5

  1. Tables Updated
    - support_leaderboard (1 policy)
    - affiliate_links (1 policy)
    - affiliate_conversions (1 policy)
    - merchandise_products (1 policy)
    - merchandise_orders (2 policies)
    - merchandise_order_items (1 policy)
    - merchandise_inventory (1 policy)
*/

-- Support Leaderboard
DROP POLICY IF EXISTS "Creator can view own leaderboard" ON support_leaderboard;
CREATE POLICY "Creator can view own leaderboard"
  ON support_leaderboard FOR SELECT
  TO authenticated
  USING (
    creator_id = (SELECT auth.uid())
    OR is_visible = true
  );

-- Affiliate Links
DROP POLICY IF EXISTS "Creators can manage own affiliate links" ON affiliate_links;
CREATE POLICY "Creators can manage own affiliate links"
  ON affiliate_links FOR ALL
  TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

-- Affiliate Conversions
DROP POLICY IF EXISTS "Creators can view own conversions" ON affiliate_conversions;
CREATE POLICY "Creators can view own conversions"
  ON affiliate_conversions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM affiliate_links
      WHERE affiliate_links.id = affiliate_conversions.affiliate_link_id
      AND affiliate_links.creator_id = (SELECT auth.uid())
    )
  );

-- Merchandise Products
DROP POLICY IF EXISTS "Creators can manage own merchandise" ON merchandise_products;
CREATE POLICY "Creators can manage own merchandise"
  ON merchandise_products FOR ALL
  TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

-- Merchandise Orders
DROP POLICY IF EXISTS "Creators can view own orders" ON merchandise_orders;
CREATE POLICY "Creators can view own orders"
  ON merchandise_orders FOR SELECT
  TO authenticated
  USING (
    customer_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM merchandise_products mp
      JOIN merchandise_order_items moi ON moi.product_id = mp.id
      WHERE moi.order_id = merchandise_orders.id
      AND mp.creator_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Customers can create orders" ON merchandise_orders;
CREATE POLICY "Customers can create orders"
  ON merchandise_orders FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = (SELECT auth.uid()));

-- Merchandise Order Items
DROP POLICY IF EXISTS "Users can view order items of their orders" ON merchandise_order_items;
CREATE POLICY "Users can view order items of their orders"
  ON merchandise_order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchandise_orders
      WHERE merchandise_orders.id = merchandise_order_items.order_id
      AND (
        merchandise_orders.customer_id = (SELECT auth.uid())
        OR EXISTS (
          SELECT 1 FROM merchandise_products
          WHERE merchandise_products.id = merchandise_order_items.product_id
          AND merchandise_products.creator_id = (SELECT auth.uid())
        )
      )
    )
  );

-- Merchandise Inventory
DROP POLICY IF EXISTS "Creators manage own inventory" ON merchandise_inventory;
CREATE POLICY "Creators manage own inventory"
  ON merchandise_inventory FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM merchandise_products
      WHERE merchandise_products.id = merchandise_inventory.product_id
      AND merchandise_products.creator_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchandise_products
      WHERE merchandise_products.id = merchandise_inventory.product_id
      AND merchandise_products.creator_id = (SELECT auth.uid())
    )
  );