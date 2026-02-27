/*
  # Drop Unused Indexes - Batch 4/10
  
  Tables: withdrawal_requests, profile_reviews, social_links, profile_shares, creator_support
*/

DROP INDEX IF EXISTS idx_withdrawal_requests_creator;
DROP INDEX IF EXISTS idx_withdrawal_requests_status;
DROP INDEX IF EXISTS idx_profile_reviews_profile;
DROP INDEX IF EXISTS idx_profile_reviews_reviewer;
DROP INDEX IF EXISTS idx_social_links_user;
DROP INDEX IF EXISTS idx_profile_shares_profile;
DROP INDEX IF EXISTS idx_profiles_channel_url;
DROP INDEX IF EXISTS idx_creator_support_creator;
DROP INDEX IF EXISTS idx_creator_support_supporter;
DROP INDEX IF EXISTS idx_creator_support_status;
DROP INDEX IF EXISTS idx_creator_memberships_user;
DROP INDEX IF EXISTS idx_creator_memberships_creator;
DROP INDEX IF EXISTS idx_support_leaderboard_creator;
DROP INDEX IF EXISTS idx_videos_processing_status;
DROP INDEX IF EXISTS idx_videos_creator_published;
DROP INDEX IF EXISTS idx_global_settings_creator_id;
DROP INDEX IF EXISTS idx_voice_consent_creator_id;
DROP INDEX IF EXISTS idx_voice_consent_model_id;
DROP INDEX IF EXISTS idx_videos_global_score;
DROP INDEX IF EXISTS idx_videos_multi_audio;
