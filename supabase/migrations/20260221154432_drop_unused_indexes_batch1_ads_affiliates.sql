/*
  # Drop Unused Indexes - Batch 1: Ads and Affiliates

  1. Performance Improvement
    - Remove unused indexes that consume storage and slow down writes
    - Focus on ad campaigns, impressions, and affiliate system indexes

  2. Indexes Removed
    - Ad campaigns and impressions indexes (4 indexes)
    - Affiliate links, clicks, and conversions indexes (7 indexes)
*/

-- Drop unused ad campaign indexes
DROP INDEX IF EXISTS idx_ad_campaigns_creator_id;
DROP INDEX IF EXISTS idx_ad_campaigns_target_video_id;
DROP INDEX IF EXISTS idx_ad_impressions_campaign_id;
DROP INDEX IF EXISTS idx_ad_impressions_viewer_id;

-- Drop unused affiliate system indexes
DROP INDEX IF EXISTS idx_affiliate_links_creator_id;
DROP INDEX IF EXISTS idx_affiliate_clicks_affiliate_link_id;
DROP INDEX IF EXISTS idx_affiliate_clicks_user_id;
DROP INDEX IF EXISTS idx_affiliate_clicks_video_id;
DROP INDEX IF EXISTS idx_affiliate_conversions_affiliate_link_id;
DROP INDEX IF EXISTS idx_affiliate_conversions_click_id;