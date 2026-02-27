/*
  # Seed Gaming Badges
*/

INSERT INTO gaming_badges (badge_type, badge_name, description, badge_tier, requirements, color_primary, color_secondary) VALUES
('gaming_creator', 'Gaming Creator', 'Verified gaming content creator on Goroti Gaming', 'standard', 
 '{"min_hours": 50, "min_streams": 20, "no_violations": true}'::jsonb, '#6C3BFF', '#00E5FF'),

('verified_gaming_pro', 'Verified Gaming Pro', 'Professional verified gaming streamer', 'verified',
 '{"min_hours": 200, "min_trucoins": 100000, "no_violations": true, "min_avg_viewers": 100}'::jsonb, '#00E5FF', '#6C3BFF'),

('elite_gaming', 'Elite Gaming', 'Elite tier gaming professional', 'elite',
 '{"min_hours": 500, "min_trucoins": 500000, "min_tournaments": 5, "min_avg_viewers": 500}'::jsonb, '#FFD700', '#FFA500'),

('tournament_champion', 'Tournament Champion', 'Winner of official Goroti Gaming tournament', 'champion',
 '{"tournament_wins": 1}'::jsonb, '#FF2D55', '#FF6B9D'),

('trucoins_master', 'TruCoins Master', 'Generated over 1M TruCoins through gaming', 'elite',
 '{"min_trucoins": 1000000}'::jsonb, '#10B981', '#34D399'),

('season_legend', 'Season Legend', 'Top 10 player in a gaming season', 'legend',
 '{"season_top": 10}'::jsonb, '#8B5CF6', '#A78BFA'),

('team_captain', 'Team Captain', 'Verified gaming team captain', 'verified',
 '{"is_captain": true, "team_verified": true}'::jsonb, '#3B82F6', '#60A5FA'),

('arena_champion', 'Arena Champion', 'Won Arena-sponsored tournament', 'champion',
 '{"arena_tournament_wins": 1}'::jsonb, '#EC4899', '#F472B6')

ON CONFLICT (badge_type) DO NOTHING;
