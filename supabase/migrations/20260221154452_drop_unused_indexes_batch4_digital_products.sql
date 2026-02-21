/*
  # Drop Unused Indexes - Batch 4: Digital Products and Merchandise

  1. Performance Improvement
    - Remove unused digital products and merchandise indexes

  2. Indexes Removed
    - Digital products indexes (4 indexes)
    - Merchandise products and orders indexes (5 indexes)
*/

-- Drop unused digital products indexes
DROP INDEX IF EXISTS idx_digital_products_creator_id;
DROP INDEX IF EXISTS idx_digital_product_modules_product_id;
DROP INDEX IF EXISTS idx_digital_product_purchases_customer_id;

-- Drop unused services indexes
DROP INDEX IF EXISTS idx_services_creator_id;
DROP INDEX IF EXISTS idx_service_bookings_service_id;
DROP INDEX IF EXISTS idx_service_bookings_customer_id;

-- Drop unused merchandise indexes
DROP INDEX IF EXISTS idx_merchandise_products_creator_id;
DROP INDEX IF EXISTS idx_merchandise_orders_creator_id;
DROP INDEX IF EXISTS idx_merchandise_orders_customer_id;
DROP INDEX IF EXISTS idx_merchandise_order_items_order_id;
DROP INDEX IF EXISTS idx_merchandise_order_items_product_id;