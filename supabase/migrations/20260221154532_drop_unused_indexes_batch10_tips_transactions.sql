/*
  # Drop Unused Indexes - Batch 10: Tips and Transactions

  1. Performance Improvement
    - Remove unused tips and transaction indexes

  2. Indexes Removed
    - Tips indexes (3 indexes)
    - Transactions indexes (1 index)
    - TruCoin transactions indexes (2 indexes)
*/

-- Drop unused tips indexes
DROP INDEX IF EXISTS idx_tips_from_user_id;
DROP INDEX IF EXISTS idx_tips_to_creator_id;
DROP INDEX IF EXISTS idx_tips_video_id;

-- Drop unused transactions indexes
DROP INDEX IF EXISTS idx_transactions_user_id;

-- Drop unused TruCoin transactions indexes
DROP INDEX IF EXISTS idx_trucoin_transactions_from_user_id;
DROP INDEX IF EXISTS idx_trucoin_transactions_to_user_id;