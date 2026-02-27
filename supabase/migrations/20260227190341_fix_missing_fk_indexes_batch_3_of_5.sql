/*
  # Fix Missing Foreign Key Indexes - Batch 3/5
  
  Add indexes for foreign keys to improve query performance (Part 3)
  
  Tables covered:
  - legend_vote_fraud_logs
  - merchandise_order_items
  - music_royalties
  - music_streams
  - music_tracks
  - notification_groups
  - notifications
  - partner_program_acceptances
  - profile_shares
  - profiles
*/

-- legend_vote_fraud_logs
CREATE INDEX IF NOT EXISTS idx_legend_vote_fraud_logs_candidate_id 
ON legend_vote_fraud_logs(candidate_id);

-- merchandise_order_items
CREATE INDEX IF NOT EXISTS idx_merchandise_order_items_product_id 
ON merchandise_order_items(product_id);

-- music_royalties
CREATE INDEX IF NOT EXISTS idx_music_royalties_track_id 
ON music_royalties(track_id);

-- music_streams
CREATE INDEX IF NOT EXISTS idx_music_streams_listener_id 
ON music_streams(listener_id);

-- music_tracks
CREATE INDEX IF NOT EXISTS idx_music_tracks_primary_artist_id 
ON music_tracks(primary_artist_id);

-- notification_groups
CREATE INDEX IF NOT EXISTS idx_notification_groups_last_actor_id 
ON notification_groups(last_actor_id);

-- notifications
CREATE INDEX IF NOT EXISTS idx_notifications_actor_id 
ON notifications(actor_id);

-- partner_program_acceptances
CREATE INDEX IF NOT EXISTS idx_partner_program_acceptances_terms_id 
ON partner_program_acceptances(terms_id);

-- profile_shares
CREATE INDEX IF NOT EXISTS idx_profile_shares_shared_by_user_id 
ON profile_shares(shared_by_user_id);

-- profiles
CREATE INDEX IF NOT EXISTS idx_profiles_top_supporter_id 
ON profiles(top_supporter_id);
