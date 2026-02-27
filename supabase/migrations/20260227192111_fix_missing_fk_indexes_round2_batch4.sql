/*
  # Fix Missing Foreign Key Indexes - Round 2 Batch 4

  1. New Indexes Added (20 indexes)
    - legend_active_holders.universe_id
    - legend_editorial_actions.admin_id, registry_id
    - legend_level_history.registry_id
    - legend_rankings_history.user_id
    - legend_vote_fraud_logs.user_id
    - live_streams.creator_id, replay_video_id
    - media_jobs.live_id, video_id
    - merchandise_order_items.order_id
    - merchandise_orders.creator_id, customer_id
    - merchandise_products.creator_id
    - messages.from_user_id, to_creator_id
    - music_albums.creator_id
    - music_royalties.recipient_id
    - music_streams.track_id
    - music_tracks.album_id, creator_id

  2. Performance Impact
    - Covers legend, live, merchandise, and music systems
*/

CREATE INDEX IF NOT EXISTS idx_legend_active_holders_universe_id_fk ON legend_active_holders(universe_id);
CREATE INDEX IF NOT EXISTS idx_legend_editorial_actions_admin_id_fk ON legend_editorial_actions(admin_id);
CREATE INDEX IF NOT EXISTS idx_legend_editorial_actions_registry_id_fk ON legend_editorial_actions(registry_id);
CREATE INDEX IF NOT EXISTS idx_legend_level_history_registry_id_fk ON legend_level_history(registry_id);
CREATE INDEX IF NOT EXISTS idx_legend_rankings_history_user_id_fk ON legend_rankings_history(user_id);
CREATE INDEX IF NOT EXISTS idx_legend_vote_fraud_logs_user_id_fk ON legend_vote_fraud_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_live_streams_creator_id_fk ON live_streams(creator_id);
CREATE INDEX IF NOT EXISTS idx_live_streams_replay_video_id_fk ON live_streams(replay_video_id);
CREATE INDEX IF NOT EXISTS idx_media_jobs_live_id_fk ON media_jobs(live_id);
CREATE INDEX IF NOT EXISTS idx_media_jobs_video_id_fk ON media_jobs(video_id);
CREATE INDEX IF NOT EXISTS idx_merchandise_order_items_order_id_fk ON merchandise_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_merchandise_orders_creator_id_fk ON merchandise_orders(creator_id);
CREATE INDEX IF NOT EXISTS idx_merchandise_orders_customer_id_fk ON merchandise_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_merchandise_products_creator_id_fk ON merchandise_products(creator_id);
CREATE INDEX IF NOT EXISTS idx_messages_from_user_id_fk ON messages(from_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_to_creator_id_fk ON messages(to_creator_id);
CREATE INDEX IF NOT EXISTS idx_music_albums_creator_id_fk ON music_albums(creator_id);
CREATE INDEX IF NOT EXISTS idx_music_royalties_recipient_id_fk ON music_royalties(recipient_id);
CREATE INDEX IF NOT EXISTS idx_music_streams_track_id_fk ON music_streams(track_id);
CREATE INDEX IF NOT EXISTS idx_music_tracks_album_id_fk ON music_tracks(album_id);
CREATE INDEX IF NOT EXISTS idx_music_tracks_creator_id_fk ON music_tracks(creator_id);
