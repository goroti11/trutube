/*
  # Drop Unused Indexes - Batch 8: Profiles and Premium

  1. Performance Improvement
    - Remove unused profile and premium-related indexes

  2. Indexes Removed
    - Premium access indexes (1 index)
    - Profile reviews and shares indexes (3 indexes)
    - Profile top supporter index (1 index)
    - Social links indexes (1 index)
*/

-- Drop unused premium access index
DROP INDEX IF EXISTS idx_premium_access_community_id;

-- Drop unused profile indexes
DROP INDEX IF EXISTS idx_profile_reviews_profile_id;
DROP INDEX IF EXISTS idx_profile_shares_profile_id;
DROP INDEX IF EXISTS idx_profile_shares_shared_by_user_id;
DROP INDEX IF EXISTS idx_profiles_top_supporter_id;

-- Drop unused social links index
DROP INDEX IF EXISTS idx_social_links_user_id;