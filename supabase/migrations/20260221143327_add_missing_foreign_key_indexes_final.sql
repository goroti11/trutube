/*
  # Add Missing Foreign Key Indexes

  1. Performance Improvements
    - Adds indexes for all unindexed foreign keys
    - Improves query performance for joins and lookups

  2. Tables Affected
    - ad_campaigns, affiliate_clicks, affiliate_conversions
    - community_posts, creator_monetization_status
    - merchandise_order_items, music_royalties, music_streams, music_tracks
    - partner_program_acceptances, profile_shares, profiles
    - revenue_holds, service_bookings, sponsorship_deliverables
    - support_leaderboard, user_reputation, video_downloads, video_reactions
*/

-- ad_campaigns
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_target_video_id
  ON public.ad_campaigns(target_video_id);

-- affiliate_clicks
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_user_id
  ON public.affiliate_clicks(user_id);

CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_video_id
  ON public.affiliate_clicks(video_id);

-- affiliate_conversions
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_click_id
  ON public.affiliate_conversions(click_id);

-- community_posts
CREATE INDEX IF NOT EXISTS idx_community_posts_moderated_by
  ON public.community_posts(moderated_by);

-- creator_monetization_status
CREATE INDEX IF NOT EXISTS idx_creator_monetization_status_tier_id
  ON public.creator_monetization_status(tier_id);

-- merchandise_order_items
CREATE INDEX IF NOT EXISTS idx_merchandise_order_items_product_id
  ON public.merchandise_order_items(product_id);

-- music_royalties
CREATE INDEX IF NOT EXISTS idx_music_royalties_track_id
  ON public.music_royalties(track_id);

-- music_streams
CREATE INDEX IF NOT EXISTS idx_music_streams_listener_id
  ON public.music_streams(listener_id);

-- music_tracks
CREATE INDEX IF NOT EXISTS idx_music_tracks_primary_artist_id
  ON public.music_tracks(primary_artist_id);

-- partner_program_acceptances
CREATE INDEX IF NOT EXISTS idx_partner_program_acceptances_terms_id
  ON public.partner_program_acceptances(terms_id);

-- profile_shares
CREATE INDEX IF NOT EXISTS idx_profile_shares_shared_by_user_id
  ON public.profile_shares(shared_by_user_id);

-- profiles
CREATE INDEX IF NOT EXISTS idx_profiles_top_supporter_id
  ON public.profiles(top_supporter_id);

-- revenue_holds
CREATE INDEX IF NOT EXISTS idx_revenue_holds_investigation_id
  ON public.revenue_holds(investigation_id);

-- service_bookings
CREATE INDEX IF NOT EXISTS idx_service_bookings_creator_id
  ON public.service_bookings(creator_id);

-- sponsorship_deliverables
CREATE INDEX IF NOT EXISTS idx_sponsorship_deliverables_brand_deal_id
  ON public.sponsorship_deliverables(brand_deal_id);

-- support_leaderboard
CREATE INDEX IF NOT EXISTS idx_support_leaderboard_supporter_id
  ON public.support_leaderboard(supporter_id);

-- user_reputation
CREATE INDEX IF NOT EXISTS idx_user_reputation_community_id
  ON public.user_reputation(community_id);

-- video_downloads
CREATE INDEX IF NOT EXISTS idx_video_downloads_user_id
  ON public.video_downloads(user_id);

-- video_reactions
CREATE INDEX IF NOT EXISTS idx_video_reactions_video_id
  ON public.video_reactions(video_id);
