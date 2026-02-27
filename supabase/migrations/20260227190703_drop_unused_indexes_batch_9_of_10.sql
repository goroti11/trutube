/*
  # Drop Unused Indexes - Batch 9/10
  
  Tables: gaming tournaments, leaderboards, arena fund
*/

DROP INDEX IF EXISTS idx_gaming_stats_session;
DROP INDEX IF EXISTS idx_gaming_teams_captain;
DROP INDEX IF EXISTS idx_gaming_teams_season;
DROP INDEX IF EXISTS idx_gaming_team_members_team;
DROP INDEX IF EXISTS idx_gaming_team_members_user;
DROP INDEX IF EXISTS idx_gaming_tournaments_game;
DROP INDEX IF EXISTS idx_gaming_tournaments_season;
DROP INDEX IF EXISTS idx_tournament_participants_tournament;
DROP INDEX IF EXISTS idx_tournament_participants_user;
DROP INDEX IF EXISTS idx_tournament_participants_team;
DROP INDEX IF EXISTS idx_tournament_matches_tournament;
DROP INDEX IF EXISTS idx_tournament_matches_status;
DROP INDEX IF EXISTS idx_tournament_prize_tournament;
DROP INDEX IF EXISTS idx_gaming_leaderboards_season_game;
DROP INDEX IF EXISTS idx_gaming_leaderboards_category_rank;
DROP INDEX IF EXISTS idx_gaming_leaderboards_user;
DROP INDEX IF EXISTS idx_gaming_leaderboards_team;
DROP INDEX IF EXISTS idx_arena_fund_season;
DROP INDEX IF EXISTS idx_arena_transactions_fund;
DROP INDEX IF EXISTS idx_arena_transactions_type;
