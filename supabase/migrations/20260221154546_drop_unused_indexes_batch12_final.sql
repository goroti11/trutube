/*
  # Drop Unused Indexes - Batch 12: Final Cleanup

  1. Performance Improvement
    - Remove remaining unused indexes

  2. Indexes Removed
    - Videos core indexes (3 indexes)
    - Watch sessions indexes (2 indexes)
    - Withdrawal requests index (1 index)
*/

-- Drop unused videos indexes
DROP INDEX IF EXISTS idx_videos_creator_id;
DROP INDEX IF EXISTS idx_videos_universe_id;
DROP INDEX IF EXISTS idx_videos_sub_universe_id;

-- Drop unused watch sessions indexes
DROP INDEX IF EXISTS idx_watch_sessions_user_id;
DROP INDEX IF EXISTS idx_watch_sessions_video_id;

-- Drop unused withdrawal requests index
DROP INDEX IF EXISTS idx_withdrawal_requests_creator_id;