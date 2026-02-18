export interface UniverseDetail {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  longDescription: string;
  bestPractices: string[];
  contentExamples: string[];
  targetAudience: string;
  trendingTopics: string[];
  monetizationTips: string[];
}

export const universeDetails: Record<string, UniverseDetail> = {
  music: {
    id: 'music',
    name: 'Music',
    icon: '🎵',
    color: 'from-pink-500 to-purple-500',
    description: 'Partagez votre musique, clips, concerts et performances live',
    longDescription: 'L\'univers Music est dédié à tous les créateurs musicaux : artistes, producteurs, DJ, musiciens. Partagez vos créations originales, clips vidéo, performances live, covers, freestyles et bien plus. Connectez-vous avec une communauté passionnée de musique de tous genres.',
    bestPractices: [
      'Utilisez une qualité audio optimale (au minimum 256 kbps)',
      'Ajoutez les paroles dans la description pour améliorer l\'engagement',
      'Créez des miniatures visuellement attirantes avec votre artwork',
      'Mentionnez tous les collaborateurs et producteurs',
      'Ajoutez des timestamps pour les différentes parties de la chanson'
    ],
    contentExamples: [
      'Clips musicaux officiels',
      'Sessions live et performances',
      'Freestyles et improvisations',
      'Covers et reprises',
      'Making-of et processus créatif',
      'Concerts et festivals',
      'Interviews d\'artistes',
      'Analyses musicales'
    ],
    targetAudience: 'Mélomanes, fans de musique urbaine, artistes, producteurs, DJ',
    trendingTopics: [
      'Afrobeat et Amapiano en forte croissance',
      'Collaborations internationales',
      'Drill et Trap français',
      'Sessions acoustiques',
      'Remixes et mashups'
    ],
    monetizationTips: [
      'Activez les revenus streaming si vous êtes l\'artiste original',
      'Proposez des exclusivités à vos abonnés Premium',
      'Vendez vos instrumentales ou packs de samples',
      'Créez du merchandising (vêtements, accessoires)',
      'Offrez des cours de production ou d\'instrument'
    ]
  },
  game: {
    id: 'game',
    name: 'Game',
    icon: '🎮',
    color: 'from-blue-500 to-cyan-500',
    description: 'Gaming, streams, highlights et compétitions esport',
    longDescription: 'L\'univers Game rassemble toute la communauté gaming : streamers, joueurs pro, créateurs de contenu gaming. Partagez vos meilleurs moments, tutoriels, analyses, streams et participez à l\'écosystème esport en pleine expansion.',
    bestPractices: [
      'Mentionnez le nom du jeu dans le titre et les tags',
      'Ajoutez des timestamps pour les moments clés',
      'Utilisez une webcam pour créer du lien avec votre audience',
      'Commentez vos actions pour expliquer vos stratégies',
      'Éditez vos vidéos pour ne garder que les meilleurs moments'
    ],
    contentExamples: [
      'Streams de gameplay',
      'Highlights et meilleurs moments',
      'Tutoriels et guides',
      'Speedruns et défis',
      'Reviews de jeux',
      'Analyses de tournois esport',
      'Let\'s Play et walkthroughs',
      'News et actualités gaming'
    ],
    targetAudience: 'Gamers, esportifs, fans de jeux vidéo, streamers',
    trendingTopics: [
      'Battle Royale (Fortnite, Warzone, Apex)',
      'Jeux compétitifs (Valorant, CS:GO, LoL)',
      'Gaming mobile en expansion',
      'Speedruns et records du monde',
      'Jeux indés innovants'
    ],
    monetizationTips: [
      'Acceptez les TruCoins pendant vos lives',
      'Créez des guides premium payants',
      'Proposez du coaching personnalisé',
      'Vendez vos presets et configurations',
      'Partenariats avec marques gaming'
    ]
  },
  know: {
    id: 'know',
    name: 'Know',
    icon: '📚',
    color: 'from-yellow-500 to-orange-500',
    description: 'Formations, business, finance, crypto, IA et apprentissage',
    longDescription: 'L\'univers Know est le hub éducatif de TruTube. Partagez vos connaissances en business, finance, crypto, IA, marketing et bien plus. Aidez votre audience à développer de nouvelles compétences et à se former sur des sujets d\'actualité.',
    bestPractices: [
      'Structurez votre contenu avec une intro, développement et conclusion',
      'Utilisez des supports visuels (slides, graphiques, schémas)',
      'Sourcez vos informations et citez vos références',
      'Proposez des exercices pratiques ou cas d\'étude',
      'Créez des séries de vidéos pour approfondir un sujet'
    ],
    contentExamples: [
      'Formations et tutoriels',
      'Analyses financières et économiques',
      'Guides crypto et blockchain',
      'Cours sur l\'Intelligence Artificielle',
      'Stratégies marketing et business',
      'Documentaires éducatifs',
      'Explications scientifiques',
      'Cours de langues'
    ],
    targetAudience: 'Entrepreneurs, étudiants, investisseurs, autodidactes, professionnels',
    trendingTopics: [
      'Intelligence Artificielle et ChatGPT',
      'Cryptomonnaies et DeFi',
      'Marketing digital et réseaux sociaux',
      'Développement personnel professionnel',
      'Investissement et finance personnelle'
    ],
    monetizationTips: [
      'Créez des cours complets payants',
      'Proposez du consulting ou coaching',
      'Vendez des templates et outils',
      'Organisez des masterclass exclusives',
      'Affiliation sur outils et formations'
    ]
  },
  culture: {
    id: 'culture',
    name: 'Culture',
    icon: '🎭',
    color: 'from-purple-500 to-pink-500',
    description: 'Podcasts, débats, interviews, cinéma et analyses culturelles',
    longDescription: 'L\'univers Culture célèbre l\'art sous toutes ses formes. Podcasts, débats de société, interviews exclusives, analyses cinéma, storytelling et humour. Un espace pour les créateurs qui veulent faire réfléchir, rire et inspirer.',
    bestPractices: [
      'Soignez la qualité audio (crucial pour les podcasts)',
      'Préparez vos interviews avec des questions pertinentes',
      'Créez des chapitres pour faciliter la navigation',
      'Ajoutez des visuels engageants même pour l\'audio',
      'Invitez des personnalités variées et intéressantes'
    ],
    contentExamples: [
      'Podcasts et discussions',
      'Interviews d\'artistes et personnalités',
      'Analyses de films et séries',
      'Débats de société',
      'Storytelling et récits',
      'Stand-up et sketchs',
      'Critiques littéraires',
      'Documentaires culturels'
    ],
    targetAudience: 'Curieux, cinéphiles, amateurs d\'art, intellectuels, fans d\'humour',
    trendingTopics: [
      'Podcasts long-format',
      'Débats politiques et sociétaux',
      'Analyses de séries Netflix/Prime',
      'Stand-up et humour français',
      'Interviews d\'entrepreneurs et créateurs'
    ],
    monetizationTips: [
      'Proposez des épisodes premium exclusifs',
      'Créez une communauté payante',
      'Sponsorships et partenariats marques',
      'Vente de produits dérivés',
      'Événements live payants'
    ]
  },
  life: {
    id: 'life',
    name: 'Life',
    icon: '✨',
    color: 'from-green-500 to-teal-500',
    description: 'Lifestyle, relations, voyage, fitness et bien-être',
    longDescription: 'L\'univers Life est dédié au quotidien et au développement personnel. Partagez vos expériences de vie, conseils relations, voyages, fitness, nutrition et bien-être. Inspirez votre communauté à vivre mieux.',
    bestPractices: [
      'Soyez authentique et partagez vos vraies expériences',
      'Donnez des conseils pratiques et applicables',
      'Montrez des résultats avant/après si pertinent',
      'Créez des vlogs engageants avec bon montage',
      'Interagissez avec votre communauté pour comprendre leurs besoins'
    ],
    contentExamples: [
      'Vlogs lifestyle et quotidien',
      'Conseils relations et dating',
      'Guides de voyage et découvertes',
      'Routines fitness et musculation',
      'Recettes healthy et nutrition',
      'Organisation et productivité',
      'Mode et style personnel',
      'Parentalité et famille'
    ],
    targetAudience: 'Jeunes adultes, voyageurs, sportifs, personnes en quête de bien-être',
    trendingTopics: [
      'Morning routines et productivité',
      'Voyages exotiques et van life',
      'Transformations fitness',
      'Minimalisme et slow living',
      'Dating et relations modernes'
    ],
    monetizationTips: [
      'Affiliation produits lifestyle (Amazon, etc.)',
      'Créez des programmes fitness/nutrition',
      'Partenariats avec marques lifestyle',
      'Vendez vos presets photo/vidéo',
      'Organisez des voyages de groupe'
    ]
  },
  mind: {
    id: 'mind',
    name: 'Mind',
    icon: '🧠',
    color: 'from-indigo-500 to-purple-500',
    description: 'Développement personnel, spiritualité et psychologie',
    longDescription: 'L\'univers Mind est l\'espace de croissance personnelle et spirituelle. Partagez vos connaissances en développement personnel, méditation, psychologie, philosophie et motivation. Aidez votre audience à évoluer mentalement et spirituellement.',
    bestPractices: [
      'Créez un environnement calme et apaisant',
      'Parlez lentement et clairement pour la méditation',
      'Proposez des exercices pratiques',
      'Citez des études scientifiques quand possible',
      'Soyez bienveillant et non-jugeant'
    ],
    contentExamples: [
      'Méditations guidées',
      'Conférences développement personnel',
      'Analyses psychologiques',
      'Philosophie appliquée au quotidien',
      'Techniques de motivation',
      'Gestion du stress et anxiété',
      'Leadership et discipline',
      'Spiritualité et pleine conscience'
    ],
    targetAudience: 'Personnes en quête de sens, leaders, méditants, entrepreneurs',
    trendingTopics: [
      'Méditation et pleine conscience',
      'Stoïcisme et philosophie pratique',
      'Gestion du stress post-COVID',
      'Productivité et discipline',
      'Intelligence émotionnelle'
    ],
    monetizationTips: [
      'Créez des programmes de coaching',
      'Vendez des méditations guidées complètes',
      'Organisez des retraites spirituelles',
      'Proposez des consultations individuelles',
      'Écrivez et vendez des livres/ebooks'
    ]
  },
  lean: {
    id: 'lean',
    name: 'Lean',
    icon: '💻',
    color: 'from-cyan-500 to-blue-500',
    description: 'Développement, code, tech, no-code et freelance',
    longDescription: 'L\'univers Lean est le hub des développeurs et tech enthusiasts. Partagez vos tutoriels de code, projets tech, conseils freelance, outils no-code et tout ce qui touche au développement web/mobile et à la tech.',
    bestPractices: [
      'Montrez votre code à l\'écran avec une bonne résolution',
      'Expliquez votre raisonnement pas à pas',
      'Fournissez le code source sur GitHub',
      'Mentionnez les technologies et versions utilisées',
      'Créez des projets from scratch pour démontrer'
    ],
    contentExamples: [
      'Tutoriels de programmation',
      'Projets fullstack from scratch',
      'Reviews d\'outils et frameworks',
      'Conseils freelance et carrière tech',
      'Live coding et debugging',
      'Architecture et design patterns',
      'DevOps et déploiement',
      'Sécurité et best practices'
    ],
    targetAudience: 'Développeurs, étudiants en informatique, freelances tech, entrepreneurs tech',
    trendingTopics: [
      'Intelligence Artificielle et ML',
      'React, Next.js et frameworks modernes',
      'No-code et outils Supabase',
      'Cloud et serverless',
      'Cybersécurité'
    ],
    monetizationTips: [
      'Créez des cours de programmation complets',
      'Vendez des templates et boilerplates',
      'Proposez du mentorat technique',
      'Affiliation hébergeurs et outils',
      'Développez des outils SaaS'
    ]
  },
  movie: {
    id: 'movie',
    name: 'Movie',
    icon: '🎬',
    color: 'from-red-500 to-pink-500',
    description: 'Films, séries, anime, critiques et analyses cinéma',
    longDescription: 'L\'univers Movie est le paradis des cinéphiles et créateurs audiovisuels. Partagez vos courts-métrages, critiques, analyses, reactions, théories sur films/séries/anime. Célébrez le 7ème art sous toutes ses formes.',
    bestPractices: [
      'Évitez les spoilers ou avertissez clairement',
      'Utilisez des extraits courts (fair use)',
      'Apportez une analyse originale et pertinente',
      'Soignez votre montage et transitions',
      'Créez des miniatures style cinéma'
    ],
    contentExamples: [
      'Courts-métrages originaux',
      'Critiques de films et séries',
      'Analyses et décryptages',
      'Reactions et first watch',
      'Théories et easter eggs',
      'Making-of et VFX breakdown',
      'Reviews d\'anime et manga',
      'Top films par genre/thème'
    ],
    targetAudience: 'Cinéphiles, fans de séries, otakus, créateurs audiovisuels',
    trendingTopics: [
      'Séries Netflix et Prime Video',
      'Univers Marvel et DC',
      'Anime shonen populaires',
      'Films indépendants',
      'Critiques sans spoilers'
    ],
    monetizationTips: [
      'Proposez des analyses exclusives premium',
      'Créez une communauté de cinéphiles',
      'Partenariats plateformes streaming',
      'Vendez vos courts-métrages',
      'Organisez des projections privées'
    ]
  },
  sport: {
    id: 'sport',
    name: 'Sport',
    icon: '⚽',
    color: 'from-orange-500 to-red-500',
    description: 'Sports, fitness, analyses, highlights et entraînements',
    longDescription: 'L\'univers Sport couvre tous les sports : football, basketball, MMA, fitness et plus. Partagez des highlights, analyses tactiques, entraînements, débats sportifs et inspirez une communauté passionnée de sport.',
    bestPractices: [
      'Filmez en qualité HD minimum pour les actions',
      'Ajoutez des ralentis pour les moments clés',
      'Fournissez des analyses tactiques détaillées',
      'Montrez les exercices sous plusieurs angles',
      'Ajoutez des statistiques pertinentes'
    ],
    contentExamples: [
      'Highlights de matchs',
      'Analyses tactiques',
      'Débats et discussions sportives',
      'Tutoriels techniques',
      'Entraînements et exercices',
      'Transformations physiques',
      'News et transferts',
      'Performances extrêmes'
    ],
    targetAudience: 'Sportifs, fans de sport, athlètes, coachs, passionnés fitness',
    trendingTopics: [
      'Football européen et Ligue 1',
      'NBA et basketball',
      'MMA et sports de combat',
      'Fitness et transformation',
      'Sports mécaniques (F1, MotoGP)'
    ],
    monetizationTips: [
      'Créez des programmes d\'entraînement',
      'Proposez du coaching sportif',
      'Affiliation équipement sportif',
      'Partenariats marques de sport',
      'Organisez des stages et camps'
    ]
  }
};

export function getUniverseDetail(universeId: string): UniverseDetail | null {
  return universeDetails[universeId] || null;
}

export function getAllUniverseDetails(): UniverseDetail[] {
  return Object.values(universeDetails);
}
