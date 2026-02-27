/*
  # Fix Missing Foreign Key Indexes - Round 2 Batch 6 (Final)

  1. New Indexes Added (16 indexes)
    - video_clips.creator_id, original_video_id
    - video_downloads.video_id
    - video_legend_awards.universe_id
    - video_playlists.user_id
    - video_sponsorships.brand_deal_id, video_id
    - video_translations.transcript_id
    - videos.creator_id, source_live_id, sub_universe_id, universe_id
    - watch_sessions.user_id, video_id
    - withdrawal_requests.creator_id

  2. Performance Impact
    - Completes all missing FK indexes across entire database
    - Total indexes added in round 2: ~107 indexes
*/

CREATE INDEX IF NOT EXISTS idx_video_clips_creator_id_fk ON video_clips(creator_id);
CREATE INDEX IF NOT EXISTS idx_video_clips_original_video_id_fk ON video_clips(original_video_id);
CREATE INDEX IF NOT EXISTS idx_video_downloads_video_id_fk ON video_downloads(video_id);
CREATE INDEX IF NOT EXISTS idx_video_legend_awards_universe_id_fk ON video_legend_awards(universe_id);
CREATE INDEX IF NOT EXISTS idx_video_playlists_user_id_fk ON video_playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_video_sponsorships_brand_deal_id_fk ON video_sponsorships(brand_deal_id);
CREATE INDEX IF NOT EXISTS idx_video_sponsorships_video_id_fk ON video_sponsorships(video_id);
CREATE INDEX IF NOT EXISTS idx_video_translations_transcript_id_fk ON video_translations(transcript_id);
CREATE INDEX IF NOT EXISTS idx_videos_creator_id_fk ON videos(creator_id);
CREATE INDEX IF NOT EXISTS idx_videos_source_live_id_fk ON videos(source_live_id);
CREATE INDEX IF NOT EXISTS idx_videos_sub_universe_id_fk ON videos(sub_universe_id);
CREATE INDEX IF NOT EXISTS idx_videos_universe_id_fk ON videos(universe_id);
CREATE INDEX IF NOT EXISTS idx_watch_sessions_user_id_fk ON watch_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_watch_sessions_video_id_fk ON watch_sessions(video_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_creator_id_fk ON withdrawal_requests(creator_id);
