import { useState, useMemo } from 'react';
import Header from '../components/Header';
import { Footer } from '../components/Footer';
import {
  BookOpen, DollarSign, Scale, Cpu, HelpCircle, MessageSquare,
  Mail, Play, Music, Settings, FileText, Globe, Shield, Search,
  ChevronRight, Star, Rss, Activity, UserPlus, Video, CreditCard,
  Wallet, AlertTriangle, ShoppingBag, User, ChevronDown, ChevronUp,
  CheckCircle, Circle, Wrench, Package, Camera, Clock, ArrowRight,
  TrendingUp, Zap, ExternalLink
} from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

type MainTab = 'docs' | 'blog' | 'status';

interface DocArticle {
  id: string;
  title: string;
  summary: string;
  steps: string[];
  tips?: string[];
}

interface DocCategory {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  articles: DocArticle[];
}

const DOC_CATEGORIES: DocCategory[] = [
  {
    id: 'start',
    label: 'Démarrage',
    icon: UserPlus,
    color: 'text-blue-400',
    articles: [
      {
        id: 'create-account',
        title: 'Créer un compte',
        summary: 'Tout ce qu\'il faut savoir pour s\'inscrire sur GOROTI.',
        steps: [
          'Aller sur goroti.tv et cliquer sur "S\'inscrire"',
          'Renseigner votre email et choisir un mot de passe sécurisé',
          'Choisir un nom d\'utilisateur unique (ne peut pas être changé)',
          'Confirmer votre email (vérifier les spams si nécessaire)',
          'Compléter votre profil : photo, bio, localisation',
        ],
        tips: ['Choisissez un nom d\'utilisateur court et mémorable — il sera votre URL.', 'L\'email ne peut pas être changé sans contacter le support.']
      },
      {
        id: 'create-channel',
        title: 'Créer une chaîne',
        summary: 'Lancer votre espace créateur ou artiste sur GOROTI.',
        steps: [
          'Connectez-vous et aller dans votre profil > "Mes chaînes"',
          'Cliquer sur "Créer une nouvelle chaîne"',
          'Choisir le type : Créateur, Artiste, Label, Studio, Marque',
          'Ajouter un nom de chaîne, une description et une bannière',
          'Configurer l\'URL personnalisée de la chaîne',
          'Choisir l\'univers principal de la chaîne (musique, gaming, tech…)',
        ],
        tips: ['Une chaîne peut avoir plusieurs univers mais en avoir un principal améliore la visibilité.']
      },
      {
        id: 'verify-identity',
        title: 'Vérifier son identité (KYC)',
        summary: 'La vérification est nécessaire pour activer les paiements et les retraits.',
        steps: [
          'Aller dans Paramètres > Vérification d\'identité',
          'Choisir le type de document : CNI, passeport ou titre de séjour',
          'Photographier le recto et verso du document en bonne résolution',
          'Prendre une selfie avec l\'instruction affichée à l\'écran',
          'Patienter 24-48h pour la validation (résultat par email)',
        ],
        tips: ['Les documents doivent être en cours de validité.', 'La vérification est requise pour tout retrait ou réception de paiement.']
      },
      {
        id: 'first-content',
        title: 'Publier ses premiers contenus',
        summary: 'Les étapes pour uploader et rendre visible votre premier contenu.',
        steps: [
          'Aller dans Créateur Studio > "Nouvel upload"',
          'Glisser-déposer le fichier vidéo (MP4 H.264 recommandé)',
          'Pendant l\'encodage, remplir titre, description et tags',
          'Choisir la vignette : automatique ou personnalisée',
          'Définir la visibilité : public, non-listé, réservé aux abonnés ou payant',
          'Cliquer sur "Publier" ou planifier une date de publication',
        ],
        tips: ['Préparez votre vignette à l\'avance — c\'est l\'élément n°1 pour le taux de clic.']
      },
    ]
  },
  {
    id: 'creators',
    label: 'Créateurs',
    icon: Video,
    color: 'text-red-400',
    articles: [
      {
        id: 'publish-video',
        title: 'Publier une vidéo',
        summary: 'Guide complet pour uploader, configurer et optimiser une vidéo.',
        steps: [
          'Dans Créateur Studio, cliquer sur "Nouvelle vidéo"',
          'Upload du fichier (max 20 Go, MP4/MOV/WebM acceptés)',
          'Titre optimisé : mot-clé principal en premier',
          'Description détaillée avec chapitres (00:00 Intro, 02:30 Partie 1...)',
          'Tags : 5 à 15 tags pertinents',
          'Sélectionner l\'univers et les sous-univers',
          'Ajouter des liens d\'affiliation si applicable',
          'Configurer les cartes et écrans de fin',
        ],
      },
      {
        id: 'sell-album',
        title: 'Vendre un album',
        summary: 'Publier et vendre un album ou EP sur GOROTI Music.',
        steps: [
          'Créateur Studio > "Nouvelle release"',
          'Choisir le type : Album, EP, Single, Mixtape',
          'Uploader les pistes audio (WAV/FLAC pour la qualité master)',
          'Définir pochette (3000×3000px min), tracklist et crédits',
          'Configurer : prix de vente, streaming seul, ou les deux',
          'Définir les splits de royalties entre collaborateurs',
          'Planifier la date de sortie ou publier immédiatement',
        ],
      },
      {
        id: 'configure-royalties',
        title: 'Configurer les royalties',
        summary: 'Gérer les droits et répartitions entre artistes et collaborateurs.',
        steps: [
          'Ouvrir la release ou le contenu concerné',
          'Onglet "Monétisation" > "Gestion des royalties"',
          'Ajouter chaque collaborateur (nom GOROTI ou email)',
          'Affecter un pourcentage à chacun (total = 100%)',
          'Chaque collaborateur reçoit une notification et doit accepter',
          'Les paiements sont automatiquement distribués selon les splits',
        ],
        tips: ['Les splits s\'appliquent à tous les revenus futurs. Modifier un split n\'affecte pas les transactions passées.']
      },
      {
        id: 'member-subscription',
        title: 'Abonnement membres',
        summary: 'Créer des tiers d\'abonnement payants pour vos fans.',
        steps: [
          'Chaîne > Monétisation > Abonnements',
          'Créer de 1 à 5 tiers (ex : Supporter 3€, Fan 7€, Super Fan 15€)',
          'Pour chaque tier : définir nom, prix, avantages et contenu accessible',
          'Activer une période d\'essai gratuite (7 ou 14 jours recommandé)',
          'Vos abonnés reçoivent un badge coloré sur leur profil',
        ],
        tips: ['Communiquez chaque mois sur les avantages pour réduire le churn.']
      },
      {
        id: 'merchandising',
        title: 'Merchandising',
        summary: 'Vendre des produits physiques et numériques depuis votre chaîne.',
        steps: [
          'Créateur Studio > Boutique > "Ajouter un produit"',
          'Produit physique : print-on-demand (intégration Printful disponible)',
          'Produit numérique : uploader le fichier — livraison automatique',
          'Configurer prix, stock (infini pour digital), images produit',
          'Activer la section "Boutique" sur votre page chaîne',
        ],
      },
      {
        id: 'shorts-promo',
        title: 'Shorts & promotion',
        summary: 'Utiliser les formats courts pour augmenter votre visibilité.',
        steps: [
          'Uploader une vidéo verticale < 60 secondes et cocher "Format Short"',
          'Les Shorts sont distribués dans le feed dédié avec algorithme séparé',
          'Ajouter un CTA visible vers une vidéo longue ou une release',
          'Publier régulièrement : 3 à 5 Shorts / semaine pour la croissance',
        ],
      },
    ]
  },
  {
    id: 'payments',
    label: 'Paiements & Wallet',
    icon: Wallet,
    color: 'text-green-400',
    articles: [
      {
        id: 'buy-content',
        title: 'Acheter du contenu',
        summary: 'Comment acheter, accéder et télécharger du contenu payant.',
        steps: [
          'Cliquer sur "Acheter" ou "Débloquer" sur le contenu',
          'Choisir le mode de paiement : carte, PayPal ou TruCoin',
          'Confirmer l\'achat — accès immédiat au contenu',
          'Retrouver vos achats dans Profil > Bibliothèque',
        ],
      },
      {
        id: 'trucoin',
        title: 'Utiliser le TruCoin',
        summary: 'La monnaie virtuelle de GOROTI — pour tips et achats.',
        steps: [
          'Aller dans Wallet > Acheter des TruCoins',
          '1 TruCoin = 0,01€ (packs disponibles : 500, 1000, 5000 TC)',
          'Envoyer des TruCoins via le bouton "Tip" sur une vidéo ou un profil',
          'Les TruCoins reçus apparaissent dans votre Wallet créateur',
          'Conversion TruCoin → € disponible avec un frais fixe minimal',
        ],
        tips: ['Les TruCoins achetés ont une durée de validité de 2 ans.']
      },
      {
        id: 'withdrawals',
        title: 'Retraits',
        summary: 'Comment retirer vos gains vers votre compte bancaire.',
        steps: [
          'Vérifier que votre KYC est validé (obligatoire)',
          'Aller dans Wallet > Retirer des fonds',
          'Choisir le montant (seuil minimum : 10€)',
          'Sélectionner le mode : virement SEPA (gratuit) ou PayPal',
          'Confirmer avec votre code 2FA si activé',
          'Le virement arrive sous 3 à 5 jours ouvrés',
        ],
        tips: ['Les retraits sont traités chaque lundi. Une demande faite le mardi partira lundi suivant.']
      },
      {
        id: 'thresholds',
        title: 'Seuils et délais',
        summary: 'Comprendre les seuils de retrait et délais de traitement.',
        steps: [
          'Seuil minimum retrait : 10€',
          'Fréquence maximale : 1 retrait par semaine',
          'Les revenus des ventes sont disponibles 48h après la transaction',
          'Les revenus des abonnements sont disponibles le 1er du mois suivant',
          'Les tips sont disponibles immédiatement',
        ],
      },
    ]
  },
  {
    id: 'security',
    label: 'Sécurité & droits',
    icon: Shield,
    color: 'text-red-400',
    articles: [
      {
        id: 'copyright',
        title: 'Droits d\'auteur & copyright',
        summary: 'Ce que vous pouvez et ne pouvez pas publier sur GOROTI.',
        steps: [
          'Vous devez posséder les droits sur TOUT contenu que vous publiez',
          'Musique : droits d\'auteur + droits voisins nécessaires',
          'Extraits tiers : obtenir une licence ou s\'assurer du fair use',
          'Covers musicaux : obtenir une licence mécanique',
          'Visuels : images libres de droits ou avec licence explicite',
        ],
        tips: ['En cas de doute, ne publiez pas. Contactez notre équipe droits avant.']
      },
      {
        id: 'reporting',
        title: 'Signalement de contenu',
        summary: 'Signaler un contenu qui enfreint les règles ou vos droits.',
        steps: [
          'Cliquer sur "..." sur le contenu puis "Signaler"',
          'Choisir la catégorie : copyright, harcèlement, faux, autre',
          'Pour copyright : sélectionner "Violation de mes droits"',
          'Fournir le lien de l\'original et une preuve de propriété',
          'Notre équipe examine sous 24h ouvrées',
        ],
      },
      {
        id: 'contestation',
        title: 'Contester un retrait',
        summary: 'Votre contenu a été retiré ? Comment contester la décision.',
        steps: [
          'Aller dans Créateur Studio > Violations > "Contester"',
          'Remplir le formulaire avec la justification légale',
          'Joindre les preuves : contrats, licences, actes d\'achat',
          'Notre équipe traite la contestation sous 72h ouvrées',
          'En cas de refus, une médiation externe est disponible',
        ],
        tips: ['Les fausses contestations peuvent entraîner la suspension du compte.']
      },
      {
        id: 'content-removal',
        title: 'Supprimer du contenu',
        summary: 'Comment supprimer définitivement vos contenus publiés.',
        steps: [
          'Créateur Studio > Vos contenus > Sélectionner le contenu',
          'Cliquer sur "Supprimer" puis confirmer',
          'La suppression est permanente après 30 jours (période de grâce)',
          'Les acheteurs du contenu gardent leur accès pendant 90 jours après suppression',
        ],
      },
    ]
  },
  {
    id: 'marketplace',
    label: 'Marketplace',
    icon: ShoppingBag,
    color: 'text-yellow-400',
    articles: [
      {
        id: 'order-service',
        title: 'Commander un service',
        summary: 'Passer une commande sur la marketplace GOROTI.',
        steps: [
          'Aller dans Marketplace et parcourir les offres',
          'Filtrer par catégorie : mixage, graphisme, coaching, production...',
          'Cliquer sur "Commander" sur l\'offre choisie',
          'Remplir le brief et définir la date de livraison',
          'Le paiement est mis en séquestre (escrow) jusqu\'à livraison',
          'Valider la livraison ou demander une révision',
        ],
        tips: ['Le paiement n\'est libéré au prestataire qu\'après votre validation.']
      },
      {
        id: 'deliver-work',
        title: 'Livrer un travail',
        summary: 'Soumettre votre livrable en tant que prestataire.',
        steps: [
          'Aller dans Marketplace > Mes commandes actives',
          'Uploader les fichiers livrables dans la commande',
          'Ajouter un message explicatif au client',
          'Soumettre — le client a 5 jours pour accepter ou demander révision',
          'Sans réponse après 5 jours, la livraison est automatiquement validée',
        ],
      },
      {
        id: 'escrow-dispute',
        title: 'Litiges escrow',
        summary: 'Résoudre un désaccord sur une commande marketplace.',
        steps: [
          'Si le client refuse la livraison injustement, ouvrir un litige',
          'Aller dans la commande > "Ouvrir un litige"',
          'Fournir les preuves : fichiers livrés, échanges, scope initial',
          'Un médiateur GOROTI intervient sous 48h',
          'La décision du médiateur est définitive et libère ou rembourse l\'escrow',
        ],
      },
    ]
  },
  {
    id: 'account',
    label: 'Compte',
    icon: User,
    color: 'text-orange-400',
    articles: [
      {
        id: 'password',
        title: 'Changer son mot de passe',
        summary: 'Modifier ou réinitialiser votre mot de passe.',
        steps: [
          'Paramètres > Sécurité > "Changer le mot de passe"',
          'Entrer votre mot de passe actuel pour confirmer',
          'Choisir un nouveau mot de passe (12+ caractères recommandé)',
          'Activer l\'authentification à deux facteurs pour plus de sécurité',
        ],
      },
      {
        id: 'account-recovery',
        title: 'Récupérer son compte',
        summary: 'Vous ne pouvez plus vous connecter ? Procédure de récupération.',
        steps: [
          'Page de connexion > "Mot de passe oublié"',
          'Entrer l\'email associé au compte',
          'Ouvrir l\'email de réinitialisation (vérifier les spams)',
          'Si l\'email n\'est plus accessible, contacter support@goroti.tv',
          'Fournir une pièce d\'identité et preuve de propriété du compte',
        ],
      },
      {
        id: 'delete-account',
        title: 'Supprimer son compte',
        summary: 'Demander la suppression définitive de votre compte.',
        steps: [
          'Paramètres > Confidentialité > "Supprimer mon compte"',
          'Lire les conséquences (contenu supprimé, gains transférés)',
          'Retirer tous les gains avant la suppression',
          'Confirmer avec votre mot de passe',
          'Le compte est désactivé immédiatement, supprimé définitivement sous 30 jours',
        ],
        tips: ['La suppression est irréversible après 30 jours. Assurez-vous d\'avoir exporté vos données.']
      },
      {
        id: 'privacy',
        title: 'Confidentialité',
        summary: 'Gérer qui voit quoi sur votre profil et vos activités.',
        steps: [
          'Paramètres > Confidentialité',
          'Choisir qui peut voir votre profil : tous, abonnés, personne',
          'Activer/désactiver l\'historique de visionnage',
          'Gérer les autorisations de suivi et de recommandation',
          'Télécharger vos données (droit RGPD) depuis cette section',
        ],
      },
    ]
  },
];

const BLOG_POSTS = [
  {
    id: 1,
    category: 'Produit',
    categoryColor: 'text-blue-400 bg-blue-400/10',
    title: 'GOROTI Studio V3 : le nouveau tableau de bord créateur',
    excerpt: 'Découvrez les nouvelles fonctionnalités du studio créateur : analytics avancés, gestion des royalties simplifiée et nouvelle interface d\'upload.',
    date: '14 févr. 2026',
    readTime: '4 min',
    author: 'Équipe Produit',
  },
  {
    id: 2,
    category: 'Créateurs',
    categoryColor: 'text-red-400 bg-red-400/10',
    title: 'Comment doubler vos revenus d\'abonnement en 90 jours',
    excerpt: 'Analyse de 500 créateurs GOROTI : les stratégies qui fonctionnent vraiment pour convertir vos spectateurs en abonnés payants.',
    date: '10 févr. 2026',
    readTime: '8 min',
    author: 'Léa Martin',
  },
  {
    id: 3,
    category: 'Industrie',
    categoryColor: 'text-purple-400 bg-purple-400/10',
    title: 'L\'économie des créateurs en 2026 : les chiffres clés',
    excerpt: 'Le marché mondial de l\'économie créative dépasse 200 milliards. Où se positionne GOROTI et quelles opportunités pour les artistes indépendants ?',
    date: '7 févr. 2026',
    readTime: '6 min',
    author: 'Research Team',
  },
  {
    id: 4,
    category: 'Plateforme',
    categoryColor: 'text-green-400 bg-green-400/10',
    title: 'Mise à jour sécurité : nouveaux protocoles anti-fraude',
    excerpt: 'Nous avons renforcé notre système de détection de fraude sur les vues et les transactions. Détails techniques de la mise à jour 4.2.',
    date: '3 févr. 2026',
    readTime: '3 min',
    author: 'Équipe Sécurité',
  },
  {
    id: 5,
    category: 'Partenaires',
    categoryColor: 'text-yellow-400 bg-yellow-400/10',
    title: 'Partenariat avec 3 distributeurs musicaux indépendants',
    excerpt: 'GOROTI s\'associe avec DistroKid, TuneCore et Believe pour simplifier la distribution multi-plateforme depuis le studio créateur.',
    date: '28 janv. 2026',
    readTime: '2 min',
    author: 'Partenariats',
  },
  {
    id: 6,
    category: 'Créateurs',
    categoryColor: 'text-red-400 bg-red-400/10',
    title: 'Shorts : 6 mois après le lancement — ce que les données nous disent',
    excerpt: 'Analyse des métriques de croissance des créateurs qui ont adopté les Shorts. Les formats courts génèrent 3x plus de nouveaux abonnés.',
    date: '22 janv. 2026',
    readTime: '5 min',
    author: 'Data Team',
  },
];

const BLOG_CATEGORIES = ['Tous', 'Produit', 'Créateurs', 'Industrie', 'Plateforme', 'Partenaires'];

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'incident' | 'maintenance';
  latency?: string;
}

const SERVICES: ServiceStatus[] = [
  { name: 'Streaming vidéo', status: 'operational', latency: '42ms' },
  { name: 'Upload & encodage', status: 'operational', latency: '—' },
  { name: 'Paiements', status: 'operational', latency: '120ms' },
  { name: 'Retraits', status: 'degraded' },
  { name: 'Marketplace', status: 'maintenance' },
  { name: 'Live streaming', status: 'operational', latency: '38ms' },
  { name: 'API partenaires', status: 'operational', latency: '75ms' },
  { name: 'CDN & images', status: 'operational', latency: '18ms' },
];

const INCIDENTS = [
  {
    date: '12 févr. 2026',
    service: 'Retraits',
    duration: '4h 30min',
    cause: 'Délai de traitement chez le partenaire bancaire PSP suite à une maintenance non planifiée.',
    resolution: 'Les retraits en attente ont été traités en priorité. Nouveau fournisseur de backup activé.',
    status: 'résolu',
  },
  {
    date: '8 févr. 2026',
    service: 'Upload',
    duration: '1h 12min',
    cause: 'Saturation du cluster d\'encodage suite à un pic de trafic inattendu (+300%).',
    resolution: 'Auto-scaling activé. Capacité d\'encodage doublée pour prévenir la récurrence.',
    status: 'résolu',
  },
  {
    date: '1 févr. 2026',
    service: 'Paiements',
    duration: '22min',
    cause: 'Timeout intermittent sur les transactions Stripe dû à une mise à jour API côté Stripe.',
    resolution: 'Fallback activé vers le processeur secondaire. Aucune transaction perdue.',
    status: 'résolu',
  },
];

function StatusBadge({ status }: { status: ServiceStatus['status'] }) {
  const config = {
    operational: { label: 'Opérationnel', color: 'text-green-400 bg-green-400/10 border-green-400/20' },
    degraded: { label: 'Dégradé', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
    incident: { label: 'Incident', color: 'text-red-400 bg-red-400/10 border-red-400/20' },
    maintenance: { label: 'Maintenance', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  }[status];

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
      {config.label}
    </span>
  );
}

function ArticleItem({ article }: { article: DocArticle }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-900/30 transition-colors"
      >
        <div>
          <div className="font-medium text-white text-sm">{article.title}</div>
          <div className="text-gray-500 text-xs mt-0.5">{article.summary}</div>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-gray-500 shrink-0 ml-4" />
          : <ChevronDown className="w-4 h-4 text-gray-500 shrink-0 ml-4" />}
      </button>
      {open && (
        <div className="border-t border-gray-800 px-5 py-5 space-y-4">
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Étapes</h4>
            <ol className="space-y-2.5">
              {article.steps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500/20 text-red-400 text-xs flex items-center justify-center font-bold">{i + 1}</span>
                  <span className="text-gray-300 leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
          {article.tips && article.tips.length > 0 && (
            <div className="p-3 bg-red-900/20 border border-red-800/30 rounded-lg space-y-1.5">
              {article.tips.map((tip, i) => (
                <p key={i} className="text-red-300 text-xs flex gap-2">
                  <Zap className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  {tip}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ResourcesPage({ onNavigate }: Props) {
  const [mainTab, setMainTab] = useState<MainTab>('docs');
  const [selectedCat, setSelectedCat] = useState<string>('start');
  const [blogCategory, setBlogCategory] = useState('Tous');
  const [search, setSearch] = useState('');

  const currentCategory = DOC_CATEGORIES.find(c => c.id === selectedCat);

  const filteredArticles = useMemo(() => {
    if (!currentCategory) return [];
    if (!search) return currentCategory.articles;
    const q = search.toLowerCase();
    return currentCategory.articles.filter(
      a => a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q)
    );
  }, [currentCategory, search]);

  const filteredBlog = blogCategory === 'Tous'
    ? BLOG_POSTS
    : BLOG_POSTS.filter(p => p.category === blogCategory);

  const allOperational = SERVICES.every(s => s.status === 'operational');
  const hasIssues = SERVICES.some(s => s.status === 'incident' || s.status === 'degraded');

  return (
    <div className="min-h-screen bg-gray-950">
      <Header onNavigate={onNavigate} showNavigation={true} />

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-950 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-sm mb-5">
                <BookOpen className="w-4 h-4" />
                Ressources GOROTI
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Documentation, blog & statuts
              </h1>
              <p className="text-gray-400 max-w-xl">
                Tout ce qu'il faut pour comprendre, utiliser et optimiser GOROTI — en un seul endroit.
              </p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium ${
              hasIssues
                ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                : 'bg-green-500/10 border-green-500/20 text-green-400'
            }`}>
              <Circle className={`w-2 h-2 rounded-full ${hasIssues ? 'bg-yellow-400' : 'bg-green-400'}`} />
              {hasIssues ? 'Perturbations en cours' : 'Tous les services opérationnels'}
            </div>
          </div>
        </div>
      </div>

      {/* Main tabs */}
      <div className="border-b border-gray-800 bg-gray-950 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-1">
            {([
              { id: 'docs' as MainTab, label: 'Documentation', icon: BookOpen },
              { id: 'blog' as MainTab, label: 'Blog', icon: Rss },
              { id: 'status' as MainTab, label: 'Statuts plateforme', icon: Activity },
            ]).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setMainTab(id)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-colors ${
                  mainTab === id
                    ? 'border-red-500 text-white'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* ===== DOCS ===== */}
        {mainTab === 'docs' && (
          <div className="flex gap-6">
            {/* Sidebar */}
            <aside className="w-52 shrink-0 hidden md:block">
              <div className="sticky top-20 space-y-1">
                {DOC_CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCat(cat.id); setSearch(''); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                        selectedCat === cat.id
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-900'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${cat.color}`} />
                      {cat.label}
                      <span className="ml-auto text-xs text-gray-600">{cat.articles.length}</span>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Mobile category selector */}
            <div className="md:hidden w-full">
              <div className="flex overflow-x-auto gap-2 pb-2 mb-4">
                {DOC_CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCat(cat.id); setSearch(''); }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${
                        selectedCat === cat.id ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {currentCategory && (
                <>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 bg-gray-800 rounded-lg">
                      <currentCategory.icon className={`w-5 h-5 ${currentCategory.color}`} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">{currentCategory.label}</h2>
                      <p className="text-gray-500 text-sm">{currentCategory.articles.length} articles</p>
                    </div>
                    <div className="ml-auto relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                      <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Rechercher..."
                        className="pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-red-500 w-44"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    {filteredArticles.length > 0
                      ? filteredArticles.map(article => <ArticleItem key={article.id} article={article} />)
                      : (
                        <div className="text-center py-12 text-gray-600">
                          <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          Aucun résultat pour "{search}"
                        </div>
                      )
                    }
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ===== BLOG ===== */}
        {mainTab === 'blog' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Blog officiel GOROTI</h2>
                <p className="text-gray-500 text-sm mt-0.5">Actualités, guides et analyses de l'équipe</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors">
                <Rss className="w-4 h-4" />
                S'abonner au flux RSS
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-7">
              {BLOG_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setBlogCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    blogCategory === cat
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredBlog.map(post => (
                <article
                  key={post.id}
                  className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${post.categoryColor}`}>
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1 text-gray-600 text-xs">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </div>
                  </div>
                  <h3 className="font-semibold text-white mb-2 group-hover:text-red-400 transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4 leading-relaxed line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{post.author}</span>
                    <span>{post.date}</span>
                  </div>
                </article>
              ))}
            </div>

            {filteredBlog.length === 0 && (
              <div className="text-center py-16 text-gray-600">
                Aucun article dans cette catégorie.
              </div>
            )}

            <div className="mt-8 text-center">
              <button className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-medium mx-auto transition-colors">
                Voir tous les articles
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ===== STATUS ===== */}
        {mainTab === 'status' && (
          <div>
            {/* Global status banner */}
            <div className={`mb-8 p-5 rounded-xl border flex items-center gap-4 ${
              hasIssues
                ? 'bg-yellow-500/10 border-yellow-500/20'
                : 'bg-green-500/10 border-green-500/20'
            }`}>
              {hasIssues
                ? <AlertTriangle className="w-6 h-6 text-yellow-400 shrink-0" />
                : <CheckCircle className="w-6 h-6 text-green-400 shrink-0" />
              }
              <div>
                <div className={`font-semibold ${hasIssues ? 'text-yellow-300' : 'text-green-300'}`}>
                  {hasIssues ? 'Perturbations en cours sur certains services' : 'Tous les systèmes opérationnels'}
                </div>
                <div className="text-gray-400 text-sm">
                  Mis à jour le {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} à {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>

            {/* Services grid */}
            <div className="mb-10">
              <h2 className="text-lg font-bold text-white mb-4">État des services</h2>
              <div className="border border-gray-800 rounded-xl overflow-hidden">
                {SERVICES.map((service, i) => (
                  <div
                    key={service.name}
                    className={`flex items-center justify-between px-5 py-4 ${
                      i < SERVICES.length - 1 ? 'border-b border-gray-800' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        service.status === 'operational' ? 'bg-green-400' :
                        service.status === 'degraded' ? 'bg-yellow-400' :
                        service.status === 'incident' ? 'bg-red-400' :
                        'bg-blue-400'
                      }`} />
                      <span className="text-white text-sm font-medium">{service.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      {service.latency && (
                        <span className="text-gray-600 text-xs font-mono">{service.latency}</span>
                      )}
                      <StatusBadge status={service.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Uptime visual (last 30 days) */}
            <div className="mb-10">
              <h2 className="text-lg font-bold text-white mb-4">Disponibilité — 30 derniers jours</h2>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-7 rounded-sm ${
                        i === 18 ? 'bg-yellow-500/70' :
                        i === 22 ? 'bg-yellow-500/70' :
                        i === 28 ? 'bg-blue-500/50' :
                        'bg-green-500/70'
                      }`}
                      title={`Jour ${30 - i}`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Il y a 30 jours</span>
                  <span className="text-gray-400 font-medium">99.1% de disponibilité</span>
                  <span>Aujourd'hui</span>
                </div>
              </div>
            </div>

            {/* Incidents */}
            <div>
              <h2 className="text-lg font-bold text-white mb-4">Historique des incidents</h2>
              <div className="space-y-4">
                {INCIDENTS.map((incident, i) => (
                  <div key={i} className="border border-gray-800 rounded-xl p-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="font-semibold text-white">{incident.service}</div>
                        <div className="text-gray-500 text-sm">{incident.date}</div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-gray-500 text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {incident.duration}
                        </span>
                        <span className="px-2.5 py-1 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full text-xs">
                          {incident.status}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-500 text-xs uppercase tracking-wider">Cause :</span>
                        <p className="text-gray-400 mt-0.5">{incident.cause}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs uppercase tracking-wider">Résolution :</span>
                        <p className="text-gray-400 mt-0.5">{incident.resolution}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
