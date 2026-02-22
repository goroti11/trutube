/*
  # Clean Demo Data and Prepare for Production
  
  Remove all test/demo data from the database and prepare for official deployment
*/

-- Clean all user-generated content tables
TRUNCATE TABLE comments CASCADE;
TRUNCATE TABLE video_reviews CASCADE;
TRUNCATE TABLE creator_reviews CASCADE;
TRUNCATE TABLE review_helpfulness CASCADE;
TRUNCATE TABLE review_responses CASCADE;

-- Clean video and content tables
TRUNCATE TABLE videos CASCADE;
TRUNCATE TABLE video_clips CASCADE;
TRUNCATE TABLE video_bookmarks CASCADE;
TRUNCATE TABLE video_downloads CASCADE;
TRUNCATE TABLE video_playlists CASCADE;
TRUNCATE TABLE playlist_videos CASCADE;
TRUNCATE TABLE video_reactions CASCADE;
TRUNCATE TABLE watch_sessions CASCADE;

-- Clean live streaming tables
TRUNCATE TABLE live_streams CASCADE;
TRUNCATE TABLE live_viewers CASCADE;
TRUNCATE TABLE live_chat_messages CASCADE;
TRUNCATE TABLE live_gifts CASCADE;
TRUNCATE TABLE live_gift_transactions CASCADE;
TRUNCATE TABLE live_gift_pack_purchases CASCADE;
TRUNCATE TABLE live_game_sessions CASCADE;
TRUNCATE TABLE live_game_actions CASCADE;
TRUNCATE TABLE live_game_rewards CASCADE;
TRUNCATE TABLE live_game_participants CASCADE;
TRUNCATE TABLE live_games CASCADE;
TRUNCATE TABLE live_premiere_events CASCADE;
TRUNCATE TABLE live_premiere_attendees CASCADE;
TRUNCATE TABLE live_moderation_logs CASCADE;
TRUNCATE TABLE live_analytics_snapshots CASCADE;
TRUNCATE TABLE live_leaderboard_entries CASCADE;
TRUNCATE TABLE live_milestone_achievements CASCADE;
TRUNCATE TABLE live_effects_history CASCADE;
TRUNCATE TABLE live_top_supporters CASCADE;

-- Clean gaming tables
TRUNCATE TABLE gaming_teams CASCADE;
TRUNCATE TABLE gaming_team_members CASCADE;
TRUNCATE TABLE gaming_tournaments CASCADE;
TRUNCATE TABLE tournament_participants CASCADE;
TRUNCATE TABLE tournament_matches CASCADE;
TRUNCATE TABLE tournament_prize_distribution CASCADE;
TRUNCATE TABLE gaming_live_sessions CASCADE;
TRUNCATE TABLE gaming_leaderboards CASCADE;
TRUNCATE TABLE game_interactions CASCADE;
TRUNCATE TABLE game_leaderboard CASCADE;
TRUNCATE TABLE internal_game_results CASCADE;
TRUNCATE TABLE gaming_rules_acceptance CASCADE;
TRUNCATE TABLE gaming_stream_stats CASCADE;

-- Clean monetization tables
TRUNCATE TABLE subscriptions CASCADE;
TRUNCATE TABLE tips CASCADE;
TRUNCATE TABLE creator_support CASCADE;
TRUNCATE TABLE transactions CASCADE;
TRUNCATE TABLE trucoin_transactions CASCADE;
TRUNCATE TABLE revenue_transactions CASCADE;
TRUNCATE TABLE withdrawal_requests CASCADE;
TRUNCATE TABLE revenue_holds CASCADE;
TRUNCATE TABLE creator_monetization_status CASCADE;
TRUNCATE TABLE monetization_suspensions CASCADE;

-- Clean merchandise and products
TRUNCATE TABLE merchandise_products CASCADE;
TRUNCATE TABLE merchandise_orders CASCADE;
TRUNCATE TABLE merchandise_order_items CASCADE;
TRUNCATE TABLE digital_products CASCADE;
TRUNCATE TABLE digital_product_modules CASCADE;
TRUNCATE TABLE digital_product_purchases CASCADE;

-- Clean services and bookings
TRUNCATE TABLE services CASCADE;
TRUNCATE TABLE service_bookings CASCADE;

-- Clean music tables
TRUNCATE TABLE music_albums CASCADE;
TRUNCATE TABLE music_tracks CASCADE;
TRUNCATE TABLE music_streams CASCADE;
TRUNCATE TABLE music_royalties CASCADE;

-- Clean brand deals and sponsorships
TRUNCATE TABLE brand_deals CASCADE;
TRUNCATE TABLE sponsorship_deliverables CASCADE;
TRUNCATE TABLE video_sponsorships CASCADE;

-- Clean affiliate marketing
TRUNCATE TABLE affiliate_links CASCADE;
TRUNCATE TABLE affiliate_clicks CASCADE;
TRUNCATE TABLE affiliate_conversions CASCADE;

-- Clean advertising
TRUNCATE TABLE ad_campaigns CASCADE;
TRUNCATE TABLE ad_impressions CASCADE;

-- Clean communities
TRUNCATE TABLE communities CASCADE;
TRUNCATE TABLE community_members CASCADE;
TRUNCATE TABLE community_posts CASCADE;
TRUNCATE TABLE post_comments CASCADE;
TRUNCATE TABLE post_reactions CASCADE;
TRUNCATE TABLE premium_access CASCADE;
TRUNCATE TABLE user_reputation CASCADE;

-- Clean notifications
TRUNCATE TABLE notifications CASCADE;
TRUNCATE TABLE notification_groups CASCADE;
TRUNCATE TABLE notification_delivery_log CASCADE;
TRUNCATE TABLE user_notification_behavior CASCADE;

-- Clean messages
TRUNCATE TABLE messages CASCADE;

-- Clean moderation
TRUNCATE TABLE content_reports CASCADE;
TRUNCATE TABLE moderation_votes CASCADE;

-- Clean arena/fund
TRUNCATE TABLE arena_transactions CASCADE;

-- Clean user badges and achievements
TRUNCATE TABLE user_earned_badges CASCADE;
TRUNCATE TABLE user_wallets CASCADE;

-- Clean support tickets
TRUNCATE TABLE support_tickets CASCADE;

-- Clean profile interactions
TRUNCATE TABLE profile_reviews CASCADE;
TRUNCATE TABLE profile_shares CASCADE;

-- Clean payment methods
TRUNCATE TABLE payment_methods CASCADE;

-- Clean social links
TRUNCATE TABLE social_links CASCADE;

-- Clean terms acceptance
TRUNCATE TABLE live_terms_acceptance CASCADE;
TRUNCATE TABLE partner_program_acceptances CASCADE;

-- Clean polls
TRUNCATE TABLE poll_votes CASCADE;

-- DO NOT truncate these tables as they contain configuration/catalog data:
-- profiles (user accounts)
-- live_game_templates
-- live_gift_catalog
-- live_gift_effects
-- live_gift_packs
-- badge_types
-- user_badges
-- games
-- game_categories
-- game_publishers
-- goroti_internal_games
-- gaming_seasons
-- monetization_tiers
-- arena_fund
-- live_terms_versions
-- game_tournaments