/*
  # Drop Unused Indexes - Part 2

  1. Performance Optimization
    - Remove indexes that have never been used
    - Tables: profile_reviews, premium_subscriptions, ad_campaigns,
      ad_impressions, payment_methods, transactions, creator_wallets,
      withdrawal_requests, video_bookmarks, video_downloads, video_clips,
      video_playlists, playlist_videos, video_reactions, social_links,
      profile_shares
*/

DROP INDEX IF EXISTS idx_profile_reviews_profile;
DROP INDEX IF EXISTS idx_profile_reviews_reviewer;
DROP INDEX IF EXISTS idx_premium_subscriptions_user;
DROP INDEX IF EXISTS idx_premium_subscriptions_status;
DROP INDEX IF EXISTS idx_premium_subscriptions_expires;
DROP INDEX IF EXISTS idx_premium_subscriptions_billing_period;
DROP INDEX IF EXISTS idx_ad_campaigns_creator;
DROP INDEX IF EXISTS idx_ad_campaigns_status;
DROP INDEX IF EXISTS idx_ad_campaigns_dates;
DROP INDEX IF EXISTS idx_ad_campaigns_target_video_id;
DROP INDEX IF EXISTS idx_ad_impressions_campaign;
DROP INDEX IF EXISTS idx_ad_impressions_viewer;
DROP INDEX IF EXISTS idx_ad_impressions_time;
DROP INDEX IF EXISTS idx_payment_methods_user;
DROP INDEX IF EXISTS idx_payment_methods_default;
DROP INDEX IF EXISTS idx_transactions_user;
DROP INDEX IF EXISTS idx_transactions_type;
DROP INDEX IF EXISTS idx_transactions_status;
DROP INDEX IF EXISTS idx_transactions_created;
DROP INDEX IF EXISTS idx_creator_wallets_creator;
DROP INDEX IF EXISTS idx_withdrawal_requests_creator;
DROP INDEX IF EXISTS idx_withdrawal_requests_status;
DROP INDEX IF EXISTS idx_video_bookmarks_user;
DROP INDEX IF EXISTS idx_video_bookmarks_video;
DROP INDEX IF EXISTS idx_video_downloads_video;
DROP INDEX IF EXISTS idx_video_downloads_user_id;
DROP INDEX IF EXISTS idx_video_clips_original;
DROP INDEX IF EXISTS idx_video_clips_creator;
DROP INDEX IF EXISTS idx_video_playlists_user;
DROP INDEX IF EXISTS idx_playlist_videos_playlist;
DROP INDEX IF EXISTS idx_playlist_videos_video;
DROP INDEX IF EXISTS idx_video_reactions_user_video;
DROP INDEX IF EXISTS idx_video_reactions_video_id;
DROP INDEX IF EXISTS idx_social_links_user;
DROP INDEX IF EXISTS idx_profile_shares_profile;
DROP INDEX IF EXISTS idx_profile_shares_shared_by_user_id;