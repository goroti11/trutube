/*
  # Seed Gaming Data - Production Ready
  
  Initialize core gaming data:
  - Game publishers
  - Competitive games
  - Current season
  - Arena fund
  - Gaming rules versions
*/

-- Insert game publishers
INSERT INTO game_publishers (name, slug, logo_url, website, verified) VALUES
  ('Riot Games', 'riot-games', NULL, 'https://www.riotgames.com', true),
  ('Epic Games', 'epic-games', NULL, 'https://www.epicgames.com', true),
  ('Valve Corporation', 'valve', NULL, 'https://www.valvesoftware.com', true),
  ('Activision', 'activision', NULL, 'https://www.activision.com', true),
  ('Electronic Arts', 'ea', NULL, 'https://www.ea.com', true),
  ('Tencent Games', 'tencent', NULL, 'https://game.qq.com', true),
  ('Garena', 'garena', NULL, 'https://www.garena.com', true),
  ('Supercell', 'supercell', NULL, 'https://supercell.com', true)
ON CONFLICT (slug) DO NOTHING;

-- Update existing games with competitive features
UPDATE games
SET 
  is_competitive = true,
  anti_cheat_enabled = true,
  min_players = CASE slug
    WHEN 'valorant' THEN 10
    WHEN 'lol' THEN 10
    WHEN 'pubg-mobile' THEN 100
    WHEN 'free-fire' THEN 50
    WHEN 'cod-mobile' THEN 10
    WHEN 'mobile-legends' THEN 10
    WHEN 'fortnite' THEN 100
    ELSE 1
  END,
  max_players = CASE slug
    WHEN 'valorant' THEN 10
    WHEN 'lol' THEN 10
    WHEN 'pubg-mobile' THEN 100
    WHEN 'free-fire' THEN 50
    WHEN 'cod-mobile' THEN 100
    WHEN 'mobile-legends' THEN 10
    WHEN 'fortnite' THEN 100
    ELSE 100
  END,
  publisher_id = (
    SELECT id FROM game_publishers 
    WHERE slug = CASE games.slug
      WHEN 'valorant' THEN 'riot-games'
      WHEN 'lol' THEN 'riot-games'
      WHEN 'fortnite' THEN 'epic-games'
      WHEN 'cod-mobile' THEN 'activision'
      WHEN 'fifa-mobile' THEN 'ea'
      WHEN 'pubg-mobile' THEN 'tencent'
      WHEN 'mobile-legends' THEN 'tencent'
      WHEN 'free-fire' THEN 'garena'
      ELSE 'tencent'
    END
    LIMIT 1
  )
WHERE slug IN (
  'valorant', 'lol', 'pubg-mobile', 'free-fire', 
  'cod-mobile', 'mobile-legends', 'fortnite', 'fifa-mobile'
);

-- Create current season
INSERT INTO gaming_seasons (
  name,
  slug,
  season_number,
  description,
  status,
  starts_at,
  ends_at,
  reward_pool
) VALUES (
  'Season 1: Genesis',
  'season-1-genesis',
  1,
  'The inaugural competitive season of GOROTI Gaming. Prove your skills and earn your place in history.',
  'active',
  NOW() - INTERVAL '7 days',
  NOW() + INTERVAL '83 days',
  5000000
)
ON CONFLICT (slug) DO UPDATE
SET status = EXCLUDED.status;

-- Initialize Arena Fund for current season
DO $$
DECLARE
  v_season_id uuid;
BEGIN
  SELECT id INTO v_season_id
  FROM gaming_seasons
  WHERE slug = 'season-1-genesis';
  
  IF v_season_id IS NOT NULL THEN
    INSERT INTO arena_fund (
      season_id,
      current_balance,
      total_contributions,
      total_distributed,
      contribution_percentage
    ) VALUES (
      v_season_id,
      0,
      0,
      0,
      10
    )
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Create upcoming season
INSERT INTO gaming_seasons (
  name,
  slug,
  season_number,
  description,
  status,
  starts_at,
  ends_at,
  reward_pool
) VALUES (
  'Season 2: Rising Stars',
  'season-2-rising-stars',
  2,
  'The competition intensifies. New challenges await.',
  'upcoming',
  NOW() + INTERVAL '90 days',
  NOW() + INTERVAL '180 days',
  10000000
)
ON CONFLICT (slug) DO NOTHING;