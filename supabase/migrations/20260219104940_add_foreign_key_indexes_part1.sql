/*
  # Add Foreign Key Indexes - Part 1

  1. Performance Optimization
    - Add indexes on foreign key columns that lack covering indexes
    - Improves JOIN, DELETE cascade, and lookup performance

  2. Tables Covered
    - ad_campaigns, ad_impressions, affiliate_clicks, affiliate_conversions,
      affiliate_links, brand_deals, channel_collaborators, channel_playlists,
      comments, communities, community_members, community_posts,
      content_reports, creator_channels, creator_memberships,
      creator_monetization_status, creator_support, creator_universes
*/

CREATE INDEX IF NOT EXISTS idx_fk_ad_campaigns_creator_id ON public.ad_campaigns (creator_id);
CREATE INDEX IF NOT EXISTS idx_fk_ad_campaigns_target_video_id ON public.ad_campaigns (target_video_id);
CREATE INDEX IF NOT EXISTS idx_fk_ad_impressions_campaign_id ON public.ad_impressions (campaign_id);
CREATE INDEX IF NOT EXISTS idx_fk_ad_impressions_viewer_id ON public.ad_impressions (viewer_id);
CREATE INDEX IF NOT EXISTS idx_fk_affiliate_clicks_affiliate_link_id ON public.affiliate_clicks (affiliate_link_id);
CREATE INDEX IF NOT EXISTS idx_fk_affiliate_clicks_user_id ON public.affiliate_clicks (user_id);
CREATE INDEX IF NOT EXISTS idx_fk_affiliate_clicks_video_id ON public.affiliate_clicks (video_id);
CREATE INDEX IF NOT EXISTS idx_fk_affiliate_conversions_affiliate_link_id ON public.affiliate_conversions (affiliate_link_id);
CREATE INDEX IF NOT EXISTS idx_fk_affiliate_conversions_click_id ON public.affiliate_conversions (click_id);
CREATE INDEX IF NOT EXISTS idx_fk_affiliate_links_creator_id ON public.affiliate_links (creator_id);
CREATE INDEX IF NOT EXISTS idx_fk_brand_deals_creator_id ON public.brand_deals (creator_id);
CREATE INDEX IF NOT EXISTS idx_fk_channel_collaborators_invited_by ON public.channel_collaborators (invited_by);
CREATE INDEX IF NOT EXISTS idx_fk_channel_collaborators_user_id ON public.channel_collaborators (user_id);
CREATE INDEX IF NOT EXISTS idx_fk_channel_playlists_channel_id ON public.channel_playlists (channel_id);
CREATE INDEX IF NOT EXISTS idx_fk_channel_playlists_user_id ON public.channel_playlists (user_id);
CREATE INDEX IF NOT EXISTS idx_fk_comments_user_id ON public.comments (user_id);
CREATE INDEX IF NOT EXISTS idx_fk_comments_video_id ON public.comments (video_id);
CREATE INDEX IF NOT EXISTS idx_fk_communities_creator_id ON public.communities (creator_id);
CREATE INDEX IF NOT EXISTS idx_fk_community_members_user_id ON public.community_members (user_id);
CREATE INDEX IF NOT EXISTS idx_fk_community_posts_author_id ON public.community_posts (author_id);
CREATE INDEX IF NOT EXISTS idx_fk_community_posts_community_id ON public.community_posts (community_id);
CREATE INDEX IF NOT EXISTS idx_fk_community_posts_moderated_by ON public.community_posts (moderated_by);
CREATE INDEX IF NOT EXISTS idx_fk_content_reports_reporter_id ON public.content_reports (reporter_id);
CREATE INDEX IF NOT EXISTS idx_fk_creator_channels_legal_profile_id ON public.creator_channels (legal_profile_id);
CREATE INDEX IF NOT EXISTS idx_fk_creator_channels_user_id ON public.creator_channels (user_id);
CREATE INDEX IF NOT EXISTS idx_fk_creator_memberships_creator_id ON public.creator_memberships (creator_id);
CREATE INDEX IF NOT EXISTS idx_fk_creator_monetization_status_tier_id ON public.creator_monetization_status (tier_id);
CREATE INDEX IF NOT EXISTS idx_fk_creator_support_creator_id ON public.creator_support (creator_id);
CREATE INDEX IF NOT EXISTS idx_fk_creator_support_supporter_id ON public.creator_support (supporter_id);
CREATE INDEX IF NOT EXISTS idx_fk_creator_universes_main_universe_id ON public.creator_universes (main_universe_id);