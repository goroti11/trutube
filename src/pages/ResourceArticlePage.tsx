import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Footer } from '../components/Footer';
import {
  ArrowLeft, Clock, Eye, Bookmark, Share2, ThumbsUp, ThumbsDown,
  CheckCircle, AlertCircle, Lightbulb, FileText, Video, Download,
  ExternalLink, ChevronRight, User, Calendar
} from 'lucide-react';
import { resourceService, Resource } from '../services/resourceService';

interface ResourceArticlePageProps {
  onNavigate: (page: string) => void;
  resourceSlug?: string;
}

const articleContent: Record<string, any> = {
  'quick-start-guide': {
    sections: [
      {
        title: 'Bienvenue sur TruTube',
        content: `TruTube est une plateforme de partage vidéo qui valorise l'authenticité et récompense les vrais créateurs.
        Ce guide vous accompagnera dans vos premiers pas sur la plateforme.`,
        type: 'intro'
      },
      {
        title: '1. Créer votre compte',
        content: `Pour commencer votre aventure sur TruTube, vous devez d'abord créer un compte.`,
        steps: [
          {
            title: 'Accéder à la page d\'inscription',
            description: 'Cliquez sur "Connexion" en haut à droite de la page d\'accueil, puis sélectionnez "Créer un compte".'
          },
          {
            title: 'Remplir vos informations',
            description: 'Entrez votre adresse email, choisissez un nom d\'utilisateur unique et créez un mot de passe sécurisé (minimum 8 caractères avec majuscules, minuscules, chiffres et caractères spéciaux).'
          },
          {
            title: 'Valider votre email',
            description: 'Vous recevrez un email de confirmation. Cliquez sur le lien pour activer votre compte.'
          },
          {
            title: 'Création automatique de votre chaîne',
            description: 'Dès votre inscription validée, une chaîne est automatiquement créée avec votre nom d\'utilisateur. Vous pouvez commencer à publier immédiatement!'
          }
        ],
        tips: [
          'Choisissez un nom d\'utilisateur professionnel si vous envisagez de devenir créateur',
          'Utilisez une adresse email que vous consultez régulièrement',
          'Activez l\'authentification à deux facteurs pour plus de sécurité'
        ]
      },
      {
        title: '2. Configurer votre profil',
        content: 'Un profil bien configuré attire plus d\'abonnés et renforce votre crédibilité.',
        steps: [
          {
            title: 'Photo de profil',
            description: 'Téléchargez une photo claire (minimum 400x400px, format JPG ou PNG). Utilisez votre visage ou votre logo si vous êtes une marque.'
          },
          {
            title: 'Bannière',
            description: 'Ajoutez une bannière personnalisée (2560x1440px recommandé) qui reflète votre identité ou votre contenu.'
          },
          {
            title: 'Biographie',
            description: 'Rédigez une bio captivante de 150 caractères maximum. Expliquez qui vous êtes et quel type de contenu vous créez.'
          },
          {
            title: 'Liens sociaux',
            description: 'Ajoutez vos comptes Instagram, Twitter, TikTok, etc. pour développer votre présence multiplateforme.'
          }
        ]
      },
      {
        title: '3. Explorer le contenu',
        content: 'Découvrez les 15 univers thématiques de TruTube.',
        steps: [
          {
            title: 'Page d\'accueil',
            description: 'Votre feed personnalisé selon vos intérêts et abonnements.'
          },
          {
            title: 'Explorer les univers',
            description: 'Cliquez sur l\'icône Compass pour découvrir les 15 univers: Gaming, Musique, Éducation, Tech, Sport, etc.'
          },
          {
            title: 'Recherche',
            description: 'Utilisez la barre de recherche (raccourci: /) pour trouver des vidéos, créateurs ou communautés.'
          }
        ]
      },
      {
        title: '4. Interagir avec le contenu',
        content: 'Engagez-vous avec la communauté TruTube.',
        actions: [
          { icon: 'ThumbsUp', label: 'Like', description: 'Soutenez les créateurs que vous aimez' },
          { icon: 'MessageCircle', label: 'Commenter', description: 'Partagez votre avis constructif' },
          { icon: 'Share2', label: 'Partager', description: 'Diffusez le contenu que vous adorez' },
          { icon: 'Bookmark', label: 'Sauvegarder', description: 'Retrouvez facilement vos vidéos préférées' }
        ]
      },
      {
        title: '5. S\'abonner à des créateurs',
        content: 'Suivez vos créateurs préférés pour ne rien manquer.',
        steps: [
          {
            title: 'Trouver des créateurs',
            description: 'Explorez les recommandations, les univers ou utilisez la recherche.'
          },
          {
            title: 'Cliquer sur "S\'abonner"',
            description: 'Le bouton apparaît sur chaque page de chaîne et sous les vidéos.'
          },
          {
            title: 'Activer les notifications',
            description: 'Cliquez sur la cloche pour recevoir des alertes lors de nouvelles publications.'
          }
        ]
      }
    ],
    relatedArticles: ['setup-profile', 'video-seo', 'optimize-thumbnails'],
    downloadable: {
      title: 'Guide PDF complet',
      description: 'Téléchargez le guide complet au format PDF (2.5 MB)',
      url: '#download-quick-start'
    }
  },
  'optimize-thumbnails': {
    sections: [
      {
        title: 'L\'art de la miniature',
        content: 'Une bonne miniature peut augmenter vos vues de 300%. C\'est souvent la première chose que les spectateurs voient.',
        type: 'intro'
      },
      {
        title: 'Principes de base',
        content: 'Les fondamentaux pour créer des miniatures efficaces.',
        principles: [
          {
            title: 'Résolution et format',
            description: '1280x720px minimum (16:9), format JPG ou PNG, poids maximum 2MB',
            importance: 'critical'
          },
          {
            title: 'Lisibilité',
            description: 'Testez votre miniature en petit format. Si le texte n\'est pas lisible, simplifiez.',
            importance: 'high'
          },
          {
            title: 'Contraste',
            description: 'Utilisez des couleurs contrastées pour que votre miniature se démarque dans le feed.',
            importance: 'high'
          },
          {
            title: 'Cohérence',
            description: 'Créez un style reconnaissable pour votre chaîne (police, couleurs, layout).',
            importance: 'medium'
          }
        ]
      },
      {
        title: 'Éléments à inclure',
        content: 'Ce qui fonctionne le mieux selon nos études.',
        elements: [
          {
            element: 'Visage expressif',
            impact: '+35% CTR',
            description: 'Les expressions émotionnelles (surprise, joie, choc) captent l\'attention',
            examples: ['Bouche ouverte', 'Yeux écarquillés', 'Sourire authentique']
          },
          {
            element: 'Texte court',
            impact: '+28% CTR',
            description: '3-5 mots maximum en GROS caractères',
            examples: ['INCROYABLE!', 'ÇA MARCHE', 'ASTUCE #1']
          },
          {
            element: 'Couleurs vives',
            impact: '+22% CTR',
            description: 'Jaune, rouge, cyan, vert: couleurs qui attirent l\'œil',
            examples: ['#FFFF00', '#FF0000', '#00FFFF', '#00FF00']
          },
          {
            element: 'Flèches/Cercles',
            impact: '+18% CTR',
            description: 'Guides visuels pour diriger l\'attention',
            examples: ['Flèche pointant élément clé', 'Cercle autour sujet', 'Zoom sur détail']
          }
        ]
      },
      {
        title: 'Erreurs à éviter',
        content: 'Les pièges communs qui tuent votre taux de clic.',
        mistakes: [
          {
            mistake: 'Clickbait trompeur',
            consequence: 'Perte de confiance + désabonnements massifs',
            solution: 'Soyez honnête. La miniature doit refléter le contenu.'
          },
          {
            mistake: 'Trop de texte',
            consequence: 'Illisible sur mobile (70% du trafic)',
            solution: 'Maximum 5 mots en très gros caractères'
          },
          {
            mistake: 'Basse résolution',
            consequence: 'Aspect amateur, image floue',
            solution: 'Minimum 1280x720px, exporté en haute qualité'
          },
          {
            mistake: 'Pas de test',
            consequence: 'Vous ne savez pas ce qui fonctionne',
            solution: 'Testez A/B différentes miniatures sur vos vidéos'
          }
        ]
      },
      {
        title: 'Outils recommandés',
        content: 'Logiciels pour créer des miniatures professionnelles.',
        tools: [
          {
            name: 'Canva',
            type: 'Gratuit + Payant',
            pros: ['Templates prêts', 'Facile pour débutants', 'Banque d\'images'],
            cons: ['Limité en version gratuite', 'Parfois générique'],
            url: 'https://canva.com'
          },
          {
            name: 'Photoshop',
            type: 'Payant (Adobe CC)',
            pros: ['Contrôle total', 'Qualité professionnelle', 'Outils avancés'],
            cons: ['Courbe d\'apprentissage', 'Prix élevé'],
            url: 'https://adobe.com/photoshop'
          },
          {
            name: 'GIMP',
            type: 'Gratuit (Open Source)',
            pros: ['100% gratuit', 'Puissant', 'Communauté active'],
            cons: ['Interface moins intuitive', 'Moins de templates'],
            url: 'https://gimp.org'
          },
          {
            name: 'Figma',
            type: 'Gratuit + Payant',
            pros: ['Collaboratif', 'Dans le navigateur', 'Templates communautaires'],
            cons: ['Nécessite connexion internet', 'Moins d\'effets photo'],
            url: 'https://figma.com'
          }
        ]
      },
      {
        title: 'Checklist avant publication',
        content: 'Vérifiez ces points avant de valider votre miniature.',
        checklist: [
          'Résolution minimum 1280x720px',
          'Format 16:9 respecté',
          'Texte lisible en petit format',
          'Contraste suffisant',
          'Pas de contenu trompeur',
          'Style cohérent avec ma chaîne',
          'Visage bien visible (si présent)',
          'Couleurs qui se démarquent',
          'Testé sur mobile',
          'Pas de violation copyright images'
        ]
      }
    ],
    relatedArticles: ['video-seo', 'quick-start-guide', 'build-engaged-community'],
    videoTutorial: {
      title: 'Tutoriel vidéo: Créer des miniatures pro en 10 minutes',
      duration: '12:34',
      thumbnail: 'https://via.placeholder.com/640x360',
      url: '#video-thumbnail-tutorial'
    }
  },
  'video-seo': {
    sections: [
      {
        title: 'SEO Vidéo 101',
        content: 'Le référencement vidéo est crucial pour être découvert sur TruTube. 50% des vues proviennent de la recherche et des recommandations.',
        type: 'intro',
        stats: [
          { label: 'Vues depuis recherche', value: '35%' },
          { label: 'Vues recommandations', value: '45%' },
          { label: 'Vues abonnés', value: '15%' },
          { label: 'Vues externes', value: '5%' }
        ]
      },
      {
        title: '1. Optimiser le titre',
        content: 'Le titre est l\'élément SEO le plus important.',
        guidelines: [
          {
            rule: 'Longueur optimale',
            detail: '50-60 caractères (s\'affiche complètement)',
            examples: {
              good: ['Comment créer une miniature parfaite en 2026', 'Astuce SEO #1: Titres qui convertissent'],
              bad: ['Vidéo', 'Ma nouvelle vidéo sur les miniatures que j\'ai fait hier soir']
            }
          },
          {
            rule: 'Mot-clé principal',
            detail: 'Placez-le au début du titre',
            examples: {
              good: ['Tutoriel Photoshop: Miniatures YouTube Pro', 'SEO YouTube: Guide Complet 2026'],
              bad: ['Aujourd\'hui je vous montre du SEO', 'Dans cette vidéo: tutoriel Photoshop']
            }
          },
          {
            rule: 'Chiffres et symboles',
            detail: 'Attirent l\'attention et structurent',
            examples: {
              good: ['5 Astuces SEO qui DOUBLENT vos vues', '2026: Le Guide ULTIME du Streaming'],
              bad: ['Astuces SEO', 'Guide du streaming']
            }
          },
          {
            rule: 'Mots puissants',
            detail: 'Créent l\'urgence et l\'émotion',
            powerWords: ['INCROYABLE', 'ULTIME', 'SECRET', 'RÉVÉLÉ', 'FACILE', 'RAPIDE', 'GRATUIT', 'NOUVEAU']
          }
        ]
      },
      {
        title: '2. Description stratégique',
        content: 'La description aide l\'algorithme à comprendre votre contenu.',
        structure: [
          {
            section: 'Premier paragraphe (150 premiers caractères)',
            purpose: 'Visible sans "Voir plus", doit inciter au clic',
            example: 'Découvrez comment le SEO vidéo peut multiplier vos vues par 10. Dans ce tutoriel, je vous révèle mes 3 techniques secrètes utilisées par les plus gros créateurs.'
          },
          {
            section: 'Corps principal (500-1000 mots)',
            purpose: 'Contexte détaillé avec mots-clés naturels',
            elements: [
              'Résumé du contenu vidéo',
              'Chapitres avec timestamps',
              'Mots-clés secondaires naturellement intégrés',
              'Appel à l\'action (like, abonnement, commentaire)'
            ]
          },
          {
            section: 'Fin de description',
            purpose: 'Informations complémentaires',
            elements: [
              'Liens ressources mentionnées',
              'Réseaux sociaux',
              'Liens parrainage/affiliation',
              'Hashtags (3-5 maximum)'
            ]
          }
        ]
      },
      {
        title: '3. Tags intelligents',
        content: 'Les tags aident à catégoriser votre vidéo.',
        strategy: [
          {
            type: 'Tags génériques',
            count: '2-3 tags',
            examples: ['tutoriel', 'guide', 'débutant'],
            purpose: 'Contexte large'
          },
          {
            type: 'Tags spécifiques',
            count: '5-7 tags',
            examples: ['seo youtube 2026', 'optimisation vidéo', 'référencement trutube'],
            purpose: 'Ciblage précis'
          },
          {
            type: 'Tags longue traîne',
            count: '3-5 tags',
            examples: ['comment optimiser titre youtube', 'augmenter vues youtube gratuitement'],
            purpose: 'Requêtes spécifiques faible concurrence'
          },
          {
            type: 'Tags marque',
            count: '1-2 tags',
            examples: ['votre nom', 'nom de votre chaîne'],
            purpose: 'Reconnaissance marque'
          }
        ],
        tips: [
          'Total: 15-20 tags maximum',
          'Évitez tag stuffing (spam de tags)',
          'Utilisez des variations (singulier/pluriel)',
          'Analysez les tags des concurrents qui marchent'
        ]
      },
      {
        title: '4. Catégorie et univers',
        content: 'Choisissez la bonne catégorie pour être découvert.',
        categories: [
          { name: 'Gaming', when: 'Jeux vidéo, esports, reviews jeux' },
          { name: 'Musique', when: 'Clips, covers, tutoriels instruments' },
          { name: 'Éducation', when: 'Tutoriels, cours, explications' },
          { name: 'Tech', when: 'Reviews produits, tutoriels tech, actualité tech' },
          { name: 'Sport', when: 'Highlights, analyses, fitness' },
          { name: 'Divertissement', when: 'Vlogs, sketchs, humour' }
        ]
      },
      {
        title: '5. Engagement initial',
        content: 'Les premières heures sont critiques pour l\'algorithme.',
        actions: [
          {
            action: 'Partager immédiatement',
            where: ['Réseaux sociaux', 'Communauté Discord/Telegram', 'Email newsletter'],
            impact: 'Boost initial de vues = meilleur référencement'
          },
          {
            action: 'Épingler un commentaire',
            content: 'Posez une question pour encourager les commentaires',
            impact: 'Plus de commentaires = signal positif algorithme'
          },
          {
            action: 'Répondre aux commentaires',
            timing: 'Dans les 2 premières heures',
            impact: 'Augmente le taux d\'engagement'
          },
          {
            action: 'Créer un Short',
            content: 'Extrait de 30-60s de votre vidéo',
            impact: 'Génère du trafic vers la vidéo longue'
          }
        ]
      }
    ],
    relatedArticles: ['optimize-thumbnails', 'build-engaged-community', 'maximize-ad-revenue']
  }
};

export default function ResourceArticlePage({ onNavigate, resourceSlug }: ResourceArticlePageProps) {
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const slug = resourceSlug || 'quick-start-guide';
  const content = articleContent[slug];

  useEffect(() => {
    loadResource();
  }, [slug]);

  const loadResource = async () => {
    try {
      setLoading(true);
      const data = await resourceService.getResourceBySlug(slug);
      if (data) {
        setResource(data);
        await resourceService.incrementResourceViews(slug);
      }
    } catch (error) {
      console.error('Failed to load resource:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (!resource) return;
    try {
      if (isBookmarked) {
        await resourceService.removeBookmark(resource.id);
      } else {
        await resourceService.bookmarkResource(resource.id);
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Bookmark failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  if (!resource || !content) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Header onNavigate={onNavigate} showNavigation={true} />
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Article introuvable</h1>
          <p className="text-gray-400 mb-6">Cet article n'existe pas ou a été supprimé.</p>
          <button
            onClick={() => onNavigate('resources')}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors"
          >
            Retour aux ressources
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header onNavigate={onNavigate} showNavigation={true} />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <button
          onClick={() => onNavigate('resources')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux ressources
        </button>

        <article className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-8 border-b border-gray-800">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {resource.category && (
                <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-400 text-sm">
                  {resource.category.name}
                </span>
              )}
              {resource.difficulty && (
                <span className={`px-3 py-1 rounded-full text-sm ${
                  resource.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                  resource.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                  'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {resource.difficulty === 'beginner' && 'Débutant'}
                  {resource.difficulty === 'intermediate' && 'Intermédiaire'}
                  {resource.difficulty === 'advanced' && 'Avancé'}
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {resource.title}
            </h1>

            {resource.description && (
              <p className="text-xl text-gray-300 mb-6">
                {resource.description}
              </p>
            )}

            <div className="flex items-center gap-6 text-sm text-gray-400 mb-6">
              {resource.estimated_time && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {resource.estimated_time} min
                </div>
              )}
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {resource.views.toLocaleString()} vues
              </div>
              {resource.published_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(resource.published_at).toLocaleDateString('fr-FR')}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleBookmark}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isBookmarked
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                {isBookmarked ? 'Enregistré' : 'Enregistrer'}
              </button>
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-lg font-medium transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Partager
              </button>
            </div>
          </div>

          <div className="p-8 prose prose-invert max-w-none">
            {content.sections.map((section: any, index: number) => (
              <div key={index} className="mb-12">
                {section.type === 'intro' && (
                  <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 mb-8">
                    <div className="flex items-start gap-4">
                      <Lightbulb className="w-6 h-6 text-cyan-400 shrink-0 mt-1" />
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-3">{section.title}</h2>
                        <p className="text-gray-300 leading-relaxed">{section.content}</p>
                        {section.stats && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            {section.stats.map((stat: any, i: number) => (
                              <div key={i} className="text-center">
                                <div className="text-2xl font-bold text-cyan-400">{stat.value}</div>
                                <div className="text-sm text-gray-400">{stat.label}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {section.type !== 'intro' && (
                  <>
                    <h2 className="text-2xl font-bold text-white mb-4">{section.title}</h2>
                    <p className="text-gray-300 mb-6 leading-relaxed">{section.content}</p>

                    {section.steps && (
                      <div className="space-y-4">
                        {section.steps.map((step: any, i: number) => (
                          <div key={i} className="flex gap-4 p-4 bg-gray-800/50 rounded-lg">
                            <div className="flex items-center justify-center w-8 h-8 bg-cyan-600 rounded-full text-white font-bold shrink-0">
                              {i + 1}
                            </div>
                            <div>
                              <h3 className="font-semibold text-white mb-1">{step.title}</h3>
                              <p className="text-gray-400 text-sm">{step.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.tips && (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5 mt-6">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-green-400 mb-2">Conseils pratiques</h4>
                            <ul className="space-y-2">
                              {section.tips.map((tip: string, i: number) => (
                                <li key={i} className="text-gray-300 text-sm">• {tip}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {section.actions && (
                      <div className="grid md:grid-cols-2 gap-4 mt-6">
                        {section.actions.map((action: any, i: number) => (
                          <div key={i} className="p-4 bg-gray-800/50 rounded-lg">
                            <div className="font-semibold text-white mb-1">{action.label}</div>
                            <p className="text-gray-400 text-sm">{action.description}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.principles && (
                      <div className="space-y-3 mt-6">
                        {section.principles.map((principle: any, i: number) => (
                          <div key={i} className="p-4 bg-gray-800/50 border-l-4 border-cyan-500 rounded-r-lg">
                            <h4 className="font-semibold text-white mb-1">{principle.title}</h4>
                            <p className="text-gray-400 text-sm">{principle.description}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.elements && (
                      <div className="space-y-4 mt-6">
                        {section.elements.map((elem: any, i: number) => (
                          <div key={i} className="p-5 bg-gray-800/50 rounded-xl">
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="font-semibold text-white">{elem.element}</h4>
                              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                                {elem.impact}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm mb-3">{elem.description}</p>
                            {elem.examples && (
                              <div className="flex flex-wrap gap-2">
                                {elem.examples.map((ex: string, j: number) => (
                                  <span key={j} className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                                    {ex}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {section.mistakes && (
                      <div className="space-y-3 mt-6">
                        {section.mistakes.map((mistake: any, i: number) => (
                          <div key={i} className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <div className="flex items-start gap-3">
                              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-red-400 mb-1">{mistake.mistake}</h4>
                                <p className="text-gray-400 text-sm mb-2">Conséquence: {mistake.consequence}</p>
                                <p className="text-green-400 text-sm">✓ Solution: {mistake.solution}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.tools && (
                      <div className="grid md:grid-cols-2 gap-4 mt-6">
                        {section.tools.map((tool: any, i: number) => (
                          <div key={i} className="p-5 bg-gray-800/50 border border-gray-700 rounded-xl">
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="font-semibold text-white">{tool.name}</h4>
                              <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs">
                                {tool.type}
                              </span>
                            </div>
                            <div className="space-y-2 mb-3">
                              <div>
                                <div className="text-xs text-green-400 mb-1">Avantages:</div>
                                {tool.pros.map((pro: string, j: number) => (
                                  <div key={j} className="text-gray-400 text-sm">• {pro}</div>
                                ))}
                              </div>
                              <div>
                                <div className="text-xs text-red-400 mb-1">Inconvénients:</div>
                                {tool.cons.map((con: string, j: number) => (
                                  <div key={j} className="text-gray-400 text-sm">• {con}</div>
                                ))}
                              </div>
                            </div>
                            <a
                              href={tool.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm"
                            >
                              Visiter <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.checklist && (
                      <div className="bg-gray-800/50 rounded-xl p-5 mt-6">
                        <h4 className="font-semibold text-white mb-4">Points à vérifier</h4>
                        <div className="space-y-2">
                          {section.checklist.map((item: string, i: number) => (
                            <label key={i} className="flex items-start gap-3 cursor-pointer hover:bg-gray-700/30 p-2 rounded">
                              <input type="checkbox" className="mt-1" />
                              <span className="text-gray-300 text-sm">{item}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {section.guidelines && (
                      <div className="space-y-6 mt-6">
                        {section.guidelines.map((guideline: any, i: number) => (
                          <div key={i} className="bg-gray-800/50 rounded-xl p-5">
                            <h4 className="font-semibold text-white mb-2">{guideline.rule}</h4>
                            <p className="text-gray-400 text-sm mb-4">{guideline.detail}</p>
                            {guideline.examples && (
                              <div className="space-y-3">
                                <div>
                                  <div className="text-xs text-green-400 mb-2 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" /> Bon
                                  </div>
                                  {guideline.examples.good.map((ex: string, j: number) => (
                                    <div key={j} className="p-2 bg-green-500/10 border border-green-500/30 rounded text-gray-300 text-sm mb-2">
                                      {ex}
                                    </div>
                                  ))}
                                </div>
                                <div>
                                  <div className="text-xs text-red-400 mb-2 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> Mauvais
                                  </div>
                                  {guideline.examples.bad.map((ex: string, j: number) => (
                                    <div key={j} className="p-2 bg-red-500/10 border border-red-500/30 rounded text-gray-300 text-sm mb-2">
                                      {ex}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {guideline.powerWords && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {guideline.powerWords.map((word: string, j: number) => (
                                  <span key={j} className="px-3 py-1 bg-cyan-600 text-white rounded font-medium text-sm">
                                    {word}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {section.structure && (
                      <div className="space-y-4 mt-6">
                        {section.structure.map((struct: any, i: number) => (
                          <div key={i} className="p-5 bg-gray-800/50 rounded-xl">
                            <h4 className="font-semibold text-cyan-400 mb-2">{struct.section}</h4>
                            <p className="text-gray-400 text-sm mb-3">
                              <strong className="text-white">Objectif:</strong> {struct.purpose}
                            </p>
                            {struct.example && (
                              <div className="p-3 bg-gray-900 rounded-lg border-l-4 border-cyan-500">
                                <div className="text-xs text-gray-500 mb-1">Exemple:</div>
                                <p className="text-gray-300 text-sm italic">{struct.example}</p>
                              </div>
                            )}
                            {struct.elements && (
                              <ul className="space-y-1 mt-3">
                                {struct.elements.map((elem: string, j: number) => (
                                  <li key={j} className="text-gray-400 text-sm flex items-start gap-2">
                                    <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                                    {elem}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {section.strategy && (
                      <div className="grid md:grid-cols-2 gap-4 mt-6">
                        {section.strategy.map((strat: any, i: number) => (
                          <div key={i} className="p-5 bg-gray-800/50 rounded-xl">
                            <h4 className="font-semibold text-white mb-2">{strat.type}</h4>
                            <div className="text-cyan-400 text-sm mb-2">{strat.count}</div>
                            <p className="text-gray-400 text-xs mb-3">{strat.purpose}</p>
                            <div className="flex flex-wrap gap-2">
                              {strat.examples.map((ex: string, j: number) => (
                                <span key={j} className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                                  {ex}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.categories && (
                      <div className="space-y-2 mt-6">
                        {section.categories.map((cat: any, i: number) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                            <div className="w-20 font-semibold text-cyan-400 text-sm shrink-0">{cat.name}</div>
                            <div className="text-gray-400 text-sm">{cat.when}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.actions && (
                      <div className="space-y-4 mt-6">
                        {section.actions.map((action: any, i: number) => (
                          <div key={i} className="p-5 bg-gray-800/50 rounded-xl">
                            <h4 className="font-semibold text-white mb-2">{action.action}</h4>
                            {action.where && (
                              <div className="text-gray-400 text-sm mb-2">
                                Où: {action.where.join(', ')}
                              </div>
                            )}
                            {action.content && (
                              <div className="text-gray-400 text-sm mb-2">{action.content}</div>
                            )}
                            {action.timing && (
                              <div className="text-gray-400 text-sm mb-2">
                                Quand: {action.timing}
                              </div>
                            )}
                            <div className="text-green-400 text-sm flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                              <span>Impact: {action.impact}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}

            {content.downloadable && (
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-6 mt-8">
                <div className="flex items-start gap-4">
                  <Download className="w-6 h-6 text-cyan-400 shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{content.downloadable.title}</h3>
                    <p className="text-gray-400 text-sm mb-3">{content.downloadable.description}</p>
                    <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors">
                      Télécharger
                    </button>
                  </div>
                </div>
              </div>
            )}

            {content.videoTutorial && (
              <div className="bg-gray-800/50 rounded-xl p-6 mt-8">
                <div className="flex items-start gap-4">
                  <Video className="w-6 h-6 text-purple-400 shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{content.videoTutorial.title}</h3>
                    <p className="text-gray-400 text-sm mb-3">Durée: {content.videoTutorial.duration}</p>
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
                      Regarder la vidéo
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-8 border-t border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-white">Cet article vous a-t-il été utile ?</h3>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  Oui ({resource.helpful_count})
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors">
                  <ThumbsDown className="w-4 h-4" />
                  Non ({resource.not_helpful_count})
                </button>
              </div>
            </div>

            {content.relatedArticles && content.relatedArticles.length > 0 && (
              <div>
                <h3 className="font-semibold text-white mb-4">Articles connexes</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {content.relatedArticles.map((slug: string) => (
                    <button
                      key={slug}
                      onClick={() => window.location.hash = `resource/${slug}`}
                      className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-cyan-600/50 transition-all text-left"
                    >
                      <div className="flex items-center gap-2 text-cyan-400 text-sm">
                        <FileText className="w-4 h-4" />
                        Article
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
