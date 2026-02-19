// Contenus détaillés des articles d'aide supplémentaires
// Importé dans ResourcesPage.tsx pour éviter un fichier trop volumineux

export const copyrightProtectionContent = {
  introduction: 'Goroti respecte les droits d\'auteur et applique strictement le DMCA (Digital Millennium Copyright Act). Si votre contenu est utilisé sans permission, vous pouvez signaler la violation.',
  droitsProtegés: [
    {
      type: 'Vidéos originales',
      protection: 'Automatique dès création',
      duree: 'Vie auteur + 70 ans',
      preuve: 'Upload = preuve antériorité'
    },
    {
      type: 'Musique',
      protection: 'Composition + enregistrement',
      organismes: 'SACEM, BMI, ASCAP selon pays',
      important: 'Enregistrer auprès organisme'
    },
    {
      type: 'Images/visuels',
      protection: 'Automatique dès création',
      watermark: 'Recommandé mais optionnel',
      stock: 'Vérifier licence si stock photo'
    },
    {
      type: 'Contenu écrit',
      protection: 'Scripts, descriptions, sous-titres',
      plagiat: 'Détection automatique Goroti',
      recours: 'Signalement DMCA'
    }
  ],
  signalerViolation: {
    conditions: [
      'Vous êtes titulaire droits OU représentant autorisé',
      'Contenu copié identifiable clairement',
      'Pas d\'autorisation (licence, fair use)',
      'Bonne foi (pas signalement abusif)'
    ],
    processus: [
      {
        etape: 1,
        titre: 'Identifier contenu violant',
        action: 'URL exacte vidéo/contenu concerné',
        screenshot: 'Captures écran recommandées',
        comparaison: 'Votre original vs copie'
      },
      {
        etape: 2,
        titre: 'Remplir formulaire DMCA',
        acces: 'Footer → Droits d\'auteur → Signaler',
        informationsRequises: [
          'Vos coordonnées complètes',
          'Description œuvre originale',
          'Preuve propriété (upload original, certificat)',
          'URL contenu violant sur Goroti',
          'Déclaration bonne foi',
          'Signature électronique'
        ]
      },
      {
        etape: 3,
        titre: 'Soumission et vérification',
        delai: 'Accusé réception sous 24h',
        verification: 'Équipe légale examine 2-5 jours ouvrés',
        complements: 'Possibles si dossier incomplet'
      },
      {
        etape: 4,
        titre: 'Décision et action',
        approuve: 'Contenu retiré sous 24h',
        refuse: 'Explications + possibilité compléments',
        notification: 'Uploader notifié du retrait + raisons'
      }
    ],
    delaisAction: {
      urgence: '24-48h si violation flagrante',
      standard: '5-7 jours ouvrés',
      complexe: 'Jusqu\'à 14 jours si ambigüité',
      recours: 'Uploader peut contre-notifier (voir article Contestation DMCA)'
    }
  },
  fairUse: {
    definition: 'Utilisation limitée contenu protégé sans autorisation pour critique, commentaire, enseignement, recherche',
    criteres: [
      'But et caractère utilisation (éducatif, non commercial)',
      'Nature œuvre protégée',
      'Quantité utilisée (courtes citations)',
      'Effet sur marché œuvre originale'
    ],
    exemples: {
      autorise: [
        'Extrait 10-15s pour critique/review',
        'Parodie transformative',
        'Tutoriel éducatif avec extraits courts',
        'Commentaire actualité avec images'
      ],
      nonAutorise: [
        'Re-upload intégral avec commentaire',
        'Compilation extraits longs',
        'Utilisation commerciale sans transformation',
        'Substitut à l\'original'
      ]
    },
    zonegrise: 'Fair use complexe, pas définition absolue. En cas doute: demander autorisation ou ne pas utiliser.'
  },
  contentID: {
    systeme: 'Détection automatique contenu protégé',
    fonctionnement: [
      'Base données empreintes audio/vidéo',
      'Scan automatique uploads',
      'Correspondance → notification ayant-droit',
      'Options: bloquer, monétiser, tracker'
    ],
    pourCreateurs: 'Inscrivez contenu dans Content ID si revenus réguliers (KYC 3 requis)',
    protection: 'Détecte réutilisations automatiquement',
    revenus: 'Monétisation sur copies au lieu retrait'
  },
  sanctionsViolateurs: {
    premiereViolation: 'Avertissement + retrait contenu',
    deuxiemeViolation: 'Suspension upload 7 jours',
    troisiemeViolation: 'Suspension 30 jours + perte monétisation',
    recidive: 'Fermeture compte définitive',
    fraudeGrave: 'Fermeture immédiate + poursuites possibles'
  },
  protegerVotreContenu: [
    'Marquer vidéos avec watermark discret',
    'Enregistrer contenu officiel (dépôt INPI si important)',
    'Garder preuves création (fichiers sources, versions, dates)',
    'Surveiller copies avec outils (Google Alerts, TinEye)',
    'Agir rapidement si violation détectée',
    'Rejoindre Content ID si créateur actif'
  ],
  faq: [
    {
      q: 'Puis-je utiliser musique si je crédite l\'artiste?',
      r: 'Non, crédit ne remplace pas autorisation. Utilisez musique libre droits ou licenciée.'
    },
    {
      q: 'Fair use protège-t-il ma review complète d\'un film?',
      r: 'Extraits courts oui, re-upload intégral non. Limitez à 10-15% durée avec commentaire substantiel.'
    },
    {
      q: 'Combien de temps prend signalement DMCA?',
      r: '5-7 jours en moyenne. Violations flagrantes traitées sous 24-48h.'
    },
    {
      q: 'Que se passe-t-il si mon signalement est rejeté?',
      r: 'Explications fournies. Vous pouvez compléter dossier ou saisir justice si désaccord.'
    }
  ]
};

export const contentReportingContent = {
  introduction: 'Goroti encourage signalement contenu inapproprié pour maintenir communauté sûre et respectueuse. Tous signalements examinés confidentiellement.',
  typesSignalements: [
    {
      categorie: 'Violence explicite',
      exemples: ['Agression physique', 'Sang/gore gratuit', 'Cruauté animaux', 'Automutilation'],
      gravite: 'Critique - traitement prioritaire'
    },
    {
      categorie: 'Contenu sexuel',
      exemples: ['Nudité explicite', 'Actes sexuels', 'Exploitation mineurs', 'Pornographie'],
      gravite: 'Critique - retrait immédiat si mineurs'
    },
    {
      categorie: 'Discours de haine',
      exemples: ['Racisme', 'Sexisme', 'Homophobie', 'Incitation violence groupe'],
      gravite: 'Très grave - sanctions sévères'
    },
    {
      categorie: 'Harcèlement',
      exemples: ['Intimidation', 'Doxxing', 'Menaces', 'Harcèlement coordonné'],
      gravite: 'Grave - enquête approfondie'
    },
    {
      categorie: 'Spam/Arnaque',
      exemples: ['Spam répétitif', 'Pyramides', 'Phishing', 'Contenu trompeur'],
      gravite: 'Modérée - retrait + avertissement'
    },
    {
      categorie: 'Contenu trompeur',
      exemples: ['Fake news graves', 'Deepfakes malveillants', 'Désinformation santé', 'Manipulation électorale'],
      gravite: 'Grave si impact significatif'
    },
    {
      categorie: 'Violation vie privée',
      exemples: ['Publication données privées', 'Contenu intime non consenti', 'Doxxing'],
      gravite: 'Très grave - retrait prioritaire'
    },
    {
      categorie: 'Contenu illégal',
      exemples: ['Vente drogues', 'Armes', 'Contrefaçon', 'Activités criminelles'],
      gravite: 'Critique - signalement autorités si nécessaire'
    }
  ],
  commentSignaler: {
    etapes: [
      {
        numero: 1,
        action: 'Cliquer icône drapeau/report',
        emplacements: ['Sous vidéo (icône ⚠️)', 'Menu ⋮ vidéo', 'Commentaire (icône drapeau)', 'Profil utilisateur']
      },
      {
        numero: 2,
        action: 'Sélectionner raison',
        important: 'Choisir catégorie la plus précise',
        multiples: 'Possible si plusieurs violations'
      },
      {
        numero: 3,
        action: 'Ajouter détails',
        informations: [
          'Timestamp précis si partie vidéo',
          'Contexte additionnel',
          'Liens preuves externes si applicable',
          'Impact subi si personnel'
        ],
        optionnel: 'Mais améliore traitement'
      },
      {
        numero: 4,
        action: 'Soumettre',
        anonymat: 'Uploader ne voit PAS qui a signalé',
        confirmation: 'Email accusé réception',
        reference: 'Numéro signalement fourni'
      }
    ]
  },
  traitementSignalement: {
    etape1: {
      titre: 'Réception et tri',
      delai: 'Immédiat',
      action: 'Classification automatique gravité',
      priorite: 'Mineurs, violence, harcèlement traités en premier'
    },
    etape2: {
      titre: 'Examen humain',
      delai: '2-48h selon gravité',
      moderateurs: 'Équipe formée + diversifiée',
      contexte: 'Prise en compte nuances culturelles, satire, etc.'
    },
    etape3: {
      titre: 'Décision',
      options: [
        'Aucune violation: signalement rejeté',
        'Violation légère: avertissement uploader',
        'Violation modérée: retrait contenu',
        'Violation grave: suspension compte',
        'Violation critique: fermeture compte + signalement autorités'
      ]
    },
    etape4: {
      titre: 'Notification',
      rapporteur: 'Email résultat (sans détails sanctions)',
      uploader: 'Notification décision + raisons + recours possibles',
      transparence: 'Rapport trimestriel statistiques modération publié'
    }
  },
  delaisTraitement: {
    urgent: '< 1h (mineurs, menaces imminentes)',
    prioritaire: '2-6h (violence, harcèlement)',
    important: '24-48h (spam, désinformation)',
    standard: '3-5 jours (autres cas)',
    complexe: 'Jusqu\'à 10 jours (enquête approfondie)',
    weekends: '+24h délais (équipe réduite)'
  },
  appealsRecours: {
    uploaderSanctionné: {
      titre: 'Contester décision modération',
      delai: '14 jours après notification',
      processus: 'Formulaire appel avec justifications',
      reexamen: 'Modérateur différent réexamine',
      final: 'Décision appel définitive (sauf erreur manifeste)'
    },
    rapporteurInsatisfait: {
      titre: 'Si signalement rejeté',
      explication: 'Email avec raisons rejet',
      option: 'Nouveaux éléments? Nouveau signalement possible',
      externe: 'Recours légaux si contenu illégal avéré'
    }
  },
  signalementAbusif: {
    definition: 'Signalement fait de mauvaise foi pour nuire',
    exemples: [
      'Signalements massifs coordonnés',
      'Fausses accusations répétées',
      'Vendetta personnelle',
      'Censure opinion légitime'
    ],
    sanctions: [
      '1ère fois: Avertissement',
      'Récidive: Perte capacité signalement',
      'Abus grave: Suspension compte'
    ],
    protection: 'Créateurs peuvent signaler harcèlement via signalements abusifs'
  },
  moderationIA: {
    detection: 'IA scanne automatiquement uploads',
    blocage: 'Contenu interdit bloqué avant publication',
    signalement: 'Cas ambigus marqués pour examen humain',
    amelioration: 'IA apprend des décisions humaines',
    humainFinal: 'Décision finale toujours humaine'
  },
  transparence: {
    rapports: 'Rapports modération publiés trimestriellement',
    statistiques: [
      'Nombre signalements reçus par catégorie',
      'Taux violations confirmées',
      'Délais traitement moyens',
      'Sanctions appliquées',
      'Appels et résultats'
    ],
    acces: 'gorot i.com/transparency'
  },
  protectionUtilisateurs: [
    'Anonymat rapporteurs garanti',
    'Pas représailles tolérées (bannable)',
    'Support dédié victimes harcèlement',
    'Collaboration forces ordre si nécessaire',
    'Ressources aide externes fournies'
  ],
  bonnesPratiques: [
    'Signaler uniquement vraies violations (pas opinions différentes)',
    'Fournir contexte et preuves',
    'Un signalement suffit (pas spam)',
    'Bloquer utilisateur en plus de signaler si harcèlement',
    'Conserver preuves si affaire grave (screenshots, archives)'
  ]
};

// Ajoutez d'autres contenus ci-dessous pour les articles restants...
// Je vais créer un système modulaire pour éviter que ResourcesPage.tsx devienne trop gros

export const helpArticlesContent = {
  copyrightProtection: copyrightProtectionContent,
  contentReporting: contentReportingContent
  // À compléter avec les autres articles
};
