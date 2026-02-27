/*
  # Fix Missing Foreign Key Indexes - Batch 4/5
  
  Add indexes for foreign keys to improve query performance (Part 4)
  
  Tables covered:
  - revenue_holds
  - service_bookings
  - sponsorship_deliverables
  - support_leaderboard
  - tournament_matches
  - user_gaming_badges
  - user_reputation
  - video_downloads
  - video_legend_awards
  - video_reactions
*/

-- revenue_holds
CREATE INDEX IF NOT EXISTS idx_revenue_holds_investigation_id 
ON revenue_holds(investigation_id);

-- service_bookings
CREATE INDEX IF NOT EXISTS idx_service_bookings_creator_id 
ON service_bookings(creator_id);

-- sponsorship_deliverables
CREATE INDEX IF NOT EXISTS idx_sponsorship_deliverables_brand_deal_id 
ON sponsorship_deliverables(brand_deal_id);

-- support_leaderboard
CREATE INDEX IF NOT EXISTS idx_support_leaderboard_supporter_id 
ON support_leaderboard(supporter_id);

-- tournament_matches
CREATE INDEX IF NOT EXISTS idx_tournament_matches_participant_1_id 
ON tournament_matches(participant_1_id);

CREATE INDEX IF NOT EXISTS idx_tournament_matches_participant_2_id 
ON tournament_matches(participant_2_id);

CREATE INDEX IF NOT EXISTS idx_tournament_matches_winner_id 
ON tournament_matches(winner_id);

-- user_gaming_badges
CREATE INDEX IF NOT EXISTS idx_user_gaming_badges_badge_id 
ON user_gaming_badges(badge_id);

CREATE INDEX IF NOT EXISTS idx_user_gaming_badges_season_id 
ON user_gaming_badges(season_id);

-- user_reputation
CREATE INDEX IF NOT EXISTS idx_user_reputation_community_id 
ON user_reputation(community_id);

-- video_downloads
CREATE INDEX IF NOT EXISTS idx_video_downloads_user_id 
ON video_downloads(user_id);

-- video_legend_awards
CREATE INDEX IF NOT EXISTS idx_video_legend_awards_badge_id 
ON video_legend_awards(badge_id);

-- video_reactions
CREATE INDEX IF NOT EXISTS idx_video_reactions_video_id 
ON video_reactions(video_id);
