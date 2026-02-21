/*
  # Drop Unused Indexes - Batch 9: Subscriptions and Support

  1. Performance Improvement
    - Remove unused subscription and support indexes

  2. Indexes Removed
    - Subscriptions indexes (2 indexes)
    - Support leaderboard index (1 index)
    - Support tickets index (1 index)
    - Sub-universes index (1 index)
*/

-- Drop unused subscriptions indexes
DROP INDEX IF EXISTS idx_subscriptions_creator_id;
DROP INDEX IF EXISTS idx_subscriptions_supporter_id;

-- Drop unused support indexes
DROP INDEX IF EXISTS idx_support_leaderboard_supporter_id;
DROP INDEX IF EXISTS idx_support_tickets_user_id;

-- Drop unused sub-universes index
DROP INDEX IF EXISTS idx_sub_universes_universe_id;