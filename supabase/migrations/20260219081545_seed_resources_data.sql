/*
  # Seed Resources Data

  Adds demo categories, resources, announcements, and knowledge base articles
*/

-- Insert resource categories
INSERT INTO resource_categories (name, slug, description, icon, color, order_index) VALUES
  ('Démarrage', 'getting-started', 'Guides pour bien démarrer sur Goroti', '🚀', '#10b981', 1),
  ('Créateurs', 'creators', 'Ressources pour créateurs de contenu', '🎬', '#3b82f6', 2),
  ('Monétisation', 'monetization', 'Guides de monétisation et revenus', '💰', '#f59e0b', 3),
  ('Technique', 'technical', 'Documentation technique et API', '⚙️', '#8b5cf6', 4),
  ('Communauté', 'community', 'Gestion de communauté et engagement', '👥', '#ec4899', 5),
  ('Juridique', 'legal', 'Aspects légaux et conformité', '⚖️', '#6b7280', 6)
ON CONFLICT (slug) DO NOTHING;

-- Insert demo resources
DO $$
DECLARE
  cat_start uuid;
  cat_creators uuid;
  cat_monetization uuid;
  cat_technical uuid;
  cat_community uuid;
  cat_legal uuid;
BEGIN
  SELECT id INTO cat_start FROM resource_categories WHERE slug = 'getting-started';
  SELECT id INTO cat_creators FROM resource_categories WHERE slug = 'creators';
  SELECT id INTO cat_monetization FROM resource_categories WHERE slug = 'monetization';
  SELECT id INTO cat_technical FROM resource_categories WHERE slug = 'technical';
  SELECT id INTO cat_community FROM resource_categories WHERE slug = 'community';
  SELECT id INTO cat_legal FROM resource_categories WHERE slug = 'legal';

  -- Getting Started Resources
  INSERT INTO resources (category_id, title, slug, description, content, type, difficulty, estimated_time, status, published_at, tags) VALUES
  (cat_start, 'Guide de Démarrage Rapide', 'quick-start-guide', 'Tout ce qu''il faut savoir pour commencer sur Goroti en 10 minutes', 
  '<h2>Bienvenue sur Goroti!</h2><p>Ce guide vous accompagne dans vos premiers pas.</p><h3>Étape 1: Créer votre compte</h3><p>Inscrivez-vous avec votre email...</p>',
  'guide', 'beginner', 10, 'published', now(), ARRAY['démarrage', 'tutoriel', 'basique']),
  
  (cat_start, 'Configuration de votre Profil', 'setup-profile', 'Personnalisez votre profil pour attirer plus d''abonnés',
  '<h2>Optimisez votre profil</h2><p>Votre profil est votre vitrine...</p>',
  'guide', 'beginner', 15, 'published', now(), ARRAY['profil', 'personnalisation']),

  -- Creator Resources
  (cat_creators, 'Optimiser vos Miniatures', 'optimize-thumbnails', 'Créez des miniatures qui génèrent plus de clics',
  '<h2>L''art de la miniature</h2><p>Une bonne miniature peut augmenter vos vues de 300%...</p>',
  'tutorial', 'intermediate', 20, 'published', now(), ARRAY['miniatures', 'design', 'optimisation']),
  
  (cat_creators, 'SEO pour Vidéos', 'video-seo', 'Optimisez vos titres, descriptions et tags pour la découverte',
  '<h2>SEO Vidéo 101</h2><p>Le référencement vidéo est crucial...</p>',
  'guide', 'intermediate', 25, 'published', now(), ARRAY['seo', 'référencement', 'découverte']),

  (cat_creators, 'Streaming Live: Guide Complet', 'live-streaming-guide', 'Tout savoir sur le streaming en direct sur Goroti',
  '<h2>Maîtriser le Live</h2><p>Le streaming live crée une connexion unique...</p>',
  'guide', 'advanced', 45, 'published', now(), ARRAY['live', 'streaming', 'direct']),

  -- Monetization Resources
  (cat_monetization, 'Programme Partenaire: Éligibilité', 'partner-program-eligibility', 'Critères et processus pour rejoindre le programme partenaire',
  '<h2>Devenir Partenaire Goroti</h2><p>Le programme partenaire offre...</p>',
  'guide', 'beginner', 15, 'published', now(), ARRAY['partenaire', 'monétisation', 'revenus']),

  (cat_monetization, 'Maximiser vos Revenus Publicitaires', 'maximize-ad-revenue', 'Stratégies pour optimiser vos revenus publicitaires',
  '<h2>Optimisation Publicitaire</h2><p>Les publicités ne sont qu''un début...</p>',
  'guide', 'intermediate', 30, 'published', now(), ARRAY['publicité', 'revenus', 'optimisation']),

  (cat_monetization, 'Vendre du Contenu Premium', 'sell-premium-content', 'Guide complet pour monétiser du contenu exclusif',
  '<h2>Contenu Premium</h2><p>Le contenu premium génère des revenus récurrents...</p>',
  'tutorial', 'intermediate', 35, 'published', now(), ARRAY['premium', 'vente', 'abonnements']),

  -- Technical Resources
  (cat_technical, 'API Goroti: Documentation', 'api-documentation', 'Documentation complète de l''API Goroti pour développeurs',
  '<h2>API Overview</h2><p>L''API Goroti permet d''intégrer...</p>',
  'documentation', 'advanced', 60, 'published', now(), ARRAY['api', 'développeurs', 'intégration']),

  (cat_technical, 'Encodage Vidéo: Meilleures Pratiques', 'video-encoding-best-practices', 'Formats, codecs et paramètres recommandés',
  '<h2>Encodage Optimal</h2><p>La qualité de l''encodage impacte...</p>',
  'guide', 'advanced', 40, 'published', now(), ARRAY['encodage', 'technique', 'qualité']),

  -- Community Resources
  (cat_community, 'Créer une Communauté Engagée', 'build-engaged-community', 'Stratégies pour construire et animer votre communauté',
  '<h2>Communauté = Succès</h2><p>Une communauté engagée est votre meilleur atout...</p>',
  'guide', 'intermediate', 30, 'published', now(), ARRAY['communauté', 'engagement', 'fidélisation']),

  (cat_community, 'Modération: Bonnes Pratiques', 'moderation-best-practices', 'Gérer les commentaires et maintenir un environnement sain',
  '<h2>Modération Efficace</h2><p>La modération protège votre communauté...</p>',
  'guide', 'intermediate', 25, 'published', now(), ARRAY['modération', 'communauté', 'sécurité']),

  -- Legal Resources
  (cat_legal, 'Droits d''Auteur: Ce qu''il faut savoir', 'copyright-basics', 'Comprendre et respecter les droits d''auteur',
  '<h2>Copyright 101</h2><p>Les droits d''auteur protègent...</p>',
  'guide', 'beginner', 20, 'published', now(), ARRAY['copyright', 'juridique', 'droits']),

  (cat_legal, 'Déclarations Fiscales pour Créateurs', 'tax-declarations-creators', 'Guide fiscal pour créateurs de contenu',
  '<h2>Fiscalité Créateur</h2><p>En tant que créateur, vous devez...</p>',
  'guide', 'intermediate', 45, 'published', now(), ARRAY['fiscal', 'impôts', 'juridique'])

  ON CONFLICT (slug) DO NOTHING;
END $$;

-- Insert community announcements
INSERT INTO community_announcements (title, content, type, severity, published_at, is_pinned, status) VALUES
('Nouvelles Fonctionnalités: Janvier 2026', 
'🎉 Nous sommes ravis d''annoncer plusieurs nouvelles fonctionnalités:\n\n- **Streaming 4K** maintenant disponible pour tous les créateurs vérifiés\n- **Analytics avancés** avec insights IA\n- **Système de badges** pour récompenser l''engagement\n- **Mode collaboration** pour les chaînes multi-créateurs\n\nToutes ces fonctionnalités sont disponibles dès maintenant!',
'feature', 'info', now() - interval '2 days', true, 'active'),

('Maintenance Programmée - 25 Janvier', 
'⚠️ Maintenance programmée le 25 janvier de 2h à 4h (heure de Paris).\n\nServices affectés:\n- Upload de vidéos (temporairement indisponible)\n- Streaming live (peut être instable)\n\nLes vidéos existantes restent accessibles normalement.',
'maintenance', 'warning', now() - interval '1 day', true, 'active'),

('Goroti atteint 1 million de créateurs!', 
'🎊 Merci à tous! Nous venons de franchir le cap du million de créateurs actifs sur la plateforme.\n\nPour célébrer, nous doublons les revenus de tous les créateurs pendant les 7 prochains jours!',
'general', 'info', now() - interval '5 days', false, 'active'),

('Nouveau Programme d''Ambassadeurs', 
'🌟 Rejoignez notre programme d''ambassadeurs et aidez-nous à faire grandir la communauté.\n\nAvantages:\n- Revenus bonus de 25%\n- Accès anticipé aux fonctionnalités\n- Badge exclusif\n- Support dédié\n\nCandidatures ouvertes jusqu''au 31 janvier!',
'general', 'info', now() - interval '3 days', true, 'active');

-- Insert knowledge base
INSERT INTO knowledge_base (category, question, answer, keywords, order_index, status) VALUES
('Compte', 'Comment créer un compte Goroti?', 
'Pour créer un compte Goroti:\n1. Cliquez sur "Connexion" en haut à droite\n2. Sélectionnez "Créer un compte"\n3. Entrez votre email et choisissez un mot de passe\n4. Validez votre email\n5. Complétez votre profil\n\nVotre compte est créé et vous avez automatiquement une chaîne!',
ARRAY['compte', 'inscription', 'créer', 'nouveau'], 1, 'published'),

('Compte', 'J''ai oublié mon mot de passe, que faire?',
'Pour réinitialiser votre mot de passe:\n1. Cliquez sur "Mot de passe oublié?" sur la page de connexion\n2. Entrez votre email\n3. Vérifiez votre boîte email (et spam)\n4. Cliquez sur le lien de réinitialisation\n5. Créez un nouveau mot de passe\n\nLe lien expire après 24h.',
ARRAY['mot de passe', 'oublié', 'réinitialiser', 'récupération'], 2, 'published'),

('Upload', 'Quels formats vidéo sont acceptés?',
'Goroti accepte la plupart des formats vidéo courants:\n- MP4 (recommandé)\n- MOV\n- AVI\n- MKV\n- WebM\n\nRecommandations:\n- Codec: H.264 ou H.265\n- Résolution: jusqu''à 4K (3840x2160)\n- Framerate: 24-60 fps\n- Bitrate: 8-50 Mbps selon résolution',
ARRAY['format', 'vidéo', 'upload', 'codec'], 1, 'published'),

('Upload', 'Quelle est la taille maximale de fichier?',
'Limites d''upload:\n- Utilisateurs gratuits: 2 GB\n- Premium Basic: 5 GB\n- Premium Plus: 10 GB\n- Premium Ultimate: 20 GB\n- Créateurs vérifiés: 50 GB\n\nPour les vidéos plus longues, nous recommandons une compression optimale.',
ARRAY['taille', 'limite', 'fichier', 'upload'], 2, 'published'),

('Monétisation', 'Comment rejoindre le programme partenaire?',
'Critères d''éligibilité:\n1. 1,000 abonnés minimum\n2. 4,000 heures de visionnage sur 12 mois\n3. Compte en règle (pas de strikes)\n4. KYC validé\n5. Contenu conforme aux CGU\n\nUne fois éligible, activez la monétisation dans les paramètres de votre chaîne.',
ARRAY['partenaire', 'monétisation', 'revenus', 'éligibilité'], 1, 'published'),

('Monétisation', 'Quand puis-je retirer mes revenus?',
'Conditions de retrait:\n- Seuil minimum: 50€\n- Délai: 3-7 jours ouvrés\n- KYC obligatoire\n- Méthodes: virement bancaire, PayPal, Stripe\n\nLes revenus sont calculés le 1er de chaque mois pour le mois précédent.',
ARRAY['retrait', 'paiement', 'revenus', 'seuil'], 2, 'published'),

('Technique', 'Ma vidéo ne se charge pas, pourquoi?',
'Causes possibles:\n1. Encodage en cours (jusqu''à 30 min)\n2. Format non supporté\n3. Fichier corrompu\n4. Connexion internet instable\n5. Cache navigateur\n\nSolutions:\n- Attendez la fin de l''encodage\n- Vérifiez les formats supportés\n- Videz le cache\n- Réessayez dans 1h\n\nSi le problème persiste, contactez le support.',
ARRAY['vidéo', 'chargement', 'erreur', 'technique'], 1, 'published'),

('Communauté', 'Comment créer une communauté?',
'Pour créer une communauté:\n1. Soyez un créateur vérifié\n2. Allez dans "Studio" > "Communauté"\n3. Cliquez sur "Créer une communauté"\n4. Définissez nom, description, règles\n5. Choisissez la visibilité (public/privé/premium)\n6. Validez\n\nVous pouvez gérer les membres, posts et modération depuis le tableau de bord.',
ARRAY['communauté', 'créer', 'gestion'], 1, 'published'),

('Sécurité', 'Comment activer l''authentification à deux facteurs?',
'Pour activer la 2FA:\n1. Paramètres > Sécurité\n2. "Authentification à deux facteurs"\n3. Choisissez la méthode (app, SMS, email)\n4. Suivez les instructions\n5. Sauvegardez les codes de secours\n\nRecommandé pour tous les créateurs!',
ARRAY['2fa', 'sécurité', 'authentification', 'protection'], 1, 'published');

