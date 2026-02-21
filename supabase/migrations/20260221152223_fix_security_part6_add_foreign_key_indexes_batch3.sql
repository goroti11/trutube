/*
  # Security Fix Part 6: Add Foreign Key Indexes (Batch 3)

  This migration completes adding indexes for all unindexed foreign keys.

  ## Indexes Added (Batch 3 of 3)
  - Partner program and payments
  - Playlists and polls
  - Posts and reactions
  - Premium access
  - Profile system
  - Services and bookings
  - Sponsorships
  - Subscriptions and support
  - Tips and transactions
  - TruCoin
  - User badges and reputation
  - Videos and video features
  - Watch sessions
  - Withdrawals

  ## Performance Impact
  - Completes foreign key index coverage
  - Optimizes all relationship queries
  - Improves overall database performance
*/

-- Partner Program & Payments
CREATE INDEX IF NOT EXISTS idx_partner_program_acceptances_terms_id ON partner_program_acceptances(terms_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);

-- Playlists & Polls
CREATE INDEX IF NOT EXISTS idx_playlist_videos_video_id ON playlist_videos(video_id);
CREATE INDEX IF NOT EXISTS idx_poll_votes_user_id ON poll_votes(user_id);

-- Posts & Reactions
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_author_id ON post_comments(author_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_parent_comment_id ON post_comments(parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_post_reactions_user_id ON post_reactions(user_id);

-- Premium Access
CREATE INDEX IF NOT EXISTS idx_premium_access_community_id ON premium_access(community_id);

-- Profile System
CREATE INDEX IF NOT EXISTS idx_profile_reviews_profile_id ON profile_reviews(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_shares_profile_id ON profile_shares(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_shares_shared_by_user_id ON profile_shares(shared_by_user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_top_supporter_id ON profiles(top_supporter_id);
CREATE INDEX IF NOT EXISTS idx_social_links_user_id ON social_links(user_id);

-- Services & Bookings
CREATE INDEX IF NOT EXISTS idx_services_creator_id ON services(creator_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_service_id ON service_bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_customer_id ON service_bookings(customer_id);

-- Sponsorships
CREATE INDEX IF NOT EXISTS idx_sponsorship_deliverables_brand_deal_id ON sponsorship_deliverables(brand_deal_id);
CREATE INDEX IF NOT EXISTS idx_video_sponsorships_video_id ON video_sponsorships(video_id);
CREATE INDEX IF NOT EXISTS idx_video_sponsorships_brand_deal_id ON video_sponsorships(brand_deal_id);

-- Subscriptions & Support
CREATE INDEX IF NOT EXISTS idx_subscriptions_creator_id ON subscriptions(creator_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_supporter_id ON subscriptions(supporter_id);
CREATE INDEX IF NOT EXISTS idx_support_leaderboard_supporter_id ON support_leaderboard(supporter_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);

-- Sub Universes
CREATE INDEX IF NOT EXISTS idx_sub_universes_universe_id ON sub_universes(universe_id);

-- Tips & Transactions
CREATE INDEX IF NOT EXISTS idx_tips_from_user_id ON tips(from_user_id);
CREATE INDEX IF NOT EXISTS idx_tips_to_creator_id ON tips(to_creator_id);
CREATE INDEX IF NOT EXISTS idx_tips_video_id ON tips(video_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);

-- TruCoin
CREATE INDEX IF NOT EXISTS idx_trucoin_transactions_from_user_id ON trucoin_transactions(from_user_id);
CREATE INDEX IF NOT EXISTS idx_trucoin_transactions_to_user_id ON trucoin_transactions(to_user_id);

-- User System
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_type_id ON user_badges(badge_type_id);
CREATE INDEX IF NOT EXISTS idx_user_reputation_community_id ON user_reputation(community_id);

-- Video System
CREATE INDEX IF NOT EXISTS idx_video_bookmarks_video_id ON video_bookmarks(video_id);
CREATE INDEX IF NOT EXISTS idx_video_clips_creator_id ON video_clips(creator_id);
CREATE INDEX IF NOT EXISTS idx_video_clips_original_video_id ON video_clips(original_video_id);
CREATE INDEX IF NOT EXISTS idx_video_downloads_user_id ON video_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_video_downloads_video_id ON video_downloads(video_id);
CREATE INDEX IF NOT EXISTS idx_video_playlists_user_id ON video_playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_video_reactions_video_id ON video_reactions(video_id);
CREATE INDEX IF NOT EXISTS idx_videos_creator_id ON videos(creator_id);
CREATE INDEX IF NOT EXISTS idx_videos_universe_id ON videos(universe_id);
CREATE INDEX IF NOT EXISTS idx_videos_sub_universe_id ON videos(sub_universe_id);

-- Watch Sessions
CREATE INDEX IF NOT EXISTS idx_watch_sessions_user_id ON watch_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_watch_sessions_video_id ON watch_sessions(video_id);

-- Withdrawals
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_creator_id ON withdrawal_requests(creator_id);
