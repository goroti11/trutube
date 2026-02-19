/*
  # Seed Blog Demo Data

  Adds demo categories and articles to showcase the blog system
*/

-- Insert demo categories
INSERT INTO blog_categories (name, slug, description, icon, color) VALUES
  ('Actualités', 'actualites', 'Dernières nouvelles et mises à jour de TruTube', '📰', '#ef4444'),
  ('Guides', 'guides', 'Tutoriels et guides pratiques', '📚', '#3b82f6'),
  ('Fonctionnalités', 'fonctionnalites', 'Nouvelles fonctionnalités et améliorations', '✨', '#8b5cf6'),
  ('Communauté', 'communaute', 'Histoires et témoignages de la communauté', '👥', '#10b981'),
  ('Créateurs', 'createurs', 'Conseils et ressources pour créateurs', '🎬', '#f59e0b')
ON CONFLICT (slug) DO NOTHING;

-- Insert demo articles
DO $$
DECLARE
  cat_actualites uuid;
  cat_guides uuid;
  cat_fonctionnalites uuid;
  cat_communaute uuid;
  cat_createurs uuid;
BEGIN
  -- Get category IDs
  SELECT id INTO cat_actualites FROM blog_categories WHERE slug = 'actualites';
  SELECT id INTO cat_guides FROM blog_categories WHERE slug = 'guides';
  SELECT id INTO cat_fonctionnalites FROM blog_categories WHERE slug = 'fonctionnalites';
  SELECT id INTO cat_communaute FROM blog_categories WHERE slug = 'communaute';
  SELECT id INTO cat_createurs FROM blog_categories WHERE slug = 'createurs';

  -- Article 1: Bienvenue sur TruTube
  INSERT INTO blog_articles (
    title, slug, excerpt, content, category_id, status, published_at, tags, cover_image
  ) VALUES (
    'Bienvenue sur TruTube : La Révolution du Contenu Authentique',
    'bienvenue-trutube-revolution-contenu',
    'Découvrez TruTube, la plateforme qui place la vérité et l''authenticité au cœur du partage de contenu. Une nouvelle ère commence aujourd''hui.',
    '<h2>Une Nouvelle Vision du Partage Vidéo</h2>
<p>TruTube est né d''une vision simple mais puissante : créer une plateforme où le contenu authentique prime sur tout le reste. Dans un monde numérique saturé de désinformation et de contenu superficiel, nous avons décidé de construire quelque chose de différent.</p>

<h3>Nos Valeurs Fondamentales</h3>
<p>Chez TruTube, nous croyons en trois piliers essentiels :</p>
<ul>
  <li><strong>Authenticité</strong> - Tout contenu doit être vérifié et transparent</li>
  <li><strong>Communauté</strong> - Les créateurs et spectateurs forment une famille</li>
  <li><strong>Innovation</strong> - Nous repoussons constamment les limites technologiques</li>
</ul>

<h3>Un Système de Monétisation Équitable</h3>
<p>Contrairement aux autres plateformes, TruTube offre aux créateurs jusqu''à 80% des revenus générés. Nous croyons que les créateurs méritent d''être rémunérés équitablement pour leur travail acharné.</p>

<h3>Rejoignez la Révolution</h3>
<p>Que vous soyez créateur de contenu ou simple spectateur, TruTube vous accueille à bras ouverts. Ensemble, construisons une plateforme qui respecte les créateurs et valorise le contenu de qualité.</p>

<p>Bienvenue dans la famille TruTube ! 🎉</p>',
    cat_actualites,
    'published',
    now() - interval '2 days',
    ARRAY['lancement', 'bienvenue', 'plateforme'],
    'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg'
  ) ON CONFLICT (slug) DO NOTHING;

  -- Article 2: Guide de démarrage
  INSERT INTO blog_articles (
    title, slug, excerpt, content, category_id, status, published_at, tags, cover_image
  ) VALUES (
    'Guide Complet : Comment Démarrer sur TruTube en 5 Étapes',
    'guide-demarrage-trutube-5-etapes',
    'Un guide pas à pas pour créer votre compte, configurer votre chaîne et publier votre première vidéo sur TruTube.',
    '<h2>Votre Premier Pas sur TruTube</h2>
<p>Vous venez de rejoindre TruTube et vous vous demandez par où commencer ? Ce guide vous accompagne étape par étape pour bien démarrer votre aventure.</p>

<h3>Étape 1 : Créer Votre Compte</h3>
<p>L''inscription sur TruTube est simple et rapide. Il vous suffit d''une adresse email valide. Nous ne demandons que les informations essentielles pour protéger votre vie privée.</p>

<h3>Étape 2 : Configurer Votre Profil</h3>
<p>Un bon profil attire les spectateurs ! Ajoutez une photo de profil professionnelle, rédigez une bio accrocheuse et ajoutez vos liens sociaux pour que votre communauté puisse vous suivre partout.</p>

<h3>Étape 3 : Créer Votre Première Chaîne</h3>
<p>Sur TruTube, chaque créateur peut gérer plusieurs chaînes. Créez votre première chaîne en définissant sa thématique et son univers. Choisissez un nom mémorable et une bannière attrayante.</p>

<h3>Étape 4 : Uploader Votre Première Vidéo</h3>
<p>Le moment tant attendu ! Notre système d''upload accepte tous les formats vidéo courants. Ajoutez un titre accrocheur, une description détaillée et des tags pertinents pour améliorer la découvrabilité.</p>

<h3>Étape 5 : Promouvoir Votre Contenu</h3>
<p>Partagez votre vidéo sur vos réseaux sociaux, rejoignez les communautés TruTube pertinentes et engagez-vous avec d''autres créateurs. La croissance vient de l''authenticité et de la constance.</p>

<h3>Conseils Bonus</h3>
<ul>
  <li>Publiez régulièrement pour fidéliser votre audience</li>
  <li>Interagissez avec vos commentaires</li>
  <li>Expérimentez avec différents formats</li>
  <li>Rejoignez le programme partenaire dès que possible</li>
</ul>

<p>Bonne chance dans votre aventure TruTube ! 🚀</p>',
    cat_guides,
    'published',
    now() - interval '5 days',
    ARRAY['guide', 'tutoriel', 'débutant'],
    'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg'
  ) ON CONFLICT (slug) DO NOTHING;

  -- Article 3: Nouvelles fonctionnalités
  INSERT INTO blog_articles (
    title, slug, excerpt, content, category_id, status, published_at, tags, cover_image
  ) VALUES (
    'Nouveauté : Le Système d''Univers Thématiques',
    'nouveaute-systeme-univers-thematiques',
    'Découvrez notre nouvelle fonctionnalité révolutionnaire : les Univers. Organisez et découvrez du contenu comme jamais auparavant.',
    '<h2>Une Nouvelle Façon de Découvrir du Contenu</h2>
<p>Nous sommes ravis d''annoncer le lancement de notre système d''Univers thématiques ! Cette fonctionnalité transforme complètement la manière dont vous découvrez et consommez du contenu sur TruTube.</p>

<h3>Qu''est-ce qu''un Univers ?</h3>
<p>Un Univers est un espace thématique dédié à un sujet spécifique. Imaginez des mondes parallèles où chaque passion a son propre écosystème :</p>
<ul>
  <li><strong>Gaming</strong> - Tous les contenus liés aux jeux vidéo</li>
  <li><strong>Éducation</strong> - Cours, tutoriels et contenus éducatifs</li>
  <li><strong>Musique</strong> - Clips, lives et découvertes musicales</li>
  <li><strong>Tech</strong> - Actualités et reviews technologiques</li>
  <li>Et bien plus encore...</li>
</ul>

<h3>Les Avantages pour les Créateurs</h3>
<p>En tant que créateur, vous pouvez maintenant :</p>
<ul>
  <li>Publier dans plusieurs univers simultanément</li>
  <li>Cibler précisément votre audience</li>
  <li>Augmenter votre visibilité dans votre niche</li>
  <li>Créer des sous-univers personnalisés</li>
</ul>

<h3>Pour les Spectateurs</h3>
<p>Découvrez du contenu pertinent plus facilement :</p>
<ul>
  <li>Navigation intuitive par thématique</li>
  <li>Recommandations ultra-précises</li>
  <li>Abonnement à des univers entiers</li>
  <li>Feed personnalisé par univers</li>
</ul>

<h3>Comment Ça Marche ?</h3>
<p>C''est simple ! Lors de l''upload d''une vidéo, sélectionnez l''univers principal et jusqu''à 3 sous-univers. Notre algorithme intelligent fera le reste pour maximiser votre audience.</p>

<p>Explorez les Univers dès maintenant et découvrez une nouvelle dimension de TruTube ! 🌌</p>',
    cat_fonctionnalites,
    'published',
    now() - interval '1 day',
    ARRAY['nouveauté', 'univers', 'fonctionnalité'],
    'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg'
  ) ON CONFLICT (slug) DO NOTHING;

  -- Article 4: Success Story
  INSERT INTO blog_articles (
    title, slug, excerpt, content, category_id, status, published_at, tags, cover_image
  ) VALUES (
    'Success Story : Comment Marie a Atteint 100K Abonnés en 3 Mois',
    'success-story-marie-100k-abonnes',
    'L''histoire inspirante de Marie, créatrice culinaire qui a explosé sur TruTube grâce à son authenticité et sa stratégie unique.',
    '<h2>De Zéro à Héroïne</h2>
<p>Marie, 28 ans, passionnée de cuisine depuis toujours, a rejoint TruTube il y a seulement 3 mois. Aujourd''hui, elle compte plus de 100 000 abonnés et génère un revenu confortable grâce à sa chaîne "Cuisine du Cœur".</p>

<h3>Le Déclic</h3>
<p>"J''en avais marre des plateformes traditionnelles où mes vidéos étaient noyées dans la masse", confie Marie. "Sur TruTube, j''ai trouvé une communauté qui valorise vraiment l''authenticité et le contenu de qualité."</p>

<h3>Sa Stratégie Gagnante</h3>
<ol>
  <li><strong>Authenticité avant tout</strong> - Marie filme dans sa vraie cuisine, avec ses vrais ratés</li>
  <li><strong>Interaction constante</strong> - Elle répond à tous les commentaires</li>
  <li><strong>Régularité</strong> - 3 vidéos par semaine, sans exception</li>
  <li><strong>Exploitation des Univers</strong> - Présente dans "Cuisine", "Lifestyle" et "Éducation"</li>
  <li><strong>Collaborations</strong> - Travaille avec d''autres créateurs TruTube</li>
</ol>

<h3>Les Revenus</h3>
<p>Grâce au système de monétisation équitable de TruTube, Marie génère maintenant :</p>
<ul>
  <li>Revenus publicitaires : 2 500€/mois</li>
  <li>Abonnements Premium : 1 800€/mois</li>
  <li>Vente de produits numériques : 1 200€/mois</li>
  <li>TruCoins et tips : 500€/mois</li>
</ul>
<p><strong>Total : 6 000€/mois</strong> après seulement 3 mois !</p>

<h3>Ses Conseils</h3>
<blockquote>
  <p>"Restez vous-même, publiez régulièrement et engagez-vous avec votre communauté. TruTube récompense l''authenticité, pas les vues factices. C''est la plateforme idéale pour les créateurs qui veulent construire quelque chose de réel."</p>
  <footer>- Marie, @CuisineDuCoeur</footer>
</blockquote>

<h3>Et Vous ?</h3>
<p>L''histoire de Marie n''est pas unique. Chaque jour, de nouveaux créateurs trouvent leur place sur TruTube. Quelle sera votre success story ?</p>

<p>Commencez votre aventure aujourd''hui ! 💫</p>',
    cat_communaute,
    'published',
    now() - interval '4 days',
    ARRAY['success-story', 'inspiration', 'témoignage'],
    'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg'
  ) ON CONFLICT (slug) DO NOTHING;

  -- Article 5: Monétisation
  INSERT INTO blog_articles (
    title, slug, excerpt, content, category_id, status, published_at, tags, cover_image
  ) VALUES (
    '7 Stratégies Avancées pour Maximiser Vos Revenus sur TruTube',
    'strategies-maximiser-revenus-trutube',
    'Un guide approfondi des meilleures techniques pour optimiser vos revenus en tant que créateur TruTube. De débutant à expert.',
    '<h2>Transformez Votre Passion en Profit</h2>
<p>Créer du contenu est votre passion, mais pourquoi ne pas en vivre confortablement ? Voici 7 stratégies éprouvées pour maximiser vos revenus sur TruTube.</p>

<h3>1. Diversifiez Vos Sources de Revenus</h3>
<p>Ne comptez pas uniquement sur la publicité. Sur TruTube, vous avez accès à :</p>
<ul>
  <li>Revenus publicitaires (jusqu''à 80% pour vous)</li>
  <li>Abonnements premium à votre chaîne</li>
  <li>Vente de produits numériques</li>
  <li>Tips et dons en TruCoins</li>
  <li>Partenariats avec des marques</li>
  <li>Vente de merchandising</li>
  <li>Cours et formations</li>
</ul>

<h3>2. Optimisez Pour le Programme Partenaire</h3>
<p>Le programme partenaire TruTube offre des avantages exceptionnels :</p>
<ul>
  <li>Partage de revenus jusqu''à 80%</li>
  <li>Accès prioritaire aux nouvelles fonctionnalités</li>
  <li>Support dédié</li>
  <li>Opportunités de sponsoring</li>
</ul>
<p><strong>Critères :</strong> 1 000 abonnés et 4 000 heures de visionnage sur 12 mois.</p>

<h3>3. Créez du Contenu Premium Exclusif</h3>
<p>Les abonnés premium paient pour du contenu exclusif. Proposez :</p>
<ul>
  <li>Vidéos en avant-première</li>
  <li>Contenu bonus et coulisses</li>
  <li>Sessions Q&A privées</li>
  <li>Accès à une communauté exclusive</li>
</ul>

<h3>4. Exploitez les TruCoins</h3>
<p>Notre cryptomonnaie native offre des opportunités uniques :</p>
<ul>
  <li>Tips instantanés de vos fans</li>
  <li>Staking pour revenus passifs</li>
  <li>Échange contre des euros</li>
  <li>Achat de services sur la plateforme</li>
</ul>

<h3>5. Collaborez Stratégiquement</h3>
<p>Les collaborations multiplient votre audience :</p>
<ul>
  <li>Choisissez des créateurs complémentaires</li>
  <li>Créez des séries ensemble</li>
  <li>Organisez des événements live communs</li>
  <li>Cross-promotion sur tous les réseaux</li>
</ul>

<h3>6. Analysez et Optimisez</h3>
<p>Utilisez les analytics TruTube pour :</p>
<ul>
  <li>Identifier vos vidéos les plus rentables</li>
  <li>Comprendre votre audience</li>
  <li>Optimiser vos horaires de publication</li>
  <li>Tester différents formats</li>
</ul>

<h3>7. Investissez dans la Qualité</h3>
<p>La qualité paie toujours sur le long terme :</p>
<ul>
  <li>Améliorez votre setup audio/vidéo</li>
  <li>Investissez dans le montage</li>
  <li>Soignez vos miniatures</li>
  <li>Travaillez votre storytelling</li>
</ul>

<h3>Exemple Concret</h3>
<p>Thomas, créateur tech avec 50K abonnés, génère 8 500€/mois :</p>
<ul>
  <li>Publicité : 3 000€</li>
  <li>Abonnements : 2 500€</li>
  <li>Sponsoring : 2 000€</li>
  <li>Produits numériques : 800€</li>
  <li>TruCoins : 200€</li>
</ul>

<h3>À Vous de Jouer !</h3>
<p>Ces stratégies ont fait leurs preuves. Commencez par en implémenter 2-3, puis ajoutez les autres progressivement. La clé est la constance et l''authenticité.</p>

<p>Bonne chance dans votre aventure entrepreneuriale ! 💰</p>',
    cat_createurs,
    'published',
    now() - interval '3 days',
    ARRAY['monétisation', 'stratégie', 'revenus'],
    'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg'
  ) ON CONFLICT (slug) DO NOTHING;

END $$;
