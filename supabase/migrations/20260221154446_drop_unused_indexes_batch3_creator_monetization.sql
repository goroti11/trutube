/*
  # Drop Unused Indexes - Batch 3: Creator Monetization

  1. Performance Improvement
    - Remove unused creator monetization indexes

  2. Indexes Removed
    - Creator memberships and monetization (2 indexes)
    - Creator support indexes (2 indexes)
    - Creator universes indexes (1 index)
    - Brand deals and sponsorship indexes (3 indexes)
*/

-- Drop unused creator monetization indexes
DROP INDEX IF EXISTS idx_creator_memberships_creator_id;
DROP INDEX IF EXISTS idx_creator_monetization_status_tier_id;

-- Drop unused creator support indexes
DROP INDEX IF EXISTS idx_creator_support_creator_id;
DROP INDEX IF EXISTS idx_creator_support_supporter_id;

-- Drop unused creator universes index
DROP INDEX IF EXISTS idx_creator_universes_main_universe_id;

-- Drop unused brand deals indexes
DROP INDEX IF EXISTS idx_brand_deals_creator_id;
DROP INDEX IF EXISTS idx_sponsorship_deliverables_brand_deal_id;
DROP INDEX IF EXISTS idx_video_sponsorships_video_id;
DROP INDEX IF EXISTS idx_video_sponsorships_brand_deal_id;