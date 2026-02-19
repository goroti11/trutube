/*
  # Add Missing Foreign Key Indexes

  1. Performance Improvement
    - Adds indexes for all unindexed foreign keys
    - Improves JOIN performance and foreign key constraint checks
    - Covers 32 foreign key columns across multiple tables

  2. Tables Affected
    - Ad campaigns, affiliate system, channels, community
    - Marketplace, merchandise, music, partner program
    - Profiles, referrals, revenue, services, videos
*/

-- Ad campaigns
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_target_video_id 
ON ad_campaigns(target_video_id);

-- Affiliate system
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_user_id 
ON affiliate_clicks(user_id);

CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_video_id 
ON affiliate_clicks(video_id);

CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_click_id 
ON affiliate_conversions(click_id);

-- Channel collaborators
CREATE INDEX IF NOT EXISTS idx_channel_collaborators_invited_by 
ON channel_collaborators(invited_by);

-- Community
CREATE INDEX IF NOT EXISTS idx_community_posts_moderated_by 
ON community_posts(moderated_by);

-- Monetization
CREATE INDEX IF NOT EXISTS idx_creator_monetization_status_tier_id 
ON creator_monetization_status(tier_id);

-- Marketplace
CREATE INDEX IF NOT EXISTS idx_marketplace_disputes_opened_by 
ON marketplace_disputes(opened_by);

CREATE INDEX IF NOT EXISTS idx_marketplace_disputes_resolved_by 
ON marketplace_disputes(resolved_by);

CREATE INDEX IF NOT EXISTS idx_marketplace_order_messages_sender_id 
ON marketplace_order_messages(sender_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_orders_service_id 
ON marketplace_orders(service_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_reviewer_id 
ON marketplace_reviews(reviewer_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_services_user_id 
ON marketplace_services(user_id);

-- Merchandise
CREATE INDEX IF NOT EXISTS idx_merchandise_order_items_product_id 
ON merchandise_order_items(product_id);

-- Music
CREATE INDEX IF NOT EXISTS idx_music_royalties_track_id 
ON music_royalties(track_id);

CREATE INDEX IF NOT EXISTS idx_music_royalty_payments_purchase_id 
ON music_royalty_payments(purchase_id);

CREATE INDEX IF NOT EXISTS idx_music_royalty_payments_split_id 
ON music_royalty_payments(split_id);

CREATE INDEX IF NOT EXISTS idx_music_sale_preorders_purchase_id 
ON music_sale_preorders(purchase_id);

CREATE INDEX IF NOT EXISTS idx_music_streams_listener_id 
ON music_streams(listener_id);

CREATE INDEX IF NOT EXISTS idx_music_tracks_primary_artist_id 
ON music_tracks(primary_artist_id);

-- Partner program
CREATE INDEX IF NOT EXISTS idx_partner_program_acceptances_terms_id 
ON partner_program_acceptances(terms_id);

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profile_shares_shared_by_user_id 
ON profile_shares(shared_by_user_id);

CREATE INDEX IF NOT EXISTS idx_profiles_top_supporter_id 
ON profiles(top_supporter_id);

-- Referrals
CREATE INDEX IF NOT EXISTS idx_referrals_referred_id 
ON referrals(referred_id);

-- Revenue
CREATE INDEX IF NOT EXISTS idx_revenue_holds_investigation_id 
ON revenue_holds(investigation_id);

-- Services
CREATE INDEX IF NOT EXISTS idx_service_bookings_creator_id 
ON service_bookings(creator_id);

-- Sponsorships
CREATE INDEX IF NOT EXISTS idx_sponsorship_deliverables_brand_deal_id 
ON sponsorship_deliverables(brand_deal_id);

-- Support
CREATE INDEX IF NOT EXISTS idx_support_leaderboard_supporter_id 
ON support_leaderboard(supporter_id);

-- User reputation
CREATE INDEX IF NOT EXISTS idx_user_reputation_community_id 
ON user_reputation(community_id);

-- Videos
CREATE INDEX IF NOT EXISTS idx_video_downloads_user_id 
ON video_downloads(user_id);

CREATE INDEX IF NOT EXISTS idx_video_reactions_video_id 
ON video_reactions(video_id);

CREATE INDEX IF NOT EXISTS idx_video_share_events_shared_by 
ON video_share_events(shared_by);