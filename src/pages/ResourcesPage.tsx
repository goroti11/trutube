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
        duration: '3,5 secondes',
        phases: [
          {
            title: 'Phase 1: Logo Animé (0-2s)',
            details: [
              '0.0s: Écran noir avec dégradé',
              '0.1s: Lettre "G" apparaît (blanc)',
              '0.3s: Lettre "O" apparaît (rouge)',
              '0.5s: Lettre "R" apparaît (blanc)',
              '0.7s: Lettre "O" apparaît (rouge)',
              '0.9s: Lettre "T" apparaît (blanc)',
              '1.1s: Lettre "I" apparaît (rouge)',
              '1.4s: Effet glow rouge sur toutes les lettres',
              '2.0s: Baseline "LA VÉRITÉ AVANT TOUT"'
            ]
          },
          {
            title: 'Phase 2: Tagline (1.8-3.5s)',
            details: [
              '1.8s: "Votre plateforme vidéo authentique" (dégradé cyan→blanc→rouge)',
              '2.2s: "Créez, partagez, monétisez en toute transparence" (gris)'
            ]
          },
          {
            title: 'Phase 3: Indicateur (0-3.5s)',
            details: [
              '3 points animés: cyan, blanc, rouge',
              'Texte "CHARGEMENT..." en bas',
              'Animation bounce avec délais'
            ]
          }
        ],
        control: {
          title: 'Contrôler le SplashScreen',
          revoir: 'sessionStorage.removeItem("hasSeenSplash"); location.reload();',
          desactiver: 'Modifier showSplash à false dans App.tsx'
        }
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
        position: 'Fixe en haut, z-index: 40',
        composants: {
          logo: {
            position: 'Gauche',
            action: 'Retour accueil (/#home)',
            hover: 'Opacité 80%'
          },
          navigationIcons: [
            {
              icon: '🧭 Compass',
              tooltip: 'Explorer les univers',
              action: '/#universes',
              description: 'Parcourir les 15 univers thématiques'
            },
            {
              icon: '👥 Users',
              tooltip: 'Communautés',
              action: '/#community',
              description: 'Liste de toutes les communautés'
            },
            {
              icon: '⚙️ Settings',
              tooltip: 'Préférences de feed',
              action: '/#preferences',
              description: 'Personnaliser votre fil'
            },
            {
              icon: '✨ Sparkles',
              tooltip: 'Devenir créateur',
              action: '/#creator-setup',
              description: 'S\'inscrire comme créateur'
            },
            {
              icon: '⋮ More',
              tooltip: 'Plus de pages',
              type: 'Menu déroulant',
              items: ['À propos', 'Ressources', 'Carrières', 'Entreprise', 'Centre d\'aide', 'Support']
            }
          ],
          recherche: {
            placeholder: 'Rechercher vidéos, créateurs, communautés...',
            fonctionnalites: [
              'Recherche instantanée (debounced 300ms)',
              'Suggestions automatiques',
              'Historique de recherche',
              'Filtres avancés'
            ],
            raccourci: '/ (focus automatique)'
          },
          actionsUtilisateur: {
            upload: {
              visible: 'Si connecté',
              icon: '📤 Upload',
              action: '/#upload',
              raccourci: 'Alt+U'
            },
            avatar: {
              nonConnecte: 'Bouton "Connexion" → /#auth',
              connecte: 'Avatar + Badge → Menu utilisateur'
            }
          }
        },
        menuUtilisateur: {
          sections: [
            {
              nom: 'Profil',
              items: [
                'Mon profil (/#my-profile)',
                'Profil créateur enrichi (/#enhanced-profile)',
                'Paramètres (/#settings)'
              ]
            },
            {
              nom: 'Créateur',
              condition: 'Si créateur',
              items: [
                'Studio créateur (/#studio)',
                'Tableau de bord (/#dashboard)',
                'Mes chaînes (/#my-channels)',
                'Streaming live (/#live-streaming)'
              ]
            },
            {
              nom: 'Monétisation',
              items: [
                'Portefeuille TruCoin (/#trucoin-wallet)',
                'Abonnement Premium (/#premium)',
                'Programme partenaire (/#partner-program)',
                'Parrainage (/#referral)'
              ]
            },
            {
              nom: 'Contenu',
              items: [
                'Historique (/#watch-history)',
                'Vidéos sauvegardées (/#saved-videos)',
                'Mes abonnés (/#subscribers)'
              ]
            },
            {
              nom: 'Sécurité',
              items: [
                'Sécurité (/#security-dashboard)',
                'Apparence (/#appearance-settings)'
              ]
            }
          ],
          footer: 'Déconnexion'
        }
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
    },
    {
      category: 'creators',
      title: 'Vendre un album ou contenu premium',
      description: 'Configuration de prix et droits d\'accès',
      icon: Music,
      color: 'text-blue-400',
    },
    {
      category: 'creators',
      title: 'Configurer les royalties partagés',
      description: 'Splits automatiques pour collaborations',
      icon: TrendingUp,
      color: 'text-blue-400',
    },
    {
      category: 'creators',
      title: 'Stratégie de tarification',
      description: 'Définir les prix optimaux pour votre contenu',
      icon: DollarSign,
      color: 'text-blue-400',
    },
    {
      category: 'creators',
      title: 'Utiliser les Shorts',
      description: 'Format court pour promotion et engagement',
      icon: PlayCircle,
      color: 'text-blue-400',
    },
    {
      category: 'monetization',
      title: 'Acheter du contenu',
      description: 'Paiements sécurisés et accès immédiat',
      icon: ShoppingBag,
      color: 'text-green-400',
    },
    {
      category: 'monetization',
      title: 'Utiliser TruCoin',
      description: 'Wallet, recharge et conversion',
      icon: Wallet,
      color: 'text-green-400',
    },
    {
      category: 'monetization',
      title: 'Retrait de revenus',
      description: 'Seuils, délais et méthodes de paiement',
      icon: DollarSign,
      color: 'text-green-400',
    },
    {
      category: 'monetization',
      title: 'Délais bancaires',
      description: 'Comprendre les délais de virement',
      icon: AlertCircle,
      color: 'text-green-400',
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
