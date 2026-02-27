/*
  # Fix Function Search Paths - Safe Version
  
  Set search_path to public for existing functions
*/

DO $$
DECLARE
    func_record RECORD;
BEGIN
    FOR func_record IN 
        SELECT p.proname, pg_get_function_identity_arguments(p.oid) as args
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND p.proname IN (
            'create_default_appearance',
            'update_product_sales',
            'update_affiliate_link_conversions',
            'update_music_track_streams',
            'update_digital_product_stats',
            'update_service_booking_stats',
            'update_updated_at_column',
            'update_creator_revenue',
            'calculate_video_score',
            'get_personalized_feed',
            'check_user_premium',
            'record_ad_impression',
            'record_ad_click',
            'get_active_campaigns_for_universe',
            'get_or_create_creator_wallet',
            'add_creator_as_owner',
            'process_tip_payment',
            'get_creator_earnings_breakdown',
            'request_withdrawal',
            'get_top_tippers',
            'toggle_video_bookmark',
            'toggle_video_reaction',
            'add_video_to_playlist',
            'get_tier_benefits',
            'user_has_premium_feature',
            'update_profile_review_stats',
            'generate_channel_url',
            'update_creator_support_stats',
            'check_membership_expiration',
            'validate_video_upload',
            'get_creator_video_count',
            'update_affiliate_link_clicks',
            'check_monetization_eligibility',
            'has_accepted_latest_terms',
            'get_available_balance',
            'calculate_subscription_price',
            'handle_new_user',
            'is_user_premium',
            'is_community_member',
            'update_community_member_count',
            'update_community_post_count',
            'update_global_score_trigger'
        )
    LOOP
        EXECUTE format('ALTER FUNCTION %I(%s) SET search_path = public', 
            func_record.proname, func_record.args);
    END LOOP;
END $$;
