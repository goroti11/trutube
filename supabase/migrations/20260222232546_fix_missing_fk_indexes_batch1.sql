/*
  # Fix Missing Foreign Key Indexes - Batch 1
  
  Add indexes for foreign keys on tables A-C to improve query performance
*/

-- ad_campaigns
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_creator_id ON ad_campaigns(creator_id);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_target_video_id ON ad_campaigns(target_video_id);

-- ad_impressions
CREATE INDEX IF NOT EXISTS idx_ad_impressions_campaign_id ON ad_impressions(campaign_id);
CREATE INDEX IF NOT EXISTS idx_ad_impressions_viewer_id ON ad_impressions(viewer_id);

-- affiliate_clicks
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_affiliate_link_id ON affiliate_clicks(affiliate_link_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_user_id ON affiliate_clicks(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_video_id ON affiliate_clicks(video_id);

-- affiliate_conversions
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_affiliate_link_id ON affiliate_conversions(affiliate_link_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_click_id ON affiliate_conversions(click_id);

-- affiliate_links
CREATE INDEX IF NOT EXISTS idx_affiliate_links_creator_id ON affiliate_links(creator_id);

-- arena_transactions
CREATE INDEX IF NOT EXISTS idx_arena_transactions_processed_by ON arena_transactions(processed_by);

-- brand_deals
CREATE INDEX IF NOT EXISTS idx_brand_deals_creator_id ON brand_deals(creator_id);

-- comments
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_video_id ON comments(video_id);

-- communities
CREATE INDEX IF NOT EXISTS idx_communities_creator_id ON communities(creator_id);

-- community_members
CREATE INDEX IF NOT EXISTS idx_community_members_user_id ON community_members(user_id);

-- community_posts
CREATE INDEX IF NOT EXISTS idx_community_posts_author_id ON community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_community_id ON community_posts(community_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_moderated_by ON community_posts(moderated_by);

-- content_reports
CREATE INDEX IF NOT EXISTS idx_content_reports_reporter_id ON content_reports(reporter_id);

-- creator_memberships
CREATE INDEX IF NOT EXISTS idx_creator_memberships_creator_id ON creator_memberships(creator_id);

-- creator_monetization_status
CREATE INDEX IF NOT EXISTS idx_creator_monetization_status_tier_id ON creator_monetization_status(tier_id);

-- creator_support
CREATE INDEX IF NOT EXISTS idx_creator_support_creator_id ON creator_support(creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_support_supporter_id ON creator_support(supporter_id);

-- creator_universes
CREATE INDEX IF NOT EXISTS idx_creator_universes_main_universe_id ON creator_universes(main_universe_id);