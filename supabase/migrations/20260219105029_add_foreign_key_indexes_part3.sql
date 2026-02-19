/*
  # Add Foreign Key Indexes - Part 3

  1. Performance Optimization
    - Add indexes on remaining foreign key columns

  2. Tables Covered
    - partner_program_acceptances, payment_methods, playlist_videos,
      poll_votes, post_comments, post_reactions, premium_access,
      profile_reviews, profile_shares, profiles, referrals,
      revenue_holds, revenue_transactions, service_bookings, services,
      social_links, sponsorship_deliverables, sub_universes,
      subscriptions, support_leaderboard, support_tickets, tips,
      transactions, trucoin_transactions, user_badges, user_reputation,
      video_bookmarks, video_clips, video_downloads, video_playlists,
      video_reactions, video_share_events, video_sponsorships, videos,
      watch_sessions, withdrawal_requests
*/

CREATE INDEX IF NOT EXISTS idx_fk_partner_program_acceptances_terms_id ON public.partner_program_acceptances (terms_id);
CREATE INDEX IF NOT EXISTS idx_fk_payment_methods_user_id ON public.payment_methods (user_id);
CREATE INDEX IF NOT EXISTS idx_fk_playlist_videos_video_id ON public.playlist_videos (video_id);
CREATE INDEX IF NOT EXISTS idx_fk_poll_votes_user_id ON public.poll_votes (user_id);
CREATE INDEX IF NOT EXISTS idx_fk_post_comments_author_id ON public.post_comments (author_id);
CREATE INDEX IF NOT EXISTS idx_fk_post_comments_parent_comment_id ON public.post_comments (parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_fk_post_comments_post_id ON public.post_comments (post_id);
CREATE INDEX IF NOT EXISTS idx_fk_post_reactions_user_id ON public.post_reactions (user_id);
CREATE INDEX IF NOT EXISTS idx_fk_premium_access_community_id ON public.premium_access (community_id);
CREATE INDEX IF NOT EXISTS idx_fk_profile_reviews_profile_id ON public.profile_reviews (profile_id);
CREATE INDEX IF NOT EXISTS idx_fk_profile_shares_profile_id ON public.profile_shares (profile_id);
CREATE INDEX IF NOT EXISTS idx_fk_profile_shares_shared_by_user_id ON public.profile_shares (shared_by_user_id);
CREATE INDEX IF NOT EXISTS idx_fk_profiles_top_supporter_id ON public.profiles (top_supporter_id);
CREATE INDEX IF NOT EXISTS idx_fk_referrals_referred_id ON public.referrals (referred_id);
CREATE INDEX IF NOT EXISTS idx_fk_referrals_referrer_id ON public.referrals (referrer_id);
CREATE INDEX IF NOT EXISTS idx_fk_revenue_holds_investigation_id ON public.revenue_holds (investigation_id);
CREATE INDEX IF NOT EXISTS idx_fk_revenue_holds_user_id ON public.revenue_holds (user_id);
CREATE INDEX IF NOT EXISTS idx_fk_revenue_transactions_user_id ON public.revenue_transactions (user_id);
CREATE INDEX IF NOT EXISTS idx_fk_service_bookings_creator_id ON public.service_bookings (creator_id);
CREATE INDEX IF NOT EXISTS idx_fk_service_bookings_customer_id ON public.service_bookings (customer_id);
CREATE INDEX IF NOT EXISTS idx_fk_service_bookings_service_id ON public.service_bookings (service_id);
CREATE INDEX IF NOT EXISTS idx_fk_services_creator_id ON public.services (creator_id);
CREATE INDEX IF NOT EXISTS idx_fk_social_links_user_id ON public.social_links (user_id);
CREATE INDEX IF NOT EXISTS idx_fk_sponsorship_deliverables_brand_deal_id ON public.sponsorship_deliverables (brand_deal_id);
CREATE INDEX IF NOT EXISTS idx_fk_sub_universes_universe_id ON public.sub_universes (universe_id);
CREATE INDEX IF NOT EXISTS idx_fk_subscriptions_creator_id ON public.subscriptions (creator_id);
CREATE INDEX IF NOT EXISTS idx_fk_subscriptions_supporter_id ON public.subscriptions (supporter_id);
CREATE INDEX IF NOT EXISTS idx_fk_support_leaderboard_supporter_id ON public.support_leaderboard (supporter_id);
CREATE INDEX IF NOT EXISTS idx_fk_support_tickets_user_id ON public.support_tickets (user_id);
CREATE INDEX IF NOT EXISTS idx_fk_tips_from_user_id ON public.tips (from_user_id);
CREATE INDEX IF NOT EXISTS idx_fk_tips_to_creator_id ON public.tips (to_creator_id);
CREATE INDEX IF NOT EXISTS idx_fk_tips_video_id ON public.tips (video_id);
CREATE INDEX IF NOT EXISTS idx_fk_transactions_user_id ON public.transactions (user_id);
CREATE INDEX IF NOT EXISTS idx_fk_trucoin_transactions_from_user_id ON public.trucoin_transactions (from_user_id);
CREATE INDEX IF NOT EXISTS idx_fk_trucoin_transactions_to_user_id ON public.trucoin_transactions (to_user_id);
CREATE INDEX IF NOT EXISTS idx_fk_user_badges_badge_type_id ON public.user_badges (badge_type_id);
CREATE INDEX IF NOT EXISTS idx_fk_user_reputation_community_id ON public.user_reputation (community_id);
CREATE INDEX IF NOT EXISTS idx_fk_video_bookmarks_video_id ON public.video_bookmarks (video_id);
CREATE INDEX IF NOT EXISTS idx_fk_video_clips_creator_id ON public.video_clips (creator_id);
CREATE INDEX IF NOT EXISTS idx_fk_video_clips_original_video_id ON public.video_clips (original_video_id);
CREATE INDEX IF NOT EXISTS idx_fk_video_downloads_user_id ON public.video_downloads (user_id);
CREATE INDEX IF NOT EXISTS idx_fk_video_downloads_video_id ON public.video_downloads (video_id);
CREATE INDEX IF NOT EXISTS idx_fk_video_playlists_user_id ON public.video_playlists (user_id);
CREATE INDEX IF NOT EXISTS idx_fk_video_reactions_video_id ON public.video_reactions (video_id);
CREATE INDEX IF NOT EXISTS idx_fk_video_share_events_shared_by ON public.video_share_events (shared_by);
CREATE INDEX IF NOT EXISTS idx_fk_video_sponsorships_brand_deal_id ON public.video_sponsorships (brand_deal_id);
CREATE INDEX IF NOT EXISTS idx_fk_video_sponsorships_video_id ON public.video_sponsorships (video_id);
CREATE INDEX IF NOT EXISTS idx_fk_videos_creator_id ON public.videos (creator_id);
CREATE INDEX IF NOT EXISTS idx_fk_videos_sub_universe_id ON public.videos (sub_universe_id);
CREATE INDEX IF NOT EXISTS idx_fk_videos_universe_id ON public.videos (universe_id);
CREATE INDEX IF NOT EXISTS idx_fk_watch_sessions_user_id ON public.watch_sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_fk_watch_sessions_video_id ON public.watch_sessions (video_id);
CREATE INDEX IF NOT EXISTS idx_fk_withdrawal_requests_creator_id ON public.withdrawal_requests (creator_id);