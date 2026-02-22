/*
  # Seed Notification Rules

  Insert default anti-spam and grouping rules for all notification types
*/

INSERT INTO notification_rules (type, entity_type, min_priority, cooldown_seconds, groupable, group_window_seconds, max_group_size, description) VALUES
  -- Video notifications
  ('video:like', 'video', 2, 300, true, 3600, 20, 'Video likes can be grouped within 1 hour'),
  ('video:comment', 'video', 2, 60, true, 1800, 10, 'Video comments can be grouped within 30 minutes'),
  ('video:reply', 'video', 3, 0, false, 0, 1, 'Comment replies are immediate'),
  ('video:published', 'video', 3, 0, false, 0, 1, 'New video published by followed creator'),
  ('video:milestone', 'video', 3, 0, false, 0, 1, 'Video reached milestone'),

  -- Live notifications
  ('live:started', 'live', 4, 0, false, 0, 1, 'Creator started live stream'),
  ('live:scheduled', 'live', 3, 0, false, 0, 1, 'Scheduled live reminder'),
  ('live:gift_received', 'live', 3, 30, true, 300, 5, 'Gifts received during live'),
  ('live:milestone', 'live', 4, 0, false, 0, 1, 'Live milestone reached'),
  ('live:top_supporter', 'live', 4, 0, false, 0, 1, 'Became top supporter in live'),

  -- Flow notifications
  ('flow:started', 'flow', 3, 0, false, 0, 1, 'Flow session started'),
  ('flow:completed', 'flow', 3, 0, false, 0, 1, 'Flow session completed'),
  ('flow:new', 'flow', 3, 0, false, 0, 1, 'New Flow video available'),
  ('flow:recommendation', 'flow', 2, 3600, false, 0, 1, 'Personalized Flow recommendation'),

  -- Gift notifications
  ('gift:received', 'gift', 3, 10, true, 600, 10, 'Gifts received can be grouped'),
  ('gift:badge_unlocked', 'gift', 4, 0, false, 0, 1, 'New badge unlocked'),
  ('gift:status_reached', 'gift', 4, 0, false, 0, 1, 'New status level reached'),
  ('gift:leaderboard', 'gift', 3, 3600, false, 0, 1, 'Leaderboard position changed'),

  -- Wallet notifications
  ('wallet:purchase', 'wallet', 5, 0, false, 0, 1, 'TruCoin purchase completed'),
  ('wallet:received', 'wallet', 4, 0, false, 0, 1, 'TruCoins received'),
  ('wallet:sent', 'wallet', 3, 0, false, 0, 1, 'TruCoins sent'),
  ('wallet:low_balance', 'wallet', 3, 86400, false, 0, 1, 'Wallet balance is low'),
  ('wallet:earnings', 'wallet', 4, 0, false, 0, 1, 'Earnings credited'),

  -- Game notifications
  ('game:duel_started', 'game', 3, 0, false, 0, 1, 'Duel challenge received'),
  ('game:victory', 'game', 3, 0, false, 0, 1, 'Game victory'),
  ('game:leaderboard', 'game', 2, 3600, false, 0, 1, 'Leaderboard update'),
  ('game:reward', 'game', 3, 0, false, 0, 1, 'Game reward earned'),

  -- Marketplace notifications
  ('marketplace:order', 'marketplace', 4, 0, false, 0, 1, 'Order received'),
  ('marketplace:payment', 'marketplace', 5, 0, false, 0, 1, 'Payment processed'),
  ('marketplace:delivery', 'marketplace', 3, 0, false, 0, 1, 'Delivery confirmed'),
  ('marketplace:dispute', 'marketplace', 5, 0, false, 0, 1, 'Dispute opened'),
  ('marketplace:review', 'marketplace', 2, 300, true, 3600, 5, 'Product reviews'),

  -- Moderation notifications
  ('moderation:warning', 'moderation', 5, 0, false, 0, 1, 'Warning issued'),
  ('moderation:suspension', 'moderation', 5, 0, false, 0, 1, 'Account suspended'),
  ('moderation:report_resolved', 'moderation', 3, 0, false, 0, 1, 'Report resolved'),
  ('moderation:appeal', 'moderation', 4, 0, false, 0, 1, 'Appeal decision'),

  -- Studio notifications
  ('studio:milestone', 'studio', 4, 0, false, 0, 1, 'Channel milestone reached'),
  ('studio:monetization', 'studio', 5, 0, false, 0, 1, 'Monetization threshold reached'),
  ('studio:analytics', 'studio', 2, 86400, false, 0, 1, 'New analytics available'),
  ('studio:verification', 'studio', 4, 0, false, 0, 1, 'Verification status changed'),

  -- Premium notifications
  ('premium:activated', 'premium', 3, 0, false, 0, 1, 'Premium subscription activated'),
  ('premium:expiring', 'premium', 4, 0, false, 0, 1, 'Premium subscription expiring'),
  ('premium:expired', 'premium', 4, 0, false, 0, 1, 'Premium subscription expired'),
  ('premium:content', 'premium', 2, 3600, false, 0, 1, 'New premium content available'),

  -- Community notifications
  ('community:post', 'community', 2, 300, true, 3600, 10, 'Community posts'),
  ('community:mention', 'community', 3, 0, false, 0, 1, 'Mentioned in community'),
  ('community:role', 'community', 4, 0, false, 0, 1, 'Community role changed'),

  -- System notifications
  ('system:announcement', 'system', 3, 0, false, 0, 1, 'Platform announcement'),
  ('system:maintenance', 'system', 4, 0, false, 0, 1, 'Scheduled maintenance'),
  ('system:security', 'system', 5, 0, false, 0, 1, 'Security alert')
ON CONFLICT (type) DO NOTHING;