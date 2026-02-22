/*
  # Fix Missing Foreign Key Indexes - Batch 4
  
  Add indexes for foreign keys on tables R-V
*/

-- revenue_holds
CREATE INDEX IF NOT EXISTS idx_revenue_holds_investigation_id ON revenue_holds(investigation_id);
CREATE INDEX IF NOT EXISTS idx_revenue_holds_user_id ON revenue_holds(user_id);

-- revenue_transactions
CREATE INDEX IF NOT EXISTS idx_revenue_transactions_user_id ON revenue_transactions(user_id);

-- review_helpfulness
CREATE INDEX IF NOT EXISTS idx_review_helpfulness_user_id ON review_helpfulness(user_id);

-- review_responses
CREATE INDEX IF NOT EXISTS idx_review_responses_creator_id ON review_responses(creator_id);

-- service_bookings
CREATE INDEX IF NOT EXISTS idx_service_bookings_customer_id ON service_bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_service_id ON service_bookings(service_id);

-- services
CREATE INDEX IF NOT EXISTS idx_services_creator_id ON services(creator_id);

-- social_links
CREATE INDEX IF NOT EXISTS idx_social_links_user_id ON social_links(user_id);

-- sponsorship_deliverables
CREATE INDEX IF NOT EXISTS idx_sponsorship_deliverables_brand_deal_id ON sponsorship_deliverables(brand_deal_id);

-- sub_universes
CREATE INDEX IF NOT EXISTS idx_sub_universes_universe_id ON sub_universes(universe_id);

-- subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_creator_id ON subscriptions(creator_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_supporter_id ON subscriptions(supporter_id);

-- support_leaderboard
CREATE INDEX IF NOT EXISTS idx_support_leaderboard_supporter_id ON support_leaderboard(supporter_id);

-- support_tickets
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);

-- tips
CREATE INDEX IF NOT EXISTS idx_tips_from_user_id ON tips(from_user_id);
CREATE INDEX IF NOT EXISTS idx_tips_to_creator_id ON tips(to_creator_id);
CREATE INDEX IF NOT EXISTS idx_tips_video_id ON tips(video_id);

-- tournament_matches
CREATE INDEX IF NOT EXISTS idx_tournament_matches_participant_2_id ON tournament_matches(participant_2_id);
CREATE INDEX IF NOT EXISTS idx_tournament_matches_winner_id ON tournament_matches(winner_id);

-- transactions
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);

-- trucoin_transactions
CREATE INDEX IF NOT EXISTS idx_trucoin_transactions_from_user_id ON trucoin_transactions(from_user_id);
CREATE INDEX IF NOT EXISTS idx_trucoin_transactions_to_user_id ON trucoin_transactions(to_user_id);

-- user_badges
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_type_id ON user_badges(badge_type_id);

-- user_earned_badges
CREATE INDEX IF NOT EXISTS idx_user_earned_badges_badge_id ON user_earned_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_user_earned_badges_stream_id ON user_earned_badges(stream_id);

-- user_reputation
CREATE INDEX IF NOT EXISTS idx_user_reputation_community_id ON user_reputation(community_id);

-- video_bookmarks
CREATE INDEX IF NOT EXISTS idx_video_bookmarks_video_id ON video_bookmarks(video_id);

-- video_clips
CREATE INDEX IF NOT EXISTS idx_video_clips_creator_id ON video_clips(creator_id);
CREATE INDEX IF NOT EXISTS idx_video_clips_original_video_id ON video_clips(original_video_id);

-- video_downloads
CREATE INDEX IF NOT EXISTS idx_video_downloads_user_id ON video_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_video_downloads_video_id ON video_downloads(video_id);

-- video_playlists
CREATE INDEX IF NOT EXISTS idx_video_playlists_user_id ON video_playlists(user_id);

-- video_reactions
CREATE INDEX IF NOT EXISTS idx_video_reactions_video_id ON video_reactions(video_id);

-- video_sponsorships
CREATE INDEX IF NOT EXISTS idx_video_sponsorships_brand_deal_id ON video_sponsorships(brand_deal_id);
CREATE INDEX IF NOT EXISTS idx_video_sponsorships_video_id ON video_sponsorships(video_id);

-- videos
CREATE INDEX IF NOT EXISTS idx_videos_creator_id ON videos(creator_id);
CREATE INDEX IF NOT EXISTS idx_videos_sub_universe_id ON videos(sub_universe_id);
CREATE INDEX IF NOT EXISTS idx_videos_universe_id ON videos(universe_id);

-- watch_sessions
CREATE INDEX IF NOT EXISTS idx_watch_sessions_user_id ON watch_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_watch_sessions_video_id ON watch_sessions(video_id);

-- withdrawal_requests
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_creator_id ON withdrawal_requests(creator_id);