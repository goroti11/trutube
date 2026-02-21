/*
  # Drop Unused Indexes - Batch 11: User and Video Indexes

  1. Performance Improvement
    - Remove unused user and video-related indexes

  2. Indexes Removed
    - User badges and reputation indexes (2 indexes)
    - Video bookmarks and clips indexes (3 indexes)
    - Video downloads and playlists indexes (3 indexes)
    - Video reactions index (1 index)
*/

-- Drop unused user indexes
DROP INDEX IF EXISTS idx_user_badges_badge_type_id;
DROP INDEX IF EXISTS idx_user_reputation_community_id;

-- Drop unused video bookmarks and clips indexes
DROP INDEX IF EXISTS idx_video_bookmarks_video_id;
DROP INDEX IF EXISTS idx_video_clips_creator_id;
DROP INDEX IF EXISTS idx_video_clips_original_video_id;

-- Drop unused video downloads and playlists indexes
DROP INDEX IF EXISTS idx_video_downloads_user_id;
DROP INDEX IF EXISTS idx_video_downloads_video_id;
DROP INDEX IF EXISTS idx_video_playlists_user_id;

-- Drop unused video reactions index
DROP INDEX IF EXISTS idx_video_reactions_video_id;