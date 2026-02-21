/*
  # Security Fix Part 4: Fix Function Search Paths

  This migration fixes functions with role-mutable search paths by setting explicit
  search_path to prevent search path hijacking attacks.

  ## Functions Fixed (33 SECURITY DEFINER functions)
  - All SECURITY DEFINER functions get explicit search_path
  - Set to 'public, pg_catalog, pg_temp' for safety
  - Prevents malicious schema injection

  ## Strategy
  - ALTER FUNCTION with SET search_path = public, pg_catalog, pg_temp
  - Uses correct function signatures from database
  - Maintains functionality while improving security
*/

-- Profile & User Functions
ALTER FUNCTION check_membership_expiration() SET search_path = public, pg_catalog, pg_temp;
ALTER FUNCTION handle_new_user() SET search_path = public, pg_catalog, pg_temp;
ALTER FUNCTION handle_updated_at() SET search_path = public, pg_catalog, pg_temp;

-- Video Functions
ALTER FUNCTION validate_video_upload() SET search_path = public, pg_catalog, pg_temp;
ALTER FUNCTION get_creator_video_count(creator_uuid uuid) SET search_path = public, pg_catalog, pg_temp;
ALTER FUNCTION increment_view_count(video_id uuid) SET search_path = public, pg_catalog, pg_temp;
ALTER FUNCTION increment_comment_count(video_id uuid) SET search_path = public, pg_catalog, pg_temp;
ALTER FUNCTION calculate_video_score(video_id uuid) SET search_path = public, pg_catalog, pg_temp;
ALTER FUNCTION toggle_video_bookmark(p_user_id uuid, p_video_id uuid) SET search_path = public, pg_catalog, pg_temp;
ALTER FUNCTION toggle_video_reaction(p_user_id uuid, p_video_id uuid, p_reaction_type text) SET search_path = public, pg_catalog, pg_temp;
ALTER FUNCTION add_video_to_playlist(p_playlist_id uuid, p_video_id uuid) SET search_path = public, pg_catalog, pg_temp;

-- Monetization Functions
ALTER FUNCTION check_monetization_eligibility(p_user_id uuid) SET search_path = public, pg_catalog, pg_temp;

-- Revenue & Payment Functions
ALTER FUNCTION update_creator_revenue(p_creator_id uuid, p_amount numeric, p_type text) SET search_path = public, pg_catalog, pg_temp;
ALTER FUNCTION get_or_create_creator_wallet(p_creator_id uuid) SET search_path = public, pg_catalog, pg_temp;
ALTER FUNCTION process_tip_payment(p_tip_id uuid, p_transaction_id uuid) SET search_path = public, pg_catalog, pg_temp;
ALTER FUNCTION get_creator_earnings_breakdown(p_creator_id uuid) SET search_path = public, pg_catalog, pg_temp;
ALTER FUNCTION request_withdrawal(p_creator_id uuid, p_amount numeric, p_payment_method text, p_destination_details jsonb) SET search_path = public, pg_catalog, pg_temp;
ALTER FUNCTION get_top_tippers(p_creator_id uuid, p_limit integer) SET search_path = public, pg_catalog, pg_temp;
ALTER FUNCTION get_available_balance(p_user_id uuid) SET search_path = public, pg_catalog, pg_temp;

-- Premium & Subscription Functions
ALTER FUNCTION get_personalized_feed(p_user_id uuid, p_limit integer) SET search_path = public, pg_catalog, pg_temp;
ALTER FUNCTION check_user_premium(p_user_id uuid) SET search_path = public, pg_catalog, pg_temp;
ALTER FUNCTION user_has_premium_feature(p_user_id uuid, p_feature text) SET search_path = public, pg_catalog, pg_temp;
ALTER FUNCTION is_user_premium(user_id_param uuid) SET search_path = public, pg_catalog, pg_temp;

-- Community Functions
ALTER FUNCTION is_community_member(community_id_param uuid, user_id_param uuid) SET search_path = public, pg_catalog, pg_temp;
ALTER FUNCTION add_creator_as_owner() SET search_path = public, pg_catalog, pg_temp;

-- Ad System Functions
ALTER FUNCTION record_ad_impression(p_campaign_id uuid, p_ad_type text, p_ad_unit_id text, p_viewer_id uuid, p_page_location text) SET search_path = public, pg_catalog, pg_temp;
ALTER FUNCTION record_ad_click(p_impression_id uuid) SET search_path = public, pg_catalog, pg_temp;
ALTER FUNCTION get_active_campaigns_for_universe(p_universe_id uuid, p_limit integer) SET search_path = public, pg_catalog, pg_temp;

-- Profile Enhancement Functions
ALTER FUNCTION update_profile_review_stats() SET search_path = public, pg_catalog, pg_temp;
ALTER FUNCTION update_creator_support_stats() SET search_path = public, pg_catalog, pg_temp;

-- Legal & Terms Functions
ALTER FUNCTION has_accepted_latest_terms(p_user_id uuid) SET search_path = public, pg_catalog, pg_temp;

-- Trust & Security Functions
ALTER FUNCTION calculate_user_trust() SET search_path = public, pg_catalog, pg_temp;
ALTER FUNCTION validate_watch_session() SET search_path = public, pg_catalog, pg_temp;
