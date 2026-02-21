/*
  # Drop Unused Indexes - Batch 5: Messages and Revenue

  1. Performance Improvement
    - Remove unused messages and revenue system indexes

  2. Indexes Removed
    - Messages indexes (2 indexes)
    - Monetization and revenue indexes (4 indexes)
*/

-- Drop unused messages indexes
DROP INDEX IF EXISTS idx_messages_from_user_id;
DROP INDEX IF EXISTS idx_messages_to_creator_id;

-- Drop unused monetization indexes
DROP INDEX IF EXISTS idx_monetization_suspensions_user_id;
DROP INDEX IF EXISTS idx_revenue_holds_user_id;
DROP INDEX IF EXISTS idx_revenue_holds_investigation_id;
DROP INDEX IF EXISTS idx_revenue_transactions_user_id;