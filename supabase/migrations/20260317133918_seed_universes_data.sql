/*
  # Seed Universes Data

  1. Changes
    - Insert all 9 main universes with colors and descriptions
    - Insert sub-universes for each main universe

  2. Data
    - Music universe with 28 sub-universes
    - Game universe with 17 sub-universes
    - Know universe with 16 sub-universes
    - Culture universe with 13 sub-universes
    - Life universe with 11 sub-universes
    - Mind universe with 8 sub-universes
    - Lean universe with 11 sub-universes
    - Movie universe with 25 sub-universes
    - Sport universe with 24 sub-universes
*/

-- Insert main universes
INSERT INTO universes (slug, name, description, color_primary, color_secondary)
VALUES
  ('music', 'Music', 'Découvre la musique sous toutes ses formes', '#ec4899', '#db2777'),
  ('game', 'Game', 'Gaming, esports et compétitions', '#10b981', '#059669'),
  ('know', 'Know', 'Apprends et développe tes compétences', '#f59e0b', '#d97706'),
  ('culture', 'Culture', 'Art, débats et contenus culturels', '#8b5cf6', '#7c3aed'),
  ('life', 'Life', 'Lifestyle, voyages et bien-être', '#f43f5e', '#e11d48'),
  ('mind', 'Mind', 'Développement personnel et spiritualité', '#6366f1', '#4f46e5'),
  ('lean', 'Lean', 'Tech, code et innovation', '#10b981', '#059669'),
  ('movie', 'Movie', 'Films, séries et critiques', '#8b5cf6', '#7c3aed'),
  ('sport', 'Sport', 'Sports, fitness et compétitions', '#f97316', '#ea580c')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  color_primary = EXCLUDED.color_primary,
  color_secondary = EXCLUDED.color_secondary;

-- Get universe IDs for reference
DO $$
DECLARE
  music_id uuid;
  game_id uuid;
  know_id uuid;
  culture_id uuid;
  life_id uuid;
  mind_id uuid;
  lean_id uuid;
  movie_id uuid;
  sport_id uuid;
BEGIN
  SELECT id INTO music_id FROM universes WHERE slug = 'music';
  SELECT id INTO game_id FROM universes WHERE slug = 'game';
  SELECT id INTO know_id FROM universes WHERE slug = 'know';
  SELECT id INTO culture_id FROM universes WHERE slug = 'culture';
  SELECT id INTO life_id FROM universes WHERE slug = 'life';
  SELECT id INTO mind_id FROM universes WHERE slug = 'mind';
  SELECT id INTO lean_id FROM universes WHERE slug = 'lean';
  SELECT id INTO movie_id FROM universes WHERE slug = 'movie';
  SELECT id INTO sport_id FROM universes WHERE slug = 'sport';

  -- Music sub-universes
  INSERT INTO sub_universes (universe_id, slug, name, description) VALUES
    (music_id, 'afrobeat', 'Afrobeat', 'Rythmes africains modernes'),
    (music_id, 'amapiano', 'Amapiano', 'House sud-africaine'),
    (music_id, 'hip-hop', 'Hip-Hop', 'Culture hip-hop'),
    (music_id, 'rap', 'Rap', 'Rap français et international'),
    (music_id, 'trap', 'Trap', 'Trap music'),
    (music_id, 'drill', 'Drill', 'Drill UK et US'),
    (music_id, 'rnb', 'RnB', 'Rhythm and Blues'),
    (music_id, 'soul', 'Soul', 'Soul music'),
    (music_id, 'funk', 'Funk', 'Funk grooves'),
    (music_id, 'jazz', 'Jazz', 'Jazz classique et moderne'),
    (music_id, 'blues', 'Blues', 'Blues authentique'),
    (music_id, 'rock', 'Rock', 'Rock et métal'),
    (music_id, 'pop', 'Pop', 'Pop music'),
    (music_id, 'reggae', 'Reggae', 'Reggae roots'),
    (music_id, 'dancehall', 'Dancehall', 'Dancehall jamaïcain'),
    (music_id, 'ragga', 'Ragga', 'Ragga music'),
    (music_id, 'electro', 'Electro', 'Musique électronique'),
    (music_id, 'edm', 'EDM', 'Electronic Dance Music'),
    (music_id, 'house', 'House', 'House music'),
    (music_id, 'techno', 'Techno', 'Techno beats'),
    (music_id, 'gospel', 'Gospel', 'Musique gospel'),
    (music_id, 'classique', 'Classique', 'Musique classique'),
    (music_id, 'lofi', 'Lo-Fi', 'Lo-Fi beats'),
    (music_id, 'freestyle', 'Freestyle', 'Freestyle rap'),
    (music_id, 'clips', 'Clips', 'Clips musicaux'),
    (music_id, 'concerts', 'Concerts', 'Concerts live'),
    (music_id, 'lives', 'Lives', 'Performances live'),
    (music_id, 'exclus', 'Exclus', 'Contenus exclusifs')
  ON CONFLICT DO NOTHING;

  -- Game sub-universes
  INSERT INTO sub_universes (universe_id, slug, name, description) VALUES
    (game_id, 'fps', 'FPS', 'First Person Shooter'),
    (game_id, 'battle-royale', 'Battle Royale', 'Battle Royale games'),
    (game_id, 'moba', 'MOBA', 'Multiplayer Online Battle Arena'),
    (game_id, 'rpg', 'RPG', 'Role Playing Games'),
    (game_id, 'mmorpg', 'MMORPG', 'MMO RPG'),
    (game_id, 'sport', 'Sport', 'Jeux de sport'),
    (game_id, 'simulation', 'Simulation', 'Jeux de simulation'),
    (game_id, 'racing', 'Racing', 'Jeux de course'),
    (game_id, 'fighting', 'Fighting', 'Jeux de combat'),
    (game_id, 'horror', 'Horror', 'Jeux d''horreur'),
    (game_id, 'mobile', 'Mobile', 'Gaming mobile'),
    (game_id, 'indie', 'Indie', 'Jeux indépendants'),
    (game_id, 'stream', 'Stream', 'Streaming gaming'),
    (game_id, 'highlights', 'Highlights', 'Meilleurs moments'),
    (game_id, 'tournois', 'Tournois', 'Compétitions esports'),
    (game_id, 'speedrun', 'Speedrun', 'Speedruns'),
    (game_id, 'reviews', 'Reviews', 'Tests et critiques')
  ON CONFLICT DO NOTHING;

  -- Know sub-universes
  INSERT INTO sub_universes (universe_id, slug, name, description) VALUES
    (know_id, 'formations', 'Formations', 'Cours et formations'),
    (know_id, 'finance', 'Finance', 'Finance personnelle'),
    (know_id, 'business', 'Business', 'Entrepreneuriat'),
    (know_id, 'crypto', 'Crypto', 'Cryptomonnaies'),
    (know_id, 'blockchain', 'Blockchain', 'Technologie blockchain'),
    (know_id, 'ia', 'IA', 'Intelligence artificielle'),
    (know_id, 'data', 'Data', 'Data science'),
    (know_id, 'marketing', 'Marketing', 'Marketing digital'),
    (know_id, 'ecommerce', 'E-commerce', 'Commerce en ligne'),
    (know_id, 'immobilier', 'Immobilier', 'Investissement immobilier'),
    (know_id, 'bourse', 'Bourse', 'Trading et bourse'),
    (know_id, 'science', 'Science', 'Sciences et découvertes'),
    (know_id, 'histoire', 'Histoire', 'Histoire et culture'),
    (know_id, 'langues', 'Langues', 'Apprentissage des langues'),
    (know_id, 'documentaires', 'Documentaires', 'Documentaires éducatifs'),
    (know_id, 'tutoriels', 'Tutoriels', 'Tutoriels pratiques')
  ON CONFLICT DO NOTHING;

  -- Culture sub-universes
  INSERT INTO sub_universes (universe_id, slug, name, description) VALUES
    (culture_id, 'podcasts', 'Podcasts', 'Podcasts culturels'),
    (culture_id, 'debats', 'Débats', 'Débats et discussions'),
    (culture_id, 'interviews', 'Interviews', 'Interviews exclusives'),
    (culture_id, 'storytelling', 'Storytelling', 'Narration d''histoires'),
    (culture_id, 'cinema', 'Cinéma', 'Cinéma et films'),
    (culture_id, 'series', 'Séries', 'Séries TV'),
    (culture_id, 'analyse', 'Analyse', 'Analyses culturelles'),
    (culture_id, 'litterature', 'Littérature', 'Livres et littérature'),
    (culture_id, 'art', 'Art', 'Arts visuels'),
    (culture_id, 'mode', 'Mode', 'Mode et tendances'),
    (culture_id, 'street', 'Street', 'Culture street'),
    (culture_id, 'humour', 'Humour', 'Humour et comédie'),
    (culture_id, 'standup', 'Stand-up', 'Stand-up comedy')
  ON CONFLICT DO NOTHING;

  -- Life sub-universes
  INSERT INTO sub_universes (universe_id, slug, name, description) VALUES
    (life_id, 'dating', 'Dating', 'Rencontres et séduction'),
    (life_id, 'rencontres', 'Rencontres', 'Conseils rencontres'),
    (life_id, 'relations', 'Relations', 'Relations amoureuses'),
    (life_id, 'couple', 'Couple', 'Vie de couple'),
    (life_id, 'lifestyle', 'Lifestyle', 'Style de vie'),
    (life_id, 'voyage', 'Voyage', 'Voyages et découvertes'),
    (life_id, 'fitness', 'Fitness', 'Fitness et sport'),
    (life_id, 'nutrition', 'Nutrition', 'Nutrition et alimentation'),
    (life_id, 'sante', 'Santé', 'Santé et bien-être'),
    (life_id, 'bien-etre', 'Bien-être', 'Bien-être personnel'),
    (life_id, 'lives-prives', 'Lives Privés', 'Contenus personnels')
  ON CONFLICT DO NOTHING;

  -- Mind sub-universes
  INSERT INTO sub_universes (universe_id, slug, name, description) VALUES
    (mind_id, 'developpement-personnel', 'Développement Personnel', 'Croissance personnelle'),
    (mind_id, 'spiritualite', 'Spiritualité', 'Spiritualité et éveil'),
    (mind_id, 'meditation', 'Méditation', 'Méditation et pleine conscience'),
    (mind_id, 'psychologie', 'Psychologie', 'Psychologie humaine'),
    (mind_id, 'philosophie', 'Philosophie', 'Philosophie et réflexion'),
    (mind_id, 'motivation', 'Motivation', 'Motivation et inspiration'),
    (mind_id, 'discipline', 'Discipline', 'Discipline et habitudes'),
    (mind_id, 'leadership', 'Leadership', 'Leadership et management')
  ON CONFLICT DO NOTHING;

  -- Lean sub-universes
  INSERT INTO sub_universes (universe_id, slug, name, description) VALUES
    (lean_id, 'developpeur', 'Développeur', 'Développement logiciel'),
    (lean_id, 'frontend', 'Frontend', 'Développement frontend'),
    (lean_id, 'backend', 'Backend', 'Développement backend'),
    (lean_id, 'fullstack', 'Fullstack', 'Développement fullstack'),
    (lean_id, 'mobile', 'Mobile', 'Développement mobile'),
    (lean_id, 'devops', 'DevOps', 'DevOps et infrastructure'),
    (lean_id, 'ui-ux', 'UI/UX', 'Design UI/UX'),
    (lean_id, 'nocode', 'No-Code', 'Outils no-code'),
    (lean_id, 'cybersecurite', 'Cybersécurité', 'Sécurité informatique'),
    (lean_id, 'cloud', 'Cloud', 'Cloud computing'),
    (lean_id, 'freelance', 'Freelance', 'Freelancing tech')
  ON CONFLICT DO NOTHING;

  -- Movie sub-universes
  INSERT INTO sub_universes (universe_id, slug, name, description) VALUES
    (movie_id, 'films', 'Films', 'Films de cinéma'),
    (movie_id, 'series', 'Séries', 'Séries télévisées'),
    (movie_id, 'manga', 'Manga', 'Manga et adaptations'),
    (movie_id, 'anime', 'Anime', 'Anime japonais'),
    (movie_id, 'cartoons', 'Cartoons', 'Dessins animés'),
    (movie_id, 'documentaires', 'Documentaires', 'Films documentaires'),
    (movie_id, 'courts-metrages', 'Courts-Métrages', 'Courts-métrages'),
    (movie_id, 'web-series', 'Web-Séries', 'Séries web'),
    (movie_id, 'trailers', 'Trailers', 'Bandes-annonces'),
    (movie_id, 'fan-films', 'Fan Films', 'Films de fans'),
    (movie_id, 'action', 'Action', 'Films d''action'),
    (movie_id, 'drama', 'Drama', 'Films dramatiques'),
    (movie_id, 'comedie', 'Comédie', 'Films comiques'),
    (movie_id, 'sci-fi', 'Sci-Fi', 'Science-fiction'),
    (movie_id, 'fantastique', 'Fantastique', 'Films fantastiques'),
    (movie_id, 'horreur', 'Horreur', 'Films d''horreur'),
    (movie_id, 'thriller', 'Thriller', 'Films thriller'),
    (movie_id, 'romance', 'Romance', 'Films romantiques'),
    (movie_id, 'animation', 'Animation', 'Films d''animation'),
    (movie_id, 'indie', 'Indie', 'Cinéma indépendant'),
    (movie_id, 'critiques', 'Critiques', 'Critiques de films'),
    (movie_id, 'analyses', 'Analyses', 'Analyses cinématographiques'),
    (movie_id, 'reactions', 'Réactions', 'Réactions aux films'),
    (movie_id, 'theories', 'Théories', 'Théories de fans'),
    (movie_id, 'reviews', 'Reviews', 'Reviews de films')
  ON CONFLICT DO NOTHING;

  -- Sport sub-universes
  INSERT INTO sub_universes (universe_id, slug, name, description) VALUES
    (sport_id, 'football', 'Football', 'Football et soccer'),
    (sport_id, 'basketball', 'Basketball', 'Basketball NBA et international'),
    (sport_id, 'tennis', 'Tennis', 'Tennis professionnel'),
    (sport_id, 'mma-boxe', 'MMA & Boxe', 'Arts martiaux mixtes et boxe'),
    (sport_id, 'sports-mecaniques', 'Sports Mécaniques', 'F1, MotoGP, rallye'),
    (sport_id, 'athletisme', 'Athlétisme', 'Athlétisme et courses'),
    (sport_id, 'rugby', 'Rugby', 'Rugby à 13 et à 15'),
    (sport_id, 'sports-combat', 'Sports de Combat', 'Arts martiaux et combat'),
    (sport_id, 'natation', 'Natation', 'Natation et sports aquatiques'),
    (sport_id, 'cyclisme', 'Cyclisme', 'Cyclisme sur route et VTT'),
    (sport_id, 'fitness-musculation', 'Fitness & Musculation', 'Fitness et bodybuilding'),
    (sport_id, 'sports-extremes', 'Sports Extrêmes', 'Sports extrêmes et sensations'),
    (sport_id, 'sports-hiver', 'Sports d''Hiver', 'Ski, snowboard, hockey'),
    (sport_id, 'sports-us', 'Sports US', 'Football américain, baseball'),
    (sport_id, 'padel', 'Padel', 'Padel tennis'),
    (sport_id, 'handball', 'Handball', 'Handball professionnel'),
    (sport_id, 'volleyball', 'Volleyball', 'Volleyball et beach volley'),
    (sport_id, 'matchs', 'Matchs', 'Matchs en direct'),
    (sport_id, 'highlights', 'Highlights', 'Meilleurs moments'),
    (sport_id, 'analyses-tactiques', 'Analyses Tactiques', 'Analyses tactiques'),
    (sport_id, 'debats', 'Débats', 'Débats sportifs'),
    (sport_id, 'entrainement', 'Entraînement', 'Programmes d''entraînement'),
    (sport_id, 'street', 'Street', 'Sports urbains'),
    (sport_id, 'freestyle', 'Freestyle', 'Freestyle et tricks')
  ON CONFLICT DO NOTHING;
END $$;
