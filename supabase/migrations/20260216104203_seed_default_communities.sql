/*
  # Ajout de communautés par défaut pour Goroti

  1. Communautés créées
    - Communautés d'univers populaires (Gaming, Musique, Tech, etc.)
    - Communautés thématiques actives
    - Variété de types (publiques, premium, créateurs)

  2. Données incluses
    - 10+ communautés diversifiées
    - Descriptions engageantes
    - Règles de base
    - Compteurs initialisés

  3. Sécurité
    - RLS déjà en place
    - Communautés publiques visibles
*/

-- Insérer des communautés par défaut variées
INSERT INTO communities (name, slug, description, type, is_premium, premium_price, rules, avatar_url, banner_url, member_count, post_count, is_active)
VALUES
-- Communautés Gaming
('Gaming Pro', 'gaming-pro', 'La communauté ultime pour les gamers professionnels et passionnés. Partagez vos meilleurs moments, stratégies et découvertes.', 'universe', false, 0,
 to_jsonb(ARRAY['Respectez les autres joueurs', 'Pas de triche ou exploit', 'Partagez du contenu de qualité', 'Pas de spam promotionnel']), 
 NULL, NULL, 2847, 1523, true),

('Esport FR', 'esport-fr', 'Suivez l''actualité esport française, discutez des compétitions et supportez vos équipes favorites!', 'universe', false, 0,
 to_jsonb(ARRAY['Soyez fair-play', 'Respectez toutes les équipes', 'Pas d''insultes ou toxicité', 'Vérifiez vos sources']),
 NULL, NULL, 5621, 3847, true),

-- Communautés Musique
('Afrobeat Global', 'afrobeat-global', 'Célébrez l''Afrobeat sous toutes ses formes. Découvertes, artistes, playlists et événements.', 'universe', false, 0,
 to_jsonb(ARRAY['Partagez de la bonne musique', 'Soutenez les artistes', 'Pas de piratage', 'Respectez tous les genres']),
 NULL, NULL, 8934, 5234, true),

('Hip-Hop Culture', 'hip-hop-culture', 'Du rap old school au trap moderne, discutez de la culture hip-hop mondiale.', 'universe', false, 0,
 to_jsonb(ARRAY['Respect mutuel', 'Pas de beef toxique', 'Valorisez l''art', 'Partagez vos découvertes']),
 NULL, NULL, 6782, 4123, true),

-- Communautés Tech
('Dev & Code', 'dev-code', 'Entraide entre développeurs, partage de code, projets open source et discussions techniques.', 'universe', false, 0,
 to_jsonb(ARRAY['Aidez les débutants', 'Code propre et commenté', 'Citez vos sources', 'Pas de gatekeeping']),
 NULL, NULL, 4521, 2891, true),

('IA & Innovation', 'ia-innovation', 'Explorez l''intelligence artificielle, le machine learning et les technologies du futur.', 'universe', true, 4.99,
 to_jsonb(ARRAY['Discussions constructives', 'Partagez vos expérimentations', 'Pas de fake news tech', 'Respectez l''éthique IA']),
 NULL, NULL, 3245, 1674, true),

-- Communautés Lifestyle
('Fitness Motivation', 'fitness-motivation', 'Transformez votre corps et votre esprit. Partagez vos progrès, programmes et motivation!', 'universe', false, 0,
 to_jsonb(ARRAY['Body positivity', 'Pas de body shaming', 'Conseils vérifiés uniquement', 'Soutenez-vous mutuellement']),
 NULL, NULL, 7856, 4567, true),

('Voyage & Aventure', 'voyage-aventure', 'Partagez vos voyages, conseils pratiques, bons plans et inspirez la communauté!', 'universe', false, 0,
 to_jsonb(ARRAY['Photos et récits authentiques', 'Respectez les cultures', 'Bons plans sans spam', 'Voyagez responsable']),
 NULL, NULL, 5234, 3421, true),

-- Communautés Créatives
('Photo & Vidéo', 'photo-video', 'Pour les créateurs visuels : techniques, matériel, retouches et inspiration créative.', 'creator', false, 0,
 to_jsonb(ARRAY['Crédit aux créateurs', 'Critiques constructives', 'Pas de vol de contenu', 'Partagez vos techniques']),
 NULL, NULL, 4123, 2784, true),

('Cuisine du Monde', 'cuisine-monde', 'Recettes, techniques culinaires et découvertes gastronomiques de toutes les cultures.', 'universe', false, 0,
 to_jsonb(ARRAY['Partagez vos recettes complètes', 'Photos appétissantes bienvenues', 'Respectez toutes les cuisines', 'Sécurité alimentaire']),
 NULL, NULL, 6543, 4892, true),

-- Communauté Premium Exclusive
('Goroti VIP', 'goroti-vip', 'Communauté exclusive pour les membres Premium et Gold. Événements spéciaux, accès anticipé et rencontres créateurs.', 'premium', true, 9.99,
 to_jsonb(ARRAY['Réservé aux membres Premium+', 'Confidentialité respectée', 'Networking professionnel', 'Pas de spam']),
 NULL, NULL, 1234, 456, true),

-- Communautés Discussion
('Débats & Société', 'debats-societe', 'Discutez d''actualité, société et culture dans le respect et l''ouverture d''esprit.', 'universe', false, 0,
 to_jsonb(ARRAY['Respect des opinions', 'Arguments sourcés', 'Pas d''attaques personnelles', 'Modération stricte']),
 NULL, NULL, 3891, 2456, true)

ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  member_count = EXCLUDED.member_count,
  post_count = EXCLUDED.post_count,
  updated_at = now();
