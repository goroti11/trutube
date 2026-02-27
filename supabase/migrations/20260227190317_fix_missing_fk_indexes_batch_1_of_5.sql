/*
  # Fix Missing Foreign Key Indexes - Batch 1/5
  
  Add indexes for foreign keys to improve query performance (Part 1)
  
  Tables covered:
  - ad_campaigns
  - affiliate_clicks
  - affiliate_conversions
  - arena_fund_transactions
  - community_stories
  - creator_monetization_status
  - dm_conversations
  - dm_messages
  - expert_validations
  - games
*/

-- ad_campaigns
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_target_video_id 
ON ad_campaigns(target_video_id);

-- affiliate_clicks
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_user_id 
ON affiliate_clicks(user_id);

CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_video_id 
ON affiliate_clicks(video_id);

-- affiliate_conversions
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_click_id 
ON affiliate_conversions(click_id);

-- arena_fund_transactions
CREATE INDEX IF NOT EXISTS idx_arena_fund_transactions_fund_id 
ON arena_fund_transactions(fund_id);

-- community_stories
CREATE INDEX IF NOT EXISTS idx_community_stories_universe_id 
ON community_stories(universe_id);

-- creator_monetization_status
CREATE INDEX IF NOT EXISTS idx_creator_monetization_status_tier_id 
ON creator_monetization_status(tier_id);

-- dm_conversations
CREATE INDEX IF NOT EXISTS idx_dm_conversations_created_by 
ON dm_conversations(created_by);

-- dm_messages
CREATE INDEX IF NOT EXISTS idx_dm_messages_reply_to_id 
ON dm_messages(reply_to_id);

-- expert_validations
CREATE INDEX IF NOT EXISTS idx_expert_validations_universe_id 
ON expert_validations(universe_id);

CREATE INDEX IF NOT EXISTS idx_expert_validations_validated_by 
ON expert_validations(validated_by);

-- games
CREATE INDEX IF NOT EXISTS idx_games_category_id 
ON games(category_id);
