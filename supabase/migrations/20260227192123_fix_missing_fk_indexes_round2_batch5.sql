/*
  # Fix Missing Foreign Key Indexes - Round 2 Batch 5

  1. New Indexes Added (20 indexes)
    - notification_groups.user_id
    - notification_queue.user_id
    - notifications.user_id
    - payment_methods.user_id
    - post_comments.parent_comment_id, post_id, user_id
    - profile_shares.profile_id
    - service_bookings.customer_id, service_id
    - services.creator_id
    - social_links.user_id
    - story_announcements.story_id
    - sub_universes.universe_id
    - subscriptions.creator_id, supporter_id
    - tips.from_user_id, to_creator_id, video_id
    - tournament_matches.tournament_id
    - transactions.user_id

  2. Performance Impact
    - Covers notifications, payments, posts, and subscriptions
*/

CREATE INDEX IF NOT EXISTS idx_notification_groups_user_id_fk ON notification_groups(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_queue_user_id_fk ON notification_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_fk ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id_fk ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_parent_comment_id_fk ON post_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id_fk ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_user_id_fk ON post_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_shares_profile_id_fk ON profile_shares(profile_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_customer_id_fk ON service_bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_service_id_fk ON service_bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_services_creator_id_fk ON services(creator_id);
CREATE INDEX IF NOT EXISTS idx_social_links_user_id_fk ON social_links(user_id);
CREATE INDEX IF NOT EXISTS idx_story_announcements_story_id_fk ON story_announcements(story_id);
CREATE INDEX IF NOT EXISTS idx_sub_universes_universe_id_fk ON sub_universes(universe_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_creator_id_fk ON subscriptions(creator_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_supporter_id_fk ON subscriptions(supporter_id);
CREATE INDEX IF NOT EXISTS idx_tips_from_user_id_fk ON tips(from_user_id);
CREATE INDEX IF NOT EXISTS idx_tips_to_creator_id_fk ON tips(to_creator_id);
CREATE INDEX IF NOT EXISTS idx_tips_video_id_fk ON tips(video_id);
CREATE INDEX IF NOT EXISTS idx_tournament_matches_tournament_id_fk ON tournament_matches(tournament_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id_fk ON transactions(user_id);
