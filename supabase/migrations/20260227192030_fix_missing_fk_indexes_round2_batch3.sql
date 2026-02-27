/*
  # Fix Missing Foreign Key Indexes - Round 2 Batch 3

  1. New Indexes Added (10 indexes)
    - gaming_teams.captain_id, season_id
    - gaming_tournaments.game_id, season_id
    - group_channels.group_id
    - group_invites.group_id
    - group_messages.channel_id, user_id

  2. Performance Impact
    - Completes FK index coverage for gaming and group systems
*/

CREATE INDEX IF NOT EXISTS idx_gaming_teams_captain_id_fk ON gaming_teams(captain_id);
CREATE INDEX IF NOT EXISTS idx_gaming_teams_season_id_fk ON gaming_teams(season_id);
CREATE INDEX IF NOT EXISTS idx_gaming_tournaments_game_id_fk ON gaming_tournaments(game_id);
CREATE INDEX IF NOT EXISTS idx_gaming_tournaments_season_id_fk ON gaming_tournaments(season_id);
CREATE INDEX IF NOT EXISTS idx_group_channels_group_id_fk ON group_channels(group_id);
CREATE INDEX IF NOT EXISTS idx_group_invites_group_id_fk ON group_invites(group_id);
CREATE INDEX IF NOT EXISTS idx_group_messages_channel_id_fk ON group_messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_group_messages_user_id_fk ON group_messages(user_id);
