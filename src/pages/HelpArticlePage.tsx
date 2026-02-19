import { useState } from 'react';
import Header from '../components/Header';
import { Footer } from '../components/Footer';
import {
  ArrowLeft, ThumbsUp, ThumbsDown, Share2, Bookmark, Search,
  ChevronRight, Clock, User, CheckCircle, AlertCircle, Info,
  PlayCircle, FileText, Video, MessageSquare
} from 'lucide-react';

interface HelpArticlePageProps {
  onNavigate: (page: string) => void;
  articleId?: string;
}

interface Article {
  id: string;
  category: string;
  title: string;
  lastUpdated: string;
  readTime: string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  sections: {
    title: string;
    content: string[];
    tips?: string[];
    warning?: string;
    steps?: { title: string; description: string }[];
    image?: string;
  }[];
  relatedArticles: string[];
  faqs: { q: string; a: string }[];
}

const articles: Record<string, Article> = {
  'create-account': {
    id: 'create-account',
    category: 'Démarrage',
    title: 'Créer un compte Goroti',
    lastUpdated: '15 Janvier 2026',
    readTime: '5 min',
    difficulty: 'Débutant',
    sections: [
      {
        title: 'Introduction',
        content: [
          'Bienvenue sur Goroti ! Créer un compte est rapide et gratuit. Vous aurez accès à tout le contenu gratuit de la plateforme, pourrez suivre vos créateurs préférés et interagir avec la communauté.',
          'Un compte Goroti vous permet également de sauvegarder votre historique de visionnage, créer des playlists personnalisées et gérer vos préférences de contenu.',
        ],
      },
      {
        title: 'Étapes de création',
        steps: [
          {
            title: 'Accéder à la page d\'inscription',
            description: 'Cliquez sur "S\'inscrire" en haut à droite de n\'importe quelle page Goroti. Vous pouvez également accéder directement à la page d\'inscription via le lien dans le footer.',
          },
          {
            title: 'Choisir votre méthode d\'inscription',
            description: 'Vous pouvez vous inscrire avec votre adresse email ou utiliser l\'authentification rapide via Google. L\'inscription par email vous donne un contrôle total sur votre compte.',
          },
          {
            title: 'Remplir vos informations',
            description: 'Entrez votre adresse email, créez un mot de passe sécurisé (minimum 8 caractères, incluant majuscules, minuscules et chiffres), et choisissez votre nom d\'utilisateur unique.',
          },
          {
            title: 'Accepter les conditions',
            description: 'Lisez et acceptez les Conditions d\'Utilisation et la Politique de Confidentialité. Ces documents expliquent vos droits et nos engagements.',
          },
          {
            title: 'Vérifier votre email',
            description: 'Un email de vérification sera envoyé à votre adresse. Cliquez sur le lien dans l\'email pour activer votre compte. Ce lien est valable 24 heures.',
          },
        ],
      },
      {
        title: 'Sécurité du compte',
        content: [
          'Votre sécurité est notre priorité. Nous utilisons un chiffrement de niveau bancaire pour protéger vos données personnelles.',
          'Nous ne partageons jamais vos informations avec des tiers sans votre consentement explicite.',
        ],
        tips: [
          'Utilisez un mot de passe unique que vous n\'utilisez sur aucun autre site',
          'Activez l\'authentification à deux facteurs dès que possible',
          'Ne partagez jamais votre mot de passe, même avec le support Goroti',
          'Vérifiez régulièrement les appareils connectés à votre compte',
        ],
      },
      {
        title: 'Personnalisation du profil',
        content: [
          'Une fois votre compte créé, prenez quelques minutes pour personnaliser votre profil. Ajoutez une photo de profil, une bio courte, et sélectionnez vos centres d\'intérêt.',
          'Ces informations nous aideront à vous recommander du contenu pertinent et permettront aux créateurs de mieux connaître leur audience.',
        ],
      },
      {
        title: 'Prochaines étapes',
        content: [
          'Maintenant que votre compte est créé, explorez la plateforme ! Commencez par parcourir les différents univers thématiques, suivez quelques créateurs qui vous intéressent, et n\'hésitez pas à interagir en commentant et en aimant les vidéos.',
        ],
      },
    ],
    relatedArticles: ['first-channel', 'kyc-verification', 'security-settings'],
    faqs: [
      {
        q: 'Puis-je créer plusieurs comptes ?',
        a: 'Non, les Conditions d\'Utilisation de Goroti autorisent un seul compte par personne. Les comptes multiples peuvent être suspendus.',
      },
      {
        q: 'Mon email de vérification n\'est pas arrivé',
        a: 'Vérifiez votre dossier spam. Si vous ne trouvez pas l\'email après 10 minutes, cliquez sur "Renvoyer l\'email de vérification" sur la page de connexion.',
      },
      {
        q: 'Puis-je changer mon nom d\'utilisateur plus tard ?',
        a: 'Oui, vous pouvez modifier votre nom d\'utilisateur une fois tous les 30 jours dans les paramètres de votre compte.',
      },
      {
        q: 'Mes données sont-elles sécurisées ?',
        a: 'Absolument. Nous utilisons un chiffrement SSL/TLS pour toutes les communications et stockons vos données de manière sécurisée conformément au RGPD.',
      },
    ],
  },
  'first-video-upload': {
    id: 'first-video-upload',
    category: 'Créateurs',
    title: 'Publier votre première vidéo',
    lastUpdated: '18 Janvier 2026',
    readTime: '8 min',
    difficulty: 'Intermédiaire',
    sections: [
      {
        title: 'Avant de commencer',
        content: [
          'Pour publier des vidéos sur Goroti, vous devez avoir créé une chaîne. Si ce n\'est pas déjà fait, suivez notre guide "Créer votre première chaîne".',
          'Assurez-vous d\'avoir les droits sur tout le contenu de votre vidéo : images, musique, clips vidéo. Goroti applique strictement les règles de copyright.',
        ],
        warning: 'L\'upload de contenu dont vous ne détenez pas les droits peut entraîner la suspension de votre compte.',
      },
      {
        title: 'Formats vidéo supportés',
        content: [
          'Goroti accepte la plupart des formats vidéo modernes. Voici les formats recommandés pour une qualité optimale :',
        ],
        tips: [
          'MP4 (H.264/H.265) - Format recommandé pour la compatibilité maximale',
          'WebM (VP9) - Excellent pour la qualité et la taille de fichier',
          'MOV (H.264) - Format natif pour les utilisateurs Mac',
          'AVI - Supporté mais moins recommandé (fichiers plus lourds)',
        ],
      },
      {
        title: 'Spécifications techniques recommandées',
        content: [
          'Pour garantir la meilleure qualité de lecture sur tous les appareils, suivez ces recommandations :',
        ],
        steps: [
          {
            title: 'Résolution',
            description: 'Minimum 720p (1280x720). Idéalement 1080p (1920x1080) ou 4K (3840x2160) pour le contenu premium.',
          },
          {
            title: 'Ratio d\'aspect',
            description: '16:9 pour les vidéos standard, 9:16 pour les Shorts, 1:1 pour le format carré.',
          },
          {
            title: 'Framerate',
            description: '24, 25, 30, 50 ou 60 fps. Utilisez 60fps pour les contenus gaming ou sports.',
          },
          {
            title: 'Bitrate',
            description: '1080p: 8-12 Mbps, 4K: 35-45 Mbps. Un bitrate trop faible dégrade la qualité.',
          },
          {
            title: 'Audio',
            description: 'AAC stéréo, 48 kHz, 192-320 kbps minimum.',
          },
          {
            title: 'Taille maximale',
            description: '20 GB par vidéo. Pour les fichiers plus volumineux, contactez le support.',
          },
        ],
      },
      {
        title: 'Processus d\'upload',
        steps: [
          {
            title: 'Accéder au Studio Créateur',
            description: 'Cliquez sur votre avatar en haut à droite, puis sur "Studio créateur" dans le menu déroulant.',
          },
          {
            title: 'Démarrer l\'upload',
            description: 'Cliquez sur "Publier" ou faites glisser votre fichier vidéo dans la zone d\'upload. L\'encodage démarre automatiquement.',
          },
          {
            title: 'Remplir les métadonnées',
            description: 'Pendant l\'encodage, remplissez les informations : titre (max 100 caractères), description (max 5000 caractères), tags (max 15), catégorie, et langue principale.',
          },
          {
            title: 'Choisir une miniature',
            description: 'Sélectionnez une des miniatures générées automatiquement ou uploadez votre propre image (1280x720px, JPG/PNG, max 2MB).',
          },
          {
            title: 'Paramètres de monétisation',
            description: 'Choisissez si la vidéo est gratuite, payante (prix entre 0,99€ et 99,99€), ou réservée aux membres de votre chaîne.',
          },
          {
            title: 'Options avancées',
            description: 'Activez/désactivez les commentaires, définissez les restrictions d\'âge si nécessaire, et choisissez la visibilité (publique, non-répertoriée, ou privée).',
          },
          {
            title: 'Publication',
            description: 'Vérifiez tous les paramètres et cliquez sur "Publier". Vous pouvez aussi programmer une publication pour plus tard.',
          },
        ],
      },
      {
        title: 'Optimisation pour le référencement',
        content: [
          'Un bon référencement aide votre vidéo à être découverte. Voici nos conseils :',
        ],
        tips: [
          'Titre : Soyez clair et descriptif. Incluez des mots-clés naturellement.',
          'Description : Les 3 premières lignes sont cruciales. Expliquez le contenu clairement.',
          'Tags : Utilisez des tags spécifiques et pertinents, pas des tags génériques.',
          'Miniature : Utilisez un visuel attrayant avec du texte lisible même en petit.',
          'Engagement : Encouragez les likes, commentaires et partages dans votre vidéo.',
        ],
      },
      {
        title: 'Après la publication',
        content: [
          'Une fois publiée, votre vidéo est traitée et disponible en plusieurs qualités (480p, 720p, 1080p, 4K selon votre upload).',
          'Surveillez vos analytics dans les 48 premières heures pour comprendre comment votre vidéo performe et ajustez votre stratégie si nécessaire.',
        ],
      },
    ],
    relatedArticles: ['video-monetization', 'seo-optimization', 'thumbnail-tips'],
    faqs: [
      {
        q: 'Combien de temps prend l\'encodage ?',
        a: 'Le temps d\'encodage dépend de la taille et de la qualité de votre vidéo. En moyenne : 1080p = 10-15 min, 4K = 30-45 min.',
      },
      {
        q: 'Puis-je modifier ma vidéo après publication ?',
        a: 'Vous pouvez modifier les métadonnées (titre, description, miniature) mais pas le fichier vidéo lui-même. Pour changer la vidéo, vous devez la supprimer et la republier.',
      },
      {
        q: 'Ma vidéo ne s\'affiche pas après publication',
        a: 'L\'encodage peut prendre du temps. Vérifiez le statut dans votre Studio. Si le problème persiste après 2 heures, contactez le support.',
      },
      {
        q: 'Puis-je uploader des vidéos de plus de 20 GB ?',
        a: 'Pour les fichiers très volumineux, contactez notre support créateur qui peut augmenter votre limite temporairement.',
      },
    ],
  },
  'trucoin-usage': {
    id: 'trucoin-usage',
    category: 'Paiements',
    title: 'Utiliser TruCoin - Guide complet',
    lastUpdated: '20 Janvier 2026',
    readTime: '10 min',
    difficulty: 'Intermédiaire',
    sections: [
      {
        title: 'Qu\'est-ce que TruCoin ?',
        content: [
          'TruCoin (TC) est la monnaie virtuelle de Goroti. Elle facilite les achats de contenu, les tips aux créateurs, et les transactions marketplace.',
          '1 TruCoin = 0,01€ (taux fixe, non spéculatif). Ce taux ne varie jamais, garantissant une transparence totale.',
        ],
      },
      {
        title: 'Pourquoi utiliser TruCoin ?',
        content: [
          'TruCoin offre plusieurs avantages par rapport aux paiements directs :',
        ],
        tips: [
          'Transactions instantanées : pas d\'attente bancaire',
          'Frais réduits : pas de frais bancaires sur chaque micro-transaction',
          'Sécurité renforcée : vos coordonnées bancaires ne sont jamais exposées',
          'Bonus sur les packs : achetez en gros pour recevoir des TruCoins gratuits',
          'Simplicité : un seul wallet pour tous vos achats sur la plateforme',
        ],
      },
      {
        title: 'Acheter des TruCoins',
        steps: [
          {
            title: 'Accéder au wallet',
            description: 'Cliquez sur l\'icône TruCoin en haut à droite de votre écran, ou accédez à "Wallet" dans le menu utilisateur.',
          },
          {
            title: 'Choisir un pack',
            description: 'Sélectionnez le pack qui correspond à votre budget. Les packs plus importants offrent des bonus en TruCoins gratuits.',
          },
          {
            title: 'Méthode de paiement',
            description: 'Payez par carte bancaire (Visa, Mastercard, Amex), PayPal, ou virement bancaire (pour les montants > 100€).',
          },
          {
            title: 'Confirmation',
            description: 'Les TruCoins sont crédités instantanément après validation du paiement. Vous recevez un reçu par email.',
          },
        ],
      },
      {
        title: 'Utiliser vos TruCoins',
        content: [
          'Vous pouvez dépenser vos TruCoins de plusieurs façons sur Goroti :',
        ],
        steps: [
          {
            title: 'Acheter du contenu premium',
            description: 'Vidéos, albums, cours exclusifs. Le prix est affiché en TruCoins et en euros. Cliquez sur "Acheter" et confirmez la transaction.',
          },
          {
            title: 'Envoyer des tips',
            description: 'Soutenez vos créateurs préférés avec un tip personnalisé. Montant minimum : 50 TC (0,50€). Ajoutez un message optionnel.',
          },
          {
            title: 'S\'abonner à une chaîne',
            description: 'Les abonnements mensuels peuvent être payés en TruCoins. L\'abonnement se renouvelle automatiquement chaque mois.',
          },
          {
            title: 'Marketplace',
            description: 'Commandez des services créateurs (montage, design, musique). Le montant est bloqué en escrow jusqu\'à validation de la livraison.',
          },
        ],
      },
      {
        title: 'Gérer votre wallet',
        content: [
          'Votre wallet TruCoin offre une vue complète de vos transactions :',
        ],
        tips: [
          'Solde actuel : toujours visible en haut à droite',
          'Historique complet : tous les achats, dépenses et recharges',
          'Transactions en attente : commandes marketplace en escrow',
          'TruCoins offerts : bonus accumulés sur vos achats',
          'Date d\'expiration : les TruCoins achetés expirent après 2 ans',
        ],
      },
      {
        title: 'Sécurité du wallet',
        content: [
          'Votre wallet est protégé par plusieurs couches de sécurité :',
        ],
        tips: [
          'Authentification à deux facteurs recommandée pour les transactions > 50€',
          'Notifications instantanées pour toute dépense',
          'Limite de dépense configurable (protection enfants)',
          'Historique immuable et auditable',
          'Récupération possible en cas d\'achat frauduleux (sous 48h)',
        ],
        warning: 'Les TruCoins achetés ne sont pas remboursables en argent réel. Ils peuvent uniquement être dépensés sur la plateforme.',
      },
      {
        title: 'TruCoins gratuits',
        content: [
          'Vous pouvez gagner des TruCoins gratuits de plusieurs façons :',
        ],
        tips: [
          'Bonus d\'inscription : 100 TC offerts à la création de compte',
          'Parrainage : 200 TC par ami qui crée un compte et achète du contenu',
          'Promotions saisonnières : événements spéciaux avec TruCoins offerts',
          'Bonus fidélité : +5% de TC gratuits tous les 6 mois d\'activité',
          'Concours créateurs : participez aux défis mensuels',
        ],
      },
      {
        title: 'Pour les créateurs',
        content: [
          'Les créateurs reçoivent des TruCoins quand leur contenu est acheté ou via des tips. Ces TruCoins peuvent être convertis en argent réel.',
          'Conversion créateur : Minimum 1000 TC (10€) pour demander un retrait. Les retraits sont traités sous 5-7 jours ouvrés.',
        ],
      },
    ],
    relatedArticles: ['payment-methods', 'creator-withdrawals', 'marketplace-escrow'],
    faqs: [
      {
        q: 'Les TruCoins expirent-ils ?',
        a: 'Les TruCoins achetés expirent 2 ans après la date d\'achat. Les TruCoins gratuits (bonus, promotions) expirent 1 an après réception. Vous recevez un email de rappel 30 jours avant expiration.',
      },
      {
        q: 'Puis-je transférer mes TruCoins à un autre utilisateur ?',
        a: 'Non, les transferts directs entre utilisateurs ne sont pas autorisés pour des raisons de sécurité et de conformité réglementaire. Vous pouvez uniquement envoyer des tips aux créateurs.',
      },
      {
        q: 'Que se passe-t-il si je supprime mon compte ?',
        a: 'Si votre compte a un solde TruCoin positif, celui-ci sera remboursé (moins les frais de traitement) sous 30 jours sur votre moyen de paiement d\'origine.',
      },
      {
        q: 'Puis-je obtenir un reçu fiscal ?',
        a: 'Oui, chaque achat de TruCoins génère un reçu fiscal téléchargeable depuis votre wallet. Ce reçu est nécessaire pour la comptabilité.',
      },
    ],
  },
};

export default function HelpArticlePage({ onNavigate, articleId = 'create-account' }: HelpArticlePageProps) {
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const article = articles[articleId];

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Header onNavigate={onNavigate} showNavigation={true} />
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">Article non trouvé</h1>
          <button
            onClick={() => onNavigate('resources')}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
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

      <div className="max-w-5xl mx-auto px-6 py-12">
        <button
          onClick={() => onNavigate('resources')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux ressources
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-cyan-600/20 text-cyan-400 rounded-lg text-sm">
              {article.category}
            </span>
            <span className={`px-3 py-1 rounded-lg text-sm ${
              article.difficulty === 'Débutant' ? 'bg-green-600/20 text-green-400' :
              article.difficulty === 'Intermédiaire' ? 'bg-yellow-600/20 text-yellow-400' :
              'bg-red-600/20 text-red-400'
            }`}>
              {article.difficulty}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">{article.title}</h1>

          <div className="flex items-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {article.readTime} de lecture
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Mis à jour le {article.lastUpdated}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-12">
          <article className="prose prose-invert max-w-none">
            {article.sections.map((section, index) => (
              <section key={index} className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-4">{section.title}</h2>

                {section.content?.map((paragraph, i) => (
                  <p key={i} className="text-gray-300 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}

                {section.steps && (
                  <div className="space-y-6">
                    {section.steps.map((step, i) => (
                      <div key={i} className="relative pl-12">
                        <div className="absolute left-0 top-0 w-8 h-8 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold">
                          {i + 1}
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                        <p className="text-gray-400">{step.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {section.tips && (
                  <div className="bg-cyan-600/10 border border-cyan-600/30 rounded-xl p-6 my-6">
                    <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-3">
                      <Info className="w-5 h-5" />
                      Conseils
                    </div>
                    <ul className="space-y-2">
                      {section.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-300">
                          <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {section.warning && (
                  <div className="bg-yellow-600/10 border border-yellow-600/30 rounded-xl p-6 my-6">
                    <div className="flex items-center gap-2 text-yellow-400 font-semibold mb-2">
                      <AlertCircle className="w-5 h-5" />
                      Attention
                    </div>
                    <p className="text-gray-300">{section.warning}</p>
                  </div>
                )}
              </section>
            ))}

            <div className="border-t border-gray-800 pt-8 mt-12">
              <h2 className="text-2xl font-bold text-white mb-6">Questions fréquentes</h2>
              <div className="space-y-4">
                {article.faqs.map((faq, index) => (
                  <details key={index} className="bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden">
                    <summary className="px-6 py-4 cursor-pointer hover:bg-gray-800/50 transition-colors font-medium text-white">
                      {faq.q}
                    </summary>
                    <div className="px-6 pb-4 text-gray-400 border-t border-gray-700 pt-4">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 mt-12">
              <h3 className="text-lg font-semibold text-white mb-4">Cet article vous a-t-il été utile ?</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setHelpful(true)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                    helpful === true
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <ThumbsUp className="w-5 h-5" />
                  Oui
                </button>
                <button
                  onClick={() => setHelpful(false)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                    helpful === false
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <ThumbsDown className="w-5 h-5" />
                  Non
                </button>
              </div>
              {helpful !== null && (
                <p className="text-cyan-400 text-sm mt-4">
                  {helpful ? 'Merci pour votre retour !' : 'Nous sommes désolés. Contactez le support pour plus d\'aide.'}
                </p>
              )}
            </div>
          </article>

          <aside className="space-y-6">
            <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-white mb-4">Sur cette page</h3>
              <nav className="space-y-2">
                {article.sections.map((section, index) => (
                  <a
                    key={index}
                    href={`#section-${index}`}
                    className="block text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>

              <div className="border-t border-gray-700 mt-6 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors">
                    <Share2 className="w-4 h-4" />
                    Partager
                  </button>
                  <button className="w-full flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors">
                    <Bookmark className="w-4 h-4" />
                    Sauvegarder
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-700 mt-6 pt-6">
                <h3 className="text-sm font-semibold text-white mb-3">Articles connexes</h3>
                <div className="space-y-2">
                  {article.relatedArticles.slice(0, 3).map((id, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-cyan-400 hover:bg-gray-800/50 rounded transition-colors"
                    >
                      Article connexe {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
