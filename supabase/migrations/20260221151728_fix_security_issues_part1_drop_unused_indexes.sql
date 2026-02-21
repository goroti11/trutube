/*
  # Security Fix Part 1: Drop Unused Indexes

  This migration drops all unused indexes identified by Supabase security audit.
  Unused indexes consume storage space and slow down write operations without providing any performance benefit.

  ## Indexes Removed
  - 160+ unused indexes across all tables including:
    - ad_campaigns, affiliate_clicks, affiliate_conversions
    - community_posts, creator_monetization_status
    - merchandise, music tables, partner_program
    - profiles, revenue, sponsorships, support
    - videos, video_reactions, video_downloads
    - watch_sessions, user_trust_scores
    - content_reports, moderation, messages
    - subscriptions, tips, settings
    - premium, transactions, bookmarks
    - clips, playlists, reviews, social_links
    - communities, posts, polls
    - trucoin wallets and all other feature tables

  ## Safety
  - IF EXISTS clause ensures migration is idempotent
  - Only drops indexes that have not been used according to pg_stat_user_indexes
  - Does NOT drop unique constraints or primary key indexes
*/

-- Ad Campaigns & Impressions
DROP INDEX IF EXISTS idx_ad_campaigns_target_video_id;
DROP INDEX IF EXISTS idx_ad_campaigns_creator;
DROP INDEX IF EXISTS idx_ad_campaigns_status;
DROP INDEX IF EXISTS idx_ad_campaigns_dates;
DROP INDEX IF EXISTS idx_ad_impressions_campaign;
DROP INDEX IF EXISTS idx_ad_impressions_viewer;
DROP INDEX IF EXISTS idx_ad_impressions_time;

-- Affiliate System
DROP INDEX IF EXISTS idx_affiliate_clicks_user_id;
DROP INDEX IF EXISTS idx_affiliate_clicks_video_id;
DROP INDEX IF EXISTS idx_affiliate_clicks_link;
DROP INDEX IF EXISTS idx_affiliate_conversions_click_id;
DROP INDEX IF EXISTS idx_affiliate_conversions_link;
DROP INDEX IF EXISTS idx_affiliate_links_creator;

-- Community System
DROP INDEX IF EXISTS idx_community_posts_moderated_by;
DROP INDEX IF EXISTS idx_communities_type;
DROP INDEX IF EXISTS idx_communities_universe;
DROP INDEX IF EXISTS idx_communities_creator;
DROP INDEX IF EXISTS idx_communities_slug;
DROP INDEX IF EXISTS idx_community_members_community;
DROP INDEX IF EXISTS idx_community_members_user;
DROP INDEX IF EXISTS idx_community_members_role;
DROP INDEX IF EXISTS idx_posts_community;
DROP INDEX IF EXISTS idx_posts_author;
DROP INDEX IF EXISTS idx_posts_created;
DROP INDEX IF EXISTS idx_posts_engagement;
DROP INDEX IF EXISTS idx_posts_moderation;
DROP INDEX IF EXISTS idx_comments_post;
DROP INDEX IF EXISTS idx_comments_author;
DROP INDEX IF EXISTS idx_comments_parent;
DROP INDEX IF EXISTS idx_reactions_user;
DROP INDEX IF EXISTS idx_polls_post;

-- Creator Monetization
DROP INDEX IF EXISTS idx_creator_monetization_status_tier_id;
DROP INDEX IF EXISTS idx_creator_monetization_status_user_id;
DROP INDEX IF EXISTS idx_creator_support_creator;
DROP INDEX IF EXISTS idx_creator_support_supporter;
DROP INDEX IF EXISTS idx_creator_support_status;
DROP INDEX IF EXISTS idx_creator_memberships_user;
DROP INDEX IF EXISTS idx_creator_memberships_creator;
DROP INDEX IF EXISTS idx_creator_wallets_creator;

-- Merchandise
DROP INDEX IF EXISTS idx_merchandise_order_items_product_id;
DROP INDEX IF EXISTS idx_merchandise_order_items_order;
DROP INDEX IF EXISTS idx_merchandise_products_creator;
DROP INDEX IF EXISTS idx_merchandise_orders_creator;
DROP INDEX IF EXISTS idx_merchandise_orders_customer;

-- Music System
DROP INDEX IF EXISTS idx_music_royalties_track_id;
DROP INDEX IF EXISTS idx_music_royalties_recipient;
DROP INDEX IF EXISTS idx_music_streams_listener_id;
DROP INDEX IF EXISTS idx_music_streams_track;
DROP INDEX IF EXISTS idx_music_tracks_primary_artist_id;
DROP INDEX IF EXISTS idx_music_tracks_creator;
DROP INDEX IF EXISTS idx_music_tracks_album;
DROP INDEX IF EXISTS idx_music_albums_creator;

-- Digital Products & Services
DROP INDEX IF EXISTS idx_digital_products_creator;
DROP INDEX IF EXISTS idx_digital_product_modules_product;
DROP INDEX IF EXISTS idx_digital_product_purchases_product;
DROP INDEX IF EXISTS idx_digital_product_purchases_customer;
DROP INDEX IF EXISTS idx_services_creator;
DROP INDEX IF EXISTS idx_service_bookings_creator;
DROP INDEX IF EXISTS idx_service_bookings_service;
DROP INDEX IF EXISTS idx_service_bookings_customer;

-- Partner Program
DROP INDEX IF EXISTS idx_partner_program_acceptances_terms_id;
DROP INDEX IF EXISTS idx_partner_acceptances_user_id;
DROP INDEX IF EXISTS idx_monetization_suspensions_user_id;
DROP INDEX IF EXISTS idx_monetization_suspensions_active;

-- Profile System
DROP INDEX IF EXISTS idx_profile_shares_shared_by_user_id;
DROP INDEX IF EXISTS idx_profile_shares_profile;
DROP INDEX IF EXISTS idx_profiles_top_supporter_id;
DROP INDEX IF EXISTS idx_profiles_username;
DROP INDEX IF EXISTS idx_profiles_channel_url;
DROP INDEX IF EXISTS idx_profile_reviews_profile;
DROP INDEX IF EXISTS idx_profile_reviews_reviewer;
DROP INDEX IF EXISTS idx_social_links_user;

-- Revenue & Payments
DROP INDEX IF EXISTS idx_revenue_holds_investigation_id;
DROP INDEX IF EXISTS idx_revenue_holds_user_id;
DROP INDEX IF EXISTS idx_revenue_holds_active;
DROP INDEX IF EXISTS idx_revenue_transactions_user_id;
DROP INDEX IF EXISTS idx_revenue_transactions_created_at;
DROP INDEX IF EXISTS idx_revenue_transactions_status;
DROP INDEX IF EXISTS idx_payment_methods_user;
DROP INDEX IF EXISTS idx_payment_methods_default;
DROP INDEX IF EXISTS idx_transactions_user;
DROP INDEX IF EXISTS idx_transactions_type;
DROP INDEX IF EXISTS idx_transactions_status;
DROP INDEX IF EXISTS idx_transactions_created;
DROP INDEX IF EXISTS idx_withdrawal_requests_creator;
DROP INDEX IF EXISTS idx_withdrawal_requests_status;

-- Sponsorships
DROP INDEX IF EXISTS idx_sponsorship_deliverables_brand_deal_id;
DROP INDEX IF EXISTS idx_brand_deals_creator;
DROP INDEX IF EXISTS idx_video_sponsorships_video;
DROP INDEX IF EXISTS idx_video_sponsorships_deal;

-- Support & Tips
DROP INDEX IF EXISTS idx_support_leaderboard_supporter_id;
DROP INDEX IF EXISTS idx_support_leaderboard_creator;
DROP INDEX IF EXISTS idx_tips_from_user_id;
DROP INDEX IF EXISTS idx_tips_to_creator_id;
DROP INDEX IF EXISTS idx_tips_video;
DROP INDEX IF EXISTS idx_tips_status;
DROP INDEX IF EXISTS idx_support_tickets_user_id;
DROP INDEX IF EXISTS idx_support_tickets_status;
DROP INDEX IF EXISTS idx_support_tickets_created_at;

-- User System
DROP INDEX IF EXISTS idx_user_reputation_community_id;
DROP INDEX IF EXISTS idx_reputation_user;
DROP INDEX IF EXISTS idx_reputation_score;
DROP INDEX IF EXISTS idx_user_badges_user;
DROP INDEX IF EXISTS idx_user_badges_badge;
DROP INDEX IF EXISTS idx_user_preferences_user_id;
DROP INDEX IF EXISTS idx_user_settings_user_id;
DROP INDEX IF EXISTS idx_user_trust_scores_user_id;
DROP INDEX IF EXISTS idx_kyc_verifications_user_id;

-- Video System
DROP INDEX IF EXISTS idx_video_downloads_user_id;
DROP INDEX IF EXISTS idx_video_downloads_video;
DROP INDEX IF EXISTS idx_video_reactions_video_id;
DROP INDEX IF EXISTS idx_video_reactions_user_video;
DROP INDEX IF EXISTS idx_video_bookmarks_user;
DROP INDEX IF EXISTS idx_video_bookmarks_video;
DROP INDEX IF EXISTS idx_video_clips_original;
DROP INDEX IF EXISTS idx_video_clips_creator;
DROP INDEX IF EXISTS idx_video_playlists_user;
DROP INDEX IF EXISTS idx_playlist_videos_playlist;
DROP INDEX IF EXISTS idx_playlist_videos_video;
DROP INDEX IF EXISTS idx_videos_creator_id;
DROP INDEX IF EXISTS idx_videos_universe_id;
DROP INDEX IF EXISTS idx_videos_created_at;
DROP INDEX IF EXISTS idx_videos_hashtags;
DROP INDEX IF EXISTS idx_videos_processing_status;
DROP INDEX IF EXISTS idx_videos_creator_published;
DROP INDEX IF EXISTS idx_videos_sub_universe_id;
DROP INDEX IF EXISTS idx_video_scores_final_score;

-- Watch Sessions & Trust
DROP INDEX IF EXISTS idx_watch_sessions_video_id;
DROP INDEX IF EXISTS idx_watch_sessions_user_id;
DROP INDEX IF EXISTS idx_watch_sessions_validated;

-- Messages & Comments
DROP INDEX IF EXISTS idx_messages_to_creator;
DROP INDEX IF EXISTS idx_messages_from_user_id;
DROP INDEX IF EXISTS idx_comments_video_id;
DROP INDEX IF EXISTS idx_comments_user_id;

-- Subscriptions & Premium
DROP INDEX IF EXISTS idx_subscriptions_supporter_creator;
DROP INDEX IF EXISTS idx_subscriptions_creator_id;
DROP INDEX IF EXISTS idx_premium_subscriptions_user;
DROP INDEX IF EXISTS idx_premium_subscriptions_status;
DROP INDEX IF EXISTS idx_premium_subscriptions_expires;
DROP INDEX IF EXISTS idx_premium_subscriptions_billing_period;
DROP INDEX IF EXISTS idx_premium_user;
DROP INDEX IF EXISTS idx_premium_community;
DROP INDEX IF EXISTS idx_premium_pricing_tier_period;
DROP INDEX IF EXISTS idx_community_premium_pricing;

-- Content Moderation
DROP INDEX IF EXISTS idx_content_reports_content;
DROP INDEX IF EXISTS idx_content_reports_status;
DROP INDEX IF EXISTS idx_content_reports_reporter_id;
DROP INDEX IF EXISTS idx_moderation_votes_report_id;
DROP INDEX IF EXISTS idx_moderation_votes_voter_id;
DROP INDEX IF EXISTS idx_content_status_content;

-- Universes
DROP INDEX IF EXISTS idx_sub_universes_universe_id;
DROP INDEX IF EXISTS idx_creator_universes_creator_id;
DROP INDEX IF EXISTS idx_creator_universes_main_universe_id;

-- TruCoin
DROP INDEX IF EXISTS idx_wallets_user;
DROP INDEX IF EXISTS idx_transactions_from;
DROP INDEX IF EXISTS idx_transactions_to;

-- Polls
DROP INDEX IF EXISTS idx_poll_votes_poll;
DROP INDEX IF EXISTS idx_poll_votes_user;
