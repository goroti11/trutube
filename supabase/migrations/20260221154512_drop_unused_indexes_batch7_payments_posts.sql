/*
  # Drop Unused Indexes - Batch 7: Payments and Posts

  1. Performance Improvement
    - Remove unused payment and post-related indexes

  2. Indexes Removed
    - Partner program and payment indexes (2 indexes)
    - Playlist and poll indexes (2 indexes)
    - Post comments and reactions indexes (5 indexes)
*/

-- Drop unused partner program and payment indexes
DROP INDEX IF EXISTS idx_partner_program_acceptances_terms_id;
DROP INDEX IF EXISTS idx_payment_methods_user_id;

-- Drop unused playlist and poll indexes
DROP INDEX IF EXISTS idx_playlist_videos_video_id;
DROP INDEX IF EXISTS idx_poll_votes_user_id;

-- Drop unused post comments and reactions indexes
DROP INDEX IF EXISTS idx_post_comments_post_id;
DROP INDEX IF EXISTS idx_post_comments_author_id;
DROP INDEX IF EXISTS idx_post_comments_parent_comment_id;
DROP INDEX IF EXISTS idx_post_reactions_user_id;