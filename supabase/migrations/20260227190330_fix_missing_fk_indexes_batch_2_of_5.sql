/*
  # Fix Missing Foreign Key Indexes - Batch 2/5
  
  Add indexes for foreign keys to improve query performance (Part 2)
  
  Tables covered:
  - gaming_leaderboards
  - gaming_reports
  - gaming_sanctions
  - global_leaderboards
  - group_invites
  - group_messages
  - legend_active_holders
  - legend_auto_promotion_log
  - legend_candidates
  - legend_rankings_history
*/

-- gaming_leaderboards
CREATE INDEX IF NOT EXISTS idx_gaming_leaderboards_game_id 
ON gaming_leaderboards(game_id);

-- gaming_reports
CREATE INDEX IF NOT EXISTS idx_gaming_reports_reporter_id 
ON gaming_reports(reporter_id);

-- gaming_sanctions
CREATE INDEX IF NOT EXISTS idx_gaming_sanctions_created_by 
ON gaming_sanctions(created_by);

CREATE INDEX IF NOT EXISTS idx_gaming_sanctions_report_id 
ON gaming_sanctions(report_id);

-- global_leaderboards
CREATE INDEX IF NOT EXISTS idx_global_leaderboards_game_id 
ON global_leaderboards(game_id);

CREATE INDEX IF NOT EXISTS idx_global_leaderboards_season_id 
ON global_leaderboards(season_id);

CREATE INDEX IF NOT EXISTS idx_global_leaderboards_team_id 
ON global_leaderboards(team_id);

CREATE INDEX IF NOT EXISTS idx_global_leaderboards_user_id 
ON global_leaderboards(user_id);

-- group_invites
CREATE INDEX IF NOT EXISTS idx_group_invites_invitee_id 
ON group_invites(invitee_id);

CREATE INDEX IF NOT EXISTS idx_group_invites_inviter_id 
ON group_invites(inviter_id);

-- group_messages
CREATE INDEX IF NOT EXISTS idx_group_messages_reply_to_id 
ON group_messages(reply_to_id);

-- legend_active_holders
CREATE INDEX IF NOT EXISTS idx_legend_active_holders_user_id 
ON legend_active_holders(user_id);

-- legend_auto_promotion_log
CREATE INDEX IF NOT EXISTS idx_legend_auto_promotion_log_candidate_id 
ON legend_auto_promotion_log(candidate_id);

-- legend_candidates
CREATE INDEX IF NOT EXISTS idx_legend_candidates_category_id 
ON legend_candidates(category_id);

-- legend_rankings_history
CREATE INDEX IF NOT EXISTS idx_legend_rankings_history_universe_id 
ON legend_rankings_history(universe_id);
