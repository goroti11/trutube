/*
  # Security Fix Part 8: Fix Remaining Function Search Paths

  This migration fixes the remaining functions with role-mutable search paths.
  These are trigger functions and utility functions that need explicit search paths.

  ## Functions Fixed (13 functions)
  - Update trigger functions
  - Monetization stat tracking functions
  - Community counter functions
  - Premium tier functions
  - URL generation functions

  ## Security Impact
  - Prevents search path hijacking attacks
  - Ensures functions execute in safe schema context
*/

-- Trigger Functions
ALTER FUNCTION update_updated_at_column() SET search_path = public, pg_catalog, pg_temp;

-- Monetization Stats Functions
ALTER FUNCTION update_affiliate_link_clicks() SET search_path = public, pg_catalog, pg_temp;
ALTER FUNCTION update_affiliate_link_conversions() SET search_path = public, pg_catalog, pg_temp;
ALTER FUNCTION update_product_sales() SET search_path = public, pg_catalog, pg_temp;
ALTER FUNCTION update_music_track_streams() SET search_path = public, pg_catalog, pg_temp;
ALTER FUNCTION update_digital_product_stats() SET search_path = public, pg_catalog, pg_temp;
ALTER FUNCTION update_service_booking_stats() SET search_path = public, pg_catalog, pg_temp;

-- Community Functions
ALTER FUNCTION update_community_member_count() SET search_path = public, pg_catalog, pg_temp;
ALTER FUNCTION update_community_post_count() SET search_path = public, pg_catalog, pg_temp;

-- Premium & Appearance Functions
ALTER FUNCTION create_default_appearance() SET search_path = public, pg_catalog, pg_temp;
ALTER FUNCTION get_tier_benefits(p_tier text) SET search_path = public, pg_catalog, pg_temp;
ALTER FUNCTION calculate_subscription_price(p_tier text, p_billing_period text) SET search_path = public, pg_catalog, pg_temp;

-- URL Generation
ALTER FUNCTION generate_channel_url(p_username text) SET search_path = public, pg_catalog, pg_temp;
