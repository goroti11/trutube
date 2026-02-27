/*
  # Seed Notification Rules and Templates

  1. Notification Rules
    - Defines all notification types with cooldowns and grouping
    - Priority levels for each type
    - Templates for title and body
*/

-- Video notifications
INSERT INTO notification_rules (notification_type, entity_type, priority, cooldown_seconds, groupable, group_window_seconds, max_per_hour, title_template, body_template) VALUES
('video_uploaded', 'video', 3, 0, false, 0, 5, 'New video from {actor}', '{actor} just uploaded: {title}'),
('video_liked', 'video', 2, 300, true, 3600, 10, '{count} people liked your video', '{actor} and {count} others liked "{title}"'),
('video_comment', 'video', 2, 60, true, 1800, 15, 'New comments on your video', '{actor} and {count} others commented on "{title}"'),
('comment_reply', 'comment', 2, 60, false, 0, 20, '{actor} replied to your comment', '{body}'),
('video_milestone_views', 'video', 3, 0, false, 0, 5, 'Video milestone reached!', 'Your video "{title}" reached {milestone} views'),
('video_trending', 'video', 4, 0, false, 0, 3, 'Your video is trending!', '"{title}" is now trending in {universe}')
ON CONFLICT (notification_type) DO NOTHING;

-- Flow notifications
INSERT INTO notification_rules (notification_type, entity_type, priority, cooldown_seconds, groupable, group_window_seconds, max_per_hour, title_template, body_template) VALUES
('flow_started', 'flow', 3, 0, false, 0, 10, 'Flow started by {actor}', '{actor} started watching your content'),
('flow_completed', 'flow', 3, 0, false, 0, 10, 'Flow completed!', '{actor} completed your Flow series'),
('flow_published', 'flow', 3, 0, false, 0, 5, 'New Flow from {actor}', '{actor} published a new Flow: {title}'),
('flow_recommended', 'flow', 2, 3600, false, 0, 3, 'Recommended Flow for you', 'Based on your interests: {title}')
ON CONFLICT (notification_type) DO NOTHING;

-- Live notifications
INSERT INTO notification_rules (notification_type, entity_type, priority, cooldown_seconds, groupable, group_window_seconds, max_per_hour, title_template, body_template) VALUES
('live_started', 'live', 4, 0, false, 0, 5, '{actor} is live now!', 'Join the stream: {title}'),
('live_scheduled', 'live', 3, 0, false, 0, 5, 'Live scheduled', '{actor} scheduled a live for {datetime}'),
('live_milestone_viewers', 'live', 3, 600, false, 0, 5, 'Viewer milestone reached!', 'Your live reached {milestone} viewers'),
('live_top_supporter', 'live', 4, 0, false, 0, 3, 'You are a top supporter!', 'You are now a top supporter of {actor}'),
('live_gift_received', 'live', 3, 30, true, 300, 20, 'Gifts received', '{actor} and {count} others sent you gifts')
ON CONFLICT (notification_type) DO NOTHING;

-- Gift notifications
INSERT INTO notification_rules (notification_type, entity_type, priority, cooldown_seconds, groupable, group_window_seconds, max_per_hour, title_template, body_template) VALUES
('gift_received', 'gift', 3, 10, true, 600, 30, 'Gifts received', 'You received {count} gifts worth {amount} TruCoins'),
('badge_unlocked', 'gift', 4, 0, false, 0, 5, 'New badge unlocked!', 'You unlocked the {badge} badge'),
('status_achieved', 'gift', 4, 0, false, 0, 3, 'Status level up!', 'You reached {status} status')
ON CONFLICT (notification_type) DO NOTHING;

-- TruCoin notifications
INSERT INTO notification_rules (notification_type, entity_type, priority, cooldown_seconds, groupable, group_window_seconds, max_per_hour, title_template, body_template) VALUES
('trucoin_purchase', 'trucoin', 3, 0, false, 0, 10, 'TruCoins purchased', 'Successfully purchased {amount} TruCoins'),
('trucoin_gift_sent', 'trucoin', 2, 30, false, 0, 10, 'Gift sent', 'You sent a {gift} gift to {actor}'),
('trucoin_earnings', 'trucoin', 3, 0, false, 0, 10, 'Earnings received', 'You earned {amount} TruCoins'),
('trucoin_low_balance', 'trucoin', 2, 86400, false, 0, 1, 'Low balance', 'Your TruCoin balance is low ({balance})')
ON CONFLICT (notification_type) DO NOTHING;

-- Gaming notifications
INSERT INTO notification_rules (notification_type, entity_type, priority, cooldown_seconds, groupable, group_window_seconds, max_per_hour, title_template, body_template) VALUES
('gaming_duel_launched', 'gaming', 3, 0, false, 0, 10, 'Duel challenge!', '{actor} challenged you to a duel'),
('gaming_victory', 'gaming', 3, 0, false, 0, 15, 'Victory!', 'You won against {actor}'),
('gaming_leaderboard_update', 'gaming', 2, 3600, false, 0, 3, 'Leaderboard update', 'You are now #{rank} on the {game} leaderboard'),
('gaming_tournament_start', 'gaming', 4, 0, false, 0, 5, 'Tournament starting', '{tournament} is starting in {time}'),
('gaming_prize_won', 'gaming', 5, 0, false, 0, 5, 'Prize won!', 'You won {amount} from {tournament}')
ON CONFLICT (notification_type) DO NOTHING;

-- Marketplace notifications
INSERT INTO notification_rules (notification_type, entity_type, priority, cooldown_seconds, groupable, group_window_seconds, max_per_hour, title_template, body_template) VALUES
('marketplace_order_received', 'marketplace', 3, 0, false, 0, 10, 'New order', '{actor} ordered {product}'),
('marketplace_payment_validated', 'marketplace', 3, 0, false, 0, 10, 'Payment received', 'Payment for order #{order} validated'),
('marketplace_delivery_confirmed', 'marketplace', 3, 0, false, 0, 10, 'Delivery confirmed', 'Order #{order} delivered'),
('marketplace_dispute_opened', 'marketplace', 4, 0, false, 0, 5, 'Dispute opened', 'A dispute was opened for order #{order}'),
('marketplace_review_received', 'marketplace', 2, 300, true, 3600, 10, 'New reviews', '{count} new reviews on your products')
ON CONFLICT (notification_type) DO NOTHING;

-- Moderation notifications
INSERT INTO notification_rules (notification_type, entity_type, priority, cooldown_seconds, groupable, group_window_seconds, max_per_hour, title_template, body_template) VALUES
('moderation_warning', 'moderation', 5, 0, false, 0, 5, 'Warning issued', 'You received a warning: {reason}'),
('moderation_suspension', 'moderation', 5, 0, false, 0, 3, 'Account suspended', 'Your account was suspended: {reason}'),
('moderation_report_processed', 'moderation', 3, 0, false, 0, 10, 'Report processed', 'Your report has been reviewed')
ON CONFLICT (notification_type) DO NOTHING;

-- Studio notifications
INSERT INTO notification_rules (notification_type, entity_type, priority, cooldown_seconds, groupable, group_window_seconds, max_per_hour, title_template, body_template) VALUES
('studio_milestone', 'studio', 4, 0, false, 0, 5, 'Milestone reached!', 'You reached {milestone} subscribers'),
('studio_monetization_threshold', 'studio', 4, 0, false, 0, 3, 'Monetization unlocked!', 'You can now enable monetization'),
('studio_analytics_ready', 'studio', 2, 86400, false, 0, 1, 'Analytics ready', 'Your {period} analytics are available'),
('studio_copyright_claim', 'studio', 5, 0, false, 0, 5, 'Copyright claim', 'A copyright claim was filed on {video}')
ON CONFLICT (notification_type) DO NOTHING;

-- Premium notifications
INSERT INTO notification_rules (notification_type, entity_type, priority, cooldown_seconds, groupable, group_window_seconds, max_per_hour, title_template, body_template) VALUES
('premium_subscription_activated', 'premium', 3, 0, false, 0, 5, 'Premium activated', 'Welcome to Goroti Premium'),
('premium_subscription_expired', 'premium', 4, 0, false, 0, 3, 'Premium expired', 'Your premium subscription has expired'),
('premium_new_content', 'premium', 2, 3600, true, 7200, 5, 'New premium content', '{count} new premium videos available'),
('premium_renewal_reminder', 'premium', 3, 86400, false, 0, 1, 'Renewal reminder', 'Your premium expires in {days} days')
ON CONFLICT (notification_type) DO NOTHING;

-- System notifications
INSERT INTO notification_rules (notification_type, entity_type, priority, cooldown_seconds, groupable, group_window_seconds, max_per_hour, title_template, body_template) VALUES
('system_security_alert', 'system', 5, 0, false, 0, 5, 'Security alert', '{message}'),
('system_update', 'system', 2, 86400, false, 0, 1, 'Platform update', 'Goroti has new features'),
('system_maintenance', 'system', 4, 0, false, 0, 2, 'Maintenance scheduled', 'Scheduled maintenance: {datetime}')
ON CONFLICT (notification_type) DO NOTHING;

-- Community notifications
INSERT INTO notification_rules (notification_type, entity_type, priority, cooldown_seconds, groupable, group_window_seconds, max_per_hour, title_template, body_template) VALUES
('community_post_liked', 'community', 2, 300, true, 3600, 10, '{count} people liked your post', '{actor} and others liked your post'),
('community_post_comment', 'community', 2, 60, true, 1800, 15, 'New comments', '{count} new comments on your post'),
('community_new_follower', 'community', 2, 60, true, 3600, 20, 'New followers', '{actor} and {count} others followed you'),
('community_mention', 'community', 3, 0, false, 0, 20, '{actor} mentioned you', 'You were mentioned in a post')
ON CONFLICT (notification_type) DO NOTHING;
