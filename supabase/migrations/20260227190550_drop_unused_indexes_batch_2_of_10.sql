/*
  # Drop Unused Indexes - Batch 2/10
  
  Tables: user_trust_scores, content_reports, moderation_votes, comments, creator_universes, messages
*/

DROP INDEX IF EXISTS idx_user_trust_scores_user_id;
DROP INDEX IF EXISTS idx_content_reports_content;
DROP INDEX IF EXISTS idx_moderation_votes_report_id;
DROP INDEX IF EXISTS idx_content_status_content;
DROP INDEX IF EXISTS idx_comments_user_id;
DROP INDEX IF EXISTS idx_content_reports_reporter_id;
DROP INDEX IF EXISTS idx_creator_universes_main_universe_id;
DROP INDEX IF EXISTS idx_messages_from_user_id;
DROP INDEX IF EXISTS idx_moderation_votes_voter_id;
DROP INDEX IF EXISTS idx_subscriptions_creator_id;
DROP INDEX IF EXISTS idx_tips_from_user_id;
DROP INDEX IF EXISTS idx_tips_to_creator_id;
DROP INDEX IF EXISTS idx_sub_universes_universe_id;
DROP INDEX IF EXISTS idx_creator_universes_creator_id;
DROP INDEX IF EXISTS idx_user_preferences_user_id;
DROP INDEX IF EXISTS idx_videos_sub_universe_id;
DROP INDEX IF EXISTS idx_user_settings_user_id;
DROP INDEX IF EXISTS idx_support_tickets_user_id;
DROP INDEX IF EXISTS idx_support_tickets_status;
DROP INDEX IF EXISTS idx_support_tickets_created_at;
