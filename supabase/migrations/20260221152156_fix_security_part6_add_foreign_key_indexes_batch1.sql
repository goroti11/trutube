/*
  # Security Fix Part 6: Add Foreign Key Indexes (Batch 1)

  This migration adds indexes for unindexed foreign keys to improve query performance.
  Foreign key columns without indexes can cause slow JOIN operations and constraint checks.

  ## Indexes Added (Batch 1 of 3)
  - Ad campaigns and impressions
  - Affiliate system (links, clicks, conversions)
  - Comments and community tables
  - Content moderation
  - Creator systems

  ## Performance Impact
  - Dramatically improves JOIN performance
  - Speeds up foreign key constraint validation
  - Optimizes queries filtering by foreign key columns
*/

-- Ad Campaigns & Impressions
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_creator_id ON ad_campaigns(creator_id);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_target_video_id ON ad_campaigns(target_video_id);
CREATE INDEX IF NOT EXISTS idx_ad_impressions_campaign_id ON ad_impressions(campaign_id);
CREATE INDEX IF NOT EXISTS idx_ad_impressions_viewer_id ON ad_impressions(viewer_id);

-- Affiliate System
CREATE INDEX IF NOT EXISTS idx_affiliate_links_creator_id ON affiliate_links(creator_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_affiliate_link_id ON affiliate_clicks(affiliate_link_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_user_id ON affiliate_clicks(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_video_id ON affiliate_clicks(video_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_affiliate_link_id ON affiliate_conversions(affiliate_link_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_click_id ON affiliate_conversions(click_id);

-- Comments & Videos
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_video_id ON comments(video_id);

-- Communities
CREATE INDEX IF NOT EXISTS idx_communities_creator_id ON communities(creator_id);
CREATE INDEX IF NOT EXISTS idx_community_members_user_id ON community_members(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_author_id ON community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_community_id ON community_posts(community_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_moderated_by ON community_posts(moderated_by);

-- Content Moderation
CREATE INDEX IF NOT EXISTS idx_content_reports_reporter_id ON content_reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_moderation_votes_voter_id ON moderation_votes(voter_id);

-- Creator Systems
CREATE INDEX IF NOT EXISTS idx_creator_memberships_creator_id ON creator_memberships(creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_monetization_status_tier_id ON creator_monetization_status(tier_id);
CREATE INDEX IF NOT EXISTS idx_creator_support_creator_id ON creator_support(creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_support_supporter_id ON creator_support(supporter_id);
CREATE INDEX IF NOT EXISTS idx_creator_universes_main_universe_id ON creator_universes(main_universe_id);

-- Brand Deals
CREATE INDEX IF NOT EXISTS idx_brand_deals_creator_id ON brand_deals(creator_id);
