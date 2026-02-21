/*
  # Drop Unused Indexes - Batch 6: Music System

  1. Performance Improvement
    - Remove unused music-related indexes

  2. Indexes Removed
    - Music albums and tracks indexes (4 indexes)
    - Music streams and royalties indexes (4 indexes)
*/

-- Drop unused music albums and tracks indexes
DROP INDEX IF EXISTS idx_music_albums_creator_id;
DROP INDEX IF EXISTS idx_music_tracks_creator_id;
DROP INDEX IF EXISTS idx_music_tracks_album_id;
DROP INDEX IF EXISTS idx_music_tracks_primary_artist_id;

-- Drop unused music streams and royalties indexes
DROP INDEX IF EXISTS idx_music_streams_track_id;
DROP INDEX IF EXISTS idx_music_streams_listener_id;
DROP INDEX IF EXISTS idx_music_royalties_track_id;
DROP INDEX IF EXISTS idx_music_royalties_recipient_id;