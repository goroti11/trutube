/*
  # Fix Function Search Path - Part 1

  1. Security Fix
    - Set immutable search_path on all public functions
    - Prevents search_path injection attacks
    - Uses SET search_path = '' for security

  2. Functions Updated (first batch)
    - validate_video_upload, get_creator_video_count
    - update_affiliate_link_conversions, update_product_sales
    - update_music_track_streams, update_digital_product_stats
    - update_service_booking_stats, add_creator_as_owner
    - process_tip_payment, get_creator_earnings_breakdown
    - create_default_appearance, update_creator_support_stats
    - user_has_premium_feature, update_updated_at_column
    - increment_view_count, increment_comment_count
*/

ALTER FUNCTION public.validate_video_upload() SET search_path = '';
ALTER FUNCTION public.get_creator_video_count(uuid) SET search_path = '';
ALTER FUNCTION public.update_affiliate_link_conversions() SET search_path = '';
ALTER FUNCTION public.update_product_sales() SET search_path = '';
ALTER FUNCTION public.update_music_track_streams() SET search_path = '';
ALTER FUNCTION public.update_digital_product_stats() SET search_path = '';
ALTER FUNCTION public.update_service_booking_stats() SET search_path = '';
ALTER FUNCTION public.add_creator_as_owner() SET search_path = '';
ALTER FUNCTION public.process_tip_payment(uuid, uuid) SET search_path = '';
ALTER FUNCTION public.get_creator_earnings_breakdown(uuid) SET search_path = '';
ALTER FUNCTION public.create_default_appearance() SET search_path = '';
ALTER FUNCTION public.update_creator_support_stats() SET search_path = '';
ALTER FUNCTION public.user_has_premium_feature(uuid, text) SET search_path = '';
ALTER FUNCTION public.update_updated_at_column() SET search_path = '';
ALTER FUNCTION public.increment_view_count(uuid) SET search_path = '';
ALTER FUNCTION public.increment_comment_count(uuid) SET search_path = '';