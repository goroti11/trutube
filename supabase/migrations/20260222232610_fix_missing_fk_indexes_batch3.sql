/*
  # Fix Missing Foreign Key Indexes - Batch 3
  
  Add indexes for foreign keys on tables L-P
*/

-- live_milestone_achievements
CREATE INDEX IF NOT EXISTS idx_live_milestone_achievements_stream_id ON live_milestone_achievements(stream_id);

-- live_moderation_logs
CREATE INDEX IF NOT EXISTS idx_live_moderation_logs_moderator_id ON live_moderation_logs(moderator_id);
CREATE INDEX IF NOT EXISTS idx_live_moderation_logs_target_user_id ON live_moderation_logs(target_user_id);

-- live_moderators
CREATE INDEX IF NOT EXISTS idx_live_moderators_assigned_by ON live_moderators(assigned_by);
CREATE INDEX IF NOT EXISTS idx_live_moderators_moderator_id ON live_moderators(moderator_id);

-- live_premiere_attendees
CREATE INDEX IF NOT EXISTS idx_live_premiere_attendees_user_id ON live_premiere_attendees(user_id);

-- live_premiere_events
CREATE INDEX IF NOT EXISTS idx_live_premiere_events_stream_id ON live_premiere_events(stream_id);

-- live_terms_acceptance
CREATE INDEX IF NOT EXISTS idx_live_terms_acceptance_terms_version_id ON live_terms_acceptance(terms_version_id);

-- live_top_supporters
CREATE INDEX IF NOT EXISTS idx_live_top_supporters_user_id ON live_top_supporters(user_id);

-- merchandise_order_items
CREATE INDEX IF NOT EXISTS idx_merchandise_order_items_order_id ON merchandise_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_merchandise_order_items_product_id ON merchandise_order_items(product_id);

-- merchandise_orders
CREATE INDEX IF NOT EXISTS idx_merchandise_orders_creator_id ON merchandise_orders(creator_id);
CREATE INDEX IF NOT EXISTS idx_merchandise_orders_customer_id ON merchandise_orders(customer_id);

-- merchandise_products
CREATE INDEX IF NOT EXISTS idx_merchandise_products_creator_id ON merchandise_products(creator_id);

-- messages
CREATE INDEX IF NOT EXISTS idx_messages_from_user_id ON messages(from_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_to_creator_id ON messages(to_creator_id);

-- moderation_votes
CREATE INDEX IF NOT EXISTS idx_moderation_votes_voter_id ON moderation_votes(voter_id);

-- monetization_suspensions
CREATE INDEX IF NOT EXISTS idx_monetization_suspensions_user_id ON monetization_suspensions(user_id);

-- music_albums
CREATE INDEX IF NOT EXISTS idx_music_albums_creator_id ON music_albums(creator_id);

-- music_royalties
CREATE INDEX IF NOT EXISTS idx_music_royalties_recipient_id ON music_royalties(recipient_id);
CREATE INDEX IF NOT EXISTS idx_music_royalties_track_id ON music_royalties(track_id);

-- music_streams
CREATE INDEX IF NOT EXISTS idx_music_streams_listener_id ON music_streams(listener_id);
CREATE INDEX IF NOT EXISTS idx_music_streams_track_id ON music_streams(track_id);

-- music_tracks
CREATE INDEX IF NOT EXISTS idx_music_tracks_album_id ON music_tracks(album_id);
CREATE INDEX IF NOT EXISTS idx_music_tracks_creator_id ON music_tracks(creator_id);
CREATE INDEX IF NOT EXISTS idx_music_tracks_primary_artist_id ON music_tracks(primary_artist_id);

-- notification_groups
CREATE INDEX IF NOT EXISTS idx_notification_groups_latest_actor_id ON notification_groups(latest_actor_id);

-- partner_program_acceptances
CREATE INDEX IF NOT EXISTS idx_partner_program_acceptances_terms_id ON partner_program_acceptances(terms_id);

-- payment_methods
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);

-- playlist_videos
CREATE INDEX IF NOT EXISTS idx_playlist_videos_video_id ON playlist_videos(video_id);

-- poll_votes
CREATE INDEX IF NOT EXISTS idx_poll_votes_user_id ON poll_votes(user_id);

-- post_comments
CREATE INDEX IF NOT EXISTS idx_post_comments_author_id ON post_comments(author_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_parent_comment_id ON post_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);

-- post_reactions
CREATE INDEX IF NOT EXISTS idx_post_reactions_user_id ON post_reactions(user_id);

-- premium_access
CREATE INDEX IF NOT EXISTS idx_premium_access_community_id ON premium_access(community_id);

-- profile_reviews
CREATE INDEX IF NOT EXISTS idx_profile_reviews_profile_id ON profile_reviews(profile_id);

-- profile_shares
CREATE INDEX IF NOT EXISTS idx_profile_shares_profile_id ON profile_shares(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_shares_shared_by_user_id ON profile_shares(shared_by_user_id);

-- profiles
CREATE INDEX IF NOT EXISTS idx_profiles_top_supporter_id ON profiles(top_supporter_id);