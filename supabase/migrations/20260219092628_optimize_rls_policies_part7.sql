/*
  # Optimize RLS Policies - Part 7

  1. Tables Updated
    - digital_product_purchases (2 policies)
    - services (2 policies)
    - service_bookings (2 policies)
    - kyc_verifications (3 policies)
    - creator_monetization_status (3 policies)
    - revenue_transactions (1 policy)
*/

-- Digital Product Purchases
DROP POLICY IF EXISTS "Users can create purchases" ON digital_product_purchases;
CREATE POLICY "Users can create purchases"
  ON digital_product_purchases FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view own purchases" ON digital_product_purchases;
CREATE POLICY "Users can view own purchases"
  ON digital_product_purchases FOR SELECT
  TO authenticated
  USING (
    customer_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM digital_products
      WHERE digital_products.id = digital_product_purchases.product_id
      AND digital_products.creator_id = (SELECT auth.uid())
    )
  );

-- Services
DROP POLICY IF EXISTS "Anyone can view active services" ON services;
CREATE POLICY "Anyone can view active services"
  ON services FOR SELECT
  TO authenticated
  USING (
    is_active = true 
    OR creator_id = (SELECT auth.uid())
  );

DROP POLICY IF EXISTS "Creators manage own services" ON services;
CREATE POLICY "Creators manage own services"
  ON services FOR ALL
  TO authenticated
  USING (creator_id = (SELECT auth.uid()))
  WITH CHECK (creator_id = (SELECT auth.uid()));

-- Service Bookings
DROP POLICY IF EXISTS "Users can create bookings" ON service_bookings;
CREATE POLICY "Users can create bookings"
  ON service_bookings FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users view relevant bookings" ON service_bookings;
CREATE POLICY "Users view relevant bookings"
  ON service_bookings FOR SELECT
  TO authenticated
  USING (
    customer_id = (SELECT auth.uid())
    OR creator_id = (SELECT auth.uid())
  );

-- KYC Verifications
DROP POLICY IF EXISTS "Users can view own KYC data" ON kyc_verifications;
CREATE POLICY "Users can view own KYC data"
  ON kyc_verifications FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert own KYC data" ON kyc_verifications;
CREATE POLICY "Users can insert own KYC data"
  ON kyc_verifications FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own KYC data" ON kyc_verifications;
CREATE POLICY "Users can update own KYC data"
  ON kyc_verifications FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- Creator Monetization Status
DROP POLICY IF EXISTS "Users can view own monetization status" ON creator_monetization_status;
CREATE POLICY "Users can view own monetization status"
  ON creator_monetization_status FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert own monetization status" ON creator_monetization_status;
CREATE POLICY "Users can insert own monetization status"
  ON creator_monetization_status FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own monetization status" ON creator_monetization_status;
CREATE POLICY "Users can update own monetization status"
  ON creator_monetization_status FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- Revenue Transactions
DROP POLICY IF EXISTS "Users can view own revenue transactions" ON revenue_transactions;
CREATE POLICY "Users can view own revenue transactions"
  ON revenue_transactions FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));