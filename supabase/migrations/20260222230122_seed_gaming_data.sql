/*
  # Seed Gaming Data

  Add popular games and categories
*/

-- Insert game categories
INSERT INTO game_categories (name, slug, icon, description, display_order) VALUES
  ('Battle Royale', 'battle-royale', '🎯', 'Survival games with last player standing', 1),
  ('FPS', 'fps', '🔫', 'First-person shooter games', 2),
  ('MOBA', 'moba', '⚔️', 'Multiplayer online battle arena', 3),
  ('RPG', 'rpg', '🗡️', 'Role-playing games', 4),
  ('Strategy', 'strategy', '🎮', 'Strategic gameplay', 5),
  ('Sports', 'sports', '⚽', 'Sports and racing games', 6),
  ('Casual', 'casual', '🎲', 'Casual and social games', 7)
ON CONFLICT (slug) DO NOTHING;

-- Insert popular games
INSERT INTO games (name, slug, category, description, cover_url, platforms, tags) VALUES
  ('PUBG Mobile', 'pubg-mobile', 'Battle Royale', 'Player Unknown''s Battlegrounds Mobile', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400', ARRAY['mobile', 'android', 'ios'], ARRAY['shooter', 'survival', 'multiplayer']),
  ('Free Fire', 'free-fire', 'Battle Royale', 'Garena Free Fire MAX', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400', ARRAY['mobile', 'android', 'ios'], ARRAY['battle-royale', 'survival']),
  ('Call of Duty Mobile', 'cod-mobile', 'FPS', 'COD Mobile', 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400', ARRAY['mobile', 'android', 'ios'], ARRAY['fps', 'multiplayer']),
  ('Roblox', 'roblox', 'Casual', 'Create and play games', 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400', ARRAY['pc', 'mobile', 'console'], ARRAY['sandbox', 'creative']),
  ('Mobile Legends', 'mobile-legends', 'MOBA', 'Mobile Legends: Bang Bang', 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=400', ARRAY['mobile', 'android', 'ios'], ARRAY['moba', 'strategy']),
  ('Fortnite', 'fortnite', 'Battle Royale', 'Epic Games Battle Royale', 'https://images.unsplash.com/photo-1625805866449-3589fe3f71a3?w=400', ARRAY['pc', 'console', 'mobile'], ARRAY['battle-royale', 'building']),
  ('Valorant', 'valorant', 'FPS', 'Riot Games tactical shooter', 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400', ARRAY['pc'], ARRAY['fps', 'tactical']),
  ('League of Legends', 'lol', 'MOBA', 'Riot Games MOBA', 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=400', ARRAY['pc'], ARRAY['moba', 'strategy']),
  ('Minecraft', 'minecraft', 'Casual', 'Build and explore', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400', ARRAY['pc', 'console', 'mobile'], ARRAY['sandbox', 'creative']),
  ('FIFA Mobile', 'fifa-mobile', 'Sports', 'EA Sports Football', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400', ARRAY['mobile', 'android', 'ios'], ARRAY['sports', 'football'])
ON CONFLICT (slug) DO NOTHING;

-- Insert internal games
INSERT INTO goroti_internal_games (name, slug, description, icon, game_type, min_bet, max_bet, config) VALUES
  ('Quiz Live', 'quiz-live', 'Answer questions and win TruCoins', '🧠', 'quiz', 100, 5000, '{"question_count": 10, "time_per_question": 15, "difficulty": "mixed"}'),
  ('Duel Arena', 'duel-arena', 'Challenge another creator', '⚔️', 'duel', 500, 50000, '{"rounds": 3, "time_per_round": 30, "game_modes": ["trivia", "reaction", "prediction"]}'),
  ('TruCoin Wheel', 'trucoin-wheel', 'Spin the wheel and win prizes', '🎰', 'wheel', 100, 10000, '{"segments": 8, "prizes": [100, 200, 500, 1000, 2000, 5000, 10000, "JACKPOT"], "jackpot_multiplier": 10}'),
  ('Boss Battle', 'boss-battle', 'Community attacks boss together', '👑', 'boss', 50, 5000, '{"boss_hp": 1000000, "attack_multiplier": 1, "special_moves": ["critical_hit", "heal_team", "shield"], "rewards_pool_percentage": 90}'),
  ('Prediction Game', 'prediction-game', 'Predict what happens next', '🔮', 'prediction', 100, 10000, '{"options_count": 4, "time_to_bet": 60, "reveal_delay": 5}')
ON CONFLICT (slug) DO NOTHING;