/*
  # Fix Function Search Path - Part 2

  1. Security Fix
    - Set immutable search_path on remaining public functions
    - Prevents search_path injection attacks

  2. Functions Updated (second batch)
    - update_creator_revenue, update_profile_review_stats
    - calculate_video_score, get_personalized_feed
    - check_user_premium, record_ad_impression, record_ad_click
    - get_active_campaigns_for_universe, get_or_create_creator_wallet
    - generate_channel_url, request_withdrawal, get_top_tippers
    - toggle_video_bookmark, toggle_video_reaction, add_video_to_playlist
    - get_tier_benefits, check_membership_expiration
    - update_affiliate_link_clicks, check_monetization_eligibility
    - has_accepted_latest_terms, get_available_balance
    - calculate_subscription_price, is_user_premium, is_community_member
    - update_community_member_count, update_community_post_count
    - activate_channel_monetization_on_kyc, get_user_default_channel
    - can_create_additional_channel, handle_new_user
    - create_default_creator_channel
*/

ALTER FUNCTION public.update_creator_revenue(uuid, numeric, text) SET search_path = '';
ALTER FUNCTION public.update_profile_review_stats() SET search_path = '';
ALTER FUNCTION public.calculate_video_score(uuid) SET search_path = '';
ALTER FUNCTION public.get_personalized_feed(uuid, integer) SET search_path = '';
ALTER FUNCTION public.check_user_premium(uuid) SET search_path = '';
ALTER FUNCTION public.record_ad_impression(uuid, text, text, uuid, text) SET search_path = '';
ALTER FUNCTION public.record_ad_click(uuid) SET search_path = '';
ALTER FUNCTION public.get_active_campaigns_for_universe(uuid, integer) SET search_path = '';
ALTER FUNCTION public.get_or_create_creator_wallet(uuid) SET search_path = '';
ALTER FUNCTION public.generate_channel_url(text) SET search_path = '';
ALTER FUNCTION public.request_withdrawal(uuid, numeric, text, jsonb) SET search_path = '';
ALTER FUNCTION public.get_top_tippers(uuid, integer) SET search_path = '';
ALTER FUNCTION public.toggle_video_bookmark(uuid, uuid) SET search_path = '';
ALTER FUNCTION public.toggle_video_reaction(uuid, uuid, text) SET search_path = '';
ALTER FUNCTION public.add_video_to_playlist(uuid, uuid) SET search_path = '';
ALTER FUNCTION public.get_tier_benefits(text) SET search_path = '';
ALTER FUNCTION public.check_membership_expiration() SET search_path = '';
ALTER FUNCTION public.update_affiliate_link_clicks() SET search_path = '';
ALTER FUNCTION public.check_monetization_eligibility(uuid) SET search_path = '';
ALTER FUNCTION public.has_accepted_latest_terms(uuid) SET search_path = '';
ALTER FUNCTION public.get_available_balance(uuid) SET search_path = '';
ALTER FUNCTION public.calculate_subscription_price(text, text) SET search_path = '';
ALTER FUNCTION public.is_user_premium(uuid) SET search_path = '';
ALTER FUNCTION public.is_community_member(uuid, uuid) SET search_path = '';
ALTER FUNCTION public.update_community_member_count() SET search_path = '';
ALTER FUNCTION public.update_community_post_count() SET search_path = '';
ALTER FUNCTION public.activate_channel_monetization_on_kyc() SET search_path = '';
ALTER FUNCTION public.get_user_default_channel(uuid) SET search_path = '';
ALTER FUNCTION public.can_create_additional_channel(uuid) SET search_path = '';
ALTER FUNCTION public.handle_new_user() SET search_path = '';
ALTER FUNCTION public.create_default_creator_channel() SET search_path = '';