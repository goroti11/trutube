/*
  # Drop Unused Indexes - Batch 2: Community System

  1. Performance Improvement
    - Remove unused community-related indexes

  2. Indexes Removed
    - Comments indexes (2 indexes)
    - Communities and members indexes (2 indexes)
    - Community posts indexes (3 indexes)
    - Content reports and moderation indexes (2 indexes)
*/

-- Drop unused comments indexes
DROP INDEX IF EXISTS idx_comments_user_id;
DROP INDEX IF EXISTS idx_comments_video_id;

-- Drop unused community indexes
DROP INDEX IF EXISTS idx_communities_creator_id;
DROP INDEX IF EXISTS idx_community_members_user_id;

-- Drop unused community posts indexes
DROP INDEX IF EXISTS idx_community_posts_author_id;
DROP INDEX IF EXISTS idx_community_posts_community_id;
DROP INDEX IF EXISTS idx_community_posts_moderated_by;

-- Drop unused moderation indexes
DROP INDEX IF EXISTS idx_content_reports_reporter_id;
DROP INDEX IF EXISTS idx_moderation_votes_voter_id;