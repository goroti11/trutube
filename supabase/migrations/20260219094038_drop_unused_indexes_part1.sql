/*
  # Drop Unused Indexes - Part 1

  1. Performance Optimization
    - Remove indexes that have never been used
    - Unused indexes waste storage and slow down writes
    - These can be recreated if needed in the future

  2. Tables: comments, content_reports, creator_universes, messages,
     moderation_votes, subscriptions, tips, videos, video_scores,
     sub_universes, user_preferences, watch_sessions, user_trust_scores,
     content_status, profiles, user_settings, support_tickets
*/

DROP INDEX IF EXISTS idx_comments_user_id;
DROP INDEX IF EXISTS idx_comments_video_id;
DROP INDEX IF EXISTS idx_content_reports_reporter_id;
DROP INDEX IF EXISTS idx_content_reports_content;
DROP INDEX IF EXISTS idx_content_reports_status;
DROP INDEX IF EXISTS idx_creator_universes_main_universe_id;
DROP INDEX IF EXISTS idx_creator_universes_creator_id;
DROP INDEX IF EXISTS idx_messages_from_user_id;
DROP INDEX IF EXISTS idx_messages_to_creator;
DROP INDEX IF EXISTS idx_moderation_votes_voter_id;
DROP INDEX IF EXISTS idx_moderation_votes_report_id;
DROP INDEX IF EXISTS idx_subscriptions_creator_id;
DROP INDEX IF EXISTS idx_subscriptions_supporter_creator;
DROP INDEX IF EXISTS idx_tips_from_user_id;
DROP INDEX IF EXISTS idx_tips_to_creator_id;
DROP INDEX IF EXISTS idx_tips_video;
DROP INDEX IF EXISTS idx_tips_status;
DROP INDEX IF EXISTS idx_videos_creator_id;
DROP INDEX IF EXISTS idx_videos_universe_id;
DROP INDEX IF EXISTS idx_videos_created_at;
DROP INDEX IF EXISTS idx_videos_sub_universe_id;
DROP INDEX IF EXISTS idx_videos_hashtags;
DROP INDEX IF EXISTS idx_videos_processing_status;
DROP INDEX IF EXISTS idx_videos_creator_published;
DROP INDEX IF EXISTS idx_video_scores_final_score;
DROP INDEX IF EXISTS idx_sub_universes_universe_id;
DROP INDEX IF EXISTS idx_user_preferences_user_id;
DROP INDEX IF EXISTS idx_watch_sessions_video_id;
DROP INDEX IF EXISTS idx_watch_sessions_user_id;
DROP INDEX IF EXISTS idx_watch_sessions_validated;
DROP INDEX IF EXISTS idx_user_trust_scores_user_id;
DROP INDEX IF EXISTS idx_content_status_content;
DROP INDEX IF EXISTS idx_profiles_username;
DROP INDEX IF EXISTS idx_profiles_channel_url;
DROP INDEX IF EXISTS idx_profiles_top_supporter_id;
DROP INDEX IF EXISTS idx_user_settings_user_id;
DROP INDEX IF EXISTS idx_support_tickets_user_id;
DROP INDEX IF EXISTS idx_support_tickets_status;
DROP INDEX IF EXISTS idx_support_tickets_created_at;