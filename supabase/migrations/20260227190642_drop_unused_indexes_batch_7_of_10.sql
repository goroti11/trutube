/*
  # Drop Unused Indexes - Batch 7/10
  
  Tables: community features, live streams, trucoin, premium
*/

DROP INDEX IF EXISTS idx_community_members_role;
DROP INDEX IF EXISTS idx_reactions_user;
DROP INDEX IF EXISTS idx_polls_post;
DROP INDEX IF EXISTS idx_reputation_user;
DROP INDEX IF EXISTS idx_reputation_score;
DROP INDEX IF EXISTS idx_user_badges_user;
DROP INDEX IF EXISTS idx_user_badges_badge;
DROP INDEX IF EXISTS idx_wallets_user;
DROP INDEX IF EXISTS idx_live_streams_creator_id;
DROP INDEX IF EXISTS idx_live_streams_stream_status;
DROP INDEX IF EXISTS idx_transactions_from;
DROP INDEX IF EXISTS idx_live_streams_started_at;
DROP INDEX IF EXISTS idx_live_streams_replay_video;
DROP INDEX IF EXISTS idx_videos_is_replay;
DROP INDEX IF EXISTS idx_videos_source_live;
DROP INDEX IF EXISTS idx_videos_cloudflare_uid;
DROP INDEX IF EXISTS idx_videos_dub_status;
DROP INDEX IF EXISTS idx_transactions_to;
DROP INDEX IF EXISTS idx_premium_user;
DROP INDEX IF EXISTS idx_premium_community;
