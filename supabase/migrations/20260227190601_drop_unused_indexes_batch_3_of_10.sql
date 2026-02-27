/*
  # Drop Unused Indexes - Batch 3/10
  
  Tables: premium_subscriptions, ad_campaigns, ad_impressions, video_bookmarks, video_downloads
*/

DROP INDEX IF EXISTS idx_premium_subscriptions_user;
DROP INDEX IF EXISTS idx_premium_subscriptions_status;
DROP INDEX IF EXISTS idx_premium_subscriptions_expires;
DROP INDEX IF EXISTS idx_ad_campaigns_creator;
DROP INDEX IF EXISTS idx_ad_campaigns_status;
DROP INDEX IF EXISTS idx_ad_campaigns_dates;
DROP INDEX IF EXISTS idx_ad_impressions_campaign;
DROP INDEX IF EXISTS idx_video_bookmarks_user;
DROP INDEX IF EXISTS idx_video_bookmarks_video;
DROP INDEX IF EXISTS idx_video_downloads_video;
DROP INDEX IF EXISTS idx_video_clips_original;
DROP INDEX IF EXISTS idx_payment_methods_user;
DROP INDEX IF EXISTS idx_payment_methods_default;
DROP INDEX IF EXISTS idx_transactions_user;
DROP INDEX IF EXISTS idx_transactions_type;
DROP INDEX IF EXISTS idx_transactions_status;
DROP INDEX IF EXISTS idx_transactions_created;
DROP INDEX IF EXISTS idx_tips_video;
DROP INDEX IF EXISTS idx_tips_status;
DROP INDEX IF EXISTS idx_creator_wallets_creator;
