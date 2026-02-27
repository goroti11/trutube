/*
  # Drop Unused Indexes - Batch 1/10
  
  Remove unused indexes to improve write performance and reduce storage
  
  Tables: ad_impressions, video_clips, video_playlists, playlist_videos, video_reactions, profiles
*/

DROP INDEX IF EXISTS idx_ad_impressions_viewer;
DROP INDEX IF EXISTS idx_ad_impressions_time;
DROP INDEX IF EXISTS idx_video_clips_creator;
DROP INDEX IF EXISTS idx_video_playlists_user;
DROP INDEX IF EXISTS idx_playlist_videos_playlist;
DROP INDEX IF EXISTS idx_profiles_username;
DROP INDEX IF EXISTS idx_playlist_videos_video;
DROP INDEX IF EXISTS idx_video_reactions_user_video;
DROP INDEX IF EXISTS idx_videos_hashtags;
DROP INDEX IF EXISTS idx_content_reports_status;
DROP INDEX IF EXISTS idx_videos_creator_id;
DROP INDEX IF EXISTS idx_videos_universe_id;
DROP INDEX IF EXISTS idx_videos_created_at;
DROP INDEX IF EXISTS idx_video_scores_final_score;
DROP INDEX IF EXISTS idx_subscriptions_supporter_creator;
DROP INDEX IF EXISTS idx_comments_video_id;
DROP INDEX IF EXISTS idx_messages_to_creator;
DROP INDEX IF EXISTS idx_watch_sessions_video_id;
DROP INDEX IF EXISTS idx_watch_sessions_user_id;
DROP INDEX IF EXISTS idx_watch_sessions_validated;
