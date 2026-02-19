import { useState } from 'react';
import Header from '../components/Header';
import { Footer } from '../components/Footer';
import {
  Book, Video, FileText, Users, TrendingUp, Shield, PlayCircle, DollarSign,
  Scale, Cog, Wallet, AlertCircle, HelpCircle, Search, ChevronRight,
  BookOpen, ShoppingBag, Music, Globe, MessageSquare, Newspaper, Activity,
  CheckCircle, Code, Settings, ChevronDown, Sparkles, Upload, BarChart,
  Eye, Lock, CreditCard, Package, MessageCircle, UserCheck
} from 'lucide-react';

interface ResourcesPageProps {
  onNavigate: (page: string) => void;
}

export default function ResourcesPage({ onNavigate }: ResourcesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Tout', icon: Book },
    { id: 'getting-started', label: 'Démarrage', icon: PlayCircle },
    { id: 'interface', label: 'Interface', icon: Eye },
    { id: 'navigation', label: 'Navigation', icon: Globe },
    { id: 'creators', label: 'Créateurs', icon: Video },
    { id: 'monetization', label: 'Monétisation', icon: DollarSign },
    { id: 'community', label: 'Communauté', icon: Users },
    { id: 'account', label: 'Compte', icon: UserCheck },
  ];

  const documentationSections = [
    {
      id: 'splashscreen',
      category: 'getting-started',
      title: '1. SplashScreen & Première Impression',
      icon: Sparkles,
      color: 'text-cyan-400',
      content: {
        description: 'Écran de chargement animé qui s\'affiche au premier lancement de Goroti.',
        duration: 'Quelques secondes',
        phases: [
          {
            title: 'Animation de Bienvenue',
            details: [
              'Logo Goroti animé avec effet de transition',
              'Slogan: "LA VÉRITÉ AVANT TOUT"',
              'Message d\'accueil personnalisé'
            ]
          }
        ]
      }
    },
    {
      id: 'inscription',
      category: 'getting-started',
      title: '2. Inscription & Connexion',
      icon: UserCheck,
      color: 'text-green-400',
      content: {
        url: '/#auth',
        modeInscription: {
          title: 'Mode Inscription (Sign Up)',
          champs: [
            {
              nom: 'Email',
              format: 'Email valide',
              validation: 'Temps réel',
              erreurs: 'Email invalide / Email déjà utilisé'
            },
            {
              nom: 'Nom d\'utilisateur',
              format: '3-20 caractères (a-z, A-Z, 0-9, _)',
              validation: 'Unique, instantanée',
              exemples: 'alex_gamer, Sophie2024, JohnDoe'
            },
            {
              nom: 'Mot de passe',
              format: 'Min 8 caractères',
              requis: [
                'Au moins 1 majuscule',
                'Au moins 1 minuscule',
                'Au moins 1 chiffre',
                'Au moins 1 caractère spécial (@$!%*?&)'
              ],
              force: 'Indicateur: Faible / Moyen / Fort'
            },
            {
              nom: 'Conditions',
              items: [
                'Accepter CGU (obligatoire)',
                'Accepter politique confidentialité (obligatoire)',
                'Newsletter (optionnel)'
              ]
            }
          ]
        },
        modeConnexion: {
          title: 'Mode Connexion (Sign In)',
          champs: ['Email', 'Mot de passe'],
          options: [
            'Se souvenir de moi (7 jours)',
            'Mot de passe oublié? → Récupération'
          ]
        },
        apresInscription: [
          'Email de vérification envoyé',
          'Redirection vers page d\'accueil',
          'Banner: "Vérifiez votre email"',
          'Profil créé automatiquement',
          'Avatar par défaut (initiales)',
          'Badge "Nouveau" (30 jours)'
        ],
        securite: {
          protection: [
            'HTTPS obligatoire',
            'Hashing bcrypt (12 rounds)',
            'Rate limiting: 5 tentatives / 15min',
            '2FA disponible (Settings)'
          ],
          tokens: [
            'JWT expiration: 7 jours',
            'Refresh token: 30 jours',
            'Révocation: Déconnexion ou changement mdp'
          ]
        }
      }
    },
    {
      id: 'interface',
      category: 'interface',
      title: '3. Interface Utilisateur',
      icon: Eye,
      color: 'text-blue-400',
      content: {
        structure: 'Header (fixe) + Contenu (scrollable) + Footer',
        couleurs: {
          fond: '#030712 (gray-950)',
          cartes: '#111827 (gray-900)',
          bordures: '#1F2937 (gray-800)',
          textePrincipal: '#FFFFFF (white)',
          texteSecondaire: '#9CA3AF (gray-400)',
          accentCyan: '#06B6D4 (cyan-500)',
          accentRouge: '#DC2626 (red-600)'
        },
        typographie: {
          police: 'System (system-ui)',
          tailles: {
            hero: '6xl (3.75rem)',
            h1: '4xl (2.25rem)',
            h2: '3xl (1.875rem)',
            h3: '2xl (1.5rem)',
            h4: 'xl (1.25rem)',
            body: 'base (1rem)',
            small: 'sm (0.875rem)',
            tiny: 'xs (0.75rem)'
          },
          poids: {
            thin: 100,
            light: 300,
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
            black: 900
          }
        },
        espacements: 'Système 8px (1=4px, 2=8px, 3=12px, 4=16px, 6=24px, 8=32px)',
        composants: {
          boutons: [
            'Primary: bg-cyan-600 hover:bg-cyan-700',
            'Secondary: bg-gray-700 hover:bg-gray-600',
            'Danger: bg-red-600 hover:bg-red-700',
            'Success: bg-green-600 hover:bg-green-700'
          ],
          cartes: [
            'Fond: bg-gray-900',
            'Bordure: border border-gray-800',
            'Arrondi: rounded-xl',
            'Ombre: shadow-xl'
          ],
          inputs: [
            'Fond: bg-gray-800',
            'Bordure: border-gray-700',
            'Focus: ring-2 ring-cyan-500',
            'Placeholder: text-gray-400'
          ]
        },
        responsive: {
          breakpoints: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px'
          },
          approche: 'Mobile-First'
        }
      }
    },
    {
      id: 'header',
      category: 'navigation',
      title: '4. Header - Navigation Principale',
      icon: Globe,
      color: 'text-purple-400',
      content: {
        overview: 'Barre de navigation principale fixée en haut de toutes les pages.',
        sections: [
          {
            titre: 'Logo et Navigation',
            description: 'Le logo Goroti vous ramène à l\'accueil. Les icônes permettent d\'accéder aux univers, communautés, préférences, et plus encore.'
          },
          {
            titre: 'Recherche',
            description: 'Barre de recherche pour trouver des vidéos, créateurs, et communautés avec suggestions en temps réel.'
          },
          {
            titre: 'Actions',
            description: 'Boutons d\'upload, notifications, portefeuille TruCoin, et menu de profil utilisateur.'
          },
          {
            titre: 'Menu Utilisateur',
            sections: [
              'Profil et paramètres personnels',
              'Studio créateur et tableau de bord',
              'Monétisation et portefeuille',
              'Historique et contenus sauvegardés',
              'Sécurité et apparence'
            ]
          }
        ]
      }
    },
    {
      id: 'footer',
      category: 'navigation',
      title: '5. Footer - Liens Rapides',
      icon: Package,
      color: 'text-orange-400',
      content: {
        structure: '4 colonnes responsive',
        colonnes: [
          {
            nom: 'Goroti',
            contenu: [
              'Logo + Description',
              'Réseaux sociaux: Facebook, Twitter, Instagram, YouTube',
              'Description: "La plateforme qui valorise l\'authenticité"'
            ]
          },
          {
            nom: 'Plateforme',
            liens: [
              'Accueil (/#home)',
              'Explorer univers (/#universes)',
              'Devenir créateur (/#creator-setup)',
              'Préférences feed (/#preferences)'
            ]
          },
          {
            nom: 'Ressources',
            liens: [
              'À propos (/#about)',
              'Centre d\'aide (/#help)',
              'Support (/#support)',
              'Carrières (/#careers) ⭐',
              'Entreprise (/#enterprise) ⭐',
              'Ressources (/#resources)',
              'CGU (/#terms)',
              'Confidentialité (/#privacy)',
              'Mentions légales (/#legal)'
            ]
          },
          {
            nom: 'Contact',
            contenu: [
              'Email support: support@goroti.com',
              'Email créateurs: creators@goroti.com',
              'Newsletter (formulaire inscription)'
            ]
          }
        ],
        barreInferieure: {
          gauche: '© 2026 Goroti. Tous droits réservés.',
          droite: ['CGU', 'Confidentialité', 'Mentions légales', 'Aide', 'Support']
        },
        visibilite: 'Masqué sur: /#auth, /#watch/{id}, mobile demo'
      }
    },
    {
      id: 'url-access',
      category: 'navigation',
      title: '6. Accès Direct URL (Hash Routing)',
      icon: Code,
      color: 'text-yellow-400',
      content: {
        format: 'https://goroti.com/#nom-de-page',
        avantages: [
          'Pas de rechargement page',
          'Navigation instantanée',
          'Historique navigateur préservé',
          'Bookmarks fonctionnent',
          'Partage liens direct'
        ],
        routesStatiques: {
          navigation: [
            '/#home - Accueil',
            '/#universes - Explorer univers',
            '/#preferences - Préférences',
            '/#my-profile - Mon profil',
            '/#watch-history - Historique',
            '/#saved-videos - Vidéos sauvegardées'
          ],
          authentification: ['/#auth - Connexion/Inscription'],
          createur: [
            '/#creator-setup - Devenir créateur',
            '/#studio - Studio créateur',
            '/#dashboard - Tableau de bord',
            '/#upload - Upload vidéo',
            '/#my-channels - Mes chaînes',
            '/#live-streaming - Streaming live',
            '/#subscribers - Mes abonnés'
          ],
          monetisation: [
            '/#premium - Abonnement Premium',
            '/#premium-offers - Offres Premium',
            '/#trucoin-wallet - Portefeuille TruCoin',
            '/#partner-program - Programme partenaire',
            '/#referral - Parrainage',
            '/#ad-campaign - Campagnes pub',
            '/#marketplace - Marketplace musique',
            '/#album-sale - Vente albums',
            '/#revenue-model - Modèle revenus',
            '/#native-sponsoring - Sponsoring natif'
          ],
          communaute: [
            '/#community - Liste communautés',
            '/#create-community - Créer communauté',
            '/#official-community - Communauté officielle'
          ],
          parametres: [
            '/#settings - Paramètres',
            '/#appearance-settings - Apparence',
            '/#security-dashboard - Sécurité'
          ],
          entreprise: [
            '/#enterprise - Solutions entreprise',
            '/#careers - Offres d\'emploi',
            '/#pricing - Tarifs',
            '/#resources - Ressources'
          ],
          support: [
            '/#help - Centre d\'aide',
            '/#support - Support',
            '/#about - À propos',
            '/#status - Statut services'
          ],
          legal: [
            '/#terms - CGU',
            '/#privacy - Confidentialité',
            '/#legal - Mentions légales',
            '/#copyright-policy - Droits d\'auteur',
            '/#financial-terms - Conditions financières',
            '/#legal-profile - Profil légal créateur'
          ]
        },
        routesDynamiques: [
          '/#universe/{id} - Vue univers (ex: /#universe/gaming)',
          '/#watch/{id} - Lecteur vidéo (ex: /#watch/abc123)',
          '/#profile/{username} - Profil public (ex: /#profile/alex_gamer)',
          '/#community/{slug} - Page communauté (ex: /#community/goroti)',
          '/#channel-edit/{id} - Éditer chaîne',
          '/#channel-team/{id} - Équipe chaîne',
          '/#channel-analytics/{id} - Analytics chaîne'
        ],
        navigationProgrammatique: {
          javascript: 'window.location.hash = "enterprise";',
          exemple: 'window.location.hash = "watch/abc123";',
          recuperer: 'const currentHash = window.location.hash.slice(1);'
        }
      }
    },
    {
      id: 'user-status',
      category: 'creators',
      title: '7. Statuts Utilisateur & Communauté',
      icon: Users,
      color: 'text-pink-400',
      content: {
        description: 'Système de statuts utilisateur permettant de valoriser l\'engagement et fidéliser la communauté.',
        statuts: [
          {
            nom: 'Visiteur',
            obtention: 'Regarde sans compte',
            nature: 'Anonyme',
            droits: ['Navigation publique', 'Visionnage limité']
          },
          {
            nom: 'Abonné',
            obtention: 'Bouton s\'abonner',
            nature: 'Gratuit',
            droits: ['Notifications nouvelles vidéos', 'Accès posts publics', 'Commentaires', 'Participation sondages publics'],
            pasAcces: ['Contenu membre', 'Contenu premium', 'Avantages exclusifs']
          },
          {
            nom: 'Membre',
            obtention: 'Abonnement mensuel',
            nature: 'Récurrent',
            avantages: ['Vidéos privées', 'Lives privés', 'Sorties anticipées', 'Réductions store', 'Badge membre', 'Chat prioritaire'],
            niveaux: ['Fan (2€)', 'Supporter (5€)', 'VIP (10€)']
          },
          {
            nom: 'Acheteur',
            obtention: 'Achat contenu (album, vidéo premium, location)',
            nature: 'Transactionnel',
            droits: ['Accès permanent contenu acheté', 'Badge acheteur', 'HD conservée après sortie publique']
          },
          {
            nom: 'Supporter',
            obtention: 'Tips / Précommande / Participation lancement',
            nature: 'Symbolique Premium',
            effets: ['Badge visible commentaires', 'Mise en avant communauté', 'Historique soutien créateur']
          },
          {
            nom: 'Collectionneur',
            obtention: 'Édition limitée / Numérotation',
            nature: 'Prestige',
            avantages: ['Certificat', 'Prestige profil', 'Futur marché secondaire']
          }
        ],
        prioriteCommentaires: {
          titre: 'Ordre d\'affichage des commentaires',
          ordre: ['Collectionneur', 'Supporter', 'Membre', 'Acheteur', 'Abonné', 'Visiteur'],
          but: 'Valoriser les fans engagés'
        },
        notificationsIntelligentes: {
          'Nouvelle vidéo': 'abonnés',
          'Précommande': 'membres',
          'Promo': 'acheteurs',
          'Live privé': 'membres',
          'Édition limitée': 'supporters'
        },
        segmentation: {
          titre: 'Tableau créateur — segmentation audience',
          groupes: {
            'Fans gratuits': 'portée',
            'Acheteurs': 'revenus',
            'Membres': 'revenus récurrents',
            'Top supporters': 'fidélité'
          }
        },
        cumul: 'Un utilisateur peut cumuler plusieurs statuts (ex: Abonné + Acheteur + Supporter)'
      }
    },
    {
      id: 'channel-management',
      category: 'creators',
      title: '8. Gestion Complète des Chaînes',
      icon: Video,
      color: 'text-red-400',
      content: {
        description: 'Module complet de création et gestion de chaînes créateur professionnelles.',
        creationAutomatique: {
          principe: 'Chaque compte Goroti possède toujours au moins une chaîne',
          declenchement: 'Création automatique lors de l\'inscription',
          flux: ['Inscription utilisateur', 'Validation email', 'Création profil', 'Génération automatique chaîne', 'Aucune action manuelle requise'],
          donneesUtilisees: {
            'Nom chaîne': 'pseudo choisi',
            'Pseudo': 'identifiant utilisateur',
            'Photo': 'avatar compte',
            'Bannière': 'bannière par défaut',
            'Catégorie': '"Créateur" par défaut',
            'Visibilité': 'publique'
          },
          statutInitial: {
            'Publication vidéo': 'activée ✔',
            'Monétisation': 'désactivée (jusqu\'au KYC)',
            'Vente premium': 'désactivée',
            'Marketplace': 'désactivée',
            'Paiements': 'bloqués jusqu\'au KYC'
          },
          activationPostKYC: {
            'Ventes': 'activées après KYC approuvé',
            'Retraits': 'activés après KYC approuvé',
            'Marketplace': 'activée après vérification',
            'Abonnements': 'activés'
          },
          personnalisation: 'Utilisateur peut modifier nom, branding, visibilité, catégorie après création',
          multiplesChaines: {
            max: 'Limite selon statut KYC',
            exemples: ['Projet musical (alias artiste)', 'Chaîne éducative (tutos)', 'Label (multi artistes)']
          },
          avantages: ['Zéro friction utilisateur', 'Pas de configuration complexe', 'Publication immédiate', 'Chaque compte devient créateur potentiel']
        },
        creation: {
          access: 'Chaînes supplémentaires accessibles après création compte',
          etapes: ['Choisir type de chaîne', 'Définir identité publique', 'Paramétrer visibilité', 'Catégoriser contenu', 'Activer monétisation (optionnel)'],
          typesChaine: {
            'Créateur individuel': 'contenu personnel',
            'Artiste musical': 'albums / singles',
            'Label': 'multi artistes',
            'Studio / Média': 'production vidéo',
            'Marque': 'contenu commercial'
          },
          champsObligatoires: ['Nom chaîne', 'Pseudo', 'Photo', 'Bannière', 'Catégorie'],
          champsOptionnels: ['Description', 'Liens sociaux', 'Email pro', 'Pays affiché', 'Langue', 'Hashtags officiels']
        },
        visibilite: {
          'Public': 'visible',
          'Non répertorié': 'lien uniquement',
          'Privé': 'accès restreint (option membres uniquement)'
        },
        personnalisation: {
          branding: ['Logo', 'Bannière responsive', 'Intro vidéo', 'Trailer visiteurs', 'Trailer abonnés'],
          sections: {
            'Accueil': 'présentation',
            'Vidéos': 'liste',
            'Shorts': 'extraits',
            'Albums': 'premium',
            'Lives': 'directs',
            'Store': 'merch',
            'Playlists': 'collections',
            'Communauté': 'posts'
          },
          organisation: 'Ordre personnalisable drag & drop'
        },
        gestionContenu: {
          uploadVideo: {
            parametresBase: ['Titre', 'Description', 'Miniature', 'Tags', 'Catégorie', 'Langue', 'Restriction âge', 'Territoires', 'Type (gratuit/premium)'],
            avances: ['Sous-titres', 'Chapitres', 'Sponsor déclaré', 'Short associé', 'Accès membre', 'Licence']
          },
          playlists: {
            types: ['Standard', 'Série', 'Album', 'Cours', 'Saison'],
            options: ['Ordre manuel', 'Ordre automatique', 'Verrouillage premium']
          },
          lives: ['Live public/privé', 'Live payant', 'Replay automatique', 'Chat', 'Modération', 'Tips en direct', 'Sponsor live']
        },
        communityPosts: {
          types: {
            'Texte': 'annonce',
            'Image': 'teaser',
            'Vidéo courte': 'preview',
            'Sondage': 'vote fans',
            'Offre': 'promo'
          }
        },
        equipe: {
          roles: {
            'Admin': 'tout',
            'Éditeur': 'contenu',
            'Analyste': 'stats',
            'Modérateur': 'commentaires',
            'Financier': 'revenus'
          },
          description: 'Le propriétaire peut ajouter des collaborateurs'
        },
        moderation: {
          outils: ['Filtres mots interdits', 'Validation manuelle', 'Bannissement', 'Slow mode', 'Blacklist utilisateurs']
        },
        analytics: {
          audience: ['Abonnés', 'Rétention', 'Watchtime', 'Sources trafic'],
          business: ['Ventes', 'Conversion', 'Revenus'],
          engagement: ['Likes', 'Commentaires', 'Partages', 'Retour spectateurs']
        },
        syntheseModule: {
          'Publication': true,
          'Branding': true,
          'Distribution': true,
          'Vente': true,
          'Communauté': true,
          'Business': true
        }
      }
    },
    {
      id: 'monetization-channels',
      category: 'monetization',
      title: '9. Canaux de Monétisation',
      icon: DollarSign,
      color: 'text-green-400',
      content: {
        description: 'Système multi-canal de monétisation permettant aux créateurs de diversifier leurs revenus.',
        canaux: [
          {
            nom: 'Vente Premium',
            description: 'Vente directe de contenu (vidéos, albums, cours)',
            commission: '15% plateforme',
            paiement: 'Instantané au wallet'
          },
          {
            nom: 'Abonnements Fans',
            description: 'Revenus récurrents mensuels',
            niveaux: 'Configurables par créateur',
            commission: '10% plateforme'
          },
          {
            nom: 'Tips & Dons',
            description: 'Soutien volontaire des fans',
            commission: '5% plateforme',
            montantMin: '1€'
          },
          {
            nom: 'Store Merchandising',
            description: 'Vente produits dérivés',
            integration: 'Print-on-demand ou stock',
            commission: '20% plateforme'
          },
          {
            nom: 'Marketplace Services',
            description: 'Vente de services (coaching, consulting)',
            escrow: 'Protection acheteur/vendeur',
            commission: '15% plateforme'
          },
          {
            nom: 'Affiliations',
            description: 'Commissions sur produits tiers',
            tracking: 'Liens uniques',
            paiement: '30 jours après validation'
          },
          {
            nom: 'Sponsoring Natif',
            description: 'Intégration marques dans contenu',
            declaration: 'Obligatoire',
            negociation: 'Directe créateur-marque'
          },
          {
            nom: 'Publicités Display',
            description: 'Revenus pub automatiques',
            eligibilite: '1000 abonnés + 4000h watchtime',
            partage: '55% créateur / 45% plateforme'
          }
        ],
        retraits: {
          seuilMinimum: '50€',
          delais: '3-7 jours ouvrés',
          methodes: ['Virement bancaire', 'PayPal', 'Stripe', 'TruCoin (crypto)'],
          frequence: 'Mensuelle ou sur demande'
        },
        fiscalite: {
          declaration: 'Créateur responsable',
          documents: ['Factures automatiques', 'Récapitulatif annuel', 'Export comptable'],
          tva: 'Selon pays et statut'
        }
      }
    },
    {
      id: 'premium-system',
      category: 'monetization',
      title: '10. Système Premium & Abonnements',
      icon: TrendingUp,
      color: 'text-yellow-400',
      content: {
        description: 'Système d\'abonnements Premium multi-niveaux pour utilisateurs et créateurs.',
        abonnementsUtilisateur: {
          'Premium (9,99€/mois)': {
            avantages: ['Sans publicité', 'Qualité HD', 'Lecture hors ligne', 'Badge Premium', 'Support prioritaire']
          },
          'Platine (19,99€/mois)': {
            avantages: ['Tout Premium +', 'Qualité 4K', 'Téléchargements illimités', 'Accès anticipé', 'Badge Platine animé']
          },
          'Gold (29,99€/mois)': {
            avantages: ['Tout Platine +', 'Contenu exclusif', 'Événements VIP', 'Réductions store 20%', 'Badge Gold']
          }
        },
        abonnementsAnnuels: {
          'Premium Annual': '99,99€/an (2 mois gratuits)',
          'Platine Annual': '199,99€/an (2 mois gratuits)',
          'Gold Annual': '299,99€/an (2 mois gratuits)'
        },
        essaiGratuit: {
          duree: '14 jours',
          niveau: 'Premium Plus',
          annulation: 'Sans engagement',
          limite: 'Une fois par compte'
        },
        comparaison: {
          gratuit: 'Publicités, SD, en ligne uniquement',
          basic: 'Sans pub, HD, offline limité',
          plus: '4K, offline illimité, anticipé',
          ultimate: 'Tout + exclusivités + VIP'
        }
      }
    },
    {
      id: 'community-system',
      category: 'community',
      title: '11. Système de Communautés',
      icon: MessageSquare,
      color: 'text-blue-400',
      content: {
        description: 'Plateforme sociale intégrée permettant aux créateurs de créer et gérer leurs communautés.',
        creation: {
          acces: 'Créateurs vérifiés uniquement',
          etapes: ['Nom de communauté', 'Description', 'Règles', 'Catégorie', 'Visibilité', 'Modération'],
          types: ['Publique', 'Privée', 'Premium (payante)']
        },
        fonctionnalites: {
          posts: ['Texte', 'Images', 'Vidéos', 'Sondages', 'Événements', 'Annonces'],
          interactions: ['Likes', 'Commentaires', 'Partages', 'Réactions emoji', 'Mentions'],
          organisation: ['Channels thématiques', 'Tags', 'Épinglage', 'Archives']
        },
        moderation: {
          outils: ['Auto-modération IA', 'Modérateurs bénévoles', 'Filtres contenu', 'Bannissement', 'Signalements'],
          niveaux: ['Modo', 'Super-modo', 'Admin']
        },
        premiumCommunity: {
          prix: 'Défini par créateur (2-50€/mois)',
          avantages: ['Accès exclusif', 'Badge spécial', 'Couleur nom', 'Channels privés', 'Événements réservés'],
          partageRevenus: '85% créateur / 15% plateforme'
        },
        gamification: {
          niveaux: 'XP basé sur activité',
          badges: ['Membre fondateur', 'Top contributeur', 'Expert', 'Vétéran'],
          leaderboard: 'Classement mensuel'
        },
        analytics: {
          stats: ['Membres actifs', 'Posts/jour', 'Engagement', 'Croissance', 'Rétention'],
          insights: 'Suggestions IA pour améliorer engagement'
        }
      }
    },
    {
      id: 'account-security',
      category: 'account',
      title: '12. Sécurité & Gestion de Compte',
      icon: Shield,
      color: 'text-red-400',
      content: {
        description: 'Système complet de sécurité et gestion de compte utilisateur.',
        authentification: {
          '2FA': {
            methodes: ['Authenticator App', 'SMS', 'Email'],
            recommandation: 'Obligatoire pour créateurs',
            backup: 'Codes de secours générés'
          },
          connexion: {
            historique: 'Dernières 30 connexions',
            alertes: 'Nouvelle connexion inhabituelle',
            revocation: 'Déconnexion à distance possible'
          }
        },
        motDePasse: {
          requis: ['8+ caractères', '1 majuscule', '1 minuscule', '1 chiffre', '1 spécial'],
          force: 'Indicateur temps réel',
          changement: 'Recommandé tous les 90 jours',
          recuperation: 'Email + questions sécurité'
        },
        confidentialite: {
          profil: ['Public', 'Amis', 'Privé'],
          activite: ['Historique visible/caché', 'Statut en ligne', 'Dernière connexion'],
          donnees: ['Export RGPD', 'Suppression', 'Portabilité']
        },
        notifications: {
          types: ['Email', 'Push', 'In-app', 'SMS'],
          categories: ['Activité', 'Social', 'Marketing', 'Système'],
          frequence: 'Instantané / Résumé quotidien / hebdomadaire'
        },
        suppression: {
          delai: '30 jours de grâce',
          donnees: 'Suppression définitive après délai',
          contenu: 'Option conservation contenu public',
          reversibilite: 'Possible pendant délai grâce'
        },
        verificationIdentite: {
          kyc: {
            niveau1: 'Email vérifié',
            niveau2: 'Téléphone vérifié',
            niveau3: 'Pièce identité (créateurs)',
            niveau4: 'Profil légal entreprise'
          },
          avantages: ['Limites retrait augmentées', 'Badge vérifié', 'Éligibilité monétisation', 'Confiance utilisateurs']
        }
      }
    }
  ];

  const articles = [
    {
      category: 'getting-started',
      title: 'Créer un compte Goroti',
      description: 'Guide complet pour démarrer sur la plateforme',
      icon: Users,
      color: 'text-cyan-400',
      content: {
        introduction: 'Créer un compte Goroti est simple et rapide. Voici le processus complet en 5 étapes.',
        etapes: [
          {
            numero: 1,
            titre: 'Accéder à la page d\'inscription',
            actions: [
              'Cliquez sur "Connexion" dans le header',
              'Ou accédez directement à /#auth',
              'Le formulaire s\'affiche avec 2 onglets: Connexion et Inscription'
            ]
          },
          {
            numero: 2,
            titre: 'Remplir le formulaire',
            champs: [
              {
                nom: 'Email',
                requis: true,
                format: 'adresse@email.com',
                validation: 'Vérification en temps réel',
                erreurs: ['Format invalide', 'Email déjà utilisé']
              },
              {
                nom: 'Nom d\'utilisateur',
                requis: true,
                format: '3-20 caractères (lettres, chiffres, _)',
                validation: 'Unicité vérifiée instantanément',
                erreurs: ['Trop court/long', 'Déjà pris', 'Caractères invalides']
              },
              {
                nom: 'Mot de passe',
                requis: true,
                format: 'Minimum 8 caractères',
                recommandations: ['Majuscule + minuscule', 'Chiffres', 'Caractères spéciaux'],
                force: 'Indicateur visuel (faible/moyen/fort)'
              },
              {
                nom: 'Confirmation mot de passe',
                requis: true,
                validation: 'Doit correspondre exactement'
              }
            ]
          },
          {
            numero: 3,
            titre: 'Accepter les conditions',
            elements: [
              'Case à cocher obligatoire',
              'Lien vers CGU (Conditions Générales d\'Utilisation)',
              'Lien vers Politique de Confidentialité',
              'Vous devez avoir 13 ans minimum'
            ]
          },
          {
            numero: 4,
            titre: 'Validation du compte',
            processus: [
              'Cliquez sur "S\'inscrire"',
              'Compte créé instantanément',
              'Pas de vérification email requise',
              'Connexion automatique'
            ]
          },
          {
            numero: 5,
            titre: 'Création automatique de votre chaîne',
            automatique: [
              'Une chaîne est créée avec votre nom d\'utilisateur',
              'URL unique: goroti.com/@votre-nom',
              'Avatar par défaut (lettres initiales)',
              'Vous pouvez la personnaliser immédiatement'
            ]
          }
        ],
        apresInscription: {
          titre: 'Que faire après l\'inscription ?',
          actions: [
            {
              priorite: 'Haute',
              action: 'Compléter votre profil',
              details: 'Photo, bannière, bio (100 caractères minimum pour badge vérifié)'
            },
            {
              priorite: 'Haute',
              action: 'Vérifier votre identité (KYC)',
              details: 'Requis pour monétisation et retraits'
            },
            {
              priorite: 'Moyenne',
              action: 'Explorer les Univers',
              details: '12 catégories thématiques de contenu'
            },
            {
              priorite: 'Moyenne',
              action: 'Suivre des créateurs',
              details: 'Construire votre feed personnalisé'
            },
            {
              priorite: 'Basse',
              action: 'Activer 2FA',
              details: 'Sécurité supplémentaire recommandée'
            }
          ]
        },
        troubleshooting: {
          titre: 'Problèmes courants',
          problemes: [
            {
              probleme: 'Email déjà utilisé',
              solution: 'Utilisez un autre email ou récupérez votre compte'
            },
            {
              probleme: 'Nom d\'utilisateur pris',
              solution: 'Essayez avec chiffres ou underscore (_)'
            },
            {
              probleme: 'Mot de passe refusé',
              solution: 'Assurez 8+ caractères avec majuscule et chiffre'
            }
          ]
        },
        tempsEstime: '2-3 minutes',
        gratuit: true
      }
    },
    {
      category: 'getting-started',
      title: 'Créer votre première chaîne',
      description: 'Configuration et personnalisation complète de votre chaîne',
      icon: PlayCircle,
      color: 'text-cyan-400',
      content: {
        prerequis: 'Compte Goroti créé et connecté',
        acces: 'Header → Studio → Mes Chaînes → Créer une chaîne',
        etapes: [
          {
            numero: 1,
            titre: 'Informations de base',
            champs: [
              {
                nom: 'Nom de la chaîne',
                limite: '50 caractères',
                conseil: 'Clair, mémorable, représentatif',
                exemples: ['Martin Musique', 'Tech avec Sarah', 'Cuisine Moderne']
              },
              {
                nom: 'Identifiant (@handle)',
                format: '3-30 caractères (a-z, 0-9, _)',
                unique: true,
                url: 'goroti.com/@identifiant',
                conseil: 'Court et facile à retenir'
              },
              {
                nom: 'Description',
                limite: '1000 caractères',
                conseil: 'Expliquez votre contenu et votre proposition de valeur',
                inclure: ['Thèmes abordés', 'Fréquence publication', 'Pour qui']
              },
              {
                nom: 'Type de chaîne',
                options: [
                  'Créateur individuel (personne seule)',
                  'Artiste musical (musique prioritaire)',
                  'Label musical (gestion artistes)',
                  'Studio (production pro)',
                  'Marque (entreprise/organisation)'
                ]
              }
            ]
          },
          {
            numero: 2,
            titre: 'Identité visuelle',
            elements: [
              {
                nom: 'Photo de profil',
                format: 'JPG/PNG',
                taille: 'Min 400×400px',
                ratio: 'Carré 1:1',
                poids: 'Max 2 MB',
                conseil: 'Logo ou visage reconnaissable'
              },
              {
                nom: 'Bannière',
                format: 'JPG/PNG',
                taille: 'Min 1920×1080px',
                ratio: '16:9 recommandé',
                poids: 'Max 5 MB',
                conseil: 'Visuel de marque cohérent'
              },
              {
                nom: 'Couleur de marque',
                format: 'Hex (#000000)',
                utilisation: 'Badges, bordures, accents',
                conseil: 'Cohérent avec votre identité'
              }
            ]
          },
          {
            numero: 3,
            titre: 'Catégorisation',
            options: [
              'Sélectionnez votre Univers principal (1 requis)',
              'Ajoutez jusqu\'à 2 univers secondaires',
              'Tags personnalisés (10 max)',
              'Cela aide les utilisateurs à vous découvrir'
            ],
            univers: ['Musique', 'Gaming', 'Tech', 'Éducation', 'Sport', 'Beauté', 'Cuisine', 'Voyage', 'Business', 'Art', 'Science', 'Autre']
          },
          {
            numero: 4,
            titre: 'Configuration des sections',
            sections: [
              {
                nom: 'Accueil',
                obligatoire: true,
                description: 'Vidéo à la une + playlists sélectionnées'
              },
              {
                nom: 'Vidéos',
                obligatoire: true,
                description: 'Toutes vos vidéos publiques'
              },
              {
                nom: 'Shorts',
                optionnel: true,
                description: 'Vidéos courtes (<60s)'
              },
              {
                nom: 'Albums',
                optionnel: true,
                description: 'Collections payantes de contenu'
              },
              {
                nom: 'Lives',
                optionnel: true,
                description: 'Diffusions en direct et replays'
              },
              {
                nom: 'Store',
                optionnel: true,
                description: 'Merchandising et produits dérivés'
              },
              {
                nom: 'Playlists',
                optionnel: true,
                description: 'Collections thématiques'
              },
              {
                nom: 'Communauté',
                optionnel: true,
                description: 'Posts texte, sondages, annonces'
              }
            ],
            conseil: 'Activez seulement ce que vous utiliserez'
          },
          {
            numero: 5,
            titre: 'Liens et réseaux sociaux',
            maximum: 5,
            exemples: [
              'Site web personnel',
              'Instagram',
              'Twitter/X',
              'TikTok',
              'Email professionnel'
            ]
          },
          {
            numero: 6,
            titre: 'Paramètres de confidentialité',
            options: [
              {
                nom: 'Visibilité chaîne',
                choix: ['Public', 'Non répertorié', 'Privé'],
                conseil: 'Public pour être découvrable'
              },
              {
                nom: 'Qui peut commenter',
                choix: ['Tout le monde', 'Abonnés uniquement', 'Personne'],
                defaut: 'Tout le monde'
              },
              {
                nom: 'Statistiques publiques',
                afficher: ['Nombre abonnés', 'Vues totales'],
                conseil: 'Transparence = confiance'
              }
            ]
          }
        ],
        validation: {
          titre: 'Validation et publication',
          processus: [
            'Revérifiez toutes les informations',
            'Cliquez sur "Créer la chaîne"',
            'Chaîne créée instantanément',
            'URL active: goroti.com/@votre-handle',
            'Apparaît dans la recherche sous 24h'
          ]
        },
        apresCreation: {
          titre: 'Prochaines étapes',
          actions: [
            'Publier votre première vidéo',
            'Créer 3-5 playlists thématiques',
            'Rédiger un post de bienvenue',
            'Promouvoir sur vos réseaux sociaux',
            'Configurer la monétisation (si KYC fait)'
          ]
        },
        limites: {
          chainesParCompte: 5,
          tempsCreation: '5-10 minutes',
          modificationPosterieure: 'Possible à tout moment'
        },
        bonnesPratiques: [
          'Nom de chaîne descriptif et unique',
          'Bio complète avec mots-clés pertinents',
          'Visuels professionnels haute qualité',
          'Cohérence identité visuelle',
          'Sections activées selon contenu réel',
          'Liens externes vérifiés fonctionnels'
        ]
      }
    },
    {
      category: 'getting-started',
      title: 'Vérification d\'identité (KYC)',
      description: 'Processus complet de vérification pour débloquer la monétisation',
      icon: CheckCircle,
      color: 'text-cyan-400',
      content: {
        definition: 'KYC (Know Your Customer) est le processus de vérification d\'identité requis pour monétiser et retirer des revenus.',
        pourquoi: [
          'Conformité réglementaire financière',
          'Lutte contre fraude et blanchiment',
          'Protection des créateurs et utilisateurs',
          'Obligation légale pour paiements'
        ],
        prerequis: [
          'Compte Goroti actif',
          'Âge minimum 18 ans',
          'Document d\'identité valide',
          'Justificatif de domicile récent (<3 mois)',
          'Smartphone avec caméra (selfie)'
        ],
        niveaux: [
          {
            niveau: 1,
            nom: 'Basique',
            verification: 'Email vérifié',
            avantages: ['Utiliser la plateforme', 'Commenter', 'S\'abonner'],
            limites: ['Pas de monétisation', 'Pas d\'achats >50€']
          },
          {
            niveau: 2,
            nom: 'Intermédiaire',
            verification: 'ID + Selfie',
            documentsAcceptes: [
              'Carte d\'identité nationale',
              'Passeport',
              'Permis de conduire'
            ],
            avantages: [
              'Achats jusqu\'à 500€/mois',
              'Tips créateurs',
              'Retraits jusqu\'à 500€/mois'
            ],
            delaiValidation: '1-3 jours ouvrés'
          },
          {
            niveau: 3,
            nom: 'Avancé',
            verification: 'ID + Selfie + Justificatif domicile',
            documentsAcceptes: [
              'Facture électricité/gaz/eau',
              'Attestation assurance habitation',
              'Avis d\'imposition',
              'Relevé bancaire'
            ],
            avantages: [
              'Monétisation complète',
              'Retraits illimités',
              'Badge vérifié',
              'Marketplace créateurs'
            ],
            delaiValidation: '2-5 jours ouvrés'
          },
          {
            niveau: 4,
            nom: 'Professionnel/Entreprise',
            verification: 'Documents légaux entreprise',
            documentsRequis: [
              'Extrait Kbis (<3 mois)',
              'Statuts société',
              'ID représentant légal',
              'RIB professionnel'
            ],
            avantages: [
              'Factures automatiques',
              'TVA intracommunautaire',
              'Multi-utilisateurs',
              'API accès'
            ],
            delaiValidation: '5-10 jours ouvrés'
          }
        ],
        processusDetaille: {
          etape1: {
            titre: 'Démarrer la vérification',
            acces: 'Profil → Paramètres → Vérification d\'identité',
            ou: 'Lors de la première tentative de retrait',
            choix: 'Sélectionnez le niveau de vérification souhaité'
          },
          etape2: {
            titre: 'Informations personnelles',
            champs: [
              'Nom complet (tel qu\'inscrit sur ID)',
              'Date de naissance',
              'Nationalité',
              'Adresse complète',
              'Pays de résidence fiscale'
            ],
            important: 'Les informations doivent correspondre exactement aux documents'
          },
          etape3: {
            titre: 'Upload document d\'identité',
            instructions: [
              'Photo claire et nette',
              'Document entier visible',
              'Tous les coins visibles',
              'Pas de reflets',
              'Texte lisible',
              'Document non expiré'
            ],
            formats: 'JPG, PNG, PDF',
            tailleMax: '10 MB par fichier',
            faces: 'Recto ET verso requis'
          },
          etape4: {
            titre: 'Selfie de vérification',
            methode: 'Via webcam ou smartphone',
            instructions: [
              'Visage centré et bien éclairé',
              'Retirez lunettes/chapeau',
              'Arrière-plan neutre',
              'Regardez la caméra',
              'Pas de filtre'
            ],
            technologie: 'Reconnaissance faciale comparée à l\'ID',
            securite: 'Détection de liveness (anti-photo)'
          },
          etape5: {
            titre: 'Justificatif de domicile (Niveau 3+)',
            conditions: [
              'Date récente (<3 mois)',
              'Nom et adresse visibles',
              'Logo organisme officiel',
              'Document original (pas de capture)'
            ]
          },
          etape6: {
            titre: 'Validation manuelle',
            processus: [
              'Documents envoyés à l\'équipe',
              'Vérification par agents certifiés',
              'Email notification de statut',
              'Statut consultable dans Paramètres'
            ],
            delais: {
              niveau2: '1-3 jours ouvrés',
              niveau3: '2-5 jours ouvrés',
              niveau4: '5-10 jours ouvrés'
            },
            heuresOuvrées: 'Lun-Ven 9h-18h (hors jours fériés)'
          }
        },
        refusCommuns: {
          titre: 'Raisons de refus fréquentes',
          causes: [
            {
              raison: 'Photo floue ou illisible',
              solution: 'Reprendre photo en bonne luminosité'
            },
            {
              raison: 'Document expiré',
              solution: 'Utiliser ID valide et à jour'
            },
            {
              raison: 'Informations ne correspondent pas',
              solution: 'Vérifier orthographe et correspondance exacte'
            },
            {
              raison: 'Selfie ne correspond pas à l\'ID',
              solution: 'Éclairage optimal, visage découvert'
            },
            {
              raison: 'Document tronqué',
              solution: 'Capturer le document entier'
            },
            {
              raison: 'Justificatif trop ancien',
              solution: 'Document <3 mois obligatoire'
            }
          ],
          quefaire: 'Email reçu avec raison précise + possibilité resoumission'
        },
        securitePrivacy: {
          titre: 'Sécurité et confidentialité',
          garanties: [
            'Données chiffrées SSL/TLS',
            'Stockage sécurisé conforme RGPD',
            'Accès limité équipe KYC',
            'Aucune revente de données',
            'Suppression possible sur demande',
            'Conformité bancaire européenne'
          ],
          partenaire: 'Vérification via partenaire certifié (Stripe Identity)',
          normes: ['ISO 27001', 'PCI DSS', 'SOC 2']
        },
        apresValidation: {
          titre: 'Après validation réussie',
          immediate: [
            'Badge vérifié sur profil',
            'Accès monétisation débloqué',
            'Limites de retrait augmentées',
            'Marketplace accessible (niveau 3+)'
          ],
          actions: [
            'Configurer méthode de paiement',
            'Activer canaux monétisation souhaités',
            'Publier contenu premium si désiré',
            'Effectuer premier retrait'
          ]
        },
        faq: [
          {
            q: 'Combien de temps la vérification est-elle valide ?',
            r: 'Illimitée, sauf changement données (adresse, nom)'
          },
          {
            q: 'Puis-je utiliser un pseudonyme ?',
            r: 'Non, nom légal requis pour KYC. Pseudonyme public reste possible.'
          },
          {
            q: 'Que faire si je n\'ai pas de justificatif à mon nom ?',
            r: 'Attestation d\'hébergement possible avec ID de l\'hébergeur'
          },
          {
            q: 'La vérification est-elle payante ?',
            r: 'Non, totalement gratuite'
          },
          {
            q: 'Puis-je retirer avant validation ?',
            r: 'Non, KYC niveau 2+ obligatoire'
          }
        ],
        coutTotal: 'Gratuit',
        obligatoire: 'Pour monétisation uniquement'
      }
    },
    {
      category: 'creators',
      title: 'Publier votre première vidéo',
      description: 'Guide complet d\'upload, optimisation SEO et publication',
      icon: Video,
      color: 'text-blue-400',
      content: {
        introduction: 'Publier votre première vidéo sur Goroti est simple. Suivez ce guide pour optimiser votre contenu et maximiser sa portée.',
        prerequis: [
          'Compte Goroti avec chaîne créée',
          'Vidéo au format MP4, MOV ou WebM',
          'Taille maximale: 10 GB',
          'Durée: 10 secondes à 12 heures',
          'Résolution recommandée: 1080p minimum'
        ],
        etapes: [
          {
            numero: 1,
            titre: 'Accéder à l\'upload',
            methodes: [
              'Cliquer sur l\'icône Upload dans le header',
              'Aller dans Studio → Upload',
              'URL directe: /#upload',
              'Raccourci clavier: Alt+U'
            ]
          },
          {
            numero: 2,
            titre: 'Sélectionner la vidéo',
            actions: [
              'Glisser-déposer le fichier dans la zone',
              'Ou cliquer pour parcourir vos fichiers',
              'L\'upload commence automatiquement',
              'Barre de progression visible'
            ],
            formatsAcceptes: ['MP4 (recommandé)', 'MOV', 'AVI', 'WebM', 'MKV', 'FLV'],
            tailleMax: '10 GB',
            dureeMax: '12 heures'
          },
          {
            numero: 3,
            titre: 'Informations de base',
            champObligatoires: [
              {
                nom: 'Titre',
                limite: '100 caractères',
                conseils: [
                  'Descriptif et accrocheur',
                  'Inclure mots-clés principaux',
                  'Éviter clickbait trompeur',
                  'Capitalisation naturelle'
                ],
                exemples: [
                  'Comment créer une chaîne Goroti en 5 minutes',
                  'Top 10 des astuces de montage vidéo',
                  'Tutoriel complet: Monétisation sur Goroti'
                ]
              },
              {
                nom: 'Description',
                limite: '5000 caractères',
                structure: [
                  'Paragraphe d\'accroche (2-3 lignes)',
                  'Contenu détaillé avec timestamps',
                  'Liens utiles et ressources',
                  'Appel à l\'action (s\'abonner, liker)',
                  'Hashtags pertinents (max 10)'
                ],
                seo: [
                  'Inclure mots-clés naturellement',
                  'Première ligne cruciale (visible avant "voir plus")',
                  'Utiliser timestamps cliquables (00:00)',
                  'Ajouter liens vers autres contenus'
                ]
              },
              {
                nom: 'Miniature',
                format: 'JPG ou PNG',
                dimensionsRecommandees: '1280×720 px (ratio 16:9)',
                taille: 'Max 2 MB',
                conseils: [
                  'Image claire et attrayante',
                  'Texte lisible même en petit',
                  'Contraste élevé',
                  'Éviter zones de coupure mobile',
                  'Représenter réellement le contenu'
                ],
                bonnesPratiques: [
                  'Visage expressif si applicable',
                  'Texte gros et court (3-5 mots max)',
                  'Couleurs vives et contrastées',
                  'Logo/marque cohérent'
                ]
              }
            ]
          },
          {
            numero: 4,
            titre: 'Catégorisation et tags',
            categories: {
              universPrincipal: {
                obligatoire: true,
                choix: ['Musique', 'Gaming', 'Tech', 'Éducation', 'Sport', 'Beauté', 'Cuisine', 'Voyage', 'Business', 'Art', 'Science', 'Divertissement']
              },
              tags: {
                nombre: '5-15 tags recommandés',
                limite: '30 tags maximum',
                types: [
                  'Mots-clés principaux (ex: "tutoriel", "débutant")',
                  'Thèmes spécifiques (ex: "montage vidéo", "Adobe Premiere")',
                  'Audience cible (ex: "créateurs", "entrepreneurs")',
                  'Format (ex: "guide complet", "top 10")'
                ],
                conseils: [
                  'Éviter spam de tags non pertinents',
                  'Utiliser tags populaires ET spécifiques',
                  'Vérifier suggestions automatiques',
                  'Analyser tags de vidéos similaires performantes'
                ]
              }
            }
          },
          {
            numero: 5,
            titre: 'Paramètres avancés',
            options: [
              {
                nom: 'Langue',
                description: 'Langue principale de la vidéo',
                importance: 'Aide algorithme et découvrabilité',
                detectionAutomatique: 'Suggérée basée sur audio/description'
              },
              {
                nom: 'Sous-titres',
                formats: ['SRT', 'VTT', 'ASS'],
                types: [
                  'Manuels (uploadés)',
                  'Auto-générés (IA)',
                  'Crowdsourced (communauté)'
                ],
                avantages: [
                  'Accessibilité (sourds/malentendants)',
                  'SEO amélioré',
                  'Compréhension internationale',
                  'Watchtime augmenté'
                ]
              },
              {
                nom: 'Chapitres',
                format: 'Timestamps dans description',
                exemple: [
                  '00:00 Introduction',
                  '01:30 Étape 1: Configuration',
                  '05:45 Étape 2: Optimisation',
                  '10:20 Conclusion'
                ],
                minimum: '3 chapitres de 10 secondes minimum',
                avantages: [
                  'Navigation facilitée',
                  'Rétention améliorée',
                  'Segments partageables',
                  'Expérience utilisateur'
                ]
              },
              {
                nom: 'Restriction d\'âge',
                options: ['Tout public', '13+', '16+', '18+'],
                impacts: [
                  'Algorithme de recommandation',
                  'Monétisation disponible',
                  'Visibilité réduite pour 18+'
                ]
              },
              {
                nom: 'Zones géographiques',
                options: [
                  'Disponible partout (défaut)',
                  'Restreindre certains pays',
                  'Autoriser certains pays uniquement'
                ],
                usages: ['Droits de diffusion', 'Contenu régionalisé', 'Respect réglementations locales']
              }
            ]
          },
          {
            numero: 6,
            titre: 'Type de contenu et monétisation',
            choixPrincipal: {
              gratuit: {
                description: 'Visible par tous immédiatement',
                monetisation: ['Publicités (si éligible)', 'Tips volontaires', 'Affiliation']
              },
              premiumPayant: {
                description: 'Achat requis pour visionner',
                prixSuggeres: '0,99€ à 19,99€',
                commission: '15% plateforme',
                acheteurs: 'Accès permanent',
                avantages: ['Revenus directs garantis', 'Valorise expertise', 'Audience engagée']
              },
              membreUniquement: {
                description: 'Réservé aux abonnés chaîne payants',
                condition: 'Programme membres activé',
                avantages: ['Fidélisation', 'Revenus récurrents', 'Communauté exclusive']
              },
              nonRepertorie: {
                description: 'Visible uniquement via lien direct',
                usages: ['Clients privés', 'Preview avant publication', 'Contenu sensible']
              }
            }
          },
          {
            numero: 7,
            titre: 'Planification de publication',
            options: [
              {
                type: 'Publication immédiate',
                description: 'Disponible dès traitement terminé',
                delai: '2-30 minutes selon qualité/durée'
              },
              {
                type: 'Publication planifiée',
                description: 'Choisir date et heure précises',
                avantages: [
                  'Publication aux heures optimales',
                  'Coordination avec campagne marketing',
                  'Préparer à l\'avance',
                  'Régularité pour algorithme'
                ],
                recommandations: [
                  'Analyser quand votre audience est active',
                  'Éviter concurrence avec gros créateurs',
                  'Planifier série pour cohérence'
                ]
              }
            ]
          },
          {
            numero: 8,
            titre: 'Révision et publication',
            checklistFinale: [
              'Titre accrocheur et descriptif',
              'Description complète avec timestamps',
              'Miniature professionnelle',
              'Tags pertinents ajoutés',
              'Catégorie correcte sélectionnée',
              'Paramètres de visibilité vérifiés',
              'Type de monétisation confirmé',
              'Sous-titres ajoutés si applicable'
            ],
            publication: [
              'Cliquer sur "Publier"',
              'Traitement automatique (qualités HD/SD)',
              'Notification abonnés activée',
              'URL unique générée',
              'Visible dans votre chaîne'
            ]
          }
        ],
        apresPublication: {
          titre: 'Optimisation post-publication',
          actionsImportantes: [
            {
              action: 'Promouvoir la vidéo',
              canaux: [
                'Partager sur réseaux sociaux',
                'Post dans votre communauté Goroti',
                'Email à newsletter si applicable',
                'Embed sur site web/blog',
                'Partage groupes thématiques'
              ]
            },
            {
              action: 'Engager avec audience',
              details: [
                'Répondre premiers commentaires rapidement',
                'Épingler commentaire contexte/liens',
                'Liker commentaires constructifs',
                'Créer conversation'
              ]
            },
            {
              action: 'Analyser performances',
              metriques: [
                'Vues premières 24h/48h',
                'Taux de clics miniature (CTR)',
                'Durée de visionnage moyenne',
                'Taux de rétention',
                'Sources de trafic',
                'Données démographiques'
              ],
              acces: 'Studio → Analytics → Sélectionner vidéo'
            },
            {
              action: 'Ajustements si nécessaire',
              modifications: [
                'Changer miniature si CTR faible',
                'Améliorer description SEO',
                'Ajouter tags supplémentaires',
                'Créer Short promotionnel',
                'Ajouter dans playlists pertinentes'
              ]
            }
          ]
        },
        bonnesPratiquesGenerales: [
          'Qualité vidéo/audio professionnelle',
          'Intro courte (<10 secondes)',
          'Rythme dynamique pour rétention',
          'Appel à l\'action clair',
          'Cohérence marque/style',
          'Régularité publication',
          'Interaction avec commentaires',
          'Analyse continue performances'
        ],
        erreursAEviter: [
          'Clickbait trompeur (pénalisé)',
          'Violation copyright musique/images',
          'Contenu réutilisé sans ajout valeur',
          'Tags spam non pertinents',
          'Description vide ou trop courte',
          'Miniature de mauvaise qualité',
          'Ignorer commentaires/communauté',
          'Ne pas analyser métriques'
        ],
        tempsEstime: '15-30 minutes pour upload complet',
        ressourcesUtiles: [
          'Guide miniatures efficaces (Ressources)',
          'Optimisation SEO vidéo (Ressources)',
          'Analyse analytics (Studio)',
          'Musique libre de droits (Marketplace)'
        ]
      }
    },
    {
      category: 'creators',
      title: 'Vendre un album ou contenu premium',
      description: 'Configuration de prix et droits d\'accès',
      icon: Music,
      color: 'text-blue-400',
      content: {
        introduction: 'Les albums et contenus premium permettent de monétiser directement votre travail. Créez des collections de vidéos, cours, ou musique et vendez-les à un prix fixe.',
        prerequis: ['KYC niveau 3 validé', 'Chaîne créateur active', 'Contenu original prêt'],
        typesContenuPremium: [
          {
            type: 'Album vidéo',
            description: 'Collection de vidéos thématiques ou série',
            exemples: ['Cours complet (10 vidéos)', 'Documentaire en chapitres', 'Série exclusive'],
            prixSuggeres: '9,99€ - 49,99€'
          },
          {
            type: 'Album musical',
            description: 'EP, album, ou compilation musicale',
            formats: ['Audio seul', 'Audio + clips vidéo', 'Édition deluxe avec bonus'],
            prixSuggeres: '4,99€ - 19,99€'
          },
          {
            type: 'Contenu unique premium',
            description: 'Vidéo ou concert exclusif payant',
            exemples: ['Concert live complet', 'Masterclass', 'Film documentaire'],
            prixSuggeres: '2,99€ - 29,99€'
          },
          {
            type: 'Formation/Cours',
            description: 'Contenu éducatif structuré',
            inclus: ['Vidéos de cours', 'Ressources téléchargeables', 'Certificat optionnel'],
            prixSuggeres: '19,99€ - 199,99€'
          }
        ],
        etapesCreation: [
          {
            numero: 1,
            titre: 'Créer l\'album',
            acces: 'Studio → Monétisation → Créer Album Premium',
            champsObligatoires: [
              'Titre de l\'album (100 caractères max)',
              'Description détaillée (1000 caractères)',
              'Pochette/Cover (1400×1400px, format carré)',
              'Prix de vente (0,99€ à 499,99€)',
              'Catégorie principale'
            ]
          },
          {
            numero: 2,
            titre: 'Ajouter le contenu',
            options: [
              'Uploader nouvelles vidéos directement',
              'Sélectionner vidéos existantes',
              'Ordonner contenu (drag & drop)',
              'Définir aperçu gratuit (preview)'
            ],
            recommandation: 'Minimum 3 vidéos pour un album cohérent'
          },
          {
            numero: 3,
            titre: 'Configurer les droits d\'accès',
            typesAcces: {
              achatUnique: {
                description: 'Paiement unique, accès permanent',
                avantages: ['Simplicité', 'Revenus immédiats', 'Pas d\'engagement récurrent']
              },
              location: {
                description: 'Accès temporaire (24h, 48h, 7 jours)',
                prixSuggeres: '30-50% du prix d\'achat',
                usages: ['Films', 'Concerts', 'Événements']
              },
              abonnementInclus: {
                description: 'Inclus dans abonnement membres',
                combinaison: 'Peut être vendu séparément aussi',
                avantages: ['Valeur ajoutée membres', 'Incitation abonnement']
              }
            }
          },
          {
            numero: 4,
            titre: 'Tarification stratégique',
            facteurs: [
              'Durée totale du contenu',
              'Qualité de production',
              'Expertise/rareté',
              'Prix marché concurrent',
              'Audience cible (pouvoir d\'achat)'
            ],
            strategies: {
              prixLancement: 'Réduction 20-30% premières semaines',
              precommande: 'Prix préférentiel avant sortie',
              bundling: 'Plusieurs albums groupés avec réduction',
              dynamic: 'Ajuster prix selon performances'
            }
          },
          {
            numero: 5,
            titre: 'Options avancées',
            fonctionnalites: [
              {
                nom: 'Aperçu gratuit',
                description: 'Extrait ou vidéo complète visible gratuitement',
                conseil: '10-20% du contenu total',
                impact: 'Augmente conversions de 40%'
              },
              {
                nom: 'Bonus exclusifs',
                exemples: ['Behind the scenes', 'Interviews', 'Fichiers sources', 'Ressources PDF'],
                impact: 'Justifie prix plus élevé'
              },
              {
                nom: 'Éditions limitées',
                description: 'Numérotation limitée avec certificat',
                prixPremium: '+30-50% du prix standard',
                rareté: 'Crée urgence et désirabilité'
              },
              {
                nom: 'Pré-commande',
                duree: '1-4 semaines avant sortie',
                avantages: ['Revenus anticipés', 'Buzz pré-lancement', 'Feedback early adopters'],
                reductionTypique: '15-25%'
              }
            ]
          }
        ],
        gestionVentes: {
          commissionsGoroti: '15% du prix de vente',
          reversementCreateur: '85% du prix de vente',
          fraisPaiement: 'Inclus dans commission plateforme',
          delaiPaiement: 'Instantané au wallet créateur',
          facturation: 'Automatique pour chaque achat',
          tva: 'Applicable selon pays acheteur'
        },
        promotion: {
          methodesEfficaces: [
            {
              methode: 'Trailer gratuit',
              description: 'Vidéo promotionnelle 1-2 minutes',
              diffusion: 'Chaîne principale + réseaux sociaux',
              conversionTypique: '5-15%'
            },
            {
              methode: 'Posts communauté',
              timing: ['Annonce initiale', 'Teaser contenu', 'Compte à rebours sortie', 'Post lancement'],
              engagement: 'Répondre questions, créer hype'
            },
            {
              methode: 'Partenariats créateurs',
              principe: 'Cross-promotion avec créateurs similaires',
              format: 'Mentions mutuelles, interviews croisées'
            },
            {
              methode: 'Campagne email',
              cibles: ['Abonnés chaîne', 'Membres existants', 'Acheteurs précédents'],
              timing: 'J-7, J-3, J-1, Jour J'
            },
            {
              methode: 'Réductions flash',
              duree: '24-48h',
              occasions: ['Anniversaire chaîne', 'Fêtes', 'Milestones'],
              impact: 'Pic ventes immédiat'
            }
          ]
        },
        optimisation: {
          titre: 'Optimiser les ventes',
          tactiques: [
            {
              tactique: 'A/B Testing',
              elements: ['Prix', 'Titre', 'Pochette', 'Description'],
              outils: 'Analytics intégré Goroti Studio',
              frequence: 'Tous les 30 jours'
            },
            {
              tactique: 'Upselling',
              technique: 'Proposer album complet lors d\'achat vidéo seule',
              discount: '20% si achète album complet',
              augmentation: '+35% panier moyen'
            },
            {
              tactique: 'Bundles',
              exemple: 'Pack 3 albums à prix réduit',
              economie: '25-30% vs achat séparé',
              conversion: 'Augmente valeur vie client'
            },
            {
              tactique: 'Social proof',
              elements: ['Nombre d\'achats', 'Avis clients', 'Notes/étoiles', 'Témoignages'],
              affichage: 'Automatique sur page album',
              impact: '+60% confiance acheteurs'
            }
          ]
        },
        bonnesPratiques: [
          'Qualité irréprochable du contenu',
          'Description détaillée avec valeur claire',
          'Pochette professionnelle attrayante',
          'Prix cohérent avec marché',
          'Promotion régulière multi-canal',
          'Engagement avec acheteurs (merci, bonus)',
          'Mise à jour contenu si promis',
          'Respect délais annoncés'
        ],
        erreursFrequentes: [
          'Prix trop élevé sans justification',
          'Description vague ou incomplète',
          'Pas d\'aperçu gratuit',
          'Promotion insuffisante',
          'Contenu de qualité inégale',
          'Promesses non tenues',
          'Ignorer feedback acheteurs'
        ],
        ressourcesUtiles: [
          'Analyse concurrence (recherche albums similaires)',
          'Statistiques ventes (Studio → Revenus)',
          'Feedback acheteurs (commentaires/notes)',
          'Support créateurs (help@goroti.com)'
        ]
      }
    },
    {
      category: 'creators',
      title: 'Configurer les royalties partagés',
      description: 'Splits automatiques pour collaborations',
      icon: TrendingUp,
      color: 'text-blue-400',
      content: {
        introduction: 'Le système de royalties partagées permet de distribuer automatiquement les revenus entre plusieurs contributeurs (artistes, producteurs, compositeurs, etc.).',
        casUsage: [
          'Collaboration musicale (feat.)',
          'Production partagée (producteur + artiste)',
          'Équipe création (réalisateur, monteur, acteurs)',
          'Label avec multiples artistes',
          'Co-création de contenu'
        ],
        prerequis: ['KYC niveau 3 validé pour tous les bénéficiaires', 'Contenu uploadé ou album créé', 'Email des collaborateurs confirmés'],
        fonctionnement: {
          principe: 'Revenus divisés automatiquement selon pourcentages définis',
          distribution: 'Instantanée à chaque vente',
          wallets: 'Chaque bénéficiaire reçoit sa part dans son wallet',
          transparence: 'Chacun voit ses revenus en temps réel'
        },
        configuration: [
          {
            etape: 1,
            titre: 'Accéder aux paramètres de split',
            chemin: 'Studio → Contenu → Sélectionner vidéo/album → Royalties',
            moment: 'Avant ou après publication (modifiable)'
          },
          {
            etape: 2,
            titre: 'Ajouter les bénéficiaires',
            informations: [
              'Email Goroti du bénéficiaire',
              'Nom/pseudo (affiché)',
              'Rôle (artiste, producteur, compositeur, etc.)',
              'Pourcentage de royalties (0.01% à 100%)'
            ],
            validation: 'Invitation envoyée, doit être acceptée',
            limites: 'Maximum 50 bénéficiaires par contenu'
          },
          {
            etape: 3,
            titre: 'Définir les pourcentages',
            regles: [
              'Total doit égaler 100%',
              'Minimum 0.01% par personne',
              'Précision: 2 décimales',
              'Vérification automatique calcul'
            ],
            exemples: [
              {
                scenario: 'Duo 50/50',
                split: 'Artiste A: 50%, Artiste B: 50%'
              },
              {
                scenario: 'Artiste + Producteur',
                split: 'Artiste: 70%, Producteur: 30%'
              },
              {
                scenario: 'Label + Artistes',
                split: 'Label: 40%, Artiste 1: 35%, Artiste 2: 25%'
              },
              {
                scenario: 'Équipe production',
                split: 'Réalisateur: 40%, Scénariste: 30%, Monteur: 20%, Acteur: 10%'
              }
            ]
          },
          {
            etape: 4,
            titre: 'Validation par tous',
            processus: [
              'Chaque bénéficiaire reçoit email notification',
              'Doit se connecter et accepter les termes',
              'Peut refuser si désaccord',
              'Split actif une fois tous validé'
            ],
            delai: 'Notifications rappel à J+3 et J+7',
            expiration: 'Invitation expire après 30 jours'
          }
        ],
        typesSplit: {
          fixe: {
            description: 'Pourcentages définis ne changent jamais',
            usages: 'Collaborations ponctuelles standard',
            avantage: 'Simplicité, clarté'
          },
          echelonne: {
            description: 'Pourcentages évoluent selon seuils atteints',
            exemple: '0-1000€: 70/30, >1000€: 60/40',
            usages: 'Avances récupérables, investisseurs',
            complexite: 'Configuration avancée requise'
          },
          hybride: {
            description: 'Partie fixe + bonus conditionnels',
            exemple: '50% fixe + 10% bonus si >10k ventes',
            usages: 'Incentiver performances'
          }
        },
        gestionConflits: {
          modification: {
            titre: 'Modifier un split existant',
            condition: 'Accord unanime requis',
            processus: [
              'Propriétaire propose modification',
              'Tous bénéficiaires notifiés',
              'Chacun doit approuver',
              'Actif dès approbation complète'
            ],
            nonRetroactif: 'Ventes passées restent selon ancien split'
          },
          desaccord: {
            titre: 'Résolution désaccords',
            etapes: [
              'Discussion interne (messagerie Goroti)',
              'Médiation support Goroti (sur demande)',
              'Arbitrage selon CGU si nécessaire',
              'Gel temporaire revenus si litige grave'
            ]
          },
          retrait: {
            titre: 'Retirer un bénéficiaire',
            conditions: [
              'Accord du bénéficiaire concerné',
              'Ou violation manifeste contrat',
              'Redistribution pourcentage aux autres'
            ],
            impact: 'Non rétroactif'
          }
        },
        aspectsLegaux: {
          contrat: 'Split Goroti = contrat légal exécutoire',
          fiscalite: 'Chaque bénéficiaire responsable sa déclaration',
          droitsAuteur: 'Split revenus ≠ droits d\'auteur légaux',
          documentation: 'Export détaillé transactions disponible',
          conseil: 'Contrat écrit externe recommandé pour clarté rôles'
        },
        analytics: {
          tableauBord: 'Studio → Royalties → Vue d\'ensemble',
          metriques: [
            'Revenus totaux par contenu',
            'Votre part reçue',
            'Parts versées collaborateurs',
            'Historique paiements',
            'Projections futures'
          ],
          transparence: 'Chaque bénéficiaire voit seulement ses propres revenus'
        },
        bonnesPratiques: [
          'Définir split AVANT publication',
          'Documenter accords par écrit (externe)',
          'Communiquer clairement attentes',
          'Respecter contributions réelles',
          'Prévoir clause révision si succès',
          'Vérifier KYC tous bénéficiaires validé',
          'Tester avec petit montant d\'abord'
        ],
        erreursEviter: [
          'Oublier un contributeur',
          'Pourcentages inéquitables non discutés',
          'Pas de documentation externe',
          'Modifier split unilatéralement',
          'Confondre revenus et droits auteur légaux'
        ],
        faq: [
          {
            q: 'Puis-je avoir plusieurs splits sur différents contenus?',
            r: 'Oui, chaque contenu a son propre split indépendant'
          },
          {
            q: 'Que se passe-t-il si un bénéficiaire n\'accepte pas?',
            r: 'Le split n\'est pas actif. Vous devez le modifier ou retirer la personne'
          },
          {
            q: 'Les collaborateurs peuvent-ils voir mes revenus totaux?',
            r: 'Non, chacun voit uniquement sa propre part'
          },
          {
            q: 'Puis-je retirer des revenus si split non validé?',
            r: 'Oui, vous recevez 100% tant que split non actif'
          }
        ]
      }
    },
    {
      category: 'creators',
      title: 'Stratégie de tarification',
      description: 'Définir les prix optimaux pour votre contenu',
      icon: DollarSign,
      color: 'text-blue-400',
      content: {
        introduction: 'Bien tarifer votre contenu est crucial pour maximiser revenus sans nuire à l\'accessibilité. Voici comment définir des prix optimaux.',
        philosophieTarification: {
          equilibre: 'Trouver le point entre valeur perçue et accessibilité',
          objetif: 'Maximiser (Prix × Volume ventes) et non prix seul',
          psychologie: 'Prix influence perception qualité'
        },
        facteursConsiderer: [
          {
            facteur: 'Type de contenu',
            guidelines: {
              'Vidéo unique': '0,99€ - 4,99€',
              'Album/Série (3-5 vidéos)': '9,99€ - 29,99€',
              'Cours complet': '19,99€ - 199,99€',
              'Concert/Live exclusif': '4,99€ - 19,99€',
              'Masterclass expert': '49,99€ - 299,99€'
            }
          },
          {
            facteur: 'Durée du contenu',
            regle: '~1€ par 10 minutes de contenu de qualité',
            exemples: [
              '30 min → 2,99€',
              '2h → 9,99€ - 14,99€',
              '10h (cours) → 49,99€ - 99,99€'
            ]
          },
          {
            facteur: 'Qualité de production',
            niveaux: {
              'Amateur (smartphone)': '-30% prix marché',
              'Semi-pro (bon équipement)': 'Prix marché standard',
              'Professionnel (studio)': '+30-50% prix marché'
            }
          },
          {
            facteur: 'Notoriété créateur',
            impact: [
              'Nouveau créateur (<1k abonnés): Prix bas/moyen',
              'Établi (1k-10k): Prix moyen',
              'Influent (10k-100k): Prix moyen/élevé',
              'Star (>100k): Prix élevé/premium'
            ]
          },
          {
            facteur: 'Rareté/Exclusivité',
            augmentation: [
              'Contenu commun: Prix standard',
              'Expertise niche: +20-40%',
              'Accès exclusif: +50-100%',
              'Édition limitée: +30-80%'
            ]
          },
          {
            facteur: 'Concurrence',
            analyse: [
              'Rechercher contenu similaire sur Goroti',
              'Noter prix pratiqués',
              'Évaluer qualité comparative',
              'Se positionner légèrement en dessous si nouveau'
            ]
          }
        ],
        strategiesPrix: [
          {
            strategie: 'Pénétration',
            description: 'Prix bas initial pour gagner marché',
            quand: 'Lancement, nouveau créateur, marché concurrentiel',
            exemple: 'Cours valeur 49€ lancé à 19€',
            avantages: ['Adoption rapide', 'Reviews nombreuses', 'Notoriété'],
            risques: ['Revenus limités court terme', 'Difficile augmenter après']
          },
          {
            strategie: 'Écrémage',
            description: 'Prix élevé initial puis baisse graduelle',
            quand: 'Contenu unique, expertise rare, forte demande',
            exemple: 'Masterclass 299€ → 199€ après 3 mois → 149€ après 6 mois',
            avantages: ['Maximise revenus early adopters', 'Crée perception haute qualité'],
            risques: ['Volume initial limité', 'Attente baisse prix']
          },
          {
            strategie: 'Prix psychologique',
            description: 'Utiliser prix terminant par .99 ou .97',
            exemples: ['9,99€ au lieu de 10€', '49,99€ au lieu de 50€'],
            impact: '+15-25% conversions',
            explication: 'Perception prix inférieur catégorie'
          },
          {
            strategie: 'Bundling',
            description: 'Grouper plusieurs contenus à prix réduit',
            exemple: '3 albums à 29€ (au lieu de 12€ chacun)',
            avantages: ['Augmente panier moyen', 'Écou le catalogue ancien', 'Valeur perçue élevée']
          },
          {
            strategie: 'Versioning',
            description: 'Plusieurs versions à prix différents',
            exemple: {
              'Basique (7,99€)': 'Contenu principal seul',
              'Standard (14,99€)': '+ Bonus et ressources',
              'Premium (24,99€)': '+ Accès communauté privée + Q&A'
            },
            impact: '+40% revenus moyens'
          },
          {
            strategie: 'Tarification dynamique',
            description: 'Prix évolue selon demande/temps',
            tactiques: [
              'Prix lancement réduit premières semaines',
              'Augmentation progressive si succès',
              'Promotions flash occasionnelles',
              'Prix saisonnier (soldes, fêtes)'
            ]
          }
        ],
        optimisationConversions: {
          titre: 'Maximiser taux de conversion',
          leviers: [
            {
              levier: 'Ancrage de prix',
              technique: 'Afficher prix barré plus élevé',
              exemple: '14,99€ (au lieu de 24,99€)',
              augmentation: '+30% conversions'
            },
            {
              levier: 'Urgence',
              tactiques: ['Offre limitée 48h', 'Plus que 50 places', 'Prix augmente J+7'],
              psychologie: 'Peur de manquer (FOMO)',
              impact: '+50% conversions court terme'
            },
            {
              levier: 'Garantie satisfait ou remboursé',
              duree: '14 ou 30 jours',
              conditions: 'Si <30% contenu visionné',
              reductionFriction: '+25% conversions',
              tauxRemboursement: 'Généralement <5%'
            },
            {
              levier: 'Social proof',
              elements: ['X achats', 'Note moyenne', 'Témoignages', 'Badges'],
              seuilEfficacite: '>100 achats = très efficace',
              impact: '+60% confiance'
            },
            {
              levier: 'Preuve valeur',
              methodes: [
                'Aperçu gratuit substantiel',
                'Témoignages détaillés',
                'Résultats obtenus élèves',
                'Comparaison avant/après'
              ]
            }
          ]
        },
        testOptimisation: {
          titre: 'Tester et ajuster',
          processus: [
            {
              etape: 'Définir hypothèse',
              exemple: 'Passer de 14,99€ à 12,99€ augmentera ventes de 40%'
            },
            {
              etape: 'Tester prix (A/B test)',
              duree: 'Minimum 2-4 semaines',
              metriques: ['Nombre vues page', 'Taux conversion', 'Revenus total']
            },
            {
              etape: 'Analyser résultats',
              calculer: 'Revenus total = Prix × Nombre ventes',
              decider: 'Garder prix générant plus de revenus totaux'
            },
            {
              etape: 'Itérer',
              frequence: 'Tous les 30-60 jours',
              variation: '±15-25% du prix actuel'
            }
          ]
        },
        erreursFrequentes: [
          'Fixer prix trop bas par manque de confiance',
          'Prix trop élevé sans preuve de valeur',
          'Ne jamais ajuster prix initial',
          'Ignorer prix concurrents',
          'Prix incohérents entre contenus',
          'Ne pas tester variations',
          'Baisser prix précipitamment si ventes lentes'
        ],
        calculRentabilite: {
          formule: 'Revenu net = (Prix × Ventes) × 85% - Coûts production',
          commission: '15% Goroti déduits automatiquement',
          objectifMinimum: 'Couvrir coûts + rémunération temps',
          exemple: {
            prix: '29,99€',
            ventes: '200',
            revenuBrut: '5998€',
            commissionPlateforme: '900€',
            revenuNet: '5098€',
            coutProduction: '1000€',
            profit: '4098€'
          }
        },
        ressourcesUtiles: [
          'Analyse concurrence (rechercher contenus similaires)',
          'Statistiques conversions (Studio Analytics)',
          'Feedback acheteurs (commentaires/messages)',
          'Sondages audience (communauté)'
        ]
      }
    },
    {
      category: 'creators',
      title: 'Utiliser les Shorts',
      description: 'Format court pour promotion et engagement',
      icon: PlayCircle,
      color: 'text-blue-400',
      content: {
        introduction: 'Les Shorts sont des vidéos verticales de moins de 60 secondes, optimisées pour consommation mobile rapide et viralité.',
        caracteristiques: {
          format: 'Vertical 9:16 (1080×1920px)',
          duree: 'Maximum 60 secondes',
          lecture: 'Auto-play en boucle',
          interface: 'Swipe up/down pour vidéo suivante',
          algorithme: 'Feed dédié haute découvrabilité'
        },
        avantages: [
          'Viralité potentielle élevée',
          'Découvrabilité algorithme favorisé',
          'Engagement rapide audience',
          'Faible barrière création',
          'Cross-promotion contenu long',
          'Adapté mobile-first'
        ],
        typesShorts: [
          {
            type: 'Teaser/Trailer',
            description: 'Extraits meilleurs moments vidéo longue',
            objectif: 'Drive vers contenu complet',
            longueurIdeale: '15-30 secondes',
            cta: 'Lien vers vidéo complète'
          },
          {
            type: 'Tips rapides',
            description: 'Astuce actionnable unique',
            structure: 'Problème → Solution → Résultat',
            duree: '30-45 secondes',
            exemple: 'Comment créer miniature efficace en 3 étapes'
          },
          {
            type: 'Behind the scenes',
            description: 'Coulisses création contenu',
            angle: 'Authenticité, proximité',
            engagement: 'Très élevé',
            exemples: ['Setup studio', 'Bloopers', 'Processus création']
          },
          {
            type: 'Réaction/Commentaire',
            description: 'Réagir trend, news, ou contenu viral',
            timing: 'Rapidité cruciale (trend éphémère)',
            reach: 'Algorithme favorise contenu trend'
          },
          {
            type: 'Tutorial express',
            description: 'Micro-tuto complet condensé',
            format: 'Étapes numérotées visuellement',
            tempo: 'Rapide, dynamique',
            duree: '45-60 secondes'
          },
          {
            type: 'Storytelling court',
            description: 'Anecdote captivante complète',
            structure: 'Hook → Développement → Chute',
            emotion: 'Rire, surprise, inspiration',
            viralite: 'Très élevée si bien exécuté'
          }
        ],
        creationOptimale: {
          etape1: {
            titre: 'Capturer attention (3 premières secondes)',
            techniques: [
              'Question intrigante',
              'Affirmation choquante',
              'Visuel spectaculaire',
              'Promesse bénéfice clair',
              'Pattern interrupt'
            ],
            criticalite: '85% abandons si hook faible'
          },
          etape2: {
            titre: 'Maintenir engagement',
            tactiques: [
              'Rythme rapide (coupes fréquentes)',
              'Transitions dynamiques',
              'Textes/sous-titres lisibles',
              'Musique énergique',
              'Pas de temps mort'
            ],
            objectif: 'Rétention >50% = algorithme favorise'
          },
          etape3: {
            titre: 'Call-to-action final',
            options: [
              'Suivre chaîne',
              'Voir vidéo complète',
              'Commenter opinion',
              'Partager à ami',
              'Visiter profil'
            ],
            placement: '3-5 dernières secondes'
          }
        },
        aspectsTechniques: {
          resolution: '1080×1920px (9:16) obligatoire',
          framerate: '30fps ou 60fps',
          codec: 'H.264 recommandé',
          audio: 'AAC, 128kbps minimum',
          poids: 'Max 500 MB',
          subtitles: 'Fortement recommandés (80% regardent sans son)',
          accessibilite: 'Contraste élevé, textes lisibles mobile'
        },
        optimisationAlgorithme: {
          titre: 'Maximiser reach algorithme',
          facteurs: [
            {
              facteur: 'Taux de rétention',
              importance: 'Critique',
              objectif: '>70% finissent vidéo',
              impact: 'Principal facteur algorithme'
            },
            {
              facteur: 'Engagement (likes, comments, shares)',
              importance: 'Très élevée',
              stimuler: 'Question directe, avis polarisant',
              ratio: '>5% vues = excellent'
            },
            {
              facteur: 'Re-watch (boucles)',
              importance: 'Élevée',
              technique: 'Fin connecte au début',
              indicateur: 'Watchtime >100% durée'
            },
            {
              facteur: 'Rapidité engagement',
              importance: 'Élevée',
              definition: 'Engagement premières heures publication',
              booster: 'Publier heures pic audience'
            },
            {
              facteur: 'Cohérence publication',
              frequenceIdeale: '3-7 Shorts / semaine',
              regularite: 'Plus important que quantité ponctuelle'
            }
          ]
        },
        monetisation: {
          direct: 'Shorts non monétisables directement (pas pub)',
          indirect: [
            'Drive trafic vers contenu monétisé',
            'Croissance abonnés (↑ revenus autres contenus)',
            'Visibilité marque/produits',
            'Tips sur profil si viral'
          ],
          strategie: 'Shorts = outil acquisition, pas revenu direct'
        },
        analytics: {
          metriques: [
            'Vues totales',
            'Taux rétention moyen',
            'Pic abandon (à quel moment)',
            'Sources trafic (Shorts feed vs profil)',
            'Engagement rate',
            'Nouveaux abonnés générés'
          ],
          acces: 'Studio → Shorts → Sélectionner Short → Analytics',
          optimisation: 'Identifier patterns Shorts performants → répliquer'
        },
        bonnesPratiques: [
          'Hook puissant 3 premières secondes',
          'Sous-titres auto lisibles',
          'Format vertical strict',
          'Rythme rapide, coupes dynamiques',
          'CTA clair fin vidéo',
          'Musique trending (bibliothèque Goroti)',
          'Thumbnail attractive (même si auto-play)',
          'Hashtags pertinents (3-5 max)',
          'Publier heures pic activité',
          'Tester différents formats/styles'
        ],
        erreursEviter: [
          'Introduction trop lente',
          'Format horizontal (rejeté)',
          'Contenu trop complexe (pas adaptable 60s)',
          'Pas de sous-titres',
          'Watermark autres plateformes visible',
          'Musique copyrightée non autorisée',
          'CTA absent ou confus',
          'Publication irrégulière'
        ],
        workflow: {
          etape1: 'Créer sur mobile ou bureau (export 9:16)',
          etape2: 'Studio → Shorts → Upload',
          etape3: 'Titre (100 car) + Description (500 car) + Hashtags',
          etape4: 'Sélectionner miniature frame',
          etape5: 'Choisir musique (ou garder audio original)',
          etape6: 'Publier immédiatement ou planifier',
          etape7: 'Promouvoir 1h après (commenter, partager)',
          etape8: 'Analyser performances à J+1 et J+7'
        },
        outilsRecommandes: [
          'CapCut (montage mobile)',
          'InShot (édition rapide)',
          'Canva (textes/graphiques)',
          'Adobe Premiere Rush (avancé)',
          'Bibliothèque musique Goroti (libre droits)'
        ]
      }
    },
    {
      category: 'monetization',
      title: 'Acheter du contenu',
      description: 'Paiements sécurisés et accès immédiat',
      icon: ShoppingBag,
      color: 'text-green-400',
      content: {
        introduction: 'Goroti propose un système d\'achat sécurisé pour accéder au contenu premium des créateurs (albums, vidéos payantes, cours, concerts).',
        typesAchatsPossibles: [
          {
            type: 'Vidéo premium unique',
            prix: '0,99€ - 29,99€',
            acces: 'Permanent illimité',
            formats: 'Toutes qualités disponibles'
          },
          {
            type: 'Album/Collection',
            prix: '4,99€ - 99,99€',
            contenu: '3-50 vidéos groupées',
            avantage: 'Économie vs achat unitaire'
          },
          {
            type: 'Cours/Formation',
            prix: '19,99€ - 299,99€',
            inclus: 'Vidéos + ressources téléchargeables',
            certificat: 'Optionnel selon créateur'
          },
          {
            type: 'Location temporaire',
            prix: '30-50% du prix achat',
            duree: '24h, 48h ou 7 jours',
            usages: 'Films, concerts, événements'
          },
          {
            type: 'Pré-commande',
            prix: 'Réduit de 15-30%',
            avantages: ['Prix préférentiel', 'Accès anticipé', 'Bonus exclusifs'],
            disponibilite: 'À la sortie officielle'
          }
        ],
        processusAchat: [
          {
            etape: 1,
            titre: 'Découvrir le contenu',
            actions: [
              'Parcourir catalogue créateur',
              'Voir aperçu gratuit si disponible',
              'Lire description détaillée',
              'Consulter avis acheteurs',
              'Vérifier durée et contenu inclus'
            ]
          },
          {
            etape: 2,
            titre: 'Cliquer sur Acheter',
            affichage: [
              'Prix affiché clairement',
              'Type d\'accès (permanent/location)',
              'TVA incluse dans prix',
              'Récapitulatif avant validation'
            ]
          },
          {
            etape: 3,
            titre: 'Choisir méthode de paiement',
            options: {
              trucoin: {
                description: 'Portefeuille Goroti (TruCoin)',
                avantage: 'Instantané, pas de frais',
                rechargement: 'Carte bancaire, PayPal'
              },
              carteBancaire: {
                description: 'Visa, Mastercard, Amex',
                traitement: 'Stripe sécurisé',
                frais: 'Aucun frais supplémentaire'
              },
              paypal: {
                description: 'Compte PayPal',
                redirection: 'PayPal puis retour Goroti',
                frais: 'Aucun'
              },
              autresMoyens: {
                options: ['Apple Pay', 'Google Pay', 'Bancontact (Belgique)', 'iDEAL (Pays-Bas)'],
                disponibilite: 'Selon pays'
              }
            }
          },
          {
            etape: 4,
            titre: 'Validation du paiement',
            securite: [
              'Chiffrement SSL 256-bit',
              '3D Secure (si carte bancaire)',
              'Pas de stockage données bancaires',
              'Conformité PCI DSS niveau 1'
            ],
            duree: 'Quelques secondes',
            confirmation: 'Email + notification in-app'
          },
          {
            etape: 5,
            titre: 'Accès immédiat au contenu',
            instantane: [
              'Contenu débloqué immédiatement',
              'Visible dans "Mes achats"',
              'Streaming illimité',
              'Téléchargement si autorisé',
              'Accès multi-appareils'
            ]
          }
        ],
        gestionAchats: {
          bibliotheque: {
            acces: 'Profil → Mes Achats',
            affichage: 'Liste tous contenus achetés',
            filtres: ['Par date', 'Par créateur', 'Par type', 'Par prix'],
            recherche: 'Barre de recherche intégrée'
          },
          visionnage: {
            qualites: 'Toutes disponibles (SD, HD, 4K)',
            horsLigne: 'Téléchargement si autorisé par créateur',
            multiAppareils: 'Jusqu\'à 5 appareils simultanés',
            partage: 'Non transférable (lié à votre compte)'
          },
          factures: {
            acces: 'Paramètres → Facturation → Historique',
            contenu: 'PDF téléchargeable pour chaque achat',
            details: ['Date transaction', 'Créateur', 'Titre contenu', 'Prix TTC', 'TVA', 'Méthode paiement'],
            utilite: 'Déclaration fiscale si professionnel'
          }
        },
        remboursements: {
          conditions: {
            eligible: [
              'Contenu ne correspond pas à description',
              'Problème technique empêchant visionnage',
              'Achat accidentel (sous 24h)',
              'Contenu supprimé par créateur'
            ],
            nonEligible: [
              'Changement d\'avis après visionnage >30%',
              'Qualité subjective (goûts personnels)',
              '>14 jours après achat',
              'Contenu téléchargé complètement'
            ]
          },
          procedure: [
            {
              etape: 1,
              action: 'Aller dans Mes Achats → Sélectionner contenu → Demander remboursement'
            },
            {
              etape: 2,
              action: 'Remplir formulaire avec raison détaillée'
            },
            {
              etape: 3,
              action: 'Équipe examine sous 2-5 jours ouvrés'
            },
            {
              etape: 4,
              action: 'Réponse par email + notification'
            },
            {
              etape: 5,
              action: 'Si approuvé: remboursement sous 3-7 jours ouvrés'
            }
          ],
          delaisRemboursement: {
            trucoin: '24-48h (recrédit wallet)',
            carteBancaire: '3-7 jours ouvrés',
            paypal: '2-5 jours ouvrés'
          },
          montant: 'Intégral (prix payé)'
        },
        protectionAcheteur: {
          garanties: [
            'Achat sécurisé par Stripe',
            'Chiffrement données bancaires',
            'Politique remboursement claire',
            'Support dédié achats',
            'Médiation Goroti en cas litige'
          ],
          recours: [
            'Contacter créateur directement',
            'Signaler problème à Goroti (Support)',
            'Demande remboursement formelle',
            'Médiation si désaccord créateur',
            'Chargeback bancaire en dernier recours'
          ]
        },
        bonnesPratiques: [
          'Lire description complète avant achat',
          'Visionner aperçu gratuit si disponible',
          'Consulter avis d\'autres acheteurs',
          'Vérifier durée et contenu inclus',
          'Comparer avec autres offres similaires',
          'Profiter pré-commandes et promos',
          'Conserver factures pour comptabilité'
        ],
        faq: [
          {
            q: 'Puis-je offrir du contenu à quelqu\'un?',
            r: 'Oui, via l\'option "Offrir en cadeau" sur page produit. Code envoyé par email.'
          },
          {
            q: 'Le contenu acheté est-il permanent?',
            r: 'Oui, sauf location temporaire. Accès illimité tant que créateur laisse contenu en ligne.'
          },
          {
            q: 'Puis-je télécharger le contenu?',
            r: 'Uniquement si créateur l\'autorise. Option visible sur page produit.'
          },
          {
            q: 'Que se passe-t-il si créateur supprime contenu?',
            r: 'Vous gardez accès si déjà acheté. Si suppression avant accès: remboursement automatique.'
          },
          {
            q: 'Puis-je annuler un achat?',
            r: 'Oui sous 24h si <10% visionné. Après: selon politique remboursement (14 jours).'
          }
        ],
        securite: {
          paiements: 'Traités par Stripe (leader mondial)',
          donnees: 'Jamais stockées par Goroti',
          conformite: 'PCI DSS niveau 1, RGPD',
          antiFraude: 'Détection automatique transactions suspectes'
        }
      }
    },
    {
      category: 'monetization',
      title: 'Utiliser TruCoin',
      description: 'Wallet, recharge et conversion',
      icon: Wallet,
      color: 'text-green-400',
      content: {
        introduction: 'TruCoin est le portefeuille virtuel de Goroti permettant d\'acheter du contenu, envoyer des tips, et gérer vos revenus créateur.',
        definition: {
          trucoin: 'Monnaie virtuelle de Goroti',
          equivalence: '1 TruCoin = 1 EUR (parité fixe)',
          usage: 'Achats, tips, paiements créateurs',
          avantages: ['Transactions instantanées', 'Pas de frais entre utilisateurs', 'Gestion revenus unifiée']
        },
        creationWallet: {
          automatique: 'Créé dès inscription Goroti',
          acces: 'Header → Icône Wallet ou Profil → TruCoin Wallet',
          affichage: [
            'Solde disponible',
            'Solde en attente (revenus créateur)',
            'Historique transactions',
            'Options recharge/retrait'
          ]
        },
        rechargerWallet: {
          methodes: [
            {
              methode: 'Carte bancaire',
              frais: '0% (gratuit)',
              instantane: true,
              minimum: '5€',
              maximum: '500€ par transaction',
              cartes: 'Visa, Mastercard, Amex'
            },
            {
              methode: 'PayPal',
              frais: '2,9% + 0,35€',
              delai: '1-3 minutes',
              minimum: '10€',
              maximum: '1000€ par transaction'
            },
            {
              methode: 'Virement bancaire',
              frais: '0% (gratuit)',
              delai: '1-3 jours ouvrés',
              minimum: '50€',
              maximum: '10000€',
              idealpour: 'Gros montants'
            },
            {
              methode: 'Apple Pay / Google Pay',
              frais: '0%',
              instantane: true,
              minimum: '5€',
              maximum: '500€',
              disponibilite: 'Selon appareil'
            }
          ],
          processus: [
            'Cliquer sur "Recharger" dans wallet',
            'Sélectionner montant ou saisir personnalisé',
            'Choisir méthode paiement',
            'Valider transaction',
            'TruCoin crédités instantanément (ou selon délai méthode)'
          ],
          limites: {
            parJour: '2000€ (tous moyens confondus)',
            parMois: '10000€',
            augmentation: 'Possible après KYC niveau 3'
          }
        },
        utiliserTruCoin: {
          achatsContenu: {
            description: 'Achat vidéos, albums, cours premium',
            avantage: 'Paiement instantané sans ressaisir CB',
            procedure: 'Sélectionner TruCoin comme moyen paiement'
          },
          tipsCreateurs: {
            description: 'Soutenir créateurs volontairement',
            montants: '1€ à 500€',
            options: ['Tip unique', 'Tip récurrent mensuel'],
            visibilite: 'Anonyme ou public (au choix)'
          },
          abonnementsCreateurs: {
            description: 'Devenir membre payant chaîne',
            paiement: 'Mensuel automatique depuis wallet',
            renouvellement: 'Auto si solde suffisant, sinon notification'
          },
          achatsMarketplace: {
            description: 'Services créateurs (beats, montage, coaching)',
            protection: 'Fonds bloqués en escrow jusqu\'à livraison',
            liberation: 'Après validation acheteur'
          }
        },
        revemusCreateur: {
          reception: {
            origine: ['Ventes contenu premium', 'Tips reçus', 'Abonnements membres', 'Services marketplace', 'Publicités (si éligible)', 'Affiliation'],
            delai: 'Crédités immédiatement au wallet',
            affichage: 'Onglet "Revenus" dans wallet'
          },
          statuts: {
            disponible: {
              description: 'Solde retirable immédiatement',
              condition: 'Transactions validées',
              utilisation: 'Retrait bancaire ou achats Goroti'
            },
            enAttente: {
              description: 'Revenus en cours validation',
              duree: '7-14 jours (anti-fraude)',
              raisons: ['Ventes récentes', 'Remboursements possibles', 'Vérification qualité']
            },
            bloque: {
              description: 'Temporairement indisponible',
              causes: ['Litige en cours', 'KYC non validé', 'Violation CGU suspectée'],
              resolution: 'Contacter support'
            }
          }
        },
        retirerArgent: {
          prerequis: [
            'KYC niveau 2 minimum validé',
            'Solde disponible ≥ 50€',
            'Méthode retrait configurée',
            'Pas de litige en cours'
          ],
          methodes: [
            {
              methode: 'Virement bancaire SEPA',
              frais: '1€ (fixe)',
              delai: '3-5 jours ouvrés',
              minimum: '50€',
              maximum: 'Illimité',
              iban: 'Requis (zone SEPA uniquement)'
            },
            {
              methode: 'PayPal',
              frais: '2% du montant',
              delai: '1-2 jours ouvrés',
              minimum: '20€',
              maximum: '5000€ par transaction',
              email: 'Compte PayPal vérifié'
            },
            {
              methode: 'Wise (ex-TransferWise)',
              frais: 'Variable selon pays (0,5-2%)',
              delai: '1-3 jours',
              minimum: '50€',
              international: 'Idéal hors-SEPA'
            }
          ],
          processus: [
            {
              etape: 1,
              action: 'Wallet → Retirer → Sélectionner montant'
            },
            {
              etape: 2,
              action: 'Choisir méthode retrait'
            },
            {
              etape: 3,
              action: 'Vérifier coordonnées bancaires/PayPal'
            },
            {
              etape: 4,
              action: 'Confirmer retrait (code 2FA si activé)'
            },
            {
              etape: 5,
              action: 'Virement traité selon délais méthode'
            },
            {
              etape: 6,
              action: 'Email confirmation + notif réception'
            }
          ],
          frequence: {
            recommandation: 'Mensuelle pour minimiser frais',
            possibilite: 'À la demande (respect seuils)',
            automatique: 'Configuration possible (ex: chaque 1er du mois si >100€)'
          }
        },
        historiqueTransactions: {
          acces: 'Wallet → Historique',
          affichage: [
            'Date et heure',
            'Type transaction',
            'Montant (+ ou -)',
            'Solde après transaction',
            'Référence/ID unique',
            'Statut (complété, en attente, échoué)'
          ],
          filtres: ['Par type', 'Par date', 'Par montant', 'Par créateur'],
          export: 'CSV ou PDF pour comptabilité',
          conservation: 'Historique intégral permanent'
        },
        securite: {
          protection: [
            'Authentification 2FA recommandée',
            'Notifications transaction email+app',
            'Détection activité suspecte',
            'Blocage automatique si fraude détectée',
            'Historique IP connexions'
          ],
          recuperation: {
            motDePasseOublie: 'Récupération email standard',
            compteHacke: 'Gel wallet immédiat si signalé',
            fraudeDetectee: 'Investigation support + gel temporaire',
            remboursement: 'Si fraude confirmée avérée'
          }
        },
        fiscalite: {
          declaration: 'Utilisateur responsable déclaration revenus',
          documents: [
            'Récapitulatif annuel disponible',
            'Export détaillé transactions',
            'Factures tous achats/ventes'
          ],
          conseil: 'Consulter expert-comptable si revenus significatifs',
          tva: {
            achats: 'Incluse dans prix affiché',
            ventes: 'Gérée automatiquement selon pays acheteur',
            auto: 'Entrepreneurs: activer numéro TVA dans paramètres'
          }
        },
        limitesSolde: {
          utilisateurStandard: {
            soldeMax: '10000€',
            rechargeParJour: '2000€',
            rechargeParMois: '10000€'
          },
          kycNiveau2: {
            soldeMax: '25000€',
            rechargeParJour: '5000€',
            rechargeParMois: '25000€'
          },
          kycNiveau3: {
            soldeMax: '50000€',
            rechargeParJour: '10000€',
            rechargeParMois: '100000€'
          },
          entreprise: {
            soldeMax: 'Négociable',
            limites: 'Personnalisées',
            contact: 'business@goroti.com'
          }
        },
        bonnesPratiques: [
          'Activer 2FA pour sécurité wallet',
          'Vérifier toujours destinataire avant tip',
          'Recharger montants ronds évite centimes',
          'Retirer régulièrement si gros revenus',
          'Conserver exports pour comptabilité',
          'Ne jamais partager codes 2FA',
          'Surveiller historique transactions'
        ],
        faq: [
          {
            q: 'Les TruCoin expirent-ils?',
            r: 'Non, pas de date d\'expiration. Valables indéfiniment.'
          },
          {
            q: 'Puis-je transférer TruCoin à un ami?',
            r: 'Non, transferts directs interdits (anti-blanchiment). Utilisez tips créateurs.'
          },
          {
            q: 'Que se passe-t-il si je supprime mon compte?',
            r: 'Solde doit être retiré AVANT suppression. Après: non récupérable.'
          },
          {
            q: 'TruCoin = cryptomonnaie?',
            r: 'Non, monnaie virtuelle traditionnelle (parité EUR fixe), pas blockchain.'
          },
          {
            q: 'Frais conversion TruCoin → EUR?',
            r: 'Aucun frais conversion (1 TruCoin = 1 EUR). Frais seulement sur retrait bancaire selon méthode.'
          }
        ]
      }
    },
    {
      category: 'monetization',
      title: 'Retrait de revenus',
      description: 'Seuils, délais et méthodes de paiement',
      icon: DollarSign,
      color: 'text-green-400',
      content: {
        introduction: 'Les créateurs Goroti peuvent retirer leurs revenus une fois les seuils minimums atteints et le KYC validé.',
        prerequisObligatoires: [
          {
            condition: 'KYC validé',
            niveau: 'Niveau 2 minimum (ID + Selfie)',
            pourquoi: 'Obligation légale anti-blanchiment',
            sans: 'Revenus bloqués dans wallet'
          },
          {
            condition: 'Solde disponible minimum',
            montant: '50€',
            raison: 'Rentabilité frais traitement bancaire',
            exception: 'PayPal: 20€ minimum'
          },
          {
            condition: 'Coordonnées bancaires',
            types: ['IBAN (SEPA)', 'Compte PayPal vérifié', 'Compte Wise'],
            verification: 'Validées lors 1er retrait',
            modification: 'Possible à tout moment'
          },
          {
            condition: 'Pas de litige en cours',
            blocage: 'Retraits gelés si litige client',
            resolution: 'Débloqué après résolution',
            mediation: 'Support Goroti si désaccord'
          }
        ],
        methodesRetrait: [
          {
            methode: 'Virement SEPA',
            frais: '1€ fixe',
            delai: '3-5 jours ouvrés',
            minimum: '50€',
            maximum: 'Illimité',
            zones: ['France', 'Belgique', 'Suisse', 'Allemagne', '+ 33 pays SEPA'],
            requis: 'IBAN + BIC',
            ideal: 'Gros montants récurrents'
          },
          {
            methode: 'PayPal',
            frais: '2% du montant',
            delai: '1-2 jours ouvrés',
            minimum: '20€',
            maximum: '5000€ par transaction',
            requis: 'Email PayPal vérifié',
            avantage: 'Rapide et flexible',
            inconvenient: 'Frais % élevés gros montants'
          },
          {
            methode: 'Wise (TransferWise)',
            frais: '0,5-2% selon pays',
            delai: '1-3 jours ouvrés',
            minimum: '50€',
            maximum: 'Illimité',
            zones: '50+ pays (hors SEPA)',
            avantage: 'Meilleur taux change international',
            ideal: 'Créateurs hors zone euro'
          },
          {
            methode: 'Virement international (SWIFT)',
            frais: '15-25€ fixes',
            delai: '5-10 jours ouvrés',
            minimum: '200€',
            zones: 'Monde entier',
            inconvenient: 'Frais élevés, lent',
            dernierRecours: 'Si aucune autre option'
          }
        ],
        processusRetrait: {
          etapes: [
            {
              numero: 1,
              titre: 'Vérifier solde disponible',
              acces: 'Wallet → Revenus → Solde disponible',
              distinction: 'Disponible vs En attente',
              rappel: 'Seul solde disponible retirable'
            },
            {
              numero: 2,
              titre: 'Demander retrait',
              chemin: 'Wallet → Retirer',
              saisir: 'Montant souhaité (respect minimum)',
              verification: 'Calcul automatique frais + net reçu'
            },
            {
              numero: 3,
              titre: 'Sélectionner méthode',
              comparaison: 'Affichage frais et délais chaque méthode',
              choix: 'Selon préférence vitesse/coût',
              nouveauCompte: 'Validation coordonnées si 1ère fois'
            },
            {
              numero: 4,
              titre: 'Confirmer transaction',
              securite: 'Code 2FA si activé',
              recap: 'Montant brut, frais, net à recevoir',
              validation: 'Clic "Confirmer retrait"'
            },
            {
              numero: 5,
              titre: 'Traitement demande',
              immediat: 'Déduction wallet immédiate',
              statut: 'Passage "En cours traitement"',
              notification: 'Email confirmation envoi'
            },
            {
              numero: 6,
              titre: 'Réception fonds',
              delai: 'Selon méthode choisie',
              notification: 'Email arrivée fonds',
              verification: 'Consulter relevé bancaire/PayPal'
            }
          ],
          suiviDemande: {
            acces: 'Wallet → Historique retraits',
            statuts: {
              enCours: 'Traitement par Goroti',
              envoye: 'Transféré établissement bancaire',
              complete: 'Fonds reçus destination',
              echoue: 'Erreur (coordonnées invalides)',
              annule: 'Annulation demandée avant traitement'
            },
            dureeMax: '10 jours ouvrés (SWIFT) sinon contacter support'
          }
        },
        calendrierRetraits: {
          frequenceRecommandee: {
            petitsRevenus: 'Mensuelle (minimiser impact frais)',
            revenusMoyens: 'Bimensuelle ou mensuelle',
            grosRevenus: 'Hebdomadaire (limiter solde wallet)',
            professionnel: 'Retrait automatique programmé'
          },
          retraitAutomatique: {
            activation: 'Paramètres wallet → Retraits automatiques',
            frequences: ['Hebdomadaire', 'Bimensuel', 'Mensuel'],
            seuil: 'Minimum 50€ (ou montant personnalisé)',
            exemple: 'Chaque 1er du mois si solde ≥100€'
          },
          joursFeries: {
            impact: 'Délais rallongés (banques fermées)',
            periodes: 'Noël, Jour an, Pâques, 1er mai...',
            conseil: 'Anticiper retraits avant fêtes'
          }
        },
        periodesAttente: {
          nouvellesVentes: {
            duree: '7 jours après vente',
            raison: 'Fenêtre remboursement acheteurs',
            affichage: 'Solde "En attente"',
            liberation: 'Automatique après 7 jours'
          },
          premiereVente: {
            duree: '14 jours',
            raison: 'Vérification activité + anti-fraude',
            unique: 'Une seule fois par créateur',
            communication: 'Email explicatif envoyé'
          },
          abonnementsRecurrents: {
            duree: '5 jours après prélèvement',
            raison: 'Vérification paiement bancaire',
            frequence: 'Chaque mois pour nouveaux abonnés'
          },
          contestationsEnCours: {
            duree: 'Jusqu\'à résolution',
            montant: 'Montant contesté bloqué uniquement',
            reste: 'Autres revenus retirables normalement',
            delaiMax: '60 jours max (réglementation)'
          }
        },
        fraisDetailles: {
          fraisGoroti: {
            commission: '15% sur ventes (déjà déduite)',
            retraits: 'Frais méthode paiement uniquement',
            tips: '5% commission (vs 15% ventes)',
            abonnements: '10% commission'
          },
          fraisBancaires: {
            sepa: '1€ fixe Goroti (pas frais bancaires supplémentaires)',
            paypal: '2% Goroti + éventuels frais PayPal destination',
            wise: 'Variable (généralement <2%)',
            swift: '15-25€ Goroti + frais banques intermédiaires'
          },
          optimiserFrais: [
            'Privilégier SEPA si zone Euro (frais fixes)',
            'Grouper petits montants (1 retrait 100€ mieux que 5×20€)',
            'PayPal rentable <500€ (frais % vs fixe)',
            'Wise idéal hors SEPA (meilleur change)',
            'Éviter SWIFT sauf nécessité'
          ]
        },
        taxesFiscalite: {
          responsabilite: 'Créateur responsable déclaration revenus',
          documents: {
            recapitulatif: 'Annuel automatique (janvier)',
            details: 'Export CSV mensuel disponible',
            factures: 'Chaque vente (stockage permanent)',
            certifications: 'Attestation revenus sur demande'
          },
          declarationFrance: {
            categorieImpots: 'BNC (Bénéfices Non Commerciaux) ou BIC',
            seuil: 'Si >305€/an: déclaration obligatoire',
            regime: 'Micro-BNC si <77700€/an',
            conseil: 'Comptable si revenus réguliers importants'
          },
          tva: {
            franchise: 'Exonéré si <36800€/an (France 2026)',
            auDela: 'Déclaration TVA obligatoire',
            numeroTVA: 'À renseigner dans paramètres Goroti',
            autoliquidation: 'Goroti gère selon pays acheteur'
          },
          international: {
            doubleImposition: 'Conventions fiscales selon pays',
            certificat: 'Résidence fiscale utile',
            conseil: 'Expert fiscal international si multinationale'
          }
        },
        problemesFrequents: {
          retraitRefuse: [
            {
              cause: 'KYC non validé',
              solution: 'Compléter vérification identité'
            },
            {
              cause: 'Solde insuffisant',
              solution: 'Attendre revenus supplémentaires (min 50€)'
            },
            {
              cause: 'Coordonnées bancaires invalides',
              solution: 'Vérifier IBAN/BIC ou compte PayPal'
            },
            {
              cause: 'Litige client non résolu',
              solution: 'Répondre litige ou contacter support'
            },
            {
              cause: 'Activité suspecte détectée',
              solution: 'Contacter support vérifications'
            }
          ],
          retraitNonRecu: [
            {
              etape: 'Vérifier statut',
              action: 'Wallet → Historique → Vérifier "Complété"'
            },
            {
              etape: 'Vérifier délais',
              action: 'Respecter délais méthode (3-5j SEPA)'
            },
            {
              etape: 'Vérifier coordonnées',
              action: 'IBAN correct? Email PayPal bon?'
            },
            {
              etape: 'Contacter banque',
              action: 'Virement peut être en transit'
            },
            {
              etape: 'Contacter support Goroti',
              action: 'Si >10 jours sans réception',
              fournir: 'ID transaction, captures écran'
            }
          ],
          montantIncorrect: [
            'Vérifier frais déduits (affichés confirmation)',
            'Conversion devise (si hors EUR)',
            'Frais bancaires intermédiaires (SWIFT)',
            'Contacter support si écart inexpliqué'
          ]
        },
        optimisationRevenus: {
          strategies: [
            {
              strategie: 'Fréquence adaptée',
              petit: 'Mensuel (limiter frais)',
              moyen: 'Bimensuel',
              gros: 'Hebdomadaire (liquidité)'
            },
            {
              strategie: 'Diversifier revenus',
              canaux: ['Ventes premium', 'Abonnements', 'Tips', 'Marketplace', 'Affiliation'],
              avantage: 'Stabilité revenus'
            },
            {
              strategie: 'Promo avant retrait',
              timing: 'Campagne fin mois → retrait début mois',
              impact: 'Maximiser montant retrait'
            },
            {
              strategie: 'Comptabilité rigoureuse',
              outils: 'Export mensuel + factures',
              avantage: 'Simplif déclaration fiscale'
            }
          ]
        },
        securite: {
          protections: [
            'Notifications email chaque retrait',
            '2FA obligatoire si retrait >1000€',
            'Historique IP et appareils',
            'Blocage si connexion suspecte',
            'Délai sécurité nouveau compte bancaire'
          ],
          bonnesPratiques: [
            'Activer 2FA sur compte',
            'Vérifier email confirmation retrait',
            'Ne jamais partager accès wallet',
            'Changer mdp régulièrement',
            'Surveiller historique transactions',
            'Signaler activité suspecte immédiatement'
          ]
        }
      }
    },
    {
      category: 'monetization',
      title: 'Délais bancaires',
      description: 'Comprendre les délais de virement',
      icon: AlertCircle,
      color: 'text-green-400',
      content: {
        introduction: 'Les délais bancaires varient selon la méthode de retrait choisie et impliquent plusieurs acteurs (Goroti, banques, réseaux paiement).',
        chainePaiement: {
          etapes: [
            {
              etape: 1,
              acteur: 'Goroti',
              action: 'Réception demande retrait',
              duree: 'Instantané',
              details: 'Déduction wallet immédiate'
            },
            {
              etape: 2,
              acteur: 'Goroti',
              action: 'Vérifications sécurité',
              duree: '< 2 heures',
              verifications: ['Identité', 'Coordonnées bancaires', 'Conformité réglementaire', 'Anti-fraude']
            },
            {
              etape: 3,
              acteur: 'Processeur paiement (Stripe)',
              action: 'Transfert vers établissement bancaire',
              duree: '1-2 jours ouvrés',
              role: 'Intermédiaire sécurisé Goroti → Banques'
            },
            {
              etape: 4,
              acteur: 'Réseau bancaire (SEPA/SWIFT)',
              action: 'Acheminement international',
              dureeSEPA: '1-2 jours ouvrés',
              dureeSWIFT: '3-7 jours ouvrés',
              variables: 'Banques intermédiaires, fuseaux horaires'
            },
            {
              etape: 5,
              acteur: 'Banque destinataire',
              action: 'Crédit compte bénéficiaire',
              duree: '< 1 jour',
              visible: 'Relevé bancaire / app banque'
            }
          ],
          dureeeTotalesMoyennes: {
            sepa: '3-5 jours ouvrés',
            paypal: '1-2 jours ouvrés',
            wise: '1-3 jours ouvrés',
            swift: '5-10 jours ouvrés'
          }
        },
        facteursDelais: [
          {
            facteur: 'Jours ouvrés vs calendaires',
            explication: 'Banques fermées week-ends + jours fériés',
            impact: 'Demande vendredi → traitement lundi',
            conseil: 'Anticiper retraits fin semaine'
          },
          {
            facteur: 'Fuseaux horaires',
            explication: 'Heures limites traitement bancaire',
            heureLimite: 'Généralement 16h-17h heure locale banque',
            consequence: 'Après limite → lendemain'
          },
          {
            facteur: 'Banques intermédiaires',
            explication: 'Chaque banque transit ajoute délai',
            sepa: '1-2 banques max (rapide)',
            swift: '3-5 banques possible (lent)',
            imprévisible: 'Trajets peuvent varier'
          },
          {
            facteur: 'Vérifications conformité',
            explication: 'Contrôles anti-blanchiment',
            declencheurs: ['Gros montants (>5000€)', 'Nouveau bénéficiaire', 'Pays à risque', 'Activité inhabituelle'],
            dureeSupp: '+1-3 jours ouvrés'
          },
          {
            facteur: 'Période de l\'année',
            rallongements: ['Fêtes fin d\'année: +2-3 jours', 'Pâques: +1-2 jours', 'Été (certains pays): +1 jour', '1er janvier, 1er mai: banques fermées'],
            conseil: 'Retrait 1 semaine avant fêtes importantes'
          },
          {
            facteur: 'Pays destination',
            europeSEPA: 'Délais courts standardisés',
            horsEurope: 'Variables selon accords bancaires',
            paysComplexes: 'Russie, Chine, Brésil: +3-5 jours'
          }
        ],
        delaisParMethode: {
          virementSEPA: {
            minimum: '2 jours ouvrés',
            moyen: '3-4 jours ouvrés',
            maximum: '5 jours ouvrés',
            exceptionnel: '7 jours (si complications)',
            paysCouverts: '36 pays zone SEPA',
            fiabilite: 'Très élevée (>99%)'
          },
          paypal: {
            minimum: '1 jour ouvré',
            moyen: '1-2 jours ouvrés',
            maximum: '3 jours ouvrés',
            instantane: 'Possible si compte PayPal business',
            avantage: 'Plus rapide que bancaire',
            variabilite: 'Vérifications PayPal aléatoires'
          },
          wise: {
            minimum: '1 jour ouvré',
            moyen: '1-2 jours ouvrés',
            maximum: '3 jours ouvrés',
            europe: '80% arrivent en 24h',
            horsEurope: 'Variable (1-5 jours)',
            transparent: 'Suivi temps réel dans app Wise'
          },
          swift: {
            minimum: '3 jours ouvrés',
            moyen: '5-7 jours ouvrés',
            maximum: '10-15 jours ouvrés',
            complications: 'Jusqu\'à 20 jours si problèmes',
            imprévisible: 'Chaque banque intermédiaire ajoute délai',
            dernierRecours: 'Utiliser seulement si aucune alternative'
          }
        },
        suivreVirement: {
          gorotiTracking: {
            acces: 'Wallet → Historique retraits → Détails',
            statuts: {
              'Demandé': 'Juste créé, en attente traitement',
              'En cours': 'Vérifications Goroti en cours',
              'Traitement': 'Envoyé au processeur paiement',
              'Envoyé': 'Parti vers banque destination',
              'Complété': 'Goroti confirme arrivée',
              'Échec': 'Erreur (coordonnées invalides)'
            },
            referenceID: 'Numéro unique pour support'
          },
          suiviBancaire: {
            app: 'Application banque (notifications temps réel)',
            releve: 'Virement apparaît J-1 avant crédit effectif',
            libelle: '"Goroti" ou "Stripe" selon processeur',
            montant: 'Net après frais'
          },
          paypalWise: {
            notifications: 'Email + notif app dès réception',
            suivi: 'Interface web/app avec statut temps réel',
            precision: 'Estimation arrivée assez fiable'
          },
          problemes: [
            {
              situation: 'Statut "Envoyé" depuis >7 jours',
              action: 'Contacter support Goroti avec ID transaction'
            },
            {
              situation: 'Statut "Échec"',
              action: 'Vérifier coordonnées bancaires → corriger → relancer'
            },
            {
              situation: 'Virement bancaire incomplet',
              raisons: ['Frais intermédiaires déduits', 'Conversion devise défavorable'],
              recours: 'Difficile, prévoir dans montant initial'
            }
          ]
        },
        accelererRetraits: {
          impossibleGoroti: 'Goroti ne contrôle pas délais bancaires',
          strategies: [
            {
              methode: 'Choisir PayPal',
              avantage: 'Plus rapide que bancaire',
              trade: 'Frais 2% vs 1€ fixe SEPA'
            },
            {
              methode: 'Wise pour international',
              avantage: 'Réseau propre = plus rapide SWIFT',
              economies: 'Meilleur taux change aussi'
            },
            {
              methode: 'Retrait début semaine',
              logique: 'Lundi-mardi traités dans semaine',
              eviter: 'Vendredi après-midi = traitement lundi'
            },
            {
              methode: 'Vérifier coordonnées préalablement',
              action: 'Tester petit montant (20€) d\'abord',
              economie: 'Évite échecs gros montants'
            },
            {
              methode: 'Anticiper périodes chargées',
              eviter: 'Fin mois (payes), fêtes',
              prevoir: '+2-3 jours ces périodes'
            }
          ]
        },
        comparatifMoyensPaiement: {
          criteres: ['Rapidité', 'Fiabilité', 'Coût', 'Disponibilité'],
          classement: {
            rapidite: ['PayPal (1-2j)', 'Wise (1-3j)', 'SEPA (3-5j)', 'SWIFT (5-10j)'],
            fiabilite: ['SEPA (99%+)', 'Wise (99%)', 'PayPal (98%)', 'SWIFT (95%)'],
            cout: ['SEPA (1€)', 'Wise (0,5-2%)', 'PayPal (2%)', 'SWIFT (15-25€)'],
            simplicite: ['PayPal', 'SEPA', 'Wise', 'SWIFT']
          },
          recommandations: {
            petitsMontants: 'PayPal (rapidité > coût)',
            montantsMoyens: 'SEPA (équilibre coût/délai)',
            grosMontants: 'SEPA (frais fixes)',
            international: 'Wise (meilleur rapport qualité/prix)',
            urgence: 'PayPal ou Wise',
            recurrence: 'SEPA automatique programmé'
          }
        },
        faq: [
          {
            q: 'Pourquoi mon virement prend plus de 5 jours?',
            r: 'Vérifications complémentaires, banques intermédiaires, ou période fériée. Contacter support si >10 jours.'
          },
          {
            q: 'Puis-je annuler un retrait en cours?',
            r: 'Seulement si statut encore "Demandé" ou "En cours". Après "Envoyé": impossible.'
          },
          {
            q: 'Délais raccourcis si compte vérifié?',
            r: 'Non, délais bancaires identiques. KYC juste débloque capacité retrait.'
          },
          {
            q: 'Virement arrivé partiel (montant moindre)?',
            r: 'Frais bancaires intermédiaires (SWIFT) ou conversion devise. Vérifier détails banque.'
          },
          {
            q: 'Goroti peut-il accélérer un virement?',
            r: 'Non, une fois envoyé au réseau bancaire, hors contrôle Goroti.'
          }
        ],
        urgences: {
          besoinRapide: [
            'Planifier retraits à l\'avance (pas urgence last-minute)',
            'Garder réserve TruCoin pour achats immédiats',
            'PayPal si besoin sous 48h',
            'SEPA généralement fiable 3-5j',
            'Éviter compter sur argent avant réception effective'
          ],
          supportUrgent: {
            email: 'payments@goroti.com',
            delaiReponse: '24-48h jours ouvrés',
            fournir: ['ID transaction', 'Date demande', 'Montant', 'Méthode', 'Captures écran'],
            attentes: 'Support enquête mais ne peut forcer banques'
          }
        }
      }
    },
    {
      category: 'account',
      title: 'Protection copyright',
      description: 'Signaler une violation de droits d\'auteur',
      icon: Shield,
      color: 'text-red-400',
    },
    {
      category: 'account',
      title: 'Signalement de contenu',
      description: 'Procédure de signalement et modération',
      icon: AlertCircle,
      color: 'text-red-400',
    },
    {
      category: 'account',
      title: 'Contestation DMCA',
      description: 'Comment contester un retrait de contenu',
      icon: Scale,
      color: 'text-red-400',
    },
    {
      category: 'account',
      title: 'Suppression de contenu',
      description: 'Politique et procédure de suppression',
      icon: FileText,
      color: 'text-red-400',
    },
    {
      category: 'community',
      title: 'Commander un service',
      description: 'Marketplace de services créateurs',
      icon: ShoppingBag,
      color: 'text-yellow-400',
    },
    {
      category: 'community',
      title: 'Livrer un travail',
      description: 'Validation et livraison client',
      icon: CheckCircle,
      color: 'text-yellow-400',
    },
    {
      category: 'community',
      title: 'Litiges et escrow',
      description: 'Résolution des conflits marketplace',
      icon: Scale,
      color: 'text-yellow-400',
    },
    {
      category: 'account',
      title: 'Récupération de mot de passe',
      description: 'Réinitialiser l\'accès à votre compte',
      icon: Settings,
      color: 'text-gray-400',
    },
    {
      category: 'account',
      title: 'Récupération de compte',
      description: 'Procédure en cas de compte bloqué',
      icon: HelpCircle,
      color: 'text-gray-400',
    },
    {
      category: 'account',
      title: 'Suppression de compte',
      description: 'Supprimer définitivement votre compte',
      icon: AlertCircle,
      color: 'text-gray-400',
    },
    {
      category: 'account',
      title: 'Confidentialité et données',
      description: 'Gestion de vos données personnelles',
      icon: Shield,
      color: 'text-gray-400',
    },
  ];

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const blogPosts = [
    { title: 'Nouvelles fonctionnalités - Janvier 2026', category: 'Produit', date: '15 Jan 2026' },
    { title: '10 conseils pour monétiser votre contenu', category: 'Créateurs', date: '10 Jan 2026' },
    { title: 'Tendances musique streaming 2026', category: 'Industrie', date: '5 Jan 2026' },
  ];

  const renderDocContent = (content: any): JSX.Element => {
    return (
      <div className="space-y-6">
        {Object.entries(content || {}).map(([key, value]) => {
          if (key === 'description' || key === 'duration') return null;

          return (
            <div key={key} className="space-y-3">
              <h4 className="text-lg font-semibold text-cyan-400 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </h4>

              {typeof value === 'string' && (
                <p className="text-gray-300 font-mono text-sm bg-gray-900 p-3 rounded-lg">
                  {value}
                </p>
              )}

              {Array.isArray(value) && (
                <div className="space-y-2">
                  {value.map((item, index) => {
                    if (typeof item === 'string') {
                      return (
                        <div key={index} className="flex items-start gap-3 text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-1 shrink-0" />
                          <span>{item}</span>
                        </div>
                      );
                    }
                    if (typeof item === 'object' && item.title) {
                      return (
                        <div key={index} className="bg-gray-900 p-4 rounded-lg space-y-2">
                          <h5 className="text-white font-semibold">{item.title}</h5>
                          {item.details && (
                            <div className="space-y-1 pl-4">
                              {item.details.map((detail: string, i: number) => (
                                <div key={i} className="text-gray-400 text-sm">• {detail}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              )}

              {typeof value === 'object' && !Array.isArray(value) && (
                <div className="bg-gray-900 p-4 rounded-lg space-y-3">
                  {Object.entries(value).map(([subKey, subValue]) => (
                    <div key={subKey} className="space-y-2">
                      <div className="text-white font-medium">
                        {subKey.replace(/([A-Z])/g, ' $1').trim()}:
                      </div>
                      {typeof subValue === 'string' ? (
                        <div className="text-gray-300 text-sm pl-4">{subValue}</div>
                      ) : Array.isArray(subValue) ? (
                        <div className="pl-4 space-y-1">
                          {subValue.map((item, i) => (
                            <div key={i} className="text-gray-400 text-sm flex items-start gap-2">
                              <span className="text-cyan-400">→</span>
                              <span>{typeof item === 'string' ? item : JSON.stringify(item)}</span>
                            </div>
                          ))}
                        </div>
                      ) : typeof subValue === 'object' ? (
                        <div className="pl-4 space-y-2">
                          {Object.entries(subValue as object).map(([k, v]) => (
                            <div key={k} className="text-gray-400 text-sm">
                              <span className="text-cyan-400 font-mono">{k}:</span>{' '}
                              {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Header onNavigate={onNavigate} showNavigation={true} />

      <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-950 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">
              Centre de Ressources
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Documentation complète, guides pratiques et assistance pour utiliser Goroti
            </p>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher dans la documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
          {categories.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedCategory(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === id
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Documentation Complète & Détaillée</h2>
          <p className="text-gray-400 mb-8">
            Guides complets de démarrage jusqu'à la gestion de compte. Cliquez sur une section pour voir tous les détails.
          </p>

          <div className="space-y-4">
            {documentationSections
              .filter(section => selectedCategory === 'all' || section.category === selectedCategory)
              .map((section) => {
                const Icon = section.icon;
                const isExpanded = expandedSection === section.id;

                return (
                  <div key={section.id} className="bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                      className="w-full flex items-center justify-between p-6 hover:bg-gray-800/50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-900 rounded-lg">
                          <Icon className={`w-6 h-6 ${section.color}`} />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-1">{section.title}</h3>
                          <p className="text-gray-400 text-sm">
                            {typeof section.content === 'object' && 'description' in section.content
                              ? section.content.description
                              : 'Documentation complète disponible'}
                          </p>
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>

                    {isExpanded && (
                      <div className="px-6 pb-6 space-y-6 border-t border-gray-700 pt-6">
                        {renderDocContent(section.content)}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Articles & Guides Pratiques</h2>
          <div className="space-y-4">
            {filteredArticles.map((article, index) => (
              <div key={index} className="bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedArticle(expandedArticle === article.title ? null : article.title)}
                  className="w-full flex items-start gap-4 p-5 hover:bg-gray-800/50 transition-all text-left group"
                >
                  <div className="p-2.5 bg-gray-900 rounded-lg shrink-0 group-hover:bg-gray-800 transition-colors">
                    <article.icon className={`w-5 h-5 ${article.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold mb-1 group-hover:text-cyan-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {article.description}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-600 group-hover:text-cyan-400 shrink-0 transition-all ${
                      expandedArticle === article.title ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {expandedArticle === article.title && article.content && (
                  <div className="border-t border-gray-700 p-6 bg-gray-900/50">
                    {renderDocContent(article.content)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Blog Officiel</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {blogPosts.map((post, index) => (
              <div key={index} className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 hover:border-cyan-600/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                  <span className="px-2 py-1 bg-cyan-600/20 text-cyan-400 rounded">{post.category}</span>
                  <span>{post.date}</span>
                </div>
                <h3 className="text-white font-semibold mb-2">{post.title}</h3>
                <button className="text-cyan-400 text-sm hover:text-cyan-300 flex items-center gap-1">
                  Lire l'article <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">État de la Plateforme</h2>
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-white font-semibold">Tous les systèmes opérationnels</span>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { service: 'Streaming vidéo', status: 'operational' },
                { service: 'Upload de contenu', status: 'operational' },
                { service: 'Système de paiements', status: 'operational' },
                { service: 'Retraits créateurs', status: 'operational' },
                { service: 'Marketplace', status: 'operational' },
              ].map(({ service, status }) => (
                <div key={service} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                  <span className="text-gray-300">{service}</span>
                  <span className="flex items-center gap-2 text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Opérationnel
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('status')}
              className="mt-6 text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-2"
            >
              Voir l'historique complet <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Communauté Officielle</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { platform: 'X / Twitter', usage: 'Annonces rapides', icon: MessageSquare, color: 'text-sky-400' },
              { platform: 'Instagram', usage: 'Visuel & créateurs', icon: Activity, color: 'text-pink-400' },
              { platform: 'Discord', usage: 'Support communauté', icon: Users, color: 'text-indigo-400' },
              { platform: 'LinkedIn', usage: 'Corporate & B2B', icon: Briefcase, color: 'text-blue-400' },
            ].map(({ platform, usage, icon: Icon, color }) => (
              <div key={platform} className="bg-gray-800/30 border border-gray-700 rounded-xl p-5 hover:border-cyan-600/50 transition-colors cursor-pointer">
                <Icon className={`w-6 h-6 ${color} mb-3`} />
                <h3 className="text-white font-semibold mb-1">{platform}</h3>
                <p className="text-gray-400 text-sm">{usage}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-600/30 rounded-xl p-8 text-center">
            <HelpCircle className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-3">Besoin d'aide supplémentaire ?</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Notre équipe support est disponible pour répondre à vos questions
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => onNavigate('support')}
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors"
              >
                Contacter le Support
              </button>
              <button
                onClick={() => onNavigate('help')}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                Centre d'Aide
              </button>
            </div>
          </div>
        </section>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}

function Briefcase({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}
