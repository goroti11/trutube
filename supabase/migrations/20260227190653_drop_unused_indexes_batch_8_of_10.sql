/*
  # Drop Unused Indexes - Batch 8/10
  
  Tables: premium pricing, media jobs, gaming
*/

DROP INDEX IF EXISTS idx_premium_pricing_tier_period;
DROP INDEX IF EXISTS idx_premium_subscriptions_billing_period;
DROP INDEX IF EXISTS idx_community_premium_pricing;
DROP INDEX IF EXISTS idx_video_transcripts_video_id;
DROP INDEX IF EXISTS idx_video_transcripts_job_status;
DROP INDEX IF EXISTS idx_video_translations_video_id;
DROP INDEX IF EXISTS idx_video_translations_transcript_id;
DROP INDEX IF EXISTS idx_video_translations_job_status;
DROP INDEX IF EXISTS idx_video_audio_tracks_video_id;
DROP INDEX IF EXISTS idx_video_audio_tracks_job_status;
DROP INDEX IF EXISTS idx_video_audio_tracks_cloudflare;
DROP INDEX IF EXISTS idx_video_subtitles_video_id;
DROP INDEX IF EXISTS idx_video_subtitles_job_status;
DROP INDEX IF EXISTS idx_media_jobs_status_type;
DROP INDEX IF EXISTS idx_media_jobs_video_id;
DROP INDEX IF EXISTS idx_media_jobs_live_id;
DROP INDEX IF EXISTS idx_media_jobs_locked;
DROP INDEX IF EXISTS idx_games_publisher;
DROP INDEX IF EXISTS idx_gaming_sessions_streamer;
DROP INDEX IF EXISTS idx_gaming_sessions_game;
